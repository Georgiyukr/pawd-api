import { Session, User } from 'src/common/entities'

export class StopSessionOutputDTO {
    session: Session
    user: User
}
