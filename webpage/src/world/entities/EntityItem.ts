import EntityBase from './EntityBase';
import game from '../../Main';
import ItemStack from '../inventory/items/ItemStack';

class EntityItem extends EntityBase {
    itemStack: ItemStack;

    constructor(
        itemStack: ItemStack,
        x: number,
        y: number,
        w: number,
        h: number,
        xVel: number,
        yVel: number
    ) {
        super(x, y, w, h, xVel, yVel);
        this.itemStack = itemStack;
    }

    combineWithNearItems() {
        if (this.deleted) return;
        let closestDistance: number = Infinity;
        let closestItem: EntityItem;

        game.items.forEach((item: EntityItem) => {
            if (item === this || item.deleted) return;
            const distance =
                (this.x + this.w / 2 - item.x - item.w / 2) *
                    (this.x + this.w / 2 - item.x - item.w / 2) +
                (this.y + this.h / 2 - item.y - item.h / 2) *
                    (this.y + this.h / 2 - item.y - item.h / 2);

            if (
                distance < 4 &&
                closestDistance > distance &&
                item.itemStack.item === this.itemStack.item &&
                item.itemStack.stackSize < item.itemStack.item.maxStackSize &&
                this.itemStack.stackSize < this.itemStack.item.maxStackSize &&
                this.itemStack.stackSize <= item.itemStack.stackSize
            ) {
                closestItem = item;
                closestDistance = distance;
            }
        });

        if (closestDistance !== Infinity && closestItem !== undefined) {
            if (closestDistance < 0.1) {
                // If combining with the nearest stack would exceed the stack size
                if (
                    this.itemStack.stackSize +
                        closestItem.itemStack.stackSize >=
                    this.itemStack.item.maxStackSize
                ) {
                    this.itemStack.stackSize =
                        this.itemStack.stackSize -
                        (closestItem.itemStack.item.maxStackSize -
                            closestItem.itemStack.stackSize);
                    closestItem.itemStack.stackSize = closestItem.itemStack.item.maxStackSize;
                    return;
                }

                // Otherwise, add the amount of the other stack to the current stack and delete the other stack
                closestItem.itemStack.stackSize += this.itemStack.stackSize;
                this.deleted = true;
                return;
            }

            this.xVel -=
                (this.x + this.w / 2 - closestItem.x - closestItem.w / 2) / 65;
            this.yVel -=
                (this.y + this.h / 2 - closestItem.y - closestItem.h / 2) / 65;
        }
    }

    goTowardsPlayer() {
        if (
            (this.x + this.w / 2 - game.player.x - game.player.w / 2) *
                (this.x + this.w / 2 - game.player.x - game.player.w / 2) +
                (this.y + this.h / 2 - game.player.y - game.player.h / 2) *
                    (this.y + this.h / 2 - game.player.y - game.player.h / 2) <
            20
        ) {
            if (
                (this.x + this.w / 2 - game.player.x - game.player.w / 2) *
                    (this.x + this.w / 2 - game.player.x - game.player.w / 2) +
                    (this.y + this.h / 2 - game.player.y - game.player.h / 2) *
                        (this.y +
                            this.h / 2 -
                            game.player.y -
                            game.player.h / 2) <
                3
            ) {
                this.deleted = game.pickUpItem(this.itemStack);
            } else {
                this.xVel -=
                    (this.x + this.w / 2 - game.player.x - game.player.w / 2) /
                    30;
                this.yVel -=
                    (this.y + this.h / 2 - game.player.y - game.player.h / 2) /
                    30;
            }
        }
    }
}

export = EntityItem;
