import crypto from 'crypto';
import { ClientSocket, io } from '../Main';
import { Socket } from 'socket.io';

export class GameServer {
    id: string;
    name: string;
    maxPlayers: number;
    listed: boolean;

    // Permissions
    hostId: string;

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
        this.hostId = hostId;
    }

    join(socket: Socket & ClientSocket, name: string) {
        io.to(this.id)
            .allSockets()
            .then((sockets) => {
                if (sockets.size >= this.maxPlayers) {
                    // Cache the name
                    socket.names[this.id] = name;

                    // Join the room
                    socket.join(this.id);
                }
            });
    }
}
