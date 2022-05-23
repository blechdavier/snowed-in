import { ImageResource } from '../assets/resources/ImageResource';
import { WorldAssets } from '../assets/Assets';
import { TileResource } from '../assets/resources/TileResource';
import { TileType } from '../../global/Tile';
import { TileEntities } from '../../global/TileEntity';
import { ItemType } from '../../global/Inventory';

export type Tile = {
    name: string;
    texture: ImageResource | TileResource;
    connected?: boolean;
    anyConnection?: boolean;
    color: string;
    friction: number;
    reflectivity: number;
}

export type TileEntityRenderData = {
    texture: ImageResource | TileResource;
}

export const WorldTiles: Record<TileType, Tile | undefined> = {
    [TileType.Air]: undefined,
    [TileType.Snow]: {
        name: 'snow',
        texture: WorldAssets.middleground.tileset_snow,
        connected: true,
        anyConnection: true,
        color: "#cafafc",
        friction: 2,
        reflectivity: 60//this reflectivity actually does nothing and instead reflectivity can be changed inside ReflectedImageResource.ts
    },
    [TileType.Ice]: {
        name: 'ice',
        texture: WorldAssets.middleground.tileset_ice,
        connected: true,
        anyConnection: true,
        color: "#76adc4",
        friction: 1.5,
        reflectivity: 150
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
    [TileType.Tin]: {
        name: 'tin ore',
        texture: WorldAssets.middleground.tileset_tin,
        connected: true,
        anyConnection: false,
        color: "#31323b",
        friction: 3,
        reflectivity: 10
    },
    [TileType.Aluminum]: {
        name: 'aluminum ore',
        texture: WorldAssets.middleground.tileset_aluminum,
        connected: true,
        anyConnection: false,
        color: "#31323b",
        friction: 3,
        reflectivity: 17
    },
    [TileType.Gold]: {
        name: 'gold ore',
        texture: WorldAssets.middleground.tileset_gold,
        connected: true,
        anyConnection: false,
        color: "#31323b",
        friction: 3,
        reflectivity: 21
    },
    [TileType.Titanium]: {
        name: 'titanium ore',
        texture: WorldAssets.middleground.tileset_titanium,
        connected: true,
        anyConnection: false,
        color: "#31323b",
        friction: 3,
        reflectivity: 25
    },
    [TileType.Grape]: {
        name: 'grape ore',
        texture: WorldAssets.middleground.tileset_grape,
        connected: true,
        anyConnection: false,
        color: "#31323b",
        friction: 3,
        reflectivity: 29
    },
    [TileType.Wood0]: {
        name: 'raw wood',
        texture: WorldAssets.middleground.tileset_wood0,
        connected: true,
        anyConnection: true,
        color: "#a77145",
        friction: 3,
        reflectivity: 5
    },
    [TileType.Wood1]: {
        name: 'wood tier 1',
        texture: WorldAssets.middleground.tileset_wood1,
        connected: true,
        anyConnection: true,
        color: "#a77145",
        friction: 3,
        reflectivity: 5
    },
    [TileType.Wood2]: {
        name: 'wood tier 2',
        texture: WorldAssets.middleground.tileset_wood2,
        connected: true,
        anyConnection: true,
        color: "#a77145",
        friction: 3,
        reflectivity: 5
    },
    [TileType.Wood3]: {
        name: 'wood tier 3',
        texture: WorldAssets.middleground.tileset_wood3,
        connected: true,
        anyConnection: true,
        color: "#a77145",
        friction: 3,
        reflectivity: 5
    },
    [TileType.Wood4]: {
        name: 'wood tier 4',
        texture: WorldAssets.middleground.tileset_wood4,
        connected: true,
        anyConnection: true,
        color: "#a77145",
        friction: 3,
        reflectivity: 5
    },
    [TileType.Wood5]: {
        name: 'wood tier 5',
        texture: WorldAssets.middleground.tileset_wood5,
        connected: true,
        anyConnection: true,
        color: "#a77145",
        friction: 3,
        reflectivity: 5
    },
    [TileType.Wood6]: {
        name: 'wood tier 6',
        texture: WorldAssets.middleground.tileset_wood6,
        connected: true,
        anyConnection: true,
        color: "#a77145",
        friction: 3,
        reflectivity: 5
    },
    [TileType.Wood7]: {
        name: 'wood tier 7',
        texture: WorldAssets.middleground.tileset_wood7,
        connected: true,
        anyConnection: true,
        color: "#a77145",
        friction: 3,
        reflectivity: 5
    },
    [TileType.Wood8]: {
        name: 'wood tier 8',
        texture: WorldAssets.middleground.tileset_wood8,
        connected: true,
        anyConnection: true,
        color: "#a77145",
        friction: 3,
        reflectivity: 5
    },
    [TileType.Wood9]: {
        name: 'wood tier 9',
        texture: WorldAssets.middleground.tileset_wood9,
        connected: true,
        anyConnection: true,
        color: "#a77145",
        friction: 3,
        reflectivity: 5
    },
};

// export const TileEntitiesRenderData: Record<TileEntities, TileEntityRenderData> = {
    // [TileEntities.Tier1Drill]: {
        // texture: undefined
    // },
    // [TileEntities.Tier2Drill]: {
        // texture: undefined
    // }
// }