import Elysia, { t } from "elysia";
import { createApartment, deleteApartment, readApartmentsInfoById, readApartmentsInfoPaginated, readApartmentsInfosByOwner, updateApartment } from "../services/apartments_service";
import bearer from "@elysiajs/bearer";
import { HttpError } from "elysia-http-error";
import request from "./requests/request";
import apartment_info from "../models/apartment_info";

const aptRoutes = new Elysia({prefix: '/apt'});

// Read aparment informations by ID
aptRoutes.use(bearer()).get('/:id', async ({bearer, params}) => {
    try {
        const id = parseInt(params.id);
        if (isNaN(id)) {
            return new Response("{\"message\": \"Invalid apartment ID\"}", {status: 400, headers: {"Content-Type" : "application/json"}});
        }
        return await readApartmentsInfoById(bearer, id);
    } 
    catch (error) {
        if (error instanceof HttpError) {
            return new Response(`{\"message\":${error.message}}`, {status: error.statusCode, headers: {"Content-Type": "application/json"}});
        }
        throw error;
    }
},{
    beforeHandle({ bearer, set }) {
        if (!bearer) {
            console.log("Bearer found");
            set.headers[
                'WWW-Authenticate'
            ] = `Bearer realm='sign', error="invalid_request"`
            return new Response(`{\"message\": \"Bearer not found or invalid"}`, { status: 401, headers: { "Content-Type": "application/json" } });

        }
    }
});

//Delete aparment by ID
aptRoutes.use(bearer()).delete('/:id', async ({bearer, params}) => {
    try {
        const id = parseInt(params.id);
        if (isNaN(id)) {
            return new Response("{\"message\": \"Invalid apartment ID\"}", {status: 400, headers: {"Content-Type" : "application/json"}});
        }
        await deleteApartment(bearer, id);
        return new Response("{\"status\":\"OK\"}", {status: 200, headers: { "Content-Type": "application/json"}})
    }
    catch (error) {
        if (error instanceof HttpError) {
            return new Response(`{\"message\":${error.message}}`, {status: error.statusCode, headers: {"Content-Type": "application/json"}});
        }
        throw error;
    }
},{
    beforeHandle({ bearer, set }) {
        if (!bearer) {
            console.log("Bearer found");
            set.headers[
                'WWW-Authenticate'
            ] = `Bearer realm='sign', error="invalid_request"`

            return new Response(`{\"message\": \"Bearer not found or invalid"}`, { status: 401, headers: { "Content-Type": "application/json" } });
        }
    }
});

// Get apartments paginated
aptRoutes.use(bearer()).get('', async ({bearer,query}) => {
    try {
        const offset = query.offset ? parseInt(query.offset) : 0;
        const limit = query.limit ? parseInt(query.limit) : 10;
        return await readApartmentsInfoPaginated(bearer, offset, limit);
    } catch (error) {
        if (error instanceof HttpError) {
            return new Response(`{\"message\":${error.message}}`, {status: error.statusCode, headers: {"Content-Type": "application/json"}});
        }
        throw error;
    }
},{
    beforeHandle({ bearer, set }) {
        if (!bearer) {
            console.log("Bearer found");
            set.headers[
                'WWW-Authenticate'
            ] = `Bearer realm='sign', error="invalid_request"`

            return new Response(`{\"message\": \"Bearer not found or invalid"}`, { status: 401, headers: { "Content-Type": "application/json" } });
        }
    }
});

// Get owned aparments paginated
aptRoutes.use(bearer()).get('/owned', async ({bearer,query}) => {
    try {
        const offset = query.offset ? parseInt(query.offset) : 0;
        const limit = query.limit ? parseInt(query.limit) : 10;
        return await readApartmentsInfosByOwner(bearer, offset, limit);
    } catch (error) {
        if (error instanceof HttpError) {
            return new Response(`{\"message\":${error.message}}`, {status: error.statusCode, headers: {"Content-Type": "application/json"}});
        }
        throw error;
    }
},{
    beforeHandle({ bearer, set }) {
        if (!bearer) {
            console.log("Bearer found");
            set.headers[
                'WWW-Authenticate'
            ] = `Bearer realm='sign', error="invalid_request"`

            return new Response(`{\"message\": \"Bearer not found or invalid"}`, { status: 401, headers: { "Content-Type": "application/json" } });
        }
    }
});

