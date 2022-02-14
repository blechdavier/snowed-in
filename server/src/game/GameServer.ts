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
    hostId: string
    players: {[playerId: string]: Player} = {}

    // World
    world: World

    worldUpdates: {tileIndex: number, tile: number}[] = []

    room: BroadcastOperator<DefaultEventsMap, any>;

    constructor(
        name: string,
        maxPlayers: number,
        listed: boolean,
        id: string,
        hostId: string
    ) {
        this.name = name;
        this.maxPlayers = maxPlayers;
        this.listed = listed;
        this.id = id;
        this.room = io.to(id)
        this.hostId = hostId

        // Generate world
        this.world = new World(512, 64);


        // Server ticks per second
        let tps = 66
        setInterval(async () => {
            const sockets = await this.room.fetchSockets()

            sockets.forEach((socket: RemoteSocket<DefaultEventsMap, any> & ClientSocket) => {
                const worldPlayers: {[name: string]: ReturnType<Player['getPlayer']>} = {}
                Object.entries(this.players).forEach(([, player]) => {
                    if(player.connected && player.socketId !== socket.id)
                        worldPlayers[player.name] = player.getPlayer()
                })
                socket.emit("tick-player", worldPlayers)
            })

            if(this.worldUpdates.length > 0) {
                console.log(this.worldUpdates)
                this.room.emit('world-update', this.worldUpdates);
                this.worldUpdates = []
            }
        }, 1000 / tps)

        console.log(`Created game server with name: ${name} by ${hostId}`)
        console.log(id)

    }

    async join(socket: Socket & ClientSocket, name: string) {
        const sockets = await this.room.allSockets();

        // If the server is full
        if (sockets.size >= this.maxPlayers) return

        if (this.players[socket.userId] !== undefined) {
            console.log(`Player already exists!`)
            if(this.players[socket.userId].connected) return

            this.players[socket.userId].connect(socket.id, name)
        } else {
            console.log(`Connecting as new player!`)
            this.players[socket.userId] = new Player(name, socket.userId, this.world.spawnPosition.x, this.world.spawnPosition.y, {
                isAdmin: true,
                canBreak: true,
                canPlace: true
            })
            this.players[socket.userId].connect(socket.id, name)
        }

        console.log(this.players)

        // Join the room
        socket.join(this.id);

        // Send the world to the client
        socket.emit("load-world", this.world.width, this.world.height, this.world.tiles, this.world.backgroundTiles, this.players[socket.userId].getPlayer())

        socket.on("player-update", (x: number, y: number) => {
            this.players[socket.userId].x = x
            this.players[socket.userId].y = y
        })

        socket.on('world-break-start', (tileIndex) => {
            this.players[socket.userId].breakingTile = {tileIndex, start: Date.now()}
        })

        socket.on('world-break-cancel', () => {
            this.players[socket.userId].breakingTile = undefined
        })

        socket.on('world-break-finish', () => {
            const brokenTile = this.players[socket.userId].breakingTile

            this.world.tiles[brokenTile.tileIndex] = 0
            this.worldUpdates.push({tileIndex: brokenTile.tileIndex, tile: this.world.tiles[brokenTile.tileIndex]})
        })

        // Handle disconnect
        socket.on('disconnect', (reason: string) => {
            console.log(`Player ${name} disconnect from ${this.name} reason: ${reason}`)
            this.players[socket.userId].disconnect()
        })
    }
}
