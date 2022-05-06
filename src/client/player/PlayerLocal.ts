import p5 from 'p5';
import { Entities, EntityPayload } from '../../global/Entity';
import { game } from '../Game';
import { ServerEntity } from '../world/entities/ServerEntity';
// import { ColorParticle } from '../world/';
import { AnimationFrame, PlayerAnimations } from '../assets/Assets';
import { TileType } from '../../global/Tile';
import { WorldTiles } from '../world/WorldTiles';
import { ColorParticle } from '../world/particles/ColorParticle';

export class PlayerLocal extends ServerEntity {
    // Constant data
    width: number = 12 / game.TILE_WIDTH;
    height: number = 20 / game.TILE_HEIGHT;

    // Shared data
    name: string;

    // Local data
    xVel: number = 0;
    yVel: number = 0;
    slideX: number;
    slideY: number;
    interpolatedX: number;
    interpolatedY: number;

    pX: number;
    pY: number;
    pXVel: number = 0;
    pYVel: number = 0;

    grounded: boolean = false;
    pGrounded: boolean = false;

    collisionData: any;
    closestCollision: [number, number, number];

    mass: number = this.width * this.height;


    //input booleans
    rightButton: boolean;
    leftButton: boolean;
    jumpButton: boolean;

    currentAnimation: AnimationFrame<typeof PlayerAnimations> = "idle";
    animFrame: number = 0;

    topCollision: (typeof WorldTiles[TileType.Air]) = WorldTiles[TileType.Air];//hacky
    bottomCollision: (typeof WorldTiles[TileType.Air]) = WorldTiles[TileType.Air];

    constructor(
        data: EntityPayload<Entities.LocalPlayer>
    ) {
        super(data.id)

        this.name = data.data.name;

        this.x = data.data.x;
        this.y = data.data.y;

        this.pX = this.x;
        this.pY = this.y;

        this.interpolatedX = this.x;
        this.interpolatedY = this.y;

        this.closestCollision = [1, 0, Infinity];
    
        this.leftButton = false;
        this.rightButton = false;
        this.jumpButton = false;
    }

    render(target: p5, upscaleSize: number): void {

        target.rect(
            (this.interpolatedX * game.TILE_WIDTH -
                game.interpolatedCamX * game.TILE_WIDTH) *
                upscaleSize,
            (this.interpolatedY * game.TILE_HEIGHT -
                game.interpolatedCamY * game.TILE_HEIGHT) *
                upscaleSize,
            this.width * upscaleSize * game.TILE_WIDTH,
            this.height * upscaleSize * game.TILE_HEIGHT
        );
        PlayerAnimations[this.currentAnimation][this.animFrame].render
            (
                target,
                (this.interpolatedX * game.TILE_WIDTH -
                    game.interpolatedCamX * game.TILE_WIDTH) *
                upscaleSize,
                (this.interpolatedY * game.TILE_HEIGHT -
                    game.interpolatedCamY * game.TILE_HEIGHT) *
                upscaleSize,
                this.width * upscaleSize * game.TILE_WIDTH,
                this.height * upscaleSize * game.TILE_HEIGHT
            );
            PlayerAnimations[this.currentAnimation][this.animFrame].renderWorldspaceReflection
            (
                this.interpolatedX,
                this.interpolatedY+this.height,
                this.width,
                this.height
            );
    }

    updateData(data: EntityPayload): void {
        if (data.type === Entities.Player) this.name = data.data.name;
    }

    keyboardInput() {

        this.xVel +=
            0.02 * (+this.rightButton - +this.leftButton);
        if (
            this.grounded && this.jumpButton
        ) {
            game.screenshakeAmount = 0.5;
            for (let i = 0; i < 10 * game.particleMultiplier; i++) {
                if(this.bottomCollision !== undefined)
                    game.particles.push(new ColorParticle(this.bottomCollision.color, 1 / 8 + Math.random() / 8, 20, this.x + this.width * Math.random(), this.y + this.height, 0.2 * (Math.random() - 0.5), 0.2 * -Math.random()));
            }
            this.yVel = -1.5;
        }
    }

    applyGravityAndDrag() {
        // this function changes the object's next tick's velocity in both the x and the y directions

        this.pXVel = this.xVel;
        this.pYVel = this.yVel;

        if (this.bottomCollision === undefined) {
            this.xVel -=
                (Math.abs(this.xVel) * this.xVel * game.DRAG_COEFFICIENT * this.width) / //apply air resistance
                this.mass;
        } else {
            this.xVel -=
                (Math.abs(this.xVel) * this.xVel * game.DRAG_COEFFICIENT * (this.bottomCollision.friction) * this.width) / //apply air resistance and ground friction
                this.mass;
        }
        this.yVel += game.GRAVITY_SPEED;
        this.yVel -=
            (game.abs(this.yVel) * this.yVel * game.DRAG_COEFFICIENT * this.height) /
            this.mass;
        //if on the ground, make walking particles
        if (this.grounded) {
            //footsteps
            for (let i = 0; i < randomlyToInt(Math.abs(this.xVel) * game.particleMultiplier / 2); i++) {
                game.particles.push(new ColorParticle("#bbbbbb45", 1 / 4 + Math.random() / 8, 50, this.x + this.width / 2 + i / game.particleMultiplier, this.y + this.height, 0, 0, false));

            }
            //dust
            for (let i = 0; i < randomlyToInt(Math.abs(this.xVel) * game.particleMultiplier / 2); i++) {
                if(this.bottomCollision !== undefined)
                game.particles.push(new ColorParticle(this.bottomCollision.color, 1 / 8 + Math.random() / 8, 10, this.x + this.width / 2, this.y + this.height, 0.2 * -this.xVel + 0.2 * (Math.random() - 0.5), 0.2 * -Math.random(), true));
            }
        }
    }

