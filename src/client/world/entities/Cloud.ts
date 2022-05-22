import { game } from "../../Game";
import SimplexNoise from "simplex-noise";
import { ImageResource } from "../../assets/resources/ImageResource";
import { WorldAssets } from "../../assets/Assets";
import p5 from 'p5'

export class Cloud {
    x: number;
    y: number;
    xVel: number;
    image: ImageResource

    constructor(x: number, y: number) {
        this.x = x;
        this.xVel = Math.random()*0.07+0.05;
        this.y = y;
        this.image = WorldAssets.clouds[Math.floor(Math.random() * WorldAssets.clouds.length)]
    }

    render(target: p5, upscaleSize: number): void {
        //console.log(`x: ${this.x}, y: ${this.y}`);
        //draw a cloud at the place :o
        this.image.render(
            target,
            (this.x * game.TILE_WIDTH -
                game.interpolatedCamX * game.TILE_WIDTH) *
            upscaleSize,
            (this.y * game.TILE_HEIGHT -
                game.interpolatedCamY * game.TILE_HEIGHT) *
            upscaleSize,
            this.image.image.width * upscaleSize,
            this.image.image.height * upscaleSize
        );
    }

    tick() {
        this.x += this.xVel;
        let n = ((game.width/game.upscaleSize+50)/game.TILE_WIDTH);
        let x = this.x-game.interpolatedCamX + 50/game.TILE_WIDTH;
        this.x = mod(x, n)+game.interpolatedCamX - 50/game.TILE_WIDTH;
    }

}

function mod(x1: number, x2: number) {
    return ((x1 % x2) + x2) % x2;
}