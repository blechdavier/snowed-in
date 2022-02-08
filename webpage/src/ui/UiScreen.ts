import Tickable from '../interfaces/Tickable';
import Renderable from '../interfaces/Renderable';
import p5 from 'p5';
import Game from '../Game';

abstract class UiScreen implements Renderable, Tickable {

    abstract buttonPressed(): void;

    abstract render(target: p5, upscaleSize: number): void;

    abstract tick(game: Game): void;

}

export = UiScreen