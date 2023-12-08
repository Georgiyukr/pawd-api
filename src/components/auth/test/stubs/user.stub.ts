import { User } from "../../../../common/entities";

export const userStub = (): User => {
    let user: User = new User();
    user.id = "user_1";
    user.firstName = "Adam";
    user.lastName = "Todder";
    user.dogName = "Polly";
    user.paymentCustomerId = "1";
    user.email = "adam@gmail.com";
    user.password = "123";
    user.totalUses = 0;
    return user;
};
