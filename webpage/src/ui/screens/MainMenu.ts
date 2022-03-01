import UiScreen from '../UiScreen';
import p5 from 'p5';
import UiFrame from '../UiFrame';
import game from '../../Main';
import Button from '../Button';
import Slider from '../Slider';
import { OptionsMenu } from './OptionsMenu';
import FontResource from '../../assets/resources/FontResource';

export class MainMenu extends UiScreen {

    constructor(font: FontResource) {
        console.log(font);
        super();

        // make the frame with some default values.  These will later be changed to fit the screen size.
        this.frame = new UiFrame(0, 0, 0, 0);

        // make 4 buttons with default positions
        this.buttons = [
            new Button(font, "Resume Game", "Keep playing where you left off.", 0, 0, 0, 0, function() {
                console.log("resume game");
                game.currentUi = undefined;
            }),
            new Button(font, "New Game", "Creates a new server that your friends can join.", 0, 0, 0, 0, function() {
                console.log("new game");
                game.currentUi = undefined;
            }),
            new Button(font, "Join Game", "Join a game with your friends, or make new ones.", 0, 0, 0, 0, function() {
                console.log("join game");
                game.currentUi = undefined;
            }),
            new Button(font, "Options", "Change your keybinds, reduce lag, etc.", 0, 0, 0, 0, function() {
                console.log("options");
                game.currentUi = new OptionsMenu(font);
            })
        ];

        // no sliders
        this.sliders = [];

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
        for (const item of this.buttons) {
            item.render(target, upscaleSize);
        }
        for(let i = 0; i<this.sliders.length; i++) {
            this.sliders[i].render(target, upscaleSize);
        }

    }

    windowUpdate() {
        // set the position of the frame
        this.frame.x = game.width/2-256/2*game.upscaleSize;// center the frame in the middle of the screen
        this.frame.y = game.height/2-72*game.upscaleSize;
        this.frame.w = 256*game.upscaleSize;
        this.frame.h = 64*game.upscaleSize;

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