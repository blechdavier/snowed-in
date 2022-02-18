import game from "../Main"
import P5 from 'p5';
import { Tile, Tiles } from './Tiles';
import ImageResource from '../assets/resources/ImageResource';
import TileResource from '../assets/resources/TileResource';
import { WorldAssets } from '../assets/Assets';
import Tickable from '../interfaces/Tickable';
import Game from '../Game';
import Renderable from '../interfaces/Renderable';
import p5 from 'p5';
import PlayerLocal from './entities/PlayerLocal';
import { ServerEntity } from './entities/ServerEntity';
import { SnapshotInterpolation } from '@geckos.io/snapshot-interpolation';
import { Entity, Snapshot } from '@geckos.io/snapshot-interpolation/lib/types';
import { EntityType } from '../../../api/SocketEvents';
import { PlayerEntityData, PlayerEntity } from './entities/PlayerEntity';

class World implements Tickable, Renderable {
    width: number; // width of the world in tiles
    height: number; // height of the world in tiles

    tileLayer: P5.Graphics; // Tile layer graphic
    backTileLayer: P5.Graphics; // Background tile layer graphic

    backTileLayerOffsetWidth: number; // what is this exactly xavier...
    backTileLayerOffsetHeight: number; // what is this exactly xavier...

    worldTiles: number[]; // number for each tile in the world ex: [1, 1, 0, 1, 2, 0, 0, 1...  ] means snow, snow, air, snow, ice, air, air, snow...
    backgroundTiles: number[]; // number for each background tile in the world ex: [1, 1, 0, 1, 2, 0, 0, 1...  ] means snow, snow, air, snow, ice, air, air, snow...

    playerId: string
    player: PlayerLocal

    entities: {[name: string]: ServerEntity} = {}

    snapshotInterpolation: SnapshotInterpolation

    constructor(width: number, height: number, tiles: number[], backgroundTiles: number[], playerId: string) {
        // Initialize the world with the tiles and dimensions from the server
        this.width = width;
        this.height = height;
        this.worldTiles = tiles
        this.backgroundTiles = backgroundTiles

        this.playerId = playerId

        this.snapshotInterpolation = new SnapshotInterpolation()
        this.snapshotInterpolation.interpolationBuffer.set( (1000 / game.playerTickRate) * 3)

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

        this.loadWorld();
    }

    tick(game: Game) {
        if(this.player !== undefined)
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

    updatePlayers(snapshot: Snapshot) {
        this.snapshotInterpolation.snapshot.add(snapshot);
    }

    updateEntities(entities: (
        | { id: string; type: EntityType; data: object }
        )[]) {
        entities.forEach((entity: { id: string; type: EntityType; data: object }
        ) => {
            console.log(typeof this.playerId)
            console.log(typeof entity.id)
            console.log(entity.id === this.playerId)
            // If the type is undefined meaning that this entity should be deleted
            if(entity.type === undefined) {
                if(entity.id === this.playerId) {
                    this.player = undefined
                    return;
                }
                delete this.entities[entity.id];
                return
            }

            // If the entity that is being updated is the local player
            if(entity.id === this.playerId) {
                if(this.player !== undefined) {
                    this.player.updateData(entity.data as PlayerEntityData)
                    return;
                }
                this.player = new PlayerLocal(entity.id, entity.data as PlayerEntityData)
                return;
            }

            // If the entity already exists update it
            if(this.entities[entity.id] !== undefined) {
                this.entities[entity.id].updateData(entity.data);
                return;
            }

            // Set the entity to the player
            switch (entity.type) {
                case EntityType.Player:
                    this.entities[entity.id] = new PlayerEntity(entity.id, entity.data as PlayerEntityData)
            }
        })
    }

    renderPlayers(target: p5, upscaleSize: number) {

        // Calculate the interpolated position of all updated entities
        const positionStates: { [id: string]: { x: number, y: number } } = {}
        try {
            const calculatedSnapshot = this.snapshotInterpolation.calcInterpolation('x y')
            if (!calculatedSnapshot) return

            const state = calculatedSnapshot.state
            if (!state) return;

            // The new positions of entities as object
            state.forEach(({ id, x, y }: Entity & { x: number, y: number }) => {
                positionStates[id] = { x, y }
            })
        } catch (e) {}

        // Render each entity in random order :skull:
        Object.entries(this.entities).forEach((entity: [string, ServerEntity]) => {
            const updatedPosition = positionStates[entity[0]]
            if(updatedPosition !== undefined) {
                entity[1].x = updatedPosition.x
                entity[1].y = updatedPosition.y
            }

            entity[1].render(target, upscaleSize)
        })

        // Render the player on top :thumbsup:
        if(this.player !== undefined) {
            this.player.findInterpolatedCoordinates()
            this.player.render(target, upscaleSize)
        }
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
