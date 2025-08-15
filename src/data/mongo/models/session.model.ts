import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose'
import { User, Location, Feedback } from './index'
import { Collections } from './enums'

export type SessionDocument = HydratedDocument<Session>

@Schema({
    toJSON: {
        virtuals: true,
        transform: (doc, ret) => {
            ret.id = ret._id
            delete ret._id
            delete ret.__v
        },
    },
})
export class Session {
    _id?: string

    @Prop({ required: true, type: Date })
    sessionStartTime: Date

    @Prop({ required: true, type: Date })
    sessionStopTime: Date

    @Prop({ required: true })
    totalTimeInUse: string

    @Prop({ required: true })
    totalPrice: string

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: Collections.USER })
    user: User

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: Collections.LOCATION })
    location: Location

    @Prop()
    image?: string

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: Collections.FEEDBACK })
    feedback?: Feedback

    toObject() {
        const obj = this.toObject()
        obj.id = obj._id
        delete obj._id
        delete obj.__v
        return obj
    }
}

export const SessionSchema = SchemaFactory.createForClass(Session)
