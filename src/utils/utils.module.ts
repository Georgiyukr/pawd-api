import { Module } from "@nestjs/common";
import { Config } from "./config";
import { HashService } from "./hash.service";

@Module({
    imports: [],
    exports: [Config, HashService],
    providers: [Config, HashService],
})
export class UtilsModule {}
