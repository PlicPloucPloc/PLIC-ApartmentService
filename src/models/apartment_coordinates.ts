
export class apartment_coordinates {
    apartment_id: number;
    lat: number;
    lon: number;
    constructor(
        apartment_id: number,
        lat: number,
        lon: number
    ) {
        this.apartment_id = apartment_id;
        this.lat = lat;
        this.lon = lon;
    }
}
