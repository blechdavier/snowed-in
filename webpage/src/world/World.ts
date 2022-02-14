import game from "../Main"
import P5 from 'p5';
import Inventory from './inventory/Inventory';
import { Tile, Tiles } from './Tiles';
import ImageResource from '../assets/resources/ImageResource';
import TileResource from '../assets/resources/TileResource';
import { WorldAssets } from '../assets/Assets';
import Tickable from '../interfaces/Tickable';
import Game from '../Game';
import Renderable from '../interfaces/Renderable';
import p5 from 'p5';
import Player from './entities/Player';
import OtherPlayer from './entities/OtherPlayer';
import { ServerEntity } from './entities/ServerEntity';

class World implements Tickable, Renderable {
    width: number; // width of the world in tiles
    height: number; // height of the world in tiles

    tileLayer: P5.Graphics; // Tile layer graphic
    backTileLayer: P5.Graphics; // Background tile layer graphic

    backTileLayerOffsetWidth: number; // what is this exactly xavier...
    backTileLayerOffsetHeight: number; // what is this exactly xavier...

    worldTiles: number[]; // number for each tile in the world ex: [1, 1, 0, 1, 2, 0, 0, 1...  ] means snow, snow, air, snow, ice, air, air, snow...
    backgroundTiles: number[]; // number for each background tile in the world ex: [1, 1, 0, 1, 2, 0, 0, 1...  ] means snow, snow, air, snow, ice, air, air, snow...

    inventory: Inventory;

    player: Player
    players: {[name: string]:ServerEntity} = {}
    playersData: {[name: string]: {
        x: number;
        y: number;
    }} = {}

    constructor(width: number, height: number, tiles: number[], backgroundTiles: number[], player: Player) {
        // Initialize the world with the tiles and dimensions from the server
        this.width = width;
        this.height = height;
        this.worldTiles = tiles
        this.backgroundTiles = backgroundTiles
        this.player = player

        // define the p5.Graphics objects that hold an image of the tiles of the world.  These act sort of like a virtual canvas and can be drawn on just like a normal canvas by using tileLayer.rect();, tileLayer.ellipse();, tileLayer.fill();, etc.
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

        this.loadWorld();
    }

    tick(game: Game) {
        game.connection.emit("player-update", this.player.x, this.player.y)
    }

    render(target: p5, upscaleSize: number) {
        // draw the background tile layer onto the screen
        target.image(
            this.backTileLayer,
            0,
            0,
            game.width,
            game.height,
            game.interpolatedCamX * game.TILE_WIDTH,
            game.interpolatedCamY * game.TILE_WIDTH,
            game.width / upscaleSize,
            game.height / upscaleSize
        );

        // draw the tile layer onto the screen
        target.image(
            this.tileLayer,
            0,
            0,
            game.width,
            game.height,
            game.interpolatedCamX * game.TILE_WIDTH,
            game.interpolatedCamY * game.TILE_WIDTH,
            game.width / upscaleSize,
            game.height / upscaleSize
        );

        this.renderPlayers(target, upscaleSize)
    }

    renderPlayers(target: p5, upscaleSize: number) {
        for (const player of Object.entries(this.players)) {

            player[1].getInterpolatedCoordinates()

            target.fill(0, 255, 0);

            target.rect(
                (player[1].x * game.TILE_WIDTH -
                    game.interpolatedCamX * game.TILE_WIDTH) *
                upscaleSize,
                (player[1].y * game.TILE_HEIGHT -
                    game.interpolatedCamY * game.TILE_HEIGHT) *
                upscaleSize,
                this.player.w * upscaleSize * game.TILE_WIDTH,
                this.player.h * upscaleSize * game.TILE_HEIGHT
            );

            // Render the item quantity label
            target.fill(0);

            target.noStroke();

            target.textSize(5 * upscaleSize);
            target.textAlign(target.CENTER, target.TOP);

            target.text(
                player[0],
                (((player[1].x * game.TILE_WIDTH) -
                    game.interpolatedCamX * game.TILE_WIDTH) + (this.player.w * game.TILE_WIDTH) / 2) *
                upscaleSize,
                (((player[1].y * game.TILE_HEIGHT) -
                    game.interpolatedCamY * game.TILE_HEIGHT) - (this.player.h * game.TILE_WIDTH) / 2.5) *
                upscaleSize
            );
        }
    }

    updatePlayers(players: {[name: string]: {
            x: number;
            y: number;
        }}) {
        this.playersData = players
        Object.entries(this.players).forEach(([name,]) => {
            // Delete the removed players
            if(players[name] === undefined)
                delete this.players[name]
        })
        Object.entries(players).forEach(([name, data]) => {
            // Add a new physics object for each player
            if(this.players[name] === undefined) {
                this.players[name] = new ServerEntity()
                return
            }
            // Set the data
            this.players[name].updatePosition(data.x, data.y)
        })
    }

    loadWorld() {
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
                            this.tileLayer,
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
                            this.tileLayer,
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
        console.log("Loading complete")
    }
}
export = World;
