import { Injectable } from '@nestjs/common'
import { SessionsService } from './sessions.service'

@Injectable()
export class SessionsController {
    constructor(private readonly sessionsService: SessionsService) {}

    async startSession() {
        return this.sessionsService.startSession()
    }

    async stopSession() {
        return this.sessionsService.stopSession()
    }

    async addPawdImageToSession() {
        return this.sessionsService.addImage()
    }

    async submitFeedback() {
        return this.sessionsService.submitFeedback()
    }

    async getSessionsHistory() {
        return this.sessionsService.getSessionsHistory()
    }
}
