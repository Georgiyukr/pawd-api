import { Injectable } from "@nestjs/common";
import { DataServices } from "../../data/data-services";
import { Location } from "../../common/entities";

@Injectable()
export class LocationsRepository {
    constructor(private readonly dataServices: DataServices) {}

    async getLocation(filter, options = undefined): Promise<Location> {
        return await this.dataServices.locations.get(filter, options);
    }

    async getLocationById(id: string): Promise<Location> {
        return await this.dataServices.locations.getById(id);
    }

    async getAllLocations(): Promise<Location[]> {
        return await this.dataServices.locations.getAll();
    }

    async createLocation(location: Location): Promise<Location> {
        return await this.dataServices.locations.create(location);
    }

    async updateLocationById(id, update): Promise<Location> {
        return await this.dataServices.locations.updateById(id, update);
    }

    async deleteLocationById(id): Promise<Location | unknown> {
        return await this.dataServices.locations.deleteById(id);
    }
}
