
export class Player {
    id: string
    name: string;

    connected = false;
    socketId: string

    // Position
    x: number;
    y: number;

    breakingTile: { start: number, tileIndex: number}

    constructor(
        name: string,
        id: string,
        x: number,
        y: number,
    ) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.id = id;
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
            id: this.name,
            x: +this.x.toFixed(2).toString(),
            y: +this.y.toFixed(2).toString(),
        };
    }
}