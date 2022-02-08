import { EventEmitter } from 'events';

class WebSocketClient extends EventEmitter {

    _pingTimeout: NodeJS.Timeout
    _beatInterval: number
    connection: WebSocket

    constructor(url: string, beatInterval: number) {
        super()
        this.connection = new WebSocket(url);
        this._beatInterval = beatInterval;

        this.connection.onmessage = (event: MessageEvent) => {

            const stringData = event.data.toString();

            // Parse the message as JSON
            let JSONData;
            try {
                JSONData = JSON.parse(stringData)
            } catch (err) {
                return;
            }
            this.emit("message", JSONData)
        }

        this.connection.onopen = () => {
            this.emit("open")
        }

        this.connection.onclose = (event) => {
            this.emit("close", event)
        }
    }
}

export = WebSocketClient