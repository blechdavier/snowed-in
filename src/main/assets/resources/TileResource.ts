import P5 from 'p5';
import { game } from '../../Main';
import ImageResource from './ImageResource';

class TileResource extends ImageResource {
    // The width and height of the tile set
    width: number;
    height: number;

    // The width and height of each tile in pixels
    tileWidth: number;
    tileHeight: number;

    constructor(
        path: string,
        width: number,
        height: number,
        tileWidth: number,
        tileHeight: number
    ) {
        super(path);
        this.width = width;
        this.height = height;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
    }

    renderTile(
        i: number,
        target: any,
        x: number,
        y: number,
        width: number,
        height: number
    ) {
        const tileSetX = i % this.width;
        const tileSetY = Math.floor(i / this.width);

        // Make sure the tile isn't out of bounds
        if (tileSetY > this.height)
            throw new Error(
                `Out of bounds tile. Tried to load tile ${i} with a maximum of ${
                    this.width * this.height
                } tiles`
            );

        super.renderPartial(
            target,
            x,
            y,
            width,
            height,
            tileSetX * this.tileWidth,
            tileSetY * this.tileHeight,
            this.tileWidth,
            this.tileHeight
        );
    }

    getTileAtCoordinate(
        x: number,
        y: number,
        target: any,
        xPos: number,
        yPos: number,
        width: number,
        height: number
    ) {
        if (x > this.width || y > this.height)
            throw new Error(
                `Out of bounds tile. Tried to load tile at ${x}, ${y} on a ${this.width}, ${this.height} grid`
            );

        super.renderPartial(
            target,
            xPos,
            yPos,
            width,
            height,
            x * this.tileWidth,
            y * this.tileHeight,
            this.tileWidth,
            this.tileHeight
        );
    }
}

export = TileResource;
