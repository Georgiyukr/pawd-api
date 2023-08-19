import { Location } from "../../../sharable/entities";

export class CreateLocation {
    locationName: string;
    address: string;
    city: string;
    state: string;
    latitude: number;
    longitude: number;
}

export class GetAllLocations {
    locations: Location[];
    total: number;
}
