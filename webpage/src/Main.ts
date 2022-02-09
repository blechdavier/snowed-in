import WebSocketClient from './websocket/WebSocketClient';
import Game from './Game';
import { io } from "socket.io-client";

// Connect the server
const url = new URL('/websocket', window.location.href);
url.protocol = url.protocol.replace('http', 'ws');

const connection = io()

export default new Game(connection);