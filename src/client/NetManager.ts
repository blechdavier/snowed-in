import { Game } from './Game';
import { World } from './world/World';
import { EntityClasses } from './world/entities/EntityClasses';
import { PlayerLocal } from './player/PlayerLocal';
import { Inventory } from './player/Inventory';
import { ClientTileEntity, TileEntityAnimations } from './world/entities/TileEntity';
import { WorldAssets } from './assets/Assets';
import { hslToRgb, PlayerEntity } from './world/entities/PlayerEntity';
import { PlayerAnimations } from './assets/Assets';
import { AnimationFrame } from './assets/Assets';
import { ReflectableImageResource } from './assets/resources/ReflectedImageResource';
import { TileType } from '../global/Tile';

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
				(
					width,
					height,
					tiles,
					tileEntities,
					entities,
					player,
					inventory,
				) => {
					//console.log(entities);
					let id = player.id
					console.log("player idddadsasdf: " +id)
					id = player.id.split("-").join("");//string.prototype.replaceAll requires ES2021
					console.log("player idddadsasdf: " +id)
					let idNumber = (Number("0x"+id)/100000000000000000000000000000)%1;//get a number 0-1 pseudorandomly selected from the uuid of the player
					console.log("player idddadsasdf: " +idNumber)
					Object.entries(PlayerAnimations).forEach(element => {
						for(let frame of element[1]) {
							frame[0].redefineScarfColor(hslToRgb(idNumber, 1, 0.45), hslToRgb(idNumber, 1, 0.3));
						}
					});
					let tileEntities2: {
						[id: string]: ClientTileEntity
						// [id: string]: {
						// 	id: string;
						// 	coveredTiles: number[];
						// 	reflectedTiles: number[];//this honestly shouldn't be sent over socket but im tired
						// 	type_: number;
						// 	data: {};
						// 	animFrame: number;
						// 	animate: boolean;
						// };
					} = {};
					tileEntities.forEach(tileEntity => {
						console.log('adding tile entity: ' + tileEntity.id);
						tileEntities2[tileEntity.id] = {
							...tileEntity,
							id: tileEntity.id,
							coveredTiles: tileEntity.coveredTiles,
							reflectedTiles: tileEntity.reflectedTiles,
							animFrame: randint(
								0,
								WorldAssets.tileEntities[
									tileEntity.payload.type_
								].length - 1,
							),
							animate:
								TileEntityAnimations[tileEntity.payload.type_],
						};
					});
					this.game.world = new World(
						width,
						height,
						tiles,
						tileEntities2,
					);
					this.game.world.inventory = new Inventory(inventory);
					this.game.world.player = new PlayerLocal(player);
					this.game.world.player.color1 = hslToRgb(idNumber, 1, 0.45);
					this.game.world.player.color1 = hslToRgb(idNumber, 1, 0.3);
					entities.forEach(entity => {
						this.game.world.entities[entity.id] = new EntityClasses[
							entity.type
						](entity);
					});
				},
			);
		}

		// World events
		{
			// Tile updates such as breaking and placing
			this.game.connection.on(
				'worldUpdate',
				(updatedTiles: { tileIndex: number; tile: number }[]) => {

					console.log("got til update packet wit")
					// If the world is not set
					if (this.game.world === undefined) return;

					updatedTiles.forEach(tile => {
						const index = this.game.brokenTilesQueue.indexOf(tile.tileIndex);
						if (index > -1) {
							this.game.brokenTilesQueue.splice(index, 1); // 2nd parameter means remove one item only
						}
						this.game.world.updateTile(tile.tileIndex, tile.tile);
					});
				},
			);

			this.game.connection.on(
				'tileEntityDelete',
				(id: string) => {
					console.log("got til entity delete packet with id: "+id)
					// If the world is not set
					if (this.game.world === undefined) return;

					//set its tiles to air
					for(let coveredTile of this.game.world.tileEntities[id].coveredTiles) {
						this.game.world.worldTiles[coveredTile] = TileType.Air;
					}

					//update the reflected tiles to not draw with reflection
					for(let reflectedTile of this.game.world.tileEntities[id].reflectedTiles) {
						console.log("drew image at tile "+reflectedTile)
						this.game.world.drawTile(reflectedTile, true);
					}

					//remove the tile entity
					delete this.game.world.tileEntities[id];
					//console.log(this.game.world.tileEntities[id])
				},
			);

			this.game.connection.on('inventoryUpdate', updates => {
				// If the world is not set
				if (this.game.world === undefined) return;

				updates.forEach(update => {
					console.log(update);
					this.game.world.inventory.items[update.slot] = update.item;
				});
			});
		}

		// Player events
		{
			this.game.connection.on('entityUpdate', entityData => {
				// If the world is not set
				if (this.game.world === undefined) return;

				const entity = this.game.world.entities[entityData.id];
				if (entity === undefined) return;

				entity.updateData(entityData);
			});

			this.game.connection.on('onPlayerAnimation', (animation, playerId) => {
				if (((((((this.game.world == undefined))))))) return;
				let e = this.game.world.entities[playerId];
				if(e instanceof PlayerEntity && Object.keys(PlayerAnimations).includes(e.currentAnimation)) {
					//@ts-expect-error
					e.currentAnimation = animation;
				}
			});

			this.game.connection.on('entityCreate', entityData => {
				// If the world is not set
				if (this.game.world === undefined) return;

				this.game.world.entities[entityData.id] = new EntityClasses[
					entityData.type
				](entityData);
			});

			this.game.connection.on('entityDelete', id => {
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
				},
			);
		}
	}
}

function randint(x1: number, x2: number) {
	return Math.floor(x1 + Math.random() * (x2 + 1 - x1));
}
