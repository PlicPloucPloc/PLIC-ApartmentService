import { supabase } from "../libs/supabase";
import { apartment_info } from "../models/apartment_info";

export async function getApartmentsInfoPaginated(
    offset: number,
    limit: number,
): Promise<apartment_info[]> {
    const { data, error } = await supabase
        .from('apartment_info')
        .select('*')
        .range(offset, offset + limit - 1);

    if (error) {
        throw new Error(`Error fetching apartments_info: ${error.message}`);
    }

    return data;
}

export async function getApartmentInfoById(id: number): Promise<apartment_info | null> {
    const { data, error } = await supabase
        .from('apartment_info')
        .select('*')
        .eq('apartment_id', id)
        .single();

    if (error) {
        throw new Error(`Error fetching apartment by ID: ${error.message}`);
    }
    return data;
}

export async function setApartmentInfo(apt: apartment_info): Promise<void> {
    const { data, error } = await supabase.from('apartment_info').insert([apt]).select();

    if (error || !data) {
        throw new Error(`Error inserting apartment: ${error!.message}`);
    }
}

export async function updateApartmentInfo(apt: apartment_info): Promise<void> {
    const { error } = await supabase
        .from('apartment_info')
        .update(apt)
        .eq('apartment_id', apt.apartment_id);

    if (error) {
        throw new Error(`Error updating apartment: ${error.message}`);
    }
}

export async function deleteApartmentInfo(id: number): Promise<void> {
    const { error } = await supabase.from('apartment_info').delete().eq('apartment_id', id);

    if (error) {
        throw new Error(`Error deleting apartment: ${error.message}`);
    }
}
