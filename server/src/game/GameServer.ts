import { ClientSocket, io } from '../Main';
import { RemoteSocket, Socket } from 'socket.io';
import { Player } from './Player';
import { World } from './World';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { BroadcastOperator } from 'socket.io/dist/broadcast-operator';
import { SnapshotInterpolation } from '@geckos.io/snapshot-interpolation';
import { State } from '@geckos.io/snapshot-interpolation/lib/types';
import { EntityType } from '../../../api/SocketEvents';
import chalk from 'chalk';

export class GameServer {
    entityId: number = 0;

    id: string;
    name: string;
    maxPlayers: number;
    listed: boolean;

    // Players
    hostId: string;
    players: { [playerId: string]: Player } = {};

    // World
    world: World;

    // Update related
    snapshotInterpolation: SnapshotInterpolation;

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
        this.room = io.to(id);
        this.hostId = hostId;

        this.snapshotInterpolation = new SnapshotInterpolation();

        // Generate world
        this.world = new World(512, 64);

        console.log(this.id);

        // Server ticks per second
        let tps = 30;
        setInterval(async () => {
            let start = process.hrtime.bigint();

            let start3 = process.hrtime.bigint();
            // Get the state of all the entities
            const entitiesState: State = [];
            Object.entries(this.players).forEach(([, player]) => {
                if (player.socketId !== undefined)
                    entitiesState.push(player.getState());
            });

            // Create a snapshot with that state
            if (entitiesState.length > 0) {
                const snapshot =
                    this.snapshotInterpolation.snapshot.create(entitiesState);
                this.room.emit('entity-snapshot', snapshot);
            }
            console.log(
                `Tick took ${
                    Number(process.hrtime.bigint() - start) / 1000000
                }ms total.`
            );
        }, 1000 / tps);
    }

    async join(socket: Socket & ClientSocket, name: string) {
        const sockets = await this.room.allSockets();

        // If the server is full
        if (sockets.size >= this.maxPlayers) return;

        if (this.players[socket.userId] !== undefined) {
            console.log(`Player ${name} reconnected`);
            if (this.players[socket.userId].socketId !== undefined) return;

            this.players[socket.userId].socketId = socket.id;
            this.players[socket.userId].name = name;
        } else {
            console.log(`Player ${name} joined for the first time!`);
            this.players[socket.userId] = new Player(
                name,
                socket.userId,
                this.entityId++,
                this.world.spawnPosition.x,
                this.world.spawnPosition.y
            );

            this.players[socket.userId].socketId = socket.id;
            this.players[socket.userId].name = name;
        }

        // Join the room
        socket.join(this.id);

        // Send the world to the client
        socket.emit(
            'load-world',
            this.world.width,
            this.world.height,
            this.world.tiles,
            this.world.backgroundTiles,
            this.players[socket.userId]._id.toString()
        );

        this.room.emit("entities-update", [this.players[socket.userId].get()]);

        // Initialize the client with all the entities
        const initUpdates: { id: string; type: EntityType; data: object }[] =
            [];
        Object.entries(this.players).forEach(([, player]) => {
            if (player.socketId !== undefined)
                initUpdates.push(player.get());
        });
        socket.emit('entities-update', initUpdates);

        // Update player
        {
            socket.on('player-update', (x: number, y: number) => {
                this.players[socket.userId].x = x;
                this.players[socket.userId].y = y;
            });
        }

        // World interact
        {
            socket.on('world-break-start', (tileIndex) => {
                this.players[socket.userId].breakingTile = {
                    tileIndex,
                    start: Date.now(),
                };
            });

            socket.on('world-break-cancel', () => {
                this.players[socket.userId].breakingTile = undefined;
            });

            socket.on('world-break-finish', () => {
                const brokenTile = this.players[socket.userId].breakingTile;

                this.world.tiles[brokenTile.tileIndex] = 0;
                this.room.emit("world-update", {
                    tileIndex: brokenTile.tileIndex,
                    tile: this.world.tiles[brokenTile.tileIndex],
                });
            });
        }

        // Handle disconnect
        socket.on('disconnect', (reason: string) => {
            console.log(
                `Player ${name} disconnect from ${this.name} reason: ${reason}`
            );

            this.room.emit("entities-update", [{
                id: this.players[socket.userId]._id.toString(),
                type: undefined,
                data: undefined,
            }]);

            this.players[socket.userId].socketId = undefined;
        });
    }
}
