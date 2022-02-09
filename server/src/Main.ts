import Express from 'express'
import http from 'http';
import StaticDispatcher from './StaticDispatcher';
import { Server, Socket } from 'socket.io';
import { GameServer } from './websocket/GameServer';
import crypto from 'crypto';

const app = Express();

const httpServer = http.createServer(app)

export const io = new Server(httpServer, {});

enum Location {
    None,
    ServerBrowser,
    Game,
}

const servers: {[name: string]: GameServer} = {}

export type ClientSocket = {
    location: Location

    // Server names
    names: {[serverId: string]: string}
}

io.on("connection", (socket : Socket & ClientSocket) => {

    socket.on("serverBrowser", () => {
        // If the client is in game or already in the browser
        if(socket.location !== Location.None) return

        socket.location = Location.ServerBrowser
    })

    socket.on("create", (name: string, maxPlayers: number, listed: boolean) => {
        // Generate server id
        const serverId = crypto.randomBytes(16).toString("hex");

        servers[serverId] = new GameServer(name, maxPlayers, listed, serverId, socket.id)

        // Add the current socket to the room
        socket.join(serverId)
    })

    socket.on("join", (serverId: string, name: string) => {
        // Make sure that the serverId is valid
        if(servers[serverId] === undefined) return


        servers[serverId].join(socket, name)
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