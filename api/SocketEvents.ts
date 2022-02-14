export type ServerEvents = {
    emit(event: 'init', data: { playerTickRate: number }): void;
    emit(
        event: 'load-world',
        width: number,
        height: number,
        tiles: number[],
        backgroundTiles: number[],
        spawnPosition: { x: number; y: number }
    ): void;
    emit(
        event: 'tick-player',
        players: {
            [name: string]: {
                x: number;
                y: number;
            };
        }
    ): void;
    emit(
        event: 'set-player',
        x: number,
        y: number,
        yVel: number,
        xVel: number
    ): void;
    emit(
        event: 'world-update',
        updatedTiles: {
            tileIndex: number;
            tile: number;
        }[]
    ): void;

    on(event: 'player-update', callback: (x: number, y: number) => void): void;
    on(event: 'world-break-start', callback: (tileIndex: number) => void): void;
    on(event: 'world-break-cancel', callback: () => void): void;
    on(event: 'world-break-finish', callback: () => void): void;
};

export type ClientEvents = {
    on(
        event: 'load-world',
        callback: (
            width: number,
            height: number,
            tiles: number[],
            backgroundTiles: number[],
            spawnPosition: { x: number; y: number }
        ) => void
    ): void;
    on(
        event: 'tick-player',
        callback: (players: {
            [name: string]: {
                x: number;
                y: number;
            };
        }) => void
    ): void;
    on(
        event: 'init',
        callback: (data: { playerTickRate: number, token?: string }) => void
    ): void;
    on(
        event: 'set-player',
        callback: (x: number, y: number, yVel: number, xVel: number) => void
    ): void;
    on(
        event: 'world-update',
        callback: (
            updatedTiles: {
                tileIndex: number;
                tile: number;
            }[]
        ) => void
    ): void;

    emit(event: 'player-update', x: number, y: number): void;
    emit(event: 'player-update', x: number, y: number): void;
    emit(event: 'world-break-start', tileIndex: number): void;
    emit(event: 'world-break-cancel'): void;
    emit(event: 'world-break-finish'): void;
};
