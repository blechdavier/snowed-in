import { Snapshot } from '@geckos.io/snapshot-interpolation/lib/types';
import { Entities, EntityPayload } from './Entity';
import { TileEntityPayload } from './TileEntity';
import { TileType } from './Tile';

export interface ServerEvents {
    /**
     * Will send initialization data to the client such as the tick rate of the game
     */
    init: (playerTickRate: number, userToken?: string) => void;
    /**
     * Sends information to the client required for loading a game world
     */
    worldLoad: (
        width: number,
        height: number,
        tiles: (TileType | string)[],
        tileEntities: TileEntityPayload[],
        entities: EntityPayload[],
        player: EntityPayload<Entities.LocalPlayer>
    ) => void;
    /**
     * Sends information about updated tiles
     */
    worldUpdate: (
        updatedTiles: {
            tileIndex: number;
            tile: TileType | string;
        }[]
    ) => void;
    /**
     * Will set the client player position and velocity
     */
    setPlayer: (x: number, y: number, yVel: number, xVel: number) => void;

    /**
     * Sends an entity position snapshot used for interpolation
     */
    entitySnapshot: (snapshot: Snapshot) => void;
    /**
     * Creates a new world entity
     */
    entityCreate: (entityData: EntityPayload) => void;
    /**
     * Updates a world entity
     */
    entityUpdate: (entityData: EntityPayload) => void;
    /**
     * Deletes a world entity
     */
    entityDelete: (id: EntityPayload['id']) => void;
}

export interface ClientEvents {
    worldPlace: (x: number, y: number) => void;

    worldBreakStart: (tileIndex: number) => void;
    worldBreakCancel: () => void;
    worldBreakFinish: () => void;

    playerUpdate: (x: number, y: number) => void;

    create: (name: string, clientName: string, maxPlayers: number, listed: boolean) => void;
    join: (serverId: string, name: string) => void;
}