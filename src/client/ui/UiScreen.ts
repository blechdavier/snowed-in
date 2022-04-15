import { Renderable } from '../interfaces/Renderable';
import p5 from 'p5';
import { Button } from './Button';
import { Slider } from './Slider';
import { UiFrame } from './UiFrame';
import { game } from '../Game';

export abstract class UiScreen implements Renderable {

    buttons: Button[];
    sliders: Slider[];

    frame: UiFrame

    abstract render(target: p5, upscaleSize: number): void;

    abstract windowUpdate(): void

    mousePressed() {
        if(this.buttons !== undefined) {
            // loop through all the buttons in this menu and if the mouse is over them, then call the button's onPressed() function.  The onPressed() function is passed in through the constructor.
            this.buttons.forEach(button => {
                if(button.mouseIsOver) {
                    button.onPressed();
                }
            });
        }
        if(this.sliders !== undefined) {
            // loop through all the sliders and interact with them accordingly
            for(const i of this.sliders) {
                i.updateSliderPosition(game.mouseX);
                if(game.mouseX>i.x && game.mouseX<i.x+i.w && game.mouseY>i.y && game.mouseY<i.y+i.h)
                    i.beingEdited = true;
            }
        }
    }

    mouseReleased() {
        if(this.sliders !== undefined) {
            // loop through all the sliders and interact with them accordingly
            for(const i of this.sliders) {
                i.beingEdited = false;
            }
        }
    }

}