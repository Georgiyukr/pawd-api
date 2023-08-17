import { Body, Controller, Post, ValidationPipe } from "@nestjs/common";
import { CreateLocationDTO } from "./dto/inputs";
import { LocationsService } from "../domain/locations.service";

@Controller("locations")
export class LocationsController {
    constructor(private readonly locationsService: LocationsService) {}

    @Post("/")
    async createLocation(
        @Body(new ValidationPipe()) createLocationDto: CreateLocationDTO
    ) {
        return await this.locationsService.createLocation(createLocationDto);
    }
}
