/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./api/Entity.ts":
/*!***********************!*\
  !*** ./api/Entity.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Entities = void 0;
var Entities;
(function (Entities) {
    Entities[Entities["LocalPlayer"] = 0] = "LocalPlayer";
    Entities[Entities["Player"] = 1] = "Player";
    Entities[Entities["Item"] = 2] = "Item";
})(Entities = exports.Entities || (exports.Entities = {}));


/***/ }),

/***/ "./api/Tile.ts":
/*!*********************!*\
  !*** ./api/Tile.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TileType = void 0;
var TileType;
(function (TileType) {
    TileType[TileType["Air"] = 0] = "Air";
    TileType[TileType["Snow"] = 1] = "Snow";
    TileType[TileType["Ice"] = 2] = "Ice";
})(TileType = exports.TileType || (exports.TileType = {}));


/***/ }),

/***/ "./webpage/src/Game.ts":
/*!*****************************!*\
  !*** ./webpage/src/Game.ts ***!
  \*****************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const p5_1 = __importDefault(__webpack_require__(/*! p5 */ "./node_modules/p5/lib/p5.min.js"));
const Assets_1 = __webpack_require__(/*! ./assets/Assets */ "./webpage/src/assets/Assets.ts");
const MainMenu_1 = __webpack_require__(/*! ./ui/screens/MainMenu */ "./webpage/src/ui/screens/MainMenu.ts");
const PauseMenu_1 = __webpack_require__(/*! ./ui/screens/PauseMenu */ "./webpage/src/ui/screens/PauseMenu.ts");
const NetManager_1 = __webpack_require__(/*! ./websocket/NetManager */ "./webpage/src/websocket/NetManager.ts");
/*
///INFORMATION
//Starting a game
Press Live Server to start the game
or
Type npm run prestart to start the game.
//TODO
When something in the todo section, either delete it and mark what was done in the description -
- when pushing, or just mark it like this
(example: Create a nuclear explosion -- X)
///GENERAL TODO:

//Audio
sounds
music
NPC's

//Visual
Update snow textures
Update GUI textures
player character
item lore implemented

//Gameplay
finish item management
pause menu
Hunger, heat, etc system
item creation
item use
Parent Workbench

//Objects
dirt
stone
workbench
backpack (used as chest)

//Polish
better world generation
font consistency
fix cursor input lag (separate cursor and animation images)
fix stuck on side of block bug
fix collide with sides of map bug

item management behavior todo:
merge
right click stack to pick up ceil(half of it)
right click when picked up to add 1 if 0 or match
craftables

*/
class Game extends p5_1.default {
    constructor(connection) {
        super(() => { }); // To create a new instance of p5 it will call back with the instance. We don't need this since we are extending the class
        this.worldWidth = 512; // width of the world in tiles   <!> MAKE SURE THIS IS NEVER LESS THAN 64!!! <!>
        this.worldHeight = 64; // height of the world in tiles  <!> MAKE SURE THIS IS NEVER LESS THAN 64!!! <!>
        this.TILE_WIDTH = 8; // width of a tiles in pixels
        this.TILE_HEIGHT = 8; // height of a tiles in pixels
        this.BACK_TILE_WIDTH = 12; // width of a tiles in pixels
        this.BACK_TILE_HEIGHT = 12; // height of a tiles in pixels
        this.upscaleSize = 6; // number of screen pixels per texture pixels (think of this as hud scale in Minecraft)
        this.camX = 0; // position of the top left corner of the screen in un-up-scaled pixels (0 is left of world) (worldWidth*TILE_WIDTH is bottom of world)
        this.camY = 0; // position of the top left corner of the screen in un-up-scaled pixels (0 is top of world) (worldHeight*TILE_HEIGHT is bottom of world)
        this.pCamX = 0; // last frame's x of the camera
        this.pCamY = 0; // last frame's y of the camera
        this.interpolatedCamX = 0; // interpolated position of the camera
        this.interpolatedCamY = 0; // interpolated position of the camera
        // tick management
        this.msSinceTick = 0; // this is the running counter of how many milliseconds it has been since the last tick.  The game can then
        this.msPerTick = 20; // the number of milliseconds per game tick.  1000/msPerTick = ticks per second
        this.amountSinceLastTick = 0; // this is a variable calculated every frame used for interpolation - domain[0,1)
        this.forgivenessCount = 50; // if the computer needs to do more than 50 ticks in a single frame, then it could be running behind, probably because of a freeze or the user being on a different tab.  In these cases, it's probably best to just ignore that any time has passed to avoid further freezing
        // physics constants
        this.GRAVITY_SPEED = 0.04; // in units per second tick, positive means downward gravity, negative means upward gravity
        this.DRAG_COEFFICIENT = 0.21; // arbitrary number, 0 means no drag
        // array for all the items
        //items: EntityItem[] = [];
        // CHARACTER SHOULD BE ROUGHLY 12 PIXELS BY 20 PIXELS
        this.hotBar = new Array(9);
        this.selectedSlot = 0;
        this.pickedUpSlot = -1;
        this.worldMouseX = 0; // the mouse position in world coordinates
        this.worldMouseY = 0; // the mouse position in world coordinates
        this.mouseOn = true; // is the mouse on the window?
        this.keys = [];
        // the keycode for the key that does the action
        this.controls = [
            68,
            65,
            87,
            27,
            69,
            49,
            50,
            51,
            52,
            53,
            54,
            55,
            56,
            57 // hot bar 9
        ];
        this.connection = connection;
        // Initialise the network manager
        this.netManager = new NetManager_1.NetManager(this);
    }
    preload() {
        console.log('Loading assets');
        (0, Assets_1.loadAssets)(this, Assets_1.UiAssets, Assets_1.ItemsAssets, Assets_1.WorldAssets, Assets_1.Fonts);
        console.log('Asset loading completed');
        this.skyShader = this.loadShader("assets/shaders/basic.vert", "assets/shaders/sky.frag");
    }
    setup() {
        // make a canvas that fills the whole screen (a canvas is what is drawn to in p5.js, as well as lots of other JS rendering libraries)
        this.canvas = this.createCanvas(this.windowWidth, this.windowHeight);
        this.canvas.mouseOut(this.mouseExited);
        this.canvas.mouseOver(this.mouseEntered);
        this.skyLayer = this.createGraphics(this.width, this.height, "webgl");
        this.currentUi = new MainMenu_1.MainMenu(Assets_1.Fonts.title);
        // Tick
        setInterval(() => {
            if (this.world === undefined)
                return;
            this.world.tick(this);
        }, 1000 / this.netManager.playerTickRate);
        this.connection.emit('join', 'e4022d403dcc6d19d6a68ba3abfd0a60', 'player' + Math.floor(Math.random() * 1000));
        // go for a scale of <64 tiles wide screen
        this.windowResized();
        // remove texture interpolation
        this.noSmooth();
        // the highest keycode is 255, which is "Toggle Touchpad", according to keycode.info
        for (let i = 0; i < 255; i++) {
            this.keys.push(false);
        }
        // set the framerate goal to as high as possible (this will end up capping to your monitor's refresh rate with vsync.)
        this.frameRate(Infinity);
    }
    draw() {
        if (this.frameCount === 2) {
            this.skyShader.setUniform("screenDimensions", [this.skyLayer.width / this.upscaleSize, this.skyLayer.height / this.upscaleSize]);
        }
        // do the tick calculations
        this.doTicks();
        // update mouse position
        this.updateMouse();
        // update the camera's interpolation
        this.moveCamera();
        // wipe the screen with a happy little layer of light blue
        this.skyShader.setUniform("offsetCoords", [this.interpolatedCamX, this.interpolatedCamY]);
        this.skyShader.setUniform("millis", this.millis());
        this.skyLayer.shader(this.skyShader);
        // this.fill(255, 0, 0);
        this.skyLayer.rect(0, 0, this.skyLayer.width, this.skyLayer.height);
        this.image(this.skyLayer, 0, 0, this.width, this.height);
        if (this.world !== undefined)
            this.world.render(this, this.upscaleSize);
        // render the player, all items, etc.  Basically any physicsRect or particle
        this.renderEntities();
        // draw the hot bar
        this.noStroke();
        this.textAlign(this.RIGHT, this.BOTTOM);
        this.textSize(5 * this.upscaleSize);
        for (let i = 0; i < this.hotBar.length; i++) {
            if (this.selectedSlot === i) {
                Assets_1.UiAssets.ui_slot_selected.render(this, 2 * this.upscaleSize + 16 * i * this.upscaleSize, 2 * this.upscaleSize, 16 * this.upscaleSize, 16 * this.upscaleSize);
            }
            else {
                Assets_1.UiAssets.ui_slot.render(this, 2 * this.upscaleSize + 16 * i * this.upscaleSize, 2 * this.upscaleSize, 16 * this.upscaleSize, 16 * this.upscaleSize);
            }
            if (this.hotBar[i] !== undefined) {
                this.fill(0);
                if (this.pickedUpSlot === i) {
                    this.tint(255, 127);
                    this.fill(0, 127);
                }
                this.hotBar[i].texture.render(this, 6 * this.upscaleSize + 16 * i * this.upscaleSize, 6 * this.upscaleSize, 8 * this.upscaleSize, 8 * this.upscaleSize);
                this.text(this.hotBar[i].stackSize, 16 * this.upscaleSize + 16 * i * this.upscaleSize, 16 * this.upscaleSize);
                this.noTint();
            }
        }
        // draw the cursor
        this.drawCursor();
        // this.currentUi.render(this, this.upscaleSize);
        // console.timeEnd("frame");
    }
    windowResized() {
        this.resizeCanvas(this.windowWidth, this.windowHeight);
        // go for a scale of <48 tiles screen
        this.upscaleSize = Math.min(this.ceil(this.windowWidth / 48 / this.TILE_WIDTH), this.ceil(this.windowHeight / 48 / this.TILE_HEIGHT));
        this.currentUi.windowUpdate();
    }
    keyPressed() {
        this.keys[this.keyCode] = true;
        if (this.controls.includes(this.keyCode)) {
            // hot bar slots
            for (let i = 0; i < 12; i++) {
                if (this.keyCode === this.controls[i + 5]) {
                    if (this.mouseX > 2 * this.upscaleSize &&
                        this.mouseX <
                            2 * this.upscaleSize +
                                16 * this.upscaleSize * this.hotBar.length &&
                        this.mouseY > 2 * this.upscaleSize &&
                        this.mouseY < 18 * this.upscaleSize) {
                        const temp = this.hotBar[i];
                        this.hotBar[i] =
                            this.hotBar[this.floor((this.mouseX - 2 * this.upscaleSize) /
                                16 /
                                this.upscaleSize)];
                        this.hotBar[this.floor((this.mouseX - 2 * this.upscaleSize) /
                            16 /
                            this.upscaleSize)] = temp;
                    }
                    else
                        this.selectedSlot = i;
                    return;
                }
            }
            if (this.keyCode === this.controls[4]) {
                console.log('Inventory opened');
            }
            if (this.keyCode === this.controls[3]) {
                console.log("paused");
                this.currentUi = new PauseMenu_1.PauseMenu(Assets_1.Fonts.title);
                console.log(this.currentUi);
            }
        }
    }
    keyReleased() {
        this.keys[this.keyCode] = false;
    }
    // when it's dragged update the sliders
    mouseDragged() {
        if (this.currentUi !== undefined && this.currentUi.sliders !== undefined) {
            for (const i of this.currentUi.sliders) {
                i.updateSliderPosition(this.mouseX);
            }
        }
    }
    mouseMoved() {
        if (this.currentUi !== undefined && this.currentUi.buttons !== undefined) {
            for (const i of this.currentUi.buttons) {
                i.updateMouseOver(this.mouseX, this.mouseY);
            }
        }
    }
    mousePressed() {
        // image(uiSlotImage, 2*upscaleSize+16*i*upscaleSize, 2*upscaleSize, 16*upscaleSize, 16*upscaleSize);
        if (this.currentUi !== undefined) {
            this.currentUi.mousePressed();
            return; // asjgsadkjfgIISUSUEUE
        }
        if (this.mouseX > 2 * this.upscaleSize &&
            this.mouseX <
                2 * this.upscaleSize +
                    16 * this.upscaleSize * this.hotBar.length &&
            this.mouseY > 2 * this.upscaleSize &&
            this.mouseY < 18 * this.upscaleSize) {
            const clickedSlot = this.floor((this.mouseX - 2 * this.upscaleSize) / 16 / this.upscaleSize);
            if (this.pickedUpSlot === -1) {
                if (this.hotBar[clickedSlot] !== undefined) {
                    this.pickedUpSlot = clickedSlot;
                }
            }
            else {
                // Swap clicked slot with the picked slot
                [this.hotBar[this.pickedUpSlot], this.hotBar[clickedSlot]] = [
                    this.hotBar[clickedSlot],
                    this.hotBar[this.pickedUpSlot],
                ];
                // Set the picked up slot to nothing
                this.pickedUpSlot = -1;
            }
        }
        else {
            // If the tiles is air
            if (this.world.worldTiles[this.world.width * this.worldMouseY + this.worldMouseX] === 0)
                return;
            this.connection.emit('worldBreakStart', this.world.width * this.worldMouseY + this.worldMouseX);
            this.connection.emit('worldBreakFinish');
            /*
            const tiles: Tile =
                WorldTiles[
                    this.world.worldTiles[
                        this.WORLD_WIDTH * this.worldMouseY + this.worldMouseX
                    ]
                ];

            if (tiles === undefined) return;

            if (tiles.itemDrop !== undefined) {
                // Default drop quantity
                let quantity: number = 1;

                // Update the quantity based on
                if (
                    tiles.itemDropMax !== undefined &&
                    tiles.itemDropMin !== undefined
                ) {
                    quantity = Math.round(
                        Math.random() * (tiles.itemDropMax - tiles.itemDropMin) +
                            tiles.itemDropMin
                    );
                } else if (tiles.itemDropMax !== undefined) {
                    quantity = tiles.itemDropMax;
                }

                this.dropItemStack(
                    new ItemStack(tiles.itemDrop, quantity),
                    this.worldMouseX,
                    this.worldMouseY
                );
            }



            */
        }
    }
    mouseReleased() {
        if (this.currentUi !== undefined) {
            this.currentUi.mouseReleased();
        }
        const releasedSlot = this.floor((this.mouseX - 2 * this.upscaleSize) / 16 / this.upscaleSize);
        if (this.pickedUpSlot !== -1) {
            if (this.mouseX > 2 * this.upscaleSize &&
                this.mouseX <
                    2 * this.upscaleSize +
                        16 * this.upscaleSize * this.hotBar.length &&
                this.mouseY > 2 * this.upscaleSize &&
                this.mouseY < 18 * this.upscaleSize) {
                // Make sure that the slot that the cursor was released was not the slot that was selected
                if (releasedSlot === this.pickedUpSlot)
                    return;
                // Swap the picked up slot with the slot the mouse was released on
                [this.hotBar[this.pickedUpSlot], this.hotBar[releasedSlot]] = [
                    this.hotBar[releasedSlot],
                    this.hotBar[this.pickedUpSlot],
                ];
                this.pickedUpSlot = -1;
            }
            else {
                this.hotBar[this.pickedUpSlot] = undefined;
                this.pickedUpSlot = -1;
            }
        }
    }
    moveCamera() {
        this.interpolatedCamX =
            this.pCamX + (this.camX - this.pCamX) * this.amountSinceLastTick;
        this.interpolatedCamY =
            this.pCamY + (this.camY - this.pCamY) * this.amountSinceLastTick;
    }
    doTicks() {
        // increase the time since a tick has happened by deltaTime, which is a built-in p5.js value
        this.msSinceTick += this.deltaTime;
        // define a temporary variable called ticksThisFrame - this is used to keep track of how many ticks have been calculated within the duration of the current frame.  As long as this value is less than the forgivenessCount variable, it continues to calculate ticks as necessary.
        let ticksThisFrame = 0;
        while (this.msSinceTick > this.msPerTick &&
            ticksThisFrame !== this.forgivenessCount) {
            // console.time("tick");
            if (this.world !== undefined)
                this.doTick();
            // console.timeEnd("tick");
            this.msSinceTick -= this.msPerTick;
            ticksThisFrame++;
        }
        if (ticksThisFrame === this.forgivenessCount) {
            this.msSinceTick = 0;
            console.warn("lag spike detected, tick calculations couldn't keep up");
        }
        this.amountSinceLastTick = this.msSinceTick / this.msPerTick;
    }
    doTick() {
        if (this.world.player === undefined)
            return;
        this.world.player.keyboardInput();
        this.world.player.applyGravityAndDrag();
        this.world.player.applyVelocityAndCollide();
        this.pCamX = this.camX;
        this.pCamY = this.camY;
        const desiredCamX = this.world.player.x +
            this.world.player.width / 2 -
            this.width / 2 / this.TILE_WIDTH / this.upscaleSize +
            this.world.player.xVel * 40;
        const desiredCamY = this.world.player.y +
            this.world.player.height / 2 -
            this.height / 2 / this.TILE_HEIGHT / this.upscaleSize +
            this.world.player.yVel * 20;
        this.camX = (desiredCamX + this.camX * 24) / 25;
        this.camY = (desiredCamY + this.camY * 24) / 25;
        if (this.camX < 0) {
            this.camX = 0;
        }
        else if (this.camX >
            this.worldWidth - this.width / this.upscaleSize / this.TILE_WIDTH) {
            this.camX =
                this.worldWidth -
                    this.width / this.upscaleSize / this.TILE_WIDTH;
        }
        if (this.camY >
            this.worldHeight -
                this.height / this.upscaleSize / this.TILE_HEIGHT) {
            this.camY =
                this.worldHeight -
                    this.height / this.upscaleSize / this.TILE_HEIGHT;
        }
        // for (const item of this.items) {
        //     item.goTowardsPlayer();
        //     item.combineWithNearItems();
        //     item.applyGravityAndDrag();
        //     item.applyVelocityAndCollide();
        // }
        //
        // for (let i = 0; i < this.items.length; i++) {
        //     if (this.items[i].deleted === true) {
        //         this.items.splice(i, 1);
        //         i--;
        //     }
        // }
    }
    uiFrameRect(x, y, w, h) {
        // set the coords and dimensions to round to the nearest un-upscaled pixel
        x = this.round(x / this.upscaleSize) * this.upscaleSize;
        y = this.round(y / this.upscaleSize) * this.upscaleSize;
        w = this.round(w / this.upscaleSize) * this.upscaleSize;
        h = this.round(h / this.upscaleSize) * this.upscaleSize;
        // corners
        Assets_1.UiAssets.ui_frame.renderPartial(this, x, y, 7 * this.upscaleSize, 7 * this.upscaleSize, 0, 0, 7, 7);
        Assets_1.UiAssets.ui_frame.renderPartial(this, x + w - 7 * this.upscaleSize, y, 7 * this.upscaleSize, 7 * this.upscaleSize, 8, 0, 7, 7);
        Assets_1.UiAssets.ui_frame.renderPartial(this, x, y + h - 7 * this.upscaleSize, 7 * this.upscaleSize, 7 * this.upscaleSize, 0, 8, 7, 7);
        Assets_1.UiAssets.ui_frame.renderPartial(this, x + w - 7 * this.upscaleSize, y + h - 7 * this.upscaleSize, 7 * this.upscaleSize, 7 * this.upscaleSize, 8, 8, 7, 7);
        // top and bottom
        Assets_1.UiAssets.ui_frame.renderPartial(this, x + 7 * this.upscaleSize, y, w - 14 * this.upscaleSize, 7 * this.upscaleSize, 7, 0, 1, 7);
        Assets_1.UiAssets.ui_frame.renderPartial(this, x + 7 * this.upscaleSize, y + h - 7 * this.upscaleSize, w - 14 * this.upscaleSize, 7 * this.upscaleSize, 7, 8, 1, 7);
        // left and right
        Assets_1.UiAssets.ui_frame.renderPartial(this, x, y + 7 * this.upscaleSize, 7 * this.upscaleSize, h - 14 * this.upscaleSize, 0, 7, 7, 1);
        Assets_1.UiAssets.ui_frame.renderPartial(this, x + w - 7 * this.upscaleSize, y + 7 * this.upscaleSize, 7 * this.upscaleSize, h - 14 * this.upscaleSize, 8, 7, 7, 1);
        // center
        Assets_1.UiAssets.ui_frame.renderPartial(this, x + 7 * this.upscaleSize, y + 7 * this.upscaleSize, w - 14 * this.upscaleSize, h - 14 * this.upscaleSize, 7, 7, 1, 1);
    }
    /*
   /$$$$$$$  /$$                           /$$
  | $$__  $$| $$                          |__/
  | $$  \ $$| $$$$$$$  /$$   /$$  /$$$$$$$ /$$  /$$$$$$$  /$$$$$$$ /$$
  | $$$$$$$/| $$__  $$| $$  | $$ /$$_____/| $$ /$$_____/ /$$_____/|__/
  | $$____/ | $$  \ $$| $$  | $$|  $$$$$$ | $$| $$      |  $$$$$$
  | $$      | $$  | $$| $$  | $$ \____  $$| $$| $$       \____  $$ /$$
  | $$      | $$  | $$|  $$$$$$$ /$$$$$$$/| $$|  $$$$$$$ /$$$$$$$/|__/
  |__/      |__/  |__/ \____  $$|_______/ |__/ \_______/|_______/
                       /$$  | $$
                      |  $$$$$$/
                       \______/
  */
    // this class holds an axis-aligned rectangle affected by gravity, drag, and collisions with tiles.
    rectVsRay(rectX, rectY, rectW, rectH, rayX, rayY, rayW, rayH) {
        // this ray is actually a line segment mathematically, but it's common to see people refer to similar checks as ray-casts, so for the duration of the definition of this function, ray can be assumed to mean the same as line segment.
        // if the ray doesn't have a length, then it can't have entered the rectangle.  This assumes that the objects don't start in collision, otherwise they'll behave strangely
        if (rayW === 0 && rayH === 0) {
            return false;
        }
        // calculate how far along the ray each side of the rectangle intersects with it (each side is extended out infinitely in both directions)
        const topIntersection = (rectY - rayY) / rayH;
        const bottomIntersection = (rectY + rectH - rayY) / rayH;
        const leftIntersection = (rectX - rayX) / rayW;
        const rightIntersection = (rectX + rectW - rayX) / rayW;
        if (isNaN(topIntersection) ||
            isNaN(bottomIntersection) ||
            isNaN(leftIntersection) ||
            isNaN(rightIntersection)) {
            // you have to use the JS function isNaN() to check if a value is NaN because both NaN==NaN and NaN===NaN are false.
            // if any of these values are NaN, no collision has occurred
            return false;
        }
        // calculate the nearest and farthest intersections for both x and y
        const nearX = this.min(leftIntersection, rightIntersection);
        const farX = this.max(leftIntersection, rightIntersection);
        const nearY = this.min(topIntersection, bottomIntersection);
        const farY = this.max(topIntersection, bottomIntersection);
        if (nearX > farY || nearY > farX) {
            // this must mean that the line that makes up the line segment doesn't pass through the ray
            return false;
        }
        if (farX < 0 || farY < 0) {
            // the intersection is happening before the ray starts, so the ray is pointing away from the triangle
            return false;
        }
        // calculate where the potential collision could be
        const nearCollisionPoint = this.max(nearX, nearY);
        if (nearX > 1 || nearY > 1) {
            // the intersection happens after the ray(line segment) ends
            return false;
        }
        if (nearX === nearCollisionPoint) {
            // it must have collided on either the left or the right! now which?
            if (leftIntersection === nearX) {
                // It must have collided on the left!  Return the collision normal [-1, 0]
                return [-1, 0, nearCollisionPoint];
            }
            // If it didn't collide on the left, it must have collided on the right.  Return the collision normal [1, 0]
            return [1, 0, nearCollisionPoint];
        }
        // If it didn't collide on the left or right, it must have collided on either the top or the bottom! now which?
        if (topIntersection === nearY) {
            // It must have collided on the top!  Return the collision normal [0, -1]
            return [0, -1, nearCollisionPoint];
        }
        // If it didn't collide on the top, it must have collided on the bottom.  Return the collision normal [0, 1]
        return [0, 1, nearCollisionPoint];
        // output if no collision: false
        // output if collision: [collision normal X, collision normal Y, nearCollisionPoint]
        //                         -1 to 1              -1 to 1            0 to 1
    }
    renderEntities() {
        // draw player
        // this.fill(255, 0, 0);
        // this.noStroke();
        // this.rect(
        //     (this.world.player.interpolatedX * this.TILE_WIDTH -
        //         this.interpolatedCamX * this.TILE_WIDTH) *
        //         this.upscaleSize,
        //     (this.world.player.interpolatedY * this.TILE_HEIGHT -
        //         this.interpolatedCamY * this.TILE_HEIGHT) *
        //         this.upscaleSize,
        //     this.world.player.width * this.upscaleSize * this.TILE_WIDTH,
        //     this.world.player.height * this.upscaleSize * this.TILE_HEIGHT
        // );
        // for (const item of this.items) {
        //     item.findInterpolatedCoordinates();
        //
        //     item.itemStack.texture.render(
        //         this,
        //         (item.interpolatedX * this.TILE_WIDTH -
        //             this.interpolatedCamX * this.TILE_WIDTH) *
        //             this.upscaleSize,
        //         (item.interpolatedY * this.TILE_HEIGHT -
        //             this.interpolatedCamY * this.TILE_HEIGHT) *
        //             this.upscaleSize,
        //         item.w * this.upscaleSize * this.TILE_WIDTH,
        //         item.h * this.upscaleSize * this.TILE_HEIGHT
        //     );
        //
        //     // Render the item quantity label
        //     this.fill(0);
        //
        //     this.noStroke();
        //
        //     this.textAlign(this.RIGHT, this.BOTTOM);
        //     this.textSize(5 * this.upscaleSize);
        //
        //     this.text(
        //         item.itemStack.stackSize,
        //         (item.interpolatedX * this.TILE_WIDTH -
        //             this.interpolatedCamX * this.TILE_WIDTH) *
        //             this.upscaleSize,
        //         (item.interpolatedY * this.TILE_HEIGHT -
        //             this.interpolatedCamY * this.TILE_HEIGHT) *
        //             this.upscaleSize
        //     );
        // }
    }
    pickUpItem(itemStack) {
        for (let i = 0; i < this.hotBar.length; i++) {
            const item = this.hotBar[i];
            // If there are no items in the current slot of the hotBar
            if (item === undefined) {
                this.hotBar[i] = itemStack;
                return true;
            }
            if (item === itemStack &&
                item.stackSize < item.maxStackSize) {
                const remainingSpace = item.maxStackSize - item.stackSize;
                // Top off the stack with items if it can take more than the stack being added
                if (remainingSpace >= itemStack.stackSize) {
                    this.hotBar[i].stackSize =
                        item.stackSize + itemStack.stackSize;
                    return true;
                }
                itemStack.stackSize -= remainingSpace;
                this.hotBar[i].stackSize = itemStack.maxStackSize;
            }
        }
        console.error(`Could not pickup ${itemStack.stackSize} ${itemStack.name}`);
        return false;
    }
    mouseExited() {
        this.mouseOn = false;
    }
    mouseEntered() {
        this.mouseOn = true;
    }
    updateMouse() {
        // world mouse x and y variables hold the mouse position in world tiles.  0, 0 is top left
        this.worldMouseX = this.floor((this.interpolatedCamX * this.TILE_WIDTH +
            this.mouseX / this.upscaleSize) /
            this.TILE_WIDTH);
        this.worldMouseY = this.floor((this.interpolatedCamY * this.TILE_HEIGHT +
            this.mouseY / this.upscaleSize) /
            this.TILE_HEIGHT);
    }
    drawCursor() {
        if (this.mouseOn) {
            if (this.pickedUpSlot > -1) {
                this.hotBar[this.pickedUpSlot].texture.render(this, this.mouseX, this.mouseY, 8 * this.upscaleSize, 8 * this.upscaleSize);
                this.text(this.hotBar[this.pickedUpSlot].stackSize, this.mouseX + 10 * this.upscaleSize, this.mouseY + 10 * this.upscaleSize);
            }
        }
    }
}
module.exports = Game;


/***/ }),

/***/ "./webpage/src/Main.ts":
/*!*****************************!*\
  !*** ./webpage/src/Main.ts ***!
  \*****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Game_1 = __importDefault(__webpack_require__(/*! ./Game */ "./webpage/src/Game.ts"));
const socket_io_client_1 = __webpack_require__(/*! socket.io-client */ "./node_modules/socket.io-client/build/cjs/index.js");
// Connect the server
const connection = (0, socket_io_client_1.io)({ auth: { token: window.localStorage.getItem('token') } });
exports["default"] = new Game_1.default(connection);


/***/ }),

/***/ "./webpage/src/assets/Assets.ts":
/*!**************************************!*\
  !*** ./webpage/src/assets/Assets.ts ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.loadAssets = exports.Fonts = exports.WorldAssets = exports.ItemsAssets = exports.UiAssets = exports.AudioAssets = void 0;
const TileResource_1 = __importDefault(__webpack_require__(/*! ./resources/TileResource */ "./webpage/src/assets/resources/TileResource.ts"));
const ImageResource_1 = __importDefault(__webpack_require__(/*! ./resources/ImageResource */ "./webpage/src/assets/resources/ImageResource.ts"));
const FontResource_1 = __importDefault(__webpack_require__(/*! ./resources/FontResource */ "./webpage/src/assets/resources/FontResource.ts"));
const Resource_1 = __importDefault(__webpack_require__(/*! ./resources/Resource */ "./webpage/src/assets/resources/Resource.ts"));
const AudioResourceGroup_1 = __importDefault(__webpack_require__(/*! ./resources/AudioResourceGroup */ "./webpage/src/assets/resources/AudioResourceGroup.ts"));
const AudioResource_1 = __importDefault(__webpack_require__(/*! ./resources/AudioResource */ "./webpage/src/assets/resources/AudioResource.ts"));
// Ui related assets
const UiAssets = {
    ui_slot_selected: new ImageResource_1.default('assets/textures/ui/uislot_selected.png'),
    ui_slot: new ImageResource_1.default('assets/textures/ui/uislot.png'),
    ui_frame: new ImageResource_1.default('assets/textures/ui/uiframe.png'),
    button_unselected: new ImageResource_1.default('assets/textures/ui/button0.png'),
    button_selected: new ImageResource_1.default('assets/textures/ui/button1.png'),
    slider_bar: new ImageResource_1.default('assets/textures/ui/sliderBar.png'),
    slider_handle: new ImageResource_1.default('assets/textures/ui/sliderHandle.png'),
    title_image: new ImageResource_1.default('assets/textures/ui/snowedinBUMP.png')
};
exports.UiAssets = UiAssets;
// Item related assets
const ItemsAssets = {
    resources: {
        ice_shard: new ImageResource_1.default('assets/textures/items/resource_ice_shards.png'),
        snowball: new ImageResource_1.default('assets/textures/items/resource_snowball.png'),
    },
    consumables: {
        snow_berries: new ImageResource_1.default('assets/textures/items/consumable_snow_berries.png'),
    },
    blocks: {
        ice: new ImageResource_1.default('assets/textures/items/block_ice.png'),
        snow: new ImageResource_1.default('assets/textures/items/block_snow.png'),
    },
    tools: {},
};
exports.ItemsAssets = ItemsAssets;
// World related assets
const WorldAssets = {
    background: {
        snow: new ImageResource_1.default('assets/textures/world/background/snow.png'),
    },
    middleground: {
        tileset_ice: new TileResource_1.default('assets/textures/world/middleground/tileset_ice.png', 16, 1, 8, 8),
        tileset_snow: new TileResource_1.default('assets/textures/world/middleground/tileset_snow.png', 16, 1, 8, 8),
        tileset_dirt: new TileResource_1.default('assets/textures/world/middleground/tileset_snow.png', 16, 1, 8, 8),
    },
    foreground: {
        tileset_pipe: new TileResource_1.default('assets/textures/world/foreground/tileset_pipe.png', 16, 1, 8, 8),
    },
};
exports.WorldAssets = WorldAssets;
const Fonts = {
    title: new FontResource_1.default('assets/textures/ui/font.png', {
        "0": 7,
        "1": 7,
        "2": 7,
        "3": 6,
        "4": 6,
        "5": 6,
        "6": 6,
        "7": 7,
        "8": 7,
        "9": 6,
        "A": 6,
        "B": 7,
        "C": 7,
        "D": 6,
        "E": 7,
        "F": 6,
        "G": 7,
        "H": 7,
        "I": 7,
        "J": 8,
        "K": 6,
        "L": 6,
        "M": 8,
        "N": 8,
        "O": 8,
        "P": 9,
        "Q": 8,
        "R": 7,
        "S": 7,
        "T": 8,
        "U": 8,
        "V": 8,
        "W": 10,
        "X": 8,
        "Y": 8,
        "Z": 9,
        "a": 7,
        "b": 7,
        "c": 6,
        "d": 7,
        "e": 6,
        "f": 6,
        "g": 6,
        "h": 6,
        "i": 5,
        "j": 6,
        "k": 5,
        "l": 5,
        "m": 8,
        "n": 5,
        "o": 5,
        "p": 5,
        "q": 7,
        "r": 5,
        "s": 4,
        "t": 5,
        "u": 5,
        "v": 5,
        "w": 7,
        "x": 6,
        "y": 5,
        "z": 5,
        "!": 4,
        ".": 2,
        ",": 2,
        "?": 6,
        "_": 6,
        "-": 4,
        ":": 2,
        " ": 2
    }, "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!.,?_-: "),
};
exports.Fonts = Fonts;
const AudioAssets = {
    ui: {
        inventoryClack: new AudioResourceGroup_1.default([new AudioResource_1.default('assets/sounds/clack1.mp3'), new AudioResource_1.default('assets/sounds/clack3.mp3'), new AudioResource_1.default('assets/sounds/clack3.mp3')])
    }
};
exports.AudioAssets = AudioAssets;
const loadAssets = (sketch, ...assets) => {
    assets.forEach((assetGroup) => {
        searchGroup(assetGroup, sketch);
    });
};
exports.loadAssets = loadAssets;
function searchGroup(assetGroup, sketch) {
    if (assetGroup instanceof Resource_1.default) {
        console.log(`Loading asset ${assetGroup.path}`);
        assetGroup.loadResource(sketch);
        return;
    }
    Object.entries(assetGroup).forEach((asset) => {
        searchGroup(asset[1], sketch);
    });
}


/***/ }),

/***/ "./webpage/src/assets/resources/AudioResource.ts":
/*!*******************************************************!*\
  !*** ./webpage/src/assets/resources/AudioResource.ts ***!
  \*******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Resource_1 = __importDefault(__webpack_require__(/*! ./Resource */ "./webpage/src/assets/resources/Resource.ts"));
const ts_audio_1 = __importDefault(__webpack_require__(/*! ts-audio */ "./node_modules/ts-audio/dist/ts-audio.esm.js"));
class AudioResource extends Resource_1.default {
    constructor(path) {
        super(path);
    }
    loadResource(game) {
        this.sound = (0, ts_audio_1.default)({
            file: this.path,
            loop: false,
            volume: 1.0,
        });
    }
    // playRandom() {
    //     // Verify that the sound has been loaded
    //     if (this.sound === undefined)
    //         throw new Error(
    //             `Tried to play sound before loading it: ${this.path}`
    //         );
    //     this.sound.play();
    // }
    play() {
        if (this.sound === undefined)
            throw new Error(`Tried to play sound before loading it: ${this.path}`);
        this.sound.stop();
        this.sound.play();
    }
}
module.exports = AudioResource;


/***/ }),

/***/ "./webpage/src/assets/resources/AudioResourceGroup.ts":
/*!************************************************************!*\
  !*** ./webpage/src/assets/resources/AudioResourceGroup.ts ***!
  \************************************************************/
/***/ ((module) => {


class AudioResourceGroup {
    constructor(sounds) {
        this.sounds = sounds;
    }
    playRandom() {
        if (this.sounds === undefined || this.sounds.length === 0)
            throw new Error(`There are no sounds: ${this.sounds}`);
        const r = Math.floor(Math.random() * this.sounds.length);
        this.sounds[r].play(); // play a random sound from the array at a slightly randomized pitch, leading to the effect of it making a new sound each time, removing repetitiveness
    }
}
module.exports = AudioResourceGroup;


/***/ }),

/***/ "./webpage/src/assets/resources/FontResource.ts":
/*!******************************************************!*\
  !*** ./webpage/src/assets/resources/FontResource.ts ***!
  \******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const ImageResource_1 = __importDefault(__webpack_require__(/*! ./ImageResource */ "./webpage/src/assets/resources/ImageResource.ts"));
const Main_1 = __importDefault(__webpack_require__(/*! ../../Main */ "./webpage/src/Main.ts"));
class FontResource extends ImageResource_1.default {
    constructor(path, characterData, characterOrder) {
        super(path);
        this.alphabet_soup = {};
        let runningTotal = 0;
        for (let i = 0; i < characterOrder.length; i++) {
            this.alphabet_soup[characterOrder[i]] = { x: runningTotal, y: 0, w: characterData[characterOrder[i]], h: 12 };
            runningTotal += characterData[characterOrder[i]] + 1;
            // console.log(characterOrder[i]+": "+characterData[characterOrder[i]]);
        }
    }
    drawText(target, str, x, y) {
        let xOffset = 0;
        for (let i = 0; i < str.length; i++) {
            this.renderPartial(target, x + xOffset * Main_1.default.upscaleSize, y, this.alphabet_soup[str[i]].w * Main_1.default.upscaleSize, this.alphabet_soup[str[i]].h * Main_1.default.upscaleSize, this.alphabet_soup[str[i]].x, this.alphabet_soup[str[i]].y, this.alphabet_soup[str[i]].w, this.alphabet_soup[str[i]].h);
            xOffset += this.alphabet_soup[str[i]].w + 1;
        }
    }
}
module.exports = FontResource;


/***/ }),

/***/ "./webpage/src/assets/resources/ImageResource.ts":
/*!*******************************************************!*\
  !*** ./webpage/src/assets/resources/ImageResource.ts ***!
  \*******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Resource_1 = __importDefault(__webpack_require__(/*! ./Resource */ "./webpage/src/assets/resources/Resource.ts"));
class ImageResource extends Resource_1.default {
    constructor(path) {
        super(path);
    }
    loadResource(game) {
        this.image = game.loadImage(this.path);
    }
    render(target, x, y, width, height) {
        // Verify that the tiles has been loaded
        if (this.image === undefined)
            throw new Error(`Tried to render image before loading it: ${this.path}`);
        // Draw non tiles image
        target.image(this.image, x, y, width, height);
    }
    renderPartial(target, x, y, width, height, sourceX, sourceY, sourceWidth, sourceHeight) {
        // Verify that the tiles has been loaded
        if (this.image === undefined)
            throw new Error(`Tried to render image before loading it: ${this.path}`);
        // Draw a partial part of the image
        target.image(this.image, x, y, width, height, sourceX, sourceY, sourceWidth, sourceHeight);
    }
}
module.exports = ImageResource;


/***/ }),

/***/ "./webpage/src/assets/resources/Resource.ts":
/*!**************************************************!*\
  !*** ./webpage/src/assets/resources/Resource.ts ***!
  \**************************************************/
/***/ ((module) => {


class Resource {
    constructor(path) {
        this.path = path;
    }
}
module.exports = Resource;


/***/ }),

/***/ "./webpage/src/assets/resources/TileResource.ts":
/*!******************************************************!*\
  !*** ./webpage/src/assets/resources/TileResource.ts ***!
  \******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const ImageResource_1 = __importDefault(__webpack_require__(/*! ./ImageResource */ "./webpage/src/assets/resources/ImageResource.ts"));
class TileResource extends ImageResource_1.default {
    constructor(path, width, height, tileWidth, tileHeight) {
        super(path);
        this.width = width;
        this.height = height;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
    }
    renderTile(i, target, x, y, width, height) {
        const tileSetX = i % this.width;
        const tileSetY = Math.floor(i / this.width);
        // Make sure the tiles isn't out of bounds
        if (tileSetY > this.height)
            throw new Error(`Out of bounds tile. Tried to render tile index ${i} with a maximum of ${this.width * this.height} tiles`);
        super.renderPartial(target, x, y, width, height, tileSetX * this.tileWidth, tileSetY * this.tileHeight, this.tileWidth, this.tileHeight);
    }
    getTileAtCoordinate(x, y, target, xPos, yPos, width, height) {
        if (x > this.width || y > this.height || x < 0 || y < 0)
            throw new Error(`Out of bounds tile. Tried to load tile at ${x}, ${y} on a ${this.width}, ${this.height} grid`);
        super.renderPartial(target, xPos, yPos, width, height, x * this.tileWidth, y * this.tileHeight, this.tileWidth, this.tileHeight);
    }
}
module.exports = TileResource;


/***/ }),

/***/ "./webpage/src/ui/Button.ts":
/*!**********************************!*\
  !*** ./webpage/src/ui/Button.ts ***!
  \**********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


const Assets_1 = __webpack_require__(/*! ../assets/Assets */ "./webpage/src/assets/Assets.ts");
class Button {
    constructor(font, txt, description, x, y, w, h, onPressedCustom) {
        this.font = font;
        this.txt = txt;
        this.description = description;
        this.onPressedCustom = onPressedCustom;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.image = Assets_1.UiAssets.button_unselected;
        this.mouseIsOver = false;
    }
    render(target, upscaleSize) {
        // set the coords and dimensions to round to the nearest un-upscaled pixel
        const x = Math.round(this.x / upscaleSize) * upscaleSize;
        const y = Math.round(this.y / upscaleSize) * upscaleSize;
        const w = Math.round(this.w / upscaleSize) * upscaleSize;
        const h = Math.round(this.h / upscaleSize) * upscaleSize;
        // corners
        this.image.renderPartial(target, x, y, 7 * upscaleSize, 7 * upscaleSize, 0, 0, 7, 7);
        this.image.renderPartial(target, x + w - 7 * upscaleSize, y, 7 * upscaleSize, 7 * upscaleSize, 8, 0, 7, 7);
        this.image.renderPartial(target, x, y + h - 7 * upscaleSize, 7 * upscaleSize, 7 * upscaleSize, 0, 8, 7, 7);
        this.image.renderPartial(target, x + w - 7 * upscaleSize, y + h - 7 * upscaleSize, 7 * upscaleSize, 7 * upscaleSize, 8, 8, 7, 7);
        // top and bottom
        this.image.renderPartial(target, x + 7 * upscaleSize, y, w - 14 * upscaleSize, 7 * upscaleSize, 7, 0, 1, 7);
        this.image.renderPartial(target, x + 7 * upscaleSize, y + h - 7 * upscaleSize, w - 14 * upscaleSize, 7 * upscaleSize, 7, 8, 1, 7);
        // left and right
        this.image.renderPartial(target, x, y + 7 * upscaleSize, 7 * upscaleSize, h - 14 * upscaleSize, 0, 7, 7, 1);
        this.image.renderPartial(target, x + w - 7 * upscaleSize, y + 7 * upscaleSize, 7 * upscaleSize, h - 14 * upscaleSize, 8, 7, 7, 1);
        // center
        this.image.renderPartial(target, x + 7 * upscaleSize, y + 7 * upscaleSize, w - 14 * upscaleSize, h - 14 * upscaleSize, 7, 7, 1, 1);
        this.font.drawText(target, this.txt, x + 6 * upscaleSize, Math.round((this.y + this.h / 2) / upscaleSize) * upscaleSize - 6 * upscaleSize);
    }
    updateMouseOver(mouseX, mouseY) {
        // if the mouse position is inside the button, return true
        if (mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h) {
            this.mouseIsOver = true;
            this.image = Assets_1.UiAssets.button_selected;
        }
        else {
            this.mouseIsOver = false;
            this.image = Assets_1.UiAssets.button_unselected;
        }
    }
    onPressed() {
        this.onPressedCustom();
        console.log("button pressed");
        Assets_1.AudioAssets.ui.inventoryClack.playRandom();
    }
}
module.exports = Button;


/***/ }),

/***/ "./webpage/src/ui/Slider.ts":
/*!**********************************!*\
  !*** ./webpage/src/ui/Slider.ts ***!
  \**********************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Assets_1 = __webpack_require__(/*! ../assets/Assets */ "./webpage/src/assets/Assets.ts");
const Main_1 = __importDefault(__webpack_require__(/*! ../Main */ "./webpage/src/Main.ts"));
class Slider {
    constructor(font, txt, value, min, max, step, x, y, w, h, onChanged) {
        this.value = value;
        this.min = min;
        this.max = max;
        this.step = step;
        this.onChanged = onChanged;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.beingEdited = false;
    }
    render(target, upscaleSize) {
        // set the coords and dimensions to round to the nearest un-upscaled pixel
        const x = Math.round(this.x / upscaleSize) * upscaleSize;
        const y = Math.round((this.y + this.h / 2) / upscaleSize) * upscaleSize;
        const w = Math.round(this.w / upscaleSize) * upscaleSize;
        // left side of slider bar
        Assets_1.UiAssets.slider_bar.renderPartial(target, x, y - 2 * upscaleSize, 2 * upscaleSize, 4 * upscaleSize, 0, 0, 2, 4);
        // right side of slider bar
        Assets_1.UiAssets.slider_bar.renderPartial(target, x + w - 2 * upscaleSize, y - 2 * upscaleSize, 2 * upscaleSize, 4 * upscaleSize, 3, 0, 2, 4);
        // center of slider bar
        Assets_1.UiAssets.slider_bar.renderPartial(target, x + 2 * upscaleSize, y - 2 * upscaleSize, w - 4 * upscaleSize, 4 * upscaleSize, 2, 0, 1, 4);
        // handle
        Assets_1.UiAssets.slider_handle.render(target, x + Math.round((this.value - this.min) / (this.max - this.min) * (w - 8 * upscaleSize) / upscaleSize) * upscaleSize, y - 4 * upscaleSize, 8 * upscaleSize, 9 * upscaleSize);
    }
    updateSliderPosition(mouseX) {
        if (this.beingEdited) {
            this.value = Math.max(this.min, Math.min(this.max, Math.round((this.min + (this.max - this.min) * (((mouseX - this.x - 4 * Main_1.default.upscaleSize) / (this.w - (8 * Main_1.default.upscaleSize))))) / this.step) * this.step));
            this.onChanged();
        }
    }
}
module.exports = Slider;


/***/ }),

/***/ "./webpage/src/ui/UiFrame.ts":
/*!***********************************!*\
  !*** ./webpage/src/ui/UiFrame.ts ***!
  \***********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


const Assets_1 = __webpack_require__(/*! ../assets/Assets */ "./webpage/src/assets/Assets.ts");
class UiFrame {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    render(target, upscaleSize) {
        // set the coords and dimensions to round to the nearest un-upscaled pixel
        const x = Math.round(this.x / upscaleSize) * upscaleSize;
        const y = Math.round(this.y / upscaleSize) * upscaleSize;
        const w = Math.round(this.w / upscaleSize) * upscaleSize;
        const h = Math.round(this.h / upscaleSize) * upscaleSize;
        // corners
        Assets_1.UiAssets.ui_frame.renderPartial(target, x, y, 7 * upscaleSize, 7 * upscaleSize, 0, 0, 7, 7);
        Assets_1.UiAssets.ui_frame.renderPartial(target, x + w - 7 * upscaleSize, y, 7 * upscaleSize, 7 * upscaleSize, 8, 0, 7, 7);
        Assets_1.UiAssets.ui_frame.renderPartial(target, x, y + h - 7 * upscaleSize, 7 * upscaleSize, 7 * upscaleSize, 0, 8, 7, 7);
        Assets_1.UiAssets.ui_frame.renderPartial(target, x + w - 7 * upscaleSize, y + h - 7 * upscaleSize, 7 * upscaleSize, 7 * upscaleSize, 8, 8, 7, 7);
        // top and bottom
        Assets_1.UiAssets.ui_frame.renderPartial(target, x + 7 * upscaleSize, y, w - 14 * upscaleSize, 7 * upscaleSize, 7, 0, 1, 7);
        Assets_1.UiAssets.ui_frame.renderPartial(target, x + 7 * upscaleSize, y + h - 7 * upscaleSize, w - 14 * upscaleSize, 7 * upscaleSize, 7, 8, 1, 7);
        // left and right
        Assets_1.UiAssets.ui_frame.renderPartial(target, x, y + 7 * upscaleSize, 7 * upscaleSize, h - 14 * upscaleSize, 0, 7, 7, 1);
        Assets_1.UiAssets.ui_frame.renderPartial(target, x + w - 7 * upscaleSize, y + 7 * upscaleSize, 7 * upscaleSize, h - 14 * upscaleSize, 8, 7, 7, 1);
        // center
        Assets_1.UiAssets.ui_frame.renderPartial(target, x + 7 * upscaleSize, y + 7 * upscaleSize, w - 14 * upscaleSize, h - 14 * upscaleSize, 7, 7, 1, 1);
    }
}
module.exports = UiFrame;


/***/ }),

/***/ "./webpage/src/ui/UiScreen.ts":
/*!************************************!*\
  !*** ./webpage/src/ui/UiScreen.ts ***!
  \************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Main_1 = __importDefault(__webpack_require__(/*! ../Main */ "./webpage/src/Main.ts"));
class UiScreen {
    mousePressed() {
        if (this.buttons !== undefined) {
            // loop through all the buttons in this menu and if the mouse is over them, then call the button's onPressed() function.  The onPressed() function is passed in through the constructor.
            this.buttons.forEach(button => {
                if (button.mouseIsOver) {
                    button.onPressed();
                }
            });
        }
        if (this.sliders !== undefined) {
            // loop through all the sliders and interact with them accordingly
            for (const i of this.sliders) {
                i.updateSliderPosition(Main_1.default.mouseX);
                if (Main_1.default.mouseX > i.x && Main_1.default.mouseX < i.x + i.w && Main_1.default.mouseY > i.y && Main_1.default.mouseY < i.y + i.h)
                    i.beingEdited = true;
            }
        }
    }
    mouseReleased() {
        if (this.sliders !== undefined) {
            // loop through all the sliders and interact with them accordingly
            for (const i of this.sliders) {
                i.beingEdited = false;
            }
        }
    }
}
module.exports = UiScreen;


/***/ }),

/***/ "./webpage/src/ui/screens/MainMenu.ts":
/*!********************************************!*\
  !*** ./webpage/src/ui/screens/MainMenu.ts ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MainMenu = void 0;
const UiScreen_1 = __importDefault(__webpack_require__(/*! ../UiScreen */ "./webpage/src/ui/UiScreen.ts"));
const UiFrame_1 = __importDefault(__webpack_require__(/*! ../UiFrame */ "./webpage/src/ui/UiFrame.ts"));
const Main_1 = __importDefault(__webpack_require__(/*! ../../Main */ "./webpage/src/Main.ts"));
const Button_1 = __importDefault(__webpack_require__(/*! ../Button */ "./webpage/src/ui/Button.ts"));
const OptionsMenu_1 = __webpack_require__(/*! ./OptionsMenu */ "./webpage/src/ui/screens/OptionsMenu.ts");
const Assets_1 = __webpack_require__(/*! ../../assets/Assets */ "./webpage/src/assets/Assets.ts");
const WorldCreationMenu_1 = __webpack_require__(/*! ./WorldCreationMenu */ "./webpage/src/ui/screens/WorldCreationMenu.ts");
class MainMenu extends UiScreen_1.default {
    constructor(font) {
        super();
        // make the frame with some default values.  These will later be changed to fit the screen size.
        this.frame = new UiFrame_1.default(0, 0, 0, 0);
        // make 4 buttons with default positions
        this.buttons = [
            new Button_1.default(font, "Resume Game", "Keep playing where you left off.", 0, 0, 0, 0, () => {
                console.log("resume game");
                Main_1.default.currentUi = undefined;
            }),
            new Button_1.default(font, "New Game", "Creates a new server that your friends can join.", 0, 0, 0, 0, () => {
                console.log("new game");
                Main_1.default.currentUi = new WorldCreationMenu_1.WorldCreationMenu(font);
            }),
            new Button_1.default(font, "Join Game", "Join a game with your friends, or make new ones.", 0, 0, 0, 0, () => {
                console.log("join game");
                Main_1.default.currentUi = undefined;
            }),
            new Button_1.default(font, "Options", "Change your keybinds, reduce lag, etc.", 0, 0, 0, 0, () => {
                console.log("options");
                Main_1.default.currentUi = new OptionsMenu_1.OptionsMenu(font);
            })
        ];
        // update the size of the elements based on the initial screen size
        this.windowUpdate();
    }
    render(target, upscaleSize) {
        // render the rectangular image that the whole menu is on
        this.frame.render(target, upscaleSize);
        Assets_1.UiAssets.title_image.render(target, Math.round(this.frame.x / upscaleSize + 1) * upscaleSize, Math.round(this.frame.y / upscaleSize + 4) * upscaleSize, 256 * upscaleSize, 40 * upscaleSize);
        // loop through the buttons array and render each one.
        for (const item of this.buttons) {
            item.render(target, upscaleSize);
        }
    }
    windowUpdate() {
        // set the position of the frame
        this.frame.x = Main_1.default.width / 2 - 264 / 2 * Main_1.default.upscaleSize; // center the frame in the middle of the screen
        this.frame.y = Main_1.default.height / 2 - 56 * Main_1.default.upscaleSize;
        this.frame.w = 264 * Main_1.default.upscaleSize;
        this.frame.h = 48 * Main_1.default.upscaleSize;
        // set the positions of all the buttons
        for (let i = 0; i < 4; i++) {
            this.buttons[i].x = Main_1.default.width / 2 - 192 / 2 * Main_1.default.upscaleSize;
            this.buttons[i].y = Main_1.default.height / 2 + 20 * i * Main_1.default.upscaleSize;
            this.buttons[i].w = 192 * Main_1.default.upscaleSize;
            this.buttons[i].h = 16 * Main_1.default.upscaleSize;
            this.buttons[i].updateMouseOver(Main_1.default.mouseX, Main_1.default.mouseY);
        }
    }
}
exports.MainMenu = MainMenu;


/***/ }),

/***/ "./webpage/src/ui/screens/OptionsMenu.ts":
/*!***********************************************!*\
  !*** ./webpage/src/ui/screens/OptionsMenu.ts ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OptionsMenu = void 0;
const UiScreen_1 = __importDefault(__webpack_require__(/*! ../UiScreen */ "./webpage/src/ui/UiScreen.ts"));
const UiFrame_1 = __importDefault(__webpack_require__(/*! ../UiFrame */ "./webpage/src/ui/UiFrame.ts"));
const Main_1 = __importDefault(__webpack_require__(/*! ../../Main */ "./webpage/src/Main.ts"));
const Button_1 = __importDefault(__webpack_require__(/*! ../Button */ "./webpage/src/ui/Button.ts"));
const MainMenu_1 = __webpack_require__(/*! ./MainMenu */ "./webpage/src/ui/screens/MainMenu.ts");
class OptionsMenu extends UiScreen_1.default {
    constructor(font) {
        super();
        // make the frame with some default values.  These will later be changed to fit the screen size.
        this.frame = new UiFrame_1.default(0, 0, 0, 0);
        // make some buttons with default positions
        this.buttons = [
            new Button_1.default(font, "Video Settings", "Change the balance between performance and fidelity.", 0, 0, 0, 0, () => {
                console.log("video settings");
                Main_1.default.currentUi = undefined;
            }),
            new Button_1.default(font, "Controls", "Change your keybinds.", 0, 0, 0, 0, () => {
                console.log("control menu");
                Main_1.default.currentUi = undefined;
            }),
            new Button_1.default(font, "Audio Settings", "Change the volume of different sounds.", 0, 0, 0, 0, () => {
                console.log("audio menu");
                Main_1.default.currentUi = undefined;
            }),
            new Button_1.default(font, "Back", "Return to the main menu.", 0, 0, 0, 0, () => {
                console.log("main menu");
                Main_1.default.currentUi = new MainMenu_1.MainMenu(font);
            })
        ];
        // update the size of the elements based on the initial screen size
        this.windowUpdate();
    }
    render(target, upscaleSize) {
        // render the rectangular image that the whole menu is on
        this.frame.render(target, upscaleSize);
        // loop through the buttons array and render each one.
        this.buttons.forEach(button => {
            button.render(target, upscaleSize);
        });
    }
    windowUpdate() {
        // set the position of the frame
        this.frame.x = Main_1.default.width / 2 - 200 / 2 * Main_1.default.upscaleSize; // center the frame in the center of the screen
        this.frame.y = Main_1.default.height / 2 - 56 * Main_1.default.upscaleSize;
        this.frame.w = 200 * Main_1.default.upscaleSize;
        this.frame.h = 48 * Main_1.default.upscaleSize;
        // set the positions of all the buttons
        for (let i = 0; i < 4; i++) {
            this.buttons[i].x = Main_1.default.width / 2 - 192 / 2 * Main_1.default.upscaleSize;
            this.buttons[i].y = Main_1.default.height / 2 + 20 * i * Main_1.default.upscaleSize;
            this.buttons[i].w = 192 * Main_1.default.upscaleSize;
            this.buttons[i].h = 16 * Main_1.default.upscaleSize;
            this.buttons[i].updateMouseOver(Main_1.default.mouseX, Main_1.default.mouseY);
        }
    }
}
exports.OptionsMenu = OptionsMenu;


/***/ }),

/***/ "./webpage/src/ui/screens/PauseMenu.ts":
/*!*********************************************!*\
  !*** ./webpage/src/ui/screens/PauseMenu.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PauseMenu = void 0;
const UiScreen_1 = __importDefault(__webpack_require__(/*! ../UiScreen */ "./webpage/src/ui/UiScreen.ts"));
const UiFrame_1 = __importDefault(__webpack_require__(/*! ../UiFrame */ "./webpage/src/ui/UiFrame.ts"));
const Main_1 = __importDefault(__webpack_require__(/*! ../../Main */ "./webpage/src/Main.ts"));
const Button_1 = __importDefault(__webpack_require__(/*! ../Button */ "./webpage/src/ui/Button.ts"));
const OptionsMenu_1 = __webpack_require__(/*! ./OptionsMenu */ "./webpage/src/ui/screens/OptionsMenu.ts");
const MainMenu_1 = __webpack_require__(/*! ./MainMenu */ "./webpage/src/ui/screens/MainMenu.ts");
class PauseMenu extends UiScreen_1.default {
    constructor(font) {
        super();
        // make the frame with some default values.  These will later be changed to fit the screen size.
        this.frame = new UiFrame_1.default(0, 0, 0, 0);
        // make 4 buttons with default positions
        this.buttons = [
            new Button_1.default(font, "Resume Game", "Go back to the game.", 0, 0, 0, 0, () => {
                Main_1.default.currentUi = undefined;
            }),
            new Button_1.default(font, "Options", "Change your keybinds, reduce lag, etc.", 0, 0, 0, 0, () => {
                Main_1.default.currentUi = new OptionsMenu_1.OptionsMenu(font);
            }),
            new Button_1.default(font, "Leave Game", "Go back to Main Menu", 0, 0, 0, 0, () => {
                Main_1.default.currentUi = new MainMenu_1.MainMenu(font);
            })
        ];
        // update the size of the elements based on the initial screen size
        this.windowUpdate();
    }
    render(target, upscaleSize) {
        // render the rectangular image that the whole menu is on
        this.frame.render(target, upscaleSize);
        // loop through the buttons array and render each one.
        for (const item of this.buttons) {
            item.render(target, upscaleSize);
        }
    }
    windowUpdate() {
        // set the position of the frame
        this.frame.x = Main_1.default.width / 2 - 256 / 2 * Main_1.default.upscaleSize; // center the frame in the middle of the screen
        this.frame.y = Main_1.default.height / 2 - 72 * Main_1.default.upscaleSize;
        this.frame.w = 256 * Main_1.default.upscaleSize;
        this.frame.h = 64 * Main_1.default.upscaleSize;
        // set the positions of all the buttons
        for (let i = 0; i < 3; i++) {
            this.buttons[i].x = Main_1.default.width / 2 - 192 / 2 * Main_1.default.upscaleSize;
            this.buttons[i].y = Main_1.default.height / 2 + 20 * i * Main_1.default.upscaleSize;
            this.buttons[i].w = 192 * Main_1.default.upscaleSize;
            this.buttons[i].h = 16 * Main_1.default.upscaleSize;
            this.buttons[i].updateMouseOver(Main_1.default.mouseX, Main_1.default.mouseY);
        }
    }
}
exports.PauseMenu = PauseMenu;


/***/ }),

/***/ "./webpage/src/ui/screens/WorldCreationMenu.ts":
/*!*****************************************************!*\
  !*** ./webpage/src/ui/screens/WorldCreationMenu.ts ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WorldCreationMenu = void 0;
const UiScreen_1 = __importDefault(__webpack_require__(/*! ../UiScreen */ "./webpage/src/ui/UiScreen.ts"));
const UiFrame_1 = __importDefault(__webpack_require__(/*! ../UiFrame */ "./webpage/src/ui/UiFrame.ts"));
const Main_1 = __importDefault(__webpack_require__(/*! ../../Main */ "./webpage/src/Main.ts"));
const Button_1 = __importDefault(__webpack_require__(/*! ../Button */ "./webpage/src/ui/Button.ts"));
const MainMenu_1 = __webpack_require__(/*! ./MainMenu */ "./webpage/src/ui/screens/MainMenu.ts");
const WorldOptionsMenu_1 = __webpack_require__(/*! ./WorldOptionsMenu */ "./webpage/src/ui/screens/WorldOptionsMenu.ts");
class WorldCreationMenu extends UiScreen_1.default {
    constructor(font) {
        super();
        // make the frame with some default values.  These will later be changed to fit the screen size.
        this.frame = new UiFrame_1.default(0, 0, 0, 0);
        // make some buttons with default positions
        if (Main_1.default.serverVisibility === undefined)
            Main_1.default.serverVisibility = "Public";
        this.buttons = [
            new Button_1.default(font, `Server Visibility: ${Main_1.default.serverVisibility}`, "Change the visibility of the server", 0, 0, 0, 0, () => {
                if (this.buttons[0].txt === "Server Visibility: Public") {
                    Main_1.default.serverVisibility = "Unlisted";
                    this.buttons[0].txt = "Server Visibility: Unlisted";
                }
                else if (this.buttons[0].txt === "Server Visibility: Unlisted") {
                    Main_1.default.serverVisibility = "Private";
                    this.buttons[0].txt = "Server Visibility: Private";
                }
                else {
                    Main_1.default.serverVisibility = "Public";
                    this.buttons[0].txt = "Server Visibility: Public";
                }
            }),
            new Button_1.default(font, "World Options", "Change how your world looks and generates.", 0, 0, 0, 0, () => {
                console.log("world menu");
                Main_1.default.currentUi = new WorldOptionsMenu_1.WorldOptionsMenu(font);
            }),
            new Button_1.default(font, "Back", "Return to the main menu.", 0, 0, 0, 0, () => {
                console.log("main menu");
                Main_1.default.currentUi = new MainMenu_1.MainMenu(font);
            })
        ];
        // update the size of the elements based on the initial screen size
        this.windowUpdate();
    }
    render(target, upscaleSize) {
        // render the rectangular image that the whole menu is on
        this.frame.render(target, upscaleSize);
        // loop through the buttons array and render each one.
        this.buttons.forEach(button => {
            button.render(target, upscaleSize);
        });
    }
    windowUpdate() {
        // set the position of the frame
        this.frame.x = Main_1.default.width / 2 - 200 / 2 * Main_1.default.upscaleSize; // center the frame in the center of the screen
        this.frame.y = Main_1.default.height / 2 - 56 * Main_1.default.upscaleSize;
        this.frame.w = 200 * Main_1.default.upscaleSize;
        this.frame.h = 48 * Main_1.default.upscaleSize;
        // set the positions of all the buttons
        for (let i = 0; i < 3; i++) {
            this.buttons[i].x = Main_1.default.width / 2 - 192 / 2 * Main_1.default.upscaleSize;
            this.buttons[i].y = Main_1.default.height / 2 + 20 * i * Main_1.default.upscaleSize;
            this.buttons[i].w = 192 * Main_1.default.upscaleSize;
            this.buttons[i].h = 16 * Main_1.default.upscaleSize;
            this.buttons[i].updateMouseOver(Main_1.default.mouseX, Main_1.default.mouseY);
        }
    }
}
exports.WorldCreationMenu = WorldCreationMenu;


/***/ }),

/***/ "./webpage/src/ui/screens/WorldOptionsMenu.ts":
/*!****************************************************!*\
  !*** ./webpage/src/ui/screens/WorldOptionsMenu.ts ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WorldOptionsMenu = void 0;
const UiScreen_1 = __importDefault(__webpack_require__(/*! ../UiScreen */ "./webpage/src/ui/UiScreen.ts"));
const UiFrame_1 = __importDefault(__webpack_require__(/*! ../UiFrame */ "./webpage/src/ui/UiFrame.ts"));
const Main_1 = __importDefault(__webpack_require__(/*! ../../Main */ "./webpage/src/Main.ts"));
const Button_1 = __importDefault(__webpack_require__(/*! ../Button */ "./webpage/src/ui/Button.ts"));
const WorldCreationMenu_1 = __webpack_require__(/*! ./WorldCreationMenu */ "./webpage/src/ui/screens/WorldCreationMenu.ts");
const Slider_1 = __importDefault(__webpack_require__(/*! ../Slider */ "./webpage/src/ui/Slider.ts"));
class WorldOptionsMenu extends UiScreen_1.default {
    constructor(font) {
        super();
        // make the frame with some default values.  These will later be changed to fit the screen size.
        this.frame = new UiFrame_1.default(0, 0, 0, 0);
        // make some buttons with default positions
        if (Main_1.default.worldBumpiness === undefined)
            Main_1.default.worldBumpiness = 1;
        let tempWorldBumpinessText;
        if (Main_1.default.worldBumpiness === 1) {
            tempWorldBumpinessText = "Normal";
        }
        else if (Main_1.default.worldBumpiness === 0) {
            tempWorldBumpinessText = "Superflat";
        }
        else {
            tempWorldBumpinessText = "Amplified";
        }
        this.buttons = [
            new Button_1.default(font, `World Bumpiness: ${tempWorldBumpinessText}`, "Change the intensity of the world's bumps.", 0, 0, 0, 0, () => {
                if (this.buttons[0].txt === "World Bumpiness: Normal") {
                    this.buttons[0].txt = "World Bumpiness: Amplified";
                    Main_1.default.worldBumpiness = 3;
                }
                else if (this.buttons[0].txt === "World Bumpiness: Amplified") {
                    this.buttons[0].txt = "World Bumpiness: Superflat";
                    Main_1.default.worldBumpiness = 0;
                }
                else {
                    this.buttons[0].txt = "World Bumpiness: Normal";
                    Main_1.default.worldBumpiness = 1;
                }
            }),
            new Button_1.default(font, "Back", "Return to the main menu.", 0, 0, 0, 0, () => {
                console.log("main menu");
                Main_1.default.currentUi = new WorldCreationMenu_1.WorldCreationMenu(font);
            })
        ];
        this.sliders = [
            new Slider_1.default(font, "Width", 512, 64, 2048, 64, 0, 0, 0, 0, () => {
                Main_1.default.worldWidth = this.sliders[0].value;
            }),
            new Slider_1.default(font, "Height", 64, 64, 512, 16, 0, 0, 0, 0, () => {
                Main_1.default.worldHeight = this.sliders[1].value;
            })
        ];
        // update the size of the elements based on the initial screen size
        this.windowUpdate();
    }
    render(target, upscaleSize) {
        // render the rectangular image that the whole menu is on
        this.frame.render(target, upscaleSize);
        // loop through the buttons array and render each one.
        this.buttons.forEach(button => {
            button.render(target, upscaleSize);
        });
        // loop through the sliders array and render each one.
        this.sliders.forEach(slider => {
            slider.render(target, upscaleSize);
        });
    }
    windowUpdate() {
        // set the position of the frame
        this.frame.x = Main_1.default.width / 2 - 200 / 2 * Main_1.default.upscaleSize; // center the frame in the center of the screen
        this.frame.y = Main_1.default.height / 2 - 56 * Main_1.default.upscaleSize;
        this.frame.w = 200 * Main_1.default.upscaleSize;
        this.frame.h = 48 * Main_1.default.upscaleSize;
        // set the positions of all the buttons
        for (let i = 0; i < 2; i++) {
            this.buttons[i].x = Main_1.default.width / 2 - 192 / 2 * Main_1.default.upscaleSize;
            this.buttons[i].y = Main_1.default.height / 2 + 60 * i * Main_1.default.upscaleSize;
            this.buttons[i].w = 192 * Main_1.default.upscaleSize;
            this.buttons[i].h = 16 * Main_1.default.upscaleSize;
            this.buttons[i].updateMouseOver(Main_1.default.mouseX, Main_1.default.mouseY);
        }
        // set the positions of all the sliders
        for (let i = 0; i < 2; i++) {
            this.sliders[i].x = Main_1.default.width / 2 - 192 / 2 * Main_1.default.upscaleSize;
            this.sliders[i].y = Main_1.default.height / 2 + 20 * Main_1.default.upscaleSize + 20 * i * Main_1.default.upscaleSize;
            this.sliders[i].w = 192 * Main_1.default.upscaleSize;
            this.sliders[i].h = 16 * Main_1.default.upscaleSize;
            if (Main_1.default.mouseIsPressed)
                this.sliders[i].updateSliderPosition(Main_1.default.mouseX);
        }
    }
}
exports.WorldOptionsMenu = WorldOptionsMenu;


/***/ }),

/***/ "./webpage/src/websocket/NetManager.ts":
/*!*********************************************!*\
  !*** ./webpage/src/websocket/NetManager.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NetManager = void 0;
const World_1 = __importDefault(__webpack_require__(/*! ../world/World */ "./webpage/src/world/World.ts"));
const EntityClasses_1 = __webpack_require__(/*! ../world/entities/EntityClasses */ "./webpage/src/world/entities/EntityClasses.ts");
const PlayerLocal_1 = __importDefault(__webpack_require__(/*! ../world/entities/PlayerLocal */ "./webpage/src/world/entities/PlayerLocal.ts"));
class NetManager {
    constructor(game) {
        this.game = game;
        // Init event
        this.game.connection.on('init', (playerTickRate, token) => {
            console.log(`Tick rate set to: ${playerTickRate}`);
            this.playerTickRate = playerTickRate;
            if (token) {
                window.localStorage.setItem('token', token);
                this.game.connection.auth.token = token;
            }
        });
        // Initialization events
        {
            // Load the world and set the player entity id
            this.game.connection.on('worldLoad', (width, height, tiles, tileEntities, entities, player) => {
                console.log(entities);
                this.game.world = new World_1.default(width, height, tiles);
                this.game.world.player = new PlayerLocal_1.default(player);
                entities.forEach((entity) => {
                    this.game.world.entities[entity.id] = new EntityClasses_1.EntityClasses[entity.type](entity);
                });
            });
        }
        // World events
        {
            // Tile updates such as breaking and placing
            this.game.connection.on('worldUpdate', (updatedTiles) => {
                // If the world is not set
                if (this.game.world === undefined)
                    return;
                updatedTiles.forEach((tile) => {
                    this.game.world.updateTile(tile.tileIndex, tile.tile);
                });
            });
        }
        // Player events
        {
            // Update the player
            this.game.connection.on('setPlayer', (x, y, yVel, xVel) => {
                // If the world is not set
                if (this.game.world === undefined)
                    return;
                this.game.world.player.x = x;
                this.game.world.player.y = y;
                this.game.world.player.yVel = yVel;
                this.game.world.player.xVel = xVel;
            });
            this.game.connection.on('entityUpdate', (entityData) => {
                // If the world is not set
                if (this.game.world === undefined)
                    return;
                const entity = this.game.world.entities[entityData.id];
                if (entity === undefined)
                    return;
                entity.updateData(entityData);
            });
            this.game.connection.on('entityCreate', (entityData) => {
                // If the world is not set
                if (this.game.world === undefined)
                    return;
                this.game.world.entities[entityData.id] = new EntityClasses_1.EntityClasses[entityData.type](entityData);
            });
            this.game.connection.on('entityDelete', (id) => {
                // If the world is not set
                if (this.game.world === undefined)
                    return;
                delete this.game.world.entities[id];
            });
            // Update the other players in the world
            this.game.connection.on('entitySnapshot', (snapshot) => {
                // If the world is not set
                if (this.game.world === undefined)
                    return;
                this.game.world.updatePlayers(snapshot);
            });
        }
    }
}
exports.NetManager = NetManager;


/***/ }),

/***/ "./webpage/src/world/World.ts":
/*!************************************!*\
  !*** ./webpage/src/world/World.ts ***!
  \************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Main_1 = __importDefault(__webpack_require__(/*! ../Main */ "./webpage/src/Main.ts"));
const ImageResource_1 = __importDefault(__webpack_require__(/*! ../assets/resources/ImageResource */ "./webpage/src/assets/resources/ImageResource.ts"));
const TileResource_1 = __importDefault(__webpack_require__(/*! ../assets/resources/TileResource */ "./webpage/src/assets/resources/TileResource.ts"));
const snapshot_interpolation_1 = __webpack_require__(/*! @geckos.io/snapshot-interpolation */ "./node_modules/@geckos.io/snapshot-interpolation/lib/index.js");
const WorldTiles_1 = __webpack_require__(/*! ./WorldTiles */ "./webpage/src/world/WorldTiles.ts");
const Tile_1 = __webpack_require__(/*! ../../../api/Tile */ "./api/Tile.ts");
class World {
    constructor(width, height, tiles) {
        this.entities = {};
        // Initialize the world with the tiles and dimensions from the server
        this.width = width;
        this.height = height;
        this.worldTiles = tiles;
        this.snapshotInterpolation = new snapshot_interpolation_1.SnapshotInterpolation();
        this.snapshotInterpolation.interpolationBuffer.set((1000 / Main_1.default.netManager.playerTickRate) * 2);
        // define the p5.Graphics objects that hold an image of the tiles of the world.  These act sort of like a virtual canvas and can be drawn on just like a normal canvas by using tileLayer.rect();, tileLayer.ellipse();, tileLayer.fill();, etc.
        this.tileLayer = Main_1.default.createGraphics(this.width * Main_1.default.TILE_WIDTH, this.height * Main_1.default.TILE_HEIGHT);
        this.backTileLayer = Main_1.default.createGraphics(this.width * Main_1.default.TILE_WIDTH, this.height * Main_1.default.TILE_HEIGHT);
        // calculate these variables:
        this.backTileLayerOffsetWidth =
            (Main_1.default.TILE_WIDTH - Main_1.default.BACK_TILE_WIDTH) / 2; // calculated in the setup function, this variable is the number of pixels left of a tiles to draw a background tiles from at the same position
        this.backTileLayerOffsetHeight =
            (Main_1.default.TILE_HEIGHT - Main_1.default.BACK_TILE_HEIGHT) / 2; // calculated in the setup function, this variable is the number of pixels above a tiles to draw a background tiles from at the same position
        this.loadWorld();
    }
    tick(game) {
        if (this.player !== undefined)
            game.connection.emit('playerUpdate', this.player.x, this.player.y);
    }
    render(target, upscaleSize) {
        // draw the background tiles layer onto the screen
        target.image(this.backTileLayer, 0, 0, Main_1.default.width, Main_1.default.height, Main_1.default.interpolatedCamX * Main_1.default.TILE_WIDTH, Main_1.default.interpolatedCamY * Main_1.default.TILE_WIDTH, Main_1.default.width / upscaleSize, Main_1.default.height / upscaleSize);
        // draw the tiles layer onto the screen
        target.image(this.tileLayer, 0, 0, Main_1.default.width, Main_1.default.height, Main_1.default.interpolatedCamX * Main_1.default.TILE_WIDTH, Main_1.default.interpolatedCamY * Main_1.default.TILE_WIDTH, Main_1.default.width / upscaleSize, Main_1.default.height / upscaleSize);
        this.renderPlayers(target, upscaleSize);
    }
    updatePlayers(snapshot) {
        this.snapshotInterpolation.snapshot.add(snapshot);
    }
    updateTile(tileIndex, tile) {
        // Update the tile and the 4 neighbouring tiles
        this.worldTiles[tileIndex] = tile;
        // erase the broken tiles and its surrounding tiles using two erasing rectangles in a + shape
        this.tileLayer.erase();
        this.tileLayer.noStroke();
        this.tileLayer.rect(((tileIndex % this.width) - 1) * Main_1.default.TILE_WIDTH, Math.floor(tileIndex / this.width) * Main_1.default.TILE_HEIGHT, Main_1.default.TILE_WIDTH * 3, Main_1.default.TILE_HEIGHT);
        this.tileLayer.rect((tileIndex % this.width) * Main_1.default.TILE_WIDTH, (Math.floor(tileIndex / this.width) - 1) * Main_1.default.TILE_HEIGHT, Main_1.default.TILE_WIDTH, Main_1.default.TILE_HEIGHT * 3);
        this.tileLayer.noErase();
        // redraw the neighboring tiles
        this.drawTile(tileIndex);
        this.drawTile(tileIndex + this.width);
        this.drawTile(tileIndex - 1);
        this.drawTile(tileIndex - this.width);
        this.drawTile(tileIndex + 1);
    }
    renderPlayers(target, upscaleSize) {
        // Calculate the interpolated position of all updated entities
        const positionStates = {};
        try {
            const calculatedSnapshot = this.snapshotInterpolation.calcInterpolation('x y');
            if (!calculatedSnapshot)
                return;
            const state = calculatedSnapshot.state;
            if (!state)
                return;
            // The new positions of entities as object
            state.forEach(({ id, x, y }) => {
                positionStates[id] = { x, y };
            });
        }
        catch (e) { }
        // Render each entity in random order :skull:
        Object.entries(this.entities).forEach((entity) => {
            const updatedPosition = positionStates[entity[0]];
            if (updatedPosition !== undefined) {
                entity[1].x = updatedPosition.x;
                entity[1].y = updatedPosition.y;
            }
            entity[1].render(target, upscaleSize);
        });
        // Render the player on top :thumbsup:
        if (this.player !== undefined) {
            this.player.findInterpolatedCoordinates();
            this.player.render(target, upscaleSize);
        }
    }
    loadWorld() {
        for (let x = 0; x < this.height; x++) {
            // i will be the y position of tiles being drawn
            for (let y = 0; y < this.width; y++) {
                const tileVal = this.worldTiles[x * this.width + y];
                if (typeof tileVal === 'string') {
                    console.log(tileVal);
                    continue;
                }
                if (tileVal !== Tile_1.TileType.Air) {
                    // Draw the correct image for the tiles onto the tiles layer
                    const tile = WorldTiles_1.WorldTiles[tileVal];
                    if (tile.connected &&
                        tile.texture instanceof TileResource_1.default) {
                        // test if the neighboring tiles are solid
                        const topTileBool = x === Tile_1.TileType.Air ||
                            this.worldTiles[(x - 1) * this.width + y] !==
                                Tile_1.TileType.Air;
                        const leftTileBool = y === Tile_1.TileType.Air ||
                            this.worldTiles[x * this.width + y - 1] !==
                                Tile_1.TileType.Air;
                        const bottomTileBool = x === this.height - 1 ||
                            this.worldTiles[(x + 1) * this.width + y] !==
                                Tile_1.TileType.Air;
                        const rightTileBool = y === this.width - 1 ||
                            this.worldTiles[x * this.width + y + 1] !==
                                Tile_1.TileType.Air;
                        // convert 4 digit binary number to base 10
                        const tileSetIndex = 8 * +topTileBool +
                            4 * +rightTileBool +
                            2 * +bottomTileBool +
                            +leftTileBool;
                        // Render connected tiles
                        tile.texture.renderTile(tileSetIndex, this.tileLayer, y * Main_1.default.TILE_WIDTH, x * Main_1.default.TILE_HEIGHT, Main_1.default.TILE_WIDTH, Main_1.default.TILE_HEIGHT);
                    }
                    else if (!tile.connected &&
                        tile.texture instanceof ImageResource_1.default) {
                        // Render non-connected tiles
                        tile.texture.render(this.tileLayer, y * Main_1.default.TILE_WIDTH, x * Main_1.default.TILE_HEIGHT, Main_1.default.TILE_WIDTH, Main_1.default.TILE_HEIGHT);
                    }
                }
            }
        }
    }
    drawTile(tileIndex) {
        const x = tileIndex % this.width;
        const y = Math.floor(tileIndex / this.width);
        if (this.worldTiles[tileIndex] !== Tile_1.TileType.Air) {
            // Draw the correct image for the tiles onto the tiles layer
            const tileVal = this.worldTiles[tileIndex];
            if (typeof tileVal === 'string') {
                console.log("Tried to draw: " + tileVal);
                return;
            }
            const tile = WorldTiles_1.WorldTiles[tileVal];
            // if the tiles is off-screen
            if (tile === undefined) {
                return;
            }
            if (tile.connected && tile.texture instanceof TileResource_1.default) {
                // Test the neighboring 4 tiles
                const topTileBool = y <= 0 ||
                    this.worldTiles[tileIndex - this.width] !== Tile_1.TileType.Air;
                const leftTileBool = x <= 0 || this.worldTiles[tileIndex - 1] !== Tile_1.TileType.Air;
                const bottomTileBool = y >= this.height - 1 ||
                    this.worldTiles[tileIndex + this.width] !== Tile_1.TileType.Air;
                const rightTileBool = x >= this.width - 1 ||
                    this.worldTiles[tileIndex + 1] !== Tile_1.TileType.Air;
                // convert 4 digit binary number to base 10
                const tileSetIndex = 8 * +topTileBool +
                    4 * +rightTileBool +
                    2 * +bottomTileBool +
                    +leftTileBool;
                // Render connected tiles
                tile.texture.renderTile(tileSetIndex, this.tileLayer, x * Main_1.default.TILE_WIDTH, y * Main_1.default.TILE_HEIGHT, Main_1.default.TILE_WIDTH, Main_1.default.TILE_HEIGHT);
            }
            else if (!tile.connected &&
                tile.texture instanceof ImageResource_1.default) {
                // Render non-connected tiles
                tile.texture.render(this.tileLayer, x * Main_1.default.TILE_WIDTH, y * Main_1.default.TILE_HEIGHT, Main_1.default.TILE_WIDTH, Main_1.default.TILE_HEIGHT);
            }
        }
    }
}
module.exports = World;


/***/ }),

/***/ "./webpage/src/world/WorldTiles.ts":
/*!*****************************************!*\
  !*** ./webpage/src/world/WorldTiles.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WorldTiles = void 0;
const Assets_1 = __webpack_require__(/*! ../assets/Assets */ "./webpage/src/assets/Assets.ts");
const Tile_1 = __webpack_require__(/*! ../../../api/Tile */ "./api/Tile.ts");
exports.WorldTiles = {
    [Tile_1.TileType.Air]: undefined,
    [Tile_1.TileType.Snow]: {
        name: 'snow',
        texture: Assets_1.WorldAssets.middleground.tileset_snow,
        connected: true,
        anyConnection: true,
    },
    [Tile_1.TileType.Ice]: {
        name: 'ice',
        texture: Assets_1.WorldAssets.middleground.tileset_ice,
        connected: true,
        anyConnection: true,
    },
};


/***/ }),

/***/ "./webpage/src/world/entities/EntityClasses.ts":
/*!*****************************************************!*\
  !*** ./webpage/src/world/entities/EntityClasses.ts ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EntityClasses = void 0;
const Entity_1 = __webpack_require__(/*! ../../../../api/Entity */ "./api/Entity.ts");
const PlayerEntity_1 = __webpack_require__(/*! ./PlayerEntity */ "./webpage/src/world/entities/PlayerEntity.ts");
const PlayerLocal_1 = __importDefault(__webpack_require__(/*! ./PlayerLocal */ "./webpage/src/world/entities/PlayerLocal.ts"));
exports.EntityClasses = {
    [Entity_1.Entities.LocalPlayer]: PlayerLocal_1.default,
    [Entity_1.Entities.Player]: PlayerEntity_1.PlayerEntity,
    [Entity_1.Entities.Item]: null
};


/***/ }),

/***/ "./webpage/src/world/entities/PlayerEntity.ts":
/*!****************************************************!*\
  !*** ./webpage/src/world/entities/PlayerEntity.ts ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlayerEntity = void 0;
const ServerEntity_1 = __webpack_require__(/*! ./ServerEntity */ "./webpage/src/world/entities/ServerEntity.ts");
const Main_1 = __importDefault(__webpack_require__(/*! ../../Main */ "./webpage/src/Main.ts"));
const Entity_1 = __webpack_require__(/*! ../../../../api/Entity */ "./api/Entity.ts");
class PlayerEntity extends ServerEntity_1.ServerEntity {
    constructor(data) {
        super(data.id);
        this.width = 12 / Main_1.default.TILE_WIDTH;
        this.height = 20 / Main_1.default.TILE_HEIGHT;
        if (data.type === Entity_1.Entities.Player) {
            this.name = data.data.name;
        }
    }
    updateData(data) {
        if (data.type === Entity_1.Entities.Player) {
            this.name = data.data.name;
        }
    }
    render(target, upscaleSize) {
        target.fill(0, 255, 0);
        target.rect((this.x * Main_1.default.TILE_WIDTH -
            Main_1.default.interpolatedCamX * Main_1.default.TILE_WIDTH) *
            upscaleSize, (this.y * Main_1.default.TILE_HEIGHT -
            Main_1.default.interpolatedCamY * Main_1.default.TILE_HEIGHT) *
            upscaleSize, this.width * upscaleSize * Main_1.default.TILE_WIDTH, this.height * upscaleSize * Main_1.default.TILE_HEIGHT);
        // Render the item quantity label
        target.fill(0);
        target.noStroke();
        target.textSize(5 * upscaleSize);
        target.textAlign(target.CENTER, target.TOP);
        target.text(this.name, (((this.x * Main_1.default.TILE_WIDTH) -
            Main_1.default.interpolatedCamX * Main_1.default.TILE_WIDTH) + (this.width * Main_1.default.TILE_WIDTH) / 2) *
            upscaleSize, (((this.y * Main_1.default.TILE_HEIGHT) -
            Main_1.default.interpolatedCamY * Main_1.default.TILE_HEIGHT) - (this.height * Main_1.default.TILE_WIDTH) / 2.5) *
            upscaleSize);
    }
}
exports.PlayerEntity = PlayerEntity;


/***/ }),

/***/ "./webpage/src/world/entities/PlayerLocal.ts":
/*!***************************************************!*\
  !*** ./webpage/src/world/entities/PlayerLocal.ts ***!
  \***************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Main_1 = __importDefault(__webpack_require__(/*! ../../Main */ "./webpage/src/Main.ts"));
const ServerEntity_1 = __webpack_require__(/*! ./ServerEntity */ "./webpage/src/world/entities/ServerEntity.ts");
const Entity_1 = __webpack_require__(/*! ../../../../api/Entity */ "./api/Entity.ts");
class PlayerLocal extends ServerEntity_1.ServerEntity {
    constructor(data) {
        super(data.id);
        this.width = 12 / Main_1.default.TILE_WIDTH;
        this.height = 20 / Main_1.default.TILE_HEIGHT;
        this.xVel = 0;
        this.yVel = 0;
        this.pXVel = 0;
        this.pYVel = 0;
        this.grounded = false;
        this.mass = this.width * this.height;
        this.name = data.data.name;
        this.x = data.data.x;
        this.y = data.data.y;
        this.closestCollision = [1, 0, Infinity];
        this.interpolatedX = this.x;
        this.interpolatedY = this.y;
        this.pX = this.x;
        this.pY = this.y;
    }
    render(target, upscaleSize) {
        target.fill(255, 0, 0);
        target.rect((this.interpolatedX * Main_1.default.TILE_WIDTH -
            Main_1.default.interpolatedCamX * Main_1.default.TILE_WIDTH) *
            upscaleSize, (this.interpolatedY * Main_1.default.TILE_HEIGHT -
            Main_1.default.interpolatedCamY * Main_1.default.TILE_HEIGHT) *
            upscaleSize, this.width * upscaleSize * Main_1.default.TILE_WIDTH, this.height * upscaleSize * Main_1.default.TILE_HEIGHT);
    }
    updateData(data) {
        if (data.type === Entity_1.Entities.Player)
            this.name = data.data.name;
    }
    keyboardInput() {
        this.xVel +=
            0.02 *
                (+(!!Main_1.default.keys[68] || !!Main_1.default.keys[39]) -
                    +(!!Main_1.default.keys[65] || !!Main_1.default.keys[37]));
        if (this.grounded &&
            (Main_1.default.keys[87] || Main_1.default.keys[38] || Main_1.default.keys[32])) {
            this.yVel = -1.5;
        }
    }
    applyGravityAndDrag() {
        // this function changes the object's next tick's velocity in both the x and the y directions
        this.pXVel = this.xVel;
        this.pYVel = this.yVel;
        this.xVel -=
            (Main_1.default.abs(this.xVel) * this.xVel * Main_1.default.DRAG_COEFFICIENT * this.width) /
                this.mass;
        this.yVel += Main_1.default.GRAVITY_SPEED;
        this.yVel -=
            (Main_1.default.abs(this.yVel) * this.yVel * Main_1.default.DRAG_COEFFICIENT * this.height) /
                this.mass;
    }
    findInterpolatedCoordinates() {
        // this function essentially makes the character lag behind one tick, but means that it gets displayed at the maximum frame rate.
        if (this.pXVel > 0) {
            this.interpolatedX = Main_1.default.min(this.pX + this.pXVel * Main_1.default.amountSinceLastTick, this.x);
        }
        else {
            this.interpolatedX = Main_1.default.max(this.pX + this.pXVel * Main_1.default.amountSinceLastTick, this.x);
        }
        if (this.pYVel > 0) {
            this.interpolatedY = Main_1.default.min(this.pY + this.pYVel * Main_1.default.amountSinceLastTick, this.y);
        }
        else {
            this.interpolatedY = Main_1.default.max(this.pY + this.pYVel * Main_1.default.amountSinceLastTick, this.y);
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
        for (let i = Main_1.default.floor(Main_1.default.min(this.x, this.x + this.xVel)); i < Main_1.default.ceil(Main_1.default.max(this.x, this.x + this.xVel) + this.width); i++) {
            for (let j = Main_1.default.floor(Main_1.default.min(this.y, this.y + this.yVel)); j < Main_1.default.ceil(Main_1.default.max(this.y, this.y + this.yVel) + this.height); j++) {
                // if the current tile isn't air (value 0), then continue with the collision detection
                if (Main_1.default.world.worldTiles[j * Main_1.default.worldWidth + i] !== 0) {
                    // get the data about the collision and store it in a variable
                    this.collisionData = Main_1.default.rectVsRay(i - this.width, j - this.height, this.width + 1, this.height + 1, this.x, this.y, this.xVel, this.yVel);
                    if (this.collisionData !== false &&
                        this.closestCollision[2] > this.collisionData[2]) {
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
            }
            else {
                this.xVel = 0; // set the x velocity to 0 because wall go oof
                this.slideX = 0; // it doesn't slide in the x direction because there's a wall /(._.)\
                this.slideY = this.yVel * (1 - this.closestCollision[2]); // this is the remaining distance to slide after the collision
            }
            // at this point, the object is touching its first collision, ready to slide.  The amount it wants to slide is held in the this.slideX and this.slideY variables.
            // this can be treated essentially the same as the first collision, so a lot of the code will be reused.
            // set the closest collision to one infinitely far away.
            this.closestCollision = [1, 0, Infinity];
            // loop through all the possible tiles the physics box could be intersecting with
            for (let i = Main_1.default.floor(Main_1.default.min(this.x, this.x + this.slideX)); i < Main_1.default.ceil(Main_1.default.max(this.x, this.x + this.slideX) + this.width); i++) {
                for (let j = Main_1.default.floor(Main_1.default.min(this.y, this.y + this.slideY)); j <
                    Main_1.default.ceil(Main_1.default.max(this.y, this.y + this.slideY) + this.height); j++) {
                    // if the current tile isn't air (value 0), then continue with the collision detection
                    if (Main_1.default.world.worldTiles[j * Main_1.default.worldWidth + i] !== 0) {
                        // get the data about the collision and store it in a variable
                        this.collisionData = Main_1.default.rectVsRay(i - this.width, j - this.height, this.width + 1, this.height + 1, this.x, this.y, this.slideX, this.slideY);
                        if (this.collisionData !== false &&
                            this.closestCollision[2] > this.collisionData[2]) {
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
                }
                else {
                    this.xVel = 0; // set the x velocity to 0 because wall go oof
                }
            }
            else {
                // it has not collided while trying to slide
                this.x += this.slideX;
                this.y += this.slideY;
            }
        }
        else {
            // there has been no collision
            this.x += this.xVel;
            this.y += this.yVel;
        }
        // collide with sides of map
        if (this.x < 0) {
            this.x = 0;
            this.xVel = 0;
        }
        else if (this.x + this.width > Main_1.default.worldWidth) {
            this.x = Main_1.default.worldWidth - this.width;
            this.xVel = 0;
        }
        if (this.y < 0) {
            this.y = 0;
            this.yVel = 0;
        }
        else if (this.y + this.height > Main_1.default.worldHeight) {
            this.y = Main_1.default.worldHeight - this.height;
            this.yVel = 0;
            this.grounded = true;
        }
    }
}
module.exports = PlayerLocal;


/***/ }),

/***/ "./webpage/src/world/entities/ServerEntity.ts":
/*!****************************************************!*\
  !*** ./webpage/src/world/entities/ServerEntity.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ServerEntity = void 0;
class ServerEntity {
    constructor(entityId) {
        this.x = 0;
        this.y = 0;
        this.entityId = entityId;
    }
}
exports.ServerEntity = ServerEntity;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunksnowed_in"] = self["webpackChunksnowed_in"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["commons-main"], () => (__webpack_require__("./webpage/src/Main.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFD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LEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxHQUFHLFdBQVcsQ0FBQztRQUN6RCxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFDLEdBQUcsV0FBVyxDQUFDO1FBQ3pELE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxXQUFXLENBQUMsR0FBRyxXQUFXLENBQUM7UUFFekQsVUFBVTtRQUNWLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNyRixJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDM0csSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzNHLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUVqSSxpQkFBaUI7UUFDakIsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzVHLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUVsSSxpQkFBaUI7UUFDakIsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzVHLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUVsSSxTQUFTO1FBQ1QsSUFBSSxDQUFDLEtB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MEVBQTBFO1FBQzFFLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBQyxXQUFXLENBQUMsR0FBQyxXQUFXLENBQUM7UUFDckQsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFDLFdBQVcsQ0FBQyxHQUFDLFdBQVcsQ0FBQztRQUNyRCxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUMsV0FBVyxDQUFDLEdBQUMsV0FBVyxDQUFDO1FBQ3JELE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBQyxXQUFXLENBQUMsR0FBQyxXQUFXLENBQUM7UUFFckQsVUFBVTtRQUNWLGlCQUFRLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUMsV0FBVyxFQUFFLENBQUMsR0FBQyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDeEYsaUJBQVEsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBQyxXQUFXLEVBQUUsQ0FBQyxHQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN4RyxpQkFBUSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxXQUFXLEVBQUUsQ0FBQyxHQUFDLFdBQVcsRUFBRSxDQUFDLEdBQUMsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3hHLGlCQUFRLENBQUMsUUFBUSxD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O1VBRUE7VUFDQTs7Ozs7V0N6QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSwrQkFBK0Isd0NBQXdDO1dBQ3ZFO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUJBQWlCLHFCQUFxQjtXQUN0QztXQUNBO1dBQ0Esa0JBQWtCLHFCQUFxQjtXQUN2QztXQUNBO1dBQ0EsS0FBSztXQUNMO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7Ozs7V0MzQkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEdBQUc7V0FDSDtXQUNBO1dBQ0EsQ0FBQzs7Ozs7V0NQRDs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1dDTkE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLE1BQU0scUJBQXFCO1dBQzNCO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBOzs7OztVRWhEQTtVQUNBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vYXBpL0VudGl0eS50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi9hcGkvVGlsZS50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi93ZWJwYWdlL3NyYy9HYW1lLnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3dlYnBhZ2Uvc3JjL01haW4udHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vd2VicGFnZS9zcmMvYXNzZXRzL0Fzc2V0cy50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi93ZWJwYWdlL3NyYy9hc3NldHMvcmVzb3VyY2VzL0F1ZGlvUmVzb3VyY2UudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vd2VicGFnZS9zcmMvYXNzZXRzL3Jlc291cmNlcy9BdWRpb1Jlc291cmNlR3JvdXAudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vd2VicGFnZS9zcmMvYXNzZXRzL3Jlc291cmNlcy9Gb250UmVzb3VyY2UudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vd2VicGFnZS9zcmMvYXNzZXRzL3Jlc291cmNlcy9JbWFnZVJlc291cmNlLnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3dlYnBhZ2Uvc3JjL2Fzc2V0cy9yZXNvdXJjZXMvUmVzb3VyY2UudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vd2VicGFnZS9zcmMvYXNzZXRzL3Jlc291cmNlcy9UaWxlUmVzb3VyY2UudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vd2VicGFnZS9zcmMvdWkvQnV0dG9uLnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3dlYnBhZ2Uvc3JjL3VpL1NsaWRlci50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi93ZWJwYWdlL3NyYy91aS9VaUZyYW1lLnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3dlYnBhZ2Uvc3JjL3VpL1VpU2NyZWVuLnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3dlYnBhZ2Uvc3JjL3VpL3NjcmVlbnMvTWFpbk1lbnUudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vd2VicGFnZS9zcmMvdWkvc2NyZWVucy9PcHRpb25zTWVudS50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi93ZWJwYWdlL3NyYy91aS9zY3JlZW5zL1BhdXNlTWVudS50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi93ZWJwYWdlL3NyYy91aS9zY3JlZW5zL1dvcmxkQ3JlYXRpb25NZW51LnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3dlYnBhZ2Uvc3JjL3VpL3NjcmVlbnMvV29ybGRPcHRpb25zTWVudS50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi93ZWJwYWdlL3NyYy93ZWJzb2NrZXQvTmV0TWFuYWdlci50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi93ZWJwYWdlL3NyYy93b3JsZC9Xb3JsZC50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi93ZWJwYWdlL3NyYy93b3JsZC9Xb3JsZFRpbGVzLnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3dlYnBhZ2Uvc3JjL3dvcmxkL2VudGl0aWVzL0VudGl0eUNsYXNzZXMudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vd2VicGFnZS9zcmMvd29ybGQvZW50aXRpZXMvUGxheWVyRW50aXR5LnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3dlYnBhZ2Uvc3JjL3dvcmxkL2VudGl0aWVzL1BsYXllckxvY2FsLnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3dlYnBhZ2Uvc3JjL3dvcmxkL2VudGl0aWVzL1NlcnZlckVudGl0eS50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vc25vd2VkX2luL3dlYnBhY2svcnVudGltZS9jaHVuayBsb2FkZWQiLCJ3ZWJwYWNrOi8vc25vd2VkX2luL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vd2VicGFjay9ydW50aW1lL2pzb25wIGNodW5rIGxvYWRpbmciLCJ3ZWJwYWNrOi8vc25vd2VkX2luL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vc25vd2VkX2luL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBlbnVtIEVudGl0aWVzIHtcclxuICAgIExvY2FsUGxheWVyLFxyXG4gICAgUGxheWVyLFxyXG4gICAgSXRlbVxyXG59XHJcblxyXG50eXBlIERhdGFQYWlyczxULCBLIGV4dGVuZHMga2V5b2YgVCA9IGtleW9mIFQ+ID1cclxuICAgIEsgZXh0ZW5kcyBrZXlvZiBUXHJcbiAgICAgICAgPyB7IHR5cGU6IEssIGRhdGE6IFRbS10gfVxyXG4gICAgICAgIDogbmV2ZXI7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEVudGl0aWVzRGF0YSB7XHJcbiAgICBbRW50aXRpZXMuTG9jYWxQbGF5ZXJdOiB7bmFtZTogc3RyaW5nLCB4OiBudW1iZXIsIHk6IG51bWJlcn1cclxuICAgIFtFbnRpdGllcy5QbGF5ZXJdOiB7bmFtZTogc3RyaW5nfTtcclxuICAgIFtFbnRpdGllcy5JdGVtXToge2RhdGVDcmVhdGVkOiBzdHJpbmd9O1xyXG59XHJcblxyXG5leHBvcnQgdHlwZSBFbnRpdHlEYXRhPFQgZXh0ZW5kcyBFbnRpdGllcyA9IGtleW9mIEVudGl0aWVzRGF0YT4gPSBEYXRhUGFpcnM8RW50aXRpZXNEYXRhLCBUPlxyXG5cclxuZXhwb3J0IHR5cGUgRW50aXR5UGF5bG9hZDxUIGV4dGVuZHMgRW50aXRpZXMgPSBrZXlvZiBFbnRpdGllc0RhdGE+ID0gRW50aXR5RGF0YTxUPiAmIHtpZDogc3RyaW5nfSIsImV4cG9ydCBlbnVtIFRpbGVUeXBlIHtcclxuICAgIEFpcixcclxuICAgIFNub3csXHJcbiAgICBJY2UsXHJcbn0iLCJpbXBvcnQgcDUsIHsgU2hhZGVyIH0gZnJvbSAncDUnXHJcblxyXG5pbXBvcnQgQXVkaW8gZnJvbSAndHMtYXVkaW8nO1xyXG5cclxuXHJcbmltcG9ydCBXb3JsZCBmcm9tICcuL3dvcmxkL1dvcmxkJztcclxuXHJcbmltcG9ydCB7XHJcbiAgICBGb250cyxcclxuICAgIEl0ZW1zQXNzZXRzLFxyXG4gICAgbG9hZEFzc2V0cyxcclxuICAgIFVpQXNzZXRzLFxyXG4gICAgV29ybGRBc3NldHMsXHJcbn0gZnJvbSAnLi9hc3NldHMvQXNzZXRzJztcclxuaW1wb3J0IHsgTWFpbk1lbnUgfSBmcm9tICcuL3VpL3NjcmVlbnMvTWFpbk1lbnUnO1xyXG5pbXBvcnQgeyBTb2NrZXQgfSBmcm9tICdzb2NrZXQuaW8tY2xpZW50JztcclxuaW1wb3J0IFVpU2NyZWVuIGZyb20gJy4vdWkvVWlTY3JlZW4nO1xyXG5pbXBvcnQgeyBQYXVzZU1lbnUgfSBmcm9tICcuL3VpL3NjcmVlbnMvUGF1c2VNZW51JztcclxuaW1wb3J0IHsgTmV0TWFuYWdlciB9IGZyb20gJy4vd2Vic29ja2V0L05ldE1hbmFnZXInO1xyXG5cclxuaW1wb3J0IHsgQ2xpZW50RXZlbnRzLCBTZXJ2ZXJFdmVudHMgfSBmcm9tICcuLi8uLi9hcGkvQVBJJztcclxuaW1wb3J0IEl0ZW1TdGFjayBmcm9tICcuL3dvcmxkL2l0ZW1zL0l0ZW1TdGFjayc7XHJcblxyXG4vKlxyXG4vLy9JTkZPUk1BVElPTlxyXG4vL1N0YXJ0aW5nIGEgZ2FtZVxyXG5QcmVzcyBMaXZlIFNlcnZlciB0byBzdGFydCB0aGUgZ2FtZVxyXG5vclxyXG5UeXBlIG5wbSBydW4gcHJlc3RhcnQgdG8gc3RhcnQgdGhlIGdhbWUuXHJcbi8vVE9ET1xyXG5XaGVuIHNvbWV0aGluZyBpbiB0aGUgdG9kbyBzZWN0aW9uLCBlaXRoZXIgZGVsZXRlIGl0IGFuZCBtYXJrIHdoYXQgd2FzIGRvbmUgaW4gdGhlIGRlc2NyaXB0aW9uIC1cclxuLSB3aGVuIHB1c2hpbmcsIG9yIGp1c3QgbWFyayBpdCBsaWtlIHRoaXNcclxuKGV4YW1wbGU6IENyZWF0ZSBhIG51Y2xlYXIgZXhwbG9zaW9uIC0tIFgpXHJcbi8vL0dFTkVSQUwgVE9ETzpcclxuXHJcbi8vQXVkaW9cclxuc291bmRzXHJcbm11c2ljXHJcbk5QQydzXHJcblxyXG4vL1Zpc3VhbFxyXG5VcGRhdGUgc25vdyB0ZXh0dXJlc1xyXG5VcGRhdGUgR1VJIHRleHR1cmVzXHJcbnBsYXllciBjaGFyYWN0ZXJcclxuaXRlbSBsb3JlIGltcGxlbWVudGVkXHJcblxyXG4vL0dhbWVwbGF5XHJcbmZpbmlzaCBpdGVtIG1hbmFnZW1lbnRcclxucGF1c2UgbWVudVxyXG5IdW5nZXIsIGhlYXQsIGV0YyBzeXN0ZW1cclxuaXRlbSBjcmVhdGlvblxyXG5pdGVtIHVzZVxyXG5QYXJlbnQgV29ya2JlbmNoXHJcblxyXG4vL09iamVjdHNcclxuZGlydFxyXG5zdG9uZVxyXG53b3JrYmVuY2hcclxuYmFja3BhY2sgKHVzZWQgYXMgY2hlc3QpXHJcblxyXG4vL1BvbGlzaFxyXG5iZXR0ZXIgd29ybGQgZ2VuZXJhdGlvblxyXG5mb250IGNvbnNpc3RlbmN5XHJcbmZpeCBjdXJzb3IgaW5wdXQgbGFnIChzZXBhcmF0ZSBjdXJzb3IgYW5kIGFuaW1hdGlvbiBpbWFnZXMpXHJcbmZpeCBzdHVjayBvbiBzaWRlIG9mIGJsb2NrIGJ1Z1xyXG5maXggY29sbGlkZSB3aXRoIHNpZGVzIG9mIG1hcCBidWdcclxuXHJcbml0ZW0gbWFuYWdlbWVudCBiZWhhdmlvciB0b2RvOlxyXG5tZXJnZVxyXG5yaWdodCBjbGljayBzdGFjayB0byBwaWNrIHVwIGNlaWwoaGFsZiBvZiBpdClcclxucmlnaHQgY2xpY2sgd2hlbiBwaWNrZWQgdXAgdG8gYWRkIDEgaWYgMCBvciBtYXRjaFxyXG5jcmFmdGFibGVzXHJcblxyXG4qL1xyXG5cclxuY2xhc3MgR2FtZSBleHRlbmRzIHA1IHtcclxuICAgIHdvcmxkV2lkdGg6IG51bWJlciA9IDUxMjsgLy8gd2lkdGggb2YgdGhlIHdvcmxkIGluIHRpbGVzICAgPCE+IE1BS0UgU1VSRSBUSElTIElTIE5FVkVSIExFU1MgVEhBTiA2NCEhISA8IT5cclxuICAgIHdvcmxkSGVpZ2h0OiBudW1iZXIgPSA2NDsgLy8gaGVpZ2h0IG9mIHRoZSB3b3JsZCBpbiB0aWxlcyAgPCE+IE1BS0UgU1VSRSBUSElTIElTIE5FVkVSIExFU1MgVEhBTiA2NCEhISA8IT5cclxuXHJcbiAgICBUSUxFX1dJRFRIOiBudW1iZXIgPSA4OyAvLyB3aWR0aCBvZiBhIHRpbGVzIGluIHBpeGVsc1xyXG4gICAgVElMRV9IRUlHSFQ6IG51bWJlciA9IDg7IC8vIGhlaWdodCBvZiBhIHRpbGVzIGluIHBpeGVsc1xyXG4gICAgQkFDS19USUxFX1dJRFRIOiBudW1iZXIgPSAxMjsgLy8gd2lkdGggb2YgYSB0aWxlcyBpbiBwaXhlbHNcclxuICAgIEJBQ0tfVElMRV9IRUlHSFQ6IG51bWJlciA9IDEyOyAvLyBoZWlnaHQgb2YgYSB0aWxlcyBpbiBwaXhlbHNcclxuXHJcbiAgICB1cHNjYWxlU2l6ZTogbnVtYmVyID0gNjsgLy8gbnVtYmVyIG9mIHNjcmVlbiBwaXhlbHMgcGVyIHRleHR1cmUgcGl4ZWxzICh0aGluayBvZiB0aGlzIGFzIGh1ZCBzY2FsZSBpbiBNaW5lY3JhZnQpXHJcblxyXG4gICAgY2FtWDogbnVtYmVyID0gMDsgLy8gcG9zaXRpb24gb2YgdGhlIHRvcCBsZWZ0IGNvcm5lciBvZiB0aGUgc2NyZWVuIGluIHVuLXVwLXNjYWxlZCBwaXhlbHMgKDAgaXMgbGVmdCBvZiB3b3JsZCkgKHdvcmxkV2lkdGgqVElMRV9XSURUSCBpcyBib3R0b20gb2Ygd29ybGQpXHJcbiAgICBjYW1ZOiBudW1iZXIgPSAwOyAvLyBwb3NpdGlvbiBvZiB0aGUgdG9wIGxlZnQgY29ybmVyIG9mIHRoZSBzY3JlZW4gaW4gdW4tdXAtc2NhbGVkIHBpeGVscyAoMCBpcyB0b3Agb2Ygd29ybGQpICh3b3JsZEhlaWdodCpUSUxFX0hFSUdIVCBpcyBib3R0b20gb2Ygd29ybGQpXHJcbiAgICBwQ2FtWDogbnVtYmVyID0gMDsgLy8gbGFzdCBmcmFtZSdzIHggb2YgdGhlIGNhbWVyYVxyXG4gICAgcENhbVk6IG51bWJlciA9IDA7IC8vIGxhc3QgZnJhbWUncyB5IG9mIHRoZSBjYW1lcmFcclxuICAgIGludGVycG9sYXRlZENhbVg6IG51bWJlciA9IDA7IC8vIGludGVycG9sYXRlZCBwb3NpdGlvbiBvZiB0aGUgY2FtZXJhXHJcbiAgICBpbnRlcnBvbGF0ZWRDYW1ZOiBudW1iZXIgPSAwOyAvLyBpbnRlcnBvbGF0ZWQgcG9zaXRpb24gb2YgdGhlIGNhbWVyYVxyXG5cclxuICAgIC8vIHRpY2sgbWFuYWdlbWVudFxyXG4gICAgbXNTaW5jZVRpY2s6IG51bWJlciA9IDA7IC8vIHRoaXMgaXMgdGhlIHJ1bm5pbmcgY291bnRlciBvZiBob3cgbWFueSBtaWxsaXNlY29uZHMgaXQgaGFzIGJlZW4gc2luY2UgdGhlIGxhc3QgdGljay4gIFRoZSBnYW1lIGNhbiB0aGVuXHJcbiAgICBtc1BlclRpY2s6IG51bWJlciA9IDIwOyAvLyB0aGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBwZXIgZ2FtZSB0aWNrLiAgMTAwMC9tc1BlclRpY2sgPSB0aWNrcyBwZXIgc2Vjb25kXHJcbiAgICBhbW91bnRTaW5jZUxhc3RUaWNrOiBudW1iZXIgPSAwOyAvLyB0aGlzIGlzIGEgdmFyaWFibGUgY2FsY3VsYXRlZCBldmVyeSBmcmFtZSB1c2VkIGZvciBpbnRlcnBvbGF0aW9uIC0gZG9tYWluWzAsMSlcclxuICAgIGZvcmdpdmVuZXNzQ291bnQ6IG51bWJlciA9IDUwOyAvLyBpZiB0aGUgY29tcHV0ZXIgbmVlZHMgdG8gZG8gbW9yZSB0aGFuIDUwIHRpY2tzIGluIGEgc2luZ2xlIGZyYW1lLCB0aGVuIGl0IGNvdWxkIGJlIHJ1bm5pbmcgYmVoaW5kLCBwcm9iYWJseSBiZWNhdXNlIG9mIGEgZnJlZXplIG9yIHRoZSB1c2VyIGJlaW5nIG9uIGEgZGlmZmVyZW50IHRhYi4gIEluIHRoZXNlIGNhc2VzLCBpdCdzIHByb2JhYmx5IGJlc3QgdG8ganVzdCBpZ25vcmUgdGhhdCBhbnkgdGltZSBoYXMgcGFzc2VkIHRvIGF2b2lkIGZ1cnRoZXIgZnJlZXppbmdcclxuXHJcbiAgICAvLyBwaHlzaWNzIGNvbnN0YW50c1xyXG4gICAgR1JBVklUWV9TUEVFRDogbnVtYmVyID0gMC4wNDsgLy8gaW4gdW5pdHMgcGVyIHNlY29uZCB0aWNrLCBwb3NpdGl2ZSBtZWFucyBkb3dud2FyZCBncmF2aXR5LCBuZWdhdGl2ZSBtZWFucyB1cHdhcmQgZ3Jhdml0eVxyXG4gICAgRFJBR19DT0VGRklDSUVOVDogbnVtYmVyID0gMC4yMTsgLy8gYXJiaXRyYXJ5IG51bWJlciwgMCBtZWFucyBubyBkcmFnXHJcblxyXG4gICAgLy8gYXJyYXkgZm9yIGFsbCB0aGUgaXRlbXNcclxuICAgIC8vaXRlbXM6IEVudGl0eUl0ZW1bXSA9IFtdO1xyXG5cclxuICAgIC8vIENIQVJBQ1RFUiBTSE9VTEQgQkUgUk9VR0hMWSAxMiBQSVhFTFMgQlkgMjAgUElYRUxTXHJcblxyXG4gICAgaG90QmFyOiBJdGVtU3RhY2tbXSA9IG5ldyBBcnJheSg5KTtcclxuICAgIHNlbGVjdGVkU2xvdCA9IDA7XHJcbiAgICBwaWNrZWRVcFNsb3QgPSAtMTtcclxuXHJcbiAgICB3b3JsZE1vdXNlWCA9IDA7IC8vIHRoZSBtb3VzZSBwb3NpdGlvbiBpbiB3b3JsZCBjb29yZGluYXRlc1xyXG4gICAgd29ybGRNb3VzZVkgPSAwOyAvLyB0aGUgbW91c2UgcG9zaXRpb24gaW4gd29ybGQgY29vcmRpbmF0ZXNcclxuICAgIG1vdXNlT24gPSB0cnVlOyAvLyBpcyB0aGUgbW91c2Ugb24gdGhlIHdpbmRvdz9cclxuXHJcbiAgICBrZXlzOiBib29sZWFuW10gPSBbXTtcclxuXHJcbiAgICAvLyB0aGUga2V5Y29kZSBmb3IgdGhlIGtleSB0aGF0IGRvZXMgdGhlIGFjdGlvblxyXG4gICAgY29udHJvbHMgPSBbXHJcbiAgICAgICAgNjgsIC8vIHJpZ2h0XHJcbiAgICAgICAgNjUsIC8vIGxlZnRcclxuICAgICAgICA4NywgLy8ganVtcFxyXG4gICAgICAgIDI3LCAvLyBzZXR0aW5nc1xyXG4gICAgICAgIDY5LCAvLyBpbnZlbnRvcnk/XHJcbiAgICAgICAgNDksIC8vIGhvdCBiYXIgMVxyXG4gICAgICAgIDUwLCAvLyBob3QgYmFyIDJcclxuICAgICAgICA1MSwgLy8gaG90IGJhciAzXHJcbiAgICAgICAgNTIsIC8vIGhvdCBiYXIgNFxyXG4gICAgICAgIDUzLCAvLyBob3QgYmFyIDVcclxuICAgICAgICA1NCwgLy8gaG90IGJhciA2XHJcbiAgICAgICAgNTUsIC8vIGhvdCBiYXIgN1xyXG4gICAgICAgIDU2LCAvLyBob3QgYmFyIDhcclxuICAgICAgICA1NyAvLyBob3QgYmFyIDlcclxuICAgIF07XHJcblxyXG4gICAgY2FudmFzOiBwNS5SZW5kZXJlcjtcclxuICAgIHNreUxheWVyOiBwNS5HcmFwaGljcztcclxuICAgIHNreVNoYWRlcjogcDUuU2hhZGVyO1xyXG5cclxuICAgIHdvcmxkOiBXb3JsZDtcclxuXHJcbiAgICBjdXJyZW50VWk6IFVpU2NyZWVuIHwgdW5kZWZpbmVkO1xyXG5cclxuICAgIGNvbm5lY3Rpb246IFNvY2tldDxTZXJ2ZXJFdmVudHMsIENsaWVudEV2ZW50cz5cclxuXHJcbiAgICBuZXRNYW5hZ2VyOiBOZXRNYW5hZ2VyXHJcblxyXG4gICAgc2VydmVyVmlzaWJpbGl0eTogc3RyaW5nO1xyXG4gICAgd29ybGRCdW1waW5lc3M6IG51bWJlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihjb25uZWN0aW9uOiBTb2NrZXQpIHtcclxuICAgICAgICBzdXBlcigoKSA9PiB7fSk7IC8vIFRvIGNyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiBwNSBpdCB3aWxsIGNhbGwgYmFjayB3aXRoIHRoZSBpbnN0YW5jZS4gV2UgZG9uJ3QgbmVlZCB0aGlzIHNpbmNlIHdlIGFyZSBleHRlbmRpbmcgdGhlIGNsYXNzXHJcbiAgICAgICAgdGhpcy5jb25uZWN0aW9uID0gY29ubmVjdGlvbjtcclxuXHJcbiAgICAgICAgLy8gSW5pdGlhbGlzZSB0aGUgbmV0d29yayBtYW5hZ2VyXHJcbiAgICAgICAgdGhpcy5uZXRNYW5hZ2VyID0gbmV3IE5ldE1hbmFnZXIodGhpcylcclxuICAgIH1cclxuXHJcbiAgICBwcmVsb2FkKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdMb2FkaW5nIGFzc2V0cycpO1xyXG4gICAgICAgIGxvYWRBc3NldHModGhpcywgVWlBc3NldHMsIEl0ZW1zQXNzZXRzLCBXb3JsZEFzc2V0cywgRm9udHMpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdBc3NldCBsb2FkaW5nIGNvbXBsZXRlZCcpO1xyXG4gICAgICAgIHRoaXMuc2t5U2hhZGVyID0gdGhpcy5sb2FkU2hhZGVyKFwiYXNzZXRzL3NoYWRlcnMvYmFzaWMudmVydFwiLCBcImFzc2V0cy9zaGFkZXJzL3NreS5mcmFnXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldHVwKCkge1xyXG4gICAgICAgIC8vIG1ha2UgYSBjYW52YXMgdGhhdCBmaWxscyB0aGUgd2hvbGUgc2NyZWVuIChhIGNhbnZhcyBpcyB3aGF0IGlzIGRyYXduIHRvIGluIHA1LmpzLCBhcyB3ZWxsIGFzIGxvdHMgb2Ygb3RoZXIgSlMgcmVuZGVyaW5nIGxpYnJhcmllcylcclxuICAgICAgICB0aGlzLmNhbnZhcyA9IHRoaXMuY3JlYXRlQ2FudmFzKHRoaXMud2luZG93V2lkdGgsIHRoaXMud2luZG93SGVpZ2h0KTtcclxuICAgICAgICB0aGlzLmNhbnZhcy5tb3VzZU91dCh0aGlzLm1vdXNlRXhpdGVkKTtcclxuICAgICAgICB0aGlzLmNhbnZhcy5tb3VzZU92ZXIodGhpcy5tb3VzZUVudGVyZWQpO1xyXG5cclxuICAgICAgICB0aGlzLnNreUxheWVyID0gdGhpcy5jcmVhdGVHcmFwaGljcyh0aGlzLndpZHRoLCB0aGlzLmhlaWdodCwgXCJ3ZWJnbFwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5jdXJyZW50VWkgPSBuZXcgTWFpbk1lbnUoRm9udHMudGl0bGUpO1xyXG5cclxuICAgICAgICAvLyBUaWNrXHJcbiAgICAgICAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy53b3JsZCA9PT0gdW5kZWZpbmVkKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMud29ybGQudGljayh0aGlzKTtcclxuICAgICAgICB9LCAxMDAwIC8gdGhpcy5uZXRNYW5hZ2VyLnBsYXllclRpY2tSYXRlKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmNvbm5lY3Rpb24uZW1pdChcclxuICAgICAgICAgICAgJ2pvaW4nLFxyXG4gICAgICAgICAgICAnZTQwMjJkNDAzZGNjNmQxOWQ2YTY4YmEzYWJmZDBhNjAnLFxyXG4gICAgICAgICAgICAncGxheWVyJyArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMDApXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgLy8gZ28gZm9yIGEgc2NhbGUgb2YgPDY0IHRpbGVzIHdpZGUgc2NyZWVuXHJcbiAgICAgICAgdGhpcy53aW5kb3dSZXNpemVkKCk7XHJcblxyXG4gICAgICAgIC8vIHJlbW92ZSB0ZXh0dXJlIGludGVycG9sYXRpb25cclxuICAgICAgICB0aGlzLm5vU21vb3RoKCk7XHJcblxyXG4gICAgICAgIC8vIHRoZSBoaWdoZXN0IGtleWNvZGUgaXMgMjU1LCB3aGljaCBpcyBcIlRvZ2dsZSBUb3VjaHBhZFwiLCBhY2NvcmRpbmcgdG8ga2V5Y29kZS5pbmZvXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAyNTU7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmtleXMucHVzaChmYWxzZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBzZXQgdGhlIGZyYW1lcmF0ZSBnb2FsIHRvIGFzIGhpZ2ggYXMgcG9zc2libGUgKHRoaXMgd2lsbCBlbmQgdXAgY2FwcGluZyB0byB5b3VyIG1vbml0b3IncyByZWZyZXNoIHJhdGUgd2l0aCB2c3luYy4pXHJcbiAgICAgICAgdGhpcy5mcmFtZVJhdGUoSW5maW5pdHkpO1xyXG4gICAgfVxyXG5cclxuICAgIGRyYXcoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZnJhbWVDb3VudD09PTIpIHtcclxuICAgICAgICAgICAgdGhpcy5za3lTaGFkZXIuc2V0VW5pZm9ybShcInNjcmVlbkRpbWVuc2lvbnNcIiwgW3RoaXMuc2t5TGF5ZXIud2lkdGgvdGhpcy51cHNjYWxlU2l6ZSwgdGhpcy5za3lMYXllci5oZWlnaHQvdGhpcy51cHNjYWxlU2l6ZV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBkbyB0aGUgdGljayBjYWxjdWxhdGlvbnNcclxuICAgICAgICB0aGlzLmRvVGlja3MoKTtcclxuXHJcblxyXG5cclxuICAgICAgICAvLyB1cGRhdGUgbW91c2UgcG9zaXRpb25cclxuICAgICAgICB0aGlzLnVwZGF0ZU1vdXNlKCk7XHJcblxyXG4gICAgICAgIC8vIHVwZGF0ZSB0aGUgY2FtZXJhJ3MgaW50ZXJwb2xhdGlvblxyXG4gICAgICAgIHRoaXMubW92ZUNhbWVyYSgpO1xyXG5cclxuICAgICAgICAvLyB3aXBlIHRoZSBzY3JlZW4gd2l0aCBhIGhhcHB5IGxpdHRsZSBsYXllciBvZiBsaWdodCBibHVlXHJcbiAgICAgICAgdGhpcy5za3lTaGFkZXIuc2V0VW5pZm9ybShcIm9mZnNldENvb3Jkc1wiLCBbdGhpcy5pbnRlcnBvbGF0ZWRDYW1YLCB0aGlzLmludGVycG9sYXRlZENhbVldKTtcclxuXHQgICAgdGhpcy5za3lTaGFkZXIuc2V0VW5pZm9ybShcIm1pbGxpc1wiLCB0aGlzLm1pbGxpcygpKTtcclxuICAgICAgICB0aGlzLnNreUxheWVyLnNoYWRlcih0aGlzLnNreVNoYWRlcik7XHJcbiAgICAgICAgLy8gdGhpcy5maWxsKDI1NSwgMCwgMCk7XHJcbiAgICAgICAgdGhpcy5za3lMYXllci5yZWN0KDAsIDAsIHRoaXMuc2t5TGF5ZXIud2lkdGgsIHRoaXMuc2t5TGF5ZXIuaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgdGhpcy5pbWFnZSh0aGlzLnNreUxheWVyLCAwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLndvcmxkICE9PSB1bmRlZmluZWQpIHRoaXMud29ybGQucmVuZGVyKHRoaXMsIHRoaXMudXBzY2FsZVNpemUpO1xyXG5cclxuICAgICAgICAvLyByZW5kZXIgdGhlIHBsYXllciwgYWxsIGl0ZW1zLCBldGMuICBCYXNpY2FsbHkgYW55IHBoeXNpY3NSZWN0IG9yIHBhcnRpY2xlXHJcbiAgICAgICAgdGhpcy5yZW5kZXJFbnRpdGllcygpO1xyXG5cclxuICAgICAgICAvLyBkcmF3IHRoZSBob3QgYmFyXHJcbiAgICAgICAgdGhpcy5ub1N0cm9rZSgpO1xyXG4gICAgICAgIHRoaXMudGV4dEFsaWduKHRoaXMuUklHSFQsIHRoaXMuQk9UVE9NKTtcclxuICAgICAgICB0aGlzLnRleHRTaXplKDUgKiB0aGlzLnVwc2NhbGVTaXplKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaG90QmFyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnNlbGVjdGVkU2xvdCA9PT0gaSkge1xyXG4gICAgICAgICAgICAgICAgVWlBc3NldHMudWlfc2xvdF9zZWxlY3RlZC5yZW5kZXIoXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcyxcclxuICAgICAgICAgICAgICAgICAgICAyICogdGhpcy51cHNjYWxlU2l6ZSArIDE2ICogaSAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgICAgICAgICAgMiAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgICAgICAgICAgMTYgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICAgICAgICAgIDE2ICogdGhpcy51cHNjYWxlU2l6ZVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIFVpQXNzZXRzLnVpX3Nsb3QucmVuZGVyKFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMsXHJcbiAgICAgICAgICAgICAgICAgICAgMiAqIHRoaXMudXBzY2FsZVNpemUgKyAxNiAqIGkgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICAgICAgICAgIDIgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICAgICAgICAgIDE2ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICAxNiAqIHRoaXMudXBzY2FsZVNpemVcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmhvdEJhcltpXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpbGwoMCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5waWNrZWRVcFNsb3QgPT09IGkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRpbnQoMjU1LCAxMjcpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmlsbCgwLCAxMjcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuaG90QmFyW2ldLnRleHR1cmUucmVuZGVyKFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMsXHJcbiAgICAgICAgICAgICAgICAgICAgNiAqIHRoaXMudXBzY2FsZVNpemUgKyAxNiAqIGkgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICAgICAgICAgIDYgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICAgICAgICAgIDggKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICAgICAgICAgIDggKiB0aGlzLnVwc2NhbGVTaXplXHJcbiAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMudGV4dChcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhvdEJhcltpXS5zdGFja1NpemUsXHJcbiAgICAgICAgICAgICAgICAgICAgMTYgKiB0aGlzLnVwc2NhbGVTaXplICsgMTYgKiBpICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICAxNiAqIHRoaXMudXBzY2FsZVNpemVcclxuICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5ub1RpbnQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gZHJhdyB0aGUgY3Vyc29yXHJcbiAgICAgICAgdGhpcy5kcmF3Q3Vyc29yKCk7XHJcblxyXG4gICAgICAgIC8vIHRoaXMuY3VycmVudFVpLnJlbmRlcih0aGlzLCB0aGlzLnVwc2NhbGVTaXplKTtcclxuXHJcbiAgICAgICAgLy8gY29uc29sZS50aW1lRW5kKFwiZnJhbWVcIik7XHJcbiAgICB9XHJcblxyXG4gICAgd2luZG93UmVzaXplZCgpIHtcclxuICAgICAgICB0aGlzLnJlc2l6ZUNhbnZhcyh0aGlzLndpbmRvd1dpZHRoLCB0aGlzLndpbmRvd0hlaWdodCk7XHJcblxyXG4gICAgICAgIC8vIGdvIGZvciBhIHNjYWxlIG9mIDw0OCB0aWxlcyBzY3JlZW5cclxuICAgICAgICB0aGlzLnVwc2NhbGVTaXplID0gTWF0aC5taW4oXHJcbiAgICAgICAgICAgIHRoaXMuY2VpbCh0aGlzLndpbmRvd1dpZHRoIC8gNDggLyB0aGlzLlRJTEVfV0lEVEgpLFxyXG4gICAgICAgICAgICB0aGlzLmNlaWwodGhpcy53aW5kb3dIZWlnaHQgLyA0OCAvIHRoaXMuVElMRV9IRUlHSFQpXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgdGhpcy5jdXJyZW50VWkud2luZG93VXBkYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAga2V5UHJlc3NlZCgpIHtcclxuICAgICAgICB0aGlzLmtleXNbdGhpcy5rZXlDb2RlXSA9IHRydWU7XHJcbiAgICAgICAgaWYgKHRoaXMuY29udHJvbHMuaW5jbHVkZXModGhpcy5rZXlDb2RlKSkge1xyXG4gICAgICAgICAgICAvLyBob3QgYmFyIHNsb3RzXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTI7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMua2V5Q29kZSA9PT0gdGhpcy5jb250cm9sc1tpICsgNV0pIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubW91c2VYID4gMiAqIHRoaXMudXBzY2FsZVNpemUgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3VzZVggPFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgMiAqIHRoaXMudXBzY2FsZVNpemUgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDE2ICogdGhpcy51cHNjYWxlU2l6ZSAqIHRoaXMuaG90QmFyLmxlbmd0aCAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdXNlWSA+IDIgKiB0aGlzLnVwc2NhbGVTaXplICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubW91c2VZIDwgMTggKiB0aGlzLnVwc2NhbGVTaXplXHJcbiAgICAgICAgICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRlbXAgPSB0aGlzLmhvdEJhcltpXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ob3RCYXJbaV0gPVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ob3RCYXJbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5mbG9vcihcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHRoaXMubW91c2VYIC0gMiAqIHRoaXMudXBzY2FsZVNpemUpIC9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDE2IC9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBzY2FsZVNpemVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhvdEJhcltcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmxvb3IoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHRoaXMubW91c2VYIC0gMiAqIHRoaXMudXBzY2FsZVNpemUpIC9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMTYgL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwc2NhbGVTaXplXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0gPSB0ZW1wO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB0aGlzLnNlbGVjdGVkU2xvdCA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5rZXlDb2RlID09PSB0aGlzLmNvbnRyb2xzWzRdKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnSW52ZW50b3J5IG9wZW5lZCcpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5rZXlDb2RlID09PSB0aGlzLmNvbnRyb2xzWzNdKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInBhdXNlZFwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFVpID0gbmV3IFBhdXNlTWVudShGb250cy50aXRsZSk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmN1cnJlbnRVaSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAga2V5UmVsZWFzZWQoKSB7XHJcbiAgICAgICAgdGhpcy5rZXlzW3RoaXMua2V5Q29kZV0gPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyB3aGVuIGl0J3MgZHJhZ2dlZCB1cGRhdGUgdGhlIHNsaWRlcnNcclxuICAgIG1vdXNlRHJhZ2dlZCgpIHtcclxuICAgICAgICBpZih0aGlzLmN1cnJlbnRVaSAhPT0gdW5kZWZpbmVkICYmIHRoaXMuY3VycmVudFVpLnNsaWRlcnMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBmb3IoY29uc3QgaSBvZiB0aGlzLmN1cnJlbnRVaS5zbGlkZXJzKSB7XHJcbiAgICAgICAgICAgICAgICBpLnVwZGF0ZVNsaWRlclBvc2l0aW9uKHRoaXMubW91c2VYKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBtb3VzZU1vdmVkKCkge1xyXG4gICAgICAgIGlmKHRoaXMuY3VycmVudFVpICE9PSB1bmRlZmluZWQgJiYgdGhpcy5jdXJyZW50VWkuYnV0dG9ucyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGZvcihjb25zdCBpIG9mIHRoaXMuY3VycmVudFVpLmJ1dHRvbnMpIHtcclxuICAgICAgICAgICAgICAgIGkudXBkYXRlTW91c2VPdmVyKHRoaXMubW91c2VYLCB0aGlzLm1vdXNlWSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbW91c2VQcmVzc2VkKCkge1xyXG4gICAgICAgIC8vIGltYWdlKHVpU2xvdEltYWdlLCAyKnVwc2NhbGVTaXplKzE2KmkqdXBzY2FsZVNpemUsIDIqdXBzY2FsZVNpemUsIDE2KnVwc2NhbGVTaXplLCAxNip1cHNjYWxlU2l6ZSk7XHJcbiAgICAgICAgaWYodGhpcy5jdXJyZW50VWkgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRVaS5tb3VzZVByZXNzZWQoKTtcclxuICAgICAgICAgICAgcmV0dXJuOy8vIGFzamdzYWRramZnSUlTVVNVRVVFXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChcclxuICAgICAgICAgICAgdGhpcy5tb3VzZVggPiAyICogdGhpcy51cHNjYWxlU2l6ZSAmJlxyXG4gICAgICAgICAgICB0aGlzLm1vdXNlWCA8XHJcbiAgICAgICAgICAgICAgICAyICogdGhpcy51cHNjYWxlU2l6ZSArXHJcbiAgICAgICAgICAgICAgICAgICAgMTYgKiB0aGlzLnVwc2NhbGVTaXplICogdGhpcy5ob3RCYXIubGVuZ3RoICYmXHJcbiAgICAgICAgICAgIHRoaXMubW91c2VZID4gMiAqIHRoaXMudXBzY2FsZVNpemUgJiZcclxuICAgICAgICAgICAgdGhpcy5tb3VzZVkgPCAxOCAqIHRoaXMudXBzY2FsZVNpemVcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgY29uc3QgY2xpY2tlZFNsb3Q6IG51bWJlciA9IHRoaXMuZmxvb3IoXHJcbiAgICAgICAgICAgICAgICAodGhpcy5tb3VzZVggLSAyICogdGhpcy51cHNjYWxlU2l6ZSkgLyAxNiAvIHRoaXMudXBzY2FsZVNpemVcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnBpY2tlZFVwU2xvdCA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmhvdEJhcltjbGlja2VkU2xvdF0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGlja2VkVXBTbG90ID0gY2xpY2tlZFNsb3Q7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBTd2FwIGNsaWNrZWQgc2xvdCB3aXRoIHRoZSBwaWNrZWQgc2xvdFxyXG4gICAgICAgICAgICAgICAgW3RoaXMuaG90QmFyW3RoaXMucGlja2VkVXBTbG90XSwgdGhpcy5ob3RCYXJbY2xpY2tlZFNsb3RdXSA9IFtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhvdEJhcltjbGlja2VkU2xvdF0sXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ob3RCYXJbdGhpcy5waWNrZWRVcFNsb3RdLFxyXG4gICAgICAgICAgICAgICAgXTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBTZXQgdGhlIHBpY2tlZCB1cCBzbG90IHRvIG5vdGhpbmdcclxuICAgICAgICAgICAgICAgIHRoaXMucGlja2VkVXBTbG90ID0gLTE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBJZiB0aGUgdGlsZXMgaXMgYWlyXHJcbiAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgIHRoaXMud29ybGQud29ybGRUaWxlc1tcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLndvcmxkLndpZHRoICogdGhpcy53b3JsZE1vdXNlWSArIHRoaXMud29ybGRNb3VzZVhcclxuICAgICAgICAgICAgICAgIF0gPT09IDBcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jb25uZWN0aW9uLmVtaXQoXHJcbiAgICAgICAgICAgICAgICAnd29ybGRCcmVha1N0YXJ0JyxcclxuICAgICAgICAgICAgICAgIHRoaXMud29ybGQud2lkdGggKiB0aGlzLndvcmxkTW91c2VZICsgdGhpcy53b3JsZE1vdXNlWFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB0aGlzLmNvbm5lY3Rpb24uZW1pdCgnd29ybGRCcmVha0ZpbmlzaCcpO1xyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICBjb25zdCB0aWxlczogVGlsZSA9XHJcbiAgICAgICAgICAgICAgICBXb3JsZFRpbGVzW1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMud29ybGQud29ybGRUaWxlc1tcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5XT1JMRF9XSURUSCAqIHRoaXMud29ybGRNb3VzZVkgKyB0aGlzLndvcmxkTW91c2VYXHJcbiAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgXTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aWxlcyA9PT0gdW5kZWZpbmVkKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBpZiAodGlsZXMuaXRlbURyb3AgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgLy8gRGVmYXVsdCBkcm9wIHF1YW50aXR5XHJcbiAgICAgICAgICAgICAgICBsZXQgcXVhbnRpdHk6IG51bWJlciA9IDE7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gVXBkYXRlIHRoZSBxdWFudGl0eSBiYXNlZCBvblxyXG4gICAgICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgICAgIHRpbGVzLml0ZW1Ecm9wTWF4ICE9PSB1bmRlZmluZWQgJiZcclxuICAgICAgICAgICAgICAgICAgICB0aWxlcy5pdGVtRHJvcE1pbiAhPT0gdW5kZWZpbmVkXHJcbiAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICBxdWFudGl0eSA9IE1hdGgucm91bmQoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIE1hdGgucmFuZG9tKCkgKiAodGlsZXMuaXRlbURyb3BNYXggLSB0aWxlcy5pdGVtRHJvcE1pbikgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlsZXMuaXRlbURyb3BNaW5cclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aWxlcy5pdGVtRHJvcE1heCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcXVhbnRpdHkgPSB0aWxlcy5pdGVtRHJvcE1heDtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRyb3BJdGVtU3RhY2soXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IEl0ZW1TdGFjayh0aWxlcy5pdGVtRHJvcCwgcXVhbnRpdHkpLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMud29ybGRNb3VzZVgsXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53b3JsZE1vdXNlWVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcblxyXG4gICAgICAgICAgICAqL1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBtb3VzZVJlbGVhc2VkKCkge1xyXG4gICAgICAgIGlmKHRoaXMuY3VycmVudFVpICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50VWkubW91c2VSZWxlYXNlZCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCByZWxlYXNlZFNsb3Q6IG51bWJlciA9IHRoaXMuZmxvb3IoXHJcbiAgICAgICAgICAgICh0aGlzLm1vdXNlWCAtIDIgKiB0aGlzLnVwc2NhbGVTaXplKSAvIDE2IC8gdGhpcy51cHNjYWxlU2l6ZVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnBpY2tlZFVwU2xvdCAhPT0gLTEpIHtcclxuICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tb3VzZVggPiAyICogdGhpcy51cHNjYWxlU2l6ZSAmJlxyXG4gICAgICAgICAgICAgICAgdGhpcy5tb3VzZVggPFxyXG4gICAgICAgICAgICAgICAgICAgIDIgKiB0aGlzLnVwc2NhbGVTaXplICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgMTYgKiB0aGlzLnVwc2NhbGVTaXplICogdGhpcy5ob3RCYXIubGVuZ3RoICYmXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vdXNlWSA+IDIgKiB0aGlzLnVwc2NhbGVTaXplICYmXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vdXNlWSA8IDE4ICogdGhpcy51cHNjYWxlU2l6ZVxyXG4gICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgIC8vIE1ha2Ugc3VyZSB0aGF0IHRoZSBzbG90IHRoYXQgdGhlIGN1cnNvciB3YXMgcmVsZWFzZWQgd2FzIG5vdCB0aGUgc2xvdCB0aGF0IHdhcyBzZWxlY3RlZFxyXG4gICAgICAgICAgICAgICAgaWYgKHJlbGVhc2VkU2xvdCA9PT0gdGhpcy5waWNrZWRVcFNsb3QpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBTd2FwIHRoZSBwaWNrZWQgdXAgc2xvdCB3aXRoIHRoZSBzbG90IHRoZSBtb3VzZSB3YXMgcmVsZWFzZWQgb25cclxuICAgICAgICAgICAgICAgIFt0aGlzLmhvdEJhclt0aGlzLnBpY2tlZFVwU2xvdF0sIHRoaXMuaG90QmFyW3JlbGVhc2VkU2xvdF1dID0gW1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaG90QmFyW3JlbGVhc2VkU2xvdF0sXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ob3RCYXJbdGhpcy5waWNrZWRVcFNsb3RdLFxyXG4gICAgICAgICAgICAgICAgXTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnBpY2tlZFVwU2xvdCA9IC0xO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ob3RCYXJbdGhpcy5waWNrZWRVcFNsb3RdID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5waWNrZWRVcFNsb3QgPSAtMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBtb3ZlQ2FtZXJhKCkge1xyXG4gICAgICAgIHRoaXMuaW50ZXJwb2xhdGVkQ2FtWCA9XHJcbiAgICAgICAgICAgIHRoaXMucENhbVggKyAodGhpcy5jYW1YIC0gdGhpcy5wQ2FtWCkgKiB0aGlzLmFtb3VudFNpbmNlTGFzdFRpY2s7XHJcbiAgICAgICAgdGhpcy5pbnRlcnBvbGF0ZWRDYW1ZID1cclxuICAgICAgICAgICAgdGhpcy5wQ2FtWSArICh0aGlzLmNhbVkgLSB0aGlzLnBDYW1ZKSAqIHRoaXMuYW1vdW50U2luY2VMYXN0VGljaztcclxuICAgIH1cclxuXHJcbiAgICBkb1RpY2tzKCkge1xyXG4gICAgICAgIC8vIGluY3JlYXNlIHRoZSB0aW1lIHNpbmNlIGEgdGljayBoYXMgaGFwcGVuZWQgYnkgZGVsdGFUaW1lLCB3aGljaCBpcyBhIGJ1aWx0LWluIHA1LmpzIHZhbHVlXHJcbiAgICAgICAgdGhpcy5tc1NpbmNlVGljayArPSB0aGlzLmRlbHRhVGltZTtcclxuXHJcbiAgICAgICAgLy8gZGVmaW5lIGEgdGVtcG9yYXJ5IHZhcmlhYmxlIGNhbGxlZCB0aWNrc1RoaXNGcmFtZSAtIHRoaXMgaXMgdXNlZCB0byBrZWVwIHRyYWNrIG9mIGhvdyBtYW55IHRpY2tzIGhhdmUgYmVlbiBjYWxjdWxhdGVkIHdpdGhpbiB0aGUgZHVyYXRpb24gb2YgdGhlIGN1cnJlbnQgZnJhbWUuICBBcyBsb25nIGFzIHRoaXMgdmFsdWUgaXMgbGVzcyB0aGFuIHRoZSBmb3JnaXZlbmVzc0NvdW50IHZhcmlhYmxlLCBpdCBjb250aW51ZXMgdG8gY2FsY3VsYXRlIHRpY2tzIGFzIG5lY2Vzc2FyeS5cclxuICAgICAgICBsZXQgdGlja3NUaGlzRnJhbWUgPSAwO1xyXG4gICAgICAgIHdoaWxlIChcclxuICAgICAgICAgICAgdGhpcy5tc1NpbmNlVGljayA+IHRoaXMubXNQZXJUaWNrICYmXHJcbiAgICAgICAgICAgIHRpY2tzVGhpc0ZyYW1lICE9PSB0aGlzLmZvcmdpdmVuZXNzQ291bnRcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgLy8gY29uc29sZS50aW1lKFwidGlja1wiKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMud29ybGQgIT09IHVuZGVmaW5lZCkgdGhpcy5kb1RpY2soKTtcclxuICAgICAgICAgICAgLy8gY29uc29sZS50aW1lRW5kKFwidGlja1wiKTtcclxuICAgICAgICAgICAgdGhpcy5tc1NpbmNlVGljayAtPSB0aGlzLm1zUGVyVGljaztcclxuICAgICAgICAgICAgdGlja3NUaGlzRnJhbWUrKztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRpY2tzVGhpc0ZyYW1lID09PSB0aGlzLmZvcmdpdmVuZXNzQ291bnQpIHtcclxuICAgICAgICAgICAgdGhpcy5tc1NpbmNlVGljayA9IDA7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcclxuICAgICAgICAgICAgICAgIFwibGFnIHNwaWtlIGRldGVjdGVkLCB0aWNrIGNhbGN1bGF0aW9ucyBjb3VsZG4ndCBrZWVwIHVwXCJcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5hbW91bnRTaW5jZUxhc3RUaWNrID0gdGhpcy5tc1NpbmNlVGljayAvIHRoaXMubXNQZXJUaWNrO1xyXG4gICAgfVxyXG5cclxuICAgIGRvVGljaygpIHtcclxuICAgICAgICBpZih0aGlzLndvcmxkLnBsYXllciA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICB0aGlzLndvcmxkLnBsYXllci5rZXlib2FyZElucHV0KCk7XHJcbiAgICAgICAgdGhpcy53b3JsZC5wbGF5ZXIuYXBwbHlHcmF2aXR5QW5kRHJhZygpO1xyXG4gICAgICAgIHRoaXMud29ybGQucGxheWVyLmFwcGx5VmVsb2NpdHlBbmRDb2xsaWRlKCk7XHJcblxyXG4gICAgICAgIHRoaXMucENhbVggPSB0aGlzLmNhbVg7XHJcbiAgICAgICAgdGhpcy5wQ2FtWSA9IHRoaXMuY2FtWTtcclxuICAgICAgICBjb25zdCBkZXNpcmVkQ2FtWCA9XHJcbiAgICAgICAgICAgIHRoaXMud29ybGQucGxheWVyLnggK1xyXG4gICAgICAgICAgICB0aGlzLndvcmxkLnBsYXllci53aWR0aCAvIDIgLVxyXG4gICAgICAgICAgICB0aGlzLndpZHRoIC8gMiAvIHRoaXMuVElMRV9XSURUSCAvIHRoaXMudXBzY2FsZVNpemUgK1xyXG4gICAgICAgICAgICB0aGlzLndvcmxkLnBsYXllci54VmVsICogNDA7XHJcbiAgICAgICAgY29uc3QgZGVzaXJlZENhbVkgPVxyXG4gICAgICAgICAgICB0aGlzLndvcmxkLnBsYXllci55ICtcclxuICAgICAgICAgICAgdGhpcy53b3JsZC5wbGF5ZXIuaGVpZ2h0IC8gMiAtXHJcbiAgICAgICAgICAgIHRoaXMuaGVpZ2h0IC8gMiAvIHRoaXMuVElMRV9IRUlHSFQgLyB0aGlzLnVwc2NhbGVTaXplICtcclxuICAgICAgICAgICAgdGhpcy53b3JsZC5wbGF5ZXIueVZlbCAqIDIwO1xyXG4gICAgICAgIHRoaXMuY2FtWCA9IChkZXNpcmVkQ2FtWCArIHRoaXMuY2FtWCAqIDI0KSAvIDI1O1xyXG4gICAgICAgIHRoaXMuY2FtWSA9IChkZXNpcmVkQ2FtWSArIHRoaXMuY2FtWSAqIDI0KSAvIDI1O1xyXG5cclxuICAgICAgICBpZiAodGhpcy5jYW1YIDwgMCkge1xyXG4gICAgICAgICAgICB0aGlzLmNhbVggPSAwO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoXHJcbiAgICAgICAgICAgIHRoaXMuY2FtWCA+XHJcbiAgICAgICAgICAgIHRoaXMud29ybGRXaWR0aCAtIHRoaXMud2lkdGggLyB0aGlzLnVwc2NhbGVTaXplIC8gdGhpcy5USUxFX1dJRFRIXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2FtWCA9XHJcbiAgICAgICAgICAgICAgICB0aGlzLndvcmxkV2lkdGggLVxyXG4gICAgICAgICAgICAgICAgdGhpcy53aWR0aCAvIHRoaXMudXBzY2FsZVNpemUgLyB0aGlzLlRJTEVfV0lEVEg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChcclxuICAgICAgICAgICAgdGhpcy5jYW1ZID5cclxuICAgICAgICAgICAgdGhpcy53b3JsZEhlaWdodCAtXHJcbiAgICAgICAgICAgICAgICB0aGlzLmhlaWdodCAvIHRoaXMudXBzY2FsZVNpemUgLyB0aGlzLlRJTEVfSEVJR0hUXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2FtWSA9XHJcbiAgICAgICAgICAgICAgICB0aGlzLndvcmxkSGVpZ2h0IC1cclxuICAgICAgICAgICAgICAgIHRoaXMuaGVpZ2h0IC8gdGhpcy51cHNjYWxlU2l6ZSAvIHRoaXMuVElMRV9IRUlHSFQ7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgLy8gZm9yIChjb25zdCBpdGVtIG9mIHRoaXMuaXRlbXMpIHtcclxuICAgICAgICAvLyAgICAgaXRlbS5nb1Rvd2FyZHNQbGF5ZXIoKTtcclxuICAgICAgICAvLyAgICAgaXRlbS5jb21iaW5lV2l0aE5lYXJJdGVtcygpO1xyXG4gICAgICAgIC8vICAgICBpdGVtLmFwcGx5R3Jhdml0eUFuZERyYWcoKTtcclxuICAgICAgICAvLyAgICAgaXRlbS5hcHBseVZlbG9jaXR5QW5kQ29sbGlkZSgpO1xyXG4gICAgICAgIC8vIH1cclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5pdGVtcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIC8vICAgICBpZiAodGhpcy5pdGVtc1tpXS5kZWxldGVkID09PSB0cnVlKSB7XHJcbiAgICAgICAgLy8gICAgICAgICB0aGlzLml0ZW1zLnNwbGljZShpLCAxKTtcclxuICAgICAgICAvLyAgICAgICAgIGktLTtcclxuICAgICAgICAvLyAgICAgfVxyXG4gICAgICAgIC8vIH1cclxuICAgIH1cclxuXHJcbiAgICB1aUZyYW1lUmVjdCh4OiBudW1iZXIsIHk6IG51bWJlciwgdzogbnVtYmVyLCBoOiBudW1iZXIpIHtcclxuICAgICAgICAvLyBzZXQgdGhlIGNvb3JkcyBhbmQgZGltZW5zaW9ucyB0byByb3VuZCB0byB0aGUgbmVhcmVzdCB1bi11cHNjYWxlZCBwaXhlbFxyXG4gICAgICAgIHggPSB0aGlzLnJvdW5kKHggLyB0aGlzLnVwc2NhbGVTaXplKSAqIHRoaXMudXBzY2FsZVNpemU7XHJcbiAgICAgICAgeSA9IHRoaXMucm91bmQoeSAvIHRoaXMudXBzY2FsZVNpemUpICogdGhpcy51cHNjYWxlU2l6ZTtcclxuICAgICAgICB3ID0gdGhpcy5yb3VuZCh3IC8gdGhpcy51cHNjYWxlU2l6ZSkgKiB0aGlzLnVwc2NhbGVTaXplO1xyXG4gICAgICAgIGggPSB0aGlzLnJvdW5kKGggLyB0aGlzLnVwc2NhbGVTaXplKSAqIHRoaXMudXBzY2FsZVNpemU7XHJcblxyXG4gICAgICAgIC8vIGNvcm5lcnNcclxuICAgICAgICBVaUFzc2V0cy51aV9mcmFtZS5yZW5kZXJQYXJ0aWFsKFxyXG4gICAgICAgICAgICB0aGlzLFxyXG4gICAgICAgICAgICB4LFxyXG4gICAgICAgICAgICB5LFxyXG4gICAgICAgICAgICA3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgNyAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIDcsXHJcbiAgICAgICAgICAgIDdcclxuICAgICAgICApO1xyXG4gICAgICAgIFVpQXNzZXRzLnVpX2ZyYW1lLnJlbmRlclBhcnRpYWwoXHJcbiAgICAgICAgICAgIHRoaXMsXHJcbiAgICAgICAgICAgIHggKyB3IC0gNyAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIHksXHJcbiAgICAgICAgICAgIDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICA3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgOCxcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgNyxcclxuICAgICAgICAgICAgN1xyXG4gICAgICAgICk7XHJcbiAgICAgICAgVWlBc3NldHMudWlfZnJhbWUucmVuZGVyUGFydGlhbChcclxuICAgICAgICAgICAgdGhpcyxcclxuICAgICAgICAgICAgeCxcclxuICAgICAgICAgICAgeSArIGggLSA3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgNyAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICA4LFxyXG4gICAgICAgICAgICA3LFxyXG4gICAgICAgICAgICA3XHJcbiAgICAgICAgKTtcclxuICAgICAgICBVaUFzc2V0cy51aV9mcmFtZS5yZW5kZXJQYXJ0aWFsKFxyXG4gICAgICAgICAgICB0aGlzLFxyXG4gICAgICAgICAgICB4ICsgdyAtIDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICB5ICsgaCAtIDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICA3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgNyAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIDgsXHJcbiAgICAgICAgICAgIDgsXHJcbiAgICAgICAgICAgIDcsXHJcbiAgICAgICAgICAgIDdcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICAvLyB0b3AgYW5kIGJvdHRvbVxyXG4gICAgICAgIFVpQXNzZXRzLnVpX2ZyYW1lLnJlbmRlclBhcnRpYWwoXHJcbiAgICAgICAgICAgIHRoaXMsXHJcbiAgICAgICAgICAgIHggKyA3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgeSxcclxuICAgICAgICAgICAgdyAtIDE0ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgNyAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIDcsXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIDEsXHJcbiAgICAgICAgICAgIDdcclxuICAgICAgICApO1xyXG4gICAgICAgIFVpQXNzZXRzLnVpX2ZyYW1lLnJlbmRlclBhcnRpYWwoXHJcbiAgICAgICAgICAgIHRoaXMsXHJcbiAgICAgICAgICAgIHggKyA3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgeSArIGggLSA3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgdyAtIDE0ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgNyAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIDcsXHJcbiAgICAgICAgICAgIDgsXHJcbiAgICAgICAgICAgIDEsXHJcbiAgICAgICAgICAgIDdcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICAvLyBsZWZ0IGFuZCByaWdodFxyXG4gICAgICAgIFVpQXNzZXRzLnVpX2ZyYW1lLnJlbmRlclBhcnRpYWwoXHJcbiAgICAgICAgICAgIHRoaXMsXHJcbiAgICAgICAgICAgIHgsXHJcbiAgICAgICAgICAgIHkgKyA3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgNyAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIGggLSAxNCAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIDcsXHJcbiAgICAgICAgICAgIDcsXHJcbiAgICAgICAgICAgIDFcclxuICAgICAgICApO1xyXG4gICAgICAgIFVpQXNzZXRzLnVpX2ZyYW1lLnJlbmRlclBhcnRpYWwoXHJcbiAgICAgICAgICAgIHRoaXMsXHJcbiAgICAgICAgICAgIHggKyB3IC0gNyAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIHkgKyA3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgNyAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIGggLSAxNCAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIDgsXHJcbiAgICAgICAgICAgIDcsXHJcbiAgICAgICAgICAgIDcsXHJcbiAgICAgICAgICAgIDFcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICAvLyBjZW50ZXJcclxuICAgICAgICBVaUFzc2V0cy51aV9mcmFtZS5yZW5kZXJQYXJ0aWFsKFxyXG4gICAgICAgICAgICB0aGlzLFxyXG4gICAgICAgICAgICB4ICsgNyAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIHkgKyA3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgdyAtIDE0ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgaCAtIDE0ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgNyxcclxuICAgICAgICAgICAgNyxcclxuICAgICAgICAgICAgMSxcclxuICAgICAgICAgICAgMVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgLyQkJCQkJCQgIC8kJCAgICAgICAgICAgICAgICAgICAgICAgICAgIC8kJFxyXG4gIHwgJCRfXyAgJCR8ICQkICAgICAgICAgICAgICAgICAgICAgICAgICB8X18vXHJcbiAgfCAkJCAgXFwgJCR8ICQkJCQkJCQgIC8kJCAgIC8kJCAgLyQkJCQkJCQgLyQkICAvJCQkJCQkJCAgLyQkJCQkJCQgLyQkXHJcbiAgfCAkJCQkJCQkL3wgJCRfXyAgJCR8ICQkICB8ICQkIC8kJF9fX19fL3wgJCQgLyQkX19fX18vIC8kJF9fX19fL3xfXy9cclxuICB8ICQkX19fXy8gfCAkJCAgXFwgJCR8ICQkICB8ICQkfCAgJCQkJCQkIHwgJCR8ICQkICAgICAgfCAgJCQkJCQkXHJcbiAgfCAkJCAgICAgIHwgJCQgIHwgJCR8ICQkICB8ICQkIFxcX19fXyAgJCR8ICQkfCAkJCAgICAgICBcXF9fX18gICQkIC8kJFxyXG4gIHwgJCQgICAgICB8ICQkICB8ICQkfCAgJCQkJCQkJCAvJCQkJCQkJC98ICQkfCAgJCQkJCQkJCAvJCQkJCQkJC98X18vXHJcbiAgfF9fLyAgICAgIHxfXy8gIHxfXy8gXFxfX19fICAkJHxfX19fX19fLyB8X18vIFxcX19fX19fXy98X19fX19fXy9cclxuICAgICAgICAgICAgICAgICAgICAgICAvJCQgIHwgJCRcclxuICAgICAgICAgICAgICAgICAgICAgIHwgICQkJCQkJC9cclxuICAgICAgICAgICAgICAgICAgICAgICBcXF9fX19fXy9cclxuICAqL1xyXG5cclxuICAgIC8vIHRoaXMgY2xhc3MgaG9sZHMgYW4gYXhpcy1hbGlnbmVkIHJlY3RhbmdsZSBhZmZlY3RlZCBieSBncmF2aXR5LCBkcmFnLCBhbmQgY29sbGlzaW9ucyB3aXRoIHRpbGVzLlxyXG5cclxuICAgIHJlY3RWc1JheShcclxuICAgICAgICByZWN0WD86IGFueSxcclxuICAgICAgICByZWN0WT86IGFueSxcclxuICAgICAgICByZWN0Vz86IGFueSxcclxuICAgICAgICByZWN0SD86IGFueSxcclxuICAgICAgICByYXlYPzogYW55LFxyXG4gICAgICAgIHJheVk/OiBhbnksXHJcbiAgICAgICAgcmF5Vz86IGFueSxcclxuICAgICAgICByYXlIPzogYW55XHJcbiAgICApIHtcclxuICAgICAgICAvLyB0aGlzIHJheSBpcyBhY3R1YWxseSBhIGxpbmUgc2VnbWVudCBtYXRoZW1hdGljYWxseSwgYnV0IGl0J3MgY29tbW9uIHRvIHNlZSBwZW9wbGUgcmVmZXIgdG8gc2ltaWxhciBjaGVja3MgYXMgcmF5LWNhc3RzLCBzbyBmb3IgdGhlIGR1cmF0aW9uIG9mIHRoZSBkZWZpbml0aW9uIG9mIHRoaXMgZnVuY3Rpb24sIHJheSBjYW4gYmUgYXNzdW1lZCB0byBtZWFuIHRoZSBzYW1lIGFzIGxpbmUgc2VnbWVudC5cclxuXHJcbiAgICAgICAgLy8gaWYgdGhlIHJheSBkb2Vzbid0IGhhdmUgYSBsZW5ndGgsIHRoZW4gaXQgY2FuJ3QgaGF2ZSBlbnRlcmVkIHRoZSByZWN0YW5nbGUuICBUaGlzIGFzc3VtZXMgdGhhdCB0aGUgb2JqZWN0cyBkb24ndCBzdGFydCBpbiBjb2xsaXNpb24sIG90aGVyd2lzZSB0aGV5J2xsIGJlaGF2ZSBzdHJhbmdlbHlcclxuICAgICAgICBpZiAocmF5VyA9PT0gMCAmJiByYXlIID09PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGNhbGN1bGF0ZSBob3cgZmFyIGFsb25nIHRoZSByYXkgZWFjaCBzaWRlIG9mIHRoZSByZWN0YW5nbGUgaW50ZXJzZWN0cyB3aXRoIGl0IChlYWNoIHNpZGUgaXMgZXh0ZW5kZWQgb3V0IGluZmluaXRlbHkgaW4gYm90aCBkaXJlY3Rpb25zKVxyXG4gICAgICAgIGNvbnN0IHRvcEludGVyc2VjdGlvbiA9IChyZWN0WSAtIHJheVkpIC8gcmF5SDtcclxuICAgICAgICBjb25zdCBib3R0b21JbnRlcnNlY3Rpb24gPSAocmVjdFkgKyByZWN0SCAtIHJheVkpIC8gcmF5SDtcclxuICAgICAgICBjb25zdCBsZWZ0SW50ZXJzZWN0aW9uID0gKHJlY3RYIC0gcmF5WCkgLyByYXlXO1xyXG4gICAgICAgIGNvbnN0IHJpZ2h0SW50ZXJzZWN0aW9uID0gKHJlY3RYICsgcmVjdFcgLSByYXlYKSAvIHJheVc7XHJcblxyXG4gICAgICAgIGlmIChcclxuICAgICAgICAgICAgaXNOYU4odG9wSW50ZXJzZWN0aW9uKSB8fFxyXG4gICAgICAgICAgICBpc05hTihib3R0b21JbnRlcnNlY3Rpb24pIHx8XHJcbiAgICAgICAgICAgIGlzTmFOKGxlZnRJbnRlcnNlY3Rpb24pIHx8XHJcbiAgICAgICAgICAgIGlzTmFOKHJpZ2h0SW50ZXJzZWN0aW9uKVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICAvLyB5b3UgaGF2ZSB0byB1c2UgdGhlIEpTIGZ1bmN0aW9uIGlzTmFOKCkgdG8gY2hlY2sgaWYgYSB2YWx1ZSBpcyBOYU4gYmVjYXVzZSBib3RoIE5hTj09TmFOIGFuZCBOYU49PT1OYU4gYXJlIGZhbHNlLlxyXG4gICAgICAgICAgICAvLyBpZiBhbnkgb2YgdGhlc2UgdmFsdWVzIGFyZSBOYU4sIG5vIGNvbGxpc2lvbiBoYXMgb2NjdXJyZWRcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gY2FsY3VsYXRlIHRoZSBuZWFyZXN0IGFuZCBmYXJ0aGVzdCBpbnRlcnNlY3Rpb25zIGZvciBib3RoIHggYW5kIHlcclxuICAgICAgICBjb25zdCBuZWFyWCA9IHRoaXMubWluKGxlZnRJbnRlcnNlY3Rpb24sIHJpZ2h0SW50ZXJzZWN0aW9uKTtcclxuICAgICAgICBjb25zdCBmYXJYID0gdGhpcy5tYXgobGVmdEludGVyc2VjdGlvbiwgcmlnaHRJbnRlcnNlY3Rpb24pO1xyXG4gICAgICAgIGNvbnN0IG5lYXJZID0gdGhpcy5taW4odG9wSW50ZXJzZWN0aW9uLCBib3R0b21JbnRlcnNlY3Rpb24pO1xyXG4gICAgICAgIGNvbnN0IGZhclkgPSB0aGlzLm1heCh0b3BJbnRlcnNlY3Rpb24sIGJvdHRvbUludGVyc2VjdGlvbik7XHJcblxyXG4gICAgICAgIGlmIChuZWFyWCA+IGZhclkgfHwgbmVhclkgPiBmYXJYKSB7XHJcbiAgICAgICAgICAgIC8vIHRoaXMgbXVzdCBtZWFuIHRoYXQgdGhlIGxpbmUgdGhhdCBtYWtlcyB1cCB0aGUgbGluZSBzZWdtZW50IGRvZXNuJ3QgcGFzcyB0aHJvdWdoIHRoZSByYXlcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGZhclggPCAwIHx8IGZhclkgPCAwKSB7XHJcbiAgICAgICAgICAgIC8vIHRoZSBpbnRlcnNlY3Rpb24gaXMgaGFwcGVuaW5nIGJlZm9yZSB0aGUgcmF5IHN0YXJ0cywgc28gdGhlIHJheSBpcyBwb2ludGluZyBhd2F5IGZyb20gdGhlIHRyaWFuZ2xlXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGNhbGN1bGF0ZSB3aGVyZSB0aGUgcG90ZW50aWFsIGNvbGxpc2lvbiBjb3VsZCBiZVxyXG4gICAgICAgIGNvbnN0IG5lYXJDb2xsaXNpb25Qb2ludCA9IHRoaXMubWF4KG5lYXJYLCBuZWFyWSk7XHJcblxyXG4gICAgICAgIGlmIChuZWFyWCA+IDEgfHwgbmVhclkgPiAxKSB7XHJcbiAgICAgICAgICAgIC8vIHRoZSBpbnRlcnNlY3Rpb24gaGFwcGVucyBhZnRlciB0aGUgcmF5KGxpbmUgc2VnbWVudCkgZW5kc1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAobmVhclggPT09IG5lYXJDb2xsaXNpb25Qb2ludCkge1xyXG4gICAgICAgICAgICAvLyBpdCBtdXN0IGhhdmUgY29sbGlkZWQgb24gZWl0aGVyIHRoZSBsZWZ0IG9yIHRoZSByaWdodCEgbm93IHdoaWNoP1xyXG4gICAgICAgICAgICBpZiAobGVmdEludGVyc2VjdGlvbiA9PT0gbmVhclgpIHtcclxuICAgICAgICAgICAgICAgIC8vIEl0IG11c3QgaGF2ZSBjb2xsaWRlZCBvbiB0aGUgbGVmdCEgIFJldHVybiB0aGUgY29sbGlzaW9uIG5vcm1hbCBbLTEsIDBdXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gWy0xLCAwLCBuZWFyQ29sbGlzaW9uUG9pbnRdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIElmIGl0IGRpZG4ndCBjb2xsaWRlIG9uIHRoZSBsZWZ0LCBpdCBtdXN0IGhhdmUgY29sbGlkZWQgb24gdGhlIHJpZ2h0LiAgUmV0dXJuIHRoZSBjb2xsaXNpb24gbm9ybWFsIFsxLCAwXVxyXG4gICAgICAgICAgICByZXR1cm4gWzEsIDAsIG5lYXJDb2xsaXNpb25Qb2ludF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIElmIGl0IGRpZG4ndCBjb2xsaWRlIG9uIHRoZSBsZWZ0IG9yIHJpZ2h0LCBpdCBtdXN0IGhhdmUgY29sbGlkZWQgb24gZWl0aGVyIHRoZSB0b3Agb3IgdGhlIGJvdHRvbSEgbm93IHdoaWNoP1xyXG4gICAgICAgIGlmICh0b3BJbnRlcnNlY3Rpb24gPT09IG5lYXJZKSB7XHJcbiAgICAgICAgICAgIC8vIEl0IG11c3QgaGF2ZSBjb2xsaWRlZCBvbiB0aGUgdG9wISAgUmV0dXJuIHRoZSBjb2xsaXNpb24gbm9ybWFsIFswLCAtMV1cclxuICAgICAgICAgICAgcmV0dXJuIFswLCAtMSwgbmVhckNvbGxpc2lvblBvaW50XTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gSWYgaXQgZGlkbid0IGNvbGxpZGUgb24gdGhlIHRvcCwgaXQgbXVzdCBoYXZlIGNvbGxpZGVkIG9uIHRoZSBib3R0b20uICBSZXR1cm4gdGhlIGNvbGxpc2lvbiBub3JtYWwgWzAsIDFdXHJcbiAgICAgICAgcmV0dXJuIFswLCAxLCBuZWFyQ29sbGlzaW9uUG9pbnRdO1xyXG5cclxuICAgICAgICAvLyBvdXRwdXQgaWYgbm8gY29sbGlzaW9uOiBmYWxzZVxyXG4gICAgICAgIC8vIG91dHB1dCBpZiBjb2xsaXNpb246IFtjb2xsaXNpb24gbm9ybWFsIFgsIGNvbGxpc2lvbiBub3JtYWwgWSwgbmVhckNvbGxpc2lvblBvaW50XVxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIC0xIHRvIDEgICAgICAgICAgICAgIC0xIHRvIDEgICAgICAgICAgICAwIHRvIDFcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXJFbnRpdGllcygpIHtcclxuICAgICAgICAvLyBkcmF3IHBsYXllclxyXG4gICAgICAgIC8vIHRoaXMuZmlsbCgyNTUsIDAsIDApO1xyXG4gICAgICAgIC8vIHRoaXMubm9TdHJva2UoKTtcclxuICAgICAgICAvLyB0aGlzLnJlY3QoXHJcbiAgICAgICAgLy8gICAgICh0aGlzLndvcmxkLnBsYXllci5pbnRlcnBvbGF0ZWRYICogdGhpcy5USUxFX1dJRFRIIC1cclxuICAgICAgICAvLyAgICAgICAgIHRoaXMuaW50ZXJwb2xhdGVkQ2FtWCAqIHRoaXMuVElMRV9XSURUSCkgKlxyXG4gICAgICAgIC8vICAgICAgICAgdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAvLyAgICAgKHRoaXMud29ybGQucGxheWVyLmludGVycG9sYXRlZFkgKiB0aGlzLlRJTEVfSEVJR0hUIC1cclxuICAgICAgICAvLyAgICAgICAgIHRoaXMuaW50ZXJwb2xhdGVkQ2FtWSAqIHRoaXMuVElMRV9IRUlHSFQpICpcclxuICAgICAgICAvLyAgICAgICAgIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgLy8gICAgIHRoaXMud29ybGQucGxheWVyLndpZHRoICogdGhpcy51cHNjYWxlU2l6ZSAqIHRoaXMuVElMRV9XSURUSCxcclxuICAgICAgICAvLyAgICAgdGhpcy53b3JsZC5wbGF5ZXIuaGVpZ2h0ICogdGhpcy51cHNjYWxlU2l6ZSAqIHRoaXMuVElMRV9IRUlHSFRcclxuICAgICAgICAvLyApO1xyXG5cclxuXHJcbiAgICAgICAgLy8gZm9yIChjb25zdCBpdGVtIG9mIHRoaXMuaXRlbXMpIHtcclxuICAgICAgICAvLyAgICAgaXRlbS5maW5kSW50ZXJwb2xhdGVkQ29vcmRpbmF0ZXMoKTtcclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vICAgICBpdGVtLml0ZW1TdGFjay50ZXh0dXJlLnJlbmRlcihcclxuICAgICAgICAvLyAgICAgICAgIHRoaXMsXHJcbiAgICAgICAgLy8gICAgICAgICAoaXRlbS5pbnRlcnBvbGF0ZWRYICogdGhpcy5USUxFX1dJRFRIIC1cclxuICAgICAgICAvLyAgICAgICAgICAgICB0aGlzLmludGVycG9sYXRlZENhbVggKiB0aGlzLlRJTEVfV0lEVEgpICpcclxuICAgICAgICAvLyAgICAgICAgICAgICB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgIC8vICAgICAgICAgKGl0ZW0uaW50ZXJwb2xhdGVkWSAqIHRoaXMuVElMRV9IRUlHSFQgLVxyXG4gICAgICAgIC8vICAgICAgICAgICAgIHRoaXMuaW50ZXJwb2xhdGVkQ2FtWSAqIHRoaXMuVElMRV9IRUlHSFQpICpcclxuICAgICAgICAvLyAgICAgICAgICAgICB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgIC8vICAgICAgICAgaXRlbS53ICogdGhpcy51cHNjYWxlU2l6ZSAqIHRoaXMuVElMRV9XSURUSCxcclxuICAgICAgICAvLyAgICAgICAgIGl0ZW0uaCAqIHRoaXMudXBzY2FsZVNpemUgKiB0aGlzLlRJTEVfSEVJR0hUXHJcbiAgICAgICAgLy8gICAgICk7XHJcbiAgICAgICAgLy9cclxuICAgICAgICAvLyAgICAgLy8gUmVuZGVyIHRoZSBpdGVtIHF1YW50aXR5IGxhYmVsXHJcbiAgICAgICAgLy8gICAgIHRoaXMuZmlsbCgwKTtcclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vICAgICB0aGlzLm5vU3Ryb2tlKCk7XHJcbiAgICAgICAgLy9cclxuICAgICAgICAvLyAgICAgdGhpcy50ZXh0QWxpZ24odGhpcy5SSUdIVCwgdGhpcy5CT1RUT00pO1xyXG4gICAgICAgIC8vICAgICB0aGlzLnRleHRTaXplKDUgKiB0aGlzLnVwc2NhbGVTaXplKTtcclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vICAgICB0aGlzLnRleHQoXHJcbiAgICAgICAgLy8gICAgICAgICBpdGVtLml0ZW1TdGFjay5zdGFja1NpemUsXHJcbiAgICAgICAgLy8gICAgICAgICAoaXRlbS5pbnRlcnBvbGF0ZWRYICogdGhpcy5USUxFX1dJRFRIIC1cclxuICAgICAgICAvLyAgICAgICAgICAgICB0aGlzLmludGVycG9sYXRlZENhbVggKiB0aGlzLlRJTEVfV0lEVEgpICpcclxuICAgICAgICAvLyAgICAgICAgICAgICB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgIC8vICAgICAgICAgKGl0ZW0uaW50ZXJwb2xhdGVkWSAqIHRoaXMuVElMRV9IRUlHSFQgLVxyXG4gICAgICAgIC8vICAgICAgICAgICAgIHRoaXMuaW50ZXJwb2xhdGVkQ2FtWSAqIHRoaXMuVElMRV9IRUlHSFQpICpcclxuICAgICAgICAvLyAgICAgICAgICAgICB0aGlzLnVwc2NhbGVTaXplXHJcbiAgICAgICAgLy8gICAgICk7XHJcbiAgICAgICAgLy8gfVxyXG4gICAgfVxyXG5cclxuICAgIHBpY2tVcEl0ZW0oaXRlbVN0YWNrOiBJdGVtU3RhY2spOiBib29sZWFuIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaG90QmFyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLmhvdEJhcltpXTtcclxuXHJcbiAgICAgICAgICAgIC8vIElmIHRoZXJlIGFyZSBubyBpdGVtcyBpbiB0aGUgY3VycmVudCBzbG90IG9mIHRoZSBob3RCYXJcclxuICAgICAgICAgICAgaWYgKGl0ZW0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ob3RCYXJbaV0gPSBpdGVtU3RhY2s7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgaXRlbSA9PT0gaXRlbVN0YWNrICYmXHJcbiAgICAgICAgICAgICAgICBpdGVtLnN0YWNrU2l6ZSA8IGl0ZW0ubWF4U3RhY2tTaXplXHJcbiAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVtYWluaW5nU3BhY2UgPSBpdGVtLm1heFN0YWNrU2l6ZSAtIGl0ZW0uc3RhY2tTaXplO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFRvcCBvZmYgdGhlIHN0YWNrIHdpdGggaXRlbXMgaWYgaXQgY2FuIHRha2UgbW9yZSB0aGFuIHRoZSBzdGFjayBiZWluZyBhZGRlZFxyXG4gICAgICAgICAgICAgICAgaWYgKHJlbWFpbmluZ1NwYWNlID49IGl0ZW1TdGFjay5zdGFja1NpemUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhvdEJhcltpXS5zdGFja1NpemUgPVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtLnN0YWNrU2l6ZSArIGl0ZW1TdGFjay5zdGFja1NpemU7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaXRlbVN0YWNrLnN0YWNrU2l6ZSAtPSByZW1haW5pbmdTcGFjZTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmhvdEJhcltpXS5zdGFja1NpemUgPSBpdGVtU3RhY2subWF4U3RhY2tTaXplO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXHJcbiAgICAgICAgICAgIGBDb3VsZCBub3QgcGlja3VwICR7aXRlbVN0YWNrLnN0YWNrU2l6ZX0gJHtpdGVtU3RhY2submFtZX1gXHJcbiAgICAgICAgKTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgbW91c2VFeGl0ZWQoKSB7XHJcbiAgICAgICAgdGhpcy5tb3VzZU9uID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgbW91c2VFbnRlcmVkKCkge1xyXG4gICAgICAgIHRoaXMubW91c2VPbiA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlTW91c2UoKSB7XHJcbiAgICAgICAgLy8gd29ybGQgbW91c2UgeCBhbmQgeSB2YXJpYWJsZXMgaG9sZCB0aGUgbW91c2UgcG9zaXRpb24gaW4gd29ybGQgdGlsZXMuICAwLCAwIGlzIHRvcCBsZWZ0XHJcbiAgICAgICAgdGhpcy53b3JsZE1vdXNlWCA9IHRoaXMuZmxvb3IoXHJcbiAgICAgICAgICAgICh0aGlzLmludGVycG9sYXRlZENhbVggKiB0aGlzLlRJTEVfV0lEVEggK1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tb3VzZVggLyB0aGlzLnVwc2NhbGVTaXplKSAvXHJcbiAgICAgICAgICAgICAgICB0aGlzLlRJTEVfV0lEVEhcclxuICAgICAgICApO1xyXG4gICAgICAgIHRoaXMud29ybGRNb3VzZVkgPSB0aGlzLmZsb29yKFxyXG4gICAgICAgICAgICAodGhpcy5pbnRlcnBvbGF0ZWRDYW1ZICogdGhpcy5USUxFX0hFSUdIVCArXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vdXNlWSAvIHRoaXMudXBzY2FsZVNpemUpIC9cclxuICAgICAgICAgICAgICAgIHRoaXMuVElMRV9IRUlHSFRcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIGRyYXdDdXJzb3IoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMubW91c2VPbikge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5waWNrZWRVcFNsb3QgPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ob3RCYXJbdGhpcy5waWNrZWRVcFNsb3RdLnRleHR1cmUucmVuZGVyKFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMsXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3VzZVgsXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3VzZVksXHJcbiAgICAgICAgICAgICAgICAgICAgOCAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgICAgICAgICAgOCAqIHRoaXMudXBzY2FsZVNpemVcclxuICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0KFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaG90QmFyW3RoaXMucGlja2VkVXBTbG90XS5zdGFja1NpemUsXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3VzZVggKyAxMCAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3VzZVkgKyAxMCAqIHRoaXMudXBzY2FsZVNpemVcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0ID0gR2FtZVxyXG4iLCJpbXBvcnQgR2FtZSBmcm9tICcuL0dhbWUnO1xyXG5pbXBvcnQgeyBpbyB9IGZyb20gXCJzb2NrZXQuaW8tY2xpZW50XCI7XHJcblxyXG4vLyBDb25uZWN0IHRoZSBzZXJ2ZXJcclxuXHJcbmNvbnN0IGNvbm5lY3Rpb24gPSBpbyh7IGF1dGg6IHsgdG9rZW46IHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndG9rZW4nKSB9IH0pXHJcblxyXG5leHBvcnQgZGVmYXVsdCBuZXcgR2FtZShjb25uZWN0aW9uKTsiLCJpbXBvcnQgVGlsZVJlc291cmNlIGZyb20gJy4vcmVzb3VyY2VzL1RpbGVSZXNvdXJjZSc7XHJcbmltcG9ydCBJbWFnZVJlc291cmNlIGZyb20gJy4vcmVzb3VyY2VzL0ltYWdlUmVzb3VyY2UnO1xyXG5pbXBvcnQgRm9udFJlc291cmNlIGZyb20gJy4vcmVzb3VyY2VzL0ZvbnRSZXNvdXJjZSc7XHJcbmltcG9ydCBSZXNvdXJjZSBmcm9tICcuL3Jlc291cmNlcy9SZXNvdXJjZSc7XHJcbmltcG9ydCBBdWRpb1Jlc291cmNlR3JvdXAgZnJvbSAnLi9yZXNvdXJjZXMvQXVkaW9SZXNvdXJjZUdyb3VwJztcclxuaW1wb3J0IFA1IGZyb20gJ3A1JztcclxuaW1wb3J0IEF1ZGlvUmVzb3VyY2UgZnJvbSAnLi9yZXNvdXJjZXMvQXVkaW9SZXNvdXJjZSc7XHJcblxyXG5pbnRlcmZhY2UgQXNzZXRHcm91cCB7XHJcbiAgICBbbmFtZTogc3RyaW5nXTpcclxuICAgIHwge1xyXG4gICAgICAgIFtuYW1lOiBzdHJpbmddOiBSZXNvdXJjZSB8IEFzc2V0R3JvdXAgfCBBdWRpb1Jlc291cmNlR3JvdXA7XHJcbiAgICB9XHJcbiAgICB8IFJlc291cmNlO1xyXG59XHJcblxyXG4vLyBVaSByZWxhdGVkIGFzc2V0c1xyXG5jb25zdCBVaUFzc2V0cyA9IHtcclxuICAgIHVpX3Nsb3Rfc2VsZWN0ZWQ6IG5ldyBJbWFnZVJlc291cmNlKFxyXG4gICAgICAgICdhc3NldHMvdGV4dHVyZXMvdWkvdWlzbG90X3NlbGVjdGVkLnBuZydcclxuICAgICksXHJcbiAgICB1aV9zbG90OiBuZXcgSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3VpL3Vpc2xvdC5wbmcnKSxcclxuICAgIHVpX2ZyYW1lOiBuZXcgSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3VpL3VpZnJhbWUucG5nJyksXHJcbiAgICBidXR0b25fdW5zZWxlY3RlZDogbmV3IEltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy91aS9idXR0b24wLnBuZycpLFxyXG4gICAgYnV0dG9uX3NlbGVjdGVkOiBuZXcgSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3VpL2J1dHRvbjEucG5nJyksXHJcbiAgICBzbGlkZXJfYmFyOiBuZXcgSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3VpL3NsaWRlckJhci5wbmcnKSxcclxuICAgIHNsaWRlcl9oYW5kbGU6IG5ldyBJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvdWkvc2xpZGVySGFuZGxlLnBuZycpLFxyXG4gICAgdGl0bGVfaW1hZ2U6IG5ldyBJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvdWkvc25vd2VkaW5CVU1QLnBuZycpXHJcbn07XHJcblxyXG4vLyBJdGVtIHJlbGF0ZWQgYXNzZXRzXHJcbmNvbnN0IEl0ZW1zQXNzZXRzID0ge1xyXG4gICAgcmVzb3VyY2VzOiB7XHJcbiAgICAgICAgaWNlX3NoYXJkOiBuZXcgSW1hZ2VSZXNvdXJjZShcclxuICAgICAgICAgICAgJ2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9yZXNvdXJjZV9pY2Vfc2hhcmRzLnBuZydcclxuICAgICAgICApLFxyXG4gICAgICAgIHNub3diYWxsOiBuZXcgSW1hZ2VSZXNvdXJjZShcclxuICAgICAgICAgICAgJ2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9yZXNvdXJjZV9zbm93YmFsbC5wbmcnXHJcbiAgICAgICAgKSxcclxuICAgIH0sXHJcbiAgICBjb25zdW1hYmxlczoge1xyXG4gICAgICAgIHNub3dfYmVycmllczogbmV3IEltYWdlUmVzb3VyY2UoXHJcbiAgICAgICAgICAgICdhc3NldHMvdGV4dHVyZXMvaXRlbXMvY29uc3VtYWJsZV9zbm93X2JlcnJpZXMucG5nJ1xyXG4gICAgICAgICksXHJcbiAgICB9LFxyXG4gICAgYmxvY2tzOiB7XHJcbiAgICAgICAgaWNlOiBuZXcgSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL2l0ZW1zL2Jsb2NrX2ljZS5wbmcnKSxcclxuICAgICAgICBzbm93OiBuZXcgSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL2l0ZW1zL2Jsb2NrX3Nub3cucG5nJyksXHJcbiAgICB9LFxyXG4gICAgdG9vbHM6IHt9LFxyXG59O1xyXG5cclxuLy8gV29ybGQgcmVsYXRlZCBhc3NldHNcclxuY29uc3QgV29ybGRBc3NldHMgPSB7XHJcbiAgICBiYWNrZ3JvdW5kOiB7XHJcbiAgICAgICAgc25vdzogbmV3IEltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9iYWNrZ3JvdW5kL3Nub3cucG5nJyksXHJcbiAgICB9LFxyXG4gICAgbWlkZGxlZ3JvdW5kOiB7XHJcbiAgICAgICAgdGlsZXNldF9pY2U6IG5ldyBUaWxlUmVzb3VyY2UoXHJcbiAgICAgICAgICAgICdhc3NldHMvdGV4dHVyZXMvd29ybGQvbWlkZGxlZ3JvdW5kL3RpbGVzZXRfaWNlLnBuZycsXHJcbiAgICAgICAgICAgIDE2LFxyXG4gICAgICAgICAgICAxLFxyXG4gICAgICAgICAgICA4LFxyXG4gICAgICAgICAgICA4XHJcbiAgICAgICAgKSxcclxuICAgICAgICB0aWxlc2V0X3Nub3c6IG5ldyBUaWxlUmVzb3VyY2UoXHJcbiAgICAgICAgICAgICdhc3NldHMvdGV4dHVyZXMvd29ybGQvbWlkZGxlZ3JvdW5kL3RpbGVzZXRfc25vdy5wbmcnLFxyXG4gICAgICAgICAgICAxNixcclxuICAgICAgICAgICAgMSxcclxuICAgICAgICAgICAgOCxcclxuICAgICAgICAgICAgOFxyXG4gICAgICAgICksXHJcbiAgICAgICAgdGlsZXNldF9kaXJ0OiBuZXcgVGlsZVJlc291cmNlKFxyXG4gICAgICAgICAgICAnYXNzZXRzL3RleHR1cmVzL3dvcmxkL21pZGRsZWdyb3VuZC90aWxlc2V0X3Nub3cucG5nJyxcclxuICAgICAgICAgICAgMTYsXHJcbiAgICAgICAgICAgIDEsXHJcbiAgICAgICAgICAgIDgsXHJcbiAgICAgICAgICAgIDhcclxuICAgICAgICApLFxyXG4gICAgfSxcclxuICAgIGZvcmVncm91bmQ6IHtcclxuICAgICAgICB0aWxlc2V0X3BpcGU6IG5ldyBUaWxlUmVzb3VyY2UoXHJcbiAgICAgICAgICAgICdhc3NldHMvdGV4dHVyZXMvd29ybGQvZm9yZWdyb3VuZC90aWxlc2V0X3BpcGUucG5nJyxcclxuICAgICAgICAgICAgMTYsXHJcbiAgICAgICAgICAgIDEsXHJcbiAgICAgICAgICAgIDgsXHJcbiAgICAgICAgICAgIDhcclxuICAgICAgICApLFxyXG4gICAgfSxcclxufTtcclxuXHJcbmNvbnN0IEZvbnRzID0ge1xyXG4gICAgdGl0bGU6IG5ldyBGb250UmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy91aS9mb250LnBuZycsIHtcclxuICAgICAgICBcIjBcIjogNyxcclxuICAgICAgICBcIjFcIjogNyxcclxuICAgICAgICBcIjJcIjogNyxcclxuICAgICAgICBcIjNcIjogNixcclxuICAgICAgICBcIjRcIjogNixcclxuICAgICAgICBcIjVcIjogNixcclxuICAgICAgICBcIjZcIjogNixcclxuICAgICAgICBcIjdcIjogNyxcclxuICAgICAgICBcIjhcIjogNyxcclxuICAgICAgICBcIjlcIjogNixcclxuICAgICAgICBcIkFcIjogNixcclxuICAgICAgICBcIkJcIjogNyxcclxuICAgICAgICBcIkNcIjogNyxcclxuICAgICAgICBcIkRcIjogNixcclxuICAgICAgICBcIkVcIjogNyxcclxuICAgICAgICBcIkZcIjogNixcclxuICAgICAgICBcIkdcIjogNyxcclxuICAgICAgICBcIkhcIjogNyxcclxuICAgICAgICBcIklcIjogNyxcclxuICAgICAgICBcIkpcIjogOCxcclxuICAgICAgICBcIktcIjogNixcclxuICAgICAgICBcIkxcIjogNixcclxuICAgICAgICBcIk1cIjogOCxcclxuICAgICAgICBcIk5cIjogOCxcclxuICAgICAgICBcIk9cIjogOCxcclxuICAgICAgICBcIlBcIjogOSxcclxuICAgICAgICBcIlFcIjogOCxcclxuICAgICAgICBcIlJcIjogNyxcclxuICAgICAgICBcIlNcIjogNyxcclxuICAgICAgICBcIlRcIjogOCxcclxuICAgICAgICBcIlVcIjogOCxcclxuICAgICAgICBcIlZcIjogOCxcclxuICAgICAgICBcIldcIjogMTAsXHJcbiAgICAgICAgXCJYXCI6IDgsXHJcbiAgICAgICAgXCJZXCI6IDgsXHJcbiAgICAgICAgXCJaXCI6IDksXHJcbiAgICAgICAgXCJhXCI6IDcsXHJcbiAgICAgICAgXCJiXCI6IDcsXHJcbiAgICAgICAgXCJjXCI6IDYsXHJcbiAgICAgICAgXCJkXCI6IDcsXHJcbiAgICAgICAgXCJlXCI6IDYsXHJcbiAgICAgICAgXCJmXCI6IDYsXHJcbiAgICAgICAgXCJnXCI6IDYsXHJcbiAgICAgICAgXCJoXCI6IDYsXHJcbiAgICAgICAgXCJpXCI6IDUsXHJcbiAgICAgICAgXCJqXCI6IDYsXHJcbiAgICAgICAgXCJrXCI6IDUsXHJcbiAgICAgICAgXCJsXCI6IDUsXHJcbiAgICAgICAgXCJtXCI6IDgsXHJcbiAgICAgICAgXCJuXCI6IDUsXHJcbiAgICAgICAgXCJvXCI6IDUsXHJcbiAgICAgICAgXCJwXCI6IDUsXHJcbiAgICAgICAgXCJxXCI6IDcsXHJcbiAgICAgICAgXCJyXCI6IDUsXHJcbiAgICAgICAgXCJzXCI6IDQsXHJcbiAgICAgICAgXCJ0XCI6IDUsXHJcbiAgICAgICAgXCJ1XCI6IDUsXHJcbiAgICAgICAgXCJ2XCI6IDUsXHJcbiAgICAgICAgXCJ3XCI6IDcsXHJcbiAgICAgICAgXCJ4XCI6IDYsXHJcbiAgICAgICAgXCJ5XCI6IDUsXHJcbiAgICAgICAgXCJ6XCI6IDUsXHJcbiAgICAgICAgXCIhXCI6IDQsXHJcbiAgICAgICAgXCIuXCI6IDIsXHJcbiAgICAgICAgXCIsXCI6IDIsXHJcbiAgICAgICAgXCI/XCI6IDYsXHJcbiAgICAgICAgXCJfXCI6IDYsXHJcbiAgICAgICAgXCItXCI6IDQsXHJcbiAgICAgICAgXCI6XCI6IDIsXHJcbiAgICAgICAgXCIgXCI6IDJcclxuICAgIH0sIFwiQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkhLiw/Xy06IFwiKSxcclxuXHJcbn07XHJcblxyXG5jb25zdCBBdWRpb0Fzc2V0cyA9IHtcclxuICAgIHVpOiB7XHJcbiAgICAgICAgaW52ZW50b3J5Q2xhY2s6IG5ldyBBdWRpb1Jlc291cmNlR3JvdXAoW25ldyBBdWRpb1Jlc291cmNlKCdhc3NldHMvc291bmRzL2NsYWNrMS5tcDMnKSwgbmV3IEF1ZGlvUmVzb3VyY2UoJ2Fzc2V0cy9zb3VuZHMvY2xhY2szLm1wMycpLCBuZXcgQXVkaW9SZXNvdXJjZSgnYXNzZXRzL3NvdW5kcy9jbGFjazMubXAzJyldKVxyXG4gICAgfVxyXG59XHJcblxyXG5cclxuY29uc3QgbG9hZEFzc2V0cyA9IChza2V0Y2g6IFA1LCAuLi5hc3NldHM6IEFzc2V0R3JvdXBbXSkgPT4ge1xyXG4gICAgYXNzZXRzLmZvckVhY2goKGFzc2V0R3JvdXApID0+IHtcclxuICAgICAgICBzZWFyY2hHcm91cChhc3NldEdyb3VwLCBza2V0Y2gpO1xyXG4gICAgfSk7XHJcblxyXG59O1xyXG5cclxuZnVuY3Rpb24gc2VhcmNoR3JvdXAoYXNzZXRHcm91cDogQXNzZXRHcm91cCB8IFJlc291cmNlIHwgQXVkaW9SZXNvdXJjZUdyb3VwLCBza2V0Y2g6IFA1KSB7XHJcbiAgICBpZiAoYXNzZXRHcm91cCBpbnN0YW5jZW9mIFJlc291cmNlKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coYExvYWRpbmcgYXNzZXQgJHthc3NldEdyb3VwLnBhdGh9YCk7XHJcbiAgICAgICAgYXNzZXRHcm91cC5sb2FkUmVzb3VyY2Uoc2tldGNoKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBPYmplY3QuZW50cmllcyhhc3NldEdyb3VwKS5mb3JFYWNoKChhc3NldCkgPT4ge1xyXG4gICAgICAgIHNlYXJjaEdyb3VwKGFzc2V0WzFdLCBza2V0Y2gpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCB7IEF1ZGlvQXNzZXRzLCBVaUFzc2V0cywgSXRlbXNBc3NldHMsIFdvcmxkQXNzZXRzLCBGb250cywgbG9hZEFzc2V0cyB9O1xyXG4iLCJpbXBvcnQgUDUgZnJvbSAncDUnO1xyXG5pbXBvcnQgUmVzb3VyY2UgZnJvbSAnLi9SZXNvdXJjZSc7XHJcbmltcG9ydCB7IEF1ZGlvVHlwZSB9IGZyb20gJ3RzLWF1ZGlvJztcclxuaW1wb3J0IEF1ZGlvIGZyb20gJ3RzLWF1ZGlvJztcclxuXHJcblxyXG5jbGFzcyBBdWRpb1Jlc291cmNlIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gICAgc291bmQ6IEF1ZGlvVHlwZVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBhdGg6IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKHBhdGgpO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWRSZXNvdXJjZShnYW1lOiBQNSkge1xyXG4gICAgICAgIHRoaXMuc291bmQgPSBBdWRpbyh7XHJcbiAgICAgICAgICAgIGZpbGU6IHRoaXMucGF0aCxcclxuICAgICAgICAgICAgbG9vcDogZmFsc2UsXHJcbiAgICAgICAgICAgIHZvbHVtZTogMS4wLFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHBsYXlSYW5kb20oKSB7XHJcbiAgICAvLyAgICAgLy8gVmVyaWZ5IHRoYXQgdGhlIHNvdW5kIGhhcyBiZWVuIGxvYWRlZFxyXG4gICAgLy8gICAgIGlmICh0aGlzLnNvdW5kID09PSB1bmRlZmluZWQpXHJcbiAgICAvLyAgICAgICAgIHRocm93IG5ldyBFcnJvcihcclxuICAgIC8vICAgICAgICAgICAgIGBUcmllZCB0byBwbGF5IHNvdW5kIGJlZm9yZSBsb2FkaW5nIGl0OiAke3RoaXMucGF0aH1gXHJcbiAgICAvLyAgICAgICAgICk7XHJcblxyXG4gICAgLy8gICAgIHRoaXMuc291bmQucGxheSgpO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIHBsYXkoKSB7Ly8gcGxheSB0aGUgc291bmRcclxuICAgICAgICBpZiAodGhpcy5zb3VuZCA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAgICAgICAgICAgICBgVHJpZWQgdG8gcGxheSBzb3VuZCBiZWZvcmUgbG9hZGluZyBpdDogJHt0aGlzLnBhdGh9YFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIHRoaXMuc291bmQuc3RvcCgpO1xyXG4gICAgICAgIHRoaXMuc291bmQucGxheSgpO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuZXhwb3J0ID0gQXVkaW9SZXNvdXJjZTtcclxuIiwiaW1wb3J0IEF1ZGlvUmVzb3VyY2UgZnJvbSAnLi9BdWRpb1Jlc291cmNlJztcclxuXHJcbmNsYXNzIEF1ZGlvUmVzb3VyY2VHcm91cCB7XHJcblxyXG4gICAgc291bmRzOiBBdWRpb1Jlc291cmNlW11cclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihzb3VuZHM6IEF1ZGlvUmVzb3VyY2VbXSkgey8vIHBhc3MgaW4gYW4gYXJyYXkgb2YgQXVkaW9SZXNvdXJjZXMgdGhhdCBhcmUgYWxsIHNpbWlsYXJcclxuICAgICAgICB0aGlzLnNvdW5kcyA9IHNvdW5kcztcclxuICAgIH1cclxuXHJcbiAgICBwbGF5UmFuZG9tKCkgey8vIHBsYXkgYSByYW5kb20gc291bmRcclxuICAgICAgICBpZih0aGlzLnNvdW5kcyA9PT0gdW5kZWZpbmVkIHx8IHRoaXMuc291bmRzLmxlbmd0aCA9PT0gMClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxyXG4gICAgICAgICAgICAgICAgYFRoZXJlIGFyZSBubyBzb3VuZHM6ICR7dGhpcy5zb3VuZHN9YFxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICBjb25zdCByID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdGhpcy5zb3VuZHMubGVuZ3RoKTtcclxuICAgICAgICB0aGlzLnNvdW5kc1tyXS5wbGF5KCk7Ly8gcGxheSBhIHJhbmRvbSBzb3VuZCBmcm9tIHRoZSBhcnJheSBhdCBhIHNsaWdodGx5IHJhbmRvbWl6ZWQgcGl0Y2gsIGxlYWRpbmcgdG8gdGhlIGVmZmVjdCBvZiBpdCBtYWtpbmcgYSBuZXcgc291bmQgZWFjaCB0aW1lLCByZW1vdmluZyByZXBldGl0aXZlbmVzc1xyXG5cclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCA9IEF1ZGlvUmVzb3VyY2VHcm91cDsiLCJpbXBvcnQgSW1hZ2VSZXNvdXJjZSBmcm9tICcuL0ltYWdlUmVzb3VyY2UnO1xyXG5pbXBvcnQgcDUgZnJvbSAncDUnO1xyXG5pbXBvcnQgZ2FtZSBmcm9tICcuLi8uLi9NYWluJ1xyXG5cclxuY2xhc3MgRm9udFJlc291cmNlIGV4dGVuZHMgSW1hZ2VSZXNvdXJjZSB7XHJcblxyXG4gICAgYWxwaGFiZXRfc291cDoge1tsZXR0ZXI6IHN0cmluZ106IHt4OiBudW1iZXIsIHk6IG51bWJlciwgdzogbnVtYmVyLCBoOiBudW1iZXJ9fSA9IHt9XHJcblxyXG4gICAgY29uc3RydWN0b3IocGF0aDogc3RyaW5nLCBjaGFyYWN0ZXJEYXRhOiB7W2xldHRlcjogc3RyaW5nXTogbnVtYmVyfSwgY2hhcmFjdGVyT3JkZXI6IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKHBhdGgpO1xyXG4gICAgICAgIGxldCBydW5uaW5nVG90YWwgPSAwXHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaTxjaGFyYWN0ZXJPcmRlci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmFscGhhYmV0X3NvdXBbY2hhcmFjdGVyT3JkZXJbaV1dID0ge3g6IHJ1bm5pbmdUb3RhbCwgeTogMCwgdzogY2hhcmFjdGVyRGF0YVtjaGFyYWN0ZXJPcmRlcltpXV0sIGg6IDEyfVxyXG4gICAgICAgICAgICBydW5uaW5nVG90YWwgKz0gY2hhcmFjdGVyRGF0YVtjaGFyYWN0ZXJPcmRlcltpXV0gKyAxXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGNoYXJhY3Rlck9yZGVyW2ldK1wiOiBcIitjaGFyYWN0ZXJEYXRhW2NoYXJhY3Rlck9yZGVyW2ldXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGRyYXdUZXh0KHRhcmdldDogcDUsIHN0cjogc3RyaW5nLCB4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG4gICAgICAgIGxldCB4T2Zmc2V0OiBudW1iZXIgPSAwO1xyXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGk8c3RyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVuZGVyUGFydGlhbCh0YXJnZXQsIHgreE9mZnNldCpnYW1lLnVwc2NhbGVTaXplLCB5LCB0aGlzLmFscGhhYmV0X3NvdXBbc3RyW2ldXS53KmdhbWUudXBzY2FsZVNpemUsIHRoaXMuYWxwaGFiZXRfc291cFtzdHJbaV1dLmgqZ2FtZS51cHNjYWxlU2l6ZSwgdGhpcy5hbHBoYWJldF9zb3VwW3N0cltpXV0ueCwgdGhpcy5hbHBoYWJldF9zb3VwW3N0cltpXV0ueSwgdGhpcy5hbHBoYWJldF9zb3VwW3N0cltpXV0udywgdGhpcy5hbHBoYWJldF9zb3VwW3N0cltpXV0uaCk7XHJcbiAgICAgICAgICAgIHhPZmZzZXQgKz0gdGhpcy5hbHBoYWJldF9zb3VwW3N0cltpXV0udysxO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5leHBvcnQgPSBGb250UmVzb3VyY2U7IiwiaW1wb3J0IFA1IGZyb20gJ3A1JztcclxuaW1wb3J0IFJlc291cmNlIGZyb20gJy4vUmVzb3VyY2UnO1xyXG5cclxuY2xhc3MgSW1hZ2VSZXNvdXJjZSBleHRlbmRzIFJlc291cmNlIHtcclxuICAgIGltYWdlOiBQNS5JbWFnZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwYXRoOiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcihwYXRoKTtcclxuICAgIH1cclxuXHJcbiAgICBsb2FkUmVzb3VyY2UoZ2FtZTogUDUpIHtcclxuICAgICAgICB0aGlzLmltYWdlID0gZ2FtZS5sb2FkSW1hZ2UodGhpcy5wYXRoKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIodGFyZ2V0OiBhbnksIHg6IG51bWJlciwgeTogbnVtYmVyLCB3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcikge1xyXG4gICAgICAgIC8vIFZlcmlmeSB0aGF0IHRoZSB0aWxlcyBoYXMgYmVlbiBsb2FkZWRcclxuICAgICAgICBpZiAodGhpcy5pbWFnZSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAgICAgICAgICAgICBgVHJpZWQgdG8gcmVuZGVyIGltYWdlIGJlZm9yZSBsb2FkaW5nIGl0OiAke3RoaXMucGF0aH1gXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIC8vIERyYXcgbm9uIHRpbGVzIGltYWdlXHJcbiAgICAgICAgdGFyZ2V0LmltYWdlKHRoaXMuaW1hZ2UsIHgsIHksIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlclBhcnRpYWwoXHJcbiAgICAgICAgdGFyZ2V0OiBhbnksXHJcbiAgICAgICAgeDogbnVtYmVyLFxyXG4gICAgICAgIHk6IG51bWJlcixcclxuICAgICAgICB3aWR0aDogbnVtYmVyLFxyXG4gICAgICAgIGhlaWdodDogbnVtYmVyLFxyXG4gICAgICAgIHNvdXJjZVg/OiBudW1iZXIsXHJcbiAgICAgICAgc291cmNlWT86IG51bWJlcixcclxuICAgICAgICBzb3VyY2VXaWR0aD86IG51bWJlcixcclxuICAgICAgICBzb3VyY2VIZWlnaHQ/OiBudW1iZXJcclxuICAgICkge1xyXG4gICAgICAgIC8vIFZlcmlmeSB0aGF0IHRoZSB0aWxlcyBoYXMgYmVlbiBsb2FkZWRcclxuICAgICAgICBpZiAodGhpcy5pbWFnZSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAgICAgICAgICAgICBgVHJpZWQgdG8gcmVuZGVyIGltYWdlIGJlZm9yZSBsb2FkaW5nIGl0OiAke3RoaXMucGF0aH1gXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIC8vIERyYXcgYSBwYXJ0aWFsIHBhcnQgb2YgdGhlIGltYWdlXHJcbiAgICAgICAgdGFyZ2V0LmltYWdlKFxyXG4gICAgICAgICAgICB0aGlzLmltYWdlLFxyXG4gICAgICAgICAgICB4LFxyXG4gICAgICAgICAgICB5LFxyXG4gICAgICAgICAgICB3aWR0aCxcclxuICAgICAgICAgICAgaGVpZ2h0LFxyXG4gICAgICAgICAgICBzb3VyY2VYLFxyXG4gICAgICAgICAgICBzb3VyY2VZLFxyXG4gICAgICAgICAgICBzb3VyY2VXaWR0aCxcclxuICAgICAgICAgICAgc291cmNlSGVpZ2h0XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0ID0gSW1hZ2VSZXNvdXJjZTtcclxuIiwiaW1wb3J0IFA1IGZyb20gJ3A1JztcclxuXHJcbmFic3RyYWN0IGNsYXNzIFJlc291cmNlIHtcclxuICAgIHBhdGg6IHN0cmluZztcclxuXHJcbiAgICBwcm90ZWN0ZWQgY29uc3RydWN0b3IocGF0aDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5wYXRoID0gcGF0aDtcclxuICAgIH1cclxuXHJcbiAgICBhYnN0cmFjdCBsb2FkUmVzb3VyY2Uoc2tldGNoOiBQNSk6IHZvaWQ7XHJcbn1cclxuXHJcbmV4cG9ydCA9IFJlc291cmNlO1xyXG4iLCJpbXBvcnQgSW1hZ2VSZXNvdXJjZSBmcm9tICcuL0ltYWdlUmVzb3VyY2UnO1xyXG5cclxuY2xhc3MgVGlsZVJlc291cmNlIGV4dGVuZHMgSW1hZ2VSZXNvdXJjZSB7XHJcbiAgICAvLyBUaGUgd2lkdGggYW5kIGhlaWdodCBvZiB0aGUgdGlsZXMgc2V0XHJcbiAgICB3aWR0aDogbnVtYmVyO1xyXG4gICAgaGVpZ2h0OiBudW1iZXI7XHJcblxyXG4gICAgLy8gVGhlIHdpZHRoIGFuZCBoZWlnaHQgb2YgZWFjaCB0aWxlcyBpbiBwaXhlbHNcclxuICAgIHRpbGVXaWR0aDogbnVtYmVyO1xyXG4gICAgdGlsZUhlaWdodDogbnVtYmVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHBhdGg6IHN0cmluZyxcclxuICAgICAgICB3aWR0aDogbnVtYmVyLFxyXG4gICAgICAgIGhlaWdodDogbnVtYmVyLFxyXG4gICAgICAgIHRpbGVXaWR0aDogbnVtYmVyLFxyXG4gICAgICAgIHRpbGVIZWlnaHQ6IG51bWJlclxyXG4gICAgKSB7XHJcbiAgICAgICAgc3VwZXIocGF0aCk7XHJcbiAgICAgICAgdGhpcy53aWR0aCA9IHdpZHRoO1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG4gICAgICAgIHRoaXMudGlsZVdpZHRoID0gdGlsZVdpZHRoO1xyXG4gICAgICAgIHRoaXMudGlsZUhlaWdodCA9IHRpbGVIZWlnaHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyVGlsZShcclxuICAgICAgICBpOiBudW1iZXIsXHJcbiAgICAgICAgdGFyZ2V0OiBhbnksXHJcbiAgICAgICAgeDogbnVtYmVyLFxyXG4gICAgICAgIHk6IG51bWJlcixcclxuICAgICAgICB3aWR0aDogbnVtYmVyLFxyXG4gICAgICAgIGhlaWdodDogbnVtYmVyXHJcbiAgICApIHtcclxuICAgICAgICBjb25zdCB0aWxlU2V0WCA9IGkgJSB0aGlzLndpZHRoO1xyXG4gICAgICAgIGNvbnN0IHRpbGVTZXRZID0gTWF0aC5mbG9vcihpIC8gdGhpcy53aWR0aCk7XHJcblxyXG4gICAgICAgIC8vIE1ha2Ugc3VyZSB0aGUgdGlsZXMgaXNuJ3Qgb3V0IG9mIGJvdW5kc1xyXG4gICAgICAgIGlmICh0aWxlU2V0WSA+IHRoaXMuaGVpZ2h0KVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAgICAgICAgICAgICBgT3V0IG9mIGJvdW5kcyB0aWxlLiBUcmllZCB0byByZW5kZXIgdGlsZSBpbmRleCAke2l9IHdpdGggYSBtYXhpbXVtIG9mICR7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53aWR0aCAqIHRoaXMuaGVpZ2h0XHJcbiAgICAgICAgICAgICAgICB9IHRpbGVzYFxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICBzdXBlci5yZW5kZXJQYXJ0aWFsKFxyXG4gICAgICAgICAgICB0YXJnZXQsXHJcbiAgICAgICAgICAgIHgsXHJcbiAgICAgICAgICAgIHksXHJcbiAgICAgICAgICAgIHdpZHRoLFxyXG4gICAgICAgICAgICBoZWlnaHQsXHJcbiAgICAgICAgICAgIHRpbGVTZXRYICogdGhpcy50aWxlV2lkdGgsXHJcbiAgICAgICAgICAgIHRpbGVTZXRZICogdGhpcy50aWxlSGVpZ2h0LFxyXG4gICAgICAgICAgICB0aGlzLnRpbGVXaWR0aCxcclxuICAgICAgICAgICAgdGhpcy50aWxlSGVpZ2h0XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRUaWxlQXRDb29yZGluYXRlKFxyXG4gICAgICAgIHg6IG51bWJlcixcclxuICAgICAgICB5OiBudW1iZXIsXHJcbiAgICAgICAgdGFyZ2V0OiBhbnksXHJcbiAgICAgICAgeFBvczogbnVtYmVyLFxyXG4gICAgICAgIHlQb3M6IG51bWJlcixcclxuICAgICAgICB3aWR0aDogbnVtYmVyLFxyXG4gICAgICAgIGhlaWdodDogbnVtYmVyXHJcbiAgICApIHtcclxuICAgICAgICBpZiAoeCA+IHRoaXMud2lkdGggfHwgeSA+IHRoaXMuaGVpZ2h0IHx8IHggPCAwIHx8IHkgPCAwKVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAgICAgICAgICAgICBgT3V0IG9mIGJvdW5kcyB0aWxlLiBUcmllZCB0byBsb2FkIHRpbGUgYXQgJHt4fSwgJHt5fSBvbiBhICR7dGhpcy53aWR0aH0sICR7dGhpcy5oZWlnaHR9IGdyaWRgXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIHN1cGVyLnJlbmRlclBhcnRpYWwoXHJcbiAgICAgICAgICAgIHRhcmdldCxcclxuICAgICAgICAgICAgeFBvcyxcclxuICAgICAgICAgICAgeVBvcyxcclxuICAgICAgICAgICAgd2lkdGgsXHJcbiAgICAgICAgICAgIGhlaWdodCxcclxuICAgICAgICAgICAgeCAqIHRoaXMudGlsZVdpZHRoLFxyXG4gICAgICAgICAgICB5ICogdGhpcy50aWxlSGVpZ2h0LFxyXG4gICAgICAgICAgICB0aGlzLnRpbGVXaWR0aCxcclxuICAgICAgICAgICAgdGhpcy50aWxlSGVpZ2h0XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0ID0gVGlsZVJlc291cmNlO1xyXG4iLCJpbXBvcnQgUmVuZGVyYWJsZSBmcm9tICcuLi9pbnRlcmZhY2VzL1JlbmRlcmFibGUnO1xyXG5pbXBvcnQgcDUgZnJvbSAncDUnO1xyXG5pbXBvcnQgeyBBdWRpb0Fzc2V0cywgVWlBc3NldHMgfSBmcm9tICcuLi9hc3NldHMvQXNzZXRzJztcclxuaW1wb3J0IEltYWdlUmVzb3VyY2UgZnJvbSAnLi4vYXNzZXRzL3Jlc291cmNlcy9JbWFnZVJlc291cmNlJztcclxuaW1wb3J0IEZvbnRSZXNvdXJjZSBmcm9tICcuLi9hc3NldHMvcmVzb3VyY2VzL0ZvbnRSZXNvdXJjZSc7XHJcblxyXG5jbGFzcyBCdXR0b24gaW1wbGVtZW50cyBSZW5kZXJhYmxlIHtcclxuXHJcbiAgICBmb250OiBGb250UmVzb3VyY2VcclxuICAgIHR4dDogc3RyaW5nXHJcbiAgICBkZXNjcmlwdGlvbjogc3RyaW5nXHJcbiAgICBvblByZXNzZWRDdXN0b206IEZ1bmN0aW9uXHJcbiAgICB4OiBudW1iZXJcclxuICAgIHk6IG51bWJlclxyXG4gICAgdzogbnVtYmVyXHJcbiAgICBoOiBudW1iZXJcclxuICAgIGltYWdlOiBJbWFnZVJlc291cmNlXHJcbiAgICBtb3VzZUlzT3ZlcjogYm9vbGVhblxyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIGZvbnQ6IEZvbnRSZXNvdXJjZSxcclxuICAgICAgICB0eHQ6IHN0cmluZyxcclxuICAgICAgICBkZXNjcmlwdGlvbjogc3RyaW5nLFxyXG4gICAgICAgIHg6IG51bWJlcixcclxuICAgICAgICB5OiBudW1iZXIsXHJcbiAgICAgICAgdzogbnVtYmVyLFxyXG4gICAgICAgIGg6IG51bWJlcixcclxuICAgICAgICBvblByZXNzZWRDdXN0b206IEZ1bmN0aW9uKSB7XHJcbiAgICAgICAgdGhpcy5mb250ID0gZm9udDtcclxuICAgICAgICB0aGlzLnR4dCA9IHR4dFxyXG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvblxyXG4gICAgICAgIHRoaXMub25QcmVzc2VkQ3VzdG9tID0gb25QcmVzc2VkQ3VzdG9tXHJcbiAgICAgICAgdGhpcy54ID0geFxyXG4gICAgICAgIHRoaXMueSA9IHlcclxuICAgICAgICB0aGlzLncgPSB3XHJcbiAgICAgICAgdGhpcy5oID0gaFxyXG4gICAgICAgIHRoaXMuaW1hZ2UgPSBVaUFzc2V0cy5idXR0b25fdW5zZWxlY3RlZDtcclxuICAgICAgICB0aGlzLm1vdXNlSXNPdmVyID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKHRhcmdldDogcDUsIHVwc2NhbGVTaXplOiBudW1iZXIpIHtcclxuICAgICAgICAvLyBzZXQgdGhlIGNvb3JkcyBhbmQgZGltZW5zaW9ucyB0byByb3VuZCB0byB0aGUgbmVhcmVzdCB1bi11cHNjYWxlZCBwaXhlbFxyXG4gICAgICAgIGNvbnN0IHggPSBNYXRoLnJvdW5kKHRoaXMueCAvIHVwc2NhbGVTaXplKSAqIHVwc2NhbGVTaXplO1xyXG4gICAgICAgIGNvbnN0IHkgPSBNYXRoLnJvdW5kKHRoaXMueSAvIHVwc2NhbGVTaXplKSAqIHVwc2NhbGVTaXplO1xyXG4gICAgICAgIGNvbnN0IHcgPSBNYXRoLnJvdW5kKHRoaXMudyAvIHVwc2NhbGVTaXplKSAqIHVwc2NhbGVTaXplO1xyXG4gICAgICAgIGNvbnN0IGggPSBNYXRoLnJvdW5kKHRoaXMuaCAvIHVwc2NhbGVTaXplKSAqIHVwc2NhbGVTaXplO1xyXG5cclxuICAgICAgICAvLyBjb3JuZXJzXHJcbiAgICAgICAgdGhpcy5pbWFnZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCwgeSwgNyAqIHVwc2NhbGVTaXplLCA3ICogdXBzY2FsZVNpemUsIDAsIDAsIDcsIDcpO1xyXG4gICAgICAgIHRoaXMuaW1hZ2UucmVuZGVyUGFydGlhbCh0YXJnZXQsIHggKyB3IC0gNyAqIHVwc2NhbGVTaXplLCB5LCA3ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgOCwgMCwgNywgNyk7XHJcbiAgICAgICAgdGhpcy5pbWFnZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCwgeSArIGggLSA3ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCAwLCA4LCA3LCA3KTtcclxuICAgICAgICB0aGlzLmltYWdlLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4ICsgdyAtIDcgKiB1cHNjYWxlU2l6ZSwgeSArIGggLSA3ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCA4LCA4LCA3LCA3KTtcclxuXHJcbiAgICAgICAgLy8gdG9wIGFuZCBib3R0b21cclxuICAgICAgICB0aGlzLmltYWdlLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4ICsgNyAqIHVwc2NhbGVTaXplLCB5LCB3IC0gMTQgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCA3LCAwLCAxLCA3KTtcclxuICAgICAgICB0aGlzLmltYWdlLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4ICsgNyAqIHVwc2NhbGVTaXplLCB5ICsgaCAtIDcgKiB1cHNjYWxlU2l6ZSwgdyAtIDE0ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgNywgOCwgMSwgNyk7XHJcblxyXG4gICAgICAgIC8vIGxlZnQgYW5kIHJpZ2h0XHJcbiAgICAgICAgdGhpcy5pbWFnZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCwgeSArIDcgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCBoIC0gMTQgKiB1cHNjYWxlU2l6ZSwgMCwgNywgNywgMSk7XHJcbiAgICAgICAgdGhpcy5pbWFnZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCArIHcgLSA3ICogdXBzY2FsZVNpemUsIHkgKyA3ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgaCAtIDE0ICogdXBzY2FsZVNpemUsIDgsIDcsIDcsIDEpO1xyXG5cclxuICAgICAgICAvLyBjZW50ZXJcclxuICAgICAgICB0aGlzLmltYWdlLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4ICsgNyAqIHVwc2NhbGVTaXplLCB5ICsgNyAqIHVwc2NhbGVTaXplLCB3IC0gMTQgKiB1cHNjYWxlU2l6ZSwgaCAtIDE0ICogdXBzY2FsZVNpemUsIDcsIDcsIDEsIDEpO1xyXG5cclxuICAgICAgICB0aGlzLmZvbnQuZHJhd1RleHQodGFyZ2V0LCB0aGlzLnR4dCwgeCArIDYgKiB1cHNjYWxlU2l6ZSwgTWF0aC5yb3VuZCgodGhpcy55ICsgdGhpcy5oIC8gMikgLyB1cHNjYWxlU2l6ZSkgKiB1cHNjYWxlU2l6ZSAtIDYgKiB1cHNjYWxlU2l6ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlTW91c2VPdmVyKG1vdXNlWDogbnVtYmVyLCBtb3VzZVk6IG51bWJlcikge1xyXG4gICAgICAgIC8vIGlmIHRoZSBtb3VzZSBwb3NpdGlvbiBpcyBpbnNpZGUgdGhlIGJ1dHRvbiwgcmV0dXJuIHRydWVcclxuICAgICAgICBpZiAobW91c2VYID4gdGhpcy54ICYmIG1vdXNlWCA8IHRoaXMueCArIHRoaXMudyAmJiBtb3VzZVkgPiB0aGlzLnkgJiYgbW91c2VZIDwgdGhpcy55ICsgdGhpcy5oKSB7XHJcbiAgICAgICAgICAgIHRoaXMubW91c2VJc092ZXIgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLmltYWdlID0gVWlBc3NldHMuYnV0dG9uX3NlbGVjdGVkO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5tb3VzZUlzT3ZlciA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLmltYWdlID0gVWlBc3NldHMuYnV0dG9uX3Vuc2VsZWN0ZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9uUHJlc3NlZCgpIHtcclxuICAgICAgICB0aGlzLm9uUHJlc3NlZEN1c3RvbSgpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiYnV0dG9uIHByZXNzZWRcIik7XHJcbiAgICAgICAgQXVkaW9Bc3NldHMudWkuaW52ZW50b3J5Q2xhY2sucGxheVJhbmRvbSgpO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuZXhwb3J0ID0gQnV0dG9uOyIsImltcG9ydCBSZW5kZXJhYmxlIGZyb20gJy4uL2ludGVyZmFjZXMvUmVuZGVyYWJsZSc7XHJcbmltcG9ydCBwNSBmcm9tICdwNSc7XHJcbmltcG9ydCB7IFVpQXNzZXRzIH0gZnJvbSAnLi4vYXNzZXRzL0Fzc2V0cyc7XHJcbmltcG9ydCBJbWFnZVJlc291cmNlIGZyb20gJy4uL2Fzc2V0cy9yZXNvdXJjZXMvSW1hZ2VSZXNvdXJjZSc7XHJcbmltcG9ydCBnYW1lIGZyb20gJy4uL01haW4nXHJcbmltcG9ydCBGb250UmVzb3VyY2UgZnJvbSAnLi4vYXNzZXRzL3Jlc291cmNlcy9Gb250UmVzb3VyY2UnO1xyXG5cclxuY2xhc3MgU2xpZGVyIGltcGxlbWVudHMgUmVuZGVyYWJsZSB7XHJcblxyXG4gICAgdmFsdWU6IG51bWJlclxyXG4gICAgbWluOiBudW1iZXJcclxuICAgIG1heDogbnVtYmVyXHJcbiAgICBzdGVwOiBudW1iZXJcclxuICAgIHg6IG51bWJlclxyXG4gICAgeTogbnVtYmVyXHJcbiAgICB3OiBudW1iZXJcclxuICAgIGg6IG51bWJlclxyXG4gICAgYmVpbmdFZGl0ZWQ6IGJvb2xlYW5cclxuXHJcbiAgICBvbkNoYW5nZWQ6IEZ1bmN0aW9uXHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgZm9udDogRm9udFJlc291cmNlLFxyXG4gICAgICAgIHR4dDogc3RyaW5nLFxyXG4gICAgICAgIHZhbHVlOm51bWJlcixcclxuICAgICAgICBtaW46IG51bWJlcixcclxuICAgICAgICBtYXg6IG51bWJlcixcclxuICAgICAgICBzdGVwOiBudW1iZXIsXHJcbiAgICAgICAgeDogbnVtYmVyLFxyXG4gICAgICAgIHk6IG51bWJlcixcclxuICAgICAgICB3OiBudW1iZXIsXHJcbiAgICAgICAgaDogbnVtYmVyLFxyXG4gICAgICAgIG9uQ2hhbmdlZDogRnVuY3Rpb24pIHtcclxuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWVcclxuICAgICAgICB0aGlzLm1pbiA9IG1pblxyXG4gICAgICAgIHRoaXMubWF4ID0gbWF4XHJcbiAgICAgICAgdGhpcy5zdGVwID0gc3RlcFxyXG4gICAgICAgIHRoaXMub25DaGFuZ2VkID0gb25DaGFuZ2VkXHJcbiAgICAgICAgdGhpcy54ID0geFxyXG4gICAgICAgIHRoaXMueSA9IHlcclxuICAgICAgICB0aGlzLncgPSB3XHJcbiAgICAgICAgdGhpcy5oID0gaFxyXG4gICAgICAgIHRoaXMuYmVpbmdFZGl0ZWQgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIodGFyZ2V0OiBwNSwgdXBzY2FsZVNpemU6IG51bWJlcikge1xyXG4gICAgICAgIC8vIHNldCB0aGUgY29vcmRzIGFuZCBkaW1lbnNpb25zIHRvIHJvdW5kIHRvIHRoZSBuZWFyZXN0IHVuLXVwc2NhbGVkIHBpeGVsXHJcbiAgICAgICAgY29uc3QgeCA9IE1hdGgucm91bmQodGhpcy54L3Vwc2NhbGVTaXplKSp1cHNjYWxlU2l6ZTtcclxuICAgICAgICBjb25zdCB5ID0gTWF0aC5yb3VuZCgodGhpcy55K3RoaXMuaC8yKS91cHNjYWxlU2l6ZSkqdXBzY2FsZVNpemU7XHJcbiAgICAgICAgY29uc3QgdyA9IE1hdGgucm91bmQodGhpcy53L3Vwc2NhbGVTaXplKSp1cHNjYWxlU2l6ZTtcclxuXHJcbiAgICAgICAgLy8gbGVmdCBzaWRlIG9mIHNsaWRlciBiYXJcclxuICAgICAgICBVaUFzc2V0cy5zbGlkZXJfYmFyLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4LCB5LTIqdXBzY2FsZVNpemUsIDIqdXBzY2FsZVNpemUsIDQqdXBzY2FsZVNpemUsIDAsIDAsIDIsIDQpO1xyXG4gICAgICAgIC8vIHJpZ2h0IHNpZGUgb2Ygc2xpZGVyIGJhclxyXG4gICAgICAgIFVpQXNzZXRzLnNsaWRlcl9iYXIucmVuZGVyUGFydGlhbCh0YXJnZXQsIHgrdy0yKnVwc2NhbGVTaXplLCB5LTIqdXBzY2FsZVNpemUsIDIqdXBzY2FsZVNpemUsIDQqdXBzY2FsZVNpemUsIDMsIDAsIDIsIDQpO1xyXG4gICAgICAgIC8vIGNlbnRlciBvZiBzbGlkZXIgYmFyXHJcbiAgICAgICAgVWlBc3NldHMuc2xpZGVyX2Jhci5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCsyKnVwc2NhbGVTaXplLCB5LTIqdXBzY2FsZVNpemUsIHctNCp1cHNjYWxlU2l6ZSwgNCp1cHNjYWxlU2l6ZSwgMiwgMCwgMSwgNCk7XHJcbiAgICAgICAgLy8gaGFuZGxlXHJcbiAgICAgICAgVWlBc3NldHMuc2xpZGVyX2hhbmRsZS5yZW5kZXIodGFyZ2V0LCB4K01hdGgucm91bmQoKHRoaXMudmFsdWUtdGhpcy5taW4pLyh0aGlzLm1heC10aGlzLm1pbikqKHctOCp1cHNjYWxlU2l6ZSkvdXBzY2FsZVNpemUpKnVwc2NhbGVTaXplLCB5LTQqdXBzY2FsZVNpemUsIDgqdXBzY2FsZVNpemUsIDkqdXBzY2FsZVNpemUpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVNsaWRlclBvc2l0aW9uKG1vdXNlWDogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYodGhpcy5iZWluZ0VkaXRlZCl7XHJcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSBNYXRoLm1heCh0aGlzLm1pbiwgTWF0aC5taW4odGhpcy5tYXgsIE1hdGgucm91bmQoKHRoaXMubWluKyh0aGlzLm1heC10aGlzLm1pbikqKCgobW91c2VYLXRoaXMueC00KmdhbWUudXBzY2FsZVNpemUpIC8gKHRoaXMudy0oOCpnYW1lLnVwc2NhbGVTaXplKSkpKSkvdGhpcy5zdGVwKSp0aGlzLnN0ZXApKTtcclxuICAgICAgICAgICAgdGhpcy5vbkNoYW5nZWQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQgPSBTbGlkZXI7IiwiaW1wb3J0IFJlbmRlcmFibGUgZnJvbSAnLi4vaW50ZXJmYWNlcy9SZW5kZXJhYmxlJztcclxuaW1wb3J0IHA1IGZyb20gJ3A1JztcclxuaW1wb3J0IHsgVWlBc3NldHMgfSBmcm9tICcuLi9hc3NldHMvQXNzZXRzJztcclxuXHJcbmNsYXNzIFVpRnJhbWUgaW1wbGVtZW50cyBSZW5kZXJhYmxlIHtcclxuXHJcbiAgICB4OiBudW1iZXJcclxuICAgIHk6IG51bWJlclxyXG4gICAgdzogbnVtYmVyXHJcbiAgICBoOiBudW1iZXJcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICB4OiBudW1iZXIsXHJcbiAgICAgICAgeTogbnVtYmVyLFxyXG4gICAgICAgIHc6IG51bWJlcixcclxuICAgICAgICBoOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnggPSB4XHJcbiAgICAgICAgdGhpcy55ID0geVxyXG4gICAgICAgIHRoaXMudyA9IHdcclxuICAgICAgICB0aGlzLmggPSBoXHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKHRhcmdldDogcDUsIHVwc2NhbGVTaXplOiBudW1iZXIpIHtcclxuICAgICAgICAvLyBzZXQgdGhlIGNvb3JkcyBhbmQgZGltZW5zaW9ucyB0byByb3VuZCB0byB0aGUgbmVhcmVzdCB1bi11cHNjYWxlZCBwaXhlbFxyXG4gICAgICAgIGNvbnN0IHggPSBNYXRoLnJvdW5kKHRoaXMueC91cHNjYWxlU2l6ZSkqdXBzY2FsZVNpemU7XHJcbiAgICAgICAgY29uc3QgeSA9IE1hdGgucm91bmQodGhpcy55L3Vwc2NhbGVTaXplKSp1cHNjYWxlU2l6ZTtcclxuICAgICAgICBjb25zdCB3ID0gTWF0aC5yb3VuZCh0aGlzLncvdXBzY2FsZVNpemUpKnVwc2NhbGVTaXplO1xyXG4gICAgICAgIGNvbnN0IGggPSBNYXRoLnJvdW5kKHRoaXMuaC91cHNjYWxlU2l6ZSkqdXBzY2FsZVNpemU7XHJcblxyXG4gICAgICAgIC8vIGNvcm5lcnNcclxuICAgICAgICBVaUFzc2V0cy51aV9mcmFtZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCwgeSwgNyp1cHNjYWxlU2l6ZSwgNyp1cHNjYWxlU2l6ZSwgMCwgMCwgNywgNyk7XHJcbiAgICAgICAgVWlBc3NldHMudWlfZnJhbWUucmVuZGVyUGFydGlhbCh0YXJnZXQsIHgrdy03KnVwc2NhbGVTaXplLCB5LCA3KnVwc2NhbGVTaXplLCA3KnVwc2NhbGVTaXplLCA4LCAwLCA3LCA3KTtcclxuICAgICAgICBVaUFzc2V0cy51aV9mcmFtZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCwgeStoLTcqdXBzY2FsZVNpemUsIDcqdXBzY2FsZVNpemUsIDcqdXBzY2FsZVNpemUsIDAsIDgsIDcsIDcpO1xyXG4gICAgICAgIFVpQXNzZXRzLnVpX2ZyYW1lLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4K3ctNyp1cHNjYWxlU2l6ZSwgeStoLTcqdXBzY2FsZVNpemUsIDcqdXBzY2FsZVNpemUsIDcqdXBzY2FsZVNpemUsIDgsIDgsIDcsIDcpO1xyXG5cclxuICAgICAgICAvLyB0b3AgYW5kIGJvdHRvbVxyXG4gICAgICAgIFVpQXNzZXRzLnVpX2ZyYW1lLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4KzcqdXBzY2FsZVNpemUsIHksIHctMTQqdXBzY2FsZVNpemUsIDcqdXBzY2FsZVNpemUsIDcsIDAsIDEsIDcpO1xyXG4gICAgICAgIFVpQXNzZXRzLnVpX2ZyYW1lLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4KzcqdXBzY2FsZVNpemUsIHkraC03KnVwc2NhbGVTaXplLCB3LTE0KnVwc2NhbGVTaXplLCA3KnVwc2NhbGVTaXplLCA3LCA4LCAxLCA3KTtcclxuXHJcbiAgICAgICAgLy8gbGVmdCBhbmQgcmlnaHRcclxuICAgICAgICBVaUFzc2V0cy51aV9mcmFtZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCwgeSs3KnVwc2NhbGVTaXplLCA3KnVwc2NhbGVTaXplLCBoLTE0KnVwc2NhbGVTaXplLCAwLCA3LCA3LCAxKTtcclxuICAgICAgICBVaUFzc2V0cy51aV9mcmFtZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCt3LTcqdXBzY2FsZVNpemUsIHkrNyp1cHNjYWxlU2l6ZSwgNyp1cHNjYWxlU2l6ZSwgaC0xNCp1cHNjYWxlU2l6ZSwgOCwgNywgNywgMSk7XHJcblxyXG4gICAgICAgIC8vIGNlbnRlclxyXG4gICAgICAgIFVpQXNzZXRzLnVpX2ZyYW1lLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4KzcqdXBzY2FsZVNpemUsIHkrNyp1cHNjYWxlU2l6ZSwgdy0xNCp1cHNjYWxlU2l6ZSwgaC0xNCp1cHNjYWxlU2l6ZSwgNywgNywgMSwgMSk7XHJcblxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgPSBVaUZyYW1lOyIsImltcG9ydCBSZW5kZXJhYmxlIGZyb20gJy4uL2ludGVyZmFjZXMvUmVuZGVyYWJsZSc7XHJcbmltcG9ydCBwNSBmcm9tICdwNSc7XHJcbmltcG9ydCBCdXR0b24gZnJvbSAnLi4vdWkvQnV0dG9uJztcclxuaW1wb3J0IFNsaWRlciBmcm9tICcuLi91aS9TbGlkZXInO1xyXG5pbXBvcnQgVWlGcmFtZSBmcm9tICcuL1VpRnJhbWUnO1xyXG5pbXBvcnQgZ2FtZSBmcm9tICcuLi9NYWluJztcclxuXHJcbmFic3RyYWN0IGNsYXNzIFVpU2NyZWVuIGltcGxlbWVudHMgUmVuZGVyYWJsZSB7XHJcblxyXG4gICAgYnV0dG9uczogQnV0dG9uW107XHJcbiAgICBzbGlkZXJzOiBTbGlkZXJbXTtcclxuXHJcbiAgICBmcmFtZTogVWlGcmFtZVxyXG5cclxuICAgIGFic3RyYWN0IHJlbmRlcih0YXJnZXQ6IHA1LCB1cHNjYWxlU2l6ZTogbnVtYmVyKTogdm9pZDtcclxuXHJcbiAgICBhYnN0cmFjdCB3aW5kb3dVcGRhdGUoKTogdm9pZFxyXG5cclxuICAgIG1vdXNlUHJlc3NlZCgpIHtcclxuICAgICAgICBpZih0aGlzLmJ1dHRvbnMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAvLyBsb29wIHRocm91Z2ggYWxsIHRoZSBidXR0b25zIGluIHRoaXMgbWVudSBhbmQgaWYgdGhlIG1vdXNlIGlzIG92ZXIgdGhlbSwgdGhlbiBjYWxsIHRoZSBidXR0b24ncyBvblByZXNzZWQoKSBmdW5jdGlvbi4gIFRoZSBvblByZXNzZWQoKSBmdW5jdGlvbiBpcyBwYXNzZWQgaW4gdGhyb3VnaCB0aGUgY29uc3RydWN0b3IuXHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9ucy5mb3JFYWNoKGJ1dHRvbiA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZihidXR0b24ubW91c2VJc092ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBidXR0b24ub25QcmVzc2VkKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLnNsaWRlcnMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAvLyBsb29wIHRocm91Z2ggYWxsIHRoZSBzbGlkZXJzIGFuZCBpbnRlcmFjdCB3aXRoIHRoZW0gYWNjb3JkaW5nbHlcclxuICAgICAgICAgICAgZm9yKGNvbnN0IGkgb2YgdGhpcy5zbGlkZXJzKSB7XHJcbiAgICAgICAgICAgICAgICBpLnVwZGF0ZVNsaWRlclBvc2l0aW9uKGdhbWUubW91c2VYKTtcclxuICAgICAgICAgICAgICAgIGlmKGdhbWUubW91c2VYPmkueCAmJiBnYW1lLm1vdXNlWDxpLngraS53ICYmIGdhbWUubW91c2VZPmkueSAmJiBnYW1lLm1vdXNlWTxpLnkraS5oKVxyXG4gICAgICAgICAgICAgICAgICAgIGkuYmVpbmdFZGl0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG1vdXNlUmVsZWFzZWQoKSB7XHJcbiAgICAgICAgaWYodGhpcy5zbGlkZXJzICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgLy8gbG9vcCB0aHJvdWdoIGFsbCB0aGUgc2xpZGVycyBhbmQgaW50ZXJhY3Qgd2l0aCB0aGVtIGFjY29yZGluZ2x5XHJcbiAgICAgICAgICAgIGZvcihjb25zdCBpIG9mIHRoaXMuc2xpZGVycykge1xyXG4gICAgICAgICAgICAgICAgaS5iZWluZ0VkaXRlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufVxyXG5cclxuZXhwb3J0ID0gVWlTY3JlZW4iLCJpbXBvcnQgVWlTY3JlZW4gZnJvbSAnLi4vVWlTY3JlZW4nO1xyXG5pbXBvcnQgcDUgZnJvbSAncDUnO1xyXG5pbXBvcnQgVWlGcmFtZSBmcm9tICcuLi9VaUZyYW1lJztcclxuaW1wb3J0IGdhbWUgZnJvbSAnLi4vLi4vTWFpbic7XHJcbmltcG9ydCBCdXR0b24gZnJvbSAnLi4vQnV0dG9uJztcclxuaW1wb3J0IFNsaWRlciBmcm9tICcuLi9TbGlkZXInO1xyXG5pbXBvcnQgeyBPcHRpb25zTWVudSB9IGZyb20gJy4vT3B0aW9uc01lbnUnO1xyXG5pbXBvcnQgRm9udFJlc291cmNlIGZyb20gJy4uLy4uL2Fzc2V0cy9yZXNvdXJjZXMvRm9udFJlc291cmNlJztcclxuaW1wb3J0IHsgVWlBc3NldHMgfSBmcm9tICcuLi8uLi9hc3NldHMvQXNzZXRzJztcclxuaW1wb3J0IHsgV29ybGRDcmVhdGlvbk1lbnUgfSBmcm9tICcuL1dvcmxkQ3JlYXRpb25NZW51JztcclxuXHJcbmV4cG9ydCBjbGFzcyBNYWluTWVudSBleHRlbmRzIFVpU2NyZWVuIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihmb250OiBGb250UmVzb3VyY2UpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICAvLyBtYWtlIHRoZSBmcmFtZSB3aXRoIHNvbWUgZGVmYXVsdCB2YWx1ZXMuICBUaGVzZSB3aWxsIGxhdGVyIGJlIGNoYW5nZWQgdG8gZml0IHRoZSBzY3JlZW4gc2l6ZS5cclxuICAgICAgICB0aGlzLmZyYW1lID0gbmV3IFVpRnJhbWUoMCwgMCwgMCwgMCk7XHJcblxyXG4gICAgICAgIC8vIG1ha2UgNCBidXR0b25zIHdpdGggZGVmYXVsdCBwb3NpdGlvbnNcclxuICAgICAgICB0aGlzLmJ1dHRvbnMgPSBbXHJcbiAgICAgICAgICAgIG5ldyBCdXR0b24oZm9udCwgXCJSZXN1bWUgR2FtZVwiLCBcIktlZXAgcGxheWluZyB3aGVyZSB5b3UgbGVmdCBvZmYuXCIsIDAsIDAsIDAsIDAsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicmVzdW1lIGdhbWVcIik7XHJcbiAgICAgICAgICAgICAgICBnYW1lLmN1cnJlbnRVaSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIG5ldyBCdXR0b24oZm9udCwgXCJOZXcgR2FtZVwiLCBcIkNyZWF0ZXMgYSBuZXcgc2VydmVyIHRoYXQgeW91ciBmcmllbmRzIGNhbiBqb2luLlwiLCAwLCAwLCAwLCAwLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm5ldyBnYW1lXCIpO1xyXG4gICAgICAgICAgICAgICAgZ2FtZS5jdXJyZW50VWkgPSBuZXcgV29ybGRDcmVhdGlvbk1lbnUoZm9udCk7XHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBuZXcgQnV0dG9uKGZvbnQsIFwiSm9pbiBHYW1lXCIsIFwiSm9pbiBhIGdhbWUgd2l0aCB5b3VyIGZyaWVuZHMsIG9yIG1ha2UgbmV3IG9uZXMuXCIsIDAsIDAsIDAsIDAsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiam9pbiBnYW1lXCIpO1xyXG4gICAgICAgICAgICAgICAgZ2FtZS5jdXJyZW50VWkgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBuZXcgQnV0dG9uKGZvbnQsIFwiT3B0aW9uc1wiLCBcIkNoYW5nZSB5b3VyIGtleWJpbmRzLCByZWR1Y2UgbGFnLCBldGMuXCIsIDAsIDAsIDAsIDAsICgpID0+e1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJvcHRpb25zXCIpO1xyXG4gICAgICAgICAgICAgICAgZ2FtZS5jdXJyZW50VWkgPSBuZXcgT3B0aW9uc01lbnUoZm9udCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgXTtcclxuXHJcbiAgICAgICAgLy8gdXBkYXRlIHRoZSBzaXplIG9mIHRoZSBlbGVtZW50cyBiYXNlZCBvbiB0aGUgaW5pdGlhbCBzY3JlZW4gc2l6ZVxyXG4gICAgICAgIHRoaXMud2luZG93VXBkYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKHRhcmdldDogcDUsIHVwc2NhbGVTaXplOiBudW1iZXIpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgLy8gcmVuZGVyIHRoZSByZWN0YW5ndWxhciBpbWFnZSB0aGF0IHRoZSB3aG9sZSBtZW51IGlzIG9uXHJcbiAgICAgICAgdGhpcy5mcmFtZS5yZW5kZXIodGFyZ2V0LCB1cHNjYWxlU2l6ZSk7XHJcblxyXG4gICAgICAgIFVpQXNzZXRzLnRpdGxlX2ltYWdlLnJlbmRlcih0YXJnZXQsIE1hdGgucm91bmQodGhpcy5mcmFtZS54L3Vwc2NhbGVTaXplKzEpKnVwc2NhbGVTaXplLCBNYXRoLnJvdW5kKHRoaXMuZnJhbWUueS91cHNjYWxlU2l6ZSs0KSp1cHNjYWxlU2l6ZSwgMjU2KnVwc2NhbGVTaXplLCA0MCp1cHNjYWxlU2l6ZSk7XHJcblxyXG4gICAgICAgIC8vIGxvb3AgdGhyb3VnaCB0aGUgYnV0dG9ucyBhcnJheSBhbmQgcmVuZGVyIGVhY2ggb25lLlxyXG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB0aGlzLmJ1dHRvbnMpIHtcclxuICAgICAgICAgICAgaXRlbS5yZW5kZXIodGFyZ2V0LCB1cHNjYWxlU2l6ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICB3aW5kb3dVcGRhdGUoKSB7XHJcbiAgICAgICAgLy8gc2V0IHRoZSBwb3NpdGlvbiBvZiB0aGUgZnJhbWVcclxuICAgICAgICB0aGlzLmZyYW1lLnggPSBnYW1lLndpZHRoLzItMjY0LzIqZ2FtZS51cHNjYWxlU2l6ZTsvLyBjZW50ZXIgdGhlIGZyYW1lIGluIHRoZSBtaWRkbGUgb2YgdGhlIHNjcmVlblxyXG4gICAgICAgIHRoaXMuZnJhbWUueSA9IGdhbWUuaGVpZ2h0LzItNTYqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICB0aGlzLmZyYW1lLncgPSAyNjQqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICB0aGlzLmZyYW1lLmggPSA0OCpnYW1lLnVwc2NhbGVTaXplO1xyXG5cclxuICAgICAgICAvLyBzZXQgdGhlIHBvc2l0aW9ucyBvZiBhbGwgdGhlIGJ1dHRvbnNcclxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpPDQ7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0ueCA9IGdhbWUud2lkdGgvMi0xOTIvMipnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0ueSA9IGdhbWUuaGVpZ2h0LzIrMjAqaSpnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0udyA9IDE5MipnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0uaCA9IDE2KmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS51cGRhdGVNb3VzZU92ZXIoZ2FtZS5tb3VzZVgsIGdhbWUubW91c2VZKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCBVaVNjcmVlbiBmcm9tICcuLi9VaVNjcmVlbic7XHJcbmltcG9ydCBwNSBmcm9tICdwNSc7XHJcbmltcG9ydCBVaUZyYW1lIGZyb20gJy4uL1VpRnJhbWUnO1xyXG5pbXBvcnQgZ2FtZSBmcm9tICcuLi8uLi9NYWluJztcclxuaW1wb3J0IEJ1dHRvbiBmcm9tICcuLi9CdXR0b24nO1xyXG5pbXBvcnQgRm9udFJlc291cmNlIGZyb20gJy4uLy4uL2Fzc2V0cy9yZXNvdXJjZXMvRm9udFJlc291cmNlJztcclxuaW1wb3J0IHsgTWFpbk1lbnUgfSBmcm9tICcuL01haW5NZW51JztcclxuXHJcbmV4cG9ydCBjbGFzcyBPcHRpb25zTWVudSBleHRlbmRzIFVpU2NyZWVuIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihmb250OiBGb250UmVzb3VyY2UpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIC8vIG1ha2UgdGhlIGZyYW1lIHdpdGggc29tZSBkZWZhdWx0IHZhbHVlcy4gIFRoZXNlIHdpbGwgbGF0ZXIgYmUgY2hhbmdlZCB0byBmaXQgdGhlIHNjcmVlbiBzaXplLlxyXG4gICAgICAgIHRoaXMuZnJhbWUgPSBuZXcgVWlGcmFtZSgwLCAwLCAwLCAwKTtcclxuICAgICAgICAvLyBtYWtlIHNvbWUgYnV0dG9ucyB3aXRoIGRlZmF1bHQgcG9zaXRpb25zXHJcbiAgICAgICAgdGhpcy5idXR0b25zID0gW1xyXG4gICAgICAgICAgICBuZXcgQnV0dG9uKGZvbnQsIFwiVmlkZW8gU2V0dGluZ3NcIiwgXCJDaGFuZ2UgdGhlIGJhbGFuY2UgYmV0d2VlbiBwZXJmb3JtYW5jZSBhbmQgZmlkZWxpdHkuXCIsIDAsIDAsIDAsIDAsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidmlkZW8gc2V0dGluZ3NcIik7XHJcbiAgICAgICAgICAgICAgICBnYW1lLmN1cnJlbnRVaSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIG5ldyBCdXR0b24oZm9udCwgXCJDb250cm9sc1wiLCBcIkNoYW5nZSB5b3VyIGtleWJpbmRzLlwiLCAwLCAwLCAwLCAwLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImNvbnRyb2wgbWVudVwiKTtcclxuICAgICAgICAgICAgICAgIGdhbWUuY3VycmVudFVpID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgbmV3IEJ1dHRvbihmb250LCBcIkF1ZGlvIFNldHRpbmdzXCIsIFwiQ2hhbmdlIHRoZSB2b2x1bWUgb2YgZGlmZmVyZW50IHNvdW5kcy5cIiwgMCwgMCwgMCwgMCwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJhdWRpbyBtZW51XCIpO1xyXG4gICAgICAgICAgICAgICAgZ2FtZS5jdXJyZW50VWkgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBuZXcgQnV0dG9uKGZvbnQsIFwiQmFja1wiLCBcIlJldHVybiB0byB0aGUgbWFpbiBtZW51LlwiLCAwLCAwLCAwLCAwLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm1haW4gbWVudVwiKTtcclxuICAgICAgICAgICAgICAgIGdhbWUuY3VycmVudFVpID0gbmV3IE1haW5NZW51KGZvbnQpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIF07XHJcbiAgICAgICAgLy8gdXBkYXRlIHRoZSBzaXplIG9mIHRoZSBlbGVtZW50cyBiYXNlZCBvbiB0aGUgaW5pdGlhbCBzY3JlZW4gc2l6ZVxyXG4gICAgICAgIHRoaXMud2luZG93VXBkYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKHRhcmdldDogcDUsIHVwc2NhbGVTaXplOiBudW1iZXIpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgLy8gcmVuZGVyIHRoZSByZWN0YW5ndWxhciBpbWFnZSB0aGF0IHRoZSB3aG9sZSBtZW51IGlzIG9uXHJcbiAgICAgICAgdGhpcy5mcmFtZS5yZW5kZXIodGFyZ2V0LCB1cHNjYWxlU2l6ZSk7XHJcblxyXG4gICAgICAgIC8vIGxvb3AgdGhyb3VnaCB0aGUgYnV0dG9ucyBhcnJheSBhbmQgcmVuZGVyIGVhY2ggb25lLlxyXG4gICAgICAgIHRoaXMuYnV0dG9ucy5mb3JFYWNoKGJ1dHRvbiA9PiB7XHJcbiAgICAgICAgICAgIGJ1dHRvbi5yZW5kZXIodGFyZ2V0LCB1cHNjYWxlU2l6ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgd2luZG93VXBkYXRlKCkge1xyXG4gICAgICAgIC8vIHNldCB0aGUgcG9zaXRpb24gb2YgdGhlIGZyYW1lXHJcbiAgICAgICAgdGhpcy5mcmFtZS54ID0gZ2FtZS53aWR0aC8yLTIwMC8yKmdhbWUudXBzY2FsZVNpemU7Ly8gY2VudGVyIHRoZSBmcmFtZSBpbiB0aGUgY2VudGVyIG9mIHRoZSBzY3JlZW5cclxuICAgICAgICB0aGlzLmZyYW1lLnkgPSBnYW1lLmhlaWdodC8yLTU2KmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgdGhpcy5mcmFtZS53ID0gMjAwKmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgdGhpcy5mcmFtZS5oID0gNDgqZ2FtZS51cHNjYWxlU2l6ZTtcclxuXHJcbiAgICAgICAgLy8gc2V0IHRoZSBwb3NpdGlvbnMgb2YgYWxsIHRoZSBidXR0b25zXHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaTw0OyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLnggPSBnYW1lLndpZHRoLzItMTkyLzIqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLnkgPSBnYW1lLmhlaWdodC8yKzIwKmkqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLncgPSAxOTIqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLmggPSAxNipnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0udXBkYXRlTW91c2VPdmVyKGdhbWUubW91c2VYLCBnYW1lLm1vdXNlWSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCBVaVNjcmVlbiBmcm9tICcuLi9VaVNjcmVlbic7XHJcbmltcG9ydCBwNSBmcm9tICdwNSc7XHJcbmltcG9ydCBVaUZyYW1lIGZyb20gJy4uL1VpRnJhbWUnO1xyXG5pbXBvcnQgZ2FtZSBmcm9tICcuLi8uLi9NYWluJztcclxuaW1wb3J0IEJ1dHRvbiBmcm9tICcuLi9CdXR0b24nO1xyXG5pbXBvcnQgeyBPcHRpb25zTWVudSB9IGZyb20gJy4vT3B0aW9uc01lbnUnO1xyXG5pbXBvcnQgRm9udFJlc291cmNlIGZyb20gJy4uLy4uL2Fzc2V0cy9yZXNvdXJjZXMvRm9udFJlc291cmNlJztcclxuaW1wb3J0IHsgTWFpbk1lbnUgfSBmcm9tICcuL01haW5NZW51JztcclxuXHJcbmV4cG9ydCBjbGFzcyBQYXVzZU1lbnUgZXh0ZW5kcyBVaVNjcmVlbiB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZm9udDogRm9udFJlc291cmNlKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgLy8gbWFrZSB0aGUgZnJhbWUgd2l0aCBzb21lIGRlZmF1bHQgdmFsdWVzLiAgVGhlc2Ugd2lsbCBsYXRlciBiZSBjaGFuZ2VkIHRvIGZpdCB0aGUgc2NyZWVuIHNpemUuXHJcbiAgICAgICAgdGhpcy5mcmFtZSA9IG5ldyBVaUZyYW1lKDAsIDAsIDAsIDApO1xyXG5cclxuICAgICAgICAvLyBtYWtlIDQgYnV0dG9ucyB3aXRoIGRlZmF1bHQgcG9zaXRpb25zXHJcbiAgICAgICAgdGhpcy5idXR0b25zID0gW1xyXG4gICAgICAgICAgICBuZXcgQnV0dG9uKGZvbnQsIFwiUmVzdW1lIEdhbWVcIiwgXCJHbyBiYWNrIHRvIHRoZSBnYW1lLlwiLCAwLCAwLCAwLCAwLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBnYW1lLmN1cnJlbnRVaSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIG5ldyBCdXR0b24oZm9udCwgXCJPcHRpb25zXCIsIFwiQ2hhbmdlIHlvdXIga2V5YmluZHMsIHJlZHVjZSBsYWcsIGV0Yy5cIiwgMCwgMCwgMCwgMCwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZ2FtZS5jdXJyZW50VWkgPSBuZXcgT3B0aW9uc01lbnUoZm9udCk7XHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBuZXcgQnV0dG9uKGZvbnQsIFwiTGVhdmUgR2FtZVwiLCBcIkdvIGJhY2sgdG8gTWFpbiBNZW51XCIsIDAsIDAsIDAsIDAsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGdhbWUuY3VycmVudFVpID0gbmV3IE1haW5NZW51KGZvbnQpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIF07XHJcblxyXG4gICAgICAgIC8vIHVwZGF0ZSB0aGUgc2l6ZSBvZiB0aGUgZWxlbWVudHMgYmFzZWQgb24gdGhlIGluaXRpYWwgc2NyZWVuIHNpemVcclxuICAgICAgICB0aGlzLndpbmRvd1VwZGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICByZW5kZXIodGFyZ2V0OiBwNSwgdXBzY2FsZVNpemU6IG51bWJlcik6IHZvaWQge1xyXG5cclxuICAgICAgICAvLyByZW5kZXIgdGhlIHJlY3Rhbmd1bGFyIGltYWdlIHRoYXQgdGhlIHdob2xlIG1lbnUgaXMgb25cclxuICAgICAgICB0aGlzLmZyYW1lLnJlbmRlcih0YXJnZXQsIHVwc2NhbGVTaXplKTtcclxuXHJcbiAgICAgICAgLy8gbG9vcCB0aHJvdWdoIHRoZSBidXR0b25zIGFycmF5IGFuZCByZW5kZXIgZWFjaCBvbmUuXHJcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIHRoaXMuYnV0dG9ucykge1xyXG4gICAgICAgICAgICBpdGVtLnJlbmRlcih0YXJnZXQsIHVwc2NhbGVTaXplKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHdpbmRvd1VwZGF0ZSgpIHtcclxuICAgICAgICAvLyBzZXQgdGhlIHBvc2l0aW9uIG9mIHRoZSBmcmFtZVxyXG4gICAgICAgIHRoaXMuZnJhbWUueCA9IGdhbWUud2lkdGgvMi0yNTYvMipnYW1lLnVwc2NhbGVTaXplOy8vIGNlbnRlciB0aGUgZnJhbWUgaW4gdGhlIG1pZGRsZSBvZiB0aGUgc2NyZWVuXHJcbiAgICAgICAgdGhpcy5mcmFtZS55ID0gZ2FtZS5oZWlnaHQvMi03MipnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgIHRoaXMuZnJhbWUudyA9IDI1NipnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgIHRoaXMuZnJhbWUuaCA9IDY0KmdhbWUudXBzY2FsZVNpemU7XHJcblxyXG4gICAgICAgIC8vIHNldCB0aGUgcG9zaXRpb25zIG9mIGFsbCB0aGUgYnV0dG9uc1xyXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGk8MzsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS54ID0gZ2FtZS53aWR0aC8yLTE5Mi8yKmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS55ID0gZ2FtZS5oZWlnaHQvMisyMCppKmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS53ID0gMTkyKmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS5oID0gMTYqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLnVwZGF0ZU1vdXNlT3ZlcihnYW1lLm1vdXNlWCwgZ2FtZS5tb3VzZVkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IFVpU2NyZWVuIGZyb20gJy4uL1VpU2NyZWVuJztcclxuaW1wb3J0IHA1IGZyb20gJ3A1JztcclxuaW1wb3J0IFVpRnJhbWUgZnJvbSAnLi4vVWlGcmFtZSc7XHJcbmltcG9ydCBnYW1lIGZyb20gJy4uLy4uL01haW4nO1xyXG5pbXBvcnQgQnV0dG9uIGZyb20gJy4uL0J1dHRvbic7XHJcbmltcG9ydCBGb250UmVzb3VyY2UgZnJvbSAnLi4vLi4vYXNzZXRzL3Jlc291cmNlcy9Gb250UmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBNYWluTWVudSB9IGZyb20gJy4vTWFpbk1lbnUnO1xyXG5pbXBvcnQgeyBXb3JsZE9wdGlvbnNNZW51IH0gZnJvbSAnLi9Xb3JsZE9wdGlvbnNNZW51JztcclxuXHJcbmV4cG9ydCBjbGFzcyBXb3JsZENyZWF0aW9uTWVudSBleHRlbmRzIFVpU2NyZWVuIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihmb250OiBGb250UmVzb3VyY2UpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIC8vIG1ha2UgdGhlIGZyYW1lIHdpdGggc29tZSBkZWZhdWx0IHZhbHVlcy4gIFRoZXNlIHdpbGwgbGF0ZXIgYmUgY2hhbmdlZCB0byBmaXQgdGhlIHNjcmVlbiBzaXplLlxyXG4gICAgICAgIHRoaXMuZnJhbWUgPSBuZXcgVWlGcmFtZSgwLCAwLCAwLCAwKTtcclxuICAgICAgICAvLyBtYWtlIHNvbWUgYnV0dG9ucyB3aXRoIGRlZmF1bHQgcG9zaXRpb25zXHJcbiAgICAgICAgaWYgKGdhbWUuc2VydmVyVmlzaWJpbGl0eSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICBnYW1lLnNlcnZlclZpc2liaWxpdHkgPSBcIlB1YmxpY1wiO1xyXG5cclxuICAgICAgICB0aGlzLmJ1dHRvbnMgPSBbXHJcbiAgICAgICAgICAgIG5ldyBCdXR0b24oZm9udCwgYFNlcnZlciBWaXNpYmlsaXR5OiAke2dhbWUuc2VydmVyVmlzaWJpbGl0eX1gLCBcIkNoYW5nZSB0aGUgdmlzaWJpbGl0eSBvZiB0aGUgc2VydmVyXCIsIDAsIDAsIDAsIDAsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmJ1dHRvbnNbMF0udHh0ID09PSBcIlNlcnZlciBWaXNpYmlsaXR5OiBQdWJsaWNcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIGdhbWUuc2VydmVyVmlzaWJpbGl0eSA9IFwiVW5saXN0ZWRcIjtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1dHRvbnNbMF0udHh0ID0gXCJTZXJ2ZXIgVmlzaWJpbGl0eTogVW5saXN0ZWRcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuYnV0dG9uc1swXS50eHQgPT09IFwiU2VydmVyIFZpc2liaWxpdHk6IFVubGlzdGVkXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBnYW1lLnNlcnZlclZpc2liaWxpdHkgPSBcIlByaXZhdGVcIjtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1dHRvbnNbMF0udHh0ID0gXCJTZXJ2ZXIgVmlzaWJpbGl0eTogUHJpdmF0ZVwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS5zZXJ2ZXJWaXNpYmlsaXR5ID0gXCJQdWJsaWNcIjtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1dHRvbnNbMF0udHh0ID0gXCJTZXJ2ZXIgVmlzaWJpbGl0eTogUHVibGljXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBuZXcgQnV0dG9uKGZvbnQsIFwiV29ybGQgT3B0aW9uc1wiLCBcIkNoYW5nZSBob3cgeW91ciB3b3JsZCBsb29rcyBhbmQgZ2VuZXJhdGVzLlwiLCAwLCAwLCAwLCAwLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIndvcmxkIG1lbnVcIik7XHJcbiAgICAgICAgICAgICAgICBnYW1lLmN1cnJlbnRVaSA9IG5ldyBXb3JsZE9wdGlvbnNNZW51KGZvbnQpO1xyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgbmV3IEJ1dHRvbihmb250LCBcIkJhY2tcIiwgXCJSZXR1cm4gdG8gdGhlIG1haW4gbWVudS5cIiwgMCwgMCwgMCwgMCwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJtYWluIG1lbnVcIik7XHJcbiAgICAgICAgICAgICAgICBnYW1lLmN1cnJlbnRVaSA9IG5ldyBNYWluTWVudShmb250KTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICBdO1xyXG4gICAgICAgIC8vIHVwZGF0ZSB0aGUgc2l6ZSBvZiB0aGUgZWxlbWVudHMgYmFzZWQgb24gdGhlIGluaXRpYWwgc2NyZWVuIHNpemVcclxuICAgICAgICB0aGlzLndpbmRvd1VwZGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcih0YXJnZXQ6IHA1LCB1cHNjYWxlU2l6ZTogbnVtYmVyKTogdm9pZCB7XHJcblxyXG4gICAgICAgIC8vIHJlbmRlciB0aGUgcmVjdGFuZ3VsYXIgaW1hZ2UgdGhhdCB0aGUgd2hvbGUgbWVudSBpcyBvblxyXG4gICAgICAgIHRoaXMuZnJhbWUucmVuZGVyKHRhcmdldCwgdXBzY2FsZVNpemUpO1xyXG5cclxuICAgICAgICAvLyBsb29wIHRocm91Z2ggdGhlIGJ1dHRvbnMgYXJyYXkgYW5kIHJlbmRlciBlYWNoIG9uZS5cclxuICAgICAgICB0aGlzLmJ1dHRvbnMuZm9yRWFjaChidXR0b24gPT4ge1xyXG4gICAgICAgICAgICBidXR0b24ucmVuZGVyKHRhcmdldCwgdXBzY2FsZVNpemUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHdpbmRvd1VwZGF0ZSgpIHtcclxuICAgICAgICAvLyBzZXQgdGhlIHBvc2l0aW9uIG9mIHRoZSBmcmFtZVxyXG4gICAgICAgIHRoaXMuZnJhbWUueCA9IGdhbWUud2lkdGggLyAyIC0gMjAwIC8gMiAqIGdhbWUudXBzY2FsZVNpemU7Ly8gY2VudGVyIHRoZSBmcmFtZSBpbiB0aGUgY2VudGVyIG9mIHRoZSBzY3JlZW5cclxuICAgICAgICB0aGlzLmZyYW1lLnkgPSBnYW1lLmhlaWdodCAvIDIgLSA1NiAqIGdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgdGhpcy5mcmFtZS53ID0gMjAwICogZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICB0aGlzLmZyYW1lLmggPSA0OCAqIGdhbWUudXBzY2FsZVNpemU7XHJcblxyXG4gICAgICAgIC8vIHNldCB0aGUgcG9zaXRpb25zIG9mIGFsbCB0aGUgYnV0dG9uc1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS54ID0gZ2FtZS53aWR0aCAvIDIgLSAxOTIgLyAyICogZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLnkgPSBnYW1lLmhlaWdodCAvIDIgKyAyMCAqIGkgKiBnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0udyA9IDE5MiAqIGdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS5oID0gMTYgKiBnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0udXBkYXRlTW91c2VPdmVyKGdhbWUubW91c2VYLCBnYW1lLm1vdXNlWSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCBVaVNjcmVlbiBmcm9tICcuLi9VaVNjcmVlbic7XHJcbmltcG9ydCBwNSBmcm9tICdwNSc7XHJcbmltcG9ydCBVaUZyYW1lIGZyb20gJy4uL1VpRnJhbWUnO1xyXG5pbXBvcnQgZ2FtZSBmcm9tICcuLi8uLi9NYWluJztcclxuaW1wb3J0IEJ1dHRvbiBmcm9tICcuLi9CdXR0b24nO1xyXG5pbXBvcnQgRm9udFJlc291cmNlIGZyb20gJy4uLy4uL2Fzc2V0cy9yZXNvdXJjZXMvRm9udFJlc291cmNlJztcclxuaW1wb3J0IHsgV29ybGRDcmVhdGlvbk1lbnUgfSBmcm9tICcuL1dvcmxkQ3JlYXRpb25NZW51JztcclxuaW1wb3J0IFNsaWRlciBmcm9tICcuLi9TbGlkZXInO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdvcmxkT3B0aW9uc01lbnUgZXh0ZW5kcyBVaVNjcmVlbiB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZm9udDogRm9udFJlc291cmNlKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICAvLyBtYWtlIHRoZSBmcmFtZSB3aXRoIHNvbWUgZGVmYXVsdCB2YWx1ZXMuICBUaGVzZSB3aWxsIGxhdGVyIGJlIGNoYW5nZWQgdG8gZml0IHRoZSBzY3JlZW4gc2l6ZS5cclxuICAgICAgICB0aGlzLmZyYW1lID0gbmV3IFVpRnJhbWUoMCwgMCwgMCwgMCk7XHJcbiAgICAgICAgLy8gbWFrZSBzb21lIGJ1dHRvbnMgd2l0aCBkZWZhdWx0IHBvc2l0aW9uc1xyXG4gICAgICAgIGlmKGdhbWUud29ybGRCdW1waW5lc3MgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgZ2FtZS53b3JsZEJ1bXBpbmVzcyA9IDE7XHJcblxyXG5cclxuICAgICAgICBsZXQgdGVtcFdvcmxkQnVtcGluZXNzVGV4dDtcclxuXHJcbiAgICAgICAgaWYoZ2FtZS53b3JsZEJ1bXBpbmVzcz09PTEpIHtcclxuICAgICAgICAgICAgdGVtcFdvcmxkQnVtcGluZXNzVGV4dCA9IFwiTm9ybWFsXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYoZ2FtZS53b3JsZEJ1bXBpbmVzcz09PTApIHtcclxuICAgICAgICAgICAgdGVtcFdvcmxkQnVtcGluZXNzVGV4dCA9IFwiU3VwZXJmbGF0XCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0ZW1wV29ybGRCdW1waW5lc3NUZXh0ID0gXCJBbXBsaWZpZWRcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5idXR0b25zID0gW1xyXG4gICAgICAgICAgICBuZXcgQnV0dG9uKGZvbnQsIGBXb3JsZCBCdW1waW5lc3M6ICR7dGVtcFdvcmxkQnVtcGluZXNzVGV4dH1gLCBcIkNoYW5nZSB0aGUgaW50ZW5zaXR5IG9mIHRoZSB3b3JsZCdzIGJ1bXBzLlwiLCAwLCAwLCAwLCAwLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLmJ1dHRvbnNbMF0udHh0ID09PSBcIldvcmxkIEJ1bXBpbmVzczogTm9ybWFsXCIpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnV0dG9uc1swXS50eHQgPSBcIldvcmxkIEJ1bXBpbmVzczogQW1wbGlmaWVkXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS53b3JsZEJ1bXBpbmVzcyA9IDM7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmKHRoaXMuYnV0dG9uc1swXS50eHQgPT09IFwiV29ybGQgQnVtcGluZXNzOiBBbXBsaWZpZWRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnV0dG9uc1swXS50eHQgPSBcIldvcmxkIEJ1bXBpbmVzczogU3VwZXJmbGF0XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS53b3JsZEJ1bXBpbmVzcyA9IDA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1dHRvbnNbMF0udHh0ID0gXCJXb3JsZCBCdW1waW5lc3M6IE5vcm1hbFwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGdhbWUud29ybGRCdW1waW5lc3MgPSAxO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgbmV3IEJ1dHRvbihmb250LCBcIkJhY2tcIiwgXCJSZXR1cm4gdG8gdGhlIG1haW4gbWVudS5cIiwgMCwgMCwgMCwgMCwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJtYWluIG1lbnVcIik7XHJcbiAgICAgICAgICAgICAgICBnYW1lLmN1cnJlbnRVaSA9IG5ldyBXb3JsZENyZWF0aW9uTWVudShmb250KTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICBdO1xyXG4gICAgICAgIHRoaXMuc2xpZGVycyA9IFtcclxuICAgICAgICAgICAgbmV3IFNsaWRlcihmb250LCBcIldpZHRoXCIsIDUxMiwgNjQsIDIwNDgsIDY0LCAwLCAwLCAwLCAwLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBnYW1lLndvcmxkV2lkdGggPSB0aGlzLnNsaWRlcnNbMF0udmFsdWU7XHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBuZXcgU2xpZGVyKGZvbnQsIFwiSGVpZ2h0XCIsIDY0LCA2NCwgNTEyLCAxNiwgMCwgMCwgMCwgMCwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZ2FtZS53b3JsZEhlaWdodCA9IHRoaXMuc2xpZGVyc1sxXS52YWx1ZTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICBdO1xyXG4gICAgICAgIC8vIHVwZGF0ZSB0aGUgc2l6ZSBvZiB0aGUgZWxlbWVudHMgYmFzZWQgb24gdGhlIGluaXRpYWwgc2NyZWVuIHNpemVcclxuICAgICAgICB0aGlzLndpbmRvd1VwZGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcih0YXJnZXQ6IHA1LCB1cHNjYWxlU2l6ZTogbnVtYmVyKTogdm9pZCB7XHJcblxyXG4gICAgICAgIC8vIHJlbmRlciB0aGUgcmVjdGFuZ3VsYXIgaW1hZ2UgdGhhdCB0aGUgd2hvbGUgbWVudSBpcyBvblxyXG4gICAgICAgIHRoaXMuZnJhbWUucmVuZGVyKHRhcmdldCwgdXBzY2FsZVNpemUpO1xyXG5cclxuICAgICAgICAvLyBsb29wIHRocm91Z2ggdGhlIGJ1dHRvbnMgYXJyYXkgYW5kIHJlbmRlciBlYWNoIG9uZS5cclxuICAgICAgICB0aGlzLmJ1dHRvbnMuZm9yRWFjaChidXR0b24gPT4ge1xyXG4gICAgICAgICAgICBidXR0b24ucmVuZGVyKHRhcmdldCwgdXBzY2FsZVNpemUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBsb29wIHRocm91Z2ggdGhlIHNsaWRlcnMgYXJyYXkgYW5kIHJlbmRlciBlYWNoIG9uZS5cclxuICAgICAgICB0aGlzLnNsaWRlcnMuZm9yRWFjaChzbGlkZXIgPT4ge1xyXG4gICAgICAgICAgICBzbGlkZXIucmVuZGVyKHRhcmdldCwgdXBzY2FsZVNpemUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHdpbmRvd1VwZGF0ZSgpIHtcclxuICAgICAgICAvLyBzZXQgdGhlIHBvc2l0aW9uIG9mIHRoZSBmcmFtZVxyXG4gICAgICAgIHRoaXMuZnJhbWUueCA9IGdhbWUud2lkdGgvMi0yMDAvMipnYW1lLnVwc2NhbGVTaXplOy8vIGNlbnRlciB0aGUgZnJhbWUgaW4gdGhlIGNlbnRlciBvZiB0aGUgc2NyZWVuXHJcbiAgICAgICAgdGhpcy5mcmFtZS55ID0gZ2FtZS5oZWlnaHQvMi01NipnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgIHRoaXMuZnJhbWUudyA9IDIwMCpnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgIHRoaXMuZnJhbWUuaCA9IDQ4KmdhbWUudXBzY2FsZVNpemU7XHJcblxyXG4gICAgICAgIC8vIHNldCB0aGUgcG9zaXRpb25zIG9mIGFsbCB0aGUgYnV0dG9uc1xyXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGk8MjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS54ID0gZ2FtZS53aWR0aC8yLTE5Mi8yKmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS55ID0gZ2FtZS5oZWlnaHQvMis2MCppKmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS53ID0gMTkyKmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS5oID0gMTYqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLnVwZGF0ZU1vdXNlT3ZlcihnYW1lLm1vdXNlWCwgZ2FtZS5tb3VzZVkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gc2V0IHRoZSBwb3NpdGlvbnMgb2YgYWxsIHRoZSBzbGlkZXJzXHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaTwyOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5zbGlkZXJzW2ldLnggPSBnYW1lLndpZHRoLzItMTkyLzIqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5zbGlkZXJzW2ldLnkgPSBnYW1lLmhlaWdodC8yKzIwKmdhbWUudXBzY2FsZVNpemUrMjAqaSpnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLnNsaWRlcnNbaV0udyA9IDE5MipnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLnNsaWRlcnNbaV0uaCA9IDE2KmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIGlmKGdhbWUubW91c2VJc1ByZXNzZWQpXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNsaWRlcnNbaV0udXBkYXRlU2xpZGVyUG9zaXRpb24oZ2FtZS5tb3VzZVgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgR2FtZSBmcm9tICcuLi9HYW1lJztcclxuaW1wb3J0IFdvcmxkIGZyb20gJy4uL3dvcmxkL1dvcmxkJztcclxuaW1wb3J0IHsgRW50aXR5Q2xhc3NlcyB9IGZyb20gJy4uL3dvcmxkL2VudGl0aWVzL0VudGl0eUNsYXNzZXMnO1xyXG5pbXBvcnQgUGxheWVyTG9jYWwgZnJvbSAnLi4vd29ybGQvZW50aXRpZXMvUGxheWVyTG9jYWwnO1xyXG5cclxuZXhwb3J0IGNsYXNzIE5ldE1hbmFnZXIge1xyXG5cclxuICAgIGdhbWU6IEdhbWVcclxuXHJcbiAgICBwbGF5ZXJUaWNrUmF0ZTogbnVtYmVyXHJcblxyXG4gICAgY29uc3RydWN0b3IoZ2FtZTogR2FtZSkge1xyXG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWVcclxuXHJcbiAgICAgICAgLy8gSW5pdCBldmVudFxyXG4gICAgICAgIHRoaXMuZ2FtZS5jb25uZWN0aW9uLm9uKCdpbml0JywgKCBwbGF5ZXJUaWNrUmF0ZSwgdG9rZW4gKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBUaWNrIHJhdGUgc2V0IHRvOiAke3BsYXllclRpY2tSYXRlfWApO1xyXG4gICAgICAgICAgICB0aGlzLnBsYXllclRpY2tSYXRlID0gcGxheWVyVGlja1JhdGU7XHJcbiAgICAgICAgICAgIGlmICh0b2tlbikge1xyXG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKCd0b2tlbicsIHRva2VuKTtcclxuICAgICAgICAgICAgICAgICh0aGlzLmdhbWUuY29ubmVjdGlvbi5hdXRoIGFzIHsgdG9rZW46IHN0cmluZyB9KS50b2tlbiA9IHRva2VuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIEluaXRpYWxpemF0aW9uIGV2ZW50c1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy8gTG9hZCB0aGUgd29ybGQgYW5kIHNldCB0aGUgcGxheWVyIGVudGl0eSBpZFxyXG4gICAgICAgICAgICB0aGlzLmdhbWUuY29ubmVjdGlvbi5vbihcclxuICAgICAgICAgICAgICAgICd3b3JsZExvYWQnLCh3aWR0aCwgaGVpZ2h0LCB0aWxlcywgdGlsZUVudGl0aWVzLCBlbnRpdGllcywgcGxheWVyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZW50aXRpZXMpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nYW1lLndvcmxkID0gbmV3IFdvcmxkKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aWxlcyxcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS53b3JsZC5wbGF5ZXIgPSBuZXcgUGxheWVyTG9jYWwocGxheWVyKVxyXG4gICAgICAgICAgICAgICAgICAgIGVudGl0aWVzLmZvckVhY2goKGVudGl0eSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWUud29ybGQuZW50aXRpZXNbZW50aXR5LmlkXSA9IG5ldyBFbnRpdHlDbGFzc2VzW2VudGl0eS50eXBlXShlbnRpdHkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBXb3JsZCBldmVudHNcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vIFRpbGUgdXBkYXRlcyBzdWNoIGFzIGJyZWFraW5nIGFuZCBwbGFjaW5nXHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5jb25uZWN0aW9uLm9uKFxyXG4gICAgICAgICAgICAgICAgJ3dvcmxkVXBkYXRlJyxcclxuICAgICAgICAgICAgICAgICh1cGRhdGVkVGlsZXM6IHsgdGlsZUluZGV4OiBudW1iZXI7IHRpbGU6IG51bWJlciB9W10pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGUgd29ybGQgaXMgbm90IHNldFxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmdhbWUud29ybGQgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB1cGRhdGVkVGlsZXMuZm9yRWFjaCgodGlsZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWUud29ybGQudXBkYXRlVGlsZSh0aWxlLnRpbGVJbmRleCwgdGlsZS50aWxlKVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gUGxheWVyIGV2ZW50c1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy8gVXBkYXRlIHRoZSBwbGF5ZXJcclxuICAgICAgICAgICAgdGhpcy5nYW1lLmNvbm5lY3Rpb24ub24oJ3NldFBsYXllcicsICh4LCB5LCB5VmVsLCB4VmVsKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyBJZiB0aGUgd29ybGQgaXMgbm90IHNldFxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2FtZS53b3JsZCA9PT0gdW5kZWZpbmVkKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLndvcmxkLnBsYXllci54ID0geDtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS53b3JsZC5wbGF5ZXIueSA9IHk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUud29ybGQucGxheWVyLnlWZWwgPSB5VmVsO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLndvcmxkLnBsYXllci54VmVsID0geFZlbDtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmdhbWUuY29ubmVjdGlvbi5vbignZW50aXR5VXBkYXRlJywgKGVudGl0eURhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIElmIHRoZSB3b3JsZCBpcyBub3Qgc2V0XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nYW1lLndvcmxkID09PSB1bmRlZmluZWQpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBlbnRpdHkgPSB0aGlzLmdhbWUud29ybGQuZW50aXRpZXNbZW50aXR5RGF0YS5pZF1cclxuICAgICAgICAgICAgICAgIGlmIChlbnRpdHkgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgIGVudGl0eS51cGRhdGVEYXRhKGVudGl0eURhdGEpXHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICB0aGlzLmdhbWUuY29ubmVjdGlvbi5vbignZW50aXR5Q3JlYXRlJywgKGVudGl0eURhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIElmIHRoZSB3b3JsZCBpcyBub3Qgc2V0XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nYW1lLndvcmxkID09PSB1bmRlZmluZWQpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUud29ybGQuZW50aXRpZXNbZW50aXR5RGF0YS5pZF0gPSBuZXcgRW50aXR5Q2xhc3Nlc1tlbnRpdHlEYXRhLnR5cGVdKGVudGl0eURhdGEpO1xyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgdGhpcy5nYW1lLmNvbm5lY3Rpb24ub24oJ2VudGl0eURlbGV0ZScsIChpZCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlIHdvcmxkIGlzIG5vdCBzZXRcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdhbWUud29ybGQgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmdhbWUud29ybGQuZW50aXRpZXNbaWRdXHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICAvLyBVcGRhdGUgdGhlIG90aGVyIHBsYXllcnMgaW4gdGhlIHdvcmxkXHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5jb25uZWN0aW9uLm9uKFxyXG4gICAgICAgICAgICAgICAgJ2VudGl0eVNuYXBzaG90JyxcclxuICAgICAgICAgICAgICAgIChzbmFwc2hvdDoge1xyXG4gICAgICAgICAgICAgICAgICAgIGlkOiBzdHJpbmc7XHJcbiAgICAgICAgICAgICAgICAgICAgdGltZTogbnVtYmVyO1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlOiB7IGlkOiBzdHJpbmc7IHg6IHN0cmluZzsgeTogc3RyaW5nIH1bXTtcclxuICAgICAgICAgICAgICAgIH0pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGUgd29ybGQgaXMgbm90IHNldFxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmdhbWUud29ybGQgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWUud29ybGQudXBkYXRlUGxheWVycyhzbmFwc2hvdClcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IGdhbWUgZnJvbSAnLi4vTWFpbic7XHJcbmltcG9ydCBQNSBmcm9tICdwNSc7XHJcbmltcG9ydCBwNSBmcm9tICdwNSc7XHJcbmltcG9ydCBJbWFnZVJlc291cmNlIGZyb20gJy4uL2Fzc2V0cy9yZXNvdXJjZXMvSW1hZ2VSZXNvdXJjZSc7XHJcbmltcG9ydCBUaWxlUmVzb3VyY2UgZnJvbSAnLi4vYXNzZXRzL3Jlc291cmNlcy9UaWxlUmVzb3VyY2UnO1xyXG5pbXBvcnQgVGlja2FibGUgZnJvbSAnLi4vaW50ZXJmYWNlcy9UaWNrYWJsZSc7XHJcbmltcG9ydCBSZW5kZXJhYmxlIGZyb20gJy4uL2ludGVyZmFjZXMvUmVuZGVyYWJsZSc7XHJcbmltcG9ydCBHYW1lIGZyb20gJy4uL0dhbWUnO1xyXG5pbXBvcnQgUGxheWVyTG9jYWwgZnJvbSAnLi9lbnRpdGllcy9QbGF5ZXJMb2NhbCc7XHJcbmltcG9ydCB7IFNlcnZlckVudGl0eSB9IGZyb20gJy4vZW50aXRpZXMvU2VydmVyRW50aXR5JztcclxuaW1wb3J0IHsgU25hcHNob3RJbnRlcnBvbGF0aW9uIH0gZnJvbSAnQGdlY2tvcy5pby9zbmFwc2hvdC1pbnRlcnBvbGF0aW9uJztcclxuaW1wb3J0IHsgRW50aXR5LCBTbmFwc2hvdCB9IGZyb20gJ0BnZWNrb3MuaW8vc25hcHNob3QtaW50ZXJwb2xhdGlvbi9saWIvdHlwZXMnO1xyXG5pbXBvcnQgeyBUaWxlLCBXb3JsZFRpbGVzIH0gZnJvbSAnLi9Xb3JsZFRpbGVzJztcclxuaW1wb3J0IHsgVGlsZVR5cGUgfSBmcm9tICcuLi8uLi8uLi9hcGkvVGlsZSc7XHJcblxyXG5jbGFzcyBXb3JsZCBpbXBsZW1lbnRzIFRpY2thYmxlLCBSZW5kZXJhYmxlIHtcclxuICAgIHdpZHRoOiBudW1iZXI7IC8vIHdpZHRoIG9mIHRoZSB3b3JsZCBpbiB0aWxlc1xyXG4gICAgaGVpZ2h0OiBudW1iZXI7IC8vIGhlaWdodCBvZiB0aGUgd29ybGQgaW4gdGlsZXNcclxuXHJcbiAgICB0aWxlTGF5ZXI6IFA1LkdyYXBoaWNzOyAvLyBUaWxlIGxheWVyIGdyYXBoaWNcclxuICAgIGJhY2tUaWxlTGF5ZXI6IFA1LkdyYXBoaWNzOyAvLyBCYWNrZ3JvdW5kIHRpbGVzIGxheWVyIGdyYXBoaWNcclxuXHJcbiAgICBiYWNrVGlsZUxheWVyT2Zmc2V0V2lkdGg6IG51bWJlcjsgLy8gd2hhdCBpcyB0aGlzIGV4YWN0bHkgeGF2aWVyLi4uXHJcbiAgICBiYWNrVGlsZUxheWVyT2Zmc2V0SGVpZ2h0OiBudW1iZXI7IC8vIHdoYXQgaXMgdGhpcyBleGFjdGx5IHhhdmllci4uLlxyXG5cclxuICAgIHdvcmxkVGlsZXM6IChUaWxlVHlwZSB8IHN0cmluZylbXTsgLy8gbnVtYmVyIGZvciBlYWNoIHRpbGVzIGluIHRoZSB3b3JsZCBleDogWzEsIDEsIDAsIDEsIDIsIDAsIDAsIDEuLi4gIF0gbWVhbnMgc25vdywgc25vdywgYWlyLCBzbm93LCBpY2UsIGFpciwgYWlyLCBzbm93Li4uXHJcblxyXG4gICAgcGxheWVyOiBQbGF5ZXJMb2NhbDtcclxuXHJcbiAgICBlbnRpdGllczogeyBbaWQ6IHN0cmluZ106IFNlcnZlckVudGl0eSB9ID0ge307XHJcblxyXG4gICAgc25hcHNob3RJbnRlcnBvbGF0aW9uOiBTbmFwc2hvdEludGVycG9sYXRpb247XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgd2lkdGg6IG51bWJlcixcclxuICAgICAgICBoZWlnaHQ6IG51bWJlcixcclxuICAgICAgICB0aWxlczogKFRpbGVUeXBlIHwgc3RyaW5nKVtdXHJcbiAgICApIHtcclxuICAgICAgICAvLyBJbml0aWFsaXplIHRoZSB3b3JsZCB3aXRoIHRoZSB0aWxlcyBhbmQgZGltZW5zaW9ucyBmcm9tIHRoZSBzZXJ2ZXJcclxuICAgICAgICB0aGlzLndpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICAgICAgdGhpcy53b3JsZFRpbGVzID0gdGlsZXM7XHJcblxyXG4gICAgICAgIHRoaXMuc25hcHNob3RJbnRlcnBvbGF0aW9uID0gbmV3IFNuYXBzaG90SW50ZXJwb2xhdGlvbigpO1xyXG4gICAgICAgIHRoaXMuc25hcHNob3RJbnRlcnBvbGF0aW9uLmludGVycG9sYXRpb25CdWZmZXIuc2V0KFxyXG4gICAgICAgICAgICAoMTAwMCAvIGdhbWUubmV0TWFuYWdlci5wbGF5ZXJUaWNrUmF0ZSkgKiAyXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgLy8gZGVmaW5lIHRoZSBwNS5HcmFwaGljcyBvYmplY3RzIHRoYXQgaG9sZCBhbiBpbWFnZSBvZiB0aGUgdGlsZXMgb2YgdGhlIHdvcmxkLiAgVGhlc2UgYWN0IHNvcnQgb2YgbGlrZSBhIHZpcnR1YWwgY2FudmFzIGFuZCBjYW4gYmUgZHJhd24gb24ganVzdCBsaWtlIGEgbm9ybWFsIGNhbnZhcyBieSB1c2luZyB0aWxlTGF5ZXIucmVjdCgpOywgdGlsZUxheWVyLmVsbGlwc2UoKTssIHRpbGVMYXllci5maWxsKCk7LCBldGMuXHJcbiAgICAgICAgdGhpcy50aWxlTGF5ZXIgPSBnYW1lLmNyZWF0ZUdyYXBoaWNzKFxyXG4gICAgICAgICAgICB0aGlzLndpZHRoICogZ2FtZS5USUxFX1dJRFRILFxyXG4gICAgICAgICAgICB0aGlzLmhlaWdodCAqIGdhbWUuVElMRV9IRUlHSFRcclxuICAgICAgICApO1xyXG4gICAgICAgIHRoaXMuYmFja1RpbGVMYXllciA9IGdhbWUuY3JlYXRlR3JhcGhpY3MoXHJcbiAgICAgICAgICAgIHRoaXMud2lkdGggKiBnYW1lLlRJTEVfV0lEVEgsXHJcbiAgICAgICAgICAgIHRoaXMuaGVpZ2h0ICogZ2FtZS5USUxFX0hFSUdIVFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIC8vIGNhbGN1bGF0ZSB0aGVzZSB2YXJpYWJsZXM6XHJcbiAgICAgICAgdGhpcy5iYWNrVGlsZUxheWVyT2Zmc2V0V2lkdGggPVxyXG4gICAgICAgICAgICAoZ2FtZS5USUxFX1dJRFRIIC0gZ2FtZS5CQUNLX1RJTEVfV0lEVEgpIC8gMjsgLy8gY2FsY3VsYXRlZCBpbiB0aGUgc2V0dXAgZnVuY3Rpb24sIHRoaXMgdmFyaWFibGUgaXMgdGhlIG51bWJlciBvZiBwaXhlbHMgbGVmdCBvZiBhIHRpbGVzIHRvIGRyYXcgYSBiYWNrZ3JvdW5kIHRpbGVzIGZyb20gYXQgdGhlIHNhbWUgcG9zaXRpb25cclxuICAgICAgICB0aGlzLmJhY2tUaWxlTGF5ZXJPZmZzZXRIZWlnaHQgPVxyXG4gICAgICAgICAgICAoZ2FtZS5USUxFX0hFSUdIVCAtIGdhbWUuQkFDS19USUxFX0hFSUdIVCkgLyAyOyAvLyBjYWxjdWxhdGVkIGluIHRoZSBzZXR1cCBmdW5jdGlvbiwgdGhpcyB2YXJpYWJsZSBpcyB0aGUgbnVtYmVyIG9mIHBpeGVscyBhYm92ZSBhIHRpbGVzIHRvIGRyYXcgYSBiYWNrZ3JvdW5kIHRpbGVzIGZyb20gYXQgdGhlIHNhbWUgcG9zaXRpb25cclxuXHJcbiAgICAgICAgdGhpcy5sb2FkV29ybGQoKTtcclxuICAgIH1cclxuXHJcbiAgICB0aWNrKGdhbWU6IEdhbWUpIHtcclxuICAgICAgICBpZiAodGhpcy5wbGF5ZXIgIT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgZ2FtZS5jb25uZWN0aW9uLmVtaXQoJ3BsYXllclVwZGF0ZScsIHRoaXMucGxheWVyLngsIHRoaXMucGxheWVyLnkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcih0YXJnZXQ6IHA1LCB1cHNjYWxlU2l6ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgLy8gZHJhdyB0aGUgYmFja2dyb3VuZCB0aWxlcyBsYXllciBvbnRvIHRoZSBzY3JlZW5cclxuICAgICAgICB0YXJnZXQuaW1hZ2UoXHJcbiAgICAgICAgICAgIHRoaXMuYmFja1RpbGVMYXllcixcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgZ2FtZS53aWR0aCxcclxuICAgICAgICAgICAgZ2FtZS5oZWlnaHQsXHJcbiAgICAgICAgICAgIGdhbWUuaW50ZXJwb2xhdGVkQ2FtWCAqIGdhbWUuVElMRV9XSURUSCxcclxuICAgICAgICAgICAgZ2FtZS5pbnRlcnBvbGF0ZWRDYW1ZICogZ2FtZS5USUxFX1dJRFRILFxyXG4gICAgICAgICAgICBnYW1lLndpZHRoIC8gdXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIGdhbWUuaGVpZ2h0IC8gdXBzY2FsZVNpemVcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICAvLyBkcmF3IHRoZSB0aWxlcyBsYXllciBvbnRvIHRoZSBzY3JlZW5cclxuICAgICAgICB0YXJnZXQuaW1hZ2UoXHJcbiAgICAgICAgICAgIHRoaXMudGlsZUxheWVyLFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICBnYW1lLndpZHRoLFxyXG4gICAgICAgICAgICBnYW1lLmhlaWdodCxcclxuICAgICAgICAgICAgZ2FtZS5pbnRlcnBvbGF0ZWRDYW1YICogZ2FtZS5USUxFX1dJRFRILFxyXG4gICAgICAgICAgICBnYW1lLmludGVycG9sYXRlZENhbVkgKiBnYW1lLlRJTEVfV0lEVEgsXHJcbiAgICAgICAgICAgIGdhbWUud2lkdGggLyB1cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgZ2FtZS5oZWlnaHQgLyB1cHNjYWxlU2l6ZVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHRoaXMucmVuZGVyUGxheWVycyh0YXJnZXQsIHVwc2NhbGVTaXplKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVQbGF5ZXJzKHNuYXBzaG90OiBTbmFwc2hvdCkge1xyXG4gICAgICAgIHRoaXMuc25hcHNob3RJbnRlcnBvbGF0aW9uLnNuYXBzaG90LmFkZChzbmFwc2hvdCk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlVGlsZSh0aWxlSW5kZXg6IG51bWJlciwgdGlsZTogVGlsZVR5cGUpIHtcclxuICAgICAgICAvLyBVcGRhdGUgdGhlIHRpbGUgYW5kIHRoZSA0IG5laWdoYm91cmluZyB0aWxlc1xyXG4gICAgICAgIHRoaXMud29ybGRUaWxlc1t0aWxlSW5kZXhdID0gdGlsZTtcclxuXHJcbiAgICAgICAgLy8gZXJhc2UgdGhlIGJyb2tlbiB0aWxlcyBhbmQgaXRzIHN1cnJvdW5kaW5nIHRpbGVzIHVzaW5nIHR3byBlcmFzaW5nIHJlY3RhbmdsZXMgaW4gYSArIHNoYXBlXHJcbiAgICAgICAgdGhpcy50aWxlTGF5ZXIuZXJhc2UoKTtcclxuICAgICAgICB0aGlzLnRpbGVMYXllci5ub1N0cm9rZSgpO1xyXG4gICAgICAgIHRoaXMudGlsZUxheWVyLnJlY3QoXHJcbiAgICAgICAgICAgICgodGlsZUluZGV4ICUgdGhpcy53aWR0aCkgLSAxKSAqIGdhbWUuVElMRV9XSURUSCxcclxuICAgICAgICAgICAgTWF0aC5mbG9vcih0aWxlSW5kZXggLyB0aGlzLndpZHRoKSAqIGdhbWUuVElMRV9IRUlHSFQsXHJcbiAgICAgICAgICAgIGdhbWUuVElMRV9XSURUSCAqIDMsXHJcbiAgICAgICAgICAgIGdhbWUuVElMRV9IRUlHSFRcclxuICAgICAgICApO1xyXG4gICAgICAgIHRoaXMudGlsZUxheWVyLnJlY3QoXHJcbiAgICAgICAgICAgICh0aWxlSW5kZXggJSB0aGlzLndpZHRoKSAqIGdhbWUuVElMRV9XSURUSCxcclxuICAgICAgICAgICAgKE1hdGguZmxvb3IodGlsZUluZGV4IC8gdGhpcy53aWR0aCkgLSAxKSAqIGdhbWUuVElMRV9IRUlHSFQsXHJcbiAgICAgICAgICAgIGdhbWUuVElMRV9XSURUSCxcclxuICAgICAgICAgICAgZ2FtZS5USUxFX0hFSUdIVCAqIDNcclxuICAgICAgICApO1xyXG4gICAgICAgIHRoaXMudGlsZUxheWVyLm5vRXJhc2UoKTtcclxuXHJcbiAgICAgICAgLy8gcmVkcmF3IHRoZSBuZWlnaGJvcmluZyB0aWxlc1xyXG4gICAgICAgIHRoaXMuZHJhd1RpbGUodGlsZUluZGV4KTtcclxuICAgICAgICB0aGlzLmRyYXdUaWxlKHRpbGVJbmRleCArIHRoaXMud2lkdGgpO1xyXG4gICAgICAgIHRoaXMuZHJhd1RpbGUodGlsZUluZGV4IC0gMSk7XHJcbiAgICAgICAgdGhpcy5kcmF3VGlsZSh0aWxlSW5kZXggLSB0aGlzLndpZHRoKTtcclxuICAgICAgICB0aGlzLmRyYXdUaWxlKHRpbGVJbmRleCArIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlclBsYXllcnModGFyZ2V0OiBwNSwgdXBzY2FsZVNpemU6IG51bWJlcikge1xyXG4gICAgICAgIC8vIENhbGN1bGF0ZSB0aGUgaW50ZXJwb2xhdGVkIHBvc2l0aW9uIG9mIGFsbCB1cGRhdGVkIGVudGl0aWVzXHJcbiAgICAgICAgY29uc3QgcG9zaXRpb25TdGF0ZXM6IHsgW2lkOiBzdHJpbmddOiB7IHg6IG51bWJlcjsgeTogbnVtYmVyIH0gfSA9IHt9O1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNhbGN1bGF0ZWRTbmFwc2hvdCA9XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNuYXBzaG90SW50ZXJwb2xhdGlvbi5jYWxjSW50ZXJwb2xhdGlvbigneCB5Jyk7XHJcbiAgICAgICAgICAgIGlmICghY2FsY3VsYXRlZFNuYXBzaG90KSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBjb25zdCBzdGF0ZSA9IGNhbGN1bGF0ZWRTbmFwc2hvdC5zdGF0ZTtcclxuICAgICAgICAgICAgaWYgKCFzdGF0ZSkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgLy8gVGhlIG5ldyBwb3NpdGlvbnMgb2YgZW50aXRpZXMgYXMgb2JqZWN0XHJcbiAgICAgICAgICAgIHN0YXRlLmZvckVhY2goKHsgaWQsIHgsIHkgfTogRW50aXR5ICYgeyB4OiBudW1iZXI7IHk6IG51bWJlciB9KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvblN0YXRlc1tpZF0gPSB7IHgsIHkgfTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge31cclxuXHJcbiAgICAgICAgLy8gUmVuZGVyIGVhY2ggZW50aXR5IGluIHJhbmRvbSBvcmRlciA6c2t1bGw6XHJcbiAgICAgICAgT2JqZWN0LmVudHJpZXModGhpcy5lbnRpdGllcykuZm9yRWFjaChcclxuICAgICAgICAgICAgKGVudGl0eTogW3N0cmluZywgU2VydmVyRW50aXR5XSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdXBkYXRlZFBvc2l0aW9uID0gcG9zaXRpb25TdGF0ZXNbZW50aXR5WzBdXTtcclxuICAgICAgICAgICAgICAgIGlmICh1cGRhdGVkUG9zaXRpb24gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGVudGl0eVsxXS54ID0gdXBkYXRlZFBvc2l0aW9uLng7XHJcbiAgICAgICAgICAgICAgICAgICAgZW50aXR5WzFdLnkgPSB1cGRhdGVkUG9zaXRpb24ueTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBlbnRpdHlbMV0ucmVuZGVyKHRhcmdldCwgdXBzY2FsZVNpemUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgLy8gUmVuZGVyIHRoZSBwbGF5ZXIgb24gdG9wIDp0aHVtYnN1cDpcclxuICAgICAgICBpZiAodGhpcy5wbGF5ZXIgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLnBsYXllci5maW5kSW50ZXJwb2xhdGVkQ29vcmRpbmF0ZXMoKTtcclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXIucmVuZGVyKHRhcmdldCwgdXBzY2FsZVNpemUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBsb2FkV29ybGQoKSB7XHJcbiAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCB0aGlzLmhlaWdodDsgeCsrKSB7XHJcbiAgICAgICAgICAgIC8vIGkgd2lsbCBiZSB0aGUgeSBwb3NpdGlvbiBvZiB0aWxlcyBiZWluZyBkcmF3blxyXG4gICAgICAgICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IHRoaXMud2lkdGg7IHkrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGlsZVZhbCA9IHRoaXMud29ybGRUaWxlc1t4ICogdGhpcy53aWR0aCArIHldO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdGlsZVZhbCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0aWxlVmFsKTtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGlsZVZhbCAhPT0gVGlsZVR5cGUuQWlyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gRHJhdyB0aGUgY29ycmVjdCBpbWFnZSBmb3IgdGhlIHRpbGVzIG9udG8gdGhlIHRpbGVzIGxheWVyXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGlsZTogVGlsZSA9IFdvcmxkVGlsZXNbdGlsZVZhbF07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGlsZS5jb25uZWN0ZWQgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGlsZS50ZXh0dXJlIGluc3RhbmNlb2YgVGlsZVJlc291cmNlXHJcbiAgICAgICAgICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRlc3QgaWYgdGhlIG5laWdoYm9yaW5nIHRpbGVzIGFyZSBzb2xpZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0b3BUaWxlQm9vbCA9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4ID09PSBUaWxlVHlwZS5BaXIgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMud29ybGRUaWxlc1soeCAtIDEpICogdGhpcy53aWR0aCArIHldICE9PVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRpbGVUeXBlLkFpcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbGVmdFRpbGVCb29sID1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHkgPT09IFRpbGVUeXBlLkFpciB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy53b3JsZFRpbGVzW3ggKiB0aGlzLndpZHRoICsgeSAtIDFdICE9PVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRpbGVUeXBlLkFpcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYm90dG9tVGlsZUJvb2wgPVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeCA9PT0gdGhpcy5oZWlnaHQgLSAxIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLndvcmxkVGlsZXNbKHggKyAxKSAqIHRoaXMud2lkdGggKyB5XSAhPT1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUaWxlVHlwZS5BaXI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJpZ2h0VGlsZUJvb2wgPVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeSA9PT0gdGhpcy53aWR0aCAtIDEgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMud29ybGRUaWxlc1t4ICogdGhpcy53aWR0aCArIHkgKyAxXSAhPT1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUaWxlVHlwZS5BaXI7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb252ZXJ0IDQgZGlnaXQgYmluYXJ5IG51bWJlciB0byBiYXNlIDEwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRpbGVTZXRJbmRleCA9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA4ICogK3RvcFRpbGVCb29sICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDQgKiArcmlnaHRUaWxlQm9vbCArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAyICogK2JvdHRvbVRpbGVCb29sICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICtsZWZ0VGlsZUJvb2w7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBSZW5kZXIgY29ubmVjdGVkIHRpbGVzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbGUudGV4dHVyZS5yZW5kZXJUaWxlKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlsZVNldEluZGV4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50aWxlTGF5ZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB5ICogZ2FtZS5USUxFX1dJRFRILFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeCAqIGdhbWUuVElMRV9IRUlHSFQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnYW1lLlRJTEVfV0lEVEgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnYW1lLlRJTEVfSEVJR0hUXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgIXRpbGUuY29ubmVjdGVkICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbGUudGV4dHVyZSBpbnN0YW5jZW9mIEltYWdlUmVzb3VyY2VcclxuICAgICAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gUmVuZGVyIG5vbi1jb25uZWN0ZWQgdGlsZXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGlsZS50ZXh0dXJlLnJlbmRlcihcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGlsZUxheWVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeSAqIGdhbWUuVElMRV9XSURUSCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHggKiBnYW1lLlRJTEVfSEVJR0hULFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2FtZS5USUxFX1dJRFRILFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2FtZS5USUxFX0hFSUdIVFxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBkcmF3VGlsZSh0aWxlSW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IHggPSB0aWxlSW5kZXggJSB0aGlzLndpZHRoO1xyXG4gICAgICAgIGNvbnN0IHkgPSBNYXRoLmZsb29yKHRpbGVJbmRleCAvIHRoaXMud2lkdGgpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy53b3JsZFRpbGVzW3RpbGVJbmRleF0gIT09IFRpbGVUeXBlLkFpcikge1xyXG4gICAgICAgICAgICAvLyBEcmF3IHRoZSBjb3JyZWN0IGltYWdlIGZvciB0aGUgdGlsZXMgb250byB0aGUgdGlsZXMgbGF5ZXJcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHRpbGVWYWwgPSB0aGlzLndvcmxkVGlsZXNbdGlsZUluZGV4XVxyXG5cclxuICAgICAgICAgICAgaWYodHlwZW9mIHRpbGVWYWwgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlRyaWVkIHRvIGRyYXc6IFwiICsgdGlsZVZhbClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgdGlsZTogVGlsZSA9IFdvcmxkVGlsZXNbdGlsZVZhbF07XHJcblxyXG4gICAgICAgICAgICAvLyBpZiB0aGUgdGlsZXMgaXMgb2ZmLXNjcmVlblxyXG4gICAgICAgICAgICBpZiAodGlsZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aWxlLmNvbm5lY3RlZCAmJiB0aWxlLnRleHR1cmUgaW5zdGFuY2VvZiBUaWxlUmVzb3VyY2UpIHtcclxuICAgICAgICAgICAgICAgIC8vIFRlc3QgdGhlIG5laWdoYm9yaW5nIDQgdGlsZXNcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRvcFRpbGVCb29sID1cclxuICAgICAgICAgICAgICAgICAgICB5IDw9IDAgfHxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLndvcmxkVGlsZXNbdGlsZUluZGV4IC0gdGhpcy53aWR0aF0gIT09IFRpbGVUeXBlLkFpcjtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGxlZnRUaWxlQm9vbCA9XHJcbiAgICAgICAgICAgICAgICAgICAgeCA8PSAwIHx8IHRoaXMud29ybGRUaWxlc1t0aWxlSW5kZXggLSAxXSAhPT0gVGlsZVR5cGUuQWlyO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYm90dG9tVGlsZUJvb2wgPVxyXG4gICAgICAgICAgICAgICAgICAgIHkgPj0gdGhpcy5oZWlnaHQgLSAxIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53b3JsZFRpbGVzW3RpbGVJbmRleCArIHRoaXMud2lkdGhdICE9PSBUaWxlVHlwZS5BaXI7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByaWdodFRpbGVCb29sID1cclxuICAgICAgICAgICAgICAgICAgICB4ID49IHRoaXMud2lkdGggLSAxIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53b3JsZFRpbGVzW3RpbGVJbmRleCArIDFdICE9PSBUaWxlVHlwZS5BaXI7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gY29udmVydCA0IGRpZ2l0IGJpbmFyeSBudW1iZXIgdG8gYmFzZSAxMFxyXG4gICAgICAgICAgICAgICAgY29uc3QgdGlsZVNldEluZGV4ID1cclxuICAgICAgICAgICAgICAgICAgICA4ICogK3RvcFRpbGVCb29sICtcclxuICAgICAgICAgICAgICAgICAgICA0ICogK3JpZ2h0VGlsZUJvb2wgK1xyXG4gICAgICAgICAgICAgICAgICAgIDIgKiArYm90dG9tVGlsZUJvb2wgK1xyXG4gICAgICAgICAgICAgICAgICAgICtsZWZ0VGlsZUJvb2w7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gUmVuZGVyIGNvbm5lY3RlZCB0aWxlc1xyXG4gICAgICAgICAgICAgICAgdGlsZS50ZXh0dXJlLnJlbmRlclRpbGUoXHJcbiAgICAgICAgICAgICAgICAgICAgdGlsZVNldEluZGV4LFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGlsZUxheWVyLFxyXG4gICAgICAgICAgICAgICAgICAgIHggKiBnYW1lLlRJTEVfV0lEVEgsXHJcbiAgICAgICAgICAgICAgICAgICAgeSAqIGdhbWUuVElMRV9IRUlHSFQsXHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS5USUxFX1dJRFRILFxyXG4gICAgICAgICAgICAgICAgICAgIGdhbWUuVElMRV9IRUlHSFRcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoXHJcbiAgICAgICAgICAgICAgICAhdGlsZS5jb25uZWN0ZWQgJiZcclxuICAgICAgICAgICAgICAgIHRpbGUudGV4dHVyZSBpbnN0YW5jZW9mIEltYWdlUmVzb3VyY2VcclxuICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBSZW5kZXIgbm9uLWNvbm5lY3RlZCB0aWxlc1xyXG4gICAgICAgICAgICAgICAgdGlsZS50ZXh0dXJlLnJlbmRlcihcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRpbGVMYXllcixcclxuICAgICAgICAgICAgICAgICAgICB4ICogZ2FtZS5USUxFX1dJRFRILFxyXG4gICAgICAgICAgICAgICAgICAgIHkgKiBnYW1lLlRJTEVfSEVJR0hULFxyXG4gICAgICAgICAgICAgICAgICAgIGdhbWUuVElMRV9XSURUSCxcclxuICAgICAgICAgICAgICAgICAgICBnYW1lLlRJTEVfSEVJR0hUXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmV4cG9ydCA9IFdvcmxkO1xyXG4iLCJpbXBvcnQgSW1hZ2VSZXNvdXJjZSBmcm9tICcuLi9hc3NldHMvcmVzb3VyY2VzL0ltYWdlUmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBXb3JsZEFzc2V0cyB9IGZyb20gJy4uL2Fzc2V0cy9Bc3NldHMnO1xyXG5pbXBvcnQgVGlsZVJlc291cmNlIGZyb20gJy4uL2Fzc2V0cy9yZXNvdXJjZXMvVGlsZVJlc291cmNlJztcclxuaW1wb3J0IHsgVGlsZVR5cGUgfSBmcm9tICcuLi8uLi8uLi9hcGkvVGlsZSc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFRpbGUge1xyXG4gICAgbmFtZTogc3RyaW5nO1xyXG4gICAgdGV4dHVyZTogSW1hZ2VSZXNvdXJjZSB8IFRpbGVSZXNvdXJjZTtcclxuICAgIGNvbm5lY3RlZD86IGJvb2xlYW47XHJcbiAgICBhbnlDb25uZWN0aW9uPzogYm9vbGVhbjtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IFdvcmxkVGlsZXM6IFJlY29yZDxUaWxlVHlwZSwgVGlsZSB8IHVuZGVmaW5lZD4gPSB7XHJcbiAgICBbVGlsZVR5cGUuQWlyXTogdW5kZWZpbmVkLFxyXG4gICAgW1RpbGVUeXBlLlNub3ddOiB7XHJcbiAgICAgICAgbmFtZTogJ3Nub3cnLFxyXG4gICAgICAgIHRleHR1cmU6IFdvcmxkQXNzZXRzLm1pZGRsZWdyb3VuZC50aWxlc2V0X3Nub3csXHJcbiAgICAgICAgY29ubmVjdGVkOiB0cnVlLFxyXG4gICAgICAgIGFueUNvbm5lY3Rpb246IHRydWUsXHJcbiAgICB9LFxyXG4gICAgW1RpbGVUeXBlLkljZV06IHtcclxuICAgICAgICBuYW1lOiAnaWNlJyxcclxuICAgICAgICB0ZXh0dXJlOiBXb3JsZEFzc2V0cy5taWRkbGVncm91bmQudGlsZXNldF9pY2UsXHJcbiAgICAgICAgY29ubmVjdGVkOiB0cnVlLFxyXG4gICAgICAgIGFueUNvbm5lY3Rpb246IHRydWUsXHJcbiAgICB9LFxyXG59OyIsImltcG9ydCB7IEVudGl0aWVzIH0gZnJvbSAnLi4vLi4vLi4vLi4vYXBpL0VudGl0eSc7XHJcbmltcG9ydCB7IFBsYXllckVudGl0eSB9IGZyb20gJy4vUGxheWVyRW50aXR5JztcclxuaW1wb3J0IFBsYXllckxvY2FsIGZyb20gJy4vUGxheWVyTG9jYWwnO1xyXG5cclxuZXhwb3J0IGNvbnN0IEVudGl0eUNsYXNzZXM6IFJlY29yZDxFbnRpdGllcywgYW55PiA9IHtcclxuICAgIFtFbnRpdGllcy5Mb2NhbFBsYXllcl06IFBsYXllckxvY2FsLFxyXG4gICAgW0VudGl0aWVzLlBsYXllcl06IFBsYXllckVudGl0eSxcclxuICAgIFtFbnRpdGllcy5JdGVtXTogbnVsbFxyXG59IiwiaW1wb3J0IHsgU2VydmVyRW50aXR5IH0gZnJvbSAnLi9TZXJ2ZXJFbnRpdHknO1xyXG5pbXBvcnQgcDUgZnJvbSAncDUnO1xyXG5pbXBvcnQgZ2FtZSBmcm9tICcuLi8uLi9NYWluJztcclxuaW1wb3J0IHsgRW50aXRpZXMsIEVudGl0eVBheWxvYWQgfSBmcm9tICcuLi8uLi8uLi8uLi9hcGkvRW50aXR5JztcclxuXHJcbmV4cG9ydCBjbGFzcyBQbGF5ZXJFbnRpdHkgZXh0ZW5kcyBTZXJ2ZXJFbnRpdHkge1xyXG5cclxuICAgIHdpZHRoOiBudW1iZXIgPSAxMiAvIGdhbWUuVElMRV9XSURUSDtcclxuICAgIGhlaWdodDogbnVtYmVyID0gMjAgLyBnYW1lLlRJTEVfSEVJR0hUO1xyXG4gICAgbmFtZTogc3RyaW5nXHJcblxyXG4gICAgY29uc3RydWN0b3IoZGF0YTogRW50aXR5UGF5bG9hZCkge1xyXG4gICAgICAgIHN1cGVyKGRhdGEuaWQpO1xyXG4gICAgICAgIGlmKGRhdGEudHlwZSA9PT0gRW50aXRpZXMuUGxheWVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMubmFtZSA9IGRhdGEuZGF0YS5uYW1lO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVEYXRhKGRhdGE6IEVudGl0eVBheWxvYWQpOiB2b2lkIHtcclxuICAgICAgICBpZihkYXRhLnR5cGUgPT09IEVudGl0aWVzLlBsYXllcikge1xyXG4gICAgICAgICAgICB0aGlzLm5hbWUgPSBkYXRhLmRhdGEubmFtZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKHRhcmdldDogcDUsIHVwc2NhbGVTaXplOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0YXJnZXQuZmlsbCgwLCAyNTUsIDApO1xyXG5cclxuICAgICAgICB0YXJnZXQucmVjdChcclxuICAgICAgICAgICAgKHRoaXMueCAqIGdhbWUuVElMRV9XSURUSCAtXHJcbiAgICAgICAgICAgICAgICBnYW1lLmludGVycG9sYXRlZENhbVggKiBnYW1lLlRJTEVfV0lEVEgpICpcclxuICAgICAgICAgICAgdXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgICh0aGlzLnkgKiBnYW1lLlRJTEVfSEVJR0hUIC1cclxuICAgICAgICAgICAgICAgIGdhbWUuaW50ZXJwb2xhdGVkQ2FtWSAqIGdhbWUuVElMRV9IRUlHSFQpICpcclxuICAgICAgICAgICAgdXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIHRoaXMud2lkdGggKiB1cHNjYWxlU2l6ZSAqIGdhbWUuVElMRV9XSURUSCxcclxuICAgICAgICAgICAgdGhpcy5oZWlnaHQgKiB1cHNjYWxlU2l6ZSAqIGdhbWUuVElMRV9IRUlHSFRcclxuICAgICAgICApO1xyXG4gICAgICAgIC8vIFJlbmRlciB0aGUgaXRlbSBxdWFudGl0eSBsYWJlbFxyXG4gICAgICAgIHRhcmdldC5maWxsKDApO1xyXG5cclxuICAgICAgICB0YXJnZXQubm9TdHJva2UoKTtcclxuXHJcbiAgICAgICAgdGFyZ2V0LnRleHRTaXplKDUgKiB1cHNjYWxlU2l6ZSk7XHJcbiAgICAgICAgdGFyZ2V0LnRleHRBbGlnbih0YXJnZXQuQ0VOVEVSLCB0YXJnZXQuVE9QKTtcclxuXHJcbiAgICAgICAgdGFyZ2V0LnRleHQoXHJcbiAgICAgICAgICAgIHRoaXMubmFtZSxcclxuICAgICAgICAgICAgKCgodGhpcy54ICogZ2FtZS5USUxFX1dJRFRIKSAtXHJcbiAgICAgICAgICAgICAgICBnYW1lLmludGVycG9sYXRlZENhbVggKiBnYW1lLlRJTEVfV0lEVEgpICsgKHRoaXMud2lkdGggKiBnYW1lLlRJTEVfV0lEVEgpIC8gMikgKlxyXG4gICAgICAgICAgICB1cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgKCgodGhpcy55ICogZ2FtZS5USUxFX0hFSUdIVCkgLVxyXG4gICAgICAgICAgICAgICAgZ2FtZS5pbnRlcnBvbGF0ZWRDYW1ZICogZ2FtZS5USUxFX0hFSUdIVCkgLSAodGhpcy5oZWlnaHQgKiBnYW1lLlRJTEVfV0lEVEgpIC8gMi41KSAqXHJcbiAgICAgICAgICAgIHVwc2NhbGVTaXplXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufSIsImltcG9ydCBnYW1lIGZyb20gJy4uLy4uL01haW4nO1xyXG5pbXBvcnQgeyBTZXJ2ZXJFbnRpdHkgfSBmcm9tICcuL1NlcnZlckVudGl0eSc7XHJcbmltcG9ydCBwNSBmcm9tICdwNSc7XHJcbmltcG9ydCB7IEVudGl0aWVzLCBFbnRpdHlQYXlsb2FkIH0gZnJvbSAnLi4vLi4vLi4vLi4vYXBpL0VudGl0eSc7XHJcblxyXG5jbGFzcyBQbGF5ZXJMb2NhbCBleHRlbmRzIFNlcnZlckVudGl0eSB7XHJcblxyXG4gICAgd2lkdGg6IG51bWJlciA9IDEyIC8gZ2FtZS5USUxFX1dJRFRIO1xyXG4gICAgaGVpZ2h0OiBudW1iZXIgPSAyMCAvIGdhbWUuVElMRV9IRUlHSFQ7XHJcbiAgICBuYW1lOiBzdHJpbmdcclxuXHJcbiAgICB4VmVsOiBudW1iZXIgPSAwXHJcbiAgICB5VmVsOiBudW1iZXIgPSAwXHJcbiAgICBpbnRlcnBvbGF0ZWRYOiBudW1iZXI7XHJcbiAgICBpbnRlcnBvbGF0ZWRZOiBudW1iZXI7XHJcbiAgICBzbGlkZVg6IG51bWJlcjtcclxuICAgIHNsaWRlWTogbnVtYmVyO1xyXG5cclxuICAgIHBYOiBudW1iZXI7XHJcbiAgICBwWTogbnVtYmVyO1xyXG4gICAgcFhWZWw6IG51bWJlciA9IDBcclxuICAgIHBZVmVsOiBudW1iZXIgPSAwXHJcblxyXG4gICAgZ3JvdW5kZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICBjb2xsaXNpb25EYXRhOiBhbnk7XHJcbiAgICBjbG9zZXN0Q29sbGlzaW9uOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl1cclxuXHJcbiAgICBtYXNzOiBudW1iZXIgPSB0aGlzLndpZHRoICogdGhpcy5oZWlnaHRcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBkYXRhOiBFbnRpdHlQYXlsb2FkPEVudGl0aWVzLkxvY2FsUGxheWVyPlxyXG4gICAgKSB7XHJcbiAgICAgICAgc3VwZXIoZGF0YS5pZClcclxuXHJcbiAgICAgICAgdGhpcy5uYW1lID0gZGF0YS5kYXRhLm5hbWVcclxuXHJcbiAgICAgICAgdGhpcy54ID0gZGF0YS5kYXRhLnhcclxuICAgICAgICB0aGlzLnkgPSBkYXRhLmRhdGEueVxyXG5cclxuICAgICAgICB0aGlzLmNsb3Nlc3RDb2xsaXNpb24gPSBbMSwgMCwgSW5maW5pdHldO1xyXG5cclxuICAgICAgICB0aGlzLmludGVycG9sYXRlZFggPSB0aGlzLng7XHJcbiAgICAgICAgdGhpcy5pbnRlcnBvbGF0ZWRZID0gdGhpcy55O1xyXG5cclxuICAgICAgICB0aGlzLnBYID0gdGhpcy54XHJcbiAgICAgICAgdGhpcy5wWSA9IHRoaXMueTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIodGFyZ2V0OiBwNSwgdXBzY2FsZVNpemU6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHRhcmdldC5maWxsKDI1NSwgMCwgMCk7XHJcblxyXG4gICAgICAgIHRhcmdldC5yZWN0KFxyXG4gICAgICAgICAgICAodGhpcy5pbnRlcnBvbGF0ZWRYICogZ2FtZS5USUxFX1dJRFRIIC1cclxuICAgICAgICAgICAgICAgIGdhbWUuaW50ZXJwb2xhdGVkQ2FtWCAqIGdhbWUuVElMRV9XSURUSCkgKlxyXG4gICAgICAgICAgICB1cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgKHRoaXMuaW50ZXJwb2xhdGVkWSAqIGdhbWUuVElMRV9IRUlHSFQgLVxyXG4gICAgICAgICAgICAgICAgZ2FtZS5pbnRlcnBvbGF0ZWRDYW1ZICogZ2FtZS5USUxFX0hFSUdIVCkgKlxyXG4gICAgICAgICAgICB1cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgdGhpcy53aWR0aCAqIHVwc2NhbGVTaXplICogZ2FtZS5USUxFX1dJRFRILFxyXG4gICAgICAgICAgICB0aGlzLmhlaWdodCAqIHVwc2NhbGVTaXplICogZ2FtZS5USUxFX0hFSUdIVFxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlRGF0YShkYXRhOiBFbnRpdHlQYXlsb2FkKTogdm9pZCB7XHJcbiAgICAgICAgaWYoZGF0YS50eXBlID09PSBFbnRpdGllcy5QbGF5ZXIpXHJcbiAgICAgICAgICAgIHRoaXMubmFtZSA9IGRhdGEuZGF0YS5uYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIGtleWJvYXJkSW5wdXQoKSB7XHJcbiAgICAgICAgdGhpcy54VmVsICs9XHJcbiAgICAgICAgICAgIDAuMDIgKlxyXG4gICAgICAgICAgICAoKyghIWdhbWUua2V5c1s2OF0gfHwgISFnYW1lLmtleXNbMzldKSAtXHJcbiAgICAgICAgICAgICAgICArKCEhZ2FtZS5rZXlzWzY1XSB8fCAhIWdhbWUua2V5c1szN10pKTtcclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgIHRoaXMuZ3JvdW5kZWQgJiZcclxuICAgICAgICAgICAgKGdhbWUua2V5c1s4N10gfHwgZ2FtZS5rZXlzWzM4XSB8fCBnYW1lLmtleXNbMzJdKVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICB0aGlzLnlWZWwgPSAtMS41O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBhcHBseUdyYXZpdHlBbmREcmFnKCkge1xyXG4gICAgICAgIC8vIHRoaXMgZnVuY3Rpb24gY2hhbmdlcyB0aGUgb2JqZWN0J3MgbmV4dCB0aWNrJ3MgdmVsb2NpdHkgaW4gYm90aCB0aGUgeCBhbmQgdGhlIHkgZGlyZWN0aW9uc1xyXG5cclxuICAgICAgICB0aGlzLnBYVmVsID0gdGhpcy54VmVsO1xyXG4gICAgICAgIHRoaXMucFlWZWwgPSB0aGlzLnlWZWw7XHJcblxyXG4gICAgICAgIHRoaXMueFZlbCAtPVxyXG4gICAgICAgICAgICAoZ2FtZS5hYnModGhpcy54VmVsKSAqIHRoaXMueFZlbCAqIGdhbWUuRFJBR19DT0VGRklDSUVOVCAqIHRoaXMud2lkdGgpIC9cclxuICAgICAgICAgICAgdGhpcy5tYXNzO1xyXG4gICAgICAgIHRoaXMueVZlbCArPSBnYW1lLkdSQVZJVFlfU1BFRUQ7XHJcbiAgICAgICAgdGhpcy55VmVsIC09XHJcbiAgICAgICAgICAgIChnYW1lLmFicyh0aGlzLnlWZWwpICogdGhpcy55VmVsICogZ2FtZS5EUkFHX0NPRUZGSUNJRU5UICogdGhpcy5oZWlnaHQpIC9cclxuICAgICAgICAgICAgdGhpcy5tYXNzO1xyXG4gICAgfVxyXG5cclxuICAgIGZpbmRJbnRlcnBvbGF0ZWRDb29yZGluYXRlcygpIHtcclxuICAgICAgICAvLyB0aGlzIGZ1bmN0aW9uIGVzc2VudGlhbGx5IG1ha2VzIHRoZSBjaGFyYWN0ZXIgbGFnIGJlaGluZCBvbmUgdGljaywgYnV0IG1lYW5zIHRoYXQgaXQgZ2V0cyBkaXNwbGF5ZWQgYXQgdGhlIG1heGltdW0gZnJhbWUgcmF0ZS5cclxuICAgICAgICBpZiAodGhpcy5wWFZlbCA+IDApIHtcclxuICAgICAgICAgICAgdGhpcy5pbnRlcnBvbGF0ZWRYID0gZ2FtZS5taW4oXHJcbiAgICAgICAgICAgICAgICB0aGlzLnBYICsgdGhpcy5wWFZlbCAqIGdhbWUuYW1vdW50U2luY2VMYXN0VGljayxcclxuICAgICAgICAgICAgICAgIHRoaXMueFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW50ZXJwb2xhdGVkWCA9IGdhbWUubWF4KFxyXG4gICAgICAgICAgICAgICAgdGhpcy5wWCArIHRoaXMucFhWZWwgKiBnYW1lLmFtb3VudFNpbmNlTGFzdFRpY2ssXHJcbiAgICAgICAgICAgICAgICB0aGlzLnhcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMucFlWZWwgPiAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW50ZXJwb2xhdGVkWSA9IGdhbWUubWluKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5wWSArIHRoaXMucFlWZWwgKiBnYW1lLmFtb3VudFNpbmNlTGFzdFRpY2ssXHJcbiAgICAgICAgICAgICAgICB0aGlzLnlcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmludGVycG9sYXRlZFkgPSBnYW1lLm1heChcclxuICAgICAgICAgICAgICAgIHRoaXMucFkgKyB0aGlzLnBZVmVsICogZ2FtZS5hbW91bnRTaW5jZUxhc3RUaWNrLFxyXG4gICAgICAgICAgICAgICAgdGhpcy55XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFwcGx5VmVsb2NpdHlBbmRDb2xsaWRlKCkge1xyXG4gICAgICAgIHRoaXMucFggPSB0aGlzLng7XHJcbiAgICAgICAgdGhpcy5wWSA9IHRoaXMueTtcclxuXHJcbiAgICAgICAgdGhpcy5ncm91bmRlZCA9IGZhbHNlO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgIFRoaXMgZnVuY3Rpb24gYXNzdW1lcyB0aGF0IHRoZSBvYmplY3QgZG9lc24ndCBzdGFydCBpbiBjb2xsaXNpb25cclxuXHJcbiAgICAgICAgQWxzbywgaXQgdGFrZXMgYWR2YW50YWdlIG9mIHRoZSBmYWN0IHRoYXQgYW4gb2JqZWN0IGNhbiBvbmx5IGNvbGxpZGUgb25jZSBpbiBlYWNoIGF4aXMgd2l0aCB0aGVzZSBheGlzLWFsaWduZWQgcmVjdGFuZ2xlcy5cclxuICAgICAgICBUaGF0J3MgYSB0b3RhbCBvZiBhIHBvc3NpYmxlIHR3byBjb2xsaXNpb25zLCBvciBhbiBpbml0aWFsIGNvbGxpc2lvbiwgYW5kIGEgc2xpZGluZyBjb2xsaXNpb24uXHJcbiAgICAgICAgKi9cclxuXHJcbiAgICAgICAgLy8gY2FsY3VsYXRlIHRoZSBpbml0aWFsIGNvbGxpc2lvbjpcclxuXHJcbiAgICAgICAgLy8gc2V0IHRoZSBjbG9zZXN0IGNvbGxpc2lvbiB0byBvbmUgaW5maW5pdGVseSBmYXIgYXdheS5cclxuICAgICAgICB0aGlzLmNsb3Nlc3RDb2xsaXNpb24gPSBbMSwgMCwgSW5maW5pdHldO1xyXG5cclxuICAgICAgICAvLyBsb29wIHRocm91Z2ggYWxsIHRoZSBwb3NzaWJsZSB0aWxlcyB0aGUgcGh5c2ljcyBib3ggY291bGQgYmUgaW50ZXJzZWN0aW5nIHdpdGhcclxuICAgICAgICBmb3IgKFxyXG4gICAgICAgICAgICBsZXQgaSA9IGdhbWUuZmxvb3IoZ2FtZS5taW4odGhpcy54LCB0aGlzLnggKyB0aGlzLnhWZWwpKTtcclxuICAgICAgICAgICAgaSA8IGdhbWUuY2VpbChnYW1lLm1heCh0aGlzLngsIHRoaXMueCArIHRoaXMueFZlbCkgKyB0aGlzLndpZHRoKTtcclxuICAgICAgICAgICAgaSsrXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIGZvciAoXHJcbiAgICAgICAgICAgICAgICBsZXQgaiA9IGdhbWUuZmxvb3IoZ2FtZS5taW4odGhpcy55LCB0aGlzLnkgKyB0aGlzLnlWZWwpKTtcclxuICAgICAgICAgICAgICAgIGogPCBnYW1lLmNlaWwoZ2FtZS5tYXgodGhpcy55LCB0aGlzLnkgKyB0aGlzLnlWZWwpICsgdGhpcy5oZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgaisrXHJcbiAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgLy8gaWYgdGhlIGN1cnJlbnQgdGlsZSBpc24ndCBhaXIgKHZhbHVlIDApLCB0aGVuIGNvbnRpbnVlIHdpdGggdGhlIGNvbGxpc2lvbiBkZXRlY3Rpb25cclxuICAgICAgICAgICAgICAgIGlmIChnYW1lLndvcmxkLndvcmxkVGlsZXNbaiAqIGdhbWUud29ybGRXaWR0aCArIGldICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZ2V0IHRoZSBkYXRhIGFib3V0IHRoZSBjb2xsaXNpb24gYW5kIHN0b3JlIGl0IGluIGEgdmFyaWFibGVcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbGxpc2lvbkRhdGEgPSBnYW1lLnJlY3RWc1JheShcclxuICAgICAgICAgICAgICAgICAgICAgICAgaSAtIHRoaXMud2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGogLSB0aGlzLmhlaWdodCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy53aWR0aCArIDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGVpZ2h0ICsgMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy54LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMueFZlbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy55VmVsXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29sbGlzaW9uRGF0YSAhPT0gZmFsc2UgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9zZXN0Q29sbGlzaW9uWzJdID4gdGhpcy5jb2xsaXNpb25EYXRhWzJdXHJcbiAgICAgICAgICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2VzdENvbGxpc2lvbiA9IHRoaXMuY29sbGlzaW9uRGF0YTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMl0gIT09IEluZmluaXR5KSB7XHJcbiAgICAgICAgICAgIC8vIHRoZXJlIGhhcyBiZWVuIGF0IGxlYXN0IG9uZSBjb2xsaXNpb25cclxuXHJcbiAgICAgICAgICAgIC8vIGdvIHRvIHRoZSBwb2ludCBvZiBjb2xsaXNpb24gKHRoaXMgbWFrZXMgaXQgYmVoYXZlIGFzIGlmIHRoZSB3YWxscyBhcmUgc3RpY2t5LCBidXQgd2Ugd2lsbCBsYXRlciBzbGlkZSBhZ2FpbnN0IHRoZSB3YWxscylcclxuICAgICAgICAgICAgdGhpcy54ICs9IHRoaXMueFZlbCAqIHRoaXMuY2xvc2VzdENvbGxpc2lvblsyXTtcclxuICAgICAgICAgICAgdGhpcy55ICs9IHRoaXMueVZlbCAqIHRoaXMuY2xvc2VzdENvbGxpc2lvblsyXTtcclxuICAgICAgICAgICAgLy8gdGhlIGNvbGxpc2lvbiBoYXBwZW5lZCBlaXRoZXIgb24gdGhlIHRvcCBvciBib3R0b21cclxuICAgICAgICAgICAgaWYgKHRoaXMuY2xvc2VzdENvbGxpc2lvblswXSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy55VmVsID0gMDsgLy8gc2V0IHRoZSB5IHZlbG9jaXR5IHRvIDAgYmVjYXVzZSB0aGUgb2JqZWN0IGhhcyBydW4gaW50byBhIHdhbGwgb24gaXRzIHRvcCBvciBib3R0b21cclxuICAgICAgICAgICAgICAgIHRoaXMuc2xpZGVYID0gdGhpcy54VmVsICogKDEgLSB0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMl0pOyAvLyB0aGlzIGlzIHRoZSByZW1haW5pbmcgZGlzdGFuY2UgdG8gc2xpZGUgYWZ0ZXIgdGhlIGNvbGxpc2lvblxyXG4gICAgICAgICAgICAgICAgdGhpcy5zbGlkZVkgPSAwOyAvLyBpdCBkb2Vzbid0IHNsaWRlIGluIHRoZSB5IGRpcmVjdGlvbiBiZWNhdXNlIHRoZXJlJ3MgYSB3YWxsIFxcKC4tLikvXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jbG9zZXN0Q29sbGlzaW9uWzFdID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIGl0IGNvbGxpZGVkIG9uIHRoZSBoaWdoZXIgc2lkZSwgaXQgbXVzdCBiZSB0b3VjaGluZyB0aGUgZ3JvdW5kLiAoaGlnaGVyIHkgaXMgZG93bilcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdyb3VuZGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMueFZlbCA9IDA7IC8vIHNldCB0aGUgeCB2ZWxvY2l0eSB0byAwIGJlY2F1c2Ugd2FsbCBnbyBvb2ZcclxuICAgICAgICAgICAgICAgIHRoaXMuc2xpZGVYID0gMDsgLy8gaXQgZG9lc24ndCBzbGlkZSBpbiB0aGUgeCBkaXJlY3Rpb24gYmVjYXVzZSB0aGVyZSdzIGEgd2FsbCAvKC5fLilcXFxyXG4gICAgICAgICAgICAgICAgdGhpcy5zbGlkZVkgPSB0aGlzLnlWZWwgKiAoMSAtIHRoaXMuY2xvc2VzdENvbGxpc2lvblsyXSk7IC8vIHRoaXMgaXMgdGhlIHJlbWFpbmluZyBkaXN0YW5jZSB0byBzbGlkZSBhZnRlciB0aGUgY29sbGlzaW9uXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIGF0IHRoaXMgcG9pbnQsIHRoZSBvYmplY3QgaXMgdG91Y2hpbmcgaXRzIGZpcnN0IGNvbGxpc2lvbiwgcmVhZHkgdG8gc2xpZGUuICBUaGUgYW1vdW50IGl0IHdhbnRzIHRvIHNsaWRlIGlzIGhlbGQgaW4gdGhlIHRoaXMuc2xpZGVYIGFuZCB0aGlzLnNsaWRlWSB2YXJpYWJsZXMuXHJcblxyXG4gICAgICAgICAgICAvLyB0aGlzIGNhbiBiZSB0cmVhdGVkIGVzc2VudGlhbGx5IHRoZSBzYW1lIGFzIHRoZSBmaXJzdCBjb2xsaXNpb24sIHNvIGEgbG90IG9mIHRoZSBjb2RlIHdpbGwgYmUgcmV1c2VkLlxyXG5cclxuICAgICAgICAgICAgLy8gc2V0IHRoZSBjbG9zZXN0IGNvbGxpc2lvbiB0byBvbmUgaW5maW5pdGVseSBmYXIgYXdheS5cclxuICAgICAgICAgICAgdGhpcy5jbG9zZXN0Q29sbGlzaW9uID0gWzEsIDAsIEluZmluaXR5XTtcclxuXHJcbiAgICAgICAgICAgIC8vIGxvb3AgdGhyb3VnaCBhbGwgdGhlIHBvc3NpYmxlIHRpbGVzIHRoZSBwaHlzaWNzIGJveCBjb3VsZCBiZSBpbnRlcnNlY3Rpbmcgd2l0aFxyXG4gICAgICAgICAgICBmb3IgKFxyXG4gICAgICAgICAgICAgICAgbGV0IGkgPSBnYW1lLmZsb29yKGdhbWUubWluKHRoaXMueCwgdGhpcy54ICsgdGhpcy5zbGlkZVgpKTtcclxuICAgICAgICAgICAgICAgIGkgPCBnYW1lLmNlaWwoZ2FtZS5tYXgodGhpcy54LCB0aGlzLnggKyB0aGlzLnNsaWRlWCkgKyB0aGlzLndpZHRoKTtcclxuICAgICAgICAgICAgICAgIGkrK1xyXG4gICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgIGZvciAoXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGogPSBnYW1lLmZsb29yKGdhbWUubWluKHRoaXMueSwgdGhpcy55ICsgdGhpcy5zbGlkZVkpKTtcclxuICAgICAgICAgICAgICAgICAgICBqIDxcclxuICAgICAgICAgICAgICAgICAgICBnYW1lLmNlaWwoZ2FtZS5tYXgodGhpcy55LCB0aGlzLnkgKyB0aGlzLnNsaWRlWSkgKyB0aGlzLmhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaisrXHJcbiAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBpZiB0aGUgY3VycmVudCB0aWxlIGlzbid0IGFpciAodmFsdWUgMCksIHRoZW4gY29udGludWUgd2l0aCB0aGUgY29sbGlzaW9uIGRldGVjdGlvblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChnYW1lLndvcmxkLndvcmxkVGlsZXNbaiAqIGdhbWUud29ybGRXaWR0aCArIGldICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGdldCB0aGUgZGF0YSBhYm91dCB0aGUgY29sbGlzaW9uIGFuZCBzdG9yZSBpdCBpbiBhIHZhcmlhYmxlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29sbGlzaW9uRGF0YSA9IGdhbWUucmVjdFZzUmF5KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaSAtIHRoaXMud2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqIC0gdGhpcy5oZWlnaHQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLndpZHRoICsgMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGVpZ2h0ICsgMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMueCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMueSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2xpZGVYLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zbGlkZVlcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb2xsaXNpb25EYXRhICE9PSBmYWxzZSAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9zZXN0Q29sbGlzaW9uWzJdID4gdGhpcy5jb2xsaXNpb25EYXRhWzJdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9zZXN0Q29sbGlzaW9uID0gdGhpcy5jb2xsaXNpb25EYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBpdCBoYXMgY29sbGlkZWQgd2hpbGUgdHJ5aW5nIHRvIHNsaWRlXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMl0gIT09IEluZmluaXR5KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnggKz0gdGhpcy5zbGlkZVggKiB0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMl07XHJcbiAgICAgICAgICAgICAgICB0aGlzLnkgKz0gdGhpcy5zbGlkZVkgKiB0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMl07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2xvc2VzdENvbGxpc2lvblswXSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMueVZlbCA9IDA7IC8vIHNldCB0aGUgeSB2ZWxvY2l0eSB0byAwIGJlY2F1c2UgdGhlIG9iamVjdCBoYXMgcnVuIGludG8gYSB3YWxsIG9uIGl0cyB0b3Agb3IgYm90dG9tXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2xvc2VzdENvbGxpc2lvblsxXSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgaXQgY29sbGlkZWQgb24gdGhlIGhpZ2hlciBzaWRlLCBpdCBtdXN0IGJlIHRvdWNoaW5nIHRoZSBncm91bmQuIChoaWdoZXIgeSBpcyBkb3duKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdyb3VuZGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMueFZlbCA9IDA7IC8vIHNldCB0aGUgeCB2ZWxvY2l0eSB0byAwIGJlY2F1c2Ugd2FsbCBnbyBvb2ZcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIGl0IGhhcyBub3QgY29sbGlkZWQgd2hpbGUgdHJ5aW5nIHRvIHNsaWRlXHJcbiAgICAgICAgICAgICAgICB0aGlzLnggKz0gdGhpcy5zbGlkZVg7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnkgKz0gdGhpcy5zbGlkZVk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyB0aGVyZSBoYXMgYmVlbiBubyBjb2xsaXNpb25cclxuICAgICAgICAgICAgdGhpcy54ICs9IHRoaXMueFZlbDtcclxuICAgICAgICAgICAgdGhpcy55ICs9IHRoaXMueVZlbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGNvbGxpZGUgd2l0aCBzaWRlcyBvZiBtYXBcclxuXHJcbiAgICAgICAgaWYgKHRoaXMueCA8IDApIHtcclxuICAgICAgICAgICAgdGhpcy54ID0gMDtcclxuICAgICAgICAgICAgdGhpcy54VmVsID0gMDtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMueCArIHRoaXMud2lkdGggPiBnYW1lLndvcmxkV2lkdGgpIHtcclxuICAgICAgICAgICAgdGhpcy54ID0gZ2FtZS53b3JsZFdpZHRoIC0gdGhpcy53aWR0aDtcclxuICAgICAgICAgICAgdGhpcy54VmVsID0gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnkgPCAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMueSA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMueVZlbCA9IDA7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnkgKyB0aGlzLmhlaWdodCA+IGdhbWUud29ybGRIZWlnaHQpIHtcclxuICAgICAgICAgICAgdGhpcy55ID0gZ2FtZS53b3JsZEhlaWdodCAtIHRoaXMuaGVpZ2h0O1xyXG4gICAgICAgICAgICB0aGlzLnlWZWwgPSAwO1xyXG4gICAgICAgICAgICB0aGlzLmdyb3VuZGVkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCA9IFBsYXllckxvY2FsO1xyXG4iLCJpbXBvcnQgUmVuZGVyYWJsZSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL1JlbmRlcmFibGUnO1xyXG5pbXBvcnQgcDUgZnJvbSAncDUnO1xyXG5pbXBvcnQgeyBFbnRpdHlQYXlsb2FkIH0gZnJvbSAnLi4vLi4vLi4vLi4vYXBpL0VudGl0eSc7XHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgU2VydmVyRW50aXR5IGltcGxlbWVudHMgUmVuZGVyYWJsZSB7XHJcblxyXG4gICAgZW50aXR5SWQ6IHN0cmluZ1xyXG5cclxuICAgIHg6IG51bWJlciA9IDBcclxuICAgIHk6IG51bWJlciA9IDBcclxuXHJcbiAgICBwcm90ZWN0ZWQgY29uc3RydWN0b3IoZW50aXR5SWQ6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuZW50aXR5SWQgPSBlbnRpdHlJZFxyXG4gICAgfVxyXG5cclxuICAgIGFic3RyYWN0IHVwZGF0ZURhdGEoZGF0YTogRW50aXR5UGF5bG9hZCk6IHZvaWRcclxuXHJcbiAgICBhYnN0cmFjdCByZW5kZXIodGFyZ2V0OiBwNSwgdXBzY2FsZVNpemU6IG51bWJlcik6IHZvaWQ7XHJcbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuLy8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbl9fd2VicGFja19yZXF1aXJlX18ubSA9IF9fd2VicGFja19tb2R1bGVzX187XG5cbiIsInZhciBkZWZlcnJlZCA9IFtdO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5PID0gKHJlc3VsdCwgY2h1bmtJZHMsIGZuLCBwcmlvcml0eSkgPT4ge1xuXHRpZihjaHVua0lkcykge1xuXHRcdHByaW9yaXR5ID0gcHJpb3JpdHkgfHwgMDtcblx0XHRmb3IodmFyIGkgPSBkZWZlcnJlZC5sZW5ndGg7IGkgPiAwICYmIGRlZmVycmVkW2kgLSAxXVsyXSA+IHByaW9yaXR5OyBpLS0pIGRlZmVycmVkW2ldID0gZGVmZXJyZWRbaSAtIDFdO1xuXHRcdGRlZmVycmVkW2ldID0gW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldO1xuXHRcdHJldHVybjtcblx0fVxuXHR2YXIgbm90RnVsZmlsbGVkID0gSW5maW5pdHk7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgZGVmZXJyZWQubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldID0gZGVmZXJyZWRbaV07XG5cdFx0dmFyIGZ1bGZpbGxlZCA9IHRydWU7XG5cdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBjaHVua0lkcy5sZW5ndGg7IGorKykge1xuXHRcdFx0aWYgKChwcmlvcml0eSAmIDEgPT09IDAgfHwgbm90RnVsZmlsbGVkID49IHByaW9yaXR5KSAmJiBPYmplY3Qua2V5cyhfX3dlYnBhY2tfcmVxdWlyZV9fLk8pLmV2ZXJ5KChrZXkpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fLk9ba2V5XShjaHVua0lkc1tqXSkpKSkge1xuXHRcdFx0XHRjaHVua0lkcy5zcGxpY2Uoai0tLCAxKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZ1bGZpbGxlZCA9IGZhbHNlO1xuXHRcdFx0XHRpZihwcmlvcml0eSA8IG5vdEZ1bGZpbGxlZCkgbm90RnVsZmlsbGVkID0gcHJpb3JpdHk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKGZ1bGZpbGxlZCkge1xuXHRcdFx0ZGVmZXJyZWQuc3BsaWNlKGktLSwgMSlcblx0XHRcdHZhciByID0gZm4oKTtcblx0XHRcdGlmIChyICE9PSB1bmRlZmluZWQpIHJlc3VsdCA9IHI7XG5cdFx0fVxuXHR9XG5cdHJldHVybiByZXN1bHQ7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18uZyA9IChmdW5jdGlvbigpIHtcblx0aWYgKHR5cGVvZiBnbG9iYWxUaGlzID09PSAnb2JqZWN0JykgcmV0dXJuIGdsb2JhbFRoaXM7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIHRoaXMgfHwgbmV3IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHJldHVybiB3aW5kb3c7XG5cdH1cbn0pKCk7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIG5vIGJhc2VVUklcblxuLy8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3Ncbi8vIHVuZGVmaW5lZCA9IGNodW5rIG5vdCBsb2FkZWQsIG51bGwgPSBjaHVuayBwcmVsb2FkZWQvcHJlZmV0Y2hlZFxuLy8gW3Jlc29sdmUsIHJlamVjdCwgUHJvbWlzZV0gPSBjaHVuayBsb2FkaW5nLCAwID0gY2h1bmsgbG9hZGVkXG52YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuXHRcIm1haW5cIjogMFxufTtcblxuLy8gbm8gY2h1bmsgb24gZGVtYW5kIGxvYWRpbmdcblxuLy8gbm8gcHJlZmV0Y2hpbmdcblxuLy8gbm8gcHJlbG9hZGVkXG5cbi8vIG5vIEhNUlxuXG4vLyBubyBITVIgbWFuaWZlc3RcblxuX193ZWJwYWNrX3JlcXVpcmVfXy5PLmogPSAoY2h1bmtJZCkgPT4gKGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9PT0gMCk7XG5cbi8vIGluc3RhbGwgYSBKU09OUCBjYWxsYmFjayBmb3IgY2h1bmsgbG9hZGluZ1xudmFyIHdlYnBhY2tKc29ucENhbGxiYWNrID0gKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uLCBkYXRhKSA9PiB7XG5cdHZhciBbY2h1bmtJZHMsIG1vcmVNb2R1bGVzLCBydW50aW1lXSA9IGRhdGE7XG5cdC8vIGFkZCBcIm1vcmVNb2R1bGVzXCIgdG8gdGhlIG1vZHVsZXMgb2JqZWN0LFxuXHQvLyB0aGVuIGZsYWcgYWxsIFwiY2h1bmtJZHNcIiBhcyBsb2FkZWQgYW5kIGZpcmUgY2FsbGJhY2tcblx0dmFyIG1vZHVsZUlkLCBjaHVua0lkLCBpID0gMDtcblx0aWYoY2h1bmtJZHMuc29tZSgoaWQpID0+IChpbnN0YWxsZWRDaHVua3NbaWRdICE9PSAwKSkpIHtcblx0XHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcblx0XHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XG5cdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18ubVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKHJ1bnRpbWUpIHZhciByZXN1bHQgPSBydW50aW1lKF9fd2VicGFja19yZXF1aXJlX18pO1xuXHR9XG5cdGlmKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKSBwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbihkYXRhKTtcblx0Zm9yKDtpIDwgY2h1bmtJZHMubGVuZ3RoOyBpKyspIHtcblx0XHRjaHVua0lkID0gY2h1bmtJZHNbaV07XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGluc3RhbGxlZENodW5rcywgY2h1bmtJZCkgJiYgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKSB7XG5cdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF1bMF0oKTtcblx0XHR9XG5cdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gMDtcblx0fVxuXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHJlc3VsdCk7XG59XG5cbnZhciBjaHVua0xvYWRpbmdHbG9iYWwgPSBzZWxmW1wid2VicGFja0NodW5rc25vd2VkX2luXCJdID0gc2VsZltcIndlYnBhY2tDaHVua3Nub3dlZF9pblwiXSB8fCBbXTtcbmNodW5rTG9hZGluZ0dsb2JhbC5mb3JFYWNoKHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgMCkpO1xuY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2ggPSB3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIGNodW5rTG9hZGluZ0dsb2JhbC5wdXNoLmJpbmQoY2h1bmtMb2FkaW5nR2xvYmFsKSk7IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBkZXBlbmRzIG9uIG90aGVyIGxvYWRlZCBjaHVua3MgYW5kIGV4ZWN1dGlvbiBuZWVkIHRvIGJlIGRlbGF5ZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHVuZGVmaW5lZCwgW1wiY29tbW9ucy1tYWluXCJdLCAoKSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vd2VicGFnZS9zcmMvTWFpbi50c1wiKSkpXG5fX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKF9fd2VicGFja19leHBvcnRzX18pO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9