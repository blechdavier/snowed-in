import P5 from 'p5';
import { Resource } from './Resource';

export class ImageResource extends Resource {
    image: P5.Image;

    constructor(path: string) {
        super(path);
    }

    loadResource(game: P5) {
        this.image = game.loadImage(this.path);
    }

    render(target: any, x: number, y: number, width: number, height: number) {
        // Verify that the tiles has been loaded
        if (this.image === undefined)
            throw new Error(
                `Tried to render image before loading it: ${this.path}`
            );

        // Draw non tiles image
        target.image(this.image, x, y, width, height);
    }

    renderRotated(target: any, x: number, y: number, width: number, height: number, rotation: number) {
        // Verify that the tiles has been loaded
        if (this.image === undefined)
            throw new Error(
                `Tried to render image before loading it: ${this.path}`
            );

        // Draw non tiles image
        target.push()
        target.translate(x+width/2, y+height/2);
        target.rotate(rotation);
        target.translate(-width/2, -height/2);
        target.image(this.image, 0, 0, width, height);
        target.pop()
    }


    renderPartial(
        target: any,
        x: number,
        y: number,
        width: number,
        height: number,
        sourceX?: number,
        sourceY?: number,
        sourceWidth?: number,
        sourceHeight?: number
    ) {
        // Verify that the tiles has been loaded
        if (this.image === undefined)
            throw new Error(
                `Tried to render image before loading it: ${this.path}`
            );

        // Draw a partial part of the image
        target.image(
            this.image,
            x,
            y,
            width,
            height,
            sourceX,
            sourceY,
            sourceWidth,
            sourceHeight
        );
    }
}
