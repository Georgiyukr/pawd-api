import { Test } from '@nestjs/testing'
import { CreateUser, LoginUser } from '../../../common/types'
import { AuthService } from '../auth.service'
import { EmailService } from '../../../common/services/email/email.service'
import { UsersService } from '../../users/users.service'
import { HashService } from '../../../common/providers/hash.service'
import { JwtService } from '../jwt.service'
import { userStub } from './stubs/user.stub'
import { AccessTokenModule, RefreshTokenModule } from '../auth.module'
import { NotFoundException, UnauthorizedException } from '@nestjs/common'
import { ErrorMessages } from '../../../common/constants'

describe('AuthService', () => {
    let authService: AuthService
    let userService: UsersService
    let jwtService: JwtService
    let hashService: HashService
    let emailService: EmailService

    const accessToken: string = 'access_token'
    const refreshToken: string = 'refresh_token'
    const resetToken: string = 'reset_token'
    const refreshTokenHash = 'refresh_token_hash'

    let mockUserService = {
        createUser: jest.fn(),
        updateUser: jest.fn(),
        updateUserById: jest.fn(),
        getUserByEmail: jest.fn(),
        getUserById: jest.fn(),
    }

    let mockEmailService = {
        sendSuccessfulRegistrationEmail: jest.fn(),
        sendUsernameEmail: jest.fn(),
    }

    let mockJwtService = {
        formatAccessTokenPayload: jest.fn(),
        formatRefreshTokenPayload: jest.fn(),
        generateAccessToken: jest.fn(),
        generateRefreshToken: jest.fn(),
    }

    let mockHashService = {
        compareToHash: jest.fn((loginPassword: string, userPassword: string) =>
            Promise.resolve(loginPassword === userPassword)
        ),
        makeHash: jest.fn(() => Promise.resolve(refreshTokenHash)),
    }

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [AccessTokenModule, RefreshTokenModule],
            providers: [
                AuthService,
                { provide: JwtService, useValue: mockJwtService },
                { provide: EmailService, useValue: mockEmailService },
                { provide: UsersService, useValue: mockUserService },
                { provide: HashService, useValue: mockHashService },
            ],
        }).compile()
        authService = module.get<AuthService>(AuthService)
        userService = module.get<UsersService>(UsersService)
        jwtService = module.get<JwtService>(JwtService)
        hashService = module.get<HashService>(HashService)
        emailService = module.get<EmailService>(EmailService)
        jest.clearAllMocks()
    })

    describe('register', () => {
        it('should register a user and create access token', async () => {
            const createUserInput: CreateUser = {
                firstName: userStub().firstName,
                lastName: userStub().lastName,
                dogName: userStub().dogName,
                email: userStub().email,
                password: userStub().password,
            }

            jest.spyOn(userService, 'createUser').mockResolvedValueOnce(
                userStub()
            )
            jest.spyOn(
                authService,
                'generateAccessAndRefreshTokens'
            ).mockResolvedValueOnce({
                accessToken,
                refreshTokenHash: refreshToken,
            })
            jest.spyOn(userService, 'updateUser').mockResolvedValueOnce({
                ...userStub(),
                refreshToken,
            })
            jest.spyOn(
                emailService,
                'sendSuccessfulRegistrationEmail'
            ).mockResolvedValueOnce(undefined)

            const result = await authService.register(createUserInput)

            expect(userService.createUser).toBeCalledWith(createUserInput)
            expect(authService.generateAccessAndRefreshTokens).toBeCalledWith(
                userStub()
            )
            expect(userService.updateUser).toBeCalledWith(
                { email: userStub().email },
                { refreshToken }
            )
            expect(
                emailService.sendSuccessfulRegistrationEmail
            ).toBeCalledTimes(1)
            expect(result).toEqual({
                user: { ...userStub(), refreshToken },
                accessToken,
            })
        })

        it('should throw if createUser fails', async () => {
            const createUserInput: CreateUser = {
                firstName: userStub().firstName,
                lastName: userStub().lastName,
                dogName: userStub().dogName,
                email: userStub().email,
                password: userStub().password,
            }
            jest.spyOn(userService, 'createUser').mockRejectedValueOnce(
                new Error('fail')
            )
            await expect(authService.register(createUserInput)).rejects.toThrow(
                'fail'
            )
        })

        it('should throw if sendSuccessfulRegistrationEmail fails', async () => {
            const createUserInput: CreateUser = {
                firstName: userStub().firstName,
                lastName: userStub().lastName,
                dogName: userStub().dogName,
                email: userStub().email,
                password: userStub().password,
            }
            jest.spyOn(userService, 'createUser').mockResolvedValueOnce(
                userStub()
            )
            jest.spyOn(
                authService,
                'generateAccessAndRefreshTokens'
            ).mockResolvedValueOnce({
                accessToken,
                refreshTokenHash: refreshToken,
            })
            jest.spyOn(userService, 'updateUser').mockResolvedValueOnce({
                ...userStub(),
                refreshToken,
            })
            jest.spyOn(
                emailService,
                'sendSuccessfulRegistrationEmail'
            ).mockRejectedValueOnce(new Error('email error'))

            await expect(authService.register(createUserInput)).rejects.toThrow(
                'email error'
            )
        })
    })

    describe('login', () => {
        it('should log in a user and create access token', async () => {
            const loginUserInput: LoginUser = {
                email: userStub().email,
                password: userStub().password,
            }
            jest.spyOn(userService, 'getUserByEmail').mockResolvedValue(
                userStub()
            )
            jest.spyOn(
                authService,
                'generateAccessAndRefreshTokens'
            ).mockResolvedValueOnce({
                accessToken,
                refreshTokenHash: refreshToken,
            })
            jest.spyOn(userService, 'updateUser').mockResolvedValueOnce({
                ...userStub(),
                refreshToken,
            })

            const result = await authService.login(loginUserInput)

            expect(userService.getUserByEmail).toBeCalledWith(
                loginUserInput.email,
                { select: '-sessions' }
            )
            expect(authService.generateAccessAndRefreshTokens).toBeCalledWith(
                userStub()
            )
            expect(userService.updateUser).toBeCalledWith(
                { email: userStub().email },
                { refreshToken }
            )
            expect(result).toEqual({
                user: { ...userStub(), refreshToken },
                accessToken,
            })
        })

        it('should throw NotFoundException if wrong email provided', async () => {
            const loginUserInput: LoginUser = {
                email: 'invalid@email.com',
                password: userStub().password,
            }
            jest.spyOn(userService, 'getUserByEmail').mockResolvedValue(null)
            await expect(authService.login(loginUserInput)).rejects.toThrow(
                NotFoundException
            )
        })

        it('should throw UnauthorizedException if wrong password provided', async () => {
            const loginUserInput: LoginUser = {
                email: userStub().email,
                password: 'invalid_password',
            }
            jest.spyOn(userService, 'getUserByEmail').mockResolvedValue(
                userStub()
            )
            jest.spyOn(mockHashService, 'compareToHash').mockResolvedValue(
                false
            )

            await expect(authService.login(loginUserInput)).rejects.toThrow(
                UnauthorizedException
            )
        })

        it('should throw if compareToHash throws', async () => {
            const loginUserInput: LoginUser = {
                email: userStub().email,
                password: userStub().password,
            }
            jest.spyOn(userService, 'getUserByEmail').mockResolvedValue(
                userStub()
            )
            jest.spyOn(mockHashService, 'compareToHash').mockRejectedValue(
                new Error('hash error')
            )
            await expect(authService.login(loginUserInput)).rejects.toThrow(
                'hash error'
            )
        })
    })

    describe('logout', () => {
        it('should logout user if correct user id provided', async () => {
            const id = userStub().id
            jest.spyOn(userService, 'getUserById').mockResolvedValue(userStub())
            jest.spyOn(userService, 'updateUserById').mockResolvedValue({
                ...userStub(),
                refreshToken: null,
            })

            const result = await authService.logout(id)

            expect(userService.getUserById).toHaveBeenCalledWith(id, {
                select: '-sessions -password',
            })
            expect(userService.updateUserById).toHaveBeenCalledWith(id, {
                refreshToken: null,
            })
            expect(result).toEqual({ message: ErrorMessages.logout })
        })

        it('should throw NotFoundException if wrong user id provided', async () => {
            const id = 'invalid_id'
            jest.spyOn(userService, 'getUserById').mockResolvedValue(null)
            await expect(authService.logout(id)).rejects.toThrow(
                NotFoundException
            )
        })
    })

    describe('generatePasswordResetToken', () => {
        it('should return a token to reset password', async () => {
            const email = userStub().email
            jest.spyOn(userService, 'getUserByEmail').mockResolvedValue(
                userStub()
            )
            jest.spyOn(jwtService, 'formatAccessTokenPayload').mockReturnValue({
                userId: userStub().id,
            })
            jest.spyOn(jwtService, 'generateAccessToken').mockResolvedValue(
                resetToken
            )
            jest.spyOn(userService, 'updateUser').mockResolvedValue({
                ...userStub(),
                passwordResetToken: resetToken,
            })

            const result = await authService.generatePasswordResetToken(email)

            expect(userService.getUserByEmail).toHaveBeenCalledWith(email, {
                select: '-password -sessions',
            })
            expect(jwtService.formatAccessTokenPayload).toHaveBeenCalledWith(
                userStub().id
            )
            expect(jwtService.generateAccessToken).toHaveBeenCalledWith({
                userId: userStub().id,
            })
            expect(userService.updateUser).toHaveBeenCalledWith(
                { email },
                { passwordResetToken: resetToken }
            )
            expect(result).toEqual({ passwordResetToken: resetToken })
        })

        it('should throw NotFoundException if wrong email provided', async () => {
            const email = 'invalid@email.com'
            jest.spyOn(userService, 'getUserByEmail').mockResolvedValue(null)
            await expect(
                authService.generatePasswordResetToken(email)
            ).rejects.toThrow(NotFoundException)
        })
    })

    describe('generateAccessAndRefreshTokens', () => {
        it('should return access and refresh tokens', async () => {
            const user = userStub()
            jest.spyOn(jwtService, 'formatAccessTokenPayload').mockReturnValue({
                userId: user.id,
            })
            jest.spyOn(jwtService, 'formatRefreshTokenPayload').mockReturnValue(
                {}
            )
            jest.spyOn(jwtService, 'generateAccessToken').mockResolvedValue(
                accessToken
            )
            jest.spyOn(jwtService, 'generateRefreshToken').mockResolvedValue(
                refreshToken
            )
            jest.spyOn(hashService, 'makeHash').mockResolvedValue(
                refreshTokenHash
            )

            const result =
                await authService.generateAccessAndRefreshTokens(user)

            expect(jwtService.formatAccessTokenPayload).toBeCalledWith(user.id)
            expect(jwtService.formatRefreshTokenPayload).toBeCalled()
            expect(jwtService.generateAccessToken).toHaveBeenCalledWith({
                userId: user.id,
            })
            expect(jwtService.generateRefreshToken).toHaveBeenCalledWith({})
            // expect(hashService.makeHash).toHaveBeenCalledWith(refreshToken)
            expect(result).toEqual({ accessToken, refreshTokenHash })
        })

        it('should throw if makeHash fails', async () => {
            const user = userStub()
            jest.spyOn(jwtService, 'formatAccessTokenPayload').mockReturnValue({
                userId: user.id,
            })
            jest.spyOn(jwtService, 'formatRefreshTokenPayload').mockReturnValue(
                {}
            )
            jest.spyOn(jwtService, 'generateAccessToken').mockResolvedValue(
                accessToken
            )
            jest.spyOn(jwtService, 'generateRefreshToken').mockResolvedValue(
                refreshToken
            )
            jest.spyOn(mockHashService, 'makeHash').mockRejectedValue(
                new Error('hash error')
            )

            await expect(
                authService.generateAccessAndRefreshTokens(user)
            ).rejects.toThrow('hash error')
        })
    })

    describe('forgotUsername', () => {
        it('should send an email and return a message if correct email provided', async () => {
            const email = userStub().email
            jest.spyOn(userService, 'getUserByEmail').mockResolvedValue(
                userStub()
            )
            jest.spyOn(emailService, 'sendUsernameEmail').mockResolvedValue(
                undefined
            )

            const result = await authService.forgotUsername(email)

            expect(userService.getUserByEmail).toHaveBeenCalledWith(email, {
                select: '-password -sessions',
            })
            expect(emailService.sendUsernameEmail).toBeCalledTimes(1)
            expect(result).toEqual({ message: ErrorMessages.forgotUsername })
        })

        it('should throw NotFoundException if wrong email provided', async () => {
            const email = 'invalid@email.com'
            jest.spyOn(userService, 'getUserByEmail').mockResolvedValue(null)
            await expect(authService.forgotUsername(email)).rejects.toThrow(
                NotFoundException
            )
        })

        it('should throw if sendUsernameEmail fails', async () => {
            const email = userStub().email
            jest.spyOn(userService, 'getUserByEmail').mockResolvedValue(
                userStub()
            )
            jest.spyOn(emailService, 'sendUsernameEmail').mockRejectedValue(
                new Error('email error')
            )
            await expect(authService.forgotUsername(email)).rejects.toThrow(
                'email error'
            )
        })
    })
})
