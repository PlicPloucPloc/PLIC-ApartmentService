import { supabase } from "../libs/supabase";
import appartment_info from "../models/apartment_info";

async function getApartmentsInfoPaginated(offset: number, limit: number) : Promise<appartment_info[]>{
  const { data, error } = await supabase
    .from("appartments")
    .select("*")
    .range(offset, offset + limit -1);

  if (error) {
    throw new Error(`Error fetching apartments: ${error.message}`);
  }

  return data;
}

async function getApartmentsByOwnerPaginated(ownerId: string, offset: number, limit: number) : Promise<any[]>{
  const { data, error } = await supabase
    .from("appartments")
    .select("*")
    .eq("owner_id", ownerId)
    .range(offset, offset + limit -1);

  if (error) {
    throw new Error(`Error fetching apartments: ${error.message}`);
  }

  return data;
}

async function setApartmentInfo(apt: appartment_info) : Promise<void>{
    const { data, error } = await supabase
        .from("appartment_info")
        .insert([apt])
        .select();
    
    if (error || !data) {
        throw new Error(`Error inserting apartment: ${error!.message}`);
    }
}

async function updateApartmentInfo(apt: appartment_info) : Promise<void>{
    const { error } = await supabase
        .from("appartment_info")
        .update(apt)
        .eq("appartment_id", apt.appartment_id);

    if (error) {
        throw new Error(`Error updating apartment: ${error.message}`);
    }
}

async function getApartmentsByOwner(ownerId: string) : Promise<appartment_info[]> {
    const { data, error } = await supabase
        .from("appartment_info")
        .select("*")
        .eq("owner_id", ownerId);

    if (error) {
        throw new Error(`Error fetching apartments by owner: ${error.message}`);
    }

    return data;
}

async function getApartmentInfoById(id: number) : Promise<appartment_info | null> {
    const { data, error } = await supabase
        .from("appartment_info")
        .select("*")
        .eq("appartment_id", id)
        .single();

    if (error) {
        throw new Error(`Error fetching apartment by ID: ${error.message}`);
    }
    return data;
}

async function deleteApartmentInfo(id: number) : Promise<void>{
    const { error } = await supabase
        .from("appartment_info")
        .delete()
        .eq("appartment_id", id);

    if (error) {
        throw new Error(`Error deleting apartment: ${error.message}`);
    }

}

async function setApartment(userId: string) : Promise<number>{
    const { data, error } = await supabase
        .from("appartments")
        .insert([{ 
            owner_id: userId,
        }])
        .select();

    if (error) {
        throw new Error(`Error creating apartment: ${error.message}`);
    }
    return data[0].id;
}

async function getApartmentById(aptId: number) : Promise<any>{
    const { data, error } = await supabase
        .from("appartments")
        .select()
        .eq("id",aptId)
        .single();
    if (error) {
        throw new Error("Error creating apartment: " + error.message);
    }
    return data;
}

async function delApartment(aptId: string) : Promise<void>{
    const { error } = await supabase
        .from("appartments")
        .delete()
        .eq("id", aptId);

    if (error) {
        throw new Error(`Error creating apartment: ${error.message}`);
    }
}

export {
    getApartmentsInfoPaginated,
    getApartmentsByOwnerPaginated,
    setApartmentInfo,
    updateApartmentInfo,
    getApartmentsByOwner,
    getApartmentInfoById,
    deleteApartmentInfo,
    setApartment,
    getApartmentById,
    delApartment
};
