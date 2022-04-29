import { SnapshotInterpolation } from '@geckos.io/snapshot-interpolation';
import { State } from '@geckos.io/snapshot-interpolation/lib/types';
import { BroadcastOperator } from 'socket.io/dist/broadcast-operator';
import { Socket } from 'socket.io';
import {
    ClientEvents,
    ServerEvents,
} from '../../../api/API';
import { UserData, io } from '../Main';
import { Player } from './entity/Player';
import { World } from './World';
import { TileEntityPayload } from '../../../api/TileEntity';
import { EntityPayload } from '../../../api/Entity';
import { TileType } from '../../../api/Tile';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

export class GameServer {
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

    room: BroadcastOperator<ServerEvents, UserData>;

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
    }

    async start() {
        // Generate world
        this.world = new World(512, 256);
        await this.world.generate();

        // Server ticks per second
        let tps = 30;
        setInterval(async () => {
            // Get the state of all the entities
            const entitiesState: State = [];
            Object.entries(this.players).forEach(([, player]) => {
                if (player.socketId !== undefined)
                    entitiesState.push(player.getSnapshot());
            });

            // Create a snapshot with that state
            if (entitiesState.length > 0) {
                const snapshot =
                    this.snapshotInterpolation.snapshot.create(entitiesState);
                this.room.emit('entitySnapshot', snapshot);
            }
        }, 1000 / tps);
    }

    async join(
        socket: Socket<ClientEvents, ServerEvents, {}, UserData>,
        name: string
    ) {
        const sockets = await this.room.allSockets();

        // If the server is full
        if (sockets.size >= this.maxPlayers) return;

        if (this.players[socket.data.userId] === undefined) {
            console.log(`Player ${name} joined for the first time!`);
            this.players[socket.data.userId] = new Player(
                name,
                socket.data.userId,
                uuidv4(),
                this.world.spawnPosition.x,
                this.world.spawnPosition.y
            );
        }

        const user = this.players[socket.data.userId];

        // User is already connected
        if (user.socketId !== undefined) return;

        user.socketId = socket.id;
        user.name = name;

        // Join the room
        socket.join(this.id);

        // Initialize the client with all the entities
        const entities: EntityPayload[] = [];
        Object.entries(this.players).forEach(([id, player]) => {
            if (player.socketId !== undefined && id !== user.userId) entities.push(player.getPayload());
        });

        // Initialize the client with all the entities
        const tileEntities: TileEntityPayload[] = [];
        Object.entries(this.world.tileEntities).forEach(([, tileEntity]) => {
            tileEntities.push(tileEntity.get());
        });

        // Send the world to the client
        socket.emit(
            'worldLoad',
            this.world.width,
            this.world.height,
            this.world.tiles,
            tileEntities,
            entities,
            user.getLocal()
        );

        socket.broadcast.emit('entityCreate', user.getPayload());

        // Update player
        {
            socket.on('playerUpdate', (x: number, y: number) => {
                user.x = x;
                user.y = y;
            });
        }

        // World interact
        {
            socket.on('worldBreakStart', (tileIndex) => {
                user.breakingTile = {
                    tileIndex,
                    start: Date.now(),
                };
            });

            socket.on('worldBreakCancel', () => {
                user.breakingTile = undefined;
            });

            socket.on('worldBreakFinish', () => {
                const brokenTile = user.breakingTile;

                // If the user did not have a breaking target
                if (brokenTile === undefined) return;

                this.world.tiles[brokenTile.tileIndex] = TileType.Air;
                this.room.emit('worldUpdate', [
                    {
                        tileIndex: brokenTile.tileIndex,
                        tile: this.world.tiles[brokenTile.tileIndex],
                    },
                ]);
            });
        }

        // Handle disconnect
        socket.on('disconnect', (reason: string) => {
            console.log(
                `Player ${name} disconnect from ${this.name} reason: ${reason}`
            );

            this.room.emit('entityDelete', user.id.toString());

            user.socketId = undefined;
        });
    }

    async save() {
        const data = this.world.tiles.toString();
        const id = "asdf1234randomstuffhere"
        fs.writeFile(`save ${id}.txt`, data, (err) => {
            if (err) throw err;
            console.log('The file has been saved!');
        });
    }
}
