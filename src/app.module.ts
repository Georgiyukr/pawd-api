import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";
import { DataServicesModule } from "./data/data-services.module";
import { UsersModule } from "./components/users/users.module";
import { AuthModule } from "./components/auth/auth.module";

@Module({
    imports: [
        ConfigModule.forRoot({ envFilePath: `${process.env.NODE_ENV}.env` }),
        MongooseModule.forRoot(
            `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.8zakhvw.mongodb.net/${process.env.MONGO_DATABASE_NAME}?retryWrites=true&w=majority`
        ),
        DataServicesModule,
        UsersModule,
        AuthModule,
    ],
})
export class AppModule {}
