import { CategoryData, InventoryPayload, ItemCategories, Items, ItemStack, ItemType } from '../../global/Inventory';
import { TileType } from '../../global/Tile';
import { game } from '../Game';
import { ColorParticle } from '../world/particles/ColorParticle';
import { WorldTiles } from '../world/WorldTiles';

export class Inventory {

	items: (ItemStack | undefined | null)[];

	width: number;
	height: number;

	selectedSlot: number = 0
	pickedUpSlot: number | undefined = undefined

	constructor(inventory: InventoryPayload) {
		this.items = inventory.items
		this.width = inventory.width
		this.height = inventory.height
	}

	worldClick(x: number, y: number) {
		const selectedItem = this.items[this.selectedSlot]
		if(selectedItem === undefined || selectedItem === null) {
			//console.error("Breaking tile")
			let tileBeingBroken = game.world.worldTiles[game.world.width * y + x];
			if(typeof tileBeingBroken === 'number') {
				let worldTileBeingBroken = WorldTiles[tileBeingBroken]
				for(let i = 0; i<5*game.particleMultiplier; i++) {
					if (worldTileBeingBroken !== undefined)
					game.particles.push(new ColorParticle(worldTileBeingBroken.color, Math.random()*0.2+0.1, 10, x+Math.random(), y+Math.random(), 0.2*(Math.random()-0.5), -0.15*Math.random()))
				}
			}
			game.connection.emit(
				'worldBreakStart',
				game.world.width * y + x
			);
			if(typeof tileBeingBroken === "number" && WorldTiles[tileBeingBroken]?.breakSound!==undefined) {
				//console.log((x-game.interpolatedCamX)+"+"+(game.width/game.TILE_WIDTH/game.upscaleSize)+"="+(x-game.interpolatedCamX-game.width/game.TILE_WIDTH/game.upscaleSize));
				WorldTiles[tileBeingBroken]?.breakSound?.playRandom((x-game.interpolatedCamX-game.width/game.TILE_WIDTH/game.upscaleSize/2)/20);
			}
			game.connection.emit('worldBreakFinish');
			return
		}

		const worldClick = ItemActions[Items[selectedItem.item].type].worldClick
		if(worldClick === undefined) {
			console.error("Cannot place selected item")
			return
		}

		worldClick(x, y)
	}
	worldClickCheck(x: number, y: number) {
		let tileBeingBroken = game.world.worldTiles[game.world.width * y + x];
		if(typeof tileBeingBroken === 'number') {
			if (tileBeingBroken === TileType.Air) game.breaking = false;
			else game.breaking = true;
		}
	}
}

interface ItemBase {
	worldClick?: (x: number, y: number) => void
}

const ItemActions: Record<ItemCategories, ItemBase> = {
	[ItemCategories.Tile]: {
		worldClick(x: number, y: number) {
			// If the tile isn't air
			if (
				game.world.worldTiles[
				game.world.width * y + x
					] !== TileType.Air
			) {

				let tileBeingBroken = game.world.worldTiles[game.world.width * y + x];
				if(typeof tileBeingBroken === 'number') {//tile is tile
					if (!game.breaking || game.brokenTilesQueue.includes(game.world.width * y + x)) return;
					game.brokenTilesQueue.push(game.world.width*y+x)
					let worldTileBeingBroken = WorldTiles[tileBeingBroken]
					for(let i = 0; i<5*game.particleMultiplier; i++) {
						if (worldTileBeingBroken !== undefined)
						game.particles.push(new ColorParticle(worldTileBeingBroken.color, Math.random()*0.2+0.1, 10, x+Math.random(), y+Math.random(), 0.2*(Math.random()-0.5), -0.15*Math.random()))
					}
					console.info('breaking');
					game.connection.emit(
						'worldBreakStart',
						game.world.width * y + x
					);
					game.connection.emit(
						'worldBreakFinish'
					);
					WorldTiles[tileBeingBroken]?.breakSound?.playRandom(xToStereo(x));
					return;
				}
				else {//tile is tile entity
					console.log("tile entity interact")
					game.connection.emit(
						'worldBreakStart',
						game.world.width * y + x
					);
					game.connection.emit(
						'worldBreakFinish'
					);
					return;
				}
			}
			//if the tile is air and the game is trying to place
			if (game.breaking || game.brokenTilesQueue.includes(game.world.width * y + x)) return;
			game.brokenTilesQueue.push(game.world.width*y+x)
			console.info('Placing');
			let itemTypeBeingHeld = game.world.inventory.items[game.world.inventory.selectedSlot]?.item;
			if(itemTypeBeingHeld===undefined)return;
						let itemData = Items[itemTypeBeingHeld];
						if (
				itemData.type === ItemCategories.Tile
			) {
				if(WorldTiles[itemData.placedTile]?.placeSound!==undefined) WorldTiles[itemData.placedTile]?.placeSound?.playRandom(xToStereo(x));
				else WorldTiles[itemData.placedTile]?.breakSound?.playRandom(xToStereo(x))
			}
			game.connection.emit(
				'worldPlace',
				game.world.inventory.selectedSlot,
				x,
				y
			);
			
		}
	},
	[ItemCategories.Resource]: {},
	[ItemCategories.Tool]: {},
	[ItemCategories.TileEntity]: {
		worldClick(x: number, y: number) {
			let itemRef = Items[game.world.inventory.items[game.world.inventory.selectedSlot]?.item || 0];
			let offset: [number, number] = [0, 0]
			if("tileEntityOffset" in itemRef) {
				offset = itemRef.tileEntityOffset;
			}
			
			game.connection.emit(
				'worldPlace',
				game.world.inventory.selectedSlot,
				x,
				y
			);
		}
	},
}

export function xToStereo(x: number) {
	return (x-game.interpolatedCamX-game.width/game.TILE_WIDTH/game.upscaleSize/2)/20
}