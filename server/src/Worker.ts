import * as WorkerPool  from 'workerpool'
import { Promise } from 'workerpool';
import SimplexNoise from 'simplex-noise';
import { TileType } from '../../api/Tile';

export type Tasks = {
    exec<T extends (...args: any[]) => any>(
        method: "generate",
        params: [number, number, string?],
    ): Promise<{tiles: number[], backgroundTiles: number[], spawnPosition: {x: number, y: number}}>;
}

WorkerPool.worker({
    // Generate the world
    generate: (width: number, height: number, seed?: string) => {

        const tiles: TileType[] = []
        const backgroundTiles: TileType[] = []
        let spawnPosition: {x: number, y: number}

        // Create a new perlin noise map with an optional seed
        const noise = new SimplexNoise(seed);

        // Generate terrain
        {
            // this generation algorithm is by no means optimized
            for (let y = 0; y < height; y++) {
                // y will be the y position of tiles being generated
                for (let x = 0; x < width; x++) {
                    // x is x position
                    if (belowTerrainHeight(x, y, noise)) {
                        if (belowIceHeight(x, y, noise)) {
                            tiles[y * width + x] = TileType.Ice;
                        } else {
                            tiles[y * width + x] = TileType.Snow;
                        }
                    } else {
                        tiles[y * width + x] = TileType.Air;
                    }
                }
            }

            for (let i = 0; i < height; i++) {
                // i will be the y position of background tiles being generated
                for (let j = 0; j < width; j++) {
                    // j is x position
                    // if this tiles and its eight surrounding tiles are below the height of the terrain (at one point could be a tiles of snow, ice, etc.), then add a background tiles there.
                    if (
                        belowTerrainHeight(j - 1, i - 1, noise) &&
                        belowTerrainHeight(j - 1, i, noise) &&
                        belowTerrainHeight(j - 1, i + 1, noise) &&
                        belowTerrainHeight(j, i - 1, noise) &&
                        belowTerrainHeight(j, i, noise) &&
                        belowTerrainHeight(j, i + 1, noise) &&
                        belowTerrainHeight(j + 1, i - 1, noise) &&
                        belowTerrainHeight(j + 1, i, noise) &&
                        belowTerrainHeight(j + 1, i + 1, noise)
                    ) {
                        backgroundTiles[i * width + j] = TileType.Snow;
                    } else {
                        backgroundTiles[i * width + j] = TileType.Air;
                    }
                }
            }
        }

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
        return {tiles: tiles, backgroundTiles: backgroundTiles, spawnPosition: spawnPosition}
    },
})

function belowTerrainHeight(x: number, y: number, noise: SimplexNoise) {
    return (noise.noise2D(x / 50, 0) / 3) * 16 + 20 < y;
}

function belowIceHeight(x: number, y: number, noise: SimplexNoise) {
    return (noise.noise2D(x / 50, 0) / 3) * 6 + 31 < y;
}