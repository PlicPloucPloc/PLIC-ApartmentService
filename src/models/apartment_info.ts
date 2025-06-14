class apartment_info{
    appartment_id: number;
    name: string;
    description: string;
    location: string;
    type: string;
    is_furnished: boolean;
    surface: number;
    number_of_rooms: number;
    number_of_bed_rooms: number;
    energy_class: string;
    ges: string;
    additional_data: string;
    heating_type: string;
    heating_mode: string;
    floor: number;
    elevator: boolean;
    available_from: string;
    monthly_charges: number;
    security_deposite: number;
    include_charges: boolean;
    parking_spaces: number;

    constructor(
        appartment_id: number,
        name: string,
        description: string,
        location: string,
        type: string,
        is_furnished: boolean,
        surface: number,
        number_of_rooms: number,
        number_of_bed_rooms: number,
        energy_class: string,
        ges: string,
        additional_data: string,
        heating_type: string,
        heating_mode: string,
        floor: number,
        elevator: boolean,
        available_from: string,
        monthly_charges: number,
        security_deposite: number,
        include_charges: boolean,
        parking_spaces: number
    ){
        this.appartment_id = appartment_id;
        this.name = name;
        this.description = description;
        this.location = location;
        this.type = type;
        this.is_furnished = is_furnished;
        this.surface = surface;
        this.number_of_rooms = number_of_rooms;
        this.number_of_bed_rooms = number_of_bed_rooms;
        this.energy_class = energy_class;
        this.ges = ges;
        this.additional_data = additional_data;
        this.heating_type = heating_type;
        this.heating_mode = heating_mode;
        this.floor = floor;
        this.elevator = elevator;
        this.available_from = available_from;
        this.monthly_charges = monthly_charges;
        this.security_deposite = security_deposite;
        this.include_charges = include_charges;
        this.parking_spaces = parking_spaces;
    }
}

export default apartment_info;
