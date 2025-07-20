import { File, Storage } from '@google-cloud/storage'
import { Injectable } from '@nestjs/common'

@Injectable()
export class GcpStorageService {
    constructor(private readonly storage: Storage) {}
    async uploadFile(
        bucketName: string,
        destination: string,
        fileBuffer: Buffer,
        contentType: string
    ): Promise<string> {
        const bucket = this.storage.bucket(bucketName)
        const file: File = bucket.file(destination)
        await file.save(fileBuffer, {
            metadata: { contentType },
            resumable: false,
        })
        return `https://storage.googleapis.com/${bucketName}/${destination}`
    }
}
