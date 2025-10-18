export class Filters {
    rent: number;
    location: string;
    size: number;
    is_furnished: boolean;
    constructor(rent: number, location: string, size: number, is_furnished: boolean) {
        this.rent = rent;
        this.location = location;
        this.size = size;
        this.is_furnished = is_furnished;
    }
}
