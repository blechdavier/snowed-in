import { Item } from './Items';

class ItemStack {
    item: Item;
    stackSize: number;

    constructor(item: Item, stackSize: number) {
        this.item = item;
        this.stackSize = stackSize;
    }
}

export = ItemStack;
