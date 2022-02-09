import { EventEmitter } from 'events';
import { OutBoundPacket } from './OutBoundPackets';

class WebSocketClient extends EventEmitter {

    _pingTimeout: NodeJS.Timeout
    _beatInterval: number
    connection: WebSocket

    constructor(url: string, beatInterval: number) {
        super()
        console.log("e")
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
            console.log(this.connection.readyState)
            this.emit("open")
        }

        this.connection.onclose = (event) => {
            this.emit("close", event)
        }
    }

    sendPacket(packet: OutBoundPacket) {
        // Make sure that the connection is open
        if(this.connection.readyState !== this.connection.OPEN) return

        this.connection.send(JSON.stringify(packet))
    }
}

export = WebSocketClient