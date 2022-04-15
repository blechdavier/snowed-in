import { Game } from '../Game';

export interface Tickable {
    tick(game: Game): void;
}