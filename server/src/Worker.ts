import * as WorkerPool from 'workerpool'
import { Promise } from 'workerpool';
import SimplexNoise from 'simplex-noise';
import { TileType } from '../../api/Tile';
import { WorldTiles } from './game/World';

export type Tasks = {
    exec<T extends (...args: any[]) => any>(
        method: "generate",
        params: [number, number, string?],
    ): Promise<{ tiles: WorldTiles, spawnPosition: { x: number, y: number } }>;
}

WorkerPool.worker({
    // Generate the world
    generate: (width: number, height: number, seed?: string) => {

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

        // Find spawn position
        {
            for (let i = 0; i < height; i++) {
                if (
                    tiles[Math.floor(width / 2) + i * width - 1] !==
                    TileType.Air ||
                    tiles[Math.floor(width / 2) + i * width] !== TileType.Air ||
                    tiles[Math.floor(width / 2) + i * width + 1] !==
                    TileType.Air
                ) {
                    if (spawnPosition === undefined)
                        spawnPosition = {
                            x: Math.floor(width / 2),
                            y: i - 3,
                        };

                    // If the spawn is solid ground
                    if (
                        tiles[
                        Math.floor(width / 2) + i * width - 1
                        ] !== TileType.Air &&
                        tiles[Math.floor(width / 2) + i * width] !==
                        TileType.Air &&
                        tiles[
                        Math.floor(width / 2) + i * width + 1
                        ] !== TileType.Air
                    )
                        break;

                    // Set the ground to solid
                    tiles[Math.floor(width / 2) + i * width - 1] = TileType.Snow;
                    tiles[Math.floor(width / 2) + i * width] = TileType.Snow;
                    tiles[Math.floor(width / 2) + i * width + 1] = TileType.Snow;
                }
            }
        }
        return { tiles: tiles, spawnPosition: spawnPosition }
    },
})

function belowSnowHeight(x: number, y: number, noise: SimplexNoise) {
    return fractalNoise(x / 3, noise) * 30 + 25 < y;
}

function belowDirtHeight(x: number, y: number, noise: SimplexNoise) {
    return fractalNoise(x / 3, noise) * 30 + 32 < y;
}

function belowStoneHeight(x: number, y: number, noise: SimplexNoise) {
    return fractalNoise(x / 3, noise) * 30 + 40 < y && noise.noise2D(x / 50, y / 50) > -0.8;
}

function typeOfStone(x: number, y: number, noise: SimplexNoise) {
    let hardness: number = y + noise.noise2D(x / 3, y / 3) * 5;
    if (hardness < 50) {
        return TileType.Stone0;
    } else if (hardness < 80) {
        return TileType.Stone1;
    } else if (hardness < 110) {
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
    return 36 < y;
}

function belowIceLakeSnowHeight(x: number, y: number, noise: SimplexNoise) {
    return fractalNoise(x / 3, noise) * 80 + 16 < y
}

function sharpenedNoise(x: number, noise: SimplexNoise) {
    return noise.noise2D(x, 0) * 3 - noise.noise2D(x + 0.2, 0) - noise.noise2D(x - 0.2, 0);
}

function fractalNoise(x: number, noise: SimplexNoise) {
    return noise.noise2D(x / 54, 0) * 0.5 + noise.noise2D(x / 21, 100) * 0.2 + noise.noise2D(x / 12, 200) * 0.2 + noise.noise2D(x / 5, 300) * 0.1;
}