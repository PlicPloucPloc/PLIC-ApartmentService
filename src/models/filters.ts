export class Filters {
    rent: number;
    location: string;
    min_size: number;
    max_size: number;
    is_furnished: boolean;
    constructor(
        rent: number,
        location: string,
        min_size: number,
        max_size: number,
        is_furnished: boolean
    ) {
        this.rent = rent;
        this.location = location;
        this.min_size = min_size;
        this.max_size = max_size;
        this.is_furnished = is_furnished;
    }
}
