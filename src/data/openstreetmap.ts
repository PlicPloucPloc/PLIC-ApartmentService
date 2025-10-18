import { HttpError } from "elysia-http-error";

export async function getCoordinates(address: string): Promise<{ lat: number; lon: number }> {
    if (address === "") {
        throw HttpError.BadRequest('Address cannot be empty.');
    }

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
    console.log('Fetching URL: ' + url);

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Error fetching directions: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Received data: ', data);

    return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
}
