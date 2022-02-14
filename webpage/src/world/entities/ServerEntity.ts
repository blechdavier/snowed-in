import game from '../../Main'

export class ServerEntity {
    _positions: {x: number, y: number}[] = []
    _timerStart: number = 0
    _timer: number = 0

    x: number = 0
    y: number = 0

    getInterpolatedCoordinates() {
        console.log(this._positions.length)
        // If there are not enough items in the array to interpolate
        if(this._positions.length < 2)
            return

        this.y = this._positions[this._positions.length - 1].y +
        ((this._positions[this._positions.length - 2].y - this._positions[this._positions.length - 1].y) /
            (this._timer -
                this._timerStart)) *
        (Date.now() - this._timerStart);

        this.x = this._positions[this._positions.length - 1].x +
            ((this._positions[this._positions.length - 2].x - this._positions[this._positions.length - 1].x) /
                (this._timer -
                    this._timerStart)) *
            (Date.now() - this._timerStart);

        console.log(Math.floor((this._timer - this._timerStart) / (Date.now() - this._timerStart)))

        if(Date.now() > this._timer) {

            if(this._positions.length < 3)
                return

            this._positions.pop()
            do {
                this._positions.splice(this._positions.length - 2, 1)
            } while (this._positions.length > 4)
            this._timerStart = Date.now()
            this._timer = Date.now() + ((1000 / game.playerTickRate) - ((this._positions.length - 2) * 2))
        }
    }

    updatePosition(x: number, y: number) {
        this._positions.splice(0, 0, {x, y})
    }
}