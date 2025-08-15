import { Injectable } from '@nestjs/common'
import { Session, User } from '../../common/entities'
import { DataServices } from '../data-services'

@Injectable()
export class SessionsRepository {
    constructor(private dataServices: DataServices) {}

    async createSession(session: Session): Promise<Session> {
        return await this.dataServices.sessions.create(session)
    }

    async getSessionById(sessionId: string): Promise<Session> {
        return await this.dataServices.sessions.getById(sessionId)
    }

    async getUserSessionsHistory(userId: string): Promise<Session[]> {
        return await this.dataServices.sessions.getAll({
            where: { user: userId },
            select: '-image',
            populate: {
                path: 'location',
                select: '-sessions -__v -user -startDate -startTime -occupied -locationCode -qrCodeImageUrl',
            },
            sort: { sessionStopTime: 'desc' },
        })
    }

    async updateSessionById(
        id: string,
        update: Partial<Session>
    ): Promise<Session> {
        return await this.dataServices.sessions.updateById(id, update)
    }
}
