import { Injectable } from '@nestjs/common'
import { Session } from 'src/common/entities'
import { DataServices } from '../data-services'

@Injectable()
export class SessionsRepository {
    constructor(private dataServices: DataServices) {}

    saveSession(session: Session): Promise<Session> {
        return this.dataServices.sessions.saveEntity(session)
    }
}
