export enum TileEntities {
	Tree,
	Tier1Drill,
	// Tier2Drill,
	// Tier3Drill,
	// Tier4Drill,
	// Tier5Drill,
	// CraftingBench
}

type DataPairs<T, K extends keyof T = keyof T> = K extends keyof T
	? { type_: K; data: T[K] }
	: never;

export interface TileEntitiesData {
	[TileEntities.Tree]: { woodCount: number; seedCount: number };
	[TileEntities.Tier1Drill]: { level: number; active: boolean };
	// [TileEntities.Tier2Drill]: { level: number; active: boolean };
	// [TileEntities.Tier3Drill]: { level: number; active: boolean };
	// [TileEntities.Tier4Drill]: { level: number; active: boolean };
	// [TileEntities.Tier5Drill]: { level: number; active: boolean };
	// [TileEntities.CraftingBench]: { level: number; active: boolean };
}

export type TileEntityData = DataPairs<TileEntitiesData> & {
	animate: boolean;
	animFrame: number;
};

export type TileEntityPayload = {
	id: string;
	coveredTiles: number[];
	payload: TileEntityData;
};

export enum TileEntityTextures {
	Tree1,
	Tree2,
	Tree3,
	Tree4,
	Tree5,
	Tree6,
	Tree7,
	Tree8,
	Tree9,
	Tree10,
}
