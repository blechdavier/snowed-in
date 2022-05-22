import {
	InventoryPayload,
	InventoryUpdatePayload,
	Items,
	ItemStack,
	ItemType,
} from '../../../global/Inventory';

export class Inventory {
	width: number;
	height: number;

	mainInventory: (ItemStack | undefined)[];

	constructor(width: number, height: number) {
		this.mainInventory = new Array(width * height);
		this.width = width;
		this.height = height;
	}

	removeItems(
		slot: number,
		quantity: number = 1,
	): false | InventoryUpdatePayload {
		const stack = this.mainInventory[slot];
		if (stack === undefined) return false;
		const startAmount = stack.quantity;
		if (startAmount - quantity < 1) {
			if (startAmount - quantity === 0) {
				// Reduce the stack
				this.mainInventory[slot] = undefined;
				return [{ item: undefined, slot: slot }];
			}

			// Remove the stack if there are less than 1 item left
			const updates: InventoryUpdatePayload = [
				{ item: undefined, slot: slot },
			];

			// Verify that the items contains enough of the item
			const foundStacks: number[] = [];
			let foundItems = stack.quantity;

			foundStacks.push(slot);

			// Search items for the item being removed
			for (let i = 0; i < this.height; i++) {
				for (let j = 0; j < this.width; j++) {
					const foundItem = this.mainInventory[i * this.width + j];

					if (
						foundItem !== undefined &&
						foundItem.item === stack.item &&
						i * this.width + j !== slot
					) {
						foundStacks.push(i * this.width + j);
						foundItems += foundItem.quantity;
						if (foundItems >= quantity) break;
					}
				}
				if (foundItems >= quantity) break;
			}

			//If enough of that item has been found, remove it
			if (foundItems >= quantity) {
				let amountLeft = quantity;
				for (const slot1 of foundStacks) {
					const foundStack = this.mainInventory[slot1];
					if (foundStack !== undefined) {
						if (foundStack.quantity - amountLeft < 1) {
							amountLeft -= foundStack.quantity;
							this.mainInventory[slot1] = undefined;
							updates.push({ item: undefined, slot: slot1 });
							continue;
						}

						foundStack.quantity -= amountLeft;
						updates.push({
							item: this.mainInventory[slot1],
							slot: slot1,
						});
					}
				}
				return updates;
			}
			return false;
		}

		// Reduce the stack
		stack.quantity -= quantity;
		return [{ item: this.mainInventory[slot], slot: slot }];
	}

	attemptPickUp(
		item: ItemType,
		quantity: number = 1,
	): InventoryUpdatePayload {
		//check for matching item stack with room left
		const updatePayload: InventoryUpdatePayload = [];
		for (let i = 0; i < this.mainInventory.length; i++){
			const invItem = this.mainInventory[i];
			if (invItem === undefined || invItem.item !== item) continue;

			if (invItem.quantity <= 100) {
				if (quantity <= 100 - invItem.quantity) {
					this.mainInventory[i] = {
						item: item,
						quantity: invItem.quantity + quantity,
					};
					updatePayload.push({
						item: this.mainInventory[i],
						slot: i,
					});
					return updatePayload
				}

				this.mainInventory[i] = { item: item, quantity: 100 };
				updatePayload.push({ item: this.mainInventory[i], slot: i });
				quantity -= 100 - invItem.quantity;
			}
		}

		for (let i = 0; i < this.mainInventory.length; i++){
			console.log("yes")
			const invItem = this.mainInventory[i];
			if (invItem !== undefined) continue;

			if (quantity > 100) {
				this.mainInventory[i] = {
					item: item,
					quantity: 100,
				};
				quantity -= 100;
				updatePayload.push({ item: this.mainInventory[i], slot: i });
				continue;
			}

			this.mainInventory[i] = {
				item: item,
				quantity: quantity,
			};
			quantity = 0;
			updatePayload.push({ item: this.mainInventory[i], slot: i });
			return updatePayload
		}

		return updatePayload;
	}

	swapSlots(
		source: number,
		destination: number,
	): false | InventoryUpdatePayload {
		if (source < 0 || source > this.mainInventory.length) {
			console.error('Invalid source slot');
			return false;
		}

		if (destination < 0 || destination > this.mainInventory.length) {
			console.error('Invalid source slot');
			return false;
		}

		if (source == destination) {
			console.error('Cannot swap a slot for itself');
			return false;
		}

		// Swap the slots
		[this.mainInventory[source], this.mainInventory[destination]] = [
			this.mainInventory[destination],
			this.mainInventory[source],
		];

		return [
			{ item: this.mainInventory[source], slot: source },
			{ item: this.mainInventory[destination], slot: destination },
		];
	}

	getPayload(): InventoryPayload {
		return {
			items: this.mainInventory,
			width: this.width,
			height: this.height,
		};
	}
}
