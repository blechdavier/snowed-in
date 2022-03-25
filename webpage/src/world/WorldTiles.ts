import ImageResource from '../assets/resources/ImageResource';
import { WorldAssets } from '../assets/Assets';
import TileResource from '../assets/resources/TileResource';
import { TileType } from '../../../api/Tile';

export interface Tile {
    name: string;
    texture: ImageResource | TileResource;
    connected?: boolean;
    anyConnection?: boolean;
    color: string;
    friction: number;
}

export const WorldTiles: Record<TileType, Tile | undefined> = {
    [TileType.Air]: undefined,
    [TileType.TileEntity]: {
        name: 'TileEntity',
        texture: undefined,
        color: "#bbbbbb",
        friction: 1
    },
    [TileType.Snow]: {
        name: 'snow',
        texture: WorldAssets.middleground.tileset_snow,
        connected: true,
        anyConnection: true,
        color: "#cafafc",
        friction: 2
    },
    [TileType.Ice]: {
        name: 'ice',
        texture: WorldAssets.middleground.tileset_ice,
        connected: true,
        anyConnection: true,
        color: "#76adc4",
        friction: 1.5
    },
    [TileType.Dirt]: {
        name: 'dirt',
        texture: WorldAssets.middleground.tileset_dirt,
        connected: true,
        anyConnection: true,
        color: "#4a2e1e",
        friction: 4
    },
    [TileType.Stone0]: {
        name: 'raw stone',
        texture: WorldAssets.middleground.tileset_stone0,
        connected: true,
        anyConnection: true,
        color: "#414245",
        friction: 3
    },
    [TileType.Stone1]: {
        name: 'stone tier 1',
        texture: WorldAssets.middleground.tileset_stone1,
        connected: true,
        anyConnection: true,
        color: "#31323b",
        friction: 3
    },
    [TileType.Stone2]: {
        name: 'stone tier 2',
        texture: WorldAssets.middleground.tileset_stone2,
        connected: true,
        anyConnection: true,
        color: "#31323b",
        friction: 3
    },
};