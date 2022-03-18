import Renderable from '../interfaces/Renderable';
import p5 from 'p5';

abstract class UiScreen implements Renderable {

    abstract buttonPressed(): void;

    abstract render(target: p5, upscaleSize: number): void;

    abstract windowUpdate(): void

}

export = UiScreen