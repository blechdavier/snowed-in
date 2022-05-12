import { TileType } from './Tile';
import { TileEntities } from './TileEntity';

type DataPairs<T, K extends keyof T = keyof T> = K extends keyof T
	? { type: K } & T[K]
	: never;

const itemTypeData = <D, T extends Record<ItemType, DataPairs<CategoryData>>>(
	data: T,
): T => data;

export enum ItemCategories {
	Tile,
	Resource,
	Tool,
	TileEntity,
}

export type CategoryData = {
	[ItemCategories.Tile]: { placedTile: TileType, maxStackSize?: number};
	[ItemCategories.Resource]: {};
	[ItemCategories.Tool]: { breakableTiles: TileType[]};
	[ItemCategories.TileEntity]: { placedTileEntity: number, tileEntityOffset?: [number, number]};
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
	Wood0Block,
	Wood1Block,
	Wood2Block,
	Wood3Block,
	Wood4Block,
	Wood5Block,
	Wood6Block,
	Wood7Block,
	Wood8Block,
	Wood9Block,
	Seed,
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
	[ItemType.Wood0Block]: {
		type: ItemCategories.Tile,
		placedTile: TileType.Wood0,
	},
	[ItemType.Wood1Block]: {
		type: ItemCategories.Tile,
		placedTile: TileType.Wood1,
	},
	[ItemType.Wood2Block]: {
		type: ItemCategories.Tile,
		placedTile: TileType.Wood2,
	},
	[ItemType.Wood3Block]: {
		type: ItemCategories.Tile,
		placedTile: TileType.Wood3,
	},
	[ItemType.Wood4Block]: {
		type: ItemCategories.Tile,
		placedTile: TileType.Wood4,
	},
	[ItemType.Wood5Block]: {
		type: ItemCategories.Tile,
		placedTile: TileType.Wood5,
	},
	[ItemType.Wood6Block]: {
		type: ItemCategories.Tile,
		placedTile: TileType.Wood6,
	},
	[ItemType.Wood7Block]: {
		type: ItemCategories.Tile,
		placedTile: TileType.Wood7,
	},
	[ItemType.Wood8Block]: {
		type: ItemCategories.Tile,
		placedTile: TileType.Wood8,
	},
	[ItemType.Wood9Block]: {
		type: ItemCategories.Tile,
		placedTile: TileType.Wood9,
	},
	[ItemType.Seed]: {
		type: ItemCategories.TileEntity,
		placedTileEntity: TileEntities.Seed,
		tileEntityOffset: [-1, -6],
	},
	// [ItemType.TinPickaxe]: {
	// 	type: ItemCategories.Tool,
	// 	breakableTiles: [TileType.Snow, TileType.Ice, TileType.Dirt, TileType.Wood0, TileType.Stone0, TileType.Stone1, TileType.Tin, TileType.Aluminum]
	// }
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
