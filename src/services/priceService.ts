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
    
    if (apt_info.heating_mode == null || apt_info.heating_mode === 'individual' ) {
        var dpe_kwh = convertDpeTokWh(apt_info.energy_class);

        var price_elec: number = await getPricePerElecRate('EDF_bleu');
        logger.info(`Price per kWh for electricity: ${price_elec}`);

        if (apt_info.heating_type == 'electric') {
            var total : number =  AVERAGE_CONSUMPTION_OTHERS + AVERAGE_HOT_WATER_CONSUMPTION_PER_YEAR_ELEC + AVERAGE_COOKING_CONSUMPTION_PER_YEAR_ELEC;

            return apt_info.rent + ((total * price_elec + dpe_kwh * price_elec *  apt_info.surface)/12);
        }
        var elect_total : number = AVERAGE_CONSUMPTION_OTHERS + AVERAGE_COOKING_CONSUMPTION_PER_YEAR_ELEC;

        return apt_info.rent + ((AVERAGE_HOT_WATER_CONSUMPTION_PER_YEAR_GAS * AVERAGE_GAS_PRICE_PER_KWH + dpe_kwh * AVERAGE_GAS_PRICE_PER_KWH * apt_info.surface + elect_total * price_elec)/12);
    }

    return apt_info.rent;
}

export async function estimatePriceUpdate(
    bearer: string,
    apt_info: apartment_info,
): Promise<number> {
    const userId = await getUser(bearer);
    if (!userId) {
        throw HttpError.Unauthorized('User not found or Unauthorized');
    }
    
    if (apt_info.heating_mode == null || apt_info.heating_mode === 'individual' ) {
        var dpe_kwh = convertDpeTokWh(apt_info.energy_class);

        var price_elec: number = await getPricePerElecRate('EDF_bleu');
        logger.info(`Price per kWh for electricity: ${price_elec}`);

        if (apt_info.heating_type == 'electric') {
            var total : number =  AVERAGE_CONSUMPTION_OTHERS + AVERAGE_HOT_WATER_CONSUMPTION_PER_YEAR_ELEC + AVERAGE_COOKING_CONSUMPTION_PER_YEAR_ELEC;

            return apt_info.rent + ((total * price_elec + dpe_kwh * price_elec *  apt_info.surface)/12);
        }
        var elect_total : number = AVERAGE_CONSUMPTION_OTHERS + AVERAGE_COOKING_CONSUMPTION_PER_YEAR_ELEC;

        return apt_info.rent + ((AVERAGE_HOT_WATER_CONSUMPTION_PER_YEAR_GAS * AVERAGE_GAS_PRICE_PER_KWH + dpe_kwh * AVERAGE_GAS_PRICE_PER_KWH * apt_info.surface + elect_total * price_elec)/12);
    }

    return apt_info.rent;
}

function convertDpeTokWh(ges: string): number {
    switch (ges) {
        case 'A':
            return 50;
        case 'B':
            return 90;
        case 'C':
            return 150;
        case 'D':
            return 230;
        case 'E':
            return 330;
        case 'F':
            return 450;
        case 'G':
            return 550;
        default:
            throw HttpError.BadRequest('Invalid GES value');
    }
}
