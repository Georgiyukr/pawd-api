import { Module } from "@nestjs/common";
import { ApiModule } from "./api/api.module";
import { DomainModule } from "./domain/domain.module";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
    imports: [
        MongooseModule.forRoot(
            `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}.p2scv.mongodb.net/${process.env.MONGO_COLLECTION_NAME}?retryWrites=true&w=majority`
        ),
        ApiModule,
        DomainModule,
    ],
})
export class AppModule {}
