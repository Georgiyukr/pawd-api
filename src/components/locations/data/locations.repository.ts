import { Injectable } from "@nestjs/common";
import { DataServices } from "../../../data/data-services";
import { Location } from "../../../sharable/entities";

@Injectable()
export class LocationsRepository {
    constructor(private readonly dataServices: DataServices) {}

    async getLocation(filter, options = undefined): Promise<Location> {
        return await this.dataServices.locations.get(filter, options);
    }

    async createLocation(location: Location): Promise<Location> {
        return await this.dataServices.locations.create(location);
    }

    async updateLocationById(id, update): Promise<Location> {
        return await this.dataServices.locations.updateById(id, update);
    }
}
