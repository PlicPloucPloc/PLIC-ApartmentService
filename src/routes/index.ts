import Elysia, { t } from 'elysia';
import bearer from '@elysiajs/bearer';
import { request } from './requests/request';
import { apartment_info } from '../models/apartment_info';
import { Filters } from '../models/filters';
import { createApartment, deleteApartment, priceGoBrr, readApartmentsById, readApartmentsInfoById, readApartmentsInfoPaginated, readApartmentsInfosByOwner, readApartmentsInfosWithNoRelations, updateApartment } from '../services/apartmentsService';
import { handleError, handleMissingBearer, handleResponse } from '../services/responseService';
import { verifyUser } from '../services/authenticationService';
import { getCoordinatesByApartmentId } from '../services/coordinatesServices';

const aptRoutes = new Elysia();


aptRoutes.use(bearer()).get(
    '/siu',
    async ({ bearer }) => {
        try {
            return await priceGoBrr(bearer);
        } catch (error) {
            return handleError(error);
        }
    },
    {
        beforeHandle({ bearer, set }) {
            if (!bearer) return handleMissingBearer(set);
        },
    },
)
// Read aparment informations by ID
aptRoutes.use(bearer()).get(
    '/:id',
    async ({ bearer, params }) => {
        try {
            await verifyUser(bearer);
            const id = parseInt(params.id);
            if (isNaN(id)) {
                return handleResponse('{"message": "Invalid apartment ID}', 400);
            }
            return await readApartmentsInfoById(id);
        } catch (error) {
            return handleError(error);
        }
    },
    {
        beforeHandle({ bearer, set }) {
            if (!bearer) return handleMissingBearer(set);
        },
    },
);

aptRoutes.use(bearer()).get(
    '/owner/:id',
    async ({ bearer, params }) => {
        try {
            await verifyUser(bearer);
            const id = parseInt(params.id);
            if (isNaN(id)) {
                return handleResponse('{"message": "Invalid apartment ID}', 400);
            }
            return await readApartmentsById(id);
        } catch (error) {
            return handleError(error);
        }
    },
    {
        beforeHandle({ bearer, set }) {
            if (!bearer) return handleMissingBearer(set);
        },
    },
);

//Delete aparment by ID
aptRoutes.use(bearer()).delete(
    '/:id',
    async ({ bearer, params }) => {
        try {
            const userId: string = await verifyUser(bearer);
            const id = parseInt(params.id);
            if (isNaN(id)) {
                return handleResponse('{"message": "Invalid apartment ID"}', 400);
            }
            await deleteApartment(userId, id);
            return handleResponse('{"status":"Deleted"}', 204);
        } catch (error) {
            return handleError(error);
        }
    },
    {
        beforeHandle({ bearer, set }) {
            if (!bearer) return handleMissingBearer(set);
        },
    },
);

// Get apartments paginated
aptRoutes.use(bearer()).get(
    '/',
    async ({ bearer, query }) => {
        try {
            await verifyUser(bearer);
            const offset = query.offset ? parseInt(query.offset) : 0;
            const limit = query.limit ? parseInt(query.limit) : 10;
            return await readApartmentsInfoPaginated(offset, limit);
        } catch (error) {
            return handleError(error);
        }
    },
    {
        beforeHandle({ bearer, set }) {
            if (!bearer) return handleMissingBearer(set);
        },
    },
);

// Get owned aparments paginated
aptRoutes.use(bearer()).get(
    '/owned',
    async ({ bearer, query }) => {
        try {
            const userId: string = await verifyUser(bearer);
            const offset = query.offset ? parseInt(query.offset) : 0;
            const limit = query.limit ? parseInt(query.limit) : 10;
            return await readApartmentsInfosByOwner(userId, offset, limit);
        } catch (error) {
            return handleError(error);
        }
    },
    {
        beforeHandle({ bearer, set }) {
            if (!bearer) return handleMissingBearer(set);
        },
    },
);

aptRoutes.use(bearer()).get(
    '/noRelations',
    async ({ bearer, query }) => {
        try {
            await verifyUser(bearer);
            const limit = query.limit ? parseInt(query.limit) : 10;
            const filters: Filters = new Filters(
                query.rent ? parseInt(query.rent) : 10000,
                query.lat ? parseFloat(query.lat) : 48.857547499999995,
                query.lon ? parseFloat(query.lon) : 2.3513764999999998,
                query.min_size ? parseInt(query.min_size) : 5,
                query.max_size ? parseInt(query.max_size) : 100,
                query.is_furnished === 'true' ? true : false,
            )
            return await readApartmentsInfosWithNoRelations(bearer, filters, limit);
        } catch (error) {
            return handleError(error);
        }
    },
    {
        beforeHandle({ bearer, set }) {
            if (!bearer) return handleMissingBearer(set);
        },
    },
);

aptRoutes.use(bearer()).get(
    '/coordinates',
    async ({ bearer,query }) => {
        try {
            await verifyUser(bearer);
            return await getCoordinatesByApartmentId(parseInt(query.apartment_id));
        } catch (error) {
            return handleError(error);
        }
    },
    {
        beforeHandle({ bearer, set }) {
            if (!bearer) return handleMissingBearer(set);
        },
    },
);

