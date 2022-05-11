import P5 from 'p5';
import { Tickable } from '../interfaces/Tickable';
import { Renderable } from '../interfaces/Renderable';
import { game, Game } from '../Game';
import { PlayerLocal } from '../player/PlayerLocal';
import { ServerEntity } from './entities/ServerEntity';
import { SnapshotInterpolation } from '@geckos.io/snapshot-interpolation';
import { Entity, Snapshot } from '@geckos.io/snapshot-interpolation/lib/types';
import { WorldTiles } from './WorldTiles';
import { TileType } from '../../global/Tile';
import { Inventory } from '../player/Inventory';
import { TileEntityPayload } from '../../global/TileEntity';
import { ClientTileEntity } from './entities/TileEntity';

export class World implements Tickable, Renderable {
    width: number; // width of the world in tiles
    height: number; // height of the world in tiles

    tileLayer: P5.Graphics; // Tile layer graphic

    worldTiles: (TileType | string)[]; // number for each tiles in the world ex: [1, 1, 0, 1, 2, 0, 0, 1...  ] means snow, snow, air, snow, ice, air, air, snow...

    player: PlayerLocal;

    inventory: Inventory

    entities: { [id: string]: ServerEntity } = {};

    tileEntityPayloads: { [id: string]: TileEntityPayload }
    tileEntities: { [id: string]: ClientTileEntity }

    snapshotInterpolation: SnapshotInterpolation;

    constructor(width: number, height: number, tiles: (TileType | string)[]) {
        // Initialize the world with the tiles and dimensions from the server
        this.width = width;
        this.height = height;
        this.worldTiles = tiles;

        this.snapshotInterpolation = new SnapshotInterpolation();
        this.snapshotInterpolation.interpolationBuffer.set(
            (1000 / game.netManager.playerTickRate) * 2
        );

        // define the p5.Graphics objects that hold an image of the tiles of the world.  These act sort of like a virtual canvas and can be drawn on just like a normal canvas by using tileLayer.rect();, tileLayer.ellipse();, tileLayer.fill();, etc.
        this.tileLayer = game.createGraphics(
            this.width * game.TILE_WIDTH,
            this.height * game.TILE_HEIGHT
        );

        this.loadWorld();
    }

    tick(game: Game) {
        if (this.player !== undefined)
            game.connection.emit('playerUpdate', this.player.x, this.player.y);
    }

    render(target: P5, upscaleSize: number) {
        // draw the tiles layer onto the screen
        target.image(
            this.tileLayer,
            0,
            0,
            (game.width / upscaleSize) * upscaleSize,
            (game.height / upscaleSize) * upscaleSize,
            (game.interpolatedCamX * game.TILE_WIDTH),
            (game.interpolatedCamY * game.TILE_WIDTH),
            (game.width / upscaleSize),
            (game.height / upscaleSize)
        );

        this.renderPlayers(target, upscaleSize);

        target.stroke(0);
        target.strokeWeight(4);
        target.noFill();
        target.rect(target.width - this.width, 0, this.width, this.height);

        target.image(
            this.tileLayer,
            target.width - this.width,
            0,
            this.width,
            this.height
        );
    }

    updatePlayers(snapshot: Snapshot) {
        this.snapshotInterpolation.snapshot.add(snapshot);
    }

