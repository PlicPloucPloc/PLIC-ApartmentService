import { HttpError } from 'elysia-http-error';
import { apartment_info } from '../models/apartment_info';
import { relation } from '../models/relations';

async function addApartmentNode(bearer: String, aptId: number): Promise<string> {
    console.log('Add apt node: ' + aptId);
    const likeUrl = (process.env.LIKE_URL || 'http://localhost:3000') + '/aptNode';
    const request = new Request(likeUrl, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + bearer,
        },
        body: JSON.stringify({ aptId: aptId }),
    });
    const resp = await fetch(request);
    if (!resp) {
        console.error('No response from like service');
        throw HttpError.ServiceUnavailable('Like Service: No response from like service');
    }
    const content = await resp.json();
    if (resp.status == 403) {
        console.error(content.message);
        throw HttpError.Forbidden('Like Service: ' + content.message);
    }
    if (content === null) {
        console.error('Unable to reach like service');
        throw HttpError.ServiceUnavailable('Like Service: No response from like service');
    }
    return content.id;
}

async function getApartmentIdNoRelations(
    bearer: string,
    limit: number,
): Promise<number[]> {
    const likeUrl =
        (process.env.LIKE_URL || 'http://localhost:3000') +
        '/noRelations?limit=' +
        limit;
    const request = new Request(likeUrl, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + bearer,
        },
    });
    const resp = await fetch(request);
    if (!resp) {
        console.error('No response from like service');
        throw HttpError.ServiceUnavailable('Like Service: No response from like service');
    }
    const content = await resp.json();
    if (resp.status == 403) {
        console.error(content.message);
        throw HttpError.Forbidden('Like Service: ' + content.message);
    }
    console.log('Content: ' + content);
    if (content === null) {
        console.error('Unable to reach like service');
        throw HttpError.ServiceUnavailable('Like Service: No response from like service');
    }
    return content;
}

export async function getApartmentIdAllRelations(
    bearer: string,
): Promise<relation[]> {
    const likeUrl =
        (process.env.LIKE_URL || 'http://localhost:3000') +
        '/all';
    const request = new Request(likeUrl, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + bearer,
        },
    });
    const resp = await fetch(request);
    if (!resp) {
        console.error('No response from like service');
        throw HttpError.ServiceUnavailable('Like Service: No response from like service');
    }
    const content = await resp.json();
    if (resp.status == 403) {
        console.error(content.message);
        throw HttpError.Forbidden('Like Service: ' + content.message);
    }
    console.log('Content: ' + content);
    if (content === null) {
        console.error('Unable to reach like service');
        throw HttpError.ServiceUnavailable('Like Service: No response from like service');
    }
    return content;
}

async function orderApartmentIds(
    bearer: string,
    aptIds: number[],
): Promise<number[]> {
    const likeUrl =
        (process.env.LIKE_URL || 'http://localhost:3000') +
        '/order';
    const request = new Request(likeUrl, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + bearer,
        },
        body: JSON.stringify({ aptIds: aptIds }),
    });
    const resp = await fetch(request);
    if (!resp) {
        console.error('No response from like service');
        throw HttpError.ServiceUnavailable('Like Service: No response from like service');
    }
    const content = await resp.json();
    if (resp.status == 403) {
        console.error('Forbidden: ', content.message);
        throw HttpError.Forbidden('Like Service: ' + content.message);
    }
    if (resp.status == 500) {
        console.error('Internal Error: ', content.message);
        throw HttpError.Internal('Like Service: ' + content.message);
    }
    console.log('Content: ' + content);
    if (content === null) {
        console.error('Unable to reach like service');
        throw HttpError.ServiceUnavailable('Like Service: No response from like service');
    }
    return content;
}

export { addApartmentNode, getApartmentIdNoRelations, orderApartmentIds };
