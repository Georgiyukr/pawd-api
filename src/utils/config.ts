import { Injectable } from "@nestjs/common";

@Injectable()
export class Config {
    accessTokenSecret: string;
    accessTokenExpiration: string;
    refreshTokenSecret: string;
    refreshTokenExpiration: string;
    mongoUsername: string;
    mongoPassword: string;
    mongoDatabaseName: string;

    constructor() {
        this.accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
        this.accessTokenExpiration = process.env.ACCESS_TOKEN_EXPIRATION;
        this.refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
        this.refreshTokenExpiration = process.env.REFRESH_TOKEN_EXPIRATION;
        this.mongoUsername = process.env.MONGO_USERNAME;
        this.mongoPassword = process.env.MONGO_PASSWORD;
        this.mongoDatabaseName = process.env.MONGO_DATABASE_NAME;
    }
}
