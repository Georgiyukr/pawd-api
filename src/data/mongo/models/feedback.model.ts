import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose'
import { Session, User } from './index'
import { Collections } from './enums'

export type FeedbackDocument = HydratedDocument<Feedback>

@Schema()
export class Feedback {
    _id?: string

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: Collections.SESSION })
    sessionId: Session

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: Collections.USER })
    user: User

    @Prop({ required: true })
    rating: string

    @Prop()
    question1?: string

    @Prop()
    question2?: string

    @Prop()
    question3?: string

    toObject() {
        const obj = this.toObject()
        obj.id = obj._id
        delete obj._id
        delete obj.__v
        return obj
    }
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback)
