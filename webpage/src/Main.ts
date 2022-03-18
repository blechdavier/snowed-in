import Game from './Game';
import { io } from "socket.io-client";

// Connect the server

const connection = io({ auth: { token: window.localStorage.getItem('token') } })

export default new Game(connection);