import { HttpError } from "elysia-http-error";
import { getUser } from "../data/users";
import { apartment_coordinates } from "../models/apartment_coordinates";
import { getApartmentCoordinates, setApartmentCoordinates } from "../data/apartment_coordinates";
import { getCoordinates } from "../data/openstreetmap";

export async function getCoordinatesByApartmentId(bearer: string, apartment_id: number): Promise<{ lat: number; lon: number }> {
    console.log('Getting coordinates for apartment ID:', apartment_id);
    const userId = await getUser(bearer);
    if (!userId) {
        throw HttpError.Unauthorized('User not found or Unauthorized');
    }
    const coordinates: apartment_coordinates = await getApartmentCoordinates(apartment_id);
    console.log('Retrieved coordinates:', coordinates);
    if (!coordinates) {
        throw HttpError.NotFound('Apartment info not found');
    }
    return { lat: coordinates.lat, lon: coordinates.lon };
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
