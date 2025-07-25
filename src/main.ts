import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
    if (process.env.MONGO_USERNAME) {
        console.log('✅ MONGO_USERNAME is available')
    } else {
        console.warn('❌ MONGO_USERNAME is missing')
    }
    const app = await NestFactory.create(AppModule)
    const port = process.env.PORT || 8080
    await app.listen(port)
}
bootstrap()
