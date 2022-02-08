import { WebSocketServer } from 'ws';

export = (server: WebSocketServer) => {
    server.on('connection', (ws) => {

        let isAlive = true;

        const interval = setInterval(() => {
            // If the client has not responded to the last ping
            if(isAlive === false) ws.terminate();

            // Set the alive state to false
            isAlive = false;
            // Ping the client
            ws.ping()
        }, 1000);

        ws.on('ping', () => {
            isAlive = true;
        })

        ws.on('close', (code: number, reason: Buffer) => {
            clearInterval(interval)
        })
    })
}