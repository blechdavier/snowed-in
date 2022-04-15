import p5 from 'p5';
import { ServerEntity } from '../world/entities/ServerEntity';
import { Entities, EntityPayload } from '../../global/Entity';
import { game } from '../Game';

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

    collisionData: any;
    closestCollision: [number, number, number];

    mass: number = this.width * this.height;

    constructor(data: EntityPayload<Entities.LocalPlayer>) {
        super(data.id);

        this.name = data.data.name;

        this.x = data.data.x;
        this.y = data.data.y;

        this.pX = this.x;
        this.pY = this.y;

        this.interpolatedX = this.x;
        this.interpolatedY = this.y;

        this.closestCollision = [1, 0, Infinity];
    }

    render(target: p5, upscaleSize: number): void {
        target.fill(255, 0, 0);

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
    }

    updateData(data: EntityPayload): void {
        if (data.type === Entities.Player) this.name = data.data.name;
    }

    keyboardInput() {
        this.xVel +=
            0.02 *
            (+(game.keys[68] || game.keys[39]) -
                +(game.keys[65] || game.keys[37]));
        if (
            this.grounded &&
            (game.keys[87] || game.keys[38] || game.keys[32])
        ) {
            this.yVel = -1.5;
        }
    }

    applyGravityAndDrag() {
        // this function changes the object's next tick's velocity in both the x and the y directions

        this.pXVel = this.xVel;
        this.pYVel = this.yVel;

        this.xVel -=
            (game.abs(this.xVel) *
                this.xVel *
                game.DRAG_COEFFICIENT *
                this.width) /
            this.mass;
        this.yVel += game.GRAVITY_SPEED;
        this.yVel -=
            (game.abs(this.yVel) *
                this.yVel *
                game.DRAG_COEFFICIENT *
                this.height) /
            this.mass;
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
        this.pX = this.x;
        this.pY = this.y;

        this.grounded = false;

        /*
        This function assumes that the object doesn't start in collision

        Also, it takes advantage of the fact that an object can only collide once in each axis with these axis-aligned rectangles.
        That's a total of a possible two collisions, or an initial collision, and a sliding collision.
        */

        // calculate the initial collision:

        // set the closest collision to one infinitely far away.
        this.closestCollision = [1, 0, Infinity];

        // loop through all the possible tiles the physics box could be intersecting with
        for (
            let i = game.floor(game.min(this.x, this.x + this.xVel));
            i < game.ceil(game.max(this.x, this.x + this.xVel) + this.width);
            i++
        ) {
            for (
                let j = game.floor(game.min(this.y, this.y + this.yVel));
                j <
                game.ceil(game.max(this.y, this.y + this.yVel) + this.height);
                j++
            ) {
                // if the current tile isn't air (value 0), then continue with the collision detection
                if (game.world.worldTiles[j * game.worldWidth + i] !== 0) {
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
                    if (
                        this.collisionData !== false &&
                        this.closestCollision[2] > this.collisionData[2]
                    ) {
                        this.closestCollision = this.collisionData;
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
                this.yVel = 0; // set the y velocity to 0 because the object has run into a wall on its top or bottom
                this.slideX = this.xVel * (1 - this.closestCollision[2]); // this is the remaining distance to slide after the collision
                this.slideY = 0; // it doesn't slide in the y direction because there's a wall \(.-.)/
                if (this.closestCollision[1] === -1) {
                    // if it collided on the higher side, it must be touching the ground. (higher y is down)
                    this.grounded = true;
                }
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
                let i = game.floor(game.min(this.x, this.x + this.slideX));
                i <
                game.ceil(game.max(this.x, this.x + this.slideX) + this.width);
                i++
            ) {
                for (
                    let j = game.floor(game.min(this.y, this.y + this.slideY));
                    j <
                    game.ceil(
                        game.max(this.y, this.y + this.slideY) + this.height
                    );
                    j++
                ) {
                    // if the current tile isn't air (value 0), then continue with the collision detection
                    if (game.world.worldTiles[j * game.worldWidth + i] !== 0) {
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
