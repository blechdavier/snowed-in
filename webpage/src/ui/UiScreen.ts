import Renderable from '../interfaces/Renderable';
import p5 from 'p5';
import Button from '../ui/Button';
import Slider from '../ui/Slider';
import UiFrame from './UiFrame';
import game from '../Main';
import InputBox from './InputBox';
import { UiAssets } from '../assets/Assets';

abstract class UiScreen implements Renderable {

    buttons: Button[];
    sliders: Slider[];
    inputBoxes: InputBox[];

    frame: UiFrame

    abstract render(target: p5, upscaleSize: number): void;

    abstract windowUpdate(): void

    mousePressed(btn: number) {
        if(this.buttons !== undefined) {
            // loop through all the buttons in this menu and if the mouse is over them, then call the button's onPressed() function.  The onPressed() function is passed in through the constructor.
            for(const i of this.buttons) {
                if(i.mouseIsOver) {
                    i.onPressed();
                }
            };
        }
        if(this.sliders !== undefined) {
            // loop through all the sliders and interact with them accordingly
            for(const i of this.sliders) {
                i.updateSliderPosition(game.mouseX);
                if(game.mouseX>i.x && game.mouseX<i.x+i.w && game.mouseY>i.y && game.mouseY<i.y+i.h)
                    i.beingEdited = true;
            }
        }
        if(this.inputBoxes !== undefined) {
            // loop through all the input boxes and interact with them accordingly
            for(const i of this.inputBoxes) {
                if(i.mouseIsOver) {
                    i.onPressed();
                }
                else if(i.listening) {
                    i.listening = false;
                    game.controls[i.index].keyCode = btn;
                    game.controls[i.index].keyboard = false;
                    i.value = btn;
                    i.keyboard = false;
                    i.image = UiAssets.button_unselected;
                }
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

export = UiScreen