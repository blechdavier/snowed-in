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
const Control_1 = __webpack_require__(/*! ./input/Control */ "./webpage/src/input/Control.ts");
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
            new Control_1.Control("Walk Right", true, 68, () => {
                if (this.currentUi !== undefined)
                    return;
                this.world.player.rightButton = true;
            }, () => {
                if (this.currentUi !== undefined)
                    return;
                this.world.player.rightButton = false;
            }),
            new Control_1.Control("Walk Left", true, 65, () => {
                if (this.currentUi !== undefined)
                    return;
                this.world.player.leftButton = true;
            }, () => {
                if (this.currentUi !== undefined)
                    return;
                this.world.player.leftButton = false;
            }),
            new Control_1.Control("Jump", true, 87, () => {
                if (this.currentUi !== undefined)
                    return;
                this.world.player.jumpButton = true;
            }, () => {
                if (this.currentUi !== undefined)
                    return;
                this.world.player.jumpButton = false;
            }),
            new Control_1.Control("Pause", true, 27, () => {
                //if inventory open{
                //close inventory
                //return;}
                if (this.currentUi === undefined)
                    this.currentUi = new PauseMenu_1.PauseMenu(Assets_1.Fonts.title);
                else
                    this.currentUi = undefined;
            }),
            new Control_1.Control("Inventory", true, 69, () => {
                //if ui open return;
                //if inventory closed open inventory
                //else close inventory
                console.log("inventory has not been implemented yet");
            }),
            new Control_1.Control("Hotbar 1", true, 49, () => {
                this.selectedSlot = 0;
            }),
            new Control_1.Control("Hotbar 2", true, 49, () => {
                this.selectedSlot = 1;
            }),
            new Control_1.Control("Hotbar 3", true, 49, () => {
                this.selectedSlot = 2;
            }),
            new Control_1.Control("Hotbar 4", true, 49, () => {
                this.selectedSlot = 3;
            }),
            new Control_1.Control("Hotbar 5", true, 49, () => {
                this.selectedSlot = 4;
            }),
            new Control_1.Control("Hotbar 6", true, 49, () => {
                this.selectedSlot = 5;
            }),
            new Control_1.Control("Hotbar 7", true, 49, () => {
                this.selectedSlot = 6;
            }),
            new Control_1.Control("Hotbar 8", true, 49, () => {
                this.selectedSlot = 7;
            }),
            new Control_1.Control("Hotbar 9", true, 49, () => {
                this.selectedSlot = 8;
            }), // hot bar 9
        ];
        this.connection = connection;
        // Initialise the network manager
        this.netManager = new NetManager_1.NetManager(this);
    }
    preload() {
        console.log('Loading assets');
        (0, Assets_1.loadAssets)(this, Assets_1.UiAssets, Assets_1.ItemsAssets, Assets_1.WorldAssets, Assets_1.Fonts, Assets_1.AudioAssets, Assets_1.PlayerAnimations);
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
        Assets_1.AudioAssets.music.titleScreen.playSound();
        this.particleMultiplier = 1;
        this.skyToggle = true;
        this.skyMod = 2;
        this.particles = [];
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
        //delete any particles that have gotten too old
        for (let i = 0; i < this.particles.length; i++) {
            if (this.particles[i].age > this.particles[i].lifespan) {
                this.particles.splice(i, 1);
                i--;
            }
        }
        //no outline on particles
        this.noStroke();
        //draw all of the particles
        for (let particle of this.particles) {
            particle.render(this, this.upscaleSize);
        }
        if (this.currentUi !== undefined)
            this.currentUi.render(this, this.upscaleSize);
        // console.timeEnd("frame");
    }
    windowResized() {
        this.resizeCanvas(this.windowWidth, this.windowHeight);
        this.skyShader.setUniform("screenDimensions", [this.windowWidth / this.upscaleSize, this.windowHeight / this.upscaleSize]);
        // go for a scale of <48 tiles screen
        this.upscaleSize = Math.min(this.ceil(this.windowWidth / 48 / this.TILE_WIDTH), this.ceil(this.windowHeight / 48 / this.TILE_HEIGHT));
        this.currentUi.windowUpdate();
    }
    keyPressed(event) {
        this.keys[this.keyCode] = true;
        for (let control of this.controls) {
            if (control.keyboard && control.keyCode === event.keyCode) //event.keyCode is deprecated but i don't care
                control.onPressed();
        }
    }
    keyReleased(event) {
        this.keys[this.keyCode] = false;
        for (let control of this.controls) {
            if (control.keyboard && control.keyCode === event.keyCode) //event.keyCode is deprecated but i don't care
                control.onReleased();
        }
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
    mousePressed(e) {
        // image(uiSlotImage, 2*upscaleSize+16*i*upscaleSize, 2*upscaleSize, 16*upscaleSize, 16*upscaleSize);
        if (this.currentUi !== undefined) {
            this.currentUi.mousePressed(e.button);
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
        for (let particle of this.particles) {
            particle.tick();
        }
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
exports.loadAssets = exports.PlayerAnimations = exports.Keys = exports.Fonts = exports.WorldAssets = exports.ItemsAssets = exports.UiAssets = exports.AudioAssets = void 0;
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
const Keys = {
    keyboardMap: [
        "",
        "",
        "",
        "CANCEL",
        "",
        "",
        "HELP",
        "",
        "BACKSPACE",
        "TAB",
        "",
        "",
        "CLEAR",
        "ENTER",
        "ENTER SPECIAL",
        "",
        "SHIFT",
        "CONTROL",
        "ALT",
        "PAUSE",
        "CAPS LOCK",
        "KANA",
        "EISU",
        "JUNJA",
        "FINAL",
        "HANJA",
        "",
        "ESCAPE",
        "CONVERT",
        "NONCONVERT",
        "ACCEPT",
        "MODECHANGE",
        "SPACE",
        "PAGE UP",
        "PAGE DOWN",
        "END",
        "HOME",
        "LEFT",
        "UP",
        "RIGHT",
        "DOWN",
        "SELECT",
        "PRINT",
        "EXECUTE",
        "PRINT SCREEN",
        "INSERT",
        "DELETE",
        "",
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "COLON",
        "SEMICOLON",
        "LESS THAN",
        "EQUALS",
        "GREATER THAN",
        "QUESTION MARK",
        "AT",
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
        "OS KEY",
        "",
        "CONTEXT MENU",
        "",
        "SLEEP",
        "NUMPAD0",
        "NUMPAD1",
        "NUMPAD2",
        "NUMPAD3",
        "NUMPAD4",
        "NUMPAD5",
        "NUMPAD6",
        "NUMPAD7",
        "NUMPAD8",
        "NUMPAD9",
        "MULTIPLY",
        "ADD",
        "SEPARATOR",
        "SUBTRACT",
        "DECIMAL",
        "DIVIDE",
        "F1",
        "F2",
        "F3",
        "F4",
        "F5",
        "F6",
        "F7",
        "F8",
        "F9",
        "F10",
        "F11",
        "F12",
        "F13",
        "F14",
        "F15",
        "F16",
        "F17",
        "F18",
        "F19",
        "F20",
        "F21",
        "F22",
        "F23",
        "F24",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "NUM LOCK",
        "SCROLL LOCK",
        "WIN OEM FJ JISHO",
        "WIN OEM FJ MASSHOU",
        "WIN OEM FJ TOUROKU",
        "WIN OEM FJ LOYA",
        "WIN OEM FJ ROYA",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "CIRCUMFLEX",
        "EXCLAMATION",
        "DOUBLE_QUOTE",
        "HASH",
        "DOLLAR",
        "PERCENT",
        "AMPERSAND",
        "UNDERSCORE",
        "OPEN PARENTHESIS",
        "CLOSE PARENTHESIS",
        "ASTERISK",
        "PLUS",
        "PIPE",
        "HYPHEN",
        "OPEN CURLY BRACKET",
        "CLOSE CURLY BRACKET",
        "TILDE",
        "",
        "",
        "",
        "",
        "VOLUME MUTE",
        "VOLUME DOWN",
        "VOLUME UP",
        "",
        "",
        "SEMICOLON",
        "EQUALS",
        "COMMA",
        "MINUS",
        "PERIOD",
        "SLASH",
        "BACK QUOTE",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "OPEN BRACKET",
        "BACK SLASH",
        "CLOSE BRACKET",
        "QUOTE",
        "",
        "META",
        "ALT GRAPH",
        "",
        "WIN ICO HELP",
        "WIN ICO 00",
        "",
        "WIN ICO CLEAR",
        "",
        "",
        "WIN OEM RESET",
        "WIN OEM JUMP",
        "WIN OEM PA1",
        "WIN OEM PA2",
        "WIN OEM PA3",
        "WIN OEM WSCTRL",
        "WIN OEM CUSEL",
        "WIN OEM ATTN",
        "WIN OEM FINISH",
        "WIN OEM COPY",
        "WIN OEM AUTO",
        "WIN OEM ENLW",
        "WIN OEM BACKTAB",
        "ATTN",
        "CRSEL",
        "EXSEL",
        "EREOF",
        "PLAY",
        "ZOOM",
        "",
        "PA1",
        "WIN OEM CLEAR",
        "TOGGLE TOUCHPAD" // [255]
    ] // https://stackoverflow.com/questions/1772179/get-character-value-from-keycode-in-javascript-then-trim
};
exports.Keys = Keys;
const AudioAssets = {
    ui: {
        inventoryClack: new AudioResourceGroup_1.default([new AudioResource_1.default('assets/sounds/sfx/ui/clack1.mp3'), new AudioResource_1.default('assets/sounds/sfx/ui/clack2.mp3'), new AudioResource_1.default('assets/sounds/sfx/ui/clack3.mp3')])
    },
    music: {
        titleScreen: new AudioResource_1.default('assets/sounds/music/TitleScreen.mp3')
    }
};
exports.AudioAssets = AudioAssets;
// const animations = <T extends Record<string, ImageResource[]>>(data: T): T => data
const PlayerAnimations = {
    idle: [
        new ImageResource_1.default('assets/textures/player/character.png')
    ]
};
exports.PlayerAnimations = PlayerAnimations;
let frame = 'idle';
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
    playSound() {
        //Verify that the sound has been loaded
        if (this.sound === undefined)
            throw new Error(`Tried to play sound before loading it: ${this.path}`);
        this.sound.pause();
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
        this.sounds[r].playSound(); // play a random sound from the array at a slightly randomized pitch, leading to the effect of it making a new sound each time, removing repetitiveness
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

/***/ "./webpage/src/input/Control.ts":
/*!**************************************!*\
  !*** ./webpage/src/input/Control.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Control = void 0;
class Control {
    constructor(description, keyboard, keyCode, onPressed, onReleased) {
        this.description = description;
        this.keyboard = keyboard;
        this.keyCode = keyCode;
        this.onPressed = onPressed;
        this.onReleased = onReleased || function () { }; //for some reason arrow function doesn't like to exist here but i'm not gonna worry too much
        //if it's too ugly, you can try to fix it
    }
}
exports.Control = Control;


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

/***/ "./webpage/src/ui/InputBox.ts":
/*!************************************!*\
  !*** ./webpage/src/ui/InputBox.ts ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


const Assets_1 = __webpack_require__(/*! ../assets/Assets */ "./webpage/src/assets/Assets.ts");
class InputBox {
    constructor(font, txt, keyboard, value, index, // the index in the Game.controls array that it changes
    x, y, w, h) {
        this.font = font;
        this.txt = txt;
        this.value = value;
        this.keyboard = keyboard;
        this.index = index;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.image = Assets_1.UiAssets.button_unselected;
        this.mouseIsOver = false;
        this.listening = false;
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
        if (this.listening) {
            this.font.drawText(target, this.txt + ": click to cancel", x + 6 * upscaleSize, Math.round((this.y + this.h / 2) / upscaleSize) * upscaleSize - 6 * upscaleSize);
        }
        else {
            if (this.keyboard) {
                this.font.drawText(target, this.txt + ":   " + Assets_1.Keys.keyboardMap[this.value], x + 6 * upscaleSize, Math.round((this.y + this.h / 2) / upscaleSize) * upscaleSize - 6 * upscaleSize);
            }
            else {
                this.font.drawText(target, this.txt + ":   Mouse " + this.value, x + 6 * upscaleSize, Math.round((this.y + this.h / 2) / upscaleSize) * upscaleSize - 6 * upscaleSize);
            }
        }
    }
    updateMouseOver(mouseX, mouseY) {
        // if the mouse position is inside the button, return true
        if (mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h) {
            this.mouseIsOver = true;
        }
        else {
            this.mouseIsOver = false;
        }
    }
    onPressed() {
        console.log("input box pressed");
        this.listening = !this.listening;
        if (this.listening) {
            this.image = Assets_1.UiAssets.button_selected;
            return;
        }
        this.image = Assets_1.UiAssets.button_unselected;
        // AudioAssets.ui.inventoryClack.playRandom();
    }
}
module.exports = InputBox;


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
const Assets_1 = __webpack_require__(/*! ../assets/Assets */ "./webpage/src/assets/Assets.ts");
class UiScreen {
    mousePressed(btn) {
        if (this.buttons !== undefined) {
            // loop through all the buttons in this menu and if the mouse is over them, then call the button's onPressed() function.  The onPressed() function is passed in through the constructor.
            for (const i of this.buttons) {
                if (i.mouseIsOver) {
                    i.onPressed();
                }
            }
            ;
        }
        if (this.sliders !== undefined) {
            // loop through all the sliders and interact with them accordingly
            for (const i of this.sliders) {
                i.updateSliderPosition(Main_1.default.mouseX);
                if (Main_1.default.mouseX > i.x && Main_1.default.mouseX < i.x + i.w && Main_1.default.mouseY > i.y && Main_1.default.mouseY < i.y + i.h)
                    i.beingEdited = true;
            }
        }
        if (this.inputBoxes !== undefined) {
            // loop through all the input boxes and interact with them accordingly
            for (const i of this.inputBoxes) {
                if (i.mouseIsOver) {
                    i.onPressed();
                }
                else if (i.listening) {
                    i.listening = false;
                    Main_1.default.controls[i.index].keyCode = btn;
                    Main_1.default.controls[i.index].keyboard = false;
                    i.value = btn;
                    i.keyboard = false;
                    i.image = Assets_1.UiAssets.button_unselected;
                }
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

/***/ "./webpage/src/ui/screens/ControlsMenu.ts":
/*!************************************************!*\
  !*** ./webpage/src/ui/screens/ControlsMenu.ts ***!
  \************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ControlsMenu = void 0;
const UiScreen_1 = __importDefault(__webpack_require__(/*! ../UiScreen */ "./webpage/src/ui/UiScreen.ts"));
const UiFrame_1 = __importDefault(__webpack_require__(/*! ../UiFrame */ "./webpage/src/ui/UiFrame.ts"));
const Main_1 = __importDefault(__webpack_require__(/*! ../../Main */ "./webpage/src/Main.ts"));
const Button_1 = __importDefault(__webpack_require__(/*! ../Button */ "./webpage/src/ui/Button.ts"));
const OptionsMenu_1 = __webpack_require__(/*! ./OptionsMenu */ "./webpage/src/ui/screens/OptionsMenu.ts");
const InputBox_1 = __importDefault(__webpack_require__(/*! ../InputBox */ "./webpage/src/ui/InputBox.ts"));
class ControlsMenu extends UiScreen_1.default {
    constructor(font) {
        super();
        // make the frame with some default values.  These will later be changed to fit the screen size.
        this.frame = new UiFrame_1.default(0, 0, 0, 0);
        // make some buttons with default positions
        this.buttons = [
            new Button_1.default(font, "Back", "Return to the options menu.", 0, 0, 0, 0, () => {
                console.log("options menu");
                Main_1.default.currentUi = new OptionsMenu_1.OptionsMenu(font);
            })
        ];
        this.inputBoxes = [
        // new InputBox(font, "Walk Right", true, 68, 0, 0, 0, 0, 0),
        // new InputBox(font, "Walk Left", true, 65, 1, 0, 0, 0, 0),
        // new InputBox(font, "Jump", true, 32, 2, 0, 0, 0, 0),
        // new InputBox(font, "Pause", true, 27, 3, 0, 0, 0, 0)
        ];
        let i = 0;
        for (let control of Main_1.default.controls) {
            i++;
            this.inputBoxes.push(new InputBox_1.default(font, control.description, control.keyboard, control.keyCode, i, 0, 0, 0, 0));
        }
        // update the size of the elements based on the initial screen size
        this.windowUpdate();
    }
    render(target, upscaleSize) {
        // render the rectangular image
        this.frame.render(target, upscaleSize);
        // loop through the buttons array and render each one.
        this.buttons.forEach(button => {
            button.render(target, upscaleSize);
        });
        // loop through the inputBoxes array and render each one.
        this.inputBoxes.forEach(inputBox => {
            inputBox.render(target, upscaleSize);
        });
    }
    windowUpdate() {
        // set the position of the frame
        this.frame.x = Main_1.default.width / 2 - 200 / 2 * Main_1.default.upscaleSize; // center the frame in the center of the screen
        this.frame.y = Main_1.default.height / 2 - 56 * Main_1.default.upscaleSize;
        this.frame.w = 200 * Main_1.default.upscaleSize;
        this.frame.h = 48 * Main_1.default.upscaleSize;
        // set the positions of the button
        for (let i = 0; i < 1; i++) {
            this.buttons[i].x = Main_1.default.width / 2 - 192 / 2 * Main_1.default.upscaleSize;
            this.buttons[i].y = Main_1.default.height / 2 + 20 * i * Main_1.default.upscaleSize + 20 * Main_1.default.upscaleSize * this.inputBoxes.length;
            this.buttons[i].w = 192 * Main_1.default.upscaleSize;
            this.buttons[i].h = 16 * Main_1.default.upscaleSize;
            this.buttons[i].updateMouseOver(Main_1.default.mouseX, Main_1.default.mouseY);
        }
        // set the positions of all the input boxes
        for (let i = 0; i < 4; i++) {
            this.inputBoxes[i].x = Main_1.default.width / 2 - 192 / 2 * Main_1.default.upscaleSize;
            this.inputBoxes[i].y = Main_1.default.height / 2 + 20 * i * Main_1.default.upscaleSize;
            this.inputBoxes[i].w = 192 * Main_1.default.upscaleSize;
            this.inputBoxes[i].h = 16 * Main_1.default.upscaleSize;
            console.log(this.inputBoxes[i]);
        }
    }
}
exports.ControlsMenu = ControlsMenu;


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
const VideoSettingsMenu_1 = __webpack_require__(/*! ./VideoSettingsMenu */ "./webpage/src/ui/screens/VideoSettingsMenu.ts");
const ControlsMenu_1 = __webpack_require__(/*! ./ControlsMenu */ "./webpage/src/ui/screens/ControlsMenu.ts");
class OptionsMenu extends UiScreen_1.default {
    constructor(font) {
        super();
        // make the frame with some default values.  These will later be changed to fit the screen size.
        this.frame = new UiFrame_1.default(0, 0, 0, 0);
        // make some buttons with default positions
        this.buttons = [
            new Button_1.default(font, "Video Settings", "Change the balance between performance and fidelity.", 0, 0, 0, 0, () => {
                console.log("video settings");
                Main_1.default.currentUi = new VideoSettingsMenu_1.VideoSettingsMenu(font);
            }),
            new Button_1.default(font, "Controls", "Change your keybinds.", 0, 0, 0, 0, () => {
                console.log("control menu");
                Main_1.default.currentUi = new ControlsMenu_1.ControlsMenu(font);
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
            new Button_1.default(font, "Resume game", "Go back to the game.", 0, 0, 0, 0, () => {
                Main_1.default.currentUi = undefined;
            }),
            new Button_1.default(font, "Options", "Change your keybinds, reduce lag, etc.", 0, 0, 0, 0, () => {
                Main_1.default.currentUi = new OptionsMenu_1.OptionsMenu(font);
            }),
            new Button_1.default(font, "Leave game", "Go back to Main Menu", 0, 0, 0, 0, () => {
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

/***/ "./webpage/src/ui/screens/VideoSettingsMenu.ts":
/*!*****************************************************!*\
  !*** ./webpage/src/ui/screens/VideoSettingsMenu.ts ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VideoSettingsMenu = void 0;
const UiScreen_1 = __importDefault(__webpack_require__(/*! ../UiScreen */ "./webpage/src/ui/UiScreen.ts"));
const UiFrame_1 = __importDefault(__webpack_require__(/*! ../UiFrame */ "./webpage/src/ui/UiFrame.ts"));
const Main_1 = __importDefault(__webpack_require__(/*! ../../Main */ "./webpage/src/Main.ts"));
const Button_1 = __importDefault(__webpack_require__(/*! ../Button */ "./webpage/src/ui/Button.ts"));
const OptionsMenu_1 = __webpack_require__(/*! ./OptionsMenu */ "./webpage/src/ui/screens/OptionsMenu.ts");
class VideoSettingsMenu extends UiScreen_1.default {
    constructor(font) {
        super();
        // make the frame with some default values.  These will later be changed to fit the screen size.
        this.frame = new UiFrame_1.default(0, 0, 0, 0);
        if (Main_1.default.skyMod === undefined)
            Main_1.default.skyMod = 2;
        if (Main_1.default.skyToggle === undefined)
            Main_1.default.skyToggle = true;
        if (Main_1.default.particleMultiplier === undefined)
            Main_1.default.particleMultiplier = 1;
        let tempSkyModeText;
        if (Main_1.default.skyMod === 2) {
            tempSkyModeText = "Half Framerate";
        }
        else if (Main_1.default.skyMod === 1) {
            tempSkyModeText = "Full Framerate";
        }
        else {
            tempSkyModeText = "Solid Color";
        }
        let tempParticleText;
        if (Main_1.default.particleMultiplier === 2) {
            tempParticleText = "Double";
        }
        else if (Main_1.default.particleMultiplier === 1) {
            tempParticleText = "Normal";
        }
        else {
            tempParticleText = "Minimal";
        }
        // make some buttons with default positions
        this.buttons = [
            new Button_1.default(font, `Sky: ${tempSkyModeText}`, "Change the appearance of the sky.", 0, 0, 0, 0, () => {
                console.log("sky toggle");
                if (this.buttons[0].txt === "Sky: Half Framerate") {
                    this.buttons[0].txt = "Sky: Full Framerate";
                    Main_1.default.skyMod = 1;
                    Main_1.default.skyToggle = true;
                }
                else if (this.buttons[0].txt === "Sky: Full Framerate") {
                    this.buttons[0].txt = "Sky: Solid Color";
                    Main_1.default.skyToggle = false;
                }
                else {
                    this.buttons[0].txt = "Sky: Half Framerate";
                    Main_1.default.skyMod = 2;
                    Main_1.default.skyToggle = true;
                }
            }),
            new Button_1.default(font, `Particles: ${tempParticleText}`, "Change the amount of particles", 0, 0, 0, 0, () => {
                console.log("particles");
                if (this.buttons[1].txt === "Particles: Normal") {
                    this.buttons[1].txt = "Particles: Double";
                    Main_1.default.particleMultiplier = 2;
                }
                else if (this.buttons[1].txt === "Particles: Double") {
                    this.buttons[1].txt = "Particles: Minimal";
                    Main_1.default.particleMultiplier = 0.5;
                }
                else {
                    this.buttons[1].txt = "Particles: Normal";
                    Main_1.default.particleMultiplier = 1;
                }
            }),
            new Button_1.default(font, "Back", "Return to the main menu.", 0, 0, 0, 0, () => {
                console.log("main menu");
                Main_1.default.currentUi = new OptionsMenu_1.OptionsMenu(font);
            })
        ];
        // update the size of the elements based on the initial screen size
        this.windowUpdate();
    }
    render(target, upscaleSize) {
        // render the rectangular image
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
exports.VideoSettingsMenu = VideoSettingsMenu;


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
const ColorParticle_1 = __webpack_require__(/*! ../particles/ColorParticle */ "./webpage/src/world/particles/ColorParticle.ts");
const Assets_1 = __webpack_require__(/*! ../../assets/Assets */ "./webpage/src/assets/Assets.ts");
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
        this.pGrounded = false;
        this.mass = this.width * this.height;
        this.animFrame = 0;
        this.name = data.data.name;
        this.x = data.data.x;
        this.y = data.data.y;
        this.closestCollision = [1, 0, Infinity];
        this.interpolatedX = this.x;
        this.interpolatedY = this.y;
        this.pX = this.x;
        this.pY = this.y;
        this.leftButton = false;
        this.rightButton = false;
        this.jumpButton = false;
        this.currentAnimation = "idle";
    }
    render(target, upscaleSize) {
        console.log(`animation ${this.currentAnimation}, frame ${this.animFrame} makes ` + Assets_1.PlayerAnimations[this.currentAnimation][this.animFrame]);
        console.log(Assets_1.PlayerAnimations);
        console.log(Assets_1.PlayerAnimations[this.currentAnimation]);
        Assets_1.PlayerAnimations[this.currentAnimation][this.animFrame].render(target, (this.interpolatedX * Main_1.default.TILE_WIDTH -
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
            0.02 * (+this.rightButton - +this.leftButton);
        if (this.grounded && this.jumpButton) {
            for (let i = 0; i < 10 * Main_1.default.particleMultiplier; i++) {
                Main_1.default.particles.push(new ColorParticle_1.ColorParticle("#cafafc", 1 / 8 + Math.random() / 8, 20, this.x + this.width * Math.random(), this.y + this.height, 0.2 * (Math.random() - 0.5), 0.2 * -Math.random()));
            }
            this.yVel = -1.5;
        }
    }
    applyGravityAndDrag() {
        // this function changes the object's next tick's velocity in both the x and the y directions
        this.pXVel = this.xVel;
        this.pYVel = this.yVel;
        this.xVel -=
            (Math.abs(this.xVel) * this.xVel * Main_1.default.DRAG_COEFFICIENT * this.width) /
                this.mass;
        this.yVel += Main_1.default.GRAVITY_SPEED;
        this.yVel -=
            (Math.abs(this.yVel) * this.yVel * Main_1.default.DRAG_COEFFICIENT * this.height) /
                this.mass;
        //if on the ground, make walking particles
        if (this.grounded) {
            //footsteps
            for (let i = 0; i < randomlyToInt(Math.abs(this.xVel) * Main_1.default.particleMultiplier / 2); i++) {
                Main_1.default.particles.push(new ColorParticle_1.ColorParticle("#bbbbbb45", 1 / 4 + Math.random() / 8, 50, this.x + this.width / 2 + i / Main_1.default.particleMultiplier, this.y + this.height, 0, 0, false));
            }
            //dust
            for (let i = 0; i < randomlyToInt(Math.abs(this.xVel) * Main_1.default.particleMultiplier / 2); i++) {
                Main_1.default.particles.push(new ColorParticle_1.ColorParticle("#cafafc", 1 / 8 + Math.random() / 8, 10, this.x + this.width / 2, this.y + this.height, 0.2 * -this.xVel + 0.2 * (Math.random() - 0.5), 0.2 * -Math.random(), true));
            }
        }
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
        // loop through all the possible tiles the physics box could be intersecting with
        for (let i = Math.floor(Main_1.default.min(this.x, this.x + this.xVel)); i < Math.ceil(Main_1.default.max(this.x, this.x + this.xVel) + this.width); i++) {
            for (let j = Math.floor(Main_1.default.min(this.y, this.y + this.yVel)); j < Math.ceil(Main_1.default.max(this.y, this.y + this.yVel) + this.height); j++) {
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
                    this.grounded = true;
                    // if it collided on the higher side, it must be touching the ground. (higher y is down)
                    if (!this.pGrounded) { //if it isn't grounded yet, it must be colliding with the ground for the first time, so summon particles
                        for (let i = 0; i < 5 * Main_1.default.particleMultiplier; i++) {
                            Main_1.default.particles.push(new ColorParticle_1.ColorParticle("#cafafc", 1 / 8 + Math.random() / 8, 20, this.x + this.width * Math.random(), this.y + this.height, 0.2 * (Math.random() - 0.5), 0.2 * -Math.random()));
                        }
                    }
                }
                else {
                    for (let i = 0; i < 5 * Main_1.default.particleMultiplier; i++) { //ceiling collision particles
                        Main_1.default.particles.push(new ColorParticle_1.ColorParticle("#cafafc", 1 / 8 + Math.random() / 8, 20, this.x + this.width * Math.random(), this.y, 0.2 * (Math.random() - 0.5), 0.2 * -Math.random()));
                    }
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
            for (let i = Math.floor(Main_1.default.min(this.x, this.x + this.slideX)); i < Math.ceil(Main_1.default.max(this.x, this.x + this.slideX) + this.width); i++) {
                for (let j = Math.floor(Main_1.default.min(this.y, this.y + this.slideY)); j <
                    Math.ceil(Main_1.default.max(this.y, this.y + this.slideY) + this.height); j++) {
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
function randomlyToInt(f) {
    if (Math.random() > f - Math.floor(f)) {
        return (Math.floor(f));
    }
    return (Math.ceil(f));
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


/***/ }),

/***/ "./webpage/src/world/particles/ColorParticle.ts":
/*!******************************************************!*\
  !*** ./webpage/src/world/particles/ColorParticle.ts ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ColorParticle = void 0;
const Main_1 = __importDefault(__webpack_require__(/*! ../../Main */ "./webpage/src/Main.ts"));
class ColorParticle {
    constructor(color, size, lifespan, x, y, xVel, yVel, gravity) {
        this.color = color;
        this.x = x;
        this.y = y;
        this.xVel = xVel || 0;
        this.yVel = yVel || 0;
        this.size = size;
        this.gravity = true; //using the or modifier with booleans causes bugs; there's probably a better way to do this
        if (gravity !== undefined)
            this.gravity = gravity;
        this.age = 0;
        this.lifespan = lifespan;
    }
    render(target, upscaleSize) {
        if (this.age / this.lifespan < 0.8) { //if it's under 80% of the particle's lifespan, draw normally without fade
            target.fill(this.color);
        }
        else { //this means that the particle is almost going to be deleted, so fading is necessary
            if (this.color.length === 7) { //if there is no transparency by default, just map the things
                let transparencyString = Math.round(255 * (-5 * (this.age / this.lifespan) + 5)).toString(16).substring(0, 2);
                if (transparencyString === undefined || transparencyString.length === undefined) //catch what could be an infinite loop or just an error
                    throw new Error(`undefined transparency string on particle`);
                while (transparencyString.length < 2) { //make sure it's 2 characters long; this stops the computer from interpreting #ff ff ff 5 as #ff ff ff 55 instead of #ff ff ff 05
                    transparencyString = "0" + transparencyString;
                }
                target.fill(this.color.substring(0, 7) + transparencyString);
            }
            else { //if there is transparency, multiply
                let transparencyString = Math.round(parseInt(this.color.substring(7, 9), 16) * (-5 * (this.age / this.lifespan) + 5)).toString(16).substring(0, 2);
                if (transparencyString === undefined || transparencyString.length === undefined) //catch what could be an infinite loop or just an error
                    throw new Error(`undefined transparency string on particle`);
                while (transparencyString.length < 2) { //make sure it's 2 characters long; this stops the computer from interpreting #ff ff ff 5 as #ff ff ff 55 instead of #ff ff ff 05
                    transparencyString = "0" + transparencyString;
                }
                target.fill(this.color.substring(0, 7) + transparencyString);
            }
        }
        //draw a rectangle centered on the x and y position filled with the color of the object
        target.rect((-this.size / 2 + this.x * Main_1.default.TILE_WIDTH -
            Main_1.default.interpolatedCamX * Main_1.default.TILE_WIDTH) *
            upscaleSize, (-this.size / 2 + this.y * Main_1.default.TILE_HEIGHT -
            Main_1.default.interpolatedCamY * Main_1.default.TILE_HEIGHT) *
            upscaleSize, this.size * upscaleSize * Main_1.default.TILE_WIDTH, this.size * upscaleSize * Main_1.default.TILE_HEIGHT);
    }
    tick() {
        this.age++;
        this.x += this.xVel;
        this.y += this.yVel;
        this.xVel -= (Math.abs(this.xVel) * this.xVel * Main_1.default.DRAG_COEFFICIENT * this.size); //assuming constant mass for each particle
        if (this.gravity) {
            this.yVel += Main_1.default.GRAVITY_SPEED;
        }
        this.yVel -= (Math.abs(this.yVel) * this.yVel * Main_1.default.DRAG_COEFFICIENT * this.size);
    }
}
exports.ColorParticle = ColorParticle;


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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R0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFDLEdBQUcsV0FBVyxDQUFDO1FBQ3pELE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxXQUFXLENBQUMsR0FBRyxXQUFXLENBQUM7UUFDekQsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxHQUFHLFdBQVcsQ0FBQztRQUN6RCxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFDLEdBQUcsV0FBVyxDQUFDO1FBRXpELFVBQVU7UUFDVixJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDckYsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzNHLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUMzRyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFakksaUJBQWlCO1FBQ2pCLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM1RyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFbEksaUJBQWlCO1FBQ2pCLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM1RyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FB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QUMsR0FBRyxXQUFXLENBQUM7UUFDekQsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxHQUFHLFdBQVcsQ0FBQztRQUN6RCxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFDLEdBQUcsV0FBVyxDQUFDO1FBQ3pELE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxXQUFXLENBQUMsR0FBRyxXQUFXLENBQUM7UUFFekQsVUFBVTtRQUNWLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNyRixJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDM0csSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzNHLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUVqSSxpQkFBaUI7UUFDakIsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzVHLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUVsSSxpQkFBaUI7UUFDakIsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzVHLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMs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QTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxNQUFNLHFCQUFxQjtXQUMzQjtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBO1dBQ0E7V0FDQTs7Ozs7VUVoREE7VUFDQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL3Nub3dlZF9pbi8uL2FwaS9FbnRpdHkudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vYXBpL1RpbGUudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vd2VicGFnZS9zcmMvR2FtZS50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi93ZWJwYWdlL3NyYy9NYWluLnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3dlYnBhZ2Uvc3JjL2Fzc2V0cy9Bc3NldHMudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vd2VicGFnZS9zcmMvYXNzZXRzL3Jlc291cmNlcy9BdWRpb1Jlc291cmNlLnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3dlYnBhZ2Uvc3JjL2Fzc2V0cy9yZXNvdXJjZXMvQXVkaW9SZXNvdXJjZUdyb3VwLnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3dlYnBhZ2Uvc3JjL2Fzc2V0cy9yZXNvdXJjZXMvRm9udFJlc291cmNlLnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3dlYnBhZ2Uvc3JjL2Fzc2V0cy9yZXNvdXJjZXMvSW1hZ2VSZXNvdXJjZS50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi93ZWJwYWdlL3NyYy9hc3NldHMvcmVzb3VyY2VzL1Jlc291cmNlLnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3dlYnBhZ2Uvc3JjL2Fzc2V0cy9yZXNvdXJjZXMvVGlsZVJlc291cmNlLnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3dlYnBhZ2Uvc3JjL2lucHV0L0NvbnRyb2wudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vd2VicGFnZS9zcmMvdWkvQnV0dG9uLnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3dlYnBhZ2Uvc3JjL3VpL0lucHV0Qm94LnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3dlYnBhZ2Uvc3JjL3VpL1NsaWRlci50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi93ZWJwYWdlL3NyYy91aS9VaUZyYW1lLnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3dlYnBhZ2Uvc3JjL3VpL1VpU2NyZWVuLnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3dlYnBhZ2Uvc3JjL3VpL3NjcmVlbnMvQ29udHJvbHNNZW51LnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3dlYnBhZ2Uvc3JjL3VpL3NjcmVlbnMvTWFpbk1lbnUudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vd2VicGFnZS9zcmMvdWkvc2NyZWVucy9PcHRpb25zTWVudS50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi93ZWJwYWdlL3NyYy91aS9zY3JlZW5zL1BhdXNlTWVudS50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi93ZWJwYWdlL3NyYy91aS9zY3JlZW5zL1ZpZGVvU2V0dGluZ3NNZW51LnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3dlYnBhZ2Uvc3JjL3VpL3NjcmVlbnMvV29ybGRDcmVhdGlvbk1lbnUudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vd2VicGFnZS9zcmMvdWkvc2NyZWVucy9Xb3JsZE9wdGlvbnNNZW51LnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3dlYnBhZ2Uvc3JjL3dlYnNvY2tldC9OZXRNYW5hZ2VyLnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3dlYnBhZ2Uvc3JjL3dvcmxkL1dvcmxkLnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3dlYnBhZ2Uvc3JjL3dvcmxkL1dvcmxkVGlsZXMudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vd2VicGFnZS9zcmMvd29ybGQvZW50aXRpZXMvRW50aXR5Q2xhc3Nlcy50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi93ZWJwYWdlL3NyYy93b3JsZC9lbnRpdGllcy9QbGF5ZXJFbnRpdHkudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vd2VicGFnZS9zcmMvd29ybGQvZW50aXRpZXMvUGxheWVyTG9jYWwudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vd2VicGFnZS9zcmMvd29ybGQvZW50aXRpZXMvU2VydmVyRW50aXR5LnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3dlYnBhZ2Uvc3JjL3dvcmxkL3BhcnRpY2xlcy9Db2xvclBhcnRpY2xlLnRzIiwid2VicGFjazovL3Nub3dlZF9pbi93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vd2VicGFjay9ydW50aW1lL2NodW5rIGxvYWRlZCIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3Nub3dlZF9pbi93ZWJwYWNrL3J1bnRpbWUvZ2xvYmFsIiwid2VicGFjazovL3Nub3dlZF9pbi93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3Nub3dlZF9pbi93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3Nub3dlZF9pbi93ZWJwYWNrL3J1bnRpbWUvanNvbnAgY2h1bmsgbG9hZGluZyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL3Nub3dlZF9pbi93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW52ZW50b3J5UGF5bG9hZCB9IGZyb20gJy4vSW52ZW50b3J5JztcclxuXHJcbmV4cG9ydCBlbnVtIEVudGl0aWVzIHtcclxuICAgIExvY2FsUGxheWVyLFxyXG4gICAgUGxheWVyLFxyXG4gICAgSXRlbVxyXG59XHJcblxyXG50eXBlIERhdGFQYWlyczxULCBLIGV4dGVuZHMga2V5b2YgVCA9IGtleW9mIFQ+ID1cclxuICAgIEsgZXh0ZW5kcyBrZXlvZiBUXHJcbiAgICAgICAgPyB7IHR5cGU6IEssIGRhdGE6IFRbS10gfVxyXG4gICAgICAgIDogbmV2ZXI7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEVudGl0aWVzRGF0YSB7XHJcbiAgICBbRW50aXRpZXMuTG9jYWxQbGF5ZXJdOiB7bmFtZTogc3RyaW5nLCB4OiBudW1iZXIsIHk6IG51bWJlciwgaW52ZW50b3J5OiBJbnZlbnRvcnlQYXlsb2FkfVxyXG4gICAgW0VudGl0aWVzLlBsYXllcl06IHtuYW1lOiBzdHJpbmd9O1xyXG4gICAgW0VudGl0aWVzLkl0ZW1dOiB7ZGF0ZUNyZWF0ZWQ6IHN0cmluZ307XHJcbn1cclxuXHJcbmV4cG9ydCB0eXBlIEVudGl0eURhdGE8VCBleHRlbmRzIEVudGl0aWVzID0ga2V5b2YgRW50aXRpZXNEYXRhPiA9IERhdGFQYWlyczxFbnRpdGllc0RhdGEsIFQ+XHJcblxyXG5leHBvcnQgdHlwZSBFbnRpdHlQYXlsb2FkPFQgZXh0ZW5kcyBFbnRpdGllcyA9IGtleW9mIEVudGl0aWVzRGF0YT4gPSBFbnRpdHlEYXRhPFQ+ICYge2lkOiBzdHJpbmd9IiwiZXhwb3J0IGVudW0gVGlsZVR5cGUge1xyXG4gICAgQWlyLFxyXG4gICAgU25vdyxcclxuICAgIEljZSxcclxufSIsImltcG9ydCBwNSwgeyBTaGFkZXIgfSBmcm9tICdwNSdcclxuXHJcbmltcG9ydCBXb3JsZCBmcm9tICcuL3dvcmxkL1dvcmxkJztcclxuXHJcbmltcG9ydCB7XHJcbiAgICBBdWRpb0Fzc2V0cyxcclxuICAgIEZvbnRzLFxyXG4gICAgSXRlbXNBc3NldHMsXHJcbiAgICBsb2FkQXNzZXRzLFxyXG4gICAgUGxheWVyQW5pbWF0aW9ucyxcclxuICAgIFVpQXNzZXRzLFxyXG4gICAgV29ybGRBc3NldHMsXHJcbn0gZnJvbSAnLi9hc3NldHMvQXNzZXRzJztcclxuaW1wb3J0IHsgTWFpbk1lbnUgfSBmcm9tICcuL3VpL3NjcmVlbnMvTWFpbk1lbnUnO1xyXG5pbXBvcnQgeyBTb2NrZXQgfSBmcm9tICdzb2NrZXQuaW8tY2xpZW50JztcclxuaW1wb3J0IFVpU2NyZWVuIGZyb20gJy4vdWkvVWlTY3JlZW4nO1xyXG5pbXBvcnQgeyBQYXVzZU1lbnUgfSBmcm9tICcuL3VpL3NjcmVlbnMvUGF1c2VNZW51JztcclxuaW1wb3J0IHsgTmV0TWFuYWdlciB9IGZyb20gJy4vd2Vic29ja2V0L05ldE1hbmFnZXInO1xyXG5cclxuaW1wb3J0IHsgQ2xpZW50RXZlbnRzLCBTZXJ2ZXJFdmVudHMgfSBmcm9tICcuLi8uLi9hcGkvQVBJJztcclxuaW1wb3J0IEl0ZW1TdGFjayBmcm9tICcuL3dvcmxkL2l0ZW1zL0l0ZW1TdGFjayc7XHJcbmltcG9ydCB7IENvbnRyb2wgfSBmcm9tICcuL2lucHV0L0NvbnRyb2wnO1xyXG5pbXBvcnQgeyBDb2xvclBhcnRpY2xlIH0gZnJvbSAnLi93b3JsZC9wYXJ0aWNsZXMvQ29sb3JQYXJ0aWNsZSc7XHJcblxyXG4vKlxyXG4vLy9JTkZPUk1BVElPTlxyXG4vL1N0YXJ0aW5nIGEgZ2FtZVxyXG5QcmVzcyBMaXZlIFNlcnZlciB0byBzdGFydCB0aGUgZ2FtZVxyXG5vclxyXG5UeXBlIG5wbSBydW4gcHJlc3RhcnQgdG8gc3RhcnQgdGhlIGdhbWUuXHJcbi8vVE9ET1xyXG5XaGVuIHNvbWV0aGluZyBpbiB0aGUgdG9kbyBzZWN0aW9uLCBlaXRoZXIgZGVsZXRlIGl0IGFuZCBtYXJrIHdoYXQgd2FzIGRvbmUgaW4gdGhlIGRlc2NyaXB0aW9uIC1cclxuLSB3aGVuIHB1c2hpbmcsIG9yIGp1c3QgbWFyayBpdCBsaWtlIHRoaXNcclxuKGV4YW1wbGU6IENyZWF0ZSBhIG51Y2xlYXIgZXhwbG9zaW9uIC0tIFgpXHJcbi8vL0dFTkVSQUwgVE9ETzpcclxuXHJcbi8vQXVkaW9cclxuc291bmRzXHJcbm11c2ljXHJcbk5QQydzXHJcblxyXG4vL1Zpc3VhbFxyXG5VcGRhdGUgc25vdyB0ZXh0dXJlc1xyXG5VcGRhdGUgR1VJIHRleHR1cmVzXHJcbnBsYXllciBjaGFyYWN0ZXJcclxuaXRlbSBsb3JlIGltcGxlbWVudGVkXHJcblxyXG4vL0dhbWVwbGF5XHJcbmZpbmlzaCBpdGVtIG1hbmFnZW1lbnRcclxucGF1c2UgbWVudVxyXG5IdW5nZXIsIGhlYXQsIGV0YyBzeXN0ZW1cclxuaXRlbSBjcmVhdGlvblxyXG5pdGVtIHVzZVxyXG5QYXJlbnQgV29ya2JlbmNoXHJcblxyXG4vL09iamVjdHNcclxuZGlydFxyXG5zdG9uZVxyXG53b3JrYmVuY2hcclxuYmFja3BhY2sgKHVzZWQgYXMgY2hlc3QpXHJcblxyXG4vL1BvbGlzaFxyXG5iZXR0ZXIgd29ybGQgZ2VuZXJhdGlvblxyXG5mb250IGNvbnNpc3RlbmN5XHJcbmZpeCBjdXJzb3IgaW5wdXQgbGFnIChzZXBhcmF0ZSBjdXJzb3IgYW5kIGFuaW1hdGlvbiBpbWFnZXMpXHJcbmZpeCBzdHVjayBvbiBzaWRlIG9mIGJsb2NrIGJ1Z1xyXG5maXggY29sbGlkZSB3aXRoIHNpZGVzIG9mIG1hcCBidWdcclxuXHJcbml0ZW0gbWFuYWdlbWVudCBiZWhhdmlvciB0b2RvOlxyXG5tZXJnZVxyXG5yaWdodCBjbGljayBzdGFjayB0byBwaWNrIHVwIGNlaWwoaGFsZiBvZiBpdClcclxucmlnaHQgY2xpY2sgd2hlbiBwaWNrZWQgdXAgdG8gYWRkIDEgaWYgMCBvciBtYXRjaFxyXG5jcmFmdGFibGVzXHJcblxyXG4qL1xyXG5cclxuY2xhc3MgR2FtZSBleHRlbmRzIHA1IHtcclxuICAgIHdvcmxkV2lkdGg6IG51bWJlciA9IDUxMjsgLy8gd2lkdGggb2YgdGhlIHdvcmxkIGluIHRpbGVzICAgPCE+IE1BS0UgU1VSRSBUSElTIElTIE5FVkVSIExFU1MgVEhBTiA2NCEhISA8IT5cclxuICAgIHdvcmxkSGVpZ2h0OiBudW1iZXIgPSA2NDsgLy8gaGVpZ2h0IG9mIHRoZSB3b3JsZCBpbiB0aWxlcyAgPCE+IE1BS0UgU1VSRSBUSElTIElTIE5FVkVSIExFU1MgVEhBTiA2NCEhISA8IT5cclxuXHJcbiAgICBUSUxFX1dJRFRIOiBudW1iZXIgPSA4OyAvLyB3aWR0aCBvZiBhIHRpbGVzIGluIHBpeGVsc1xyXG4gICAgVElMRV9IRUlHSFQ6IG51bWJlciA9IDg7IC8vIGhlaWdodCBvZiBhIHRpbGVzIGluIHBpeGVsc1xyXG4gICAgQkFDS19USUxFX1dJRFRIOiBudW1iZXIgPSAxMjsgLy8gd2lkdGggb2YgYSB0aWxlcyBpbiBwaXhlbHNcclxuICAgIEJBQ0tfVElMRV9IRUlHSFQ6IG51bWJlciA9IDEyOyAvLyBoZWlnaHQgb2YgYSB0aWxlcyBpbiBwaXhlbHNcclxuXHJcbiAgICB1cHNjYWxlU2l6ZTogbnVtYmVyID0gNjsgLy8gbnVtYmVyIG9mIHNjcmVlbiBwaXhlbHMgcGVyIHRleHR1cmUgcGl4ZWxzICh0aGluayBvZiB0aGlzIGFzIGh1ZCBzY2FsZSBpbiBNaW5lY3JhZnQpXHJcblxyXG4gICAgY2FtWDogbnVtYmVyID0gMDsgLy8gcG9zaXRpb24gb2YgdGhlIHRvcCBsZWZ0IGNvcm5lciBvZiB0aGUgc2NyZWVuIGluIHVuLXVwLXNjYWxlZCBwaXhlbHMgKDAgaXMgbGVmdCBvZiB3b3JsZCkgKHdvcmxkV2lkdGgqVElMRV9XSURUSCBpcyBib3R0b20gb2Ygd29ybGQpXHJcbiAgICBjYW1ZOiBudW1iZXIgPSAwOyAvLyBwb3NpdGlvbiBvZiB0aGUgdG9wIGxlZnQgY29ybmVyIG9mIHRoZSBzY3JlZW4gaW4gdW4tdXAtc2NhbGVkIHBpeGVscyAoMCBpcyB0b3Agb2Ygd29ybGQpICh3b3JsZEhlaWdodCpUSUxFX0hFSUdIVCBpcyBib3R0b20gb2Ygd29ybGQpXHJcbiAgICBwQ2FtWDogbnVtYmVyID0gMDsgLy8gbGFzdCBmcmFtZSdzIHggb2YgdGhlIGNhbWVyYVxyXG4gICAgcENhbVk6IG51bWJlciA9IDA7IC8vIGxhc3QgZnJhbWUncyB5IG9mIHRoZSBjYW1lcmFcclxuICAgIGludGVycG9sYXRlZENhbVg6IG51bWJlciA9IDA7IC8vIGludGVycG9sYXRlZCBwb3NpdGlvbiBvZiB0aGUgY2FtZXJhXHJcbiAgICBpbnRlcnBvbGF0ZWRDYW1ZOiBudW1iZXIgPSAwOyAvLyBpbnRlcnBvbGF0ZWQgcG9zaXRpb24gb2YgdGhlIGNhbWVyYVxyXG5cclxuICAgIC8vIHRpY2sgbWFuYWdlbWVudFxyXG4gICAgbXNTaW5jZVRpY2s6IG51bWJlciA9IDA7IC8vIHRoaXMgaXMgdGhlIHJ1bm5pbmcgY291bnRlciBvZiBob3cgbWFueSBtaWxsaXNlY29uZHMgaXQgaGFzIGJlZW4gc2luY2UgdGhlIGxhc3QgdGljay4gIFRoZSBnYW1lIGNhbiB0aGVuXHJcbiAgICBtc1BlclRpY2s6IG51bWJlciA9IDIwOyAvLyB0aGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBwZXIgZ2FtZSB0aWNrLiAgMTAwMC9tc1BlclRpY2sgPSB0aWNrcyBwZXIgc2Vjb25kXHJcbiAgICBhbW91bnRTaW5jZUxhc3RUaWNrOiBudW1iZXIgPSAwOyAvLyB0aGlzIGlzIGEgdmFyaWFibGUgY2FsY3VsYXRlZCBldmVyeSBmcmFtZSB1c2VkIGZvciBpbnRlcnBvbGF0aW9uIC0gZG9tYWluWzAsMSlcclxuICAgIGZvcmdpdmVuZXNzQ291bnQ6IG51bWJlciA9IDUwOyAvLyBpZiB0aGUgY29tcHV0ZXIgbmVlZHMgdG8gZG8gbW9yZSB0aGFuIDUwIHRpY2tzIGluIGEgc2luZ2xlIGZyYW1lLCB0aGVuIGl0IGNvdWxkIGJlIHJ1bm5pbmcgYmVoaW5kLCBwcm9iYWJseSBiZWNhdXNlIG9mIGEgZnJlZXplIG9yIHRoZSB1c2VyIGJlaW5nIG9uIGEgZGlmZmVyZW50IHRhYi4gIEluIHRoZXNlIGNhc2VzLCBpdCdzIHByb2JhYmx5IGJlc3QgdG8ganVzdCBpZ25vcmUgdGhhdCBhbnkgdGltZSBoYXMgcGFzc2VkIHRvIGF2b2lkIGZ1cnRoZXIgZnJlZXppbmdcclxuXHJcbiAgICAvLyBwaHlzaWNzIGNvbnN0YW50c1xyXG4gICAgR1JBVklUWV9TUEVFRDogbnVtYmVyID0gMC4wNDsgLy8gaW4gdW5pdHMgcGVyIHNlY29uZCB0aWNrLCBwb3NpdGl2ZSBtZWFucyBkb3dud2FyZCBncmF2aXR5LCBuZWdhdGl2ZSBtZWFucyB1cHdhcmQgZ3Jhdml0eVxyXG4gICAgRFJBR19DT0VGRklDSUVOVDogbnVtYmVyID0gMC4yMTsgLy8gYXJiaXRyYXJ5IG51bWJlciwgMCBtZWFucyBubyBkcmFnXHJcblxyXG4gICAgLy8gQ0hBUkFDVEVSIFNIT1VMRCBCRSBST1VHSExZIDEyIFBJWEVMUyBCWSAyMCBQSVhFTFNcclxuXHJcbiAgICBob3RCYXI6IEl0ZW1TdGFja1tdID0gbmV3IEFycmF5KDkpO1xyXG4gICAgc2VsZWN0ZWRTbG90ID0gMDtcclxuICAgIHBpY2tlZFVwU2xvdCA9IC0xO1xyXG5cclxuICAgIHdvcmxkTW91c2VYID0gMDsgLy8gdGhlIG1vdXNlIHBvc2l0aW9uIGluIHdvcmxkIGNvb3JkaW5hdGVzXHJcbiAgICB3b3JsZE1vdXNlWSA9IDA7IC8vIHRoZSBtb3VzZSBwb3NpdGlvbiBpbiB3b3JsZCBjb29yZGluYXRlc1xyXG4gICAgbW91c2VPbiA9IHRydWU7IC8vIGlzIHRoZSBtb3VzZSBvbiB0aGUgd2luZG93P1xyXG5cclxuICAgIGtleXM6IGJvb2xlYW5bXSA9IFtdO1xyXG5cclxuICAgIC8vIHRoZSBrZXljb2RlIGZvciB0aGUga2V5IHRoYXQgZG9lcyB0aGUgYWN0aW9uXHJcbiAgICBjb250cm9sczogQ29udHJvbFtdID0gW1xyXG4gICAgICAgIG5ldyBDb250cm9sKFwiV2FsayBSaWdodFwiLCB0cnVlLCA2OCwgKCk9PntcclxuICAgICAgICAgICAgaWYodGhpcy5jdXJyZW50VWkhPT11bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMud29ybGQucGxheWVyLnJpZ2h0QnV0dG9uID0gdHJ1ZTtcclxuICAgICAgICB9LCAoKT0+e1xyXG4gICAgICAgICAgICBpZih0aGlzLmN1cnJlbnRVaSE9PXVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy53b3JsZC5wbGF5ZXIucmlnaHRCdXR0b24gPSBmYWxzZTtcclxuICAgICAgICB9KSwvLyByaWdodFxyXG4gICAgICAgIG5ldyBDb250cm9sKFwiV2FsayBMZWZ0XCIsIHRydWUsIDY1LCAoKT0+e1xyXG4gICAgICAgICAgICBpZih0aGlzLmN1cnJlbnRVaSE9PXVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy53b3JsZC5wbGF5ZXIubGVmdEJ1dHRvbiA9IHRydWU7XHJcbiAgICAgICAgfSwgKCk9PntcclxuICAgICAgICAgICAgaWYodGhpcy5jdXJyZW50VWkhPT11bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMud29ybGQucGxheWVyLmxlZnRCdXR0b24gPSBmYWxzZTtcclxuICAgICAgICB9KSwvLyBsZWZ0XHJcbiAgICAgICAgbmV3IENvbnRyb2woXCJKdW1wXCIsIHRydWUsIDg3LCAoKT0+e1xyXG4gICAgICAgICAgICBpZih0aGlzLmN1cnJlbnRVaSE9PXVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy53b3JsZC5wbGF5ZXIuanVtcEJ1dHRvbiA9IHRydWU7XHJcbiAgICAgICAgfSwgKCk9PntcclxuICAgICAgICAgICAgaWYodGhpcy5jdXJyZW50VWkhPT11bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMud29ybGQucGxheWVyLmp1bXBCdXR0b24gPSBmYWxzZTtcclxuICAgICAgICB9KSwvLyBqdW1wXHJcbiAgICAgICAgbmV3IENvbnRyb2woXCJQYXVzZVwiLCB0cnVlLCAyNywgKCk9PntcclxuICAgICAgICAgICAgLy9pZiBpbnZlbnRvcnkgb3BlbntcclxuICAgICAgICAgICAgLy9jbG9zZSBpbnZlbnRvcnlcclxuICAgICAgICAgICAgLy9yZXR1cm47fVxyXG4gICAgICAgICAgICBpZih0aGlzLmN1cnJlbnRVaT09PXVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFVpID0gbmV3IFBhdXNlTWVudShGb250cy50aXRsZSk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFVpID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIH0pLC8vIHNldHRpbmdzXHJcbiAgICAgICAgbmV3IENvbnRyb2woXCJJbnZlbnRvcnlcIiwgdHJ1ZSwgNjksICgpPT57XHJcbiAgICAgICAgICAgIC8vaWYgdWkgb3BlbiByZXR1cm47XHJcbiAgICAgICAgICAgIC8vaWYgaW52ZW50b3J5IGNsb3NlZCBvcGVuIGludmVudG9yeVxyXG4gICAgICAgICAgICAvL2Vsc2UgY2xvc2UgaW52ZW50b3J5XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaW52ZW50b3J5IGhhcyBub3QgYmVlbiBpbXBsZW1lbnRlZCB5ZXRcIik7XHJcbiAgICAgICAgfSksLy8gaW52ZW50b3J5XHJcbiAgICAgICAgbmV3IENvbnRyb2woXCJIb3RiYXIgMVwiLCB0cnVlLCA0OSwgKCk9PntcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZFNsb3QgPSAwO1xyXG4gICAgICAgIH0pLC8vIGhvdCBiYXIgMVxyXG4gICAgICAgIG5ldyBDb250cm9sKFwiSG90YmFyIDJcIiwgdHJ1ZSwgNDksICgpPT57XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRTbG90ID0gMTtcclxuICAgICAgICB9KSwvLyBob3QgYmFyIDJcclxuICAgICAgICBuZXcgQ29udHJvbChcIkhvdGJhciAzXCIsIHRydWUsIDQ5LCAoKT0+e1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkU2xvdCA9IDI7XHJcbiAgICAgICAgfSksLy8gaG90IGJhciAzXHJcbiAgICAgICAgbmV3IENvbnRyb2woXCJIb3RiYXIgNFwiLCB0cnVlLCA0OSwgKCk9PntcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZFNsb3QgPSAzO1xyXG4gICAgICAgIH0pLC8vIGhvdCBiYXIgNFxyXG4gICAgICAgIG5ldyBDb250cm9sKFwiSG90YmFyIDVcIiwgdHJ1ZSwgNDksICgpPT57XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRTbG90ID0gNDtcclxuICAgICAgICB9KSwvLyBob3QgYmFyIDVcclxuICAgICAgICBuZXcgQ29udHJvbChcIkhvdGJhciA2XCIsIHRydWUsIDQ5LCAoKT0+e1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkU2xvdCA9IDU7XHJcbiAgICAgICAgfSksLy8gaG90IGJhciA2XHJcbiAgICAgICAgbmV3IENvbnRyb2woXCJIb3RiYXIgN1wiLCB0cnVlLCA0OSwgKCk9PntcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZFNsb3QgPSA2O1xyXG4gICAgICAgIH0pLC8vIGhvdCBiYXIgN1xyXG4gICAgICAgIG5ldyBDb250cm9sKFwiSG90YmFyIDhcIiwgdHJ1ZSwgNDksICgpPT57XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRTbG90ID0gNztcclxuICAgICAgICB9KSwvLyBob3QgYmFyIDhcclxuICAgICAgICBuZXcgQ29udHJvbChcIkhvdGJhciA5XCIsIHRydWUsIDQ5LCAoKT0+e1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkU2xvdCA9IDg7XHJcbiAgICAgICAgfSksLy8gaG90IGJhciA5XHJcbiAgICBdO1xyXG5cclxuICAgIGNhbnZhczogcDUuUmVuZGVyZXI7Ly90aGUgY2FudmFzIGZvciB0aGUgZ2FtZVxyXG4gICAgc2t5TGF5ZXI6IHA1LkdyYXBoaWNzOy8vYSBwNS5HcmFwaGljcyBvYmplY3QgdGhhdCB0aGUgc2hhZGVyIGlzIGRyYXduIG9udG8uICB0aGlzIGlzbid0IHRoZSBiZXN0IHdheSB0byBkbyB0aGlzLCBidXQgdGhlIG1haW4gZ2FtZSBjYW52YXMgaXNuJ3QgV0VCR0wsIGFuZCBpdCdzIHRvbyBtdWNoIHdvcmsgdG8gY2hhbmdlIHRoYXRcclxuICAgIHNreVNoYWRlcjogcDUuU2hhZGVyOy8vdGhlIHNoYWRlciB0aGF0IGRyYXdzIHRoZSBza3kgKHRoZSBwYXRoIGZvciB0aGlzIGlzIGluIHRoZSBwdWJsaWMgZm9sZGVyKVxyXG5cclxuICAgIHdvcmxkOiBXb3JsZDtcclxuXHJcbiAgICBjdXJyZW50VWk6IFVpU2NyZWVuIHwgdW5kZWZpbmVkO1xyXG5cclxuICAgIGNvbm5lY3Rpb246IFNvY2tldDxTZXJ2ZXJFdmVudHMsIENsaWVudEV2ZW50cz5cclxuXHJcbiAgICBuZXRNYW5hZ2VyOiBOZXRNYW5hZ2VyXHJcblxyXG4gICAgLy9jaGFuZ2VhYmxlIG9wdGlvbnMgZnJvbSBtZW51c1xyXG4gICAgc2VydmVyVmlzaWJpbGl0eTogc3RyaW5nO1xyXG4gICAgd29ybGRCdW1waW5lc3M6IG51bWJlcjtcclxuICAgIHNreU1vZDogbnVtYmVyO1xyXG4gICAgc2t5VG9nZ2xlOiBib29sZWFuO1xyXG4gICAgcGFydGljbGVNdWx0aXBsaWVyOiBudW1iZXI7XHJcblxyXG4gICAgcGFydGljbGVzOiAoQ29sb3JQYXJ0aWNsZS8qfEZvb3RzdGVwUGFydGljbGUqLylbXTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihjb25uZWN0aW9uOiBTb2NrZXQpIHtcclxuICAgICAgICBzdXBlcigoKSA9PiB7fSk7IC8vIFRvIGNyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiBwNSBpdCB3aWxsIGNhbGwgYmFjayB3aXRoIHRoZSBpbnN0YW5jZS4gV2UgZG9uJ3QgbmVlZCB0aGlzIHNpbmNlIHdlIGFyZSBleHRlbmRpbmcgdGhlIGNsYXNzXHJcbiAgICAgICAgdGhpcy5jb25uZWN0aW9uID0gY29ubmVjdGlvbjtcclxuXHJcbiAgICAgICAgLy8gSW5pdGlhbGlzZSB0aGUgbmV0d29yayBtYW5hZ2VyXHJcbiAgICAgICAgdGhpcy5uZXRNYW5hZ2VyID0gbmV3IE5ldE1hbmFnZXIodGhpcylcclxuICAgIH1cclxuXHJcbiAgICBwcmVsb2FkKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdMb2FkaW5nIGFzc2V0cycpO1xyXG4gICAgICAgIGxvYWRBc3NldHModGhpcywgVWlBc3NldHMsIEl0ZW1zQXNzZXRzLCBXb3JsZEFzc2V0cywgRm9udHMsIEF1ZGlvQXNzZXRzLCBQbGF5ZXJBbmltYXRpb25zKTtcclxuICAgICAgICBjb25zb2xlLmxvZygnQXNzZXQgbG9hZGluZyBjb21wbGV0ZWQnKTtcclxuICAgICAgICB0aGlzLnNreVNoYWRlciA9IHRoaXMubG9hZFNoYWRlcihcImFzc2V0cy9zaGFkZXJzL2Jhc2ljLnZlcnRcIiwgXCJhc3NldHMvc2hhZGVycy9za3kuZnJhZ1wiKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXR1cCgpIHtcclxuICAgICAgICAvLyBtYWtlIGEgY2FudmFzIHRoYXQgZmlsbHMgdGhlIHdob2xlIHNjcmVlbiAoYSBjYW52YXMgaXMgd2hhdCBpcyBkcmF3biB0byBpbiBwNS5qcywgYXMgd2VsbCBhcyBsb3RzIG9mIG90aGVyIEpTIHJlbmRlcmluZyBsaWJyYXJpZXMpXHJcbiAgICAgICAgdGhpcy5jYW52YXMgPSB0aGlzLmNyZWF0ZUNhbnZhcyh0aGlzLndpbmRvd1dpZHRoLCB0aGlzLndpbmRvd0hlaWdodCk7XHJcbiAgICAgICAgdGhpcy5jYW52YXMubW91c2VPdXQodGhpcy5tb3VzZUV4aXRlZCk7XHJcbiAgICAgICAgdGhpcy5jYW52YXMubW91c2VPdmVyKHRoaXMubW91c2VFbnRlcmVkKTtcclxuXHJcbiAgICAgICAgdGhpcy5za3lMYXllciA9IHRoaXMuY3JlYXRlR3JhcGhpY3ModGhpcy53aWR0aCwgdGhpcy5oZWlnaHQsIFwid2ViZ2xcIik7XHJcblxyXG4gICAgICAgIHRoaXMuY3VycmVudFVpID0gbmV3IE1haW5NZW51KEZvbnRzLnRpdGxlKTtcclxuXHJcbiAgICAgICAgLy8gVGlja1xyXG4gICAgICAgIHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMud29ybGQgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLndvcmxkLnRpY2sodGhpcyk7XHJcbiAgICAgICAgfSwgMTAwMCAvIHRoaXMubmV0TWFuYWdlci5wbGF5ZXJUaWNrUmF0ZSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5jb25uZWN0aW9uLmVtaXQoXHJcbiAgICAgICAgICAgICdqb2luJyxcclxuICAgICAgICAgICAgJ2U0MDIyZDQwM2RjYzZkMTlkNmE2OGJhM2FiZmQwYTYwJyxcclxuICAgICAgICAgICAgJ3BsYXllcicgKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDAwKVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIC8vIGdvIGZvciBhIHNjYWxlIG9mIDw2NCB0aWxlcyB3aWRlIHNjcmVlblxyXG4gICAgICAgIHRoaXMud2luZG93UmVzaXplZCgpO1xyXG5cclxuICAgICAgICAvLyByZW1vdmUgdGV4dHVyZSBpbnRlcnBvbGF0aW9uXHJcbiAgICAgICAgdGhpcy5ub1Ntb290aCgpO1xyXG5cclxuICAgICAgICAvLyB0aGUgaGlnaGVzdCBrZXljb2RlIGlzIDI1NSwgd2hpY2ggaXMgXCJUb2dnbGUgVG91Y2hwYWRcIiwgYWNjb3JkaW5nIHRvIGtleWNvZGUuaW5mb1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMjU1OyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5rZXlzLnB1c2goZmFsc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gc2V0IHRoZSBmcmFtZXJhdGUgZ29hbCB0byBhcyBoaWdoIGFzIHBvc3NpYmxlICh0aGlzIHdpbGwgZW5kIHVwIGNhcHBpbmcgdG8geW91ciBtb25pdG9yJ3MgcmVmcmVzaCByYXRlIHdpdGggdnN5bmMuKVxyXG4gICAgICAgIHRoaXMuZnJhbWVSYXRlKEluZmluaXR5KTtcclxuICAgICAgICBBdWRpb0Fzc2V0cy5tdXNpYy50aXRsZVNjcmVlbi5wbGF5U291bmQoKTtcclxuICAgICAgICB0aGlzLnBhcnRpY2xlTXVsdGlwbGllciA9IDE7XHJcbiAgICAgICAgdGhpcy5za3lUb2dnbGUgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuc2t5TW9kID0gMjtcclxuICAgICAgICB0aGlzLnBhcnRpY2xlcyA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIGRyYXcoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZnJhbWVDb3VudD09PTIpIHtcclxuICAgICAgICAgICAgdGhpcy5za3lTaGFkZXIuc2V0VW5pZm9ybShcInNjcmVlbkRpbWVuc2lvbnNcIiwgW3RoaXMuc2t5TGF5ZXIud2lkdGgvdGhpcy51cHNjYWxlU2l6ZSwgdGhpcy5za3lMYXllci5oZWlnaHQvdGhpcy51cHNjYWxlU2l6ZV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBkbyB0aGUgdGljayBjYWxjdWxhdGlvbnNcclxuICAgICAgICB0aGlzLmRvVGlja3MoKTtcclxuXHJcblxyXG5cclxuICAgICAgICAvLyB1cGRhdGUgbW91c2UgcG9zaXRpb25cclxuICAgICAgICB0aGlzLnVwZGF0ZU1vdXNlKCk7XHJcblxyXG4gICAgICAgIC8vIHVwZGF0ZSB0aGUgY2FtZXJhJ3MgaW50ZXJwb2xhdGlvblxyXG4gICAgICAgIHRoaXMubW92ZUNhbWVyYSgpO1xyXG5cclxuICAgICAgICAvLyB3aXBlIHRoZSBzY3JlZW4gd2l0aCBhIGhhcHB5IGxpdHRsZSBsYXllciBvZiBsaWdodCBibHVlXHJcbiAgICAgICAgdGhpcy5za3lTaGFkZXIuc2V0VW5pZm9ybShcIm9mZnNldENvb3Jkc1wiLCBbdGhpcy5pbnRlcnBvbGF0ZWRDYW1YLCB0aGlzLmludGVycG9sYXRlZENhbVldKTtcclxuXHQgICAgdGhpcy5za3lTaGFkZXIuc2V0VW5pZm9ybShcIm1pbGxpc1wiLCB0aGlzLm1pbGxpcygpKTtcclxuICAgICAgICB0aGlzLnNreUxheWVyLnNoYWRlcih0aGlzLnNreVNoYWRlcik7XHJcbiAgICAgICAgLy8gdGhpcy5maWxsKDI1NSwgMCwgMCk7XHJcbiAgICAgICAgdGhpcy5za3lMYXllci5yZWN0KDAsIDAsIHRoaXMuc2t5TGF5ZXIud2lkdGgsIHRoaXMuc2t5TGF5ZXIuaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgdGhpcy5pbWFnZSh0aGlzLnNreUxheWVyLCAwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLndvcmxkICE9PSB1bmRlZmluZWQpIHRoaXMud29ybGQucmVuZGVyKHRoaXMsIHRoaXMudXBzY2FsZVNpemUpO1xyXG5cclxuICAgICAgICAvLyByZW5kZXIgdGhlIHBsYXllciwgYWxsIGl0ZW1zLCBldGMuICBCYXNpY2FsbHkgYW55IHBoeXNpY3NSZWN0IG9yIHBhcnRpY2xlXHJcbiAgICAgICAgdGhpcy5yZW5kZXJFbnRpdGllcygpO1xyXG5cclxuICAgICAgICAvLyBkcmF3IHRoZSBob3QgYmFyXHJcbiAgICAgICAgdGhpcy5ub1N0cm9rZSgpO1xyXG4gICAgICAgIHRoaXMudGV4dEFsaWduKHRoaXMuUklHSFQsIHRoaXMuQk9UVE9NKTtcclxuICAgICAgICB0aGlzLnRleHRTaXplKDUgKiB0aGlzLnVwc2NhbGVTaXplKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaG90QmFyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnNlbGVjdGVkU2xvdCA9PT0gaSkge1xyXG4gICAgICAgICAgICAgICAgVWlBc3NldHMudWlfc2xvdF9zZWxlY3RlZC5yZW5kZXIoXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcyxcclxuICAgICAgICAgICAgICAgICAgICAyICogdGhpcy51cHNjYWxlU2l6ZSArIDE2ICogaSAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgICAgICAgICAgMiAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgICAgICAgICAgMTYgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICAgICAgICAgIDE2ICogdGhpcy51cHNjYWxlU2l6ZVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIFVpQXNzZXRzLnVpX3Nsb3QucmVuZGVyKFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMsXHJcbiAgICAgICAgICAgICAgICAgICAgMiAqIHRoaXMudXBzY2FsZVNpemUgKyAxNiAqIGkgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICAgICAgICAgIDIgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICAgICAgICAgIDE2ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICAxNiAqIHRoaXMudXBzY2FsZVNpemVcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmhvdEJhcltpXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpbGwoMCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5waWNrZWRVcFNsb3QgPT09IGkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRpbnQoMjU1LCAxMjcpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmlsbCgwLCAxMjcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuaG90QmFyW2ldLnRleHR1cmUucmVuZGVyKFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMsXHJcbiAgICAgICAgICAgICAgICAgICAgNiAqIHRoaXMudXBzY2FsZVNpemUgKyAxNiAqIGkgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICAgICAgICAgIDYgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICAgICAgICAgIDggKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICAgICAgICAgIDggKiB0aGlzLnVwc2NhbGVTaXplXHJcbiAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMudGV4dChcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhvdEJhcltpXS5zdGFja1NpemUsXHJcbiAgICAgICAgICAgICAgICAgICAgMTYgKiB0aGlzLnVwc2NhbGVTaXplICsgMTYgKiBpICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICAxNiAqIHRoaXMudXBzY2FsZVNpemVcclxuICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5ub1RpbnQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gZHJhdyB0aGUgY3Vyc29yXHJcbiAgICAgICAgdGhpcy5kcmF3Q3Vyc29yKCk7XHJcblxyXG4gICAgICAgIC8vZGVsZXRlIGFueSBwYXJ0aWNsZXMgdGhhdCBoYXZlIGdvdHRlbiB0b28gb2xkXHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaTx0aGlzLnBhcnRpY2xlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZXNbaV0uYWdlPnRoaXMucGFydGljbGVzW2ldLmxpZmVzcGFuKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBhcnRpY2xlcy5zcGxpY2UoaSwgMSlcclxuICAgICAgICAgICAgICAgIGktLTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9ubyBvdXRsaW5lIG9uIHBhcnRpY2xlc1xyXG4gICAgICAgIHRoaXMubm9TdHJva2UoKTtcclxuICAgICAgICAvL2RyYXcgYWxsIG9mIHRoZSBwYXJ0aWNsZXNcclxuICAgICAgICBmb3IobGV0IHBhcnRpY2xlIG9mIHRoaXMucGFydGljbGVzKSB7XHJcbiAgICAgICAgICAgIHBhcnRpY2xlLnJlbmRlcih0aGlzLCB0aGlzLnVwc2NhbGVTaXplKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKHRoaXMuY3VycmVudFVpICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFVpLnJlbmRlcih0aGlzLCB0aGlzLnVwc2NhbGVTaXplKTtcclxuXHJcbiAgICAgICAgLy8gY29uc29sZS50aW1lRW5kKFwiZnJhbWVcIik7XHJcbiAgICB9XHJcblxyXG4gICAgd2luZG93UmVzaXplZCgpIHtcclxuICAgICAgICB0aGlzLnJlc2l6ZUNhbnZhcyh0aGlzLndpbmRvd1dpZHRoLCB0aGlzLndpbmRvd0hlaWdodCk7XHJcbiAgICAgICAgdGhpcy5za3lTaGFkZXIuc2V0VW5pZm9ybShcInNjcmVlbkRpbWVuc2lvbnNcIiwgW3RoaXMud2luZG93V2lkdGgvdGhpcy51cHNjYWxlU2l6ZSwgdGhpcy53aW5kb3dIZWlnaHQvdGhpcy51cHNjYWxlU2l6ZV0pO1xyXG5cclxuICAgICAgICAvLyBnbyBmb3IgYSBzY2FsZSBvZiA8NDggdGlsZXMgc2NyZWVuXHJcbiAgICAgICAgdGhpcy51cHNjYWxlU2l6ZSA9IE1hdGgubWluKFxyXG4gICAgICAgICAgICB0aGlzLmNlaWwodGhpcy53aW5kb3dXaWR0aCAvIDQ4IC8gdGhpcy5USUxFX1dJRFRIKSxcclxuICAgICAgICAgICAgdGhpcy5jZWlsKHRoaXMud2luZG93SGVpZ2h0IC8gNDggLyB0aGlzLlRJTEVfSEVJR0hUKVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHRoaXMuY3VycmVudFVpLndpbmRvd1VwZGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGtleVByZXNzZWQoZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcclxuICAgICAgICB0aGlzLmtleXNbdGhpcy5rZXlDb2RlXSA9IHRydWU7XHJcbiAgICAgICAgZm9yKGxldCBjb250cm9sIG9mIHRoaXMuY29udHJvbHMpIHtcclxuICAgICAgICAgICAgaWYoY29udHJvbC5rZXlib2FyZCAmJiBjb250cm9sLmtleUNvZGU9PT1ldmVudC5rZXlDb2RlKS8vZXZlbnQua2V5Q29kZSBpcyBkZXByZWNhdGVkIGJ1dCBpIGRvbid0IGNhcmVcclxuICAgICAgICAgICAgICAgIGNvbnRyb2wub25QcmVzc2VkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGtleVJlbGVhc2VkKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5rZXlzW3RoaXMua2V5Q29kZV0gPSBmYWxzZTtcclxuICAgICAgICBmb3IobGV0IGNvbnRyb2wgb2YgdGhpcy5jb250cm9scykge1xyXG4gICAgICAgICAgICBpZihjb250cm9sLmtleWJvYXJkICYmIGNvbnRyb2wua2V5Q29kZT09PWV2ZW50LmtleUNvZGUpLy9ldmVudC5rZXlDb2RlIGlzIGRlcHJlY2F0ZWQgYnV0IGkgZG9uJ3QgY2FyZVxyXG4gICAgICAgICAgICAgICAgY29udHJvbC5vblJlbGVhc2VkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIHdoZW4gaXQncyBkcmFnZ2VkIHVwZGF0ZSB0aGUgc2xpZGVyc1xyXG4gICAgbW91c2VEcmFnZ2VkKCkge1xyXG4gICAgICAgIGlmKHRoaXMuY3VycmVudFVpICE9PSB1bmRlZmluZWQgJiYgdGhpcy5jdXJyZW50VWkuc2xpZGVycyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGZvcihjb25zdCBpIG9mIHRoaXMuY3VycmVudFVpLnNsaWRlcnMpIHtcclxuICAgICAgICAgICAgICAgIGkudXBkYXRlU2xpZGVyUG9zaXRpb24odGhpcy5tb3VzZVgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG1vdXNlTW92ZWQoKSB7XHJcbiAgICAgICAgaWYodGhpcy5jdXJyZW50VWkgIT09IHVuZGVmaW5lZCAmJiB0aGlzLmN1cnJlbnRVaS5idXR0b25zICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgZm9yKGNvbnN0IGkgb2YgdGhpcy5jdXJyZW50VWkuYnV0dG9ucykge1xyXG4gICAgICAgICAgICAgICAgaS51cGRhdGVNb3VzZU92ZXIodGhpcy5tb3VzZVgsIHRoaXMubW91c2VZKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBtb3VzZVByZXNzZWQoZTogTW91c2VFdmVudCkge1xyXG4gICAgICAgIC8vIGltYWdlKHVpU2xvdEltYWdlLCAyKnVwc2NhbGVTaXplKzE2KmkqdXBzY2FsZVNpemUsIDIqdXBzY2FsZVNpemUsIDE2KnVwc2NhbGVTaXplLCAxNip1cHNjYWxlU2l6ZSk7XHJcbiAgICAgICAgaWYodGhpcy5jdXJyZW50VWkgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRVaS5tb3VzZVByZXNzZWQoZS5idXR0b24pO1xyXG4gICAgICAgICAgICByZXR1cm47Ly8gYXNqZ3NhZGtqZmdJSVNVU1VFVUVcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICB0aGlzLm1vdXNlWCA+IDIgKiB0aGlzLnVwc2NhbGVTaXplICYmXHJcbiAgICAgICAgICAgIHRoaXMubW91c2VYIDxcclxuICAgICAgICAgICAgICAgIDIgKiB0aGlzLnVwc2NhbGVTaXplICtcclxuICAgICAgICAgICAgICAgICAgICAxNiAqIHRoaXMudXBzY2FsZVNpemUgKiB0aGlzLmhvdEJhci5sZW5ndGggJiZcclxuICAgICAgICAgICAgdGhpcy5tb3VzZVkgPiAyICogdGhpcy51cHNjYWxlU2l6ZSAmJlxyXG4gICAgICAgICAgICB0aGlzLm1vdXNlWSA8IDE4ICogdGhpcy51cHNjYWxlU2l6ZVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICBjb25zdCBjbGlja2VkU2xvdDogbnVtYmVyID0gdGhpcy5mbG9vcihcclxuICAgICAgICAgICAgICAgICh0aGlzLm1vdXNlWCAtIDIgKiB0aGlzLnVwc2NhbGVTaXplKSAvIDE2IC8gdGhpcy51cHNjYWxlU2l6ZVxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMucGlja2VkVXBTbG90ID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaG90QmFyW2NsaWNrZWRTbG90XSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5waWNrZWRVcFNsb3QgPSBjbGlja2VkU2xvdDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIFN3YXAgY2xpY2tlZCBzbG90IHdpdGggdGhlIHBpY2tlZCBzbG90XHJcbiAgICAgICAgICAgICAgICBbdGhpcy5ob3RCYXJbdGhpcy5waWNrZWRVcFNsb3RdLCB0aGlzLmhvdEJhcltjbGlja2VkU2xvdF1dID0gW1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaG90QmFyW2NsaWNrZWRTbG90XSxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhvdEJhclt0aGlzLnBpY2tlZFVwU2xvdF0sXHJcbiAgICAgICAgICAgICAgICBdO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFNldCB0aGUgcGlja2VkIHVwIHNsb3QgdG8gbm90aGluZ1xyXG4gICAgICAgICAgICAgICAgdGhpcy5waWNrZWRVcFNsb3QgPSAtMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIElmIHRoZSB0aWxlcyBpcyBhaXJcclxuICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgdGhpcy53b3JsZC53b3JsZFRpbGVzW1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMud29ybGQud2lkdGggKiB0aGlzLndvcmxkTW91c2VZICsgdGhpcy53b3JsZE1vdXNlWFxyXG4gICAgICAgICAgICAgICAgXSA9PT0gMFxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNvbm5lY3Rpb24uZW1pdChcclxuICAgICAgICAgICAgICAgICd3b3JsZEJyZWFrU3RhcnQnLFxyXG4gICAgICAgICAgICAgICAgdGhpcy53b3JsZC53aWR0aCAqIHRoaXMud29ybGRNb3VzZVkgKyB0aGlzLndvcmxkTW91c2VYXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIHRoaXMuY29ubmVjdGlvbi5lbWl0KCd3b3JsZEJyZWFrRmluaXNoJyk7XHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgIGNvbnN0IHRpbGVzOiBUaWxlID1cclxuICAgICAgICAgICAgICAgIFdvcmxkVGlsZXNbXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53b3JsZC53b3JsZFRpbGVzW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLldPUkxEX1dJRFRIICogdGhpcy53b3JsZE1vdXNlWSArIHRoaXMud29ybGRNb3VzZVhcclxuICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICBdO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRpbGVzID09PSB1bmRlZmluZWQpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aWxlcy5pdGVtRHJvcCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBEZWZhdWx0IGRyb3AgcXVhbnRpdHlcclxuICAgICAgICAgICAgICAgIGxldCBxdWFudGl0eTogbnVtYmVyID0gMTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBVcGRhdGUgdGhlIHF1YW50aXR5IGJhc2VkIG9uXHJcbiAgICAgICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICAgICAgdGlsZXMuaXRlbURyb3BNYXggIT09IHVuZGVmaW5lZCAmJlxyXG4gICAgICAgICAgICAgICAgICAgIHRpbGVzLml0ZW1Ecm9wTWluICE9PSB1bmRlZmluZWRcclxuICAgICAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHF1YW50aXR5ID0gTWF0aC5yb3VuZChcclxuICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5yYW5kb20oKSAqICh0aWxlcy5pdGVtRHJvcE1heCAtIHRpbGVzLml0ZW1Ecm9wTWluKSArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aWxlcy5pdGVtRHJvcE1pblxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRpbGVzLml0ZW1Ecm9wTWF4ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBxdWFudGl0eSA9IHRpbGVzLml0ZW1Ecm9wTWF4O1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZHJvcEl0ZW1TdGFjayhcclxuICAgICAgICAgICAgICAgICAgICBuZXcgSXRlbVN0YWNrKHRpbGVzLml0ZW1Ecm9wLCBxdWFudGl0eSksXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53b3JsZE1vdXNlWCxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLndvcmxkTW91c2VZXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG5cclxuXHJcbiAgICAgICAgICAgICovXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG1vdXNlUmVsZWFzZWQoKSB7XHJcbiAgICAgICAgaWYodGhpcy5jdXJyZW50VWkgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRVaS5tb3VzZVJlbGVhc2VkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHJlbGVhc2VkU2xvdDogbnVtYmVyID0gdGhpcy5mbG9vcihcclxuICAgICAgICAgICAgKHRoaXMubW91c2VYIC0gMiAqIHRoaXMudXBzY2FsZVNpemUpIC8gMTYgLyB0aGlzLnVwc2NhbGVTaXplXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMucGlja2VkVXBTbG90ICE9PSAtMSkge1xyXG4gICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vdXNlWCA+IDIgKiB0aGlzLnVwc2NhbGVTaXplICYmXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vdXNlWCA8XHJcbiAgICAgICAgICAgICAgICAgICAgMiAqIHRoaXMudXBzY2FsZVNpemUgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAxNiAqIHRoaXMudXBzY2FsZVNpemUgKiB0aGlzLmhvdEJhci5sZW5ndGggJiZcclxuICAgICAgICAgICAgICAgIHRoaXMubW91c2VZID4gMiAqIHRoaXMudXBzY2FsZVNpemUgJiZcclxuICAgICAgICAgICAgICAgIHRoaXMubW91c2VZIDwgMTggKiB0aGlzLnVwc2NhbGVTaXplXHJcbiAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgLy8gTWFrZSBzdXJlIHRoYXQgdGhlIHNsb3QgdGhhdCB0aGUgY3Vyc29yIHdhcyByZWxlYXNlZCB3YXMgbm90IHRoZSBzbG90IHRoYXQgd2FzIHNlbGVjdGVkXHJcbiAgICAgICAgICAgICAgICBpZiAocmVsZWFzZWRTbG90ID09PSB0aGlzLnBpY2tlZFVwU2xvdCkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFN3YXAgdGhlIHBpY2tlZCB1cCBzbG90IHdpdGggdGhlIHNsb3QgdGhlIG1vdXNlIHdhcyByZWxlYXNlZCBvblxyXG4gICAgICAgICAgICAgICAgW3RoaXMuaG90QmFyW3RoaXMucGlja2VkVXBTbG90XSwgdGhpcy5ob3RCYXJbcmVsZWFzZWRTbG90XV0gPSBbXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ob3RCYXJbcmVsZWFzZWRTbG90XSxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhvdEJhclt0aGlzLnBpY2tlZFVwU2xvdF0sXHJcbiAgICAgICAgICAgICAgICBdO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMucGlja2VkVXBTbG90ID0gLTE7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhvdEJhclt0aGlzLnBpY2tlZFVwU2xvdF0gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBpY2tlZFVwU2xvdCA9IC0xO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG1vdmVDYW1lcmEoKSB7XHJcbiAgICAgICAgdGhpcy5pbnRlcnBvbGF0ZWRDYW1YID1cclxuICAgICAgICAgICAgdGhpcy5wQ2FtWCArICh0aGlzLmNhbVggLSB0aGlzLnBDYW1YKSAqIHRoaXMuYW1vdW50U2luY2VMYXN0VGljaztcclxuICAgICAgICB0aGlzLmludGVycG9sYXRlZENhbVkgPVxyXG4gICAgICAgICAgICB0aGlzLnBDYW1ZICsgKHRoaXMuY2FtWSAtIHRoaXMucENhbVkpICogdGhpcy5hbW91bnRTaW5jZUxhc3RUaWNrO1xyXG4gICAgfVxyXG5cclxuICAgIGRvVGlja3MoKSB7XHJcbiAgICAgICAgLy8gaW5jcmVhc2UgdGhlIHRpbWUgc2luY2UgYSB0aWNrIGhhcyBoYXBwZW5lZCBieSBkZWx0YVRpbWUsIHdoaWNoIGlzIGEgYnVpbHQtaW4gcDUuanMgdmFsdWVcclxuICAgICAgICB0aGlzLm1zU2luY2VUaWNrICs9IHRoaXMuZGVsdGFUaW1lO1xyXG5cclxuICAgICAgICAvLyBkZWZpbmUgYSB0ZW1wb3JhcnkgdmFyaWFibGUgY2FsbGVkIHRpY2tzVGhpc0ZyYW1lIC0gdGhpcyBpcyB1c2VkIHRvIGtlZXAgdHJhY2sgb2YgaG93IG1hbnkgdGlja3MgaGF2ZSBiZWVuIGNhbGN1bGF0ZWQgd2l0aGluIHRoZSBkdXJhdGlvbiBvZiB0aGUgY3VycmVudCBmcmFtZS4gIEFzIGxvbmcgYXMgdGhpcyB2YWx1ZSBpcyBsZXNzIHRoYW4gdGhlIGZvcmdpdmVuZXNzQ291bnQgdmFyaWFibGUsIGl0IGNvbnRpbnVlcyB0byBjYWxjdWxhdGUgdGlja3MgYXMgbmVjZXNzYXJ5LlxyXG4gICAgICAgIGxldCB0aWNrc1RoaXNGcmFtZSA9IDA7XHJcbiAgICAgICAgd2hpbGUgKFxyXG4gICAgICAgICAgICB0aGlzLm1zU2luY2VUaWNrID4gdGhpcy5tc1BlclRpY2sgJiZcclxuICAgICAgICAgICAgdGlja3NUaGlzRnJhbWUgIT09IHRoaXMuZm9yZ2l2ZW5lc3NDb3VudFxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLnRpbWUoXCJ0aWNrXCIpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy53b3JsZCAhPT0gdW5kZWZpbmVkKSB0aGlzLmRvVGljaygpO1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLnRpbWVFbmQoXCJ0aWNrXCIpO1xyXG4gICAgICAgICAgICB0aGlzLm1zU2luY2VUaWNrIC09IHRoaXMubXNQZXJUaWNrO1xyXG4gICAgICAgICAgICB0aWNrc1RoaXNGcmFtZSsrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGlja3NUaGlzRnJhbWUgPT09IHRoaXMuZm9yZ2l2ZW5lc3NDb3VudCkge1xyXG4gICAgICAgICAgICB0aGlzLm1zU2luY2VUaWNrID0gMDtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKFxyXG4gICAgICAgICAgICAgICAgXCJsYWcgc3Bpa2UgZGV0ZWN0ZWQsIHRpY2sgY2FsY3VsYXRpb25zIGNvdWxkbid0IGtlZXAgdXBcIlxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmFtb3VudFNpbmNlTGFzdFRpY2sgPSB0aGlzLm1zU2luY2VUaWNrIC8gdGhpcy5tc1BlclRpY2s7XHJcbiAgICB9XHJcblxyXG4gICAgZG9UaWNrKCkge1xyXG4gICAgICAgIGZvcihsZXQgcGFydGljbGUgb2YgdGhpcy5wYXJ0aWNsZXMpIHtcclxuICAgICAgICAgICAgcGFydGljbGUudGljaygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLndvcmxkLnBsYXllciA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICB0aGlzLndvcmxkLnBsYXllci5rZXlib2FyZElucHV0KCk7XHJcbiAgICAgICAgdGhpcy53b3JsZC5wbGF5ZXIuYXBwbHlHcmF2aXR5QW5kRHJhZygpO1xyXG4gICAgICAgIHRoaXMud29ybGQucGxheWVyLmFwcGx5VmVsb2NpdHlBbmRDb2xsaWRlKCk7XHJcblxyXG4gICAgICAgIHRoaXMucENhbVggPSB0aGlzLmNhbVg7XHJcbiAgICAgICAgdGhpcy5wQ2FtWSA9IHRoaXMuY2FtWTtcclxuICAgICAgICBjb25zdCBkZXNpcmVkQ2FtWCA9XHJcbiAgICAgICAgICAgIHRoaXMud29ybGQucGxheWVyLnggK1xyXG4gICAgICAgICAgICB0aGlzLndvcmxkLnBsYXllci53aWR0aCAvIDIgLVxyXG4gICAgICAgICAgICB0aGlzLndpZHRoIC8gMiAvIHRoaXMuVElMRV9XSURUSCAvIHRoaXMudXBzY2FsZVNpemUgK1xyXG4gICAgICAgICAgICB0aGlzLndvcmxkLnBsYXllci54VmVsICogNDA7XHJcbiAgICAgICAgY29uc3QgZGVzaXJlZENhbVkgPVxyXG4gICAgICAgICAgICB0aGlzLndvcmxkLnBsYXllci55ICtcclxuICAgICAgICAgICAgdGhpcy53b3JsZC5wbGF5ZXIuaGVpZ2h0IC8gMiAtXHJcbiAgICAgICAgICAgIHRoaXMuaGVpZ2h0IC8gMiAvIHRoaXMuVElMRV9IRUlHSFQgLyB0aGlzLnVwc2NhbGVTaXplICtcclxuICAgICAgICAgICAgdGhpcy53b3JsZC5wbGF5ZXIueVZlbCAqIDIwO1xyXG4gICAgICAgIHRoaXMuY2FtWCA9IChkZXNpcmVkQ2FtWCArIHRoaXMuY2FtWCAqIDI0KSAvIDI1O1xyXG4gICAgICAgIHRoaXMuY2FtWSA9IChkZXNpcmVkQ2FtWSArIHRoaXMuY2FtWSAqIDI0KSAvIDI1O1xyXG5cclxuICAgICAgICBpZiAodGhpcy5jYW1YIDwgMCkge1xyXG4gICAgICAgICAgICB0aGlzLmNhbVggPSAwO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoXHJcbiAgICAgICAgICAgIHRoaXMuY2FtWCA+XHJcbiAgICAgICAgICAgIHRoaXMud29ybGRXaWR0aCAtIHRoaXMud2lkdGggLyB0aGlzLnVwc2NhbGVTaXplIC8gdGhpcy5USUxFX1dJRFRIXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2FtWCA9XHJcbiAgICAgICAgICAgICAgICB0aGlzLndvcmxkV2lkdGggLVxyXG4gICAgICAgICAgICAgICAgdGhpcy53aWR0aCAvIHRoaXMudXBzY2FsZVNpemUgLyB0aGlzLlRJTEVfV0lEVEg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChcclxuICAgICAgICAgICAgdGhpcy5jYW1ZID5cclxuICAgICAgICAgICAgdGhpcy53b3JsZEhlaWdodCAtXHJcbiAgICAgICAgICAgICAgICB0aGlzLmhlaWdodCAvIHRoaXMudXBzY2FsZVNpemUgLyB0aGlzLlRJTEVfSEVJR0hUXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2FtWSA9XHJcbiAgICAgICAgICAgICAgICB0aGlzLndvcmxkSGVpZ2h0IC1cclxuICAgICAgICAgICAgICAgIHRoaXMuaGVpZ2h0IC8gdGhpcy51cHNjYWxlU2l6ZSAvIHRoaXMuVElMRV9IRUlHSFQ7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgLy8gZm9yIChjb25zdCBpdGVtIG9mIHRoaXMuaXRlbXMpIHtcclxuICAgICAgICAvLyAgICAgaXRlbS5nb1Rvd2FyZHNQbGF5ZXIoKTtcclxuICAgICAgICAvLyAgICAgaXRlbS5jb21iaW5lV2l0aE5lYXJJdGVtcygpO1xyXG4gICAgICAgIC8vICAgICBpdGVtLmFwcGx5R3Jhdml0eUFuZERyYWcoKTtcclxuICAgICAgICAvLyAgICAgaXRlbS5hcHBseVZlbG9jaXR5QW5kQ29sbGlkZSgpO1xyXG4gICAgICAgIC8vIH1cclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5pdGVtcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIC8vICAgICBpZiAodGhpcy5pdGVtc1tpXS5kZWxldGVkID09PSB0cnVlKSB7XHJcbiAgICAgICAgLy8gICAgICAgICB0aGlzLml0ZW1zLnNwbGljZShpLCAxKTtcclxuICAgICAgICAvLyAgICAgICAgIGktLTtcclxuICAgICAgICAvLyAgICAgfVxyXG4gICAgICAgIC8vIH1cclxuICAgIH1cclxuXHJcbiAgICB1aUZyYW1lUmVjdCh4OiBudW1iZXIsIHk6IG51bWJlciwgdzogbnVtYmVyLCBoOiBudW1iZXIpIHtcclxuICAgICAgICAvLyBzZXQgdGhlIGNvb3JkcyBhbmQgZGltZW5zaW9ucyB0byByb3VuZCB0byB0aGUgbmVhcmVzdCB1bi11cHNjYWxlZCBwaXhlbFxyXG4gICAgICAgIHggPSB0aGlzLnJvdW5kKHggLyB0aGlzLnVwc2NhbGVTaXplKSAqIHRoaXMudXBzY2FsZVNpemU7XHJcbiAgICAgICAgeSA9IHRoaXMucm91bmQoeSAvIHRoaXMudXBzY2FsZVNpemUpICogdGhpcy51cHNjYWxlU2l6ZTtcclxuICAgICAgICB3ID0gdGhpcy5yb3VuZCh3IC8gdGhpcy51cHNjYWxlU2l6ZSkgKiB0aGlzLnVwc2NhbGVTaXplO1xyXG4gICAgICAgIGggPSB0aGlzLnJvdW5kKGggLyB0aGlzLnVwc2NhbGVTaXplKSAqIHRoaXMudXBzY2FsZVNpemU7XHJcblxyXG4gICAgICAgIC8vIGNvcm5lcnNcclxuICAgICAgICBVaUFzc2V0cy51aV9mcmFtZS5yZW5kZXJQYXJ0aWFsKFxyXG4gICAgICAgICAgICB0aGlzLFxyXG4gICAgICAgICAgICB4LFxyXG4gICAgICAgICAgICB5LFxyXG4gICAgICAgICAgICA3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgNyAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIDcsXHJcbiAgICAgICAgICAgIDdcclxuICAgICAgICApO1xyXG4gICAgICAgIFVpQXNzZXRzLnVpX2ZyYW1lLnJlbmRlclBhcnRpYWwoXHJcbiAgICAgICAgICAgIHRoaXMsXHJcbiAgICAgICAgICAgIHggKyB3IC0gNyAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIHksXHJcbiAgICAgICAgICAgIDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICA3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgOCxcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgNyxcclxuICAgICAgICAgICAgN1xyXG4gICAgICAgICk7XHJcbiAgICAgICAgVWlBc3NldHMudWlfZnJhbWUucmVuZGVyUGFydGlhbChcclxuICAgICAgICAgICAgdGhpcyxcclxuICAgICAgICAgICAgeCxcclxuICAgICAgICAgICAgeSArIGggLSA3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgNyAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICA4LFxyXG4gICAgICAgICAgICA3LFxyXG4gICAgICAgICAgICA3XHJcbiAgICAgICAgKTtcclxuICAgICAgICBVaUFzc2V0cy51aV9mcmFtZS5yZW5kZXJQYXJ0aWFsKFxyXG4gICAgICAgICAgICB0aGlzLFxyXG4gICAgICAgICAgICB4ICsgdyAtIDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICB5ICsgaCAtIDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICA3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgNyAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIDgsXHJcbiAgICAgICAgICAgIDgsXHJcbiAgICAgICAgICAgIDcsXHJcbiAgICAgICAgICAgIDdcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICAvLyB0b3AgYW5kIGJvdHRvbVxyXG4gICAgICAgIFVpQXNzZXRzLnVpX2ZyYW1lLnJlbmRlclBhcnRpYWwoXHJcbiAgICAgICAgICAgIHRoaXMsXHJcbiAgICAgICAgICAgIHggKyA3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgeSxcclxuICAgICAgICAgICAgdyAtIDE0ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgNyAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIDcsXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIDEsXHJcbiAgICAgICAgICAgIDdcclxuICAgICAgICApO1xyXG4gICAgICAgIFVpQXNzZXRzLnVpX2ZyYW1lLnJlbmRlclBhcnRpYWwoXHJcbiAgICAgICAgICAgIHRoaXMsXHJcbiAgICAgICAgICAgIHggKyA3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgeSArIGggLSA3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgdyAtIDE0ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgNyAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIDcsXHJcbiAgICAgICAgICAgIDgsXHJcbiAgICAgICAgICAgIDEsXHJcbiAgICAgICAgICAgIDdcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICAvLyBsZWZ0IGFuZCByaWdodFxyXG4gICAgICAgIFVpQXNzZXRzLnVpX2ZyYW1lLnJlbmRlclBhcnRpYWwoXHJcbiAgICAgICAgICAgIHRoaXMsXHJcbiAgICAgICAgICAgIHgsXHJcbiAgICAgICAgICAgIHkgKyA3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgNyAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIGggLSAxNCAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIDcsXHJcbiAgICAgICAgICAgIDcsXHJcbiAgICAgICAgICAgIDFcclxuICAgICAgICApO1xyXG4gICAgICAgIFVpQXNzZXRzLnVpX2ZyYW1lLnJlbmRlclBhcnRpYWwoXHJcbiAgICAgICAgICAgIHRoaXMsXHJcbiAgICAgICAgICAgIHggKyB3IC0gNyAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIHkgKyA3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgNyAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIGggLSAxNCAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIDgsXHJcbiAgICAgICAgICAgIDcsXHJcbiAgICAgICAgICAgIDcsXHJcbiAgICAgICAgICAgIDFcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICAvLyBjZW50ZXJcclxuICAgICAgICBVaUFzc2V0cy51aV9mcmFtZS5yZW5kZXJQYXJ0aWFsKFxyXG4gICAgICAgICAgICB0aGlzLFxyXG4gICAgICAgICAgICB4ICsgNyAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIHkgKyA3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgdyAtIDE0ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgaCAtIDE0ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgNyxcclxuICAgICAgICAgICAgNyxcclxuICAgICAgICAgICAgMSxcclxuICAgICAgICAgICAgMVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgLyQkJCQkJCQgIC8kJCAgICAgICAgICAgICAgICAgICAgICAgICAgIC8kJFxyXG4gIHwgJCRfXyAgJCR8ICQkICAgICAgICAgICAgICAgICAgICAgICAgICB8X18vXHJcbiAgfCAkJCAgXFwgJCR8ICQkJCQkJCQgIC8kJCAgIC8kJCAgLyQkJCQkJCQgLyQkICAvJCQkJCQkJCAgLyQkJCQkJCQgLyQkXHJcbiAgfCAkJCQkJCQkL3wgJCRfXyAgJCR8ICQkICB8ICQkIC8kJF9fX19fL3wgJCQgLyQkX19fX18vIC8kJF9fX19fL3xfXy9cclxuICB8ICQkX19fXy8gfCAkJCAgXFwgJCR8ICQkICB8ICQkfCAgJCQkJCQkIHwgJCR8ICQkICAgICAgfCAgJCQkJCQkXHJcbiAgfCAkJCAgICAgIHwgJCQgIHwgJCR8ICQkICB8ICQkIFxcX19fXyAgJCR8ICQkfCAkJCAgICAgICBcXF9fX18gICQkIC8kJFxyXG4gIHwgJCQgICAgICB8ICQkICB8ICQkfCAgJCQkJCQkJCAvJCQkJCQkJC98ICQkfCAgJCQkJCQkJCAvJCQkJCQkJC98X18vXHJcbiAgfF9fLyAgICAgIHxfXy8gIHxfXy8gXFxfX19fICAkJHxfX19fX19fLyB8X18vIFxcX19fX19fXy98X19fX19fXy9cclxuICAgICAgICAgICAgICAgICAgICAgICAvJCQgIHwgJCRcclxuICAgICAgICAgICAgICAgICAgICAgIHwgICQkJCQkJC9cclxuICAgICAgICAgICAgICAgICAgICAgICBcXF9fX19fXy9cclxuICAqL1xyXG5cclxuICAgIC8vIHRoaXMgY2xhc3MgaG9sZHMgYW4gYXhpcy1hbGlnbmVkIHJlY3RhbmdsZSBhZmZlY3RlZCBieSBncmF2aXR5LCBkcmFnLCBhbmQgY29sbGlzaW9ucyB3aXRoIHRpbGVzLlxyXG5cclxuICAgIHJlY3RWc1JheShcclxuICAgICAgICByZWN0WD86IGFueSxcclxuICAgICAgICByZWN0WT86IGFueSxcclxuICAgICAgICByZWN0Vz86IGFueSxcclxuICAgICAgICByZWN0SD86IGFueSxcclxuICAgICAgICByYXlYPzogYW55LFxyXG4gICAgICAgIHJheVk/OiBhbnksXHJcbiAgICAgICAgcmF5Vz86IGFueSxcclxuICAgICAgICByYXlIPzogYW55XHJcbiAgICApIHtcclxuICAgICAgICAvLyB0aGlzIHJheSBpcyBhY3R1YWxseSBhIGxpbmUgc2VnbWVudCBtYXRoZW1hdGljYWxseSwgYnV0IGl0J3MgY29tbW9uIHRvIHNlZSBwZW9wbGUgcmVmZXIgdG8gc2ltaWxhciBjaGVja3MgYXMgcmF5LWNhc3RzLCBzbyBmb3IgdGhlIGR1cmF0aW9uIG9mIHRoZSBkZWZpbml0aW9uIG9mIHRoaXMgZnVuY3Rpb24sIHJheSBjYW4gYmUgYXNzdW1lZCB0byBtZWFuIHRoZSBzYW1lIGFzIGxpbmUgc2VnbWVudC5cclxuXHJcbiAgICAgICAgLy8gaWYgdGhlIHJheSBkb2Vzbid0IGhhdmUgYSBsZW5ndGgsIHRoZW4gaXQgY2FuJ3QgaGF2ZSBlbnRlcmVkIHRoZSByZWN0YW5nbGUuICBUaGlzIGFzc3VtZXMgdGhhdCB0aGUgb2JqZWN0cyBkb24ndCBzdGFydCBpbiBjb2xsaXNpb24sIG90aGVyd2lzZSB0aGV5J2xsIGJlaGF2ZSBzdHJhbmdlbHlcclxuICAgICAgICBpZiAocmF5VyA9PT0gMCAmJiByYXlIID09PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGNhbGN1bGF0ZSBob3cgZmFyIGFsb25nIHRoZSByYXkgZWFjaCBzaWRlIG9mIHRoZSByZWN0YW5nbGUgaW50ZXJzZWN0cyB3aXRoIGl0IChlYWNoIHNpZGUgaXMgZXh0ZW5kZWQgb3V0IGluZmluaXRlbHkgaW4gYm90aCBkaXJlY3Rpb25zKVxyXG4gICAgICAgIGNvbnN0IHRvcEludGVyc2VjdGlvbiA9IChyZWN0WSAtIHJheVkpIC8gcmF5SDtcclxuICAgICAgICBjb25zdCBib3R0b21JbnRlcnNlY3Rpb24gPSAocmVjdFkgKyByZWN0SCAtIHJheVkpIC8gcmF5SDtcclxuICAgICAgICBjb25zdCBsZWZ0SW50ZXJzZWN0aW9uID0gKHJlY3RYIC0gcmF5WCkgLyByYXlXO1xyXG4gICAgICAgIGNvbnN0IHJpZ2h0SW50ZXJzZWN0aW9uID0gKHJlY3RYICsgcmVjdFcgLSByYXlYKSAvIHJheVc7XHJcblxyXG4gICAgICAgIGlmIChcclxuICAgICAgICAgICAgaXNOYU4odG9wSW50ZXJzZWN0aW9uKSB8fFxyXG4gICAgICAgICAgICBpc05hTihib3R0b21JbnRlcnNlY3Rpb24pIHx8XHJcbiAgICAgICAgICAgIGlzTmFOKGxlZnRJbnRlcnNlY3Rpb24pIHx8XHJcbiAgICAgICAgICAgIGlzTmFOKHJpZ2h0SW50ZXJzZWN0aW9uKVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICAvLyB5b3UgaGF2ZSB0byB1c2UgdGhlIEpTIGZ1bmN0aW9uIGlzTmFOKCkgdG8gY2hlY2sgaWYgYSB2YWx1ZSBpcyBOYU4gYmVjYXVzZSBib3RoIE5hTj09TmFOIGFuZCBOYU49PT1OYU4gYXJlIGZhbHNlLlxyXG4gICAgICAgICAgICAvLyBpZiBhbnkgb2YgdGhlc2UgdmFsdWVzIGFyZSBOYU4sIG5vIGNvbGxpc2lvbiBoYXMgb2NjdXJyZWRcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gY2FsY3VsYXRlIHRoZSBuZWFyZXN0IGFuZCBmYXJ0aGVzdCBpbnRlcnNlY3Rpb25zIGZvciBib3RoIHggYW5kIHlcclxuICAgICAgICBjb25zdCBuZWFyWCA9IHRoaXMubWluKGxlZnRJbnRlcnNlY3Rpb24sIHJpZ2h0SW50ZXJzZWN0aW9uKTtcclxuICAgICAgICBjb25zdCBmYXJYID0gdGhpcy5tYXgobGVmdEludGVyc2VjdGlvbiwgcmlnaHRJbnRlcnNlY3Rpb24pO1xyXG4gICAgICAgIGNvbnN0IG5lYXJZID0gdGhpcy5taW4odG9wSW50ZXJzZWN0aW9uLCBib3R0b21JbnRlcnNlY3Rpb24pO1xyXG4gICAgICAgIGNvbnN0IGZhclkgPSB0aGlzLm1heCh0b3BJbnRlcnNlY3Rpb24sIGJvdHRvbUludGVyc2VjdGlvbik7XHJcblxyXG4gICAgICAgIGlmIChuZWFyWCA+IGZhclkgfHwgbmVhclkgPiBmYXJYKSB7XHJcbiAgICAgICAgICAgIC8vIHRoaXMgbXVzdCBtZWFuIHRoYXQgdGhlIGxpbmUgdGhhdCBtYWtlcyB1cCB0aGUgbGluZSBzZWdtZW50IGRvZXNuJ3QgcGFzcyB0aHJvdWdoIHRoZSByYXlcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGZhclggPCAwIHx8IGZhclkgPCAwKSB7XHJcbiAgICAgICAgICAgIC8vIHRoZSBpbnRlcnNlY3Rpb24gaXMgaGFwcGVuaW5nIGJlZm9yZSB0aGUgcmF5IHN0YXJ0cywgc28gdGhlIHJheSBpcyBwb2ludGluZyBhd2F5IGZyb20gdGhlIHRyaWFuZ2xlXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGNhbGN1bGF0ZSB3aGVyZSB0aGUgcG90ZW50aWFsIGNvbGxpc2lvbiBjb3VsZCBiZVxyXG4gICAgICAgIGNvbnN0IG5lYXJDb2xsaXNpb25Qb2ludCA9IHRoaXMubWF4KG5lYXJYLCBuZWFyWSk7XHJcblxyXG4gICAgICAgIGlmIChuZWFyWCA+IDEgfHwgbmVhclkgPiAxKSB7XHJcbiAgICAgICAgICAgIC8vIHRoZSBpbnRlcnNlY3Rpb24gaGFwcGVucyBhZnRlciB0aGUgcmF5KGxpbmUgc2VnbWVudCkgZW5kc1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAobmVhclggPT09IG5lYXJDb2xsaXNpb25Qb2ludCkge1xyXG4gICAgICAgICAgICAvLyBpdCBtdXN0IGhhdmUgY29sbGlkZWQgb24gZWl0aGVyIHRoZSBsZWZ0IG9yIHRoZSByaWdodCEgbm93IHdoaWNoP1xyXG4gICAgICAgICAgICBpZiAobGVmdEludGVyc2VjdGlvbiA9PT0gbmVhclgpIHtcclxuICAgICAgICAgICAgICAgIC8vIEl0IG11c3QgaGF2ZSBjb2xsaWRlZCBvbiB0aGUgbGVmdCEgIFJldHVybiB0aGUgY29sbGlzaW9uIG5vcm1hbCBbLTEsIDBdXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gWy0xLCAwLCBuZWFyQ29sbGlzaW9uUG9pbnRdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIElmIGl0IGRpZG4ndCBjb2xsaWRlIG9uIHRoZSBsZWZ0LCBpdCBtdXN0IGhhdmUgY29sbGlkZWQgb24gdGhlIHJpZ2h0LiAgUmV0dXJuIHRoZSBjb2xsaXNpb24gbm9ybWFsIFsxLCAwXVxyXG4gICAgICAgICAgICByZXR1cm4gWzEsIDAsIG5lYXJDb2xsaXNpb25Qb2ludF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIElmIGl0IGRpZG4ndCBjb2xsaWRlIG9uIHRoZSBsZWZ0IG9yIHJpZ2h0LCBpdCBtdXN0IGhhdmUgY29sbGlkZWQgb24gZWl0aGVyIHRoZSB0b3Agb3IgdGhlIGJvdHRvbSEgbm93IHdoaWNoP1xyXG4gICAgICAgIGlmICh0b3BJbnRlcnNlY3Rpb24gPT09IG5lYXJZKSB7XHJcbiAgICAgICAgICAgIC8vIEl0IG11c3QgaGF2ZSBjb2xsaWRlZCBvbiB0aGUgdG9wISAgUmV0dXJuIHRoZSBjb2xsaXNpb24gbm9ybWFsIFswLCAtMV1cclxuICAgICAgICAgICAgcmV0dXJuIFswLCAtMSwgbmVhckNvbGxpc2lvblBvaW50XTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gSWYgaXQgZGlkbid0IGNvbGxpZGUgb24gdGhlIHRvcCwgaXQgbXVzdCBoYXZlIGNvbGxpZGVkIG9uIHRoZSBib3R0b20uICBSZXR1cm4gdGhlIGNvbGxpc2lvbiBub3JtYWwgWzAsIDFdXHJcbiAgICAgICAgcmV0dXJuIFswLCAxLCBuZWFyQ29sbGlzaW9uUG9pbnRdO1xyXG5cclxuICAgICAgICAvLyBvdXRwdXQgaWYgbm8gY29sbGlzaW9uOiBmYWxzZVxyXG4gICAgICAgIC8vIG91dHB1dCBpZiBjb2xsaXNpb246IFtjb2xsaXNpb24gbm9ybWFsIFgsIGNvbGxpc2lvbiBub3JtYWwgWSwgbmVhckNvbGxpc2lvblBvaW50XVxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIC0xIHRvIDEgICAgICAgICAgICAgIC0xIHRvIDEgICAgICAgICAgICAwIHRvIDFcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXJFbnRpdGllcygpIHtcclxuICAgICAgICAvLyBkcmF3IHBsYXllclxyXG4gICAgICAgIC8vIHRoaXMuZmlsbCgyNTUsIDAsIDApO1xyXG4gICAgICAgIC8vIHRoaXMubm9TdHJva2UoKTtcclxuICAgICAgICAvLyB0aGlzLnJlY3QoXHJcbiAgICAgICAgLy8gICAgICh0aGlzLndvcmxkLnBsYXllci5pbnRlcnBvbGF0ZWRYICogdGhpcy5USUxFX1dJRFRIIC1cclxuICAgICAgICAvLyAgICAgICAgIHRoaXMuaW50ZXJwb2xhdGVkQ2FtWCAqIHRoaXMuVElMRV9XSURUSCkgKlxyXG4gICAgICAgIC8vICAgICAgICAgdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAvLyAgICAgKHRoaXMud29ybGQucGxheWVyLmludGVycG9sYXRlZFkgKiB0aGlzLlRJTEVfSEVJR0hUIC1cclxuICAgICAgICAvLyAgICAgICAgIHRoaXMuaW50ZXJwb2xhdGVkQ2FtWSAqIHRoaXMuVElMRV9IRUlHSFQpICpcclxuICAgICAgICAvLyAgICAgICAgIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgLy8gICAgIHRoaXMud29ybGQucGxheWVyLndpZHRoICogdGhpcy51cHNjYWxlU2l6ZSAqIHRoaXMuVElMRV9XSURUSCxcclxuICAgICAgICAvLyAgICAgdGhpcy53b3JsZC5wbGF5ZXIuaGVpZ2h0ICogdGhpcy51cHNjYWxlU2l6ZSAqIHRoaXMuVElMRV9IRUlHSFRcclxuICAgICAgICAvLyApO1xyXG5cclxuXHJcbiAgICAgICAgLy8gZm9yIChjb25zdCBpdGVtIG9mIHRoaXMuaXRlbXMpIHtcclxuICAgICAgICAvLyAgICAgaXRlbS5maW5kSW50ZXJwb2xhdGVkQ29vcmRpbmF0ZXMoKTtcclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vICAgICBpdGVtLml0ZW1TdGFjay50ZXh0dXJlLnJlbmRlcihcclxuICAgICAgICAvLyAgICAgICAgIHRoaXMsXHJcbiAgICAgICAgLy8gICAgICAgICAoaXRlbS5pbnRlcnBvbGF0ZWRYICogdGhpcy5USUxFX1dJRFRIIC1cclxuICAgICAgICAvLyAgICAgICAgICAgICB0aGlzLmludGVycG9sYXRlZENhbVggKiB0aGlzLlRJTEVfV0lEVEgpICpcclxuICAgICAgICAvLyAgICAgICAgICAgICB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgIC8vICAgICAgICAgKGl0ZW0uaW50ZXJwb2xhdGVkWSAqIHRoaXMuVElMRV9IRUlHSFQgLVxyXG4gICAgICAgIC8vICAgICAgICAgICAgIHRoaXMuaW50ZXJwb2xhdGVkQ2FtWSAqIHRoaXMuVElMRV9IRUlHSFQpICpcclxuICAgICAgICAvLyAgICAgICAgICAgICB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgIC8vICAgICAgICAgaXRlbS53ICogdGhpcy51cHNjYWxlU2l6ZSAqIHRoaXMuVElMRV9XSURUSCxcclxuICAgICAgICAvLyAgICAgICAgIGl0ZW0uaCAqIHRoaXMudXBzY2FsZVNpemUgKiB0aGlzLlRJTEVfSEVJR0hUXHJcbiAgICAgICAgLy8gICAgICk7XHJcbiAgICAgICAgLy9cclxuICAgICAgICAvLyAgICAgLy8gUmVuZGVyIHRoZSBpdGVtIHF1YW50aXR5IGxhYmVsXHJcbiAgICAgICAgLy8gICAgIHRoaXMuZmlsbCgwKTtcclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vICAgICB0aGlzLm5vU3Ryb2tlKCk7XHJcbiAgICAgICAgLy9cclxuICAgICAgICAvLyAgICAgdGhpcy50ZXh0QWxpZ24odGhpcy5SSUdIVCwgdGhpcy5CT1RUT00pO1xyXG4gICAgICAgIC8vICAgICB0aGlzLnRleHRTaXplKDUgKiB0aGlzLnVwc2NhbGVTaXplKTtcclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vICAgICB0aGlzLnRleHQoXHJcbiAgICAgICAgLy8gICAgICAgICBpdGVtLml0ZW1TdGFjay5zdGFja1NpemUsXHJcbiAgICAgICAgLy8gICAgICAgICAoaXRlbS5pbnRlcnBvbGF0ZWRYICogdGhpcy5USUxFX1dJRFRIIC1cclxuICAgICAgICAvLyAgICAgICAgICAgICB0aGlzLmludGVycG9sYXRlZENhbVggKiB0aGlzLlRJTEVfV0lEVEgpICpcclxuICAgICAgICAvLyAgICAgICAgICAgICB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgIC8vICAgICAgICAgKGl0ZW0uaW50ZXJwb2xhdGVkWSAqIHRoaXMuVElMRV9IRUlHSFQgLVxyXG4gICAgICAgIC8vICAgICAgICAgICAgIHRoaXMuaW50ZXJwb2xhdGVkQ2FtWSAqIHRoaXMuVElMRV9IRUlHSFQpICpcclxuICAgICAgICAvLyAgICAgICAgICAgICB0aGlzLnVwc2NhbGVTaXplXHJcbiAgICAgICAgLy8gICAgICk7XHJcbiAgICAgICAgLy8gfVxyXG4gICAgfVxyXG5cclxuICAgIHBpY2tVcEl0ZW0oaXRlbVN0YWNrOiBJdGVtU3RhY2spOiBib29sZWFuIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaG90QmFyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLmhvdEJhcltpXTtcclxuXHJcbiAgICAgICAgICAgIC8vIElmIHRoZXJlIGFyZSBubyBpdGVtcyBpbiB0aGUgY3VycmVudCBzbG90IG9mIHRoZSBob3RCYXJcclxuICAgICAgICAgICAgaWYgKGl0ZW0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ob3RCYXJbaV0gPSBpdGVtU3RhY2s7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgaXRlbSA9PT0gaXRlbVN0YWNrICYmXHJcbiAgICAgICAgICAgICAgICBpdGVtLnN0YWNrU2l6ZSA8IGl0ZW0ubWF4U3RhY2tTaXplXHJcbiAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVtYWluaW5nU3BhY2UgPSBpdGVtLm1heFN0YWNrU2l6ZSAtIGl0ZW0uc3RhY2tTaXplO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFRvcCBvZmYgdGhlIHN0YWNrIHdpdGggaXRlbXMgaWYgaXQgY2FuIHRha2UgbW9yZSB0aGFuIHRoZSBzdGFjayBiZWluZyBhZGRlZFxyXG4gICAgICAgICAgICAgICAgaWYgKHJlbWFpbmluZ1NwYWNlID49IGl0ZW1TdGFjay5zdGFja1NpemUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhvdEJhcltpXS5zdGFja1NpemUgPVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtLnN0YWNrU2l6ZSArIGl0ZW1TdGFjay5zdGFja1NpemU7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaXRlbVN0YWNrLnN0YWNrU2l6ZSAtPSByZW1haW5pbmdTcGFjZTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmhvdEJhcltpXS5zdGFja1NpemUgPSBpdGVtU3RhY2subWF4U3RhY2tTaXplO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXHJcbiAgICAgICAgICAgIGBDb3VsZCBub3QgcGlja3VwICR7aXRlbVN0YWNrLnN0YWNrU2l6ZX0gJHtpdGVtU3RhY2submFtZX1gXHJcbiAgICAgICAgKTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgbW91c2VFeGl0ZWQoKSB7XHJcbiAgICAgICAgdGhpcy5tb3VzZU9uID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgbW91c2VFbnRlcmVkKCkge1xyXG4gICAgICAgIHRoaXMubW91c2VPbiA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlTW91c2UoKSB7XHJcbiAgICAgICAgLy8gd29ybGQgbW91c2UgeCBhbmQgeSB2YXJpYWJsZXMgaG9sZCB0aGUgbW91c2UgcG9zaXRpb24gaW4gd29ybGQgdGlsZXMuICAwLCAwIGlzIHRvcCBsZWZ0XHJcbiAgICAgICAgdGhpcy53b3JsZE1vdXNlWCA9IHRoaXMuZmxvb3IoXHJcbiAgICAgICAgICAgICh0aGlzLmludGVycG9sYXRlZENhbVggKiB0aGlzLlRJTEVfV0lEVEggK1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tb3VzZVggLyB0aGlzLnVwc2NhbGVTaXplKSAvXHJcbiAgICAgICAgICAgICAgICB0aGlzLlRJTEVfV0lEVEhcclxuICAgICAgICApO1xyXG4gICAgICAgIHRoaXMud29ybGRNb3VzZVkgPSB0aGlzLmZsb29yKFxyXG4gICAgICAgICAgICAodGhpcy5pbnRlcnBvbGF0ZWRDYW1ZICogdGhpcy5USUxFX0hFSUdIVCArXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vdXNlWSAvIHRoaXMudXBzY2FsZVNpemUpIC9cclxuICAgICAgICAgICAgICAgIHRoaXMuVElMRV9IRUlHSFRcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIGRyYXdDdXJzb3IoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMubW91c2VPbikge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5waWNrZWRVcFNsb3QgPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ob3RCYXJbdGhpcy5waWNrZWRVcFNsb3RdLnRleHR1cmUucmVuZGVyKFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMsXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3VzZVgsXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3VzZVksXHJcbiAgICAgICAgICAgICAgICAgICAgOCAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgICAgICAgICAgOCAqIHRoaXMudXBzY2FsZVNpemVcclxuICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0KFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaG90QmFyW3RoaXMucGlja2VkVXBTbG90XS5zdGFja1NpemUsXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3VzZVggKyAxMCAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3VzZVkgKyAxMCAqIHRoaXMudXBzY2FsZVNpemVcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0ID0gR2FtZVxyXG4iLCJpbXBvcnQgR2FtZSBmcm9tICcuL0dhbWUnO1xyXG5pbXBvcnQgeyBpbyB9IGZyb20gXCJzb2NrZXQuaW8tY2xpZW50XCI7XHJcblxyXG4vLyBDb25uZWN0IHRoZSBzZXJ2ZXJcclxuXHJcbmNvbnN0IGNvbm5lY3Rpb24gPSBpbyh7IGF1dGg6IHsgdG9rZW46IHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndG9rZW4nKSB9IH0pXHJcblxyXG5leHBvcnQgZGVmYXVsdCBuZXcgR2FtZShjb25uZWN0aW9uKTsiLCJpbXBvcnQgVGlsZVJlc291cmNlIGZyb20gJy4vcmVzb3VyY2VzL1RpbGVSZXNvdXJjZSc7XHJcbmltcG9ydCBJbWFnZVJlc291cmNlIGZyb20gJy4vcmVzb3VyY2VzL0ltYWdlUmVzb3VyY2UnO1xyXG5pbXBvcnQgRm9udFJlc291cmNlIGZyb20gJy4vcmVzb3VyY2VzL0ZvbnRSZXNvdXJjZSc7XHJcbmltcG9ydCBSZXNvdXJjZSBmcm9tICcuL3Jlc291cmNlcy9SZXNvdXJjZSc7XHJcbmltcG9ydCBBdWRpb1Jlc291cmNlR3JvdXAgZnJvbSAnLi9yZXNvdXJjZXMvQXVkaW9SZXNvdXJjZUdyb3VwJztcclxuaW1wb3J0IFA1IGZyb20gJ3A1JztcclxuaW1wb3J0IEF1ZGlvUmVzb3VyY2UgZnJvbSAnLi9yZXNvdXJjZXMvQXVkaW9SZXNvdXJjZSc7XHJcblxyXG5pbnRlcmZhY2UgQXNzZXRHcm91cCB7XHJcbiAgICBbbmFtZTogc3RyaW5nXTpcclxuICAgIHwge1xyXG4gICAgICAgIFtuYW1lOiBzdHJpbmddOiBSZXNvdXJjZSB8IEFzc2V0R3JvdXAgfCBBdWRpb1Jlc291cmNlR3JvdXAgfCBBdWRpb1Jlc291cmNlIHwgSW1hZ2VSZXNvdXJjZVtdO1xyXG4gICAgfVxyXG4gICAgfCBSZXNvdXJjZSB8IEFzc2V0R3JvdXAgfCBBdWRpb1Jlc291cmNlR3JvdXAgfCBBdWRpb1Jlc291cmNlIHwgSW1hZ2VSZXNvdXJjZVtdO1xyXG59XHJcblxyXG4vLyBVaSByZWxhdGVkIGFzc2V0c1xyXG5jb25zdCBVaUFzc2V0cyA9IHtcclxuICAgIHVpX3Nsb3Rfc2VsZWN0ZWQ6IG5ldyBJbWFnZVJlc291cmNlKFxyXG4gICAgICAgICdhc3NldHMvdGV4dHVyZXMvdWkvdWlzbG90X3NlbGVjdGVkLnBuZydcclxuICAgICksXHJcbiAgICB1aV9zbG90OiBuZXcgSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3VpL3Vpc2xvdC5wbmcnKSxcclxuICAgIHVpX2ZyYW1lOiBuZXcgSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3VpL3VpZnJhbWUucG5nJyksXHJcbiAgICBidXR0b25fdW5zZWxlY3RlZDogbmV3IEltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy91aS9idXR0b24wLnBuZycpLFxyXG4gICAgYnV0dG9uX3NlbGVjdGVkOiBuZXcgSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3VpL2J1dHRvbjEucG5nJyksXHJcbiAgICBzbGlkZXJfYmFyOiBuZXcgSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3VpL3NsaWRlckJhci5wbmcnKSxcclxuICAgIHNsaWRlcl9oYW5kbGU6IG5ldyBJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvdWkvc2xpZGVySGFuZGxlLnBuZycpLFxyXG4gICAgdGl0bGVfaW1hZ2U6IG5ldyBJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvdWkvc25vd2VkaW5CVU1QLnBuZycpXHJcbn07XHJcblxyXG4vLyBJdGVtIHJlbGF0ZWQgYXNzZXRzXHJcbmNvbnN0IEl0ZW1zQXNzZXRzID0ge1xyXG4gICAgcmVzb3VyY2VzOiB7XHJcbiAgICAgICAgaWNlX3NoYXJkOiBuZXcgSW1hZ2VSZXNvdXJjZShcclxuICAgICAgICAgICAgJ2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9yZXNvdXJjZV9pY2Vfc2hhcmRzLnBuZydcclxuICAgICAgICApLFxyXG4gICAgICAgIHNub3diYWxsOiBuZXcgSW1hZ2VSZXNvdXJjZShcclxuICAgICAgICAgICAgJ2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9yZXNvdXJjZV9zbm93YmFsbC5wbmcnXHJcbiAgICAgICAgKSxcclxuICAgIH0sXHJcbiAgICBjb25zdW1hYmxlczoge1xyXG4gICAgICAgIHNub3dfYmVycmllczogbmV3IEltYWdlUmVzb3VyY2UoXHJcbiAgICAgICAgICAgICdhc3NldHMvdGV4dHVyZXMvaXRlbXMvY29uc3VtYWJsZV9zbm93X2JlcnJpZXMucG5nJ1xyXG4gICAgICAgICksXHJcbiAgICB9LFxyXG4gICAgYmxvY2tzOiB7XHJcbiAgICAgICAgaWNlOiBuZXcgSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL2l0ZW1zL2Jsb2NrX2ljZS5wbmcnKSxcclxuICAgICAgICBzbm93OiBuZXcgSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL2l0ZW1zL2Jsb2NrX3Nub3cucG5nJyksXHJcbiAgICB9LFxyXG4gICAgdG9vbHM6IHt9LFxyXG59O1xyXG5cclxuLy8gV29ybGQgcmVsYXRlZCBhc3NldHNcclxuY29uc3QgV29ybGRBc3NldHMgPSB7XHJcbiAgICBiYWNrZ3JvdW5kOiB7XHJcbiAgICAgICAgc25vdzogbmV3IEltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9iYWNrZ3JvdW5kL3Nub3cucG5nJyksXHJcbiAgICB9LFxyXG4gICAgbWlkZGxlZ3JvdW5kOiB7XHJcbiAgICAgICAgdGlsZXNldF9pY2U6IG5ldyBUaWxlUmVzb3VyY2UoXHJcbiAgICAgICAgICAgICdhc3NldHMvdGV4dHVyZXMvd29ybGQvbWlkZGxlZ3JvdW5kL3RpbGVzZXRfaWNlLnBuZycsXHJcbiAgICAgICAgICAgIDE2LFxyXG4gICAgICAgICAgICAxLFxyXG4gICAgICAgICAgICA4LFxyXG4gICAgICAgICAgICA4XHJcbiAgICAgICAgKSxcclxuICAgICAgICB0aWxlc2V0X3Nub3c6IG5ldyBUaWxlUmVzb3VyY2UoXHJcbiAgICAgICAgICAgICdhc3NldHMvdGV4dHVyZXMvd29ybGQvbWlkZGxlZ3JvdW5kL3RpbGVzZXRfc25vdy5wbmcnLFxyXG4gICAgICAgICAgICAxNixcclxuICAgICAgICAgICAgMSxcclxuICAgICAgICAgICAgOCxcclxuICAgICAgICAgICAgOFxyXG4gICAgICAgICksXHJcbiAgICAgICAgdGlsZXNldF9kaXJ0OiBuZXcgVGlsZVJlc291cmNlKFxyXG4gICAgICAgICAgICAnYXNzZXRzL3RleHR1cmVzL3dvcmxkL21pZGRsZWdyb3VuZC90aWxlc2V0X3Nub3cucG5nJyxcclxuICAgICAgICAgICAgMTYsXHJcbiAgICAgICAgICAgIDEsXHJcbiAgICAgICAgICAgIDgsXHJcbiAgICAgICAgICAgIDhcclxuICAgICAgICApLFxyXG4gICAgfSxcclxuICAgIGZvcmVncm91bmQ6IHtcclxuICAgICAgICB0aWxlc2V0X3BpcGU6IG5ldyBUaWxlUmVzb3VyY2UoXHJcbiAgICAgICAgICAgICdhc3NldHMvdGV4dHVyZXMvd29ybGQvZm9yZWdyb3VuZC90aWxlc2V0X3BpcGUucG5nJyxcclxuICAgICAgICAgICAgMTYsXHJcbiAgICAgICAgICAgIDEsXHJcbiAgICAgICAgICAgIDgsXHJcbiAgICAgICAgICAgIDhcclxuICAgICAgICApLFxyXG4gICAgfSxcclxufTtcclxuXHJcbmNvbnN0IEZvbnRzID0ge1xyXG4gICAgdGl0bGU6IG5ldyBGb250UmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy91aS9mb250LnBuZycsIHtcclxuICAgICAgICBcIjBcIjogNyxcclxuICAgICAgICBcIjFcIjogNyxcclxuICAgICAgICBcIjJcIjogNyxcclxuICAgICAgICBcIjNcIjogNixcclxuICAgICAgICBcIjRcIjogNixcclxuICAgICAgICBcIjVcIjogNixcclxuICAgICAgICBcIjZcIjogNixcclxuICAgICAgICBcIjdcIjogNyxcclxuICAgICAgICBcIjhcIjogNyxcclxuICAgICAgICBcIjlcIjogNixcclxuICAgICAgICBcIkFcIjogNixcclxuICAgICAgICBcIkJcIjogNyxcclxuICAgICAgICBcIkNcIjogNyxcclxuICAgICAgICBcIkRcIjogNixcclxuICAgICAgICBcIkVcIjogNyxcclxuICAgICAgICBcIkZcIjogNixcclxuICAgICAgICBcIkdcIjogNyxcclxuICAgICAgICBcIkhcIjogNyxcclxuICAgICAgICBcIklcIjogNyxcclxuICAgICAgICBcIkpcIjogOCxcclxuICAgICAgICBcIktcIjogNixcclxuICAgICAgICBcIkxcIjogNixcclxuICAgICAgICBcIk1cIjogOCxcclxuICAgICAgICBcIk5cIjogOCxcclxuICAgICAgICBcIk9cIjogOCxcclxuICAgICAgICBcIlBcIjogOSxcclxuICAgICAgICBcIlFcIjogOCxcclxuICAgICAgICBcIlJcIjogNyxcclxuICAgICAgICBcIlNcIjogNyxcclxuICAgICAgICBcIlRcIjogOCxcclxuICAgICAgICBcIlVcIjogOCxcclxuICAgICAgICBcIlZcIjogOCxcclxuICAgICAgICBcIldcIjogMTAsXHJcbiAgICAgICAgXCJYXCI6IDgsXHJcbiAgICAgICAgXCJZXCI6IDgsXHJcbiAgICAgICAgXCJaXCI6IDksXHJcbiAgICAgICAgXCJhXCI6IDcsXHJcbiAgICAgICAgXCJiXCI6IDcsXHJcbiAgICAgICAgXCJjXCI6IDYsXHJcbiAgICAgICAgXCJkXCI6IDcsXHJcbiAgICAgICAgXCJlXCI6IDYsXHJcbiAgICAgICAgXCJmXCI6IDYsXHJcbiAgICAgICAgXCJnXCI6IDYsXHJcbiAgICAgICAgXCJoXCI6IDYsXHJcbiAgICAgICAgXCJpXCI6IDUsXHJcbiAgICAgICAgXCJqXCI6IDYsXHJcbiAgICAgICAgXCJrXCI6IDUsXHJcbiAgICAgICAgXCJsXCI6IDUsXHJcbiAgICAgICAgXCJtXCI6IDgsXHJcbiAgICAgICAgXCJuXCI6IDUsXHJcbiAgICAgICAgXCJvXCI6IDUsXHJcbiAgICAgICAgXCJwXCI6IDUsXHJcbiAgICAgICAgXCJxXCI6IDcsXHJcbiAgICAgICAgXCJyXCI6IDUsXHJcbiAgICAgICAgXCJzXCI6IDQsXHJcbiAgICAgICAgXCJ0XCI6IDUsXHJcbiAgICAgICAgXCJ1XCI6IDUsXHJcbiAgICAgICAgXCJ2XCI6IDUsXHJcbiAgICAgICAgXCJ3XCI6IDcsXHJcbiAgICAgICAgXCJ4XCI6IDYsXHJcbiAgICAgICAgXCJ5XCI6IDUsXHJcbiAgICAgICAgXCJ6XCI6IDUsXHJcbiAgICAgICAgXCIhXCI6IDQsXHJcbiAgICAgICAgXCIuXCI6IDIsXHJcbiAgICAgICAgXCIsXCI6IDIsXHJcbiAgICAgICAgXCI/XCI6IDYsXHJcbiAgICAgICAgXCJfXCI6IDYsXHJcbiAgICAgICAgXCItXCI6IDQsXHJcbiAgICAgICAgXCI6XCI6IDIsXHJcbiAgICAgICAgXCIgXCI6IDJcclxuICAgIH0sIFwiQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkhLiw/Xy06IFwiKSxcclxuXHJcbn07XHJcblxyXG5jb25zdCBLZXlzID0ge1xyXG4gICAga2V5Ym9hcmRNYXA6IFtcclxuICAgICAgICBcIlwiLCAvLyBbMF1cclxuICAgICAgICBcIlwiLCAvLyBbMV1cclxuICAgICAgICBcIlwiLCAvLyBbMl1cclxuICAgICAgICBcIkNBTkNFTFwiLCAvLyBbM11cclxuICAgICAgICBcIlwiLCAvLyBbNF1cclxuICAgICAgICBcIlwiLCAvLyBbNV1cclxuICAgICAgICBcIkhFTFBcIiwgLy8gWzZdXHJcbiAgICAgICAgXCJcIiwgLy8gWzddXHJcbiAgICAgICAgXCJCQUNLU1BBQ0VcIiwgLy8gWzhdXHJcbiAgICAgICAgXCJUQUJcIiwgLy8gWzldXHJcbiAgICAgICAgXCJcIiwgLy8gWzEwXVxyXG4gICAgICAgIFwiXCIsIC8vIFsxMV1cclxuICAgICAgICBcIkNMRUFSXCIsIC8vIFsxMl1cclxuICAgICAgICBcIkVOVEVSXCIsIC8vIFsxM11cclxuICAgICAgICBcIkVOVEVSIFNQRUNJQUxcIiwgLy8gWzE0XVxyXG4gICAgICAgIFwiXCIsIC8vIFsxNV1cclxuICAgICAgICBcIlNISUZUXCIsIC8vIFsxNl1cclxuICAgICAgICBcIkNPTlRST0xcIiwgLy8gWzE3XVxyXG4gICAgICAgIFwiQUxUXCIsIC8vIFsxOF1cclxuICAgICAgICBcIlBBVVNFXCIsIC8vIFsxOV1cclxuICAgICAgICBcIkNBUFMgTE9DS1wiLCAvLyBbMjBdXHJcbiAgICAgICAgXCJLQU5BXCIsIC8vIFsyMV1cclxuICAgICAgICBcIkVJU1VcIiwgLy8gWzIyXVxyXG4gICAgICAgIFwiSlVOSkFcIiwgLy8gWzIzXVxyXG4gICAgICAgIFwiRklOQUxcIiwgLy8gWzI0XVxyXG4gICAgICAgIFwiSEFOSkFcIiwgLy8gWzI1XVxyXG4gICAgICAgIFwiXCIsIC8vIFsyNl1cclxuICAgICAgICBcIkVTQ0FQRVwiLCAvLyBbMjddXHJcbiAgICAgICAgXCJDT05WRVJUXCIsIC8vIFsyOF1cclxuICAgICAgICBcIk5PTkNPTlZFUlRcIiwgLy8gWzI5XVxyXG4gICAgICAgIFwiQUNDRVBUXCIsIC8vIFszMF1cclxuICAgICAgICBcIk1PREVDSEFOR0VcIiwgLy8gWzMxXVxyXG4gICAgICAgIFwiU1BBQ0VcIiwgLy8gWzMyXVxyXG4gICAgICAgIFwiUEFHRSBVUFwiLCAvLyBbMzNdXHJcbiAgICAgICAgXCJQQUdFIERPV05cIiwgLy8gWzM0XVxyXG4gICAgICAgIFwiRU5EXCIsIC8vIFszNV1cclxuICAgICAgICBcIkhPTUVcIiwgLy8gWzM2XVxyXG4gICAgICAgIFwiTEVGVFwiLCAvLyBbMzddXHJcbiAgICAgICAgXCJVUFwiLCAvLyBbMzhdXHJcbiAgICAgICAgXCJSSUdIVFwiLCAvLyBbMzldXHJcbiAgICAgICAgXCJET1dOXCIsIC8vIFs0MF1cclxuICAgICAgICBcIlNFTEVDVFwiLCAvLyBbNDFdXHJcbiAgICAgICAgXCJQUklOVFwiLCAvLyBbNDJdXHJcbiAgICAgICAgXCJFWEVDVVRFXCIsIC8vIFs0M11cclxuICAgICAgICBcIlBSSU5UIFNDUkVFTlwiLCAvLyBbNDRdXHJcbiAgICAgICAgXCJJTlNFUlRcIiwgLy8gWzQ1XVxyXG4gICAgICAgIFwiREVMRVRFXCIsIC8vIFs0Nl1cclxuICAgICAgICBcIlwiLCAvLyBbNDddXHJcbiAgICAgICAgXCIwXCIsIC8vIFs0OF1cclxuICAgICAgICBcIjFcIiwgLy8gWzQ5XVxyXG4gICAgICAgIFwiMlwiLCAvLyBbNTBdXHJcbiAgICAgICAgXCIzXCIsIC8vIFs1MV1cclxuICAgICAgICBcIjRcIiwgLy8gWzUyXVxyXG4gICAgICAgIFwiNVwiLCAvLyBbNTNdXHJcbiAgICAgICAgXCI2XCIsIC8vIFs1NF1cclxuICAgICAgICBcIjdcIiwgLy8gWzU1XVxyXG4gICAgICAgIFwiOFwiLCAvLyBbNTZdXHJcbiAgICAgICAgXCI5XCIsIC8vIFs1N11cclxuICAgICAgICBcIkNPTE9OXCIsIC8vIFs1OF1cclxuICAgICAgICBcIlNFTUlDT0xPTlwiLCAvLyBbNTldXHJcbiAgICAgICAgXCJMRVNTIFRIQU5cIiwgLy8gWzYwXVxyXG4gICAgICAgIFwiRVFVQUxTXCIsIC8vIFs2MV1cclxuICAgICAgICBcIkdSRUFURVIgVEhBTlwiLCAvLyBbNjJdXHJcbiAgICAgICAgXCJRVUVTVElPTiBNQVJLXCIsIC8vIFs2M11cclxuICAgICAgICBcIkFUXCIsIC8vIFs2NF1cclxuICAgICAgICBcIkFcIiwgLy8gWzY1XVxyXG4gICAgICAgIFwiQlwiLCAvLyBbNjZdXHJcbiAgICAgICAgXCJDXCIsIC8vIFs2N11cclxuICAgICAgICBcIkRcIiwgLy8gWzY4XVxyXG4gICAgICAgIFwiRVwiLCAvLyBbNjldXHJcbiAgICAgICAgXCJGXCIsIC8vIFs3MF1cclxuICAgICAgICBcIkdcIiwgLy8gWzcxXVxyXG4gICAgICAgIFwiSFwiLCAvLyBbNzJdXHJcbiAgICAgICAgXCJJXCIsIC8vIFs3M11cclxuICAgICAgICBcIkpcIiwgLy8gWzc0XVxyXG4gICAgICAgIFwiS1wiLCAvLyBbNzVdXHJcbiAgICAgICAgXCJMXCIsIC8vIFs3Nl1cclxuICAgICAgICBcIk1cIiwgLy8gWzc3XVxyXG4gICAgICAgIFwiTlwiLCAvLyBbNzhdXHJcbiAgICAgICAgXCJPXCIsIC8vIFs3OV1cclxuICAgICAgICBcIlBcIiwgLy8gWzgwXVxyXG4gICAgICAgIFwiUVwiLCAvLyBbODFdXHJcbiAgICAgICAgXCJSXCIsIC8vIFs4Ml1cclxuICAgICAgICBcIlNcIiwgLy8gWzgzXVxyXG4gICAgICAgIFwiVFwiLCAvLyBbODRdXHJcbiAgICAgICAgXCJVXCIsIC8vIFs4NV1cclxuICAgICAgICBcIlZcIiwgLy8gWzg2XVxyXG4gICAgICAgIFwiV1wiLCAvLyBbODddXHJcbiAgICAgICAgXCJYXCIsIC8vIFs4OF1cclxuICAgICAgICBcIllcIiwgLy8gWzg5XVxyXG4gICAgICAgIFwiWlwiLCAvLyBbOTBdXHJcbiAgICAgICAgXCJPUyBLRVlcIiwgLy8gWzkxXSBXaW5kb3dzIEtleSAoV2luZG93cykgb3IgQ29tbWFuZCBLZXkgKE1hYylcclxuICAgICAgICBcIlwiLCAvLyBbOTJdXHJcbiAgICAgICAgXCJDT05URVhUIE1FTlVcIiwgLy8gWzkzXVxyXG4gICAgICAgIFwiXCIsIC8vIFs5NF1cclxuICAgICAgICBcIlNMRUVQXCIsIC8vIFs5NV1cclxuICAgICAgICBcIk5VTVBBRDBcIiwgLy8gWzk2XVxyXG4gICAgICAgIFwiTlVNUEFEMVwiLCAvLyBbOTddXHJcbiAgICAgICAgXCJOVU1QQUQyXCIsIC8vIFs5OF1cclxuICAgICAgICBcIk5VTVBBRDNcIiwgLy8gWzk5XVxyXG4gICAgICAgIFwiTlVNUEFENFwiLCAvLyBbMTAwXVxyXG4gICAgICAgIFwiTlVNUEFENVwiLCAvLyBbMTAxXVxyXG4gICAgICAgIFwiTlVNUEFENlwiLCAvLyBbMTAyXVxyXG4gICAgICAgIFwiTlVNUEFEN1wiLCAvLyBbMTAzXVxyXG4gICAgICAgIFwiTlVNUEFEOFwiLCAvLyBbMTA0XVxyXG4gICAgICAgIFwiTlVNUEFEOVwiLCAvLyBbMTA1XVxyXG4gICAgICAgIFwiTVVMVElQTFlcIiwgLy8gWzEwNl1cclxuICAgICAgICBcIkFERFwiLCAvLyBbMTA3XVxyXG4gICAgICAgIFwiU0VQQVJBVE9SXCIsIC8vIFsxMDhdXHJcbiAgICAgICAgXCJTVUJUUkFDVFwiLCAvLyBbMTA5XVxyXG4gICAgICAgIFwiREVDSU1BTFwiLCAvLyBbMTEwXVxyXG4gICAgICAgIFwiRElWSURFXCIsIC8vIFsxMTFdXHJcbiAgICAgICAgXCJGMVwiLCAvLyBbMTEyXVxyXG4gICAgICAgIFwiRjJcIiwgLy8gWzExM11cclxuICAgICAgICBcIkYzXCIsIC8vIFsxMTRdXHJcbiAgICAgICAgXCJGNFwiLCAvLyBbMTE1XVxyXG4gICAgICAgIFwiRjVcIiwgLy8gWzExNl1cclxuICAgICAgICBcIkY2XCIsIC8vIFsxMTddXHJcbiAgICAgICAgXCJGN1wiLCAvLyBbMTE4XVxyXG4gICAgICAgIFwiRjhcIiwgLy8gWzExOV1cclxuICAgICAgICBcIkY5XCIsIC8vIFsxMjBdXHJcbiAgICAgICAgXCJGMTBcIiwgLy8gWzEyMV1cclxuICAgICAgICBcIkYxMVwiLCAvLyBbMTIyXVxyXG4gICAgICAgIFwiRjEyXCIsIC8vIFsxMjNdXHJcbiAgICAgICAgXCJGMTNcIiwgLy8gWzEyNF1cclxuICAgICAgICBcIkYxNFwiLCAvLyBbMTI1XVxyXG4gICAgICAgIFwiRjE1XCIsIC8vIFsxMjZdXHJcbiAgICAgICAgXCJGMTZcIiwgLy8gWzEyN11cclxuICAgICAgICBcIkYxN1wiLCAvLyBbMTI4XVxyXG4gICAgICAgIFwiRjE4XCIsIC8vIFsxMjldXHJcbiAgICAgICAgXCJGMTlcIiwgLy8gWzEzMF1cclxuICAgICAgICBcIkYyMFwiLCAvLyBbMTMxXVxyXG4gICAgICAgIFwiRjIxXCIsIC8vIFsxMzJdXHJcbiAgICAgICAgXCJGMjJcIiwgLy8gWzEzM11cclxuICAgICAgICBcIkYyM1wiLCAvLyBbMTM0XVxyXG4gICAgICAgIFwiRjI0XCIsIC8vIFsxMzVdXHJcbiAgICAgICAgXCJcIiwgLy8gWzEzNl1cclxuICAgICAgICBcIlwiLCAvLyBbMTM3XVxyXG4gICAgICAgIFwiXCIsIC8vIFsxMzhdXHJcbiAgICAgICAgXCJcIiwgLy8gWzEzOV1cclxuICAgICAgICBcIlwiLCAvLyBbMTQwXVxyXG4gICAgICAgIFwiXCIsIC8vIFsxNDFdXHJcbiAgICAgICAgXCJcIiwgLy8gWzE0Ml1cclxuICAgICAgICBcIlwiLCAvLyBbMTQzXVxyXG4gICAgICAgIFwiTlVNIExPQ0tcIiwgLy8gWzE0NF1cclxuICAgICAgICBcIlNDUk9MTCBMT0NLXCIsIC8vIFsxNDVdXHJcbiAgICAgICAgXCJXSU4gT0VNIEZKIEpJU0hPXCIsIC8vIFsxNDZdXHJcbiAgICAgICAgXCJXSU4gT0VNIEZKIE1BU1NIT1VcIiwgLy8gWzE0N11cclxuICAgICAgICBcIldJTiBPRU0gRkogVE9VUk9LVVwiLCAvLyBbMTQ4XVxyXG4gICAgICAgIFwiV0lOIE9FTSBGSiBMT1lBXCIsIC8vIFsxNDldXHJcbiAgICAgICAgXCJXSU4gT0VNIEZKIFJPWUFcIiwgLy8gWzE1MF1cclxuICAgICAgICBcIlwiLCAvLyBbMTUxXVxyXG4gICAgICAgIFwiXCIsIC8vIFsxNTJdXHJcbiAgICAgICAgXCJcIiwgLy8gWzE1M11cclxuICAgICAgICBcIlwiLCAvLyBbMTU0XVxyXG4gICAgICAgIFwiXCIsIC8vIFsxNTVdXHJcbiAgICAgICAgXCJcIiwgLy8gWzE1Nl1cclxuICAgICAgICBcIlwiLCAvLyBbMTU3XVxyXG4gICAgICAgIFwiXCIsIC8vIFsxNThdXHJcbiAgICAgICAgXCJcIiwgLy8gWzE1OV1cclxuICAgICAgICBcIkNJUkNVTUZMRVhcIiwgLy8gWzE2MF1cclxuICAgICAgICBcIkVYQ0xBTUFUSU9OXCIsIC8vIFsxNjFdXHJcbiAgICAgICAgXCJET1VCTEVfUVVPVEVcIiwgLy8gWzE2Ml1cclxuICAgICAgICBcIkhBU0hcIiwgLy8gWzE2M11cclxuICAgICAgICBcIkRPTExBUlwiLCAvLyBbMTY0XVxyXG4gICAgICAgIFwiUEVSQ0VOVFwiLCAvLyBbMTY1XVxyXG4gICAgICAgIFwiQU1QRVJTQU5EXCIsIC8vIFsxNjZdXHJcbiAgICAgICAgXCJVTkRFUlNDT1JFXCIsIC8vIFsxNjddXHJcbiAgICAgICAgXCJPUEVOIFBBUkVOVEhFU0lTXCIsIC8vIFsxNjhdXHJcbiAgICAgICAgXCJDTE9TRSBQQVJFTlRIRVNJU1wiLCAvLyBbMTY5XVxyXG4gICAgICAgIFwiQVNURVJJU0tcIiwgLy8gWzE3MF1cclxuICAgICAgICBcIlBMVVNcIiwgLy8gWzE3MV1cclxuICAgICAgICBcIlBJUEVcIiwgLy8gWzE3Ml1cclxuICAgICAgICBcIkhZUEhFTlwiLCAvLyBbMTczXVxyXG4gICAgICAgIFwiT1BFTiBDVVJMWSBCUkFDS0VUXCIsIC8vIFsxNzRdXHJcbiAgICAgICAgXCJDTE9TRSBDVVJMWSBCUkFDS0VUXCIsIC8vIFsxNzVdXHJcbiAgICAgICAgXCJUSUxERVwiLCAvLyBbMTc2XVxyXG4gICAgICAgIFwiXCIsIC8vIFsxNzddXHJcbiAgICAgICAgXCJcIiwgLy8gWzE3OF1cclxuICAgICAgICBcIlwiLCAvLyBbMTc5XVxyXG4gICAgICAgIFwiXCIsIC8vIFsxODBdXHJcbiAgICAgICAgXCJWT0xVTUUgTVVURVwiLCAvLyBbMTgxXVxyXG4gICAgICAgIFwiVk9MVU1FIERPV05cIiwgLy8gWzE4Ml1cclxuICAgICAgICBcIlZPTFVNRSBVUFwiLCAvLyBbMTgzXVxyXG4gICAgICAgIFwiXCIsIC8vIFsxODRdXHJcbiAgICAgICAgXCJcIiwgLy8gWzE4NV1cclxuICAgICAgICBcIlNFTUlDT0xPTlwiLCAvLyBbMTg2XVxyXG4gICAgICAgIFwiRVFVQUxTXCIsIC8vIFsxODddXHJcbiAgICAgICAgXCJDT01NQVwiLCAvLyBbMTg4XVxyXG4gICAgICAgIFwiTUlOVVNcIiwgLy8gWzE4OV1cclxuICAgICAgICBcIlBFUklPRFwiLCAvLyBbMTkwXVxyXG4gICAgICAgIFwiU0xBU0hcIiwgLy8gWzE5MV1cclxuICAgICAgICBcIkJBQ0sgUVVPVEVcIiwgLy8gWzE5Ml1cclxuICAgICAgICBcIlwiLCAvLyBbMTkzXVxyXG4gICAgICAgIFwiXCIsIC8vIFsxOTRdXHJcbiAgICAgICAgXCJcIiwgLy8gWzE5NV1cclxuICAgICAgICBcIlwiLCAvLyBbMTk2XVxyXG4gICAgICAgIFwiXCIsIC8vIFsxOTddXHJcbiAgICAgICAgXCJcIiwgLy8gWzE5OF1cclxuICAgICAgICBcIlwiLCAvLyBbMTk5XVxyXG4gICAgICAgIFwiXCIsIC8vIFsyMDBdXHJcbiAgICAgICAgXCJcIiwgLy8gWzIwMV1cclxuICAgICAgICBcIlwiLCAvLyBbMjAyXVxyXG4gICAgICAgIFwiXCIsIC8vIFsyMDNdXHJcbiAgICAgICAgXCJcIiwgLy8gWzIwNF1cclxuICAgICAgICBcIlwiLCAvLyBbMjA1XVxyXG4gICAgICAgIFwiXCIsIC8vIFsyMDZdXHJcbiAgICAgICAgXCJcIiwgLy8gWzIwN11cclxuICAgICAgICBcIlwiLCAvLyBbMjA4XVxyXG4gICAgICAgIFwiXCIsIC8vIFsyMDldXHJcbiAgICAgICAgXCJcIiwgLy8gWzIxMF1cclxuICAgICAgICBcIlwiLCAvLyBbMjExXVxyXG4gICAgICAgIFwiXCIsIC8vIFsyMTJdXHJcbiAgICAgICAgXCJcIiwgLy8gWzIxM11cclxuICAgICAgICBcIlwiLCAvLyBbMjE0XVxyXG4gICAgICAgIFwiXCIsIC8vIFsyMTVdXHJcbiAgICAgICAgXCJcIiwgLy8gWzIxNl1cclxuICAgICAgICBcIlwiLCAvLyBbMjE3XVxyXG4gICAgICAgIFwiXCIsIC8vIFsyMThdXHJcbiAgICAgICAgXCJPUEVOIEJSQUNLRVRcIiwgLy8gWzIxOV1cclxuICAgICAgICBcIkJBQ0sgU0xBU0hcIiwgLy8gWzIyMF1cclxuICAgICAgICBcIkNMT1NFIEJSQUNLRVRcIiwgLy8gWzIyMV1cclxuICAgICAgICBcIlFVT1RFXCIsIC8vIFsyMjJdXHJcbiAgICAgICAgXCJcIiwgLy8gWzIyM11cclxuICAgICAgICBcIk1FVEFcIiwgLy8gWzIyNF1cclxuICAgICAgICBcIkFMVCBHUkFQSFwiLCAvLyBbMjI1XVxyXG4gICAgICAgIFwiXCIsIC8vIFsyMjZdXHJcbiAgICAgICAgXCJXSU4gSUNPIEhFTFBcIiwgLy8gWzIyN11cclxuICAgICAgICBcIldJTiBJQ08gMDBcIiwgLy8gWzIyOF1cclxuICAgICAgICBcIlwiLCAvLyBbMjI5XVxyXG4gICAgICAgIFwiV0lOIElDTyBDTEVBUlwiLCAvLyBbMjMwXVxyXG4gICAgICAgIFwiXCIsIC8vIFsyMzFdXHJcbiAgICAgICAgXCJcIiwgLy8gWzIzMl1cclxuICAgICAgICBcIldJTiBPRU0gUkVTRVRcIiwgLy8gWzIzM11cclxuICAgICAgICBcIldJTiBPRU0gSlVNUFwiLCAvLyBbMjM0XVxyXG4gICAgICAgIFwiV0lOIE9FTSBQQTFcIiwgLy8gWzIzNV1cclxuICAgICAgICBcIldJTiBPRU0gUEEyXCIsIC8vIFsyMzZdXHJcbiAgICAgICAgXCJXSU4gT0VNIFBBM1wiLCAvLyBbMjM3XVxyXG4gICAgICAgIFwiV0lOIE9FTSBXU0NUUkxcIiwgLy8gWzIzOF1cclxuICAgICAgICBcIldJTiBPRU0gQ1VTRUxcIiwgLy8gWzIzOV1cclxuICAgICAgICBcIldJTiBPRU0gQVRUTlwiLCAvLyBbMjQwXVxyXG4gICAgICAgIFwiV0lOIE9FTSBGSU5JU0hcIiwgLy8gWzI0MV1cclxuICAgICAgICBcIldJTiBPRU0gQ09QWVwiLCAvLyBbMjQyXVxyXG4gICAgICAgIFwiV0lOIE9FTSBBVVRPXCIsIC8vIFsyNDNdXHJcbiAgICAgICAgXCJXSU4gT0VNIEVOTFdcIiwgLy8gWzI0NF1cclxuICAgICAgICBcIldJTiBPRU0gQkFDS1RBQlwiLCAvLyBbMjQ1XVxyXG4gICAgICAgIFwiQVRUTlwiLCAvLyBbMjQ2XVxyXG4gICAgICAgIFwiQ1JTRUxcIiwgLy8gWzI0N11cclxuICAgICAgICBcIkVYU0VMXCIsIC8vIFsyNDhdXHJcbiAgICAgICAgXCJFUkVPRlwiLCAvLyBbMjQ5XVxyXG4gICAgICAgIFwiUExBWVwiLCAvLyBbMjUwXVxyXG4gICAgICAgIFwiWk9PTVwiLCAvLyBbMjUxXVxyXG4gICAgICAgIFwiXCIsIC8vIFsyNTJdXHJcbiAgICAgICAgXCJQQTFcIiwgLy8gWzI1M11cclxuICAgICAgICBcIldJTiBPRU0gQ0xFQVJcIiwgLy8gWzI1NF1cclxuICAgICAgICBcIlRPR0dMRSBUT1VDSFBBRFwiIC8vIFsyNTVdXHJcbiAgICBdLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTc3MjE3OS9nZXQtY2hhcmFjdGVyLXZhbHVlLWZyb20ta2V5Y29kZS1pbi1qYXZhc2NyaXB0LXRoZW4tdHJpbVxyXG59XHJcblxyXG5jb25zdCBBdWRpb0Fzc2V0cyA9IHtcclxuICAgIHVpOiB7XHJcbiAgICAgICAgaW52ZW50b3J5Q2xhY2s6IG5ldyBBdWRpb1Jlc291cmNlR3JvdXAoW25ldyBBdWRpb1Jlc291cmNlKCdhc3NldHMvc291bmRzL3NmeC91aS9jbGFjazEubXAzJyksIG5ldyBBdWRpb1Jlc291cmNlKCdhc3NldHMvc291bmRzL3NmeC91aS9jbGFjazIubXAzJyksIG5ldyBBdWRpb1Jlc291cmNlKCdhc3NldHMvc291bmRzL3NmeC91aS9jbGFjazMubXAzJyldKVxyXG4gICAgfSxcclxuICAgIG11c2ljOiB7XHJcbiAgICAgICAgdGl0bGVTY3JlZW46IG5ldyBBdWRpb1Jlc291cmNlKCdhc3NldHMvc291bmRzL211c2ljL1RpdGxlU2NyZWVuLm1wMycpXHJcbiAgICB9XHJcbn1cclxuXHJcbnR5cGUgQW5pbWF0aW9uRnJhbWU8VCBleHRlbmRzIFJlY29yZDxzdHJpbmcsIEltYWdlUmVzb3VyY2VbXT4+ID0ga2V5b2YgVFxyXG5cclxuLy8gY29uc3QgYW5pbWF0aW9ucyA9IDxUIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgSW1hZ2VSZXNvdXJjZVtdPj4oZGF0YTogVCk6IFQgPT4gZGF0YVxyXG5cclxuY29uc3QgUGxheWVyQW5pbWF0aW9ucyA9IHtcclxuICAgIGlkbGU6IFtcclxuICAgICAgICBuZXcgSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3BsYXllci9jaGFyYWN0ZXIucG5nJylcclxuICAgIF1cclxufVxyXG5cclxubGV0IGZyYW1lOiBBbmltYXRpb25GcmFtZTx0eXBlb2YgUGxheWVyQW5pbWF0aW9ucz4gPSAnaWRsZSdcclxuXHJcblxyXG5jb25zdCBsb2FkQXNzZXRzID0gKHNrZXRjaDogUDUsIC4uLmFzc2V0czogQXNzZXRHcm91cFtdKSA9PiB7XHJcbiAgICBhc3NldHMuZm9yRWFjaCgoYXNzZXRHcm91cCkgPT4ge1xyXG4gICAgICAgIHNlYXJjaEdyb3VwKGFzc2V0R3JvdXAsIHNrZXRjaCk7XHJcbiAgICB9KTtcclxuXHJcbn07XHJcblxyXG5mdW5jdGlvbiBzZWFyY2hHcm91cChhc3NldEdyb3VwOiBBc3NldEdyb3VwIHwgUmVzb3VyY2UgfCBBdWRpb1Jlc291cmNlIHwgQXVkaW9SZXNvdXJjZUdyb3VwIHwgSW1hZ2VSZXNvdXJjZVtdLCBza2V0Y2g6IFA1KSB7XHJcbiAgICBpZiAoYXNzZXRHcm91cCBpbnN0YW5jZW9mIFJlc291cmNlKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coYExvYWRpbmcgYXNzZXQgJHthc3NldEdyb3VwLnBhdGh9YCk7XHJcbiAgICAgICAgYXNzZXRHcm91cC5sb2FkUmVzb3VyY2Uoc2tldGNoKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBPYmplY3QuZW50cmllcyhhc3NldEdyb3VwKS5mb3JFYWNoKChhc3NldCkgPT4ge1xyXG4gICAgICAgIHNlYXJjaEdyb3VwKGFzc2V0WzFdLCBza2V0Y2gpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCB7IEF1ZGlvQXNzZXRzLCBVaUFzc2V0cywgSXRlbXNBc3NldHMsIFdvcmxkQXNzZXRzLCBGb250cywgS2V5cywgUGxheWVyQW5pbWF0aW9ucywgQW5pbWF0aW9uRnJhbWUsIGxvYWRBc3NldHMgfTtcclxuIiwiaW1wb3J0IFA1IGZyb20gJ3A1JztcclxuaW1wb3J0IFJlc291cmNlIGZyb20gJy4vUmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBBdWRpb1R5cGUgfSBmcm9tICd0cy1hdWRpbyc7XHJcbmltcG9ydCBBdWRpbyBmcm9tICd0cy1hdWRpbyc7XHJcblxyXG5cclxuY2xhc3MgQXVkaW9SZXNvdXJjZSBleHRlbmRzIFJlc291cmNlIHtcclxuICAgIHNvdW5kOiBBdWRpb1R5cGVcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwYXRoOiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcihwYXRoKTtcclxuICAgIH1cclxuXHJcbiAgICBsb2FkUmVzb3VyY2UoZ2FtZTogUDUpIHtcclxuICAgICAgICB0aGlzLnNvdW5kID0gQXVkaW8oe1xyXG4gICAgICAgICAgICBmaWxlOiB0aGlzLnBhdGgsXHJcbiAgICAgICAgICAgIGxvb3A6IGZhbHNlLFxyXG4gICAgICAgICAgICB2b2x1bWU6IDEuMCxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBwbGF5UmFuZG9tKCkge1xyXG4gICAgLy8gICAgIC8vIFZlcmlmeSB0aGF0IHRoZSBzb3VuZCBoYXMgYmVlbiBsb2FkZWRcclxuICAgIC8vICAgICBpZiAodGhpcy5zb3VuZCA9PT0gdW5kZWZpbmVkKVxyXG4gICAgLy8gICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAvLyAgICAgICAgICAgICBgVHJpZWQgdG8gcGxheSBzb3VuZCBiZWZvcmUgbG9hZGluZyBpdDogJHt0aGlzLnBhdGh9YFxyXG4gICAgLy8gICAgICAgICApO1xyXG5cclxuICAgIC8vICAgICB0aGlzLnNvdW5kLnBsYXkoKTtcclxuICAgIC8vIH1cclxuXHJcbiAgICBwbGF5U291bmQoKSB7Ly8gcGxheSB0aGUgc291bmRcclxuICAgICAgICAvL1ZlcmlmeSB0aGF0IHRoZSBzb3VuZCBoYXMgYmVlbiBsb2FkZWRcclxuICAgICAgICBpZiAodGhpcy5zb3VuZCA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAgICAgICAgICAgICBgVHJpZWQgdG8gcGxheSBzb3VuZCBiZWZvcmUgbG9hZGluZyBpdDogJHt0aGlzLnBhdGh9YFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIHRoaXMuc291bmQucGF1c2UoKTtcclxuICAgICAgICB0aGlzLnNvdW5kLnBsYXkoKTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCA9IEF1ZGlvUmVzb3VyY2U7XHJcbiIsImltcG9ydCBBdWRpb1Jlc291cmNlIGZyb20gJy4vQXVkaW9SZXNvdXJjZSc7XHJcbmltcG9ydCBQNSBmcm9tIFwicDVcIjtcclxuXHJcbmNsYXNzIEF1ZGlvUmVzb3VyY2VHcm91cCB7XHJcblxyXG4gICAgc291bmRzOiBBdWRpb1Jlc291cmNlW11cclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihzb3VuZHM6IEF1ZGlvUmVzb3VyY2VbXSkgey8vIHBhc3MgaW4gYW4gYXJyYXkgb2YgQXVkaW9SZXNvdXJjZXMgdGhhdCBhcmUgYWxsIHNpbWlsYXJcclxuICAgICAgICB0aGlzLnNvdW5kcyA9IHNvdW5kcztcclxuICAgIH1cclxuXHJcbiAgICBwbGF5UmFuZG9tKCkgey8vIHBsYXkgYSByYW5kb20gc291bmRcclxuICAgICAgICBpZih0aGlzLnNvdW5kcyA9PT0gdW5kZWZpbmVkIHx8IHRoaXMuc291bmRzLmxlbmd0aCA9PT0gMClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxyXG4gICAgICAgICAgICAgICAgYFRoZXJlIGFyZSBubyBzb3VuZHM6ICR7dGhpcy5zb3VuZHN9YFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIGNvbnN0IHIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0aGlzLnNvdW5kcy5sZW5ndGgpO1xyXG4gICAgICAgIHRoaXMuc291bmRzW3JdLnBsYXlTb3VuZCgpOy8vIHBsYXkgYSByYW5kb20gc291bmQgZnJvbSB0aGUgYXJyYXkgYXQgYSBzbGlnaHRseSByYW5kb21pemVkIHBpdGNoLCBsZWFkaW5nIHRvIHRoZSBlZmZlY3Qgb2YgaXQgbWFraW5nIGEgbmV3IHNvdW5kIGVhY2ggdGltZSwgcmVtb3ZpbmcgcmVwZXRpdGl2ZW5lc3NcclxuXHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQgPSBBdWRpb1Jlc291cmNlR3JvdXA7IiwiaW1wb3J0IEltYWdlUmVzb3VyY2UgZnJvbSAnLi9JbWFnZVJlc291cmNlJztcclxuaW1wb3J0IHA1IGZyb20gJ3A1JztcclxuaW1wb3J0IGdhbWUgZnJvbSAnLi4vLi4vTWFpbidcclxuXHJcbmNsYXNzIEZvbnRSZXNvdXJjZSBleHRlbmRzIEltYWdlUmVzb3VyY2Uge1xyXG5cclxuICAgIGFscGhhYmV0X3NvdXA6IHtbbGV0dGVyOiBzdHJpbmddOiB7eDogbnVtYmVyLCB5OiBudW1iZXIsIHc6IG51bWJlciwgaDogbnVtYmVyfX0gPSB7fVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBhdGg6IHN0cmluZywgY2hhcmFjdGVyRGF0YToge1tsZXR0ZXI6IHN0cmluZ106IG51bWJlcn0sIGNoYXJhY3Rlck9yZGVyOiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcihwYXRoKTtcclxuICAgICAgICBsZXQgcnVubmluZ1RvdGFsID0gMFxyXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGk8Y2hhcmFjdGVyT3JkZXIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5hbHBoYWJldF9zb3VwW2NoYXJhY3Rlck9yZGVyW2ldXSA9IHt4OiBydW5uaW5nVG90YWwsIHk6IDAsIHc6IGNoYXJhY3RlckRhdGFbY2hhcmFjdGVyT3JkZXJbaV1dLCBoOiAxMn1cclxuICAgICAgICAgICAgcnVubmluZ1RvdGFsICs9IGNoYXJhY3RlckRhdGFbY2hhcmFjdGVyT3JkZXJbaV1dICsgMVxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhjaGFyYWN0ZXJPcmRlcltpXStcIjogXCIrY2hhcmFjdGVyRGF0YVtjaGFyYWN0ZXJPcmRlcltpXV0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBkcmF3VGV4dCh0YXJnZXQ6IHA1LCBzdHI6IHN0cmluZywgeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuICAgICAgICBsZXQgeE9mZnNldDogbnVtYmVyID0gMDtcclxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpPHN0ci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4K3hPZmZzZXQqZ2FtZS51cHNjYWxlU2l6ZSwgeSwgdGhpcy5hbHBoYWJldF9zb3VwW3N0cltpXV0udypnYW1lLnVwc2NhbGVTaXplLCB0aGlzLmFscGhhYmV0X3NvdXBbc3RyW2ldXS5oKmdhbWUudXBzY2FsZVNpemUsIHRoaXMuYWxwaGFiZXRfc291cFtzdHJbaV1dLngsIHRoaXMuYWxwaGFiZXRfc291cFtzdHJbaV1dLnksIHRoaXMuYWxwaGFiZXRfc291cFtzdHJbaV1dLncsIHRoaXMuYWxwaGFiZXRfc291cFtzdHJbaV1dLmgpO1xyXG4gICAgICAgICAgICB4T2Zmc2V0ICs9IHRoaXMuYWxwaGFiZXRfc291cFtzdHJbaV1dLncrMTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0ID0gRm9udFJlc291cmNlOyIsImltcG9ydCBQNSBmcm9tICdwNSc7XHJcbmltcG9ydCBSZXNvdXJjZSBmcm9tICcuL1Jlc291cmNlJztcclxuXHJcbmNsYXNzIEltYWdlUmVzb3VyY2UgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgICBpbWFnZTogUDUuSW1hZ2U7XHJcblxyXG4gICAgY29uc3RydWN0b3IocGF0aDogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIocGF0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZFJlc291cmNlKGdhbWU6IFA1KSB7XHJcbiAgICAgICAgdGhpcy5pbWFnZSA9IGdhbWUubG9hZEltYWdlKHRoaXMucGF0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKHRhcmdldDogYW55LCB4OiBudW1iZXIsIHk6IG51bWJlciwgd2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpIHtcclxuICAgICAgICAvLyBWZXJpZnkgdGhhdCB0aGUgdGlsZXMgaGFzIGJlZW4gbG9hZGVkXHJcbiAgICAgICAgaWYgKHRoaXMuaW1hZ2UgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxyXG4gICAgICAgICAgICAgICAgYFRyaWVkIHRvIHJlbmRlciBpbWFnZSBiZWZvcmUgbG9hZGluZyBpdDogJHt0aGlzLnBhdGh9YFxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAvLyBEcmF3IG5vbiB0aWxlcyBpbWFnZVxyXG4gICAgICAgIHRhcmdldC5pbWFnZSh0aGlzLmltYWdlLCB4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXJQYXJ0aWFsKFxyXG4gICAgICAgIHRhcmdldDogYW55LFxyXG4gICAgICAgIHg6IG51bWJlcixcclxuICAgICAgICB5OiBudW1iZXIsXHJcbiAgICAgICAgd2lkdGg6IG51bWJlcixcclxuICAgICAgICBoZWlnaHQ6IG51bWJlcixcclxuICAgICAgICBzb3VyY2VYPzogbnVtYmVyLFxyXG4gICAgICAgIHNvdXJjZVk/OiBudW1iZXIsXHJcbiAgICAgICAgc291cmNlV2lkdGg/OiBudW1iZXIsXHJcbiAgICAgICAgc291cmNlSGVpZ2h0PzogbnVtYmVyXHJcbiAgICApIHtcclxuICAgICAgICAvLyBWZXJpZnkgdGhhdCB0aGUgdGlsZXMgaGFzIGJlZW4gbG9hZGVkXHJcbiAgICAgICAgaWYgKHRoaXMuaW1hZ2UgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxyXG4gICAgICAgICAgICAgICAgYFRyaWVkIHRvIHJlbmRlciBpbWFnZSBiZWZvcmUgbG9hZGluZyBpdDogJHt0aGlzLnBhdGh9YFxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAvLyBEcmF3IGEgcGFydGlhbCBwYXJ0IG9mIHRoZSBpbWFnZVxyXG4gICAgICAgIHRhcmdldC5pbWFnZShcclxuICAgICAgICAgICAgdGhpcy5pbWFnZSxcclxuICAgICAgICAgICAgeCxcclxuICAgICAgICAgICAgeSxcclxuICAgICAgICAgICAgd2lkdGgsXHJcbiAgICAgICAgICAgIGhlaWdodCxcclxuICAgICAgICAgICAgc291cmNlWCxcclxuICAgICAgICAgICAgc291cmNlWSxcclxuICAgICAgICAgICAgc291cmNlV2lkdGgsXHJcbiAgICAgICAgICAgIHNvdXJjZUhlaWdodFxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCA9IEltYWdlUmVzb3VyY2U7XHJcbiIsImltcG9ydCBQNSBmcm9tICdwNSc7XHJcblxyXG5hYnN0cmFjdCBjbGFzcyBSZXNvdXJjZSB7XHJcbiAgICBwYXRoOiBzdHJpbmc7XHJcblxyXG4gICAgcHJvdGVjdGVkIGNvbnN0cnVjdG9yKHBhdGg6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMucGF0aCA9IHBhdGg7XHJcbiAgICB9XHJcblxyXG4gICAgYWJzdHJhY3QgbG9hZFJlc291cmNlKHNrZXRjaDogUDUpOiB2b2lkO1xyXG59XHJcblxyXG5leHBvcnQgPSBSZXNvdXJjZTtcclxuIiwiaW1wb3J0IEltYWdlUmVzb3VyY2UgZnJvbSAnLi9JbWFnZVJlc291cmNlJztcclxuXHJcbmNsYXNzIFRpbGVSZXNvdXJjZSBleHRlbmRzIEltYWdlUmVzb3VyY2Uge1xyXG4gICAgLy8gVGhlIHdpZHRoIGFuZCBoZWlnaHQgb2YgdGhlIHRpbGVzIHNldFxyXG4gICAgd2lkdGg6IG51bWJlcjtcclxuICAgIGhlaWdodDogbnVtYmVyO1xyXG5cclxuICAgIC8vIFRoZSB3aWR0aCBhbmQgaGVpZ2h0IG9mIGVhY2ggdGlsZXMgaW4gcGl4ZWxzXHJcbiAgICB0aWxlV2lkdGg6IG51bWJlcjtcclxuICAgIHRpbGVIZWlnaHQ6IG51bWJlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBwYXRoOiBzdHJpbmcsXHJcbiAgICAgICAgd2lkdGg6IG51bWJlcixcclxuICAgICAgICBoZWlnaHQ6IG51bWJlcixcclxuICAgICAgICB0aWxlV2lkdGg6IG51bWJlcixcclxuICAgICAgICB0aWxlSGVpZ2h0OiBudW1iZXJcclxuICAgICkge1xyXG4gICAgICAgIHN1cGVyKHBhdGgpO1xyXG4gICAgICAgIHRoaXMud2lkdGggPSB3aWR0aDtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcclxuICAgICAgICB0aGlzLnRpbGVXaWR0aCA9IHRpbGVXaWR0aDtcclxuICAgICAgICB0aGlzLnRpbGVIZWlnaHQgPSB0aWxlSGVpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlclRpbGUoXHJcbiAgICAgICAgaTogbnVtYmVyLFxyXG4gICAgICAgIHRhcmdldDogYW55LFxyXG4gICAgICAgIHg6IG51bWJlcixcclxuICAgICAgICB5OiBudW1iZXIsXHJcbiAgICAgICAgd2lkdGg6IG51bWJlcixcclxuICAgICAgICBoZWlnaHQ6IG51bWJlclxyXG4gICAgKSB7XHJcbiAgICAgICAgY29uc3QgdGlsZVNldFggPSBpICUgdGhpcy53aWR0aDtcclxuICAgICAgICBjb25zdCB0aWxlU2V0WSA9IE1hdGguZmxvb3IoaSAvIHRoaXMud2lkdGgpO1xyXG5cclxuICAgICAgICAvLyBNYWtlIHN1cmUgdGhlIHRpbGVzIGlzbid0IG91dCBvZiBib3VuZHNcclxuICAgICAgICBpZiAodGlsZVNldFkgPiB0aGlzLmhlaWdodClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxyXG4gICAgICAgICAgICAgICAgYE91dCBvZiBib3VuZHMgdGlsZS4gVHJpZWQgdG8gcmVuZGVyIHRpbGUgaW5kZXggJHtpfSB3aXRoIGEgbWF4aW11bSBvZiAke1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMud2lkdGggKiB0aGlzLmhlaWdodFxyXG4gICAgICAgICAgICAgICAgfSB0aWxlc2BcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgc3VwZXIucmVuZGVyUGFydGlhbChcclxuICAgICAgICAgICAgdGFyZ2V0LFxyXG4gICAgICAgICAgICB4LFxyXG4gICAgICAgICAgICB5LFxyXG4gICAgICAgICAgICB3aWR0aCxcclxuICAgICAgICAgICAgaGVpZ2h0LFxyXG4gICAgICAgICAgICB0aWxlU2V0WCAqIHRoaXMudGlsZVdpZHRoLFxyXG4gICAgICAgICAgICB0aWxlU2V0WSAqIHRoaXMudGlsZUhlaWdodCxcclxuICAgICAgICAgICAgdGhpcy50aWxlV2lkdGgsXHJcbiAgICAgICAgICAgIHRoaXMudGlsZUhlaWdodFxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VGlsZUF0Q29vcmRpbmF0ZShcclxuICAgICAgICB4OiBudW1iZXIsXHJcbiAgICAgICAgeTogbnVtYmVyLFxyXG4gICAgICAgIHRhcmdldDogYW55LFxyXG4gICAgICAgIHhQb3M6IG51bWJlcixcclxuICAgICAgICB5UG9zOiBudW1iZXIsXHJcbiAgICAgICAgd2lkdGg6IG51bWJlcixcclxuICAgICAgICBoZWlnaHQ6IG51bWJlclxyXG4gICAgKSB7XHJcbiAgICAgICAgaWYgKHggPiB0aGlzLndpZHRoIHx8IHkgPiB0aGlzLmhlaWdodCB8fCB4IDwgMCB8fCB5IDwgMClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxyXG4gICAgICAgICAgICAgICAgYE91dCBvZiBib3VuZHMgdGlsZS4gVHJpZWQgdG8gbG9hZCB0aWxlIGF0ICR7eH0sICR7eX0gb24gYSAke3RoaXMud2lkdGh9LCAke3RoaXMuaGVpZ2h0fSBncmlkYFxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICBzdXBlci5yZW5kZXJQYXJ0aWFsKFxyXG4gICAgICAgICAgICB0YXJnZXQsXHJcbiAgICAgICAgICAgIHhQb3MsXHJcbiAgICAgICAgICAgIHlQb3MsXHJcbiAgICAgICAgICAgIHdpZHRoLFxyXG4gICAgICAgICAgICBoZWlnaHQsXHJcbiAgICAgICAgICAgIHggKiB0aGlzLnRpbGVXaWR0aCxcclxuICAgICAgICAgICAgeSAqIHRoaXMudGlsZUhlaWdodCxcclxuICAgICAgICAgICAgdGhpcy50aWxlV2lkdGgsXHJcbiAgICAgICAgICAgIHRoaXMudGlsZUhlaWdodFxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCA9IFRpbGVSZXNvdXJjZTtcclxuIiwiZXhwb3J0IGNsYXNzIENvbnRyb2wge1xyXG4gICAga2V5Ym9hcmQ6IGJvb2xlYW5cclxuICAgIGtleUNvZGU6IG51bWJlclxyXG4gICAgZGVzY3JpcHRpb246IHN0cmluZ1xyXG4gICAgb25QcmVzc2VkOiAoKSA9PiB2b2lkXHJcbiAgICBvblJlbGVhc2VkOiAoKSA9PiB2b2lkXHJcblxyXG4gICAgY29uc3RydWN0b3IoZGVzY3JpcHRpb246IHN0cmluZywga2V5Ym9hcmQ6IGJvb2xlYW4sIGtleUNvZGU6IG51bWJlciwgb25QcmVzc2VkOiAoKSA9PiB2b2lkLCBvblJlbGVhc2VkPzogKCkgPT4gdm9pZCkge1xyXG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvblxyXG4gICAgICAgIHRoaXMua2V5Ym9hcmQgPSBrZXlib2FyZDtcclxuICAgICAgICB0aGlzLmtleUNvZGUgPSBrZXlDb2RlO1xyXG4gICAgICAgIHRoaXMub25QcmVzc2VkID0gb25QcmVzc2VkO1xyXG4gICAgICAgIHRoaXMub25SZWxlYXNlZCA9IG9uUmVsZWFzZWQgfHwgZnVuY3Rpb24oKXt9Oy8vZm9yIHNvbWUgcmVhc29uIGFycm93IGZ1bmN0aW9uIGRvZXNuJ3QgbGlrZSB0byBleGlzdCBoZXJlIGJ1dCBpJ20gbm90IGdvbm5hIHdvcnJ5IHRvbyBtdWNoXHJcbiAgICAgICAgLy9pZiBpdCdzIHRvbyB1Z2x5LCB5b3UgY2FuIHRyeSB0byBmaXggaXRcclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgUmVuZGVyYWJsZSBmcm9tICcuLi9pbnRlcmZhY2VzL1JlbmRlcmFibGUnO1xyXG5pbXBvcnQgcDUgZnJvbSAncDUnO1xyXG5pbXBvcnQgeyBBdWRpb0Fzc2V0cywgVWlBc3NldHMgfSBmcm9tICcuLi9hc3NldHMvQXNzZXRzJztcclxuaW1wb3J0IEltYWdlUmVzb3VyY2UgZnJvbSAnLi4vYXNzZXRzL3Jlc291cmNlcy9JbWFnZVJlc291cmNlJztcclxuaW1wb3J0IEZvbnRSZXNvdXJjZSBmcm9tICcuLi9hc3NldHMvcmVzb3VyY2VzL0ZvbnRSZXNvdXJjZSc7XHJcblxyXG5jbGFzcyBCdXR0b24gaW1wbGVtZW50cyBSZW5kZXJhYmxlIHtcclxuXHJcbiAgICBmb250OiBGb250UmVzb3VyY2VcclxuICAgIHR4dDogc3RyaW5nXHJcbiAgICBkZXNjcmlwdGlvbjogc3RyaW5nXHJcbiAgICBvblByZXNzZWRDdXN0b206IEZ1bmN0aW9uXHJcbiAgICB4OiBudW1iZXJcclxuICAgIHk6IG51bWJlclxyXG4gICAgdzogbnVtYmVyXHJcbiAgICBoOiBudW1iZXJcclxuICAgIGltYWdlOiBJbWFnZVJlc291cmNlXHJcbiAgICBtb3VzZUlzT3ZlcjogYm9vbGVhblxyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIGZvbnQ6IEZvbnRSZXNvdXJjZSxcclxuICAgICAgICB0eHQ6IHN0cmluZyxcclxuICAgICAgICBkZXNjcmlwdGlvbjogc3RyaW5nLFxyXG4gICAgICAgIHg6IG51bWJlcixcclxuICAgICAgICB5OiBudW1iZXIsXHJcbiAgICAgICAgdzogbnVtYmVyLFxyXG4gICAgICAgIGg6IG51bWJlcixcclxuICAgICAgICBvblByZXNzZWRDdXN0b206IEZ1bmN0aW9uKSB7XHJcbiAgICAgICAgdGhpcy5mb250ID0gZm9udDtcclxuICAgICAgICB0aGlzLnR4dCA9IHR4dFxyXG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvblxyXG4gICAgICAgIHRoaXMub25QcmVzc2VkQ3VzdG9tID0gb25QcmVzc2VkQ3VzdG9tXHJcbiAgICAgICAgdGhpcy54ID0geFxyXG4gICAgICAgIHRoaXMueSA9IHlcclxuICAgICAgICB0aGlzLncgPSB3XHJcbiAgICAgICAgdGhpcy5oID0gaFxyXG4gICAgICAgIHRoaXMuaW1hZ2UgPSBVaUFzc2V0cy5idXR0b25fdW5zZWxlY3RlZDtcclxuICAgICAgICB0aGlzLm1vdXNlSXNPdmVyID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKHRhcmdldDogcDUsIHVwc2NhbGVTaXplOiBudW1iZXIpIHtcclxuICAgICAgICAvLyBzZXQgdGhlIGNvb3JkcyBhbmQgZGltZW5zaW9ucyB0byByb3VuZCB0byB0aGUgbmVhcmVzdCB1bi11cHNjYWxlZCBwaXhlbFxyXG4gICAgICAgIGNvbnN0IHggPSBNYXRoLnJvdW5kKHRoaXMueCAvIHVwc2NhbGVTaXplKSAqIHVwc2NhbGVTaXplO1xyXG4gICAgICAgIGNvbnN0IHkgPSBNYXRoLnJvdW5kKHRoaXMueSAvIHVwc2NhbGVTaXplKSAqIHVwc2NhbGVTaXplO1xyXG4gICAgICAgIGNvbnN0IHcgPSBNYXRoLnJvdW5kKHRoaXMudyAvIHVwc2NhbGVTaXplKSAqIHVwc2NhbGVTaXplO1xyXG4gICAgICAgIGNvbnN0IGggPSBNYXRoLnJvdW5kKHRoaXMuaCAvIHVwc2NhbGVTaXplKSAqIHVwc2NhbGVTaXplO1xyXG5cclxuICAgICAgICAvLyBjb3JuZXJzXHJcbiAgICAgICAgdGhpcy5pbWFnZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCwgeSwgNyAqIHVwc2NhbGVTaXplLCA3ICogdXBzY2FsZVNpemUsIDAsIDAsIDcsIDcpO1xyXG4gICAgICAgIHRoaXMuaW1hZ2UucmVuZGVyUGFydGlhbCh0YXJnZXQsIHggKyB3IC0gNyAqIHVwc2NhbGVTaXplLCB5LCA3ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgOCwgMCwgNywgNyk7XHJcbiAgICAgICAgdGhpcy5pbWFnZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCwgeSArIGggLSA3ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCAwLCA4LCA3LCA3KTtcclxuICAgICAgICB0aGlzLmltYWdlLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4ICsgdyAtIDcgKiB1cHNjYWxlU2l6ZSwgeSArIGggLSA3ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCA4LCA4LCA3LCA3KTtcclxuXHJcbiAgICAgICAgLy8gdG9wIGFuZCBib3R0b21cclxuICAgICAgICB0aGlzLmltYWdlLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4ICsgNyAqIHVwc2NhbGVTaXplLCB5LCB3IC0gMTQgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCA3LCAwLCAxLCA3KTtcclxuICAgICAgICB0aGlzLmltYWdlLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4ICsgNyAqIHVwc2NhbGVTaXplLCB5ICsgaCAtIDcgKiB1cHNjYWxlU2l6ZSwgdyAtIDE0ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgNywgOCwgMSwgNyk7XHJcblxyXG4gICAgICAgIC8vIGxlZnQgYW5kIHJpZ2h0XHJcbiAgICAgICAgdGhpcy5pbWFnZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCwgeSArIDcgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCBoIC0gMTQgKiB1cHNjYWxlU2l6ZSwgMCwgNywgNywgMSk7XHJcbiAgICAgICAgdGhpcy5pbWFnZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCArIHcgLSA3ICogdXBzY2FsZVNpemUsIHkgKyA3ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgaCAtIDE0ICogdXBzY2FsZVNpemUsIDgsIDcsIDcsIDEpO1xyXG5cclxuICAgICAgICAvLyBjZW50ZXJcclxuICAgICAgICB0aGlzLmltYWdlLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4ICsgNyAqIHVwc2NhbGVTaXplLCB5ICsgNyAqIHVwc2NhbGVTaXplLCB3IC0gMTQgKiB1cHNjYWxlU2l6ZSwgaCAtIDE0ICogdXBzY2FsZVNpemUsIDcsIDcsIDEsIDEpO1xyXG5cclxuICAgICAgICB0aGlzLmZvbnQuZHJhd1RleHQodGFyZ2V0LCB0aGlzLnR4dCwgeCArIDYgKiB1cHNjYWxlU2l6ZSwgTWF0aC5yb3VuZCgodGhpcy55ICsgdGhpcy5oIC8gMikgLyB1cHNjYWxlU2l6ZSkgKiB1cHNjYWxlU2l6ZSAtIDYgKiB1cHNjYWxlU2l6ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlTW91c2VPdmVyKG1vdXNlWDogbnVtYmVyLCBtb3VzZVk6IG51bWJlcikge1xyXG4gICAgICAgIC8vIGlmIHRoZSBtb3VzZSBwb3NpdGlvbiBpcyBpbnNpZGUgdGhlIGJ1dHRvbiwgcmV0dXJuIHRydWVcclxuICAgICAgICBpZiAobW91c2VYID4gdGhpcy54ICYmIG1vdXNlWCA8IHRoaXMueCArIHRoaXMudyAmJiBtb3VzZVkgPiB0aGlzLnkgJiYgbW91c2VZIDwgdGhpcy55ICsgdGhpcy5oKSB7XHJcbiAgICAgICAgICAgIHRoaXMubW91c2VJc092ZXIgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLmltYWdlID0gVWlBc3NldHMuYnV0dG9uX3NlbGVjdGVkO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5tb3VzZUlzT3ZlciA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLmltYWdlID0gVWlBc3NldHMuYnV0dG9uX3Vuc2VsZWN0ZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9uUHJlc3NlZCgpIHtcclxuICAgICAgICB0aGlzLm9uUHJlc3NlZEN1c3RvbSgpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiYnV0dG9uIHByZXNzZWRcIik7XHJcbiAgICAgICAgQXVkaW9Bc3NldHMudWkuaW52ZW50b3J5Q2xhY2sucGxheVJhbmRvbSgpO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuZXhwb3J0ID0gQnV0dG9uOyIsImltcG9ydCBSZW5kZXJhYmxlIGZyb20gJy4uL2ludGVyZmFjZXMvUmVuZGVyYWJsZSc7XHJcbmltcG9ydCBwNSBmcm9tICdwNSc7XHJcbmltcG9ydCB7IEtleXMsIFVpQXNzZXRzIH0gZnJvbSAnLi4vYXNzZXRzL0Fzc2V0cyc7XHJcbmltcG9ydCBJbWFnZVJlc291cmNlIGZyb20gJy4uL2Fzc2V0cy9yZXNvdXJjZXMvSW1hZ2VSZXNvdXJjZSc7XHJcbmltcG9ydCBGb250UmVzb3VyY2UgZnJvbSAnLi4vYXNzZXRzL3Jlc291cmNlcy9Gb250UmVzb3VyY2UnO1xyXG5cclxuY2xhc3MgSW5wdXRCb3ggaW1wbGVtZW50cyBSZW5kZXJhYmxlIHtcclxuXHJcbiAgICBmb250OiBGb250UmVzb3VyY2VcclxuICAgIHR4dDogc3RyaW5nXHJcbiAgICB2YWx1ZTogbnVtYmVyXHJcbiAgICBrZXlib2FyZDogYm9vbGVhblxyXG4gICAgaW5kZXg6IG51bWJlclxyXG4gICAgeDogbnVtYmVyXHJcbiAgICB5OiBudW1iZXJcclxuICAgIHc6IG51bWJlclxyXG4gICAgaDogbnVtYmVyXHJcbiAgICBpbWFnZTogSW1hZ2VSZXNvdXJjZVxyXG4gICAgbW91c2VJc092ZXI6IGJvb2xlYW5cclxuICAgIGxpc3RlbmluZzogYm9vbGVhblxyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIGZvbnQ6IEZvbnRSZXNvdXJjZSxcclxuICAgICAgICB0eHQ6IHN0cmluZyxcclxuICAgICAgICBrZXlib2FyZDogYm9vbGVhbixcclxuICAgICAgICB2YWx1ZTogbnVtYmVyLFxyXG4gICAgICAgIGluZGV4OiBudW1iZXIsLy8gdGhlIGluZGV4IGluIHRoZSBHYW1lLmNvbnRyb2xzIGFycmF5IHRoYXQgaXQgY2hhbmdlc1xyXG4gICAgICAgIHg6IG51bWJlcixcclxuICAgICAgICB5OiBudW1iZXIsXHJcbiAgICAgICAgdzogbnVtYmVyLFxyXG4gICAgICAgIGg6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuZm9udCA9IGZvbnQ7XHJcbiAgICAgICAgdGhpcy50eHQgPSB0eHRcclxuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5rZXlib2FyZCA9IGtleWJvYXJkO1xyXG4gICAgICAgIHRoaXMuaW5kZXggPSBpbmRleDtcclxuICAgICAgICB0aGlzLnggPSB4XHJcbiAgICAgICAgdGhpcy55ID0geVxyXG4gICAgICAgIHRoaXMudyA9IHdcclxuICAgICAgICB0aGlzLmggPSBoXHJcbiAgICAgICAgdGhpcy5pbWFnZSA9IFVpQXNzZXRzLmJ1dHRvbl91bnNlbGVjdGVkO1xyXG4gICAgICAgIHRoaXMubW91c2VJc092ZXIgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmxpc3RlbmluZyA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcih0YXJnZXQ6IHA1LCB1cHNjYWxlU2l6ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgLy8gc2V0IHRoZSBjb29yZHMgYW5kIGRpbWVuc2lvbnMgdG8gcm91bmQgdG8gdGhlIG5lYXJlc3QgdW4tdXBzY2FsZWQgcGl4ZWxcclxuICAgICAgICBjb25zdCB4ID0gTWF0aC5yb3VuZCh0aGlzLnggLyB1cHNjYWxlU2l6ZSkgKiB1cHNjYWxlU2l6ZTtcclxuICAgICAgICBjb25zdCB5ID0gTWF0aC5yb3VuZCh0aGlzLnkgLyB1cHNjYWxlU2l6ZSkgKiB1cHNjYWxlU2l6ZTtcclxuICAgICAgICBjb25zdCB3ID0gTWF0aC5yb3VuZCh0aGlzLncgLyB1cHNjYWxlU2l6ZSkgKiB1cHNjYWxlU2l6ZTtcclxuICAgICAgICBjb25zdCBoID0gTWF0aC5yb3VuZCh0aGlzLmggLyB1cHNjYWxlU2l6ZSkgKiB1cHNjYWxlU2l6ZTtcclxuXHJcbiAgICAgICAgLy8gY29ybmVyc1xyXG4gICAgICAgIHRoaXMuaW1hZ2UucmVuZGVyUGFydGlhbCh0YXJnZXQsIHgsIHksIDcgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCAwLCAwLCA3LCA3KTtcclxuICAgICAgICB0aGlzLmltYWdlLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4ICsgdyAtIDcgKiB1cHNjYWxlU2l6ZSwgeSwgNyAqIHVwc2NhbGVTaXplLCA3ICogdXBzY2FsZVNpemUsIDgsIDAsIDcsIDcpO1xyXG4gICAgICAgIHRoaXMuaW1hZ2UucmVuZGVyUGFydGlhbCh0YXJnZXQsIHgsIHkgKyBoIC0gNyAqIHVwc2NhbGVTaXplLCA3ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgMCwgOCwgNywgNyk7XHJcbiAgICAgICAgdGhpcy5pbWFnZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCArIHcgLSA3ICogdXBzY2FsZVNpemUsIHkgKyBoIC0gNyAqIHVwc2NhbGVTaXplLCA3ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgOCwgOCwgNywgNyk7XHJcblxyXG4gICAgICAgIC8vIHRvcCBhbmQgYm90dG9tXHJcbiAgICAgICAgdGhpcy5pbWFnZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCArIDcgKiB1cHNjYWxlU2l6ZSwgeSwgdyAtIDE0ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgNywgMCwgMSwgNyk7XHJcbiAgICAgICAgdGhpcy5pbWFnZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCArIDcgKiB1cHNjYWxlU2l6ZSwgeSArIGggLSA3ICogdXBzY2FsZVNpemUsIHcgLSAxNCAqIHVwc2NhbGVTaXplLCA3ICogdXBzY2FsZVNpemUsIDcsIDgsIDEsIDcpO1xyXG5cclxuICAgICAgICAvLyBsZWZ0IGFuZCByaWdodFxyXG4gICAgICAgIHRoaXMuaW1hZ2UucmVuZGVyUGFydGlhbCh0YXJnZXQsIHgsIHkgKyA3ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgaCAtIDE0ICogdXBzY2FsZVNpemUsIDAsIDcsIDcsIDEpO1xyXG4gICAgICAgIHRoaXMuaW1hZ2UucmVuZGVyUGFydGlhbCh0YXJnZXQsIHggKyB3IC0gNyAqIHVwc2NhbGVTaXplLCB5ICsgNyAqIHVwc2NhbGVTaXplLCA3ICogdXBzY2FsZVNpemUsIGggLSAxNCAqIHVwc2NhbGVTaXplLCA4LCA3LCA3LCAxKTtcclxuXHJcbiAgICAgICAgLy8gY2VudGVyXHJcbiAgICAgICAgdGhpcy5pbWFnZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCArIDcgKiB1cHNjYWxlU2l6ZSwgeSArIDcgKiB1cHNjYWxlU2l6ZSwgdyAtIDE0ICogdXBzY2FsZVNpemUsIGggLSAxNCAqIHVwc2NhbGVTaXplLCA3LCA3LCAxLCAxKTtcclxuXHJcbiAgICAgICAgaWYodGhpcy5saXN0ZW5pbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5mb250LmRyYXdUZXh0KHRhcmdldCwgdGhpcy50eHQrXCI6IGNsaWNrIHRvIGNhbmNlbFwiLCB4ICsgNiAqIHVwc2NhbGVTaXplLCBNYXRoLnJvdW5kKCh0aGlzLnkgKyB0aGlzLmggLyAyKSAvIHVwc2NhbGVTaXplKSAqIHVwc2NhbGVTaXplIC0gNiAqIHVwc2NhbGVTaXplKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmKHRoaXMua2V5Ym9hcmQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZm9udC5kcmF3VGV4dCh0YXJnZXQsIHRoaXMudHh0K1wiOiAgIFwiK0tleXMua2V5Ym9hcmRNYXBbdGhpcy52YWx1ZV0sIHggKyA2ICogdXBzY2FsZVNpemUsIE1hdGgucm91bmQoKHRoaXMueSArIHRoaXMuaCAvIDIpIC8gdXBzY2FsZVNpemUpICogdXBzY2FsZVNpemUgLSA2ICogdXBzY2FsZVNpemUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mb250LmRyYXdUZXh0KHRhcmdldCwgdGhpcy50eHQrXCI6ICAgTW91c2UgXCIrdGhpcy52YWx1ZSwgeCArIDYgKiB1cHNjYWxlU2l6ZSwgTWF0aC5yb3VuZCgodGhpcy55ICsgdGhpcy5oIC8gMikgLyB1cHNjYWxlU2l6ZSkgKiB1cHNjYWxlU2l6ZSAtIDYgKiB1cHNjYWxlU2l6ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlTW91c2VPdmVyKG1vdXNlWDogbnVtYmVyLCBtb3VzZVk6IG51bWJlcikge1xyXG4gICAgICAgIC8vIGlmIHRoZSBtb3VzZSBwb3NpdGlvbiBpcyBpbnNpZGUgdGhlIGJ1dHRvbiwgcmV0dXJuIHRydWVcclxuICAgICAgICBpZiAobW91c2VYID4gdGhpcy54ICYmIG1vdXNlWCA8IHRoaXMueCArIHRoaXMudyAmJiBtb3VzZVkgPiB0aGlzLnkgJiYgbW91c2VZIDwgdGhpcy55ICsgdGhpcy5oKSB7XHJcbiAgICAgICAgICAgIHRoaXMubW91c2VJc092ZXIgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5tb3VzZUlzT3ZlciA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvblByZXNzZWQoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJpbnB1dCBib3ggcHJlc3NlZFwiKTtcclxuICAgICAgICB0aGlzLmxpc3RlbmluZyA9ICF0aGlzLmxpc3RlbmluZztcclxuICAgICAgICBpZih0aGlzLmxpc3RlbmluZykge1xyXG4gICAgICAgICAgICB0aGlzLmltYWdlID0gVWlBc3NldHMuYnV0dG9uX3NlbGVjdGVkO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuaW1hZ2UgPSBVaUFzc2V0cy5idXR0b25fdW5zZWxlY3RlZDtcclxuICAgICAgICAvLyBBdWRpb0Fzc2V0cy51aS5pbnZlbnRvcnlDbGFjay5wbGF5UmFuZG9tKCk7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQgPSBJbnB1dEJveDsiLCJpbXBvcnQgUmVuZGVyYWJsZSBmcm9tICcuLi9pbnRlcmZhY2VzL1JlbmRlcmFibGUnO1xyXG5pbXBvcnQgcDUgZnJvbSAncDUnO1xyXG5pbXBvcnQgeyBVaUFzc2V0cyB9IGZyb20gJy4uL2Fzc2V0cy9Bc3NldHMnO1xyXG5pbXBvcnQgZ2FtZSBmcm9tICcuLi9NYWluJ1xyXG5pbXBvcnQgRm9udFJlc291cmNlIGZyb20gJy4uL2Fzc2V0cy9yZXNvdXJjZXMvRm9udFJlc291cmNlJztcclxuXHJcbmNsYXNzIFNsaWRlciBpbXBsZW1lbnRzIFJlbmRlcmFibGUge1xyXG5cclxuICAgIHZhbHVlOiBudW1iZXJcclxuICAgIG1pbjogbnVtYmVyXHJcbiAgICBtYXg6IG51bWJlclxyXG4gICAgc3RlcDogbnVtYmVyXHJcbiAgICBvbkNoYW5nZWQ6IEZ1bmN0aW9uXHJcbiAgICB4OiBudW1iZXJcclxuICAgIHk6IG51bWJlclxyXG4gICAgdzogbnVtYmVyXHJcbiAgICBoOiBudW1iZXJcclxuICAgIGJlaW5nRWRpdGVkOiBib29sZWFuXHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgZm9udDogRm9udFJlc291cmNlLFxyXG4gICAgICAgIHR4dDogc3RyaW5nLFxyXG4gICAgICAgIHZhbHVlOm51bWJlcixcclxuICAgICAgICBtaW46IG51bWJlcixcclxuICAgICAgICBtYXg6IG51bWJlcixcclxuICAgICAgICBzdGVwOiBudW1iZXIsXHJcbiAgICAgICAgeDogbnVtYmVyLFxyXG4gICAgICAgIHk6IG51bWJlcixcclxuICAgICAgICB3OiBudW1iZXIsXHJcbiAgICAgICAgaDogbnVtYmVyLFxyXG4gICAgICAgIG9uQ2hhbmdlZDogRnVuY3Rpb24pIHtcclxuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWVcclxuICAgICAgICB0aGlzLm1pbiA9IG1pblxyXG4gICAgICAgIHRoaXMubWF4ID0gbWF4XHJcbiAgICAgICAgdGhpcy5zdGVwID0gc3RlcFxyXG4gICAgICAgIHRoaXMub25DaGFuZ2VkID0gb25DaGFuZ2VkXHJcbiAgICAgICAgdGhpcy54ID0geFxyXG4gICAgICAgIHRoaXMueSA9IHlcclxuICAgICAgICB0aGlzLncgPSB3XHJcbiAgICAgICAgdGhpcy5oID0gaFxyXG4gICAgICAgIHRoaXMuYmVpbmdFZGl0ZWQgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIodGFyZ2V0OiBwNSwgdXBzY2FsZVNpemU6IG51bWJlcikge1xyXG4gICAgICAgIC8vIHNldCB0aGUgY29vcmRzIGFuZCBkaW1lbnNpb25zIHRvIHJvdW5kIHRvIHRoZSBuZWFyZXN0IHVuLXVwc2NhbGVkIHBpeGVsXHJcbiAgICAgICAgY29uc3QgeCA9IE1hdGgucm91bmQodGhpcy54L3Vwc2NhbGVTaXplKSp1cHNjYWxlU2l6ZTtcclxuICAgICAgICBjb25zdCB5ID0gTWF0aC5yb3VuZCgodGhpcy55K3RoaXMuaC8yKS91cHNjYWxlU2l6ZSkqdXBzY2FsZVNpemU7XHJcbiAgICAgICAgY29uc3QgdyA9IE1hdGgucm91bmQodGhpcy53L3Vwc2NhbGVTaXplKSp1cHNjYWxlU2l6ZTtcclxuXHJcbiAgICAgICAgLy8gbGVmdCBzaWRlIG9mIHNsaWRlciBiYXJcclxuICAgICAgICBVaUFzc2V0cy5zbGlkZXJfYmFyLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4LCB5LTIqdXBzY2FsZVNpemUsIDIqdXBzY2FsZVNpemUsIDQqdXBzY2FsZVNpemUsIDAsIDAsIDIsIDQpO1xyXG4gICAgICAgIC8vIHJpZ2h0IHNpZGUgb2Ygc2xpZGVyIGJhclxyXG4gICAgICAgIFVpQXNzZXRzLnNsaWRlcl9iYXIucmVuZGVyUGFydGlhbCh0YXJnZXQsIHgrdy0yKnVwc2NhbGVTaXplLCB5LTIqdXBzY2FsZVNpemUsIDIqdXBzY2FsZVNpemUsIDQqdXBzY2FsZVNpemUsIDMsIDAsIDIsIDQpO1xyXG4gICAgICAgIC8vIGNlbnRlciBvZiBzbGlkZXIgYmFyXHJcbiAgICAgICAgVWlBc3NldHMuc2xpZGVyX2Jhci5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCsyKnVwc2NhbGVTaXplLCB5LTIqdXBzY2FsZVNpemUsIHctNCp1cHNjYWxlU2l6ZSwgNCp1cHNjYWxlU2l6ZSwgMiwgMCwgMSwgNCk7XHJcbiAgICAgICAgLy8gaGFuZGxlXHJcbiAgICAgICAgVWlBc3NldHMuc2xpZGVyX2hhbmRsZS5yZW5kZXIodGFyZ2V0LCB4K01hdGgucm91bmQoKHRoaXMudmFsdWUtdGhpcy5taW4pLyh0aGlzLm1heC10aGlzLm1pbikqKHctOCp1cHNjYWxlU2l6ZSkvdXBzY2FsZVNpemUpKnVwc2NhbGVTaXplLCB5LTQqdXBzY2FsZVNpemUsIDgqdXBzY2FsZVNpemUsIDkqdXBzY2FsZVNpemUpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVNsaWRlclBvc2l0aW9uKG1vdXNlWDogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYodGhpcy5iZWluZ0VkaXRlZCl7XHJcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSBNYXRoLm1heCh0aGlzLm1pbiwgTWF0aC5taW4odGhpcy5tYXgsIE1hdGgucm91bmQoKHRoaXMubWluKyh0aGlzLm1heC10aGlzLm1pbikqKCgobW91c2VYLXRoaXMueC00KmdhbWUudXBzY2FsZVNpemUpIC8gKHRoaXMudy0oOCpnYW1lLnVwc2NhbGVTaXplKSkpKSkvdGhpcy5zdGVwKSp0aGlzLnN0ZXApKTtcclxuICAgICAgICAgICAgdGhpcy5vbkNoYW5nZWQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQgPSBTbGlkZXI7IiwiaW1wb3J0IFJlbmRlcmFibGUgZnJvbSAnLi4vaW50ZXJmYWNlcy9SZW5kZXJhYmxlJztcclxuaW1wb3J0IHA1IGZyb20gJ3A1JztcclxuaW1wb3J0IHsgVWlBc3NldHMgfSBmcm9tICcuLi9hc3NldHMvQXNzZXRzJztcclxuXHJcbmNsYXNzIFVpRnJhbWUgaW1wbGVtZW50cyBSZW5kZXJhYmxlIHtcclxuXHJcbiAgICB4OiBudW1iZXJcclxuICAgIHk6IG51bWJlclxyXG4gICAgdzogbnVtYmVyXHJcbiAgICBoOiBudW1iZXJcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICB4OiBudW1iZXIsXHJcbiAgICAgICAgeTogbnVtYmVyLFxyXG4gICAgICAgIHc6IG51bWJlcixcclxuICAgICAgICBoOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnggPSB4XHJcbiAgICAgICAgdGhpcy55ID0geVxyXG4gICAgICAgIHRoaXMudyA9IHdcclxuICAgICAgICB0aGlzLmggPSBoXHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKHRhcmdldDogcDUsIHVwc2NhbGVTaXplOiBudW1iZXIpIHtcclxuICAgICAgICAvLyBzZXQgdGhlIGNvb3JkcyBhbmQgZGltZW5zaW9ucyB0byByb3VuZCB0byB0aGUgbmVhcmVzdCB1bi11cHNjYWxlZCBwaXhlbFxyXG4gICAgICAgIGNvbnN0IHggPSBNYXRoLnJvdW5kKHRoaXMueC91cHNjYWxlU2l6ZSkqdXBzY2FsZVNpemU7XHJcbiAgICAgICAgY29uc3QgeSA9IE1hdGgucm91bmQodGhpcy55L3Vwc2NhbGVTaXplKSp1cHNjYWxlU2l6ZTtcclxuICAgICAgICBjb25zdCB3ID0gTWF0aC5yb3VuZCh0aGlzLncvdXBzY2FsZVNpemUpKnVwc2NhbGVTaXplO1xyXG4gICAgICAgIGNvbnN0IGggPSBNYXRoLnJvdW5kKHRoaXMuaC91cHNjYWxlU2l6ZSkqdXBzY2FsZVNpemU7XHJcblxyXG4gICAgICAgIC8vIGNvcm5lcnNcclxuICAgICAgICBVaUFzc2V0cy51aV9mcmFtZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCwgeSwgNyp1cHNjYWxlU2l6ZSwgNyp1cHNjYWxlU2l6ZSwgMCwgMCwgNywgNyk7XHJcbiAgICAgICAgVWlBc3NldHMudWlfZnJhbWUucmVuZGVyUGFydGlhbCh0YXJnZXQsIHgrdy03KnVwc2NhbGVTaXplLCB5LCA3KnVwc2NhbGVTaXplLCA3KnVwc2NhbGVTaXplLCA4LCAwLCA3LCA3KTtcclxuICAgICAgICBVaUFzc2V0cy51aV9mcmFtZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCwgeStoLTcqdXBzY2FsZVNpemUsIDcqdXBzY2FsZVNpemUsIDcqdXBzY2FsZVNpemUsIDAsIDgsIDcsIDcpO1xyXG4gICAgICAgIFVpQXNzZXRzLnVpX2ZyYW1lLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4K3ctNyp1cHNjYWxlU2l6ZSwgeStoLTcqdXBzY2FsZVNpemUsIDcqdXBzY2FsZVNpemUsIDcqdXBzY2FsZVNpemUsIDgsIDgsIDcsIDcpO1xyXG5cclxuICAgICAgICAvLyB0b3AgYW5kIGJvdHRvbVxyXG4gICAgICAgIFVpQXNzZXRzLnVpX2ZyYW1lLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4KzcqdXBzY2FsZVNpemUsIHksIHctMTQqdXBzY2FsZVNpemUsIDcqdXBzY2FsZVNpemUsIDcsIDAsIDEsIDcpO1xyXG4gICAgICAgIFVpQXNzZXRzLnVpX2ZyYW1lLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4KzcqdXBzY2FsZVNpemUsIHkraC03KnVwc2NhbGVTaXplLCB3LTE0KnVwc2NhbGVTaXplLCA3KnVwc2NhbGVTaXplLCA3LCA4LCAxLCA3KTtcclxuXHJcbiAgICAgICAgLy8gbGVmdCBhbmQgcmlnaHRcclxuICAgICAgICBVaUFzc2V0cy51aV9mcmFtZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCwgeSs3KnVwc2NhbGVTaXplLCA3KnVwc2NhbGVTaXplLCBoLTE0KnVwc2NhbGVTaXplLCAwLCA3LCA3LCAxKTtcclxuICAgICAgICBVaUFzc2V0cy51aV9mcmFtZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCt3LTcqdXBzY2FsZVNpemUsIHkrNyp1cHNjYWxlU2l6ZSwgNyp1cHNjYWxlU2l6ZSwgaC0xNCp1cHNjYWxlU2l6ZSwgOCwgNywgNywgMSk7XHJcblxyXG4gICAgICAgIC8vIGNlbnRlclxyXG4gICAgICAgIFVpQXNzZXRzLnVpX2ZyYW1lLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4KzcqdXBzY2FsZVNpemUsIHkrNyp1cHNjYWxlU2l6ZSwgdy0xNCp1cHNjYWxlU2l6ZSwgaC0xNCp1cHNjYWxlU2l6ZSwgNywgNywgMSwgMSk7XHJcblxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgPSBVaUZyYW1lOyIsImltcG9ydCBSZW5kZXJhYmxlIGZyb20gJy4uL2ludGVyZmFjZXMvUmVuZGVyYWJsZSc7XHJcbmltcG9ydCBwNSBmcm9tICdwNSc7XHJcbmltcG9ydCBCdXR0b24gZnJvbSAnLi4vdWkvQnV0dG9uJztcclxuaW1wb3J0IFNsaWRlciBmcm9tICcuLi91aS9TbGlkZXInO1xyXG5pbXBvcnQgVWlGcmFtZSBmcm9tICcuL1VpRnJhbWUnO1xyXG5pbXBvcnQgZ2FtZSBmcm9tICcuLi9NYWluJztcclxuaW1wb3J0IElucHV0Qm94IGZyb20gJy4vSW5wdXRCb3gnO1xyXG5pbXBvcnQgeyBVaUFzc2V0cyB9IGZyb20gJy4uL2Fzc2V0cy9Bc3NldHMnO1xyXG5cclxuYWJzdHJhY3QgY2xhc3MgVWlTY3JlZW4gaW1wbGVtZW50cyBSZW5kZXJhYmxlIHtcclxuXHJcbiAgICBidXR0b25zOiBCdXR0b25bXTtcclxuICAgIHNsaWRlcnM6IFNsaWRlcltdO1xyXG4gICAgaW5wdXRCb3hlczogSW5wdXRCb3hbXTtcclxuXHJcbiAgICBmcmFtZTogVWlGcmFtZVxyXG5cclxuICAgIGFic3RyYWN0IHJlbmRlcih0YXJnZXQ6IHA1LCB1cHNjYWxlU2l6ZTogbnVtYmVyKTogdm9pZDtcclxuXHJcbiAgICBhYnN0cmFjdCB3aW5kb3dVcGRhdGUoKTogdm9pZFxyXG5cclxuICAgIG1vdXNlUHJlc3NlZChidG46IG51bWJlcikge1xyXG4gICAgICAgIGlmKHRoaXMuYnV0dG9ucyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIC8vIGxvb3AgdGhyb3VnaCBhbGwgdGhlIGJ1dHRvbnMgaW4gdGhpcyBtZW51IGFuZCBpZiB0aGUgbW91c2UgaXMgb3ZlciB0aGVtLCB0aGVuIGNhbGwgdGhlIGJ1dHRvbidzIG9uUHJlc3NlZCgpIGZ1bmN0aW9uLiAgVGhlIG9uUHJlc3NlZCgpIGZ1bmN0aW9uIGlzIHBhc3NlZCBpbiB0aHJvdWdoIHRoZSBjb25zdHJ1Y3Rvci5cclxuICAgICAgICAgICAgZm9yKGNvbnN0IGkgb2YgdGhpcy5idXR0b25zKSB7XHJcbiAgICAgICAgICAgICAgICBpZihpLm1vdXNlSXNPdmVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaS5vblByZXNzZWQoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5zbGlkZXJzICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgLy8gbG9vcCB0aHJvdWdoIGFsbCB0aGUgc2xpZGVycyBhbmQgaW50ZXJhY3Qgd2l0aCB0aGVtIGFjY29yZGluZ2x5XHJcbiAgICAgICAgICAgIGZvcihjb25zdCBpIG9mIHRoaXMuc2xpZGVycykge1xyXG4gICAgICAgICAgICAgICAgaS51cGRhdGVTbGlkZXJQb3NpdGlvbihnYW1lLm1vdXNlWCk7XHJcbiAgICAgICAgICAgICAgICBpZihnYW1lLm1vdXNlWD5pLnggJiYgZ2FtZS5tb3VzZVg8aS54K2kudyAmJiBnYW1lLm1vdXNlWT5pLnkgJiYgZ2FtZS5tb3VzZVk8aS55K2kuaClcclxuICAgICAgICAgICAgICAgICAgICBpLmJlaW5nRWRpdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLmlucHV0Qm94ZXMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAvLyBsb29wIHRocm91Z2ggYWxsIHRoZSBpbnB1dCBib3hlcyBhbmQgaW50ZXJhY3Qgd2l0aCB0aGVtIGFjY29yZGluZ2x5XHJcbiAgICAgICAgICAgIGZvcihjb25zdCBpIG9mIHRoaXMuaW5wdXRCb3hlcykge1xyXG4gICAgICAgICAgICAgICAgaWYoaS5tb3VzZUlzT3Zlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGkub25QcmVzc2VkKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmKGkubGlzdGVuaW5nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaS5saXN0ZW5pbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBnYW1lLmNvbnRyb2xzW2kuaW5kZXhdLmtleUNvZGUgPSBidG47XHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS5jb250cm9sc1tpLmluZGV4XS5rZXlib2FyZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGkudmFsdWUgPSBidG47XHJcbiAgICAgICAgICAgICAgICAgICAgaS5rZXlib2FyZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGkuaW1hZ2UgPSBVaUFzc2V0cy5idXR0b25fdW5zZWxlY3RlZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBtb3VzZVJlbGVhc2VkKCkge1xyXG4gICAgICAgIGlmKHRoaXMuc2xpZGVycyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIC8vIGxvb3AgdGhyb3VnaCBhbGwgdGhlIHNsaWRlcnMgYW5kIGludGVyYWN0IHdpdGggdGhlbSBhY2NvcmRpbmdseVxyXG4gICAgICAgICAgICBmb3IoY29uc3QgaSBvZiB0aGlzLnNsaWRlcnMpIHtcclxuICAgICAgICAgICAgICAgIGkuYmVpbmdFZGl0ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCA9IFVpU2NyZWVuIiwiaW1wb3J0IFVpU2NyZWVuIGZyb20gJy4uL1VpU2NyZWVuJztcclxuaW1wb3J0IHA1IGZyb20gJ3A1JztcclxuaW1wb3J0IFVpRnJhbWUgZnJvbSAnLi4vVWlGcmFtZSc7XHJcbmltcG9ydCBnYW1lIGZyb20gJy4uLy4uL01haW4nO1xyXG5pbXBvcnQgQnV0dG9uIGZyb20gJy4uL0J1dHRvbic7XHJcbmltcG9ydCBGb250UmVzb3VyY2UgZnJvbSAnLi4vLi4vYXNzZXRzL3Jlc291cmNlcy9Gb250UmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBPcHRpb25zTWVudSB9IGZyb20gJy4vT3B0aW9uc01lbnUnO1xyXG5pbXBvcnQgSW5wdXRCb3ggZnJvbSAnLi4vSW5wdXRCb3gnO1xyXG5pbXBvcnQgeyBDb250cm9sIH0gZnJvbSAnLi4vLi4vaW5wdXQvQ29udHJvbCdcclxuXHJcbmV4cG9ydCBjbGFzcyBDb250cm9sc01lbnUgZXh0ZW5kcyBVaVNjcmVlbiB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZm9udDogRm9udFJlc291cmNlKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICAvLyBtYWtlIHRoZSBmcmFtZSB3aXRoIHNvbWUgZGVmYXVsdCB2YWx1ZXMuICBUaGVzZSB3aWxsIGxhdGVyIGJlIGNoYW5nZWQgdG8gZml0IHRoZSBzY3JlZW4gc2l6ZS5cclxuICAgICAgICB0aGlzLmZyYW1lID0gbmV3IFVpRnJhbWUoMCwgMCwgMCwgMCk7XHJcblxyXG4gICAgICAgIC8vIG1ha2Ugc29tZSBidXR0b25zIHdpdGggZGVmYXVsdCBwb3NpdGlvbnNcclxuICAgICAgICB0aGlzLmJ1dHRvbnMgPSBbXHJcbiAgICAgICAgICAgIG5ldyBCdXR0b24oZm9udCwgXCJCYWNrXCIsIFwiUmV0dXJuIHRvIHRoZSBvcHRpb25zIG1lbnUuXCIsIDAsIDAsIDAsIDAsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwib3B0aW9ucyBtZW51XCIpO1xyXG4gICAgICAgICAgICAgICAgZ2FtZS5jdXJyZW50VWkgPSBuZXcgT3B0aW9uc01lbnUoZm9udCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgXTtcclxuXHJcbiAgICAgICAgdGhpcy5pbnB1dEJveGVzID0gW1xyXG4gICAgICAgICAgICAvLyBuZXcgSW5wdXRCb3goZm9udCwgXCJXYWxrIFJpZ2h0XCIsIHRydWUsIDY4LCAwLCAwLCAwLCAwLCAwKSxcclxuICAgICAgICAgICAgLy8gbmV3IElucHV0Qm94KGZvbnQsIFwiV2FsayBMZWZ0XCIsIHRydWUsIDY1LCAxLCAwLCAwLCAwLCAwKSxcclxuICAgICAgICAgICAgLy8gbmV3IElucHV0Qm94KGZvbnQsIFwiSnVtcFwiLCB0cnVlLCAzMiwgMiwgMCwgMCwgMCwgMCksXHJcbiAgICAgICAgICAgIC8vIG5ldyBJbnB1dEJveChmb250LCBcIlBhdXNlXCIsIHRydWUsIDI3LCAzLCAwLCAwLCAwLCAwKVxyXG4gICAgICAgIF1cclxuICAgICAgICBcclxuICAgICAgICBsZXQgaSA9IDA7XHJcbiAgICAgICAgZm9yKGxldCBjb250cm9sIG9mIGdhbWUuY29udHJvbHMpIHtcclxuICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICB0aGlzLmlucHV0Qm94ZXMucHVzaChuZXcgSW5wdXRCb3goZm9udCwgY29udHJvbC5kZXNjcmlwdGlvbiwgY29udHJvbC5rZXlib2FyZCwgY29udHJvbC5rZXlDb2RlLCBpLCAwLCAwLCAwLCAwKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHVwZGF0ZSB0aGUgc2l6ZSBvZiB0aGUgZWxlbWVudHMgYmFzZWQgb24gdGhlIGluaXRpYWwgc2NyZWVuIHNpemVcclxuICAgICAgICB0aGlzLndpbmRvd1VwZGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcih0YXJnZXQ6IHA1LCB1cHNjYWxlU2l6ZTogbnVtYmVyKTogdm9pZCB7XHJcblxyXG4gICAgICAgIC8vIHJlbmRlciB0aGUgcmVjdGFuZ3VsYXIgaW1hZ2VcclxuICAgICAgICB0aGlzLmZyYW1lLnJlbmRlcih0YXJnZXQsIHVwc2NhbGVTaXplKTtcclxuXHJcbiAgICAgICAgLy8gbG9vcCB0aHJvdWdoIHRoZSBidXR0b25zIGFycmF5IGFuZCByZW5kZXIgZWFjaCBvbmUuXHJcbiAgICAgICAgdGhpcy5idXR0b25zLmZvckVhY2goYnV0dG9uID0+IHtcclxuICAgICAgICAgICAgYnV0dG9uLnJlbmRlcih0YXJnZXQsIHVwc2NhbGVTaXplKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gbG9vcCB0aHJvdWdoIHRoZSBpbnB1dEJveGVzIGFycmF5IGFuZCByZW5kZXIgZWFjaCBvbmUuXHJcbiAgICAgICAgdGhpcy5pbnB1dEJveGVzLmZvckVhY2goaW5wdXRCb3ggPT4ge1xyXG4gICAgICAgICAgICBpbnB1dEJveC5yZW5kZXIodGFyZ2V0LCB1cHNjYWxlU2l6ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgd2luZG93VXBkYXRlKCkge1xyXG4gICAgICAgIC8vIHNldCB0aGUgcG9zaXRpb24gb2YgdGhlIGZyYW1lXHJcbiAgICAgICAgdGhpcy5mcmFtZS54ID0gZ2FtZS53aWR0aCAvIDIgLSAyMDAgLyAyICogZ2FtZS51cHNjYWxlU2l6ZTsvLyBjZW50ZXIgdGhlIGZyYW1lIGluIHRoZSBjZW50ZXIgb2YgdGhlIHNjcmVlblxyXG4gICAgICAgIHRoaXMuZnJhbWUueSA9IGdhbWUuaGVpZ2h0IC8gMiAtIDU2ICogZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICB0aGlzLmZyYW1lLncgPSAyMDAgKiBnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgIHRoaXMuZnJhbWUuaCA9IDQ4ICogZ2FtZS51cHNjYWxlU2l6ZTtcclxuXHJcbiAgICAgICAgLy8gc2V0IHRoZSBwb3NpdGlvbnMgb2YgdGhlIGJ1dHRvblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS54ID0gZ2FtZS53aWR0aCAvIDIgLSAxOTIgLyAyICogZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLnkgPSBnYW1lLmhlaWdodCAvIDIgKyAyMCAqIGkgKiBnYW1lLnVwc2NhbGVTaXplICsgMjAgKiBnYW1lLnVwc2NhbGVTaXplICogdGhpcy5pbnB1dEJveGVzLmxlbmd0aDtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLncgPSAxOTIgKiBnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0uaCA9IDE2ICogZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLnVwZGF0ZU1vdXNlT3ZlcihnYW1lLm1vdXNlWCwgZ2FtZS5tb3VzZVkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gc2V0IHRoZSBwb3NpdGlvbnMgb2YgYWxsIHRoZSBpbnB1dCBib3hlc1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW5wdXRCb3hlc1tpXS54ID0gZ2FtZS53aWR0aCAvIDIgLSAxOTIgLyAyICogZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5pbnB1dEJveGVzW2ldLnkgPSBnYW1lLmhlaWdodCAvIDIgKyAyMCAqIGkgKiBnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLmlucHV0Qm94ZXNbaV0udyA9IDE5MiAqIGdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuaW5wdXRCb3hlc1tpXS5oID0gMTYgKiBnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmlucHV0Qm94ZXNbaV0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgVWlTY3JlZW4gZnJvbSAnLi4vVWlTY3JlZW4nO1xyXG5pbXBvcnQgcDUgZnJvbSAncDUnO1xyXG5pbXBvcnQgVWlGcmFtZSBmcm9tICcuLi9VaUZyYW1lJztcclxuaW1wb3J0IGdhbWUgZnJvbSAnLi4vLi4vTWFpbic7XHJcbmltcG9ydCBCdXR0b24gZnJvbSAnLi4vQnV0dG9uJztcclxuaW1wb3J0IFNsaWRlciBmcm9tICcuLi9TbGlkZXInO1xyXG5pbXBvcnQgeyBPcHRpb25zTWVudSB9IGZyb20gJy4vT3B0aW9uc01lbnUnO1xyXG5pbXBvcnQgRm9udFJlc291cmNlIGZyb20gJy4uLy4uL2Fzc2V0cy9yZXNvdXJjZXMvRm9udFJlc291cmNlJztcclxuaW1wb3J0IHsgVWlBc3NldHMgfSBmcm9tICcuLi8uLi9hc3NldHMvQXNzZXRzJztcclxuaW1wb3J0IHsgV29ybGRDcmVhdGlvbk1lbnUgfSBmcm9tICcuL1dvcmxkQ3JlYXRpb25NZW51JztcclxuXHJcbmV4cG9ydCBjbGFzcyBNYWluTWVudSBleHRlbmRzIFVpU2NyZWVuIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihmb250OiBGb250UmVzb3VyY2UpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICAvLyBtYWtlIHRoZSBmcmFtZSB3aXRoIHNvbWUgZGVmYXVsdCB2YWx1ZXMuICBUaGVzZSB3aWxsIGxhdGVyIGJlIGNoYW5nZWQgdG8gZml0IHRoZSBzY3JlZW4gc2l6ZS5cclxuICAgICAgICB0aGlzLmZyYW1lID0gbmV3IFVpRnJhbWUoMCwgMCwgMCwgMCk7XHJcblxyXG4gICAgICAgIC8vIG1ha2UgNCBidXR0b25zIHdpdGggZGVmYXVsdCBwb3NpdGlvbnNcclxuICAgICAgICB0aGlzLmJ1dHRvbnMgPSBbXHJcbiAgICAgICAgICAgIG5ldyBCdXR0b24oZm9udCwgXCJSZXN1bWUgR2FtZVwiLCBcIktlZXAgcGxheWluZyB3aGVyZSB5b3UgbGVmdCBvZmYuXCIsIDAsIDAsIDAsIDAsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicmVzdW1lIGdhbWVcIik7XHJcbiAgICAgICAgICAgICAgICBnYW1lLmN1cnJlbnRVaSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIG5ldyBCdXR0b24oZm9udCwgXCJOZXcgR2FtZVwiLCBcIkNyZWF0ZXMgYSBuZXcgc2VydmVyIHRoYXQgeW91ciBmcmllbmRzIGNhbiBqb2luLlwiLCAwLCAwLCAwLCAwLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm5ldyBnYW1lXCIpO1xyXG4gICAgICAgICAgICAgICAgZ2FtZS5jdXJyZW50VWkgPSBuZXcgV29ybGRDcmVhdGlvbk1lbnUoZm9udCk7XHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBuZXcgQnV0dG9uKGZvbnQsIFwiSm9pbiBHYW1lXCIsIFwiSm9pbiBhIGdhbWUgd2l0aCB5b3VyIGZyaWVuZHMsIG9yIG1ha2UgbmV3IG9uZXMuXCIsIDAsIDAsIDAsIDAsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiam9pbiBnYW1lXCIpO1xyXG4gICAgICAgICAgICAgICAgZ2FtZS5jdXJyZW50VWkgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBuZXcgQnV0dG9uKGZvbnQsIFwiT3B0aW9uc1wiLCBcIkNoYW5nZSB5b3VyIGtleWJpbmRzLCByZWR1Y2UgbGFnLCBldGMuXCIsIDAsIDAsIDAsIDAsICgpID0+e1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJvcHRpb25zXCIpO1xyXG4gICAgICAgICAgICAgICAgZ2FtZS5jdXJyZW50VWkgPSBuZXcgT3B0aW9uc01lbnUoZm9udCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgXTtcclxuXHJcbiAgICAgICAgLy8gdXBkYXRlIHRoZSBzaXplIG9mIHRoZSBlbGVtZW50cyBiYXNlZCBvbiB0aGUgaW5pdGlhbCBzY3JlZW4gc2l6ZVxyXG4gICAgICAgIHRoaXMud2luZG93VXBkYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKHRhcmdldDogcDUsIHVwc2NhbGVTaXplOiBudW1iZXIpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgLy8gcmVuZGVyIHRoZSByZWN0YW5ndWxhciBpbWFnZSB0aGF0IHRoZSB3aG9sZSBtZW51IGlzIG9uXHJcbiAgICAgICAgdGhpcy5mcmFtZS5yZW5kZXIodGFyZ2V0LCB1cHNjYWxlU2l6ZSk7XHJcblxyXG4gICAgICAgIFVpQXNzZXRzLnRpdGxlX2ltYWdlLnJlbmRlcih0YXJnZXQsIE1hdGgucm91bmQodGhpcy5mcmFtZS54L3Vwc2NhbGVTaXplKzEpKnVwc2NhbGVTaXplLCBNYXRoLnJvdW5kKHRoaXMuZnJhbWUueS91cHNjYWxlU2l6ZSs0KSp1cHNjYWxlU2l6ZSwgMjU2KnVwc2NhbGVTaXplLCA0MCp1cHNjYWxlU2l6ZSk7XHJcblxyXG4gICAgICAgIC8vIGxvb3AgdGhyb3VnaCB0aGUgYnV0dG9ucyBhcnJheSBhbmQgcmVuZGVyIGVhY2ggb25lLlxyXG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB0aGlzLmJ1dHRvbnMpIHtcclxuICAgICAgICAgICAgaXRlbS5yZW5kZXIodGFyZ2V0LCB1cHNjYWxlU2l6ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICB3aW5kb3dVcGRhdGUoKSB7XHJcbiAgICAgICAgLy8gc2V0IHRoZSBwb3NpdGlvbiBvZiB0aGUgZnJhbWVcclxuICAgICAgICB0aGlzLmZyYW1lLnggPSBnYW1lLndpZHRoLzItMjY0LzIqZ2FtZS51cHNjYWxlU2l6ZTsvLyBjZW50ZXIgdGhlIGZyYW1lIGluIHRoZSBtaWRkbGUgb2YgdGhlIHNjcmVlblxyXG4gICAgICAgIHRoaXMuZnJhbWUueSA9IGdhbWUuaGVpZ2h0LzItNTYqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICB0aGlzLmZyYW1lLncgPSAyNjQqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICB0aGlzLmZyYW1lLmggPSA0OCpnYW1lLnVwc2NhbGVTaXplO1xyXG5cclxuICAgICAgICAvLyBzZXQgdGhlIHBvc2l0aW9ucyBvZiBhbGwgdGhlIGJ1dHRvbnNcclxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpPDQ7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0ueCA9IGdhbWUud2lkdGgvMi0xOTIvMipnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0ueSA9IGdhbWUuaGVpZ2h0LzIrMjAqaSpnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0udyA9IDE5MipnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0uaCA9IDE2KmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS51cGRhdGVNb3VzZU92ZXIoZ2FtZS5tb3VzZVgsIGdhbWUubW91c2VZKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCBVaVNjcmVlbiBmcm9tICcuLi9VaVNjcmVlbic7XHJcbmltcG9ydCBwNSBmcm9tICdwNSc7XHJcbmltcG9ydCBVaUZyYW1lIGZyb20gJy4uL1VpRnJhbWUnO1xyXG5pbXBvcnQgZ2FtZSBmcm9tICcuLi8uLi9NYWluJztcclxuaW1wb3J0IEJ1dHRvbiBmcm9tICcuLi9CdXR0b24nO1xyXG5pbXBvcnQgRm9udFJlc291cmNlIGZyb20gJy4uLy4uL2Fzc2V0cy9yZXNvdXJjZXMvRm9udFJlc291cmNlJztcclxuaW1wb3J0IHsgTWFpbk1lbnUgfSBmcm9tICcuL01haW5NZW51JztcclxuaW1wb3J0IHsgVmlkZW9TZXR0aW5nc01lbnUgfSBmcm9tICcuL1ZpZGVvU2V0dGluZ3NNZW51JztcclxuaW1wb3J0IHsgQ29udHJvbHNNZW51IH0gZnJvbSAnLi9Db250cm9sc01lbnUnO1xyXG5cclxuZXhwb3J0IGNsYXNzIE9wdGlvbnNNZW51IGV4dGVuZHMgVWlTY3JlZW4ge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGZvbnQ6IEZvbnRSZXNvdXJjZSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgLy8gbWFrZSB0aGUgZnJhbWUgd2l0aCBzb21lIGRlZmF1bHQgdmFsdWVzLiAgVGhlc2Ugd2lsbCBsYXRlciBiZSBjaGFuZ2VkIHRvIGZpdCB0aGUgc2NyZWVuIHNpemUuXHJcbiAgICAgICAgdGhpcy5mcmFtZSA9IG5ldyBVaUZyYW1lKDAsIDAsIDAsIDApO1xyXG4gICAgICAgIC8vIG1ha2Ugc29tZSBidXR0b25zIHdpdGggZGVmYXVsdCBwb3NpdGlvbnNcclxuICAgICAgICB0aGlzLmJ1dHRvbnMgPSBbXHJcbiAgICAgICAgICAgIG5ldyBCdXR0b24oZm9udCwgXCJWaWRlbyBTZXR0aW5nc1wiLCBcIkNoYW5nZSB0aGUgYmFsYW5jZSBiZXR3ZWVuIHBlcmZvcm1hbmNlIGFuZCBmaWRlbGl0eS5cIiwgMCwgMCwgMCwgMCwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ2aWRlbyBzZXR0aW5nc1wiKTtcclxuICAgICAgICAgICAgICAgIGdhbWUuY3VycmVudFVpID0gbmV3IFZpZGVvU2V0dGluZ3NNZW51KGZvbnQpO1xyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgbmV3IEJ1dHRvbihmb250LCBcIkNvbnRyb2xzXCIsIFwiQ2hhbmdlIHlvdXIga2V5YmluZHMuXCIsIDAsIDAsIDAsIDAsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY29udHJvbCBtZW51XCIpO1xyXG4gICAgICAgICAgICAgICAgZ2FtZS5jdXJyZW50VWkgPSBuZXcgQ29udHJvbHNNZW51KGZvbnQpO1xyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgbmV3IEJ1dHRvbihmb250LCBcIkF1ZGlvIFNldHRpbmdzXCIsIFwiQ2hhbmdlIHRoZSB2b2x1bWUgb2YgZGlmZmVyZW50IHNvdW5kcy5cIiwgMCwgMCwgMCwgMCwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJhdWRpbyBtZW51XCIpO1xyXG4gICAgICAgICAgICAgICAgZ2FtZS5jdXJyZW50VWkgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBuZXcgQnV0dG9uKGZvbnQsIFwiQmFja1wiLCBcIlJldHVybiB0byB0aGUgbWFpbiBtZW51LlwiLCAwLCAwLCAwLCAwLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm1haW4gbWVudVwiKTtcclxuICAgICAgICAgICAgICAgIGdhbWUuY3VycmVudFVpID0gbmV3IE1haW5NZW51KGZvbnQpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIF07XHJcbiAgICAgICAgLy8gdXBkYXRlIHRoZSBzaXplIG9mIHRoZSBlbGVtZW50cyBiYXNlZCBvbiB0aGUgaW5pdGlhbCBzY3JlZW4gc2l6ZVxyXG4gICAgICAgIHRoaXMud2luZG93VXBkYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKHRhcmdldDogcDUsIHVwc2NhbGVTaXplOiBudW1iZXIpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgLy8gcmVuZGVyIHRoZSByZWN0YW5ndWxhciBpbWFnZSB0aGF0IHRoZSB3aG9sZSBtZW51IGlzIG9uXHJcbiAgICAgICAgdGhpcy5mcmFtZS5yZW5kZXIodGFyZ2V0LCB1cHNjYWxlU2l6ZSk7XHJcblxyXG4gICAgICAgIC8vIGxvb3AgdGhyb3VnaCB0aGUgYnV0dG9ucyBhcnJheSBhbmQgcmVuZGVyIGVhY2ggb25lLlxyXG4gICAgICAgIHRoaXMuYnV0dG9ucy5mb3JFYWNoKGJ1dHRvbiA9PiB7XHJcbiAgICAgICAgICAgIGJ1dHRvbi5yZW5kZXIodGFyZ2V0LCB1cHNjYWxlU2l6ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgd2luZG93VXBkYXRlKCkge1xyXG4gICAgICAgIC8vIHNldCB0aGUgcG9zaXRpb24gb2YgdGhlIGZyYW1lXHJcbiAgICAgICAgdGhpcy5mcmFtZS54ID0gZ2FtZS53aWR0aC8yLTIwMC8yKmdhbWUudXBzY2FsZVNpemU7Ly8gY2VudGVyIHRoZSBmcmFtZSBpbiB0aGUgY2VudGVyIG9mIHRoZSBzY3JlZW5cclxuICAgICAgICB0aGlzLmZyYW1lLnkgPSBnYW1lLmhlaWdodC8yLTU2KmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgdGhpcy5mcmFtZS53ID0gMjAwKmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgdGhpcy5mcmFtZS5oID0gNDgqZ2FtZS51cHNjYWxlU2l6ZTtcclxuXHJcbiAgICAgICAgLy8gc2V0IHRoZSBwb3NpdGlvbnMgb2YgYWxsIHRoZSBidXR0b25zXHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaTw0OyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLnggPSBnYW1lLndpZHRoLzItMTkyLzIqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLnkgPSBnYW1lLmhlaWdodC8yKzIwKmkqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLncgPSAxOTIqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLmggPSAxNipnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0udXBkYXRlTW91c2VPdmVyKGdhbWUubW91c2VYLCBnYW1lLm1vdXNlWSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCBVaVNjcmVlbiBmcm9tICcuLi9VaVNjcmVlbic7XHJcbmltcG9ydCBwNSBmcm9tICdwNSc7XHJcbmltcG9ydCBVaUZyYW1lIGZyb20gJy4uL1VpRnJhbWUnO1xyXG5pbXBvcnQgZ2FtZSBmcm9tICcuLi8uLi9NYWluJztcclxuaW1wb3J0IEJ1dHRvbiBmcm9tICcuLi9CdXR0b24nO1xyXG5pbXBvcnQgeyBPcHRpb25zTWVudSB9IGZyb20gJy4vT3B0aW9uc01lbnUnO1xyXG5pbXBvcnQgRm9udFJlc291cmNlIGZyb20gJy4uLy4uL2Fzc2V0cy9yZXNvdXJjZXMvRm9udFJlc291cmNlJztcclxuaW1wb3J0IHsgTWFpbk1lbnUgfSBmcm9tICcuL01haW5NZW51JztcclxuXHJcbmV4cG9ydCBjbGFzcyBQYXVzZU1lbnUgZXh0ZW5kcyBVaVNjcmVlbiB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZm9udDogRm9udFJlc291cmNlKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgLy8gbWFrZSB0aGUgZnJhbWUgd2l0aCBzb21lIGRlZmF1bHQgdmFsdWVzLiAgVGhlc2Ugd2lsbCBsYXRlciBiZSBjaGFuZ2VkIHRvIGZpdCB0aGUgc2NyZWVuIHNpemUuXHJcbiAgICAgICAgdGhpcy5mcmFtZSA9IG5ldyBVaUZyYW1lKDAsIDAsIDAsIDApO1xyXG5cclxuICAgICAgICAvLyBtYWtlIDQgYnV0dG9ucyB3aXRoIGRlZmF1bHQgcG9zaXRpb25zXHJcbiAgICAgICAgdGhpcy5idXR0b25zID0gW1xyXG4gICAgICAgICAgICBuZXcgQnV0dG9uKGZvbnQsIFwiUmVzdW1lIGdhbWVcIiwgXCJHbyBiYWNrIHRvIHRoZSBnYW1lLlwiLCAwLCAwLCAwLCAwLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBnYW1lLmN1cnJlbnRVaSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIG5ldyBCdXR0b24oZm9udCwgXCJPcHRpb25zXCIsIFwiQ2hhbmdlIHlvdXIga2V5YmluZHMsIHJlZHVjZSBsYWcsIGV0Yy5cIiwgMCwgMCwgMCwgMCwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZ2FtZS5jdXJyZW50VWkgPSBuZXcgT3B0aW9uc01lbnUoZm9udCk7XHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBuZXcgQnV0dG9uKGZvbnQsIFwiTGVhdmUgZ2FtZVwiLCBcIkdvIGJhY2sgdG8gTWFpbiBNZW51XCIsIDAsIDAsIDAsIDAsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGdhbWUuY3VycmVudFVpID0gbmV3IE1haW5NZW51KGZvbnQpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIF07XHJcblxyXG4gICAgICAgIC8vIHVwZGF0ZSB0aGUgc2l6ZSBvZiB0aGUgZWxlbWVudHMgYmFzZWQgb24gdGhlIGluaXRpYWwgc2NyZWVuIHNpemVcclxuICAgICAgICB0aGlzLndpbmRvd1VwZGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICByZW5kZXIodGFyZ2V0OiBwNSwgdXBzY2FsZVNpemU6IG51bWJlcik6IHZvaWQge1xyXG5cclxuICAgICAgICAvLyByZW5kZXIgdGhlIHJlY3Rhbmd1bGFyIGltYWdlIHRoYXQgdGhlIHdob2xlIG1lbnUgaXMgb25cclxuICAgICAgICB0aGlzLmZyYW1lLnJlbmRlcih0YXJnZXQsIHVwc2NhbGVTaXplKTtcclxuXHJcbiAgICAgICAgLy8gbG9vcCB0aHJvdWdoIHRoZSBidXR0b25zIGFycmF5IGFuZCByZW5kZXIgZWFjaCBvbmUuXHJcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIHRoaXMuYnV0dG9ucykge1xyXG4gICAgICAgICAgICBpdGVtLnJlbmRlcih0YXJnZXQsIHVwc2NhbGVTaXplKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHdpbmRvd1VwZGF0ZSgpIHtcclxuICAgICAgICAvLyBzZXQgdGhlIHBvc2l0aW9uIG9mIHRoZSBmcmFtZVxyXG4gICAgICAgIHRoaXMuZnJhbWUueCA9IGdhbWUud2lkdGgvMi0yNTYvMipnYW1lLnVwc2NhbGVTaXplOy8vIGNlbnRlciB0aGUgZnJhbWUgaW4gdGhlIG1pZGRsZSBvZiB0aGUgc2NyZWVuXHJcbiAgICAgICAgdGhpcy5mcmFtZS55ID0gZ2FtZS5oZWlnaHQvMi03MipnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgIHRoaXMuZnJhbWUudyA9IDI1NipnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgIHRoaXMuZnJhbWUuaCA9IDY0KmdhbWUudXBzY2FsZVNpemU7XHJcblxyXG4gICAgICAgIC8vIHNldCB0aGUgcG9zaXRpb25zIG9mIGFsbCB0aGUgYnV0dG9uc1xyXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGk8MzsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS54ID0gZ2FtZS53aWR0aC8yLTE5Mi8yKmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS55ID0gZ2FtZS5oZWlnaHQvMisyMCppKmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS53ID0gMTkyKmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS5oID0gMTYqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLnVwZGF0ZU1vdXNlT3ZlcihnYW1lLm1vdXNlWCwgZ2FtZS5tb3VzZVkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IFVpU2NyZWVuIGZyb20gJy4uL1VpU2NyZWVuJztcclxuaW1wb3J0IHA1IGZyb20gJ3A1JztcclxuaW1wb3J0IFVpRnJhbWUgZnJvbSAnLi4vVWlGcmFtZSc7XHJcbmltcG9ydCBnYW1lIGZyb20gJy4uLy4uL01haW4nO1xyXG5pbXBvcnQgQnV0dG9uIGZyb20gJy4uL0J1dHRvbic7XHJcbmltcG9ydCBGb250UmVzb3VyY2UgZnJvbSAnLi4vLi4vYXNzZXRzL3Jlc291cmNlcy9Gb250UmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBPcHRpb25zTWVudSB9IGZyb20gJy4vT3B0aW9uc01lbnUnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFZpZGVvU2V0dGluZ3NNZW51IGV4dGVuZHMgVWlTY3JlZW4ge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGZvbnQ6IEZvbnRSZXNvdXJjZSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgLy8gbWFrZSB0aGUgZnJhbWUgd2l0aCBzb21lIGRlZmF1bHQgdmFsdWVzLiAgVGhlc2Ugd2lsbCBsYXRlciBiZSBjaGFuZ2VkIHRvIGZpdCB0aGUgc2NyZWVuIHNpemUuXHJcbiAgICAgICAgdGhpcy5mcmFtZSA9IG5ldyBVaUZyYW1lKDAsIDAsIDAsIDApO1xyXG5cclxuXHJcbiAgICAgICAgaWYoZ2FtZS5za3lNb2QgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgZ2FtZS5za3lNb2QgPSAyO1xyXG5cclxuICAgICAgICBpZihnYW1lLnNreVRvZ2dsZSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICBnYW1lLnNreVRvZ2dsZSA9IHRydWU7XHJcblxyXG4gICAgICAgIGlmKGdhbWUucGFydGljbGVNdWx0aXBsaWVyID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIGdhbWUucGFydGljbGVNdWx0aXBsaWVyID0gMTtcclxuXHJcbiAgICAgICAgbGV0IHRlbXBTa3lNb2RlVGV4dDtcclxuXHJcbiAgICAgICAgaWYoZ2FtZS5za3lNb2Q9PT0yKSB7XHJcbiAgICAgICAgICAgIHRlbXBTa3lNb2RlVGV4dCA9IFwiSGFsZiBGcmFtZXJhdGVcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZihnYW1lLnNreU1vZD09PTEpIHtcclxuICAgICAgICAgICAgdGVtcFNreU1vZGVUZXh0ID0gXCJGdWxsIEZyYW1lcmF0ZVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGVtcFNreU1vZGVUZXh0ID0gXCJTb2xpZCBDb2xvclwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHRlbXBQYXJ0aWNsZVRleHQ7XHJcblxyXG4gICAgICAgIGlmKGdhbWUucGFydGljbGVNdWx0aXBsaWVyPT09Mikge1xyXG4gICAgICAgICAgICB0ZW1wUGFydGljbGVUZXh0ID0gXCJEb3VibGVcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZihnYW1lLnBhcnRpY2xlTXVsdGlwbGllcj09PTEpIHtcclxuICAgICAgICAgICAgdGVtcFBhcnRpY2xlVGV4dCA9IFwiTm9ybWFsXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0ZW1wUGFydGljbGVUZXh0ID0gXCJNaW5pbWFsXCI7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgLy8gbWFrZSBzb21lIGJ1dHRvbnMgd2l0aCBkZWZhdWx0IHBvc2l0aW9uc1xyXG4gICAgICAgIHRoaXMuYnV0dG9ucyA9IFtcclxuICAgICAgICAgICAgbmV3IEJ1dHRvbihmb250LCBgU2t5OiAke3RlbXBTa3lNb2RlVGV4dH1gLCBcIkNoYW5nZSB0aGUgYXBwZWFyYW5jZSBvZiB0aGUgc2t5LlwiLCAwLCAwLCAwLCAwLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInNreSB0b2dnbGVcIik7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLmJ1dHRvbnNbMF0udHh0ID09PSBcIlNreTogSGFsZiBGcmFtZXJhdGVcIil7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idXR0b25zWzBdLnR4dCA9IFwiU2t5OiBGdWxsIEZyYW1lcmF0ZVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGdhbWUuc2t5TW9kID0gMTtcclxuICAgICAgICAgICAgICAgICAgICBnYW1lLnNreVRvZ2dsZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmKHRoaXMuYnV0dG9uc1swXS50eHQgPT09IFwiU2t5OiBGdWxsIEZyYW1lcmF0ZVwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idXR0b25zWzBdLnR4dCA9IFwiU2t5OiBTb2xpZCBDb2xvclwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGdhbWUuc2t5VG9nZ2xlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1dHRvbnNbMF0udHh0ID0gXCJTa3k6IEhhbGYgRnJhbWVyYXRlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS5za3lNb2QgPSAyO1xyXG4gICAgICAgICAgICAgICAgICAgIGdhbWUuc2t5VG9nZ2xlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIG5ldyBCdXR0b24oZm9udCwgYFBhcnRpY2xlczogJHt0ZW1wUGFydGljbGVUZXh0fWAsIFwiQ2hhbmdlIHRoZSBhbW91bnQgb2YgcGFydGljbGVzXCIsIDAsIDAsIDAsIDAsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicGFydGljbGVzXCIpO1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5idXR0b25zWzFdLnR4dCA9PT0gXCJQYXJ0aWNsZXM6IE5vcm1hbFwiKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1dHRvbnNbMV0udHh0ID0gXCJQYXJ0aWNsZXM6IERvdWJsZVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGdhbWUucGFydGljbGVNdWx0aXBsaWVyID0gMjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYodGhpcy5idXR0b25zWzFdLnR4dCA9PT0gXCJQYXJ0aWNsZXM6IERvdWJsZVwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idXR0b25zWzFdLnR4dCA9IFwiUGFydGljbGVzOiBNaW5pbWFsXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS5wYXJ0aWNsZU11bHRpcGxpZXIgPSAwLjU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1dHRvbnNbMV0udHh0ID0gXCJQYXJ0aWNsZXM6IE5vcm1hbFwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGdhbWUucGFydGljbGVNdWx0aXBsaWVyID0gMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIG5ldyBCdXR0b24oZm9udCwgXCJCYWNrXCIsIFwiUmV0dXJuIHRvIHRoZSBtYWluIG1lbnUuXCIsIDAsIDAsIDAsIDAsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibWFpbiBtZW51XCIpO1xyXG4gICAgICAgICAgICAgICAgZ2FtZS5jdXJyZW50VWkgPSBuZXcgT3B0aW9uc01lbnUoZm9udCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgXTtcclxuICAgICAgICAvLyB1cGRhdGUgdGhlIHNpemUgb2YgdGhlIGVsZW1lbnRzIGJhc2VkIG9uIHRoZSBpbml0aWFsIHNjcmVlbiBzaXplXHJcbiAgICAgICAgdGhpcy53aW5kb3dVcGRhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIodGFyZ2V0OiBwNSwgdXBzY2FsZVNpemU6IG51bWJlcik6IHZvaWQge1xyXG5cclxuICAgICAgICAvLyByZW5kZXIgdGhlIHJlY3Rhbmd1bGFyIGltYWdlXHJcbiAgICAgICAgdGhpcy5mcmFtZS5yZW5kZXIodGFyZ2V0LCB1cHNjYWxlU2l6ZSk7XHJcblxyXG4gICAgICAgIC8vIGxvb3AgdGhyb3VnaCB0aGUgYnV0dG9ucyBhcnJheSBhbmQgcmVuZGVyIGVhY2ggb25lLlxyXG4gICAgICAgIHRoaXMuYnV0dG9ucy5mb3JFYWNoKGJ1dHRvbiA9PiB7XHJcbiAgICAgICAgICAgIGJ1dHRvbi5yZW5kZXIodGFyZ2V0LCB1cHNjYWxlU2l6ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgd2luZG93VXBkYXRlKCkge1xyXG4gICAgICAgIC8vIHNldCB0aGUgcG9zaXRpb24gb2YgdGhlIGZyYW1lXHJcbiAgICAgICAgdGhpcy5mcmFtZS54ID0gZ2FtZS53aWR0aCAvIDIgLSAyMDAgLyAyICogZ2FtZS51cHNjYWxlU2l6ZTsvLyBjZW50ZXIgdGhlIGZyYW1lIGluIHRoZSBjZW50ZXIgb2YgdGhlIHNjcmVlblxyXG4gICAgICAgIHRoaXMuZnJhbWUueSA9IGdhbWUuaGVpZ2h0IC8gMiAtIDU2ICogZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICB0aGlzLmZyYW1lLncgPSAyMDAgKiBnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgIHRoaXMuZnJhbWUuaCA9IDQ4ICogZ2FtZS51cHNjYWxlU2l6ZTtcclxuXHJcbiAgICAgICAgLy8gc2V0IHRoZSBwb3NpdGlvbnMgb2YgYWxsIHRoZSBidXR0b25zXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAzOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLnggPSBnYW1lLndpZHRoIC8gMiAtIDE5MiAvIDIgKiBnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0ueSA9IGdhbWUuaGVpZ2h0IC8gMiArIDIwICogaSAqIGdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS53ID0gMTkyICogZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLmggPSAxNiAqIGdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS51cGRhdGVNb3VzZU92ZXIoZ2FtZS5tb3VzZVgsIGdhbWUubW91c2VZKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IFVpU2NyZWVuIGZyb20gJy4uL1VpU2NyZWVuJztcclxuaW1wb3J0IHA1IGZyb20gJ3A1JztcclxuaW1wb3J0IFVpRnJhbWUgZnJvbSAnLi4vVWlGcmFtZSc7XHJcbmltcG9ydCBnYW1lIGZyb20gJy4uLy4uL01haW4nO1xyXG5pbXBvcnQgQnV0dG9uIGZyb20gJy4uL0J1dHRvbic7XHJcbmltcG9ydCBGb250UmVzb3VyY2UgZnJvbSAnLi4vLi4vYXNzZXRzL3Jlc291cmNlcy9Gb250UmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBNYWluTWVudSB9IGZyb20gJy4vTWFpbk1lbnUnO1xyXG5pbXBvcnQgeyBXb3JsZE9wdGlvbnNNZW51IH0gZnJvbSAnLi9Xb3JsZE9wdGlvbnNNZW51JztcclxuXHJcbmV4cG9ydCBjbGFzcyBXb3JsZENyZWF0aW9uTWVudSBleHRlbmRzIFVpU2NyZWVuIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihmb250OiBGb250UmVzb3VyY2UpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIC8vIG1ha2UgdGhlIGZyYW1lIHdpdGggc29tZSBkZWZhdWx0IHZhbHVlcy4gIFRoZXNlIHdpbGwgbGF0ZXIgYmUgY2hhbmdlZCB0byBmaXQgdGhlIHNjcmVlbiBzaXplLlxyXG4gICAgICAgIHRoaXMuZnJhbWUgPSBuZXcgVWlGcmFtZSgwLCAwLCAwLCAwKTtcclxuICAgICAgICAvLyBtYWtlIHNvbWUgYnV0dG9ucyB3aXRoIGRlZmF1bHQgcG9zaXRpb25zXHJcbiAgICAgICAgaWYgKGdhbWUuc2VydmVyVmlzaWJpbGl0eSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICBnYW1lLnNlcnZlclZpc2liaWxpdHkgPSBcIlB1YmxpY1wiO1xyXG5cclxuICAgICAgICB0aGlzLmJ1dHRvbnMgPSBbXHJcbiAgICAgICAgICAgIG5ldyBCdXR0b24oZm9udCwgYFNlcnZlciBWaXNpYmlsaXR5OiAke2dhbWUuc2VydmVyVmlzaWJpbGl0eX1gLCBcIkNoYW5nZSB0aGUgdmlzaWJpbGl0eSBvZiB0aGUgc2VydmVyXCIsIDAsIDAsIDAsIDAsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmJ1dHRvbnNbMF0udHh0ID09PSBcIlNlcnZlciBWaXNpYmlsaXR5OiBQdWJsaWNcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIGdhbWUuc2VydmVyVmlzaWJpbGl0eSA9IFwiVW5saXN0ZWRcIjtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1dHRvbnNbMF0udHh0ID0gXCJTZXJ2ZXIgVmlzaWJpbGl0eTogVW5saXN0ZWRcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuYnV0dG9uc1swXS50eHQgPT09IFwiU2VydmVyIFZpc2liaWxpdHk6IFVubGlzdGVkXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBnYW1lLnNlcnZlclZpc2liaWxpdHkgPSBcIlByaXZhdGVcIjtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1dHRvbnNbMF0udHh0ID0gXCJTZXJ2ZXIgVmlzaWJpbGl0eTogUHJpdmF0ZVwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS5zZXJ2ZXJWaXNpYmlsaXR5ID0gXCJQdWJsaWNcIjtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1dHRvbnNbMF0udHh0ID0gXCJTZXJ2ZXIgVmlzaWJpbGl0eTogUHVibGljXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBuZXcgQnV0dG9uKGZvbnQsIFwiV29ybGQgT3B0aW9uc1wiLCBcIkNoYW5nZSBob3cgeW91ciB3b3JsZCBsb29rcyBhbmQgZ2VuZXJhdGVzLlwiLCAwLCAwLCAwLCAwLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIndvcmxkIG1lbnVcIik7XHJcbiAgICAgICAgICAgICAgICBnYW1lLmN1cnJlbnRVaSA9IG5ldyBXb3JsZE9wdGlvbnNNZW51KGZvbnQpO1xyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgbmV3IEJ1dHRvbihmb250LCBcIkJhY2tcIiwgXCJSZXR1cm4gdG8gdGhlIG1haW4gbWVudS5cIiwgMCwgMCwgMCwgMCwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJtYWluIG1lbnVcIik7XHJcbiAgICAgICAgICAgICAgICBnYW1lLmN1cnJlbnRVaSA9IG5ldyBNYWluTWVudShmb250KTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICBdO1xyXG4gICAgICAgIC8vIHVwZGF0ZSB0aGUgc2l6ZSBvZiB0aGUgZWxlbWVudHMgYmFzZWQgb24gdGhlIGluaXRpYWwgc2NyZWVuIHNpemVcclxuICAgICAgICB0aGlzLndpbmRvd1VwZGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcih0YXJnZXQ6IHA1LCB1cHNjYWxlU2l6ZTogbnVtYmVyKTogdm9pZCB7XHJcblxyXG4gICAgICAgIC8vIHJlbmRlciB0aGUgcmVjdGFuZ3VsYXIgaW1hZ2UgdGhhdCB0aGUgd2hvbGUgbWVudSBpcyBvblxyXG4gICAgICAgIHRoaXMuZnJhbWUucmVuZGVyKHRhcmdldCwgdXBzY2FsZVNpemUpO1xyXG5cclxuICAgICAgICAvLyBsb29wIHRocm91Z2ggdGhlIGJ1dHRvbnMgYXJyYXkgYW5kIHJlbmRlciBlYWNoIG9uZS5cclxuICAgICAgICB0aGlzLmJ1dHRvbnMuZm9yRWFjaChidXR0b24gPT4ge1xyXG4gICAgICAgICAgICBidXR0b24ucmVuZGVyKHRhcmdldCwgdXBzY2FsZVNpemUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHdpbmRvd1VwZGF0ZSgpIHtcclxuICAgICAgICAvLyBzZXQgdGhlIHBvc2l0aW9uIG9mIHRoZSBmcmFtZVxyXG4gICAgICAgIHRoaXMuZnJhbWUueCA9IGdhbWUud2lkdGggLyAyIC0gMjAwIC8gMiAqIGdhbWUudXBzY2FsZVNpemU7Ly8gY2VudGVyIHRoZSBmcmFtZSBpbiB0aGUgY2VudGVyIG9mIHRoZSBzY3JlZW5cclxuICAgICAgICB0aGlzLmZyYW1lLnkgPSBnYW1lLmhlaWdodCAvIDIgLSA1NiAqIGdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgdGhpcy5mcmFtZS53ID0gMjAwICogZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICB0aGlzLmZyYW1lLmggPSA0OCAqIGdhbWUudXBzY2FsZVNpemU7XHJcblxyXG4gICAgICAgIC8vIHNldCB0aGUgcG9zaXRpb25zIG9mIGFsbCB0aGUgYnV0dG9uc1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS54ID0gZ2FtZS53aWR0aCAvIDIgLSAxOTIgLyAyICogZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLnkgPSBnYW1lLmhlaWdodCAvIDIgKyAyMCAqIGkgKiBnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0udyA9IDE5MiAqIGdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS5oID0gMTYgKiBnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0udXBkYXRlTW91c2VPdmVyKGdhbWUubW91c2VYLCBnYW1lLm1vdXNlWSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCBVaVNjcmVlbiBmcm9tICcuLi9VaVNjcmVlbic7XHJcbmltcG9ydCBwNSBmcm9tICdwNSc7XHJcbmltcG9ydCBVaUZyYW1lIGZyb20gJy4uL1VpRnJhbWUnO1xyXG5pbXBvcnQgZ2FtZSBmcm9tICcuLi8uLi9NYWluJztcclxuaW1wb3J0IEJ1dHRvbiBmcm9tICcuLi9CdXR0b24nO1xyXG5pbXBvcnQgRm9udFJlc291cmNlIGZyb20gJy4uLy4uL2Fzc2V0cy9yZXNvdXJjZXMvRm9udFJlc291cmNlJztcclxuaW1wb3J0IHsgV29ybGRDcmVhdGlvbk1lbnUgfSBmcm9tICcuL1dvcmxkQ3JlYXRpb25NZW51JztcclxuaW1wb3J0IFNsaWRlciBmcm9tICcuLi9TbGlkZXInO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdvcmxkT3B0aW9uc01lbnUgZXh0ZW5kcyBVaVNjcmVlbiB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZm9udDogRm9udFJlc291cmNlKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICAvLyBtYWtlIHRoZSBmcmFtZSB3aXRoIHNvbWUgZGVmYXVsdCB2YWx1ZXMuICBUaGVzZSB3aWxsIGxhdGVyIGJlIGNoYW5nZWQgdG8gZml0IHRoZSBzY3JlZW4gc2l6ZS5cclxuICAgICAgICB0aGlzLmZyYW1lID0gbmV3IFVpRnJhbWUoMCwgMCwgMCwgMCk7XHJcbiAgICAgICAgLy8gbWFrZSBzb21lIGJ1dHRvbnMgd2l0aCBkZWZhdWx0IHBvc2l0aW9uc1xyXG4gICAgICAgIGlmKGdhbWUud29ybGRCdW1waW5lc3MgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgZ2FtZS53b3JsZEJ1bXBpbmVzcyA9IDE7XHJcblxyXG5cclxuICAgICAgICBsZXQgdGVtcFdvcmxkQnVtcGluZXNzVGV4dDtcclxuXHJcbiAgICAgICAgaWYoZ2FtZS53b3JsZEJ1bXBpbmVzcz09PTEpIHtcclxuICAgICAgICAgICAgdGVtcFdvcmxkQnVtcGluZXNzVGV4dCA9IFwiTm9ybWFsXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYoZ2FtZS53b3JsZEJ1bXBpbmVzcz09PTApIHtcclxuICAgICAgICAgICAgdGVtcFdvcmxkQnVtcGluZXNzVGV4dCA9IFwiU3VwZXJmbGF0XCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0ZW1wV29ybGRCdW1waW5lc3NUZXh0ID0gXCJBbXBsaWZpZWRcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5idXR0b25zID0gW1xyXG4gICAgICAgICAgICBuZXcgQnV0dG9uKGZvbnQsIGBXb3JsZCBCdW1waW5lc3M6ICR7dGVtcFdvcmxkQnVtcGluZXNzVGV4dH1gLCBcIkNoYW5nZSB0aGUgaW50ZW5zaXR5IG9mIHRoZSB3b3JsZCdzIGJ1bXBzLlwiLCAwLCAwLCAwLCAwLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLmJ1dHRvbnNbMF0udHh0ID09PSBcIldvcmxkIEJ1bXBpbmVzczogTm9ybWFsXCIpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnV0dG9uc1swXS50eHQgPSBcIldvcmxkIEJ1bXBpbmVzczogQW1wbGlmaWVkXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS53b3JsZEJ1bXBpbmVzcyA9IDM7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmKHRoaXMuYnV0dG9uc1swXS50eHQgPT09IFwiV29ybGQgQnVtcGluZXNzOiBBbXBsaWZpZWRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnV0dG9uc1swXS50eHQgPSBcIldvcmxkIEJ1bXBpbmVzczogU3VwZXJmbGF0XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS53b3JsZEJ1bXBpbmVzcyA9IDA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1dHRvbnNbMF0udHh0ID0gXCJXb3JsZCBCdW1waW5lc3M6IE5vcm1hbFwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGdhbWUud29ybGRCdW1waW5lc3MgPSAxO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgbmV3IEJ1dHRvbihmb250LCBcIkJhY2tcIiwgXCJSZXR1cm4gdG8gdGhlIG1haW4gbWVudS5cIiwgMCwgMCwgMCwgMCwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJtYWluIG1lbnVcIik7XHJcbiAgICAgICAgICAgICAgICBnYW1lLmN1cnJlbnRVaSA9IG5ldyBXb3JsZENyZWF0aW9uTWVudShmb250KTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICBdO1xyXG4gICAgICAgIHRoaXMuc2xpZGVycyA9IFtcclxuICAgICAgICAgICAgbmV3IFNsaWRlcihmb250LCBcIldpZHRoXCIsIDUxMiwgNjQsIDIwNDgsIDY0LCAwLCAwLCAwLCAwLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBnYW1lLndvcmxkV2lkdGggPSB0aGlzLnNsaWRlcnNbMF0udmFsdWU7XHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBuZXcgU2xpZGVyKGZvbnQsIFwiSGVpZ2h0XCIsIDY0LCA2NCwgNTEyLCAxNiwgMCwgMCwgMCwgMCwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZ2FtZS53b3JsZEhlaWdodCA9IHRoaXMuc2xpZGVyc1sxXS52YWx1ZTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICBdO1xyXG4gICAgICAgIC8vIHVwZGF0ZSB0aGUgc2l6ZSBvZiB0aGUgZWxlbWVudHMgYmFzZWQgb24gdGhlIGluaXRpYWwgc2NyZWVuIHNpemVcclxuICAgICAgICB0aGlzLndpbmRvd1VwZGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcih0YXJnZXQ6IHA1LCB1cHNjYWxlU2l6ZTogbnVtYmVyKTogdm9pZCB7XHJcblxyXG4gICAgICAgIC8vIHJlbmRlciB0aGUgcmVjdGFuZ3VsYXIgaW1hZ2UgdGhhdCB0aGUgd2hvbGUgbWVudSBpcyBvblxyXG4gICAgICAgIHRoaXMuZnJhbWUucmVuZGVyKHRhcmdldCwgdXBzY2FsZVNpemUpO1xyXG5cclxuICAgICAgICAvLyBsb29wIHRocm91Z2ggdGhlIGJ1dHRvbnMgYXJyYXkgYW5kIHJlbmRlciBlYWNoIG9uZS5cclxuICAgICAgICB0aGlzLmJ1dHRvbnMuZm9yRWFjaChidXR0b24gPT4ge1xyXG4gICAgICAgICAgICBidXR0b24ucmVuZGVyKHRhcmdldCwgdXBzY2FsZVNpemUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBsb29wIHRocm91Z2ggdGhlIHNsaWRlcnMgYXJyYXkgYW5kIHJlbmRlciBlYWNoIG9uZS5cclxuICAgICAgICB0aGlzLnNsaWRlcnMuZm9yRWFjaChzbGlkZXIgPT4ge1xyXG4gICAgICAgICAgICBzbGlkZXIucmVuZGVyKHRhcmdldCwgdXBzY2FsZVNpemUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHdpbmRvd1VwZGF0ZSgpIHtcclxuICAgICAgICAvLyBzZXQgdGhlIHBvc2l0aW9uIG9mIHRoZSBmcmFtZVxyXG4gICAgICAgIHRoaXMuZnJhbWUueCA9IGdhbWUud2lkdGgvMi0yMDAvMipnYW1lLnVwc2NhbGVTaXplOy8vIGNlbnRlciB0aGUgZnJhbWUgaW4gdGhlIGNlbnRlciBvZiB0aGUgc2NyZWVuXHJcbiAgICAgICAgdGhpcy5mcmFtZS55ID0gZ2FtZS5oZWlnaHQvMi01NipnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgIHRoaXMuZnJhbWUudyA9IDIwMCpnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgIHRoaXMuZnJhbWUuaCA9IDQ4KmdhbWUudXBzY2FsZVNpemU7XHJcblxyXG4gICAgICAgIC8vIHNldCB0aGUgcG9zaXRpb25zIG9mIGFsbCB0aGUgYnV0dG9uc1xyXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGk8MjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS54ID0gZ2FtZS53aWR0aC8yLTE5Mi8yKmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS55ID0gZ2FtZS5oZWlnaHQvMis2MCppKmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS53ID0gMTkyKmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS5oID0gMTYqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLnVwZGF0ZU1vdXNlT3ZlcihnYW1lLm1vdXNlWCwgZ2FtZS5tb3VzZVkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gc2V0IHRoZSBwb3NpdGlvbnMgb2YgYWxsIHRoZSBzbGlkZXJzXHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaTwyOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5zbGlkZXJzW2ldLnggPSBnYW1lLndpZHRoLzItMTkyLzIqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5zbGlkZXJzW2ldLnkgPSBnYW1lLmhlaWdodC8yKzIwKmdhbWUudXBzY2FsZVNpemUrMjAqaSpnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLnNsaWRlcnNbaV0udyA9IDE5MipnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLnNsaWRlcnNbaV0uaCA9IDE2KmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIGlmKGdhbWUubW91c2VJc1ByZXNzZWQpXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNsaWRlcnNbaV0udXBkYXRlU2xpZGVyUG9zaXRpb24oZ2FtZS5tb3VzZVgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgR2FtZSBmcm9tICcuLi9HYW1lJztcclxuaW1wb3J0IFdvcmxkIGZyb20gJy4uL3dvcmxkL1dvcmxkJztcclxuaW1wb3J0IHsgRW50aXR5Q2xhc3NlcyB9IGZyb20gJy4uL3dvcmxkL2VudGl0aWVzL0VudGl0eUNsYXNzZXMnO1xyXG5pbXBvcnQgUGxheWVyTG9jYWwgZnJvbSAnLi4vd29ybGQvZW50aXRpZXMvUGxheWVyTG9jYWwnO1xyXG5cclxuZXhwb3J0IGNsYXNzIE5ldE1hbmFnZXIge1xyXG5cclxuICAgIGdhbWU6IEdhbWVcclxuXHJcbiAgICBwbGF5ZXJUaWNrUmF0ZTogbnVtYmVyXHJcblxyXG4gICAgY29uc3RydWN0b3IoZ2FtZTogR2FtZSkge1xyXG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWVcclxuXHJcbiAgICAgICAgLy8gSW5pdCBldmVudFxyXG4gICAgICAgIHRoaXMuZ2FtZS5jb25uZWN0aW9uLm9uKCdpbml0JywgKCBwbGF5ZXJUaWNrUmF0ZSwgdG9rZW4gKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBUaWNrIHJhdGUgc2V0IHRvOiAke3BsYXllclRpY2tSYXRlfWApO1xyXG4gICAgICAgICAgICB0aGlzLnBsYXllclRpY2tSYXRlID0gcGxheWVyVGlja1JhdGU7XHJcbiAgICAgICAgICAgIGlmICh0b2tlbikge1xyXG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKCd0b2tlbicsIHRva2VuKTtcclxuICAgICAgICAgICAgICAgICh0aGlzLmdhbWUuY29ubmVjdGlvbi5hdXRoIGFzIHsgdG9rZW46IHN0cmluZyB9KS50b2tlbiA9IHRva2VuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIEluaXRpYWxpemF0aW9uIGV2ZW50c1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy8gTG9hZCB0aGUgd29ybGQgYW5kIHNldCB0aGUgcGxheWVyIGVudGl0eSBpZFxyXG4gICAgICAgICAgICB0aGlzLmdhbWUuY29ubmVjdGlvbi5vbihcclxuICAgICAgICAgICAgICAgICd3b3JsZExvYWQnLCh3aWR0aCwgaGVpZ2h0LCB0aWxlcywgdGlsZUVudGl0aWVzLCBlbnRpdGllcywgcGxheWVyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZW50aXRpZXMpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nYW1lLndvcmxkID0gbmV3IFdvcmxkKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aWxlcyxcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS53b3JsZC5wbGF5ZXIgPSBuZXcgUGxheWVyTG9jYWwocGxheWVyKVxyXG4gICAgICAgICAgICAgICAgICAgIGVudGl0aWVzLmZvckVhY2goKGVudGl0eSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWUud29ybGQuZW50aXRpZXNbZW50aXR5LmlkXSA9IG5ldyBFbnRpdHlDbGFzc2VzW2VudGl0eS50eXBlXShlbnRpdHkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBXb3JsZCBldmVudHNcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vIFRpbGUgdXBkYXRlcyBzdWNoIGFzIGJyZWFraW5nIGFuZCBwbGFjaW5nXHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5jb25uZWN0aW9uLm9uKFxyXG4gICAgICAgICAgICAgICAgJ3dvcmxkVXBkYXRlJyxcclxuICAgICAgICAgICAgICAgICh1cGRhdGVkVGlsZXM6IHsgdGlsZUluZGV4OiBudW1iZXI7IHRpbGU6IG51bWJlciB9W10pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGUgd29ybGQgaXMgbm90IHNldFxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmdhbWUud29ybGQgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB1cGRhdGVkVGlsZXMuZm9yRWFjaCgodGlsZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWUud29ybGQudXBkYXRlVGlsZSh0aWxlLnRpbGVJbmRleCwgdGlsZS50aWxlKVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gUGxheWVyIGV2ZW50c1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy8gVXBkYXRlIHRoZSBwbGF5ZXJcclxuICAgICAgICAgICAgdGhpcy5nYW1lLmNvbm5lY3Rpb24ub24oJ3NldFBsYXllcicsICh4LCB5LCB5VmVsLCB4VmVsKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyBJZiB0aGUgd29ybGQgaXMgbm90IHNldFxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2FtZS53b3JsZCA9PT0gdW5kZWZpbmVkKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLndvcmxkLnBsYXllci54ID0geDtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS53b3JsZC5wbGF5ZXIueSA9IHk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUud29ybGQucGxheWVyLnlWZWwgPSB5VmVsO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLndvcmxkLnBsYXllci54VmVsID0geFZlbDtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmdhbWUuY29ubmVjdGlvbi5vbignZW50aXR5VXBkYXRlJywgKGVudGl0eURhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIElmIHRoZSB3b3JsZCBpcyBub3Qgc2V0XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nYW1lLndvcmxkID09PSB1bmRlZmluZWQpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBlbnRpdHkgPSB0aGlzLmdhbWUud29ybGQuZW50aXRpZXNbZW50aXR5RGF0YS5pZF1cclxuICAgICAgICAgICAgICAgIGlmIChlbnRpdHkgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgIGVudGl0eS51cGRhdGVEYXRhKGVudGl0eURhdGEpXHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICB0aGlzLmdhbWUuY29ubmVjdGlvbi5vbignZW50aXR5Q3JlYXRlJywgKGVudGl0eURhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIElmIHRoZSB3b3JsZCBpcyBub3Qgc2V0XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nYW1lLndvcmxkID09PSB1bmRlZmluZWQpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUud29ybGQuZW50aXRpZXNbZW50aXR5RGF0YS5pZF0gPSBuZXcgRW50aXR5Q2xhc3Nlc1tlbnRpdHlEYXRhLnR5cGVdKGVudGl0eURhdGEpO1xyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgdGhpcy5nYW1lLmNvbm5lY3Rpb24ub24oJ2VudGl0eURlbGV0ZScsIChpZCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlIHdvcmxkIGlzIG5vdCBzZXRcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdhbWUud29ybGQgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmdhbWUud29ybGQuZW50aXRpZXNbaWRdXHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICAvLyBVcGRhdGUgdGhlIG90aGVyIHBsYXllcnMgaW4gdGhlIHdvcmxkXHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5jb25uZWN0aW9uLm9uKFxyXG4gICAgICAgICAgICAgICAgJ2VudGl0eVNuYXBzaG90JyxcclxuICAgICAgICAgICAgICAgIChzbmFwc2hvdDoge1xyXG4gICAgICAgICAgICAgICAgICAgIGlkOiBzdHJpbmc7XHJcbiAgICAgICAgICAgICAgICAgICAgdGltZTogbnVtYmVyO1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlOiB7IGlkOiBzdHJpbmc7IHg6IHN0cmluZzsgeTogc3RyaW5nIH1bXTtcclxuICAgICAgICAgICAgICAgIH0pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGUgd29ybGQgaXMgbm90IHNldFxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmdhbWUud29ybGQgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWUud29ybGQudXBkYXRlUGxheWVycyhzbmFwc2hvdClcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IGdhbWUgZnJvbSAnLi4vTWFpbic7XHJcbmltcG9ydCBQNSBmcm9tICdwNSc7XHJcbmltcG9ydCBwNSBmcm9tICdwNSc7XHJcbmltcG9ydCBJbWFnZVJlc291cmNlIGZyb20gJy4uL2Fzc2V0cy9yZXNvdXJjZXMvSW1hZ2VSZXNvdXJjZSc7XHJcbmltcG9ydCBUaWxlUmVzb3VyY2UgZnJvbSAnLi4vYXNzZXRzL3Jlc291cmNlcy9UaWxlUmVzb3VyY2UnO1xyXG5pbXBvcnQgVGlja2FibGUgZnJvbSAnLi4vaW50ZXJmYWNlcy9UaWNrYWJsZSc7XHJcbmltcG9ydCBSZW5kZXJhYmxlIGZyb20gJy4uL2ludGVyZmFjZXMvUmVuZGVyYWJsZSc7XHJcbmltcG9ydCBHYW1lIGZyb20gJy4uL0dhbWUnO1xyXG5pbXBvcnQgUGxheWVyTG9jYWwgZnJvbSAnLi9lbnRpdGllcy9QbGF5ZXJMb2NhbCc7XHJcbmltcG9ydCB7IFNlcnZlckVudGl0eSB9IGZyb20gJy4vZW50aXRpZXMvU2VydmVyRW50aXR5JztcclxuaW1wb3J0IHsgU25hcHNob3RJbnRlcnBvbGF0aW9uIH0gZnJvbSAnQGdlY2tvcy5pby9zbmFwc2hvdC1pbnRlcnBvbGF0aW9uJztcclxuaW1wb3J0IHsgRW50aXR5LCBTbmFwc2hvdCB9IGZyb20gJ0BnZWNrb3MuaW8vc25hcHNob3QtaW50ZXJwb2xhdGlvbi9saWIvdHlwZXMnO1xyXG5pbXBvcnQgeyBUaWxlLCBXb3JsZFRpbGVzIH0gZnJvbSAnLi9Xb3JsZFRpbGVzJztcclxuaW1wb3J0IHsgVGlsZVR5cGUgfSBmcm9tICcuLi8uLi8uLi9hcGkvVGlsZSc7XHJcblxyXG5jbGFzcyBXb3JsZCBpbXBsZW1lbnRzIFRpY2thYmxlLCBSZW5kZXJhYmxlIHtcclxuICAgIHdpZHRoOiBudW1iZXI7IC8vIHdpZHRoIG9mIHRoZSB3b3JsZCBpbiB0aWxlc1xyXG4gICAgaGVpZ2h0OiBudW1iZXI7IC8vIGhlaWdodCBvZiB0aGUgd29ybGQgaW4gdGlsZXNcclxuXHJcbiAgICB0aWxlTGF5ZXI6IFA1LkdyYXBoaWNzOyAvLyBUaWxlIGxheWVyIGdyYXBoaWNcclxuICAgIGJhY2tUaWxlTGF5ZXI6IFA1LkdyYXBoaWNzOyAvLyBCYWNrZ3JvdW5kIHRpbGVzIGxheWVyIGdyYXBoaWNcclxuXHJcbiAgICBiYWNrVGlsZUxheWVyT2Zmc2V0V2lkdGg6IG51bWJlcjsgLy8gd2hhdCBpcyB0aGlzIGV4YWN0bHkgeGF2aWVyLi4uXHJcbiAgICBiYWNrVGlsZUxheWVyT2Zmc2V0SGVpZ2h0OiBudW1iZXI7IC8vIHdoYXQgaXMgdGhpcyBleGFjdGx5IHhhdmllci4uLlxyXG5cclxuICAgIHdvcmxkVGlsZXM6IChUaWxlVHlwZSB8IHN0cmluZylbXTsgLy8gbnVtYmVyIGZvciBlYWNoIHRpbGVzIGluIHRoZSB3b3JsZCBleDogWzEsIDEsIDAsIDEsIDIsIDAsIDAsIDEuLi4gIF0gbWVhbnMgc25vdywgc25vdywgYWlyLCBzbm93LCBpY2UsIGFpciwgYWlyLCBzbm93Li4uXHJcblxyXG4gICAgcGxheWVyOiBQbGF5ZXJMb2NhbDtcclxuXHJcbiAgICBlbnRpdGllczogeyBbaWQ6IHN0cmluZ106IFNlcnZlckVudGl0eSB9ID0ge307XHJcblxyXG4gICAgc25hcHNob3RJbnRlcnBvbGF0aW9uOiBTbmFwc2hvdEludGVycG9sYXRpb247XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgd2lkdGg6IG51bWJlcixcclxuICAgICAgICBoZWlnaHQ6IG51bWJlcixcclxuICAgICAgICB0aWxlczogKFRpbGVUeXBlIHwgc3RyaW5nKVtdXHJcbiAgICApIHtcclxuICAgICAgICAvLyBJbml0aWFsaXplIHRoZSB3b3JsZCB3aXRoIHRoZSB0aWxlcyBhbmQgZGltZW5zaW9ucyBmcm9tIHRoZSBzZXJ2ZXJcclxuICAgICAgICB0aGlzLndpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICAgICAgdGhpcy53b3JsZFRpbGVzID0gdGlsZXM7XHJcblxyXG4gICAgICAgIHRoaXMuc25hcHNob3RJbnRlcnBvbGF0aW9uID0gbmV3IFNuYXBzaG90SW50ZXJwb2xhdGlvbigpO1xyXG4gICAgICAgIHRoaXMuc25hcHNob3RJbnRlcnBvbGF0aW9uLmludGVycG9sYXRpb25CdWZmZXIuc2V0KFxyXG4gICAgICAgICAgICAoMTAwMCAvIGdhbWUubmV0TWFuYWdlci5wbGF5ZXJUaWNrUmF0ZSkgKiAyXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgLy8gZGVmaW5lIHRoZSBwNS5HcmFwaGljcyBvYmplY3RzIHRoYXQgaG9sZCBhbiBpbWFnZSBvZiB0aGUgdGlsZXMgb2YgdGhlIHdvcmxkLiAgVGhlc2UgYWN0IHNvcnQgb2YgbGlrZSBhIHZpcnR1YWwgY2FudmFzIGFuZCBjYW4gYmUgZHJhd24gb24ganVzdCBsaWtlIGEgbm9ybWFsIGNhbnZhcyBieSB1c2luZyB0aWxlTGF5ZXIucmVjdCgpOywgdGlsZUxheWVyLmVsbGlwc2UoKTssIHRpbGVMYXllci5maWxsKCk7LCBldGMuXHJcbiAgICAgICAgdGhpcy50aWxlTGF5ZXIgPSBnYW1lLmNyZWF0ZUdyYXBoaWNzKFxyXG4gICAgICAgICAgICB0aGlzLndpZHRoICogZ2FtZS5USUxFX1dJRFRILFxyXG4gICAgICAgICAgICB0aGlzLmhlaWdodCAqIGdhbWUuVElMRV9IRUlHSFRcclxuICAgICAgICApO1xyXG4gICAgICAgIHRoaXMuYmFja1RpbGVMYXllciA9IGdhbWUuY3JlYXRlR3JhcGhpY3MoXHJcbiAgICAgICAgICAgIHRoaXMud2lkdGggKiBnYW1lLlRJTEVfV0lEVEgsXHJcbiAgICAgICAgICAgIHRoaXMuaGVpZ2h0ICogZ2FtZS5USUxFX0hFSUdIVFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIC8vIGNhbGN1bGF0ZSB0aGVzZSB2YXJpYWJsZXM6XHJcbiAgICAgICAgdGhpcy5iYWNrVGlsZUxheWVyT2Zmc2V0V2lkdGggPVxyXG4gICAgICAgICAgICAoZ2FtZS5USUxFX1dJRFRIIC0gZ2FtZS5CQUNLX1RJTEVfV0lEVEgpIC8gMjsgLy8gY2FsY3VsYXRlZCBpbiB0aGUgc2V0dXAgZnVuY3Rpb24sIHRoaXMgdmFyaWFibGUgaXMgdGhlIG51bWJlciBvZiBwaXhlbHMgbGVmdCBvZiBhIHRpbGVzIHRvIGRyYXcgYSBiYWNrZ3JvdW5kIHRpbGVzIGZyb20gYXQgdGhlIHNhbWUgcG9zaXRpb25cclxuICAgICAgICB0aGlzLmJhY2tUaWxlTGF5ZXJPZmZzZXRIZWlnaHQgPVxyXG4gICAgICAgICAgICAoZ2FtZS5USUxFX0hFSUdIVCAtIGdhbWUuQkFDS19USUxFX0hFSUdIVCkgLyAyOyAvLyBjYWxjdWxhdGVkIGluIHRoZSBzZXR1cCBmdW5jdGlvbiwgdGhpcyB2YXJpYWJsZSBpcyB0aGUgbnVtYmVyIG9mIHBpeGVscyBhYm92ZSBhIHRpbGVzIHRvIGRyYXcgYSBiYWNrZ3JvdW5kIHRpbGVzIGZyb20gYXQgdGhlIHNhbWUgcG9zaXRpb25cclxuXHJcbiAgICAgICAgdGhpcy5sb2FkV29ybGQoKTtcclxuICAgIH1cclxuXHJcbiAgICB0aWNrKGdhbWU6IEdhbWUpIHtcclxuICAgICAgICBpZiAodGhpcy5wbGF5ZXIgIT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgZ2FtZS5jb25uZWN0aW9uLmVtaXQoJ3BsYXllclVwZGF0ZScsIHRoaXMucGxheWVyLngsIHRoaXMucGxheWVyLnkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcih0YXJnZXQ6IHA1LCB1cHNjYWxlU2l6ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgLy8gZHJhdyB0aGUgYmFja2dyb3VuZCB0aWxlcyBsYXllciBvbnRvIHRoZSBzY3JlZW5cclxuICAgICAgICB0YXJnZXQuaW1hZ2UoXHJcbiAgICAgICAgICAgIHRoaXMuYmFja1RpbGVMYXllcixcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgZ2FtZS53aWR0aCxcclxuICAgICAgICAgICAgZ2FtZS5oZWlnaHQsXHJcbiAgICAgICAgICAgIGdhbWUuaW50ZXJwb2xhdGVkQ2FtWCAqIGdhbWUuVElMRV9XSURUSCxcclxuICAgICAgICAgICAgZ2FtZS5pbnRlcnBvbGF0ZWRDYW1ZICogZ2FtZS5USUxFX1dJRFRILFxyXG4gICAgICAgICAgICBnYW1lLndpZHRoIC8gdXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIGdhbWUuaGVpZ2h0IC8gdXBzY2FsZVNpemVcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICAvLyBkcmF3IHRoZSB0aWxlcyBsYXllciBvbnRvIHRoZSBzY3JlZW5cclxuICAgICAgICB0YXJnZXQuaW1hZ2UoXHJcbiAgICAgICAgICAgIHRoaXMudGlsZUxheWVyLFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICBnYW1lLndpZHRoLFxyXG4gICAgICAgICAgICBnYW1lLmhlaWdodCxcclxuICAgICAgICAgICAgZ2FtZS5pbnRlcnBvbGF0ZWRDYW1YICogZ2FtZS5USUxFX1dJRFRILFxyXG4gICAgICAgICAgICBnYW1lLmludGVycG9sYXRlZENhbVkgKiBnYW1lLlRJTEVfV0lEVEgsXHJcbiAgICAgICAgICAgIGdhbWUud2lkdGggLyB1cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgZ2FtZS5oZWlnaHQgLyB1cHNjYWxlU2l6ZVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHRoaXMucmVuZGVyUGxheWVycyh0YXJnZXQsIHVwc2NhbGVTaXplKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVQbGF5ZXJzKHNuYXBzaG90OiBTbmFwc2hvdCkge1xyXG4gICAgICAgIHRoaXMuc25hcHNob3RJbnRlcnBvbGF0aW9uLnNuYXBzaG90LmFkZChzbmFwc2hvdCk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlVGlsZSh0aWxlSW5kZXg6IG51bWJlciwgdGlsZTogVGlsZVR5cGUpIHtcclxuICAgICAgICAvLyBVcGRhdGUgdGhlIHRpbGUgYW5kIHRoZSA0IG5laWdoYm91cmluZyB0aWxlc1xyXG4gICAgICAgIHRoaXMud29ybGRUaWxlc1t0aWxlSW5kZXhdID0gdGlsZTtcclxuXHJcbiAgICAgICAgLy8gZXJhc2UgdGhlIGJyb2tlbiB0aWxlcyBhbmQgaXRzIHN1cnJvdW5kaW5nIHRpbGVzIHVzaW5nIHR3byBlcmFzaW5nIHJlY3RhbmdsZXMgaW4gYSArIHNoYXBlXHJcbiAgICAgICAgdGhpcy50aWxlTGF5ZXIuZXJhc2UoKTtcclxuICAgICAgICB0aGlzLnRpbGVMYXllci5ub1N0cm9rZSgpO1xyXG4gICAgICAgIHRoaXMudGlsZUxheWVyLnJlY3QoXHJcbiAgICAgICAgICAgICgodGlsZUluZGV4ICUgdGhpcy53aWR0aCkgLSAxKSAqIGdhbWUuVElMRV9XSURUSCxcclxuICAgICAgICAgICAgTWF0aC5mbG9vcih0aWxlSW5kZXggLyB0aGlzLndpZHRoKSAqIGdhbWUuVElMRV9IRUlHSFQsXHJcbiAgICAgICAgICAgIGdhbWUuVElMRV9XSURUSCAqIDMsXHJcbiAgICAgICAgICAgIGdhbWUuVElMRV9IRUlHSFRcclxuICAgICAgICApO1xyXG4gICAgICAgIHRoaXMudGlsZUxheWVyLnJlY3QoXHJcbiAgICAgICAgICAgICh0aWxlSW5kZXggJSB0aGlzLndpZHRoKSAqIGdhbWUuVElMRV9XSURUSCxcclxuICAgICAgICAgICAgKE1hdGguZmxvb3IodGlsZUluZGV4IC8gdGhpcy53aWR0aCkgLSAxKSAqIGdhbWUuVElMRV9IRUlHSFQsXHJcbiAgICAgICAgICAgIGdhbWUuVElMRV9XSURUSCxcclxuICAgICAgICAgICAgZ2FtZS5USUxFX0hFSUdIVCAqIDNcclxuICAgICAgICApO1xyXG4gICAgICAgIHRoaXMudGlsZUxheWVyLm5vRXJhc2UoKTtcclxuXHJcbiAgICAgICAgLy8gcmVkcmF3IHRoZSBuZWlnaGJvcmluZyB0aWxlc1xyXG4gICAgICAgIHRoaXMuZHJhd1RpbGUodGlsZUluZGV4KTtcclxuICAgICAgICB0aGlzLmRyYXdUaWxlKHRpbGVJbmRleCArIHRoaXMud2lkdGgpO1xyXG4gICAgICAgIHRoaXMuZHJhd1RpbGUodGlsZUluZGV4IC0gMSk7XHJcbiAgICAgICAgdGhpcy5kcmF3VGlsZSh0aWxlSW5kZXggLSB0aGlzLndpZHRoKTtcclxuICAgICAgICB0aGlzLmRyYXdUaWxlKHRpbGVJbmRleCArIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlclBsYXllcnModGFyZ2V0OiBwNSwgdXBzY2FsZVNpemU6IG51bWJlcikge1xyXG4gICAgICAgIC8vIENhbGN1bGF0ZSB0aGUgaW50ZXJwb2xhdGVkIHBvc2l0aW9uIG9mIGFsbCB1cGRhdGVkIGVudGl0aWVzXHJcbiAgICAgICAgY29uc3QgcG9zaXRpb25TdGF0ZXM6IHsgW2lkOiBzdHJpbmddOiB7IHg6IG51bWJlcjsgeTogbnVtYmVyIH0gfSA9IHt9O1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNhbGN1bGF0ZWRTbmFwc2hvdCA9XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNuYXBzaG90SW50ZXJwb2xhdGlvbi5jYWxjSW50ZXJwb2xhdGlvbigneCB5Jyk7XHJcbiAgICAgICAgICAgIGlmICghY2FsY3VsYXRlZFNuYXBzaG90KSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBjb25zdCBzdGF0ZSA9IGNhbGN1bGF0ZWRTbmFwc2hvdC5zdGF0ZTtcclxuICAgICAgICAgICAgaWYgKCFzdGF0ZSkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgLy8gVGhlIG5ldyBwb3NpdGlvbnMgb2YgZW50aXRpZXMgYXMgb2JqZWN0XHJcbiAgICAgICAgICAgIHN0YXRlLmZvckVhY2goKHsgaWQsIHgsIHkgfTogRW50aXR5ICYgeyB4OiBudW1iZXI7IHk6IG51bWJlciB9KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvblN0YXRlc1tpZF0gPSB7IHgsIHkgfTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge31cclxuXHJcbiAgICAgICAgLy8gUmVuZGVyIGVhY2ggZW50aXR5IGluIHJhbmRvbSBvcmRlciA6c2t1bGw6XHJcbiAgICAgICAgT2JqZWN0LmVudHJpZXModGhpcy5lbnRpdGllcykuZm9yRWFjaChcclxuICAgICAgICAgICAgKGVudGl0eTogW3N0cmluZywgU2VydmVyRW50aXR5XSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdXBkYXRlZFBvc2l0aW9uID0gcG9zaXRpb25TdGF0ZXNbZW50aXR5WzBdXTtcclxuICAgICAgICAgICAgICAgIGlmICh1cGRhdGVkUG9zaXRpb24gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGVudGl0eVsxXS54ID0gdXBkYXRlZFBvc2l0aW9uLng7XHJcbiAgICAgICAgICAgICAgICAgICAgZW50aXR5WzFdLnkgPSB1cGRhdGVkUG9zaXRpb24ueTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBlbnRpdHlbMV0ucmVuZGVyKHRhcmdldCwgdXBzY2FsZVNpemUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgLy8gUmVuZGVyIHRoZSBwbGF5ZXIgb24gdG9wIDp0aHVtYnN1cDpcclxuICAgICAgICBpZiAodGhpcy5wbGF5ZXIgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLnBsYXllci5maW5kSW50ZXJwb2xhdGVkQ29vcmRpbmF0ZXMoKTtcclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXIucmVuZGVyKHRhcmdldCwgdXBzY2FsZVNpemUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBsb2FkV29ybGQoKSB7XHJcbiAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCB0aGlzLmhlaWdodDsgeCsrKSB7XHJcbiAgICAgICAgICAgIC8vIGkgd2lsbCBiZSB0aGUgeSBwb3NpdGlvbiBvZiB0aWxlcyBiZWluZyBkcmF3blxyXG4gICAgICAgICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IHRoaXMud2lkdGg7IHkrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGlsZVZhbCA9IHRoaXMud29ybGRUaWxlc1t4ICogdGhpcy53aWR0aCArIHldO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdGlsZVZhbCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0aWxlVmFsKTtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGlsZVZhbCAhPT0gVGlsZVR5cGUuQWlyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gRHJhdyB0aGUgY29ycmVjdCBpbWFnZSBmb3IgdGhlIHRpbGVzIG9udG8gdGhlIHRpbGVzIGxheWVyXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGlsZTogVGlsZSA9IFdvcmxkVGlsZXNbdGlsZVZhbF07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGlsZS5jb25uZWN0ZWQgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGlsZS50ZXh0dXJlIGluc3RhbmNlb2YgVGlsZVJlc291cmNlXHJcbiAgICAgICAgICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRlc3QgaWYgdGhlIG5laWdoYm9yaW5nIHRpbGVzIGFyZSBzb2xpZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0b3BUaWxlQm9vbCA9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4ID09PSBUaWxlVHlwZS5BaXIgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMud29ybGRUaWxlc1soeCAtIDEpICogdGhpcy53aWR0aCArIHldICE9PVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRpbGVUeXBlLkFpcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbGVmdFRpbGVCb29sID1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHkgPT09IFRpbGVUeXBlLkFpciB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy53b3JsZFRpbGVzW3ggKiB0aGlzLndpZHRoICsgeSAtIDFdICE9PVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRpbGVUeXBlLkFpcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYm90dG9tVGlsZUJvb2wgPVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeCA9PT0gdGhpcy5oZWlnaHQgLSAxIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLndvcmxkVGlsZXNbKHggKyAxKSAqIHRoaXMud2lkdGggKyB5XSAhPT1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUaWxlVHlwZS5BaXI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJpZ2h0VGlsZUJvb2wgPVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeSA9PT0gdGhpcy53aWR0aCAtIDEgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMud29ybGRUaWxlc1t4ICogdGhpcy53aWR0aCArIHkgKyAxXSAhPT1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUaWxlVHlwZS5BaXI7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb252ZXJ0IDQgZGlnaXQgYmluYXJ5IG51bWJlciB0byBiYXNlIDEwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRpbGVTZXRJbmRleCA9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA4ICogK3RvcFRpbGVCb29sICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDQgKiArcmlnaHRUaWxlQm9vbCArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAyICogK2JvdHRvbVRpbGVCb29sICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICtsZWZ0VGlsZUJvb2w7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBSZW5kZXIgY29ubmVjdGVkIHRpbGVzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbGUudGV4dHVyZS5yZW5kZXJUaWxlKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlsZVNldEluZGV4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50aWxlTGF5ZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB5ICogZ2FtZS5USUxFX1dJRFRILFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeCAqIGdhbWUuVElMRV9IRUlHSFQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnYW1lLlRJTEVfV0lEVEgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnYW1lLlRJTEVfSEVJR0hUXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgIXRpbGUuY29ubmVjdGVkICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbGUudGV4dHVyZSBpbnN0YW5jZW9mIEltYWdlUmVzb3VyY2VcclxuICAgICAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gUmVuZGVyIG5vbi1jb25uZWN0ZWQgdGlsZXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGlsZS50ZXh0dXJlLnJlbmRlcihcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGlsZUxheWVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeSAqIGdhbWUuVElMRV9XSURUSCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHggKiBnYW1lLlRJTEVfSEVJR0hULFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2FtZS5USUxFX1dJRFRILFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2FtZS5USUxFX0hFSUdIVFxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBkcmF3VGlsZSh0aWxlSW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IHggPSB0aWxlSW5kZXggJSB0aGlzLndpZHRoO1xyXG4gICAgICAgIGNvbnN0IHkgPSBNYXRoLmZsb29yKHRpbGVJbmRleCAvIHRoaXMud2lkdGgpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy53b3JsZFRpbGVzW3RpbGVJbmRleF0gIT09IFRpbGVUeXBlLkFpcikge1xyXG4gICAgICAgICAgICAvLyBEcmF3IHRoZSBjb3JyZWN0IGltYWdlIGZvciB0aGUgdGlsZXMgb250byB0aGUgdGlsZXMgbGF5ZXJcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHRpbGVWYWwgPSB0aGlzLndvcmxkVGlsZXNbdGlsZUluZGV4XVxyXG5cclxuICAgICAgICAgICAgaWYodHlwZW9mIHRpbGVWYWwgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlRyaWVkIHRvIGRyYXc6IFwiICsgdGlsZVZhbClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgdGlsZTogVGlsZSA9IFdvcmxkVGlsZXNbdGlsZVZhbF07XHJcblxyXG4gICAgICAgICAgICAvLyBpZiB0aGUgdGlsZXMgaXMgb2ZmLXNjcmVlblxyXG4gICAgICAgICAgICBpZiAodGlsZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aWxlLmNvbm5lY3RlZCAmJiB0aWxlLnRleHR1cmUgaW5zdGFuY2VvZiBUaWxlUmVzb3VyY2UpIHtcclxuICAgICAgICAgICAgICAgIC8vIFRlc3QgdGhlIG5laWdoYm9yaW5nIDQgdGlsZXNcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRvcFRpbGVCb29sID1cclxuICAgICAgICAgICAgICAgICAgICB5IDw9IDAgfHxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLndvcmxkVGlsZXNbdGlsZUluZGV4IC0gdGhpcy53aWR0aF0gIT09IFRpbGVUeXBlLkFpcjtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGxlZnRUaWxlQm9vbCA9XHJcbiAgICAgICAgICAgICAgICAgICAgeCA8PSAwIHx8IHRoaXMud29ybGRUaWxlc1t0aWxlSW5kZXggLSAxXSAhPT0gVGlsZVR5cGUuQWlyO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYm90dG9tVGlsZUJvb2wgPVxyXG4gICAgICAgICAgICAgICAgICAgIHkgPj0gdGhpcy5oZWlnaHQgLSAxIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53b3JsZFRpbGVzW3RpbGVJbmRleCArIHRoaXMud2lkdGhdICE9PSBUaWxlVHlwZS5BaXI7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByaWdodFRpbGVCb29sID1cclxuICAgICAgICAgICAgICAgICAgICB4ID49IHRoaXMud2lkdGggLSAxIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53b3JsZFRpbGVzW3RpbGVJbmRleCArIDFdICE9PSBUaWxlVHlwZS5BaXI7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gY29udmVydCA0IGRpZ2l0IGJpbmFyeSBudW1iZXIgdG8gYmFzZSAxMFxyXG4gICAgICAgICAgICAgICAgY29uc3QgdGlsZVNldEluZGV4ID1cclxuICAgICAgICAgICAgICAgICAgICA4ICogK3RvcFRpbGVCb29sICtcclxuICAgICAgICAgICAgICAgICAgICA0ICogK3JpZ2h0VGlsZUJvb2wgK1xyXG4gICAgICAgICAgICAgICAgICAgIDIgKiArYm90dG9tVGlsZUJvb2wgK1xyXG4gICAgICAgICAgICAgICAgICAgICtsZWZ0VGlsZUJvb2w7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gUmVuZGVyIGNvbm5lY3RlZCB0aWxlc1xyXG4gICAgICAgICAgICAgICAgdGlsZS50ZXh0dXJlLnJlbmRlclRpbGUoXHJcbiAgICAgICAgICAgICAgICAgICAgdGlsZVNldEluZGV4LFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGlsZUxheWVyLFxyXG4gICAgICAgICAgICAgICAgICAgIHggKiBnYW1lLlRJTEVfV0lEVEgsXHJcbiAgICAgICAgICAgICAgICAgICAgeSAqIGdhbWUuVElMRV9IRUlHSFQsXHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS5USUxFX1dJRFRILFxyXG4gICAgICAgICAgICAgICAgICAgIGdhbWUuVElMRV9IRUlHSFRcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoXHJcbiAgICAgICAgICAgICAgICAhdGlsZS5jb25uZWN0ZWQgJiZcclxuICAgICAgICAgICAgICAgIHRpbGUudGV4dHVyZSBpbnN0YW5jZW9mIEltYWdlUmVzb3VyY2VcclxuICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBSZW5kZXIgbm9uLWNvbm5lY3RlZCB0aWxlc1xyXG4gICAgICAgICAgICAgICAgdGlsZS50ZXh0dXJlLnJlbmRlcihcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRpbGVMYXllcixcclxuICAgICAgICAgICAgICAgICAgICB4ICogZ2FtZS5USUxFX1dJRFRILFxyXG4gICAgICAgICAgICAgICAgICAgIHkgKiBnYW1lLlRJTEVfSEVJR0hULFxyXG4gICAgICAgICAgICAgICAgICAgIGdhbWUuVElMRV9XSURUSCxcclxuICAgICAgICAgICAgICAgICAgICBnYW1lLlRJTEVfSEVJR0hUXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmV4cG9ydCA9IFdvcmxkO1xyXG4iLCJpbXBvcnQgSW1hZ2VSZXNvdXJjZSBmcm9tICcuLi9hc3NldHMvcmVzb3VyY2VzL0ltYWdlUmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBXb3JsZEFzc2V0cyB9IGZyb20gJy4uL2Fzc2V0cy9Bc3NldHMnO1xyXG5pbXBvcnQgVGlsZVJlc291cmNlIGZyb20gJy4uL2Fzc2V0cy9yZXNvdXJjZXMvVGlsZVJlc291cmNlJztcclxuaW1wb3J0IHsgVGlsZVR5cGUgfSBmcm9tICcuLi8uLi8uLi9hcGkvVGlsZSc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFRpbGUge1xyXG4gICAgbmFtZTogc3RyaW5nO1xyXG4gICAgdGV4dHVyZTogSW1hZ2VSZXNvdXJjZSB8IFRpbGVSZXNvdXJjZTtcclxuICAgIGNvbm5lY3RlZD86IGJvb2xlYW47XHJcbiAgICBhbnlDb25uZWN0aW9uPzogYm9vbGVhbjtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IFdvcmxkVGlsZXM6IFJlY29yZDxUaWxlVHlwZSwgVGlsZSB8IHVuZGVmaW5lZD4gPSB7XHJcbiAgICBbVGlsZVR5cGUuQWlyXTogdW5kZWZpbmVkLFxyXG4gICAgW1RpbGVUeXBlLlNub3ddOiB7XHJcbiAgICAgICAgbmFtZTogJ3Nub3cnLFxyXG4gICAgICAgIHRleHR1cmU6IFdvcmxkQXNzZXRzLm1pZGRsZWdyb3VuZC50aWxlc2V0X3Nub3csXHJcbiAgICAgICAgY29ubmVjdGVkOiB0cnVlLFxyXG4gICAgICAgIGFueUNvbm5lY3Rpb246IHRydWUsXHJcbiAgICB9LFxyXG4gICAgW1RpbGVUeXBlLkljZV06IHtcclxuICAgICAgICBuYW1lOiAnaWNlJyxcclxuICAgICAgICB0ZXh0dXJlOiBXb3JsZEFzc2V0cy5taWRkbGVncm91bmQudGlsZXNldF9pY2UsXHJcbiAgICAgICAgY29ubmVjdGVkOiB0cnVlLFxyXG4gICAgICAgIGFueUNvbm5lY3Rpb246IHRydWUsXHJcbiAgICB9LFxyXG59OyIsImltcG9ydCB7IEVudGl0aWVzIH0gZnJvbSAnLi4vLi4vLi4vLi4vYXBpL0VudGl0eSc7XHJcbmltcG9ydCB7IFBsYXllckVudGl0eSB9IGZyb20gJy4vUGxheWVyRW50aXR5JztcclxuaW1wb3J0IFBsYXllckxvY2FsIGZyb20gJy4vUGxheWVyTG9jYWwnO1xyXG5cclxuZXhwb3J0IGNvbnN0IEVudGl0eUNsYXNzZXM6IFJlY29yZDxFbnRpdGllcywgYW55PiA9IHtcclxuICAgIFtFbnRpdGllcy5Mb2NhbFBsYXllcl06IFBsYXllckxvY2FsLFxyXG4gICAgW0VudGl0aWVzLlBsYXllcl06IFBsYXllckVudGl0eSxcclxuICAgIFtFbnRpdGllcy5JdGVtXTogbnVsbFxyXG59IiwiaW1wb3J0IHsgU2VydmVyRW50aXR5IH0gZnJvbSAnLi9TZXJ2ZXJFbnRpdHknO1xyXG5pbXBvcnQgcDUgZnJvbSAncDUnO1xyXG5pbXBvcnQgZ2FtZSBmcm9tICcuLi8uLi9NYWluJztcclxuaW1wb3J0IHsgRW50aXRpZXMsIEVudGl0eVBheWxvYWQgfSBmcm9tICcuLi8uLi8uLi8uLi9hcGkvRW50aXR5JztcclxuXHJcbmV4cG9ydCBjbGFzcyBQbGF5ZXJFbnRpdHkgZXh0ZW5kcyBTZXJ2ZXJFbnRpdHkge1xyXG5cclxuICAgIHdpZHRoOiBudW1iZXIgPSAxMiAvIGdhbWUuVElMRV9XSURUSDtcclxuICAgIGhlaWdodDogbnVtYmVyID0gMjAgLyBnYW1lLlRJTEVfSEVJR0hUO1xyXG4gICAgbmFtZTogc3RyaW5nXHJcblxyXG4gICAgY29uc3RydWN0b3IoZGF0YTogRW50aXR5UGF5bG9hZCkge1xyXG4gICAgICAgIHN1cGVyKGRhdGEuaWQpO1xyXG4gICAgICAgIGlmKGRhdGEudHlwZSA9PT0gRW50aXRpZXMuUGxheWVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMubmFtZSA9IGRhdGEuZGF0YS5uYW1lO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVEYXRhKGRhdGE6IEVudGl0eVBheWxvYWQpOiB2b2lkIHtcclxuICAgICAgICBpZihkYXRhLnR5cGUgPT09IEVudGl0aWVzLlBsYXllcikge1xyXG4gICAgICAgICAgICB0aGlzLm5hbWUgPSBkYXRhLmRhdGEubmFtZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKHRhcmdldDogcDUsIHVwc2NhbGVTaXplOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0YXJnZXQuZmlsbCgwLCAyNTUsIDApO1xyXG5cclxuICAgICAgICB0YXJnZXQucmVjdChcclxuICAgICAgICAgICAgKHRoaXMueCAqIGdhbWUuVElMRV9XSURUSCAtXHJcbiAgICAgICAgICAgICAgICBnYW1lLmludGVycG9sYXRlZENhbVggKiBnYW1lLlRJTEVfV0lEVEgpICpcclxuICAgICAgICAgICAgdXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgICh0aGlzLnkgKiBnYW1lLlRJTEVfSEVJR0hUIC1cclxuICAgICAgICAgICAgICAgIGdhbWUuaW50ZXJwb2xhdGVkQ2FtWSAqIGdhbWUuVElMRV9IRUlHSFQpICpcclxuICAgICAgICAgICAgdXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIHRoaXMud2lkdGggKiB1cHNjYWxlU2l6ZSAqIGdhbWUuVElMRV9XSURUSCxcclxuICAgICAgICAgICAgdGhpcy5oZWlnaHQgKiB1cHNjYWxlU2l6ZSAqIGdhbWUuVElMRV9IRUlHSFRcclxuICAgICAgICApO1xyXG4gICAgICAgIC8vIFJlbmRlciB0aGUgaXRlbSBxdWFudGl0eSBsYWJlbFxyXG4gICAgICAgIHRhcmdldC5maWxsKDApO1xyXG5cclxuICAgICAgICB0YXJnZXQubm9TdHJva2UoKTtcclxuXHJcbiAgICAgICAgdGFyZ2V0LnRleHRTaXplKDUgKiB1cHNjYWxlU2l6ZSk7XHJcbiAgICAgICAgdGFyZ2V0LnRleHRBbGlnbih0YXJnZXQuQ0VOVEVSLCB0YXJnZXQuVE9QKTtcclxuXHJcbiAgICAgICAgdGFyZ2V0LnRleHQoXHJcbiAgICAgICAgICAgIHRoaXMubmFtZSxcclxuICAgICAgICAgICAgKCgodGhpcy54ICogZ2FtZS5USUxFX1dJRFRIKSAtXHJcbiAgICAgICAgICAgICAgICBnYW1lLmludGVycG9sYXRlZENhbVggKiBnYW1lLlRJTEVfV0lEVEgpICsgKHRoaXMud2lkdGggKiBnYW1lLlRJTEVfV0lEVEgpIC8gMikgKlxyXG4gICAgICAgICAgICB1cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgKCgodGhpcy55ICogZ2FtZS5USUxFX0hFSUdIVCkgLVxyXG4gICAgICAgICAgICAgICAgZ2FtZS5pbnRlcnBvbGF0ZWRDYW1ZICogZ2FtZS5USUxFX0hFSUdIVCkgLSAodGhpcy5oZWlnaHQgKiBnYW1lLlRJTEVfV0lEVEgpIC8gMi41KSAqXHJcbiAgICAgICAgICAgIHVwc2NhbGVTaXplXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufSIsImltcG9ydCBnYW1lIGZyb20gJy4uLy4uL01haW4nO1xyXG5pbXBvcnQgeyBTZXJ2ZXJFbnRpdHkgfSBmcm9tICcuL1NlcnZlckVudGl0eSc7XHJcbmltcG9ydCBwNSwgeyBDb2xvciB9IGZyb20gJ3A1JztcclxuaW1wb3J0IHsgRW50aXRpZXMsIEVudGl0eVBheWxvYWQgfSBmcm9tICcuLi8uLi8uLi8uLi9hcGkvRW50aXR5JztcclxuaW1wb3J0IHsgQ29sb3JQYXJ0aWNsZSB9IGZyb20gJy4uL3BhcnRpY2xlcy9Db2xvclBhcnRpY2xlJ1xyXG5pbXBvcnQgeyBQbGF5ZXJBbmltYXRpb25zLCBVaUFzc2V0cywgQW5pbWF0aW9uRnJhbWUgfSBmcm9tICcuLi8uLi9hc3NldHMvQXNzZXRzJztcclxuaW1wb3J0IEltYWdlUmVzb3VyY2UgZnJvbSAnLi4vLi4vYXNzZXRzL3Jlc291cmNlcy9JbWFnZVJlc291cmNlJztcclxuXHJcbmNsYXNzIFBsYXllckxvY2FsIGV4dGVuZHMgU2VydmVyRW50aXR5IHtcclxuXHJcbiAgICB3aWR0aDogbnVtYmVyID0gMTIgLyBnYW1lLlRJTEVfV0lEVEg7XHJcbiAgICBoZWlnaHQ6IG51bWJlciA9IDIwIC8gZ2FtZS5USUxFX0hFSUdIVDtcclxuICAgIG5hbWU6IHN0cmluZ1xyXG5cclxuICAgIHhWZWw6IG51bWJlciA9IDBcclxuICAgIHlWZWw6IG51bWJlciA9IDBcclxuICAgIGludGVycG9sYXRlZFg6IG51bWJlcjtcclxuICAgIGludGVycG9sYXRlZFk6IG51bWJlcjtcclxuICAgIHNsaWRlWDogbnVtYmVyO1xyXG4gICAgc2xpZGVZOiBudW1iZXI7XHJcblxyXG4gICAgcFg6IG51bWJlcjtcclxuICAgIHBZOiBudW1iZXI7XHJcbiAgICBwWFZlbDogbnVtYmVyID0gMFxyXG4gICAgcFlWZWw6IG51bWJlciA9IDBcclxuXHJcbiAgICBncm91bmRlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcEdyb3VuZGVkOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgY29sbGlzaW9uRGF0YTogYW55O1xyXG4gICAgY2xvc2VzdENvbGxpc2lvbjogW251bWJlciwgbnVtYmVyLCBudW1iZXJdXHJcblxyXG4gICAgbWFzczogbnVtYmVyID0gdGhpcy53aWR0aCAqIHRoaXMuaGVpZ2h0XHJcblxyXG4gICAgLy9pbnB1dCBib29sZWFuc1xyXG4gICAgcmlnaHRCdXR0b246IGJvb2xlYW47XHJcbiAgICBsZWZ0QnV0dG9uOiBib29sZWFuO1xyXG4gICAganVtcEJ1dHRvbjogYm9vbGVhbjtcclxuXHJcbiAgICBjdXJyZW50QW5pbWF0aW9uOiBBbmltYXRpb25GcmFtZTx0eXBlb2YgUGxheWVyQW5pbWF0aW9ucz47XHJcbiAgICBhbmltRnJhbWU6IG51bWJlciA9IDA7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgZGF0YTogRW50aXR5UGF5bG9hZDxFbnRpdGllcy5Mb2NhbFBsYXllcj5cclxuICAgICkge1xyXG4gICAgICAgIHN1cGVyKGRhdGEuaWQpXHJcblxyXG4gICAgICAgIHRoaXMubmFtZSA9IGRhdGEuZGF0YS5uYW1lXHJcblxyXG4gICAgICAgIHRoaXMueCA9IGRhdGEuZGF0YS54XHJcbiAgICAgICAgdGhpcy55ID0gZGF0YS5kYXRhLnlcclxuXHJcbiAgICAgICAgdGhpcy5jbG9zZXN0Q29sbGlzaW9uID0gWzEsIDAsIEluZmluaXR5XTtcclxuXHJcbiAgICAgICAgdGhpcy5pbnRlcnBvbGF0ZWRYID0gdGhpcy54O1xyXG4gICAgICAgIHRoaXMuaW50ZXJwb2xhdGVkWSA9IHRoaXMueTtcclxuXHJcbiAgICAgICAgdGhpcy5wWCA9IHRoaXMueFxyXG4gICAgICAgIHRoaXMucFkgPSB0aGlzLnk7XHJcbiAgICAgICAgdGhpcy5sZWZ0QnV0dG9uID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5yaWdodEJ1dHRvbiA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuanVtcEJ1dHRvbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICB0aGlzLmN1cnJlbnRBbmltYXRpb24gPSBcImlkbGVcIjtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIodGFyZ2V0OiBwNSwgdXBzY2FsZVNpemU6IG51bWJlcik6IHZvaWQge1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhgYW5pbWF0aW9uICR7dGhpcy5jdXJyZW50QW5pbWF0aW9ufSwgZnJhbWUgJHt0aGlzLmFuaW1GcmFtZX0gbWFrZXMgYCtQbGF5ZXJBbmltYXRpb25zW3RoaXMuY3VycmVudEFuaW1hdGlvbl1bdGhpcy5hbmltRnJhbWVdKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhQbGF5ZXJBbmltYXRpb25zKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhQbGF5ZXJBbmltYXRpb25zW3RoaXMuY3VycmVudEFuaW1hdGlvbl0pO1xyXG4gICAgICAgIFBsYXllckFuaW1hdGlvbnNbdGhpcy5jdXJyZW50QW5pbWF0aW9uXVt0aGlzLmFuaW1GcmFtZV0ucmVuZGVyXHJcbiAgICAgICAgKFxyXG4gICAgICAgICAgICB0YXJnZXQsXHJcbiAgICAgICAgICAgICh0aGlzLmludGVycG9sYXRlZFggKiBnYW1lLlRJTEVfV0lEVEggLVxyXG4gICAgICAgICAgICAgICAgZ2FtZS5pbnRlcnBvbGF0ZWRDYW1YICogZ2FtZS5USUxFX1dJRFRIKSAqXHJcbiAgICAgICAgICAgIHVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICAodGhpcy5pbnRlcnBvbGF0ZWRZICogZ2FtZS5USUxFX0hFSUdIVCAtXHJcbiAgICAgICAgICAgICAgICBnYW1lLmludGVycG9sYXRlZENhbVkgKiBnYW1lLlRJTEVfSEVJR0hUKSAqXHJcbiAgICAgICAgICAgIHVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICB0aGlzLndpZHRoICogdXBzY2FsZVNpemUgKiBnYW1lLlRJTEVfV0lEVEgsXHJcbiAgICAgICAgICAgIHRoaXMuaGVpZ2h0ICogdXBzY2FsZVNpemUgKiBnYW1lLlRJTEVfSEVJR0hUXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVEYXRhKGRhdGE6IEVudGl0eVBheWxvYWQpOiB2b2lkIHtcclxuICAgICAgICBpZihkYXRhLnR5cGUgPT09IEVudGl0aWVzLlBsYXllcilcclxuICAgICAgICAgICAgdGhpcy5uYW1lID0gZGF0YS5kYXRhLm5hbWU7XHJcbiAgICB9XHJcblxyXG4gICAga2V5Ym9hcmRJbnB1dCgpIHtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnhWZWwgKz1cclxuICAgICAgICAgICAgMC4wMiAqICgrdGhpcy5yaWdodEJ1dHRvbi0rdGhpcy5sZWZ0QnV0dG9uKTtcclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgIHRoaXMuZ3JvdW5kZWQgJiYgdGhpcy5qdW1wQnV0dG9uXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaSA9IDA7IGk8MTAqZ2FtZS5wYXJ0aWNsZU11bHRpcGxpZXI7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgZ2FtZS5wYXJ0aWNsZXMucHVzaChuZXcgQ29sb3JQYXJ0aWNsZShcIiNjYWZhZmNcIiwgMS84K01hdGgucmFuZG9tKCkvOCwgMjAsIHRoaXMueCt0aGlzLndpZHRoKk1hdGgucmFuZG9tKCksIHRoaXMueSt0aGlzLmhlaWdodCwgMC4yKihNYXRoLnJhbmRvbSgpLTAuNSksIDAuMiotTWF0aC5yYW5kb20oKSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMueVZlbCA9IC0xLjU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFwcGx5R3Jhdml0eUFuZERyYWcoKSB7XHJcbiAgICAgICAgLy8gdGhpcyBmdW5jdGlvbiBjaGFuZ2VzIHRoZSBvYmplY3QncyBuZXh0IHRpY2sncyB2ZWxvY2l0eSBpbiBib3RoIHRoZSB4IGFuZCB0aGUgeSBkaXJlY3Rpb25zXHJcblxyXG4gICAgICAgIHRoaXMucFhWZWwgPSB0aGlzLnhWZWw7XHJcbiAgICAgICAgdGhpcy5wWVZlbCA9IHRoaXMueVZlbDtcclxuXHJcbiAgICAgICAgdGhpcy54VmVsIC09XHJcbiAgICAgICAgICAgIChNYXRoLmFicyh0aGlzLnhWZWwpICogdGhpcy54VmVsICogZ2FtZS5EUkFHX0NPRUZGSUNJRU5UICogdGhpcy53aWR0aCkgL1xyXG4gICAgICAgICAgICB0aGlzLm1hc3M7XHJcbiAgICAgICAgdGhpcy55VmVsICs9IGdhbWUuR1JBVklUWV9TUEVFRDtcclxuICAgICAgICB0aGlzLnlWZWwgLT1cclxuICAgICAgICAgICAgKE1hdGguYWJzKHRoaXMueVZlbCkgKiB0aGlzLnlWZWwgKiBnYW1lLkRSQUdfQ09FRkZJQ0lFTlQgKiB0aGlzLmhlaWdodCkgL1xyXG4gICAgICAgICAgICB0aGlzLm1hc3M7XHJcbiAgICAgICAgLy9pZiBvbiB0aGUgZ3JvdW5kLCBtYWtlIHdhbGtpbmcgcGFydGljbGVzXHJcbiAgICAgICAgaWYodGhpcy5ncm91bmRlZCkge1xyXG4gICAgICAgICAgICAvL2Zvb3RzdGVwc1xyXG4gICAgICAgICAgICBmb3IobGV0IGkgPSAwOyBpPHJhbmRvbWx5VG9JbnQoTWF0aC5hYnModGhpcy54VmVsKSpnYW1lLnBhcnRpY2xlTXVsdGlwbGllci8yKTsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBnYW1lLnBhcnRpY2xlcy5wdXNoKG5ldyBDb2xvclBhcnRpY2xlKFwiI2JiYmJiYjQ1XCIsIDEvNCtNYXRoLnJhbmRvbSgpLzgsIDUwLCB0aGlzLngrdGhpcy53aWR0aC8yK2kvZ2FtZS5wYXJ0aWNsZU11bHRpcGxpZXIsIHRoaXMueSt0aGlzLmhlaWdodCwgMCwgMCwgZmFsc2UpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvL2R1c3RcclxuICAgICAgICAgICAgZm9yKGxldCBpID0gMDsgaTxyYW5kb21seVRvSW50KE1hdGguYWJzKHRoaXMueFZlbCkqZ2FtZS5wYXJ0aWNsZU11bHRpcGxpZXIvMik7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgZ2FtZS5wYXJ0aWNsZXMucHVzaChuZXcgQ29sb3JQYXJ0aWNsZShcIiNjYWZhZmNcIiwgMS84K01hdGgucmFuZG9tKCkvOCwgMTAsIHRoaXMueCt0aGlzLndpZHRoLzIsIHRoaXMueSt0aGlzLmhlaWdodCwgMC4yKi10aGlzLnhWZWwrMC4yKihNYXRoLnJhbmRvbSgpLTAuNSksIDAuMiotTWF0aC5yYW5kb20oKSwgdHJ1ZSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZpbmRJbnRlcnBvbGF0ZWRDb29yZGluYXRlcygpIHtcclxuICAgICAgICAvLyB0aGlzIGZ1bmN0aW9uIGVzc2VudGlhbGx5IG1ha2VzIHRoZSBjaGFyYWN0ZXIgbGFnIGJlaGluZCBvbmUgdGljaywgYnV0IG1lYW5zIHRoYXQgaXQgZ2V0cyBkaXNwbGF5ZWQgYXQgdGhlIG1heGltdW0gZnJhbWUgcmF0ZS5cclxuICAgICAgICBpZiAodGhpcy5wWFZlbCA+IDApIHtcclxuICAgICAgICAgICAgdGhpcy5pbnRlcnBvbGF0ZWRYID0gZ2FtZS5taW4oXHJcbiAgICAgICAgICAgICAgICB0aGlzLnBYICsgdGhpcy5wWFZlbCAqIGdhbWUuYW1vdW50U2luY2VMYXN0VGljayxcclxuICAgICAgICAgICAgICAgIHRoaXMueFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW50ZXJwb2xhdGVkWCA9IGdhbWUubWF4KFxyXG4gICAgICAgICAgICAgICAgdGhpcy5wWCArIHRoaXMucFhWZWwgKiBnYW1lLmFtb3VudFNpbmNlTGFzdFRpY2ssXHJcbiAgICAgICAgICAgICAgICB0aGlzLnhcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMucFlWZWwgPiAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW50ZXJwb2xhdGVkWSA9IGdhbWUubWluKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5wWSArIHRoaXMucFlWZWwgKiBnYW1lLmFtb3VudFNpbmNlTGFzdFRpY2ssXHJcbiAgICAgICAgICAgICAgICB0aGlzLnlcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmludGVycG9sYXRlZFkgPSBnYW1lLm1heChcclxuICAgICAgICAgICAgICAgIHRoaXMucFkgKyB0aGlzLnBZVmVsICogZ2FtZS5hbW91bnRTaW5jZUxhc3RUaWNrLFxyXG4gICAgICAgICAgICAgICAgdGhpcy55XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFwcGx5VmVsb2NpdHlBbmRDb2xsaWRlKCkge1xyXG4gICAgICAgIHRoaXMucFggPSB0aGlzLng7XHJcbiAgICAgICAgdGhpcy5wWSA9IHRoaXMueTtcclxuXHJcbiAgICAgICAgdGhpcy5wR3JvdW5kZWQgPSB0aGlzLmdyb3VuZGVkO1xyXG4gICAgICAgIHRoaXMuZ3JvdW5kZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICBUaGlzIGZ1bmN0aW9uIGFzc3VtZXMgdGhhdCB0aGUgb2JqZWN0IGRvZXNuJ3Qgc3RhcnQgaW4gY29sbGlzaW9uXHJcblxyXG4gICAgICAgIEFsc28sIGl0IHRha2VzIGFkdmFudGFnZSBvZiB0aGUgZmFjdCB0aGF0IGFuIG9iamVjdCBjYW4gb25seSBjb2xsaWRlIG9uY2UgaW4gZWFjaCBheGlzIHdpdGggdGhlc2UgYXhpcy1hbGlnbmVkIHJlY3RhbmdsZXMuXHJcbiAgICAgICAgVGhhdCdzIGEgdG90YWwgb2YgYSBwb3NzaWJsZSB0d28gY29sbGlzaW9ucywgb3IgYW4gaW5pdGlhbCBjb2xsaXNpb24sIGFuZCBhIHNsaWRpbmcgY29sbGlzaW9uLlxyXG4gICAgICAgICovXHJcblxyXG4gICAgICAgIC8vIGNhbGN1bGF0ZSB0aGUgaW5pdGlhbCBjb2xsaXNpb246XHJcblxyXG4gICAgICAgIC8vIHNldCB0aGUgY2xvc2VzdCBjb2xsaXNpb24gdG8gb25lIGluZmluaXRlbHkgZmFyIGF3YXkuXHJcbiAgICAgICAgdGhpcy5jbG9zZXN0Q29sbGlzaW9uID0gWzEsIDAsIEluZmluaXR5XTtcclxuXHJcbiAgICAgICAgLy8gbG9vcCB0aHJvdWdoIGFsbCB0aGUgcG9zc2libGUgdGlsZXMgdGhlIHBoeXNpY3MgYm94IGNvdWxkIGJlIGludGVyc2VjdGluZyB3aXRoXHJcbiAgICAgICAgZm9yIChcclxuICAgICAgICAgICAgbGV0IGkgPSBNYXRoLmZsb29yKGdhbWUubWluKHRoaXMueCwgdGhpcy54ICsgdGhpcy54VmVsKSk7XHJcbiAgICAgICAgICAgIGkgPCBNYXRoLmNlaWwoZ2FtZS5tYXgodGhpcy54LCB0aGlzLnggKyB0aGlzLnhWZWwpICsgdGhpcy53aWR0aCk7XHJcbiAgICAgICAgICAgIGkrK1xyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICBmb3IgKFxyXG4gICAgICAgICAgICAgICAgbGV0IGogPSBNYXRoLmZsb29yKGdhbWUubWluKHRoaXMueSwgdGhpcy55ICsgdGhpcy55VmVsKSk7XHJcbiAgICAgICAgICAgICAgICBqIDwgTWF0aC5jZWlsKGdhbWUubWF4KHRoaXMueSwgdGhpcy55ICsgdGhpcy55VmVsKSArIHRoaXMuaGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgIGorK1xyXG4gICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBjdXJyZW50IHRpbGUgaXNuJ3QgYWlyICh2YWx1ZSAwKSwgdGhlbiBjb250aW51ZSB3aXRoIHRoZSBjb2xsaXNpb24gZGV0ZWN0aW9uXHJcbiAgICAgICAgICAgICAgICBpZiAoZ2FtZS53b3JsZC53b3JsZFRpbGVzW2ogKiBnYW1lLndvcmxkV2lkdGggKyBpXSAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGdldCB0aGUgZGF0YSBhYm91dCB0aGUgY29sbGlzaW9uIGFuZCBzdG9yZSBpdCBpbiBhIHZhcmlhYmxlXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb2xsaXNpb25EYXRhID0gZ2FtZS5yZWN0VnNSYXkoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGkgLSB0aGlzLndpZHRoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBqIC0gdGhpcy5oZWlnaHQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMud2lkdGggKyAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhlaWdodCArIDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMueCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy55LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnhWZWwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMueVZlbFxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbGxpc2lvbkRhdGEgIT09IGZhbHNlICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2VzdENvbGxpc2lvblsyXSA+IHRoaXMuY29sbGlzaW9uRGF0YVsyXVxyXG4gICAgICAgICAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3Nlc3RDb2xsaXNpb24gPSB0aGlzLmNvbGxpc2lvbkRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5jbG9zZXN0Q29sbGlzaW9uWzJdICE9PSBJbmZpbml0eSkge1xyXG4gICAgICAgICAgICAvLyB0aGVyZSBoYXMgYmVlbiBhdCBsZWFzdCBvbmUgY29sbGlzaW9uXHJcblxyXG4gICAgICAgICAgICAvLyBnbyB0byB0aGUgcG9pbnQgb2YgY29sbGlzaW9uICh0aGlzIG1ha2VzIGl0IGJlaGF2ZSBhcyBpZiB0aGUgd2FsbHMgYXJlIHN0aWNreSwgYnV0IHdlIHdpbGwgbGF0ZXIgc2xpZGUgYWdhaW5zdCB0aGUgd2FsbHMpXHJcbiAgICAgICAgICAgIHRoaXMueCArPSB0aGlzLnhWZWwgKiB0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMl07XHJcbiAgICAgICAgICAgIHRoaXMueSArPSB0aGlzLnlWZWwgKiB0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMl07XHJcbiAgICAgICAgICAgIC8vIHRoZSBjb2xsaXNpb24gaGFwcGVuZWQgZWl0aGVyIG9uIHRoZSB0b3Agb3IgYm90dG9tXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMF0gPT09IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMueVZlbCA9IDA7IC8vIHNldCB0aGUgeSB2ZWxvY2l0eSB0byAwIGJlY2F1c2UgdGhlIG9iamVjdCBoYXMgcnVuIGludG8gYSB3YWxsIG9uIGl0cyB0b3Agb3IgYm90dG9tXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNsaWRlWCA9IHRoaXMueFZlbCAqICgxIC0gdGhpcy5jbG9zZXN0Q29sbGlzaW9uWzJdKTsgLy8gdGhpcyBpcyB0aGUgcmVtYWluaW5nIGRpc3RhbmNlIHRvIHNsaWRlIGFmdGVyIHRoZSBjb2xsaXNpb25cclxuICAgICAgICAgICAgICAgIHRoaXMuc2xpZGVZID0gMDsgLy8gaXQgZG9lc24ndCBzbGlkZSBpbiB0aGUgeSBkaXJlY3Rpb24gYmVjYXVzZSB0aGVyZSdzIGEgd2FsbCBcXCguLS4pL1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2xvc2VzdENvbGxpc2lvblsxXSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdyb3VuZGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBpZiBpdCBjb2xsaWRlZCBvbiB0aGUgaGlnaGVyIHNpZGUsIGl0IG11c3QgYmUgdG91Y2hpbmcgdGhlIGdyb3VuZC4gKGhpZ2hlciB5IGlzIGRvd24pXHJcbiAgICAgICAgICAgICAgICAgICAgaWYoIXRoaXMucEdyb3VuZGVkKSB7Ly9pZiBpdCBpc24ndCBncm91bmRlZCB5ZXQsIGl0IG11c3QgYmUgY29sbGlkaW5nIHdpdGggdGhlIGdyb3VuZCBmb3IgdGhlIGZpcnN0IHRpbWUsIHNvIHN1bW1vbiBwYXJ0aWNsZXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yKGxldCBpID0gMDsgaTw1KmdhbWUucGFydGljbGVNdWx0aXBsaWVyOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdhbWUucGFydGljbGVzLnB1c2gobmV3IENvbG9yUGFydGljbGUoXCIjY2FmYWZjXCIsIDEvOCtNYXRoLnJhbmRvbSgpLzgsIDIwLCB0aGlzLngrdGhpcy53aWR0aCpNYXRoLnJhbmRvbSgpLCB0aGlzLnkrdGhpcy5oZWlnaHQsIDAuMiooTWF0aC5yYW5kb20oKS0wLjUpLCAwLjIqLU1hdGgucmFuZG9tKCkpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvcihsZXQgaSA9IDA7IGk8NSpnYW1lLnBhcnRpY2xlTXVsdGlwbGllcjsgaSsrKSB7Ly9jZWlsaW5nIGNvbGxpc2lvbiBwYXJ0aWNsZXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2FtZS5wYXJ0aWNsZXMucHVzaChuZXcgQ29sb3JQYXJ0aWNsZShcIiNjYWZhZmNcIiwgMS84K01hdGgucmFuZG9tKCkvOCwgMjAsIHRoaXMueCt0aGlzLndpZHRoKk1hdGgucmFuZG9tKCksIHRoaXMueSwgMC4yKihNYXRoLnJhbmRvbSgpLTAuNSksIDAuMiotTWF0aC5yYW5kb20oKSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMueFZlbCA9IDA7IC8vIHNldCB0aGUgeCB2ZWxvY2l0eSB0byAwIGJlY2F1c2Ugd2FsbCBnbyBvb2ZcclxuICAgICAgICAgICAgICAgIHRoaXMuc2xpZGVYID0gMDsgLy8gaXQgZG9lc24ndCBzbGlkZSBpbiB0aGUgeCBkaXJlY3Rpb24gYmVjYXVzZSB0aGVyZSdzIGEgd2FsbCAvKC5fLilcXFxyXG4gICAgICAgICAgICAgICAgdGhpcy5zbGlkZVkgPSB0aGlzLnlWZWwgKiAoMSAtIHRoaXMuY2xvc2VzdENvbGxpc2lvblsyXSk7IC8vIHRoaXMgaXMgdGhlIHJlbWFpbmluZyBkaXN0YW5jZSB0byBzbGlkZSBhZnRlciB0aGUgY29sbGlzaW9uXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIGF0IHRoaXMgcG9pbnQsIHRoZSBvYmplY3QgaXMgdG91Y2hpbmcgaXRzIGZpcnN0IGNvbGxpc2lvbiwgcmVhZHkgdG8gc2xpZGUuICBUaGUgYW1vdW50IGl0IHdhbnRzIHRvIHNsaWRlIGlzIGhlbGQgaW4gdGhlIHRoaXMuc2xpZGVYIGFuZCB0aGlzLnNsaWRlWSB2YXJpYWJsZXMuXHJcblxyXG4gICAgICAgICAgICAvLyB0aGlzIGNhbiBiZSB0cmVhdGVkIGVzc2VudGlhbGx5IHRoZSBzYW1lIGFzIHRoZSBmaXJzdCBjb2xsaXNpb24sIHNvIGEgbG90IG9mIHRoZSBjb2RlIHdpbGwgYmUgcmV1c2VkLlxyXG5cclxuICAgICAgICAgICAgLy8gc2V0IHRoZSBjbG9zZXN0IGNvbGxpc2lvbiB0byBvbmUgaW5maW5pdGVseSBmYXIgYXdheS5cclxuICAgICAgICAgICAgdGhpcy5jbG9zZXN0Q29sbGlzaW9uID0gWzEsIDAsIEluZmluaXR5XTtcclxuXHJcbiAgICAgICAgICAgIC8vIGxvb3AgdGhyb3VnaCBhbGwgdGhlIHBvc3NpYmxlIHRpbGVzIHRoZSBwaHlzaWNzIGJveCBjb3VsZCBiZSBpbnRlcnNlY3Rpbmcgd2l0aFxyXG4gICAgICAgICAgICBmb3IgKFxyXG4gICAgICAgICAgICAgICAgbGV0IGkgPSBNYXRoLmZsb29yKGdhbWUubWluKHRoaXMueCwgdGhpcy54ICsgdGhpcy5zbGlkZVgpKTtcclxuICAgICAgICAgICAgICAgIGkgPCBNYXRoLmNlaWwoZ2FtZS5tYXgodGhpcy54LCB0aGlzLnggKyB0aGlzLnNsaWRlWCkgKyB0aGlzLndpZHRoKTtcclxuICAgICAgICAgICAgICAgIGkrK1xyXG4gICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgIGZvciAoXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGogPSBNYXRoLmZsb29yKGdhbWUubWluKHRoaXMueSwgdGhpcy55ICsgdGhpcy5zbGlkZVkpKTtcclxuICAgICAgICAgICAgICAgICAgICBqIDxcclxuICAgICAgICAgICAgICAgICAgICBNYXRoLmNlaWwoZ2FtZS5tYXgodGhpcy55LCB0aGlzLnkgKyB0aGlzLnNsaWRlWSkgKyB0aGlzLmhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaisrXHJcbiAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBpZiB0aGUgY3VycmVudCB0aWxlIGlzbid0IGFpciAodmFsdWUgMCksIHRoZW4gY29udGludWUgd2l0aCB0aGUgY29sbGlzaW9uIGRldGVjdGlvblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChnYW1lLndvcmxkLndvcmxkVGlsZXNbaiAqIGdhbWUud29ybGRXaWR0aCArIGldICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGdldCB0aGUgZGF0YSBhYm91dCB0aGUgY29sbGlzaW9uIGFuZCBzdG9yZSBpdCBpbiBhIHZhcmlhYmxlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29sbGlzaW9uRGF0YSA9IGdhbWUucmVjdFZzUmF5KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaSAtIHRoaXMud2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqIC0gdGhpcy5oZWlnaHQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLndpZHRoICsgMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGVpZ2h0ICsgMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMueCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMueSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2xpZGVYLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zbGlkZVlcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb2xsaXNpb25EYXRhICE9PSBmYWxzZSAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9zZXN0Q29sbGlzaW9uWzJdID4gdGhpcy5jb2xsaXNpb25EYXRhWzJdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9zZXN0Q29sbGlzaW9uID0gdGhpcy5jb2xsaXNpb25EYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBpdCBoYXMgY29sbGlkZWQgd2hpbGUgdHJ5aW5nIHRvIHNsaWRlXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMl0gIT09IEluZmluaXR5KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnggKz0gdGhpcy5zbGlkZVggKiB0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMl07XHJcbiAgICAgICAgICAgICAgICB0aGlzLnkgKz0gdGhpcy5zbGlkZVkgKiB0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMl07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2xvc2VzdENvbGxpc2lvblswXSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMueVZlbCA9IDA7IC8vIHNldCB0aGUgeSB2ZWxvY2l0eSB0byAwIGJlY2F1c2UgdGhlIG9iamVjdCBoYXMgcnVuIGludG8gYSB3YWxsIG9uIGl0cyB0b3Agb3IgYm90dG9tXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2xvc2VzdENvbGxpc2lvblsxXSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgaXQgY29sbGlkZWQgb24gdGhlIGhpZ2hlciBzaWRlLCBpdCBtdXN0IGJlIHRvdWNoaW5nIHRoZSBncm91bmQuIChoaWdoZXIgeSBpcyBkb3duKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdyb3VuZGVkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnhWZWwgPSAwOyAvLyBzZXQgdGhlIHggdmVsb2NpdHkgdG8gMCBiZWNhdXNlIHdhbGwgZ28gb29mXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBpdCBoYXMgbm90IGNvbGxpZGVkIHdoaWxlIHRyeWluZyB0byBzbGlkZVxyXG4gICAgICAgICAgICAgICAgdGhpcy54ICs9IHRoaXMuc2xpZGVYO1xyXG4gICAgICAgICAgICAgICAgdGhpcy55ICs9IHRoaXMuc2xpZGVZO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gdGhlcmUgaGFzIGJlZW4gbm8gY29sbGlzaW9uXHJcbiAgICAgICAgICAgIHRoaXMueCArPSB0aGlzLnhWZWw7XHJcbiAgICAgICAgICAgIHRoaXMueSArPSB0aGlzLnlWZWw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBjb2xsaWRlIHdpdGggc2lkZXMgb2YgbWFwXHJcblxyXG4gICAgICAgIGlmICh0aGlzLnggPCAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMueFZlbCA9IDA7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnggKyB0aGlzLndpZHRoID4gZ2FtZS53b3JsZFdpZHRoKSB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IGdhbWUud29ybGRXaWR0aCAtIHRoaXMud2lkdGg7XHJcbiAgICAgICAgICAgIHRoaXMueFZlbCA9IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy55IDwgMCkge1xyXG4gICAgICAgICAgICB0aGlzLnkgPSAwO1xyXG4gICAgICAgICAgICB0aGlzLnlWZWwgPSAwO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy55ICsgdGhpcy5oZWlnaHQgPiBnYW1lLndvcmxkSGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIHRoaXMueSA9IGdhbWUud29ybGRIZWlnaHQgLSB0aGlzLmhlaWdodDtcclxuICAgICAgICAgICAgdGhpcy55VmVsID0gMDtcclxuICAgICAgICAgICAgdGhpcy5ncm91bmRlZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmV4cG9ydCA9IFBsYXllckxvY2FsO1xyXG5cclxuXHJcbmZ1bmN0aW9uIHJhbmRvbWx5VG9JbnQoZjogbnVtYmVyKSB7XHJcbiAgICBpZihNYXRoLnJhbmRvbSgpPmYtTWF0aC5mbG9vcihmKSkge1xyXG4gICAgICAgIHJldHVybihNYXRoLmZsb29yKGYpKTtcclxuICAgIH1cclxuICAgIHJldHVybihNYXRoLmNlaWwoZikpO1xyXG59IiwiaW1wb3J0IFJlbmRlcmFibGUgZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9SZW5kZXJhYmxlJztcclxuaW1wb3J0IHA1IGZyb20gJ3A1JztcclxuaW1wb3J0IHsgRW50aXR5UGF5bG9hZCB9IGZyb20gJy4uLy4uLy4uLy4uL2FwaS9FbnRpdHknO1xyXG5cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFNlcnZlckVudGl0eSBpbXBsZW1lbnRzIFJlbmRlcmFibGUge1xyXG5cclxuICAgIGVudGl0eUlkOiBzdHJpbmdcclxuXHJcbiAgICB4OiBudW1iZXIgPSAwXHJcbiAgICB5OiBudW1iZXIgPSAwXHJcblxyXG4gICAgcHJvdGVjdGVkIGNvbnN0cnVjdG9yKGVudGl0eUlkOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLmVudGl0eUlkID0gZW50aXR5SWRcclxuICAgIH1cclxuXHJcbiAgICBhYnN0cmFjdCB1cGRhdGVEYXRhKGRhdGE6IEVudGl0eVBheWxvYWQpOiB2b2lkXHJcblxyXG4gICAgYWJzdHJhY3QgcmVuZGVyKHRhcmdldDogcDUsIHVwc2NhbGVTaXplOiBudW1iZXIpOiB2b2lkO1xyXG59IiwiaW1wb3J0IGdhbWUgZnJvbSBcIi4uLy4uL01haW5cIjtcclxuaW1wb3J0IFJlbmRlcmFibGUgZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvUmVuZGVyYWJsZVwiO1xyXG5pbXBvcnQgeyBjb2xsYXBzZVRleHRDaGFuZ2VSYW5nZXNBY3Jvc3NNdWx0aXBsZVZlcnNpb25zIH0gZnJvbSBcInR5cGVzY3JpcHRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDb2xvclBhcnRpY2xlIGltcGxlbWVudHMgUmVuZGVyYWJsZSB7XHJcbiAgICBjb2xvcjogc3RyaW5nXHJcbiAgICB4OiBudW1iZXI7XHJcbiAgICB5OiBudW1iZXI7XHJcbiAgICBzaXplOiBudW1iZXI7XHJcbiAgICB4VmVsOiBudW1iZXI7XHJcbiAgICB5VmVsOiBudW1iZXI7XHJcbiAgICBncmF2aXR5OiBib29sZWFuO1xyXG4gICAgYWdlOiBudW1iZXI7XHJcbiAgICBsaWZlc3BhbjogbnVtYmVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGNvbG9yOiBzdHJpbmcsIHNpemU6IG51bWJlciwgbGlmZXNwYW46IG51bWJlciwgeDogbnVtYmVyLCB5OiBudW1iZXIsIHhWZWw/OiBudW1iZXIsIHlWZWw/OiBudW1iZXIsIGdyYXZpdHk/OiBib29sZWFuKSB7XHJcbiAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yO1xyXG4gICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgdGhpcy55ID0geTtcclxuICAgICAgICB0aGlzLnhWZWwgPSB4VmVsIHx8IDA7XHJcbiAgICAgICAgdGhpcy55VmVsID0geVZlbCB8fCAwO1xyXG4gICAgICAgIHRoaXMuc2l6ZSA9IHNpemU7XHJcbiAgICAgICAgdGhpcy5ncmF2aXR5ID0gdHJ1ZTsvL3VzaW5nIHRoZSBvciBtb2RpZmllciB3aXRoIGJvb2xlYW5zIGNhdXNlcyBidWdzOyB0aGVyZSdzIHByb2JhYmx5IGEgYmV0dGVyIHdheSB0byBkbyB0aGlzXHJcbiAgICAgICAgaWYgKGdyYXZpdHkgIT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgdGhpcy5ncmF2aXR5ID0gZ3Jhdml0eTtcclxuICAgICAgICB0aGlzLmFnZSA9IDA7XHJcbiAgICAgICAgdGhpcy5saWZlc3BhbiA9IGxpZmVzcGFuO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcih0YXJnZXQ6IGltcG9ydChcInA1XCIpLCB1cHNjYWxlU2l6ZTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuYWdlIC8gdGhpcy5saWZlc3BhbiA8IDAuOCkgey8vaWYgaXQncyB1bmRlciA4MCUgb2YgdGhlIHBhcnRpY2xlJ3MgbGlmZXNwYW4sIGRyYXcgbm9ybWFsbHkgd2l0aG91dCBmYWRlXHJcbiAgICAgICAgICAgIHRhcmdldC5maWxsKHRoaXMuY29sb3IpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHsvL3RoaXMgbWVhbnMgdGhhdCB0aGUgcGFydGljbGUgaXMgYWxtb3N0IGdvaW5nIHRvIGJlIGRlbGV0ZWQsIHNvIGZhZGluZyBpcyBuZWNlc3NhcnlcclxuICAgICAgICAgICAgaWYgKHRoaXMuY29sb3IubGVuZ3RoID09PSA3KSB7Ly9pZiB0aGVyZSBpcyBubyB0cmFuc3BhcmVuY3kgYnkgZGVmYXVsdCwganVzdCBtYXAgdGhlIHRoaW5nc1xyXG4gICAgICAgICAgICAgICAgbGV0IHRyYW5zcGFyZW5jeVN0cmluZyA9IE1hdGgucm91bmQoMjU1ICogKC01ICogKHRoaXMuYWdlIC8gdGhpcy5saWZlc3BhbikgKyA1KSkudG9TdHJpbmcoMTYpLnN1YnN0cmluZygwLCAyKTtcclxuICAgICAgICAgICAgICAgIGlmICh0cmFuc3BhcmVuY3lTdHJpbmc9PT11bmRlZmluZWQgfHwgdHJhbnNwYXJlbmN5U3RyaW5nLmxlbmd0aD09PXVuZGVmaW5lZCkvL2NhdGNoIHdoYXQgY291bGQgYmUgYW4gaW5maW5pdGUgbG9vcCBvciBqdXN0IGFuIGVycm9yXHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBgdW5kZWZpbmVkIHRyYW5zcGFyZW5jeSBzdHJpbmcgb24gcGFydGljbGVgXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIHdoaWxlKHRyYW5zcGFyZW5jeVN0cmluZy5sZW5ndGg8Mikgey8vbWFrZSBzdXJlIGl0J3MgMiBjaGFyYWN0ZXJzIGxvbmc7IHRoaXMgc3RvcHMgdGhlIGNvbXB1dGVyIGZyb20gaW50ZXJwcmV0aW5nICNmZiBmZiBmZiA1IGFzICNmZiBmZiBmZiA1NSBpbnN0ZWFkIG9mICNmZiBmZiBmZiAwNVxyXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zcGFyZW5jeVN0cmluZyA9IFwiMFwiK3RyYW5zcGFyZW5jeVN0cmluZztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRhcmdldC5maWxsKHRoaXMuY29sb3Iuc3Vic3RyaW5nKDAsIDcpICsgdHJhbnNwYXJlbmN5U3RyaW5nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHsvL2lmIHRoZXJlIGlzIHRyYW5zcGFyZW5jeSwgbXVsdGlwbHlcclxuICAgICAgICAgICAgICAgIGxldCB0cmFuc3BhcmVuY3lTdHJpbmcgPSBNYXRoLnJvdW5kKHBhcnNlSW50KHRoaXMuY29sb3Iuc3Vic3RyaW5nKDcsIDkpLCAxNikgKiAoLTUgKiAodGhpcy5hZ2UgLyB0aGlzLmxpZmVzcGFuKSArIDUpKS50b1N0cmluZygxNikuc3Vic3RyaW5nKDAsIDIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRyYW5zcGFyZW5jeVN0cmluZz09PXVuZGVmaW5lZCB8fCB0cmFuc3BhcmVuY3lTdHJpbmcubGVuZ3RoPT09dW5kZWZpbmVkKS8vY2F0Y2ggd2hhdCBjb3VsZCBiZSBhbiBpbmZpbml0ZSBsb29wIG9yIGp1c3QgYW4gZXJyb3JcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGB1bmRlZmluZWQgdHJhbnNwYXJlbmN5IHN0cmluZyBvbiBwYXJ0aWNsZWBcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgd2hpbGUodHJhbnNwYXJlbmN5U3RyaW5nLmxlbmd0aDwyKSB7Ly9tYWtlIHN1cmUgaXQncyAyIGNoYXJhY3RlcnMgbG9uZzsgdGhpcyBzdG9wcyB0aGUgY29tcHV0ZXIgZnJvbSBpbnRlcnByZXRpbmcgI2ZmIGZmIGZmIDUgYXMgI2ZmIGZmIGZmIDU1IGluc3RlYWQgb2YgI2ZmIGZmIGZmIDA1XHJcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNwYXJlbmN5U3RyaW5nID0gXCIwXCIrdHJhbnNwYXJlbmN5U3RyaW5nO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0LmZpbGwodGhpcy5jb2xvci5zdWJzdHJpbmcoMCwgNykgKyB0cmFuc3BhcmVuY3lTdHJpbmcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vZHJhdyBhIHJlY3RhbmdsZSBjZW50ZXJlZCBvbiB0aGUgeCBhbmQgeSBwb3NpdGlvbiBmaWxsZWQgd2l0aCB0aGUgY29sb3Igb2YgdGhlIG9iamVjdFxyXG4gICAgICAgIHRhcmdldC5yZWN0KFxyXG4gICAgICAgICAgICAoLXRoaXMuc2l6ZSAvIDIgKyB0aGlzLnggKiBnYW1lLlRJTEVfV0lEVEggLVxyXG4gICAgICAgICAgICAgICAgZ2FtZS5pbnRlcnBvbGF0ZWRDYW1YICogZ2FtZS5USUxFX1dJRFRIKSAqXHJcbiAgICAgICAgICAgIHVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICAoLXRoaXMuc2l6ZSAvIDIgKyB0aGlzLnkgKiBnYW1lLlRJTEVfSEVJR0hUIC1cclxuICAgICAgICAgICAgICAgIGdhbWUuaW50ZXJwb2xhdGVkQ2FtWSAqIGdhbWUuVElMRV9IRUlHSFQpICpcclxuICAgICAgICAgICAgdXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIHRoaXMuc2l6ZSAqIHVwc2NhbGVTaXplICogZ2FtZS5USUxFX1dJRFRILFxyXG4gICAgICAgICAgICB0aGlzLnNpemUgKiB1cHNjYWxlU2l6ZSAqIGdhbWUuVElMRV9IRUlHSFRcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHRpY2soKSB7XHJcbiAgICAgICAgdGhpcy5hZ2UrKztcclxuICAgICAgICB0aGlzLnggKz0gdGhpcy54VmVsO1xyXG4gICAgICAgIHRoaXMueSArPSB0aGlzLnlWZWw7XHJcbiAgICAgICAgdGhpcy54VmVsIC09IChNYXRoLmFicyh0aGlzLnhWZWwpICogdGhpcy54VmVsICogZ2FtZS5EUkFHX0NPRUZGSUNJRU5UICogdGhpcy5zaXplKTsvL2Fzc3VtaW5nIGNvbnN0YW50IG1hc3MgZm9yIGVhY2ggcGFydGljbGVcclxuICAgICAgICBpZiAodGhpcy5ncmF2aXR5KSB7XHJcbiAgICAgICAgICAgIHRoaXMueVZlbCArPSBnYW1lLkdSQVZJVFlfU1BFRUQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMueVZlbCAtPSAoTWF0aC5hYnModGhpcy55VmVsKSAqIHRoaXMueVZlbCAqIGdhbWUuRFJBR19DT0VGRklDSUVOVCAqIHRoaXMuc2l6ZSk7XHJcbiAgICB9XHJcblxyXG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbi8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBfX3dlYnBhY2tfbW9kdWxlc19fO1xuXG4iLCJ2YXIgZGVmZXJyZWQgPSBbXTtcbl9fd2VicGFja19yZXF1aXJlX18uTyA9IChyZXN1bHQsIGNodW5rSWRzLCBmbiwgcHJpb3JpdHkpID0+IHtcblx0aWYoY2h1bmtJZHMpIHtcblx0XHRwcmlvcml0eSA9IHByaW9yaXR5IHx8IDA7XG5cdFx0Zm9yKHZhciBpID0gZGVmZXJyZWQubGVuZ3RoOyBpID4gMCAmJiBkZWZlcnJlZFtpIC0gMV1bMl0gPiBwcmlvcml0eTsgaS0tKSBkZWZlcnJlZFtpXSA9IGRlZmVycmVkW2kgLSAxXTtcblx0XHRkZWZlcnJlZFtpXSA9IFtjaHVua0lkcywgZm4sIHByaW9yaXR5XTtcblx0XHRyZXR1cm47XG5cdH1cblx0dmFyIG5vdEZ1bGZpbGxlZCA9IEluZmluaXR5O1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IGRlZmVycmVkLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIFtjaHVua0lkcywgZm4sIHByaW9yaXR5XSA9IGRlZmVycmVkW2ldO1xuXHRcdHZhciBmdWxmaWxsZWQgPSB0cnVlO1xuXHRcdGZvciAodmFyIGogPSAwOyBqIDwgY2h1bmtJZHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdGlmICgocHJpb3JpdHkgJiAxID09PSAwIHx8IG5vdEZ1bGZpbGxlZCA+PSBwcmlvcml0eSkgJiYgT2JqZWN0LmtleXMoX193ZWJwYWNrX3JlcXVpcmVfXy5PKS5ldmVyeSgoa2V5KSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXy5PW2tleV0oY2h1bmtJZHNbal0pKSkpIHtcblx0XHRcdFx0Y2h1bmtJZHMuc3BsaWNlKGotLSwgMSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmdWxmaWxsZWQgPSBmYWxzZTtcblx0XHRcdFx0aWYocHJpb3JpdHkgPCBub3RGdWxmaWxsZWQpIG5vdEZ1bGZpbGxlZCA9IHByaW9yaXR5O1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihmdWxmaWxsZWQpIHtcblx0XHRcdGRlZmVycmVkLnNwbGljZShpLS0sIDEpXG5cdFx0XHR2YXIgciA9IGZuKCk7XG5cdFx0XHRpZiAociAhPT0gdW5kZWZpbmVkKSByZXN1bHQgPSByO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gcmVzdWx0O1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmcgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpIHJldHVybiBnbG9iYWxUaGlzO1xuXHR0cnkge1xuXHRcdHJldHVybiB0aGlzIHx8IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSByZXR1cm4gd2luZG93O1xuXHR9XG59KSgpOyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBubyBiYXNlVVJJXG5cbi8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4vLyB1bmRlZmluZWQgPSBjaHVuayBub3QgbG9hZGVkLCBudWxsID0gY2h1bmsgcHJlbG9hZGVkL3ByZWZldGNoZWRcbi8vIFtyZXNvbHZlLCByZWplY3QsIFByb21pc2VdID0gY2h1bmsgbG9hZGluZywgMCA9IGNodW5rIGxvYWRlZFxudmFyIGluc3RhbGxlZENodW5rcyA9IHtcblx0XCJtYWluXCI6IDBcbn07XG5cbi8vIG5vIGNodW5rIG9uIGRlbWFuZCBsb2FkaW5nXG5cbi8vIG5vIHByZWZldGNoaW5nXG5cbi8vIG5vIHByZWxvYWRlZFxuXG4vLyBubyBITVJcblxuLy8gbm8gSE1SIG1hbmlmZXN0XG5cbl9fd2VicGFja19yZXF1aXJlX18uTy5qID0gKGNodW5rSWQpID0+IChpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPT09IDApO1xuXG4vLyBpbnN0YWxsIGEgSlNPTlAgY2FsbGJhY2sgZm9yIGNodW5rIGxvYWRpbmdcbnZhciB3ZWJwYWNrSnNvbnBDYWxsYmFjayA9IChwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbiwgZGF0YSkgPT4ge1xuXHR2YXIgW2NodW5rSWRzLCBtb3JlTW9kdWxlcywgcnVudGltZV0gPSBkYXRhO1xuXHQvLyBhZGQgXCJtb3JlTW9kdWxlc1wiIHRvIHRoZSBtb2R1bGVzIG9iamVjdCxcblx0Ly8gdGhlbiBmbGFnIGFsbCBcImNodW5rSWRzXCIgYXMgbG9hZGVkIGFuZCBmaXJlIGNhbGxiYWNrXG5cdHZhciBtb2R1bGVJZCwgY2h1bmtJZCwgaSA9IDA7XG5cdGlmKGNodW5rSWRzLnNvbWUoKGlkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2lkXSAhPT0gMCkpKSB7XG5cdFx0Zm9yKG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XG5cdFx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8obW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuXHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLm1bbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihydW50aW1lKSB2YXIgcmVzdWx0ID0gcnVudGltZShfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblx0fVxuXHRpZihwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbikgcGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24oZGF0YSk7XG5cdGZvcig7aSA8IGNodW5rSWRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0Y2h1bmtJZCA9IGNodW5rSWRzW2ldO1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhpbnN0YWxsZWRDaHVua3MsIGNodW5rSWQpICYmIGluc3RhbGxlZENodW5rc1tjaHVua0lkXSkge1xuXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdWzBdKCk7XG5cdFx0fVxuXHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9IDA7XG5cdH1cblx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18uTyhyZXN1bHQpO1xufVxuXG52YXIgY2h1bmtMb2FkaW5nR2xvYmFsID0gc2VsZltcIndlYnBhY2tDaHVua3Nub3dlZF9pblwiXSA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtzbm93ZWRfaW5cIl0gfHwgW107XG5jaHVua0xvYWRpbmdHbG9iYWwuZm9yRWFjaCh3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIDApKTtcbmNodW5rTG9hZGluZ0dsb2JhbC5wdXNoID0gd2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCBjaHVua0xvYWRpbmdHbG9iYWwucHVzaC5iaW5kKGNodW5rTG9hZGluZ0dsb2JhbCkpOyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgZGVwZW5kcyBvbiBvdGhlciBsb2FkZWQgY2h1bmtzIGFuZCBleGVjdXRpb24gbmVlZCB0byBiZSBkZWxheWVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyh1bmRlZmluZWQsIFtcImNvbW1vbnMtbWFpblwiXSwgKCkgPT4gKF9fd2VicGFja19yZXF1aXJlX18oXCIuL3dlYnBhZ2Uvc3JjL01haW4udHNcIikpKVxuX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyhfX3dlYnBhY2tfZXhwb3J0c19fKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==