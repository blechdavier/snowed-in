import { ClientSocket, io } from '../Main';
import { RemoteSocket, Socket } from 'socket.io';
import { Player } from './Player';
import { World } from './World';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { BroadcastOperator } from 'socket.io/dist/broadcast-operator';

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

    room: BroadcastOperator<DefaultEventsMap, any>;

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
        this.room = io.to(id)
        this.hostName = clientName

        // Generate world
        this.world = new World(512, 64);


        // Server ticks per second
        let tps = 66
        setInterval(async () => {
            const sockets = await this.room.fetchSockets()

            sockets.forEach((socket: RemoteSocket<DefaultEventsMap, any> & ClientSocket) => {
                const worldPlayers: {[name: string]: ReturnType<Player['getPlayer']>} = {}
                Object.entries(this.players).forEach(([, player]) => {
                    if(player.socketId !== socket.id)
                        worldPlayers[player.name] = player.getPlayer()
                })
                socket.emit("tick-player", worldPlayers)
            })
        }, 1000 / tps)

        console.log(`Created game server with name: ${name} by ${clientName}`)
    }

    async join(socket: Socket & ClientSocket, name: string) {
        const sockets = await this.room.allSockets();

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
            this.players[name].y = y
        })

        socket.on('disconnect', (reason: string) => {
            console.log(`Player ${name} disconnect from ${this.name} reason: ${reason}`)
            delete this.players[name]
        })
    }
}
