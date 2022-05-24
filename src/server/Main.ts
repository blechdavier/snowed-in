import Express from 'express';
import crypto from 'crypto';
import https from 'https'
import { Server, Socket } from 'socket.io';
import { md } from 'node-forge';
import { spawn, ModuleThread, Worker } from 'threads';
import { sign, verify } from 'jsonwebtoken';

import { PublicDispatcher } from './StaticDispatcher';
import { GameServer } from './game/GameServer';
import { ClientEvents, ServerEvents } from '../global/Events';
import { Keys } from './config.json';
import { WorldWorkerData } from './workers/WorldWorker';
import AdmZip from 'adm-zip';

const app = Express();

const servers: { [serverId: string]: GameServer } = {};

export let io: Server

export let workers: { worldWorker: ModuleThread<WorldWorkerData> };

export type UserData = {
	userId: string;
};


async function main() {
	console.log('Listening on port 8080');
	PublicDispatcher(app);

	console.info('Starting threads...');
	workers = {
		worldWorker: await spawn<WorldWorkerData>(
			new Worker('./workers/WorldWorker'),
		),
	};
	console.info(`Started threads: ${Object.keys(workers).join()}`);

	const sslCert = new AdmZip('./ssl/numericly.net.zip')

	const server = https.createServer(
		{
			//@ts-ignore
			key: sslCert.readFile('private.key'),
			//@ts-ignore
			cert: sslCert.readFile('certificate.crt'),
			//@ts-ignore
			ca: sslCert.readFile('ca_bundle.crt'),
		},
		app
	)

	await server.listen(443)

	io = new Server(server)


	io.on(
		'connection',
		(socket: Socket<ClientEvents, ServerEvents, {}, UserData>) => {
			try {
				const token = verify(
					socket.handshake.auth.token,
					Keys.userTokenKey,
				);
				// Sha256 hash to token for security
				const sha256md = md.sha256.create();
				sha256md.update(
					(token as { userToken: string }).userToken +
					Math.random().toString(),
				);

				// Set the sockets userId to the hashed token
				socket.data.userId = sha256md.digest().toHex();

				socket.emit('init', 30);
			} catch (e) {
				// Generate new user token
				const userToken = crypto.randomBytes(16).toString('hex');

				// Sign a jwt with the user token
				const token = sign({ userToken: userToken }, Keys.userTokenKey);

				// Sha256 hash to token for security
				const sha256md = md.sha256.create();
				sha256md.update(userToken);

				// Set the sockets userId to the hashed token
				socket.data.userId = sha256md.digest().toHex();

				socket.emit('init', 30, token);
			}

			socket.on(
				'create',
				async (
					name: string,
					clientName: string,
					maxPlayers: number,
					listed: boolean,
				) => {
					// Generate server id
					const serverId = crypto.randomBytes(16).toString('hex');

					if (socket.data.userId !== undefined) {
						servers[serverId] = new GameServer(
							name,
							maxPlayers,
							listed,
							serverId,
							socket.data.userId,
						);

						// Add the current socket to the room
						await servers[serverId].join(socket, clientName);
					}
				},
			);

			socket.on('join', async (serverId: string, name: string) => {

				console.log("name: "+name);
				// Invalid name or serverId
				if (
					!/^[A-z0-9\-_ ]{3,20}$/.test(name) ||
					!/^[a-f0-9]{32}$/.test(serverId)
				) {
					console.warn("invalid username or server id name: "+name+", server id: "+serverId)
					return;
				}

				console.log("1")

				// Make sure that the serverId is valid
				if (servers[serverId] === undefined) return;

				console.log("2")

				await servers[serverId].join(socket, name);
			});
		},
	);

	// Create the server and then start it
	servers['e4022d403dcc6d19d6a68ba3abfd0a60'] = new GameServer(
		'dev server',
		10,
		false,
		'e4022d403dcc6d19d6a68ba3abfd0a60',
		'asdfasdf',
	);
	await servers['e4022d403dcc6d19d6a68ba3abfd0a60'].start();
}

main().catch(err => {
	console.log(err);
});
