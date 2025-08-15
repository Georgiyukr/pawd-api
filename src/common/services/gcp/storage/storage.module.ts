import { Module } from '@nestjs/common'
import { Storage } from '@google-cloud/storage'
import { Config } from '../../../providers/config.service'
import { GcpStorageService } from './storage.service'
import { CommonProvidersModule } from 'src/common/providers/providers.modules'

@Module({
    imports: [CommonProvidersModule],
    providers: [
        {
            inject: [Config],
            provide: Storage,
            useFactory: (config: Config) => {
                return new Storage({
                    projectId: config.gcpProjectId,
                })
            },
        },
        GcpStorageService,
    ],
    exports: [GcpStorageService],
})
export class GcpStorageModule {}