aptRoutes.use(bearer()).post('/', async ({bearer, body}) => {
    try{
        await createApartment(bearer, new request(
            body.name,
            body.description,
            body.location,
            body.type,
            body.is_furnished,
            body.surface,
            body.number_of_rooms,
            body.number_of_bedrooms,
            body.energy_class,
            body.ges,
            body.additional_data,
            body.heating_type,
            body.heating_mode,
            body.floor,
            body.elevator,
            body.available_from,
            body.monthly_charges,
            body.security_desposit,
            body.include_charges,
            body.parking_spaces,
            body.platform_id
        )); 
    }
    catch (error) {
        if (error instanceof HttpError) {
            return new Response(`{\"message\":${error.message}}`, {status: error.statusCode, headers: {"Content-Type": "application/json"}});
        }
        throw error;
    }
    return new Response("{\"status\":\"OK\"}", {status: 200, headers: { "Content-Type": "application/json"}})
},
{
    body: t.Object ({
        name: t.String({
            required: true,
        }),
        description: t.String({
            required: false,
        }),
        location: t.String({
            required: true,
        }),
        type: t.String({
            required: true,
            enum: ['apartment', 'house', 'condo']
        }),
        is_furnished: t.Boolean({
            required: false,
            default: false
        }),
        surface: t.Number({
            required: true,
        }),
        number_of_rooms: t.Number({
            required: true,
        }),
        number_of_bedrooms: t.Number({
            required: true,
        }),
        energy_class: t.String({
            required: false,
            enum: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
            default: 'G'
        }),
        ges: t.String({
            required: false,
            enum: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
            default: 'G'
        }),
        additional_data: t.String({
            required: false,
        }),
        heating_type: t.String({
            required: false,
            enum: ['electric', 'gas', 'oil', 'wood', 'solar', 'geothermal'],
            default: 'electric'
        }),
        heating_mode: t.String({
            required: false,
            enum: ['individual', 'collective'],
            default: 'individual'
        }),
        floor: t.Number({
            required: false,
        }),
        elevator: t.Boolean({
            required: false,
        }),
        available_from: t.String({
            required: true,
        }),
        monthly_charges: t.Number({
            required: true,
        }),
        security_desposit: t.Number({
            required: true,
        }),
        include_charges: t.Boolean({
            required: false,
            default:false
        }),
        parking_spaces: t.Number({
            required: false,
            default: 0
        }),
        platform_id: t.String({
            required: false,
        }),
    }),
    beforeHandle({ bearer, set }) {
        if (!bearer) {
            console.log("Bearer found");
            set.headers[
                'WWW-Authenticate'
            ] = `Bearer realm='sign', error="invalid_request"`

            return new Response(`{\"message\": \"Bearer not found or invalid"}`, { status: 401, headers: { "Content-Type": "application/json" } });
        }
    }
});

aptRoutes.use(bearer()).put('/', async ({ bearer,body }) => {
    try{
        await updateApartment(bearer, new apartment_info(
            body.appartment_id,
            body.name,
            body.description,
            body.location,
            body.type,
            body.is_furnished,
            body.surface,
            body.number_of_rooms,
            body.number_of_bedrooms,
            body.energy_class,
            body.ges,
            body.additional_data,
            body.heating_type,
            body.heating_mode,
            body.floor,
            body.elevator,
            body.available_from,
            body.monthly_charges,
            body.security_desposit,
            body.include_charges,
            body.parking_spaces
        ))
        return new Response("{\"status\":\"OK\"}", {status: 200, headers: { "Content-Type": "application/json"}})
    } catch(error){
        if (error instanceof HttpError){
            return new Response(`{\"message\":${error.message}}`, {status: error.statusCode, headers: {"Content-Type": "application/json"}});
        }
        throw error;
    }
},
{
    body: t.Object ({
        appartment_id: t.Number({
            required: true
        }),
        name: t.String({
            required: true,
        }),
        description: t.String({
            required: false,
        }),
        location: t.String({
            required: true,
        }),
        type: t.String({
            required: true,
            enum: ['apartment', 'house', 'condo']
        }),
        is_furnished: t.Boolean({
            required: false,
            default: false
        }),
        surface: t.Number({
            required: true,
        }),
        number_of_rooms: t.Number({
            required: true,
        }),
        number_of_bedrooms: t.Number({
            required: true,
        }),
        energy_class: t.String({
            required: false,
            enum: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
            default: 'G'
        }),
        ges: t.String({
            required: false,
            enum: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
            default: 'G'
        }),
        additional_data: t.String({
            required: false,
        }),
        heating_type: t.String({
            required: false,
            enum: ['electric', 'gas', 'oil', 'wood', 'solar', 'geothermal'],
            default: 'electric'
        }),
        heating_mode: t.String({
            required: false,
            enum: ['individual', 'collective'],
            default: 'individual'
        }),
        floor: t.Number({
            required: false,
        }),
        elevator: t.Boolean({
            required: false,
        }),
        available_from: t.String({
            required: true,
        }),
        monthly_charges: t.Number({
            required: true,
        }),
        security_desposit: t.Number({
            required: true,
        }),
        include_charges: t.Boolean({
            required: false,
            default:false
        }),
        parking_spaces: t.Number({
            required: false,
            default: 0
        })
    }),
    beforeHandle({ bearer, set }) {
        if (!bearer) {
            console.log("Bearer found");
            set.headers[
                'WWW-Authenticate'
            ] = `Bearer realm='sign', error="invalid_request"`

            return new Response(`{\"message\": \"Bearer not found or invalid"}`, { status: 401, headers: { "Content-Type": "application/json" } });
        }
    }

});

export {aptRoutes};
