import { ItemStack } from './Item';

export class Inventory {

    width: number = 6
    height: number = 4

    items: ItemStack[] = new Array(this.width * this.height)

    constructor() {
    }
}