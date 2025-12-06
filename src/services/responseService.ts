import { AuthApiError } from "@supabase/supabase-js";
import { HttpError } from "elysia-http-error";

export function handleMissingBearer(set: any) : Response {
    set.headers['WWW-Authenticate'] = `Bearer realm='sign', error="invalid_request"`;
    return handleResponse(`{message: \"Bearer not found or invalid"}`, 401);
}

export function handleError(error: any) : Response {
    const catchedErrors = ['Invalid login credentials', 'Email not confirmed'];

    if (error instanceof AuthApiError && catchedErrors.includes(error.message)) {
        return handleResponse(`{"message": "${error.message}"}`, 401);
    }
    else if (error instanceof HttpError ) {
        return handleResponse(`{"message": "${error.message}"}`, error.statusCode);
    }
    return handleResponse(`{"Server Error": "${error.message}"}`, 500);
}

export function handleResponse(content: string, status: number) : Response{
    return new Response(content, {
        status: status,
        headers: { 'Content-Type': 'application/json' },
    });
}

