import { T1Drill, TileEntity } from './entity/TileEntity';
import { TileType } from '../../../api/Tile';
import { v4 as uuidv4 } from 'uuid';
import { pool } from '../Main';

export class World {
    // World
    tiles: WorldTiles = new WorldTiles()

    tileEntities: {[id: string]: TileEntity} = {}

    width: number;
    height: number;
    seed: string;

    // World spawn position
    spawnPosition: { x: number; y: number };

    constructor(width: number, height: number, seed?: string) {
        this.width = width;
        this.height = height;
        this.seed = seed;
        // Initialize the tiles sets
        this.tiles = new Array(this.width * this.height);
    }

    async generate() {
        // Queue a world generate task
        const tiles: {
            tiles: WorldTiles;
            spawnPosition: { x: number; y: number };
        } = await pool.exec('generate', [this.width, this.height, this.seed]);

        // Set the world to the generated world
        this.tiles = tiles.tiles;
        this.spawnPosition = tiles.spawnPosition;
        console.log((Math.round(this.width) / 2) + (Math.round(this.height) / 2) * this.width)
        this.tiles[(Math.round(this.width) / 2) + (Math.round(this.height) / 2) * this.width] = TileType.Air
        this.tiles[(Math.round(this.width) / 2) + (Math.round(this.height) / 2) * this.width + this.width] = TileType.Air
        const tileEntity = new T1Drill(this, Math.round(this.width) / 2, Math.round(this.height) / 2, uuidv4())
        console.log(tileEntity)
    }
}

export class WorldTiles extends Array<(TileType)> {

}



/*

trees
snow
dirt/ice
stone/ore
*/