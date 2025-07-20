import { Injectable } from '@nestjs/common'
import { StartSession } from './types'
import { Location, User } from '../../common/entities'
import { LocationsService } from '../locations/locations.service'
import { UsersService } from '../users/users.service'
import { LocationsRepository } from '../../data/repositories/locations.repository'
import { UsersRepository } from '../../data/repositories/users.repository'

@Injectable()
export class SessionsService {
    constructor(
        private readonly locationService: LocationsService,
        private readonly userService: UsersService,
        private readonly locationsRepository: LocationsRepository,
        private readonly usersRepository: UsersRepository
    ) {}

    async startSession(locationId: string, data: StartSession) {
        const location: Location =
            await this.locationService.getLocationById(locationId)
        const user: User = await this.userService.getUserById(data.userId)
        location.occupied = true
        location.user = data.userId
        location.startTime = data.startTime
        location.startDate = data.startDate
        user.locationInUse = locationId
        this.locationsRepository.saveLocation(location)
        this.usersRepository.saveUser(user)
        return location
    }

    async stopSession() {
        // Logic to stop a session
        return { message: 'Session stopped' }
    }

    async saveSession() {
        // Logic to save a session
        return { message: 'Session saved' }
    }

    async resetUser() {
        // Logic to reset user data
        return { message: 'User data reset' }
    }

    async resetLocation() {
        // Logic to reset location data
        return { message: 'Location data reset' }
    }

    async addPawdImageToSession() {
        // Logic to add a Pawd image to the session
        return { message: 'Pawd image added to session' }
    }

    async submitFeedback() {
        // Logic to submit feedback
        return { message: 'Feedback submitted' }
    }

    async getSessionsHistory() {
        // Logic to get sessions history
        return { sessions: [] }
    }
}
