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
        // remove texture interpolation (enable point filtering for images)
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
        this.smooth(); //enable image lerp
        this.tint(255, 100); //make image translucent
        Assets_1.UiAssets.vignette.render(this, 0, 0, this.width, this.height);
        this.noTint();
        this.noSmooth();
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
        if (this.currentUi !== undefined) {
            for (let i of this.currentUi.inputBoxes) {
                if (i.listening) {
                    console.log("test3");
                    i.listening = false;
                    this.controls[i.index].keyCode = event.keyCode;
                    this.controls[i.index].keyboard = false;
                    i.value = event.keyCode;
                    i.keyboard = true;
                    i.image = Assets_1.UiAssets.button_unselected;
                }
            }
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
        if (this.currentUi !== undefined) {
            if (this.currentUi.buttons !== undefined) {
                for (const i of this.currentUi.buttons) {
                    i.updateMouseOver(this.mouseX, this.mouseY);
                }
            }
            if (this.currentUi.inputBoxes !== undefined) {
                for (const i of this.currentUi.inputBoxes) {
                    i.updateMouseOver(this.mouseX, this.mouseY);
                }
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
            new ImageResource_1.default('assets/textures/world/tileEntities/Rusty Drill/RustyDrill1.png'),
            new ImageResource_1.default('assets/textures/world/tileEntities/Rusty Drill/RustyDrill2.png'),
            new ImageResource_1.default('assets/textures/world/tileEntities/Rusty Drill/RustyDrill3.png'),
            new ImageResource_1.default('assets/textures/world/tileEntities/Rusty Drill/RustyDrill4.png'),
            new ImageResource_1.default('assets/textures/world/tileEntities/Rusty Drill/RustyDrill5.png'),
            new ImageResource_1.default('assets/textures/world/tileEntities/Rusty Drill/RustyDrill6.png'),
            new ImageResource_1.default('assets/textures/world/tileEntities/Rusty Drill/RustyDrill7.png'),
            new ImageResource_1.default('assets/textures/world/tileEntities/Rusty Drill/RustyDrill8.png'),
            new ImageResource_1.default('assets/textures/world/tileEntities/Rusty Drill/RustyDrill9.png'),
            new ImageResource_1.default('assets/textures/world/tileEntities/Rusty Drill/RustyDrill10.png'),
            new ImageResource_1.default('assets/textures/world/tileEntities/Rusty Drill/RustyDrill11.png'),
            new ImageResource_1.default('assets/textures/world/tileEntities/Rusty Drill/RustyDrill12.png'),
            new ImageResource_1.default('assets/textures/world/tileEntities/Rusty Drill/RustyDrill13.png')
        ],
        entity_t1drone: [
            new ImageResource_1.default('assets/textures/world/entities/Small Drone/SmallDrone01.png'),
            new ImageResource_1.default('assets/textures/world/entities/Small Drone/SmallDrone02.png'),
            new ImageResource_1.default('assets/textures/world/entities/Small Drone/SmallDrone03.png'),
            new ImageResource_1.default('assets/textures/world/entities/Small Drone/SmallDrone04.png'),
            new ImageResource_1.default('assets/textures/world/entities/Small Drone/SmallDrone05.png'),
            new ImageResource_1.default('assets/textures/world/entities/Small Drone/SmallDrone06.png'),
            new ImageResource_1.default('assets/textures/world/entities/Small Drone/SmallDrone07.png'),
            new ImageResource_1.default('assets/textures/world/entities/Small Drone/SmallDrone08.png'),
            new ImageResource_1.default('assets/textures/world/entities/Small Drone/SmallDrone09.png'),
            new ImageResource_1.default('assets/textures/world/entities/Small Drone/SmallDrone10.png'),
            new ImageResource_1.default('assets/textures/world/entities/Small Drone/SmallDrone11.png'),
            new ImageResource_1.default('assets/textures/world/entities/Small Drone/SmallDrone12.png'),
            new ImageResource_1.default('assets/textures/world/entities/Small Drone/SmallDrone13.png'),
            new ImageResource_1.default('assets/textures/world/entities/Small Drone/SmallDrone14.png'),
            new ImageResource_1.default('assets/textures/world/entities/Small Drone/SmallDrone15.png'),
            new ImageResource_1.default('assets/textures/world/entities/Small Drone/SmallDrone16.png'),
            new ImageResource_1.default('assets/textures/world/entities/Small Drone/SmallDrone17.png'),
            new ImageResource_1.default('assets/textures/world/entities/Small Drone/SmallDrone18.png'),
            new ImageResource_1.default('assets/textures/world/entities/Small Drone/SmallDrone19.png'),
            new ImageResource_1.default('assets/textures/world/entities/Small Drone/SmallDrone20.png')
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
        //AudioAssets.ui.inventoryClack.playRandom();
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
            //console.log(this.inputBoxes);
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
        this.frame.h = 148 * Main_1.default.upscaleSize;
        // set the positions of the button
        for (let i = 0; i < 1; i++) {
            this.buttons[i].x = Main_1.default.width / 2 - 192 / 2 * Main_1.default.upscaleSize;
            this.buttons[i].y = Main_1.default.height / 2 + 20 * i * Main_1.default.upscaleSize + 20 * Main_1.default.upscaleSize * this.inputBoxes.length;
            this.buttons[i].w = 192 * Main_1.default.upscaleSize;
            this.buttons[i].h = 16 * Main_1.default.upscaleSize;
            this.buttons[i].updateMouseOver(Main_1.default.mouseX, Main_1.default.mouseY);
        }
        // set the positions of all the input boxes
        for (let i = 0; i < this.inputBoxes.length; i++) {
            this.inputBoxes[i].x = Main_1.default.width / 2 - 168 / 2 * Main_1.default.upscaleSize;
            this.inputBoxes[i].y = Main_1.default.height / 2 + 20 * i * Main_1.default.upscaleSize;
            this.inputBoxes[i].w = 168 * Main_1.default.upscaleSize;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RSxJQUFJLEVBQUUsRUFBRSxFQUFFLEdBQUUsRUFBRTtnQkFDbEMsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUM7WUFDMUIsQ0FBQyxDQUFDO1lBQ0YsSUFBSSxpQkFBTyxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEdBQUUsRUFBRTtnQkFDbEMsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUM7WUFDMUIsQ0FBQyxDQUFDO1lBQ0YsSUFBSSxpQkFBTyxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEdBQUUsRUFBRTtnQkFDbEMsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUM7WUFDMUIsQ0FBQyxDQUFDO1lBQ0YsSUFBSSxpQkFBTyxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEdBQUUsRUFBRTtnQkFDbEMsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUM7WUFDMUIsQ0FBQyxDQUFDO1lBQ0YsSUFBSSxpQkFBTyxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEdBQUUsRUFBRTtnQkFDbEMsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUM7WUFDMUIsQ0FBQyxDQUFDO1lBQ0YsSUFBSSxpQkFBTyxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEdBQUUsRUFBRTtnQkFDbEMsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUM7WUFDMUIsQ0FBQyxDQUFDO1lBQ0YsSUFBSSxpQkFBTyxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEdBQUUsRUFBRTtnQkFDbEMsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUM7WUFDMUIsQ0FBQyxDQUFDLEVBQUMsWUFBWTtTQUNsQixDQUFDO1FBeUJFLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1FBRTdCLGlDQUFpQztRQUNqQyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksdUJBQVUsQ0FBQyxJQUFJLENBQUM7SUFDMUMsQ0FB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QUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO0tBQ1QsRUFBRSx3RUFBd0UsQ0FBQztJQUU1RSxHQUFHLEVBQUUsSUFBSSxzQkFBWSxDQUFDLGdDQUFnQyxFQUFFO1FBQ3BELEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7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LGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFakksaUJBQWlCO1FBQ2pCLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM1RyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFbEksaUJBQWlCO1FBQ2pCLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM1RyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFF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QUM7UUFDekQsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxHQUFHLFdBQVcsQ0FBQztRQUN6RCxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFDLEdBQUcsV0FBVyxDQUFDO1FBQ3pELE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxXQUFXLENBQUMsR0FBRyxXQUFXLENBQUM7UUFFekQsVUFBVTtRQUNWLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNyRixJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDM0csSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzNHLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUVqSSxpQkFBaUI7UUFDakIsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzVHLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUVsSSxpQkFBaUI7UUFDakIsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzVHLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMs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QTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxNQUFNLHFCQUFxQjtXQUMzQjtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBO1dBQ0E7V0FDQTs7Ozs7VUVoREE7VUFDQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL3Nub3dlZF9pbi8uL2FwaS9FbnRpdHkudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vYXBpL1RpbGUudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vd2VicGFnZS9zcmMvR2FtZS50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi93ZWJwYWdlL3NyYy9NYWluLnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3dlYnBhZ2Uvc3JjL2Fzc2V0cy9Bc3NldHMudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vd2VicGFnZS9zcmMvYXNzZXRzL3Jlc291cmNlcy9BdWRpb1Jlc291cmNlLnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3dlYnBhZ2Uvc3JjL2Fzc2V0cy9yZXNvdXJjZXMvQXVkaW9SZXNvdXJjZUdyb3VwLnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3dlYnBhZ2Uvc3JjL2Fzc2V0cy9yZXNvdXJjZXMvRm9udFJlc291cmNlLnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3dlYnBhZ2Uvc3JjL2Fzc2V0cy9yZXNvdXJjZXMvSW1hZ2VSZXNvdXJjZS50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi93ZWJwYWdlL3NyYy9hc3NldHMvcmVzb3VyY2VzL1JlZmxlY3RlZEltYWdlUmVzb3VyY2UudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vd2VicGFnZS9zcmMvYXNzZXRzL3Jlc291cmNlcy9SZXNvdXJjZS50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi93ZWJwYWdlL3NyYy9hc3NldHMvcmVzb3VyY2VzL1RpbGVSZXNvdXJjZS50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi93ZWJwYWdlL3NyYy9pbnB1dC9Db250cm9sLnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3dlYnBhZ2Uvc3JjL3VpL0J1dHRvbi50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi93ZWJwYWdlL3NyYy91aS9JbnB1dEJveC50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi93ZWJwYWdlL3NyYy91aS9TbGlkZXIudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vd2VicGFnZS9zcmMvdWkvVWlGcmFtZS50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi93ZWJwYWdlL3NyYy91aS9VaVNjcmVlbi50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi93ZWJwYWdlL3NyYy91aS9zY3JlZW5zL0NvbnRyb2xzTWVudS50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi93ZWJwYWdlL3NyYy91aS9zY3JlZW5zL01haW5NZW51LnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3dlYnBhZ2Uvc3JjL3VpL3NjcmVlbnMvT3B0aW9uc01lbnUudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vd2VicGFnZS9zcmMvdWkvc2NyZWVucy9QYXVzZU1lbnUudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vd2VicGFnZS9zcmMvdWkvc2NyZWVucy9WaWRlb1NldHRpbmdzTWVudS50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi93ZWJwYWdlL3NyYy91aS9zY3JlZW5zL1dvcmxkQ3JlYXRpb25NZW51LnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3dlYnBhZ2Uvc3JjL3VpL3NjcmVlbnMvV29ybGRPcHRpb25zTWVudS50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi93ZWJwYWdlL3NyYy93ZWJzb2NrZXQvTmV0TWFuYWdlci50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi93ZWJwYWdlL3NyYy93b3JsZC9Xb3JsZC50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi93ZWJwYWdlL3NyYy93b3JsZC9Xb3JsZFRpbGVzLnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3dlYnBhZ2Uvc3JjL3dvcmxkL2VudGl0aWVzL0VudGl0eUNsYXNzZXMudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vd2VicGFnZS9zcmMvd29ybGQvZW50aXRpZXMvUGxheWVyRW50aXR5LnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3dlYnBhZ2Uvc3JjL3dvcmxkL2VudGl0aWVzL1BsYXllckxvY2FsLnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3dlYnBhZ2Uvc3JjL3dvcmxkL2VudGl0aWVzL1NlcnZlckVudGl0eS50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi93ZWJwYWdlL3NyYy93b3JsZC9wYXJ0aWNsZXMvQ29sb3JQYXJ0aWNsZS50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vc25vd2VkX2luL3dlYnBhY2svcnVudGltZS9jaHVuayBsb2FkZWQiLCJ3ZWJwYWNrOi8vc25vd2VkX2luL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vd2VicGFjay9ydW50aW1lL2pzb25wIGNodW5rIGxvYWRpbmciLCJ3ZWJwYWNrOi8vc25vd2VkX2luL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vc25vd2VkX2luL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEludmVudG9yeVBheWxvYWQgfSBmcm9tICcuL0ludmVudG9yeSc7XHJcblxyXG5leHBvcnQgZW51bSBFbnRpdGllcyB7XHJcbiAgICBMb2NhbFBsYXllcixcclxuICAgIFBsYXllcixcclxuICAgIEl0ZW1cclxufVxyXG5cclxudHlwZSBEYXRhUGFpcnM8VCwgSyBleHRlbmRzIGtleW9mIFQgPSBrZXlvZiBUPiA9XHJcbiAgICBLIGV4dGVuZHMga2V5b2YgVFxyXG4gICAgICAgID8geyB0eXBlOiBLLCBkYXRhOiBUW0tdIH1cclxuICAgICAgICA6IG5ldmVyO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBFbnRpdGllc0RhdGEge1xyXG4gICAgW0VudGl0aWVzLkxvY2FsUGxheWVyXToge25hbWU6IHN0cmluZywgeDogbnVtYmVyLCB5OiBudW1iZXIsIGludmVudG9yeTogSW52ZW50b3J5UGF5bG9hZH1cclxuICAgIFtFbnRpdGllcy5QbGF5ZXJdOiB7bmFtZTogc3RyaW5nfTtcclxuICAgIFtFbnRpdGllcy5JdGVtXToge2RhdGVDcmVhdGVkOiBzdHJpbmd9O1xyXG59XHJcblxyXG5leHBvcnQgdHlwZSBFbnRpdHlEYXRhPFQgZXh0ZW5kcyBFbnRpdGllcyA9IGtleW9mIEVudGl0aWVzRGF0YT4gPSBEYXRhUGFpcnM8RW50aXRpZXNEYXRhLCBUPlxyXG5cclxuZXhwb3J0IHR5cGUgRW50aXR5UGF5bG9hZDxUIGV4dGVuZHMgRW50aXRpZXMgPSBrZXlvZiBFbnRpdGllc0RhdGE+ID0gRW50aXR5RGF0YTxUPiAmIHtpZDogc3RyaW5nfSIsImV4cG9ydCBlbnVtIFRpbGVUeXBlIHtcclxuICAgIEFpcixcclxuICAgIFRpbGVFbnRpdHksXHJcbiAgICBTbm93LFxyXG4gICAgSWNlLFxyXG4gICAgRGlydCxcclxuICAgIFN0b25lMCxcclxuICAgIFN0b25lMSxcclxuICAgIFN0b25lMixcclxuICAgIFN0b25lMyxcclxuICAgIFN0b25lNCxcclxuICAgIFN0b25lNSxcclxuICAgIFN0b25lNixcclxuICAgIFN0b25lNyxcclxuICAgIFN0b25lOCxcclxuICAgIFN0b25lOSxcclxuICAgIC8vIFdvb2QwLFxyXG4gICAgLy8gV29vZDEsXHJcbiAgICAvLyBXb29kMixcclxuICAgIC8vIFdvb2QzLFxyXG4gICAgLy8gV29vZDQsXHJcbiAgICAvLyBXb29kNSxcclxuICAgIC8vIFdvb2Q2LFxyXG4gICAgLy8gV29vZDcsXHJcbiAgICAvLyBXb29kOCxcclxuICAgIC8vIFdvb2Q5LFxyXG59IiwiaW1wb3J0IHA1LCB7IENvbG9yLCBTaGFkZXIgfSBmcm9tICdwNSdcclxuXHJcbmltcG9ydCBXb3JsZCBmcm9tICcuL3dvcmxkL1dvcmxkJztcclxuXHJcbmltcG9ydCB7XHJcbiAgICBBdWRpb0Fzc2V0cyxcclxuICAgIEZvbnRzLFxyXG4gICAgSXRlbXNBc3NldHMsXHJcbiAgICBsb2FkQXNzZXRzLFxyXG4gICAgUGxheWVyQW5pbWF0aW9ucyxcclxuICAgIFVpQXNzZXRzLFxyXG4gICAgV29ybGRBc3NldHMsXHJcbn0gZnJvbSAnLi9hc3NldHMvQXNzZXRzJztcclxuaW1wb3J0IHsgTWFpbk1lbnUgfSBmcm9tICcuL3VpL3NjcmVlbnMvTWFpbk1lbnUnO1xyXG5pbXBvcnQgeyBTb2NrZXQgfSBmcm9tICdzb2NrZXQuaW8tY2xpZW50JztcclxuaW1wb3J0IFVpU2NyZWVuIGZyb20gJy4vdWkvVWlTY3JlZW4nO1xyXG5pbXBvcnQgeyBQYXVzZU1lbnUgfSBmcm9tICcuL3VpL3NjcmVlbnMvUGF1c2VNZW51JztcclxuaW1wb3J0IHsgTmV0TWFuYWdlciB9IGZyb20gJy4vd2Vic29ja2V0L05ldE1hbmFnZXInO1xyXG5cclxuaW1wb3J0IHsgQ2xpZW50RXZlbnRzLCBTZXJ2ZXJFdmVudHMgfSBmcm9tICcuLi8uLi9hcGkvQVBJJztcclxuaW1wb3J0IEl0ZW1TdGFjayBmcm9tICcuL3dvcmxkL2l0ZW1zL0l0ZW1TdGFjayc7XHJcbmltcG9ydCB7IENvbnRyb2wgfSBmcm9tICcuL2lucHV0L0NvbnRyb2wnO1xyXG5pbXBvcnQgeyBDb2xvclBhcnRpY2xlIH0gZnJvbSAnLi93b3JsZC9wYXJ0aWNsZXMvQ29sb3JQYXJ0aWNsZSc7XHJcbmltcG9ydCB7IFdvcmxkVGlsZXMgfSBmcm9tICcuL3dvcmxkL1dvcmxkVGlsZXMnO1xyXG5pbXBvcnQgeyBUaWxlVHlwZSB9IGZyb20gJy4uLy4uL2FwaS9UaWxlJztcclxuXHJcblxyXG4vKlxyXG4vLy9JTkZPUk1BVElPTlxyXG4vL1N0YXJ0aW5nIGEgZ2FtZVxyXG5QcmVzcyBMaXZlIFNlcnZlciB0byBzdGFydCB0aGUgZ2FtZVxyXG5vclxyXG5UeXBlIG5wbSBydW4gcHJlc3RhcnQgdG8gc3RhcnQgdGhlIGdhbWUuXHJcbi8vVE9ET1xyXG5XaGVuIHNvbWV0aGluZyBpbiB0aGUgdG9kbyBzZWN0aW9uLCBlaXRoZXIgZGVsZXRlIGl0IGFuZCBtYXJrIHdoYXQgd2FzIGRvbmUgaW4gdGhlIGRlc2NyaXB0aW9uIC1cclxuLSB3aGVuIHB1c2hpbmcsIG9yIGp1c3QgbWFyayBpdCBsaWtlIHRoaXNcclxuKGV4YW1wbGU6IENyZWF0ZSBhIG51Y2xlYXIgZXhwbG9zaW9uIC0tIFgpXHJcbi8vL0dFTkVSQUwgVE9ETzpcclxuXHJcbi8vQXVkaW9cclxuc291bmRzXHJcbm11c2ljXHJcbk5QQydzXHJcblxyXG4vL1Zpc3VhbFxyXG5VcGRhdGUgc25vdyB0ZXh0dXJlc1xyXG5VcGRhdGUgR1VJIHRleHR1cmVzXHJcbnBsYXllciBjaGFyYWN0ZXJcclxuaXRlbSBsb3JlIGltcGxlbWVudGVkXHJcblxyXG4vL0dhbWVwbGF5XHJcbmZpbmlzaCBpdGVtIG1hbmFnZW1lbnRcclxucGF1c2UgbWVudVxyXG5IdW5nZXIsIGhlYXQsIGV0YyBzeXN0ZW1cclxuaXRlbSBjcmVhdGlvblxyXG5pdGVtIHVzZVxyXG5QYXJlbnQgV29ya2JlbmNoXHJcblxyXG4vL09iamVjdHNcclxuZGlydFxyXG5zdG9uZVxyXG53b3JrYmVuY2hcclxuYmFja3BhY2sgKHVzZWQgYXMgY2hlc3QpXHJcblxyXG4vL1BvbGlzaFxyXG5iZXR0ZXIgd29ybGQgZ2VuZXJhdGlvblxyXG5mb250IGNvbnNpc3RlbmN5XHJcbmZpeCBjdXJzb3IgaW5wdXQgbGFnIChzZXBhcmF0ZSBjdXJzb3IgYW5kIGFuaW1hdGlvbiBpbWFnZXMpXHJcbmZpeCBzdHVjayBvbiBzaWRlIG9mIGJsb2NrIGJ1Z1xyXG5maXggY29sbGlkZSB3aXRoIHNpZGVzIG9mIG1hcCBidWdcclxuXHJcbml0ZW0gbWFuYWdlbWVudCBiZWhhdmlvciB0b2RvOlxyXG5tZXJnZVxyXG5yaWdodCBjbGljayBzdGFjayB0byBwaWNrIHVwIGNlaWwoaGFsZiBvZiBpdClcclxucmlnaHQgY2xpY2sgd2hlbiBwaWNrZWQgdXAgdG8gYWRkIDEgaWYgMCBvciBtYXRjaFxyXG5jcmFmdGFibGVzXHJcblxyXG5cclxuKi9cclxuXHJcblxyXG5jbGFzcyBHYW1lIGV4dGVuZHMgcDUge1xyXG4gICAgd29ybGRXaWR0aDogbnVtYmVyID0gNTEyOyAvLyB3aWR0aCBvZiB0aGUgd29ybGQgaW4gdGlsZXMgICA8IT4gTUFLRSBTVVJFIFRISVMgSVMgTkVWRVIgTEVTUyBUSEFOIDY0ISEhIDwhPlxyXG4gICAgd29ybGRIZWlnaHQ6IG51bWJlciA9IDI1NjsgLy8gaGVpZ2h0IG9mIHRoZSB3b3JsZCBpbiB0aWxlcyAgPCE+IE1BS0UgU1VSRSBUSElTIElTIE5FVkVSIExFU1MgVEhBTiA2NCEhISA8IT5cclxuXHJcbiAgICBUSUxFX1dJRFRIOiBudW1iZXIgPSA4OyAvLyB3aWR0aCBvZiBhIHRpbGVzIGluIHBpeGVsc1xyXG4gICAgVElMRV9IRUlHSFQ6IG51bWJlciA9IDg7IC8vIGhlaWdodCBvZiBhIHRpbGVzIGluIHBpeGVsc1xyXG4gICAgQkFDS19USUxFX1dJRFRIOiBudW1iZXIgPSAxMjsgLy8gd2lkdGggb2YgYSB0aWxlcyBpbiBwaXhlbHNcclxuICAgIEJBQ0tfVElMRV9IRUlHSFQ6IG51bWJlciA9IDEyOyAvLyBoZWlnaHQgb2YgYSB0aWxlcyBpbiBwaXhlbHNcclxuXHJcbiAgICB1cHNjYWxlU2l6ZTogbnVtYmVyID0gNjsgLy8gbnVtYmVyIG9mIHNjcmVlbiBwaXhlbHMgcGVyIHRleHR1cmUgcGl4ZWxzICh0aGluayBvZiB0aGlzIGFzIGh1ZCBzY2FsZSBpbiBNaW5lY3JhZnQpXHJcblxyXG4gICAgY2FtWDogbnVtYmVyID0gMDsgLy8gcG9zaXRpb24gb2YgdGhlIHRvcCBsZWZ0IGNvcm5lciBvZiB0aGUgc2NyZWVuIGluIHVuLXVwLXNjYWxlZCBwaXhlbHMgKDAgaXMgbGVmdCBvZiB3b3JsZCkgKHdvcmxkV2lkdGgqVElMRV9XSURUSCBpcyBib3R0b20gb2Ygd29ybGQpXHJcbiAgICBjYW1ZOiBudW1iZXIgPSAwOyAvLyBwb3NpdGlvbiBvZiB0aGUgdG9wIGxlZnQgY29ybmVyIG9mIHRoZSBzY3JlZW4gaW4gdW4tdXAtc2NhbGVkIHBpeGVscyAoMCBpcyB0b3Agb2Ygd29ybGQpICh3b3JsZEhlaWdodCpUSUxFX0hFSUdIVCBpcyBib3R0b20gb2Ygd29ybGQpXHJcbiAgICBwQ2FtWDogbnVtYmVyID0gMDsgLy8gbGFzdCBmcmFtZSdzIHggb2YgdGhlIGNhbWVyYVxyXG4gICAgcENhbVk6IG51bWJlciA9IDA7IC8vIGxhc3QgZnJhbWUncyB5IG9mIHRoZSBjYW1lcmFcclxuICAgIGludGVycG9sYXRlZENhbVg6IG51bWJlciA9IDA7IC8vIGludGVycG9sYXRlZCBwb3NpdGlvbiBvZiB0aGUgY2FtZXJhXHJcbiAgICBpbnRlcnBvbGF0ZWRDYW1ZOiBudW1iZXIgPSAwOyAvLyBpbnRlcnBvbGF0ZWQgcG9zaXRpb24gb2YgdGhlIGNhbWVyYVxyXG4gICAgZGVzaXJlZENhbVg6IG51bWJlciA9IDA7IC8vIGRlc2lyZWQgcG9zaXRpb24gb2YgdGhlIGNhbWVyYVxyXG4gICAgZGVzaXJlZENhbVk6IG51bWJlciA9IDA7IC8vIGRlc2lyZWQgcG9zaXRpb24gb2YgdGhlIGNhbWVyYVxyXG4gICAgc2NyZWVuc2hha2VBbW91bnQ6IG51bWJlciA9IDA7IC8vIGFtb3VudCBvZiBzY3JlZW5zaGFrZSBoYXBwZW5pbmcgYXQgdGhlIGN1cnJlbnQgbW9tZW50XHJcblxyXG4gICAgLy8gdGljayBtYW5hZ2VtZW50XHJcbiAgICBtc1NpbmNlVGljazogbnVtYmVyID0gMDsgLy8gdGhpcyBpcyB0aGUgcnVubmluZyBjb3VudGVyIG9mIGhvdyBtYW55IG1pbGxpc2Vjb25kcyBpdCBoYXMgYmVlbiBzaW5jZSB0aGUgbGFzdCB0aWNrLiAgVGhlIGdhbWUgY2FuIHRoZW5cclxuICAgIG1zUGVyVGljazogbnVtYmVyID0gMjA7IC8vIHRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHBlciBnYW1lIHRpY2suICAxMDAwL21zUGVyVGljayA9IHRpY2tzIHBlciBzZWNvbmRcclxuICAgIGFtb3VudFNpbmNlTGFzdFRpY2s6IG51bWJlciA9IDA7IC8vIHRoaXMgaXMgYSB2YXJpYWJsZSBjYWxjdWxhdGVkIGV2ZXJ5IGZyYW1lIHVzZWQgZm9yIGludGVycG9sYXRpb24gLSBkb21haW5bMCwxKVxyXG4gICAgZm9yZ2l2ZW5lc3NDb3VudDogbnVtYmVyID0gNTA7IC8vIGlmIHRoZSBjb21wdXRlciBuZWVkcyB0byBkbyBtb3JlIHRoYW4gNTAgdGlja3MgaW4gYSBzaW5nbGUgZnJhbWUsIHRoZW4gaXQgY291bGQgYmUgcnVubmluZyBiZWhpbmQsIHByb2JhYmx5IGJlY2F1c2Ugb2YgYSBmcmVlemUgb3IgdGhlIHVzZXIgYmVpbmcgb24gYSBkaWZmZXJlbnQgdGFiLiAgSW4gdGhlc2UgY2FzZXMsIGl0J3MgcHJvYmFibHkgYmVzdCB0byBqdXN0IGlnbm9yZSB0aGF0IGFueSB0aW1lIGhhcyBwYXNzZWQgdG8gYXZvaWQgZnVydGhlciBmcmVlemluZ1xyXG5cclxuICAgIC8vIHBoeXNpY3MgY29uc3RhbnRzXHJcbiAgICBHUkFWSVRZX1NQRUVEOiBudW1iZXIgPSAwLjA0OyAvLyBpbiB1bml0cyBwZXIgc2Vjb25kIHRpY2ssIHBvc2l0aXZlIG1lYW5zIGRvd253YXJkIGdyYXZpdHksIG5lZ2F0aXZlIG1lYW5zIHVwd2FyZCBncmF2aXR5XHJcbiAgICBEUkFHX0NPRUZGSUNJRU5UOiBudW1iZXIgPSAwLjIxOyAvLyBhcmJpdHJhcnkgbnVtYmVyLCAwIG1lYW5zIG5vIGRyYWdcclxuXHJcbiAgICAvLyBDSEFSQUNURVIgU0hPVUxEIEJFIFJPVUdITFkgMTIgUElYRUxTIEJZIDIwIFBJWEVMU1xyXG5cclxuICAgIGhvdEJhcjogSXRlbVN0YWNrW10gPSBuZXcgQXJyYXkoOSk7XHJcbiAgICBzZWxlY3RlZFNsb3QgPSAwO1xyXG4gICAgcGlja2VkVXBTbG90ID0gLTE7XHJcblxyXG4gICAgd29ybGRNb3VzZVggPSAwOyAvLyB0aGUgbW91c2UgcG9zaXRpb24gaW4gd29ybGQgY29vcmRpbmF0ZXNcclxuICAgIHdvcmxkTW91c2VZID0gMDsgLy8gdGhlIG1vdXNlIHBvc2l0aW9uIGluIHdvcmxkIGNvb3JkaW5hdGVzXHJcbiAgICBtb3VzZU9uID0gdHJ1ZTsgLy8gaXMgdGhlIG1vdXNlIG9uIHRoZSB3aW5kb3c/XHJcblxyXG4gICAga2V5czogYm9vbGVhbltdID0gW107XHJcblxyXG4gICAgLy8gdGhlIGtleWNvZGUgZm9yIHRoZSBrZXkgdGhhdCBkb2VzIHRoZSBhY3Rpb25cclxuICAgIGNvbnRyb2xzOiBDb250cm9sW10gPSBbXHJcbiAgICAgICAgbmV3IENvbnRyb2woXCJXYWxrIFJpZ2h0XCIsIHRydWUsIDY4LCAoKT0+e1xyXG4gICAgICAgICAgICBpZih0aGlzLmN1cnJlbnRVaSE9PXVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy53b3JsZC5wbGF5ZXIucmlnaHRCdXR0b24gPSB0cnVlO1xyXG4gICAgICAgIH0sICgpPT57XHJcbiAgICAgICAgICAgIGlmKHRoaXMuY3VycmVudFVpIT09dW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLndvcmxkLnBsYXllci5yaWdodEJ1dHRvbiA9IGZhbHNlO1xyXG4gICAgICAgIH0pLC8vIHJpZ2h0XHJcbiAgICAgICAgbmV3IENvbnRyb2woXCJXYWxrIExlZnRcIiwgdHJ1ZSwgNjUsICgpPT57XHJcbiAgICAgICAgICAgIGlmKHRoaXMuY3VycmVudFVpIT09dW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLndvcmxkLnBsYXllci5sZWZ0QnV0dG9uID0gdHJ1ZTtcclxuICAgICAgICB9LCAoKT0+e1xyXG4gICAgICAgICAgICBpZih0aGlzLmN1cnJlbnRVaSE9PXVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy53b3JsZC5wbGF5ZXIubGVmdEJ1dHRvbiA9IGZhbHNlO1xyXG4gICAgICAgIH0pLC8vIGxlZnRcclxuICAgICAgICBuZXcgQ29udHJvbChcIkp1bXBcIiwgdHJ1ZSwgODcsICgpPT57XHJcbiAgICAgICAgICAgIGlmKHRoaXMuY3VycmVudFVpIT09dW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLndvcmxkLnBsYXllci5qdW1wQnV0dG9uID0gdHJ1ZTtcclxuICAgICAgICB9LCAoKT0+e1xyXG4gICAgICAgICAgICBpZih0aGlzLmN1cnJlbnRVaSE9PXVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy53b3JsZC5wbGF5ZXIuanVtcEJ1dHRvbiA9IGZhbHNlO1xyXG4gICAgICAgIH0pLC8vIGp1bXBcclxuICAgICAgICBuZXcgQ29udHJvbChcIlBhdXNlXCIsIHRydWUsIDI3LCAoKT0+e1xyXG4gICAgICAgICAgICAvL2lmIGludmVudG9yeSBvcGVue1xyXG4gICAgICAgICAgICAvL2Nsb3NlIGludmVudG9yeVxyXG4gICAgICAgICAgICAvL3JldHVybjt9XHJcbiAgICAgICAgICAgIGlmKHRoaXMuY3VycmVudFVpPT09dW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50VWkgPSBuZXcgUGF1c2VNZW51KEZvbnRzLnRpdGxlKTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50VWkgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgfSksLy8gc2V0dGluZ3NcclxuICAgICAgICBuZXcgQ29udHJvbChcIkludmVudG9yeVwiLCB0cnVlLCA2OSwgKCk9PntcclxuICAgICAgICAgICAgLy9pZiB1aSBvcGVuIHJldHVybjtcclxuICAgICAgICAgICAgLy9pZiBpbnZlbnRvcnkgY2xvc2VkIG9wZW4gaW52ZW50b3J5XHJcbiAgICAgICAgICAgIC8vZWxzZSBjbG9zZSBpbnZlbnRvcnlcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJpbnZlbnRvcnkgaGFzIG5vdCBiZWVuIGltcGxlbWVudGVkIHlldFwiKTtcclxuICAgICAgICB9KSwvLyBpbnZlbnRvcnlcclxuICAgICAgICBuZXcgQ29udHJvbChcIkhvdGJhciAxXCIsIHRydWUsIDQ5LCAoKT0+e1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkU2xvdCA9IDA7XHJcbiAgICAgICAgfSksLy8gaG90IGJhciAxXHJcbiAgICAgICAgbmV3IENvbnRyb2woXCJIb3RiYXIgMlwiLCB0cnVlLCA0OSwgKCk9PntcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZFNsb3QgPSAxO1xyXG4gICAgICAgIH0pLC8vIGhvdCBiYXIgMlxyXG4gICAgICAgIG5ldyBDb250cm9sKFwiSG90YmFyIDNcIiwgdHJ1ZSwgNDksICgpPT57XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRTbG90ID0gMjtcclxuICAgICAgICB9KSwvLyBob3QgYmFyIDNcclxuICAgICAgICBuZXcgQ29udHJvbChcIkhvdGJhciA0XCIsIHRydWUsIDQ5LCAoKT0+e1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkU2xvdCA9IDM7XHJcbiAgICAgICAgfSksLy8gaG90IGJhciA0XHJcbiAgICAgICAgbmV3IENvbnRyb2woXCJIb3RiYXIgNVwiLCB0cnVlLCA0OSwgKCk9PntcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZFNsb3QgPSA0O1xyXG4gICAgICAgIH0pLC8vIGhvdCBiYXIgNVxyXG4gICAgICAgIG5ldyBDb250cm9sKFwiSG90YmFyIDZcIiwgdHJ1ZSwgNDksICgpPT57XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRTbG90ID0gNTtcclxuICAgICAgICB9KSwvLyBob3QgYmFyIDZcclxuICAgICAgICBuZXcgQ29udHJvbChcIkhvdGJhciA3XCIsIHRydWUsIDQ5LCAoKT0+e1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkU2xvdCA9IDY7XHJcbiAgICAgICAgfSksLy8gaG90IGJhciA3XHJcbiAgICAgICAgbmV3IENvbnRyb2woXCJIb3RiYXIgOFwiLCB0cnVlLCA0OSwgKCk9PntcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZFNsb3QgPSA3O1xyXG4gICAgICAgIH0pLC8vIGhvdCBiYXIgOFxyXG4gICAgICAgIG5ldyBDb250cm9sKFwiSG90YmFyIDlcIiwgdHJ1ZSwgNDksICgpPT57XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRTbG90ID0gODtcclxuICAgICAgICB9KSwvLyBob3QgYmFyIDlcclxuICAgIF07XHJcblxyXG4gICAgY2FudmFzOiBwNS5SZW5kZXJlcjsvL3RoZSBjYW52YXMgZm9yIHRoZSBnYW1lXHJcbiAgICBza3lMYXllcjogcDUuR3JhcGhpY3M7Ly9hIHA1LkdyYXBoaWNzIG9iamVjdCB0aGF0IHRoZSBzaGFkZXIgaXMgZHJhd24gb250by4gIHRoaXMgaXNuJ3QgdGhlIGJlc3Qgd2F5IHRvIGRvIHRoaXMsIGJ1dCB0aGUgbWFpbiBnYW1lIGNhbnZhcyBpc24ndCBXRUJHTCwgYW5kIGl0J3MgdG9vIG11Y2ggd29yayB0byBjaGFuZ2UgdGhhdFxyXG4gICAgc2t5U2hhZGVyOiBwNS5TaGFkZXI7Ly90aGUgc2hhZGVyIHRoYXQgZHJhd3MgdGhlIHNreSAodGhlIHBhdGggZm9yIHRoaXMgaXMgaW4gdGhlIHB1YmxpYyBmb2xkZXIpXHJcblxyXG4gICAgd29ybGQ6IFdvcmxkO1xyXG5cclxuICAgIGN1cnJlbnRVaTogVWlTY3JlZW4gfCB1bmRlZmluZWQ7XHJcblxyXG4gICAgY29ubmVjdGlvbjogU29ja2V0PFNlcnZlckV2ZW50cywgQ2xpZW50RXZlbnRzPlxyXG5cclxuICAgIG5ldE1hbmFnZXI6IE5ldE1hbmFnZXJcclxuXHJcbiAgICAvL2NoYW5nZWFibGUgb3B0aW9ucyBmcm9tIG1lbnVzXHJcbiAgICBzZXJ2ZXJWaXNpYmlsaXR5OiBzdHJpbmc7XHJcbiAgICB3b3JsZEJ1bXBpbmVzczogbnVtYmVyO1xyXG4gICAgc2t5TW9kOiBudW1iZXI7XHJcbiAgICBza3lUb2dnbGU6IGJvb2xlYW47XHJcbiAgICBwYXJ0aWNsZU11bHRpcGxpZXI6IG51bWJlcjtcclxuXHJcbiAgICBwYXJ0aWNsZXM6IChDb2xvclBhcnRpY2xlLyp8Rm9vdHN0ZXBQYXJ0aWNsZSovKVtdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGNvbm5lY3Rpb246IFNvY2tldCkge1xyXG4gICAgICAgIHN1cGVyKCgpID0+IHt9KTsgLy8gVG8gY3JlYXRlIGEgbmV3IGluc3RhbmNlIG9mIHA1IGl0IHdpbGwgY2FsbCBiYWNrIHdpdGggdGhlIGluc3RhbmNlLiBXZSBkb24ndCBuZWVkIHRoaXMgc2luY2Ugd2UgYXJlIGV4dGVuZGluZyB0aGUgY2xhc3NcclxuICAgICAgICB0aGlzLmNvbm5lY3Rpb24gPSBjb25uZWN0aW9uO1xyXG5cclxuICAgICAgICAvLyBJbml0aWFsaXNlIHRoZSBuZXR3b3JrIG1hbmFnZXJcclxuICAgICAgICB0aGlzLm5ldE1hbmFnZXIgPSBuZXcgTmV0TWFuYWdlcih0aGlzKVxyXG4gICAgfVxyXG5cclxuICAgIHByZWxvYWQoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ0xvYWRpbmcgYXNzZXRzJyk7XHJcbiAgICAgICAgbG9hZEFzc2V0cyh0aGlzLCBVaUFzc2V0cywgSXRlbXNBc3NldHMsIFdvcmxkQXNzZXRzLCBGb250cywgQXVkaW9Bc3NldHMsIFBsYXllckFuaW1hdGlvbnMpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdBc3NldCBsb2FkaW5nIGNvbXBsZXRlZCcpO1xyXG4gICAgICAgIHRoaXMuc2t5U2hhZGVyID0gdGhpcy5sb2FkU2hhZGVyKFwiYXNzZXRzL3NoYWRlcnMvYmFzaWMudmVydFwiLCBcImFzc2V0cy9zaGFkZXJzL3NreS5mcmFnXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldHVwKCkge1xyXG4gICAgICAgIC8vIG1ha2UgYSBjYW52YXMgdGhhdCBmaWxscyB0aGUgd2hvbGUgc2NyZWVuIChhIGNhbnZhcyBpcyB3aGF0IGlzIGRyYXduIHRvIGluIHA1LmpzLCBhcyB3ZWxsIGFzIGxvdHMgb2Ygb3RoZXIgSlMgcmVuZGVyaW5nIGxpYnJhcmllcylcclxuICAgICAgICB0aGlzLmNhbnZhcyA9IHRoaXMuY3JlYXRlQ2FudmFzKHRoaXMud2luZG93V2lkdGgsIHRoaXMud2luZG93SGVpZ2h0KTtcclxuICAgICAgICB0aGlzLmNhbnZhcy5tb3VzZU91dCh0aGlzLm1vdXNlRXhpdGVkKTtcclxuICAgICAgICB0aGlzLmNhbnZhcy5tb3VzZU92ZXIodGhpcy5tb3VzZUVudGVyZWQpO1xyXG5cclxuICAgICAgICB0aGlzLnNreUxheWVyID0gdGhpcy5jcmVhdGVHcmFwaGljcyh0aGlzLndpZHRoLCB0aGlzLmhlaWdodCwgXCJ3ZWJnbFwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5jdXJyZW50VWkgPSBuZXcgTWFpbk1lbnUoRm9udHMudGl0bGUpO1xyXG5cclxuICAgICAgICAvLyBUaWNrXHJcbiAgICAgICAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy53b3JsZCA9PT0gdW5kZWZpbmVkKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMud29ybGQudGljayh0aGlzKTtcclxuICAgICAgICB9LCAxMDAwIC8gdGhpcy5uZXRNYW5hZ2VyLnBsYXllclRpY2tSYXRlKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmNvbm5lY3Rpb24uZW1pdChcclxuICAgICAgICAgICAgJ2pvaW4nLFxyXG4gICAgICAgICAgICAnZTQwMjJkNDAzZGNjNmQxOWQ2YTY4YmEzYWJmZDBhNjAnLFxyXG4gICAgICAgICAgICAncGxheWVyJyArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMDApXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgLy8gZ28gZm9yIGEgc2NhbGUgb2YgPDY0IHRpbGVzIHdpZGUgc2NyZWVuXHJcbiAgICAgICAgdGhpcy53aW5kb3dSZXNpemVkKCk7XHJcblxyXG4gICAgICAgIC8vIHJlbW92ZSB0ZXh0dXJlIGludGVycG9sYXRpb24gKGVuYWJsZSBwb2ludCBmaWx0ZXJpbmcgZm9yIGltYWdlcylcclxuICAgICAgICB0aGlzLm5vU21vb3RoKCk7XHJcblxyXG4gICAgICAgIC8vIHRoZSBoaWdoZXN0IGtleWNvZGUgaXMgMjU1LCB3aGljaCBpcyBcIlRvZ2dsZSBUb3VjaHBhZFwiLCBhY2NvcmRpbmcgdG8ga2V5Y29kZS5pbmZvXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAyNTU7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmtleXMucHVzaChmYWxzZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBzZXQgdGhlIGZyYW1lcmF0ZSBnb2FsIHRvIGFzIGhpZ2ggYXMgcG9zc2libGUgKHRoaXMgd2lsbCBlbmQgdXAgY2FwcGluZyB0byB5b3VyIG1vbml0b3IncyByZWZyZXNoIHJhdGUgd2l0aCB2c3luYy4pXHJcbiAgICAgICAgdGhpcy5mcmFtZVJhdGUoSW5maW5pdHkpO1xyXG4gICAgICAgIEF1ZGlvQXNzZXRzLmFtYmllbnQud2ludGVyMS5wbGF5U291bmQoKTtcclxuICAgICAgICB0aGlzLnBhcnRpY2xlTXVsdGlwbGllciA9IDE7XHJcbiAgICAgICAgdGhpcy5za3lUb2dnbGUgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuc2t5TW9kID0gMjtcclxuICAgICAgICB0aGlzLnBhcnRpY2xlcyA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIGRyYXcoKSB7XHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaTw0MCp0aGlzLnBhcnRpY2xlTXVsdGlwbGllcjsgaSsrKSB7XHJcbiAgICAgICAgICAgIC8vdGhpcy5wYXJ0aWNsZXMucHVzaChuZXcgQ29sb3JQYXJ0aWNsZShcIiNlYjU4MzRcIiwgMS80LCAxMCwgdGhpcy53b3JsZE1vdXNlWCtNYXRoLnJhbmRvbSgpLCB0aGlzLndvcmxkTW91c2VZK01hdGgucmFuZG9tKCksIE1hdGgucmFuZG9tKCktMC41LCBNYXRoLnJhbmRvbSgpLzQtMC41LCBmYWxzZSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5mcmFtZUNvdW50PT09Mikge1xyXG4gICAgICAgICAgICB0aGlzLnNreVNoYWRlci5zZXRVbmlmb3JtKFwic2NyZWVuRGltZW5zaW9uc1wiLCBbdGhpcy53aWR0aC90aGlzLnVwc2NhbGVTaXplLCB0aGlzLmhlaWdodC90aGlzLnVwc2NhbGVTaXplXSk7XHJcbiAgICAgICAgICAgIHRoaXMuc2t5U2hhZGVyLnNldFVuaWZvcm0oXCJza3lJbWFnZVwiLCBXb3JsZEFzc2V0cy5zaGFkZXJSZXNvdXJjZXMuc2t5SW1hZ2UuaW1hZ2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBkbyB0aGUgdGljayBjYWxjdWxhdGlvbnNcclxuICAgICAgICB0aGlzLmRvVGlja3MoKTtcclxuXHJcblxyXG4gICAgICAgIC8vIHVwZGF0ZSBtb3VzZSBwb3NpdGlvblxyXG4gICAgICAgIHRoaXMudXBkYXRlTW91c2UoKTtcclxuXHJcbiAgICAgICAgLy8gdXBkYXRlIHRoZSBjYW1lcmEncyBpbnRlcnBvbGF0aW9uXHJcbiAgICAgICAgdGhpcy5tb3ZlQ2FtZXJhKCk7XHJcblxyXG4gICAgICAgIC8vIHdpcGUgdGhlIHNjcmVlbiB3aXRoIGEgaGFwcHkgbGl0dGxlIGxheWVyIG9mIGxpZ2h0IGJsdWVcclxuICAgICAgICB0aGlzLnNreVNoYWRlci5zZXRVbmlmb3JtKFwib2Zmc2V0Q29vcmRzXCIsIFt0aGlzLmludGVycG9sYXRlZENhbVgsIHRoaXMuaW50ZXJwb2xhdGVkQ2FtWV0pO1xyXG5cdCAgICB0aGlzLnNreVNoYWRlci5zZXRVbmlmb3JtKFwibWlsbGlzXCIsIHRoaXMubWlsbGlzKCkpO1xyXG4gICAgICAgIHRoaXMuc2t5TGF5ZXIuc2hhZGVyKHRoaXMuc2t5U2hhZGVyKTtcclxuICAgICAgICAvLyB0aGlzLmZpbGwoMjU1LCAwLCAwKTtcclxuICAgICAgICB0aGlzLnNreUxheWVyLnJlY3QoMCwgMCwgdGhpcy5za3lMYXllci53aWR0aCwgdGhpcy5za3lMYXllci5oZWlnaHQpO1xyXG5cclxuICAgICAgICB0aGlzLmltYWdlKHRoaXMuc2t5TGF5ZXIsIDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMud29ybGQgIT09IHVuZGVmaW5lZCkgdGhpcy53b3JsZC5yZW5kZXIodGhpcywgdGhpcy51cHNjYWxlU2l6ZSk7XHJcblxyXG4gICAgICAgIC8vIHJlbmRlciB0aGUgcGxheWVyLCBhbGwgaXRlbXMsIGV0Yy4gIEJhc2ljYWxseSBhbnkgcGh5c2ljc1JlY3Qgb3IgcGFydGljbGVcclxuICAgICAgICB0aGlzLnJlbmRlckVudGl0aWVzKCk7XHJcblxyXG4gICAgICAgIC8vZGVsZXRlIGFueSBwYXJ0aWNsZXMgdGhhdCBoYXZlIGdvdHRlbiB0b28gb2xkXHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaTx0aGlzLnBhcnRpY2xlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZXNbaV0uYWdlPnRoaXMucGFydGljbGVzW2ldLmxpZmVzcGFuKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBhcnRpY2xlcy5zcGxpY2UoaSwgMSlcclxuICAgICAgICAgICAgICAgIGktLTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9ubyBvdXRsaW5lIG9uIHBhcnRpY2xlc1xyXG4gICAgICAgIHRoaXMubm9TdHJva2UoKTtcclxuICAgICAgICAvL2RyYXcgYWxsIG9mIHRoZSBwYXJ0aWNsZXNcclxuICAgICAgICBmb3IobGV0IHBhcnRpY2xlIG9mIHRoaXMucGFydGljbGVzKSB7XHJcbiAgICAgICAgICAgIHBhcnRpY2xlLnJlbmRlcih0aGlzLCB0aGlzLnVwc2NhbGVTaXplKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuc21vb3RoKCk7Ly9lbmFibGUgaW1hZ2UgbGVycFxyXG4gICAgICAgIHRoaXMudGludCgyNTUsIDEwMCk7Ly9tYWtlIGltYWdlIHRyYW5zbHVjZW50XHJcbiAgICAgICAgVWlBc3NldHMudmlnbmV0dGUucmVuZGVyKHRoaXMsIDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcclxuICAgICAgICB0aGlzLm5vVGludCgpO1xyXG4gICAgICAgIHRoaXMubm9TbW9vdGgoKTtcclxuXHJcbiAgICAgICAgLy8gZHJhdyB0aGUgaG90IGJhclxyXG4gICAgICAgIHRoaXMubm9TdHJva2UoKTtcclxuICAgICAgICB0aGlzLnRleHRBbGlnbih0aGlzLlJJR0hULCB0aGlzLkJPVFRPTSk7XHJcbiAgICAgICAgdGhpcy50ZXh0U2l6ZSg1ICogdGhpcy51cHNjYWxlU2l6ZSk7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmhvdEJhci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zZWxlY3RlZFNsb3QgPT09IGkpIHtcclxuICAgICAgICAgICAgICAgIFVpQXNzZXRzLnVpX3Nsb3Rfc2VsZWN0ZWQucmVuZGVyKFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMsXHJcbiAgICAgICAgICAgICAgICAgICAgMiAqIHRoaXMudXBzY2FsZVNpemUgKyAxNiAqIGkgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICAgICAgICAgIDIgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICAgICAgICAgIDE2ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICAxNiAqIHRoaXMudXBzY2FsZVNpemVcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBVaUFzc2V0cy51aV9zbG90LnJlbmRlcihcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLFxyXG4gICAgICAgICAgICAgICAgICAgIDIgKiB0aGlzLnVwc2NhbGVTaXplICsgMTYgKiBpICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICAyICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICAxNiAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgICAgICAgICAgMTYgKiB0aGlzLnVwc2NhbGVTaXplXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5ob3RCYXJbaV0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5maWxsKDApO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucGlja2VkVXBTbG90ID09PSBpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50aW50KDI1NSwgMTI3KTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZpbGwoMCwgMTI3KTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmhvdEJhcltpXS50ZXh0dXJlLnJlbmRlcihcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLFxyXG4gICAgICAgICAgICAgICAgICAgIDYgKiB0aGlzLnVwc2NhbGVTaXplICsgMTYgKiBpICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICA2ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICA4ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICA4ICogdGhpcy51cHNjYWxlU2l6ZVxyXG4gICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnRleHQoXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ob3RCYXJbaV0uc3RhY2tTaXplLFxyXG4gICAgICAgICAgICAgICAgICAgIDE2ICogdGhpcy51cHNjYWxlU2l6ZSArIDE2ICogaSAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgICAgICAgICAgMTYgKiB0aGlzLnVwc2NhbGVTaXplXHJcbiAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMubm9UaW50KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGRyYXcgdGhlIGN1cnNvclxyXG4gICAgICAgIHRoaXMuZHJhd0N1cnNvcigpO1xyXG5cclxuXHJcbiAgICAgICAgaWYodGhpcy5jdXJyZW50VWkgIT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50VWkucmVuZGVyKHRoaXMsIHRoaXMudXBzY2FsZVNpemUpO1xyXG5cclxuICAgICAgICAvLyBjb25zb2xlLnRpbWVFbmQoXCJmcmFtZVwiKTtcclxuICAgIH1cclxuXHJcbiAgICB3aW5kb3dSZXNpemVkKCkge1xyXG4gICAgICAgIHRoaXMucmVzaXplQ2FudmFzKHRoaXMud2luZG93V2lkdGgsIHRoaXMud2luZG93SGVpZ2h0KTtcclxuICAgICAgICB0aGlzLnNreUxheWVyLnJlc2l6ZUNhbnZhcyh0aGlzLndpbmRvd1dpZHRoLCB0aGlzLndpbmRvd0hlaWdodCk7XHJcbiAgICAgICAgdGhpcy5za3lTaGFkZXIuc2V0VW5pZm9ybShcInNjcmVlbkRpbWVuc2lvbnNcIiwgW3RoaXMud2luZG93V2lkdGgvdGhpcy51cHNjYWxlU2l6ZSoyLCB0aGlzLndpbmRvd0hlaWdodC90aGlzLnVwc2NhbGVTaXplKjJdKTtcclxuXHJcbiAgICAgICAgLy8gZ28gZm9yIGEgc2NhbGUgb2YgPDQ4IHRpbGVzIHNjcmVlblxyXG4gICAgICAgIHRoaXMudXBzY2FsZVNpemUgPSBNYXRoLm1pbihcclxuICAgICAgICAgICAgTWF0aC5jZWlsKHRoaXMud2luZG93V2lkdGggLyA0OCAvIHRoaXMuVElMRV9XSURUSCksXHJcbiAgICAgICAgICAgIE1hdGguY2VpbCh0aGlzLndpbmRvd0hlaWdodCAvIDQ4IC8gdGhpcy5USUxFX0hFSUdIVClcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICB0aGlzLmN1cnJlbnRVaS53aW5kb3dVcGRhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBrZXlQcmVzc2VkKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5rZXlzW3RoaXMua2V5Q29kZV0gPSB0cnVlO1xyXG4gICAgICAgIGZvcihsZXQgY29udHJvbCBvZiB0aGlzLmNvbnRyb2xzKSB7XHJcbiAgICAgICAgICAgIGlmKGNvbnRyb2wua2V5Ym9hcmQgJiYgY29udHJvbC5rZXlDb2RlPT09ZXZlbnQua2V5Q29kZSkvL2V2ZW50LmtleUNvZGUgaXMgZGVwcmVjYXRlZCBidXQgaSBkb24ndCBjYXJlXHJcbiAgICAgICAgICAgICAgICBjb250cm9sLm9uUHJlc3NlZCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLmN1cnJlbnRVaSE9PXVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBmb3IobGV0IGkgb2YgdGhpcy5jdXJyZW50VWkuaW5wdXRCb3hlcykge1xyXG4gICAgICAgICAgICAgICAgaWYoaS5saXN0ZW5pbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInRlc3QzXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGkubGlzdGVuaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250cm9sc1tpLmluZGV4XS5rZXlDb2RlID0gZXZlbnQua2V5Q29kZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRyb2xzW2kuaW5kZXhdLmtleWJvYXJkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgaS52YWx1ZSA9IGV2ZW50LmtleUNvZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgaS5rZXlib2FyZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgaS5pbWFnZSA9IFVpQXNzZXRzLmJ1dHRvbl91bnNlbGVjdGVkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGtleVJlbGVhc2VkKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5rZXlzW3RoaXMua2V5Q29kZV0gPSBmYWxzZTtcclxuICAgICAgICBmb3IobGV0IGNvbnRyb2wgb2YgdGhpcy5jb250cm9scykge1xyXG4gICAgICAgICAgICBpZihjb250cm9sLmtleWJvYXJkICYmIGNvbnRyb2wua2V5Q29kZT09PWV2ZW50LmtleUNvZGUpLy9ldmVudC5rZXlDb2RlIGlzIGRlcHJlY2F0ZWQgYnV0IGkgZG9uJ3QgY2FyZVxyXG4gICAgICAgICAgICAgICAgY29udHJvbC5vblJlbGVhc2VkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIHdoZW4gaXQncyBkcmFnZ2VkIHVwZGF0ZSB0aGUgc2xpZGVyc1xyXG4gICAgbW91c2VEcmFnZ2VkKCkge1xyXG4gICAgICAgIGlmKHRoaXMuY3VycmVudFVpICE9PSB1bmRlZmluZWQgJiYgdGhpcy5jdXJyZW50VWkuc2xpZGVycyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGZvcihjb25zdCBpIG9mIHRoaXMuY3VycmVudFVpLnNsaWRlcnMpIHtcclxuICAgICAgICAgICAgICAgIGkudXBkYXRlU2xpZGVyUG9zaXRpb24odGhpcy5tb3VzZVgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG1vdXNlTW92ZWQoKSB7XHJcbiAgICAgICAgaWYodGhpcy5jdXJyZW50VWkgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBpZih0aGlzLmN1cnJlbnRVaS5idXR0b25zIT09dW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IoY29uc3QgaSBvZiB0aGlzLmN1cnJlbnRVaS5idXR0b25zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaS51cGRhdGVNb3VzZU92ZXIodGhpcy5tb3VzZVgsIHRoaXMubW91c2VZKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZih0aGlzLmN1cnJlbnRVaS5pbnB1dEJveGVzIT09dW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IoY29uc3QgaSBvZiB0aGlzLmN1cnJlbnRVaS5pbnB1dEJveGVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaS51cGRhdGVNb3VzZU92ZXIodGhpcy5tb3VzZVgsIHRoaXMubW91c2VZKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBtb3VzZVByZXNzZWQoZTogTW91c2VFdmVudCkge1xyXG4gICAgICAgIC8vIGltYWdlKHVpU2xvdEltYWdlLCAyKnVwc2NhbGVTaXplKzE2KmkqdXBzY2FsZVNpemUsIDIqdXBzY2FsZVNpemUsIDE2KnVwc2NhbGVTaXplLCAxNip1cHNjYWxlU2l6ZSk7XHJcbiAgICAgICAgaWYodGhpcy5jdXJyZW50VWkgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRVaS5tb3VzZVByZXNzZWQoZS5idXR0b24pO1xyXG4gICAgICAgICAgICByZXR1cm47Ly8gYXNqZ3NhZGtqZmdJSVNVU1VFVUVcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICB0aGlzLm1vdXNlWCA+IDIgKiB0aGlzLnVwc2NhbGVTaXplICYmXHJcbiAgICAgICAgICAgIHRoaXMubW91c2VYIDxcclxuICAgICAgICAgICAgICAgIDIgKiB0aGlzLnVwc2NhbGVTaXplICtcclxuICAgICAgICAgICAgICAgICAgICAxNiAqIHRoaXMudXBzY2FsZVNpemUgKiB0aGlzLmhvdEJhci5sZW5ndGggJiZcclxuICAgICAgICAgICAgdGhpcy5tb3VzZVkgPiAyICogdGhpcy51cHNjYWxlU2l6ZSAmJlxyXG4gICAgICAgICAgICB0aGlzLm1vdXNlWSA8IDE4ICogdGhpcy51cHNjYWxlU2l6ZVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICBjb25zdCBjbGlja2VkU2xvdDogbnVtYmVyID0gTWF0aC5mbG9vcihcclxuICAgICAgICAgICAgICAgICh0aGlzLm1vdXNlWCAtIDIgKiB0aGlzLnVwc2NhbGVTaXplKSAvIDE2IC8gdGhpcy51cHNjYWxlU2l6ZVxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMucGlja2VkVXBTbG90ID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaG90QmFyW2NsaWNrZWRTbG90XSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5waWNrZWRVcFNsb3QgPSBjbGlja2VkU2xvdDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIFN3YXAgY2xpY2tlZCBzbG90IHdpdGggdGhlIHBpY2tlZCBzbG90XHJcbiAgICAgICAgICAgICAgICBbdGhpcy5ob3RCYXJbdGhpcy5waWNrZWRVcFNsb3RdLCB0aGlzLmhvdEJhcltjbGlja2VkU2xvdF1dID0gW1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaG90QmFyW2NsaWNrZWRTbG90XSxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhvdEJhclt0aGlzLnBpY2tlZFVwU2xvdF0sXHJcbiAgICAgICAgICAgICAgICBdO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFNldCB0aGUgcGlja2VkIHVwIHNsb3QgdG8gbm90aGluZ1xyXG4gICAgICAgICAgICAgICAgdGhpcy5waWNrZWRVcFNsb3QgPSAtMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIElmIHRoZSB0aWxlcyBpcyBhaXJcclxuICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgdGhpcy53b3JsZC53b3JsZFRpbGVzW1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMud29ybGQud2lkdGggKiB0aGlzLndvcmxkTW91c2VZICsgdGhpcy53b3JsZE1vdXNlWFxyXG4gICAgICAgICAgICAgICAgXSA9PT0gMFxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBmb3IobGV0IGkgPSAwOyBpPDEwKnRoaXMucGFydGljbGVNdWx0aXBsaWVyOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBpZHg6IG51bWJlciA9IHRoaXMud29ybGQud2lkdGggKiB0aGlzLndvcmxkTW91c2VZICsgdGhpcy53b3JsZE1vdXNlWDtcclxuICAgICAgICAgICAgICAgIGxldCB0aWxlOiBUaWxlVHlwZSA9IHRoaXMud29ybGQud29ybGRUaWxlc1tpZHhdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wYXJ0aWNsZXMucHVzaChuZXcgQ29sb3JQYXJ0aWNsZShXb3JsZFRpbGVzW3RpbGVdLmNvbG9yLCAxLzQqTWF0aC5yYW5kb20oKSwgMTUsIHRoaXMud29ybGRNb3VzZVgrMC41LCB0aGlzLndvcmxkTW91c2VZKzAuNSwgKE1hdGgucmFuZG9tKCktMC41KS81LCAtTWF0aC5yYW5kb20oKS81LCB0cnVlKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5jb25uZWN0aW9uLmVtaXQoXHJcbiAgICAgICAgICAgICAgICAnd29ybGRCcmVha1N0YXJ0JyxcclxuICAgICAgICAgICAgICAgIHRoaXMud29ybGQud2lkdGggKiB0aGlzLndvcmxkTW91c2VZICsgdGhpcy53b3JsZE1vdXNlWFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB0aGlzLmNvbm5lY3Rpb24uZW1pdCgnd29ybGRCcmVha0ZpbmlzaCcpO1xyXG4gICAgICAgICAgICB0aGlzLnNjcmVlbnNoYWtlQW1vdW50ID0gMC41O1xyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICBjb25zdCB0aWxlczogVGlsZSA9XHJcbiAgICAgICAgICAgICAgICBXb3JsZFRpbGVzW1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMud29ybGQud29ybGRUaWxlc1tcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5XT1JMRF9XSURUSCAqIHRoaXMud29ybGRNb3VzZVkgKyB0aGlzLndvcmxkTW91c2VYXHJcbiAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgXTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aWxlcyA9PT0gdW5kZWZpbmVkKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBpZiAodGlsZXMuaXRlbURyb3AgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgLy8gRGVmYXVsdCBkcm9wIHF1YW50aXR5XHJcbiAgICAgICAgICAgICAgICBsZXQgcXVhbnRpdHk6IG51bWJlciA9IDE7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gVXBkYXRlIHRoZSBxdWFudGl0eSBiYXNlZCBvblxyXG4gICAgICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgICAgIHRpbGVzLml0ZW1Ecm9wTWF4ICE9PSB1bmRlZmluZWQgJiZcclxuICAgICAgICAgICAgICAgICAgICB0aWxlcy5pdGVtRHJvcE1pbiAhPT0gdW5kZWZpbmVkXHJcbiAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICBxdWFudGl0eSA9IE1hdGgucm91bmQoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIE1hdGgucmFuZG9tKCkgKiAodGlsZXMuaXRlbURyb3BNYXggLSB0aWxlcy5pdGVtRHJvcE1pbikgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlsZXMuaXRlbURyb3BNaW5cclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aWxlcy5pdGVtRHJvcE1heCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcXVhbnRpdHkgPSB0aWxlcy5pdGVtRHJvcE1heDtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRyb3BJdGVtU3RhY2soXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IEl0ZW1TdGFjayh0aWxlcy5pdGVtRHJvcCwgcXVhbnRpdHkpLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMud29ybGRNb3VzZVgsXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53b3JsZE1vdXNlWVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcblxyXG4gICAgICAgICAgICAqL1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBtb3VzZVJlbGVhc2VkKCkge1xyXG4gICAgICAgIGlmKHRoaXMuY3VycmVudFVpICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50VWkubW91c2VSZWxlYXNlZCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCByZWxlYXNlZFNsb3Q6IG51bWJlciA9IE1hdGguZmxvb3IoXHJcbiAgICAgICAgICAgICh0aGlzLm1vdXNlWCAtIDIgKiB0aGlzLnVwc2NhbGVTaXplKSAvIDE2IC8gdGhpcy51cHNjYWxlU2l6ZVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnBpY2tlZFVwU2xvdCAhPT0gLTEpIHtcclxuICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tb3VzZVggPiAyICogdGhpcy51cHNjYWxlU2l6ZSAmJlxyXG4gICAgICAgICAgICAgICAgdGhpcy5tb3VzZVggPFxyXG4gICAgICAgICAgICAgICAgICAgIDIgKiB0aGlzLnVwc2NhbGVTaXplICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgMTYgKiB0aGlzLnVwc2NhbGVTaXplICogdGhpcy5ob3RCYXIubGVuZ3RoICYmXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vdXNlWSA+IDIgKiB0aGlzLnVwc2NhbGVTaXplICYmXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vdXNlWSA8IDE4ICogdGhpcy51cHNjYWxlU2l6ZVxyXG4gICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgIC8vIE1ha2Ugc3VyZSB0aGF0IHRoZSBzbG90IHRoYXQgdGhlIGN1cnNvciB3YXMgcmVsZWFzZWQgd2FzIG5vdCB0aGUgc2xvdCB0aGF0IHdhcyBzZWxlY3RlZFxyXG4gICAgICAgICAgICAgICAgaWYgKHJlbGVhc2VkU2xvdCA9PT0gdGhpcy5waWNrZWRVcFNsb3QpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBTd2FwIHRoZSBwaWNrZWQgdXAgc2xvdCB3aXRoIHRoZSBzbG90IHRoZSBtb3VzZSB3YXMgcmVsZWFzZWQgb25cclxuICAgICAgICAgICAgICAgIFt0aGlzLmhvdEJhclt0aGlzLnBpY2tlZFVwU2xvdF0sIHRoaXMuaG90QmFyW3JlbGVhc2VkU2xvdF1dID0gW1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaG90QmFyW3JlbGVhc2VkU2xvdF0sXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ob3RCYXJbdGhpcy5waWNrZWRVcFNsb3RdLFxyXG4gICAgICAgICAgICAgICAgXTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnBpY2tlZFVwU2xvdCA9IC0xO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ob3RCYXJbdGhpcy5waWNrZWRVcFNsb3RdID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5waWNrZWRVcFNsb3QgPSAtMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBtb3ZlQ2FtZXJhKCkge1xyXG4gICAgICAgIHRoaXMuaW50ZXJwb2xhdGVkQ2FtWCA9XHJcbiAgICAgICAgICAgIHRoaXMucENhbVggKyAodGhpcy5jYW1YIC0gdGhpcy5wQ2FtWCkgKiB0aGlzLmFtb3VudFNpbmNlTGFzdFRpY2sgKyAodGhpcy5ub2lzZSh0aGlzLm1pbGxpcygpLzIwMCktMC41KSp0aGlzLnNjcmVlbnNoYWtlQW1vdW50O1xyXG4gICAgICAgIHRoaXMuaW50ZXJwb2xhdGVkQ2FtWSA9XHJcbiAgICAgICAgICAgIHRoaXMucENhbVkgKyAodGhpcy5jYW1ZIC0gdGhpcy5wQ2FtWSkgKiB0aGlzLmFtb3VudFNpbmNlTGFzdFRpY2sgKyAodGhpcy5ub2lzZSgwLCB0aGlzLm1pbGxpcygpLzIwMCktMC41KSp0aGlzLnNjcmVlbnNoYWtlQW1vdW50O1xyXG4gICAgfVxyXG5cclxuICAgIGRvVGlja3MoKSB7XHJcbiAgICAgICAgLy8gaW5jcmVhc2UgdGhlIHRpbWUgc2luY2UgYSB0aWNrIGhhcyBoYXBwZW5lZCBieSBkZWx0YVRpbWUsIHdoaWNoIGlzIGEgYnVpbHQtaW4gcDUuanMgdmFsdWVcclxuICAgICAgICB0aGlzLm1zU2luY2VUaWNrICs9IHRoaXMuZGVsdGFUaW1lO1xyXG5cclxuICAgICAgICAvLyBkZWZpbmUgYSB0ZW1wb3JhcnkgdmFyaWFibGUgY2FsbGVkIHRpY2tzVGhpc0ZyYW1lIC0gdGhpcyBpcyB1c2VkIHRvIGtlZXAgdHJhY2sgb2YgaG93IG1hbnkgdGlja3MgaGF2ZSBiZWVuIGNhbGN1bGF0ZWQgd2l0aGluIHRoZSBkdXJhdGlvbiBvZiB0aGUgY3VycmVudCBmcmFtZS4gIEFzIGxvbmcgYXMgdGhpcyB2YWx1ZSBpcyBsZXNzIHRoYW4gdGhlIGZvcmdpdmVuZXNzQ291bnQgdmFyaWFibGUsIGl0IGNvbnRpbnVlcyB0byBjYWxjdWxhdGUgdGlja3MgYXMgbmVjZXNzYXJ5LlxyXG4gICAgICAgIGxldCB0aWNrc1RoaXNGcmFtZSA9IDA7XHJcbiAgICAgICAgd2hpbGUgKFxyXG4gICAgICAgICAgICB0aGlzLm1zU2luY2VUaWNrID4gdGhpcy5tc1BlclRpY2sgJiZcclxuICAgICAgICAgICAgdGlja3NUaGlzRnJhbWUgIT09IHRoaXMuZm9yZ2l2ZW5lc3NDb3VudFxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLnRpbWUoXCJ0aWNrXCIpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy53b3JsZCAhPT0gdW5kZWZpbmVkKSB0aGlzLmRvVGljaygpO1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLnRpbWVFbmQoXCJ0aWNrXCIpO1xyXG4gICAgICAgICAgICB0aGlzLm1zU2luY2VUaWNrIC09IHRoaXMubXNQZXJUaWNrO1xyXG4gICAgICAgICAgICB0aWNrc1RoaXNGcmFtZSsrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGlja3NUaGlzRnJhbWUgPT09IHRoaXMuZm9yZ2l2ZW5lc3NDb3VudCkge1xyXG4gICAgICAgICAgICB0aGlzLm1zU2luY2VUaWNrID0gMDtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKFxyXG4gICAgICAgICAgICAgICAgXCJsYWcgc3Bpa2UgZGV0ZWN0ZWQsIHRpY2sgY2FsY3VsYXRpb25zIGNvdWxkbid0IGtlZXAgdXBcIlxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmFtb3VudFNpbmNlTGFzdFRpY2sgPSB0aGlzLm1zU2luY2VUaWNrIC8gdGhpcy5tc1BlclRpY2s7XHJcbiAgICB9XHJcblxyXG4gICAgZG9UaWNrKCkge1xyXG4gICAgICAgIGZvcihsZXQgcGFydGljbGUgb2YgdGhpcy5wYXJ0aWNsZXMpIHtcclxuICAgICAgICAgICAgcGFydGljbGUudGljaygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLndvcmxkLnBsYXllciA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICB0aGlzLndvcmxkLnBsYXllci5rZXlib2FyZElucHV0KCk7XHJcbiAgICAgICAgdGhpcy53b3JsZC5wbGF5ZXIuYXBwbHlHcmF2aXR5QW5kRHJhZygpO1xyXG4gICAgICAgIHRoaXMud29ybGQucGxheWVyLmFwcGx5VmVsb2NpdHlBbmRDb2xsaWRlKCk7XHJcblxyXG4gICAgICAgIHRoaXMucENhbVggPSB0aGlzLmNhbVg7XHJcbiAgICAgICAgdGhpcy5wQ2FtWSA9IHRoaXMuY2FtWTtcclxuICAgICAgICB0aGlzLmRlc2lyZWRDYW1YID1cclxuICAgICAgICAgICAgdGhpcy53b3JsZC5wbGF5ZXIueCArXHJcbiAgICAgICAgICAgIHRoaXMud29ybGQucGxheWVyLndpZHRoIC8gMiAtXHJcbiAgICAgICAgICAgIHRoaXMud2lkdGggLyAyIC8gdGhpcy5USUxFX1dJRFRIIC8gdGhpcy51cHNjYWxlU2l6ZSArXHJcbiAgICAgICAgICAgIHRoaXMud29ybGQucGxheWVyLnhWZWwgKiA0MDtcclxuICAgICAgICB0aGlzLmRlc2lyZWRDYW1ZID1cclxuICAgICAgICAgICAgdGhpcy53b3JsZC5wbGF5ZXIueSArXHJcbiAgICAgICAgICAgIHRoaXMud29ybGQucGxheWVyLmhlaWdodC8yIC1cclxuICAgICAgICAgICAgdGhpcy5oZWlnaHQgLyAyIC8gdGhpcy5USUxFX0hFSUdIVCAvIHRoaXMudXBzY2FsZVNpemUgK1xyXG4gICAgICAgICAgICB0aGlzLndvcmxkLnBsYXllci55VmVsICogMjA7XHJcbiAgICAgICAgdGhpcy5jYW1YID0gKHRoaXMuZGVzaXJlZENhbVggKyB0aGlzLmNhbVggKiAyNCkgLyAyNTtcclxuICAgICAgICB0aGlzLmNhbVkgPSAodGhpcy5kZXNpcmVkQ2FtWSArIHRoaXMuY2FtWSAqIDI0KSAvIDI1O1xyXG5cclxuICAgICAgICB0aGlzLnNjcmVlbnNoYWtlQW1vdW50ICo9IDAuODtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY2FtWCA8IDApIHtcclxuICAgICAgICAgICAgdGhpcy5jYW1YID0gMDtcclxuICAgICAgICB9IGVsc2UgaWYgKFxyXG4gICAgICAgICAgICB0aGlzLmNhbVggPlxyXG4gICAgICAgICAgICB0aGlzLndvcmxkV2lkdGggLSB0aGlzLndpZHRoIC8gdGhpcy51cHNjYWxlU2l6ZSAvIHRoaXMuVElMRV9XSURUSFxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICB0aGlzLmNhbVggPVxyXG4gICAgICAgICAgICAgICAgdGhpcy53b3JsZFdpZHRoIC1cclxuICAgICAgICAgICAgICAgIHRoaXMud2lkdGggLyB0aGlzLnVwc2NhbGVTaXplIC8gdGhpcy5USUxFX1dJRFRIO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgIHRoaXMuY2FtWSA+XHJcbiAgICAgICAgICAgIHRoaXMud29ybGRIZWlnaHQgLVxyXG4gICAgICAgICAgICAgICAgdGhpcy5oZWlnaHQgLyB0aGlzLnVwc2NhbGVTaXplIC8gdGhpcy5USUxFX0hFSUdIVFxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICB0aGlzLmNhbVkgPVxyXG4gICAgICAgICAgICAgICAgdGhpcy53b3JsZEhlaWdodCAtXHJcbiAgICAgICAgICAgICAgICB0aGlzLmhlaWdodCAvIHRoaXMudXBzY2FsZVNpemUgLyB0aGlzLlRJTEVfSEVJR0hUO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIC8vIGZvciAoY29uc3QgaXRlbSBvZiB0aGlzLml0ZW1zKSB7XHJcbiAgICAgICAgLy8gICAgIGl0ZW0uZ29Ub3dhcmRzUGxheWVyKCk7XHJcbiAgICAgICAgLy8gICAgIGl0ZW0uY29tYmluZVdpdGhOZWFySXRlbXMoKTtcclxuICAgICAgICAvLyAgICAgaXRlbS5hcHBseUdyYXZpdHlBbmREcmFnKCk7XHJcbiAgICAgICAgLy8gICAgIGl0ZW0uYXBwbHlWZWxvY2l0eUFuZENvbGxpZGUoKTtcclxuICAgICAgICAvLyB9XHJcbiAgICAgICAgLy9cclxuICAgICAgICAvLyBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaXRlbXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAvLyAgICAgaWYgKHRoaXMuaXRlbXNbaV0uZGVsZXRlZCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgIC8vICAgICAgICAgdGhpcy5pdGVtcy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgLy8gICAgICAgICBpLS07XHJcbiAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAvLyB9XHJcbiAgICB9XHJcblxyXG4gICAgdWlGcmFtZVJlY3QoeDogbnVtYmVyLCB5OiBudW1iZXIsIHc6IG51bWJlciwgaDogbnVtYmVyKSB7XHJcbiAgICAgICAgLy8gc2V0IHRoZSBjb29yZHMgYW5kIGRpbWVuc2lvbnMgdG8gcm91bmQgdG8gdGhlIG5lYXJlc3QgdW4tdXBzY2FsZWQgcGl4ZWxcclxuICAgICAgICB4ID0gTWF0aC5yb3VuZCh4IC8gdGhpcy51cHNjYWxlU2l6ZSkgKiB0aGlzLnVwc2NhbGVTaXplO1xyXG4gICAgICAgIHkgPSBNYXRoLnJvdW5kKHkgLyB0aGlzLnVwc2NhbGVTaXplKSAqIHRoaXMudXBzY2FsZVNpemU7XHJcbiAgICAgICAgdyA9IE1hdGgucm91bmQodyAvIHRoaXMudXBzY2FsZVNpemUpICogdGhpcy51cHNjYWxlU2l6ZTtcclxuICAgICAgICBoID0gTWF0aC5yb3VuZChoIC8gdGhpcy51cHNjYWxlU2l6ZSkgKiB0aGlzLnVwc2NhbGVTaXplO1xyXG5cclxuICAgICAgICAvLyBjb3JuZXJzXHJcbiAgICAgICAgVWlBc3NldHMudWlfZnJhbWUucmVuZGVyUGFydGlhbChcclxuICAgICAgICAgICAgdGhpcyxcclxuICAgICAgICAgICAgeCxcclxuICAgICAgICAgICAgeSxcclxuICAgICAgICAgICAgNyAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICA3LFxyXG4gICAgICAgICAgICA3XHJcbiAgICAgICAgKTtcclxuICAgICAgICBVaUFzc2V0cy51aV9mcmFtZS5yZW5kZXJQYXJ0aWFsKFxyXG4gICAgICAgICAgICB0aGlzLFxyXG4gICAgICAgICAgICB4ICsgdyAtIDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICB5LFxyXG4gICAgICAgICAgICA3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgNyAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIDgsXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIDcsXHJcbiAgICAgICAgICAgIDdcclxuICAgICAgICApO1xyXG4gICAgICAgIFVpQXNzZXRzLnVpX2ZyYW1lLnJlbmRlclBhcnRpYWwoXHJcbiAgICAgICAgICAgIHRoaXMsXHJcbiAgICAgICAgICAgIHgsXHJcbiAgICAgICAgICAgIHkgKyBoIC0gNyAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICA3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgOCxcclxuICAgICAgICAgICAgNyxcclxuICAgICAgICAgICAgN1xyXG4gICAgICAgICk7XHJcbiAgICAgICAgVWlBc3NldHMudWlfZnJhbWUucmVuZGVyUGFydGlhbChcclxuICAgICAgICAgICAgdGhpcyxcclxuICAgICAgICAgICAgeCArIHcgLSA3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgeSArIGggLSA3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgNyAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICA4LFxyXG4gICAgICAgICAgICA4LFxyXG4gICAgICAgICAgICA3LFxyXG4gICAgICAgICAgICA3XHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgLy8gdG9wIGFuZCBib3R0b21cclxuICAgICAgICBVaUFzc2V0cy51aV9mcmFtZS5yZW5kZXJQYXJ0aWFsKFxyXG4gICAgICAgICAgICB0aGlzLFxyXG4gICAgICAgICAgICB4ICsgNyAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIHksXHJcbiAgICAgICAgICAgIHcgLSAxNCAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICA3LFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICAxLFxyXG4gICAgICAgICAgICA3XHJcbiAgICAgICAgKTtcclxuICAgICAgICBVaUFzc2V0cy51aV9mcmFtZS5yZW5kZXJQYXJ0aWFsKFxyXG4gICAgICAgICAgICB0aGlzLFxyXG4gICAgICAgICAgICB4ICsgNyAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIHkgKyBoIC0gNyAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIHcgLSAxNCAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICA3LFxyXG4gICAgICAgICAgICA4LFxyXG4gICAgICAgICAgICAxLFxyXG4gICAgICAgICAgICA3XHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgLy8gbGVmdCBhbmQgcmlnaHRcclxuICAgICAgICBVaUFzc2V0cy51aV9mcmFtZS5yZW5kZXJQYXJ0aWFsKFxyXG4gICAgICAgICAgICB0aGlzLFxyXG4gICAgICAgICAgICB4LFxyXG4gICAgICAgICAgICB5ICsgNyAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICBoIC0gMTQgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICA3LFxyXG4gICAgICAgICAgICA3LFxyXG4gICAgICAgICAgICAxXHJcbiAgICAgICAgKTtcclxuICAgICAgICBVaUFzc2V0cy51aV9mcmFtZS5yZW5kZXJQYXJ0aWFsKFxyXG4gICAgICAgICAgICB0aGlzLFxyXG4gICAgICAgICAgICB4ICsgdyAtIDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICB5ICsgNyAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICBoIC0gMTQgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICA4LFxyXG4gICAgICAgICAgICA3LFxyXG4gICAgICAgICAgICA3LFxyXG4gICAgICAgICAgICAxXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgLy8gY2VudGVyXHJcbiAgICAgICAgVWlBc3NldHMudWlfZnJhbWUucmVuZGVyUGFydGlhbChcclxuICAgICAgICAgICAgdGhpcyxcclxuICAgICAgICAgICAgeCArIDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICB5ICsgNyAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIHcgLSAxNCAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIGggLSAxNCAqIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIDcsXHJcbiAgICAgICAgICAgIDcsXHJcbiAgICAgICAgICAgIDEsXHJcbiAgICAgICAgICAgIDFcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgIC8kJCQkJCQkICAvJCQgICAgICAgICAgICAgICAgICAgICAgICAgICAvJCRcclxuICB8ICQkX18gICQkfCAkJCAgICAgICAgICAgICAgICAgICAgICAgICAgfF9fL1xyXG4gIHwgJCQgIFxcICQkfCAkJCQkJCQkICAvJCQgICAvJCQgIC8kJCQkJCQkIC8kJCAgLyQkJCQkJCQgIC8kJCQkJCQkIC8kJFxyXG4gIHwgJCQkJCQkJC98ICQkX18gICQkfCAkJCAgfCAkJCAvJCRfX19fXy98ICQkIC8kJF9fX19fLyAvJCRfX19fXy98X18vXHJcbiAgfCAkJF9fX18vIHwgJCQgIFxcICQkfCAkJCAgfCAkJHwgICQkJCQkJCB8ICQkfCAkJCAgICAgIHwgICQkJCQkJFxyXG4gIHwgJCQgICAgICB8ICQkICB8ICQkfCAkJCAgfCAkJCBcXF9fX18gICQkfCAkJHwgJCQgICAgICAgXFxfX19fICAkJCAvJCRcclxuICB8ICQkICAgICAgfCAkJCAgfCAkJHwgICQkJCQkJCQgLyQkJCQkJCQvfCAkJHwgICQkJCQkJCQgLyQkJCQkJCQvfF9fL1xyXG4gIHxfXy8gICAgICB8X18vICB8X18vIFxcX19fXyAgJCR8X19fX19fXy8gfF9fLyBcXF9fX19fX18vfF9fX19fX18vXHJcbiAgICAgICAgICAgICAgICAgICAgICAgLyQkICB8ICQkXHJcbiAgICAgICAgICAgICAgICAgICAgICB8ICAkJCQkJCQvXHJcbiAgICAgICAgICAgICAgICAgICAgICAgXFxfX19fX18vXHJcbiAgKi9cclxuXHJcbiAgICAvLyB0aGlzIGNsYXNzIGhvbGRzIGFuIGF4aXMtYWxpZ25lZCByZWN0YW5nbGUgYWZmZWN0ZWQgYnkgZ3Jhdml0eSwgZHJhZywgYW5kIGNvbGxpc2lvbnMgd2l0aCB0aWxlcy5cclxuXHJcbiAgICByZWN0VnNSYXkoXHJcbiAgICAgICAgcmVjdFg/OiBhbnksXHJcbiAgICAgICAgcmVjdFk/OiBhbnksXHJcbiAgICAgICAgcmVjdFc/OiBhbnksXHJcbiAgICAgICAgcmVjdEg/OiBhbnksXHJcbiAgICAgICAgcmF5WD86IGFueSxcclxuICAgICAgICByYXlZPzogYW55LFxyXG4gICAgICAgIHJheVc/OiBhbnksXHJcbiAgICAgICAgcmF5SD86IGFueVxyXG4gICAgKSB7XHJcbiAgICAgICAgLy8gdGhpcyByYXkgaXMgYWN0dWFsbHkgYSBsaW5lIHNlZ21lbnQgbWF0aGVtYXRpY2FsbHksIGJ1dCBpdCdzIGNvbW1vbiB0byBzZWUgcGVvcGxlIHJlZmVyIHRvIHNpbWlsYXIgY2hlY2tzIGFzIHJheS1jYXN0cywgc28gZm9yIHRoZSBkdXJhdGlvbiBvZiB0aGUgZGVmaW5pdGlvbiBvZiB0aGlzIGZ1bmN0aW9uLCByYXkgY2FuIGJlIGFzc3VtZWQgdG8gbWVhbiB0aGUgc2FtZSBhcyBsaW5lIHNlZ21lbnQuXHJcblxyXG4gICAgICAgIC8vIGlmIHRoZSByYXkgZG9lc24ndCBoYXZlIGEgbGVuZ3RoLCB0aGVuIGl0IGNhbid0IGhhdmUgZW50ZXJlZCB0aGUgcmVjdGFuZ2xlLiAgVGhpcyBhc3N1bWVzIHRoYXQgdGhlIG9iamVjdHMgZG9uJ3Qgc3RhcnQgaW4gY29sbGlzaW9uLCBvdGhlcndpc2UgdGhleSdsbCBiZWhhdmUgc3RyYW5nZWx5XHJcbiAgICAgICAgaWYgKHJheVcgPT09IDAgJiYgcmF5SCA9PT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBjYWxjdWxhdGUgaG93IGZhciBhbG9uZyB0aGUgcmF5IGVhY2ggc2lkZSBvZiB0aGUgcmVjdGFuZ2xlIGludGVyc2VjdHMgd2l0aCBpdCAoZWFjaCBzaWRlIGlzIGV4dGVuZGVkIG91dCBpbmZpbml0ZWx5IGluIGJvdGggZGlyZWN0aW9ucylcclxuICAgICAgICBjb25zdCB0b3BJbnRlcnNlY3Rpb24gPSAocmVjdFkgLSByYXlZKSAvIHJheUg7XHJcbiAgICAgICAgY29uc3QgYm90dG9tSW50ZXJzZWN0aW9uID0gKHJlY3RZICsgcmVjdEggLSByYXlZKSAvIHJheUg7XHJcbiAgICAgICAgY29uc3QgbGVmdEludGVyc2VjdGlvbiA9IChyZWN0WCAtIHJheVgpIC8gcmF5VztcclxuICAgICAgICBjb25zdCByaWdodEludGVyc2VjdGlvbiA9IChyZWN0WCArIHJlY3RXIC0gcmF5WCkgLyByYXlXO1xyXG5cclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgIGlzTmFOKHRvcEludGVyc2VjdGlvbikgfHxcclxuICAgICAgICAgICAgaXNOYU4oYm90dG9tSW50ZXJzZWN0aW9uKSB8fFxyXG4gICAgICAgICAgICBpc05hTihsZWZ0SW50ZXJzZWN0aW9uKSB8fFxyXG4gICAgICAgICAgICBpc05hTihyaWdodEludGVyc2VjdGlvbilcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgLy8geW91IGhhdmUgdG8gdXNlIHRoZSBKUyBmdW5jdGlvbiBpc05hTigpIHRvIGNoZWNrIGlmIGEgdmFsdWUgaXMgTmFOIGJlY2F1c2UgYm90aCBOYU49PU5hTiBhbmQgTmFOPT09TmFOIGFyZSBmYWxzZS5cclxuICAgICAgICAgICAgLy8gaWYgYW55IG9mIHRoZXNlIHZhbHVlcyBhcmUgTmFOLCBubyBjb2xsaXNpb24gaGFzIG9jY3VycmVkXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGNhbGN1bGF0ZSB0aGUgbmVhcmVzdCBhbmQgZmFydGhlc3QgaW50ZXJzZWN0aW9ucyBmb3IgYm90aCB4IGFuZCB5XHJcbiAgICAgICAgY29uc3QgbmVhclggPSB0aGlzLm1pbihsZWZ0SW50ZXJzZWN0aW9uLCByaWdodEludGVyc2VjdGlvbik7XHJcbiAgICAgICAgY29uc3QgZmFyWCA9IHRoaXMubWF4KGxlZnRJbnRlcnNlY3Rpb24sIHJpZ2h0SW50ZXJzZWN0aW9uKTtcclxuICAgICAgICBjb25zdCBuZWFyWSA9IHRoaXMubWluKHRvcEludGVyc2VjdGlvbiwgYm90dG9tSW50ZXJzZWN0aW9uKTtcclxuICAgICAgICBjb25zdCBmYXJZID0gdGhpcy5tYXgodG9wSW50ZXJzZWN0aW9uLCBib3R0b21JbnRlcnNlY3Rpb24pO1xyXG5cclxuICAgICAgICBpZiAobmVhclggPiBmYXJZIHx8IG5lYXJZID4gZmFyWCkge1xyXG4gICAgICAgICAgICAvLyB0aGlzIG11c3QgbWVhbiB0aGF0IHRoZSBsaW5lIHRoYXQgbWFrZXMgdXAgdGhlIGxpbmUgc2VnbWVudCBkb2Vzbid0IHBhc3MgdGhyb3VnaCB0aGUgcmF5XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChmYXJYIDwgMCB8fCBmYXJZIDwgMCkge1xyXG4gICAgICAgICAgICAvLyB0aGUgaW50ZXJzZWN0aW9uIGlzIGhhcHBlbmluZyBiZWZvcmUgdGhlIHJheSBzdGFydHMsIHNvIHRoZSByYXkgaXMgcG9pbnRpbmcgYXdheSBmcm9tIHRoZSB0cmlhbmdsZVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBjYWxjdWxhdGUgd2hlcmUgdGhlIHBvdGVudGlhbCBjb2xsaXNpb24gY291bGQgYmVcclxuICAgICAgICBjb25zdCBuZWFyQ29sbGlzaW9uUG9pbnQgPSB0aGlzLm1heChuZWFyWCwgbmVhclkpO1xyXG5cclxuICAgICAgICBpZiAobmVhclggPiAxIHx8IG5lYXJZID4gMSkge1xyXG4gICAgICAgICAgICAvLyB0aGUgaW50ZXJzZWN0aW9uIGhhcHBlbnMgYWZ0ZXIgdGhlIHJheShsaW5lIHNlZ21lbnQpIGVuZHNcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG5lYXJYID09PSBuZWFyQ29sbGlzaW9uUG9pbnQpIHtcclxuICAgICAgICAgICAgLy8gaXQgbXVzdCBoYXZlIGNvbGxpZGVkIG9uIGVpdGhlciB0aGUgbGVmdCBvciB0aGUgcmlnaHQhIG5vdyB3aGljaD9cclxuICAgICAgICAgICAgaWYgKGxlZnRJbnRlcnNlY3Rpb24gPT09IG5lYXJYKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBJdCBtdXN0IGhhdmUgY29sbGlkZWQgb24gdGhlIGxlZnQhICBSZXR1cm4gdGhlIGNvbGxpc2lvbiBub3JtYWwgWy0xLCAwXVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFstMSwgMCwgbmVhckNvbGxpc2lvblBvaW50XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBJZiBpdCBkaWRuJ3QgY29sbGlkZSBvbiB0aGUgbGVmdCwgaXQgbXVzdCBoYXZlIGNvbGxpZGVkIG9uIHRoZSByaWdodC4gIFJldHVybiB0aGUgY29sbGlzaW9uIG5vcm1hbCBbMSwgMF1cclxuICAgICAgICAgICAgcmV0dXJuIFsxLCAwLCBuZWFyQ29sbGlzaW9uUG9pbnRdO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBJZiBpdCBkaWRuJ3QgY29sbGlkZSBvbiB0aGUgbGVmdCBvciByaWdodCwgaXQgbXVzdCBoYXZlIGNvbGxpZGVkIG9uIGVpdGhlciB0aGUgdG9wIG9yIHRoZSBib3R0b20hIG5vdyB3aGljaD9cclxuICAgICAgICBpZiAodG9wSW50ZXJzZWN0aW9uID09PSBuZWFyWSkge1xyXG4gICAgICAgICAgICAvLyBJdCBtdXN0IGhhdmUgY29sbGlkZWQgb24gdGhlIHRvcCEgIFJldHVybiB0aGUgY29sbGlzaW9uIG5vcm1hbCBbMCwgLTFdXHJcbiAgICAgICAgICAgIHJldHVybiBbMCwgLTEsIG5lYXJDb2xsaXNpb25Qb2ludF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIElmIGl0IGRpZG4ndCBjb2xsaWRlIG9uIHRoZSB0b3AsIGl0IG11c3QgaGF2ZSBjb2xsaWRlZCBvbiB0aGUgYm90dG9tLiAgUmV0dXJuIHRoZSBjb2xsaXNpb24gbm9ybWFsIFswLCAxXVxyXG4gICAgICAgIHJldHVybiBbMCwgMSwgbmVhckNvbGxpc2lvblBvaW50XTtcclxuXHJcbiAgICAgICAgLy8gb3V0cHV0IGlmIG5vIGNvbGxpc2lvbjogZmFsc2VcclxuICAgICAgICAvLyBvdXRwdXQgaWYgY29sbGlzaW9uOiBbY29sbGlzaW9uIG5vcm1hbCBYLCBjb2xsaXNpb24gbm9ybWFsIFksIG5lYXJDb2xsaXNpb25Qb2ludF1cclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAtMSB0byAxICAgICAgICAgICAgICAtMSB0byAxICAgICAgICAgICAgMCB0byAxXHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyRW50aXRpZXMoKSB7XHJcbiAgICAgICAgLy8gZHJhdyBwbGF5ZXJcclxuICAgICAgICAvLyB0aGlzLmZpbGwoMjU1LCAwLCAwKTtcclxuICAgICAgICAvLyB0aGlzLm5vU3Ryb2tlKCk7XHJcbiAgICAgICAgLy8gdGhpcy5yZWN0KFxyXG4gICAgICAgIC8vICAgICAodGhpcy53b3JsZC5wbGF5ZXIuaW50ZXJwb2xhdGVkWCAqIHRoaXMuVElMRV9XSURUSCAtXHJcbiAgICAgICAgLy8gICAgICAgICB0aGlzLmludGVycG9sYXRlZENhbVggKiB0aGlzLlRJTEVfV0lEVEgpICpcclxuICAgICAgICAvLyAgICAgICAgIHRoaXMudXBzY2FsZVNpemUsXHJcbiAgICAgICAgLy8gICAgICh0aGlzLndvcmxkLnBsYXllci5pbnRlcnBvbGF0ZWRZICogdGhpcy5USUxFX0hFSUdIVCAtXHJcbiAgICAgICAgLy8gICAgICAgICB0aGlzLmludGVycG9sYXRlZENhbVkgKiB0aGlzLlRJTEVfSEVJR0hUKSAqXHJcbiAgICAgICAgLy8gICAgICAgICB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgIC8vICAgICB0aGlzLndvcmxkLnBsYXllci53aWR0aCAqIHRoaXMudXBzY2FsZVNpemUgKiB0aGlzLlRJTEVfV0lEVEgsXHJcbiAgICAgICAgLy8gICAgIHRoaXMud29ybGQucGxheWVyLmhlaWdodCAqIHRoaXMudXBzY2FsZVNpemUgKiB0aGlzLlRJTEVfSEVJR0hUXHJcbiAgICAgICAgLy8gKTtcclxuXHJcblxyXG4gICAgICAgIC8vIGZvciAoY29uc3QgaXRlbSBvZiB0aGlzLml0ZW1zKSB7XHJcbiAgICAgICAgLy8gICAgIGl0ZW0uZmluZEludGVycG9sYXRlZENvb3JkaW5hdGVzKCk7XHJcbiAgICAgICAgLy9cclxuICAgICAgICAvLyAgICAgaXRlbS5pdGVtU3RhY2sudGV4dHVyZS5yZW5kZXIoXHJcbiAgICAgICAgLy8gICAgICAgICB0aGlzLFxyXG4gICAgICAgIC8vICAgICAgICAgKGl0ZW0uaW50ZXJwb2xhdGVkWCAqIHRoaXMuVElMRV9XSURUSCAtXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgdGhpcy5pbnRlcnBvbGF0ZWRDYW1YICogdGhpcy5USUxFX1dJRFRIKSAqXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAvLyAgICAgICAgIChpdGVtLmludGVycG9sYXRlZFkgKiB0aGlzLlRJTEVfSEVJR0hUIC1cclxuICAgICAgICAvLyAgICAgICAgICAgICB0aGlzLmludGVycG9sYXRlZENhbVkgKiB0aGlzLlRJTEVfSEVJR0hUKSAqXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAvLyAgICAgICAgIGl0ZW0udyAqIHRoaXMudXBzY2FsZVNpemUgKiB0aGlzLlRJTEVfV0lEVEgsXHJcbiAgICAgICAgLy8gICAgICAgICBpdGVtLmggKiB0aGlzLnVwc2NhbGVTaXplICogdGhpcy5USUxFX0hFSUdIVFxyXG4gICAgICAgIC8vICAgICApO1xyXG4gICAgICAgIC8vXHJcbiAgICAgICAgLy8gICAgIC8vIFJlbmRlciB0aGUgaXRlbSBxdWFudGl0eSBsYWJlbFxyXG4gICAgICAgIC8vICAgICB0aGlzLmZpbGwoMCk7XHJcbiAgICAgICAgLy9cclxuICAgICAgICAvLyAgICAgdGhpcy5ub1N0cm9rZSgpO1xyXG4gICAgICAgIC8vXHJcbiAgICAgICAgLy8gICAgIHRoaXMudGV4dEFsaWduKHRoaXMuUklHSFQsIHRoaXMuQk9UVE9NKTtcclxuICAgICAgICAvLyAgICAgdGhpcy50ZXh0U2l6ZSg1ICogdGhpcy51cHNjYWxlU2l6ZSk7XHJcbiAgICAgICAgLy9cclxuICAgICAgICAvLyAgICAgdGhpcy50ZXh0KFxyXG4gICAgICAgIC8vICAgICAgICAgaXRlbS5pdGVtU3RhY2suc3RhY2tTaXplLFxyXG4gICAgICAgIC8vICAgICAgICAgKGl0ZW0uaW50ZXJwb2xhdGVkWCAqIHRoaXMuVElMRV9XSURUSCAtXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgdGhpcy5pbnRlcnBvbGF0ZWRDYW1YICogdGhpcy5USUxFX1dJRFRIKSAqXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgdGhpcy51cHNjYWxlU2l6ZSxcclxuICAgICAgICAvLyAgICAgICAgIChpdGVtLmludGVycG9sYXRlZFkgKiB0aGlzLlRJTEVfSEVJR0hUIC1cclxuICAgICAgICAvLyAgICAgICAgICAgICB0aGlzLmludGVycG9sYXRlZENhbVkgKiB0aGlzLlRJTEVfSEVJR0hUKSAqXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgdGhpcy51cHNjYWxlU2l6ZVxyXG4gICAgICAgIC8vICAgICApO1xyXG4gICAgICAgIC8vIH1cclxuICAgIH1cclxuXHJcbiAgICBwaWNrVXBJdGVtKGl0ZW1TdGFjazogSXRlbVN0YWNrKTogYm9vbGVhbiB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmhvdEJhci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBpdGVtID0gdGhpcy5ob3RCYXJbaV07XHJcblxyXG4gICAgICAgICAgICAvLyBJZiB0aGVyZSBhcmUgbm8gaXRlbXMgaW4gdGhlIGN1cnJlbnQgc2xvdCBvZiB0aGUgaG90QmFyXHJcbiAgICAgICAgICAgIGlmIChpdGVtID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaG90QmFyW2ldID0gaXRlbVN0YWNrO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgIGl0ZW0gPT09IGl0ZW1TdGFjayAmJlxyXG4gICAgICAgICAgICAgICAgaXRlbS5zdGFja1NpemUgPCBpdGVtLm1heFN0YWNrU2l6ZVxyXG4gICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlbWFpbmluZ1NwYWNlID0gaXRlbS5tYXhTdGFja1NpemUgLSBpdGVtLnN0YWNrU2l6ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBUb3Agb2ZmIHRoZSBzdGFjayB3aXRoIGl0ZW1zIGlmIGl0IGNhbiB0YWtlIG1vcmUgdGhhbiB0aGUgc3RhY2sgYmVpbmcgYWRkZWRcclxuICAgICAgICAgICAgICAgIGlmIChyZW1haW5pbmdTcGFjZSA+PSBpdGVtU3RhY2suc3RhY2tTaXplKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ob3RCYXJbaV0uc3RhY2tTaXplID1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5zdGFja1NpemUgKyBpdGVtU3RhY2suc3RhY2tTaXplO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGl0ZW1TdGFjay5zdGFja1NpemUgLT0gcmVtYWluaW5nU3BhY2U7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5ob3RCYXJbaV0uc3RhY2tTaXplID0gaXRlbVN0YWNrLm1heFN0YWNrU2l6ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zb2xlLmVycm9yKFxyXG4gICAgICAgICAgICBgQ291bGQgbm90IHBpY2t1cCAke2l0ZW1TdGFjay5zdGFja1NpemV9ICR7aXRlbVN0YWNrLm5hbWV9YFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIG1vdXNlRXhpdGVkKCkge1xyXG4gICAgICAgIHRoaXMubW91c2VPbiA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIG1vdXNlRW50ZXJlZCgpIHtcclxuICAgICAgICB0aGlzLm1vdXNlT24gPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZU1vdXNlKCkge1xyXG4gICAgICAgIC8vIHdvcmxkIG1vdXNlIHggYW5kIHkgdmFyaWFibGVzIGhvbGQgdGhlIG1vdXNlIHBvc2l0aW9uIGluIHdvcmxkIHRpbGVzLiAgMCwgMCBpcyB0b3AgbGVmdFxyXG4gICAgICAgIHRoaXMud29ybGRNb3VzZVggPSBNYXRoLmZsb29yKFxyXG4gICAgICAgICAgICAodGhpcy5pbnRlcnBvbGF0ZWRDYW1YICogdGhpcy5USUxFX1dJRFRIICtcclxuICAgICAgICAgICAgICAgIHRoaXMubW91c2VYIC8gdGhpcy51cHNjYWxlU2l6ZSkgL1xyXG4gICAgICAgICAgICAgICAgdGhpcy5USUxFX1dJRFRIXHJcbiAgICAgICAgKTtcclxuICAgICAgICB0aGlzLndvcmxkTW91c2VZID0gTWF0aC5mbG9vcihcclxuICAgICAgICAgICAgKHRoaXMuaW50ZXJwb2xhdGVkQ2FtWSAqIHRoaXMuVElMRV9IRUlHSFQgK1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tb3VzZVkgLyB0aGlzLnVwc2NhbGVTaXplKSAvXHJcbiAgICAgICAgICAgICAgICB0aGlzLlRJTEVfSEVJR0hUXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBkcmF3Q3Vyc29yKCkge1xyXG4gICAgICAgIGlmICh0aGlzLm1vdXNlT24pIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucGlja2VkVXBTbG90ID4gLTEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaG90QmFyW3RoaXMucGlja2VkVXBTbG90XS50ZXh0dXJlLnJlbmRlcihcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW91c2VYLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW91c2VZLFxyXG4gICAgICAgICAgICAgICAgICAgIDggKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICAgICAgICAgIDggKiB0aGlzLnVwc2NhbGVTaXplXHJcbiAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMudGV4dChcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhvdEJhclt0aGlzLnBpY2tlZFVwU2xvdF0uc3RhY2tTaXplLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW91c2VYICsgMTAgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW91c2VZICsgMTAgKiB0aGlzLnVwc2NhbGVTaXplXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmV4cG9ydCA9IEdhbWVcclxuIiwiaW1wb3J0IEdhbWUgZnJvbSAnLi9HYW1lJztcclxuaW1wb3J0IHsgaW8gfSBmcm9tIFwic29ja2V0LmlvLWNsaWVudFwiO1xyXG5cclxuXHJcbi8vIENvbm5lY3QgdGhlIHNlcnZlclxyXG5cclxuY29uc3QgY29ubmVjdGlvbiA9IGlvKHsgYXV0aDogeyB0b2tlbjogd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKCd0b2tlbicpIH0gfSlcclxuXHJcbmV4cG9ydCBkZWZhdWx0IG5ldyBHYW1lKGNvbm5lY3Rpb24pOyIsImltcG9ydCBUaWxlUmVzb3VyY2UgZnJvbSAnLi9yZXNvdXJjZXMvVGlsZVJlc291cmNlJztcclxuaW1wb3J0IEltYWdlUmVzb3VyY2UgZnJvbSAnLi9yZXNvdXJjZXMvSW1hZ2VSZXNvdXJjZSc7XHJcbmltcG9ydCBSZWZsZWN0YWJsZUltYWdlUmVzb3VyY2UgZnJvbSAnLi9yZXNvdXJjZXMvUmVmbGVjdGVkSW1hZ2VSZXNvdXJjZSc7XHJcbmltcG9ydCBGb250UmVzb3VyY2UgZnJvbSAnLi9yZXNvdXJjZXMvRm9udFJlc291cmNlJztcclxuaW1wb3J0IFJlc291cmNlIGZyb20gJy4vcmVzb3VyY2VzL1Jlc291cmNlJztcclxuaW1wb3J0IEF1ZGlvUmVzb3VyY2VHcm91cCBmcm9tICcuL3Jlc291cmNlcy9BdWRpb1Jlc291cmNlR3JvdXAnO1xyXG5pbXBvcnQgUDUgZnJvbSAncDUnO1xyXG5pbXBvcnQgQXVkaW9SZXNvdXJjZSBmcm9tICcuL3Jlc291cmNlcy9BdWRpb1Jlc291cmNlJztcclxuXHJcbmludGVyZmFjZSBBc3NldEdyb3VwIHtcclxuICAgIFtuYW1lOiBzdHJpbmddOlxyXG4gICAgfCB7XHJcbiAgICAgICAgW25hbWU6IHN0cmluZ106IFJlc291cmNlIHwgQXNzZXRHcm91cCB8IEF1ZGlvUmVzb3VyY2VHcm91cCB8IEF1ZGlvUmVzb3VyY2UgfCBJbWFnZVJlc291cmNlW107XHJcbiAgICB9XHJcbiAgICB8IFJlc291cmNlIHwgQXNzZXRHcm91cCB8IEF1ZGlvUmVzb3VyY2VHcm91cCB8IEF1ZGlvUmVzb3VyY2UgfCBJbWFnZVJlc291cmNlW107XHJcbn1cclxuXHJcbi8vIFVpIHJlbGF0ZWQgYXNzZXRzXHJcbmNvbnN0IFVpQXNzZXRzID0ge1xyXG4gICAgdWlfc2xvdF9zZWxlY3RlZDogbmV3IEltYWdlUmVzb3VyY2UoXHJcbiAgICAgICAgJ2Fzc2V0cy90ZXh0dXJlcy91aS91aXNsb3Rfc2VsZWN0ZWQucG5nJ1xyXG4gICAgKSxcclxuICAgIHVpX3Nsb3Q6IG5ldyBJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvdWkvdWlzbG90LnBuZycpLFxyXG4gICAgdWlfZnJhbWU6IG5ldyBJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvdWkvdWlmcmFtZS5wbmcnKSxcclxuICAgIGJ1dHRvbl91bnNlbGVjdGVkOiBuZXcgSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3VpL2J1dHRvbjAucG5nJyksXHJcbiAgICBidXR0b25fc2VsZWN0ZWQ6IG5ldyBJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvdWkvYnV0dG9uMS5wbmcnKSxcclxuICAgIHNsaWRlcl9iYXI6IG5ldyBJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvdWkvc2xpZGVyQmFyLnBuZycpLFxyXG4gICAgc2xpZGVyX2hhbmRsZTogbmV3IEltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy91aS9zbGlkZXJIYW5kbGUucG5nJyksXHJcbiAgICB0aXRsZV9pbWFnZTogbmV3IEltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy91aS9zbm93ZWRpbkJVTVAucG5nJyksXHJcbiAgICB2aWduZXR0ZTogbmV3IEltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy91aS92aWduZXR0ZS1leHBvcnQucG5nJyksXHJcbn07XHJcblxyXG4vLyBJdGVtIHJlbGF0ZWQgYXNzZXRzXHJcbmNvbnN0IEl0ZW1zQXNzZXRzID0ge1xyXG4gICAgcmVzb3VyY2VzOiB7XHJcbiAgICAgICAgaWNlX3NoYXJkOiBuZXcgSW1hZ2VSZXNvdXJjZShcclxuICAgICAgICAgICAgJ2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9yZXNvdXJjZV9pY2Vfc2hhcmRzLnBuZydcclxuICAgICAgICApLFxyXG4gICAgICAgIHNub3diYWxsOiBuZXcgSW1hZ2VSZXNvdXJjZShcclxuICAgICAgICAgICAgJ2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9yZXNvdXJjZV9zbm93YmFsbC5wbmcnXHJcbiAgICAgICAgKSxcclxuICAgIH0sXHJcbiAgICBjb25zdW1hYmxlczoge1xyXG4gICAgICAgIHNub3dfYmVycmllczogbmV3IEltYWdlUmVzb3VyY2UoXHJcbiAgICAgICAgICAgICdhc3NldHMvdGV4dHVyZXMvaXRlbXMvY29uc3VtYWJsZV9zbm93X2JlcnJpZXMucG5nJ1xyXG4gICAgICAgICksXHJcbiAgICB9LFxyXG4gICAgYmxvY2tzOiB7XHJcbiAgICAgICAgaWNlOiBuZXcgSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL2l0ZW1zL2Jsb2NrX2ljZS5wbmcnKSxcclxuICAgICAgICBzbm93OiBuZXcgSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL2l0ZW1zL2Jsb2NrX3Nub3cucG5nJyksXHJcbiAgICB9LFxyXG4gICAgdG9vbHM6IHt9LFxyXG59O1xyXG5cclxuLy8gV29ybGQgcmVsYXRlZCBhc3NldHNcclxuY29uc3QgV29ybGRBc3NldHMgPSB7XHJcbiAgICBzaGFkZXJSZXNvdXJjZXM6IHtcclxuICAgICAgICBza3lJbWFnZTogbmV3IEltYWdlUmVzb3VyY2UoXHJcbiAgICAgICAgICAgICdhc3NldHMvdGV4dHVyZXMvc2hhZGVyX3Jlc291cmNlcy9wb2lzc29uc25vdy5wbmcnXHJcbiAgICAgICAgKSxcclxuICAgIH0sXHJcbiAgICBtaWRkbGVncm91bmQ6IHtcclxuICAgICAgICB0aWxlc2V0X2ljZTogbmV3IFRpbGVSZXNvdXJjZShcclxuICAgICAgICAgICAgJ2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9taWRkbGVncm91bmQvdGlsZXNldF9pY2UucG5nJyxcclxuICAgICAgICAgICAgMTYsXHJcbiAgICAgICAgICAgIDEsXHJcbiAgICAgICAgICAgIDgsXHJcbiAgICAgICAgICAgIDhcclxuICAgICAgICApLFxyXG4gICAgICAgIHRpbGVzZXRfc25vdzogbmV3IFRpbGVSZXNvdXJjZShcclxuICAgICAgICAgICAgJ2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9taWRkbGVncm91bmQvdGlsZXNldF9zbm93LnBuZycsXHJcbiAgICAgICAgICAgIDE2LFxyXG4gICAgICAgICAgICAxLFxyXG4gICAgICAgICAgICA4LFxyXG4gICAgICAgICAgICA4XHJcbiAgICAgICAgKSxcclxuICAgICAgICB0aWxlc2V0X2RpcnQ6IG5ldyBUaWxlUmVzb3VyY2UoXHJcbiAgICAgICAgICAgICdhc3NldHMvdGV4dHVyZXMvd29ybGQvbWlkZGxlZ3JvdW5kL3RpbGVzZXRfZGlydDAucG5nJyxcclxuICAgICAgICAgICAgMTYsXHJcbiAgICAgICAgICAgIDEsXHJcbiAgICAgICAgICAgIDgsXHJcbiAgICAgICAgICAgIDhcclxuICAgICAgICApLFxyXG4gICAgICAgIHRpbGVzZXRfc3RvbmUwOiBuZXcgVGlsZVJlc291cmNlKFxyXG4gICAgICAgICAgICAnYXNzZXRzL3RleHR1cmVzL3dvcmxkL21pZGRsZWdyb3VuZC90aWxlc2V0X3N0b25lMC5wbmcnLFxyXG4gICAgICAgICAgICAxNixcclxuICAgICAgICAgICAgMSxcclxuICAgICAgICAgICAgOCxcclxuICAgICAgICAgICAgOFxyXG4gICAgICAgICksXHJcbiAgICAgICAgdGlsZXNldF9zdG9uZTE6IG5ldyBUaWxlUmVzb3VyY2UoXHJcbiAgICAgICAgICAgICdhc3NldHMvdGV4dHVyZXMvd29ybGQvbWlkZGxlZ3JvdW5kL3RpbGVzZXRfc3RvbmUxLnBuZycsXHJcbiAgICAgICAgICAgIDE2LFxyXG4gICAgICAgICAgICAxLFxyXG4gICAgICAgICAgICA4LFxyXG4gICAgICAgICAgICA4XHJcbiAgICAgICAgKSxcclxuICAgICAgICB0aWxlc2V0X3N0b25lMjogbmV3IFRpbGVSZXNvdXJjZShcclxuICAgICAgICAgICAgJ2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9taWRkbGVncm91bmQvdGlsZXNldF9zdG9uZTIucG5nJyxcclxuICAgICAgICAgICAgMTYsXHJcbiAgICAgICAgICAgIDEsXHJcbiAgICAgICAgICAgIDgsXHJcbiAgICAgICAgICAgIDhcclxuICAgICAgICApLFxyXG4gICAgICAgIHRpbGVzZXRfc3RvbmUzOiBuZXcgVGlsZVJlc291cmNlKFxyXG4gICAgICAgICAgICAnYXNzZXRzL3RleHR1cmVzL3dvcmxkL21pZGRsZWdyb3VuZC90aWxlc2V0X3N0b25lMy5wbmcnLFxyXG4gICAgICAgICAgICAxNixcclxuICAgICAgICAgICAgMSxcclxuICAgICAgICAgICAgOCxcclxuICAgICAgICAgICAgOFxyXG4gICAgICAgICksXHJcbiAgICAgICAgdGlsZXNldF9zdG9uZTQ6IG5ldyBUaWxlUmVzb3VyY2UoXHJcbiAgICAgICAgICAgICdhc3NldHMvdGV4dHVyZXMvd29ybGQvbWlkZGxlZ3JvdW5kL3RpbGVzZXRfc3RvbmU0LnBuZycsXHJcbiAgICAgICAgICAgIDE2LFxyXG4gICAgICAgICAgICAxLFxyXG4gICAgICAgICAgICA4LFxyXG4gICAgICAgICAgICA4XHJcbiAgICAgICAgKSxcclxuICAgICAgICB0aWxlc2V0X3N0b25lNTogbmV3IFRpbGVSZXNvdXJjZShcclxuICAgICAgICAgICAgJ2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9taWRkbGVncm91bmQvdGlsZXNldF9zdG9uZTUucG5nJyxcclxuICAgICAgICAgICAgMTYsXHJcbiAgICAgICAgICAgIDEsXHJcbiAgICAgICAgICAgIDgsXHJcbiAgICAgICAgICAgIDhcclxuICAgICAgICApLFxyXG4gICAgICAgIHRpbGVzZXRfc3RvbmU2OiBuZXcgVGlsZVJlc291cmNlKFxyXG4gICAgICAgICAgICAnYXNzZXRzL3RleHR1cmVzL3dvcmxkL21pZGRsZWdyb3VuZC90aWxlc2V0X3N0b25lNi5wbmcnLFxyXG4gICAgICAgICAgICAxNixcclxuICAgICAgICAgICAgMSxcclxuICAgICAgICAgICAgOCxcclxuICAgICAgICAgICAgOFxyXG4gICAgICAgICksXHJcbiAgICAgICAgdGlsZXNldF9zdG9uZTc6IG5ldyBUaWxlUmVzb3VyY2UoXHJcbiAgICAgICAgICAgICdhc3NldHMvdGV4dHVyZXMvd29ybGQvbWlkZGxlZ3JvdW5kL3RpbGVzZXRfc3RvbmU3LnBuZycsXHJcbiAgICAgICAgICAgIDE2LFxyXG4gICAgICAgICAgICAxLFxyXG4gICAgICAgICAgICA4LFxyXG4gICAgICAgICAgICA4XHJcbiAgICAgICAgKSxcclxuICAgICAgICB0aWxlc2V0X3N0b25lODogbmV3IFRpbGVSZXNvdXJjZShcclxuICAgICAgICAgICAgJ2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9taWRkbGVncm91bmQvdGlsZXNldF9zdG9uZTgucG5nJyxcclxuICAgICAgICAgICAgMTYsXHJcbiAgICAgICAgICAgIDEsXHJcbiAgICAgICAgICAgIDgsXHJcbiAgICAgICAgICAgIDhcclxuICAgICAgICApLFxyXG4gICAgICAgIHRpbGVzZXRfc3RvbmU5OiBuZXcgVGlsZVJlc291cmNlKFxyXG4gICAgICAgICAgICAnYXNzZXRzL3RleHR1cmVzL3dvcmxkL21pZGRsZWdyb3VuZC90aWxlc2V0X3N0b25lOS5wbmcnLFxyXG4gICAgICAgICAgICAxNixcclxuICAgICAgICAgICAgMSxcclxuICAgICAgICAgICAgOCxcclxuICAgICAgICAgICAgOFxyXG4gICAgICAgICksXHJcbiAgICB9LFxyXG4gICAgZm9yZWdyb3VuZDoge1xyXG4gICAgICAgIHRpbGVzZXRfcGlwZTogbmV3IFRpbGVSZXNvdXJjZShcclxuICAgICAgICAgICAgJ2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9mb3JlZ3JvdW5kL3RpbGVzZXRfcGlwZS5wbmcnLFxyXG4gICAgICAgICAgICAxNixcclxuICAgICAgICAgICAgMSxcclxuICAgICAgICAgICAgOCxcclxuICAgICAgICAgICAgOFxyXG4gICAgICAgICksXHJcbiAgICB9LFxyXG4gICAgdGlsZUVudGl0aWVzOiB7XHJcbiAgICAgICAgZW50aXR5X3QxZHJpbGw6IFtcclxuICAgICAgICAgICAgbmV3IEltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy93b3JsZC90aWxlRW50aXRpZXMvUnVzdHkgRHJpbGwvUnVzdHlEcmlsbDEucG5nJyksXHJcbiAgICAgICAgICAgIG5ldyBJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvd29ybGQvdGlsZUVudGl0aWVzL1J1c3R5IERyaWxsL1J1c3R5RHJpbGwyLnBuZycpLFxyXG4gICAgICAgICAgICBuZXcgSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3dvcmxkL3RpbGVFbnRpdGllcy9SdXN0eSBEcmlsbC9SdXN0eURyaWxsMy5wbmcnKSxcclxuICAgICAgICAgICAgbmV3IEltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy93b3JsZC90aWxlRW50aXRpZXMvUnVzdHkgRHJpbGwvUnVzdHlEcmlsbDQucG5nJyksXHJcbiAgICAgICAgICAgIG5ldyBJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvd29ybGQvdGlsZUVudGl0aWVzL1J1c3R5IERyaWxsL1J1c3R5RHJpbGw1LnBuZycpLFxyXG4gICAgICAgICAgICBuZXcgSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3dvcmxkL3RpbGVFbnRpdGllcy9SdXN0eSBEcmlsbC9SdXN0eURyaWxsNi5wbmcnKSxcclxuICAgICAgICAgICAgbmV3IEltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy93b3JsZC90aWxlRW50aXRpZXMvUnVzdHkgRHJpbGwvUnVzdHlEcmlsbDcucG5nJyksXHJcbiAgICAgICAgICAgIG5ldyBJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvd29ybGQvdGlsZUVudGl0aWVzL1J1c3R5IERyaWxsL1J1c3R5RHJpbGw4LnBuZycpLFxyXG4gICAgICAgICAgICBuZXcgSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3dvcmxkL3RpbGVFbnRpdGllcy9SdXN0eSBEcmlsbC9SdXN0eURyaWxsOS5wbmcnKSxcclxuICAgICAgICAgICAgbmV3IEltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy93b3JsZC90aWxlRW50aXRpZXMvUnVzdHkgRHJpbGwvUnVzdHlEcmlsbDEwLnBuZycpLFxyXG4gICAgICAgICAgICBuZXcgSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3dvcmxkL3RpbGVFbnRpdGllcy9SdXN0eSBEcmlsbC9SdXN0eURyaWxsMTEucG5nJyksXHJcbiAgICAgICAgICAgIG5ldyBJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvd29ybGQvdGlsZUVudGl0aWVzL1J1c3R5IERyaWxsL1J1c3R5RHJpbGwxMi5wbmcnKSxcclxuICAgICAgICAgICAgbmV3IEltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy93b3JsZC90aWxlRW50aXRpZXMvUnVzdHkgRHJpbGwvUnVzdHlEcmlsbDEzLnBuZycpXHJcbiAgICAgICAgXSxcclxuICAgICAgICBlbnRpdHlfdDFkcm9uZTogW1xyXG4gICAgICAgICAgICBuZXcgSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUwMS5wbmcnKSxcclxuICAgICAgICAgICAgbmV3IEltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9lbnRpdGllcy9TbWFsbCBEcm9uZS9TbWFsbERyb25lMDIucG5nJyksXHJcbiAgICAgICAgICAgIG5ldyBJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvd29ybGQvZW50aXRpZXMvU21hbGwgRHJvbmUvU21hbGxEcm9uZTAzLnBuZycpLFxyXG4gICAgICAgICAgICBuZXcgSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUwNC5wbmcnKSxcclxuICAgICAgICAgICAgbmV3IEltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9lbnRpdGllcy9TbWFsbCBEcm9uZS9TbWFsbERyb25lMDUucG5nJyksXHJcbiAgICAgICAgICAgIG5ldyBJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvd29ybGQvZW50aXRpZXMvU21hbGwgRHJvbmUvU21hbGxEcm9uZTA2LnBuZycpLFxyXG4gICAgICAgICAgICBuZXcgSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUwNy5wbmcnKSxcclxuICAgICAgICAgICAgbmV3IEltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9lbnRpdGllcy9TbWFsbCBEcm9uZS9TbWFsbERyb25lMDgucG5nJyksXHJcbiAgICAgICAgICAgIG5ldyBJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvd29ybGQvZW50aXRpZXMvU21hbGwgRHJvbmUvU21hbGxEcm9uZTA5LnBuZycpLFxyXG4gICAgICAgICAgICBuZXcgSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUxMC5wbmcnKSxcclxuICAgICAgICAgICAgbmV3IEltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9lbnRpdGllcy9TbWFsbCBEcm9uZS9TbWFsbERyb25lMTEucG5nJyksXHJcbiAgICAgICAgICAgIG5ldyBJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvd29ybGQvZW50aXRpZXMvU21hbGwgRHJvbmUvU21hbGxEcm9uZTEyLnBuZycpLFxyXG4gICAgICAgICAgICBuZXcgSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUxMy5wbmcnKSxcclxuICAgICAgICAgICAgbmV3IEltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9lbnRpdGllcy9TbWFsbCBEcm9uZS9TbWFsbERyb25lMTQucG5nJyksXHJcbiAgICAgICAgICAgIG5ldyBJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvd29ybGQvZW50aXRpZXMvU21hbGwgRHJvbmUvU21hbGxEcm9uZTE1LnBuZycpLFxyXG4gICAgICAgICAgICBuZXcgSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUxNi5wbmcnKSxcclxuICAgICAgICAgICAgbmV3IEltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9lbnRpdGllcy9TbWFsbCBEcm9uZS9TbWFsbERyb25lMTcucG5nJyksXHJcbiAgICAgICAgICAgIG5ldyBJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvd29ybGQvZW50aXRpZXMvU21hbGwgRHJvbmUvU21hbGxEcm9uZTE4LnBuZycpLFxyXG4gICAgICAgICAgICBuZXcgSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUxOS5wbmcnKSxcclxuICAgICAgICAgICAgbmV3IEltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9lbnRpdGllcy9TbWFsbCBEcm9uZS9TbWFsbERyb25lMjAucG5nJylcclxuICAgICAgICBdXHJcbiAgICB9XHJcbn07XHJcblxyXG5jb25zdCBGb250cyA9IHtcclxuICAgIHRpdGxlOiBuZXcgRm9udFJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvdWkvZm9udC5wbmcnLCB7XHJcbiAgICAgICAgXCIwXCI6IDcsXHJcbiAgICAgICAgXCIxXCI6IDcsXHJcbiAgICAgICAgXCIyXCI6IDcsXHJcbiAgICAgICAgXCIzXCI6IDYsXHJcbiAgICAgICAgXCI0XCI6IDYsXHJcbiAgICAgICAgXCI1XCI6IDYsXHJcbiAgICAgICAgXCI2XCI6IDYsXHJcbiAgICAgICAgXCI3XCI6IDcsXHJcbiAgICAgICAgXCI4XCI6IDcsXHJcbiAgICAgICAgXCI5XCI6IDYsXHJcbiAgICAgICAgXCJBXCI6IDYsXHJcbiAgICAgICAgXCJCXCI6IDcsXHJcbiAgICAgICAgXCJDXCI6IDcsXHJcbiAgICAgICAgXCJEXCI6IDYsXHJcbiAgICAgICAgXCJFXCI6IDcsXHJcbiAgICAgICAgXCJGXCI6IDYsXHJcbiAgICAgICAgXCJHXCI6IDcsXHJcbiAgICAgICAgXCJIXCI6IDcsXHJcbiAgICAgICAgXCJJXCI6IDcsXHJcbiAgICAgICAgXCJKXCI6IDgsXHJcbiAgICAgICAgXCJLXCI6IDYsXHJcbiAgICAgICAgXCJMXCI6IDYsXHJcbiAgICAgICAgXCJNXCI6IDgsXHJcbiAgICAgICAgXCJOXCI6IDgsXHJcbiAgICAgICAgXCJPXCI6IDgsXHJcbiAgICAgICAgXCJQXCI6IDksXHJcbiAgICAgICAgXCJRXCI6IDgsXHJcbiAgICAgICAgXCJSXCI6IDcsXHJcbiAgICAgICAgXCJTXCI6IDcsXHJcbiAgICAgICAgXCJUXCI6IDgsXHJcbiAgICAgICAgXCJVXCI6IDgsXHJcbiAgICAgICAgXCJWXCI6IDgsXHJcbiAgICAgICAgXCJXXCI6IDEwLFxyXG4gICAgICAgIFwiWFwiOiA4LFxyXG4gICAgICAgIFwiWVwiOiA4LFxyXG4gICAgICAgIFwiWlwiOiA5LFxyXG4gICAgICAgIFwiYVwiOiA3LFxyXG4gICAgICAgIFwiYlwiOiA3LFxyXG4gICAgICAgIFwiY1wiOiA2LFxyXG4gICAgICAgIFwiZFwiOiA3LFxyXG4gICAgICAgIFwiZVwiOiA2LFxyXG4gICAgICAgIFwiZlwiOiA2LFxyXG4gICAgICAgIFwiZ1wiOiA2LFxyXG4gICAgICAgIFwiaFwiOiA2LFxyXG4gICAgICAgIFwiaVwiOiA1LFxyXG4gICAgICAgIFwialwiOiA2LFxyXG4gICAgICAgIFwia1wiOiA1LFxyXG4gICAgICAgIFwibFwiOiA1LFxyXG4gICAgICAgIFwibVwiOiA4LFxyXG4gICAgICAgIFwiblwiOiA1LFxyXG4gICAgICAgIFwib1wiOiA1LFxyXG4gICAgICAgIFwicFwiOiA1LFxyXG4gICAgICAgIFwicVwiOiA3LFxyXG4gICAgICAgIFwiclwiOiA1LFxyXG4gICAgICAgIFwic1wiOiA0LFxyXG4gICAgICAgIFwidFwiOiA1LFxyXG4gICAgICAgIFwidVwiOiA1LFxyXG4gICAgICAgIFwidlwiOiA1LFxyXG4gICAgICAgIFwid1wiOiA3LFxyXG4gICAgICAgIFwieFwiOiA2LFxyXG4gICAgICAgIFwieVwiOiA1LFxyXG4gICAgICAgIFwielwiOiA1LFxyXG4gICAgICAgIFwiIVwiOiA0LFxyXG4gICAgICAgIFwiLlwiOiAyLFxyXG4gICAgICAgIFwiLFwiOiAyLFxyXG4gICAgICAgIFwiP1wiOiA2LFxyXG4gICAgICAgIFwiX1wiOiA2LFxyXG4gICAgICAgIFwiLVwiOiA0LFxyXG4gICAgICAgIFwiOlwiOiAyLFxyXG4gICAgICAgIFwiIFwiOiAyXHJcbiAgICB9LCBcIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5IS4sP18tOiBcIiksXHJcblxyXG4gICAgYmlnOiBuZXcgRm9udFJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvdWkvZm9udEJpZy5wbmcnLCB7XHJcbiAgICAgICAgXCIwXCI6IDE0LFxyXG4gICAgICAgIFwiMVwiOiAxNCxcclxuICAgICAgICBcIjJcIjogMTQsXHJcbiAgICAgICAgXCIzXCI6IDEyLFxyXG4gICAgICAgIFwiNFwiOiAxMixcclxuICAgICAgICBcIjVcIjogMTIsXHJcbiAgICAgICAgXCI2XCI6IDEyLFxyXG4gICAgICAgIFwiN1wiOiAxNCxcclxuICAgICAgICBcIjhcIjogMTQsXHJcbiAgICAgICAgXCI5XCI6IDEyLFxyXG4gICAgICAgIFwiQVwiOiAxMixcclxuICAgICAgICBcIkJcIjogMTQsXHJcbiAgICAgICAgXCJDXCI6IDE0LFxyXG4gICAgICAgIFwiRFwiOiAxMixcclxuICAgICAgICBcIkVcIjogMTQsXHJcbiAgICAgICAgXCJGXCI6IDEyLFxyXG4gICAgICAgIFwiR1wiOiAxNCxcclxuICAgICAgICBcIkhcIjogMTQsXHJcbiAgICAgICAgXCJJXCI6IDE0LFxyXG4gICAgICAgIFwiSlwiOiAxNixcclxuICAgICAgICBcIktcIjogMTIsXHJcbiAgICAgICAgXCJMXCI6IDEyLFxyXG4gICAgICAgIFwiTVwiOiAxNixcclxuICAgICAgICBcIk5cIjogMTYsXHJcbiAgICAgICAgXCJPXCI6IDE2LFxyXG4gICAgICAgIFwiUFwiOiAxOCxcclxuICAgICAgICBcIlFcIjogMTYsXHJcbiAgICAgICAgXCJSXCI6IDE0LFxyXG4gICAgICAgIFwiU1wiOiAxNCxcclxuICAgICAgICBcIlRcIjogMTYsXHJcbiAgICAgICAgXCJVXCI6IDE2LFxyXG4gICAgICAgIFwiVlwiOiAxNixcclxuICAgICAgICBcIldcIjogMjAsXHJcbiAgICAgICAgXCJYXCI6IDE2LFxyXG4gICAgICAgIFwiWVwiOiAxNixcclxuICAgICAgICBcIlpcIjogMTgsXHJcbiAgICAgICAgXCJhXCI6IDE0LFxyXG4gICAgICAgIFwiYlwiOiAxNCxcclxuICAgICAgICBcImNcIjogMTIsXHJcbiAgICAgICAgXCJkXCI6IDE0LFxyXG4gICAgICAgIFwiZVwiOiAxMixcclxuICAgICAgICBcImZcIjogMTIsXHJcbiAgICAgICAgXCJnXCI6IDEyLFxyXG4gICAgICAgIFwiaFwiOiAxMixcclxuICAgICAgICBcImlcIjogMTAsXHJcbiAgICAgICAgXCJqXCI6IDEyLFxyXG4gICAgICAgIFwia1wiOiAxMCxcclxuICAgICAgICBcImxcIjogMTAsXHJcbiAgICAgICAgXCJtXCI6IDE2LFxyXG4gICAgICAgIFwiblwiOiAxMCxcclxuICAgICAgICBcIm9cIjogMTAsXHJcbiAgICAgICAgXCJwXCI6IDEwLFxyXG4gICAgICAgIFwicVwiOiAxNCxcclxuICAgICAgICBcInJcIjogMTAsXHJcbiAgICAgICAgXCJzXCI6IDgsXHJcbiAgICAgICAgXCJ0XCI6IDEwLFxyXG4gICAgICAgIFwidVwiOiAxMCxcclxuICAgICAgICBcInZcIjogMTAsXHJcbiAgICAgICAgXCJ3XCI6IDE0LFxyXG4gICAgICAgIFwieFwiOiAxMixcclxuICAgICAgICBcInlcIjogMTAsXHJcbiAgICAgICAgXCJ6XCI6IDEwLFxyXG4gICAgICAgIFwiIVwiOiA4LFxyXG4gICAgICAgIFwiLlwiOiA0LFxyXG4gICAgICAgIFwiLFwiOiA0LFxyXG4gICAgICAgIFwiP1wiOiAxMixcclxuICAgICAgICBcIl9cIjogMTIsXHJcbiAgICAgICAgXCItXCI6IDgsXHJcbiAgICAgICAgXCI6XCI6IDQsXHJcbiAgICAgICAgXCIgXCI6IDRcclxuICAgIH0sIFwiQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkhLiw/Xy06IFwiKSxcclxuXHJcbn07XHJcblxyXG5jb25zdCBLZXlzID0ge1xyXG4gICAga2V5Ym9hcmRNYXA6IFtcclxuICAgICAgICBcIlwiLCAvLyBbMF1cclxuICAgICAgICBcIlwiLCAvLyBbMV1cclxuICAgICAgICBcIlwiLCAvLyBbMl1cclxuICAgICAgICBcIkNBTkNFTFwiLCAvLyBbM11cclxuICAgICAgICBcIlwiLCAvLyBbNF1cclxuICAgICAgICBcIlwiLCAvLyBbNV1cclxuICAgICAgICBcIkhFTFBcIiwgLy8gWzZdXHJcbiAgICAgICAgXCJcIiwgLy8gWzddXHJcbiAgICAgICAgXCJCQUNLU1BBQ0VcIiwgLy8gWzhdXHJcbiAgICAgICAgXCJUQUJcIiwgLy8gWzldXHJcbiAgICAgICAgXCJcIiwgLy8gWzEwXVxyXG4gICAgICAgIFwiXCIsIC8vIFsxMV1cclxuICAgICAgICBcIkNMRUFSXCIsIC8vIFsxMl1cclxuICAgICAgICBcIkVOVEVSXCIsIC8vIFsxM11cclxuICAgICAgICBcIkVOVEVSIFNQRUNJQUxcIiwgLy8gWzE0XVxyXG4gICAgICAgIFwiXCIsIC8vIFsxNV1cclxuICAgICAgICBcIlNISUZUXCIsIC8vIFsxNl1cclxuICAgICAgICBcIkNPTlRST0xcIiwgLy8gWzE3XVxyXG4gICAgICAgIFwiQUxUXCIsIC8vIFsxOF1cclxuICAgICAgICBcIlBBVVNFXCIsIC8vIFsxOV1cclxuICAgICAgICBcIkNBUFMgTE9DS1wiLCAvLyBbMjBdXHJcbiAgICAgICAgXCJLQU5BXCIsIC8vIFsyMV1cclxuICAgICAgICBcIkVJU1VcIiwgLy8gWzIyXVxyXG4gICAgICAgIFwiSlVOSkFcIiwgLy8gWzIzXVxyXG4gICAgICAgIFwiRklOQUxcIiwgLy8gWzI0XVxyXG4gICAgICAgIFwiSEFOSkFcIiwgLy8gWzI1XVxyXG4gICAgICAgIFwiXCIsIC8vIFsyNl1cclxuICAgICAgICBcIkVTQ0FQRVwiLCAvLyBbMjddXHJcbiAgICAgICAgXCJDT05WRVJUXCIsIC8vIFsyOF1cclxuICAgICAgICBcIk5PTkNPTlZFUlRcIiwgLy8gWzI5XVxyXG4gICAgICAgIFwiQUNDRVBUXCIsIC8vIFszMF1cclxuICAgICAgICBcIk1PREVDSEFOR0VcIiwgLy8gWzMxXVxyXG4gICAgICAgIFwiU1BBQ0VcIiwgLy8gWzMyXVxyXG4gICAgICAgIFwiUEFHRSBVUFwiLCAvLyBbMzNdXHJcbiAgICAgICAgXCJQQUdFIERPV05cIiwgLy8gWzM0XVxyXG4gICAgICAgIFwiRU5EXCIsIC8vIFszNV1cclxuICAgICAgICBcIkhPTUVcIiwgLy8gWzM2XVxyXG4gICAgICAgIFwiTEVGVFwiLCAvLyBbMzddXHJcbiAgICAgICAgXCJVUFwiLCAvLyBbMzhdXHJcbiAgICAgICAgXCJSSUdIVFwiLCAvLyBbMzldXHJcbiAgICAgICAgXCJET1dOXCIsIC8vIFs0MF1cclxuICAgICAgICBcIlNFTEVDVFwiLCAvLyBbNDFdXHJcbiAgICAgICAgXCJQUklOVFwiLCAvLyBbNDJdXHJcbiAgICAgICAgXCJFWEVDVVRFXCIsIC8vIFs0M11cclxuICAgICAgICBcIlBSSU5UIFNDUkVFTlwiLCAvLyBbNDRdXHJcbiAgICAgICAgXCJJTlNFUlRcIiwgLy8gWzQ1XVxyXG4gICAgICAgIFwiREVMRVRFXCIsIC8vIFs0Nl1cclxuICAgICAgICBcIlwiLCAvLyBbNDddXHJcbiAgICAgICAgXCIwXCIsIC8vIFs0OF1cclxuICAgICAgICBcIjFcIiwgLy8gWzQ5XVxyXG4gICAgICAgIFwiMlwiLCAvLyBbNTBdXHJcbiAgICAgICAgXCIzXCIsIC8vIFs1MV1cclxuICAgICAgICBcIjRcIiwgLy8gWzUyXVxyXG4gICAgICAgIFwiNVwiLCAvLyBbNTNdXHJcbiAgICAgICAgXCI2XCIsIC8vIFs1NF1cclxuICAgICAgICBcIjdcIiwgLy8gWzU1XVxyXG4gICAgICAgIFwiOFwiLCAvLyBbNTZdXHJcbiAgICAgICAgXCI5XCIsIC8vIFs1N11cclxuICAgICAgICBcIkNPTE9OXCIsIC8vIFs1OF1cclxuICAgICAgICBcIlNFTUlDT0xPTlwiLCAvLyBbNTldXHJcbiAgICAgICAgXCJMRVNTIFRIQU5cIiwgLy8gWzYwXVxyXG4gICAgICAgIFwiRVFVQUxTXCIsIC8vIFs2MV1cclxuICAgICAgICBcIkdSRUFURVIgVEhBTlwiLCAvLyBbNjJdXHJcbiAgICAgICAgXCJRVUVTVElPTiBNQVJLXCIsIC8vIFs2M11cclxuICAgICAgICBcIkFUXCIsIC8vIFs2NF1cclxuICAgICAgICBcIkFcIiwgLy8gWzY1XVxyXG4gICAgICAgIFwiQlwiLCAvLyBbNjZdXHJcbiAgICAgICAgXCJDXCIsIC8vIFs2N11cclxuICAgICAgICBcIkRcIiwgLy8gWzY4XVxyXG4gICAgICAgIFwiRVwiLCAvLyBbNjldXHJcbiAgICAgICAgXCJGXCIsIC8vIFs3MF1cclxuICAgICAgICBcIkdcIiwgLy8gWzcxXVxyXG4gICAgICAgIFwiSFwiLCAvLyBbNzJdXHJcbiAgICAgICAgXCJJXCIsIC8vIFs3M11cclxuICAgICAgICBcIkpcIiwgLy8gWzc0XVxyXG4gICAgICAgIFwiS1wiLCAvLyBbNzVdXHJcbiAgICAgICAgXCJMXCIsIC8vIFs3Nl1cclxuICAgICAgICBcIk1cIiwgLy8gWzc3XVxyXG4gICAgICAgIFwiTlwiLCAvLyBbNzhdXHJcbiAgICAgICAgXCJPXCIsIC8vIFs3OV1cclxuICAgICAgICBcIlBcIiwgLy8gWzgwXVxyXG4gICAgICAgIFwiUVwiLCAvLyBbODFdXHJcbiAgICAgICAgXCJSXCIsIC8vIFs4Ml1cclxuICAgICAgICBcIlNcIiwgLy8gWzgzXVxyXG4gICAgICAgIFwiVFwiLCAvLyBbODRdXHJcbiAgICAgICAgXCJVXCIsIC8vIFs4NV1cclxuICAgICAgICBcIlZcIiwgLy8gWzg2XVxyXG4gICAgICAgIFwiV1wiLCAvLyBbODddXHJcbiAgICAgICAgXCJYXCIsIC8vIFs4OF1cclxuICAgICAgICBcIllcIiwgLy8gWzg5XVxyXG4gICAgICAgIFwiWlwiLCAvLyBbOTBdXHJcbiAgICAgICAgXCJPUyBLRVlcIiwgLy8gWzkxXSBXaW5kb3dzIEtleSAoV2luZG93cykgb3IgQ29tbWFuZCBLZXkgKE1hYylcclxuICAgICAgICBcIlwiLCAvLyBbOTJdXHJcbiAgICAgICAgXCJDT05URVhUIE1FTlVcIiwgLy8gWzkzXVxyXG4gICAgICAgIFwiXCIsIC8vIFs5NF1cclxuICAgICAgICBcIlNMRUVQXCIsIC8vIFs5NV1cclxuICAgICAgICBcIk5VTVBBRDBcIiwgLy8gWzk2XVxyXG4gICAgICAgIFwiTlVNUEFEMVwiLCAvLyBbOTddXHJcbiAgICAgICAgXCJOVU1QQUQyXCIsIC8vIFs5OF1cclxuICAgICAgICBcIk5VTVBBRDNcIiwgLy8gWzk5XVxyXG4gICAgICAgIFwiTlVNUEFENFwiLCAvLyBbMTAwXVxyXG4gICAgICAgIFwiTlVNUEFENVwiLCAvLyBbMTAxXVxyXG4gICAgICAgIFwiTlVNUEFENlwiLCAvLyBbMTAyXVxyXG4gICAgICAgIFwiTlVNUEFEN1wiLCAvLyBbMTAzXVxyXG4gICAgICAgIFwiTlVNUEFEOFwiLCAvLyBbMTA0XVxyXG4gICAgICAgIFwiTlVNUEFEOVwiLCAvLyBbMTA1XVxyXG4gICAgICAgIFwiTVVMVElQTFlcIiwgLy8gWzEwNl1cclxuICAgICAgICBcIkFERFwiLCAvLyBbMTA3XVxyXG4gICAgICAgIFwiU0VQQVJBVE9SXCIsIC8vIFsxMDhdXHJcbiAgICAgICAgXCJTVUJUUkFDVFwiLCAvLyBbMTA5XVxyXG4gICAgICAgIFwiREVDSU1BTFwiLCAvLyBbMTEwXVxyXG4gICAgICAgIFwiRElWSURFXCIsIC8vIFsxMTFdXHJcbiAgICAgICAgXCJGMVwiLCAvLyBbMTEyXVxyXG4gICAgICAgIFwiRjJcIiwgLy8gWzExM11cclxuICAgICAgICBcIkYzXCIsIC8vIFsxMTRdXHJcbiAgICAgICAgXCJGNFwiLCAvLyBbMTE1XVxyXG4gICAgICAgIFwiRjVcIiwgLy8gWzExNl1cclxuICAgICAgICBcIkY2XCIsIC8vIFsxMTddXHJcbiAgICAgICAgXCJGN1wiLCAvLyBbMTE4XVxyXG4gICAgICAgIFwiRjhcIiwgLy8gWzExOV1cclxuICAgICAgICBcIkY5XCIsIC8vIFsxMjBdXHJcbiAgICAgICAgXCJGMTBcIiwgLy8gWzEyMV1cclxuICAgICAgICBcIkYxMVwiLCAvLyBbMTIyXVxyXG4gICAgICAgIFwiRjEyXCIsIC8vIFsxMjNdXHJcbiAgICAgICAgXCJGMTNcIiwgLy8gWzEyNF1cclxuICAgICAgICBcIkYxNFwiLCAvLyBbMTI1XVxyXG4gICAgICAgIFwiRjE1XCIsIC8vIFsxMjZdXHJcbiAgICAgICAgXCJGMTZcIiwgLy8gWzEyN11cclxuICAgICAgICBcIkYxN1wiLCAvLyBbMTI4XVxyXG4gICAgICAgIFwiRjE4XCIsIC8vIFsxMjldXHJcbiAgICAgICAgXCJGMTlcIiwgLy8gWzEzMF1cclxuICAgICAgICBcIkYyMFwiLCAvLyBbMTMxXVxyXG4gICAgICAgIFwiRjIxXCIsIC8vIFsxMzJdXHJcbiAgICAgICAgXCJGMjJcIiwgLy8gWzEzM11cclxuICAgICAgICBcIkYyM1wiLCAvLyBbMTM0XVxyXG4gICAgICAgIFwiRjI0XCIsIC8vIFsxMzVdXHJcbiAgICAgICAgXCJcIiwgLy8gWzEzNl1cclxuICAgICAgICBcIlwiLCAvLyBbMTM3XVxyXG4gICAgICAgIFwiXCIsIC8vIFsxMzhdXHJcbiAgICAgICAgXCJcIiwgLy8gWzEzOV1cclxuICAgICAgICBcIlwiLCAvLyBbMTQwXVxyXG4gICAgICAgIFwiXCIsIC8vIFsxNDFdXHJcbiAgICAgICAgXCJcIiwgLy8gWzE0Ml1cclxuICAgICAgICBcIlwiLCAvLyBbMTQzXVxyXG4gICAgICAgIFwiTlVNIExPQ0tcIiwgLy8gWzE0NF1cclxuICAgICAgICBcIlNDUk9MTCBMT0NLXCIsIC8vIFsxNDVdXHJcbiAgICAgICAgXCJXSU4gT0VNIEZKIEpJU0hPXCIsIC8vIFsxNDZdXHJcbiAgICAgICAgXCJXSU4gT0VNIEZKIE1BU1NIT1VcIiwgLy8gWzE0N11cclxuICAgICAgICBcIldJTiBPRU0gRkogVE9VUk9LVVwiLCAvLyBbMTQ4XVxyXG4gICAgICAgIFwiV0lOIE9FTSBGSiBMT1lBXCIsIC8vIFsxNDldXHJcbiAgICAgICAgXCJXSU4gT0VNIEZKIFJPWUFcIiwgLy8gWzE1MF1cclxuICAgICAgICBcIlwiLCAvLyBbMTUxXVxyXG4gICAgICAgIFwiXCIsIC8vIFsxNTJdXHJcbiAgICAgICAgXCJcIiwgLy8gWzE1M11cclxuICAgICAgICBcIlwiLCAvLyBbMTU0XVxyXG4gICAgICAgIFwiXCIsIC8vIFsxNTVdXHJcbiAgICAgICAgXCJcIiwgLy8gWzE1Nl1cclxuICAgICAgICBcIlwiLCAvLyBbMTU3XVxyXG4gICAgICAgIFwiXCIsIC8vIFsxNThdXHJcbiAgICAgICAgXCJcIiwgLy8gWzE1OV1cclxuICAgICAgICBcIkNJUkNVTUZMRVhcIiwgLy8gWzE2MF1cclxuICAgICAgICBcIkVYQ0xBTUFUSU9OXCIsIC8vIFsxNjFdXHJcbiAgICAgICAgXCJET1VCTEVfUVVPVEVcIiwgLy8gWzE2Ml1cclxuICAgICAgICBcIkhBU0hcIiwgLy8gWzE2M11cclxuICAgICAgICBcIkRPTExBUlwiLCAvLyBbMTY0XVxyXG4gICAgICAgIFwiUEVSQ0VOVFwiLCAvLyBbMTY1XVxyXG4gICAgICAgIFwiQU1QRVJTQU5EXCIsIC8vIFsxNjZdXHJcbiAgICAgICAgXCJVTkRFUlNDT1JFXCIsIC8vIFsxNjddXHJcbiAgICAgICAgXCJPUEVOIFBBUkVOVEhFU0lTXCIsIC8vIFsxNjhdXHJcbiAgICAgICAgXCJDTE9TRSBQQVJFTlRIRVNJU1wiLCAvLyBbMTY5XVxyXG4gICAgICAgIFwiQVNURVJJU0tcIiwgLy8gWzE3MF1cclxuICAgICAgICBcIlBMVVNcIiwgLy8gWzE3MV1cclxuICAgICAgICBcIlBJUEVcIiwgLy8gWzE3Ml1cclxuICAgICAgICBcIkhZUEhFTlwiLCAvLyBbMTczXVxyXG4gICAgICAgIFwiT1BFTiBDVVJMWSBCUkFDS0VUXCIsIC8vIFsxNzRdXHJcbiAgICAgICAgXCJDTE9TRSBDVVJMWSBCUkFDS0VUXCIsIC8vIFsxNzVdXHJcbiAgICAgICAgXCJUSUxERVwiLCAvLyBbMTc2XVxyXG4gICAgICAgIFwiXCIsIC8vIFsxNzddXHJcbiAgICAgICAgXCJcIiwgLy8gWzE3OF1cclxuICAgICAgICBcIlwiLCAvLyBbMTc5XVxyXG4gICAgICAgIFwiXCIsIC8vIFsxODBdXHJcbiAgICAgICAgXCJWT0xVTUUgTVVURVwiLCAvLyBbMTgxXVxyXG4gICAgICAgIFwiVk9MVU1FIERPV05cIiwgLy8gWzE4Ml1cclxuICAgICAgICBcIlZPTFVNRSBVUFwiLCAvLyBbMTgzXVxyXG4gICAgICAgIFwiXCIsIC8vIFsxODRdXHJcbiAgICAgICAgXCJcIiwgLy8gWzE4NV1cclxuICAgICAgICBcIlNFTUlDT0xPTlwiLCAvLyBbMTg2XVxyXG4gICAgICAgIFwiRVFVQUxTXCIsIC8vIFsxODddXHJcbiAgICAgICAgXCJDT01NQVwiLCAvLyBbMTg4XVxyXG4gICAgICAgIFwiTUlOVVNcIiwgLy8gWzE4OV1cclxuICAgICAgICBcIlBFUklPRFwiLCAvLyBbMTkwXVxyXG4gICAgICAgIFwiU0xBU0hcIiwgLy8gWzE5MV1cclxuICAgICAgICBcIkJBQ0sgUVVPVEVcIiwgLy8gWzE5Ml1cclxuICAgICAgICBcIlwiLCAvLyBbMTkzXVxyXG4gICAgICAgIFwiXCIsIC8vIFsxOTRdXHJcbiAgICAgICAgXCJcIiwgLy8gWzE5NV1cclxuICAgICAgICBcIlwiLCAvLyBbMTk2XVxyXG4gICAgICAgIFwiXCIsIC8vIFsxOTddXHJcbiAgICAgICAgXCJcIiwgLy8gWzE5OF1cclxuICAgICAgICBcIlwiLCAvLyBbMTk5XVxyXG4gICAgICAgIFwiXCIsIC8vIFsyMDBdXHJcbiAgICAgICAgXCJcIiwgLy8gWzIwMV1cclxuICAgICAgICBcIlwiLCAvLyBbMjAyXVxyXG4gICAgICAgIFwiXCIsIC8vIFsyMDNdXHJcbiAgICAgICAgXCJcIiwgLy8gWzIwNF1cclxuICAgICAgICBcIlwiLCAvLyBbMjA1XVxyXG4gICAgICAgIFwiXCIsIC8vIFsyMDZdXHJcbiAgICAgICAgXCJcIiwgLy8gWzIwN11cclxuICAgICAgICBcIlwiLCAvLyBbMjA4XVxyXG4gICAgICAgIFwiXCIsIC8vIFsyMDldXHJcbiAgICAgICAgXCJcIiwgLy8gWzIxMF1cclxuICAgICAgICBcIlwiLCAvLyBbMjExXVxyXG4gICAgICAgIFwiXCIsIC8vIFsyMTJdXHJcbiAgICAgICAgXCJcIiwgLy8gWzIxM11cclxuICAgICAgICBcIlwiLCAvLyBbMjE0XVxyXG4gICAgICAgIFwiXCIsIC8vIFsyMTVdXHJcbiAgICAgICAgXCJcIiwgLy8gWzIxNl1cclxuICAgICAgICBcIlwiLCAvLyBbMjE3XVxyXG4gICAgICAgIFwiXCIsIC8vIFsyMThdXHJcbiAgICAgICAgXCJPUEVOIEJSQUNLRVRcIiwgLy8gWzIxOV1cclxuICAgICAgICBcIkJBQ0sgU0xBU0hcIiwgLy8gWzIyMF1cclxuICAgICAgICBcIkNMT1NFIEJSQUNLRVRcIiwgLy8gWzIyMV1cclxuICAgICAgICBcIlFVT1RFXCIsIC8vIFsyMjJdXHJcbiAgICAgICAgXCJcIiwgLy8gWzIyM11cclxuICAgICAgICBcIk1FVEFcIiwgLy8gWzIyNF1cclxuICAgICAgICBcIkFMVCBHUkFQSFwiLCAvLyBbMjI1XVxyXG4gICAgICAgIFwiXCIsIC8vIFsyMjZdXHJcbiAgICAgICAgXCJXSU4gSUNPIEhFTFBcIiwgLy8gWzIyN11cclxuICAgICAgICBcIldJTiBJQ08gMDBcIiwgLy8gWzIyOF1cclxuICAgICAgICBcIlwiLCAvLyBbMjI5XVxyXG4gICAgICAgIFwiV0lOIElDTyBDTEVBUlwiLCAvLyBbMjMwXVxyXG4gICAgICAgIFwiXCIsIC8vIFsyMzFdXHJcbiAgICAgICAgXCJcIiwgLy8gWzIzMl1cclxuICAgICAgICBcIldJTiBPRU0gUkVTRVRcIiwgLy8gWzIzM11cclxuICAgICAgICBcIldJTiBPRU0gSlVNUFwiLCAvLyBbMjM0XVxyXG4gICAgICAgIFwiV0lOIE9FTSBQQTFcIiwgLy8gWzIzNV1cclxuICAgICAgICBcIldJTiBPRU0gUEEyXCIsIC8vIFsyMzZdXHJcbiAgICAgICAgXCJXSU4gT0VNIFBBM1wiLCAvLyBbMjM3XVxyXG4gICAgICAgIFwiV0lOIE9FTSBXU0NUUkxcIiwgLy8gWzIzOF1cclxuICAgICAgICBcIldJTiBPRU0gQ1VTRUxcIiwgLy8gWzIzOV1cclxuICAgICAgICBcIldJTiBPRU0gQVRUTlwiLCAvLyBbMjQwXVxyXG4gICAgICAgIFwiV0lOIE9FTSBGSU5JU0hcIiwgLy8gWzI0MV1cclxuICAgICAgICBcIldJTiBPRU0gQ09QWVwiLCAvLyBbMjQyXVxyXG4gICAgICAgIFwiV0lOIE9FTSBBVVRPXCIsIC8vIFsyNDNdXHJcbiAgICAgICAgXCJXSU4gT0VNIEVOTFdcIiwgLy8gWzI0NF1cclxuICAgICAgICBcIldJTiBPRU0gQkFDS1RBQlwiLCAvLyBbMjQ1XVxyXG4gICAgICAgIFwiQVRUTlwiLCAvLyBbMjQ2XVxyXG4gICAgICAgIFwiQ1JTRUxcIiwgLy8gWzI0N11cclxuICAgICAgICBcIkVYU0VMXCIsIC8vIFsyNDhdXHJcbiAgICAgICAgXCJFUkVPRlwiLCAvLyBbMjQ5XVxyXG4gICAgICAgIFwiUExBWVwiLCAvLyBbMjUwXVxyXG4gICAgICAgIFwiWk9PTVwiLCAvLyBbMjUxXVxyXG4gICAgICAgIFwiXCIsIC8vIFsyNTJdXHJcbiAgICAgICAgXCJQQTFcIiwgLy8gWzI1M11cclxuICAgICAgICBcIldJTiBPRU0gQ0xFQVJcIiwgLy8gWzI1NF1cclxuICAgICAgICBcIlRPR0dMRSBUT1VDSFBBRFwiIC8vIFsyNTVdXHJcbiAgICBdLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTc3MjE3OS9nZXQtY2hhcmFjdGVyLXZhbHVlLWZyb20ta2V5Y29kZS1pbi1qYXZhc2NyaXB0LXRoZW4tdHJpbVxyXG59XHJcblxyXG5jb25zdCBBdWRpb0Fzc2V0cyA9IHtcclxuICAgIHVpOiB7XHJcbiAgICAgICAgaW52ZW50b3J5Q2xhY2s6IG5ldyBBdWRpb1Jlc291cmNlR3JvdXAoW25ldyBBdWRpb1Jlc291cmNlKCdhc3NldHMvc291bmRzL3NmeC91aS9jbGFjazEubXAzJyksIG5ldyBBdWRpb1Jlc291cmNlKCdhc3NldHMvc291bmRzL3NmeC91aS9jbGFjazIubXAzJyksIG5ldyBBdWRpb1Jlc291cmNlKCdhc3NldHMvc291bmRzL3NmeC91aS9jbGFjazMubXAzJyldKVxyXG4gICAgfSxcclxuICAgIG11c2ljOiB7XHJcbiAgICAgICAgdGl0bGVTY3JlZW46IG5ldyBBdWRpb1Jlc291cmNlKCdhc3NldHMvc291bmRzL211c2ljL1RpdGxlU2NyZWVuLm1wMycpXHJcbiAgICB9LFxyXG4gICAgYW1iaWVudDoge1xyXG4gICAgICAgIHdpbnRlcjE6IG5ldyBBdWRpb1Jlc291cmNlKCdhc3NldHMvc291bmRzL3NmeC9hbWJpZW50LzY1ODEzX19wY2FlbGRyaWVzX19jb3VudHJ5c2lkZXdpbnRlcmV2ZW5pbmcwMi53YXYnKVxyXG4gICAgfVxyXG59XHJcblxyXG50eXBlIEFuaW1hdGlvbkZyYW1lPFQgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBJbWFnZVJlc291cmNlW10+PiA9IGtleW9mIFRcclxuXHJcbi8vIGNvbnN0IGFuaW1hdGlvbnMgPSA8VCBleHRlbmRzIFJlY29yZDxzdHJpbmcsIEltYWdlUmVzb3VyY2VbXT4+KGRhdGE6IFQpOiBUID0+IGRhdGFcclxuXHJcbmNvbnN0IFBsYXllckFuaW1hdGlvbnMgPSB7XHJcbiAgICBpZGxlOiBbXHJcbiAgICAgICAgbmV3IFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3BsYXllci9jaGFyYWN0ZXIucG5nJyksXHJcbiAgICBdXHJcbn1cclxuXHJcblxyXG5jb25zdCBsb2FkQXNzZXRzID0gKHNrZXRjaDogUDUsIC4uLmFzc2V0czogQXNzZXRHcm91cFtdKSA9PiB7XHJcbiAgICBhc3NldHMuZm9yRWFjaCgoYXNzZXRHcm91cCkgPT4ge1xyXG4gICAgICAgIHNlYXJjaEdyb3VwKGFzc2V0R3JvdXAsIHNrZXRjaCk7XHJcbiAgICB9KTtcclxuXHJcbn07XHJcblxyXG5mdW5jdGlvbiBzZWFyY2hHcm91cChhc3NldEdyb3VwOiBBc3NldEdyb3VwIHwgUmVzb3VyY2UgfCBBdWRpb1Jlc291cmNlIHwgQXVkaW9SZXNvdXJjZUdyb3VwIHwgSW1hZ2VSZXNvdXJjZVtdLCBza2V0Y2g6IFA1KSB7XHJcbiAgICBpZiAoYXNzZXRHcm91cCBpbnN0YW5jZW9mIFJlc291cmNlKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coYExvYWRpbmcgYXNzZXQgJHthc3NldEdyb3VwLnBhdGh9YCk7XHJcbiAgICAgICAgYXNzZXRHcm91cC5sb2FkUmVzb3VyY2Uoc2tldGNoKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBPYmplY3QuZW50cmllcyhhc3NldEdyb3VwKS5mb3JFYWNoKChhc3NldCkgPT4ge1xyXG4gICAgICAgIHNlYXJjaEdyb3VwKGFzc2V0WzFdLCBza2V0Y2gpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCB7IEF1ZGlvQXNzZXRzLCBVaUFzc2V0cywgSXRlbXNBc3NldHMsIFdvcmxkQXNzZXRzLCBGb250cywgS2V5cywgUGxheWVyQW5pbWF0aW9ucywgQW5pbWF0aW9uRnJhbWUsIGxvYWRBc3NldHMgfTtcclxuIiwiaW1wb3J0IFA1IGZyb20gJ3A1JztcclxuaW1wb3J0IFJlc291cmNlIGZyb20gJy4vUmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBBdWRpb1R5cGUgfSBmcm9tICd0cy1hdWRpbyc7XHJcbmltcG9ydCBBdWRpbyBmcm9tICd0cy1hdWRpbyc7XHJcblxyXG5cclxuY2xhc3MgQXVkaW9SZXNvdXJjZSBleHRlbmRzIFJlc291cmNlIHtcclxuICAgIHNvdW5kOiBBdWRpb1R5cGVcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwYXRoOiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcihwYXRoKTtcclxuICAgIH1cclxuXHJcbiAgICBsb2FkUmVzb3VyY2UoZ2FtZTogUDUpIHtcclxuICAgICAgICB0aGlzLnNvdW5kID0gQXVkaW8oe1xyXG4gICAgICAgICAgICBmaWxlOiB0aGlzLnBhdGgsXHJcbiAgICAgICAgICAgIGxvb3A6IGZhbHNlLFxyXG4gICAgICAgICAgICB2b2x1bWU6IDEuMCxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBwbGF5UmFuZG9tKCkge1xyXG4gICAgLy8gICAgIC8vIFZlcmlmeSB0aGF0IHRoZSBzb3VuZCBoYXMgYmVlbiBsb2FkZWRcclxuICAgIC8vICAgICBpZiAodGhpcy5zb3VuZCA9PT0gdW5kZWZpbmVkKVxyXG4gICAgLy8gICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAvLyAgICAgICAgICAgICBgVHJpZWQgdG8gcGxheSBzb3VuZCBiZWZvcmUgbG9hZGluZyBpdDogJHt0aGlzLnBhdGh9YFxyXG4gICAgLy8gICAgICAgICApO1xyXG5cclxuICAgIC8vICAgICB0aGlzLnNvdW5kLnBsYXkoKTtcclxuICAgIC8vIH1cclxuXHJcbiAgICBwbGF5U291bmQoKSB7Ly8gcGxheSB0aGUgc291bmRcclxuICAgICAgICAvL1ZlcmlmeSB0aGF0IHRoZSBzb3VuZCBoYXMgYmVlbiBsb2FkZWRcclxuICAgICAgICBpZiAodGhpcy5zb3VuZCA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAgICAgICAgICAgICBgVHJpZWQgdG8gcGxheSBzb3VuZCBiZWZvcmUgbG9hZGluZyBpdDogJHt0aGlzLnBhdGh9YFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIHRoaXMuc291bmQucGF1c2UoKTtcclxuICAgICAgICB0aGlzLnNvdW5kLnBsYXkoKTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCA9IEF1ZGlvUmVzb3VyY2U7XHJcbiIsImltcG9ydCBBdWRpb1Jlc291cmNlIGZyb20gJy4vQXVkaW9SZXNvdXJjZSc7XHJcbmltcG9ydCBQNSBmcm9tIFwicDVcIjtcclxuXHJcbmNsYXNzIEF1ZGlvUmVzb3VyY2VHcm91cCB7XHJcblxyXG4gICAgc291bmRzOiBBdWRpb1Jlc291cmNlW11cclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihzb3VuZHM6IEF1ZGlvUmVzb3VyY2VbXSkgey8vIHBhc3MgaW4gYW4gYXJyYXkgb2YgQXVkaW9SZXNvdXJjZXMgdGhhdCBhcmUgYWxsIHNpbWlsYXJcclxuICAgICAgICB0aGlzLnNvdW5kcyA9IHNvdW5kcztcclxuICAgIH1cclxuXHJcbiAgICBwbGF5UmFuZG9tKCkgey8vIHBsYXkgYSByYW5kb20gc291bmRcclxuICAgICAgICBpZih0aGlzLnNvdW5kcyA9PT0gdW5kZWZpbmVkIHx8IHRoaXMuc291bmRzLmxlbmd0aCA9PT0gMClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxyXG4gICAgICAgICAgICAgICAgYFRoZXJlIGFyZSBubyBzb3VuZHM6ICR7dGhpcy5zb3VuZHN9YFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIGNvbnN0IHIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0aGlzLnNvdW5kcy5sZW5ndGgpO1xyXG4gICAgICAgIHRoaXMuc291bmRzW3JdLnBsYXlTb3VuZCgpOy8vIHBsYXkgYSByYW5kb20gc291bmQgZnJvbSB0aGUgYXJyYXkgYXQgYSBzbGlnaHRseSByYW5kb21pemVkIHBpdGNoLCBsZWFkaW5nIHRvIHRoZSBlZmZlY3Qgb2YgaXQgbWFraW5nIGEgbmV3IHNvdW5kIGVhY2ggdGltZSwgcmVtb3ZpbmcgcmVwZXRpdGl2ZW5lc3NcclxuXHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQgPSBBdWRpb1Jlc291cmNlR3JvdXA7IiwiaW1wb3J0IEltYWdlUmVzb3VyY2UgZnJvbSAnLi9JbWFnZVJlc291cmNlJztcclxuaW1wb3J0IHA1IGZyb20gJ3A1JztcclxuaW1wb3J0IGdhbWUgZnJvbSAnLi4vLi4vTWFpbidcclxuXHJcbmNsYXNzIEZvbnRSZXNvdXJjZSBleHRlbmRzIEltYWdlUmVzb3VyY2Uge1xyXG5cclxuICAgIGFscGhhYmV0X3NvdXA6IHtbbGV0dGVyOiBzdHJpbmddOiB7eDogbnVtYmVyLCB5OiBudW1iZXIsIHc6IG51bWJlciwgaDogbnVtYmVyfX0gPSB7fVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBhdGg6IHN0cmluZywgY2hhcmFjdGVyRGF0YToge1tsZXR0ZXI6IHN0cmluZ106IG51bWJlcn0sIGNoYXJhY3Rlck9yZGVyOiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcihwYXRoKTtcclxuICAgICAgICBsZXQgcnVubmluZ1RvdGFsID0gMFxyXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGk8Y2hhcmFjdGVyT3JkZXIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5hbHBoYWJldF9zb3VwW2NoYXJhY3Rlck9yZGVyW2ldXSA9IHt4OiBydW5uaW5nVG90YWwsIHk6IDAsIHc6IGNoYXJhY3RlckRhdGFbY2hhcmFjdGVyT3JkZXJbaV1dLCBoOiAxMn1cclxuICAgICAgICAgICAgcnVubmluZ1RvdGFsICs9IGNoYXJhY3RlckRhdGFbY2hhcmFjdGVyT3JkZXJbaV1dICsgMVxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhjaGFyYWN0ZXJPcmRlcltpXStcIjogXCIrY2hhcmFjdGVyRGF0YVtjaGFyYWN0ZXJPcmRlcltpXV0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBkcmF3VGV4dCh0YXJnZXQ6IHA1LCBzdHI6IHN0cmluZywgeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuICAgICAgICBsZXQgeE9mZnNldDogbnVtYmVyID0gMDtcclxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpPHN0ci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4K3hPZmZzZXQqZ2FtZS51cHNjYWxlU2l6ZSwgeSwgdGhpcy5hbHBoYWJldF9zb3VwW3N0cltpXV0udypnYW1lLnVwc2NhbGVTaXplLCB0aGlzLmFscGhhYmV0X3NvdXBbc3RyW2ldXS5oKmdhbWUudXBzY2FsZVNpemUsIHRoaXMuYWxwaGFiZXRfc291cFtzdHJbaV1dLngsIHRoaXMuYWxwaGFiZXRfc291cFtzdHJbaV1dLnksIHRoaXMuYWxwaGFiZXRfc291cFtzdHJbaV1dLncsIHRoaXMuYWxwaGFiZXRfc291cFtzdHJbaV1dLmgpO1xyXG4gICAgICAgICAgICB4T2Zmc2V0ICs9IHRoaXMuYWxwaGFiZXRfc291cFtzdHJbaV1dLncrMTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0ID0gRm9udFJlc291cmNlOyIsImltcG9ydCBQNSBmcm9tICdwNSc7XHJcbmltcG9ydCBSZXNvdXJjZSBmcm9tICcuL1Jlc291cmNlJztcclxuXHJcbmNsYXNzIEltYWdlUmVzb3VyY2UgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgICBpbWFnZTogUDUuSW1hZ2U7XHJcblxyXG4gICAgY29uc3RydWN0b3IocGF0aDogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIocGF0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZFJlc291cmNlKGdhbWU6IFA1KSB7XHJcbiAgICAgICAgdGhpcy5pbWFnZSA9IGdhbWUubG9hZEltYWdlKHRoaXMucGF0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKHRhcmdldDogYW55LCB4OiBudW1iZXIsIHk6IG51bWJlciwgd2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpIHtcclxuICAgICAgICAvLyBWZXJpZnkgdGhhdCB0aGUgdGlsZXMgaGFzIGJlZW4gbG9hZGVkXHJcbiAgICAgICAgaWYgKHRoaXMuaW1hZ2UgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxyXG4gICAgICAgICAgICAgICAgYFRyaWVkIHRvIHJlbmRlciBpbWFnZSBiZWZvcmUgbG9hZGluZyBpdDogJHt0aGlzLnBhdGh9YFxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAvLyBEcmF3IG5vbiB0aWxlcyBpbWFnZVxyXG4gICAgICAgIHRhcmdldC5pbWFnZSh0aGlzLmltYWdlLCB4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgcmVuZGVyUGFydGlhbChcclxuICAgICAgICB0YXJnZXQ6IGFueSxcclxuICAgICAgICB4OiBudW1iZXIsXHJcbiAgICAgICAgeTogbnVtYmVyLFxyXG4gICAgICAgIHdpZHRoOiBudW1iZXIsXHJcbiAgICAgICAgaGVpZ2h0OiBudW1iZXIsXHJcbiAgICAgICAgc291cmNlWD86IG51bWJlcixcclxuICAgICAgICBzb3VyY2VZPzogbnVtYmVyLFxyXG4gICAgICAgIHNvdXJjZVdpZHRoPzogbnVtYmVyLFxyXG4gICAgICAgIHNvdXJjZUhlaWdodD86IG51bWJlclxyXG4gICAgKSB7XHJcbiAgICAgICAgLy8gVmVyaWZ5IHRoYXQgdGhlIHRpbGVzIGhhcyBiZWVuIGxvYWRlZFxyXG4gICAgICAgIGlmICh0aGlzLmltYWdlID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcclxuICAgICAgICAgICAgICAgIGBUcmllZCB0byByZW5kZXIgaW1hZ2UgYmVmb3JlIGxvYWRpbmcgaXQ6ICR7dGhpcy5wYXRofWBcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgLy8gRHJhdyBhIHBhcnRpYWwgcGFydCBvZiB0aGUgaW1hZ2VcclxuICAgICAgICB0YXJnZXQuaW1hZ2UoXHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2UsXHJcbiAgICAgICAgICAgIHgsXHJcbiAgICAgICAgICAgIHksXHJcbiAgICAgICAgICAgIHdpZHRoLFxyXG4gICAgICAgICAgICBoZWlnaHQsXHJcbiAgICAgICAgICAgIHNvdXJjZVgsXHJcbiAgICAgICAgICAgIHNvdXJjZVksXHJcbiAgICAgICAgICAgIHNvdXJjZVdpZHRoLFxyXG4gICAgICAgICAgICBzb3VyY2VIZWlnaHRcclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgPSBJbWFnZVJlc291cmNlO1xyXG4iLCJpbXBvcnQgUmVzb3VyY2UgZnJvbSBcIi4vUmVzb3VyY2VcIjtcclxuaW1wb3J0IFA1IGZyb20gJ3A1JztcclxuaW1wb3J0IEdhbWUgZnJvbSBcIi4uLy4uL0dhbWVcIjtcclxuaW1wb3J0IHsgV29ybGRUaWxlcyB9IGZyb20gJy4uLy4uL3dvcmxkL1dvcmxkVGlsZXMnXHJcbmltcG9ydCB7IFRpbGVUeXBlIH0gZnJvbSBcIi4uLy4uLy4uLy4uL2FwaS9UaWxlXCJcclxuXHJcbmV4cG9ydCA9IGNsYXNzIFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZSBleHRlbmRzIFJlc291cmNlIHtcclxuXHJcbiAgICBpbWFnZTogUDUuSW1hZ2U7XHJcbiAgICBoYXNSZWZsZWN0aW9uOiBib29sZWFuID0gZmFsc2U7O1xyXG4gICAgcmVmbGVjdGlvbjogUDUuSW1hZ2U7XHJcblxyXG4gICAgY29uc3RydWN0b3IocGF0aDogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIocGF0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZFJlc291cmNlKGdhbWU6IFA1KSB7XHJcbiAgICAgICAgdGhpcy5pbWFnZSA9IGdhbWUubG9hZEltYWdlKHRoaXMucGF0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKHRhcmdldDogYW55LCB4OiBudW1iZXIsIHk6IG51bWJlciwgd2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpIHtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKFdvcmxkVGlsZXMpO1xyXG4gICAgICAgIC8vIFZlcmlmeSB0aGF0IHRoZSBpbWFnZSBoYXMgYmVlbiBsb2FkZWRcclxuICAgICAgICBpZiAodGhpcy5pbWFnZSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAgICAgICAgICAgICBgVHJpZWQgdG8gcmVuZGVyIGltYWdlIGJlZm9yZSBsb2FkaW5nIGl0OiAke3RoaXMucGF0aH1gXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIC8vIERyYXcgbm9uIHRpbGVzIGltYWdlXHJcbiAgICAgICAgdGFyZ2V0LmltYWdlKHRoaXMuaW1hZ2UsIHgsIHksIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICByZW5kZXJXb3JsZHNwYWNlUmVmbGVjdGlvbih0YXJnZXQ6IEdhbWUsIHg6IG51bWJlciwgeTogbnVtYmVyLCB3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcikgey8vdGhpcyBpcyBicm9rZW5cclxuICAgICAgICBpZiAodGhpcy5pbWFnZSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAgICAgICAgICAgICBgVHJpZWQgdG8gcmVuZGVyIHJlZmxlY3Rpb24gb2YgaW1hZ2UgYmVmb3JlIGxvYWRpbmcgaXQ6ICR7dGhpcy5wYXRofWBcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICBpZighdGhpcy5oYXNSZWZsZWN0aW9uKSB7Ly90aGlzIGlzIHNvIGl0IGRvZXNuJ3QgbG9hZCB0aGVtIGFsbCBhdCBvbmNlIGFuZCBpbnN0ZWFkIG1ha2VzIHRoZSByZWZsZWN0aW9ucyB3aGVuIHRoZXkgYXJlIG5lZWRlZFxyXG4gICAgICAgICAgICB0aGlzLmhhc1JlZmxlY3Rpb24gPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLnJlZmxlY3Rpb24gPSB0YXJnZXQuY3JlYXRlSW1hZ2UodGhpcy5pbWFnZS53aWR0aCwgdGhpcy5pbWFnZS5oZWlnaHQpO1xyXG4gICAgICAgICAgICB0aGlzLnJlZmxlY3Rpb24ubG9hZFBpeGVscygpO1xyXG4gICAgICAgICAgICB0aGlzLmltYWdlLmxvYWRQaXhlbHMoKTtcclxuICAgICAgICAgICAgZm9yKGxldCBpID0gMDsgaTx0aGlzLnJlZmxlY3Rpb24ud2lkdGg7IGkrKykgey8vZ2VuZXJhdGUgYSByZWZsZWN0aW9uIGltYWdlIHRoYXQgaXMgZGlzcGxheWVkIGFzIGEgcmVmbGVjdGlvblxyXG4gICAgICAgICAgICAgICAgZm9yKGxldCBqID0gMDsgajx0aGlzLnJlZmxlY3Rpb24uaGVpZ2h0OyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IobGV0IGsgPSAwOyBrPDM7IGsrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlZmxlY3Rpb24ucGl4ZWxzWzQqKGoqdGhpcy5yZWZsZWN0aW9uLndpZHRoK2kpK2tdID0gdGhpcy5pbWFnZS5waXhlbHNbNCooKHRoaXMuaW1hZ2UuaGVpZ2h0LWotMSkqdGhpcy5pbWFnZS53aWR0aCtpKStrXTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWZsZWN0aW9uLnBpeGVsc1s0KihqKnRoaXMucmVmbGVjdGlvbi53aWR0aCtpKSszXSA9IFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW1hZ2UucGl4ZWxzWzQqKCh0aGlzLmltYWdlLmhlaWdodC1qLTEpKnRoaXMuaW1hZ2Uud2lkdGgraSkrM10gKiBcclxuICAgICAgICAgICAgICAgICAgICAoKHRoaXMucmVmbGVjdGlvbi5oZWlnaHQtaikvdGhpcy5yZWZsZWN0aW9uLmhlaWdodCkgKiBcclxuICAgICAgICAgICAgICAgICAgICAodGhpcy5yZWZsZWN0aW9uLndpZHRoLzIrMC41LU1hdGguYWJzKGktdGhpcy5yZWZsZWN0aW9uLndpZHRoLzIrMC41KSkvKHRoaXMucmVmbGVjdGlvbi53aWR0aC8yKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnJlZmxlY3Rpb24udXBkYXRlUGl4ZWxzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgICAgICB0YXJnZXQuZmlsbCgyNTUsIDAsIDApO1xyXG4gICAgICAgICAgICB0YXJnZXQuc3Ryb2tlKDE1MCwgMCwgMCk7XHJcblxyXG4gICAgICAgIC8vbG9vcCB0aHJvdWdoIGV2ZXJ5IHRpbGUgaXQgcGFzc2VzIHRocm91Z2hcclxuICAgICAgICBmb3IobGV0IGkgPSBNYXRoLmZsb29yKHgpOyBpPHgrd2lkdGg7IGkrKykge1xyXG4gICAgICAgICAgICBmb3IobGV0IGogPSBNYXRoLmZsb29yKHkpOyBqPHkraGVpZ2h0OyBqKyspIHtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHRhcmdldC53b3JsZC53b3JsZFRpbGVzKTtcclxuICAgICAgICAgICAgICAgIGxldCBjdXJyZW50QmxvY2s6IG51bWJlciA9IHRhcmdldC53b3JsZC53b3JsZFRpbGVzW2ogKiB0YXJnZXQud29ybGRXaWR0aCArIGldO1xyXG4gICAgICAgICAgICAgICAgaWYoY3VycmVudEJsb2NrID09PSB1bmRlZmluZWQgfHwgY3VycmVudEJsb2NrID09IFRpbGVUeXBlLkFpciB8fCBjdXJyZW50QmxvY2sgPT0gVGlsZVR5cGUuVGlsZUVudGl0eSkgey8vdGhlIHJlZmVyZW5jZSB0byBUaWxlRW50aXR5IGNhbiBiZSByZW1vdmVkIGFzIHNvb24gYXMgdGhlIGJldHRlciBzeXN0ZW0gaXMgaW4gcGxhY2VcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRhcmdldC50aW50KDI1NSwgMTUwKTsvL1RPRE8gbWFrZSBpdCBzb21ld2hhdCB0cmFuc2x1Y2VudCBiYXNlZCBvbiB0aGUgcmVmbGVjdGl2aXR5IG9mIHRoZSB0aWxlXHJcbiAgICAgICAgICAgICAgICB0YXJnZXQuaW1hZ2UoXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWZsZWN0aW9uLFxyXG4gICAgICAgICAgICAgICAgICAgIChpICogdGFyZ2V0LlRJTEVfV0lEVEggLVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQuaW50ZXJwb2xhdGVkQ2FtWCAqIHRhcmdldC5USUxFX1dJRFRIKSAqXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldC51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgKGogKiB0YXJnZXQuVElMRV9IRUlHSFQgLVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LmludGVycG9sYXRlZENhbVkgKiB0YXJnZXQuVElMRV9IRUlHSFQpICpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldC51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXQuVElMRV9XSURUSCp0YXJnZXQudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LlRJTEVfSEVJR0hUKnRhcmdldC51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICAoaS14KSp0YXJnZXQuVElMRV9XSURUSCxcclxuICAgICAgICAgICAgICAgICAgICAoai15KSp0YXJnZXQuVElMRV9IRUlHSFQsXHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LlRJTEVfV0lEVEgsXHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LlRJTEVfSEVJR0hUXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0Lm5vVGludCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlclBhcnRpYWwoXHJcbiAgICAgICAgdGFyZ2V0OiBhbnksXHJcbiAgICAgICAgeDogbnVtYmVyLFxyXG4gICAgICAgIHk6IG51bWJlcixcclxuICAgICAgICB3aWR0aDogbnVtYmVyLFxyXG4gICAgICAgIGhlaWdodDogbnVtYmVyLFxyXG4gICAgICAgIHNvdXJjZVg/OiBudW1iZXIsXHJcbiAgICAgICAgc291cmNlWT86IG51bWJlcixcclxuICAgICAgICBzb3VyY2VXaWR0aD86IG51bWJlcixcclxuICAgICAgICBzb3VyY2VIZWlnaHQ/OiBudW1iZXJcclxuICAgICkge1xyXG4gICAgICAgIC8vIFZlcmlmeSB0aGF0IHRoZSB0aWxlcyBoYXMgYmVlbiBsb2FkZWRcclxuICAgICAgICBpZiAodGhpcy5pbWFnZSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAgICAgICAgICAgICBgVHJpZWQgdG8gcmVuZGVyIGltYWdlIGJlZm9yZSBsb2FkaW5nIGl0OiAke3RoaXMucGF0aH1gXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIC8vIERyYXcgYSBwYXJ0aWFsIHBhcnQgb2YgdGhlIGltYWdlXHJcbiAgICAgICAgdGFyZ2V0LmltYWdlKFxyXG4gICAgICAgICAgICB0aGlzLmltYWdlLFxyXG4gICAgICAgICAgICB4LFxyXG4gICAgICAgICAgICB5LFxyXG4gICAgICAgICAgICB3aWR0aCxcclxuICAgICAgICAgICAgaGVpZ2h0LFxyXG4gICAgICAgICAgICBzb3VyY2VYLFxyXG4gICAgICAgICAgICBzb3VyY2VZLFxyXG4gICAgICAgICAgICBzb3VyY2VXaWR0aCxcclxuICAgICAgICAgICAgc291cmNlSGVpZ2h0XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufSIsImltcG9ydCBQNSBmcm9tICdwNSc7XHJcblxyXG5hYnN0cmFjdCBjbGFzcyBSZXNvdXJjZSB7XHJcbiAgICBwYXRoOiBzdHJpbmc7XHJcblxyXG4gICAgcHJvdGVjdGVkIGNvbnN0cnVjdG9yKHBhdGg6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMucGF0aCA9IHBhdGg7XHJcbiAgICB9XHJcblxyXG4gICAgYWJzdHJhY3QgbG9hZFJlc291cmNlKHNrZXRjaDogUDUpOiB2b2lkO1xyXG59XHJcblxyXG5leHBvcnQgPSBSZXNvdXJjZTtcclxuIiwiaW1wb3J0IEltYWdlUmVzb3VyY2UgZnJvbSAnLi9JbWFnZVJlc291cmNlJztcclxuXHJcbmNsYXNzIFRpbGVSZXNvdXJjZSBleHRlbmRzIEltYWdlUmVzb3VyY2Uge1xyXG4gICAgLy8gVGhlIHdpZHRoIGFuZCBoZWlnaHQgb2YgdGhlIHRpbGVzIHNldFxyXG4gICAgd2lkdGg6IG51bWJlcjtcclxuICAgIGhlaWdodDogbnVtYmVyO1xyXG5cclxuICAgIC8vIFRoZSB3aWR0aCBhbmQgaGVpZ2h0IG9mIGVhY2ggdGlsZXMgaW4gcGl4ZWxzXHJcbiAgICB0aWxlV2lkdGg6IG51bWJlcjtcclxuICAgIHRpbGVIZWlnaHQ6IG51bWJlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBwYXRoOiBzdHJpbmcsXHJcbiAgICAgICAgd2lkdGg6IG51bWJlcixcclxuICAgICAgICBoZWlnaHQ6IG51bWJlcixcclxuICAgICAgICB0aWxlV2lkdGg6IG51bWJlcixcclxuICAgICAgICB0aWxlSGVpZ2h0OiBudW1iZXJcclxuICAgICkge1xyXG4gICAgICAgIHN1cGVyKHBhdGgpO1xyXG4gICAgICAgIHRoaXMud2lkdGggPSB3aWR0aDtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcclxuICAgICAgICB0aGlzLnRpbGVXaWR0aCA9IHRpbGVXaWR0aDtcclxuICAgICAgICB0aGlzLnRpbGVIZWlnaHQgPSB0aWxlSGVpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlclRpbGUoXHJcbiAgICAgICAgaTogbnVtYmVyLFxyXG4gICAgICAgIHRhcmdldDogYW55LFxyXG4gICAgICAgIHg6IG51bWJlcixcclxuICAgICAgICB5OiBudW1iZXIsXHJcbiAgICAgICAgd2lkdGg6IG51bWJlcixcclxuICAgICAgICBoZWlnaHQ6IG51bWJlclxyXG4gICAgKSB7XHJcbiAgICAgICAgY29uc3QgdGlsZVNldFggPSBpICUgdGhpcy53aWR0aDtcclxuICAgICAgICBjb25zdCB0aWxlU2V0WSA9IE1hdGguZmxvb3IoaSAvIHRoaXMud2lkdGgpO1xyXG5cclxuICAgICAgICAvLyBNYWtlIHN1cmUgdGhlIHRpbGVzIGlzbid0IG91dCBvZiBib3VuZHNcclxuICAgICAgICBpZiAodGlsZVNldFkgPiB0aGlzLmhlaWdodClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxyXG4gICAgICAgICAgICAgICAgYE91dCBvZiBib3VuZHMgdGlsZS4gVHJpZWQgdG8gcmVuZGVyIHRpbGUgaW5kZXggJHtpfSB3aXRoIGEgbWF4aW11bSBvZiAke1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMud2lkdGggKiB0aGlzLmhlaWdodFxyXG4gICAgICAgICAgICAgICAgfSB0aWxlc2BcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgc3VwZXIucmVuZGVyUGFydGlhbChcclxuICAgICAgICAgICAgdGFyZ2V0LFxyXG4gICAgICAgICAgICB4LFxyXG4gICAgICAgICAgICB5LFxyXG4gICAgICAgICAgICB3aWR0aCxcclxuICAgICAgICAgICAgaGVpZ2h0LFxyXG4gICAgICAgICAgICB0aWxlU2V0WCAqIHRoaXMudGlsZVdpZHRoLFxyXG4gICAgICAgICAgICB0aWxlU2V0WSAqIHRoaXMudGlsZUhlaWdodCxcclxuICAgICAgICAgICAgdGhpcy50aWxlV2lkdGgsXHJcbiAgICAgICAgICAgIHRoaXMudGlsZUhlaWdodFxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VGlsZUF0Q29vcmRpbmF0ZShcclxuICAgICAgICB4OiBudW1iZXIsXHJcbiAgICAgICAgeTogbnVtYmVyLFxyXG4gICAgICAgIHRhcmdldDogYW55LFxyXG4gICAgICAgIHhQb3M6IG51bWJlcixcclxuICAgICAgICB5UG9zOiBudW1iZXIsXHJcbiAgICAgICAgd2lkdGg6IG51bWJlcixcclxuICAgICAgICBoZWlnaHQ6IG51bWJlclxyXG4gICAgKSB7XHJcbiAgICAgICAgaWYgKHggPiB0aGlzLndpZHRoIHx8IHkgPiB0aGlzLmhlaWdodCB8fCB4IDwgMCB8fCB5IDwgMClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxyXG4gICAgICAgICAgICAgICAgYE91dCBvZiBib3VuZHMgdGlsZS4gVHJpZWQgdG8gbG9hZCB0aWxlIGF0ICR7eH0sICR7eX0gb24gYSAke3RoaXMud2lkdGh9LCAke3RoaXMuaGVpZ2h0fSBncmlkYFxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICBzdXBlci5yZW5kZXJQYXJ0aWFsKFxyXG4gICAgICAgICAgICB0YXJnZXQsXHJcbiAgICAgICAgICAgIHhQb3MsXHJcbiAgICAgICAgICAgIHlQb3MsXHJcbiAgICAgICAgICAgIHdpZHRoLFxyXG4gICAgICAgICAgICBoZWlnaHQsXHJcbiAgICAgICAgICAgIHggKiB0aGlzLnRpbGVXaWR0aCxcclxuICAgICAgICAgICAgeSAqIHRoaXMudGlsZUhlaWdodCxcclxuICAgICAgICAgICAgdGhpcy50aWxlV2lkdGgsXHJcbiAgICAgICAgICAgIHRoaXMudGlsZUhlaWdodFxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCA9IFRpbGVSZXNvdXJjZTtcclxuIiwiZXhwb3J0IGNsYXNzIENvbnRyb2wge1xyXG4gICAga2V5Ym9hcmQ6IGJvb2xlYW5cclxuICAgIGtleUNvZGU6IG51bWJlclxyXG4gICAgZGVzY3JpcHRpb246IHN0cmluZ1xyXG4gICAgb25QcmVzc2VkOiAoKSA9PiB2b2lkXHJcbiAgICBvblJlbGVhc2VkOiAoKSA9PiB2b2lkXHJcblxyXG4gICAgY29uc3RydWN0b3IoZGVzY3JpcHRpb246IHN0cmluZywga2V5Ym9hcmQ6IGJvb2xlYW4sIGtleUNvZGU6IG51bWJlciwgb25QcmVzc2VkOiAoKSA9PiB2b2lkLCBvblJlbGVhc2VkPzogKCkgPT4gdm9pZCkge1xyXG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvblxyXG4gICAgICAgIHRoaXMua2V5Ym9hcmQgPSBrZXlib2FyZDtcclxuICAgICAgICB0aGlzLmtleUNvZGUgPSBrZXlDb2RlO1xyXG4gICAgICAgIHRoaXMub25QcmVzc2VkID0gb25QcmVzc2VkO1xyXG4gICAgICAgIHRoaXMub25SZWxlYXNlZCA9IG9uUmVsZWFzZWQgfHwgZnVuY3Rpb24oKXt9Oy8vZm9yIHNvbWUgcmVhc29uIGFycm93IGZ1bmN0aW9uIGRvZXNuJ3QgbGlrZSB0byBleGlzdCBoZXJlIGJ1dCBpJ20gbm90IGdvbm5hIHdvcnJ5IHRvbyBtdWNoXHJcbiAgICAgICAgLy9pZiBpdCdzIHRvbyB1Z2x5LCB5b3UgY2FuIHRyeSB0byBmaXggaXRcclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgUmVuZGVyYWJsZSBmcm9tICcuLi9pbnRlcmZhY2VzL1JlbmRlcmFibGUnO1xyXG5pbXBvcnQgcDUgZnJvbSAncDUnO1xyXG5pbXBvcnQgeyBBdWRpb0Fzc2V0cywgVWlBc3NldHMgfSBmcm9tICcuLi9hc3NldHMvQXNzZXRzJztcclxuaW1wb3J0IEltYWdlUmVzb3VyY2UgZnJvbSAnLi4vYXNzZXRzL3Jlc291cmNlcy9JbWFnZVJlc291cmNlJztcclxuaW1wb3J0IEZvbnRSZXNvdXJjZSBmcm9tICcuLi9hc3NldHMvcmVzb3VyY2VzL0ZvbnRSZXNvdXJjZSc7XHJcblxyXG5jbGFzcyBCdXR0b24gaW1wbGVtZW50cyBSZW5kZXJhYmxlIHtcclxuXHJcbiAgICBmb250OiBGb250UmVzb3VyY2VcclxuICAgIHR4dDogc3RyaW5nXHJcbiAgICBkZXNjcmlwdGlvbjogc3RyaW5nXHJcbiAgICBvblByZXNzZWRDdXN0b206IEZ1bmN0aW9uXHJcbiAgICB4OiBudW1iZXJcclxuICAgIHk6IG51bWJlclxyXG4gICAgdzogbnVtYmVyXHJcbiAgICBoOiBudW1iZXJcclxuICAgIGltYWdlOiBJbWFnZVJlc291cmNlXHJcbiAgICBtb3VzZUlzT3ZlcjogYm9vbGVhblxyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIGZvbnQ6IEZvbnRSZXNvdXJjZSxcclxuICAgICAgICB0eHQ6IHN0cmluZyxcclxuICAgICAgICBkZXNjcmlwdGlvbjogc3RyaW5nLFxyXG4gICAgICAgIHg6IG51bWJlcixcclxuICAgICAgICB5OiBudW1iZXIsXHJcbiAgICAgICAgdzogbnVtYmVyLFxyXG4gICAgICAgIGg6IG51bWJlcixcclxuICAgICAgICBvblByZXNzZWRDdXN0b206IEZ1bmN0aW9uKSB7XHJcbiAgICAgICAgdGhpcy5mb250ID0gZm9udDtcclxuICAgICAgICB0aGlzLnR4dCA9IHR4dFxyXG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvblxyXG4gICAgICAgIHRoaXMub25QcmVzc2VkQ3VzdG9tID0gb25QcmVzc2VkQ3VzdG9tXHJcbiAgICAgICAgdGhpcy54ID0geFxyXG4gICAgICAgIHRoaXMueSA9IHlcclxuICAgICAgICB0aGlzLncgPSB3XHJcbiAgICAgICAgdGhpcy5oID0gaFxyXG4gICAgICAgIHRoaXMuaW1hZ2UgPSBVaUFzc2V0cy5idXR0b25fdW5zZWxlY3RlZDtcclxuICAgICAgICB0aGlzLm1vdXNlSXNPdmVyID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKHRhcmdldDogcDUsIHVwc2NhbGVTaXplOiBudW1iZXIpIHtcclxuICAgICAgICAvLyBzZXQgdGhlIGNvb3JkcyBhbmQgZGltZW5zaW9ucyB0byByb3VuZCB0byB0aGUgbmVhcmVzdCB1bi11cHNjYWxlZCBwaXhlbFxyXG4gICAgICAgIGNvbnN0IHggPSBNYXRoLnJvdW5kKHRoaXMueCAvIHVwc2NhbGVTaXplKSAqIHVwc2NhbGVTaXplO1xyXG4gICAgICAgIGNvbnN0IHkgPSBNYXRoLnJvdW5kKHRoaXMueSAvIHVwc2NhbGVTaXplKSAqIHVwc2NhbGVTaXplO1xyXG4gICAgICAgIGNvbnN0IHcgPSBNYXRoLnJvdW5kKHRoaXMudyAvIHVwc2NhbGVTaXplKSAqIHVwc2NhbGVTaXplO1xyXG4gICAgICAgIGNvbnN0IGggPSBNYXRoLnJvdW5kKHRoaXMuaCAvIHVwc2NhbGVTaXplKSAqIHVwc2NhbGVTaXplO1xyXG5cclxuICAgICAgICAvLyBjb3JuZXJzXHJcbiAgICAgICAgdGhpcy5pbWFnZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCwgeSwgNyAqIHVwc2NhbGVTaXplLCA3ICogdXBzY2FsZVNpemUsIDAsIDAsIDcsIDcpO1xyXG4gICAgICAgIHRoaXMuaW1hZ2UucmVuZGVyUGFydGlhbCh0YXJnZXQsIHggKyB3IC0gNyAqIHVwc2NhbGVTaXplLCB5LCA3ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgOCwgMCwgNywgNyk7XHJcbiAgICAgICAgdGhpcy5pbWFnZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCwgeSArIGggLSA3ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCAwLCA4LCA3LCA3KTtcclxuICAgICAgICB0aGlzLmltYWdlLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4ICsgdyAtIDcgKiB1cHNjYWxlU2l6ZSwgeSArIGggLSA3ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCA4LCA4LCA3LCA3KTtcclxuXHJcbiAgICAgICAgLy8gdG9wIGFuZCBib3R0b21cclxuICAgICAgICB0aGlzLmltYWdlLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4ICsgNyAqIHVwc2NhbGVTaXplLCB5LCB3IC0gMTQgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCA3LCAwLCAxLCA3KTtcclxuICAgICAgICB0aGlzLmltYWdlLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4ICsgNyAqIHVwc2NhbGVTaXplLCB5ICsgaCAtIDcgKiB1cHNjYWxlU2l6ZSwgdyAtIDE0ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgNywgOCwgMSwgNyk7XHJcblxyXG4gICAgICAgIC8vIGxlZnQgYW5kIHJpZ2h0XHJcbiAgICAgICAgdGhpcy5pbWFnZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCwgeSArIDcgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCBoIC0gMTQgKiB1cHNjYWxlU2l6ZSwgMCwgNywgNywgMSk7XHJcbiAgICAgICAgdGhpcy5pbWFnZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCArIHcgLSA3ICogdXBzY2FsZVNpemUsIHkgKyA3ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgaCAtIDE0ICogdXBzY2FsZVNpemUsIDgsIDcsIDcsIDEpO1xyXG5cclxuICAgICAgICAvLyBjZW50ZXJcclxuICAgICAgICB0aGlzLmltYWdlLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4ICsgNyAqIHVwc2NhbGVTaXplLCB5ICsgNyAqIHVwc2NhbGVTaXplLCB3IC0gMTQgKiB1cHNjYWxlU2l6ZSwgaCAtIDE0ICogdXBzY2FsZVNpemUsIDcsIDcsIDEsIDEpO1xyXG5cclxuICAgICAgICB0aGlzLmZvbnQuZHJhd1RleHQodGFyZ2V0LCB0aGlzLnR4dCwgeCArIDYgKiB1cHNjYWxlU2l6ZSwgTWF0aC5yb3VuZCgodGhpcy55ICsgdGhpcy5oIC8gMikgLyB1cHNjYWxlU2l6ZSkgKiB1cHNjYWxlU2l6ZSAtIDYgKiB1cHNjYWxlU2l6ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlTW91c2VPdmVyKG1vdXNlWDogbnVtYmVyLCBtb3VzZVk6IG51bWJlcikge1xyXG4gICAgICAgIC8vIGlmIHRoZSBtb3VzZSBwb3NpdGlvbiBpcyBpbnNpZGUgdGhlIGJ1dHRvbiwgcmV0dXJuIHRydWVcclxuICAgICAgICBpZiAobW91c2VYID4gdGhpcy54ICYmIG1vdXNlWCA8IHRoaXMueCArIHRoaXMudyAmJiBtb3VzZVkgPiB0aGlzLnkgJiYgbW91c2VZIDwgdGhpcy55ICsgdGhpcy5oKSB7XHJcbiAgICAgICAgICAgIHRoaXMubW91c2VJc092ZXIgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLmltYWdlID0gVWlBc3NldHMuYnV0dG9uX3NlbGVjdGVkO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5tb3VzZUlzT3ZlciA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLmltYWdlID0gVWlBc3NldHMuYnV0dG9uX3Vuc2VsZWN0ZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9uUHJlc3NlZCgpIHtcclxuICAgICAgICB0aGlzLm9uUHJlc3NlZEN1c3RvbSgpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiYnV0dG9uIHByZXNzZWRcIik7XHJcbiAgICAgICAgLy9BdWRpb0Fzc2V0cy51aS5pbnZlbnRvcnlDbGFjay5wbGF5UmFuZG9tKCk7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQgPSBCdXR0b247IiwiaW1wb3J0IFJlbmRlcmFibGUgZnJvbSAnLi4vaW50ZXJmYWNlcy9SZW5kZXJhYmxlJztcclxuaW1wb3J0IHA1IGZyb20gJ3A1JztcclxuaW1wb3J0IHsgS2V5cywgVWlBc3NldHMgfSBmcm9tICcuLi9hc3NldHMvQXNzZXRzJztcclxuaW1wb3J0IEltYWdlUmVzb3VyY2UgZnJvbSAnLi4vYXNzZXRzL3Jlc291cmNlcy9JbWFnZVJlc291cmNlJztcclxuaW1wb3J0IEZvbnRSZXNvdXJjZSBmcm9tICcuLi9hc3NldHMvcmVzb3VyY2VzL0ZvbnRSZXNvdXJjZSc7XHJcblxyXG5jbGFzcyBJbnB1dEJveCBpbXBsZW1lbnRzIFJlbmRlcmFibGUge1xyXG5cclxuICAgIGZvbnQ6IEZvbnRSZXNvdXJjZVxyXG4gICAgdHh0OiBzdHJpbmdcclxuICAgIHZhbHVlOiBudW1iZXJcclxuICAgIGtleWJvYXJkOiBib29sZWFuXHJcbiAgICBpbmRleDogbnVtYmVyXHJcbiAgICB4OiBudW1iZXJcclxuICAgIHk6IG51bWJlclxyXG4gICAgdzogbnVtYmVyXHJcbiAgICBoOiBudW1iZXJcclxuICAgIGltYWdlOiBJbWFnZVJlc291cmNlXHJcbiAgICBtb3VzZUlzT3ZlcjogYm9vbGVhblxyXG4gICAgbGlzdGVuaW5nOiBib29sZWFuXHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgZm9udDogRm9udFJlc291cmNlLFxyXG4gICAgICAgIHR4dDogc3RyaW5nLFxyXG4gICAgICAgIGtleWJvYXJkOiBib29sZWFuLFxyXG4gICAgICAgIHZhbHVlOiBudW1iZXIsXHJcbiAgICAgICAgaW5kZXg6IG51bWJlciwvLyB0aGUgaW5kZXggaW4gdGhlIEdhbWUuY29udHJvbHMgYXJyYXkgdGhhdCBpdCBjaGFuZ2VzXHJcbiAgICAgICAgeDogbnVtYmVyLFxyXG4gICAgICAgIHk6IG51bWJlcixcclxuICAgICAgICB3OiBudW1iZXIsXHJcbiAgICAgICAgaDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5mb250ID0gZm9udDtcclxuICAgICAgICB0aGlzLnR4dCA9IHR4dFxyXG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLmtleWJvYXJkID0ga2V5Ym9hcmQ7XHJcbiAgICAgICAgdGhpcy5pbmRleCA9IGluZGV4O1xyXG4gICAgICAgIHRoaXMueCA9IHhcclxuICAgICAgICB0aGlzLnkgPSB5XHJcbiAgICAgICAgdGhpcy53ID0gd1xyXG4gICAgICAgIHRoaXMuaCA9IGhcclxuICAgICAgICB0aGlzLmltYWdlID0gVWlBc3NldHMuYnV0dG9uX3Vuc2VsZWN0ZWQ7XHJcbiAgICAgICAgdGhpcy5tb3VzZUlzT3ZlciA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMubGlzdGVuaW5nID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKHRhcmdldDogcDUsIHVwc2NhbGVTaXplOiBudW1iZXIpIHtcclxuICAgICAgICAvLyBzZXQgdGhlIGNvb3JkcyBhbmQgZGltZW5zaW9ucyB0byByb3VuZCB0byB0aGUgbmVhcmVzdCB1bi11cHNjYWxlZCBwaXhlbFxyXG4gICAgICAgIGNvbnN0IHggPSBNYXRoLnJvdW5kKHRoaXMueCAvIHVwc2NhbGVTaXplKSAqIHVwc2NhbGVTaXplO1xyXG4gICAgICAgIGNvbnN0IHkgPSBNYXRoLnJvdW5kKHRoaXMueSAvIHVwc2NhbGVTaXplKSAqIHVwc2NhbGVTaXplO1xyXG4gICAgICAgIGNvbnN0IHcgPSBNYXRoLnJvdW5kKHRoaXMudyAvIHVwc2NhbGVTaXplKSAqIHVwc2NhbGVTaXplO1xyXG4gICAgICAgIGNvbnN0IGggPSBNYXRoLnJvdW5kKHRoaXMuaCAvIHVwc2NhbGVTaXplKSAqIHVwc2NhbGVTaXplO1xyXG5cclxuICAgICAgICAvLyBjb3JuZXJzXHJcbiAgICAgICAgdGhpcy5pbWFnZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCwgeSwgNyAqIHVwc2NhbGVTaXplLCA3ICogdXBzY2FsZVNpemUsIDAsIDAsIDcsIDcpO1xyXG4gICAgICAgIHRoaXMuaW1hZ2UucmVuZGVyUGFydGlhbCh0YXJnZXQsIHggKyB3IC0gNyAqIHVwc2NhbGVTaXplLCB5LCA3ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgOCwgMCwgNywgNyk7XHJcbiAgICAgICAgdGhpcy5pbWFnZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCwgeSArIGggLSA3ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCAwLCA4LCA3LCA3KTtcclxuICAgICAgICB0aGlzLmltYWdlLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4ICsgdyAtIDcgKiB1cHNjYWxlU2l6ZSwgeSArIGggLSA3ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCA4LCA4LCA3LCA3KTtcclxuXHJcbiAgICAgICAgLy8gdG9wIGFuZCBib3R0b21cclxuICAgICAgICB0aGlzLmltYWdlLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4ICsgNyAqIHVwc2NhbGVTaXplLCB5LCB3IC0gMTQgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCA3LCAwLCAxLCA3KTtcclxuICAgICAgICB0aGlzLmltYWdlLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4ICsgNyAqIHVwc2NhbGVTaXplLCB5ICsgaCAtIDcgKiB1cHNjYWxlU2l6ZSwgdyAtIDE0ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgNywgOCwgMSwgNyk7XHJcblxyXG4gICAgICAgIC8vIGxlZnQgYW5kIHJpZ2h0XHJcbiAgICAgICAgdGhpcy5pbWFnZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCwgeSArIDcgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCBoIC0gMTQgKiB1cHNjYWxlU2l6ZSwgMCwgNywgNywgMSk7XHJcbiAgICAgICAgdGhpcy5pbWFnZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCArIHcgLSA3ICogdXBzY2FsZVNpemUsIHkgKyA3ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgaCAtIDE0ICogdXBzY2FsZVNpemUsIDgsIDcsIDcsIDEpO1xyXG5cclxuICAgICAgICAvLyBjZW50ZXJcclxuICAgICAgICB0aGlzLmltYWdlLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4ICsgNyAqIHVwc2NhbGVTaXplLCB5ICsgNyAqIHVwc2NhbGVTaXplLCB3IC0gMTQgKiB1cHNjYWxlU2l6ZSwgaCAtIDE0ICogdXBzY2FsZVNpemUsIDcsIDcsIDEsIDEpO1xyXG5cclxuICAgICAgICBpZih0aGlzLmxpc3RlbmluZykge1xyXG4gICAgICAgICAgICB0aGlzLmZvbnQuZHJhd1RleHQodGFyZ2V0LCB0aGlzLnR4dCtcIjogY2xpY2sgdG8gY2FuY2VsXCIsIHggKyA2ICogdXBzY2FsZVNpemUsIE1hdGgucm91bmQoKHRoaXMueSArIHRoaXMuaCAvIDIpIC8gdXBzY2FsZVNpemUpICogdXBzY2FsZVNpemUgLSA2ICogdXBzY2FsZVNpemUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYodGhpcy5rZXlib2FyZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mb250LmRyYXdUZXh0KHRhcmdldCwgdGhpcy50eHQrXCI6ICAgXCIrS2V5cy5rZXlib2FyZE1hcFt0aGlzLnZhbHVlXSwgeCArIDYgKiB1cHNjYWxlU2l6ZSwgTWF0aC5yb3VuZCgodGhpcy55ICsgdGhpcy5oIC8gMikgLyB1cHNjYWxlU2l6ZSkgKiB1cHNjYWxlU2l6ZSAtIDYgKiB1cHNjYWxlU2l6ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZvbnQuZHJhd1RleHQodGFyZ2V0LCB0aGlzLnR4dCtcIjogICBNb3VzZSBcIit0aGlzLnZhbHVlLCB4ICsgNiAqIHVwc2NhbGVTaXplLCBNYXRoLnJvdW5kKCh0aGlzLnkgKyB0aGlzLmggLyAyKSAvIHVwc2NhbGVTaXplKSAqIHVwc2NhbGVTaXplIC0gNiAqIHVwc2NhbGVTaXplKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVNb3VzZU92ZXIobW91c2VYOiBudW1iZXIsIG1vdXNlWTogbnVtYmVyKSB7XHJcbiAgICAgICAgLy8gaWYgdGhlIG1vdXNlIHBvc2l0aW9uIGlzIGluc2lkZSB0aGUgYnV0dG9uLCByZXR1cm4gdHJ1ZVxyXG4gICAgICAgIGlmIChtb3VzZVggPiB0aGlzLnggJiYgbW91c2VYIDwgdGhpcy54ICsgdGhpcy53ICYmIG1vdXNlWSA+IHRoaXMueSAmJiBtb3VzZVkgPCB0aGlzLnkgKyB0aGlzLmgpIHtcclxuICAgICAgICAgICAgdGhpcy5tb3VzZUlzT3ZlciA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLm1vdXNlSXNPdmVyID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9uUHJlc3NlZCgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImlucHV0IGJveCBwcmVzc2VkXCIpO1xyXG4gICAgICAgIHRoaXMubGlzdGVuaW5nID0gIXRoaXMubGlzdGVuaW5nO1xyXG4gICAgICAgIGlmKHRoaXMubGlzdGVuaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2UgPSBVaUFzc2V0cy5idXR0b25fc2VsZWN0ZWQ7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5pbWFnZSA9IFVpQXNzZXRzLmJ1dHRvbl91bnNlbGVjdGVkO1xyXG4gICAgICAgIC8vIEF1ZGlvQXNzZXRzLnVpLmludmVudG9yeUNsYWNrLnBsYXlSYW5kb20oKTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCA9IElucHV0Qm94OyIsImltcG9ydCBSZW5kZXJhYmxlIGZyb20gJy4uL2ludGVyZmFjZXMvUmVuZGVyYWJsZSc7XHJcbmltcG9ydCBwNSBmcm9tICdwNSc7XHJcbmltcG9ydCB7IFVpQXNzZXRzIH0gZnJvbSAnLi4vYXNzZXRzL0Fzc2V0cyc7XHJcbmltcG9ydCBnYW1lIGZyb20gJy4uL01haW4nXHJcbmltcG9ydCBGb250UmVzb3VyY2UgZnJvbSAnLi4vYXNzZXRzL3Jlc291cmNlcy9Gb250UmVzb3VyY2UnO1xyXG5cclxuY2xhc3MgU2xpZGVyIGltcGxlbWVudHMgUmVuZGVyYWJsZSB7XHJcblxyXG4gICAgdmFsdWU6IG51bWJlclxyXG4gICAgbWluOiBudW1iZXJcclxuICAgIG1heDogbnVtYmVyXHJcbiAgICBzdGVwOiBudW1iZXJcclxuICAgIG9uQ2hhbmdlZDogRnVuY3Rpb25cclxuICAgIHg6IG51bWJlclxyXG4gICAgeTogbnVtYmVyXHJcbiAgICB3OiBudW1iZXJcclxuICAgIGg6IG51bWJlclxyXG4gICAgYmVpbmdFZGl0ZWQ6IGJvb2xlYW5cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBmb250OiBGb250UmVzb3VyY2UsXHJcbiAgICAgICAgdHh0OiBzdHJpbmcsXHJcbiAgICAgICAgdmFsdWU6bnVtYmVyLFxyXG4gICAgICAgIG1pbjogbnVtYmVyLFxyXG4gICAgICAgIG1heDogbnVtYmVyLFxyXG4gICAgICAgIHN0ZXA6IG51bWJlcixcclxuICAgICAgICB4OiBudW1iZXIsXHJcbiAgICAgICAgeTogbnVtYmVyLFxyXG4gICAgICAgIHc6IG51bWJlcixcclxuICAgICAgICBoOiBudW1iZXIsXHJcbiAgICAgICAgb25DaGFuZ2VkOiBGdW5jdGlvbikge1xyXG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZVxyXG4gICAgICAgIHRoaXMubWluID0gbWluXHJcbiAgICAgICAgdGhpcy5tYXggPSBtYXhcclxuICAgICAgICB0aGlzLnN0ZXAgPSBzdGVwXHJcbiAgICAgICAgdGhpcy5vbkNoYW5nZWQgPSBvbkNoYW5nZWRcclxuICAgICAgICB0aGlzLnggPSB4XHJcbiAgICAgICAgdGhpcy55ID0geVxyXG4gICAgICAgIHRoaXMudyA9IHdcclxuICAgICAgICB0aGlzLmggPSBoXHJcbiAgICAgICAgdGhpcy5iZWluZ0VkaXRlZCA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcih0YXJnZXQ6IHA1LCB1cHNjYWxlU2l6ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgLy8gc2V0IHRoZSBjb29yZHMgYW5kIGRpbWVuc2lvbnMgdG8gcm91bmQgdG8gdGhlIG5lYXJlc3QgdW4tdXBzY2FsZWQgcGl4ZWxcclxuICAgICAgICBjb25zdCB4ID0gTWF0aC5yb3VuZCh0aGlzLngvdXBzY2FsZVNpemUpKnVwc2NhbGVTaXplO1xyXG4gICAgICAgIGNvbnN0IHkgPSBNYXRoLnJvdW5kKCh0aGlzLnkrdGhpcy5oLzIpL3Vwc2NhbGVTaXplKSp1cHNjYWxlU2l6ZTtcclxuICAgICAgICBjb25zdCB3ID0gTWF0aC5yb3VuZCh0aGlzLncvdXBzY2FsZVNpemUpKnVwc2NhbGVTaXplO1xyXG5cclxuICAgICAgICAvLyBsZWZ0IHNpZGUgb2Ygc2xpZGVyIGJhclxyXG4gICAgICAgIFVpQXNzZXRzLnNsaWRlcl9iYXIucmVuZGVyUGFydGlhbCh0YXJnZXQsIHgsIHktMip1cHNjYWxlU2l6ZSwgMip1cHNjYWxlU2l6ZSwgNCp1cHNjYWxlU2l6ZSwgMCwgMCwgMiwgNCk7XHJcbiAgICAgICAgLy8gcmlnaHQgc2lkZSBvZiBzbGlkZXIgYmFyXHJcbiAgICAgICAgVWlBc3NldHMuc2xpZGVyX2Jhci5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCt3LTIqdXBzY2FsZVNpemUsIHktMip1cHNjYWxlU2l6ZSwgMip1cHNjYWxlU2l6ZSwgNCp1cHNjYWxlU2l6ZSwgMywgMCwgMiwgNCk7XHJcbiAgICAgICAgLy8gY2VudGVyIG9mIHNsaWRlciBiYXJcclxuICAgICAgICBVaUFzc2V0cy5zbGlkZXJfYmFyLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4KzIqdXBzY2FsZVNpemUsIHktMip1cHNjYWxlU2l6ZSwgdy00KnVwc2NhbGVTaXplLCA0KnVwc2NhbGVTaXplLCAyLCAwLCAxLCA0KTtcclxuICAgICAgICAvLyBoYW5kbGVcclxuICAgICAgICBVaUFzc2V0cy5zbGlkZXJfaGFuZGxlLnJlbmRlcih0YXJnZXQsIHgrTWF0aC5yb3VuZCgodGhpcy52YWx1ZS10aGlzLm1pbikvKHRoaXMubWF4LXRoaXMubWluKSoody04KnVwc2NhbGVTaXplKS91cHNjYWxlU2l6ZSkqdXBzY2FsZVNpemUsIHktNCp1cHNjYWxlU2l6ZSwgOCp1cHNjYWxlU2l6ZSwgOSp1cHNjYWxlU2l6ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlU2xpZGVyUG9zaXRpb24obW91c2VYOiBudW1iZXIpIHtcclxuICAgICAgICBpZih0aGlzLmJlaW5nRWRpdGVkKXtcclxuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IE1hdGgubWF4KHRoaXMubWluLCBNYXRoLm1pbih0aGlzLm1heCwgTWF0aC5yb3VuZCgodGhpcy5taW4rKHRoaXMubWF4LXRoaXMubWluKSooKChtb3VzZVgtdGhpcy54LTQqZ2FtZS51cHNjYWxlU2l6ZSkgLyAodGhpcy53LSg4KmdhbWUudXBzY2FsZVNpemUpKSkpKS90aGlzLnN0ZXApKnRoaXMuc3RlcCkpO1xyXG4gICAgICAgICAgICB0aGlzLm9uQ2hhbmdlZCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCA9IFNsaWRlcjsiLCJpbXBvcnQgUmVuZGVyYWJsZSBmcm9tICcuLi9pbnRlcmZhY2VzL1JlbmRlcmFibGUnO1xyXG5pbXBvcnQgcDUgZnJvbSAncDUnO1xyXG5pbXBvcnQgeyBVaUFzc2V0cyB9IGZyb20gJy4uL2Fzc2V0cy9Bc3NldHMnO1xyXG5cclxuY2xhc3MgVWlGcmFtZSBpbXBsZW1lbnRzIFJlbmRlcmFibGUge1xyXG5cclxuICAgIHg6IG51bWJlclxyXG4gICAgeTogbnVtYmVyXHJcbiAgICB3OiBudW1iZXJcclxuICAgIGg6IG51bWJlclxyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHg6IG51bWJlcixcclxuICAgICAgICB5OiBudW1iZXIsXHJcbiAgICAgICAgdzogbnVtYmVyLFxyXG4gICAgICAgIGg6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMueCA9IHhcclxuICAgICAgICB0aGlzLnkgPSB5XHJcbiAgICAgICAgdGhpcy53ID0gd1xyXG4gICAgICAgIHRoaXMuaCA9IGhcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIodGFyZ2V0OiBwNSwgdXBzY2FsZVNpemU6IG51bWJlcikge1xyXG4gICAgICAgIC8vIHNldCB0aGUgY29vcmRzIGFuZCBkaW1lbnNpb25zIHRvIHJvdW5kIHRvIHRoZSBuZWFyZXN0IHVuLXVwc2NhbGVkIHBpeGVsXHJcbiAgICAgICAgY29uc3QgeCA9IE1hdGgucm91bmQodGhpcy54L3Vwc2NhbGVTaXplKSp1cHNjYWxlU2l6ZTtcclxuICAgICAgICBjb25zdCB5ID0gTWF0aC5yb3VuZCh0aGlzLnkvdXBzY2FsZVNpemUpKnVwc2NhbGVTaXplO1xyXG4gICAgICAgIGNvbnN0IHcgPSBNYXRoLnJvdW5kKHRoaXMudy91cHNjYWxlU2l6ZSkqdXBzY2FsZVNpemU7XHJcbiAgICAgICAgY29uc3QgaCA9IE1hdGgucm91bmQodGhpcy5oL3Vwc2NhbGVTaXplKSp1cHNjYWxlU2l6ZTtcclxuXHJcbiAgICAgICAgLy8gY29ybmVyc1xyXG4gICAgICAgIFVpQXNzZXRzLnVpX2ZyYW1lLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4LCB5LCA3KnVwc2NhbGVTaXplLCA3KnVwc2NhbGVTaXplLCAwLCAwLCA3LCA3KTtcclxuICAgICAgICBVaUFzc2V0cy51aV9mcmFtZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCt3LTcqdXBzY2FsZVNpemUsIHksIDcqdXBzY2FsZVNpemUsIDcqdXBzY2FsZVNpemUsIDgsIDAsIDcsIDcpO1xyXG4gICAgICAgIFVpQXNzZXRzLnVpX2ZyYW1lLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4LCB5K2gtNyp1cHNjYWxlU2l6ZSwgNyp1cHNjYWxlU2l6ZSwgNyp1cHNjYWxlU2l6ZSwgMCwgOCwgNywgNyk7XHJcbiAgICAgICAgVWlBc3NldHMudWlfZnJhbWUucmVuZGVyUGFydGlhbCh0YXJnZXQsIHgrdy03KnVwc2NhbGVTaXplLCB5K2gtNyp1cHNjYWxlU2l6ZSwgNyp1cHNjYWxlU2l6ZSwgNyp1cHNjYWxlU2l6ZSwgOCwgOCwgNywgNyk7XHJcblxyXG4gICAgICAgIC8vIHRvcCBhbmQgYm90dG9tXHJcbiAgICAgICAgVWlBc3NldHMudWlfZnJhbWUucmVuZGVyUGFydGlhbCh0YXJnZXQsIHgrNyp1cHNjYWxlU2l6ZSwgeSwgdy0xNCp1cHNjYWxlU2l6ZSwgNyp1cHNjYWxlU2l6ZSwgNywgMCwgMSwgNyk7XHJcbiAgICAgICAgVWlBc3NldHMudWlfZnJhbWUucmVuZGVyUGFydGlhbCh0YXJnZXQsIHgrNyp1cHNjYWxlU2l6ZSwgeStoLTcqdXBzY2FsZVNpemUsIHctMTQqdXBzY2FsZVNpemUsIDcqdXBzY2FsZVNpemUsIDcsIDgsIDEsIDcpO1xyXG5cclxuICAgICAgICAvLyBsZWZ0IGFuZCByaWdodFxyXG4gICAgICAgIFVpQXNzZXRzLnVpX2ZyYW1lLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4LCB5KzcqdXBzY2FsZVNpemUsIDcqdXBzY2FsZVNpemUsIGgtMTQqdXBzY2FsZVNpemUsIDAsIDcsIDcsIDEpO1xyXG4gICAgICAgIFVpQXNzZXRzLnVpX2ZyYW1lLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4K3ctNyp1cHNjYWxlU2l6ZSwgeSs3KnVwc2NhbGVTaXplLCA3KnVwc2NhbGVTaXplLCBoLTE0KnVwc2NhbGVTaXplLCA4LCA3LCA3LCAxKTtcclxuXHJcbiAgICAgICAgLy8gY2VudGVyXHJcbiAgICAgICAgVWlBc3NldHMudWlfZnJhbWUucmVuZGVyUGFydGlhbCh0YXJnZXQsIHgrNyp1cHNjYWxlU2l6ZSwgeSs3KnVwc2NhbGVTaXplLCB3LTE0KnVwc2NhbGVTaXplLCBoLTE0KnVwc2NhbGVTaXplLCA3LCA3LCAxLCAxKTtcclxuXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCA9IFVpRnJhbWU7IiwiaW1wb3J0IFJlbmRlcmFibGUgZnJvbSAnLi4vaW50ZXJmYWNlcy9SZW5kZXJhYmxlJztcclxuaW1wb3J0IHA1IGZyb20gJ3A1JztcclxuaW1wb3J0IEJ1dHRvbiBmcm9tICcuLi91aS9CdXR0b24nO1xyXG5pbXBvcnQgU2xpZGVyIGZyb20gJy4uL3VpL1NsaWRlcic7XHJcbmltcG9ydCBVaUZyYW1lIGZyb20gJy4vVWlGcmFtZSc7XHJcbmltcG9ydCBnYW1lIGZyb20gJy4uL01haW4nO1xyXG5pbXBvcnQgSW5wdXRCb3ggZnJvbSAnLi9JbnB1dEJveCc7XHJcbmltcG9ydCB7IFVpQXNzZXRzIH0gZnJvbSAnLi4vYXNzZXRzL0Fzc2V0cyc7XHJcblxyXG5hYnN0cmFjdCBjbGFzcyBVaVNjcmVlbiBpbXBsZW1lbnRzIFJlbmRlcmFibGUge1xyXG5cclxuICAgIGJ1dHRvbnM6IEJ1dHRvbltdO1xyXG4gICAgc2xpZGVyczogU2xpZGVyW107XHJcbiAgICBpbnB1dEJveGVzOiBJbnB1dEJveFtdO1xyXG5cclxuICAgIGZyYW1lOiBVaUZyYW1lXHJcblxyXG4gICAgYWJzdHJhY3QgcmVuZGVyKHRhcmdldDogcDUsIHVwc2NhbGVTaXplOiBudW1iZXIpOiB2b2lkO1xyXG5cclxuICAgIGFic3RyYWN0IHdpbmRvd1VwZGF0ZSgpOiB2b2lkXHJcblxyXG4gICAgbW91c2VQcmVzc2VkKGJ0bjogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYodGhpcy5idXR0b25zICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgLy8gbG9vcCB0aHJvdWdoIGFsbCB0aGUgYnV0dG9ucyBpbiB0aGlzIG1lbnUgYW5kIGlmIHRoZSBtb3VzZSBpcyBvdmVyIHRoZW0sIHRoZW4gY2FsbCB0aGUgYnV0dG9uJ3Mgb25QcmVzc2VkKCkgZnVuY3Rpb24uICBUaGUgb25QcmVzc2VkKCkgZnVuY3Rpb24gaXMgcGFzc2VkIGluIHRocm91Z2ggdGhlIGNvbnN0cnVjdG9yLlxyXG4gICAgICAgICAgICBmb3IoY29uc3QgaSBvZiB0aGlzLmJ1dHRvbnMpIHtcclxuICAgICAgICAgICAgICAgIGlmKGkubW91c2VJc092ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBpLm9uUHJlc3NlZCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLnNsaWRlcnMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAvLyBsb29wIHRocm91Z2ggYWxsIHRoZSBzbGlkZXJzIGFuZCBpbnRlcmFjdCB3aXRoIHRoZW0gYWNjb3JkaW5nbHlcclxuICAgICAgICAgICAgZm9yKGNvbnN0IGkgb2YgdGhpcy5zbGlkZXJzKSB7XHJcbiAgICAgICAgICAgICAgICBpLnVwZGF0ZVNsaWRlclBvc2l0aW9uKGdhbWUubW91c2VYKTtcclxuICAgICAgICAgICAgICAgIGlmKGdhbWUubW91c2VYPmkueCAmJiBnYW1lLm1vdXNlWDxpLngraS53ICYmIGdhbWUubW91c2VZPmkueSAmJiBnYW1lLm1vdXNlWTxpLnkraS5oKVxyXG4gICAgICAgICAgICAgICAgICAgIGkuYmVpbmdFZGl0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMuaW5wdXRCb3hlcyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2codGhpcy5pbnB1dEJveGVzKTtcclxuICAgICAgICAgICAgLy8gbG9vcCB0aHJvdWdoIGFsbCB0aGUgaW5wdXQgYm94ZXMgYW5kIGludGVyYWN0IHdpdGggdGhlbSBhY2NvcmRpbmdseVxyXG4gICAgICAgICAgICBmb3IoY29uc3QgaSBvZiB0aGlzLmlucHV0Qm94ZXMpIHtcclxuICAgICAgICAgICAgICAgIGlmKGkubW91c2VJc092ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBpLm9uUHJlc3NlZCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZihpLmxpc3RlbmluZykge1xyXG4gICAgICAgICAgICAgICAgICAgIGkubGlzdGVuaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS5jb250cm9sc1tpLmluZGV4XS5rZXlDb2RlID0gYnRuO1xyXG4gICAgICAgICAgICAgICAgICAgIGdhbWUuY29udHJvbHNbaS5pbmRleF0ua2V5Ym9hcmQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBpLnZhbHVlID0gYnRuO1xyXG4gICAgICAgICAgICAgICAgICAgIGkua2V5Ym9hcmQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBpLmltYWdlID0gVWlBc3NldHMuYnV0dG9uX3Vuc2VsZWN0ZWQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbW91c2VSZWxlYXNlZCgpIHtcclxuICAgICAgICBpZih0aGlzLnNsaWRlcnMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAvLyBsb29wIHRocm91Z2ggYWxsIHRoZSBzbGlkZXJzIGFuZCBpbnRlcmFjdCB3aXRoIHRoZW0gYWNjb3JkaW5nbHlcclxuICAgICAgICAgICAgZm9yKGNvbnN0IGkgb2YgdGhpcy5zbGlkZXJzKSB7XHJcbiAgICAgICAgICAgICAgICBpLmJlaW5nRWRpdGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQgPSBVaVNjcmVlbiIsImltcG9ydCBVaVNjcmVlbiBmcm9tICcuLi9VaVNjcmVlbic7XHJcbmltcG9ydCBwNSBmcm9tICdwNSc7XHJcbmltcG9ydCBVaUZyYW1lIGZyb20gJy4uL1VpRnJhbWUnO1xyXG5pbXBvcnQgZ2FtZSBmcm9tICcuLi8uLi9NYWluJztcclxuaW1wb3J0IEJ1dHRvbiBmcm9tICcuLi9CdXR0b24nO1xyXG5pbXBvcnQgRm9udFJlc291cmNlIGZyb20gJy4uLy4uL2Fzc2V0cy9yZXNvdXJjZXMvRm9udFJlc291cmNlJztcclxuaW1wb3J0IHsgT3B0aW9uc01lbnUgfSBmcm9tICcuL09wdGlvbnNNZW51JztcclxuaW1wb3J0IElucHV0Qm94IGZyb20gJy4uL0lucHV0Qm94JztcclxuaW1wb3J0IHsgQ29udHJvbCB9IGZyb20gJy4uLy4uL2lucHV0L0NvbnRyb2wnXHJcblxyXG5leHBvcnQgY2xhc3MgQ29udHJvbHNNZW51IGV4dGVuZHMgVWlTY3JlZW4ge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGZvbnQ6IEZvbnRSZXNvdXJjZSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgLy8gbWFrZSB0aGUgZnJhbWUgd2l0aCBzb21lIGRlZmF1bHQgdmFsdWVzLiAgVGhlc2Ugd2lsbCBsYXRlciBiZSBjaGFuZ2VkIHRvIGZpdCB0aGUgc2NyZWVuIHNpemUuXHJcbiAgICAgICAgdGhpcy5mcmFtZSA9IG5ldyBVaUZyYW1lKDAsIDAsIDAsIDApO1xyXG5cclxuICAgICAgICAvLyBtYWtlIHNvbWUgYnV0dG9ucyB3aXRoIGRlZmF1bHQgcG9zaXRpb25zXHJcbiAgICAgICAgdGhpcy5idXR0b25zID0gW1xyXG4gICAgICAgICAgICBuZXcgQnV0dG9uKGZvbnQsIFwiQmFja1wiLCBcIlJldHVybiB0byB0aGUgb3B0aW9ucyBtZW51LlwiLCAwLCAwLCAwLCAwLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm9wdGlvbnMgbWVudVwiKTtcclxuICAgICAgICAgICAgICAgIGdhbWUuY3VycmVudFVpID0gbmV3IE9wdGlvbnNNZW51KGZvbnQpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIF07XHJcblxyXG4gICAgICAgIHRoaXMuaW5wdXRCb3hlcyA9IFtcclxuICAgICAgICAgICAgLy8gbmV3IElucHV0Qm94KGZvbnQsIFwiV2FsayBSaWdodFwiLCB0cnVlLCA2OCwgMCwgMCwgMCwgMCwgMCksXHJcbiAgICAgICAgICAgIC8vIG5ldyBJbnB1dEJveChmb250LCBcIldhbGsgTGVmdFwiLCB0cnVlLCA2NSwgMSwgMCwgMCwgMCwgMCksXHJcbiAgICAgICAgICAgIC8vIG5ldyBJbnB1dEJveChmb250LCBcIkp1bXBcIiwgdHJ1ZSwgMzIsIDIsIDAsIDAsIDAsIDApLFxyXG4gICAgICAgICAgICAvLyBuZXcgSW5wdXRCb3goZm9udCwgXCJQYXVzZVwiLCB0cnVlLCAyNywgMywgMCwgMCwgMCwgMClcclxuICAgICAgICBdXHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGkgPSAwO1xyXG4gICAgICAgIGZvcihsZXQgY29udHJvbCBvZiBnYW1lLmNvbnRyb2xzKSB7XHJcbiAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgdGhpcy5pbnB1dEJveGVzLnB1c2gobmV3IElucHV0Qm94KGZvbnQsIGNvbnRyb2wuZGVzY3JpcHRpb24sIGNvbnRyb2wua2V5Ym9hcmQsIGNvbnRyb2wua2V5Q29kZSwgaSwgMCwgMCwgMCwgMCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyB1cGRhdGUgdGhlIHNpemUgb2YgdGhlIGVsZW1lbnRzIGJhc2VkIG9uIHRoZSBpbml0aWFsIHNjcmVlbiBzaXplXHJcbiAgICAgICAgdGhpcy53aW5kb3dVcGRhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIodGFyZ2V0OiBwNSwgdXBzY2FsZVNpemU6IG51bWJlcik6IHZvaWQge1xyXG5cclxuICAgICAgICAvLyByZW5kZXIgdGhlIHJlY3Rhbmd1bGFyIGltYWdlXHJcbiAgICAgICAgdGhpcy5mcmFtZS5yZW5kZXIodGFyZ2V0LCB1cHNjYWxlU2l6ZSk7XHJcblxyXG4gICAgICAgIC8vIGxvb3AgdGhyb3VnaCB0aGUgYnV0dG9ucyBhcnJheSBhbmQgcmVuZGVyIGVhY2ggb25lLlxyXG4gICAgICAgIHRoaXMuYnV0dG9ucy5mb3JFYWNoKGJ1dHRvbiA9PiB7XHJcbiAgICAgICAgICAgIGJ1dHRvbi5yZW5kZXIodGFyZ2V0LCB1cHNjYWxlU2l6ZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIGxvb3AgdGhyb3VnaCB0aGUgaW5wdXRCb3hlcyBhcnJheSBhbmQgcmVuZGVyIGVhY2ggb25lLlxyXG4gICAgICAgIHRoaXMuaW5wdXRCb3hlcy5mb3JFYWNoKGlucHV0Qm94ID0+IHtcclxuICAgICAgICAgICAgaW5wdXRCb3gucmVuZGVyKHRhcmdldCwgdXBzY2FsZVNpemUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHdpbmRvd1VwZGF0ZSgpIHtcclxuICAgICAgICAvLyBzZXQgdGhlIHBvc2l0aW9uIG9mIHRoZSBmcmFtZVxyXG4gICAgICAgIHRoaXMuZnJhbWUueCA9IGdhbWUud2lkdGggLyAyIC0gMjAwIC8gMiAqIGdhbWUudXBzY2FsZVNpemU7Ly8gY2VudGVyIHRoZSBmcmFtZSBpbiB0aGUgY2VudGVyIG9mIHRoZSBzY3JlZW5cclxuICAgICAgICB0aGlzLmZyYW1lLnkgPSBnYW1lLmhlaWdodCAvIDIgLSA1NiAqIGdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgdGhpcy5mcmFtZS53ID0gMjAwICogZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICB0aGlzLmZyYW1lLmggPSAxNDggKiBnYW1lLnVwc2NhbGVTaXplO1xyXG5cclxuICAgICAgICAvLyBzZXQgdGhlIHBvc2l0aW9ucyBvZiB0aGUgYnV0dG9uXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLnggPSBnYW1lLndpZHRoIC8gMiAtIDE5MiAvIDIgKiBnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0ueSA9IGdhbWUuaGVpZ2h0IC8gMiArIDIwICogaSAqIGdhbWUudXBzY2FsZVNpemUgKyAyMCAqIGdhbWUudXBzY2FsZVNpemUgKiB0aGlzLmlucHV0Qm94ZXMubGVuZ3RoO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0udyA9IDE5MiAqIGdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS5oID0gMTYgKiBnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0udXBkYXRlTW91c2VPdmVyKGdhbWUubW91c2VYLCBnYW1lLm1vdXNlWSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBzZXQgdGhlIHBvc2l0aW9ucyBvZiBhbGwgdGhlIGlucHV0IGJveGVzXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmlucHV0Qm94ZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5pbnB1dEJveGVzW2ldLnggPSBnYW1lLndpZHRoIC8gMiAtIDE2OCAvIDIgKiBnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLmlucHV0Qm94ZXNbaV0ueSA9IGdhbWUuaGVpZ2h0IC8gMiArIDIwICogaSAqIGdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuaW5wdXRCb3hlc1tpXS53ID0gMTY4ICogZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5pbnB1dEJveGVzW2ldLmggPSAxNiAqIGdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuaW5wdXRCb3hlc1tpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCBVaVNjcmVlbiBmcm9tICcuLi9VaVNjcmVlbic7XHJcbmltcG9ydCBwNSBmcm9tICdwNSc7XHJcbmltcG9ydCBVaUZyYW1lIGZyb20gJy4uL1VpRnJhbWUnO1xyXG5pbXBvcnQgZ2FtZSBmcm9tICcuLi8uLi9NYWluJztcclxuaW1wb3J0IEJ1dHRvbiBmcm9tICcuLi9CdXR0b24nO1xyXG5pbXBvcnQgU2xpZGVyIGZyb20gJy4uL1NsaWRlcic7XHJcbmltcG9ydCB7IE9wdGlvbnNNZW51IH0gZnJvbSAnLi9PcHRpb25zTWVudSc7XHJcbmltcG9ydCBGb250UmVzb3VyY2UgZnJvbSAnLi4vLi4vYXNzZXRzL3Jlc291cmNlcy9Gb250UmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBVaUFzc2V0cyB9IGZyb20gJy4uLy4uL2Fzc2V0cy9Bc3NldHMnO1xyXG5pbXBvcnQgeyBXb3JsZENyZWF0aW9uTWVudSB9IGZyb20gJy4vV29ybGRDcmVhdGlvbk1lbnUnO1xyXG5cclxuZXhwb3J0IGNsYXNzIE1haW5NZW51IGV4dGVuZHMgVWlTY3JlZW4ge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGZvbnQ6IEZvbnRSZXNvdXJjZSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIC8vIG1ha2UgdGhlIGZyYW1lIHdpdGggc29tZSBkZWZhdWx0IHZhbHVlcy4gIFRoZXNlIHdpbGwgbGF0ZXIgYmUgY2hhbmdlZCB0byBmaXQgdGhlIHNjcmVlbiBzaXplLlxyXG4gICAgICAgIHRoaXMuZnJhbWUgPSBuZXcgVWlGcmFtZSgwLCAwLCAwLCAwKTtcclxuXHJcbiAgICAgICAgLy8gbWFrZSA0IGJ1dHRvbnMgd2l0aCBkZWZhdWx0IHBvc2l0aW9uc1xyXG4gICAgICAgIHRoaXMuYnV0dG9ucyA9IFtcclxuICAgICAgICAgICAgbmV3IEJ1dHRvbihmb250LCBcIlJlc3VtZSBHYW1lXCIsIFwiS2VlcCBwbGF5aW5nIHdoZXJlIHlvdSBsZWZ0IG9mZi5cIiwgMCwgMCwgMCwgMCwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJyZXN1bWUgZ2FtZVwiKTtcclxuICAgICAgICAgICAgICAgIGdhbWUuY3VycmVudFVpID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgbmV3IEJ1dHRvbihmb250LCBcIk5ldyBHYW1lXCIsIFwiQ3JlYXRlcyBhIG5ldyBzZXJ2ZXIgdGhhdCB5b3VyIGZyaWVuZHMgY2FuIGpvaW4uXCIsIDAsIDAsIDAsIDAsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibmV3IGdhbWVcIik7XHJcbiAgICAgICAgICAgICAgICBnYW1lLmN1cnJlbnRVaSA9IG5ldyBXb3JsZENyZWF0aW9uTWVudShmb250KTtcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIG5ldyBCdXR0b24oZm9udCwgXCJKb2luIEdhbWVcIiwgXCJKb2luIGEgZ2FtZSB3aXRoIHlvdXIgZnJpZW5kcywgb3IgbWFrZSBuZXcgb25lcy5cIiwgMCwgMCwgMCwgMCwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJqb2luIGdhbWVcIik7XHJcbiAgICAgICAgICAgICAgICBnYW1lLmN1cnJlbnRVaSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIG5ldyBCdXR0b24oZm9udCwgXCJPcHRpb25zXCIsIFwiQ2hhbmdlIHlvdXIga2V5YmluZHMsIHJlZHVjZSBsYWcsIGV0Yy5cIiwgMCwgMCwgMCwgMCwgKCkgPT57XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm9wdGlvbnNcIik7XHJcbiAgICAgICAgICAgICAgICBnYW1lLmN1cnJlbnRVaSA9IG5ldyBPcHRpb25zTWVudShmb250KTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICBdO1xyXG5cclxuICAgICAgICAvLyB1cGRhdGUgdGhlIHNpemUgb2YgdGhlIGVsZW1lbnRzIGJhc2VkIG9uIHRoZSBpbml0aWFsIHNjcmVlbiBzaXplXHJcbiAgICAgICAgdGhpcy53aW5kb3dVcGRhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIodGFyZ2V0OiBwNSwgdXBzY2FsZVNpemU6IG51bWJlcik6IHZvaWQge1xyXG5cclxuICAgICAgICAvLyByZW5kZXIgdGhlIHJlY3Rhbmd1bGFyIGltYWdlIHRoYXQgdGhlIHdob2xlIG1lbnUgaXMgb25cclxuICAgICAgICB0aGlzLmZyYW1lLnJlbmRlcih0YXJnZXQsIHVwc2NhbGVTaXplKTtcclxuXHJcbiAgICAgICAgVWlBc3NldHMudGl0bGVfaW1hZ2UucmVuZGVyKHRhcmdldCwgTWF0aC5yb3VuZCh0aGlzLmZyYW1lLngvdXBzY2FsZVNpemUrMSkqdXBzY2FsZVNpemUsIE1hdGgucm91bmQodGhpcy5mcmFtZS55L3Vwc2NhbGVTaXplKzQpKnVwc2NhbGVTaXplLCAyNTYqdXBzY2FsZVNpemUsIDQwKnVwc2NhbGVTaXplKTtcclxuXHJcbiAgICAgICAgLy8gbG9vcCB0aHJvdWdoIHRoZSBidXR0b25zIGFycmF5IGFuZCByZW5kZXIgZWFjaCBvbmUuXHJcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIHRoaXMuYnV0dG9ucykge1xyXG4gICAgICAgICAgICBpdGVtLnJlbmRlcih0YXJnZXQsIHVwc2NhbGVTaXplKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHdpbmRvd1VwZGF0ZSgpIHtcclxuICAgICAgICAvLyBzZXQgdGhlIHBvc2l0aW9uIG9mIHRoZSBmcmFtZVxyXG4gICAgICAgIHRoaXMuZnJhbWUueCA9IGdhbWUud2lkdGgvMi0yNjQvMipnYW1lLnVwc2NhbGVTaXplOy8vIGNlbnRlciB0aGUgZnJhbWUgaW4gdGhlIG1pZGRsZSBvZiB0aGUgc2NyZWVuXHJcbiAgICAgICAgdGhpcy5mcmFtZS55ID0gZ2FtZS5oZWlnaHQvMi01NipnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgIHRoaXMuZnJhbWUudyA9IDI2NCpnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgIHRoaXMuZnJhbWUuaCA9IDQ4KmdhbWUudXBzY2FsZVNpemU7XHJcblxyXG4gICAgICAgIC8vIHNldCB0aGUgcG9zaXRpb25zIG9mIGFsbCB0aGUgYnV0dG9uc1xyXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGk8NDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS54ID0gZ2FtZS53aWR0aC8yLTE5Mi8yKmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS55ID0gZ2FtZS5oZWlnaHQvMisyMCppKmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS53ID0gMTkyKmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS5oID0gMTYqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLnVwZGF0ZU1vdXNlT3ZlcihnYW1lLm1vdXNlWCwgZ2FtZS5tb3VzZVkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IFVpU2NyZWVuIGZyb20gJy4uL1VpU2NyZWVuJztcclxuaW1wb3J0IHA1IGZyb20gJ3A1JztcclxuaW1wb3J0IFVpRnJhbWUgZnJvbSAnLi4vVWlGcmFtZSc7XHJcbmltcG9ydCBnYW1lIGZyb20gJy4uLy4uL01haW4nO1xyXG5pbXBvcnQgQnV0dG9uIGZyb20gJy4uL0J1dHRvbic7XHJcbmltcG9ydCBGb250UmVzb3VyY2UgZnJvbSAnLi4vLi4vYXNzZXRzL3Jlc291cmNlcy9Gb250UmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBNYWluTWVudSB9IGZyb20gJy4vTWFpbk1lbnUnO1xyXG5pbXBvcnQgeyBWaWRlb1NldHRpbmdzTWVudSB9IGZyb20gJy4vVmlkZW9TZXR0aW5nc01lbnUnO1xyXG5pbXBvcnQgeyBDb250cm9sc01lbnUgfSBmcm9tICcuL0NvbnRyb2xzTWVudSc7XHJcblxyXG5leHBvcnQgY2xhc3MgT3B0aW9uc01lbnUgZXh0ZW5kcyBVaVNjcmVlbiB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZm9udDogRm9udFJlc291cmNlKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICAvLyBtYWtlIHRoZSBmcmFtZSB3aXRoIHNvbWUgZGVmYXVsdCB2YWx1ZXMuICBUaGVzZSB3aWxsIGxhdGVyIGJlIGNoYW5nZWQgdG8gZml0IHRoZSBzY3JlZW4gc2l6ZS5cclxuICAgICAgICB0aGlzLmZyYW1lID0gbmV3IFVpRnJhbWUoMCwgMCwgMCwgMCk7XHJcbiAgICAgICAgLy8gbWFrZSBzb21lIGJ1dHRvbnMgd2l0aCBkZWZhdWx0IHBvc2l0aW9uc1xyXG4gICAgICAgIHRoaXMuYnV0dG9ucyA9IFtcclxuICAgICAgICAgICAgbmV3IEJ1dHRvbihmb250LCBcIlZpZGVvIFNldHRpbmdzXCIsIFwiQ2hhbmdlIHRoZSBiYWxhbmNlIGJldHdlZW4gcGVyZm9ybWFuY2UgYW5kIGZpZGVsaXR5LlwiLCAwLCAwLCAwLCAwLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInZpZGVvIHNldHRpbmdzXCIpO1xyXG4gICAgICAgICAgICAgICAgZ2FtZS5jdXJyZW50VWkgPSBuZXcgVmlkZW9TZXR0aW5nc01lbnUoZm9udCk7XHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBuZXcgQnV0dG9uKGZvbnQsIFwiQ29udHJvbHNcIiwgXCJDaGFuZ2UgeW91ciBrZXliaW5kcy5cIiwgMCwgMCwgMCwgMCwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJjb250cm9sIG1lbnVcIik7XHJcbiAgICAgICAgICAgICAgICBnYW1lLmN1cnJlbnRVaSA9IG5ldyBDb250cm9sc01lbnUoZm9udCk7XHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBuZXcgQnV0dG9uKGZvbnQsIFwiQXVkaW8gU2V0dGluZ3NcIiwgXCJDaGFuZ2UgdGhlIHZvbHVtZSBvZiBkaWZmZXJlbnQgc291bmRzLlwiLCAwLCAwLCAwLCAwLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImF1ZGlvIG1lbnVcIik7XHJcbiAgICAgICAgICAgICAgICBnYW1lLmN1cnJlbnRVaSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIG5ldyBCdXR0b24oZm9udCwgXCJCYWNrXCIsIFwiUmV0dXJuIHRvIHRoZSBtYWluIG1lbnUuXCIsIDAsIDAsIDAsIDAsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibWFpbiBtZW51XCIpO1xyXG4gICAgICAgICAgICAgICAgZ2FtZS5jdXJyZW50VWkgPSBuZXcgTWFpbk1lbnUoZm9udCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgXTtcclxuICAgICAgICAvLyB1cGRhdGUgdGhlIHNpemUgb2YgdGhlIGVsZW1lbnRzIGJhc2VkIG9uIHRoZSBpbml0aWFsIHNjcmVlbiBzaXplXHJcbiAgICAgICAgdGhpcy53aW5kb3dVcGRhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIodGFyZ2V0OiBwNSwgdXBzY2FsZVNpemU6IG51bWJlcik6IHZvaWQge1xyXG5cclxuICAgICAgICAvLyByZW5kZXIgdGhlIHJlY3Rhbmd1bGFyIGltYWdlIHRoYXQgdGhlIHdob2xlIG1lbnUgaXMgb25cclxuICAgICAgICB0aGlzLmZyYW1lLnJlbmRlcih0YXJnZXQsIHVwc2NhbGVTaXplKTtcclxuXHJcbiAgICAgICAgLy8gbG9vcCB0aHJvdWdoIHRoZSBidXR0b25zIGFycmF5IGFuZCByZW5kZXIgZWFjaCBvbmUuXHJcbiAgICAgICAgdGhpcy5idXR0b25zLmZvckVhY2goYnV0dG9uID0+IHtcclxuICAgICAgICAgICAgYnV0dG9uLnJlbmRlcih0YXJnZXQsIHVwc2NhbGVTaXplKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB3aW5kb3dVcGRhdGUoKSB7XHJcbiAgICAgICAgLy8gc2V0IHRoZSBwb3NpdGlvbiBvZiB0aGUgZnJhbWVcclxuICAgICAgICB0aGlzLmZyYW1lLnggPSBnYW1lLndpZHRoLzItMjAwLzIqZ2FtZS51cHNjYWxlU2l6ZTsvLyBjZW50ZXIgdGhlIGZyYW1lIGluIHRoZSBjZW50ZXIgb2YgdGhlIHNjcmVlblxyXG4gICAgICAgIHRoaXMuZnJhbWUueSA9IGdhbWUuaGVpZ2h0LzItNTYqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICB0aGlzLmZyYW1lLncgPSAyMDAqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICB0aGlzLmZyYW1lLmggPSA0OCpnYW1lLnVwc2NhbGVTaXplO1xyXG5cclxuICAgICAgICAvLyBzZXQgdGhlIHBvc2l0aW9ucyBvZiBhbGwgdGhlIGJ1dHRvbnNcclxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpPDQ7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0ueCA9IGdhbWUud2lkdGgvMi0xOTIvMipnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0ueSA9IGdhbWUuaGVpZ2h0LzIrMjAqaSpnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0udyA9IDE5MipnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0uaCA9IDE2KmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS51cGRhdGVNb3VzZU92ZXIoZ2FtZS5tb3VzZVgsIGdhbWUubW91c2VZKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IFVpU2NyZWVuIGZyb20gJy4uL1VpU2NyZWVuJztcclxuaW1wb3J0IHA1IGZyb20gJ3A1JztcclxuaW1wb3J0IFVpRnJhbWUgZnJvbSAnLi4vVWlGcmFtZSc7XHJcbmltcG9ydCBnYW1lIGZyb20gJy4uLy4uL01haW4nO1xyXG5pbXBvcnQgQnV0dG9uIGZyb20gJy4uL0J1dHRvbic7XHJcbmltcG9ydCB7IE9wdGlvbnNNZW51IH0gZnJvbSAnLi9PcHRpb25zTWVudSc7XHJcbmltcG9ydCBGb250UmVzb3VyY2UgZnJvbSAnLi4vLi4vYXNzZXRzL3Jlc291cmNlcy9Gb250UmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBNYWluTWVudSB9IGZyb20gJy4vTWFpbk1lbnUnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFBhdXNlTWVudSBleHRlbmRzIFVpU2NyZWVuIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihmb250OiBGb250UmVzb3VyY2UpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICAvLyBtYWtlIHRoZSBmcmFtZSB3aXRoIHNvbWUgZGVmYXVsdCB2YWx1ZXMuICBUaGVzZSB3aWxsIGxhdGVyIGJlIGNoYW5nZWQgdG8gZml0IHRoZSBzY3JlZW4gc2l6ZS5cclxuICAgICAgICB0aGlzLmZyYW1lID0gbmV3IFVpRnJhbWUoMCwgMCwgMCwgMCk7XHJcblxyXG4gICAgICAgIC8vIG1ha2UgNCBidXR0b25zIHdpdGggZGVmYXVsdCBwb3NpdGlvbnNcclxuICAgICAgICB0aGlzLmJ1dHRvbnMgPSBbXHJcbiAgICAgICAgICAgIG5ldyBCdXR0b24oZm9udCwgXCJSZXN1bWUgZ2FtZVwiLCBcIkdvIGJhY2sgdG8gdGhlIGdhbWUuXCIsIDAsIDAsIDAsIDAsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGdhbWUuY3VycmVudFVpID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgbmV3IEJ1dHRvbihmb250LCBcIk9wdGlvbnNcIiwgXCJDaGFuZ2UgeW91ciBrZXliaW5kcywgcmVkdWNlIGxhZywgZXRjLlwiLCAwLCAwLCAwLCAwLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBnYW1lLmN1cnJlbnRVaSA9IG5ldyBPcHRpb25zTWVudShmb250KTtcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIG5ldyBCdXR0b24oZm9udCwgXCJMZWF2ZSBnYW1lXCIsIFwiR28gYmFjayB0byBNYWluIE1lbnVcIiwgMCwgMCwgMCwgMCwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZ2FtZS5jdXJyZW50VWkgPSBuZXcgTWFpbk1lbnUoZm9udCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgXTtcclxuXHJcbiAgICAgICAgLy8gdXBkYXRlIHRoZSBzaXplIG9mIHRoZSBlbGVtZW50cyBiYXNlZCBvbiB0aGUgaW5pdGlhbCBzY3JlZW4gc2l6ZVxyXG4gICAgICAgIHRoaXMud2luZG93VXBkYXRlKCk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHJlbmRlcih0YXJnZXQ6IHA1LCB1cHNjYWxlU2l6ZTogbnVtYmVyKTogdm9pZCB7XHJcblxyXG4gICAgICAgIC8vIHJlbmRlciB0aGUgcmVjdGFuZ3VsYXIgaW1hZ2UgdGhhdCB0aGUgd2hvbGUgbWVudSBpcyBvblxyXG4gICAgICAgIHRoaXMuZnJhbWUucmVuZGVyKHRhcmdldCwgdXBzY2FsZVNpemUpO1xyXG5cclxuICAgICAgICAvLyBsb29wIHRocm91Z2ggdGhlIGJ1dHRvbnMgYXJyYXkgYW5kIHJlbmRlciBlYWNoIG9uZS5cclxuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdGhpcy5idXR0b25zKSB7XHJcbiAgICAgICAgICAgIGl0ZW0ucmVuZGVyKHRhcmdldCwgdXBzY2FsZVNpemUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgd2luZG93VXBkYXRlKCkge1xyXG4gICAgICAgIC8vIHNldCB0aGUgcG9zaXRpb24gb2YgdGhlIGZyYW1lXHJcbiAgICAgICAgdGhpcy5mcmFtZS54ID0gZ2FtZS53aWR0aC8yLTI1Ni8yKmdhbWUudXBzY2FsZVNpemU7Ly8gY2VudGVyIHRoZSBmcmFtZSBpbiB0aGUgbWlkZGxlIG9mIHRoZSBzY3JlZW5cclxuICAgICAgICB0aGlzLmZyYW1lLnkgPSBnYW1lLmhlaWdodC8yLTcyKmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgdGhpcy5mcmFtZS53ID0gMjU2KmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgdGhpcy5mcmFtZS5oID0gNjQqZ2FtZS51cHNjYWxlU2l6ZTtcclxuXHJcbiAgICAgICAgLy8gc2V0IHRoZSBwb3NpdGlvbnMgb2YgYWxsIHRoZSBidXR0b25zXHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaTwzOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLnggPSBnYW1lLndpZHRoLzItMTkyLzIqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLnkgPSBnYW1lLmhlaWdodC8yKzIwKmkqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLncgPSAxOTIqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLmggPSAxNipnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0udXBkYXRlTW91c2VPdmVyKGdhbWUubW91c2VYLCBnYW1lLm1vdXNlWSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgVWlTY3JlZW4gZnJvbSAnLi4vVWlTY3JlZW4nO1xyXG5pbXBvcnQgcDUgZnJvbSAncDUnO1xyXG5pbXBvcnQgVWlGcmFtZSBmcm9tICcuLi9VaUZyYW1lJztcclxuaW1wb3J0IGdhbWUgZnJvbSAnLi4vLi4vTWFpbic7XHJcbmltcG9ydCBCdXR0b24gZnJvbSAnLi4vQnV0dG9uJztcclxuaW1wb3J0IEZvbnRSZXNvdXJjZSBmcm9tICcuLi8uLi9hc3NldHMvcmVzb3VyY2VzL0ZvbnRSZXNvdXJjZSc7XHJcbmltcG9ydCB7IE9wdGlvbnNNZW51IH0gZnJvbSAnLi9PcHRpb25zTWVudSc7XHJcblxyXG5leHBvcnQgY2xhc3MgVmlkZW9TZXR0aW5nc01lbnUgZXh0ZW5kcyBVaVNjcmVlbiB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZm9udDogRm9udFJlc291cmNlKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICAvLyBtYWtlIHRoZSBmcmFtZSB3aXRoIHNvbWUgZGVmYXVsdCB2YWx1ZXMuICBUaGVzZSB3aWxsIGxhdGVyIGJlIGNoYW5nZWQgdG8gZml0IHRoZSBzY3JlZW4gc2l6ZS5cclxuICAgICAgICB0aGlzLmZyYW1lID0gbmV3IFVpRnJhbWUoMCwgMCwgMCwgMCk7XHJcblxyXG5cclxuICAgICAgICBpZihnYW1lLnNreU1vZCA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICBnYW1lLnNreU1vZCA9IDI7XHJcblxyXG4gICAgICAgIGlmKGdhbWUuc2t5VG9nZ2xlID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIGdhbWUuc2t5VG9nZ2xlID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgaWYoZ2FtZS5wYXJ0aWNsZU11bHRpcGxpZXIgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgZ2FtZS5wYXJ0aWNsZU11bHRpcGxpZXIgPSAxO1xyXG5cclxuICAgICAgICBsZXQgdGVtcFNreU1vZGVUZXh0O1xyXG5cclxuICAgICAgICBpZihnYW1lLnNreU1vZD09PTIpIHtcclxuICAgICAgICAgICAgdGVtcFNreU1vZGVUZXh0ID0gXCJIYWxmIEZyYW1lcmF0ZVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKGdhbWUuc2t5TW9kPT09MSkge1xyXG4gICAgICAgICAgICB0ZW1wU2t5TW9kZVRleHQgPSBcIkZ1bGwgRnJhbWVyYXRlXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0ZW1wU2t5TW9kZVRleHQgPSBcIlNvbGlkIENvbG9yXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgdGVtcFBhcnRpY2xlVGV4dDtcclxuXHJcbiAgICAgICAgaWYoZ2FtZS5wYXJ0aWNsZU11bHRpcGxpZXI9PT0yKSB7XHJcbiAgICAgICAgICAgIHRlbXBQYXJ0aWNsZVRleHQgPSBcIkRvdWJsZVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKGdhbWUucGFydGljbGVNdWx0aXBsaWVyPT09MSkge1xyXG4gICAgICAgICAgICB0ZW1wUGFydGljbGVUZXh0ID0gXCJOb3JtYWxcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRlbXBQYXJ0aWNsZVRleHQgPSBcIk1pbmltYWxcIjtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAvLyBtYWtlIHNvbWUgYnV0dG9ucyB3aXRoIGRlZmF1bHQgcG9zaXRpb25zXHJcbiAgICAgICAgdGhpcy5idXR0b25zID0gW1xyXG4gICAgICAgICAgICBuZXcgQnV0dG9uKGZvbnQsIGBTa3k6ICR7dGVtcFNreU1vZGVUZXh0fWAsIFwiQ2hhbmdlIHRoZSBhcHBlYXJhbmNlIG9mIHRoZSBza3kuXCIsIDAsIDAsIDAsIDAsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2t5IHRvZ2dsZVwiKTtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuYnV0dG9uc1swXS50eHQgPT09IFwiU2t5OiBIYWxmIEZyYW1lcmF0ZVwiKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1dHRvbnNbMF0udHh0ID0gXCJTa3k6IEZ1bGwgRnJhbWVyYXRlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS5za3lNb2QgPSAxO1xyXG4gICAgICAgICAgICAgICAgICAgIGdhbWUuc2t5VG9nZ2xlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYodGhpcy5idXR0b25zWzBdLnR4dCA9PT0gXCJTa3k6IEZ1bGwgRnJhbWVyYXRlXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1dHRvbnNbMF0udHh0ID0gXCJTa3k6IFNvbGlkIENvbG9yXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS5za3lUb2dnbGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnV0dG9uc1swXS50eHQgPSBcIlNreTogSGFsZiBGcmFtZXJhdGVcIjtcclxuICAgICAgICAgICAgICAgICAgICBnYW1lLnNreU1vZCA9IDI7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS5za3lUb2dnbGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgbmV3IEJ1dHRvbihmb250LCBgUGFydGljbGVzOiAke3RlbXBQYXJ0aWNsZVRleHR9YCwgXCJDaGFuZ2UgdGhlIGFtb3VudCBvZiBwYXJ0aWNsZXNcIiwgMCwgMCwgMCwgMCwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJwYXJ0aWNsZXNcIik7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLmJ1dHRvbnNbMV0udHh0ID09PSBcIlBhcnRpY2xlczogTm9ybWFsXCIpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnV0dG9uc1sxXS50eHQgPSBcIlBhcnRpY2xlczogRG91YmxlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS5wYXJ0aWNsZU11bHRpcGxpZXIgPSAyO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZih0aGlzLmJ1dHRvbnNbMV0udHh0ID09PSBcIlBhcnRpY2xlczogRG91YmxlXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1dHRvbnNbMV0udHh0ID0gXCJQYXJ0aWNsZXM6IE1pbmltYWxcIjtcclxuICAgICAgICAgICAgICAgICAgICBnYW1lLnBhcnRpY2xlTXVsdGlwbGllciA9IDAuNTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnV0dG9uc1sxXS50eHQgPSBcIlBhcnRpY2xlczogTm9ybWFsXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS5wYXJ0aWNsZU11bHRpcGxpZXIgPSAxO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgbmV3IEJ1dHRvbihmb250LCBcIkJhY2tcIiwgXCJSZXR1cm4gdG8gdGhlIG1haW4gbWVudS5cIiwgMCwgMCwgMCwgMCwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJtYWluIG1lbnVcIik7XHJcbiAgICAgICAgICAgICAgICBnYW1lLmN1cnJlbnRVaSA9IG5ldyBPcHRpb25zTWVudShmb250KTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICBdO1xyXG4gICAgICAgIC8vIHVwZGF0ZSB0aGUgc2l6ZSBvZiB0aGUgZWxlbWVudHMgYmFzZWQgb24gdGhlIGluaXRpYWwgc2NyZWVuIHNpemVcclxuICAgICAgICB0aGlzLndpbmRvd1VwZGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcih0YXJnZXQ6IHA1LCB1cHNjYWxlU2l6ZTogbnVtYmVyKTogdm9pZCB7XHJcblxyXG4gICAgICAgIC8vIHJlbmRlciB0aGUgcmVjdGFuZ3VsYXIgaW1hZ2VcclxuICAgICAgICB0aGlzLmZyYW1lLnJlbmRlcih0YXJnZXQsIHVwc2NhbGVTaXplKTtcclxuXHJcbiAgICAgICAgLy8gbG9vcCB0aHJvdWdoIHRoZSBidXR0b25zIGFycmF5IGFuZCByZW5kZXIgZWFjaCBvbmUuXHJcbiAgICAgICAgdGhpcy5idXR0b25zLmZvckVhY2goYnV0dG9uID0+IHtcclxuICAgICAgICAgICAgYnV0dG9uLnJlbmRlcih0YXJnZXQsIHVwc2NhbGVTaXplKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB3aW5kb3dVcGRhdGUoKSB7XHJcbiAgICAgICAgLy8gc2V0IHRoZSBwb3NpdGlvbiBvZiB0aGUgZnJhbWVcclxuICAgICAgICB0aGlzLmZyYW1lLnggPSBnYW1lLndpZHRoIC8gMiAtIDIwMCAvIDIgKiBnYW1lLnVwc2NhbGVTaXplOy8vIGNlbnRlciB0aGUgZnJhbWUgaW4gdGhlIGNlbnRlciBvZiB0aGUgc2NyZWVuXHJcbiAgICAgICAgdGhpcy5mcmFtZS55ID0gZ2FtZS5oZWlnaHQgLyAyIC0gNTYgKiBnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgIHRoaXMuZnJhbWUudyA9IDIwMCAqIGdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgdGhpcy5mcmFtZS5oID0gNDggKiBnYW1lLnVwc2NhbGVTaXplO1xyXG5cclxuICAgICAgICAvLyBzZXQgdGhlIHBvc2l0aW9ucyBvZiBhbGwgdGhlIGJ1dHRvbnNcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDM7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0ueCA9IGdhbWUud2lkdGggLyAyIC0gMTkyIC8gMiAqIGdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS55ID0gZ2FtZS5oZWlnaHQgLyAyICsgMjAgKiBpICogZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLncgPSAxOTIgKiBnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0uaCA9IDE2ICogZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLnVwZGF0ZU1vdXNlT3ZlcihnYW1lLm1vdXNlWCwgZ2FtZS5tb3VzZVkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgVWlTY3JlZW4gZnJvbSAnLi4vVWlTY3JlZW4nO1xyXG5pbXBvcnQgcDUgZnJvbSAncDUnO1xyXG5pbXBvcnQgVWlGcmFtZSBmcm9tICcuLi9VaUZyYW1lJztcclxuaW1wb3J0IGdhbWUgZnJvbSAnLi4vLi4vTWFpbic7XHJcbmltcG9ydCBCdXR0b24gZnJvbSAnLi4vQnV0dG9uJztcclxuaW1wb3J0IEZvbnRSZXNvdXJjZSBmcm9tICcuLi8uLi9hc3NldHMvcmVzb3VyY2VzL0ZvbnRSZXNvdXJjZSc7XHJcbmltcG9ydCB7IE1haW5NZW51IH0gZnJvbSAnLi9NYWluTWVudSc7XHJcbmltcG9ydCB7IFdvcmxkT3B0aW9uc01lbnUgfSBmcm9tICcuL1dvcmxkT3B0aW9uc01lbnUnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdvcmxkQ3JlYXRpb25NZW51IGV4dGVuZHMgVWlTY3JlZW4ge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGZvbnQ6IEZvbnRSZXNvdXJjZSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgLy8gbWFrZSB0aGUgZnJhbWUgd2l0aCBzb21lIGRlZmF1bHQgdmFsdWVzLiAgVGhlc2Ugd2lsbCBsYXRlciBiZSBjaGFuZ2VkIHRvIGZpdCB0aGUgc2NyZWVuIHNpemUuXHJcbiAgICAgICAgdGhpcy5mcmFtZSA9IG5ldyBVaUZyYW1lKDAsIDAsIDAsIDApO1xyXG4gICAgICAgIC8vIG1ha2Ugc29tZSBidXR0b25zIHdpdGggZGVmYXVsdCBwb3NpdGlvbnNcclxuICAgICAgICBpZiAoZ2FtZS5zZXJ2ZXJWaXNpYmlsaXR5ID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIGdhbWUuc2VydmVyVmlzaWJpbGl0eSA9IFwiUHVibGljXCI7XHJcblxyXG4gICAgICAgIHRoaXMuYnV0dG9ucyA9IFtcclxuICAgICAgICAgICAgbmV3IEJ1dHRvbihmb250LCBgU2VydmVyIFZpc2liaWxpdHk6ICR7Z2FtZS5zZXJ2ZXJWaXNpYmlsaXR5fWAsIFwiQ2hhbmdlIHRoZSB2aXNpYmlsaXR5IG9mIHRoZSBzZXJ2ZXJcIiwgMCwgMCwgMCwgMCwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYnV0dG9uc1swXS50eHQgPT09IFwiU2VydmVyIFZpc2liaWxpdHk6IFB1YmxpY1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS5zZXJ2ZXJWaXNpYmlsaXR5ID0gXCJVbmxpc3RlZFwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnV0dG9uc1swXS50eHQgPSBcIlNlcnZlciBWaXNpYmlsaXR5OiBVbmxpc3RlZFwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5idXR0b25zWzBdLnR4dCA9PT0gXCJTZXJ2ZXIgVmlzaWJpbGl0eTogVW5saXN0ZWRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIGdhbWUuc2VydmVyVmlzaWJpbGl0eSA9IFwiUHJpdmF0ZVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnV0dG9uc1swXS50eHQgPSBcIlNlcnZlciBWaXNpYmlsaXR5OiBQcml2YXRlXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBnYW1lLnNlcnZlclZpc2liaWxpdHkgPSBcIlB1YmxpY1wiO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnV0dG9uc1swXS50eHQgPSBcIlNlcnZlciBWaXNpYmlsaXR5OiBQdWJsaWNcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIG5ldyBCdXR0b24oZm9udCwgXCJXb3JsZCBPcHRpb25zXCIsIFwiQ2hhbmdlIGhvdyB5b3VyIHdvcmxkIGxvb2tzIGFuZCBnZW5lcmF0ZXMuXCIsIDAsIDAsIDAsIDAsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwid29ybGQgbWVudVwiKTtcclxuICAgICAgICAgICAgICAgIGdhbWUuY3VycmVudFVpID0gbmV3IFdvcmxkT3B0aW9uc01lbnUoZm9udCk7XHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBuZXcgQnV0dG9uKGZvbnQsIFwiQmFja1wiLCBcIlJldHVybiB0byB0aGUgbWFpbiBtZW51LlwiLCAwLCAwLCAwLCAwLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm1haW4gbWVudVwiKTtcclxuICAgICAgICAgICAgICAgIGdhbWUuY3VycmVudFVpID0gbmV3IE1haW5NZW51KGZvbnQpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIF07XHJcbiAgICAgICAgLy8gdXBkYXRlIHRoZSBzaXplIG9mIHRoZSBlbGVtZW50cyBiYXNlZCBvbiB0aGUgaW5pdGlhbCBzY3JlZW4gc2l6ZVxyXG4gICAgICAgIHRoaXMud2luZG93VXBkYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKHRhcmdldDogcDUsIHVwc2NhbGVTaXplOiBudW1iZXIpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgLy8gcmVuZGVyIHRoZSByZWN0YW5ndWxhciBpbWFnZSB0aGF0IHRoZSB3aG9sZSBtZW51IGlzIG9uXHJcbiAgICAgICAgdGhpcy5mcmFtZS5yZW5kZXIodGFyZ2V0LCB1cHNjYWxlU2l6ZSk7XHJcblxyXG4gICAgICAgIC8vIGxvb3AgdGhyb3VnaCB0aGUgYnV0dG9ucyBhcnJheSBhbmQgcmVuZGVyIGVhY2ggb25lLlxyXG4gICAgICAgIHRoaXMuYnV0dG9ucy5mb3JFYWNoKGJ1dHRvbiA9PiB7XHJcbiAgICAgICAgICAgIGJ1dHRvbi5yZW5kZXIodGFyZ2V0LCB1cHNjYWxlU2l6ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgd2luZG93VXBkYXRlKCkge1xyXG4gICAgICAgIC8vIHNldCB0aGUgcG9zaXRpb24gb2YgdGhlIGZyYW1lXHJcbiAgICAgICAgdGhpcy5mcmFtZS54ID0gZ2FtZS53aWR0aCAvIDIgLSAyMDAgLyAyICogZ2FtZS51cHNjYWxlU2l6ZTsvLyBjZW50ZXIgdGhlIGZyYW1lIGluIHRoZSBjZW50ZXIgb2YgdGhlIHNjcmVlblxyXG4gICAgICAgIHRoaXMuZnJhbWUueSA9IGdhbWUuaGVpZ2h0IC8gMiAtIDU2ICogZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICB0aGlzLmZyYW1lLncgPSAyMDAgKiBnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgIHRoaXMuZnJhbWUuaCA9IDQ4ICogZ2FtZS51cHNjYWxlU2l6ZTtcclxuXHJcbiAgICAgICAgLy8gc2V0IHRoZSBwb3NpdGlvbnMgb2YgYWxsIHRoZSBidXR0b25zXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAzOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLnggPSBnYW1lLndpZHRoIC8gMiAtIDE5MiAvIDIgKiBnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0ueSA9IGdhbWUuaGVpZ2h0IC8gMiArIDIwICogaSAqIGdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS53ID0gMTkyICogZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLmggPSAxNiAqIGdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS51cGRhdGVNb3VzZU92ZXIoZ2FtZS5tb3VzZVgsIGdhbWUubW91c2VZKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IFVpU2NyZWVuIGZyb20gJy4uL1VpU2NyZWVuJztcclxuaW1wb3J0IHA1IGZyb20gJ3A1JztcclxuaW1wb3J0IFVpRnJhbWUgZnJvbSAnLi4vVWlGcmFtZSc7XHJcbmltcG9ydCBnYW1lIGZyb20gJy4uLy4uL01haW4nO1xyXG5pbXBvcnQgQnV0dG9uIGZyb20gJy4uL0J1dHRvbic7XHJcbmltcG9ydCBGb250UmVzb3VyY2UgZnJvbSAnLi4vLi4vYXNzZXRzL3Jlc291cmNlcy9Gb250UmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBXb3JsZENyZWF0aW9uTWVudSB9IGZyb20gJy4vV29ybGRDcmVhdGlvbk1lbnUnO1xyXG5pbXBvcnQgU2xpZGVyIGZyb20gJy4uL1NsaWRlcic7XHJcblxyXG5leHBvcnQgY2xhc3MgV29ybGRPcHRpb25zTWVudSBleHRlbmRzIFVpU2NyZWVuIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihmb250OiBGb250UmVzb3VyY2UpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIC8vIG1ha2UgdGhlIGZyYW1lIHdpdGggc29tZSBkZWZhdWx0IHZhbHVlcy4gIFRoZXNlIHdpbGwgbGF0ZXIgYmUgY2hhbmdlZCB0byBmaXQgdGhlIHNjcmVlbiBzaXplLlxyXG4gICAgICAgIHRoaXMuZnJhbWUgPSBuZXcgVWlGcmFtZSgwLCAwLCAwLCAwKTtcclxuICAgICAgICAvLyBtYWtlIHNvbWUgYnV0dG9ucyB3aXRoIGRlZmF1bHQgcG9zaXRpb25zXHJcbiAgICAgICAgaWYoZ2FtZS53b3JsZEJ1bXBpbmVzcyA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICBnYW1lLndvcmxkQnVtcGluZXNzID0gMTtcclxuXHJcblxyXG4gICAgICAgIGxldCB0ZW1wV29ybGRCdW1waW5lc3NUZXh0O1xyXG5cclxuICAgICAgICBpZihnYW1lLndvcmxkQnVtcGluZXNzPT09MSkge1xyXG4gICAgICAgICAgICB0ZW1wV29ybGRCdW1waW5lc3NUZXh0ID0gXCJOb3JtYWxcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZihnYW1lLndvcmxkQnVtcGluZXNzPT09MCkge1xyXG4gICAgICAgICAgICB0ZW1wV29ybGRCdW1waW5lc3NUZXh0ID0gXCJTdXBlcmZsYXRcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRlbXBXb3JsZEJ1bXBpbmVzc1RleHQgPSBcIkFtcGxpZmllZFwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmJ1dHRvbnMgPSBbXHJcbiAgICAgICAgICAgIG5ldyBCdXR0b24oZm9udCwgYFdvcmxkIEJ1bXBpbmVzczogJHt0ZW1wV29ybGRCdW1waW5lc3NUZXh0fWAsIFwiQ2hhbmdlIHRoZSBpbnRlbnNpdHkgb2YgdGhlIHdvcmxkJ3MgYnVtcHMuXCIsIDAsIDAsIDAsIDAsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuYnV0dG9uc1swXS50eHQgPT09IFwiV29ybGQgQnVtcGluZXNzOiBOb3JtYWxcIil7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idXR0b25zWzBdLnR4dCA9IFwiV29ybGQgQnVtcGluZXNzOiBBbXBsaWZpZWRcIjtcclxuICAgICAgICAgICAgICAgICAgICBnYW1lLndvcmxkQnVtcGluZXNzID0gMztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYodGhpcy5idXR0b25zWzBdLnR4dCA9PT0gXCJXb3JsZCBCdW1waW5lc3M6IEFtcGxpZmllZFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idXR0b25zWzBdLnR4dCA9IFwiV29ybGQgQnVtcGluZXNzOiBTdXBlcmZsYXRcIjtcclxuICAgICAgICAgICAgICAgICAgICBnYW1lLndvcmxkQnVtcGluZXNzID0gMDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnV0dG9uc1swXS50eHQgPSBcIldvcmxkIEJ1bXBpbmVzczogTm9ybWFsXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS53b3JsZEJ1bXBpbmVzcyA9IDE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBuZXcgQnV0dG9uKGZvbnQsIFwiQmFja1wiLCBcIlJldHVybiB0byB0aGUgbWFpbiBtZW51LlwiLCAwLCAwLCAwLCAwLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm1haW4gbWVudVwiKTtcclxuICAgICAgICAgICAgICAgIGdhbWUuY3VycmVudFVpID0gbmV3IFdvcmxkQ3JlYXRpb25NZW51KGZvbnQpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIF07XHJcbiAgICAgICAgdGhpcy5zbGlkZXJzID0gW1xyXG4gICAgICAgICAgICBuZXcgU2xpZGVyKGZvbnQsIFwiV2lkdGhcIiwgNTEyLCA2NCwgMjA0OCwgNjQsIDAsIDAsIDAsIDAsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGdhbWUud29ybGRXaWR0aCA9IHRoaXMuc2xpZGVyc1swXS52YWx1ZTtcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIG5ldyBTbGlkZXIoZm9udCwgXCJIZWlnaHRcIiwgNjQsIDY0LCA1MTIsIDE2LCAwLCAwLCAwLCAwLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBnYW1lLndvcmxkSGVpZ2h0ID0gdGhpcy5zbGlkZXJzWzFdLnZhbHVlO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIF07XHJcbiAgICAgICAgLy8gdXBkYXRlIHRoZSBzaXplIG9mIHRoZSBlbGVtZW50cyBiYXNlZCBvbiB0aGUgaW5pdGlhbCBzY3JlZW4gc2l6ZVxyXG4gICAgICAgIHRoaXMud2luZG93VXBkYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKHRhcmdldDogcDUsIHVwc2NhbGVTaXplOiBudW1iZXIpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgLy8gcmVuZGVyIHRoZSByZWN0YW5ndWxhciBpbWFnZSB0aGF0IHRoZSB3aG9sZSBtZW51IGlzIG9uXHJcbiAgICAgICAgdGhpcy5mcmFtZS5yZW5kZXIodGFyZ2V0LCB1cHNjYWxlU2l6ZSk7XHJcblxyXG4gICAgICAgIC8vIGxvb3AgdGhyb3VnaCB0aGUgYnV0dG9ucyBhcnJheSBhbmQgcmVuZGVyIGVhY2ggb25lLlxyXG4gICAgICAgIHRoaXMuYnV0dG9ucy5mb3JFYWNoKGJ1dHRvbiA9PiB7XHJcbiAgICAgICAgICAgIGJ1dHRvbi5yZW5kZXIodGFyZ2V0LCB1cHNjYWxlU2l6ZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIGxvb3AgdGhyb3VnaCB0aGUgc2xpZGVycyBhcnJheSBhbmQgcmVuZGVyIGVhY2ggb25lLlxyXG4gICAgICAgIHRoaXMuc2xpZGVycy5mb3JFYWNoKHNsaWRlciA9PiB7XHJcbiAgICAgICAgICAgIHNsaWRlci5yZW5kZXIodGFyZ2V0LCB1cHNjYWxlU2l6ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgd2luZG93VXBkYXRlKCkge1xyXG4gICAgICAgIC8vIHNldCB0aGUgcG9zaXRpb24gb2YgdGhlIGZyYW1lXHJcbiAgICAgICAgdGhpcy5mcmFtZS54ID0gZ2FtZS53aWR0aC8yLTIwMC8yKmdhbWUudXBzY2FsZVNpemU7Ly8gY2VudGVyIHRoZSBmcmFtZSBpbiB0aGUgY2VudGVyIG9mIHRoZSBzY3JlZW5cclxuICAgICAgICB0aGlzLmZyYW1lLnkgPSBnYW1lLmhlaWdodC8yLTU2KmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgdGhpcy5mcmFtZS53ID0gMjAwKmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgdGhpcy5mcmFtZS5oID0gNDgqZ2FtZS51cHNjYWxlU2l6ZTtcclxuXHJcbiAgICAgICAgLy8gc2V0IHRoZSBwb3NpdGlvbnMgb2YgYWxsIHRoZSBidXR0b25zXHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaTwyOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLnggPSBnYW1lLndpZHRoLzItMTkyLzIqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLnkgPSBnYW1lLmhlaWdodC8yKzYwKmkqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLncgPSAxOTIqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLmggPSAxNipnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0udXBkYXRlTW91c2VPdmVyKGdhbWUubW91c2VYLCBnYW1lLm1vdXNlWSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBzZXQgdGhlIHBvc2l0aW9ucyBvZiBhbGwgdGhlIHNsaWRlcnNcclxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpPDI7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLnNsaWRlcnNbaV0ueCA9IGdhbWUud2lkdGgvMi0xOTIvMipnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLnNsaWRlcnNbaV0ueSA9IGdhbWUuaGVpZ2h0LzIrMjAqZ2FtZS51cHNjYWxlU2l6ZSsyMCppKmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuc2xpZGVyc1tpXS53ID0gMTkyKmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuc2xpZGVyc1tpXS5oID0gMTYqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgaWYoZ2FtZS5tb3VzZUlzUHJlc3NlZClcclxuICAgICAgICAgICAgICAgIHRoaXMuc2xpZGVyc1tpXS51cGRhdGVTbGlkZXJQb3NpdGlvbihnYW1lLm1vdXNlWCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCBHYW1lIGZyb20gJy4uL0dhbWUnO1xyXG5pbXBvcnQgV29ybGQgZnJvbSAnLi4vd29ybGQvV29ybGQnO1xyXG5pbXBvcnQgeyBFbnRpdHlDbGFzc2VzIH0gZnJvbSAnLi4vd29ybGQvZW50aXRpZXMvRW50aXR5Q2xhc3Nlcyc7XHJcbmltcG9ydCBQbGF5ZXJMb2NhbCBmcm9tICcuLi93b3JsZC9lbnRpdGllcy9QbGF5ZXJMb2NhbCc7XHJcblxyXG5leHBvcnQgY2xhc3MgTmV0TWFuYWdlciB7XHJcblxyXG4gICAgZ2FtZTogR2FtZVxyXG5cclxuICAgIHBsYXllclRpY2tSYXRlOiBudW1iZXJcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihnYW1lOiBHYW1lKSB7XHJcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZVxyXG5cclxuICAgICAgICAvLyBJbml0IGV2ZW50XHJcbiAgICAgICAgdGhpcy5nYW1lLmNvbm5lY3Rpb24ub24oJ2luaXQnLCAoIHBsYXllclRpY2tSYXRlLCB0b2tlbiApID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coYFRpY2sgcmF0ZSBzZXQgdG86ICR7cGxheWVyVGlja1JhdGV9YCk7XHJcbiAgICAgICAgICAgIHRoaXMucGxheWVyVGlja1JhdGUgPSBwbGF5ZXJUaWNrUmF0ZTtcclxuICAgICAgICAgICAgaWYgKHRva2VuKSB7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3Rva2VuJywgdG9rZW4pO1xyXG4gICAgICAgICAgICAgICAgKHRoaXMuZ2FtZS5jb25uZWN0aW9uLmF1dGggYXMgeyB0b2tlbjogc3RyaW5nIH0pLnRva2VuID0gdG9rZW47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gSW5pdGlhbGl6YXRpb24gZXZlbnRzXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvLyBMb2FkIHRoZSB3b3JsZCBhbmQgc2V0IHRoZSBwbGF5ZXIgZW50aXR5IGlkXHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5jb25uZWN0aW9uLm9uKFxyXG4gICAgICAgICAgICAgICAgJ3dvcmxkTG9hZCcsKHdpZHRoLCBoZWlnaHQsIHRpbGVzLCB0aWxlRW50aXRpZXMsIGVudGl0aWVzLCBwbGF5ZXIpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlbnRpdGllcylcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWUud29ybGQgPSBuZXcgV29ybGQoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbGVzLFxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nYW1lLndvcmxkLnBsYXllciA9IG5ldyBQbGF5ZXJMb2NhbChwbGF5ZXIpXHJcbiAgICAgICAgICAgICAgICAgICAgZW50aXRpZXMuZm9yRWFjaCgoZW50aXR5KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS53b3JsZC5lbnRpdGllc1tlbnRpdHkuaWRdID0gbmV3IEVudGl0eUNsYXNzZXNbZW50aXR5LnR5cGVdKGVudGl0eSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFdvcmxkIGV2ZW50c1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy8gVGlsZSB1cGRhdGVzIHN1Y2ggYXMgYnJlYWtpbmcgYW5kIHBsYWNpbmdcclxuICAgICAgICAgICAgdGhpcy5nYW1lLmNvbm5lY3Rpb24ub24oXHJcbiAgICAgICAgICAgICAgICAnd29ybGRVcGRhdGUnLFxyXG4gICAgICAgICAgICAgICAgKHVwZGF0ZWRUaWxlczogeyB0aWxlSW5kZXg6IG51bWJlcjsgdGlsZTogbnVtYmVyIH1bXSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIElmIHRoZSB3b3JsZCBpcyBub3Qgc2V0XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2FtZS53b3JsZCA9PT0gdW5kZWZpbmVkKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZWRUaWxlcy5mb3JFYWNoKCh0aWxlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS53b3JsZC51cGRhdGVUaWxlKHRpbGUudGlsZUluZGV4LCB0aWxlLnRpbGUpXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBQbGF5ZXIgZXZlbnRzXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvLyBVcGRhdGUgdGhlIHBsYXllclxyXG4gICAgICAgICAgICB0aGlzLmdhbWUuY29ubmVjdGlvbi5vbignc2V0UGxheWVyJywgKHgsIHksIHlWZWwsIHhWZWwpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIElmIHRoZSB3b3JsZCBpcyBub3Qgc2V0XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nYW1lLndvcmxkID09PSB1bmRlZmluZWQpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUud29ybGQucGxheWVyLnggPSB4O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLndvcmxkLnBsYXllci55ID0geTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS53b3JsZC5wbGF5ZXIueVZlbCA9IHlWZWw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUud29ybGQucGxheWVyLnhWZWwgPSB4VmVsO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5jb25uZWN0aW9uLm9uKCdlbnRpdHlVcGRhdGUnLCAoZW50aXR5RGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlIHdvcmxkIGlzIG5vdCBzZXRcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdhbWUud29ybGQgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGVudGl0eSA9IHRoaXMuZ2FtZS53b3JsZC5lbnRpdGllc1tlbnRpdHlEYXRhLmlkXVxyXG4gICAgICAgICAgICAgICAgaWYgKGVudGl0eSA9PT0gdW5kZWZpbmVkKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAgICAgZW50aXR5LnVwZGF0ZURhdGEoZW50aXR5RGF0YSlcclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5jb25uZWN0aW9uLm9uKCdlbnRpdHlDcmVhdGUnLCAoZW50aXR5RGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlIHdvcmxkIGlzIG5vdCBzZXRcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdhbWUud29ybGQgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS53b3JsZC5lbnRpdGllc1tlbnRpdHlEYXRhLmlkXSA9IG5ldyBFbnRpdHlDbGFzc2VzW2VudGl0eURhdGEudHlwZV0oZW50aXR5RGF0YSk7XHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICB0aGlzLmdhbWUuY29ubmVjdGlvbi5vbignZW50aXR5RGVsZXRlJywgKGlkKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyBJZiB0aGUgd29ybGQgaXMgbm90IHNldFxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2FtZS53b3JsZCA9PT0gdW5kZWZpbmVkKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuZ2FtZS53b3JsZC5lbnRpdGllc1tpZF1cclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIC8vIFVwZGF0ZSB0aGUgb3RoZXIgcGxheWVycyBpbiB0aGUgd29ybGRcclxuICAgICAgICAgICAgdGhpcy5nYW1lLmNvbm5lY3Rpb24ub24oXHJcbiAgICAgICAgICAgICAgICAnZW50aXR5U25hcHNob3QnLFxyXG4gICAgICAgICAgICAgICAgKHNuYXBzaG90OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWQ6IHN0cmluZztcclxuICAgICAgICAgICAgICAgICAgICB0aW1lOiBudW1iZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGU6IHsgaWQ6IHN0cmluZzsgeDogc3RyaW5nOyB5OiBzdHJpbmcgfVtdO1xyXG4gICAgICAgICAgICAgICAgfSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIElmIHRoZSB3b3JsZCBpcyBub3Qgc2V0XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2FtZS53b3JsZCA9PT0gdW5kZWZpbmVkKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS53b3JsZC51cGRhdGVQbGF5ZXJzKHNuYXBzaG90KVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgZ2FtZSBmcm9tICcuLi9NYWluJztcclxuaW1wb3J0IFA1IGZyb20gJ3A1JztcclxuaW1wb3J0IEltYWdlUmVzb3VyY2UgZnJvbSAnLi4vYXNzZXRzL3Jlc291cmNlcy9JbWFnZVJlc291cmNlJztcclxuaW1wb3J0IFRpbGVSZXNvdXJjZSBmcm9tICcuLi9hc3NldHMvcmVzb3VyY2VzL1RpbGVSZXNvdXJjZSc7XHJcbmltcG9ydCBUaWNrYWJsZSBmcm9tICcuLi9pbnRlcmZhY2VzL1RpY2thYmxlJztcclxuaW1wb3J0IFJlbmRlcmFibGUgZnJvbSAnLi4vaW50ZXJmYWNlcy9SZW5kZXJhYmxlJztcclxuaW1wb3J0IEdhbWUgZnJvbSAnLi4vR2FtZSc7XHJcbmltcG9ydCBQbGF5ZXJMb2NhbCBmcm9tICcuL2VudGl0aWVzL1BsYXllckxvY2FsJztcclxuaW1wb3J0IHsgU2VydmVyRW50aXR5IH0gZnJvbSAnLi9lbnRpdGllcy9TZXJ2ZXJFbnRpdHknO1xyXG5pbXBvcnQgeyBTbmFwc2hvdEludGVycG9sYXRpb24gfSBmcm9tICdAZ2Vja29zLmlvL3NuYXBzaG90LWludGVycG9sYXRpb24nO1xyXG5pbXBvcnQgeyBFbnRpdHksIFNuYXBzaG90IH0gZnJvbSAnQGdlY2tvcy5pby9zbmFwc2hvdC1pbnRlcnBvbGF0aW9uL2xpYi90eXBlcyc7XHJcbmltcG9ydCB7IFRpbGUsIFdvcmxkVGlsZXMgfSBmcm9tICcuL1dvcmxkVGlsZXMnO1xyXG5pbXBvcnQgeyBUaWxlVHlwZSB9IGZyb20gJy4uLy4uLy4uL2FwaS9UaWxlJztcclxuXHJcbmNsYXNzIFdvcmxkIGltcGxlbWVudHMgVGlja2FibGUsIFJlbmRlcmFibGUge1xyXG4gICAgd2lkdGg6IG51bWJlcjsgLy8gd2lkdGggb2YgdGhlIHdvcmxkIGluIHRpbGVzXHJcbiAgICBoZWlnaHQ6IG51bWJlcjsgLy8gaGVpZ2h0IG9mIHRoZSB3b3JsZCBpbiB0aWxlc1xyXG5cclxuICAgIHRpbGVMYXllcjogUDUuR3JhcGhpY3M7IC8vIFRpbGUgbGF5ZXIgZ3JhcGhpY1xyXG5cclxuXHJcbiAgICB3b3JsZFRpbGVzOiAoVGlsZVR5cGUpW107IC8vIG51bWJlciBmb3IgZWFjaCB0aWxlcyBpbiB0aGUgd29ybGQgZXg6IFsxLCAxLCAwLCAxLCAyLCAwLCAwLCAxLi4uICBdIG1lYW5zIHNub3csIHNub3csIGFpciwgc25vdywgaWNlLCBhaXIsIGFpciwgc25vdy4uLlxyXG5cclxuICAgIHBsYXllcjogUGxheWVyTG9jYWw7XHJcblxyXG4gICAgZW50aXRpZXM6IHsgW2lkOiBzdHJpbmddOiBTZXJ2ZXJFbnRpdHkgfSA9IHt9O1xyXG5cclxuICAgIHNuYXBzaG90SW50ZXJwb2xhdGlvbjogU25hcHNob3RJbnRlcnBvbGF0aW9uO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHdpZHRoOiBudW1iZXIsXHJcbiAgICAgICAgaGVpZ2h0OiBudW1iZXIsXHJcbiAgICAgICAgdGlsZXM6IChUaWxlVHlwZSlbXVxyXG4gICAgKSB7XHJcbiAgICAgICAgLy8gSW5pdGlhbGl6ZSB0aGUgd29ybGQgd2l0aCB0aGUgdGlsZXMgYW5kIGRpbWVuc2lvbnMgZnJvbSB0aGUgc2VydmVyXHJcbiAgICAgICAgdGhpcy53aWR0aCA9IHdpZHRoO1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG4gICAgICAgIHRoaXMud29ybGRUaWxlcyA9IHRpbGVzO1xyXG5cclxuICAgICAgICB0aGlzLnNuYXBzaG90SW50ZXJwb2xhdGlvbiA9IG5ldyBTbmFwc2hvdEludGVycG9sYXRpb24oKTtcclxuICAgICAgICB0aGlzLnNuYXBzaG90SW50ZXJwb2xhdGlvbi5pbnRlcnBvbGF0aW9uQnVmZmVyLnNldChcclxuICAgICAgICAgICAgKDEwMDAgLyBnYW1lLm5ldE1hbmFnZXIucGxheWVyVGlja1JhdGUpICogMlxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIC8vIGRlZmluZSB0aGUgcDUuR3JhcGhpY3Mgb2JqZWN0cyB0aGF0IGhvbGQgYW4gaW1hZ2Ugb2YgdGhlIHRpbGVzIG9mIHRoZSB3b3JsZC4gIFRoZXNlIGFjdCBzb3J0IG9mIGxpa2UgYSB2aXJ0dWFsIGNhbnZhcyBhbmQgY2FuIGJlIGRyYXduIG9uIGp1c3QgbGlrZSBhIG5vcm1hbCBjYW52YXMgYnkgdXNpbmcgdGlsZUxheWVyLnJlY3QoKTssIHRpbGVMYXllci5lbGxpcHNlKCk7LCB0aWxlTGF5ZXIuZmlsbCgpOywgZXRjLlxyXG4gICAgICAgIHRoaXMudGlsZUxheWVyID0gZ2FtZS5jcmVhdGVHcmFwaGljcyhcclxuICAgICAgICAgICAgdGhpcy53aWR0aCAqIGdhbWUuVElMRV9XSURUSCxcclxuICAgICAgICAgICAgdGhpcy5oZWlnaHQgKiBnYW1lLlRJTEVfSEVJR0hUXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgdGhpcy5sb2FkV29ybGQoKTtcclxuICAgIH1cclxuXHJcbiAgICB0aWNrKGdhbWU6IEdhbWUpIHtcclxuICAgICAgICBpZiAodGhpcy5wbGF5ZXIgIT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgZ2FtZS5jb25uZWN0aW9uLmVtaXQoJ3BsYXllclVwZGF0ZScsIHRoaXMucGxheWVyLngsIHRoaXMucGxheWVyLnkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcih0YXJnZXQ6IEdhbWUsIHVwc2NhbGVTaXplOiBudW1iZXIpIHtcclxuICAgICAgICAvLyBkcmF3IHRoZSB0aWxlcyBsYXllciBvbnRvIHRoZSBzY3JlZW5cclxuICAgICAgICB0YXJnZXQuaW1hZ2UoXHJcbiAgICAgICAgICAgIHRoaXMudGlsZUxheWVyLFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICAoZ2FtZS53aWR0aC91cHNjYWxlU2l6ZSkqdXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIChnYW1lLmhlaWdodC91cHNjYWxlU2l6ZSkqdXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIChnYW1lLmludGVycG9sYXRlZENhbVggKiBnYW1lLlRJTEVfV0lEVEgpLFxyXG4gICAgICAgICAgICAoZ2FtZS5pbnRlcnBvbGF0ZWRDYW1ZICogZ2FtZS5USUxFX1dJRFRIKSxcclxuICAgICAgICAgICAgKGdhbWUud2lkdGggLyB1cHNjYWxlU2l6ZSksXHJcbiAgICAgICAgICAgIChnYW1lLmhlaWdodCAvIHVwc2NhbGVTaXplKVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHRoaXMucmVuZGVyUGxheWVycyh0YXJnZXQsIHVwc2NhbGVTaXplKTtcclxuXHJcbiAgICAgICAgdGFyZ2V0LnN0cm9rZSgwKTtcclxuICAgICAgICB0YXJnZXQuc3Ryb2tlV2VpZ2h0KDQpO1xyXG4gICAgICAgIHRhcmdldC5ub0ZpbGwoKTtcclxuICAgICAgICB0YXJnZXQucmVjdCh0YXJnZXQud2lkdGgtdGhpcy53aWR0aCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xyXG5cclxuICAgICAgICB0YXJnZXQuaW1hZ2UoXHJcbiAgICAgICAgICAgIHRoaXMudGlsZUxheWVyLFxyXG4gICAgICAgICAgICB0YXJnZXQud2lkdGgtdGhpcy53aWR0aCxcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgdGhpcy53aWR0aCxcclxuICAgICAgICAgICAgdGhpcy5oZWlnaHRcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVBsYXllcnMoc25hcHNob3Q6IFNuYXBzaG90KSB7XHJcbiAgICAgICAgdGhpcy5zbmFwc2hvdEludGVycG9sYXRpb24uc25hcHNob3QuYWRkKHNuYXBzaG90KTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVUaWxlKHRpbGVJbmRleDogbnVtYmVyLCB0aWxlOiBUaWxlVHlwZSkge1xyXG4gICAgICAgIC8vIFVwZGF0ZSB0aGUgdGlsZSBhbmQgdGhlIDQgbmVpZ2hib3VyaW5nIHRpbGVzXHJcbiAgICAgICAgdGhpcy53b3JsZFRpbGVzW3RpbGVJbmRleF0gPSB0aWxlO1xyXG5cclxuICAgICAgICAvLyBlcmFzZSB0aGUgYnJva2VuIHRpbGVzIGFuZCBpdHMgc3Vycm91bmRpbmcgdGlsZXMgdXNpbmcgdHdvIGVyYXNpbmcgcmVjdGFuZ2xlcyBpbiBhICsgc2hhcGVcclxuICAgICAgICB0aGlzLnRpbGVMYXllci5lcmFzZSgpO1xyXG4gICAgICAgIHRoaXMudGlsZUxheWVyLm5vU3Ryb2tlKCk7XHJcbiAgICAgICAgdGhpcy50aWxlTGF5ZXIucmVjdChcclxuICAgICAgICAgICAgKCh0aWxlSW5kZXggJSB0aGlzLndpZHRoKSAtIDEpICogZ2FtZS5USUxFX1dJRFRILFxyXG4gICAgICAgICAgICBNYXRoLmZsb29yKHRpbGVJbmRleCAvIHRoaXMud2lkdGgpICogZ2FtZS5USUxFX0hFSUdIVCxcclxuICAgICAgICAgICAgZ2FtZS5USUxFX1dJRFRIICogMyxcclxuICAgICAgICAgICAgZ2FtZS5USUxFX0hFSUdIVFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgdGhpcy50aWxlTGF5ZXIucmVjdChcclxuICAgICAgICAgICAgKHRpbGVJbmRleCAlIHRoaXMud2lkdGgpICogZ2FtZS5USUxFX1dJRFRILFxyXG4gICAgICAgICAgICAoTWF0aC5mbG9vcih0aWxlSW5kZXggLyB0aGlzLndpZHRoKSAtIDEpICogZ2FtZS5USUxFX0hFSUdIVCxcclxuICAgICAgICAgICAgZ2FtZS5USUxFX1dJRFRILFxyXG4gICAgICAgICAgICBnYW1lLlRJTEVfSEVJR0hUICogM1xyXG4gICAgICAgICk7XHJcbiAgICAgICAgdGhpcy50aWxlTGF5ZXIubm9FcmFzZSgpO1xyXG5cclxuICAgICAgICAvLyByZWRyYXcgdGhlIG5laWdoYm9yaW5nIHRpbGVzXHJcbiAgICAgICAgdGhpcy5kcmF3VGlsZSh0aWxlSW5kZXgpO1xyXG4gICAgICAgIHRoaXMuZHJhd1RpbGUodGlsZUluZGV4ICsgdGhpcy53aWR0aCk7XHJcbiAgICAgICAgdGhpcy5kcmF3VGlsZSh0aWxlSW5kZXggLSAxKTtcclxuICAgICAgICB0aGlzLmRyYXdUaWxlKHRpbGVJbmRleCAtIHRoaXMud2lkdGgpO1xyXG4gICAgICAgIHRoaXMuZHJhd1RpbGUodGlsZUluZGV4ICsgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyUGxheWVycyh0YXJnZXQ6IEdhbWUsIHVwc2NhbGVTaXplOiBudW1iZXIpIHtcclxuICAgICAgICAvLyBDYWxjdWxhdGUgdGhlIGludGVycG9sYXRlZCBwb3NpdGlvbiBvZiBhbGwgdXBkYXRlZCBlbnRpdGllc1xyXG4gICAgICAgIGNvbnN0IHBvc2l0aW9uU3RhdGVzOiB7IFtpZDogc3RyaW5nXTogeyB4OiBudW1iZXI7IHk6IG51bWJlciB9IH0gPSB7fTtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCBjYWxjdWxhdGVkU25hcHNob3QgPVxyXG4gICAgICAgICAgICAgICAgdGhpcy5zbmFwc2hvdEludGVycG9sYXRpb24uY2FsY0ludGVycG9sYXRpb24oJ3ggeScpO1xyXG4gICAgICAgICAgICBpZiAoIWNhbGN1bGF0ZWRTbmFwc2hvdCkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgY29uc3Qgc3RhdGUgPSBjYWxjdWxhdGVkU25hcHNob3Quc3RhdGU7XHJcbiAgICAgICAgICAgIGlmICghc3RhdGUpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIC8vIFRoZSBuZXcgcG9zaXRpb25zIG9mIGVudGl0aWVzIGFzIG9iamVjdFxyXG4gICAgICAgICAgICBzdGF0ZS5mb3JFYWNoKCh7IGlkLCB4LCB5IH06IEVudGl0eSAmIHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcG9zaXRpb25TdGF0ZXNbaWRdID0geyB4LCB5IH07XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHt9XHJcblxyXG4gICAgICAgIC8vIFJlbmRlciBlYWNoIGVudGl0eSBpbiByYW5kb20gb3JkZXIgOnNrdWxsOlxyXG4gICAgICAgIE9iamVjdC5lbnRyaWVzKHRoaXMuZW50aXRpZXMpLmZvckVhY2goXHJcbiAgICAgICAgICAgIChlbnRpdHk6IFtzdHJpbmcsIFNlcnZlckVudGl0eV0pID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHVwZGF0ZWRQb3NpdGlvbiA9IHBvc2l0aW9uU3RhdGVzW2VudGl0eVswXV07XHJcbiAgICAgICAgICAgICAgICBpZiAodXBkYXRlZFBvc2l0aW9uICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBlbnRpdHlbMV0ueCA9IHVwZGF0ZWRQb3NpdGlvbi54O1xyXG4gICAgICAgICAgICAgICAgICAgIGVudGl0eVsxXS55ID0gdXBkYXRlZFBvc2l0aW9uLnk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZW50aXR5WzFdLnJlbmRlcih0YXJnZXQsIHVwc2NhbGVTaXplKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIC8vIFJlbmRlciB0aGUgcGxheWVyIG9uIHRvcCA6dGh1bWJzdXA6XHJcbiAgICAgICAgaWYgKHRoaXMucGxheWVyICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXIuZmluZEludGVycG9sYXRlZENvb3JkaW5hdGVzKCk7XHJcbiAgICAgICAgICAgIHRoaXMucGxheWVyLnJlbmRlcih0YXJnZXQsIHVwc2NhbGVTaXplKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZFdvcmxkKCkge1xyXG4gICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgdGhpcy5oZWlnaHQ7IHgrKykge1xyXG4gICAgICAgICAgICAvLyBpIHdpbGwgYmUgdGhlIHkgcG9zaXRpb24gb2YgdGlsZXMgYmVpbmcgZHJhd25cclxuICAgICAgICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCB0aGlzLndpZHRoOyB5KyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRpbGVWYWwgPSB0aGlzLndvcmxkVGlsZXNbeCAqIHRoaXMud2lkdGggKyB5XTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHRpbGVWYWwgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2codGlsZVZhbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRpbGVWYWwgIT09IFRpbGVUeXBlLkFpciAmJiB0aWxlVmFsICE9PSBUaWxlVHlwZS5UaWxlRW50aXR5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gRHJhdyB0aGUgY29ycmVjdCBpbWFnZSBmb3IgdGhlIHRpbGVzIG9udG8gdGhlIHRpbGVzIGxheWVyXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGlsZTogVGlsZSA9IFdvcmxkVGlsZXNbdGlsZVZhbF07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGlsZS5jb25uZWN0ZWQgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGlsZS50ZXh0dXJlIGluc3RhbmNlb2YgVGlsZVJlc291cmNlXHJcbiAgICAgICAgICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRlc3QgaWYgdGhlIG5laWdoYm9yaW5nIHRpbGVzIGFyZSBzb2xpZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0b3BUaWxlQm9vbCA9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4ID09PSBUaWxlVHlwZS5BaXIgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMud29ybGRUaWxlc1soeCAtIDEpICogdGhpcy53aWR0aCArIHldICE9PVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRpbGVUeXBlLkFpcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbGVmdFRpbGVCb29sID1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHkgPT09IFRpbGVUeXBlLkFpciB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy53b3JsZFRpbGVzW3ggKiB0aGlzLndpZHRoICsgeSAtIDFdICE9PVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRpbGVUeXBlLkFpcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYm90dG9tVGlsZUJvb2wgPVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeCA9PT0gdGhpcy5oZWlnaHQgLSAxIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLndvcmxkVGlsZXNbKHggKyAxKSAqIHRoaXMud2lkdGggKyB5XSAhPT1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUaWxlVHlwZS5BaXI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJpZ2h0VGlsZUJvb2wgPVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeSA9PT0gdGhpcy53aWR0aCAtIDEgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMud29ybGRUaWxlc1t4ICogdGhpcy53aWR0aCArIHkgKyAxXSAhPT1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUaWxlVHlwZS5BaXI7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb252ZXJ0IDQgZGlnaXQgYmluYXJ5IG51bWJlciB0byBiYXNlIDEwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRpbGVTZXRJbmRleCA9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA4ICogK3RvcFRpbGVCb29sICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDQgKiArcmlnaHRUaWxlQm9vbCArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAyICogK2JvdHRvbVRpbGVCb29sICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICtsZWZ0VGlsZUJvb2w7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBSZW5kZXIgY29ubmVjdGVkIHRpbGVzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbGUudGV4dHVyZS5yZW5kZXJUaWxlKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlsZVNldEluZGV4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50aWxlTGF5ZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB5ICogZ2FtZS5USUxFX1dJRFRILFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeCAqIGdhbWUuVElMRV9IRUlHSFQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnYW1lLlRJTEVfV0lEVEgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnYW1lLlRJTEVfSEVJR0hUXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgIXRpbGUuY29ubmVjdGVkICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbGUudGV4dHVyZSBpbnN0YW5jZW9mIEltYWdlUmVzb3VyY2VcclxuICAgICAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gUmVuZGVyIG5vbi1jb25uZWN0ZWQgdGlsZXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGlsZS50ZXh0dXJlLnJlbmRlcihcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGlsZUxheWVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeSAqIGdhbWUuVElMRV9XSURUSCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHggKiBnYW1lLlRJTEVfSEVJR0hULFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2FtZS5USUxFX1dJRFRILFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2FtZS5USUxFX0hFSUdIVFxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBkcmF3VGlsZSh0aWxlSW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IHggPSB0aWxlSW5kZXggJSB0aGlzLndpZHRoO1xyXG4gICAgICAgIGNvbnN0IHkgPSBNYXRoLmZsb29yKHRpbGVJbmRleCAvIHRoaXMud2lkdGgpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy53b3JsZFRpbGVzW3RpbGVJbmRleF0gIT09IFRpbGVUeXBlLkFpcikge1xyXG4gICAgICAgICAgICAvLyBEcmF3IHRoZSBjb3JyZWN0IGltYWdlIGZvciB0aGUgdGlsZXMgb250byB0aGUgdGlsZXMgbGF5ZXJcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHRpbGVWYWwgPSB0aGlzLndvcmxkVGlsZXNbdGlsZUluZGV4XVxyXG5cclxuICAgICAgICAgICAgaWYodHlwZW9mIHRpbGVWYWwgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlRyaWVkIHRvIGRyYXc6IFwiICsgdGlsZVZhbClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgdGlsZTogVGlsZSA9IFdvcmxkVGlsZXNbdGlsZVZhbF07XHJcblxyXG4gICAgICAgICAgICAvLyBpZiB0aGUgdGlsZXMgaXMgb2ZmLXNjcmVlblxyXG4gICAgICAgICAgICBpZiAodGlsZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aWxlLmNvbm5lY3RlZCAmJiB0aWxlLnRleHR1cmUgaW5zdGFuY2VvZiBUaWxlUmVzb3VyY2UpIHtcclxuICAgICAgICAgICAgICAgIC8vIFRlc3QgdGhlIG5laWdoYm9yaW5nIDQgdGlsZXNcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRvcFRpbGVCb29sID1cclxuICAgICAgICAgICAgICAgICAgICB5IDw9IDAgfHxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLndvcmxkVGlsZXNbdGlsZUluZGV4IC0gdGhpcy53aWR0aF0gIT09IFRpbGVUeXBlLkFpcjtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGxlZnRUaWxlQm9vbCA9XHJcbiAgICAgICAgICAgICAgICAgICAgeCA8PSAwIHx8IHRoaXMud29ybGRUaWxlc1t0aWxlSW5kZXggLSAxXSAhPT0gVGlsZVR5cGUuQWlyO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYm90dG9tVGlsZUJvb2wgPVxyXG4gICAgICAgICAgICAgICAgICAgIHkgPj0gdGhpcy5oZWlnaHQgLSAxIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53b3JsZFRpbGVzW3RpbGVJbmRleCArIHRoaXMud2lkdGhdICE9PSBUaWxlVHlwZS5BaXI7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByaWdodFRpbGVCb29sID1cclxuICAgICAgICAgICAgICAgICAgICB4ID49IHRoaXMud2lkdGggLSAxIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53b3JsZFRpbGVzW3RpbGVJbmRleCArIDFdICE9PSBUaWxlVHlwZS5BaXI7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gY29udmVydCA0IGRpZ2l0IGJpbmFyeSBudW1iZXIgdG8gYmFzZSAxMFxyXG4gICAgICAgICAgICAgICAgY29uc3QgdGlsZVNldEluZGV4ID1cclxuICAgICAgICAgICAgICAgICAgICA4ICogK3RvcFRpbGVCb29sICtcclxuICAgICAgICAgICAgICAgICAgICA0ICogK3JpZ2h0VGlsZUJvb2wgK1xyXG4gICAgICAgICAgICAgICAgICAgIDIgKiArYm90dG9tVGlsZUJvb2wgK1xyXG4gICAgICAgICAgICAgICAgICAgICtsZWZ0VGlsZUJvb2w7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gUmVuZGVyIGNvbm5lY3RlZCB0aWxlc1xyXG4gICAgICAgICAgICAgICAgdGlsZS50ZXh0dXJlLnJlbmRlclRpbGUoXHJcbiAgICAgICAgICAgICAgICAgICAgdGlsZVNldEluZGV4LFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGlsZUxheWVyLFxyXG4gICAgICAgICAgICAgICAgICAgIHggKiBnYW1lLlRJTEVfV0lEVEgsXHJcbiAgICAgICAgICAgICAgICAgICAgeSAqIGdhbWUuVElMRV9IRUlHSFQsXHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS5USUxFX1dJRFRILFxyXG4gICAgICAgICAgICAgICAgICAgIGdhbWUuVElMRV9IRUlHSFRcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoXHJcbiAgICAgICAgICAgICAgICAhdGlsZS5jb25uZWN0ZWQgJiZcclxuICAgICAgICAgICAgICAgIHRpbGUudGV4dHVyZSBpbnN0YW5jZW9mIEltYWdlUmVzb3VyY2VcclxuICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBSZW5kZXIgbm9uLWNvbm5lY3RlZCB0aWxlc1xyXG4gICAgICAgICAgICAgICAgdGlsZS50ZXh0dXJlLnJlbmRlcihcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRpbGVMYXllcixcclxuICAgICAgICAgICAgICAgICAgICB4ICogZ2FtZS5USUxFX1dJRFRILFxyXG4gICAgICAgICAgICAgICAgICAgIHkgKiBnYW1lLlRJTEVfSEVJR0hULFxyXG4gICAgICAgICAgICAgICAgICAgIGdhbWUuVElMRV9XSURUSCxcclxuICAgICAgICAgICAgICAgICAgICBnYW1lLlRJTEVfSEVJR0hUXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmV4cG9ydCA9IFdvcmxkO1xyXG4iLCJpbXBvcnQgSW1hZ2VSZXNvdXJjZSBmcm9tICcuLi9hc3NldHMvcmVzb3VyY2VzL0ltYWdlUmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBXb3JsZEFzc2V0cyB9IGZyb20gJy4uL2Fzc2V0cy9Bc3NldHMnO1xyXG5pbXBvcnQgVGlsZVJlc291cmNlIGZyb20gJy4uL2Fzc2V0cy9yZXNvdXJjZXMvVGlsZVJlc291cmNlJztcclxuaW1wb3J0IHsgVGlsZVR5cGUgfSBmcm9tICcuLi8uLi8uLi9hcGkvVGlsZSc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFRpbGUge1xyXG4gICAgbmFtZTogc3RyaW5nO1xyXG4gICAgdGV4dHVyZTogSW1hZ2VSZXNvdXJjZSB8IFRpbGVSZXNvdXJjZTtcclxuICAgIGNvbm5lY3RlZD86IGJvb2xlYW47XHJcbiAgICBhbnlDb25uZWN0aW9uPzogYm9vbGVhbjtcclxuICAgIGNvbG9yOiBzdHJpbmc7XHJcbiAgICBmcmljdGlvbjogbnVtYmVyO1xyXG4gICAgcmVmbGVjdGl2aXR5OiBudW1iZXI7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBXb3JsZFRpbGVzOiBSZWNvcmQ8VGlsZVR5cGUsIFRpbGUgfCB1bmRlZmluZWQ+ID0ge1xyXG4gICAgW1RpbGVUeXBlLkFpcl06IHVuZGVmaW5lZCxcclxuICAgIFtUaWxlVHlwZS5UaWxlRW50aXR5XToge1xyXG4gICAgICAgIG5hbWU6ICdUaWxlRW50aXR5JyxcclxuICAgICAgICB0ZXh0dXJlOiB1bmRlZmluZWQsXHJcbiAgICAgICAgY29sb3I6IFwiI2JiYmJiYlwiLFxyXG4gICAgICAgIGZyaWN0aW9uOiAxLFxyXG4gICAgICAgIHJlZmxlY3Rpdml0eTogMFxyXG4gICAgfSxcclxuICAgIFtUaWxlVHlwZS5Tbm93XToge1xyXG4gICAgICAgIG5hbWU6ICdzbm93JyxcclxuICAgICAgICB0ZXh0dXJlOiBXb3JsZEFzc2V0cy5taWRkbGVncm91bmQudGlsZXNldF9zbm93LFxyXG4gICAgICAgIGNvbm5lY3RlZDogdHJ1ZSxcclxuICAgICAgICBhbnlDb25uZWN0aW9uOiB0cnVlLFxyXG4gICAgICAgIGNvbG9yOiBcIiNjYWZhZmNcIixcclxuICAgICAgICBmcmljdGlvbjogMixcclxuICAgICAgICByZWZsZWN0aXZpdHk6IDUwXHJcbiAgICB9LFxyXG4gICAgW1RpbGVUeXBlLkljZV06IHtcclxuICAgICAgICBuYW1lOiAnaWNlJyxcclxuICAgICAgICB0ZXh0dXJlOiBXb3JsZEFzc2V0cy5taWRkbGVncm91bmQudGlsZXNldF9pY2UsXHJcbiAgICAgICAgY29ubmVjdGVkOiB0cnVlLFxyXG4gICAgICAgIGFueUNvbm5lY3Rpb246IHRydWUsXHJcbiAgICAgICAgY29sb3I6IFwiIzc2YWRjNFwiLFxyXG4gICAgICAgIGZyaWN0aW9uOiAxLjUsXHJcbiAgICAgICAgcmVmbGVjdGl2aXR5OiAyNTVcclxuICAgIH0sXHJcbiAgICBbVGlsZVR5cGUuRGlydF06IHtcclxuICAgICAgICBuYW1lOiAnZGlydCcsXHJcbiAgICAgICAgdGV4dHVyZTogV29ybGRBc3NldHMubWlkZGxlZ3JvdW5kLnRpbGVzZXRfZGlydCxcclxuICAgICAgICBjb25uZWN0ZWQ6IHRydWUsXHJcbiAgICAgICAgYW55Q29ubmVjdGlvbjogdHJ1ZSxcclxuICAgICAgICBjb2xvcjogXCIjNGEyZTFlXCIsXHJcbiAgICAgICAgZnJpY3Rpb246IDQsXHJcbiAgICAgICAgcmVmbGVjdGl2aXR5OiAwXHJcbiAgICB9LFxyXG4gICAgW1RpbGVUeXBlLlN0b25lMF06IHtcclxuICAgICAgICBuYW1lOiAncmF3IHN0b25lJyxcclxuICAgICAgICB0ZXh0dXJlOiBXb3JsZEFzc2V0cy5taWRkbGVncm91bmQudGlsZXNldF9zdG9uZTAsXHJcbiAgICAgICAgY29ubmVjdGVkOiB0cnVlLFxyXG4gICAgICAgIGFueUNvbm5lY3Rpb246IHRydWUsXHJcbiAgICAgICAgY29sb3I6IFwiIzQxNDI0NVwiLFxyXG4gICAgICAgIGZyaWN0aW9uOiAzLFxyXG4gICAgICAgIHJlZmxlY3Rpdml0eTogMTBcclxuICAgIH0sXHJcbiAgICBbVGlsZVR5cGUuU3RvbmUxXToge1xyXG4gICAgICAgIG5hbWU6ICdzdG9uZSB0aWVyIDEnLFxyXG4gICAgICAgIHRleHR1cmU6IFdvcmxkQXNzZXRzLm1pZGRsZWdyb3VuZC50aWxlc2V0X3N0b25lMSxcclxuICAgICAgICBjb25uZWN0ZWQ6IHRydWUsXHJcbiAgICAgICAgYW55Q29ubmVjdGlvbjogdHJ1ZSxcclxuICAgICAgICBjb2xvcjogXCIjMzEzMjNiXCIsXHJcbiAgICAgICAgZnJpY3Rpb246IDMsXHJcbiAgICAgICAgcmVmbGVjdGl2aXR5OiAxNVxyXG4gICAgfSxcclxuICAgIFtUaWxlVHlwZS5TdG9uZTJdOiB7XHJcbiAgICAgICAgbmFtZTogJ3N0b25lIHRpZXIgMicsXHJcbiAgICAgICAgdGV4dHVyZTogV29ybGRBc3NldHMubWlkZGxlZ3JvdW5kLnRpbGVzZXRfc3RvbmUyLFxyXG4gICAgICAgIGNvbm5lY3RlZDogdHJ1ZSxcclxuICAgICAgICBhbnlDb25uZWN0aW9uOiB0cnVlLFxyXG4gICAgICAgIGNvbG9yOiBcIiMzMTMyM2JcIiwvL1RPRE8gY2hhbmdlIHRoZXNlIGNvbG9ycyB0byBiZSBtb3JlIGFjY3VyYXRlXHJcbiAgICAgICAgZnJpY3Rpb246IDMsXHJcbiAgICAgICAgcmVmbGVjdGl2aXR5OiAxN1xyXG4gICAgfSxcclxuICAgIFtUaWxlVHlwZS5TdG9uZTNdOiB7XHJcbiAgICAgICAgbmFtZTogJ3N0b25lIHRpZXIgMycsXHJcbiAgICAgICAgdGV4dHVyZTogV29ybGRBc3NldHMubWlkZGxlZ3JvdW5kLnRpbGVzZXRfc3RvbmUzLFxyXG4gICAgICAgIGNvbm5lY3RlZDogdHJ1ZSxcclxuICAgICAgICBhbnlDb25uZWN0aW9uOiB0cnVlLFxyXG4gICAgICAgIGNvbG9yOiBcIiMzMTMyM2JcIixcclxuICAgICAgICBmcmljdGlvbjogMyxcclxuICAgICAgICByZWZsZWN0aXZpdHk6IDE5XHJcbiAgICB9LFxyXG4gICAgW1RpbGVUeXBlLlN0b25lNF06IHtcclxuICAgICAgICBuYW1lOiAnc3RvbmUgdGllciA0JyxcclxuICAgICAgICB0ZXh0dXJlOiBXb3JsZEFzc2V0cy5taWRkbGVncm91bmQudGlsZXNldF9zdG9uZTQsXHJcbiAgICAgICAgY29ubmVjdGVkOiB0cnVlLFxyXG4gICAgICAgIGFueUNvbm5lY3Rpb246IHRydWUsXHJcbiAgICAgICAgY29sb3I6IFwiIzMxMzIzYlwiLFxyXG4gICAgICAgIGZyaWN0aW9uOiAzLFxyXG4gICAgICAgIHJlZmxlY3Rpdml0eTogMjFcclxuICAgIH0sXHJcbiAgICBbVGlsZVR5cGUuU3RvbmU1XToge1xyXG4gICAgICAgIG5hbWU6ICdzdG9uZSB0aWVyIDUnLFxyXG4gICAgICAgIHRleHR1cmU6IFdvcmxkQXNzZXRzLm1pZGRsZWdyb3VuZC50aWxlc2V0X3N0b25lNSxcclxuICAgICAgICBjb25uZWN0ZWQ6IHRydWUsXHJcbiAgICAgICAgYW55Q29ubmVjdGlvbjogdHJ1ZSxcclxuICAgICAgICBjb2xvcjogXCIjMzEzMjNiXCIsXHJcbiAgICAgICAgZnJpY3Rpb246IDMsXHJcbiAgICAgICAgcmVmbGVjdGl2aXR5OiAyM1xyXG4gICAgfSxcclxuICAgIFtUaWxlVHlwZS5TdG9uZTZdOiB7XHJcbiAgICAgICAgbmFtZTogJ3N0b25lIHRpZXIgNicsXHJcbiAgICAgICAgdGV4dHVyZTogV29ybGRBc3NldHMubWlkZGxlZ3JvdW5kLnRpbGVzZXRfc3RvbmU2LFxyXG4gICAgICAgIGNvbm5lY3RlZDogdHJ1ZSxcclxuICAgICAgICBhbnlDb25uZWN0aW9uOiB0cnVlLFxyXG4gICAgICAgIGNvbG9yOiBcIiMzMTMyM2JcIixcclxuICAgICAgICBmcmljdGlvbjogMyxcclxuICAgICAgICByZWZsZWN0aXZpdHk6IDI1XHJcbiAgICB9LFxyXG4gICAgW1RpbGVUeXBlLlN0b25lN106IHtcclxuICAgICAgICBuYW1lOiAnc3RvbmUgdGllciA3JyxcclxuICAgICAgICB0ZXh0dXJlOiBXb3JsZEFzc2V0cy5taWRkbGVncm91bmQudGlsZXNldF9zdG9uZTcsXHJcbiAgICAgICAgY29ubmVjdGVkOiB0cnVlLFxyXG4gICAgICAgIGFueUNvbm5lY3Rpb246IHRydWUsXHJcbiAgICAgICAgY29sb3I6IFwiIzMxMzIzYlwiLFxyXG4gICAgICAgIGZyaWN0aW9uOiAzLFxyXG4gICAgICAgIHJlZmxlY3Rpdml0eTogMjdcclxuICAgIH0sXHJcbiAgICBbVGlsZVR5cGUuU3RvbmU4XToge1xyXG4gICAgICAgIG5hbWU6ICdzdG9uZSB0aWVyIDgnLFxyXG4gICAgICAgIHRleHR1cmU6IFdvcmxkQXNzZXRzLm1pZGRsZWdyb3VuZC50aWxlc2V0X3N0b25lOCxcclxuICAgICAgICBjb25uZWN0ZWQ6IHRydWUsXHJcbiAgICAgICAgYW55Q29ubmVjdGlvbjogdHJ1ZSxcclxuICAgICAgICBjb2xvcjogXCIjMzEzMjNiXCIsXHJcbiAgICAgICAgZnJpY3Rpb246IDMsXHJcbiAgICAgICAgcmVmbGVjdGl2aXR5OiAyOVxyXG4gICAgfSxcclxuICAgIFtUaWxlVHlwZS5TdG9uZTldOiB7XHJcbiAgICAgICAgbmFtZTogJ3N0b25lIHRpZXIgOScsXHJcbiAgICAgICAgdGV4dHVyZTogV29ybGRBc3NldHMubWlkZGxlZ3JvdW5kLnRpbGVzZXRfc3RvbmU5LFxyXG4gICAgICAgIGNvbm5lY3RlZDogdHJ1ZSxcclxuICAgICAgICBhbnlDb25uZWN0aW9uOiB0cnVlLFxyXG4gICAgICAgIGNvbG9yOiBcIiMzMTMyM2JcIixcclxuICAgICAgICBmcmljdGlvbjogMyxcclxuICAgICAgICByZWZsZWN0aXZpdHk6IDMxXHJcbiAgICB9LFxyXG59OyIsImltcG9ydCB7IEVudGl0aWVzIH0gZnJvbSAnLi4vLi4vLi4vLi4vYXBpL0VudGl0eSc7XHJcbmltcG9ydCB7IFBsYXllckVudGl0eSB9IGZyb20gJy4vUGxheWVyRW50aXR5JztcclxuaW1wb3J0IFBsYXllckxvY2FsIGZyb20gJy4vUGxheWVyTG9jYWwnO1xyXG5cclxuZXhwb3J0IGNvbnN0IEVudGl0eUNsYXNzZXM6IFJlY29yZDxFbnRpdGllcywgYW55PiA9IHtcclxuICAgIFtFbnRpdGllcy5Mb2NhbFBsYXllcl06IFBsYXllckxvY2FsLFxyXG4gICAgW0VudGl0aWVzLlBsYXllcl06IFBsYXllckVudGl0eSxcclxuICAgIFtFbnRpdGllcy5JdGVtXTogbnVsbFxyXG59IiwiaW1wb3J0IHsgU2VydmVyRW50aXR5IH0gZnJvbSAnLi9TZXJ2ZXJFbnRpdHknO1xyXG5pbXBvcnQgcDUgZnJvbSAncDUnO1xyXG5pbXBvcnQgZ2FtZSBmcm9tICcuLi8uLi9NYWluJztcclxuaW1wb3J0IHsgRW50aXRpZXMsIEVudGl0eVBheWxvYWQgfSBmcm9tICcuLi8uLi8uLi8uLi9hcGkvRW50aXR5JztcclxuXHJcbmV4cG9ydCBjbGFzcyBQbGF5ZXJFbnRpdHkgZXh0ZW5kcyBTZXJ2ZXJFbnRpdHkge1xyXG5cclxuICAgIHdpZHRoOiBudW1iZXIgPSAxMiAvIGdhbWUuVElMRV9XSURUSDtcclxuICAgIGhlaWdodDogbnVtYmVyID0gMjAgLyBnYW1lLlRJTEVfSEVJR0hUO1xyXG4gICAgbmFtZTogc3RyaW5nXHJcblxyXG4gICAgY29uc3RydWN0b3IoZGF0YTogRW50aXR5UGF5bG9hZCkge1xyXG4gICAgICAgIHN1cGVyKGRhdGEuaWQpO1xyXG4gICAgICAgIGlmKGRhdGEudHlwZSA9PT0gRW50aXRpZXMuUGxheWVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMubmFtZSA9IGRhdGEuZGF0YS5uYW1lO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVEYXRhKGRhdGE6IEVudGl0eVBheWxvYWQpOiB2b2lkIHtcclxuICAgICAgICBpZihkYXRhLnR5cGUgPT09IEVudGl0aWVzLlBsYXllcikge1xyXG4gICAgICAgICAgICB0aGlzLm5hbWUgPSBkYXRhLmRhdGEubmFtZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKHRhcmdldDogcDUsIHVwc2NhbGVTaXplOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0YXJnZXQuZmlsbCgwLCAyNTUsIDApO1xyXG5cclxuICAgICAgICB0YXJnZXQucmVjdChcclxuICAgICAgICAgICAgKHRoaXMueCAqIGdhbWUuVElMRV9XSURUSCAtXHJcbiAgICAgICAgICAgICAgICBnYW1lLmludGVycG9sYXRlZENhbVggKiBnYW1lLlRJTEVfV0lEVEgpICpcclxuICAgICAgICAgICAgdXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgICh0aGlzLnkgKiBnYW1lLlRJTEVfSEVJR0hUIC1cclxuICAgICAgICAgICAgICAgIGdhbWUuaW50ZXJwb2xhdGVkQ2FtWSAqIGdhbWUuVElMRV9IRUlHSFQpICpcclxuICAgICAgICAgICAgdXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIHRoaXMud2lkdGggKiB1cHNjYWxlU2l6ZSAqIGdhbWUuVElMRV9XSURUSCxcclxuICAgICAgICAgICAgdGhpcy5oZWlnaHQgKiB1cHNjYWxlU2l6ZSAqIGdhbWUuVElMRV9IRUlHSFRcclxuICAgICAgICApO1xyXG4gICAgICAgIC8vIFJlbmRlciB0aGUgaXRlbSBxdWFudGl0eSBsYWJlbFxyXG4gICAgICAgIHRhcmdldC5maWxsKDApO1xyXG5cclxuICAgICAgICB0YXJnZXQubm9TdHJva2UoKTtcclxuXHJcbiAgICAgICAgdGFyZ2V0LnRleHRTaXplKDUgKiB1cHNjYWxlU2l6ZSk7XHJcbiAgICAgICAgdGFyZ2V0LnRleHRBbGlnbih0YXJnZXQuQ0VOVEVSLCB0YXJnZXQuVE9QKTtcclxuXHJcbiAgICAgICAgdGFyZ2V0LnRleHQoXHJcbiAgICAgICAgICAgIHRoaXMubmFtZSxcclxuICAgICAgICAgICAgKCgodGhpcy54ICogZ2FtZS5USUxFX1dJRFRIKSAtXHJcbiAgICAgICAgICAgICAgICBnYW1lLmludGVycG9sYXRlZENhbVggKiBnYW1lLlRJTEVfV0lEVEgpICsgKHRoaXMud2lkdGggKiBnYW1lLlRJTEVfV0lEVEgpIC8gMikgKlxyXG4gICAgICAgICAgICB1cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgKCgodGhpcy55ICogZ2FtZS5USUxFX0hFSUdIVCkgLVxyXG4gICAgICAgICAgICAgICAgZ2FtZS5pbnRlcnBvbGF0ZWRDYW1ZICogZ2FtZS5USUxFX0hFSUdIVCkgLSAodGhpcy5oZWlnaHQgKiBnYW1lLlRJTEVfV0lEVEgpIC8gMi41KSAqXHJcbiAgICAgICAgICAgIHVwc2NhbGVTaXplXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufSIsImltcG9ydCBnYW1lIGZyb20gJy4uLy4uL01haW4nO1xyXG5pbXBvcnQgeyBTZXJ2ZXJFbnRpdHkgfSBmcm9tICcuL1NlcnZlckVudGl0eSc7XHJcbmltcG9ydCB7IEVudGl0aWVzLCBFbnRpdHlQYXlsb2FkIH0gZnJvbSAnLi4vLi4vLi4vLi4vYXBpL0VudGl0eSc7XHJcbmltcG9ydCB7IENvbG9yUGFydGljbGUgfSBmcm9tICcuLi9wYXJ0aWNsZXMvQ29sb3JQYXJ0aWNsZSdcclxuaW1wb3J0IHsgUGxheWVyQW5pbWF0aW9ucywgVWlBc3NldHMsIEFuaW1hdGlvbkZyYW1lIH0gZnJvbSAnLi4vLi4vYXNzZXRzL0Fzc2V0cyc7XHJcbmltcG9ydCB7IFRpbGVUeXBlIH0gZnJvbSAnLi4vLi4vLi4vLi4vYXBpL1RpbGUnO1xyXG5pbXBvcnQgeyBXb3JsZFRpbGVzIH0gZnJvbSAnLi4vV29ybGRUaWxlcyc7XHJcbmltcG9ydCBHYW1lIGZyb20gJy4uLy4uL0dhbWUnO1xyXG5cclxuY2xhc3MgUGxheWVyTG9jYWwgZXh0ZW5kcyBTZXJ2ZXJFbnRpdHkge1xyXG5cclxuICAgIHdpZHRoOiBudW1iZXIgPSAxMiAvIGdhbWUuVElMRV9XSURUSDtcclxuICAgIGhlaWdodDogbnVtYmVyID0gMjAgLyBnYW1lLlRJTEVfSEVJR0hUO1xyXG4gICAgbmFtZTogc3RyaW5nXHJcblxyXG4gICAgeFZlbDogbnVtYmVyID0gMFxyXG4gICAgeVZlbDogbnVtYmVyID0gMFxyXG4gICAgaW50ZXJwb2xhdGVkWDogbnVtYmVyO1xyXG4gICAgaW50ZXJwb2xhdGVkWTogbnVtYmVyO1xyXG4gICAgc2xpZGVYOiBudW1iZXI7XHJcbiAgICBzbGlkZVk6IG51bWJlcjtcclxuXHJcbiAgICBwWDogbnVtYmVyO1xyXG4gICAgcFk6IG51bWJlcjtcclxuICAgIHBYVmVsOiBudW1iZXIgPSAwXHJcbiAgICBwWVZlbDogbnVtYmVyID0gMFxyXG5cclxuICAgIGdyb3VuZGVkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwR3JvdW5kZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICBjb2xsaXNpb25EYXRhOiBhbnk7XHJcbiAgICBjbG9zZXN0Q29sbGlzaW9uOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl1cclxuXHJcbiAgICBtYXNzOiBudW1iZXIgPSB0aGlzLndpZHRoICogdGhpcy5oZWlnaHRcclxuXHJcbiAgICAvL2lucHV0IGJvb2xlYW5zXHJcbiAgICByaWdodEJ1dHRvbjogYm9vbGVhbjtcclxuICAgIGxlZnRCdXR0b246IGJvb2xlYW47XHJcbiAgICBqdW1wQnV0dG9uOiBib29sZWFuO1xyXG5cclxuICAgIGN1cnJlbnRBbmltYXRpb246IEFuaW1hdGlvbkZyYW1lPHR5cGVvZiBQbGF5ZXJBbmltYXRpb25zPiA9IFwiaWRsZVwiO1xyXG4gICAgYW5pbUZyYW1lOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIHRvcENvbGxpc2lvbjogKHR5cGVvZiBXb3JsZFRpbGVzW1RpbGVUeXBlLkFpcl0pID0gV29ybGRUaWxlc1tUaWxlVHlwZS5BaXJdOy8vaGFja3lcclxuICAgIGJvdHRvbUNvbGxpc2lvbjogKHR5cGVvZiBXb3JsZFRpbGVzW1RpbGVUeXBlLkFpcl0pID0gV29ybGRUaWxlc1tUaWxlVHlwZS5BaXJdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIGRhdGE6IEVudGl0eVBheWxvYWQ8RW50aXRpZXMuTG9jYWxQbGF5ZXI+XHJcbiAgICApIHtcclxuICAgICAgICBzdXBlcihkYXRhLmlkKVxyXG5cclxuICAgICAgICB0aGlzLm5hbWUgPSBkYXRhLmRhdGEubmFtZVxyXG5cclxuICAgICAgICB0aGlzLnggPSBkYXRhLmRhdGEueFxyXG4gICAgICAgIHRoaXMueSA9IGRhdGEuZGF0YS55XHJcblxyXG4gICAgICAgIHRoaXMuY2xvc2VzdENvbGxpc2lvbiA9IFsxLCAwLCBJbmZpbml0eV07XHJcblxyXG4gICAgICAgIHRoaXMuaW50ZXJwb2xhdGVkWCA9IHRoaXMueDtcclxuICAgICAgICB0aGlzLmludGVycG9sYXRlZFkgPSB0aGlzLnk7XHJcblxyXG4gICAgICAgIHRoaXMucFggPSB0aGlzLnhcclxuICAgICAgICB0aGlzLnBZID0gdGhpcy55O1xyXG4gICAgICAgIHRoaXMubGVmdEJ1dHRvbiA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucmlnaHRCdXR0b24gPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmp1bXBCdXR0b24gPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIodGFyZ2V0OiBHYW1lLCB1cHNjYWxlU2l6ZTogbnVtYmVyKTogdm9pZCB7XHJcblxyXG4gICAgICAgIFBsYXllckFuaW1hdGlvbnNbdGhpcy5jdXJyZW50QW5pbWF0aW9uXVt0aGlzLmFuaW1GcmFtZV0ucmVuZGVyXHJcbiAgICAgICAgICAgIChcclxuICAgICAgICAgICAgICAgIHRhcmdldCxcclxuICAgICAgICAgICAgICAgICh0aGlzLmludGVycG9sYXRlZFggKiBnYW1lLlRJTEVfV0lEVEggLVxyXG4gICAgICAgICAgICAgICAgICAgIGdhbWUuaW50ZXJwb2xhdGVkQ2FtWCAqIGdhbWUuVElMRV9XSURUSCkgKlxyXG4gICAgICAgICAgICAgICAgdXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgICAgICAodGhpcy5pbnRlcnBvbGF0ZWRZICogZ2FtZS5USUxFX0hFSUdIVCAtXHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS5pbnRlcnBvbGF0ZWRDYW1ZICogZ2FtZS5USUxFX0hFSUdIVCkgKlxyXG4gICAgICAgICAgICAgICAgdXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgICAgICB0aGlzLndpZHRoICogdXBzY2FsZVNpemUgKiBnYW1lLlRJTEVfV0lEVEgsXHJcbiAgICAgICAgICAgICAgICB0aGlzLmhlaWdodCAqIHVwc2NhbGVTaXplICogZ2FtZS5USUxFX0hFSUdIVFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBQbGF5ZXJBbmltYXRpb25zW3RoaXMuY3VycmVudEFuaW1hdGlvbl1bdGhpcy5hbmltRnJhbWVdLnJlbmRlcldvcmxkc3BhY2VSZWZsZWN0aW9uXHJcbiAgICAgICAgICAgIChcclxuICAgICAgICAgICAgICAgIHRhcmdldCxcclxuICAgICAgICAgICAgICAgIHRoaXMuaW50ZXJwb2xhdGVkWCxcclxuICAgICAgICAgICAgICAgIHRoaXMuaW50ZXJwb2xhdGVkWSt0aGlzLmhlaWdodCxcclxuICAgICAgICAgICAgICAgIHRoaXMud2lkdGgsXHJcbiAgICAgICAgICAgICAgICB0aGlzLmhlaWdodFxyXG4gICAgICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZURhdGEoZGF0YTogRW50aXR5UGF5bG9hZCk6IHZvaWQge1xyXG4gICAgICAgIGlmIChkYXRhLnR5cGUgPT09IEVudGl0aWVzLlBsYXllcilcclxuICAgICAgICAgICAgdGhpcy5uYW1lID0gZGF0YS5kYXRhLm5hbWU7XHJcbiAgICB9XHJcblxyXG4gICAga2V5Ym9hcmRJbnB1dCgpIHtcclxuXHJcbiAgICAgICAgdGhpcy54VmVsICs9XHJcbiAgICAgICAgICAgIDAuMDIgKiAoK3RoaXMucmlnaHRCdXR0b24gLSArdGhpcy5sZWZ0QnV0dG9uKTtcclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgIHRoaXMuZ3JvdW5kZWQgJiYgdGhpcy5qdW1wQnV0dG9uXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIGdhbWUuc2NyZWVuc2hha2VBbW91bnQgPSAwLjU7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTAgKiBnYW1lLnBhcnRpY2xlTXVsdGlwbGllcjsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBnYW1lLnBhcnRpY2xlcy5wdXNoKG5ldyBDb2xvclBhcnRpY2xlKHRoaXMuYm90dG9tQ29sbGlzaW9uLmNvbG9yLCAxIC8gOCArIE1hdGgucmFuZG9tKCkgLyA4LCAyMCwgdGhpcy54ICsgdGhpcy53aWR0aCAqIE1hdGgucmFuZG9tKCksIHRoaXMueSArIHRoaXMuaGVpZ2h0LCAwLjIgKiAoTWF0aC5yYW5kb20oKSAtIDAuNSksIDAuMiAqIC1NYXRoLnJhbmRvbSgpKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy55VmVsID0gLTEuNTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYXBwbHlHcmF2aXR5QW5kRHJhZygpIHtcclxuICAgICAgICAvLyB0aGlzIGZ1bmN0aW9uIGNoYW5nZXMgdGhlIG9iamVjdCdzIG5leHQgdGljaydzIHZlbG9jaXR5IGluIGJvdGggdGhlIHggYW5kIHRoZSB5IGRpcmVjdGlvbnNcclxuXHJcbiAgICAgICAgdGhpcy5wWFZlbCA9IHRoaXMueFZlbDtcclxuICAgICAgICB0aGlzLnBZVmVsID0gdGhpcy55VmVsO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5ib3R0b21Db2xsaXNpb24gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLnhWZWwgLT1cclxuICAgICAgICAgICAgICAgIChNYXRoLmFicyh0aGlzLnhWZWwpICogdGhpcy54VmVsICogZ2FtZS5EUkFHX0NPRUZGSUNJRU5UICogdGhpcy53aWR0aCkgLyAvL2FwcGx5IGFpciByZXNpc3RhbmNlXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1hc3M7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy54VmVsIC09XHJcbiAgICAgICAgICAgICAgICAoTWF0aC5hYnModGhpcy54VmVsKSAqIHRoaXMueFZlbCAqIGdhbWUuRFJBR19DT0VGRklDSUVOVCAqICh0aGlzLmJvdHRvbUNvbGxpc2lvbi5mcmljdGlvbikgKiB0aGlzLndpZHRoKSAvIC8vYXBwbHkgYWlyIHJlc2lzdGFuY2UgYW5kIGdyb3VuZCBmcmljdGlvblxyXG4gICAgICAgICAgICAgICAgdGhpcy5tYXNzO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnlWZWwgKz0gZ2FtZS5HUkFWSVRZX1NQRUVEO1xyXG4gICAgICAgIHRoaXMueVZlbCAtPVxyXG4gICAgICAgICAgICAoTWF0aC5hYnModGhpcy55VmVsKSAqIHRoaXMueVZlbCAqIGdhbWUuRFJBR19DT0VGRklDSUVOVCAqIHRoaXMuaGVpZ2h0KSAvXHJcbiAgICAgICAgICAgIHRoaXMubWFzcztcclxuICAgICAgICAvL2lmIG9uIHRoZSBncm91bmQsIG1ha2Ugd2Fsa2luZyBwYXJ0aWNsZXNcclxuICAgICAgICBpZiAodGhpcy5ncm91bmRlZCkge1xyXG4gICAgICAgICAgICAvL2Zvb3RzdGVwc1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJhbmRvbWx5VG9JbnQoTWF0aC5hYnModGhpcy54VmVsKSAqIGdhbWUucGFydGljbGVNdWx0aXBsaWVyIC8gMik7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgZ2FtZS5wYXJ0aWNsZXMucHVzaChuZXcgQ29sb3JQYXJ0aWNsZShcIiNiYmJiYmI0NVwiLCAxIC8gNCArIE1hdGgucmFuZG9tKCkgLyA4LCA1MCwgdGhpcy54ICsgdGhpcy53aWR0aCAvIDIgKyBpIC8gZ2FtZS5wYXJ0aWNsZU11bHRpcGxpZXIsIHRoaXMueSArIHRoaXMuaGVpZ2h0LCAwLCAwLCBmYWxzZSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vZHVzdFxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJhbmRvbWx5VG9JbnQoTWF0aC5hYnModGhpcy54VmVsKSAqIGdhbWUucGFydGljbGVNdWx0aXBsaWVyIC8gMik7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgZ2FtZS5wYXJ0aWNsZXMucHVzaChuZXcgQ29sb3JQYXJ0aWNsZSh0aGlzLmJvdHRvbUNvbGxpc2lvbi5jb2xvciwgMSAvIDggKyBNYXRoLnJhbmRvbSgpIC8gOCwgMTAsIHRoaXMueCArIHRoaXMud2lkdGggLyAyLCB0aGlzLnkgKyB0aGlzLmhlaWdodCwgMC4yICogLXRoaXMueFZlbCArIDAuMiAqIChNYXRoLnJhbmRvbSgpIC0gMC41KSwgMC4yICogLU1hdGgucmFuZG9tKCksIHRydWUpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmaW5kSW50ZXJwb2xhdGVkQ29vcmRpbmF0ZXMoKSB7XHJcbiAgICAgICAgLy8gdGhpcyBmdW5jdGlvbiBlc3NlbnRpYWxseSBtYWtlcyB0aGUgY2hhcmFjdGVyIGxhZyBiZWhpbmQgb25lIHRpY2ssIGJ1dCBtZWFucyB0aGF0IGl0IGdldHMgZGlzcGxheWVkIGF0IHRoZSBtYXhpbXVtIGZyYW1lIHJhdGUuXHJcbiAgICAgICAgaWYgKHRoaXMucFhWZWwgPiAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW50ZXJwb2xhdGVkWCA9IGdhbWUubWluKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5wWCArIHRoaXMucFhWZWwgKiBnYW1lLmFtb3VudFNpbmNlTGFzdFRpY2ssXHJcbiAgICAgICAgICAgICAgICB0aGlzLnhcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmludGVycG9sYXRlZFggPSBnYW1lLm1heChcclxuICAgICAgICAgICAgICAgIHRoaXMucFggKyB0aGlzLnBYVmVsICogZ2FtZS5hbW91bnRTaW5jZUxhc3RUaWNrLFxyXG4gICAgICAgICAgICAgICAgdGhpcy54XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLnBZVmVsID4gMCkge1xyXG4gICAgICAgICAgICB0aGlzLmludGVycG9sYXRlZFkgPSBnYW1lLm1pbihcclxuICAgICAgICAgICAgICAgIHRoaXMucFkgKyB0aGlzLnBZVmVsICogZ2FtZS5hbW91bnRTaW5jZUxhc3RUaWNrLFxyXG4gICAgICAgICAgICAgICAgdGhpcy55XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5pbnRlcnBvbGF0ZWRZID0gZ2FtZS5tYXgoXHJcbiAgICAgICAgICAgICAgICB0aGlzLnBZICsgdGhpcy5wWVZlbCAqIGdhbWUuYW1vdW50U2luY2VMYXN0VGljayxcclxuICAgICAgICAgICAgICAgIHRoaXMueVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBhcHBseVZlbG9jaXR5QW5kQ29sbGlkZSgpIHtcclxuICAgICAgICB0aGlzLnRvcENvbGxpc2lvbiA9IFdvcmxkVGlsZXNbVGlsZVR5cGUuQWlyXTtcclxuICAgICAgICB0aGlzLmJvdHRvbUNvbGxpc2lvbiA9IFdvcmxkVGlsZXNbVGlsZVR5cGUuQWlyXTtcclxuICAgICAgICB0aGlzLnBYID0gdGhpcy54O1xyXG4gICAgICAgIHRoaXMucFkgPSB0aGlzLnk7XHJcblxyXG4gICAgICAgIHRoaXMucEdyb3VuZGVkID0gdGhpcy5ncm91bmRlZDtcclxuICAgICAgICB0aGlzLmdyb3VuZGVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgVGhpcyBmdW5jdGlvbiBhc3N1bWVzIHRoYXQgdGhlIG9iamVjdCBkb2Vzbid0IHN0YXJ0IGluIGNvbGxpc2lvblxyXG5cclxuICAgICAgICBBbHNvLCBpdCB0YWtlcyBhZHZhbnRhZ2Ugb2YgdGhlIGZhY3QgdGhhdCBhbiBvYmplY3QgY2FuIG9ubHkgY29sbGlkZSBvbmNlIGluIGVhY2ggYXhpcyB3aXRoIHRoZXNlIGF4aXMtYWxpZ25lZCByZWN0YW5nbGVzLlxyXG4gICAgICAgIFRoYXQncyBhIHRvdGFsIG9mIGEgcG9zc2libGUgdHdvIGNvbGxpc2lvbnMsIG9yIGFuIGluaXRpYWwgY29sbGlzaW9uLCBhbmQgYSBzbGlkaW5nIGNvbGxpc2lvbi5cclxuICAgICAgICAqL1xyXG5cclxuICAgICAgICAvLyBjYWxjdWxhdGUgdGhlIGluaXRpYWwgY29sbGlzaW9uOlxyXG5cclxuICAgICAgICAvLyBzZXQgdGhlIGNsb3Nlc3QgY29sbGlzaW9uIHRvIG9uZSBpbmZpbml0ZWx5IGZhciBhd2F5LlxyXG4gICAgICAgIHRoaXMuY2xvc2VzdENvbGxpc2lvbiA9IFsxLCAwLCBJbmZpbml0eV07XHJcblxyXG4gICAgICAgIGxldCBtb3N0bHlHb2luZ0hvcml6b250YWxseTogYm9vbGVhbjtcclxuXHJcbiAgICAgICAgLy8gbG9vcCB0aHJvdWdoIGFsbCB0aGUgcG9zc2libGUgdGlsZXMgdGhlIHBoeXNpY3MgYm94IGNvdWxkIGJlIGludGVyc2VjdGluZyB3aXRoXHJcbiAgICAgICAgZm9yIChcclxuICAgICAgICAgICAgbGV0IGkgPSBNYXRoLmZsb29yKGdhbWUubWluKHRoaXMueCwgdGhpcy54ICsgdGhpcy54VmVsKSk7XHJcbiAgICAgICAgICAgIGkgPCBNYXRoLmNlaWwoZ2FtZS5tYXgodGhpcy54LCB0aGlzLnggKyB0aGlzLnhWZWwpICsgdGhpcy53aWR0aCk7XHJcbiAgICAgICAgICAgIGkrK1xyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICBmb3IgKFxyXG4gICAgICAgICAgICAgICAgbGV0IGogPSBNYXRoLmZsb29yKGdhbWUubWluKHRoaXMueSwgdGhpcy55ICsgdGhpcy55VmVsKSk7XHJcbiAgICAgICAgICAgICAgICBqIDwgTWF0aC5jZWlsKGdhbWUubWF4KHRoaXMueSwgdGhpcy55ICsgdGhpcy55VmVsKSArIHRoaXMuaGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgIGorK1xyXG4gICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBjdXJyZW50IHRpbGUgaXNuJ3QgYWlyICh2YWx1ZSAwKSwgdGhlbiBjb250aW51ZSB3aXRoIHRoZSBjb2xsaXNpb24gZGV0ZWN0aW9uXHJcbiAgICAgICAgICAgICAgICBsZXQgY3VycmVudEJsb2NrOiBUaWxlVHlwZSA9IGdhbWUud29ybGQud29ybGRUaWxlc1tqICogZ2FtZS53b3JsZFdpZHRoICsgaV07XHJcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudEJsb2NrICE9IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBnZXQgdGhlIGRhdGEgYWJvdXQgdGhlIGNvbGxpc2lvbiBhbmQgc3RvcmUgaXQgaW4gYSB2YXJpYWJsZVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29sbGlzaW9uRGF0YSA9IGdhbWUucmVjdFZzUmF5KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpIC0gdGhpcy53aWR0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaiAtIHRoaXMuaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLndpZHRoICsgMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oZWlnaHQgKyAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLngsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMueSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy54VmVsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnlWZWxcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgIG1vc3RseUdvaW5nSG9yaXpvbnRhbGx5ID0gTWF0aC5hYnModGhpcy54VmVsKSA+IE1hdGguYWJzKHRoaXMueVZlbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbGxpc2lvbkRhdGEgIT09IGZhbHNlKSB7Ly9hIGNvbGxpc2lvbiBoYXBwZW5lZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMl0gPiB0aGlzLmNvbGxpc2lvbkRhdGFbMl1cclxuICAgICAgICAgICAgICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3Nlc3RDb2xsaXNpb24gPSB0aGlzLmNvbGxpc2lvbkRhdGE7Ly9ob25lc3RseSB0aGlzIGVudGlyZSBjb2xsaXNpb24gc3lzdGVtIGlzIGEgbWVzcyBidXQgaXQgd29yayBzbyBzbyB3aGF0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jbG9zZXN0Q29sbGlzaW9uWzBdID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMV0gPT09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b3BDb2xsaXNpb24gPSBXb3JsZFRpbGVzW2N1cnJlbnRCbG9ja107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJvdHRvbUNvbGxpc2lvbiA9IFdvcmxkVGlsZXNbY3VycmVudEJsb2NrXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5jbG9zZXN0Q29sbGlzaW9uWzJdID09PSB0aGlzLmNvbGxpc2lvbkRhdGFbMl0gJiYgbW9zdGx5R29pbmdIb3Jpem9udGFsbHkgPT09ICh0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMF0gPT09IDApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3Nlc3RDb2xsaXNpb24gPSB0aGlzLmNvbGxpc2lvbkRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jbG9zZXN0Q29sbGlzaW9uWzBdID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMV0gPT09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b3BDb2xsaXNpb24gPSBXb3JsZFRpbGVzW2N1cnJlbnRCbG9ja107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJvdHRvbUNvbGxpc2lvbiA9IFdvcmxkVGlsZXNbY3VycmVudEJsb2NrXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5jbG9zZXN0Q29sbGlzaW9uWzJdICE9PSBJbmZpbml0eSkge1xyXG4gICAgICAgICAgICAvLyB0aGVyZSBoYXMgYmVlbiBhdCBsZWFzdCBvbmUgY29sbGlzaW9uXHJcblxyXG4gICAgICAgICAgICAvLyBnbyB0byB0aGUgcG9pbnQgb2YgY29sbGlzaW9uICh0aGlzIG1ha2VzIGl0IGJlaGF2ZSBhcyBpZiB0aGUgd2FsbHMgYXJlIHN0aWNreSwgYnV0IHdlIHdpbGwgbGF0ZXIgc2xpZGUgYWdhaW5zdCB0aGUgd2FsbHMpXHJcbiAgICAgICAgICAgIHRoaXMueCArPSB0aGlzLnhWZWwgKiB0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMl07XHJcbiAgICAgICAgICAgIHRoaXMueSArPSB0aGlzLnlWZWwgKiB0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMl07XHJcbiAgICAgICAgICAgIC8vIHRoZSBjb2xsaXNpb24gaGFwcGVuZWQgZWl0aGVyIG9uIHRoZSB0b3Agb3IgYm90dG9tXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMF0gPT09IDApIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMV0gPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ncm91bmRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgaXQgY29sbGlkZWQgb24gdGhlIGhpZ2hlciBzaWRlLCBpdCBtdXN0IGJlIHRvdWNoaW5nIHRoZSBncm91bmQuIChoaWdoZXIgeSBpcyBkb3duKVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5wR3JvdW5kZWQpIHsvL2lmIGl0IGlzbid0IGdyb3VuZGVkIHlldCwgaXQgbXVzdCBiZSBjb2xsaWRpbmcgd2l0aCB0aGUgZ3JvdW5kIGZvciB0aGUgZmlyc3QgdGltZSwgc28gc3VtbW9uIHBhcnRpY2xlc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBnYW1lLnNjcmVlbnNoYWtlQW1vdW50ID0gTWF0aC5hYnModGhpcy55VmVsICogMC43NSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNSAqIGdhbWUucGFydGljbGVNdWx0aXBsaWVyOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdhbWUucGFydGljbGVzLnB1c2gobmV3IENvbG9yUGFydGljbGUodGhpcy5ib3R0b21Db2xsaXNpb24uY29sb3IsIDEgLyA4ICsgTWF0aC5yYW5kb20oKSAvIDgsIDIwLCB0aGlzLnggKyB0aGlzLndpZHRoICogTWF0aC5yYW5kb20oKSwgdGhpcy55ICsgdGhpcy5oZWlnaHQsIDAuMiAqIChNYXRoLnJhbmRvbSgpIC0gMC41KSwgMC4yICogLU1hdGgucmFuZG9tKCkpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGdhbWUuc2NyZWVuc2hha2VBbW91bnQgPSBNYXRoLmFicyh0aGlzLnlWZWwgKiAwLjc1KTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDUgKiBnYW1lLnBhcnRpY2xlTXVsdGlwbGllcjsgaSsrKSB7Ly9jZWlsaW5nIGNvbGxpc2lvbiBwYXJ0aWNsZXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2FtZS5wYXJ0aWNsZXMucHVzaChuZXcgQ29sb3JQYXJ0aWNsZSh0aGlzLnRvcENvbGxpc2lvbi5jb2xvciwgMSAvIDggKyBNYXRoLnJhbmRvbSgpIC8gOCwgMjAsIHRoaXMueCArIHRoaXMud2lkdGggKiBNYXRoLnJhbmRvbSgpLCB0aGlzLnksIDAuMiAqIChNYXRoLnJhbmRvbSgpIC0gMC41KSwgMC4yICogLU1hdGgucmFuZG9tKCkpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLnlWZWwgPSAwOyAvLyBzZXQgdGhlIHkgdmVsb2NpdHkgdG8gMCBiZWNhdXNlIHRoZSBvYmplY3QgaGFzIHJ1biBpbnRvIGEgd2FsbCBvbiBpdHMgdG9wIG9yIGJvdHRvbVxyXG4gICAgICAgICAgICAgICAgdGhpcy5zbGlkZVggPSB0aGlzLnhWZWwgKiAoMSAtIHRoaXMuY2xvc2VzdENvbGxpc2lvblsyXSk7IC8vIHRoaXMgaXMgdGhlIHJlbWFpbmluZyBkaXN0YW5jZSB0byBzbGlkZSBhZnRlciB0aGUgY29sbGlzaW9uXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNsaWRlWSA9IDA7IC8vIGl0IGRvZXNuJ3Qgc2xpZGUgaW4gdGhlIHkgZGlyZWN0aW9uIGJlY2F1c2UgdGhlcmUncyBhIHdhbGwgXFwoLi0uKS9cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMueFZlbCA9IDA7IC8vIHNldCB0aGUgeCB2ZWxvY2l0eSB0byAwIGJlY2F1c2Ugd2FsbCBnbyBvb2ZcclxuICAgICAgICAgICAgICAgIHRoaXMuc2xpZGVYID0gMDsgLy8gaXQgZG9lc24ndCBzbGlkZSBpbiB0aGUgeCBkaXJlY3Rpb24gYmVjYXVzZSB0aGVyZSdzIGEgd2FsbCAvKC5fLilcXFxyXG4gICAgICAgICAgICAgICAgdGhpcy5zbGlkZVkgPSB0aGlzLnlWZWwgKiAoMSAtIHRoaXMuY2xvc2VzdENvbGxpc2lvblsyXSk7IC8vIHRoaXMgaXMgdGhlIHJlbWFpbmluZyBkaXN0YW5jZSB0byBzbGlkZSBhZnRlciB0aGUgY29sbGlzaW9uXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIGF0IHRoaXMgcG9pbnQsIHRoZSBvYmplY3QgaXMgdG91Y2hpbmcgaXRzIGZpcnN0IGNvbGxpc2lvbiwgcmVhZHkgdG8gc2xpZGUuICBUaGUgYW1vdW50IGl0IHdhbnRzIHRvIHNsaWRlIGlzIGhlbGQgaW4gdGhlIHRoaXMuc2xpZGVYIGFuZCB0aGlzLnNsaWRlWSB2YXJpYWJsZXMuXHJcblxyXG4gICAgICAgICAgICAvLyB0aGlzIGNhbiBiZSB0cmVhdGVkIGVzc2VudGlhbGx5IHRoZSBzYW1lIGFzIHRoZSBmaXJzdCBjb2xsaXNpb24sIHNvIGEgbG90IG9mIHRoZSBjb2RlIHdpbGwgYmUgcmV1c2VkLlxyXG5cclxuICAgICAgICAgICAgLy8gc2V0IHRoZSBjbG9zZXN0IGNvbGxpc2lvbiB0byBvbmUgaW5maW5pdGVseSBmYXIgYXdheS5cclxuICAgICAgICAgICAgdGhpcy5jbG9zZXN0Q29sbGlzaW9uID0gWzEsIDAsIEluZmluaXR5XTtcclxuXHJcbiAgICAgICAgICAgIC8vIGxvb3AgdGhyb3VnaCBhbGwgdGhlIHBvc3NpYmxlIHRpbGVzIHRoZSBwaHlzaWNzIGJveCBjb3VsZCBiZSBpbnRlcnNlY3Rpbmcgd2l0aFxyXG4gICAgICAgICAgICBmb3IgKFxyXG4gICAgICAgICAgICAgICAgbGV0IGkgPSBNYXRoLmZsb29yKGdhbWUubWluKHRoaXMueCwgdGhpcy54ICsgdGhpcy5zbGlkZVgpKTtcclxuICAgICAgICAgICAgICAgIGkgPCBNYXRoLmNlaWwoZ2FtZS5tYXgodGhpcy54LCB0aGlzLnggKyB0aGlzLnNsaWRlWCkgKyB0aGlzLndpZHRoKTtcclxuICAgICAgICAgICAgICAgIGkrK1xyXG4gICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgIGZvciAoXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGogPSBNYXRoLmZsb29yKGdhbWUubWluKHRoaXMueSwgdGhpcy55ICsgdGhpcy5zbGlkZVkpKTtcclxuICAgICAgICAgICAgICAgICAgICBqIDxcclxuICAgICAgICAgICAgICAgICAgICBNYXRoLmNlaWwoZ2FtZS5tYXgodGhpcy55LCB0aGlzLnkgKyB0aGlzLnNsaWRlWSkgKyB0aGlzLmhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaisrXHJcbiAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgY3VycmVudEJsb2NrOiBUaWxlVHlwZSA9IGdhbWUud29ybGQud29ybGRUaWxlc1tqICogZ2FtZS53b3JsZFdpZHRoICsgaV07XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhlIGN1cnJlbnQgdGlsZSBpc24ndCBhaXIsIHRoZW4gY29udGludWUgd2l0aCB0aGUgY29sbGlzaW9uIGRldGVjdGlvblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50QmxvY2sgIT09IFRpbGVUeXBlLkFpcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBnZXQgdGhlIGRhdGEgYWJvdXQgdGhlIGNvbGxpc2lvbiBhbmQgc3RvcmUgaXQgaW4gYSB2YXJpYWJsZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbGxpc2lvbkRhdGEgPSBnYW1lLnJlY3RWc1JheShcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGkgLSB0aGlzLndpZHRoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaiAtIHRoaXMuaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy53aWR0aCArIDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhlaWdodCArIDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLngsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNsaWRlWCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2xpZGVZXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29sbGlzaW9uRGF0YSAhPT0gZmFsc2UgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2VzdENvbGxpc2lvblsyXSA+IHRoaXMuY29sbGlzaW9uRGF0YVsyXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2VzdENvbGxpc2lvbiA9IHRoaXMuY29sbGlzaW9uRGF0YTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMF0gPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2xvc2VzdENvbGxpc2lvblsxXSA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRvcENvbGxpc2lvbiA9IFdvcmxkVGlsZXNbY3VycmVudEJsb2NrXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYm90dG9tQ29sbGlzaW9uID0gV29ybGRUaWxlc1tjdXJyZW50QmxvY2tdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gaXQgaGFzIGNvbGxpZGVkIHdoaWxlIHRyeWluZyB0byBzbGlkZVxyXG4gICAgICAgICAgICBpZiAodGhpcy5jbG9zZXN0Q29sbGlzaW9uWzJdICE9PSBJbmZpbml0eSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy54ICs9IHRoaXMuc2xpZGVYICogdGhpcy5jbG9zZXN0Q29sbGlzaW9uWzJdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy55ICs9IHRoaXMuc2xpZGVZICogdGhpcy5jbG9zZXN0Q29sbGlzaW9uWzJdO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMF0gPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnlWZWwgPSAwOyAvLyBzZXQgdGhlIHkgdmVsb2NpdHkgdG8gMCBiZWNhdXNlIHRoZSBvYmplY3QgaGFzIHJ1biBpbnRvIGEgd2FsbCBvbiBpdHMgdG9wIG9yIGJvdHRvbVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMV0gPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIGl0IGNvbGxpZGVkIG9uIHRoZSBoaWdoZXIgc2lkZSwgaXQgbXVzdCBiZSB0b3VjaGluZyB0aGUgZ3JvdW5kLiAoaGlnaGVyIHkgaXMgZG93bilcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ncm91bmRlZCA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy54VmVsID0gMDsgLy8gc2V0IHRoZSB4IHZlbG9jaXR5IHRvIDAgYmVjYXVzZSB3YWxsIGdvIG9vZlxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gaXQgaGFzIG5vdCBjb2xsaWRlZCB3aGlsZSB0cnlpbmcgdG8gc2xpZGVcclxuICAgICAgICAgICAgICAgIHRoaXMueCArPSB0aGlzLnNsaWRlWDtcclxuICAgICAgICAgICAgICAgIHRoaXMueSArPSB0aGlzLnNsaWRlWTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIHRoZXJlIGhhcyBiZWVuIG5vIGNvbGxpc2lvblxyXG4gICAgICAgICAgICB0aGlzLnggKz0gdGhpcy54VmVsO1xyXG4gICAgICAgICAgICB0aGlzLnkgKz0gdGhpcy55VmVsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gY29sbGlkZSB3aXRoIHNpZGVzIG9mIG1hcFxyXG5cclxuICAgICAgICBpZiAodGhpcy54IDwgMCkge1xyXG4gICAgICAgICAgICB0aGlzLnggPSAwO1xyXG4gICAgICAgICAgICB0aGlzLnhWZWwgPSAwO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy54ICsgdGhpcy53aWR0aCA+IGdhbWUud29ybGRXaWR0aCkge1xyXG4gICAgICAgICAgICB0aGlzLnggPSBnYW1lLndvcmxkV2lkdGggLSB0aGlzLndpZHRoO1xyXG4gICAgICAgICAgICB0aGlzLnhWZWwgPSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMueSA8IDApIHtcclxuICAgICAgICAgICAgdGhpcy55ID0gMDtcclxuICAgICAgICAgICAgdGhpcy55VmVsID0gMDtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMueSArIHRoaXMuaGVpZ2h0ID4gZ2FtZS53b3JsZEhlaWdodCkge1xyXG4gICAgICAgICAgICB0aGlzLnkgPSBnYW1lLndvcmxkSGVpZ2h0IC0gdGhpcy5oZWlnaHQ7XHJcbiAgICAgICAgICAgIHRoaXMueVZlbCA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JvdW5kZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5leHBvcnQgPSBQbGF5ZXJMb2NhbDtcclxuXHJcblxyXG5mdW5jdGlvbiByYW5kb21seVRvSW50KGY6IG51bWJlcikge1xyXG4gICAgaWYgKE1hdGgucmFuZG9tKCkgPiBmIC0gTWF0aC5mbG9vcihmKSkge1xyXG4gICAgICAgIHJldHVybiAoTWF0aC5mbG9vcihmKSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gKE1hdGguY2VpbChmKSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGF4aXNBbGlnbmVkRGlzdGFuY2UoeDE6IG51bWJlciwgeTE6IG51bWJlciwgeDI6IG51bWJlciwgeTI6IG51bWJlcikge1xyXG4gICAgcmV0dXJuIGFicyh4MSAtIHgyKSArIGFicyh5MSAtIHkyKTtcclxufSIsImltcG9ydCBSZW5kZXJhYmxlIGZyb20gJy4uLy4uL2ludGVyZmFjZXMvUmVuZGVyYWJsZSc7XHJcbmltcG9ydCBwNSBmcm9tICdwNSc7XHJcbmltcG9ydCB7IEVudGl0eVBheWxvYWQgfSBmcm9tICcuLi8uLi8uLi8uLi9hcGkvRW50aXR5JztcclxuXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBTZXJ2ZXJFbnRpdHkgaW1wbGVtZW50cyBSZW5kZXJhYmxlIHtcclxuXHJcbiAgICBlbnRpdHlJZDogc3RyaW5nXHJcblxyXG4gICAgeDogbnVtYmVyID0gMFxyXG4gICAgeTogbnVtYmVyID0gMFxyXG5cclxuICAgIHByb3RlY3RlZCBjb25zdHJ1Y3RvcihlbnRpdHlJZDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5lbnRpdHlJZCA9IGVudGl0eUlkXHJcbiAgICB9XHJcblxyXG4gICAgYWJzdHJhY3QgdXBkYXRlRGF0YShkYXRhOiBFbnRpdHlQYXlsb2FkKTogdm9pZFxyXG5cclxuICAgIGFic3RyYWN0IHJlbmRlcih0YXJnZXQ6IHA1LCB1cHNjYWxlU2l6ZTogbnVtYmVyKTogdm9pZDtcclxufSIsImltcG9ydCBnYW1lIGZyb20gXCIuLi8uLi9NYWluXCI7XHJcbmltcG9ydCBQYXJ0aWNsZSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9QYXJ0aWNsZVwiO1xyXG5pbXBvcnQgeyBjb2xsYXBzZVRleHRDaGFuZ2VSYW5nZXNBY3Jvc3NNdWx0aXBsZVZlcnNpb25zIH0gZnJvbSBcInR5cGVzY3JpcHRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDb2xvclBhcnRpY2xlIGltcGxlbWVudHMgUGFydGljbGUge1xyXG4gICAgY29sb3I6IHN0cmluZ1xyXG4gICAgeDogbnVtYmVyO1xyXG4gICAgeTogbnVtYmVyO1xyXG4gICAgc2l6ZTogbnVtYmVyO1xyXG4gICAgeFZlbDogbnVtYmVyO1xyXG4gICAgeVZlbDogbnVtYmVyO1xyXG4gICAgZ3Jhdml0eTogYm9vbGVhbjtcclxuICAgIGFnZTogbnVtYmVyO1xyXG4gICAgbGlmZXNwYW46IG51bWJlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihjb2xvcjogc3RyaW5nLCBzaXplOiBudW1iZXIsIGxpZmVzcGFuOiBudW1iZXIsIHg6IG51bWJlciwgeTogbnVtYmVyLCB4VmVsPzogbnVtYmVyLCB5VmVsPzogbnVtYmVyLCBncmF2aXR5PzogYm9vbGVhbikge1xyXG4gICAgICAgIHRoaXMuY29sb3IgPSBjb2xvcjtcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICAgICAgdGhpcy54VmVsID0geFZlbCB8fCAwO1xyXG4gICAgICAgIHRoaXMueVZlbCA9IHlWZWwgfHwgMDtcclxuICAgICAgICB0aGlzLnNpemUgPSBzaXplO1xyXG4gICAgICAgIHRoaXMuZ3Jhdml0eSA9IHRydWU7Ly91c2luZyB0aGUgb3IgbW9kaWZpZXIgd2l0aCBib29sZWFucyBjYXVzZXMgYnVnczsgdGhlcmUncyBwcm9iYWJseSBhIGJldHRlciB3YXkgdG8gZG8gdGhpc1xyXG4gICAgICAgIGlmIChncmF2aXR5ICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHRoaXMuZ3Jhdml0eSA9IGdyYXZpdHk7XHJcbiAgICAgICAgdGhpcy5hZ2UgPSAwO1xyXG4gICAgICAgIHRoaXMubGlmZXNwYW4gPSBsaWZlc3BhbjtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIodGFyZ2V0OiBpbXBvcnQoXCJwNVwiKSwgdXBzY2FsZVNpemU6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLmFnZSAvIHRoaXMubGlmZXNwYW4gPCAwLjgpIHsvL2lmIGl0J3MgdW5kZXIgODAlIG9mIHRoZSBwYXJ0aWNsZSdzIGxpZmVzcGFuLCBkcmF3IG5vcm1hbGx5IHdpdGhvdXQgZmFkZVxyXG4gICAgICAgICAgICB0YXJnZXQuZmlsbCh0aGlzLmNvbG9yKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7Ly90aGlzIG1lYW5zIHRoYXQgdGhlIHBhcnRpY2xlIGlzIGFsbW9zdCBnb2luZyB0byBiZSBkZWxldGVkLCBzbyBmYWRpbmcgaXMgbmVjZXNzYXJ5XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbG9yLmxlbmd0aCA9PT0gNykgey8vaWYgdGhlcmUgaXMgbm8gdHJhbnNwYXJlbmN5IGJ5IGRlZmF1bHQsIGp1c3QgbWFwIHRoZSB0aGluZ3NcclxuICAgICAgICAgICAgICAgIGxldCB0cmFuc3BhcmVuY3lTdHJpbmcgPSBNYXRoLnJvdW5kKDI1NSAqICgtNSAqICh0aGlzLmFnZSAvIHRoaXMubGlmZXNwYW4pICsgNSkpLnRvU3RyaW5nKDE2KS5zdWJzdHJpbmcoMCwgMik7XHJcbiAgICAgICAgICAgICAgICBpZiAodHJhbnNwYXJlbmN5U3RyaW5nPT09dW5kZWZpbmVkIHx8IHRyYW5zcGFyZW5jeVN0cmluZy5sZW5ndGg9PT11bmRlZmluZWQpLy9jYXRjaCB3aGF0IGNvdWxkIGJlIGFuIGluZmluaXRlIGxvb3Agb3IganVzdCBhbiBlcnJvclxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcclxuICAgICAgICAgICAgICAgICAgICAgICAgYHVuZGVmaW5lZCB0cmFuc3BhcmVuY3kgc3RyaW5nIG9uIHBhcnRpY2xlYFxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSh0cmFuc3BhcmVuY3lTdHJpbmcubGVuZ3RoPDIpIHsvL21ha2Ugc3VyZSBpdCdzIDIgY2hhcmFjdGVycyBsb25nOyB0aGlzIHN0b3BzIHRoZSBjb21wdXRlciBmcm9tIGludGVycHJldGluZyAjZmYgZmYgZmYgNSBhcyAjZmYgZmYgZmYgNTUgaW5zdGVhZCBvZiAjZmYgZmYgZmYgMDVcclxuICAgICAgICAgICAgICAgICAgICB0cmFuc3BhcmVuY3lTdHJpbmcgPSBcIjBcIit0cmFuc3BhcmVuY3lTdHJpbmc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQuZmlsbCh0aGlzLmNvbG9yLnN1YnN0cmluZygwLCA3KSArIHRyYW5zcGFyZW5jeVN0cmluZyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7Ly9pZiB0aGVyZSBpcyB0cmFuc3BhcmVuY3ksIG11bHRpcGx5XHJcbiAgICAgICAgICAgICAgICBsZXQgdHJhbnNwYXJlbmN5U3RyaW5nID0gTWF0aC5yb3VuZChwYXJzZUludCh0aGlzLmNvbG9yLnN1YnN0cmluZyg3LCA5KSwgMTYpICogKC01ICogKHRoaXMuYWdlIC8gdGhpcy5saWZlc3BhbikgKyA1KSkudG9TdHJpbmcoMTYpLnN1YnN0cmluZygwLCAyKTtcclxuICAgICAgICAgICAgICAgIGlmICh0cmFuc3BhcmVuY3lTdHJpbmc9PT11bmRlZmluZWQgfHwgdHJhbnNwYXJlbmN5U3RyaW5nLmxlbmd0aD09PXVuZGVmaW5lZCkvL2NhdGNoIHdoYXQgY291bGQgYmUgYW4gaW5maW5pdGUgbG9vcCBvciBqdXN0IGFuIGVycm9yXHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBgdW5kZWZpbmVkIHRyYW5zcGFyZW5jeSBzdHJpbmcgb24gcGFydGljbGVgXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIHdoaWxlKHRyYW5zcGFyZW5jeVN0cmluZy5sZW5ndGg8Mikgey8vbWFrZSBzdXJlIGl0J3MgMiBjaGFyYWN0ZXJzIGxvbmc7IHRoaXMgc3RvcHMgdGhlIGNvbXB1dGVyIGZyb20gaW50ZXJwcmV0aW5nICNmZiBmZiBmZiA1IGFzICNmZiBmZiBmZiA1NSBpbnN0ZWFkIG9mICNmZiBmZiBmZiAwNVxyXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zcGFyZW5jeVN0cmluZyA9IFwiMFwiK3RyYW5zcGFyZW5jeVN0cmluZztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRhcmdldC5maWxsKHRoaXMuY29sb3Iuc3Vic3RyaW5nKDAsIDcpICsgdHJhbnNwYXJlbmN5U3RyaW5nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvL2RyYXcgYSByZWN0YW5nbGUgY2VudGVyZWQgb24gdGhlIHggYW5kIHkgcG9zaXRpb24gZmlsbGVkIHdpdGggdGhlIGNvbG9yIG9mIHRoZSBvYmplY3RcclxuICAgICAgICB0YXJnZXQucmVjdChcclxuICAgICAgICAgICAgKC10aGlzLnNpemUgLyAyICsgdGhpcy54ICogZ2FtZS5USUxFX1dJRFRIIC1cclxuICAgICAgICAgICAgICAgIGdhbWUuaW50ZXJwb2xhdGVkQ2FtWCAqIGdhbWUuVElMRV9XSURUSCkgKlxyXG4gICAgICAgICAgICB1cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgKC10aGlzLnNpemUgLyAyICsgdGhpcy55ICogZ2FtZS5USUxFX0hFSUdIVCAtXHJcbiAgICAgICAgICAgICAgICBnYW1lLmludGVycG9sYXRlZENhbVkgKiBnYW1lLlRJTEVfSEVJR0hUKSAqXHJcbiAgICAgICAgICAgIHVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICB0aGlzLnNpemUgKiB1cHNjYWxlU2l6ZSAqIGdhbWUuVElMRV9XSURUSCxcclxuICAgICAgICAgICAgdGhpcy5zaXplICogdXBzY2FsZVNpemUgKiBnYW1lLlRJTEVfSEVJR0hUXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICB0aWNrKCkge1xyXG4gICAgICAgIHRoaXMuYWdlKys7XHJcbiAgICAgICAgdGhpcy54ICs9IHRoaXMueFZlbDtcclxuICAgICAgICB0aGlzLnkgKz0gdGhpcy55VmVsO1xyXG4gICAgICAgIHRoaXMueFZlbCAtPSAoTWF0aC5hYnModGhpcy54VmVsKSAqIHRoaXMueFZlbCAqIGdhbWUuRFJBR19DT0VGRklDSUVOVCAqIHRoaXMuc2l6ZSk7Ly9hc3N1bWluZyBjb25zdGFudCBtYXNzIGZvciBlYWNoIHBhcnRpY2xlXHJcbiAgICAgICAgaWYgKHRoaXMuZ3Jhdml0eSkge1xyXG4gICAgICAgICAgICB0aGlzLnlWZWwgKz0gZ2FtZS5HUkFWSVRZX1NQRUVEO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnlWZWwgLT0gKE1hdGguYWJzKHRoaXMueVZlbCkgKiB0aGlzLnlWZWwgKiBnYW1lLkRSQUdfQ09FRkZJQ0lFTlQgKiB0aGlzLnNpemUpO1xyXG4gICAgfVxyXG5cclxufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuIiwidmFyIGRlZmVycmVkID0gW107XG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8gPSAocmVzdWx0LCBjaHVua0lkcywgZm4sIHByaW9yaXR5KSA9PiB7XG5cdGlmKGNodW5rSWRzKSB7XG5cdFx0cHJpb3JpdHkgPSBwcmlvcml0eSB8fCAwO1xuXHRcdGZvcih2YXIgaSA9IGRlZmVycmVkLmxlbmd0aDsgaSA+IDAgJiYgZGVmZXJyZWRbaSAtIDFdWzJdID4gcHJpb3JpdHk7IGktLSkgZGVmZXJyZWRbaV0gPSBkZWZlcnJlZFtpIC0gMV07XG5cdFx0ZGVmZXJyZWRbaV0gPSBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV07XG5cdFx0cmV0dXJuO1xuXHR9XG5cdHZhciBub3RGdWxmaWxsZWQgPSBJbmZpbml0eTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZWZlcnJlZC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV0gPSBkZWZlcnJlZFtpXTtcblx0XHR2YXIgZnVsZmlsbGVkID0gdHJ1ZTtcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGNodW5rSWRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRpZiAoKHByaW9yaXR5ICYgMSA9PT0gMCB8fCBub3RGdWxmaWxsZWQgPj0gcHJpb3JpdHkpICYmIE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uTykuZXZlcnkoKGtleSkgPT4gKF9fd2VicGFja19yZXF1aXJlX18uT1trZXldKGNodW5rSWRzW2pdKSkpKSB7XG5cdFx0XHRcdGNodW5rSWRzLnNwbGljZShqLS0sIDEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZnVsZmlsbGVkID0gZmFsc2U7XG5cdFx0XHRcdGlmKHByaW9yaXR5IDwgbm90RnVsZmlsbGVkKSBub3RGdWxmaWxsZWQgPSBwcmlvcml0eTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYoZnVsZmlsbGVkKSB7XG5cdFx0XHRkZWZlcnJlZC5zcGxpY2UoaS0tLCAxKVxuXHRcdFx0dmFyIHIgPSBmbigpO1xuXHRcdFx0aWYgKHIgIT09IHVuZGVmaW5lZCkgcmVzdWx0ID0gcjtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gbm8gYmFzZVVSSVxuXG4vLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGFuZCBsb2FkaW5nIGNodW5rc1xuLy8gdW5kZWZpbmVkID0gY2h1bmsgbm90IGxvYWRlZCwgbnVsbCA9IGNodW5rIHByZWxvYWRlZC9wcmVmZXRjaGVkXG4vLyBbcmVzb2x2ZSwgcmVqZWN0LCBQcm9taXNlXSA9IGNodW5rIGxvYWRpbmcsIDAgPSBjaHVuayBsb2FkZWRcbnZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG5cdFwibWFpblwiOiAwXG59O1xuXG4vLyBubyBjaHVuayBvbiBkZW1hbmQgbG9hZGluZ1xuXG4vLyBubyBwcmVmZXRjaGluZ1xuXG4vLyBubyBwcmVsb2FkZWRcblxuLy8gbm8gSE1SXG5cbi8vIG5vIEhNUiBtYW5pZmVzdFxuXG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8uaiA9IChjaHVua0lkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID09PSAwKTtcblxuLy8gaW5zdGFsbCBhIEpTT05QIGNhbGxiYWNrIGZvciBjaHVuayBsb2FkaW5nXG52YXIgd2VicGFja0pzb25wQ2FsbGJhY2sgPSAocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24sIGRhdGEpID0+IHtcblx0dmFyIFtjaHVua0lkcywgbW9yZU1vZHVsZXMsIHJ1bnRpbWVdID0gZGF0YTtcblx0Ly8gYWRkIFwibW9yZU1vZHVsZXNcIiB0byB0aGUgbW9kdWxlcyBvYmplY3QsXG5cdC8vIHRoZW4gZmxhZyBhbGwgXCJjaHVua0lkc1wiIGFzIGxvYWRlZCBhbmQgZmlyZSBjYWxsYmFja1xuXHR2YXIgbW9kdWxlSWQsIGNodW5rSWQsIGkgPSAwO1xuXHRpZihjaHVua0lkcy5zb21lKChpZCkgPT4gKGluc3RhbGxlZENodW5rc1tpZF0gIT09IDApKSkge1xuXHRcdGZvcihtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xuXHRcdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcblx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYocnVudGltZSkgdmFyIHJlc3VsdCA9IHJ1bnRpbWUoX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cdH1cblx0aWYocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24pIHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKGRhdGEpO1xuXHRmb3IoO2kgPCBjaHVua0lkcy5sZW5ndGg7IGkrKykge1xuXHRcdGNodW5rSWQgPSBjaHVua0lkc1tpXTtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oaW5zdGFsbGVkQ2h1bmtzLCBjaHVua0lkKSAmJiBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pIHtcblx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXVswXSgpO1xuXHRcdH1cblx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPSAwO1xuXHR9XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLk8ocmVzdWx0KTtcbn1cblxudmFyIGNodW5rTG9hZGluZ0dsb2JhbCA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtzbm93ZWRfaW5cIl0gPSBzZWxmW1wid2VicGFja0NodW5rc25vd2VkX2luXCJdIHx8IFtdO1xuY2h1bmtMb2FkaW5nR2xvYmFsLmZvckVhY2god2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCAwKSk7XG5jaHVua0xvYWRpbmdHbG9iYWwucHVzaCA9IHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2guYmluZChjaHVua0xvYWRpbmdHbG9iYWwpKTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGRlcGVuZHMgb24gb3RoZXIgbG9hZGVkIGNodW5rcyBhbmQgZXhlY3V0aW9uIG5lZWQgdG8gYmUgZGVsYXllZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8odW5kZWZpbmVkLCBbXCJjb21tb25zLW1haW5cIl0sICgpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi93ZWJwYWdlL3NyYy9NYWluLnRzXCIpKSlcbl9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8oX193ZWJwYWNrX2V4cG9ydHNfXyk7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=