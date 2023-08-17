import { Module } from "@nestjs/common";
import { DataServicesModule } from "src/data/data-services.module";
import { UtilsModule } from "src/utils/utils.module";
import { LocationsService } from "./domain/locations.service";
import { LocationsController } from "./api/locations.controller";
import { LocationsRepository } from "./data/locations.repository";

@Module({
    imports: [DataServicesModule, UtilsModule],
    exports: [LocationsService],
    providers: [UtilsModule, LocationsService, LocationsRepository],
    controllers: [LocationsController],
})
export class LocationsModule {}
