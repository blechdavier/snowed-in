import SimplexNoise from 'simplex-noise';

export class World {
    // World
    tiles: number[];
    backgroundTiles: number[];
    width: number;
    height: number;

    spawnPosition: { x: number; y: number };

    constructor(width: number, height: number, seed?: string) {
        this.width = width;
        this.height = height;

        // Initialize the tile sets
        this.tiles = new Array(this.width * this.height);
        this.backgroundTiles = new Array(this.width * this.height);

        // Generate the world
        // Create a new perlin noise map with an optional seed
        let start = process.hrtime.bigint()
        const noise = new SimplexNoise(seed);

        // this generation algorithm is by no means optimized
        for (let y = 0; y < height; y++) {
            // y will be the y position of tile being generated
            for (let x = 0; x < width; x++) {
                // x is x position
                if (this.belowTerrainHeight(x, y, noise)) {
                    if (this.belowIceHeight(x, y, noise)) {
                        this.tiles[y * width + x] = 2;
                    } else {
                        this.tiles[y * width + x] = 1;
                    }
                } else {
                    this.tiles[y * width + x] = 0;
                }
            }
        }
        console.log(`World generation took: ${Number(process.hrtime.bigint() - start) / 1000000}ms`)
        start = process.hrtime.bigint()
        for (let i = 0; i < height; i++) {
            // i will be the y position of background tile being generated
            for (let j = 0; j < width; j++) {
                // j is x position " "    "      "
                // if this tile and its eight surrounding tiles are below the height of the terrain (at one point could be a tile of snow, ice, etc.), then add a background tile there.
                if (
                    this.belowTerrainHeight(j - 1, i - 1, noise) &&
                    this.belowTerrainHeight(j - 1, i, noise) &&
                    this.belowTerrainHeight(j - 1, i + 1, noise) &&
                    this.belowTerrainHeight(j, i - 1, noise) &&
                    this.belowTerrainHeight(j, i, noise) &&
                    this.belowTerrainHeight(j, i + 1, noise) &&
                    this.belowTerrainHeight(j + 1, i - 1, noise) &&
                    this.belowTerrainHeight(j + 1, i, noise) &&
                    this.belowTerrainHeight(j + 1, i + 1, noise)
                ) {
                    this.backgroundTiles[i * width + j] = 1;
                } else {
                    this.backgroundTiles[i * width + j] = 0;
                }
            }
        }
        console.log(`Background tile generation took: ${Number(process.hrtime.bigint() - start) / 1000000}ms`)
        // Set the spawn position
        this.spawnPosition = { x: this.width / 2, y: this.height / 2 };
    }

    belowTerrainHeight(x: number, y: number, noise: SimplexNoise) {
        return (noise.noise2D(x / 50, 0) / 2) * 16 + 20 < y;
    }

    belowIceHeight(x: number, y: number, noise: SimplexNoise) {
        return (noise.noise2D(x / 50, 0) / 2) * 6 + 31 < y;
    }
}
