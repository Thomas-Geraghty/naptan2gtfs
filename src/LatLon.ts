export class LatLon {
    private static readonly LAT_MIN: number = -90;
    private static readonly LAT_MAX: number = 90;
    private static readonly LON_MIN: number = -180;
    private static readonly LON_MAX: number = 180;

    public readonly lat: number;
    public readonly lon: number;
    
    constructor(lat: number | string, lon: number | string) {
        lat = Number(lat);
        lon = Number(lon);

        if (isNaN(lat) || isNaN(lon)) {
            throw new Error('Both Lat and Lon must be numbers.');
        }

        this.lat = Math.min(Math.max(lat, LatLon.LAT_MIN), LatLon.LAT_MAX);
        this.lon = Math.min(Math.max(lon, LatLon.LON_MIN), LatLon.LON_MAX);
    }

    static fromArray = (coordinates: [number, number]) => {
        return new LatLon(coordinates[0], coordinates[1]);
    }

    static fromObject = (obj) => {
        const lat = obj[Object.keys(obj)[0]]
        const lon = obj[Object.keys(obj)[1]]

        return new LatLon(lat, lon);
    }

    public toString() {
        return `${this.lat}, ${this.lon}`;
    }

    public toArray(): [number, number] {
        return [this.lat, this.lon]
    }

    public toObject() {
        return {
            lat: this.lat, 
            lon: this.lon
        }
    }
}