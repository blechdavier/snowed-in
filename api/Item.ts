export enum ItemType {
    SnowBlock,
    IceBlock,
}

export type ItemStackData = {
    itemType: ItemType
    quantity: number
}