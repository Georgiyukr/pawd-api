import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    if (process.env.MONGO_USERNAME) {
        console.log('✅ MONGO_USERNAME is available')
    } else {
        console.warn('❌ MONGO_USERNAME is missing')
    }
    const port = process.env.PORT || 8080
    await app.listen(port)
}
bootstrap()
