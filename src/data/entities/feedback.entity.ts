import { Session } from "./index";

export class Feedback {
    sessionId: Session;
    rating: string;
    question1?: string;
    question2?: string;
    question3?: string;
}
