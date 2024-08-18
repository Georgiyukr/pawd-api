import { Session } from "../../../../common/entities";

export class RegisterUserOutputDTO {
    user: {
        id?: string;
        firstName: string;
        lastName: string;
        dogName: string;
        paymentCustomerId: string;
        email: string;
        sessions?: Session[];
        totalUses: number;
        refreshToken?: string;
    };
    accessToken: string;
}
