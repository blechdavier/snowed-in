import Express from 'express'
import http from 'http';
import StaticDispatcher from './StaticDispatcher';
import { Server, Socket } from 'socket.io';
import { GameServer } from './game/GameServer';
import crypto from 'crypto';
import { ServerEvents } from '../../api/SocketEvents';

const app = Express();

const httpServer = http.createServer(app)

export const io = new Server(httpServer, {});

enum Location {
    None,
    Game,
}

const servers: {[name: string]: GameServer} = {}

export type ClientSocket = {
} & ServerEvents

io.on("connection", (socket : Socket & ClientSocket) => {

    socket.emit("init", { playerTickRate: 66 })

    socket.on("create", async (name: string, clientName: string, maxPlayers: number, listed: boolean) => {
        // Generate server id
        const serverId = crypto.randomBytes(16).toString("hex");

        servers[serverId] = new GameServer(name, maxPlayers, listed, serverId, clientName)

        // Add the current socket to the room
        await servers[serverId].join(socket, name)
    })

    socket.on("join", async (serverId: string, name: string) => {
        // Invalid name or serverId
        if(!/^[A-z0-9\-_]{3,20}$/.test(name) || !/^[a-f0-9]{32}$/.test(serverId)) return;

        // Make sure that the serverId is valid
        if(servers[serverId] === undefined) return


        await servers[serverId].join(socket, name)
    })

});


async function main() {
    console.log("Listening on port 8080")
    StaticDispatcher(app)
    httpServer.listen(8080)
}

main().catch(err => {
    console.log(err)
})