"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const EntityBase_1 = __importDefault(require("./EntityBase"));
const Main_1 = require("../Main");
class EntityItem extends EntityBase_1.default {
    constructor(x, y, w, h, xVel, yVel) {
        super(x, y, w, h, xVel, yVel);
    }
    goTowardsPlayer() {
        if (Main_1.game.pickUpAbleItems[this.itemType] &&
            (this.x + this.w / 2 - Main_1.game.player.x - Main_1.game.player.w / 2) *
                (this.x + this.w / 2 - Main_1.game.player.x - Main_1.game.player.w / 2) +
                (this.y + this.h / 2 - Main_1.game.player.y - Main_1.game.player.h / 2) *
                    (this.y + this.h / 2 - Main_1.game.player.y - Main_1.game.player.h / 2) <
                50) {
            if ((this.x + this.w / 2 - Main_1.game.player.x - Main_1.game.player.w / 2) *
                (this.x + this.w / 2 - Main_1.game.player.x - Main_1.game.player.w / 2) +
                (this.y + this.h / 2 - Main_1.game.player.y - Main_1.game.player.h / 2) *
                    (this.y +
                        this.h / 2 -
                        Main_1.game.player.y -
                        Main_1.game.player.h / 2) <
                1) {
                this.deleted = true;
                Main_1.game.pickUpItem(this.itemType);
            }
            else {
                this.xVel -=
                    (this.x + this.w / 2 - Main_1.game.player.x - Main_1.game.player.w / 2) /
                        20;
                this.yVel -=
                    (this.y + this.h / 2 - Main_1.game.player.y - Main_1.game.player.h / 2) /
                        20;
            }
        }
    }
}
module.exports = EntityItem;
//# sourceMappingURL=EntityItem.js.map