import { HttpError } from 'elysia-http-error';
import { getUser } from '../data/users';
import { addApartmentNode, getApartmentIdNoRelations } from '../data/likes';
import { request } from '../routes/requests/request';
import { estimatePrice } from './price_estimation_service';
import { apartment_info } from '../models/apartment_info';
import { deleteApartmentInfo, getApartmentInfoById, getApartmentInfoFiltered, getApartmentsInfoPaginated, setApartmentInfo, updateApartmentInfo } from '../data/apartments_infos';
import { getApartmentById, getApartmentsByOwnerPaginated, setApartment } from '../data/apartments';
import { setCoordinatesForApartmentId } from './coordinates_service';
import { Filters } from '../models/filters';
import { getApartmentCoordinates } from '../data/apartment_coordinates';
import { coordinates } from '../models/coordinates';
import { getCoordinates } from '../data/openstreetmap';

export async function readApartmentsInfoById(bearer: string, id: number): Promise<apartment_info> {
    const userId = await getUser(bearer);
    if (!userId) {
        throw HttpError.Unauthorized('User not found or Unauthorized');
    }

    const apt_info = await getApartmentInfoById(id);
    if (!apt_info) {
        throw HttpError.NotFound('Apartment info not found');
    }

    return apt_info;
}

export async function readApartmentsInfosByOwner(
    bearer: string,
    offset: number,
    limit: number
): Promise<apartment_info[]> {
    const userId = await getUser(bearer);
    if (!userId) {
        throw HttpError.Unauthorized('User not found or Unauthorized');
    }

    const apt_infos: apartment_info[] = await getApartmentsByOwnerPaginated(userId,offset,limit);

    return apt_infos;
}

export async function readApartmentsInfoPaginated(
    bearer: string,
    offset: number,
    limit: number,
): Promise<apartment_info[]> {
    const userId = await getUser(bearer);
    if (!userId) {
        throw HttpError.Unauthorized('User not found or Unauthorized');
    }

    const apt_infos = await getApartmentsInfoPaginated(offset, limit);

    return apt_infos;
}

export function getDistance(origin: coordinates , destination: coordinates): number {
    const R = 6371; // Radius of the earth in km

    // Convert degrees to radians
    const toRad = (value: number) => (value * Math.PI) / 180;
    var lat1: number = toRad(origin.lat);
    var lon1: number = toRad(origin.lon);
    var lat2 = toRad(destination.lat);
    var lon2 = toRad(destination.lon);
    
    // Calculate distance using Haversine formula
    const dLat = Math.pow(Math.sin((lat2 - lat1)/2), 2);
    const dLon = Math.pow(Math.sin((lon2 - lon1)/2), 2);
    const dist = R * 2 * Math.asin(Math.sqrt(dLat + Math.cos(lat1) * Math.cos(lat2) * dLon));

    return dist;
}

async function filterDistance(apt: apartment_info,
                                destination: coordinates,
                                ): Promise<number> {
    var origin: coordinates = await getApartmentCoordinates(apt.apartment_id);
    var dist: number = getDistance(origin, destination);
    if (dist > 30) {
        return -1;
    }
    return apt.apartment_id;
}


export async function readApartmentsInfosWithNoRelations(
    bearer: string,
    filters: Filters,
    limit: number
): Promise<apartment_info[]> {
    const userId: string = await getUser(bearer);
    if (!userId) {
        throw HttpError.Unauthorized('User not found or Unauthorized');
    }
    var coordinates: coordinates = await getCoordinates(filters.location);
    var apts: apartment_info[] = (await getApartmentInfoFiltered(filters, limit*5));
    console.log('Apartment: ', apts);
    var apts_filtered: apartment_info[] = [];
    for (var apt of apts) {
        if (await filterDistance(apt, coordinates) == -1) {
            apts_filtered.push(apt);
        }
    }; 
    var rec_apt_ids = await getApartmentIdNoRelations(bearer, limit);
    console.log('Apartment: ', apts_filtered);
    console.log('Apartment Recommended: ', rec_apt_ids);
    if (!apts_filtered || !rec_apt_ids) {
        throw HttpError.NotFound('No apartments found for this user');
    }
    var apartments: apartment_info[] = [];
    for (var apt of apts_filtered){
        if (rec_apt_ids.includes(apt.apartment_id) ){
            console.log('OK');
            apartments.push(apt);
        }
    }
    if (apartments.length < limit){
       for (var apt of apts_filtered){
           if (apartments.length >= limit){
               break;
           }
           if (!apartments.includes(apt)){
               apartments.push(apt)
           }
       } 
    }
    return apartments;
}

export async function createApartment(bearer: string, req: request): Promise<void> {
    const userId = await getUser(bearer);
    console.log('Request to create apartment: ', req);

    if (!userId) {
        throw HttpError.Unauthorized('User do not exist');
    }
    console.log('User ID: ' + userId);
    const obj = await setApartment(userId);
    console.log('Created apartment with ID: ' + obj);
    var estimated_price : number = await estimatePrice(bearer, req);
    console.log('Estimated price: ' + estimated_price);
    const new_apt = new apartment_info(
        obj,
        req.name,
        req.location,
        req.is_furnished,
        req.surface,
        req.energy_class,
        req.available_from,
        req.rent,
        estimated_price,
        req.type,
        req.ges,
        req.description,
        req.number_of_rooms,
        req.number_of_bedrooms,
        req.floor,
        req.has_elevator,
        req.parking_spaces,
        req.number_of_bathrooms,
        req.heating_type,
        req.heating_mode,
        req.construction_year,
        req.number_of_floors,
        req.orientation
    );
    try {
        await setApartmentInfo(new_apt);
        console.log('Created apartment info for apartment');
        await addApartmentNode(bearer, new_apt.apartment_id);
        await setCoordinatesForApartmentId(new_apt.apartment_id, new_apt.location);
        
    } catch (error) {
        console.error('Error creating apartment info: ', error);
        deleteApartmentInfo(obj);
        deleteApartment(bearer, obj);
        throw HttpError.Internal('Error creating apartment info : ' + error);
    }
    console.log('Created apartment: ' + new_apt.apartment_id);
}

export async function updateApartment(bearer: string, apartment_info: apartment_info) {
    const userId = await getUser(bearer);
    if (!userId) {
        throw HttpError.Unauthorized('User not found or Unauthorized');
    }
    const apt = await getApartmentById(apartment_info.apartment_id);
    if (!apt) {
        throw HttpError.NotFound('Apartment not found');
    }
    if (apt.owner_id != userId) {
        throw HttpError.Unauthorized('Apartment not owned');
    }
    var estimated_price : number = await estimatePrice(bearer, apartment_info);
    apartment_info.estimated_price = estimated_price;
    await updateApartmentInfo(apartment_info);
    console.log('Updated apartment: ' + apt.apartment_id);
}

export async function deleteApartment(bearer: string, id: number): Promise<void> {
    const userId = await getUser(bearer);
    if (!userId) {
        throw HttpError.Unauthorized('User not found or Unauthorized');
    }
    const apt = await getApartmentById(id);
    if (apt.owner_id != userId) {
        throw HttpError.Forbidden('Apartment not owned');
    }
    await deleteApartmentInfo(id);
    console.log('Deleted apartment: ' + id);
}

