import ImageResource from '../assets/resources/ImageResource';
import { WorldAssets } from '../assets/Assets';
import TileResource from '../assets/resources/TileResource';
import { Item, Items } from './inventory/items/Items';

interface Tile {
    name: string;
    texture: ImageResource | TileResource;
    itemDrop?: Item;
    itemDropMax?: number;
    itemDropMin?: number;
    connected?: boolean;
}



const Blocks = {//used for readability in other scripts
    air: 0,
    snow: 1,
    ice: 2, 
    dirt: 3,
    stone: 4,
    metal_ore: 5
}



const Tiles: Tile[] = [
    undefined, // Air
    {
        name: 'snow',
        itemDrop: Items.snowballs,
        itemDropMin: 2,
        itemDropMax: 4,
        texture: WorldAssets.middleground.tileset_snow,
        connected: true
    },
    {
        name: 'ice',
        itemDrop: Items.ice_shards,
        itemDropMin: 3,
        itemDropMax: 5,
        texture: WorldAssets.middleground.tileset_ice,
        connected: true
    },
    {
        name: 'dirt',
        itemDrop: Items.ice_shards,
        itemDropMin: 100,
        itemDropMax: 500,
        texture: WorldAssets.middleground.tileset_dirt,
        connected: false
    },
    {
        name: 'stone',
        itemDrop: Items.ice_shards,
        itemDropMin: 300,
        itemDropMax: 500,
        texture: WorldAssets.middleground.tileset_stone,
        connected: false
    },
];

export { Tiles, Tile, Blocks };
