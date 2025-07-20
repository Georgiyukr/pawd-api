import { Injectable } from '@nestjs/common'
import { Algorithm } from 'jsonwebtoken'

@Injectable()
export class Config {
    jwtAlgorithm: Algorithm
    jwtAudience: string
    jwtIssuer: string
    accessTokenPrivateKey: string
    accessTokenPublicKey: string
    accessTokenExpiration: string
    refreshTokenPrivateKey: string
    refreshTokenPublicKey: string
    refreshTokenExpiration: string
    mongoUsername: string
    mongoPassword: string
    mongoDatabaseName: string
    stripePublicKey: string
    stripeSecretKey: string
    pawdEmail: string
    emailPassword: string
    cryptoAlgorithm: string
    cryptoKey: string
    cryptoIv: string
    gcpProjectId: string
    gcpBucketName: string

    constructor() {
        this.jwtAlgorithm = process.env.JWT_ALGORITHM as Algorithm
        this.jwtAudience = process.env.AUDIENCE
        this.jwtIssuer = process.env.ISSUER
        this.accessTokenPrivateKey = process.env.ACCESS_TOKEN_PRIVATE_KEY
        this.accessTokenPublicKey = process.env.ACCESS_TOKEN_PUBLIC_KEY
        this.accessTokenExpiration = process.env.ACCESS_TOKEN_EXPIRATION
        this.refreshTokenPrivateKey = process.env.REFRESH_TOKEN_PRIVATE_KEY
        this.refreshTokenPublicKey = process.env.REFRESH_TOKEN_PUBLIC_KEY
        this.refreshTokenExpiration = process.env.REFRESH_TOKEN_EXPIRATION
        this.mongoUsername = process.env.MONGO_USERNAME
        this.mongoPassword = process.env.MONGO_PASSWORD
        this.mongoDatabaseName = process.env.MONGO_DATABASE_NAME
        this.stripePublicKey = process.env.STRIPE_PUBLIC_KEY
        this.stripeSecretKey = process.env.STRIPE_SECRET_KEY
        this.pawdEmail = process.env.PAWD_EMAIL
        this.emailPassword = process.env.EMAIL_PASSWORD
        this.cryptoAlgorithm = process.env.CRYPTO_ALGORITHM
        this.cryptoKey = process.env.CRYPTO_KEY
        this.cryptoIv = process.env.CRYPTO_IV
        this.gcpProjectId = process.env.GCP_PROJECT_ID
        this.gcpBucketName = process.env.GCP_BUCKET_NAME
    }
}
