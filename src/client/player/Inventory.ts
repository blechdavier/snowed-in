import { InventoryPayload, ItemCategories, Items, ItemStack } from '../../global/Inventory';
import { TileType } from '../../global/Tile';
import { game } from '../Game';

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
			game.connection.emit(
				'worldBreakStart',
				game.world.width * y + x
			);
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
}

interface ItemBase {
	worldClick?: (x: number, y: number) => void
}

const ItemActions: Record<ItemCategories, ItemBase> = {
	[ItemCategories.Tile]: {
		worldClick(x: number, y: number) {
			// If the tiles is air
			if (
				game.world.worldTiles[
				game.world.width * y + x
					] !== TileType.Air
			) {
				console.info('Placing');
				game.connection.emit(
					'worldBreakStart',
					game.world.width * y + x
				);
				game.connection.emit(
					'worldBreakFinish'
				);
				return;
			}
			console.info('Placing');
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
}