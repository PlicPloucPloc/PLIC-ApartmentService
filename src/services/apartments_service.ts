import { HttpError } from "elysia-http-error";
import { getUser } from "../data/users";
import { deleteApartmentInfo, getApartmentById, getApartmentInfoById, getApartmentsByOwnerPaginated, getApartmentsInfoPaginated, setApartment, setApartmentInfo, updateApartmentInfo } from "../data/apartments";
import request from "../routes/requests/request";
import apartment_info from "../models/apartment_info";

async function readApartmentsInfoById(bearer: string, id: number) : Promise<apartment_info> {
    const userId = await getUser(bearer);
    if (!userId) {
        throw HttpError.Unauthorized("User not found or Unauthorized");
    }

    const apt_info = await getApartmentInfoById(id);
    if (!apt_info) {
        throw HttpError.NotFound("Apartment info not found");
    }

    return apt_info;
}

async function readApartmentsInfoPaginated(bearer: string, offset: number, limit: number) : Promise<apartment_info[]> {
    const userId = await getUser(bearer);
    if (!userId) {
        throw HttpError.Unauthorized("User not found or Unauthorized");
    }

    const apt_infos = await getApartmentsInfoPaginated(offset, limit); 
    
    return apt_infos;
}

async function readApartmentsInfosByOwner(bearer: string, offset: number, limit: number) : Promise<apartment_info[]> {
    const userId = await getUser(bearer);
    if (!userId) {
        throw HttpError.Unauthorized("User not found or Unauthorized");
    }
    const apt = await getApartmentsByOwnerPaginated(userId, offset, limit);
    if (!apt) {
        throw HttpError.NotFound("Apartment not found for this user");
    }
    const apt_infos = [];
    for (let i = 0; i < apt.length; i++){
        console.log("Fetching apt: "  + apt[i].id);
        const apt_info = await getApartmentInfoById(apt[i].id);
        if (!apt_info) {
            throw HttpError.NotFound("Apartment info not found for this user");
        }
        apt_infos.push(apt_info);
    }
    
    return apt_infos;
}

async function createApartment(bearer: string, req: request) : Promise<void>{
    const userId = await getUser(bearer);
    
    if (!userId) {
        throw HttpError.Unauthorized("User do not exist");
    }

    const obj = await setApartment(userId);
    const new_apt = new apartment_info(
        obj,
        req.name,
        req.description,
        req.location,
        req.type,
        req.is_furnished,
        req.surface,
        req.number_of_rooms,
        req.number_of_bedrooms,
        req.energy_class,
        req.ges,
        req.additional_data,
        req.heating_type,
        req.heating_mode,
        req.floor,
        req.elevator,
        req.available_from,
        req.monthly_charges,
        req.security_deposite,
        req.include_charges,
        req.parking_spaces,
    )
    try {
        await setApartmentInfo(new_apt)
    } catch (error) {
       deleteApartmentInfo(obj); 
    }
    console.log("Created apartment: " + new_apt.appartment_id);
}

async function updateApartment(bearer: string,apartment_info: apartment_info) {
    const userId = await getUser(bearer);
    if (!userId) {
        throw HttpError.Unauthorized("User not found or Unauthorized");
    }
    const apt = await getApartmentById(apartment_info.appartment_id);
    if (!apt) {
        throw HttpError.NotFound("Apartment not found");
    }
    if (apt.owner_id != userId){
        throw HttpError.Unauthorized("Apartment not owned");
    }
    await updateApartmentInfo(apartment_info);
    console.log("Updated apartment: " + apt.appartment_id);
}

async function deleteApartment(bearer: string, id: number) : Promise<void> {
    const userId = await getUser(bearer);
    if (!userId) {
        throw HttpError.Unauthorized("User not found or Unauthorized");
    }
    const apt = await getApartmentById(id);
    if (apt.owner_id != userId){
        throw HttpError.Forbidden("Apartment not owned");
    }
    await deleteApartmentInfo(id);
    console.log("Deleted apartment: " + id);
}

export { createApartment,updateApartment, deleteApartment, readApartmentsInfosByOwner, readApartmentsInfoPaginated, readApartmentsInfoById };
