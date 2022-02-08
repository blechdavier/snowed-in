import game from '../../Main';

class EntityBase {
    x: number;
    y: number;
    w: number;
    h: number;
    xVel: number;
    yVel: number;
    mass: number;
    controllable: boolean;
    grounded: boolean;
    collisionData: any;
    closestCollision: any;
    interpolatedX: number;
    interpolatedY: number;
    pX: number;
    pY: number;
    pXVel: number;
    pYVel: number;
    type: any;
    itemType: any;
    deleted: boolean;
    slideX: number;
    slideY: number;

    constructor(
        x: number,
        y: number,
        w: number,
        h: number,
        xVel: number,
        yVel: number,
        controllable?: boolean,
        mass = w * h
    ) {
        // generic
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.xVel = xVel;
        this.yVel = yVel;
        this.mass = mass;

        this.controllable = controllable;

        this.grounded = false;

        this.closestCollision = [1, 0, Infinity];

        this.interpolatedX = x;
        this.interpolatedY = y;

        this.pX = x - xVel;
        this.pY = y - yVel;
        this.pXVel = xVel;
        this.pYVel = yVel;

        // for items
        this.deleted = false;
    }

    applyGravityAndDrag() {
        // this function changes the object's next tick's velocity in both the x and the y directions

        this.pXVel = this.xVel;
        this.pYVel = this.yVel;

        this.xVel -=
            (game.abs(this.xVel) * this.xVel * game.DRAG_COEFFICIENT * this.w) /
            this.mass;
        this.yVel += game.GRAVITY_SPEED;
        this.yVel -=
            (game.abs(this.yVel) * this.yVel * game.DRAG_COEFFICIENT * this.h) /
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
            i < game.ceil(game.max(this.x, this.x + this.xVel) + this.w);
            i++
        ) {
            for (
                let j = game.floor(game.min(this.y, this.y + this.yVel));
                j < game.ceil(game.max(this.y, this.y + this.yVel) + this.h);
                j++
            ) {
                // if the current tile isn't air (value 0), then continue with the collision detection
                if (game.world.worldTiles[j * game.WORLD_WIDTH + i] !== 0) {
                    // get the data about the collision and store it in a variable
                    this.collisionData = game.rectVsRay(
                        i - this.w,
                        j - this.h,
                        this.w + 1,
                        this.h + 1,
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
                i < game.ceil(game.max(this.x, this.x + this.slideX) + this.w);
                i++
            ) {
                for (
                    let j = game.floor(game.min(this.y, this.y + this.slideY));
                    j <
                    game.ceil(game.max(this.y, this.y + this.slideY) + this.h);
                    j++
                ) {
                    // if the current tile isn't air (value 0), then continue with the collision detection
                    if (game.world.worldTiles[j * game.WORLD_WIDTH + i] !== 0) {
                        // get the data about the collision and store it in a variable
                        this.collisionData = game.rectVsRay(
                            i - this.w,
                            j - this.h,
                            this.w + 1,
                            this.h + 1,
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
        } else if (this.x + this.w > game.WORLD_WIDTH) {
            this.x = game.WORLD_WIDTH - this.w;
            this.xVel = 0;
        }

        if (this.y < 0) {
            this.y = 0;
            this.yVel = 0;
        } else if (this.y + this.h > game.WORLD_HEIGHT) {
            this.y = game.WORLD_HEIGHT - this.h;
            this.yVel = 0;
            this.grounded = true;
        }
    }
}

export = EntityBase;
