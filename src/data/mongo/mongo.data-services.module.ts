import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
    UserSchema,
    User,
    Location,
    LocationSchema,
    Session,
    SessionSchema,
    Feedback,
    FeedbackSchema,
} from "./models";
import { DataServices } from "../data-services";
import { MongoDataServices } from "./mongo.data-services.service";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Location.name, schema: LocationSchema },
            { name: Session.name, schema: SessionSchema },
            { name: Feedback.name, schema: FeedbackSchema },
        ]),
    ],
    providers: [{ provide: DataServices, useClass: MongoDataServices }],
    exports: [DataServices],
})
export class MongoDataServicesModule {}
