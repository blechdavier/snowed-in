import { ImageResource } from '../assets/resources/ImageResource';
import { WorldAssets } from '../assets/Assets';
import { TileResource } from '../assets/resources/TileResource';
import { TileType } from '../../global/Tile';

export type Tile = {
    name: string;
    texture: ImageResource | TileResource;
    connected?: boolean;
    anyConnection?: boolean;
    color: string;
    friction: number;
    reflectivity: number;
}

export const WorldTiles: Record<TileType, Tile | undefined> = {
    [TileType.Air]: undefined,
    [TileType.Snow]: {
        name: 'snow',
        texture: WorldAssets[TileType.Snow],
        connected: true,
        anyConnection: true,
        color: "#cafafc",
        friction: 2,
        reflectivity: 50
    },
    [TileType.Ice]: {
        name: 'ice',
        texture: WorldAssets[TileType.Ice],
        connected: true,
        anyConnection: true,
        color: "#76adc4",
        friction: 1.5,
        reflectivity: 255
    },
    [TileType.Dirt]: {
        name: 'dirt',
        texture: WorldAssets.middleground.tileset_dirt,
        connected: true,
        anyConnection: true,
        color: "#4a2e1e",
        friction: 4,
        reflectivity: 0
    },
    [TileType.Stone0]: {
        name: 'raw stone',
        texture: WorldAssets.middleground.tileset_stone0,
        connected: true,
        anyConnection: true,
        color: "#414245",
        friction: 3,
        reflectivity: 10
    },
    [TileType.Stone1]: {
        name: 'stone tier 1',
        texture: WorldAssets.middleground.tileset_stone1,
        connected: true,
        anyConnection: true,
        color: "#31323b",
        friction: 3,
        reflectivity: 15
    },
    [TileType.Stone2]: {
        name: 'stone tier 2',
        texture: WorldAssets.middleground.tileset_stone2,
        connected: true,
        anyConnection: true,
        color: "#31323b",//TODO change these colors to be more accurate
        friction: 3,
        reflectivity: 17
    },
    [TileType.Stone3]: {
        name: 'stone tier 3',
        texture: WorldAssets.middleground.tileset_stone3,
        connected: true,
        anyConnection: true,
        color: "#31323b",
        friction: 3,
        reflectivity: 19
    },
    [TileType.Stone4]: {
        name: 'stone tier 4',
        texture: WorldAssets.middleground.tileset_stone4,
        connected: true,
        anyConnection: true,
        color: "#31323b",
        friction: 3,
        reflectivity: 21
    },
    [TileType.Stone5]: {
        name: 'stone tier 5',
        texture: WorldAssets.middleground.tileset_stone5,
        connected: true,
        anyConnection: true,
        color: "#31323b",
        friction: 3,
        reflectivity: 23
    },
    [TileType.Stone6]: {
        name: 'stone tier 6',
        texture: WorldAssets.middleground.tileset_stone6,
        connected: true,
        anyConnection: true,
        color: "#31323b",
        friction: 3,
        reflectivity: 25
    },
    [TileType.Stone7]: {
        name: 'stone tier 7',
        texture: WorldAssets.middleground.tileset_stone7,
        connected: true,
        anyConnection: true,
        color: "#31323b",
        friction: 3,
        reflectivity: 27
    },
    [TileType.Stone8]: {
        name: 'stone tier 8',
        texture: WorldAssets.middleground.tileset_stone8,
        connected: true,
        anyConnection: true,
        color: "#31323b",
        friction: 3,
        reflectivity: 29
    },
    [TileType.Stone9]: {
        name: 'stone tier 9',
        texture: WorldAssets.middleground.tileset_stone9,
        connected: true,
        anyConnection: true,
        color: "#31323b",
        friction: 3,
        reflectivity: 31
    },
};