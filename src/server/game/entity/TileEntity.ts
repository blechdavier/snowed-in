import { World } from '../World';
import {
	TileEntities,
	TileEntityData,
} from '../../../global/TileEntity';
import { TileType } from '../../../global/Tile';

export class TileEntity{
	id: string;

	x: number;
	y: number;

	width: number;
	height: number;

	world: World;

	coveredTiles: number[] = [];

	image: number | number[]

	payload: TileEntityData = {type_: TileEntities.Tree, data: {woodCount: 0, seedCount: 0}, animate: false, animFrame: 0};

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

		this.x = x;
		this.y = y;

		this.world = world;

		this.id = id;

		const updatedTiles = [];
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				const worldX = x + this.x;
				const worldY = y + this.y;
				const worldIndex = worldY * this.world.width + worldX;

				if (this.world.tiles[worldIndex] !== TileType.Air) {
					throw new Error(
						'Could not place tileEntity because there are tiles in the way: tileType: '+this.world.tiles[worldIndex]+".",
					);
				}
				updatedTiles.push(worldIndex);
			}
		}
		this.coveredTiles = updatedTiles;

		updatedTiles.forEach(index => {
			this.world.tiles[index] = this.id;
		});
		this.world.tileEntities[this.id] = this;
	}

	remove() {
		this.coveredTiles.forEach(index => {
			this.world.tiles[index] = TileType.Air;
		});
		delete this.world.tileEntities[this.id];
	}

}

export class Tree extends TileEntity {

	payload: TileEntityData;

	constructor(world: World, x: number, y: number, id: string) {
		super(world, 4, 6, x, y, id);
		this.image = randint(0, 9);//pick a random of the tree images to be the image
		this.payload = {type_: TileEntities.Tree, data: {woodCount: randint(20, 40), seedCount: randint(2, 4)}, animate: false, animFrame: randint(0, 9)}
		this.cut();
		/*

			Error here is caused because it wants the woodCount and seedCount to be in every type of TileEntity at once.
			For example, woodCount is in Tree, but not Tier1Drill, Tier2Drill, etc.
			The same goes the other way around.
			Level or Active can't be set because they're not present in Tree

			I ended up commenting out everything but Tree and Tier1Drill so the errors are easier to read.

		*/
	}

	cut(amount?: number) {
		if(amount != undefined) amount = 1;
		console.log("cut "+amount+" times (this function doesn't do anything yet)");
	}
}

// export class T1Drill extends TileEntity {
// 	constructor(world: World, x: number, y: number, id: string) {
// 		super(world, 1, 2, x, y, id);
// 	}

// 	getData(): TileEntityData {
// 		return {
// 			type: TileEntities.Tier1Drill,
// 			data: { level: 0, active: true },
// 		};
// 	}
// }


function randint(x1: number, x2: number) {
	return (Math.floor(x1+Math.random()*(x2+1-x1)))
}