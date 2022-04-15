import { TileType } from './Tile';

type DataPairs<T, K extends keyof T = keyof T> = K extends keyof T
	? { type: K } & T[K]
	: never;

const itemTypeData = <D, T extends Record<ItemType, DataPairs<CategoryData>>>(
	data: T,
): T => data;

export enum ItemCategories {
	Tile,
	Resource,
}

export type CategoryData = {
	[ItemCategories.Tile]: { placedTile: TileType };
	[ItemCategories.Resource]: {};
};

export enum ItemType {
	SnowBlock,
	IceBlock,
}

export type ItemStack = {
	quantity: number;
	item: ItemType;
};

export const Items = itemTypeData({
	[ItemType.SnowBlock]: {
		type: ItemCategories.Tile,
		placedTile: TileType.Snow,
	},
	[ItemType.IceBlock]: {
		type: ItemCategories.Tile,
		placedTile: TileType.Ice,
	},
});

export type InventoryUpdatePayload = {
	slot: number;
	item: ItemStack | undefined;
}[];

export type InventoryPayload = {
	items: (ItemStack | undefined)[];

	width: number;
	height: number;
};
