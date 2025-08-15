import { Module } from '@nestjs/common'
import { FilesystemService } from './filesystem.service'
import { CalculatorService } from './calculator.service'
import { Config } from './config.service'
import { HashService } from './hash.service'
import { EncryptionService } from './encryption.service'

@Module({
    providers: [
        FilesystemService,
        CalculatorService,
        Config,
        HashService,
        EncryptionService,
    ],
    exports: [
        FilesystemService,
        CalculatorService,
        Config,
        HashService,
        EncryptionService,
    ],
})
export class CommonProvidersModule {}
