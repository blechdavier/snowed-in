import SimplexNoise from 'simplex-noise';
import { TileType } from '../../global/Tile';
import { expose } from 'threads';

export type WorldWorkerData = typeof workerData;

const workerData = {
	generateWorld: (width: number, height: number, seed?: string) => {
		const tiles: TileType[] = []
	let spawnPosition: { x: number, y: number }

	// Create a new perlin noise map with an optional seed
	const noise = new SimplexNoise(seed);

	// Generate terrain
	{
		// this generation algorithm is by no means optimized
		for (let y = 0; y < height; y++) {
			// y will be the y position of tiles being generated
			for (let x = 0; x < width; x++) {
				// x is x position
				if (belowDirtHeight(x, y, noise)) {
					if (belowStoneHeight(x, y, noise)) {
						tiles[y * width + x] = typeOfStone(x, y, noise);
					}
					else {
						tiles[y * width + x] = TileType.Dirt;
					}
				}
				else {
					if (belowIceHeight(x, y, noise)) {
						tiles[y * width + x] = TileType.Ice;
					}
					else {
						tiles[y * width + x] = TileType.Air;
					}
				}
			}
		}
	}

	//generate snow

	for (let x = 0; x < width; x++) {
		let y: number = 0;
		while(y<height && tiles[y * width + x]===TileType.Air) {
			y++;
		}
		if(y>=height)
			continue;//if the tile that's being changed is below the world, give up before any issues happen
		if(tiles[y * width + x]===TileType.Ice) {//ice
			//make sure the top of the world isn't being modified
			while(y>0 && belowIceLakeSnowHeight(x, y, noise)) {
				y--;
				tiles[y * width + x] = TileType.Snow;
			}
		}
		else {//not ice
			//make sure the top of the world isn't being modified
			while(y>0 && belowSnowHeight(x, y, noise)) {
				y--;
				tiles[y * width + x] = TileType.Snow;
			}
		}
	}

	// //generate caves
	// {
	//     for (let c = 0; c < 10; c++) {
	//         let startX: number = Math.random() * width;
	//         let startY: number = Math.random() * height;
	//         for (let i = 0; i < height; i++) {
	//             if (tiles[width * (Math.round(startY) + i) + Math.round(startX)] !== TileType.Air) {
	//                 startY += i;
	//                 break;
	//             }
	//         }
	//         for (let k = 0; k < 1; k += 0.00333333333334) {
	//             let r: number = -25*((k-0.5)*(k-0.5))+6.25;
	//             //console.log(`cave iteration at x: ${startX}, y: ${startY} with radius: ${r}`);
	//             startX += (noise.noise2D(startX / 25, startY / 25)) * r*2;
	//             startY += (noise.noise2D(startY / 5, startX / 5)) * r;
	//             for (let i = -Math.floor(r); i < Math.ceil(r); i++) {
	//                 for (let j = -Math.floor(r); j < Math.ceil(r); j++) {
	//                     tiles[width * (Math.round(startY) + j) + Math.round(startX) + i] = TileType.Air;
	//                 }
	//             }
	//         }
	//     }
	// }

	// generate trees
	//console.log("tried to tree? generated")
	for(let t = 0; t<width; t++) {
		let x = Math.floor(Math.random()*width);
		for(let i = 0; i<height-1; i++) {
			if((tiles[(i+1) * width + x + 1] === TileType.Dirt || tiles[(i+1) * width + x + 1] === TileType.Snow) && (tiles[(i+1) * width + x + 2] === TileType.Dirt || tiles[(i+1) * width + x + 2] === TileType.Snow)) {
				let isOpen = true;
				for(let j = 0; j<4; j++) {
					for(let k = 0; k<6; k++) {
						//console.log(`tested block ${x+j}, ${i-k} for block ${x}, ${i}`);
						if(!inWorld(x+j, i-k, width, height) || tiles[(i-k) * width + x + j] !== TileType.Air) {
							isOpen = false;
							//break;
						}
					}
					//if(!isOpen)//break out of this loop if there isn't enough room to save time
						//break;
				}
				//console.log("tree would have been generated")
				if(isOpen) {
					//console.log("tree generated")
					tiles[i * width + x] = TileType.Stone0
					tiles[(i-6) * width + x] = TileType.Dirt
					tiles[i * width + x+3] = TileType.Dirt
					tiles[(i-6) * width + x+3] = TileType.Dirt
				}
				break;
			}
		}
	}
	// Find spawn position
	{
		spawnPosition = {
			x: Math.floor(width / 2),
			y: 0,
		};
	}
	console.log("Finished World Generation")
	return { tiles: tiles, spawnPosition: spawnPosition }
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
return fractalNoise(x / 3, noise) * 30 + 65 < y && noise.noise2D(x / 50, y / 50) > -0.8;
}

function typeOfStone(x: number, y: number, noise: SimplexNoise) {
let hardness: number = y - 35 + noise.noise2D(x / 3, y / 3) * 5;
if (hardness < 50) {
	if(noise.noise2D(x/15, y/15)>0.8) {
		console.log("generated tin")
		return TileType.Tin}
	return TileType.Stone0;
} else if (hardness < 80) {
	return TileType.Stone1;
} else if (hardness < 110) {
	if(noise.noise2D(x/15, y/15)>0.8) {
		console.log("generated aluminum")
		return TileType.Aluminum}
	return TileType.Stone2;
} else if (hardness < 135) {
	return TileType.Stone3;
} else if (hardness < 155) {
	return TileType.Stone4;
} else if (hardness < 170) {
	return TileType.Stone5;
} else if (hardness < 180) {
	return TileType.Stone6;
} else if (hardness < 187) {
	return TileType.Stone7;
} else if (hardness < 195) {
	return TileType.Stone8;
} else {
	return TileType.Stone9;
}

}

function belowIceHeight(x: number, y: number, noise: SimplexNoise) {
return 61 < y;
}

function belowIceLakeSnowHeight(x: number, y: number, noise: SimplexNoise) {
return fractalNoise(x / 3, noise) * 80 + 41 < y
}

function sharpenedNoise(x: number, noise: SimplexNoise) {
return noise.noise2D(x, 0) * 3 - noise.noise2D(x + 0.2, 0) - noise.noise2D(x - 0.2, 0);
}

function fractalNoise(x: number, noise: SimplexNoise) {
return noise.noise2D(x / 54, 0) * 0.5 + noise.noise2D(x / 21, 100) * 0.2 + noise.noise2D(x / 12, 200) * 0.2 + noise.noise2D(x / 5, 300) * 0.1;
}

function inWorld(x: number, y:number, w: number, h:number) {
	return x>0 && y>0 && x<w && y<h
}