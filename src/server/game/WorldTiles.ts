import { ItemType } from "../../global/Inventory";
import { TileType } from "../../global/Tile";

export type Tile = {
    itemDrop: ItemType
}

export const WorldTiles: Record<TileType, Tile | undefined> = {
    [TileType.Air]: undefined,
    [TileType.Snow]: {
        itemDrop: ItemType.SnowBlock
    },
    [TileType.Ice]: {
        itemDrop: ItemType.IceBlock
    },
    [TileType.Dirt]: {
        itemDrop: ItemType.DirtBlock
    },
    [TileType.Stone0]: {
        itemDrop: ItemType.Stone0Block
    },
    [TileType.Stone1]: {
        itemDrop: ItemType.Stone1Block
    },
    [TileType.Stone2]: {
        itemDrop: ItemType.Stone2Block
    },
    [TileType.Stone3]: {
        itemDrop: ItemType.Stone3Block
    },
    [TileType.Stone4]: {
        itemDrop: ItemType.Stone4Block
    },
    [TileType.Stone5]: {
        itemDrop: ItemType.Stone5Block
    },
    [TileType.Stone6]: {
        itemDrop: ItemType.Stone6Block
    },
    [TileType.Stone7]: {
        itemDrop: ItemType.Stone7Block
    },
    [TileType.Stone8]: {
        itemDrop: ItemType.Stone8Block
    },
    [TileType.Stone9]: {
        itemDrop: ItemType.Stone9Block
    },
    [TileType.Tin]: {
        itemDrop: ItemType.TinBlock
    },
    [TileType.Aluminum]: {
        itemDrop: ItemType.AluminumBlock
    },
    [TileType.Gold]: {
        itemDrop: ItemType.AluminumBlock
    },
};

