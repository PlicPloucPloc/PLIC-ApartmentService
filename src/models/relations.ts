import { apartment_info } from "./apartment_info";

export class relation {
    type: string;
    apt: apartment_info;

    constructor(type: string, apt: apartment_info) {
        this.type = type;
        this.apt = apt;
    }
}
