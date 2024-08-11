import { Injectable, InternalServerErrorException } from "@nestjs/common";
import * as fs from "fs";

@Injectable()
export class FilesystemService {
    constructor() {}

    readFile = (path): string | Buffer => {
        try {
            return fs.readFileSync(path, "utf-8");
        } catch (error) {
            switch (error.code) {
                case "ENOENT":
                    return null;
                default:
                    throw new InternalServerErrorException(error);
            }
        }
    };

    writeFile = (file, data) => {
        fs.writeFileSync(file, data, { encoding: "utf-8" });
    };
}
