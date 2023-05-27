import { Module } from "@nestjs/common";
import { UsersService } from "./domain/users.service";
import { UsersController } from "./api/users.controller";
import { DataServicesModule } from "src/data/data-services.module";
import { UsersRepository } from "./data/users.repository";
import { UtilsModule } from "src/utils/utils.module";

@Module({
    imports: [DataServicesModule, UtilsModule],
    exports: [UsersService],
    providers: [UsersService, UsersRepository, UtilsModule],
    controllers: [UsersController],
})
export class UsersModule {}
