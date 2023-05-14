import { Feedback, Location, Session, User } from "./entities";
import { BaseRepository } from "./repositories/base.repository";

export abstract class DataServices {
    abstract users: BaseRepository<User>;
    abstract locations: BaseRepository<Location>;
    abstract sessions: BaseRepository<Session>;
    abstract feedback: BaseRepository<Feedback>;
}
