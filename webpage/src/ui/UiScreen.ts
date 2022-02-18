import Renderable from '../interfaces/Renderable';
import p5 from 'p5';
import Button from '../ui/Button';
import Slider from '../ui/Slider';

abstract class UiScreen implements Renderable {

    buttons: Button[];
    sliders: Slider[];

    abstract render(target: p5, upscaleSize: number): void;

    abstract windowUpdate(): void

    abstract mousePressed(): void

}

export = UiScreen