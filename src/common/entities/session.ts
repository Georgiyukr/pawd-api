import { Location, User, Feedback } from "./index";

export class Session {
    id?: string;
    sessionStartTime: Date;
    sessionEndTime: Date;
    totalTimeInUse: string;
    totalPrice: string;
    user: User;
    location: Location;
    image?: string;
    feedback?: Feedback;
}
