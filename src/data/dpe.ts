import { HttpError } from 'elysia-http-error';

export async function getPricePerElecRate(rate: string): Promise<number> {
    const priceUrl = ('https://open-dpe.fr/api/v1/electricity.php?tarif=' + rate)
    console.log(priceUrl);
    const request = new Request(priceUrl, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    const resp = await fetch(request);
    if (!resp) {
        console.error('No response from like service');
        throw HttpError.ServiceUnavailable('Like Service: No response from dpe api');
    }
    const content = await resp.json();
    if (resp.status == 403) {
        console.error(content.message);
        throw HttpError.Forbidden('DPE API: ' + content.message);
    }
    if (content === null) {
        console.error('Unable to reach dpe api');
        throw HttpError.ServiceUnavailable('DPE API: No response from dpe api');
    }
    if (content.error) {
        console.error(content.error);
        throw HttpError.BadRequest('DPE API: ' + content.error);
    }
    return content.options.base.prix_kWh;
}
