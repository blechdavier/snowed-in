import Renderable from '../interfaces/Renderable';
import p5 from 'p5';
import { UiAssets } from '../assets/Assets';
import ImageResource from '../assets/resources/ImageResource';
import FontResource from '../assets/resources/FontResource';

class Button implements Renderable {

    font: FontResource
    txt: string
    description: string
    onPressed: Function
    x: number
    y: number
    w: number
    h: number
    image: ImageResource
    mouseIsOver: boolean

    constructor(
        font: FontResource,
        txt: string,
        description: string,
        x: number,
        y: number,
        w: number,
        h: number,
        onPressed: Function) {
        this.font = font;
        this.txt = txt
        this.description = description
        this.onPressed = onPressed
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.image = UiAssets.button_unselected;
        this.mouseIsOver = false;
    }

    render(target: p5, upscaleSize: number) {
        // set the coords and dimensions to round to the nearest un-upscaled pixel
        const x = Math.round(this.x/upscaleSize)*upscaleSize;
        const y = Math.round(this.y/upscaleSize)*upscaleSize;
        const w = Math.round(this.w/upscaleSize)*upscaleSize;
        const h = Math.round(this.h/upscaleSize)*upscaleSize;

        // corners
        this.image.renderPartial(target, x, y, 7*upscaleSize, 7*upscaleSize, 0, 0, 7, 7);
        this.image.renderPartial(target, x+w-7*upscaleSize, y, 7*upscaleSize, 7*upscaleSize, 8, 0, 7, 7);
        this.image.renderPartial(target, x, y+h-7*upscaleSize, 7*upscaleSize, 7*upscaleSize, 0, 8, 7, 7);
        this.image.renderPartial(target, x+w-7*upscaleSize, y+h-7*upscaleSize, 7*upscaleSize, 7*upscaleSize, 8, 8, 7, 7);

        // top and bottom
        this.image.renderPartial(target, x+7*upscaleSize, y, w-14*upscaleSize, 7*upscaleSize, 7, 0, 1, 7);
        this.image.renderPartial(target, x+7*upscaleSize, y+h-7*upscaleSize, w-14*upscaleSize, 7*upscaleSize, 7, 8, 1, 7);

        // left and right
        this.image.renderPartial(target, x, y+7*upscaleSize, 7*upscaleSize, h-14*upscaleSize, 0, 7, 7, 1);
        this.image.renderPartial(target, x+w-7*upscaleSize, y+7*upscaleSize, 7*upscaleSize, h-14*upscaleSize, 8, 7, 7, 1);

        // center
        this.image.renderPartial(target, x+7*upscaleSize, y+7*upscaleSize, w-14*upscaleSize, h-14*upscaleSize, 7, 7, 1, 1);

        this.font.drawText(target, this.txt, x+6*upscaleSize, Math.round((this.y+this.h/2)/upscaleSize)*upscaleSize-6*upscaleSize);
    }

    updateMouseOver(mouseX: number, mouseY: number) {
        // if the mouse position is inside the button, return true
        if(mouseX>this.x && mouseX<this.x+this.w && mouseY>this.y && mouseY<this.y+this.h){
            this.mouseIsOver = true;
            this.image = UiAssets.button_selected;
        }
        else {
            this.mouseIsOver = false;
            this.image = UiAssets.button_unselected;
        }
    }

}

export = Button;