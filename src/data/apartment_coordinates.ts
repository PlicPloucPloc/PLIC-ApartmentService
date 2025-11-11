import { Logger } from "winston";
import { supabase } from "../libs/supabase";
import { apartment_coordinates } from "../models/apartment_coordinates";
import { getLogger } from "../services/logger";

const logger: Logger = getLogger('CoordinatesData');

export async function setApartmentCoordinates(aptCoord: apartment_coordinates): Promise<void> {
    const { data, error } = await supabase.from('apartment_coordinates').insert([aptCoord]).select();

    if (error || !data) {
        throw new Error(`Error inserting apartment coordinates: ${error!.message}`);
    }
}

export async function getApartmentCoordinates(aptId: number): Promise<apartment_coordinates> {
    logger.info(`Fetching coordinates for apartment ID: ${aptId}`);
    const { data, error } = await supabase
        .from('apartment_coordinates')
        .select('*')
        .eq('apartment_id', aptId)
        .single();

    if (error) {
        throw new Error(`Error fetching apartment coordinates: ${error.message}`);
    }
    return data;
}
