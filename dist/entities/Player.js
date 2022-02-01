"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const EntityBase_1 = __importDefault(require("./EntityBase"));
const Main_1 = require("../Main");
class Player extends EntityBase_1.default {
    constructor(x, y, w, h, xVel, yVel) {
        super(x, y, w, h, xVel, yVel);
    }
    keyboardInput() {
        this.xVel +=
            0.02 *
                (+(!!Main_1.game.keys[68] || !!Main_1.game.keys[39]) -
                    +(!!Main_1.game.keys[65] || !!Main_1.game.keys[37]));
        if (this.grounded &&
            (Main_1.game.keys[87] || Main_1.game.keys[38] || Main_1.game.keys[32])) {
            this.yVel = -1.5;
        }
    }
}
module.exports = Player;
//# sourceMappingURL=Player.js.map