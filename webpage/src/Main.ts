import WebSocketClient from './websocket/WebSocketClient';
import Game from './Game';

// Connect the server
const url = new URL('/websocket', window.location.href);
url.protocol = url.protocol.replace('http', 'ws');

const connection = new WebSocketClient(url.href, 30000);

export default new Game(connection);