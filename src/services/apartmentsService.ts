import { HttpError } from 'elysia-http-error';
import { getUser } from '../data/users';
import { addApartmentNode, getApartmentIdAllRelations, orderApartmentIds } from '../data/likes';
import { request } from '../routes/requests/request';
import { apartment_info } from '../models/apartment_info';
import { deleteApartmentInfo, getApartmentInfoById, getApartmentInfoFiltered, getApartmentsInfoPaginated, setApartmentInfo, updateApartmentInfo } from '../data/apartments_infos';
import { getApartmentById, getApartmentsByOwnerPaginated, setApartment } from '../data/apartments';
import { Filters } from '../models/filters';
import { coordinates } from '../models/coordinates';
import { getCoordinates } from '../data/openstreetmap';
import { getLogger } from './logger';
import { Logger } from 'winston';
import { relation } from '../models/relations';
import { estimatePrice } from './priceEstimationService';
import { setCoordinatesForApartmentId } from './coordinatesService';

const logger: Logger = getLogger('Apartments');

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
    var aptRel: relation[] = await getApartmentIdAllRelations(bearer);
    aptRel.forEach(apt => logger.info(`Apartment relation: ${apt.apt.apartment_id}`));
    var apts: apartment_info[] = (await getApartmentInfoFiltered(filters, coordinates.lat, coordinates.lon, limit*5, aptRel.map(rel => rel.apt.apartment_id)));
    apts.forEach(apt => logger.info(`Apartment: ${apt.apartment_id}`));
    var ordered_aptIds: number[] = await orderApartmentIds(bearer, apts.map(apt => apt.apartment_id));
    ordered_aptIds.forEach(apt => logger.info(`Apartment ordered: ${apt}`));
    var ordered_apts: apartment_info[] = [];
    for (let i = 0; i < limit; i++){
        ordered_apts.push(apts.find(apt => apt.apartment_id == ordered_aptIds[i])!);
    }
    return ordered_apts;
}

export async function createApartment(bearer: string, req: request): Promise<void> {
    const userId = await getUser(bearer);

    if (!userId) {
        throw HttpError.Unauthorized('User do not exist');
    }
    const obj = await setApartment(userId);
    var estimated_price : number = await estimatePrice(bearer, req);
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
        await addApartmentNode(bearer, new_apt.apartment_id);
        await setCoordinatesForApartmentId(new_apt.apartment_id, new_apt.location);
        
    } catch (error) {
        deleteApartmentInfo(obj);
        deleteApartment(bearer, obj);
        throw HttpError.Internal('Error creating apartment info : ' + error);
    }
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
}

