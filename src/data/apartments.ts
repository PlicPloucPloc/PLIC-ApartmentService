import { supabase } from "../libs/supabase";
import appartments from "../models/apartments";

async function getApartmentsPaginated(offset: number, limit: number) : Promise<appartments[]>{
  const { data, error } = await supabase
    .from("apartments")
    .select("*")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit -1);

  if (error) {
    throw new Error(`Error fetching apartments: ${error.message}`);
  }

  return data;
}

async function setApartment(apt: appartments){
    const { data, error } = await supabase
        .from("apartments")
        .insert([apt]);
    
    if (error) {
        throw new Error(`Error inserting apartment: ${error.message}`);
    }
    
    return data;
}

async function updateApartment(apt: appartments) {
    const { data, error } = await supabase
        .from("apartments")
        .update(apt)
        .eq("appartment_id", apt.appartment_id);

    if (error) {
        throw new Error(`Error updating apartment: ${error.message}`);
    }

    return data;
}

async function getApartmentById(id: number) : Promise<appartments | null> {
    const { data, error } = await supabase
        .from("apartments")
        .select("*")
        .eq("appartment_id", id)
        .single();

    if (error) {
        throw new Error(`Error fetching apartment by ID: ${error.message}`);
    }

    return data;
}

async function deleteApartment(id: number) {
    const { data, error } = await supabase
        .from("apartments")
        .delete()
        .eq("appartment_id", id);

    if (error) {
        throw new Error(`Error deleting apartment: ${error.message}`);
    }

    return data;
}

export default {
    getApartmentsPaginated,
    setApartment,
    updateApartment,
    getApartmentById,
    deleteApartment
};
