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
		quantity: number = 1,// quantity of items to add (this is modified in the method as a sort of tally of how many of the item are left to add)
	): InventoryUpdatePayload {
		//check for matching item stack with room left
		const updatePayload: InventoryUpdatePayload = [];
		for (let i = 0; i < this.mainInventory.length; i++) {
			//console.log("testing slot "+i+" for matching item stack: ")
			const invItem = this.mainInventory[i];
			// console.log(invItem)
			// console.log("item: "+item+", quantity: "+quantity)
			//if the stack is undefined, a different item, or full, then move on to the next slot
			if (invItem === undefined || invItem.item !== item || invItem.quantity >= 100) continue;
			//console.log("match found")

			//if adding the entire stack would result in a full inventory slot, then set the slot to full and subtract the items that were added from the remaining quantity
			if (quantity+invItem.quantity>=100) {
				//console.log("slot "+i+" had combined item quantity of "+quantity+"+"+invItem.quantity+"="+(invItem.quantity+quantity))
				this.mainInventory[i] = { item: item, quantity: 100 };
				updatePayload.push({ item: this.mainInventory[i], slot: i });
				quantity -= 100 - invItem.quantity;
			}
			else {
				//otherwise, add the rest of the items to that slot
			//console.log("adding "+quantity+" items to slot "+i+" for matching item stack")
			this.mainInventory[i] = {
					item: item,
					quantity: invItem.quantity + quantity,
				};
				updatePayload.push({
					item: this.mainInventory[i],
					slot: i,
				});
				//quantity = 0
				return updatePayload
			}
		}

		//then look for empty stacks
		for (let i = 0; i < this.mainInventory.length; i++) {
			//console.log("testing slot "+i+" for empty item stack")
			const invItem = this.mainInventory[i];
			//if it's not empty, then move on
			if (invItem !== undefined) continue;
			//console.log("match found")

			//if the quantity of items left is more than 100, then set the hotbar slot to 100 and move on
			if (quantity > 100) {
			//console.log("set slot "+i+" quantity continue to 100")
			this.mainInventory[i] = {
					item: item,
					quantity: 100,
				};
				quantity -= 100;
				updatePayload.push({ item: this.mainInventory[i], slot: i });
				continue;
			}
			//console.log("set slot "+i+" quantity full end to "+quantity)

			//otherwise, set it to the quantity and return the function early.
			this.mainInventory[i] = {
				item: item,
				quantity: quantity,
			};
			//quantity = 0; unnecessary line, leaving commented for readability
			updatePayload.push({ item: this.mainInventory[i], slot: i });
			return updatePayload
		}

		if(quantity>0) {
			console.warn(`there are ${quantity} more items to pick up, these got deleted (Inventory.ts line 150 or so)`);
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
