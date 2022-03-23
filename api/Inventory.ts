import { TileType } from './Tile';

type DataPairs<T, K extends keyof T = keyof T> =
	K extends keyof T
		? { type: K } & T[K]
		: never;

const itemTypeData = <T extends Record<ItemType, DataPairs<CategoryData>>>(data: T): T => data

enum DataCategories {
	Tile,
	Resource,
}

export type CategoryData = {
	[DataCategories.Tile]: { placedTile: TileType },
	[DataCategories.Resource]: {}
}

export enum ItemType {
	SnowBlock,
	IceBlock,
}

export type ItemStack = {
	quantity: number
	item: ItemType
}

export const Items = itemTypeData({
	[ItemType.SnowBlock]: { type: DataCategories.Tile, placedTile: TileType.Snow },
	[ItemType.IceBlock]: { type: DataCategories.Tile, placedTile: TileType.Ice }
});

export type InventoryPayload = {
	items: ItemStack[]

	width: number
	height: number
}