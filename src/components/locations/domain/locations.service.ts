import { Injectable } from "@nestjs/common";
import { CreateLocation } from "./types";

@Injectable()
export class LocationsService {
    async createLocation(location: CreateLocation) {
        return location;
    }
}
