import Renderable from '../interfaces/Renderable';
import p5 from 'p5';
import { UiAssets } from '../assets/Assets';

class UiFrame implements Renderable {

    x: number
    y: number
    w: number
    h: number

    constructor(
        x: number,
        y: number,
        w: number,
        h: number) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
    }

    render(target: p5, upscaleSize: number) {
        // set the coords and dimensions to round to the nearest un-upscaled pixel
        const x = Math.round(this.x/upscaleSize)*upscaleSize;
        const y = Math.round(this.y/upscaleSize)*upscaleSize;
        const w = Math.round(this.w/upscaleSize)*upscaleSize;
        const h = Math.round(this.h/upscaleSize)*upscaleSize;

        // corners
        UiAssets.ui_frame.renderPartial(target, x, y, 7*upscaleSize, 7*upscaleSize, 0, 0, 7, 7);
        UiAssets.ui_frame.renderPartial(target, x+w-7*upscaleSize, y, 7*upscaleSize, 7*upscaleSize, 8, 0, 7, 7);
        UiAssets.ui_frame.renderPartial(target, x, y+h-7*upscaleSize, 7*upscaleSize, 7*upscaleSize, 0, 8, 7, 7);
        UiAssets.ui_frame.renderPartial(target, x+w-7*upscaleSize, y+h-7*upscaleSize, 7*upscaleSize, 7*upscaleSize, 8, 8, 7, 7);

        // top and bottom
        UiAssets.ui_frame.renderPartial(target, x+7*upscaleSize, y, w-14*upscaleSize, 7*upscaleSize, 7, 0, 1, 7);
        UiAssets.ui_frame.renderPartial(target, x+7*upscaleSize, y+h-7*upscaleSize, w-14*upscaleSize, 7*upscaleSize, 7, 8, 1, 7);

        // left and right
        UiAssets.ui_frame.renderPartial(target, x, y+7*upscaleSize, 7*upscaleSize, h-14*upscaleSize, 0, 7, 7, 1);
        UiAssets.ui_frame.renderPartial(target, x+w-7*upscaleSize, y+7*upscaleSize, 7*upscaleSize, h-14*upscaleSize, 8, 7, 7, 1);

        // center
        UiAssets.ui_frame.renderPartial(target, x+7*upscaleSize, y+7*upscaleSize, w-14*upscaleSize, h-14*upscaleSize, 7, 7, 1, 1);

    }
}

export = UiFrame;