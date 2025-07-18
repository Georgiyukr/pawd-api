import { Test } from '@nestjs/testing'
import { CreateUser, LoginUser } from '../../../common/types'
import { AuthService } from '../auth.service'
import { UsersService } from '../../users/users.service'
import { EmailService } from '../../../utils/email/email.service'
import { HashService } from '../../../utils/hash.service'
import { JwtService } from '../jwt.service'
import { userStub } from './stubs/user.stub'
import { AccessTokenModule, RefreshTokenModule } from '../auth.module'
import { NodeMailerService } from '../../../utils/email/nodemailer/nodemailer.service'
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
        compareToHash: jest
            .fn()
            .mockImplementation((loginPassword, userPassword) => {
                return Promise.resolve(loginPassword === userPassword)
            }),
        makeHash: jest
            .fn()
            .mockImplementation(() => Promise.resolve(refreshTokenHash)),
    }

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [AccessTokenModule, RefreshTokenModule],
            providers: [
                AuthService,
                { provide: JwtService, useValue: mockJwtService },
                { provide: NodeMailerService, useValue: mockEmailService },
                { provide: UsersService, useValue: mockUserService },
                { provide: HashService, useValue: mockHashService },
            ],
        }).compile()
        authService = module.get<AuthService>(AuthService)
        userService = module.get<UsersService>(UsersService)
        jwtService = module.get<JwtService>(JwtService)
        hashService = module.get<HashService>(HashService)
        emailService = module.get<NodeMailerService>(EmailService)
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

            const response = {
                user: { ...userStub(), refreshToken },
                accessToken,
            }

            const createUserMock = jest
                .spyOn(userService, 'createUser')
                .mockResolvedValueOnce(userStub())

            const createTokensMock = jest
                .spyOn(authService, 'generateAccessAndRefreshTokens')
                .mockResolvedValueOnce({
                    accessToken,
                    refreshTokenHash: refreshToken,
                })
            const updateUserMock = jest
                .spyOn(userService, 'updateUser')
                .mockResolvedValueOnce({ ...userStub(), refreshToken })

            const emailMock = jest
                .spyOn(emailService, 'sendSuccessfulRegistrationEmail')
                .mockImplementation(() => Promise.resolve())

            const result = await authService.register(createUserInput)

            expect(createUserMock).toBeCalledWith(createUserInput)
            expect(createTokensMock).toBeCalledWith(userStub())
            expect(updateUserMock).toBeCalledWith(
                {
                    email: userStub().email,
                },
                { refreshToken }
            )
            expect(emailMock).toBeCalledTimes(1)
            expect(result).toEqual(response)
        })
    })

    describe('login', () => {
        it('should log in a user and create access token', async () => {
            const loginUserInput: LoginUser = {
                email: userStub().email,
                password: userStub().password,
            }
            const response = {
                user: { ...userStub(), refreshToken },
                accessToken,
            }
            const getUserMock = jest
                .spyOn(userService, 'getUserByEmail')
                .mockResolvedValue(userStub())
            const createTokensMock = jest
                .spyOn(authService, 'generateAccessAndRefreshTokens')
                .mockResolvedValueOnce({
                    accessToken,
                    refreshTokenHash: refreshToken,
                })

            const updateUserMock = jest
                .spyOn(userService, 'updateUser')
                .mockResolvedValueOnce({ ...userStub(), refreshToken })

            const result = await authService.login(loginUserInput)

            expect(getUserMock).toBeCalledWith(loginUserInput.email, {
                select: '-sessions',
            })

            expect(createTokensMock).toBeCalledWith(userStub())
            expect(updateUserMock).toBeCalledWith(
                {
                    email: userStub().email,
                },
                { refreshToken }
            )
            expect(result).toEqual(response)
        })

        it('should throw NotFoundException if wrong email provided', async () => {
            const loginUserInput: LoginUser = {
                email: 'invalid@email.com',
                password: userStub().password,
            }
            jest.spyOn(userService, 'getUserByEmail').mockResolvedValue(null)
            const result = async () => await authService.login(loginUserInput)
            await expect(result).rejects.toThrow(NotFoundException)
            await expect(result).rejects.toThrowError(
                new NotFoundException(
                    `User with email ${loginUserInput.email} does not exist.`
                )
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

            const result = async () => await authService.login(loginUserInput)

            await expect(result).rejects.toThrow(UnauthorizedException)
            await expect(result).rejects.toThrowError(
                new UnauthorizedException(
                    'Username or password provided do not match.'
                )
            )
        })
    })

    describe('logout', () => {
        it('should logout user if correct user id provided', async () => {
            const id = userStub().id
            const response = { message: ErrorMessages.logout }

            const getUserMock = jest
                .spyOn(userService, 'getUserById')
                .mockResolvedValue(userStub())

            const updateUserMock = jest
                .spyOn(userService, 'updateUserById')
                .mockResolvedValue({ ...userStub(), refreshToken: null })

            const result = await authService.logout(id)

            expect(getUserMock).toHaveBeenCalledWith(id, {
                select: '-sessions -password',
            })
            expect(updateUserMock).toHaveBeenCalledWith(id, {
                refreshToken: null,
            })
            expect(result).toEqual(response)
        })

        it('should throw NotFoundException if wrong user id provided', async () => {
            const id = 'invalid_id'

            jest.spyOn(userService, 'getUserById').mockResolvedValue(null)

            const result = async () => await authService.logout(id)

            await expect(result).rejects.toThrow(NotFoundException)
            await expect(result).rejects.toThrowError(
                new NotFoundException(`User with id ${id} does not exist.`)
            )
        })
    })

    describe('generatePasswordResetToken', () => {
        it('should return a token to reset password', async () => {
            const email = userStub().email
            const response = { passwordResetToken: resetToken }

            const getUserMock = jest
                .spyOn(userService, 'getUserByEmail')
                .mockResolvedValue(userStub())

            const tokenPayloadMock = jest
                .spyOn(jwtService, 'formatAccessTokenPayload')
                .mockImplementationOnce(() => {
                    return {
                        userId: userStub().id,
                    }
                })

            const tokenResetMock = jest
                .spyOn(jwtService, 'generateAccessToken')
                .mockResolvedValue(resetToken)

            const updateUserMock = jest
                .spyOn(userService, 'updateUser')
                .mockResolvedValue({
                    ...userStub(),
                    passwordResetToken: resetToken,
                })

            const result = await authService.generatePasswordResetToken(email)

            expect(getUserMock).toHaveBeenCalledWith(email, {
                select: '-password -sessions',
            })
            expect(tokenPayloadMock).toHaveBeenCalledWith(userStub().id)
            expect(tokenResetMock).toHaveBeenCalledWith({
                userId: userStub().id,
            })
            expect(updateUserMock).toHaveBeenCalledWith(
                { email },
                { passwordResetToken: resetToken }
            )

            expect(result).toEqual(response)
        })

        it('should throw NotFoundException if wrong email provided', async () => {
            const email: Lowercase<string> = 'invalid@email.com'
            jest.spyOn(userService, 'getUserByEmail').mockResolvedValue(null)
            const result = async () =>
                await authService.generatePasswordResetToken(email)

            await expect(result).rejects.toThrow(NotFoundException)
            await expect(result).rejects.toThrowError(
                new NotFoundException(
                    `User with email ${email} does not exist.`
                )
            )
        })
    })

    describe('generateAccessAndRefreshTokens', () => {
        it('should return access and refresh tokens', async () => {
            const user = userStub()
            const response = { accessToken, refreshTokenHash }

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

            const result =
                await authService.generateAccessAndRefreshTokens(user)

            expect(jwtService.formatAccessTokenPayload).toBeCalledWith(user.id)
            expect(jwtService.formatRefreshTokenPayload).toBeCalled()
            expect(jwtService.generateAccessToken).toHaveBeenCalledWith({
                userId: user.id,
            })
            expect(jwtService.generateRefreshToken).toHaveBeenCalledWith({})
            expect(mockHashService.makeHash).toHaveBeenCalledWith(refreshToken)
            expect(result).toEqual(response)
        })
    })

    describe('forgotUsername', () => {
        it('should send an email and return a message if correct email provided', async () => {
            const email = userStub().email
            const response = { message: ErrorMessages.forgotUsername }

            const getUserMock = jest
                .spyOn(userService, 'getUserByEmail')
                .mockResolvedValue(userStub())

            const emailMock = jest
                .spyOn(emailService, 'sendUsernameEmail')
                .mockImplementation(() => Promise.resolve())

            const result = await authService.forgotUsername(email)

            expect(getUserMock).toHaveBeenCalledWith(email, {
                select: '-password -sessions',
            })
            expect(emailMock).toBeCalledTimes(1)

            expect(result).toEqual(response)
        })

        it('should throw NotFoundException if wrong email provided', async () => {
            const email: Lowercase<string> = 'invalid@email.com'
            jest.spyOn(userService, 'getUserByEmail').mockResolvedValue(null)
            const result = async () =>
                await authService.generatePasswordResetToken(email)

            await expect(result).rejects.toThrow(NotFoundException)
            await expect(result).rejects.toThrowError(
                new NotFoundException(
                    `User with email ${email} does not exist.`
                )
            )
        })
    })
})
