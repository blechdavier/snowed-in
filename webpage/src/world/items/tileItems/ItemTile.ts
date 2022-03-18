import { Item, Placable } from '../Items';
import ImageResource from '../../../assets/resources/ImageResource';
import game from "../../../Main"
import { ItemType } from '../../../../../api/Item';
import { TileType } from '../../../../../api/Tile';

export class ItemTile extends Item implements Placable {

    tileType: TileType

    constructor(tileType: TileType, itemType: ItemType, texture: ImageResource, name: string, description?: string, maxStackSize: number = 100) {
        super(itemType, texture, name, description, maxStackSize);

        this.tileType = tileType
    }

    place(x: number, y: number) {
        if(game.world.worldTiles[y * game.world.width + x] === TileType.Air) {
            game.connection.emit("worldPlace", (y * game.world.width + x), this.tileType)
        }
    }
}