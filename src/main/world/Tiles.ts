import ImageResource from '../assets/resources/ImageResource';
import { WorldAssets } from '../assets/Assets';
import TileResource from '../assets/resources/TileResource';
import { Item, Items } from '../inventory/items/Items';

interface Tile {
    name: string;
    texture: ImageResource | TileResource;
    itemDrop?: Item;
    itemDropMax?: number;
    itemDropMin?: number;
    connected?: boolean;
}

const Tiles: Tile[] = [
    undefined, // Air
    {
        name: 'snow',
        itemDrop: Items.snowballs,
        itemDropMin: 2,
        itemDropMax: 4,
        texture: WorldAssets.middleground.tileset_snow,
        connected: true,
    },
    {
        name: 'ice',
        itemDrop: Items.ice_shards,
        itemDropMin: 3,
        itemDropMax: 5,
        texture: WorldAssets.middleground.tileset_ice,
        connected: true,
    },
];

export { Tiles, Tile };
