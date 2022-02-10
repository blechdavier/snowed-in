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
        // Create a new pearlin noise map with an optional seed
        const noise = new SimplexNoise(seed);

        // this generation algorithm is by no means optimized
        for (let i = 0; i < height; i++) {
            // i will be the y position of tile being generated
            for (let j = 0; j < width; j++) {
                // j is x position " "    "      "
                if (this.belowTerrainHeight(j, i, noise)) {
                    if (this.belowIceHeight(j, i, noise)) {
                        this.tiles[i * width + j] = 2;
                    } else {
                        this.tiles[i * width + j] = 1;
                    }
                } else {
                    this.tiles[i * width + j] = 0;
                }
            }
        }
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

        // Set the spawn position
        this.spawnPosition = {
            x: Math.round(this.width / 2),
            y: Math.round(this.height / 2),
        };
    }

    belowTerrainHeight(x: number, y: number, noise: SimplexNoise) {
        return noise.noise2D(x / 50, 0) * 16 + 20 < y;
    }

    belowIceHeight(x: number, y: number, noise: SimplexNoise) {
        return (
            noise.noise2D(x / 50, 0) * 6 + 31 <
            y + noise.noise2D(x / 2, y / 2) * 0
        );
    }
}
