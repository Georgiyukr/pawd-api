import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema } from "mongoose";
import { User, Session } from "./index";
import { Collections } from "./enums";

export type LocationDocument = HydratedDocument<Location>;

@Schema({
    toJSON: {
        virtuals: true,
        transform: (doc, ret) => {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        },
    },
})
export class Location {
    _id?: string;

    @Prop()
    locationName?: string;

    @Prop()
    locationCode?: number;

    @Prop({ required: true })
    latitude: number;

    @Prop({ required: true })
    longitude: number;

    @Prop({ required: true })
    address: string;

    @Prop({ required: true })
    city: string;

    @Prop({ required: true })
    state: string;

    @Prop({ required: true })
    occupied: boolean;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: Collections.USER })
    user?: User;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: Collections.USER })
    userOpenIntent?: User;

    @Prop()
    startTime?: number;

    @Prop()
    startDate?: Date;

    @Prop({
        type: [{ type: MongooseSchema.Types.ObjectId, ref: Collections.USER }],
    })
    sessions?: Session[];

    @Prop({ required: true, default: 0 })
    totalUses: number;

    @Prop()
    temperature?: number;

    @Prop()
    soundLevel?: number;

    @Prop()
    qrCodeBase64?: string;

    toObject() {
        const obj = this.toObject();
        obj.id = obj._id;
        delete obj._id;
        delete obj.__v;
        return obj;
    }
}

export const LocationSchema = SchemaFactory.createForClass(Location);