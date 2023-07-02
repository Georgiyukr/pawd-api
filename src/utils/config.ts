import { Injectable } from "@nestjs/common";
import { Algorithm } from "jsonwebtoken";

@Injectable()
export class Config {
    jwtAlgorithm: Algorithm;
    jwtAudience: string;
    jwtIssuer: string;
    accessTokenPrivateKey: string;
    accessTokenPublicKey: string;
    accessTokenExpiration: string;
    refreshTokenPrivateKey: string;
    refreshTokenPublicKey: string;
    refreshTokenExpiration: string;
    mongoUsername: string;
    mongoPassword: string;
    mongoDatabaseName: string;
    stripePublicKey: string;
    stripeSecretKey: string;

    constructor() {
        this.jwtAlgorithm = process.env.ALGORITHM as Algorithm;
        this.jwtAudience = process.env.AUDIENCE;
        this.jwtIssuer = process.env.ISSUER;
        this.accessTokenPrivateKey = process.env.ACCESS_TOKEN_PRIVATE_KEY;
        this.accessTokenPublicKey = process.env.ACCESS_TOKEN_PUBLIC_KEY;
        this.accessTokenExpiration = process.env.ACCESS_TOKEN_EXPIRATION;
        this.refreshTokenPrivateKey = process.env.REFRESH_TOKEN_PRIVATE_KEY;
        this.refreshTokenPublicKey = process.env.REFRESH_TOKEN_PUBLIC_KEY;
        this.refreshTokenExpiration = process.env.REFRESH_TOKEN_EXPIRATION;
        this.mongoUsername = process.env.MONGO_USERNAME;
        this.mongoPassword = process.env.MONGO_PASSWORD;
        this.mongoDatabaseName = process.env.MONGO_DATABASE_NAME;
        this.stripePublicKey = process.env.STRIPE_PUBLIC_KEY;
        this.stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    }
}