    findInterpolatedCoordinates() {
        // this function essentially makes the character lag behind one tick, but means that it gets displayed at the maximum frame rate.
        if (this.pXVel > 0) {
            this.interpolatedX = game.min(
                this.pX + this.pXVel * game.amountSinceLastTick,
                this.x
            );
        } else {
            this.interpolatedX = game.max(
                this.pX + this.pXVel * game.amountSinceLastTick,
                this.x
            );
        }
        if (this.pYVel > 0) {
            this.interpolatedY = game.min(
                this.pY + this.pYVel * game.amountSinceLastTick,
                this.y
            );
        } else {
            this.interpolatedY = game.max(
                this.pY + this.pYVel * game.amountSinceLastTick,
                this.y
            );
        }
    }

    applyVelocityAndCollide() {
        this.topCollision = WorldTiles[TileType.Air];
        this.bottomCollision = WorldTiles[TileType.Air];
        this.pX = this.x;
        this.pY = this.y;

        this.pGrounded = this.grounded;
        this.grounded = false;

        /*
        This function assumes that the object doesn't start in collision

        Also, it takes advantage of the fact that an object can only collide once in each axis with these axis-aligned rectangles.
        That's a total of a possible two collisions, or an initial collision, and a sliding collision.
        */

        // calculate the initial collision:

        // set the closest collision to one infinitely far away.
        this.closestCollision = [1, 0, Infinity];

        let mostlyGoingHorizontally: boolean;

        // loop through all the possible tiles the physics box could be intersecting with
        for (
            let i = Math.floor(game.min(this.x, this.x + this.xVel));
            i < Math.ceil(game.max(this.x, this.x + this.xVel) + this.width);
            i++
        ) {
            for (
                let j = Math.floor(game.min(this.y, this.y + this.yVel));
                j < Math.ceil(game.max(this.y, this.y + this.yVel) + this.height);
                j++
            ) {
                // if the current tile isn't air (value 0), then continue with the collision detection
                let currentBlock: TileType | string = game.world.worldTiles[j * game.worldWidth + i];
                if (currentBlock !== TileType.Air && typeof currentBlock !== 'string') {
                    // get the data about the collision and store it in a variable
                    this.collisionData = game.rectVsRay(
                        i - this.width,
                        j - this.height,
                        this.width + 1,
                        this.height + 1,
                        this.x,
                        this.y,
                        this.xVel,
                        this.yVel
                    );
                    mostlyGoingHorizontally = Math.abs(this.xVel) > Math.abs(this.yVel);
                    if (
                        this.collisionData !== false) {//a collision happened
                        if (
                            this.closestCollision[2] > this.collisionData[2]
                        ) {
                            this.closestCollision = this.collisionData;//honestly this entire collision system is a mess but it work so so what
                            if (this.closestCollision[0] === 0) {

                                if (this.closestCollision[1] === 1) {
                                    this.topCollision = WorldTiles[currentBlock];
                                }
                                else {
                                    this.bottomCollision = WorldTiles[currentBlock];
                                }
                            }
                        } else if (this.closestCollision[2] === this.collisionData[2] && mostlyGoingHorizontally === (this.closestCollision[0] === 0)) {
                            this.closestCollision = this.collisionData;
                            if (this.closestCollision[0] === 0) {

                                if (this.closestCollision[1] === 1) {
                                    this.topCollision = WorldTiles[currentBlock];
                                }
                                else {
                                    this.bottomCollision = WorldTiles[currentBlock];
                                }
                            }
                        }

                    }
                }
            }
        }

        if (this.closestCollision[2] !== Infinity) {
            // there has been at least one collision

            // go to the point of collision (this makes it behave as if the walls are sticky, but we will later slide against the walls)
            this.x += this.xVel * this.closestCollision[2];
            this.y += this.yVel * this.closestCollision[2];
            // the collision happened either on the top or bottom
            if (this.closestCollision[0] === 0) {
                if (this.closestCollision[1] === -1) {
                    this.grounded = true;
                    // if it collided on the higher side, it must be touching the ground. (higher y is down)
                    if (!this.pGrounded) {//if it isn't grounded yet, it must be colliding with the ground for the first time, so summon particles
                        game.screenshakeAmount = Math.abs(this.yVel * 0.75);
                        for (let i = 0; i < 5 * game.particleMultiplier; i++) {
                            if(this.bottomCollision !== undefined)
                                game.particles.push(new ColorParticle(this.bottomCollision.color, 1 / 8 + Math.random() / 8, 20, this.x + this.width * Math.random(), this.y + this.height, 0.2 * (Math.random() - 0.5), 0.2 * -Math.random()));
                        }
                    }
                }
                else {
                    game.screenshakeAmount = Math.abs(this.yVel * 0.75);
                    for (let i = 0; i < 5 * game.particleMultiplier; i++) {//ceiling collision particles
                        if(this.topCollision !== undefined)
                            game.particles.push(new ColorParticle(this.topCollision.color, 1 / 8 + Math.random() / 8, 20, this.x + this.width * Math.random(), this.y, 0.2 * (Math.random() - 0.5), 0.2 * -Math.random()));
                    }
                }
                this.yVel = 0; // set the y velocity to 0 because the object has run into a wall on its top or bottom
                this.slideX = this.xVel * (1 - this.closestCollision[2]); // this is the remaining distance to slide after the collision
                this.slideY = 0; // it doesn't slide in the y direction because there's a wall \(.-.)/
            } else {
                this.xVel = 0; // set the x velocity to 0 because wall go oof
                this.slideX = 0; // it doesn't slide in the x direction because there's a wall /(._.)\
                this.slideY = this.yVel * (1 - this.closestCollision[2]); // this is the remaining distance to slide after the collision
            }

            // at this point, the object is touching its first collision, ready to slide.  The amount it wants to slide is held in the this.slideX and this.slideY variables.

            // this can be treated essentially the same as the first collision, so a lot of the code will be reused.

            // set the closest collision to one infinitely far away.
            this.closestCollision = [1, 0, Infinity];

            // loop through all the possible tiles the physics box could be intersecting with
            for (
                let i = Math.floor(game.min(this.x, this.x + this.slideX));
                i < Math.ceil(game.max(this.x, this.x + this.slideX) + this.width);
                i++
            ) {
                for (
                    let j = Math.floor(game.min(this.y, this.y + this.slideY));
                    j <
                    Math.ceil(game.max(this.y, this.y + this.slideY) + this.height);
                    j++
                ) {
                    let currentBlock: TileType | string = game.world.worldTiles[j * game.worldWidth + i];
                    // if the current tile isn't air, then continue with the collision detection
                    if (currentBlock !== TileType.Air && typeof currentBlock !== "string") {
                        // get the data about the collision and store it in a variable
                        this.collisionData = game.rectVsRay(
                            i - this.width,
                            j - this.height,
                            this.width + 1,
                            this.height + 1,
                            this.x,
                            this.y,
                            this.slideX,
                            this.slideY
                        );
                        if (
                            this.collisionData !== false &&
                            this.closestCollision[2] > this.collisionData[2]
                        ) {
                            this.closestCollision = this.collisionData;
                            if (this.closestCollision[0] === 0) {

                                if (this.closestCollision[1] === 1) {
                                    this.topCollision = WorldTiles[currentBlock];
                                }
                                else {
                                    this.bottomCollision = WorldTiles[currentBlock];
                                }
                            }
                        }
                    }
                }
            }

            // it has collided while trying to slide
            if (this.closestCollision[2] !== Infinity) {
                this.x += this.slideX * this.closestCollision[2];
                this.y += this.slideY * this.closestCollision[2];

                if (this.closestCollision[0] === 0) {
                    this.yVel = 0; // set the y velocity to 0 because the object has run into a wall on its top or bottom
                    if (this.closestCollision[1] === -1) {
                        // if it collided on the higher side, it must be touching the ground. (higher y is down)
                        this.grounded = true;

                    }
                } else {
                    this.xVel = 0; // set the x velocity to 0 because wall go oof
                }
            } else {
                // it has not collided while trying to slide
                this.x += this.slideX;
                this.y += this.slideY;
            }
        } else {
            // there has been no collision
            this.x += this.xVel;
            this.y += this.yVel;
        }

        // collide with sides of map

        if (this.x < 0) {
            this.x = 0;
            this.xVel = 0;
        } else if (this.x + this.width > game.worldWidth) {
            this.x = game.worldWidth - this.width;
            this.xVel = 0;
        }

        if (this.y < 0) {
            this.y = 0;
            this.yVel = 0;
        } else if (this.y + this.height > game.worldHeight) {
            this.y = game.worldHeight - this.height;
            this.yVel = 0;
            this.grounded = true;
        }
    }
}


function randomlyToInt(f: number) {
    if (Math.random() > f - Math.floor(f)) {
        return (Math.floor(f));
    }
    return (Math.ceil(f));
}

function axisAlignedDistance(x1: number, y1: number, x2: number, y2: number) {
    return abs(x1 - x2) + abs(y1 - y2);
}