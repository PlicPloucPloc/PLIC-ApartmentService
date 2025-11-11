import { HttpError } from "elysia-http-error";
import { getUser } from "../data/users";

export async function verifyUser(bearer: string): Promise<string> {
    const id: string = await getUser(bearer);
    if (!id) {
        throw HttpError.Unauthorized('Unauthorized', { status: 401 });
    }
    return id;
}

