import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateLocation, GetAllLocations } from "./types";
import { Location } from "../../../common/entities";
import { LocationsRepository } from "../data/locations.repository";
import * as QRcode from "qrcode";
import { Messages } from "../../../common/constants";
import { Message } from "../../../common/types";
import { FilesystemService } from "../../../common/providers/filesystem.service";
import { EncryptionService } from "../../../utils/encryption.service";

@Injectable()
export class LocationsService {
    constructor(
        private readonly locationsRepository: LocationsRepository,
        private readonly filesystemService: FilesystemService,
        private readonly encryptionService: EncryptionService
    ) {}

    async getAllLocations(): Promise<GetAllLocations | Message> {
        const locations: Location[] =
            await this.locationsRepository.getAllLocations();
        return { total: locations.length, locations };
    }

    async getLocationById(id: string): Promise<Location> {
        const location: Location =
            await this.locationsRepository.getLocationById(id);
        if (!location)
            throw new HttpException(
                `Location with id ${id} does not exists.`,
                HttpStatus.NOT_FOUND
            );
        return location;
    }

    async getLocationByAddress(address: string): Promise<Location> {
        return await this.locationsRepository.getLocation({ address });
    }

    async createLocation(data: CreateLocation): Promise<Location> {
        let location: Location = await this.getLocationByAddress(data.address);
        if (location)
            throw new HttpException(
                `Location with address ${data.address} already exists.`,
                HttpStatus.CONFLICT
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
        return await this.locationsRepository.updateLocationById(id, data);
    }

    async deleteLocation(id: string): Promise<Message> {
        const location = await this.locationsRepository.deleteLocationById(id);
        if (!location)
            throw new HttpException(
                `Location with id ${id} does not exists.`,
                HttpStatus.NOT_FOUND
            );
        return { message: Messages.default.locationDeleted };
    }

    async getUniqueLocationCode(): Promise<number> {
        let locationCodes: string[] = await this.readLocationCodes();

        if (!locationCodes) {
            var locationCodesArray = this.generateLocationCodesArray();
            this.saveLocationCodes(locationCodesArray.toString());
        } else {
            console.log("getUniqueLocationCode file exists", locationCodes);
            console.log();
            this.saveLocationCodes(locationCodes.toString());
        }

        // if there is no file, create a file and generate an array
        // if file exists, read it and get an array/set of location codes

        let locationCode = Math.floor(Math.random() * 90000) + 10000;
        let location: Location = await this.locationsRepository.getLocation({
            locationCode,
        });
        if (location) this.getUniqueLocationCode();
        return locationCode;
    }

    async saveLocationCodes(locationCodes: string): Promise<void> {
        console.log(
            "saveLocationCodes: locations codes before encryption",
            locationCodes
        );
        locationCodes = await this.encryptionService.encrypt(locationCodes);

        this.filesystemService.writeFile("location-codes.txt", locationCodes);

        console.debug(
            "saveLocationCodes: file is written to as ",
            locationCodes
        );
        console.log();
    }

    async readLocationCodes() {
        let locationCodesBuffer: string | Buffer =
            this.filesystemService.readFile("location-codes.txt");

        if (!locationCodesBuffer) {
            console.debug("File not found at: ", "location-codes.txt");
            console.log();
            return null;
        }

        let locationCodes: string = await this.encryptionService.decrypt(
            locationCodesBuffer.toString()
        );

        console.debug("File is read: ", locationCodes.split(","));
        console.log();
        return locationCodes.split(",");
    }

    generateLocationCodesArray(): number[] {
        let locationCodesArray: number[] = [];
        for (let i = 10000; i <= 10007; i++) {
            locationCodesArray.push(i);
        }
        console.debug("Array of codes", locationCodesArray);
        return locationCodesArray;
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
