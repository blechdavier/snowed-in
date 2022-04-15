export enum TileEntities {
	Tier1Drill,
	Tier2Drill,
}

type DataPairs<T, K extends keyof T = keyof T> = K extends keyof T
	? { type: K; data: T[K] }
	: never;

export interface TileEntitiesData {
	[TileEntities.Tier1Drill]: { level: number; active: boolean };
	[TileEntities.Tier2Drill]: { dateCreated: string };
}

export type TileEntityData = DataPairs<TileEntitiesData>;

export type TileEntityPayload = TileEntityData & {
	id: string;
	coveredTiles: number[];
};
