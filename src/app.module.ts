import { Module } from "@nestjs/common";
import { ApiModule } from "./api/api.module";
import { DomainModule } from "./domain/domain.module";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [
        ConfigModule.forRoot({ envFilePath: `${process.env.NODE_ENV}.env` }),
        MongooseModule.forRoot(
            `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.8zakhvw.mongodb.net/?retryWrites=true&w=majority`,
            { dbName: process.env.MONGO_DATABASE_NAME }
        ),
        ApiModule,
        DomainModule,
    ],
})
export class AppModule {}
