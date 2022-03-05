import UiScreen from '../UiScreen';
import p5 from 'p5';
import UiFrame from '../UiFrame';
import game from '../../Main';
import Button from '../Button';
import FontResource from '../../assets/resources/FontResource';
import { WorldCreationMenu } from './WorldCreationMenu';
import Slider from '../Slider';

export class WorldOptionsMenu extends UiScreen {

    constructor(font: FontResource) {
        super();
        // make the frame with some default values.  These will later be changed to fit the screen size.
        this.frame = new UiFrame(0, 0, 0, 0);
        // make some buttons with default positions
        if(game.worldBumpiness === undefined)
            game.worldBumpiness = 1;


        let tempWorldBumpinessText;

        if(game.worldBumpiness===1) {
            tempWorldBumpinessText = "Normal";
        }
        else if(game.worldBumpiness===0) {
            tempWorldBumpinessText = "Superflat";
        }
        else {
            tempWorldBumpinessText = "Amplified";
        }
        this.buttons = [
            new Button(font, `World Bumpiness: ${tempWorldBumpinessText}`, "Change the intensity of the world's bumps.", 0, 0, 0, 0, () => {
                if(this.buttons[0].txt === "World Bumpiness: Normal"){
                    this.buttons[0].txt = "World Bumpiness: Amplified";
                    game.worldBumpiness = 3;
                }
                else if(this.buttons[0].txt === "World Bumpiness: Amplified") {
                    this.buttons[0].txt = "World Bumpiness: Superflat";
                    game.worldBumpiness = 0;
                }
                else {
                    this.buttons[0].txt = "World Bumpiness: Normal";
                    game.worldBumpiness = 1;
                }
            }),
            new Button(font, "Back", "Return to the main menu.", 0, 0, 0, 0, () => {
                console.log("main menu");
                game.currentUi = new WorldCreationMenu(font);
            })
        ];
        this.sliders = [
            new Slider(font, "Width", 512, 64, 2048, 64, 0, 0, 0, 0, () => {
                game.worldWidth = this.sliders[0].value;
            }),
            new Slider(font, "Height", 64, 64, 512, 16, 0, 0, 0, 0, () => {
                game.worldHeight = this.sliders[1].value;
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

        // loop through the sliders array and render each one.
        this.sliders.forEach(slider => {
            slider.render(target, upscaleSize);
        });
    }

    windowUpdate() {
        // set the position of the frame
        this.frame.x = game.width/2-200/2*game.upscaleSize;// center the frame in the center of the screen
        this.frame.y = game.height/2-56*game.upscaleSize;
        this.frame.w = 200*game.upscaleSize;
        this.frame.h = 48*game.upscaleSize;

        // set the positions of all the buttons
        for(let i = 0; i<2; i++) {
            this.buttons[i].x = game.width/2-192/2*game.upscaleSize;
            this.buttons[i].y = game.height/2+60*i*game.upscaleSize;
            this.buttons[i].w = 192*game.upscaleSize;
            this.buttons[i].h = 16*game.upscaleSize;
            this.buttons[i].updateMouseOver(game.mouseX, game.mouseY);
        }

        // set the positions of all the sliders
        for(let i = 0; i<2; i++) {
            this.sliders[i].x = game.width/2-192/2*game.upscaleSize;
            this.sliders[i].y = game.height/2+20*game.upscaleSize+20*i*game.upscaleSize;
            this.sliders[i].w = 192*game.upscaleSize;
            this.sliders[i].h = 16*game.upscaleSize;
            if(game.mouseIsPressed)
                this.sliders[i].updateSliderPosition(game.mouseX);
        }
    }

}