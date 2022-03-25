import P5 from 'p5';
import Resource from './Resource';

class ImageResource extends Resource {
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

    // renderWorldspaceReflection(target: any, x: number, y: number, width: number, height: number) {  SCRAPPED, see https://openprocessing.org/sketch/1525969 for an alternative
    //     // Verify that the tiles has been loaded
    //     if (this.image === undefined)
    //         throw new Error(
    //             `Tried to render image before loading it: ${this.path}`
    //         );

    //     //loop through every tile it passes through
    //     for(let i = Math.floor(x); i<x+width; i++) {
    //         for(let j = Math.floor(y); j<y+height; j++) {
    //             this.renderPartial(
    //                 target,
    //                 (i * target.TILE_WIDTH -
    //                     target.interpolatedCamX * target.TILE_WIDTH) *
    //                     target.upscaleSize,
    //                 ((j+1) * target.TILE_HEIGHT -
    //                     target.interpolatedCamY * target.TILE_HEIGHT) *
    //                     target.upscaleSize,
    //                 target.upscaleSize * target.TILE_WIDTH,
    //                 target.upscaleSize * target.TILE_HEIGHT*2,
    //                 (i-x)*target.TILE_WIDTH*this.image.width/width/target.TILE_WIDTH,
    //                     (j-y)*target.TILE_HEIGHT*this.image.height/height/target.TILE_HEIGHT,
    //                     target.TILE_WIDTH * this.image.width/width/target.TILE_WIDTH,
    //                     target.TILE_HEIGHT * this.image.height/height/target.TILE_HEIGHT);
                
    //         }
    //     }
    // }

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

export = ImageResource;
