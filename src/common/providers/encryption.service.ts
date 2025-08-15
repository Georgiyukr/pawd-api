import { Injectable } from '@nestjs/common'
import * as crypto from 'crypto'
import { Config } from './config.service'

@Injectable()
export class EncryptionService {
    constructor(private readonly config: Config) {}

    async encrypt(data: string): Promise<string> {
        let cipher = crypto.createCipheriv(
            this.config.cryptoAlgorithm,
            Buffer.from(this.config.cryptoKey, 'hex'),
            Buffer.from(this.config.cryptoIv, 'hex')
        )
        let encryption = cipher.update(data, 'utf-8', 'hex')
        encryption += cipher.final('hex')
        return encryption
    }

    async decrypt(data): Promise<string> {
        let decipher = crypto.createDecipheriv(
            this.config.cryptoAlgorithm,
            Buffer.from(this.config.cryptoKey, 'hex'),
            Buffer.from(this.config.cryptoIv, 'hex')
        )
        let decryption = decipher.update(data, 'hex', 'utf8')
        decryption += decipher.final('utf8')
        return decryption
    }
}
