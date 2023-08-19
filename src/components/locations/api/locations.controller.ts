import {
    Body,
    Controller,
    Delete,
    Param,
    Post,
    ValidationPipe,
} from "@nestjs/common";
import { CreateLocationInputDTO } from "./dto/inputs";
import { LocationsService } from "../domain/locations.service";
import { MessageOutputDTO } from "../../../sharable/dtos/output";
import { CreateLocationOutputDTO } from "./dto/outputs";

@Controller("locations")
export class LocationsController {
    constructor(private readonly locationsService: LocationsService) {}

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
