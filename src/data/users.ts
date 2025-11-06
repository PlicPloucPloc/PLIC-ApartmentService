import { HttpError } from 'elysia-http-error';

export async function getUser(bearer: String): Promise<string> {
    const userUrl = (process.env.USER_URL || 'http://localhost:3000') + '/';
    const request = new Request(userUrl, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + bearer,
        },
    });
    const resp = await fetch(request);
    if (!resp) {
        throw HttpError.ServiceUnavailable('User Service: No response from user service');
    }
    if (resp.status == 403) {
        const content = await resp.text();
        throw HttpError.Forbidden('User Service: ' + content);
    }

    const content = await resp.json();
    if (content === null) {
        throw HttpError.ServiceUnavailable('User Service: No response from user service');
    }
    return content.id;
}
