import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { BaseRepository } from "../base.repository";
import { DataServices } from "../data-services";
import { BaseMongoRepository } from "./base.mongo.repository";
import {
    User,
    Location,
    Session,
    Feedback,
    UserDocument,
    LocationDocument,
    SessionDocument,
    FeedbackDocument,
} from "./models";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class MongoDataServices implements DataServices, OnApplicationBootstrap {
    users: BaseMongoRepository<User>;
    locations: BaseRepository<Location>;
    sessions: BaseRepository<Session>;
    feedback: BaseRepository<Feedback>;

    constructor(
        @InjectModel(User.name) private User: Model<UserDocument>,
        @InjectModel(Location.name)
        private Location: Model<LocationDocument>,
        @InjectModel(Session.name)
        private Session: Model<SessionDocument>,
        @InjectModel(Feedback.name)
        private Feedback: Model<FeedbackDocument>
    ) {}

    onApplicationBootstrap() {
        this.users = new BaseMongoRepository<User>(this.User);
        this.locations = new BaseMongoRepository<Location>(this.Location);
        this.sessions = new BaseMongoRepository<Session>(this.Session);
        this.feedback = new BaseMongoRepository<Feedback>(this.Feedback);
    }
}
