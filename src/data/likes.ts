import { HttpError } from 'elysia-http-error';
import { Filters } from '../models/filters';

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
    filters: Filters,
    limit: number,
): Promise<number[]> {
    const likeUrl =
        (process.env.LIKE_URL || 'http://localhost:3000') +
        '/noRelations?limit=' +
        limit + '&location=' + filters.location + '&rent=' + filters.rent + '&min_size=' + filters.min_size + '&max_size=' + filters.max_size + '&is_furnished=' + filters.is_furnished;
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
    return content.aptIds;
}

export { addApartmentNode, getApartmentIdNoRelations };
