import { LocationsRepository } from '../../data/repositories/locations.repository'
import { LocationsService } from '../locations/locations.service'
import { UsersService } from '../users/users.service'
import { SessionsService } from './sessions.service'
import { UsersRepository } from '../../data/repositories/users.repository'
import { SessionsRepository } from '../../data/repositories/sessions.repository'
import { FeedbackRepository } from '../../data/repositories/feedback.repository'
import { CalculatorService } from '../../common/providers/calculator.service'
import { GcpStorageService } from '../../common/services/gcp/storage/storage.service'
import { Config } from '../../common/providers/config.service'
import { Test, TestingModule } from '@nestjs/testing'
import { NotFoundException } from '@nestjs/common'

describe('SessionsService', () => {
    let service: SessionsService
    let locationsService: LocationsService
    let usersService: UsersService
    let locationsRepository: LocationsRepository
    let usersRepository: UsersRepository
    let sessionsRepository: SessionsRepository
    let feedbackRepository: FeedbackRepository
    let calculatorService: CalculatorService
    let gcpStorageService: GcpStorageService
    let config: Config

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SessionsService,
                {
                    provide: LocationsService,
                    useValue: { getLocationById: jest.fn() },
                },
                { provide: UsersService, useValue: { getUserById: jest.fn() } },
                {
                    provide: LocationsRepository,
                    useValue: { updateLocationById: jest.fn() },
                },
                {
                    provide: UsersRepository,
                    useValue: { updateUserById: jest.fn() },
                },
                {
                    provide: SessionsRepository,
                    useValue: {
                        updateSessionById: jest.fn(),
                        getSessionById: jest.fn(),
                        getUserSessionsHistory: jest.fn(), // updated method name
                    },
                },
                {
                    provide: FeedbackRepository,
                    useValue: { createFeedback: jest.fn() }, // updated method name
                },
                {
                    provide: CalculatorService,
                    useValue: {
                        calculateTotalTime: jest.fn(),
                        calculateTotalPrice: jest.fn(),
                    },
                },
                {
                    provide: GcpStorageService,
                    useValue: { uploadFile: jest.fn() },
                },
                { provide: Config, useValue: {} },
            ],
        }).compile()

        service = module.get<SessionsService>(SessionsService)
        locationsService = module.get<LocationsService>(LocationsService)
        usersService = module.get<UsersService>(UsersService)
        locationsRepository =
            module.get<LocationsRepository>(LocationsRepository)
        usersRepository = module.get<UsersRepository>(UsersRepository)
        sessionsRepository = module.get<SessionsRepository>(SessionsRepository)
        feedbackRepository = module.get<FeedbackRepository>(FeedbackRepository)
        calculatorService = module.get<CalculatorService>(CalculatorService)
        gcpStorageService = module.get<GcpStorageService>(GcpStorageService)
        config = module.get<Config>(Config)
        jest.clearAllMocks()
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    describe('startSession', () => {
        it('should start a session and update location and user', async () => {
            const location = { id: 'loc1', occupied: false } as any
            const user = { id: 'user1', sessions: [] } as any
            jest.spyOn(locationsService, 'getLocationById').mockResolvedValue(
                location
            )
            jest.spyOn(usersService, 'getUserById').mockResolvedValue(user)
            jest.spyOn(
                locationsRepository,
                'updateLocationById'
            ).mockResolvedValue(location)
            jest.spyOn(usersRepository, 'updateUserById').mockResolvedValue(
                user
            )

            const data = {
                userId: 'user1',
                startTime: 123,
                startDate: new Date(),
            }
            const result = await service.startSession('loc1', data as any)

            expect(locationsService.getLocationById).toHaveBeenCalledWith(
                'loc1'
            )
            expect(usersService.getUserById).toHaveBeenCalledWith('user1')
            expect(locationsRepository.updateLocationById).toHaveBeenCalled()
            expect(usersRepository.updateUserById).toHaveBeenCalled()
            expect(result).toBe(location)
        })

        it('should throw NotFoundException if location not found', async () => {
            jest.spyOn(locationsService, 'getLocationById').mockResolvedValue(
                undefined
            )
            const data = {
                userId: 'user1',
                startTime: 123,
                startDate: new Date(),
            }
            await expect(
                service.startSession('loc1', data as any)
            ).rejects.toThrow(NotFoundException)
        })

        it('should throw NotFoundException if user not found', async () => {
            const location = { id: 'loc1', occupied: false } as any
            jest.spyOn(locationsService, 'getLocationById').mockResolvedValue(
                location
            )
            jest.spyOn(usersService, 'getUserById').mockResolvedValue(undefined)
            const data = {
                userId: 'user1',
                startTime: 123,
                startDate: new Date(),
            }
            await expect(
                service.startSession('loc1', data as any)
            ).rejects.toThrow(NotFoundException)
        })
    })

    describe('stopSession', () => {
        it('should stop a session, save session, reset location and user', async () => {
            const location = {
                id: 'loc1',
                startTime: 1,
                startDate: new Date(),
                sessions: [],
                occupied: true,
                user: 'user1',
            } as any
            const user = { id: 'user1', sessions: [] } as any
            const totalTime = { minutes: '10', seconds: '0' }
            const totalPrice = '5'
            const session = { id: 'sess1' } as any

            jest.spyOn(locationsService, 'getLocationById').mockResolvedValue(
                location
            )
            jest.spyOn(usersService, 'getUserById').mockResolvedValue(user)
            jest.spyOn(calculatorService, 'calculateTotalTime').mockReturnValue(
                totalTime
            )
            jest.spyOn(
                calculatorService,
                'calculateTotalPrice'
            ).mockReturnValue(totalPrice)
            jest.spyOn(service, 'saveSession').mockResolvedValue(session)
            jest.spyOn(service, 'resetLocation').mockResolvedValue(user)
            jest.spyOn(service, 'resetUser').mockResolvedValue(user)

            const data = { userId: 'user1', stopTime: 2, stopDate: new Date() }
            const result = await service.stopSession('loc1', data as any)

            expect(result).toHaveProperty('session', session)
            expect(result).toHaveProperty('user', user)
            expect(service.saveSession).toHaveBeenCalled()
            expect(service.resetLocation).toHaveBeenCalledWith(location)
            expect(service.resetUser).toHaveBeenCalledWith(user)
        })

        it('should throw NotFoundException if location not found', async () => {
            jest.spyOn(locationsService, 'getLocationById').mockResolvedValue(
                undefined
            )
            const data = { userId: 'user1', stopTime: 2, stopDate: new Date() }
            await expect(
                service.stopSession('loc1', data as any)
            ).rejects.toThrow(NotFoundException)
        })

        it('should throw NotFoundException if user not found', async () => {
            const location = {
                id: 'loc1',
                startTime: 1,
                startDate: new Date(),
                sessions: [],
            } as any
            jest.spyOn(locationsService, 'getLocationById').mockResolvedValue(
                location
            )
            jest.spyOn(usersService, 'getUserById').mockResolvedValue(undefined)
            const data = { userId: 'user1', stopTime: 2, stopDate: new Date() }
            await expect(
                service.stopSession('loc1', data as any)
            ).rejects.toThrow(NotFoundException)
        })
    })

    describe('getSessionById', () => {
        it('should return session if found', async () => {
            const session = { id: 'sess1' }
            jest.spyOn(sessionsRepository, 'getSessionById').mockResolvedValue(
                session as any
            )
            const result = await service.getSessionById('sess1')
            expect(result).toBe(session)
        })

        it('should throw NotFoundException if not found', async () => {
            jest.spyOn(sessionsRepository, 'getSessionById').mockResolvedValue(
                undefined
            )
            await expect(service.getSessionById('sess1')).rejects.toThrow(
                NotFoundException
            )
        })
    })

    describe('getSessionsHistory', () => {
        it('should return sessions if found', async () => {
            const sessions = [{ id: 'sess1' }]
            jest.spyOn(
                sessionsRepository,
                'getUserSessionsHistory'
            ).mockResolvedValue(sessions as any)
            const result = await service.getUserSessionsHistory('user1')
            expect(result).toBe(sessions)
        })

        it('should throw NotFoundException if not found', async () => {
            jest.spyOn(
                sessionsRepository,
                'getUserSessionsHistory'
            ).mockResolvedValue(undefined)
            await expect(
                service.getUserSessionsHistory('user1')
            ).rejects.toThrow(NotFoundException)
        })

        it('should throw NotFoundException if sessions is empty array', async () => {
            jest.spyOn(
                sessionsRepository,
                'getUserSessionsHistory'
            ).mockResolvedValue([])
            await expect(
                service.getUserSessionsHistory('user1')
            ).rejects.toThrow(NotFoundException)
        })
    })

    describe('addPawdImageToSession', () => {
        it('should add image to session if not exists', async () => {
            const session = { id: 'sess1', image: undefined } as any
            const gcpFileUrl = 'https://gcp.com/image.png'
            jest.spyOn(service, 'getSessionById').mockResolvedValue(session)
            jest.spyOn(gcpStorageService, 'uploadFile').mockResolvedValue(
                gcpFileUrl
            )
            jest.spyOn(
                sessionsRepository,
                'updateSessionById'
            ).mockResolvedValue({ ...session, image: gcpFileUrl })
            const data = { sessionId: 'sess1', image: 'aGVsbG8=' } // 'hello' in base64
            const result = await service.addPawdImageToSession(data as any)
            expect(result.image).toBe(gcpFileUrl)
        })

        it('should throw ConflictException if session already has image', async () => {
            const session = { id: 'sess1', image: 'exists' } as any
            jest.spyOn(service, 'getSessionById').mockResolvedValue(session)
            const data = { sessionId: 'sess1', image: 'aGVsbG8=' }
            await expect(
                service.addPawdImageToSession(data as any)
            ).rejects.toThrow('Image for session with ID sess1 already exists.')
        })
    })

    describe('submitFeedback', () => {
        it('should submit feedback if not exists', async () => {
            const session = {
                id: 'sess1',
                user: 'user1',
                feedback: undefined,
            } as any
            const feedback = {
                id: 'fb1',
                sessionId: 'sess1',
                user: 'user1',
                text: 'Great!',
            } as any
            jest.spyOn(service, 'getSessionById').mockResolvedValue(session)
            jest.spyOn(feedbackRepository, 'createFeedback').mockResolvedValue(
                feedback
            )
            jest.spyOn(
                sessionsRepository,
                'updateSessionById'
            ).mockResolvedValue({ ...session, feedback: feedback.id })
            const data = { text: 'Great!' }
            const result = await service.submitFeedback('sess1', data as any)
            expect(result).toBe(feedback)
        })

        it('should throw ConflictException if feedback already exists', async () => {
            const session = {
                id: 'sess1',
                user: 'user1',
                feedback: 'fb1',
            } as any
            jest.spyOn(service, 'getSessionById').mockResolvedValue(session)
            const data = { text: 'Great!' }
            await expect(
                service.submitFeedback('sess1', data as any)
            ).rejects.toThrow(
                'Feedback for session with ID sess1 already exists.'
            )
        })
    })
})
