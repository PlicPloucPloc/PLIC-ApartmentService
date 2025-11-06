import { HttpError } from 'elysia-http-error';
import { relation } from '../models/relations';
import { getLogger } from '../services/logger';
import { Logger } from 'winston';

const logger: Logger = getLogger(`LikeData`);

export async function addApartmentNode(bearer: String, aptId: number): Promise<string> {
    logger.info(`Add apt node: ${aptId}`);
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
        throw HttpError.ServiceUnavailable('Like Service: No response from like service');
    }
    const content = await resp.json();
    if (resp.status == 403) {
        throw HttpError.Forbidden('Like Service: ' + content.message);
    }
    if (content === null) {
        throw HttpError.ServiceUnavailable('Like Service: No response from like service');
    }
    return content.id;
}

export async function getApartmentIdNoRelations(
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
        throw HttpError.ServiceUnavailable('Like Service: No response from like service');
    }
    const content = await resp.json();
    if (resp.status == 403) {
        throw HttpError.Forbidden('Like Service: ' + content.message);
    }
    if (content === null) {
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
        throw HttpError.ServiceUnavailable('Like Service: No response from like service');
    }
    const content = await resp.json();
    if (resp.status == 403) {
        throw HttpError.Forbidden('Like Service: ' + content.message);
    }
    if (content === null) {
        throw HttpError.ServiceUnavailable('Like Service: No response from like service');
    }
    return content;
}

export async function orderApartmentIds(
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
        throw HttpError.ServiceUnavailable('Like Service: No response from like service');
    }
    const content = await resp.json();
    if (resp.status == 403) {
        throw HttpError.Forbidden('Like Service: ' + content.message);
    }
    if (resp.status == 500) {
        throw HttpError.Internal('Like Service: ' + content.message);
    }
    if (content === null) {
        throw HttpError.ServiceUnavailable('Like Service: No response from like service');
    }
    return content;
}
