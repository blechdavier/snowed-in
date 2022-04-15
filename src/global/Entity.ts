import { InventoryPayload, ItemType } from './Inventory';

export enum Entities {
	LocalPlayer,
	Player,
	Item,
}

type DataPairs<T, K extends keyof T = keyof T> = K extends keyof T
	? { type: K; data: T[K] }
	: never;

export interface EntitiesData {
	[Entities.LocalPlayer]: {
		name: string;
		x: number;
		y: number;
	};
	[Entities.Player]: { name: string };
	[Entities.Item]: { item: ItemType; x: number; y: number };
}

export type EntityData<T extends Entities = keyof EntitiesData> = DataPairs<
	EntitiesData,
	T
>;

export type EntityPayload<T extends Entities = keyof EntitiesData> =
	EntityData<T> & { id: string };
