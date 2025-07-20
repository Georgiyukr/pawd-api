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
import { LocationOutputDTO } from '../locations/dtos/outputs'
import { StopSessionDTO } from './dtos/inputs/stopSession.dto'

@Controller('sessions')
export class SessionsController {
    constructor(private readonly sessionsService: SessionsService) {}

    @Post('/activate/:locationId')
    async startSession(
        @Param('locationId') locationId: string,
        @Body(new ValidationPipe()) startSessionDto: StartSessionDTO
    ): Promise<LocationOutputDTO> {
        return await this.sessionsService.startSession(
            locationId,
            startSessionDto
        )
    }
    @Post('/deactivate/:locationId')
    async stopSession(
        @Param('locationId') locationId: string,
        @Body(new ValidationPipe()) stopSessionDto: StopSessionDTO
    ) {
        return this.sessionsService.stopSession(locationId, stopSessionDto)
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
