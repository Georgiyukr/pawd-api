import { Body, Controller, Post, ValidationPipe } from "@nestjs/common";
import { CreateLocationDTO } from "./dto/inputs";

@Controller("locations")
export class LocationsController {
    constructor() {}

    @Post()
    async createLocation(
        @Body(new ValidationPipe()) createLocationDto: CreateLocationDTO
    ) {}
}
