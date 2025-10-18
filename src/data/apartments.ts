import { supabase } from '../libs/supabase';
import { apartment_info } from '../models/apartment_info';

export async function getApartmentsByOwnerPaginated(
    ownerId: string,
    offset: number,
    limit: number,
): Promise<any[]> {
    const { data, error } = await supabase
        .from('apartments')
        .select('*')
        .eq('owner_id', ownerId)
        .range(offset, offset + limit - 1);

    if (error) {
        throw new Error(`Error fetching apartments: ${error.message}`);
    }

    return data;
}

export async function getApartmentsByOwner(ownerId: string): Promise<apartment_info[]> {
    const { data, error } = await supabase.from('apartment').select('*').eq('owner_id', ownerId);

    if (error) {
        throw new Error(`Error fetching apartments by owner: ${error.message}`);
    }

    return data;
}

export async function getApartmentById(aptId: number): Promise<any> {
    const { data, error } = await supabase.from('apartments').select().eq('id', aptId).single();
    if (error) {
        throw new Error('Error creating apartment: ' + error.message);
    }
    return data;
}

export async function setApartment(userId: string): Promise<number> {
    const { data, error } = await supabase
        .from('apartments')
        .insert([
            {
                owner_id: userId,
                platform_id: 'swappart',
            },
        ])
        .select();

    if (error) {
        console.error('Error creating apartment:', error.message);
        throw new Error(`Error creating apartment: ${error.message}`);
    }
    return data[0].id;
}

export async function delApartment(aptId: string): Promise<void> {
    const { error } = await supabase.from('apartments').delete().eq('id', aptId);

    if (error) {
        throw new Error(`Error creating apartment: ${error.message}`);
    }
}
