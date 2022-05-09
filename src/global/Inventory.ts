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
	DirtBlock,
	Stone0Block,
	Stone1Block,
	Stone2Block,
	Stone3Block,
	Stone4Block,
	Stone5Block,
	Stone6Block,
	Stone7Block,
	Stone8Block,
	Stone9Block,
	TinBlock,
	AluminumBlock,
	GoldBlock,
	TitaniumBlock,
	GrapeBlock,
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
	[ItemType.DirtBlock]: {
		type: ItemCategories.Tile,
		placedTile: TileType.Dirt,
	},
	[ItemType.Stone0Block]: {
		type: ItemCategories.Tile,
		placedTile: TileType.Stone0,
	},
	[ItemType.Stone1Block]: {
		type: ItemCategories.Tile,
		placedTile: TileType.Stone1,
	},
	[ItemType.Stone2Block]: {
		type: ItemCategories.Tile,
		placedTile: TileType.Stone2,
	},
	[ItemType.Stone3Block]: {
		type: ItemCategories.Tile,
		placedTile: TileType.Stone3,
	},
	[ItemType.Stone4Block]: {
		type: ItemCategories.Tile,
		placedTile: TileType.Stone4,
	},
	[ItemType.Stone5Block]: {
		type: ItemCategories.Tile,
		placedTile: TileType.Stone5,
	},
	[ItemType.Stone6Block]: {
		type: ItemCategories.Tile,
		placedTile: TileType.Stone6,
	},
	[ItemType.Stone7Block]: {
		type: ItemCategories.Tile,
		placedTile: TileType.Stone7,
	},
	[ItemType.Stone8Block]: {
		type: ItemCategories.Tile,
		placedTile: TileType.Stone8,
	},
	[ItemType.Stone9Block]: {
		type: ItemCategories.Tile,
		placedTile: TileType.Stone9,
	},
	[ItemType.TinBlock]: {
		type: ItemCategories.Tile,
		placedTile: TileType.Tin,
	},
	[ItemType.AluminumBlock]: {
		type: ItemCategories.Tile,
		placedTile: TileType.Aluminum,
	},
	[ItemType.GoldBlock]: {
		type: ItemCategories.Tile,
		placedTile: TileType.Gold,
	},
	[ItemType.TitaniumBlock]: {
		type: ItemCategories.Tile,
		placedTile: TileType.Titanium,
	},
	[ItemType.GrapeBlock]: {
		type: ItemCategories.Tile,
		placedTile: TileType.Grape,
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