    updateTile(tileIndex: number, tile: TileType) {
        // Update the tile and the 4 neighbouring tiles
        this.worldTiles[tileIndex] = tile;

        // erase the broken tiles and its surrounding tiles if they're tiles
        this.tileLayer.erase();
        this.tileLayer.noStroke();
        this.tileLayer.rect(//center
            (tileIndex % this.width) * game.TILE_WIDTH,
            Math.floor(tileIndex / this.width) * game.TILE_HEIGHT,
            game.TILE_WIDTH,
            game.TILE_HEIGHT
        );

        if (tileIndex - 1 >= 0 && typeof (this.worldTiles[tileIndex - 1]) !== 'string' && this.worldTiles[tileIndex - 1] !== TileType.Air) {
            this.tileLayer.rect(//left
                ((tileIndex % this.width) - 1) * game.TILE_WIDTH,
                Math.floor(tileIndex / this.width) * game.TILE_HEIGHT,
                game.TILE_WIDTH,
                game.TILE_HEIGHT
            );
        }

        if (tileIndex + 1 < this.width * this.height && typeof (this.worldTiles[tileIndex + 1]) !== 'string' && this.worldTiles[tileIndex + 1] !== TileType.Air) {
            this.tileLayer.rect(//right
                ((tileIndex % this.width) - 1) * game.TILE_WIDTH,
                Math.floor(tileIndex / this.width) * game.TILE_HEIGHT,
                game.TILE_WIDTH,
                game.TILE_HEIGHT
            );
        }

        if (tileIndex - this.width >= 0 && typeof (this.worldTiles[tileIndex - this.width]) !== 'string' && this.worldTiles[tileIndex - this.width] !== TileType.Air) {
            this.tileLayer.rect(//top
                (tileIndex % this.width) * game.TILE_WIDTH,
                (Math.floor(tileIndex / this.width) - 1) * game.TILE_HEIGHT,
                game.TILE_WIDTH,
                game.TILE_HEIGHT
            );
        }
        if (tileIndex + this.width < this.width * this.height && typeof (this.worldTiles[tileIndex + this.width]) !== 'string' && this.worldTiles[tileIndex + this.width] !== TileType.Air) {
            this.tileLayer.rect(//bottom
                (tileIndex % this.width) * game.TILE_WIDTH,
                (Math.floor(tileIndex / this.width) + 1) * game.TILE_HEIGHT,
                game.TILE_WIDTH,
                game.TILE_HEIGHT
            );
        }
        this.tileLayer.noErase();

        // redraw the neighboring tiles
        this.drawTile(tileIndex);
        this.drawTile(tileIndex + this.width);
        this.drawTile(tileIndex - 1);
        this.drawTile(tileIndex - this.width);
        this.drawTile(tileIndex + 1);
    }

    renderPlayers(target: P5, upscaleSize: number) {
        // Calculate the interpolated position of all updated entities
        const positionStates: { [id: string]: { x: number; y: number } } = {};
        try {
            const calculatedSnapshot =
                this.snapshotInterpolation.calcInterpolation('x y');
            if (!calculatedSnapshot) return;

            const state = calculatedSnapshot.state;
            if (!state) return;

            // The new positions of entities as object
            state.forEach(({ id, x, y }: Entity & { x: number; y: number }) => {
                positionStates[id] = { x, y };
            });
        } catch (e) { }

        // Render each entity in random order
        Object.entries(this.entities).forEach(
            (entity: [string, ServerEntity]) => {
                const updatedPosition = positionStates[entity[0]];
                if (updatedPosition !== undefined) {
                    entity[1].x = updatedPosition.x;
                    entity[1].y = updatedPosition.y;
                }

                entity[1].render(target, upscaleSize);
            }
        );

        // Render the player on top
        if (this.player !== undefined) {
            this.player.findInterpolatedCoordinates();
            this.player.render(target, upscaleSize);
        }
    }

    loadWorld() {
        this.tileLayer.noStroke();
        this.tileLayer.fill(255, 0, 0);
        for (let x = 0; x < this.height; x++) {//x and y are switched for some stupid reason
            // i will be the y position of tiles being drawn
            for (let y = 0; y < this.width; y++) {
                const tileVal = this.worldTiles[x * this.width + y];

                if (typeof tileVal === 'string') {
                    // console.log(tileVal);
                    this.tileLayer.rect(y * game.TILE_WIDTH, x * game.TILE_HEIGHT, game.TILE_WIDTH, game.TILE_HEIGHT);
                    continue;
                }

                if (tileVal !== TileType.Air) {
                    // Draw the correct image for the tiles onto the tiles layer
                    const tile = WorldTiles[tileVal];

                    if (tile === undefined)
                        continue

                    if (
                        tile.connected &&
                        "renderTile" in tile.texture
                    ) {
                        // Render connected tiles
                        tile.texture.renderTile(
                            this.findTilesetIndex(x, y, tileVal, WorldTiles[tileVal]?.anyConnection),
                            this.tileLayer,
                            y * game.TILE_WIDTH,
                            x * game.TILE_HEIGHT,
                            game.TILE_WIDTH,
                            game.TILE_HEIGHT
                        );
                    } else {
                        // Render non-connected tiles
                        tile.texture.render(
                            this.tileLayer,
                            y * game.TILE_WIDTH,
                            x * game.TILE_HEIGHT,
                            game.TILE_WIDTH,
                            game.TILE_HEIGHT
                        );
                    }
                }
            }
        }
    }

