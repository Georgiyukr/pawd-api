import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { DataServicesModule } from "../../data/data-services.module";
import { UsersRepository } from "./users.repository";
import { UtilsModule } from "../../utils/utils.module";
import { PaymentsModule } from "../payments/payments.module";

@Module({
    imports: [DataServicesModule, UtilsModule, PaymentsModule],
    exports: [UsersService],
    providers: [UsersService, UsersRepository, UtilsModule, PaymentsModule],
    controllers: [UsersController],
})
export class UsersModule {}
