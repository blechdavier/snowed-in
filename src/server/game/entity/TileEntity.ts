import { World } from '../World';
import { TileEntities, TileEntityData } from '../../../global/TileEntity';
import { TileType } from '../../../global/Tile';
import { Inventory } from '../inventory/Inventory';
import { InventoryUpdatePayload, ItemType } from '../../../global/Inventory';

export interface TileEntity {
	id: string;
	x: number;
	y: number;
	width: number;
	height: number;
	coveredTiles: number[];
	image: number | number[];
	world: World
	payload: TileEntityData
	remove(): any // apparently any type is better than void??? https://medium.com/@jeffbutsch/typescript-interface-functions-c691a108e3f1
	interact(): any //not strongly typed necessarily because the interact function takes different parameters and returns different values for different classes that implement this
}

export class TileEntityBase {
	id: string;

	x: number;
	y: number;
	world: World

	width: number;
	height: number;

	coveredTiles: number[] = [];

	image: number | number[];

	payload: TileEntityData = {
		type_: TileEntities.Tree,
		data: { woodCount: 0, seedCount: 0 },
		animate: false,
		animFrame: 0,
	};

	protected constructor(
		world: World,
		width: number,
		height: number,
		x: number,
		y: number,
		id: string,
	) {
		this.width = width;
		this.height = height;

		this.image = -1;
		this.world = world

		this.x = x;
		this.y = y;

		this.id = id;

		const updatedTiles = [];
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				const worldX = x + this.x;
				const worldY = y + this.y;
				const worldIndex = worldY * world.width + worldX;

				if (world.tiles[worldIndex] !== TileType.Air) {
					throw new Error(
						'Could not place tileEntity because there are tiles in the way: tileType: ' +
						world.tiles[worldIndex] +
							'.',
					);
				}
				updatedTiles.push(worldIndex);
			}
		}
		this.coveredTiles = updatedTiles;

		updatedTiles.forEach(index => {
			world.tiles[index] = this.id;
		});
	}

	remove() {
		this.coveredTiles.forEach(index => {
			this.world.tiles[index] = TileType.Air;
		});
		delete this.world.tileEntities[this.id];
	}

	interact() {

	}
}

export class Tree extends TileEntityBase implements TileEntity {
	payload: {
		type_: TileEntities.Tree;
		data: { woodCount: number; seedCount: number };
		animate: boolean;
		animFrame: number;
	};

	constructor(world: World, x: number, y: number, id: string) {
		super(world, 4, 6, x, y, id);
		this.payload = {
			type_: TileEntities.Tree,
			data: { woodCount: randint(20, 40), seedCount: randint(2, 4) },
			animate: false,
			animFrame: randint(0, 9),
		};
		world.tileEntities[this.id] = this;
	}

	interact(/*playerInv: Inventory, amount?: number*/) {//cut down 1 item from the tree
		// if (amount == undefined) amount = 1;//default to 1 item cut if no other is specified
		// let P: InventoryUpdatePayload = [];
		// for (let i = 0; i < amount; i++) {
		// 	if (this.payload.data.woodCount + this.payload.data.seedCount > 0) {
		// 		if (
		// 			Math.random() <
		// 			this.payload.data.woodCount /
		// 				(this.payload.data.woodCount +
		// 					this.payload.data.seedCount)
		// 		) {
		// 			let p = playerInv.attemptPickUp(ItemType.Wood0Block);
		// 			if (p[0].item!=undefined)
		// 				this.payload.data.woodCount--;
		// 				i = P.findIndex(element => element.slot === p[0].slot);
		// 				if(i!==-1) {
		// 					P[i] = p[0];
		// 				}
		// 				else {
		// 					P.push(p[0]);
		// 				}
		// 		} else {
		// 			let p = playerInv.attemptPickUp(ItemType.Seed);
		// 			if (p[0].item!=undefined)
		// 				this.payload.data.seedCount--;
		// 				i = P.findIndex(element => element.slot === p[0].slot);
		// 				if(i!==-1) {
		// 					P[i] = p[0];
		// 				}
		// 				else {
		// 					P.push(p[0]);
		// 				}
		// 		}
		// 	}
		// }
		// return P
	}
}

// export abstract class T1Drill extends TileEntity {
// 	constructor(world: World, x: number, y: number, id: string) {
// 		super(world, 1, 2, x, y, id);
// 		this.payload = {
// 			type_: TileEntities.Tier1Drill,
// 			data: {},
// 			animate: true,
// 			animFrame: 0,
// 		};
// 	}
// }

// export abstract class Sapling extends TileEntity {
// 	constructor(world: World, x: number, y: number, id: string) {
// 		super(world, 4, 6, x, y, id);
// 		this.payload = {
// 			type_: TileEntities.Seed,
// 			data: {},
// 			animate: true,
// 			animFrame: 0,
// 		};
// 	}
// }

function randint(x1: number, x2: number) {
	return Math.floor(x1 + Math.random() * (x2 + 1 - x1));
}
