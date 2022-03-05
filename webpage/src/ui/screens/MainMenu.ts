import UiScreen from '../UiScreen';
import p5 from 'p5';
import UiFrame from '../UiFrame';
import game from '../../Main';
import Button from '../Button';
import Slider from '../Slider';
import { OptionsMenu } from './OptionsMenu';
import FontResource from '../../assets/resources/FontResource';
import { UiAssets } from '../../assets/Assets';
import { WorldCreationMenu } from './WorldCreationMenu';

export class MainMenu extends UiScreen {

    constructor(font: FontResource) {
        super();

        // make the frame with some default values.  These will later be changed to fit the screen size.
        this.frame = new UiFrame(0, 0, 0, 0);

        // make 4 buttons with default positions
        this.buttons = [
            new Button(font, "Resume Game", "Keep playing where you left off.", 0, 0, 0, 0, () => {
                console.log("resume game");
                game.currentUi = undefined;
            }),
            new Button(font, "New Game", "Creates a new server that your friends can join.", 0, 0, 0, 0, () => {
                console.log("new game");
                game.currentUi = new WorldCreationMenu(font);
            }),
            new Button(font, "Join Game", "Join a game with your friends, or make new ones.", 0, 0, 0, 0, () => {
                console.log("join game");
                game.currentUi = undefined;
            }),
            new Button(font, "Options", "Change your keybinds, reduce lag, etc.", 0, 0, 0, 0, () =>{
                console.log("options");
                game.currentUi = new OptionsMenu(font);
            })
        ];

        // update the size of the elements based on the initial screen size
        this.windowUpdate();
    }

    render(target: p5, upscaleSize: number): void {

        // render the rectangular image that the whole menu is on
        this.frame.render(target, upscaleSize);

        UiAssets.title_image.render(target, Math.round(this.frame.x/upscaleSize+1)*upscaleSize, Math.round(this.frame.y/upscaleSize+4)*upscaleSize, 256*upscaleSize, 40*upscaleSize);

        // loop through the buttons array and render each one.
        for (const item of this.buttons) {
            item.render(target, upscaleSize);
        }

    }

    windowUpdate() {
        // set the position of the frame
        this.frame.x = game.width/2-264/2*game.upscaleSize;// center the frame in the middle of the screen
        this.frame.y = game.height/2-56*game.upscaleSize;
        this.frame.w = 264*game.upscaleSize;
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