import { Entity } from './Entity';
import { Entities, EntityData } from '../../../global/Entity';
import { ItemStack } from '../../../global/Inventory';

export class Item extends Entity {
	item: ItemStack;

	yVel: number = this.y;

	constructor(entityId: string, item: ItemStack, x: number, y: number) {
		super(Entities.Item, entityId);
		this.item = item;
		this.x = x;
		this.y = y;
	}

	getData(): EntityData {
		return {
			type: Entities.Item,
			data: {
				item: this.item.item,
				x: this.x,
				y: this.y,
			},
		};
	}
}
