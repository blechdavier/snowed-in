import ImageResource from '../../assets/resources/ImageResource';
import { ItemTile } from './tileItems/ItemTile';
import { ItemType } from '../../../../api/Item';
import { TileType } from '../../../../api/Tile';
import { ItemsAssets } from '../../assets/Assets';

export class Item {

    texture: ImageResource
    itemType: ItemType

    name: string
    description: string
    maxStackSize: number

    constructor(itemType: ItemType, texture: ImageResource, name: string, description?: string, maxStackSize: number = 1) {
        this.itemType = itemType
        this.texture = texture

        this.name = name
        this.description = description
        this.maxStackSize = maxStackSize
    }
}

export interface Placable {
    place(x: number, y: number): void
}

export const Items: Record<ItemType, Item> = {
    [ItemType.SnowBlock]: new ItemTile(TileType.Snow, ItemType.SnowBlock, ItemsAssets.blocks.snow, "Snow Block"),
    [ItemType.IceBlock]: new ItemTile(TileType.Ice, ItemType.IceBlock, ItemsAssets.blocks.ice, "Ice Block")
}