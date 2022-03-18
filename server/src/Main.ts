import Express from 'express'
import http from 'http';
import crypto from 'crypto';
import { Server, Socket } from 'socket.io';
import { md } from 'node-forge'
import { sign, verify } from 'jsonwebtoken';
import * as WorkerPool  from 'workerpool'
import * as path from 'path';

import StaticDispatcher from './StaticDispatcher';
import { Tasks } from './Worker';
import { GameServer } from './game/GameServer';
import { ClientEvents, ServerEvents } from '../../api/API';
import { Keys } from "../config.json"

console.log(generateId())
const app = Express();

const httpServer = http.createServer(app)

export const io = new Server(httpServer, {});

const servers: {[name: string]: GameServer} = {}

export const pool: WorkerPool.WorkerPool & Tasks = WorkerPool.pool(path.resolve(__dirname, 'Worker.ts'), {forkOpts: { execArgv: ['-r', 'ts-node/register'] }})

export type UserData = {
    userId: string
}

io.on("connection", (socket: Socket<ClientEvents ,ServerEvents, {}, UserData>) => {
    try {
        const token = verify(socket.handshake.auth.token, Keys.userTokenKey);

        // Sha256 hash to token for security
        const sha256md = md.sha256.create()
        sha256md.update((token as {userToken: string}).userToken + Math.random().toString())

        // Set the sockets userId to the hashed token
        socket.data.userId = sha256md.digest().toHex()

        socket.emit("init", 30)
    } catch (e) {

        // Generate new user token
        const userToken = crypto.randomBytes(16).toString("hex")

        // Sign a jwt with the user token
        const token = sign({userToken: userToken}, Keys.userTokenKey)

        // Sha256 hash to token for security
        const sha256md = md.sha256.create()
        sha256md.update(userToken)

        // Set the sockets userId to the hashed token
        socket.data.userId = sha256md.digest().toHex()

        socket.emit("init", 30, token)
    }

    socket.on("create", async (name: string, clientName: string, maxPlayers: number, listed: boolean) => {
        // Generate server id
        const serverId = crypto.randomBytes(16).toString("hex");

        servers[serverId] = new GameServer(name, maxPlayers, listed, serverId, socket.data.userId)

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

export function generateId() {
    return crypto.randomInt(16)
}

async function main() {
    console.log("Listening on port 8080")
    StaticDispatcher(app)
    httpServer.listen(8080)

    // Create the server and then start it
    servers["e4022d403dcc6d19d6a68ba3abfd0a60"] = new GameServer("dev server", 10, false, "e4022d403dcc6d19d6a68ba3abfd0a60", "asdfasdf")
    await servers["e4022d403dcc6d19d6a68ba3abfd0a60"].start()
}

main().catch(err => {
    console.log(err)
})