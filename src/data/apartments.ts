import { supabase } from "../libs/supabase";
import apartment_info from "../models/apartment_info";

async function getApartmentsInfoPaginated(offset: number, limit: number) : Promise<apartment_info[]>{
    const { data, error } = await supabase
      .from("apartment_info")
      .select("*")
      .range(offset, offset + limit -1);

    if (error) {
      throw new Error(`Error fetching apartments_info: ${error.message}`);
    }

    return data;
}

async function getApartmentInfoById(id: number) : Promise<apartment_info | null> {
    const { data, error } = await supabase
        .from("apartment_info")
        .select("*")
        .eq("apartment_id", id)
        .single();

    if (error) {
        throw new Error(`Error fetching apartment by ID: ${error.message}`);
    }
    return data;
}

async function setApartmentInfo(apt: apartment_info) : Promise<void>{
    const { data, error } = await supabase
        .from("apartment_info")
        .insert([apt])
        .select();
    
    if (error || !data) {
        throw new Error(`Error inserting apartment: ${error!.message}`);
    }
}

async function updateApartmentInfo(apt: apartment_info) : Promise<void>{
    const { error } = await supabase
        .from("apartment_info")
        .update(apt)
        .eq("apartment_id", apt.apartment_id);

    if (error) {
        throw new Error(`Error updating apartment: ${error.message}`);
    }
}

async function deleteApartmentInfo(id: number) : Promise<void>{
    const { error } = await supabase
        .from("apartment_info")
        .delete()
        .eq("apartment_id", id);

    if (error) {
        throw new Error(`Error deleting apartment: ${error.message}`);
    }

}

async function getApartmentsByOwnerPaginated(ownerId: string, offset: number, limit: number) : Promise<any[]>{
    const { data, error } = await supabase
      .from("apartments")
      .select("*")
      .eq("owner_id", ownerId)
      .range(offset, offset + limit -1);

    if (error) {
      throw new Error(`Error fetching apartments: ${error.message}`);
    }

    return data;
}

async function getApartmentsByOwner(ownerId: string) : Promise<apartment_info[]> {
    const { data, error } = await supabase
        .from("apartment")
        .select("*")
        .eq("owner_id", ownerId);

    if (error) {
        throw new Error(`Error fetching apartments by owner: ${error.message}`);
    }

    return data;
}

async function getApartmentById(aptId: number) : Promise<any>{
    const { data, error } = await supabase
        .from("apartments")
        .select()
        .eq("id",aptId)
        .single();
    if (error) {
        throw new Error("Error creating apartment: " + error.message);
    }
    return data;
}

async function setApartment(userId: string) : Promise<number>{
    const { data, error } = await supabase
        .from("apartments")
        .insert([{ 
            owner_id: userId,
        }])
        .select();

    if (error) {
        throw new Error(`Error creating apartment: ${error.message}`);
    }
    return data[0].id;
}

async function delApartment(aptId: string) : Promise<void>{
    const { error } = await supabase
        .from("apartments")
        .delete()
        .eq("id", aptId);

    if (error) {
        throw new Error(`Error creating apartment: ${error.message}`);
    }
}

export {
    getApartmentsInfoPaginated,
    getApartmentInfoById,
    setApartmentInfo,
    updateApartmentInfo,
    deleteApartmentInfo,

    getApartmentsByOwnerPaginated,
    getApartmentsByOwner,
    getApartmentById,
    setApartment,
    delApartment
};
