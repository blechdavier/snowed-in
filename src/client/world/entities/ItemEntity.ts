import p5 from 'p5';
import { ServerEntity } from './ServerEntity';
import { Entities, EntityPayload } from '../../../global/Entity';
import { Items, ItemType } from '../../../global/Inventory';
import { ItemAssets } from '../../assets/Assets';

export class ItemEntity extends ServerEntity {
    item: ItemType;

    constructor(payload: EntityPayload<Entities.Item>) {
        super(payload.id);

        this.item = payload.data.item;
        this.x = payload.data.x;
        this.y = payload.data.y;
    }

    render(target: p5, upscaleSize: number): void {
        const asset = ItemAssets[this.item];
        if (asset !== undefined) {
            asset.render(target, this.x, this.y, 8, 8);
        }
    }

    updateData(data: EntityPayload<Entities.Item>): void {
        this.item = data.data.item;
        this.x = data.data.x;
        this.y = data.data.y;
    }
}
