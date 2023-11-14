import { Location } from "../../../../sharable/entities";

export const locationStub = (): Location => {
    let location: Location = new Location();
    location.id = "location_1";
    location.locationName = "Crest Midtown";
    location.locationCode = 12345;
    location.latitude = 33.77107;
    location.longitude = -84.3799;
    location.address = "215 North Ave NE";
    location.city = "Atlanta";
    location.state = "GA";
    location.occupied = false;
    location.totalUses = 0;
    location.qrCodeBase64 = "qr_code";
    return location;
};
