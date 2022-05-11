import { Game } from './Game';
import { World } from './world/World';
import { EntityClasses } from './world/entities/EntityClasses';
import { PlayerLocal } from './player/PlayerLocal';
import { ItemType } from '../global/Inventory';
import { Inventory } from './player/Inventory';

export class NetManager {
    game: Game;

    playerTickRate: number;

    constructor(game: Game) {
        this.game = game;

        // Init event
        this.game.connection.on('init', (playerTickRate, token) => {
            console.log(`Tick rate set to: ${playerTickRate}`);
            this.playerTickRate = playerTickRate;
            if (token) {
                window.localStorage.setItem('token', token);
                (this.game.connection.auth as { token: string }).token = token;
            }
        });

        // Initialization events
        {
            // Load the world and set the player entity id
            this.game.connection.on(
                'worldLoad',
                (width, height, tiles, tileEntities, entities, player, inventory) => {
                    console.log(entities);
                    this.game.world = new World(width, height, tiles);
                    this.game.world.inventory = new Inventory(inventory)
                    this.game.world.player = new PlayerLocal(player);
                    entities.forEach((entity) => {
                        this.game.world.entities[entity.id] = new EntityClasses[
                            entity.type
                        ](entity);
                    });
                    tileEntities.forEach((tileEntity) => {
                        this.game.world.tileEntities[tileEntity.id] = tileEntity
                    });
                    console.log(tileEntities);
                }
            );
        }

        // World events
        {
            // Tile updates such as breaking and placing
            this.game.connection.on(
                'worldUpdate',
                (updatedTiles: { tileIndex: number; tile: number }[]) => {
                    // If the world is not set
                    if (this.game.world === undefined) return;

                    updatedTiles.forEach((tile) => {
                        this.game.world.updateTile(tile.tileIndex, tile.tile);
                    });
                }
            );

            this.game.connection.on('inventoryUpdate', (updates) => {
                // If the world is not set
                if (this.game.world === undefined) return;

                updates.forEach((update) => {
                    console.log(update)
                    this.game.world.inventory.items[update.slot] = update.item;
                });
            });
        }

        // Player events
        {
            this.game.connection.on('entityUpdate', (entityData) => {
                // If the world is not set
                if (this.game.world === undefined) return;

                const entity = this.game.world.entities[entityData.id];
                if (entity === undefined) return;

                entity.updateData(entityData);
            });

            this.game.connection.on('entityCreate', (entityData) => {
                // If the world is not set
                if (this.game.world === undefined) return;

                this.game.world.entities[entityData.id] = new EntityClasses[
                    entityData.type
                ](entityData);
            });

            this.game.connection.on('entityDelete', (id) => {
                // If the world is not set
                if (this.game.world === undefined) return;

                delete this.game.world.entities[id];
            });

            // Update the other players in the world
            this.game.connection.on(
                'entitySnapshot',
                (snapshot: {
                    id: string;
                    time: number;
                    state: { id: string; x: string; y: string }[];
                }) => {
                    // If the world is not set
                    if (this.game.world === undefined) return;

                    this.game.world.updatePlayers(snapshot);
                }
            );
        }
    }
}
