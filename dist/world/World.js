"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Main_1 = require("../Main");
const Inventory_1 = __importDefault(require("../inventory/Inventory"));
class World {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        // initialize the world tile set storage array
        this.worldTiles = new Uint8Array(this.width * this.height);
        this.backgroundTiles = new Uint8Array(this.width * this.height);
        // define the p5.Graphics objects that hold an image of the tiles of the world.  These act sort of like a virtual canvas and can be drawn on just like a normal canvas by using tileLayer.rect();, tileLayer.ellipse();, tileLayer.fill();, etc.
        this.tileLayer = Main_1.game.createGraphics(this.width * Main_1.game.TILE_WIDTH, this.height * Main_1.game.TILE_HEIGHT);
        this.backTileLayer = Main_1.game.createGraphics(this.width * Main_1.game.TILE_WIDTH, this.height * Main_1.game.TILE_HEIGHT);
        // calculate these variables:
        this.backTileLayerOffsetWidth =
            (Main_1.game.TILE_WIDTH - Main_1.game.BACK_TILE_WIDTH) / 2; // calculated in the setup function, this variable is the number of pixels left of a tile to draw a background tile from at the same position
        this.backTileLayerOffsetHeight =
            (Main_1.game.TILE_HEIGHT - Main_1.game.BACK_TILE_HEIGHT) / 2; // calculated in the setup function, this variable is the number of pixels above a tile to draw a background tile from at the same position
        this.inventory = new Inventory_1.default();
    }
    generateWorld() {
        // this generation algorithm is by no means optimized
        for (let i = 0; i < this.height; i++) {
            // i will be the y position of tile being generated
            for (let j = 0; j < this.width; j++) {
                // j is x position " "    "      "
                if (this.belowTerrainHeight(j, i)) {
                    if (this.belowIceHeight(j, i)) {
                        this.worldTiles[i * this.width + j] = 2;
                    }
                    else {
                        this.worldTiles[i * this.width + j] = 1;
                    }
                }
                else {
                    this.worldTiles[i * this.width + j] = 0;
                }
            }
        }
        for (let i = 0; i < this.height; i++) {
            // i will be the y position of background tile being generated
            for (let j = 0; j < this.width; j++) {
                // j is x position " "    "      "
                // if this tile and its eight surrounding tiles are below the height of the terrain (at one point could be a tile of snow, ice, etc.), then add a background tile there.
                if (this.belowTerrainHeight(j - 1, i - 1) &&
                    this.belowTerrainHeight(j - 1, i) &&
                    this.belowTerrainHeight(j - 1, i + 1) &&
                    this.belowTerrainHeight(j, i - 1) &&
                    this.belowTerrainHeight(j, i) &&
                    this.belowTerrainHeight(j, i + 1) &&
                    this.belowTerrainHeight(j + 1, i - 1) &&
                    this.belowTerrainHeight(j + 1, i) &&
                    this.belowTerrainHeight(j + 1, i + 1)) {
                    this.backgroundTiles[i * this.width + j] = 1;
                }
                else {
                    this.backgroundTiles[i * this.width + j] = 0;
                }
            }
        }
        for (let i = 0; i < this.height; i++) {
            // i will be the y position of tile being drawn
            for (let j = 0; j < this.width; j++) {
                // j is x position " "    "      "
                if (this.worldTiles[i * this.width + j] !== 0) {
                    // test if the neighboring tiles are solid
                    const topTileBool = i === 0 ||
                        this.worldTiles[(i - 1) * this.width + j] !== 0;
                    const leftTileBool = j === 0 ||
                        this.worldTiles[i * this.width + j - 1] !== 0;
                    const bottomTileBool = i === this.height - 1 ||
                        this.worldTiles[(i + 1) * this.width + j] !== 0;
                    const rightTileBool = j === this.width - 1 ||
                        this.worldTiles[i * this.width + j + 1] !== 0;
                    // convert 4 digit binary number to base 10
                    const tileSetIndex = 8 * +topTileBool +
                        4 * +rightTileBool +
                        2 * +bottomTileBool +
                        +leftTileBool;
                    // Draw the correct image for the tile onto the tile layer
                    Main_1.game.assets.tileSetImage
                        .getTile(tileSetIndex)
                        .render(Main_1.game.world.tileLayer, j * Main_1.game.TILE_WIDTH, i * Main_1.game.TILE_HEIGHT, Main_1.game.TILE_WIDTH, Main_1.game.TILE_HEIGHT);
                }
                if (this.backgroundTiles[i * this.width + j] !== 0) {
                    // draw the correct image for the background tile onto the background tile layer
                    this.backTileLayer.image(Main_1.game.assets.backgroundTileSetImage, j * Main_1.game.TILE_WIDTH + this.backTileLayerOffsetWidth, i * Main_1.game.TILE_HEIGHT + this.backTileLayerOffsetHeight, Main_1.game.BACK_TILE_WIDTH, Main_1.game.BACK_TILE_HEIGHT, Main_1.game.TILE_SET_POSITIONS[this.backgroundTiles[i * this.width + j]] * Main_1.game.BACK_TILE_WIDTH, 0, Main_1.game.BACK_TILE_WIDTH, Main_1.game.BACK_TILE_HEIGHT);
                }
            }
        }
    }
    belowTerrainHeight(x, y) {
        return Main_1.game.noise(x / 50) * 16 + 20 < y;
    }
    belowIceHeight(x, y) {
        return Main_1.game.noise(x / 50) * 6 + 31 < y;
    }
}
module.exports = World;
//# sourceMappingURL=World.js.map