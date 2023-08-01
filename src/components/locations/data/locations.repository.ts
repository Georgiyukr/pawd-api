import { Injectable } from "@nestjs/common";
import { DataServices } from "../../../data/data-services";
import { Location } from "../../../sharable/entities";

@Injectable()
export class LocationsRepository {
    constructor(private readonly dataServices: DataServices) {}

    async getLocationByAddress(
        address: string,
        options = undefined
    ): Promise<Location> {
        return await this.dataServices.locations.get({ address }, options);
    }
}
