class apartment_info {
    apartment_id: number;
    name: string;
    location: string;
    is_furnished: boolean;
    surface: number;
    energy_class: string;
    available_from: string;
    rent: number;
    type: string;
    ges: string;
    description: string;
    number_of_rooms: number;
    number_of_bed_rooms: number;
    floor: number;
    elevator: boolean;
    parking_spaces: number;

    constructor(
        apartment_id: number,
        name: string,
        location: string,
        is_furnished: boolean,
        surface: number,
        energy_class: string,
        available_from: string,
        rent: number,
        type: string,
        ges: string,
        description: string,
        number_of_rooms: number,
        number_of_bed_rooms: number,
        floor: number,
        elevator: boolean,
        parking_spaces: number,
    ) {
        this.apartment_id = apartment_id;
        this.name = name;
        this.location = location;
        this.is_furnished = is_furnished;
        this.surface = surface;
        this.energy_class = energy_class;
        this.available_from = available_from;
        this.rent = rent;
        this.type = type;
        this.ges = ges;
        this.description = description;
        this.number_of_rooms = number_of_rooms;
        this.number_of_bed_rooms = number_of_bed_rooms;
        this.floor = floor;
        this.elevator = elevator;
        this.parking_spaces = parking_spaces;
    }
}

export default apartment_info;
