import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema } from "mongoose";
import { Session, Location } from "./index";
import { Collections } from "./enums";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    _id?: string;

    @Prop({ required: true })
    firstName: string;

    @Prop({ required: true })
    lastName: string;

    @Prop({ required: true })
    dogName: string;

    @Prop({ required: true })
    paymentCustomerId: string;

    @Prop({
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    })
    email: Lowercase<string>;

    @Prop()
    password?: string;

    @Prop()
    refreshToken?: string;

    @Prop()
    passwordResetToken?: string;

    @Prop()
    dogImageBase64?: string;

    @Prop()
    phoneNumber?: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: Collections.LOCATION })
    openedLocation?: Location;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: Collections.LOCATION })
    locationInUse?: Location;

    @Prop({
        type: [
            { type: MongooseSchema.Types.ObjectId, ref: Collections.SESSION },
        ],
    })
    sessions?: Session[];

    @Prop()
    socketId?: string;

    @Prop()
    paymentSetup?: boolean;

    @Prop({ required: true, type: Number, default: 0 })
    totalUses: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
