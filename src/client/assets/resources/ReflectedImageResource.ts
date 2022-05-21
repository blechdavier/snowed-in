import { Resource } from "./Resource";
import P5 from 'p5';
import { game } from '../../Game';
import { TileType } from "../../../global/Tile"
import { WorldTiles } from "../../world/WorldTiles";
import p5 from "p5";

export class ReflectableImageResource extends Resource {

    image: P5.Image;
    hasReflection: boolean = false;
    reflection: P5.Image;
    reflectivityArray: number[] = [0, 90, 150, 0, 10, 15, 17, 19, 21, 23, 25, 27, 29, 31, 10, 17, 21, 25, 29, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5];
    scarfColor1?: [number, number, number, number]
    scarfColor2?: [number, number, number, number]

    constructor(path: string, scarfColor1?: [number, number, number, number], scarfColor2?: [number, number, number, number]) {
        super(path)
        this.scarfColor1 = scarfColor1;
        this.scarfColor2 = scarfColor2;
    }

    loadResource(game: P5) {
        this.image = game.loadImage(this.path, ()=>{
            if(this.scarfColor1!=undefined && this.scarfColor2!=undefined) {
                this.image.loadPixels();
                for(let i = 0; i<this.image.width; i++) {
                    for(let j = 0; j<this.image.height; j++) {
                        let p = this.image.get(i, j);
                        if(p[0] === 166) {
                            //console.log("color1")
                            this.image.set(i, j, this.scarfColor1);
                        }
                        else if(p[0] === 155) {
                            //console.log("color2")
                            this.image.set(i, j, this.scarfColor2);
                        }
                        else(this.image.set(i, j, p))
                        
                    }
                }
                //this.image.set(3, 10, [0, 255, 0, 255]);//test pixel
                this.image.updatePixels();
            }
            this.loadReflection(game);
        });
    }

    loadReflection(game: P5) {
        if(!this.hasReflection) {//this is so it doesn't load them all at once and instead makes the reflections when they are needed
            this.hasReflection = true;
            this.reflection = game.createImage(this.image.width, this.image.height);
            this.image.loadPixels();
            //console.log(this.image.pixels)
            this.reflection.loadPixels();
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
    
    renderWorldspaceReflection(x: number, y: number, width: number, height: number) {
        if (this.image === undefined)
            throw new Error(
                `Tried to render reflection of image before loading it: ${this.path}`
            );

        if (!this.hasReflection)
            return;
        
        game.fill(255, 0, 0);
        game.stroke(150, 0, 0);

        //loop through every tile it passes through
        for(let i = Math.floor(x); i<x+width; i++) {
            for(let j = Math.floor(y); j<y+height; j++) {
                // console.log(target.world.worldTiles);
                let currentBlock: TileType | string = game.world.worldTiles[j * game.worldWidth + i];
                if(currentBlock === undefined || typeof currentBlock === "string" || currentBlock == TileType.Air) {//the reference to TileEntity can be removed as soon as the better system is in place
                    continue;
                }
                game.drawingContext.globalAlpha = this.reflectivityArray[currentBlock]/255;//TODO make this based on the tile reflectivity
                game.image(
                    this.reflection,
                    (i * game.TILE_WIDTH -
                        game.interpolatedCamX * game.TILE_WIDTH) *
                    game.upscaleSize,
                        (j * game.TILE_HEIGHT -
                            game.interpolatedCamY * game.TILE_HEIGHT) *
                    game.upscaleSize,
                    game.TILE_WIDTH*game.upscaleSize,
                    game.TILE_HEIGHT*game.upscaleSize,
                    (i-x)*game.TILE_WIDTH,
                    (j-y)*game.TILE_HEIGHT,
                    game.TILE_WIDTH,
                    game.TILE_HEIGHT
                );
                game.drawingContext.globalAlpha = 1.0;
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