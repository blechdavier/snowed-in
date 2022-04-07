import Resource from "./Resource";
import P5 from 'p5';
import Game from "../../Game";
import { WorldTiles } from '../../world/WorldTiles'
import { TileType } from "../../../../api/Tile"

export = class ReflectableImageResource extends Resource {

    image: P5.Image;
    hasReflection: boolean = false;;
    reflection: P5.Image;

    constructor(path: string) {
        super(path);
    }

    loadResource(game: P5) {
        this.image = game.loadImage(this.path);
    }

    render(target: any, x: number, y: number, width: number, height: number) {
        //console.log(WorldTiles);
        // Verify that the image has been loaded
        if (this.image === undefined)
            throw new Error(
                `Tried to render image before loading it: ${this.path}`
            );

        // Draw non tiles image
        target.image(this.image, x, y, width, height);
    }
    
    renderWorldspaceReflection(target: Game, x: number, y: number, width: number, height: number) {//this is broken
        if (this.image === undefined)
            throw new Error(
                `Tried to render reflection of image before loading it: ${this.path}`
            );
        if(!this.hasReflection) {//this is so it doesn't load them all at once and instead makes the reflections when they are needed
            this.hasReflection = true;
            this.reflection = target.createImage(this.image.width, this.image.height);
            this.reflection.loadPixels();
            this.image.loadPixels();
            for(let i = 0; i<this.reflection.width; i++) {//generate a reflection image that is displayed as a reflection
                for(let j = 0; j<this.reflection.height; j++) {
                    for(let k = 0; k<3; k++) {
                        this.reflection.pixels[4*(j*this.reflection.width+i)+k] = this.image.pixels[4*((this.image.height-j-1)*this.image.width+i)+k];
                    }
                    this.reflection.pixels[4*(j*this.reflection.width+i)+3] = 
                    this.image.pixels[4*((this.image.height-j-1)*this.image.width+i)+3] * 
                    ((this.reflection.height-j)/this.reflection.height) * 
                    (this.reflection.width/2+0.5-Math.abs(i-this.reflection.width/2+0.5))/(this.reflection.width/2);
                }
            }
            this.reflection.updatePixels();
        }
            target.fill(255, 0, 0);
            target.stroke(150, 0, 0);

        //loop through every tile it passes through
        for(let i = Math.floor(x); i<x+width; i++) {
            for(let j = Math.floor(y); j<y+height; j++) {
                // console.log(target.world.worldTiles);
                let currentBlock: number = target.world.worldTiles[j * target.worldWidth + i];
                if(currentBlock === undefined || currentBlock == TileType.Air || currentBlock == TileType.TileEntity) {//the reference to TileEntity can be removed as soon as the better system is in place
                    continue;
                }
                target.tint(255, 150);//TODO make it somewhat translucent based on the reflectivity of the tile
                target.image(
                    this.reflection,
                    (i * target.TILE_WIDTH -
                        target.interpolatedCamX * target.TILE_WIDTH) *
                        target.upscaleSize,
                        (j * target.TILE_HEIGHT -
                            target.interpolatedCamY * target.TILE_HEIGHT) *
                            target.upscaleSize,
                    target.TILE_WIDTH*target.upscaleSize,
                    target.TILE_HEIGHT*target.upscaleSize,
                    (i-x)*target.TILE_WIDTH,
                    (j-y)*target.TILE_HEIGHT,
                    target.TILE_WIDTH,
                    target.TILE_HEIGHT
                );
                target.noTint();
            }
        }
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