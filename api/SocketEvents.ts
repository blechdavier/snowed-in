export type ServerEvents = {
    emit(
        event: 'loadWorld',
        world: {
            width: number;
            height: number;
            tiles: Uint8Array;
            backgroundTiles: Uint8Array;
        }
    ): void;
};

export type ClientEvents = {
    on(
        event: 'loadWorld',
        callback: (world: {
            width: number;
            height: number;
            tiles: Uint8Array;
            backgroundTiles: Uint8Array;
        }) => void
    ): void;
};