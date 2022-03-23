import { InventoryPayload } from './Inventory';

export enum Entities {
    LocalPlayer,
    Player,
    Item
}

type DataPairs<T, K extends keyof T = keyof T> =
    K extends keyof T
        ? { type: K, data: T[K] }
        : never;

export interface EntitiesData {
    [Entities.LocalPlayer]: {name: string, x: number, y: number, inventory: InventoryPayload}
    [Entities.Player]: {name: string};
    [Entities.Item]: {dateCreated: string};
}

export type EntityData<T extends Entities = keyof EntitiesData> = DataPairs<EntitiesData, T>

export type EntityPayload<T extends Entities = keyof EntitiesData> = EntityData<T> & {id: string}