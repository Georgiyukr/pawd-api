import {
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { CreateUser, LoginUser, Message } from '../../common/types'
import { User } from '../../common/entities'
import {
    AccessTokenPayload,
    LoggedInUser,
    PasswordResetToken,
    RegisteredUser,
} from './types'
import { HashService } from '../../common/providers/hash.service'
import { JwtService } from './jwt.service'
import { ErrorMessages } from '../../common/constants'
import { EmailService } from '../../common/services/email/email.service'

interface Tokens {
    accessToken: string
    refreshTokenHash: string
}

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
        private readonly hashService: HashService,
        private readonly emailService: EmailService
    ) {}

    async register(data: CreateUser): Promise<RegisteredUser> {
        let user: User = await this.userService.createUser(data)
        const { accessToken, refreshTokenHash }: Tokens =
            await this.generateAccessAndRefreshTokens(user)

        user = await this.userService.updateUser(
            { email: user.email },
            { refreshToken: refreshTokenHash }
        )
        await this.emailService.sendSuccessfulRegistrationEmail(user)

        return {
            user,
            accessToken,
        }
    }

    async login(data: LoginUser): Promise<LoggedInUser> {
        let user: User = await this.userService.getUserByEmail(data.email, {
            select: '-sessions',
        })

        if (!user) {
            throw new NotFoundException(
                `User with email ${data.email} does not exist.`
            )
        }

        const passwordMatch: boolean = await this.hashService.compareToHash(
            data.password,
            user.password
        )

        if (!passwordMatch)
            throw new UnauthorizedException(
                'Username or password provided do not match.'
            )

        const { accessToken, refreshTokenHash }: Tokens =
            await this.generateAccessAndRefreshTokens(user)

        user = await this.userService.updateUser(
            { email: user.email },
            { refreshToken: refreshTokenHash }
        )

        return {
            user,
            accessToken,
        }
    }

    async logout(id: string): Promise<Message> {
        let user = await this.userService.getUserById(id, {
            select: '-sessions -password',
        })

        if (!user) {
            throw new NotFoundException(`User with id ${id} does not exist.`)
        }

        user = await this.userService.updateUserById(id, {
            refreshToken: null,
        })
        return { message: ErrorMessages.logout }
    }

    async generatePasswordResetToken(
        email: Lowercase<string>
    ): Promise<PasswordResetToken> {
        let user: User = await this.userService.getUserByEmail(email, {
            select: '-password -sessions',
        })
        if (!user) {
            throw new NotFoundException(
                `User with email ${email} does not exist.`
            )
        }
        let tokenPayload: AccessTokenPayload =
            this.jwtService.formatAccessTokenPayload(user.id)
        let passwordResetToken: string =
            await this.jwtService.generateAccessToken(tokenPayload)
        user = await this.userService.updateUser(
            { email },
            { passwordResetToken }
        )
        return { passwordResetToken }
    }

    async generateAccessAndRefreshTokens(user: User): Promise<Tokens> {
        try {
            const accessTokenPayload: AccessTokenPayload =
                this.jwtService.formatAccessTokenPayload(user.id)
            const refreshTokenPayload =
                this.jwtService.formatRefreshTokenPayload()
            const accessToken: string =
                await this.jwtService.generateAccessToken(accessTokenPayload)
            const refreshToken: string =
                await this.jwtService.generateRefreshToken(refreshTokenPayload)

            const refreshTokenHash: string =
                await this.hashService.makeHash(refreshToken)
            return { accessToken, refreshTokenHash }
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async forgotUsername(email: Lowercase<string>): Promise<Message> {
        let user: User = await this.userService.getUserByEmail(email, {
            select: '-password -sessions',
        })
        if (!user) {
            throw new NotFoundException(
                `User with email ${email} does not exist.`
            )
        }
        await this.emailService.sendUsernameEmail(user)
        return { message: ErrorMessages.forgotUsername }
    }
}
