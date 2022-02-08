import Game from '../Game';

interface Tickable {
    tick(game: Game): void;
}

export = Tickable