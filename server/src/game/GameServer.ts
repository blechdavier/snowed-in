import { ClientSocket, io } from '../Main';
import { RemoteSocket, Socket } from 'socket.io';
import { Player } from './Player';
import { World } from './World';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

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
        let tps = 66
        setInterval(async () => {
            let start = process.hrtime.bigint()
            const sockets = await io.to(this.id).fetchSockets()

            sockets.forEach((socket: RemoteSocket<DefaultEventsMap, any> & ClientSocket) => {
                const worldPlayers: {[name: string]: ReturnType<Player['getPlayer']>} = {}
                Object.entries(this.players).forEach(([, player]) => {
                    if(player.socketId !== socket.id)
                        worldPlayers[player.name] = player.getPlayer()
                })
                socket.emit("tick-player", worldPlayers)
            })

            console.log(`time: ${Number(process.hrtime.bigint() - start) / 1000000}ms`)
        }, 1000 / tps)

        console.log(`Created game server with name: ${name} by ${clientName}`)
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
        socket.emit("load-world", this.world.width, this.world.height, this.world.tiles, this.world.backgroundTiles, this.world.spawnPosition)

        socket.on("player-update", (x: number, y: number) => {
            this.players[name].x = x
            this.players[name].y =y
        })
    }
}
