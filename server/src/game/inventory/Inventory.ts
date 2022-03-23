import { InventoryPayload, ItemStack } from '../../../../api/Inventory';

export class Inventory {

    width: number = 6
    height: number = 4

    items: ItemStack[] = new Array(this.width * this.height)

    constructor() {
    }

    getPayload(): InventoryPayload {
        return {
            items: this.items,
            width: this.width,
            height: this.height
        }
    }
}