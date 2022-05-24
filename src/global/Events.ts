import { Snapshot } from '@geckos.io/snapshot-interpolation/lib/types';
import { Entities, EntityPayload } from './Entity';
import { TileEntityPayload } from './TileEntity';
import { TileType } from './Tile';
import { InventoryPayload, InventoryUpdatePayload } from './Inventory';

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
		player: EntityPayload<Entities.LocalPlayer>,
		inventory: InventoryPayload
	) => void;
	/**
	 * Sends information about updated tiles
	 */
	worldUpdate: (
		updatedTiles: {
			tileIndex: number;
			tile: TileType | string;
		}[],
	) => void;
	/**
	 * Tells the client when their items has been updated
	 */
	inventoryUpdate: (updates: InventoryUpdatePayload) => void;

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
	/**
	* Sends an entity position snapshot used for interpolation
	*/
	onPlayerAnimation: (animationName: string, playerId: string) => void;

	tileEntityDelete: (id: string) => void;
}

export interface ClientEvents {
	worldBreakStart: (tileIndex: number) => void;
	worldBreakCancel: () => void;
	worldBreakFinish: () => void;

	worldPlace: (inventoryIndex: number, x: number, y: number) => void;

	playerUpdate: (x: number, y: number) => void;

	inventorySwap: (sourceSlot: number, destinationSlot: number) => void;
	inventoryDrop: (slot: number, amount: number) => void;

	/**
	 * Create a game server
	 */
	create: (
		name: string,
		clientName: string,
		maxPlayers: number,
		listed: boolean,
	) => void;
	/**
	 * Join a game server
	 */
	join: (serverId: string, name: string) => void;

	tileEntityInteract: (updatedTile: number) => void;

	/**
	* Sends an entity position snapshot used for interpolation
	*/
	playerAnimation: (animationName: string, playerId: string) => void;
}
