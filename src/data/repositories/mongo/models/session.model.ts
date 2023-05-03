import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema } from "mongoose";
import { User, Location, Feedback } from "./index";
import { Collections } from "./enums";

export type SessionDocument = HydratedDocument<Session>;

@Schema()
export class Session {
    @Prop({ required: true, type: Date })
    sessionStartTime: Date;

    @Prop({ required: true, type: Date })
    sessionEndTime: Date;

    @Prop({ required: true })
    totalTimeInUse: string;

    @Prop({ required: true })
    totalPrice: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: Collections.USER })
    user: User;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: Collections.LOCATION })
    location: Location;

    @Prop()
    image?: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: Collections.FEEDBACK })
    feedback?: Feedback;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
