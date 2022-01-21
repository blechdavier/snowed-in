import { game } from "../Main"
import P5 from 'p5';

class Resource {

    image: P5.Image

    // Position on original image fragment
    sourceX: number;
    sourceY: number;

    // Width and height of image fragment
    sourceHeight: number;
    sourceWidth: number;

    constructor(image: P5.Image, sourceX?: number, sourceY?: number, sourceWidth?: number, sourceHeight?: number) {
        this.image = image
        if (sourceX && sourceX && sourceHeight && sourceWidth) {
            this.sourceX = sourceX;
            this.sourceY = sourceY
            this.sourceWidth = sourceWidth
            this.sourceHeight = sourceHeight
        }
    }

    render(target: any, x: number, y: number, width?: number, height?: number) {
        // If the image that is being drawn is tile
        if (this.sourceX && this.sourceX && this.sourceHeight && this.sourceWidth) {
            // Confirm that a required width and height were passed
            if(!(width && height)) throw new Error("Please specify width and height when drawing a tile")

            target.image(this.image, x, y, width, height, this.sourceX, this.sourceY, this.sourceWidth, this.sourceHeight)
            return
        }

        if(width && height) {
            target.image(this.image, x, y, width, height)
            return;
        }
        target.image(this.image, x, y)
    }
}

export = Resource