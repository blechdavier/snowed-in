import { ImageResource } from '../assets/resources/ImageResource';
import { WorldAssets } from '../assets/Assets';
import { TileResource } from '../assets/resources/TileResource';
import { TileType } from '../../global/Tile';

export type Tile = {
    name: string;
    texture: ImageResource | TileResource;
    connected?: boolean;
    anyConnection?: boolean;
};

export const WorldTiles: Record<TileType, Tile | undefined> = {
    [TileType.Air]: undefined,
    [TileType.Snow]: {
        name: 'snow',
        texture: WorldAssets[TileType.Snow],
        connected: true,
        anyConnection: true,
    },
    [TileType.Ice]: {
        name: 'ice',
        texture: WorldAssets[TileType.Ice],
        connected: true,
        anyConnection: true,
    },
};