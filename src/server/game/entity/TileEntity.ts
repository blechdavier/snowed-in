import { World } from '../World';
import { TileEntities, TileEntityData, TileEntityPayload } from '../../../global/TileEntity';
import { TileType } from '../../../global/Tile';
import { Inventory } from '../inventory/Inventory';
import { InventoryUpdatePayload, ItemType } from '../../../global/Inventory';
import { updateRestTypeNode } from 'typescript';

export abstract class TileEntityBase {
	id: string;

	x: number;
	y: number;
	world: World;

	width: number;
	height: number;

	coveredTiles: number[] = [];
	type: TileEntities
	reflectedTiles: number[] = [];

	protected constructor(
		world: World,
		width: number,
		height: number,
		x: number,
		y: number,
		id: string,
		type: TileEntities
	) {
		this.type = type
		this.width = width;
		this.height = height;

		this.world = world;

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
		updatedTiles.forEach((tileIndex)=>{
			this.reflectedTiles.push(tileIndex+this.world.width*(Math.round((Math.max(//can cause some issues with very very wide tile entities
				...this.coveredTiles,
			)-Math.min(
				...this.coveredTiles,
			))/this.world.width)+1));
		})
		

		updatedTiles.forEach(index => {
			world.tiles[index] = this.id;
		});
	}

	remove() {
		const updatePayload: {
			tileIndex: number;
			tile: TileType | string;
		}[] = []
		this.coveredTiles.forEach(index => {
			this.world.tiles[index] = TileType.Air;
			updatePayload.push({tile: TileType.Air, tileIndex: index})
		});
		delete this.world.tileEntities[this.id];
		return updatePayload
	}

	getPayload(): TileEntityPayload {
		return {
			id: this.id,
			payload: this.getData(),
			coveredTiles: this.coveredTiles,
			reflectedTiles: this.reflectedTiles,
		};
	}

	abstract interact(playerInventory: Inventory): InventoryUpdatePayload;

	abstract getData(): TileEntityData;
}

export class Tree extends TileEntityBase {

	woodCount: number = randint(20, 40)
	seedCount: number = randint(2, 4)

	constructor(world: World, x: number, y: number, id: string) {
		super(world, 4, 6, x, y, id, TileEntities.Tree);

		world.tileEntities[this.id] = this;
	}

	interact(playerInv: Inventory) {
		// console.log(playerInv.mainInventory)
		let inventoryUpdatePayload: InventoryUpdatePayload = [];

		if (this.woodCount + this.seedCount > 0) {
			if (
				Math.random() <
				this.woodCount /
					(this.woodCount + this.seedCount)
			) {
				inventoryUpdatePayload = inventoryUpdatePayload.concat(playerInv.attemptPickUp(ItemType.Wood0Block));
			} else {
				inventoryUpdatePayload = inventoryUpdatePayload.concat(playerInv.attemptPickUp(ItemType.Seed));
			}
		}
		console.log(inventoryUpdatePayload)
		return inventoryUpdatePayload;
	}

	getData(): TileEntityData {
		return {
			type_: TileEntities.Tree,
			data: { woodCount: this.woodCount, seedCount: this.seedCount},
		}
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

export const TileEntityProtoMap: Record<TileEntities, any> = {
	[TileEntities.Tree]: Tree.prototype,
	[TileEntities.Seed]: undefined,
	[TileEntities.Tier1Drill]: undefined,
	[TileEntities.Tier2Drill]: undefined,
	[TileEntities.Tier3Drill]: undefined,
	[TileEntities.Tier4Drill]: undefined,
	[TileEntities.Tier5Drill]: undefined,
	[TileEntities.CraftingBench]: undefined

}