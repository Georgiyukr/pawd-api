import { Body, Controller, Param, Post, ValidationPipe } from '@nestjs/common'
import { SessionsService } from './sessions.service'

import { LocationOutputDTO } from '../locations/dtos/outputs'

import { UserIdInputDTO } from '../../common/dtos/input'
import {
    StartSessionDTO,
    AddImageDTO,
    StopSessionDTO,
    SubmitFeedbackDTO,
} from './dtos/inputs'
import {
    FeedbackOutputDTO,
    SessionOutputDTO,
    StopSessionOutputDTO,
} from './dtos/outputs'

@Controller('sessions')
export class SessionsController {
    constructor(private readonly sessionsService: SessionsService) {}

    @Post('/activate/:locationId')
    async startSession(
        @Param('locationId') locationId: string,
        @Body(new ValidationPipe()) data: StartSessionDTO
    ): Promise<LocationOutputDTO> {
        return await this.sessionsService.startSession(locationId, data)
    }
    @Post('/deactivate/:locationId')
    async stopSession(
        @Param('locationId') locationId: string,
        @Body(new ValidationPipe()) data: StopSessionDTO
    ): Promise<StopSessionOutputDTO> {
        return this.sessionsService.stopSession(locationId, data)
    }

    @Post('/images')
    async addPawdImageToSession(
        @Body(new ValidationPipe()) data: AddImageDTO
    ): Promise<SessionOutputDTO> {
        return this.sessionsService.addPawdImageToSession(data)
    }

    @Post('/feedback')
    async submitFeedback(
        @Body(new ValidationPipe()) data: SubmitFeedbackDTO
    ): Promise<FeedbackOutputDTO> {
        const { sessionId, ...feedbackData } = data
        return await this.sessionsService.submitFeedback(
            sessionId,
            feedbackData
        )
    }

    @Post('/users/history')
    async getUserSessionsHistory(
        @Body(new ValidationPipe()) data: UserIdInputDTO
    ): Promise<SessionOutputDTO[]> {
        return await this.sessionsService.getUserSessionsHistory(data.userId)
    }
}
