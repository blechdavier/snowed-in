import UiScreen from '../UiScreen';
import p5 from 'p5';
import UiFrame from '../UiFrame';
import game from '../../Main';
import Button from '../Button';

export class OptionsMenu extends UiScreen {

    frame: UiFrame;

    buttons: Button[];

    constructor() {
        super();
        // make the frame with some default values.  These will later be changed to fit the screen size.
        this.frame = new UiFrame(0, 0, 0, 0);
        // make 4 buttons with default positions
        this.buttons = [

        ];
        this.windowUpdate();
    }

    mousePressed(): void {
        // loop through all the buttons in this menu and if the mouse is over them, then call the button's onPressed() function.  The onPressed() function is passed in through the constructor.
        this.buttons.forEach(function (button) {
            if(button.mouseIsOver) {
                button.onPressed();
            }
        });
    }

    render(target: p5, upscaleSize: number): void {

        // render the rectangular image that the whole menu is on
        this.frame.render(target, upscaleSize);

        // loop through the buttons array and render each one.
        for(let i = 0; i<this.buttons.length; i++) {
            this.buttons[i].render(target, upscaleSize);
        }
    }

    windowUpdate() {
        // set the position of the rectangular image that the whole menu is on
        this.frame.x = game.width/2-256/2*game.upscaleSize;// center the frame in the center of the screen
        this.frame.y = game.height/2-192/2*game.upscaleSize;
        this.frame.w = 256*game.upscaleSize;
        this.frame.h = 192*game.upscaleSize;

        // set the positions of all the buttons
        for(let i = 0; i<4; i++) {
            this.buttons[i].x = game.width/2-192/2*game.upscaleSize;
            this.buttons[i].y = game.height/2+20*i*game.upscaleSize;
            this.buttons[i].w = 192*game.upscaleSize;
            this.buttons[i].h = 16*game.upscaleSize;
        }
    }

}