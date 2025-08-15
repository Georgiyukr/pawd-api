import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";

@Injectable()
export class HashService {
    constructor() {}

    async makeHash(data: string): Promise<string> {
        const salt = await bcrypt.genSalt(12);
        return await bcrypt.hash(data, salt);
    }

    async compareToHash(data, hash): Promise<boolean> {
        return bcrypt.compare(data, hash);
    }
}
