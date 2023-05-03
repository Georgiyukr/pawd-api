import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema } from "mongoose";
import { Session } from "./index";
import { Collections } from "./enums";

export type FeedbackDocument = HydratedDocument<Feedback>;

@Schema()
export class Feedback {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: Collections.SESSION })
    session: Session;

    @Prop({ required: true })
    rating: string;

    @Prop()
    question1?: string;

    @Prop()
    question2?: string;

    @Prop()
    question3?: string;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
