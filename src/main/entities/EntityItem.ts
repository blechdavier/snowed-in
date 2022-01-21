import EntityBase from './EntityBase';
import { game } from '../Main';

class EntityItem extends EntityBase {
    constructor(
        x: number,
        y: number,
        w: number,
        h: number,
        xVel: number,
        yVel: number
    ) {
        super(x, y, w, h, xVel, yVel);
    }

    goTowardsPlayer() {
        if (
            game.pickUpAbleItems[this.itemType] &&
            (this.x + this.w / 2 - game.player.x - game.player.w / 2) *
                (this.x + this.w / 2 - game.player.x - game.player.w / 2) +
                (this.y + this.h / 2 - game.player.y - game.player.h / 2) *
                    (this.y + this.h / 2 - game.player.y - game.player.h / 2) <
                50
        ) {
            if (
                (this.x + this.w / 2 - game.player.x - game.player.w / 2) *
                    (this.x + this.w / 2 - game.player.x - game.player.w / 2) +
                    (this.y + this.h / 2 - game.player.y - game.player.h / 2) *
                        (this.y +
                            this.h / 2 -
                            game.player.y -
                            game.player.h / 2) <
                1
            ) {
                this.deleted = true;
                game.pickUpItem(this.itemType);
            } else {
                this.xVel -=
                    (this.x + this.w / 2 - game.player.x - game.player.w / 2) /
                    20;
                this.yVel -=
                    (this.y + this.h / 2 - game.player.y - game.player.h / 2) /
                    20;
            }
        }
    }
}

export = EntityItem;
