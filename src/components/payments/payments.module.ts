import { Module } from "@nestjs/common";
import { UtilsModule } from "src/utils/utils.module";
import { PaymentsService } from "./payments.service";
import { PaymentsRepository } from "./payments.repository";

@Module({
    imports: [UtilsModule],
    providers: [UtilsModule, PaymentsService, PaymentsRepository],
    exports: [PaymentsService],
})
export class PaymentsModule {}
