import { UiScreen } from '../UiScreen';
import p5 from 'p5';
import { UiFrame } from '../UiFrame';
import { Button } from '../Button';
import { FontResource } from '../../assets/resources/FontResource';
import { MainMenu } from './MainMenu';
import { WorldOptionsMenu } from './WorldOptionsMenu';
import { game } from '../../Game';

export class WorldCreationMenu extends UiScreen {

    constructor(font: FontResource, titleFont: FontResource) {
        super();
        // make the frame with some default values.  These will later be changed to fit the screen size.
        this.frame = new UiFrame(0, 0, 0, 0);

        this.titleFont = titleFont;
        // make some buttons with default positions
        if (game.serverVisibility === undefined)
            game.serverVisibility = "Public";

        this.buttons = [
            new Button(font, `Server Visibility: ${game.serverVisibility}`, "Change the visibility of the server", 0, 0, 0, 0, () => {
                if (this.buttons[0].txt === "Server Visibility: Public") {
                    game.serverVisibility = "Unlisted";
                    this.buttons[0].txt = "Server Visibility: Unlisted";
                }
                else if (this.buttons[0].txt === "Server Visibility: Unlisted") {
                    game.serverVisibility = "Private";
                    this.buttons[0].txt = "Server Visibility: Private";
                }
                else {
                    game.serverVisibility = "Public";
                    this.buttons[0].txt = "Server Visibility: Public";
                }
            }),
            new Button(font, "World Options", "Change how your world looks and generates.", 0, 0, 0, 0, () => {
                console.log("world menu");
                game.currentUi = new WorldOptionsMenu(font, titleFont);
            }),
            new Button(font, "Back", "Return to the main menu.", 0, 0, 0, 0, () => {
                console.log("main menu");
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
        this.buttons.forEach(button => {
            button.render(target, upscaleSize);
        });

        this.titleFont.drawText(target, "Create World", this.frame.x + 30*game.upscaleSize, this.frame.y + 16*game.upscaleSize)
    }

    windowUpdate() {
        // set the position of the frame
        this.frame.x = game.width / 2 - 200 / 2 * game.upscaleSize;// center the frame in the center of the screen
        this.frame.y = game.height / 2 - 56 * game.upscaleSize;
        this.frame.w = 200 * game.upscaleSize;
        this.frame.h = 48 * game.upscaleSize;

        // set the positions of all the buttons
        for (let i = 0; i < 3; i++) {
            this.buttons[i].x = game.width / 2 - 192 / 2 * game.upscaleSize;
            this.buttons[i].y = game.height / 2 + 20 * i * game.upscaleSize;
            this.buttons[i].w = 192 * game.upscaleSize;
            this.buttons[i].h = 16 * game.upscaleSize;
            this.buttons[i].updateMouseOver(game.mouseX, game.mouseY);
        }
    }

}