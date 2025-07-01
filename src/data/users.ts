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
    if (!resp || resp.status == 403) {
        throw HttpError.Forbidden('User not found or acces denied');
    }
    const content = await resp.json();
    console.log('Content: ' + content);
    if (content === null) {
        throw HttpError.Forbidden('User not found or acces denied');
    }
    return content.id;
}

export { getUser };
