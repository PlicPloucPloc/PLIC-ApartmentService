export class apartment {
    id: number;
    owner_id: string;
    platform_id: string;

    constructor(id: number, owner_id: string, platform_id: string) {
        this.id = id;
        this.owner_id = owner_id;
        this.platform_id = platform_id;
    }
}
