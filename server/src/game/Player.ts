import { Permissions } from './GameServer';

export class Player {

    name: string
    socketId: string

    permissions: Permissions

    // Position
    x: number
    y: number
    xVel = 0
    yVel = 0

    constructor(name: string, socketId: string, x: number, y: number, permissions: Permissions) {
        this.name = name
        this.x = x;
        this.y = y;
        this.socketId = socketId
        this.permissions = permissions
    }

    getPlayer() {
        return {name: this.name, x: this.x, y: this.y, xv: this.xVel, yv: this.yVel}
    }
}