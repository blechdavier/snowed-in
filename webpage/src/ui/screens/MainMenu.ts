import UiScreen from '../UiScreen';
import p5 from 'p5';
import UiFrame from '../UiFrame';
import game from '../../Main';
import Button from '../Button';

export class MainMenu extends UiScreen {

    frame: UiFrame;

    constructor() {
        super();
        this.frame = new UiFrame(0, 0, 0, 0);
        this.buttons = [new Button(100, 100, 100, 40)];
        this.windowUpdate();
    }

    buttonPressed(): void {
    }

    render(target: p5, upscaleSize: number): void {
        this.frame.render(target, upscaleSize);
    }

    windowUpdate() {
        this.frame.x = game.width/2-256/2*game.upscaleSize;// center the frame in the center of the screen
        this.frame.y = game.height/2-160/2*game.upscaleSize;
        this.frame.w = 256*game.upscaleSize;
        this.frame.h = 160*game.upscaleSize;// roughly golden ratio width/height
    }

}