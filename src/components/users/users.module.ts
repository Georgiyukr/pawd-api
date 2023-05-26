import { Module } from "@nestjs/common";
import { UsersService } from "./domain/users.service";
import { UsersController } from "./api/users.controller";
import { DataServicesModule } from "src/data/data-services.module";
import { UsersRepository } from "./data/users.repository";

@Module({
    imports: [DataServicesModule],
    exports: [UsersService],
    providers: [UsersService, UsersRepository],
    controllers: [UsersController],
})
export class UsersModule {}
