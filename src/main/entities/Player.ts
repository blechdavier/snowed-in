import EntityBase from './EntityBase';
import { game } from '../Main';

class Player extends EntityBase {
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

    keyboardInput() {
        this.xVel +=
            0.02 *
            (+(!!game.keys[68] || !!game.keys[39]) -
                +(!!game.keys[65] || !!game.keys[37]));
        if (
            this.grounded &&
            (game.keys[87] || game.keys[38] || game.keys[32])
        ) {
            this.yVel = -1.5;
        }
    }
}

export = Player;
