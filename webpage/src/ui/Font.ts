import Renderable from '../interfaces/Renderable';
import p5 from 'p5';
import { UiAssets } from '../assets/Assets';
import ImageResource from '../assets/resources/ImageResource';

class Font {

    image: ImageResource
    font_image_contents: [string, number][]

    constructor(
        image: ImageResource,
        font_image_contents: [string, number][]) {
        this.image = image
        this.font_image_contents = font_image_contents
    }

    render(target: p5, upscaleSize: number, txt: string) {

    }

}

export = Font;