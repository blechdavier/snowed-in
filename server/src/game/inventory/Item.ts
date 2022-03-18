import { ItemType, TileType } from '../../../../api/API';

type Modify<T, R> = Omit<T, keyof R> & R;

export interface Item {
    type: ItemType
    category: ItemCategories
    maxStackSize: number
}

export enum ItemCategories {
    None,
    TileItem
}

export interface ItemTile extends Modify<Item, { category: ItemCategories.TileItem }> {
    placedBlock: TileType
}

type ItemMap<T> = { [item in ItemType]: T };

export const Items: ItemMap<Item|ItemTile> = {
    [ItemType.SnowBlock]: {
        type: ItemType.SnowBlock,
        maxStackSize: 100,
        placedBlock: TileType.Snow,
        category: ItemCategories.TileItem
    },
    [ItemType.IceBlock]: {
        type: ItemType.IceBlock,
        maxStackSize: 100,
        placedBlock: TileType.Ice,
        category: ItemCategories.TileItem
    }
};

export type ItemStack = {
    item: Item|ItemTile
    amount: number
}