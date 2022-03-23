import * as WorkerPool  from 'workerpool'
import { Promise } from 'workerpool';
import SimplexNoise from 'simplex-noise';
import { TileType } from '../../api/Tile';
import { WorldTiles } from './game/World';

export type Tasks = {
    exec<T extends (...args: any[]) => any>(
        method: "generate",
        params: [number, number, string?],
    ): Promise<{tiles: WorldTiles, spawnPosition: {x: number, y: number}}>;
}

WorkerPool.worker({
    // Generate the world
    generate: (width: number, height: number, seed?: string) => {

        const tiles: TileType[] = []
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
        return {tiles: tiles, spawnPosition: spawnPosition}
    },
})

function belowTerrainHeight(x: number, y: number, noise: SimplexNoise) {
    return (noise.noise2D(x / 50, 0) / 3) * 16 + 20 < y;
}

function belowIceHeight(x: number, y: number, noise: SimplexNoise) {
    return (noise.noise2D(x / 50, 0) / 3) * 6 + 31 < y;
}