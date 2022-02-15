export class ServerEntity {

    x: number = 0
    y: number = 0

    updatePosition(x: number, y: number) {
        this.x = x
        this.y = y
    }
}