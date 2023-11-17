import {
    ConflictException,
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { CreateLocation, GetAllLocations } from "./types";
import { Location } from "../../../sharable/entities";
import { LocationsRepository } from "../data/locations.repository";
import * as QRcode from "qrcode";
import { Messages } from "../../../sharable/constants";
import { Message } from "../../../sharable/types";

@Injectable()
export class LocationsService {
    constructor(private readonly locationsRepository: LocationsRepository) {}

    async getAllLocations(): Promise<GetAllLocations | Message> {
        const locations: Location[] =
            await this.locationsRepository.getAllLocations();
        return { total: locations.length, locations };
    }

    async getLocationById(id: string): Promise<Location> {
        const location: Location =
            await this.locationsRepository.getLocationById(id);
        if (!location)
            throw new NotFoundException(
                `Location with id ${id} does not exists.`
            );
        return location;
    }

    async getLocationByAddress(address: string): Promise<Location> {
        // maybe needs NotFoundException
        return await this.locationsRepository.getLocation({ address });
    }

    async createLocation(data: CreateLocation): Promise<Location> {
        let location: Location = await this.getLocationByAddress(data.address);
        if (location)
            throw new ConflictException(
                `Location with address ${data.address} already exists.`
            );
        const locationCode = await this.getUniqueLocationCode();
        location = this.buildLocation(data, locationCode);
        location = await this.locationsRepository.createLocation(location);
        let qrcode = await QRcode.toDataURL(location.id);
        location = await this.updateLocationById(location.id, {
            qrCodeBase64: qrcode,
        });
        return location;
    }

    async updateLocationById(id, data): Promise<Location> {
        // maybe needs NotFoundException
        return await this.locationsRepository.updateLocationById(id, data);
    }

    async deleteLocation(id: string): Promise<Message> {
        const location = await this.locationsRepository.deleteLocationById(id);
        if (!location)
            throw new NotFoundException(
                `Location with id ${id} does not exists.`
            );
        return { message: Messages.default.locationDeleted };
    }

    async getUniqueLocationCode(): Promise<number> {
        let locationCode = Math.floor(Math.random() * 90000) + 10000;
        let location: Location = await this.locationsRepository.getLocation({
            locationCode,
        });
        let locationCodeTemp = await this.getUniqueLocationCode();
        while (locationCodeTemp === locationCode) {
            locationCodeTemp = await this.getUniqueLocationCode();
        }
        console.log("Location code before returning", locationCode);
        return locationCode;
    }

    buildLocation(data: CreateLocation, locationCode): Location {
        let location: Location = new Location();
        location.latitude = data.latitude;
        location.longitude = data.longitude;
        location.address = data.address;
        location.city = data.city;
        location.state = data.state;
        location.locationName = data.locationName;
        location.locationCode = locationCode;
        return location;
    }
}
