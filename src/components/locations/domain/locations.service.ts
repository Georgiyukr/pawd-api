import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateLocation } from "./types";
import { Location } from "../../../sharable/entities";
import { LocationsRepository } from "../data/locations.repository";

@Injectable()
export class LocationsService {
    constructor(private readonly locationsRepository: LocationsRepository) {}
    async createLocation(data: CreateLocation): Promise<Location> {
        let location: Location = await this.getLocationByAddress(data.address);
        if (location)
            throw new HttpException(
                `Location with address ${data.address} already exists.`,
                HttpStatus.CONFLICT
            );
        return location;
    }

    async getLocationByAddress(address: string): Promise<Location> {
        return await this.locationsRepository.getLocationByAddress(address);
    }
}
