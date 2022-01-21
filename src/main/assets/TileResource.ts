import P5 from 'p5';
import { game } from '../Main';
import Resource from './Resource';

class TileResource {

    // The width and height of the tile set
    width: number
    height: number

    // The width and height of each tile in pixels
    tileWidth: number
    tileHeight: number

    // The tile set image
    image: P5.Image

    constructor(width: number, height: number, tileWidth: number, tileHeight: number, image: P5.Image) {
        this.width = width
        this.height = height
        this.tileWidth = tileWidth
        this.tileHeight = tileHeight
        this.image = image
    }

    getTile(i: number) {
        const x = i % this.width
        const y = game.floor( i / this.width)

        // Make sure the tile isn't out of bounds
        if(y > this.height) throw new Error(`Out of bounds tile. Tried to load tile ${i} with a maximum of ${this.width * this.height} tiles`)

        return new Resource(this.image, (x * this.tileWidth), (y * this.tileWidth), this.tileWidth, this.tileHeight);
    }

    getTileAtCoordinate(x: number, y: number) {
        if(x > this.width || y > this.height) throw new Error(`Out of bounds tile. Tried to load tile at ${x}, ${y} on a ${this.width}, ${this.height} grid`)
        return new Resource(this.image, (x * this.tileWidth), (y * this.tileWidth), this.tileWidth, this.tileHeight);
    }
}

export = TileResource