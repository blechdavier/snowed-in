import game from "../Main"
import P5 from 'p5';
import Inventory from './inventory/Inventory';
import { Tile, Tiles } from './Tiles';
import ImageResource from '../assets/resources/ImageResource';
import TileResource from '../assets/resources/TileResource';
import { WorldAssets } from '../assets/Assets';
import Tickable from '../interfaces/Tickable';
import Game from '../Game';

class World implements Tickable {
    width: number; // width of the world in tiles
    height: number; // height of the world in tiles

    tileLayer: P5.Graphics; // Tile layer graphic
    backTileLayer: P5.Graphics; // Background tile layer graphic

    backTileLayerOffsetWidth: number; // what is this exactly xavier...
    backTileLayerOffsetHeight: number; // what is this exactly xavier...

    worldTiles: Uint8Array; // number for each tile in the world ex: [1, 1, 0, 1, 2, 0, 0, 1...  ] means snow, snow, air, snow, ice, air, air, snow...
    backgroundTiles: Uint8Array; // number for each background tile in the world ex: [1, 1, 0, 1, 2, 0, 0, 1...  ] means snow, snow, air, snow, ice, air, air, snow...

    inventory: Inventory;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;

        // initialize the world tile set storage array
        this.worldTiles = new Uint8Array(this.width * this.height);
        this.backgroundTiles = new Uint8Array(this.width * this.height);

        // define the p5.Graphics objects that hold an image of the tiles of the world.  These act sort of like a virtual canvas and can be drawn on just like a normal canvas by using tileLayer.rect();, tileLayer.ellipse();, tileLayer.fill();, etc.
        console.log()
        this.tileLayer = game.createGraphics(
            this.width * game.TILE_WIDTH,
            this.height * game.TILE_HEIGHT
        );
        this.backTileLayer = game.createGraphics(
            this.width * game.TILE_WIDTH,
            this.height * game.TILE_HEIGHT
        );

        // calculate these variables:
        this.backTileLayerOffsetWidth =
            (game.TILE_WIDTH - game.BACK_TILE_WIDTH) / 2; // calculated in the setup function, this variable is the number of pixels left of a tile to draw a background tile from at the same position
        this.backTileLayerOffsetHeight =
            (game.TILE_HEIGHT - game.BACK_TILE_HEIGHT) / 2; // calculated in the setup function, this variable is the number of pixels above a tile to draw a background tile from at the same position

        this.inventory = new Inventory();
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
                    } else {
                        this.worldTiles[i * this.width + j] = 1;
                    }
                } else {
                    this.worldTiles[i * this.width + j] = 0;
                }
            }
        }
        for (let i = 0; i < this.height; i++) {
            // i will be the y position of background tile being generated
            for (let j = 0; j < this.width; j++) {
                // j is x position " "    "      "
                // if this tile and its eight surrounding tiles are below the height of the terrain (at one point could be a tile of snow, ice, etc.), then add a background tile there.
                if (
                    this.belowTerrainHeight(j - 1, i - 1) &&
                    this.belowTerrainHeight(j - 1, i) &&
                    this.belowTerrainHeight(j - 1, i + 1) &&
                    this.belowTerrainHeight(j, i - 1) &&
                    this.belowTerrainHeight(j, i) &&
                    this.belowTerrainHeight(j, i + 1) &&
                    this.belowTerrainHeight(j + 1, i - 1) &&
                    this.belowTerrainHeight(j + 1, i) &&
                    this.belowTerrainHeight(j + 1, i + 1)
                ) {
                    this.backgroundTiles[i * this.width + j] = 1;
                } else {
                    this.backgroundTiles[i * this.width + j] = 0;
                }
            }
        }
        for (let i = 0; i < this.height; i++) {
            // i will be the y position of tile being drawn
            for (let j = 0; j < this.width; j++) {
                // j is x position " "    "      "
                if (this.worldTiles[i * this.width + j] !== 0) {
                    // Draw the correct image for the tile onto the tile layer

                    const tile: Tile =
                        Tiles[this.worldTiles[i * game.WORLD_WIDTH + j]];

                    if (
                        tile.connected &&
                        tile.texture instanceof TileResource
                    ) {
                        // test if the neighboring tiles are solid
                        const topTileBool =
                            i === 0 ||
                            this.worldTiles[(i - 1) * this.width + j] !== 0;
                        const leftTileBool =
                            j === 0 ||
                            this.worldTiles[i * this.width + j - 1] !== 0;
                        const bottomTileBool =
                            i === this.height - 1 ||
                            this.worldTiles[(i + 1) * this.width + j] !== 0;
                        const rightTileBool =
                            j === this.width - 1 ||
                            this.worldTiles[i * this.width + j + 1] !== 0;

                        // convert 4 digit binary number to base 10
                        const tileSetIndex =
                            8 * +topTileBool +
                            4 * +rightTileBool +
                            2 * +bottomTileBool +
                            +leftTileBool;

                        // Render connected tile
                        tile.texture.renderTile(
                            tileSetIndex,
                            game.world.tileLayer,
                            j * game.TILE_WIDTH,
                            i * game.TILE_HEIGHT,
                            game.TILE_WIDTH,
                            game.TILE_HEIGHT
                        );
                    } else if (
                        !tile.connected &&
                        tile.texture instanceof ImageResource
                    ) {
                        // Render non-connected tile
                        tile.texture.render(
                            game.world.tileLayer,
                            j * game.TILE_WIDTH,
                            i * game.TILE_HEIGHT,
                            game.TILE_WIDTH,
                            game.TILE_HEIGHT
                        );
                    }
                }
                if (this.backgroundTiles[i * this.width + j] !== 0) {
                    // draw the correct image for the background tile onto the background tile layer
                    WorldAssets.background.snow.render(
                        this.backTileLayer,
                        j * game.TILE_WIDTH + this.backTileLayerOffsetWidth,
                        i * game.TILE_HEIGHT + this.backTileLayerOffsetHeight,
                        game.BACK_TILE_WIDTH,
                        game.BACK_TILE_HEIGHT
                    );
                }
            }
        }
    }

    belowTerrainHeight(x: number, y: number) {
        return game.noise(x / 50) * 16 + 20 < y;
    }

    belowIceHeight(x: number, y: number) {
        return game.noise(x / 50) * 6 + 31 < y + game.noise(x / 2, y / 2) * 0;
    }


    tick(game: Game): void {
    }
}
export = World;
