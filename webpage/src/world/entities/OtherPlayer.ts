import EntityBase from './EntityBase';
import game from '../../Main';

class OtherPlayer extends EntityBase {
    currentPosition: { x: number; y: number } = { x: 0, y: 0 };
    currentPositionTime: number = Date.now();

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

    getInterpolatedCoordinates() {
        /*
        const x =
            this.oldPosition.x +
            ((this.currentPosition.x - this.oldPosition.x) /
                (this.currentPositionTime - this.oldPositionTime)) *
                (Date.now() - this.oldPositionTime);

        const y =
            this.oldPosition.y +
            ((this.currentPosition.y - this.oldPosition.y) /
                (this.currentPositionTime - this.oldPositionTime)) *
                (Date.now() - this.oldPositionTime);

         */

        const y = Date.now()
        const y1 = this.x;
        const y2 = this.currentPosition.x
        const x1 = this.currentPositionTime
        const x2 = this.currentPositionTime + (1000 / game.playerTickRate)

        console.log({
            y,
            y1,
            y2,
            x1,
            x2
        })
        console.log((y - x1))
        console.log(((y2-y1)/(x2-x1)))

        const x = y1 + ((y2-y1)/(x2-x1)) * (y - x1)

        return { x, y: this.currentPosition.y };
    }

    updatePos(x: number, y: number) {
        this.currentPosition = { x, y };
        this.currentPositionTime = Date.now();
    }
}

export = OtherPlayer;
