import { HttpError } from 'elysia-http-error';

async function getUser(bearer: String): Promise<string> {
    const userUrl = (process.env.USER_URL || 'http://localhost:3000') + '/id';
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
    const content = await resp.json();
    if ( resp.status == 403) {
        throw HttpError.Forbidden('User Service: ' + content.message);
    }
    console.log('Content: ' + content);
    if (content === null) {
        throw HttpError.ServiceUnavailable('User Service: No response from user service');
    }
    return content.id;
}

export { getUser };
