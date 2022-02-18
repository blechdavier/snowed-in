import Renderable from '../interfaces/Renderable';
import p5 from 'p5';
import { UiAssets } from '../assets/Assets';
import ImageResource from '../assets/resources/ImageResource';
import game from '../Main'

class Slider implements Renderable {

    value: number
    min: number
    max: number
    step: number
    onChanged: Function
    x: number
    y: number
    w: number
    h: number
    image: ImageResource
    mouseIsOver: boolean

    constructor(
        value:number,
        min: number,
        max: number,
        step: number,
        x: number,
        y: number,
        w: number,
        h: number,
        onChanged: Function) {
        this.value = value
        this.min = min
        this.max = max
        this.step = step
        this.onChanged = onChanged
        this.x = x
        this.y = y
        this.w = w
        this.h = h
    }

    render(target: p5, upscaleSize: number) {
        // set the coords and dimensions to round to the nearest un-upscaled pixel
        const x = Math.round(this.x/upscaleSize)*upscaleSize;
        const y = Math.round((this.y+this.h/2)/upscaleSize)*upscaleSize;
        const w = Math.round(this.w/upscaleSize)*upscaleSize;
        const h = Math.round(this.h/upscaleSize)*upscaleSize;

        target.rect(this.x, this.y, this.w, this.h);
        // left side of slider bar
        UiAssets.slider_bar.renderPartial(target, x, y-2*upscaleSize, 2*upscaleSize, 4*upscaleSize, 0, 0, 2, 4);
        // right side of slider bar
        UiAssets.slider_bar.renderPartial(target, x+w-2*upscaleSize, y-2*upscaleSize, 2*upscaleSize, 4*upscaleSize, 3, 0, 2, 4);
        // center of slider bar
        UiAssets.slider_bar.renderPartial(target, x+2*upscaleSize, y-2*upscaleSize, w-4*upscaleSize, 4*upscaleSize, 2, 0, 1, 4);
        // handle

        // UiAssets.slider_handle.render(target, this.x+this.value, ____, 9, 9);
    }

    updateSliderPosition(mouseX: number, mouseY: number) {
        console.log("asfddsaf");
        if(mouseX>this.x && mouseX<this.x+this.w && mouseY>this.y && mouseY<this.y+this.h){
            this.value = (Math.round((mouseX-this.x-2*game.upscaleSize) / this.w-(4*game.upscaleSize) / this.step)*this.step);
            console.log(this.value);
        }
    }

}

export = Slider;