aptRoutes.use(bearer()).post(
    '/',
    async ({ bearer, body }) => {
        try {
            const userId: string = await verifyUser(bearer);
            await createApartment(
                bearer,
                userId,
                new request(
                    body.name,
                    body.location,
                    body.is_furnished,
                    body.surface,
                    body.energy_class,
                    body.available_from,
                    body.rent,
                    body.type,
                    body.ges,
                    body.description,
                    body.number_of_rooms,
                    body.number_of_bedrooms,
                    body.floor,
                    body.has_elevator,
                    body.parking_spaces,
                    body.number_of_bathrooms,
                    body.heating_type,
                    body.heating_mod,
                    body.construction_year,
                    body.number_of_floors,
                    body.orientation,
                ),
            );
            return handleResponse('{"status":"Created"}', 200);
        } catch (error) {
            return handleError(error);
        }
    },
    {
        body: t.Object({
            name: t.String({ 
                required: false,
            }),
            is_furnished: t.Boolean({
                required: false,
                default: false,
            }),
            surface: t.Number({
                required: false,
            }),
            energy_class: t.String({
                required: false,
                enum: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
                default: 'G',
            }),
            available_from: t.Date({
                required: false,
            }),
            rent: t.Number({
                required: false,
            }),
            type: t.String({
                required: false,
                enum: ['apartment', 'house', 'condo'],
            }),
            ges: t.String({
                required: false,
                enum: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
                default: 'G',
            }),
            description: t.String({
                required: false,
            }),
            number_of_rooms: t.Number({
                required: false,
            }),
            location: t.String({
                required: false,
            }),
            number_of_bedrooms: t.Number({
                required: false,
            }),
            has_elevator: t.Boolean({
                required: false,
            }),
            floor: t.Number({
                required: false,
            }),
            parking_spaces: t.Number({
                required: false,
                default: 0,
            }),
            number_of_bathrooms: t.Number({
                required: false,
                default: 1,
            }),
            heating_type: t.String({
                required: false,
                default: 'electric',
            }),
            heating_mod: t.String({
                required: false,
                default: 'individual',
            }),
            construction_year: t.Number({
                required: false,
                default: new Date().getFullYear(),
            }),
            number_of_floors: t.Number({
                required: false,
                default: 1,
            }),
            orientation: t.String({
                required: false,
                default: 'N/A',
            }),
        }),
        beforeHandle({ bearer, set }) {
            if (!bearer) return handleMissingBearer(set);
        },
    },
);

aptRoutes.use(bearer()).put(
    '/',
    async ({ bearer, body }) => {
        try {
            const userId: string = await verifyUser(bearer);
            await updateApartment(
                bearer,
                userId,
                new apartment_info(
                    body.apartment_id,
                    body.name,
                    body.location,
                    body.is_furnished,
                    body.surface,
                    body.energy_class,
                    body.available_from,
                    body.rent,
                    0,
                    body.type,
                    body.ges,
                    body.description,
                    body.number_of_rooms,
                    body.number_of_bedrooms,
                    body.floor,
                    body.has_elevator,
                    body.parking_spaces,
                    body.number_of_bathrooms,
                    body.heating_type,
                    body.heating_mod,
                    body.construction_year,
                    body.number_of_floors,
                    body.orientation,
                ),
            );
            return handleResponse('{"status":"Updated}', 200);
        } catch (error) {
            return handleError(error);
        }
    },
    {
        body: t.Object({
            apartment_id: t.Number({
                required: true,
            }),
            name: t.String({ 
                required: false,
            }),
            is_furnished: t.Boolean({
                required: false,
                default: false,
            }),
            surface: t.Number({
                required: false,
            }),
            energy_class: t.String({
                required: false,
                enum: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
                default: 'G',
            }),
            available_from: t.Date({
                required: false,
            }),
            rent: t.Number({
                required: false,
            }),
            type: t.String({
                required: false,
                enum: ['apartment', 'house', 'condo'],
            }),
            ges: t.String({
                required: false,
                enum: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
                default: 'G',
            }),
            description: t.String({
                required: false,
            }),
            number_of_rooms: t.Number({
                required: false,
            }),
            location: t.String({
                required: false,
            }),
            number_of_bedrooms: t.Number({
                required: false,
            }),
            has_elevator: t.Boolean({
                required: false,
            }),
            floor: t.Number({
                required: false,
            }),
            parking_spaces: t.Number({
                required: false,
                default: 0,
            }),
            number_of_bathrooms: t.Number({
                required: false,
                default: 1,
            }),
            heating_type: t.String({
                required: false,
                default: 'electric',
            }),
            heating_mod: t.String({
                required: false,
                default: 'individual',
            }),
            construction_year: t.Number({
                required: false,
                default: new Date().getFullYear(),
            }),
            number_of_floors: t.Number({
                required: false,
                default: 1,
            }),
            orientation: t.String({
                required: false,
                default: 'N/A',
            }),
        }),
        beforeHandle({ bearer, set }) {
            if (!bearer) return handleMissingBearer(set);
        },
    },
);

export { aptRoutes };
