import { HttpError } from 'elysia-http-error';

export async function getPricePerElecRate(rate: string): Promise<number> {
    const priceUrl = ('https://open-dpe.fr/api/v1/electricity.php?tarif=' + rate)
    const request = new Request(priceUrl, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    const resp = await fetch(request);
    if (!resp) {
        throw HttpError.ServiceUnavailable('Like Service: No response from dpe api');
    }
    const content = await resp.json();
    if (resp.status == 403) {
        throw HttpError.Forbidden('DPE API: ' + content.message);
    }
    if (content === null) {
        throw HttpError.ServiceUnavailable('DPE API: No response from dpe api');
    }
    if (content.error) {
        throw HttpError.BadRequest('DPE API: ' + content.error);
    }
    return content.options.base.prix_kWh;
}
