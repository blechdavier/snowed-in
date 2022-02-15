import Express from 'express'
import http from 'http';
import StaticDispatcher from './StaticDispatcher';
import { Server, Socket } from 'socket.io';
import { GameServer } from './game/GameServer';
import crypto from 'crypto';
import { ServerEvents } from '../../api/SocketEvents';
import { sign, verify } from 'jsonwebtoken';
import { md } from 'node-forge'

const app = Express();

const httpServer = http.createServer(app)

export const io = new Server(httpServer, {});

enum Location {
    None,
    Game,
}

const servers: {[name: string]: GameServer} = {}

export type ClientSocket = {
    userId: string
} & ServerEvents

const secretKey = "TfFj0HdGrklwqjo651PCHhKfifNpwMMZBo19hYxwx8R6PJ5tIFScOKrvzygasE3EpqyzrbsO8jlLaG1G5WpF4ZdX5V7aB9CG1dqeH987hrUTdGI5VbeTHLoG32ngNW6m"

io.on("connection", (socket : Socket & ClientSocket) => {
    try {
        // Get the user token from the client
        const token = verify(socket.handshake.auth.token, secretKey);

        // Sha256 hash to token for security
        const sha256md = md.sha256.create()
        sha256md.update((token as {userToken: string}).userToken)

        // Set the sockets userId to the hashed token
        socket.userId = sha256md.digest().toHex()

        socket.emit("init", { playerTickRate: 66 })
    } catch (e) {

        // Generate new user token
        const userToken = crypto.randomBytes(16).toString("hex")

        // Sign a jwt with the user token
        const token = sign({userToken: userToken}, secretKey)

        // Sha256 hash to token for security
        const sha256md = md.sha256.create()
        sha256md.update(userToken)

        // Set the sockets userId to the hashed token
        socket.userId = sha256md.digest().toHex()

        socket.emit("init", { playerTickRate: 66, token: token })
    }

    socket.on("create", async (name: string, clientName: string, maxPlayers: number, listed: boolean) => {
        // Generate server id
        const serverId = crypto.randomBytes(16).toString("hex");

        servers[serverId] = new GameServer(name, maxPlayers, listed, serverId, socket.userId)

        // Add the current socket to the room
        await servers[serverId].join(socket, clientName)
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