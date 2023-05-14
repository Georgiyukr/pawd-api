import { Module } from "@nestjs/common";
import { ApiModule } from "./api/api.module";
import { DomainModule } from "./domain/domain.module";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";
import { DataServicesModule } from "./data/data-services.module";

@Module({
    imports: [
        ConfigModule.forRoot({ envFilePath: `${process.env.NODE_ENV}.env` }),
        MongooseModule.forRoot(
            `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.8zakhvw.mongodb.net/?retryWrites=true&w=majority`,
            { dbName: process.env.MONGO_DATABASE_NAME }
        ),
        ApiModule,
        DomainModule,
        DataServicesModule,
    ],
})
export class AppModule {}
