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
    ) {
        super(x, y, w, h, 0, 0);
    }

    getInterpolatedCoordinates() {
        this.x =
            this.x +
            ((this.currentPosition.x - this.x) /
                (this.currentPositionTime +
                    (1000 / game.playerTickRate) * 1.3 -
                    this.currentPositionTime)) *
                (Date.now() - this.currentPositionTime);
        this.y =
            this.y +
            ((this.currentPosition.y - this.y) /
                (this.currentPositionTime +
                    (1000 / game.playerTickRate) * 1.3 -
                    this.currentPositionTime)) *
                (Date.now() - this.currentPositionTime);
    }

    updatePos(x: number, y: number) {
        this.currentPosition = { x, y };
        this.currentPositionTime = Date.now();
    }
}

export = OtherPlayer;
