export class apartment_info {
    apartment_id: number;
    name: string;
    is_furnished: boolean;
    surface: number;
    energy_class: string;
    available_from: Date;
    rent: number;
    estimated_price: number;
    type: string;
    ges: string;
    description: string;
    number_of_rooms: number;
    location: string;
    number_of_bedrooms: number;
    has_elevator: boolean;
    floor: number;
    parking_spaces: number;
    number_of_bathrooms: number;
    heating_type: string;
    heating_mod: string;
    construction_year: number;
    number_of_floors: number;
    orientation: string;
    constructor(
        apartment_id: number,
        name: string,
        location: string,
        is_furnished: boolean,
        surface: number,
        energy_class: string,
        available_from: Date,
        rent: number,
        estimated_price: number,
        type: string,
        ges: string,
        description: string,
        number_of_rooms: number,
        number_of_bed_rooms: number,
        floor: number,
        elevator: boolean,
        parking_spaces: number,
        number_of_bathrooms: number,
        heating_type: string,
        heating_mod: string,
        construction_year: number,
        number_of_floors: number,
        orientation: string,
    ) {
        this.apartment_id = apartment_id;
        this.name = name;
        this.location = location;
        this.is_furnished = is_furnished;
        this.surface = surface;
        this.energy_class = energy_class;
        this.available_from = available_from;
        this.rent = rent;
        this.estimated_price = estimated_price;
        this.type = type;
        this.ges = ges;
        this.description = description;
        this.number_of_rooms = number_of_rooms;
        this.number_of_bedrooms = number_of_bed_rooms;
        this.floor = floor;
        this.has_elevator = elevator;
        this.parking_spaces = parking_spaces;
        this.number_of_bathrooms = number_of_bathrooms;
        this.heating_type = heating_type;
        this.heating_mod = heating_mod;
        this.construction_year = construction_year;
        this.number_of_floors = number_of_floors;
        this.orientation = orientation;
    }
}
