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
    TileType[TileType["TileEntity"] = 1] = "TileEntity";
    TileType[TileType["Snow"] = 2] = "Snow";
    TileType[TileType["Ice"] = 3] = "Ice";
    TileType[TileType["Dirt"] = 4] = "Dirt";
    TileType[TileType["Stone0"] = 5] = "Stone0";
    TileType[TileType["Stone1"] = 6] = "Stone1";
    TileType[TileType["Stone2"] = 7] = "Stone2";
    TileType[TileType["Stone3"] = 8] = "Stone3";
    TileType[TileType["Stone4"] = 9] = "Stone4";
    TileType[TileType["Stone5"] = 10] = "Stone5";
    TileType[TileType["Stone6"] = 11] = "Stone6";
    TileType[TileType["Stone7"] = 12] = "Stone7";
    TileType[TileType["Stone8"] = 13] = "Stone8";
    TileType[TileType["Stone9"] = 14] = "Stone9";
    // Wood0,
    // Wood1,
    // Wood2,
    // Wood3,
    // Wood4,
    // Wood5,
    // Wood6,
    // Wood7,
    // Wood8,
    // Wood9,
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
const ColorParticle_1 = __webpack_require__(/*! ./world/particles/ColorParticle */ "./webpage/src/world/particles/ColorParticle.ts");
const WorldTiles_1 = __webpack_require__(/*! ./world/WorldTiles */ "./webpage/src/world/WorldTiles.ts");
/*
///INFORMATION
//Starting a game
Press Live Server to start the game
or
Type npm run prestart to start the game.
//TODO
when something in the todo section, either delete it and mark what was done in the description -
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
        this.worldHeight = 256; // height of the world in tiles  <!> MAKE SURE THIS IS NEVER LESS THAN 64!!! <!>
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
        this.desiredCamX = 0; // desired position of the camera
        this.desiredCamY = 0; // desired position of the camera
        this.screenshakeAmount = 0; // amount of screenshake happening at the current moment
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
        Assets_1.AudioAssets.ambient.winter1.playSound();
        this.particleMultiplier = 1;
        this.skyToggle = true;
        this.skyMod = 2;
        this.particles = [];
    }
    draw() {
        for (let i = 0; i < 40 * this.particleMultiplier; i++) {
            //this.particles.push(new ColorParticle("#eb5834", 1/4, 10, this.worldMouseX+Math.random(), this.worldMouseY+Math.random(), Math.random()-0.5, Math.random()/4-0.5, false));
        }
        if (this.frameCount === 2) {
            this.skyShader.setUniform("screenDimensions", [this.width / this.upscaleSize, this.height / this.upscaleSize]);
            this.skyShader.setUniform("skyImage", Assets_1.WorldAssets.shaderResources.skyImage.image);
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
        this.tint(255, 100);
        Assets_1.UiAssets.vignette.render(this, 0, 0, this.width, this.height);
        this.noTint();
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
        if (this.currentUi !== undefined)
            this.currentUi.render(this, this.upscaleSize);
        // console.timeEnd("frame");
    }
    windowResized() {
        this.resizeCanvas(this.windowWidth, this.windowHeight);
        this.skyLayer.resizeCanvas(this.windowWidth, this.windowHeight);
        this.skyShader.setUniform("screenDimensions", [this.windowWidth / this.upscaleSize * 2, this.windowHeight / this.upscaleSize * 2]);
        // go for a scale of <48 tiles screen
        this.upscaleSize = Math.min(Math.ceil(this.windowWidth / 48 / this.TILE_WIDTH), Math.ceil(this.windowHeight / 48 / this.TILE_HEIGHT));
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
            const clickedSlot = Math.floor((this.mouseX - 2 * this.upscaleSize) / 16 / this.upscaleSize);
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
            for (let i = 0; i < 10 * this.particleMultiplier; i++) {
                let idx = this.world.width * this.worldMouseY + this.worldMouseX;
                let tile = this.world.worldTiles[idx];
                this.particles.push(new ColorParticle_1.ColorParticle(WorldTiles_1.WorldTiles[tile].color, 1 / 4 * Math.random(), 15, this.worldMouseX + 0.5, this.worldMouseY + 0.5, (Math.random() - 0.5) / 5, -Math.random() / 5, true));
            }
            this.connection.emit('worldBreakStart', this.world.width * this.worldMouseY + this.worldMouseX);
            this.connection.emit('worldBreakFinish');
            this.screenshakeAmount = 0.5;
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
        const releasedSlot = Math.floor((this.mouseX - 2 * this.upscaleSize) / 16 / this.upscaleSize);
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
            this.pCamX + (this.camX - this.pCamX) * this.amountSinceLastTick + (this.noise(this.millis() / 200) - 0.5) * this.screenshakeAmount;
        this.interpolatedCamY =
            this.pCamY + (this.camY - this.pCamY) * this.amountSinceLastTick + (this.noise(0, this.millis() / 200) - 0.5) * this.screenshakeAmount;
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
        this.desiredCamX =
            this.world.player.x +
                this.world.player.width / 2 -
                this.width / 2 / this.TILE_WIDTH / this.upscaleSize +
                this.world.player.xVel * 40;
        this.desiredCamY =
            this.world.player.y +
                this.world.player.height / 2 -
                this.height / 2 / this.TILE_HEIGHT / this.upscaleSize +
                this.world.player.yVel * 20;
        this.camX = (this.desiredCamX + this.camX * 24) / 25;
        this.camY = (this.desiredCamY + this.camY * 24) / 25;
        this.screenshakeAmount *= 0.8;
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
        x = Math.round(x / this.upscaleSize) * this.upscaleSize;
        y = Math.round(y / this.upscaleSize) * this.upscaleSize;
        w = Math.round(w / this.upscaleSize) * this.upscaleSize;
        h = Math.round(h / this.upscaleSize) * this.upscaleSize;
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
        this.worldMouseX = Math.floor((this.interpolatedCamX * this.TILE_WIDTH +
            this.mouseX / this.upscaleSize) /
            this.TILE_WIDTH);
        this.worldMouseY = Math.floor((this.interpolatedCamY * this.TILE_HEIGHT +
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
const ReflectedImageResource_1 = __importDefault(__webpack_require__(/*! ./resources/ReflectedImageResource */ "./webpage/src/assets/resources/ReflectedImageResource.ts"));
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
    title_image: new ImageResource_1.default('assets/textures/ui/snowedinBUMP.png'),
    vignette: new ImageResource_1.default('assets/textures/ui/vignette-export.png'),
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
    shaderResources: {
        skyImage: new ImageResource_1.default('assets/textures/shader_resources/poissonsnow.png'),
    },
    middleground: {
        tileset_ice: new TileResource_1.default('assets/textures/world/middleground/tileset_ice.png', 16, 1, 8, 8),
        tileset_snow: new TileResource_1.default('assets/textures/world/middleground/tileset_snow.png', 16, 1, 8, 8),
        tileset_dirt: new TileResource_1.default('assets/textures/world/middleground/tileset_dirt0.png', 16, 1, 8, 8),
        tileset_stone0: new TileResource_1.default('assets/textures/world/middleground/tileset_stone0.png', 16, 1, 8, 8),
        tileset_stone1: new TileResource_1.default('assets/textures/world/middleground/tileset_stone1.png', 16, 1, 8, 8),
        tileset_stone2: new TileResource_1.default('assets/textures/world/middleground/tileset_stone2.png', 16, 1, 8, 8),
        tileset_stone3: new TileResource_1.default('assets/textures/world/middleground/tileset_stone3.png', 16, 1, 8, 8),
        tileset_stone4: new TileResource_1.default('assets/textures/world/middleground/tileset_stone4.png', 16, 1, 8, 8),
        tileset_stone5: new TileResource_1.default('assets/textures/world/middleground/tileset_stone5.png', 16, 1, 8, 8),
        tileset_stone6: new TileResource_1.default('assets/textures/world/middleground/tileset_stone6.png', 16, 1, 8, 8),
        tileset_stone7: new TileResource_1.default('assets/textures/world/middleground/tileset_stone7.png', 16, 1, 8, 8),
        tileset_stone8: new TileResource_1.default('assets/textures/world/middleground/tileset_stone8.png', 16, 1, 8, 8),
        tileset_stone9: new TileResource_1.default('assets/textures/world/middleground/tileset_stone9.png', 16, 1, 8, 8),
    },
    foreground: {
        tileset_pipe: new TileResource_1.default('assets/textures/world/foreground/tileset_pipe.png', 16, 1, 8, 8),
    },
    tileEntities: {
        entity_t1drill: [
            new ImageResource_1.default('assets/textures/world/tileEntities/RustyDrill1.png'),
            new ImageResource_1.default('assets/textures/world/tileEntities/RustyDrill2.png'),
            new ImageResource_1.default('assets/textures/world/tileEntities/RustyDrill3.png'),
            new ImageResource_1.default('assets/textures/world/tileEntities/RustyDrill4.png'),
            new ImageResource_1.default('assets/textures/world/tileEntities/RustyDrill5.png'),
            new ImageResource_1.default('assets/textures/world/tileEntities/RustyDrill6.png'),
            new ImageResource_1.default('assets/textures/world/tileEntities/RustyDrill7.png'),
            new ImageResource_1.default('assets/textures/world/tileEntities/RustyDrill8.png'),
            new ImageResource_1.default('assets/textures/world/tileEntities/RustyDrill9.png'),
            new ImageResource_1.default('assets/textures/world/tileEntities/RustyDrill10.png'),
            new ImageResource_1.default('assets/textures/world/tileEntities/RustyDrill11.png'),
            new ImageResource_1.default('assets/textures/world/tileEntities/RustyDrill12.png'),
            new ImageResource_1.default('assets/textures/world/tileEntities/RustyDrill13.png')
        ]
    }
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
    big: new FontResource_1.default('assets/textures/ui/fontBig.png', {
        "0": 14,
        "1": 14,
        "2": 14,
        "3": 12,
        "4": 12,
        "5": 12,
        "6": 12,
        "7": 14,
        "8": 14,
        "9": 12,
        "A": 12,
        "B": 14,
        "C": 14,
        "D": 12,
        "E": 14,
        "F": 12,
        "G": 14,
        "H": 14,
        "I": 14,
        "J": 16,
        "K": 12,
        "L": 12,
        "M": 16,
        "N": 16,
        "O": 16,
        "P": 18,
        "Q": 16,
        "R": 14,
        "S": 14,
        "T": 16,
        "U": 16,
        "V": 16,
        "W": 20,
        "X": 16,
        "Y": 16,
        "Z": 18,
        "a": 14,
        "b": 14,
        "c": 12,
        "d": 14,
        "e": 12,
        "f": 12,
        "g": 12,
        "h": 12,
        "i": 10,
        "j": 12,
        "k": 10,
        "l": 10,
        "m": 16,
        "n": 10,
        "o": 10,
        "p": 10,
        "q": 14,
        "r": 10,
        "s": 8,
        "t": 10,
        "u": 10,
        "v": 10,
        "w": 14,
        "x": 12,
        "y": 10,
        "z": 10,
        "!": 8,
        ".": 4,
        ",": 4,
        "?": 12,
        "_": 12,
        "-": 8,
        ":": 4,
        " ": 4
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
    },
    ambient: {
        winter1: new AudioResource_1.default('assets/sounds/sfx/ambient/65813__pcaeldries__countrysidewinterevening02.wav')
    }
};
exports.AudioAssets = AudioAssets;
// const animations = <T extends Record<string, ImageResource[]>>(data: T): T => data
const PlayerAnimations = {
    idle: [
        new ReflectedImageResource_1.default('assets/textures/player/character.png'),
    ]
};
exports.PlayerAnimations = PlayerAnimations;
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

/***/ "./webpage/src/assets/resources/ReflectedImageResource.ts":
/*!****************************************************************!*\
  !*** ./webpage/src/assets/resources/ReflectedImageResource.ts ***!
  \****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Resource_1 = __importDefault(__webpack_require__(/*! ./Resource */ "./webpage/src/assets/resources/Resource.ts"));
const Tile_1 = __webpack_require__(/*! ../../../../api/Tile */ "./api/Tile.ts");
module.exports = class ReflectableImageResource extends Resource_1.default {
    constructor(path) {
        super(path);
        this.hasReflection = false;
    }
    ;
    loadResource(game) {
        this.image = game.loadImage(this.path);
    }
    render(target, x, y, width, height) {
        //console.log(WorldTiles);
        // Verify that the image has been loaded
        if (this.image === undefined)
            throw new Error(`Tried to render image before loading it: ${this.path}`);
        // Draw non tiles image
        target.image(this.image, x, y, width, height);
    }
    renderWorldspaceReflection(target, x, y, width, height) {
        if (this.image === undefined)
            throw new Error(`Tried to render reflection of image before loading it: ${this.path}`);
        if (!this.hasReflection) { //this is so it doesn't load them all at once and instead makes the reflections when they are needed
            this.hasReflection = true;
            this.reflection = target.createImage(this.image.width, this.image.height);
            this.reflection.loadPixels();
            this.image.loadPixels();
            for (let i = 0; i < this.reflection.width; i++) { //generate a reflection image that is displayed as a reflection
                for (let j = 0; j < this.reflection.height; j++) {
                    for (let k = 0; k < 3; k++) {
                        this.reflection.pixels[4 * (j * this.reflection.width + i) + k] = this.image.pixels[4 * ((this.image.height - j - 1) * this.image.width + i) + k];
                    }
                    this.reflection.pixels[4 * (j * this.reflection.width + i) + 3] =
                        this.image.pixels[4 * ((this.image.height - j - 1) * this.image.width + i) + 3] *
                            ((this.reflection.height - j) / this.reflection.height) *
                            (this.reflection.width / 2 + 0.5 - Math.abs(i - this.reflection.width / 2 + 0.5)) / (this.reflection.width / 2);
                }
            }
            this.reflection.updatePixels();
        }
        target.fill(255, 0, 0);
        target.stroke(150, 0, 0);
        //loop through every tile it passes through
        for (let i = Math.floor(x); i < x + width; i++) {
            for (let j = Math.floor(y); j < y + height; j++) {
                // console.log(target.world.worldTiles);
                let currentBlock = target.world.worldTiles[j * target.worldWidth + i];
                if (currentBlock === undefined || currentBlock == Tile_1.TileType.Air || currentBlock == Tile_1.TileType.TileEntity) { //the reference to TileEntity can be removed as soon as the better system is in place
                    continue;
                }
                target.tint(255, 150); //TODO make it somewhat translucent based on the reflectivity of the tile
                target.image(this.reflection, (i * target.TILE_WIDTH -
                    target.interpolatedCamX * target.TILE_WIDTH) *
                    target.upscaleSize, (j * target.TILE_HEIGHT -
                    target.interpolatedCamY * target.TILE_HEIGHT) *
                    target.upscaleSize, target.TILE_WIDTH * target.upscaleSize, target.TILE_HEIGHT * target.upscaleSize, (i - x) * target.TILE_WIDTH, (j - y) * target.TILE_HEIGHT, target.TILE_WIDTH, target.TILE_HEIGHT);
                target.noTint();
            }
        }
    }
    renderPartial(target, x, y, width, height, sourceX, sourceY, sourceWidth, sourceHeight) {
        // Verify that the tiles has been loaded
        if (this.image === undefined)
            throw new Error(`Tried to render image before loading it: ${this.path}`);
        // Draw a partial part of the image
        target.image(this.image, x, y, width, height, sourceX, sourceY, sourceWidth, sourceHeight);
    }
};


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
        this.loadWorld();
    }
    tick(game) {
        if (this.player !== undefined)
            game.connection.emit('playerUpdate', this.player.x, this.player.y);
    }
    render(target, upscaleSize) {
        // draw the tiles layer onto the screen
        target.image(this.tileLayer, 0, 0, (Main_1.default.width / upscaleSize) * upscaleSize, (Main_1.default.height / upscaleSize) * upscaleSize, (Main_1.default.interpolatedCamX * Main_1.default.TILE_WIDTH), (Main_1.default.interpolatedCamY * Main_1.default.TILE_WIDTH), (Main_1.default.width / upscaleSize), (Main_1.default.height / upscaleSize));
        this.renderPlayers(target, upscaleSize);
        target.stroke(0);
        target.strokeWeight(4);
        target.noFill();
        target.rect(target.width - this.width, 0, this.width, this.height);
        target.image(this.tileLayer, target.width - this.width, 0, this.width, this.height);
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
                if (tileVal !== Tile_1.TileType.Air && tileVal !== Tile_1.TileType.TileEntity) {
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
    [Tile_1.TileType.TileEntity]: {
        name: 'TileEntity',
        texture: undefined,
        color: "#bbbbbb",
        friction: 1,
        reflectivity: 0
    },
    [Tile_1.TileType.Snow]: {
        name: 'snow',
        texture: Assets_1.WorldAssets.middleground.tileset_snow,
        connected: true,
        anyConnection: true,
        color: "#cafafc",
        friction: 2,
        reflectivity: 50
    },
    [Tile_1.TileType.Ice]: {
        name: 'ice',
        texture: Assets_1.WorldAssets.middleground.tileset_ice,
        connected: true,
        anyConnection: true,
        color: "#76adc4",
        friction: 1.5,
        reflectivity: 255
    },
    [Tile_1.TileType.Dirt]: {
        name: 'dirt',
        texture: Assets_1.WorldAssets.middleground.tileset_dirt,
        connected: true,
        anyConnection: true,
        color: "#4a2e1e",
        friction: 4,
        reflectivity: 0
    },
    [Tile_1.TileType.Stone0]: {
        name: 'raw stone',
        texture: Assets_1.WorldAssets.middleground.tileset_stone0,
        connected: true,
        anyConnection: true,
        color: "#414245",
        friction: 3,
        reflectivity: 10
    },
    [Tile_1.TileType.Stone1]: {
        name: 'stone tier 1',
        texture: Assets_1.WorldAssets.middleground.tileset_stone1,
        connected: true,
        anyConnection: true,
        color: "#31323b",
        friction: 3,
        reflectivity: 15
    },
    [Tile_1.TileType.Stone2]: {
        name: 'stone tier 2',
        texture: Assets_1.WorldAssets.middleground.tileset_stone2,
        connected: true,
        anyConnection: true,
        color: "#31323b",
        friction: 3,
        reflectivity: 17
    },
    [Tile_1.TileType.Stone3]: {
        name: 'stone tier 3',
        texture: Assets_1.WorldAssets.middleground.tileset_stone3,
        connected: true,
        anyConnection: true,
        color: "#31323b",
        friction: 3,
        reflectivity: 19
    },
    [Tile_1.TileType.Stone4]: {
        name: 'stone tier 4',
        texture: Assets_1.WorldAssets.middleground.tileset_stone4,
        connected: true,
        anyConnection: true,
        color: "#31323b",
        friction: 3,
        reflectivity: 21
    },
    [Tile_1.TileType.Stone5]: {
        name: 'stone tier 5',
        texture: Assets_1.WorldAssets.middleground.tileset_stone5,
        connected: true,
        anyConnection: true,
        color: "#31323b",
        friction: 3,
        reflectivity: 23
    },
    [Tile_1.TileType.Stone6]: {
        name: 'stone tier 6',
        texture: Assets_1.WorldAssets.middleground.tileset_stone6,
        connected: true,
        anyConnection: true,
        color: "#31323b",
        friction: 3,
        reflectivity: 25
    },
    [Tile_1.TileType.Stone7]: {
        name: 'stone tier 7',
        texture: Assets_1.WorldAssets.middleground.tileset_stone7,
        connected: true,
        anyConnection: true,
        color: "#31323b",
        friction: 3,
        reflectivity: 27
    },
    [Tile_1.TileType.Stone8]: {
        name: 'stone tier 8',
        texture: Assets_1.WorldAssets.middleground.tileset_stone8,
        connected: true,
        anyConnection: true,
        color: "#31323b",
        friction: 3,
        reflectivity: 29
    },
    [Tile_1.TileType.Stone9]: {
        name: 'stone tier 9',
        texture: Assets_1.WorldAssets.middleground.tileset_stone9,
        connected: true,
        anyConnection: true,
        color: "#31323b",
        friction: 3,
        reflectivity: 31
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
const Tile_1 = __webpack_require__(/*! ../../../../api/Tile */ "./api/Tile.ts");
const WorldTiles_1 = __webpack_require__(/*! ../WorldTiles */ "./webpage/src/world/WorldTiles.ts");
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
        this.currentAnimation = "idle";
        this.animFrame = 0;
        this.topCollision = WorldTiles_1.WorldTiles[Tile_1.TileType.Air]; //hacky
        this.bottomCollision = WorldTiles_1.WorldTiles[Tile_1.TileType.Air];
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
    }
    render(target, upscaleSize) {
        Assets_1.PlayerAnimations[this.currentAnimation][this.animFrame].render(target, (this.interpolatedX * Main_1.default.TILE_WIDTH -
            Main_1.default.interpolatedCamX * Main_1.default.TILE_WIDTH) *
            upscaleSize, (this.interpolatedY * Main_1.default.TILE_HEIGHT -
            Main_1.default.interpolatedCamY * Main_1.default.TILE_HEIGHT) *
            upscaleSize, this.width * upscaleSize * Main_1.default.TILE_WIDTH, this.height * upscaleSize * Main_1.default.TILE_HEIGHT);
        Assets_1.PlayerAnimations[this.currentAnimation][this.animFrame].renderWorldspaceReflection(target, this.interpolatedX, this.interpolatedY + this.height, this.width, this.height);
    }
    updateData(data) {
        if (data.type === Entity_1.Entities.Player)
            this.name = data.data.name;
    }
    keyboardInput() {
        this.xVel +=
            0.02 * (+this.rightButton - +this.leftButton);
        if (this.grounded && this.jumpButton) {
            Main_1.default.screenshakeAmount = 0.5;
            for (let i = 0; i < 10 * Main_1.default.particleMultiplier; i++) {
                Main_1.default.particles.push(new ColorParticle_1.ColorParticle(this.bottomCollision.color, 1 / 8 + Math.random() / 8, 20, this.x + this.width * Math.random(), this.y + this.height, 0.2 * (Math.random() - 0.5), 0.2 * -Math.random()));
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
                (Math.abs(this.xVel) * this.xVel * Main_1.default.DRAG_COEFFICIENT * this.width) / //apply air resistance
                    this.mass;
        }
        else {
            this.xVel -=
                (Math.abs(this.xVel) * this.xVel * Main_1.default.DRAG_COEFFICIENT * (this.bottomCollision.friction) * this.width) / //apply air resistance and ground friction
                    this.mass;
        }
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
                Main_1.default.particles.push(new ColorParticle_1.ColorParticle(this.bottomCollision.color, 1 / 8 + Math.random() / 8, 10, this.x + this.width / 2, this.y + this.height, 0.2 * -this.xVel + 0.2 * (Math.random() - 0.5), 0.2 * -Math.random(), true));
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
        this.topCollision = WorldTiles_1.WorldTiles[Tile_1.TileType.Air];
        this.bottomCollision = WorldTiles_1.WorldTiles[Tile_1.TileType.Air];
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
        let mostlyGoingHorizontally;
        // loop through all the possible tiles the physics box could be intersecting with
        for (let i = Math.floor(Main_1.default.min(this.x, this.x + this.xVel)); i < Math.ceil(Main_1.default.max(this.x, this.x + this.xVel) + this.width); i++) {
            for (let j = Math.floor(Main_1.default.min(this.y, this.y + this.yVel)); j < Math.ceil(Main_1.default.max(this.y, this.y + this.yVel) + this.height); j++) {
                // if the current tile isn't air (value 0), then continue with the collision detection
                let currentBlock = Main_1.default.world.worldTiles[j * Main_1.default.worldWidth + i];
                if (currentBlock != 0) {
                    // get the data about the collision and store it in a variable
                    this.collisionData = Main_1.default.rectVsRay(i - this.width, j - this.height, this.width + 1, this.height + 1, this.x, this.y, this.xVel, this.yVel);
                    mostlyGoingHorizontally = Math.abs(this.xVel) > Math.abs(this.yVel);
                    if (this.collisionData !== false) { //a collision happened
                        if (this.closestCollision[2] > this.collisionData[2]) {
                            this.closestCollision = this.collisionData; //honestly this entire collision system is a mess but it work so so what
                            if (this.closestCollision[0] === 0) {
                                if (this.closestCollision[1] === 1) {
                                    this.topCollision = WorldTiles_1.WorldTiles[currentBlock];
                                }
                                else {
                                    this.bottomCollision = WorldTiles_1.WorldTiles[currentBlock];
                                }
                            }
                        }
                        else if (this.closestCollision[2] === this.collisionData[2] && mostlyGoingHorizontally === (this.closestCollision[0] === 0)) {
                            this.closestCollision = this.collisionData;
                            if (this.closestCollision[0] === 0) {
                                if (this.closestCollision[1] === 1) {
                                    this.topCollision = WorldTiles_1.WorldTiles[currentBlock];
                                }
                                else {
                                    this.bottomCollision = WorldTiles_1.WorldTiles[currentBlock];
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
                    if (!this.pGrounded) { //if it isn't grounded yet, it must be colliding with the ground for the first time, so summon particles
                        Main_1.default.screenshakeAmount = Math.abs(this.yVel * 0.75);
                        for (let i = 0; i < 5 * Main_1.default.particleMultiplier; i++) {
                            Main_1.default.particles.push(new ColorParticle_1.ColorParticle(this.bottomCollision.color, 1 / 8 + Math.random() / 8, 20, this.x + this.width * Math.random(), this.y + this.height, 0.2 * (Math.random() - 0.5), 0.2 * -Math.random()));
                        }
                    }
                }
                else {
                    Main_1.default.screenshakeAmount = Math.abs(this.yVel * 0.75);
                    for (let i = 0; i < 5 * Main_1.default.particleMultiplier; i++) { //ceiling collision particles
                        Main_1.default.particles.push(new ColorParticle_1.ColorParticle(this.topCollision.color, 1 / 8 + Math.random() / 8, 20, this.x + this.width * Math.random(), this.y, 0.2 * (Math.random() - 0.5), 0.2 * -Math.random()));
                    }
                }
                this.yVel = 0; // set the y velocity to 0 because the object has run into a wall on its top or bottom
                this.slideX = this.xVel * (1 - this.closestCollision[2]); // this is the remaining distance to slide after the collision
                this.slideY = 0; // it doesn't slide in the y direction because there's a wall \(.-.)/
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
                    let currentBlock = Main_1.default.world.worldTiles[j * Main_1.default.worldWidth + i];
                    // if the current tile isn't air, then continue with the collision detection
                    if (currentBlock !== Tile_1.TileType.Air) {
                        // get the data about the collision and store it in a variable
                        this.collisionData = Main_1.default.rectVsRay(i - this.width, j - this.height, this.width + 1, this.height + 1, this.x, this.y, this.slideX, this.slideY);
                        if (this.collisionData !== false &&
                            this.closestCollision[2] > this.collisionData[2]) {
                            this.closestCollision = this.collisionData;
                            if (this.closestCollision[0] === 0) {
                                if (this.closestCollision[1] === 1) {
                                    this.topCollision = WorldTiles_1.WorldTiles[currentBlock];
                                }
                                else {
                                    this.bottomCollision = WorldTiles_1.WorldTiles[currentBlock];
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
function axisAlignedDistance(x1, y1, x2, y2) {
    return abs(x1 - x2) + abs(y1 - y2);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RSxJQUFJLEVBQUUsRUFBRSxFQUFFLEdBQUUsRUFBRTtnQkFDbEMsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUM7WUFDMUIsQ0FBQyxDQUFDO1lBQ0YsSUFBSSxpQkFBTyxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEdBQUUsRUFBRTtnQkFDbEMsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUM7WUFDMUIsQ0FBQyxDQUFDO1lBQ0YsSUFBSSxpQkFBTyxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEdBQUUsRUFBRTtnQkFDbEMsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUM7WUFDMUIsQ0FBQyxDQUFDO1lBQ0YsSUFBSSxpQkFBTyxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEdBQUUsRUFBRTtnQkFDbEMsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUM7WUFDMUIsQ0FBQyxDQUFDO1lBQ0YsSUFBSSxpQkFBTyxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEdBQUUsRUFBRTtnQkFDbEMsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUM7WUFDMUIsQ0FBQyxDQUFDO1lBQ0YsSUFBSSxpQkFBTyxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEdBQUUsRUFBRTtnQkFDbEMsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUM7WUFDMUIsQ0FBQyxDQUFDO1lBQ0YsSUFBSSxpQkFBTyxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEdBQUUsRUFBRTtnQkFDbEMsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUM7WUFDMUIsQ0FBQyxDQUFDLEVBQUMsWUFBWTtTQUNsQixDQUFDO1FBeUJFLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1FBRTdCLGlDQUFpQztRQUNqQyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksdUJBQVUsQ0FBQyxJQUFJLENBQUM7SUFDMUMsQ0FB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TixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztLQUNULEVBQUUsd0VBQXdFLENBQUM7SUFFNUUsR0FBRyxFQUFFLElBQUksc0JBQVksQ0FBQyxnQ0FBZ0MsRUFBRTtRQUNwRCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztLQUNULEVBQUUsd0VBQXdFLENBQUM7Q0FFL0UsQ0FBQztBQWdUd0Qsc0JBQUs7QUE5Uy9ELE1BQU0sSUFBSSxHQUFHO0lBQ1QsV0FBVyxFQUFFO1FBQ1QsRUFBRTtRQUNGLEVBQUU7UUFDRixFQUFFO1FBQ0YsUUFBUTtRQUNSLEVBQUU7UUFD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QUFFLENBQUMsRUFBRSxFQUFFO3dCQUNyQixJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLEdBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEdBQUMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLEdBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQ2pJO29CQUNELElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsR0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssR0FBQyxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUM7d0JBQ3ZELElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxHQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFDLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQzs0QkFDbkUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxHQUFDLENBQUMsQ0FBQyxHQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDOzRCQUNuRCxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxHQUFDLENBQUMsR0FBQyxHQUFHLEdBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEdBQUMsQ0FBQyxHQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssR0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDbkc7YUFD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QUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUMzRyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDM0csSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRWpJLGlCQUFpQjtRQUNqQixJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDNUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRWxJLGlCQUFpQjtRQUNqQixJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDNUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRWxJLFNBQVM7UUFDVCxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFbkksSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxXQUFXLENBQUMsR0FBRyxXQUFXLEdBQUcsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxDQUFDO0lBQy9JLENBQUM7SUFFRCxlQUFlLENBQUMsTUFBYyxFQUFFLE1BQWM7UUFDMUMsMERBQTBE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LENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzNHLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUMzRyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFakksaUJBQWlCO1FBQ2pCLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM1RyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFbEksaUJBQWlCO1FBQ2pCLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM1RyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFbEksU0FBUztRQUNULElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUVuSSxJQUFHLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDZixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLEdBQUcsR0FBQyxtQkFBbUIsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxHQUFHLFdBQVcsR0FBRyxDQUFDLEdBQUcsV0FBVyxDQUFDLENBQUM7U0FDbEs7YUFDSTtZQUNELElBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDZCxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLEdBQUcsR0FBQyxNQUFNLEdBQUMsYUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxXQUFXLENBQUMsR0FBRyxXQUFXLEdBQUcsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxDQUFDO2FBQ2xMO2lCQUNJO2dCQUNELElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsR0FBRyxHQUFDLFlBQVksR0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFDLEdBQUcsV0FBVyxHQUFHLENBQUMsR0FBRyxXQUFXLENBQUMsQ0FBQzthQUN0SztTQUNKO0lBQ0wsQ0FBQztJQUVELGVBQWUsQ0FBQyxNQUFjLEVBQUUsTUFBYztRQUMxQywwREFBMEQ7UUFDMUQsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLENBQUMsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsQ0FBQyxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEVBQUU7WUFDNUYsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7U0FDM0I7YUFDSTtZQUNELElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO1NBQzVCO0lBQ0wsQ0FBQztJQUVELFNBQVM7UUFDTCxPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFDakMsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDakMsSUFBRyxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2YsSUFBSSxDQUFDLEtBQUssR0FBRyxpQkFBUSxDQUFDLGVBQWUsQ0FBQztZQUN0QyxPQUFPO1NBQ1Y7UUFDRCxJQUFJLENBQUMsS0FBSyxHQUFHLGlCQUFRLENBQUMsaUJBQWlCLENBQUM7UUFDeEMsOENBQThDO0lBQ2xELENBQUM7Q0FFSjtBQUVELGlCQUFTLFFBQVEsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7O0FDdkdsQiwrRkFBNEM7QUFDNUMsNEZBQTBCO0FBRzFCLE1BQU0sTUFBTTtJQWFSLFlBQ0ksSUFBa0IsRUFDbEIsR0FBVyxFQUNYLEtBQVksRUFDWixHQUFXLEVBQ1gsR0FBVyxFQUNYLElBQVksRUFDWixDQUFTLEVBQ1QsQ0FBUyxFQUNULENBQVMsRUFDVCxDQUFTLEVBQ1QsU0FBbUI7UUFDbkIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLO1FBQ2xCLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRztRQUNkLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRztRQUNkLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSTtRQUNoQixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVM7UUFDMUIsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDO1FBQ1YsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDO1FBQ1YsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDO1FBQ1YsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDO1FBQ1YsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7SUFDN0IsQ0FBQztJQUVELE1BQU0sQ0FBQyxNQUFVLEVBQUUsV0FBbUI7UUFDbEMsMEVBQTBFO1FBQzFFLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBQyxXQUFXLENBQUMsR0FBQyxXQUFXLENBQUM7UUFDckQsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUMsSUFBSSxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsR0FBQyxXQUFXLENBQUMsR0FBQyxXQUFXLENBQUM7UUFDaEUsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFDLFdBQVcsQ0FBQyxHQUFDLFdBQVcsQ0FBQztRQUVyRCwwQkFBMEI7UUFDMUIsaUJBQVEsQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFDLENBQUMsR0FBQyxXQUFXLEVBQUUsQ0FBQyxHQUFDLFdBQVcsRUFBRSxDQUFDLEdBQUMsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3hHLDJCQUEyQjtRQUMzQixpQkFBUSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFDLFdBQVcsRUFBRSxDQUFDLEdBQUMsQ0FBQyxHQUFDLFdBQVcsRUFBRSxDQUFDLEdBQUMsV0FBVyxFQUFFLENBQUMsR0FBQyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDeEgsdUJBQXVCO1FBQ3ZCLGlCQUFRLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFDLENBQUMsR0FBQyxXQUFXLEVBQUUsQ0FBQyxHQUFDLENBQUMsR0FBQyxXQUFXLEVBQUUsQ0FBQyxHQUFDLENBQUMsR0FBQyxXQUFXLEVBQUUsQ0FBQyxHQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN4SCxTQUFTO1FBQ1QsaUJBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFDLFdBQVcsQ0FBQyxHQUFDLFdBQVcsQ0FBQyxHQUFDLFdBQVcsRUFBRSxDQUFDLEdBQUMsQ0FBQyxHQUFDLFdBQVcsRUFBRSxDQUFDLEdBQUMsV0FBVyxFQUFFLENBQUMsR0FBQyxXQUFXLENBQUMsQ0FBQztJQUM1TCxDQUFDO0lBRUQsb0JBQW9CLENBQUMsTUFBYztRQUMvQixJQUFHLElBQUksQ0FBQyxXQUFXLEVBQUM7WUFDaEIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFDLElBQUksQ0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFDLGNBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLEdBQUMsY0FBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQzNMLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztTQUNwQjtJQUNMLENBQUM7Q0FFSjtBQUVELGlCQUFTLE1BQU0sQ0FBQzs7Ozs7Ozs7Ozs7O0FDbEVoQiwrRkFBNEM7QUFFNUMsTUFBTSxPQUFPO0lBT1QsWUFDSSxDQUFTLEVBQ1QsQ0FBUyxFQUNULENBQVMsRUFDVCxDQUFTO1FBQ1QsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDO1FBQ1YsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDO1FBQ1YsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDO1FBQ1YsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDO0lBQ2QsQ0FBQztJQUVELE1BQU0sQ0FBQyxNQUFVLEVBQUUsV0FBbUI7UUFDbEMsMEVBQTBFO1FBQzFFLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBQyxXQUFXLENBQUMsR0FBQyxXQUFXLENBQUM7UUFDckQsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFDLFdBQVcsQ0FBQyxHQUFDLFdBQVcsQ0FBQztRQUNyRCxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUMsV0FBVyxDQUFDLEdBQUMsV0FBVyxDQUFDO1FBQ3JELE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBQyxXQUFXLENBQUMsR0FBQyxXQUFXLENBQUM7UUFFckQsVUFBVTtRQUNWLGlCQUFRLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUMsV0FBVyxFQUFFLENBQUMsR0FBQyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDeEYsaUJBQVEsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBQyxXQUFXLEVBQUUsQ0FBQyxHQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN4RyxpQkFBUSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxXQUFXLEVBQUUsQ0FBQyxHQUFDLFdBQVcsRUFBRSxDQUFDLEdBQUMsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3hHLGlCQUFRLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFDLENBQUMsR0FBQyxDQUFDLEdBQUMsV0FBVyxFQUFFLENBQUMsR0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFDLFdBQVcsRUFBRSxDQUFDLEdBQUMsV0FBVyxFQUFFLENBQUMsR0FBQyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFeEgsaUJBQWlCO1FBQ2pCLGlCQUFRLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFDLENBQUMsR0FBQyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBQyxFQUFFLEdBQUMsV0FBVyxFQUFFLENBQUMsR0FBQyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDekcsaUJBQVEsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUMsQ0FBQyxHQUFDLFdBQVcsRUFBRSxDQUFDLEdBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxXQUFXLEVBQUUsQ0FBQyxHQUFDLEVBQUUsR0FBQyxXQUFXLEVBQUUsQ0FBQyxHQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUV6SCxpQkFBaUI7UUFDakIsaUJBQVEsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFDLENBQUMsR0FBQyxXQUFXLEVBQUUsQ0FBQyxHQUFDLFdBQVcsRUFBRSxDQUFDLEdBQUMsRUFBRSxHQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN6RyxpQkFBUSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFDLFdBQVcsRUFBRSxDQUFDLEdBQUMsQ0FBQyxHQUFDLFdBQVcsRUFBRSxDQUFDLEdBQUMsV0FBVyxFQUFFLENBQUMsR0FBQyxFQUFFLEdBQUMsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRXpILFNBQVM7UUFDVCxpQkFBUSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBQyxDQUFDLEdBQUMsV0FBVyxFQUFFLENBQUMsR0FBQyxDQUFDLEdBQUMsV0FBVyxFQUFFLENBQUMsR0FBQyxFQUFFLEdBQUMsV0FBVyxFQUFFLENBQUMsR0FBQyxFQUFFLEdBQUMsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRTlILENBQUM7Q0FDSjtBQUVELGlCQUFTLE9BQU8sQ0FBQzs7Ozs7Ozs7Ozs7Ozs7O0FDNUNqQiw0RkFBMkI7QUFFM0IsK0ZBQTRDO0FBRTVDLE1BQWUsUUFBUTtJQVluQixZQUFZLENBQUMsR0FBVztRQUNwQixJQUFHLElBQUksQ0FBQyxPQUFPLEtBQUssU0FBUyxFQUFFO1lBQzNCLHdMQUF3TDtZQUN4TCxLQUFJLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7Z0JBQ3pCLElBQUcsQ0FBQyxDQUFDLFdBQVcsRUFBRTtvQkFDZCxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7aUJBQ2pCO2FBQ0o7WUFBQSxDQUFDO1NBQ0w7UUFDRCxJQUFHLElBQUksQ0FBQyxPQUFPLEtBQUssU0FBUyxFQUFFO1lBQzNCLGtFQUFrRTtZQUNsRSxLQUFJLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7Z0JBQ3pCLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxjQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ3BDLElBQUcsY0FBSSxDQUFDLE1BQU0sR0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLGNBQUksQ0FBQyxNQUFNLEdBQUMsQ0FBQyxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLGNBQUksQ0FBQyxNQUFNLEdBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxjQUFJLENBQUMsTUFBTSxHQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQy9FLENBQUMsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO2FBQzVCO1NBQ0o7UUFDRCxJQUFHLElBQUksQ0FBQyxVQUFVLEtBQUssU0FBUyxFQUFFO1lBQzlCLHNFQUFzRTtZQUN0RSxLQUFJLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7Z0JBQzVCLElBQUcsQ0FBQyxDQUFDLFdBQVcsRUFBRTtvQkFDZCxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7aUJBQ2pCO3FCQUNJLElBQUcsQ0FBQyxDQUFDLFNBQVMsRUFBRTtvQkFDakIsQ0FBQyxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7b0JBQ3BCLGNBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUM7b0JBQ3JDLGNBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7b0JBQ3hDLENBQUMsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO29CQUNkLENBQUMsQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO29CQUNuQixDQUFDLENBQUMsS0FBSyxHQUFHLGlCQUFRLENBQUMsaUJBQWlCLENBQUM7aUJBQ3hDO2FBQ0o7U0FDSjtJQUNMLENBQUM7SUFFRCxhQUFhO1FBQ1QsSUFBRyxJQUFJLENBQUMsT0FBTyxLQUFLLFNBQVMsRUFBRTtZQUMzQixrRUFBa0U7WUFDbEUsS0FBSSxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO2dCQUN6QixDQUFDLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQzthQUN6QjtTQUNKO0lBQ0wsQ0FBQztDQUVKO0FBRUQsaUJBQVMsUUFBUTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNuRWpCLDJHQUFtQztBQUVuQyx3R0FBaUM7QUFDakMsK0ZBQThCO0FBQzlCLHFHQUErQjtBQUUvQiwwR0FBNEM7QUFDNUMsMkdBQW1DO0FBR25DLE1BQWEsWUFBYSxTQUFRLGtCQUFRO0lBRXRDLFlBQVksSUFBa0I7UUFDMUIsS0FBSyxFQUFFLENBQUM7UUFDUixnR0FBZ0c7UUFDaEcsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLGlCQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFckMsMkNBQTJDO1FBQzNDLElBQUksQ0FBQyxPQUFPLEdBQUc7WUFDWCxJQUFJLGdCQUFNLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSw2QkFBNkIsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO2dCQUNyRSxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO2dCQUM1QixjQUFJLENBQUMsU0FBUyxHQUFHLElBQUkseUJBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMzQyxDQUFDLENBQUM7U0FDTCxDQUFDO1FBRUYsSUFBSSxDQUFDLFVBQVUsR0FBRztRQUNkLDZEQUE2RDtRQUM3RCw0REFBNEQ7UUFDNUQsdURBQXVEO1FBQ3ZELHVEQUF1RDtTQUMxRDtRQUVELElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNWLEtBQUksSUFBSSxPQUFPLElBQUksY0FBSSxDQUFDLFFBQVEsRUFBRTtZQUM5QixDQUFDLEVBQUUsQ0FBQztZQUNKLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksa0JBQVEsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDbkg7UUFDRCxtRUFBbUU7UUFDbkUsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3hCLENBQUM7SUFFRCxNQUFNLENBQUMsTUFBVSxFQUFFLFdBQW1CO1FBRWxDLCtCQUErQjtRQUMvQixJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFFdkMsc0RBQXNEO1FBQ3RELElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQzFCLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ3ZDLENBQUMsQ0FBQyxDQUFDO1FBRUgseURBQXlEO1FBQ3pELElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQy9CLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ3pDLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELFlBQVk7UUFDUixnQ0FBZ0M7UUFDaEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsY0FBSSxDQUFDLEtBQUssR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxjQUFJLENBQUMsV0FBVyxDQUFDLGdEQUErQztRQUMxRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxjQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsY0FBSSxDQUFDLFdBQVcsQ0FBQztRQUN2RCxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsY0FBSSxDQUFDLFdBQVcsQ0FBQztRQUN0QyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsY0FBSSxDQUFDLFdBQVcsQ0FBQztRQUVyQyxrQ0FBa0M7UUFDbEMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN4QixJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxjQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLGNBQUksQ0FBQyxXQUFXLENBQUM7WUFDaEUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsY0FBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxjQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsR0FBRyxjQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDO1lBQ2pILElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxjQUFJLENBQUMsV0FBVyxDQUFDO1lBQzNDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxjQUFJLENBQUMsV0FBVyxDQUFDO1lBQzFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLGNBQUksQ0FBQyxNQUFNLEVBQUUsY0FBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQzdEO1FBRUQsMkNBQTJDO1FBQzNDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDeEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsY0FBSSxDQUFDLEtBQUssR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxjQUFJLENBQUMsV0FBVyxDQUFDO1lBQ25FLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLGNBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsY0FBSSxDQUFDLFdBQVcsQ0FBQztZQUNuRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsY0FBSSxDQUFDLFdBQVcsQ0FBQztZQUM5QyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsY0FBSSxDQUFDLFdBQVcsQ0FBQztZQUM3QyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNuQztJQUNMLENBQUM7Q0FFSjtBQXpFRCxvQ0F5RUM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbkZELDJHQUFtQztBQUVuQyx3R0FBaUM7QUFDakMsK0ZBQThCO0FBQzlCLHFHQUErQjtBQUUvQiwwR0FBNEM7QUFFNUMsa0dBQStDO0FBQy9DLDRIQUF3RDtBQUV4RCxNQUFhLFFBQVMsU0FBUSxrQkFBUTtJQUVsQyxZQUFZLElBQWtCO1FBQzFCLEtBQUssRUFBRSxDQUFDO1FBRVIsZ0dBQWdHO1FBQ2hHLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxpQkFBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRXJDLHdDQUF3QztRQUN4QyxJQUFJLENBQUMsT0FBTyxHQUFHO1lBQ1gsSUFBSSxnQkFBTSxDQUFDLElBQUksRUFBRSxhQUFhLEVBQUUsa0NBQWtDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtnQkFDakYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFDM0IsY0FBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7WUFDL0IsQ0FBQyxDQUFDO1lBQ0YsSUFBSSxnQkFBTSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsa0RBQWtELEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtnQkFDOUYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDeEIsY0FBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLHFDQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2pELENBQUMsQ0FBQztZQUNGLElBQUksZ0JBQU0sQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFLGtEQUFrRCxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Z0JBQy9GLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBQ3pCLGNBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1lBQy9CLENBQUMsQ0FBQztZQUNGLElBQUksZ0JBQU0sQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLHdDQUF3QyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Z0JBQ25GLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQ3ZCLGNBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSx5QkFBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzNDLENBQUMsQ0FBQztTQUNMLENBQUM7UUFFRixtRUFBbUU7UUFDbkUsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3hCLENBQUM7SUFFRCxNQUFNLENBQUMsTUFBVSxFQUFFLFdBQW1CO1FBRWxDLHlEQUF5RDtRQUN6RCxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFFdkMsaUJBQVEsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFDLFdBQVcsR0FBQyxDQUFDLENBQUMsR0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBQyxXQUFXLEdBQUMsQ0FBQyxDQUFDLEdBQUMsV0FBVyxFQUFFLEdBQUcsR0FBQyxXQUFXLEVBQUUsRUFBRSxHQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRTdLLHNEQUFzRDtRQUN0RCxLQUFLLE1BQU0sSUFBSSxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDN0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDLENBQUM7U0FDcEM7SUFFTCxDQUFDO0lBRUQsWUFBWTtRQUNSLGdDQUFnQztRQUNoQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxjQUFJLENBQUMsS0FBSyxHQUFDLENBQUMsR0FBQyxHQUFHLEdBQUMsQ0FBQyxHQUFDLGNBQUksQ0FBQyxXQUFXLENBQUMsZ0RBQStDO1FBQ2xHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLGNBQUksQ0FBQyxNQUFNLEdBQUMsQ0FBQyxHQUFDLEVBQUUsR0FBQyxjQUFJLENBQUMsV0FBVyxDQUFDO1FBQ2pELElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBQyxjQUFJLENBQUMsV0FBVyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBQyxjQUFJLENBQUMsV0FBVyxDQUFDO1FBRW5DLHVDQUF1QztRQUN2QyxLQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3JCLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLGNBQUksQ0FBQyxLQUFLLEdBQUMsQ0FBQyxHQUFDLEdBQUcsR0FBQyxDQUFDLEdBQUMsY0FBSSxDQUFDLFdBQVcsQ0FBQztZQUN4RCxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxjQUFJLENBQUMsTUFBTSxHQUFDLENBQUMsR0FBQyxFQUFFLEdBQUMsQ0FBQyxHQUFDLGNBQUksQ0FBQyxXQUFXLENBQUM7WUFDeEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFDLGNBQUksQ0FBQyxXQUFXLENBQUM7WUFDekMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFDLGNBQUksQ0FBQyxXQUFXLENBQUM7WUFDeEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsY0FBSSxDQUFDLE1BQU0sRUFBRSxjQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDN0Q7SUFFTCxDQUFDO0NBRUo7QUFoRUQsNEJBZ0VDOzs7Ozs7Ozs7Ozs7Ozs7OztBQzNFRCwyR0FBbUM7QUFFbkMsd0dBQWlDO0FBQ2pDLCtGQUE4QjtBQUM5QixxR0FBK0I7QUFFL0IsaUdBQXNDO0FBQ3RDLDRIQUF3RDtBQUN4RCw2R0FBOEM7QUFFOUMsTUFBYSxXQUFZLFNBQVEsa0JBQVE7SUFFckMsWUFBWSxJQUFrQjtRQUMxQixLQUFLLEVBQUUsQ0FBQztRQUNSLGdHQUFnRztRQUNoRyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksaUJBQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNyQywyQ0FBMkM7UUFDM0MsSUFBSSxDQUFDLE9BQU8sR0FBRztZQUNYLElBQUksZ0JBQU0sQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsc0RBQXNELEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtnQkFDeEcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2dCQUM5QixjQUFJLENBQUMsU0FBUyxHQUFHLElBQUkscUNBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDakQsQ0FBQyxDQUFDO1lBQ0YsSUFBSSxnQkFBTSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsdUJBQXVCLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtnQkFDbkUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztnQkFDNUIsY0FBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLDJCQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDNUMsQ0FBQyxDQUFDO1lBQ0YsSUFBSSxnQkFBTSxDQUFDLElBQUksRUFBRSxnQkFBZ0IsRUFBRSx3Q0FBd0MsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO2dCQUMxRixPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUMxQixjQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztZQUMvQixDQUFDLENBQUM7WUFDRixJQUFJLGdCQUFNLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSwwQkFBMEIsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO2dCQUNsRSxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUN6QixjQUFJLENBQUMsU0FBUyxHQUFHLElBQUksbUJBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN4QyxDQUFDLENBQUM7U0FDTCxDQUFDO1FBQ0YsbUVBQW1FO1FBQ25FLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUN4QixDQUFDO0lBRUQsTUFBTSxDQUFDLE1BQVUsRUFBRSxXQUFtQjtRQUVsQyx5REFBeUQ7UUFDekQsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBRXZDLHNEQUFzRDtRQUN0RCxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUMxQixNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxXQUFXLENBQUMsQ0FBQztRQUN2QyxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxZQUFZO1FBQ1IsZ0NBQWdDO1FBQ2hDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLGNBQUksQ0FBQyxLQUFLLEdBQUMsQ0FBQyxHQUFDLEdBQUcsR0FBQyxDQUFDLEdBQUMsY0FBSSxDQUFDLFdBQVcsQ0FBQyxnREFBK0M7UUFDbEcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsY0FBSSxDQUFDLE1BQU0sR0FBQyxDQUFDLEdBQUMsRUFBRSxHQUFDLGNBQUksQ0FBQyxXQUFXLENBQUM7UUFDakQsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFDLGNBQUksQ0FBQyxXQUFXLENBQUM7UUFDcEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFDLGNBQUksQ0FBQyxXQUFXLENBQUM7UUFFbkMsdUNBQXVDO1FBQ3ZDLEtBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDckIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsY0FBSSxDQUFDLEtBQUssR0FBQyxDQUFDLEdBQUMsR0FBRyxHQUFDLENBQUMsR0FBQyxjQUFJLENBQUMsV0FBVyxDQUFDO1lBQ3hELElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLGNBQUksQ0FBQyxNQUFNLEdBQUMsQ0FBQyxHQUFDLEVBQUUsR0FBQyxDQUFDLEdBQUMsY0FBSSxDQUFDLFdBQVcsQ0FBQztZQUN4RCxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUMsY0FBSSxDQUFDLFdBQVcsQ0FBQztZQUN6QyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUMsY0FBSSxDQUFDLFdBQVcsQ0FBQztZQUN4QyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxjQUFJLENBQUMsTUFBTSxFQUFFLGNBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUM3RDtJQUNMLENBQUM7Q0FFSjtBQXpERCxrQ0F5REM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbkVELDJHQUFtQztBQUVuQyx3R0FBaUM7QUFDakMsK0ZBQThCO0FBQzlCLHFHQUErQjtBQUMvQiwwR0FBNEM7QUFFNUMsaUdBQXNDO0FBRXRDLE1BQWEsU0FBVSxTQUFRLGtCQUFRO0lBRW5DLFlBQVksSUFBa0I7UUFDMUIsS0FBSyxFQUFFLENBQUM7UUFFUixnR0FBZ0c7UUFDaEcsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLGlCQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFckMsd0NBQXdDO1FBQ3hDLElBQUksQ0FBQyxPQUFPLEdBQUc7WUFDWCxJQUFJLGdCQUFNLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRSxzQkFBc0IsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO2dCQUNyRSxjQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztZQUMvQixDQUFDLENBQUM7WUFDRixJQUFJLGdCQUFNLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSx3Q0FBd0MsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO2dCQUNuRixjQUFJLENBQUMsU0FBUyxHQUFHLElBQUkseUJBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMzQyxDQUFDLENBQUM7WUFDRixJQUFJLGdCQUFNLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRSxzQkFBc0IsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO2dCQUNwRSxjQUFJLENBQUMsU0FBUyxHQUFHLElBQUksbUJBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN4QyxDQUFDLENBQUM7U0FDTCxDQUFDO1FBRUYsbUVBQW1FO1FBQ25FLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUN4QixDQUFDO0lBR0QsTUFBTSxDQUFDLE1BQVUsRUFBRSxXQUFtQjtRQUVsQyx5REFBeUQ7UUFDekQsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBRXZDLHNEQUFzRDtRQUN0RCxLQUFLLE1BQU0sSUFBSSxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDN0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDLENBQUM7U0FDcEM7SUFFTCxDQUFDO0lBRUQsWUFBWTtRQUNSLGdDQUFnQztRQUNoQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxjQUFJLENBQUMsS0FBSyxHQUFDLENBQUMsR0FBQyxHQUFHLEdBQUMsQ0FBQyxHQUFDLGNBQUksQ0FBQyxXQUFXLENBQUMsZ0RBQStDO1FBQ2xHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLGNBQUksQ0FBQyxNQUFNLEdBQUMsQ0FBQyxHQUFDLEVBQUUsR0FBQyxjQUFJLENBQUMsV0FBVyxDQUFDO1FBQ2pELElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBQyxjQUFJLENBQUMsV0FBVyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBQyxjQUFJLENBQUMsV0FBVyxDQUFDO1FBRW5DLHVDQUF1QztRQUN2QyxLQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3JCLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLGNBQUksQ0FBQyxLQUFLLEdBQUMsQ0FBQyxHQUFDLEdBQUcsR0FBQyxDQUFDLEdBQUMsY0FBSSxDQUFDLFdBQVcsQ0FBQztZQUN4RCxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxjQUFJLENBQUMsTUFBTSxHQUFDLENBQUMsR0FBQyxFQUFFLEdBQUMsQ0FBQyxHQUFDLGNBQUksQ0FBQyxXQUFXLENBQUM7WUFDeEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFDLGNBQUksQ0FBQyxXQUFXLENBQUM7WUFDekMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFDLGNBQUksQ0FBQyxXQUFXLENBQUM7WUFDeEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsY0FBSSxDQUFDLE1BQU0sRUFBRSxjQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDN0Q7SUFFTCxDQUFDO0NBRUo7QUF4REQsOEJBd0RDOzs7Ozs7Ozs7Ozs7Ozs7OztBQ2pFRCwyR0FBbUM7QUFFbkMsd0dBQWlDO0FBQ2pDLCtGQUE4QjtBQUM5QixxR0FBK0I7QUFFL0IsMEdBQTRDO0FBRTVDLE1BQWEsaUJBQWtCLFNBQVEsa0JBQVE7SUFFM0MsWUFBWSxJQUFrQjtRQUMxQixLQUFLLEVBQUUsQ0FBQztRQUNSLGdHQUFnRztRQUNoRyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksaUJBQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUdyQyxJQUFHLGNBQUksQ0FBQyxNQUFNLEtBQUssU0FBUztZQUN4QixjQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUVwQixJQUFHLGNBQUksQ0FBQyxTQUFTLEtBQUssU0FBUztZQUMzQixjQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztRQUUxQixJQUFHLGNBQUksQ0FBQyxrQkFBa0IsS0FBSyxTQUFTO1lBQ3BDLGNBQUksQ0FBQyxrQkFBa0IsR0FBRyxDQUFDLENBQUM7UUFFaEMsSUFBSSxlQUFlLENBQUM7UUFFcEIsSUFBRyxjQUFJLENBQUMsTUFBTSxLQUFHLENBQUMsRUFBRTtZQUNoQixlQUFlLEdBQUcsZ0JBQWdCLENBQUM7U0FDdEM7YUFDSSxJQUFHLGNBQUksQ0FBQyxNQUFNLEtBQUcsQ0FBQyxFQUFFO1lBQ3JCLGVBQWUsR0FBRyxnQkFBZ0IsQ0FBQztTQUN0QzthQUNJO1lBQ0QsZUFBZSxHQUFHLGFBQWEsQ0FBQztTQUNuQztRQUVELElBQUksZ0JBQWdCLENBQUM7UUFFckIsSUFBRyxjQUFJLENBQUMsa0JBQWtCLEtBQUcsQ0FBQyxFQUFFO1lBQzVCLGdCQUFnQixHQUFHLFFBQVEsQ0FBQztTQUMvQjthQUNJLElBQUcsY0FBSSxDQUFDLGtCQUFrQixLQUFHLENBQUMsRUFBRTtZQUNqQyxnQkFBZ0IsR0FBRyxRQUFRLENBQUM7U0FDL0I7YUFDSTtZQUNELGdCQUFnQixHQUFHLFNBQVMsQ0FBQztTQUNoQztRQUdELDJDQUEyQztRQUMzQyxJQUFJLENBQUMsT0FBTyxHQUFHO1lBQ1gsSUFBSSxnQkFBTSxDQUFDLElBQUksRUFBRSxRQUFRLGVBQWUsRUFBRSxFQUFFLG1DQUFtQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Z0JBQzlGLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBQzFCLElBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUsscUJBQXFCLEVBQUM7b0JBQzdDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLHFCQUFxQixDQUFDO29CQUM1QyxjQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztvQkFDaEIsY0FBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7aUJBQ3pCO3FCQUNJLElBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUsscUJBQXFCLEVBQUU7b0JBQ25ELElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLGtCQUFrQixDQUFDO29CQUN6QyxjQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztpQkFDMUI7cUJBQ0k7b0JBQ0QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcscUJBQXFCLENBQUM7b0JBQzVDLGNBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO29CQUNoQixjQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztpQkFDekI7WUFDTCxDQUFDLENBQUM7WUFDRixJQUFJLGdCQUFNLENBQUMsSUFBSSxFQUFFLGNBQWMsZ0JBQWdCLEVBQUUsRUFBRSxnQ0FBZ0MsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO2dCQUNsRyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUN6QixJQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLG1CQUFtQixFQUFDO29CQUMzQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxtQkFBbUIsQ0FBQztvQkFDMUMsY0FBSSxDQUFDLGtCQUFrQixHQUFHLENBQUMsQ0FBQztpQkFDL0I7cUJBQ0ksSUFBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxtQkFBbUIsRUFBRTtvQkFDakQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsb0JBQW9CLENBQUM7b0JBQzNDLGNBQUksQ0FBQyxrQkFBa0IsR0FBRyxHQUFHLENBQUM7aUJBQ2pDO3FCQUNJO29CQUNELElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLG1CQUFtQixDQUFDO29CQUMxQyxjQUFJLENBQUMsa0JBQWtCLEdBQUcsQ0FBQyxDQUFDO2lCQUMvQjtZQUNMLENBQUMsQ0FBQztZQUNGLElBQUksZ0JBQU0sQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLDBCQUEwQixFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Z0JBQ2xFLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBQ3pCLGNBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSx5QkFBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzNDLENBQUMsQ0FBQztTQUNMLENBQUM7UUFDRixtRUFBbUU7UUFDbkUsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3hCLENBQUM7SUFFRCxNQUFNLENBQUMsTUFBVSxFQUFFLFdBQW1CO1FBRWxDLCtCQUErQjtRQUMvQixJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFFdkMsc0RBQXNEO1FBQ3RELElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQzFCLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ3ZDLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELFlBQVk7UUFDUixnQ0FBZ0M7UUFDaEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsY0FBSSxDQUFDLEtBQUssR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxjQUFJLENBQUMsV0FBVyxDQUFDLGdEQUErQztRQUMxRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxjQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsY0FBSSxDQUFDLFdBQVcsQ0FBQztRQUN2RCxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsY0FBSSxDQUFDLFdBQVcsQ0FBQztRQUN0QyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsY0FBSSxDQUFDLFdBQVcsQ0FBQztRQUVyQyx1Q0FBdUM7UUFDdkMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN4QixJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxjQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLGNBQUksQ0FBQyxXQUFXLENBQUM7WUFDaEUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsY0FBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxjQUFJLENBQUMsV0FBVyxDQUFDO1lBQ2hFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxjQUFJLENBQUMsV0FBVyxDQUFDO1lBQzNDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxjQUFJLENBQUMsV0FBVyxDQUFDO1lBQzFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLGNBQUksQ0FBQyxNQUFNLEVBQUUsY0FBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQzdEO0lBQ0wsQ0FBQztDQUVKO0FBakhELDhDQWlIQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN6SEQsMkdBQW1DO0FBRW5DLHdHQUFpQztBQUNqQywrRkFBOEI7QUFDOUIscUdBQStCO0FBRS9CLGlHQUFzQztBQUN0Qyx5SEFBc0Q7QUFFdEQsTUFBYSxpQkFBa0IsU0FBUSxrQkFBUTtJQUUzQyxZQUFZLElBQWtCO1FBQzFCLEtBQUssRUFBRSxDQUFDO1FBQ1IsZ0dBQWdHO1FBQ2hHLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxpQkFBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3JDLDJDQUEyQztRQUMzQyxJQUFJLGNBQUksQ0FBQyxnQkFBZ0IsS0FBSyxTQUFTO1lBQ25DLGNBQUksQ0FBQyxnQkFBZ0IsR0FBRyxRQUFRLENBQUM7UUFFckMsSUFBSSxDQUFDLE9BQU8sR0FBRztZQUNYLElBQUksZ0JBQU0sQ0FBQyxJQUFJLEVBQUUsc0JBQXNCLGNBQUksQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFLHFDQUFxQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Z0JBQ3BILElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssMkJBQTJCLEVBQUU7b0JBQ3JELGNBQUksQ0FBQyxnQkFBZ0IsR0FBRyxVQUFVLENBQUM7b0JBQ25DLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLDZCQUE2QixDQUFDO2lCQUN2RDtxQkFDSSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLDZCQUE2QixFQUFFO29CQUM1RCxjQUFJLENBQUMsZ0JBQWdCLEdBQUcsU0FBUyxDQUFDO29CQUNsQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyw0QkFBNEIsQ0FBQztpQkFDdEQ7cUJBQ0k7b0JBQ0QsY0FBSSxDQUFDLGdCQUFnQixHQUFHLFFBQVEsQ0FBQztvQkFDakMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsMkJBQTJCLENBQUM7aUJBQ3JEO1lBQ0wsQ0FBQyxDQUFDO1lBQ0YsSUFBSSxnQkFBTSxDQUFDLElBQUksRUFBRSxlQUFlLEVBQUUsNENBQTRDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtnQkFDN0YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFDMUIsY0FBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLG1DQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2hELENBQUMsQ0FBQztZQUNGLElBQUksZ0JBQU0sQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLDBCQUEwQixFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Z0JBQ2xFLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBQ3pCLGNBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxtQkFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3hDLENBQUMsQ0FBQztTQUNMLENBQUM7UUFDRixtRUFBbUU7UUFDbkUsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3hCLENBQUM7SUFFRCxNQUFNLENBQUMsTUFBVSxFQUFFLFdBQW1CO1FBRWxDLHlEQUF5RDtRQUN6RCxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFFdkMsc0RBQXNEO1FBQ3RELElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQzFCLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ3ZDLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELFlBQVk7UUFDUixnQ0FBZ0M7UUFDaEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsY0FBSSxDQUFDLEtBQUssR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxjQUFJLENBQUMsV0FBVyxDQUFDLGdEQUErQztRQUMxRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxjQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsY0FBSSxDQUFDLFdBQVcsQ0FBQztRQUN2RCxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsY0FBSSxDQUFDLFdBQVcsQ0FBQztRQUN0QyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsY0FBSSxDQUFDLFdBQVcsQ0FBQztRQUVyQyx1Q0FBdUM7UUFDdkMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN4QixJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxjQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLGNBQUksQ0FBQyxXQUFXLENBQUM7WUFDaEUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsY0FBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxjQUFJLENBQUMsV0FBVyxDQUFDO1lBQ2hFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxjQUFJLENBQUMsV0FBVyxDQUFDO1lBQzNDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxjQUFJLENBQUMsV0FBVyxDQUFDO1lBQzFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLGNBQUksQ0FBQyxNQUFNLEVBQUUsY0FBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQzdEO0lBQ0wsQ0FBQztDQUVKO0FBbEVELDhDQWtFQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMzRUQsMkdBQW1DO0FBRW5DLHdHQUFpQztBQUNqQywrRkFBOEI7QUFDOUIscUdBQStCO0FBRS9CLDRIQUF3RDtBQUN4RCxxR0FBK0I7QUFFL0IsTUFBYSxnQkFBaUIsU0FBUSxrQkFBUTtJQUUxQyxZQUFZLElBQWtCO1FBQzFCLEtBQUssRUFBRSxDQUFDO1FBQ1IsZ0dBQWdHO1FBQ2hHLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxpQkFBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3JDLDJDQUEyQztRQUMzQyxJQUFHLGNBQUksQ0FBQyxjQUFjLEtBQUssU0FBUztZQUNoQyxjQUFJLENBQUMsY0FBYyxHQUFHLENBQUMsQ0FBQztRQUc1QixJQUFJLHNCQUFzQixDQUFDO1FBRTNCLElBQUcsY0FBSSxDQUFDLGNBQWMsS0FBRyxDQUFDLEVBQUU7WUFDeEIsc0JBQXNCLEdBQUcsUUFBUSxDQUFDO1NBQ3JDO2FBQ0ksSUFBRyxjQUFJLENBQUMsY0FBYyxLQUFHLENBQUMsRUFBRTtZQUM3QixzQkFBc0IsR0FBRyxXQUFXLENBQUM7U0FDeEM7YUFDSTtZQUNELHNCQUFzQixHQUFHLFdBQVcsQ0FBQztTQUN4QztRQUNELElBQUksQ0FBQyxPQUFPLEdBQUc7WUFDWCxJQUFJLGdCQUFNLENBQUMsSUFBSSxFQUFFLG9CQUFvQixzQkFBc0IsRUFBRSxFQUFFLDRDQUE0QyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Z0JBQzFILElBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUsseUJBQXlCLEVBQUM7b0JBQ2pELElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLDRCQUE0QixDQUFDO29CQUNuRCxjQUFJLENBQUMsY0FBYyxHQUFHLENBQUMsQ0FBQztpQkFDM0I7cUJBQ0ksSUFBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyw0QkFBNEIsRUFBRTtvQkFDMUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsNEJBQTRCLENBQUM7b0JBQ25ELGNBQUksQ0FBQyxjQUFjLEdBQUcsQ0FBQyxDQUFDO2lCQUMzQjtxQkFDSTtvQkFDRCxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyx5QkFBeUIsQ0FBQztvQkFDaEQsY0FBSSxDQUFDLGNBQWMsR0FBRyxDQUFDLENBQUM7aUJBQzNCO1lBQ0wsQ0FBQyxDQUFDO1lBQ0YsSUFBSSxnQkFBTSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsMEJBQTBCLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtnQkFDbEUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFDekIsY0FBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLHFDQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2pELENBQUMsQ0FBQztTQUNMLENBQUM7UUFDRixJQUFJLENBQUMsT0FBTyxHQUFHO1lBQ1gsSUFBSSxnQkFBTSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Z0JBQzFELGNBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7WUFDNUMsQ0FBQyxDQUFDO1lBQ0YsSUFBSSxnQkFBTSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Z0JBQ3pELGNBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7WUFDN0MsQ0FBQyxDQUFDO1NBQ0wsQ0FBQztRQUNGLG1FQUFtRTtRQUNuRSxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDeEIsQ0FBQztJQUVELE1BQU0sQ0FBQyxNQUFVLEVBQUUsV0FBbUI7UUFFbEMseURBQXlEO1FBQ3pELElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxXQUFXLENBQUMsQ0FBQztRQUV2QyxzREFBc0Q7UUFDdEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDMUIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFDLENBQUM7UUFFSCxzREFBc0Q7UUFDdEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDMUIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsWUFBWTtRQUNSLGdDQUFnQztRQUNoQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxjQUFJLENBQUMsS0FBSyxHQUFDLENBQUMsR0FBQyxHQUFHLEdBQUMsQ0FBQyxHQUFDLGNBQUksQ0FBQyxXQUFXLENBQUMsZ0RBQStDO1FBQ2xHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLGNBQUksQ0FBQyxNQUFNLEdBQUMsQ0FBQyxHQUFDLEVBQUUsR0FBQyxjQUFJLENBQUMsV0FBVyxDQUFDO1FBQ2pELElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBQyxjQUFJLENBQUMsV0FBVyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBQyxjQUFJLENBQUMsV0FBVyxDQUFDO1FBRW5DLHVDQUF1QztRQUN2QyxLQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3JCLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLGNBQUksQ0FBQyxLQUFLLEdBQUMsQ0FBQyxHQUFDLEdBQUcsR0FBQyxDQUFDLEdBQUMsY0FBSSxDQUFDLFdBQVcsQ0FBQztZQUN4RCxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxjQUFJLENBQUMsTUFBTSxHQUFDLENBQUMsR0FBQyxFQUFFLEdBQUMsQ0FBQyxHQUFDLGNBQUksQ0FBQyxXQUFXLENBQUM7WUFDeEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFDLGNBQUksQ0FBQyxXQUFXLENBQUM7WUFDekMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFDLGNBQUksQ0FBQyxXQUFXLENBQUM7WUFDeEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsY0FBSSxDQUFDLE1BQU0sRUFBRSxjQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDN0Q7UUFFRCx1Q0FBdUM7UUFDdkMsS0FBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNyQixJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxjQUFJLENBQUMsS0FBSyxHQUFDLENBQUMsR0FBQyxHQUFHLEdBQUMsQ0FBQyxHQUFDLGNBQUksQ0FBQyxXQUFXLENBQUM7WUFDeEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsY0FBSSxDQUFDLE1BQU0sR0FBQyxDQUFDLEdBQUMsRUFBRSxHQUFDLGNBQUksQ0FBQyxXQUFXLEdBQUMsRUFBRSxHQUFDLENBQUMsR0FBQyxjQUFJLENBQUMsV0FBVyxDQUFDO1lBQzVFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBQyxjQUFJLENBQUMsV0FBVyxDQUFDO1lBQ3pDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBQyxjQUFJLENBQUMsV0FBVyxDQUFDO1lBQ3hDLElBQUcsY0FBSSxDQUFDLGNBQWM7Z0JBQ2xCLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsY0FBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ3pEO0lBQ0wsQ0FBQztDQUVKO0FBakdELDRDQWlHQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN6R0QsMkdBQW1DO0FBQ25DLG9JQUFnRTtBQUNoRSwrSUFBd0Q7QUFFeEQsTUFBYSxVQUFVO0lBTW5CLFlBQVksSUFBVTtRQUNsQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUk7UUFFaEIsYUFBYTtRQUNiLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBRSxjQUFjLEVBQUUsS0FBSyxFQUFHLEVBQUU7WUFDeEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsY0FBYyxFQUFFLENBQUMsQ0FBQztZQUNuRCxJQUFJLENBQUMsY0FBYyxHQUFHLGNBQWMsQ0FBQztZQUNyQyxJQUFJLEtBQUssRUFBRTtnQkFDUCxNQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQzNDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQTBCLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQzthQUNsRTtRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsd0JBQXdCO1FBQ3hCO1lBQ0ksOENBQThDO1lBQzlDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FDbkIsV0FBVyxFQUFDLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsRUFBRTtnQkFDakUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUM7Z0JBQ3JCLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksZUFBSyxDQUN2QixLQUFLLEVBQ0wsTUFBTSxFQUNOLEtBQUssQ0FDUixDQUFDO2dCQUNGLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLHFCQUFXLENBQUMsTUFBTSxDQUFDO2dCQUNoRCxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7b0JBQ3hCLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSw2QkFBYSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDakYsQ0FBQyxDQUFDO1lBQ04sQ0FBQyxDQUNKLENBQUM7U0FDTDtRQUVELGVBQWU7UUFDZjtZQUNJLDRDQUE0QztZQUM1QyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQ25CLGFBQWEsRUFDYixDQUFDLFlBQW1ELEVBQUUsRUFBRTtnQkFDcEQsMEJBQTBCO2dCQUMxQixJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxLQUFLLFNBQVM7b0JBQUUsT0FBTztnQkFFMUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO29CQUMxQixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUN6RCxDQUFDLENBQUMsQ0FBQztZQUNQLENBQUMsQ0FDSixDQUFDO1NBQ0w7UUFFRCxnQkFBZ0I7UUFDaEI7WUFDSSxvQkFBb0I7WUFDcEIsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFO2dCQUN0RCwwQkFBMEI7Z0JBQzFCLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEtBQUssU0FBUztvQkFBRSxPQUFPO2dCQUUxQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDN0IsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQzdCLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO2dCQUNuQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztZQUN2QyxDQUFDLENBQUMsQ0FBQztZQUVILElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxVQUFVLEVBQUUsRUFBRTtnQkFDbkQsMEJBQTBCO2dCQUMxQixJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxLQUFLLFNBQVM7b0JBQUUsT0FBTztnQkFFMUMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUM7Z0JBQ3RELElBQUksTUFBTSxLQUFLLFNBQVM7b0JBQUUsT0FBTztnQkFFakMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUM7WUFDakMsQ0FBQyxDQUFDO1lBRUYsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLGNBQWMsRUFBRSxDQUFDLFVBQVUsRUFBRSxFQUFFO2dCQUNuRCwwQkFBMEI7Z0JBQzFCLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEtBQUssU0FBUztvQkFBRSxPQUFPO2dCQUUxQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksNkJBQWEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDN0YsQ0FBQyxDQUFDO1lBRUYsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLGNBQWMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO2dCQUMzQywwQkFBMEI7Z0JBQzFCLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEtBQUssU0FBUztvQkFBRSxPQUFPO2dCQUUxQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUM7WUFDdkMsQ0FBQyxDQUFDO1lBRUYsd0NBQXdDO1lBQ3hDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FDbkIsZ0JBQWdCLEVBQ2hCLENBQUMsUUFJQSxFQUFFLEVBQUU7Z0JBQ0QsMEJBQTBCO2dCQUMxQixJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxLQUFLLFNBQVM7b0JBQUUsT0FBTztnQkFFMUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQztZQUMzQyxDQUFDLENBQ0osQ0FBQztTQUNMO0lBQ0wsQ0FBQztDQUVKO0FBNUdELGdDQTRHQzs7Ozs7Ozs7Ozs7Ozs7O0FDakhELDRGQUEyQjtBQUUzQix5SkFBOEQ7QUFDOUQsc0pBQTREO0FBTTVELCtKQUEwRTtBQUUxRSxrR0FBZ0Q7QUFDaEQsNkVBQTZDO0FBRTdDLE1BQU0sS0FBSztJQWVQLFlBQ0ksS0FBYSxFQUNiLE1BQWMsRUFDZCxLQUFtQjtRQVB2QixhQUFRLEdBQW1DLEVBQUUsQ0FBQztRQVMxQyxxRUFBcUU7UUFDckUsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7UUFFeEIsSUFBSSxDQUFDLHFCQUFxQixHQUFHLElBQUksOENBQXFCLEVBQUUsQ0FBQztRQUN6RCxJQUFJLENBQUMscUJBQXFCLENBQUMsbUJBQW1CLENBQUMsR0FBRyxDQUM5QyxDQUFDLElBQUksR0FBRyxjQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FDOUMsQ0FBQztRQUVGLGdQQUFnUDtRQUNoUCxJQUFJLENBQUMsU0FBUyxHQUFHLGNBQUksQ0FBQyxjQUFjLENBQ2hDLElBQUksQ0FBQyxLQUFLLEdBQUcsY0FBSSxDQUFDLFVBQVUsRUFDNUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxjQUFJLENBQUMsV0FBVyxDQUNqQyxDQUFDO1FBRUYsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFFRCxJQUFJLENBQUMsSUFBVTtRQUNYLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxTQUFTO1lBQ3pCLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzNFLENBQUM7SUFFRCxNQUFNLENBQUMsTUFBWSxFQUFFLFdBQW1CO1FBQ3BDLHVDQUF1QztRQUN2QyxNQUFNLENBQUMsS0FBSyxDQUNSLElBQUksQ0FBQyxTQUFTLEVBQ2QsQ0FBQyxFQUNELENBQUMsRUFDRCxDQUFDLGNBQUksQ0FBQyxLQUFLLEdBQUMsV0FBVyxDQUFDLEdBQUMsV0FBVyxFQUNwQyxDQUFDLGNBQUksQ0FBQyxNQUFNLEdBQUMsV0FBVyxDQUFDLEdBQUMsV0FBVyxFQUNyQyxDQUFDLGNBQUksQ0FBQyxnQkFBZ0IsR0FBRyxjQUFJLENBQUMsVUFBVSxDQUFDLEVBQ3pDLENBQUMsY0FBSSxDQUFDLGdCQUFnQixHQUFHLGNBQUksQ0FBQyxVQUFVLENBQUMsRUFDekMsQ0FBQyxjQUFJLENBQUMsS0FBSyxHQUFHLFdBQVcsQ0FBQyxFQUMxQixDQUFDLGNBQUksQ0FBQyxNQUFNLEdBQUcsV0FBVyxDQUFDLENBQzlCLENBQUM7UUFFRixJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxXQUFXLENBQUMsQ0FBQztRQUV4QyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pCLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkIsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2hCLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVqRSxNQUFNLENBQUMsS0FBSyxDQUNSLElBQUksQ0FBQyxTQUFTLEVBQ2QsTUFBTSxDQUFDLEtBQUssR0FBQyxJQUFJLENBQUMsS0FBSyxFQUN2QixDQUFDLEVBQ0QsSUFBSSxDQUFDLEtBQUssRUFDVixJQUFJLENBQUMsTUFBTSxDQUNkLENBQUM7SUFDTixDQUFDO0lBRUQsYUFBYSxDQUFDLFFBQWtCO1FBQzVCLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFFRCxVQUFVLENBQUMsU0FBaUIsRUFBRSxJQUFjO1FBQ3hDLCtDQUErQztRQUMvQyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUVsQyw2RkFBNkY7UUFDN0YsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUN2QixJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzFCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUNmLENBQUMsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLGNBQUksQ0FBQyxVQUFVLEVBQ2hELElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxjQUFJLENBQUMsV0FBVyxFQUNyRCxjQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsRUFDbkIsY0FBSSxDQUFDLFdBQVcsQ0FDbkIsQ0FBQztRQUNGLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUNmLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxjQUFJLENBQUMsVUFBVSxFQUMxQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxjQUFJLENBQUMsV0FBVyxFQUMzRCxjQUFJLENBQUMsVUFBVSxFQUNmLGNBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUN2QixDQUFDO1FBQ0YsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUV6QiwrQkFBK0I7UUFDL0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN6QixJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDN0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFFRCxhQUFhLENBQUMsTUFBWSxFQUFFLFdBQW1CO1FBQzNDLDhEQUE4RDtRQUM5RCxNQUFNLGNBQWMsR0FBK0MsRUFBRSxDQUFDO1FBQ3RFLElBQUk7WUFDQSxNQUFNLGtCQUFrQixHQUNwQixJQUFJLENBQUMscUJBQXFCLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDeEQsSUFBSSxDQUFDLGtCQUFrQjtnQkFBRSxPQUFPO1lBRWhDLE1BQU0sS0FBSyxHQUFHLGtCQUFrQixDQUFDLEtBQUssQ0FBQztZQUN2QyxJQUFJLENBQUMsS0FBSztnQkFBRSxPQUFPO1lBRW5CLDBDQUEwQztZQUMxQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBcUMsRUFBRSxFQUFFO2dCQUM5RCxjQUFjLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDbEMsQ0FBQyxDQUFDLENBQUM7U0FDTjtRQUFDLE9BQU8sQ0FBQyxFQUFFLEdBQUU7UUFFZCw2Q0FBNkM7UUFDN0MsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUNqQyxDQUFDLE1BQThCLEVBQUUsRUFBRTtZQUMvQixNQUFNLGVBQWUsR0FBRyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEQsSUFBSSxlQUFlLEtBQUssU0FBUyxFQUFFO2dCQUMvQixNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLGVBQWUsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQzthQUNuQztZQUVELE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQzFDLENBQUMsQ0FDSixDQUFDO1FBRUYsc0NBQXNDO1FBQ3RDLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxTQUFTLEVBQUU7WUFDM0IsSUFBSSxDQUFDLE1BQU0sQ0FBQywyQkFBMkIsRUFBRSxDQUFDO1lBQzFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxXQUFXLENBQUMsQ0FBQztTQUMzQztJQUNMLENBQUM7SUFFRCxTQUFTO1FBQ0wsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDbEMsZ0RBQWdEO1lBQ2hELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNqQyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUVwRCxJQUFJLE9BQU8sT0FBTyxLQUFLLFFBQVEsRUFBRTtvQkFDN0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDckIsU0FBUztpQkFDWjtnQkFFRCxJQUFJLE9BQU8sS0FBSyxlQUFRLENBQUMsR0FBRyxJQUFJLE9BQU8sS0FBSyxlQUFRLENBQUMsVUFBVSxFQUFFO29CQUM3RCw0REFBNEQ7b0JBQzVELE1BQU0sSUFBSSxHQUFTLHVCQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBRXZDLElBQ0ksSUFBSSxDQUFDLFNBQVM7d0JBQ2QsSUFBSSxDQUFDLE9BQU8sWUFBWSxzQkFBWSxFQUN0Qzt3QkFDRSwwQ0FBMEM7d0JBQzFDLE1BQU0sV0FBVyxHQUNiLENBQUMsS0FBSyxlQUFRLENBQUMsR0FBRzs0QkFDbEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztnQ0FDckMsZUFBUSxDQUFDLEdBQUcsQ0FBQzt3QkFDckIsTUFBTSxZQUFZLEdBQ2QsQ0FBQyxLQUFLLGVBQVEsQ0FBQyxHQUFHOzRCQUNsQixJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7Z0NBQ25DLGVBQVEsQ0FBQyxHQUFHLENBQUM7d0JBQ3JCLE1BQU0sY0FBYyxHQUNoQixDQUFDLEtBQUssSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDOzRCQUNyQixJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO2dDQUNyQyxlQUFRLENBQUMsR0FBRyxDQUFDO3dCQUNyQixNQUFNLGFBQWEsR0FDZixDQUFDLEtBQUssSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDOzRCQUNwQixJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7Z0NBQ25DLGVBQVEsQ0FBQyxHQUFHLENBQUM7d0JBRXJCLDJDQUEyQzt3QkFDM0MsTUFBTSxZQUFZLEdBQ2QsQ0FBQyxHQUFHLENBQUMsV0FBVzs0QkFDaEIsQ0FBQyxHQUFHLENBQUMsYUFBYTs0QkFDbEIsQ0FBQyxHQUFHLENBQUMsY0FBYzs0QkFDbkIsQ0FBQyxZQUFZLENBQUM7d0JBRWxCLHlCQUF5Qjt3QkFDekIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQ25CLFlBQVksRUFDWixJQUFJLENBQUMsU0FBUyxFQUNkLENBQUMsR0FBRyxjQUFJLENBQUMsVUFBVSxFQUNuQixDQUFDLEdBQUcsY0FBSSxDQUFDLFdBQVcsRUFDcEIsY0FBSSxDQUFDLFVBQVUsRUFDZixjQUFJLENBQUMsV0FBVyxDQUNuQixDQUFDO3FCQUNMO3lCQUFNLElBQ0gsQ0FBQyxJQUFJLENBQUMsU0FBUzt3QkFDZixJQUFJLENBQUMsT0FBTyxZQUFZLHVCQUFhLEVBQ3ZDO3dCQUNFLDZCQUE2Qjt3QkFDN0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQ2YsSUFBSSxDQUFDLFNBQVMsRUFDZCxDQUFDLEdBQUcsY0FBSSxDQUFDLFVBQVUsRUFDbkIsQ0FBQyxHQUFHLGNBQUksQ0FBQyxXQUFXLEVBQ3BCLGNBQUksQ0FBQyxVQUFVLEVBQ2YsY0FBSSxDQUFDLFdBQVcsQ0FDbkIsQ0FBQztxQkFDTDtpQkFDSjthQUNKO1NBQ0o7SUFDTCxDQUFDO0lBRUQsUUFBUSxDQUFDLFNBQWlCO1FBQ3RCLE1BQU0sQ0FBQyxHQUFHLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ2pDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUU3QyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLEtBQUssZUFBUSxDQUFDLEdBQUcsRUFBRTtZQUM3Qyw0REFBNEQ7WUFFNUQsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUM7WUFFMUMsSUFBRyxPQUFPLE9BQU8sS0FBSyxRQUFRLEVBQUU7Z0JBQzVCLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEdBQUcsT0FBTyxDQUFDO2dCQUN4QyxPQUFPO2FBQ1Y7WUFFRCxNQUFNLElBQUksR0FBUyx1QkFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRXZDLDZCQUE2QjtZQUM3QixJQUFJLElBQUksS0FBSyxTQUFTLEVBQUU7Z0JBQ3BCLE9BQU87YUFDVjtZQUVELElBQUksSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsT0FBTyxZQUFZLHNCQUFZLEVBQUU7Z0JBQ3hELCtCQUErQjtnQkFDL0IsTUFBTSxXQUFXLEdBQ2IsQ0FBQyxJQUFJLENBQUM7b0JBQ04sSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLGVBQVEsQ0FBQyxHQUFHLENBQUM7Z0JBQzdELE1BQU0sWUFBWSxHQUNkLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLEtBQUssZUFBUSxDQUFDLEdBQUcsQ0FBQztnQkFDOUQsTUFBTSxjQUFjLEdBQ2hCLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUM7b0JBQ3BCLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxlQUFRLENBQUMsR0FBRyxDQUFDO2dCQUM3RCxNQUFNLGFBQWEsR0FDZixDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDO29CQUNuQixJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsS0FBSyxlQUFRLENBQUMsR0FBRyxDQUFDO2dCQUVwRCwyQ0FBMkM7Z0JBQzNDLE1BQU0sWUFBWSxHQUNkLENBQUMsR0FBRyxDQUFDLFdBQVc7b0JBQ2hCLENBQUMsR0FBRyxDQUFDLGFBQWE7b0JBQ2xCLENBQUMsR0FBRyxDQUFDLGNBQWM7b0JBQ25CLENBQUMsWUFBWSxDQUFDO2dCQUVsQix5QkFBeUI7Z0JBQ3pCLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUNuQixZQUFZLEVBQ1osSUFBSSxDQUFDLFNBQVMsRUFDZCxDQUFDLEdBQUcsY0FBSSxDQUFDLFVBQVUsRUFDbkIsQ0FBQyxHQUFHLGNBQUksQ0FBQyxXQUFXLEVBQ3BCLGNBQUksQ0FBQyxVQUFVLEVBQ2YsY0FBSSxDQUFDLFdBQVcsQ0FDbkIsQ0FBQzthQUNMO2lCQUFNLElBQ0gsQ0FBQyxJQUFJLENBQUMsU0FBUztnQkFDZixJQUFJLENBQUMsT0FBTyxZQUFZLHVCQUFhLEVBQ3ZDO2dCQUNFLDZCQUE2QjtnQkFDN0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQ2YsSUFBSSxDQUFDLFNBQVMsRUFDZCxDQUFDLEdBQUcsY0FBSSxDQUFDLFVBQVUsRUFDbkIsQ0FBQyxHQUFHLGNBQUksQ0FBQyxXQUFXLEVBQ3BCLGNBQUksQ0FBQyxVQUFVLEVBQ2YsY0FBSSxDQUFDLFdBQVcsQ0FDbkIsQ0FBQzthQUNMO1NBQ0o7SUFDTCxDQUFDO0NBQ0o7QUFDRCxpQkFBUyxLQUFLLENBQUM7Ozs7Ozs7Ozs7Ozs7O0FDdlNmLCtGQUErQztBQUUvQyw2RUFBNkM7QUFZaEMsa0JBQVUsR0FBdUM7SUFDMUQsQ0FBQyxlQUFRLENBQUMsR0FBRyxDQUFDLEVBQUUsU0FBUztJQUN6QixDQUFDLGVBQVEsQ0FBQyxVQUFVLENBQUMsRUFBRTtRQUNuQixJQUFJLEVBQUUsWUFBWTtRQUNsQixPQUFPLEVBQUUsU0FBUztRQUNsQixLQUFLLEVBQUUsU0FBUztRQUNoQixRQUFRLEVBQUUsQ0FBQztRQUNYLFlBQVksRUFBRSxDQUFDO0tBQ2xCO0lBQ0QsQ0FBQyxlQUFRLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDYixJQUFJLEVBQUUsTUFBTTtRQUNaLE9BQU8sRUFBRSxvQkFBVyxDQUFDLFlBQVksQ0FBQyxZQUFZO1FBQzlDLFNBQVMsRUFBRSxJQUFJO1FBQ2YsYUFBYSxFQUFFLElBQUk7UUFDbkIsS0FBSyxFQUFFLFNBQVM7UUFDaEIsUUFBUSxFQUFFLENBQUM7UUFDWCxZQUFZLEVBQUUsRUFBRTtLQUNuQjtJQUNELENBQUMsZUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQ1osSUFBSSxFQUFFLEtBQUs7UUFDWCxPQUFPLEVBQUUsb0JBQVcsQ0FBQyxZQUFZLENBQUMsV0FBVztRQUM3QyxTQUFTLEVBQUUsSUFBSTtRQUNmLGFBQWEsRUFBRSxJQUFJO1FBQ25CLEtBQUssRUFBRSxTQUFTO1FBQ2hCLFFBQVEsRUFBRSxHQUFHO1FBQ2IsWUFBWSxFQUFFLEdBQUc7S0FDcEI7SUFDRCxDQUFDLGVBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUNiLElBQUksRUFBRSxNQUFNO1FBQ1osT0FBTyxFQUFFLG9CQUFXLENBQUMsWUFBWSxDQUFDLFlBQVk7UUFDOUMsU0FBUyxFQUFFLElBQUk7UUFDZixhQUFhLEVBQUUsSUFBSTtRQUNuQixLQUFLLEVBQUUsU0FBUztRQUNoQixRQUFRLEVBQUUsQ0FBQztRQUNYLFlBQVksRUFBRSxDQUFDO0tBQ2xCO0lBQ0QsQ0FBQyxlQUFRLENBQUMsTUFBTSxDQUFDLEVBQUU7UUFDZixJQUFJLEVBQUUsV0FBVztRQUNqQixPQUFPLEVBQUUsb0JBQVcsQ0FBQyxZQUFZLENBQUMsY0FBYztRQUNoRCxTQUFTLEVBQUUsSUFBSTtRQUNmLGFBQWEsRUFBRSxJQUFJO1FBQ25CLEtBQUssRUFBRSxTQUFTO1FBQ2hCLFFBQVEsRUFBRSxDQUFDO1FBQ1gsWUFBWSxFQUFFLEVBQUU7S0FDbkI7SUFDRCxDQUFDLGVBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRTtRQUNmLElBQUksRUFBRSxjQUFjO1FBQ3BCLE9BQU8sRUFBRSxvQkFBVyxDQUFDLFlBQVksQ0FBQyxjQUFjO1FBQ2hELFNBQVMsRUFBRSxJQUFJO1FBQ2YsYUFBYSxFQUFFLElBQUk7UUFDbkIsS0FBSyxFQUFFLFNBQVM7UUFDaEIsUUFBUSxFQUFFLENBQUM7UUFDWCxZQUFZLEVBQUUsRUFBRTtLQUNuQjtJQUNELENBQUMsZUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1FBQ2YsSUFBSSxFQUFFLGNBQWM7UUFDcEIsT0FBTyxFQUFFLG9CQUFXLENBQUMsWUFBWSxDQUFDLGNBQWM7UUFDaEQsU0FBUyxFQUFFLElBQUk7UUFDZixhQUFhLEVBQUUsSUFBSTtRQUNuQixLQUFLLEVBQUUsU0FBUztRQUNoQixRQUFRLEVBQUUsQ0FBQztRQUNYLFlBQVksRUFBRSxFQUFFO0tBQ25CO0lBQ0QsQ0FBQyxlQUFRLENBQUMsTUFBTSxDQUFDLEVBQUU7UUFDZixJQUFJLEVBQUUsY0FBYztRQUNwQixPQUFPLEVBQUUsb0JBQVcsQ0FBQyxZQUFZLENBQUMsY0FBYztRQUNoRCxTQUFTLEVBQUUsSUFBSTtRQUNmLGFBQWEsRUFBRSxJQUFJO1FBQ25CLEtBQUssRUFBRSxTQUFTO1FBQ2hCLFFBQVEsRUFBRSxDQUFDO1FBQ1gsWUFBWSxFQUFFLEVBQUU7S0FDbkI7SUFDRCxDQUFDLGVBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRTtRQUNmLElBQUksRUFBRSxjQUFjO1FBQ3BCLE9BQU8sRUFBRSxvQkFBVyxDQUFDLFlBQVksQ0FBQyxjQUFjO1FBQ2hELFNBQVMsRUFBRSxJQUFJO1FBQ2YsYUFBYSxFQUFFLElBQUk7UUFDbkIsS0FBSyxFQUFFLFNBQVM7UUFDaEIsUUFBUSxFQUFFLENBQUM7UUFDWCxZQUFZLEVBQUUsRUFBRTtLQUNuQjtJQUNELENBQUMsZUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1FBQ2YsSUFBSSxFQUFFLGNBQWM7UUFDcEIsT0FBTyxFQUFFLG9CQUFXLENBQUMsWUFBWSxDQUFDLGNBQWM7UUFDaEQsU0FBUyxFQUFFLElBQUk7UUFDZixhQUFhLEVBQUUsSUFBSTtRQUNuQixLQUFLLEVBQUUsU0FBUztRQUNoQixRQUFRLEVBQUUsQ0FBQztRQUNYLFlBQVksRUFBRSxFQUFFO0tBQ25CO0lBQ0QsQ0FBQyxlQUFRLENBQUMsTUFBTSxDQUFDLEVBQUU7UUFDZixJQUFJLEVBQUUsY0FBYztRQUNwQixPQUFPLEVBQUUsb0JBQVcsQ0FBQyxZQUFZLENBQUMsY0FBYztRQUNoRCxTQUFTLEVBQUUsSUFBSTtRQUNmLGFBQWEsRUFBRSxJQUFJO1FBQ25CLEtBQUssRUFBRSxTQUFTO1FBQ2hCLFFBQVEsRUFBRSxDQUFDO1FBQ1gsWUFBWSxFQUFFLEVBQUU7S0FDbkI7SUFDRCxDQUFDLGVBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRTtRQUNmLElBQUksRUFBRSxjQUFjO1FBQ3BCLE9BQU8sRUFBRSxvQkFBVyxDQUFDLFlBQVksQ0FBQyxjQUFjO1FBQ2hELFNBQVMsRUFBRSxJQUFJO1FBQ2YsYUFBYSxFQUFFLElBQUk7UUFDbkIsS0FBSyxFQUFFLFNBQVM7UUFDaEIsUUFBUSxFQUFFLENBQUM7UUFDWCxZQUFZLEVBQUUsRUFBRTtLQUNuQjtJQUNELENBQUMsZUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1FBQ2YsSUFBSSxFQUFFLGNBQWM7UUFDcEIsT0FBTyxFQUFFLG9CQUFXLENBQUMsWUFBWSxDQUFDLGNBQWM7UUFDaEQsU0FBUyxFQUFFLElBQUk7UUFDZixhQUFhLEVBQUUsSUFBSTtRQUNuQixLQUFLLEVBQUUsU0FBUztRQUNoQixRQUFRLEVBQUUsQ0FBQztRQUNYLFlBQVksRUFBRSxFQUFFO0tBQ25CO0lBQ0QsQ0FBQyxlQUFRLENBQUMsTUFBTSxDQUFDLEVBQUU7UUFDZixJQUFJLEVBQUUsY0FBYztRQUNwQixPQUFPLEVBQUUsb0JBQVcsQ0FBQyxZQUFZLENBQUMsY0FBYztRQUNoRCxTQUFTLEVBQUUsSUFBSTtRQUNmLGFBQWEsRUFBRSxJQUFJO1FBQ25CLEtBQUssRUFBRSxTQUFTO1FBQ2hCLFFBQVEsRUFBRSxDQUFDO1FBQ1gsWUFBWSxFQUFFLEVBQUU7S0FDbkI7Q0FDSixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7OztBQzdJRixzRkFBa0Q7QUFDbEQsaUhBQThDO0FBQzlDLCtIQUF3QztBQUUzQixxQkFBYSxHQUEwQjtJQUNoRCxDQUFDLGlCQUFRLENBQUMsV0FBVyxDQUFDLEVBQUUscUJBQVc7SUFDbkMsQ0FBQyxpQkFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLDJCQUFZO0lBQy9CLENBQUMsaUJBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJO0NBQ3hCOzs7Ozs7Ozs7Ozs7Ozs7OztBQ1JELGlIQUE4QztBQUU5QywrRkFBOEI7QUFDOUIsc0ZBQWlFO0FBRWpFLE1BQWEsWUFBYSxTQUFRLDJCQUFZO0lBTTFDLFlBQVksSUFBbUI7UUFDM0IsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUxuQixVQUFLLEdBQVcsRUFBRSxHQUFHLGNBQUksQ0FBQyxVQUFVLENBQUM7UUFDckMsV0FBTSxHQUFXLEVBQUUsR0FBRyxjQUFJLENBQUMsV0FBVyxDQUFDO1FBS25DLElBQUcsSUFBSSxDQUFDLElBQUksS0FBSyxpQkFBUSxDQUFDLE1BQU0sRUFBRTtZQUM5QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1NBQzlCO0lBQ0wsQ0FBQztJQUVELFVBQVUsQ0FBQyxJQUFtQjtRQUMxQixJQUFHLElBQUksQ0FBQyxJQUFJLEtBQUssaUJBQVEsQ0FBQyxNQUFNLEVBQUU7WUFDOUIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztTQUM5QjtJQUNMLENBQUM7SUFFRCxNQUFNLENBQUMsTUFBVSxFQUFFLFdBQW1CO1FBQ2xDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUV2QixNQUFNLENBQUMsSUFBSSxDQUNQLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxjQUFJLENBQUMsVUFBVTtZQUNyQixjQUFJLENBQUMsZ0JBQWdCLEdBQUcsY0FBSSxDQUFDLFVBQVUsQ0FBQztZQUM1QyxXQUFXLEVBQ1gsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLGNBQUksQ0FBQyxXQUFXO1lBQ3RCLGNBQUksQ0FBQyxnQkFBZ0IsR0FBRyxjQUFJLENBQUMsV0FBVyxDQUFDO1lBQzdDLFdBQVcsRUFDWCxJQUFJLENBQUMsS0FBSyxHQUFHLFdBQVcsR0FBRyxjQUFJLENBQUMsVUFBVSxFQUMxQyxJQUFJLENBQUMsTUFBTSxHQUFHLFdBQVcsR0FBRyxjQUFJLENBQUMsV0FBVyxDQUMvQyxDQUFDO1FBQ0YsaUNBQWlDO1FBQ2pDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFZixNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7UUFFbEIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFDLENBQUM7UUFDakMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUU1QyxNQUFNLENBQUMsSUFBSSxDQUNQLElBQUksQ0FBQyxJQUFJLEVBQ1QsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxjQUFJLENBQUMsVUFBVSxDQUFDO1lBQ3hCLGNBQUksQ0FBQyxnQkFBZ0IsR0FBRyxjQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLGNBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbEYsV0FBVyxFQUNYLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsY0FBSSxDQUFDLFdBQVcsQ0FBQztZQUN6QixjQUFJLENBQUMsZ0JBQWdCLEdBQUcsY0FBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxjQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsR0FBRyxDQUFDO1lBQ3RGLFdBQVcsQ0FDZCxDQUFDO0lBQ04sQ0FBQztDQUNKO0FBbERELG9DQWtEQzs7Ozs7Ozs7Ozs7Ozs7O0FDdkRELCtGQUE4QjtBQUM5QixpSEFBOEM7QUFDOUMsc0ZBQWlFO0FBQ2pFLGdJQUEwRDtBQUMxRCxrR0FBaUY7QUFDakYsZ0ZBQWdEO0FBQ2hELG1HQUEyQztBQUczQyxNQUFNLFdBQVksU0FBUSwyQkFBWTtJQXFDbEMsWUFDSSxJQUF5QztRQUV6QyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztRQXRDbEIsVUFBSyxHQUFXLEVBQUUsR0FBRyxjQUFJLENBQUMsVUFBVSxDQUFDO1FBQ3JDLFdBQU0sR0FBVyxFQUFFLEdBQUcsY0FBSSxDQUFDLFdBQVcsQ0FBQztRQUd2QyxTQUFJLEdBQVcsQ0FBQztRQUNoQixTQUFJLEdBQVcsQ0FBQztRQVFoQixVQUFLLEdBQVcsQ0FBQztRQUNqQixVQUFLLEdBQVcsQ0FBQztRQUVqQixhQUFRLEdBQVksS0FBSyxDQUFDO1FBQzFCLGNBQVMsR0FBWSxLQUFLLENBQUM7UUFLM0IsU0FBSSxHQUFXLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU07UUFPdkMscUJBQWdCLEdBQTRDLE1BQU0sQ0FBQztRQUNuRSxjQUFTLEdBQVcsQ0FBQyxDQUFDO1FBRXRCLGlCQUFZLEdBQXNDLHVCQUFVLENBQUMsZUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQU87UUFDbEYsb0JBQWUsR0FBc0MsdUJBQVUsQ0FBQyxlQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7UUFPMUUsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUk7UUFFMUIsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEIsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFcEIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUV6QyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDNUIsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBRTVCLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFDaEIsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2pCLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO1FBQ3hCLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO0lBQzVCLENBQUM7SUFFRCxNQUFNLENBQUMsTUFBWSxFQUFFLFdBQW1CO1FBRXBDLHlCQUFnQixDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLENBRXRELE1BQU0sRUFDTixDQUFDLElBQUksQ0FBQyxhQUFhLEdBQUcsY0FBSSxDQUFDLFVBQVU7WUFDakMsY0FBSSxDQUFDLGdCQUFnQixHQUFHLGNBQUksQ0FBQyxVQUFVLENBQUM7WUFDNUMsV0FBVyxFQUNYLENBQUMsSUFBSSxDQUFDLGFBQWEsR0FBRyxjQUFJLENBQUMsV0FBVztZQUNsQyxjQUFJLENBQUMsZ0JBQWdCLEdBQUcsY0FBSSxDQUFDLFdBQVcsQ0FBQztZQUM3QyxXQUFXLEVBQ1gsSUFBSSxDQUFDLEtBQUssR0FBRyxXQUFXLEdBQUcsY0FBSSxDQUFDLFVBQVUsRUFDMUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxXQUFXLEdBQUcsY0FBSSxDQUFDLFdBQVcsQ0FDL0MsQ0FBQztRQUNGLHlCQUFnQixDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQywwQkFBMEIsQ0FFOUUsTUFBTSxFQUNOLElBQUksQ0FBQyxhQUFhLEVBQ2xCLElBQUksQ0FBQyxhQUFhLEdBQUMsSUFBSSxDQUFDLE1BQU0sRUFDOUIsSUFBSSxDQUFDLEtBQUssRUFDVixJQUFJLENBQUMsTUFBTSxDQUNkLENBQUM7SUFDVixDQUFDO0lBRUQsVUFBVSxDQUFDLElBQW1CO1FBQzFCLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxpQkFBUSxDQUFDLE1BQU07WUFDN0IsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztJQUNuQyxDQUFDO0lBRUQsYUFBYTtRQUVULElBQUksQ0FBQyxJQUFJO1lBQ0wsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ2xELElBQ0ksSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUNsQztZQUNFLGNBQUksQ0FBQyxpQkFBaUIsR0FBRyxHQUFHLENBQUM7WUFDN0IsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxjQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ25ELGNBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksNkJBQWEsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQ25OO1lBQ0QsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQztTQUNwQjtJQUNMLENBQUM7SUFFRCxtQkFBbUI7UUFDZiw2RkFBNkY7UUFFN0YsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUV2QixJQUFJLElBQUksQ0FBQyxlQUFlLEtBQUssU0FBUyxFQUFFO1lBQ3BDLElBQUksQ0FBQyxJQUFJO2dCQUNMLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxjQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLHNCQUFzQjtvQkFDL0YsSUFBSSxDQUFDLElBQUksQ0FBQztTQUNqQjthQUFNO1lBQ0gsSUFBSSxDQUFDLElBQUk7Z0JBQ0wsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLGNBQUksQ0FBQyxnQkFBZ0IsR0FBRyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLDBDQUEwQztvQkFDckosSUFBSSxDQUFDLElBQUksQ0FBQztTQUNqQjtRQUNELElBQUksQ0FBQyxJQUFJLElBQUksY0FBSSxDQUFDLGFBQWEsQ0FBQztRQUNoQyxJQUFJLENBQUMsSUFBSTtZQUNMLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxjQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztnQkFDdkUsSUFBSSxDQUFDLElBQUksQ0FBQztRQUNkLDBDQUEwQztRQUMxQyxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDZixXQUFXO1lBQ1gsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxjQUFJLENBQUMsa0JBQWtCLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3ZGLGNBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksNkJBQWEsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxjQUFJLENBQUMsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQzthQUNoTDtZQUNELE1BQU07WUFDTixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLGNBQUksQ0FBQyxrQkFBa0IsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDdkYsY0FBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSw2QkFBYSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7YUFDaE87U0FDSjtJQUNMLENBQUM7SUFFRCwyQkFBMkI7UUFDdkIsaUlBQWlJO1FBQ2pJLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUU7WUFDaEIsSUFBSSxDQUFDLGFBQWEsR0FBRyxjQUFJLENBQUMsR0FBRyxDQUN6QixJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsY0FBSSxDQUFDLG1CQUFtQixFQUMvQyxJQUFJLENBQUMsQ0FBQyxDQUNULENBQUM7U0FDTDthQUFNO1lBQ0gsSUFBSSxDQUFDLGFBQWEsR0FBRyxjQUFJLENBQUMsR0FBRyxDQUN6QixJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsY0FBSSxDQUFDLG1CQUFtQixFQUMvQyxJQUFJLENBQUMsQ0FBQyxDQUNULENBQUM7U0FDTDtRQUNELElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUU7WUFDaEIsSUFBSSxDQUFDLGFBQWEsR0FBRyxjQUFJLENBQUMsR0FBRyxDQUN6QixJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsY0FBSSxDQUFDLG1CQUFtQixFQUMvQyxJQUFJLENBQUMsQ0FBQyxDQUNULENBQUM7U0FDTDthQUFNO1lBQ0gsSUFBSSxDQUFDLGFBQWEsR0FBRyxjQUFJLENBQUMsR0FBRyxDQUN6QixJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsY0FBSSxDQUFDLG1CQUFtQixFQUMvQyxJQUFJLENBQUMsQ0FBQyxDQUNULENBQUM7U0FDTDtJQUNMLENBQUM7SUFFRCx1QkFBdUI7UUFDbkIsSUFBSSxDQUFDLFlBQVksR0FBRyx1QkFBVSxDQUFDLGVBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM3QyxJQUFJLENBQUMsZUFBZSxHQUFHLHVCQUFVLENBQUMsZUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2hELElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNqQixJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7UUFFakIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQy9CLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1FBRXRCOzs7OztVQUtFO1FBRUYsbUNBQW1DO1FBRW5DLHdEQUF3RDtRQUN4RCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBRXpDLElBQUksdUJBQWdDLENBQUM7UUFFckMsaUZBQWlGO1FBQ2pGLEtBQ0ksSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsRUFDeEQsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsRUFDaEUsQ0FBQyxFQUFFLEVBQ0w7WUFDRSxLQUNJLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQ3hELENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQ2pFLENBQUMsRUFBRSxFQUNMO2dCQUNFLHNGQUFzRjtnQkFDdEYsSUFBSSxZQUFZLEdBQWEsY0FBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLGNBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQzVFLElBQUksWUFBWSxJQUFJLENBQUMsRUFBRTtvQkFDbkIsOERBQThEO29CQUM5RCxJQUFJLENBQUMsYUFBYSxHQUFHLGNBQUksQ0FBQyxTQUFTLENBQy9CLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxFQUNkLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUNmLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUNkLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUNmLElBQUksQ0FBQyxDQUFDLEVBQ04sSUFBSSxDQUFDLENBQUMsRUFDTixJQUFJLENBQUMsSUFBSSxFQUNULElBQUksQ0FBQyxJQUFJLENBQ1osQ0FBQztvQkFDRix1QkFBdUIsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDcEUsSUFDSSxJQUFJLENBQUMsYUFBYSxLQUFLLEtBQUssRUFBRSxFQUFDLHNCQUFzQjt3QkFDckQsSUFDSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsRUFDbEQ7NEJBQ0UsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMseUVBQXdFOzRCQUNuSCxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0NBRWhDLElBQUksSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRTtvQ0FDaEMsSUFBSSxDQUFDLFlBQVksR0FBRyx1QkFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDO2lDQUNoRDtxQ0FDSTtvQ0FDRCxJQUFJLENBQUMsZUFBZSxHQUFHLHVCQUFVLENBQUMsWUFBWSxDQUFDLENBQUM7aUNBQ25EOzZCQUNKO3lCQUNKOzZCQUFNLElBQUksSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLElBQUksdUJBQXVCLEtBQUssQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7NEJBQzNILElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDOzRCQUMzQyxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0NBRWhDLElBQUksSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRTtvQ0FDaEMsSUFBSSxDQUFDLFlBQVksR0FBRyx1QkFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDO2lDQUNoRDtxQ0FDSTtvQ0FDRCxJQUFJLENBQUMsZUFBZSxHQUFHLHVCQUFVLENBQUMsWUFBWSxDQUFDLENBQUM7aUNBQ25EOzZCQUNKO3lCQUNKO3FCQUVKO2lCQUNKO2FBQ0o7U0FDSjtRQUVELElBQUksSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxLQUFLLFFBQVEsRUFBRTtZQUN2Qyx3Q0FBd0M7WUFFeEMsNEhBQTRIO1lBQzVILElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDL0MsSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMvQyxxREFBcUQ7WUFDckQsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUNoQyxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtvQkFDakMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7b0JBQ3JCLHdGQUF3RjtvQkFDeEYsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBQyx3R0FBd0c7d0JBQzFILGNBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUM7d0JBQ3BELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsY0FBSSxDQUFDLGtCQUFrQixFQUFFLENBQUMsRUFBRSxFQUFFOzRCQUNsRCxjQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLDZCQUFhLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQzt5QkFDbk47cUJBQ0o7aUJBQ0o7cUJBQ0k7b0JBQ0QsY0FBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQztvQkFDcEQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxjQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBQyw2QkFBNkI7d0JBQ2hGLGNBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksNkJBQWEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztxQkFDbE07aUJBQ0o7Z0JBQ0QsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxzRkFBc0Y7Z0JBQ3JHLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLDhEQUE4RDtnQkFDeEgsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxxRUFBcUU7YUFDekY7aUJBQU07Z0JBQ0gsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyw4Q0FBOEM7Z0JBQzdELElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMscUVBQXFFO2dCQUN0RixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyw4REFBOEQ7YUFDM0g7WUFFRCxpS0FBaUs7WUFFakssd0dBQXdHO1lBRXhHLHdEQUF3RDtZQUN4RCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBRXpDLGlGQUFpRjtZQUNqRixLQUNJLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQzFELENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQ2xFLENBQUMsRUFBRSxFQUNMO2dCQUNFLEtBQ0ksSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFDMUQsQ0FBQztvQkFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQy9ELENBQUMsRUFBRSxFQUNMO29CQUNFLElBQUksWUFBWSxHQUFhLGNBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxjQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUM1RSw0RUFBNEU7b0JBQzVFLElBQUksWUFBWSxLQUFLLGVBQVEsQ0FBQyxHQUFHLEVBQUU7d0JBQy9CLDhEQUE4RDt3QkFDOUQsSUFBSSxDQUFDLGFBQWEsR0FBRyxjQUFJLENBQUMsU0FBUyxDQUMvQixDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFDZCxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFDZixJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsRUFDZCxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFDZixJQUFJLENBQUMsQ0FBQyxFQUNOLElBQUksQ0FBQyxDQUFDLEVBQ04sSUFBSSxDQUFDLE1BQU0sRUFDWCxJQUFJLENBQUMsTUFBTSxDQUNkLENBQUM7d0JBQ0YsSUFDSSxJQUFJLENBQUMsYUFBYSxLQUFLLEtBQUs7NEJBQzVCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxFQUNsRDs0QkFDRSxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQzs0QkFDM0MsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFO2dDQUVoQyxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUU7b0NBQ2hDLElBQUksQ0FBQyxZQUFZLEdBQUcsdUJBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQztpQ0FDaEQ7cUNBQ0k7b0NBQ0QsSUFBSSxDQUFDLGVBQWUsR0FBRyx1QkFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDO2lDQUNuRDs2QkFDSjt5QkFDSjtxQkFDSjtpQkFDSjthQUNKO1lBRUQsd0NBQXdDO1lBQ3hDLElBQUksSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxLQUFLLFFBQVEsRUFBRTtnQkFDdkMsSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDakQsSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFFakQsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFO29CQUNoQyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLHNGQUFzRjtvQkFDckcsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7d0JBQ2pDLHdGQUF3Rjt3QkFDeEYsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7cUJBRXhCO2lCQUNKO3FCQUFNO29CQUNILElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsOENBQThDO2lCQUNoRTthQUNKO2lCQUFNO2dCQUNILDRDQUE0QztnQkFDNUMsSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDO2dCQUN0QixJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUM7YUFDekI7U0FDSjthQUFNO1lBQ0gsOEJBQThCO1lBQzlCLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQztZQUNwQixJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUM7U0FDdkI7UUFFRCw0QkFBNEI7UUFFNUIsSUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNaLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ1gsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7U0FDakI7YUFBTSxJQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxjQUFJLENBQUMsVUFBVSxFQUFFO1lBQzlDLElBQUksQ0FBQyxDQUFDLEdBQUcsY0FBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1lBQ3RDLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO1NBQ2pCO1FBRUQsSUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNaLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ1gsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7U0FDakI7YUFBTSxJQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxjQUFJLENBQUMsV0FBVyxFQUFFO1lBQ2hELElBQUksQ0FBQyxDQUFDLEdBQUcsY0FBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1lBQ3hDLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO1lBQ2QsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7U0FDeEI7SUFDTCxDQUFDO0NBQ0o7QUFJRCxTQUFTLGFBQWEsQ0FBQyxDQUFTO0lBQzVCLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQ25DLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDMUI7SUFDRCxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFCLENBQUM7QUFFRCxTQUFTLG1CQUFtQixDQUFDLEVBQVUsRUFBRSxFQUFVLEVBQUUsRUFBVSxFQUFFLEVBQVU7SUFDdkUsT0FBTyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFDdkMsQ0FBQztBQVpELGlCQUFTLFdBQVcsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7QUMzWHJCLE1BQXNCLFlBQVk7SUFPOUIsWUFBc0IsUUFBZ0I7UUFIdEMsTUFBQyxHQUFXLENBQUM7UUFDYixNQUFDLEdBQVcsQ0FBQztRQUdULElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUTtJQUM1QixDQUFDO0NBS0o7QUFkRCxvQ0FjQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsQkQsK0ZBQThCO0FBSTlCLE1BQWEsYUFBYTtJQVd0QixZQUFZLEtBQWEsRUFBRSxJQUFZLEVBQUUsUUFBZ0IsRUFBRSxDQUFTLEVBQUUsQ0FBUyxFQUFFLElBQWEsRUFBRSxJQUFhLEVBQUUsT0FBaUI7UUFDNUgsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWCxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNYLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQztRQUN0QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLENBQUM7UUFDdEIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsNEZBQTJGO1FBQy9HLElBQUksT0FBTyxLQUFLLFNBQVM7WUFDckIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDM0IsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFDYixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztJQUM3QixDQUFDO0lBRUQsTUFBTSxDQUFDLE1BQW9CLEVBQUUsV0FBbUI7UUFDNUMsSUFBSSxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLEdBQUcsR0FBRyxFQUFFLEVBQUMsMEVBQTBFO1lBQzNHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzNCO2FBQ0ksRUFBQyxvRkFBb0Y7WUFDdEYsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUUsRUFBQyw2REFBNkQ7Z0JBQ3ZGLElBQUksa0JBQWtCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQzlHLElBQUksa0JBQWtCLEtBQUcsU0FBUyxJQUFJLGtCQUFrQixDQUFDLE1BQU0sS0FBRyxTQUFTLEVBQUMsdURBQXVEO29CQUMvSCxNQUFNLElBQUksS0FBSyxDQUNYLDJDQUEyQyxDQUM5QyxDQUFDO2dCQUNOLE9BQU0sa0JBQWtCLENBQUMsTUFBTSxHQUFDLENBQUMsRUFBRSxFQUFDLGlJQUFpSTtvQkFDakssa0JBQWtCLEdBQUcsR0FBRyxHQUFDLGtCQUFrQixDQUFDO2lCQUMvQztnQkFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxrQkFBa0IsQ0FBQyxDQUFDO2FBQ2hFO2lCQUNJLEVBQUMsb0NBQW9DO2dCQUN0QyxJQUFJLGtCQUFrQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDbkosSUFBSSxrQkFBa0IsS0FBRyxTQUFTLElBQUksa0JBQWtCLENBQUMsTUFBTSxLQUFHLFNBQVMsRUFBQyx1REFBdUQ7b0JBQy9ILE1BQU0sSUFBSSxLQUFLLENBQ1gsMkNBQTJDLENBQzlDLENBQUM7Z0JBQ04sT0FBTSxrQkFBa0IsQ0FBQyxNQUFNLEdBQUMsQ0FBQyxFQUFFLEVBQUMsaUlBQWlJO29CQUNqSyxrQkFBa0IsR0FBRyxHQUFHLEdBQUMsa0JBQWtCLENBQUM7aUJBQy9DO2dCQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLGtCQUFrQixDQUFDLENBQUM7YUFDaEU7U0FDSjtRQUNELHVGQUF1RjtRQUN2RixNQUFNLENBQUMsSUFBSSxDQUNQLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLGNBQUksQ0FBQyxVQUFVO1lBQ3RDLGNBQUksQ0FBQyxnQkFBZ0IsR0FBRyxjQUFJLENBQUMsVUFBVSxDQUFDO1lBQzVDLFdBQVcsRUFDWCxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxjQUFJLENBQUMsV0FBVztZQUN2QyxjQUFJLENBQUMsZ0JBQWdCLEdBQUcsY0FBSSxDQUFDLFdBQVcsQ0FBQztZQUM3QyxXQUFXLEVBQ1gsSUFBSSxDQUFDLElBQUksR0FBRyxXQUFXLEdBQUcsY0FBSSxDQUFDLFVBQVUsRUFDekMsSUFBSSxDQUFDLElBQUksR0FBRyxXQUFXLEdBQUcsY0FBSSxDQUFDLFdBQVcsQ0FDN0MsQ0FBQztJQUNOLENBQUM7SUFFRCxJQUFJO1FBQ0EsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ1gsSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQztRQUNwQixJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxjQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLDJDQUEwQztRQUM3SCxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDZCxJQUFJLENBQUMsSUFBSSxJQUFJLGNBQUksQ0FBQyxhQUFhLENBQUM7U0FDbkM7UUFDRCxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxjQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3ZGLENBQUM7Q0FFSjtBQTdFRCxzQ0E2RUM7Ozs7Ozs7VUNqRkQ7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOzs7OztXQ3pCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLCtCQUErQix3Q0FBd0M7V0FDdkU7V0FDQTtXQUNBO1dBQ0E7V0FDQSxpQkFBaUIscUJBQXFCO1dBQ3RDO1dBQ0E7V0FDQSxrQkFBa0IscUJBQXFCO1dBQ3ZDO1dBQ0E7V0FDQSxLQUFLO1dBQ0w7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOzs7OztXQzNCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsR0FBRztXQUNIO1dBQ0E7V0FDQSxDQUFDOzs7OztXQ1BEOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7V0NOQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsTUFBTSxxQkFBcUI7V0FDM0I7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTtXQUNBO1dBQ0E7Ozs7O1VFaERBO1VBQ0E7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi9hcGkvRW50aXR5LnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL2FwaS9UaWxlLnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3dlYnBhZ2Uvc3JjL0dhbWUudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vd2VicGFnZS9zcmMvTWFpbi50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi93ZWJwYWdlL3NyYy9hc3NldHMvQXNzZXRzLnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3dlYnBhZ2Uvc3JjL2Fzc2V0cy9yZXNvdXJjZXMvQXVkaW9SZXNvdXJjZS50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi93ZWJwYWdlL3NyYy9hc3NldHMvcmVzb3VyY2VzL0F1ZGlvUmVzb3VyY2VHcm91cC50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi93ZWJwYWdlL3NyYy9hc3NldHMvcmVzb3VyY2VzL0ZvbnRSZXNvdXJjZS50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi93ZWJwYWdlL3NyYy9hc3NldHMvcmVzb3VyY2VzL0ltYWdlUmVzb3VyY2UudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vd2VicGFnZS9zcmMvYXNzZXRzL3Jlc291cmNlcy9SZWZsZWN0ZWRJbWFnZVJlc291cmNlLnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3dlYnBhZ2Uvc3JjL2Fzc2V0cy9yZXNvdXJjZXMvUmVzb3VyY2UudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vd2VicGFnZS9zcmMvYXNzZXRzL3Jlc291cmNlcy9UaWxlUmVzb3VyY2UudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vd2VicGFnZS9zcmMvaW5wdXQvQ29udHJvbC50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi93ZWJwYWdlL3NyYy91aS9CdXR0b24udHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vd2VicGFnZS9zcmMvdWkvSW5wdXRCb3gudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vd2VicGFnZS9zcmMvdWkvU2xpZGVyLnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3dlYnBhZ2Uvc3JjL3VpL1VpRnJhbWUudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vd2VicGFnZS9zcmMvdWkvVWlTY3JlZW4udHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vd2VicGFnZS9zcmMvdWkvc2NyZWVucy9Db250cm9sc01lbnUudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vd2VicGFnZS9zcmMvdWkvc2NyZWVucy9NYWluTWVudS50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi93ZWJwYWdlL3NyYy91aS9zY3JlZW5zL09wdGlvbnNNZW51LnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3dlYnBhZ2Uvc3JjL3VpL3NjcmVlbnMvUGF1c2VNZW51LnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3dlYnBhZ2Uvc3JjL3VpL3NjcmVlbnMvVmlkZW9TZXR0aW5nc01lbnUudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vd2VicGFnZS9zcmMvdWkvc2NyZWVucy9Xb3JsZENyZWF0aW9uTWVudS50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi93ZWJwYWdlL3NyYy91aS9zY3JlZW5zL1dvcmxkT3B0aW9uc01lbnUudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vd2VicGFnZS9zcmMvd2Vic29ja2V0L05ldE1hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vd2VicGFnZS9zcmMvd29ybGQvV29ybGQudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vd2VicGFnZS9zcmMvd29ybGQvV29ybGRUaWxlcy50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi93ZWJwYWdlL3NyYy93b3JsZC9lbnRpdGllcy9FbnRpdHlDbGFzc2VzLnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3dlYnBhZ2Uvc3JjL3dvcmxkL2VudGl0aWVzL1BsYXllckVudGl0eS50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi93ZWJwYWdlL3NyYy93b3JsZC9lbnRpdGllcy9QbGF5ZXJMb2NhbC50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi93ZWJwYWdlL3NyYy93b3JsZC9lbnRpdGllcy9TZXJ2ZXJFbnRpdHkudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vd2VicGFnZS9zcmMvd29ybGQvcGFydGljbGVzL0NvbG9yUGFydGljbGUudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3Nub3dlZF9pbi93ZWJwYWNrL3J1bnRpbWUvY2h1bmsgbG9hZGVkIiwid2VicGFjazovL3Nub3dlZF9pbi93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luL3dlYnBhY2svcnVudGltZS9nbG9iYWwiLCJ3ZWJwYWNrOi8vc25vd2VkX2luL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vc25vd2VkX2luL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vc25vd2VkX2luL3dlYnBhY2svcnVudGltZS9qc29ucCBjaHVuayBsb2FkaW5nIiwid2VicGFjazovL3Nub3dlZF9pbi93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL3Nub3dlZF9pbi93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vc25vd2VkX2luL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbnZlbnRvcnlQYXlsb2FkIH0gZnJvbSAnLi9JbnZlbnRvcnknO1xyXG5cclxuZXhwb3J0IGVudW0gRW50aXRpZXMge1xyXG4gICAgTG9jYWxQbGF5ZXIsXHJcbiAgICBQbGF5ZXIsXHJcbiAgICBJdGVtXHJcbn1cclxuXHJcbnR5cGUgRGF0YVBhaXJzPFQsIEsgZXh0ZW5kcyBrZXlvZiBUID0ga2V5b2YgVD4gPVxyXG4gICAgSyBleHRlbmRzIGtleW9mIFRcclxuICAgICAgICA/IHsgdHlwZTogSywgZGF0YTogVFtLXSB9XHJcbiAgICAgICAgOiBuZXZlcjtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgRW50aXRpZXNEYXRhIHtcclxuICAgIFtFbnRpdGllcy5Mb2NhbFBsYXllcl06IHtuYW1lOiBzdHJpbmcsIHg6IG51bWJlciwgeTogbnVtYmVyLCBpbnZlbnRvcnk6IEludmVudG9yeVBheWxvYWR9XHJcbiAgICBbRW50aXRpZXMuUGxheWVyXToge25hbWU6IHN0cmluZ307XHJcbiAgICBbRW50aXRpZXMuSXRlbV06IHtkYXRlQ3JlYXRlZDogc3RyaW5nfTtcclxufVxyXG5cclxuZXhwb3J0IHR5cGUgRW50aXR5RGF0YTxUIGV4dGVuZHMgRW50aXRpZXMgPSBrZXlvZiBFbnRpdGllc0RhdGE+ID0gRGF0YVBhaXJzPEVudGl0aWVzRGF0YSwgVD5cclxuXHJcbmV4cG9ydCB0eXBlIEVudGl0eVBheWxvYWQ8VCBleHRlbmRzIEVudGl0aWVzID0ga2V5b2YgRW50aXRpZXNEYXRhPiA9IEVudGl0eURhdGE8VD4gJiB7aWQ6IHN0cmluZ30iLCJleHBvcnQgZW51bSBUaWxlVHlwZSB7XHJcbiAgICBBaXIsXHJcbiAgICBUaWxlRW50aXR5LFxyXG4gICAgU25vdyxcclxuICAgIEljZSxcclxuICAgIERpcnQsXHJcbiAgICBTdG9uZTAsXHJcbiAgICBTdG9uZTEsXHJcbiAgICBTdG9uZTIsXHJcbiAgICBTdG9uZTMsXHJcbiAgICBTdG9uZTQsXHJcbiAgICBTdG9uZTUsXHJcbiAgICBTdG9uZTYsXHJcbiAgICBTdG9uZTcsXHJcbiAgICBTdG9uZTgsXHJcbiAgICBTdG9uZTksXHJcbiAgICAvLyBXb29kMCxcclxuICAgIC8vIFdvb2QxLFxyXG4gICAgLy8gV29vZDIsXHJcbiAgICAvLyBXb29kMyxcclxuICAgIC8vIFdvb2Q0LFxyXG4gICAgLy8gV29vZDUsXHJcbiAgICAvLyBXb29kNixcclxuICAgIC8vIFdvb2Q3LFxyXG4gICAgLy8gV29vZDgsXHJcbiAgICAvLyBXb29kOSxcclxufSIsImltcG9ydCBwNSwgeyBDb2xvciwgU2hhZGVyIH0gZnJvbSAncDUnXHJcblxyXG5pbXBvcnQgV29ybGQgZnJvbSAnLi93b3JsZC9Xb3JsZCc7XHJcblxyXG5pbXBvcnQge1xyXG4gICAgQXVkaW9Bc3NldHMsXHJcbiAgICBGb250cyxcclxuICAgIEl0ZW1zQXNzZXRzLFxyXG4gICAgbG9hZEFzc2V0cyxcclxuICAgIFBsYXllckFuaW1hdGlvbnMsXHJcbiAgICBVaUFzc2V0cyxcclxuICAgIFdvcmxkQXNzZXRzLFxyXG59IGZyb20gJy4vYXNzZXRzL0Fzc2V0cyc7XHJcbmltcG9ydCB7IE1haW5NZW51IH0gZnJvbSAnLi91aS9zY3JlZW5zL01haW5NZW51JztcclxuaW1wb3J0IHsgU29ja2V0IH0gZnJvbSAnc29ja2V0LmlvLWNsaWVudCc7XHJcbmltcG9ydCBVaVNjcmVlbiBmcm9tICcuL3VpL1VpU2NyZWVuJztcclxuaW1wb3J0IHsgUGF1c2VNZW51IH0gZnJvbSAnLi91aS9zY3JlZW5zL1BhdXNlTWVudSc7XHJcbmltcG9ydCB7IE5ldE1hbmFnZXIgfSBmcm9tICcuL3dlYnNvY2tldC9OZXRNYW5hZ2VyJztcclxuXHJcbmltcG9ydCB7IENsaWVudEV2ZW50cywgU2VydmVyRXZlbnRzIH0gZnJvbSAnLi4vLi4vYXBpL0FQSSc7XHJcbmltcG9ydCBJdGVtU3RhY2sgZnJvbSAnLi93b3JsZC9pdGVtcy9JdGVtU3RhY2snO1xyXG5pbXBvcnQgeyBDb250cm9sIH0gZnJvbSAnLi9pbnB1dC9Db250cm9sJztcclxuaW1wb3J0IHsgQ29sb3JQYXJ0aWNsZSB9IGZyb20gJy4vd29ybGQvcGFydGljbGVzL0NvbG9yUGFydGljbGUnO1xyXG5pbXBvcnQgeyBXb3JsZFRpbGVzIH0gZnJvbSAnLi93b3JsZC9Xb3JsZFRpbGVzJztcclxuaW1wb3J0IHsgVGlsZVR5cGUgfSBmcm9tICcuLi8uLi9hcGkvVGlsZSc7XHJcblxyXG5cclxuLypcclxuLy8vSU5GT1JNQVRJT05cclxuLy9TdGFydGluZyBhIGdhbWVcclxuUHJlc3MgTGl2ZSBTZXJ2ZXIgdG8gc3RhcnQgdGhlIGdhbWVcclxub3JcclxuVHlwZSBucG0gcnVuIHByZXN0YXJ0IHRvIHN0YXJ0IHRoZSBnYW1lLlxyXG4vL1RPRE9cclxud2hlbiBzb21ldGhpbmcgaW4gdGhlIHRvZG8gc2VjdGlvbiwgZWl0aGVyIGRlbGV0ZSBpdCBhbmQgbWFyayB3aGF0IHdhcyBkb25lIGluIHRoZSBkZXNjcmlwdGlvbiAtXHJcbi0gd2hlbiBwdXNoaW5nLCBvciBqdXN0IG1hcmsgaXQgbGlrZSB0aGlzXHJcbihleGFtcGxlOiBDcmVhdGUgYSBudWNsZWFyIGV4cGxvc2lvbiAtLSBYKVxyXG4vLy9HRU5FUkFMIFRPRE86XHJcblxyXG4vL0F1ZGlvXHJcbnNvdW5kc1xyXG5tdXNpY1xyXG5OUEMnc1xyXG5cclxuLy9WaXN1YWxcclxuVXBkYXRlIHNub3cgdGV4dHVyZXNcclxuVXBkYXRlIEdVSSB0ZXh0dXJlc1xyXG5wbGF5ZXIgY2hhcmFjdGVyXHJcbml0ZW0gbG9yZSBpbXBsZW1lbnRlZFxyXG5cclxuLy9HYW1lcGxheVxyXG5maW5pc2ggaXRlbSBtYW5hZ2VtZW50XHJcbnBhdXNlIG1lbnVcclxuSHVuZ2VyLCBoZWF0LCBldGMgc3lzdGVtXHJcbml0ZW0gY3JlYXRpb25cclxuaXRlbSB1c2VcclxuUGFyZW50IFdvcmtiZW5jaFxyXG5cclxuLy9PYmplY3RzXHJcbmRpcnRcclxuc3RvbmVcclxud29ya2JlbmNoXHJcbmJhY2twYWNrICh1c2VkIGFzIGNoZXN0KVxyXG5cclxuLy9Qb2xpc2hcclxuYmV0dGVyIHdvcmxkIGdlbmVyYXRpb25cclxuZm9udCBjb25zaXN0ZW5jeVxyXG5maXggY3Vyc29yIGlucHV0IGxhZyAoc2VwYXJhdGUgY3Vyc29yIGFuZCBhbmltYXRpb24gaW1hZ2VzKVxyXG5maXggc3R1Y2sgb24gc2lkZSBvZiBibG9jayBidWdcclxuZml4IGNvbGxpZGUgd2l0aCBzaWRlcyBvZiBtYXAgYnVnXHJcblxyXG5pdGVtIG1hbmFnZW1lbnQgYmVoYXZpb3IgdG9kbzpcclxubWVyZ2VcclxucmlnaHQgY2xpY2sgc3RhY2sgdG8gcGljayB1cCBjZWlsKGhhbGYgb2YgaXQpXHJcbnJpZ2h0IGNsaWNrIHdoZW4gcGlja2VkIHVwIHRvIGFkZCAxIGlmIDAgb3IgbWF0Y2hcclxuY3JhZnRhYmxlc1xyXG5cclxuXHJcbiovXHJcblxyXG5cclxuY2xhc3MgR2FtZSBleHRlbmRzIHA1IHtcclxuICAgIHdvcmxkV2lkdGg6IG51bWJlciA9IDUxMjsgLy8gd2lkdGggb2YgdGhlIHdvcmxkIGluIHRpbGVzICAgPCE+IE1BS0UgU1VSRSBUSElTIElTIE5FVkVSIExFU1MgVEhBTiA2NCEhISA8IT5cclxuICAgIHdvcmxkSGVpZ2h0OiBudW1iZXIgPSAyNTY7IC8vIGhlaWdodCBvZiB0aGUgd29ybGQgaW4gdGlsZXMgIDwhPiBNQUtFIFNVUkUgVEhJUyBJUyBORVZFUiBMRVNTIFRIQU4gNjQhISEgPCE+XHJcblxyXG4gICAgVElMRV9XSURUSDogbnVtYmVyID0gODsgLy8gd2lkdGggb2YgYSB0aWxlcyBpbiBwaXhlbHNcclxuICAgIFRJTEVfSEVJR0hUOiBudW1iZXIgPSA4OyAvLyBoZWlnaHQgb2YgYSB0aWxlcyBpbiBwaXhlbHNcclxuICAgIEJBQ0tfVElMRV9XSURUSDogbnVtYmVyID0gMTI7IC8vIHdpZHRoIG9mIGEgdGlsZXMgaW4gcGl4ZWxzXHJcbiAgICBCQUNLX1RJTEVfSEVJR0hUOiBudW1iZXIgPSAxMjsgLy8gaGVpZ2h0IG9mIGEgdGlsZXMgaW4gcGl4ZWxzXHJcblxyXG4gICAgdXBzY2FsZVNpemU6IG51bWJlciA9IDY7IC8vIG51bWJlciBvZiBzY3JlZW4gcGl4ZWxzIHBlciB0ZXh0dXJlIHBpeGVscyAodGhpbmsgb2YgdGhpcyBhcyBodWQgc2NhbGUgaW4gTWluZWNyYWZ0KVxyXG5cclxuICAgIGNhbVg6IG51bWJlciA9IDA7IC8vIHBvc2l0aW9uIG9mIHRoZSB0b3AgbGVmdCBjb3JuZXIgb2YgdGhlIHNjcmVlbiBpbiB1bi11cC1zY2FsZWQgcGl4ZWxzICgwIGlzIGxlZnQgb2Ygd29ybGQpICh3b3JsZFdpZHRoKlRJTEVfV0lEVEggaXMgYm90dG9tIG9mIHdvcmxkKVxyXG4gICAgY2FtWTogbnVtYmVyID0gMDsgLy8gcG9zaXRpb24gb2YgdGhlIHRvcCBsZWZ0IGNvcm5lciBvZiB0aGUgc2NyZWVuIGluIHVuLXVwLXNjYWxlZCBwaXhlbHMgKDAgaXMgdG9wIG9mIHdvcmxkKSAod29ybGRIZWlnaHQqVElMRV9IRUlHSFQgaXMgYm90dG9tIG9mIHdvcmxkKVxyXG4gICAgcENhbVg6IG51bWJlciA9IDA7IC8vIGxhc3QgZnJhbWUncyB4IG9mIHRoZSBjYW1lcmFcclxuICAgIHBDYW1ZOiBudW1iZXIgPSAwOyAvLyBsYXN0IGZyYW1lJ3MgeSBvZiB0aGUgY2FtZXJhXHJcbiAgICBpbnRlcnBvbGF0ZWRDYW1YOiBudW1iZXIgPSAwOyAvLyBpbnRlcnBvbGF0ZWQgcG9zaXRpb24gb2YgdGhlIGNhbWVyYVxyXG4gICAgaW50ZXJwb2xhdGVkQ2FtWTogbnVtYmVyID0gMDsgLy8gaW50ZXJwb2xhdGVkIHBvc2l0aW9uIG9mIHRoZSBjYW1lcmFcclxuICAgIGRlc2lyZWRDYW1YOiBudW1iZXIgPSAwOyAvLyBkZXNpcmVkIHBvc2l0aW9uIG9mIHRoZSBjYW1lcmFcclxuICAgIGRlc2lyZWRDYW1ZOiBudW1iZXIgPSAwOyAvLyBkZXNpcmVkIHBvc2l0aW9uIG9mIHRoZSBjYW1lcmFcclxuICAgIHNjcmVlbnNoYWtlQW1vdW50OiBudW1iZXIgPSAwOyAvLyBhbW91bnQgb2Ygc2NyZWVuc2hha2UgaGFwcGVuaW5nIGF0IHRoZSBjdXJyZW50IG1vbWVudFxyXG5cclxuICAgIC8vIHRpY2sgbWFuYWdlbWVudFxyXG4gICAgbXNTaW5jZVRpY2s6IG51bWJlciA9IDA7IC8vIHRoaXMgaXMgdGhlIHJ1bm5pbmcgY291bnRlciBvZiBob3cgbWFueSBtaWxsaXNlY29uZHMgaXQgaGFzIGJlZW4gc2luY2UgdGhlIGxhc3QgdGljay4gIFRoZSBnYW1lIGNhbiB0aGVuXHJcbiAgICBtc1BlclRpY2s6IG51bWJlciA9IDIwOyAvLyB0aGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBwZXIgZ2FtZSB0aWNrLiAgMTAwMC9tc1BlclRpY2sgPSB0aWNrcyBwZXIgc2Vjb25kXHJcbiAgICBhbW91bnRTaW5jZUxhc3RUaWNrOiBudW1iZXIgPSAwOyAvLyB0aGlzIGlzIGEgdmFyaWFibGUgY2FsY3VsYXRlZCBldmVyeSBmcmFtZSB1c2VkIGZvciBpbnRlcnBvbGF0aW9uIC0gZG9tYWluWzAsMSlcclxuICAgIGZvcmdpdmVuZXNzQ291bnQ6IG51bWJlciA9IDUwOyAvLyBpZiB0aGUgY29tcHV0ZXIgbmVlZHMgdG8gZG8gbW9yZSB0aGFuIDUwIHRpY2tzIGluIGEgc2luZ2xlIGZyYW1lLCB0aGVuIGl0IGNvdWxkIGJlIHJ1bm5pbmcgYmVoaW5kLCBwcm9iYWJseSBiZWNhdXNlIG9mIGEgZnJlZXplIG9yIHRoZSB1c2VyIGJlaW5nIG9uIGEgZGlmZmVyZW50IHRhYi4gIEluIHRoZXNlIGNhc2VzLCBpdCdzIHByb2JhYmx5IGJlc3QgdG8ganVzdCBpZ25vcmUgdGhhdCBhbnkgdGltZSBoYXMgcGFzc2VkIHRvIGF2b2lkIGZ1cnRoZXIgZnJlZXppbmdcclxuXHJcbiAgICAvLyBwaHlzaWNzIGNvbnN0YW50c1xyXG4gICAgR1JBVklUWV9TUEVFRDogbnVtYmVyID0gMC4wNDsgLy8gaW4gdW5pdHMgcGVyIHNlY29uZCB0aWNrLCBwb3NpdGl2ZSBtZWFucyBkb3dud2FyZCBncmF2aXR5LCBuZWdhdGl2ZSBtZWFucyB1cHdhcmQgZ3Jhdml0eVxyXG4gICAgRFJBR19DT0VGRklDSUVOVDogbnVtYmVyID0gMC4yMTsgLy8gYXJiaXRyYXJ5IG51bWJlciwgMCBtZWFucyBubyBkcmFnXHJcblxyXG4gICAgLy8gQ0hBUkFDVEVSIFNIT1VMRCBCRSBST1VHSExZIDEyIFBJWEVMUyBCWSAyMCBQSVhFTFNcclxuXHJcbiAgICBob3RCYXI6IEl0ZW1TdGFja1tdID0gbmV3IEFycmF5KDkpO1xyXG4gICAgc2VsZWN0ZWRTbG90ID0gMDtcclxuICAgIHBpY2tlZFVwU2xvdCA9IC0xO1xyXG5cclxuICAgIHdvcmxkTW91c2VYID0gMDsgLy8gdGhlIG1vdXNlIHBvc2l0aW9uIGluIHdvcmxkIGNvb3JkaW5hdGVzXHJcbiAgICB3b3JsZE1vdXNlWSA9IDA7IC8vIHRoZSBtb3VzZSBwb3NpdGlvbiBpbiB3b3JsZCBjb29yZGluYXRlc1xyXG4gICAgbW91c2VPbiA9IHRydWU7IC8vIGlzIHRoZSBtb3VzZSBvbiB0aGUgd2luZG93P1xyXG5cclxuICAgIGtleXM6IGJvb2xlYW5bXSA9IFtdO1xyXG5cclxuICAgIC8vIHRoZSBrZXljb2RlIGZvciB0aGUga2V5IHRoYXQgZG9lcyB0aGUgYWN0aW9uXHJcbiAgICBjb250cm9sczogQ29udHJvbFtdID0gW1xyXG4gICAgICAgIG5ldyBDb250cm9sKFwiV2FsayBSaWdodFwiLCB0cnVlLCA2OCwgKCk9PntcclxuICAgICAgICAgICAgaWYodGhpcy5jdXJyZW50VWkhPT11bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMud29ybGQucGxheWVyLnJpZ2h0QnV0dG9uID0gdHJ1ZTtcclxuICAgICAgICB9LCAoKT0+e1xyXG4gICAgICAgICAgICBpZih0aGlzLmN1cnJlbnRVaSE9PXVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy53b3JsZC5wbGF5ZXIucmlnaHRCdXR0b24gPSBmYWxzZTtcclxuICAgICAgICB9KSwvLyByaWdodFxyXG4gICAgICAgIG5ldyBDb250cm9sKFwiV2FsayBMZWZ0XCIsIHRydWUsIDY1LCAoKT0+e1xyXG4gICAgICAgICAgICBpZih0aGlzLmN1cnJlbnRVaSE9PXVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy53b3JsZC5wbGF5ZXIubGVmdEJ1dHRvbiA9IHRydWU7XHJcbiAgICAgICAgfSwgKCk9PntcclxuICAgICAgICAgICAgaWYodGhpcy5jdXJyZW50VWkhPT11bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMud29ybGQucGxheWVyLmxlZnRCdXR0b24gPSBmYWxzZTtcclxuICAgICAgICB9KSwvLyBsZWZ0XHJcbiAgICAgICAgbmV3IENvbnRyb2woXCJKdW1wXCIsIHRydWUsIDg3LCAoKT0+e1xyXG4gICAgICAgICAgICBpZih0aGlzLmN1cnJlbnRVaSE9PXVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy53b3JsZC5wbGF5ZXIuanVtcEJ1dHRvbiA9IHRydWU7XHJcbiAgICAgICAgfSwgKCk9PntcclxuICAgICAgICAgICAgaWYodGhpcy5jdXJyZW50VWkhPT11bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMud29ybGQucGxheWVyLmp1bXBCdXR0b24gPSBmYWxzZTtcclxuICAgICAgICB9KSwvLyBqdW1wXHJcbiAgICAgICAgbmV3IENvbnRyb2woXCJQYXVzZVwiLCB0cnVlLCAyNywgKCk9PntcclxuICAgICAgICAgICAgLy9pZiBpbnZlbnRvcnkgb3BlbntcclxuICAgICAgICAgICAgLy9jbG9zZSBpbnZlbnRvcnlcclxuICAgICAgICAgICAgLy9yZXR1cm47fVxyXG4gICAgICAgICAgICBpZih0aGlzLmN1cnJlbnRVaT09PXVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFVpID0gbmV3IFBhdXNlTWVudShGb250cy50aXRsZSk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFVpID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIH0pLC8vIHNldHRpbmdzXHJcbiAgICAgICAgbmV3IENvbnRyb2woXCJJbnZlbnRvcnlcIiwgdHJ1ZSwgNjksICgpPT57XHJcbiAgICAgICAgICAgIC8vaWYgdWkgb3BlbiByZXR1cm47XHJcbiAgICAgICAgICAgIC8vaWYgaW52ZW50b3J5IGNsb3NlZCBvcGVuIGludmVudG9yeVxyXG4gICAgICAgICAgICAvL2Vsc2UgY2xvc2UgaW52ZW50b3J5XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaW52ZW50b3J5IGhhcyBub3QgYmVlbiBpbXBsZW1lbnRlZCB5ZXRcIik7XHJcbiAgICAgICAgfSksLy8gaW52ZW50b3J5XHJcbiAgICAgICAgbmV3IENvbnRyb2woXCJIb3RiYXIgMVwiLCB0cnVlLCA0OSwgKCk9PntcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZFNsb3QgPSAwO1xyXG4gICAgICAgIH0pLC8vIGhvdCBiYXIgMVxyXG4gICAgICAgIG5ldyBDb250cm9sKFwiSG90YmFyIDJcIiwgdHJ1ZSwgNDksICgpPT57XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRTbG90ID0gMTtcclxuICAgICAgICB9KSwvLyBob3QgYmFyIDJcclxuICAgICAgICBuZXcgQ29udHJvbChcIkhvdGJhciAzXCIsIHRydWUsIDQ5LCAoKT0+e1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkU2xvdCA9IDI7XHJcbiAgICAgICAgfSksLy8gaG90IGJhciAzXHJcbiAgICAgICAgbmV3IENvbnRyb2woXCJIb3RiYXIgNFwiLCB0cnVlLCA0OSwgKCk9PntcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZFNsb3QgPSAzO1xyXG4gICAgICAgIH0pLC8vIGhvdCBiYXIgNFxyXG4gICAgICAgIG5ldyBDb250cm9sKFwiSG90YmFyIDVcIiwgdHJ1ZSwgNDksICgpPT57XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRTbG90ID0gNDtcclxuICAgICAgICB9KSwvLyBob3QgYmFyIDVcclxuICAgICAgICBuZXcgQ29udHJvbChcIkhvdGJhciA2XCIsIHRydWUsIDQ5LCAoKT0+e1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkU2xvdCA9IDU7XHJcbiAgICAgICAgfSksLy8gaG90IGJhciA2XHJcbiAgICAgICAgbmV3IENvbnRyb2woXCJIb3RiYXIgN1wiLCB0cnVlLCA0OSwgKCk9PntcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZFNsb3QgPSA2O1xyXG4gICAgICAgIH0pLC8vIGhvdCBiYXIgN1xyXG4gICAgICAgIG5ldyBDb250cm9sKFwiSG90YmFyIDhcIiwgdHJ1ZSwgNDksICgpPT57XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRTbG90ID0gNztcclxuICAgICAgICB9KSwvLyBob3QgYmFyIDhcclxuICAgICAgICBuZXcgQ29udHJvbChcIkhvdGJhciA5XCIsIHRydWUsIDQ5LCAoKT0+e1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkU2xvdCA9IDg7XHJcbiAgICAgICAgfSksLy8gaG90IGJhciA5XHJcbiAgICBdO1xyXG5cclxuICAgIGNhbnZhczogcDUuUmVuZGVyZXI7Ly90aGUgY2FudmFzIGZvciB0aGUgZ2FtZVxyXG4gICAgc2t5TGF5ZXI6IHA1LkdyYXBoaWNzOy8vYSBwNS5HcmFwaGljcyBvYmplY3QgdGhhdCB0aGUgc2hhZGVyIGlzIGRyYXduIG9udG8uICB0aGlzIGlzbid0IHRoZSBiZXN0IHdheSB0byBkbyB0aGlzLCBidXQgdGhlIG1haW4gZ2FtZSBjYW52YXMgaXNuJ3QgV0VCR0wsIGFuZCBpdCdzIHRvbyBtdWNoIHdvcmsgdG8gY2hhbmdlIHRoYXRcclxuICAgIHNreVNoYWRlcjogcDUuU2hhZGVyOy8vdGhlIHNoYWRlciB0aGF0IGRyYXdzIHRoZSBza3kgKHRoZSBwYXRoIGZvciB0aGlzIGlzIGluIHRoZSBwdWJsaWMgZm9sZGVyKVxyXG5cclxuICAgIHdvcmxkOiBXb3JsZDtcclxuXHJcbiAgICBjdXJyZW50VWk6IFVpU2NyZWVuIHwgdW5kZWZpbmVkO1xyXG5cclxuICAgIGNvbm5lY3Rpb246IFNvY2tldDxTZXJ2ZXJFdmVudHMsIENsaWVudEV2ZW50cz5cclxuXHJcbiAgICBuZXRNYW5hZ2VyOiBOZXRNYW5hZ2VyXHJcblxyXG4gICAgLy9jaGFuZ2VhYmxlIG9wdGlvbnMgZnJvbSBtZW51c1xyXG4gICAgc2VydmVyVmlzaWJpbGl0eTogc3RyaW5nO1xyXG4gICAgd29ybGRCdW1waW5lc3M6IG51bWJlcjtcclxuICAgIHNreU1vZDogbnVtYmVyO1xyXG4gICAgc2t5VG9nZ2xlOiBib29sZWFuO1xyXG4gICAgcGFydGljbGVNdWx0aXBsaWVyOiBudW1iZXI7XHJcblxyXG4gICAgcGFydGljbGVzOiAoQ29sb3JQYXJ0aWNsZS8qfEZvb3RzdGVwUGFydGljbGUqLylbXTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihjb25uZWN0aW9uOiBTb2NrZXQpIHtcclxuICAgICAgICBzdXBlcigoKSA9PiB7fSk7IC8vIFRvIGNyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiBwNSBpdCB3aWxsIGNhbGwgYmFjayB3aXRoIHRoZSBpbnN0YW5jZS4gV2UgZG9uJ3QgbmVlZCB0aGlzIHNpbmNlIHdlIGFyZSBleHRlbmRpbmcgdGhlIGNsYXNzXHJcbiAgICAgICAgdGhpcy5jb25uZWN0aW9uID0gY29ubmVjdGlvbjtcclxuXHJcbiAgICAgICAgLy8gSW5pdGlhbGlzZSB0aGUgbmV0d29yayBtYW5hZ2VyXHJcbiAgICAgICAgdGhpcy5uZXRNYW5hZ2VyID0gbmV3IE5ldE1hbmFnZXIodGhpcylcclxuICAgIH1cclxuXHJcbiAgICBwcmVsb2FkKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdMb2FkaW5nIGFzc2V0cycpO1xyXG4gICAgICAgIGxvYWRBc3NldHModGhpcywgVWlBc3NldHMsIEl0ZW1zQXNzZXRzLCBXb3JsZEFzc2V0cywgRm9udHMsIEF1ZGlvQXNzZXRzLCBQbGF5ZXJBbmltYXRpb25zKTtcclxuICAgICAgICBjb25zb2xlLmxvZygnQXNzZXQgbG9hZGluZyBjb21wbGV0ZWQnKTtcclxuICAgICAgICB0aGlzLnNreVNoYWRlciA9IHRoaXMubG9hZFNoYWRlcihcImFzc2V0cy9zaGFkZXJzL2Jhc2ljLnZlcnRcIiwgXCJhc3NldHMvc2hhZGVycy9za3kuZnJhZ1wiKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXR1cCgpIHtcclxuICAgICAgICAvLyBtYWtlIGEgY2FudmFzIHRoYXQgZmlsbHMgdGhlIHdob2xlIHNjcmVlbiAoYSBjYW52YXMgaXMgd2hhdCBpcyBkcmF3biB0byBpbiBwNS5qcywgYXMgd2VsbCBhcyBsb3RzIG9mIG90aGVyIEpTIHJlbmRlcmluZyBsaWJyYXJpZXMpXHJcbiAgICAgICAgdGhpcy5jYW52YXMgPSB0aGlzLmNyZWF0ZUNhbnZhcyh0aGlzLndpbmRvd1dpZHRoLCB0aGlzLndpbmRvd0hlaWdodCk7XHJcbiAgICAgICAgdGhpcy5jYW52YXMubW91c2VPdXQodGhpcy5tb3VzZUV4aXRlZCk7XHJcbiAgICAgICAgdGhpcy5jYW52YXMubW91c2VPdmVyKHRoaXMubW91c2VFbnRlcmVkKTtcclxuXHJcbiAgICAgICAgdGhpcy5za3lMYXllciA9IHRoaXMuY3JlYXRlR3JhcGhpY3ModGhpcy53aWR0aCwgdGhpcy5oZWlnaHQsIFwid2ViZ2xcIik7XHJcblxyXG4gICAgICAgIHRoaXMuY3VycmVudFVpID0gbmV3IE1haW5NZW51KEZvbnRzLnRpdGxlKTtcclxuXHJcbiAgICAgICAgLy8gVGlja1xyXG4gICAgICAgIHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMud29ybGQgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLndvcmxkLnRpY2sodGhpcyk7XHJcbiAgICAgICAgfSwgMTAwMCAvIHRoaXMubmV0TWFuYWdlci5wbGF5ZXJUaWNrUmF0ZSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5jb25uZWN0aW9uLmVtaXQoXHJcbiAgICAgICAgICAgICdqb2luJyxcclxuICAgICAgICAgICAgJ2U0MDIyZDQwM2RjYzZkMTlkNmE2OGJhM2FiZmQwYTYwJyxcclxuICAgICAgICAgICAgJ3BsYXllcicgKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDAwKVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIC8vIGdvIGZvciBhIHNjYWxlIG9mIDw2NCB0aWxlcyB3aWRlIHNjcmVlblxyXG4gICAgICAgIHRoaXMud2luZG93UmVzaXplZCgpO1xyXG5cclxuICAgICAgICAvLyByZW1vdmUgdGV4dHVyZSBpbnRlcnBvbGF0aW9uXHJcbiAgICAgICAgdGhpcy5ub1Ntb290aCgpO1xyXG5cclxuICAgICAgICAvLyB0aGUgaGlnaGVzdCBrZXljb2RlIGlzIDI1NSwgd2hpY2ggaXMgXCJUb2dnbGUgVG91Y2hwYWRcIiwgYWNjb3JkaW5nIHRvIGtleWNvZGUuaW5mb1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMjU1OyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5rZXlzLnB1c2goZmFsc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gc2V0IHRoZSBmcmFtZXJhdGUgZ29hbCB0byBhcyBoaWdoIGFzIHBvc3NpYmxlICh0aGlzIHdpbGwgZW5kIHVwIGNhcHBpbmcgdG8geW91ciBtb25pdG9yJ3MgcmVmcmVzaCByYXRlIHdpdGggdnN5bmMuKVxyXG4gICAgICAgIHRoaXMuZnJhbWVSYXRlKEluZmluaXR5KTtcclxuICAgICAgICBBdWRpb0Fzc2V0cy5hbWJpZW50LndpbnRlcjEucGxheVNvdW5kKCk7XHJcbiAgICAgICAgdGhpcy5wYXJ0aWNsZU11bHRpcGxpZXIgPSAxO1xyXG4gICAgICAgIHRoaXMuc2t5VG9nZ2xlID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnNreU1vZCA9IDI7XHJcbiAgICAgICAgdGhpcy5wYXJ0aWNsZXMgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICBkcmF3KCkge1xyXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGk8NDAqdGhpcy5wYXJ0aWNsZU11bHRpcGxpZXI7IGkrKykge1xyXG4gICAgICAgICAgICAvL3RoaXMucGFydGljbGVzLnB1c2gobmV3IENvbG9yUGFydGljbGUoXCIjZWI1ODM0XCIsIDEvNCwgMTAsIHRoaXMud29ybGRNb3VzZVgrTWF0aC5yYW5kb20oKSwgdGhpcy53b3JsZE1vdXNlWStNYXRoLnJhbmRvbSgpLCBNYXRoLnJhbmRvbSgpLTAuNSwgTWF0aC5yYW5kb20oKS80LTAuNSwgZmFsc2UpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuZnJhbWVDb3VudD09PTIpIHtcclxuICAgICAgICAgICAgdGhpcy5za3lTaGFkZXIuc2V0VW5pZm9ybShcInNjcmVlbkRpbWVuc2lvbnNcIiwgW3RoaXMud2lkdGgvdGhpcy51cHNjYWxlU2l6ZSwgdGhpcy5oZWlnaHQvdGhpcy51cHNjYWxlU2l6ZV0pO1xyXG4gICAgICAgICAgICB0aGlzLnNreVNoYWRlci5zZXRVbmlmb3JtKFwic2t5SW1hZ2VcIiwgV29ybGRBc3NldHMuc2hhZGVyUmVzb3VyY2VzLnNreUltYWdlLmltYWdlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gZG8gdGhlIHRpY2sgY2FsY3VsYXRpb25zXHJcbiAgICAgICAgdGhpcy5kb1RpY2tzKCk7XHJcblxyXG5cclxuICAgICAgICAvLyB1cGRhdGUgbW91c2UgcG9zaXRpb25cclxuICAgICAgICB0aGlzLnVwZGF0ZU1vdXNlKCk7XHJcblxyXG4gICAgICAgIC8vIHVwZGF0ZSB0aGUgY2FtZXJhJ3MgaW50ZXJwb2xhdGlvblxyXG4gICAgICAgIHRoaXMubW92ZUNhbWVyYSgpO1xyXG5cclxuICAgICAgICAvLyB3aXBlIHRoZSBzY3JlZW4gd2l0aCBhIGhhcHB5IGxpdHRsZSBsYXllciBvZiBsaWdodCBibHVlXHJcbiAgICAgICAgdGhpcy5za3lTaGFkZXIuc2V0VW5pZm9ybShcIm9mZnNldENvb3Jkc1wiLCBbdGhpcy5pbnRlcnBvbGF0ZWRDYW1YLCB0aGlzLmludGVycG9sYXRlZENhbVldKTtcclxuXHQgICAgdGhpcy5za3lTaGFkZXIuc2V0VW5pZm9ybShcIm1pbGxpc1wiLCB0aGlzLm1pbGxpcygpKTtcclxuICAgICAgICB0aGlzLnNreUxheWVyLnNoYWRlcih0aGlzLnNreVNoYWRlcik7XHJcbiAgICAgICAgLy8gdGhpcy5maWxsKDI1NSwgMCwgMCk7XHJcbiAgICAgICAgdGhpcy5za3lMYXllci5yZWN0KDAsIDAsIHRoaXMuc2t5TGF5ZXIud2lkdGgsIHRoaXMuc2t5TGF5ZXIuaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgdGhpcy5pbWFnZSh0aGlzLnNreUxheWVyLCAwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLndvcmxkICE9PSB1bmRlZmluZWQpIHRoaXMud29ybGQucmVuZGVyKHRoaXMsIHRoaXMudXBzY2FsZVNpemUpO1xyXG5cclxuICAgICAgICAvLyByZW5kZXIgdGhlIHBsYXllciwgYWxsIGl0ZW1zLCBldGMuICBCYXNpY2FsbHkgYW55IHBoeXNpY3NSZWN0IG9yIHBhcnRpY2xlXHJcbiAgICAgICAgdGhpcy5yZW5kZXJFbnRpdGllcygpO1xyXG5cclxuICAgICAgICAvL2RlbGV0ZSBhbnkgcGFydGljbGVzIHRoYXQgaGF2ZSBnb3R0ZW4gdG9vIG9sZFxyXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGk8dGhpcy5wYXJ0aWNsZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucGFydGljbGVzW2ldLmFnZT50aGlzLnBhcnRpY2xlc1tpXS5saWZlc3Bhbikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wYXJ0aWNsZXMuc3BsaWNlKGksIDEpXHJcbiAgICAgICAgICAgICAgICBpLS07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vbm8gb3V0bGluZSBvbiBwYXJ0aWNsZXNcclxuICAgICAgICB0aGlzLm5vU3Ryb2tlKCk7XHJcbiAgICAgICAgLy9kcmF3IGFsbCBvZiB0aGUgcGFydGljbGVzXHJcbiAgICAgICAgZm9yKGxldCBwYXJ0aWNsZSBvZiB0aGlzLnBhcnRpY2xlcykge1xyXG4gICAgICAgICAgICBwYXJ0aWNsZS5yZW5kZXIodGhpcywgdGhpcy51cHNjYWxlU2l6ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnRpbnQoMjU1LCAxMDApO1xyXG4gICAgICAgIFVpQXNzZXRzLnZpZ25ldHRlLnJlbmRlcih0aGlzLCAwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XHJcbiAgICAgICAgdGhpcy5ub1RpbnQoKTtcclxuXHJcbiAgICAgICAgLy8gZHJhdyB0aGUgaG90IGJhclxyXG4gICAgICAgIHRoaXMubm9TdHJva2UoKTtcclxuICAgICAgICB0aGlzLnRleHRBbGlnbih0aGlzLlJJR0hULCB0aGlzLkJPVFRPTSk7XHJcbiAgICAgICAgdGhpcy50ZXh0U2l6ZSg1ICogdGhpcy51cHNjYWxlU2l6ZSk7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmhvdEJhci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zZWxlY3RlZFNsb3QgPT09IGkpIHtcclxuICAgICAgICAgICAgICAgIFVpQXNzZXRzLnVpX3Nsb3Rfc2VsZWN0ZWQucmVuZGVyKFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMsXHJcbiAgICAgICAgICAgICAgICAgICAgMiAqIHRoaXMudXBzY2FsZVNpemUgKyAxNiAqIGkgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICAgICAgICAgIDIgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICAgICAgICAgIDE2ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICAxNiAqIHRoaXMudXBzY2FsZVNpemVcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBVaUFzc2V0cy51aV9zbG90LnJlbmRlcihcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLFxyXG4gICAgICAgICAgICAgICAgICAgIDIgKiB0aGlzLnVwc2NhbGVTaXplICsgMTYgKiBpICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICAyICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICAxNiAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgICAgICAgICAgMTYgKiB0aGlzLnVwc2NhbGVTaXplXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5ob3RCYXJbaV0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5maWxsKDApO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucGlja2VkVXBTbG90ID09PSBpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50aW50KDI1NSwgMTI3KTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZpbGwoMCwgMTI3KTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmhvdEJhcltpXS50ZXh0dXJlLnJlbmRlcihcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLFxyXG4gICAgICAgICAgICAgICAgICAgIDYgKiB0aGlzLnVwc2NhbGVTaXplICsgMTYgKiBpICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICA2ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICA4ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICA4ICogdGhpcy51cHNjYWxlU2l6ZVxyXG4gICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnRleHQoXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ob3RCYXJbaV0uc3RhY2tTaXplLFxyXG4gICAgICAgICAgICAgICAgICAgIDE2ICogdGhpcy51cHNjYWxlU2l6ZSArIDE2ICogaSAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgICAgICAgICAgMTYgKiB0aGlzLnVwc2NhbGVTaXplXHJcbiAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMubm9UaW50KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGRyYXcgdGhlIGN1cnNvclxyXG4gICAgICAgIHRoaXMuZHJhd0N1cnNvcigpO1xyXG5cclxuXHJcbiAgICAgICAgaWYodGhpcy5jdXJyZW50VWkgIT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50VWkucmVuZGVyKHRoaXMsIHRoaXMudXBzY2FsZVNpemUpO1xyXG5cclxuICAgICAgICAvLyBjb25zb2xlLnRpbWVFbmQoXCJmcmFtZVwiKTtcclxuICAgIH1cclxuXHJcbiAgICB3aW5kb3dSZXNpemVkKCkge1xyXG4gICAgICAgIHRoaXMucmVzaXplQ2FudmFzKHRoaXMud2luZG93V2lkdGgsIHRoaXMud2luZG93SGVpZ2h0KTtcclxuICAgICAgICB0aGlzLnNreUxheWVyLnJlc2l6ZUNhbnZhcyh0aGlzLndpbmRvd1dpZHRoLCB0aGlzLndpbmRvd0hlaWdodCk7XHJcbiAgICAgICAgdGhpcy5za3lTaGFkZXIuc2V0VW5pZm9ybShcInNjcmVlbkRpbWVuc2lvbnNcIiwgW3RoaXMud2luZG93V2lkdGgvdGhpcy51cHNjYWxlU2l6ZSoyLCB0aGlzLndpbmRvd0hlaWdodC90aGlzLnVwc2NhbGVTaXplKjJdKTtcclxuXHJcbiAgICAgICAgLy8gZ28gZm9yIGEgc2NhbGUgb2YgPDQ4IHRpbGVzIHNjcmVlblxyXG4gICAgICAgIHRoaXMudXBzY2FsZVNpemUgPSBNYXRoLm1pbihcclxuICAgICAgICAgICAgTWF0aC5jZWlsKHRoaXMud2luZG93V2lkdGggLyA0OCAvIHRoaXMuVElMRV9XSURUSCksXHJcbiAgICAgICAgICAgIE1hdGguY2VpbCh0aGlzLndpbmRvd0hlaWdodCAvIDQ4IC8gdGhpcy5USUxFX0hFSUdIVClcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICB0aGlzLmN1cnJlbnRVaS53aW5kb3dVcGRhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBrZXlQcmVzc2VkKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5rZXlzW3RoaXMua2V5Q29kZV0gPSB0cnVlO1xyXG4gICAgICAgIGZvcihsZXQgY29udHJvbCBvZiB0aGlzLmNvbnRyb2xzKSB7XHJcbiAgICAgICAgICAgIGlmKGNvbnRyb2wua2V5Ym9hcmQgJiYgY29udHJvbC5rZXlDb2RlPT09ZXZlbnQua2V5Q29kZSkvL2V2ZW50LmtleUNvZGUgaXMgZGVwcmVjYXRlZCBidXQgaSBkb24ndCBjYXJlXHJcbiAgICAgICAgICAgICAgICBjb250cm9sLm9uUHJlc3NlZCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBrZXlSZWxlYXNlZChldmVudDogS2V5Ym9hcmRFdmVudCkge1xyXG4gICAgICAgIHRoaXMua2V5c1t0aGlzLmtleUNvZGVdID0gZmFsc2U7XHJcbiAgICAgICAgZm9yKGxldCBjb250cm9sIG9mIHRoaXMuY29udHJvbHMpIHtcclxuICAgICAgICAgICAgaWYoY29udHJvbC5rZXlib2FyZCAmJiBjb250cm9sLmtleUNvZGU9PT1ldmVudC5rZXlDb2RlKS8vZXZlbnQua2V5Q29kZSBpcyBkZXByZWNhdGVkIGJ1dCBpIGRvbid0IGNhcmVcclxuICAgICAgICAgICAgICAgIGNvbnRyb2wub25SZWxlYXNlZCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyB3aGVuIGl0J3MgZHJhZ2dlZCB1cGRhdGUgdGhlIHNsaWRlcnNcclxuICAgIG1vdXNlRHJhZ2dlZCgpIHtcclxuICAgICAgICBpZih0aGlzLmN1cnJlbnRVaSAhPT0gdW5kZWZpbmVkICYmIHRoaXMuY3VycmVudFVpLnNsaWRlcnMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBmb3IoY29uc3QgaSBvZiB0aGlzLmN1cnJlbnRVaS5zbGlkZXJzKSB7XHJcbiAgICAgICAgICAgICAgICBpLnVwZGF0ZVNsaWRlclBvc2l0aW9uKHRoaXMubW91c2VYKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBtb3VzZU1vdmVkKCkge1xyXG4gICAgICAgIGlmKHRoaXMuY3VycmVudFVpICE9PSB1bmRlZmluZWQgJiYgdGhpcy5jdXJyZW50VWkuYnV0dG9ucyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGZvcihjb25zdCBpIG9mIHRoaXMuY3VycmVudFVpLmJ1dHRvbnMpIHtcclxuICAgICAgICAgICAgICAgIGkudXBkYXRlTW91c2VPdmVyKHRoaXMubW91c2VYLCB0aGlzLm1vdXNlWSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbW91c2VQcmVzc2VkKGU6IE1vdXNlRXZlbnQpIHtcclxuICAgICAgICAvLyBpbWFnZSh1aVNsb3RJbWFnZSwgMip1cHNjYWxlU2l6ZSsxNippKnVwc2NhbGVTaXplLCAyKnVwc2NhbGVTaXplLCAxNip1cHNjYWxlU2l6ZSwgMTYqdXBzY2FsZVNpemUpO1xyXG4gICAgICAgIGlmKHRoaXMuY3VycmVudFVpICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50VWkubW91c2VQcmVzc2VkKGUuYnV0dG9uKTtcclxuICAgICAgICAgICAgcmV0dXJuOy8vIGFzamdzYWRramZnSUlTVVNVRVVFXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChcclxuICAgICAgICAgICAgdGhpcy5tb3VzZVggPiAyICogdGhpcy51cHNjYWxlU2l6ZSAmJlxyXG4gICAgICAgICAgICB0aGlzLm1vdXNlWCA8XHJcbiAgICAgICAgICAgICAgICAyICogdGhpcy51cHNjYWxlU2l6ZSArXHJcbiAgICAgICAgICAgICAgICAgICAgMTYgKiB0aGlzLnVwc2NhbGVTaXplICogdGhpcy5ob3RCYXIubGVuZ3RoICYmXHJcbiAgICAgICAgICAgIHRoaXMubW91c2VZID4gMiAqIHRoaXMudXBzY2FsZVNpemUgJiZcclxuICAgICAgICAgICAgdGhpcy5tb3VzZVkgPCAxOCAqIHRoaXMudXBzY2FsZVNpemVcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgY29uc3QgY2xpY2tlZFNsb3Q6IG51bWJlciA9IE1hdGguZmxvb3IoXHJcbiAgICAgICAgICAgICAgICAodGhpcy5tb3VzZVggLSAyICogdGhpcy51cHNjYWxlU2l6ZSkgLyAxNiAvIHRoaXMudXBzY2FsZVNpemVcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnBpY2tlZFVwU2xvdCA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmhvdEJhcltjbGlja2VkU2xvdF0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGlja2VkVXBTbG90ID0gY2xpY2tlZFNsb3Q7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBTd2FwIGNsaWNrZWQgc2xvdCB3aXRoIHRoZSBwaWNrZWQgc2xvdFxyXG4gICAgICAgICAgICAgICAgW3RoaXMuaG90QmFyW3RoaXMucGlja2VkVXBTbG90XSwgdGhpcy5ob3RCYXJbY2xpY2tlZFNsb3RdXSA9IFtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhvdEJhcltjbGlja2VkU2xvdF0sXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ob3RCYXJbdGhpcy5waWNrZWRVcFNsb3RdLFxyXG4gICAgICAgICAgICAgICAgXTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBTZXQgdGhlIHBpY2tlZCB1cCBzbG90IHRvIG5vdGhpbmdcclxuICAgICAgICAgICAgICAgIHRoaXMucGlja2VkVXBTbG90ID0gLTE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBJZiB0aGUgdGlsZXMgaXMgYWlyXHJcbiAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgIHRoaXMud29ybGQud29ybGRUaWxlc1tcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLndvcmxkLndpZHRoICogdGhpcy53b3JsZE1vdXNlWSArIHRoaXMud29ybGRNb3VzZVhcclxuICAgICAgICAgICAgICAgIF0gPT09IDBcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgZm9yKGxldCBpID0gMDsgaTwxMCp0aGlzLnBhcnRpY2xlTXVsdGlwbGllcjsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgaWR4OiBudW1iZXIgPSB0aGlzLndvcmxkLndpZHRoICogdGhpcy53b3JsZE1vdXNlWSArIHRoaXMud29ybGRNb3VzZVg7XHJcbiAgICAgICAgICAgICAgICBsZXQgdGlsZTogVGlsZVR5cGUgPSB0aGlzLndvcmxkLndvcmxkVGlsZXNbaWR4XTtcclxuICAgICAgICAgICAgICAgIHRoaXMucGFydGljbGVzLnB1c2gobmV3IENvbG9yUGFydGljbGUoV29ybGRUaWxlc1t0aWxlXS5jb2xvciwgMS80Kk1hdGgucmFuZG9tKCksIDE1LCB0aGlzLndvcmxkTW91c2VYKzAuNSwgdGhpcy53b3JsZE1vdXNlWSswLjUsIChNYXRoLnJhbmRvbSgpLTAuNSkvNSwgLU1hdGgucmFuZG9tKCkvNSwgdHJ1ZSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuY29ubmVjdGlvbi5lbWl0KFxyXG4gICAgICAgICAgICAgICAgJ3dvcmxkQnJlYWtTdGFydCcsXHJcbiAgICAgICAgICAgICAgICB0aGlzLndvcmxkLndpZHRoICogdGhpcy53b3JsZE1vdXNlWSArIHRoaXMud29ybGRNb3VzZVhcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgdGhpcy5jb25uZWN0aW9uLmVtaXQoJ3dvcmxkQnJlYWtGaW5pc2gnKTtcclxuICAgICAgICAgICAgdGhpcy5zY3JlZW5zaGFrZUFtb3VudCA9IDAuNTtcclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgY29uc3QgdGlsZXM6IFRpbGUgPVxyXG4gICAgICAgICAgICAgICAgV29ybGRUaWxlc1tcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLndvcmxkLndvcmxkVGlsZXNbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuV09STERfV0lEVEggKiB0aGlzLndvcmxkTW91c2VZICsgdGhpcy53b3JsZE1vdXNlWFxyXG4gICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgIF07XHJcblxyXG4gICAgICAgICAgICBpZiAodGlsZXMgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRpbGVzLml0ZW1Ecm9wICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIC8vIERlZmF1bHQgZHJvcCBxdWFudGl0eVxyXG4gICAgICAgICAgICAgICAgbGV0IHF1YW50aXR5OiBudW1iZXIgPSAxO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFVwZGF0ZSB0aGUgcXVhbnRpdHkgYmFzZWQgb25cclxuICAgICAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgICAgICB0aWxlcy5pdGVtRHJvcE1heCAhPT0gdW5kZWZpbmVkICYmXHJcbiAgICAgICAgICAgICAgICAgICAgdGlsZXMuaXRlbURyb3BNaW4gIT09IHVuZGVmaW5lZFxyXG4gICAgICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcXVhbnRpdHkgPSBNYXRoLnJvdW5kKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBNYXRoLnJhbmRvbSgpICogKHRpbGVzLml0ZW1Ecm9wTWF4IC0gdGlsZXMuaXRlbURyb3BNaW4pICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpbGVzLml0ZW1Ecm9wTWluXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGlsZXMuaXRlbURyb3BNYXggIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHF1YW50aXR5ID0gdGlsZXMuaXRlbURyb3BNYXg7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5kcm9wSXRlbVN0YWNrKFxyXG4gICAgICAgICAgICAgICAgICAgIG5ldyBJdGVtU3RhY2sodGlsZXMuaXRlbURyb3AsIHF1YW50aXR5KSxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLndvcmxkTW91c2VYLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMud29ybGRNb3VzZVlcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcblxyXG5cclxuICAgICAgICAgICAgKi9cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbW91c2VSZWxlYXNlZCgpIHtcclxuICAgICAgICBpZih0aGlzLmN1cnJlbnRVaSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFVpLm1vdXNlUmVsZWFzZWQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgcmVsZWFzZWRTbG90OiBudW1iZXIgPSBNYXRoLmZsb29yKFxyXG4gICAgICAgICAgICAodGhpcy5tb3VzZVggLSAyICogdGhpcy51cHNjYWxlU2l6ZSkgLyAxNiAvIHRoaXMudXBzY2FsZVNpemVcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5waWNrZWRVcFNsb3QgIT09IC0xKSB7XHJcbiAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgIHRoaXMubW91c2VYID4gMiAqIHRoaXMudXBzY2FsZVNpemUgJiZcclxuICAgICAgICAgICAgICAgIHRoaXMubW91c2VYIDxcclxuICAgICAgICAgICAgICAgICAgICAyICogdGhpcy51cHNjYWxlU2l6ZSArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDE2ICogdGhpcy51cHNjYWxlU2l6ZSAqIHRoaXMuaG90QmFyLmxlbmd0aCAmJlxyXG4gICAgICAgICAgICAgICAgdGhpcy5tb3VzZVkgPiAyICogdGhpcy51cHNjYWxlU2l6ZSAmJlxyXG4gICAgICAgICAgICAgICAgdGhpcy5tb3VzZVkgPCAxOCAqIHRoaXMudXBzY2FsZVNpemVcclxuICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBNYWtlIHN1cmUgdGhhdCB0aGUgc2xvdCB0aGF0IHRoZSBjdXJzb3Igd2FzIHJlbGVhc2VkIHdhcyBub3QgdGhlIHNsb3QgdGhhdCB3YXMgc2VsZWN0ZWRcclxuICAgICAgICAgICAgICAgIGlmIChyZWxlYXNlZFNsb3QgPT09IHRoaXMucGlja2VkVXBTbG90KSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gU3dhcCB0aGUgcGlja2VkIHVwIHNsb3Qgd2l0aCB0aGUgc2xvdCB0aGUgbW91c2Ugd2FzIHJlbGVhc2VkIG9uXHJcbiAgICAgICAgICAgICAgICBbdGhpcy5ob3RCYXJbdGhpcy5waWNrZWRVcFNsb3RdLCB0aGlzLmhvdEJhcltyZWxlYXNlZFNsb3RdXSA9IFtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhvdEJhcltyZWxlYXNlZFNsb3RdLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaG90QmFyW3RoaXMucGlja2VkVXBTbG90XSxcclxuICAgICAgICAgICAgICAgIF07XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5waWNrZWRVcFNsb3QgPSAtMTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaG90QmFyW3RoaXMucGlja2VkVXBTbG90XSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgIHRoaXMucGlja2VkVXBTbG90ID0gLTE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbW92ZUNhbWVyYSgpIHtcclxuICAgICAgICB0aGlzLmludGVycG9sYXRlZENhbVggPVxyXG4gICAgICAgICAgICB0aGlzLnBDYW1YICsgKHRoaXMuY2FtWCAtIHRoaXMucENhbVgpICogdGhpcy5hbW91bnRTaW5jZUxhc3RUaWNrICsgKHRoaXMubm9pc2UodGhpcy5taWxsaXMoKS8yMDApLTAuNSkqdGhpcy5zY3JlZW5zaGFrZUFtb3VudDtcclxuICAgICAgICB0aGlzLmludGVycG9sYXRlZENhbVkgPVxyXG4gICAgICAgICAgICB0aGlzLnBDYW1ZICsgKHRoaXMuY2FtWSAtIHRoaXMucENhbVkpICogdGhpcy5hbW91bnRTaW5jZUxhc3RUaWNrICsgKHRoaXMubm9pc2UoMCwgdGhpcy5taWxsaXMoKS8yMDApLTAuNSkqdGhpcy5zY3JlZW5zaGFrZUFtb3VudDtcclxuICAgIH1cclxuXHJcbiAgICBkb1RpY2tzKCkge1xyXG4gICAgICAgIC8vIGluY3JlYXNlIHRoZSB0aW1lIHNpbmNlIGEgdGljayBoYXMgaGFwcGVuZWQgYnkgZGVsdGFUaW1lLCB3aGljaCBpcyBhIGJ1aWx0LWluIHA1LmpzIHZhbHVlXHJcbiAgICAgICAgdGhpcy5tc1NpbmNlVGljayArPSB0aGlzLmRlbHRhVGltZTtcclxuXHJcbiAgICAgICAgLy8gZGVmaW5lIGEgdGVtcG9yYXJ5IHZhcmlhYmxlIGNhbGxlZCB0aWNrc1RoaXNGcmFtZSAtIHRoaXMgaXMgdXNlZCB0byBrZWVwIHRyYWNrIG9mIGhvdyBtYW55IHRpY2tzIGhhdmUgYmVlbiBjYWxjdWxhdGVkIHdpdGhpbiB0aGUgZHVyYXRpb24gb2YgdGhlIGN1cnJlbnQgZnJhbWUuICBBcyBsb25nIGFzIHRoaXMgdmFsdWUgaXMgbGVzcyB0aGFuIHRoZSBmb3JnaXZlbmVzc0NvdW50IHZhcmlhYmxlLCBpdCBjb250aW51ZXMgdG8gY2FsY3VsYXRlIHRpY2tzIGFzIG5lY2Vzc2FyeS5cclxuICAgICAgICBsZXQgdGlja3NUaGlzRnJhbWUgPSAwO1xyXG4gICAgICAgIHdoaWxlIChcclxuICAgICAgICAgICAgdGhpcy5tc1NpbmNlVGljayA+IHRoaXMubXNQZXJUaWNrICYmXHJcbiAgICAgICAgICAgIHRpY2tzVGhpc0ZyYW1lICE9PSB0aGlzLmZvcmdpdmVuZXNzQ291bnRcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgLy8gY29uc29sZS50aW1lKFwidGlja1wiKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMud29ybGQgIT09IHVuZGVmaW5lZCkgdGhpcy5kb1RpY2soKTtcclxuICAgICAgICAgICAgLy8gY29uc29sZS50aW1lRW5kKFwidGlja1wiKTtcclxuICAgICAgICAgICAgdGhpcy5tc1NpbmNlVGljayAtPSB0aGlzLm1zUGVyVGljaztcclxuICAgICAgICAgICAgdGlja3NUaGlzRnJhbWUrKztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRpY2tzVGhpc0ZyYW1lID09PSB0aGlzLmZvcmdpdmVuZXNzQ291bnQpIHtcclxuICAgICAgICAgICAgdGhpcy5tc1NpbmNlVGljayA9IDA7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcclxuICAgICAgICAgICAgICAgIFwibGFnIHNwaWtlIGRldGVjdGVkLCB0aWNrIGNhbGN1bGF0aW9ucyBjb3VsZG4ndCBrZWVwIHVwXCJcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5hbW91bnRTaW5jZUxhc3RUaWNrID0gdGhpcy5tc1NpbmNlVGljayAvIHRoaXMubXNQZXJUaWNrO1xyXG4gICAgfVxyXG5cclxuICAgIGRvVGljaygpIHtcclxuICAgICAgICBmb3IobGV0IHBhcnRpY2xlIG9mIHRoaXMucGFydGljbGVzKSB7XHJcbiAgICAgICAgICAgIHBhcnRpY2xlLnRpY2soKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy53b3JsZC5wbGF5ZXIgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgdGhpcy53b3JsZC5wbGF5ZXIua2V5Ym9hcmRJbnB1dCgpO1xyXG4gICAgICAgIHRoaXMud29ybGQucGxheWVyLmFwcGx5R3Jhdml0eUFuZERyYWcoKTtcclxuICAgICAgICB0aGlzLndvcmxkLnBsYXllci5hcHBseVZlbG9jaXR5QW5kQ29sbGlkZSgpO1xyXG5cclxuICAgICAgICB0aGlzLnBDYW1YID0gdGhpcy5jYW1YO1xyXG4gICAgICAgIHRoaXMucENhbVkgPSB0aGlzLmNhbVk7XHJcbiAgICAgICAgdGhpcy5kZXNpcmVkQ2FtWCA9XHJcbiAgICAgICAgICAgIHRoaXMud29ybGQucGxheWVyLnggK1xyXG4gICAgICAgICAgICB0aGlzLndvcmxkLnBsYXllci53aWR0aCAvIDIgLVxyXG4gICAgICAgICAgICB0aGlzLndpZHRoIC8gMiAvIHRoaXMuVElMRV9XSURUSCAvIHRoaXMudXBzY2FsZVNpemUgK1xyXG4gICAgICAgICAgICB0aGlzLndvcmxkLnBsYXllci54VmVsICogNDA7XHJcbiAgICAgICAgdGhpcy5kZXNpcmVkQ2FtWSA9XHJcbiAgICAgICAgICAgIHRoaXMud29ybGQucGxheWVyLnkgK1xyXG4gICAgICAgICAgICB0aGlzLndvcmxkLnBsYXllci5oZWlnaHQvMiAtXHJcbiAgICAgICAgICAgIHRoaXMuaGVpZ2h0IC8gMiAvIHRoaXMuVElMRV9IRUlHSFQgLyB0aGlzLnVwc2NhbGVTaXplICtcclxuICAgICAgICAgICAgdGhpcy53b3JsZC5wbGF5ZXIueVZlbCAqIDIwO1xyXG4gICAgICAgIHRoaXMuY2FtWCA9ICh0aGlzLmRlc2lyZWRDYW1YICsgdGhpcy5jYW1YICogMjQpIC8gMjU7XHJcbiAgICAgICAgdGhpcy5jYW1ZID0gKHRoaXMuZGVzaXJlZENhbVkgKyB0aGlzLmNhbVkgKiAyNCkgLyAyNTtcclxuXHJcbiAgICAgICAgdGhpcy5zY3JlZW5zaGFrZUFtb3VudCAqPSAwLjg7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNhbVggPCAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2FtWCA9IDA7XHJcbiAgICAgICAgfSBlbHNlIGlmIChcclxuICAgICAgICAgICAgdGhpcy5jYW1YID5cclxuICAgICAgICAgICAgdGhpcy53b3JsZFdpZHRoIC0gdGhpcy53aWR0aCAvIHRoaXMudXBzY2FsZVNpemUgLyB0aGlzLlRJTEVfV0lEVEhcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgdGhpcy5jYW1YID1cclxuICAgICAgICAgICAgICAgIHRoaXMud29ybGRXaWR0aCAtXHJcbiAgICAgICAgICAgICAgICB0aGlzLndpZHRoIC8gdGhpcy51cHNjYWxlU2l6ZSAvIHRoaXMuVElMRV9XSURUSDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICB0aGlzLmNhbVkgPlxyXG4gICAgICAgICAgICB0aGlzLndvcmxkSGVpZ2h0IC1cclxuICAgICAgICAgICAgICAgIHRoaXMuaGVpZ2h0IC8gdGhpcy51cHNjYWxlU2l6ZSAvIHRoaXMuVElMRV9IRUlHSFRcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgdGhpcy5jYW1ZID1cclxuICAgICAgICAgICAgICAgIHRoaXMud29ybGRIZWlnaHQgLVxyXG4gICAgICAgICAgICAgICAgdGhpcy5oZWlnaHQgLyB0aGlzLnVwc2NhbGVTaXplIC8gdGhpcy5USUxFX0hFSUdIVDtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAvLyBmb3IgKGNvbnN0IGl0ZW0gb2YgdGhpcy5pdGVtcykge1xyXG4gICAgICAgIC8vICAgICBpdGVtLmdvVG93YXJkc1BsYXllcigpO1xyXG4gICAgICAgIC8vICAgICBpdGVtLmNvbWJpbmVXaXRoTmVhckl0ZW1zKCk7XHJcbiAgICAgICAgLy8gICAgIGl0ZW0uYXBwbHlHcmF2aXR5QW5kRHJhZygpO1xyXG4gICAgICAgIC8vICAgICBpdGVtLmFwcGx5VmVsb2NpdHlBbmRDb2xsaWRlKCk7XHJcbiAgICAgICAgLy8gfVxyXG4gICAgICAgIC8vXHJcbiAgICAgICAgLy8gZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLml0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgLy8gICAgIGlmICh0aGlzLml0ZW1zW2ldLmRlbGV0ZWQgPT09IHRydWUpIHtcclxuICAgICAgICAvLyAgICAgICAgIHRoaXMuaXRlbXMuc3BsaWNlKGksIDEpO1xyXG4gICAgICAgIC8vICAgICAgICAgaS0tO1xyXG4gICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgLy8gfVxyXG4gICAgfVxyXG5cclxuICAgIHVpRnJhbWVSZWN0KHg6IG51bWJlciwgeTogbnVtYmVyLCB3OiBudW1iZXIsIGg6IG51bWJlcikge1xyXG4gICAgICAgIC8vIHNldCB0aGUgY29vcmRzIGFuZCBkaW1lbnNpb25zIHRvIHJvdW5kIHRvIHRoZSBuZWFyZXN0IHVuLXVwc2NhbGVkIHBpeGVsXHJcbiAgICAgICAgeCA9IE1hdGgucm91bmQoeCAvIHRoaXMudXBzY2FsZVNpemUpICogdGhpcy51cHNjYWxlU2l6ZTtcclxuICAgICAgICB5ID0gTWF0aC5yb3VuZCh5IC8gdGhpcy51cHNjYWxlU2l6ZSkgKiB0aGlzLnVwc2NhbGVTaXplO1xyXG4gICAgICAgIHcgPSBNYXRoLnJvdW5kKHcgLyB0aGlzLnVwc2NhbGVTaXplKSAqIHRoaXMudXBzY2FsZVNpemU7XHJcbiAgICAgICAgaCA9IE1hdGgucm91bmQoaCAvIHRoaXMudXBzY2FsZVNpemUpICogdGhpcy51cHNjYWxlU2l6ZTtcclxuXHJcbiAgICAgICAgLy8gY29ybmVyc1xyXG4gICAgICAgIFVpQXNzZXRzLnVpX2ZyYW1lLnJlbmRlclBhcnRpYWwoXHJcbiAgICAgICAgICAgIHRoaXMsXHJcbiAgICAgICAgICAgIHgsXHJcbiAgICAgICAgICAgIHksXHJcbiAgICAgICAgICAgIDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICA3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgNyxcclxuICAgICAgICAgICAgN1xyXG4gICAgICAgICk7XHJcbiAgICAgICAgVWlBc3NldHMudWlfZnJhbWUucmVuZGVyUGFydGlhbChcclxuICAgICAgICAgICAgdGhpcyxcclxuICAgICAgICAgICAgeCArIHcgLSA3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgeSxcclxuICAgICAgICAgICAgNyAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICA4LFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICA3LFxyXG4gICAgICAgICAgICA3XHJcbiAgICAgICAgKTtcclxuICAgICAgICBVaUFzc2V0cy51aV9mcmFtZS5yZW5kZXJQYXJ0aWFsKFxyXG4gICAgICAgICAgICB0aGlzLFxyXG4gICAgICAgICAgICB4LFxyXG4gICAgICAgICAgICB5ICsgaCAtIDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICA3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgNyAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIDgsXHJcbiAgICAgICAgICAgIDcsXHJcbiAgICAgICAgICAgIDdcclxuICAgICAgICApO1xyXG4gICAgICAgIFVpQXNzZXRzLnVpX2ZyYW1lLnJlbmRlclBhcnRpYWwoXHJcbiAgICAgICAgICAgIHRoaXMsXHJcbiAgICAgICAgICAgIHggKyB3IC0gNyAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIHkgKyBoIC0gNyAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICA3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgOCxcclxuICAgICAgICAgICAgOCxcclxuICAgICAgICAgICAgNyxcclxuICAgICAgICAgICAgN1xyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIC8vIHRvcCBhbmQgYm90dG9tXHJcbiAgICAgICAgVWlBc3NldHMudWlfZnJhbWUucmVuZGVyUGFydGlhbChcclxuICAgICAgICAgICAgdGhpcyxcclxuICAgICAgICAgICAgeCArIDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICB5LFxyXG4gICAgICAgICAgICB3IC0gMTQgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICA3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgNyxcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgMSxcclxuICAgICAgICAgICAgN1xyXG4gICAgICAgICk7XHJcbiAgICAgICAgVWlBc3NldHMudWlfZnJhbWUucmVuZGVyUGFydGlhbChcclxuICAgICAgICAgICAgdGhpcyxcclxuICAgICAgICAgICAgeCArIDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICB5ICsgaCAtIDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICB3IC0gMTQgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICA3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgNyxcclxuICAgICAgICAgICAgOCxcclxuICAgICAgICAgICAgMSxcclxuICAgICAgICAgICAgN1xyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIC8vIGxlZnQgYW5kIHJpZ2h0XHJcbiAgICAgICAgVWlBc3NldHMudWlfZnJhbWUucmVuZGVyUGFydGlhbChcclxuICAgICAgICAgICAgdGhpcyxcclxuICAgICAgICAgICAgeCxcclxuICAgICAgICAgICAgeSArIDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICA3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgaCAtIDE0ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgNyxcclxuICAgICAgICAgICAgNyxcclxuICAgICAgICAgICAgMVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgVWlBc3NldHMudWlfZnJhbWUucmVuZGVyUGFydGlhbChcclxuICAgICAgICAgICAgdGhpcyxcclxuICAgICAgICAgICAgeCArIHcgLSA3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgeSArIDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICA3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgaCAtIDE0ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgOCxcclxuICAgICAgICAgICAgNyxcclxuICAgICAgICAgICAgNyxcclxuICAgICAgICAgICAgMVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIC8vIGNlbnRlclxyXG4gICAgICAgIFVpQXNzZXRzLnVpX2ZyYW1lLnJlbmRlclBhcnRpYWwoXHJcbiAgICAgICAgICAgIHRoaXMsXHJcbiAgICAgICAgICAgIHggKyA3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgeSArIDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICB3IC0gMTQgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICBoIC0gMTQgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICA3LFxyXG4gICAgICAgICAgICA3LFxyXG4gICAgICAgICAgICAxLFxyXG4gICAgICAgICAgICAxXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAvJCQkJCQkJCAgLyQkICAgICAgICAgICAgICAgICAgICAgICAgICAgLyQkXHJcbiAgfCAkJF9fICAkJHwgJCQgICAgICAgICAgICAgICAgICAgICAgICAgIHxfXy9cclxuICB8ICQkICBcXCAkJHwgJCQkJCQkJCAgLyQkICAgLyQkICAvJCQkJCQkJCAvJCQgIC8kJCQkJCQkICAvJCQkJCQkJCAvJCRcclxuICB8ICQkJCQkJCQvfCAkJF9fICAkJHwgJCQgIHwgJCQgLyQkX19fX18vfCAkJCAvJCRfX19fXy8gLyQkX19fX18vfF9fL1xyXG4gIHwgJCRfX19fLyB8ICQkICBcXCAkJHwgJCQgIHwgJCR8ICAkJCQkJCQgfCAkJHwgJCQgICAgICB8ICAkJCQkJCRcclxuICB8ICQkICAgICAgfCAkJCAgfCAkJHwgJCQgIHwgJCQgXFxfX19fICAkJHwgJCR8ICQkICAgICAgIFxcX19fXyAgJCQgLyQkXHJcbiAgfCAkJCAgICAgIHwgJCQgIHwgJCR8ICAkJCQkJCQkIC8kJCQkJCQkL3wgJCR8ICAkJCQkJCQkIC8kJCQkJCQkL3xfXy9cclxuICB8X18vICAgICAgfF9fLyAgfF9fLyBcXF9fX18gICQkfF9fX19fX18vIHxfXy8gXFxfX19fX19fL3xfX19fX19fL1xyXG4gICAgICAgICAgICAgICAgICAgICAgIC8kJCAgfCAkJFxyXG4gICAgICAgICAgICAgICAgICAgICAgfCAgJCQkJCQkL1xyXG4gICAgICAgICAgICAgICAgICAgICAgIFxcX19fX19fL1xyXG4gICovXHJcblxyXG4gICAgLy8gdGhpcyBjbGFzcyBob2xkcyBhbiBheGlzLWFsaWduZWQgcmVjdGFuZ2xlIGFmZmVjdGVkIGJ5IGdyYXZpdHksIGRyYWcsIGFuZCBjb2xsaXNpb25zIHdpdGggdGlsZXMuXHJcblxyXG4gICAgcmVjdFZzUmF5KFxyXG4gICAgICAgIHJlY3RYPzogYW55LFxyXG4gICAgICAgIHJlY3RZPzogYW55LFxyXG4gICAgICAgIHJlY3RXPzogYW55LFxyXG4gICAgICAgIHJlY3RIPzogYW55LFxyXG4gICAgICAgIHJheVg/OiBhbnksXHJcbiAgICAgICAgcmF5WT86IGFueSxcclxuICAgICAgICByYXlXPzogYW55LFxyXG4gICAgICAgIHJheUg/OiBhbnlcclxuICAgICkge1xyXG4gICAgICAgIC8vIHRoaXMgcmF5IGlzIGFjdHVhbGx5IGEgbGluZSBzZWdtZW50IG1hdGhlbWF0aWNhbGx5LCBidXQgaXQncyBjb21tb24gdG8gc2VlIHBlb3BsZSByZWZlciB0byBzaW1pbGFyIGNoZWNrcyBhcyByYXktY2FzdHMsIHNvIGZvciB0aGUgZHVyYXRpb24gb2YgdGhlIGRlZmluaXRpb24gb2YgdGhpcyBmdW5jdGlvbiwgcmF5IGNhbiBiZSBhc3N1bWVkIHRvIG1lYW4gdGhlIHNhbWUgYXMgbGluZSBzZWdtZW50LlxyXG5cclxuICAgICAgICAvLyBpZiB0aGUgcmF5IGRvZXNuJ3QgaGF2ZSBhIGxlbmd0aCwgdGhlbiBpdCBjYW4ndCBoYXZlIGVudGVyZWQgdGhlIHJlY3RhbmdsZS4gIFRoaXMgYXNzdW1lcyB0aGF0IHRoZSBvYmplY3RzIGRvbid0IHN0YXJ0IGluIGNvbGxpc2lvbiwgb3RoZXJ3aXNlIHRoZXknbGwgYmVoYXZlIHN0cmFuZ2VseVxyXG4gICAgICAgIGlmIChyYXlXID09PSAwICYmIHJheUggPT09IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gY2FsY3VsYXRlIGhvdyBmYXIgYWxvbmcgdGhlIHJheSBlYWNoIHNpZGUgb2YgdGhlIHJlY3RhbmdsZSBpbnRlcnNlY3RzIHdpdGggaXQgKGVhY2ggc2lkZSBpcyBleHRlbmRlZCBvdXQgaW5maW5pdGVseSBpbiBib3RoIGRpcmVjdGlvbnMpXHJcbiAgICAgICAgY29uc3QgdG9wSW50ZXJzZWN0aW9uID0gKHJlY3RZIC0gcmF5WSkgLyByYXlIO1xyXG4gICAgICAgIGNvbnN0IGJvdHRvbUludGVyc2VjdGlvbiA9IChyZWN0WSArIHJlY3RIIC0gcmF5WSkgLyByYXlIO1xyXG4gICAgICAgIGNvbnN0IGxlZnRJbnRlcnNlY3Rpb24gPSAocmVjdFggLSByYXlYKSAvIHJheVc7XHJcbiAgICAgICAgY29uc3QgcmlnaHRJbnRlcnNlY3Rpb24gPSAocmVjdFggKyByZWN0VyAtIHJheVgpIC8gcmF5VztcclxuXHJcbiAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICBpc05hTih0b3BJbnRlcnNlY3Rpb24pIHx8XHJcbiAgICAgICAgICAgIGlzTmFOKGJvdHRvbUludGVyc2VjdGlvbikgfHxcclxuICAgICAgICAgICAgaXNOYU4obGVmdEludGVyc2VjdGlvbikgfHxcclxuICAgICAgICAgICAgaXNOYU4ocmlnaHRJbnRlcnNlY3Rpb24pXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIC8vIHlvdSBoYXZlIHRvIHVzZSB0aGUgSlMgZnVuY3Rpb24gaXNOYU4oKSB0byBjaGVjayBpZiBhIHZhbHVlIGlzIE5hTiBiZWNhdXNlIGJvdGggTmFOPT1OYU4gYW5kIE5hTj09PU5hTiBhcmUgZmFsc2UuXHJcbiAgICAgICAgICAgIC8vIGlmIGFueSBvZiB0aGVzZSB2YWx1ZXMgYXJlIE5hTiwgbm8gY29sbGlzaW9uIGhhcyBvY2N1cnJlZFxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBjYWxjdWxhdGUgdGhlIG5lYXJlc3QgYW5kIGZhcnRoZXN0IGludGVyc2VjdGlvbnMgZm9yIGJvdGggeCBhbmQgeVxyXG4gICAgICAgIGNvbnN0IG5lYXJYID0gdGhpcy5taW4obGVmdEludGVyc2VjdGlvbiwgcmlnaHRJbnRlcnNlY3Rpb24pO1xyXG4gICAgICAgIGNvbnN0IGZhclggPSB0aGlzLm1heChsZWZ0SW50ZXJzZWN0aW9uLCByaWdodEludGVyc2VjdGlvbik7XHJcbiAgICAgICAgY29uc3QgbmVhclkgPSB0aGlzLm1pbih0b3BJbnRlcnNlY3Rpb24sIGJvdHRvbUludGVyc2VjdGlvbik7XHJcbiAgICAgICAgY29uc3QgZmFyWSA9IHRoaXMubWF4KHRvcEludGVyc2VjdGlvbiwgYm90dG9tSW50ZXJzZWN0aW9uKTtcclxuXHJcbiAgICAgICAgaWYgKG5lYXJYID4gZmFyWSB8fCBuZWFyWSA+IGZhclgpIHtcclxuICAgICAgICAgICAgLy8gdGhpcyBtdXN0IG1lYW4gdGhhdCB0aGUgbGluZSB0aGF0IG1ha2VzIHVwIHRoZSBsaW5lIHNlZ21lbnQgZG9lc24ndCBwYXNzIHRocm91Z2ggdGhlIHJheVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZmFyWCA8IDAgfHwgZmFyWSA8IDApIHtcclxuICAgICAgICAgICAgLy8gdGhlIGludGVyc2VjdGlvbiBpcyBoYXBwZW5pbmcgYmVmb3JlIHRoZSByYXkgc3RhcnRzLCBzbyB0aGUgcmF5IGlzIHBvaW50aW5nIGF3YXkgZnJvbSB0aGUgdHJpYW5nbGVcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gY2FsY3VsYXRlIHdoZXJlIHRoZSBwb3RlbnRpYWwgY29sbGlzaW9uIGNvdWxkIGJlXHJcbiAgICAgICAgY29uc3QgbmVhckNvbGxpc2lvblBvaW50ID0gdGhpcy5tYXgobmVhclgsIG5lYXJZKTtcclxuXHJcbiAgICAgICAgaWYgKG5lYXJYID4gMSB8fCBuZWFyWSA+IDEpIHtcclxuICAgICAgICAgICAgLy8gdGhlIGludGVyc2VjdGlvbiBoYXBwZW5zIGFmdGVyIHRoZSByYXkobGluZSBzZWdtZW50KSBlbmRzXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChuZWFyWCA9PT0gbmVhckNvbGxpc2lvblBvaW50KSB7XHJcbiAgICAgICAgICAgIC8vIGl0IG11c3QgaGF2ZSBjb2xsaWRlZCBvbiBlaXRoZXIgdGhlIGxlZnQgb3IgdGhlIHJpZ2h0ISBub3cgd2hpY2g/XHJcbiAgICAgICAgICAgIGlmIChsZWZ0SW50ZXJzZWN0aW9uID09PSBuZWFyWCkge1xyXG4gICAgICAgICAgICAgICAgLy8gSXQgbXVzdCBoYXZlIGNvbGxpZGVkIG9uIHRoZSBsZWZ0ISAgUmV0dXJuIHRoZSBjb2xsaXNpb24gbm9ybWFsIFstMSwgMF1cclxuICAgICAgICAgICAgICAgIHJldHVybiBbLTEsIDAsIG5lYXJDb2xsaXNpb25Qb2ludF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gSWYgaXQgZGlkbid0IGNvbGxpZGUgb24gdGhlIGxlZnQsIGl0IG11c3QgaGF2ZSBjb2xsaWRlZCBvbiB0aGUgcmlnaHQuICBSZXR1cm4gdGhlIGNvbGxpc2lvbiBub3JtYWwgWzEsIDBdXHJcbiAgICAgICAgICAgIHJldHVybiBbMSwgMCwgbmVhckNvbGxpc2lvblBvaW50XTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gSWYgaXQgZGlkbid0IGNvbGxpZGUgb24gdGhlIGxlZnQgb3IgcmlnaHQsIGl0IG11c3QgaGF2ZSBjb2xsaWRlZCBvbiBlaXRoZXIgdGhlIHRvcCBvciB0aGUgYm90dG9tISBub3cgd2hpY2g/XHJcbiAgICAgICAgaWYgKHRvcEludGVyc2VjdGlvbiA9PT0gbmVhclkpIHtcclxuICAgICAgICAgICAgLy8gSXQgbXVzdCBoYXZlIGNvbGxpZGVkIG9uIHRoZSB0b3AhICBSZXR1cm4gdGhlIGNvbGxpc2lvbiBub3JtYWwgWzAsIC0xXVxyXG4gICAgICAgICAgICByZXR1cm4gWzAsIC0xLCBuZWFyQ29sbGlzaW9uUG9pbnRdO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBJZiBpdCBkaWRuJ3QgY29sbGlkZSBvbiB0aGUgdG9wLCBpdCBtdXN0IGhhdmUgY29sbGlkZWQgb24gdGhlIGJvdHRvbS4gIFJldHVybiB0aGUgY29sbGlzaW9uIG5vcm1hbCBbMCwgMV1cclxuICAgICAgICByZXR1cm4gWzAsIDEsIG5lYXJDb2xsaXNpb25Qb2ludF07XHJcblxyXG4gICAgICAgIC8vIG91dHB1dCBpZiBubyBjb2xsaXNpb246IGZhbHNlXHJcbiAgICAgICAgLy8gb3V0cHV0IGlmIGNvbGxpc2lvbjogW2NvbGxpc2lvbiBub3JtYWwgWCwgY29sbGlzaW9uIG5vcm1hbCBZLCBuZWFyQ29sbGlzaW9uUG9pbnRdXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgLTEgdG8gMSAgICAgICAgICAgICAgLTEgdG8gMSAgICAgICAgICAgIDAgdG8gMVxyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlckVudGl0aWVzKCkge1xyXG4gICAgICAgIC8vIGRyYXcgcGxheWVyXHJcbiAgICAgICAgLy8gdGhpcy5maWxsKDI1NSwgMCwgMCk7XHJcbiAgICAgICAgLy8gdGhpcy5ub1N0cm9rZSgpO1xyXG4gICAgICAgIC8vIHRoaXMucmVjdChcclxuICAgICAgICAvLyAgICAgKHRoaXMud29ybGQucGxheWVyLmludGVycG9sYXRlZFggKiB0aGlzLlRJTEVfV0lEVEggLVxyXG4gICAgICAgIC8vICAgICAgICAgdGhpcy5pbnRlcnBvbGF0ZWRDYW1YICogdGhpcy5USUxFX1dJRFRIKSAqXHJcbiAgICAgICAgLy8gICAgICAgICB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgIC8vICAgICAodGhpcy53b3JsZC5wbGF5ZXIuaW50ZXJwb2xhdGVkWSAqIHRoaXMuVElMRV9IRUlHSFQgLVxyXG4gICAgICAgIC8vICAgICAgICAgdGhpcy5pbnRlcnBvbGF0ZWRDYW1ZICogdGhpcy5USUxFX0hFSUdIVCkgKlxyXG4gICAgICAgIC8vICAgICAgICAgdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAvLyAgICAgdGhpcy53b3JsZC5wbGF5ZXIud2lkdGggKiB0aGlzLnVwc2NhbGVTaXplICogdGhpcy5USUxFX1dJRFRILFxyXG4gICAgICAgIC8vICAgICB0aGlzLndvcmxkLnBsYXllci5oZWlnaHQgKiB0aGlzLnVwc2NhbGVTaXplICogdGhpcy5USUxFX0hFSUdIVFxyXG4gICAgICAgIC8vICk7XHJcblxyXG5cclxuICAgICAgICAvLyBmb3IgKGNvbnN0IGl0ZW0gb2YgdGhpcy5pdGVtcykge1xyXG4gICAgICAgIC8vICAgICBpdGVtLmZpbmRJbnRlcnBvbGF0ZWRDb29yZGluYXRlcygpO1xyXG4gICAgICAgIC8vXHJcbiAgICAgICAgLy8gICAgIGl0ZW0uaXRlbVN0YWNrLnRleHR1cmUucmVuZGVyKFxyXG4gICAgICAgIC8vICAgICAgICAgdGhpcyxcclxuICAgICAgICAvLyAgICAgICAgIChpdGVtLmludGVycG9sYXRlZFggKiB0aGlzLlRJTEVfV0lEVEggLVxyXG4gICAgICAgIC8vICAgICAgICAgICAgIHRoaXMuaW50ZXJwb2xhdGVkQ2FtWCAqIHRoaXMuVElMRV9XSURUSCkgKlxyXG4gICAgICAgIC8vICAgICAgICAgICAgIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgLy8gICAgICAgICAoaXRlbS5pbnRlcnBvbGF0ZWRZICogdGhpcy5USUxFX0hFSUdIVCAtXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgdGhpcy5pbnRlcnBvbGF0ZWRDYW1ZICogdGhpcy5USUxFX0hFSUdIVCkgKlxyXG4gICAgICAgIC8vICAgICAgICAgICAgIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgLy8gICAgICAgICBpdGVtLncgKiB0aGlzLnVwc2NhbGVTaXplICogdGhpcy5USUxFX1dJRFRILFxyXG4gICAgICAgIC8vICAgICAgICAgaXRlbS5oICogdGhpcy51cHNjYWxlU2l6ZSAqIHRoaXMuVElMRV9IRUlHSFRcclxuICAgICAgICAvLyAgICAgKTtcclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vICAgICAvLyBSZW5kZXIgdGhlIGl0ZW0gcXVhbnRpdHkgbGFiZWxcclxuICAgICAgICAvLyAgICAgdGhpcy5maWxsKDApO1xyXG4gICAgICAgIC8vXHJcbiAgICAgICAgLy8gICAgIHRoaXMubm9TdHJva2UoKTtcclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vICAgICB0aGlzLnRleHRBbGlnbih0aGlzLlJJR0hULCB0aGlzLkJPVFRPTSk7XHJcbiAgICAgICAgLy8gICAgIHRoaXMudGV4dFNpemUoNSAqIHRoaXMudXBzY2FsZVNpemUpO1xyXG4gICAgICAgIC8vXHJcbiAgICAgICAgLy8gICAgIHRoaXMudGV4dChcclxuICAgICAgICAvLyAgICAgICAgIGl0ZW0uaXRlbVN0YWNrLnN0YWNrU2l6ZSxcclxuICAgICAgICAvLyAgICAgICAgIChpdGVtLmludGVycG9sYXRlZFggKiB0aGlzLlRJTEVfV0lEVEggLVxyXG4gICAgICAgIC8vICAgICAgICAgICAgIHRoaXMuaW50ZXJwb2xhdGVkQ2FtWCAqIHRoaXMuVElMRV9XSURUSCkgKlxyXG4gICAgICAgIC8vICAgICAgICAgICAgIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgLy8gICAgICAgICAoaXRlbS5pbnRlcnBvbGF0ZWRZICogdGhpcy5USUxFX0hFSUdIVCAtXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgdGhpcy5pbnRlcnBvbGF0ZWRDYW1ZICogdGhpcy5USUxFX0hFSUdIVCkgKlxyXG4gICAgICAgIC8vICAgICAgICAgICAgIHRoaXMudXBzY2FsZVNpemVcclxuICAgICAgICAvLyAgICAgKTtcclxuICAgICAgICAvLyB9XHJcbiAgICB9XHJcblxyXG4gICAgcGlja1VwSXRlbShpdGVtU3RhY2s6IEl0ZW1TdGFjayk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5ob3RCYXIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgaXRlbSA9IHRoaXMuaG90QmFyW2ldO1xyXG5cclxuICAgICAgICAgICAgLy8gSWYgdGhlcmUgYXJlIG5vIGl0ZW1zIGluIHRoZSBjdXJyZW50IHNsb3Qgb2YgdGhlIGhvdEJhclxyXG4gICAgICAgICAgICBpZiAoaXRlbSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhvdEJhcltpXSA9IGl0ZW1TdGFjaztcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICBpdGVtID09PSBpdGVtU3RhY2sgJiZcclxuICAgICAgICAgICAgICAgIGl0ZW0uc3RhY2tTaXplIDwgaXRlbS5tYXhTdGFja1NpemVcclxuICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZW1haW5pbmdTcGFjZSA9IGl0ZW0ubWF4U3RhY2tTaXplIC0gaXRlbS5zdGFja1NpemU7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gVG9wIG9mZiB0aGUgc3RhY2sgd2l0aCBpdGVtcyBpZiBpdCBjYW4gdGFrZSBtb3JlIHRoYW4gdGhlIHN0YWNrIGJlaW5nIGFkZGVkXHJcbiAgICAgICAgICAgICAgICBpZiAocmVtYWluaW5nU3BhY2UgPj0gaXRlbVN0YWNrLnN0YWNrU2l6ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaG90QmFyW2ldLnN0YWNrU2l6ZSA9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uc3RhY2tTaXplICsgaXRlbVN0YWNrLnN0YWNrU2l6ZTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpdGVtU3RhY2suc3RhY2tTaXplIC09IHJlbWFpbmluZ1NwYWNlO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuaG90QmFyW2ldLnN0YWNrU2l6ZSA9IGl0ZW1TdGFjay5tYXhTdGFja1NpemU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihcclxuICAgICAgICAgICAgYENvdWxkIG5vdCBwaWNrdXAgJHtpdGVtU3RhY2suc3RhY2tTaXplfSAke2l0ZW1TdGFjay5uYW1lfWBcclxuICAgICAgICApO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBtb3VzZUV4aXRlZCgpIHtcclxuICAgICAgICB0aGlzLm1vdXNlT24gPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBtb3VzZUVudGVyZWQoKSB7XHJcbiAgICAgICAgdGhpcy5tb3VzZU9uID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVNb3VzZSgpIHtcclxuICAgICAgICAvLyB3b3JsZCBtb3VzZSB4IGFuZCB5IHZhcmlhYmxlcyBob2xkIHRoZSBtb3VzZSBwb3NpdGlvbiBpbiB3b3JsZCB0aWxlcy4gIDAsIDAgaXMgdG9wIGxlZnRcclxuICAgICAgICB0aGlzLndvcmxkTW91c2VYID0gTWF0aC5mbG9vcihcclxuICAgICAgICAgICAgKHRoaXMuaW50ZXJwb2xhdGVkQ2FtWCAqIHRoaXMuVElMRV9XSURUSCArXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vdXNlWCAvIHRoaXMudXBzY2FsZVNpemUpIC9cclxuICAgICAgICAgICAgICAgIHRoaXMuVElMRV9XSURUSFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgdGhpcy53b3JsZE1vdXNlWSA9IE1hdGguZmxvb3IoXHJcbiAgICAgICAgICAgICh0aGlzLmludGVycG9sYXRlZENhbVkgKiB0aGlzLlRJTEVfSEVJR0hUICtcclxuICAgICAgICAgICAgICAgIHRoaXMubW91c2VZIC8gdGhpcy51cHNjYWxlU2l6ZSkgL1xyXG4gICAgICAgICAgICAgICAgdGhpcy5USUxFX0hFSUdIVFxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgZHJhd0N1cnNvcigpIHtcclxuICAgICAgICBpZiAodGhpcy5tb3VzZU9uKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnBpY2tlZFVwU2xvdCA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhvdEJhclt0aGlzLnBpY2tlZFVwU2xvdF0udGV4dHVyZS5yZW5kZXIoXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcyxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdXNlWCxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdXNlWSxcclxuICAgICAgICAgICAgICAgICAgICA4ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICA4ICogdGhpcy51cHNjYWxlU2l6ZVxyXG4gICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnRleHQoXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ob3RCYXJbdGhpcy5waWNrZWRVcFNsb3RdLnN0YWNrU2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdXNlWCArIDEwICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdXNlWSArIDEwICogdGhpcy51cHNjYWxlU2l6ZVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5leHBvcnQgPSBHYW1lXHJcbiIsImltcG9ydCBHYW1lIGZyb20gJy4vR2FtZSc7XHJcbmltcG9ydCB7IGlvIH0gZnJvbSBcInNvY2tldC5pby1jbGllbnRcIjtcclxuXHJcblxyXG4vLyBDb25uZWN0IHRoZSBzZXJ2ZXJcclxuXHJcbmNvbnN0IGNvbm5lY3Rpb24gPSBpbyh7IGF1dGg6IHsgdG9rZW46IHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndG9rZW4nKSB9IH0pXHJcblxyXG5leHBvcnQgZGVmYXVsdCBuZXcgR2FtZShjb25uZWN0aW9uKTsiLCJpbXBvcnQgVGlsZVJlc291cmNlIGZyb20gJy4vcmVzb3VyY2VzL1RpbGVSZXNvdXJjZSc7XHJcbmltcG9ydCBJbWFnZVJlc291cmNlIGZyb20gJy4vcmVzb3VyY2VzL0ltYWdlUmVzb3VyY2UnO1xyXG5pbXBvcnQgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlIGZyb20gJy4vcmVzb3VyY2VzL1JlZmxlY3RlZEltYWdlUmVzb3VyY2UnO1xyXG5pbXBvcnQgRm9udFJlc291cmNlIGZyb20gJy4vcmVzb3VyY2VzL0ZvbnRSZXNvdXJjZSc7XHJcbmltcG9ydCBSZXNvdXJjZSBmcm9tICcuL3Jlc291cmNlcy9SZXNvdXJjZSc7XHJcbmltcG9ydCBBdWRpb1Jlc291cmNlR3JvdXAgZnJvbSAnLi9yZXNvdXJjZXMvQXVkaW9SZXNvdXJjZUdyb3VwJztcclxuaW1wb3J0IFA1IGZyb20gJ3A1JztcclxuaW1wb3J0IEF1ZGlvUmVzb3VyY2UgZnJvbSAnLi9yZXNvdXJjZXMvQXVkaW9SZXNvdXJjZSc7XHJcblxyXG5pbnRlcmZhY2UgQXNzZXRHcm91cCB7XHJcbiAgICBbbmFtZTogc3RyaW5nXTpcclxuICAgIHwge1xyXG4gICAgICAgIFtuYW1lOiBzdHJpbmddOiBSZXNvdXJjZSB8IEFzc2V0R3JvdXAgfCBBdWRpb1Jlc291cmNlR3JvdXAgfCBBdWRpb1Jlc291cmNlIHwgSW1hZ2VSZXNvdXJjZVtdO1xyXG4gICAgfVxyXG4gICAgfCBSZXNvdXJjZSB8IEFzc2V0R3JvdXAgfCBBdWRpb1Jlc291cmNlR3JvdXAgfCBBdWRpb1Jlc291cmNlIHwgSW1hZ2VSZXNvdXJjZVtdO1xyXG59XHJcblxyXG4vLyBVaSByZWxhdGVkIGFzc2V0c1xyXG5jb25zdCBVaUFzc2V0cyA9IHtcclxuICAgIHVpX3Nsb3Rfc2VsZWN0ZWQ6IG5ldyBJbWFnZVJlc291cmNlKFxyXG4gICAgICAgICdhc3NldHMvdGV4dHVyZXMvdWkvdWlzbG90X3NlbGVjdGVkLnBuZydcclxuICAgICksXHJcbiAgICB1aV9zbG90OiBuZXcgSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3VpL3Vpc2xvdC5wbmcnKSxcclxuICAgIHVpX2ZyYW1lOiBuZXcgSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3VpL3VpZnJhbWUucG5nJyksXHJcbiAgICBidXR0b25fdW5zZWxlY3RlZDogbmV3IEltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy91aS9idXR0b24wLnBuZycpLFxyXG4gICAgYnV0dG9uX3NlbGVjdGVkOiBuZXcgSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3VpL2J1dHRvbjEucG5nJyksXHJcbiAgICBzbGlkZXJfYmFyOiBuZXcgSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3VpL3NsaWRlckJhci5wbmcnKSxcclxuICAgIHNsaWRlcl9oYW5kbGU6IG5ldyBJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvdWkvc2xpZGVySGFuZGxlLnBuZycpLFxyXG4gICAgdGl0bGVfaW1hZ2U6IG5ldyBJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvdWkvc25vd2VkaW5CVU1QLnBuZycpLFxyXG4gICAgdmlnbmV0dGU6IG5ldyBJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvdWkvdmlnbmV0dGUtZXhwb3J0LnBuZycpLFxyXG59O1xyXG5cclxuLy8gSXRlbSByZWxhdGVkIGFzc2V0c1xyXG5jb25zdCBJdGVtc0Fzc2V0cyA9IHtcclxuICAgIHJlc291cmNlczoge1xyXG4gICAgICAgIGljZV9zaGFyZDogbmV3IEltYWdlUmVzb3VyY2UoXHJcbiAgICAgICAgICAgICdhc3NldHMvdGV4dHVyZXMvaXRlbXMvcmVzb3VyY2VfaWNlX3NoYXJkcy5wbmcnXHJcbiAgICAgICAgKSxcclxuICAgICAgICBzbm93YmFsbDogbmV3IEltYWdlUmVzb3VyY2UoXHJcbiAgICAgICAgICAgICdhc3NldHMvdGV4dHVyZXMvaXRlbXMvcmVzb3VyY2Vfc25vd2JhbGwucG5nJ1xyXG4gICAgICAgICksXHJcbiAgICB9LFxyXG4gICAgY29uc3VtYWJsZXM6IHtcclxuICAgICAgICBzbm93X2JlcnJpZXM6IG5ldyBJbWFnZVJlc291cmNlKFxyXG4gICAgICAgICAgICAnYXNzZXRzL3RleHR1cmVzL2l0ZW1zL2NvbnN1bWFibGVfc25vd19iZXJyaWVzLnBuZydcclxuICAgICAgICApLFxyXG4gICAgfSxcclxuICAgIGJsb2Nrczoge1xyXG4gICAgICAgIGljZTogbmV3IEltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9ibG9ja19pY2UucG5nJyksXHJcbiAgICAgICAgc25vdzogbmV3IEltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9ibG9ja19zbm93LnBuZycpLFxyXG4gICAgfSxcclxuICAgIHRvb2xzOiB7fSxcclxufTtcclxuXHJcbi8vIFdvcmxkIHJlbGF0ZWQgYXNzZXRzXHJcbmNvbnN0IFdvcmxkQXNzZXRzID0ge1xyXG4gICAgc2hhZGVyUmVzb3VyY2VzOiB7XHJcbiAgICAgICAgc2t5SW1hZ2U6IG5ldyBJbWFnZVJlc291cmNlKFxyXG4gICAgICAgICAgICAnYXNzZXRzL3RleHR1cmVzL3NoYWRlcl9yZXNvdXJjZXMvcG9pc3NvbnNub3cucG5nJ1xyXG4gICAgICAgICksXHJcbiAgICB9LFxyXG4gICAgbWlkZGxlZ3JvdW5kOiB7XHJcbiAgICAgICAgdGlsZXNldF9pY2U6IG5ldyBUaWxlUmVzb3VyY2UoXHJcbiAgICAgICAgICAgICdhc3NldHMvdGV4dHVyZXMvd29ybGQvbWlkZGxlZ3JvdW5kL3RpbGVzZXRfaWNlLnBuZycsXHJcbiAgICAgICAgICAgIDE2LFxyXG4gICAgICAgICAgICAxLFxyXG4gICAgICAgICAgICA4LFxyXG4gICAgICAgICAgICA4XHJcbiAgICAgICAgKSxcclxuICAgICAgICB0aWxlc2V0X3Nub3c6IG5ldyBUaWxlUmVzb3VyY2UoXHJcbiAgICAgICAgICAgICdhc3NldHMvdGV4dHVyZXMvd29ybGQvbWlkZGxlZ3JvdW5kL3RpbGVzZXRfc25vdy5wbmcnLFxyXG4gICAgICAgICAgICAxNixcclxuICAgICAgICAgICAgMSxcclxuICAgICAgICAgICAgOCxcclxuICAgICAgICAgICAgOFxyXG4gICAgICAgICksXHJcbiAgICAgICAgdGlsZXNldF9kaXJ0OiBuZXcgVGlsZVJlc291cmNlKFxyXG4gICAgICAgICAgICAnYXNzZXRzL3RleHR1cmVzL3dvcmxkL21pZGRsZWdyb3VuZC90aWxlc2V0X2RpcnQwLnBuZycsXHJcbiAgICAgICAgICAgIDE2LFxyXG4gICAgICAgICAgICAxLFxyXG4gICAgICAgICAgICA4LFxyXG4gICAgICAgICAgICA4XHJcbiAgICAgICAgKSxcclxuICAgICAgICB0aWxlc2V0X3N0b25lMDogbmV3IFRpbGVSZXNvdXJjZShcclxuICAgICAgICAgICAgJ2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9taWRkbGVncm91bmQvdGlsZXNldF9zdG9uZTAucG5nJyxcclxuICAgICAgICAgICAgMTYsXHJcbiAgICAgICAgICAgIDEsXHJcbiAgICAgICAgICAgIDgsXHJcbiAgICAgICAgICAgIDhcclxuICAgICAgICApLFxyXG4gICAgICAgIHRpbGVzZXRfc3RvbmUxOiBuZXcgVGlsZVJlc291cmNlKFxyXG4gICAgICAgICAgICAnYXNzZXRzL3RleHR1cmVzL3dvcmxkL21pZGRsZWdyb3VuZC90aWxlc2V0X3N0b25lMS5wbmcnLFxyXG4gICAgICAgICAgICAxNixcclxuICAgICAgICAgICAgMSxcclxuICAgICAgICAgICAgOCxcclxuICAgICAgICAgICAgOFxyXG4gICAgICAgICksXHJcbiAgICAgICAgdGlsZXNldF9zdG9uZTI6IG5ldyBUaWxlUmVzb3VyY2UoXHJcbiAgICAgICAgICAgICdhc3NldHMvdGV4dHVyZXMvd29ybGQvbWlkZGxlZ3JvdW5kL3RpbGVzZXRfc3RvbmUyLnBuZycsXHJcbiAgICAgICAgICAgIDE2LFxyXG4gICAgICAgICAgICAxLFxyXG4gICAgICAgICAgICA4LFxyXG4gICAgICAgICAgICA4XHJcbiAgICAgICAgKSxcclxuICAgICAgICB0aWxlc2V0X3N0b25lMzogbmV3IFRpbGVSZXNvdXJjZShcclxuICAgICAgICAgICAgJ2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9taWRkbGVncm91bmQvdGlsZXNldF9zdG9uZTMucG5nJyxcclxuICAgICAgICAgICAgMTYsXHJcbiAgICAgICAgICAgIDEsXHJcbiAgICAgICAgICAgIDgsXHJcbiAgICAgICAgICAgIDhcclxuICAgICAgICApLFxyXG4gICAgICAgIHRpbGVzZXRfc3RvbmU0OiBuZXcgVGlsZVJlc291cmNlKFxyXG4gICAgICAgICAgICAnYXNzZXRzL3RleHR1cmVzL3dvcmxkL21pZGRsZWdyb3VuZC90aWxlc2V0X3N0b25lNC5wbmcnLFxyXG4gICAgICAgICAgICAxNixcclxuICAgICAgICAgICAgMSxcclxuICAgICAgICAgICAgOCxcclxuICAgICAgICAgICAgOFxyXG4gICAgICAgICksXHJcbiAgICAgICAgdGlsZXNldF9zdG9uZTU6IG5ldyBUaWxlUmVzb3VyY2UoXHJcbiAgICAgICAgICAgICdhc3NldHMvdGV4dHVyZXMvd29ybGQvbWlkZGxlZ3JvdW5kL3RpbGVzZXRfc3RvbmU1LnBuZycsXHJcbiAgICAgICAgICAgIDE2LFxyXG4gICAgICAgICAgICAxLFxyXG4gICAgICAgICAgICA4LFxyXG4gICAgICAgICAgICA4XHJcbiAgICAgICAgKSxcclxuICAgICAgICB0aWxlc2V0X3N0b25lNjogbmV3IFRpbGVSZXNvdXJjZShcclxuICAgICAgICAgICAgJ2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9taWRkbGVncm91bmQvdGlsZXNldF9zdG9uZTYucG5nJyxcclxuICAgICAgICAgICAgMTYsXHJcbiAgICAgICAgICAgIDEsXHJcbiAgICAgICAgICAgIDgsXHJcbiAgICAgICAgICAgIDhcclxuICAgICAgICApLFxyXG4gICAgICAgIHRpbGVzZXRfc3RvbmU3OiBuZXcgVGlsZVJlc291cmNlKFxyXG4gICAgICAgICAgICAnYXNzZXRzL3RleHR1cmVzL3dvcmxkL21pZGRsZWdyb3VuZC90aWxlc2V0X3N0b25lNy5wbmcnLFxyXG4gICAgICAgICAgICAxNixcclxuICAgICAgICAgICAgMSxcclxuICAgICAgICAgICAgOCxcclxuICAgICAgICAgICAgOFxyXG4gICAgICAgICksXHJcbiAgICAgICAgdGlsZXNldF9zdG9uZTg6IG5ldyBUaWxlUmVzb3VyY2UoXHJcbiAgICAgICAgICAgICdhc3NldHMvdGV4dHVyZXMvd29ybGQvbWlkZGxlZ3JvdW5kL3RpbGVzZXRfc3RvbmU4LnBuZycsXHJcbiAgICAgICAgICAgIDE2LFxyXG4gICAgICAgICAgICAxLFxyXG4gICAgICAgICAgICA4LFxyXG4gICAgICAgICAgICA4XHJcbiAgICAgICAgKSxcclxuICAgICAgICB0aWxlc2V0X3N0b25lOTogbmV3IFRpbGVSZXNvdXJjZShcclxuICAgICAgICAgICAgJ2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9taWRkbGVncm91bmQvdGlsZXNldF9zdG9uZTkucG5nJyxcclxuICAgICAgICAgICAgMTYsXHJcbiAgICAgICAgICAgIDEsXHJcbiAgICAgICAgICAgIDgsXHJcbiAgICAgICAgICAgIDhcclxuICAgICAgICApLFxyXG4gICAgfSxcclxuICAgIGZvcmVncm91bmQ6IHtcclxuICAgICAgICB0aWxlc2V0X3BpcGU6IG5ldyBUaWxlUmVzb3VyY2UoXHJcbiAgICAgICAgICAgICdhc3NldHMvdGV4dHVyZXMvd29ybGQvZm9yZWdyb3VuZC90aWxlc2V0X3BpcGUucG5nJyxcclxuICAgICAgICAgICAgMTYsXHJcbiAgICAgICAgICAgIDEsXHJcbiAgICAgICAgICAgIDgsXHJcbiAgICAgICAgICAgIDhcclxuICAgICAgICApLFxyXG4gICAgfSxcclxuICAgIHRpbGVFbnRpdGllczoge1xyXG4gICAgICAgIGVudGl0eV90MWRyaWxsOiBbXHJcbiAgICAgICAgICAgIG5ldyBJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvd29ybGQvdGlsZUVudGl0aWVzL1J1c3R5RHJpbGwxLnBuZycpLFxyXG4gICAgICAgICAgICBuZXcgSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3dvcmxkL3RpbGVFbnRpdGllcy9SdXN0eURyaWxsMi5wbmcnKSxcclxuICAgICAgICAgICAgbmV3IEltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy93b3JsZC90aWxlRW50aXRpZXMvUnVzdHlEcmlsbDMucG5nJyksXHJcbiAgICAgICAgICAgIG5ldyBJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvd29ybGQvdGlsZUVudGl0aWVzL1J1c3R5RHJpbGw0LnBuZycpLFxyXG4gICAgICAgICAgICBuZXcgSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3dvcmxkL3RpbGVFbnRpdGllcy9SdXN0eURyaWxsNS5wbmcnKSxcclxuICAgICAgICAgICAgbmV3IEltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy93b3JsZC90aWxlRW50aXRpZXMvUnVzdHlEcmlsbDYucG5nJyksXHJcbiAgICAgICAgICAgIG5ldyBJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvd29ybGQvdGlsZUVudGl0aWVzL1J1c3R5RHJpbGw3LnBuZycpLFxyXG4gICAgICAgICAgICBuZXcgSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3dvcmxkL3RpbGVFbnRpdGllcy9SdXN0eURyaWxsOC5wbmcnKSxcclxuICAgICAgICAgICAgbmV3IEltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy93b3JsZC90aWxlRW50aXRpZXMvUnVzdHlEcmlsbDkucG5nJyksXHJcbiAgICAgICAgICAgIG5ldyBJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvd29ybGQvdGlsZUVudGl0aWVzL1J1c3R5RHJpbGwxMC5wbmcnKSxcclxuICAgICAgICAgICAgbmV3IEltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy93b3JsZC90aWxlRW50aXRpZXMvUnVzdHlEcmlsbDExLnBuZycpLFxyXG4gICAgICAgICAgICBuZXcgSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3dvcmxkL3RpbGVFbnRpdGllcy9SdXN0eURyaWxsMTIucG5nJyksXHJcbiAgICAgICAgICAgIG5ldyBJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvd29ybGQvdGlsZUVudGl0aWVzL1J1c3R5RHJpbGwxMy5wbmcnKVxyXG4gICAgICAgIF1cclxuICAgIH1cclxufTtcclxuXHJcbmNvbnN0IEZvbnRzID0ge1xyXG4gICAgdGl0bGU6IG5ldyBGb250UmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy91aS9mb250LnBuZycsIHtcclxuICAgICAgICBcIjBcIjogNyxcclxuICAgICAgICBcIjFcIjogNyxcclxuICAgICAgICBcIjJcIjogNyxcclxuICAgICAgICBcIjNcIjogNixcclxuICAgICAgICBcIjRcIjogNixcclxuICAgICAgICBcIjVcIjogNixcclxuICAgICAgICBcIjZcIjogNixcclxuICAgICAgICBcIjdcIjogNyxcclxuICAgICAgICBcIjhcIjogNyxcclxuICAgICAgICBcIjlcIjogNixcclxuICAgICAgICBcIkFcIjogNixcclxuICAgICAgICBcIkJcIjogNyxcclxuICAgICAgICBcIkNcIjogNyxcclxuICAgICAgICBcIkRcIjogNixcclxuICAgICAgICBcIkVcIjogNyxcclxuICAgICAgICBcIkZcIjogNixcclxuICAgICAgICBcIkdcIjogNyxcclxuICAgICAgICBcIkhcIjogNyxcclxuICAgICAgICBcIklcIjogNyxcclxuICAgICAgICBcIkpcIjogOCxcclxuICAgICAgICBcIktcIjogNixcclxuICAgICAgICBcIkxcIjogNixcclxuICAgICAgICBcIk1cIjogOCxcclxuICAgICAgICBcIk5cIjogOCxcclxuICAgICAgICBcIk9cIjogOCxcclxuICAgICAgICBcIlBcIjogOSxcclxuICAgICAgICBcIlFcIjogOCxcclxuICAgICAgICBcIlJcIjogNyxcclxuICAgICAgICBcIlNcIjogNyxcclxuICAgICAgICBcIlRcIjogOCxcclxuICAgICAgICBcIlVcIjogOCxcclxuICAgICAgICBcIlZcIjogOCxcclxuICAgICAgICBcIldcIjogMTAsXHJcbiAgICAgICAgXCJYXCI6IDgsXHJcbiAgICAgICAgXCJZXCI6IDgsXHJcbiAgICAgICAgXCJaXCI6IDksXHJcbiAgICAgICAgXCJhXCI6IDcsXHJcbiAgICAgICAgXCJiXCI6IDcsXHJcbiAgICAgICAgXCJjXCI6IDYsXHJcbiAgICAgICAgXCJkXCI6IDcsXHJcbiAgICAgICAgXCJlXCI6IDYsXHJcbiAgICAgICAgXCJmXCI6IDYsXHJcbiAgICAgICAgXCJnXCI6IDYsXHJcbiAgICAgICAgXCJoXCI6IDYsXHJcbiAgICAgICAgXCJpXCI6IDUsXHJcbiAgICAgICAgXCJqXCI6IDYsXHJcbiAgICAgICAgXCJrXCI6IDUsXHJcbiAgICAgICAgXCJsXCI6IDUsXHJcbiAgICAgICAgXCJtXCI6IDgsXHJcbiAgICAgICAgXCJuXCI6IDUsXHJcbiAgICAgICAgXCJvXCI6IDUsXHJcbiAgICAgICAgXCJwXCI6IDUsXHJcbiAgICAgICAgXCJxXCI6IDcsXHJcbiAgICAgICAgXCJyXCI6IDUsXHJcbiAgICAgICAgXCJzXCI6IDQsXHJcbiAgICAgICAgXCJ0XCI6IDUsXHJcbiAgICAgICAgXCJ1XCI6IDUsXHJcbiAgICAgICAgXCJ2XCI6IDUsXHJcbiAgICAgICAgXCJ3XCI6IDcsXHJcbiAgICAgICAgXCJ4XCI6IDYsXHJcbiAgICAgICAgXCJ5XCI6IDUsXHJcbiAgICAgICAgXCJ6XCI6IDUsXHJcbiAgICAgICAgXCIhXCI6IDQsXHJcbiAgICAgICAgXCIuXCI6IDIsXHJcbiAgICAgICAgXCIsXCI6IDIsXHJcbiAgICAgICAgXCI/XCI6IDYsXHJcbiAgICAgICAgXCJfXCI6IDYsXHJcbiAgICAgICAgXCItXCI6IDQsXHJcbiAgICAgICAgXCI6XCI6IDIsXHJcbiAgICAgICAgXCIgXCI6IDJcclxuICAgIH0sIFwiQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkhLiw/Xy06IFwiKSxcclxuXHJcbiAgICBiaWc6IG5ldyBGb250UmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy91aS9mb250QmlnLnBuZycsIHtcclxuICAgICAgICBcIjBcIjogMTQsXHJcbiAgICAgICAgXCIxXCI6IDE0LFxyXG4gICAgICAgIFwiMlwiOiAxNCxcclxuICAgICAgICBcIjNcIjogMTIsXHJcbiAgICAgICAgXCI0XCI6IDEyLFxyXG4gICAgICAgIFwiNVwiOiAxMixcclxuICAgICAgICBcIjZcIjogMTIsXHJcbiAgICAgICAgXCI3XCI6IDE0LFxyXG4gICAgICAgIFwiOFwiOiAxNCxcclxuICAgICAgICBcIjlcIjogMTIsXHJcbiAgICAgICAgXCJBXCI6IDEyLFxyXG4gICAgICAgIFwiQlwiOiAxNCxcclxuICAgICAgICBcIkNcIjogMTQsXHJcbiAgICAgICAgXCJEXCI6IDEyLFxyXG4gICAgICAgIFwiRVwiOiAxNCxcclxuICAgICAgICBcIkZcIjogMTIsXHJcbiAgICAgICAgXCJHXCI6IDE0LFxyXG4gICAgICAgIFwiSFwiOiAxNCxcclxuICAgICAgICBcIklcIjogMTQsXHJcbiAgICAgICAgXCJKXCI6IDE2LFxyXG4gICAgICAgIFwiS1wiOiAxMixcclxuICAgICAgICBcIkxcIjogMTIsXHJcbiAgICAgICAgXCJNXCI6IDE2LFxyXG4gICAgICAgIFwiTlwiOiAxNixcclxuICAgICAgICBcIk9cIjogMTYsXHJcbiAgICAgICAgXCJQXCI6IDE4LFxyXG4gICAgICAgIFwiUVwiOiAxNixcclxuICAgICAgICBcIlJcIjogMTQsXHJcbiAgICAgICAgXCJTXCI6IDE0LFxyXG4gICAgICAgIFwiVFwiOiAxNixcclxuICAgICAgICBcIlVcIjogMTYsXHJcbiAgICAgICAgXCJWXCI6IDE2LFxyXG4gICAgICAgIFwiV1wiOiAyMCxcclxuICAgICAgICBcIlhcIjogMTYsXHJcbiAgICAgICAgXCJZXCI6IDE2LFxyXG4gICAgICAgIFwiWlwiOiAxOCxcclxuICAgICAgICBcImFcIjogMTQsXHJcbiAgICAgICAgXCJiXCI6IDE0LFxyXG4gICAgICAgIFwiY1wiOiAxMixcclxuICAgICAgICBcImRcIjogMTQsXHJcbiAgICAgICAgXCJlXCI6IDEyLFxyXG4gICAgICAgIFwiZlwiOiAxMixcclxuICAgICAgICBcImdcIjogMTIsXHJcbiAgICAgICAgXCJoXCI6IDEyLFxyXG4gICAgICAgIFwiaVwiOiAxMCxcclxuICAgICAgICBcImpcIjogMTIsXHJcbiAgICAgICAgXCJrXCI6IDEwLFxyXG4gICAgICAgIFwibFwiOiAxMCxcclxuICAgICAgICBcIm1cIjogMTYsXHJcbiAgICAgICAgXCJuXCI6IDEwLFxyXG4gICAgICAgIFwib1wiOiAxMCxcclxuICAgICAgICBcInBcIjogMTAsXHJcbiAgICAgICAgXCJxXCI6IDE0LFxyXG4gICAgICAgIFwiclwiOiAxMCxcclxuICAgICAgICBcInNcIjogOCxcclxuICAgICAgICBcInRcIjogMTAsXHJcbiAgICAgICAgXCJ1XCI6IDEwLFxyXG4gICAgICAgIFwidlwiOiAxMCxcclxuICAgICAgICBcIndcIjogMTQsXHJcbiAgICAgICAgXCJ4XCI6IDEyLFxyXG4gICAgICAgIFwieVwiOiAxMCxcclxuICAgICAgICBcInpcIjogMTAsXHJcbiAgICAgICAgXCIhXCI6IDgsXHJcbiAgICAgICAgXCIuXCI6IDQsXHJcbiAgICAgICAgXCIsXCI6IDQsXHJcbiAgICAgICAgXCI/XCI6IDEyLFxyXG4gICAgICAgIFwiX1wiOiAxMixcclxuICAgICAgICBcIi1cIjogOCxcclxuICAgICAgICBcIjpcIjogNCxcclxuICAgICAgICBcIiBcIjogNFxyXG4gICAgfSwgXCJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSEuLD9fLTogXCIpLFxyXG5cclxufTtcclxuXHJcbmNvbnN0IEtleXMgPSB7XHJcbiAgICBrZXlib2FyZE1hcDogW1xyXG4gICAgICAgIFwiXCIsIC8vIFswXVxyXG4gICAgICAgIFwiXCIsIC8vIFsxXVxyXG4gICAgICAgIFwiXCIsIC8vIFsyXVxyXG4gICAgICAgIFwiQ0FOQ0VMXCIsIC8vIFszXVxyXG4gICAgICAgIFwiXCIsIC8vIFs0XVxyXG4gICAgICAgIFwiXCIsIC8vIFs1XVxyXG4gICAgICAgIFwiSEVMUFwiLCAvLyBbNl1cclxuICAgICAgICBcIlwiLCAvLyBbN11cclxuICAgICAgICBcIkJBQ0tTUEFDRVwiLCAvLyBbOF1cclxuICAgICAgICBcIlRBQlwiLCAvLyBbOV1cclxuICAgICAgICBcIlwiLCAvLyBbMTBdXHJcbiAgICAgICAgXCJcIiwgLy8gWzExXVxyXG4gICAgICAgIFwiQ0xFQVJcIiwgLy8gWzEyXVxyXG4gICAgICAgIFwiRU5URVJcIiwgLy8gWzEzXVxyXG4gICAgICAgIFwiRU5URVIgU1BFQ0lBTFwiLCAvLyBbMTRdXHJcbiAgICAgICAgXCJcIiwgLy8gWzE1XVxyXG4gICAgICAgIFwiU0hJRlRcIiwgLy8gWzE2XVxyXG4gICAgICAgIFwiQ09OVFJPTFwiLCAvLyBbMTddXHJcbiAgICAgICAgXCJBTFRcIiwgLy8gWzE4XVxyXG4gICAgICAgIFwiUEFVU0VcIiwgLy8gWzE5XVxyXG4gICAgICAgIFwiQ0FQUyBMT0NLXCIsIC8vIFsyMF1cclxuICAgICAgICBcIktBTkFcIiwgLy8gWzIxXVxyXG4gICAgICAgIFwiRUlTVVwiLCAvLyBbMjJdXHJcbiAgICAgICAgXCJKVU5KQVwiLCAvLyBbMjNdXHJcbiAgICAgICAgXCJGSU5BTFwiLCAvLyBbMjRdXHJcbiAgICAgICAgXCJIQU5KQVwiLCAvLyBbMjVdXHJcbiAgICAgICAgXCJcIiwgLy8gWzI2XVxyXG4gICAgICAgIFwiRVNDQVBFXCIsIC8vIFsyN11cclxuICAgICAgICBcIkNPTlZFUlRcIiwgLy8gWzI4XVxyXG4gICAgICAgIFwiTk9OQ09OVkVSVFwiLCAvLyBbMjldXHJcbiAgICAgICAgXCJBQ0NFUFRcIiwgLy8gWzMwXVxyXG4gICAgICAgIFwiTU9ERUNIQU5HRVwiLCAvLyBbMzFdXHJcbiAgICAgICAgXCJTUEFDRVwiLCAvLyBbMzJdXHJcbiAgICAgICAgXCJQQUdFIFVQXCIsIC8vIFszM11cclxuICAgICAgICBcIlBBR0UgRE9XTlwiLCAvLyBbMzRdXHJcbiAgICAgICAgXCJFTkRcIiwgLy8gWzM1XVxyXG4gICAgICAgIFwiSE9NRVwiLCAvLyBbMzZdXHJcbiAgICAgICAgXCJMRUZUXCIsIC8vIFszN11cclxuICAgICAgICBcIlVQXCIsIC8vIFszOF1cclxuICAgICAgICBcIlJJR0hUXCIsIC8vIFszOV1cclxuICAgICAgICBcIkRPV05cIiwgLy8gWzQwXVxyXG4gICAgICAgIFwiU0VMRUNUXCIsIC8vIFs0MV1cclxuICAgICAgICBcIlBSSU5UXCIsIC8vIFs0Ml1cclxuICAgICAgICBcIkVYRUNVVEVcIiwgLy8gWzQzXVxyXG4gICAgICAgIFwiUFJJTlQgU0NSRUVOXCIsIC8vIFs0NF1cclxuICAgICAgICBcIklOU0VSVFwiLCAvLyBbNDVdXHJcbiAgICAgICAgXCJERUxFVEVcIiwgLy8gWzQ2XVxyXG4gICAgICAgIFwiXCIsIC8vIFs0N11cclxuICAgICAgICBcIjBcIiwgLy8gWzQ4XVxyXG4gICAgICAgIFwiMVwiLCAvLyBbNDldXHJcbiAgICAgICAgXCIyXCIsIC8vIFs1MF1cclxuICAgICAgICBcIjNcIiwgLy8gWzUxXVxyXG4gICAgICAgIFwiNFwiLCAvLyBbNTJdXHJcbiAgICAgICAgXCI1XCIsIC8vIFs1M11cclxuICAgICAgICBcIjZcIiwgLy8gWzU0XVxyXG4gICAgICAgIFwiN1wiLCAvLyBbNTVdXHJcbiAgICAgICAgXCI4XCIsIC8vIFs1Nl1cclxuICAgICAgICBcIjlcIiwgLy8gWzU3XVxyXG4gICAgICAgIFwiQ09MT05cIiwgLy8gWzU4XVxyXG4gICAgICAgIFwiU0VNSUNPTE9OXCIsIC8vIFs1OV1cclxuICAgICAgICBcIkxFU1MgVEhBTlwiLCAvLyBbNjBdXHJcbiAgICAgICAgXCJFUVVBTFNcIiwgLy8gWzYxXVxyXG4gICAgICAgIFwiR1JFQVRFUiBUSEFOXCIsIC8vIFs2Ml1cclxuICAgICAgICBcIlFVRVNUSU9OIE1BUktcIiwgLy8gWzYzXVxyXG4gICAgICAgIFwiQVRcIiwgLy8gWzY0XVxyXG4gICAgICAgIFwiQVwiLCAvLyBbNjVdXHJcbiAgICAgICAgXCJCXCIsIC8vIFs2Nl1cclxuICAgICAgICBcIkNcIiwgLy8gWzY3XVxyXG4gICAgICAgIFwiRFwiLCAvLyBbNjhdXHJcbiAgICAgICAgXCJFXCIsIC8vIFs2OV1cclxuICAgICAgICBcIkZcIiwgLy8gWzcwXVxyXG4gICAgICAgIFwiR1wiLCAvLyBbNzFdXHJcbiAgICAgICAgXCJIXCIsIC8vIFs3Ml1cclxuICAgICAgICBcIklcIiwgLy8gWzczXVxyXG4gICAgICAgIFwiSlwiLCAvLyBbNzRdXHJcbiAgICAgICAgXCJLXCIsIC8vIFs3NV1cclxuICAgICAgICBcIkxcIiwgLy8gWzc2XVxyXG4gICAgICAgIFwiTVwiLCAvLyBbNzddXHJcbiAgICAgICAgXCJOXCIsIC8vIFs3OF1cclxuICAgICAgICBcIk9cIiwgLy8gWzc5XVxyXG4gICAgICAgIFwiUFwiLCAvLyBbODBdXHJcbiAgICAgICAgXCJRXCIsIC8vIFs4MV1cclxuICAgICAgICBcIlJcIiwgLy8gWzgyXVxyXG4gICAgICAgIFwiU1wiLCAvLyBbODNdXHJcbiAgICAgICAgXCJUXCIsIC8vIFs4NF1cclxuICAgICAgICBcIlVcIiwgLy8gWzg1XVxyXG4gICAgICAgIFwiVlwiLCAvLyBbODZdXHJcbiAgICAgICAgXCJXXCIsIC8vIFs4N11cclxuICAgICAgICBcIlhcIiwgLy8gWzg4XVxyXG4gICAgICAgIFwiWVwiLCAvLyBbODldXHJcbiAgICAgICAgXCJaXCIsIC8vIFs5MF1cclxuICAgICAgICBcIk9TIEtFWVwiLCAvLyBbOTFdIFdpbmRvd3MgS2V5IChXaW5kb3dzKSBvciBDb21tYW5kIEtleSAoTWFjKVxyXG4gICAgICAgIFwiXCIsIC8vIFs5Ml1cclxuICAgICAgICBcIkNPTlRFWFQgTUVOVVwiLCAvLyBbOTNdXHJcbiAgICAgICAgXCJcIiwgLy8gWzk0XVxyXG4gICAgICAgIFwiU0xFRVBcIiwgLy8gWzk1XVxyXG4gICAgICAgIFwiTlVNUEFEMFwiLCAvLyBbOTZdXHJcbiAgICAgICAgXCJOVU1QQUQxXCIsIC8vIFs5N11cclxuICAgICAgICBcIk5VTVBBRDJcIiwgLy8gWzk4XVxyXG4gICAgICAgIFwiTlVNUEFEM1wiLCAvLyBbOTldXHJcbiAgICAgICAgXCJOVU1QQUQ0XCIsIC8vIFsxMDBdXHJcbiAgICAgICAgXCJOVU1QQUQ1XCIsIC8vIFsxMDFdXHJcbiAgICAgICAgXCJOVU1QQUQ2XCIsIC8vIFsxMDJdXHJcbiAgICAgICAgXCJOVU1QQUQ3XCIsIC8vIFsxMDNdXHJcbiAgICAgICAgXCJOVU1QQUQ4XCIsIC8vIFsxMDRdXHJcbiAgICAgICAgXCJOVU1QQUQ5XCIsIC8vIFsxMDVdXHJcbiAgICAgICAgXCJNVUxUSVBMWVwiLCAvLyBbMTA2XVxyXG4gICAgICAgIFwiQUREXCIsIC8vIFsxMDddXHJcbiAgICAgICAgXCJTRVBBUkFUT1JcIiwgLy8gWzEwOF1cclxuICAgICAgICBcIlNVQlRSQUNUXCIsIC8vIFsxMDldXHJcbiAgICAgICAgXCJERUNJTUFMXCIsIC8vIFsxMTBdXHJcbiAgICAgICAgXCJESVZJREVcIiwgLy8gWzExMV1cclxuICAgICAgICBcIkYxXCIsIC8vIFsxMTJdXHJcbiAgICAgICAgXCJGMlwiLCAvLyBbMTEzXVxyXG4gICAgICAgIFwiRjNcIiwgLy8gWzExNF1cclxuICAgICAgICBcIkY0XCIsIC8vIFsxMTVdXHJcbiAgICAgICAgXCJGNVwiLCAvLyBbMTE2XVxyXG4gICAgICAgIFwiRjZcIiwgLy8gWzExN11cclxuICAgICAgICBcIkY3XCIsIC8vIFsxMThdXHJcbiAgICAgICAgXCJGOFwiLCAvLyBbMTE5XVxyXG4gICAgICAgIFwiRjlcIiwgLy8gWzEyMF1cclxuICAgICAgICBcIkYxMFwiLCAvLyBbMTIxXVxyXG4gICAgICAgIFwiRjExXCIsIC8vIFsxMjJdXHJcbiAgICAgICAgXCJGMTJcIiwgLy8gWzEyM11cclxuICAgICAgICBcIkYxM1wiLCAvLyBbMTI0XVxyXG4gICAgICAgIFwiRjE0XCIsIC8vIFsxMjVdXHJcbiAgICAgICAgXCJGMTVcIiwgLy8gWzEyNl1cclxuICAgICAgICBcIkYxNlwiLCAvLyBbMTI3XVxyXG4gICAgICAgIFwiRjE3XCIsIC8vIFsxMjhdXHJcbiAgICAgICAgXCJGMThcIiwgLy8gWzEyOV1cclxuICAgICAgICBcIkYxOVwiLCAvLyBbMTMwXVxyXG4gICAgICAgIFwiRjIwXCIsIC8vIFsxMzFdXHJcbiAgICAgICAgXCJGMjFcIiwgLy8gWzEzMl1cclxuICAgICAgICBcIkYyMlwiLCAvLyBbMTMzXVxyXG4gICAgICAgIFwiRjIzXCIsIC8vIFsxMzRdXHJcbiAgICAgICAgXCJGMjRcIiwgLy8gWzEzNV1cclxuICAgICAgICBcIlwiLCAvLyBbMTM2XVxyXG4gICAgICAgIFwiXCIsIC8vIFsxMzddXHJcbiAgICAgICAgXCJcIiwgLy8gWzEzOF1cclxuICAgICAgICBcIlwiLCAvLyBbMTM5XVxyXG4gICAgICAgIFwiXCIsIC8vIFsxNDBdXHJcbiAgICAgICAgXCJcIiwgLy8gWzE0MV1cclxuICAgICAgICBcIlwiLCAvLyBbMTQyXVxyXG4gICAgICAgIFwiXCIsIC8vIFsxNDNdXHJcbiAgICAgICAgXCJOVU0gTE9DS1wiLCAvLyBbMTQ0XVxyXG4gICAgICAgIFwiU0NST0xMIExPQ0tcIiwgLy8gWzE0NV1cclxuICAgICAgICBcIldJTiBPRU0gRkogSklTSE9cIiwgLy8gWzE0Nl1cclxuICAgICAgICBcIldJTiBPRU0gRkogTUFTU0hPVVwiLCAvLyBbMTQ3XVxyXG4gICAgICAgIFwiV0lOIE9FTSBGSiBUT1VST0tVXCIsIC8vIFsxNDhdXHJcbiAgICAgICAgXCJXSU4gT0VNIEZKIExPWUFcIiwgLy8gWzE0OV1cclxuICAgICAgICBcIldJTiBPRU0gRkogUk9ZQVwiLCAvLyBbMTUwXVxyXG4gICAgICAgIFwiXCIsIC8vIFsxNTFdXHJcbiAgICAgICAgXCJcIiwgLy8gWzE1Ml1cclxuICAgICAgICBcIlwiLCAvLyBbMTUzXVxyXG4gICAgICAgIFwiXCIsIC8vIFsxNTRdXHJcbiAgICAgICAgXCJcIiwgLy8gWzE1NV1cclxuICAgICAgICBcIlwiLCAvLyBbMTU2XVxyXG4gICAgICAgIFwiXCIsIC8vIFsxNTddXHJcbiAgICAgICAgXCJcIiwgLy8gWzE1OF1cclxuICAgICAgICBcIlwiLCAvLyBbMTU5XVxyXG4gICAgICAgIFwiQ0lSQ1VNRkxFWFwiLCAvLyBbMTYwXVxyXG4gICAgICAgIFwiRVhDTEFNQVRJT05cIiwgLy8gWzE2MV1cclxuICAgICAgICBcIkRPVUJMRV9RVU9URVwiLCAvLyBbMTYyXVxyXG4gICAgICAgIFwiSEFTSFwiLCAvLyBbMTYzXVxyXG4gICAgICAgIFwiRE9MTEFSXCIsIC8vIFsxNjRdXHJcbiAgICAgICAgXCJQRVJDRU5UXCIsIC8vIFsxNjVdXHJcbiAgICAgICAgXCJBTVBFUlNBTkRcIiwgLy8gWzE2Nl1cclxuICAgICAgICBcIlVOREVSU0NPUkVcIiwgLy8gWzE2N11cclxuICAgICAgICBcIk9QRU4gUEFSRU5USEVTSVNcIiwgLy8gWzE2OF1cclxuICAgICAgICBcIkNMT1NFIFBBUkVOVEhFU0lTXCIsIC8vIFsxNjldXHJcbiAgICAgICAgXCJBU1RFUklTS1wiLCAvLyBbMTcwXVxyXG4gICAgICAgIFwiUExVU1wiLCAvLyBbMTcxXVxyXG4gICAgICAgIFwiUElQRVwiLCAvLyBbMTcyXVxyXG4gICAgICAgIFwiSFlQSEVOXCIsIC8vIFsxNzNdXHJcbiAgICAgICAgXCJPUEVOIENVUkxZIEJSQUNLRVRcIiwgLy8gWzE3NF1cclxuICAgICAgICBcIkNMT1NFIENVUkxZIEJSQUNLRVRcIiwgLy8gWzE3NV1cclxuICAgICAgICBcIlRJTERFXCIsIC8vIFsxNzZdXHJcbiAgICAgICAgXCJcIiwgLy8gWzE3N11cclxuICAgICAgICBcIlwiLCAvLyBbMTc4XVxyXG4gICAgICAgIFwiXCIsIC8vIFsxNzldXHJcbiAgICAgICAgXCJcIiwgLy8gWzE4MF1cclxuICAgICAgICBcIlZPTFVNRSBNVVRFXCIsIC8vIFsxODFdXHJcbiAgICAgICAgXCJWT0xVTUUgRE9XTlwiLCAvLyBbMTgyXVxyXG4gICAgICAgIFwiVk9MVU1FIFVQXCIsIC8vIFsxODNdXHJcbiAgICAgICAgXCJcIiwgLy8gWzE4NF1cclxuICAgICAgICBcIlwiLCAvLyBbMTg1XVxyXG4gICAgICAgIFwiU0VNSUNPTE9OXCIsIC8vIFsxODZdXHJcbiAgICAgICAgXCJFUVVBTFNcIiwgLy8gWzE4N11cclxuICAgICAgICBcIkNPTU1BXCIsIC8vIFsxODhdXHJcbiAgICAgICAgXCJNSU5VU1wiLCAvLyBbMTg5XVxyXG4gICAgICAgIFwiUEVSSU9EXCIsIC8vIFsxOTBdXHJcbiAgICAgICAgXCJTTEFTSFwiLCAvLyBbMTkxXVxyXG4gICAgICAgIFwiQkFDSyBRVU9URVwiLCAvLyBbMTkyXVxyXG4gICAgICAgIFwiXCIsIC8vIFsxOTNdXHJcbiAgICAgICAgXCJcIiwgLy8gWzE5NF1cclxuICAgICAgICBcIlwiLCAvLyBbMTk1XVxyXG4gICAgICAgIFwiXCIsIC8vIFsxOTZdXHJcbiAgICAgICAgXCJcIiwgLy8gWzE5N11cclxuICAgICAgICBcIlwiLCAvLyBbMTk4XVxyXG4gICAgICAgIFwiXCIsIC8vIFsxOTldXHJcbiAgICAgICAgXCJcIiwgLy8gWzIwMF1cclxuICAgICAgICBcIlwiLCAvLyBbMjAxXVxyXG4gICAgICAgIFwiXCIsIC8vIFsyMDJdXHJcbiAgICAgICAgXCJcIiwgLy8gWzIwM11cclxuICAgICAgICBcIlwiLCAvLyBbMjA0XVxyXG4gICAgICAgIFwiXCIsIC8vIFsyMDVdXHJcbiAgICAgICAgXCJcIiwgLy8gWzIwNl1cclxuICAgICAgICBcIlwiLCAvLyBbMjA3XVxyXG4gICAgICAgIFwiXCIsIC8vIFsyMDhdXHJcbiAgICAgICAgXCJcIiwgLy8gWzIwOV1cclxuICAgICAgICBcIlwiLCAvLyBbMjEwXVxyXG4gICAgICAgIFwiXCIsIC8vIFsyMTFdXHJcbiAgICAgICAgXCJcIiwgLy8gWzIxMl1cclxuICAgICAgICBcIlwiLCAvLyBbMjEzXVxyXG4gICAgICAgIFwiXCIsIC8vIFsyMTRdXHJcbiAgICAgICAgXCJcIiwgLy8gWzIxNV1cclxuICAgICAgICBcIlwiLCAvLyBbMjE2XVxyXG4gICAgICAgIFwiXCIsIC8vIFsyMTddXHJcbiAgICAgICAgXCJcIiwgLy8gWzIxOF1cclxuICAgICAgICBcIk9QRU4gQlJBQ0tFVFwiLCAvLyBbMjE5XVxyXG4gICAgICAgIFwiQkFDSyBTTEFTSFwiLCAvLyBbMjIwXVxyXG4gICAgICAgIFwiQ0xPU0UgQlJBQ0tFVFwiLCAvLyBbMjIxXVxyXG4gICAgICAgIFwiUVVPVEVcIiwgLy8gWzIyMl1cclxuICAgICAgICBcIlwiLCAvLyBbMjIzXVxyXG4gICAgICAgIFwiTUVUQVwiLCAvLyBbMjI0XVxyXG4gICAgICAgIFwiQUxUIEdSQVBIXCIsIC8vIFsyMjVdXHJcbiAgICAgICAgXCJcIiwgLy8gWzIyNl1cclxuICAgICAgICBcIldJTiBJQ08gSEVMUFwiLCAvLyBbMjI3XVxyXG4gICAgICAgIFwiV0lOIElDTyAwMFwiLCAvLyBbMjI4XVxyXG4gICAgICAgIFwiXCIsIC8vIFsyMjldXHJcbiAgICAgICAgXCJXSU4gSUNPIENMRUFSXCIsIC8vIFsyMzBdXHJcbiAgICAgICAgXCJcIiwgLy8gWzIzMV1cclxuICAgICAgICBcIlwiLCAvLyBbMjMyXVxyXG4gICAgICAgIFwiV0lOIE9FTSBSRVNFVFwiLCAvLyBbMjMzXVxyXG4gICAgICAgIFwiV0lOIE9FTSBKVU1QXCIsIC8vIFsyMzRdXHJcbiAgICAgICAgXCJXSU4gT0VNIFBBMVwiLCAvLyBbMjM1XVxyXG4gICAgICAgIFwiV0lOIE9FTSBQQTJcIiwgLy8gWzIzNl1cclxuICAgICAgICBcIldJTiBPRU0gUEEzXCIsIC8vIFsyMzddXHJcbiAgICAgICAgXCJXSU4gT0VNIFdTQ1RSTFwiLCAvLyBbMjM4XVxyXG4gICAgICAgIFwiV0lOIE9FTSBDVVNFTFwiLCAvLyBbMjM5XVxyXG4gICAgICAgIFwiV0lOIE9FTSBBVFROXCIsIC8vIFsyNDBdXHJcbiAgICAgICAgXCJXSU4gT0VNIEZJTklTSFwiLCAvLyBbMjQxXVxyXG4gICAgICAgIFwiV0lOIE9FTSBDT1BZXCIsIC8vIFsyNDJdXHJcbiAgICAgICAgXCJXSU4gT0VNIEFVVE9cIiwgLy8gWzI0M11cclxuICAgICAgICBcIldJTiBPRU0gRU5MV1wiLCAvLyBbMjQ0XVxyXG4gICAgICAgIFwiV0lOIE9FTSBCQUNLVEFCXCIsIC8vIFsyNDVdXHJcbiAgICAgICAgXCJBVFROXCIsIC8vIFsyNDZdXHJcbiAgICAgICAgXCJDUlNFTFwiLCAvLyBbMjQ3XVxyXG4gICAgICAgIFwiRVhTRUxcIiwgLy8gWzI0OF1cclxuICAgICAgICBcIkVSRU9GXCIsIC8vIFsyNDldXHJcbiAgICAgICAgXCJQTEFZXCIsIC8vIFsyNTBdXHJcbiAgICAgICAgXCJaT09NXCIsIC8vIFsyNTFdXHJcbiAgICAgICAgXCJcIiwgLy8gWzI1Ml1cclxuICAgICAgICBcIlBBMVwiLCAvLyBbMjUzXVxyXG4gICAgICAgIFwiV0lOIE9FTSBDTEVBUlwiLCAvLyBbMjU0XVxyXG4gICAgICAgIFwiVE9HR0xFIFRPVUNIUEFEXCIgLy8gWzI1NV1cclxuICAgIF0vLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xNzcyMTc5L2dldC1jaGFyYWN0ZXItdmFsdWUtZnJvbS1rZXljb2RlLWluLWphdmFzY3JpcHQtdGhlbi10cmltXHJcbn1cclxuXHJcbmNvbnN0IEF1ZGlvQXNzZXRzID0ge1xyXG4gICAgdWk6IHtcclxuICAgICAgICBpbnZlbnRvcnlDbGFjazogbmV3IEF1ZGlvUmVzb3VyY2VHcm91cChbbmV3IEF1ZGlvUmVzb3VyY2UoJ2Fzc2V0cy9zb3VuZHMvc2Z4L3VpL2NsYWNrMS5tcDMnKSwgbmV3IEF1ZGlvUmVzb3VyY2UoJ2Fzc2V0cy9zb3VuZHMvc2Z4L3VpL2NsYWNrMi5tcDMnKSwgbmV3IEF1ZGlvUmVzb3VyY2UoJ2Fzc2V0cy9zb3VuZHMvc2Z4L3VpL2NsYWNrMy5tcDMnKV0pXHJcbiAgICB9LFxyXG4gICAgbXVzaWM6IHtcclxuICAgICAgICB0aXRsZVNjcmVlbjogbmV3IEF1ZGlvUmVzb3VyY2UoJ2Fzc2V0cy9zb3VuZHMvbXVzaWMvVGl0bGVTY3JlZW4ubXAzJylcclxuICAgIH0sXHJcbiAgICBhbWJpZW50OiB7XHJcbiAgICAgICAgd2ludGVyMTogbmV3IEF1ZGlvUmVzb3VyY2UoJ2Fzc2V0cy9zb3VuZHMvc2Z4L2FtYmllbnQvNjU4MTNfX3BjYWVsZHJpZXNfX2NvdW50cnlzaWRld2ludGVyZXZlbmluZzAyLndhdicpXHJcbiAgICB9XHJcbn1cclxuXHJcbnR5cGUgQW5pbWF0aW9uRnJhbWU8VCBleHRlbmRzIFJlY29yZDxzdHJpbmcsIEltYWdlUmVzb3VyY2VbXT4+ID0ga2V5b2YgVFxyXG5cclxuLy8gY29uc3QgYW5pbWF0aW9ucyA9IDxUIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgSW1hZ2VSZXNvdXJjZVtdPj4oZGF0YTogVCk6IFQgPT4gZGF0YVxyXG5cclxuY29uc3QgUGxheWVyQW5pbWF0aW9ucyA9IHtcclxuICAgIGlkbGU6IFtcclxuICAgICAgICBuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvcGxheWVyL2NoYXJhY3Rlci5wbmcnKSxcclxuICAgIF1cclxufVxyXG5cclxuXHJcbmNvbnN0IGxvYWRBc3NldHMgPSAoc2tldGNoOiBQNSwgLi4uYXNzZXRzOiBBc3NldEdyb3VwW10pID0+IHtcclxuICAgIGFzc2V0cy5mb3JFYWNoKChhc3NldEdyb3VwKSA9PiB7XHJcbiAgICAgICAgc2VhcmNoR3JvdXAoYXNzZXRHcm91cCwgc2tldGNoKTtcclxuICAgIH0pO1xyXG5cclxufTtcclxuXHJcbmZ1bmN0aW9uIHNlYXJjaEdyb3VwKGFzc2V0R3JvdXA6IEFzc2V0R3JvdXAgfCBSZXNvdXJjZSB8IEF1ZGlvUmVzb3VyY2UgfCBBdWRpb1Jlc291cmNlR3JvdXAgfCBJbWFnZVJlc291cmNlW10sIHNrZXRjaDogUDUpIHtcclxuICAgIGlmIChhc3NldEdyb3VwIGluc3RhbmNlb2YgUmVzb3VyY2UpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhgTG9hZGluZyBhc3NldCAke2Fzc2V0R3JvdXAucGF0aH1gKTtcclxuICAgICAgICBhc3NldEdyb3VwLmxvYWRSZXNvdXJjZShza2V0Y2gpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIE9iamVjdC5lbnRyaWVzKGFzc2V0R3JvdXApLmZvckVhY2goKGFzc2V0KSA9PiB7XHJcbiAgICAgICAgc2VhcmNoR3JvdXAoYXNzZXRbMV0sIHNrZXRjaCk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IHsgQXVkaW9Bc3NldHMsIFVpQXNzZXRzLCBJdGVtc0Fzc2V0cywgV29ybGRBc3NldHMsIEZvbnRzLCBLZXlzLCBQbGF5ZXJBbmltYXRpb25zLCBBbmltYXRpb25GcmFtZSwgbG9hZEFzc2V0cyB9O1xyXG4iLCJpbXBvcnQgUDUgZnJvbSAncDUnO1xyXG5pbXBvcnQgUmVzb3VyY2UgZnJvbSAnLi9SZXNvdXJjZSc7XHJcbmltcG9ydCB7IEF1ZGlvVHlwZSB9IGZyb20gJ3RzLWF1ZGlvJztcclxuaW1wb3J0IEF1ZGlvIGZyb20gJ3RzLWF1ZGlvJztcclxuXHJcblxyXG5jbGFzcyBBdWRpb1Jlc291cmNlIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gICAgc291bmQ6IEF1ZGlvVHlwZVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBhdGg6IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKHBhdGgpO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWRSZXNvdXJjZShnYW1lOiBQNSkge1xyXG4gICAgICAgIHRoaXMuc291bmQgPSBBdWRpbyh7XHJcbiAgICAgICAgICAgIGZpbGU6IHRoaXMucGF0aCxcclxuICAgICAgICAgICAgbG9vcDogZmFsc2UsXHJcbiAgICAgICAgICAgIHZvbHVtZTogMS4wLFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHBsYXlSYW5kb20oKSB7XHJcbiAgICAvLyAgICAgLy8gVmVyaWZ5IHRoYXQgdGhlIHNvdW5kIGhhcyBiZWVuIGxvYWRlZFxyXG4gICAgLy8gICAgIGlmICh0aGlzLnNvdW5kID09PSB1bmRlZmluZWQpXHJcbiAgICAvLyAgICAgICAgIHRocm93IG5ldyBFcnJvcihcclxuICAgIC8vICAgICAgICAgICAgIGBUcmllZCB0byBwbGF5IHNvdW5kIGJlZm9yZSBsb2FkaW5nIGl0OiAke3RoaXMucGF0aH1gXHJcbiAgICAvLyAgICAgICAgICk7XHJcblxyXG4gICAgLy8gICAgIHRoaXMuc291bmQucGxheSgpO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIHBsYXlTb3VuZCgpIHsvLyBwbGF5IHRoZSBzb3VuZFxyXG4gICAgICAgIC8vVmVyaWZ5IHRoYXQgdGhlIHNvdW5kIGhhcyBiZWVuIGxvYWRlZFxyXG4gICAgICAgIGlmICh0aGlzLnNvdW5kID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcclxuICAgICAgICAgICAgICAgIGBUcmllZCB0byBwbGF5IHNvdW5kIGJlZm9yZSBsb2FkaW5nIGl0OiAke3RoaXMucGF0aH1gXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgdGhpcy5zb3VuZC5wYXVzZSgpO1xyXG4gICAgICAgIHRoaXMuc291bmQucGxheSgpO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuZXhwb3J0ID0gQXVkaW9SZXNvdXJjZTtcclxuIiwiaW1wb3J0IEF1ZGlvUmVzb3VyY2UgZnJvbSAnLi9BdWRpb1Jlc291cmNlJztcclxuaW1wb3J0IFA1IGZyb20gXCJwNVwiO1xyXG5cclxuY2xhc3MgQXVkaW9SZXNvdXJjZUdyb3VwIHtcclxuXHJcbiAgICBzb3VuZHM6IEF1ZGlvUmVzb3VyY2VbXVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHNvdW5kczogQXVkaW9SZXNvdXJjZVtdKSB7Ly8gcGFzcyBpbiBhbiBhcnJheSBvZiBBdWRpb1Jlc291cmNlcyB0aGF0IGFyZSBhbGwgc2ltaWxhclxyXG4gICAgICAgIHRoaXMuc291bmRzID0gc291bmRzO1xyXG4gICAgfVxyXG5cclxuICAgIHBsYXlSYW5kb20oKSB7Ly8gcGxheSBhIHJhbmRvbSBzb3VuZFxyXG4gICAgICAgIGlmKHRoaXMuc291bmRzID09PSB1bmRlZmluZWQgfHwgdGhpcy5zb3VuZHMubGVuZ3RoID09PSAwKVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAgICAgICAgICAgICBgVGhlcmUgYXJlIG5vIHNvdW5kczogJHt0aGlzLnNvdW5kc31gXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgY29uc3QgciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHRoaXMuc291bmRzLmxlbmd0aCk7XHJcbiAgICAgICAgdGhpcy5zb3VuZHNbcl0ucGxheVNvdW5kKCk7Ly8gcGxheSBhIHJhbmRvbSBzb3VuZCBmcm9tIHRoZSBhcnJheSBhdCBhIHNsaWdodGx5IHJhbmRvbWl6ZWQgcGl0Y2gsIGxlYWRpbmcgdG8gdGhlIGVmZmVjdCBvZiBpdCBtYWtpbmcgYSBuZXcgc291bmQgZWFjaCB0aW1lLCByZW1vdmluZyByZXBldGl0aXZlbmVzc1xyXG5cclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCA9IEF1ZGlvUmVzb3VyY2VHcm91cDsiLCJpbXBvcnQgSW1hZ2VSZXNvdXJjZSBmcm9tICcuL0ltYWdlUmVzb3VyY2UnO1xyXG5pbXBvcnQgcDUgZnJvbSAncDUnO1xyXG5pbXBvcnQgZ2FtZSBmcm9tICcuLi8uLi9NYWluJ1xyXG5cclxuY2xhc3MgRm9udFJlc291cmNlIGV4dGVuZHMgSW1hZ2VSZXNvdXJjZSB7XHJcblxyXG4gICAgYWxwaGFiZXRfc291cDoge1tsZXR0ZXI6IHN0cmluZ106IHt4OiBudW1iZXIsIHk6IG51bWJlciwgdzogbnVtYmVyLCBoOiBudW1iZXJ9fSA9IHt9XHJcblxyXG4gICAgY29uc3RydWN0b3IocGF0aDogc3RyaW5nLCBjaGFyYWN0ZXJEYXRhOiB7W2xldHRlcjogc3RyaW5nXTogbnVtYmVyfSwgY2hhcmFjdGVyT3JkZXI6IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKHBhdGgpO1xyXG4gICAgICAgIGxldCBydW5uaW5nVG90YWwgPSAwXHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaTxjaGFyYWN0ZXJPcmRlci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmFscGhhYmV0X3NvdXBbY2hhcmFjdGVyT3JkZXJbaV1dID0ge3g6IHJ1bm5pbmdUb3RhbCwgeTogMCwgdzogY2hhcmFjdGVyRGF0YVtjaGFyYWN0ZXJPcmRlcltpXV0sIGg6IDEyfVxyXG4gICAgICAgICAgICBydW5uaW5nVG90YWwgKz0gY2hhcmFjdGVyRGF0YVtjaGFyYWN0ZXJPcmRlcltpXV0gKyAxXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGNoYXJhY3Rlck9yZGVyW2ldK1wiOiBcIitjaGFyYWN0ZXJEYXRhW2NoYXJhY3Rlck9yZGVyW2ldXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGRyYXdUZXh0KHRhcmdldDogcDUsIHN0cjogc3RyaW5nLCB4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG4gICAgICAgIGxldCB4T2Zmc2V0OiBudW1iZXIgPSAwO1xyXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGk8c3RyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVuZGVyUGFydGlhbCh0YXJnZXQsIHgreE9mZnNldCpnYW1lLnVwc2NhbGVTaXplLCB5LCB0aGlzLmFscGhhYmV0X3NvdXBbc3RyW2ldXS53KmdhbWUudXBzY2FsZVNpemUsIHRoaXMuYWxwaGFiZXRfc291cFtzdHJbaV1dLmgqZ2FtZS51cHNjYWxlU2l6ZSwgdGhpcy5hbHBoYWJldF9zb3VwW3N0cltpXV0ueCwgdGhpcy5hbHBoYWJldF9zb3VwW3N0cltpXV0ueSwgdGhpcy5hbHBoYWJldF9zb3VwW3N0cltpXV0udywgdGhpcy5hbHBoYWJldF9zb3VwW3N0cltpXV0uaCk7XHJcbiAgICAgICAgICAgIHhPZmZzZXQgKz0gdGhpcy5hbHBoYWJldF9zb3VwW3N0cltpXV0udysxO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5leHBvcnQgPSBGb250UmVzb3VyY2U7IiwiaW1wb3J0IFA1IGZyb20gJ3A1JztcclxuaW1wb3J0IFJlc291cmNlIGZyb20gJy4vUmVzb3VyY2UnO1xyXG5cclxuY2xhc3MgSW1hZ2VSZXNvdXJjZSBleHRlbmRzIFJlc291cmNlIHtcclxuICAgIGltYWdlOiBQNS5JbWFnZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwYXRoOiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcihwYXRoKTtcclxuICAgIH1cclxuXHJcbiAgICBsb2FkUmVzb3VyY2UoZ2FtZTogUDUpIHtcclxuICAgICAgICB0aGlzLmltYWdlID0gZ2FtZS5sb2FkSW1hZ2UodGhpcy5wYXRoKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIodGFyZ2V0OiBhbnksIHg6IG51bWJlciwgeTogbnVtYmVyLCB3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcikge1xyXG4gICAgICAgIC8vIFZlcmlmeSB0aGF0IHRoZSB0aWxlcyBoYXMgYmVlbiBsb2FkZWRcclxuICAgICAgICBpZiAodGhpcy5pbWFnZSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAgICAgICAgICAgICBgVHJpZWQgdG8gcmVuZGVyIGltYWdlIGJlZm9yZSBsb2FkaW5nIGl0OiAke3RoaXMucGF0aH1gXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIC8vIERyYXcgbm9uIHRpbGVzIGltYWdlXHJcbiAgICAgICAgdGFyZ2V0LmltYWdlKHRoaXMuaW1hZ2UsIHgsIHksIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICByZW5kZXJQYXJ0aWFsKFxyXG4gICAgICAgIHRhcmdldDogYW55LFxyXG4gICAgICAgIHg6IG51bWJlcixcclxuICAgICAgICB5OiBudW1iZXIsXHJcbiAgICAgICAgd2lkdGg6IG51bWJlcixcclxuICAgICAgICBoZWlnaHQ6IG51bWJlcixcclxuICAgICAgICBzb3VyY2VYPzogbnVtYmVyLFxyXG4gICAgICAgIHNvdXJjZVk/OiBudW1iZXIsXHJcbiAgICAgICAgc291cmNlV2lkdGg/OiBudW1iZXIsXHJcbiAgICAgICAgc291cmNlSGVpZ2h0PzogbnVtYmVyXHJcbiAgICApIHtcclxuICAgICAgICAvLyBWZXJpZnkgdGhhdCB0aGUgdGlsZXMgaGFzIGJlZW4gbG9hZGVkXHJcbiAgICAgICAgaWYgKHRoaXMuaW1hZ2UgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxyXG4gICAgICAgICAgICAgICAgYFRyaWVkIHRvIHJlbmRlciBpbWFnZSBiZWZvcmUgbG9hZGluZyBpdDogJHt0aGlzLnBhdGh9YFxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAvLyBEcmF3IGEgcGFydGlhbCBwYXJ0IG9mIHRoZSBpbWFnZVxyXG4gICAgICAgIHRhcmdldC5pbWFnZShcclxuICAgICAgICAgICAgdGhpcy5pbWFnZSxcclxuICAgICAgICAgICAgeCxcclxuICAgICAgICAgICAgeSxcclxuICAgICAgICAgICAgd2lkdGgsXHJcbiAgICAgICAgICAgIGhlaWdodCxcclxuICAgICAgICAgICAgc291cmNlWCxcclxuICAgICAgICAgICAgc291cmNlWSxcclxuICAgICAgICAgICAgc291cmNlV2lkdGgsXHJcbiAgICAgICAgICAgIHNvdXJjZUhlaWdodFxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCA9IEltYWdlUmVzb3VyY2U7XHJcbiIsImltcG9ydCBSZXNvdXJjZSBmcm9tIFwiLi9SZXNvdXJjZVwiO1xyXG5pbXBvcnQgUDUgZnJvbSAncDUnO1xyXG5pbXBvcnQgR2FtZSBmcm9tIFwiLi4vLi4vR2FtZVwiO1xyXG5pbXBvcnQgeyBXb3JsZFRpbGVzIH0gZnJvbSAnLi4vLi4vd29ybGQvV29ybGRUaWxlcydcclxuaW1wb3J0IHsgVGlsZVR5cGUgfSBmcm9tIFwiLi4vLi4vLi4vLi4vYXBpL1RpbGVcIlxyXG5cclxuZXhwb3J0ID0gY2xhc3MgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG5cclxuICAgIGltYWdlOiBQNS5JbWFnZTtcclxuICAgIGhhc1JlZmxlY3Rpb246IGJvb2xlYW4gPSBmYWxzZTs7XHJcbiAgICByZWZsZWN0aW9uOiBQNS5JbWFnZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwYXRoOiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcihwYXRoKTtcclxuICAgIH1cclxuXHJcbiAgICBsb2FkUmVzb3VyY2UoZ2FtZTogUDUpIHtcclxuICAgICAgICB0aGlzLmltYWdlID0gZ2FtZS5sb2FkSW1hZ2UodGhpcy5wYXRoKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIodGFyZ2V0OiBhbnksIHg6IG51bWJlciwgeTogbnVtYmVyLCB3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcikge1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coV29ybGRUaWxlcyk7XHJcbiAgICAgICAgLy8gVmVyaWZ5IHRoYXQgdGhlIGltYWdlIGhhcyBiZWVuIGxvYWRlZFxyXG4gICAgICAgIGlmICh0aGlzLmltYWdlID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcclxuICAgICAgICAgICAgICAgIGBUcmllZCB0byByZW5kZXIgaW1hZ2UgYmVmb3JlIGxvYWRpbmcgaXQ6ICR7dGhpcy5wYXRofWBcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgLy8gRHJhdyBub24gdGlsZXMgaW1hZ2VcclxuICAgICAgICB0YXJnZXQuaW1hZ2UodGhpcy5pbWFnZSwgeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHJlbmRlcldvcmxkc3BhY2VSZWZsZWN0aW9uKHRhcmdldDogR2FtZSwgeDogbnVtYmVyLCB5OiBudW1iZXIsIHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyKSB7Ly90aGlzIGlzIGJyb2tlblxyXG4gICAgICAgIGlmICh0aGlzLmltYWdlID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcclxuICAgICAgICAgICAgICAgIGBUcmllZCB0byByZW5kZXIgcmVmbGVjdGlvbiBvZiBpbWFnZSBiZWZvcmUgbG9hZGluZyBpdDogJHt0aGlzLnBhdGh9YFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIGlmKCF0aGlzLmhhc1JlZmxlY3Rpb24pIHsvL3RoaXMgaXMgc28gaXQgZG9lc24ndCBsb2FkIHRoZW0gYWxsIGF0IG9uY2UgYW5kIGluc3RlYWQgbWFrZXMgdGhlIHJlZmxlY3Rpb25zIHdoZW4gdGhleSBhcmUgbmVlZGVkXHJcbiAgICAgICAgICAgIHRoaXMuaGFzUmVmbGVjdGlvbiA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMucmVmbGVjdGlvbiA9IHRhcmdldC5jcmVhdGVJbWFnZSh0aGlzLmltYWdlLndpZHRoLCB0aGlzLmltYWdlLmhlaWdodCk7XHJcbiAgICAgICAgICAgIHRoaXMucmVmbGVjdGlvbi5sb2FkUGl4ZWxzKCk7XHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2UubG9hZFBpeGVscygpO1xyXG4gICAgICAgICAgICBmb3IobGV0IGkgPSAwOyBpPHRoaXMucmVmbGVjdGlvbi53aWR0aDsgaSsrKSB7Ly9nZW5lcmF0ZSBhIHJlZmxlY3Rpb24gaW1hZ2UgdGhhdCBpcyBkaXNwbGF5ZWQgYXMgYSByZWZsZWN0aW9uXHJcbiAgICAgICAgICAgICAgICBmb3IobGV0IGogPSAwOyBqPHRoaXMucmVmbGVjdGlvbi5oZWlnaHQ7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvcihsZXQgayA9IDA7IGs8MzsgaysrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVmbGVjdGlvbi5waXhlbHNbNCooaip0aGlzLnJlZmxlY3Rpb24ud2lkdGgraSkra10gPSB0aGlzLmltYWdlLnBpeGVsc1s0KigodGhpcy5pbWFnZS5oZWlnaHQtai0xKSp0aGlzLmltYWdlLndpZHRoK2kpK2tdO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlZmxlY3Rpb24ucGl4ZWxzWzQqKGoqdGhpcy5yZWZsZWN0aW9uLndpZHRoK2kpKzNdID0gXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbWFnZS5waXhlbHNbNCooKHRoaXMuaW1hZ2UuaGVpZ2h0LWotMSkqdGhpcy5pbWFnZS53aWR0aCtpKSszXSAqIFxyXG4gICAgICAgICAgICAgICAgICAgICgodGhpcy5yZWZsZWN0aW9uLmhlaWdodC1qKS90aGlzLnJlZmxlY3Rpb24uaGVpZ2h0KSAqIFxyXG4gICAgICAgICAgICAgICAgICAgICh0aGlzLnJlZmxlY3Rpb24ud2lkdGgvMiswLjUtTWF0aC5hYnMoaS10aGlzLnJlZmxlY3Rpb24ud2lkdGgvMiswLjUpKS8odGhpcy5yZWZsZWN0aW9uLndpZHRoLzIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMucmVmbGVjdGlvbi51cGRhdGVQaXhlbHMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgICAgIHRhcmdldC5maWxsKDI1NSwgMCwgMCk7XHJcbiAgICAgICAgICAgIHRhcmdldC5zdHJva2UoMTUwLCAwLCAwKTtcclxuXHJcbiAgICAgICAgLy9sb29wIHRocm91Z2ggZXZlcnkgdGlsZSBpdCBwYXNzZXMgdGhyb3VnaFxyXG4gICAgICAgIGZvcihsZXQgaSA9IE1hdGguZmxvb3IoeCk7IGk8eCt3aWR0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaiA9IE1hdGguZmxvb3IoeSk7IGo8eStoZWlnaHQ7IGorKykge1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2codGFyZ2V0LndvcmxkLndvcmxkVGlsZXMpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGN1cnJlbnRCbG9jazogbnVtYmVyID0gdGFyZ2V0LndvcmxkLndvcmxkVGlsZXNbaiAqIHRhcmdldC53b3JsZFdpZHRoICsgaV07XHJcbiAgICAgICAgICAgICAgICBpZihjdXJyZW50QmxvY2sgPT09IHVuZGVmaW5lZCB8fCBjdXJyZW50QmxvY2sgPT0gVGlsZVR5cGUuQWlyIHx8IGN1cnJlbnRCbG9jayA9PSBUaWxlVHlwZS5UaWxlRW50aXR5KSB7Ly90aGUgcmVmZXJlbmNlIHRvIFRpbGVFbnRpdHkgY2FuIGJlIHJlbW92ZWQgYXMgc29vbiBhcyB0aGUgYmV0dGVyIHN5c3RlbSBpcyBpbiBwbGFjZVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0LnRpbnQoMjU1LCAxNTApOy8vVE9ETyBtYWtlIGl0IHNvbWV3aGF0IHRyYW5zbHVjZW50IGJhc2VkIG9uIHRoZSByZWZsZWN0aXZpdHkgb2YgdGhlIHRpbGVcclxuICAgICAgICAgICAgICAgIHRhcmdldC5pbWFnZShcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlZmxlY3Rpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgKGkgKiB0YXJnZXQuVElMRV9XSURUSCAtXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldC5pbnRlcnBvbGF0ZWRDYW1YICogdGFyZ2V0LlRJTEVfV0lEVEgpICpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAoaiAqIHRhcmdldC5USUxFX0hFSUdIVCAtXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQuaW50ZXJwb2xhdGVkQ2FtWSAqIHRhcmdldC5USUxFX0hFSUdIVCkgKlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldC5USUxFX1dJRFRIKnRhcmdldC51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXQuVElMRV9IRUlHSFQqdGFyZ2V0LnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICAgICAgICAgIChpLXgpKnRhcmdldC5USUxFX1dJRFRILFxyXG4gICAgICAgICAgICAgICAgICAgIChqLXkpKnRhcmdldC5USUxFX0hFSUdIVCxcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXQuVElMRV9XSURUSCxcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXQuVElMRV9IRUlHSFRcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQubm9UaW50KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyUGFydGlhbChcclxuICAgICAgICB0YXJnZXQ6IGFueSxcclxuICAgICAgICB4OiBudW1iZXIsXHJcbiAgICAgICAgeTogbnVtYmVyLFxyXG4gICAgICAgIHdpZHRoOiBudW1iZXIsXHJcbiAgICAgICAgaGVpZ2h0OiBudW1iZXIsXHJcbiAgICAgICAgc291cmNlWD86IG51bWJlcixcclxuICAgICAgICBzb3VyY2VZPzogbnVtYmVyLFxyXG4gICAgICAgIHNvdXJjZVdpZHRoPzogbnVtYmVyLFxyXG4gICAgICAgIHNvdXJjZUhlaWdodD86IG51bWJlclxyXG4gICAgKSB7XHJcbiAgICAgICAgLy8gVmVyaWZ5IHRoYXQgdGhlIHRpbGVzIGhhcyBiZWVuIGxvYWRlZFxyXG4gICAgICAgIGlmICh0aGlzLmltYWdlID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcclxuICAgICAgICAgICAgICAgIGBUcmllZCB0byByZW5kZXIgaW1hZ2UgYmVmb3JlIGxvYWRpbmcgaXQ6ICR7dGhpcy5wYXRofWBcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgLy8gRHJhdyBhIHBhcnRpYWwgcGFydCBvZiB0aGUgaW1hZ2VcclxuICAgICAgICB0YXJnZXQuaW1hZ2UoXHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2UsXHJcbiAgICAgICAgICAgIHgsXHJcbiAgICAgICAgICAgIHksXHJcbiAgICAgICAgICAgIHdpZHRoLFxyXG4gICAgICAgICAgICBoZWlnaHQsXHJcbiAgICAgICAgICAgIHNvdXJjZVgsXHJcbiAgICAgICAgICAgIHNvdXJjZVksXHJcbiAgICAgICAgICAgIHNvdXJjZVdpZHRoLFxyXG4gICAgICAgICAgICBzb3VyY2VIZWlnaHRcclxuICAgICAgICApO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IFA1IGZyb20gJ3A1JztcclxuXHJcbmFic3RyYWN0IGNsYXNzIFJlc291cmNlIHtcclxuICAgIHBhdGg6IHN0cmluZztcclxuXHJcbiAgICBwcm90ZWN0ZWQgY29uc3RydWN0b3IocGF0aDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5wYXRoID0gcGF0aDtcclxuICAgIH1cclxuXHJcbiAgICBhYnN0cmFjdCBsb2FkUmVzb3VyY2Uoc2tldGNoOiBQNSk6IHZvaWQ7XHJcbn1cclxuXHJcbmV4cG9ydCA9IFJlc291cmNlO1xyXG4iLCJpbXBvcnQgSW1hZ2VSZXNvdXJjZSBmcm9tICcuL0ltYWdlUmVzb3VyY2UnO1xyXG5cclxuY2xhc3MgVGlsZVJlc291cmNlIGV4dGVuZHMgSW1hZ2VSZXNvdXJjZSB7XHJcbiAgICAvLyBUaGUgd2lkdGggYW5kIGhlaWdodCBvZiB0aGUgdGlsZXMgc2V0XHJcbiAgICB3aWR0aDogbnVtYmVyO1xyXG4gICAgaGVpZ2h0OiBudW1iZXI7XHJcblxyXG4gICAgLy8gVGhlIHdpZHRoIGFuZCBoZWlnaHQgb2YgZWFjaCB0aWxlcyBpbiBwaXhlbHNcclxuICAgIHRpbGVXaWR0aDogbnVtYmVyO1xyXG4gICAgdGlsZUhlaWdodDogbnVtYmVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHBhdGg6IHN0cmluZyxcclxuICAgICAgICB3aWR0aDogbnVtYmVyLFxyXG4gICAgICAgIGhlaWdodDogbnVtYmVyLFxyXG4gICAgICAgIHRpbGVXaWR0aDogbnVtYmVyLFxyXG4gICAgICAgIHRpbGVIZWlnaHQ6IG51bWJlclxyXG4gICAgKSB7XHJcbiAgICAgICAgc3VwZXIocGF0aCk7XHJcbiAgICAgICAgdGhpcy53aWR0aCA9IHdpZHRoO1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG4gICAgICAgIHRoaXMudGlsZVdpZHRoID0gdGlsZVdpZHRoO1xyXG4gICAgICAgIHRoaXMudGlsZUhlaWdodCA9IHRpbGVIZWlnaHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyVGlsZShcclxuICAgICAgICBpOiBudW1iZXIsXHJcbiAgICAgICAgdGFyZ2V0OiBhbnksXHJcbiAgICAgICAgeDogbnVtYmVyLFxyXG4gICAgICAgIHk6IG51bWJlcixcclxuICAgICAgICB3aWR0aDogbnVtYmVyLFxyXG4gICAgICAgIGhlaWdodDogbnVtYmVyXHJcbiAgICApIHtcclxuICAgICAgICBjb25zdCB0aWxlU2V0WCA9IGkgJSB0aGlzLndpZHRoO1xyXG4gICAgICAgIGNvbnN0IHRpbGVTZXRZID0gTWF0aC5mbG9vcihpIC8gdGhpcy53aWR0aCk7XHJcblxyXG4gICAgICAgIC8vIE1ha2Ugc3VyZSB0aGUgdGlsZXMgaXNuJ3Qgb3V0IG9mIGJvdW5kc1xyXG4gICAgICAgIGlmICh0aWxlU2V0WSA+IHRoaXMuaGVpZ2h0KVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAgICAgICAgICAgICBgT3V0IG9mIGJvdW5kcyB0aWxlLiBUcmllZCB0byByZW5kZXIgdGlsZSBpbmRleCAke2l9IHdpdGggYSBtYXhpbXVtIG9mICR7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53aWR0aCAqIHRoaXMuaGVpZ2h0XHJcbiAgICAgICAgICAgICAgICB9IHRpbGVzYFxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICBzdXBlci5yZW5kZXJQYXJ0aWFsKFxyXG4gICAgICAgICAgICB0YXJnZXQsXHJcbiAgICAgICAgICAgIHgsXHJcbiAgICAgICAgICAgIHksXHJcbiAgICAgICAgICAgIHdpZHRoLFxyXG4gICAgICAgICAgICBoZWlnaHQsXHJcbiAgICAgICAgICAgIHRpbGVTZXRYICogdGhpcy50aWxlV2lkdGgsXHJcbiAgICAgICAgICAgIHRpbGVTZXRZICogdGhpcy50aWxlSGVpZ2h0LFxyXG4gICAgICAgICAgICB0aGlzLnRpbGVXaWR0aCxcclxuICAgICAgICAgICAgdGhpcy50aWxlSGVpZ2h0XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRUaWxlQXRDb29yZGluYXRlKFxyXG4gICAgICAgIHg6IG51bWJlcixcclxuICAgICAgICB5OiBudW1iZXIsXHJcbiAgICAgICAgdGFyZ2V0OiBhbnksXHJcbiAgICAgICAgeFBvczogbnVtYmVyLFxyXG4gICAgICAgIHlQb3M6IG51bWJlcixcclxuICAgICAgICB3aWR0aDogbnVtYmVyLFxyXG4gICAgICAgIGhlaWdodDogbnVtYmVyXHJcbiAgICApIHtcclxuICAgICAgICBpZiAoeCA+IHRoaXMud2lkdGggfHwgeSA+IHRoaXMuaGVpZ2h0IHx8IHggPCAwIHx8IHkgPCAwKVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAgICAgICAgICAgICBgT3V0IG9mIGJvdW5kcyB0aWxlLiBUcmllZCB0byBsb2FkIHRpbGUgYXQgJHt4fSwgJHt5fSBvbiBhICR7dGhpcy53aWR0aH0sICR7dGhpcy5oZWlnaHR9IGdyaWRgXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIHN1cGVyLnJlbmRlclBhcnRpYWwoXHJcbiAgICAgICAgICAgIHRhcmdldCxcclxuICAgICAgICAgICAgeFBvcyxcclxuICAgICAgICAgICAgeVBvcyxcclxuICAgICAgICAgICAgd2lkdGgsXHJcbiAgICAgICAgICAgIGhlaWdodCxcclxuICAgICAgICAgICAgeCAqIHRoaXMudGlsZVdpZHRoLFxyXG4gICAgICAgICAgICB5ICogdGhpcy50aWxlSGVpZ2h0LFxyXG4gICAgICAgICAgICB0aGlzLnRpbGVXaWR0aCxcclxuICAgICAgICAgICAgdGhpcy50aWxlSGVpZ2h0XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0ID0gVGlsZVJlc291cmNlO1xyXG4iLCJleHBvcnQgY2xhc3MgQ29udHJvbCB7XHJcbiAgICBrZXlib2FyZDogYm9vbGVhblxyXG4gICAga2V5Q29kZTogbnVtYmVyXHJcbiAgICBkZXNjcmlwdGlvbjogc3RyaW5nXHJcbiAgICBvblByZXNzZWQ6ICgpID0+IHZvaWRcclxuICAgIG9uUmVsZWFzZWQ6ICgpID0+IHZvaWRcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkZXNjcmlwdGlvbjogc3RyaW5nLCBrZXlib2FyZDogYm9vbGVhbiwga2V5Q29kZTogbnVtYmVyLCBvblByZXNzZWQ6ICgpID0+IHZvaWQsIG9uUmVsZWFzZWQ/OiAoKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uXHJcbiAgICAgICAgdGhpcy5rZXlib2FyZCA9IGtleWJvYXJkO1xyXG4gICAgICAgIHRoaXMua2V5Q29kZSA9IGtleUNvZGU7XHJcbiAgICAgICAgdGhpcy5vblByZXNzZWQgPSBvblByZXNzZWQ7XHJcbiAgICAgICAgdGhpcy5vblJlbGVhc2VkID0gb25SZWxlYXNlZCB8fCBmdW5jdGlvbigpe307Ly9mb3Igc29tZSByZWFzb24gYXJyb3cgZnVuY3Rpb24gZG9lc24ndCBsaWtlIHRvIGV4aXN0IGhlcmUgYnV0IGknbSBub3QgZ29ubmEgd29ycnkgdG9vIG11Y2hcclxuICAgICAgICAvL2lmIGl0J3MgdG9vIHVnbHksIHlvdSBjYW4gdHJ5IHRvIGZpeCBpdFxyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCBSZW5kZXJhYmxlIGZyb20gJy4uL2ludGVyZmFjZXMvUmVuZGVyYWJsZSc7XHJcbmltcG9ydCBwNSBmcm9tICdwNSc7XHJcbmltcG9ydCB7IEF1ZGlvQXNzZXRzLCBVaUFzc2V0cyB9IGZyb20gJy4uL2Fzc2V0cy9Bc3NldHMnO1xyXG5pbXBvcnQgSW1hZ2VSZXNvdXJjZSBmcm9tICcuLi9hc3NldHMvcmVzb3VyY2VzL0ltYWdlUmVzb3VyY2UnO1xyXG5pbXBvcnQgRm9udFJlc291cmNlIGZyb20gJy4uL2Fzc2V0cy9yZXNvdXJjZXMvRm9udFJlc291cmNlJztcclxuXHJcbmNsYXNzIEJ1dHRvbiBpbXBsZW1lbnRzIFJlbmRlcmFibGUge1xyXG5cclxuICAgIGZvbnQ6IEZvbnRSZXNvdXJjZVxyXG4gICAgdHh0OiBzdHJpbmdcclxuICAgIGRlc2NyaXB0aW9uOiBzdHJpbmdcclxuICAgIG9uUHJlc3NlZEN1c3RvbTogRnVuY3Rpb25cclxuICAgIHg6IG51bWJlclxyXG4gICAgeTogbnVtYmVyXHJcbiAgICB3OiBudW1iZXJcclxuICAgIGg6IG51bWJlclxyXG4gICAgaW1hZ2U6IEltYWdlUmVzb3VyY2VcclxuICAgIG1vdXNlSXNPdmVyOiBib29sZWFuXHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgZm9udDogRm9udFJlc291cmNlLFxyXG4gICAgICAgIHR4dDogc3RyaW5nLFxyXG4gICAgICAgIGRlc2NyaXB0aW9uOiBzdHJpbmcsXHJcbiAgICAgICAgeDogbnVtYmVyLFxyXG4gICAgICAgIHk6IG51bWJlcixcclxuICAgICAgICB3OiBudW1iZXIsXHJcbiAgICAgICAgaDogbnVtYmVyLFxyXG4gICAgICAgIG9uUHJlc3NlZEN1c3RvbTogRnVuY3Rpb24pIHtcclxuICAgICAgICB0aGlzLmZvbnQgPSBmb250O1xyXG4gICAgICAgIHRoaXMudHh0ID0gdHh0XHJcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uXHJcbiAgICAgICAgdGhpcy5vblByZXNzZWRDdXN0b20gPSBvblByZXNzZWRDdXN0b21cclxuICAgICAgICB0aGlzLnggPSB4XHJcbiAgICAgICAgdGhpcy55ID0geVxyXG4gICAgICAgIHRoaXMudyA9IHdcclxuICAgICAgICB0aGlzLmggPSBoXHJcbiAgICAgICAgdGhpcy5pbWFnZSA9IFVpQXNzZXRzLmJ1dHRvbl91bnNlbGVjdGVkO1xyXG4gICAgICAgIHRoaXMubW91c2VJc092ZXIgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIodGFyZ2V0OiBwNSwgdXBzY2FsZVNpemU6IG51bWJlcikge1xyXG4gICAgICAgIC8vIHNldCB0aGUgY29vcmRzIGFuZCBkaW1lbnNpb25zIHRvIHJvdW5kIHRvIHRoZSBuZWFyZXN0IHVuLXVwc2NhbGVkIHBpeGVsXHJcbiAgICAgICAgY29uc3QgeCA9IE1hdGgucm91bmQodGhpcy54IC8gdXBzY2FsZVNpemUpICogdXBzY2FsZVNpemU7XHJcbiAgICAgICAgY29uc3QgeSA9IE1hdGgucm91bmQodGhpcy55IC8gdXBzY2FsZVNpemUpICogdXBzY2FsZVNpemU7XHJcbiAgICAgICAgY29uc3QgdyA9IE1hdGgucm91bmQodGhpcy53IC8gdXBzY2FsZVNpemUpICogdXBzY2FsZVNpemU7XHJcbiAgICAgICAgY29uc3QgaCA9IE1hdGgucm91bmQodGhpcy5oIC8gdXBzY2FsZVNpemUpICogdXBzY2FsZVNpemU7XHJcblxyXG4gICAgICAgIC8vIGNvcm5lcnNcclxuICAgICAgICB0aGlzLmltYWdlLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4LCB5LCA3ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgMCwgMCwgNywgNyk7XHJcbiAgICAgICAgdGhpcy5pbWFnZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCArIHcgLSA3ICogdXBzY2FsZVNpemUsIHksIDcgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCA4LCAwLCA3LCA3KTtcclxuICAgICAgICB0aGlzLmltYWdlLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4LCB5ICsgaCAtIDcgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCA3ICogdXBzY2FsZVNpemUsIDAsIDgsIDcsIDcpO1xyXG4gICAgICAgIHRoaXMuaW1hZ2UucmVuZGVyUGFydGlhbCh0YXJnZXQsIHggKyB3IC0gNyAqIHVwc2NhbGVTaXplLCB5ICsgaCAtIDcgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCA3ICogdXBzY2FsZVNpemUsIDgsIDgsIDcsIDcpO1xyXG5cclxuICAgICAgICAvLyB0b3AgYW5kIGJvdHRvbVxyXG4gICAgICAgIHRoaXMuaW1hZ2UucmVuZGVyUGFydGlhbCh0YXJnZXQsIHggKyA3ICogdXBzY2FsZVNpemUsIHksIHcgLSAxNCAqIHVwc2NhbGVTaXplLCA3ICogdXBzY2FsZVNpemUsIDcsIDAsIDEsIDcpO1xyXG4gICAgICAgIHRoaXMuaW1hZ2UucmVuZGVyUGFydGlhbCh0YXJnZXQsIHggKyA3ICogdXBzY2FsZVNpemUsIHkgKyBoIC0gNyAqIHVwc2NhbGVTaXplLCB3IC0gMTQgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCA3LCA4LCAxLCA3KTtcclxuXHJcbiAgICAgICAgLy8gbGVmdCBhbmQgcmlnaHRcclxuICAgICAgICB0aGlzLmltYWdlLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4LCB5ICsgNyAqIHVwc2NhbGVTaXplLCA3ICogdXBzY2FsZVNpemUsIGggLSAxNCAqIHVwc2NhbGVTaXplLCAwLCA3LCA3LCAxKTtcclxuICAgICAgICB0aGlzLmltYWdlLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4ICsgdyAtIDcgKiB1cHNjYWxlU2l6ZSwgeSArIDcgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCBoIC0gMTQgKiB1cHNjYWxlU2l6ZSwgOCwgNywgNywgMSk7XHJcblxyXG4gICAgICAgIC8vIGNlbnRlclxyXG4gICAgICAgIHRoaXMuaW1hZ2UucmVuZGVyUGFydGlhbCh0YXJnZXQsIHggKyA3ICogdXBzY2FsZVNpemUsIHkgKyA3ICogdXBzY2FsZVNpemUsIHcgLSAxNCAqIHVwc2NhbGVTaXplLCBoIC0gMTQgKiB1cHNjYWxlU2l6ZSwgNywgNywgMSwgMSk7XHJcblxyXG4gICAgICAgIHRoaXMuZm9udC5kcmF3VGV4dCh0YXJnZXQsIHRoaXMudHh0LCB4ICsgNiAqIHVwc2NhbGVTaXplLCBNYXRoLnJvdW5kKCh0aGlzLnkgKyB0aGlzLmggLyAyKSAvIHVwc2NhbGVTaXplKSAqIHVwc2NhbGVTaXplIC0gNiAqIHVwc2NhbGVTaXplKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVNb3VzZU92ZXIobW91c2VYOiBudW1iZXIsIG1vdXNlWTogbnVtYmVyKSB7XHJcbiAgICAgICAgLy8gaWYgdGhlIG1vdXNlIHBvc2l0aW9uIGlzIGluc2lkZSB0aGUgYnV0dG9uLCByZXR1cm4gdHJ1ZVxyXG4gICAgICAgIGlmIChtb3VzZVggPiB0aGlzLnggJiYgbW91c2VYIDwgdGhpcy54ICsgdGhpcy53ICYmIG1vdXNlWSA+IHRoaXMueSAmJiBtb3VzZVkgPCB0aGlzLnkgKyB0aGlzLmgpIHtcclxuICAgICAgICAgICAgdGhpcy5tb3VzZUlzT3ZlciA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2UgPSBVaUFzc2V0cy5idXR0b25fc2VsZWN0ZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLm1vdXNlSXNPdmVyID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2UgPSBVaUFzc2V0cy5idXR0b25fdW5zZWxlY3RlZDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb25QcmVzc2VkKCkge1xyXG4gICAgICAgIHRoaXMub25QcmVzc2VkQ3VzdG9tKCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJidXR0b24gcHJlc3NlZFwiKTtcclxuICAgICAgICBBdWRpb0Fzc2V0cy51aS5pbnZlbnRvcnlDbGFjay5wbGF5UmFuZG9tKCk7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQgPSBCdXR0b247IiwiaW1wb3J0IFJlbmRlcmFibGUgZnJvbSAnLi4vaW50ZXJmYWNlcy9SZW5kZXJhYmxlJztcclxuaW1wb3J0IHA1IGZyb20gJ3A1JztcclxuaW1wb3J0IHsgS2V5cywgVWlBc3NldHMgfSBmcm9tICcuLi9hc3NldHMvQXNzZXRzJztcclxuaW1wb3J0IEltYWdlUmVzb3VyY2UgZnJvbSAnLi4vYXNzZXRzL3Jlc291cmNlcy9JbWFnZVJlc291cmNlJztcclxuaW1wb3J0IEZvbnRSZXNvdXJjZSBmcm9tICcuLi9hc3NldHMvcmVzb3VyY2VzL0ZvbnRSZXNvdXJjZSc7XHJcblxyXG5jbGFzcyBJbnB1dEJveCBpbXBsZW1lbnRzIFJlbmRlcmFibGUge1xyXG5cclxuICAgIGZvbnQ6IEZvbnRSZXNvdXJjZVxyXG4gICAgdHh0OiBzdHJpbmdcclxuICAgIHZhbHVlOiBudW1iZXJcclxuICAgIGtleWJvYXJkOiBib29sZWFuXHJcbiAgICBpbmRleDogbnVtYmVyXHJcbiAgICB4OiBudW1iZXJcclxuICAgIHk6IG51bWJlclxyXG4gICAgdzogbnVtYmVyXHJcbiAgICBoOiBudW1iZXJcclxuICAgIGltYWdlOiBJbWFnZVJlc291cmNlXHJcbiAgICBtb3VzZUlzT3ZlcjogYm9vbGVhblxyXG4gICAgbGlzdGVuaW5nOiBib29sZWFuXHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgZm9udDogRm9udFJlc291cmNlLFxyXG4gICAgICAgIHR4dDogc3RyaW5nLFxyXG4gICAgICAgIGtleWJvYXJkOiBib29sZWFuLFxyXG4gICAgICAgIHZhbHVlOiBudW1iZXIsXHJcbiAgICAgICAgaW5kZXg6IG51bWJlciwvLyB0aGUgaW5kZXggaW4gdGhlIEdhbWUuY29udHJvbHMgYXJyYXkgdGhhdCBpdCBjaGFuZ2VzXHJcbiAgICAgICAgeDogbnVtYmVyLFxyXG4gICAgICAgIHk6IG51bWJlcixcclxuICAgICAgICB3OiBudW1iZXIsXHJcbiAgICAgICAgaDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5mb250ID0gZm9udDtcclxuICAgICAgICB0aGlzLnR4dCA9IHR4dFxyXG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLmtleWJvYXJkID0ga2V5Ym9hcmQ7XHJcbiAgICAgICAgdGhpcy5pbmRleCA9IGluZGV4O1xyXG4gICAgICAgIHRoaXMueCA9IHhcclxuICAgICAgICB0aGlzLnkgPSB5XHJcbiAgICAgICAgdGhpcy53ID0gd1xyXG4gICAgICAgIHRoaXMuaCA9IGhcclxuICAgICAgICB0aGlzLmltYWdlID0gVWlBc3NldHMuYnV0dG9uX3Vuc2VsZWN0ZWQ7XHJcbiAgICAgICAgdGhpcy5tb3VzZUlzT3ZlciA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMubGlzdGVuaW5nID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKHRhcmdldDogcDUsIHVwc2NhbGVTaXplOiBudW1iZXIpIHtcclxuICAgICAgICAvLyBzZXQgdGhlIGNvb3JkcyBhbmQgZGltZW5zaW9ucyB0byByb3VuZCB0byB0aGUgbmVhcmVzdCB1bi11cHNjYWxlZCBwaXhlbFxyXG4gICAgICAgIGNvbnN0IHggPSBNYXRoLnJvdW5kKHRoaXMueCAvIHVwc2NhbGVTaXplKSAqIHVwc2NhbGVTaXplO1xyXG4gICAgICAgIGNvbnN0IHkgPSBNYXRoLnJvdW5kKHRoaXMueSAvIHVwc2NhbGVTaXplKSAqIHVwc2NhbGVTaXplO1xyXG4gICAgICAgIGNvbnN0IHcgPSBNYXRoLnJvdW5kKHRoaXMudyAvIHVwc2NhbGVTaXplKSAqIHVwc2NhbGVTaXplO1xyXG4gICAgICAgIGNvbnN0IGggPSBNYXRoLnJvdW5kKHRoaXMuaCAvIHVwc2NhbGVTaXplKSAqIHVwc2NhbGVTaXplO1xyXG5cclxuICAgICAgICAvLyBjb3JuZXJzXHJcbiAgICAgICAgdGhpcy5pbWFnZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCwgeSwgNyAqIHVwc2NhbGVTaXplLCA3ICogdXBzY2FsZVNpemUsIDAsIDAsIDcsIDcpO1xyXG4gICAgICAgIHRoaXMuaW1hZ2UucmVuZGVyUGFydGlhbCh0YXJnZXQsIHggKyB3IC0gNyAqIHVwc2NhbGVTaXplLCB5LCA3ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgOCwgMCwgNywgNyk7XHJcbiAgICAgICAgdGhpcy5pbWFnZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCwgeSArIGggLSA3ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCAwLCA4LCA3LCA3KTtcclxuICAgICAgICB0aGlzLmltYWdlLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4ICsgdyAtIDcgKiB1cHNjYWxlU2l6ZSwgeSArIGggLSA3ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCA4LCA4LCA3LCA3KTtcclxuXHJcbiAgICAgICAgLy8gdG9wIGFuZCBib3R0b21cclxuICAgICAgICB0aGlzLmltYWdlLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4ICsgNyAqIHVwc2NhbGVTaXplLCB5LCB3IC0gMTQgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCA3LCAwLCAxLCA3KTtcclxuICAgICAgICB0aGlzLmltYWdlLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4ICsgNyAqIHVwc2NhbGVTaXplLCB5ICsgaCAtIDcgKiB1cHNjYWxlU2l6ZSwgdyAtIDE0ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgNywgOCwgMSwgNyk7XHJcblxyXG4gICAgICAgIC8vIGxlZnQgYW5kIHJpZ2h0XHJcbiAgICAgICAgdGhpcy5pbWFnZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCwgeSArIDcgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCBoIC0gMTQgKiB1cHNjYWxlU2l6ZSwgMCwgNywgNywgMSk7XHJcbiAgICAgICAgdGhpcy5pbWFnZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCArIHcgLSA3ICogdXBzY2FsZVNpemUsIHkgKyA3ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgaCAtIDE0ICogdXBzY2FsZVNpemUsIDgsIDcsIDcsIDEpO1xyXG5cclxuICAgICAgICAvLyBjZW50ZXJcclxuICAgICAgICB0aGlzLmltYWdlLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4ICsgNyAqIHVwc2NhbGVTaXplLCB5ICsgNyAqIHVwc2NhbGVTaXplLCB3IC0gMTQgKiB1cHNjYWxlU2l6ZSwgaCAtIDE0ICogdXBzY2FsZVNpemUsIDcsIDcsIDEsIDEpO1xyXG5cclxuICAgICAgICBpZih0aGlzLmxpc3RlbmluZykge1xyXG4gICAgICAgICAgICB0aGlzLmZvbnQuZHJhd1RleHQodGFyZ2V0LCB0aGlzLnR4dCtcIjogY2xpY2sgdG8gY2FuY2VsXCIsIHggKyA2ICogdXBzY2FsZVNpemUsIE1hdGgucm91bmQoKHRoaXMueSArIHRoaXMuaCAvIDIpIC8gdXBzY2FsZVNpemUpICogdXBzY2FsZVNpemUgLSA2ICogdXBzY2FsZVNpemUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYodGhpcy5rZXlib2FyZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mb250LmRyYXdUZXh0KHRhcmdldCwgdGhpcy50eHQrXCI6ICAgXCIrS2V5cy5rZXlib2FyZE1hcFt0aGlzLnZhbHVlXSwgeCArIDYgKiB1cHNjYWxlU2l6ZSwgTWF0aC5yb3VuZCgodGhpcy55ICsgdGhpcy5oIC8gMikgLyB1cHNjYWxlU2l6ZSkgKiB1cHNjYWxlU2l6ZSAtIDYgKiB1cHNjYWxlU2l6ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZvbnQuZHJhd1RleHQodGFyZ2V0LCB0aGlzLnR4dCtcIjogICBNb3VzZSBcIit0aGlzLnZhbHVlLCB4ICsgNiAqIHVwc2NhbGVTaXplLCBNYXRoLnJvdW5kKCh0aGlzLnkgKyB0aGlzLmggLyAyKSAvIHVwc2NhbGVTaXplKSAqIHVwc2NhbGVTaXplIC0gNiAqIHVwc2NhbGVTaXplKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVNb3VzZU92ZXIobW91c2VYOiBudW1iZXIsIG1vdXNlWTogbnVtYmVyKSB7XHJcbiAgICAgICAgLy8gaWYgdGhlIG1vdXNlIHBvc2l0aW9uIGlzIGluc2lkZSB0aGUgYnV0dG9uLCByZXR1cm4gdHJ1ZVxyXG4gICAgICAgIGlmIChtb3VzZVggPiB0aGlzLnggJiYgbW91c2VYIDwgdGhpcy54ICsgdGhpcy53ICYmIG1vdXNlWSA+IHRoaXMueSAmJiBtb3VzZVkgPCB0aGlzLnkgKyB0aGlzLmgpIHtcclxuICAgICAgICAgICAgdGhpcy5tb3VzZUlzT3ZlciA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLm1vdXNlSXNPdmVyID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9uUHJlc3NlZCgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImlucHV0IGJveCBwcmVzc2VkXCIpO1xyXG4gICAgICAgIHRoaXMubGlzdGVuaW5nID0gIXRoaXMubGlzdGVuaW5nO1xyXG4gICAgICAgIGlmKHRoaXMubGlzdGVuaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2UgPSBVaUFzc2V0cy5idXR0b25fc2VsZWN0ZWQ7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5pbWFnZSA9IFVpQXNzZXRzLmJ1dHRvbl91bnNlbGVjdGVkO1xyXG4gICAgICAgIC8vIEF1ZGlvQXNzZXRzLnVpLmludmVudG9yeUNsYWNrLnBsYXlSYW5kb20oKTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCA9IElucHV0Qm94OyIsImltcG9ydCBSZW5kZXJhYmxlIGZyb20gJy4uL2ludGVyZmFjZXMvUmVuZGVyYWJsZSc7XHJcbmltcG9ydCBwNSBmcm9tICdwNSc7XHJcbmltcG9ydCB7IFVpQXNzZXRzIH0gZnJvbSAnLi4vYXNzZXRzL0Fzc2V0cyc7XHJcbmltcG9ydCBnYW1lIGZyb20gJy4uL01haW4nXHJcbmltcG9ydCBGb250UmVzb3VyY2UgZnJvbSAnLi4vYXNzZXRzL3Jlc291cmNlcy9Gb250UmVzb3VyY2UnO1xyXG5cclxuY2xhc3MgU2xpZGVyIGltcGxlbWVudHMgUmVuZGVyYWJsZSB7XHJcblxyXG4gICAgdmFsdWU6IG51bWJlclxyXG4gICAgbWluOiBudW1iZXJcclxuICAgIG1heDogbnVtYmVyXHJcbiAgICBzdGVwOiBudW1iZXJcclxuICAgIG9uQ2hhbmdlZDogRnVuY3Rpb25cclxuICAgIHg6IG51bWJlclxyXG4gICAgeTogbnVtYmVyXHJcbiAgICB3OiBudW1iZXJcclxuICAgIGg6IG51bWJlclxyXG4gICAgYmVpbmdFZGl0ZWQ6IGJvb2xlYW5cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBmb250OiBGb250UmVzb3VyY2UsXHJcbiAgICAgICAgdHh0OiBzdHJpbmcsXHJcbiAgICAgICAgdmFsdWU6bnVtYmVyLFxyXG4gICAgICAgIG1pbjogbnVtYmVyLFxyXG4gICAgICAgIG1heDogbnVtYmVyLFxyXG4gICAgICAgIHN0ZXA6IG51bWJlcixcclxuICAgICAgICB4OiBudW1iZXIsXHJcbiAgICAgICAgeTogbnVtYmVyLFxyXG4gICAgICAgIHc6IG51bWJlcixcclxuICAgICAgICBoOiBudW1iZXIsXHJcbiAgICAgICAgb25DaGFuZ2VkOiBGdW5jdGlvbikge1xyXG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZVxyXG4gICAgICAgIHRoaXMubWluID0gbWluXHJcbiAgICAgICAgdGhpcy5tYXggPSBtYXhcclxuICAgICAgICB0aGlzLnN0ZXAgPSBzdGVwXHJcbiAgICAgICAgdGhpcy5vbkNoYW5nZWQgPSBvbkNoYW5nZWRcclxuICAgICAgICB0aGlzLnggPSB4XHJcbiAgICAgICAgdGhpcy55ID0geVxyXG4gICAgICAgIHRoaXMudyA9IHdcclxuICAgICAgICB0aGlzLmggPSBoXHJcbiAgICAgICAgdGhpcy5iZWluZ0VkaXRlZCA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcih0YXJnZXQ6IHA1LCB1cHNjYWxlU2l6ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgLy8gc2V0IHRoZSBjb29yZHMgYW5kIGRpbWVuc2lvbnMgdG8gcm91bmQgdG8gdGhlIG5lYXJlc3QgdW4tdXBzY2FsZWQgcGl4ZWxcclxuICAgICAgICBjb25zdCB4ID0gTWF0aC5yb3VuZCh0aGlzLngvdXBzY2FsZVNpemUpKnVwc2NhbGVTaXplO1xyXG4gICAgICAgIGNvbnN0IHkgPSBNYXRoLnJvdW5kKCh0aGlzLnkrdGhpcy5oLzIpL3Vwc2NhbGVTaXplKSp1cHNjYWxlU2l6ZTtcclxuICAgICAgICBjb25zdCB3ID0gTWF0aC5yb3VuZCh0aGlzLncvdXBzY2FsZVNpemUpKnVwc2NhbGVTaXplO1xyXG5cclxuICAgICAgICAvLyBsZWZ0IHNpZGUgb2Ygc2xpZGVyIGJhclxyXG4gICAgICAgIFVpQXNzZXRzLnNsaWRlcl9iYXIucmVuZGVyUGFydGlhbCh0YXJnZXQsIHgsIHktMip1cHNjYWxlU2l6ZSwgMip1cHNjYWxlU2l6ZSwgNCp1cHNjYWxlU2l6ZSwgMCwgMCwgMiwgNCk7XHJcbiAgICAgICAgLy8gcmlnaHQgc2lkZSBvZiBzbGlkZXIgYmFyXHJcbiAgICAgICAgVWlBc3NldHMuc2xpZGVyX2Jhci5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCt3LTIqdXBzY2FsZVNpemUsIHktMip1cHNjYWxlU2l6ZSwgMip1cHNjYWxlU2l6ZSwgNCp1cHNjYWxlU2l6ZSwgMywgMCwgMiwgNCk7XHJcbiAgICAgICAgLy8gY2VudGVyIG9mIHNsaWRlciBiYXJcclxuICAgICAgICBVaUFzc2V0cy5zbGlkZXJfYmFyLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4KzIqdXBzY2FsZVNpemUsIHktMip1cHNjYWxlU2l6ZSwgdy00KnVwc2NhbGVTaXplLCA0KnVwc2NhbGVTaXplLCAyLCAwLCAxLCA0KTtcclxuICAgICAgICAvLyBoYW5kbGVcclxuICAgICAgICBVaUFzc2V0cy5zbGlkZXJfaGFuZGxlLnJlbmRlcih0YXJnZXQsIHgrTWF0aC5yb3VuZCgodGhpcy52YWx1ZS10aGlzLm1pbikvKHRoaXMubWF4LXRoaXMubWluKSoody04KnVwc2NhbGVTaXplKS91cHNjYWxlU2l6ZSkqdXBzY2FsZVNpemUsIHktNCp1cHNjYWxlU2l6ZSwgOCp1cHNjYWxlU2l6ZSwgOSp1cHNjYWxlU2l6ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlU2xpZGVyUG9zaXRpb24obW91c2VYOiBudW1iZXIpIHtcclxuICAgICAgICBpZih0aGlzLmJlaW5nRWRpdGVkKXtcclxuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IE1hdGgubWF4KHRoaXMubWluLCBNYXRoLm1pbih0aGlzLm1heCwgTWF0aC5yb3VuZCgodGhpcy5taW4rKHRoaXMubWF4LXRoaXMubWluKSooKChtb3VzZVgtdGhpcy54LTQqZ2FtZS51cHNjYWxlU2l6ZSkgLyAodGhpcy53LSg4KmdhbWUudXBzY2FsZVNpemUpKSkpKS90aGlzLnN0ZXApKnRoaXMuc3RlcCkpO1xyXG4gICAgICAgICAgICB0aGlzLm9uQ2hhbmdlZCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCA9IFNsaWRlcjsiLCJpbXBvcnQgUmVuZGVyYWJsZSBmcm9tICcuLi9pbnRlcmZhY2VzL1JlbmRlcmFibGUnO1xyXG5pbXBvcnQgcDUgZnJvbSAncDUnO1xyXG5pbXBvcnQgeyBVaUFzc2V0cyB9IGZyb20gJy4uL2Fzc2V0cy9Bc3NldHMnO1xyXG5cclxuY2xhc3MgVWlGcmFtZSBpbXBsZW1lbnRzIFJlbmRlcmFibGUge1xyXG5cclxuICAgIHg6IG51bWJlclxyXG4gICAgeTogbnVtYmVyXHJcbiAgICB3OiBudW1iZXJcclxuICAgIGg6IG51bWJlclxyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHg6IG51bWJlcixcclxuICAgICAgICB5OiBudW1iZXIsXHJcbiAgICAgICAgdzogbnVtYmVyLFxyXG4gICAgICAgIGg6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMueCA9IHhcclxuICAgICAgICB0aGlzLnkgPSB5XHJcbiAgICAgICAgdGhpcy53ID0gd1xyXG4gICAgICAgIHRoaXMuaCA9IGhcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIodGFyZ2V0OiBwNSwgdXBzY2FsZVNpemU6IG51bWJlcikge1xyXG4gICAgICAgIC8vIHNldCB0aGUgY29vcmRzIGFuZCBkaW1lbnNpb25zIHRvIHJvdW5kIHRvIHRoZSBuZWFyZXN0IHVuLXVwc2NhbGVkIHBpeGVsXHJcbiAgICAgICAgY29uc3QgeCA9IE1hdGgucm91bmQodGhpcy54L3Vwc2NhbGVTaXplKSp1cHNjYWxlU2l6ZTtcclxuICAgICAgICBjb25zdCB5ID0gTWF0aC5yb3VuZCh0aGlzLnkvdXBzY2FsZVNpemUpKnVwc2NhbGVTaXplO1xyXG4gICAgICAgIGNvbnN0IHcgPSBNYXRoLnJvdW5kKHRoaXMudy91cHNjYWxlU2l6ZSkqdXBzY2FsZVNpemU7XHJcbiAgICAgICAgY29uc3QgaCA9IE1hdGgucm91bmQodGhpcy5oL3Vwc2NhbGVTaXplKSp1cHNjYWxlU2l6ZTtcclxuXHJcbiAgICAgICAgLy8gY29ybmVyc1xyXG4gICAgICAgIFVpQXNzZXRzLnVpX2ZyYW1lLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4LCB5LCA3KnVwc2NhbGVTaXplLCA3KnVwc2NhbGVTaXplLCAwLCAwLCA3LCA3KTtcclxuICAgICAgICBVaUFzc2V0cy51aV9mcmFtZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCt3LTcqdXBzY2FsZVNpemUsIHksIDcqdXBzY2FsZVNpemUsIDcqdXBzY2FsZVNpemUsIDgsIDAsIDcsIDcpO1xyXG4gICAgICAgIFVpQXNzZXRzLnVpX2ZyYW1lLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4LCB5K2gtNyp1cHNjYWxlU2l6ZSwgNyp1cHNjYWxlU2l6ZSwgNyp1cHNjYWxlU2l6ZSwgMCwgOCwgNywgNyk7XHJcbiAgICAgICAgVWlBc3NldHMudWlfZnJhbWUucmVuZGVyUGFydGlhbCh0YXJnZXQsIHgrdy03KnVwc2NhbGVTaXplLCB5K2gtNyp1cHNjYWxlU2l6ZSwgNyp1cHNjYWxlU2l6ZSwgNyp1cHNjYWxlU2l6ZSwgOCwgOCwgNywgNyk7XHJcblxyXG4gICAgICAgIC8vIHRvcCBhbmQgYm90dG9tXHJcbiAgICAgICAgVWlBc3NldHMudWlfZnJhbWUucmVuZGVyUGFydGlhbCh0YXJnZXQsIHgrNyp1cHNjYWxlU2l6ZSwgeSwgdy0xNCp1cHNjYWxlU2l6ZSwgNyp1cHNjYWxlU2l6ZSwgNywgMCwgMSwgNyk7XHJcbiAgICAgICAgVWlBc3NldHMudWlfZnJhbWUucmVuZGVyUGFydGlhbCh0YXJnZXQsIHgrNyp1cHNjYWxlU2l6ZSwgeStoLTcqdXBzY2FsZVNpemUsIHctMTQqdXBzY2FsZVNpemUsIDcqdXBzY2FsZVNpemUsIDcsIDgsIDEsIDcpO1xyXG5cclxuICAgICAgICAvLyBsZWZ0IGFuZCByaWdodFxyXG4gICAgICAgIFVpQXNzZXRzLnVpX2ZyYW1lLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4LCB5KzcqdXBzY2FsZVNpemUsIDcqdXBzY2FsZVNpemUsIGgtMTQqdXBzY2FsZVNpemUsIDAsIDcsIDcsIDEpO1xyXG4gICAgICAgIFVpQXNzZXRzLnVpX2ZyYW1lLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4K3ctNyp1cHNjYWxlU2l6ZSwgeSs3KnVwc2NhbGVTaXplLCA3KnVwc2NhbGVTaXplLCBoLTE0KnVwc2NhbGVTaXplLCA4LCA3LCA3LCAxKTtcclxuXHJcbiAgICAgICAgLy8gY2VudGVyXHJcbiAgICAgICAgVWlBc3NldHMudWlfZnJhbWUucmVuZGVyUGFydGlhbCh0YXJnZXQsIHgrNyp1cHNjYWxlU2l6ZSwgeSs3KnVwc2NhbGVTaXplLCB3LTE0KnVwc2NhbGVTaXplLCBoLTE0KnVwc2NhbGVTaXplLCA3LCA3LCAxLCAxKTtcclxuXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCA9IFVpRnJhbWU7IiwiaW1wb3J0IFJlbmRlcmFibGUgZnJvbSAnLi4vaW50ZXJmYWNlcy9SZW5kZXJhYmxlJztcclxuaW1wb3J0IHA1IGZyb20gJ3A1JztcclxuaW1wb3J0IEJ1dHRvbiBmcm9tICcuLi91aS9CdXR0b24nO1xyXG5pbXBvcnQgU2xpZGVyIGZyb20gJy4uL3VpL1NsaWRlcic7XHJcbmltcG9ydCBVaUZyYW1lIGZyb20gJy4vVWlGcmFtZSc7XHJcbmltcG9ydCBnYW1lIGZyb20gJy4uL01haW4nO1xyXG5pbXBvcnQgSW5wdXRCb3ggZnJvbSAnLi9JbnB1dEJveCc7XHJcbmltcG9ydCB7IFVpQXNzZXRzIH0gZnJvbSAnLi4vYXNzZXRzL0Fzc2V0cyc7XHJcblxyXG5hYnN0cmFjdCBjbGFzcyBVaVNjcmVlbiBpbXBsZW1lbnRzIFJlbmRlcmFibGUge1xyXG5cclxuICAgIGJ1dHRvbnM6IEJ1dHRvbltdO1xyXG4gICAgc2xpZGVyczogU2xpZGVyW107XHJcbiAgICBpbnB1dEJveGVzOiBJbnB1dEJveFtdO1xyXG5cclxuICAgIGZyYW1lOiBVaUZyYW1lXHJcblxyXG4gICAgYWJzdHJhY3QgcmVuZGVyKHRhcmdldDogcDUsIHVwc2NhbGVTaXplOiBudW1iZXIpOiB2b2lkO1xyXG5cclxuICAgIGFic3RyYWN0IHdpbmRvd1VwZGF0ZSgpOiB2b2lkXHJcblxyXG4gICAgbW91c2VQcmVzc2VkKGJ0bjogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYodGhpcy5idXR0b25zICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgLy8gbG9vcCB0aHJvdWdoIGFsbCB0aGUgYnV0dG9ucyBpbiB0aGlzIG1lbnUgYW5kIGlmIHRoZSBtb3VzZSBpcyBvdmVyIHRoZW0sIHRoZW4gY2FsbCB0aGUgYnV0dG9uJ3Mgb25QcmVzc2VkKCkgZnVuY3Rpb24uICBUaGUgb25QcmVzc2VkKCkgZnVuY3Rpb24gaXMgcGFzc2VkIGluIHRocm91Z2ggdGhlIGNvbnN0cnVjdG9yLlxyXG4gICAgICAgICAgICBmb3IoY29uc3QgaSBvZiB0aGlzLmJ1dHRvbnMpIHtcclxuICAgICAgICAgICAgICAgIGlmKGkubW91c2VJc092ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBpLm9uUHJlc3NlZCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLnNsaWRlcnMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAvLyBsb29wIHRocm91Z2ggYWxsIHRoZSBzbGlkZXJzIGFuZCBpbnRlcmFjdCB3aXRoIHRoZW0gYWNjb3JkaW5nbHlcclxuICAgICAgICAgICAgZm9yKGNvbnN0IGkgb2YgdGhpcy5zbGlkZXJzKSB7XHJcbiAgICAgICAgICAgICAgICBpLnVwZGF0ZVNsaWRlclBvc2l0aW9uKGdhbWUubW91c2VYKTtcclxuICAgICAgICAgICAgICAgIGlmKGdhbWUubW91c2VYPmkueCAmJiBnYW1lLm1vdXNlWDxpLngraS53ICYmIGdhbWUubW91c2VZPmkueSAmJiBnYW1lLm1vdXNlWTxpLnkraS5oKVxyXG4gICAgICAgICAgICAgICAgICAgIGkuYmVpbmdFZGl0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMuaW5wdXRCb3hlcyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIC8vIGxvb3AgdGhyb3VnaCBhbGwgdGhlIGlucHV0IGJveGVzIGFuZCBpbnRlcmFjdCB3aXRoIHRoZW0gYWNjb3JkaW5nbHlcclxuICAgICAgICAgICAgZm9yKGNvbnN0IGkgb2YgdGhpcy5pbnB1dEJveGVzKSB7XHJcbiAgICAgICAgICAgICAgICBpZihpLm1vdXNlSXNPdmVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaS5vblByZXNzZWQoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYoaS5saXN0ZW5pbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICBpLmxpc3RlbmluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGdhbWUuY29udHJvbHNbaS5pbmRleF0ua2V5Q29kZSA9IGJ0bjtcclxuICAgICAgICAgICAgICAgICAgICBnYW1lLmNvbnRyb2xzW2kuaW5kZXhdLmtleWJvYXJkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgaS52YWx1ZSA9IGJ0bjtcclxuICAgICAgICAgICAgICAgICAgICBpLmtleWJvYXJkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgaS5pbWFnZSA9IFVpQXNzZXRzLmJ1dHRvbl91bnNlbGVjdGVkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG1vdXNlUmVsZWFzZWQoKSB7XHJcbiAgICAgICAgaWYodGhpcy5zbGlkZXJzICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgLy8gbG9vcCB0aHJvdWdoIGFsbCB0aGUgc2xpZGVycyBhbmQgaW50ZXJhY3Qgd2l0aCB0aGVtIGFjY29yZGluZ2x5XHJcbiAgICAgICAgICAgIGZvcihjb25zdCBpIG9mIHRoaXMuc2xpZGVycykge1xyXG4gICAgICAgICAgICAgICAgaS5iZWluZ0VkaXRlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufVxyXG5cclxuZXhwb3J0ID0gVWlTY3JlZW4iLCJpbXBvcnQgVWlTY3JlZW4gZnJvbSAnLi4vVWlTY3JlZW4nO1xyXG5pbXBvcnQgcDUgZnJvbSAncDUnO1xyXG5pbXBvcnQgVWlGcmFtZSBmcm9tICcuLi9VaUZyYW1lJztcclxuaW1wb3J0IGdhbWUgZnJvbSAnLi4vLi4vTWFpbic7XHJcbmltcG9ydCBCdXR0b24gZnJvbSAnLi4vQnV0dG9uJztcclxuaW1wb3J0IEZvbnRSZXNvdXJjZSBmcm9tICcuLi8uLi9hc3NldHMvcmVzb3VyY2VzL0ZvbnRSZXNvdXJjZSc7XHJcbmltcG9ydCB7IE9wdGlvbnNNZW51IH0gZnJvbSAnLi9PcHRpb25zTWVudSc7XHJcbmltcG9ydCBJbnB1dEJveCBmcm9tICcuLi9JbnB1dEJveCc7XHJcbmltcG9ydCB7IENvbnRyb2wgfSBmcm9tICcuLi8uLi9pbnB1dC9Db250cm9sJ1xyXG5cclxuZXhwb3J0IGNsYXNzIENvbnRyb2xzTWVudSBleHRlbmRzIFVpU2NyZWVuIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihmb250OiBGb250UmVzb3VyY2UpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIC8vIG1ha2UgdGhlIGZyYW1lIHdpdGggc29tZSBkZWZhdWx0IHZhbHVlcy4gIFRoZXNlIHdpbGwgbGF0ZXIgYmUgY2hhbmdlZCB0byBmaXQgdGhlIHNjcmVlbiBzaXplLlxyXG4gICAgICAgIHRoaXMuZnJhbWUgPSBuZXcgVWlGcmFtZSgwLCAwLCAwLCAwKTtcclxuXHJcbiAgICAgICAgLy8gbWFrZSBzb21lIGJ1dHRvbnMgd2l0aCBkZWZhdWx0IHBvc2l0aW9uc1xyXG4gICAgICAgIHRoaXMuYnV0dG9ucyA9IFtcclxuICAgICAgICAgICAgbmV3IEJ1dHRvbihmb250LCBcIkJhY2tcIiwgXCJSZXR1cm4gdG8gdGhlIG9wdGlvbnMgbWVudS5cIiwgMCwgMCwgMCwgMCwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJvcHRpb25zIG1lbnVcIik7XHJcbiAgICAgICAgICAgICAgICBnYW1lLmN1cnJlbnRVaSA9IG5ldyBPcHRpb25zTWVudShmb250KTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICBdO1xyXG5cclxuICAgICAgICB0aGlzLmlucHV0Qm94ZXMgPSBbXHJcbiAgICAgICAgICAgIC8vIG5ldyBJbnB1dEJveChmb250LCBcIldhbGsgUmlnaHRcIiwgdHJ1ZSwgNjgsIDAsIDAsIDAsIDAsIDApLFxyXG4gICAgICAgICAgICAvLyBuZXcgSW5wdXRCb3goZm9udCwgXCJXYWxrIExlZnRcIiwgdHJ1ZSwgNjUsIDEsIDAsIDAsIDAsIDApLFxyXG4gICAgICAgICAgICAvLyBuZXcgSW5wdXRCb3goZm9udCwgXCJKdW1wXCIsIHRydWUsIDMyLCAyLCAwLCAwLCAwLCAwKSxcclxuICAgICAgICAgICAgLy8gbmV3IElucHV0Qm94KGZvbnQsIFwiUGF1c2VcIiwgdHJ1ZSwgMjcsIDMsIDAsIDAsIDAsIDApXHJcbiAgICAgICAgXVxyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBpID0gMDtcclxuICAgICAgICBmb3IobGV0IGNvbnRyb2wgb2YgZ2FtZS5jb250cm9scykge1xyXG4gICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgIHRoaXMuaW5wdXRCb3hlcy5wdXNoKG5ldyBJbnB1dEJveChmb250LCBjb250cm9sLmRlc2NyaXB0aW9uLCBjb250cm9sLmtleWJvYXJkLCBjb250cm9sLmtleUNvZGUsIGksIDAsIDAsIDAsIDApKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gdXBkYXRlIHRoZSBzaXplIG9mIHRoZSBlbGVtZW50cyBiYXNlZCBvbiB0aGUgaW5pdGlhbCBzY3JlZW4gc2l6ZVxyXG4gICAgICAgIHRoaXMud2luZG93VXBkYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKHRhcmdldDogcDUsIHVwc2NhbGVTaXplOiBudW1iZXIpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgLy8gcmVuZGVyIHRoZSByZWN0YW5ndWxhciBpbWFnZVxyXG4gICAgICAgIHRoaXMuZnJhbWUucmVuZGVyKHRhcmdldCwgdXBzY2FsZVNpemUpO1xyXG5cclxuICAgICAgICAvLyBsb29wIHRocm91Z2ggdGhlIGJ1dHRvbnMgYXJyYXkgYW5kIHJlbmRlciBlYWNoIG9uZS5cclxuICAgICAgICB0aGlzLmJ1dHRvbnMuZm9yRWFjaChidXR0b24gPT4ge1xyXG4gICAgICAgICAgICBidXR0b24ucmVuZGVyKHRhcmdldCwgdXBzY2FsZVNpemUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBsb29wIHRocm91Z2ggdGhlIGlucHV0Qm94ZXMgYXJyYXkgYW5kIHJlbmRlciBlYWNoIG9uZS5cclxuICAgICAgICB0aGlzLmlucHV0Qm94ZXMuZm9yRWFjaChpbnB1dEJveCA9PiB7XHJcbiAgICAgICAgICAgIGlucHV0Qm94LnJlbmRlcih0YXJnZXQsIHVwc2NhbGVTaXplKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB3aW5kb3dVcGRhdGUoKSB7XHJcbiAgICAgICAgLy8gc2V0IHRoZSBwb3NpdGlvbiBvZiB0aGUgZnJhbWVcclxuICAgICAgICB0aGlzLmZyYW1lLnggPSBnYW1lLndpZHRoIC8gMiAtIDIwMCAvIDIgKiBnYW1lLnVwc2NhbGVTaXplOy8vIGNlbnRlciB0aGUgZnJhbWUgaW4gdGhlIGNlbnRlciBvZiB0aGUgc2NyZWVuXHJcbiAgICAgICAgdGhpcy5mcmFtZS55ID0gZ2FtZS5oZWlnaHQgLyAyIC0gNTYgKiBnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgIHRoaXMuZnJhbWUudyA9IDIwMCAqIGdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgdGhpcy5mcmFtZS5oID0gNDggKiBnYW1lLnVwc2NhbGVTaXplO1xyXG5cclxuICAgICAgICAvLyBzZXQgdGhlIHBvc2l0aW9ucyBvZiB0aGUgYnV0dG9uXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLnggPSBnYW1lLndpZHRoIC8gMiAtIDE5MiAvIDIgKiBnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0ueSA9IGdhbWUuaGVpZ2h0IC8gMiArIDIwICogaSAqIGdhbWUudXBzY2FsZVNpemUgKyAyMCAqIGdhbWUudXBzY2FsZVNpemUgKiB0aGlzLmlucHV0Qm94ZXMubGVuZ3RoO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0udyA9IDE5MiAqIGdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS5oID0gMTYgKiBnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0udXBkYXRlTW91c2VPdmVyKGdhbWUubW91c2VYLCBnYW1lLm1vdXNlWSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBzZXQgdGhlIHBvc2l0aW9ucyBvZiBhbGwgdGhlIGlucHV0IGJveGVzXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA0OyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5pbnB1dEJveGVzW2ldLnggPSBnYW1lLndpZHRoIC8gMiAtIDE5MiAvIDIgKiBnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLmlucHV0Qm94ZXNbaV0ueSA9IGdhbWUuaGVpZ2h0IC8gMiArIDIwICogaSAqIGdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuaW5wdXRCb3hlc1tpXS53ID0gMTkyICogZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5pbnB1dEJveGVzW2ldLmggPSAxNiAqIGdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuaW5wdXRCb3hlc1tpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCBVaVNjcmVlbiBmcm9tICcuLi9VaVNjcmVlbic7XHJcbmltcG9ydCBwNSBmcm9tICdwNSc7XHJcbmltcG9ydCBVaUZyYW1lIGZyb20gJy4uL1VpRnJhbWUnO1xyXG5pbXBvcnQgZ2FtZSBmcm9tICcuLi8uLi9NYWluJztcclxuaW1wb3J0IEJ1dHRvbiBmcm9tICcuLi9CdXR0b24nO1xyXG5pbXBvcnQgU2xpZGVyIGZyb20gJy4uL1NsaWRlcic7XHJcbmltcG9ydCB7IE9wdGlvbnNNZW51IH0gZnJvbSAnLi9PcHRpb25zTWVudSc7XHJcbmltcG9ydCBGb250UmVzb3VyY2UgZnJvbSAnLi4vLi4vYXNzZXRzL3Jlc291cmNlcy9Gb250UmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBVaUFzc2V0cyB9IGZyb20gJy4uLy4uL2Fzc2V0cy9Bc3NldHMnO1xyXG5pbXBvcnQgeyBXb3JsZENyZWF0aW9uTWVudSB9IGZyb20gJy4vV29ybGRDcmVhdGlvbk1lbnUnO1xyXG5cclxuZXhwb3J0IGNsYXNzIE1haW5NZW51IGV4dGVuZHMgVWlTY3JlZW4ge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGZvbnQ6IEZvbnRSZXNvdXJjZSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIC8vIG1ha2UgdGhlIGZyYW1lIHdpdGggc29tZSBkZWZhdWx0IHZhbHVlcy4gIFRoZXNlIHdpbGwgbGF0ZXIgYmUgY2hhbmdlZCB0byBmaXQgdGhlIHNjcmVlbiBzaXplLlxyXG4gICAgICAgIHRoaXMuZnJhbWUgPSBuZXcgVWlGcmFtZSgwLCAwLCAwLCAwKTtcclxuXHJcbiAgICAgICAgLy8gbWFrZSA0IGJ1dHRvbnMgd2l0aCBkZWZhdWx0IHBvc2l0aW9uc1xyXG4gICAgICAgIHRoaXMuYnV0dG9ucyA9IFtcclxuICAgICAgICAgICAgbmV3IEJ1dHRvbihmb250LCBcIlJlc3VtZSBHYW1lXCIsIFwiS2VlcCBwbGF5aW5nIHdoZXJlIHlvdSBsZWZ0IG9mZi5cIiwgMCwgMCwgMCwgMCwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJyZXN1bWUgZ2FtZVwiKTtcclxuICAgICAgICAgICAgICAgIGdhbWUuY3VycmVudFVpID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgbmV3IEJ1dHRvbihmb250LCBcIk5ldyBHYW1lXCIsIFwiQ3JlYXRlcyBhIG5ldyBzZXJ2ZXIgdGhhdCB5b3VyIGZyaWVuZHMgY2FuIGpvaW4uXCIsIDAsIDAsIDAsIDAsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibmV3IGdhbWVcIik7XHJcbiAgICAgICAgICAgICAgICBnYW1lLmN1cnJlbnRVaSA9IG5ldyBXb3JsZENyZWF0aW9uTWVudShmb250KTtcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIG5ldyBCdXR0b24oZm9udCwgXCJKb2luIEdhbWVcIiwgXCJKb2luIGEgZ2FtZSB3aXRoIHlvdXIgZnJpZW5kcywgb3IgbWFrZSBuZXcgb25lcy5cIiwgMCwgMCwgMCwgMCwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJqb2luIGdhbWVcIik7XHJcbiAgICAgICAgICAgICAgICBnYW1lLmN1cnJlbnRVaSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIG5ldyBCdXR0b24oZm9udCwgXCJPcHRpb25zXCIsIFwiQ2hhbmdlIHlvdXIga2V5YmluZHMsIHJlZHVjZSBsYWcsIGV0Yy5cIiwgMCwgMCwgMCwgMCwgKCkgPT57XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm9wdGlvbnNcIik7XHJcbiAgICAgICAgICAgICAgICBnYW1lLmN1cnJlbnRVaSA9IG5ldyBPcHRpb25zTWVudShmb250KTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICBdO1xyXG5cclxuICAgICAgICAvLyB1cGRhdGUgdGhlIHNpemUgb2YgdGhlIGVsZW1lbnRzIGJhc2VkIG9uIHRoZSBpbml0aWFsIHNjcmVlbiBzaXplXHJcbiAgICAgICAgdGhpcy53aW5kb3dVcGRhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIodGFyZ2V0OiBwNSwgdXBzY2FsZVNpemU6IG51bWJlcik6IHZvaWQge1xyXG5cclxuICAgICAgICAvLyByZW5kZXIgdGhlIHJlY3Rhbmd1bGFyIGltYWdlIHRoYXQgdGhlIHdob2xlIG1lbnUgaXMgb25cclxuICAgICAgICB0aGlzLmZyYW1lLnJlbmRlcih0YXJnZXQsIHVwc2NhbGVTaXplKTtcclxuXHJcbiAgICAgICAgVWlBc3NldHMudGl0bGVfaW1hZ2UucmVuZGVyKHRhcmdldCwgTWF0aC5yb3VuZCh0aGlzLmZyYW1lLngvdXBzY2FsZVNpemUrMSkqdXBzY2FsZVNpemUsIE1hdGgucm91bmQodGhpcy5mcmFtZS55L3Vwc2NhbGVTaXplKzQpKnVwc2NhbGVTaXplLCAyNTYqdXBzY2FsZVNpemUsIDQwKnVwc2NhbGVTaXplKTtcclxuXHJcbiAgICAgICAgLy8gbG9vcCB0aHJvdWdoIHRoZSBidXR0b25zIGFycmF5IGFuZCByZW5kZXIgZWFjaCBvbmUuXHJcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIHRoaXMuYnV0dG9ucykge1xyXG4gICAgICAgICAgICBpdGVtLnJlbmRlcih0YXJnZXQsIHVwc2NhbGVTaXplKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHdpbmRvd1VwZGF0ZSgpIHtcclxuICAgICAgICAvLyBzZXQgdGhlIHBvc2l0aW9uIG9mIHRoZSBmcmFtZVxyXG4gICAgICAgIHRoaXMuZnJhbWUueCA9IGdhbWUud2lkdGgvMi0yNjQvMipnYW1lLnVwc2NhbGVTaXplOy8vIGNlbnRlciB0aGUgZnJhbWUgaW4gdGhlIG1pZGRsZSBvZiB0aGUgc2NyZWVuXHJcbiAgICAgICAgdGhpcy5mcmFtZS55ID0gZ2FtZS5oZWlnaHQvMi01NipnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgIHRoaXMuZnJhbWUudyA9IDI2NCpnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgIHRoaXMuZnJhbWUuaCA9IDQ4KmdhbWUudXBzY2FsZVNpemU7XHJcblxyXG4gICAgICAgIC8vIHNldCB0aGUgcG9zaXRpb25zIG9mIGFsbCB0aGUgYnV0dG9uc1xyXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGk8NDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS54ID0gZ2FtZS53aWR0aC8yLTE5Mi8yKmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS55ID0gZ2FtZS5oZWlnaHQvMisyMCppKmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS53ID0gMTkyKmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS5oID0gMTYqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLnVwZGF0ZU1vdXNlT3ZlcihnYW1lLm1vdXNlWCwgZ2FtZS5tb3VzZVkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IFVpU2NyZWVuIGZyb20gJy4uL1VpU2NyZWVuJztcclxuaW1wb3J0IHA1IGZyb20gJ3A1JztcclxuaW1wb3J0IFVpRnJhbWUgZnJvbSAnLi4vVWlGcmFtZSc7XHJcbmltcG9ydCBnYW1lIGZyb20gJy4uLy4uL01haW4nO1xyXG5pbXBvcnQgQnV0dG9uIGZyb20gJy4uL0J1dHRvbic7XHJcbmltcG9ydCBGb250UmVzb3VyY2UgZnJvbSAnLi4vLi4vYXNzZXRzL3Jlc291cmNlcy9Gb250UmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBNYWluTWVudSB9IGZyb20gJy4vTWFpbk1lbnUnO1xyXG5pbXBvcnQgeyBWaWRlb1NldHRpbmdzTWVudSB9IGZyb20gJy4vVmlkZW9TZXR0aW5nc01lbnUnO1xyXG5pbXBvcnQgeyBDb250cm9sc01lbnUgfSBmcm9tICcuL0NvbnRyb2xzTWVudSc7XHJcblxyXG5leHBvcnQgY2xhc3MgT3B0aW9uc01lbnUgZXh0ZW5kcyBVaVNjcmVlbiB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZm9udDogRm9udFJlc291cmNlKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICAvLyBtYWtlIHRoZSBmcmFtZSB3aXRoIHNvbWUgZGVmYXVsdCB2YWx1ZXMuICBUaGVzZSB3aWxsIGxhdGVyIGJlIGNoYW5nZWQgdG8gZml0IHRoZSBzY3JlZW4gc2l6ZS5cclxuICAgICAgICB0aGlzLmZyYW1lID0gbmV3IFVpRnJhbWUoMCwgMCwgMCwgMCk7XHJcbiAgICAgICAgLy8gbWFrZSBzb21lIGJ1dHRvbnMgd2l0aCBkZWZhdWx0IHBvc2l0aW9uc1xyXG4gICAgICAgIHRoaXMuYnV0dG9ucyA9IFtcclxuICAgICAgICAgICAgbmV3IEJ1dHRvbihmb250LCBcIlZpZGVvIFNldHRpbmdzXCIsIFwiQ2hhbmdlIHRoZSBiYWxhbmNlIGJldHdlZW4gcGVyZm9ybWFuY2UgYW5kIGZpZGVsaXR5LlwiLCAwLCAwLCAwLCAwLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInZpZGVvIHNldHRpbmdzXCIpO1xyXG4gICAgICAgICAgICAgICAgZ2FtZS5jdXJyZW50VWkgPSBuZXcgVmlkZW9TZXR0aW5nc01lbnUoZm9udCk7XHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBuZXcgQnV0dG9uKGZvbnQsIFwiQ29udHJvbHNcIiwgXCJDaGFuZ2UgeW91ciBrZXliaW5kcy5cIiwgMCwgMCwgMCwgMCwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJjb250cm9sIG1lbnVcIik7XHJcbiAgICAgICAgICAgICAgICBnYW1lLmN1cnJlbnRVaSA9IG5ldyBDb250cm9sc01lbnUoZm9udCk7XHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBuZXcgQnV0dG9uKGZvbnQsIFwiQXVkaW8gU2V0dGluZ3NcIiwgXCJDaGFuZ2UgdGhlIHZvbHVtZSBvZiBkaWZmZXJlbnQgc291bmRzLlwiLCAwLCAwLCAwLCAwLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImF1ZGlvIG1lbnVcIik7XHJcbiAgICAgICAgICAgICAgICBnYW1lLmN1cnJlbnRVaSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIG5ldyBCdXR0b24oZm9udCwgXCJCYWNrXCIsIFwiUmV0dXJuIHRvIHRoZSBtYWluIG1lbnUuXCIsIDAsIDAsIDAsIDAsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibWFpbiBtZW51XCIpO1xyXG4gICAgICAgICAgICAgICAgZ2FtZS5jdXJyZW50VWkgPSBuZXcgTWFpbk1lbnUoZm9udCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgXTtcclxuICAgICAgICAvLyB1cGRhdGUgdGhlIHNpemUgb2YgdGhlIGVsZW1lbnRzIGJhc2VkIG9uIHRoZSBpbml0aWFsIHNjcmVlbiBzaXplXHJcbiAgICAgICAgdGhpcy53aW5kb3dVcGRhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIodGFyZ2V0OiBwNSwgdXBzY2FsZVNpemU6IG51bWJlcik6IHZvaWQge1xyXG5cclxuICAgICAgICAvLyByZW5kZXIgdGhlIHJlY3Rhbmd1bGFyIGltYWdlIHRoYXQgdGhlIHdob2xlIG1lbnUgaXMgb25cclxuICAgICAgICB0aGlzLmZyYW1lLnJlbmRlcih0YXJnZXQsIHVwc2NhbGVTaXplKTtcclxuXHJcbiAgICAgICAgLy8gbG9vcCB0aHJvdWdoIHRoZSBidXR0b25zIGFycmF5IGFuZCByZW5kZXIgZWFjaCBvbmUuXHJcbiAgICAgICAgdGhpcy5idXR0b25zLmZvckVhY2goYnV0dG9uID0+IHtcclxuICAgICAgICAgICAgYnV0dG9uLnJlbmRlcih0YXJnZXQsIHVwc2NhbGVTaXplKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB3aW5kb3dVcGRhdGUoKSB7XHJcbiAgICAgICAgLy8gc2V0IHRoZSBwb3NpdGlvbiBvZiB0aGUgZnJhbWVcclxuICAgICAgICB0aGlzLmZyYW1lLnggPSBnYW1lLndpZHRoLzItMjAwLzIqZ2FtZS51cHNjYWxlU2l6ZTsvLyBjZW50ZXIgdGhlIGZyYW1lIGluIHRoZSBjZW50ZXIgb2YgdGhlIHNjcmVlblxyXG4gICAgICAgIHRoaXMuZnJhbWUueSA9IGdhbWUuaGVpZ2h0LzItNTYqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICB0aGlzLmZyYW1lLncgPSAyMDAqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICB0aGlzLmZyYW1lLmggPSA0OCpnYW1lLnVwc2NhbGVTaXplO1xyXG5cclxuICAgICAgICAvLyBzZXQgdGhlIHBvc2l0aW9ucyBvZiBhbGwgdGhlIGJ1dHRvbnNcclxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpPDQ7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0ueCA9IGdhbWUud2lkdGgvMi0xOTIvMipnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0ueSA9IGdhbWUuaGVpZ2h0LzIrMjAqaSpnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0udyA9IDE5MipnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0uaCA9IDE2KmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS51cGRhdGVNb3VzZU92ZXIoZ2FtZS5tb3VzZVgsIGdhbWUubW91c2VZKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IFVpU2NyZWVuIGZyb20gJy4uL1VpU2NyZWVuJztcclxuaW1wb3J0IHA1IGZyb20gJ3A1JztcclxuaW1wb3J0IFVpRnJhbWUgZnJvbSAnLi4vVWlGcmFtZSc7XHJcbmltcG9ydCBnYW1lIGZyb20gJy4uLy4uL01haW4nO1xyXG5pbXBvcnQgQnV0dG9uIGZyb20gJy4uL0J1dHRvbic7XHJcbmltcG9ydCB7IE9wdGlvbnNNZW51IH0gZnJvbSAnLi9PcHRpb25zTWVudSc7XHJcbmltcG9ydCBGb250UmVzb3VyY2UgZnJvbSAnLi4vLi4vYXNzZXRzL3Jlc291cmNlcy9Gb250UmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBNYWluTWVudSB9IGZyb20gJy4vTWFpbk1lbnUnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFBhdXNlTWVudSBleHRlbmRzIFVpU2NyZWVuIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihmb250OiBGb250UmVzb3VyY2UpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICAvLyBtYWtlIHRoZSBmcmFtZSB3aXRoIHNvbWUgZGVmYXVsdCB2YWx1ZXMuICBUaGVzZSB3aWxsIGxhdGVyIGJlIGNoYW5nZWQgdG8gZml0IHRoZSBzY3JlZW4gc2l6ZS5cclxuICAgICAgICB0aGlzLmZyYW1lID0gbmV3IFVpRnJhbWUoMCwgMCwgMCwgMCk7XHJcblxyXG4gICAgICAgIC8vIG1ha2UgNCBidXR0b25zIHdpdGggZGVmYXVsdCBwb3NpdGlvbnNcclxuICAgICAgICB0aGlzLmJ1dHRvbnMgPSBbXHJcbiAgICAgICAgICAgIG5ldyBCdXR0b24oZm9udCwgXCJSZXN1bWUgZ2FtZVwiLCBcIkdvIGJhY2sgdG8gdGhlIGdhbWUuXCIsIDAsIDAsIDAsIDAsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGdhbWUuY3VycmVudFVpID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgbmV3IEJ1dHRvbihmb250LCBcIk9wdGlvbnNcIiwgXCJDaGFuZ2UgeW91ciBrZXliaW5kcywgcmVkdWNlIGxhZywgZXRjLlwiLCAwLCAwLCAwLCAwLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBnYW1lLmN1cnJlbnRVaSA9IG5ldyBPcHRpb25zTWVudShmb250KTtcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIG5ldyBCdXR0b24oZm9udCwgXCJMZWF2ZSBnYW1lXCIsIFwiR28gYmFjayB0byBNYWluIE1lbnVcIiwgMCwgMCwgMCwgMCwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZ2FtZS5jdXJyZW50VWkgPSBuZXcgTWFpbk1lbnUoZm9udCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgXTtcclxuXHJcbiAgICAgICAgLy8gdXBkYXRlIHRoZSBzaXplIG9mIHRoZSBlbGVtZW50cyBiYXNlZCBvbiB0aGUgaW5pdGlhbCBzY3JlZW4gc2l6ZVxyXG4gICAgICAgIHRoaXMud2luZG93VXBkYXRlKCk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHJlbmRlcih0YXJnZXQ6IHA1LCB1cHNjYWxlU2l6ZTogbnVtYmVyKTogdm9pZCB7XHJcblxyXG4gICAgICAgIC8vIHJlbmRlciB0aGUgcmVjdGFuZ3VsYXIgaW1hZ2UgdGhhdCB0aGUgd2hvbGUgbWVudSBpcyBvblxyXG4gICAgICAgIHRoaXMuZnJhbWUucmVuZGVyKHRhcmdldCwgdXBzY2FsZVNpemUpO1xyXG5cclxuICAgICAgICAvLyBsb29wIHRocm91Z2ggdGhlIGJ1dHRvbnMgYXJyYXkgYW5kIHJlbmRlciBlYWNoIG9uZS5cclxuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdGhpcy5idXR0b25zKSB7XHJcbiAgICAgICAgICAgIGl0ZW0ucmVuZGVyKHRhcmdldCwgdXBzY2FsZVNpemUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgd2luZG93VXBkYXRlKCkge1xyXG4gICAgICAgIC8vIHNldCB0aGUgcG9zaXRpb24gb2YgdGhlIGZyYW1lXHJcbiAgICAgICAgdGhpcy5mcmFtZS54ID0gZ2FtZS53aWR0aC8yLTI1Ni8yKmdhbWUudXBzY2FsZVNpemU7Ly8gY2VudGVyIHRoZSBmcmFtZSBpbiB0aGUgbWlkZGxlIG9mIHRoZSBzY3JlZW5cclxuICAgICAgICB0aGlzLmZyYW1lLnkgPSBnYW1lLmhlaWdodC8yLTcyKmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgdGhpcy5mcmFtZS53ID0gMjU2KmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgdGhpcy5mcmFtZS5oID0gNjQqZ2FtZS51cHNjYWxlU2l6ZTtcclxuXHJcbiAgICAgICAgLy8gc2V0IHRoZSBwb3NpdGlvbnMgb2YgYWxsIHRoZSBidXR0b25zXHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaTwzOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLnggPSBnYW1lLndpZHRoLzItMTkyLzIqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLnkgPSBnYW1lLmhlaWdodC8yKzIwKmkqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLncgPSAxOTIqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLmggPSAxNipnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0udXBkYXRlTW91c2VPdmVyKGdhbWUubW91c2VYLCBnYW1lLm1vdXNlWSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgVWlTY3JlZW4gZnJvbSAnLi4vVWlTY3JlZW4nO1xyXG5pbXBvcnQgcDUgZnJvbSAncDUnO1xyXG5pbXBvcnQgVWlGcmFtZSBmcm9tICcuLi9VaUZyYW1lJztcclxuaW1wb3J0IGdhbWUgZnJvbSAnLi4vLi4vTWFpbic7XHJcbmltcG9ydCBCdXR0b24gZnJvbSAnLi4vQnV0dG9uJztcclxuaW1wb3J0IEZvbnRSZXNvdXJjZSBmcm9tICcuLi8uLi9hc3NldHMvcmVzb3VyY2VzL0ZvbnRSZXNvdXJjZSc7XHJcbmltcG9ydCB7IE9wdGlvbnNNZW51IH0gZnJvbSAnLi9PcHRpb25zTWVudSc7XHJcblxyXG5leHBvcnQgY2xhc3MgVmlkZW9TZXR0aW5nc01lbnUgZXh0ZW5kcyBVaVNjcmVlbiB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZm9udDogRm9udFJlc291cmNlKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICAvLyBtYWtlIHRoZSBmcmFtZSB3aXRoIHNvbWUgZGVmYXVsdCB2YWx1ZXMuICBUaGVzZSB3aWxsIGxhdGVyIGJlIGNoYW5nZWQgdG8gZml0IHRoZSBzY3JlZW4gc2l6ZS5cclxuICAgICAgICB0aGlzLmZyYW1lID0gbmV3IFVpRnJhbWUoMCwgMCwgMCwgMCk7XHJcblxyXG5cclxuICAgICAgICBpZihnYW1lLnNreU1vZCA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICBnYW1lLnNreU1vZCA9IDI7XHJcblxyXG4gICAgICAgIGlmKGdhbWUuc2t5VG9nZ2xlID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIGdhbWUuc2t5VG9nZ2xlID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgaWYoZ2FtZS5wYXJ0aWNsZU11bHRpcGxpZXIgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgZ2FtZS5wYXJ0aWNsZU11bHRpcGxpZXIgPSAxO1xyXG5cclxuICAgICAgICBsZXQgdGVtcFNreU1vZGVUZXh0O1xyXG5cclxuICAgICAgICBpZihnYW1lLnNreU1vZD09PTIpIHtcclxuICAgICAgICAgICAgdGVtcFNreU1vZGVUZXh0ID0gXCJIYWxmIEZyYW1lcmF0ZVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKGdhbWUuc2t5TW9kPT09MSkge1xyXG4gICAgICAgICAgICB0ZW1wU2t5TW9kZVRleHQgPSBcIkZ1bGwgRnJhbWVyYXRlXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0ZW1wU2t5TW9kZVRleHQgPSBcIlNvbGlkIENvbG9yXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgdGVtcFBhcnRpY2xlVGV4dDtcclxuXHJcbiAgICAgICAgaWYoZ2FtZS5wYXJ0aWNsZU11bHRpcGxpZXI9PT0yKSB7XHJcbiAgICAgICAgICAgIHRlbXBQYXJ0aWNsZVRleHQgPSBcIkRvdWJsZVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKGdhbWUucGFydGljbGVNdWx0aXBsaWVyPT09MSkge1xyXG4gICAgICAgICAgICB0ZW1wUGFydGljbGVUZXh0ID0gXCJOb3JtYWxcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRlbXBQYXJ0aWNsZVRleHQgPSBcIk1pbmltYWxcIjtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAvLyBtYWtlIHNvbWUgYnV0dG9ucyB3aXRoIGRlZmF1bHQgcG9zaXRpb25zXHJcbiAgICAgICAgdGhpcy5idXR0b25zID0gW1xyXG4gICAgICAgICAgICBuZXcgQnV0dG9uKGZvbnQsIGBTa3k6ICR7dGVtcFNreU1vZGVUZXh0fWAsIFwiQ2hhbmdlIHRoZSBhcHBlYXJhbmNlIG9mIHRoZSBza3kuXCIsIDAsIDAsIDAsIDAsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2t5IHRvZ2dsZVwiKTtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuYnV0dG9uc1swXS50eHQgPT09IFwiU2t5OiBIYWxmIEZyYW1lcmF0ZVwiKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1dHRvbnNbMF0udHh0ID0gXCJTa3k6IEZ1bGwgRnJhbWVyYXRlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS5za3lNb2QgPSAxO1xyXG4gICAgICAgICAgICAgICAgICAgIGdhbWUuc2t5VG9nZ2xlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYodGhpcy5idXR0b25zWzBdLnR4dCA9PT0gXCJTa3k6IEZ1bGwgRnJhbWVyYXRlXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1dHRvbnNbMF0udHh0ID0gXCJTa3k6IFNvbGlkIENvbG9yXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS5za3lUb2dnbGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnV0dG9uc1swXS50eHQgPSBcIlNreTogSGFsZiBGcmFtZXJhdGVcIjtcclxuICAgICAgICAgICAgICAgICAgICBnYW1lLnNreU1vZCA9IDI7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS5za3lUb2dnbGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgbmV3IEJ1dHRvbihmb250LCBgUGFydGljbGVzOiAke3RlbXBQYXJ0aWNsZVRleHR9YCwgXCJDaGFuZ2UgdGhlIGFtb3VudCBvZiBwYXJ0aWNsZXNcIiwgMCwgMCwgMCwgMCwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJwYXJ0aWNsZXNcIik7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLmJ1dHRvbnNbMV0udHh0ID09PSBcIlBhcnRpY2xlczogTm9ybWFsXCIpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnV0dG9uc1sxXS50eHQgPSBcIlBhcnRpY2xlczogRG91YmxlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS5wYXJ0aWNsZU11bHRpcGxpZXIgPSAyO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZih0aGlzLmJ1dHRvbnNbMV0udHh0ID09PSBcIlBhcnRpY2xlczogRG91YmxlXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1dHRvbnNbMV0udHh0ID0gXCJQYXJ0aWNsZXM6IE1pbmltYWxcIjtcclxuICAgICAgICAgICAgICAgICAgICBnYW1lLnBhcnRpY2xlTXVsdGlwbGllciA9IDAuNTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnV0dG9uc1sxXS50eHQgPSBcIlBhcnRpY2xlczogTm9ybWFsXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS5wYXJ0aWNsZU11bHRpcGxpZXIgPSAxO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgbmV3IEJ1dHRvbihmb250LCBcIkJhY2tcIiwgXCJSZXR1cm4gdG8gdGhlIG1haW4gbWVudS5cIiwgMCwgMCwgMCwgMCwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJtYWluIG1lbnVcIik7XHJcbiAgICAgICAgICAgICAgICBnYW1lLmN1cnJlbnRVaSA9IG5ldyBPcHRpb25zTWVudShmb250KTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICBdO1xyXG4gICAgICAgIC8vIHVwZGF0ZSB0aGUgc2l6ZSBvZiB0aGUgZWxlbWVudHMgYmFzZWQgb24gdGhlIGluaXRpYWwgc2NyZWVuIHNpemVcclxuICAgICAgICB0aGlzLndpbmRvd1VwZGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcih0YXJnZXQ6IHA1LCB1cHNjYWxlU2l6ZTogbnVtYmVyKTogdm9pZCB7XHJcblxyXG4gICAgICAgIC8vIHJlbmRlciB0aGUgcmVjdGFuZ3VsYXIgaW1hZ2VcclxuICAgICAgICB0aGlzLmZyYW1lLnJlbmRlcih0YXJnZXQsIHVwc2NhbGVTaXplKTtcclxuXHJcbiAgICAgICAgLy8gbG9vcCB0aHJvdWdoIHRoZSBidXR0b25zIGFycmF5IGFuZCByZW5kZXIgZWFjaCBvbmUuXHJcbiAgICAgICAgdGhpcy5idXR0b25zLmZvckVhY2goYnV0dG9uID0+IHtcclxuICAgICAgICAgICAgYnV0dG9uLnJlbmRlcih0YXJnZXQsIHVwc2NhbGVTaXplKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB3aW5kb3dVcGRhdGUoKSB7XHJcbiAgICAgICAgLy8gc2V0IHRoZSBwb3NpdGlvbiBvZiB0aGUgZnJhbWVcclxuICAgICAgICB0aGlzLmZyYW1lLnggPSBnYW1lLndpZHRoIC8gMiAtIDIwMCAvIDIgKiBnYW1lLnVwc2NhbGVTaXplOy8vIGNlbnRlciB0aGUgZnJhbWUgaW4gdGhlIGNlbnRlciBvZiB0aGUgc2NyZWVuXHJcbiAgICAgICAgdGhpcy5mcmFtZS55ID0gZ2FtZS5oZWlnaHQgLyAyIC0gNTYgKiBnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgIHRoaXMuZnJhbWUudyA9IDIwMCAqIGdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgdGhpcy5mcmFtZS5oID0gNDggKiBnYW1lLnVwc2NhbGVTaXplO1xyXG5cclxuICAgICAgICAvLyBzZXQgdGhlIHBvc2l0aW9ucyBvZiBhbGwgdGhlIGJ1dHRvbnNcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDM7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0ueCA9IGdhbWUud2lkdGggLyAyIC0gMTkyIC8gMiAqIGdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS55ID0gZ2FtZS5oZWlnaHQgLyAyICsgMjAgKiBpICogZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLncgPSAxOTIgKiBnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0uaCA9IDE2ICogZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLnVwZGF0ZU1vdXNlT3ZlcihnYW1lLm1vdXNlWCwgZ2FtZS5tb3VzZVkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgVWlTY3JlZW4gZnJvbSAnLi4vVWlTY3JlZW4nO1xyXG5pbXBvcnQgcDUgZnJvbSAncDUnO1xyXG5pbXBvcnQgVWlGcmFtZSBmcm9tICcuLi9VaUZyYW1lJztcclxuaW1wb3J0IGdhbWUgZnJvbSAnLi4vLi4vTWFpbic7XHJcbmltcG9ydCBCdXR0b24gZnJvbSAnLi4vQnV0dG9uJztcclxuaW1wb3J0IEZvbnRSZXNvdXJjZSBmcm9tICcuLi8uLi9hc3NldHMvcmVzb3VyY2VzL0ZvbnRSZXNvdXJjZSc7XHJcbmltcG9ydCB7IE1haW5NZW51IH0gZnJvbSAnLi9NYWluTWVudSc7XHJcbmltcG9ydCB7IFdvcmxkT3B0aW9uc01lbnUgfSBmcm9tICcuL1dvcmxkT3B0aW9uc01lbnUnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdvcmxkQ3JlYXRpb25NZW51IGV4dGVuZHMgVWlTY3JlZW4ge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGZvbnQ6IEZvbnRSZXNvdXJjZSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgLy8gbWFrZSB0aGUgZnJhbWUgd2l0aCBzb21lIGRlZmF1bHQgdmFsdWVzLiAgVGhlc2Ugd2lsbCBsYXRlciBiZSBjaGFuZ2VkIHRvIGZpdCB0aGUgc2NyZWVuIHNpemUuXHJcbiAgICAgICAgdGhpcy5mcmFtZSA9IG5ldyBVaUZyYW1lKDAsIDAsIDAsIDApO1xyXG4gICAgICAgIC8vIG1ha2Ugc29tZSBidXR0b25zIHdpdGggZGVmYXVsdCBwb3NpdGlvbnNcclxuICAgICAgICBpZiAoZ2FtZS5zZXJ2ZXJWaXNpYmlsaXR5ID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIGdhbWUuc2VydmVyVmlzaWJpbGl0eSA9IFwiUHVibGljXCI7XHJcblxyXG4gICAgICAgIHRoaXMuYnV0dG9ucyA9IFtcclxuICAgICAgICAgICAgbmV3IEJ1dHRvbihmb250LCBgU2VydmVyIFZpc2liaWxpdHk6ICR7Z2FtZS5zZXJ2ZXJWaXNpYmlsaXR5fWAsIFwiQ2hhbmdlIHRoZSB2aXNpYmlsaXR5IG9mIHRoZSBzZXJ2ZXJcIiwgMCwgMCwgMCwgMCwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYnV0dG9uc1swXS50eHQgPT09IFwiU2VydmVyIFZpc2liaWxpdHk6IFB1YmxpY1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS5zZXJ2ZXJWaXNpYmlsaXR5ID0gXCJVbmxpc3RlZFwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnV0dG9uc1swXS50eHQgPSBcIlNlcnZlciBWaXNpYmlsaXR5OiBVbmxpc3RlZFwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5idXR0b25zWzBdLnR4dCA9PT0gXCJTZXJ2ZXIgVmlzaWJpbGl0eTogVW5saXN0ZWRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIGdhbWUuc2VydmVyVmlzaWJpbGl0eSA9IFwiUHJpdmF0ZVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnV0dG9uc1swXS50eHQgPSBcIlNlcnZlciBWaXNpYmlsaXR5OiBQcml2YXRlXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBnYW1lLnNlcnZlclZpc2liaWxpdHkgPSBcIlB1YmxpY1wiO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnV0dG9uc1swXS50eHQgPSBcIlNlcnZlciBWaXNpYmlsaXR5OiBQdWJsaWNcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIG5ldyBCdXR0b24oZm9udCwgXCJXb3JsZCBPcHRpb25zXCIsIFwiQ2hhbmdlIGhvdyB5b3VyIHdvcmxkIGxvb2tzIGFuZCBnZW5lcmF0ZXMuXCIsIDAsIDAsIDAsIDAsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwid29ybGQgbWVudVwiKTtcclxuICAgICAgICAgICAgICAgIGdhbWUuY3VycmVudFVpID0gbmV3IFdvcmxkT3B0aW9uc01lbnUoZm9udCk7XHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBuZXcgQnV0dG9uKGZvbnQsIFwiQmFja1wiLCBcIlJldHVybiB0byB0aGUgbWFpbiBtZW51LlwiLCAwLCAwLCAwLCAwLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm1haW4gbWVudVwiKTtcclxuICAgICAgICAgICAgICAgIGdhbWUuY3VycmVudFVpID0gbmV3IE1haW5NZW51KGZvbnQpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIF07XHJcbiAgICAgICAgLy8gdXBkYXRlIHRoZSBzaXplIG9mIHRoZSBlbGVtZW50cyBiYXNlZCBvbiB0aGUgaW5pdGlhbCBzY3JlZW4gc2l6ZVxyXG4gICAgICAgIHRoaXMud2luZG93VXBkYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKHRhcmdldDogcDUsIHVwc2NhbGVTaXplOiBudW1iZXIpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgLy8gcmVuZGVyIHRoZSByZWN0YW5ndWxhciBpbWFnZSB0aGF0IHRoZSB3aG9sZSBtZW51IGlzIG9uXHJcbiAgICAgICAgdGhpcy5mcmFtZS5yZW5kZXIodGFyZ2V0LCB1cHNjYWxlU2l6ZSk7XHJcblxyXG4gICAgICAgIC8vIGxvb3AgdGhyb3VnaCB0aGUgYnV0dG9ucyBhcnJheSBhbmQgcmVuZGVyIGVhY2ggb25lLlxyXG4gICAgICAgIHRoaXMuYnV0dG9ucy5mb3JFYWNoKGJ1dHRvbiA9PiB7XHJcbiAgICAgICAgICAgIGJ1dHRvbi5yZW5kZXIodGFyZ2V0LCB1cHNjYWxlU2l6ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgd2luZG93VXBkYXRlKCkge1xyXG4gICAgICAgIC8vIHNldCB0aGUgcG9zaXRpb24gb2YgdGhlIGZyYW1lXHJcbiAgICAgICAgdGhpcy5mcmFtZS54ID0gZ2FtZS53aWR0aCAvIDIgLSAyMDAgLyAyICogZ2FtZS51cHNjYWxlU2l6ZTsvLyBjZW50ZXIgdGhlIGZyYW1lIGluIHRoZSBjZW50ZXIgb2YgdGhlIHNjcmVlblxyXG4gICAgICAgIHRoaXMuZnJhbWUueSA9IGdhbWUuaGVpZ2h0IC8gMiAtIDU2ICogZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICB0aGlzLmZyYW1lLncgPSAyMDAgKiBnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgIHRoaXMuZnJhbWUuaCA9IDQ4ICogZ2FtZS51cHNjYWxlU2l6ZTtcclxuXHJcbiAgICAgICAgLy8gc2V0IHRoZSBwb3NpdGlvbnMgb2YgYWxsIHRoZSBidXR0b25zXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAzOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLnggPSBnYW1lLndpZHRoIC8gMiAtIDE5MiAvIDIgKiBnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0ueSA9IGdhbWUuaGVpZ2h0IC8gMiArIDIwICogaSAqIGdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS53ID0gMTkyICogZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLmggPSAxNiAqIGdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS51cGRhdGVNb3VzZU92ZXIoZ2FtZS5tb3VzZVgsIGdhbWUubW91c2VZKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IFVpU2NyZWVuIGZyb20gJy4uL1VpU2NyZWVuJztcclxuaW1wb3J0IHA1IGZyb20gJ3A1JztcclxuaW1wb3J0IFVpRnJhbWUgZnJvbSAnLi4vVWlGcmFtZSc7XHJcbmltcG9ydCBnYW1lIGZyb20gJy4uLy4uL01haW4nO1xyXG5pbXBvcnQgQnV0dG9uIGZyb20gJy4uL0J1dHRvbic7XHJcbmltcG9ydCBGb250UmVzb3VyY2UgZnJvbSAnLi4vLi4vYXNzZXRzL3Jlc291cmNlcy9Gb250UmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBXb3JsZENyZWF0aW9uTWVudSB9IGZyb20gJy4vV29ybGRDcmVhdGlvbk1lbnUnO1xyXG5pbXBvcnQgU2xpZGVyIGZyb20gJy4uL1NsaWRlcic7XHJcblxyXG5leHBvcnQgY2xhc3MgV29ybGRPcHRpb25zTWVudSBleHRlbmRzIFVpU2NyZWVuIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihmb250OiBGb250UmVzb3VyY2UpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIC8vIG1ha2UgdGhlIGZyYW1lIHdpdGggc29tZSBkZWZhdWx0IHZhbHVlcy4gIFRoZXNlIHdpbGwgbGF0ZXIgYmUgY2hhbmdlZCB0byBmaXQgdGhlIHNjcmVlbiBzaXplLlxyXG4gICAgICAgIHRoaXMuZnJhbWUgPSBuZXcgVWlGcmFtZSgwLCAwLCAwLCAwKTtcclxuICAgICAgICAvLyBtYWtlIHNvbWUgYnV0dG9ucyB3aXRoIGRlZmF1bHQgcG9zaXRpb25zXHJcbiAgICAgICAgaWYoZ2FtZS53b3JsZEJ1bXBpbmVzcyA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICBnYW1lLndvcmxkQnVtcGluZXNzID0gMTtcclxuXHJcblxyXG4gICAgICAgIGxldCB0ZW1wV29ybGRCdW1waW5lc3NUZXh0O1xyXG5cclxuICAgICAgICBpZihnYW1lLndvcmxkQnVtcGluZXNzPT09MSkge1xyXG4gICAgICAgICAgICB0ZW1wV29ybGRCdW1waW5lc3NUZXh0ID0gXCJOb3JtYWxcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZihnYW1lLndvcmxkQnVtcGluZXNzPT09MCkge1xyXG4gICAgICAgICAgICB0ZW1wV29ybGRCdW1waW5lc3NUZXh0ID0gXCJTdXBlcmZsYXRcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRlbXBXb3JsZEJ1bXBpbmVzc1RleHQgPSBcIkFtcGxpZmllZFwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmJ1dHRvbnMgPSBbXHJcbiAgICAgICAgICAgIG5ldyBCdXR0b24oZm9udCwgYFdvcmxkIEJ1bXBpbmVzczogJHt0ZW1wV29ybGRCdW1waW5lc3NUZXh0fWAsIFwiQ2hhbmdlIHRoZSBpbnRlbnNpdHkgb2YgdGhlIHdvcmxkJ3MgYnVtcHMuXCIsIDAsIDAsIDAsIDAsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuYnV0dG9uc1swXS50eHQgPT09IFwiV29ybGQgQnVtcGluZXNzOiBOb3JtYWxcIil7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idXR0b25zWzBdLnR4dCA9IFwiV29ybGQgQnVtcGluZXNzOiBBbXBsaWZpZWRcIjtcclxuICAgICAgICAgICAgICAgICAgICBnYW1lLndvcmxkQnVtcGluZXNzID0gMztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYodGhpcy5idXR0b25zWzBdLnR4dCA9PT0gXCJXb3JsZCBCdW1waW5lc3M6IEFtcGxpZmllZFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idXR0b25zWzBdLnR4dCA9IFwiV29ybGQgQnVtcGluZXNzOiBTdXBlcmZsYXRcIjtcclxuICAgICAgICAgICAgICAgICAgICBnYW1lLndvcmxkQnVtcGluZXNzID0gMDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnV0dG9uc1swXS50eHQgPSBcIldvcmxkIEJ1bXBpbmVzczogTm9ybWFsXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS53b3JsZEJ1bXBpbmVzcyA9IDE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBuZXcgQnV0dG9uKGZvbnQsIFwiQmFja1wiLCBcIlJldHVybiB0byB0aGUgbWFpbiBtZW51LlwiLCAwLCAwLCAwLCAwLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm1haW4gbWVudVwiKTtcclxuICAgICAgICAgICAgICAgIGdhbWUuY3VycmVudFVpID0gbmV3IFdvcmxkQ3JlYXRpb25NZW51KGZvbnQpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIF07XHJcbiAgICAgICAgdGhpcy5zbGlkZXJzID0gW1xyXG4gICAgICAgICAgICBuZXcgU2xpZGVyKGZvbnQsIFwiV2lkdGhcIiwgNTEyLCA2NCwgMjA0OCwgNjQsIDAsIDAsIDAsIDAsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGdhbWUud29ybGRXaWR0aCA9IHRoaXMuc2xpZGVyc1swXS52YWx1ZTtcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIG5ldyBTbGlkZXIoZm9udCwgXCJIZWlnaHRcIiwgNjQsIDY0LCA1MTIsIDE2LCAwLCAwLCAwLCAwLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBnYW1lLndvcmxkSGVpZ2h0ID0gdGhpcy5zbGlkZXJzWzFdLnZhbHVlO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIF07XHJcbiAgICAgICAgLy8gdXBkYXRlIHRoZSBzaXplIG9mIHRoZSBlbGVtZW50cyBiYXNlZCBvbiB0aGUgaW5pdGlhbCBzY3JlZW4gc2l6ZVxyXG4gICAgICAgIHRoaXMud2luZG93VXBkYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKHRhcmdldDogcDUsIHVwc2NhbGVTaXplOiBudW1iZXIpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgLy8gcmVuZGVyIHRoZSByZWN0YW5ndWxhciBpbWFnZSB0aGF0IHRoZSB3aG9sZSBtZW51IGlzIG9uXHJcbiAgICAgICAgdGhpcy5mcmFtZS5yZW5kZXIodGFyZ2V0LCB1cHNjYWxlU2l6ZSk7XHJcblxyXG4gICAgICAgIC8vIGxvb3AgdGhyb3VnaCB0aGUgYnV0dG9ucyBhcnJheSBhbmQgcmVuZGVyIGVhY2ggb25lLlxyXG4gICAgICAgIHRoaXMuYnV0dG9ucy5mb3JFYWNoKGJ1dHRvbiA9PiB7XHJcbiAgICAgICAgICAgIGJ1dHRvbi5yZW5kZXIodGFyZ2V0LCB1cHNjYWxlU2l6ZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIGxvb3AgdGhyb3VnaCB0aGUgc2xpZGVycyBhcnJheSBhbmQgcmVuZGVyIGVhY2ggb25lLlxyXG4gICAgICAgIHRoaXMuc2xpZGVycy5mb3JFYWNoKHNsaWRlciA9PiB7XHJcbiAgICAgICAgICAgIHNsaWRlci5yZW5kZXIodGFyZ2V0LCB1cHNjYWxlU2l6ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgd2luZG93VXBkYXRlKCkge1xyXG4gICAgICAgIC8vIHNldCB0aGUgcG9zaXRpb24gb2YgdGhlIGZyYW1lXHJcbiAgICAgICAgdGhpcy5mcmFtZS54ID0gZ2FtZS53aWR0aC8yLTIwMC8yKmdhbWUudXBzY2FsZVNpemU7Ly8gY2VudGVyIHRoZSBmcmFtZSBpbiB0aGUgY2VudGVyIG9mIHRoZSBzY3JlZW5cclxuICAgICAgICB0aGlzLmZyYW1lLnkgPSBnYW1lLmhlaWdodC8yLTU2KmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgdGhpcy5mcmFtZS53ID0gMjAwKmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgdGhpcy5mcmFtZS5oID0gNDgqZ2FtZS51cHNjYWxlU2l6ZTtcclxuXHJcbiAgICAgICAgLy8gc2V0IHRoZSBwb3NpdGlvbnMgb2YgYWxsIHRoZSBidXR0b25zXHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaTwyOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLnggPSBnYW1lLndpZHRoLzItMTkyLzIqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLnkgPSBnYW1lLmhlaWdodC8yKzYwKmkqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLncgPSAxOTIqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLmggPSAxNipnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0udXBkYXRlTW91c2VPdmVyKGdhbWUubW91c2VYLCBnYW1lLm1vdXNlWSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBzZXQgdGhlIHBvc2l0aW9ucyBvZiBhbGwgdGhlIHNsaWRlcnNcclxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpPDI7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLnNsaWRlcnNbaV0ueCA9IGdhbWUud2lkdGgvMi0xOTIvMipnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLnNsaWRlcnNbaV0ueSA9IGdhbWUuaGVpZ2h0LzIrMjAqZ2FtZS51cHNjYWxlU2l6ZSsyMCppKmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuc2xpZGVyc1tpXS53ID0gMTkyKmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuc2xpZGVyc1tpXS5oID0gMTYqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgaWYoZ2FtZS5tb3VzZUlzUHJlc3NlZClcclxuICAgICAgICAgICAgICAgIHRoaXMuc2xpZGVyc1tpXS51cGRhdGVTbGlkZXJQb3NpdGlvbihnYW1lLm1vdXNlWCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCBHYW1lIGZyb20gJy4uL0dhbWUnO1xyXG5pbXBvcnQgV29ybGQgZnJvbSAnLi4vd29ybGQvV29ybGQnO1xyXG5pbXBvcnQgeyBFbnRpdHlDbGFzc2VzIH0gZnJvbSAnLi4vd29ybGQvZW50aXRpZXMvRW50aXR5Q2xhc3Nlcyc7XHJcbmltcG9ydCBQbGF5ZXJMb2NhbCBmcm9tICcuLi93b3JsZC9lbnRpdGllcy9QbGF5ZXJMb2NhbCc7XHJcblxyXG5leHBvcnQgY2xhc3MgTmV0TWFuYWdlciB7XHJcblxyXG4gICAgZ2FtZTogR2FtZVxyXG5cclxuICAgIHBsYXllclRpY2tSYXRlOiBudW1iZXJcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihnYW1lOiBHYW1lKSB7XHJcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZVxyXG5cclxuICAgICAgICAvLyBJbml0IGV2ZW50XHJcbiAgICAgICAgdGhpcy5nYW1lLmNvbm5lY3Rpb24ub24oJ2luaXQnLCAoIHBsYXllclRpY2tSYXRlLCB0b2tlbiApID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coYFRpY2sgcmF0ZSBzZXQgdG86ICR7cGxheWVyVGlja1JhdGV9YCk7XHJcbiAgICAgICAgICAgIHRoaXMucGxheWVyVGlja1JhdGUgPSBwbGF5ZXJUaWNrUmF0ZTtcclxuICAgICAgICAgICAgaWYgKHRva2VuKSB7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3Rva2VuJywgdG9rZW4pO1xyXG4gICAgICAgICAgICAgICAgKHRoaXMuZ2FtZS5jb25uZWN0aW9uLmF1dGggYXMgeyB0b2tlbjogc3RyaW5nIH0pLnRva2VuID0gdG9rZW47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gSW5pdGlhbGl6YXRpb24gZXZlbnRzXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvLyBMb2FkIHRoZSB3b3JsZCBhbmQgc2V0IHRoZSBwbGF5ZXIgZW50aXR5IGlkXHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5jb25uZWN0aW9uLm9uKFxyXG4gICAgICAgICAgICAgICAgJ3dvcmxkTG9hZCcsKHdpZHRoLCBoZWlnaHQsIHRpbGVzLCB0aWxlRW50aXRpZXMsIGVudGl0aWVzLCBwbGF5ZXIpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlbnRpdGllcylcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWUud29ybGQgPSBuZXcgV29ybGQoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbGVzLFxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nYW1lLndvcmxkLnBsYXllciA9IG5ldyBQbGF5ZXJMb2NhbChwbGF5ZXIpXHJcbiAgICAgICAgICAgICAgICAgICAgZW50aXRpZXMuZm9yRWFjaCgoZW50aXR5KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS53b3JsZC5lbnRpdGllc1tlbnRpdHkuaWRdID0gbmV3IEVudGl0eUNsYXNzZXNbZW50aXR5LnR5cGVdKGVudGl0eSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFdvcmxkIGV2ZW50c1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy8gVGlsZSB1cGRhdGVzIHN1Y2ggYXMgYnJlYWtpbmcgYW5kIHBsYWNpbmdcclxuICAgICAgICAgICAgdGhpcy5nYW1lLmNvbm5lY3Rpb24ub24oXHJcbiAgICAgICAgICAgICAgICAnd29ybGRVcGRhdGUnLFxyXG4gICAgICAgICAgICAgICAgKHVwZGF0ZWRUaWxlczogeyB0aWxlSW5kZXg6IG51bWJlcjsgdGlsZTogbnVtYmVyIH1bXSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIElmIHRoZSB3b3JsZCBpcyBub3Qgc2V0XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2FtZS53b3JsZCA9PT0gdW5kZWZpbmVkKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZWRUaWxlcy5mb3JFYWNoKCh0aWxlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS53b3JsZC51cGRhdGVUaWxlKHRpbGUudGlsZUluZGV4LCB0aWxlLnRpbGUpXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBQbGF5ZXIgZXZlbnRzXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvLyBVcGRhdGUgdGhlIHBsYXllclxyXG4gICAgICAgICAgICB0aGlzLmdhbWUuY29ubmVjdGlvbi5vbignc2V0UGxheWVyJywgKHgsIHksIHlWZWwsIHhWZWwpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIElmIHRoZSB3b3JsZCBpcyBub3Qgc2V0XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nYW1lLndvcmxkID09PSB1bmRlZmluZWQpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUud29ybGQucGxheWVyLnggPSB4O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLndvcmxkLnBsYXllci55ID0geTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS53b3JsZC5wbGF5ZXIueVZlbCA9IHlWZWw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUud29ybGQucGxheWVyLnhWZWwgPSB4VmVsO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5jb25uZWN0aW9uLm9uKCdlbnRpdHlVcGRhdGUnLCAoZW50aXR5RGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlIHdvcmxkIGlzIG5vdCBzZXRcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdhbWUud29ybGQgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGVudGl0eSA9IHRoaXMuZ2FtZS53b3JsZC5lbnRpdGllc1tlbnRpdHlEYXRhLmlkXVxyXG4gICAgICAgICAgICAgICAgaWYgKGVudGl0eSA9PT0gdW5kZWZpbmVkKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAgICAgZW50aXR5LnVwZGF0ZURhdGEoZW50aXR5RGF0YSlcclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5jb25uZWN0aW9uLm9uKCdlbnRpdHlDcmVhdGUnLCAoZW50aXR5RGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlIHdvcmxkIGlzIG5vdCBzZXRcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdhbWUud29ybGQgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS53b3JsZC5lbnRpdGllc1tlbnRpdHlEYXRhLmlkXSA9IG5ldyBFbnRpdHlDbGFzc2VzW2VudGl0eURhdGEudHlwZV0oZW50aXR5RGF0YSk7XHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICB0aGlzLmdhbWUuY29ubmVjdGlvbi5vbignZW50aXR5RGVsZXRlJywgKGlkKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyBJZiB0aGUgd29ybGQgaXMgbm90IHNldFxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2FtZS53b3JsZCA9PT0gdW5kZWZpbmVkKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuZ2FtZS53b3JsZC5lbnRpdGllc1tpZF1cclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIC8vIFVwZGF0ZSB0aGUgb3RoZXIgcGxheWVycyBpbiB0aGUgd29ybGRcclxuICAgICAgICAgICAgdGhpcy5nYW1lLmNvbm5lY3Rpb24ub24oXHJcbiAgICAgICAgICAgICAgICAnZW50aXR5U25hcHNob3QnLFxyXG4gICAgICAgICAgICAgICAgKHNuYXBzaG90OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWQ6IHN0cmluZztcclxuICAgICAgICAgICAgICAgICAgICB0aW1lOiBudW1iZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGU6IHsgaWQ6IHN0cmluZzsgeDogc3RyaW5nOyB5OiBzdHJpbmcgfVtdO1xyXG4gICAgICAgICAgICAgICAgfSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIElmIHRoZSB3b3JsZCBpcyBub3Qgc2V0XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2FtZS53b3JsZCA9PT0gdW5kZWZpbmVkKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS53b3JsZC51cGRhdGVQbGF5ZXJzKHNuYXBzaG90KVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgZ2FtZSBmcm9tICcuLi9NYWluJztcclxuaW1wb3J0IFA1IGZyb20gJ3A1JztcclxuaW1wb3J0IEltYWdlUmVzb3VyY2UgZnJvbSAnLi4vYXNzZXRzL3Jlc291cmNlcy9JbWFnZVJlc291cmNlJztcclxuaW1wb3J0IFRpbGVSZXNvdXJjZSBmcm9tICcuLi9hc3NldHMvcmVzb3VyY2VzL1RpbGVSZXNvdXJjZSc7XHJcbmltcG9ydCBUaWNrYWJsZSBmcm9tICcuLi9pbnRlcmZhY2VzL1RpY2thYmxlJztcclxuaW1wb3J0IFJlbmRlcmFibGUgZnJvbSAnLi4vaW50ZXJmYWNlcy9SZW5kZXJhYmxlJztcclxuaW1wb3J0IEdhbWUgZnJvbSAnLi4vR2FtZSc7XHJcbmltcG9ydCBQbGF5ZXJMb2NhbCBmcm9tICcuL2VudGl0aWVzL1BsYXllckxvY2FsJztcclxuaW1wb3J0IHsgU2VydmVyRW50aXR5IH0gZnJvbSAnLi9lbnRpdGllcy9TZXJ2ZXJFbnRpdHknO1xyXG5pbXBvcnQgeyBTbmFwc2hvdEludGVycG9sYXRpb24gfSBmcm9tICdAZ2Vja29zLmlvL3NuYXBzaG90LWludGVycG9sYXRpb24nO1xyXG5pbXBvcnQgeyBFbnRpdHksIFNuYXBzaG90IH0gZnJvbSAnQGdlY2tvcy5pby9zbmFwc2hvdC1pbnRlcnBvbGF0aW9uL2xpYi90eXBlcyc7XHJcbmltcG9ydCB7IFRpbGUsIFdvcmxkVGlsZXMgfSBmcm9tICcuL1dvcmxkVGlsZXMnO1xyXG5pbXBvcnQgeyBUaWxlVHlwZSB9IGZyb20gJy4uLy4uLy4uL2FwaS9UaWxlJztcclxuXHJcbmNsYXNzIFdvcmxkIGltcGxlbWVudHMgVGlja2FibGUsIFJlbmRlcmFibGUge1xyXG4gICAgd2lkdGg6IG51bWJlcjsgLy8gd2lkdGggb2YgdGhlIHdvcmxkIGluIHRpbGVzXHJcbiAgICBoZWlnaHQ6IG51bWJlcjsgLy8gaGVpZ2h0IG9mIHRoZSB3b3JsZCBpbiB0aWxlc1xyXG5cclxuICAgIHRpbGVMYXllcjogUDUuR3JhcGhpY3M7IC8vIFRpbGUgbGF5ZXIgZ3JhcGhpY1xyXG5cclxuXHJcbiAgICB3b3JsZFRpbGVzOiAoVGlsZVR5cGUpW107IC8vIG51bWJlciBmb3IgZWFjaCB0aWxlcyBpbiB0aGUgd29ybGQgZXg6IFsxLCAxLCAwLCAxLCAyLCAwLCAwLCAxLi4uICBdIG1lYW5zIHNub3csIHNub3csIGFpciwgc25vdywgaWNlLCBhaXIsIGFpciwgc25vdy4uLlxyXG5cclxuICAgIHBsYXllcjogUGxheWVyTG9jYWw7XHJcblxyXG4gICAgZW50aXRpZXM6IHsgW2lkOiBzdHJpbmddOiBTZXJ2ZXJFbnRpdHkgfSA9IHt9O1xyXG5cclxuICAgIHNuYXBzaG90SW50ZXJwb2xhdGlvbjogU25hcHNob3RJbnRlcnBvbGF0aW9uO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHdpZHRoOiBudW1iZXIsXHJcbiAgICAgICAgaGVpZ2h0OiBudW1iZXIsXHJcbiAgICAgICAgdGlsZXM6IChUaWxlVHlwZSlbXVxyXG4gICAgKSB7XHJcbiAgICAgICAgLy8gSW5pdGlhbGl6ZSB0aGUgd29ybGQgd2l0aCB0aGUgdGlsZXMgYW5kIGRpbWVuc2lvbnMgZnJvbSB0aGUgc2VydmVyXHJcbiAgICAgICAgdGhpcy53aWR0aCA9IHdpZHRoO1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG4gICAgICAgIHRoaXMud29ybGRUaWxlcyA9IHRpbGVzO1xyXG5cclxuICAgICAgICB0aGlzLnNuYXBzaG90SW50ZXJwb2xhdGlvbiA9IG5ldyBTbmFwc2hvdEludGVycG9sYXRpb24oKTtcclxuICAgICAgICB0aGlzLnNuYXBzaG90SW50ZXJwb2xhdGlvbi5pbnRlcnBvbGF0aW9uQnVmZmVyLnNldChcclxuICAgICAgICAgICAgKDEwMDAgLyBnYW1lLm5ldE1hbmFnZXIucGxheWVyVGlja1JhdGUpICogMlxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIC8vIGRlZmluZSB0aGUgcDUuR3JhcGhpY3Mgb2JqZWN0cyB0aGF0IGhvbGQgYW4gaW1hZ2Ugb2YgdGhlIHRpbGVzIG9mIHRoZSB3b3JsZC4gIFRoZXNlIGFjdCBzb3J0IG9mIGxpa2UgYSB2aXJ0dWFsIGNhbnZhcyBhbmQgY2FuIGJlIGRyYXduIG9uIGp1c3QgbGlrZSBhIG5vcm1hbCBjYW52YXMgYnkgdXNpbmcgdGlsZUxheWVyLnJlY3QoKTssIHRpbGVMYXllci5lbGxpcHNlKCk7LCB0aWxlTGF5ZXIuZmlsbCgpOywgZXRjLlxyXG4gICAgICAgIHRoaXMudGlsZUxheWVyID0gZ2FtZS5jcmVhdGVHcmFwaGljcyhcclxuICAgICAgICAgICAgdGhpcy53aWR0aCAqIGdhbWUuVElMRV9XSURUSCxcclxuICAgICAgICAgICAgdGhpcy5oZWlnaHQgKiBnYW1lLlRJTEVfSEVJR0hUXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgdGhpcy5sb2FkV29ybGQoKTtcclxuICAgIH1cclxuXHJcbiAgICB0aWNrKGdhbWU6IEdhbWUpIHtcclxuICAgICAgICBpZiAodGhpcy5wbGF5ZXIgIT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgZ2FtZS5jb25uZWN0aW9uLmVtaXQoJ3BsYXllclVwZGF0ZScsIHRoaXMucGxheWVyLngsIHRoaXMucGxheWVyLnkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcih0YXJnZXQ6IEdhbWUsIHVwc2NhbGVTaXplOiBudW1iZXIpIHtcclxuICAgICAgICAvLyBkcmF3IHRoZSB0aWxlcyBsYXllciBvbnRvIHRoZSBzY3JlZW5cclxuICAgICAgICB0YXJnZXQuaW1hZ2UoXHJcbiAgICAgICAgICAgIHRoaXMudGlsZUxheWVyLFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICAoZ2FtZS53aWR0aC91cHNjYWxlU2l6ZSkqdXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIChnYW1lLmhlaWdodC91cHNjYWxlU2l6ZSkqdXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIChnYW1lLmludGVycG9sYXRlZENhbVggKiBnYW1lLlRJTEVfV0lEVEgpLFxyXG4gICAgICAgICAgICAoZ2FtZS5pbnRlcnBvbGF0ZWRDYW1ZICogZ2FtZS5USUxFX1dJRFRIKSxcclxuICAgICAgICAgICAgKGdhbWUud2lkdGggLyB1cHNjYWxlU2l6ZSksXHJcbiAgICAgICAgICAgIChnYW1lLmhlaWdodCAvIHVwc2NhbGVTaXplKVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHRoaXMucmVuZGVyUGxheWVycyh0YXJnZXQsIHVwc2NhbGVTaXplKTtcclxuXHJcbiAgICAgICAgdGFyZ2V0LnN0cm9rZSgwKTtcclxuICAgICAgICB0YXJnZXQuc3Ryb2tlV2VpZ2h0KDQpO1xyXG4gICAgICAgIHRhcmdldC5ub0ZpbGwoKTtcclxuICAgICAgICB0YXJnZXQucmVjdCh0YXJnZXQud2lkdGgtdGhpcy53aWR0aCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xyXG5cclxuICAgICAgICB0YXJnZXQuaW1hZ2UoXHJcbiAgICAgICAgICAgIHRoaXMudGlsZUxheWVyLFxyXG4gICAgICAgICAgICB0YXJnZXQud2lkdGgtdGhpcy53aWR0aCxcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgdGhpcy53aWR0aCxcclxuICAgICAgICAgICAgdGhpcy5oZWlnaHRcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVBsYXllcnMoc25hcHNob3Q6IFNuYXBzaG90KSB7XHJcbiAgICAgICAgdGhpcy5zbmFwc2hvdEludGVycG9sYXRpb24uc25hcHNob3QuYWRkKHNuYXBzaG90KTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVUaWxlKHRpbGVJbmRleDogbnVtYmVyLCB0aWxlOiBUaWxlVHlwZSkge1xyXG4gICAgICAgIC8vIFVwZGF0ZSB0aGUgdGlsZSBhbmQgdGhlIDQgbmVpZ2hib3VyaW5nIHRpbGVzXHJcbiAgICAgICAgdGhpcy53b3JsZFRpbGVzW3RpbGVJbmRleF0gPSB0aWxlO1xyXG5cclxuICAgICAgICAvLyBlcmFzZSB0aGUgYnJva2VuIHRpbGVzIGFuZCBpdHMgc3Vycm91bmRpbmcgdGlsZXMgdXNpbmcgdHdvIGVyYXNpbmcgcmVjdGFuZ2xlcyBpbiBhICsgc2hhcGVcclxuICAgICAgICB0aGlzLnRpbGVMYXllci5lcmFzZSgpO1xyXG4gICAgICAgIHRoaXMudGlsZUxheWVyLm5vU3Ryb2tlKCk7XHJcbiAgICAgICAgdGhpcy50aWxlTGF5ZXIucmVjdChcclxuICAgICAgICAgICAgKCh0aWxlSW5kZXggJSB0aGlzLndpZHRoKSAtIDEpICogZ2FtZS5USUxFX1dJRFRILFxyXG4gICAgICAgICAgICBNYXRoLmZsb29yKHRpbGVJbmRleCAvIHRoaXMud2lkdGgpICogZ2FtZS5USUxFX0hFSUdIVCxcclxuICAgICAgICAgICAgZ2FtZS5USUxFX1dJRFRIICogMyxcclxuICAgICAgICAgICAgZ2FtZS5USUxFX0hFSUdIVFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgdGhpcy50aWxlTGF5ZXIucmVjdChcclxuICAgICAgICAgICAgKHRpbGVJbmRleCAlIHRoaXMud2lkdGgpICogZ2FtZS5USUxFX1dJRFRILFxyXG4gICAgICAgICAgICAoTWF0aC5mbG9vcih0aWxlSW5kZXggLyB0aGlzLndpZHRoKSAtIDEpICogZ2FtZS5USUxFX0hFSUdIVCxcclxuICAgICAgICAgICAgZ2FtZS5USUxFX1dJRFRILFxyXG4gICAgICAgICAgICBnYW1lLlRJTEVfSEVJR0hUICogM1xyXG4gICAgICAgICk7XHJcbiAgICAgICAgdGhpcy50aWxlTGF5ZXIubm9FcmFzZSgpO1xyXG5cclxuICAgICAgICAvLyByZWRyYXcgdGhlIG5laWdoYm9yaW5nIHRpbGVzXHJcbiAgICAgICAgdGhpcy5kcmF3VGlsZSh0aWxlSW5kZXgpO1xyXG4gICAgICAgIHRoaXMuZHJhd1RpbGUodGlsZUluZGV4ICsgdGhpcy53aWR0aCk7XHJcbiAgICAgICAgdGhpcy5kcmF3VGlsZSh0aWxlSW5kZXggLSAxKTtcclxuICAgICAgICB0aGlzLmRyYXdUaWxlKHRpbGVJbmRleCAtIHRoaXMud2lkdGgpO1xyXG4gICAgICAgIHRoaXMuZHJhd1RpbGUodGlsZUluZGV4ICsgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyUGxheWVycyh0YXJnZXQ6IEdhbWUsIHVwc2NhbGVTaXplOiBudW1iZXIpIHtcclxuICAgICAgICAvLyBDYWxjdWxhdGUgdGhlIGludGVycG9sYXRlZCBwb3NpdGlvbiBvZiBhbGwgdXBkYXRlZCBlbnRpdGllc1xyXG4gICAgICAgIGNvbnN0IHBvc2l0aW9uU3RhdGVzOiB7IFtpZDogc3RyaW5nXTogeyB4OiBudW1iZXI7IHk6IG51bWJlciB9IH0gPSB7fTtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCBjYWxjdWxhdGVkU25hcHNob3QgPVxyXG4gICAgICAgICAgICAgICAgdGhpcy5zbmFwc2hvdEludGVycG9sYXRpb24uY2FsY0ludGVycG9sYXRpb24oJ3ggeScpO1xyXG4gICAgICAgICAgICBpZiAoIWNhbGN1bGF0ZWRTbmFwc2hvdCkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgY29uc3Qgc3RhdGUgPSBjYWxjdWxhdGVkU25hcHNob3Quc3RhdGU7XHJcbiAgICAgICAgICAgIGlmICghc3RhdGUpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIC8vIFRoZSBuZXcgcG9zaXRpb25zIG9mIGVudGl0aWVzIGFzIG9iamVjdFxyXG4gICAgICAgICAgICBzdGF0ZS5mb3JFYWNoKCh7IGlkLCB4LCB5IH06IEVudGl0eSAmIHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcG9zaXRpb25TdGF0ZXNbaWRdID0geyB4LCB5IH07XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHt9XHJcblxyXG4gICAgICAgIC8vIFJlbmRlciBlYWNoIGVudGl0eSBpbiByYW5kb20gb3JkZXIgOnNrdWxsOlxyXG4gICAgICAgIE9iamVjdC5lbnRyaWVzKHRoaXMuZW50aXRpZXMpLmZvckVhY2goXHJcbiAgICAgICAgICAgIChlbnRpdHk6IFtzdHJpbmcsIFNlcnZlckVudGl0eV0pID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHVwZGF0ZWRQb3NpdGlvbiA9IHBvc2l0aW9uU3RhdGVzW2VudGl0eVswXV07XHJcbiAgICAgICAgICAgICAgICBpZiAodXBkYXRlZFBvc2l0aW9uICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBlbnRpdHlbMV0ueCA9IHVwZGF0ZWRQb3NpdGlvbi54O1xyXG4gICAgICAgICAgICAgICAgICAgIGVudGl0eVsxXS55ID0gdXBkYXRlZFBvc2l0aW9uLnk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZW50aXR5WzFdLnJlbmRlcih0YXJnZXQsIHVwc2NhbGVTaXplKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIC8vIFJlbmRlciB0aGUgcGxheWVyIG9uIHRvcCA6dGh1bWJzdXA6XHJcbiAgICAgICAgaWYgKHRoaXMucGxheWVyICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXIuZmluZEludGVycG9sYXRlZENvb3JkaW5hdGVzKCk7XHJcbiAgICAgICAgICAgIHRoaXMucGxheWVyLnJlbmRlcih0YXJnZXQsIHVwc2NhbGVTaXplKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZFdvcmxkKCkge1xyXG4gICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgdGhpcy5oZWlnaHQ7IHgrKykge1xyXG4gICAgICAgICAgICAvLyBpIHdpbGwgYmUgdGhlIHkgcG9zaXRpb24gb2YgdGlsZXMgYmVpbmcgZHJhd25cclxuICAgICAgICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCB0aGlzLndpZHRoOyB5KyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRpbGVWYWwgPSB0aGlzLndvcmxkVGlsZXNbeCAqIHRoaXMud2lkdGggKyB5XTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHRpbGVWYWwgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2codGlsZVZhbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRpbGVWYWwgIT09IFRpbGVUeXBlLkFpciAmJiB0aWxlVmFsICE9PSBUaWxlVHlwZS5UaWxlRW50aXR5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gRHJhdyB0aGUgY29ycmVjdCBpbWFnZSBmb3IgdGhlIHRpbGVzIG9udG8gdGhlIHRpbGVzIGxheWVyXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGlsZTogVGlsZSA9IFdvcmxkVGlsZXNbdGlsZVZhbF07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGlsZS5jb25uZWN0ZWQgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGlsZS50ZXh0dXJlIGluc3RhbmNlb2YgVGlsZVJlc291cmNlXHJcbiAgICAgICAgICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRlc3QgaWYgdGhlIG5laWdoYm9yaW5nIHRpbGVzIGFyZSBzb2xpZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0b3BUaWxlQm9vbCA9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4ID09PSBUaWxlVHlwZS5BaXIgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMud29ybGRUaWxlc1soeCAtIDEpICogdGhpcy53aWR0aCArIHldICE9PVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRpbGVUeXBlLkFpcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbGVmdFRpbGVCb29sID1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHkgPT09IFRpbGVUeXBlLkFpciB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy53b3JsZFRpbGVzW3ggKiB0aGlzLndpZHRoICsgeSAtIDFdICE9PVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRpbGVUeXBlLkFpcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYm90dG9tVGlsZUJvb2wgPVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeCA9PT0gdGhpcy5oZWlnaHQgLSAxIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLndvcmxkVGlsZXNbKHggKyAxKSAqIHRoaXMud2lkdGggKyB5XSAhPT1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUaWxlVHlwZS5BaXI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJpZ2h0VGlsZUJvb2wgPVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeSA9PT0gdGhpcy53aWR0aCAtIDEgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMud29ybGRUaWxlc1t4ICogdGhpcy53aWR0aCArIHkgKyAxXSAhPT1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUaWxlVHlwZS5BaXI7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb252ZXJ0IDQgZGlnaXQgYmluYXJ5IG51bWJlciB0byBiYXNlIDEwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRpbGVTZXRJbmRleCA9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA4ICogK3RvcFRpbGVCb29sICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDQgKiArcmlnaHRUaWxlQm9vbCArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAyICogK2JvdHRvbVRpbGVCb29sICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICtsZWZ0VGlsZUJvb2w7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBSZW5kZXIgY29ubmVjdGVkIHRpbGVzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbGUudGV4dHVyZS5yZW5kZXJUaWxlKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlsZVNldEluZGV4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50aWxlTGF5ZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB5ICogZ2FtZS5USUxFX1dJRFRILFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeCAqIGdhbWUuVElMRV9IRUlHSFQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnYW1lLlRJTEVfV0lEVEgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnYW1lLlRJTEVfSEVJR0hUXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgIXRpbGUuY29ubmVjdGVkICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbGUudGV4dHVyZSBpbnN0YW5jZW9mIEltYWdlUmVzb3VyY2VcclxuICAgICAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gUmVuZGVyIG5vbi1jb25uZWN0ZWQgdGlsZXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGlsZS50ZXh0dXJlLnJlbmRlcihcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGlsZUxheWVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeSAqIGdhbWUuVElMRV9XSURUSCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHggKiBnYW1lLlRJTEVfSEVJR0hULFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2FtZS5USUxFX1dJRFRILFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2FtZS5USUxFX0hFSUdIVFxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBkcmF3VGlsZSh0aWxlSW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IHggPSB0aWxlSW5kZXggJSB0aGlzLndpZHRoO1xyXG4gICAgICAgIGNvbnN0IHkgPSBNYXRoLmZsb29yKHRpbGVJbmRleCAvIHRoaXMud2lkdGgpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy53b3JsZFRpbGVzW3RpbGVJbmRleF0gIT09IFRpbGVUeXBlLkFpcikge1xyXG4gICAgICAgICAgICAvLyBEcmF3IHRoZSBjb3JyZWN0IGltYWdlIGZvciB0aGUgdGlsZXMgb250byB0aGUgdGlsZXMgbGF5ZXJcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHRpbGVWYWwgPSB0aGlzLndvcmxkVGlsZXNbdGlsZUluZGV4XVxyXG5cclxuICAgICAgICAgICAgaWYodHlwZW9mIHRpbGVWYWwgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlRyaWVkIHRvIGRyYXc6IFwiICsgdGlsZVZhbClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgdGlsZTogVGlsZSA9IFdvcmxkVGlsZXNbdGlsZVZhbF07XHJcblxyXG4gICAgICAgICAgICAvLyBpZiB0aGUgdGlsZXMgaXMgb2ZmLXNjcmVlblxyXG4gICAgICAgICAgICBpZiAodGlsZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aWxlLmNvbm5lY3RlZCAmJiB0aWxlLnRleHR1cmUgaW5zdGFuY2VvZiBUaWxlUmVzb3VyY2UpIHtcclxuICAgICAgICAgICAgICAgIC8vIFRlc3QgdGhlIG5laWdoYm9yaW5nIDQgdGlsZXNcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRvcFRpbGVCb29sID1cclxuICAgICAgICAgICAgICAgICAgICB5IDw9IDAgfHxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLndvcmxkVGlsZXNbdGlsZUluZGV4IC0gdGhpcy53aWR0aF0gIT09IFRpbGVUeXBlLkFpcjtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGxlZnRUaWxlQm9vbCA9XHJcbiAgICAgICAgICAgICAgICAgICAgeCA8PSAwIHx8IHRoaXMud29ybGRUaWxlc1t0aWxlSW5kZXggLSAxXSAhPT0gVGlsZVR5cGUuQWlyO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYm90dG9tVGlsZUJvb2wgPVxyXG4gICAgICAgICAgICAgICAgICAgIHkgPj0gdGhpcy5oZWlnaHQgLSAxIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53b3JsZFRpbGVzW3RpbGVJbmRleCArIHRoaXMud2lkdGhdICE9PSBUaWxlVHlwZS5BaXI7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByaWdodFRpbGVCb29sID1cclxuICAgICAgICAgICAgICAgICAgICB4ID49IHRoaXMud2lkdGggLSAxIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53b3JsZFRpbGVzW3RpbGVJbmRleCArIDFdICE9PSBUaWxlVHlwZS5BaXI7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gY29udmVydCA0IGRpZ2l0IGJpbmFyeSBudW1iZXIgdG8gYmFzZSAxMFxyXG4gICAgICAgICAgICAgICAgY29uc3QgdGlsZVNldEluZGV4ID1cclxuICAgICAgICAgICAgICAgICAgICA4ICogK3RvcFRpbGVCb29sICtcclxuICAgICAgICAgICAgICAgICAgICA0ICogK3JpZ2h0VGlsZUJvb2wgK1xyXG4gICAgICAgICAgICAgICAgICAgIDIgKiArYm90dG9tVGlsZUJvb2wgK1xyXG4gICAgICAgICAgICAgICAgICAgICtsZWZ0VGlsZUJvb2w7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gUmVuZGVyIGNvbm5lY3RlZCB0aWxlc1xyXG4gICAgICAgICAgICAgICAgdGlsZS50ZXh0dXJlLnJlbmRlclRpbGUoXHJcbiAgICAgICAgICAgICAgICAgICAgdGlsZVNldEluZGV4LFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGlsZUxheWVyLFxyXG4gICAgICAgICAgICAgICAgICAgIHggKiBnYW1lLlRJTEVfV0lEVEgsXHJcbiAgICAgICAgICAgICAgICAgICAgeSAqIGdhbWUuVElMRV9IRUlHSFQsXHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS5USUxFX1dJRFRILFxyXG4gICAgICAgICAgICAgICAgICAgIGdhbWUuVElMRV9IRUlHSFRcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoXHJcbiAgICAgICAgICAgICAgICAhdGlsZS5jb25uZWN0ZWQgJiZcclxuICAgICAgICAgICAgICAgIHRpbGUudGV4dHVyZSBpbnN0YW5jZW9mIEltYWdlUmVzb3VyY2VcclxuICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBSZW5kZXIgbm9uLWNvbm5lY3RlZCB0aWxlc1xyXG4gICAgICAgICAgICAgICAgdGlsZS50ZXh0dXJlLnJlbmRlcihcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRpbGVMYXllcixcclxuICAgICAgICAgICAgICAgICAgICB4ICogZ2FtZS5USUxFX1dJRFRILFxyXG4gICAgICAgICAgICAgICAgICAgIHkgKiBnYW1lLlRJTEVfSEVJR0hULFxyXG4gICAgICAgICAgICAgICAgICAgIGdhbWUuVElMRV9XSURUSCxcclxuICAgICAgICAgICAgICAgICAgICBnYW1lLlRJTEVfSEVJR0hUXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmV4cG9ydCA9IFdvcmxkO1xyXG4iLCJpbXBvcnQgSW1hZ2VSZXNvdXJjZSBmcm9tICcuLi9hc3NldHMvcmVzb3VyY2VzL0ltYWdlUmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBXb3JsZEFzc2V0cyB9IGZyb20gJy4uL2Fzc2V0cy9Bc3NldHMnO1xyXG5pbXBvcnQgVGlsZVJlc291cmNlIGZyb20gJy4uL2Fzc2V0cy9yZXNvdXJjZXMvVGlsZVJlc291cmNlJztcclxuaW1wb3J0IHsgVGlsZVR5cGUgfSBmcm9tICcuLi8uLi8uLi9hcGkvVGlsZSc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFRpbGUge1xyXG4gICAgbmFtZTogc3RyaW5nO1xyXG4gICAgdGV4dHVyZTogSW1hZ2VSZXNvdXJjZSB8IFRpbGVSZXNvdXJjZTtcclxuICAgIGNvbm5lY3RlZD86IGJvb2xlYW47XHJcbiAgICBhbnlDb25uZWN0aW9uPzogYm9vbGVhbjtcclxuICAgIGNvbG9yOiBzdHJpbmc7XHJcbiAgICBmcmljdGlvbjogbnVtYmVyO1xyXG4gICAgcmVmbGVjdGl2aXR5OiBudW1iZXI7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBXb3JsZFRpbGVzOiBSZWNvcmQ8VGlsZVR5cGUsIFRpbGUgfCB1bmRlZmluZWQ+ID0ge1xyXG4gICAgW1RpbGVUeXBlLkFpcl06IHVuZGVmaW5lZCxcclxuICAgIFtUaWxlVHlwZS5UaWxlRW50aXR5XToge1xyXG4gICAgICAgIG5hbWU6ICdUaWxlRW50aXR5JyxcclxuICAgICAgICB0ZXh0dXJlOiB1bmRlZmluZWQsXHJcbiAgICAgICAgY29sb3I6IFwiI2JiYmJiYlwiLFxyXG4gICAgICAgIGZyaWN0aW9uOiAxLFxyXG4gICAgICAgIHJlZmxlY3Rpdml0eTogMFxyXG4gICAgfSxcclxuICAgIFtUaWxlVHlwZS5Tbm93XToge1xyXG4gICAgICAgIG5hbWU6ICdzbm93JyxcclxuICAgICAgICB0ZXh0dXJlOiBXb3JsZEFzc2V0cy5taWRkbGVncm91bmQudGlsZXNldF9zbm93LFxyXG4gICAgICAgIGNvbm5lY3RlZDogdHJ1ZSxcclxuICAgICAgICBhbnlDb25uZWN0aW9uOiB0cnVlLFxyXG4gICAgICAgIGNvbG9yOiBcIiNjYWZhZmNcIixcclxuICAgICAgICBmcmljdGlvbjogMixcclxuICAgICAgICByZWZsZWN0aXZpdHk6IDUwXHJcbiAgICB9LFxyXG4gICAgW1RpbGVUeXBlLkljZV06IHtcclxuICAgICAgICBuYW1lOiAnaWNlJyxcclxuICAgICAgICB0ZXh0dXJlOiBXb3JsZEFzc2V0cy5taWRkbGVncm91bmQudGlsZXNldF9pY2UsXHJcbiAgICAgICAgY29ubmVjdGVkOiB0cnVlLFxyXG4gICAgICAgIGFueUNvbm5lY3Rpb246IHRydWUsXHJcbiAgICAgICAgY29sb3I6IFwiIzc2YWRjNFwiLFxyXG4gICAgICAgIGZyaWN0aW9uOiAxLjUsXHJcbiAgICAgICAgcmVmbGVjdGl2aXR5OiAyNTVcclxuICAgIH0sXHJcbiAgICBbVGlsZVR5cGUuRGlydF06IHtcclxuICAgICAgICBuYW1lOiAnZGlydCcsXHJcbiAgICAgICAgdGV4dHVyZTogV29ybGRBc3NldHMubWlkZGxlZ3JvdW5kLnRpbGVzZXRfZGlydCxcclxuICAgICAgICBjb25uZWN0ZWQ6IHRydWUsXHJcbiAgICAgICAgYW55Q29ubmVjdGlvbjogdHJ1ZSxcclxuICAgICAgICBjb2xvcjogXCIjNGEyZTFlXCIsXHJcbiAgICAgICAgZnJpY3Rpb246IDQsXHJcbiAgICAgICAgcmVmbGVjdGl2aXR5OiAwXHJcbiAgICB9LFxyXG4gICAgW1RpbGVUeXBlLlN0b25lMF06IHtcclxuICAgICAgICBuYW1lOiAncmF3IHN0b25lJyxcclxuICAgICAgICB0ZXh0dXJlOiBXb3JsZEFzc2V0cy5taWRkbGVncm91bmQudGlsZXNldF9zdG9uZTAsXHJcbiAgICAgICAgY29ubmVjdGVkOiB0cnVlLFxyXG4gICAgICAgIGFueUNvbm5lY3Rpb246IHRydWUsXHJcbiAgICAgICAgY29sb3I6IFwiIzQxNDI0NVwiLFxyXG4gICAgICAgIGZyaWN0aW9uOiAzLFxyXG4gICAgICAgIHJlZmxlY3Rpdml0eTogMTBcclxuICAgIH0sXHJcbiAgICBbVGlsZVR5cGUuU3RvbmUxXToge1xyXG4gICAgICAgIG5hbWU6ICdzdG9uZSB0aWVyIDEnLFxyXG4gICAgICAgIHRleHR1cmU6IFdvcmxkQXNzZXRzLm1pZGRsZWdyb3VuZC50aWxlc2V0X3N0b25lMSxcclxuICAgICAgICBjb25uZWN0ZWQ6IHRydWUsXHJcbiAgICAgICAgYW55Q29ubmVjdGlvbjogdHJ1ZSxcclxuICAgICAgICBjb2xvcjogXCIjMzEzMjNiXCIsXHJcbiAgICAgICAgZnJpY3Rpb246IDMsXHJcbiAgICAgICAgcmVmbGVjdGl2aXR5OiAxNVxyXG4gICAgfSxcclxuICAgIFtUaWxlVHlwZS5TdG9uZTJdOiB7XHJcbiAgICAgICAgbmFtZTogJ3N0b25lIHRpZXIgMicsXHJcbiAgICAgICAgdGV4dHVyZTogV29ybGRBc3NldHMubWlkZGxlZ3JvdW5kLnRpbGVzZXRfc3RvbmUyLFxyXG4gICAgICAgIGNvbm5lY3RlZDogdHJ1ZSxcclxuICAgICAgICBhbnlDb25uZWN0aW9uOiB0cnVlLFxyXG4gICAgICAgIGNvbG9yOiBcIiMzMTMyM2JcIiwvL1RPRE8gY2hhbmdlIHRoZXNlIGNvbG9ycyB0byBiZSBtb3JlIGFjY3VyYXRlXHJcbiAgICAgICAgZnJpY3Rpb246IDMsXHJcbiAgICAgICAgcmVmbGVjdGl2aXR5OiAxN1xyXG4gICAgfSxcclxuICAgIFtUaWxlVHlwZS5TdG9uZTNdOiB7XHJcbiAgICAgICAgbmFtZTogJ3N0b25lIHRpZXIgMycsXHJcbiAgICAgICAgdGV4dHVyZTogV29ybGRBc3NldHMubWlkZGxlZ3JvdW5kLnRpbGVzZXRfc3RvbmUzLFxyXG4gICAgICAgIGNvbm5lY3RlZDogdHJ1ZSxcclxuICAgICAgICBhbnlDb25uZWN0aW9uOiB0cnVlLFxyXG4gICAgICAgIGNvbG9yOiBcIiMzMTMyM2JcIixcclxuICAgICAgICBmcmljdGlvbjogMyxcclxuICAgICAgICByZWZsZWN0aXZpdHk6IDE5XHJcbiAgICB9LFxyXG4gICAgW1RpbGVUeXBlLlN0b25lNF06IHtcclxuICAgICAgICBuYW1lOiAnc3RvbmUgdGllciA0JyxcclxuICAgICAgICB0ZXh0dXJlOiBXb3JsZEFzc2V0cy5taWRkbGVncm91bmQudGlsZXNldF9zdG9uZTQsXHJcbiAgICAgICAgY29ubmVjdGVkOiB0cnVlLFxyXG4gICAgICAgIGFueUNvbm5lY3Rpb246IHRydWUsXHJcbiAgICAgICAgY29sb3I6IFwiIzMxMzIzYlwiLFxyXG4gICAgICAgIGZyaWN0aW9uOiAzLFxyXG4gICAgICAgIHJlZmxlY3Rpdml0eTogMjFcclxuICAgIH0sXHJcbiAgICBbVGlsZVR5cGUuU3RvbmU1XToge1xyXG4gICAgICAgIG5hbWU6ICdzdG9uZSB0aWVyIDUnLFxyXG4gICAgICAgIHRleHR1cmU6IFdvcmxkQXNzZXRzLm1pZGRsZWdyb3VuZC50aWxlc2V0X3N0b25lNSxcclxuICAgICAgICBjb25uZWN0ZWQ6IHRydWUsXHJcbiAgICAgICAgYW55Q29ubmVjdGlvbjogdHJ1ZSxcclxuICAgICAgICBjb2xvcjogXCIjMzEzMjNiXCIsXHJcbiAgICAgICAgZnJpY3Rpb246IDMsXHJcbiAgICAgICAgcmVmbGVjdGl2aXR5OiAyM1xyXG4gICAgfSxcclxuICAgIFtUaWxlVHlwZS5TdG9uZTZdOiB7XHJcbiAgICAgICAgbmFtZTogJ3N0b25lIHRpZXIgNicsXHJcbiAgICAgICAgdGV4dHVyZTogV29ybGRBc3NldHMubWlkZGxlZ3JvdW5kLnRpbGVzZXRfc3RvbmU2LFxyXG4gICAgICAgIGNvbm5lY3RlZDogdHJ1ZSxcclxuICAgICAgICBhbnlDb25uZWN0aW9uOiB0cnVlLFxyXG4gICAgICAgIGNvbG9yOiBcIiMzMTMyM2JcIixcclxuICAgICAgICBmcmljdGlvbjogMyxcclxuICAgICAgICByZWZsZWN0aXZpdHk6IDI1XHJcbiAgICB9LFxyXG4gICAgW1RpbGVUeXBlLlN0b25lN106IHtcclxuICAgICAgICBuYW1lOiAnc3RvbmUgdGllciA3JyxcclxuICAgICAgICB0ZXh0dXJlOiBXb3JsZEFzc2V0cy5taWRkbGVncm91bmQudGlsZXNldF9zdG9uZTcsXHJcbiAgICAgICAgY29ubmVjdGVkOiB0cnVlLFxyXG4gICAgICAgIGFueUNvbm5lY3Rpb246IHRydWUsXHJcbiAgICAgICAgY29sb3I6IFwiIzMxMzIzYlwiLFxyXG4gICAgICAgIGZyaWN0aW9uOiAzLFxyXG4gICAgICAgIHJlZmxlY3Rpdml0eTogMjdcclxuICAgIH0sXHJcbiAgICBbVGlsZVR5cGUuU3RvbmU4XToge1xyXG4gICAgICAgIG5hbWU6ICdzdG9uZSB0aWVyIDgnLFxyXG4gICAgICAgIHRleHR1cmU6IFdvcmxkQXNzZXRzLm1pZGRsZWdyb3VuZC50aWxlc2V0X3N0b25lOCxcclxuICAgICAgICBjb25uZWN0ZWQ6IHRydWUsXHJcbiAgICAgICAgYW55Q29ubmVjdGlvbjogdHJ1ZSxcclxuICAgICAgICBjb2xvcjogXCIjMzEzMjNiXCIsXHJcbiAgICAgICAgZnJpY3Rpb246IDMsXHJcbiAgICAgICAgcmVmbGVjdGl2aXR5OiAyOVxyXG4gICAgfSxcclxuICAgIFtUaWxlVHlwZS5TdG9uZTldOiB7XHJcbiAgICAgICAgbmFtZTogJ3N0b25lIHRpZXIgOScsXHJcbiAgICAgICAgdGV4dHVyZTogV29ybGRBc3NldHMubWlkZGxlZ3JvdW5kLnRpbGVzZXRfc3RvbmU5LFxyXG4gICAgICAgIGNvbm5lY3RlZDogdHJ1ZSxcclxuICAgICAgICBhbnlDb25uZWN0aW9uOiB0cnVlLFxyXG4gICAgICAgIGNvbG9yOiBcIiMzMTMyM2JcIixcclxuICAgICAgICBmcmljdGlvbjogMyxcclxuICAgICAgICByZWZsZWN0aXZpdHk6IDMxXHJcbiAgICB9LFxyXG59OyIsImltcG9ydCB7IEVudGl0aWVzIH0gZnJvbSAnLi4vLi4vLi4vLi4vYXBpL0VudGl0eSc7XHJcbmltcG9ydCB7IFBsYXllckVudGl0eSB9IGZyb20gJy4vUGxheWVyRW50aXR5JztcclxuaW1wb3J0IFBsYXllckxvY2FsIGZyb20gJy4vUGxheWVyTG9jYWwnO1xyXG5cclxuZXhwb3J0IGNvbnN0IEVudGl0eUNsYXNzZXM6IFJlY29yZDxFbnRpdGllcywgYW55PiA9IHtcclxuICAgIFtFbnRpdGllcy5Mb2NhbFBsYXllcl06IFBsYXllckxvY2FsLFxyXG4gICAgW0VudGl0aWVzLlBsYXllcl06IFBsYXllckVudGl0eSxcclxuICAgIFtFbnRpdGllcy5JdGVtXTogbnVsbFxyXG59IiwiaW1wb3J0IHsgU2VydmVyRW50aXR5IH0gZnJvbSAnLi9TZXJ2ZXJFbnRpdHknO1xyXG5pbXBvcnQgcDUgZnJvbSAncDUnO1xyXG5pbXBvcnQgZ2FtZSBmcm9tICcuLi8uLi9NYWluJztcclxuaW1wb3J0IHsgRW50aXRpZXMsIEVudGl0eVBheWxvYWQgfSBmcm9tICcuLi8uLi8uLi8uLi9hcGkvRW50aXR5JztcclxuXHJcbmV4cG9ydCBjbGFzcyBQbGF5ZXJFbnRpdHkgZXh0ZW5kcyBTZXJ2ZXJFbnRpdHkge1xyXG5cclxuICAgIHdpZHRoOiBudW1iZXIgPSAxMiAvIGdhbWUuVElMRV9XSURUSDtcclxuICAgIGhlaWdodDogbnVtYmVyID0gMjAgLyBnYW1lLlRJTEVfSEVJR0hUO1xyXG4gICAgbmFtZTogc3RyaW5nXHJcblxyXG4gICAgY29uc3RydWN0b3IoZGF0YTogRW50aXR5UGF5bG9hZCkge1xyXG4gICAgICAgIHN1cGVyKGRhdGEuaWQpO1xyXG4gICAgICAgIGlmKGRhdGEudHlwZSA9PT0gRW50aXRpZXMuUGxheWVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMubmFtZSA9IGRhdGEuZGF0YS5uYW1lO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVEYXRhKGRhdGE6IEVudGl0eVBheWxvYWQpOiB2b2lkIHtcclxuICAgICAgICBpZihkYXRhLnR5cGUgPT09IEVudGl0aWVzLlBsYXllcikge1xyXG4gICAgICAgICAgICB0aGlzLm5hbWUgPSBkYXRhLmRhdGEubmFtZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKHRhcmdldDogcDUsIHVwc2NhbGVTaXplOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0YXJnZXQuZmlsbCgwLCAyNTUsIDApO1xyXG5cclxuICAgICAgICB0YXJnZXQucmVjdChcclxuICAgICAgICAgICAgKHRoaXMueCAqIGdhbWUuVElMRV9XSURUSCAtXHJcbiAgICAgICAgICAgICAgICBnYW1lLmludGVycG9sYXRlZENhbVggKiBnYW1lLlRJTEVfV0lEVEgpICpcclxuICAgICAgICAgICAgdXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgICh0aGlzLnkgKiBnYW1lLlRJTEVfSEVJR0hUIC1cclxuICAgICAgICAgICAgICAgIGdhbWUuaW50ZXJwb2xhdGVkQ2FtWSAqIGdhbWUuVElMRV9IRUlHSFQpICpcclxuICAgICAgICAgICAgdXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIHRoaXMud2lkdGggKiB1cHNjYWxlU2l6ZSAqIGdhbWUuVElMRV9XSURUSCxcclxuICAgICAgICAgICAgdGhpcy5oZWlnaHQgKiB1cHNjYWxlU2l6ZSAqIGdhbWUuVElMRV9IRUlHSFRcclxuICAgICAgICApO1xyXG4gICAgICAgIC8vIFJlbmRlciB0aGUgaXRlbSBxdWFudGl0eSBsYWJlbFxyXG4gICAgICAgIHRhcmdldC5maWxsKDApO1xyXG5cclxuICAgICAgICB0YXJnZXQubm9TdHJva2UoKTtcclxuXHJcbiAgICAgICAgdGFyZ2V0LnRleHRTaXplKDUgKiB1cHNjYWxlU2l6ZSk7XHJcbiAgICAgICAgdGFyZ2V0LnRleHRBbGlnbih0YXJnZXQuQ0VOVEVSLCB0YXJnZXQuVE9QKTtcclxuXHJcbiAgICAgICAgdGFyZ2V0LnRleHQoXHJcbiAgICAgICAgICAgIHRoaXMubmFtZSxcclxuICAgICAgICAgICAgKCgodGhpcy54ICogZ2FtZS5USUxFX1dJRFRIKSAtXHJcbiAgICAgICAgICAgICAgICBnYW1lLmludGVycG9sYXRlZENhbVggKiBnYW1lLlRJTEVfV0lEVEgpICsgKHRoaXMud2lkdGggKiBnYW1lLlRJTEVfV0lEVEgpIC8gMikgKlxyXG4gICAgICAgICAgICB1cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgKCgodGhpcy55ICogZ2FtZS5USUxFX0hFSUdIVCkgLVxyXG4gICAgICAgICAgICAgICAgZ2FtZS5pbnRlcnBvbGF0ZWRDYW1ZICogZ2FtZS5USUxFX0hFSUdIVCkgLSAodGhpcy5oZWlnaHQgKiBnYW1lLlRJTEVfV0lEVEgpIC8gMi41KSAqXHJcbiAgICAgICAgICAgIHVwc2NhbGVTaXplXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufSIsImltcG9ydCBnYW1lIGZyb20gJy4uLy4uL01haW4nO1xyXG5pbXBvcnQgeyBTZXJ2ZXJFbnRpdHkgfSBmcm9tICcuL1NlcnZlckVudGl0eSc7XHJcbmltcG9ydCB7IEVudGl0aWVzLCBFbnRpdHlQYXlsb2FkIH0gZnJvbSAnLi4vLi4vLi4vLi4vYXBpL0VudGl0eSc7XHJcbmltcG9ydCB7IENvbG9yUGFydGljbGUgfSBmcm9tICcuLi9wYXJ0aWNsZXMvQ29sb3JQYXJ0aWNsZSdcclxuaW1wb3J0IHsgUGxheWVyQW5pbWF0aW9ucywgVWlBc3NldHMsIEFuaW1hdGlvbkZyYW1lIH0gZnJvbSAnLi4vLi4vYXNzZXRzL0Fzc2V0cyc7XHJcbmltcG9ydCB7IFRpbGVUeXBlIH0gZnJvbSAnLi4vLi4vLi4vLi4vYXBpL1RpbGUnO1xyXG5pbXBvcnQgeyBXb3JsZFRpbGVzIH0gZnJvbSAnLi4vV29ybGRUaWxlcyc7XHJcbmltcG9ydCBHYW1lIGZyb20gJy4uLy4uL0dhbWUnO1xyXG5cclxuY2xhc3MgUGxheWVyTG9jYWwgZXh0ZW5kcyBTZXJ2ZXJFbnRpdHkge1xyXG5cclxuICAgIHdpZHRoOiBudW1iZXIgPSAxMiAvIGdhbWUuVElMRV9XSURUSDtcclxuICAgIGhlaWdodDogbnVtYmVyID0gMjAgLyBnYW1lLlRJTEVfSEVJR0hUO1xyXG4gICAgbmFtZTogc3RyaW5nXHJcblxyXG4gICAgeFZlbDogbnVtYmVyID0gMFxyXG4gICAgeVZlbDogbnVtYmVyID0gMFxyXG4gICAgaW50ZXJwb2xhdGVkWDogbnVtYmVyO1xyXG4gICAgaW50ZXJwb2xhdGVkWTogbnVtYmVyO1xyXG4gICAgc2xpZGVYOiBudW1iZXI7XHJcbiAgICBzbGlkZVk6IG51bWJlcjtcclxuXHJcbiAgICBwWDogbnVtYmVyO1xyXG4gICAgcFk6IG51bWJlcjtcclxuICAgIHBYVmVsOiBudW1iZXIgPSAwXHJcbiAgICBwWVZlbDogbnVtYmVyID0gMFxyXG5cclxuICAgIGdyb3VuZGVkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwR3JvdW5kZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICBjb2xsaXNpb25EYXRhOiBhbnk7XHJcbiAgICBjbG9zZXN0Q29sbGlzaW9uOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl1cclxuXHJcbiAgICBtYXNzOiBudW1iZXIgPSB0aGlzLndpZHRoICogdGhpcy5oZWlnaHRcclxuXHJcbiAgICAvL2lucHV0IGJvb2xlYW5zXHJcbiAgICByaWdodEJ1dHRvbjogYm9vbGVhbjtcclxuICAgIGxlZnRCdXR0b246IGJvb2xlYW47XHJcbiAgICBqdW1wQnV0dG9uOiBib29sZWFuO1xyXG5cclxuICAgIGN1cnJlbnRBbmltYXRpb246IEFuaW1hdGlvbkZyYW1lPHR5cGVvZiBQbGF5ZXJBbmltYXRpb25zPiA9IFwiaWRsZVwiO1xyXG4gICAgYW5pbUZyYW1lOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIHRvcENvbGxpc2lvbjogKHR5cGVvZiBXb3JsZFRpbGVzW1RpbGVUeXBlLkFpcl0pID0gV29ybGRUaWxlc1tUaWxlVHlwZS5BaXJdOy8vaGFja3lcclxuICAgIGJvdHRvbUNvbGxpc2lvbjogKHR5cGVvZiBXb3JsZFRpbGVzW1RpbGVUeXBlLkFpcl0pID0gV29ybGRUaWxlc1tUaWxlVHlwZS5BaXJdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIGRhdGE6IEVudGl0eVBheWxvYWQ8RW50aXRpZXMuTG9jYWxQbGF5ZXI+XHJcbiAgICApIHtcclxuICAgICAgICBzdXBlcihkYXRhLmlkKVxyXG5cclxuICAgICAgICB0aGlzLm5hbWUgPSBkYXRhLmRhdGEubmFtZVxyXG5cclxuICAgICAgICB0aGlzLnggPSBkYXRhLmRhdGEueFxyXG4gICAgICAgIHRoaXMueSA9IGRhdGEuZGF0YS55XHJcblxyXG4gICAgICAgIHRoaXMuY2xvc2VzdENvbGxpc2lvbiA9IFsxLCAwLCBJbmZpbml0eV07XHJcblxyXG4gICAgICAgIHRoaXMuaW50ZXJwb2xhdGVkWCA9IHRoaXMueDtcclxuICAgICAgICB0aGlzLmludGVycG9sYXRlZFkgPSB0aGlzLnk7XHJcblxyXG4gICAgICAgIHRoaXMucFggPSB0aGlzLnhcclxuICAgICAgICB0aGlzLnBZID0gdGhpcy55O1xyXG4gICAgICAgIHRoaXMubGVmdEJ1dHRvbiA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucmlnaHRCdXR0b24gPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmp1bXBCdXR0b24gPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIodGFyZ2V0OiBHYW1lLCB1cHNjYWxlU2l6ZTogbnVtYmVyKTogdm9pZCB7XHJcblxyXG4gICAgICAgIFBsYXllckFuaW1hdGlvbnNbdGhpcy5jdXJyZW50QW5pbWF0aW9uXVt0aGlzLmFuaW1GcmFtZV0ucmVuZGVyXHJcbiAgICAgICAgICAgIChcclxuICAgICAgICAgICAgICAgIHRhcmdldCxcclxuICAgICAgICAgICAgICAgICh0aGlzLmludGVycG9sYXRlZFggKiBnYW1lLlRJTEVfV0lEVEggLVxyXG4gICAgICAgICAgICAgICAgICAgIGdhbWUuaW50ZXJwb2xhdGVkQ2FtWCAqIGdhbWUuVElMRV9XSURUSCkgKlxyXG4gICAgICAgICAgICAgICAgdXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgICAgICAodGhpcy5pbnRlcnBvbGF0ZWRZICogZ2FtZS5USUxFX0hFSUdIVCAtXHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS5pbnRlcnBvbGF0ZWRDYW1ZICogZ2FtZS5USUxFX0hFSUdIVCkgKlxyXG4gICAgICAgICAgICAgICAgdXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgICAgICB0aGlzLndpZHRoICogdXBzY2FsZVNpemUgKiBnYW1lLlRJTEVfV0lEVEgsXHJcbiAgICAgICAgICAgICAgICB0aGlzLmhlaWdodCAqIHVwc2NhbGVTaXplICogZ2FtZS5USUxFX0hFSUdIVFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBQbGF5ZXJBbmltYXRpb25zW3RoaXMuY3VycmVudEFuaW1hdGlvbl1bdGhpcy5hbmltRnJhbWVdLnJlbmRlcldvcmxkc3BhY2VSZWZsZWN0aW9uXHJcbiAgICAgICAgICAgIChcclxuICAgICAgICAgICAgICAgIHRhcmdldCxcclxuICAgICAgICAgICAgICAgIHRoaXMuaW50ZXJwb2xhdGVkWCxcclxuICAgICAgICAgICAgICAgIHRoaXMuaW50ZXJwb2xhdGVkWSt0aGlzLmhlaWdodCxcclxuICAgICAgICAgICAgICAgIHRoaXMud2lkdGgsXHJcbiAgICAgICAgICAgICAgICB0aGlzLmhlaWdodFxyXG4gICAgICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZURhdGEoZGF0YTogRW50aXR5UGF5bG9hZCk6IHZvaWQge1xyXG4gICAgICAgIGlmIChkYXRhLnR5cGUgPT09IEVudGl0aWVzLlBsYXllcilcclxuICAgICAgICAgICAgdGhpcy5uYW1lID0gZGF0YS5kYXRhLm5hbWU7XHJcbiAgICB9XHJcblxyXG4gICAga2V5Ym9hcmRJbnB1dCgpIHtcclxuXHJcbiAgICAgICAgdGhpcy54VmVsICs9XHJcbiAgICAgICAgICAgIDAuMDIgKiAoK3RoaXMucmlnaHRCdXR0b24gLSArdGhpcy5sZWZ0QnV0dG9uKTtcclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgIHRoaXMuZ3JvdW5kZWQgJiYgdGhpcy5qdW1wQnV0dG9uXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIGdhbWUuc2NyZWVuc2hha2VBbW91bnQgPSAwLjU7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTAgKiBnYW1lLnBhcnRpY2xlTXVsdGlwbGllcjsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBnYW1lLnBhcnRpY2xlcy5wdXNoKG5ldyBDb2xvclBhcnRpY2xlKHRoaXMuYm90dG9tQ29sbGlzaW9uLmNvbG9yLCAxIC8gOCArIE1hdGgucmFuZG9tKCkgLyA4LCAyMCwgdGhpcy54ICsgdGhpcy53aWR0aCAqIE1hdGgucmFuZG9tKCksIHRoaXMueSArIHRoaXMuaGVpZ2h0LCAwLjIgKiAoTWF0aC5yYW5kb20oKSAtIDAuNSksIDAuMiAqIC1NYXRoLnJhbmRvbSgpKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy55VmVsID0gLTEuNTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYXBwbHlHcmF2aXR5QW5kRHJhZygpIHtcclxuICAgICAgICAvLyB0aGlzIGZ1bmN0aW9uIGNoYW5nZXMgdGhlIG9iamVjdCdzIG5leHQgdGljaydzIHZlbG9jaXR5IGluIGJvdGggdGhlIHggYW5kIHRoZSB5IGRpcmVjdGlvbnNcclxuXHJcbiAgICAgICAgdGhpcy5wWFZlbCA9IHRoaXMueFZlbDtcclxuICAgICAgICB0aGlzLnBZVmVsID0gdGhpcy55VmVsO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5ib3R0b21Db2xsaXNpb24gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLnhWZWwgLT1cclxuICAgICAgICAgICAgICAgIChNYXRoLmFicyh0aGlzLnhWZWwpICogdGhpcy54VmVsICogZ2FtZS5EUkFHX0NPRUZGSUNJRU5UICogdGhpcy53aWR0aCkgLyAvL2FwcGx5IGFpciByZXNpc3RhbmNlXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1hc3M7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy54VmVsIC09XHJcbiAgICAgICAgICAgICAgICAoTWF0aC5hYnModGhpcy54VmVsKSAqIHRoaXMueFZlbCAqIGdhbWUuRFJBR19DT0VGRklDSUVOVCAqICh0aGlzLmJvdHRvbUNvbGxpc2lvbi5mcmljdGlvbikgKiB0aGlzLndpZHRoKSAvIC8vYXBwbHkgYWlyIHJlc2lzdGFuY2UgYW5kIGdyb3VuZCBmcmljdGlvblxyXG4gICAgICAgICAgICAgICAgdGhpcy5tYXNzO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnlWZWwgKz0gZ2FtZS5HUkFWSVRZX1NQRUVEO1xyXG4gICAgICAgIHRoaXMueVZlbCAtPVxyXG4gICAgICAgICAgICAoTWF0aC5hYnModGhpcy55VmVsKSAqIHRoaXMueVZlbCAqIGdhbWUuRFJBR19DT0VGRklDSUVOVCAqIHRoaXMuaGVpZ2h0KSAvXHJcbiAgICAgICAgICAgIHRoaXMubWFzcztcclxuICAgICAgICAvL2lmIG9uIHRoZSBncm91bmQsIG1ha2Ugd2Fsa2luZyBwYXJ0aWNsZXNcclxuICAgICAgICBpZiAodGhpcy5ncm91bmRlZCkge1xyXG4gICAgICAgICAgICAvL2Zvb3RzdGVwc1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJhbmRvbWx5VG9JbnQoTWF0aC5hYnModGhpcy54VmVsKSAqIGdhbWUucGFydGljbGVNdWx0aXBsaWVyIC8gMik7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgZ2FtZS5wYXJ0aWNsZXMucHVzaChuZXcgQ29sb3JQYXJ0aWNsZShcIiNiYmJiYmI0NVwiLCAxIC8gNCArIE1hdGgucmFuZG9tKCkgLyA4LCA1MCwgdGhpcy54ICsgdGhpcy53aWR0aCAvIDIgKyBpIC8gZ2FtZS5wYXJ0aWNsZU11bHRpcGxpZXIsIHRoaXMueSArIHRoaXMuaGVpZ2h0LCAwLCAwLCBmYWxzZSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vZHVzdFxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJhbmRvbWx5VG9JbnQoTWF0aC5hYnModGhpcy54VmVsKSAqIGdhbWUucGFydGljbGVNdWx0aXBsaWVyIC8gMik7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgZ2FtZS5wYXJ0aWNsZXMucHVzaChuZXcgQ29sb3JQYXJ0aWNsZSh0aGlzLmJvdHRvbUNvbGxpc2lvbi5jb2xvciwgMSAvIDggKyBNYXRoLnJhbmRvbSgpIC8gOCwgMTAsIHRoaXMueCArIHRoaXMud2lkdGggLyAyLCB0aGlzLnkgKyB0aGlzLmhlaWdodCwgMC4yICogLXRoaXMueFZlbCArIDAuMiAqIChNYXRoLnJhbmRvbSgpIC0gMC41KSwgMC4yICogLU1hdGgucmFuZG9tKCksIHRydWUpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmaW5kSW50ZXJwb2xhdGVkQ29vcmRpbmF0ZXMoKSB7XHJcbiAgICAgICAgLy8gdGhpcyBmdW5jdGlvbiBlc3NlbnRpYWxseSBtYWtlcyB0aGUgY2hhcmFjdGVyIGxhZyBiZWhpbmQgb25lIHRpY2ssIGJ1dCBtZWFucyB0aGF0IGl0IGdldHMgZGlzcGxheWVkIGF0IHRoZSBtYXhpbXVtIGZyYW1lIHJhdGUuXHJcbiAgICAgICAgaWYgKHRoaXMucFhWZWwgPiAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW50ZXJwb2xhdGVkWCA9IGdhbWUubWluKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5wWCArIHRoaXMucFhWZWwgKiBnYW1lLmFtb3VudFNpbmNlTGFzdFRpY2ssXHJcbiAgICAgICAgICAgICAgICB0aGlzLnhcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmludGVycG9sYXRlZFggPSBnYW1lLm1heChcclxuICAgICAgICAgICAgICAgIHRoaXMucFggKyB0aGlzLnBYVmVsICogZ2FtZS5hbW91bnRTaW5jZUxhc3RUaWNrLFxyXG4gICAgICAgICAgICAgICAgdGhpcy54XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLnBZVmVsID4gMCkge1xyXG4gICAgICAgICAgICB0aGlzLmludGVycG9sYXRlZFkgPSBnYW1lLm1pbihcclxuICAgICAgICAgICAgICAgIHRoaXMucFkgKyB0aGlzLnBZVmVsICogZ2FtZS5hbW91bnRTaW5jZUxhc3RUaWNrLFxyXG4gICAgICAgICAgICAgICAgdGhpcy55XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5pbnRlcnBvbGF0ZWRZID0gZ2FtZS5tYXgoXHJcbiAgICAgICAgICAgICAgICB0aGlzLnBZICsgdGhpcy5wWVZlbCAqIGdhbWUuYW1vdW50U2luY2VMYXN0VGljayxcclxuICAgICAgICAgICAgICAgIHRoaXMueVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBhcHBseVZlbG9jaXR5QW5kQ29sbGlkZSgpIHtcclxuICAgICAgICB0aGlzLnRvcENvbGxpc2lvbiA9IFdvcmxkVGlsZXNbVGlsZVR5cGUuQWlyXTtcclxuICAgICAgICB0aGlzLmJvdHRvbUNvbGxpc2lvbiA9IFdvcmxkVGlsZXNbVGlsZVR5cGUuQWlyXTtcclxuICAgICAgICB0aGlzLnBYID0gdGhpcy54O1xyXG4gICAgICAgIHRoaXMucFkgPSB0aGlzLnk7XHJcblxyXG4gICAgICAgIHRoaXMucEdyb3VuZGVkID0gdGhpcy5ncm91bmRlZDtcclxuICAgICAgICB0aGlzLmdyb3VuZGVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgVGhpcyBmdW5jdGlvbiBhc3N1bWVzIHRoYXQgdGhlIG9iamVjdCBkb2Vzbid0IHN0YXJ0IGluIGNvbGxpc2lvblxyXG5cclxuICAgICAgICBBbHNvLCBpdCB0YWtlcyBhZHZhbnRhZ2Ugb2YgdGhlIGZhY3QgdGhhdCBhbiBvYmplY3QgY2FuIG9ubHkgY29sbGlkZSBvbmNlIGluIGVhY2ggYXhpcyB3aXRoIHRoZXNlIGF4aXMtYWxpZ25lZCByZWN0YW5nbGVzLlxyXG4gICAgICAgIFRoYXQncyBhIHRvdGFsIG9mIGEgcG9zc2libGUgdHdvIGNvbGxpc2lvbnMsIG9yIGFuIGluaXRpYWwgY29sbGlzaW9uLCBhbmQgYSBzbGlkaW5nIGNvbGxpc2lvbi5cclxuICAgICAgICAqL1xyXG5cclxuICAgICAgICAvLyBjYWxjdWxhdGUgdGhlIGluaXRpYWwgY29sbGlzaW9uOlxyXG5cclxuICAgICAgICAvLyBzZXQgdGhlIGNsb3Nlc3QgY29sbGlzaW9uIHRvIG9uZSBpbmZpbml0ZWx5IGZhciBhd2F5LlxyXG4gICAgICAgIHRoaXMuY2xvc2VzdENvbGxpc2lvbiA9IFsxLCAwLCBJbmZpbml0eV07XHJcblxyXG4gICAgICAgIGxldCBtb3N0bHlHb2luZ0hvcml6b250YWxseTogYm9vbGVhbjtcclxuXHJcbiAgICAgICAgLy8gbG9vcCB0aHJvdWdoIGFsbCB0aGUgcG9zc2libGUgdGlsZXMgdGhlIHBoeXNpY3MgYm94IGNvdWxkIGJlIGludGVyc2VjdGluZyB3aXRoXHJcbiAgICAgICAgZm9yIChcclxuICAgICAgICAgICAgbGV0IGkgPSBNYXRoLmZsb29yKGdhbWUubWluKHRoaXMueCwgdGhpcy54ICsgdGhpcy54VmVsKSk7XHJcbiAgICAgICAgICAgIGkgPCBNYXRoLmNlaWwoZ2FtZS5tYXgodGhpcy54LCB0aGlzLnggKyB0aGlzLnhWZWwpICsgdGhpcy53aWR0aCk7XHJcbiAgICAgICAgICAgIGkrK1xyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICBmb3IgKFxyXG4gICAgICAgICAgICAgICAgbGV0IGogPSBNYXRoLmZsb29yKGdhbWUubWluKHRoaXMueSwgdGhpcy55ICsgdGhpcy55VmVsKSk7XHJcbiAgICAgICAgICAgICAgICBqIDwgTWF0aC5jZWlsKGdhbWUubWF4KHRoaXMueSwgdGhpcy55ICsgdGhpcy55VmVsKSArIHRoaXMuaGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgIGorK1xyXG4gICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBjdXJyZW50IHRpbGUgaXNuJ3QgYWlyICh2YWx1ZSAwKSwgdGhlbiBjb250aW51ZSB3aXRoIHRoZSBjb2xsaXNpb24gZGV0ZWN0aW9uXHJcbiAgICAgICAgICAgICAgICBsZXQgY3VycmVudEJsb2NrOiBUaWxlVHlwZSA9IGdhbWUud29ybGQud29ybGRUaWxlc1tqICogZ2FtZS53b3JsZFdpZHRoICsgaV07XHJcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudEJsb2NrICE9IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBnZXQgdGhlIGRhdGEgYWJvdXQgdGhlIGNvbGxpc2lvbiBhbmQgc3RvcmUgaXQgaW4gYSB2YXJpYWJsZVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29sbGlzaW9uRGF0YSA9IGdhbWUucmVjdFZzUmF5KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpIC0gdGhpcy53aWR0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaiAtIHRoaXMuaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLndpZHRoICsgMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oZWlnaHQgKyAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLngsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMueSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy54VmVsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnlWZWxcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgIG1vc3RseUdvaW5nSG9yaXpvbnRhbGx5ID0gTWF0aC5hYnModGhpcy54VmVsKSA+IE1hdGguYWJzKHRoaXMueVZlbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbGxpc2lvbkRhdGEgIT09IGZhbHNlKSB7Ly9hIGNvbGxpc2lvbiBoYXBwZW5lZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMl0gPiB0aGlzLmNvbGxpc2lvbkRhdGFbMl1cclxuICAgICAgICAgICAgICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3Nlc3RDb2xsaXNpb24gPSB0aGlzLmNvbGxpc2lvbkRhdGE7Ly9ob25lc3RseSB0aGlzIGVudGlyZSBjb2xsaXNpb24gc3lzdGVtIGlzIGEgbWVzcyBidXQgaXQgd29yayBzbyBzbyB3aGF0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jbG9zZXN0Q29sbGlzaW9uWzBdID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMV0gPT09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b3BDb2xsaXNpb24gPSBXb3JsZFRpbGVzW2N1cnJlbnRCbG9ja107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJvdHRvbUNvbGxpc2lvbiA9IFdvcmxkVGlsZXNbY3VycmVudEJsb2NrXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5jbG9zZXN0Q29sbGlzaW9uWzJdID09PSB0aGlzLmNvbGxpc2lvbkRhdGFbMl0gJiYgbW9zdGx5R29pbmdIb3Jpem9udGFsbHkgPT09ICh0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMF0gPT09IDApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3Nlc3RDb2xsaXNpb24gPSB0aGlzLmNvbGxpc2lvbkRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jbG9zZXN0Q29sbGlzaW9uWzBdID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMV0gPT09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b3BDb2xsaXNpb24gPSBXb3JsZFRpbGVzW2N1cnJlbnRCbG9ja107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJvdHRvbUNvbGxpc2lvbiA9IFdvcmxkVGlsZXNbY3VycmVudEJsb2NrXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5jbG9zZXN0Q29sbGlzaW9uWzJdICE9PSBJbmZpbml0eSkge1xyXG4gICAgICAgICAgICAvLyB0aGVyZSBoYXMgYmVlbiBhdCBsZWFzdCBvbmUgY29sbGlzaW9uXHJcblxyXG4gICAgICAgICAgICAvLyBnbyB0byB0aGUgcG9pbnQgb2YgY29sbGlzaW9uICh0aGlzIG1ha2VzIGl0IGJlaGF2ZSBhcyBpZiB0aGUgd2FsbHMgYXJlIHN0aWNreSwgYnV0IHdlIHdpbGwgbGF0ZXIgc2xpZGUgYWdhaW5zdCB0aGUgd2FsbHMpXHJcbiAgICAgICAgICAgIHRoaXMueCArPSB0aGlzLnhWZWwgKiB0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMl07XHJcbiAgICAgICAgICAgIHRoaXMueSArPSB0aGlzLnlWZWwgKiB0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMl07XHJcbiAgICAgICAgICAgIC8vIHRoZSBjb2xsaXNpb24gaGFwcGVuZWQgZWl0aGVyIG9uIHRoZSB0b3Agb3IgYm90dG9tXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMF0gPT09IDApIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMV0gPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ncm91bmRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgaXQgY29sbGlkZWQgb24gdGhlIGhpZ2hlciBzaWRlLCBpdCBtdXN0IGJlIHRvdWNoaW5nIHRoZSBncm91bmQuIChoaWdoZXIgeSBpcyBkb3duKVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5wR3JvdW5kZWQpIHsvL2lmIGl0IGlzbid0IGdyb3VuZGVkIHlldCwgaXQgbXVzdCBiZSBjb2xsaWRpbmcgd2l0aCB0aGUgZ3JvdW5kIGZvciB0aGUgZmlyc3QgdGltZSwgc28gc3VtbW9uIHBhcnRpY2xlc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBnYW1lLnNjcmVlbnNoYWtlQW1vdW50ID0gTWF0aC5hYnModGhpcy55VmVsICogMC43NSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNSAqIGdhbWUucGFydGljbGVNdWx0aXBsaWVyOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdhbWUucGFydGljbGVzLnB1c2gobmV3IENvbG9yUGFydGljbGUodGhpcy5ib3R0b21Db2xsaXNpb24uY29sb3IsIDEgLyA4ICsgTWF0aC5yYW5kb20oKSAvIDgsIDIwLCB0aGlzLnggKyB0aGlzLndpZHRoICogTWF0aC5yYW5kb20oKSwgdGhpcy55ICsgdGhpcy5oZWlnaHQsIDAuMiAqIChNYXRoLnJhbmRvbSgpIC0gMC41KSwgMC4yICogLU1hdGgucmFuZG9tKCkpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGdhbWUuc2NyZWVuc2hha2VBbW91bnQgPSBNYXRoLmFicyh0aGlzLnlWZWwgKiAwLjc1KTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDUgKiBnYW1lLnBhcnRpY2xlTXVsdGlwbGllcjsgaSsrKSB7Ly9jZWlsaW5nIGNvbGxpc2lvbiBwYXJ0aWNsZXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2FtZS5wYXJ0aWNsZXMucHVzaChuZXcgQ29sb3JQYXJ0aWNsZSh0aGlzLnRvcENvbGxpc2lvbi5jb2xvciwgMSAvIDggKyBNYXRoLnJhbmRvbSgpIC8gOCwgMjAsIHRoaXMueCArIHRoaXMud2lkdGggKiBNYXRoLnJhbmRvbSgpLCB0aGlzLnksIDAuMiAqIChNYXRoLnJhbmRvbSgpIC0gMC41KSwgMC4yICogLU1hdGgucmFuZG9tKCkpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLnlWZWwgPSAwOyAvLyBzZXQgdGhlIHkgdmVsb2NpdHkgdG8gMCBiZWNhdXNlIHRoZSBvYmplY3QgaGFzIHJ1biBpbnRvIGEgd2FsbCBvbiBpdHMgdG9wIG9yIGJvdHRvbVxyXG4gICAgICAgICAgICAgICAgdGhpcy5zbGlkZVggPSB0aGlzLnhWZWwgKiAoMSAtIHRoaXMuY2xvc2VzdENvbGxpc2lvblsyXSk7IC8vIHRoaXMgaXMgdGhlIHJlbWFpbmluZyBkaXN0YW5jZSB0byBzbGlkZSBhZnRlciB0aGUgY29sbGlzaW9uXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNsaWRlWSA9IDA7IC8vIGl0IGRvZXNuJ3Qgc2xpZGUgaW4gdGhlIHkgZGlyZWN0aW9uIGJlY2F1c2UgdGhlcmUncyBhIHdhbGwgXFwoLi0uKS9cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMueFZlbCA9IDA7IC8vIHNldCB0aGUgeCB2ZWxvY2l0eSB0byAwIGJlY2F1c2Ugd2FsbCBnbyBvb2ZcclxuICAgICAgICAgICAgICAgIHRoaXMuc2xpZGVYID0gMDsgLy8gaXQgZG9lc24ndCBzbGlkZSBpbiB0aGUgeCBkaXJlY3Rpb24gYmVjYXVzZSB0aGVyZSdzIGEgd2FsbCAvKC5fLilcXFxyXG4gICAgICAgICAgICAgICAgdGhpcy5zbGlkZVkgPSB0aGlzLnlWZWwgKiAoMSAtIHRoaXMuY2xvc2VzdENvbGxpc2lvblsyXSk7IC8vIHRoaXMgaXMgdGhlIHJlbWFpbmluZyBkaXN0YW5jZSB0byBzbGlkZSBhZnRlciB0aGUgY29sbGlzaW9uXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIGF0IHRoaXMgcG9pbnQsIHRoZSBvYmplY3QgaXMgdG91Y2hpbmcgaXRzIGZpcnN0IGNvbGxpc2lvbiwgcmVhZHkgdG8gc2xpZGUuICBUaGUgYW1vdW50IGl0IHdhbnRzIHRvIHNsaWRlIGlzIGhlbGQgaW4gdGhlIHRoaXMuc2xpZGVYIGFuZCB0aGlzLnNsaWRlWSB2YXJpYWJsZXMuXHJcblxyXG4gICAgICAgICAgICAvLyB0aGlzIGNhbiBiZSB0cmVhdGVkIGVzc2VudGlhbGx5IHRoZSBzYW1lIGFzIHRoZSBmaXJzdCBjb2xsaXNpb24sIHNvIGEgbG90IG9mIHRoZSBjb2RlIHdpbGwgYmUgcmV1c2VkLlxyXG5cclxuICAgICAgICAgICAgLy8gc2V0IHRoZSBjbG9zZXN0IGNvbGxpc2lvbiB0byBvbmUgaW5maW5pdGVseSBmYXIgYXdheS5cclxuICAgICAgICAgICAgdGhpcy5jbG9zZXN0Q29sbGlzaW9uID0gWzEsIDAsIEluZmluaXR5XTtcclxuXHJcbiAgICAgICAgICAgIC8vIGxvb3AgdGhyb3VnaCBhbGwgdGhlIHBvc3NpYmxlIHRpbGVzIHRoZSBwaHlzaWNzIGJveCBjb3VsZCBiZSBpbnRlcnNlY3Rpbmcgd2l0aFxyXG4gICAgICAgICAgICBmb3IgKFxyXG4gICAgICAgICAgICAgICAgbGV0IGkgPSBNYXRoLmZsb29yKGdhbWUubWluKHRoaXMueCwgdGhpcy54ICsgdGhpcy5zbGlkZVgpKTtcclxuICAgICAgICAgICAgICAgIGkgPCBNYXRoLmNlaWwoZ2FtZS5tYXgodGhpcy54LCB0aGlzLnggKyB0aGlzLnNsaWRlWCkgKyB0aGlzLndpZHRoKTtcclxuICAgICAgICAgICAgICAgIGkrK1xyXG4gICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgIGZvciAoXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGogPSBNYXRoLmZsb29yKGdhbWUubWluKHRoaXMueSwgdGhpcy55ICsgdGhpcy5zbGlkZVkpKTtcclxuICAgICAgICAgICAgICAgICAgICBqIDxcclxuICAgICAgICAgICAgICAgICAgICBNYXRoLmNlaWwoZ2FtZS5tYXgodGhpcy55LCB0aGlzLnkgKyB0aGlzLnNsaWRlWSkgKyB0aGlzLmhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaisrXHJcbiAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgY3VycmVudEJsb2NrOiBUaWxlVHlwZSA9IGdhbWUud29ybGQud29ybGRUaWxlc1tqICogZ2FtZS53b3JsZFdpZHRoICsgaV07XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhlIGN1cnJlbnQgdGlsZSBpc24ndCBhaXIsIHRoZW4gY29udGludWUgd2l0aCB0aGUgY29sbGlzaW9uIGRldGVjdGlvblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50QmxvY2sgIT09IFRpbGVUeXBlLkFpcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBnZXQgdGhlIGRhdGEgYWJvdXQgdGhlIGNvbGxpc2lvbiBhbmQgc3RvcmUgaXQgaW4gYSB2YXJpYWJsZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbGxpc2lvbkRhdGEgPSBnYW1lLnJlY3RWc1JheShcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGkgLSB0aGlzLndpZHRoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaiAtIHRoaXMuaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy53aWR0aCArIDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhlaWdodCArIDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLngsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNsaWRlWCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2xpZGVZXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29sbGlzaW9uRGF0YSAhPT0gZmFsc2UgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2VzdENvbGxpc2lvblsyXSA+IHRoaXMuY29sbGlzaW9uRGF0YVsyXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2VzdENvbGxpc2lvbiA9IHRoaXMuY29sbGlzaW9uRGF0YTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMF0gPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2xvc2VzdENvbGxpc2lvblsxXSA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRvcENvbGxpc2lvbiA9IFdvcmxkVGlsZXNbY3VycmVudEJsb2NrXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYm90dG9tQ29sbGlzaW9uID0gV29ybGRUaWxlc1tjdXJyZW50QmxvY2tdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gaXQgaGFzIGNvbGxpZGVkIHdoaWxlIHRyeWluZyB0byBzbGlkZVxyXG4gICAgICAgICAgICBpZiAodGhpcy5jbG9zZXN0Q29sbGlzaW9uWzJdICE9PSBJbmZpbml0eSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy54ICs9IHRoaXMuc2xpZGVYICogdGhpcy5jbG9zZXN0Q29sbGlzaW9uWzJdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy55ICs9IHRoaXMuc2xpZGVZICogdGhpcy5jbG9zZXN0Q29sbGlzaW9uWzJdO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMF0gPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnlWZWwgPSAwOyAvLyBzZXQgdGhlIHkgdmVsb2NpdHkgdG8gMCBiZWNhdXNlIHRoZSBvYmplY3QgaGFzIHJ1biBpbnRvIGEgd2FsbCBvbiBpdHMgdG9wIG9yIGJvdHRvbVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMV0gPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIGl0IGNvbGxpZGVkIG9uIHRoZSBoaWdoZXIgc2lkZSwgaXQgbXVzdCBiZSB0b3VjaGluZyB0aGUgZ3JvdW5kLiAoaGlnaGVyIHkgaXMgZG93bilcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ncm91bmRlZCA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy54VmVsID0gMDsgLy8gc2V0IHRoZSB4IHZlbG9jaXR5IHRvIDAgYmVjYXVzZSB3YWxsIGdvIG9vZlxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gaXQgaGFzIG5vdCBjb2xsaWRlZCB3aGlsZSB0cnlpbmcgdG8gc2xpZGVcclxuICAgICAgICAgICAgICAgIHRoaXMueCArPSB0aGlzLnNsaWRlWDtcclxuICAgICAgICAgICAgICAgIHRoaXMueSArPSB0aGlzLnNsaWRlWTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIHRoZXJlIGhhcyBiZWVuIG5vIGNvbGxpc2lvblxyXG4gICAgICAgICAgICB0aGlzLnggKz0gdGhpcy54VmVsO1xyXG4gICAgICAgICAgICB0aGlzLnkgKz0gdGhpcy55VmVsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gY29sbGlkZSB3aXRoIHNpZGVzIG9mIG1hcFxyXG5cclxuICAgICAgICBpZiAodGhpcy54IDwgMCkge1xyXG4gICAgICAgICAgICB0aGlzLnggPSAwO1xyXG4gICAgICAgICAgICB0aGlzLnhWZWwgPSAwO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy54ICsgdGhpcy53aWR0aCA+IGdhbWUud29ybGRXaWR0aCkge1xyXG4gICAgICAgICAgICB0aGlzLnggPSBnYW1lLndvcmxkV2lkdGggLSB0aGlzLndpZHRoO1xyXG4gICAgICAgICAgICB0aGlzLnhWZWwgPSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMueSA8IDApIHtcclxuICAgICAgICAgICAgdGhpcy55ID0gMDtcclxuICAgICAgICAgICAgdGhpcy55VmVsID0gMDtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMueSArIHRoaXMuaGVpZ2h0ID4gZ2FtZS53b3JsZEhlaWdodCkge1xyXG4gICAgICAgICAgICB0aGlzLnkgPSBnYW1lLndvcmxkSGVpZ2h0IC0gdGhpcy5oZWlnaHQ7XHJcbiAgICAgICAgICAgIHRoaXMueVZlbCA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JvdW5kZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5leHBvcnQgPSBQbGF5ZXJMb2NhbDtcclxuXHJcblxyXG5mdW5jdGlvbiByYW5kb21seVRvSW50KGY6IG51bWJlcikge1xyXG4gICAgaWYgKE1hdGgucmFuZG9tKCkgPiBmIC0gTWF0aC5mbG9vcihmKSkge1xyXG4gICAgICAgIHJldHVybiAoTWF0aC5mbG9vcihmKSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gKE1hdGguY2VpbChmKSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGF4aXNBbGlnbmVkRGlzdGFuY2UoeDE6IG51bWJlciwgeTE6IG51bWJlciwgeDI6IG51bWJlciwgeTI6IG51bWJlcikge1xyXG4gICAgcmV0dXJuIGFicyh4MSAtIHgyKSArIGFicyh5MSAtIHkyKTtcclxufSIsImltcG9ydCBSZW5kZXJhYmxlIGZyb20gJy4uLy4uL2ludGVyZmFjZXMvUmVuZGVyYWJsZSc7XHJcbmltcG9ydCBwNSBmcm9tICdwNSc7XHJcbmltcG9ydCB7IEVudGl0eVBheWxvYWQgfSBmcm9tICcuLi8uLi8uLi8uLi9hcGkvRW50aXR5JztcclxuXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBTZXJ2ZXJFbnRpdHkgaW1wbGVtZW50cyBSZW5kZXJhYmxlIHtcclxuXHJcbiAgICBlbnRpdHlJZDogc3RyaW5nXHJcblxyXG4gICAgeDogbnVtYmVyID0gMFxyXG4gICAgeTogbnVtYmVyID0gMFxyXG5cclxuICAgIHByb3RlY3RlZCBjb25zdHJ1Y3RvcihlbnRpdHlJZDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5lbnRpdHlJZCA9IGVudGl0eUlkXHJcbiAgICB9XHJcblxyXG4gICAgYWJzdHJhY3QgdXBkYXRlRGF0YShkYXRhOiBFbnRpdHlQYXlsb2FkKTogdm9pZFxyXG5cclxuICAgIGFic3RyYWN0IHJlbmRlcih0YXJnZXQ6IHA1LCB1cHNjYWxlU2l6ZTogbnVtYmVyKTogdm9pZDtcclxufSIsImltcG9ydCBnYW1lIGZyb20gXCIuLi8uLi9NYWluXCI7XHJcbmltcG9ydCBQYXJ0aWNsZSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9QYXJ0aWNsZVwiO1xyXG5pbXBvcnQgeyBjb2xsYXBzZVRleHRDaGFuZ2VSYW5nZXNBY3Jvc3NNdWx0aXBsZVZlcnNpb25zIH0gZnJvbSBcInR5cGVzY3JpcHRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDb2xvclBhcnRpY2xlIGltcGxlbWVudHMgUGFydGljbGUge1xyXG4gICAgY29sb3I6IHN0cmluZ1xyXG4gICAgeDogbnVtYmVyO1xyXG4gICAgeTogbnVtYmVyO1xyXG4gICAgc2l6ZTogbnVtYmVyO1xyXG4gICAgeFZlbDogbnVtYmVyO1xyXG4gICAgeVZlbDogbnVtYmVyO1xyXG4gICAgZ3Jhdml0eTogYm9vbGVhbjtcclxuICAgIGFnZTogbnVtYmVyO1xyXG4gICAgbGlmZXNwYW46IG51bWJlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihjb2xvcjogc3RyaW5nLCBzaXplOiBudW1iZXIsIGxpZmVzcGFuOiBudW1iZXIsIHg6IG51bWJlciwgeTogbnVtYmVyLCB4VmVsPzogbnVtYmVyLCB5VmVsPzogbnVtYmVyLCBncmF2aXR5PzogYm9vbGVhbikge1xyXG4gICAgICAgIHRoaXMuY29sb3IgPSBjb2xvcjtcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICAgICAgdGhpcy54VmVsID0geFZlbCB8fCAwO1xyXG4gICAgICAgIHRoaXMueVZlbCA9IHlWZWwgfHwgMDtcclxuICAgICAgICB0aGlzLnNpemUgPSBzaXplO1xyXG4gICAgICAgIHRoaXMuZ3Jhdml0eSA9IHRydWU7Ly91c2luZyB0aGUgb3IgbW9kaWZpZXIgd2l0aCBib29sZWFucyBjYXVzZXMgYnVnczsgdGhlcmUncyBwcm9iYWJseSBhIGJldHRlciB3YXkgdG8gZG8gdGhpc1xyXG4gICAgICAgIGlmIChncmF2aXR5ICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHRoaXMuZ3Jhdml0eSA9IGdyYXZpdHk7XHJcbiAgICAgICAgdGhpcy5hZ2UgPSAwO1xyXG4gICAgICAgIHRoaXMubGlmZXNwYW4gPSBsaWZlc3BhbjtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIodGFyZ2V0OiBpbXBvcnQoXCJwNVwiKSwgdXBzY2FsZVNpemU6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLmFnZSAvIHRoaXMubGlmZXNwYW4gPCAwLjgpIHsvL2lmIGl0J3MgdW5kZXIgODAlIG9mIHRoZSBwYXJ0aWNsZSdzIGxpZmVzcGFuLCBkcmF3IG5vcm1hbGx5IHdpdGhvdXQgZmFkZVxyXG4gICAgICAgICAgICB0YXJnZXQuZmlsbCh0aGlzLmNvbG9yKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7Ly90aGlzIG1lYW5zIHRoYXQgdGhlIHBhcnRpY2xlIGlzIGFsbW9zdCBnb2luZyB0byBiZSBkZWxldGVkLCBzbyBmYWRpbmcgaXMgbmVjZXNzYXJ5XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbG9yLmxlbmd0aCA9PT0gNykgey8vaWYgdGhlcmUgaXMgbm8gdHJhbnNwYXJlbmN5IGJ5IGRlZmF1bHQsIGp1c3QgbWFwIHRoZSB0aGluZ3NcclxuICAgICAgICAgICAgICAgIGxldCB0cmFuc3BhcmVuY3lTdHJpbmcgPSBNYXRoLnJvdW5kKDI1NSAqICgtNSAqICh0aGlzLmFnZSAvIHRoaXMubGlmZXNwYW4pICsgNSkpLnRvU3RyaW5nKDE2KS5zdWJzdHJpbmcoMCwgMik7XHJcbiAgICAgICAgICAgICAgICBpZiAodHJhbnNwYXJlbmN5U3RyaW5nPT09dW5kZWZpbmVkIHx8IHRyYW5zcGFyZW5jeVN0cmluZy5sZW5ndGg9PT11bmRlZmluZWQpLy9jYXRjaCB3aGF0IGNvdWxkIGJlIGFuIGluZmluaXRlIGxvb3Agb3IganVzdCBhbiBlcnJvclxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcclxuICAgICAgICAgICAgICAgICAgICAgICAgYHVuZGVmaW5lZCB0cmFuc3BhcmVuY3kgc3RyaW5nIG9uIHBhcnRpY2xlYFxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSh0cmFuc3BhcmVuY3lTdHJpbmcubGVuZ3RoPDIpIHsvL21ha2Ugc3VyZSBpdCdzIDIgY2hhcmFjdGVycyBsb25nOyB0aGlzIHN0b3BzIHRoZSBjb21wdXRlciBmcm9tIGludGVycHJldGluZyAjZmYgZmYgZmYgNSBhcyAjZmYgZmYgZmYgNTUgaW5zdGVhZCBvZiAjZmYgZmYgZmYgMDVcclxuICAgICAgICAgICAgICAgICAgICB0cmFuc3BhcmVuY3lTdHJpbmcgPSBcIjBcIit0cmFuc3BhcmVuY3lTdHJpbmc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQuZmlsbCh0aGlzLmNvbG9yLnN1YnN0cmluZygwLCA3KSArIHRyYW5zcGFyZW5jeVN0cmluZyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7Ly9pZiB0aGVyZSBpcyB0cmFuc3BhcmVuY3ksIG11bHRpcGx5XHJcbiAgICAgICAgICAgICAgICBsZXQgdHJhbnNwYXJlbmN5U3RyaW5nID0gTWF0aC5yb3VuZChwYXJzZUludCh0aGlzLmNvbG9yLnN1YnN0cmluZyg3LCA5KSwgMTYpICogKC01ICogKHRoaXMuYWdlIC8gdGhpcy5saWZlc3BhbikgKyA1KSkudG9TdHJpbmcoMTYpLnN1YnN0cmluZygwLCAyKTtcclxuICAgICAgICAgICAgICAgIGlmICh0cmFuc3BhcmVuY3lTdHJpbmc9PT11bmRlZmluZWQgfHwgdHJhbnNwYXJlbmN5U3RyaW5nLmxlbmd0aD09PXVuZGVmaW5lZCkvL2NhdGNoIHdoYXQgY291bGQgYmUgYW4gaW5maW5pdGUgbG9vcCBvciBqdXN0IGFuIGVycm9yXHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBgdW5kZWZpbmVkIHRyYW5zcGFyZW5jeSBzdHJpbmcgb24gcGFydGljbGVgXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIHdoaWxlKHRyYW5zcGFyZW5jeVN0cmluZy5sZW5ndGg8Mikgey8vbWFrZSBzdXJlIGl0J3MgMiBjaGFyYWN0ZXJzIGxvbmc7IHRoaXMgc3RvcHMgdGhlIGNvbXB1dGVyIGZyb20gaW50ZXJwcmV0aW5nICNmZiBmZiBmZiA1IGFzICNmZiBmZiBmZiA1NSBpbnN0ZWFkIG9mICNmZiBmZiBmZiAwNVxyXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zcGFyZW5jeVN0cmluZyA9IFwiMFwiK3RyYW5zcGFyZW5jeVN0cmluZztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRhcmdldC5maWxsKHRoaXMuY29sb3Iuc3Vic3RyaW5nKDAsIDcpICsgdHJhbnNwYXJlbmN5U3RyaW5nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvL2RyYXcgYSByZWN0YW5nbGUgY2VudGVyZWQgb24gdGhlIHggYW5kIHkgcG9zaXRpb24gZmlsbGVkIHdpdGggdGhlIGNvbG9yIG9mIHRoZSBvYmplY3RcclxuICAgICAgICB0YXJnZXQucmVjdChcclxuICAgICAgICAgICAgKC10aGlzLnNpemUgLyAyICsgdGhpcy54ICogZ2FtZS5USUxFX1dJRFRIIC1cclxuICAgICAgICAgICAgICAgIGdhbWUuaW50ZXJwb2xhdGVkQ2FtWCAqIGdhbWUuVElMRV9XSURUSCkgKlxyXG4gICAgICAgICAgICB1cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgKC10aGlzLnNpemUgLyAyICsgdGhpcy55ICogZ2FtZS5USUxFX0hFSUdIVCAtXHJcbiAgICAgICAgICAgICAgICBnYW1lLmludGVycG9sYXRlZENhbVkgKiBnYW1lLlRJTEVfSEVJR0hUKSAqXHJcbiAgICAgICAgICAgIHVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICB0aGlzLnNpemUgKiB1cHNjYWxlU2l6ZSAqIGdhbWUuVElMRV9XSURUSCxcclxuICAgICAgICAgICAgdGhpcy5zaXplICogdXBzY2FsZVNpemUgKiBnYW1lLlRJTEVfSEVJR0hUXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICB0aWNrKCkge1xyXG4gICAgICAgIHRoaXMuYWdlKys7XHJcbiAgICAgICAgdGhpcy54ICs9IHRoaXMueFZlbDtcclxuICAgICAgICB0aGlzLnkgKz0gdGhpcy55VmVsO1xyXG4gICAgICAgIHRoaXMueFZlbCAtPSAoTWF0aC5hYnModGhpcy54VmVsKSAqIHRoaXMueFZlbCAqIGdhbWUuRFJBR19DT0VGRklDSUVOVCAqIHRoaXMuc2l6ZSk7Ly9hc3N1bWluZyBjb25zdGFudCBtYXNzIGZvciBlYWNoIHBhcnRpY2xlXHJcbiAgICAgICAgaWYgKHRoaXMuZ3Jhdml0eSkge1xyXG4gICAgICAgICAgICB0aGlzLnlWZWwgKz0gZ2FtZS5HUkFWSVRZX1NQRUVEO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnlWZWwgLT0gKE1hdGguYWJzKHRoaXMueVZlbCkgKiB0aGlzLnlWZWwgKiBnYW1lLkRSQUdfQ09FRkZJQ0lFTlQgKiB0aGlzLnNpemUpO1xyXG4gICAgfVxyXG5cclxufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuIiwidmFyIGRlZmVycmVkID0gW107XG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8gPSAocmVzdWx0LCBjaHVua0lkcywgZm4sIHByaW9yaXR5KSA9PiB7XG5cdGlmKGNodW5rSWRzKSB7XG5cdFx0cHJpb3JpdHkgPSBwcmlvcml0eSB8fCAwO1xuXHRcdGZvcih2YXIgaSA9IGRlZmVycmVkLmxlbmd0aDsgaSA+IDAgJiYgZGVmZXJyZWRbaSAtIDFdWzJdID4gcHJpb3JpdHk7IGktLSkgZGVmZXJyZWRbaV0gPSBkZWZlcnJlZFtpIC0gMV07XG5cdFx0ZGVmZXJyZWRbaV0gPSBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV07XG5cdFx0cmV0dXJuO1xuXHR9XG5cdHZhciBub3RGdWxmaWxsZWQgPSBJbmZpbml0eTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZWZlcnJlZC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV0gPSBkZWZlcnJlZFtpXTtcblx0XHR2YXIgZnVsZmlsbGVkID0gdHJ1ZTtcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGNodW5rSWRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRpZiAoKHByaW9yaXR5ICYgMSA9PT0gMCB8fCBub3RGdWxmaWxsZWQgPj0gcHJpb3JpdHkpICYmIE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uTykuZXZlcnkoKGtleSkgPT4gKF9fd2VicGFja19yZXF1aXJlX18uT1trZXldKGNodW5rSWRzW2pdKSkpKSB7XG5cdFx0XHRcdGNodW5rSWRzLnNwbGljZShqLS0sIDEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZnVsZmlsbGVkID0gZmFsc2U7XG5cdFx0XHRcdGlmKHByaW9yaXR5IDwgbm90RnVsZmlsbGVkKSBub3RGdWxmaWxsZWQgPSBwcmlvcml0eTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYoZnVsZmlsbGVkKSB7XG5cdFx0XHRkZWZlcnJlZC5zcGxpY2UoaS0tLCAxKVxuXHRcdFx0dmFyIHIgPSBmbigpO1xuXHRcdFx0aWYgKHIgIT09IHVuZGVmaW5lZCkgcmVzdWx0ID0gcjtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gbm8gYmFzZVVSSVxuXG4vLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGFuZCBsb2FkaW5nIGNodW5rc1xuLy8gdW5kZWZpbmVkID0gY2h1bmsgbm90IGxvYWRlZCwgbnVsbCA9IGNodW5rIHByZWxvYWRlZC9wcmVmZXRjaGVkXG4vLyBbcmVzb2x2ZSwgcmVqZWN0LCBQcm9taXNlXSA9IGNodW5rIGxvYWRpbmcsIDAgPSBjaHVuayBsb2FkZWRcbnZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG5cdFwibWFpblwiOiAwXG59O1xuXG4vLyBubyBjaHVuayBvbiBkZW1hbmQgbG9hZGluZ1xuXG4vLyBubyBwcmVmZXRjaGluZ1xuXG4vLyBubyBwcmVsb2FkZWRcblxuLy8gbm8gSE1SXG5cbi8vIG5vIEhNUiBtYW5pZmVzdFxuXG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8uaiA9IChjaHVua0lkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID09PSAwKTtcblxuLy8gaW5zdGFsbCBhIEpTT05QIGNhbGxiYWNrIGZvciBjaHVuayBsb2FkaW5nXG52YXIgd2VicGFja0pzb25wQ2FsbGJhY2sgPSAocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24sIGRhdGEpID0+IHtcblx0dmFyIFtjaHVua0lkcywgbW9yZU1vZHVsZXMsIHJ1bnRpbWVdID0gZGF0YTtcblx0Ly8gYWRkIFwibW9yZU1vZHVsZXNcIiB0byB0aGUgbW9kdWxlcyBvYmplY3QsXG5cdC8vIHRoZW4gZmxhZyBhbGwgXCJjaHVua0lkc1wiIGFzIGxvYWRlZCBhbmQgZmlyZSBjYWxsYmFja1xuXHR2YXIgbW9kdWxlSWQsIGNodW5rSWQsIGkgPSAwO1xuXHRpZihjaHVua0lkcy5zb21lKChpZCkgPT4gKGluc3RhbGxlZENodW5rc1tpZF0gIT09IDApKSkge1xuXHRcdGZvcihtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xuXHRcdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcblx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYocnVudGltZSkgdmFyIHJlc3VsdCA9IHJ1bnRpbWUoX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cdH1cblx0aWYocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24pIHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKGRhdGEpO1xuXHRmb3IoO2kgPCBjaHVua0lkcy5sZW5ndGg7IGkrKykge1xuXHRcdGNodW5rSWQgPSBjaHVua0lkc1tpXTtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oaW5zdGFsbGVkQ2h1bmtzLCBjaHVua0lkKSAmJiBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pIHtcblx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXVswXSgpO1xuXHRcdH1cblx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPSAwO1xuXHR9XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLk8ocmVzdWx0KTtcbn1cblxudmFyIGNodW5rTG9hZGluZ0dsb2JhbCA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtzbm93ZWRfaW5cIl0gPSBzZWxmW1wid2VicGFja0NodW5rc25vd2VkX2luXCJdIHx8IFtdO1xuY2h1bmtMb2FkaW5nR2xvYmFsLmZvckVhY2god2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCAwKSk7XG5jaHVua0xvYWRpbmdHbG9iYWwucHVzaCA9IHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2guYmluZChjaHVua0xvYWRpbmdHbG9iYWwpKTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGRlcGVuZHMgb24gb3RoZXIgbG9hZGVkIGNodW5rcyBhbmQgZXhlY3V0aW9uIG5lZWQgdG8gYmUgZGVsYXllZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8odW5kZWZpbmVkLCBbXCJjb21tb25zLW1haW5cIl0sICgpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi93ZWJwYWdlL3NyYy9NYWluLnRzXCIpKSlcbl9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8oX193ZWJwYWNrX2V4cG9ydHNfXyk7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=