import Express from 'express'
import { WebSocketServer } from 'ws';
import http from 'http';
import GameServer from './websocket/GameServer'
import StaticDispatcher from './StaticDispatcher';

const app = Express();

const httpServer = http.createServer(app)


const webSocketServer = new WebSocketServer({ path: "/websocket", server: httpServer })

async function main() {
    console.log("Listening on port 8080")
    StaticDispatcher(app)
    GameServer(webSocketServer)
    httpServer.listen(8080)
}

main().catch(err => {
    console.log(err)
})