export enum TileEntities {
	Tree,
	Tier1Drill,
	Tier2Drill,
	Tier3Drill,
	Tier4Drill,
	Tier5Drill,
	CraftingBench,
	Seed,
}

type DataPairs<T, K extends keyof T = keyof T> = K extends keyof T
	? { type_: K; data: T[K] }
	: never;

export interface TileEntitiesData {
	[TileEntities.Tree]: { woodCount: number; seedCount: number };
	[TileEntities.Tier1Drill]: {  };
	[TileEntities.Tier2Drill]: {  };
	[TileEntities.Tier3Drill]: {  };
	[TileEntities.Tier4Drill]: {  };
	[TileEntities.Tier5Drill]: {  };
	[TileEntities.CraftingBench]: {  };
	[TileEntities.Seed]: {  };
}

export type TileEntityData = DataPairs<TileEntitiesData> & {}

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
