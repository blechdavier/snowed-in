import { Permissions } from './GameServer';

export class Player {
    id: string
    name: string;

    connected = false;
    socketId: string

    permissions: Permissions;

    // Position
    x: number;
    y: number;

    breakingTile: { start: number, tileIndex: number}

    constructor(
        name: string,
        id: string,
        x: number,
        y: number,
        permissions: Permissions
    ) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.id = id;
        this.permissions = permissions;
    }

    connect(socketId: string, name: string) {
        this.name = name
        this.socketId = socketId
        this.connected = true
    }

    disconnect() {
        this.socketId = undefined
        this.connected = false
    }

    getPlayer() {
        return {
            x: +this.x.toFixed(2),
            y: +this.y.toFixed(2),
        };
    }
}