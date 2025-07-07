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
        console.error('No response from user service');
        throw HttpError.ServiceUnavailable('User Service: No response from user service');
    }
    if (resp.status == 403) {
        const content = await resp.text();

        console.error(content);
        throw HttpError.Forbidden('User Service: ' + content);
    }

    const content = await resp.json();
    console.log('Content: ' + content);
    if (content === null) {
        console.error('Unable to reach user service');
        throw HttpError.ServiceUnavailable('User Service: No response from user service');
    }
    return content.id;
}

export { getUser };
