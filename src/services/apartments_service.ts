import { HttpError } from 'elysia-http-error';
import { getUser } from '../data/users';
import { addApartmentNode, getApartmentIdNoRelations } from '../data/likes';
import { request } from '../routes/requests/request';
import { estimatePrice } from './price_estimation_service';
import { apartment_info } from '../models/apartment_info';
import { deleteApartmentInfo, getApartmentInfoById, getApartmentsInfoPaginated, setApartmentInfo, updateApartmentInfo } from '../data/apartments_infos';
import { getApartmentById, getApartmentsByOwnerPaginated, setApartment } from '../data/apartments';
import { setCoordinatesForApartmentId } from './coordinates_service';

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

export async function readApartmentsInfosWithNoRelations(
    bearer: string,
    limit: number
): Promise<apartment_info[]> {
    const userId = await getUser(bearer);
    if (!userId) {
        throw HttpError.Unauthorized('User not found or Unauthorized');
    }

    const apt_ids = await getApartmentIdNoRelations(bearer, limit);
    if (!apt_ids) {
        throw HttpError.NotFound('No apartments found for this user');
    }

    const apt_infos = [];
    for (let i = 0; i < apt_ids.length; i++) {
        console.log('Fetching apt: ' + apt_ids[i]);
        const apt_info = await getApartmentInfoById(apt_ids[i]);
        if (!apt_info) {
            throw HttpError.NotFound('Apartment info not found for this user');
        }
        apt_infos.push(apt_info);
    }

    return apt_infos;
}

export async function readApartmentsInfosByOwner(
    bearer: string,
    offset: number,
    limit: number,
): Promise<apartment_info[]> {
    const userId = await getUser(bearer);
    if (!userId) {
        throw HttpError.Unauthorized('User not found or Unauthorized');
    }
    const apt = await getApartmentsByOwnerPaginated(userId, offset, limit);
    if (!apt) {
        throw HttpError.NotFound('Apartment not found for this user');
    }
    const apt_infos = [];
    for (let i = 0; i < apt.length; i++) {
        console.log('Fetching apt: ' + apt[i].id);
        const apt_info = await getApartmentInfoById(apt[i].id);
        if (!apt_info) {
            throw HttpError.NotFound('Apartment info not found for this user');
        }
        apt_infos.push(apt_info);
    }

    return apt_infos;
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

