import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    ValidationPipe,
} from "@nestjs/common";
import { CreateLocationInputDTO } from "./dto/inputs";
import { LocationsService } from "../domain/locations.service";
import { MessageOutputDTO } from "../../../sharable/dtos/output";
import {
    CreateLocationOutputDTO,
    GetAllLocationsOutputDTO,
} from "./dto/outputs";

@Controller("locations")
export class LocationsController {
    constructor(private readonly locationsService: LocationsService) {}

    @Get("/")
    async getAllLocations(): Promise<
        GetAllLocationsOutputDTO | MessageOutputDTO
    > {
        return await this.locationsService.getAllLocations();
    }

    @Get("/:id")
    async getLocationById(@Param("id") id: string): Promise<any> {
        return await this.locationsService.getLocationById(id);
    }

    @Post("/")
    async createLocation(
        @Body(new ValidationPipe()) createLocationDto: CreateLocationInputDTO
    ): Promise<CreateLocationOutputDTO> {
        return await this.locationsService.createLocation(createLocationDto);
    }

    @Delete("/:id")
    async deleteLocation(@Param("id") id: string): Promise<MessageOutputDTO> {
        return await this.locationsService.deleteLocation(id);
    }
}
