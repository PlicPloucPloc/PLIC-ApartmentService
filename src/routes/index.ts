import Elysia, { t } from 'elysia';
import {
    createApartment,
    deleteApartment,
    readApartmentsInfoById,
    readApartmentsInfoPaginated,
    readApartmentsInfosByOwner,
    updateApartment,
} from '../services/apartments_service';
import bearer from '@elysiajs/bearer';
import { HttpError } from 'elysia-http-error';
import request from './requests/request';
import apartment_info from '../models/apartment_info';

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
                    body.elevator,
                    body.parking_spaces,
                ),
            );
        } catch (error) {
            if (error instanceof HttpError) {
                return new Response(`{\"message\":${error.message}}`, {
                    status: error.statusCode,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
            throw error;
        }
        return new Response('{"status":"OK"}', {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    },
    {
        body: t.Object({
            name: t.String({
                required: true,
            }),
            location: t.String({
                required: true,
            }),
            is_furnished: t.Boolean({
                required: false,
                default: false,
            }),
            surface: t.Number({
                required: true,
            }),
            energy_class: t.String({
                required: false,
                enum: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
                default: 'G',
            }),
            available_from: t.String({
                required: true,
            }),
            rent: t.Number({
                required: true,
            }),
            type: t.String({
                required: true,
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
                required: true,
            }),
            number_of_bedrooms: t.Number({
                required: true,
            }),
            floor: t.Number({
                required: false,
            }),
            elevator: t.Boolean({
                required: false,
            }),
            parking_spaces: t.Number({
                required: false,
                default: 0,
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
                    body.type,
                    body.ges,
                    body.description,
                    body.number_of_rooms,
                    body.number_of_bedrooms,
                    body.floor,
                    body.elevator,
                    body.parking_spaces,
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
                required: true,
            }),
            location: t.String({
                required: true,
            }),
            is_furnished: t.Boolean({
                required: false,
                default: false,
            }),
            surface: t.Number({
                required: true,
            }),
            energy_class: t.String({
                required: false,
                enum: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
                default: 'G',
            }),
            available_from: t.String({
                required: true,
            }),
            rent: t.Number({
                required: true,
            }),
            type: t.String({
                required: true,
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
                required: true,
            }),
            number_of_bedrooms: t.Number({
                required: true,
            }),
            floor: t.Number({
                required: false,
            }),
            elevator: t.Boolean({
                required: false,
            }),
            parking_spaces: t.Number({
                required: false,
                default: 0,
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
