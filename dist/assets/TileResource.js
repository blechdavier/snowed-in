"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Main_1 = require("../Main");
const Resource_1 = __importDefault(require("./Resource"));
class TileResource {
    constructor(width, height, tileWidth, tileHeight, image) {
        this.width = width;
        this.height = height;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.image = image;
    }
    getTile(i) {
        const x = i % this.width;
        const y = Main_1.game.floor(i / this.width);
        // Make sure the tile isn't out of bounds
        if (y > this.height)
            throw new Error(`Out of bounds tile. Tried to load tile ${i} with a maximum of ${this.width * this.height} tiles`);
        return new Resource_1.default(this.image, (x * this.tileWidth), (y * this.tileWidth), this.tileWidth, this.tileHeight);
    }
    getTileAtCoordinate(x, y) {
        if (x > this.width || y > this.height)
            throw new Error(`Out of bounds tile. Tried to load tile at ${x}, ${y} on a ${this.width}, ${this.height} grid`);
        return new Resource_1.default(this.image, (x * this.tileWidth), (y * this.tileWidth), this.tileWidth, this.tileHeight);
    }
}
module.exports = TileResource;
//# sourceMappingURL=TileResource.js.map