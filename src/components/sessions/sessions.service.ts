import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common'
import {
    StopSession,
    StartSession,
    StopSessionResponse,
    AddImage,
    SubmitFeedback,
} from './types'
import { Feedback, Location, Session, User } from '../../common/entities'
import { LocationsService } from '../locations/locations.service'
import { UsersService } from '../users/users.service'
import { LocationsRepository } from '../../data/repositories/locations.repository'
import { UsersRepository } from '../../data/repositories/users.repository'
import { CalculatorService } from '../../common/providers/calculator.service'
import { SessionsRepository } from '../../data/repositories/sessions.repository'
import { Constants } from '../../common/constants'
import { Config } from '../../common/providers/config.service'
import { GcpStorageService } from '../../common/services/gcp/storage/storage.service'
import { FeedbackRepository } from '../../data/repositories/feedback.repository'

/**
 * Service for managing user sessions, including starting and stopping sessions,
 * handling session images, feedback, and session history.
 */
@Injectable()
export class SessionsService {
    constructor(
        private readonly locationService: LocationsService,
        private readonly userService: UsersService,
        private readonly locationsRepository: LocationsRepository,
        private readonly usersRepository: UsersRepository,
        private readonly sessionsRepository: SessionsRepository,
        private readonly feedbackRepository: FeedbackRepository,
        private readonly calculatorService: CalculatorService,
        private readonly gcpStorageService: GcpStorageService,
        private readonly config: Config
    ) {}

    /**
     * Starts a session for a user at a specific location.
     * Updates the location and user to reflect the active session.
     *
     * @param locationId - The ID of the location where the session starts.
     * @param data - The session start data (userId, startTime, startDate).
     * @returns The updated location object.
     */
    async startSession(
        locationId: string,
        data: StartSession
    ): Promise<Location> {
        let location: Location =
            await this.locationService.getLocationById(locationId)

        if (!location) {
            throw new NotFoundException(
                `Location with ID ${locationId} does not exist.`
            )
        }
        const user: User = await this.userService.getUserById(data.userId)

        if (!user) {
            throw new NotFoundException(
                `User with ID ${data.userId} does not exist.`
            )
        }

        location = await this.locationsRepository.updateLocationById(
            location.id,
            {
                occupied: true,
                user: data.userId,
                startTime: data.startTime,
                startDate: data.startDate,
            }
        )
        await this.usersRepository.updateUserById(user.id, {
            locationInUse: locationId,
        })
        return location
    }

    /**
     * Stops an active session at a location for a user.
     * Calculates total time and price, saves the session, and resets location and user.
     *
     * @param locationId - The ID of the location where the session is stopped.
     * @param data - The session stop data (userId, stopTime, stopDate).
     * @returns An object containing the saved session and updated user.
     */
    async stopSession(
        locationId: string,
        data: StopSession
    ): Promise<StopSessionResponse> {
        let location: Location =
            await this.locationService.getLocationById(locationId)
        if (!location?.occupied || !location?.user) {
            throw new NotFoundException(
                `Location with ID ${locationId} is not occupied.`
            )
        }
        let user: User = await this.userService.getUserById(data.userId)
        const totalTimeInUse = this.calculatorService.calculateTotalTime(
            location.startTime,
            data.stopTime
        )
        const totalPrice =
            this.calculatorService.calculateTotalPrice(totalTimeInUse)
        const session = await this.saveSession(user, location, {
            startDate: location.startDate,
            stopDate: data.stopDate,
            totalTimeInUse:
                totalTimeInUse.minutes + ':' + totalTimeInUse.seconds,
            totalPrice,
        })
        location = await this.resetLocation(location)
        user = await this.resetUser(user)
        // this is to format response for the transactions history screen
        location.sessions = undefined
        session.location = location
        return { session, user }
    }

    /**
     * Saves a session record to the database and updates user and location session lists.
     *
     * @param user - The user participating in the session.
     * @param location - The location of the session.
     * @param sessionData - The session details (start/stop time, price, etc).
     * @returns The saved session object.
     */
    async saveSession(
        user: User,
        location: Location,
        sessionData: any
    ): Promise<Session> {
        let session: Session = {
            sessionStartTime: sessionData.startDate,
            sessionStopTime: sessionData.stopDate,
            totalTimeInUse: sessionData.totalTimeInUse,
            totalPrice: sessionData.totalPrice,
            user: user.id,
            location: location.id,
        }

        session = await this.sessionsRepository.createSession(session)
        ;(user.sessions as string[]).push(session.id)
        ;(location.sessions as string[]).push(session.id)

        await this.usersRepository.updateUserById(user.id, {
            sessions: user.sessions,
        })
        await this.locationsRepository.updateLocationById(location.id, {
            sessions: location.sessions,
        })
        return session
    }

