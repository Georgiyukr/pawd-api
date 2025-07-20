import {
    Body,
    Controller,
    Injectable,
    Param,
    Post,
    ValidationPipe,
} from '@nestjs/common'
import { SessionsService } from './sessions.service'
import { StartSessionDTO } from './dtos/inputs/startSession.dto'

@Controller('sessions')
export class SessionsController {
    constructor(private readonly sessionsService: SessionsService) {}

    @Post('/activate/:locationId')
    async startSession(
        @Param('locationId') locationId: string,
        @Body(new ValidationPipe()) startSessionDto: StartSessionDTO
    ) {
        return await this.sessionsService.startSession(
            locationId,
            startSessionDto
        )
    }
    @Post('/deactivate/:locationId')
    async stopSession(
        @Param('locationId') locationId: string,
        @Body(new ValidationPipe()) stopSessionDto: any
    ) {
        return this.sessionsService.stopSession()
    }

    @Post('/images')
    async addPawdImageToSession(
        @Body(new ValidationPipe()) addPawdImageDto: any
    ) {
        return this.sessionsService.addPawdImageToSession()
    }

    @Post('/feedback')
    async submitFeedback(@Body(new ValidationPipe()) submitFeedbackDto: any) {
        return this.sessionsService.submitFeedback()
    }

    @Post('/history')
    async getSessionsHistory() {
        return this.sessionsService.getSessionsHistory()
    }
}
