import { LatLon } from "./LatLon";

enum VehicleType {
    TRAM = 0,
    SUBWAY = 1,
    RAIL = 2,
    BUS = 3,
    FERRY = 4,
    CABLE_CAR = 5
}

class Stop {
    readonly id: string;
    readonly code: string;
    readonly title: string;
    readonly timeZone: string;
    readonly coordinates: LatLon;
    readonly vehicleType: VehicleType;

    constructor(id: string, code: string, title: string, timeZone: string, coordinates: LatLon, vehicleType: VehicleType ) {
            this.id = id;
            this.code = code;
            this.title = title;
            this.timeZone = timeZone;
            this.coordinates = coordinates;
            this.vehicleType = vehicleType;
    }

    toGtfsRecord = () => {
        return [this.id, this.code, this.title, this.coordinates.toArray().join(','), this.timeZone, this.vehicleType].join(',');
    }

}

export { Stop, VehicleType }