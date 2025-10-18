import Elysia, { t } from 'elysia';
import {
    createApartment,
    deleteApartment,
    readApartmentsInfoById,
    readApartmentsInfoPaginated,
    readApartmentsInfosByOwner,
    readApartmentsInfosWithNoRelations,
    updateApartment,
} from '../services/apartments_service';
import bearer from '@elysiajs/bearer';
import { HttpError } from 'elysia-http-error';
import { request } from './requests/request';
import { apartment_info } from '../models/apartment_info';
import { getCoordinatesByApartmentId } from '../services/coordinates_service';

const aptRoutes = new Elysia();

// Read aparment informations by ID
aptRoutes.use(bearer()).get(
    '/:id',
    async ({ bearer, params }) => {
        try {
            const id = parseInt(params.id);
            if (isNaN(id)) {
                return new Response('{"message": "Invalid apartment ID"}', {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
            return await readApartmentsInfoById(bearer, id);
        } catch (error) {
            if (error instanceof HttpError) {
                return new Response(`{\"message\":${error.message}}`, {
                    status: error.statusCode,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
            throw error;
        }
    },
    {
        beforeHandle({ bearer, set }) {
            if (!bearer) {
                console.log('Bearer not found');
                set.headers['WWW-Authenticate'] = `Bearer realm='sign', error="invalid_request"`;
                return new Response(`{\"message\": \"Bearer not found or invalid"}`, {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
        },
    },
);

//Delete aparment by ID
aptRoutes.use(bearer()).delete(
    '/:id',
    async ({ bearer, params }) => {
        try {
            const id = parseInt(params.id);
            if (isNaN(id)) {
                return new Response('{"message": "Invalid apartment ID"}', {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
            await deleteApartment(bearer, id);
            return new Response('{"status":"OK"}', {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        } catch (error) {
            if (error instanceof HttpError) {
                return new Response(`{\"message\":${error.message}}`, {
                    status: error.statusCode,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
            throw error;
        }
    },
    {
        beforeHandle({ bearer, set }) {
            if (!bearer) {
                console.log('Bearer not found');
                set.headers['WWW-Authenticate'] = `Bearer realm='sign', error="invalid_request"`;

                return new Response(`{\"message\": \"Bearer not found or invalid"}`, {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
        },
    },
);

// Get apartments paginated
aptRoutes.use(bearer()).get(
    '/',
    async ({ bearer, query }) => {
        try {
            const offset = query.offset ? parseInt(query.offset) : 0;
            const limit = query.limit ? parseInt(query.limit) : 10;
            return await readApartmentsInfoPaginated(bearer, offset, limit);
        } catch (error) {
            if (error instanceof HttpError) {
                return new Response(`{\"message\":${error.message}}`, {
                    status: error.statusCode,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
            throw error;
        }
    },
    {
        beforeHandle({ bearer, set }) {
            if (!bearer) {
                console.log('Bearer not found');
                set.headers['WWW-Authenticate'] = `Bearer realm='sign', error="invalid_request"`;

                return new Response(`{\"message\": \"Bearer not found or invalid"}`, {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
        },
    },
);

// Get owned aparments paginated
aptRoutes.use(bearer()).get(
    '/owned',
    async ({ bearer, query }) => {
        try {
            const offset = query.offset ? parseInt(query.offset) : 0;
            const limit = query.limit ? parseInt(query.limit) : 10;
            return await readApartmentsInfosByOwner(bearer, offset, limit);
        } catch (error) {
            if (error instanceof HttpError) {
                return new Response(`{\"message\":${error.message}}`, {
                    status: error.statusCode,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
            throw error;
        }
    },
    {
        beforeHandle({ bearer, set }) {
            if (!bearer) {
                console.log('Bearer not found');
                set.headers['WWW-Authenticate'] = `Bearer realm='sign', error="invalid_request"`;

                return new Response(`{\"message\": \"Bearer not found or invalid"}`, {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
        },
    },
);

aptRoutes.use(bearer()).get(
    '/noRelations',
    async ({ bearer, query }) => {
        try {
            const limit = query.limit ? parseInt(query.limit) : 10;
            return await readApartmentsInfosWithNoRelations(bearer, limit);
        } catch (error) {
            if (error instanceof HttpError) {
                return new Response(`{\"message\":${error.message}}`, {
                    status: error.statusCode,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
            throw error;
        }
    },
    {
        beforeHandle({ bearer, set }) {
            if (!bearer) {
                console.log('Bearer not found');
                set.headers['WWW-Authenticate'] = `Bearer realm='sign', error="invalid_request"`;

                return new Response(`{\"message\": \"Bearer not found or invalid"}`, {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
        },
    },
);

aptRoutes.use(bearer()).get(
    '/coordinates',
    async ({ bearer,query }) => {
        try {
            return await getCoordinatesByApartmentId(bearer, parseInt(query.apartment_id));
        } catch (error) {
            if (error instanceof HttpError) {
                return new Response(`{\"message\":${error.message}}`, {
                    status: error.statusCode,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
            throw error;
        }
    },
    {
        beforeHandle({ bearer, set }) {
            if (!bearer) {
                console.log('Bearer not found');
                set.headers['WWW-Authenticate'] = `Bearer realm='sign', error="invalid_request"`;

                return new Response(`{\"message\": \"Bearer not found or invalid"}`, {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
        },
    },
);

aptRoutes.use(bearer()).post(
    '/',
    async ({ bearer, body }) => {
        try {
            await createApartment(
                bearer,
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
        } catch (error) {
            if (error instanceof HttpError) {
                console.error('Error creating apartment: ' + error.message);
                return new Response(`{\"message\":${error.message}}`, {
                    status: error.statusCode,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
            throw error;
        }
        return new Response('{"status":"OK"}', {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
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
            if (!bearer) {
                console.log('Bearer not found');
                set.headers['WWW-Authenticate'] = `Bearer realm='sign', error="invalid_request"`;

                return new Response(`{\"message\": \"Bearer not found or invalid"}`, {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
        },
    },
);

aptRoutes.use(bearer()).put(
    '/',
    async ({ bearer, body }) => {
        try {
            await updateApartment(
                bearer,
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
            return new Response('{"status":"OK"}', {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        } catch (error) {
            if (error instanceof HttpError) {
                return new Response(`{\"message\":${error.message}}`, {
                    status: error.statusCode,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
            throw error;
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
            if (!bearer) {
                console.log('Bearer not found');
                set.headers['WWW-Authenticate'] = `Bearer realm='sign', error="invalid_request"`;

                return new Response(`{\"message\": \"Bearer not found or invalid"}`, {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
        },
    },
);

export { aptRoutes };
