import Renderable from '../interfaces/Renderable';
import p5 from 'p5';
import Button from '../ui/Button';
import Slider from '../ui/Slider';
import UiFrame from './UiFrame';
import game from '../Main';

abstract class UiScreen implements Renderable {

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
                i.updateSliderPosition(game.mouseX, game.mouseY);
            }
        }
    }

}

export = UiScreen