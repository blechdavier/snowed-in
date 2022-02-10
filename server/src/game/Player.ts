import { Permissions } from './GameServer';

export class Player {
    name: string;
    socketId: string;

    permissions: Permissions;

    // Position
    x: number;
    y: number;
    xVel = 0;
    yVel = 0;

    constructor(
        name: string,
        socketId: string,
        x: number,
        y: number,
        permissions: Permissions
    ) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.socketId = socketId;
        this.permissions = permissions;
    }

    getPlayer() {
        return {
            x: +this.x.toFixed(2),
            y: +this.y.toFixed(2),
            xv: +this.xVel.toFixed(4),
            yv: +this.yVel.toFixed(4),
        };
    }
}