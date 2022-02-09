import { ClientSocket, io } from '../Main';
import { Socket } from 'socket.io';
import { Player } from './Player';
import { World } from './World';

export type Permissions = {
    isAdmin: boolean
    canBreak: boolean
    canPlace: boolean
}

export class GameServer {
    id: string;
    name: string;
    maxPlayers: number;
    listed: boolean;

    // Players
    hostName: string
    players: {[playerName: string]: Player} = {}

    // World
    world: World

    constructor(
        name: string,
        maxPlayers: number,
        listed: boolean,
        id: string,
        clientName: string
    ) {
        this.name = name;
        this.maxPlayers = maxPlayers;
        this.listed = listed;
        this.id = id;

        this.world = new World(512, 64);

        this.hostName = clientName

        // Server ticks per second
        let tps = 100
        setInterval(async () => {
            const sockets = await io.to(this.id).fetchSockets()

            sockets.forEach((socket) => {
                const worldPlayers = Object.entries(this.players).map(([name, player]) => {
                    return player.socketId !== socket.id ? player.getPlayer() : undefined
                })
                socket.emit("playerTick", worldPlayers)
            })
        }, 1000 / tps)
    }

    async join(socket: Socket & ClientSocket, name: string) {
        const sockets = await io.to(this.id).allSockets();

        // If the server is full
        if (sockets.size >= this.maxPlayers) return

        if (this.players[name] !== undefined) return

        // Join the room
        socket.join(this.id);

        this.players[name] = new Player(name, socket.id, this.world.spawnPosition.x, this.world.spawnPosition.y, {
            isAdmin: true,
            canBreak: true,
            canPlace: true
        })

        // Send the world to the client
        socket.emit("loadWorld", {width: this.world.width, height: this.world.height, tiles: this.world.tiles, backgroundTiles: this.world.backgroundTiles})
        socket.emit("players")
    }
}