    drawTile(tileIndex: number) {
        const x = tileIndex % this.width;
        const y = Math.floor(tileIndex / this.width);

        if (this.worldTiles[tileIndex] !== TileType.Air) {
            // Draw the correct image for the tiles onto the tiles layer

            const tileVal = this.worldTiles[tileIndex];

            if (typeof tileVal === 'string') {

                if (this.tileEntities[tileVal] === undefined) {
                    console.error("tile entity " + tileVal + " is undefined");
                }

                const topLeft = Math.min(...this.tileEntities[tileVal].coveredTiles);
                if (tileIndex === topLeft) {
                    //render tile entity image
                    //this.tileEntities[tileVal].render(tileLayer, x*8, y*8);
                } else {
                    console.log(`Already rendered ${tileVal}`)
                }
                return;
            }

            const tile = WorldTiles[tileVal];

            // if the tiles is off-screen
            if (tile === undefined) {
                return;
            }

            if (tile.connected && "renderTile" in tile.texture) {
                let topTileBool = false;
                let leftTileBool = false;
                let bottomTileBool = false;
                let rightTileBool = false;
                if (tile.anyConnection) {
                    // test if the neighboring tiles are solid
                    topTileBool =
                        x === TileType.Air ||
                        this.worldTiles[(y - 1) * this.width + x] !==
                        TileType.Air;
                    leftTileBool =
                        y === TileType.Air ||
                        this.worldTiles[y * this.width + x - 1] !==
                        TileType.Air;
                    bottomTileBool =
                        x === this.height - 1 ||
                        this.worldTiles[(y + 1) * this.width + x] !==
                        TileType.Air;
                    rightTileBool =
                        y === this.width - 1 ||
                        this.worldTiles[y * this.width + x + 1] !==
                        TileType.Air;

                    // console.log(["boring", leftTileBool, bottomTileBool, this.worldTiles[x * this.width + y + 1], topTileBool])
                }
                else {
                    // test if the neighboring tiles are the same tile
                    topTileBool =
                        x === 0 ||
                        this.worldTiles[(y - 1) * this.width + x] ===
                        tileVal;
                    leftTileBool =
                        y === 0 ||
                        this.worldTiles[y * this.width + x - 1] ===
                        tileVal;
                    bottomTileBool =
                        x === this.height - 1 ||
                        this.worldTiles[(y + 1) * this.width + x] ===
                        tileVal;
                    rightTileBool =
                        y === this.width - 1 ||
                        this.worldTiles[y * this.width + x + 1] ===
                        tileVal;
                    //console.log(["fancy", leftTileBool, bottomTileBool, rightTileBool, topTileBool])

                }
                this.worldTiles[tileIndex + 1] !== TileType.Air;

                // convert 4 digit binary number to base 10
                const tileSetIndex =
                    8 * +topTileBool +
                    4 * +rightTileBool +
                    2 * +bottomTileBool +
                    +leftTileBool;

                // Render connected tiles
                tile.texture.renderTile(
                    tileSetIndex,
                    this.tileLayer,
                    x * game.TILE_WIDTH,
                    y * game.TILE_HEIGHT,
                    game.TILE_WIDTH,
                    game.TILE_HEIGHT
                );
            } else if (
                !tile.connected
            ) {
                // Render non-connected tiles
                tile.texture.render(
                    this.tileLayer,
                    x * game.TILE_WIDTH,
                    y * game.TILE_HEIGHT,
                    game.TILE_WIDTH,
                    game.TILE_HEIGHT
                );
            }
        }
    }

    findTilesetIndex(x: number, y: number, tileVal: TileType, anyConnection?: boolean) {
        let topTileBool = false;
        let leftTileBool = false;
        let bottomTileBool = false;
        let rightTileBool = false;
        if (anyConnection) {
            // test if the neighboring tiles are solid
            topTileBool =
                x === TileType.Air ||
                this.worldTiles[(x - 1) * this.width + y] !==
                TileType.Air;
            leftTileBool =
                y === TileType.Air ||
                this.worldTiles[x * this.width + y - 1] !==
                TileType.Air;
            bottomTileBool =
                x === this.height - 1 ||
                this.worldTiles[(x + 1) * this.width + y] !==
                TileType.Air;
            rightTileBool =
                y === this.width - 1 ||
                this.worldTiles[x * this.width + y + 1] !==
                TileType.Air;
        }
        else {
            // test if the neighboring tiles are the same tile
            topTileBool =
                x === 0 ||
                this.worldTiles[(x - 1) * this.width + y] ===
                tileVal;
            leftTileBool =
                y === 0 ||
                this.worldTiles[x * this.width + y - 1] ===
                tileVal;
            bottomTileBool =
                x === this.height - 1 ||
                this.worldTiles[(x + 1) * this.width + y] ===
                tileVal;
            rightTileBool =
                y === this.width - 1 ||
                this.worldTiles[x * this.width + y + 1] ===
                tileVal;
        }

        // convert 4 digit binary number to base 10
        return (
            8 * +topTileBool +
            4 * +rightTileBool +
            2 * +bottomTileBool +
            +leftTileBool)
    }
}