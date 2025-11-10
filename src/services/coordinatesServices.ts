import { HttpError } from "elysia-http-error";
import { apartment_coordinates } from "../models/apartment_coordinates";
import { getApartmentCoordinates, setApartmentCoordinates } from "../data/apartment_coordinates";
import { getCoordinates } from "../data/openstreetmap";
import { getLogger } from "./logger";
import { Logger } from "winston";
import { handleResponse } from "./responseService";

const logger: Logger = getLogger('CoordinatesService');

export async function getCoordinatesByApartmentId(apartment_id: number): Promise<Response> {
    logger.info(`Getting coordinates for apartment ID: ${apartment_id}`);
    const coordinates: apartment_coordinates = await getApartmentCoordinates(apartment_id);
    logger.info(`Retrieved coordinates: ${coordinates}`);
    if (!coordinates) {
        throw HttpError.NotFound('Apartment info not found');
    }
    return handleResponse('{ "lat": coordinates.lat, "lon": coordinates.lon }',200);
}

export async function setCoordinatesForApartmentId(apartment_id: number, address: string): Promise<void> {
    try{
        const coordinates: {lat: number, lon: number} = await getCoordinates(address);
        await setApartmentCoordinates({apartment_id: apartment_id, lat: coordinates.lat, lon: coordinates.lon});
    }
    catch (error) {
        throw HttpError.Internal('Could not set coordinates for apartment: ' + (error as Error).message);
    }
}