    /**
     * Resets the user's session-related fields after a session ends.
     * Increments the user's total uses.
     *
     * @param user - The user to reset.
     * @returns The updated user object.
     */
    async resetUser(user: User): Promise<User> {
        user.totalUses = (user.totalUses || 0) + 1
        return await this.usersRepository.updateUserById(user.id, {
            locationInUse: null,
            openedLocation: null,
            totalUses: user.totalUses,
        })
    }

    /**
     * Resets the location's session-related fields after a session ends.
     * Increments the location's total uses.
     *
     * @param location - The location to reset.
     * @returns The updated location object.
     */
    async resetLocation(location: Location): Promise<Location> {
        location.totalUses = (location.totalUses || 0) + 1
        return await this.locationsRepository.updateLocationById(location.id, {
            occupied: false,
            user: null,
            startTime: null,
            startDate: null,
            totalUses: location.totalUses,
        })
    }

    /**
     * Adds a PAWD image to a session if one does not already exist.
     * Uploads the image to Google Cloud Storage and updates the session with the image URL.
     *
     * @param data - Object containing the session ID and base64-encoded image.
     * @returns The updated session with the image URL.
     * @throws {ConflictException} If the session already has an image.
     */
    async addPawdImageToSession(data: AddImage): Promise<Session> {
        const { sessionId, image } = data
        let session: Session = await this.getSessionById(sessionId)
        if (session.image) {
            throw new ConflictException(
                `Image for session with ID ${sessionId} already exists.`
            )
        }
        const base64Data = image.replace(/^data:image\/\w+;base64,/, '')
        const buffer = Buffer.from(base64Data, 'base64')
        const gcpFileUrl = await this.gcpStorageService.uploadFile(
            this.config.gcpBucketName,
            Constants.gcpBucketSessionsPawdImagesFolder +
                sessionId +
                Constants.imageFormat,
            buffer,
            Constants.imageContentType
        )
        session = await this.sessionsRepository.updateSessionById(session.id, {
            image: gcpFileUrl,
        })
        return session
    }

    /**
     * Retrieves a session by its ID.
     *
     * @param sessionId - The ID of the session to retrieve.
     * @returns The session object.
     * @throws {NotFoundException} If the session does not exist.
     */
    async getSessionById(sessionId: string): Promise<Session> {
        const session = await this.sessionsRepository.getSessionById(sessionId)
        if (!session) {
            throw new NotFoundException(
                `Session with ID ${sessionId} does not exist.`
            )
        }
        return session
    }

    /**
     * Submits feedback for a session if feedback does not already exist.
     *
     * @param sessionId - The ID of the session to add feedback to.
     * @param data - The feedback data to submit.
     * @returns The created feedback object.
     * @throws {ConflictException} If feedback already exists for the session.
     */
    async submitFeedback(
        sessionId: string,
        data: SubmitFeedback
    ): Promise<Feedback> {
        const session = await this.getSessionById(sessionId)
        if (session.feedback) {
            throw new ConflictException(
                `Feedback for session with ID ${sessionId} already exists.`
            )
        }
        let feedback: Feedback = {
            sessionId: session.id,
            user: session.user as string,
            ...data,
        }
        feedback = await this.feedbackRepository.createFeedback(feedback)
        await this.sessionsRepository.updateSessionById(session.id, {
            feedback: feedback.id,
        })
        return feedback
    }

    /**
     * Retrieves the session history for a user.
     *
     * @param userId - The ID of the user whose session history is requested.
     * @returns An array of session objects.
     * @throws {NotFoundException} If no sessions are found for the user.
     */
    async getUserSessionsHistory(userId: string): Promise<Session[]> {
        const sessions =
            await this.sessionsRepository.getUserSessionsHistory(userId)

        if (!sessions || sessions.length === 0) {
            throw new NotFoundException(`No sessions found for user ${userId}.`)
        }
        return sessions
    }
}
