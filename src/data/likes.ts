import { HttpError } from 'elysia-http-error';

async function addApartmentNode(bearer: String, aptId: Number): Promise<string> {
    const userUrl = (process.env.LIKE_URL || 'http://localhost:3000') + '/aptNode';
    const request = new Request(userUrl, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + bearer,
        },
        body: JSON.stringify({'aptId': aptId,}),
    });
    const resp = await fetch(request);
    if (!resp) {
        console.error('No response from like service');
        throw HttpError.ServiceUnavailable('Like Service: No response from user service');
    } 
    const content = await resp.json();
    if ( resp.status == 403) {
        console.error(content.message);
        throw HttpError.Forbidden('Like Service: ' + content.message);
    }
    console.log('Content: ' + content);
    if (content === null) {
        console.error('Unable to reach like service');
        throw HttpError.ServiceUnavailable('Like Service: No response from user service');
    }
    return content.id;
}

async function getApartmentIdNoRelations(bearer: string, skip: number, limit: number): Promise<number[]> {
    const userUrl = (process.env.LIKE_URL || 'http://localhost:3000') + '/noRelations??offset=' + skip + '&limit=' + limit;
    const request = new Request(userUrl, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + bearer,
        },
    });
    const resp = await fetch(request);
    if (!resp) {
        console.error('No response from like service');
        throw HttpError.ServiceUnavailable('Like Service: No response from user service');
    } 
    const content = await resp.json();
    if ( resp.status == 403) {
        console.error(content.message);
        throw HttpError.Forbidden('Like Service: ' + content.message);
    }
    console.log('Content: ' + content);
    if (content === null) {
        console.error('Unable to reach like service');
        throw HttpError.ServiceUnavailable('Like Service: No response from user service');
    }
    return content.aptIds;
}

export { addApartmentNode,getApartmentIdNoRelations };
