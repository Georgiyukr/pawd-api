import { Module } from '@nestjs/common'
import { Storage } from '@google-cloud/storage'
import { Config } from '../../utils/config'
import { UtilsModule } from 'src/utils/utils.module'
import { GcpStorageService } from './storage.service'

@Module({
    imports: [UtilsModule],
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
