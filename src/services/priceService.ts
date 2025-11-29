import { HttpError } from "elysia-http-error";
import { getUser } from "../data/users";
import { getPricePerElecRate } from "../data/dpe";
import { request } from "../routes/requests/request";
import { apartment_info } from "../models/apartment_info";
import { getLogger } from "./logger";
import { Logger } from "winston";

const logger: Logger = getLogger('PriceService');

// Estimation for one person apartment
const AVERAGE_HOT_WATER_CONSUMPTION_PER_YEAR_ELEC: number = 689; // in kWh for electric hot water
const AVERAGE_HOT_WATER_CONSUMPTION_PER_YEAR_GAS: number = 1269; // in kWh for gas hot water
const AVERAGE_COOKING_CONSUMPTION_PER_YEAR_ELEC: number = 250; // in kWh for electric cooking
const AVERAGE_CONSUMPTION_OTHERS: number = 884; // in kWh for other uses (lighting, appliances,etc.)
const AVERAGE_GAS_PRICE_PER_KWH: number = 0.11; // average price per kWh PCI for gas

export async function estimatePrice(
    bearer: string,
    apt_info: request,
): Promise<number> {
    const userId = await getUser(bearer);
    if (!userId) {
        throw HttpError.Unauthorized('User not found or Unauthorized');
    }
    
    var price_elec: number = await getPricePerElecRate('EDF_bleu');
    if (apt_info.heating_type == null || apt_info.heating_type === 'individual' ) {
        var dpe_kwh = convertDpeTokWh(apt_info.energy_class);

        logger.info(`Price per kWh for electricity: ${price_elec}`);

        if (apt_info.heating_mode == 'electric') {
            var total : number =  AVERAGE_CONSUMPTION_OTHERS + AVERAGE_COOKING_CONSUMPTION_PER_YEAR_ELEC;

            return ((total * price_elec + dpe_kwh * price_elec *  apt_info.surface)/12);
        }
        var elect_total : number = AVERAGE_CONSUMPTION_OTHERS + AVERAGE_COOKING_CONSUMPTION_PER_YEAR_ELEC;

        return ((dpe_kwh * AVERAGE_GAS_PRICE_PER_KWH * apt_info.surface + elect_total * price_elec)/12);
    }

    return (AVERAGE_CONSUMPTION_OTHERS + AVERAGE_COOKING_CONSUMPTION_PER_YEAR_ELEC)*price_elec/12;
}

function convertDpeTokWh(energy_class: string): number {
    if (energy_class == null) return 330;
    energy_class = energy_class.toLowerCase();
    switch (energy_class) {
        case 'a':
            return 50;
        case 'b':
            return 90;
        case 'c':
            return 150;
        case 'd':
            return 230;
        case 'e':
            return 330;
        case 'f':
            return 450;
        case 'g':
            return 550;
        default:
            logger.warn('Invalid DPE value: ' + energy_class);
            return 330;
    }
}
