import { game } from "../../Game";
import { Particle } from "../../interfaces/Particle";
import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";

export class FireParticle implements Particle {
    color: string
    x: number;
    y: number;
    size: number;
    xVel: number;
    yVel: number;
    gravity: boolean;
    age: number;
    lifespan: number;

    constructor(color: string, size: number, lifespan: number, x: number, y: number, xVel?: number, yVel?: number, gravity?: boolean) {
        this.color = color;
        this.x = x;
        this.y = y;
        this.xVel = xVel || 0;
        this.yVel = yVel || 0;
        this.size = size;
        this.gravity = true;//using the or modifier with booleans causes bugs; there's probably a better way to do this
        if (gravity !== undefined)
            this.gravity = gravity;
        this.age = 0;
        this.lifespan = lifespan;
    }

    render(target: import("p5"), upscaleSize: number): void {
        if (this.age / this.lifespan < 0.8) {//if it's under 80% of the particle's lifespan, draw normally without fade
            target.fill(this.color);
        }
        else {//this means that the particle is almost going to be deleted, so fading is necessary
            if (this.color.length === 7) {//if there is no transparency by default, just map the things
                let transparencyString = Math.round(255 * (-5 * (this.age / this.lifespan) + 5)).toString(16).substring(0, 2);
                if (transparencyString===undefined || transparencyString.length===undefined)//catch what could be an infinite loop or just an error
                    throw new Error(
                        `undefined transparency string on particle`
                    );
                while(transparencyString.length<2) {//make sure it's 2 characters long; this stops the computer from interpreting #ff ff ff 5 as #ff ff ff 55 instead of #ff ff ff 05
                    transparencyString = "0"+transparencyString;
                }
                target.fill(this.color.substring(0, 7) + transparencyString);
            }
            else {//if there is transparency, multiply
                let transparencyString = Math.round(parseInt(this.color.substring(7, 9), 16) * (-5 * (this.age / this.lifespan) + 5)).toString(16).substring(0, 2);
                if (transparencyString===undefined || transparencyString.length===undefined)//catch what could be an infinite loop or just an error
                    throw new Error(
                        `undefined transparency string on particle`
                    );
                while(transparencyString.length<2) {//make sure it's 2 characters long; this stops the computer from interpreting #ff ff ff 5 as #ff ff ff 55 instead of #ff ff ff 05
                    transparencyString = "0"+transparencyString;
                }
                target.fill(this.color.substring(0, 7) + transparencyString);
            }
        }
        //draw a rectangle centered on the x and y position filled with the color of the object
        target.rect(
            (-this.size / 2 + this.x * game.TILE_WIDTH -
                game.interpolatedCamX * game.TILE_WIDTH) *
            upscaleSize,
            (-this.size / 2 + this.y * game.TILE_HEIGHT -
                game.interpolatedCamY * game.TILE_HEIGHT) *
            upscaleSize,
            this.size * upscaleSize * game.TILE_WIDTH,
            this.size * upscaleSize * game.TILE_HEIGHT
        );
    }

    tick() {
        this.age++;
        this.x += this.xVel;
        this.y += this.yVel;
        this.xVel -= (Math.abs(this.xVel) * this.xVel * game.DRAG_COEFFICIENT * this.size);//assuming constant mass for each particle
        if (this.gravity) {
            this.yVel += game.GRAVITY_SPEED;
        }
        this.yVel -= (Math.abs(this.yVel) * this.yVel * game.DRAG_COEFFICIENT * this.size);
    }

}