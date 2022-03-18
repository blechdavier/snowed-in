export enum Entities {
    Player,
    Item
}

type DataPairs<T, K extends keyof T = keyof T> =
    K extends keyof T
        ? { type: K, data: T[K] }
        : never;

export interface EntitiesData {
    [Entities.Player]: {name: string};
    [Entities.Item]: {dateCreated: string};
}

export type EntityData = DataPairs<EntitiesData>

export type EntityPayload = EntityData & {id: string}