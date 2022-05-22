import SimplexNoise from 'simplex-noise';
import { TileType } from '../../global/Tile';
import { expose } from 'threads';
import { Tree } from '../game/entity/TileEntity';
import { World } from '../game/World';
import { v4 as uuidv4 } from 'uuid';
import { isTypeLiteralNode } from 'typescript';

export type WorldWorkerData = typeof workerData;

const workerData = {
	generateWorld: (world: World) => {
		let spawnPosition: { x: number; y: number };

		// Create a new perlin noise map with an optional seed
		const noise = new SimplexNoise(world.seed);

		// Generate terrain
		{
			// this generation algorithm is by no means optimized
			for (let y = 0; y < world.height; y++) {
				// y will be the y position of world.tiles being generated
				for (let x = 0; x < world.width; x++) {
					// x is x position
					if (belowDirtHeight(x, y, noise)) {
						if (belowStoneHeight(x, y, noise)) {
							world.tiles[y * world.width + x] = typeOfStone(x, y, noise);
							let t = world.tiles[y*world.width+x];
							if (typeof t==="number") {
							if([TileType.Tin, TileType.Aluminum, TileType.Gold, TileType.Titanium, TileType.Grape].includes(t)) world.regeneratingTiles[y*world.width+x] = t;}
						} else {
							world.tiles[y * world.width + x] = TileType.Dirt;
						}
					} else {
						if (belowIceHeight(x, y, noise)) {
							world.tiles[y * world.width + x] = TileType.Ice;
						} else {
							world.tiles[y * world.width + x] = TileType.Air;
						}
					}
				}
			}
		}

		//generate snow

		for (let x = 0; x < world.width; x++) {
			let y: number = 0;
			while (y < world.height && world.tiles[y * world.width + x] === TileType.Air) {
				y++;
			}
			if (y >= world.height) continue; //if the tile that's being changed is below the world, give up before any issues happen
			if (world.tiles[y * world.width + x] === TileType.Ice) {
				//ice
				//make sure the top of the world isn't being modified
				while (y > 0 && belowIceLakeSnowHeight(x, y, noise)) {
					y--;
					world.tiles[y * world.width + x] = TileType.Snow;
				}
			} else {
				//not ice
				//make sure the top of the world isn't being modified
				while (y > 0 && belowSnowHeight(x, y, noise)) {
					y--;
					world.tiles[y * world.width + x] = TileType.Snow;
				}
			}
		}

		// generate trees
		new Tree(world, 256, 3, uuidv4());
		for (let t = 0; t < world.width*2; t++) {
			let x = Math.floor(Math.random() * world.width);
			for (let i = 0; i < world.height - 1; i++) {
				if (
					(world.tiles[(i + 1) * world.width + x + 1] === TileType.Dirt ||
						world.tiles[(i + 1) * world.width + x + 1] === TileType.Snow) &&
					(world.tiles[(i + 1) * world.width + x + 2] === TileType.Dirt ||
						world.tiles[(i + 1) * world.width + x + 2] === TileType.Snow)
				) {
					let isOpen = true;
					for (let j = 0; j < 4; j++) {
						for (let k = 0; k < 6; k++) {
							if (
								!inWorld(x + j, i - k, world.width, world.height) ||
								world.tiles[(i - k) * world.width + x + j] !== TileType.Air
							) {
								isOpen = false;
								break;
							}
						}
						if(!isOpen)//break out of this loop if there isn't enough room: saves time
						break;
					}
					//console.log("tree would have been generated")
					if (isOpen) {
						const id = uuidv4()
						world.tileEntities[id] =  new Tree(world, x, i-5, id);
					}
					break;
				}
			}
		}
		// Find spawn position
		{
			spawnPosition = {
				x: Math.floor(world.width / 2),
				y: 0,
			};
		}
		console.log('Finished World Generation');
		//console.log("printing object")
		//console.log(world.tileEntities);
		return { tiles: world.tiles, spawnPosition: world.spawnPosition, tileEntities: world.tileEntities, regeneratingTiles: world.regeneratingTiles };
	},
};

expose(workerData);

function belowSnowHeight(x: number, y: number, noise: SimplexNoise) {
	return fractalNoise(x / 3, noise) * 30 + 50 < y;
}

function belowDirtHeight(x: number, y: number, noise: SimplexNoise) {
	return fractalNoise(x / 3, noise) * 30 + 57 < y;
}

function belowStoneHeight(x: number, y: number, noise: SimplexNoise) {
	return (
		fractalNoise(x / 3, noise) * 30 + 65 < y &&
		noise.noise2D(x / 50, y / 50) > -0.8
	);
}

function typeOfStone(x: number, y: number, noise: SimplexNoise) {
	if(x===256 || x===257) return TileType.Air;
	let hardness: number = y - 35 + noise.noise2D(x / 3, y / 3) * 5;
	if (hardness < 50) {
		if (noise.noise2D(x / 15, y / 15) > 0.8) return TileType.Tin;
		return TileType.Stone0;
	} else if (hardness < 80) {
		return TileType.Stone1;
	} else if (hardness < 110) {
		if (noise.noise2D(x / 15, y / 15) > 0.8) return TileType.Aluminum;
		return TileType.Stone2;
	} else if (hardness < 135) {
		return TileType.Stone3;
	} else if (hardness < 155) {
		if (noise.noise2D(x / 15, y / 15) > 0.8) return TileType.Gold;
		return TileType.Stone4;
	} else if (hardness < 170) {
		return TileType.Stone5;
	} else if (hardness < 180) {
		if (noise.noise2D(x / 15, y / 15) > 0.8) return TileType.Titanium;
		return TileType.Stone6;
	} else if (hardness < 187) {
		return TileType.Stone7;
	} else if (hardness < 195) {
		if (noise.noise2D(x / 15, y / 15) > 0.8) return TileType.Grape;
		return TileType.Stone8;
	} else {
		return TileType.Stone9;
	}
}

function belowIceHeight(x: number, y: number, noise: SimplexNoise) {
	return 61 < y;
}

function belowIceLakeSnowHeight(x: number, y: number, noise: SimplexNoise) {
	return fractalNoise(x / 3, noise) * 80 + 41 < y;
}

function sharpenedNoise(x: number, noise: SimplexNoise) {
	return (
		noise.noise2D(x, 0) * 3 -
		noise.noise2D(x + 0.2, 0) -
		noise.noise2D(x - 0.2, 0)
	);
}

function fractalNoise(x: number, noise: SimplexNoise) {
	return (
		noise.noise2D(x / 54, 0) * 0.5 +
		noise.noise2D(x / 21, 100) * 0.2 +
		noise.noise2D(x / 12, 200) * 0.2 +
		noise.noise2D(x / 5, 300) * 0.1
	);
}

function inWorld(x: number, y: number, w: number, h: number) {
	return x > 0 && y > 0 && x < w && y < h;
}
