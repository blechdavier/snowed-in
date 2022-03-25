import { World } from '../World';
import { TileEntities, TileEntityData, TileEntityPayload } from '../../../../api/TileEntity';
import { TileType } from '../../../../api/Tile';

export abstract class TileEntity {
    id: string;

    x: number;
    y: number;

    width: number;
    height: number;
    type: TileEntities;

    world: World;

    coveredTiles: number[] = []

    protected constructor(
        world: World,
        width: number,
        height: number,
        x: number,
        y: number,
        id: string
    ) {
        this.width = width;
        this.height = height;

        this.x = x;
        this.y = y;

        this.world = world;

        this.id = id

        const updatedTiles = []
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const worldX = x + this.x;
                const worldY = y + this.y;
                const worldIndex = worldY * this.world.width + worldX;

                if (this.world.tiles[worldIndex] !== TileType.Air) {
                    throw new Error(
                        'Could not place tileEntity because there are tiles in the way'
                    );
                }
                updatedTiles.push(worldIndex)
            }
        }
        this.coveredTiles = updatedTiles

        updatedTiles.forEach(index => {
            this.world.tiles[index] = TileType.TileEntity;
        })
        this.world.tileEntities[this.id] = this
    }

    remove() {
        this.coveredTiles.forEach(index => {
            this.world.tiles[index] = TileType.Air
        })
        delete this.world.tileEntities[this.id]
    }

    abstract getData(): TileEntityData

    get(): TileEntityPayload {
        return {
            id: this.id,
            coveredTiles: this.coveredTiles,
            ...this.getData()
        };
    }
}

export class T1Drill extends TileEntity {

    constructor(world: World, x: number, y: number, id: string) {
        super(world, 1, 2, x, y, id);
    }

    getData(): TileEntityData {
        return {type: TileEntities.Tier1Drill, data: { level: 0, active: true}};
    }

}