import { UiScreen } from '../UiScreen';
import p5 from 'p5';
import { UiFrame } from '../UiFrame';
import { Button } from '../Button';
import { OptionsMenu } from './OptionsMenu';
import { FontResource } from '../../assets/resources/FontResource';
import { MainMenu } from './MainMenu';
import { game } from '../../Game';

export class PauseMenu extends UiScreen {

    constructor(font: FontResource, titleFont: FontResource) {
        super();

        // make the frame with some default values.  These will later be changed to fit the screen size.
        this.frame = new UiFrame(0, 0, 0, 0);

        this.titleFont = titleFont;

        // make 4 buttons with default positSions
        this.buttons = [
            new Button(font, "Resume game", "Go back to the game.", 0, 0, 0, 0, () => {
                game.currentUi = undefined;
            }),
            new Button(font, "Options", "Change your keybinds, reduce lag, etc.", 0, 0, 0, 0, () => {
                game.currentUi = new OptionsMenu(font, titleFont, "pause menu");
            }),
            new Button(font, "Leave game", "Go back to Main Menu", 0, 0, 0, 0, () => {
                game.currentUi = new MainMenu(font, titleFont);
            })
        ];

        // update the size of the elements based on the initial screen size
        this.windowUpdate();
    }


    render(target: p5, upscaleSize: number): void {

        // render the rectangular image that the whole menu is on
        this.frame.render(target, upscaleSize);

        // loop through the buttons array and render each one.
        for (const item of this.buttons) {
            item.render(target, upscaleSize);
        }

        this.titleFont.drawText(target, "Paused", this.frame.x + 54*game.upscaleSize, this.frame.y + 16*game.upscaleSize)

    }

    windowUpdate() {
        // set the position of the frame
        this.frame.x = game.width/2-200/2*game.upscaleSize;// center the frame in the middle of the screen
        this.frame.y = game.height/2-72*game.upscaleSize;
        this.frame.w = 200*game.upscaleSize;
        this.frame.h = 54*game.upscaleSize;

        // set the positions of all the buttons
        for(let i = 0; i<this.buttons.length; i++) {
            this.buttons[i].x = game.width/2-192/2*game.upscaleSize;
            this.buttons[i].y = game.height/2+20*i*game.upscaleSize;
            this.buttons[i].w = 192*game.upscaleSize;
            this.buttons[i].h = 16*game.upscaleSize;
            this.buttons[i].updateMouseOver(game.mouseX, game.mouseY);
        }

    }

}