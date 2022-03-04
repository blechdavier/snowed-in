import UiScreen from '../UiScreen';
import p5 from 'p5';
import UiFrame from '../UiFrame';
import game from '../../Main';
import Button from '../Button';
import Slider from'../Slider';
import FontResource from '../../assets/resources/FontResource';
import { MainMenu } from './MainMenu';

export class OptionsMenu extends UiScreen {

    constructor(font: FontResource) {
        super();
        // make the frame with some default values.  These will later be changed to fit the screen size.
        this.frame = new UiFrame(0, 0, 0, 0);
        // make some buttons with default positions
        this.buttons = [
            new Button(font, "Video Settings", "Change the balance between performance and fidelity.", 0, 0, 0, 0, () => {
                console.log("video settings");
                game.currentUi = undefined;
            }),
            new Button(font, "Controls", "Change your keybinds.", 0, 0, 0, 0, () => {
                console.log("control menu");
                game.currentUi = undefined;
            }),
            new Button(font, "Audio Settings", "Change the volume of different sounds.", 0, 0, 0, 0, () => {
                console.log("audio menu");
                game.currentUi = undefined;
            }),
            new Button(font, "Back", "Return to the main menu.", 0, 0, 0, 0, () => {
                console.log("main menu");
                game.currentUi = new MainMenu(font);
            })
        ];
        // update the size of the elements based on the initial screen size
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
        // set the position of the frame
        this.frame.x = game.width/2-200/2*game.upscaleSize;// center the frame in the center of the screen
        this.frame.y = game.height/2-56*game.upscaleSize;
        this.frame.w = 200*game.upscaleSize;
        this.frame.h = 48*game.upscaleSize;

        // set the positions of all the buttons
        for(let i = 0; i<4; i++) {
            this.buttons[i].x = game.width/2-192/2*game.upscaleSize;
            this.buttons[i].y = game.height/2+20*i*game.upscaleSize;
            this.buttons[i].w = 192*game.upscaleSize;
            this.buttons[i].h = 16*game.upscaleSize;
            this.buttons[i].updateMouseOver(game.mouseX, game.mouseY);
        }
    }

}