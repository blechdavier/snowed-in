export type ServerEvents = {
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
                y: number
            };
        }
    ): void;
    emit(event: 'init', data: { playerTickRate: number }): void;
    emit(
        event: 'set-player',
        x: number,
        y: number,
        yVel: number,
        xVel: number
    ): void;
    on(
        event: 'player-update',
        callback: (x: number, y: number) => void
    ): void;
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
        callback: (data: { playerTickRate: number }) => void
    ): void;
    on(
        event: 'set-player',
        callback: (x: number, y: number, yVel: number, xVel: number) => void
    ): void;
    emit(
        event: 'player-update',
        x: number,
        y: number,
    ): void;
};
