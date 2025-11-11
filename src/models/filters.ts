export class Filters {
    rent: number;
    lat: number;
    lon: number;
    min_size: number;
    max_size: number;
    is_furnished: boolean;
    constructor(
        rent: number,
        lat: number,
        lon: number,
        min_size: number,
        max_size: number,
        is_furnished: boolean
    ) {
        this.rent = rent;
        this.lat = lat;
        this.lon = lon;
        this.min_size = min_size;
        this.max_size = max_size;
        this.is_furnished = is_furnished;
    }
}
