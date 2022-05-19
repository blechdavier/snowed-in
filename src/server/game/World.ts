import { Tree, TileEntityBase, TileEntityProtoMap } from './entity/TileEntity';
import { TileType } from '../../global/Tile';
import { workers } from '../Main';
import { v4 as uuidv4 } from 'uuid';
import { ItemStack } from '../../global/Inventory';
import { Item } from './entity/Item';

export class World {
	// World
	tiles: WorldTiles;

	tileEntities: { [id: string]: TileEntityBase } = {};

	items: { [id: string]: Item } = {};

	seed: string | undefined;
	width: number;
	height: number;

	// World spawn position
	spawnPosition: { x: number; y: number } = { x: 0, y: 0 };

	constructor(width: number, height: number, seed?: string) {
		this.width = width;
		this.height = height;
		this.seed = seed;
		// Initialize the tiles sets
		this.tiles = new WorldTiles(width, height);
	}

	async generate() {
		// Set the world to the generated world

		const world = await workers.worldWorker.generateWorld(this);

		this.tiles = Object.setPrototypeOf(
			{ ...world.tiles, width: this.width, height: this.height },
			WorldTiles.prototype,
		);

		this.tileEntities = Object.fromEntries(Object.entries(world.tileEntities).map(tileEntry => {
			return [tileEntry[0], Object.setPrototypeOf(tileEntry[1], TileEntityProtoMap[tileEntry[1].type])]
		}))

		this.spawnPosition = world.spawnPosition;
		this.tiles[
			Math.round(this.width) / 2 +
			(Math.round(this.height) / 2) * this.width
		] = TileType.Air;
		this.tiles[
			Math.round(this.width) / 2 +
			(Math.round(this.height) / 2) * this.width +
			this.width
		] = TileType.Air;
	}

	spawnItem(x: number, y: number, item: ItemStack) {
		const id = uuidv4();

		this.items[id] = new Item(uuidv4(), item, x, y);
	}
}

export class WorldTiles extends Array<TileType | string> {
	width: number;
	height: number;

	constructor(width: number, height: number) {
		super(width * height);
		this.width = width;
		this.height = height;
	}

	getTileAt(x: number, y: number) {
		return this[x + y * this.width];
	}

	getTileIndexAt(x: number, y: number) {
		return x + y * this.width;
	}

	getCoordinates(index: number) {
		return {
			x: index % this.width,
			y: Math.floor(index / this.height),
		};
	}
}
