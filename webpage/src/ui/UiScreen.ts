import Tickable from '../interfaces/Tickable';
import Renderable from '../interfaces/Renderable';
import p5 from 'p5';
import Button from '../ui/Button';
import Game from '../Game';

abstract class UiScreen implements Renderable {

    buttons: Button[];

    abstract render(target: p5, upscaleSize: number): void;

    abstract windowUpdate(): void

    abstract mousePressed(): void

}

export = UiScreen