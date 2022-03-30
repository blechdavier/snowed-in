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
        Assets_1.AudioAssets.music.titleScreen.playSound();
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
        tileset_stone3: new TileResource_1.default('assets/textures/world/middleground/tileset_stone2.png', 16, 1, 8, 8),
        tileset_stone4: new TileResource_1.default('assets/textures/world/middleground/tileset_stone2.png', 16, 1, 8, 8),
        tileset_stone5: new TileResource_1.default('assets/textures/world/middleground/tileset_stone2.png', 16, 1, 8, 8),
        tileset_stone6: new TileResource_1.default('assets/textures/world/middleground/tileset_stone2.png', 16, 1, 8, 8),
        tileset_stone7: new TileResource_1.default('assets/textures/world/middleground/tileset_stone2.png', 16, 1, 8, 8),
        tileset_stone8: new TileResource_1.default('assets/textures/world/middleground/tileset_stone2.png', 16, 1, 8, 8),
        tileset_stone9: new TileResource_1.default('assets/textures/world/middleground/tileset_stone2.png', 16, 1, 8, 8),
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
        // Verify that the tiles has been loaded
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
                // console.log(target.world);
                // console.log(target.world.worldTiles);
                let currentBlock = target.world.worldTiles[j * target.worldWidth + i];
                if (currentBlock === undefined || currentBlock === Tile_1.TileType.Air || currentBlock === Tile_1.TileType.TileEntity) { //the reference to TileEntity can be removed as soon as the better system is in place
                    continue;
                }
                target.tint(255, 50); //make it somewhat translucent based on the reflectivity of the tile
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RSxJQUFJLEVBQUUsRUFBRSxFQUFFLEdBQUUsRUFBRTtnQkFDbEMsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUM7WUFDMUIsQ0FBQyxDQUFDO1lBQ0YsSUFBSSxpQkFBTyxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEdBQUUsRUFBRTtnQkFDbEMsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUM7WUFDMUIsQ0FBQyxDQUFDO1lBQ0YsSUFBSSxpQkFBTyxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEdBQUUsRUFBRTtnQkFDbEMsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUM7WUFDMUIsQ0FBQyxDQUFDO1lBQ0YsSUFBSSxpQkFBTyxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEdBQUUsRUFBRTtnQkFDbEMsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUM7WUFDMUIsQ0FBQyxDQUFDO1lBQ0YsSUFBSSxpQkFBTyxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEdBQUUsRUFBRTtnQkFDbEMsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUM7WUFDMUIsQ0FBQyxDQUFDO1lBQ0YsSUFBSSxpQkFBTyxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEdBQUUsRUFBRTtnQkFDbEMsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUM7WUFDMUIsQ0FBQyxDQUFDO1lBQ0YsSUFBSSxpQkFBTyxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEdBQUUsRUFBRTtnQkFDbEMsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUM7WUFDMUIsQ0FBQyxDQUFDLEVBQUMsWUFBWTtTQUNsQixDQUFDO1FBeUJFLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1FBRTdCLGlDQUFpQztRQUNqQyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksdUJBQVUsQ0FBQyxJQUFJLENBQUM7SUFDMUMsQ0FB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TixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztLQUNULEVBQUUsd0VBQXdFLENBQUM7SUFFNUUsR0FBRyxFQUFFLElBQUksc0JBQVksQ0FBQyxnQ0FBZ0MsRUFBRTtRQUNwRCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztLQUNULEVBQUUsd0VBQXdFLENBQUM7Q0FFL0UsQ0FBQztBQTZTd0Qsc0JBQUs7QUEzUy9ELE1BQU0sSUFBSSxHQUFHO0lBQ1QsV0FBVyxFQUFFO1FBQ1QsRUFBRTtRQUNGLEVBQUU7UUFDRixFQUFFO1FBQ0YsUUFBUTtRQUNSLEVBQUU7UUFD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QUFDLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxHQUFDLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxHQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFDLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUNqSTtvQkFDRCxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLEdBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEdBQUMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDO3dCQUN2RCxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsR0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBQyxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUM7NEJBQ25FLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBQyxDQUFDLENBQUMsR0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQzs0QkFDbkQsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssR0FBQyxDQUFDLEdBQUMsR0FBRyxHQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxHQUFDLENBQUMsR0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEdBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ25HO2FBQ0o7WUFDRCxJQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksRUFBRSxDQUFDO1NBQ2xDO1FBQ0csTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFH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Q0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUMzRyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDM0csSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRWpJLGlCQUFpQjtRQUNqQixJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDNUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRWxJLGlCQUFpQjtRQUNqQixJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDNUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRWxJLFNBQVM7UUFDVCxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFbkksSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxXQUFXLENBQUMsR0FBRyxXQUFXLEdBQUcsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxDQUFDO0lBQy9JLENBQUM7SUFFRCxlQUFlLENBQUMsTUFBYyxFQUFFLE1BQWM7UUFDMUMsMERBQTBEO1FBQzFELElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxDQUFDLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxD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QUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUMzRyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFakksaUJBQWlCO1FBQ2pCLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM1RyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFbEksaUJBQWlCO1FBQ2pCLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM1RyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFbEksU0FBUztRQUNULElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUVuSSxJQUFHLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDZixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLEdBQUcsR0FBQyxtQkFBbUIsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxHQUFHLFdBQVcsR0FBRyxDQUFDLEdBQUcsV0FBVyxDQUFDLENBQUM7U0FDbEs7YUFDSTtZQUNELElBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDZCxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLEdBQUcsR0FBQyxNQUFNLEdBQUMsYUFBSSxDQUFD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QTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsR0FBRztXQUNIO1dBQ0E7V0FDQSxDQUFDOzs7OztXQ1BEOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7V0NOQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsTUFBTSxxQkFBcUI7V0FDM0I7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTtXQUNBO1dBQ0E7Ozs7O1VFaERBO1VBQ0E7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi9hcGkvRW50aXR5LnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL2FwaS9UaWxlLnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3dlYnBhZ2Uvc3JjL0dhbWUudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vd2VicGFnZS9zcmMvTWFpbi50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi93ZWJwYWdlL3NyYy9hc3NldHMvQXNzZXRzLnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3dlYnBhZ2Uvc3JjL2Fzc2V0cy9yZXNvdXJjZXMvQXVkaW9SZXNvdXJjZS50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi93ZWJwYWdlL3NyYy9hc3NldHMvcmVzb3VyY2VzL0F1ZGlvUmVzb3VyY2VHcm91cC50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi93ZWJwYWdlL3NyYy9hc3NldHMvcmVzb3VyY2VzL0ZvbnRSZXNvdXJjZS50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi93ZWJwYWdlL3NyYy9hc3NldHMvcmVzb3VyY2VzL0ltYWdlUmVzb3VyY2UudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vd2VicGFnZS9zcmMvYXNzZXRzL3Jlc291cmNlcy9SZWZsZWN0ZWRJbWFnZVJlc291cmNlLnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3dlYnBhZ2Uvc3JjL2Fzc2V0cy9yZXNvdXJjZXMvUmVzb3VyY2UudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vd2VicGFnZS9zcmMvYXNzZXRzL3Jlc291cmNlcy9UaWxlUmVzb3VyY2UudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vd2VicGFnZS9zcmMvaW5wdXQvQ29udHJvbC50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi93ZWJwYWdlL3NyYy91aS9CdXR0b24udHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vd2VicGFnZS9zcmMvdWkvSW5wdXRCb3gudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vd2VicGFnZS9zcmMvdWkvU2xpZGVyLnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3dlYnBhZ2Uvc3JjL3VpL1VpRnJhbWUudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vd2VicGFnZS9zcmMvdWkvVWlTY3JlZW4udHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vd2VicGFnZS9zcmMvdWkvc2NyZWVucy9Db250cm9sc01lbnUudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vd2VicGFnZS9zcmMvdWkvc2NyZWVucy9NYWluTWVudS50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi93ZWJwYWdlL3NyYy91aS9zY3JlZW5zL09wdGlvbnNNZW51LnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3dlYnBhZ2Uvc3JjL3VpL3NjcmVlbnMvUGF1c2VNZW51LnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3dlYnBhZ2Uvc3JjL3VpL3NjcmVlbnMvVmlkZW9TZXR0aW5nc01lbnUudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vd2VicGFnZS9zcmMvdWkvc2NyZWVucy9Xb3JsZENyZWF0aW9uTWVudS50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi93ZWJwYWdlL3NyYy91aS9zY3JlZW5zL1dvcmxkT3B0aW9uc01lbnUudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vd2VicGFnZS9zcmMvd2Vic29ja2V0L05ldE1hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vd2VicGFnZS9zcmMvd29ybGQvV29ybGQudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vd2VicGFnZS9zcmMvd29ybGQvV29ybGRUaWxlcy50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi93ZWJwYWdlL3NyYy93b3JsZC9lbnRpdGllcy9FbnRpdHlDbGFzc2VzLnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3dlYnBhZ2Uvc3JjL3dvcmxkL2VudGl0aWVzL1BsYXllckVudGl0eS50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi93ZWJwYWdlL3NyYy93b3JsZC9lbnRpdGllcy9QbGF5ZXJMb2NhbC50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi93ZWJwYWdlL3NyYy93b3JsZC9lbnRpdGllcy9TZXJ2ZXJFbnRpdHkudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vd2VicGFnZS9zcmMvd29ybGQvcGFydGljbGVzL0NvbG9yUGFydGljbGUudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3Nub3dlZF9pbi93ZWJwYWNrL3J1bnRpbWUvY2h1bmsgbG9hZGVkIiwid2VicGFjazovL3Nub3dlZF9pbi93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luL3dlYnBhY2svcnVudGltZS9nbG9iYWwiLCJ3ZWJwYWNrOi8vc25vd2VkX2luL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vc25vd2VkX2luL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vc25vd2VkX2luL3dlYnBhY2svcnVudGltZS9qc29ucCBjaHVuayBsb2FkaW5nIiwid2VicGFjazovL3Nub3dlZF9pbi93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL3Nub3dlZF9pbi93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vc25vd2VkX2luL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbnZlbnRvcnlQYXlsb2FkIH0gZnJvbSAnLi9JbnZlbnRvcnknO1xyXG5cclxuZXhwb3J0IGVudW0gRW50aXRpZXMge1xyXG4gICAgTG9jYWxQbGF5ZXIsXHJcbiAgICBQbGF5ZXIsXHJcbiAgICBJdGVtXHJcbn1cclxuXHJcbnR5cGUgRGF0YVBhaXJzPFQsIEsgZXh0ZW5kcyBrZXlvZiBUID0ga2V5b2YgVD4gPVxyXG4gICAgSyBleHRlbmRzIGtleW9mIFRcclxuICAgICAgICA/IHsgdHlwZTogSywgZGF0YTogVFtLXSB9XHJcbiAgICAgICAgOiBuZXZlcjtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgRW50aXRpZXNEYXRhIHtcclxuICAgIFtFbnRpdGllcy5Mb2NhbFBsYXllcl06IHtuYW1lOiBzdHJpbmcsIHg6IG51bWJlciwgeTogbnVtYmVyLCBpbnZlbnRvcnk6IEludmVudG9yeVBheWxvYWR9XHJcbiAgICBbRW50aXRpZXMuUGxheWVyXToge25hbWU6IHN0cmluZ307XHJcbiAgICBbRW50aXRpZXMuSXRlbV06IHtkYXRlQ3JlYXRlZDogc3RyaW5nfTtcclxufVxyXG5cclxuZXhwb3J0IHR5cGUgRW50aXR5RGF0YTxUIGV4dGVuZHMgRW50aXRpZXMgPSBrZXlvZiBFbnRpdGllc0RhdGE+ID0gRGF0YVBhaXJzPEVudGl0aWVzRGF0YSwgVD5cclxuXHJcbmV4cG9ydCB0eXBlIEVudGl0eVBheWxvYWQ8VCBleHRlbmRzIEVudGl0aWVzID0ga2V5b2YgRW50aXRpZXNEYXRhPiA9IEVudGl0eURhdGE8VD4gJiB7aWQ6IHN0cmluZ30iLCJleHBvcnQgZW51bSBUaWxlVHlwZSB7XHJcbiAgICBBaXIsXHJcbiAgICBUaWxlRW50aXR5LFxyXG4gICAgU25vdyxcclxuICAgIEljZSxcclxuICAgIERpcnQsXHJcbiAgICBTdG9uZTAsXHJcbiAgICBTdG9uZTEsXHJcbiAgICBTdG9uZTIsXHJcbiAgICBTdG9uZTMsXHJcbiAgICBTdG9uZTQsXHJcbiAgICBTdG9uZTUsXHJcbiAgICBTdG9uZTYsXHJcbiAgICBTdG9uZTcsXHJcbiAgICBTdG9uZTgsXHJcbiAgICBTdG9uZTksXHJcbiAgICAvLyBXb29kMCxcclxuICAgIC8vIFdvb2QxLFxyXG4gICAgLy8gV29vZDIsXHJcbiAgICAvLyBXb29kMyxcclxuICAgIC8vIFdvb2Q0LFxyXG4gICAgLy8gV29vZDUsXHJcbiAgICAvLyBXb29kNixcclxuICAgIC8vIFdvb2Q3LFxyXG4gICAgLy8gV29vZDgsXHJcbiAgICAvLyBXb29kOSxcclxufSIsImltcG9ydCBwNSwgeyBDb2xvciwgU2hhZGVyIH0gZnJvbSAncDUnXHJcblxyXG5pbXBvcnQgV29ybGQgZnJvbSAnLi93b3JsZC9Xb3JsZCc7XHJcblxyXG5pbXBvcnQge1xyXG4gICAgQXVkaW9Bc3NldHMsXHJcbiAgICBGb250cyxcclxuICAgIEl0ZW1zQXNzZXRzLFxyXG4gICAgbG9hZEFzc2V0cyxcclxuICAgIFBsYXllckFuaW1hdGlvbnMsXHJcbiAgICBVaUFzc2V0cyxcclxuICAgIFdvcmxkQXNzZXRzLFxyXG59IGZyb20gJy4vYXNzZXRzL0Fzc2V0cyc7XHJcbmltcG9ydCB7IE1haW5NZW51IH0gZnJvbSAnLi91aS9zY3JlZW5zL01haW5NZW51JztcclxuaW1wb3J0IHsgU29ja2V0IH0gZnJvbSAnc29ja2V0LmlvLWNsaWVudCc7XHJcbmltcG9ydCBVaVNjcmVlbiBmcm9tICcuL3VpL1VpU2NyZWVuJztcclxuaW1wb3J0IHsgUGF1c2VNZW51IH0gZnJvbSAnLi91aS9zY3JlZW5zL1BhdXNlTWVudSc7XHJcbmltcG9ydCB7IE5ldE1hbmFnZXIgfSBmcm9tICcuL3dlYnNvY2tldC9OZXRNYW5hZ2VyJztcclxuXHJcbmltcG9ydCB7IENsaWVudEV2ZW50cywgU2VydmVyRXZlbnRzIH0gZnJvbSAnLi4vLi4vYXBpL0FQSSc7XHJcbmltcG9ydCBJdGVtU3RhY2sgZnJvbSAnLi93b3JsZC9pdGVtcy9JdGVtU3RhY2snO1xyXG5pbXBvcnQgeyBDb250cm9sIH0gZnJvbSAnLi9pbnB1dC9Db250cm9sJztcclxuaW1wb3J0IHsgQ29sb3JQYXJ0aWNsZSB9IGZyb20gJy4vd29ybGQvcGFydGljbGVzL0NvbG9yUGFydGljbGUnO1xyXG5pbXBvcnQgeyBXb3JsZFRpbGVzIH0gZnJvbSAnLi93b3JsZC9Xb3JsZFRpbGVzJztcclxuaW1wb3J0IHsgVGlsZVR5cGUgfSBmcm9tICcuLi8uLi9hcGkvVGlsZSc7XHJcblxyXG5cclxuLypcclxuLy8vSU5GT1JNQVRJT05cclxuLy9TdGFydGluZyBhIGdhbWVcclxuUHJlc3MgTGl2ZSBTZXJ2ZXIgdG8gc3RhcnQgdGhlIGdhbWVcclxub3JcclxuVHlwZSBucG0gcnVuIHByZXN0YXJ0IHRvIHN0YXJ0IHRoZSBnYW1lLlxyXG4vL1RPRE9cclxuV2hlbiBzb21ldGhpbmcgaW4gdGhlIHRvZG8gc2VjdGlvbiwgZWl0aGVyIGRlbGV0ZSBpdCBhbmQgbWFyayB3aGF0IHdhcyBkb25lIGluIHRoZSBkZXNjcmlwdGlvbiAtXHJcbi0gd2hlbiBwdXNoaW5nLCBvciBqdXN0IG1hcmsgaXQgbGlrZSB0aGlzXHJcbihleGFtcGxlOiBDcmVhdGUgYSBudWNsZWFyIGV4cGxvc2lvbiAtLSBYKVxyXG4vLy9HRU5FUkFMIFRPRE86XHJcblxyXG4vL0F1ZGlvXHJcbnNvdW5kc1xyXG5tdXNpY1xyXG5OUEMnc1xyXG5cclxuLy9WaXN1YWxcclxuVXBkYXRlIHNub3cgdGV4dHVyZXNcclxuVXBkYXRlIEdVSSB0ZXh0dXJlc1xyXG5wbGF5ZXIgY2hhcmFjdGVyXHJcbml0ZW0gbG9yZSBpbXBsZW1lbnRlZFxyXG5cclxuLy9HYW1lcGxheVxyXG5maW5pc2ggaXRlbSBtYW5hZ2VtZW50XHJcbnBhdXNlIG1lbnVcclxuSHVuZ2VyLCBoZWF0LCBldGMgc3lzdGVtXHJcbml0ZW0gY3JlYXRpb25cclxuaXRlbSB1c2VcclxuUGFyZW50IFdvcmtiZW5jaFxyXG5cclxuLy9PYmplY3RzXHJcbmRpcnRcclxuc3RvbmVcclxud29ya2JlbmNoXHJcbmJhY2twYWNrICh1c2VkIGFzIGNoZXN0KVxyXG5cclxuLy9Qb2xpc2hcclxuYmV0dGVyIHdvcmxkIGdlbmVyYXRpb25cclxuZm9udCBjb25zaXN0ZW5jeVxyXG5maXggY3Vyc29yIGlucHV0IGxhZyAoc2VwYXJhdGUgY3Vyc29yIGFuZCBhbmltYXRpb24gaW1hZ2VzKVxyXG5maXggc3R1Y2sgb24gc2lkZSBvZiBibG9jayBidWdcclxuZml4IGNvbGxpZGUgd2l0aCBzaWRlcyBvZiBtYXAgYnVnXHJcblxyXG5pdGVtIG1hbmFnZW1lbnQgYmVoYXZpb3IgdG9kbzpcclxubWVyZ2VcclxucmlnaHQgY2xpY2sgc3RhY2sgdG8gcGljayB1cCBjZWlsKGhhbGYgb2YgaXQpXHJcbnJpZ2h0IGNsaWNrIHdoZW4gcGlja2VkIHVwIHRvIGFkZCAxIGlmIDAgb3IgbWF0Y2hcclxuY3JhZnRhYmxlc1xyXG5cclxuXHJcbiovXHJcblxyXG5cclxuY2xhc3MgR2FtZSBleHRlbmRzIHA1IHtcclxuICAgIHdvcmxkV2lkdGg6IG51bWJlciA9IDUxMjsgLy8gd2lkdGggb2YgdGhlIHdvcmxkIGluIHRpbGVzICAgPCE+IE1BS0UgU1VSRSBUSElTIElTIE5FVkVSIExFU1MgVEhBTiA2NCEhISA8IT5cclxuICAgIHdvcmxkSGVpZ2h0OiBudW1iZXIgPSAyNTY7IC8vIGhlaWdodCBvZiB0aGUgd29ybGQgaW4gdGlsZXMgIDwhPiBNQUtFIFNVUkUgVEhJUyBJUyBORVZFUiBMRVNTIFRIQU4gNjQhISEgPCE+XHJcblxyXG4gICAgVElMRV9XSURUSDogbnVtYmVyID0gODsgLy8gd2lkdGggb2YgYSB0aWxlcyBpbiBwaXhlbHNcclxuICAgIFRJTEVfSEVJR0hUOiBudW1iZXIgPSA4OyAvLyBoZWlnaHQgb2YgYSB0aWxlcyBpbiBwaXhlbHNcclxuICAgIEJBQ0tfVElMRV9XSURUSDogbnVtYmVyID0gMTI7IC8vIHdpZHRoIG9mIGEgdGlsZXMgaW4gcGl4ZWxzXHJcbiAgICBCQUNLX1RJTEVfSEVJR0hUOiBudW1iZXIgPSAxMjsgLy8gaGVpZ2h0IG9mIGEgdGlsZXMgaW4gcGl4ZWxzXHJcblxyXG4gICAgdXBzY2FsZVNpemU6IG51bWJlciA9IDY7IC8vIG51bWJlciBvZiBzY3JlZW4gcGl4ZWxzIHBlciB0ZXh0dXJlIHBpeGVscyAodGhpbmsgb2YgdGhpcyBhcyBodWQgc2NhbGUgaW4gTWluZWNyYWZ0KVxyXG5cclxuICAgIGNhbVg6IG51bWJlciA9IDA7IC8vIHBvc2l0aW9uIG9mIHRoZSB0b3AgbGVmdCBjb3JuZXIgb2YgdGhlIHNjcmVlbiBpbiB1bi11cC1zY2FsZWQgcGl4ZWxzICgwIGlzIGxlZnQgb2Ygd29ybGQpICh3b3JsZFdpZHRoKlRJTEVfV0lEVEggaXMgYm90dG9tIG9mIHdvcmxkKVxyXG4gICAgY2FtWTogbnVtYmVyID0gMDsgLy8gcG9zaXRpb24gb2YgdGhlIHRvcCBsZWZ0IGNvcm5lciBvZiB0aGUgc2NyZWVuIGluIHVuLXVwLXNjYWxlZCBwaXhlbHMgKDAgaXMgdG9wIG9mIHdvcmxkKSAod29ybGRIZWlnaHQqVElMRV9IRUlHSFQgaXMgYm90dG9tIG9mIHdvcmxkKVxyXG4gICAgcENhbVg6IG51bWJlciA9IDA7IC8vIGxhc3QgZnJhbWUncyB4IG9mIHRoZSBjYW1lcmFcclxuICAgIHBDYW1ZOiBudW1iZXIgPSAwOyAvLyBsYXN0IGZyYW1lJ3MgeSBvZiB0aGUgY2FtZXJhXHJcbiAgICBpbnRlcnBvbGF0ZWRDYW1YOiBudW1iZXIgPSAwOyAvLyBpbnRlcnBvbGF0ZWQgcG9zaXRpb24gb2YgdGhlIGNhbWVyYVxyXG4gICAgaW50ZXJwb2xhdGVkQ2FtWTogbnVtYmVyID0gMDsgLy8gaW50ZXJwb2xhdGVkIHBvc2l0aW9uIG9mIHRoZSBjYW1lcmFcclxuICAgIGRlc2lyZWRDYW1YOiBudW1iZXIgPSAwOyAvLyBkZXNpcmVkIHBvc2l0aW9uIG9mIHRoZSBjYW1lcmFcclxuICAgIGRlc2lyZWRDYW1ZOiBudW1iZXIgPSAwOyAvLyBkZXNpcmVkIHBvc2l0aW9uIG9mIHRoZSBjYW1lcmFcclxuICAgIHNjcmVlbnNoYWtlQW1vdW50OiBudW1iZXIgPSAwOyAvLyBhbW91bnQgb2Ygc2NyZWVuc2hha2UgaGFwcGVuaW5nIGF0IHRoZSBjdXJyZW50IG1vbWVudFxyXG5cclxuICAgIC8vIHRpY2sgbWFuYWdlbWVudFxyXG4gICAgbXNTaW5jZVRpY2s6IG51bWJlciA9IDA7IC8vIHRoaXMgaXMgdGhlIHJ1bm5pbmcgY291bnRlciBvZiBob3cgbWFueSBtaWxsaXNlY29uZHMgaXQgaGFzIGJlZW4gc2luY2UgdGhlIGxhc3QgdGljay4gIFRoZSBnYW1lIGNhbiB0aGVuXHJcbiAgICBtc1BlclRpY2s6IG51bWJlciA9IDIwOyAvLyB0aGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBwZXIgZ2FtZSB0aWNrLiAgMTAwMC9tc1BlclRpY2sgPSB0aWNrcyBwZXIgc2Vjb25kXHJcbiAgICBhbW91bnRTaW5jZUxhc3RUaWNrOiBudW1iZXIgPSAwOyAvLyB0aGlzIGlzIGEgdmFyaWFibGUgY2FsY3VsYXRlZCBldmVyeSBmcmFtZSB1c2VkIGZvciBpbnRlcnBvbGF0aW9uIC0gZG9tYWluWzAsMSlcclxuICAgIGZvcmdpdmVuZXNzQ291bnQ6IG51bWJlciA9IDUwOyAvLyBpZiB0aGUgY29tcHV0ZXIgbmVlZHMgdG8gZG8gbW9yZSB0aGFuIDUwIHRpY2tzIGluIGEgc2luZ2xlIGZyYW1lLCB0aGVuIGl0IGNvdWxkIGJlIHJ1bm5pbmcgYmVoaW5kLCBwcm9iYWJseSBiZWNhdXNlIG9mIGEgZnJlZXplIG9yIHRoZSB1c2VyIGJlaW5nIG9uIGEgZGlmZmVyZW50IHRhYi4gIEluIHRoZXNlIGNhc2VzLCBpdCdzIHByb2JhYmx5IGJlc3QgdG8ganVzdCBpZ25vcmUgdGhhdCBhbnkgdGltZSBoYXMgcGFzc2VkIHRvIGF2b2lkIGZ1cnRoZXIgZnJlZXppbmdcclxuXHJcbiAgICAvLyBwaHlzaWNzIGNvbnN0YW50c1xyXG4gICAgR1JBVklUWV9TUEVFRDogbnVtYmVyID0gMC4wNDsgLy8gaW4gdW5pdHMgcGVyIHNlY29uZCB0aWNrLCBwb3NpdGl2ZSBtZWFucyBkb3dud2FyZCBncmF2aXR5LCBuZWdhdGl2ZSBtZWFucyB1cHdhcmQgZ3Jhdml0eVxyXG4gICAgRFJBR19DT0VGRklDSUVOVDogbnVtYmVyID0gMC4yMTsgLy8gYXJiaXRyYXJ5IG51bWJlciwgMCBtZWFucyBubyBkcmFnXHJcblxyXG4gICAgLy8gQ0hBUkFDVEVSIFNIT1VMRCBCRSBST1VHSExZIDEyIFBJWEVMUyBCWSAyMCBQSVhFTFNcclxuXHJcbiAgICBob3RCYXI6IEl0ZW1TdGFja1tdID0gbmV3IEFycmF5KDkpO1xyXG4gICAgc2VsZWN0ZWRTbG90ID0gMDtcclxuICAgIHBpY2tlZFVwU2xvdCA9IC0xO1xyXG5cclxuICAgIHdvcmxkTW91c2VYID0gMDsgLy8gdGhlIG1vdXNlIHBvc2l0aW9uIGluIHdvcmxkIGNvb3JkaW5hdGVzXHJcbiAgICB3b3JsZE1vdXNlWSA9IDA7IC8vIHRoZSBtb3VzZSBwb3NpdGlvbiBpbiB3b3JsZCBjb29yZGluYXRlc1xyXG4gICAgbW91c2VPbiA9IHRydWU7IC8vIGlzIHRoZSBtb3VzZSBvbiB0aGUgd2luZG93P1xyXG5cclxuICAgIGtleXM6IGJvb2xlYW5bXSA9IFtdO1xyXG5cclxuICAgIC8vIHRoZSBrZXljb2RlIGZvciB0aGUga2V5IHRoYXQgZG9lcyB0aGUgYWN0aW9uXHJcbiAgICBjb250cm9sczogQ29udHJvbFtdID0gW1xyXG4gICAgICAgIG5ldyBDb250cm9sKFwiV2FsayBSaWdodFwiLCB0cnVlLCA2OCwgKCk9PntcclxuICAgICAgICAgICAgaWYodGhpcy5jdXJyZW50VWkhPT11bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMud29ybGQucGxheWVyLnJpZ2h0QnV0dG9uID0gdHJ1ZTtcclxuICAgICAgICB9LCAoKT0+e1xyXG4gICAgICAgICAgICBpZih0aGlzLmN1cnJlbnRVaSE9PXVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy53b3JsZC5wbGF5ZXIucmlnaHRCdXR0b24gPSBmYWxzZTtcclxuICAgICAgICB9KSwvLyByaWdodFxyXG4gICAgICAgIG5ldyBDb250cm9sKFwiV2FsayBMZWZ0XCIsIHRydWUsIDY1LCAoKT0+e1xyXG4gICAgICAgICAgICBpZih0aGlzLmN1cnJlbnRVaSE9PXVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy53b3JsZC5wbGF5ZXIubGVmdEJ1dHRvbiA9IHRydWU7XHJcbiAgICAgICAgfSwgKCk9PntcclxuICAgICAgICAgICAgaWYodGhpcy5jdXJyZW50VWkhPT11bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMud29ybGQucGxheWVyLmxlZnRCdXR0b24gPSBmYWxzZTtcclxuICAgICAgICB9KSwvLyBsZWZ0XHJcbiAgICAgICAgbmV3IENvbnRyb2woXCJKdW1wXCIsIHRydWUsIDg3LCAoKT0+e1xyXG4gICAgICAgICAgICBpZih0aGlzLmN1cnJlbnRVaSE9PXVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy53b3JsZC5wbGF5ZXIuanVtcEJ1dHRvbiA9IHRydWU7XHJcbiAgICAgICAgfSwgKCk9PntcclxuICAgICAgICAgICAgaWYodGhpcy5jdXJyZW50VWkhPT11bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMud29ybGQucGxheWVyLmp1bXBCdXR0b24gPSBmYWxzZTtcclxuICAgICAgICB9KSwvLyBqdW1wXHJcbiAgICAgICAgbmV3IENvbnRyb2woXCJQYXVzZVwiLCB0cnVlLCAyNywgKCk9PntcclxuICAgICAgICAgICAgLy9pZiBpbnZlbnRvcnkgb3BlbntcclxuICAgICAgICAgICAgLy9jbG9zZSBpbnZlbnRvcnlcclxuICAgICAgICAgICAgLy9yZXR1cm47fVxyXG4gICAgICAgICAgICBpZih0aGlzLmN1cnJlbnRVaT09PXVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFVpID0gbmV3IFBhdXNlTWVudShGb250cy50aXRsZSk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFVpID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIH0pLC8vIHNldHRpbmdzXHJcbiAgICAgICAgbmV3IENvbnRyb2woXCJJbnZlbnRvcnlcIiwgdHJ1ZSwgNjksICgpPT57XHJcbiAgICAgICAgICAgIC8vaWYgdWkgb3BlbiByZXR1cm47XHJcbiAgICAgICAgICAgIC8vaWYgaW52ZW50b3J5IGNsb3NlZCBvcGVuIGludmVudG9yeVxyXG4gICAgICAgICAgICAvL2Vsc2UgY2xvc2UgaW52ZW50b3J5XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaW52ZW50b3J5IGhhcyBub3QgYmVlbiBpbXBsZW1lbnRlZCB5ZXRcIik7XHJcbiAgICAgICAgfSksLy8gaW52ZW50b3J5XHJcbiAgICAgICAgbmV3IENvbnRyb2woXCJIb3RiYXIgMVwiLCB0cnVlLCA0OSwgKCk9PntcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZFNsb3QgPSAwO1xyXG4gICAgICAgIH0pLC8vIGhvdCBiYXIgMVxyXG4gICAgICAgIG5ldyBDb250cm9sKFwiSG90YmFyIDJcIiwgdHJ1ZSwgNDksICgpPT57XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRTbG90ID0gMTtcclxuICAgICAgICB9KSwvLyBob3QgYmFyIDJcclxuICAgICAgICBuZXcgQ29udHJvbChcIkhvdGJhciAzXCIsIHRydWUsIDQ5LCAoKT0+e1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkU2xvdCA9IDI7XHJcbiAgICAgICAgfSksLy8gaG90IGJhciAzXHJcbiAgICAgICAgbmV3IENvbnRyb2woXCJIb3RiYXIgNFwiLCB0cnVlLCA0OSwgKCk9PntcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZFNsb3QgPSAzO1xyXG4gICAgICAgIH0pLC8vIGhvdCBiYXIgNFxyXG4gICAgICAgIG5ldyBDb250cm9sKFwiSG90YmFyIDVcIiwgdHJ1ZSwgNDksICgpPT57XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRTbG90ID0gNDtcclxuICAgICAgICB9KSwvLyBob3QgYmFyIDVcclxuICAgICAgICBuZXcgQ29udHJvbChcIkhvdGJhciA2XCIsIHRydWUsIDQ5LCAoKT0+e1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkU2xvdCA9IDU7XHJcbiAgICAgICAgfSksLy8gaG90IGJhciA2XHJcbiAgICAgICAgbmV3IENvbnRyb2woXCJIb3RiYXIgN1wiLCB0cnVlLCA0OSwgKCk9PntcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZFNsb3QgPSA2O1xyXG4gICAgICAgIH0pLC8vIGhvdCBiYXIgN1xyXG4gICAgICAgIG5ldyBDb250cm9sKFwiSG90YmFyIDhcIiwgdHJ1ZSwgNDksICgpPT57XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRTbG90ID0gNztcclxuICAgICAgICB9KSwvLyBob3QgYmFyIDhcclxuICAgICAgICBuZXcgQ29udHJvbChcIkhvdGJhciA5XCIsIHRydWUsIDQ5LCAoKT0+e1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkU2xvdCA9IDg7XHJcbiAgICAgICAgfSksLy8gaG90IGJhciA5XHJcbiAgICBdO1xyXG5cclxuICAgIGNhbnZhczogcDUuUmVuZGVyZXI7Ly90aGUgY2FudmFzIGZvciB0aGUgZ2FtZVxyXG4gICAgc2t5TGF5ZXI6IHA1LkdyYXBoaWNzOy8vYSBwNS5HcmFwaGljcyBvYmplY3QgdGhhdCB0aGUgc2hhZGVyIGlzIGRyYXduIG9udG8uICB0aGlzIGlzbid0IHRoZSBiZXN0IHdheSB0byBkbyB0aGlzLCBidXQgdGhlIG1haW4gZ2FtZSBjYW52YXMgaXNuJ3QgV0VCR0wsIGFuZCBpdCdzIHRvbyBtdWNoIHdvcmsgdG8gY2hhbmdlIHRoYXRcclxuICAgIHNreVNoYWRlcjogcDUuU2hhZGVyOy8vdGhlIHNoYWRlciB0aGF0IGRyYXdzIHRoZSBza3kgKHRoZSBwYXRoIGZvciB0aGlzIGlzIGluIHRoZSBwdWJsaWMgZm9sZGVyKVxyXG5cclxuICAgIHdvcmxkOiBXb3JsZDtcclxuXHJcbiAgICBjdXJyZW50VWk6IFVpU2NyZWVuIHwgdW5kZWZpbmVkO1xyXG5cclxuICAgIGNvbm5lY3Rpb246IFNvY2tldDxTZXJ2ZXJFdmVudHMsIENsaWVudEV2ZW50cz5cclxuXHJcbiAgICBuZXRNYW5hZ2VyOiBOZXRNYW5hZ2VyXHJcblxyXG4gICAgLy9jaGFuZ2VhYmxlIG9wdGlvbnMgZnJvbSBtZW51c1xyXG4gICAgc2VydmVyVmlzaWJpbGl0eTogc3RyaW5nO1xyXG4gICAgd29ybGRCdW1waW5lc3M6IG51bWJlcjtcclxuICAgIHNreU1vZDogbnVtYmVyO1xyXG4gICAgc2t5VG9nZ2xlOiBib29sZWFuO1xyXG4gICAgcGFydGljbGVNdWx0aXBsaWVyOiBudW1iZXI7XHJcblxyXG4gICAgcGFydGljbGVzOiAoQ29sb3JQYXJ0aWNsZS8qfEZvb3RzdGVwUGFydGljbGUqLylbXTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihjb25uZWN0aW9uOiBTb2NrZXQpIHtcclxuICAgICAgICBzdXBlcigoKSA9PiB7fSk7IC8vIFRvIGNyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiBwNSBpdCB3aWxsIGNhbGwgYmFjayB3aXRoIHRoZSBpbnN0YW5jZS4gV2UgZG9uJ3QgbmVlZCB0aGlzIHNpbmNlIHdlIGFyZSBleHRlbmRpbmcgdGhlIGNsYXNzXHJcbiAgICAgICAgdGhpcy5jb25uZWN0aW9uID0gY29ubmVjdGlvbjtcclxuXHJcbiAgICAgICAgLy8gSW5pdGlhbGlzZSB0aGUgbmV0d29yayBtYW5hZ2VyXHJcbiAgICAgICAgdGhpcy5uZXRNYW5hZ2VyID0gbmV3IE5ldE1hbmFnZXIodGhpcylcclxuICAgIH1cclxuXHJcbiAgICBwcmVsb2FkKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdMb2FkaW5nIGFzc2V0cycpO1xyXG4gICAgICAgIGxvYWRBc3NldHModGhpcywgVWlBc3NldHMsIEl0ZW1zQXNzZXRzLCBXb3JsZEFzc2V0cywgRm9udHMsIEF1ZGlvQXNzZXRzLCBQbGF5ZXJBbmltYXRpb25zKTtcclxuICAgICAgICBjb25zb2xlLmxvZygnQXNzZXQgbG9hZGluZyBjb21wbGV0ZWQnKTtcclxuICAgICAgICB0aGlzLnNreVNoYWRlciA9IHRoaXMubG9hZFNoYWRlcihcImFzc2V0cy9zaGFkZXJzL2Jhc2ljLnZlcnRcIiwgXCJhc3NldHMvc2hhZGVycy9za3kuZnJhZ1wiKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXR1cCgpIHtcclxuICAgICAgICAvLyBtYWtlIGEgY2FudmFzIHRoYXQgZmlsbHMgdGhlIHdob2xlIHNjcmVlbiAoYSBjYW52YXMgaXMgd2hhdCBpcyBkcmF3biB0byBpbiBwNS5qcywgYXMgd2VsbCBhcyBsb3RzIG9mIG90aGVyIEpTIHJlbmRlcmluZyBsaWJyYXJpZXMpXHJcbiAgICAgICAgdGhpcy5jYW52YXMgPSB0aGlzLmNyZWF0ZUNhbnZhcyh0aGlzLndpbmRvd1dpZHRoLCB0aGlzLndpbmRvd0hlaWdodCk7XHJcbiAgICAgICAgdGhpcy5jYW52YXMubW91c2VPdXQodGhpcy5tb3VzZUV4aXRlZCk7XHJcbiAgICAgICAgdGhpcy5jYW52YXMubW91c2VPdmVyKHRoaXMubW91c2VFbnRlcmVkKTtcclxuXHJcbiAgICAgICAgdGhpcy5za3lMYXllciA9IHRoaXMuY3JlYXRlR3JhcGhpY3ModGhpcy53aWR0aCwgdGhpcy5oZWlnaHQsIFwid2ViZ2xcIik7XHJcblxyXG4gICAgICAgIHRoaXMuY3VycmVudFVpID0gbmV3IE1haW5NZW51KEZvbnRzLnRpdGxlKTtcclxuXHJcbiAgICAgICAgLy8gVGlja1xyXG4gICAgICAgIHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMud29ybGQgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLndvcmxkLnRpY2sodGhpcyk7XHJcbiAgICAgICAgfSwgMTAwMCAvIHRoaXMubmV0TWFuYWdlci5wbGF5ZXJUaWNrUmF0ZSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5jb25uZWN0aW9uLmVtaXQoXHJcbiAgICAgICAgICAgICdqb2luJyxcclxuICAgICAgICAgICAgJ2U0MDIyZDQwM2RjYzZkMTlkNmE2OGJhM2FiZmQwYTYwJyxcclxuICAgICAgICAgICAgJ3BsYXllcicgKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDAwKVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIC8vIGdvIGZvciBhIHNjYWxlIG9mIDw2NCB0aWxlcyB3aWRlIHNjcmVlblxyXG4gICAgICAgIHRoaXMud2luZG93UmVzaXplZCgpO1xyXG5cclxuICAgICAgICAvLyByZW1vdmUgdGV4dHVyZSBpbnRlcnBvbGF0aW9uXHJcbiAgICAgICAgdGhpcy5ub1Ntb290aCgpO1xyXG5cclxuICAgICAgICAvLyB0aGUgaGlnaGVzdCBrZXljb2RlIGlzIDI1NSwgd2hpY2ggaXMgXCJUb2dnbGUgVG91Y2hwYWRcIiwgYWNjb3JkaW5nIHRvIGtleWNvZGUuaW5mb1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMjU1OyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5rZXlzLnB1c2goZmFsc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gc2V0IHRoZSBmcmFtZXJhdGUgZ29hbCB0byBhcyBoaWdoIGFzIHBvc3NpYmxlICh0aGlzIHdpbGwgZW5kIHVwIGNhcHBpbmcgdG8geW91ciBtb25pdG9yJ3MgcmVmcmVzaCByYXRlIHdpdGggdnN5bmMuKVxyXG4gICAgICAgIHRoaXMuZnJhbWVSYXRlKEluZmluaXR5KTtcclxuICAgICAgICBBdWRpb0Fzc2V0cy5tdXNpYy50aXRsZVNjcmVlbi5wbGF5U291bmQoKTtcclxuICAgICAgICB0aGlzLnBhcnRpY2xlTXVsdGlwbGllciA9IDE7XHJcbiAgICAgICAgdGhpcy5za3lUb2dnbGUgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuc2t5TW9kID0gMjtcclxuICAgICAgICB0aGlzLnBhcnRpY2xlcyA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIGRyYXcoKSB7XHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaTw0MCp0aGlzLnBhcnRpY2xlTXVsdGlwbGllcjsgaSsrKSB7XHJcbiAgICAgICAgICAgIC8vdGhpcy5wYXJ0aWNsZXMucHVzaChuZXcgQ29sb3JQYXJ0aWNsZShcIiNlYjU4MzRcIiwgMS80LCAxMCwgdGhpcy53b3JsZE1vdXNlWCtNYXRoLnJhbmRvbSgpLCB0aGlzLndvcmxkTW91c2VZK01hdGgucmFuZG9tKCksIE1hdGgucmFuZG9tKCktMC41LCBNYXRoLnJhbmRvbSgpLzQtMC41LCBmYWxzZSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5mcmFtZUNvdW50PT09Mikge1xyXG4gICAgICAgICAgICB0aGlzLnNreVNoYWRlci5zZXRVbmlmb3JtKFwic2NyZWVuRGltZW5zaW9uc1wiLCBbdGhpcy53aWR0aC90aGlzLnVwc2NhbGVTaXplLCB0aGlzLmhlaWdodC90aGlzLnVwc2NhbGVTaXplXSk7XHJcbiAgICAgICAgICAgIHRoaXMuc2t5U2hhZGVyLnNldFVuaWZvcm0oXCJza3lJbWFnZVwiLCBXb3JsZEFzc2V0cy5zaGFkZXJSZXNvdXJjZXMuc2t5SW1hZ2UuaW1hZ2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBkbyB0aGUgdGljayBjYWxjdWxhdGlvbnNcclxuICAgICAgICB0aGlzLmRvVGlja3MoKTtcclxuXHJcblxyXG4gICAgICAgIC8vIHVwZGF0ZSBtb3VzZSBwb3NpdGlvblxyXG4gICAgICAgIHRoaXMudXBkYXRlTW91c2UoKTtcclxuXHJcbiAgICAgICAgLy8gdXBkYXRlIHRoZSBjYW1lcmEncyBpbnRlcnBvbGF0aW9uXHJcbiAgICAgICAgdGhpcy5tb3ZlQ2FtZXJhKCk7XHJcblxyXG4gICAgICAgIC8vIHdpcGUgdGhlIHNjcmVlbiB3aXRoIGEgaGFwcHkgbGl0dGxlIGxheWVyIG9mIGxpZ2h0IGJsdWVcclxuICAgICAgICB0aGlzLnNreVNoYWRlci5zZXRVbmlmb3JtKFwib2Zmc2V0Q29vcmRzXCIsIFt0aGlzLmludGVycG9sYXRlZENhbVgsIHRoaXMuaW50ZXJwb2xhdGVkQ2FtWV0pO1xyXG5cdCAgICB0aGlzLnNreVNoYWRlci5zZXRVbmlmb3JtKFwibWlsbGlzXCIsIHRoaXMubWlsbGlzKCkpO1xyXG4gICAgICAgIHRoaXMuc2t5TGF5ZXIuc2hhZGVyKHRoaXMuc2t5U2hhZGVyKTtcclxuICAgICAgICAvLyB0aGlzLmZpbGwoMjU1LCAwLCAwKTtcclxuICAgICAgICB0aGlzLnNreUxheWVyLnJlY3QoMCwgMCwgdGhpcy5za3lMYXllci53aWR0aCwgdGhpcy5za3lMYXllci5oZWlnaHQpO1xyXG5cclxuICAgICAgICB0aGlzLmltYWdlKHRoaXMuc2t5TGF5ZXIsIDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMud29ybGQgIT09IHVuZGVmaW5lZCkgdGhpcy53b3JsZC5yZW5kZXIodGhpcywgdGhpcy51cHNjYWxlU2l6ZSk7XHJcblxyXG4gICAgICAgIC8vIHJlbmRlciB0aGUgcGxheWVyLCBhbGwgaXRlbXMsIGV0Yy4gIEJhc2ljYWxseSBhbnkgcGh5c2ljc1JlY3Qgb3IgcGFydGljbGVcclxuICAgICAgICB0aGlzLnJlbmRlckVudGl0aWVzKCk7XHJcblxyXG4gICAgICAgIC8vZGVsZXRlIGFueSBwYXJ0aWNsZXMgdGhhdCBoYXZlIGdvdHRlbiB0b28gb2xkXHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaTx0aGlzLnBhcnRpY2xlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZXNbaV0uYWdlPnRoaXMucGFydGljbGVzW2ldLmxpZmVzcGFuKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBhcnRpY2xlcy5zcGxpY2UoaSwgMSlcclxuICAgICAgICAgICAgICAgIGktLTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9ubyBvdXRsaW5lIG9uIHBhcnRpY2xlc1xyXG4gICAgICAgIHRoaXMubm9TdHJva2UoKTtcclxuICAgICAgICAvL2RyYXcgYWxsIG9mIHRoZSBwYXJ0aWNsZXNcclxuICAgICAgICBmb3IobGV0IHBhcnRpY2xlIG9mIHRoaXMucGFydGljbGVzKSB7XHJcbiAgICAgICAgICAgIHBhcnRpY2xlLnJlbmRlcih0aGlzLCB0aGlzLnVwc2NhbGVTaXplKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudGludCgyNTUsIDEwMCk7XHJcbiAgICAgICAgVWlBc3NldHMudmlnbmV0dGUucmVuZGVyKHRoaXMsIDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcclxuICAgICAgICB0aGlzLm5vVGludCgpO1xyXG5cclxuICAgICAgICAvLyBkcmF3IHRoZSBob3QgYmFyXHJcbiAgICAgICAgdGhpcy5ub1N0cm9rZSgpO1xyXG4gICAgICAgIHRoaXMudGV4dEFsaWduKHRoaXMuUklHSFQsIHRoaXMuQk9UVE9NKTtcclxuICAgICAgICB0aGlzLnRleHRTaXplKDUgKiB0aGlzLnVwc2NhbGVTaXplKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaG90QmFyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnNlbGVjdGVkU2xvdCA9PT0gaSkge1xyXG4gICAgICAgICAgICAgICAgVWlBc3NldHMudWlfc2xvdF9zZWxlY3RlZC5yZW5kZXIoXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcyxcclxuICAgICAgICAgICAgICAgICAgICAyICogdGhpcy51cHNjYWxlU2l6ZSArIDE2ICogaSAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgICAgICAgICAgMiAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgICAgICAgICAgMTYgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICAgICAgICAgIDE2ICogdGhpcy51cHNjYWxlU2l6ZVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIFVpQXNzZXRzLnVpX3Nsb3QucmVuZGVyKFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMsXHJcbiAgICAgICAgICAgICAgICAgICAgMiAqIHRoaXMudXBzY2FsZVNpemUgKyAxNiAqIGkgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICAgICAgICAgIDIgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICAgICAgICAgIDE2ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICAxNiAqIHRoaXMudXBzY2FsZVNpemVcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmhvdEJhcltpXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpbGwoMCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5waWNrZWRVcFNsb3QgPT09IGkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRpbnQoMjU1LCAxMjcpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmlsbCgwLCAxMjcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuaG90QmFyW2ldLnRleHR1cmUucmVuZGVyKFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMsXHJcbiAgICAgICAgICAgICAgICAgICAgNiAqIHRoaXMudXBzY2FsZVNpemUgKyAxNiAqIGkgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICAgICAgICAgIDYgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICAgICAgICAgIDggKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICAgICAgICAgIDggKiB0aGlzLnVwc2NhbGVTaXplXHJcbiAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMudGV4dChcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhvdEJhcltpXS5zdGFja1NpemUsXHJcbiAgICAgICAgICAgICAgICAgICAgMTYgKiB0aGlzLnVwc2NhbGVTaXplICsgMTYgKiBpICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICAxNiAqIHRoaXMudXBzY2FsZVNpemVcclxuICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5ub1RpbnQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gZHJhdyB0aGUgY3Vyc29yXHJcbiAgICAgICAgdGhpcy5kcmF3Q3Vyc29yKCk7XHJcblxyXG5cclxuICAgICAgICBpZih0aGlzLmN1cnJlbnRVaSAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRVaS5yZW5kZXIodGhpcywgdGhpcy51cHNjYWxlU2l6ZSk7XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUudGltZUVuZChcImZyYW1lXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHdpbmRvd1Jlc2l6ZWQoKSB7XHJcbiAgICAgICAgdGhpcy5yZXNpemVDYW52YXModGhpcy53aW5kb3dXaWR0aCwgdGhpcy53aW5kb3dIZWlnaHQpO1xyXG4gICAgICAgIHRoaXMuc2t5TGF5ZXIucmVzaXplQ2FudmFzKHRoaXMud2luZG93V2lkdGgsIHRoaXMud2luZG93SGVpZ2h0KTtcclxuICAgICAgICB0aGlzLnNreVNoYWRlci5zZXRVbmlmb3JtKFwic2NyZWVuRGltZW5zaW9uc1wiLCBbdGhpcy53aW5kb3dXaWR0aC90aGlzLnVwc2NhbGVTaXplKjIsIHRoaXMud2luZG93SGVpZ2h0L3RoaXMudXBzY2FsZVNpemUqMl0pO1xyXG5cclxuICAgICAgICAvLyBnbyBmb3IgYSBzY2FsZSBvZiA8NDggdGlsZXMgc2NyZWVuXHJcbiAgICAgICAgdGhpcy51cHNjYWxlU2l6ZSA9IE1hdGgubWluKFxyXG4gICAgICAgICAgICBNYXRoLmNlaWwodGhpcy53aW5kb3dXaWR0aCAvIDQ4IC8gdGhpcy5USUxFX1dJRFRIKSxcclxuICAgICAgICAgICAgTWF0aC5jZWlsKHRoaXMud2luZG93SGVpZ2h0IC8gNDggLyB0aGlzLlRJTEVfSEVJR0hUKVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHRoaXMuY3VycmVudFVpLndpbmRvd1VwZGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGtleVByZXNzZWQoZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcclxuICAgICAgICB0aGlzLmtleXNbdGhpcy5rZXlDb2RlXSA9IHRydWU7XHJcbiAgICAgICAgZm9yKGxldCBjb250cm9sIG9mIHRoaXMuY29udHJvbHMpIHtcclxuICAgICAgICAgICAgaWYoY29udHJvbC5rZXlib2FyZCAmJiBjb250cm9sLmtleUNvZGU9PT1ldmVudC5rZXlDb2RlKS8vZXZlbnQua2V5Q29kZSBpcyBkZXByZWNhdGVkIGJ1dCBpIGRvbid0IGNhcmVcclxuICAgICAgICAgICAgICAgIGNvbnRyb2wub25QcmVzc2VkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGtleVJlbGVhc2VkKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5rZXlzW3RoaXMua2V5Q29kZV0gPSBmYWxzZTtcclxuICAgICAgICBmb3IobGV0IGNvbnRyb2wgb2YgdGhpcy5jb250cm9scykge1xyXG4gICAgICAgICAgICBpZihjb250cm9sLmtleWJvYXJkICYmIGNvbnRyb2wua2V5Q29kZT09PWV2ZW50LmtleUNvZGUpLy9ldmVudC5rZXlDb2RlIGlzIGRlcHJlY2F0ZWQgYnV0IGkgZG9uJ3QgY2FyZVxyXG4gICAgICAgICAgICAgICAgY29udHJvbC5vblJlbGVhc2VkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIHdoZW4gaXQncyBkcmFnZ2VkIHVwZGF0ZSB0aGUgc2xpZGVyc1xyXG4gICAgbW91c2VEcmFnZ2VkKCkge1xyXG4gICAgICAgIGlmKHRoaXMuY3VycmVudFVpICE9PSB1bmRlZmluZWQgJiYgdGhpcy5jdXJyZW50VWkuc2xpZGVycyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGZvcihjb25zdCBpIG9mIHRoaXMuY3VycmVudFVpLnNsaWRlcnMpIHtcclxuICAgICAgICAgICAgICAgIGkudXBkYXRlU2xpZGVyUG9zaXRpb24odGhpcy5tb3VzZVgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG1vdXNlTW92ZWQoKSB7XHJcbiAgICAgICAgaWYodGhpcy5jdXJyZW50VWkgIT09IHVuZGVmaW5lZCAmJiB0aGlzLmN1cnJlbnRVaS5idXR0b25zICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgZm9yKGNvbnN0IGkgb2YgdGhpcy5jdXJyZW50VWkuYnV0dG9ucykge1xyXG4gICAgICAgICAgICAgICAgaS51cGRhdGVNb3VzZU92ZXIodGhpcy5tb3VzZVgsIHRoaXMubW91c2VZKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBtb3VzZVByZXNzZWQoZTogTW91c2VFdmVudCkge1xyXG4gICAgICAgIC8vIGltYWdlKHVpU2xvdEltYWdlLCAyKnVwc2NhbGVTaXplKzE2KmkqdXBzY2FsZVNpemUsIDIqdXBzY2FsZVNpemUsIDE2KnVwc2NhbGVTaXplLCAxNip1cHNjYWxlU2l6ZSk7XHJcbiAgICAgICAgaWYodGhpcy5jdXJyZW50VWkgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRVaS5tb3VzZVByZXNzZWQoZS5idXR0b24pO1xyXG4gICAgICAgICAgICByZXR1cm47Ly8gYXNqZ3NhZGtqZmdJSVNVU1VFVUVcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICB0aGlzLm1vdXNlWCA+IDIgKiB0aGlzLnVwc2NhbGVTaXplICYmXHJcbiAgICAgICAgICAgIHRoaXMubW91c2VYIDxcclxuICAgICAgICAgICAgICAgIDIgKiB0aGlzLnVwc2NhbGVTaXplICtcclxuICAgICAgICAgICAgICAgICAgICAxNiAqIHRoaXMudXBzY2FsZVNpemUgKiB0aGlzLmhvdEJhci5sZW5ndGggJiZcclxuICAgICAgICAgICAgdGhpcy5tb3VzZVkgPiAyICogdGhpcy51cHNjYWxlU2l6ZSAmJlxyXG4gICAgICAgICAgICB0aGlzLm1vdXNlWSA8IDE4ICogdGhpcy51cHNjYWxlU2l6ZVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICBjb25zdCBjbGlja2VkU2xvdDogbnVtYmVyID0gTWF0aC5mbG9vcihcclxuICAgICAgICAgICAgICAgICh0aGlzLm1vdXNlWCAtIDIgKiB0aGlzLnVwc2NhbGVTaXplKSAvIDE2IC8gdGhpcy51cHNjYWxlU2l6ZVxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMucGlja2VkVXBTbG90ID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaG90QmFyW2NsaWNrZWRTbG90XSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5waWNrZWRVcFNsb3QgPSBjbGlja2VkU2xvdDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIFN3YXAgY2xpY2tlZCBzbG90IHdpdGggdGhlIHBpY2tlZCBzbG90XHJcbiAgICAgICAgICAgICAgICBbdGhpcy5ob3RCYXJbdGhpcy5waWNrZWRVcFNsb3RdLCB0aGlzLmhvdEJhcltjbGlja2VkU2xvdF1dID0gW1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaG90QmFyW2NsaWNrZWRTbG90XSxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhvdEJhclt0aGlzLnBpY2tlZFVwU2xvdF0sXHJcbiAgICAgICAgICAgICAgICBdO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFNldCB0aGUgcGlja2VkIHVwIHNsb3QgdG8gbm90aGluZ1xyXG4gICAgICAgICAgICAgICAgdGhpcy5waWNrZWRVcFNsb3QgPSAtMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIElmIHRoZSB0aWxlcyBpcyBhaXJcclxuICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgdGhpcy53b3JsZC53b3JsZFRpbGVzW1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMud29ybGQud2lkdGggKiB0aGlzLndvcmxkTW91c2VZICsgdGhpcy53b3JsZE1vdXNlWFxyXG4gICAgICAgICAgICAgICAgXSA9PT0gMFxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBmb3IobGV0IGkgPSAwOyBpPDEwKnRoaXMucGFydGljbGVNdWx0aXBsaWVyOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBpZHg6IG51bWJlciA9IHRoaXMud29ybGQud2lkdGggKiB0aGlzLndvcmxkTW91c2VZICsgdGhpcy53b3JsZE1vdXNlWDtcclxuICAgICAgICAgICAgICAgIGxldCB0aWxlOiBUaWxlVHlwZSA9IHRoaXMud29ybGQud29ybGRUaWxlc1tpZHhdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wYXJ0aWNsZXMucHVzaChuZXcgQ29sb3JQYXJ0aWNsZShXb3JsZFRpbGVzW3RpbGVdLmNvbG9yLCAxLzQqTWF0aC5yYW5kb20oKSwgMTUsIHRoaXMud29ybGRNb3VzZVgrMC41LCB0aGlzLndvcmxkTW91c2VZKzAuNSwgKE1hdGgucmFuZG9tKCktMC41KS81LCAtTWF0aC5yYW5kb20oKS81LCB0cnVlKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5jb25uZWN0aW9uLmVtaXQoXHJcbiAgICAgICAgICAgICAgICAnd29ybGRCcmVha1N0YXJ0JyxcclxuICAgICAgICAgICAgICAgIHRoaXMud29ybGQud2lkdGggKiB0aGlzLndvcmxkTW91c2VZICsgdGhpcy53b3JsZE1vdXNlWFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB0aGlzLmNvbm5lY3Rpb24uZW1pdCgnd29ybGRCcmVha0ZpbmlzaCcpO1xyXG4gICAgICAgICAgICB0aGlzLnNjcmVlbnNoYWtlQW1vdW50ID0gMC41O1xyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICBjb25zdCB0aWxlczogVGlsZSA9XHJcbiAgICAgICAgICAgICAgICBXb3JsZFRpbGVzW1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMud29ybGQud29ybGRUaWxlc1tcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5XT1JMRF9XSURUSCAqIHRoaXMud29ybGRNb3VzZVkgKyB0aGlzLndvcmxkTW91c2VYXHJcbiAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgXTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aWxlcyA9PT0gdW5kZWZpbmVkKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBpZiAodGlsZXMuaXRlbURyb3AgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgLy8gRGVmYXVsdCBkcm9wIHF1YW50aXR5XHJcbiAgICAgICAgICAgICAgICBsZXQgcXVhbnRpdHk6IG51bWJlciA9IDE7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gVXBkYXRlIHRoZSBxdWFudGl0eSBiYXNlZCBvblxyXG4gICAgICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgICAgIHRpbGVzLml0ZW1Ecm9wTWF4ICE9PSB1bmRlZmluZWQgJiZcclxuICAgICAgICAgICAgICAgICAgICB0aWxlcy5pdGVtRHJvcE1pbiAhPT0gdW5kZWZpbmVkXHJcbiAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICBxdWFudGl0eSA9IE1hdGgucm91bmQoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIE1hdGgucmFuZG9tKCkgKiAodGlsZXMuaXRlbURyb3BNYXggLSB0aWxlcy5pdGVtRHJvcE1pbikgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlsZXMuaXRlbURyb3BNaW5cclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aWxlcy5pdGVtRHJvcE1heCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcXVhbnRpdHkgPSB0aWxlcy5pdGVtRHJvcE1heDtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRyb3BJdGVtU3RhY2soXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IEl0ZW1TdGFjayh0aWxlcy5pdGVtRHJvcCwgcXVhbnRpdHkpLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMud29ybGRNb3VzZVgsXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53b3JsZE1vdXNlWVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcblxyXG4gICAgICAgICAgICAqL1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBtb3VzZVJlbGVhc2VkKCkge1xyXG4gICAgICAgIGlmKHRoaXMuY3VycmVudFVpICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50VWkubW91c2VSZWxlYXNlZCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCByZWxlYXNlZFNsb3Q6IG51bWJlciA9IE1hdGguZmxvb3IoXHJcbiAgICAgICAgICAgICh0aGlzLm1vdXNlWCAtIDIgKiB0aGlzLnVwc2NhbGVTaXplKSAvIDE2IC8gdGhpcy51cHNjYWxlU2l6ZVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnBpY2tlZFVwU2xvdCAhPT0gLTEpIHtcclxuICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tb3VzZVggPiAyICogdGhpcy51cHNjYWxlU2l6ZSAmJlxyXG4gICAgICAgICAgICAgICAgdGhpcy5tb3VzZVggPFxyXG4gICAgICAgICAgICAgICAgICAgIDIgKiB0aGlzLnVwc2NhbGVTaXplICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgMTYgKiB0aGlzLnVwc2NhbGVTaXplICogdGhpcy5ob3RCYXIubGVuZ3RoICYmXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vdXNlWSA+IDIgKiB0aGlzLnVwc2NhbGVTaXplICYmXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vdXNlWSA8IDE4ICogdGhpcy51cHNjYWxlU2l6ZVxyXG4gICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgIC8vIE1ha2Ugc3VyZSB0aGF0IHRoZSBzbG90IHRoYXQgdGhlIGN1cnNvciB3YXMgcmVsZWFzZWQgd2FzIG5vdCB0aGUgc2xvdCB0aGF0IHdhcyBzZWxlY3RlZFxyXG4gICAgICAgICAgICAgICAgaWYgKHJlbGVhc2VkU2xvdCA9PT0gdGhpcy5waWNrZWRVcFNsb3QpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBTd2FwIHRoZSBwaWNrZWQgdXAgc2xvdCB3aXRoIHRoZSBzbG90IHRoZSBtb3VzZSB3YXMgcmVsZWFzZWQgb25cclxuICAgICAgICAgICAgICAgIFt0aGlzLmhvdEJhclt0aGlzLnBpY2tlZFVwU2xvdF0sIHRoaXMuaG90QmFyW3JlbGVhc2VkU2xvdF1dID0gW1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaG90QmFyW3JlbGVhc2VkU2xvdF0sXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ob3RCYXJbdGhpcy5waWNrZWRVcFNsb3RdLFxyXG4gICAgICAgICAgICAgICAgXTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnBpY2tlZFVwU2xvdCA9IC0xO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ob3RCYXJbdGhpcy5waWNrZWRVcFNsb3RdID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5waWNrZWRVcFNsb3QgPSAtMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBtb3ZlQ2FtZXJhKCkge1xyXG4gICAgICAgIHRoaXMuaW50ZXJwb2xhdGVkQ2FtWCA9XHJcbiAgICAgICAgICAgIHRoaXMucENhbVggKyAodGhpcy5jYW1YIC0gdGhpcy5wQ2FtWCkgKiB0aGlzLmFtb3VudFNpbmNlTGFzdFRpY2sgKyAodGhpcy5ub2lzZSh0aGlzLm1pbGxpcygpLzIwMCktMC41KSp0aGlzLnNjcmVlbnNoYWtlQW1vdW50O1xyXG4gICAgICAgIHRoaXMuaW50ZXJwb2xhdGVkQ2FtWSA9XHJcbiAgICAgICAgICAgIHRoaXMucENhbVkgKyAodGhpcy5jYW1ZIC0gdGhpcy5wQ2FtWSkgKiB0aGlzLmFtb3VudFNpbmNlTGFzdFRpY2sgKyAodGhpcy5ub2lzZSgwLCB0aGlzLm1pbGxpcygpLzIwMCktMC41KSp0aGlzLnNjcmVlbnNoYWtlQW1vdW50O1xyXG4gICAgfVxyXG5cclxuICAgIGRvVGlja3MoKSB7XHJcbiAgICAgICAgLy8gaW5jcmVhc2UgdGhlIHRpbWUgc2luY2UgYSB0aWNrIGhhcyBoYXBwZW5lZCBieSBkZWx0YVRpbWUsIHdoaWNoIGlzIGEgYnVpbHQtaW4gcDUuanMgdmFsdWVcclxuICAgICAgICB0aGlzLm1zU2luY2VUaWNrICs9IHRoaXMuZGVsdGFUaW1lO1xyXG5cclxuICAgICAgICAvLyBkZWZpbmUgYSB0ZW1wb3JhcnkgdmFyaWFibGUgY2FsbGVkIHRpY2tzVGhpc0ZyYW1lIC0gdGhpcyBpcyB1c2VkIHRvIGtlZXAgdHJhY2sgb2YgaG93IG1hbnkgdGlja3MgaGF2ZSBiZWVuIGNhbGN1bGF0ZWQgd2l0aGluIHRoZSBkdXJhdGlvbiBvZiB0aGUgY3VycmVudCBmcmFtZS4gIEFzIGxvbmcgYXMgdGhpcyB2YWx1ZSBpcyBsZXNzIHRoYW4gdGhlIGZvcmdpdmVuZXNzQ291bnQgdmFyaWFibGUsIGl0IGNvbnRpbnVlcyB0byBjYWxjdWxhdGUgdGlja3MgYXMgbmVjZXNzYXJ5LlxyXG4gICAgICAgIGxldCB0aWNrc1RoaXNGcmFtZSA9IDA7XHJcbiAgICAgICAgd2hpbGUgKFxyXG4gICAgICAgICAgICB0aGlzLm1zU2luY2VUaWNrID4gdGhpcy5tc1BlclRpY2sgJiZcclxuICAgICAgICAgICAgdGlja3NUaGlzRnJhbWUgIT09IHRoaXMuZm9yZ2l2ZW5lc3NDb3VudFxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLnRpbWUoXCJ0aWNrXCIpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy53b3JsZCAhPT0gdW5kZWZpbmVkKSB0aGlzLmRvVGljaygpO1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLnRpbWVFbmQoXCJ0aWNrXCIpO1xyXG4gICAgICAgICAgICB0aGlzLm1zU2luY2VUaWNrIC09IHRoaXMubXNQZXJUaWNrO1xyXG4gICAgICAgICAgICB0aWNrc1RoaXNGcmFtZSsrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGlja3NUaGlzRnJhbWUgPT09IHRoaXMuZm9yZ2l2ZW5lc3NDb3VudCkge1xyXG4gICAgICAgICAgICB0aGlzLm1zU2luY2VUaWNrID0gMDtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKFxyXG4gICAgICAgICAgICAgICAgXCJsYWcgc3Bpa2UgZGV0ZWN0ZWQsIHRpY2sgY2FsY3VsYXRpb25zIGNvdWxkbid0IGtlZXAgdXBcIlxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmFtb3VudFNpbmNlTGFzdFRpY2sgPSB0aGlzLm1zU2luY2VUaWNrIC8gdGhpcy5tc1BlclRpY2s7XHJcbiAgICB9XHJcblxyXG4gICAgZG9UaWNrKCkge1xyXG4gICAgICAgIGZvcihsZXQgcGFydGljbGUgb2YgdGhpcy5wYXJ0aWNsZXMpIHtcclxuICAgICAgICAgICAgcGFydGljbGUudGljaygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLndvcmxkLnBsYXllciA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICB0aGlzLndvcmxkLnBsYXllci5rZXlib2FyZElucHV0KCk7XHJcbiAgICAgICAgdGhpcy53b3JsZC5wbGF5ZXIuYXBwbHlHcmF2aXR5QW5kRHJhZygpO1xyXG4gICAgICAgIHRoaXMud29ybGQucGxheWVyLmFwcGx5VmVsb2NpdHlBbmRDb2xsaWRlKCk7XHJcblxyXG4gICAgICAgIHRoaXMucENhbVggPSB0aGlzLmNhbVg7XHJcbiAgICAgICAgdGhpcy5wQ2FtWSA9IHRoaXMuY2FtWTtcclxuICAgICAgICB0aGlzLmRlc2lyZWRDYW1YID1cclxuICAgICAgICAgICAgdGhpcy53b3JsZC5wbGF5ZXIueCArXHJcbiAgICAgICAgICAgIHRoaXMud29ybGQucGxheWVyLndpZHRoIC8gMiAtXHJcbiAgICAgICAgICAgIHRoaXMud2lkdGggLyAyIC8gdGhpcy5USUxFX1dJRFRIIC8gdGhpcy51cHNjYWxlU2l6ZSArXHJcbiAgICAgICAgICAgIHRoaXMud29ybGQucGxheWVyLnhWZWwgKiA0MDtcclxuICAgICAgICB0aGlzLmRlc2lyZWRDYW1ZID1cclxuICAgICAgICAgICAgdGhpcy53b3JsZC5wbGF5ZXIueSArXHJcbiAgICAgICAgICAgIHRoaXMud29ybGQucGxheWVyLmhlaWdodC8yIC1cclxuICAgICAgICAgICAgdGhpcy5oZWlnaHQgLyAyIC8gdGhpcy5USUxFX0hFSUdIVCAvIHRoaXMudXBzY2FsZVNpemUgK1xyXG4gICAgICAgICAgICB0aGlzLndvcmxkLnBsYXllci55VmVsICogMjA7XHJcbiAgICAgICAgdGhpcy5jYW1YID0gKHRoaXMuZGVzaXJlZENhbVggKyB0aGlzLmNhbVggKiAyNCkgLyAyNTtcclxuICAgICAgICB0aGlzLmNhbVkgPSAodGhpcy5kZXNpcmVkQ2FtWSArIHRoaXMuY2FtWSAqIDI0KSAvIDI1O1xyXG5cclxuICAgICAgICB0aGlzLnNjcmVlbnNoYWtlQW1vdW50ICo9IDAuODtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY2FtWCA8IDApIHtcclxuICAgICAgICAgICAgdGhpcy5jYW1YID0gMDtcclxuICAgICAgICB9IGVsc2UgaWYgKFxyXG4gICAgICAgICAgICB0aGlzLmNhbVggPlxyXG4gICAgICAgICAgICB0aGlzLndvcmxkV2lkdGggLSB0aGlzLndpZHRoIC8gdGhpcy51cHNjYWxlU2l6ZSAvIHRoaXMuVElMRV9XSURUSFxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICB0aGlzLmNhbVggPVxyXG4gICAgICAgICAgICAgICAgdGhpcy53b3JsZFdpZHRoIC1cclxuICAgICAgICAgICAgICAgIHRoaXMud2lkdGggLyB0aGlzLnVwc2NhbGVTaXplIC8gdGhpcy5USUxFX1dJRFRIO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgIHRoaXMuY2FtWSA+XHJcbiAgICAgICAgICAgIHRoaXMud29ybGRIZWlnaHQgLVxyXG4gICAgICAgICAgICAgICAgdGhpcy5oZWlnaHQgLyB0aGlzLnVwc2NhbGVTaXplIC8gdGhpcy5USUxFX0hFSUdIVFxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICB0aGlzLmNhbVkgPVxyXG4gICAgICAgICAgICAgICAgdGhpcy53b3JsZEhlaWdodCAtXHJcbiAgICAgICAgICAgICAgICB0aGlzLmhlaWdodCAvIHRoaXMudXBzY2FsZVNpemUgLyB0aGlzLlRJTEVfSEVJR0hUO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIC8vIGZvciAoY29uc3QgaXRlbSBvZiB0aGlzLml0ZW1zKSB7XHJcbiAgICAgICAgLy8gICAgIGl0ZW0uZ29Ub3dhcmRzUGxheWVyKCk7XHJcbiAgICAgICAgLy8gICAgIGl0ZW0uY29tYmluZVdpdGhOZWFySXRlbXMoKTtcclxuICAgICAgICAvLyAgICAgaXRlbS5hcHBseUdyYXZpdHlBbmREcmFnKCk7XHJcbiAgICAgICAgLy8gICAgIGl0ZW0uYXBwbHlWZWxvY2l0eUFuZENvbGxpZGUoKTtcclxuICAgICAgICAvLyB9XHJcbiAgICAgICAgLy9cclxuICAgICAgICAvLyBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaXRlbXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAvLyAgICAgaWYgKHRoaXMuaXRlbXNbaV0uZGVsZXRlZCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgIC8vICAgICAgICAgdGhpcy5pdGVtcy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgLy8gICAgICAgICBpLS07XHJcbiAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAvLyB9XHJcbiAgICB9XHJcblxyXG4gICAgdWlGcmFtZVJlY3QoeDogbnVtYmVyLCB5OiBudW1iZXIsIHc6IG51bWJlciwgaDogbnVtYmVyKSB7XHJcbiAgICAgICAgLy8gc2V0IHRoZSBjb29yZHMgYW5kIGRpbWVuc2lvbnMgdG8gcm91bmQgdG8gdGhlIG5lYXJlc3QgdW4tdXBzY2FsZWQgcGl4ZWxcclxuICAgICAgICB4ID0gTWF0aC5yb3VuZCh4IC8gdGhpcy51cHNjYWxlU2l6ZSkgKiB0aGlzLnVwc2NhbGVTaXplO1xyXG4gICAgICAgIHkgPSBNYXRoLnJvdW5kKHkgLyB0aGlzLnVwc2NhbGVTaXplKSAqIHRoaXMudXBzY2FsZVNpemU7XHJcbiAgICAgICAgdyA9IE1hdGgucm91bmQodyAvIHRoaXMudXBzY2FsZVNpemUpICogdGhpcy51cHNjYWxlU2l6ZTtcclxuICAgICAgICBoID0gTWF0aC5yb3VuZChoIC8gdGhpcy51cHNjYWxlU2l6ZSkgKiB0aGlzLnVwc2NhbGVTaXplO1xyXG5cclxuICAgICAgICAvLyBjb3JuZXJzXHJcbiAgICAgICAgVWlBc3NldHMudWlfZnJhbWUucmVuZGVyUGFydGlhbChcclxuICAgICAgICAgICAgdGhpcyxcclxuICAgICAgICAgICAgeCxcclxuICAgICAgICAgICAgeSxcclxuICAgICAgICAgICAgNyAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICA3LFxyXG4gICAgICAgICAgICA3XHJcbiAgICAgICAgKTtcclxuICAgICAgICBVaUFzc2V0cy51aV9mcmFtZS5yZW5kZXJQYXJ0aWFsKFxyXG4gICAgICAgICAgICB0aGlzLFxyXG4gICAgICAgICAgICB4ICsgdyAtIDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICB5LFxyXG4gICAgICAgICAgICA3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgNyAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIDgsXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIDcsXHJcbiAgICAgICAgICAgIDdcclxuICAgICAgICApO1xyXG4gICAgICAgIFVpQXNzZXRzLnVpX2ZyYW1lLnJlbmRlclBhcnRpYWwoXHJcbiAgICAgICAgICAgIHRoaXMsXHJcbiAgICAgICAgICAgIHgsXHJcbiAgICAgICAgICAgIHkgKyBoIC0gNyAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICA3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgOCxcclxuICAgICAgICAgICAgNyxcclxuICAgICAgICAgICAgN1xyXG4gICAgICAgICk7XHJcbiAgICAgICAgVWlBc3NldHMudWlfZnJhbWUucmVuZGVyUGFydGlhbChcclxuICAgICAgICAgICAgdGhpcyxcclxuICAgICAgICAgICAgeCArIHcgLSA3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgeSArIGggLSA3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgNyAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICA4LFxyXG4gICAgICAgICAgICA4LFxyXG4gICAgICAgICAgICA3LFxyXG4gICAgICAgICAgICA3XHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgLy8gdG9wIGFuZCBib3R0b21cclxuICAgICAgICBVaUFzc2V0cy51aV9mcmFtZS5yZW5kZXJQYXJ0aWFsKFxyXG4gICAgICAgICAgICB0aGlzLFxyXG4gICAgICAgICAgICB4ICsgNyAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIHksXHJcbiAgICAgICAgICAgIHcgLSAxNCAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICA3LFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICAxLFxyXG4gICAgICAgICAgICA3XHJcbiAgICAgICAgKTtcclxuICAgICAgICBVaUFzc2V0cy51aV9mcmFtZS5yZW5kZXJQYXJ0aWFsKFxyXG4gICAgICAgICAgICB0aGlzLFxyXG4gICAgICAgICAgICB4ICsgNyAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIHkgKyBoIC0gNyAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIHcgLSAxNCAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICA3LFxyXG4gICAgICAgICAgICA4LFxyXG4gICAgICAgICAgICAxLFxyXG4gICAgICAgICAgICA3XHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgLy8gbGVmdCBhbmQgcmlnaHRcclxuICAgICAgICBVaUFzc2V0cy51aV9mcmFtZS5yZW5kZXJQYXJ0aWFsKFxyXG4gICAgICAgICAgICB0aGlzLFxyXG4gICAgICAgICAgICB4LFxyXG4gICAgICAgICAgICB5ICsgNyAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICBoIC0gMTQgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICA3LFxyXG4gICAgICAgICAgICA3LFxyXG4gICAgICAgICAgICAxXHJcbiAgICAgICAgKTtcclxuICAgICAgICBVaUFzc2V0cy51aV9mcmFtZS5yZW5kZXJQYXJ0aWFsKFxyXG4gICAgICAgICAgICB0aGlzLFxyXG4gICAgICAgICAgICB4ICsgdyAtIDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICB5ICsgNyAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICBoIC0gMTQgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICA4LFxyXG4gICAgICAgICAgICA3LFxyXG4gICAgICAgICAgICA3LFxyXG4gICAgICAgICAgICAxXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgLy8gY2VudGVyXHJcbiAgICAgICAgVWlBc3NldHMudWlfZnJhbWUucmVuZGVyUGFydGlhbChcclxuICAgICAgICAgICAgdGhpcyxcclxuICAgICAgICAgICAgeCArIDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICB5ICsgNyAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIHcgLSAxNCAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIGggLSAxNCAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIDcsXHJcbiAgICAgICAgICAgIDcsXHJcbiAgICAgICAgICAgIDEsXHJcbiAgICAgICAgICAgIDFcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgIC8kJCQkJCQkICAvJCQgICAgICAgICAgICAgICAgICAgICAgICAgICAvJCRcclxuICB8ICQkX18gICQkfCAkJCAgICAgICAgICAgICAgICAgICAgICAgICAgfF9fL1xyXG4gIHwgJCQgIFxcICQkfCAkJCQkJCQkICAvJCQgICAvJCQgIC8kJCQkJCQkIC8kJCAgLyQkJCQkJCQgIC8kJCQkJCQkIC8kJFxyXG4gIHwgJCQkJCQkJC98ICQkX18gICQkfCAkJCAgfCAkJCAvJCRfX19fXy98ICQkIC8kJF9fX19fLyAvJCRfX19fXy98X18vXHJcbiAgfCAkJF9fX18vIHwgJCQgIFxcICQkfCAkJCAgfCAkJHwgICQkJCQkJCB8ICQkfCAkJCAgICAgIHwgICQkJCQkJFxyXG4gIHwgJCQgICAgICB8ICQkICB8ICQkfCAkJCAgfCAkJCBcXF9fX18gICQkfCAkJHwgJCQgICAgICAgXFxfX19fICAkJCAvJCRcclxuICB8ICQkICAgICAgfCAkJCAgfCAkJHwgICQkJCQkJCQgLyQkJCQkJCQvfCAkJHwgICQkJCQkJCQgLyQkJCQkJCQvfF9fL1xyXG4gIHxfXy8gICAgICB8X18vICB8X18vIFxcX19fXyAgJCR8X19fX19fXy8gfF9fLyBcXF9fX19fX18vfF9fX19fX18vXHJcbiAgICAgICAgICAgICAgICAgICAgICAgLyQkICB8ICQkXHJcbiAgICAgICAgICAgICAgICAgICAgICB8ICAkJCQkJCQvXHJcbiAgICAgICAgICAgICAgICAgICAgICAgXFxfX19fX18vXHJcbiAgKi9cclxuXHJcbiAgICAvLyB0aGlzIGNsYXNzIGhvbGRzIGFuIGF4aXMtYWxpZ25lZCByZWN0YW5nbGUgYWZmZWN0ZWQgYnkgZ3Jhdml0eSwgZHJhZywgYW5kIGNvbGxpc2lvbnMgd2l0aCB0aWxlcy5cclxuXHJcbiAgICByZWN0VnNSYXkoXHJcbiAgICAgICAgcmVjdFg/OiBhbnksXHJcbiAgICAgICAgcmVjdFk/OiBhbnksXHJcbiAgICAgICAgcmVjdFc/OiBhbnksXHJcbiAgICAgICAgcmVjdEg/OiBhbnksXHJcbiAgICAgICAgcmF5WD86IGFueSxcclxuICAgICAgICByYXlZPzogYW55LFxyXG4gICAgICAgIHJheVc/OiBhbnksXHJcbiAgICAgICAgcmF5SD86IGFueVxyXG4gICAgKSB7XHJcbiAgICAgICAgLy8gdGhpcyByYXkgaXMgYWN0dWFsbHkgYSBsaW5lIHNlZ21lbnQgbWF0aGVtYXRpY2FsbHksIGJ1dCBpdCdzIGNvbW1vbiB0byBzZWUgcGVvcGxlIHJlZmVyIHRvIHNpbWlsYXIgY2hlY2tzIGFzIHJheS1jYXN0cywgc28gZm9yIHRoZSBkdXJhdGlvbiBvZiB0aGUgZGVmaW5pdGlvbiBvZiB0aGlzIGZ1bmN0aW9uLCByYXkgY2FuIGJlIGFzc3VtZWQgdG8gbWVhbiB0aGUgc2FtZSBhcyBsaW5lIHNlZ21lbnQuXHJcblxyXG4gICAgICAgIC8vIGlmIHRoZSByYXkgZG9lc24ndCBoYXZlIGEgbGVuZ3RoLCB0aGVuIGl0IGNhbid0IGhhdmUgZW50ZXJlZCB0aGUgcmVjdGFuZ2xlLiAgVGhpcyBhc3N1bWVzIHRoYXQgdGhlIG9iamVjdHMgZG9uJ3Qgc3RhcnQgaW4gY29sbGlzaW9uLCBvdGhlcndpc2UgdGhleSdsbCBiZWhhdmUgc3RyYW5nZWx5XHJcbiAgICAgICAgaWYgKHJheVcgPT09IDAgJiYgcmF5SCA9PT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBjYWxjdWxhdGUgaG93IGZhciBhbG9uZyB0aGUgcmF5IGVhY2ggc2lkZSBvZiB0aGUgcmVjdGFuZ2xlIGludGVyc2VjdHMgd2l0aCBpdCAoZWFjaCBzaWRlIGlzIGV4dGVuZGVkIG91dCBpbmZpbml0ZWx5IGluIGJvdGggZGlyZWN0aW9ucylcclxuICAgICAgICBjb25zdCB0b3BJbnRlcnNlY3Rpb24gPSAocmVjdFkgLSByYXlZKSAvIHJheUg7XHJcbiAgICAgICAgY29uc3QgYm90dG9tSW50ZXJzZWN0aW9uID0gKHJlY3RZICsgcmVjdEggLSByYXlZKSAvIHJheUg7XHJcbiAgICAgICAgY29uc3QgbGVmdEludGVyc2VjdGlvbiA9IChyZWN0WCAtIHJheVgpIC8gcmF5VztcclxuICAgICAgICBjb25zdCByaWdodEludGVyc2VjdGlvbiA9IChyZWN0WCArIHJlY3RXIC0gcmF5WCkgLyByYXlXO1xyXG5cclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgIGlzTmFOKHRvcEludGVyc2VjdGlvbikgfHxcclxuICAgICAgICAgICAgaXNOYU4oYm90dG9tSW50ZXJzZWN0aW9uKSB8fFxyXG4gICAgICAgICAgICBpc05hTihsZWZ0SW50ZXJzZWN0aW9uKSB8fFxyXG4gICAgICAgICAgICBpc05hTihyaWdodEludGVyc2VjdGlvbilcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgLy8geW91IGhhdmUgdG8gdXNlIHRoZSBKUyBmdW5jdGlvbiBpc05hTigpIHRvIGNoZWNrIGlmIGEgdmFsdWUgaXMgTmFOIGJlY2F1c2UgYm90aCBOYU49PU5hTiBhbmQgTmFOPT09TmFOIGFyZSBmYWxzZS5cclxuICAgICAgICAgICAgLy8gaWYgYW55IG9mIHRoZXNlIHZhbHVlcyBhcmUgTmFOLCBubyBjb2xsaXNpb24gaGFzIG9jY3VycmVkXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGNhbGN1bGF0ZSB0aGUgbmVhcmVzdCBhbmQgZmFydGhlc3QgaW50ZXJzZWN0aW9ucyBmb3IgYm90aCB4IGFuZCB5XHJcbiAgICAgICAgY29uc3QgbmVhclggPSB0aGlzLm1pbihsZWZ0SW50ZXJzZWN0aW9uLCByaWdodEludGVyc2VjdGlvbik7XHJcbiAgICAgICAgY29uc3QgZmFyWCA9IHRoaXMubWF4KGxlZnRJbnRlcnNlY3Rpb24sIHJpZ2h0SW50ZXJzZWN0aW9uKTtcclxuICAgICAgICBjb25zdCBuZWFyWSA9IHRoaXMubWluKHRvcEludGVyc2VjdGlvbiwgYm90dG9tSW50ZXJzZWN0aW9uKTtcclxuICAgICAgICBjb25zdCBmYXJZID0gdGhpcy5tYXgodG9wSW50ZXJzZWN0aW9uLCBib3R0b21JbnRlcnNlY3Rpb24pO1xyXG5cclxuICAgICAgICBpZiAobmVhclggPiBmYXJZIHx8IG5lYXJZID4gZmFyWCkge1xyXG4gICAgICAgICAgICAvLyB0aGlzIG11c3QgbWVhbiB0aGF0IHRoZSBsaW5lIHRoYXQgbWFrZXMgdXAgdGhlIGxpbmUgc2VnbWVudCBkb2Vzbid0IHBhc3MgdGhyb3VnaCB0aGUgcmF5XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChmYXJYIDwgMCB8fCBmYXJZIDwgMCkge1xyXG4gICAgICAgICAgICAvLyB0aGUgaW50ZXJzZWN0aW9uIGlzIGhhcHBlbmluZyBiZWZvcmUgdGhlIHJheSBzdGFydHMsIHNvIHRoZSByYXkgaXMgcG9pbnRpbmcgYXdheSBmcm9tIHRoZSB0cmlhbmdsZVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBjYWxjdWxhdGUgd2hlcmUgdGhlIHBvdGVudGlhbCBjb2xsaXNpb24gY291bGQgYmVcclxuICAgICAgICBjb25zdCBuZWFyQ29sbGlzaW9uUG9pbnQgPSB0aGlzLm1heChuZWFyWCwgbmVhclkpO1xyXG5cclxuICAgICAgICBpZiAobmVhclggPiAxIHx8IG5lYXJZID4gMSkge1xyXG4gICAgICAgICAgICAvLyB0aGUgaW50ZXJzZWN0aW9uIGhhcHBlbnMgYWZ0ZXIgdGhlIHJheShsaW5lIHNlZ21lbnQpIGVuZHNcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG5lYXJYID09PSBuZWFyQ29sbGlzaW9uUG9pbnQpIHtcclxuICAgICAgICAgICAgLy8gaXQgbXVzdCBoYXZlIGNvbGxpZGVkIG9uIGVpdGhlciB0aGUgbGVmdCBvciB0aGUgcmlnaHQhIG5vdyB3aGljaD9cclxuICAgICAgICAgICAgaWYgKGxlZnRJbnRlcnNlY3Rpb24gPT09IG5lYXJYKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBJdCBtdXN0IGhhdmUgY29sbGlkZWQgb24gdGhlIGxlZnQhICBSZXR1cm4gdGhlIGNvbGxpc2lvbiBub3JtYWwgWy0xLCAwXVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFstMSwgMCwgbmVhckNvbGxpc2lvblBvaW50XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBJZiBpdCBkaWRuJ3QgY29sbGlkZSBvbiB0aGUgbGVmdCwgaXQgbXVzdCBoYXZlIGNvbGxpZGVkIG9uIHRoZSByaWdodC4gIFJldHVybiB0aGUgY29sbGlzaW9uIG5vcm1hbCBbMSwgMF1cclxuICAgICAgICAgICAgcmV0dXJuIFsxLCAwLCBuZWFyQ29sbGlzaW9uUG9pbnRdO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBJZiBpdCBkaWRuJ3QgY29sbGlkZSBvbiB0aGUgbGVmdCBvciByaWdodCwgaXQgbXVzdCBoYXZlIGNvbGxpZGVkIG9uIGVpdGhlciB0aGUgdG9wIG9yIHRoZSBib3R0b20hIG5vdyB3aGljaD9cclxuICAgICAgICBpZiAodG9wSW50ZXJzZWN0aW9uID09PSBuZWFyWSkge1xyXG4gICAgICAgICAgICAvLyBJdCBtdXN0IGhhdmUgY29sbGlkZWQgb24gdGhlIHRvcCEgIFJldHVybiB0aGUgY29sbGlzaW9uIG5vcm1hbCBbMCwgLTFdXHJcbiAgICAgICAgICAgIHJldHVybiBbMCwgLTEsIG5lYXJDb2xsaXNpb25Qb2ludF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIElmIGl0IGRpZG4ndCBjb2xsaWRlIG9uIHRoZSB0b3AsIGl0IG11c3QgaGF2ZSBjb2xsaWRlZCBvbiB0aGUgYm90dG9tLiAgUmV0dXJuIHRoZSBjb2xsaXNpb24gbm9ybWFsIFswLCAxXVxyXG4gICAgICAgIHJldHVybiBbMCwgMSwgbmVhckNvbGxpc2lvblBvaW50XTtcclxuXHJcbiAgICAgICAgLy8gb3V0cHV0IGlmIG5vIGNvbGxpc2lvbjogZmFsc2VcclxuICAgICAgICAvLyBvdXRwdXQgaWYgY29sbGlzaW9uOiBbY29sbGlzaW9uIG5vcm1hbCBYLCBjb2xsaXNpb24gbm9ybWFsIFksIG5lYXJDb2xsaXNpb25Qb2ludF1cclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAtMSB0byAxICAgICAgICAgICAgICAtMSB0byAxICAgICAgICAgICAgMCB0byAxXHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyRW50aXRpZXMoKSB7XHJcbiAgICAgICAgLy8gZHJhdyBwbGF5ZXJcclxuICAgICAgICAvLyB0aGlzLmZpbGwoMjU1LCAwLCAwKTtcclxuICAgICAgICAvLyB0aGlzLm5vU3Ryb2tlKCk7XHJcbiAgICAgICAgLy8gdGhpcy5yZWN0KFxyXG4gICAgICAgIC8vICAgICAodGhpcy53b3JsZC5wbGF5ZXIuaW50ZXJwb2xhdGVkWCAqIHRoaXMuVElMRV9XSURUSCAtXHJcbiAgICAgICAgLy8gICAgICAgICB0aGlzLmludGVycG9sYXRlZENhbVggKiB0aGlzLlRJTEVfV0lEVEgpICpcclxuICAgICAgICAvLyAgICAgICAgIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgLy8gICAgICh0aGlzLndvcmxkLnBsYXllci5pbnRlcnBvbGF0ZWRZICogdGhpcy5USUxFX0hFSUdIVCAtXHJcbiAgICAgICAgLy8gICAgICAgICB0aGlzLmludGVycG9sYXRlZENhbVkgKiB0aGlzLlRJTEVfSEVJR0hUKSAqXHJcbiAgICAgICAgLy8gICAgICAgICB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgIC8vICAgICB0aGlzLndvcmxkLnBsYXllci53aWR0aCAqIHRoaXMudXBzY2FsZVNpemUgKiB0aGlzLlRJTEVfV0lEVEgsXHJcbiAgICAgICAgLy8gICAgIHRoaXMud29ybGQucGxheWVyLmhlaWdodCAqIHRoaXMudXBzY2FsZVNpemUgKiB0aGlzLlRJTEVfSEVJR0hUXHJcbiAgICAgICAgLy8gKTtcclxuXHJcblxyXG4gICAgICAgIC8vIGZvciAoY29uc3QgaXRlbSBvZiB0aGlzLml0ZW1zKSB7XHJcbiAgICAgICAgLy8gICAgIGl0ZW0uZmluZEludGVycG9sYXRlZENvb3JkaW5hdGVzKCk7XHJcbiAgICAgICAgLy9cclxuICAgICAgICAvLyAgICAgaXRlbS5pdGVtU3RhY2sudGV4dHVyZS5yZW5kZXIoXHJcbiAgICAgICAgLy8gICAgICAgICB0aGlzLFxyXG4gICAgICAgIC8vICAgICAgICAgKGl0ZW0uaW50ZXJwb2xhdGVkWCAqIHRoaXMuVElMRV9XSURUSCAtXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgdGhpcy5pbnRlcnBvbGF0ZWRDYW1YICogdGhpcy5USUxFX1dJRFRIKSAqXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAvLyAgICAgICAgIChpdGVtLmludGVycG9sYXRlZFkgKiB0aGlzLlRJTEVfSEVJR0hUIC1cclxuICAgICAgICAvLyAgICAgICAgICAgICB0aGlzLmludGVycG9sYXRlZENhbVkgKiB0aGlzLlRJTEVfSEVJR0hUKSAqXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAvLyAgICAgICAgIGl0ZW0udyAqIHRoaXMudXBzY2FsZVNpemUgKiB0aGlzLlRJTEVfV0lEVEgsXHJcbiAgICAgICAgLy8gICAgICAgICBpdGVtLmggKiB0aGlzLnVwc2NhbGVTaXplICogdGhpcy5USUxFX0hFSUdIVFxyXG4gICAgICAgIC8vICAgICApO1xyXG4gICAgICAgIC8vXHJcbiAgICAgICAgLy8gICAgIC8vIFJlbmRlciB0aGUgaXRlbSBxdWFudGl0eSBsYWJlbFxyXG4gICAgICAgIC8vICAgICB0aGlzLmZpbGwoMCk7XHJcbiAgICAgICAgLy9cclxuICAgICAgICAvLyAgICAgdGhpcy5ub1N0cm9rZSgpO1xyXG4gICAgICAgIC8vXHJcbiAgICAgICAgLy8gICAgIHRoaXMudGV4dEFsaWduKHRoaXMuUklHSFQsIHRoaXMuQk9UVE9NKTtcclxuICAgICAgICAvLyAgICAgdGhpcy50ZXh0U2l6ZSg1ICogdGhpcy51cHNjYWxlU2l6ZSk7XHJcbiAgICAgICAgLy9cclxuICAgICAgICAvLyAgICAgdGhpcy50ZXh0KFxyXG4gICAgICAgIC8vICAgICAgICAgaXRlbS5pdGVtU3RhY2suc3RhY2tTaXplLFxyXG4gICAgICAgIC8vICAgICAgICAgKGl0ZW0uaW50ZXJwb2xhdGVkWCAqIHRoaXMuVElMRV9XSURUSCAtXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgdGhpcy5pbnRlcnBvbGF0ZWRDYW1YICogdGhpcy5USUxFX1dJRFRIKSAqXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAvLyAgICAgICAgIChpdGVtLmludGVycG9sYXRlZFkgKiB0aGlzLlRJTEVfSEVJR0hUIC1cclxuICAgICAgICAvLyAgICAgICAgICAgICB0aGlzLmludGVycG9sYXRlZENhbVkgKiB0aGlzLlRJTEVfSEVJR0hUKSAqXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgdGhpcy51cHNjYWxlU2l6ZVxyXG4gICAgICAgIC8vICAgICApO1xyXG4gICAgICAgIC8vIH1cclxuICAgIH1cclxuXHJcbiAgICBwaWNrVXBJdGVtKGl0ZW1TdGFjazogSXRlbVN0YWNrKTogYm9vbGVhbiB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmhvdEJhci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBpdGVtID0gdGhpcy5ob3RCYXJbaV07XHJcblxyXG4gICAgICAgICAgICAvLyBJZiB0aGVyZSBhcmUgbm8gaXRlbXMgaW4gdGhlIGN1cnJlbnQgc2xvdCBvZiB0aGUgaG90QmFyXHJcbiAgICAgICAgICAgIGlmIChpdGVtID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaG90QmFyW2ldID0gaXRlbVN0YWNrO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgIGl0ZW0gPT09IGl0ZW1TdGFjayAmJlxyXG4gICAgICAgICAgICAgICAgaXRlbS5zdGFja1NpemUgPCBpdGVtLm1heFN0YWNrU2l6ZVxyXG4gICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlbWFpbmluZ1NwYWNlID0gaXRlbS5tYXhTdGFja1NpemUgLSBpdGVtLnN0YWNrU2l6ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBUb3Agb2ZmIHRoZSBzdGFjayB3aXRoIGl0ZW1zIGlmIGl0IGNhbiB0YWtlIG1vcmUgdGhhbiB0aGUgc3RhY2sgYmVpbmcgYWRkZWRcclxuICAgICAgICAgICAgICAgIGlmIChyZW1haW5pbmdTcGFjZSA+PSBpdGVtU3RhY2suc3RhY2tTaXplKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ob3RCYXJbaV0uc3RhY2tTaXplID1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5zdGFja1NpemUgKyBpdGVtU3RhY2suc3RhY2tTaXplO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGl0ZW1TdGFjay5zdGFja1NpemUgLT0gcmVtYWluaW5nU3BhY2U7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5ob3RCYXJbaV0uc3RhY2tTaXplID0gaXRlbVN0YWNrLm1heFN0YWNrU2l6ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zb2xlLmVycm9yKFxyXG4gICAgICAgICAgICBgQ291bGQgbm90IHBpY2t1cCAke2l0ZW1TdGFjay5zdGFja1NpemV9ICR7aXRlbVN0YWNrLm5hbWV9YFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIG1vdXNlRXhpdGVkKCkge1xyXG4gICAgICAgIHRoaXMubW91c2VPbiA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIG1vdXNlRW50ZXJlZCgpIHtcclxuICAgICAgICB0aGlzLm1vdXNlT24gPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZU1vdXNlKCkge1xyXG4gICAgICAgIC8vIHdvcmxkIG1vdXNlIHggYW5kIHkgdmFyaWFibGVzIGhvbGQgdGhlIG1vdXNlIHBvc2l0aW9uIGluIHdvcmxkIHRpbGVzLiAgMCwgMCBpcyB0b3AgbGVmdFxyXG4gICAgICAgIHRoaXMud29ybGRNb3VzZVggPSBNYXRoLmZsb29yKFxyXG4gICAgICAgICAgICAodGhpcy5pbnRlcnBvbGF0ZWRDYW1YICogdGhpcy5USUxFX1dJRFRIICtcclxuICAgICAgICAgICAgICAgIHRoaXMubW91c2VYIC8gdGhpcy51cHNjYWxlU2l6ZSkgL1xyXG4gICAgICAgICAgICAgICAgdGhpcy5USUxFX1dJRFRIXHJcbiAgICAgICAgKTtcclxuICAgICAgICB0aGlzLndvcmxkTW91c2VZID0gTWF0aC5mbG9vcihcclxuICAgICAgICAgICAgKHRoaXMuaW50ZXJwb2xhdGVkQ2FtWSAqIHRoaXMuVElMRV9IRUlHSFQgK1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tb3VzZVkgLyB0aGlzLnVwc2NhbGVTaXplKSAvXHJcbiAgICAgICAgICAgICAgICB0aGlzLlRJTEVfSEVJR0hUXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBkcmF3Q3Vyc29yKCkge1xyXG4gICAgICAgIGlmICh0aGlzLm1vdXNlT24pIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucGlja2VkVXBTbG90ID4gLTEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaG90QmFyW3RoaXMucGlja2VkVXBTbG90XS50ZXh0dXJlLnJlbmRlcihcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW91c2VYLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW91c2VZLFxyXG4gICAgICAgICAgICAgICAgICAgIDggKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICAgICAgICAgIDggKiB0aGlzLnVwc2NhbGVTaXplXHJcbiAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMudGV4dChcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhvdEJhclt0aGlzLnBpY2tlZFVwU2xvdF0uc3RhY2tTaXplLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW91c2VYICsgMTAgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW91c2VZICsgMTAgKiB0aGlzLnVwc2NhbGVTaXplXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmV4cG9ydCA9IEdhbWVcclxuIiwiaW1wb3J0IEdhbWUgZnJvbSAnLi9HYW1lJztcclxuaW1wb3J0IHsgaW8gfSBmcm9tIFwic29ja2V0LmlvLWNsaWVudFwiO1xyXG5cclxuXHJcbi8vIENvbm5lY3QgdGhlIHNlcnZlclxyXG5cclxuY29uc3QgY29ubmVjdGlvbiA9IGlvKHsgYXV0aDogeyB0b2tlbjogd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKCd0b2tlbicpIH0gfSlcclxuXHJcbmV4cG9ydCBkZWZhdWx0IG5ldyBHYW1lKGNvbm5lY3Rpb24pOyIsImltcG9ydCBUaWxlUmVzb3VyY2UgZnJvbSAnLi9yZXNvdXJjZXMvVGlsZVJlc291cmNlJztcclxuaW1wb3J0IEltYWdlUmVzb3VyY2UgZnJvbSAnLi9yZXNvdXJjZXMvSW1hZ2VSZXNvdXJjZSc7XHJcbmltcG9ydCBSZWZsZWN0YWJsZUltYWdlUmVzb3VyY2UgZnJvbSAnLi9yZXNvdXJjZXMvUmVmbGVjdGVkSW1hZ2VSZXNvdXJjZSc7XHJcbmltcG9ydCBGb250UmVzb3VyY2UgZnJvbSAnLi9yZXNvdXJjZXMvRm9udFJlc291cmNlJztcclxuaW1wb3J0IFJlc291cmNlIGZyb20gJy4vcmVzb3VyY2VzL1Jlc291cmNlJztcclxuaW1wb3J0IEF1ZGlvUmVzb3VyY2VHcm91cCBmcm9tICcuL3Jlc291cmNlcy9BdWRpb1Jlc291cmNlR3JvdXAnO1xyXG5pbXBvcnQgUDUgZnJvbSAncDUnO1xyXG5pbXBvcnQgQXVkaW9SZXNvdXJjZSBmcm9tICcuL3Jlc291cmNlcy9BdWRpb1Jlc291cmNlJztcclxuXHJcbmludGVyZmFjZSBBc3NldEdyb3VwIHtcclxuICAgIFtuYW1lOiBzdHJpbmddOlxyXG4gICAgfCB7XHJcbiAgICAgICAgW25hbWU6IHN0cmluZ106IFJlc291cmNlIHwgQXNzZXRHcm91cCB8IEF1ZGlvUmVzb3VyY2VHcm91cCB8IEF1ZGlvUmVzb3VyY2UgfCBJbWFnZVJlc291cmNlW107XHJcbiAgICB9XHJcbiAgICB8IFJlc291cmNlIHwgQXNzZXRHcm91cCB8IEF1ZGlvUmVzb3VyY2VHcm91cCB8IEF1ZGlvUmVzb3VyY2UgfCBJbWFnZVJlc291cmNlW107XHJcbn1cclxuXHJcbi8vIFVpIHJlbGF0ZWQgYXNzZXRzXHJcbmNvbnN0IFVpQXNzZXRzID0ge1xyXG4gICAgdWlfc2xvdF9zZWxlY3RlZDogbmV3IEltYWdlUmVzb3VyY2UoXHJcbiAgICAgICAgJ2Fzc2V0cy90ZXh0dXJlcy91aS91aXNsb3Rfc2VsZWN0ZWQucG5nJ1xyXG4gICAgKSxcclxuICAgIHVpX3Nsb3Q6IG5ldyBJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvdWkvdWlzbG90LnBuZycpLFxyXG4gICAgdWlfZnJhbWU6IG5ldyBJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvdWkvdWlmcmFtZS5wbmcnKSxcclxuICAgIGJ1dHRvbl91bnNlbGVjdGVkOiBuZXcgSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3VpL2J1dHRvbjAucG5nJyksXHJcbiAgICBidXR0b25fc2VsZWN0ZWQ6IG5ldyBJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvdWkvYnV0dG9uMS5wbmcnKSxcclxuICAgIHNsaWRlcl9iYXI6IG5ldyBJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvdWkvc2xpZGVyQmFyLnBuZycpLFxyXG4gICAgc2xpZGVyX2hhbmRsZTogbmV3IEltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy91aS9zbGlkZXJIYW5kbGUucG5nJyksXHJcbiAgICB0aXRsZV9pbWFnZTogbmV3IEltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy91aS9zbm93ZWRpbkJVTVAucG5nJyksXHJcbiAgICB2aWduZXR0ZTogbmV3IEltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy91aS92aWduZXR0ZS1leHBvcnQucG5nJyksXHJcbn07XHJcblxyXG4vLyBJdGVtIHJlbGF0ZWQgYXNzZXRzXHJcbmNvbnN0IEl0ZW1zQXNzZXRzID0ge1xyXG4gICAgcmVzb3VyY2VzOiB7XHJcbiAgICAgICAgaWNlX3NoYXJkOiBuZXcgSW1hZ2VSZXNvdXJjZShcclxuICAgICAgICAgICAgJ2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9yZXNvdXJjZV9pY2Vfc2hhcmRzLnBuZydcclxuICAgICAgICApLFxyXG4gICAgICAgIHNub3diYWxsOiBuZXcgSW1hZ2VSZXNvdXJjZShcclxuICAgICAgICAgICAgJ2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9yZXNvdXJjZV9zbm93YmFsbC5wbmcnXHJcbiAgICAgICAgKSxcclxuICAgIH0sXHJcbiAgICBjb25zdW1hYmxlczoge1xyXG4gICAgICAgIHNub3dfYmVycmllczogbmV3IEltYWdlUmVzb3VyY2UoXHJcbiAgICAgICAgICAgICdhc3NldHMvdGV4dHVyZXMvaXRlbXMvY29uc3VtYWJsZV9zbm93X2JlcnJpZXMucG5nJ1xyXG4gICAgICAgICksXHJcbiAgICB9LFxyXG4gICAgYmxvY2tzOiB7XHJcbiAgICAgICAgaWNlOiBuZXcgSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL2l0ZW1zL2Jsb2NrX2ljZS5wbmcnKSxcclxuICAgICAgICBzbm93OiBuZXcgSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL2l0ZW1zL2Jsb2NrX3Nub3cucG5nJyksXHJcbiAgICB9LFxyXG4gICAgdG9vbHM6IHt9LFxyXG59O1xyXG5cclxuLy8gV29ybGQgcmVsYXRlZCBhc3NldHNcclxuY29uc3QgV29ybGRBc3NldHMgPSB7XHJcbiAgICBzaGFkZXJSZXNvdXJjZXM6IHtcclxuICAgICAgICBza3lJbWFnZTogbmV3IEltYWdlUmVzb3VyY2UoXHJcbiAgICAgICAgICAgICdhc3NldHMvdGV4dHVyZXMvc2hhZGVyX3Jlc291cmNlcy9wb2lzc29uc25vdy5wbmcnXHJcbiAgICAgICAgKSxcclxuICAgIH0sXHJcbiAgICBtaWRkbGVncm91bmQ6IHtcclxuICAgICAgICB0aWxlc2V0X2ljZTogbmV3IFRpbGVSZXNvdXJjZShcclxuICAgICAgICAgICAgJ2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9taWRkbGVncm91bmQvdGlsZXNldF9pY2UucG5nJyxcclxuICAgICAgICAgICAgMTYsXHJcbiAgICAgICAgICAgIDEsXHJcbiAgICAgICAgICAgIDgsXHJcbiAgICAgICAgICAgIDhcclxuICAgICAgICApLFxyXG4gICAgICAgIHRpbGVzZXRfc25vdzogbmV3IFRpbGVSZXNvdXJjZShcclxuICAgICAgICAgICAgJ2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9taWRkbGVncm91bmQvdGlsZXNldF9zbm93LnBuZycsXHJcbiAgICAgICAgICAgIDE2LFxyXG4gICAgICAgICAgICAxLFxyXG4gICAgICAgICAgICA4LFxyXG4gICAgICAgICAgICA4XHJcbiAgICAgICAgKSxcclxuICAgICAgICB0aWxlc2V0X2RpcnQ6IG5ldyBUaWxlUmVzb3VyY2UoXHJcbiAgICAgICAgICAgICdhc3NldHMvdGV4dHVyZXMvd29ybGQvbWlkZGxlZ3JvdW5kL3RpbGVzZXRfZGlydDAucG5nJyxcclxuICAgICAgICAgICAgMTYsXHJcbiAgICAgICAgICAgIDEsXHJcbiAgICAgICAgICAgIDgsXHJcbiAgICAgICAgICAgIDhcclxuICAgICAgICApLFxyXG4gICAgICAgIHRpbGVzZXRfc3RvbmUwOiBuZXcgVGlsZVJlc291cmNlKFxyXG4gICAgICAgICAgICAnYXNzZXRzL3RleHR1cmVzL3dvcmxkL21pZGRsZWdyb3VuZC90aWxlc2V0X3N0b25lMC5wbmcnLFxyXG4gICAgICAgICAgICAxNixcclxuICAgICAgICAgICAgMSxcclxuICAgICAgICAgICAgOCxcclxuICAgICAgICAgICAgOFxyXG4gICAgICAgICksXHJcbiAgICAgICAgdGlsZXNldF9zdG9uZTE6IG5ldyBUaWxlUmVzb3VyY2UoXHJcbiAgICAgICAgICAgICdhc3NldHMvdGV4dHVyZXMvd29ybGQvbWlkZGxlZ3JvdW5kL3RpbGVzZXRfc3RvbmUxLnBuZycsXHJcbiAgICAgICAgICAgIDE2LFxyXG4gICAgICAgICAgICAxLFxyXG4gICAgICAgICAgICA4LFxyXG4gICAgICAgICAgICA4XHJcbiAgICAgICAgKSxcclxuICAgICAgICB0aWxlc2V0X3N0b25lMjogbmV3IFRpbGVSZXNvdXJjZShcclxuICAgICAgICAgICAgJ2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9taWRkbGVncm91bmQvdGlsZXNldF9zdG9uZTIucG5nJyxcclxuICAgICAgICAgICAgMTYsXHJcbiAgICAgICAgICAgIDEsXHJcbiAgICAgICAgICAgIDgsXHJcbiAgICAgICAgICAgIDhcclxuICAgICAgICApLFxyXG4gICAgICAgIHRpbGVzZXRfc3RvbmUzOiBuZXcgVGlsZVJlc291cmNlKFxyXG4gICAgICAgICAgICAnYXNzZXRzL3RleHR1cmVzL3dvcmxkL21pZGRsZWdyb3VuZC90aWxlc2V0X3N0b25lMi5wbmcnLFxyXG4gICAgICAgICAgICAxNixcclxuICAgICAgICAgICAgMSxcclxuICAgICAgICAgICAgOCxcclxuICAgICAgICAgICAgOFxyXG4gICAgICAgICksXHJcbiAgICAgICAgdGlsZXNldF9zdG9uZTQ6IG5ldyBUaWxlUmVzb3VyY2UoXHJcbiAgICAgICAgICAgICdhc3NldHMvdGV4dHVyZXMvd29ybGQvbWlkZGxlZ3JvdW5kL3RpbGVzZXRfc3RvbmUyLnBuZycsXHJcbiAgICAgICAgICAgIDE2LFxyXG4gICAgICAgICAgICAxLFxyXG4gICAgICAgICAgICA4LFxyXG4gICAgICAgICAgICA4XHJcbiAgICAgICAgKSxcclxuICAgICAgICB0aWxlc2V0X3N0b25lNTogbmV3IFRpbGVSZXNvdXJjZShcclxuICAgICAgICAgICAgJ2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9taWRkbGVncm91bmQvdGlsZXNldF9zdG9uZTIucG5nJyxcclxuICAgICAgICAgICAgMTYsXHJcbiAgICAgICAgICAgIDEsXHJcbiAgICAgICAgICAgIDgsXHJcbiAgICAgICAgICAgIDhcclxuICAgICAgICApLFxyXG4gICAgICAgIHRpbGVzZXRfc3RvbmU2OiBuZXcgVGlsZVJlc291cmNlKFxyXG4gICAgICAgICAgICAnYXNzZXRzL3RleHR1cmVzL3dvcmxkL21pZGRsZWdyb3VuZC90aWxlc2V0X3N0b25lMi5wbmcnLFxyXG4gICAgICAgICAgICAxNixcclxuICAgICAgICAgICAgMSxcclxuICAgICAgICAgICAgOCxcclxuICAgICAgICAgICAgOFxyXG4gICAgICAgICksXHJcbiAgICAgICAgdGlsZXNldF9zdG9uZTc6IG5ldyBUaWxlUmVzb3VyY2UoXHJcbiAgICAgICAgICAgICdhc3NldHMvdGV4dHVyZXMvd29ybGQvbWlkZGxlZ3JvdW5kL3RpbGVzZXRfc3RvbmUyLnBuZycsXHJcbiAgICAgICAgICAgIDE2LFxyXG4gICAgICAgICAgICAxLFxyXG4gICAgICAgICAgICA4LFxyXG4gICAgICAgICAgICA4XHJcbiAgICAgICAgKSxcclxuICAgICAgICB0aWxlc2V0X3N0b25lODogbmV3IFRpbGVSZXNvdXJjZShcclxuICAgICAgICAgICAgJ2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9taWRkbGVncm91bmQvdGlsZXNldF9zdG9uZTIucG5nJyxcclxuICAgICAgICAgICAgMTYsXHJcbiAgICAgICAgICAgIDEsXHJcbiAgICAgICAgICAgIDgsXHJcbiAgICAgICAgICAgIDhcclxuICAgICAgICApLFxyXG4gICAgICAgIHRpbGVzZXRfc3RvbmU5OiBuZXcgVGlsZVJlc291cmNlKFxyXG4gICAgICAgICAgICAnYXNzZXRzL3RleHR1cmVzL3dvcmxkL21pZGRsZWdyb3VuZC90aWxlc2V0X3N0b25lMi5wbmcnLFxyXG4gICAgICAgICAgICAxNixcclxuICAgICAgICAgICAgMSxcclxuICAgICAgICAgICAgOCxcclxuICAgICAgICAgICAgOFxyXG4gICAgICAgICksXHJcbiAgICB9LFxyXG4gICAgZm9yZWdyb3VuZDoge1xyXG4gICAgICAgIHRpbGVzZXRfcGlwZTogbmV3IFRpbGVSZXNvdXJjZShcclxuICAgICAgICAgICAgJ2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9mb3JlZ3JvdW5kL3RpbGVzZXRfcGlwZS5wbmcnLFxyXG4gICAgICAgICAgICAxNixcclxuICAgICAgICAgICAgMSxcclxuICAgICAgICAgICAgOCxcclxuICAgICAgICAgICAgOFxyXG4gICAgICAgICksXHJcbiAgICB9LFxyXG4gICAgdGlsZUVudGl0aWVzOiB7XHJcbiAgICAgICAgZW50aXR5X3QxZHJpbGw6IFtcclxuICAgICAgICAgICAgbmV3IEltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy93b3JsZC90aWxlRW50aXRpZXMvUnVzdHlEcmlsbDEucG5nJyksXHJcbiAgICAgICAgICAgIG5ldyBJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvd29ybGQvdGlsZUVudGl0aWVzL1J1c3R5RHJpbGwyLnBuZycpLFxyXG4gICAgICAgICAgICBuZXcgSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3dvcmxkL3RpbGVFbnRpdGllcy9SdXN0eURyaWxsMy5wbmcnKSxcclxuICAgICAgICAgICAgbmV3IEltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy93b3JsZC90aWxlRW50aXRpZXMvUnVzdHlEcmlsbDQucG5nJyksXHJcbiAgICAgICAgICAgIG5ldyBJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvd29ybGQvdGlsZUVudGl0aWVzL1J1c3R5RHJpbGw1LnBuZycpLFxyXG4gICAgICAgICAgICBuZXcgSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3dvcmxkL3RpbGVFbnRpdGllcy9SdXN0eURyaWxsNi5wbmcnKSxcclxuICAgICAgICAgICAgbmV3IEltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy93b3JsZC90aWxlRW50aXRpZXMvUnVzdHlEcmlsbDcucG5nJyksXHJcbiAgICAgICAgICAgIG5ldyBJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvd29ybGQvdGlsZUVudGl0aWVzL1J1c3R5RHJpbGw4LnBuZycpLFxyXG4gICAgICAgICAgICBuZXcgSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3dvcmxkL3RpbGVFbnRpdGllcy9SdXN0eURyaWxsOS5wbmcnKSxcclxuICAgICAgICAgICAgbmV3IEltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy93b3JsZC90aWxlRW50aXRpZXMvUnVzdHlEcmlsbDEwLnBuZycpLFxyXG4gICAgICAgICAgICBuZXcgSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3dvcmxkL3RpbGVFbnRpdGllcy9SdXN0eURyaWxsMTEucG5nJyksXHJcbiAgICAgICAgICAgIG5ldyBJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvd29ybGQvdGlsZUVudGl0aWVzL1J1c3R5RHJpbGwxMi5wbmcnKSxcclxuICAgICAgICAgICAgbmV3IEltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy93b3JsZC90aWxlRW50aXRpZXMvUnVzdHlEcmlsbDEzLnBuZycpXHJcbiAgICAgICAgXVxyXG4gICAgfVxyXG59O1xyXG5cclxuY29uc3QgRm9udHMgPSB7XHJcbiAgICB0aXRsZTogbmV3IEZvbnRSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3VpL2ZvbnQucG5nJywge1xyXG4gICAgICAgIFwiMFwiOiA3LFxyXG4gICAgICAgIFwiMVwiOiA3LFxyXG4gICAgICAgIFwiMlwiOiA3LFxyXG4gICAgICAgIFwiM1wiOiA2LFxyXG4gICAgICAgIFwiNFwiOiA2LFxyXG4gICAgICAgIFwiNVwiOiA2LFxyXG4gICAgICAgIFwiNlwiOiA2LFxyXG4gICAgICAgIFwiN1wiOiA3LFxyXG4gICAgICAgIFwiOFwiOiA3LFxyXG4gICAgICAgIFwiOVwiOiA2LFxyXG4gICAgICAgIFwiQVwiOiA2LFxyXG4gICAgICAgIFwiQlwiOiA3LFxyXG4gICAgICAgIFwiQ1wiOiA3LFxyXG4gICAgICAgIFwiRFwiOiA2LFxyXG4gICAgICAgIFwiRVwiOiA3LFxyXG4gICAgICAgIFwiRlwiOiA2LFxyXG4gICAgICAgIFwiR1wiOiA3LFxyXG4gICAgICAgIFwiSFwiOiA3LFxyXG4gICAgICAgIFwiSVwiOiA3LFxyXG4gICAgICAgIFwiSlwiOiA4LFxyXG4gICAgICAgIFwiS1wiOiA2LFxyXG4gICAgICAgIFwiTFwiOiA2LFxyXG4gICAgICAgIFwiTVwiOiA4LFxyXG4gICAgICAgIFwiTlwiOiA4LFxyXG4gICAgICAgIFwiT1wiOiA4LFxyXG4gICAgICAgIFwiUFwiOiA5LFxyXG4gICAgICAgIFwiUVwiOiA4LFxyXG4gICAgICAgIFwiUlwiOiA3LFxyXG4gICAgICAgIFwiU1wiOiA3LFxyXG4gICAgICAgIFwiVFwiOiA4LFxyXG4gICAgICAgIFwiVVwiOiA4LFxyXG4gICAgICAgIFwiVlwiOiA4LFxyXG4gICAgICAgIFwiV1wiOiAxMCxcclxuICAgICAgICBcIlhcIjogOCxcclxuICAgICAgICBcIllcIjogOCxcclxuICAgICAgICBcIlpcIjogOSxcclxuICAgICAgICBcImFcIjogNyxcclxuICAgICAgICBcImJcIjogNyxcclxuICAgICAgICBcImNcIjogNixcclxuICAgICAgICBcImRcIjogNyxcclxuICAgICAgICBcImVcIjogNixcclxuICAgICAgICBcImZcIjogNixcclxuICAgICAgICBcImdcIjogNixcclxuICAgICAgICBcImhcIjogNixcclxuICAgICAgICBcImlcIjogNSxcclxuICAgICAgICBcImpcIjogNixcclxuICAgICAgICBcImtcIjogNSxcclxuICAgICAgICBcImxcIjogNSxcclxuICAgICAgICBcIm1cIjogOCxcclxuICAgICAgICBcIm5cIjogNSxcclxuICAgICAgICBcIm9cIjogNSxcclxuICAgICAgICBcInBcIjogNSxcclxuICAgICAgICBcInFcIjogNyxcclxuICAgICAgICBcInJcIjogNSxcclxuICAgICAgICBcInNcIjogNCxcclxuICAgICAgICBcInRcIjogNSxcclxuICAgICAgICBcInVcIjogNSxcclxuICAgICAgICBcInZcIjogNSxcclxuICAgICAgICBcIndcIjogNyxcclxuICAgICAgICBcInhcIjogNixcclxuICAgICAgICBcInlcIjogNSxcclxuICAgICAgICBcInpcIjogNSxcclxuICAgICAgICBcIiFcIjogNCxcclxuICAgICAgICBcIi5cIjogMixcclxuICAgICAgICBcIixcIjogMixcclxuICAgICAgICBcIj9cIjogNixcclxuICAgICAgICBcIl9cIjogNixcclxuICAgICAgICBcIi1cIjogNCxcclxuICAgICAgICBcIjpcIjogMixcclxuICAgICAgICBcIiBcIjogMlxyXG4gICAgfSwgXCJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSEuLD9fLTogXCIpLFxyXG5cclxuICAgIGJpZzogbmV3IEZvbnRSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3VpL2ZvbnRCaWcucG5nJywge1xyXG4gICAgICAgIFwiMFwiOiAxNCxcclxuICAgICAgICBcIjFcIjogMTQsXHJcbiAgICAgICAgXCIyXCI6IDE0LFxyXG4gICAgICAgIFwiM1wiOiAxMixcclxuICAgICAgICBcIjRcIjogMTIsXHJcbiAgICAgICAgXCI1XCI6IDEyLFxyXG4gICAgICAgIFwiNlwiOiAxMixcclxuICAgICAgICBcIjdcIjogMTQsXHJcbiAgICAgICAgXCI4XCI6IDE0LFxyXG4gICAgICAgIFwiOVwiOiAxMixcclxuICAgICAgICBcIkFcIjogMTIsXHJcbiAgICAgICAgXCJCXCI6IDE0LFxyXG4gICAgICAgIFwiQ1wiOiAxNCxcclxuICAgICAgICBcIkRcIjogMTIsXHJcbiAgICAgICAgXCJFXCI6IDE0LFxyXG4gICAgICAgIFwiRlwiOiAxMixcclxuICAgICAgICBcIkdcIjogMTQsXHJcbiAgICAgICAgXCJIXCI6IDE0LFxyXG4gICAgICAgIFwiSVwiOiAxNCxcclxuICAgICAgICBcIkpcIjogMTYsXHJcbiAgICAgICAgXCJLXCI6IDEyLFxyXG4gICAgICAgIFwiTFwiOiAxMixcclxuICAgICAgICBcIk1cIjogMTYsXHJcbiAgICAgICAgXCJOXCI6IDE2LFxyXG4gICAgICAgIFwiT1wiOiAxNixcclxuICAgICAgICBcIlBcIjogMTgsXHJcbiAgICAgICAgXCJRXCI6IDE2LFxyXG4gICAgICAgIFwiUlwiOiAxNCxcclxuICAgICAgICBcIlNcIjogMTQsXHJcbiAgICAgICAgXCJUXCI6IDE2LFxyXG4gICAgICAgIFwiVVwiOiAxNixcclxuICAgICAgICBcIlZcIjogMTYsXHJcbiAgICAgICAgXCJXXCI6IDIwLFxyXG4gICAgICAgIFwiWFwiOiAxNixcclxuICAgICAgICBcIllcIjogMTYsXHJcbiAgICAgICAgXCJaXCI6IDE4LFxyXG4gICAgICAgIFwiYVwiOiAxNCxcclxuICAgICAgICBcImJcIjogMTQsXHJcbiAgICAgICAgXCJjXCI6IDEyLFxyXG4gICAgICAgIFwiZFwiOiAxNCxcclxuICAgICAgICBcImVcIjogMTIsXHJcbiAgICAgICAgXCJmXCI6IDEyLFxyXG4gICAgICAgIFwiZ1wiOiAxMixcclxuICAgICAgICBcImhcIjogMTIsXHJcbiAgICAgICAgXCJpXCI6IDEwLFxyXG4gICAgICAgIFwialwiOiAxMixcclxuICAgICAgICBcImtcIjogMTAsXHJcbiAgICAgICAgXCJsXCI6IDEwLFxyXG4gICAgICAgIFwibVwiOiAxNixcclxuICAgICAgICBcIm5cIjogMTAsXHJcbiAgICAgICAgXCJvXCI6IDEwLFxyXG4gICAgICAgIFwicFwiOiAxMCxcclxuICAgICAgICBcInFcIjogMTQsXHJcbiAgICAgICAgXCJyXCI6IDEwLFxyXG4gICAgICAgIFwic1wiOiA4LFxyXG4gICAgICAgIFwidFwiOiAxMCxcclxuICAgICAgICBcInVcIjogMTAsXHJcbiAgICAgICAgXCJ2XCI6IDEwLFxyXG4gICAgICAgIFwid1wiOiAxNCxcclxuICAgICAgICBcInhcIjogMTIsXHJcbiAgICAgICAgXCJ5XCI6IDEwLFxyXG4gICAgICAgIFwielwiOiAxMCxcclxuICAgICAgICBcIiFcIjogOCxcclxuICAgICAgICBcIi5cIjogNCxcclxuICAgICAgICBcIixcIjogNCxcclxuICAgICAgICBcIj9cIjogMTIsXHJcbiAgICAgICAgXCJfXCI6IDEyLFxyXG4gICAgICAgIFwiLVwiOiA4LFxyXG4gICAgICAgIFwiOlwiOiA0LFxyXG4gICAgICAgIFwiIFwiOiA0XHJcbiAgICB9LCBcIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5IS4sP18tOiBcIiksXHJcblxyXG59O1xyXG5cclxuY29uc3QgS2V5cyA9IHtcclxuICAgIGtleWJvYXJkTWFwOiBbXHJcbiAgICAgICAgXCJcIiwgLy8gWzBdXHJcbiAgICAgICAgXCJcIiwgLy8gWzFdXHJcbiAgICAgICAgXCJcIiwgLy8gWzJdXHJcbiAgICAgICAgXCJDQU5DRUxcIiwgLy8gWzNdXHJcbiAgICAgICAgXCJcIiwgLy8gWzRdXHJcbiAgICAgICAgXCJcIiwgLy8gWzVdXHJcbiAgICAgICAgXCJIRUxQXCIsIC8vIFs2XVxyXG4gICAgICAgIFwiXCIsIC8vIFs3XVxyXG4gICAgICAgIFwiQkFDS1NQQUNFXCIsIC8vIFs4XVxyXG4gICAgICAgIFwiVEFCXCIsIC8vIFs5XVxyXG4gICAgICAgIFwiXCIsIC8vIFsxMF1cclxuICAgICAgICBcIlwiLCAvLyBbMTFdXHJcbiAgICAgICAgXCJDTEVBUlwiLCAvLyBbMTJdXHJcbiAgICAgICAgXCJFTlRFUlwiLCAvLyBbMTNdXHJcbiAgICAgICAgXCJFTlRFUiBTUEVDSUFMXCIsIC8vIFsxNF1cclxuICAgICAgICBcIlwiLCAvLyBbMTVdXHJcbiAgICAgICAgXCJTSElGVFwiLCAvLyBbMTZdXHJcbiAgICAgICAgXCJDT05UUk9MXCIsIC8vIFsxN11cclxuICAgICAgICBcIkFMVFwiLCAvLyBbMThdXHJcbiAgICAgICAgXCJQQVVTRVwiLCAvLyBbMTldXHJcbiAgICAgICAgXCJDQVBTIExPQ0tcIiwgLy8gWzIwXVxyXG4gICAgICAgIFwiS0FOQVwiLCAvLyBbMjFdXHJcbiAgICAgICAgXCJFSVNVXCIsIC8vIFsyMl1cclxuICAgICAgICBcIkpVTkpBXCIsIC8vIFsyM11cclxuICAgICAgICBcIkZJTkFMXCIsIC8vIFsyNF1cclxuICAgICAgICBcIkhBTkpBXCIsIC8vIFsyNV1cclxuICAgICAgICBcIlwiLCAvLyBbMjZdXHJcbiAgICAgICAgXCJFU0NBUEVcIiwgLy8gWzI3XVxyXG4gICAgICAgIFwiQ09OVkVSVFwiLCAvLyBbMjhdXHJcbiAgICAgICAgXCJOT05DT05WRVJUXCIsIC8vIFsyOV1cclxuICAgICAgICBcIkFDQ0VQVFwiLCAvLyBbMzBdXHJcbiAgICAgICAgXCJNT0RFQ0hBTkdFXCIsIC8vIFszMV1cclxuICAgICAgICBcIlNQQUNFXCIsIC8vIFszMl1cclxuICAgICAgICBcIlBBR0UgVVBcIiwgLy8gWzMzXVxyXG4gICAgICAgIFwiUEFHRSBET1dOXCIsIC8vIFszNF1cclxuICAgICAgICBcIkVORFwiLCAvLyBbMzVdXHJcbiAgICAgICAgXCJIT01FXCIsIC8vIFszNl1cclxuICAgICAgICBcIkxFRlRcIiwgLy8gWzM3XVxyXG4gICAgICAgIFwiVVBcIiwgLy8gWzM4XVxyXG4gICAgICAgIFwiUklHSFRcIiwgLy8gWzM5XVxyXG4gICAgICAgIFwiRE9XTlwiLCAvLyBbNDBdXHJcbiAgICAgICAgXCJTRUxFQ1RcIiwgLy8gWzQxXVxyXG4gICAgICAgIFwiUFJJTlRcIiwgLy8gWzQyXVxyXG4gICAgICAgIFwiRVhFQ1VURVwiLCAvLyBbNDNdXHJcbiAgICAgICAgXCJQUklOVCBTQ1JFRU5cIiwgLy8gWzQ0XVxyXG4gICAgICAgIFwiSU5TRVJUXCIsIC8vIFs0NV1cclxuICAgICAgICBcIkRFTEVURVwiLCAvLyBbNDZdXHJcbiAgICAgICAgXCJcIiwgLy8gWzQ3XVxyXG4gICAgICAgIFwiMFwiLCAvLyBbNDhdXHJcbiAgICAgICAgXCIxXCIsIC8vIFs0OV1cclxuICAgICAgICBcIjJcIiwgLy8gWzUwXVxyXG4gICAgICAgIFwiM1wiLCAvLyBbNTFdXHJcbiAgICAgICAgXCI0XCIsIC8vIFs1Ml1cclxuICAgICAgICBcIjVcIiwgLy8gWzUzXVxyXG4gICAgICAgIFwiNlwiLCAvLyBbNTRdXHJcbiAgICAgICAgXCI3XCIsIC8vIFs1NV1cclxuICAgICAgICBcIjhcIiwgLy8gWzU2XVxyXG4gICAgICAgIFwiOVwiLCAvLyBbNTddXHJcbiAgICAgICAgXCJDT0xPTlwiLCAvLyBbNThdXHJcbiAgICAgICAgXCJTRU1JQ09MT05cIiwgLy8gWzU5XVxyXG4gICAgICAgIFwiTEVTUyBUSEFOXCIsIC8vIFs2MF1cclxuICAgICAgICBcIkVRVUFMU1wiLCAvLyBbNjFdXHJcbiAgICAgICAgXCJHUkVBVEVSIFRIQU5cIiwgLy8gWzYyXVxyXG4gICAgICAgIFwiUVVFU1RJT04gTUFSS1wiLCAvLyBbNjNdXHJcbiAgICAgICAgXCJBVFwiLCAvLyBbNjRdXHJcbiAgICAgICAgXCJBXCIsIC8vIFs2NV1cclxuICAgICAgICBcIkJcIiwgLy8gWzY2XVxyXG4gICAgICAgIFwiQ1wiLCAvLyBbNjddXHJcbiAgICAgICAgXCJEXCIsIC8vIFs2OF1cclxuICAgICAgICBcIkVcIiwgLy8gWzY5XVxyXG4gICAgICAgIFwiRlwiLCAvLyBbNzBdXHJcbiAgICAgICAgXCJHXCIsIC8vIFs3MV1cclxuICAgICAgICBcIkhcIiwgLy8gWzcyXVxyXG4gICAgICAgIFwiSVwiLCAvLyBbNzNdXHJcbiAgICAgICAgXCJKXCIsIC8vIFs3NF1cclxuICAgICAgICBcIktcIiwgLy8gWzc1XVxyXG4gICAgICAgIFwiTFwiLCAvLyBbNzZdXHJcbiAgICAgICAgXCJNXCIsIC8vIFs3N11cclxuICAgICAgICBcIk5cIiwgLy8gWzc4XVxyXG4gICAgICAgIFwiT1wiLCAvLyBbNzldXHJcbiAgICAgICAgXCJQXCIsIC8vIFs4MF1cclxuICAgICAgICBcIlFcIiwgLy8gWzgxXVxyXG4gICAgICAgIFwiUlwiLCAvLyBbODJdXHJcbiAgICAgICAgXCJTXCIsIC8vIFs4M11cclxuICAgICAgICBcIlRcIiwgLy8gWzg0XVxyXG4gICAgICAgIFwiVVwiLCAvLyBbODVdXHJcbiAgICAgICAgXCJWXCIsIC8vIFs4Nl1cclxuICAgICAgICBcIldcIiwgLy8gWzg3XVxyXG4gICAgICAgIFwiWFwiLCAvLyBbODhdXHJcbiAgICAgICAgXCJZXCIsIC8vIFs4OV1cclxuICAgICAgICBcIlpcIiwgLy8gWzkwXVxyXG4gICAgICAgIFwiT1MgS0VZXCIsIC8vIFs5MV0gV2luZG93cyBLZXkgKFdpbmRvd3MpIG9yIENvbW1hbmQgS2V5IChNYWMpXHJcbiAgICAgICAgXCJcIiwgLy8gWzkyXVxyXG4gICAgICAgIFwiQ09OVEVYVCBNRU5VXCIsIC8vIFs5M11cclxuICAgICAgICBcIlwiLCAvLyBbOTRdXHJcbiAgICAgICAgXCJTTEVFUFwiLCAvLyBbOTVdXHJcbiAgICAgICAgXCJOVU1QQUQwXCIsIC8vIFs5Nl1cclxuICAgICAgICBcIk5VTVBBRDFcIiwgLy8gWzk3XVxyXG4gICAgICAgIFwiTlVNUEFEMlwiLCAvLyBbOThdXHJcbiAgICAgICAgXCJOVU1QQUQzXCIsIC8vIFs5OV1cclxuICAgICAgICBcIk5VTVBBRDRcIiwgLy8gWzEwMF1cclxuICAgICAgICBcIk5VTVBBRDVcIiwgLy8gWzEwMV1cclxuICAgICAgICBcIk5VTVBBRDZcIiwgLy8gWzEwMl1cclxuICAgICAgICBcIk5VTVBBRDdcIiwgLy8gWzEwM11cclxuICAgICAgICBcIk5VTVBBRDhcIiwgLy8gWzEwNF1cclxuICAgICAgICBcIk5VTVBBRDlcIiwgLy8gWzEwNV1cclxuICAgICAgICBcIk1VTFRJUExZXCIsIC8vIFsxMDZdXHJcbiAgICAgICAgXCJBRERcIiwgLy8gWzEwN11cclxuICAgICAgICBcIlNFUEFSQVRPUlwiLCAvLyBbMTA4XVxyXG4gICAgICAgIFwiU1VCVFJBQ1RcIiwgLy8gWzEwOV1cclxuICAgICAgICBcIkRFQ0lNQUxcIiwgLy8gWzExMF1cclxuICAgICAgICBcIkRJVklERVwiLCAvLyBbMTExXVxyXG4gICAgICAgIFwiRjFcIiwgLy8gWzExMl1cclxuICAgICAgICBcIkYyXCIsIC8vIFsxMTNdXHJcbiAgICAgICAgXCJGM1wiLCAvLyBbMTE0XVxyXG4gICAgICAgIFwiRjRcIiwgLy8gWzExNV1cclxuICAgICAgICBcIkY1XCIsIC8vIFsxMTZdXHJcbiAgICAgICAgXCJGNlwiLCAvLyBbMTE3XVxyXG4gICAgICAgIFwiRjdcIiwgLy8gWzExOF1cclxuICAgICAgICBcIkY4XCIsIC8vIFsxMTldXHJcbiAgICAgICAgXCJGOVwiLCAvLyBbMTIwXVxyXG4gICAgICAgIFwiRjEwXCIsIC8vIFsxMjFdXHJcbiAgICAgICAgXCJGMTFcIiwgLy8gWzEyMl1cclxuICAgICAgICBcIkYxMlwiLCAvLyBbMTIzXVxyXG4gICAgICAgIFwiRjEzXCIsIC8vIFsxMjRdXHJcbiAgICAgICAgXCJGMTRcIiwgLy8gWzEyNV1cclxuICAgICAgICBcIkYxNVwiLCAvLyBbMTI2XVxyXG4gICAgICAgIFwiRjE2XCIsIC8vIFsxMjddXHJcbiAgICAgICAgXCJGMTdcIiwgLy8gWzEyOF1cclxuICAgICAgICBcIkYxOFwiLCAvLyBbMTI5XVxyXG4gICAgICAgIFwiRjE5XCIsIC8vIFsxMzBdXHJcbiAgICAgICAgXCJGMjBcIiwgLy8gWzEzMV1cclxuICAgICAgICBcIkYyMVwiLCAvLyBbMTMyXVxyXG4gICAgICAgIFwiRjIyXCIsIC8vIFsxMzNdXHJcbiAgICAgICAgXCJGMjNcIiwgLy8gWzEzNF1cclxuICAgICAgICBcIkYyNFwiLCAvLyBbMTM1XVxyXG4gICAgICAgIFwiXCIsIC8vIFsxMzZdXHJcbiAgICAgICAgXCJcIiwgLy8gWzEzN11cclxuICAgICAgICBcIlwiLCAvLyBbMTM4XVxyXG4gICAgICAgIFwiXCIsIC8vIFsxMzldXHJcbiAgICAgICAgXCJcIiwgLy8gWzE0MF1cclxuICAgICAgICBcIlwiLCAvLyBbMTQxXVxyXG4gICAgICAgIFwiXCIsIC8vIFsxNDJdXHJcbiAgICAgICAgXCJcIiwgLy8gWzE0M11cclxuICAgICAgICBcIk5VTSBMT0NLXCIsIC8vIFsxNDRdXHJcbiAgICAgICAgXCJTQ1JPTEwgTE9DS1wiLCAvLyBbMTQ1XVxyXG4gICAgICAgIFwiV0lOIE9FTSBGSiBKSVNIT1wiLCAvLyBbMTQ2XVxyXG4gICAgICAgIFwiV0lOIE9FTSBGSiBNQVNTSE9VXCIsIC8vIFsxNDddXHJcbiAgICAgICAgXCJXSU4gT0VNIEZKIFRPVVJPS1VcIiwgLy8gWzE0OF1cclxuICAgICAgICBcIldJTiBPRU0gRkogTE9ZQVwiLCAvLyBbMTQ5XVxyXG4gICAgICAgIFwiV0lOIE9FTSBGSiBST1lBXCIsIC8vIFsxNTBdXHJcbiAgICAgICAgXCJcIiwgLy8gWzE1MV1cclxuICAgICAgICBcIlwiLCAvLyBbMTUyXVxyXG4gICAgICAgIFwiXCIsIC8vIFsxNTNdXHJcbiAgICAgICAgXCJcIiwgLy8gWzE1NF1cclxuICAgICAgICBcIlwiLCAvLyBbMTU1XVxyXG4gICAgICAgIFwiXCIsIC8vIFsxNTZdXHJcbiAgICAgICAgXCJcIiwgLy8gWzE1N11cclxuICAgICAgICBcIlwiLCAvLyBbMTU4XVxyXG4gICAgICAgIFwiXCIsIC8vIFsxNTldXHJcbiAgICAgICAgXCJDSVJDVU1GTEVYXCIsIC8vIFsxNjBdXHJcbiAgICAgICAgXCJFWENMQU1BVElPTlwiLCAvLyBbMTYxXVxyXG4gICAgICAgIFwiRE9VQkxFX1FVT1RFXCIsIC8vIFsxNjJdXHJcbiAgICAgICAgXCJIQVNIXCIsIC8vIFsxNjNdXHJcbiAgICAgICAgXCJET0xMQVJcIiwgLy8gWzE2NF1cclxuICAgICAgICBcIlBFUkNFTlRcIiwgLy8gWzE2NV1cclxuICAgICAgICBcIkFNUEVSU0FORFwiLCAvLyBbMTY2XVxyXG4gICAgICAgIFwiVU5ERVJTQ09SRVwiLCAvLyBbMTY3XVxyXG4gICAgICAgIFwiT1BFTiBQQVJFTlRIRVNJU1wiLCAvLyBbMTY4XVxyXG4gICAgICAgIFwiQ0xPU0UgUEFSRU5USEVTSVNcIiwgLy8gWzE2OV1cclxuICAgICAgICBcIkFTVEVSSVNLXCIsIC8vIFsxNzBdXHJcbiAgICAgICAgXCJQTFVTXCIsIC8vIFsxNzFdXHJcbiAgICAgICAgXCJQSVBFXCIsIC8vIFsxNzJdXHJcbiAgICAgICAgXCJIWVBIRU5cIiwgLy8gWzE3M11cclxuICAgICAgICBcIk9QRU4gQ1VSTFkgQlJBQ0tFVFwiLCAvLyBbMTc0XVxyXG4gICAgICAgIFwiQ0xPU0UgQ1VSTFkgQlJBQ0tFVFwiLCAvLyBbMTc1XVxyXG4gICAgICAgIFwiVElMREVcIiwgLy8gWzE3Nl1cclxuICAgICAgICBcIlwiLCAvLyBbMTc3XVxyXG4gICAgICAgIFwiXCIsIC8vIFsxNzhdXHJcbiAgICAgICAgXCJcIiwgLy8gWzE3OV1cclxuICAgICAgICBcIlwiLCAvLyBbMTgwXVxyXG4gICAgICAgIFwiVk9MVU1FIE1VVEVcIiwgLy8gWzE4MV1cclxuICAgICAgICBcIlZPTFVNRSBET1dOXCIsIC8vIFsxODJdXHJcbiAgICAgICAgXCJWT0xVTUUgVVBcIiwgLy8gWzE4M11cclxuICAgICAgICBcIlwiLCAvLyBbMTg0XVxyXG4gICAgICAgIFwiXCIsIC8vIFsxODVdXHJcbiAgICAgICAgXCJTRU1JQ09MT05cIiwgLy8gWzE4Nl1cclxuICAgICAgICBcIkVRVUFMU1wiLCAvLyBbMTg3XVxyXG4gICAgICAgIFwiQ09NTUFcIiwgLy8gWzE4OF1cclxuICAgICAgICBcIk1JTlVTXCIsIC8vIFsxODldXHJcbiAgICAgICAgXCJQRVJJT0RcIiwgLy8gWzE5MF1cclxuICAgICAgICBcIlNMQVNIXCIsIC8vIFsxOTFdXHJcbiAgICAgICAgXCJCQUNLIFFVT1RFXCIsIC8vIFsxOTJdXHJcbiAgICAgICAgXCJcIiwgLy8gWzE5M11cclxuICAgICAgICBcIlwiLCAvLyBbMTk0XVxyXG4gICAgICAgIFwiXCIsIC8vIFsxOTVdXHJcbiAgICAgICAgXCJcIiwgLy8gWzE5Nl1cclxuICAgICAgICBcIlwiLCAvLyBbMTk3XVxyXG4gICAgICAgIFwiXCIsIC8vIFsxOThdXHJcbiAgICAgICAgXCJcIiwgLy8gWzE5OV1cclxuICAgICAgICBcIlwiLCAvLyBbMjAwXVxyXG4gICAgICAgIFwiXCIsIC8vIFsyMDFdXHJcbiAgICAgICAgXCJcIiwgLy8gWzIwMl1cclxuICAgICAgICBcIlwiLCAvLyBbMjAzXVxyXG4gICAgICAgIFwiXCIsIC8vIFsyMDRdXHJcbiAgICAgICAgXCJcIiwgLy8gWzIwNV1cclxuICAgICAgICBcIlwiLCAvLyBbMjA2XVxyXG4gICAgICAgIFwiXCIsIC8vIFsyMDddXHJcbiAgICAgICAgXCJcIiwgLy8gWzIwOF1cclxuICAgICAgICBcIlwiLCAvLyBbMjA5XVxyXG4gICAgICAgIFwiXCIsIC8vIFsyMTBdXHJcbiAgICAgICAgXCJcIiwgLy8gWzIxMV1cclxuICAgICAgICBcIlwiLCAvLyBbMjEyXVxyXG4gICAgICAgIFwiXCIsIC8vIFsyMTNdXHJcbiAgICAgICAgXCJcIiwgLy8gWzIxNF1cclxuICAgICAgICBcIlwiLCAvLyBbMjE1XVxyXG4gICAgICAgIFwiXCIsIC8vIFsyMTZdXHJcbiAgICAgICAgXCJcIiwgLy8gWzIxN11cclxuICAgICAgICBcIlwiLCAvLyBbMjE4XVxyXG4gICAgICAgIFwiT1BFTiBCUkFDS0VUXCIsIC8vIFsyMTldXHJcbiAgICAgICAgXCJCQUNLIFNMQVNIXCIsIC8vIFsyMjBdXHJcbiAgICAgICAgXCJDTE9TRSBCUkFDS0VUXCIsIC8vIFsyMjFdXHJcbiAgICAgICAgXCJRVU9URVwiLCAvLyBbMjIyXVxyXG4gICAgICAgIFwiXCIsIC8vIFsyMjNdXHJcbiAgICAgICAgXCJNRVRBXCIsIC8vIFsyMjRdXHJcbiAgICAgICAgXCJBTFQgR1JBUEhcIiwgLy8gWzIyNV1cclxuICAgICAgICBcIlwiLCAvLyBbMjI2XVxyXG4gICAgICAgIFwiV0lOIElDTyBIRUxQXCIsIC8vIFsyMjddXHJcbiAgICAgICAgXCJXSU4gSUNPIDAwXCIsIC8vIFsyMjhdXHJcbiAgICAgICAgXCJcIiwgLy8gWzIyOV1cclxuICAgICAgICBcIldJTiBJQ08gQ0xFQVJcIiwgLy8gWzIzMF1cclxuICAgICAgICBcIlwiLCAvLyBbMjMxXVxyXG4gICAgICAgIFwiXCIsIC8vIFsyMzJdXHJcbiAgICAgICAgXCJXSU4gT0VNIFJFU0VUXCIsIC8vIFsyMzNdXHJcbiAgICAgICAgXCJXSU4gT0VNIEpVTVBcIiwgLy8gWzIzNF1cclxuICAgICAgICBcIldJTiBPRU0gUEExXCIsIC8vIFsyMzVdXHJcbiAgICAgICAgXCJXSU4gT0VNIFBBMlwiLCAvLyBbMjM2XVxyXG4gICAgICAgIFwiV0lOIE9FTSBQQTNcIiwgLy8gWzIzN11cclxuICAgICAgICBcIldJTiBPRU0gV1NDVFJMXCIsIC8vIFsyMzhdXHJcbiAgICAgICAgXCJXSU4gT0VNIENVU0VMXCIsIC8vIFsyMzldXHJcbiAgICAgICAgXCJXSU4gT0VNIEFUVE5cIiwgLy8gWzI0MF1cclxuICAgICAgICBcIldJTiBPRU0gRklOSVNIXCIsIC8vIFsyNDFdXHJcbiAgICAgICAgXCJXSU4gT0VNIENPUFlcIiwgLy8gWzI0Ml1cclxuICAgICAgICBcIldJTiBPRU0gQVVUT1wiLCAvLyBbMjQzXVxyXG4gICAgICAgIFwiV0lOIE9FTSBFTkxXXCIsIC8vIFsyNDRdXHJcbiAgICAgICAgXCJXSU4gT0VNIEJBQ0tUQUJcIiwgLy8gWzI0NV1cclxuICAgICAgICBcIkFUVE5cIiwgLy8gWzI0Nl1cclxuICAgICAgICBcIkNSU0VMXCIsIC8vIFsyNDddXHJcbiAgICAgICAgXCJFWFNFTFwiLCAvLyBbMjQ4XVxyXG4gICAgICAgIFwiRVJFT0ZcIiwgLy8gWzI0OV1cclxuICAgICAgICBcIlBMQVlcIiwgLy8gWzI1MF1cclxuICAgICAgICBcIlpPT01cIiwgLy8gWzI1MV1cclxuICAgICAgICBcIlwiLCAvLyBbMjUyXVxyXG4gICAgICAgIFwiUEExXCIsIC8vIFsyNTNdXHJcbiAgICAgICAgXCJXSU4gT0VNIENMRUFSXCIsIC8vIFsyNTRdXHJcbiAgICAgICAgXCJUT0dHTEUgVE9VQ0hQQURcIiAvLyBbMjU1XVxyXG4gICAgXS8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzE3NzIxNzkvZ2V0LWNoYXJhY3Rlci12YWx1ZS1mcm9tLWtleWNvZGUtaW4tamF2YXNjcmlwdC10aGVuLXRyaW1cclxufVxyXG5cclxuY29uc3QgQXVkaW9Bc3NldHMgPSB7XHJcbiAgICB1aToge1xyXG4gICAgICAgIGludmVudG9yeUNsYWNrOiBuZXcgQXVkaW9SZXNvdXJjZUdyb3VwKFtuZXcgQXVkaW9SZXNvdXJjZSgnYXNzZXRzL3NvdW5kcy9zZngvdWkvY2xhY2sxLm1wMycpLCBuZXcgQXVkaW9SZXNvdXJjZSgnYXNzZXRzL3NvdW5kcy9zZngvdWkvY2xhY2syLm1wMycpLCBuZXcgQXVkaW9SZXNvdXJjZSgnYXNzZXRzL3NvdW5kcy9zZngvdWkvY2xhY2szLm1wMycpXSlcclxuICAgIH0sXHJcbiAgICBtdXNpYzoge1xyXG4gICAgICAgIHRpdGxlU2NyZWVuOiBuZXcgQXVkaW9SZXNvdXJjZSgnYXNzZXRzL3NvdW5kcy9tdXNpYy9UaXRsZVNjcmVlbi5tcDMnKVxyXG4gICAgfVxyXG59XHJcblxyXG50eXBlIEFuaW1hdGlvbkZyYW1lPFQgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBJbWFnZVJlc291cmNlW10+PiA9IGtleW9mIFRcclxuXHJcbi8vIGNvbnN0IGFuaW1hdGlvbnMgPSA8VCBleHRlbmRzIFJlY29yZDxzdHJpbmcsIEltYWdlUmVzb3VyY2VbXT4+KGRhdGE6IFQpOiBUID0+IGRhdGFcclxuXHJcbmNvbnN0IFBsYXllckFuaW1hdGlvbnMgPSB7XHJcbiAgICBpZGxlOiBbXHJcbiAgICAgICAgbmV3IFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3BsYXllci9jaGFyYWN0ZXIucG5nJyksXHJcbiAgICBdXHJcbn1cclxuXHJcblxyXG5jb25zdCBsb2FkQXNzZXRzID0gKHNrZXRjaDogUDUsIC4uLmFzc2V0czogQXNzZXRHcm91cFtdKSA9PiB7XHJcbiAgICBhc3NldHMuZm9yRWFjaCgoYXNzZXRHcm91cCkgPT4ge1xyXG4gICAgICAgIHNlYXJjaEdyb3VwKGFzc2V0R3JvdXAsIHNrZXRjaCk7XHJcbiAgICB9KTtcclxuXHJcbn07XHJcblxyXG5mdW5jdGlvbiBzZWFyY2hHcm91cChhc3NldEdyb3VwOiBBc3NldEdyb3VwIHwgUmVzb3VyY2UgfCBBdWRpb1Jlc291cmNlIHwgQXVkaW9SZXNvdXJjZUdyb3VwIHwgSW1hZ2VSZXNvdXJjZVtdLCBza2V0Y2g6IFA1KSB7XHJcbiAgICBpZiAoYXNzZXRHcm91cCBpbnN0YW5jZW9mIFJlc291cmNlKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coYExvYWRpbmcgYXNzZXQgJHthc3NldEdyb3VwLnBhdGh9YCk7XHJcbiAgICAgICAgYXNzZXRHcm91cC5sb2FkUmVzb3VyY2Uoc2tldGNoKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBPYmplY3QuZW50cmllcyhhc3NldEdyb3VwKS5mb3JFYWNoKChhc3NldCkgPT4ge1xyXG4gICAgICAgIHNlYXJjaEdyb3VwKGFzc2V0WzFdLCBza2V0Y2gpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCB7IEF1ZGlvQXNzZXRzLCBVaUFzc2V0cywgSXRlbXNBc3NldHMsIFdvcmxkQXNzZXRzLCBGb250cywgS2V5cywgUGxheWVyQW5pbWF0aW9ucywgQW5pbWF0aW9uRnJhbWUsIGxvYWRBc3NldHMgfTtcclxuIiwiaW1wb3J0IFA1IGZyb20gJ3A1JztcclxuaW1wb3J0IFJlc291cmNlIGZyb20gJy4vUmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBBdWRpb1R5cGUgfSBmcm9tICd0cy1hdWRpbyc7XHJcbmltcG9ydCBBdWRpbyBmcm9tICd0cy1hdWRpbyc7XHJcblxyXG5cclxuY2xhc3MgQXVkaW9SZXNvdXJjZSBleHRlbmRzIFJlc291cmNlIHtcclxuICAgIHNvdW5kOiBBdWRpb1R5cGVcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwYXRoOiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcihwYXRoKTtcclxuICAgIH1cclxuXHJcbiAgICBsb2FkUmVzb3VyY2UoZ2FtZTogUDUpIHtcclxuICAgICAgICB0aGlzLnNvdW5kID0gQXVkaW8oe1xyXG4gICAgICAgICAgICBmaWxlOiB0aGlzLnBhdGgsXHJcbiAgICAgICAgICAgIGxvb3A6IGZhbHNlLFxyXG4gICAgICAgICAgICB2b2x1bWU6IDEuMCxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBwbGF5UmFuZG9tKCkge1xyXG4gICAgLy8gICAgIC8vIFZlcmlmeSB0aGF0IHRoZSBzb3VuZCBoYXMgYmVlbiBsb2FkZWRcclxuICAgIC8vICAgICBpZiAodGhpcy5zb3VuZCA9PT0gdW5kZWZpbmVkKVxyXG4gICAgLy8gICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAvLyAgICAgICAgICAgICBgVHJpZWQgdG8gcGxheSBzb3VuZCBiZWZvcmUgbG9hZGluZyBpdDogJHt0aGlzLnBhdGh9YFxyXG4gICAgLy8gICAgICAgICApO1xyXG5cclxuICAgIC8vICAgICB0aGlzLnNvdW5kLnBsYXkoKTtcclxuICAgIC8vIH1cclxuXHJcbiAgICBwbGF5U291bmQoKSB7Ly8gcGxheSB0aGUgc291bmRcclxuICAgICAgICAvL1ZlcmlmeSB0aGF0IHRoZSBzb3VuZCBoYXMgYmVlbiBsb2FkZWRcclxuICAgICAgICBpZiAodGhpcy5zb3VuZCA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAgICAgICAgICAgICBgVHJpZWQgdG8gcGxheSBzb3VuZCBiZWZvcmUgbG9hZGluZyBpdDogJHt0aGlzLnBhdGh9YFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIHRoaXMuc291bmQucGF1c2UoKTtcclxuICAgICAgICB0aGlzLnNvdW5kLnBsYXkoKTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCA9IEF1ZGlvUmVzb3VyY2U7XHJcbiIsImltcG9ydCBBdWRpb1Jlc291cmNlIGZyb20gJy4vQXVkaW9SZXNvdXJjZSc7XHJcbmltcG9ydCBQNSBmcm9tIFwicDVcIjtcclxuXHJcbmNsYXNzIEF1ZGlvUmVzb3VyY2VHcm91cCB7XHJcblxyXG4gICAgc291bmRzOiBBdWRpb1Jlc291cmNlW11cclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihzb3VuZHM6IEF1ZGlvUmVzb3VyY2VbXSkgey8vIHBhc3MgaW4gYW4gYXJyYXkgb2YgQXVkaW9SZXNvdXJjZXMgdGhhdCBhcmUgYWxsIHNpbWlsYXJcclxuICAgICAgICB0aGlzLnNvdW5kcyA9IHNvdW5kcztcclxuICAgIH1cclxuXHJcbiAgICBwbGF5UmFuZG9tKCkgey8vIHBsYXkgYSByYW5kb20gc291bmRcclxuICAgICAgICBpZih0aGlzLnNvdW5kcyA9PT0gdW5kZWZpbmVkIHx8IHRoaXMuc291bmRzLmxlbmd0aCA9PT0gMClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxyXG4gICAgICAgICAgICAgICAgYFRoZXJlIGFyZSBubyBzb3VuZHM6ICR7dGhpcy5zb3VuZHN9YFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIGNvbnN0IHIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0aGlzLnNvdW5kcy5sZW5ndGgpO1xyXG4gICAgICAgIHRoaXMuc291bmRzW3JdLnBsYXlTb3VuZCgpOy8vIHBsYXkgYSByYW5kb20gc291bmQgZnJvbSB0aGUgYXJyYXkgYXQgYSBzbGlnaHRseSByYW5kb21pemVkIHBpdGNoLCBsZWFkaW5nIHRvIHRoZSBlZmZlY3Qgb2YgaXQgbWFraW5nIGEgbmV3IHNvdW5kIGVhY2ggdGltZSwgcmVtb3ZpbmcgcmVwZXRpdGl2ZW5lc3NcclxuXHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQgPSBBdWRpb1Jlc291cmNlR3JvdXA7IiwiaW1wb3J0IEltYWdlUmVzb3VyY2UgZnJvbSAnLi9JbWFnZVJlc291cmNlJztcclxuaW1wb3J0IHA1IGZyb20gJ3A1JztcclxuaW1wb3J0IGdhbWUgZnJvbSAnLi4vLi4vTWFpbidcclxuXHJcbmNsYXNzIEZvbnRSZXNvdXJjZSBleHRlbmRzIEltYWdlUmVzb3VyY2Uge1xyXG5cclxuICAgIGFscGhhYmV0X3NvdXA6IHtbbGV0dGVyOiBzdHJpbmddOiB7eDogbnVtYmVyLCB5OiBudW1iZXIsIHc6IG51bWJlciwgaDogbnVtYmVyfX0gPSB7fVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBhdGg6IHN0cmluZywgY2hhcmFjdGVyRGF0YToge1tsZXR0ZXI6IHN0cmluZ106IG51bWJlcn0sIGNoYXJhY3Rlck9yZGVyOiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcihwYXRoKTtcclxuICAgICAgICBsZXQgcnVubmluZ1RvdGFsID0gMFxyXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGk8Y2hhcmFjdGVyT3JkZXIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5hbHBoYWJldF9zb3VwW2NoYXJhY3Rlck9yZGVyW2ldXSA9IHt4OiBydW5uaW5nVG90YWwsIHk6IDAsIHc6IGNoYXJhY3RlckRhdGFbY2hhcmFjdGVyT3JkZXJbaV1dLCBoOiAxMn1cclxuICAgICAgICAgICAgcnVubmluZ1RvdGFsICs9IGNoYXJhY3RlckRhdGFbY2hhcmFjdGVyT3JkZXJbaV1dICsgMVxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhjaGFyYWN0ZXJPcmRlcltpXStcIjogXCIrY2hhcmFjdGVyRGF0YVtjaGFyYWN0ZXJPcmRlcltpXV0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBkcmF3VGV4dCh0YXJnZXQ6IHA1LCBzdHI6IHN0cmluZywgeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuICAgICAgICBsZXQgeE9mZnNldDogbnVtYmVyID0gMDtcclxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpPHN0ci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4K3hPZmZzZXQqZ2FtZS51cHNjYWxlU2l6ZSwgeSwgdGhpcy5hbHBoYWJldF9zb3VwW3N0cltpXV0udypnYW1lLnVwc2NhbGVTaXplLCB0aGlzLmFscGhhYmV0X3NvdXBbc3RyW2ldXS5oKmdhbWUudXBzY2FsZVNpemUsIHRoaXMuYWxwaGFiZXRfc291cFtzdHJbaV1dLngsIHRoaXMuYWxwaGFiZXRfc291cFtzdHJbaV1dLnksIHRoaXMuYWxwaGFiZXRfc291cFtzdHJbaV1dLncsIHRoaXMuYWxwaGFiZXRfc291cFtzdHJbaV1dLmgpO1xyXG4gICAgICAgICAgICB4T2Zmc2V0ICs9IHRoaXMuYWxwaGFiZXRfc291cFtzdHJbaV1dLncrMTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0ID0gRm9udFJlc291cmNlOyIsImltcG9ydCBQNSBmcm9tICdwNSc7XHJcbmltcG9ydCBSZXNvdXJjZSBmcm9tICcuL1Jlc291cmNlJztcclxuXHJcbmNsYXNzIEltYWdlUmVzb3VyY2UgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgICBpbWFnZTogUDUuSW1hZ2U7XHJcblxyXG4gICAgY29uc3RydWN0b3IocGF0aDogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIocGF0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZFJlc291cmNlKGdhbWU6IFA1KSB7XHJcbiAgICAgICAgdGhpcy5pbWFnZSA9IGdhbWUubG9hZEltYWdlKHRoaXMucGF0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKHRhcmdldDogYW55LCB4OiBudW1iZXIsIHk6IG51bWJlciwgd2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpIHtcclxuICAgICAgICAvLyBWZXJpZnkgdGhhdCB0aGUgdGlsZXMgaGFzIGJlZW4gbG9hZGVkXHJcbiAgICAgICAgaWYgKHRoaXMuaW1hZ2UgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxyXG4gICAgICAgICAgICAgICAgYFRyaWVkIHRvIHJlbmRlciBpbWFnZSBiZWZvcmUgbG9hZGluZyBpdDogJHt0aGlzLnBhdGh9YFxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAvLyBEcmF3IG5vbiB0aWxlcyBpbWFnZVxyXG4gICAgICAgIHRhcmdldC5pbWFnZSh0aGlzLmltYWdlLCB4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgcmVuZGVyUGFydGlhbChcclxuICAgICAgICB0YXJnZXQ6IGFueSxcclxuICAgICAgICB4OiBudW1iZXIsXHJcbiAgICAgICAgeTogbnVtYmVyLFxyXG4gICAgICAgIHdpZHRoOiBudW1iZXIsXHJcbiAgICAgICAgaGVpZ2h0OiBudW1iZXIsXHJcbiAgICAgICAgc291cmNlWD86IG51bWJlcixcclxuICAgICAgICBzb3VyY2VZPzogbnVtYmVyLFxyXG4gICAgICAgIHNvdXJjZVdpZHRoPzogbnVtYmVyLFxyXG4gICAgICAgIHNvdXJjZUhlaWdodD86IG51bWJlclxyXG4gICAgKSB7XHJcbiAgICAgICAgLy8gVmVyaWZ5IHRoYXQgdGhlIHRpbGVzIGhhcyBiZWVuIGxvYWRlZFxyXG4gICAgICAgIGlmICh0aGlzLmltYWdlID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcclxuICAgICAgICAgICAgICAgIGBUcmllZCB0byByZW5kZXIgaW1hZ2UgYmVmb3JlIGxvYWRpbmcgaXQ6ICR7dGhpcy5wYXRofWBcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgLy8gRHJhdyBhIHBhcnRpYWwgcGFydCBvZiB0aGUgaW1hZ2VcclxuICAgICAgICB0YXJnZXQuaW1hZ2UoXHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2UsXHJcbiAgICAgICAgICAgIHgsXHJcbiAgICAgICAgICAgIHksXHJcbiAgICAgICAgICAgIHdpZHRoLFxyXG4gICAgICAgICAgICBoZWlnaHQsXHJcbiAgICAgICAgICAgIHNvdXJjZVgsXHJcbiAgICAgICAgICAgIHNvdXJjZVksXHJcbiAgICAgICAgICAgIHNvdXJjZVdpZHRoLFxyXG4gICAgICAgICAgICBzb3VyY2VIZWlnaHRcclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgPSBJbWFnZVJlc291cmNlO1xyXG4iLCJpbXBvcnQgUmVzb3VyY2UgZnJvbSBcIi4vUmVzb3VyY2VcIjtcclxuaW1wb3J0IFA1IGZyb20gJ3A1JztcclxuaW1wb3J0IHtXb3JsZFRpbGVzfSBmcm9tICcuLi8uLi93b3JsZC9Xb3JsZFRpbGVzJ1xyXG5pbXBvcnQgeyBUaWxlVHlwZSB9IGZyb20gXCIuLi8uLi8uLi8uLi9hcGkvVGlsZVwiO1xyXG5pbXBvcnQgR2FtZSBmcm9tIFwiLi4vLi4vR2FtZVwiO1xyXG5pbXBvcnQgeyBXb3JsZEFzc2V0cyB9IGZyb20gXCIuLi9Bc3NldHNcIjtcclxuXHJcbmV4cG9ydCA9IGNsYXNzIFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZSBleHRlbmRzIFJlc291cmNlIHtcclxuXHJcbiAgICBpbWFnZTogUDUuSW1hZ2U7XHJcbiAgICBoYXNSZWZsZWN0aW9uOiBib29sZWFuID0gZmFsc2U7O1xyXG4gICAgcmVmbGVjdGlvbjogUDUuSW1hZ2U7XHJcblxyXG4gICAgY29uc3RydWN0b3IocGF0aDogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIocGF0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZFJlc291cmNlKGdhbWU6IFA1KSB7XHJcbiAgICAgICAgdGhpcy5pbWFnZSA9IGdhbWUubG9hZEltYWdlKHRoaXMucGF0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKHRhcmdldDogYW55LCB4OiBudW1iZXIsIHk6IG51bWJlciwgd2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpIHtcclxuICAgICAgICAvLyBWZXJpZnkgdGhhdCB0aGUgdGlsZXMgaGFzIGJlZW4gbG9hZGVkXHJcbiAgICAgICAgaWYgKHRoaXMuaW1hZ2UgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxyXG4gICAgICAgICAgICAgICAgYFRyaWVkIHRvIHJlbmRlciBpbWFnZSBiZWZvcmUgbG9hZGluZyBpdDogJHt0aGlzLnBhdGh9YFxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAvLyBEcmF3IG5vbiB0aWxlcyBpbWFnZVxyXG4gICAgICAgIHRhcmdldC5pbWFnZSh0aGlzLmltYWdlLCB4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcmVuZGVyV29ybGRzcGFjZVJlZmxlY3Rpb24odGFyZ2V0OiBHYW1lLCB4OiBudW1iZXIsIHk6IG51bWJlciwgd2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpIHsvL3RoaXMgaXMgYnJva2VuXHJcbiAgICAgICAgaWYgKHRoaXMuaW1hZ2UgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxyXG4gICAgICAgICAgICAgICAgYFRyaWVkIHRvIHJlbmRlciByZWZsZWN0aW9uIG9mIGltYWdlIGJlZm9yZSBsb2FkaW5nIGl0OiAke3RoaXMucGF0aH1gXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgaWYoIXRoaXMuaGFzUmVmbGVjdGlvbikgey8vdGhpcyBpcyBzbyBpdCBkb2Vzbid0IGxvYWQgdGhlbSBhbGwgYXQgb25jZSBhbmQgaW5zdGVhZCBtYWtlcyB0aGUgcmVmbGVjdGlvbnMgd2hlbiB0aGV5IGFyZSBuZWVkZWRcclxuICAgICAgICAgICAgdGhpcy5oYXNSZWZsZWN0aW9uID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5yZWZsZWN0aW9uID0gdGFyZ2V0LmNyZWF0ZUltYWdlKHRoaXMuaW1hZ2Uud2lkdGgsIHRoaXMuaW1hZ2UuaGVpZ2h0KTtcclxuICAgICAgICAgICAgdGhpcy5yZWZsZWN0aW9uLmxvYWRQaXhlbHMoKTtcclxuICAgICAgICAgICAgdGhpcy5pbWFnZS5sb2FkUGl4ZWxzKCk7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaSA9IDA7IGk8dGhpcy5yZWZsZWN0aW9uLndpZHRoOyBpKyspIHsvL2dlbmVyYXRlIGEgcmVmbGVjdGlvbiBpbWFnZSB0aGF0IGlzIGRpc3BsYXllZCBhcyBhIHJlZmxlY3Rpb25cclxuICAgICAgICAgICAgICAgIGZvcihsZXQgaiA9IDA7IGo8dGhpcy5yZWZsZWN0aW9uLmhlaWdodDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yKGxldCBrID0gMDsgazwzOyBrKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWZsZWN0aW9uLnBpeGVsc1s0KihqKnRoaXMucmVmbGVjdGlvbi53aWR0aCtpKStrXSA9IHRoaXMuaW1hZ2UucGl4ZWxzWzQqKCh0aGlzLmltYWdlLmhlaWdodC1qLTEpKnRoaXMuaW1hZ2Uud2lkdGgraSkra107XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVmbGVjdGlvbi5waXhlbHNbNCooaip0aGlzLnJlZmxlY3Rpb24ud2lkdGgraSkrM10gPSBcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmltYWdlLnBpeGVsc1s0KigodGhpcy5pbWFnZS5oZWlnaHQtai0xKSp0aGlzLmltYWdlLndpZHRoK2kpKzNdICogXHJcbiAgICAgICAgICAgICAgICAgICAgKCh0aGlzLnJlZmxlY3Rpb24uaGVpZ2h0LWopL3RoaXMucmVmbGVjdGlvbi5oZWlnaHQpICogXHJcbiAgICAgICAgICAgICAgICAgICAgKHRoaXMucmVmbGVjdGlvbi53aWR0aC8yKzAuNS1NYXRoLmFicyhpLXRoaXMucmVmbGVjdGlvbi53aWR0aC8yKzAuNSkpLyh0aGlzLnJlZmxlY3Rpb24ud2lkdGgvMik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5yZWZsZWN0aW9uLnVwZGF0ZVBpeGVscygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAgICAgdGFyZ2V0LmZpbGwoMjU1LCAwLCAwKTtcclxuICAgICAgICAgICAgdGFyZ2V0LnN0cm9rZSgxNTAsIDAsIDApO1xyXG5cclxuICAgICAgICAvL2xvb3AgdGhyb3VnaCBldmVyeSB0aWxlIGl0IHBhc3NlcyB0aHJvdWdoXHJcbiAgICAgICAgZm9yKGxldCBpID0gTWF0aC5mbG9vcih4KTsgaTx4K3dpZHRoOyBpKyspIHtcclxuICAgICAgICAgICAgZm9yKGxldCBqID0gTWF0aC5mbG9vcih5KTsgajx5K2hlaWdodDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0YXJnZXQud29ybGQpO1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2codGFyZ2V0LndvcmxkLndvcmxkVGlsZXMpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGN1cnJlbnRCbG9jazogVGlsZVR5cGUgPSB0YXJnZXQud29ybGQud29ybGRUaWxlc1tqICogdGFyZ2V0LndvcmxkV2lkdGggKyBpXTtcclxuICAgICAgICAgICAgICAgIGlmKGN1cnJlbnRCbG9jayA9PT0gdW5kZWZpbmVkIHx8IGN1cnJlbnRCbG9jayA9PT0gVGlsZVR5cGUuQWlyIHx8IGN1cnJlbnRCbG9jayA9PT0gVGlsZVR5cGUuVGlsZUVudGl0eSkgey8vdGhlIHJlZmVyZW5jZSB0byBUaWxlRW50aXR5IGNhbiBiZSByZW1vdmVkIGFzIHNvb24gYXMgdGhlIGJldHRlciBzeXN0ZW0gaXMgaW4gcGxhY2VcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRhcmdldC50aW50KDI1NSwgNTApOy8vbWFrZSBpdCBzb21ld2hhdCB0cmFuc2x1Y2VudCBiYXNlZCBvbiB0aGUgcmVmbGVjdGl2aXR5IG9mIHRoZSB0aWxlXHJcbiAgICAgICAgICAgICAgICB0YXJnZXQuaW1hZ2UoXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWZsZWN0aW9uLFxyXG4gICAgICAgICAgICAgICAgICAgIChpICogdGFyZ2V0LlRJTEVfV0lEVEggLVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQuaW50ZXJwb2xhdGVkQ2FtWCAqIHRhcmdldC5USUxFX1dJRFRIKSAqXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldC51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgKGogKiB0YXJnZXQuVElMRV9IRUlHSFQgLVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LmludGVycG9sYXRlZENhbVkgKiB0YXJnZXQuVElMRV9IRUlHSFQpICpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldC51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXQuVElMRV9XSURUSCp0YXJnZXQudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LlRJTEVfSEVJR0hUKnRhcmdldC51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICAoaS14KSp0YXJnZXQuVElMRV9XSURUSCxcclxuICAgICAgICAgICAgICAgICAgICAoai15KSp0YXJnZXQuVElMRV9IRUlHSFQsXHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LlRJTEVfV0lEVEgsXHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LlRJTEVfSEVJR0hUXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0Lm5vVGludCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlclBhcnRpYWwoXHJcbiAgICAgICAgdGFyZ2V0OiBhbnksXHJcbiAgICAgICAgeDogbnVtYmVyLFxyXG4gICAgICAgIHk6IG51bWJlcixcclxuICAgICAgICB3aWR0aDogbnVtYmVyLFxyXG4gICAgICAgIGhlaWdodDogbnVtYmVyLFxyXG4gICAgICAgIHNvdXJjZVg/OiBudW1iZXIsXHJcbiAgICAgICAgc291cmNlWT86IG51bWJlcixcclxuICAgICAgICBzb3VyY2VXaWR0aD86IG51bWJlcixcclxuICAgICAgICBzb3VyY2VIZWlnaHQ/OiBudW1iZXJcclxuICAgICkge1xyXG4gICAgICAgIC8vIFZlcmlmeSB0aGF0IHRoZSB0aWxlcyBoYXMgYmVlbiBsb2FkZWRcclxuICAgICAgICBpZiAodGhpcy5pbWFnZSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAgICAgICAgICAgICBgVHJpZWQgdG8gcmVuZGVyIGltYWdlIGJlZm9yZSBsb2FkaW5nIGl0OiAke3RoaXMucGF0aH1gXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIC8vIERyYXcgYSBwYXJ0aWFsIHBhcnQgb2YgdGhlIGltYWdlXHJcbiAgICAgICAgdGFyZ2V0LmltYWdlKFxyXG4gICAgICAgICAgICB0aGlzLmltYWdlLFxyXG4gICAgICAgICAgICB4LFxyXG4gICAgICAgICAgICB5LFxyXG4gICAgICAgICAgICB3aWR0aCxcclxuICAgICAgICAgICAgaGVpZ2h0LFxyXG4gICAgICAgICAgICBzb3VyY2VYLFxyXG4gICAgICAgICAgICBzb3VyY2VZLFxyXG4gICAgICAgICAgICBzb3VyY2VXaWR0aCxcclxuICAgICAgICAgICAgc291cmNlSGVpZ2h0XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufSIsImltcG9ydCBQNSBmcm9tICdwNSc7XHJcblxyXG5hYnN0cmFjdCBjbGFzcyBSZXNvdXJjZSB7XHJcbiAgICBwYXRoOiBzdHJpbmc7XHJcblxyXG4gICAgcHJvdGVjdGVkIGNvbnN0cnVjdG9yKHBhdGg6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMucGF0aCA9IHBhdGg7XHJcbiAgICB9XHJcblxyXG4gICAgYWJzdHJhY3QgbG9hZFJlc291cmNlKHNrZXRjaDogUDUpOiB2b2lkO1xyXG59XHJcblxyXG5leHBvcnQgPSBSZXNvdXJjZTtcclxuIiwiaW1wb3J0IEltYWdlUmVzb3VyY2UgZnJvbSAnLi9JbWFnZVJlc291cmNlJztcclxuXHJcbmNsYXNzIFRpbGVSZXNvdXJjZSBleHRlbmRzIEltYWdlUmVzb3VyY2Uge1xyXG4gICAgLy8gVGhlIHdpZHRoIGFuZCBoZWlnaHQgb2YgdGhlIHRpbGVzIHNldFxyXG4gICAgd2lkdGg6IG51bWJlcjtcclxuICAgIGhlaWdodDogbnVtYmVyO1xyXG5cclxuICAgIC8vIFRoZSB3aWR0aCBhbmQgaGVpZ2h0IG9mIGVhY2ggdGlsZXMgaW4gcGl4ZWxzXHJcbiAgICB0aWxlV2lkdGg6IG51bWJlcjtcclxuICAgIHRpbGVIZWlnaHQ6IG51bWJlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBwYXRoOiBzdHJpbmcsXHJcbiAgICAgICAgd2lkdGg6IG51bWJlcixcclxuICAgICAgICBoZWlnaHQ6IG51bWJlcixcclxuICAgICAgICB0aWxlV2lkdGg6IG51bWJlcixcclxuICAgICAgICB0aWxlSGVpZ2h0OiBudW1iZXJcclxuICAgICkge1xyXG4gICAgICAgIHN1cGVyKHBhdGgpO1xyXG4gICAgICAgIHRoaXMud2lkdGggPSB3aWR0aDtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcclxuICAgICAgICB0aGlzLnRpbGVXaWR0aCA9IHRpbGVXaWR0aDtcclxuICAgICAgICB0aGlzLnRpbGVIZWlnaHQgPSB0aWxlSGVpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlclRpbGUoXHJcbiAgICAgICAgaTogbnVtYmVyLFxyXG4gICAgICAgIHRhcmdldDogYW55LFxyXG4gICAgICAgIHg6IG51bWJlcixcclxuICAgICAgICB5OiBudW1iZXIsXHJcbiAgICAgICAgd2lkdGg6IG51bWJlcixcclxuICAgICAgICBoZWlnaHQ6IG51bWJlclxyXG4gICAgKSB7XHJcbiAgICAgICAgY29uc3QgdGlsZVNldFggPSBpICUgdGhpcy53aWR0aDtcclxuICAgICAgICBjb25zdCB0aWxlU2V0WSA9IE1hdGguZmxvb3IoaSAvIHRoaXMud2lkdGgpO1xyXG5cclxuICAgICAgICAvLyBNYWtlIHN1cmUgdGhlIHRpbGVzIGlzbid0IG91dCBvZiBib3VuZHNcclxuICAgICAgICBpZiAodGlsZVNldFkgPiB0aGlzLmhlaWdodClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxyXG4gICAgICAgICAgICAgICAgYE91dCBvZiBib3VuZHMgdGlsZS4gVHJpZWQgdG8gcmVuZGVyIHRpbGUgaW5kZXggJHtpfSB3aXRoIGEgbWF4aW11bSBvZiAke1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMud2lkdGggKiB0aGlzLmhlaWdodFxyXG4gICAgICAgICAgICAgICAgfSB0aWxlc2BcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgc3VwZXIucmVuZGVyUGFydGlhbChcclxuICAgICAgICAgICAgdGFyZ2V0LFxyXG4gICAgICAgICAgICB4LFxyXG4gICAgICAgICAgICB5LFxyXG4gICAgICAgICAgICB3aWR0aCxcclxuICAgICAgICAgICAgaGVpZ2h0LFxyXG4gICAgICAgICAgICB0aWxlU2V0WCAqIHRoaXMudGlsZVdpZHRoLFxyXG4gICAgICAgICAgICB0aWxlU2V0WSAqIHRoaXMudGlsZUhlaWdodCxcclxuICAgICAgICAgICAgdGhpcy50aWxlV2lkdGgsXHJcbiAgICAgICAgICAgIHRoaXMudGlsZUhlaWdodFxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VGlsZUF0Q29vcmRpbmF0ZShcclxuICAgICAgICB4OiBudW1iZXIsXHJcbiAgICAgICAgeTogbnVtYmVyLFxyXG4gICAgICAgIHRhcmdldDogYW55LFxyXG4gICAgICAgIHhQb3M6IG51bWJlcixcclxuICAgICAgICB5UG9zOiBudW1iZXIsXHJcbiAgICAgICAgd2lkdGg6IG51bWJlcixcclxuICAgICAgICBoZWlnaHQ6IG51bWJlclxyXG4gICAgKSB7XHJcbiAgICAgICAgaWYgKHggPiB0aGlzLndpZHRoIHx8IHkgPiB0aGlzLmhlaWdodCB8fCB4IDwgMCB8fCB5IDwgMClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxyXG4gICAgICAgICAgICAgICAgYE91dCBvZiBib3VuZHMgdGlsZS4gVHJpZWQgdG8gbG9hZCB0aWxlIGF0ICR7eH0sICR7eX0gb24gYSAke3RoaXMud2lkdGh9LCAke3RoaXMuaGVpZ2h0fSBncmlkYFxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICBzdXBlci5yZW5kZXJQYXJ0aWFsKFxyXG4gICAgICAgICAgICB0YXJnZXQsXHJcbiAgICAgICAgICAgIHhQb3MsXHJcbiAgICAgICAgICAgIHlQb3MsXHJcbiAgICAgICAgICAgIHdpZHRoLFxyXG4gICAgICAgICAgICBoZWlnaHQsXHJcbiAgICAgICAgICAgIHggKiB0aGlzLnRpbGVXaWR0aCxcclxuICAgICAgICAgICAgeSAqIHRoaXMudGlsZUhlaWdodCxcclxuICAgICAgICAgICAgdGhpcy50aWxlV2lkdGgsXHJcbiAgICAgICAgICAgIHRoaXMudGlsZUhlaWdodFxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCA9IFRpbGVSZXNvdXJjZTtcclxuIiwiZXhwb3J0IGNsYXNzIENvbnRyb2wge1xyXG4gICAga2V5Ym9hcmQ6IGJvb2xlYW5cclxuICAgIGtleUNvZGU6IG51bWJlclxyXG4gICAgZGVzY3JpcHRpb246IHN0cmluZ1xyXG4gICAgb25QcmVzc2VkOiAoKSA9PiB2b2lkXHJcbiAgICBvblJlbGVhc2VkOiAoKSA9PiB2b2lkXHJcblxyXG4gICAgY29uc3RydWN0b3IoZGVzY3JpcHRpb246IHN0cmluZywga2V5Ym9hcmQ6IGJvb2xlYW4sIGtleUNvZGU6IG51bWJlciwgb25QcmVzc2VkOiAoKSA9PiB2b2lkLCBvblJlbGVhc2VkPzogKCkgPT4gdm9pZCkge1xyXG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvblxyXG4gICAgICAgIHRoaXMua2V5Ym9hcmQgPSBrZXlib2FyZDtcclxuICAgICAgICB0aGlzLmtleUNvZGUgPSBrZXlDb2RlO1xyXG4gICAgICAgIHRoaXMub25QcmVzc2VkID0gb25QcmVzc2VkO1xyXG4gICAgICAgIHRoaXMub25SZWxlYXNlZCA9IG9uUmVsZWFzZWQgfHwgZnVuY3Rpb24oKXt9Oy8vZm9yIHNvbWUgcmVhc29uIGFycm93IGZ1bmN0aW9uIGRvZXNuJ3QgbGlrZSB0byBleGlzdCBoZXJlIGJ1dCBpJ20gbm90IGdvbm5hIHdvcnJ5IHRvbyBtdWNoXHJcbiAgICAgICAgLy9pZiBpdCdzIHRvbyB1Z2x5LCB5b3UgY2FuIHRyeSB0byBmaXggaXRcclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgUmVuZGVyYWJsZSBmcm9tICcuLi9pbnRlcmZhY2VzL1JlbmRlcmFibGUnO1xyXG5pbXBvcnQgcDUgZnJvbSAncDUnO1xyXG5pbXBvcnQgeyBBdWRpb0Fzc2V0cywgVWlBc3NldHMgfSBmcm9tICcuLi9hc3NldHMvQXNzZXRzJztcclxuaW1wb3J0IEltYWdlUmVzb3VyY2UgZnJvbSAnLi4vYXNzZXRzL3Jlc291cmNlcy9JbWFnZVJlc291cmNlJztcclxuaW1wb3J0IEZvbnRSZXNvdXJjZSBmcm9tICcuLi9hc3NldHMvcmVzb3VyY2VzL0ZvbnRSZXNvdXJjZSc7XHJcblxyXG5jbGFzcyBCdXR0b24gaW1wbGVtZW50cyBSZW5kZXJhYmxlIHtcclxuXHJcbiAgICBmb250OiBGb250UmVzb3VyY2VcclxuICAgIHR4dDogc3RyaW5nXHJcbiAgICBkZXNjcmlwdGlvbjogc3RyaW5nXHJcbiAgICBvblByZXNzZWRDdXN0b206IEZ1bmN0aW9uXHJcbiAgICB4OiBudW1iZXJcclxuICAgIHk6IG51bWJlclxyXG4gICAgdzogbnVtYmVyXHJcbiAgICBoOiBudW1iZXJcclxuICAgIGltYWdlOiBJbWFnZVJlc291cmNlXHJcbiAgICBtb3VzZUlzT3ZlcjogYm9vbGVhblxyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIGZvbnQ6IEZvbnRSZXNvdXJjZSxcclxuICAgICAgICB0eHQ6IHN0cmluZyxcclxuICAgICAgICBkZXNjcmlwdGlvbjogc3RyaW5nLFxyXG4gICAgICAgIHg6IG51bWJlcixcclxuICAgICAgICB5OiBudW1iZXIsXHJcbiAgICAgICAgdzogbnVtYmVyLFxyXG4gICAgICAgIGg6IG51bWJlcixcclxuICAgICAgICBvblByZXNzZWRDdXN0b206IEZ1bmN0aW9uKSB7XHJcbiAgICAgICAgdGhpcy5mb250ID0gZm9udDtcclxuICAgICAgICB0aGlzLnR4dCA9IHR4dFxyXG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvblxyXG4gICAgICAgIHRoaXMub25QcmVzc2VkQ3VzdG9tID0gb25QcmVzc2VkQ3VzdG9tXHJcbiAgICAgICAgdGhpcy54ID0geFxyXG4gICAgICAgIHRoaXMueSA9IHlcclxuICAgICAgICB0aGlzLncgPSB3XHJcbiAgICAgICAgdGhpcy5oID0gaFxyXG4gICAgICAgIHRoaXMuaW1hZ2UgPSBVaUFzc2V0cy5idXR0b25fdW5zZWxlY3RlZDtcclxuICAgICAgICB0aGlzLm1vdXNlSXNPdmVyID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKHRhcmdldDogcDUsIHVwc2NhbGVTaXplOiBudW1iZXIpIHtcclxuICAgICAgICAvLyBzZXQgdGhlIGNvb3JkcyBhbmQgZGltZW5zaW9ucyB0byByb3VuZCB0byB0aGUgbmVhcmVzdCB1bi11cHNjYWxlZCBwaXhlbFxyXG4gICAgICAgIGNvbnN0IHggPSBNYXRoLnJvdW5kKHRoaXMueCAvIHVwc2NhbGVTaXplKSAqIHVwc2NhbGVTaXplO1xyXG4gICAgICAgIGNvbnN0IHkgPSBNYXRoLnJvdW5kKHRoaXMueSAvIHVwc2NhbGVTaXplKSAqIHVwc2NhbGVTaXplO1xyXG4gICAgICAgIGNvbnN0IHcgPSBNYXRoLnJvdW5kKHRoaXMudyAvIHVwc2NhbGVTaXplKSAqIHVwc2NhbGVTaXplO1xyXG4gICAgICAgIGNvbnN0IGggPSBNYXRoLnJvdW5kKHRoaXMuaCAvIHVwc2NhbGVTaXplKSAqIHVwc2NhbGVTaXplO1xyXG5cclxuICAgICAgICAvLyBjb3JuZXJzXHJcbiAgICAgICAgdGhpcy5pbWFnZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCwgeSwgNyAqIHVwc2NhbGVTaXplLCA3ICogdXBzY2FsZVNpemUsIDAsIDAsIDcsIDcpO1xyXG4gICAgICAgIHRoaXMuaW1hZ2UucmVuZGVyUGFydGlhbCh0YXJnZXQsIHggKyB3IC0gNyAqIHVwc2NhbGVTaXplLCB5LCA3ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgOCwgMCwgNywgNyk7XHJcbiAgICAgICAgdGhpcy5pbWFnZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCwgeSArIGggLSA3ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCAwLCA4LCA3LCA3KTtcclxuICAgICAgICB0aGlzLmltYWdlLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4ICsgdyAtIDcgKiB1cHNjYWxlU2l6ZSwgeSArIGggLSA3ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCA4LCA4LCA3LCA3KTtcclxuXHJcbiAgICAgICAgLy8gdG9wIGFuZCBib3R0b21cclxuICAgICAgICB0aGlzLmltYWdlLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4ICsgNyAqIHVwc2NhbGVTaXplLCB5LCB3IC0gMTQgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCA3LCAwLCAxLCA3KTtcclxuICAgICAgICB0aGlzLmltYWdlLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4ICsgNyAqIHVwc2NhbGVTaXplLCB5ICsgaCAtIDcgKiB1cHNjYWxlU2l6ZSwgdyAtIDE0ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgNywgOCwgMSwgNyk7XHJcblxyXG4gICAgICAgIC8vIGxlZnQgYW5kIHJpZ2h0XHJcbiAgICAgICAgdGhpcy5pbWFnZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCwgeSArIDcgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCBoIC0gMTQgKiB1cHNjYWxlU2l6ZSwgMCwgNywgNywgMSk7XHJcbiAgICAgICAgdGhpcy5pbWFnZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCArIHcgLSA3ICogdXBzY2FsZVNpemUsIHkgKyA3ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgaCAtIDE0ICogdXBzY2FsZVNpemUsIDgsIDcsIDcsIDEpO1xyXG5cclxuICAgICAgICAvLyBjZW50ZXJcclxuICAgICAgICB0aGlzLmltYWdlLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4ICsgNyAqIHVwc2NhbGVTaXplLCB5ICsgNyAqIHVwc2NhbGVTaXplLCB3IC0gMTQgKiB1cHNjYWxlU2l6ZSwgaCAtIDE0ICogdXBzY2FsZVNpemUsIDcsIDcsIDEsIDEpO1xyXG5cclxuICAgICAgICB0aGlzLmZvbnQuZHJhd1RleHQodGFyZ2V0LCB0aGlzLnR4dCwgeCArIDYgKiB1cHNjYWxlU2l6ZSwgTWF0aC5yb3VuZCgodGhpcy55ICsgdGhpcy5oIC8gMikgLyB1cHNjYWxlU2l6ZSkgKiB1cHNjYWxlU2l6ZSAtIDYgKiB1cHNjYWxlU2l6ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlTW91c2VPdmVyKG1vdXNlWDogbnVtYmVyLCBtb3VzZVk6IG51bWJlcikge1xyXG4gICAgICAgIC8vIGlmIHRoZSBtb3VzZSBwb3NpdGlvbiBpcyBpbnNpZGUgdGhlIGJ1dHRvbiwgcmV0dXJuIHRydWVcclxuICAgICAgICBpZiAobW91c2VYID4gdGhpcy54ICYmIG1vdXNlWCA8IHRoaXMueCArIHRoaXMudyAmJiBtb3VzZVkgPiB0aGlzLnkgJiYgbW91c2VZIDwgdGhpcy55ICsgdGhpcy5oKSB7XHJcbiAgICAgICAgICAgIHRoaXMubW91c2VJc092ZXIgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLmltYWdlID0gVWlBc3NldHMuYnV0dG9uX3NlbGVjdGVkO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5tb3VzZUlzT3ZlciA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLmltYWdlID0gVWlBc3NldHMuYnV0dG9uX3Vuc2VsZWN0ZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9uUHJlc3NlZCgpIHtcclxuICAgICAgICB0aGlzLm9uUHJlc3NlZEN1c3RvbSgpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiYnV0dG9uIHByZXNzZWRcIik7XHJcbiAgICAgICAgQXVkaW9Bc3NldHMudWkuaW52ZW50b3J5Q2xhY2sucGxheVJhbmRvbSgpO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuZXhwb3J0ID0gQnV0dG9uOyIsImltcG9ydCBSZW5kZXJhYmxlIGZyb20gJy4uL2ludGVyZmFjZXMvUmVuZGVyYWJsZSc7XHJcbmltcG9ydCBwNSBmcm9tICdwNSc7XHJcbmltcG9ydCB7IEtleXMsIFVpQXNzZXRzIH0gZnJvbSAnLi4vYXNzZXRzL0Fzc2V0cyc7XHJcbmltcG9ydCBJbWFnZVJlc291cmNlIGZyb20gJy4uL2Fzc2V0cy9yZXNvdXJjZXMvSW1hZ2VSZXNvdXJjZSc7XHJcbmltcG9ydCBGb250UmVzb3VyY2UgZnJvbSAnLi4vYXNzZXRzL3Jlc291cmNlcy9Gb250UmVzb3VyY2UnO1xyXG5cclxuY2xhc3MgSW5wdXRCb3ggaW1wbGVtZW50cyBSZW5kZXJhYmxlIHtcclxuXHJcbiAgICBmb250OiBGb250UmVzb3VyY2VcclxuICAgIHR4dDogc3RyaW5nXHJcbiAgICB2YWx1ZTogbnVtYmVyXHJcbiAgICBrZXlib2FyZDogYm9vbGVhblxyXG4gICAgaW5kZXg6IG51bWJlclxyXG4gICAgeDogbnVtYmVyXHJcbiAgICB5OiBudW1iZXJcclxuICAgIHc6IG51bWJlclxyXG4gICAgaDogbnVtYmVyXHJcbiAgICBpbWFnZTogSW1hZ2VSZXNvdXJjZVxyXG4gICAgbW91c2VJc092ZXI6IGJvb2xlYW5cclxuICAgIGxpc3RlbmluZzogYm9vbGVhblxyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIGZvbnQ6IEZvbnRSZXNvdXJjZSxcclxuICAgICAgICB0eHQ6IHN0cmluZyxcclxuICAgICAgICBrZXlib2FyZDogYm9vbGVhbixcclxuICAgICAgICB2YWx1ZTogbnVtYmVyLFxyXG4gICAgICAgIGluZGV4OiBudW1iZXIsLy8gdGhlIGluZGV4IGluIHRoZSBHYW1lLmNvbnRyb2xzIGFycmF5IHRoYXQgaXQgY2hhbmdlc1xyXG4gICAgICAgIHg6IG51bWJlcixcclxuICAgICAgICB5OiBudW1iZXIsXHJcbiAgICAgICAgdzogbnVtYmVyLFxyXG4gICAgICAgIGg6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuZm9udCA9IGZvbnQ7XHJcbiAgICAgICAgdGhpcy50eHQgPSB0eHRcclxuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5rZXlib2FyZCA9IGtleWJvYXJkO1xyXG4gICAgICAgIHRoaXMuaW5kZXggPSBpbmRleDtcclxuICAgICAgICB0aGlzLnggPSB4XHJcbiAgICAgICAgdGhpcy55ID0geVxyXG4gICAgICAgIHRoaXMudyA9IHdcclxuICAgICAgICB0aGlzLmggPSBoXHJcbiAgICAgICAgdGhpcy5pbWFnZSA9IFVpQXNzZXRzLmJ1dHRvbl91bnNlbGVjdGVkO1xyXG4gICAgICAgIHRoaXMubW91c2VJc092ZXIgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmxpc3RlbmluZyA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcih0YXJnZXQ6IHA1LCB1cHNjYWxlU2l6ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgLy8gc2V0IHRoZSBjb29yZHMgYW5kIGRpbWVuc2lvbnMgdG8gcm91bmQgdG8gdGhlIG5lYXJlc3QgdW4tdXBzY2FsZWQgcGl4ZWxcclxuICAgICAgICBjb25zdCB4ID0gTWF0aC5yb3VuZCh0aGlzLnggLyB1cHNjYWxlU2l6ZSkgKiB1cHNjYWxlU2l6ZTtcclxuICAgICAgICBjb25zdCB5ID0gTWF0aC5yb3VuZCh0aGlzLnkgLyB1cHNjYWxlU2l6ZSkgKiB1cHNjYWxlU2l6ZTtcclxuICAgICAgICBjb25zdCB3ID0gTWF0aC5yb3VuZCh0aGlzLncgLyB1cHNjYWxlU2l6ZSkgKiB1cHNjYWxlU2l6ZTtcclxuICAgICAgICBjb25zdCBoID0gTWF0aC5yb3VuZCh0aGlzLmggLyB1cHNjYWxlU2l6ZSkgKiB1cHNjYWxlU2l6ZTtcclxuXHJcbiAgICAgICAgLy8gY29ybmVyc1xyXG4gICAgICAgIHRoaXMuaW1hZ2UucmVuZGVyUGFydGlhbCh0YXJnZXQsIHgsIHksIDcgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCAwLCAwLCA3LCA3KTtcclxuICAgICAgICB0aGlzLmltYWdlLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4ICsgdyAtIDcgKiB1cHNjYWxlU2l6ZSwgeSwgNyAqIHVwc2NhbGVTaXplLCA3ICogdXBzY2FsZVNpemUsIDgsIDAsIDcsIDcpO1xyXG4gICAgICAgIHRoaXMuaW1hZ2UucmVuZGVyUGFydGlhbCh0YXJnZXQsIHgsIHkgKyBoIC0gNyAqIHVwc2NhbGVTaXplLCA3ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgMCwgOCwgNywgNyk7XHJcbiAgICAgICAgdGhpcy5pbWFnZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCArIHcgLSA3ICogdXBzY2FsZVNpemUsIHkgKyBoIC0gNyAqIHVwc2NhbGVTaXplLCA3ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgOCwgOCwgNywgNyk7XHJcblxyXG4gICAgICAgIC8vIHRvcCBhbmQgYm90dG9tXHJcbiAgICAgICAgdGhpcy5pbWFnZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCArIDcgKiB1cHNjYWxlU2l6ZSwgeSwgdyAtIDE0ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgNywgMCwgMSwgNyk7XHJcbiAgICAgICAgdGhpcy5pbWFnZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCArIDcgKiB1cHNjYWxlU2l6ZSwgeSArIGggLSA3ICogdXBzY2FsZVNpemUsIHcgLSAxNCAqIHVwc2NhbGVTaXplLCA3ICogdXBzY2FsZVNpemUsIDcsIDgsIDEsIDcpO1xyXG5cclxuICAgICAgICAvLyBsZWZ0IGFuZCByaWdodFxyXG4gICAgICAgIHRoaXMuaW1hZ2UucmVuZGVyUGFydGlhbCh0YXJnZXQsIHgsIHkgKyA3ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgaCAtIDE0ICogdXBzY2FsZVNpemUsIDAsIDcsIDcsIDEpO1xyXG4gICAgICAgIHRoaXMuaW1hZ2UucmVuZGVyUGFydGlhbCh0YXJnZXQsIHggKyB3IC0gNyAqIHVwc2NhbGVTaXplLCB5ICsgNyAqIHVwc2NhbGVTaXplLCA3ICogdXBzY2FsZVNpemUsIGggLSAxNCAqIHVwc2NhbGVTaXplLCA4LCA3LCA3LCAxKTtcclxuXHJcbiAgICAgICAgLy8gY2VudGVyXHJcbiAgICAgICAgdGhpcy5pbWFnZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCArIDcgKiB1cHNjYWxlU2l6ZSwgeSArIDcgKiB1cHNjYWxlU2l6ZSwgdyAtIDE0ICogdXBzY2FsZVNpemUsIGggLSAxNCAqIHVwc2NhbGVTaXplLCA3LCA3LCAxLCAxKTtcclxuXHJcbiAgICAgICAgaWYodGhpcy5saXN0ZW5pbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5mb250LmRyYXdUZXh0KHRhcmdldCwgdGhpcy50eHQrXCI6IGNsaWNrIHRvIGNhbmNlbFwiLCB4ICsgNiAqIHVwc2NhbGVTaXplLCBNYXRoLnJvdW5kKCh0aGlzLnkgKyB0aGlzLmggLyAyKSAvIHVwc2NhbGVTaXplKSAqIHVwc2NhbGVTaXplIC0gNiAqIHVwc2NhbGVTaXplKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmKHRoaXMua2V5Ym9hcmQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZm9udC5kcmF3VGV4dCh0YXJnZXQsIHRoaXMudHh0K1wiOiAgIFwiK0tleXMua2V5Ym9hcmRNYXBbdGhpcy52YWx1ZV0sIHggKyA2ICogdXBzY2FsZVNpemUsIE1hdGgucm91bmQoKHRoaXMueSArIHRoaXMuaCAvIDIpIC8gdXBzY2FsZVNpemUpICogdXBzY2FsZVNpemUgLSA2ICogdXBzY2FsZVNpemUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mb250LmRyYXdUZXh0KHRhcmdldCwgdGhpcy50eHQrXCI6ICAgTW91c2UgXCIrdGhpcy52YWx1ZSwgeCArIDYgKiB1cHNjYWxlU2l6ZSwgTWF0aC5yb3VuZCgodGhpcy55ICsgdGhpcy5oIC8gMikgLyB1cHNjYWxlU2l6ZSkgKiB1cHNjYWxlU2l6ZSAtIDYgKiB1cHNjYWxlU2l6ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlTW91c2VPdmVyKG1vdXNlWDogbnVtYmVyLCBtb3VzZVk6IG51bWJlcikge1xyXG4gICAgICAgIC8vIGlmIHRoZSBtb3VzZSBwb3NpdGlvbiBpcyBpbnNpZGUgdGhlIGJ1dHRvbiwgcmV0dXJuIHRydWVcclxuICAgICAgICBpZiAobW91c2VYID4gdGhpcy54ICYmIG1vdXNlWCA8IHRoaXMueCArIHRoaXMudyAmJiBtb3VzZVkgPiB0aGlzLnkgJiYgbW91c2VZIDwgdGhpcy55ICsgdGhpcy5oKSB7XHJcbiAgICAgICAgICAgIHRoaXMubW91c2VJc092ZXIgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5tb3VzZUlzT3ZlciA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvblByZXNzZWQoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJpbnB1dCBib3ggcHJlc3NlZFwiKTtcclxuICAgICAgICB0aGlzLmxpc3RlbmluZyA9ICF0aGlzLmxpc3RlbmluZztcclxuICAgICAgICBpZih0aGlzLmxpc3RlbmluZykge1xyXG4gICAgICAgICAgICB0aGlzLmltYWdlID0gVWlBc3NldHMuYnV0dG9uX3NlbGVjdGVkO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuaW1hZ2UgPSBVaUFzc2V0cy5idXR0b25fdW5zZWxlY3RlZDtcclxuICAgICAgICAvLyBBdWRpb0Fzc2V0cy51aS5pbnZlbnRvcnlDbGFjay5wbGF5UmFuZG9tKCk7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQgPSBJbnB1dEJveDsiLCJpbXBvcnQgUmVuZGVyYWJsZSBmcm9tICcuLi9pbnRlcmZhY2VzL1JlbmRlcmFibGUnO1xyXG5pbXBvcnQgcDUgZnJvbSAncDUnO1xyXG5pbXBvcnQgeyBVaUFzc2V0cyB9IGZyb20gJy4uL2Fzc2V0cy9Bc3NldHMnO1xyXG5pbXBvcnQgZ2FtZSBmcm9tICcuLi9NYWluJ1xyXG5pbXBvcnQgRm9udFJlc291cmNlIGZyb20gJy4uL2Fzc2V0cy9yZXNvdXJjZXMvRm9udFJlc291cmNlJztcclxuXHJcbmNsYXNzIFNsaWRlciBpbXBsZW1lbnRzIFJlbmRlcmFibGUge1xyXG5cclxuICAgIHZhbHVlOiBudW1iZXJcclxuICAgIG1pbjogbnVtYmVyXHJcbiAgICBtYXg6IG51bWJlclxyXG4gICAgc3RlcDogbnVtYmVyXHJcbiAgICBvbkNoYW5nZWQ6IEZ1bmN0aW9uXHJcbiAgICB4OiBudW1iZXJcclxuICAgIHk6IG51bWJlclxyXG4gICAgdzogbnVtYmVyXHJcbiAgICBoOiBudW1iZXJcclxuICAgIGJlaW5nRWRpdGVkOiBib29sZWFuXHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgZm9udDogRm9udFJlc291cmNlLFxyXG4gICAgICAgIHR4dDogc3RyaW5nLFxyXG4gICAgICAgIHZhbHVlOm51bWJlcixcclxuICAgICAgICBtaW46IG51bWJlcixcclxuICAgICAgICBtYXg6IG51bWJlcixcclxuICAgICAgICBzdGVwOiBudW1iZXIsXHJcbiAgICAgICAgeDogbnVtYmVyLFxyXG4gICAgICAgIHk6IG51bWJlcixcclxuICAgICAgICB3OiBudW1iZXIsXHJcbiAgICAgICAgaDogbnVtYmVyLFxyXG4gICAgICAgIG9uQ2hhbmdlZDogRnVuY3Rpb24pIHtcclxuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWVcclxuICAgICAgICB0aGlzLm1pbiA9IG1pblxyXG4gICAgICAgIHRoaXMubWF4ID0gbWF4XHJcbiAgICAgICAgdGhpcy5zdGVwID0gc3RlcFxyXG4gICAgICAgIHRoaXMub25DaGFuZ2VkID0gb25DaGFuZ2VkXHJcbiAgICAgICAgdGhpcy54ID0geFxyXG4gICAgICAgIHRoaXMueSA9IHlcclxuICAgICAgICB0aGlzLncgPSB3XHJcbiAgICAgICAgdGhpcy5oID0gaFxyXG4gICAgICAgIHRoaXMuYmVpbmdFZGl0ZWQgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIodGFyZ2V0OiBwNSwgdXBzY2FsZVNpemU6IG51bWJlcikge1xyXG4gICAgICAgIC8vIHNldCB0aGUgY29vcmRzIGFuZCBkaW1lbnNpb25zIHRvIHJvdW5kIHRvIHRoZSBuZWFyZXN0IHVuLXVwc2NhbGVkIHBpeGVsXHJcbiAgICAgICAgY29uc3QgeCA9IE1hdGgucm91bmQodGhpcy54L3Vwc2NhbGVTaXplKSp1cHNjYWxlU2l6ZTtcclxuICAgICAgICBjb25zdCB5ID0gTWF0aC5yb3VuZCgodGhpcy55K3RoaXMuaC8yKS91cHNjYWxlU2l6ZSkqdXBzY2FsZVNpemU7XHJcbiAgICAgICAgY29uc3QgdyA9IE1hdGgucm91bmQodGhpcy53L3Vwc2NhbGVTaXplKSp1cHNjYWxlU2l6ZTtcclxuXHJcbiAgICAgICAgLy8gbGVmdCBzaWRlIG9mIHNsaWRlciBiYXJcclxuICAgICAgICBVaUFzc2V0cy5zbGlkZXJfYmFyLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4LCB5LTIqdXBzY2FsZVNpemUsIDIqdXBzY2FsZVNpemUsIDQqdXBzY2FsZVNpemUsIDAsIDAsIDIsIDQpO1xyXG4gICAgICAgIC8vIHJpZ2h0IHNpZGUgb2Ygc2xpZGVyIGJhclxyXG4gICAgICAgIFVpQXNzZXRzLnNsaWRlcl9iYXIucmVuZGVyUGFydGlhbCh0YXJnZXQsIHgrdy0yKnVwc2NhbGVTaXplLCB5LTIqdXBzY2FsZVNpemUsIDIqdXBzY2FsZVNpemUsIDQqdXBzY2FsZVNpemUsIDMsIDAsIDIsIDQpO1xyXG4gICAgICAgIC8vIGNlbnRlciBvZiBzbGlkZXIgYmFyXHJcbiAgICAgICAgVWlBc3NldHMuc2xpZGVyX2Jhci5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCsyKnVwc2NhbGVTaXplLCB5LTIqdXBzY2FsZVNpemUsIHctNCp1cHNjYWxlU2l6ZSwgNCp1cHNjYWxlU2l6ZSwgMiwgMCwgMSwgNCk7XHJcbiAgICAgICAgLy8gaGFuZGxlXHJcbiAgICAgICAgVWlBc3NldHMuc2xpZGVyX2hhbmRsZS5yZW5kZXIodGFyZ2V0LCB4K01hdGgucm91bmQoKHRoaXMudmFsdWUtdGhpcy5taW4pLyh0aGlzLm1heC10aGlzLm1pbikqKHctOCp1cHNjYWxlU2l6ZSkvdXBzY2FsZVNpemUpKnVwc2NhbGVTaXplLCB5LTQqdXBzY2FsZVNpemUsIDgqdXBzY2FsZVNpemUsIDkqdXBzY2FsZVNpemUpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVNsaWRlclBvc2l0aW9uKG1vdXNlWDogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYodGhpcy5iZWluZ0VkaXRlZCl7XHJcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSBNYXRoLm1heCh0aGlzLm1pbiwgTWF0aC5taW4odGhpcy5tYXgsIE1hdGgucm91bmQoKHRoaXMubWluKyh0aGlzLm1heC10aGlzLm1pbikqKCgobW91c2VYLXRoaXMueC00KmdhbWUudXBzY2FsZVNpemUpIC8gKHRoaXMudy0oOCpnYW1lLnVwc2NhbGVTaXplKSkpKSkvdGhpcy5zdGVwKSp0aGlzLnN0ZXApKTtcclxuICAgICAgICAgICAgdGhpcy5vbkNoYW5nZWQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQgPSBTbGlkZXI7IiwiaW1wb3J0IFJlbmRlcmFibGUgZnJvbSAnLi4vaW50ZXJmYWNlcy9SZW5kZXJhYmxlJztcclxuaW1wb3J0IHA1IGZyb20gJ3A1JztcclxuaW1wb3J0IHsgVWlBc3NldHMgfSBmcm9tICcuLi9hc3NldHMvQXNzZXRzJztcclxuXHJcbmNsYXNzIFVpRnJhbWUgaW1wbGVtZW50cyBSZW5kZXJhYmxlIHtcclxuXHJcbiAgICB4OiBudW1iZXJcclxuICAgIHk6IG51bWJlclxyXG4gICAgdzogbnVtYmVyXHJcbiAgICBoOiBudW1iZXJcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICB4OiBudW1iZXIsXHJcbiAgICAgICAgeTogbnVtYmVyLFxyXG4gICAgICAgIHc6IG51bWJlcixcclxuICAgICAgICBoOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnggPSB4XHJcbiAgICAgICAgdGhpcy55ID0geVxyXG4gICAgICAgIHRoaXMudyA9IHdcclxuICAgICAgICB0aGlzLmggPSBoXHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKHRhcmdldDogcDUsIHVwc2NhbGVTaXplOiBudW1iZXIpIHtcclxuICAgICAgICAvLyBzZXQgdGhlIGNvb3JkcyBhbmQgZGltZW5zaW9ucyB0byByb3VuZCB0byB0aGUgbmVhcmVzdCB1bi11cHNjYWxlZCBwaXhlbFxyXG4gICAgICAgIGNvbnN0IHggPSBNYXRoLnJvdW5kKHRoaXMueC91cHNjYWxlU2l6ZSkqdXBzY2FsZVNpemU7XHJcbiAgICAgICAgY29uc3QgeSA9IE1hdGgucm91bmQodGhpcy55L3Vwc2NhbGVTaXplKSp1cHNjYWxlU2l6ZTtcclxuICAgICAgICBjb25zdCB3ID0gTWF0aC5yb3VuZCh0aGlzLncvdXBzY2FsZVNpemUpKnVwc2NhbGVTaXplO1xyXG4gICAgICAgIGNvbnN0IGggPSBNYXRoLnJvdW5kKHRoaXMuaC91cHNjYWxlU2l6ZSkqdXBzY2FsZVNpemU7XHJcblxyXG4gICAgICAgIC8vIGNvcm5lcnNcclxuICAgICAgICBVaUFzc2V0cy51aV9mcmFtZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCwgeSwgNyp1cHNjYWxlU2l6ZSwgNyp1cHNjYWxlU2l6ZSwgMCwgMCwgNywgNyk7XHJcbiAgICAgICAgVWlBc3NldHMudWlfZnJhbWUucmVuZGVyUGFydGlhbCh0YXJnZXQsIHgrdy03KnVwc2NhbGVTaXplLCB5LCA3KnVwc2NhbGVTaXplLCA3KnVwc2NhbGVTaXplLCA4LCAwLCA3LCA3KTtcclxuICAgICAgICBVaUFzc2V0cy51aV9mcmFtZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCwgeStoLTcqdXBzY2FsZVNpemUsIDcqdXBzY2FsZVNpemUsIDcqdXBzY2FsZVNpemUsIDAsIDgsIDcsIDcpO1xyXG4gICAgICAgIFVpQXNzZXRzLnVpX2ZyYW1lLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4K3ctNyp1cHNjYWxlU2l6ZSwgeStoLTcqdXBzY2FsZVNpemUsIDcqdXBzY2FsZVNpemUsIDcqdXBzY2FsZVNpemUsIDgsIDgsIDcsIDcpO1xyXG5cclxuICAgICAgICAvLyB0b3AgYW5kIGJvdHRvbVxyXG4gICAgICAgIFVpQXNzZXRzLnVpX2ZyYW1lLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4KzcqdXBzY2FsZVNpemUsIHksIHctMTQqdXBzY2FsZVNpemUsIDcqdXBzY2FsZVNpemUsIDcsIDAsIDEsIDcpO1xyXG4gICAgICAgIFVpQXNzZXRzLnVpX2ZyYW1lLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4KzcqdXBzY2FsZVNpemUsIHkraC03KnVwc2NhbGVTaXplLCB3LTE0KnVwc2NhbGVTaXplLCA3KnVwc2NhbGVTaXplLCA3LCA4LCAxLCA3KTtcclxuXHJcbiAgICAgICAgLy8gbGVmdCBhbmQgcmlnaHRcclxuICAgICAgICBVaUFzc2V0cy51aV9mcmFtZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCwgeSs3KnVwc2NhbGVTaXplLCA3KnVwc2NhbGVTaXplLCBoLTE0KnVwc2NhbGVTaXplLCAwLCA3LCA3LCAxKTtcclxuICAgICAgICBVaUFzc2V0cy51aV9mcmFtZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCt3LTcqdXBzY2FsZVNpemUsIHkrNyp1cHNjYWxlU2l6ZSwgNyp1cHNjYWxlU2l6ZSwgaC0xNCp1cHNjYWxlU2l6ZSwgOCwgNywgNywgMSk7XHJcblxyXG4gICAgICAgIC8vIGNlbnRlclxyXG4gICAgICAgIFVpQXNzZXRzLnVpX2ZyYW1lLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4KzcqdXBzY2FsZVNpemUsIHkrNyp1cHNjYWxlU2l6ZSwgdy0xNCp1cHNjYWxlU2l6ZSwgaC0xNCp1cHNjYWxlU2l6ZSwgNywgNywgMSwgMSk7XHJcblxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgPSBVaUZyYW1lOyIsImltcG9ydCBSZW5kZXJhYmxlIGZyb20gJy4uL2ludGVyZmFjZXMvUmVuZGVyYWJsZSc7XHJcbmltcG9ydCBwNSBmcm9tICdwNSc7XHJcbmltcG9ydCBCdXR0b24gZnJvbSAnLi4vdWkvQnV0dG9uJztcclxuaW1wb3J0IFNsaWRlciBmcm9tICcuLi91aS9TbGlkZXInO1xyXG5pbXBvcnQgVWlGcmFtZSBmcm9tICcuL1VpRnJhbWUnO1xyXG5pbXBvcnQgZ2FtZSBmcm9tICcuLi9NYWluJztcclxuaW1wb3J0IElucHV0Qm94IGZyb20gJy4vSW5wdXRCb3gnO1xyXG5pbXBvcnQgeyBVaUFzc2V0cyB9IGZyb20gJy4uL2Fzc2V0cy9Bc3NldHMnO1xyXG5cclxuYWJzdHJhY3QgY2xhc3MgVWlTY3JlZW4gaW1wbGVtZW50cyBSZW5kZXJhYmxlIHtcclxuXHJcbiAgICBidXR0b25zOiBCdXR0b25bXTtcclxuICAgIHNsaWRlcnM6IFNsaWRlcltdO1xyXG4gICAgaW5wdXRCb3hlczogSW5wdXRCb3hbXTtcclxuXHJcbiAgICBmcmFtZTogVWlGcmFtZVxyXG5cclxuICAgIGFic3RyYWN0IHJlbmRlcih0YXJnZXQ6IHA1LCB1cHNjYWxlU2l6ZTogbnVtYmVyKTogdm9pZDtcclxuXHJcbiAgICBhYnN0cmFjdCB3aW5kb3dVcGRhdGUoKTogdm9pZFxyXG5cclxuICAgIG1vdXNlUHJlc3NlZChidG46IG51bWJlcikge1xyXG4gICAgICAgIGlmKHRoaXMuYnV0dG9ucyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIC8vIGxvb3AgdGhyb3VnaCBhbGwgdGhlIGJ1dHRvbnMgaW4gdGhpcyBtZW51IGFuZCBpZiB0aGUgbW91c2UgaXMgb3ZlciB0aGVtLCB0aGVuIGNhbGwgdGhlIGJ1dHRvbidzIG9uUHJlc3NlZCgpIGZ1bmN0aW9uLiAgVGhlIG9uUHJlc3NlZCgpIGZ1bmN0aW9uIGlzIHBhc3NlZCBpbiB0aHJvdWdoIHRoZSBjb25zdHJ1Y3Rvci5cclxuICAgICAgICAgICAgZm9yKGNvbnN0IGkgb2YgdGhpcy5idXR0b25zKSB7XHJcbiAgICAgICAgICAgICAgICBpZihpLm1vdXNlSXNPdmVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaS5vblByZXNzZWQoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5zbGlkZXJzICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgLy8gbG9vcCB0aHJvdWdoIGFsbCB0aGUgc2xpZGVycyBhbmQgaW50ZXJhY3Qgd2l0aCB0aGVtIGFjY29yZGluZ2x5XHJcbiAgICAgICAgICAgIGZvcihjb25zdCBpIG9mIHRoaXMuc2xpZGVycykge1xyXG4gICAgICAgICAgICAgICAgaS51cGRhdGVTbGlkZXJQb3NpdGlvbihnYW1lLm1vdXNlWCk7XHJcbiAgICAgICAgICAgICAgICBpZihnYW1lLm1vdXNlWD5pLnggJiYgZ2FtZS5tb3VzZVg8aS54K2kudyAmJiBnYW1lLm1vdXNlWT5pLnkgJiYgZ2FtZS5tb3VzZVk8aS55K2kuaClcclxuICAgICAgICAgICAgICAgICAgICBpLmJlaW5nRWRpdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLmlucHV0Qm94ZXMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAvLyBsb29wIHRocm91Z2ggYWxsIHRoZSBpbnB1dCBib3hlcyBhbmQgaW50ZXJhY3Qgd2l0aCB0aGVtIGFjY29yZGluZ2x5XHJcbiAgICAgICAgICAgIGZvcihjb25zdCBpIG9mIHRoaXMuaW5wdXRCb3hlcykge1xyXG4gICAgICAgICAgICAgICAgaWYoaS5tb3VzZUlzT3Zlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGkub25QcmVzc2VkKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmKGkubGlzdGVuaW5nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaS5saXN0ZW5pbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBnYW1lLmNvbnRyb2xzW2kuaW5kZXhdLmtleUNvZGUgPSBidG47XHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS5jb250cm9sc1tpLmluZGV4XS5rZXlib2FyZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGkudmFsdWUgPSBidG47XHJcbiAgICAgICAgICAgICAgICAgICAgaS5rZXlib2FyZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGkuaW1hZ2UgPSBVaUFzc2V0cy5idXR0b25fdW5zZWxlY3RlZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBtb3VzZVJlbGVhc2VkKCkge1xyXG4gICAgICAgIGlmKHRoaXMuc2xpZGVycyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIC8vIGxvb3AgdGhyb3VnaCBhbGwgdGhlIHNsaWRlcnMgYW5kIGludGVyYWN0IHdpdGggdGhlbSBhY2NvcmRpbmdseVxyXG4gICAgICAgICAgICBmb3IoY29uc3QgaSBvZiB0aGlzLnNsaWRlcnMpIHtcclxuICAgICAgICAgICAgICAgIGkuYmVpbmdFZGl0ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCA9IFVpU2NyZWVuIiwiaW1wb3J0IFVpU2NyZWVuIGZyb20gJy4uL1VpU2NyZWVuJztcclxuaW1wb3J0IHA1IGZyb20gJ3A1JztcclxuaW1wb3J0IFVpRnJhbWUgZnJvbSAnLi4vVWlGcmFtZSc7XHJcbmltcG9ydCBnYW1lIGZyb20gJy4uLy4uL01haW4nO1xyXG5pbXBvcnQgQnV0dG9uIGZyb20gJy4uL0J1dHRvbic7XHJcbmltcG9ydCBGb250UmVzb3VyY2UgZnJvbSAnLi4vLi4vYXNzZXRzL3Jlc291cmNlcy9Gb250UmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBPcHRpb25zTWVudSB9IGZyb20gJy4vT3B0aW9uc01lbnUnO1xyXG5pbXBvcnQgSW5wdXRCb3ggZnJvbSAnLi4vSW5wdXRCb3gnO1xyXG5pbXBvcnQgeyBDb250cm9sIH0gZnJvbSAnLi4vLi4vaW5wdXQvQ29udHJvbCdcclxuXHJcbmV4cG9ydCBjbGFzcyBDb250cm9sc01lbnUgZXh0ZW5kcyBVaVNjcmVlbiB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZm9udDogRm9udFJlc291cmNlKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICAvLyBtYWtlIHRoZSBmcmFtZSB3aXRoIHNvbWUgZGVmYXVsdCB2YWx1ZXMuICBUaGVzZSB3aWxsIGxhdGVyIGJlIGNoYW5nZWQgdG8gZml0IHRoZSBzY3JlZW4gc2l6ZS5cclxuICAgICAgICB0aGlzLmZyYW1lID0gbmV3IFVpRnJhbWUoMCwgMCwgMCwgMCk7XHJcblxyXG4gICAgICAgIC8vIG1ha2Ugc29tZSBidXR0b25zIHdpdGggZGVmYXVsdCBwb3NpdGlvbnNcclxuICAgICAgICB0aGlzLmJ1dHRvbnMgPSBbXHJcbiAgICAgICAgICAgIG5ldyBCdXR0b24oZm9udCwgXCJCYWNrXCIsIFwiUmV0dXJuIHRvIHRoZSBvcHRpb25zIG1lbnUuXCIsIDAsIDAsIDAsIDAsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwib3B0aW9ucyBtZW51XCIpO1xyXG4gICAgICAgICAgICAgICAgZ2FtZS5jdXJyZW50VWkgPSBuZXcgT3B0aW9uc01lbnUoZm9udCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgXTtcclxuXHJcbiAgICAgICAgdGhpcy5pbnB1dEJveGVzID0gW1xyXG4gICAgICAgICAgICAvLyBuZXcgSW5wdXRCb3goZm9udCwgXCJXYWxrIFJpZ2h0XCIsIHRydWUsIDY4LCAwLCAwLCAwLCAwLCAwKSxcclxuICAgICAgICAgICAgLy8gbmV3IElucHV0Qm94KGZvbnQsIFwiV2FsayBMZWZ0XCIsIHRydWUsIDY1LCAxLCAwLCAwLCAwLCAwKSxcclxuICAgICAgICAgICAgLy8gbmV3IElucHV0Qm94KGZvbnQsIFwiSnVtcFwiLCB0cnVlLCAzMiwgMiwgMCwgMCwgMCwgMCksXHJcbiAgICAgICAgICAgIC8vIG5ldyBJbnB1dEJveChmb250LCBcIlBhdXNlXCIsIHRydWUsIDI3LCAzLCAwLCAwLCAwLCAwKVxyXG4gICAgICAgIF1cclxuICAgICAgICBcclxuICAgICAgICBsZXQgaSA9IDA7XHJcbiAgICAgICAgZm9yKGxldCBjb250cm9sIG9mIGdhbWUuY29udHJvbHMpIHtcclxuICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICB0aGlzLmlucHV0Qm94ZXMucHVzaChuZXcgSW5wdXRCb3goZm9udCwgY29udHJvbC5kZXNjcmlwdGlvbiwgY29udHJvbC5rZXlib2FyZCwgY29udHJvbC5rZXlDb2RlLCBpLCAwLCAwLCAwLCAwKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHVwZGF0ZSB0aGUgc2l6ZSBvZiB0aGUgZWxlbWVudHMgYmFzZWQgb24gdGhlIGluaXRpYWwgc2NyZWVuIHNpemVcclxuICAgICAgICB0aGlzLndpbmRvd1VwZGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcih0YXJnZXQ6IHA1LCB1cHNjYWxlU2l6ZTogbnVtYmVyKTogdm9pZCB7XHJcblxyXG4gICAgICAgIC8vIHJlbmRlciB0aGUgcmVjdGFuZ3VsYXIgaW1hZ2VcclxuICAgICAgICB0aGlzLmZyYW1lLnJlbmRlcih0YXJnZXQsIHVwc2NhbGVTaXplKTtcclxuXHJcbiAgICAgICAgLy8gbG9vcCB0aHJvdWdoIHRoZSBidXR0b25zIGFycmF5IGFuZCByZW5kZXIgZWFjaCBvbmUuXHJcbiAgICAgICAgdGhpcy5idXR0b25zLmZvckVhY2goYnV0dG9uID0+IHtcclxuICAgICAgICAgICAgYnV0dG9uLnJlbmRlcih0YXJnZXQsIHVwc2NhbGVTaXplKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gbG9vcCB0aHJvdWdoIHRoZSBpbnB1dEJveGVzIGFycmF5IGFuZCByZW5kZXIgZWFjaCBvbmUuXHJcbiAgICAgICAgdGhpcy5pbnB1dEJveGVzLmZvckVhY2goaW5wdXRCb3ggPT4ge1xyXG4gICAgICAgICAgICBpbnB1dEJveC5yZW5kZXIodGFyZ2V0LCB1cHNjYWxlU2l6ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgd2luZG93VXBkYXRlKCkge1xyXG4gICAgICAgIC8vIHNldCB0aGUgcG9zaXRpb24gb2YgdGhlIGZyYW1lXHJcbiAgICAgICAgdGhpcy5mcmFtZS54ID0gZ2FtZS53aWR0aCAvIDIgLSAyMDAgLyAyICogZ2FtZS51cHNjYWxlU2l6ZTsvLyBjZW50ZXIgdGhlIGZyYW1lIGluIHRoZSBjZW50ZXIgb2YgdGhlIHNjcmVlblxyXG4gICAgICAgIHRoaXMuZnJhbWUueSA9IGdhbWUuaGVpZ2h0IC8gMiAtIDU2ICogZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICB0aGlzLmZyYW1lLncgPSAyMDAgKiBnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgIHRoaXMuZnJhbWUuaCA9IDQ4ICogZ2FtZS51cHNjYWxlU2l6ZTtcclxuXHJcbiAgICAgICAgLy8gc2V0IHRoZSBwb3NpdGlvbnMgb2YgdGhlIGJ1dHRvblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS54ID0gZ2FtZS53aWR0aCAvIDIgLSAxOTIgLyAyICogZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLnkgPSBnYW1lLmhlaWdodCAvIDIgKyAyMCAqIGkgKiBnYW1lLnVwc2NhbGVTaXplICsgMjAgKiBnYW1lLnVwc2NhbGVTaXplICogdGhpcy5pbnB1dEJveGVzLmxlbmd0aDtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLncgPSAxOTIgKiBnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0uaCA9IDE2ICogZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLnVwZGF0ZU1vdXNlT3ZlcihnYW1lLm1vdXNlWCwgZ2FtZS5tb3VzZVkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gc2V0IHRoZSBwb3NpdGlvbnMgb2YgYWxsIHRoZSBpbnB1dCBib3hlc1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW5wdXRCb3hlc1tpXS54ID0gZ2FtZS53aWR0aCAvIDIgLSAxOTIgLyAyICogZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5pbnB1dEJveGVzW2ldLnkgPSBnYW1lLmhlaWdodCAvIDIgKyAyMCAqIGkgKiBnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLmlucHV0Qm94ZXNbaV0udyA9IDE5MiAqIGdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuaW5wdXRCb3hlc1tpXS5oID0gMTYgKiBnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmlucHV0Qm94ZXNbaV0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgVWlTY3JlZW4gZnJvbSAnLi4vVWlTY3JlZW4nO1xyXG5pbXBvcnQgcDUgZnJvbSAncDUnO1xyXG5pbXBvcnQgVWlGcmFtZSBmcm9tICcuLi9VaUZyYW1lJztcclxuaW1wb3J0IGdhbWUgZnJvbSAnLi4vLi4vTWFpbic7XHJcbmltcG9ydCBCdXR0b24gZnJvbSAnLi4vQnV0dG9uJztcclxuaW1wb3J0IFNsaWRlciBmcm9tICcuLi9TbGlkZXInO1xyXG5pbXBvcnQgeyBPcHRpb25zTWVudSB9IGZyb20gJy4vT3B0aW9uc01lbnUnO1xyXG5pbXBvcnQgRm9udFJlc291cmNlIGZyb20gJy4uLy4uL2Fzc2V0cy9yZXNvdXJjZXMvRm9udFJlc291cmNlJztcclxuaW1wb3J0IHsgVWlBc3NldHMgfSBmcm9tICcuLi8uLi9hc3NldHMvQXNzZXRzJztcclxuaW1wb3J0IHsgV29ybGRDcmVhdGlvbk1lbnUgfSBmcm9tICcuL1dvcmxkQ3JlYXRpb25NZW51JztcclxuXHJcbmV4cG9ydCBjbGFzcyBNYWluTWVudSBleHRlbmRzIFVpU2NyZWVuIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihmb250OiBGb250UmVzb3VyY2UpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICAvLyBtYWtlIHRoZSBmcmFtZSB3aXRoIHNvbWUgZGVmYXVsdCB2YWx1ZXMuICBUaGVzZSB3aWxsIGxhdGVyIGJlIGNoYW5nZWQgdG8gZml0IHRoZSBzY3JlZW4gc2l6ZS5cclxuICAgICAgICB0aGlzLmZyYW1lID0gbmV3IFVpRnJhbWUoMCwgMCwgMCwgMCk7XHJcblxyXG4gICAgICAgIC8vIG1ha2UgNCBidXR0b25zIHdpdGggZGVmYXVsdCBwb3NpdGlvbnNcclxuICAgICAgICB0aGlzLmJ1dHRvbnMgPSBbXHJcbiAgICAgICAgICAgIG5ldyBCdXR0b24oZm9udCwgXCJSZXN1bWUgR2FtZVwiLCBcIktlZXAgcGxheWluZyB3aGVyZSB5b3UgbGVmdCBvZmYuXCIsIDAsIDAsIDAsIDAsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicmVzdW1lIGdhbWVcIik7XHJcbiAgICAgICAgICAgICAgICBnYW1lLmN1cnJlbnRVaSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIG5ldyBCdXR0b24oZm9udCwgXCJOZXcgR2FtZVwiLCBcIkNyZWF0ZXMgYSBuZXcgc2VydmVyIHRoYXQgeW91ciBmcmllbmRzIGNhbiBqb2luLlwiLCAwLCAwLCAwLCAwLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm5ldyBnYW1lXCIpO1xyXG4gICAgICAgICAgICAgICAgZ2FtZS5jdXJyZW50VWkgPSBuZXcgV29ybGRDcmVhdGlvbk1lbnUoZm9udCk7XHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBuZXcgQnV0dG9uKGZvbnQsIFwiSm9pbiBHYW1lXCIsIFwiSm9pbiBhIGdhbWUgd2l0aCB5b3VyIGZyaWVuZHMsIG9yIG1ha2UgbmV3IG9uZXMuXCIsIDAsIDAsIDAsIDAsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiam9pbiBnYW1lXCIpO1xyXG4gICAgICAgICAgICAgICAgZ2FtZS5jdXJyZW50VWkgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBuZXcgQnV0dG9uKGZvbnQsIFwiT3B0aW9uc1wiLCBcIkNoYW5nZSB5b3VyIGtleWJpbmRzLCByZWR1Y2UgbGFnLCBldGMuXCIsIDAsIDAsIDAsIDAsICgpID0+e1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJvcHRpb25zXCIpO1xyXG4gICAgICAgICAgICAgICAgZ2FtZS5jdXJyZW50VWkgPSBuZXcgT3B0aW9uc01lbnUoZm9udCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgXTtcclxuXHJcbiAgICAgICAgLy8gdXBkYXRlIHRoZSBzaXplIG9mIHRoZSBlbGVtZW50cyBiYXNlZCBvbiB0aGUgaW5pdGlhbCBzY3JlZW4gc2l6ZVxyXG4gICAgICAgIHRoaXMud2luZG93VXBkYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKHRhcmdldDogcDUsIHVwc2NhbGVTaXplOiBudW1iZXIpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgLy8gcmVuZGVyIHRoZSByZWN0YW5ndWxhciBpbWFnZSB0aGF0IHRoZSB3aG9sZSBtZW51IGlzIG9uXHJcbiAgICAgICAgdGhpcy5mcmFtZS5yZW5kZXIodGFyZ2V0LCB1cHNjYWxlU2l6ZSk7XHJcblxyXG4gICAgICAgIFVpQXNzZXRzLnRpdGxlX2ltYWdlLnJlbmRlcih0YXJnZXQsIE1hdGgucm91bmQodGhpcy5mcmFtZS54L3Vwc2NhbGVTaXplKzEpKnVwc2NhbGVTaXplLCBNYXRoLnJvdW5kKHRoaXMuZnJhbWUueS91cHNjYWxlU2l6ZSs0KSp1cHNjYWxlU2l6ZSwgMjU2KnVwc2NhbGVTaXplLCA0MCp1cHNjYWxlU2l6ZSk7XHJcblxyXG4gICAgICAgIC8vIGxvb3AgdGhyb3VnaCB0aGUgYnV0dG9ucyBhcnJheSBhbmQgcmVuZGVyIGVhY2ggb25lLlxyXG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB0aGlzLmJ1dHRvbnMpIHtcclxuICAgICAgICAgICAgaXRlbS5yZW5kZXIodGFyZ2V0LCB1cHNjYWxlU2l6ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICB3aW5kb3dVcGRhdGUoKSB7XHJcbiAgICAgICAgLy8gc2V0IHRoZSBwb3NpdGlvbiBvZiB0aGUgZnJhbWVcclxuICAgICAgICB0aGlzLmZyYW1lLnggPSBnYW1lLndpZHRoLzItMjY0LzIqZ2FtZS51cHNjYWxlU2l6ZTsvLyBjZW50ZXIgdGhlIGZyYW1lIGluIHRoZSBtaWRkbGUgb2YgdGhlIHNjcmVlblxyXG4gICAgICAgIHRoaXMuZnJhbWUueSA9IGdhbWUuaGVpZ2h0LzItNTYqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICB0aGlzLmZyYW1lLncgPSAyNjQqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICB0aGlzLmZyYW1lLmggPSA0OCpnYW1lLnVwc2NhbGVTaXplO1xyXG5cclxuICAgICAgICAvLyBzZXQgdGhlIHBvc2l0aW9ucyBvZiBhbGwgdGhlIGJ1dHRvbnNcclxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpPDQ7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0ueCA9IGdhbWUud2lkdGgvMi0xOTIvMipnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0ueSA9IGdhbWUuaGVpZ2h0LzIrMjAqaSpnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0udyA9IDE5MipnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0uaCA9IDE2KmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS51cGRhdGVNb3VzZU92ZXIoZ2FtZS5tb3VzZVgsIGdhbWUubW91c2VZKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCBVaVNjcmVlbiBmcm9tICcuLi9VaVNjcmVlbic7XHJcbmltcG9ydCBwNSBmcm9tICdwNSc7XHJcbmltcG9ydCBVaUZyYW1lIGZyb20gJy4uL1VpRnJhbWUnO1xyXG5pbXBvcnQgZ2FtZSBmcm9tICcuLi8uLi9NYWluJztcclxuaW1wb3J0IEJ1dHRvbiBmcm9tICcuLi9CdXR0b24nO1xyXG5pbXBvcnQgRm9udFJlc291cmNlIGZyb20gJy4uLy4uL2Fzc2V0cy9yZXNvdXJjZXMvRm9udFJlc291cmNlJztcclxuaW1wb3J0IHsgTWFpbk1lbnUgfSBmcm9tICcuL01haW5NZW51JztcclxuaW1wb3J0IHsgVmlkZW9TZXR0aW5nc01lbnUgfSBmcm9tICcuL1ZpZGVvU2V0dGluZ3NNZW51JztcclxuaW1wb3J0IHsgQ29udHJvbHNNZW51IH0gZnJvbSAnLi9Db250cm9sc01lbnUnO1xyXG5cclxuZXhwb3J0IGNsYXNzIE9wdGlvbnNNZW51IGV4dGVuZHMgVWlTY3JlZW4ge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGZvbnQ6IEZvbnRSZXNvdXJjZSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgLy8gbWFrZSB0aGUgZnJhbWUgd2l0aCBzb21lIGRlZmF1bHQgdmFsdWVzLiAgVGhlc2Ugd2lsbCBsYXRlciBiZSBjaGFuZ2VkIHRvIGZpdCB0aGUgc2NyZWVuIHNpemUuXHJcbiAgICAgICAgdGhpcy5mcmFtZSA9IG5ldyBVaUZyYW1lKDAsIDAsIDAsIDApO1xyXG4gICAgICAgIC8vIG1ha2Ugc29tZSBidXR0b25zIHdpdGggZGVmYXVsdCBwb3NpdGlvbnNcclxuICAgICAgICB0aGlzLmJ1dHRvbnMgPSBbXHJcbiAgICAgICAgICAgIG5ldyBCdXR0b24oZm9udCwgXCJWaWRlbyBTZXR0aW5nc1wiLCBcIkNoYW5nZSB0aGUgYmFsYW5jZSBiZXR3ZWVuIHBlcmZvcm1hbmNlIGFuZCBmaWRlbGl0eS5cIiwgMCwgMCwgMCwgMCwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ2aWRlbyBzZXR0aW5nc1wiKTtcclxuICAgICAgICAgICAgICAgIGdhbWUuY3VycmVudFVpID0gbmV3IFZpZGVvU2V0dGluZ3NNZW51KGZvbnQpO1xyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgbmV3IEJ1dHRvbihmb250LCBcIkNvbnRyb2xzXCIsIFwiQ2hhbmdlIHlvdXIga2V5YmluZHMuXCIsIDAsIDAsIDAsIDAsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY29udHJvbCBtZW51XCIpO1xyXG4gICAgICAgICAgICAgICAgZ2FtZS5jdXJyZW50VWkgPSBuZXcgQ29udHJvbHNNZW51KGZvbnQpO1xyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgbmV3IEJ1dHRvbihmb250LCBcIkF1ZGlvIFNldHRpbmdzXCIsIFwiQ2hhbmdlIHRoZSB2b2x1bWUgb2YgZGlmZmVyZW50IHNvdW5kcy5cIiwgMCwgMCwgMCwgMCwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJhdWRpbyBtZW51XCIpO1xyXG4gICAgICAgICAgICAgICAgZ2FtZS5jdXJyZW50VWkgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBuZXcgQnV0dG9uKGZvbnQsIFwiQmFja1wiLCBcIlJldHVybiB0byB0aGUgbWFpbiBtZW51LlwiLCAwLCAwLCAwLCAwLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm1haW4gbWVudVwiKTtcclxuICAgICAgICAgICAgICAgIGdhbWUuY3VycmVudFVpID0gbmV3IE1haW5NZW51KGZvbnQpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIF07XHJcbiAgICAgICAgLy8gdXBkYXRlIHRoZSBzaXplIG9mIHRoZSBlbGVtZW50cyBiYXNlZCBvbiB0aGUgaW5pdGlhbCBzY3JlZW4gc2l6ZVxyXG4gICAgICAgIHRoaXMud2luZG93VXBkYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKHRhcmdldDogcDUsIHVwc2NhbGVTaXplOiBudW1iZXIpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgLy8gcmVuZGVyIHRoZSByZWN0YW5ndWxhciBpbWFnZSB0aGF0IHRoZSB3aG9sZSBtZW51IGlzIG9uXHJcbiAgICAgICAgdGhpcy5mcmFtZS5yZW5kZXIodGFyZ2V0LCB1cHNjYWxlU2l6ZSk7XHJcblxyXG4gICAgICAgIC8vIGxvb3AgdGhyb3VnaCB0aGUgYnV0dG9ucyBhcnJheSBhbmQgcmVuZGVyIGVhY2ggb25lLlxyXG4gICAgICAgIHRoaXMuYnV0dG9ucy5mb3JFYWNoKGJ1dHRvbiA9PiB7XHJcbiAgICAgICAgICAgIGJ1dHRvbi5yZW5kZXIodGFyZ2V0LCB1cHNjYWxlU2l6ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgd2luZG93VXBkYXRlKCkge1xyXG4gICAgICAgIC8vIHNldCB0aGUgcG9zaXRpb24gb2YgdGhlIGZyYW1lXHJcbiAgICAgICAgdGhpcy5mcmFtZS54ID0gZ2FtZS53aWR0aC8yLTIwMC8yKmdhbWUudXBzY2FsZVNpemU7Ly8gY2VudGVyIHRoZSBmcmFtZSBpbiB0aGUgY2VudGVyIG9mIHRoZSBzY3JlZW5cclxuICAgICAgICB0aGlzLmZyYW1lLnkgPSBnYW1lLmhlaWdodC8yLTU2KmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgdGhpcy5mcmFtZS53ID0gMjAwKmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgdGhpcy5mcmFtZS5oID0gNDgqZ2FtZS51cHNjYWxlU2l6ZTtcclxuXHJcbiAgICAgICAgLy8gc2V0IHRoZSBwb3NpdGlvbnMgb2YgYWxsIHRoZSBidXR0b25zXHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaTw0OyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLnggPSBnYW1lLndpZHRoLzItMTkyLzIqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLnkgPSBnYW1lLmhlaWdodC8yKzIwKmkqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLncgPSAxOTIqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLmggPSAxNipnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0udXBkYXRlTW91c2VPdmVyKGdhbWUubW91c2VYLCBnYW1lLm1vdXNlWSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCBVaVNjcmVlbiBmcm9tICcuLi9VaVNjcmVlbic7XHJcbmltcG9ydCBwNSBmcm9tICdwNSc7XHJcbmltcG9ydCBVaUZyYW1lIGZyb20gJy4uL1VpRnJhbWUnO1xyXG5pbXBvcnQgZ2FtZSBmcm9tICcuLi8uLi9NYWluJztcclxuaW1wb3J0IEJ1dHRvbiBmcm9tICcuLi9CdXR0b24nO1xyXG5pbXBvcnQgeyBPcHRpb25zTWVudSB9IGZyb20gJy4vT3B0aW9uc01lbnUnO1xyXG5pbXBvcnQgRm9udFJlc291cmNlIGZyb20gJy4uLy4uL2Fzc2V0cy9yZXNvdXJjZXMvRm9udFJlc291cmNlJztcclxuaW1wb3J0IHsgTWFpbk1lbnUgfSBmcm9tICcuL01haW5NZW51JztcclxuXHJcbmV4cG9ydCBjbGFzcyBQYXVzZU1lbnUgZXh0ZW5kcyBVaVNjcmVlbiB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZm9udDogRm9udFJlc291cmNlKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgLy8gbWFrZSB0aGUgZnJhbWUgd2l0aCBzb21lIGRlZmF1bHQgdmFsdWVzLiAgVGhlc2Ugd2lsbCBsYXRlciBiZSBjaGFuZ2VkIHRvIGZpdCB0aGUgc2NyZWVuIHNpemUuXHJcbiAgICAgICAgdGhpcy5mcmFtZSA9IG5ldyBVaUZyYW1lKDAsIDAsIDAsIDApO1xyXG5cclxuICAgICAgICAvLyBtYWtlIDQgYnV0dG9ucyB3aXRoIGRlZmF1bHQgcG9zaXRpb25zXHJcbiAgICAgICAgdGhpcy5idXR0b25zID0gW1xyXG4gICAgICAgICAgICBuZXcgQnV0dG9uKGZvbnQsIFwiUmVzdW1lIGdhbWVcIiwgXCJHbyBiYWNrIHRvIHRoZSBnYW1lLlwiLCAwLCAwLCAwLCAwLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBnYW1lLmN1cnJlbnRVaSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIG5ldyBCdXR0b24oZm9udCwgXCJPcHRpb25zXCIsIFwiQ2hhbmdlIHlvdXIga2V5YmluZHMsIHJlZHVjZSBsYWcsIGV0Yy5cIiwgMCwgMCwgMCwgMCwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZ2FtZS5jdXJyZW50VWkgPSBuZXcgT3B0aW9uc01lbnUoZm9udCk7XHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBuZXcgQnV0dG9uKGZvbnQsIFwiTGVhdmUgZ2FtZVwiLCBcIkdvIGJhY2sgdG8gTWFpbiBNZW51XCIsIDAsIDAsIDAsIDAsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGdhbWUuY3VycmVudFVpID0gbmV3IE1haW5NZW51KGZvbnQpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIF07XHJcblxyXG4gICAgICAgIC8vIHVwZGF0ZSB0aGUgc2l6ZSBvZiB0aGUgZWxlbWVudHMgYmFzZWQgb24gdGhlIGluaXRpYWwgc2NyZWVuIHNpemVcclxuICAgICAgICB0aGlzLndpbmRvd1VwZGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICByZW5kZXIodGFyZ2V0OiBwNSwgdXBzY2FsZVNpemU6IG51bWJlcik6IHZvaWQge1xyXG5cclxuICAgICAgICAvLyByZW5kZXIgdGhlIHJlY3Rhbmd1bGFyIGltYWdlIHRoYXQgdGhlIHdob2xlIG1lbnUgaXMgb25cclxuICAgICAgICB0aGlzLmZyYW1lLnJlbmRlcih0YXJnZXQsIHVwc2NhbGVTaXplKTtcclxuXHJcbiAgICAgICAgLy8gbG9vcCB0aHJvdWdoIHRoZSBidXR0b25zIGFycmF5IGFuZCByZW5kZXIgZWFjaCBvbmUuXHJcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIHRoaXMuYnV0dG9ucykge1xyXG4gICAgICAgICAgICBpdGVtLnJlbmRlcih0YXJnZXQsIHVwc2NhbGVTaXplKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHdpbmRvd1VwZGF0ZSgpIHtcclxuICAgICAgICAvLyBzZXQgdGhlIHBvc2l0aW9uIG9mIHRoZSBmcmFtZVxyXG4gICAgICAgIHRoaXMuZnJhbWUueCA9IGdhbWUud2lkdGgvMi0yNTYvMipnYW1lLnVwc2NhbGVTaXplOy8vIGNlbnRlciB0aGUgZnJhbWUgaW4gdGhlIG1pZGRsZSBvZiB0aGUgc2NyZWVuXHJcbiAgICAgICAgdGhpcy5mcmFtZS55ID0gZ2FtZS5oZWlnaHQvMi03MipnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgIHRoaXMuZnJhbWUudyA9IDI1NipnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgIHRoaXMuZnJhbWUuaCA9IDY0KmdhbWUudXBzY2FsZVNpemU7XHJcblxyXG4gICAgICAgIC8vIHNldCB0aGUgcG9zaXRpb25zIG9mIGFsbCB0aGUgYnV0dG9uc1xyXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGk8MzsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS54ID0gZ2FtZS53aWR0aC8yLTE5Mi8yKmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS55ID0gZ2FtZS5oZWlnaHQvMisyMCppKmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS53ID0gMTkyKmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS5oID0gMTYqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLnVwZGF0ZU1vdXNlT3ZlcihnYW1lLm1vdXNlWCwgZ2FtZS5tb3VzZVkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IFVpU2NyZWVuIGZyb20gJy4uL1VpU2NyZWVuJztcclxuaW1wb3J0IHA1IGZyb20gJ3A1JztcclxuaW1wb3J0IFVpRnJhbWUgZnJvbSAnLi4vVWlGcmFtZSc7XHJcbmltcG9ydCBnYW1lIGZyb20gJy4uLy4uL01haW4nO1xyXG5pbXBvcnQgQnV0dG9uIGZyb20gJy4uL0J1dHRvbic7XHJcbmltcG9ydCBGb250UmVzb3VyY2UgZnJvbSAnLi4vLi4vYXNzZXRzL3Jlc291cmNlcy9Gb250UmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBPcHRpb25zTWVudSB9IGZyb20gJy4vT3B0aW9uc01lbnUnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFZpZGVvU2V0dGluZ3NNZW51IGV4dGVuZHMgVWlTY3JlZW4ge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGZvbnQ6IEZvbnRSZXNvdXJjZSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgLy8gbWFrZSB0aGUgZnJhbWUgd2l0aCBzb21lIGRlZmF1bHQgdmFsdWVzLiAgVGhlc2Ugd2lsbCBsYXRlciBiZSBjaGFuZ2VkIHRvIGZpdCB0aGUgc2NyZWVuIHNpemUuXHJcbiAgICAgICAgdGhpcy5mcmFtZSA9IG5ldyBVaUZyYW1lKDAsIDAsIDAsIDApO1xyXG5cclxuXHJcbiAgICAgICAgaWYoZ2FtZS5za3lNb2QgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgZ2FtZS5za3lNb2QgPSAyO1xyXG5cclxuICAgICAgICBpZihnYW1lLnNreVRvZ2dsZSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICBnYW1lLnNreVRvZ2dsZSA9IHRydWU7XHJcblxyXG4gICAgICAgIGlmKGdhbWUucGFydGljbGVNdWx0aXBsaWVyID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIGdhbWUucGFydGljbGVNdWx0aXBsaWVyID0gMTtcclxuXHJcbiAgICAgICAgbGV0IHRlbXBTa3lNb2RlVGV4dDtcclxuXHJcbiAgICAgICAgaWYoZ2FtZS5za3lNb2Q9PT0yKSB7XHJcbiAgICAgICAgICAgIHRlbXBTa3lNb2RlVGV4dCA9IFwiSGFsZiBGcmFtZXJhdGVcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZihnYW1lLnNreU1vZD09PTEpIHtcclxuICAgICAgICAgICAgdGVtcFNreU1vZGVUZXh0ID0gXCJGdWxsIEZyYW1lcmF0ZVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGVtcFNreU1vZGVUZXh0ID0gXCJTb2xpZCBDb2xvclwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHRlbXBQYXJ0aWNsZVRleHQ7XHJcblxyXG4gICAgICAgIGlmKGdhbWUucGFydGljbGVNdWx0aXBsaWVyPT09Mikge1xyXG4gICAgICAgICAgICB0ZW1wUGFydGljbGVUZXh0ID0gXCJEb3VibGVcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZihnYW1lLnBhcnRpY2xlTXVsdGlwbGllcj09PTEpIHtcclxuICAgICAgICAgICAgdGVtcFBhcnRpY2xlVGV4dCA9IFwiTm9ybWFsXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0ZW1wUGFydGljbGVUZXh0ID0gXCJNaW5pbWFsXCI7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgLy8gbWFrZSBzb21lIGJ1dHRvbnMgd2l0aCBkZWZhdWx0IHBvc2l0aW9uc1xyXG4gICAgICAgIHRoaXMuYnV0dG9ucyA9IFtcclxuICAgICAgICAgICAgbmV3IEJ1dHRvbihmb250LCBgU2t5OiAke3RlbXBTa3lNb2RlVGV4dH1gLCBcIkNoYW5nZSB0aGUgYXBwZWFyYW5jZSBvZiB0aGUgc2t5LlwiLCAwLCAwLCAwLCAwLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInNreSB0b2dnbGVcIik7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLmJ1dHRvbnNbMF0udHh0ID09PSBcIlNreTogSGFsZiBGcmFtZXJhdGVcIil7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idXR0b25zWzBdLnR4dCA9IFwiU2t5OiBGdWxsIEZyYW1lcmF0ZVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGdhbWUuc2t5TW9kID0gMTtcclxuICAgICAgICAgICAgICAgICAgICBnYW1lLnNreVRvZ2dsZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmKHRoaXMuYnV0dG9uc1swXS50eHQgPT09IFwiU2t5OiBGdWxsIEZyYW1lcmF0ZVwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idXR0b25zWzBdLnR4dCA9IFwiU2t5OiBTb2xpZCBDb2xvclwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGdhbWUuc2t5VG9nZ2xlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1dHRvbnNbMF0udHh0ID0gXCJTa3k6IEhhbGYgRnJhbWVyYXRlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS5za3lNb2QgPSAyO1xyXG4gICAgICAgICAgICAgICAgICAgIGdhbWUuc2t5VG9nZ2xlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIG5ldyBCdXR0b24oZm9udCwgYFBhcnRpY2xlczogJHt0ZW1wUGFydGljbGVUZXh0fWAsIFwiQ2hhbmdlIHRoZSBhbW91bnQgb2YgcGFydGljbGVzXCIsIDAsIDAsIDAsIDAsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicGFydGljbGVzXCIpO1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5idXR0b25zWzFdLnR4dCA9PT0gXCJQYXJ0aWNsZXM6IE5vcm1hbFwiKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1dHRvbnNbMV0udHh0ID0gXCJQYXJ0aWNsZXM6IERvdWJsZVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGdhbWUucGFydGljbGVNdWx0aXBsaWVyID0gMjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYodGhpcy5idXR0b25zWzFdLnR4dCA9PT0gXCJQYXJ0aWNsZXM6IERvdWJsZVwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idXR0b25zWzFdLnR4dCA9IFwiUGFydGljbGVzOiBNaW5pbWFsXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS5wYXJ0aWNsZU11bHRpcGxpZXIgPSAwLjU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1dHRvbnNbMV0udHh0ID0gXCJQYXJ0aWNsZXM6IE5vcm1hbFwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGdhbWUucGFydGljbGVNdWx0aXBsaWVyID0gMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIG5ldyBCdXR0b24oZm9udCwgXCJCYWNrXCIsIFwiUmV0dXJuIHRvIHRoZSBtYWluIG1lbnUuXCIsIDAsIDAsIDAsIDAsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibWFpbiBtZW51XCIpO1xyXG4gICAgICAgICAgICAgICAgZ2FtZS5jdXJyZW50VWkgPSBuZXcgT3B0aW9uc01lbnUoZm9udCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgXTtcclxuICAgICAgICAvLyB1cGRhdGUgdGhlIHNpemUgb2YgdGhlIGVsZW1lbnRzIGJhc2VkIG9uIHRoZSBpbml0aWFsIHNjcmVlbiBzaXplXHJcbiAgICAgICAgdGhpcy53aW5kb3dVcGRhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIodGFyZ2V0OiBwNSwgdXBzY2FsZVNpemU6IG51bWJlcik6IHZvaWQge1xyXG5cclxuICAgICAgICAvLyByZW5kZXIgdGhlIHJlY3Rhbmd1bGFyIGltYWdlXHJcbiAgICAgICAgdGhpcy5mcmFtZS5yZW5kZXIodGFyZ2V0LCB1cHNjYWxlU2l6ZSk7XHJcblxyXG4gICAgICAgIC8vIGxvb3AgdGhyb3VnaCB0aGUgYnV0dG9ucyBhcnJheSBhbmQgcmVuZGVyIGVhY2ggb25lLlxyXG4gICAgICAgIHRoaXMuYnV0dG9ucy5mb3JFYWNoKGJ1dHRvbiA9PiB7XHJcbiAgICAgICAgICAgIGJ1dHRvbi5yZW5kZXIodGFyZ2V0LCB1cHNjYWxlU2l6ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgd2luZG93VXBkYXRlKCkge1xyXG4gICAgICAgIC8vIHNldCB0aGUgcG9zaXRpb24gb2YgdGhlIGZyYW1lXHJcbiAgICAgICAgdGhpcy5mcmFtZS54ID0gZ2FtZS53aWR0aCAvIDIgLSAyMDAgLyAyICogZ2FtZS51cHNjYWxlU2l6ZTsvLyBjZW50ZXIgdGhlIGZyYW1lIGluIHRoZSBjZW50ZXIgb2YgdGhlIHNjcmVlblxyXG4gICAgICAgIHRoaXMuZnJhbWUueSA9IGdhbWUuaGVpZ2h0IC8gMiAtIDU2ICogZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICB0aGlzLmZyYW1lLncgPSAyMDAgKiBnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgIHRoaXMuZnJhbWUuaCA9IDQ4ICogZ2FtZS51cHNjYWxlU2l6ZTtcclxuXHJcbiAgICAgICAgLy8gc2V0IHRoZSBwb3NpdGlvbnMgb2YgYWxsIHRoZSBidXR0b25zXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAzOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLnggPSBnYW1lLndpZHRoIC8gMiAtIDE5MiAvIDIgKiBnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0ueSA9IGdhbWUuaGVpZ2h0IC8gMiArIDIwICogaSAqIGdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS53ID0gMTkyICogZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLmggPSAxNiAqIGdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS51cGRhdGVNb3VzZU92ZXIoZ2FtZS5tb3VzZVgsIGdhbWUubW91c2VZKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IFVpU2NyZWVuIGZyb20gJy4uL1VpU2NyZWVuJztcclxuaW1wb3J0IHA1IGZyb20gJ3A1JztcclxuaW1wb3J0IFVpRnJhbWUgZnJvbSAnLi4vVWlGcmFtZSc7XHJcbmltcG9ydCBnYW1lIGZyb20gJy4uLy4uL01haW4nO1xyXG5pbXBvcnQgQnV0dG9uIGZyb20gJy4uL0J1dHRvbic7XHJcbmltcG9ydCBGb250UmVzb3VyY2UgZnJvbSAnLi4vLi4vYXNzZXRzL3Jlc291cmNlcy9Gb250UmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBNYWluTWVudSB9IGZyb20gJy4vTWFpbk1lbnUnO1xyXG5pbXBvcnQgeyBXb3JsZE9wdGlvbnNNZW51IH0gZnJvbSAnLi9Xb3JsZE9wdGlvbnNNZW51JztcclxuXHJcbmV4cG9ydCBjbGFzcyBXb3JsZENyZWF0aW9uTWVudSBleHRlbmRzIFVpU2NyZWVuIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihmb250OiBGb250UmVzb3VyY2UpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIC8vIG1ha2UgdGhlIGZyYW1lIHdpdGggc29tZSBkZWZhdWx0IHZhbHVlcy4gIFRoZXNlIHdpbGwgbGF0ZXIgYmUgY2hhbmdlZCB0byBmaXQgdGhlIHNjcmVlbiBzaXplLlxyXG4gICAgICAgIHRoaXMuZnJhbWUgPSBuZXcgVWlGcmFtZSgwLCAwLCAwLCAwKTtcclxuICAgICAgICAvLyBtYWtlIHNvbWUgYnV0dG9ucyB3aXRoIGRlZmF1bHQgcG9zaXRpb25zXHJcbiAgICAgICAgaWYgKGdhbWUuc2VydmVyVmlzaWJpbGl0eSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICBnYW1lLnNlcnZlclZpc2liaWxpdHkgPSBcIlB1YmxpY1wiO1xyXG5cclxuICAgICAgICB0aGlzLmJ1dHRvbnMgPSBbXHJcbiAgICAgICAgICAgIG5ldyBCdXR0b24oZm9udCwgYFNlcnZlciBWaXNpYmlsaXR5OiAke2dhbWUuc2VydmVyVmlzaWJpbGl0eX1gLCBcIkNoYW5nZSB0aGUgdmlzaWJpbGl0eSBvZiB0aGUgc2VydmVyXCIsIDAsIDAsIDAsIDAsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmJ1dHRvbnNbMF0udHh0ID09PSBcIlNlcnZlciBWaXNpYmlsaXR5OiBQdWJsaWNcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIGdhbWUuc2VydmVyVmlzaWJpbGl0eSA9IFwiVW5saXN0ZWRcIjtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1dHRvbnNbMF0udHh0ID0gXCJTZXJ2ZXIgVmlzaWJpbGl0eTogVW5saXN0ZWRcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuYnV0dG9uc1swXS50eHQgPT09IFwiU2VydmVyIFZpc2liaWxpdHk6IFVubGlzdGVkXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBnYW1lLnNlcnZlclZpc2liaWxpdHkgPSBcIlByaXZhdGVcIjtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1dHRvbnNbMF0udHh0ID0gXCJTZXJ2ZXIgVmlzaWJpbGl0eTogUHJpdmF0ZVwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS5zZXJ2ZXJWaXNpYmlsaXR5ID0gXCJQdWJsaWNcIjtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1dHRvbnNbMF0udHh0ID0gXCJTZXJ2ZXIgVmlzaWJpbGl0eTogUHVibGljXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBuZXcgQnV0dG9uKGZvbnQsIFwiV29ybGQgT3B0aW9uc1wiLCBcIkNoYW5nZSBob3cgeW91ciB3b3JsZCBsb29rcyBhbmQgZ2VuZXJhdGVzLlwiLCAwLCAwLCAwLCAwLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIndvcmxkIG1lbnVcIik7XHJcbiAgICAgICAgICAgICAgICBnYW1lLmN1cnJlbnRVaSA9IG5ldyBXb3JsZE9wdGlvbnNNZW51KGZvbnQpO1xyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgbmV3IEJ1dHRvbihmb250LCBcIkJhY2tcIiwgXCJSZXR1cm4gdG8gdGhlIG1haW4gbWVudS5cIiwgMCwgMCwgMCwgMCwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJtYWluIG1lbnVcIik7XHJcbiAgICAgICAgICAgICAgICBnYW1lLmN1cnJlbnRVaSA9IG5ldyBNYWluTWVudShmb250KTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICBdO1xyXG4gICAgICAgIC8vIHVwZGF0ZSB0aGUgc2l6ZSBvZiB0aGUgZWxlbWVudHMgYmFzZWQgb24gdGhlIGluaXRpYWwgc2NyZWVuIHNpemVcclxuICAgICAgICB0aGlzLndpbmRvd1VwZGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcih0YXJnZXQ6IHA1LCB1cHNjYWxlU2l6ZTogbnVtYmVyKTogdm9pZCB7XHJcblxyXG4gICAgICAgIC8vIHJlbmRlciB0aGUgcmVjdGFuZ3VsYXIgaW1hZ2UgdGhhdCB0aGUgd2hvbGUgbWVudSBpcyBvblxyXG4gICAgICAgIHRoaXMuZnJhbWUucmVuZGVyKHRhcmdldCwgdXBzY2FsZVNpemUpO1xyXG5cclxuICAgICAgICAvLyBsb29wIHRocm91Z2ggdGhlIGJ1dHRvbnMgYXJyYXkgYW5kIHJlbmRlciBlYWNoIG9uZS5cclxuICAgICAgICB0aGlzLmJ1dHRvbnMuZm9yRWFjaChidXR0b24gPT4ge1xyXG4gICAgICAgICAgICBidXR0b24ucmVuZGVyKHRhcmdldCwgdXBzY2FsZVNpemUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHdpbmRvd1VwZGF0ZSgpIHtcclxuICAgICAgICAvLyBzZXQgdGhlIHBvc2l0aW9uIG9mIHRoZSBmcmFtZVxyXG4gICAgICAgIHRoaXMuZnJhbWUueCA9IGdhbWUud2lkdGggLyAyIC0gMjAwIC8gMiAqIGdhbWUudXBzY2FsZVNpemU7Ly8gY2VudGVyIHRoZSBmcmFtZSBpbiB0aGUgY2VudGVyIG9mIHRoZSBzY3JlZW5cclxuICAgICAgICB0aGlzLmZyYW1lLnkgPSBnYW1lLmhlaWdodCAvIDIgLSA1NiAqIGdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgdGhpcy5mcmFtZS53ID0gMjAwICogZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICB0aGlzLmZyYW1lLmggPSA0OCAqIGdhbWUudXBzY2FsZVNpemU7XHJcblxyXG4gICAgICAgIC8vIHNldCB0aGUgcG9zaXRpb25zIG9mIGFsbCB0aGUgYnV0dG9uc1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS54ID0gZ2FtZS53aWR0aCAvIDIgLSAxOTIgLyAyICogZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLnkgPSBnYW1lLmhlaWdodCAvIDIgKyAyMCAqIGkgKiBnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0udyA9IDE5MiAqIGdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS5oID0gMTYgKiBnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0udXBkYXRlTW91c2VPdmVyKGdhbWUubW91c2VYLCBnYW1lLm1vdXNlWSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCBVaVNjcmVlbiBmcm9tICcuLi9VaVNjcmVlbic7XHJcbmltcG9ydCBwNSBmcm9tICdwNSc7XHJcbmltcG9ydCBVaUZyYW1lIGZyb20gJy4uL1VpRnJhbWUnO1xyXG5pbXBvcnQgZ2FtZSBmcm9tICcuLi8uLi9NYWluJztcclxuaW1wb3J0IEJ1dHRvbiBmcm9tICcuLi9CdXR0b24nO1xyXG5pbXBvcnQgRm9udFJlc291cmNlIGZyb20gJy4uLy4uL2Fzc2V0cy9yZXNvdXJjZXMvRm9udFJlc291cmNlJztcclxuaW1wb3J0IHsgV29ybGRDcmVhdGlvbk1lbnUgfSBmcm9tICcuL1dvcmxkQ3JlYXRpb25NZW51JztcclxuaW1wb3J0IFNsaWRlciBmcm9tICcuLi9TbGlkZXInO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdvcmxkT3B0aW9uc01lbnUgZXh0ZW5kcyBVaVNjcmVlbiB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZm9udDogRm9udFJlc291cmNlKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICAvLyBtYWtlIHRoZSBmcmFtZSB3aXRoIHNvbWUgZGVmYXVsdCB2YWx1ZXMuICBUaGVzZSB3aWxsIGxhdGVyIGJlIGNoYW5nZWQgdG8gZml0IHRoZSBzY3JlZW4gc2l6ZS5cclxuICAgICAgICB0aGlzLmZyYW1lID0gbmV3IFVpRnJhbWUoMCwgMCwgMCwgMCk7XHJcbiAgICAgICAgLy8gbWFrZSBzb21lIGJ1dHRvbnMgd2l0aCBkZWZhdWx0IHBvc2l0aW9uc1xyXG4gICAgICAgIGlmKGdhbWUud29ybGRCdW1waW5lc3MgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgZ2FtZS53b3JsZEJ1bXBpbmVzcyA9IDE7XHJcblxyXG5cclxuICAgICAgICBsZXQgdGVtcFdvcmxkQnVtcGluZXNzVGV4dDtcclxuXHJcbiAgICAgICAgaWYoZ2FtZS53b3JsZEJ1bXBpbmVzcz09PTEpIHtcclxuICAgICAgICAgICAgdGVtcFdvcmxkQnVtcGluZXNzVGV4dCA9IFwiTm9ybWFsXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYoZ2FtZS53b3JsZEJ1bXBpbmVzcz09PTApIHtcclxuICAgICAgICAgICAgdGVtcFdvcmxkQnVtcGluZXNzVGV4dCA9IFwiU3VwZXJmbGF0XCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0ZW1wV29ybGRCdW1waW5lc3NUZXh0ID0gXCJBbXBsaWZpZWRcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5idXR0b25zID0gW1xyXG4gICAgICAgICAgICBuZXcgQnV0dG9uKGZvbnQsIGBXb3JsZCBCdW1waW5lc3M6ICR7dGVtcFdvcmxkQnVtcGluZXNzVGV4dH1gLCBcIkNoYW5nZSB0aGUgaW50ZW5zaXR5IG9mIHRoZSB3b3JsZCdzIGJ1bXBzLlwiLCAwLCAwLCAwLCAwLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLmJ1dHRvbnNbMF0udHh0ID09PSBcIldvcmxkIEJ1bXBpbmVzczogTm9ybWFsXCIpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnV0dG9uc1swXS50eHQgPSBcIldvcmxkIEJ1bXBpbmVzczogQW1wbGlmaWVkXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS53b3JsZEJ1bXBpbmVzcyA9IDM7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmKHRoaXMuYnV0dG9uc1swXS50eHQgPT09IFwiV29ybGQgQnVtcGluZXNzOiBBbXBsaWZpZWRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnV0dG9uc1swXS50eHQgPSBcIldvcmxkIEJ1bXBpbmVzczogU3VwZXJmbGF0XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS53b3JsZEJ1bXBpbmVzcyA9IDA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1dHRvbnNbMF0udHh0ID0gXCJXb3JsZCBCdW1waW5lc3M6IE5vcm1hbFwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGdhbWUud29ybGRCdW1waW5lc3MgPSAxO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgbmV3IEJ1dHRvbihmb250LCBcIkJhY2tcIiwgXCJSZXR1cm4gdG8gdGhlIG1haW4gbWVudS5cIiwgMCwgMCwgMCwgMCwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJtYWluIG1lbnVcIik7XHJcbiAgICAgICAgICAgICAgICBnYW1lLmN1cnJlbnRVaSA9IG5ldyBXb3JsZENyZWF0aW9uTWVudShmb250KTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICBdO1xyXG4gICAgICAgIHRoaXMuc2xpZGVycyA9IFtcclxuICAgICAgICAgICAgbmV3IFNsaWRlcihmb250LCBcIldpZHRoXCIsIDUxMiwgNjQsIDIwNDgsIDY0LCAwLCAwLCAwLCAwLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBnYW1lLndvcmxkV2lkdGggPSB0aGlzLnNsaWRlcnNbMF0udmFsdWU7XHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBuZXcgU2xpZGVyKGZvbnQsIFwiSGVpZ2h0XCIsIDY0LCA2NCwgNTEyLCAxNiwgMCwgMCwgMCwgMCwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZ2FtZS53b3JsZEhlaWdodCA9IHRoaXMuc2xpZGVyc1sxXS52YWx1ZTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICBdO1xyXG4gICAgICAgIC8vIHVwZGF0ZSB0aGUgc2l6ZSBvZiB0aGUgZWxlbWVudHMgYmFzZWQgb24gdGhlIGluaXRpYWwgc2NyZWVuIHNpemVcclxuICAgICAgICB0aGlzLndpbmRvd1VwZGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcih0YXJnZXQ6IHA1LCB1cHNjYWxlU2l6ZTogbnVtYmVyKTogdm9pZCB7XHJcblxyXG4gICAgICAgIC8vIHJlbmRlciB0aGUgcmVjdGFuZ3VsYXIgaW1hZ2UgdGhhdCB0aGUgd2hvbGUgbWVudSBpcyBvblxyXG4gICAgICAgIHRoaXMuZnJhbWUucmVuZGVyKHRhcmdldCwgdXBzY2FsZVNpemUpO1xyXG5cclxuICAgICAgICAvLyBsb29wIHRocm91Z2ggdGhlIGJ1dHRvbnMgYXJyYXkgYW5kIHJlbmRlciBlYWNoIG9uZS5cclxuICAgICAgICB0aGlzLmJ1dHRvbnMuZm9yRWFjaChidXR0b24gPT4ge1xyXG4gICAgICAgICAgICBidXR0b24ucmVuZGVyKHRhcmdldCwgdXBzY2FsZVNpemUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBsb29wIHRocm91Z2ggdGhlIHNsaWRlcnMgYXJyYXkgYW5kIHJlbmRlciBlYWNoIG9uZS5cclxuICAgICAgICB0aGlzLnNsaWRlcnMuZm9yRWFjaChzbGlkZXIgPT4ge1xyXG4gICAgICAgICAgICBzbGlkZXIucmVuZGVyKHRhcmdldCwgdXBzY2FsZVNpemUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHdpbmRvd1VwZGF0ZSgpIHtcclxuICAgICAgICAvLyBzZXQgdGhlIHBvc2l0aW9uIG9mIHRoZSBmcmFtZVxyXG4gICAgICAgIHRoaXMuZnJhbWUueCA9IGdhbWUud2lkdGgvMi0yMDAvMipnYW1lLnVwc2NhbGVTaXplOy8vIGNlbnRlciB0aGUgZnJhbWUgaW4gdGhlIGNlbnRlciBvZiB0aGUgc2NyZWVuXHJcbiAgICAgICAgdGhpcy5mcmFtZS55ID0gZ2FtZS5oZWlnaHQvMi01NipnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgIHRoaXMuZnJhbWUudyA9IDIwMCpnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgIHRoaXMuZnJhbWUuaCA9IDQ4KmdhbWUudXBzY2FsZVNpemU7XHJcblxyXG4gICAgICAgIC8vIHNldCB0aGUgcG9zaXRpb25zIG9mIGFsbCB0aGUgYnV0dG9uc1xyXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGk8MjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS54ID0gZ2FtZS53aWR0aC8yLTE5Mi8yKmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS55ID0gZ2FtZS5oZWlnaHQvMis2MCppKmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS53ID0gMTkyKmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS5oID0gMTYqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLnVwZGF0ZU1vdXNlT3ZlcihnYW1lLm1vdXNlWCwgZ2FtZS5tb3VzZVkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gc2V0IHRoZSBwb3NpdGlvbnMgb2YgYWxsIHRoZSBzbGlkZXJzXHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaTwyOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5zbGlkZXJzW2ldLnggPSBnYW1lLndpZHRoLzItMTkyLzIqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5zbGlkZXJzW2ldLnkgPSBnYW1lLmhlaWdodC8yKzIwKmdhbWUudXBzY2FsZVNpemUrMjAqaSpnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLnNsaWRlcnNbaV0udyA9IDE5MipnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLnNsaWRlcnNbaV0uaCA9IDE2KmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIGlmKGdhbWUubW91c2VJc1ByZXNzZWQpXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNsaWRlcnNbaV0udXBkYXRlU2xpZGVyUG9zaXRpb24oZ2FtZS5tb3VzZVgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgR2FtZSBmcm9tICcuLi9HYW1lJztcclxuaW1wb3J0IFdvcmxkIGZyb20gJy4uL3dvcmxkL1dvcmxkJztcclxuaW1wb3J0IHsgRW50aXR5Q2xhc3NlcyB9IGZyb20gJy4uL3dvcmxkL2VudGl0aWVzL0VudGl0eUNsYXNzZXMnO1xyXG5pbXBvcnQgUGxheWVyTG9jYWwgZnJvbSAnLi4vd29ybGQvZW50aXRpZXMvUGxheWVyTG9jYWwnO1xyXG5cclxuZXhwb3J0IGNsYXNzIE5ldE1hbmFnZXIge1xyXG5cclxuICAgIGdhbWU6IEdhbWVcclxuXHJcbiAgICBwbGF5ZXJUaWNrUmF0ZTogbnVtYmVyXHJcblxyXG4gICAgY29uc3RydWN0b3IoZ2FtZTogR2FtZSkge1xyXG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWVcclxuXHJcbiAgICAgICAgLy8gSW5pdCBldmVudFxyXG4gICAgICAgIHRoaXMuZ2FtZS5jb25uZWN0aW9uLm9uKCdpbml0JywgKCBwbGF5ZXJUaWNrUmF0ZSwgdG9rZW4gKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBUaWNrIHJhdGUgc2V0IHRvOiAke3BsYXllclRpY2tSYXRlfWApO1xyXG4gICAgICAgICAgICB0aGlzLnBsYXllclRpY2tSYXRlID0gcGxheWVyVGlja1JhdGU7XHJcbiAgICAgICAgICAgIGlmICh0b2tlbikge1xyXG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKCd0b2tlbicsIHRva2VuKTtcclxuICAgICAgICAgICAgICAgICh0aGlzLmdhbWUuY29ubmVjdGlvbi5hdXRoIGFzIHsgdG9rZW46IHN0cmluZyB9KS50b2tlbiA9IHRva2VuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIEluaXRpYWxpemF0aW9uIGV2ZW50c1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy8gTG9hZCB0aGUgd29ybGQgYW5kIHNldCB0aGUgcGxheWVyIGVudGl0eSBpZFxyXG4gICAgICAgICAgICB0aGlzLmdhbWUuY29ubmVjdGlvbi5vbihcclxuICAgICAgICAgICAgICAgICd3b3JsZExvYWQnLCh3aWR0aCwgaGVpZ2h0LCB0aWxlcywgdGlsZUVudGl0aWVzLCBlbnRpdGllcywgcGxheWVyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZW50aXRpZXMpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nYW1lLndvcmxkID0gbmV3IFdvcmxkKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aWxlcyxcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS53b3JsZC5wbGF5ZXIgPSBuZXcgUGxheWVyTG9jYWwocGxheWVyKVxyXG4gICAgICAgICAgICAgICAgICAgIGVudGl0aWVzLmZvckVhY2goKGVudGl0eSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWUud29ybGQuZW50aXRpZXNbZW50aXR5LmlkXSA9IG5ldyBFbnRpdHlDbGFzc2VzW2VudGl0eS50eXBlXShlbnRpdHkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBXb3JsZCBldmVudHNcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vIFRpbGUgdXBkYXRlcyBzdWNoIGFzIGJyZWFraW5nIGFuZCBwbGFjaW5nXHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5jb25uZWN0aW9uLm9uKFxyXG4gICAgICAgICAgICAgICAgJ3dvcmxkVXBkYXRlJyxcclxuICAgICAgICAgICAgICAgICh1cGRhdGVkVGlsZXM6IHsgdGlsZUluZGV4OiBudW1iZXI7IHRpbGU6IG51bWJlciB9W10pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGUgd29ybGQgaXMgbm90IHNldFxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmdhbWUud29ybGQgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB1cGRhdGVkVGlsZXMuZm9yRWFjaCgodGlsZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWUud29ybGQudXBkYXRlVGlsZSh0aWxlLnRpbGVJbmRleCwgdGlsZS50aWxlKVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gUGxheWVyIGV2ZW50c1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy8gVXBkYXRlIHRoZSBwbGF5ZXJcclxuICAgICAgICAgICAgdGhpcy5nYW1lLmNvbm5lY3Rpb24ub24oJ3NldFBsYXllcicsICh4LCB5LCB5VmVsLCB4VmVsKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyBJZiB0aGUgd29ybGQgaXMgbm90IHNldFxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2FtZS53b3JsZCA9PT0gdW5kZWZpbmVkKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLndvcmxkLnBsYXllci54ID0geDtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS53b3JsZC5wbGF5ZXIueSA9IHk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUud29ybGQucGxheWVyLnlWZWwgPSB5VmVsO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLndvcmxkLnBsYXllci54VmVsID0geFZlbDtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmdhbWUuY29ubmVjdGlvbi5vbignZW50aXR5VXBkYXRlJywgKGVudGl0eURhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIElmIHRoZSB3b3JsZCBpcyBub3Qgc2V0XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nYW1lLndvcmxkID09PSB1bmRlZmluZWQpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBlbnRpdHkgPSB0aGlzLmdhbWUud29ybGQuZW50aXRpZXNbZW50aXR5RGF0YS5pZF1cclxuICAgICAgICAgICAgICAgIGlmIChlbnRpdHkgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgIGVudGl0eS51cGRhdGVEYXRhKGVudGl0eURhdGEpXHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICB0aGlzLmdhbWUuY29ubmVjdGlvbi5vbignZW50aXR5Q3JlYXRlJywgKGVudGl0eURhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIElmIHRoZSB3b3JsZCBpcyBub3Qgc2V0XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nYW1lLndvcmxkID09PSB1bmRlZmluZWQpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUud29ybGQuZW50aXRpZXNbZW50aXR5RGF0YS5pZF0gPSBuZXcgRW50aXR5Q2xhc3Nlc1tlbnRpdHlEYXRhLnR5cGVdKGVudGl0eURhdGEpO1xyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgdGhpcy5nYW1lLmNvbm5lY3Rpb24ub24oJ2VudGl0eURlbGV0ZScsIChpZCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlIHdvcmxkIGlzIG5vdCBzZXRcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdhbWUud29ybGQgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmdhbWUud29ybGQuZW50aXRpZXNbaWRdXHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICAvLyBVcGRhdGUgdGhlIG90aGVyIHBsYXllcnMgaW4gdGhlIHdvcmxkXHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5jb25uZWN0aW9uLm9uKFxyXG4gICAgICAgICAgICAgICAgJ2VudGl0eVNuYXBzaG90JyxcclxuICAgICAgICAgICAgICAgIChzbmFwc2hvdDoge1xyXG4gICAgICAgICAgICAgICAgICAgIGlkOiBzdHJpbmc7XHJcbiAgICAgICAgICAgICAgICAgICAgdGltZTogbnVtYmVyO1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlOiB7IGlkOiBzdHJpbmc7IHg6IHN0cmluZzsgeTogc3RyaW5nIH1bXTtcclxuICAgICAgICAgICAgICAgIH0pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGUgd29ybGQgaXMgbm90IHNldFxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmdhbWUud29ybGQgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWUud29ybGQudXBkYXRlUGxheWVycyhzbmFwc2hvdClcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IGdhbWUgZnJvbSAnLi4vTWFpbic7XHJcbmltcG9ydCBQNSBmcm9tICdwNSc7XHJcbmltcG9ydCBwNSBmcm9tICdwNSc7XHJcbmltcG9ydCBJbWFnZVJlc291cmNlIGZyb20gJy4uL2Fzc2V0cy9yZXNvdXJjZXMvSW1hZ2VSZXNvdXJjZSc7XHJcbmltcG9ydCBUaWxlUmVzb3VyY2UgZnJvbSAnLi4vYXNzZXRzL3Jlc291cmNlcy9UaWxlUmVzb3VyY2UnO1xyXG5pbXBvcnQgVGlja2FibGUgZnJvbSAnLi4vaW50ZXJmYWNlcy9UaWNrYWJsZSc7XHJcbmltcG9ydCBSZW5kZXJhYmxlIGZyb20gJy4uL2ludGVyZmFjZXMvUmVuZGVyYWJsZSc7XHJcbmltcG9ydCBHYW1lIGZyb20gJy4uL0dhbWUnO1xyXG5pbXBvcnQgUGxheWVyTG9jYWwgZnJvbSAnLi9lbnRpdGllcy9QbGF5ZXJMb2NhbCc7XHJcbmltcG9ydCB7IFNlcnZlckVudGl0eSB9IGZyb20gJy4vZW50aXRpZXMvU2VydmVyRW50aXR5JztcclxuaW1wb3J0IHsgU25hcHNob3RJbnRlcnBvbGF0aW9uIH0gZnJvbSAnQGdlY2tvcy5pby9zbmFwc2hvdC1pbnRlcnBvbGF0aW9uJztcclxuaW1wb3J0IHsgRW50aXR5LCBTbmFwc2hvdCB9IGZyb20gJ0BnZWNrb3MuaW8vc25hcHNob3QtaW50ZXJwb2xhdGlvbi9saWIvdHlwZXMnO1xyXG5pbXBvcnQgeyBUaWxlLCBXb3JsZFRpbGVzIH0gZnJvbSAnLi9Xb3JsZFRpbGVzJztcclxuaW1wb3J0IHsgVGlsZVR5cGUgfSBmcm9tICcuLi8uLi8uLi9hcGkvVGlsZSc7XHJcblxyXG5jbGFzcyBXb3JsZCBpbXBsZW1lbnRzIFRpY2thYmxlLCBSZW5kZXJhYmxlIHtcclxuICAgIHdpZHRoOiBudW1iZXI7IC8vIHdpZHRoIG9mIHRoZSB3b3JsZCBpbiB0aWxlc1xyXG4gICAgaGVpZ2h0OiBudW1iZXI7IC8vIGhlaWdodCBvZiB0aGUgd29ybGQgaW4gdGlsZXNcclxuXHJcbiAgICB0aWxlTGF5ZXI6IFA1LkdyYXBoaWNzOyAvLyBUaWxlIGxheWVyIGdyYXBoaWNcclxuXHJcblxyXG4gICAgd29ybGRUaWxlczogKFRpbGVUeXBlKVtdOyAvLyBudW1iZXIgZm9yIGVhY2ggdGlsZXMgaW4gdGhlIHdvcmxkIGV4OiBbMSwgMSwgMCwgMSwgMiwgMCwgMCwgMS4uLiAgXSBtZWFucyBzbm93LCBzbm93LCBhaXIsIHNub3csIGljZSwgYWlyLCBhaXIsIHNub3cuLi5cclxuXHJcbiAgICBwbGF5ZXI6IFBsYXllckxvY2FsO1xyXG5cclxuICAgIGVudGl0aWVzOiB7IFtpZDogc3RyaW5nXTogU2VydmVyRW50aXR5IH0gPSB7fTtcclxuXHJcbiAgICBzbmFwc2hvdEludGVycG9sYXRpb246IFNuYXBzaG90SW50ZXJwb2xhdGlvbjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICB3aWR0aDogbnVtYmVyLFxyXG4gICAgICAgIGhlaWdodDogbnVtYmVyLFxyXG4gICAgICAgIHRpbGVzOiAoVGlsZVR5cGUpW11cclxuICAgICkge1xyXG4gICAgICAgIC8vIEluaXRpYWxpemUgdGhlIHdvcmxkIHdpdGggdGhlIHRpbGVzIGFuZCBkaW1lbnNpb25zIGZyb20gdGhlIHNlcnZlclxyXG4gICAgICAgIHRoaXMud2lkdGggPSB3aWR0aDtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcclxuICAgICAgICB0aGlzLndvcmxkVGlsZXMgPSB0aWxlcztcclxuXHJcbiAgICAgICAgdGhpcy5zbmFwc2hvdEludGVycG9sYXRpb24gPSBuZXcgU25hcHNob3RJbnRlcnBvbGF0aW9uKCk7XHJcbiAgICAgICAgdGhpcy5zbmFwc2hvdEludGVycG9sYXRpb24uaW50ZXJwb2xhdGlvbkJ1ZmZlci5zZXQoXHJcbiAgICAgICAgICAgICgxMDAwIC8gZ2FtZS5uZXRNYW5hZ2VyLnBsYXllclRpY2tSYXRlKSAqIDJcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICAvLyBkZWZpbmUgdGhlIHA1LkdyYXBoaWNzIG9iamVjdHMgdGhhdCBob2xkIGFuIGltYWdlIG9mIHRoZSB0aWxlcyBvZiB0aGUgd29ybGQuICBUaGVzZSBhY3Qgc29ydCBvZiBsaWtlIGEgdmlydHVhbCBjYW52YXMgYW5kIGNhbiBiZSBkcmF3biBvbiBqdXN0IGxpa2UgYSBub3JtYWwgY2FudmFzIGJ5IHVzaW5nIHRpbGVMYXllci5yZWN0KCk7LCB0aWxlTGF5ZXIuZWxsaXBzZSgpOywgdGlsZUxheWVyLmZpbGwoKTssIGV0Yy5cclxuICAgICAgICB0aGlzLnRpbGVMYXllciA9IGdhbWUuY3JlYXRlR3JhcGhpY3MoXHJcbiAgICAgICAgICAgIHRoaXMud2lkdGggKiBnYW1lLlRJTEVfV0lEVEgsXHJcbiAgICAgICAgICAgIHRoaXMuaGVpZ2h0ICogZ2FtZS5USUxFX0hFSUdIVFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHRoaXMubG9hZFdvcmxkKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGljayhnYW1lOiBHYW1lKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucGxheWVyICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIGdhbWUuY29ubmVjdGlvbi5lbWl0KCdwbGF5ZXJVcGRhdGUnLCB0aGlzLnBsYXllci54LCB0aGlzLnBsYXllci55KTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIodGFyZ2V0OiBHYW1lLCB1cHNjYWxlU2l6ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgLy8gZHJhdyB0aGUgdGlsZXMgbGF5ZXIgb250byB0aGUgc2NyZWVuXHJcbiAgICAgICAgdGFyZ2V0LmltYWdlKFxyXG4gICAgICAgICAgICB0aGlzLnRpbGVMYXllcixcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgKGdhbWUud2lkdGgvdXBzY2FsZVNpemUpKnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICAoZ2FtZS5oZWlnaHQvdXBzY2FsZVNpemUpKnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICAoZ2FtZS5pbnRlcnBvbGF0ZWRDYW1YICogZ2FtZS5USUxFX1dJRFRIKSxcclxuICAgICAgICAgICAgKGdhbWUuaW50ZXJwb2xhdGVkQ2FtWSAqIGdhbWUuVElMRV9XSURUSCksXHJcbiAgICAgICAgICAgIChnYW1lLndpZHRoIC8gdXBzY2FsZVNpemUpLFxyXG4gICAgICAgICAgICAoZ2FtZS5oZWlnaHQgLyB1cHNjYWxlU2l6ZSlcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICB0aGlzLnJlbmRlclBsYXllcnModGFyZ2V0LCB1cHNjYWxlU2l6ZSk7XHJcblxyXG4gICAgICAgIHRhcmdldC5zdHJva2UoMCk7XHJcbiAgICAgICAgdGFyZ2V0LnN0cm9rZVdlaWdodCg0KTtcclxuICAgICAgICB0YXJnZXQubm9GaWxsKCk7XHJcbiAgICAgICAgdGFyZ2V0LnJlY3QodGFyZ2V0LndpZHRoLXRoaXMud2lkdGgsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgdGFyZ2V0LmltYWdlKFxyXG4gICAgICAgICAgICB0aGlzLnRpbGVMYXllcixcclxuICAgICAgICAgICAgdGFyZ2V0LndpZHRoLXRoaXMud2lkdGgsXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIHRoaXMud2lkdGgsXHJcbiAgICAgICAgICAgIHRoaXMuaGVpZ2h0XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVQbGF5ZXJzKHNuYXBzaG90OiBTbmFwc2hvdCkge1xyXG4gICAgICAgIHRoaXMuc25hcHNob3RJbnRlcnBvbGF0aW9uLnNuYXBzaG90LmFkZChzbmFwc2hvdCk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlVGlsZSh0aWxlSW5kZXg6IG51bWJlciwgdGlsZTogVGlsZVR5cGUpIHtcclxuICAgICAgICAvLyBVcGRhdGUgdGhlIHRpbGUgYW5kIHRoZSA0IG5laWdoYm91cmluZyB0aWxlc1xyXG4gICAgICAgIHRoaXMud29ybGRUaWxlc1t0aWxlSW5kZXhdID0gdGlsZTtcclxuXHJcbiAgICAgICAgLy8gZXJhc2UgdGhlIGJyb2tlbiB0aWxlcyBhbmQgaXRzIHN1cnJvdW5kaW5nIHRpbGVzIHVzaW5nIHR3byBlcmFzaW5nIHJlY3RhbmdsZXMgaW4gYSArIHNoYXBlXHJcbiAgICAgICAgdGhpcy50aWxlTGF5ZXIuZXJhc2UoKTtcclxuICAgICAgICB0aGlzLnRpbGVMYXllci5ub1N0cm9rZSgpO1xyXG4gICAgICAgIHRoaXMudGlsZUxheWVyLnJlY3QoXHJcbiAgICAgICAgICAgICgodGlsZUluZGV4ICUgdGhpcy53aWR0aCkgLSAxKSAqIGdhbWUuVElMRV9XSURUSCxcclxuICAgICAgICAgICAgTWF0aC5mbG9vcih0aWxlSW5kZXggLyB0aGlzLndpZHRoKSAqIGdhbWUuVElMRV9IRUlHSFQsXHJcbiAgICAgICAgICAgIGdhbWUuVElMRV9XSURUSCAqIDMsXHJcbiAgICAgICAgICAgIGdhbWUuVElMRV9IRUlHSFRcclxuICAgICAgICApO1xyXG4gICAgICAgIHRoaXMudGlsZUxheWVyLnJlY3QoXHJcbiAgICAgICAgICAgICh0aWxlSW5kZXggJSB0aGlzLndpZHRoKSAqIGdhbWUuVElMRV9XSURUSCxcclxuICAgICAgICAgICAgKE1hdGguZmxvb3IodGlsZUluZGV4IC8gdGhpcy53aWR0aCkgLSAxKSAqIGdhbWUuVElMRV9IRUlHSFQsXHJcbiAgICAgICAgICAgIGdhbWUuVElMRV9XSURUSCxcclxuICAgICAgICAgICAgZ2FtZS5USUxFX0hFSUdIVCAqIDNcclxuICAgICAgICApO1xyXG4gICAgICAgIHRoaXMudGlsZUxheWVyLm5vRXJhc2UoKTtcclxuXHJcbiAgICAgICAgLy8gcmVkcmF3IHRoZSBuZWlnaGJvcmluZyB0aWxlc1xyXG4gICAgICAgIHRoaXMuZHJhd1RpbGUodGlsZUluZGV4KTtcclxuICAgICAgICB0aGlzLmRyYXdUaWxlKHRpbGVJbmRleCArIHRoaXMud2lkdGgpO1xyXG4gICAgICAgIHRoaXMuZHJhd1RpbGUodGlsZUluZGV4IC0gMSk7XHJcbiAgICAgICAgdGhpcy5kcmF3VGlsZSh0aWxlSW5kZXggLSB0aGlzLndpZHRoKTtcclxuICAgICAgICB0aGlzLmRyYXdUaWxlKHRpbGVJbmRleCArIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlclBsYXllcnModGFyZ2V0OiBHYW1lLCB1cHNjYWxlU2l6ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBpbnRlcnBvbGF0ZWQgcG9zaXRpb24gb2YgYWxsIHVwZGF0ZWQgZW50aXRpZXNcclxuICAgICAgICBjb25zdCBwb3NpdGlvblN0YXRlczogeyBbaWQ6IHN0cmluZ106IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfSB9ID0ge307XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgY2FsY3VsYXRlZFNuYXBzaG90ID1cclxuICAgICAgICAgICAgICAgIHRoaXMuc25hcHNob3RJbnRlcnBvbGF0aW9uLmNhbGNJbnRlcnBvbGF0aW9uKCd4IHknKTtcclxuICAgICAgICAgICAgaWYgKCFjYWxjdWxhdGVkU25hcHNob3QpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHN0YXRlID0gY2FsY3VsYXRlZFNuYXBzaG90LnN0YXRlO1xyXG4gICAgICAgICAgICBpZiAoIXN0YXRlKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAvLyBUaGUgbmV3IHBvc2l0aW9ucyBvZiBlbnRpdGllcyBhcyBvYmplY3RcclxuICAgICAgICAgICAgc3RhdGUuZm9yRWFjaCgoeyBpZCwgeCwgeSB9OiBFbnRpdHkgJiB7IHg6IG51bWJlcjsgeTogbnVtYmVyIH0pID0+IHtcclxuICAgICAgICAgICAgICAgIHBvc2l0aW9uU3RhdGVzW2lkXSA9IHsgeCwgeSB9O1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7fVxyXG5cclxuICAgICAgICAvLyBSZW5kZXIgZWFjaCBlbnRpdHkgaW4gcmFuZG9tIG9yZGVyIDpza3VsbDpcclxuICAgICAgICBPYmplY3QuZW50cmllcyh0aGlzLmVudGl0aWVzKS5mb3JFYWNoKFxyXG4gICAgICAgICAgICAoZW50aXR5OiBbc3RyaW5nLCBTZXJ2ZXJFbnRpdHldKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB1cGRhdGVkUG9zaXRpb24gPSBwb3NpdGlvblN0YXRlc1tlbnRpdHlbMF1dO1xyXG4gICAgICAgICAgICAgICAgaWYgKHVwZGF0ZWRQb3NpdGlvbiAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZW50aXR5WzFdLnggPSB1cGRhdGVkUG9zaXRpb24ueDtcclxuICAgICAgICAgICAgICAgICAgICBlbnRpdHlbMV0ueSA9IHVwZGF0ZWRQb3NpdGlvbi55O1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGVudGl0eVsxXS5yZW5kZXIodGFyZ2V0LCB1cHNjYWxlU2l6ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG5cclxuICAgICAgICAvLyBSZW5kZXIgdGhlIHBsYXllciBvbiB0b3AgOnRodW1ic3VwOlxyXG4gICAgICAgIGlmICh0aGlzLnBsYXllciAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGxheWVyLmZpbmRJbnRlcnBvbGF0ZWRDb29yZGluYXRlcygpO1xyXG4gICAgICAgICAgICB0aGlzLnBsYXllci5yZW5kZXIodGFyZ2V0LCB1cHNjYWxlU2l6ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGxvYWRXb3JsZCgpIHtcclxuICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IHRoaXMuaGVpZ2h0OyB4KyspIHtcclxuICAgICAgICAgICAgLy8gaSB3aWxsIGJlIHRoZSB5IHBvc2l0aW9uIG9mIHRpbGVzIGJlaW5nIGRyYXduXHJcbiAgICAgICAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgdGhpcy53aWR0aDsgeSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0aWxlVmFsID0gdGhpcy53b3JsZFRpbGVzW3ggKiB0aGlzLndpZHRoICsgeV07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB0aWxlVmFsID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRpbGVWYWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0aWxlVmFsICE9PSBUaWxlVHlwZS5BaXIgJiYgdGlsZVZhbCAhPT0gVGlsZVR5cGUuVGlsZUVudGl0eSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIERyYXcgdGhlIGNvcnJlY3QgaW1hZ2UgZm9yIHRoZSB0aWxlcyBvbnRvIHRoZSB0aWxlcyBsYXllclxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRpbGU6IFRpbGUgPSBXb3JsZFRpbGVzW3RpbGVWYWxdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbGUuY29ubmVjdGVkICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbGUudGV4dHVyZSBpbnN0YW5jZW9mIFRpbGVSZXNvdXJjZVxyXG4gICAgICAgICAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0ZXN0IGlmIHRoZSBuZWlnaGJvcmluZyB0aWxlcyBhcmUgc29saWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdG9wVGlsZUJvb2wgPVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeCA9PT0gVGlsZVR5cGUuQWlyIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLndvcmxkVGlsZXNbKHggLSAxKSAqIHRoaXMud2lkdGggKyB5XSAhPT1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUaWxlVHlwZS5BaXI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGxlZnRUaWxlQm9vbCA9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB5ID09PSBUaWxlVHlwZS5BaXIgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMud29ybGRUaWxlc1t4ICogdGhpcy53aWR0aCArIHkgLSAxXSAhPT1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUaWxlVHlwZS5BaXI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGJvdHRvbVRpbGVCb29sID1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHggPT09IHRoaXMuaGVpZ2h0IC0gMSB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy53b3JsZFRpbGVzWyh4ICsgMSkgKiB0aGlzLndpZHRoICsgeV0gIT09XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVGlsZVR5cGUuQWlyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByaWdodFRpbGVCb29sID1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHkgPT09IHRoaXMud2lkdGggLSAxIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLndvcmxkVGlsZXNbeCAqIHRoaXMud2lkdGggKyB5ICsgMV0gIT09XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVGlsZVR5cGUuQWlyO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29udmVydCA0IGRpZ2l0IGJpbmFyeSBudW1iZXIgdG8gYmFzZSAxMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0aWxlU2V0SW5kZXggPVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOCAqICt0b3BUaWxlQm9vbCArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA0ICogK3JpZ2h0VGlsZUJvb2wgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgMiAqICtib3R0b21UaWxlQm9vbCArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICArbGVmdFRpbGVCb29sO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gUmVuZGVyIGNvbm5lY3RlZCB0aWxlc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aWxlLnRleHR1cmUucmVuZGVyVGlsZShcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpbGVTZXRJbmRleCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGlsZUxheWVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeSAqIGdhbWUuVElMRV9XSURUSCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHggKiBnYW1lLlRJTEVfSEVJR0hULFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2FtZS5USUxFX1dJRFRILFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2FtZS5USUxFX0hFSUdIVFxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICF0aWxlLmNvbm5lY3RlZCAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aWxlLnRleHR1cmUgaW5zdGFuY2VvZiBJbWFnZVJlc291cmNlXHJcbiAgICAgICAgICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJlbmRlciBub24tY29ubmVjdGVkIHRpbGVzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbGUudGV4dHVyZS5yZW5kZXIoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRpbGVMYXllcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHkgKiBnYW1lLlRJTEVfV0lEVEgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4ICogZ2FtZS5USUxFX0hFSUdIVCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdhbWUuVElMRV9XSURUSCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdhbWUuVElMRV9IRUlHSFRcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZHJhd1RpbGUodGlsZUluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCB4ID0gdGlsZUluZGV4ICUgdGhpcy53aWR0aDtcclxuICAgICAgICBjb25zdCB5ID0gTWF0aC5mbG9vcih0aWxlSW5kZXggLyB0aGlzLndpZHRoKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMud29ybGRUaWxlc1t0aWxlSW5kZXhdICE9PSBUaWxlVHlwZS5BaXIpIHtcclxuICAgICAgICAgICAgLy8gRHJhdyB0aGUgY29ycmVjdCBpbWFnZSBmb3IgdGhlIHRpbGVzIG9udG8gdGhlIHRpbGVzIGxheWVyXHJcblxyXG4gICAgICAgICAgICBjb25zdCB0aWxlVmFsID0gdGhpcy53b3JsZFRpbGVzW3RpbGVJbmRleF1cclxuXHJcbiAgICAgICAgICAgIGlmKHR5cGVvZiB0aWxlVmFsID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJUcmllZCB0byBkcmF3OiBcIiArIHRpbGVWYWwpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHRpbGU6IFRpbGUgPSBXb3JsZFRpbGVzW3RpbGVWYWxdO1xyXG5cclxuICAgICAgICAgICAgLy8gaWYgdGhlIHRpbGVzIGlzIG9mZi1zY3JlZW5cclxuICAgICAgICAgICAgaWYgKHRpbGUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGlsZS5jb25uZWN0ZWQgJiYgdGlsZS50ZXh0dXJlIGluc3RhbmNlb2YgVGlsZVJlc291cmNlKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBUZXN0IHRoZSBuZWlnaGJvcmluZyA0IHRpbGVzXHJcbiAgICAgICAgICAgICAgICBjb25zdCB0b3BUaWxlQm9vbCA9XHJcbiAgICAgICAgICAgICAgICAgICAgeSA8PSAwIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53b3JsZFRpbGVzW3RpbGVJbmRleCAtIHRoaXMud2lkdGhdICE9PSBUaWxlVHlwZS5BaXI7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsZWZ0VGlsZUJvb2wgPVxyXG4gICAgICAgICAgICAgICAgICAgIHggPD0gMCB8fCB0aGlzLndvcmxkVGlsZXNbdGlsZUluZGV4IC0gMV0gIT09IFRpbGVUeXBlLkFpcjtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGJvdHRvbVRpbGVCb29sID1cclxuICAgICAgICAgICAgICAgICAgICB5ID49IHRoaXMuaGVpZ2h0IC0gMSB8fFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMud29ybGRUaWxlc1t0aWxlSW5kZXggKyB0aGlzLndpZHRoXSAhPT0gVGlsZVR5cGUuQWlyO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmlnaHRUaWxlQm9vbCA9XHJcbiAgICAgICAgICAgICAgICAgICAgeCA+PSB0aGlzLndpZHRoIC0gMSB8fFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMud29ybGRUaWxlc1t0aWxlSW5kZXggKyAxXSAhPT0gVGlsZVR5cGUuQWlyO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIGNvbnZlcnQgNCBkaWdpdCBiaW5hcnkgbnVtYmVyIHRvIGJhc2UgMTBcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRpbGVTZXRJbmRleCA9XHJcbiAgICAgICAgICAgICAgICAgICAgOCAqICt0b3BUaWxlQm9vbCArXHJcbiAgICAgICAgICAgICAgICAgICAgNCAqICtyaWdodFRpbGVCb29sICtcclxuICAgICAgICAgICAgICAgICAgICAyICogK2JvdHRvbVRpbGVCb29sICtcclxuICAgICAgICAgICAgICAgICAgICArbGVmdFRpbGVCb29sO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFJlbmRlciBjb25uZWN0ZWQgdGlsZXNcclxuICAgICAgICAgICAgICAgIHRpbGUudGV4dHVyZS5yZW5kZXJUaWxlKFxyXG4gICAgICAgICAgICAgICAgICAgIHRpbGVTZXRJbmRleCxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRpbGVMYXllcixcclxuICAgICAgICAgICAgICAgICAgICB4ICogZ2FtZS5USUxFX1dJRFRILFxyXG4gICAgICAgICAgICAgICAgICAgIHkgKiBnYW1lLlRJTEVfSEVJR0hULFxyXG4gICAgICAgICAgICAgICAgICAgIGdhbWUuVElMRV9XSURUSCxcclxuICAgICAgICAgICAgICAgICAgICBnYW1lLlRJTEVfSEVJR0hUXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKFxyXG4gICAgICAgICAgICAgICAgIXRpbGUuY29ubmVjdGVkICYmXHJcbiAgICAgICAgICAgICAgICB0aWxlLnRleHR1cmUgaW5zdGFuY2VvZiBJbWFnZVJlc291cmNlXHJcbiAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgLy8gUmVuZGVyIG5vbi1jb25uZWN0ZWQgdGlsZXNcclxuICAgICAgICAgICAgICAgIHRpbGUudGV4dHVyZS5yZW5kZXIoXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50aWxlTGF5ZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgeCAqIGdhbWUuVElMRV9XSURUSCxcclxuICAgICAgICAgICAgICAgICAgICB5ICogZ2FtZS5USUxFX0hFSUdIVCxcclxuICAgICAgICAgICAgICAgICAgICBnYW1lLlRJTEVfV0lEVEgsXHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS5USUxFX0hFSUdIVFxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5leHBvcnQgPSBXb3JsZDtcclxuIiwiaW1wb3J0IEltYWdlUmVzb3VyY2UgZnJvbSAnLi4vYXNzZXRzL3Jlc291cmNlcy9JbWFnZVJlc291cmNlJztcclxuaW1wb3J0IHsgV29ybGRBc3NldHMgfSBmcm9tICcuLi9hc3NldHMvQXNzZXRzJztcclxuaW1wb3J0IFRpbGVSZXNvdXJjZSBmcm9tICcuLi9hc3NldHMvcmVzb3VyY2VzL1RpbGVSZXNvdXJjZSc7XHJcbmltcG9ydCB7IFRpbGVUeXBlIH0gZnJvbSAnLi4vLi4vLi4vYXBpL1RpbGUnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBUaWxlIHtcclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIHRleHR1cmU6IEltYWdlUmVzb3VyY2UgfCBUaWxlUmVzb3VyY2U7XHJcbiAgICBjb25uZWN0ZWQ/OiBib29sZWFuO1xyXG4gICAgYW55Q29ubmVjdGlvbj86IGJvb2xlYW47XHJcbiAgICBjb2xvcjogc3RyaW5nO1xyXG4gICAgZnJpY3Rpb246IG51bWJlcjtcclxuICAgIHJlZmxlY3Rpdml0eTogbnVtYmVyO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgV29ybGRUaWxlczogUmVjb3JkPFRpbGVUeXBlIHwgc3RyaW5nLCBUaWxlIHwgdW5kZWZpbmVkPiA9IHtcclxuICAgIFtUaWxlVHlwZS5BaXJdOiB1bmRlZmluZWQsXHJcbiAgICBbVGlsZVR5cGUuVGlsZUVudGl0eV06IHtcclxuICAgICAgICBuYW1lOiAnVGlsZUVudGl0eScsXHJcbiAgICAgICAgdGV4dHVyZTogdW5kZWZpbmVkLFxyXG4gICAgICAgIGNvbG9yOiBcIiNiYmJiYmJcIixcclxuICAgICAgICBmcmljdGlvbjogMSxcclxuICAgICAgICByZWZsZWN0aXZpdHk6IDBcclxuICAgIH0sXHJcbiAgICBbVGlsZVR5cGUuU25vd106IHtcclxuICAgICAgICBuYW1lOiAnc25vdycsXHJcbiAgICAgICAgdGV4dHVyZTogV29ybGRBc3NldHMubWlkZGxlZ3JvdW5kLnRpbGVzZXRfc25vdyxcclxuICAgICAgICBjb25uZWN0ZWQ6IHRydWUsXHJcbiAgICAgICAgYW55Q29ubmVjdGlvbjogdHJ1ZSxcclxuICAgICAgICBjb2xvcjogXCIjY2FmYWZjXCIsXHJcbiAgICAgICAgZnJpY3Rpb246IDIsXHJcbiAgICAgICAgcmVmbGVjdGl2aXR5OiA1MFxyXG4gICAgfSxcclxuICAgIFtUaWxlVHlwZS5JY2VdOiB7XHJcbiAgICAgICAgbmFtZTogJ2ljZScsXHJcbiAgICAgICAgdGV4dHVyZTogV29ybGRBc3NldHMubWlkZGxlZ3JvdW5kLnRpbGVzZXRfaWNlLFxyXG4gICAgICAgIGNvbm5lY3RlZDogdHJ1ZSxcclxuICAgICAgICBhbnlDb25uZWN0aW9uOiB0cnVlLFxyXG4gICAgICAgIGNvbG9yOiBcIiM3NmFkYzRcIixcclxuICAgICAgICBmcmljdGlvbjogMS41LFxyXG4gICAgICAgIHJlZmxlY3Rpdml0eTogMjU1XHJcbiAgICB9LFxyXG4gICAgW1RpbGVUeXBlLkRpcnRdOiB7XHJcbiAgICAgICAgbmFtZTogJ2RpcnQnLFxyXG4gICAgICAgIHRleHR1cmU6IFdvcmxkQXNzZXRzLm1pZGRsZWdyb3VuZC50aWxlc2V0X2RpcnQsXHJcbiAgICAgICAgY29ubmVjdGVkOiB0cnVlLFxyXG4gICAgICAgIGFueUNvbm5lY3Rpb246IHRydWUsXHJcbiAgICAgICAgY29sb3I6IFwiIzRhMmUxZVwiLFxyXG4gICAgICAgIGZyaWN0aW9uOiA0LFxyXG4gICAgICAgIHJlZmxlY3Rpdml0eTogMFxyXG4gICAgfSxcclxuICAgIFtUaWxlVHlwZS5TdG9uZTBdOiB7XHJcbiAgICAgICAgbmFtZTogJ3JhdyBzdG9uZScsXHJcbiAgICAgICAgdGV4dHVyZTogV29ybGRBc3NldHMubWlkZGxlZ3JvdW5kLnRpbGVzZXRfc3RvbmUwLFxyXG4gICAgICAgIGNvbm5lY3RlZDogdHJ1ZSxcclxuICAgICAgICBhbnlDb25uZWN0aW9uOiB0cnVlLFxyXG4gICAgICAgIGNvbG9yOiBcIiM0MTQyNDVcIixcclxuICAgICAgICBmcmljdGlvbjogMyxcclxuICAgICAgICByZWZsZWN0aXZpdHk6IDEwXHJcbiAgICB9LFxyXG4gICAgW1RpbGVUeXBlLlN0b25lMV06IHtcclxuICAgICAgICBuYW1lOiAnc3RvbmUgdGllciAxJyxcclxuICAgICAgICB0ZXh0dXJlOiBXb3JsZEFzc2V0cy5taWRkbGVncm91bmQudGlsZXNldF9zdG9uZTEsXHJcbiAgICAgICAgY29ubmVjdGVkOiB0cnVlLFxyXG4gICAgICAgIGFueUNvbm5lY3Rpb246IHRydWUsXHJcbiAgICAgICAgY29sb3I6IFwiIzMxMzIzYlwiLFxyXG4gICAgICAgIGZyaWN0aW9uOiAzLFxyXG4gICAgICAgIHJlZmxlY3Rpdml0eTogMTVcclxuICAgIH0sXHJcbiAgICBbVGlsZVR5cGUuU3RvbmUyXToge1xyXG4gICAgICAgIG5hbWU6ICdzdG9uZSB0aWVyIDInLFxyXG4gICAgICAgIHRleHR1cmU6IFdvcmxkQXNzZXRzLm1pZGRsZWdyb3VuZC50aWxlc2V0X3N0b25lMixcclxuICAgICAgICBjb25uZWN0ZWQ6IHRydWUsXHJcbiAgICAgICAgYW55Q29ubmVjdGlvbjogdHJ1ZSxcclxuICAgICAgICBjb2xvcjogXCIjMzEzMjNiXCIsXHJcbiAgICAgICAgZnJpY3Rpb246IDMsXHJcbiAgICAgICAgcmVmbGVjdGl2aXR5OiAxN1xyXG4gICAgfSxcclxuICAgIFtUaWxlVHlwZS5TdG9uZTNdOiB7XHJcbiAgICAgICAgbmFtZTogJ3N0b25lIHRpZXIgMycsXHJcbiAgICAgICAgdGV4dHVyZTogV29ybGRBc3NldHMubWlkZGxlZ3JvdW5kLnRpbGVzZXRfc3RvbmUzLFxyXG4gICAgICAgIGNvbm5lY3RlZDogdHJ1ZSxcclxuICAgICAgICBhbnlDb25uZWN0aW9uOiB0cnVlLFxyXG4gICAgICAgIGNvbG9yOiBcIiMzMTMyM2JcIixcclxuICAgICAgICBmcmljdGlvbjogMyxcclxuICAgICAgICByZWZsZWN0aXZpdHk6IDE5XHJcbiAgICB9LFxyXG4gICAgW1RpbGVUeXBlLlN0b25lNF06IHtcclxuICAgICAgICBuYW1lOiAnc3RvbmUgdGllciA0JyxcclxuICAgICAgICB0ZXh0dXJlOiBXb3JsZEFzc2V0cy5taWRkbGVncm91bmQudGlsZXNldF9zdG9uZTQsXHJcbiAgICAgICAgY29ubmVjdGVkOiB0cnVlLFxyXG4gICAgICAgIGFueUNvbm5lY3Rpb246IHRydWUsXHJcbiAgICAgICAgY29sb3I6IFwiIzMxMzIzYlwiLFxyXG4gICAgICAgIGZyaWN0aW9uOiAzLFxyXG4gICAgICAgIHJlZmxlY3Rpdml0eTogMjFcclxuICAgIH0sXHJcbiAgICBbVGlsZVR5cGUuU3RvbmU1XToge1xyXG4gICAgICAgIG5hbWU6ICdzdG9uZSB0aWVyIDUnLFxyXG4gICAgICAgIHRleHR1cmU6IFdvcmxkQXNzZXRzLm1pZGRsZWdyb3VuZC50aWxlc2V0X3N0b25lNSxcclxuICAgICAgICBjb25uZWN0ZWQ6IHRydWUsXHJcbiAgICAgICAgYW55Q29ubmVjdGlvbjogdHJ1ZSxcclxuICAgICAgICBjb2xvcjogXCIjMzEzMjNiXCIsXHJcbiAgICAgICAgZnJpY3Rpb246IDMsXHJcbiAgICAgICAgcmVmbGVjdGl2aXR5OiAyM1xyXG4gICAgfSxcclxuICAgIFtUaWxlVHlwZS5TdG9uZTZdOiB7XHJcbiAgICAgICAgbmFtZTogJ3N0b25lIHRpZXIgNicsXHJcbiAgICAgICAgdGV4dHVyZTogV29ybGRBc3NldHMubWlkZGxlZ3JvdW5kLnRpbGVzZXRfc3RvbmU2LFxyXG4gICAgICAgIGNvbm5lY3RlZDogdHJ1ZSxcclxuICAgICAgICBhbnlDb25uZWN0aW9uOiB0cnVlLFxyXG4gICAgICAgIGNvbG9yOiBcIiMzMTMyM2JcIixcclxuICAgICAgICBmcmljdGlvbjogMyxcclxuICAgICAgICByZWZsZWN0aXZpdHk6IDI1XHJcbiAgICB9LFxyXG4gICAgW1RpbGVUeXBlLlN0b25lN106IHtcclxuICAgICAgICBuYW1lOiAnc3RvbmUgdGllciA3JyxcclxuICAgICAgICB0ZXh0dXJlOiBXb3JsZEFzc2V0cy5taWRkbGVncm91bmQudGlsZXNldF9zdG9uZTcsXHJcbiAgICAgICAgY29ubmVjdGVkOiB0cnVlLFxyXG4gICAgICAgIGFueUNvbm5lY3Rpb246IHRydWUsXHJcbiAgICAgICAgY29sb3I6IFwiIzMxMzIzYlwiLFxyXG4gICAgICAgIGZyaWN0aW9uOiAzLFxyXG4gICAgICAgIHJlZmxlY3Rpdml0eTogMjdcclxuICAgIH0sXHJcbiAgICBbVGlsZVR5cGUuU3RvbmU4XToge1xyXG4gICAgICAgIG5hbWU6ICdzdG9uZSB0aWVyIDgnLFxyXG4gICAgICAgIHRleHR1cmU6IFdvcmxkQXNzZXRzLm1pZGRsZWdyb3VuZC50aWxlc2V0X3N0b25lOCxcclxuICAgICAgICBjb25uZWN0ZWQ6IHRydWUsXHJcbiAgICAgICAgYW55Q29ubmVjdGlvbjogdHJ1ZSxcclxuICAgICAgICBjb2xvcjogXCIjMzEzMjNiXCIsXHJcbiAgICAgICAgZnJpY3Rpb246IDMsXHJcbiAgICAgICAgcmVmbGVjdGl2aXR5OiAyOVxyXG4gICAgfSxcclxuICAgIFtUaWxlVHlwZS5TdG9uZTldOiB7XHJcbiAgICAgICAgbmFtZTogJ3N0b25lIHRpZXIgOScsXHJcbiAgICAgICAgdGV4dHVyZTogV29ybGRBc3NldHMubWlkZGxlZ3JvdW5kLnRpbGVzZXRfc3RvbmU5LFxyXG4gICAgICAgIGNvbm5lY3RlZDogdHJ1ZSxcclxuICAgICAgICBhbnlDb25uZWN0aW9uOiB0cnVlLFxyXG4gICAgICAgIGNvbG9yOiBcIiMzMTMyM2JcIixcclxuICAgICAgICBmcmljdGlvbjogMyxcclxuICAgICAgICByZWZsZWN0aXZpdHk6IDMxXHJcbiAgICB9LFxyXG59OyIsImltcG9ydCB7IEVudGl0aWVzIH0gZnJvbSAnLi4vLi4vLi4vLi4vYXBpL0VudGl0eSc7XHJcbmltcG9ydCB7IFBsYXllckVudGl0eSB9IGZyb20gJy4vUGxheWVyRW50aXR5JztcclxuaW1wb3J0IFBsYXllckxvY2FsIGZyb20gJy4vUGxheWVyTG9jYWwnO1xyXG5cclxuZXhwb3J0IGNvbnN0IEVudGl0eUNsYXNzZXM6IFJlY29yZDxFbnRpdGllcywgYW55PiA9IHtcclxuICAgIFtFbnRpdGllcy5Mb2NhbFBsYXllcl06IFBsYXllckxvY2FsLFxyXG4gICAgW0VudGl0aWVzLlBsYXllcl06IFBsYXllckVudGl0eSxcclxuICAgIFtFbnRpdGllcy5JdGVtXTogbnVsbFxyXG59IiwiaW1wb3J0IHsgU2VydmVyRW50aXR5IH0gZnJvbSAnLi9TZXJ2ZXJFbnRpdHknO1xyXG5pbXBvcnQgcDUgZnJvbSAncDUnO1xyXG5pbXBvcnQgZ2FtZSBmcm9tICcuLi8uLi9NYWluJztcclxuaW1wb3J0IHsgRW50aXRpZXMsIEVudGl0eVBheWxvYWQgfSBmcm9tICcuLi8uLi8uLi8uLi9hcGkvRW50aXR5JztcclxuXHJcbmV4cG9ydCBjbGFzcyBQbGF5ZXJFbnRpdHkgZXh0ZW5kcyBTZXJ2ZXJFbnRpdHkge1xyXG5cclxuICAgIHdpZHRoOiBudW1iZXIgPSAxMiAvIGdhbWUuVElMRV9XSURUSDtcclxuICAgIGhlaWdodDogbnVtYmVyID0gMjAgLyBnYW1lLlRJTEVfSEVJR0hUO1xyXG4gICAgbmFtZTogc3RyaW5nXHJcblxyXG4gICAgY29uc3RydWN0b3IoZGF0YTogRW50aXR5UGF5bG9hZCkge1xyXG4gICAgICAgIHN1cGVyKGRhdGEuaWQpO1xyXG4gICAgICAgIGlmKGRhdGEudHlwZSA9PT0gRW50aXRpZXMuUGxheWVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMubmFtZSA9IGRhdGEuZGF0YS5uYW1lO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVEYXRhKGRhdGE6IEVudGl0eVBheWxvYWQpOiB2b2lkIHtcclxuICAgICAgICBpZihkYXRhLnR5cGUgPT09IEVudGl0aWVzLlBsYXllcikge1xyXG4gICAgICAgICAgICB0aGlzLm5hbWUgPSBkYXRhLmRhdGEubmFtZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKHRhcmdldDogcDUsIHVwc2NhbGVTaXplOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0YXJnZXQuZmlsbCgwLCAyNTUsIDApO1xyXG5cclxuICAgICAgICB0YXJnZXQucmVjdChcclxuICAgICAgICAgICAgKHRoaXMueCAqIGdhbWUuVElMRV9XSURUSCAtXHJcbiAgICAgICAgICAgICAgICBnYW1lLmludGVycG9sYXRlZENhbVggKiBnYW1lLlRJTEVfV0lEVEgpICpcclxuICAgICAgICAgICAgdXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgICh0aGlzLnkgKiBnYW1lLlRJTEVfSEVJR0hUIC1cclxuICAgICAgICAgICAgICAgIGdhbWUuaW50ZXJwb2xhdGVkQ2FtWSAqIGdhbWUuVElMRV9IRUlHSFQpICpcclxuICAgICAgICAgICAgdXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIHRoaXMud2lkdGggKiB1cHNjYWxlU2l6ZSAqIGdhbWUuVElMRV9XSURUSCxcclxuICAgICAgICAgICAgdGhpcy5oZWlnaHQgKiB1cHNjYWxlU2l6ZSAqIGdhbWUuVElMRV9IRUlHSFRcclxuICAgICAgICApO1xyXG4gICAgICAgIC8vIFJlbmRlciB0aGUgaXRlbSBxdWFudGl0eSBsYWJlbFxyXG4gICAgICAgIHRhcmdldC5maWxsKDApO1xyXG5cclxuICAgICAgICB0YXJnZXQubm9TdHJva2UoKTtcclxuXHJcbiAgICAgICAgdGFyZ2V0LnRleHRTaXplKDUgKiB1cHNjYWxlU2l6ZSk7XHJcbiAgICAgICAgdGFyZ2V0LnRleHRBbGlnbih0YXJnZXQuQ0VOVEVSLCB0YXJnZXQuVE9QKTtcclxuXHJcbiAgICAgICAgdGFyZ2V0LnRleHQoXHJcbiAgICAgICAgICAgIHRoaXMubmFtZSxcclxuICAgICAgICAgICAgKCgodGhpcy54ICogZ2FtZS5USUxFX1dJRFRIKSAtXHJcbiAgICAgICAgICAgICAgICBnYW1lLmludGVycG9sYXRlZENhbVggKiBnYW1lLlRJTEVfV0lEVEgpICsgKHRoaXMud2lkdGggKiBnYW1lLlRJTEVfV0lEVEgpIC8gMikgKlxyXG4gICAgICAgICAgICB1cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgKCgodGhpcy55ICogZ2FtZS5USUxFX0hFSUdIVCkgLVxyXG4gICAgICAgICAgICAgICAgZ2FtZS5pbnRlcnBvbGF0ZWRDYW1ZICogZ2FtZS5USUxFX0hFSUdIVCkgLSAodGhpcy5oZWlnaHQgKiBnYW1lLlRJTEVfV0lEVEgpIC8gMi41KSAqXHJcbiAgICAgICAgICAgIHVwc2NhbGVTaXplXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufSIsImltcG9ydCBnYW1lIGZyb20gJy4uLy4uL01haW4nO1xyXG5pbXBvcnQgeyBTZXJ2ZXJFbnRpdHkgfSBmcm9tICcuL1NlcnZlckVudGl0eSc7XHJcbmltcG9ydCB7IEVudGl0aWVzLCBFbnRpdHlQYXlsb2FkIH0gZnJvbSAnLi4vLi4vLi4vLi4vYXBpL0VudGl0eSc7XHJcbmltcG9ydCB7IENvbG9yUGFydGljbGUgfSBmcm9tICcuLi9wYXJ0aWNsZXMvQ29sb3JQYXJ0aWNsZSdcclxuaW1wb3J0IHsgUGxheWVyQW5pbWF0aW9ucywgVWlBc3NldHMsIEFuaW1hdGlvbkZyYW1lIH0gZnJvbSAnLi4vLi4vYXNzZXRzL0Fzc2V0cyc7XHJcbmltcG9ydCB7IFRpbGVUeXBlIH0gZnJvbSAnLi4vLi4vLi4vLi4vYXBpL1RpbGUnO1xyXG5pbXBvcnQgeyBXb3JsZFRpbGVzIH0gZnJvbSAnLi4vV29ybGRUaWxlcyc7XHJcbmltcG9ydCBHYW1lIGZyb20gJy4uLy4uL0dhbWUnO1xyXG5cclxuY2xhc3MgUGxheWVyTG9jYWwgZXh0ZW5kcyBTZXJ2ZXJFbnRpdHkge1xyXG5cclxuICAgIHdpZHRoOiBudW1iZXIgPSAxMiAvIGdhbWUuVElMRV9XSURUSDtcclxuICAgIGhlaWdodDogbnVtYmVyID0gMjAgLyBnYW1lLlRJTEVfSEVJR0hUO1xyXG4gICAgbmFtZTogc3RyaW5nXHJcblxyXG4gICAgeFZlbDogbnVtYmVyID0gMFxyXG4gICAgeVZlbDogbnVtYmVyID0gMFxyXG4gICAgaW50ZXJwb2xhdGVkWDogbnVtYmVyO1xyXG4gICAgaW50ZXJwb2xhdGVkWTogbnVtYmVyO1xyXG4gICAgc2xpZGVYOiBudW1iZXI7XHJcbiAgICBzbGlkZVk6IG51bWJlcjtcclxuXHJcbiAgICBwWDogbnVtYmVyO1xyXG4gICAgcFk6IG51bWJlcjtcclxuICAgIHBYVmVsOiBudW1iZXIgPSAwXHJcbiAgICBwWVZlbDogbnVtYmVyID0gMFxyXG5cclxuICAgIGdyb3VuZGVkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwR3JvdW5kZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICBjb2xsaXNpb25EYXRhOiBhbnk7XHJcbiAgICBjbG9zZXN0Q29sbGlzaW9uOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl1cclxuXHJcbiAgICBtYXNzOiBudW1iZXIgPSB0aGlzLndpZHRoICogdGhpcy5oZWlnaHRcclxuXHJcbiAgICAvL2lucHV0IGJvb2xlYW5zXHJcbiAgICByaWdodEJ1dHRvbjogYm9vbGVhbjtcclxuICAgIGxlZnRCdXR0b246IGJvb2xlYW47XHJcbiAgICBqdW1wQnV0dG9uOiBib29sZWFuO1xyXG5cclxuICAgIGN1cnJlbnRBbmltYXRpb246IEFuaW1hdGlvbkZyYW1lPHR5cGVvZiBQbGF5ZXJBbmltYXRpb25zPiA9IFwiaWRsZVwiO1xyXG4gICAgYW5pbUZyYW1lOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIHRvcENvbGxpc2lvbjogKHR5cGVvZiBXb3JsZFRpbGVzW1RpbGVUeXBlLkFpcl0pID0gV29ybGRUaWxlc1tUaWxlVHlwZS5BaXJdOy8vaGFja3lcclxuICAgIGJvdHRvbUNvbGxpc2lvbjogKHR5cGVvZiBXb3JsZFRpbGVzW1RpbGVUeXBlLkFpcl0pID0gV29ybGRUaWxlc1tUaWxlVHlwZS5BaXJdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIGRhdGE6IEVudGl0eVBheWxvYWQ8RW50aXRpZXMuTG9jYWxQbGF5ZXI+XHJcbiAgICApIHtcclxuICAgICAgICBzdXBlcihkYXRhLmlkKVxyXG5cclxuICAgICAgICB0aGlzLm5hbWUgPSBkYXRhLmRhdGEubmFtZVxyXG5cclxuICAgICAgICB0aGlzLnggPSBkYXRhLmRhdGEueFxyXG4gICAgICAgIHRoaXMueSA9IGRhdGEuZGF0YS55XHJcblxyXG4gICAgICAgIHRoaXMuY2xvc2VzdENvbGxpc2lvbiA9IFsxLCAwLCBJbmZpbml0eV07XHJcblxyXG4gICAgICAgIHRoaXMuaW50ZXJwb2xhdGVkWCA9IHRoaXMueDtcclxuICAgICAgICB0aGlzLmludGVycG9sYXRlZFkgPSB0aGlzLnk7XHJcblxyXG4gICAgICAgIHRoaXMucFggPSB0aGlzLnhcclxuICAgICAgICB0aGlzLnBZID0gdGhpcy55O1xyXG4gICAgICAgIHRoaXMubGVmdEJ1dHRvbiA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucmlnaHRCdXR0b24gPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmp1bXBCdXR0b24gPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIodGFyZ2V0OiBHYW1lLCB1cHNjYWxlU2l6ZTogbnVtYmVyKTogdm9pZCB7XHJcblxyXG4gICAgICAgIFBsYXllckFuaW1hdGlvbnNbdGhpcy5jdXJyZW50QW5pbWF0aW9uXVt0aGlzLmFuaW1GcmFtZV0ucmVuZGVyXHJcbiAgICAgICAgICAgIChcclxuICAgICAgICAgICAgICAgIHRhcmdldCxcclxuICAgICAgICAgICAgICAgICh0aGlzLmludGVycG9sYXRlZFggKiBnYW1lLlRJTEVfV0lEVEggLVxyXG4gICAgICAgICAgICAgICAgICAgIGdhbWUuaW50ZXJwb2xhdGVkQ2FtWCAqIGdhbWUuVElMRV9XSURUSCkgKlxyXG4gICAgICAgICAgICAgICAgdXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgICAgICAodGhpcy5pbnRlcnBvbGF0ZWRZICogZ2FtZS5USUxFX0hFSUdIVCAtXHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS5pbnRlcnBvbGF0ZWRDYW1ZICogZ2FtZS5USUxFX0hFSUdIVCkgKlxyXG4gICAgICAgICAgICAgICAgdXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgICAgICB0aGlzLndpZHRoICogdXBzY2FsZVNpemUgKiBnYW1lLlRJTEVfV0lEVEgsXHJcbiAgICAgICAgICAgICAgICB0aGlzLmhlaWdodCAqIHVwc2NhbGVTaXplICogZ2FtZS5USUxFX0hFSUdIVFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBQbGF5ZXJBbmltYXRpb25zW3RoaXMuY3VycmVudEFuaW1hdGlvbl1bdGhpcy5hbmltRnJhbWVdLnJlbmRlcldvcmxkc3BhY2VSZWZsZWN0aW9uXHJcbiAgICAgICAgICAgIChcclxuICAgICAgICAgICAgICAgIHRhcmdldCxcclxuICAgICAgICAgICAgICAgIHRoaXMuaW50ZXJwb2xhdGVkWCxcclxuICAgICAgICAgICAgICAgIHRoaXMuaW50ZXJwb2xhdGVkWSt0aGlzLmhlaWdodCxcclxuICAgICAgICAgICAgICAgIHRoaXMud2lkdGgsXHJcbiAgICAgICAgICAgICAgICB0aGlzLmhlaWdodFxyXG4gICAgICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZURhdGEoZGF0YTogRW50aXR5UGF5bG9hZCk6IHZvaWQge1xyXG4gICAgICAgIGlmIChkYXRhLnR5cGUgPT09IEVudGl0aWVzLlBsYXllcilcclxuICAgICAgICAgICAgdGhpcy5uYW1lID0gZGF0YS5kYXRhLm5hbWU7XHJcbiAgICB9XHJcblxyXG4gICAga2V5Ym9hcmRJbnB1dCgpIHtcclxuXHJcbiAgICAgICAgdGhpcy54VmVsICs9XHJcbiAgICAgICAgICAgIDAuMDIgKiAoK3RoaXMucmlnaHRCdXR0b24gLSArdGhpcy5sZWZ0QnV0dG9uKTtcclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgIHRoaXMuZ3JvdW5kZWQgJiYgdGhpcy5qdW1wQnV0dG9uXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIGdhbWUuc2NyZWVuc2hha2VBbW91bnQgPSAwLjU7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTAgKiBnYW1lLnBhcnRpY2xlTXVsdGlwbGllcjsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBnYW1lLnBhcnRpY2xlcy5wdXNoKG5ldyBDb2xvclBhcnRpY2xlKHRoaXMuYm90dG9tQ29sbGlzaW9uLmNvbG9yLCAxIC8gOCArIE1hdGgucmFuZG9tKCkgLyA4LCAyMCwgdGhpcy54ICsgdGhpcy53aWR0aCAqIE1hdGgucmFuZG9tKCksIHRoaXMueSArIHRoaXMuaGVpZ2h0LCAwLjIgKiAoTWF0aC5yYW5kb20oKSAtIDAuNSksIDAuMiAqIC1NYXRoLnJhbmRvbSgpKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy55VmVsID0gLTEuNTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYXBwbHlHcmF2aXR5QW5kRHJhZygpIHtcclxuICAgICAgICAvLyB0aGlzIGZ1bmN0aW9uIGNoYW5nZXMgdGhlIG9iamVjdCdzIG5leHQgdGljaydzIHZlbG9jaXR5IGluIGJvdGggdGhlIHggYW5kIHRoZSB5IGRpcmVjdGlvbnNcclxuXHJcbiAgICAgICAgdGhpcy5wWFZlbCA9IHRoaXMueFZlbDtcclxuICAgICAgICB0aGlzLnBZVmVsID0gdGhpcy55VmVsO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5ib3R0b21Db2xsaXNpb24gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLnhWZWwgLT1cclxuICAgICAgICAgICAgICAgIChNYXRoLmFicyh0aGlzLnhWZWwpICogdGhpcy54VmVsICogZ2FtZS5EUkFHX0NPRUZGSUNJRU5UICogdGhpcy53aWR0aCkgLyAvL2FwcGx5IGFpciByZXNpc3RhbmNlXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1hc3M7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy54VmVsIC09XHJcbiAgICAgICAgICAgICAgICAoTWF0aC5hYnModGhpcy54VmVsKSAqIHRoaXMueFZlbCAqIGdhbWUuRFJBR19DT0VGRklDSUVOVCAqICh0aGlzLmJvdHRvbUNvbGxpc2lvbi5mcmljdGlvbikgKiB0aGlzLndpZHRoKSAvIC8vYXBwbHkgYWlyIHJlc2lzdGFuY2UgYW5kIGdyb3VuZCBmcmljdGlvblxyXG4gICAgICAgICAgICAgICAgdGhpcy5tYXNzO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnlWZWwgKz0gZ2FtZS5HUkFWSVRZX1NQRUVEO1xyXG4gICAgICAgIHRoaXMueVZlbCAtPVxyXG4gICAgICAgICAgICAoTWF0aC5hYnModGhpcy55VmVsKSAqIHRoaXMueVZlbCAqIGdhbWUuRFJBR19DT0VGRklDSUVOVCAqIHRoaXMuaGVpZ2h0KSAvXHJcbiAgICAgICAgICAgIHRoaXMubWFzcztcclxuICAgICAgICAvL2lmIG9uIHRoZSBncm91bmQsIG1ha2Ugd2Fsa2luZyBwYXJ0aWNsZXNcclxuICAgICAgICBpZiAodGhpcy5ncm91bmRlZCkge1xyXG4gICAgICAgICAgICAvL2Zvb3RzdGVwc1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJhbmRvbWx5VG9JbnQoTWF0aC5hYnModGhpcy54VmVsKSAqIGdhbWUucGFydGljbGVNdWx0aXBsaWVyIC8gMik7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgZ2FtZS5wYXJ0aWNsZXMucHVzaChuZXcgQ29sb3JQYXJ0aWNsZShcIiNiYmJiYmI0NVwiLCAxIC8gNCArIE1hdGgucmFuZG9tKCkgLyA4LCA1MCwgdGhpcy54ICsgdGhpcy53aWR0aCAvIDIgKyBpIC8gZ2FtZS5wYXJ0aWNsZU11bHRpcGxpZXIsIHRoaXMueSArIHRoaXMuaGVpZ2h0LCAwLCAwLCBmYWxzZSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vZHVzdFxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJhbmRvbWx5VG9JbnQoTWF0aC5hYnModGhpcy54VmVsKSAqIGdhbWUucGFydGljbGVNdWx0aXBsaWVyIC8gMik7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgZ2FtZS5wYXJ0aWNsZXMucHVzaChuZXcgQ29sb3JQYXJ0aWNsZSh0aGlzLmJvdHRvbUNvbGxpc2lvbi5jb2xvciwgMSAvIDggKyBNYXRoLnJhbmRvbSgpIC8gOCwgMTAsIHRoaXMueCArIHRoaXMud2lkdGggLyAyLCB0aGlzLnkgKyB0aGlzLmhlaWdodCwgMC4yICogLXRoaXMueFZlbCArIDAuMiAqIChNYXRoLnJhbmRvbSgpIC0gMC41KSwgMC4yICogLU1hdGgucmFuZG9tKCksIHRydWUpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmaW5kSW50ZXJwb2xhdGVkQ29vcmRpbmF0ZXMoKSB7XHJcbiAgICAgICAgLy8gdGhpcyBmdW5jdGlvbiBlc3NlbnRpYWxseSBtYWtlcyB0aGUgY2hhcmFjdGVyIGxhZyBiZWhpbmQgb25lIHRpY2ssIGJ1dCBtZWFucyB0aGF0IGl0IGdldHMgZGlzcGxheWVkIGF0IHRoZSBtYXhpbXVtIGZyYW1lIHJhdGUuXHJcbiAgICAgICAgaWYgKHRoaXMucFhWZWwgPiAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW50ZXJwb2xhdGVkWCA9IGdhbWUubWluKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5wWCArIHRoaXMucFhWZWwgKiBnYW1lLmFtb3VudFNpbmNlTGFzdFRpY2ssXHJcbiAgICAgICAgICAgICAgICB0aGlzLnhcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmludGVycG9sYXRlZFggPSBnYW1lLm1heChcclxuICAgICAgICAgICAgICAgIHRoaXMucFggKyB0aGlzLnBYVmVsICogZ2FtZS5hbW91bnRTaW5jZUxhc3RUaWNrLFxyXG4gICAgICAgICAgICAgICAgdGhpcy54XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLnBZVmVsID4gMCkge1xyXG4gICAgICAgICAgICB0aGlzLmludGVycG9sYXRlZFkgPSBnYW1lLm1pbihcclxuICAgICAgICAgICAgICAgIHRoaXMucFkgKyB0aGlzLnBZVmVsICogZ2FtZS5hbW91bnRTaW5jZUxhc3RUaWNrLFxyXG4gICAgICAgICAgICAgICAgdGhpcy55XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5pbnRlcnBvbGF0ZWRZID0gZ2FtZS5tYXgoXHJcbiAgICAgICAgICAgICAgICB0aGlzLnBZICsgdGhpcy5wWVZlbCAqIGdhbWUuYW1vdW50U2luY2VMYXN0VGljayxcclxuICAgICAgICAgICAgICAgIHRoaXMueVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBhcHBseVZlbG9jaXR5QW5kQ29sbGlkZSgpIHtcclxuICAgICAgICB0aGlzLnRvcENvbGxpc2lvbiA9IFdvcmxkVGlsZXNbVGlsZVR5cGUuQWlyXTtcclxuICAgICAgICB0aGlzLmJvdHRvbUNvbGxpc2lvbiA9IFdvcmxkVGlsZXNbVGlsZVR5cGUuQWlyXTtcclxuICAgICAgICB0aGlzLnBYID0gdGhpcy54O1xyXG4gICAgICAgIHRoaXMucFkgPSB0aGlzLnk7XHJcblxyXG4gICAgICAgIHRoaXMucEdyb3VuZGVkID0gdGhpcy5ncm91bmRlZDtcclxuICAgICAgICB0aGlzLmdyb3VuZGVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgVGhpcyBmdW5jdGlvbiBhc3N1bWVzIHRoYXQgdGhlIG9iamVjdCBkb2Vzbid0IHN0YXJ0IGluIGNvbGxpc2lvblxyXG5cclxuICAgICAgICBBbHNvLCBpdCB0YWtlcyBhZHZhbnRhZ2Ugb2YgdGhlIGZhY3QgdGhhdCBhbiBvYmplY3QgY2FuIG9ubHkgY29sbGlkZSBvbmNlIGluIGVhY2ggYXhpcyB3aXRoIHRoZXNlIGF4aXMtYWxpZ25lZCByZWN0YW5nbGVzLlxyXG4gICAgICAgIFRoYXQncyBhIHRvdGFsIG9mIGEgcG9zc2libGUgdHdvIGNvbGxpc2lvbnMsIG9yIGFuIGluaXRpYWwgY29sbGlzaW9uLCBhbmQgYSBzbGlkaW5nIGNvbGxpc2lvbi5cclxuICAgICAgICAqL1xyXG5cclxuICAgICAgICAvLyBjYWxjdWxhdGUgdGhlIGluaXRpYWwgY29sbGlzaW9uOlxyXG5cclxuICAgICAgICAvLyBzZXQgdGhlIGNsb3Nlc3QgY29sbGlzaW9uIHRvIG9uZSBpbmZpbml0ZWx5IGZhciBhd2F5LlxyXG4gICAgICAgIHRoaXMuY2xvc2VzdENvbGxpc2lvbiA9IFsxLCAwLCBJbmZpbml0eV07XHJcblxyXG4gICAgICAgIGxldCBtb3N0bHlHb2luZ0hvcml6b250YWxseTogYm9vbGVhbjtcclxuXHJcbiAgICAgICAgLy8gbG9vcCB0aHJvdWdoIGFsbCB0aGUgcG9zc2libGUgdGlsZXMgdGhlIHBoeXNpY3MgYm94IGNvdWxkIGJlIGludGVyc2VjdGluZyB3aXRoXHJcbiAgICAgICAgZm9yIChcclxuICAgICAgICAgICAgbGV0IGkgPSBNYXRoLmZsb29yKGdhbWUubWluKHRoaXMueCwgdGhpcy54ICsgdGhpcy54VmVsKSk7XHJcbiAgICAgICAgICAgIGkgPCBNYXRoLmNlaWwoZ2FtZS5tYXgodGhpcy54LCB0aGlzLnggKyB0aGlzLnhWZWwpICsgdGhpcy53aWR0aCk7XHJcbiAgICAgICAgICAgIGkrK1xyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICBmb3IgKFxyXG4gICAgICAgICAgICAgICAgbGV0IGogPSBNYXRoLmZsb29yKGdhbWUubWluKHRoaXMueSwgdGhpcy55ICsgdGhpcy55VmVsKSk7XHJcbiAgICAgICAgICAgICAgICBqIDwgTWF0aC5jZWlsKGdhbWUubWF4KHRoaXMueSwgdGhpcy55ICsgdGhpcy55VmVsKSArIHRoaXMuaGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgIGorK1xyXG4gICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBjdXJyZW50IHRpbGUgaXNuJ3QgYWlyICh2YWx1ZSAwKSwgdGhlbiBjb250aW51ZSB3aXRoIHRoZSBjb2xsaXNpb24gZGV0ZWN0aW9uXHJcbiAgICAgICAgICAgICAgICBsZXQgY3VycmVudEJsb2NrOiBUaWxlVHlwZSA9IGdhbWUud29ybGQud29ybGRUaWxlc1tqICogZ2FtZS53b3JsZFdpZHRoICsgaV07XHJcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudEJsb2NrICE9IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBnZXQgdGhlIGRhdGEgYWJvdXQgdGhlIGNvbGxpc2lvbiBhbmQgc3RvcmUgaXQgaW4gYSB2YXJpYWJsZVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29sbGlzaW9uRGF0YSA9IGdhbWUucmVjdFZzUmF5KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpIC0gdGhpcy53aWR0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaiAtIHRoaXMuaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLndpZHRoICsgMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oZWlnaHQgKyAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLngsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMueSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy54VmVsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnlWZWxcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgIG1vc3RseUdvaW5nSG9yaXpvbnRhbGx5ID0gTWF0aC5hYnModGhpcy54VmVsKSA+IE1hdGguYWJzKHRoaXMueVZlbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbGxpc2lvbkRhdGEgIT09IGZhbHNlKSB7Ly9hIGNvbGxpc2lvbiBoYXBwZW5lZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMl0gPiB0aGlzLmNvbGxpc2lvbkRhdGFbMl1cclxuICAgICAgICAgICAgICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3Nlc3RDb2xsaXNpb24gPSB0aGlzLmNvbGxpc2lvbkRhdGE7Ly9ob25lc3RseSB0aGlzIGVudGlyZSBjb2xsaXNpb24gc3lzdGVtIGlzIGEgbWVzcyBidXQgaXQgd29yayBzbyBzbyB3aGF0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jbG9zZXN0Q29sbGlzaW9uWzBdID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMV0gPT09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b3BDb2xsaXNpb24gPSBXb3JsZFRpbGVzW2N1cnJlbnRCbG9ja107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJvdHRvbUNvbGxpc2lvbiA9IFdvcmxkVGlsZXNbY3VycmVudEJsb2NrXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5jbG9zZXN0Q29sbGlzaW9uWzJdID09PSB0aGlzLmNvbGxpc2lvbkRhdGFbMl0gJiYgbW9zdGx5R29pbmdIb3Jpem9udGFsbHkgPT09ICh0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMF0gPT09IDApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3Nlc3RDb2xsaXNpb24gPSB0aGlzLmNvbGxpc2lvbkRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jbG9zZXN0Q29sbGlzaW9uWzBdID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMV0gPT09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b3BDb2xsaXNpb24gPSBXb3JsZFRpbGVzW2N1cnJlbnRCbG9ja107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJvdHRvbUNvbGxpc2lvbiA9IFdvcmxkVGlsZXNbY3VycmVudEJsb2NrXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5jbG9zZXN0Q29sbGlzaW9uWzJdICE9PSBJbmZpbml0eSkge1xyXG4gICAgICAgICAgICAvLyB0aGVyZSBoYXMgYmVlbiBhdCBsZWFzdCBvbmUgY29sbGlzaW9uXHJcblxyXG4gICAgICAgICAgICAvLyBnbyB0byB0aGUgcG9pbnQgb2YgY29sbGlzaW9uICh0aGlzIG1ha2VzIGl0IGJlaGF2ZSBhcyBpZiB0aGUgd2FsbHMgYXJlIHN0aWNreSwgYnV0IHdlIHdpbGwgbGF0ZXIgc2xpZGUgYWdhaW5zdCB0aGUgd2FsbHMpXHJcbiAgICAgICAgICAgIHRoaXMueCArPSB0aGlzLnhWZWwgKiB0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMl07XHJcbiAgICAgICAgICAgIHRoaXMueSArPSB0aGlzLnlWZWwgKiB0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMl07XHJcbiAgICAgICAgICAgIC8vIHRoZSBjb2xsaXNpb24gaGFwcGVuZWQgZWl0aGVyIG9uIHRoZSB0b3Agb3IgYm90dG9tXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMF0gPT09IDApIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMV0gPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ncm91bmRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgaXQgY29sbGlkZWQgb24gdGhlIGhpZ2hlciBzaWRlLCBpdCBtdXN0IGJlIHRvdWNoaW5nIHRoZSBncm91bmQuIChoaWdoZXIgeSBpcyBkb3duKVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5wR3JvdW5kZWQpIHsvL2lmIGl0IGlzbid0IGdyb3VuZGVkIHlldCwgaXQgbXVzdCBiZSBjb2xsaWRpbmcgd2l0aCB0aGUgZ3JvdW5kIGZvciB0aGUgZmlyc3QgdGltZSwgc28gc3VtbW9uIHBhcnRpY2xlc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBnYW1lLnNjcmVlbnNoYWtlQW1vdW50ID0gTWF0aC5hYnModGhpcy55VmVsICogMC43NSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNSAqIGdhbWUucGFydGljbGVNdWx0aXBsaWVyOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdhbWUucGFydGljbGVzLnB1c2gobmV3IENvbG9yUGFydGljbGUodGhpcy5ib3R0b21Db2xsaXNpb24uY29sb3IsIDEgLyA4ICsgTWF0aC5yYW5kb20oKSAvIDgsIDIwLCB0aGlzLnggKyB0aGlzLndpZHRoICogTWF0aC5yYW5kb20oKSwgdGhpcy55ICsgdGhpcy5oZWlnaHQsIDAuMiAqIChNYXRoLnJhbmRvbSgpIC0gMC41KSwgMC4yICogLU1hdGgucmFuZG9tKCkpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGdhbWUuc2NyZWVuc2hha2VBbW91bnQgPSBNYXRoLmFicyh0aGlzLnlWZWwgKiAwLjc1KTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDUgKiBnYW1lLnBhcnRpY2xlTXVsdGlwbGllcjsgaSsrKSB7Ly9jZWlsaW5nIGNvbGxpc2lvbiBwYXJ0aWNsZXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2FtZS5wYXJ0aWNsZXMucHVzaChuZXcgQ29sb3JQYXJ0aWNsZSh0aGlzLnRvcENvbGxpc2lvbi5jb2xvciwgMSAvIDggKyBNYXRoLnJhbmRvbSgpIC8gOCwgMjAsIHRoaXMueCArIHRoaXMud2lkdGggKiBNYXRoLnJhbmRvbSgpLCB0aGlzLnksIDAuMiAqIChNYXRoLnJhbmRvbSgpIC0gMC41KSwgMC4yICogLU1hdGgucmFuZG9tKCkpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLnlWZWwgPSAwOyAvLyBzZXQgdGhlIHkgdmVsb2NpdHkgdG8gMCBiZWNhdXNlIHRoZSBvYmplY3QgaGFzIHJ1biBpbnRvIGEgd2FsbCBvbiBpdHMgdG9wIG9yIGJvdHRvbVxyXG4gICAgICAgICAgICAgICAgdGhpcy5zbGlkZVggPSB0aGlzLnhWZWwgKiAoMSAtIHRoaXMuY2xvc2VzdENvbGxpc2lvblsyXSk7IC8vIHRoaXMgaXMgdGhlIHJlbWFpbmluZyBkaXN0YW5jZSB0byBzbGlkZSBhZnRlciB0aGUgY29sbGlzaW9uXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNsaWRlWSA9IDA7IC8vIGl0IGRvZXNuJ3Qgc2xpZGUgaW4gdGhlIHkgZGlyZWN0aW9uIGJlY2F1c2UgdGhlcmUncyBhIHdhbGwgXFwoLi0uKS9cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMueFZlbCA9IDA7IC8vIHNldCB0aGUgeCB2ZWxvY2l0eSB0byAwIGJlY2F1c2Ugd2FsbCBnbyBvb2ZcclxuICAgICAgICAgICAgICAgIHRoaXMuc2xpZGVYID0gMDsgLy8gaXQgZG9lc24ndCBzbGlkZSBpbiB0aGUgeCBkaXJlY3Rpb24gYmVjYXVzZSB0aGVyZSdzIGEgd2FsbCAvKC5fLilcXFxyXG4gICAgICAgICAgICAgICAgdGhpcy5zbGlkZVkgPSB0aGlzLnlWZWwgKiAoMSAtIHRoaXMuY2xvc2VzdENvbGxpc2lvblsyXSk7IC8vIHRoaXMgaXMgdGhlIHJlbWFpbmluZyBkaXN0YW5jZSB0byBzbGlkZSBhZnRlciB0aGUgY29sbGlzaW9uXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIGF0IHRoaXMgcG9pbnQsIHRoZSBvYmplY3QgaXMgdG91Y2hpbmcgaXRzIGZpcnN0IGNvbGxpc2lvbiwgcmVhZHkgdG8gc2xpZGUuICBUaGUgYW1vdW50IGl0IHdhbnRzIHRvIHNsaWRlIGlzIGhlbGQgaW4gdGhlIHRoaXMuc2xpZGVYIGFuZCB0aGlzLnNsaWRlWSB2YXJpYWJsZXMuXHJcblxyXG4gICAgICAgICAgICAvLyB0aGlzIGNhbiBiZSB0cmVhdGVkIGVzc2VudGlhbGx5IHRoZSBzYW1lIGFzIHRoZSBmaXJzdCBjb2xsaXNpb24sIHNvIGEgbG90IG9mIHRoZSBjb2RlIHdpbGwgYmUgcmV1c2VkLlxyXG5cclxuICAgICAgICAgICAgLy8gc2V0IHRoZSBjbG9zZXN0IGNvbGxpc2lvbiB0byBvbmUgaW5maW5pdGVseSBmYXIgYXdheS5cclxuICAgICAgICAgICAgdGhpcy5jbG9zZXN0Q29sbGlzaW9uID0gWzEsIDAsIEluZmluaXR5XTtcclxuXHJcbiAgICAgICAgICAgIC8vIGxvb3AgdGhyb3VnaCBhbGwgdGhlIHBvc3NpYmxlIHRpbGVzIHRoZSBwaHlzaWNzIGJveCBjb3VsZCBiZSBpbnRlcnNlY3Rpbmcgd2l0aFxyXG4gICAgICAgICAgICBmb3IgKFxyXG4gICAgICAgICAgICAgICAgbGV0IGkgPSBNYXRoLmZsb29yKGdhbWUubWluKHRoaXMueCwgdGhpcy54ICsgdGhpcy5zbGlkZVgpKTtcclxuICAgICAgICAgICAgICAgIGkgPCBNYXRoLmNlaWwoZ2FtZS5tYXgodGhpcy54LCB0aGlzLnggKyB0aGlzLnNsaWRlWCkgKyB0aGlzLndpZHRoKTtcclxuICAgICAgICAgICAgICAgIGkrK1xyXG4gICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgIGZvciAoXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGogPSBNYXRoLmZsb29yKGdhbWUubWluKHRoaXMueSwgdGhpcy55ICsgdGhpcy5zbGlkZVkpKTtcclxuICAgICAgICAgICAgICAgICAgICBqIDxcclxuICAgICAgICAgICAgICAgICAgICBNYXRoLmNlaWwoZ2FtZS5tYXgodGhpcy55LCB0aGlzLnkgKyB0aGlzLnNsaWRlWSkgKyB0aGlzLmhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaisrXHJcbiAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgY3VycmVudEJsb2NrOiBUaWxlVHlwZSA9IGdhbWUud29ybGQud29ybGRUaWxlc1tqICogZ2FtZS53b3JsZFdpZHRoICsgaV07XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhlIGN1cnJlbnQgdGlsZSBpc24ndCBhaXIsIHRoZW4gY29udGludWUgd2l0aCB0aGUgY29sbGlzaW9uIGRldGVjdGlvblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50QmxvY2sgIT09IFRpbGVUeXBlLkFpcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBnZXQgdGhlIGRhdGEgYWJvdXQgdGhlIGNvbGxpc2lvbiBhbmQgc3RvcmUgaXQgaW4gYSB2YXJpYWJsZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbGxpc2lvbkRhdGEgPSBnYW1lLnJlY3RWc1JheShcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGkgLSB0aGlzLndpZHRoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaiAtIHRoaXMuaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy53aWR0aCArIDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhlaWdodCArIDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLngsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNsaWRlWCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2xpZGVZXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29sbGlzaW9uRGF0YSAhPT0gZmFsc2UgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2VzdENvbGxpc2lvblsyXSA+IHRoaXMuY29sbGlzaW9uRGF0YVsyXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2VzdENvbGxpc2lvbiA9IHRoaXMuY29sbGlzaW9uRGF0YTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMF0gPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2xvc2VzdENvbGxpc2lvblsxXSA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRvcENvbGxpc2lvbiA9IFdvcmxkVGlsZXNbY3VycmVudEJsb2NrXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYm90dG9tQ29sbGlzaW9uID0gV29ybGRUaWxlc1tjdXJyZW50QmxvY2tdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gaXQgaGFzIGNvbGxpZGVkIHdoaWxlIHRyeWluZyB0byBzbGlkZVxyXG4gICAgICAgICAgICBpZiAodGhpcy5jbG9zZXN0Q29sbGlzaW9uWzJdICE9PSBJbmZpbml0eSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy54ICs9IHRoaXMuc2xpZGVYICogdGhpcy5jbG9zZXN0Q29sbGlzaW9uWzJdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy55ICs9IHRoaXMuc2xpZGVZICogdGhpcy5jbG9zZXN0Q29sbGlzaW9uWzJdO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMF0gPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnlWZWwgPSAwOyAvLyBzZXQgdGhlIHkgdmVsb2NpdHkgdG8gMCBiZWNhdXNlIHRoZSBvYmplY3QgaGFzIHJ1biBpbnRvIGEgd2FsbCBvbiBpdHMgdG9wIG9yIGJvdHRvbVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMV0gPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIGl0IGNvbGxpZGVkIG9uIHRoZSBoaWdoZXIgc2lkZSwgaXQgbXVzdCBiZSB0b3VjaGluZyB0aGUgZ3JvdW5kLiAoaGlnaGVyIHkgaXMgZG93bilcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ncm91bmRlZCA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy54VmVsID0gMDsgLy8gc2V0IHRoZSB4IHZlbG9jaXR5IHRvIDAgYmVjYXVzZSB3YWxsIGdvIG9vZlxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gaXQgaGFzIG5vdCBjb2xsaWRlZCB3aGlsZSB0cnlpbmcgdG8gc2xpZGVcclxuICAgICAgICAgICAgICAgIHRoaXMueCArPSB0aGlzLnNsaWRlWDtcclxuICAgICAgICAgICAgICAgIHRoaXMueSArPSB0aGlzLnNsaWRlWTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIHRoZXJlIGhhcyBiZWVuIG5vIGNvbGxpc2lvblxyXG4gICAgICAgICAgICB0aGlzLnggKz0gdGhpcy54VmVsO1xyXG4gICAgICAgICAgICB0aGlzLnkgKz0gdGhpcy55VmVsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gY29sbGlkZSB3aXRoIHNpZGVzIG9mIG1hcFxyXG5cclxuICAgICAgICBpZiAodGhpcy54IDwgMCkge1xyXG4gICAgICAgICAgICB0aGlzLnggPSAwO1xyXG4gICAgICAgICAgICB0aGlzLnhWZWwgPSAwO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy54ICsgdGhpcy53aWR0aCA+IGdhbWUud29ybGRXaWR0aCkge1xyXG4gICAgICAgICAgICB0aGlzLnggPSBnYW1lLndvcmxkV2lkdGggLSB0aGlzLndpZHRoO1xyXG4gICAgICAgICAgICB0aGlzLnhWZWwgPSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMueSA8IDApIHtcclxuICAgICAgICAgICAgdGhpcy55ID0gMDtcclxuICAgICAgICAgICAgdGhpcy55VmVsID0gMDtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMueSArIHRoaXMuaGVpZ2h0ID4gZ2FtZS53b3JsZEhlaWdodCkge1xyXG4gICAgICAgICAgICB0aGlzLnkgPSBnYW1lLndvcmxkSGVpZ2h0IC0gdGhpcy5oZWlnaHQ7XHJcbiAgICAgICAgICAgIHRoaXMueVZlbCA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JvdW5kZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5leHBvcnQgPSBQbGF5ZXJMb2NhbDtcclxuXHJcblxyXG5mdW5jdGlvbiByYW5kb21seVRvSW50KGY6IG51bWJlcikge1xyXG4gICAgaWYgKE1hdGgucmFuZG9tKCkgPiBmIC0gTWF0aC5mbG9vcihmKSkge1xyXG4gICAgICAgIHJldHVybiAoTWF0aC5mbG9vcihmKSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gKE1hdGguY2VpbChmKSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGF4aXNBbGlnbmVkRGlzdGFuY2UoeDE6IG51bWJlciwgeTE6IG51bWJlciwgeDI6IG51bWJlciwgeTI6IG51bWJlcikge1xyXG4gICAgcmV0dXJuIGFicyh4MSAtIHgyKSArIGFicyh5MSAtIHkyKTtcclxufSIsImltcG9ydCBSZW5kZXJhYmxlIGZyb20gJy4uLy4uL2ludGVyZmFjZXMvUmVuZGVyYWJsZSc7XHJcbmltcG9ydCBwNSBmcm9tICdwNSc7XHJcbmltcG9ydCB7IEVudGl0eVBheWxvYWQgfSBmcm9tICcuLi8uLi8uLi8uLi9hcGkvRW50aXR5JztcclxuXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBTZXJ2ZXJFbnRpdHkgaW1wbGVtZW50cyBSZW5kZXJhYmxlIHtcclxuXHJcbiAgICBlbnRpdHlJZDogc3RyaW5nXHJcblxyXG4gICAgeDogbnVtYmVyID0gMFxyXG4gICAgeTogbnVtYmVyID0gMFxyXG5cclxuICAgIHByb3RlY3RlZCBjb25zdHJ1Y3RvcihlbnRpdHlJZDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5lbnRpdHlJZCA9IGVudGl0eUlkXHJcbiAgICB9XHJcblxyXG4gICAgYWJzdHJhY3QgdXBkYXRlRGF0YShkYXRhOiBFbnRpdHlQYXlsb2FkKTogdm9pZFxyXG5cclxuICAgIGFic3RyYWN0IHJlbmRlcih0YXJnZXQ6IHA1LCB1cHNjYWxlU2l6ZTogbnVtYmVyKTogdm9pZDtcclxufSIsImltcG9ydCBnYW1lIGZyb20gXCIuLi8uLi9NYWluXCI7XHJcbmltcG9ydCBQYXJ0aWNsZSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9QYXJ0aWNsZVwiO1xyXG5pbXBvcnQgeyBjb2xsYXBzZVRleHRDaGFuZ2VSYW5nZXNBY3Jvc3NNdWx0aXBsZVZlcnNpb25zIH0gZnJvbSBcInR5cGVzY3JpcHRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDb2xvclBhcnRpY2xlIGltcGxlbWVudHMgUGFydGljbGUge1xyXG4gICAgY29sb3I6IHN0cmluZ1xyXG4gICAgeDogbnVtYmVyO1xyXG4gICAgeTogbnVtYmVyO1xyXG4gICAgc2l6ZTogbnVtYmVyO1xyXG4gICAgeFZlbDogbnVtYmVyO1xyXG4gICAgeVZlbDogbnVtYmVyO1xyXG4gICAgZ3Jhdml0eTogYm9vbGVhbjtcclxuICAgIGFnZTogbnVtYmVyO1xyXG4gICAgbGlmZXNwYW46IG51bWJlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihjb2xvcjogc3RyaW5nLCBzaXplOiBudW1iZXIsIGxpZmVzcGFuOiBudW1iZXIsIHg6IG51bWJlciwgeTogbnVtYmVyLCB4VmVsPzogbnVtYmVyLCB5VmVsPzogbnVtYmVyLCBncmF2aXR5PzogYm9vbGVhbikge1xyXG4gICAgICAgIHRoaXMuY29sb3IgPSBjb2xvcjtcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICAgICAgdGhpcy54VmVsID0geFZlbCB8fCAwO1xyXG4gICAgICAgIHRoaXMueVZlbCA9IHlWZWwgfHwgMDtcclxuICAgICAgICB0aGlzLnNpemUgPSBzaXplO1xyXG4gICAgICAgIHRoaXMuZ3Jhdml0eSA9IHRydWU7Ly91c2luZyB0aGUgb3IgbW9kaWZpZXIgd2l0aCBib29sZWFucyBjYXVzZXMgYnVnczsgdGhlcmUncyBwcm9iYWJseSBhIGJldHRlciB3YXkgdG8gZG8gdGhpc1xyXG4gICAgICAgIGlmIChncmF2aXR5ICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHRoaXMuZ3Jhdml0eSA9IGdyYXZpdHk7XHJcbiAgICAgICAgdGhpcy5hZ2UgPSAwO1xyXG4gICAgICAgIHRoaXMubGlmZXNwYW4gPSBsaWZlc3BhbjtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIodGFyZ2V0OiBpbXBvcnQoXCJwNVwiKSwgdXBzY2FsZVNpemU6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLmFnZSAvIHRoaXMubGlmZXNwYW4gPCAwLjgpIHsvL2lmIGl0J3MgdW5kZXIgODAlIG9mIHRoZSBwYXJ0aWNsZSdzIGxpZmVzcGFuLCBkcmF3IG5vcm1hbGx5IHdpdGhvdXQgZmFkZVxyXG4gICAgICAgICAgICB0YXJnZXQuZmlsbCh0aGlzLmNvbG9yKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7Ly90aGlzIG1lYW5zIHRoYXQgdGhlIHBhcnRpY2xlIGlzIGFsbW9zdCBnb2luZyB0byBiZSBkZWxldGVkLCBzbyBmYWRpbmcgaXMgbmVjZXNzYXJ5XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbG9yLmxlbmd0aCA9PT0gNykgey8vaWYgdGhlcmUgaXMgbm8gdHJhbnNwYXJlbmN5IGJ5IGRlZmF1bHQsIGp1c3QgbWFwIHRoZSB0aGluZ3NcclxuICAgICAgICAgICAgICAgIGxldCB0cmFuc3BhcmVuY3lTdHJpbmcgPSBNYXRoLnJvdW5kKDI1NSAqICgtNSAqICh0aGlzLmFnZSAvIHRoaXMubGlmZXNwYW4pICsgNSkpLnRvU3RyaW5nKDE2KS5zdWJzdHJpbmcoMCwgMik7XHJcbiAgICAgICAgICAgICAgICBpZiAodHJhbnNwYXJlbmN5U3RyaW5nPT09dW5kZWZpbmVkIHx8IHRyYW5zcGFyZW5jeVN0cmluZy5sZW5ndGg9PT11bmRlZmluZWQpLy9jYXRjaCB3aGF0IGNvdWxkIGJlIGFuIGluZmluaXRlIGxvb3Agb3IganVzdCBhbiBlcnJvclxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcclxuICAgICAgICAgICAgICAgICAgICAgICAgYHVuZGVmaW5lZCB0cmFuc3BhcmVuY3kgc3RyaW5nIG9uIHBhcnRpY2xlYFxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSh0cmFuc3BhcmVuY3lTdHJpbmcubGVuZ3RoPDIpIHsvL21ha2Ugc3VyZSBpdCdzIDIgY2hhcmFjdGVycyBsb25nOyB0aGlzIHN0b3BzIHRoZSBjb21wdXRlciBmcm9tIGludGVycHJldGluZyAjZmYgZmYgZmYgNSBhcyAjZmYgZmYgZmYgNTUgaW5zdGVhZCBvZiAjZmYgZmYgZmYgMDVcclxuICAgICAgICAgICAgICAgICAgICB0cmFuc3BhcmVuY3lTdHJpbmcgPSBcIjBcIit0cmFuc3BhcmVuY3lTdHJpbmc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQuZmlsbCh0aGlzLmNvbG9yLnN1YnN0cmluZygwLCA3KSArIHRyYW5zcGFyZW5jeVN0cmluZyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7Ly9pZiB0aGVyZSBpcyB0cmFuc3BhcmVuY3ksIG11bHRpcGx5XHJcbiAgICAgICAgICAgICAgICBsZXQgdHJhbnNwYXJlbmN5U3RyaW5nID0gTWF0aC5yb3VuZChwYXJzZUludCh0aGlzLmNvbG9yLnN1YnN0cmluZyg3LCA5KSwgMTYpICogKC01ICogKHRoaXMuYWdlIC8gdGhpcy5saWZlc3BhbikgKyA1KSkudG9TdHJpbmcoMTYpLnN1YnN0cmluZygwLCAyKTtcclxuICAgICAgICAgICAgICAgIGlmICh0cmFuc3BhcmVuY3lTdHJpbmc9PT11bmRlZmluZWQgfHwgdHJhbnNwYXJlbmN5U3RyaW5nLmxlbmd0aD09PXVuZGVmaW5lZCkvL2NhdGNoIHdoYXQgY291bGQgYmUgYW4gaW5maW5pdGUgbG9vcCBvciBqdXN0IGFuIGVycm9yXHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBgdW5kZWZpbmVkIHRyYW5zcGFyZW5jeSBzdHJpbmcgb24gcGFydGljbGVgXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIHdoaWxlKHRyYW5zcGFyZW5jeVN0cmluZy5sZW5ndGg8Mikgey8vbWFrZSBzdXJlIGl0J3MgMiBjaGFyYWN0ZXJzIGxvbmc7IHRoaXMgc3RvcHMgdGhlIGNvbXB1dGVyIGZyb20gaW50ZXJwcmV0aW5nICNmZiBmZiBmZiA1IGFzICNmZiBmZiBmZiA1NSBpbnN0ZWFkIG9mICNmZiBmZiBmZiAwNVxyXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zcGFyZW5jeVN0cmluZyA9IFwiMFwiK3RyYW5zcGFyZW5jeVN0cmluZztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRhcmdldC5maWxsKHRoaXMuY29sb3Iuc3Vic3RyaW5nKDAsIDcpICsgdHJhbnNwYXJlbmN5U3RyaW5nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvL2RyYXcgYSByZWN0YW5nbGUgY2VudGVyZWQgb24gdGhlIHggYW5kIHkgcG9zaXRpb24gZmlsbGVkIHdpdGggdGhlIGNvbG9yIG9mIHRoZSBvYmplY3RcclxuICAgICAgICB0YXJnZXQucmVjdChcclxuICAgICAgICAgICAgKC10aGlzLnNpemUgLyAyICsgdGhpcy54ICogZ2FtZS5USUxFX1dJRFRIIC1cclxuICAgICAgICAgICAgICAgIGdhbWUuaW50ZXJwb2xhdGVkQ2FtWCAqIGdhbWUuVElMRV9XSURUSCkgKlxyXG4gICAgICAgICAgICB1cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgKC10aGlzLnNpemUgLyAyICsgdGhpcy55ICogZ2FtZS5USUxFX0hFSUdIVCAtXHJcbiAgICAgICAgICAgICAgICBnYW1lLmludGVycG9sYXRlZENhbVkgKiBnYW1lLlRJTEVfSEVJR0hUKSAqXHJcbiAgICAgICAgICAgIHVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICB0aGlzLnNpemUgKiB1cHNjYWxlU2l6ZSAqIGdhbWUuVElMRV9XSURUSCxcclxuICAgICAgICAgICAgdGhpcy5zaXplICogdXBzY2FsZVNpemUgKiBnYW1lLlRJTEVfSEVJR0hUXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICB0aWNrKCkge1xyXG4gICAgICAgIHRoaXMuYWdlKys7XHJcbiAgICAgICAgdGhpcy54ICs9IHRoaXMueFZlbDtcclxuICAgICAgICB0aGlzLnkgKz0gdGhpcy55VmVsO1xyXG4gICAgICAgIHRoaXMueFZlbCAtPSAoTWF0aC5hYnModGhpcy54VmVsKSAqIHRoaXMueFZlbCAqIGdhbWUuRFJBR19DT0VGRklDSUVOVCAqIHRoaXMuc2l6ZSk7Ly9hc3N1bWluZyBjb25zdGFudCBtYXNzIGZvciBlYWNoIHBhcnRpY2xlXHJcbiAgICAgICAgaWYgKHRoaXMuZ3Jhdml0eSkge1xyXG4gICAgICAgICAgICB0aGlzLnlWZWwgKz0gZ2FtZS5HUkFWSVRZX1NQRUVEO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnlWZWwgLT0gKE1hdGguYWJzKHRoaXMueVZlbCkgKiB0aGlzLnlWZWwgKiBnYW1lLkRSQUdfQ09FRkZJQ0lFTlQgKiB0aGlzLnNpemUpO1xyXG4gICAgfVxyXG5cclxufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuIiwidmFyIGRlZmVycmVkID0gW107XG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8gPSAocmVzdWx0LCBjaHVua0lkcywgZm4sIHByaW9yaXR5KSA9PiB7XG5cdGlmKGNodW5rSWRzKSB7XG5cdFx0cHJpb3JpdHkgPSBwcmlvcml0eSB8fCAwO1xuXHRcdGZvcih2YXIgaSA9IGRlZmVycmVkLmxlbmd0aDsgaSA+IDAgJiYgZGVmZXJyZWRbaSAtIDFdWzJdID4gcHJpb3JpdHk7IGktLSkgZGVmZXJyZWRbaV0gPSBkZWZlcnJlZFtpIC0gMV07XG5cdFx0ZGVmZXJyZWRbaV0gPSBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV07XG5cdFx0cmV0dXJuO1xuXHR9XG5cdHZhciBub3RGdWxmaWxsZWQgPSBJbmZpbml0eTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZWZlcnJlZC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV0gPSBkZWZlcnJlZFtpXTtcblx0XHR2YXIgZnVsZmlsbGVkID0gdHJ1ZTtcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGNodW5rSWRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRpZiAoKHByaW9yaXR5ICYgMSA9PT0gMCB8fCBub3RGdWxmaWxsZWQgPj0gcHJpb3JpdHkpICYmIE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uTykuZXZlcnkoKGtleSkgPT4gKF9fd2VicGFja19yZXF1aXJlX18uT1trZXldKGNodW5rSWRzW2pdKSkpKSB7XG5cdFx0XHRcdGNodW5rSWRzLnNwbGljZShqLS0sIDEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZnVsZmlsbGVkID0gZmFsc2U7XG5cdFx0XHRcdGlmKHByaW9yaXR5IDwgbm90RnVsZmlsbGVkKSBub3RGdWxmaWxsZWQgPSBwcmlvcml0eTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYoZnVsZmlsbGVkKSB7XG5cdFx0XHRkZWZlcnJlZC5zcGxpY2UoaS0tLCAxKVxuXHRcdFx0dmFyIHIgPSBmbigpO1xuXHRcdFx0aWYgKHIgIT09IHVuZGVmaW5lZCkgcmVzdWx0ID0gcjtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gbm8gYmFzZVVSSVxuXG4vLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGFuZCBsb2FkaW5nIGNodW5rc1xuLy8gdW5kZWZpbmVkID0gY2h1bmsgbm90IGxvYWRlZCwgbnVsbCA9IGNodW5rIHByZWxvYWRlZC9wcmVmZXRjaGVkXG4vLyBbcmVzb2x2ZSwgcmVqZWN0LCBQcm9taXNlXSA9IGNodW5rIGxvYWRpbmcsIDAgPSBjaHVuayBsb2FkZWRcbnZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG5cdFwibWFpblwiOiAwXG59O1xuXG4vLyBubyBjaHVuayBvbiBkZW1hbmQgbG9hZGluZ1xuXG4vLyBubyBwcmVmZXRjaGluZ1xuXG4vLyBubyBwcmVsb2FkZWRcblxuLy8gbm8gSE1SXG5cbi8vIG5vIEhNUiBtYW5pZmVzdFxuXG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8uaiA9IChjaHVua0lkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID09PSAwKTtcblxuLy8gaW5zdGFsbCBhIEpTT05QIGNhbGxiYWNrIGZvciBjaHVuayBsb2FkaW5nXG52YXIgd2VicGFja0pzb25wQ2FsbGJhY2sgPSAocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24sIGRhdGEpID0+IHtcblx0dmFyIFtjaHVua0lkcywgbW9yZU1vZHVsZXMsIHJ1bnRpbWVdID0gZGF0YTtcblx0Ly8gYWRkIFwibW9yZU1vZHVsZXNcIiB0byB0aGUgbW9kdWxlcyBvYmplY3QsXG5cdC8vIHRoZW4gZmxhZyBhbGwgXCJjaHVua0lkc1wiIGFzIGxvYWRlZCBhbmQgZmlyZSBjYWxsYmFja1xuXHR2YXIgbW9kdWxlSWQsIGNodW5rSWQsIGkgPSAwO1xuXHRpZihjaHVua0lkcy5zb21lKChpZCkgPT4gKGluc3RhbGxlZENodW5rc1tpZF0gIT09IDApKSkge1xuXHRcdGZvcihtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xuXHRcdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcblx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYocnVudGltZSkgdmFyIHJlc3VsdCA9IHJ1bnRpbWUoX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cdH1cblx0aWYocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24pIHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKGRhdGEpO1xuXHRmb3IoO2kgPCBjaHVua0lkcy5sZW5ndGg7IGkrKykge1xuXHRcdGNodW5rSWQgPSBjaHVua0lkc1tpXTtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oaW5zdGFsbGVkQ2h1bmtzLCBjaHVua0lkKSAmJiBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pIHtcblx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXVswXSgpO1xuXHRcdH1cblx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPSAwO1xuXHR9XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLk8ocmVzdWx0KTtcbn1cblxudmFyIGNodW5rTG9hZGluZ0dsb2JhbCA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtzbm93ZWRfaW5cIl0gPSBzZWxmW1wid2VicGFja0NodW5rc25vd2VkX2luXCJdIHx8IFtdO1xuY2h1bmtMb2FkaW5nR2xvYmFsLmZvckVhY2god2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCAwKSk7XG5jaHVua0xvYWRpbmdHbG9iYWwucHVzaCA9IHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2guYmluZChjaHVua0xvYWRpbmdHbG9iYWwpKTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGRlcGVuZHMgb24gb3RoZXIgbG9hZGVkIGNodW5rcyBhbmQgZXhlY3V0aW9uIG5lZWQgdG8gYmUgZGVsYXllZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8odW5kZWZpbmVkLCBbXCJjb21tb25zLW1haW5cIl0sICgpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi93ZWJwYWdlL3NyYy9NYWluLnRzXCIpKSlcbl9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8oX193ZWJwYWNrX2V4cG9ydHNfXyk7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=