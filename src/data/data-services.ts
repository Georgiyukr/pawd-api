import { Feedback, Location, Session, User } from "../sharable/entities";
import { BaseRepository } from "./base.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class DataServices {
    abstract users: BaseRepository<User>;
    abstract locations: BaseRepository<Location>;
    abstract sessions: BaseRepository<Session>;
    abstract feedback: BaseRepository<Feedback>;
}
