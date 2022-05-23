/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/client/Game.ts":
/*!****************************!*\
  !*** ./src/client/Game.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Game": () => (/* binding */ Game),
/* harmony export */   "game": () => (/* binding */ game)
/* harmony export */ });
/* harmony import */ var p5__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! p5 */ "./node_modules/p5/lib/p5.min.js");
/* harmony import */ var p5__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(p5__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _assets_Assets__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./assets/Assets */ "./src/client/assets/Assets.ts");
/* harmony import */ var _ui_screens_MainMenu__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ui/screens/MainMenu */ "./src/client/ui/screens/MainMenu.ts");
/* harmony import */ var socket_io_client__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! socket.io-client */ "./node_modules/socket.io-client/build/esm/index.js");
/* harmony import */ var _ui_screens_PauseMenu__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ui/screens/PauseMenu */ "./src/client/ui/screens/PauseMenu.ts");
/* harmony import */ var _NetManager__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./NetManager */ "./src/client/NetManager.ts");
/* harmony import */ var _world_WorldTiles__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./world/WorldTiles */ "./src/client/world/WorldTiles.ts");
/* harmony import */ var _input_Control__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./input/Control */ "./src/client/input/Control.ts");
/* harmony import */ var _world_particles_ColorParticle__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./world/particles/ColorParticle */ "./src/client/world/particles/ColorParticle.ts");
/* harmony import */ var _global_TileEntity__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../global/TileEntity */ "./src/global/TileEntity.ts");
/* harmony import */ var _world_entities_Cloud__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./world/entities/Cloud */ "./src/client/world/entities/Cloud.ts");







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
 */




class Game extends (p5__WEBPACK_IMPORTED_MODULE_0___default()) {
    constructor(connection) {
        super(() => { }); // To create a new instance of p5 it will call back with the instance. We don't need this since we are extending the class
        this.worldWidth = 512; // width of the world in tiles   <!> MAKE SURE THIS IS NEVER LESS THAN 64!!! <!>
        this.worldHeight = 256; // height of the world in tiles  <!> MAKE SURE THIS IS NEVER LESS THAN 64!!! <!>
        this.TILE_WIDTH = 8; // width of a tiles in pixels
        this.TILE_HEIGHT = 8; // height of a tiles in pixels
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
        this.pickedUpSlot = -1;
        this.worldMouseX = 0; // the mouse position in world coordinates
        this.worldMouseY = 0; // the mouse position in world coordinates
        this.lastCursorMove = Date.now();
        this.mouseOn = true; // is the mouse on the window?
        this.keys = [];
        this.userGesture = false;
        // the keycode for the key that does the action
        this.controls = [
            new _input_Control__WEBPACK_IMPORTED_MODULE_7__.Control('Walk Right', true, 68, () => {
                if (this.currentUi !== undefined)
                    return;
                this.world.player.rightButton = true;
            }, () => {
                if (this.currentUi !== undefined)
                    return;
                this.world.player.rightButton = false;
            }),
            new _input_Control__WEBPACK_IMPORTED_MODULE_7__.Control('Walk Left', true, 65, () => {
                if (this.currentUi !== undefined)
                    return;
                this.world.player.leftButton = true;
            }, () => {
                if (this.currentUi !== undefined)
                    return;
                this.world.player.leftButton = false;
            }),
            new _input_Control__WEBPACK_IMPORTED_MODULE_7__.Control('Jump', true, 87, () => {
                if (this.currentUi !== undefined)
                    return;
                this.world.player.jumpButton = true;
            }, () => {
                if (this.currentUi !== undefined)
                    return;
                this.world.player.jumpButton = false;
            }),
            new _input_Control__WEBPACK_IMPORTED_MODULE_7__.Control('Pause', true, 27, () => {
                //if inventory open{
                //close inventory
                //return;}
                if (this.currentUi === undefined)
                    this.currentUi = new _ui_screens_PauseMenu__WEBPACK_IMPORTED_MODULE_4__.PauseMenu(_assets_Assets__WEBPACK_IMPORTED_MODULE_1__.Fonts.title, _assets_Assets__WEBPACK_IMPORTED_MODULE_1__.Fonts.big);
                else
                    this.currentUi = undefined;
            }),
            new _input_Control__WEBPACK_IMPORTED_MODULE_7__.Control('Inventory', true, 69, () => {
                //if ui open return;
                //if inventory closed open inventory
                //else close inventory
                console.log('inventory has not been implemented yet');
            }),
            new _input_Control__WEBPACK_IMPORTED_MODULE_7__.Control('Hotbar 1', true, 49, () => {
                this.world.inventory.selectedSlot = 0;
            }),
            new _input_Control__WEBPACK_IMPORTED_MODULE_7__.Control('Hotbar 2', true, 50, () => {
                this.world.inventory.selectedSlot = 1;
            }),
            new _input_Control__WEBPACK_IMPORTED_MODULE_7__.Control('Hotbar 3', true, 51, () => {
                this.world.inventory.selectedSlot = 2;
            }),
            new _input_Control__WEBPACK_IMPORTED_MODULE_7__.Control('Hotbar 4', true, 52, () => {
                this.world.inventory.selectedSlot = 3;
            }),
            new _input_Control__WEBPACK_IMPORTED_MODULE_7__.Control('Hotbar 5', true, 53, () => {
                this.world.inventory.selectedSlot = 4;
            }),
            new _input_Control__WEBPACK_IMPORTED_MODULE_7__.Control('Hotbar 6', true, 54, () => {
                this.world.inventory.selectedSlot = 5;
            }),
            new _input_Control__WEBPACK_IMPORTED_MODULE_7__.Control('Hotbar 7', true, 55, () => {
                this.world.inventory.selectedSlot = 6;
            }),
            new _input_Control__WEBPACK_IMPORTED_MODULE_7__.Control('Hotbar 8', true, 56, () => {
                this.world.inventory.selectedSlot = 7;
            }),
            new _input_Control__WEBPACK_IMPORTED_MODULE_7__.Control('Hotbar 9', true, 57, () => {
                this.world.inventory.selectedSlot = 8;
            }),
            new _input_Control__WEBPACK_IMPORTED_MODULE_7__.Control('Hotbar 10', true, 48, () => {
                this.world.inventory.selectedSlot = 9;
            }),
            new _input_Control__WEBPACK_IMPORTED_MODULE_7__.Control('Hotbar 11', true, 189, () => {
                this.world.inventory.selectedSlot = 10;
            }),
            new _input_Control__WEBPACK_IMPORTED_MODULE_7__.Control('Hotbar 12', true, 187, () => {
                this.world.inventory.selectedSlot = 11;
            }), // hot bar 12
        ];
        this.breaking = true;
        this.brokenTilesQueue = [];
        this.connection = connection;
        // Initialise the network manager
        this.netManager = new _NetManager__WEBPACK_IMPORTED_MODULE_5__.NetManager(this);
    }
    preload() {
        console.log('Loading assets');
        (0,_assets_Assets__WEBPACK_IMPORTED_MODULE_1__.loadAssets)(this, _assets_Assets__WEBPACK_IMPORTED_MODULE_1__.UiAssets, _assets_Assets__WEBPACK_IMPORTED_MODULE_1__.ItemAssets, _assets_Assets__WEBPACK_IMPORTED_MODULE_1__.WorldAssets, _assets_Assets__WEBPACK_IMPORTED_MODULE_1__.Fonts, _assets_Assets__WEBPACK_IMPORTED_MODULE_1__.PlayerAnimations, _assets_Assets__WEBPACK_IMPORTED_MODULE_1__.AudioAssets);
        console.log('Asset loading completed');
        this.skyShader = this.loadShader('assets/shaders/basic.vert', 'assets/shaders/sky.frag');
    }
    setup() {
        console.log('setup called');
        // make a canvas that fills the whole screen (a canvas is what is drawn to in p5.js, as well as lots of other JS rendering libraries)
        this.canvas = this.createCanvas(this.windowWidth, this.windowHeight);
        this.canvas.mouseOut(this.mouseExited);
        this.canvas.mouseOver(this.mouseEntered);
        this.skyLayer = this.createGraphics(this.width, this.height, 'webgl');
        this.currentUi = new _ui_screens_MainMenu__WEBPACK_IMPORTED_MODULE_2__.MainMenu(_assets_Assets__WEBPACK_IMPORTED_MODULE_1__.Fonts.title, _assets_Assets__WEBPACK_IMPORTED_MODULE_1__.Fonts.big);
        // Tick
        setInterval(() => {
            if (this.world === undefined)
                return;
            this.world.tick(this);
        }, 1000 / this.netManager.playerTickRate);
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
        // AudioAnpssets.ambient.winter1.playSound();
        this.particleMultiplier = 1;
        this.skyToggle = true;
        this.skyMod = 2;
        this.particles = [];
        this.clouds = [];
        for (let i = 0; i < this.width / this.upscaleSize / 15; i++) {
            this.clouds.push(new _world_entities_Cloud__WEBPACK_IMPORTED_MODULE_10__.Cloud(Math.random() * this.width / this.upscaleSize / this.TILE_WIDTH, 2 / (0.03 + Math.random()) - 5));
        }
        console.log("there are " + this.clouds.length + " clouds");
        this.cursor("assets/textures/ui/cursor2.png");
    }
    draw() {
        if (this.frameCount === 2) {
            //has to be done on the second frame for some reason?
            this.skyShader.setUniform('screenDimensions', [
                (this.width / this.upscaleSize) * 2,
                (this.height / this.upscaleSize) * 2,
            ]);
            this.skyShader.setUniform('skyImage', _assets_Assets__WEBPACK_IMPORTED_MODULE_1__.WorldAssets.shaderResources.skyImage.image);
            // Object.values(PlayerAnimations).forEach(playerAnimation => {
            // 	playerAnimation.forEach(animationFrame => {
            // 		console.log("loading animation "+animationFrame[0].path)
            // 		animationFrame[0].loadReflection(this)
            // 	})
            // });
        }
        // do the tick calculations
        this.doTicks();
        // update mouse position
        this.updateMouse();
        if (this.mouseIsPressed && this.world != undefined) {
            this.world.inventory.worldClick(this.worldMouseX, this.worldMouseY);
        }
        // update the camera's interpolation
        this.moveCamera();
        // wipe the screen with a happy little layer of light blue
        this.skyShader.setUniform('offsetCoords', [
            this.interpolatedCamX,
            this.interpolatedCamY,
        ]);
        this.skyShader.setUniform('millis', this.millis());
        this.skyLayer.shader(this.skyShader);
        // this.fill(255, 0, 0);
        this.skyLayer.rect(0, 0, this.skyLayer.width, this.skyLayer.height);
        this.image(this.skyLayer, 0, 0, this.width, this.height);
        for (let cloud of this.clouds) {
            cloud.render(this, this.upscaleSize);
        }
        if (this.world !== undefined)
            this.world.render(this, this.upscaleSize);
        // render the player, all items, etc.
        //this.renderEntities();
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
        this.drawingContext.globalAlpha = 0.65 - Number(this.userGesture) / 20; //make image translucent
        _assets_Assets__WEBPACK_IMPORTED_MODULE_1__.UiAssets.vignette.render(this, 0, 0, this.width, this.height);
        this.drawingContext.globalAlpha = 1.0;
        this.noSmooth();
        // draw the hot bar
        if (this.world !== undefined) {
            for (let i = 0; i < this.world.inventory.width; i++) {
                const currentItem = this.world.inventory.items[i];
                _assets_Assets__WEBPACK_IMPORTED_MODULE_1__.UiAssets.ui_slot.render(this, 2 * this.upscaleSize + 16 * i * this.upscaleSize, 2 * this.upscaleSize, 16 * this.upscaleSize, 16 * this.upscaleSize);
                if (this.world.inventory.selectedSlot === i) {
                    _assets_Assets__WEBPACK_IMPORTED_MODULE_1__.UiAssets.ui_slot_selected.render(this, 2 * this.upscaleSize + 16 * i * this.upscaleSize, 2 * this.upscaleSize, 16 * this.upscaleSize, 16 * this.upscaleSize);
                }
                else {
                    _assets_Assets__WEBPACK_IMPORTED_MODULE_1__.UiAssets.ui_slot.render(this, 2 * this.upscaleSize + 16 * i * this.upscaleSize, 2 * this.upscaleSize, 16 * this.upscaleSize, 16 * this.upscaleSize);
                }
                if (currentItem !== undefined && currentItem !== null) {
                    this.fill(0);
                    if (this.pickedUpSlot === i) {
                        this.drawingContext.globalAlpha = 0.5;
                        this.fill(0, 127);
                    }
                    _assets_Assets__WEBPACK_IMPORTED_MODULE_1__.ItemAssets[currentItem.item].render(this, 6 * this.upscaleSize + 16 * i * this.upscaleSize, 6 * this.upscaleSize, 8 * this.upscaleSize, 8 * this.upscaleSize);
                    _assets_Assets__WEBPACK_IMPORTED_MODULE_1__.Fonts.tom_thumb.drawText(this, currentItem.quantity.toString(), (-4 * currentItem.quantity.toString().length + 16 * (i + 1.0625)) * this.upscaleSize, 11 * this.upscaleSize);
                    // this.text(
                    // 	currentItem.quantity,
                    // 	16 * this.upscaleSize + 16 * i * this.upscaleSize,
                    // 	16 * this.upscaleSize,
                    // );
                    this.drawingContext.globalAlpha = 1.0;
                }
            }
            // draw the cursor
            this.drawCursor();
        }
        if (this.currentUi !== undefined)
            this.currentUi.render(this, this.upscaleSize);
        _assets_Assets__WEBPACK_IMPORTED_MODULE_1__.Fonts.tom_thumb.drawText(this, "Snowed In v1.0.0", this.upscaleSize, this.height - 6 * this.upscaleSize);
        if (!this.userGesture)
            _assets_Assets__WEBPACK_IMPORTED_MODULE_1__.Fonts.title.drawText(this, "Click Anywhere To Unmute.", this.width / 2 - this.upscaleSize * 76, this.upscaleSize * 5 + Math.abs(Math.sin(this.millis() / 200)) * this.upscaleSize * 10);
        // console.timeEnd("frame");
    }
    windowResized() {
        let pUpscaleSize = this.upscaleSize;
        // go for a scale of <48 tiles screen
        this.upscaleSize = Math.min(Math.ceil(this.windowWidth / 48 / this.TILE_WIDTH), Math.ceil(this.windowHeight / 48 / this.TILE_HEIGHT));
        if (this.clouds != undefined && this.clouds.length > 0) { //stretch cloud locations so as to not create gaps
            for (let cloud of this.clouds) {
                cloud.x = this.interpolatedCamX + (cloud.x - this.interpolatedCamX) * this.windowWidth / this.width / this.upscaleSize * pUpscaleSize;
            }
        }
        this.resizeCanvas(this.windowWidth, this.windowHeight);
        this.skyLayer.resizeCanvas(this.windowWidth, this.windowHeight);
        this.skyShader.setUniform('screenDimensions', [
            (this.windowWidth / this.upscaleSize) * 2,
            (this.windowHeight / this.upscaleSize) * 2,
        ]);
        if (this.currentUi !== undefined)
            this.currentUi.windowUpdate();
    }
    keyPressed(event) {
        this.keys[this.keyCode] = true;
        for (let control of this.controls) {
            if (control.keyboard && control.keyCode === event.keyCode)
                //event.keyCode is deprecated but i don't care
                control.onPressed();
        }
        if (this.currentUi !== undefined &&
            this.currentUi.inputBoxes !== undefined) {
            for (let i of this.currentUi.inputBoxes) {
                if (i.listening) {
                    console.log('test3');
                    i.listening = false;
                    this.controls[i.index].keyCode = event.keyCode;
                    this.controls[i.index].keyboard = false;
                    i.value = event.keyCode;
                    i.keyboard = true;
                    i.image = _assets_Assets__WEBPACK_IMPORTED_MODULE_1__.UiAssets.button_unselected;
                }
            }
        }
    }
    keyReleased(event) {
        this.keys[this.keyCode] = false;
        for (let control of this.controls) {
            if (control.keyboard && control.keyCode === event.keyCode)
                //event.keyCode is deprecated but i don't care
                control.onReleased();
        }
    }
    // when it's dragged update the sliders
    mouseDragged() {
        if (this.currentUi !== undefined &&
            this.currentUi.sliders !== undefined) {
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
        if (!this.userGesture) {
            this.userGesture = true;
            this.startSounds();
        }
        // image(uiSlotImage, 2*upscaleSize+16*i*upscaleSize, 2*upscaleSize, 16*upscaleSize, 16*upscaleSize);
        if (this.currentUi !== undefined) {
            this.currentUi.mousePressed(e.button);
            return; // asjgsadkjfgIISUSUEUE
        }
        if (this.world === undefined)
            return;
        if (this.mouseX > 2 * this.upscaleSize &&
            this.mouseX <
                2 * this.upscaleSize +
                    16 * this.upscaleSize * this.world.inventory.width &&
            this.mouseY > 2 * this.upscaleSize &&
            this.mouseY < 18 * this.upscaleSize) {
            const clickedSlot = Math.floor((this.mouseX - 2 * this.upscaleSize) / 16 / this.upscaleSize);
            if (this.world.inventory.pickedUpSlot === undefined) {
                if (this.world.inventory.items[clickedSlot] !== undefined) {
                    this.world.inventory.pickedUpSlot = clickedSlot;
                }
            }
            else {
                // Swap clicked slot with the picked slot
                this.connection.emit('inventorySwap', this.world.inventory.pickedUpSlot, clickedSlot);
                // Set the picked up slot to nothing
                this.world.inventory.pickedUpSlot = undefined;
            }
        }
        else {
            this.world.inventory.worldClickCheck(this.worldMouseX, this.worldMouseY);
        }
    }
    mouseReleased() {
        /*
        if(this.currentUi !== undefined) {
            this.currentUi.mouseReleased();
        }
        const releasedSlot: number = Math.floor(
            (this.mouseX - 2 * this.upscaleSize) / 16 / this.upscaleSize
        );

        if (this.pickedUpSlot !== -1) {
            if (
                this.mouseX > 2 * this.upscaleSize &&
                this.mouseX <
                    2 * this.upscaleSize +
                        16 * this.upscaleSize * this.hotBar.length &&
                this.mouseY > 2 * this.upscaleSize &&
                this.mouseY < 18 * this.upscaleSize
            ) {
                // Make sure that the slot that the cursor was released was not the slot that was selected
                if (releasedSlot === this.pickedUpSlot) return;

                // Swap the picked up slot with the slot the mouse was released on
                [this.hotBar[this.pickedUpSlot], this.hotBar[releasedSlot]] = [
                    this.hotBar[releasedSlot],
                    this.hotBar[this.pickedUpSlot],
                ];

                this.pickedUpSlot = -1;
            } else {
                this.hotBar[this.pickedUpSlot] = undefined;
                this.pickedUpSlot = -1;
            }
        }

         */
    }
    mouseWheel(event) {
        if (this.currentUi !== undefined &&
            this.currentUi.scroll !== undefined) {
            this.currentUi.scroll += event.delta / 10;
            this.currentUi.scroll = this.constrain(this.currentUi.scroll, this.currentUi.minScroll, this.currentUi.maxScroll);
            console.log(`Scroll: ${this.currentUi.scroll}, Min: ${this.currentUi.minScroll}, Max: ${this.currentUi.maxScroll}`);
        }
        else {
            this.world.inventory.selectedSlot += Math.floor(event.delta / 100);
            this.world.inventory.selectedSlot = this.world.inventory.selectedSlot % this.world.inventory.width;
            if (this.world.inventory.selectedSlot < 0)
                this.world.inventory.selectedSlot += this.world.inventory.width;
            console.log(this.world.inventory.selectedSlot);
        }
    }
    moveCamera() {
        this.interpolatedCamX =
            this.pCamX +
                (this.camX - this.pCamX) * this.amountSinceLastTick +
                (this.noise(this.millis() / 200) - 0.5) * this.screenshakeAmount;
        this.interpolatedCamY =
            this.pCamY +
                (this.camY - this.pCamY) * this.amountSinceLastTick +
                (this.noise(0, this.millis() / 200) - 0.5) * this.screenshakeAmount;
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
        if (this.world !== undefined && this.world.tileEntities !== undefined) { //tile entity particles
            for (let i = 0; i < this.particleMultiplier; i++) {
                let k = Object.keys(this.world.tileEntities);
                let r = this.world.tileEntities[k[Math.floor(Math.random() * k.length)]];
                if (r.payload.type_ === _global_TileEntity__WEBPACK_IMPORTED_MODULE_9__.TileEntities.Tree) {
                    let t = r.coveredTiles[Math.floor(Math.random() * r.coveredTiles.length)];
                    this.particles.push(new _world_particles_ColorParticle__WEBPACK_IMPORTED_MODULE_8__.ColorParticle("#348965", Math.random() * 0.1 + 0.1, 20, t % this.world.width + Math.random(), Math.floor(t / this.world.width) + Math.random(), 0.1 * (Math.random() - 0.5), 0.06 * (Math.random() - 0.7), false));
                }
            }
        }
        for (let particle of this.particles) {
            particle.tick();
        }
        for (let cloud of this.clouds) {
            cloud.tick();
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
            this.worldHeight - this.height / this.upscaleSize / this.TILE_HEIGHT) {
            this.camY =
                this.worldHeight -
                    this.height / this.upscaleSize / this.TILE_HEIGHT;
        }
    }
    startSounds() {
        console.log("starting sounds has not been implemented yet.");
    }
    uiFrameRect(x, y, w, h) {
        // set the coords and dimensions to round to the nearest un-upscaled pixel
        x = Math.round(x / this.upscaleSize) * this.upscaleSize;
        y = Math.round(y / this.upscaleSize) * this.upscaleSize;
        w = Math.round(w / this.upscaleSize) * this.upscaleSize;
        h = Math.round(h / this.upscaleSize) * this.upscaleSize;
        // corners
        _assets_Assets__WEBPACK_IMPORTED_MODULE_1__.UiAssets.ui_frame.renderPartial(this, x, y, 7 * this.upscaleSize, 7 * this.upscaleSize, 0, 0, 7, 7);
        _assets_Assets__WEBPACK_IMPORTED_MODULE_1__.UiAssets.ui_frame.renderPartial(this, x + w - 7 * this.upscaleSize, y, 7 * this.upscaleSize, 7 * this.upscaleSize, 8, 0, 7, 7);
        _assets_Assets__WEBPACK_IMPORTED_MODULE_1__.UiAssets.ui_frame.renderPartial(this, x, y + h - 7 * this.upscaleSize, 7 * this.upscaleSize, 7 * this.upscaleSize, 0, 8, 7, 7);
        _assets_Assets__WEBPACK_IMPORTED_MODULE_1__.UiAssets.ui_frame.renderPartial(this, x + w - 7 * this.upscaleSize, y + h - 7 * this.upscaleSize, 7 * this.upscaleSize, 7 * this.upscaleSize, 8, 8, 7, 7);
        // top and bottom
        _assets_Assets__WEBPACK_IMPORTED_MODULE_1__.UiAssets.ui_frame.renderPartial(this, x + 7 * this.upscaleSize, y, w - 14 * this.upscaleSize, 7 * this.upscaleSize, 7, 0, 1, 7);
        _assets_Assets__WEBPACK_IMPORTED_MODULE_1__.UiAssets.ui_frame.renderPartial(this, x + 7 * this.upscaleSize, y + h - 7 * this.upscaleSize, w - 14 * this.upscaleSize, 7 * this.upscaleSize, 7, 8, 1, 7);
        // left and right
        _assets_Assets__WEBPACK_IMPORTED_MODULE_1__.UiAssets.ui_frame.renderPartial(this, x, y + 7 * this.upscaleSize, 7 * this.upscaleSize, h - 14 * this.upscaleSize, 0, 7, 7, 1);
        _assets_Assets__WEBPACK_IMPORTED_MODULE_1__.UiAssets.ui_frame.renderPartial(this, x + w - 7 * this.upscaleSize, y + 7 * this.upscaleSize, 7 * this.upscaleSize, h - 14 * this.upscaleSize, 8, 7, 7, 1);
        // center
        _assets_Assets__WEBPACK_IMPORTED_MODULE_1__.UiAssets.ui_frame.renderPartial(this, x + 7 * this.upscaleSize, y + 7 * this.upscaleSize, w - 14 * this.upscaleSize, h - 14 * this.upscaleSize, 7, 7, 1, 1);
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
    /*
    pickUpItem(itemStack: ItemStack): boolean {
        for (let i = 0; i < this.hotBar.length; i++) {
            const item = this.hotBar[i];

            // If there are no items in the current slot of the hotBar
            if (item === undefined) {
                this.hotBar[i] = itemStack;
                return true;
            }

            if (
                item === itemStack &&
                item.stackSize < item.maxStackSize
            ) {
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
        console.error(
            `Could not pickup ${itemStack.stackSize} ${itemStack.name}`
        );
        return false;
    }

     */
    mouseExited() {
        this.mouseOn = false;
    }
    mouseEntered() {
        this.mouseOn = true;
    }
    updateMouse() {
        if (Math.floor((this.interpolatedCamX * this.TILE_WIDTH +
            this.mouseX / this.upscaleSize) /
            this.TILE_WIDTH) !== this.worldMouseX ||
            Math.floor((this.interpolatedCamY * this.TILE_HEIGHT +
                this.mouseY / this.upscaleSize) /
                this.TILE_HEIGHT) !== this.worldMouseY) {
            this.lastCursorMove = Date.now();
        }
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
            // if (this.pickedUpSlot > -1) {
            //     this.hotbar[this.pickedUpSlot].texture.render(
            //         this,
            //         this.mouseX,
            //         this.mouseY,
            //         8 * this.upscaleSize,
            //         8 * this.upscaleSize
            //     );
            //     this.text(
            //         this.hotBar[this.pickedUpSlot].stackSize,
            //         this.mouseX + 10 * this.upscaleSize,
            //         this.mouseY + 10 * this.upscaleSize
            //     );
            // }
            _assets_Assets__WEBPACK_IMPORTED_MODULE_1__.UiAssets.selected_tile.render(this, Math.round((this.worldMouseX - this.interpolatedCamX) *
                this.TILE_WIDTH *
                this.upscaleSize), Math.round((this.worldMouseY - this.interpolatedCamY) *
                this.TILE_HEIGHT *
                this.upscaleSize), this.TILE_WIDTH * this.upscaleSize, this.TILE_HEIGHT * this.upscaleSize);
            if (Date.now() - this.lastCursorMove > 1000) {
                let selectedTile = this.world.worldTiles[this.world.width * this.worldMouseY + this.worldMouseX];
                if (typeof (selectedTile) === 'string') {
                    this.text("Tile entity: " + selectedTile, this.mouseX, this.mouseY); //JANKY ALERT
                }
                else if (_world_WorldTiles__WEBPACK_IMPORTED_MODULE_6__.WorldTiles[selectedTile] !== undefined) {
                    this.text((this.world.width * this.worldMouseY + this.worldMouseX) + ": " + _world_WorldTiles__WEBPACK_IMPORTED_MODULE_6__.WorldTiles[selectedTile].name, this.mouseX, this.mouseY); //JANKY ALERT
                }
            }
        }
    }
}
const connection = (0,socket_io_client__WEBPACK_IMPORTED_MODULE_3__.io)({
    auth: { token: window.localStorage.getItem('token') },
});
const game = new Game(connection);


/***/ }),

/***/ "./src/client/NetManager.ts":
/*!**********************************!*\
  !*** ./src/client/NetManager.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NetManager": () => (/* binding */ NetManager)
/* harmony export */ });
/* harmony import */ var _world_World__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./world/World */ "./src/client/world/World.ts");
/* harmony import */ var _world_entities_EntityClasses__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./world/entities/EntityClasses */ "./src/client/world/entities/EntityClasses.ts");
/* harmony import */ var _player_PlayerLocal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./player/PlayerLocal */ "./src/client/player/PlayerLocal.ts");
/* harmony import */ var _player_Inventory__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./player/Inventory */ "./src/client/player/Inventory.ts");
/* harmony import */ var _world_entities_TileEntity__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./world/entities/TileEntity */ "./src/client/world/entities/TileEntity.ts");
/* harmony import */ var _assets_Assets__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./assets/Assets */ "./src/client/assets/Assets.ts");
/* harmony import */ var _world_entities_PlayerEntity__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./world/entities/PlayerEntity */ "./src/client/world/entities/PlayerEntity.ts");








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
            this.game.connection.on('worldLoad', (width, height, tiles, tileEntities, entities, player, inventory) => {
                //console.log(entities);
                let id = player.id;
                console.log("player idddadsasdf: " + id);
                id = player.id.split("-").join(""); //string.prototype.replaceAll requires ES2021
                console.log("player idddadsasdf: " + id);
                let idNumber = (Number("0x" + id) / 100000000000000000000000000000) % 1; //get a number 0-1 pseudorandomly selected from the uuid of the player
                console.log("player idddadsasdf: " + idNumber);
                Object.entries(_assets_Assets__WEBPACK_IMPORTED_MODULE_5__.PlayerAnimations).forEach(element => {
                    for (let frame of element[1]) {
                        frame[0].redefineScarfColor((0,_world_entities_PlayerEntity__WEBPACK_IMPORTED_MODULE_6__.hslToRgb)(idNumber, 1, 0.45), (0,_world_entities_PlayerEntity__WEBPACK_IMPORTED_MODULE_6__.hslToRgb)(idNumber, 1, 0.3));
                    }
                });
                let tileEntities2 = {};
                tileEntities.forEach(tileEntity => {
                    console.log('adding tile entity: ' + tileEntity.id);
                    tileEntities2[tileEntity.id] = Object.assign(Object.assign({}, tileEntity), { id: tileEntity.id, coveredTiles: tileEntity.coveredTiles, reflectedTiles: tileEntity.reflectedTiles, animFrame: randint(0, _assets_Assets__WEBPACK_IMPORTED_MODULE_5__.WorldAssets.tileEntities[tileEntity.payload.type_].length - 1), animate: _world_entities_TileEntity__WEBPACK_IMPORTED_MODULE_4__.TileEntityAnimations[tileEntity.payload.type_] });
                });
                this.game.world = new _world_World__WEBPACK_IMPORTED_MODULE_0__.World(width, height, tiles, tileEntities2);
                this.game.world.inventory = new _player_Inventory__WEBPACK_IMPORTED_MODULE_3__.Inventory(inventory);
                this.game.world.player = new _player_PlayerLocal__WEBPACK_IMPORTED_MODULE_2__.PlayerLocal(player);
                this.game.world.player.color1 = (0,_world_entities_PlayerEntity__WEBPACK_IMPORTED_MODULE_6__.hslToRgb)(idNumber, 1, 0.45);
                this.game.world.player.color1 = (0,_world_entities_PlayerEntity__WEBPACK_IMPORTED_MODULE_6__.hslToRgb)(idNumber, 1, 0.3);
                entities.forEach(entity => {
                    this.game.world.entities[entity.id] = new _world_entities_EntityClasses__WEBPACK_IMPORTED_MODULE_1__.EntityClasses[entity.type](entity);
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
                updatedTiles.forEach(tile => {
                    const index = this.game.brokenTilesQueue.indexOf(tile.tileIndex);
                    if (index > -1) {
                        this.game.brokenTilesQueue.splice(index, 1); // 2nd parameter means remove one item only
                    }
                    this.game.world.updateTile(tile.tileIndex, tile.tile);
                });
            });
            this.game.connection.on('inventoryUpdate', updates => {
                // If the world is not set
                if (this.game.world === undefined)
                    return;
                updates.forEach(update => {
                    console.log(update);
                    this.game.world.inventory.items[update.slot] = update.item;
                });
            });
        }
        // Player events
        {
            this.game.connection.on('entityUpdate', entityData => {
                // If the world is not set
                if (this.game.world === undefined)
                    return;
                const entity = this.game.world.entities[entityData.id];
                if (entity === undefined)
                    return;
                entity.updateData(entityData);
            });
            this.game.connection.on('onPlayerAnimation', (animation, playerId) => {
                if (((((((this.game.world == undefined)))))))
                    return;
                let e = this.game.world.entities[playerId];
                if (e instanceof _world_entities_PlayerEntity__WEBPACK_IMPORTED_MODULE_6__.PlayerEntity && Object.keys(_assets_Assets__WEBPACK_IMPORTED_MODULE_5__.PlayerAnimations).includes(e.currentAnimation)) {
                    //@ts-expect-error
                    e.currentAnimation = animation;
                }
            });
            this.game.connection.on('entityCreate', entityData => {
                // If the world is not set
                if (this.game.world === undefined)
                    return;
                this.game.world.entities[entityData.id] = new _world_entities_EntityClasses__WEBPACK_IMPORTED_MODULE_1__.EntityClasses[entityData.type](entityData);
            });
            this.game.connection.on('entityDelete', id => {
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
function randint(x1, x2) {
    return Math.floor(x1 + Math.random() * (x2 + 1 - x1));
}


/***/ }),

/***/ "./src/client/assets/Assets.ts":
/*!*************************************!*\
  !*** ./src/client/assets/Assets.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PlayerAnimations": () => (/* binding */ PlayerAnimations),
/* harmony export */   "ItemAssets": () => (/* binding */ ItemAssets),
/* harmony export */   "UiAssets": () => (/* binding */ UiAssets),
/* harmony export */   "WorldAssets": () => (/* binding */ WorldAssets),
/* harmony export */   "Fonts": () => (/* binding */ Fonts),
/* harmony export */   "Keys": () => (/* binding */ Keys),
/* harmony export */   "AudioAssets": () => (/* binding */ AudioAssets),
/* harmony export */   "loadAssets": () => (/* binding */ loadAssets)
/* harmony export */ });
/* harmony import */ var _resources_TileResource__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./resources/TileResource */ "./src/client/assets/resources/TileResource.ts");
/* harmony import */ var _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./resources/ImageResource */ "./src/client/assets/resources/ImageResource.ts");
/* harmony import */ var _resources_FontResource__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./resources/FontResource */ "./src/client/assets/resources/FontResource.ts");
/* harmony import */ var _resources_AudioResourceGroup__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./resources/AudioResourceGroup */ "./src/client/assets/resources/AudioResourceGroup.ts");
/* harmony import */ var _resources_AudioResource__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./resources/AudioResource */ "./src/client/assets/resources/AudioResource.ts");
/* harmony import */ var _global_Inventory__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../global/Inventory */ "./src/global/Inventory.ts");
/* harmony import */ var _resources_ReflectedImageResource__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./resources/ReflectedImageResource */ "./src/client/assets/resources/ReflectedImageResource.ts");
/* harmony import */ var _resources_Resource__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./resources/Resource */ "./src/client/assets/resources/Resource.ts");








const playerAnimations = (data) => data;
const PlayerAnimations = playerAnimations({
    //image, milliseconds to display for
    idle: [
        [new _resources_ReflectedImageResource__WEBPACK_IMPORTED_MODULE_6__.ReflectableImageResource('assets/textures/player/snowmanidle1.png'), 135],
        [new _resources_ReflectedImageResource__WEBPACK_IMPORTED_MODULE_6__.ReflectableImageResource('assets/textures/player/snowmanidle2.png'), 135],
        [new _resources_ReflectedImageResource__WEBPACK_IMPORTED_MODULE_6__.ReflectableImageResource('assets/textures/player/snowmanidle3.png'), 135],
        [new _resources_ReflectedImageResource__WEBPACK_IMPORTED_MODULE_6__.ReflectableImageResource('assets/textures/player/snowmanidle4.png'), 135],
        [new _resources_ReflectedImageResource__WEBPACK_IMPORTED_MODULE_6__.ReflectableImageResource('assets/textures/player/snowmanidle5.png'), 135],
        [new _resources_ReflectedImageResource__WEBPACK_IMPORTED_MODULE_6__.ReflectableImageResource('assets/textures/player/snowmanidle6.png'), 135],
        [new _resources_ReflectedImageResource__WEBPACK_IMPORTED_MODULE_6__.ReflectableImageResource('assets/textures/player/snowmanidle7.png'), 135],
        [new _resources_ReflectedImageResource__WEBPACK_IMPORTED_MODULE_6__.ReflectableImageResource('assets/textures/player/snowmanidle8.png'), 135],
    ],
    idleleft: [
        [new _resources_ReflectedImageResource__WEBPACK_IMPORTED_MODULE_6__.ReflectableImageResource('assets/textures/player/snowmanidleflipped1.png'), 135],
        [new _resources_ReflectedImageResource__WEBPACK_IMPORTED_MODULE_6__.ReflectableImageResource('assets/textures/player/snowmanidleflipped2.png'), 135],
        [new _resources_ReflectedImageResource__WEBPACK_IMPORTED_MODULE_6__.ReflectableImageResource('assets/textures/player/snowmanidleflipped3.png'), 135],
        [new _resources_ReflectedImageResource__WEBPACK_IMPORTED_MODULE_6__.ReflectableImageResource('assets/textures/player/snowmanidleflipped4.png'), 135],
        [new _resources_ReflectedImageResource__WEBPACK_IMPORTED_MODULE_6__.ReflectableImageResource('assets/textures/player/snowmanidleflipped5.png'), 135],
        [new _resources_ReflectedImageResource__WEBPACK_IMPORTED_MODULE_6__.ReflectableImageResource('assets/textures/player/snowmanidleflipped6.png'), 135],
        [new _resources_ReflectedImageResource__WEBPACK_IMPORTED_MODULE_6__.ReflectableImageResource('assets/textures/player/snowmanidleflipped7.png'), 135],
        [new _resources_ReflectedImageResource__WEBPACK_IMPORTED_MODULE_6__.ReflectableImageResource('assets/textures/player/snowmanidleflipped8.png'), 135],
    ],
    walk: [
        [new _resources_ReflectedImageResource__WEBPACK_IMPORTED_MODULE_6__.ReflectableImageResource('assets/textures/player/snowmanroll01.png'), 75],
        [new _resources_ReflectedImageResource__WEBPACK_IMPORTED_MODULE_6__.ReflectableImageResource('assets/textures/player/snowmanroll02.png'), 75],
        [new _resources_ReflectedImageResource__WEBPACK_IMPORTED_MODULE_6__.ReflectableImageResource('assets/textures/player/snowmanroll03.png'), 75],
        [new _resources_ReflectedImageResource__WEBPACK_IMPORTED_MODULE_6__.ReflectableImageResource('assets/textures/player/snowmanroll04.png'), 75],
        [new _resources_ReflectedImageResource__WEBPACK_IMPORTED_MODULE_6__.ReflectableImageResource('assets/textures/player/snowmanroll05.png'), 75],
        [new _resources_ReflectedImageResource__WEBPACK_IMPORTED_MODULE_6__.ReflectableImageResource('assets/textures/player/snowmanroll06.png'), 75],
        [new _resources_ReflectedImageResource__WEBPACK_IMPORTED_MODULE_6__.ReflectableImageResource('assets/textures/player/snowmanroll07.png'), 75],
        [new _resources_ReflectedImageResource__WEBPACK_IMPORTED_MODULE_6__.ReflectableImageResource('assets/textures/player/snowmanroll08.png'), 75],
    ],
    walkleft: [
        [new _resources_ReflectedImageResource__WEBPACK_IMPORTED_MODULE_6__.ReflectableImageResource('assets/textures/player/snowmanrollleft01.png'), 75],
        [new _resources_ReflectedImageResource__WEBPACK_IMPORTED_MODULE_6__.ReflectableImageResource('assets/textures/player/snowmanrollleft02.png'), 75],
        [new _resources_ReflectedImageResource__WEBPACK_IMPORTED_MODULE_6__.ReflectableImageResource('assets/textures/player/snowmanrollleft03.png'), 75],
        [new _resources_ReflectedImageResource__WEBPACK_IMPORTED_MODULE_6__.ReflectableImageResource('assets/textures/player/snowmanrollleft04.png'), 75],
        [new _resources_ReflectedImageResource__WEBPACK_IMPORTED_MODULE_6__.ReflectableImageResource('assets/textures/player/snowmanrollleft05.png'), 75],
        [new _resources_ReflectedImageResource__WEBPACK_IMPORTED_MODULE_6__.ReflectableImageResource('assets/textures/player/snowmanrollleft06.png'), 75],
        [new _resources_ReflectedImageResource__WEBPACK_IMPORTED_MODULE_6__.ReflectableImageResource('assets/textures/player/snowmanrollleft07.png'), 75],
        [new _resources_ReflectedImageResource__WEBPACK_IMPORTED_MODULE_6__.ReflectableImageResource('assets/textures/player/snowmanrollleft08.png'), 75],
    ],
});
// Item related assets
const ItemAssets = {
    [_global_Inventory__WEBPACK_IMPORTED_MODULE_5__.ItemType.SnowBlock]: new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/items/block_snow.png'),
    [_global_Inventory__WEBPACK_IMPORTED_MODULE_5__.ItemType.IceBlock]: new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/items/block_ice.png'),
    [_global_Inventory__WEBPACK_IMPORTED_MODULE_5__.ItemType.DirtBlock]: new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/items/block_dirt.png'),
    [_global_Inventory__WEBPACK_IMPORTED_MODULE_5__.ItemType.Stone0Block]: new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/items/block_stone0.png'),
    [_global_Inventory__WEBPACK_IMPORTED_MODULE_5__.ItemType.Stone1Block]: new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/items/block_stone1.png'),
    [_global_Inventory__WEBPACK_IMPORTED_MODULE_5__.ItemType.Stone2Block]: new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/items/block_stone2.png'),
    [_global_Inventory__WEBPACK_IMPORTED_MODULE_5__.ItemType.Stone3Block]: new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/items/block_stone3.png'),
    [_global_Inventory__WEBPACK_IMPORTED_MODULE_5__.ItemType.Stone4Block]: new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/items/block_stone4.png'),
    [_global_Inventory__WEBPACK_IMPORTED_MODULE_5__.ItemType.Stone5Block]: new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/items/block_stone5.png'),
    [_global_Inventory__WEBPACK_IMPORTED_MODULE_5__.ItemType.Stone6Block]: new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/items/block_stone6.png'),
    [_global_Inventory__WEBPACK_IMPORTED_MODULE_5__.ItemType.Stone7Block]: new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/items/block_stone7.png'),
    [_global_Inventory__WEBPACK_IMPORTED_MODULE_5__.ItemType.Stone8Block]: new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/items/block_stone8.png'),
    [_global_Inventory__WEBPACK_IMPORTED_MODULE_5__.ItemType.Stone9Block]: new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/items/block_stone9.png'),
    [_global_Inventory__WEBPACK_IMPORTED_MODULE_5__.ItemType.TinBlock]: new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/items/block_tin.png'),
    [_global_Inventory__WEBPACK_IMPORTED_MODULE_5__.ItemType.AluminumBlock]: new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/items/block_aluminum.png'),
    [_global_Inventory__WEBPACK_IMPORTED_MODULE_5__.ItemType.GoldBlock]: new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/items/block_gold.png'),
    [_global_Inventory__WEBPACK_IMPORTED_MODULE_5__.ItemType.TitaniumBlock]: new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/items/block_titanium.png'),
    [_global_Inventory__WEBPACK_IMPORTED_MODULE_5__.ItemType.GrapeBlock]: new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/items/block_grape.png'),
    [_global_Inventory__WEBPACK_IMPORTED_MODULE_5__.ItemType.Wood0Block]: new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/items/block_wood0.png'),
    [_global_Inventory__WEBPACK_IMPORTED_MODULE_5__.ItemType.Wood1Block]: new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/items/block_wood1.png'),
    [_global_Inventory__WEBPACK_IMPORTED_MODULE_5__.ItemType.Wood2Block]: new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/items/block_wood2.png'),
    [_global_Inventory__WEBPACK_IMPORTED_MODULE_5__.ItemType.Wood3Block]: new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/items/block_wood3.png'),
    [_global_Inventory__WEBPACK_IMPORTED_MODULE_5__.ItemType.Wood4Block]: new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/items/block_wood4.png'),
    [_global_Inventory__WEBPACK_IMPORTED_MODULE_5__.ItemType.Wood5Block]: new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/items/block_wood5.png'),
    [_global_Inventory__WEBPACK_IMPORTED_MODULE_5__.ItemType.Wood6Block]: new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/items/block_wood6.png'),
    [_global_Inventory__WEBPACK_IMPORTED_MODULE_5__.ItemType.Wood7Block]: new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/items/block_wood7.png'),
    [_global_Inventory__WEBPACK_IMPORTED_MODULE_5__.ItemType.Wood8Block]: new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/items/block_wood8.png'),
    [_global_Inventory__WEBPACK_IMPORTED_MODULE_5__.ItemType.Wood9Block]: new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/items/block_wood9.png'),
    [_global_Inventory__WEBPACK_IMPORTED_MODULE_5__.ItemType.Seed]: new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/items/seed.png'),
};
// Ui related assets
const UiAssets = {
    ui_slot_selected: new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/ui/uislot_selected.png'),
    ui_slot: new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/ui/uislot.png'),
    ui_frame: new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/ui/uiframe.png'),
    button_unselected: new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/ui/button0.png'),
    button_selected: new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/ui/button1.png'),
    slider_bar: new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/ui/sliderBar.png'),
    slider_handle: new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/ui/sliderHandle.png'),
    title_image: new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/ui/snowedinBUMP.png'),
    vignette: new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/ui/vignette-export.png'),
    selected_tile: new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/ui/selectedtile.png'),
};
// World related assets
const WorldAssets = {
    shaderResources: {
        skyImage: new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/shader_resources/poissonsnow.png'),
    },
    middleground: {
        tileset_ice: new _resources_TileResource__WEBPACK_IMPORTED_MODULE_0__.TileResource('assets/textures/world/middleground/tileset_ice.png', 16, 1, 8, 8),
        tileset_snow: new _resources_TileResource__WEBPACK_IMPORTED_MODULE_0__.TileResource('assets/textures/world/middleground/tileset_snow.png', 16, 1, 8, 8),
        tileset_dirt: new _resources_TileResource__WEBPACK_IMPORTED_MODULE_0__.TileResource('assets/textures/world/middleground/tileset_dirt0.png', 16, 1, 8, 8),
        tileset_stone0: new _resources_TileResource__WEBPACK_IMPORTED_MODULE_0__.TileResource('assets/textures/world/middleground/tileset_stone0.png', 16, 1, 8, 8),
        tileset_stone1: new _resources_TileResource__WEBPACK_IMPORTED_MODULE_0__.TileResource('assets/textures/world/middleground/tileset_stone1.png', 16, 1, 8, 8),
        tileset_stone2: new _resources_TileResource__WEBPACK_IMPORTED_MODULE_0__.TileResource('assets/textures/world/middleground/tileset_stone2.png', 16, 1, 8, 8),
        tileset_stone3: new _resources_TileResource__WEBPACK_IMPORTED_MODULE_0__.TileResource('assets/textures/world/middleground/tileset_stone3.png', 16, 1, 8, 8),
        tileset_stone4: new _resources_TileResource__WEBPACK_IMPORTED_MODULE_0__.TileResource('assets/textures/world/middleground/tileset_stone4.png', 16, 1, 8, 8),
        tileset_stone5: new _resources_TileResource__WEBPACK_IMPORTED_MODULE_0__.TileResource('assets/textures/world/middleground/tileset_stone5.png', 16, 1, 8, 8),
        tileset_stone6: new _resources_TileResource__WEBPACK_IMPORTED_MODULE_0__.TileResource('assets/textures/world/middleground/tileset_stone6.png', 16, 1, 8, 8),
        tileset_stone7: new _resources_TileResource__WEBPACK_IMPORTED_MODULE_0__.TileResource('assets/textures/world/middleground/tileset_stone7.png', 16, 1, 8, 8),
        tileset_stone8: new _resources_TileResource__WEBPACK_IMPORTED_MODULE_0__.TileResource('assets/textures/world/middleground/tileset_stone8.png', 16, 1, 8, 8),
        tileset_stone9: new _resources_TileResource__WEBPACK_IMPORTED_MODULE_0__.TileResource('assets/textures/world/middleground/tileset_stone9.png', 16, 1, 8, 8),
        tileset_tin: new _resources_TileResource__WEBPACK_IMPORTED_MODULE_0__.TileResource('assets/textures/world/middleground/tileset_tin.png', 16, 1, 8, 8),
        tileset_aluminum: new _resources_TileResource__WEBPACK_IMPORTED_MODULE_0__.TileResource('assets/textures/world/middleground/tileset_aluminum.png', 16, 1, 8, 8),
        tileset_gold: new _resources_TileResource__WEBPACK_IMPORTED_MODULE_0__.TileResource('assets/textures/world/middleground/tileset_gold.png', 16, 1, 8, 8),
        tileset_titanium: new _resources_TileResource__WEBPACK_IMPORTED_MODULE_0__.TileResource('assets/textures/world/middleground/tileset_titanium.png', 16, 1, 8, 8),
        tileset_grape: new _resources_TileResource__WEBPACK_IMPORTED_MODULE_0__.TileResource('assets/textures/world/middleground/tileset_grape.png', 16, 1, 8, 8),
        tileset_wood0: new _resources_TileResource__WEBPACK_IMPORTED_MODULE_0__.TileResource('assets/textures/world/middleground/tileset_wood0.png', 16, 1, 8, 8),
        tileset_wood1: new _resources_TileResource__WEBPACK_IMPORTED_MODULE_0__.TileResource('assets/textures/world/middleground/tileset_wood1.png', 16, 1, 8, 8),
        tileset_wood2: new _resources_TileResource__WEBPACK_IMPORTED_MODULE_0__.TileResource('assets/textures/world/middleground/tileset_wood2.png', 16, 1, 8, 8),
        tileset_wood3: new _resources_TileResource__WEBPACK_IMPORTED_MODULE_0__.TileResource('assets/textures/world/middleground/tileset_wood3.png', 16, 1, 8, 8),
        tileset_wood4: new _resources_TileResource__WEBPACK_IMPORTED_MODULE_0__.TileResource('assets/textures/world/middleground/tileset_wood4.png', 16, 1, 8, 8),
        tileset_wood5: new _resources_TileResource__WEBPACK_IMPORTED_MODULE_0__.TileResource('assets/textures/world/middleground/tileset_wood5.png', 16, 1, 8, 8),
        tileset_wood6: new _resources_TileResource__WEBPACK_IMPORTED_MODULE_0__.TileResource('assets/textures/world/middleground/tileset_wood6.png', 16, 1, 8, 8),
        tileset_wood7: new _resources_TileResource__WEBPACK_IMPORTED_MODULE_0__.TileResource('assets/textures/world/middleground/tileset_wood7.png', 16, 1, 8, 8),
        tileset_wood8: new _resources_TileResource__WEBPACK_IMPORTED_MODULE_0__.TileResource('assets/textures/world/middleground/tileset_wood8.png', 16, 1, 8, 8),
        tileset_wood9: new _resources_TileResource__WEBPACK_IMPORTED_MODULE_0__.TileResource('assets/textures/world/middleground/tileset_wood9.png', 16, 1, 8, 8),
    },
    foreground: {},
    tileEntities: [
        [
            new _resources_ReflectedImageResource__WEBPACK_IMPORTED_MODULE_6__.ReflectableImageResource('assets/textures/world/tileEntities/trees/Tree1.png'),
            new _resources_ReflectedImageResource__WEBPACK_IMPORTED_MODULE_6__.ReflectableImageResource('assets/textures/world/tileEntities/trees/Tree2.png'),
            new _resources_ReflectedImageResource__WEBPACK_IMPORTED_MODULE_6__.ReflectableImageResource('assets/textures/world/tileEntities/trees/Tree3.png'),
            new _resources_ReflectedImageResource__WEBPACK_IMPORTED_MODULE_6__.ReflectableImageResource('assets/textures/world/tileEntities/trees/Tree4.png'),
            new _resources_ReflectedImageResource__WEBPACK_IMPORTED_MODULE_6__.ReflectableImageResource('assets/textures/world/tileEntities/trees/Tree5.png'),
            new _resources_ReflectedImageResource__WEBPACK_IMPORTED_MODULE_6__.ReflectableImageResource('assets/textures/world/tileEntities/trees/Tree6.png'),
            new _resources_ReflectedImageResource__WEBPACK_IMPORTED_MODULE_6__.ReflectableImageResource('assets/textures/world/tileEntities/trees/Tree7.png'),
            new _resources_ReflectedImageResource__WEBPACK_IMPORTED_MODULE_6__.ReflectableImageResource('assets/textures/world/tileEntities/trees/Tree8.png'),
            new _resources_ReflectedImageResource__WEBPACK_IMPORTED_MODULE_6__.ReflectableImageResource('assets/textures/world/tileEntities/trees/Tree9.png'),
            new _resources_ReflectedImageResource__WEBPACK_IMPORTED_MODULE_6__.ReflectableImageResource('assets/textures/world/tileEntities/trees/Tree10.png'),
        ],
        [
            new _resources_ReflectedImageResource__WEBPACK_IMPORTED_MODULE_6__.ReflectableImageResource('assets/textures/world/tileEntities/Rusty Drill/RustyDrill1.png'),
            new _resources_ReflectedImageResource__WEBPACK_IMPORTED_MODULE_6__.ReflectableImageResource('assets/textures/world/tileEntities/Rusty Drill/RustyDrill2.png'),
            new _resources_ReflectedImageResource__WEBPACK_IMPORTED_MODULE_6__.ReflectableImageResource('assets/textures/world/tileEntities/Rusty Drill/RustyDrill3.png'),
            new _resources_ReflectedImageResource__WEBPACK_IMPORTED_MODULE_6__.ReflectableImageResource('assets/textures/world/tileEntities/Rusty Drill/RustyDrill4.png'),
            new _resources_ReflectedImageResource__WEBPACK_IMPORTED_MODULE_6__.ReflectableImageResource('assets/textures/world/tileEntities/Rusty Drill/RustyDrill5.png'),
            new _resources_ReflectedImageResource__WEBPACK_IMPORTED_MODULE_6__.ReflectableImageResource('assets/textures/world/tileEntities/Rusty Drill/RustyDrill6.png'),
            new _resources_ReflectedImageResource__WEBPACK_IMPORTED_MODULE_6__.ReflectableImageResource('assets/textures/world/tileEntities/Rusty Drill/RustyDrill7.png'),
            new _resources_ReflectedImageResource__WEBPACK_IMPORTED_MODULE_6__.ReflectableImageResource('assets/textures/world/tileEntities/Rusty Drill/RustyDrill8.png'),
            new _resources_ReflectedImageResource__WEBPACK_IMPORTED_MODULE_6__.ReflectableImageResource('assets/textures/world/tileEntities/Rusty Drill/RustyDrill9.png'),
            new _resources_ReflectedImageResource__WEBPACK_IMPORTED_MODULE_6__.ReflectableImageResource('assets/textures/world/tileEntities/Rusty Drill/RustyDrill10.png'),
            new _resources_ReflectedImageResource__WEBPACK_IMPORTED_MODULE_6__.ReflectableImageResource('assets/textures/world/tileEntities/Rusty Drill/RustyDrill11.png'),
            new _resources_ReflectedImageResource__WEBPACK_IMPORTED_MODULE_6__.ReflectableImageResource('assets/textures/world/tileEntities/Rusty Drill/RustyDrill12.png'),
            new _resources_ReflectedImageResource__WEBPACK_IMPORTED_MODULE_6__.ReflectableImageResource('assets/textures/world/tileEntities/Rusty Drill/RustyDrill13.png'),
        ],
        [ //drill tier 2
        ],
        [ //drill tier 3
        ],
        [ //drill tier 4
        ],
        [ //drill tier 5
        ],
        [
            new _resources_ReflectedImageResource__WEBPACK_IMPORTED_MODULE_6__.ReflectableImageResource('assets/textures/world/tileEntities/misc/craftingBench.png'),
        ],
        [
            new _resources_ReflectedImageResource__WEBPACK_IMPORTED_MODULE_6__.ReflectableImageResource('assets/textures/world/tileEntities/trees/sapling.png'),
        ]
    ],
    entities: [
        [
            new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/world/entities/Small Drone/SmallDrone01.png'),
            new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/world/entities/Small Drone/SmallDrone02.png'),
            new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/world/entities/Small Drone/SmallDrone03.png'),
            new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/world/entities/Small Drone/SmallDrone04.png'),
            new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/world/entities/Small Drone/SmallDrone05.png'),
            new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/world/entities/Small Drone/SmallDrone06.png'),
            new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/world/entities/Small Drone/SmallDrone07.png'),
            new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/world/entities/Small Drone/SmallDrone08.png'),
            new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/world/entities/Small Drone/SmallDrone09.png'),
            new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/world/entities/Small Drone/SmallDrone10.png'),
            new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/world/entities/Small Drone/SmallDrone11.png'),
            new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/world/entities/Small Drone/SmallDrone12.png'),
            new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/world/entities/Small Drone/SmallDrone13.png'),
            new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/world/entities/Small Drone/SmallDrone14.png'),
            new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/world/entities/Small Drone/SmallDrone15.png'),
            new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/world/entities/Small Drone/SmallDrone16.png'),
            new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/world/entities/Small Drone/SmallDrone17.png'),
            new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/world/entities/Small Drone/SmallDrone18.png'),
            new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/world/entities/Small Drone/SmallDrone19.png'),
            new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/world/entities/Small Drone/SmallDrone20.png'),
        ],
    ],
    clouds: [
        new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/world/entities/Clouds/cloud1.png'),
        new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/world/entities/Clouds/cloud2.png'),
        new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/world/entities/Clouds/cloud3.png'),
        new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/world/entities/Clouds/cloud4.png'),
        new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/world/entities/Clouds/cloud5.png'),
    ]
};
const Fonts = {
    title: new _resources_FontResource__WEBPACK_IMPORTED_MODULE_2__.FontResource('assets/textures/ui/font.png', {
        '0': 7,
        '1': 7,
        '2': 7,
        '3': 6,
        '4': 6,
        '5': 6,
        '6': 6,
        '7': 7,
        '8': 7,
        '9': 6,
        'A': 6,
        'B': 7,
        'C': 7,
        'D': 6,
        'E': 7,
        'F': 6,
        'G': 7,
        'H': 7,
        'I': 7,
        'J': 8,
        'K': 6,
        'L': 6,
        'M': 8,
        'N': 8,
        'O': 8,
        'P': 9,
        'Q': 8,
        'R': 7,
        'S': 7,
        'T': 8,
        'U': 8,
        'V': 8,
        'W': 10,
        'X': 8,
        'Y': 8,
        'Z': 9,
        'a': 7,
        'b': 7,
        'c': 6,
        'd': 7,
        'e': 6,
        'f': 6,
        'g': 6,
        'h': 6,
        'i': 5,
        'j': 6,
        'k': 5,
        'l': 5,
        'm': 8,
        'n': 5,
        'o': 5,
        'p': 5,
        'q': 7,
        'r': 5,
        's': 4,
        't': 5,
        'u': 5,
        'v': 5,
        'w': 7,
        'x': 6,
        'y': 5,
        'z': 5,
        '!': 4,
        '.': 2,
        ',': 2,
        '?': 6,
        '_': 6,
        '-': 4,
        ':': 2,
        '↑': 7,
        '↓': 7,
        ' ': 2,
    }, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!.,?_-:↑↓ ', 12),
    big: new _resources_FontResource__WEBPACK_IMPORTED_MODULE_2__.FontResource('assets/textures/ui/fontBig.png', {
        '0': 15,
        '1': 14,
        '2': 14,
        '3': 13,
        '4': 12,
        '5': 13,
        '6': 12,
        '7': 14,
        '8': 15,
        '9': 12,
        'A': 13,
        'B': 14,
        'C': 15,
        'D': 12,
        'E': 14,
        'F': 13,
        'G': 14,
        'H': 15,
        'I': 15,
        'J': 16,
        'K': 12,
        'L': 13,
        'M': 16,
        'N': 17,
        'O': 17,
        'P': 19,
        'Q': 17,
        'R': 14,
        'S': 15,
        'T': 17,
        'U': 16,
        'V': 17,
        'W': 21,
        'X': 17,
        'Y': 17,
        'Z': 19,
        'a': 12,
        'b': 15,
        'c': 12,
        'd': 15,
        'e': 13,
        'f': 12,
        'g': 13,
        'h': 12,
        'i': 11,
        'j': 12,
        'k': 10,
        'l': 10,
        'm': 16,
        'n': 11,
        'o': 10,
        'p': 11,
        'q': 14,
        'r': 11,
        's': 8,
        't': 11,
        'u': 10,
        'v': 11,
        'w': 15,
        'x': 12,
        'y': 11,
        'z': 10,
        '!': 9,
        '.': 4,
        ',': 4,
        '?': 13,
        '_': 13,
        '-': 8,
        ':': 4,
        ' ': 4,
    }, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!.,?_-: ', 24),
    tom_thumb: new _resources_FontResource__WEBPACK_IMPORTED_MODULE_2__.FontResource('assets/textures/ui/tom_thumb.png', {
        'A': 3,
        'B': 3,
        'C': 3,
        'D': 3,
        'E': 3,
        'F': 3,
        'G': 3,
        'H': 3,
        'I': 3,
        'J': 3,
        'K': 3,
        'L': 3,
        'M': 3,
        'N': 3,
        'O': 3,
        'P': 3,
        'Q': 3,
        'R': 3,
        'S': 3,
        'T': 3,
        'U': 3,
        'V': 3,
        'W': 3,
        'X': 3,
        'Y': 3,
        'Z': 3,
        'a': 3,
        'b': 3,
        'c': 3,
        'd': 3,
        'e': 3,
        'f': 3,
        'g': 3,
        'h': 3,
        'i': 3,
        'j': 3,
        'k': 3,
        'l': 3,
        'm': 3,
        'n': 3,
        'o': 3,
        'p': 3,
        'q': 3,
        'r': 3,
        's': 3,
        't': 3,
        'u': 3,
        'v': 3,
        'w': 3,
        'x': 3,
        'y': 3,
        'z': 3,
        '[': 3,
        '\\': 3,
        ']': 3,
        '^': 3,
        ' ': 3,
        '!': 3,
        '"': 3,
        '#': 3,
        '$': 3,
        '%': 3,
        '&': 3,
        "'": 3,
        '(': 3,
        ')': 3,
        '*': 3,
        '+': 3,
        ',': 3,
        '-': 3,
        '.': 3,
        '/': 3,
        '0': 3,
        '1': 3,
        '2': 3,
        '3': 3,
        '4': 3,
        '5': 3,
        '6': 3,
        '7': 3,
        '8': 3,
        '9': 3,
        ':': 3,
        ';': 3,
        '<': 3,
        '=': 3,
        '>': 3,
        '?': 3,
        '_': 3,
    }, `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz[\\]^ !"#$%&'()*+,-./0123456789:;<=>?_`, 5),
};
const Keys = {
    keyboardMap: [
        '',
        '',
        '',
        'CANCEL',
        '',
        '',
        'HELP',
        '',
        'BACKSPACE',
        'TAB',
        '',
        '',
        'CLEAR',
        'ENTER',
        'ENTER SPECIAL',
        '',
        'SHIFT',
        'CONTROL',
        'ALT',
        'PAUSE',
        'CAPS LOCK',
        'KANA',
        'EISU',
        'JUNJA',
        'FINAL',
        'HANJA',
        '',
        'ESCAPE',
        'CONVERT',
        'NONCONVERT',
        'ACCEPT',
        'MODECHANGE',
        'SPACE',
        'PAGE UP',
        'PAGE DOWN',
        'END',
        'HOME',
        'LEFT',
        'UP',
        'RIGHT',
        'DOWN',
        'SELECT',
        'PRINT',
        'EXECUTE',
        'PRINT SCREEN',
        'INSERT',
        'DELETE',
        '',
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        'COLON',
        'SEMICOLON',
        'LESS THAN',
        'EQUALS',
        'GREATER THAN',
        'QUESTION MARK',
        'AT',
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z',
        'OS KEY',
        '',
        'CONTEXT MENU',
        '',
        'SLEEP',
        'NUMPAD0',
        'NUMPAD1',
        'NUMPAD2',
        'NUMPAD3',
        'NUMPAD4',
        'NUMPAD5',
        'NUMPAD6',
        'NUMPAD7',
        'NUMPAD8',
        'NUMPAD9',
        'MULTIPLY',
        'ADD',
        'SEPARATOR',
        'SUBTRACT',
        'DECIMAL',
        'DIVIDE',
        'F1',
        'F2',
        'F3',
        'F4',
        'F5',
        'F6',
        'F7',
        'F8',
        'F9',
        'F10',
        'F11',
        'F12',
        'F13',
        'F14',
        'F15',
        'F16',
        'F17',
        'F18',
        'F19',
        'F20',
        'F21',
        'F22',
        'F23',
        'F24',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        'NUM LOCK',
        'SCROLL LOCK',
        'WIN OEM FJ JISHO',
        'WIN OEM FJ MASSHOU',
        'WIN OEM FJ TOUROKU',
        'WIN OEM FJ LOYA',
        'WIN OEM FJ ROYA',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        'CIRCUMFLEX',
        'EXCLAMATION',
        'DOUBLE_QUOTE',
        'HASH',
        'DOLLAR',
        'PERCENT',
        'AMPERSAND',
        'UNDERSCORE',
        'OPEN PARENTHESIS',
        'CLOSE PARENTHESIS',
        'ASTERISK',
        'PLUS',
        'PIPE',
        'HYPHEN',
        'OPEN CURLY BRACKET',
        'CLOSE CURLY BRACKET',
        'TILDE',
        '',
        '',
        '',
        '',
        'VOLUME MUTE',
        'VOLUME DOWN',
        'VOLUME UP',
        '',
        '',
        'SEMICOLON',
        'EQUALS',
        'COMMA',
        'MINUS',
        'PERIOD',
        'SLASH',
        'BACK QUOTE',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        'OPEN BRACKET',
        'BACK SLASH',
        'CLOSE BRACKET',
        'QUOTE',
        '',
        'META',
        'ALT GRAPH',
        '',
        'WIN ICO HELP',
        'WIN ICO 00',
        '',
        'WIN ICO CLEAR',
        '',
        '',
        'WIN OEM RESET',
        'WIN OEM JUMP',
        'WIN OEM PA1',
        'WIN OEM PA2',
        'WIN OEM PA3',
        'WIN OEM WSCTRL',
        'WIN OEM CUSEL',
        'WIN OEM ATTN',
        'WIN OEM FINISH',
        'WIN OEM COPY',
        'WIN OEM AUTO',
        'WIN OEM ENLW',
        'WIN OEM BACKTAB',
        'ATTN',
        'CRSEL',
        'EXSEL',
        'EREOF',
        'PLAY',
        'ZOOM',
        '',
        'PA1',
        'WIN OEM CLEAR',
        'TOGGLE TOUCHPAD', // [255]
    ], // https://stackoverflow.com/questions/1772179/get-character-value-from-keycode-in-javascript-then-trim
};
const AudioAssets = {
    ui: {
        inventoryClack: new _resources_AudioResourceGroup__WEBPACK_IMPORTED_MODULE_3__.AudioResourceGroup([
            new _resources_AudioResource__WEBPACK_IMPORTED_MODULE_4__.AudioResource('assets/sounds/sfx/ui/clack1.mp3'),
            new _resources_AudioResource__WEBPACK_IMPORTED_MODULE_4__.AudioResource('assets/sounds/sfx/ui/clack2.mp3'),
            new _resources_AudioResource__WEBPACK_IMPORTED_MODULE_4__.AudioResource('assets/sounds/sfx/ui/clack3.mp3'),
        ]),
    },
    music: {
        titleScreen: new _resources_AudioResource__WEBPACK_IMPORTED_MODULE_4__.AudioResource('assets/sounds/music/TitleScreen.mp3'),
    },
    ambient: {
        winter1: new _resources_AudioResource__WEBPACK_IMPORTED_MODULE_4__.AudioResource('assets/sounds/sfx/ambient/65813__pcaeldries__countrysidewinterevening02.wav'),
    },
    world: {
        metalplosive: new _resources_AudioResourceGroup__WEBPACK_IMPORTED_MODULE_3__.AudioResourceGroup([
            new _resources_AudioResource__WEBPACK_IMPORTED_MODULE_4__.AudioResource('assets/sounds/sfx/tiles/metal1plosive.mp3'),
            new _resources_AudioResource__WEBPACK_IMPORTED_MODULE_4__.AudioResource('assets/sounds/sfx/tiles/metal2plosive.mp3'),
            new _resources_AudioResource__WEBPACK_IMPORTED_MODULE_4__.AudioResource('assets/sounds/sfx/tiles/metal3plosive.mp3'),
            new _resources_AudioResource__WEBPACK_IMPORTED_MODULE_4__.AudioResource('assets/sounds/sfx/tiles/metal4plosive.mp3'),
            new _resources_AudioResource__WEBPACK_IMPORTED_MODULE_4__.AudioResource('assets/sounds/sfx/tiles/metal5plosive.mp3'),
            new _resources_AudioResource__WEBPACK_IMPORTED_MODULE_4__.AudioResource('assets/sounds/sfx/tiles/metal6plosive.mp3'),
            new _resources_AudioResource__WEBPACK_IMPORTED_MODULE_4__.AudioResource('assets/sounds/sfx/tiles/metal7plosive.mp3'),
        ]),
        softplosive: new _resources_AudioResource__WEBPACK_IMPORTED_MODULE_4__.AudioResource('assets/sounds/sfx/tiles/soft1plosive.mp3'),
        texturedplosive: new _resources_AudioResource__WEBPACK_IMPORTED_MODULE_4__.AudioResource('assets/sounds/sfx/tiles/textured1plosive.mp3'),
    }
};
// const animations = <T extends Record<string, ImageResource[]>>(data: T): T => data
const loadAssets = (sketch, ...assets) => {
    assets.forEach(assetGroup => {
        searchGroup(assetGroup, sketch);
    });
};
function searchGroup(assetGroup, sketch) {
    if (assetGroup instanceof _resources_Resource__WEBPACK_IMPORTED_MODULE_7__.Resource) {
        console.log(`Loading asset ${assetGroup.path}`);
        assetGroup.loadResource(sketch);
        console.log("up a level");
        return;
    }
    Object.entries(assetGroup).forEach(asset => {
        console.log("down a level");
        //console.log(asset[1]);
        searchGroup(asset[1], sketch);
    });
}


/***/ }),

/***/ "./src/client/assets/resources/AudioResource.ts":
/*!******************************************************!*\
  !*** ./src/client/assets/resources/AudioResource.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AudioResource": () => (/* binding */ AudioResource)
/* harmony export */ });
/* harmony import */ var _Resource__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Resource */ "./src/client/assets/resources/Resource.ts");
/* harmony import */ var howler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! howler */ "./node_modules/howler/dist/howler.js");
/* harmony import */ var howler__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(howler__WEBPACK_IMPORTED_MODULE_1__);


class AudioResource extends _Resource__WEBPACK_IMPORTED_MODULE_0__.Resource {
    constructor(path) {
        super(path);
    }
    loadResource(game) {
        this.sound = new howler__WEBPACK_IMPORTED_MODULE_1__.Howl({
            src: [this.path]
        });
    }
    playRandom(stereo, volume) {
        // Verify that the sound has been loaded
        if (this.sound === undefined)
            throw new Error(`Tried to play sound before loading it: ${this.path}`);
        console.log("tried to play random");
        if (volume === undefined)
            volume = 1;
        this.sound.volume(volume);
        this.sound.stereo(stereo);
        this.sound.rate(Math.random() * 0.4 + 0.8);
        this.sound.play();
    }
    playSound(stereo) {
        //Verify that the sound has been loaded
        if (this.sound === undefined)
            throw new Error(`Tried to play sound before loading it: ${this.path}`);
        this.sound.rate(1);
        this.sound.stereo(stereo);
        this.sound.play();
    }
}


/***/ }),

/***/ "./src/client/assets/resources/AudioResourceGroup.ts":
/*!***********************************************************!*\
  !*** ./src/client/assets/resources/AudioResourceGroup.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AudioResourceGroup": () => (/* binding */ AudioResourceGroup)
/* harmony export */ });
/* harmony import */ var _Resource__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Resource */ "./src/client/assets/resources/Resource.ts");

class AudioResourceGroup extends _Resource__WEBPACK_IMPORTED_MODULE_0__.Resource {
    constructor(sounds) {
        super("AUDIORESOURCEGROUP DOES NOT HAVE PATH");
        this.sounds = sounds;
    }
    loadResource(sketch) {
        for (let audioResource of this.sounds) {
            audioResource.loadResource(sketch);
        }
    }
    playRandom(stereo, volume) {
        if (this.sounds === undefined || this.sounds.length === 0)
            throw new Error(`There are no sounds: ${this.sounds}`);
        console.log("tried to play audioresourcegroup");
        if (volume === undefined)
            volume = 1;
        const r = Math.floor(Math.random() * this.sounds.length);
        this.sounds[r].playRandom(stereo, volume); // play a random sound from the array at a slightly randomized pitch, leading to the effect of it making a new sound each time, removing repetitiveness
    }
}


/***/ }),

/***/ "./src/client/assets/resources/FontResource.ts":
/*!*****************************************************!*\
  !*** ./src/client/assets/resources/FontResource.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FontResource": () => (/* binding */ FontResource)
/* harmony export */ });
/* harmony import */ var _ImageResource__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ImageResource */ "./src/client/assets/resources/ImageResource.ts");
/* harmony import */ var _Game__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../Game */ "./src/client/Game.ts");


class FontResource extends _ImageResource__WEBPACK_IMPORTED_MODULE_0__.ImageResource {
    constructor(path, characterData, characterOrder, fontHeight) {
        super(path);
        this.alphabet_soup = {};
        let runningTotal = 0;
        for (let i = 0; i < characterOrder.length; i++) {
            this.alphabet_soup[characterOrder[i]] = { x: runningTotal, y: 0, w: characterData[characterOrder[i]], h: fontHeight };
            runningTotal += characterData[characterOrder[i]] + 1;
            // console.log(characterOrder[i]+": "+characterData[characterOrder[i]]);
        }
    }
    drawText(target, str, x, y) {
        //console.log(this.alphabet_soup);
        let xOffset = 0;
        for (let i = 0; i < str.length; i++) {
            if (this.alphabet_soup[str[i]] != undefined) {
                this.renderPartial(target, x + xOffset * _Game__WEBPACK_IMPORTED_MODULE_1__.game.upscaleSize, y, this.alphabet_soup[str[i]].w * _Game__WEBPACK_IMPORTED_MODULE_1__.game.upscaleSize, this.alphabet_soup[str[i]].h * _Game__WEBPACK_IMPORTED_MODULE_1__.game.upscaleSize, this.alphabet_soup[str[i]].x, this.alphabet_soup[str[i]].y, this.alphabet_soup[str[i]].w, this.alphabet_soup[str[i]].h);
                xOffset += this.alphabet_soup[str[i]].w + 1;
            }
            else {
                console.warn("unknown letter: '" + str[i] + "'");
            }
        }
    }
}


/***/ }),

/***/ "./src/client/assets/resources/ImageResource.ts":
/*!******************************************************!*\
  !*** ./src/client/assets/resources/ImageResource.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ImageResource": () => (/* binding */ ImageResource)
/* harmony export */ });
/* harmony import */ var _Resource__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Resource */ "./src/client/assets/resources/Resource.ts");

class ImageResource extends _Resource__WEBPACK_IMPORTED_MODULE_0__.Resource {
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
    renderRotated(target, x, y, width, height, rotation) {
        // Verify that the tiles has been loaded
        if (this.image === undefined)
            throw new Error(`Tried to render image before loading it: ${this.path}`);
        // Draw non tiles image
        target.push();
        target.translate(x + width / 2, y + height / 2);
        target.rotate(rotation);
        target.translate(-width / 2, -height / 2);
        target.image(this.image, 0, 0, width, height);
        target.pop();
    }
    renderPartial(target, x, y, width, height, sourceX, sourceY, sourceWidth, sourceHeight) {
        // Verify that the tiles has been loaded
        if (this.image === undefined)
            throw new Error(`Tried to render image before loading it: ${this.path}`);
        // Draw a partial part of the image
        target.image(this.image, x, y, width, height, sourceX, sourceY, sourceWidth, sourceHeight);
    }
}


/***/ }),

/***/ "./src/client/assets/resources/ReflectedImageResource.ts":
/*!***************************************************************!*\
  !*** ./src/client/assets/resources/ReflectedImageResource.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ReflectableImageResource": () => (/* binding */ ReflectableImageResource)
/* harmony export */ });
/* harmony import */ var _Resource__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Resource */ "./src/client/assets/resources/Resource.ts");
/* harmony import */ var _Game__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../Game */ "./src/client/Game.ts");
/* harmony import */ var _global_Tile__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../global/Tile */ "./src/global/Tile.ts");



class ReflectableImageResource extends _Resource__WEBPACK_IMPORTED_MODULE_0__.Resource {
    constructor(path, scarfColor1, scarfColor2) {
        super(path);
        this.hasReflection = false;
        this.reflectivityArray = [0, 90, 150, 0, 10, 15, 17, 19, 21, 23, 25, 27, 29, 31, 10, 17, 21, 25, 29, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5];
        this.scarfColor1 = scarfColor1;
        this.scarfColor2 = scarfColor2;
    }
    loadResource(game) {
        this.image = game.loadImage(this.path, () => {
            if (this.scarfColor1 != undefined && this.scarfColor2 != undefined) {
                this.image.loadPixels();
                for (let i = 0; i < this.image.width; i++) {
                    for (let j = 0; j < this.image.height; j++) {
                        let p = this.image.get(i, j);
                        if (p[0] === 166) {
                            //console.log("color1")
                            this.image.set(i, j, this.scarfColor1);
                        }
                        else if (p[0] === 155) {
                            //console.log("color2")
                            this.image.set(i, j, this.scarfColor2);
                        }
                        else
                            (this.image.set(i, j, p));
                    }
                }
                //this.image.set(3, 10, [0, 255, 0, 255]);//test pixel
                this.image.updatePixels();
            }
            this.loadReflection(game);
        });
    }
    redefineScarfColor(scarfColor1, scarfColor2) {
        this.scarfColor1 = scarfColor1;
        this.scarfColor2 = scarfColor2;
        this.image.loadPixels();
        for (let i = 0; i < this.image.width; i++) {
            for (let j = 0; j < this.image.height; j++) {
                let p = this.image.get(i, j);
                if (p[0] === 166) {
                    //console.log("color1")
                    this.image.set(i, j, this.scarfColor1);
                }
                else if (p[0] === 155) {
                    //console.log("color2")
                    this.image.set(i, j, this.scarfColor2);
                }
                else
                    (this.image.set(i, j, p));
            }
        }
        //this.image.set(3, 10, [0, 255, 0, 255]);//test pixel
        this.image.updatePixels();
        this.loadReflection(_Game__WEBPACK_IMPORTED_MODULE_1__.game);
    }
    loadReflection(game) {
        this.hasReflection = true;
        this.reflection = game.createImage(this.image.width, this.image.height);
        this.image.loadPixels();
        //console.log(this.image.pixels)
        this.reflection.loadPixels();
        for (let i = 0; i < this.reflection.width; i++) { //generate a reflection image that is displayed as a reflection
            for (let j = 0; j < this.reflection.height; j++) {
                for (let k = 0; k < 3; k++) {
                    this.reflection.pixels[4 * (j * this.reflection.width + i) + k] = this.image.pixels[4 * ((this.image.height - j - 1) * this.image.width + i) + k];
                }
                this.reflection.pixels[4 * (j * this.reflection.width + i) + 3] =
                    this.image.pixels[4 * ((this.image.height - j - 1) * this.image.width + i) + 3] *
                        ((this.reflection.height - j) / this.reflection.height) *
                        (this.reflection.width / 2 + 0.5 - Math.abs(i - this.reflection.width / 2 + 0.5)) / (this.reflection.width / 2) * Math.min(1, 28 * 28 / this.reflection.height / this.reflection.height);
            }
        }
        this.reflection.updatePixels();
    }
    render(target, x, y, width, height) {
        //console.log(WorldTiles);
        // Verify that the image has been loaded
        if (this.image === undefined)
            throw new Error(`Tried to render image before loading it: ${this.path}`);
        // Draw non tiles image
        target.image(this.image, x, y, width, height);
    }
    renderRotated(target, x, y, width, height, rotation) {
        // Verify that the tiles has been loaded
        if (this.image === undefined)
            throw new Error(`Tried to render image before loading it: ${this.path}`);
        // Draw non tiles image
        target.push();
        target.translate(-width / 2, -height / 2);
        target.rotate(rotation);
        target.image(this.image, x, y, width, height);
        target.pop();
    }
    renderWorldspaceReflection(target, x, y, width, height) {
        if (!this.hasReflection)
            return;
        if (this.reflection === undefined)
            throw new Error(`Tried to render reflection of image before loading it: ${this.path}`);
        //loop through every tile it passes through
        for (let i = Math.floor(x); i < x + width; i++) {
            for (let j = Math.floor(y); j < y + height; j++) {
                // console.log(target.world.worldTiles);
                let currentBlock;
                currentBlock = _Game__WEBPACK_IMPORTED_MODULE_1__.game.world.worldTiles[j * _Game__WEBPACK_IMPORTED_MODULE_1__.game.worldWidth + i];
                if (currentBlock === undefined || typeof currentBlock === "string" || currentBlock == _global_Tile__WEBPACK_IMPORTED_MODULE_2__.TileType.Air) { //the reference to TileEntity can be removed as soon as the better system is in place
                    continue;
                }
                target.drawingContext.globalAlpha = this.reflectivityArray[currentBlock] / 255; //TODO make this based on the tile reflectivity
                target.image(this.reflection, (i * _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_WIDTH -
                    _Game__WEBPACK_IMPORTED_MODULE_1__.game.interpolatedCamX * _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_WIDTH) *
                    _Game__WEBPACK_IMPORTED_MODULE_1__.game.upscaleSize, (j * _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_HEIGHT -
                    _Game__WEBPACK_IMPORTED_MODULE_1__.game.interpolatedCamY * _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_HEIGHT) *
                    _Game__WEBPACK_IMPORTED_MODULE_1__.game.upscaleSize, _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_WIDTH * _Game__WEBPACK_IMPORTED_MODULE_1__.game.upscaleSize, _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_HEIGHT * _Game__WEBPACK_IMPORTED_MODULE_1__.game.upscaleSize, (i - x) * _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_WIDTH, (j - y) * _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_HEIGHT, _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_WIDTH, _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_HEIGHT);
                target.drawingContext.globalAlpha = 1.0;
            }
        }
    }
    renderReflection(target, x, y, width, height, worldTiles) {
        if (!this.hasReflection)
            return;
        if (this.reflection === undefined)
            throw new Error(`Tried to render reflection of image before loading it: ${this.path}`);
        //loop through every tile it passes through
        for (let i = Math.floor(x); i < x + width; i++) {
            for (let j = Math.floor(y); j < y + height; j++) {
                // console.log(target.world.worldTiles);
                let currentBlock;
                currentBlock = worldTiles[j * _Game__WEBPACK_IMPORTED_MODULE_1__.game.worldWidth + i];
                if (currentBlock === undefined || typeof currentBlock === "string" || currentBlock == _global_Tile__WEBPACK_IMPORTED_MODULE_2__.TileType.Air) { //the reference to TileEntity can be removed as soon as the better system is in place
                    continue;
                }
                target.drawingContext.globalAlpha = this.reflectivityArray[currentBlock] / 255; //TODO make this based on the tile reflectivity
                target.image(this.reflection, i * _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_WIDTH, j * _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_HEIGHT, _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_WIDTH, _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_HEIGHT, (i - x) * _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_WIDTH, (j - y) * _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_HEIGHT, _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_WIDTH, _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_HEIGHT);
                target.drawingContext.globalAlpha = 1.0;
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
}


/***/ }),

/***/ "./src/client/assets/resources/Resource.ts":
/*!*************************************************!*\
  !*** ./src/client/assets/resources/Resource.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Resource": () => (/* binding */ Resource)
/* harmony export */ });
class Resource {
    constructor(path) {
        this.path = path;
    }
}


/***/ }),

/***/ "./src/client/assets/resources/TileResource.ts":
/*!*****************************************************!*\
  !*** ./src/client/assets/resources/TileResource.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TileResource": () => (/* binding */ TileResource)
/* harmony export */ });
/* harmony import */ var _ImageResource__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ImageResource */ "./src/client/assets/resources/ImageResource.ts");

class TileResource extends _ImageResource__WEBPACK_IMPORTED_MODULE_0__.ImageResource {
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


/***/ }),

/***/ "./src/client/input/Control.ts":
/*!*************************************!*\
  !*** ./src/client/input/Control.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Control": () => (/* binding */ Control)
/* harmony export */ });
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


/***/ }),

/***/ "./src/client/player/Inventory.ts":
/*!****************************************!*\
  !*** ./src/client/player/Inventory.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Inventory": () => (/* binding */ Inventory),
/* harmony export */   "xToStereo": () => (/* binding */ xToStereo)
/* harmony export */ });
/* harmony import */ var _global_Inventory__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../global/Inventory */ "./src/global/Inventory.ts");
/* harmony import */ var _global_Tile__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../global/Tile */ "./src/global/Tile.ts");
/* harmony import */ var _Game__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Game */ "./src/client/Game.ts");
/* harmony import */ var _world_particles_ColorParticle__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../world/particles/ColorParticle */ "./src/client/world/particles/ColorParticle.ts");
/* harmony import */ var _world_WorldTiles__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../world/WorldTiles */ "./src/client/world/WorldTiles.ts");





class Inventory {
    constructor(inventory) {
        this.selectedSlot = 0;
        this.pickedUpSlot = undefined;
        this.items = inventory.items;
        this.width = inventory.width;
        this.height = inventory.height;
    }
    worldClick(x, y) {
        var _a, _b, _c;
        const selectedItem = this.items[this.selectedSlot];
        if (selectedItem === undefined || selectedItem === null) {
            //console.error("Breaking tile")
            let tileBeingBroken = _Game__WEBPACK_IMPORTED_MODULE_2__.game.world.worldTiles[_Game__WEBPACK_IMPORTED_MODULE_2__.game.world.width * y + x];
            if (typeof tileBeingBroken === 'number') {
                let worldTileBeingBroken = _world_WorldTiles__WEBPACK_IMPORTED_MODULE_4__.WorldTiles[tileBeingBroken];
                for (let i = 0; i < 5 * _Game__WEBPACK_IMPORTED_MODULE_2__.game.particleMultiplier; i++) {
                    if (worldTileBeingBroken !== undefined)
                        _Game__WEBPACK_IMPORTED_MODULE_2__.game.particles.push(new _world_particles_ColorParticle__WEBPACK_IMPORTED_MODULE_3__.ColorParticle(worldTileBeingBroken.color, Math.random() * 0.2 + 0.1, 10, x + Math.random(), y + Math.random(), 0.2 * (Math.random() - 0.5), -0.15 * Math.random()));
                }
            }
            _Game__WEBPACK_IMPORTED_MODULE_2__.game.connection.emit('worldBreakStart', _Game__WEBPACK_IMPORTED_MODULE_2__.game.world.width * y + x);
            if (typeof tileBeingBroken === "number" && ((_a = _world_WorldTiles__WEBPACK_IMPORTED_MODULE_4__.WorldTiles[tileBeingBroken]) === null || _a === void 0 ? void 0 : _a.breakSound) !== undefined) {
                //console.log((x-game.interpolatedCamX)+"+"+(game.width/game.TILE_WIDTH/game.upscaleSize)+"="+(x-game.interpolatedCamX-game.width/game.TILE_WIDTH/game.upscaleSize));
                (_c = (_b = _world_WorldTiles__WEBPACK_IMPORTED_MODULE_4__.WorldTiles[tileBeingBroken]) === null || _b === void 0 ? void 0 : _b.breakSound) === null || _c === void 0 ? void 0 : _c.playRandom((x - _Game__WEBPACK_IMPORTED_MODULE_2__.game.interpolatedCamX - _Game__WEBPACK_IMPORTED_MODULE_2__.game.width / _Game__WEBPACK_IMPORTED_MODULE_2__.game.TILE_WIDTH / _Game__WEBPACK_IMPORTED_MODULE_2__.game.upscaleSize / 2) / 20);
            }
            _Game__WEBPACK_IMPORTED_MODULE_2__.game.connection.emit('worldBreakFinish');
            return;
        }
        const worldClick = ItemActions[_global_Inventory__WEBPACK_IMPORTED_MODULE_0__.Items[selectedItem.item].type].worldClick;
        if (worldClick === undefined) {
            console.error("Cannot place selected item");
            return;
        }
        worldClick(x, y);
    }
    worldClickCheck(x, y) {
        let tileBeingBroken = _Game__WEBPACK_IMPORTED_MODULE_2__.game.world.worldTiles[_Game__WEBPACK_IMPORTED_MODULE_2__.game.world.width * y + x];
        if (typeof tileBeingBroken === 'number') {
            if (tileBeingBroken === _global_Tile__WEBPACK_IMPORTED_MODULE_1__.TileType.Air)
                _Game__WEBPACK_IMPORTED_MODULE_2__.game.breaking = false;
            else
                _Game__WEBPACK_IMPORTED_MODULE_2__.game.breaking = true;
        }
    }
}
const ItemActions = {
    [_global_Inventory__WEBPACK_IMPORTED_MODULE_0__.ItemCategories.Tile]: {
        worldClick(x, y) {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            // If the tile isn't air
            if (_Game__WEBPACK_IMPORTED_MODULE_2__.game.world.worldTiles[_Game__WEBPACK_IMPORTED_MODULE_2__.game.world.width * y + x] !== _global_Tile__WEBPACK_IMPORTED_MODULE_1__.TileType.Air) {
                let tileBeingBroken = _Game__WEBPACK_IMPORTED_MODULE_2__.game.world.worldTiles[_Game__WEBPACK_IMPORTED_MODULE_2__.game.world.width * y + x];
                if (typeof tileBeingBroken === 'number') { //tile is tile
                    if (!_Game__WEBPACK_IMPORTED_MODULE_2__.game.breaking || _Game__WEBPACK_IMPORTED_MODULE_2__.game.brokenTilesQueue.includes(_Game__WEBPACK_IMPORTED_MODULE_2__.game.world.width * y + x))
                        return;
                    _Game__WEBPACK_IMPORTED_MODULE_2__.game.brokenTilesQueue.push(_Game__WEBPACK_IMPORTED_MODULE_2__.game.world.width * y + x);
                    let worldTileBeingBroken = _world_WorldTiles__WEBPACK_IMPORTED_MODULE_4__.WorldTiles[tileBeingBroken];
                    for (let i = 0; i < 5 * _Game__WEBPACK_IMPORTED_MODULE_2__.game.particleMultiplier; i++) {
                        if (worldTileBeingBroken !== undefined)
                            _Game__WEBPACK_IMPORTED_MODULE_2__.game.particles.push(new _world_particles_ColorParticle__WEBPACK_IMPORTED_MODULE_3__.ColorParticle(worldTileBeingBroken.color, Math.random() * 0.2 + 0.1, 10, x + Math.random(), y + Math.random(), 0.2 * (Math.random() - 0.5), -0.15 * Math.random()));
                    }
                    console.info('breaking');
                    _Game__WEBPACK_IMPORTED_MODULE_2__.game.connection.emit('worldBreakStart', _Game__WEBPACK_IMPORTED_MODULE_2__.game.world.width * y + x);
                    _Game__WEBPACK_IMPORTED_MODULE_2__.game.connection.emit('worldBreakFinish');
                    (_b = (_a = _world_WorldTiles__WEBPACK_IMPORTED_MODULE_4__.WorldTiles[tileBeingBroken]) === null || _a === void 0 ? void 0 : _a.breakSound) === null || _b === void 0 ? void 0 : _b.playRandom(xToStereo(x));
                    return;
                }
                else { //tile is tile entity
                    console.log("tile entity interact");
                    _Game__WEBPACK_IMPORTED_MODULE_2__.game.connection.emit('worldBreakStart', _Game__WEBPACK_IMPORTED_MODULE_2__.game.world.width * y + x);
                    _Game__WEBPACK_IMPORTED_MODULE_2__.game.connection.emit('worldBreakFinish');
                    return;
                }
            }
            //if the tile is air and the game is trying to place
            if (_Game__WEBPACK_IMPORTED_MODULE_2__.game.breaking || _Game__WEBPACK_IMPORTED_MODULE_2__.game.brokenTilesQueue.includes(_Game__WEBPACK_IMPORTED_MODULE_2__.game.world.width * y + x))
                return;
            _Game__WEBPACK_IMPORTED_MODULE_2__.game.brokenTilesQueue.push(_Game__WEBPACK_IMPORTED_MODULE_2__.game.world.width * y + x);
            console.info('Placing');
            let itemTypeBeingHeld = (_c = _Game__WEBPACK_IMPORTED_MODULE_2__.game.world.inventory.items[_Game__WEBPACK_IMPORTED_MODULE_2__.game.world.inventory.selectedSlot]) === null || _c === void 0 ? void 0 : _c.item;
            if (itemTypeBeingHeld === undefined)
                return;
            let itemData = _global_Inventory__WEBPACK_IMPORTED_MODULE_0__.Items[itemTypeBeingHeld];
            if (itemData.type === _global_Inventory__WEBPACK_IMPORTED_MODULE_0__.ItemCategories.Tile) {
                if (((_d = _world_WorldTiles__WEBPACK_IMPORTED_MODULE_4__.WorldTiles[itemData.placedTile]) === null || _d === void 0 ? void 0 : _d.placeSound) !== undefined)
                    (_f = (_e = _world_WorldTiles__WEBPACK_IMPORTED_MODULE_4__.WorldTiles[itemData.placedTile]) === null || _e === void 0 ? void 0 : _e.placeSound) === null || _f === void 0 ? void 0 : _f.playRandom(xToStereo(x));
                else
                    (_h = (_g = _world_WorldTiles__WEBPACK_IMPORTED_MODULE_4__.WorldTiles[itemData.placedTile]) === null || _g === void 0 ? void 0 : _g.breakSound) === null || _h === void 0 ? void 0 : _h.playRandom(xToStereo(x));
            }
            _Game__WEBPACK_IMPORTED_MODULE_2__.game.connection.emit('worldPlace', _Game__WEBPACK_IMPORTED_MODULE_2__.game.world.inventory.selectedSlot, x, y);
        }
    },
    [_global_Inventory__WEBPACK_IMPORTED_MODULE_0__.ItemCategories.Resource]: {},
    [_global_Inventory__WEBPACK_IMPORTED_MODULE_0__.ItemCategories.Tool]: {},
    [_global_Inventory__WEBPACK_IMPORTED_MODULE_0__.ItemCategories.TileEntity]: {
        worldClick(x, y) {
            var _a;
            let itemRef = _global_Inventory__WEBPACK_IMPORTED_MODULE_0__.Items[((_a = _Game__WEBPACK_IMPORTED_MODULE_2__.game.world.inventory.items[_Game__WEBPACK_IMPORTED_MODULE_2__.game.world.inventory.selectedSlot]) === null || _a === void 0 ? void 0 : _a.item) || 0];
            let offset = [0, 0];
            if ("tileEntityOffset" in itemRef) {
                offset = itemRef.tileEntityOffset;
            }
            _Game__WEBPACK_IMPORTED_MODULE_2__.game.connection.emit('worldPlace', _Game__WEBPACK_IMPORTED_MODULE_2__.game.world.inventory.selectedSlot, x, y);
        }
    },
};
function xToStereo(x) {
    return (x - _Game__WEBPACK_IMPORTED_MODULE_2__.game.interpolatedCamX - _Game__WEBPACK_IMPORTED_MODULE_2__.game.width / _Game__WEBPACK_IMPORTED_MODULE_2__.game.TILE_WIDTH / _Game__WEBPACK_IMPORTED_MODULE_2__.game.upscaleSize / 2) / 20;
}


/***/ }),

/***/ "./src/client/player/PlayerLocal.ts":
/*!******************************************!*\
  !*** ./src/client/player/PlayerLocal.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PlayerLocal": () => (/* binding */ PlayerLocal)
/* harmony export */ });
/* harmony import */ var _global_Entity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../global/Entity */ "./src/global/Entity.ts");
/* harmony import */ var _Game__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Game */ "./src/client/Game.ts");
/* harmony import */ var _world_entities_ServerEntity__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../world/entities/ServerEntity */ "./src/client/world/entities/ServerEntity.ts");
/* harmony import */ var _assets_Assets__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../assets/Assets */ "./src/client/assets/Assets.ts");
/* harmony import */ var _global_Tile__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../global/Tile */ "./src/global/Tile.ts");
/* harmony import */ var _world_WorldTiles__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../world/WorldTiles */ "./src/client/world/WorldTiles.ts");
/* harmony import */ var _world_particles_ColorParticle__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../world/particles/ColorParticle */ "./src/client/world/particles/ColorParticle.ts");
/* harmony import */ var _Inventory__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./Inventory */ "./src/client/player/Inventory.ts");



// import { ColorParticle } from '../world/';





class PlayerLocal extends _world_entities_ServerEntity__WEBPACK_IMPORTED_MODULE_2__.ServerEntity {
    constructor(data) {
        super(data.id);
        // Constant data
        this.width = 12 / _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_WIDTH;
        this.height = 28 / _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_HEIGHT;
        // Local data
        this.xVel = 0;
        this.yVel = 0;
        this.pXVel = 0;
        this.pYVel = 0;
        this.grounded = false;
        this.pGrounded = false;
        this.mass = this.width * this.height;
        this.color1 = [0, 0, 0, 255];
        this.color2 = [0, 0, 0, 255];
        this.currentAnimation = "idle";
        this.animFrame = 0;
        this.timeInThisAnimationFrame = 0;
        this.facingRight = true;
        this.topCollision = _world_WorldTiles__WEBPACK_IMPORTED_MODULE_5__.WorldTiles[_global_Tile__WEBPACK_IMPORTED_MODULE_4__.TileType.Air]; //hacky
        this.bottomCollision = _world_WorldTiles__WEBPACK_IMPORTED_MODULE_5__.WorldTiles[_global_Tile__WEBPACK_IMPORTED_MODULE_4__.TileType.Air];
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
    render(target, upscaleSize) {
        this.timeInThisAnimationFrame += _Game__WEBPACK_IMPORTED_MODULE_1__.game.deltaTime;
        if (this.timeInThisAnimationFrame > _assets_Assets__WEBPACK_IMPORTED_MODULE_3__.PlayerAnimations[this.currentAnimation][this.animFrame][1]) {
            this.timeInThisAnimationFrame = 0; //this does introduce some slight inaccuracies vs subtracting it, but, when you tab back into the browser after being tabbed out, subtracting it causes spazzing
            this.animFrame++;
            if (this.animFrame >= _assets_Assets__WEBPACK_IMPORTED_MODULE_3__.PlayerAnimations[this.currentAnimation].length) {
                this.animFrame = this.animFrame % _assets_Assets__WEBPACK_IMPORTED_MODULE_3__.PlayerAnimations[this.currentAnimation].length;
            }
        }
        // target.rect(
        //     (this.interpolatedX * game.TILE_WIDTH -
        //         game.interpolatedCamX * game.TILE_WIDTH) *
        //         upscaleSize,
        //     (this.interpolatedY * game.TILE_HEIGHT -
        //         game.interpolatedCamY * game.TILE_HEIGHT) *
        //         upscaleSize,
        //     this.width * upscaleSize * game.TILE_WIDTH,
        //     this.height * upscaleSize * game.TILE_HEIGHT
        // );
        _assets_Assets__WEBPACK_IMPORTED_MODULE_3__.PlayerAnimations[this.currentAnimation][this.animFrame][0].render(target, Math.round((this.interpolatedX * _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_WIDTH -
            _Game__WEBPACK_IMPORTED_MODULE_1__.game.interpolatedCamX * _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_WIDTH) *
            upscaleSize), Math.round((this.interpolatedY * _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_HEIGHT -
            _Game__WEBPACK_IMPORTED_MODULE_1__.game.interpolatedCamY * _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_HEIGHT) *
            upscaleSize), this.width * upscaleSize * _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_WIDTH, this.height * upscaleSize * _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_HEIGHT);
        _assets_Assets__WEBPACK_IMPORTED_MODULE_3__.PlayerAnimations[this.currentAnimation][this.animFrame][0].renderWorldspaceReflection(_Game__WEBPACK_IMPORTED_MODULE_1__.game, this.interpolatedX, this.interpolatedY + this.height, this.width, this.height);
        target.fill(this.color1);
        target.noStroke();
        target.rect((this.interpolatedX * _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_WIDTH -
            _Game__WEBPACK_IMPORTED_MODULE_1__.game.interpolatedCamX * _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_WIDTH +
            (this.width * _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_WIDTH) / 2) *
            upscaleSize - (this.name.length * 2 * _Game__WEBPACK_IMPORTED_MODULE_1__.game.upscaleSize), (this.interpolatedY * _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_HEIGHT -
            _Game__WEBPACK_IMPORTED_MODULE_1__.game.interpolatedCamY * _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_HEIGHT -
            (this.height * _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_HEIGHT) / 2.5 + 4) *
            upscaleSize, (this.name.length * 4 * _Game__WEBPACK_IMPORTED_MODULE_1__.game.upscaleSize), _Game__WEBPACK_IMPORTED_MODULE_1__.game.upscaleSize);
        target.rect((this.interpolatedX * _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_WIDTH -
            _Game__WEBPACK_IMPORTED_MODULE_1__.game.interpolatedCamX * _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_WIDTH +
            (this.width * _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_WIDTH) / 2) *
            upscaleSize - ((this.name.length * 2 - 2) * _Game__WEBPACK_IMPORTED_MODULE_1__.game.upscaleSize), (this.interpolatedY * _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_HEIGHT -
            _Game__WEBPACK_IMPORTED_MODULE_1__.game.interpolatedCamY * _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_HEIGHT -
            (this.height * _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_HEIGHT) / 2.5 + 6) *
            upscaleSize, ((this.name.length * 4 - 4) * _Game__WEBPACK_IMPORTED_MODULE_1__.game.upscaleSize), _Game__WEBPACK_IMPORTED_MODULE_1__.game.upscaleSize);
        _assets_Assets__WEBPACK_IMPORTED_MODULE_3__.Fonts.tom_thumb.drawText(_Game__WEBPACK_IMPORTED_MODULE_1__.game, this.name, (this.interpolatedX * _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_WIDTH -
            _Game__WEBPACK_IMPORTED_MODULE_1__.game.interpolatedCamX * _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_WIDTH +
            (this.width * _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_WIDTH) / 2) *
            upscaleSize - (this.name.length * 2 * _Game__WEBPACK_IMPORTED_MODULE_1__.game.upscaleSize), (this.interpolatedY * _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_HEIGHT -
            _Game__WEBPACK_IMPORTED_MODULE_1__.game.interpolatedCamY * _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_HEIGHT -
            (this.height * _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_HEIGHT) / 2.5 - 2) *
            upscaleSize);
    }
    updateData(data) {
        if (data.type === _global_Entity__WEBPACK_IMPORTED_MODULE_0__.Entities.Player)
            this.name = data.data.name;
    }
    keyboardInput() {
        var _a;
        this.xVel +=
            0.02 * (+this.rightButton - +this.leftButton);
        if (this.grounded && this.jumpButton) {
            _Game__WEBPACK_IMPORTED_MODULE_1__.game.screenshakeAmount = 0.5;
            for (let i = 0; i < 10 * _Game__WEBPACK_IMPORTED_MODULE_1__.game.particleMultiplier; i++) {
                if (this.bottomCollision !== undefined) {
                    _Game__WEBPACK_IMPORTED_MODULE_1__.game.particles.push(new _world_particles_ColorParticle__WEBPACK_IMPORTED_MODULE_6__.ColorParticle(this.bottomCollision.color, 1 / 8 + Math.random() / 8, 20, this.x + this.width * Math.random(), this.y + this.height, 0.2 * (Math.random() - 0.5), 0.2 * -Math.random()));
                    (_a = this.bottomCollision.jumpSound) === null || _a === void 0 ? void 0 : _a.playRandom((0,_Inventory__WEBPACK_IMPORTED_MODULE_7__.xToStereo)(this.interpolatedX));
                }
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
                (Math.abs(this.xVel) * this.xVel * _Game__WEBPACK_IMPORTED_MODULE_1__.game.DRAG_COEFFICIENT * this.width) / //apply air resistance
                    this.mass;
        }
        else {
            this.xVel -=
                (Math.abs(this.xVel) * this.xVel * _Game__WEBPACK_IMPORTED_MODULE_1__.game.DRAG_COEFFICIENT * (this.bottomCollision.friction) * this.width) / //apply air resistance and ground friction
                    this.mass;
        }
        this.yVel += _Game__WEBPACK_IMPORTED_MODULE_1__.game.GRAVITY_SPEED;
        this.yVel -=
            (_Game__WEBPACK_IMPORTED_MODULE_1__.game.abs(this.yVel) * this.yVel * _Game__WEBPACK_IMPORTED_MODULE_1__.game.DRAG_COEFFICIENT * this.height) /
                this.mass;
        //if on the ground, make walking particles
        if (this.grounded) {
            //footsteps
            for (let i = 0; i < randomlyToInt(Math.abs(this.xVel) * _Game__WEBPACK_IMPORTED_MODULE_1__.game.particleMultiplier / 2); i++) {
                _Game__WEBPACK_IMPORTED_MODULE_1__.game.particles.push(new _world_particles_ColorParticle__WEBPACK_IMPORTED_MODULE_6__.ColorParticle("#bbbbbb45", 1 / 4 + Math.random() / 8, 50, this.x + this.width / 2 + i / _Game__WEBPACK_IMPORTED_MODULE_1__.game.particleMultiplier, this.y + this.height, 0, 0, false));
            }
            //dust
            for (let i = 0; i < randomlyToInt(Math.abs(this.xVel) * _Game__WEBPACK_IMPORTED_MODULE_1__.game.particleMultiplier / 2); i++) {
                if (this.bottomCollision !== undefined)
                    _Game__WEBPACK_IMPORTED_MODULE_1__.game.particles.push(new _world_particles_ColorParticle__WEBPACK_IMPORTED_MODULE_6__.ColorParticle(this.bottomCollision.color, 1 / 8 + Math.random() / 8, 10, this.x + this.width / 2, this.y + this.height, 0.2 * -this.xVel + 0.2 * (Math.random() - 0.5), 0.2 * -Math.random(), true));
            }
        }
        if (this.currentAnimation !== "walk" && (this.xVel) > 0.05) {
            this.currentAnimation = "walk";
            this.animFrame = this.animFrame % _assets_Assets__WEBPACK_IMPORTED_MODULE_3__.PlayerAnimations[this.currentAnimation].length;
            this.facingRight = true;
            _Game__WEBPACK_IMPORTED_MODULE_1__.game.connection.emit('playerAnimation', this.currentAnimation, this.entityId);
        }
        if (this.currentAnimation !== "walkleft" && (this.xVel) < -0.05) {
            this.currentAnimation = "walkleft";
            this.facingRight = false;
            this.animFrame = this.animFrame % _assets_Assets__WEBPACK_IMPORTED_MODULE_3__.PlayerAnimations[this.currentAnimation].length;
            _Game__WEBPACK_IMPORTED_MODULE_1__.game.connection.emit('playerAnimation', this.currentAnimation, this.entityId);
        }
        if (this.currentAnimation !== "idle" && this.xVel <= 0.05 && (this.xVel > 0 || (_Game__WEBPACK_IMPORTED_MODULE_1__.game.worldMouseX > this.interpolatedX + this.width / 2 && this.xVel === 0))) {
            this.currentAnimation = "idle";
            this.animFrame = this.animFrame % _assets_Assets__WEBPACK_IMPORTED_MODULE_3__.PlayerAnimations[this.currentAnimation].length;
            _Game__WEBPACK_IMPORTED_MODULE_1__.game.connection.emit('playerAnimation', this.currentAnimation, this.entityId);
        }
        if (this.currentAnimation !== "idleleft" && this.xVel >= -0.05 && (this.xVel < 0 || (_Game__WEBPACK_IMPORTED_MODULE_1__.game.worldMouseX <= this.interpolatedX + this.width / 2 && this.xVel === 0))) {
            this.currentAnimation = "idleleft";
            this.animFrame = this.animFrame % _assets_Assets__WEBPACK_IMPORTED_MODULE_3__.PlayerAnimations[this.currentAnimation].length;
            _Game__WEBPACK_IMPORTED_MODULE_1__.game.connection.emit('playerAnimation', this.currentAnimation, this.entityId);
        }
        //console.log(this.currentAnimation, this.currentAnimation !== "walk" && (this.xVel)>0.05)
    }
    findInterpolatedCoordinates() {
        // this function essentially makes the character lag behind one tick, but means that it gets displayed at the maximum frame rate.
        if (this.pXVel > 0) {
            this.interpolatedX = _Game__WEBPACK_IMPORTED_MODULE_1__.game.min(this.pX + this.pXVel * _Game__WEBPACK_IMPORTED_MODULE_1__.game.amountSinceLastTick, this.x);
        }
        else {
            this.interpolatedX = _Game__WEBPACK_IMPORTED_MODULE_1__.game.max(this.pX + this.pXVel * _Game__WEBPACK_IMPORTED_MODULE_1__.game.amountSinceLastTick, this.x);
        }
        if (this.pYVel > 0) {
            this.interpolatedY = _Game__WEBPACK_IMPORTED_MODULE_1__.game.min(this.pY + this.pYVel * _Game__WEBPACK_IMPORTED_MODULE_1__.game.amountSinceLastTick, this.y);
        }
        else {
            this.interpolatedY = _Game__WEBPACK_IMPORTED_MODULE_1__.game.max(this.pY + this.pYVel * _Game__WEBPACK_IMPORTED_MODULE_1__.game.amountSinceLastTick, this.y);
        }
    }
    applyVelocityAndCollide() {
        var _a, _b, _c;
        this.topCollision = _world_WorldTiles__WEBPACK_IMPORTED_MODULE_5__.WorldTiles[_global_Tile__WEBPACK_IMPORTED_MODULE_4__.TileType.Air];
        this.bottomCollision = _world_WorldTiles__WEBPACK_IMPORTED_MODULE_5__.WorldTiles[_global_Tile__WEBPACK_IMPORTED_MODULE_4__.TileType.Air];
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
        for (let i = Math.floor(_Game__WEBPACK_IMPORTED_MODULE_1__.game.min(this.x, this.x + this.xVel)); i < Math.ceil(_Game__WEBPACK_IMPORTED_MODULE_1__.game.max(this.x, this.x + this.xVel) + this.width); i++) {
            for (let j = Math.floor(_Game__WEBPACK_IMPORTED_MODULE_1__.game.min(this.y, this.y + this.yVel)); j < Math.ceil(_Game__WEBPACK_IMPORTED_MODULE_1__.game.max(this.y, this.y + this.yVel) + this.height); j++) {
                // if the current tile isn't air (value 0), then continue with the collision detection
                let currentBlock = _Game__WEBPACK_IMPORTED_MODULE_1__.game.world.worldTiles[j * _Game__WEBPACK_IMPORTED_MODULE_1__.game.worldWidth + i];
                if (currentBlock !== _global_Tile__WEBPACK_IMPORTED_MODULE_4__.TileType.Air && typeof currentBlock === 'number') {
                    // get the data about the collision and store it in a variable
                    this.collisionData = _Game__WEBPACK_IMPORTED_MODULE_1__.game.rectVsRay(i - this.width, j - this.height, this.width + 1, this.height + 1, this.x, this.y, this.xVel, this.yVel);
                    mostlyGoingHorizontally = Math.abs(this.xVel) > Math.abs(this.yVel);
                    if (this.collisionData !== false) { //a collision happened
                        if (this.closestCollision[2] > this.collisionData[2]) {
                            this.closestCollision = this.collisionData; //honestly this entire collision system is a mess but it work so so what
                            if (this.closestCollision[0] === 0) {
                                if (this.closestCollision[1] === 1) {
                                    this.topCollision = _world_WorldTiles__WEBPACK_IMPORTED_MODULE_5__.WorldTiles[currentBlock];
                                }
                                else {
                                    this.bottomCollision = _world_WorldTiles__WEBPACK_IMPORTED_MODULE_5__.WorldTiles[currentBlock];
                                }
                            }
                        }
                        else if (this.closestCollision[2] === this.collisionData[2] && mostlyGoingHorizontally === (this.closestCollision[0] === 0)) {
                            this.closestCollision = this.collisionData;
                            if (this.closestCollision[0] === 0) {
                                if (this.closestCollision[1] === 1) {
                                    this.topCollision = _world_WorldTiles__WEBPACK_IMPORTED_MODULE_5__.WorldTiles[currentBlock];
                                }
                                else {
                                    this.bottomCollision = _world_WorldTiles__WEBPACK_IMPORTED_MODULE_5__.WorldTiles[currentBlock];
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
                        _Game__WEBPACK_IMPORTED_MODULE_1__.game.screenshakeAmount = Math.abs(this.yVel * 0.75);
                        if (this.bottomCollision !== undefined) {
                            for (let i = 0; i < 5 * _Game__WEBPACK_IMPORTED_MODULE_1__.game.particleMultiplier; i++) {
                                _Game__WEBPACK_IMPORTED_MODULE_1__.game.particles.push(new _world_particles_ColorParticle__WEBPACK_IMPORTED_MODULE_6__.ColorParticle(this.bottomCollision.color, 1 / 8 + Math.random() / 8, 20, this.x + this.width * Math.random(), this.y + this.height, 0.2 * (Math.random() - 0.5), 0.2 * -Math.random()));
                            }
                            if (this.bottomCollision.landSound != undefined) {
                                (_a = this.bottomCollision.landSound) === null || _a === void 0 ? void 0 : _a.playRandom((0,_Inventory__WEBPACK_IMPORTED_MODULE_7__.xToStereo)(this.interpolatedX), -this.yVel);
                            }
                            else if (this.bottomCollision.jumpSound != undefined) {
                                (_b = this.bottomCollision.jumpSound) === null || _b === void 0 ? void 0 : _b.playRandom((0,_Inventory__WEBPACK_IMPORTED_MODULE_7__.xToStereo)(this.interpolatedX), -this.yVel);
                            }
                            else {
                                (_c = this.bottomCollision.breakSound) === null || _c === void 0 ? void 0 : _c.playRandom((0,_Inventory__WEBPACK_IMPORTED_MODULE_7__.xToStereo)(this.interpolatedX), -this.yVel);
                            }
                        }
                    }
                }
                else {
                    _Game__WEBPACK_IMPORTED_MODULE_1__.game.screenshakeAmount = Math.abs(this.yVel * 0.75);
                    for (let i = 0; i < 5 * _Game__WEBPACK_IMPORTED_MODULE_1__.game.particleMultiplier; i++) { //ceiling collision particles
                        if (this.topCollision !== undefined)
                            _Game__WEBPACK_IMPORTED_MODULE_1__.game.particles.push(new _world_particles_ColorParticle__WEBPACK_IMPORTED_MODULE_6__.ColorParticle(this.topCollision.color, 1 / 8 + Math.random() / 8, 20, this.x + this.width * Math.random(), this.y, 0.2 * (Math.random() - 0.5), 0.2 * -Math.random()));
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
            for (let i = Math.floor(_Game__WEBPACK_IMPORTED_MODULE_1__.game.min(this.x, this.x + this.slideX)); i < Math.ceil(_Game__WEBPACK_IMPORTED_MODULE_1__.game.max(this.x, this.x + this.slideX) + this.width); i++) {
                for (let j = Math.floor(_Game__WEBPACK_IMPORTED_MODULE_1__.game.min(this.y, this.y + this.slideY)); j <
                    Math.ceil(_Game__WEBPACK_IMPORTED_MODULE_1__.game.max(this.y, this.y + this.slideY) + this.height); j++) {
                    let currentBlock = _Game__WEBPACK_IMPORTED_MODULE_1__.game.world.worldTiles[j * _Game__WEBPACK_IMPORTED_MODULE_1__.game.worldWidth + i];
                    // if the current tile isn't air, then continue with the collision detection
                    if (currentBlock !== _global_Tile__WEBPACK_IMPORTED_MODULE_4__.TileType.Air && typeof currentBlock === "number") {
                        // get the data about the collision and store it in a variable
                        this.collisionData = _Game__WEBPACK_IMPORTED_MODULE_1__.game.rectVsRay(i - this.width, j - this.height, this.width + 1, this.height + 1, this.x, this.y, this.slideX, this.slideY);
                        if (this.collisionData !== false &&
                            this.closestCollision[2] > this.collisionData[2]) {
                            this.closestCollision = this.collisionData;
                            if (this.closestCollision[0] === 0) {
                                if (this.closestCollision[1] === 1) {
                                    this.topCollision = _world_WorldTiles__WEBPACK_IMPORTED_MODULE_5__.WorldTiles[currentBlock];
                                }
                                else {
                                    this.bottomCollision = _world_WorldTiles__WEBPACK_IMPORTED_MODULE_5__.WorldTiles[currentBlock];
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
        else if (this.x + this.width > _Game__WEBPACK_IMPORTED_MODULE_1__.game.worldWidth) {
            this.x = _Game__WEBPACK_IMPORTED_MODULE_1__.game.worldWidth - this.width;
            this.xVel = 0;
        }
        if (this.y + this.height > _Game__WEBPACK_IMPORTED_MODULE_1__.game.worldHeight) {
            this.y = _Game__WEBPACK_IMPORTED_MODULE_1__.game.worldHeight - this.height;
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


/***/ }),

/***/ "./src/client/ui/Button.ts":
/*!*********************************!*\
  !*** ./src/client/ui/Button.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Button": () => (/* binding */ Button)
/* harmony export */ });
/* harmony import */ var _assets_Assets__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../assets/Assets */ "./src/client/assets/Assets.ts");

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
        this.image = _assets_Assets__WEBPACK_IMPORTED_MODULE_0__.UiAssets.button_unselected;
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
            this.image = _assets_Assets__WEBPACK_IMPORTED_MODULE_0__.UiAssets.button_selected;
        }
        else {
            this.mouseIsOver = false;
            this.image = _assets_Assets__WEBPACK_IMPORTED_MODULE_0__.UiAssets.button_unselected;
        }
    }
    onPressed() {
        this.onPressedCustom();
        console.log("button pressed");
        //AudioAssets.ui.inventoryClack.playRandom();
    }
}


/***/ }),

/***/ "./src/client/ui/InputBox.ts":
/*!***********************************!*\
  !*** ./src/client/ui/InputBox.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "InputBox": () => (/* binding */ InputBox)
/* harmony export */ });
/* harmony import */ var _assets_Assets__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../assets/Assets */ "./src/client/assets/Assets.ts");

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
        this.image = _assets_Assets__WEBPACK_IMPORTED_MODULE_0__.UiAssets.button_unselected;
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
                this.font.drawText(target, this.txt + ":   " + _assets_Assets__WEBPACK_IMPORTED_MODULE_0__.Keys.keyboardMap[this.value], x + 6 * upscaleSize, Math.round((this.y + this.h / 2) / upscaleSize) * upscaleSize - 6 * upscaleSize);
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
            this.image = _assets_Assets__WEBPACK_IMPORTED_MODULE_0__.UiAssets.button_selected;
            return;
        }
        this.image = _assets_Assets__WEBPACK_IMPORTED_MODULE_0__.UiAssets.button_unselected;
        // AudioAssets.ui.inventoryClack.playRandom();
    }
}


/***/ }),

/***/ "./src/client/ui/UiFrame.ts":
/*!**********************************!*\
  !*** ./src/client/ui/UiFrame.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "UiFrame": () => (/* binding */ UiFrame)
/* harmony export */ });
/* harmony import */ var _assets_Assets__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../assets/Assets */ "./src/client/assets/Assets.ts");

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
        _assets_Assets__WEBPACK_IMPORTED_MODULE_0__.UiAssets.ui_frame.renderPartial(target, x, y, 7 * upscaleSize, 7 * upscaleSize, 0, 0, 7, 7);
        _assets_Assets__WEBPACK_IMPORTED_MODULE_0__.UiAssets.ui_frame.renderPartial(target, x + w - 7 * upscaleSize, y, 7 * upscaleSize, 7 * upscaleSize, 8, 0, 7, 7);
        _assets_Assets__WEBPACK_IMPORTED_MODULE_0__.UiAssets.ui_frame.renderPartial(target, x, y + h - 7 * upscaleSize, 7 * upscaleSize, 7 * upscaleSize, 0, 8, 7, 7);
        _assets_Assets__WEBPACK_IMPORTED_MODULE_0__.UiAssets.ui_frame.renderPartial(target, x + w - 7 * upscaleSize, y + h - 7 * upscaleSize, 7 * upscaleSize, 7 * upscaleSize, 8, 8, 7, 7);
        // top and bottom
        _assets_Assets__WEBPACK_IMPORTED_MODULE_0__.UiAssets.ui_frame.renderPartial(target, x + 7 * upscaleSize, y, w - 14 * upscaleSize, 7 * upscaleSize, 7, 0, 1, 7);
        _assets_Assets__WEBPACK_IMPORTED_MODULE_0__.UiAssets.ui_frame.renderPartial(target, x + 7 * upscaleSize, y + h - 7 * upscaleSize, w - 14 * upscaleSize, 7 * upscaleSize, 7, 8, 1, 7);
        // left and right
        _assets_Assets__WEBPACK_IMPORTED_MODULE_0__.UiAssets.ui_frame.renderPartial(target, x, y + 7 * upscaleSize, 7 * upscaleSize, h - 14 * upscaleSize, 0, 7, 7, 1);
        _assets_Assets__WEBPACK_IMPORTED_MODULE_0__.UiAssets.ui_frame.renderPartial(target, x + w - 7 * upscaleSize, y + 7 * upscaleSize, 7 * upscaleSize, h - 14 * upscaleSize, 8, 7, 7, 1);
        // center
        _assets_Assets__WEBPACK_IMPORTED_MODULE_0__.UiAssets.ui_frame.renderPartial(target, x + 7 * upscaleSize, y + 7 * upscaleSize, w - 14 * upscaleSize, h - 14 * upscaleSize, 7, 7, 1, 1);
    }
}


/***/ }),

/***/ "./src/client/ui/UiScreen.ts":
/*!***********************************!*\
  !*** ./src/client/ui/UiScreen.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "UiScreen": () => (/* binding */ UiScreen)
/* harmony export */ });
/* harmony import */ var _Game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Game */ "./src/client/Game.ts");
/* harmony import */ var _assets_Assets__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../assets/Assets */ "./src/client/assets/Assets.ts");


class UiScreen {
    constructor() {
        this.minScroll = 0;
        this.maxScroll = 0;
    }
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
                i.updateSliderPosition(_Game__WEBPACK_IMPORTED_MODULE_0__.game.mouseX);
                if (_Game__WEBPACK_IMPORTED_MODULE_0__.game.mouseX > i.x && _Game__WEBPACK_IMPORTED_MODULE_0__.game.mouseX < i.x + i.w && _Game__WEBPACK_IMPORTED_MODULE_0__.game.mouseY > i.y && _Game__WEBPACK_IMPORTED_MODULE_0__.game.mouseY < i.y + i.h)
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
                    _Game__WEBPACK_IMPORTED_MODULE_0__.game.controls[i.index].keyCode = btn;
                    _Game__WEBPACK_IMPORTED_MODULE_0__.game.controls[i.index].keyboard = false;
                    i.value = btn;
                    i.keyboard = false;
                    i.image = _assets_Assets__WEBPACK_IMPORTED_MODULE_1__.UiAssets.button_unselected;
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


/***/ }),

/***/ "./src/client/ui/screens/ControlsMenu.ts":
/*!***********************************************!*\
  !*** ./src/client/ui/screens/ControlsMenu.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ControlsMenu": () => (/* binding */ ControlsMenu)
/* harmony export */ });
/* harmony import */ var _UiScreen__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../UiScreen */ "./src/client/ui/UiScreen.ts");
/* harmony import */ var _UiFrame__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../UiFrame */ "./src/client/ui/UiFrame.ts");
/* harmony import */ var _Game__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../Game */ "./src/client/Game.ts");
/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Button */ "./src/client/ui/Button.ts");
/* harmony import */ var _OptionsMenu__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./OptionsMenu */ "./src/client/ui/screens/OptionsMenu.ts");
/* harmony import */ var _InputBox__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../InputBox */ "./src/client/ui/InputBox.ts");






class ControlsMenu extends _UiScreen__WEBPACK_IMPORTED_MODULE_0__.UiScreen {
    constructor(font, titleFont, previousMenu) {
        super();
        // make the frame with some default values.  These will later be changed to fit the screen size.
        this.frame = new _UiFrame__WEBPACK_IMPORTED_MODULE_1__.UiFrame(0, 0, 0, 0);
        // make some buttons with default positions
        this.buttons = [
            new _Button__WEBPACK_IMPORTED_MODULE_3__.Button(font, "Back", "Return to the options menu.", 0, 0, 0, 0, () => {
                console.log("options menu");
                _Game__WEBPACK_IMPORTED_MODULE_2__.game.currentUi = new _OptionsMenu__WEBPACK_IMPORTED_MODULE_4__.OptionsMenu(font, titleFont, previousMenu);
            })
        ];
        this.inputBoxes = [
        // new InputBox(font, "Walk Right", true, 68, 0, 0, 0, 0, 0),
        // new InputBox(font, "Walk Left", true, 65, 1, 0, 0, 0, 0),
        // new InputBox(font, "Jump", true, 32, 2, 0, 0, 0, 0),
        // new InputBox(font, "Pause", true, 27, 3, 0, 0, 0, 0)
        ];
        let i = 0;
        for (let control of _Game__WEBPACK_IMPORTED_MODULE_2__.game.controls) {
            i++;
            this.inputBoxes.push(new _InputBox__WEBPACK_IMPORTED_MODULE_5__.InputBox(font, control.description, control.keyboard, control.keyCode, i, 0, 0, 0, 0));
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
        this.frame.x = _Game__WEBPACK_IMPORTED_MODULE_2__.game.width / 2 - 200 / 2 * _Game__WEBPACK_IMPORTED_MODULE_2__.game.upscaleSize; // center the frame in the center of the screen
        this.frame.y = _Game__WEBPACK_IMPORTED_MODULE_2__.game.height / 2 - 56 * _Game__WEBPACK_IMPORTED_MODULE_2__.game.upscaleSize;
        this.frame.w = 200 * _Game__WEBPACK_IMPORTED_MODULE_2__.game.upscaleSize;
        this.frame.h = 48 * _Game__WEBPACK_IMPORTED_MODULE_2__.game.upscaleSize;
    }
}


/***/ }),

/***/ "./src/client/ui/screens/MainMenu.ts":
/*!*******************************************!*\
  !*** ./src/client/ui/screens/MainMenu.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MainMenu": () => (/* binding */ MainMenu)
/* harmony export */ });
/* harmony import */ var _UiScreen__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../UiScreen */ "./src/client/ui/UiScreen.ts");
/* harmony import */ var _UiFrame__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../UiFrame */ "./src/client/ui/UiFrame.ts");
/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Button */ "./src/client/ui/Button.ts");
/* harmony import */ var _OptionsMenu__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./OptionsMenu */ "./src/client/ui/screens/OptionsMenu.ts");
/* harmony import */ var _assets_Assets__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../assets/Assets */ "./src/client/assets/Assets.ts");
/* harmony import */ var _Game__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../Game */ "./src/client/Game.ts");






class MainMenu extends _UiScreen__WEBPACK_IMPORTED_MODULE_0__.UiScreen {
    constructor(font, titleFont) {
        super();
        this.inputBox = document.getElementById("name");
        if (this.inputBox == null) {
            this.inputBox = document.createElement("input");
            this.inputBox.setAttribute("type", "name");
            this.inputBox.setAttribute("id", "name");
            this.inputBox.setAttribute("placeholder", "Click to Change Username...");
            this.inputBox.oninput = () => {
                let v = document.getElementById("name").value;
                if (v == undefined) {
                    let inputBox = document.getElementById("name");
                    inputBox.value = "error_ undefined value";
                    return;
                }
                v = v.substring(0, 20);
                for (let i = 0; i < v.length; i++) {
                    if (!"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_ ".includes(v[i])) {
                        //console.log("contains bad bad: "+v[i])
                        v = v.slice(0, i) + v.slice(i + 1);
                        i--;
                    }
                }
                let inputBox = document.getElementById("name");
                inputBox.value = v;
            };
            document.body.appendChild(this.inputBox);
        }
        // make the frame with some default values.  These will later be changed to fit the screen size.
        this.frame = new _UiFrame__WEBPACK_IMPORTED_MODULE_1__.UiFrame(0, 0, 0, 0);
        // make 4 buttons with default positions
        this.buttons = [
            new _Button__WEBPACK_IMPORTED_MODULE_2__.Button(font, "Join Game", "Join a game with your friends, or make new ones.", 0, 0, 0, 0, () => {
                var _a;
                console.log("join game");
                let v = document.getElementById("name").value;
                if (v == undefined)
                    v = "ERROR WITH PLAYERNAME";
                while (v[v.length - 1] === " ")
                    v = v.substring(0, v.length - 2);
                while (v.length < 3)
                    v = v + "_";
                _Game__WEBPACK_IMPORTED_MODULE_5__.game.connection.emit('join', 'e4022d403dcc6d19d6a68ba3abfd0a60', v);
                (_a = this.inputBox) === null || _a === void 0 ? void 0 : _a.remove();
                _Game__WEBPACK_IMPORTED_MODULE_5__.game.currentUi = undefined;
            }),
            new _Button__WEBPACK_IMPORTED_MODULE_2__.Button(font, "Options", "Change your keybinds, reduce lag, etc.", 0, 0, 0, 0, () => {
                console.log("options");
                _Game__WEBPACK_IMPORTED_MODULE_5__.game.currentUi = new _OptionsMenu__WEBPACK_IMPORTED_MODULE_3__.OptionsMenu(font, titleFont, "main menu");
            })
        ];
        // update the size of the elements based on the initial screen size
        this.windowUpdate();
    }
    render(target, upscaleSize) {
        // render the rectangular image that the whole menu is on
        this.frame.render(target, upscaleSize);
        _assets_Assets__WEBPACK_IMPORTED_MODULE_4__.UiAssets.title_image.render(target, Math.round(this.frame.x / upscaleSize + 1) * upscaleSize, Math.round(this.frame.y / upscaleSize + 4) * upscaleSize, 256 * upscaleSize, 40 * upscaleSize);
        // loop through the buttons array and render each one.
        for (const item of this.buttons) {
            item.render(target, upscaleSize);
        }
    }
    windowUpdate() {
        if (this.inputBox !== null) {
            this.inputBox.style.top = ((_Game__WEBPACK_IMPORTED_MODULE_5__.game.height / 2) + "px");
            this.inputBox.style.left = ((_Game__WEBPACK_IMPORTED_MODULE_5__.game.width / 2 - 192 / 2 * _Game__WEBPACK_IMPORTED_MODULE_5__.game.upscaleSize) + "px");
            this.inputBox.style.width = ((192 * _Game__WEBPACK_IMPORTED_MODULE_5__.game.upscaleSize - 10) + "px");
            this.inputBox.style.height = ((16 * _Game__WEBPACK_IMPORTED_MODULE_5__.game.upscaleSize - 10) + "px");
            this.inputBox.style.fontSize = ((10 * _Game__WEBPACK_IMPORTED_MODULE_5__.game.upscaleSize) + "px");
            this.inputBox.style.borderRadius = ((6 * _Game__WEBPACK_IMPORTED_MODULE_5__.game.upscaleSize) + "px");
            this.inputBox.style.borderWidth = ((1 * _Game__WEBPACK_IMPORTED_MODULE_5__.game.upscaleSize) + "px");
        }
        // set the position of the frame
        this.frame.x = _Game__WEBPACK_IMPORTED_MODULE_5__.game.width / 2 - 264 / 2 * _Game__WEBPACK_IMPORTED_MODULE_5__.game.upscaleSize; // center the frame in the middle of the screen
        this.frame.y = _Game__WEBPACK_IMPORTED_MODULE_5__.game.height / 2 - 56 * _Game__WEBPACK_IMPORTED_MODULE_5__.game.upscaleSize;
        this.frame.w = 264 * _Game__WEBPACK_IMPORTED_MODULE_5__.game.upscaleSize;
        this.frame.h = 48 * _Game__WEBPACK_IMPORTED_MODULE_5__.game.upscaleSize;
        // set the positions of all the buttons
        for (let i = 0; i < this.buttons.length; i++) {
            this.buttons[i].x = _Game__WEBPACK_IMPORTED_MODULE_5__.game.width / 2 - 192 / 2 * _Game__WEBPACK_IMPORTED_MODULE_5__.game.upscaleSize;
            this.buttons[i].y = _Game__WEBPACK_IMPORTED_MODULE_5__.game.height / 2 + 20 * (i + 1) * _Game__WEBPACK_IMPORTED_MODULE_5__.game.upscaleSize;
            this.buttons[i].w = 192 * _Game__WEBPACK_IMPORTED_MODULE_5__.game.upscaleSize;
            this.buttons[i].h = 16 * _Game__WEBPACK_IMPORTED_MODULE_5__.game.upscaleSize;
            this.buttons[i].updateMouseOver(_Game__WEBPACK_IMPORTED_MODULE_5__.game.mouseX, _Game__WEBPACK_IMPORTED_MODULE_5__.game.mouseY);
        }
    }
}


/***/ }),

/***/ "./src/client/ui/screens/OptionsMenu.ts":
/*!**********************************************!*\
  !*** ./src/client/ui/screens/OptionsMenu.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "OptionsMenu": () => (/* binding */ OptionsMenu)
/* harmony export */ });
/* harmony import */ var _UiScreen__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../UiScreen */ "./src/client/ui/UiScreen.ts");
/* harmony import */ var _UiFrame__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../UiFrame */ "./src/client/ui/UiFrame.ts");
/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Button */ "./src/client/ui/Button.ts");
/* harmony import */ var _MainMenu__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./MainMenu */ "./src/client/ui/screens/MainMenu.ts");
/* harmony import */ var _VideoSettingsMenu__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./VideoSettingsMenu */ "./src/client/ui/screens/VideoSettingsMenu.ts");
/* harmony import */ var _ControlsMenu__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./ControlsMenu */ "./src/client/ui/screens/ControlsMenu.ts");
/* harmony import */ var _Game__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../Game */ "./src/client/Game.ts");
/* harmony import */ var _PauseMenu__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./PauseMenu */ "./src/client/ui/screens/PauseMenu.ts");








class OptionsMenu extends _UiScreen__WEBPACK_IMPORTED_MODULE_0__.UiScreen {
    constructor(font, titleFont, previousMenu) {
        super();
        // make the frame with some default values.  These will later be changed to fit the screen size.
        this.frame = new _UiFrame__WEBPACK_IMPORTED_MODULE_1__.UiFrame(0, 0, 0, 0);
        this.titleFont = titleFont;
        // make some buttons with default positions
        this.buttons = [
            new _Button__WEBPACK_IMPORTED_MODULE_2__.Button(font, "Video Settings", "Change the balance between performance and fidelity.", 0, 0, 0, 0, () => {
                console.log("video settings");
                _Game__WEBPACK_IMPORTED_MODULE_6__.game.currentUi = new _VideoSettingsMenu__WEBPACK_IMPORTED_MODULE_4__.VideoSettingsMenu(font, titleFont, previousMenu);
            }),
            new _Button__WEBPACK_IMPORTED_MODULE_2__.Button(font, "Controls", "Change your keybinds.", 0, 0, 0, 0, () => {
                console.log("control menu");
                _Game__WEBPACK_IMPORTED_MODULE_6__.game.currentUi = new _ControlsMenu__WEBPACK_IMPORTED_MODULE_5__.ControlsMenu(font, titleFont, previousMenu);
            }),
            // new Button(font, "Audio Settings", "Change the volume of different sounds.", 0, 0, 0, 0, () => {
            //     console.log("audio menu");
            //     game.currentUi = new AudioSettingsMenu(font, titleFont);
            // }),
            new _Button__WEBPACK_IMPORTED_MODULE_2__.Button(font, "Back", "Return to the " + previousMenu + ".", 0, 0, 0, 0, () => {
                if (previousMenu === "main menu")
                    _Game__WEBPACK_IMPORTED_MODULE_6__.game.currentUi = new _MainMenu__WEBPACK_IMPORTED_MODULE_3__.MainMenu(font, titleFont);
                else
                    _Game__WEBPACK_IMPORTED_MODULE_6__.game.currentUi = new _PauseMenu__WEBPACK_IMPORTED_MODULE_7__.PauseMenu(font, titleFont);
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
        this.titleFont.drawText(target, "Options", this.frame.x + 54 * _Game__WEBPACK_IMPORTED_MODULE_6__.game.upscaleSize, this.frame.y + 16 * _Game__WEBPACK_IMPORTED_MODULE_6__.game.upscaleSize);
    }
    windowUpdate() {
        // set the position of the frame
        this.frame.x = _Game__WEBPACK_IMPORTED_MODULE_6__.game.width / 2 - 200 / 2 * _Game__WEBPACK_IMPORTED_MODULE_6__.game.upscaleSize; // center the frame in the center of the screen
        this.frame.y = _Game__WEBPACK_IMPORTED_MODULE_6__.game.height / 2 - 56 * _Game__WEBPACK_IMPORTED_MODULE_6__.game.upscaleSize;
        this.frame.w = 200 * _Game__WEBPACK_IMPORTED_MODULE_6__.game.upscaleSize;
        this.frame.h = 48 * _Game__WEBPACK_IMPORTED_MODULE_6__.game.upscaleSize;
        // set the positions of all the buttons
        for (let i = 0; i < this.buttons.length; i++) {
            this.buttons[i].x = _Game__WEBPACK_IMPORTED_MODULE_6__.game.width / 2 - 192 / 2 * _Game__WEBPACK_IMPORTED_MODULE_6__.game.upscaleSize;
            this.buttons[i].y = _Game__WEBPACK_IMPORTED_MODULE_6__.game.height / 2 + 20 * i * _Game__WEBPACK_IMPORTED_MODULE_6__.game.upscaleSize;
            this.buttons[i].w = 192 * _Game__WEBPACK_IMPORTED_MODULE_6__.game.upscaleSize;
            this.buttons[i].h = 16 * _Game__WEBPACK_IMPORTED_MODULE_6__.game.upscaleSize;
            this.buttons[i].updateMouseOver(_Game__WEBPACK_IMPORTED_MODULE_6__.game.mouseX, _Game__WEBPACK_IMPORTED_MODULE_6__.game.mouseY);
        }
    }
}


/***/ }),

/***/ "./src/client/ui/screens/PauseMenu.ts":
/*!********************************************!*\
  !*** ./src/client/ui/screens/PauseMenu.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PauseMenu": () => (/* binding */ PauseMenu)
/* harmony export */ });
/* harmony import */ var _UiScreen__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../UiScreen */ "./src/client/ui/UiScreen.ts");
/* harmony import */ var _UiFrame__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../UiFrame */ "./src/client/ui/UiFrame.ts");
/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Button */ "./src/client/ui/Button.ts");
/* harmony import */ var _OptionsMenu__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./OptionsMenu */ "./src/client/ui/screens/OptionsMenu.ts");
/* harmony import */ var _MainMenu__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./MainMenu */ "./src/client/ui/screens/MainMenu.ts");
/* harmony import */ var _Game__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../Game */ "./src/client/Game.ts");






class PauseMenu extends _UiScreen__WEBPACK_IMPORTED_MODULE_0__.UiScreen {
    constructor(font, titleFont) {
        super();
        // make the frame with some default values.  These will later be changed to fit the screen size.
        this.frame = new _UiFrame__WEBPACK_IMPORTED_MODULE_1__.UiFrame(0, 0, 0, 0);
        this.titleFont = titleFont;
        // make 4 buttons with default positSions
        this.buttons = [
            new _Button__WEBPACK_IMPORTED_MODULE_2__.Button(font, "Resume game", "Go back to the game.", 0, 0, 0, 0, () => {
                _Game__WEBPACK_IMPORTED_MODULE_5__.game.currentUi = undefined;
            }),
            new _Button__WEBPACK_IMPORTED_MODULE_2__.Button(font, "Options", "Change your keybinds, reduce lag, etc.", 0, 0, 0, 0, () => {
                _Game__WEBPACK_IMPORTED_MODULE_5__.game.currentUi = new _OptionsMenu__WEBPACK_IMPORTED_MODULE_3__.OptionsMenu(font, titleFont, "pause menu");
            }),
            new _Button__WEBPACK_IMPORTED_MODULE_2__.Button(font, "Leave game", "Go back to Main Menu", 0, 0, 0, 0, () => {
                _Game__WEBPACK_IMPORTED_MODULE_5__.game.currentUi = new _MainMenu__WEBPACK_IMPORTED_MODULE_4__.MainMenu(font, titleFont);
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
        this.titleFont.drawText(target, "Paused", this.frame.x + 54 * _Game__WEBPACK_IMPORTED_MODULE_5__.game.upscaleSize, this.frame.y + 16 * _Game__WEBPACK_IMPORTED_MODULE_5__.game.upscaleSize);
    }
    windowUpdate() {
        // set the position of the frame
        this.frame.x = _Game__WEBPACK_IMPORTED_MODULE_5__.game.width / 2 - 200 / 2 * _Game__WEBPACK_IMPORTED_MODULE_5__.game.upscaleSize; // center the frame in the middle of the screen
        this.frame.y = _Game__WEBPACK_IMPORTED_MODULE_5__.game.height / 2 - 72 * _Game__WEBPACK_IMPORTED_MODULE_5__.game.upscaleSize;
        this.frame.w = 200 * _Game__WEBPACK_IMPORTED_MODULE_5__.game.upscaleSize;
        this.frame.h = 54 * _Game__WEBPACK_IMPORTED_MODULE_5__.game.upscaleSize;
        // set the positions of all the buttons
        for (let i = 0; i < this.buttons.length; i++) {
            this.buttons[i].x = _Game__WEBPACK_IMPORTED_MODULE_5__.game.width / 2 - 192 / 2 * _Game__WEBPACK_IMPORTED_MODULE_5__.game.upscaleSize;
            this.buttons[i].y = _Game__WEBPACK_IMPORTED_MODULE_5__.game.height / 2 + 20 * i * _Game__WEBPACK_IMPORTED_MODULE_5__.game.upscaleSize;
            this.buttons[i].w = 192 * _Game__WEBPACK_IMPORTED_MODULE_5__.game.upscaleSize;
            this.buttons[i].h = 16 * _Game__WEBPACK_IMPORTED_MODULE_5__.game.upscaleSize;
            this.buttons[i].updateMouseOver(_Game__WEBPACK_IMPORTED_MODULE_5__.game.mouseX, _Game__WEBPACK_IMPORTED_MODULE_5__.game.mouseY);
        }
    }
}


/***/ }),

/***/ "./src/client/ui/screens/VideoSettingsMenu.ts":
/*!****************************************************!*\
  !*** ./src/client/ui/screens/VideoSettingsMenu.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "VideoSettingsMenu": () => (/* binding */ VideoSettingsMenu)
/* harmony export */ });
/* harmony import */ var _UiScreen__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../UiScreen */ "./src/client/ui/UiScreen.ts");
/* harmony import */ var _UiFrame__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../UiFrame */ "./src/client/ui/UiFrame.ts");
/* harmony import */ var _Game__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../Game */ "./src/client/Game.ts");
/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Button */ "./src/client/ui/Button.ts");
/* harmony import */ var _OptionsMenu__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./OptionsMenu */ "./src/client/ui/screens/OptionsMenu.ts");





class VideoSettingsMenu extends _UiScreen__WEBPACK_IMPORTED_MODULE_0__.UiScreen {
    constructor(font, titleFont, previousMenu) {
        super();
        // make the frame with some default values.  These will later be changed to fit the screen size.
        this.frame = new _UiFrame__WEBPACK_IMPORTED_MODULE_1__.UiFrame(0, 0, 0, 0);
        if (_Game__WEBPACK_IMPORTED_MODULE_2__.game.skyMod === undefined)
            _Game__WEBPACK_IMPORTED_MODULE_2__.game.skyMod = 2;
        if (_Game__WEBPACK_IMPORTED_MODULE_2__.game.skyToggle === undefined)
            _Game__WEBPACK_IMPORTED_MODULE_2__.game.skyToggle = true;
        if (_Game__WEBPACK_IMPORTED_MODULE_2__.game.particleMultiplier === undefined)
            _Game__WEBPACK_IMPORTED_MODULE_2__.game.particleMultiplier = 1;
        let tempSkyModeText;
        if (_Game__WEBPACK_IMPORTED_MODULE_2__.game.skyMod === 2) {
            tempSkyModeText = "Half Framerate";
        }
        else if (_Game__WEBPACK_IMPORTED_MODULE_2__.game.skyMod === 1) {
            tempSkyModeText = "Full Framerate";
        }
        else {
            tempSkyModeText = "Solid Color";
        }
        let tempParticleText;
        if (_Game__WEBPACK_IMPORTED_MODULE_2__.game.particleMultiplier === 2) {
            tempParticleText = "Double";
        }
        else if (_Game__WEBPACK_IMPORTED_MODULE_2__.game.particleMultiplier === 1) {
            tempParticleText = "Normal";
        }
        else {
            tempParticleText = "Minimal";
        }
        // make some buttons with default positions
        this.buttons = [
            new _Button__WEBPACK_IMPORTED_MODULE_3__.Button(font, `Sky: ${tempSkyModeText}`, "Change the appearance of the sky.", 0, 0, 0, 0, () => {
                console.log("sky toggle");
                if (this.buttons[0].txt === "Sky: Half Framerate") {
                    this.buttons[0].txt = "Sky: Full Framerate";
                    _Game__WEBPACK_IMPORTED_MODULE_2__.game.skyMod = 1;
                    _Game__WEBPACK_IMPORTED_MODULE_2__.game.skyToggle = true;
                }
                else if (this.buttons[0].txt === "Sky: Full Framerate") {
                    this.buttons[0].txt = "Sky: Solid Color";
                    _Game__WEBPACK_IMPORTED_MODULE_2__.game.skyToggle = false;
                }
                else {
                    this.buttons[0].txt = "Sky: Half Framerate";
                    _Game__WEBPACK_IMPORTED_MODULE_2__.game.skyMod = 2;
                    _Game__WEBPACK_IMPORTED_MODULE_2__.game.skyToggle = true;
                }
            }),
            new _Button__WEBPACK_IMPORTED_MODULE_3__.Button(font, `Particles: ${tempParticleText}`, "Change the amount of particles", 0, 0, 0, 0, () => {
                console.log("particles");
                if (this.buttons[1].txt === "Particles: Normal") {
                    this.buttons[1].txt = "Particles: Double";
                    _Game__WEBPACK_IMPORTED_MODULE_2__.game.particleMultiplier = 2;
                }
                else if (this.buttons[1].txt === "Particles: Double") {
                    this.buttons[1].txt = "Particles: Minimal";
                    _Game__WEBPACK_IMPORTED_MODULE_2__.game.particleMultiplier = 0.5;
                }
                else {
                    this.buttons[1].txt = "Particles: Normal";
                    _Game__WEBPACK_IMPORTED_MODULE_2__.game.particleMultiplier = 1;
                }
            }),
            new _Button__WEBPACK_IMPORTED_MODULE_3__.Button(font, "Back", "Return to the main menu.", 0, 0, 0, 0, () => {
                console.log("main menu");
                _Game__WEBPACK_IMPORTED_MODULE_2__.game.currentUi = new _OptionsMenu__WEBPACK_IMPORTED_MODULE_4__.OptionsMenu(font, titleFont, previousMenu);
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
        this.frame.x = _Game__WEBPACK_IMPORTED_MODULE_2__.game.width / 2 - 200 / 2 * _Game__WEBPACK_IMPORTED_MODULE_2__.game.upscaleSize; // center the frame in the center of the screen
        this.frame.y = _Game__WEBPACK_IMPORTED_MODULE_2__.game.height / 2 - 56 * _Game__WEBPACK_IMPORTED_MODULE_2__.game.upscaleSize;
        this.frame.w = 200 * _Game__WEBPACK_IMPORTED_MODULE_2__.game.upscaleSize;
        this.frame.h = 48 * _Game__WEBPACK_IMPORTED_MODULE_2__.game.upscaleSize;
        // set the positions of all the buttons
        for (let i = 0; i < this.buttons.length; i++) {
            this.buttons[i].x = _Game__WEBPACK_IMPORTED_MODULE_2__.game.width / 2 - 192 / 2 * _Game__WEBPACK_IMPORTED_MODULE_2__.game.upscaleSize;
            this.buttons[i].y = _Game__WEBPACK_IMPORTED_MODULE_2__.game.height / 2 + 20 * i * _Game__WEBPACK_IMPORTED_MODULE_2__.game.upscaleSize;
            this.buttons[i].w = 192 * _Game__WEBPACK_IMPORTED_MODULE_2__.game.upscaleSize;
            this.buttons[i].h = 16 * _Game__WEBPACK_IMPORTED_MODULE_2__.game.upscaleSize;
            this.buttons[i].updateMouseOver(_Game__WEBPACK_IMPORTED_MODULE_2__.game.mouseX, _Game__WEBPACK_IMPORTED_MODULE_2__.game.mouseY);
        }
    }
}


/***/ }),

/***/ "./src/client/world/World.ts":
/*!***********************************!*\
  !*** ./src/client/world/World.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "World": () => (/* binding */ World)
/* harmony export */ });
/* harmony import */ var _Game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Game */ "./src/client/Game.ts");
/* harmony import */ var _geckos_io_snapshot_interpolation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @geckos.io/snapshot-interpolation */ "./node_modules/@geckos.io/snapshot-interpolation/lib/index.js");
/* harmony import */ var _geckos_io_snapshot_interpolation__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_geckos_io_snapshot_interpolation__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _WorldTiles__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./WorldTiles */ "./src/client/world/WorldTiles.ts");
/* harmony import */ var _global_Tile__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../global/Tile */ "./src/global/Tile.ts");
/* harmony import */ var _assets_Assets__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../assets/Assets */ "./src/client/assets/Assets.ts");





class World {
    constructor(width, height, tiles, tileEntities) {
        this.entities = {};
        // Initialize the world with the tiles and dimensions from the server
        this.width = width;
        this.height = height;
        this.worldTiles = tiles;
        this.tileEntities = tileEntities;
        this.snapshotInterpolation = new _geckos_io_snapshot_interpolation__WEBPACK_IMPORTED_MODULE_1__.SnapshotInterpolation();
        this.snapshotInterpolation.interpolationBuffer.set((1000 / _Game__WEBPACK_IMPORTED_MODULE_0__.game.netManager.playerTickRate) * 3);
        this.snapshotInterpolation.config.autoCorrectTimeOffset = true;
        // define the p5.Graphics objects that hold an image of the tiles of the world.  These act sort of like a virtual canvas and can be drawn on just like a normal canvas by using tileLayer.rect();, tileLayer.ellipse();, tileLayer.fill();, etc.
        this.tileLayer = _Game__WEBPACK_IMPORTED_MODULE_0__.game.createGraphics(this.width * _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_WIDTH, this.height * _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_HEIGHT);
        this.loadWorld();
    }
    tick(game) {
        if (this.player !== undefined)
            game.connection.emit('playerUpdate', this.player.x, this.player.y);
    }
    render(target, upscaleSize) {
        // draw the tiles layer onto the screen
        target.image(this.tileLayer, 0, 0, (_Game__WEBPACK_IMPORTED_MODULE_0__.game.width / upscaleSize) * upscaleSize, (_Game__WEBPACK_IMPORTED_MODULE_0__.game.height / upscaleSize) * upscaleSize, _Game__WEBPACK_IMPORTED_MODULE_0__.game.interpolatedCamX * _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_WIDTH, _Game__WEBPACK_IMPORTED_MODULE_0__.game.interpolatedCamY * _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_WIDTH, _Game__WEBPACK_IMPORTED_MODULE_0__.game.width / upscaleSize, _Game__WEBPACK_IMPORTED_MODULE_0__.game.height / upscaleSize);
        this.renderPlayers(target, upscaleSize);
        // target.stroke(0);
        // target.strokeWeight(4);
        // target.noFill();
        // target.rect(target.width - this.width, 0, this.width, this.height);
        // target.image(
        // 	this.tileLayer,
        // 	target.width - this.width,
        // 	0,
        // 	this.width,
        // 	this.height,
        // );
    }
    updatePlayers(snapshot) {
        this.snapshotInterpolation.snapshot.add(snapshot);
    }
    updateTile(tileIndex, tile) {
        // Update the tile and the 4 neighbouring tiles
        this.worldTiles[tileIndex] = tile;
        // erase the broken tiles and its surrounding tiles if they're tiles
        this.tileLayer.erase();
        this.tileLayer.noStroke();
        this.tileLayer.rect(
        //center
        (tileIndex % this.width) * _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_WIDTH, Math.floor(tileIndex / this.width) * _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_HEIGHT, _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_WIDTH, _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_HEIGHT);
        if (tileIndex - 1 >= 0 &&
            typeof this.worldTiles[tileIndex - 1] !== 'string' &&
            this.worldTiles[tileIndex - 1] !== _global_Tile__WEBPACK_IMPORTED_MODULE_3__.TileType.Air) {
            this.tileLayer.rect(
            //left
            ((tileIndex % this.width) - 1) * _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_WIDTH, Math.floor(tileIndex / this.width) * _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_HEIGHT, _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_WIDTH, _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_HEIGHT);
        }
        if (tileIndex + 1 < this.width * this.height &&
            typeof this.worldTiles[tileIndex + 1] !== 'string' &&
            this.worldTiles[tileIndex + 1] !== _global_Tile__WEBPACK_IMPORTED_MODULE_3__.TileType.Air) {
            this.tileLayer.rect(
            //right
            ((tileIndex % this.width) - 1) * _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_WIDTH, Math.floor(tileIndex / this.width) * _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_HEIGHT, _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_WIDTH, _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_HEIGHT);
        }
        if (tileIndex - this.width >= 0 &&
            typeof this.worldTiles[tileIndex - this.width] !== 'string' &&
            this.worldTiles[tileIndex - this.width] !== _global_Tile__WEBPACK_IMPORTED_MODULE_3__.TileType.Air) {
            this.tileLayer.rect(
            //top
            (tileIndex % this.width) * _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_WIDTH, (Math.floor(tileIndex / this.width) - 1) * _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_HEIGHT, _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_WIDTH, _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_HEIGHT);
        }
        if (tileIndex + this.width < this.width * this.height &&
            typeof this.worldTiles[tileIndex + this.width] !== 'string' &&
            this.worldTiles[tileIndex + this.width] !== _global_Tile__WEBPACK_IMPORTED_MODULE_3__.TileType.Air) {
            this.tileLayer.rect(
            //bottom
            (tileIndex % this.width) * _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_WIDTH, (Math.floor(tileIndex / this.width) + 1) * _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_HEIGHT, _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_WIDTH, _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_HEIGHT);
        }
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
            if (!calculatedSnapshot) {
                console.warn("no calculated snapshot");
            }
            else {
                const state = calculatedSnapshot.state;
                if (!state) {
                    console.warn("no calculated snapshot state");
                }
                else {
                    // The new positions of entities as object
                    state.forEach(({ id, x, y }) => {
                        positionStates[id] = { x, y };
                    });
                }
            }
        }
        catch (e) {
            {
                console.warn("error in renderPlayers");
                return;
            }
        }
        // Render each entity in the order they appear
        Object.entries(this.entities).forEach((entity) => {
            const updatedPosition = positionStates[entity[0]];
            if (updatedPosition !== undefined) {
                entity[1].x = updatedPosition.x;
                entity[1].y = updatedPosition.y;
            }
            entity[1].render(target, upscaleSize);
        });
        // Render the player on top
        if (this.player !== undefined) {
            this.player.findInterpolatedCoordinates();
            this.player.render(target, upscaleSize);
        }
    }
    loadWorld() {
        var _a;
        this.tileLayer.noStroke();
        for (let x = 0; x < this.height; x++) {
            //x and y are switched for some stupid reason
            // i will be the y position of tiles being drawn
            for (let y = 0; y < this.width; y++) {
                const tileVal = this.worldTiles[x * this.width + y];
                if (typeof tileVal === 'string') {
                    if (this.tileEntities === undefined) {
                        console.error('tile entity array is undefined');
                    }
                    if (this.tileEntities[tileVal] === undefined) {
                        console.error('tile entity ' + tileVal + ' is undefined');
                    }
                    const topLeft = Math.min(...this.tileEntities[tileVal].coveredTiles);
                    if (x * this.width + y === topLeft) {
                        //render tile entity image
                        let img = _assets_Assets__WEBPACK_IMPORTED_MODULE_4__.WorldAssets.tileEntities[this.tileEntities[tileVal].payload.type_][this.tileEntities[tileVal].animFrame];
                        img.render(this.tileLayer, y * _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_WIDTH, x * _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_HEIGHT, img.image.width, img.image.height);
                    }
                    else {
                        //console.log(`Already rendered ${tileVal}`);
                    }
                    continue;
                }
                if (tileVal !== _global_Tile__WEBPACK_IMPORTED_MODULE_3__.TileType.Air) {
                    // Draw the correct image for the tiles onto the tiles layer
                    const tile = _WorldTiles__WEBPACK_IMPORTED_MODULE_2__.WorldTiles[tileVal];
                    if (tile === undefined)
                        continue;
                    if (tile.connected && 'renderTile' in tile.texture) {
                        // Render connected tiles
                        tile.texture.renderTile(this.findTilesetIndex(x, y, tileVal, (_a = _WorldTiles__WEBPACK_IMPORTED_MODULE_2__.WorldTiles[tileVal]) === null || _a === void 0 ? void 0 : _a.anyConnection), this.tileLayer, y * _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_WIDTH, x * _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_HEIGHT, _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_WIDTH, _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_HEIGHT);
                    }
                    else {
                        // Render non-connected tiles
                        tile.texture.render(this.tileLayer, y * _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_WIDTH, x * _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_HEIGHT, _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_WIDTH, _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_HEIGHT);
                    }
                }
            }
        }
        for (let tileEntity of Object.values(this.tileEntities)) {
            let img = _assets_Assets__WEBPACK_IMPORTED_MODULE_4__.WorldAssets.tileEntities[tileEntity.payload.type_][tileEntity.animFrame];
            //console.log("debug1")
            img.renderReflection(this.tileLayer, Math.min(...tileEntity.coveredTiles) % this.width, Math.floor(Math.max(...tileEntity.coveredTiles) / this.width) + 1, img.image.width / _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_WIDTH, img.image.height / _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_HEIGHT, this.worldTiles);
        }
    }
    drawTile(tileIndex) {
        const x = tileIndex % this.width;
        const y = Math.floor(tileIndex / this.width);
        if (this.worldTiles[tileIndex] !== _global_Tile__WEBPACK_IMPORTED_MODULE_3__.TileType.Air) {
            // Draw the correct image for the tiles onto the tiles layer
            const tileVal = this.worldTiles[tileIndex];
            if (typeof tileVal === 'string') {
                if (this.tileEntities[tileVal] === undefined) {
                    console.error('tile entity ' + tileVal + ' is undefined');
                }
                const topLeft = Math.min(...this.tileEntities[tileVal].coveredTiles);
                if (tileIndex === topLeft) {
                    //render tile entity image
                    //this.tileEntities[tileVal].render(tileLayer, x*8, y*8);
                }
                else {
                    //console.log(`Already rendered ${tileVal}`);
                }
                return;
            }
            const tile = _WorldTiles__WEBPACK_IMPORTED_MODULE_2__.WorldTiles[tileVal];
            // if the tiles is off-screen
            if (tile === undefined) {
                return;
            }
            if (tile.connected && 'renderTile' in tile.texture) {
                let topTileBool = false;
                let leftTileBool = false;
                let bottomTileBool = false;
                let rightTileBool = false;
                if (tile.anyConnection) {
                    // test if the neighboring tiles are solid
                    topTileBool =
                        x === 0 ||
                            (this.worldTiles[(y - 1) * this.width + x] !==
                                _global_Tile__WEBPACK_IMPORTED_MODULE_3__.TileType.Air &&
                                typeof this.worldTiles[(y - 1) * this.width + x] !==
                                    'string');
                    leftTileBool =
                        y === 0 ||
                            (this.worldTiles[y * this.width + x - 1] !==
                                _global_Tile__WEBPACK_IMPORTED_MODULE_3__.TileType.Air &&
                                typeof this.worldTiles[y * this.width + x - 1] !==
                                    'string');
                    bottomTileBool =
                        x === this.height - 1 ||
                            (this.worldTiles[(y + 1) * this.width + x] !==
                                _global_Tile__WEBPACK_IMPORTED_MODULE_3__.TileType.Air &&
                                typeof this.worldTiles[(y + 1) * this.width + x] !==
                                    'string');
                    rightTileBool =
                        y === this.width - 1 ||
                            (this.worldTiles[y * this.width + x + 1] !==
                                _global_Tile__WEBPACK_IMPORTED_MODULE_3__.TileType.Air &&
                                typeof this.worldTiles[y * this.width + x + 1] !==
                                    'string');
                    // console.log(["boring", leftTileBool, bottomTileBool, this.worldTiles[x * this.width + y + 1], topTileBool])
                }
                else {
                    // test if the neighboring tiles are the same tile
                    topTileBool =
                        x === 0 ||
                            this.worldTiles[(y - 1) * this.width + x] === tileVal;
                    leftTileBool =
                        y === 0 ||
                            this.worldTiles[y * this.width + x - 1] === tileVal;
                    bottomTileBool =
                        x === this.height - 1 ||
                            this.worldTiles[(y + 1) * this.width + x] === tileVal;
                    rightTileBool =
                        y === this.width - 1 ||
                            this.worldTiles[y * this.width + x + 1] === tileVal;
                    //console.log(["fancy", leftTileBool, bottomTileBool, rightTileBool, topTileBool])
                }
                this.worldTiles[tileIndex + 1] !== _global_Tile__WEBPACK_IMPORTED_MODULE_3__.TileType.Air;
                // convert 4 digit binary number to base 10
                const tileSetIndex = 8 * +topTileBool +
                    4 * +rightTileBool +
                    2 * +bottomTileBool +
                    +leftTileBool;
                // Render connected tiles
                tile.texture.renderTile(tileSetIndex, this.tileLayer, x * _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_WIDTH, y * _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_HEIGHT, _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_WIDTH, _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_HEIGHT);
            }
            else if (!tile.connected) {
                // Render non-connected tiles
                tile.texture.render(this.tileLayer, x * _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_WIDTH, y * _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_HEIGHT, _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_WIDTH, _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_HEIGHT);
            }
            for (let tileEntity of Object.values(this.tileEntities)) {
                if (tileEntity.reflectedTiles.includes(tileIndex)) {
                    console.log("reflection at index " + tileIndex);
                    const topLeft = Math.min(...tileEntity.reflectedTiles);
                    const tileEntityReflectionImage = _assets_Assets__WEBPACK_IMPORTED_MODULE_4__.WorldAssets.tileEntities[tileEntity.payload.type_][tileEntity.animFrame];
                    this.tileLayer.drawingContext.globalAlpha = tileEntityReflectionImage.reflectivityArray[tileVal] / 255; //TODO make this based on the tile reflectivity
                    this.tileLayer.image(tileEntityReflectionImage.reflection, x * _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_WIDTH, y * _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_HEIGHT, _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_WIDTH, _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_HEIGHT, (x - topLeft % this.width) * _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_WIDTH, (y - Math.floor(topLeft / this.width)) * _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_HEIGHT, _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_WIDTH, _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_HEIGHT);
                    this.tileLayer.drawingContext.globalAlpha = 1.0;
                    //WorldAssets.tileEntities[tileEntity.type_][tileEntity.animFrame].renderPartialWorldspaceReflection(this.tileLayer, tileIndex%this.width, Math.floor(tileIndex/this.width), topLeft%this.width, Math.floor(topLeft/this.width));
                }
            }
        }
    }
    findTilesetIndex(x, y, tileVal, anyConnection) {
        let topTileBool = false;
        let leftTileBool = false;
        let bottomTileBool = false;
        let rightTileBool = false;
        if (anyConnection) {
            // test if the neighboring tiles are solid
            topTileBool =
                x === 0 ||
                    (this.worldTiles[(x - 1) * this.width + y] !== _global_Tile__WEBPACK_IMPORTED_MODULE_3__.TileType.Air && //x and y appear to be switched
                        typeof this.worldTiles[(x - 1) * this.width + y] ==
                            'number');
            leftTileBool =
                y === 0 ||
                    (this.worldTiles[x * this.width + y - 1] !== _global_Tile__WEBPACK_IMPORTED_MODULE_3__.TileType.Air &&
                        typeof this.worldTiles[x * this.width + y - 1] ==
                            'number');
            bottomTileBool =
                x === this.height - 1 ||
                    (this.worldTiles[(x + 1) * this.width + y] !== _global_Tile__WEBPACK_IMPORTED_MODULE_3__.TileType.Air &&
                        typeof this.worldTiles[(x + 1) * this.width + y] ==
                            'number');
            rightTileBool =
                y === this.width - 1 ||
                    (this.worldTiles[x * this.width + y + 1] !== _global_Tile__WEBPACK_IMPORTED_MODULE_3__.TileType.Air &&
                        typeof this.worldTiles[x * this.width + y + 1] ==
                            'number');
        }
        else {
            // test if the neighboring tiles are the same tile
            topTileBool =
                x === 0 ||
                    this.worldTiles[(x - 1) * this.width + y] === tileVal;
            leftTileBool =
                y === 0 || this.worldTiles[x * this.width + y - 1] === tileVal;
            bottomTileBool =
                x === this.height - 1 ||
                    this.worldTiles[(x + 1) * this.width + y] === tileVal;
            rightTileBool =
                y === this.width - 1 ||
                    this.worldTiles[x * this.width + y + 1] === tileVal;
        }
        // convert 4 digit binary number to base 10
        return (8 * +topTileBool +
            4 * +rightTileBool +
            2 * +bottomTileBool +
            +leftTileBool);
    }
}


/***/ }),

/***/ "./src/client/world/WorldTiles.ts":
/*!****************************************!*\
  !*** ./src/client/world/WorldTiles.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "WorldTiles": () => (/* binding */ WorldTiles)
/* harmony export */ });
/* harmony import */ var _assets_Assets__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../assets/Assets */ "./src/client/assets/Assets.ts");
/* harmony import */ var _global_Tile__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../global/Tile */ "./src/global/Tile.ts");


const WorldTiles = {
    [_global_Tile__WEBPACK_IMPORTED_MODULE_1__.TileType.Air]: undefined,
    [_global_Tile__WEBPACK_IMPORTED_MODULE_1__.TileType.Snow]: {
        name: 'snow',
        texture: _assets_Assets__WEBPACK_IMPORTED_MODULE_0__.WorldAssets.middleground.tileset_snow,
        connected: true,
        anyConnection: true,
        color: "#cafafc",
        friction: 2,
        reflectivity: 60,
        breakSound: _assets_Assets__WEBPACK_IMPORTED_MODULE_0__.AudioAssets.world.softplosive
    },
    [_global_Tile__WEBPACK_IMPORTED_MODULE_1__.TileType.Ice]: {
        name: 'ice',
        texture: _assets_Assets__WEBPACK_IMPORTED_MODULE_0__.WorldAssets.middleground.tileset_ice,
        connected: true,
        anyConnection: true,
        color: "#76adc4",
        friction: 1.5,
        reflectivity: 150
    },
    [_global_Tile__WEBPACK_IMPORTED_MODULE_1__.TileType.Dirt]: {
        name: 'dirt',
        texture: _assets_Assets__WEBPACK_IMPORTED_MODULE_0__.WorldAssets.middleground.tileset_dirt,
        connected: true,
        anyConnection: true,
        color: "#4a2e1e",
        friction: 4,
        reflectivity: 0,
        breakSound: _assets_Assets__WEBPACK_IMPORTED_MODULE_0__.AudioAssets.world.texturedplosive
    },
    [_global_Tile__WEBPACK_IMPORTED_MODULE_1__.TileType.Stone0]: {
        name: 'raw stone',
        texture: _assets_Assets__WEBPACK_IMPORTED_MODULE_0__.WorldAssets.middleground.tileset_stone0,
        connected: true,
        anyConnection: true,
        color: "#414245",
        friction: 3,
        reflectivity: 10
    },
    [_global_Tile__WEBPACK_IMPORTED_MODULE_1__.TileType.Stone1]: {
        name: 'stone tier 1',
        texture: _assets_Assets__WEBPACK_IMPORTED_MODULE_0__.WorldAssets.middleground.tileset_stone1,
        connected: true,
        anyConnection: true,
        color: "#31323b",
        friction: 3,
        reflectivity: 15
    },
    [_global_Tile__WEBPACK_IMPORTED_MODULE_1__.TileType.Stone2]: {
        name: 'stone tier 2',
        texture: _assets_Assets__WEBPACK_IMPORTED_MODULE_0__.WorldAssets.middleground.tileset_stone2,
        connected: true,
        anyConnection: true,
        color: "#31323b",
        friction: 3,
        reflectivity: 17
    },
    [_global_Tile__WEBPACK_IMPORTED_MODULE_1__.TileType.Stone3]: {
        name: 'stone tier 3',
        texture: _assets_Assets__WEBPACK_IMPORTED_MODULE_0__.WorldAssets.middleground.tileset_stone3,
        connected: true,
        anyConnection: true,
        color: "#31323b",
        friction: 3,
        reflectivity: 19
    },
    [_global_Tile__WEBPACK_IMPORTED_MODULE_1__.TileType.Stone4]: {
        name: 'stone tier 4',
        texture: _assets_Assets__WEBPACK_IMPORTED_MODULE_0__.WorldAssets.middleground.tileset_stone4,
        connected: true,
        anyConnection: true,
        color: "#31323b",
        friction: 3,
        reflectivity: 21
    },
    [_global_Tile__WEBPACK_IMPORTED_MODULE_1__.TileType.Stone5]: {
        name: 'stone tier 5',
        texture: _assets_Assets__WEBPACK_IMPORTED_MODULE_0__.WorldAssets.middleground.tileset_stone5,
        connected: true,
        anyConnection: true,
        color: "#31323b",
        friction: 3,
        reflectivity: 23
    },
    [_global_Tile__WEBPACK_IMPORTED_MODULE_1__.TileType.Stone6]: {
        name: 'stone tier 6',
        texture: _assets_Assets__WEBPACK_IMPORTED_MODULE_0__.WorldAssets.middleground.tileset_stone6,
        connected: true,
        anyConnection: true,
        color: "#31323b",
        friction: 3,
        reflectivity: 25
    },
    [_global_Tile__WEBPACK_IMPORTED_MODULE_1__.TileType.Stone7]: {
        name: 'stone tier 7',
        texture: _assets_Assets__WEBPACK_IMPORTED_MODULE_0__.WorldAssets.middleground.tileset_stone7,
        connected: true,
        anyConnection: true,
        color: "#31323b",
        friction: 3,
        reflectivity: 27
    },
    [_global_Tile__WEBPACK_IMPORTED_MODULE_1__.TileType.Stone8]: {
        name: 'stone tier 8',
        texture: _assets_Assets__WEBPACK_IMPORTED_MODULE_0__.WorldAssets.middleground.tileset_stone8,
        connected: true,
        anyConnection: true,
        color: "#31323b",
        friction: 3,
        reflectivity: 29
    },
    [_global_Tile__WEBPACK_IMPORTED_MODULE_1__.TileType.Stone9]: {
        name: 'stone tier 9',
        texture: _assets_Assets__WEBPACK_IMPORTED_MODULE_0__.WorldAssets.middleground.tileset_stone9,
        connected: true,
        anyConnection: true,
        color: "#31323b",
        friction: 3,
        reflectivity: 31
    },
    [_global_Tile__WEBPACK_IMPORTED_MODULE_1__.TileType.Tin]: {
        name: 'tin ore',
        texture: _assets_Assets__WEBPACK_IMPORTED_MODULE_0__.WorldAssets.middleground.tileset_tin,
        connected: true,
        anyConnection: false,
        color: "#31323b",
        friction: 3,
        reflectivity: 10,
        breakSound: _assets_Assets__WEBPACK_IMPORTED_MODULE_0__.AudioAssets.world.metalplosive
    },
    [_global_Tile__WEBPACK_IMPORTED_MODULE_1__.TileType.Aluminum]: {
        name: 'aluminum ore',
        texture: _assets_Assets__WEBPACK_IMPORTED_MODULE_0__.WorldAssets.middleground.tileset_aluminum,
        connected: true,
        anyConnection: false,
        color: "#31323b",
        friction: 3,
        reflectivity: 17,
        breakSound: _assets_Assets__WEBPACK_IMPORTED_MODULE_0__.AudioAssets.world.metalplosive
    },
    [_global_Tile__WEBPACK_IMPORTED_MODULE_1__.TileType.Gold]: {
        name: 'gold ore',
        texture: _assets_Assets__WEBPACK_IMPORTED_MODULE_0__.WorldAssets.middleground.tileset_gold,
        connected: true,
        anyConnection: false,
        color: "#31323b",
        friction: 3,
        reflectivity: 21,
        breakSound: _assets_Assets__WEBPACK_IMPORTED_MODULE_0__.AudioAssets.world.metalplosive
    },
    [_global_Tile__WEBPACK_IMPORTED_MODULE_1__.TileType.Titanium]: {
        name: 'titanium ore',
        texture: _assets_Assets__WEBPACK_IMPORTED_MODULE_0__.WorldAssets.middleground.tileset_titanium,
        connected: true,
        anyConnection: false,
        color: "#31323b",
        friction: 3,
        reflectivity: 25,
        breakSound: _assets_Assets__WEBPACK_IMPORTED_MODULE_0__.AudioAssets.world.metalplosive
    },
    [_global_Tile__WEBPACK_IMPORTED_MODULE_1__.TileType.Grape]: {
        name: 'grape ore',
        texture: _assets_Assets__WEBPACK_IMPORTED_MODULE_0__.WorldAssets.middleground.tileset_grape,
        connected: true,
        anyConnection: false,
        color: "#31323b",
        friction: 3,
        reflectivity: 29,
        breakSound: _assets_Assets__WEBPACK_IMPORTED_MODULE_0__.AudioAssets.world.metalplosive
    },
    [_global_Tile__WEBPACK_IMPORTED_MODULE_1__.TileType.Wood0]: {
        name: 'raw wood',
        texture: _assets_Assets__WEBPACK_IMPORTED_MODULE_0__.WorldAssets.middleground.tileset_wood0,
        connected: true,
        anyConnection: true,
        color: "#a77145",
        friction: 3,
        reflectivity: 5
    },
    [_global_Tile__WEBPACK_IMPORTED_MODULE_1__.TileType.Wood1]: {
        name: 'wood tier 1',
        texture: _assets_Assets__WEBPACK_IMPORTED_MODULE_0__.WorldAssets.middleground.tileset_wood1,
        connected: true,
        anyConnection: true,
        color: "#a77145",
        friction: 3,
        reflectivity: 5
    },
    [_global_Tile__WEBPACK_IMPORTED_MODULE_1__.TileType.Wood2]: {
        name: 'wood tier 2',
        texture: _assets_Assets__WEBPACK_IMPORTED_MODULE_0__.WorldAssets.middleground.tileset_wood2,
        connected: true,
        anyConnection: true,
        color: "#a77145",
        friction: 3,
        reflectivity: 5
    },
    [_global_Tile__WEBPACK_IMPORTED_MODULE_1__.TileType.Wood3]: {
        name: 'wood tier 3',
        texture: _assets_Assets__WEBPACK_IMPORTED_MODULE_0__.WorldAssets.middleground.tileset_wood3,
        connected: true,
        anyConnection: true,
        color: "#a77145",
        friction: 3,
        reflectivity: 5
    },
    [_global_Tile__WEBPACK_IMPORTED_MODULE_1__.TileType.Wood4]: {
        name: 'wood tier 4',
        texture: _assets_Assets__WEBPACK_IMPORTED_MODULE_0__.WorldAssets.middleground.tileset_wood4,
        connected: true,
        anyConnection: true,
        color: "#a77145",
        friction: 3,
        reflectivity: 5
    },
    [_global_Tile__WEBPACK_IMPORTED_MODULE_1__.TileType.Wood5]: {
        name: 'wood tier 5',
        texture: _assets_Assets__WEBPACK_IMPORTED_MODULE_0__.WorldAssets.middleground.tileset_wood5,
        connected: true,
        anyConnection: true,
        color: "#a77145",
        friction: 3,
        reflectivity: 5
    },
    [_global_Tile__WEBPACK_IMPORTED_MODULE_1__.TileType.Wood6]: {
        name: 'wood tier 6',
        texture: _assets_Assets__WEBPACK_IMPORTED_MODULE_0__.WorldAssets.middleground.tileset_wood6,
        connected: true,
        anyConnection: true,
        color: "#a77145",
        friction: 3,
        reflectivity: 5
    },
    [_global_Tile__WEBPACK_IMPORTED_MODULE_1__.TileType.Wood7]: {
        name: 'wood tier 7',
        texture: _assets_Assets__WEBPACK_IMPORTED_MODULE_0__.WorldAssets.middleground.tileset_wood7,
        connected: true,
        anyConnection: true,
        color: "#a77145",
        friction: 3,
        reflectivity: 5
    },
    [_global_Tile__WEBPACK_IMPORTED_MODULE_1__.TileType.Wood8]: {
        name: 'wood tier 8',
        texture: _assets_Assets__WEBPACK_IMPORTED_MODULE_0__.WorldAssets.middleground.tileset_wood8,
        connected: true,
        anyConnection: true,
        color: "#a77145",
        friction: 3,
        reflectivity: 5
    },
    [_global_Tile__WEBPACK_IMPORTED_MODULE_1__.TileType.Wood9]: {
        name: 'wood tier 9',
        texture: _assets_Assets__WEBPACK_IMPORTED_MODULE_0__.WorldAssets.middleground.tileset_wood9,
        connected: true,
        anyConnection: true,
        color: "#a77145",
        friction: 3,
        reflectivity: 5
    },
};
// export const TileEntitiesRenderData: Record<TileEntities, TileEntityRenderData> = {
// [TileEntities.Tier1Drill]: {
// texture: undefined
// },
// [TileEntities.Tier2Drill]: {
// texture: undefined
// }
// }


/***/ }),

/***/ "./src/client/world/entities/Cloud.ts":
/*!********************************************!*\
  !*** ./src/client/world/entities/Cloud.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Cloud": () => (/* binding */ Cloud)
/* harmony export */ });
/* harmony import */ var _Game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../Game */ "./src/client/Game.ts");
/* harmony import */ var _assets_Assets__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../assets/Assets */ "./src/client/assets/Assets.ts");


class Cloud {
    constructor(x, y) {
        this.x = x;
        this.xVel = Math.random() * 0.07 + 0.05;
        this.y = y;
        this.image = _assets_Assets__WEBPACK_IMPORTED_MODULE_1__.WorldAssets.clouds[Math.floor(Math.random() * _assets_Assets__WEBPACK_IMPORTED_MODULE_1__.WorldAssets.clouds.length)];
    }
    render(target, upscaleSize) {
        //console.log(`x: ${this.x}, y: ${this.y}`);
        //draw a cloud at the place :o
        this.image.render(target, (this.x * _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_WIDTH -
            _Game__WEBPACK_IMPORTED_MODULE_0__.game.interpolatedCamX * _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_WIDTH) *
            upscaleSize, (this.y * _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_HEIGHT -
            _Game__WEBPACK_IMPORTED_MODULE_0__.game.interpolatedCamY * _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_HEIGHT) *
            upscaleSize, this.image.image.width * upscaleSize, this.image.image.height * upscaleSize);
    }
    tick() {
        this.x += this.xVel;
        let n = ((_Game__WEBPACK_IMPORTED_MODULE_0__.game.width / _Game__WEBPACK_IMPORTED_MODULE_0__.game.upscaleSize + 50) / _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_WIDTH);
        let x = this.x - _Game__WEBPACK_IMPORTED_MODULE_0__.game.interpolatedCamX + 50 / _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_WIDTH;
        this.x = mod(x, n) + _Game__WEBPACK_IMPORTED_MODULE_0__.game.interpolatedCamX - 50 / _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_WIDTH;
    }
}
function mod(x1, x2) {
    return ((x1 % x2) + x2) % x2;
}


/***/ }),

/***/ "./src/client/world/entities/DroneEntity.ts":
/*!**************************************************!*\
  !*** ./src/client/world/entities/DroneEntity.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DroneEntity": () => (/* binding */ DroneEntity)
/* harmony export */ });
/* harmony import */ var _ServerEntity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ServerEntity */ "./src/client/world/entities/ServerEntity.ts");
/* harmony import */ var _assets_Assets__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../assets/Assets */ "./src/client/assets/Assets.ts");
/* harmony import */ var _Game__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../Game */ "./src/client/Game.ts");



class DroneEntity extends _ServerEntity__WEBPACK_IMPORTED_MODULE_0__.ServerEntity {
    constructor(payload) {
        super(payload.id);
        this.xVel = 0;
        this.level = 1;
        this.animFrame = 0;
        this.timeInThisAnimationFrame = 0;
        this.level = payload.data.level;
        this.x = payload.data.x;
        this.xVel = payload.data.xVel;
        this.y = payload.data.y;
    }
    render(target, upscaleSize) {
        this.timeInThisAnimationFrame += _Game__WEBPACK_IMPORTED_MODULE_2__.game.deltaTime;
        //console.log(this.animFrame);
        // console.log([this.level, this.animFrame]);
        // console.log(WorldAssets.entities[this.level-1])
        // console.log(WorldAssets.entities[this.level-1][this.animFrame])
        if (this.timeInThisAnimationFrame > 75) {
            this.timeInThisAnimationFrame = 0; //this does introduce some slight inaccuracies vs subtracting it, but, when you tab back into the browser after being tabbed out, subtracting it causes spazzing
            this.animFrame++;
            if (this.animFrame >= _assets_Assets__WEBPACK_IMPORTED_MODULE_1__.WorldAssets.entities[this.level - 1].length) {
                this.animFrame = this.animFrame % _assets_Assets__WEBPACK_IMPORTED_MODULE_1__.WorldAssets.entities[this.level - 1].length;
            }
        }
        const asset = _assets_Assets__WEBPACK_IMPORTED_MODULE_1__.WorldAssets.entities[this.level - 1][this.animFrame];
        if (asset !== undefined) {
            asset.renderRotated(target, (this.x - _Game__WEBPACK_IMPORTED_MODULE_2__.game.interpolatedCamX - 0.45 + (0.1 * Math.random())) * _Game__WEBPACK_IMPORTED_MODULE_2__.game.TILE_WIDTH * _Game__WEBPACK_IMPORTED_MODULE_2__.game.upscaleSize, (this.y - _Game__WEBPACK_IMPORTED_MODULE_2__.game.interpolatedCamY - 0.95 + (0.1 * Math.random())) * _Game__WEBPACK_IMPORTED_MODULE_2__.game.TILE_HEIGHT * _Game__WEBPACK_IMPORTED_MODULE_2__.game.upscaleSize, 8 * upscaleSize, 16 * upscaleSize, this.xVel * 0.2);
        }
    }
    updateData(data) {
        this.x = data.data.x;
        this.y = data.data.y;
        this.xVel = data.data.xVel;
    }
}


/***/ }),

/***/ "./src/client/world/entities/EntityClasses.ts":
/*!****************************************************!*\
  !*** ./src/client/world/entities/EntityClasses.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EntityClasses": () => (/* binding */ EntityClasses)
/* harmony export */ });
/* harmony import */ var _global_Entity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../global/Entity */ "./src/global/Entity.ts");
/* harmony import */ var _PlayerEntity__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./PlayerEntity */ "./src/client/world/entities/PlayerEntity.ts");
/* harmony import */ var _ItemEntity__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ItemEntity */ "./src/client/world/entities/ItemEntity.ts");
/* harmony import */ var _DroneEntity__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./DroneEntity */ "./src/client/world/entities/DroneEntity.ts");




const EntityClasses = {
    [_global_Entity__WEBPACK_IMPORTED_MODULE_0__.Entities.LocalPlayer]: undefined,
    [_global_Entity__WEBPACK_IMPORTED_MODULE_0__.Entities.Player]: _PlayerEntity__WEBPACK_IMPORTED_MODULE_1__.PlayerEntity,
    [_global_Entity__WEBPACK_IMPORTED_MODULE_0__.Entities.Item]: _ItemEntity__WEBPACK_IMPORTED_MODULE_2__.ItemEntity,
    [_global_Entity__WEBPACK_IMPORTED_MODULE_0__.Entities.Drone]: _DroneEntity__WEBPACK_IMPORTED_MODULE_3__.DroneEntity,
};


/***/ }),

/***/ "./src/client/world/entities/ItemEntity.ts":
/*!*************************************************!*\
  !*** ./src/client/world/entities/ItemEntity.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ItemEntity": () => (/* binding */ ItemEntity)
/* harmony export */ });
/* harmony import */ var _ServerEntity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ServerEntity */ "./src/client/world/entities/ServerEntity.ts");
/* harmony import */ var _assets_Assets__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../assets/Assets */ "./src/client/assets/Assets.ts");


class ItemEntity extends _ServerEntity__WEBPACK_IMPORTED_MODULE_0__.ServerEntity {
    constructor(payload) {
        super(payload.id);
        this.item = payload.data.item;
        this.x = payload.data.x;
        this.y = payload.data.y;
    }
    render(target, upscaleSize) {
        const asset = _assets_Assets__WEBPACK_IMPORTED_MODULE_1__.ItemAssets[this.item];
        if (asset !== undefined) {
            asset.render(target, this.x, this.y, 8, 8);
        }
    }
    updateData(data) {
        this.item = data.data.item;
        this.x = data.data.x;
        this.y = data.data.y;
    }
}


/***/ }),

/***/ "./src/client/world/entities/PlayerEntity.ts":
/*!***************************************************!*\
  !*** ./src/client/world/entities/PlayerEntity.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PlayerEntity": () => (/* binding */ PlayerEntity),
/* harmony export */   "hslToRgb": () => (/* binding */ hslToRgb)
/* harmony export */ });
/* harmony import */ var _ServerEntity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ServerEntity */ "./src/client/world/entities/ServerEntity.ts");
/* harmony import */ var _global_Entity__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../global/Entity */ "./src/global/Entity.ts");
/* harmony import */ var _Game__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../Game */ "./src/client/Game.ts");
/* harmony import */ var _assets_Assets__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../assets/Assets */ "./src/client/assets/Assets.ts");
/* harmony import */ var _assets_resources_ReflectedImageResource__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../assets/resources/ReflectedImageResource */ "./src/client/assets/resources/ReflectedImageResource.ts");





class PlayerEntity extends _ServerEntity__WEBPACK_IMPORTED_MODULE_0__.ServerEntity {
    constructor(data) {
        super(data.id);
        this.width = 12 / _Game__WEBPACK_IMPORTED_MODULE_2__.game.TILE_WIDTH;
        this.height = 28 / _Game__WEBPACK_IMPORTED_MODULE_2__.game.TILE_HEIGHT;
        this.currentAnimation = "idle";
        this.timeInThisAnimationFrame = 0;
        this.animFrame = 0;
        this.animations = {};
        if (data.type === _global_Entity__WEBPACK_IMPORTED_MODULE_1__.Entities.Player) {
            this.name = data.data.name;
        }
        data.id = data.id.split("-").join(""); //string.prototype.replaceAll requires ES2021
        this.idNumber = (Number("0x" + data.id) / 100000000000000000000000000000) % 1; //get a number 0-1 pseudorandomly selected from the uuid of the player
        console.log(this.idNumber);
        this.color1 = hslToRgb(this.idNumber, 1, 0.45); //convert this to two HSL colors which are then converted to two RGB colors: one light and one dark
        this.color2 = hslToRgb(this.idNumber, 1, 0.3);
        console.log(`creating animations for player with colors ${this.color1} and ${this.color2}`);
        //console.log("TEST: "+(this.animations.idle[0][0].image===PlayerAnimations.idle[0][0].image))
        // let img = this.animations.idle[0][0].image;
        // img.loadPixels();
        // img.set(3, 10, [0, 255, 0, 255]);
        // img.updatePixels();
        Object.entries(_assets_Assets__WEBPACK_IMPORTED_MODULE_3__.PlayerAnimations).forEach(element => {
            this.animations[element[0]] = [];
            for (let frame of element[1]) {
                this.animations[element[0]].push([new _assets_resources_ReflectedImageResource__WEBPACK_IMPORTED_MODULE_4__.ReflectableImageResource(frame[0].path, this.color1, this.color2), frame[1]]);
                let reflectableResource = this.animations[element[0]][this.animations[element[0]].length - 1][0];
                reflectableResource.loadResource(_Game__WEBPACK_IMPORTED_MODULE_2__.game);
            }
        });
    }
    updateData(data) {
        if (data.type === _global_Entity__WEBPACK_IMPORTED_MODULE_1__.Entities.Player) {
            this.name = data.data.name;
        }
    }
    render(target, upscaleSize) {
        //update animation frame based on deltaTime
        this.timeInThisAnimationFrame += _Game__WEBPACK_IMPORTED_MODULE_2__.game.deltaTime;
        //console.log(this.animFrame);
        // console.log([this.currentAnimation, this.animFrame]);
        // console.log(PlayerAnimations[this.currentAnimation])
        // console.log(PlayerAnimations[this.currentAnimation][this.animFrame])
        if (this.timeInThisAnimationFrame > _assets_Assets__WEBPACK_IMPORTED_MODULE_3__.PlayerAnimations[this.currentAnimation][this.animFrame][1]) {
            this.timeInThisAnimationFrame = 0; //this does introduce some slight inaccuracies vs subtracting it, but, when you tab back into the browser after being tabbed out, subtracting it causes spazzing
            this.animFrame++;
            if (this.animFrame >= _assets_Assets__WEBPACK_IMPORTED_MODULE_3__.PlayerAnimations[this.currentAnimation].length) {
                this.animFrame = this.animFrame % _assets_Assets__WEBPACK_IMPORTED_MODULE_3__.PlayerAnimations[this.currentAnimation].length;
            }
        }
        //PlayerA
        // Render the item quantity label
        this.animations[this.currentAnimation][this.animFrame][0].render(target, (this.x * _Game__WEBPACK_IMPORTED_MODULE_2__.game.TILE_WIDTH -
            _Game__WEBPACK_IMPORTED_MODULE_2__.game.interpolatedCamX * _Game__WEBPACK_IMPORTED_MODULE_2__.game.TILE_WIDTH) *
            upscaleSize, (this.y * _Game__WEBPACK_IMPORTED_MODULE_2__.game.TILE_HEIGHT -
            _Game__WEBPACK_IMPORTED_MODULE_2__.game.interpolatedCamY * _Game__WEBPACK_IMPORTED_MODULE_2__.game.TILE_HEIGHT) *
            upscaleSize, this.width * upscaleSize * _Game__WEBPACK_IMPORTED_MODULE_2__.game.TILE_WIDTH, this.height * upscaleSize * _Game__WEBPACK_IMPORTED_MODULE_2__.game.TILE_HEIGHT);
        this.animations[this.currentAnimation][this.animFrame][0].renderWorldspaceReflection(_Game__WEBPACK_IMPORTED_MODULE_2__.game, this.x, this.y + this.height, this.width, this.height);
        // target.noStroke();
        // target.textSize(5 * upscaleSize);
        // target.textAlign(target.CENTER, target.TOP);
        target.fill(this.color1);
        target.noStroke();
        target.rect((this.x * _Game__WEBPACK_IMPORTED_MODULE_2__.game.TILE_WIDTH -
            _Game__WEBPACK_IMPORTED_MODULE_2__.game.interpolatedCamX * _Game__WEBPACK_IMPORTED_MODULE_2__.game.TILE_WIDTH +
            (this.width * _Game__WEBPACK_IMPORTED_MODULE_2__.game.TILE_WIDTH) / 2) *
            upscaleSize - (this.name.length * 2 * _Game__WEBPACK_IMPORTED_MODULE_2__.game.upscaleSize), (this.y * _Game__WEBPACK_IMPORTED_MODULE_2__.game.TILE_HEIGHT -
            _Game__WEBPACK_IMPORTED_MODULE_2__.game.interpolatedCamY * _Game__WEBPACK_IMPORTED_MODULE_2__.game.TILE_HEIGHT -
            (this.height * _Game__WEBPACK_IMPORTED_MODULE_2__.game.TILE_HEIGHT) / 2.5 + 6) *
            upscaleSize, (this.name.length * 4 * _Game__WEBPACK_IMPORTED_MODULE_2__.game.upscaleSize), _Game__WEBPACK_IMPORTED_MODULE_2__.game.upscaleSize);
        _assets_Assets__WEBPACK_IMPORTED_MODULE_3__.Fonts.tom_thumb.drawText(_Game__WEBPACK_IMPORTED_MODULE_2__.game, this.name, (this.x * _Game__WEBPACK_IMPORTED_MODULE_2__.game.TILE_WIDTH -
            _Game__WEBPACK_IMPORTED_MODULE_2__.game.interpolatedCamX * _Game__WEBPACK_IMPORTED_MODULE_2__.game.TILE_WIDTH +
            (this.width * _Game__WEBPACK_IMPORTED_MODULE_2__.game.TILE_WIDTH) / 2) *
            upscaleSize - (this.name.length * 2 * _Game__WEBPACK_IMPORTED_MODULE_2__.game.upscaleSize), (this.y * _Game__WEBPACK_IMPORTED_MODULE_2__.game.TILE_HEIGHT -
            _Game__WEBPACK_IMPORTED_MODULE_2__.game.interpolatedCamY * _Game__WEBPACK_IMPORTED_MODULE_2__.game.TILE_HEIGHT -
            (this.height * _Game__WEBPACK_IMPORTED_MODULE_2__.game.TILE_HEIGHT) / 2.5) *
            upscaleSize);
    }
}
function hslToRgb(h, s, l) {
    var r, g, b;
    if (s == 0) {
        r = g = b = l; // achromatic
    }
    else {
        var hue2rgb = function hue2rgb(p, q, t) {
            if (t < 0)
                t += 1;
            if (t > 1)
                t -= 1;
            if (t < 1 / 6)
                return p + (q - p) * 6 * t;
            if (t < 1 / 2)
                return q;
            if (t < 2 / 3)
                return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), 255];
}


/***/ }),

/***/ "./src/client/world/entities/ServerEntity.ts":
/*!***************************************************!*\
  !*** ./src/client/world/entities/ServerEntity.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ServerEntity": () => (/* binding */ ServerEntity)
/* harmony export */ });
class ServerEntity {
    constructor(entityId) {
        this.x = 0;
        this.y = 0;
        this.entityId = entityId;
    }
}


/***/ }),

/***/ "./src/client/world/entities/TileEntity.ts":
/*!*************************************************!*\
  !*** ./src/client/world/entities/TileEntity.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TileEntityAnimations": () => (/* binding */ TileEntityAnimations)
/* harmony export */ });
const TileEntityAnimations = [
    false,
    true,
    true,
    true,
    true,
    true,
    false,
    false, //planted seed
];


/***/ }),

/***/ "./src/client/world/particles/ColorParticle.ts":
/*!*****************************************************!*\
  !*** ./src/client/world/particles/ColorParticle.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ColorParticle": () => (/* binding */ ColorParticle)
/* harmony export */ });
/* harmony import */ var _Game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../Game */ "./src/client/Game.ts");
/* harmony import */ var simplex_noise__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! simplex-noise */ "./node_modules/simplex-noise/dist/esm/simplex-noise.js");


class ColorParticle {
    constructor(color, size, lifespan, x, y, xVel, yVel, gravity, wind) {
        this.color = color;
        this.x = x;
        this.y = y;
        this.xVel = xVel || 0;
        this.yVel = yVel || 0;
        this.size = size;
        this.gravity = true; //using the or modifier with booleans causes bugs; there's probably a better way to do this
        if (gravity !== undefined)
            this.gravity = gravity;
        this.wind = false; //using the or modifier with booleans causes bugs; there's probably a better way to do this
        if (wind !== undefined)
            this.wind = wind;
        this.age = 0;
        this.lifespan = lifespan;
        this.noise = new simplex_noise__WEBPACK_IMPORTED_MODULE_1__["default"]("asdfasdfasdfas");
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
        target.rect((-this.size / 2 + this.x * _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_WIDTH -
            _Game__WEBPACK_IMPORTED_MODULE_0__.game.interpolatedCamX * _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_WIDTH) *
            upscaleSize, (-this.size / 2 + this.y * _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_HEIGHT -
            _Game__WEBPACK_IMPORTED_MODULE_0__.game.interpolatedCamY * _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_HEIGHT) *
            upscaleSize, this.size * upscaleSize * _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_WIDTH, this.size * upscaleSize * _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_HEIGHT);
    }
    tick() {
        this.age++;
        this.x += this.xVel;
        this.y += this.yVel;
        this.xVel -= (Math.abs(this.xVel) * this.xVel * _Game__WEBPACK_IMPORTED_MODULE_0__.game.DRAG_COEFFICIENT * this.size); //assuming constant mass for each particle
        if (this.gravity) {
            this.yVel += _Game__WEBPACK_IMPORTED_MODULE_0__.game.GRAVITY_SPEED;
        }
        if (this.wind) {
            this.xVel += this.noise.noise2D(this.x / 10, this.y / 10) / 40;
            this.yVel += this.noise.noise2D(this.y / 10, this.x / 10) / 40;
        }
        this.yVel -= (Math.abs(this.yVel) * this.yVel * _Game__WEBPACK_IMPORTED_MODULE_0__.game.DRAG_COEFFICIENT * this.size);
    }
}


/***/ }),

/***/ "./src/global/Entity.ts":
/*!******************************!*\
  !*** ./src/global/Entity.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Entities": () => (/* binding */ Entities)
/* harmony export */ });
var Entities;
(function (Entities) {
    Entities[Entities["LocalPlayer"] = 0] = "LocalPlayer";
    Entities[Entities["Player"] = 1] = "Player";
    Entities[Entities["Item"] = 2] = "Item";
    Entities[Entities["Drone"] = 3] = "Drone";
})(Entities || (Entities = {}));


/***/ }),

/***/ "./src/global/Inventory.ts":
/*!*********************************!*\
  !*** ./src/global/Inventory.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ItemCategories": () => (/* binding */ ItemCategories),
/* harmony export */   "ItemType": () => (/* binding */ ItemType),
/* harmony export */   "Items": () => (/* binding */ Items)
/* harmony export */ });
/* harmony import */ var _Tile__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Tile */ "./src/global/Tile.ts");
/* harmony import */ var _TileEntity__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TileEntity */ "./src/global/TileEntity.ts");


const itemTypeData = (data) => data;
var ItemCategories;
(function (ItemCategories) {
    ItemCategories[ItemCategories["Tile"] = 0] = "Tile";
    ItemCategories[ItemCategories["Resource"] = 1] = "Resource";
    ItemCategories[ItemCategories["Tool"] = 2] = "Tool";
    ItemCategories[ItemCategories["TileEntity"] = 3] = "TileEntity";
})(ItemCategories || (ItemCategories = {}));
var ItemType;
(function (ItemType) {
    ItemType[ItemType["SnowBlock"] = 0] = "SnowBlock";
    ItemType[ItemType["IceBlock"] = 1] = "IceBlock";
    ItemType[ItemType["DirtBlock"] = 2] = "DirtBlock";
    ItemType[ItemType["Stone0Block"] = 3] = "Stone0Block";
    ItemType[ItemType["Stone1Block"] = 4] = "Stone1Block";
    ItemType[ItemType["Stone2Block"] = 5] = "Stone2Block";
    ItemType[ItemType["Stone3Block"] = 6] = "Stone3Block";
    ItemType[ItemType["Stone4Block"] = 7] = "Stone4Block";
    ItemType[ItemType["Stone5Block"] = 8] = "Stone5Block";
    ItemType[ItemType["Stone6Block"] = 9] = "Stone6Block";
    ItemType[ItemType["Stone7Block"] = 10] = "Stone7Block";
    ItemType[ItemType["Stone8Block"] = 11] = "Stone8Block";
    ItemType[ItemType["Stone9Block"] = 12] = "Stone9Block";
    ItemType[ItemType["TinBlock"] = 13] = "TinBlock";
    ItemType[ItemType["AluminumBlock"] = 14] = "AluminumBlock";
    ItemType[ItemType["GoldBlock"] = 15] = "GoldBlock";
    ItemType[ItemType["TitaniumBlock"] = 16] = "TitaniumBlock";
    ItemType[ItemType["GrapeBlock"] = 17] = "GrapeBlock";
    ItemType[ItemType["Wood0Block"] = 18] = "Wood0Block";
    ItemType[ItemType["Wood1Block"] = 19] = "Wood1Block";
    ItemType[ItemType["Wood2Block"] = 20] = "Wood2Block";
    ItemType[ItemType["Wood3Block"] = 21] = "Wood3Block";
    ItemType[ItemType["Wood4Block"] = 22] = "Wood4Block";
    ItemType[ItemType["Wood5Block"] = 23] = "Wood5Block";
    ItemType[ItemType["Wood6Block"] = 24] = "Wood6Block";
    ItemType[ItemType["Wood7Block"] = 25] = "Wood7Block";
    ItemType[ItemType["Wood8Block"] = 26] = "Wood8Block";
    ItemType[ItemType["Wood9Block"] = 27] = "Wood9Block";
    ItemType[ItemType["Seed"] = 28] = "Seed";
})(ItemType || (ItemType = {}));
const Items = itemTypeData({
    [ItemType.SnowBlock]: {
        type: ItemCategories.Tile,
        placedTile: _Tile__WEBPACK_IMPORTED_MODULE_0__.TileType.Snow,
    },
    [ItemType.IceBlock]: {
        type: ItemCategories.Tile,
        placedTile: _Tile__WEBPACK_IMPORTED_MODULE_0__.TileType.Ice,
    },
    [ItemType.DirtBlock]: {
        type: ItemCategories.Tile,
        placedTile: _Tile__WEBPACK_IMPORTED_MODULE_0__.TileType.Dirt,
    },
    [ItemType.Stone0Block]: {
        type: ItemCategories.Tile,
        placedTile: _Tile__WEBPACK_IMPORTED_MODULE_0__.TileType.Stone0,
    },
    [ItemType.Stone1Block]: {
        type: ItemCategories.Tile,
        placedTile: _Tile__WEBPACK_IMPORTED_MODULE_0__.TileType.Stone1,
    },
    [ItemType.Stone2Block]: {
        type: ItemCategories.Tile,
        placedTile: _Tile__WEBPACK_IMPORTED_MODULE_0__.TileType.Stone2,
    },
    [ItemType.Stone3Block]: {
        type: ItemCategories.Tile,
        placedTile: _Tile__WEBPACK_IMPORTED_MODULE_0__.TileType.Stone3,
    },
    [ItemType.Stone4Block]: {
        type: ItemCategories.Tile,
        placedTile: _Tile__WEBPACK_IMPORTED_MODULE_0__.TileType.Stone4,
    },
    [ItemType.Stone5Block]: {
        type: ItemCategories.Tile,
        placedTile: _Tile__WEBPACK_IMPORTED_MODULE_0__.TileType.Stone5,
    },
    [ItemType.Stone6Block]: {
        type: ItemCategories.Tile,
        placedTile: _Tile__WEBPACK_IMPORTED_MODULE_0__.TileType.Stone6,
    },
    [ItemType.Stone7Block]: {
        type: ItemCategories.Tile,
        placedTile: _Tile__WEBPACK_IMPORTED_MODULE_0__.TileType.Stone7,
    },
    [ItemType.Stone8Block]: {
        type: ItemCategories.Tile,
        placedTile: _Tile__WEBPACK_IMPORTED_MODULE_0__.TileType.Stone8,
    },
    [ItemType.Stone9Block]: {
        type: ItemCategories.Tile,
        placedTile: _Tile__WEBPACK_IMPORTED_MODULE_0__.TileType.Stone9,
    },
    [ItemType.TinBlock]: {
        type: ItemCategories.Tile,
        placedTile: _Tile__WEBPACK_IMPORTED_MODULE_0__.TileType.Tin,
    },
    [ItemType.AluminumBlock]: {
        type: ItemCategories.Tile,
        placedTile: _Tile__WEBPACK_IMPORTED_MODULE_0__.TileType.Aluminum,
    },
    [ItemType.GoldBlock]: {
        type: ItemCategories.Tile,
        placedTile: _Tile__WEBPACK_IMPORTED_MODULE_0__.TileType.Gold,
    },
    [ItemType.TitaniumBlock]: {
        type: ItemCategories.Tile,
        placedTile: _Tile__WEBPACK_IMPORTED_MODULE_0__.TileType.Titanium,
    },
    [ItemType.GrapeBlock]: {
        type: ItemCategories.Tile,
        placedTile: _Tile__WEBPACK_IMPORTED_MODULE_0__.TileType.Grape,
    },
    [ItemType.Wood0Block]: {
        type: ItemCategories.Tile,
        placedTile: _Tile__WEBPACK_IMPORTED_MODULE_0__.TileType.Wood0,
    },
    [ItemType.Wood1Block]: {
        type: ItemCategories.Tile,
        placedTile: _Tile__WEBPACK_IMPORTED_MODULE_0__.TileType.Wood1,
    },
    [ItemType.Wood2Block]: {
        type: ItemCategories.Tile,
        placedTile: _Tile__WEBPACK_IMPORTED_MODULE_0__.TileType.Wood2,
    },
    [ItemType.Wood3Block]: {
        type: ItemCategories.Tile,
        placedTile: _Tile__WEBPACK_IMPORTED_MODULE_0__.TileType.Wood3,
    },
    [ItemType.Wood4Block]: {
        type: ItemCategories.Tile,
        placedTile: _Tile__WEBPACK_IMPORTED_MODULE_0__.TileType.Wood4,
    },
    [ItemType.Wood5Block]: {
        type: ItemCategories.Tile,
        placedTile: _Tile__WEBPACK_IMPORTED_MODULE_0__.TileType.Wood5,
    },
    [ItemType.Wood6Block]: {
        type: ItemCategories.Tile,
        placedTile: _Tile__WEBPACK_IMPORTED_MODULE_0__.TileType.Wood6,
    },
    [ItemType.Wood7Block]: {
        type: ItemCategories.Tile,
        placedTile: _Tile__WEBPACK_IMPORTED_MODULE_0__.TileType.Wood7,
    },
    [ItemType.Wood8Block]: {
        type: ItemCategories.Tile,
        placedTile: _Tile__WEBPACK_IMPORTED_MODULE_0__.TileType.Wood8,
    },
    [ItemType.Wood9Block]: {
        type: ItemCategories.Tile,
        placedTile: _Tile__WEBPACK_IMPORTED_MODULE_0__.TileType.Wood9,
    },
    [ItemType.Seed]: {
        type: ItemCategories.TileEntity,
        placedTileEntity: _TileEntity__WEBPACK_IMPORTED_MODULE_1__.TileEntities.Seed,
        tileEntityOffset: [-1, -6],
    },
    // [ItemType.TinPickaxe]: {
    // 	type: ItemCategories.Tool,
    // 	breakableTiles: [TileType.Snow, TileType.Ice, TileType.Dirt, TileType.Wood0, TileType.Stone0, TileType.Stone1, TileType.Tin, TileType.Aluminum]
    // }
});


/***/ }),

/***/ "./src/global/Tile.ts":
/*!****************************!*\
  !*** ./src/global/Tile.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TileType": () => (/* binding */ TileType)
/* harmony export */ });
var TileType;
(function (TileType) {
    TileType[TileType["Air"] = 0] = "Air";
    TileType[TileType["Snow"] = 1] = "Snow";
    TileType[TileType["Ice"] = 2] = "Ice";
    TileType[TileType["Dirt"] = 3] = "Dirt";
    TileType[TileType["Stone0"] = 4] = "Stone0";
    TileType[TileType["Stone1"] = 5] = "Stone1";
    TileType[TileType["Stone2"] = 6] = "Stone2";
    TileType[TileType["Stone3"] = 7] = "Stone3";
    TileType[TileType["Stone4"] = 8] = "Stone4";
    TileType[TileType["Stone5"] = 9] = "Stone5";
    TileType[TileType["Stone6"] = 10] = "Stone6";
    TileType[TileType["Stone7"] = 11] = "Stone7";
    TileType[TileType["Stone8"] = 12] = "Stone8";
    TileType[TileType["Stone9"] = 13] = "Stone9";
    TileType[TileType["Tin"] = 14] = "Tin";
    TileType[TileType["Aluminum"] = 15] = "Aluminum";
    TileType[TileType["Gold"] = 16] = "Gold";
    TileType[TileType["Titanium"] = 17] = "Titanium";
    TileType[TileType["Grape"] = 18] = "Grape";
    TileType[TileType["Wood0"] = 19] = "Wood0";
    TileType[TileType["Wood1"] = 20] = "Wood1";
    TileType[TileType["Wood2"] = 21] = "Wood2";
    TileType[TileType["Wood3"] = 22] = "Wood3";
    TileType[TileType["Wood4"] = 23] = "Wood4";
    TileType[TileType["Wood5"] = 24] = "Wood5";
    TileType[TileType["Wood6"] = 25] = "Wood6";
    TileType[TileType["Wood7"] = 26] = "Wood7";
    TileType[TileType["Wood8"] = 27] = "Wood8";
    TileType[TileType["Wood9"] = 28] = "Wood9";
})(TileType || (TileType = {}));


/***/ }),

/***/ "./src/global/TileEntity.ts":
/*!**********************************!*\
  !*** ./src/global/TileEntity.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TileEntities": () => (/* binding */ TileEntities),
/* harmony export */   "TileEntityTextures": () => (/* binding */ TileEntityTextures)
/* harmony export */ });
var TileEntities;
(function (TileEntities) {
    TileEntities[TileEntities["Tree"] = 0] = "Tree";
    TileEntities[TileEntities["Tier1Drill"] = 1] = "Tier1Drill";
    TileEntities[TileEntities["Tier2Drill"] = 2] = "Tier2Drill";
    TileEntities[TileEntities["Tier3Drill"] = 3] = "Tier3Drill";
    TileEntities[TileEntities["Tier4Drill"] = 4] = "Tier4Drill";
    TileEntities[TileEntities["Tier5Drill"] = 5] = "Tier5Drill";
    TileEntities[TileEntities["CraftingBench"] = 6] = "CraftingBench";
    TileEntities[TileEntities["Seed"] = 7] = "Seed";
})(TileEntities || (TileEntities = {}));
var TileEntityTextures;
(function (TileEntityTextures) {
    TileEntityTextures[TileEntityTextures["Tree1"] = 0] = "Tree1";
    TileEntityTextures[TileEntityTextures["Tree2"] = 1] = "Tree2";
    TileEntityTextures[TileEntityTextures["Tree3"] = 2] = "Tree3";
    TileEntityTextures[TileEntityTextures["Tree4"] = 3] = "Tree4";
    TileEntityTextures[TileEntityTextures["Tree5"] = 4] = "Tree5";
    TileEntityTextures[TileEntityTextures["Tree6"] = 5] = "Tree6";
    TileEntityTextures[TileEntityTextures["Tree7"] = 6] = "Tree7";
    TileEntityTextures[TileEntityTextures["Tree8"] = 7] = "Tree8";
    TileEntityTextures[TileEntityTextures["Tree9"] = 8] = "Tree9";
    TileEntityTextures[TileEntityTextures["Tree10"] = 9] = "Tree10";
})(TileEntityTextures || (TileEntityTextures = {}));


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
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
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
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["modules-main"], () => (__webpack_require__("./src/client/Game.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUN4Qyx3Q0FBd0MsQ0FDeEM7SUFDRCxDQUFDLG1FQUFvQixDQUFDLEVBQUUsSUFBSSxtRUFBYSxDQUN4Qyx3Q0FBd0MsQ0FDeEM7SUFDRCxDQUFDLG1FQUFvQixDQUFDLEVBQUUsSUFBSSxtRUFBYSxDQUN4Qyx3Q0FBd0MsQ0FDeEM7SUFDRCxDQUFDLG1FQUFvQixDQUFDLEVBQUUsSUFBSSxtRUFBYSxDQUN4Qyx3Q0FBd0MsQ0FDeEM7SUFDRCxDQUFDLG1FQUFvQixDQUFDLEVBQUUsSUFBSSxtRUFBYSxDQUN4Qyx3Q0FBd0MsQ0FDeEM7SUFDRCxDQUFDLG1FQUFvQixDQUFDLEVBQUUsSUFBSSxtRUFBYSxDQUN4Qyx3Q0FBd0MsQ0FDeEM7SUFDRCxDQUFDLG1FQUFvQixDQUFDLEVBQUUsSUFBSSxtRUFBYSxDQUN4Qyx3Q0FBd0MsQ0FDeEM7SUFDRCxDQUFDLG1FQUFvQixDQUFDLEVBQUUsSUFBSSxtRUFBYSxDQUN4Qyx3Q0FBd0MsQ0FDeEM7SUFDRCxDQUFDLG1FQUFvQixDQUFDLEVBQUUsSUFBSSxtRUFBYSxDQUN4Qyx3Q0FBd0MsQ0FDeEM7SUFDRCxDQUFDLG1FQUFvQixDQUFDLEVBQUUsSUFBSSxtRUFBYSxDQUN4Qyx3Q0FBd0MsQ0FDeEM7SUFDRCxDQUFDLGdFQUFpQixDQUFDLEVBQUUsSUFBSSxtRUFBYSxDQUNyQyxxQ0FBcUMsQ0FDckM7SUFDRCxDQUFDLHFFQUFzQixDQUFDLEVBQUUsSUFBSSxtRUFBYSxDQUMxQywwQ0FBMEMsQ0FDMUM7SUFDRCxDQUFDLGlFQUFrQixDQUFDLEVBQUUsSUFBSSxtRUFBYSxDQUN0QyxzQ0FBc0MsQ0FDdEM7SUFDRCxDQUFDLHFFQUFzQixDQUFDLEVBQUUsSUFBSSxtRUFBYSxDQUMxQywwQ0FBMEMsQ0FDMUM7SUFDRCxDQUFDLGtFQUFtQixDQUFDLEVBQUUsSUFBSSxtRUFBYSxDQUN2Qyx1Q0FBdUMsQ0FDdkM7SUFDRCxDQUFDLGtFQUFtQixDQUFDLEVBQUUsSUFBSSxtRUFBYSxDQUN2Qyx1Q0FBdUMsQ0FDdkM7SUFDRCxDQUFDLGtFQUFtQixDQUFDLEVBQUUs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UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztLQUNOLEVBQ0QsMEVBQTBFLEVBQzFFLEVBQUUsQ0FDRjtJQUVELEdBQUcsRUFBRSxJQUFJLGlFQUFZLENBQ3BCLGdDQUFnQyxFQUNoQztRQUNDLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO0tBQ04sRUFDRCx3RUFBd0UsRUFDeEUsRUFBRSxDQUNGO0lBQ0QsU0FBUyxFQUFFLElBQUksaUVBQVksQ0FDMUIsa0NBQWtDLEVBQ2xDO1FBQ0MsR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLElBQUksRUFBRSxDQUFDO1FBQ1AsR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNO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QUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDM0csSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRWpJLGlCQUFpQjtRQUNqQixJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDNUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRWxJLGlCQUFpQjtRQUNqQixJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDNUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRWxJLFNBQVM7UUFDVCxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFbkksSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxXQUFXLENBQUMsR0FBRyxXQUFXLEdBQUcsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxDQUFDO0lBQy9JLENBQUM7SUFFRCxlQUFlLENBQUMsTUFBYyxFQUFFLE1BQWM7UUFDMUMsMERBQTBEO1FBQzFELElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxDQUFDLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsSUFBSSxNQUFNLEdBQUcsSUFB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QUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUMzRyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFakksaUJBQWlCO1FBQ2pCLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM1RyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFbEksaUJBQWlCO1FBQ2pCLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM1RyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFbEksU0FBUztRQUNULElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUVuSSxJQUFHLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDZixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLEdBQUcsR0FBQyxtQkFBbUIsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxHQUFHLFdBQVcsR0FBRyxDQUFDLEdBQUcsV0FBVyxDQUFDLENBQUM7U0FDbEs7YUFDSTtZQUNELElBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDZCxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLEdBQUcsR0FBQyxNQUFNLEdBQUMsNERBQWdCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFDLEdBQUcsV0FBVyxHQUFHLENBQUMsR0FBRyxXQUFXLENBQUMsQ0FBQzthQUNsTDtpQkFDSTtnQkFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLEdBQUcsR0FBQyxZQUFZLEdBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxHQUFHLFdBQVcsR0FBRyxDQUFDLEdBQUcsV0FBVyxDQUFDLENBQUM7YUFDdEs7U0FDSjtJQUNMLENBQUM7SUFFRCxlQUFlLENBQUMsTUFBYyxFQUFFLE1BQWM7UUFDMUMsMERBQTBEO1FBQzFELElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxDQUFDLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLENBQUMsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUFFO1lBQzVGLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO1NBQzNCO2FBQ0k7WUFDRCxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztTQUM1QjtJQUNMLENBQUM7SUFFRCxTQUFTO1FBQ0wsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQ2pDLElBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNmLElBQUksQ0FBQyxLQUFLLEdBQUcsb0VBQXdCLENBQUM7WUFDdEMsT0FBTztTQUNWO1FBQ0QsSUFBSSxDQUFDLEtBQUssR0FBRyxzRUFBMEIsQ0FBQztRQUN4Qyw4Q0FBOEM7SUFDbEQsQ0FBQztDQUVKOzs7Ozs7Ozs7Ozs7Ozs7O0FDckcyQztBQUVyQyxNQUFNLE9BQU87SUFPaEIsWUFDSSxDQUFTLEVBQ1QsQ0FBUyxFQUNULENBQVMsRUFDVCxDQUFTO1FBQ1QsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDO1FBQ1YsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDO1FBQ1YsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDO1FBQ1YsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDO0lBQ2QsQ0FBQztJQUVELE1BQU0sQ0FBQyxNQUFVLEVBQUUsV0FBbUI7UUFDbEMsMEVBQTBFO1FBQzFFLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBQyxXQUFXLENBQUMsR0FBQyxXQUFXLENBQUM7UUFDckQsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFDLFdBQVcsQ0FBQyxHQUFDLFdBQVcsQ0FBQztRQUNyRCxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUMsV0FBVyxDQUFDLEdBQUMsV0FBVyxDQUFDO1FBQ3JELE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBQyxXQUFXLENBQUMsR0FBQyxXQUFXLENBQUM7UUFFckQsVUFBVTtRQUNWLDJFQUErQixDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBQyxXQUFXLEVBQUUsQ0FBQyxHQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN4RiwyRUFBK0IsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFDLENBQUMsR0FBQyxDQUFDLEdBQUMsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUMsV0FBVyxFQUFFLENBQUMsR0FBQyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDeEcsMkVBQStCLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxXQUFXLEVBQUUsQ0FBQyxHQUFDLFdBQVcsRUFBRSxDQUFDLEdBQUMsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3hHLDJFQUErQixDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxXQUFXLEVBQUUsQ0FBQyxHQUFDLENBQUMsR0FBQyxDQUFDLEdBQUMsV0FBVyxFQUFFLENBQUMsR0FBQyxXQUFXLEVBQUUsQ0FBQyxHQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUV4SCxpQkFBaUI7UUFDakIsMkVBQStCLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBQyxDQUFDLEdBQUMsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUMsRUFBRSxHQUFDLFdBQVcsRUFBRSxDQUFDLEdBQUMsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3pHLDJFQUErQixDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUMsQ0FBQyxHQUFDLFdBQVcsRUFBRSxDQUFDLEdBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxXQUFXLEVBQUUsQ0FBQyxHQUFDLEVBQUUsR0FBQyxXQUFXLEVBQUUsQ0FBQyxHQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUV6SCxpQkFBaUI7UUFDakIsMkVBQStCLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUMsQ0FBQyxHQUFDLFdBQVcsRUFBRSxDQUFDLEdBQUMsV0FBVyxFQUFFLENBQUMsR0FBQyxFQUFFLEdBQUMsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFF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V0FDQTtXQUNBO1dBQ0E7V0FDQSwrQkFBK0Isd0NBQXdDO1dBQ3ZFO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUJBQWlCLHFCQUFxQjtXQUN0QztXQUNBO1dBQ0Esa0JBQWtCLHFCQUFxQjtXQUN2QztXQUNBO1dBQ0EsS0FBSztXQUNMO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7Ozs7V0MzQkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEdBQUc7V0FDSDtXQUNBO1dBQ0EsQ0FBQzs7Ozs7V0NQRDs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1dDTkE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLE1BQU0scUJBQXFCO1dBQzNCO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBOzs7OztVRWhEQTtVQUNBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2NsaWVudC9HYW1lLnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3NyYy9jbGllbnQvTmV0TWFuYWdlci50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi9zcmMvY2xpZW50L2Fzc2V0cy9Bc3NldHMudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2NsaWVudC9hc3NldHMvcmVzb3VyY2VzL0F1ZGlvUmVzb3VyY2UudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2NsaWVudC9hc3NldHMvcmVzb3VyY2VzL0F1ZGlvUmVzb3VyY2VHcm91cC50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi9zcmMvY2xpZW50L2Fzc2V0cy9yZXNvdXJjZXMvRm9udFJlc291cmNlLnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3NyYy9jbGllbnQvYXNzZXRzL3Jlc291cmNlcy9JbWFnZVJlc291cmNlLnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3NyYy9jbGllbnQvYXNzZXRzL3Jlc291cmNlcy9SZWZsZWN0ZWRJbWFnZVJlc291cmNlLnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3NyYy9jbGllbnQvYXNzZXRzL3Jlc291cmNlcy9SZXNvdXJjZS50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi9zcmMvY2xpZW50L2Fzc2V0cy9yZXNvdXJjZXMvVGlsZVJlc291cmNlLnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3NyYy9jbGllbnQvaW5wdXQvQ29udHJvbC50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi9zcmMvY2xpZW50L3BsYXllci9JbnZlbnRvcnkudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2NsaWVudC9wbGF5ZXIvUGxheWVyTG9jYWwudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2NsaWVudC91aS9CdXR0b24udHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2NsaWVudC91aS9JbnB1dEJveC50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi9zcmMvY2xpZW50L3VpL1VpRnJhbWUudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2NsaWVudC91aS9VaVNjcmVlbi50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi9zcmMvY2xpZW50L3VpL3NjcmVlbnMvQ29udHJvbHNNZW51LnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3NyYy9jbGllbnQvdWkvc2NyZWVucy9NYWluTWVudS50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi9zcmMvY2xpZW50L3VpL3NjcmVlbnMvT3B0aW9uc01lbnUudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2NsaWVudC91aS9zY3JlZW5zL1BhdXNlTWVudS50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi9zcmMvY2xpZW50L3VpL3NjcmVlbnMvVmlkZW9TZXR0aW5nc01lbnUudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2NsaWVudC93b3JsZC9Xb3JsZC50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi9zcmMvY2xpZW50L3dvcmxkL1dvcmxkVGlsZXMudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2NsaWVudC93b3JsZC9lbnRpdGllcy9DbG91ZC50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi9zcmMvY2xpZW50L3dvcmxkL2VudGl0aWVzL0Ryb25lRW50aXR5LnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3NyYy9jbGllbnQvd29ybGQvZW50aXRpZXMvRW50aXR5Q2xhc3Nlcy50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi9zcmMvY2xpZW50L3dvcmxkL2VudGl0aWVzL0l0ZW1FbnRpdHkudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2NsaWVudC93b3JsZC9lbnRpdGllcy9QbGF5ZXJFbnRpdHkudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2NsaWVudC93b3JsZC9lbnRpdGllcy9TZXJ2ZXJFbnRpdHkudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2NsaWVudC93b3JsZC9lbnRpdGllcy9UaWxlRW50aXR5LnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3NyYy9jbGllbnQvd29ybGQvcGFydGljbGVzL0NvbG9yUGFydGljbGUudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2dsb2JhbC9FbnRpdHkudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2dsb2JhbC9JbnZlbnRvcnkudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2dsb2JhbC9UaWxlLnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3NyYy9nbG9iYWwvVGlsZUVudGl0eS50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vc25vd2VkX2luL3dlYnBhY2svcnVudGltZS9jaHVuayBsb2FkZWQiLCJ3ZWJwYWNrOi8vc25vd2VkX2luL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL3Nub3dlZF9pbi93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luL3dlYnBhY2svcnVudGltZS9nbG9iYWwiLCJ3ZWJwYWNrOi8vc25vd2VkX2luL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vc25vd2VkX2luL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vc25vd2VkX2luL3dlYnBhY2svcnVudGltZS9qc29ucCBjaHVuayBsb2FkaW5nIiwid2VicGFjazovL3Nub3dlZF9pbi93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL3Nub3dlZF9pbi93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vc25vd2VkX2luL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcDUsIHsgU2hhZGVyIH0gZnJvbSAncDUnO1xyXG5cclxuaW1wb3J0IHsgV29ybGQgfSBmcm9tICcuL3dvcmxkL1dvcmxkJztcclxuXHJcbmltcG9ydCB7XHJcblx0QXVkaW9Bc3NldHMsXHJcblx0Rm9udHMsXHJcblx0SXRlbUFzc2V0cyxcclxuXHRsb2FkQXNzZXRzLFxyXG5cdFBsYXllckFuaW1hdGlvbnMsXHJcblx0VWlBc3NldHMsXHJcblx0V29ybGRBc3NldHMsXHJcbn0gZnJvbSAnLi9hc3NldHMvQXNzZXRzJztcclxuaW1wb3J0IHsgTWFpbk1lbnUgfSBmcm9tICcuL3VpL3NjcmVlbnMvTWFpbk1lbnUnO1xyXG5pbXBvcnQgeyBpbywgU29ja2V0IH0gZnJvbSAnc29ja2V0LmlvLWNsaWVudCc7XHJcbmltcG9ydCB7IFVpU2NyZWVuIH0gZnJvbSAnLi91aS9VaVNjcmVlbic7XHJcbmltcG9ydCB7IFBhdXNlTWVudSB9IGZyb20gJy4vdWkvc2NyZWVucy9QYXVzZU1lbnUnO1xyXG5pbXBvcnQgeyBOZXRNYW5hZ2VyIH0gZnJvbSAnLi9OZXRNYW5hZ2VyJztcclxuaW1wb3J0IHsgV29ybGRUaWxlcywgVGlsZSB9IGZyb20gJy4vd29ybGQvV29ybGRUaWxlcyc7XHJcblxyXG5pbXBvcnQgeyBDbGllbnRFdmVudHMsIFNlcnZlckV2ZW50cyB9IGZyb20gJy4uL2dsb2JhbC9FdmVudHMnO1xyXG5cclxuLypcclxuLy8vSU5GT1JNQVRJT05cclxuLy9TdGFydGluZyBhIGdhbWVcclxuUHJlc3MgTGl2ZSBTZXJ2ZXIgdG8gc3RhcnQgdGhlIGdhbWVcclxub3JcclxuVHlwZSBucG0gcnVuIHByZXN0YXJ0IHRvIHN0YXJ0IHRoZSBnYW1lLlxyXG4vL1RPRE9cclxuV2hlbiBzb21ldGhpbmcgaW4gdGhlIHRvZG8gc2VjdGlvbiwgZWl0aGVyIGRlbGV0ZSBpdCBhbmQgbWFyayB3aGF0IHdhcyBkb25lIGluIHRoZSBkZXNjcmlwdGlvbiAtXHJcbi0gd2hlbiBwdXNoaW5nLCBvciBqdXN0IG1hcmsgaXQgbGlrZSB0aGlzXHJcbihleGFtcGxlOiBDcmVhdGUgYSBudWNsZWFyIGV4cGxvc2lvbiAtLSBYKVxyXG4vLy9HRU5FUkFMIFRPRE86XHJcblxyXG4vL0F1ZGlvXHJcbnNvdW5kc1xyXG5tdXNpY1xyXG5OUEMnc1xyXG5cclxuLy9WaXN1YWxcclxuVXBkYXRlIHNub3cgdGV4dHVyZXNcclxuVXBkYXRlIEdVSSB0ZXh0dXJlc1xyXG5wbGF5ZXIgY2hhcmFjdGVyXHJcbml0ZW0gbG9yZSBpbXBsZW1lbnRlZFxyXG5cclxuLy9HYW1lcGxheVxyXG5maW5pc2ggaXRlbSBtYW5hZ2VtZW50XHJcbnBhdXNlIG1lbnVcclxuSHVuZ2VyLCBoZWF0LCBldGMgc3lzdGVtXHJcbml0ZW0gY3JlYXRpb25cclxuaXRlbSB1c2VcclxuUGFyZW50IFdvcmtiZW5jaFxyXG5cclxuLy9PYmplY3RzXHJcbmRpcnRcclxuc3RvbmVcclxud29ya2JlbmNoXHJcbmJhY2twYWNrICh1c2VkIGFzIGNoZXN0KVxyXG5cclxuLy9Qb2xpc2hcclxuYmV0dGVyIHdvcmxkIGdlbmVyYXRpb25cclxuZm9udCBjb25zaXN0ZW5jeVxyXG5maXggY3Vyc29yIGlucHV0IGxhZyAoc2VwYXJhdGUgY3Vyc29yIGFuZCBhbmltYXRpb24gaW1hZ2VzKVxyXG5maXggc3R1Y2sgb24gc2lkZSBvZiBibG9jayBidWdcclxuZml4IGNvbGxpZGUgd2l0aCBzaWRlcyBvZiBtYXAgYnVnXHJcbiAqL1xyXG5pbXBvcnQgeyBDb250cm9sIH0gZnJvbSAnLi9pbnB1dC9Db250cm9sJztcclxuaW1wb3J0IHsgQ29sb3JQYXJ0aWNsZSB9IGZyb20gJy4vd29ybGQvcGFydGljbGVzL0NvbG9yUGFydGljbGUnO1xyXG5pbXBvcnQgeyBUaWxlRW50aXRpZXMgfSBmcm9tICcuLi9nbG9iYWwvVGlsZUVudGl0eSc7XHJcbmltcG9ydCB7IENsb3VkIH0gZnJvbSAnLi93b3JsZC9lbnRpdGllcy9DbG91ZCc7XHJcblxyXG5leHBvcnQgY2xhc3MgR2FtZSBleHRlbmRzIHA1IHtcclxuXHR3b3JsZFdpZHRoOiBudW1iZXIgPSA1MTI7IC8vIHdpZHRoIG9mIHRoZSB3b3JsZCBpbiB0aWxlcyAgIDwhPiBNQUtFIFNVUkUgVEhJUyBJUyBORVZFUiBMRVNTIFRIQU4gNjQhISEgPCE+XHJcblx0d29ybGRIZWlnaHQ6IG51bWJlciA9IDI1NjsgLy8gaGVpZ2h0IG9mIHRoZSB3b3JsZCBpbiB0aWxlcyAgPCE+IE1BS0UgU1VSRSBUSElTIElTIE5FVkVSIExFU1MgVEhBTiA2NCEhISA8IT5cclxuXHJcblx0VElMRV9XSURUSDogbnVtYmVyID0gODsgLy8gd2lkdGggb2YgYSB0aWxlcyBpbiBwaXhlbHNcclxuXHRUSUxFX0hFSUdIVDogbnVtYmVyID0gODsgLy8gaGVpZ2h0IG9mIGEgdGlsZXMgaW4gcGl4ZWxzXHJcblxyXG5cdHVwc2NhbGVTaXplOiBudW1iZXIgPSA2OyAvLyBudW1iZXIgb2Ygc2NyZWVuIHBpeGVscyBwZXIgdGV4dHVyZSBwaXhlbHMgKHRoaW5rIG9mIHRoaXMgYXMgaHVkIHNjYWxlIGluIE1pbmVjcmFmdClcclxuXHJcblx0Y2FtWDogbnVtYmVyID0gMDsgLy8gcG9zaXRpb24gb2YgdGhlIHRvcCBsZWZ0IGNvcm5lciBvZiB0aGUgc2NyZWVuIGluIHVuLXVwLXNjYWxlZCBwaXhlbHMgKDAgaXMgbGVmdCBvZiB3b3JsZCkgKHdvcmxkV2lkdGgqVElMRV9XSURUSCBpcyBib3R0b20gb2Ygd29ybGQpXHJcblx0Y2FtWTogbnVtYmVyID0gMDsgLy8gcG9zaXRpb24gb2YgdGhlIHRvcCBsZWZ0IGNvcm5lciBvZiB0aGUgc2NyZWVuIGluIHVuLXVwLXNjYWxlZCBwaXhlbHMgKDAgaXMgdG9wIG9mIHdvcmxkKSAod29ybGRIZWlnaHQqVElMRV9IRUlHSFQgaXMgYm90dG9tIG9mIHdvcmxkKVxyXG5cdHBDYW1YOiBudW1iZXIgPSAwOyAvLyBsYXN0IGZyYW1lJ3MgeCBvZiB0aGUgY2FtZXJhXHJcblx0cENhbVk6IG51bWJlciA9IDA7IC8vIGxhc3QgZnJhbWUncyB5IG9mIHRoZSBjYW1lcmFcclxuXHRpbnRlcnBvbGF0ZWRDYW1YOiBudW1iZXIgPSAwOyAvLyBpbnRlcnBvbGF0ZWQgcG9zaXRpb24gb2YgdGhlIGNhbWVyYVxyXG5cdGludGVycG9sYXRlZENhbVk6IG51bWJlciA9IDA7IC8vIGludGVycG9sYXRlZCBwb3NpdGlvbiBvZiB0aGUgY2FtZXJhXHJcblx0ZGVzaXJlZENhbVg6IG51bWJlciA9IDA7IC8vIGRlc2lyZWQgcG9zaXRpb24gb2YgdGhlIGNhbWVyYVxyXG5cdGRlc2lyZWRDYW1ZOiBudW1iZXIgPSAwOyAvLyBkZXNpcmVkIHBvc2l0aW9uIG9mIHRoZSBjYW1lcmFcclxuXHRzY3JlZW5zaGFrZUFtb3VudDogbnVtYmVyID0gMDsgLy8gYW1vdW50IG9mIHNjcmVlbnNoYWtlIGhhcHBlbmluZyBhdCB0aGUgY3VycmVudCBtb21lbnRcclxuXHJcblx0Ly8gdGljayBtYW5hZ2VtZW50XHJcblx0bXNTaW5jZVRpY2s6IG51bWJlciA9IDA7IC8vIHRoaXMgaXMgdGhlIHJ1bm5pbmcgY291bnRlciBvZiBob3cgbWFueSBtaWxsaXNlY29uZHMgaXQgaGFzIGJlZW4gc2luY2UgdGhlIGxhc3QgdGljay4gIFRoZSBnYW1lIGNhbiB0aGVuXHJcblx0bXNQZXJUaWNrOiBudW1iZXIgPSAyMDsgLy8gdGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgcGVyIGdhbWUgdGljay4gIDEwMDAvbXNQZXJUaWNrID0gdGlja3MgcGVyIHNlY29uZFxyXG5cdGFtb3VudFNpbmNlTGFzdFRpY2s6IG51bWJlciA9IDA7IC8vIHRoaXMgaXMgYSB2YXJpYWJsZSBjYWxjdWxhdGVkIGV2ZXJ5IGZyYW1lIHVzZWQgZm9yIGludGVycG9sYXRpb24gLSBkb21haW5bMCwxKVxyXG5cdGZvcmdpdmVuZXNzQ291bnQ6IG51bWJlciA9IDUwOyAvLyBpZiB0aGUgY29tcHV0ZXIgbmVlZHMgdG8gZG8gbW9yZSB0aGFuIDUwIHRpY2tzIGluIGEgc2luZ2xlIGZyYW1lLCB0aGVuIGl0IGNvdWxkIGJlIHJ1bm5pbmcgYmVoaW5kLCBwcm9iYWJseSBiZWNhdXNlIG9mIGEgZnJlZXplIG9yIHRoZSB1c2VyIGJlaW5nIG9uIGEgZGlmZmVyZW50IHRhYi4gIEluIHRoZXNlIGNhc2VzLCBpdCdzIHByb2JhYmx5IGJlc3QgdG8ganVzdCBpZ25vcmUgdGhhdCBhbnkgdGltZSBoYXMgcGFzc2VkIHRvIGF2b2lkIGZ1cnRoZXIgZnJlZXppbmdcclxuXHJcblx0Ly8gcGh5c2ljcyBjb25zdGFudHNcclxuXHRHUkFWSVRZX1NQRUVEOiBudW1iZXIgPSAwLjA0OyAvLyBpbiB1bml0cyBwZXIgc2Vjb25kIHRpY2ssIHBvc2l0aXZlIG1lYW5zIGRvd253YXJkIGdyYXZpdHksIG5lZ2F0aXZlIG1lYW5zIHVwd2FyZCBncmF2aXR5XHJcblx0RFJBR19DT0VGRklDSUVOVDogbnVtYmVyID0gMC4yMTsgLy8gYXJiaXRyYXJ5IG51bWJlciwgMCBtZWFucyBubyBkcmFnXHJcblxyXG5cdC8vIENIQVJBQ1RFUiBTSE9VTEQgQkUgUk9VR0hMWSAxMiBQSVhFTFMgQlkgMjAgUElYRUxTXHJcblxyXG5cdHBpY2tlZFVwU2xvdCA9IC0xO1xyXG5cclxuXHR3b3JsZE1vdXNlWCA9IDA7IC8vIHRoZSBtb3VzZSBwb3NpdGlvbiBpbiB3b3JsZCBjb29yZGluYXRlc1xyXG5cdHdvcmxkTW91c2VZID0gMDsgLy8gdGhlIG1vdXNlIHBvc2l0aW9uIGluIHdvcmxkIGNvb3JkaW5hdGVzXHJcblx0bGFzdEN1cnNvck1vdmUgPSBEYXRlLm5vdygpXHJcblx0bW91c2VPbiA9IHRydWU7IC8vIGlzIHRoZSBtb3VzZSBvbiB0aGUgd2luZG93P1xyXG5cclxuXHRrZXlzOiBib29sZWFuW10gPSBbXTtcclxuXHJcblx0dXNlckdlc3R1cmU6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcblx0Ly8gdGhlIGtleWNvZGUgZm9yIHRoZSBrZXkgdGhhdCBkb2VzIHRoZSBhY3Rpb25cclxuXHRjb250cm9sczogQ29udHJvbFtdID0gW1xyXG5cdFx0bmV3IENvbnRyb2woXHJcblx0XHRcdCdXYWxrIFJpZ2h0JyxcclxuXHRcdFx0dHJ1ZSxcclxuXHRcdFx0NjgsXHJcblx0XHRcdCgpID0+IHtcclxuXHRcdFx0XHRpZiAodGhpcy5jdXJyZW50VWkgIT09IHVuZGVmaW5lZCkgcmV0dXJuO1xyXG5cdFx0XHRcdHRoaXMud29ybGQucGxheWVyLnJpZ2h0QnV0dG9uID0gdHJ1ZTtcclxuXHRcdFx0fSxcclxuXHRcdFx0KCkgPT4ge1xyXG5cdFx0XHRcdGlmICh0aGlzLmN1cnJlbnRVaSAhPT0gdW5kZWZpbmVkKSByZXR1cm47XHJcblx0XHRcdFx0dGhpcy53b3JsZC5wbGF5ZXIucmlnaHRCdXR0b24gPSBmYWxzZTtcclxuXHRcdFx0fSxcclxuXHRcdCksIC8vIHJpZ2h0XHJcblx0XHRuZXcgQ29udHJvbChcclxuXHRcdFx0J1dhbGsgTGVmdCcsXHJcblx0XHRcdHRydWUsXHJcblx0XHRcdDY1LFxyXG5cdFx0XHQoKSA9PiB7XHJcblx0XHRcdFx0aWYgKHRoaXMuY3VycmVudFVpICE9PSB1bmRlZmluZWQpIHJldHVybjtcclxuXHRcdFx0XHR0aGlzLndvcmxkLnBsYXllci5sZWZ0QnV0dG9uID0gdHJ1ZTtcclxuXHRcdFx0fSxcclxuXHRcdFx0KCkgPT4ge1xyXG5cdFx0XHRcdGlmICh0aGlzLmN1cnJlbnRVaSAhPT0gdW5kZWZpbmVkKSByZXR1cm47XHJcblx0XHRcdFx0dGhpcy53b3JsZC5wbGF5ZXIubGVmdEJ1dHRvbiA9IGZhbHNlO1xyXG5cdFx0XHR9LFxyXG5cdFx0KSwgLy8gbGVmdFxyXG5cdFx0bmV3IENvbnRyb2woXHJcblx0XHRcdCdKdW1wJyxcclxuXHRcdFx0dHJ1ZSxcclxuXHRcdFx0ODcsXHJcblx0XHRcdCgpID0+IHtcclxuXHRcdFx0XHRpZiAodGhpcy5jdXJyZW50VWkgIT09IHVuZGVmaW5lZCkgcmV0dXJuO1xyXG5cdFx0XHRcdHRoaXMud29ybGQucGxheWVyLmp1bXBCdXR0b24gPSB0cnVlO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHQoKSA9PiB7XHJcblx0XHRcdFx0aWYgKHRoaXMuY3VycmVudFVpICE9PSB1bmRlZmluZWQpIHJldHVybjtcclxuXHRcdFx0XHR0aGlzLndvcmxkLnBsYXllci5qdW1wQnV0dG9uID0gZmFsc2U7XHJcblx0XHRcdH0sXHJcblx0XHQpLCAvLyBqdW1wXHJcblx0XHRuZXcgQ29udHJvbCgnUGF1c2UnLCB0cnVlLCAyNywgKCkgPT4ge1xyXG5cdFx0XHQvL2lmIGludmVudG9yeSBvcGVue1xyXG5cdFx0XHQvL2Nsb3NlIGludmVudG9yeVxyXG5cdFx0XHQvL3JldHVybjt9XHJcblx0XHRcdGlmICh0aGlzLmN1cnJlbnRVaSA9PT0gdW5kZWZpbmVkKVxyXG5cdFx0XHRcdHRoaXMuY3VycmVudFVpID0gbmV3IFBhdXNlTWVudShGb250cy50aXRsZSwgRm9udHMuYmlnKTtcclxuXHRcdFx0ZWxzZSB0aGlzLmN1cnJlbnRVaSA9IHVuZGVmaW5lZDtcclxuXHRcdH0pLCAvLyBzZXR0aW5nc1xyXG5cdFx0bmV3IENvbnRyb2woJ0ludmVudG9yeScsIHRydWUsIDY5LCAoKSA9PiB7XHJcblx0XHRcdC8vaWYgdWkgb3BlbiByZXR1cm47XHJcblx0XHRcdC8vaWYgaW52ZW50b3J5IGNsb3NlZCBvcGVuIGludmVudG9yeVxyXG5cdFx0XHQvL2Vsc2UgY2xvc2UgaW52ZW50b3J5XHJcblx0XHRcdGNvbnNvbGUubG9nKCdpbnZlbnRvcnkgaGFzIG5vdCBiZWVuIGltcGxlbWVudGVkIHlldCcpO1xyXG5cdFx0fSksIC8vIGludmVudG9yeVxyXG5cdFx0bmV3IENvbnRyb2woJ0hvdGJhciAxJywgdHJ1ZSwgNDksICgpID0+IHtcclxuXHRcdFx0dGhpcy53b3JsZC5pbnZlbnRvcnkuc2VsZWN0ZWRTbG90ID0gMDtcclxuXHRcdH0pLCAvLyBob3QgYmFyIDFcclxuXHRcdG5ldyBDb250cm9sKCdIb3RiYXIgMicsIHRydWUsIDUwLCAoKSA9PiB7XHJcblx0XHRcdHRoaXMud29ybGQuaW52ZW50b3J5LnNlbGVjdGVkU2xvdCA9IDE7XHJcblx0XHR9KSwgLy8gaG90IGJhciAyXHJcblx0XHRuZXcgQ29udHJvbCgnSG90YmFyIDMnLCB0cnVlLCA1MSwgKCkgPT4ge1xyXG5cdFx0XHR0aGlzLndvcmxkLmludmVudG9yeS5zZWxlY3RlZFNsb3QgPSAyO1xyXG5cdFx0fSksIC8vIGhvdCBiYXIgM1xyXG5cdFx0bmV3IENvbnRyb2woJ0hvdGJhciA0JywgdHJ1ZSwgNTIsICgpID0+IHtcclxuXHRcdFx0dGhpcy53b3JsZC5pbnZlbnRvcnkuc2VsZWN0ZWRTbG90ID0gMztcclxuXHRcdH0pLCAvLyBob3QgYmFyIDRcclxuXHRcdG5ldyBDb250cm9sKCdIb3RiYXIgNScsIHRydWUsIDUzLCAoKSA9PiB7XHJcblx0XHRcdHRoaXMud29ybGQuaW52ZW50b3J5LnNlbGVjdGVkU2xvdCA9IDQ7XHJcblx0XHR9KSwgLy8gaG90IGJhciA1XHJcblx0XHRuZXcgQ29udHJvbCgnSG90YmFyIDYnLCB0cnVlLCA1NCwgKCkgPT4ge1xyXG5cdFx0XHR0aGlzLndvcmxkLmludmVudG9yeS5zZWxlY3RlZFNsb3QgPSA1O1xyXG5cdFx0fSksIC8vIGhvdCBiYXIgNlxyXG5cdFx0bmV3IENvbnRyb2woJ0hvdGJhciA3JywgdHJ1ZSwgNTUsICgpID0+IHtcclxuXHRcdFx0dGhpcy53b3JsZC5pbnZlbnRvcnkuc2VsZWN0ZWRTbG90ID0gNjtcclxuXHRcdH0pLCAvLyBob3QgYmFyIDdcclxuXHRcdG5ldyBDb250cm9sKCdIb3RiYXIgOCcsIHRydWUsIDU2LCAoKSA9PiB7XHJcblx0XHRcdHRoaXMud29ybGQuaW52ZW50b3J5LnNlbGVjdGVkU2xvdCA9IDc7XHJcblx0XHR9KSwgLy8gaG90IGJhciA4XHJcblx0XHRuZXcgQ29udHJvbCgnSG90YmFyIDknLCB0cnVlLCA1NywgKCkgPT4ge1xyXG5cdFx0XHR0aGlzLndvcmxkLmludmVudG9yeS5zZWxlY3RlZFNsb3QgPSA4O1xyXG5cdFx0fSksIC8vIGhvdCBiYXIgOVxyXG5cdFx0bmV3IENvbnRyb2woJ0hvdGJhciAxMCcsIHRydWUsIDQ4LCAoKSA9PiB7XHJcblx0XHRcdHRoaXMud29ybGQuaW52ZW50b3J5LnNlbGVjdGVkU2xvdCA9IDk7XHJcblx0XHR9KSwgLy8gaG90IGJhciAxMFxyXG5cdFx0bmV3IENvbnRyb2woJ0hvdGJhciAxMScsIHRydWUsIDE4OSwgKCkgPT4ge1xyXG5cdFx0XHR0aGlzLndvcmxkLmludmVudG9yeS5zZWxlY3RlZFNsb3QgPSAxMDtcclxuXHRcdH0pLCAvLyBob3QgYmFyIDExXHJcblx0XHRuZXcgQ29udHJvbCgnSG90YmFyIDEyJywgdHJ1ZSwgMTg3LCAoKSA9PiB7XHJcblx0XHRcdHRoaXMud29ybGQuaW52ZW50b3J5LnNlbGVjdGVkU2xvdCA9IDExO1xyXG5cdFx0fSksIC8vIGhvdCBiYXIgMTJcclxuXHRdO1xyXG5cclxuXHRjYW52YXM6IHA1LlJlbmRlcmVyOyAvL3RoZSBjYW52YXMgZm9yIHRoZSBnYW1lXHJcblx0c2t5TGF5ZXI6IHA1LkdyYXBoaWNzOyAvL2EgcDUuR3JhcGhpY3Mgb2JqZWN0IHRoYXQgdGhlIHNoYWRlciBpcyBkcmF3biBvbnRvLiAgdGhpcyBpc24ndCB0aGUgYmVzdCB3YXkgdG8gZG8gdGhpcywgYnV0IHRoZSBtYWluIGdhbWUgY2FudmFzIGlzbid0IFdFQkdMLCBhbmQgaXQncyB0b28gbXVjaCB3b3JrIHRvIGNoYW5nZSB0aGF0XHJcblx0c2t5U2hhZGVyOiBwNS5TaGFkZXI7IC8vdGhlIHNoYWRlciB0aGF0IGRyYXdzIHRoZSBza3kgKHRoZSBwYXRoIGZvciB0aGlzIGlzIGluIHRoZSBwdWJsaWMgZm9sZGVyKVxyXG5cclxuXHR3b3JsZDogV29ybGQ7XHJcblxyXG5cdGN1cnJlbnRVaTogVWlTY3JlZW4gfCB1bmRlZmluZWQ7XHJcblxyXG5cdGNvbm5lY3Rpb246IFNvY2tldDxTZXJ2ZXJFdmVudHMsIENsaWVudEV2ZW50cz47XHJcblxyXG5cdG5ldE1hbmFnZXI6IE5ldE1hbmFnZXI7XHJcblxyXG5cdC8vY2hhbmdlYWJsZSBvcHRpb25zIGZyb20gbWVudXNcclxuXHRzZXJ2ZXJWaXNpYmlsaXR5OiBzdHJpbmc7XHJcblx0d29ybGRCdW1waW5lc3M6IG51bWJlcjtcclxuXHRza3lNb2Q6IG51bWJlcjtcclxuXHRza3lUb2dnbGU6IGJvb2xlYW47XHJcblx0cGFydGljbGVNdWx0aXBsaWVyOiBudW1iZXI7XHJcblxyXG5cdHBhcnRpY2xlczogQ29sb3JQYXJ0aWNsZSAvKnxGb290c3RlcFBhcnRpY2xlKi9bXTtcclxuXHRjbG91ZHM6IENsb3VkIC8qfEZvb3RzdGVwUGFydGljbGUqL1tdO1xyXG5cdGJyZWFraW5nOiBib29sZWFuID0gdHJ1ZTtcclxuXHRicm9rZW5UaWxlc1F1ZXVlOiBudW1iZXJbXSA9IFtdO1xyXG5cclxuXHRjb25zdHJ1Y3Rvcihjb25uZWN0aW9uOiBTb2NrZXQpIHtcclxuXHRcdHN1cGVyKCgpID0+IHsgfSk7IC8vIFRvIGNyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiBwNSBpdCB3aWxsIGNhbGwgYmFjayB3aXRoIHRoZSBpbnN0YW5jZS4gV2UgZG9uJ3QgbmVlZCB0aGlzIHNpbmNlIHdlIGFyZSBleHRlbmRpbmcgdGhlIGNsYXNzXHJcblx0XHR0aGlzLmNvbm5lY3Rpb24gPSBjb25uZWN0aW9uO1xyXG5cclxuXHRcdC8vIEluaXRpYWxpc2UgdGhlIG5ldHdvcmsgbWFuYWdlclxyXG5cdFx0dGhpcy5uZXRNYW5hZ2VyID0gbmV3IE5ldE1hbmFnZXIodGhpcyk7XHJcblx0fVxyXG5cclxuXHRwcmVsb2FkKCkge1xyXG5cdFx0Y29uc29sZS5sb2coJ0xvYWRpbmcgYXNzZXRzJyk7XHJcblx0XHRsb2FkQXNzZXRzKFxyXG5cdFx0XHR0aGlzLFxyXG5cdFx0XHRVaUFzc2V0cyxcclxuXHRcdFx0SXRlbUFzc2V0cyxcclxuXHRcdFx0V29ybGRBc3NldHMsXHJcblx0XHRcdEZvbnRzLFxyXG5cdFx0XHRQbGF5ZXJBbmltYXRpb25zLFxyXG5cdFx0XHRBdWRpb0Fzc2V0cyxcclxuXHRcdCk7XHJcblx0XHRjb25zb2xlLmxvZygnQXNzZXQgbG9hZGluZyBjb21wbGV0ZWQnKTtcclxuXHRcdHRoaXMuc2t5U2hhZGVyID0gdGhpcy5sb2FkU2hhZGVyKFxyXG5cdFx0XHQnYXNzZXRzL3NoYWRlcnMvYmFzaWMudmVydCcsXHJcblx0XHRcdCdhc3NldHMvc2hhZGVycy9za3kuZnJhZycsXHJcblx0XHQpO1xyXG5cdH1cclxuXHJcblx0c2V0dXAoKSB7XHJcblx0XHRjb25zb2xlLmxvZygnc2V0dXAgY2FsbGVkJyk7XHJcblx0XHQvLyBtYWtlIGEgY2FudmFzIHRoYXQgZmlsbHMgdGhlIHdob2xlIHNjcmVlbiAoYSBjYW52YXMgaXMgd2hhdCBpcyBkcmF3biB0byBpbiBwNS5qcywgYXMgd2VsbCBhcyBsb3RzIG9mIG90aGVyIEpTIHJlbmRlcmluZyBsaWJyYXJpZXMpXHJcblx0XHR0aGlzLmNhbnZhcyA9IHRoaXMuY3JlYXRlQ2FudmFzKHRoaXMud2luZG93V2lkdGgsIHRoaXMud2luZG93SGVpZ2h0KTtcclxuXHRcdHRoaXMuY2FudmFzLm1vdXNlT3V0KHRoaXMubW91c2VFeGl0ZWQpO1xyXG5cdFx0dGhpcy5jYW52YXMubW91c2VPdmVyKHRoaXMubW91c2VFbnRlcmVkKTtcclxuXHJcblx0XHR0aGlzLnNreUxheWVyID0gdGhpcy5jcmVhdGVHcmFwaGljcyh0aGlzLndpZHRoLCB0aGlzLmhlaWdodCwgJ3dlYmdsJyk7XHJcblxyXG5cdFx0dGhpcy5jdXJyZW50VWkgPSBuZXcgTWFpbk1lbnUoRm9udHMudGl0bGUsIEZvbnRzLmJpZyk7XHJcblxyXG5cdFx0Ly8gVGlja1xyXG5cdFx0c2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG5cdFx0XHRpZiAodGhpcy53b3JsZCA9PT0gdW5kZWZpbmVkKSByZXR1cm47XHJcblx0XHRcdHRoaXMud29ybGQudGljayh0aGlzKTtcclxuXHRcdH0sIDEwMDAgLyB0aGlzLm5ldE1hbmFnZXIucGxheWVyVGlja1JhdGUpO1xyXG5cclxuXHRcdC8vIGdvIGZvciBhIHNjYWxlIG9mIDw2NCB0aWxlcyB3aWRlIHNjcmVlblxyXG5cdFx0dGhpcy53aW5kb3dSZXNpemVkKCk7XHJcblxyXG5cdFx0Ly8gcmVtb3ZlIHRleHR1cmUgaW50ZXJwb2xhdGlvbiAoZW5hYmxlIHBvaW50IGZpbHRlcmluZyBmb3IgaW1hZ2VzKVxyXG5cdFx0dGhpcy5ub1Ntb290aCgpO1xyXG5cclxuXHRcdC8vIHRoZSBoaWdoZXN0IGtleWNvZGUgaXMgMjU1LCB3aGljaCBpcyBcIlRvZ2dsZSBUb3VjaHBhZFwiLCBhY2NvcmRpbmcgdG8ga2V5Y29kZS5pbmZvXHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IDI1NTsgaSsrKSB7XHJcblx0XHRcdHRoaXMua2V5cy5wdXNoKGZhbHNlKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgdGhlIGZyYW1lcmF0ZSBnb2FsIHRvIGFzIGhpZ2ggYXMgcG9zc2libGUgKHRoaXMgd2lsbCBlbmQgdXAgY2FwcGluZyB0byB5b3VyIG1vbml0b3IncyByZWZyZXNoIHJhdGUgd2l0aCB2c3luYy4pXHJcblx0XHR0aGlzLmZyYW1lUmF0ZShJbmZpbml0eSk7XHJcblx0XHQvLyBBdWRpb0FucHNzZXRzLmFtYmllbnQud2ludGVyMS5wbGF5U291bmQoKTtcclxuXHRcdHRoaXMucGFydGljbGVNdWx0aXBsaWVyID0gMTtcclxuXHRcdHRoaXMuc2t5VG9nZ2xlID0gdHJ1ZTtcclxuXHRcdHRoaXMuc2t5TW9kID0gMjtcclxuXHRcdHRoaXMucGFydGljbGVzID0gW107XHJcblx0XHR0aGlzLmNsb3VkcyA9IFtdO1xyXG5cdFx0Zm9yKGxldCBpID0gMDsgaTx0aGlzLndpZHRoL3RoaXMudXBzY2FsZVNpemUvMTU7IGkrKykge1xyXG5cdFx0XHR0aGlzLmNsb3Vkcy5wdXNoKG5ldyBDbG91ZChNYXRoLnJhbmRvbSgpKnRoaXMud2lkdGgvdGhpcy51cHNjYWxlU2l6ZS90aGlzLlRJTEVfV0lEVEgsIDIvKDAuMDMrTWF0aC5yYW5kb20oKSktNSkpO1xyXG5cdFx0fVxyXG5cdFx0Y29uc29sZS5sb2coXCJ0aGVyZSBhcmUgXCIrdGhpcy5jbG91ZHMubGVuZ3RoK1wiIGNsb3Vkc1wiKVxyXG5cdFx0dGhpcy5jdXJzb3IoXCJhc3NldHMvdGV4dHVyZXMvdWkvY3Vyc29yMi5wbmdcIik7XHJcblx0fVxyXG5cclxuXHRkcmF3KCkge1xyXG5cdFx0aWYgKHRoaXMuZnJhbWVDb3VudCA9PT0gMikge1xyXG5cdFx0XHQvL2hhcyB0byBiZSBkb25lIG9uIHRoZSBzZWNvbmQgZnJhbWUgZm9yIHNvbWUgcmVhc29uP1xyXG5cdFx0XHR0aGlzLnNreVNoYWRlci5zZXRVbmlmb3JtKCdzY3JlZW5EaW1lbnNpb25zJywgW1xyXG5cdFx0XHRcdCh0aGlzLndpZHRoIC8gdGhpcy51cHNjYWxlU2l6ZSkgKiAyLFxyXG5cdFx0XHRcdCh0aGlzLmhlaWdodCAvIHRoaXMudXBzY2FsZVNpemUpICogMixcclxuXHRcdFx0XSk7XHJcblx0XHRcdHRoaXMuc2t5U2hhZGVyLnNldFVuaWZvcm0oXHJcblx0XHRcdFx0J3NreUltYWdlJyxcclxuXHRcdFx0XHRXb3JsZEFzc2V0cy5zaGFkZXJSZXNvdXJjZXMuc2t5SW1hZ2UuaW1hZ2UsXHJcblx0XHRcdCk7XHJcblx0XHRcdC8vIE9iamVjdC52YWx1ZXMoUGxheWVyQW5pbWF0aW9ucykuZm9yRWFjaChwbGF5ZXJBbmltYXRpb24gPT4ge1xyXG5cdFx0XHQvLyBcdHBsYXllckFuaW1hdGlvbi5mb3JFYWNoKGFuaW1hdGlvbkZyYW1lID0+IHtcclxuXHRcdFx0Ly8gXHRcdGNvbnNvbGUubG9nKFwibG9hZGluZyBhbmltYXRpb24gXCIrYW5pbWF0aW9uRnJhbWVbMF0ucGF0aClcclxuXHRcdFx0Ly8gXHRcdGFuaW1hdGlvbkZyYW1lWzBdLmxvYWRSZWZsZWN0aW9uKHRoaXMpXHJcblx0XHRcdC8vIFx0fSlcclxuXHRcdFx0Ly8gfSk7XHJcblx0XHR9XHJcblx0XHQvLyBkbyB0aGUgdGljayBjYWxjdWxhdGlvbnNcclxuXHRcdHRoaXMuZG9UaWNrcygpO1xyXG5cclxuXHRcdC8vIHVwZGF0ZSBtb3VzZSBwb3NpdGlvblxyXG5cdFx0dGhpcy51cGRhdGVNb3VzZSgpO1xyXG5cdFx0aWYodGhpcy5tb3VzZUlzUHJlc3NlZCAmJiB0aGlzLndvcmxkIT11bmRlZmluZWQpIHtcclxuXHRcdHRoaXMud29ybGQuaW52ZW50b3J5LndvcmxkQ2xpY2sodGhpcy53b3JsZE1vdXNlWCwgdGhpcy53b3JsZE1vdXNlWSk7fVxyXG5cclxuXHRcdC8vIHVwZGF0ZSB0aGUgY2FtZXJhJ3MgaW50ZXJwb2xhdGlvblxyXG5cdFx0dGhpcy5tb3ZlQ2FtZXJhKCk7XHJcblxyXG5cdFx0Ly8gd2lwZSB0aGUgc2NyZWVuIHdpdGggYSBoYXBweSBsaXR0bGUgbGF5ZXIgb2YgbGlnaHQgYmx1ZVxyXG5cdFx0dGhpcy5za3lTaGFkZXIuc2V0VW5pZm9ybSgnb2Zmc2V0Q29vcmRzJywgW1xyXG5cdFx0XHR0aGlzLmludGVycG9sYXRlZENhbVgsXHJcblx0XHRcdHRoaXMuaW50ZXJwb2xhdGVkQ2FtWSxcclxuXHRcdF0pO1xyXG5cdFx0dGhpcy5za3lTaGFkZXIuc2V0VW5pZm9ybSgnbWlsbGlzJywgdGhpcy5taWxsaXMoKSk7XHJcblx0XHR0aGlzLnNreUxheWVyLnNoYWRlcih0aGlzLnNreVNoYWRlcik7XHJcblx0XHQvLyB0aGlzLmZpbGwoMjU1LCAwLCAwKTtcclxuXHRcdHRoaXMuc2t5TGF5ZXIucmVjdCgwLCAwLCB0aGlzLnNreUxheWVyLndpZHRoLCB0aGlzLnNreUxheWVyLmhlaWdodCk7XHJcblxyXG5cdFx0dGhpcy5pbWFnZSh0aGlzLnNreUxheWVyLCAwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XHJcblxyXG5cdFx0Zm9yIChsZXQgY2xvdWQgb2YgdGhpcy5jbG91ZHMpIHtcclxuXHRcdFx0Y2xvdWQucmVuZGVyKHRoaXMsIHRoaXMudXBzY2FsZVNpemUpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0aGlzLndvcmxkICE9PSB1bmRlZmluZWQpIHRoaXMud29ybGQucmVuZGVyKHRoaXMsIHRoaXMudXBzY2FsZVNpemUpO1xyXG5cclxuXHRcdC8vIHJlbmRlciB0aGUgcGxheWVyLCBhbGwgaXRlbXMsIGV0Yy5cclxuXHRcdC8vdGhpcy5yZW5kZXJFbnRpdGllcygpO1xyXG5cclxuXHRcdC8vZGVsZXRlIGFueSBwYXJ0aWNsZXMgdGhhdCBoYXZlIGdvdHRlbiB0b28gb2xkXHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGFydGljbGVzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGlmICh0aGlzLnBhcnRpY2xlc1tpXS5hZ2UgPiB0aGlzLnBhcnRpY2xlc1tpXS5saWZlc3Bhbikge1xyXG5cdFx0XHRcdHRoaXMucGFydGljbGVzLnNwbGljZShpLCAxKTtcclxuXHRcdFx0XHRpLS07XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHQvL25vIG91dGxpbmUgb24gcGFydGljbGVzXHJcblx0XHR0aGlzLm5vU3Ryb2tlKCk7XHJcblx0XHQvL2RyYXcgYWxsIG9mIHRoZSBwYXJ0aWNsZXNcclxuXHRcdGZvciAobGV0IHBhcnRpY2xlIG9mIHRoaXMucGFydGljbGVzKSB7XHJcblx0XHRcdHBhcnRpY2xlLnJlbmRlcih0aGlzLCB0aGlzLnVwc2NhbGVTaXplKTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLnNtb290aCgpOyAvL2VuYWJsZSBpbWFnZSBsZXJwXHJcblx0XHR0aGlzLmRyYXdpbmdDb250ZXh0Lmdsb2JhbEFscGhhID0gMC42NS1OdW1iZXIodGhpcy51c2VyR2VzdHVyZSkvMjA7IC8vbWFrZSBpbWFnZSB0cmFuc2x1Y2VudFxyXG5cdFx0VWlBc3NldHMudmlnbmV0dGUucmVuZGVyKHRoaXMsIDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcclxuXHRcdHRoaXMuZHJhd2luZ0NvbnRleHQuZ2xvYmFsQWxwaGEgPSAxLjA7XHJcblx0XHR0aGlzLm5vU21vb3RoKCk7XHJcblxyXG5cdFx0Ly8gZHJhdyB0aGUgaG90IGJhclxyXG5cdFx0aWYgKHRoaXMud29ybGQgIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMud29ybGQuaW52ZW50b3J5LndpZHRoOyBpKyspIHtcclxuXHRcdFx0XHRjb25zdCBjdXJyZW50SXRlbSA9IHRoaXMud29ybGQuaW52ZW50b3J5Lml0ZW1zW2ldO1xyXG5cclxuXHRcdFx0XHRVaUFzc2V0cy51aV9zbG90LnJlbmRlcihcclxuXHRcdFx0XHRcdHRoaXMsXHJcblx0XHRcdFx0XHQyICogdGhpcy51cHNjYWxlU2l6ZSArIDE2ICogaSAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdFx0XHQyICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0XHRcdDE2ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0XHRcdDE2ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0XHQpO1xyXG5cclxuXHRcdFx0XHRpZiAodGhpcy53b3JsZC5pbnZlbnRvcnkuc2VsZWN0ZWRTbG90ID09PSBpKSB7XHJcblx0XHRcdFx0XHRVaUFzc2V0cy51aV9zbG90X3NlbGVjdGVkLnJlbmRlcihcclxuXHRcdFx0XHRcdFx0dGhpcyxcclxuXHRcdFx0XHRcdFx0MiAqIHRoaXMudXBzY2FsZVNpemUgKyAxNiAqIGkgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHRcdFx0XHQyICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0XHRcdFx0MTYgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHRcdFx0XHQxNiAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRVaUFzc2V0cy51aV9zbG90LnJlbmRlcihcclxuXHRcdFx0XHRcdFx0dGhpcyxcclxuXHRcdFx0XHRcdFx0MiAqIHRoaXMudXBzY2FsZVNpemUgKyAxNiAqIGkgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHRcdFx0XHQyICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0XHRcdFx0MTYgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHRcdFx0XHQxNiAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKGN1cnJlbnRJdGVtICE9PSB1bmRlZmluZWQgJiYgY3VycmVudEl0ZW0gIT09IG51bGwpIHtcclxuXHRcdFx0XHRcdHRoaXMuZmlsbCgwKTtcclxuXHRcdFx0XHRcdGlmICh0aGlzLnBpY2tlZFVwU2xvdCA9PT0gaSkge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmRyYXdpbmdDb250ZXh0Lmdsb2JhbEFscGhhID0gMC41O1xyXG5cdFx0XHRcdFx0XHR0aGlzLmZpbGwoMCwgMTI3KTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRJdGVtQXNzZXRzW2N1cnJlbnRJdGVtLml0ZW1dLnJlbmRlcihcclxuXHRcdFx0XHRcdFx0dGhpcyxcclxuXHRcdFx0XHRcdFx0NiAqIHRoaXMudXBzY2FsZVNpemUgKyAxNiAqIGkgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHRcdFx0XHQ2ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0XHRcdFx0OCAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdFx0XHRcdDggKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHRcdFx0KTtcclxuXHJcblx0XHRcdFx0XHRGb250cy50b21fdGh1bWIuZHJhd1RleHQodGhpcywgY3VycmVudEl0ZW0ucXVhbnRpdHkudG9TdHJpbmcoKSwgKC00ICogY3VycmVudEl0ZW0ucXVhbnRpdHkudG9TdHJpbmcoKS5sZW5ndGggKyAxNiAqIChpKzEuMDYyNSkpICogdGhpcy51cHNjYWxlU2l6ZSwgMTEgKiB0aGlzLnVwc2NhbGVTaXplKVxyXG5cdFx0XHRcdFx0Ly8gdGhpcy50ZXh0KFxyXG5cdFx0XHRcdFx0Ly8gXHRjdXJyZW50SXRlbS5xdWFudGl0eSxcclxuXHRcdFx0XHRcdC8vIFx0MTYgKiB0aGlzLnVwc2NhbGVTaXplICsgMTYgKiBpICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0XHRcdC8vIFx0MTYgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHRcdFx0Ly8gKTtcclxuXHJcblx0XHRcdFx0XHR0aGlzLmRyYXdpbmdDb250ZXh0Lmdsb2JhbEFscGhhID0gMS4wO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gZHJhdyB0aGUgY3Vyc29yXHJcblx0XHRcdHRoaXMuZHJhd0N1cnNvcigpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0aGlzLmN1cnJlbnRVaSAhPT0gdW5kZWZpbmVkKVxyXG5cdFx0XHR0aGlzLmN1cnJlbnRVaS5yZW5kZXIodGhpcywgdGhpcy51cHNjYWxlU2l6ZSk7XHJcblxyXG5cdFx0Rm9udHMudG9tX3RodW1iLmRyYXdUZXh0KHRoaXMsIFwiU25vd2VkIEluIHYxLjAuMFwiLCB0aGlzLnVwc2NhbGVTaXplLCB0aGlzLmhlaWdodC02KnRoaXMudXBzY2FsZVNpemUpO1xyXG5cdFx0aWYoIXRoaXMudXNlckdlc3R1cmUpXHJcblx0XHRGb250cy50aXRsZS5kcmF3VGV4dCh0aGlzLCBcIkNsaWNrIEFueXdoZXJlIFRvIFVubXV0ZS5cIiwgdGhpcy53aWR0aC8yLXRoaXMudXBzY2FsZVNpemUqNzYsIHRoaXMudXBzY2FsZVNpemUqNStNYXRoLmFicyhNYXRoLnNpbih0aGlzLm1pbGxpcygpLzIwMCkpKnRoaXMudXBzY2FsZVNpemUqMTApO1xyXG5cclxuXHRcdC8vIGNvbnNvbGUudGltZUVuZChcImZyYW1lXCIpO1xyXG5cdH1cclxuXHJcblx0d2luZG93UmVzaXplZCgpIHtcclxuXHJcblx0XHRsZXQgcFVwc2NhbGVTaXplID0gdGhpcy51cHNjYWxlU2l6ZTtcclxuXHRcdC8vIGdvIGZvciBhIHNjYWxlIG9mIDw0OCB0aWxlcyBzY3JlZW5cclxuXHRcdHRoaXMudXBzY2FsZVNpemUgPSBNYXRoLm1pbihcclxuXHRcdFx0TWF0aC5jZWlsKHRoaXMud2luZG93V2lkdGggLyA0OCAvIHRoaXMuVElMRV9XSURUSCksXHJcblx0XHRcdE1hdGguY2VpbCh0aGlzLndpbmRvd0hlaWdodCAvIDQ4IC8gdGhpcy5USUxFX0hFSUdIVCksXHJcblx0XHQpO1xyXG5cclxuXHRcdGlmKHRoaXMuY2xvdWRzIT0gdW5kZWZpbmVkICYmIHRoaXMuY2xvdWRzLmxlbmd0aD4wKSB7Ly9zdHJldGNoIGNsb3VkIGxvY2F0aW9ucyBzbyBhcyB0byBub3QgY3JlYXRlIGdhcHNcclxuXHRcdFx0Zm9yKGxldCBjbG91ZCBvZiB0aGlzLmNsb3Vkcykge1xyXG5cdFx0XHRcdGNsb3VkLnggPSB0aGlzLmludGVycG9sYXRlZENhbVggKyAoY2xvdWQueC10aGlzLmludGVycG9sYXRlZENhbVgpKnRoaXMud2luZG93V2lkdGgvdGhpcy53aWR0aC90aGlzLnVwc2NhbGVTaXplKnBVcHNjYWxlU2l6ZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0dGhpcy5yZXNpemVDYW52YXModGhpcy53aW5kb3dXaWR0aCwgdGhpcy53aW5kb3dIZWlnaHQpO1xyXG5cdFx0dGhpcy5za3lMYXllci5yZXNpemVDYW52YXModGhpcy53aW5kb3dXaWR0aCwgdGhpcy53aW5kb3dIZWlnaHQpO1xyXG5cclxuXHRcdFxyXG5cclxuXHRcdHRoaXMuc2t5U2hhZGVyLnNldFVuaWZvcm0oJ3NjcmVlbkRpbWVuc2lvbnMnLCBbXHJcblx0XHRcdCh0aGlzLndpbmRvd1dpZHRoIC8gdGhpcy51cHNjYWxlU2l6ZSkgKiAyLFxyXG5cdFx0XHQodGhpcy53aW5kb3dIZWlnaHQgLyB0aGlzLnVwc2NhbGVTaXplKSAqIDIsXHJcblx0XHRdKTtcclxuXHJcblx0XHRpZiAodGhpcy5jdXJyZW50VWkgIT09IHVuZGVmaW5lZCkgdGhpcy5jdXJyZW50VWkud2luZG93VXBkYXRlKCk7XHJcblx0fVxyXG5cclxuXHRrZXlQcmVzc2VkKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XHJcblx0XHR0aGlzLmtleXNbdGhpcy5rZXlDb2RlXSA9IHRydWU7XHJcblx0XHRmb3IgKGxldCBjb250cm9sIG9mIHRoaXMuY29udHJvbHMpIHtcclxuXHRcdFx0aWYgKGNvbnRyb2wua2V5Ym9hcmQgJiYgY29udHJvbC5rZXlDb2RlID09PSBldmVudC5rZXlDb2RlKVxyXG5cdFx0XHRcdC8vZXZlbnQua2V5Q29kZSBpcyBkZXByZWNhdGVkIGJ1dCBpIGRvbid0IGNhcmVcclxuXHRcdFx0XHRjb250cm9sLm9uUHJlc3NlZCgpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKFxyXG5cdFx0XHR0aGlzLmN1cnJlbnRVaSAhPT0gdW5kZWZpbmVkICYmXHJcblx0XHRcdHRoaXMuY3VycmVudFVpLmlucHV0Qm94ZXMgIT09IHVuZGVmaW5lZFxyXG5cdFx0KSB7XHJcblx0XHRcdGZvciAobGV0IGkgb2YgdGhpcy5jdXJyZW50VWkuaW5wdXRCb3hlcykge1xyXG5cdFx0XHRcdGlmIChpLmxpc3RlbmluZykge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ3Rlc3QzJyk7XHJcblx0XHRcdFx0XHRpLmxpc3RlbmluZyA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0dGhpcy5jb250cm9sc1tpLmluZGV4XS5rZXlDb2RlID0gZXZlbnQua2V5Q29kZTtcclxuXHRcdFx0XHRcdHRoaXMuY29udHJvbHNbaS5pbmRleF0ua2V5Ym9hcmQgPSBmYWxzZTtcclxuXHRcdFx0XHRcdGkudmFsdWUgPSBldmVudC5rZXlDb2RlO1xyXG5cdFx0XHRcdFx0aS5rZXlib2FyZCA9IHRydWU7XHJcblx0XHRcdFx0XHRpLmltYWdlID0gVWlBc3NldHMuYnV0dG9uX3Vuc2VsZWN0ZWQ7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRrZXlSZWxlYXNlZChldmVudDogS2V5Ym9hcmRFdmVudCkge1xyXG5cdFx0dGhpcy5rZXlzW3RoaXMua2V5Q29kZV0gPSBmYWxzZTtcclxuXHRcdGZvciAobGV0IGNvbnRyb2wgb2YgdGhpcy5jb250cm9scykge1xyXG5cdFx0XHRpZiAoY29udHJvbC5rZXlib2FyZCAmJiBjb250cm9sLmtleUNvZGUgPT09IGV2ZW50LmtleUNvZGUpXHJcblx0XHRcdFx0Ly9ldmVudC5rZXlDb2RlIGlzIGRlcHJlY2F0ZWQgYnV0IGkgZG9uJ3QgY2FyZVxyXG5cdFx0XHRcdGNvbnRyb2wub25SZWxlYXNlZCgpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Ly8gd2hlbiBpdCdzIGRyYWdnZWQgdXBkYXRlIHRoZSBzbGlkZXJzXHJcblx0bW91c2VEcmFnZ2VkKCkge1xyXG5cdFx0aWYgKFxyXG5cdFx0XHR0aGlzLmN1cnJlbnRVaSAhPT0gdW5kZWZpbmVkICYmXHJcblx0XHRcdHRoaXMuY3VycmVudFVpLnNsaWRlcnMgIT09IHVuZGVmaW5lZFxyXG5cdFx0KSB7XHJcblx0XHRcdGZvciAoY29uc3QgaSBvZiB0aGlzLmN1cnJlbnRVaS5zbGlkZXJzKSB7XHJcblx0XHRcdFx0aS51cGRhdGVTbGlkZXJQb3NpdGlvbih0aGlzLm1vdXNlWCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdG1vdXNlTW92ZWQoKSB7XHJcblx0XHRpZiAodGhpcy5jdXJyZW50VWkgIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRpZiAodGhpcy5jdXJyZW50VWkuYnV0dG9ucyAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0Zm9yIChjb25zdCBpIG9mIHRoaXMuY3VycmVudFVpLmJ1dHRvbnMpIHtcclxuXHRcdFx0XHRcdGkudXBkYXRlTW91c2VPdmVyKHRoaXMubW91c2VYLCB0aGlzLm1vdXNlWSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmICh0aGlzLmN1cnJlbnRVaS5pbnB1dEJveGVzICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHRmb3IgKGNvbnN0IGkgb2YgdGhpcy5jdXJyZW50VWkuaW5wdXRCb3hlcykge1xyXG5cdFx0XHRcdFx0aS51cGRhdGVNb3VzZU92ZXIodGhpcy5tb3VzZVgsIHRoaXMubW91c2VZKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdG1vdXNlUHJlc3NlZChlOiBNb3VzZUV2ZW50KSB7XHJcblx0XHRpZighdGhpcy51c2VyR2VzdHVyZSkge1xyXG5cdFx0XHR0aGlzLnVzZXJHZXN0dXJlID0gdHJ1ZTtcclxuXHRcdFx0dGhpcy5zdGFydFNvdW5kcygpO1xyXG5cdFx0fVxyXG5cdFx0Ly8gaW1hZ2UodWlTbG90SW1hZ2UsIDIqdXBzY2FsZVNpemUrMTYqaSp1cHNjYWxlU2l6ZSwgMip1cHNjYWxlU2l6ZSwgMTYqdXBzY2FsZVNpemUsIDE2KnVwc2NhbGVTaXplKTtcclxuXHRcdGlmICh0aGlzLmN1cnJlbnRVaSAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdHRoaXMuY3VycmVudFVpLm1vdXNlUHJlc3NlZChlLmJ1dHRvbik7XHJcblx0XHRcdHJldHVybjsgLy8gYXNqZ3NhZGtqZmdJSVNVU1VFVUVcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy53b3JsZCA9PT0gdW5kZWZpbmVkKSByZXR1cm47XHJcblxyXG5cdFx0aWYgKFxyXG5cdFx0XHR0aGlzLm1vdXNlWCA+IDIgKiB0aGlzLnVwc2NhbGVTaXplICYmXHJcblx0XHRcdHRoaXMubW91c2VYIDxcclxuXHRcdFx0MiAqIHRoaXMudXBzY2FsZVNpemUgK1xyXG5cdFx0XHQxNiAqIHRoaXMudXBzY2FsZVNpemUgKiB0aGlzLndvcmxkLmludmVudG9yeS53aWR0aCAmJlxyXG5cdFx0XHR0aGlzLm1vdXNlWSA+IDIgKiB0aGlzLnVwc2NhbGVTaXplICYmXHJcblx0XHRcdHRoaXMubW91c2VZIDwgMTggKiB0aGlzLnVwc2NhbGVTaXplXHJcblx0XHQpIHtcclxuXHRcdFx0Y29uc3QgY2xpY2tlZFNsb3Q6IG51bWJlciA9IE1hdGguZmxvb3IoXHJcblx0XHRcdFx0KHRoaXMubW91c2VYIC0gMiAqIHRoaXMudXBzY2FsZVNpemUpIC8gMTYgLyB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHQpO1xyXG5cclxuXHRcdFx0aWYgKHRoaXMud29ybGQuaW52ZW50b3J5LnBpY2tlZFVwU2xvdCA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMud29ybGQuaW52ZW50b3J5Lml0ZW1zW2NsaWNrZWRTbG90XSAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0XHR0aGlzLndvcmxkLmludmVudG9yeS5waWNrZWRVcFNsb3QgPSBjbGlja2VkU2xvdDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Ly8gU3dhcCBjbGlja2VkIHNsb3Qgd2l0aCB0aGUgcGlja2VkIHNsb3RcclxuXHRcdFx0XHR0aGlzLmNvbm5lY3Rpb24uZW1pdChcclxuXHRcdFx0XHRcdCdpbnZlbnRvcnlTd2FwJyxcclxuXHRcdFx0XHRcdHRoaXMud29ybGQuaW52ZW50b3J5LnBpY2tlZFVwU2xvdCxcclxuXHRcdFx0XHRcdGNsaWNrZWRTbG90LFxyXG5cdFx0XHRcdCk7XHJcblxyXG5cdFx0XHRcdC8vIFNldCB0aGUgcGlja2VkIHVwIHNsb3QgdG8gbm90aGluZ1xyXG5cdFx0XHRcdHRoaXMud29ybGQuaW52ZW50b3J5LnBpY2tlZFVwU2xvdCA9IHVuZGVmaW5lZDtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy53b3JsZC5pbnZlbnRvcnkud29ybGRDbGlja0NoZWNrKHRoaXMud29ybGRNb3VzZVgsIHRoaXMud29ybGRNb3VzZVkpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0bW91c2VSZWxlYXNlZCgpIHtcclxuXHRcdC8qXHJcblx0XHRpZih0aGlzLmN1cnJlbnRVaSAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdHRoaXMuY3VycmVudFVpLm1vdXNlUmVsZWFzZWQoKTtcclxuXHRcdH1cclxuXHRcdGNvbnN0IHJlbGVhc2VkU2xvdDogbnVtYmVyID0gTWF0aC5mbG9vcihcclxuXHRcdFx0KHRoaXMubW91c2VYIC0gMiAqIHRoaXMudXBzY2FsZVNpemUpIC8gMTYgLyB0aGlzLnVwc2NhbGVTaXplXHJcblx0XHQpO1xyXG5cclxuXHRcdGlmICh0aGlzLnBpY2tlZFVwU2xvdCAhPT0gLTEpIHtcclxuXHRcdFx0aWYgKFxyXG5cdFx0XHRcdHRoaXMubW91c2VYID4gMiAqIHRoaXMudXBzY2FsZVNpemUgJiZcclxuXHRcdFx0XHR0aGlzLm1vdXNlWCA8XHJcblx0XHRcdFx0XHQyICogdGhpcy51cHNjYWxlU2l6ZSArXHJcblx0XHRcdFx0XHRcdDE2ICogdGhpcy51cHNjYWxlU2l6ZSAqIHRoaXMuaG90QmFyLmxlbmd0aCAmJlxyXG5cdFx0XHRcdHRoaXMubW91c2VZID4gMiAqIHRoaXMudXBzY2FsZVNpemUgJiZcclxuXHRcdFx0XHR0aGlzLm1vdXNlWSA8IDE4ICogdGhpcy51cHNjYWxlU2l6ZVxyXG5cdFx0XHQpIHtcclxuXHRcdFx0XHQvLyBNYWtlIHN1cmUgdGhhdCB0aGUgc2xvdCB0aGF0IHRoZSBjdXJzb3Igd2FzIHJlbGVhc2VkIHdhcyBub3QgdGhlIHNsb3QgdGhhdCB3YXMgc2VsZWN0ZWRcclxuXHRcdFx0XHRpZiAocmVsZWFzZWRTbG90ID09PSB0aGlzLnBpY2tlZFVwU2xvdCkgcmV0dXJuO1xyXG5cclxuXHRcdFx0XHQvLyBTd2FwIHRoZSBwaWNrZWQgdXAgc2xvdCB3aXRoIHRoZSBzbG90IHRoZSBtb3VzZSB3YXMgcmVsZWFzZWQgb25cclxuXHRcdFx0XHRbdGhpcy5ob3RCYXJbdGhpcy5waWNrZWRVcFNsb3RdLCB0aGlzLmhvdEJhcltyZWxlYXNlZFNsb3RdXSA9IFtcclxuXHRcdFx0XHRcdHRoaXMuaG90QmFyW3JlbGVhc2VkU2xvdF0sXHJcblx0XHRcdFx0XHR0aGlzLmhvdEJhclt0aGlzLnBpY2tlZFVwU2xvdF0sXHJcblx0XHRcdFx0XTtcclxuXHJcblx0XHRcdFx0dGhpcy5waWNrZWRVcFNsb3QgPSAtMTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aGlzLmhvdEJhclt0aGlzLnBpY2tlZFVwU2xvdF0gPSB1bmRlZmluZWQ7XHJcblx0XHRcdFx0dGhpcy5waWNrZWRVcFNsb3QgPSAtMTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdCAqL1xyXG5cdH1cclxuXHJcblx0bW91c2VXaGVlbChldmVudDoge2RlbHRhOiBudW1iZXJ9KSB7XHJcblx0XHRpZiAoXHJcblx0XHRcdHRoaXMuY3VycmVudFVpICE9PSB1bmRlZmluZWQgJiZcclxuXHRcdFx0dGhpcy5jdXJyZW50VWkuc2Nyb2xsICE9PSB1bmRlZmluZWRcclxuXHRcdCkge1xyXG5cdFx0XHR0aGlzLmN1cnJlbnRVaS5zY3JvbGwgKz0gZXZlbnQuZGVsdGEgLyAxMDtcclxuXHRcdFx0dGhpcy5jdXJyZW50VWkuc2Nyb2xsID0gdGhpcy5jb25zdHJhaW4oXHJcblx0XHRcdFx0dGhpcy5jdXJyZW50VWkuc2Nyb2xsLFxyXG5cdFx0XHRcdHRoaXMuY3VycmVudFVpLm1pblNjcm9sbCxcclxuXHRcdFx0XHR0aGlzLmN1cnJlbnRVaS5tYXhTY3JvbGwsXHJcblx0XHRcdCk7XHJcblx0XHRcdGNvbnNvbGUubG9nKFxyXG5cdFx0XHRcdGBTY3JvbGw6ICR7dGhpcy5jdXJyZW50VWkuc2Nyb2xsfSwgTWluOiAke3RoaXMuY3VycmVudFVpLm1pblNjcm9sbH0sIE1heDogJHt0aGlzLmN1cnJlbnRVaS5tYXhTY3JvbGx9YCxcclxuXHRcdFx0KTtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHR0aGlzLndvcmxkLmludmVudG9yeS5zZWxlY3RlZFNsb3QgKz0gTWF0aC5mbG9vcihldmVudC5kZWx0YS8xMDApXHJcblx0XHRcdHRoaXMud29ybGQuaW52ZW50b3J5LnNlbGVjdGVkU2xvdCA9IHRoaXMud29ybGQuaW52ZW50b3J5LnNlbGVjdGVkU2xvdCV0aGlzLndvcmxkLmludmVudG9yeS53aWR0aDtcclxuXHRcdFx0aWYodGhpcy53b3JsZC5pbnZlbnRvcnkuc2VsZWN0ZWRTbG90PDApIHRoaXMud29ybGQuaW52ZW50b3J5LnNlbGVjdGVkU2xvdCArPSB0aGlzLndvcmxkLmludmVudG9yeS53aWR0aFxyXG5cdFx0XHRjb25zb2xlLmxvZyh0aGlzLndvcmxkLmludmVudG9yeS5zZWxlY3RlZFNsb3QpXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRtb3ZlQ2FtZXJhKCkge1xyXG5cdFx0dGhpcy5pbnRlcnBvbGF0ZWRDYW1YID1cclxuXHRcdFx0dGhpcy5wQ2FtWCArXHJcblx0XHRcdCh0aGlzLmNhbVggLSB0aGlzLnBDYW1YKSAqIHRoaXMuYW1vdW50U2luY2VMYXN0VGljayArXHJcblx0XHRcdCh0aGlzLm5vaXNlKHRoaXMubWlsbGlzKCkgLyAyMDApIC0gMC41KSAqIHRoaXMuc2NyZWVuc2hha2VBbW91bnQ7XHJcblx0XHR0aGlzLmludGVycG9sYXRlZENhbVkgPVxyXG5cdFx0XHR0aGlzLnBDYW1ZICtcclxuXHRcdFx0KHRoaXMuY2FtWSAtIHRoaXMucENhbVkpICogdGhpcy5hbW91bnRTaW5jZUxhc3RUaWNrICtcclxuXHRcdFx0KHRoaXMubm9pc2UoMCwgdGhpcy5taWxsaXMoKSAvIDIwMCkgLSAwLjUpICogdGhpcy5zY3JlZW5zaGFrZUFtb3VudDtcclxuXHR9XHJcblxyXG5cdGRvVGlja3MoKSB7XHJcblx0XHQvLyBpbmNyZWFzZSB0aGUgdGltZSBzaW5jZSBhIHRpY2sgaGFzIGhhcHBlbmVkIGJ5IGRlbHRhVGltZSwgd2hpY2ggaXMgYSBidWlsdC1pbiBwNS5qcyB2YWx1ZVxyXG5cdFx0dGhpcy5tc1NpbmNlVGljayArPSB0aGlzLmRlbHRhVGltZTtcclxuXHJcblx0XHQvLyBkZWZpbmUgYSB0ZW1wb3JhcnkgdmFyaWFibGUgY2FsbGVkIHRpY2tzVGhpc0ZyYW1lIC0gdGhpcyBpcyB1c2VkIHRvIGtlZXAgdHJhY2sgb2YgaG93IG1hbnkgdGlja3MgaGF2ZSBiZWVuIGNhbGN1bGF0ZWQgd2l0aGluIHRoZSBkdXJhdGlvbiBvZiB0aGUgY3VycmVudCBmcmFtZS4gIEFzIGxvbmcgYXMgdGhpcyB2YWx1ZSBpcyBsZXNzIHRoYW4gdGhlIGZvcmdpdmVuZXNzQ291bnQgdmFyaWFibGUsIGl0IGNvbnRpbnVlcyB0byBjYWxjdWxhdGUgdGlja3MgYXMgbmVjZXNzYXJ5LlxyXG5cdFx0bGV0IHRpY2tzVGhpc0ZyYW1lID0gMDtcclxuXHRcdHdoaWxlIChcclxuXHRcdFx0dGhpcy5tc1NpbmNlVGljayA+IHRoaXMubXNQZXJUaWNrICYmXHJcblx0XHRcdHRpY2tzVGhpc0ZyYW1lICE9PSB0aGlzLmZvcmdpdmVuZXNzQ291bnRcclxuXHRcdCkge1xyXG5cdFx0XHQvLyBjb25zb2xlLnRpbWUoXCJ0aWNrXCIpO1xyXG5cdFx0XHRpZiAodGhpcy53b3JsZCAhPT0gdW5kZWZpbmVkKSB0aGlzLmRvVGljaygpO1xyXG5cdFx0XHQvLyBjb25zb2xlLnRpbWVFbmQoXCJ0aWNrXCIpO1xyXG5cdFx0XHR0aGlzLm1zU2luY2VUaWNrIC09IHRoaXMubXNQZXJUaWNrO1xyXG5cdFx0XHR0aWNrc1RoaXNGcmFtZSsrO1xyXG5cdFx0fVxyXG5cdFx0aWYgKHRpY2tzVGhpc0ZyYW1lID09PSB0aGlzLmZvcmdpdmVuZXNzQ291bnQpIHtcclxuXHRcdFx0dGhpcy5tc1NpbmNlVGljayA9IDA7XHJcblx0XHRcdGNvbnNvbGUud2FybihcclxuXHRcdFx0XHRcImxhZyBzcGlrZSBkZXRlY3RlZCwgdGljayBjYWxjdWxhdGlvbnMgY291bGRuJ3Qga2VlcCB1cFwiLFxyXG5cdFx0XHQpO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5hbW91bnRTaW5jZUxhc3RUaWNrID0gdGhpcy5tc1NpbmNlVGljayAvIHRoaXMubXNQZXJUaWNrO1xyXG5cdH1cclxuXHJcblx0ZG9UaWNrKCkge1xyXG5cdFx0aWYodGhpcy53b3JsZCAhPT0gdW5kZWZpbmVkICYmIHRoaXMud29ybGQudGlsZUVudGl0aWVzICE9PSB1bmRlZmluZWQpIHsvL3RpbGUgZW50aXR5IHBhcnRpY2xlc1xyXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGFydGljbGVNdWx0aXBsaWVyOyBpKyspIHtcclxuXHRcdFx0XHRsZXQgayA9IE9iamVjdC5rZXlzKHRoaXMud29ybGQudGlsZUVudGl0aWVzKTtcclxuXHRcdFx0XHRsZXQgciA9IHRoaXMud29ybGQudGlsZUVudGl0aWVzW2tbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKmsubGVuZ3RoKV1dO1xyXG5cdFx0XHRcdGlmKHIucGF5bG9hZC50eXBlXyA9PT0gVGlsZUVudGl0aWVzLlRyZWUpIHtcclxuXHRcdFx0XHRcdGxldCB0ID0gci5jb3ZlcmVkVGlsZXNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKnIuY292ZXJlZFRpbGVzLmxlbmd0aCldO1xyXG5cdFx0XHRcdFx0dGhpcy5wYXJ0aWNsZXMucHVzaChuZXcgQ29sb3JQYXJ0aWNsZShcIiMzNDg5NjVcIiwgTWF0aC5yYW5kb20oKSowLjErMC4xLCAyMCwgdCV0aGlzLndvcmxkLndpZHRoK01hdGgucmFuZG9tKCksIE1hdGguZmxvb3IodC90aGlzLndvcmxkLndpZHRoKStNYXRoLnJhbmRvbSgpLCAwLjEqKE1hdGgucmFuZG9tKCktMC41KSwgMC4wNiooTWF0aC5yYW5kb20oKS0wLjcpLCBmYWxzZSkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Zm9yIChsZXQgcGFydGljbGUgb2YgdGhpcy5wYXJ0aWNsZXMpIHtcclxuXHRcdFx0cGFydGljbGUudGljaygpO1xyXG5cdFx0fVxyXG5cdFx0Zm9yIChsZXQgY2xvdWQgb2YgdGhpcy5jbG91ZHMpIHtcclxuXHRcdFx0Y2xvdWQudGljaygpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKHRoaXMud29ybGQucGxheWVyID09PSB1bmRlZmluZWQpIHJldHVybjtcclxuXHJcblx0XHR0aGlzLndvcmxkLnBsYXllci5rZXlib2FyZElucHV0KCk7XHJcblx0XHR0aGlzLndvcmxkLnBsYXllci5hcHBseUdyYXZpdHlBbmREcmFnKCk7XHJcblx0XHR0aGlzLndvcmxkLnBsYXllci5hcHBseVZlbG9jaXR5QW5kQ29sbGlkZSgpO1xyXG5cclxuXHRcdHRoaXMucENhbVggPSB0aGlzLmNhbVg7XHJcblx0XHR0aGlzLnBDYW1ZID0gdGhpcy5jYW1ZO1xyXG5cdFx0dGhpcy5kZXNpcmVkQ2FtWCA9XHJcblx0XHRcdHRoaXMud29ybGQucGxheWVyLnggK1xyXG5cdFx0XHR0aGlzLndvcmxkLnBsYXllci53aWR0aCAvIDIgLVxyXG5cdFx0XHR0aGlzLndpZHRoIC8gMiAvIHRoaXMuVElMRV9XSURUSCAvIHRoaXMudXBzY2FsZVNpemUgK1xyXG5cdFx0XHR0aGlzLndvcmxkLnBsYXllci54VmVsICogNDA7XHJcblx0XHR0aGlzLmRlc2lyZWRDYW1ZID1cclxuXHRcdFx0dGhpcy53b3JsZC5wbGF5ZXIueSArXHJcblx0XHRcdHRoaXMud29ybGQucGxheWVyLmhlaWdodCAvIDIgLVxyXG5cdFx0XHR0aGlzLmhlaWdodCAvIDIgLyB0aGlzLlRJTEVfSEVJR0hUIC8gdGhpcy51cHNjYWxlU2l6ZSArXHJcblx0XHRcdHRoaXMud29ybGQucGxheWVyLnlWZWwgKiAyMDtcclxuXHRcdHRoaXMuY2FtWCA9ICh0aGlzLmRlc2lyZWRDYW1YICsgdGhpcy5jYW1YICogMjQpIC8gMjU7XHJcblx0XHR0aGlzLmNhbVkgPSAodGhpcy5kZXNpcmVkQ2FtWSArIHRoaXMuY2FtWSAqIDI0KSAvIDI1O1xyXG5cclxuXHRcdHRoaXMuc2NyZWVuc2hha2VBbW91bnQgKj0gMC44O1xyXG5cclxuXHRcdGlmICh0aGlzLmNhbVggPCAwKSB7XHJcblx0XHRcdHRoaXMuY2FtWCA9IDA7XHJcblx0XHR9IGVsc2UgaWYgKFxyXG5cdFx0XHR0aGlzLmNhbVggPlxyXG5cdFx0XHR0aGlzLndvcmxkV2lkdGggLSB0aGlzLndpZHRoIC8gdGhpcy51cHNjYWxlU2l6ZSAvIHRoaXMuVElMRV9XSURUSFxyXG5cdFx0KSB7XHJcblx0XHRcdHRoaXMuY2FtWCA9XHJcblx0XHRcdFx0dGhpcy53b3JsZFdpZHRoIC1cclxuXHRcdFx0XHR0aGlzLndpZHRoIC8gdGhpcy51cHNjYWxlU2l6ZSAvIHRoaXMuVElMRV9XSURUSDtcclxuXHRcdH1cclxuXHRcdGlmIChcclxuXHRcdFx0dGhpcy5jYW1ZID5cclxuXHRcdFx0dGhpcy53b3JsZEhlaWdodCAtIHRoaXMuaGVpZ2h0IC8gdGhpcy51cHNjYWxlU2l6ZSAvIHRoaXMuVElMRV9IRUlHSFRcclxuXHRcdCkge1xyXG5cdFx0XHR0aGlzLmNhbVkgPVxyXG5cdFx0XHRcdHRoaXMud29ybGRIZWlnaHQgLVxyXG5cdFx0XHRcdHRoaXMuaGVpZ2h0IC8gdGhpcy51cHNjYWxlU2l6ZSAvIHRoaXMuVElMRV9IRUlHSFQ7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRzdGFydFNvdW5kcygpIHtcclxuXHRcdGNvbnNvbGUubG9nKFwic3RhcnRpbmcgc291bmRzIGhhcyBub3QgYmVlbiBpbXBsZW1lbnRlZCB5ZXQuXCIpXHJcblx0fVxyXG5cclxuXHR1aUZyYW1lUmVjdCh4OiBudW1iZXIsIHk6IG51bWJlciwgdzogbnVtYmVyLCBoOiBudW1iZXIpIHtcclxuXHRcdC8vIHNldCB0aGUgY29vcmRzIGFuZCBkaW1lbnNpb25zIHRvIHJvdW5kIHRvIHRoZSBuZWFyZXN0IHVuLXVwc2NhbGVkIHBpeGVsXHJcblx0XHR4ID0gTWF0aC5yb3VuZCh4IC8gdGhpcy51cHNjYWxlU2l6ZSkgKiB0aGlzLnVwc2NhbGVTaXplO1xyXG5cdFx0eSA9IE1hdGgucm91bmQoeSAvIHRoaXMudXBzY2FsZVNpemUpICogdGhpcy51cHNjYWxlU2l6ZTtcclxuXHRcdHcgPSBNYXRoLnJvdW5kKHcgLyB0aGlzLnVwc2NhbGVTaXplKSAqIHRoaXMudXBzY2FsZVNpemU7XHJcblx0XHRoID0gTWF0aC5yb3VuZChoIC8gdGhpcy51cHNjYWxlU2l6ZSkgKiB0aGlzLnVwc2NhbGVTaXplO1xyXG5cclxuXHRcdC8vIGNvcm5lcnNcclxuXHRcdFVpQXNzZXRzLnVpX2ZyYW1lLnJlbmRlclBhcnRpYWwoXHJcblx0XHRcdHRoaXMsXHJcblx0XHRcdHgsXHJcblx0XHRcdHksXHJcblx0XHRcdDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHQ3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0MCxcclxuXHRcdFx0MCxcclxuXHRcdFx0NyxcclxuXHRcdFx0NyxcclxuXHRcdCk7XHJcblx0XHRVaUFzc2V0cy51aV9mcmFtZS5yZW5kZXJQYXJ0aWFsKFxyXG5cdFx0XHR0aGlzLFxyXG5cdFx0XHR4ICsgdyAtIDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHR5LFxyXG5cdFx0XHQ3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0NyAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdDgsXHJcblx0XHRcdDAsXHJcblx0XHRcdDcsXHJcblx0XHRcdDcsXHJcblx0XHQpO1xyXG5cdFx0VWlBc3NldHMudWlfZnJhbWUucmVuZGVyUGFydGlhbChcclxuXHRcdFx0dGhpcyxcclxuXHRcdFx0eCxcclxuXHRcdFx0eSArIGggLSA3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0NyAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHQwLFxyXG5cdFx0XHQ4LFxyXG5cdFx0XHQ3LFxyXG5cdFx0XHQ3LFxyXG5cdFx0KTtcclxuXHRcdFVpQXNzZXRzLnVpX2ZyYW1lLnJlbmRlclBhcnRpYWwoXHJcblx0XHRcdHRoaXMsXHJcblx0XHRcdHggKyB3IC0gNyAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdHkgKyBoIC0gNyAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHQ3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0OCxcclxuXHRcdFx0OCxcclxuXHRcdFx0NyxcclxuXHRcdFx0NyxcclxuXHRcdCk7XHJcblxyXG5cdFx0Ly8gdG9wIGFuZCBib3R0b21cclxuXHRcdFVpQXNzZXRzLnVpX2ZyYW1lLnJlbmRlclBhcnRpYWwoXHJcblx0XHRcdHRoaXMsXHJcblx0XHRcdHggKyA3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0eSxcclxuXHRcdFx0dyAtIDE0ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0NyAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdDcsXHJcblx0XHRcdDAsXHJcblx0XHRcdDEsXHJcblx0XHRcdDcsXHJcblx0XHQpO1xyXG5cdFx0VWlBc3NldHMudWlfZnJhbWUucmVuZGVyUGFydGlhbChcclxuXHRcdFx0dGhpcyxcclxuXHRcdFx0eCArIDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHR5ICsgaCAtIDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHR3IC0gMTQgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHQ3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0NyxcclxuXHRcdFx0OCxcclxuXHRcdFx0MSxcclxuXHRcdFx0NyxcclxuXHRcdCk7XHJcblxyXG5cdFx0Ly8gbGVmdCBhbmQgcmlnaHRcclxuXHRcdFVpQXNzZXRzLnVpX2ZyYW1lLnJlbmRlclBhcnRpYWwoXHJcblx0XHRcdHRoaXMsXHJcblx0XHRcdHgsXHJcblx0XHRcdHkgKyA3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0NyAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdGggLSAxNCAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdDAsXHJcblx0XHRcdDcsXHJcblx0XHRcdDcsXHJcblx0XHRcdDEsXHJcblx0XHQpO1xyXG5cdFx0VWlBc3NldHMudWlfZnJhbWUucmVuZGVyUGFydGlhbChcclxuXHRcdFx0dGhpcyxcclxuXHRcdFx0eCArIHcgLSA3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0eSArIDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHQ3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0aCAtIDE0ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0OCxcclxuXHRcdFx0NyxcclxuXHRcdFx0NyxcclxuXHRcdFx0MSxcclxuXHRcdCk7XHJcblxyXG5cdFx0Ly8gY2VudGVyXHJcblx0XHRVaUFzc2V0cy51aV9mcmFtZS5yZW5kZXJQYXJ0aWFsKFxyXG5cdFx0XHR0aGlzLFxyXG5cdFx0XHR4ICsgNyAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdHkgKyA3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0dyAtIDE0ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0aCAtIDE0ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0NyxcclxuXHRcdFx0NyxcclxuXHRcdFx0MSxcclxuXHRcdFx0MSxcclxuXHRcdCk7XHJcblx0fVxyXG5cclxuXHQvKlxyXG4gICAvJCQkJCQkJCAgLyQkICAgICAgICAgICAgICAgICAgICAgICAgICAgLyQkXHJcbiAgfCAkJF9fICAkJHwgJCQgICAgICAgICAgICAgICAgICAgICAgICAgIHxfXy9cclxuICB8ICQkICBcXCAkJHwgJCQkJCQkJCAgLyQkICAgLyQkICAvJCQkJCQkJCAvJCQgIC8kJCQkJCQkICAvJCQkJCQkJCAvJCRcclxuICB8ICQkJCQkJCQvfCAkJF9fICAkJHwgJCQgIHwgJCQgLyQkX19fX18vfCAkJCAvJCRfX19fXy8gLyQkX19fX18vfF9fL1xyXG4gIHwgJCRfX19fLyB8ICQkICBcXCAkJHwgJCQgIHwgJCR8ICAkJCQkJCQgfCAkJHwgJCQgICAgICB8ICAkJCQkJCRcclxuICB8ICQkICAgICAgfCAkJCAgfCAkJHwgJCQgIHwgJCQgXFxfX19fICAkJHwgJCR8ICQkICAgICAgIFxcX19fXyAgJCQgLyQkXHJcbiAgfCAkJCAgICAgIHwgJCQgIHwgJCR8ICAkJCQkJCQkIC8kJCQkJCQkL3wgJCR8ICAkJCQkJCQkIC8kJCQkJCQkL3xfXy9cclxuICB8X18vICAgICAgfF9fLyAgfF9fLyBcXF9fX18gICQkfF9fX19fX18vIHxfXy8gXFxfX19fX19fL3xfX19fX19fL1xyXG5cdFx0XHRcdFx0ICAgLyQkICB8ICQkXHJcblx0XHRcdFx0XHQgIHwgICQkJCQkJC9cclxuXHRcdFx0XHRcdCAgIFxcX19fX19fL1xyXG4gICovXHJcblxyXG5cdC8vIHRoaXMgY2xhc3MgaG9sZHMgYW4gYXhpcy1hbGlnbmVkIHJlY3RhbmdsZSBhZmZlY3RlZCBieSBncmF2aXR5LCBkcmFnLCBhbmQgY29sbGlzaW9ucyB3aXRoIHRpbGVzLlxyXG5cclxuXHRyZWN0VnNSYXkoXHJcblx0XHRyZWN0WD86IGFueSxcclxuXHRcdHJlY3RZPzogYW55LFxyXG5cdFx0cmVjdFc/OiBhbnksXHJcblx0XHRyZWN0SD86IGFueSxcclxuXHRcdHJheVg/OiBhbnksXHJcblx0XHRyYXlZPzogYW55LFxyXG5cdFx0cmF5Vz86IGFueSxcclxuXHRcdHJheUg/OiBhbnksXHJcblx0KSB7XHJcblx0XHQvLyB0aGlzIHJheSBpcyBhY3R1YWxseSBhIGxpbmUgc2VnbWVudCBtYXRoZW1hdGljYWxseSwgYnV0IGl0J3MgY29tbW9uIHRvIHNlZSBwZW9wbGUgcmVmZXIgdG8gc2ltaWxhciBjaGVja3MgYXMgcmF5LWNhc3RzLCBzbyBmb3IgdGhlIGR1cmF0aW9uIG9mIHRoZSBkZWZpbml0aW9uIG9mIHRoaXMgZnVuY3Rpb24sIHJheSBjYW4gYmUgYXNzdW1lZCB0byBtZWFuIHRoZSBzYW1lIGFzIGxpbmUgc2VnbWVudC5cclxuXHJcblx0XHQvLyBpZiB0aGUgcmF5IGRvZXNuJ3QgaGF2ZSBhIGxlbmd0aCwgdGhlbiBpdCBjYW4ndCBoYXZlIGVudGVyZWQgdGhlIHJlY3RhbmdsZS4gIFRoaXMgYXNzdW1lcyB0aGF0IHRoZSBvYmplY3RzIGRvbid0IHN0YXJ0IGluIGNvbGxpc2lvbiwgb3RoZXJ3aXNlIHRoZXknbGwgYmVoYXZlIHN0cmFuZ2VseVxyXG5cdFx0aWYgKHJheVcgPT09IDAgJiYgcmF5SCA9PT0gMCkge1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gY2FsY3VsYXRlIGhvdyBmYXIgYWxvbmcgdGhlIHJheSBlYWNoIHNpZGUgb2YgdGhlIHJlY3RhbmdsZSBpbnRlcnNlY3RzIHdpdGggaXQgKGVhY2ggc2lkZSBpcyBleHRlbmRlZCBvdXQgaW5maW5pdGVseSBpbiBib3RoIGRpcmVjdGlvbnMpXHJcblx0XHRjb25zdCB0b3BJbnRlcnNlY3Rpb24gPSAocmVjdFkgLSByYXlZKSAvIHJheUg7XHJcblx0XHRjb25zdCBib3R0b21JbnRlcnNlY3Rpb24gPSAocmVjdFkgKyByZWN0SCAtIHJheVkpIC8gcmF5SDtcclxuXHRcdGNvbnN0IGxlZnRJbnRlcnNlY3Rpb24gPSAocmVjdFggLSByYXlYKSAvIHJheVc7XHJcblx0XHRjb25zdCByaWdodEludGVyc2VjdGlvbiA9IChyZWN0WCArIHJlY3RXIC0gcmF5WCkgLyByYXlXO1xyXG5cclxuXHRcdGlmIChcclxuXHRcdFx0aXNOYU4odG9wSW50ZXJzZWN0aW9uKSB8fFxyXG5cdFx0XHRpc05hTihib3R0b21JbnRlcnNlY3Rpb24pIHx8XHJcblx0XHRcdGlzTmFOKGxlZnRJbnRlcnNlY3Rpb24pIHx8XHJcblx0XHRcdGlzTmFOKHJpZ2h0SW50ZXJzZWN0aW9uKVxyXG5cdFx0KSB7XHJcblx0XHRcdC8vIHlvdSBoYXZlIHRvIHVzZSB0aGUgSlMgZnVuY3Rpb24gaXNOYU4oKSB0byBjaGVjayBpZiBhIHZhbHVlIGlzIE5hTiBiZWNhdXNlIGJvdGggTmFOPT1OYU4gYW5kIE5hTj09PU5hTiBhcmUgZmFsc2UuXHJcblx0XHRcdC8vIGlmIGFueSBvZiB0aGVzZSB2YWx1ZXMgYXJlIE5hTiwgbm8gY29sbGlzaW9uIGhhcyBvY2N1cnJlZFxyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gY2FsY3VsYXRlIHRoZSBuZWFyZXN0IGFuZCBmYXJ0aGVzdCBpbnRlcnNlY3Rpb25zIGZvciBib3RoIHggYW5kIHlcclxuXHRcdGNvbnN0IG5lYXJYID0gdGhpcy5taW4obGVmdEludGVyc2VjdGlvbiwgcmlnaHRJbnRlcnNlY3Rpb24pO1xyXG5cdFx0Y29uc3QgZmFyWCA9IHRoaXMubWF4KGxlZnRJbnRlcnNlY3Rpb24sIHJpZ2h0SW50ZXJzZWN0aW9uKTtcclxuXHRcdGNvbnN0IG5lYXJZID0gdGhpcy5taW4odG9wSW50ZXJzZWN0aW9uLCBib3R0b21JbnRlcnNlY3Rpb24pO1xyXG5cdFx0Y29uc3QgZmFyWSA9IHRoaXMubWF4KHRvcEludGVyc2VjdGlvbiwgYm90dG9tSW50ZXJzZWN0aW9uKTtcclxuXHJcblx0XHRpZiAobmVhclggPiBmYXJZIHx8IG5lYXJZID4gZmFyWCkge1xyXG5cdFx0XHQvLyB0aGlzIG11c3QgbWVhbiB0aGF0IHRoZSBsaW5lIHRoYXQgbWFrZXMgdXAgdGhlIGxpbmUgc2VnbWVudCBkb2Vzbid0IHBhc3MgdGhyb3VnaCB0aGUgcmF5XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoZmFyWCA8IDAgfHwgZmFyWSA8IDApIHtcclxuXHRcdFx0Ly8gdGhlIGludGVyc2VjdGlvbiBpcyBoYXBwZW5pbmcgYmVmb3JlIHRoZSByYXkgc3RhcnRzLCBzbyB0aGUgcmF5IGlzIHBvaW50aW5nIGF3YXkgZnJvbSB0aGUgdHJpYW5nbGVcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGNhbGN1bGF0ZSB3aGVyZSB0aGUgcG90ZW50aWFsIGNvbGxpc2lvbiBjb3VsZCBiZVxyXG5cdFx0Y29uc3QgbmVhckNvbGxpc2lvblBvaW50ID0gdGhpcy5tYXgobmVhclgsIG5lYXJZKTtcclxuXHJcblx0XHRpZiAobmVhclggPiAxIHx8IG5lYXJZID4gMSkge1xyXG5cdFx0XHQvLyB0aGUgaW50ZXJzZWN0aW9uIGhhcHBlbnMgYWZ0ZXIgdGhlIHJheShsaW5lIHNlZ21lbnQpIGVuZHNcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChuZWFyWCA9PT0gbmVhckNvbGxpc2lvblBvaW50KSB7XHJcblx0XHRcdC8vIGl0IG11c3QgaGF2ZSBjb2xsaWRlZCBvbiBlaXRoZXIgdGhlIGxlZnQgb3IgdGhlIHJpZ2h0ISBub3cgd2hpY2g/XHJcblx0XHRcdGlmIChsZWZ0SW50ZXJzZWN0aW9uID09PSBuZWFyWCkge1xyXG5cdFx0XHRcdC8vIEl0IG11c3QgaGF2ZSBjb2xsaWRlZCBvbiB0aGUgbGVmdCEgIFJldHVybiB0aGUgY29sbGlzaW9uIG5vcm1hbCBbLTEsIDBdXHJcblx0XHRcdFx0cmV0dXJuIFstMSwgMCwgbmVhckNvbGxpc2lvblBvaW50XTtcclxuXHRcdFx0fVxyXG5cdFx0XHQvLyBJZiBpdCBkaWRuJ3QgY29sbGlkZSBvbiB0aGUgbGVmdCwgaXQgbXVzdCBoYXZlIGNvbGxpZGVkIG9uIHRoZSByaWdodC4gIFJldHVybiB0aGUgY29sbGlzaW9uIG5vcm1hbCBbMSwgMF1cclxuXHRcdFx0cmV0dXJuIFsxLCAwLCBuZWFyQ29sbGlzaW9uUG9pbnRdO1xyXG5cdFx0fVxyXG5cdFx0Ly8gSWYgaXQgZGlkbid0IGNvbGxpZGUgb24gdGhlIGxlZnQgb3IgcmlnaHQsIGl0IG11c3QgaGF2ZSBjb2xsaWRlZCBvbiBlaXRoZXIgdGhlIHRvcCBvciB0aGUgYm90dG9tISBub3cgd2hpY2g/XHJcblx0XHRpZiAodG9wSW50ZXJzZWN0aW9uID09PSBuZWFyWSkge1xyXG5cdFx0XHQvLyBJdCBtdXN0IGhhdmUgY29sbGlkZWQgb24gdGhlIHRvcCEgIFJldHVybiB0aGUgY29sbGlzaW9uIG5vcm1hbCBbMCwgLTFdXHJcblx0XHRcdHJldHVybiBbMCwgLTEsIG5lYXJDb2xsaXNpb25Qb2ludF07XHJcblx0XHR9XHJcblx0XHQvLyBJZiBpdCBkaWRuJ3QgY29sbGlkZSBvbiB0aGUgdG9wLCBpdCBtdXN0IGhhdmUgY29sbGlkZWQgb24gdGhlIGJvdHRvbS4gIFJldHVybiB0aGUgY29sbGlzaW9uIG5vcm1hbCBbMCwgMV1cclxuXHRcdHJldHVybiBbMCwgMSwgbmVhckNvbGxpc2lvblBvaW50XTtcclxuXHJcblx0XHQvLyBvdXRwdXQgaWYgbm8gY29sbGlzaW9uOiBmYWxzZVxyXG5cdFx0Ly8gb3V0cHV0IGlmIGNvbGxpc2lvbjogW2NvbGxpc2lvbiBub3JtYWwgWCwgY29sbGlzaW9uIG5vcm1hbCBZLCBuZWFyQ29sbGlzaW9uUG9pbnRdXHJcblx0XHQvLyAgICAgICAgICAgICAgICAgICAgICAgICAtMSB0byAxICAgICAgICAgICAgICAtMSB0byAxICAgICAgICAgICAgMCB0byAxXHJcblx0fVxyXG5cclxuXHRyZW5kZXJFbnRpdGllcygpIHtcclxuXHRcdC8vIGRyYXcgcGxheWVyXHJcblx0XHQvLyB0aGlzLmZpbGwoMjU1LCAwLCAwKTtcclxuXHRcdC8vIHRoaXMubm9TdHJva2UoKTtcclxuXHRcdC8vIHRoaXMucmVjdChcclxuXHRcdC8vICAgICAodGhpcy53b3JsZC5wbGF5ZXIuaW50ZXJwb2xhdGVkWCAqIHRoaXMuVElMRV9XSURUSCAtXHJcblx0XHQvLyAgICAgICAgIHRoaXMuaW50ZXJwb2xhdGVkQ2FtWCAqIHRoaXMuVElMRV9XSURUSCkgKlxyXG5cdFx0Ly8gICAgICAgICB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0Ly8gICAgICh0aGlzLndvcmxkLnBsYXllci5pbnRlcnBvbGF0ZWRZICogdGhpcy5USUxFX0hFSUdIVCAtXHJcblx0XHQvLyAgICAgICAgIHRoaXMuaW50ZXJwb2xhdGVkQ2FtWSAqIHRoaXMuVElMRV9IRUlHSFQpICpcclxuXHRcdC8vICAgICAgICAgdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdC8vICAgICB0aGlzLndvcmxkLnBsYXllci53aWR0aCAqIHRoaXMudXBzY2FsZVNpemUgKiB0aGlzLlRJTEVfV0lEVEgsXHJcblx0XHQvLyAgICAgdGhpcy53b3JsZC5wbGF5ZXIuaGVpZ2h0ICogdGhpcy51cHNjYWxlU2l6ZSAqIHRoaXMuVElMRV9IRUlHSFRcclxuXHRcdC8vICk7XHJcblx0XHQvLyBmb3IgKGNvbnN0IGl0ZW0gb2YgdGhpcy5pdGVtcykge1xyXG5cdFx0Ly8gICAgIGl0ZW0uZmluZEludGVycG9sYXRlZENvb3JkaW5hdGVzKCk7XHJcblx0XHQvL1xyXG5cdFx0Ly8gICAgIGl0ZW0uaXRlbVN0YWNrLnRleHR1cmUucmVuZGVyKFxyXG5cdFx0Ly8gICAgICAgICB0aGlzLFxyXG5cdFx0Ly8gICAgICAgICAoaXRlbS5pbnRlcnBvbGF0ZWRYICogdGhpcy5USUxFX1dJRFRIIC1cclxuXHRcdC8vICAgICAgICAgICAgIHRoaXMuaW50ZXJwb2xhdGVkQ2FtWCAqIHRoaXMuVElMRV9XSURUSCkgKlxyXG5cdFx0Ly8gICAgICAgICAgICAgdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdC8vICAgICAgICAgKGl0ZW0uaW50ZXJwb2xhdGVkWSAqIHRoaXMuVElMRV9IRUlHSFQgLVxyXG5cdFx0Ly8gICAgICAgICAgICAgdGhpcy5pbnRlcnBvbGF0ZWRDYW1ZICogdGhpcy5USUxFX0hFSUdIVCkgKlxyXG5cdFx0Ly8gICAgICAgICAgICAgdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdC8vICAgICAgICAgaXRlbS53ICogdGhpcy51cHNjYWxlU2l6ZSAqIHRoaXMuVElMRV9XSURUSCxcclxuXHRcdC8vICAgICAgICAgaXRlbS5oICogdGhpcy51cHNjYWxlU2l6ZSAqIHRoaXMuVElMRV9IRUlHSFRcclxuXHRcdC8vICAgICApO1xyXG5cdFx0Ly9cclxuXHRcdC8vICAgICAvLyBSZW5kZXIgdGhlIGl0ZW0gcXVhbnRpdHkgbGFiZWxcclxuXHRcdC8vICAgICB0aGlzLmZpbGwoMCk7XHJcblx0XHQvL1xyXG5cdFx0Ly8gICAgIHRoaXMubm9TdHJva2UoKTtcclxuXHRcdC8vXHJcblx0XHQvLyAgICAgdGhpcy50ZXh0QWxpZ24odGhpcy5SSUdIVCwgdGhpcy5CT1RUT00pO1xyXG5cdFx0Ly8gICAgIHRoaXMudGV4dFNpemUoNSAqIHRoaXMudXBzY2FsZVNpemUpO1xyXG5cdFx0Ly9cclxuXHRcdC8vICAgICB0aGlzLnRleHQoXHJcblx0XHQvLyAgICAgICAgIGl0ZW0uaXRlbVN0YWNrLnN0YWNrU2l6ZSxcclxuXHRcdC8vICAgICAgICAgKGl0ZW0uaW50ZXJwb2xhdGVkWCAqIHRoaXMuVElMRV9XSURUSCAtXHJcblx0XHQvLyAgICAgICAgICAgICB0aGlzLmludGVycG9sYXRlZENhbVggKiB0aGlzLlRJTEVfV0lEVEgpICpcclxuXHRcdC8vICAgICAgICAgICAgIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHQvLyAgICAgICAgIChpdGVtLmludGVycG9sYXRlZFkgKiB0aGlzLlRJTEVfSEVJR0hUIC1cclxuXHRcdC8vICAgICAgICAgICAgIHRoaXMuaW50ZXJwb2xhdGVkQ2FtWSAqIHRoaXMuVElMRV9IRUlHSFQpICpcclxuXHRcdC8vICAgICAgICAgICAgIHRoaXMudXBzY2FsZVNpemVcclxuXHRcdC8vICAgICApO1xyXG5cdFx0Ly8gfVxyXG5cdH1cclxuXHJcblx0LypcclxuXHRwaWNrVXBJdGVtKGl0ZW1TdGFjazogSXRlbVN0YWNrKTogYm9vbGVhbiB7XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaG90QmFyLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGNvbnN0IGl0ZW0gPSB0aGlzLmhvdEJhcltpXTtcclxuXHJcblx0XHRcdC8vIElmIHRoZXJlIGFyZSBubyBpdGVtcyBpbiB0aGUgY3VycmVudCBzbG90IG9mIHRoZSBob3RCYXJcclxuXHRcdFx0aWYgKGl0ZW0gPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdHRoaXMuaG90QmFyW2ldID0gaXRlbVN0YWNrO1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoXHJcblx0XHRcdFx0aXRlbSA9PT0gaXRlbVN0YWNrICYmXHJcblx0XHRcdFx0aXRlbS5zdGFja1NpemUgPCBpdGVtLm1heFN0YWNrU2l6ZVxyXG5cdFx0XHQpIHtcclxuXHRcdFx0XHRjb25zdCByZW1haW5pbmdTcGFjZSA9IGl0ZW0ubWF4U3RhY2tTaXplIC0gaXRlbS5zdGFja1NpemU7XHJcblxyXG5cdFx0XHRcdC8vIFRvcCBvZmYgdGhlIHN0YWNrIHdpdGggaXRlbXMgaWYgaXQgY2FuIHRha2UgbW9yZSB0aGFuIHRoZSBzdGFjayBiZWluZyBhZGRlZFxyXG5cdFx0XHRcdGlmIChyZW1haW5pbmdTcGFjZSA+PSBpdGVtU3RhY2suc3RhY2tTaXplKSB7XHJcblx0XHRcdFx0XHR0aGlzLmhvdEJhcltpXS5zdGFja1NpemUgPVxyXG5cdFx0XHRcdFx0XHRpdGVtLnN0YWNrU2l6ZSArIGl0ZW1TdGFjay5zdGFja1NpemU7XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGl0ZW1TdGFjay5zdGFja1NpemUgLT0gcmVtYWluaW5nU3BhY2U7XHJcblxyXG5cdFx0XHRcdHRoaXMuaG90QmFyW2ldLnN0YWNrU2l6ZSA9IGl0ZW1TdGFjay5tYXhTdGFja1NpemU7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGNvbnNvbGUuZXJyb3IoXHJcblx0XHRcdGBDb3VsZCBub3QgcGlja3VwICR7aXRlbVN0YWNrLnN0YWNrU2l6ZX0gJHtpdGVtU3RhY2submFtZX1gXHJcblx0XHQpO1xyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH1cclxuXHJcblx0ICovXHJcblxyXG5cdG1vdXNlRXhpdGVkKCkge1xyXG5cdFx0dGhpcy5tb3VzZU9uID0gZmFsc2U7XHJcblx0fVxyXG5cclxuXHRtb3VzZUVudGVyZWQoKSB7XHJcblx0XHR0aGlzLm1vdXNlT24gPSB0cnVlO1xyXG5cdH1cclxuXHJcblx0dXBkYXRlTW91c2UoKSB7XHJcblx0XHRpZiAoXHJcblx0XHRcdE1hdGguZmxvb3IoXHJcblx0XHRcdFx0KHRoaXMuaW50ZXJwb2xhdGVkQ2FtWCAqIHRoaXMuVElMRV9XSURUSCArXHJcblx0XHRcdFx0XHR0aGlzLm1vdXNlWCAvIHRoaXMudXBzY2FsZVNpemUpIC9cclxuXHRcdFx0XHR0aGlzLlRJTEVfV0lEVEgsXHJcblx0XHRcdCkgIT09IHRoaXMud29ybGRNb3VzZVggfHxcclxuXHRcdFx0TWF0aC5mbG9vcihcclxuXHRcdFx0XHQodGhpcy5pbnRlcnBvbGF0ZWRDYW1ZICogdGhpcy5USUxFX0hFSUdIVCArXHJcblx0XHRcdFx0XHR0aGlzLm1vdXNlWSAvIHRoaXMudXBzY2FsZVNpemUpIC9cclxuXHRcdFx0XHR0aGlzLlRJTEVfSEVJR0hULFxyXG5cdFx0XHQpICE9PSB0aGlzLndvcmxkTW91c2VZXHJcblx0XHQpIHtcclxuXHRcdFx0dGhpcy5sYXN0Q3Vyc29yTW92ZSA9IERhdGUubm93KCk7XHJcblx0XHR9XHJcblx0XHQvLyB3b3JsZCBtb3VzZSB4IGFuZCB5IHZhcmlhYmxlcyBob2xkIHRoZSBtb3VzZSBwb3NpdGlvbiBpbiB3b3JsZCB0aWxlcy4gIDAsIDAgaXMgdG9wIGxlZnRcclxuXHRcdHRoaXMud29ybGRNb3VzZVggPSBNYXRoLmZsb29yKFxyXG5cdFx0XHQodGhpcy5pbnRlcnBvbGF0ZWRDYW1YICogdGhpcy5USUxFX1dJRFRIICtcclxuXHRcdFx0XHR0aGlzLm1vdXNlWCAvIHRoaXMudXBzY2FsZVNpemUpIC9cclxuXHRcdFx0dGhpcy5USUxFX1dJRFRILFxyXG5cdFx0KTtcclxuXHRcdHRoaXMud29ybGRNb3VzZVkgPSBNYXRoLmZsb29yKFxyXG5cdFx0XHQodGhpcy5pbnRlcnBvbGF0ZWRDYW1ZICogdGhpcy5USUxFX0hFSUdIVCArXHJcblx0XHRcdFx0dGhpcy5tb3VzZVkgLyB0aGlzLnVwc2NhbGVTaXplKSAvXHJcblx0XHRcdHRoaXMuVElMRV9IRUlHSFQsXHJcblx0XHQpO1xyXG5cdH1cclxuXHJcblx0ZHJhd0N1cnNvcigpIHtcclxuXHRcdGlmICh0aGlzLm1vdXNlT24pIHtcclxuXHRcdFx0Ly8gaWYgKHRoaXMucGlja2VkVXBTbG90ID4gLTEpIHtcclxuXHRcdFx0Ly8gICAgIHRoaXMuaG90YmFyW3RoaXMucGlja2VkVXBTbG90XS50ZXh0dXJlLnJlbmRlcihcclxuXHRcdFx0Ly8gICAgICAgICB0aGlzLFxyXG5cdFx0XHQvLyAgICAgICAgIHRoaXMubW91c2VYLFxyXG5cdFx0XHQvLyAgICAgICAgIHRoaXMubW91c2VZLFxyXG5cdFx0XHQvLyAgICAgICAgIDggKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHQvLyAgICAgICAgIDggKiB0aGlzLnVwc2NhbGVTaXplXHJcblx0XHRcdC8vICAgICApO1xyXG5cclxuXHRcdFx0Ly8gICAgIHRoaXMudGV4dChcclxuXHRcdFx0Ly8gICAgICAgICB0aGlzLmhvdEJhclt0aGlzLnBpY2tlZFVwU2xvdF0uc3RhY2tTaXplLFxyXG5cdFx0XHQvLyAgICAgICAgIHRoaXMubW91c2VYICsgMTAgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHQvLyAgICAgICAgIHRoaXMubW91c2VZICsgMTAgKiB0aGlzLnVwc2NhbGVTaXplXHJcblx0XHRcdC8vICAgICApO1xyXG5cdFx0XHQvLyB9XHJcblxyXG5cdFx0XHRVaUFzc2V0cy5zZWxlY3RlZF90aWxlLnJlbmRlcihcclxuXHRcdFx0XHR0aGlzLFxyXG5cdFx0XHRcdE1hdGgucm91bmQoXHJcblx0XHRcdFx0XHQodGhpcy53b3JsZE1vdXNlWCAtIHRoaXMuaW50ZXJwb2xhdGVkQ2FtWCkgKlxyXG5cdFx0XHRcdFx0dGhpcy5USUxFX1dJRFRIICpcclxuXHRcdFx0XHRcdHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdFx0KSxcclxuXHRcdFx0XHRNYXRoLnJvdW5kKFxyXG5cdFx0XHRcdFx0KHRoaXMud29ybGRNb3VzZVkgLSB0aGlzLmludGVycG9sYXRlZENhbVkpICpcclxuXHRcdFx0XHRcdHRoaXMuVElMRV9IRUlHSFQgKlxyXG5cdFx0XHRcdFx0dGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0XHQpLFxyXG5cdFx0XHRcdHRoaXMuVElMRV9XSURUSCAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdFx0dGhpcy5USUxFX0hFSUdIVCAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdCk7XHJcblx0XHRcdGlmIChEYXRlLm5vdygpIC0gdGhpcy5sYXN0Q3Vyc29yTW92ZSA+IDEwMDApIHtcclxuXHRcdFx0XHRsZXQgc2VsZWN0ZWRUaWxlID0gdGhpcy53b3JsZC53b3JsZFRpbGVzW3RoaXMud29ybGQud2lkdGggKiB0aGlzLndvcmxkTW91c2VZICsgdGhpcy53b3JsZE1vdXNlWF07XHJcblx0XHRcdFx0aWYgKHR5cGVvZiAoc2VsZWN0ZWRUaWxlKSA9PT0gJ3N0cmluZycpIHtcclxuXHRcdFx0XHRcdHRoaXMudGV4dChcIlRpbGUgZW50aXR5OiBcIiArIHNlbGVjdGVkVGlsZSwgdGhpcy5tb3VzZVgsIHRoaXMubW91c2VZKTsvL0pBTktZIEFMRVJUXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2UgaWYgKFdvcmxkVGlsZXNbc2VsZWN0ZWRUaWxlXSAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0XHR0aGlzLnRleHQoKHRoaXMud29ybGQud2lkdGggKiB0aGlzLndvcmxkTW91c2VZICsgdGhpcy53b3JsZE1vdXNlWCkrXCI6IFwiKyhXb3JsZFRpbGVzW3NlbGVjdGVkVGlsZV0gYXMgVGlsZSkubmFtZSwgdGhpcy5tb3VzZVgsIHRoaXMubW91c2VZKTsvL0pBTktZIEFMRVJUXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5jb25zdCBjb25uZWN0aW9uID0gaW8oe1xyXG5cdGF1dGg6IHsgdG9rZW46IHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndG9rZW4nKSB9LFxyXG59KTtcclxuXHJcbmV4cG9ydCBjb25zdCBnYW1lID0gbmV3IEdhbWUoY29ubmVjdGlvbik7XHJcbiIsImltcG9ydCB7IEdhbWUgfSBmcm9tICcuL0dhbWUnO1xyXG5pbXBvcnQgeyBXb3JsZCB9IGZyb20gJy4vd29ybGQvV29ybGQnO1xyXG5pbXBvcnQgeyBFbnRpdHlDbGFzc2VzIH0gZnJvbSAnLi93b3JsZC9lbnRpdGllcy9FbnRpdHlDbGFzc2VzJztcclxuaW1wb3J0IHsgUGxheWVyTG9jYWwgfSBmcm9tICcuL3BsYXllci9QbGF5ZXJMb2NhbCc7XHJcbmltcG9ydCB7IEludmVudG9yeSB9IGZyb20gJy4vcGxheWVyL0ludmVudG9yeSc7XHJcbmltcG9ydCB7IENsaWVudFRpbGVFbnRpdHksIFRpbGVFbnRpdHlBbmltYXRpb25zIH0gZnJvbSAnLi93b3JsZC9lbnRpdGllcy9UaWxlRW50aXR5JztcclxuaW1wb3J0IHsgV29ybGRBc3NldHMgfSBmcm9tICcuL2Fzc2V0cy9Bc3NldHMnO1xyXG5pbXBvcnQgeyBoc2xUb1JnYiwgUGxheWVyRW50aXR5IH0gZnJvbSAnLi93b3JsZC9lbnRpdGllcy9QbGF5ZXJFbnRpdHknO1xyXG5pbXBvcnQgeyBQbGF5ZXJBbmltYXRpb25zIH0gZnJvbSAnLi9hc3NldHMvQXNzZXRzJztcclxuaW1wb3J0IHsgQW5pbWF0aW9uRnJhbWUgfSBmcm9tICcuL2Fzc2V0cy9Bc3NldHMnO1xyXG5pbXBvcnQgeyBSZWZsZWN0YWJsZUltYWdlUmVzb3VyY2UgfSBmcm9tICcuL2Fzc2V0cy9yZXNvdXJjZXMvUmVmbGVjdGVkSW1hZ2VSZXNvdXJjZSc7XHJcblxyXG5leHBvcnQgY2xhc3MgTmV0TWFuYWdlciB7XHJcblx0Z2FtZTogR2FtZTtcclxuXHJcblx0cGxheWVyVGlja1JhdGU6IG51bWJlcjtcclxuXHJcblx0Y29uc3RydWN0b3IoZ2FtZTogR2FtZSkge1xyXG5cdFx0dGhpcy5nYW1lID0gZ2FtZTtcclxuXHJcblx0XHQvLyBJbml0IGV2ZW50XHJcblx0XHR0aGlzLmdhbWUuY29ubmVjdGlvbi5vbignaW5pdCcsIChwbGF5ZXJUaWNrUmF0ZSwgdG9rZW4pID0+IHtcclxuXHRcdFx0Y29uc29sZS5sb2coYFRpY2sgcmF0ZSBzZXQgdG86ICR7cGxheWVyVGlja1JhdGV9YCk7XHJcblx0XHRcdHRoaXMucGxheWVyVGlja1JhdGUgPSBwbGF5ZXJUaWNrUmF0ZTtcclxuXHRcdFx0aWYgKHRva2VuKSB7XHJcblx0XHRcdFx0d2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKCd0b2tlbicsIHRva2VuKTtcclxuXHRcdFx0XHQodGhpcy5nYW1lLmNvbm5lY3Rpb24uYXV0aCBhcyB7IHRva2VuOiBzdHJpbmcgfSkudG9rZW4gPSB0b2tlbjtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0Ly8gSW5pdGlhbGl6YXRpb24gZXZlbnRzXHJcblx0XHR7XHJcblx0XHRcdC8vIExvYWQgdGhlIHdvcmxkIGFuZCBzZXQgdGhlIHBsYXllciBlbnRpdHkgaWRcclxuXHRcdFx0dGhpcy5nYW1lLmNvbm5lY3Rpb24ub24oXHJcblx0XHRcdFx0J3dvcmxkTG9hZCcsXHJcblx0XHRcdFx0KFxyXG5cdFx0XHRcdFx0d2lkdGgsXHJcblx0XHRcdFx0XHRoZWlnaHQsXHJcblx0XHRcdFx0XHR0aWxlcyxcclxuXHRcdFx0XHRcdHRpbGVFbnRpdGllcyxcclxuXHRcdFx0XHRcdGVudGl0aWVzLFxyXG5cdFx0XHRcdFx0cGxheWVyLFxyXG5cdFx0XHRcdFx0aW52ZW50b3J5LFxyXG5cdFx0XHRcdCkgPT4ge1xyXG5cdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhlbnRpdGllcyk7XHJcblx0XHRcdFx0XHRsZXQgaWQgPSBwbGF5ZXIuaWRcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwicGxheWVyIGlkZGRhZHNhc2RmOiBcIiAraWQpXHJcblx0XHRcdFx0XHRpZCA9IHBsYXllci5pZC5zcGxpdChcIi1cIikuam9pbihcIlwiKTsvL3N0cmluZy5wcm90b3R5cGUucmVwbGFjZUFsbCByZXF1aXJlcyBFUzIwMjFcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwicGxheWVyIGlkZGRhZHNhc2RmOiBcIiAraWQpXHJcblx0XHRcdFx0XHRsZXQgaWROdW1iZXIgPSAoTnVtYmVyKFwiMHhcIitpZCkvMTAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwKSUxOy8vZ2V0IGEgbnVtYmVyIDAtMSBwc2V1ZG9yYW5kb21seSBzZWxlY3RlZCBmcm9tIHRoZSB1dWlkIG9mIHRoZSBwbGF5ZXJcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwicGxheWVyIGlkZGRhZHNhc2RmOiBcIiAraWROdW1iZXIpXHJcblx0XHRcdFx0XHRPYmplY3QuZW50cmllcyhQbGF5ZXJBbmltYXRpb25zKS5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG5cdFx0XHRcdFx0XHRmb3IobGV0IGZyYW1lIG9mIGVsZW1lbnRbMV0pIHtcclxuXHRcdFx0XHRcdFx0XHRmcmFtZVswXS5yZWRlZmluZVNjYXJmQ29sb3IoaHNsVG9SZ2IoaWROdW1iZXIsIDEsIDAuNDUpLCBoc2xUb1JnYihpZE51bWJlciwgMSwgMC4zKSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0bGV0IHRpbGVFbnRpdGllczI6IHtcclxuXHRcdFx0XHRcdFx0W2lkOiBzdHJpbmddOiBDbGllbnRUaWxlRW50aXR5XHJcblx0XHRcdFx0XHRcdC8vIFtpZDogc3RyaW5nXToge1xyXG5cdFx0XHRcdFx0XHQvLyBcdGlkOiBzdHJpbmc7XHJcblx0XHRcdFx0XHRcdC8vIFx0Y292ZXJlZFRpbGVzOiBudW1iZXJbXTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRyZWZsZWN0ZWRUaWxlczogbnVtYmVyW107Ly90aGlzIGhvbmVzdGx5IHNob3VsZG4ndCBiZSBzZW50IG92ZXIgc29ja2V0IGJ1dCBpbSB0aXJlZFxyXG5cdFx0XHRcdFx0XHQvLyBcdHR5cGVfOiBudW1iZXI7XHJcblx0XHRcdFx0XHRcdC8vIFx0ZGF0YToge307XHJcblx0XHRcdFx0XHRcdC8vIFx0YW5pbUZyYW1lOiBudW1iZXI7XHJcblx0XHRcdFx0XHRcdC8vIFx0YW5pbWF0ZTogYm9vbGVhbjtcclxuXHRcdFx0XHRcdFx0Ly8gfTtcclxuXHRcdFx0XHRcdH0gPSB7fTtcclxuXHRcdFx0XHRcdHRpbGVFbnRpdGllcy5mb3JFYWNoKHRpbGVFbnRpdHkgPT4ge1xyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZygnYWRkaW5nIHRpbGUgZW50aXR5OiAnICsgdGlsZUVudGl0eS5pZCk7XHJcblx0XHRcdFx0XHRcdHRpbGVFbnRpdGllczJbdGlsZUVudGl0eS5pZF0gPSB7XHJcblx0XHRcdFx0XHRcdFx0Li4udGlsZUVudGl0eSxcclxuXHRcdFx0XHRcdFx0XHRpZDogdGlsZUVudGl0eS5pZCxcclxuXHRcdFx0XHRcdFx0XHRjb3ZlcmVkVGlsZXM6IHRpbGVFbnRpdHkuY292ZXJlZFRpbGVzLFxyXG5cdFx0XHRcdFx0XHRcdHJlZmxlY3RlZFRpbGVzOiB0aWxlRW50aXR5LnJlZmxlY3RlZFRpbGVzLFxyXG5cdFx0XHRcdFx0XHRcdGFuaW1GcmFtZTogcmFuZGludChcclxuXHRcdFx0XHRcdFx0XHRcdDAsXHJcblx0XHRcdFx0XHRcdFx0XHRXb3JsZEFzc2V0cy50aWxlRW50aXRpZXNbXHJcblx0XHRcdFx0XHRcdFx0XHRcdHRpbGVFbnRpdHkucGF5bG9hZC50eXBlX1xyXG5cdFx0XHRcdFx0XHRcdFx0XS5sZW5ndGggLSAxLFxyXG5cdFx0XHRcdFx0XHRcdCksXHJcblx0XHRcdFx0XHRcdFx0YW5pbWF0ZTpcclxuXHRcdFx0XHRcdFx0XHRcdFRpbGVFbnRpdHlBbmltYXRpb25zW3RpbGVFbnRpdHkucGF5bG9hZC50eXBlX10sXHJcblx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdHRoaXMuZ2FtZS53b3JsZCA9IG5ldyBXb3JsZChcclxuXHRcdFx0XHRcdFx0d2lkdGgsXHJcblx0XHRcdFx0XHRcdGhlaWdodCxcclxuXHRcdFx0XHRcdFx0dGlsZXMsXHJcblx0XHRcdFx0XHRcdHRpbGVFbnRpdGllczIsXHJcblx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdFx0dGhpcy5nYW1lLndvcmxkLmludmVudG9yeSA9IG5ldyBJbnZlbnRvcnkoaW52ZW50b3J5KTtcclxuXHRcdFx0XHRcdHRoaXMuZ2FtZS53b3JsZC5wbGF5ZXIgPSBuZXcgUGxheWVyTG9jYWwocGxheWVyKTtcclxuXHRcdFx0XHRcdHRoaXMuZ2FtZS53b3JsZC5wbGF5ZXIuY29sb3IxID0gaHNsVG9SZ2IoaWROdW1iZXIsIDEsIDAuNDUpO1xyXG5cdFx0XHRcdFx0dGhpcy5nYW1lLndvcmxkLnBsYXllci5jb2xvcjEgPSBoc2xUb1JnYihpZE51bWJlciwgMSwgMC4zKTtcclxuXHRcdFx0XHRcdGVudGl0aWVzLmZvckVhY2goZW50aXR5ID0+IHtcclxuXHRcdFx0XHRcdFx0dGhpcy5nYW1lLndvcmxkLmVudGl0aWVzW2VudGl0eS5pZF0gPSBuZXcgRW50aXR5Q2xhc3Nlc1tcclxuXHRcdFx0XHRcdFx0XHRlbnRpdHkudHlwZVxyXG5cdFx0XHRcdFx0XHRdKGVudGl0eSk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFdvcmxkIGV2ZW50c1xyXG5cdFx0e1xyXG5cdFx0XHQvLyBUaWxlIHVwZGF0ZXMgc3VjaCBhcyBicmVha2luZyBhbmQgcGxhY2luZ1xyXG5cdFx0XHR0aGlzLmdhbWUuY29ubmVjdGlvbi5vbihcclxuXHRcdFx0XHQnd29ybGRVcGRhdGUnLFxyXG5cdFx0XHRcdCh1cGRhdGVkVGlsZXM6IHsgdGlsZUluZGV4OiBudW1iZXI7IHRpbGU6IG51bWJlciB9W10pID0+IHtcclxuXHRcdFx0XHRcdC8vIElmIHRoZSB3b3JsZCBpcyBub3Qgc2V0XHJcblx0XHRcdFx0XHRpZiAodGhpcy5nYW1lLndvcmxkID09PSB1bmRlZmluZWQpIHJldHVybjtcclxuXHJcblx0XHRcdFx0XHR1cGRhdGVkVGlsZXMuZm9yRWFjaCh0aWxlID0+IHtcclxuXHRcdFx0XHRcdFx0Y29uc3QgaW5kZXggPSB0aGlzLmdhbWUuYnJva2VuVGlsZXNRdWV1ZS5pbmRleE9mKHRpbGUudGlsZUluZGV4KTtcclxuXHRcdFx0XHRcdFx0aWYgKGluZGV4ID4gLTEpIHtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmdhbWUuYnJva2VuVGlsZXNRdWV1ZS5zcGxpY2UoaW5kZXgsIDEpOyAvLyAybmQgcGFyYW1ldGVyIG1lYW5zIHJlbW92ZSBvbmUgaXRlbSBvbmx5XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0dGhpcy5nYW1lLndvcmxkLnVwZGF0ZVRpbGUodGlsZS50aWxlSW5kZXgsIHRpbGUudGlsZSk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHQpO1xyXG5cclxuXHRcdFx0dGhpcy5nYW1lLmNvbm5lY3Rpb24ub24oJ2ludmVudG9yeVVwZGF0ZScsIHVwZGF0ZXMgPT4ge1xyXG5cdFx0XHRcdC8vIElmIHRoZSB3b3JsZCBpcyBub3Qgc2V0XHJcblx0XHRcdFx0aWYgKHRoaXMuZ2FtZS53b3JsZCA9PT0gdW5kZWZpbmVkKSByZXR1cm47XHJcblxyXG5cdFx0XHRcdHVwZGF0ZXMuZm9yRWFjaCh1cGRhdGUgPT4ge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2codXBkYXRlKTtcclxuXHRcdFx0XHRcdHRoaXMuZ2FtZS53b3JsZC5pbnZlbnRvcnkuaXRlbXNbdXBkYXRlLnNsb3RdID0gdXBkYXRlLml0ZW07XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFBsYXllciBldmVudHNcclxuXHRcdHtcclxuXHRcdFx0dGhpcy5nYW1lLmNvbm5lY3Rpb24ub24oJ2VudGl0eVVwZGF0ZScsIGVudGl0eURhdGEgPT4ge1xyXG5cdFx0XHRcdC8vIElmIHRoZSB3b3JsZCBpcyBub3Qgc2V0XHJcblx0XHRcdFx0aWYgKHRoaXMuZ2FtZS53b3JsZCA9PT0gdW5kZWZpbmVkKSByZXR1cm47XHJcblxyXG5cdFx0XHRcdGNvbnN0IGVudGl0eSA9IHRoaXMuZ2FtZS53b3JsZC5lbnRpdGllc1tlbnRpdHlEYXRhLmlkXTtcclxuXHRcdFx0XHRpZiAoZW50aXR5ID09PSB1bmRlZmluZWQpIHJldHVybjtcclxuXHJcblx0XHRcdFx0ZW50aXR5LnVwZGF0ZURhdGEoZW50aXR5RGF0YSk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0dGhpcy5nYW1lLmNvbm5lY3Rpb24ub24oJ29uUGxheWVyQW5pbWF0aW9uJywgKGFuaW1hdGlvbiwgcGxheWVySWQpID0+IHtcclxuXHRcdFx0XHRpZiAoKCgoKCgodGhpcy5nYW1lLndvcmxkID09IHVuZGVmaW5lZCkpKSkpKSkgcmV0dXJuO1xyXG5cdFx0XHRcdGxldCBlID0gdGhpcy5nYW1lLndvcmxkLmVudGl0aWVzW3BsYXllcklkXTtcclxuXHRcdFx0XHRpZihlIGluc3RhbmNlb2YgUGxheWVyRW50aXR5ICYmIE9iamVjdC5rZXlzKFBsYXllckFuaW1hdGlvbnMpLmluY2x1ZGVzKGUuY3VycmVudEFuaW1hdGlvbikpIHtcclxuXHRcdFx0XHRcdC8vQHRzLWV4cGVjdC1lcnJvclxyXG5cdFx0XHRcdFx0ZS5jdXJyZW50QW5pbWF0aW9uID0gYW5pbWF0aW9uO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHR0aGlzLmdhbWUuY29ubmVjdGlvbi5vbignZW50aXR5Q3JlYXRlJywgZW50aXR5RGF0YSA9PiB7XHJcblx0XHRcdFx0Ly8gSWYgdGhlIHdvcmxkIGlzIG5vdCBzZXRcclxuXHRcdFx0XHRpZiAodGhpcy5nYW1lLndvcmxkID09PSB1bmRlZmluZWQpIHJldHVybjtcclxuXHJcblx0XHRcdFx0dGhpcy5nYW1lLndvcmxkLmVudGl0aWVzW2VudGl0eURhdGEuaWRdID0gbmV3IEVudGl0eUNsYXNzZXNbXHJcblx0XHRcdFx0XHRlbnRpdHlEYXRhLnR5cGVcclxuXHRcdFx0XHRdKGVudGl0eURhdGEpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHRoaXMuZ2FtZS5jb25uZWN0aW9uLm9uKCdlbnRpdHlEZWxldGUnLCBpZCA9PiB7XHJcblx0XHRcdFx0Ly8gSWYgdGhlIHdvcmxkIGlzIG5vdCBzZXRcclxuXHRcdFx0XHRpZiAodGhpcy5nYW1lLndvcmxkID09PSB1bmRlZmluZWQpIHJldHVybjtcclxuXHJcblx0XHRcdFx0ZGVsZXRlIHRoaXMuZ2FtZS53b3JsZC5lbnRpdGllc1tpZF07XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0Ly8gVXBkYXRlIHRoZSBvdGhlciBwbGF5ZXJzIGluIHRoZSB3b3JsZFxyXG5cdFx0XHR0aGlzLmdhbWUuY29ubmVjdGlvbi5vbihcclxuXHRcdFx0XHQnZW50aXR5U25hcHNob3QnLFxyXG5cdFx0XHRcdChzbmFwc2hvdDoge1xyXG5cdFx0XHRcdFx0aWQ6IHN0cmluZztcclxuXHRcdFx0XHRcdHRpbWU6IG51bWJlcjtcclxuXHRcdFx0XHRcdHN0YXRlOiB7IGlkOiBzdHJpbmc7IHg6IHN0cmluZzsgeTogc3RyaW5nIH1bXTtcclxuXHRcdFx0XHR9KSA9PiB7XHJcblx0XHRcdFx0XHQvLyBJZiB0aGUgd29ybGQgaXMgbm90IHNldFxyXG5cdFx0XHRcdFx0aWYgKHRoaXMuZ2FtZS53b3JsZCA9PT0gdW5kZWZpbmVkKSByZXR1cm47XHJcblxyXG5cdFx0XHRcdFx0dGhpcy5nYW1lLndvcmxkLnVwZGF0ZVBsYXllcnMoc25hcHNob3QpO1xyXG5cdFx0XHRcdH0sXHJcblx0XHRcdCk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiByYW5kaW50KHgxOiBudW1iZXIsIHgyOiBudW1iZXIpIHtcclxuXHRyZXR1cm4gTWF0aC5mbG9vcih4MSArIE1hdGgucmFuZG9tKCkgKiAoeDIgKyAxIC0geDEpKTtcclxufVxyXG4iLCJpbXBvcnQgeyBUaWxlUmVzb3VyY2UgfSBmcm9tICcuL3Jlc291cmNlcy9UaWxlUmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBJbWFnZVJlc291cmNlIH0gZnJvbSAnLi9yZXNvdXJjZXMvSW1hZ2VSZXNvdXJjZSc7XHJcbmltcG9ydCB7IEZvbnRSZXNvdXJjZSB9IGZyb20gJy4vcmVzb3VyY2VzL0ZvbnRSZXNvdXJjZSc7XHJcbmltcG9ydCB7IEF1ZGlvUmVzb3VyY2VHcm91cCB9IGZyb20gJy4vcmVzb3VyY2VzL0F1ZGlvUmVzb3VyY2VHcm91cCc7XHJcbmltcG9ydCB7IEF1ZGlvUmVzb3VyY2UgfSBmcm9tICcuL3Jlc291cmNlcy9BdWRpb1Jlc291cmNlJztcclxuaW1wb3J0IHsgSXRlbVR5cGUgfSBmcm9tICcuLi8uLi9nbG9iYWwvSW52ZW50b3J5JztcclxuaW1wb3J0IHsgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlIH0gZnJvbSAnLi9yZXNvdXJjZXMvUmVmbGVjdGVkSW1hZ2VSZXNvdXJjZSc7XHJcbmltcG9ydCBQNSBmcm9tICdwNSc7XHJcbmltcG9ydCB7IFJlc291cmNlIH0gZnJvbSAnLi9yZXNvdXJjZXMvUmVzb3VyY2UnO1xyXG5cclxuaW50ZXJmYWNlIEFzc2V0R3JvdXAge1xyXG5cdFtuYW1lOiBzdHJpbmddOlxyXG5cdFx0fCB7XHJcblx0XHRcdFx0W25hbWU6IHN0cmluZ106XHJcblx0XHRcdFx0XHR8IFJlc291cmNlXHJcblx0XHRcdFx0XHR8IEFzc2V0R3JvdXBcclxuXHRcdFx0XHRcdHwgQXVkaW9SZXNvdXJjZUdyb3VwW11cclxuXHRcdFx0XHRcdHwgQXVkaW9SZXNvdXJjZUdyb3VwXHJcblx0XHRcdFx0XHR8IEF1ZGlvUmVzb3VyY2VcclxuXHRcdFx0XHRcdHwgSW1hZ2VSZXNvdXJjZVtdXHJcblx0XHRcdFx0XHR8IEltYWdlUmVzb3VyY2VbXVtdXHJcbiAgICAgICAgICAgICAgICAgICAgfCBSZWZsZWN0YWJsZUltYWdlUmVzb3VyY2VbXVxyXG4gICAgICAgICAgICAgICAgICAgIHwgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlXHJcblx0XHRcdFx0XHR8IFtSZWZsZWN0YWJsZUltYWdlUmVzb3VyY2UsIG51bWJlcl1bXTtcclxuXHRcdCAgfVxyXG5cdFx0fCBSZXNvdXJjZVxyXG5cdFx0fCBBc3NldEdyb3VwXHJcblx0XHR8IEF1ZGlvUmVzb3VyY2VHcm91cFtdXHJcblx0XHR8IEF1ZGlvUmVzb3VyY2VHcm91cFxyXG5cdFx0fCBBdWRpb1Jlc291cmNlXHJcblx0XHR8IEltYWdlUmVzb3VyY2VbXVxyXG5cdFx0fCBJbWFnZVJlc291cmNlW11bXVxyXG4gICAgICAgIHwgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlW11cclxuICAgICAgICB8IFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZVxyXG5cdFx0fCBbUmVmbGVjdGFibGVJbWFnZVJlc291cmNlLCBudW1iZXJdW107XHJcbn1cclxuXHJcbmNvbnN0IHBsYXllckFuaW1hdGlvbnMgPSA8VCBleHRlbmRzIFJlY29yZDxzdHJpbmcsIFtSZWZsZWN0YWJsZUltYWdlUmVzb3VyY2UsIG51bWJlcl1bXT4+KFxyXG5cdGRhdGE6IFQsXHJcbik6IFQgPT4gZGF0YTtcclxuXHJcbmV4cG9ydCBjb25zdCBQbGF5ZXJBbmltYXRpb25zID0gcGxheWVyQW5pbWF0aW9ucyh7XHJcblx0Ly9pbWFnZSwgbWlsbGlzZWNvbmRzIHRvIGRpc3BsYXkgZm9yXHJcblx0aWRsZTogW1xyXG5cdFx0W25ldyBSZWZsZWN0YWJsZUltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy9wbGF5ZXIvc25vd21hbmlkbGUxLnBuZycpLCAxMzVdLC8vaWdub3JlIHRoZSBhdHJvY2lvdXMgbmFtaW5nIHNjaGVtZSBvZiB0aGVzZSBpbWFnZXNcclxuXHRcdFtuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvcGxheWVyL3Nub3dtYW5pZGxlMi5wbmcnKSwgMTM1XSxcclxuXHRcdFtuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvcGxheWVyL3Nub3dtYW5pZGxlMy5wbmcnKSwgMTM1XSxcclxuXHRcdFtuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvcGxheWVyL3Nub3dtYW5pZGxlNC5wbmcnKSwgMTM1XSxcclxuXHRcdFtuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvcGxheWVyL3Nub3dtYW5pZGxlNS5wbmcnKSwgMTM1XSxcclxuXHRcdFtuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvcGxheWVyL3Nub3dtYW5pZGxlNi5wbmcnKSwgMTM1XSxcclxuXHRcdFtuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvcGxheWVyL3Nub3dtYW5pZGxlNy5wbmcnKSwgMTM1XSxcclxuXHRcdFtuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvcGxheWVyL3Nub3dtYW5pZGxlOC5wbmcnKSwgMTM1XSxcclxuXHRdLFxyXG5cdGlkbGVsZWZ0OiBbXHJcblx0XHRbbmV3IFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3BsYXllci9zbm93bWFuaWRsZWZsaXBwZWQxLnBuZycpLCAxMzVdLFxyXG5cdFx0W25ldyBSZWZsZWN0YWJsZUltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy9wbGF5ZXIvc25vd21hbmlkbGVmbGlwcGVkMi5wbmcnKSwgMTM1XSxcclxuXHRcdFtuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvcGxheWVyL3Nub3dtYW5pZGxlZmxpcHBlZDMucG5nJyksIDEzNV0sXHJcblx0XHRbbmV3IFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3BsYXllci9zbm93bWFuaWRsZWZsaXBwZWQ0LnBuZycpLCAxMzVdLFxyXG5cdFx0W25ldyBSZWZsZWN0YWJsZUltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy9wbGF5ZXIvc25vd21hbmlkbGVmbGlwcGVkNS5wbmcnKSwgMTM1XSxcclxuXHRcdFtuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvcGxheWVyL3Nub3dtYW5pZGxlZmxpcHBlZDYucG5nJyksIDEzNV0sXHJcblx0XHRbbmV3IFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3BsYXllci9zbm93bWFuaWRsZWZsaXBwZWQ3LnBuZycpLCAxMzVdLFxyXG5cdFx0W25ldyBSZWZsZWN0YWJsZUltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy9wbGF5ZXIvc25vd21hbmlkbGVmbGlwcGVkOC5wbmcnKSwgMTM1XSxcclxuXHRdLFxyXG5cdHdhbGs6IFtcclxuXHRcdFtuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvcGxheWVyL3Nub3dtYW5yb2xsMDEucG5nJyksIDc1XSxcclxuXHRcdFtuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvcGxheWVyL3Nub3dtYW5yb2xsMDIucG5nJyksIDc1XSxcclxuXHRcdFtuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvcGxheWVyL3Nub3dtYW5yb2xsMDMucG5nJyksIDc1XSxcclxuXHRcdFtuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvcGxheWVyL3Nub3dtYW5yb2xsMDQucG5nJyksIDc1XSxcclxuXHRcdFtuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvcGxheWVyL3Nub3dtYW5yb2xsMDUucG5nJyksIDc1XSxcclxuXHRcdFtuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvcGxheWVyL3Nub3dtYW5yb2xsMDYucG5nJyksIDc1XSxcclxuXHRcdFtuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvcGxheWVyL3Nub3dtYW5yb2xsMDcucG5nJyksIDc1XSxcclxuXHRcdFtuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvcGxheWVyL3Nub3dtYW5yb2xsMDgucG5nJyksIDc1XSxcclxuXHRdLFxyXG5cdHdhbGtsZWZ0OiBbXHJcblx0XHRbbmV3IFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3BsYXllci9zbm93bWFucm9sbGxlZnQwMS5wbmcnKSwgNzVdLFxyXG5cdFx0W25ldyBSZWZsZWN0YWJsZUltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy9wbGF5ZXIvc25vd21hbnJvbGxsZWZ0MDIucG5nJyksIDc1XSxcclxuXHRcdFtuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvcGxheWVyL3Nub3dtYW5yb2xsbGVmdDAzLnBuZycpLCA3NV0sXHJcblx0XHRbbmV3IFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3BsYXllci9zbm93bWFucm9sbGxlZnQwNC5wbmcnKSwgNzVdLFxyXG5cdFx0W25ldyBSZWZsZWN0YWJsZUltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy9wbGF5ZXIvc25vd21hbnJvbGxsZWZ0MDUucG5nJyksIDc1XSxcclxuXHRcdFtuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvcGxheWVyL3Nub3dtYW5yb2xsbGVmdDA2LnBuZycpLCA3NV0sXHJcblx0XHRbbmV3IFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3BsYXllci9zbm93bWFucm9sbGxlZnQwNy5wbmcnKSwgNzVdLFxyXG5cdFx0W25ldyBSZWZsZWN0YWJsZUltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy9wbGF5ZXIvc25vd21hbnJvbGxsZWZ0MDgucG5nJyksIDc1XSxcclxuXHRdLFxyXG59KTtcclxuXHJcbi8vIEl0ZW0gcmVsYXRlZCBhc3NldHNcclxuZXhwb3J0IGNvbnN0IEl0ZW1Bc3NldHM6IFJlY29yZDxJdGVtVHlwZSwgSW1hZ2VSZXNvdXJjZT4gPSB7XHJcblx0W0l0ZW1UeXBlLlNub3dCbG9ja106IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9ibG9ja19zbm93LnBuZycsXHJcblx0KSxcclxuXHRbSXRlbVR5cGUuSWNlQmxvY2tdOiBuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdCdhc3NldHMvdGV4dHVyZXMvaXRlbXMvYmxvY2tfaWNlLnBuZycsXHJcblx0KSxcclxuXHRbSXRlbVR5cGUuRGlydEJsb2NrXTogbmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHQnYXNzZXRzL3RleHR1cmVzL2l0ZW1zL2Jsb2NrX2RpcnQucG5nJyxcclxuXHQpLFxyXG5cdFtJdGVtVHlwZS5TdG9uZTBCbG9ja106IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9ibG9ja19zdG9uZTAucG5nJyxcclxuXHQpLFxyXG5cdFtJdGVtVHlwZS5TdG9uZTFCbG9ja106IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9ibG9ja19zdG9uZTEucG5nJyxcclxuXHQpLFxyXG5cdFtJdGVtVHlwZS5TdG9uZTJCbG9ja106IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9ibG9ja19zdG9uZTIucG5nJyxcclxuXHQpLFxyXG5cdFtJdGVtVHlwZS5TdG9uZTNCbG9ja106IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9ibG9ja19zdG9uZTMucG5nJyxcclxuXHQpLFxyXG5cdFtJdGVtVHlwZS5TdG9uZTRCbG9ja106IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9ibG9ja19zdG9uZTQucG5nJyxcclxuXHQpLFxyXG5cdFtJdGVtVHlwZS5TdG9uZTVCbG9ja106IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9ibG9ja19zdG9uZTUucG5nJyxcclxuXHQpLFxyXG5cdFtJdGVtVHlwZS5TdG9uZTZCbG9ja106IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9ibG9ja19zdG9uZTYucG5nJyxcclxuXHQpLFxyXG5cdFtJdGVtVHlwZS5TdG9uZTdCbG9ja106IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9ibG9ja19zdG9uZTcucG5nJyxcclxuXHQpLFxyXG5cdFtJdGVtVHlwZS5TdG9uZThCbG9ja106IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9ibG9ja19zdG9uZTgucG5nJyxcclxuXHQpLFxyXG5cdFtJdGVtVHlwZS5TdG9uZTlCbG9ja106IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9ibG9ja19zdG9uZTkucG5nJyxcclxuXHQpLFxyXG5cdFtJdGVtVHlwZS5UaW5CbG9ja106IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9ibG9ja190aW4ucG5nJyxcclxuXHQpLFxyXG5cdFtJdGVtVHlwZS5BbHVtaW51bUJsb2NrXTogbmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHQnYXNzZXRzL3RleHR1cmVzL2l0ZW1zL2Jsb2NrX2FsdW1pbnVtLnBuZycsXHJcblx0KSxcclxuXHRbSXRlbVR5cGUuR29sZEJsb2NrXTogbmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHQnYXNzZXRzL3RleHR1cmVzL2l0ZW1zL2Jsb2NrX2dvbGQucG5nJyxcclxuXHQpLFxyXG5cdFtJdGVtVHlwZS5UaXRhbml1bUJsb2NrXTogbmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHQnYXNzZXRzL3RleHR1cmVzL2l0ZW1zL2Jsb2NrX3RpdGFuaXVtLnBuZycsXHJcblx0KSxcclxuXHRbSXRlbVR5cGUuR3JhcGVCbG9ja106IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9ibG9ja19ncmFwZS5wbmcnLFxyXG5cdCksXHJcblx0W0l0ZW1UeXBlLldvb2QwQmxvY2tdOiBuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdCdhc3NldHMvdGV4dHVyZXMvaXRlbXMvYmxvY2tfd29vZDAucG5nJyxcclxuXHQpLFxyXG5cdFtJdGVtVHlwZS5Xb29kMUJsb2NrXTogbmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHQnYXNzZXRzL3RleHR1cmVzL2l0ZW1zL2Jsb2NrX3dvb2QxLnBuZycsXHJcblx0KSxcclxuXHRbSXRlbVR5cGUuV29vZDJCbG9ja106IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9ibG9ja193b29kMi5wbmcnLFxyXG5cdCksXHJcblx0W0l0ZW1UeXBlLldvb2QzQmxvY2tdOiBuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdCdhc3NldHMvdGV4dHVyZXMvaXRlbXMvYmxvY2tfd29vZDMucG5nJyxcclxuXHQpLFxyXG5cdFtJdGVtVHlwZS5Xb29kNEJsb2NrXTogbmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHQnYXNzZXRzL3RleHR1cmVzL2l0ZW1zL2Jsb2NrX3dvb2Q0LnBuZycsXHJcblx0KSxcclxuXHRbSXRlbVR5cGUuV29vZDVCbG9ja106IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9ibG9ja193b29kNS5wbmcnLFxyXG5cdCksXHJcblx0W0l0ZW1UeXBlLldvb2Q2QmxvY2tdOiBuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdCdhc3NldHMvdGV4dHVyZXMvaXRlbXMvYmxvY2tfd29vZDYucG5nJyxcclxuXHQpLFxyXG5cdFtJdGVtVHlwZS5Xb29kN0Jsb2NrXTogbmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHQnYXNzZXRzL3RleHR1cmVzL2l0ZW1zL2Jsb2NrX3dvb2Q3LnBuZycsXHJcblx0KSxcclxuXHRbSXRlbVR5cGUuV29vZDhCbG9ja106IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9ibG9ja193b29kOC5wbmcnLFxyXG5cdCksXHJcblx0W0l0ZW1UeXBlLldvb2Q5QmxvY2tdOiBuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdCdhc3NldHMvdGV4dHVyZXMvaXRlbXMvYmxvY2tfd29vZDkucG5nJyxcclxuXHQpLFxyXG5cdFtJdGVtVHlwZS5TZWVkXTogbmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHQnYXNzZXRzL3RleHR1cmVzL2l0ZW1zL3NlZWQucG5nJyxcclxuXHQpLFxyXG59O1xyXG5cclxuLy8gVWkgcmVsYXRlZCBhc3NldHNcclxuZXhwb3J0IGNvbnN0IFVpQXNzZXRzID0ge1xyXG5cdHVpX3Nsb3Rfc2VsZWN0ZWQ6IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy91aS91aXNsb3Rfc2VsZWN0ZWQucG5nJyxcclxuXHQpLFxyXG5cdHVpX3Nsb3Q6IG5ldyBJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvdWkvdWlzbG90LnBuZycpLFxyXG5cdHVpX2ZyYW1lOiBuZXcgSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3VpL3VpZnJhbWUucG5nJyksXHJcblx0YnV0dG9uX3Vuc2VsZWN0ZWQ6IG5ldyBJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvdWkvYnV0dG9uMC5wbmcnKSxcclxuXHRidXR0b25fc2VsZWN0ZWQ6IG5ldyBJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvdWkvYnV0dG9uMS5wbmcnKSxcclxuXHRzbGlkZXJfYmFyOiBuZXcgSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3VpL3NsaWRlckJhci5wbmcnKSxcclxuXHRzbGlkZXJfaGFuZGxlOiBuZXcgSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3VpL3NsaWRlckhhbmRsZS5wbmcnKSxcclxuXHR0aXRsZV9pbWFnZTogbmV3IEltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy91aS9zbm93ZWRpbkJVTVAucG5nJyksXHJcblx0dmlnbmV0dGU6IG5ldyBJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvdWkvdmlnbmV0dGUtZXhwb3J0LnBuZycpLFxyXG5cdHNlbGVjdGVkX3RpbGU6IG5ldyBJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvdWkvc2VsZWN0ZWR0aWxlLnBuZycpLFxyXG59O1xyXG5cclxuLy8gV29ybGQgcmVsYXRlZCBhc3NldHNcclxuZXhwb3J0IGNvbnN0IFdvcmxkQXNzZXRzID0ge1xyXG5cdHNoYWRlclJlc291cmNlczoge1xyXG5cdFx0c2t5SW1hZ2U6IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3NoYWRlcl9yZXNvdXJjZXMvcG9pc3NvbnNub3cucG5nJyxcclxuXHRcdCksXHJcblx0fSxcclxuXHRtaWRkbGVncm91bmQ6IHtcclxuXHRcdHRpbGVzZXRfaWNlOiBuZXcgVGlsZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL21pZGRsZWdyb3VuZC90aWxlc2V0X2ljZS5wbmcnLFxyXG5cdFx0XHQxNixcclxuXHRcdFx0MSxcclxuXHRcdFx0OCxcclxuXHRcdFx0OCxcclxuXHRcdCksXHJcblx0XHR0aWxlc2V0X3Nub3c6IG5ldyBUaWxlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvbWlkZGxlZ3JvdW5kL3RpbGVzZXRfc25vdy5wbmcnLFxyXG5cdFx0XHQxNixcclxuXHRcdFx0MSxcclxuXHRcdFx0OCxcclxuXHRcdFx0OCxcclxuXHRcdCksXHJcblx0XHR0aWxlc2V0X2RpcnQ6IG5ldyBUaWxlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvbWlkZGxlZ3JvdW5kL3RpbGVzZXRfZGlydDAucG5nJyxcclxuXHRcdFx0MTYsXHJcblx0XHRcdDEsXHJcblx0XHRcdDgsXHJcblx0XHRcdDgsXHJcblx0XHQpLFxyXG5cdFx0dGlsZXNldF9zdG9uZTA6IG5ldyBUaWxlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvbWlkZGxlZ3JvdW5kL3RpbGVzZXRfc3RvbmUwLnBuZycsXHJcblx0XHRcdDE2LFxyXG5cdFx0XHQxLFxyXG5cdFx0XHQ4LFxyXG5cdFx0XHQ4LFxyXG5cdFx0KSxcclxuXHRcdHRpbGVzZXRfc3RvbmUxOiBuZXcgVGlsZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL21pZGRsZWdyb3VuZC90aWxlc2V0X3N0b25lMS5wbmcnLFxyXG5cdFx0XHQxNixcclxuXHRcdFx0MSxcclxuXHRcdFx0OCxcclxuXHRcdFx0OCxcclxuXHRcdCksXHJcblx0XHR0aWxlc2V0X3N0b25lMjogbmV3IFRpbGVSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9taWRkbGVncm91bmQvdGlsZXNldF9zdG9uZTIucG5nJyxcclxuXHRcdFx0MTYsXHJcblx0XHRcdDEsXHJcblx0XHRcdDgsXHJcblx0XHRcdDgsXHJcblx0XHQpLFxyXG5cdFx0dGlsZXNldF9zdG9uZTM6IG5ldyBUaWxlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvbWlkZGxlZ3JvdW5kL3RpbGVzZXRfc3RvbmUzLnBuZycsXHJcblx0XHRcdDE2LFxyXG5cdFx0XHQxLFxyXG5cdFx0XHQ4LFxyXG5cdFx0XHQ4LFxyXG5cdFx0KSxcclxuXHRcdHRpbGVzZXRfc3RvbmU0OiBuZXcgVGlsZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL21pZGRsZWdyb3VuZC90aWxlc2V0X3N0b25lNC5wbmcnLFxyXG5cdFx0XHQxNixcclxuXHRcdFx0MSxcclxuXHRcdFx0OCxcclxuXHRcdFx0OCxcclxuXHRcdCksXHJcblx0XHR0aWxlc2V0X3N0b25lNTogbmV3IFRpbGVSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9taWRkbGVncm91bmQvdGlsZXNldF9zdG9uZTUucG5nJyxcclxuXHRcdFx0MTYsXHJcblx0XHRcdDEsXHJcblx0XHRcdDgsXHJcblx0XHRcdDgsXHJcblx0XHQpLFxyXG5cdFx0dGlsZXNldF9zdG9uZTY6IG5ldyBUaWxlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvbWlkZGxlZ3JvdW5kL3RpbGVzZXRfc3RvbmU2LnBuZycsXHJcblx0XHRcdDE2LFxyXG5cdFx0XHQxLFxyXG5cdFx0XHQ4LFxyXG5cdFx0XHQ4LFxyXG5cdFx0KSxcclxuXHRcdHRpbGVzZXRfc3RvbmU3OiBuZXcgVGlsZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL21pZGRsZWdyb3VuZC90aWxlc2V0X3N0b25lNy5wbmcnLFxyXG5cdFx0XHQxNixcclxuXHRcdFx0MSxcclxuXHRcdFx0OCxcclxuXHRcdFx0OCxcclxuXHRcdCksXHJcblx0XHR0aWxlc2V0X3N0b25lODogbmV3IFRpbGVSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9taWRkbGVncm91bmQvdGlsZXNldF9zdG9uZTgucG5nJyxcclxuXHRcdFx0MTYsXHJcblx0XHRcdDEsXHJcblx0XHRcdDgsXHJcblx0XHRcdDgsXHJcblx0XHQpLFxyXG5cdFx0dGlsZXNldF9zdG9uZTk6IG5ldyBUaWxlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvbWlkZGxlZ3JvdW5kL3RpbGVzZXRfc3RvbmU5LnBuZycsXHJcblx0XHRcdDE2LFxyXG5cdFx0XHQxLFxyXG5cdFx0XHQ4LFxyXG5cdFx0XHQ4LFxyXG5cdFx0KSxcclxuXHRcdHRpbGVzZXRfdGluOiBuZXcgVGlsZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL21pZGRsZWdyb3VuZC90aWxlc2V0X3Rpbi5wbmcnLFxyXG5cdFx0XHQxNixcclxuXHRcdFx0MSxcclxuXHRcdFx0OCxcclxuXHRcdFx0OCxcclxuXHRcdCksXHJcblx0XHR0aWxlc2V0X2FsdW1pbnVtOiBuZXcgVGlsZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL21pZGRsZWdyb3VuZC90aWxlc2V0X2FsdW1pbnVtLnBuZycsXHJcblx0XHRcdDE2LFxyXG5cdFx0XHQxLFxyXG5cdFx0XHQ4LFxyXG5cdFx0XHQ4LFxyXG5cdFx0KSxcclxuXHRcdHRpbGVzZXRfZ29sZDogbmV3IFRpbGVSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9taWRkbGVncm91bmQvdGlsZXNldF9nb2xkLnBuZycsXHJcblx0XHRcdDE2LFxyXG5cdFx0XHQxLFxyXG5cdFx0XHQ4LFxyXG5cdFx0XHQ4LFxyXG5cdFx0KSxcclxuXHRcdHRpbGVzZXRfdGl0YW5pdW06IG5ldyBUaWxlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvbWlkZGxlZ3JvdW5kL3RpbGVzZXRfdGl0YW5pdW0ucG5nJyxcclxuXHRcdFx0MTYsXHJcblx0XHRcdDEsXHJcblx0XHRcdDgsXHJcblx0XHRcdDgsXHJcblx0XHQpLFxyXG5cdFx0dGlsZXNldF9ncmFwZTogbmV3IFRpbGVSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9taWRkbGVncm91bmQvdGlsZXNldF9ncmFwZS5wbmcnLFxyXG5cdFx0XHQxNixcclxuXHRcdFx0MSxcclxuXHRcdFx0OCxcclxuXHRcdFx0OCxcclxuXHRcdCksXHJcblx0XHR0aWxlc2V0X3dvb2QwOiBuZXcgVGlsZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL21pZGRsZWdyb3VuZC90aWxlc2V0X3dvb2QwLnBuZycsXHJcblx0XHRcdDE2LFxyXG5cdFx0XHQxLFxyXG5cdFx0XHQ4LFxyXG5cdFx0XHQ4LFxyXG5cdFx0KSxcclxuXHRcdHRpbGVzZXRfd29vZDE6IG5ldyBUaWxlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvbWlkZGxlZ3JvdW5kL3RpbGVzZXRfd29vZDEucG5nJyxcclxuXHRcdFx0MTYsXHJcblx0XHRcdDEsXHJcblx0XHRcdDgsXHJcblx0XHRcdDgsXHJcblx0XHQpLFxyXG5cdFx0dGlsZXNldF93b29kMjogbmV3IFRpbGVSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9taWRkbGVncm91bmQvdGlsZXNldF93b29kMi5wbmcnLFxyXG5cdFx0XHQxNixcclxuXHRcdFx0MSxcclxuXHRcdFx0OCxcclxuXHRcdFx0OCxcclxuXHRcdCksXHJcblx0XHR0aWxlc2V0X3dvb2QzOiBuZXcgVGlsZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL21pZGRsZWdyb3VuZC90aWxlc2V0X3dvb2QzLnBuZycsXHJcblx0XHRcdDE2LFxyXG5cdFx0XHQxLFxyXG5cdFx0XHQ4LFxyXG5cdFx0XHQ4LFxyXG5cdFx0KSxcclxuXHRcdHRpbGVzZXRfd29vZDQ6IG5ldyBUaWxlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvbWlkZGxlZ3JvdW5kL3RpbGVzZXRfd29vZDQucG5nJyxcclxuXHRcdFx0MTYsXHJcblx0XHRcdDEsXHJcblx0XHRcdDgsXHJcblx0XHRcdDgsXHJcblx0XHQpLFxyXG5cdFx0dGlsZXNldF93b29kNTogbmV3IFRpbGVSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9taWRkbGVncm91bmQvdGlsZXNldF93b29kNS5wbmcnLFxyXG5cdFx0XHQxNixcclxuXHRcdFx0MSxcclxuXHRcdFx0OCxcclxuXHRcdFx0OCxcclxuXHRcdCksXHJcblx0XHR0aWxlc2V0X3dvb2Q2OiBuZXcgVGlsZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL21pZGRsZWdyb3VuZC90aWxlc2V0X3dvb2Q2LnBuZycsXHJcblx0XHRcdDE2LFxyXG5cdFx0XHQxLFxyXG5cdFx0XHQ4LFxyXG5cdFx0XHQ4LFxyXG5cdFx0KSxcclxuXHRcdHRpbGVzZXRfd29vZDc6IG5ldyBUaWxlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvbWlkZGxlZ3JvdW5kL3RpbGVzZXRfd29vZDcucG5nJyxcclxuXHRcdFx0MTYsXHJcblx0XHRcdDEsXHJcblx0XHRcdDgsXHJcblx0XHRcdDgsXHJcblx0XHQpLFxyXG5cdFx0dGlsZXNldF93b29kODogbmV3IFRpbGVSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9taWRkbGVncm91bmQvdGlsZXNldF93b29kOC5wbmcnLFxyXG5cdFx0XHQxNixcclxuXHRcdFx0MSxcclxuXHRcdFx0OCxcclxuXHRcdFx0OCxcclxuXHRcdCksXHJcblx0XHR0aWxlc2V0X3dvb2Q5OiBuZXcgVGlsZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL21pZGRsZWdyb3VuZC90aWxlc2V0X3dvb2Q5LnBuZycsXHJcblx0XHRcdDE2LFxyXG5cdFx0XHQxLFxyXG5cdFx0XHQ4LFxyXG5cdFx0XHQ4LFxyXG5cdFx0KSxcclxuXHR9LFxyXG5cdGZvcmVncm91bmQ6IHtcclxuXHRcdFxyXG5cdH0sXHJcblx0dGlsZUVudGl0aWVzOiBbXHJcblx0XHRbLy90cmVlXHJcblx0XHRuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL3RpbGVFbnRpdGllcy90cmVlcy9UcmVlMS5wbmcnLFxyXG5cdFx0KSxcclxuXHRcdG5ldyBSZWZsZWN0YWJsZUltYWdlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvdGlsZUVudGl0aWVzL3RyZWVzL1RyZWUyLnBuZycsXHJcblx0XHQpLFxyXG5cdFx0bmV3IFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC90aWxlRW50aXRpZXMvdHJlZXMvVHJlZTMucG5nJyxcclxuXHRcdCksXHJcblx0XHRuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL3RpbGVFbnRpdGllcy90cmVlcy9UcmVlNC5wbmcnLFxyXG5cdFx0KSxcclxuXHRcdG5ldyBSZWZsZWN0YWJsZUltYWdlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvdGlsZUVudGl0aWVzL3RyZWVzL1RyZWU1LnBuZycsXHJcblx0XHQpLFxyXG5cdFx0bmV3IFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC90aWxlRW50aXRpZXMvdHJlZXMvVHJlZTYucG5nJyxcclxuXHRcdCksXHJcblx0XHRuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL3RpbGVFbnRpdGllcy90cmVlcy9UcmVlNy5wbmcnLFxyXG5cdFx0KSxcclxuXHRcdG5ldyBSZWZsZWN0YWJsZUltYWdlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvdGlsZUVudGl0aWVzL3RyZWVzL1RyZWU4LnBuZycsXHJcblx0XHQpLFxyXG5cdFx0bmV3IFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC90aWxlRW50aXRpZXMvdHJlZXMvVHJlZTkucG5nJyxcclxuXHRcdCksXHJcblx0XHRuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL3RpbGVFbnRpdGllcy90cmVlcy9UcmVlMTAucG5nJyxcclxuXHRcdCksXHJcblx0XHRdLFxyXG5cdFx0Wy8vZHJpbGwgdGllciAxXHJcblx0XHRuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL3RpbGVFbnRpdGllcy9SdXN0eSBEcmlsbC9SdXN0eURyaWxsMS5wbmcnLFxyXG5cdFx0KSxcclxuXHRcdG5ldyBSZWZsZWN0YWJsZUltYWdlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvdGlsZUVudGl0aWVzL1J1c3R5IERyaWxsL1J1c3R5RHJpbGwyLnBuZycsXHJcblx0XHQpLFxyXG5cdFx0bmV3IFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC90aWxlRW50aXRpZXMvUnVzdHkgRHJpbGwvUnVzdHlEcmlsbDMucG5nJyxcclxuXHRcdCksXHJcblx0XHRuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL3RpbGVFbnRpdGllcy9SdXN0eSBEcmlsbC9SdXN0eURyaWxsNC5wbmcnLFxyXG5cdFx0KSxcclxuXHRcdG5ldyBSZWZsZWN0YWJsZUltYWdlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvdGlsZUVudGl0aWVzL1J1c3R5IERyaWxsL1J1c3R5RHJpbGw1LnBuZycsXHJcblx0XHQpLFxyXG5cdFx0bmV3IFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC90aWxlRW50aXRpZXMvUnVzdHkgRHJpbGwvUnVzdHlEcmlsbDYucG5nJyxcclxuXHRcdCksXHJcblx0XHRuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL3RpbGVFbnRpdGllcy9SdXN0eSBEcmlsbC9SdXN0eURyaWxsNy5wbmcnLFxyXG5cdFx0KSxcclxuXHRcdG5ldyBSZWZsZWN0YWJsZUltYWdlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvdGlsZUVudGl0aWVzL1J1c3R5IERyaWxsL1J1c3R5RHJpbGw4LnBuZycsXHJcblx0XHQpLFxyXG5cdFx0bmV3IFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC90aWxlRW50aXRpZXMvUnVzdHkgRHJpbGwvUnVzdHlEcmlsbDkucG5nJyxcclxuXHRcdCksXHJcblx0XHRuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL3RpbGVFbnRpdGllcy9SdXN0eSBEcmlsbC9SdXN0eURyaWxsMTAucG5nJyxcclxuXHRcdCksXHJcblx0XHRuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL3RpbGVFbnRpdGllcy9SdXN0eSBEcmlsbC9SdXN0eURyaWxsMTEucG5nJyxcclxuXHRcdCksXHJcblx0XHRuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL3RpbGVFbnRpdGllcy9SdXN0eSBEcmlsbC9SdXN0eURyaWxsMTIucG5nJyxcclxuXHRcdCksXHJcblx0XHRuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL3RpbGVFbnRpdGllcy9SdXN0eSBEcmlsbC9SdXN0eURyaWxsMTMucG5nJyxcclxuXHRcdCksXHJcblx0XHRdLFxyXG5cdFx0Wy8vZHJpbGwgdGllciAyXHJcblx0XHJcblx0XHRdLFxyXG5cdFx0Wy8vZHJpbGwgdGllciAzXHJcblx0XHJcblx0XHRdLFxyXG5cdFx0Wy8vZHJpbGwgdGllciA0XHJcblx0XHJcblx0XHRdLFxyXG5cdFx0Wy8vZHJpbGwgdGllciA1XHJcblx0XHJcblx0XHRdLFxyXG5cdFx0Wy8vY3JhZnRpbmcgYmVuY2hcclxuXHRcdG5ldyBSZWZsZWN0YWJsZUltYWdlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvdGlsZUVudGl0aWVzL21pc2MvY3JhZnRpbmdCZW5jaC5wbmcnLFxyXG5cdFx0KSxcclxuXHRcdF0sXHJcblx0XHRbLy9zYXBsaW5nL3NlZWRcclxuXHRcdG5ldyBSZWZsZWN0YWJsZUltYWdlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvdGlsZUVudGl0aWVzL3RyZWVzL3NhcGxpbmcucG5nJyxcclxuXHRcdCksXHJcblx0XHRdXHJcblx0XSxcclxuXHRlbnRpdGllczogW1xyXG5cdFx0W1xyXG5cdFx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUwMS5wbmcnLFxyXG5cdFx0XHQpLFxyXG5cdFx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUwMi5wbmcnLFxyXG5cdFx0XHQpLFxyXG5cdFx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUwMy5wbmcnLFxyXG5cdFx0XHQpLFxyXG5cdFx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUwNC5wbmcnLFxyXG5cdFx0XHQpLFxyXG5cdFx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUwNS5wbmcnLFxyXG5cdFx0XHQpLFxyXG5cdFx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUwNi5wbmcnLFxyXG5cdFx0XHQpLFxyXG5cdFx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUwNy5wbmcnLFxyXG5cdFx0XHQpLFxyXG5cdFx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUwOC5wbmcnLFxyXG5cdFx0XHQpLFxyXG5cdFx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUwOS5wbmcnLFxyXG5cdFx0XHQpLFxyXG5cdFx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUxMC5wbmcnLFxyXG5cdFx0XHQpLFxyXG5cdFx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUxMS5wbmcnLFxyXG5cdFx0XHQpLFxyXG5cdFx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUxMi5wbmcnLFxyXG5cdFx0XHQpLFxyXG5cdFx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUxMy5wbmcnLFxyXG5cdFx0XHQpLFxyXG5cdFx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUxNC5wbmcnLFxyXG5cdFx0XHQpLFxyXG5cdFx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUxNS5wbmcnLFxyXG5cdFx0XHQpLFxyXG5cdFx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUxNi5wbmcnLFxyXG5cdFx0XHQpLFxyXG5cdFx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUxNy5wbmcnLFxyXG5cdFx0XHQpLFxyXG5cdFx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUxOC5wbmcnLFxyXG5cdFx0XHQpLFxyXG5cdFx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUxOS5wbmcnLFxyXG5cdFx0XHQpLFxyXG5cdFx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUyMC5wbmcnLFxyXG5cdFx0XHQpLFxyXG5cdFx0XSxcclxuXHRdLFxyXG5cclxuXHRjbG91ZHM6IFtcclxuXHRcdG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL0Nsb3Vkcy9jbG91ZDEucG5nJyxcclxuXHRcdCksXHJcblx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9lbnRpdGllcy9DbG91ZHMvY2xvdWQyLnBuZycsXHJcblx0XHQpLFxyXG5cdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvZW50aXRpZXMvQ2xvdWRzL2Nsb3VkMy5wbmcnLFxyXG5cdFx0KSxcclxuXHRcdG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL0Nsb3Vkcy9jbG91ZDQucG5nJyxcclxuXHRcdCksXHJcblx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9lbnRpdGllcy9DbG91ZHMvY2xvdWQ1LnBuZycsXHJcblx0XHQpLFxyXG5cdF19XHJcblxyXG5cdFxyXG5cclxuZXhwb3J0IGNvbnN0IEZvbnRzID0ge1xyXG5cdHRpdGxlOiBuZXcgRm9udFJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy91aS9mb250LnBuZycsXHJcblx0XHR7XHJcblx0XHRcdCcwJzogNyxcclxuXHRcdFx0JzEnOiA3LFxyXG5cdFx0XHQnMic6IDcsXHJcblx0XHRcdCczJzogNixcclxuXHRcdFx0JzQnOiA2LFxyXG5cdFx0XHQnNSc6IDYsXHJcblx0XHRcdCc2JzogNixcclxuXHRcdFx0JzcnOiA3LFxyXG5cdFx0XHQnOCc6IDcsXHJcblx0XHRcdCc5JzogNixcclxuXHRcdFx0J0EnOiA2LFxyXG5cdFx0XHQnQic6IDcsXHJcblx0XHRcdCdDJzogNyxcclxuXHRcdFx0J0QnOiA2LFxyXG5cdFx0XHQnRSc6IDcsXHJcblx0XHRcdCdGJzogNixcclxuXHRcdFx0J0cnOiA3LFxyXG5cdFx0XHQnSCc6IDcsXHJcblx0XHRcdCdJJzogNyxcclxuXHRcdFx0J0onOiA4LFxyXG5cdFx0XHQnSyc6IDYsXHJcblx0XHRcdCdMJzogNixcclxuXHRcdFx0J00nOiA4LFxyXG5cdFx0XHQnTic6IDgsXHJcblx0XHRcdCdPJzogOCxcclxuXHRcdFx0J1AnOiA5LFxyXG5cdFx0XHQnUSc6IDgsXHJcblx0XHRcdCdSJzogNyxcclxuXHRcdFx0J1MnOiA3LFxyXG5cdFx0XHQnVCc6IDgsXHJcblx0XHRcdCdVJzogOCxcclxuXHRcdFx0J1YnOiA4LFxyXG5cdFx0XHQnVyc6IDEwLFxyXG5cdFx0XHQnWCc6IDgsXHJcblx0XHRcdCdZJzogOCxcclxuXHRcdFx0J1onOiA5LFxyXG5cdFx0XHQnYSc6IDcsXHJcblx0XHRcdCdiJzogNyxcclxuXHRcdFx0J2MnOiA2LFxyXG5cdFx0XHQnZCc6IDcsXHJcblx0XHRcdCdlJzogNixcclxuXHRcdFx0J2YnOiA2LFxyXG5cdFx0XHQnZyc6IDYsXHJcblx0XHRcdCdoJzogNixcclxuXHRcdFx0J2knOiA1LFxyXG5cdFx0XHQnaic6IDYsXHJcblx0XHRcdCdrJzogNSxcclxuXHRcdFx0J2wnOiA1LFxyXG5cdFx0XHQnbSc6IDgsXHJcblx0XHRcdCduJzogNSxcclxuXHRcdFx0J28nOiA1LFxyXG5cdFx0XHQncCc6IDUsXHJcblx0XHRcdCdxJzogNyxcclxuXHRcdFx0J3InOiA1LFxyXG5cdFx0XHQncyc6IDQsXHJcblx0XHRcdCd0JzogNSxcclxuXHRcdFx0J3UnOiA1LFxyXG5cdFx0XHQndic6IDUsXHJcblx0XHRcdCd3JzogNyxcclxuXHRcdFx0J3gnOiA2LFxyXG5cdFx0XHQneSc6IDUsXHJcblx0XHRcdCd6JzogNSxcclxuXHRcdFx0JyEnOiA0LFxyXG5cdFx0XHQnLic6IDIsXHJcblx0XHRcdCcsJzogMixcclxuXHRcdFx0Jz8nOiA2LFxyXG5cdFx0XHQnXyc6IDYsXHJcblx0XHRcdCctJzogNCxcclxuXHRcdFx0JzonOiAyLFxyXG5cdFx0XHQn4oaRJzogNyxcclxuXHRcdFx0J+KGkyc6IDcsXHJcblx0XHRcdCcgJzogMixcclxuXHRcdH0sXHJcblx0XHQnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkhLiw/Xy064oaR4oaTICcsXHJcblx0XHQxMixcclxuXHQpLFxyXG5cclxuXHRiaWc6IG5ldyBGb250UmVzb3VyY2UoXHJcblx0XHQnYXNzZXRzL3RleHR1cmVzL3VpL2ZvbnRCaWcucG5nJyxcclxuXHRcdHtcclxuXHRcdFx0JzAnOiAxNSxcclxuXHRcdFx0JzEnOiAxNCxcclxuXHRcdFx0JzInOiAxNCxcclxuXHRcdFx0JzMnOiAxMyxcclxuXHRcdFx0JzQnOiAxMixcclxuXHRcdFx0JzUnOiAxMyxcclxuXHRcdFx0JzYnOiAxMixcclxuXHRcdFx0JzcnOiAxNCxcclxuXHRcdFx0JzgnOiAxNSxcclxuXHRcdFx0JzknOiAxMixcclxuXHRcdFx0J0EnOiAxMyxcclxuXHRcdFx0J0InOiAxNCxcclxuXHRcdFx0J0MnOiAxNSxcclxuXHRcdFx0J0QnOiAxMixcclxuXHRcdFx0J0UnOiAxNCxcclxuXHRcdFx0J0YnOiAxMyxcclxuXHRcdFx0J0cnOiAxNCxcclxuXHRcdFx0J0gnOiAxNSxcclxuXHRcdFx0J0knOiAxNSxcclxuXHRcdFx0J0onOiAxNixcclxuXHRcdFx0J0snOiAxMixcclxuXHRcdFx0J0wnOiAxMyxcclxuXHRcdFx0J00nOiAxNixcclxuXHRcdFx0J04nOiAxNyxcclxuXHRcdFx0J08nOiAxNyxcclxuXHRcdFx0J1AnOiAxOSxcclxuXHRcdFx0J1EnOiAxNyxcclxuXHRcdFx0J1InOiAxNCxcclxuXHRcdFx0J1MnOiAxNSxcclxuXHRcdFx0J1QnOiAxNyxcclxuXHRcdFx0J1UnOiAxNixcclxuXHRcdFx0J1YnOiAxNyxcclxuXHRcdFx0J1cnOiAyMSxcclxuXHRcdFx0J1gnOiAxNyxcclxuXHRcdFx0J1knOiAxNyxcclxuXHRcdFx0J1onOiAxOSxcclxuXHRcdFx0J2EnOiAxMixcclxuXHRcdFx0J2InOiAxNSxcclxuXHRcdFx0J2MnOiAxMixcclxuXHRcdFx0J2QnOiAxNSxcclxuXHRcdFx0J2UnOiAxMyxcclxuXHRcdFx0J2YnOiAxMixcclxuXHRcdFx0J2cnOiAxMyxcclxuXHRcdFx0J2gnOiAxMixcclxuXHRcdFx0J2knOiAxMSxcclxuXHRcdFx0J2onOiAxMixcclxuXHRcdFx0J2snOiAxMCxcclxuXHRcdFx0J2wnOiAxMCxcclxuXHRcdFx0J20nOiAxNixcclxuXHRcdFx0J24nOiAxMSxcclxuXHRcdFx0J28nOiAxMCxcclxuXHRcdFx0J3AnOiAxMSxcclxuXHRcdFx0J3EnOiAxNCxcclxuXHRcdFx0J3InOiAxMSxcclxuXHRcdFx0J3MnOiA4LFxyXG5cdFx0XHQndCc6IDExLFxyXG5cdFx0XHQndSc6IDEwLFxyXG5cdFx0XHQndic6IDExLFxyXG5cdFx0XHQndyc6IDE1LFxyXG5cdFx0XHQneCc6IDEyLFxyXG5cdFx0XHQneSc6IDExLFxyXG5cdFx0XHQneic6IDEwLFxyXG5cdFx0XHQnISc6IDksXHJcblx0XHRcdCcuJzogNCxcclxuXHRcdFx0JywnOiA0LFxyXG5cdFx0XHQnPyc6IDEzLFxyXG5cdFx0XHQnXyc6IDEzLFxyXG5cdFx0XHQnLSc6IDgsXHJcblx0XHRcdCc6JzogNCxcclxuXHRcdFx0JyAnOiA0LFxyXG5cdFx0fSxcclxuXHRcdCdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSEuLD9fLTogJyxcclxuXHRcdDI0LFxyXG5cdCksXHJcblx0dG9tX3RodW1iOiBuZXcgRm9udFJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy91aS90b21fdGh1bWIucG5nJyxcclxuXHRcdHtcclxuXHRcdFx0J0EnOiAzLFxyXG5cdFx0XHQnQic6IDMsXHJcblx0XHRcdCdDJzogMyxcclxuXHRcdFx0J0QnOiAzLFxyXG5cdFx0XHQnRSc6IDMsXHJcblx0XHRcdCdGJzogMyxcclxuXHRcdFx0J0cnOiAzLFxyXG5cdFx0XHQnSCc6IDMsXHJcblx0XHRcdCdJJzogMyxcclxuXHRcdFx0J0onOiAzLFxyXG5cdFx0XHQnSyc6IDMsXHJcblx0XHRcdCdMJzogMyxcclxuXHRcdFx0J00nOiAzLFxyXG5cdFx0XHQnTic6IDMsXHJcblx0XHRcdCdPJzogMyxcclxuXHRcdFx0J1AnOiAzLFxyXG5cdFx0XHQnUSc6IDMsXHJcblx0XHRcdCdSJzogMyxcclxuXHRcdFx0J1MnOiAzLFxyXG5cdFx0XHQnVCc6IDMsXHJcblx0XHRcdCdVJzogMyxcclxuXHRcdFx0J1YnOiAzLFxyXG5cdFx0XHQnVyc6IDMsXHJcblx0XHRcdCdYJzogMyxcclxuXHRcdFx0J1knOiAzLFxyXG5cdFx0XHQnWic6IDMsXHJcblx0XHRcdCdhJzogMyxcclxuXHRcdFx0J2InOiAzLFxyXG5cdFx0XHQnYyc6IDMsXHJcblx0XHRcdCdkJzogMyxcclxuXHRcdFx0J2UnOiAzLFxyXG5cdFx0XHQnZic6IDMsXHJcblx0XHRcdCdnJzogMyxcclxuXHRcdFx0J2gnOiAzLFxyXG5cdFx0XHQnaSc6IDMsXHJcblx0XHRcdCdqJzogMyxcclxuXHRcdFx0J2snOiAzLFxyXG5cdFx0XHQnbCc6IDMsXHJcblx0XHRcdCdtJzogMyxcclxuXHRcdFx0J24nOiAzLFxyXG5cdFx0XHQnbyc6IDMsXHJcblx0XHRcdCdwJzogMyxcclxuXHRcdFx0J3EnOiAzLFxyXG5cdFx0XHQncic6IDMsXHJcblx0XHRcdCdzJzogMyxcclxuXHRcdFx0J3QnOiAzLFxyXG5cdFx0XHQndSc6IDMsXHJcblx0XHRcdCd2JzogMyxcclxuXHRcdFx0J3cnOiAzLFxyXG5cdFx0XHQneCc6IDMsXHJcblx0XHRcdCd5JzogMyxcclxuXHRcdFx0J3onOiAzLFxyXG5cdFx0XHQnWyc6IDMsXHJcblx0XHRcdCdcXFxcJzogMyxcclxuXHRcdFx0J10nOiAzLFxyXG5cdFx0XHQnXic6IDMsXHJcblx0XHRcdCcgJzogMyxcclxuXHRcdFx0JyEnOiAzLFxyXG5cdFx0XHQnXCInOiAzLFxyXG5cdFx0XHQnIyc6IDMsXHJcblx0XHRcdCckJzogMyxcclxuXHRcdFx0JyUnOiAzLFxyXG5cdFx0XHQnJic6IDMsXHJcblx0XHRcdFwiJ1wiOiAzLFxyXG5cdFx0XHQnKCc6IDMsXHJcblx0XHRcdCcpJzogMyxcclxuXHRcdFx0JyonOiAzLFxyXG5cdFx0XHQnKyc6IDMsXHJcblx0XHRcdCcsJzogMyxcclxuXHRcdFx0Jy0nOiAzLFxyXG5cdFx0XHQnLic6IDMsXHJcblx0XHRcdCcvJzogMyxcclxuXHRcdFx0JzAnOiAzLFxyXG5cdFx0XHQnMSc6IDMsXHJcblx0XHRcdCcyJzogMyxcclxuXHRcdFx0JzMnOiAzLFxyXG5cdFx0XHQnNCc6IDMsXHJcblx0XHRcdCc1JzogMyxcclxuXHRcdFx0JzYnOiAzLFxyXG5cdFx0XHQnNyc6IDMsXHJcblx0XHRcdCc4JzogMyxcclxuXHRcdFx0JzknOiAzLFxyXG5cdFx0XHQnOic6IDMsXHJcblx0XHRcdCc7JzogMyxcclxuXHRcdFx0JzwnOiAzLFxyXG5cdFx0XHQnPSc6IDMsXHJcblx0XHRcdCc+JzogMyxcclxuXHRcdFx0Jz8nOiAzLFxyXG5cdFx0XHQnXyc6IDMsXHJcblx0XHR9LFxyXG5cdFx0YEFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXpbXFxcXF1eICFcIiMkJSYnKCkqKywtLi8wMTIzNDU2Nzg5Ojs8PT4/X2AsXHJcblx0XHQ1LFxyXG5cdCksXHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgS2V5cyA9IHtcclxuXHRrZXlib2FyZE1hcDogW1xyXG5cdFx0JycsIC8vIFswXVxyXG5cdFx0JycsIC8vIFsxXVxyXG5cdFx0JycsIC8vIFsyXVxyXG5cdFx0J0NBTkNFTCcsIC8vIFszXVxyXG5cdFx0JycsIC8vIFs0XVxyXG5cdFx0JycsIC8vIFs1XVxyXG5cdFx0J0hFTFAnLCAvLyBbNl1cclxuXHRcdCcnLCAvLyBbN11cclxuXHRcdCdCQUNLU1BBQ0UnLCAvLyBbOF1cclxuXHRcdCdUQUInLCAvLyBbOV1cclxuXHRcdCcnLCAvLyBbMTBdXHJcblx0XHQnJywgLy8gWzExXVxyXG5cdFx0J0NMRUFSJywgLy8gWzEyXVxyXG5cdFx0J0VOVEVSJywgLy8gWzEzXVxyXG5cdFx0J0VOVEVSIFNQRUNJQUwnLCAvLyBbMTRdXHJcblx0XHQnJywgLy8gWzE1XVxyXG5cdFx0J1NISUZUJywgLy8gWzE2XVxyXG5cdFx0J0NPTlRST0wnLCAvLyBbMTddXHJcblx0XHQnQUxUJywgLy8gWzE4XVxyXG5cdFx0J1BBVVNFJywgLy8gWzE5XVxyXG5cdFx0J0NBUFMgTE9DSycsIC8vIFsyMF1cclxuXHRcdCdLQU5BJywgLy8gWzIxXVxyXG5cdFx0J0VJU1UnLCAvLyBbMjJdXHJcblx0XHQnSlVOSkEnLCAvLyBbMjNdXHJcblx0XHQnRklOQUwnLCAvLyBbMjRdXHJcblx0XHQnSEFOSkEnLCAvLyBbMjVdXHJcblx0XHQnJywgLy8gWzI2XVxyXG5cdFx0J0VTQ0FQRScsIC8vIFsyN11cclxuXHRcdCdDT05WRVJUJywgLy8gWzI4XVxyXG5cdFx0J05PTkNPTlZFUlQnLCAvLyBbMjldXHJcblx0XHQnQUNDRVBUJywgLy8gWzMwXVxyXG5cdFx0J01PREVDSEFOR0UnLCAvLyBbMzFdXHJcblx0XHQnU1BBQ0UnLCAvLyBbMzJdXHJcblx0XHQnUEFHRSBVUCcsIC8vIFszM11cclxuXHRcdCdQQUdFIERPV04nLCAvLyBbMzRdXHJcblx0XHQnRU5EJywgLy8gWzM1XVxyXG5cdFx0J0hPTUUnLCAvLyBbMzZdXHJcblx0XHQnTEVGVCcsIC8vIFszN11cclxuXHRcdCdVUCcsIC8vIFszOF1cclxuXHRcdCdSSUdIVCcsIC8vIFszOV1cclxuXHRcdCdET1dOJywgLy8gWzQwXVxyXG5cdFx0J1NFTEVDVCcsIC8vIFs0MV1cclxuXHRcdCdQUklOVCcsIC8vIFs0Ml1cclxuXHRcdCdFWEVDVVRFJywgLy8gWzQzXVxyXG5cdFx0J1BSSU5UIFNDUkVFTicsIC8vIFs0NF1cclxuXHRcdCdJTlNFUlQnLCAvLyBbNDVdXHJcblx0XHQnREVMRVRFJywgLy8gWzQ2XVxyXG5cdFx0JycsIC8vIFs0N11cclxuXHRcdCcwJywgLy8gWzQ4XVxyXG5cdFx0JzEnLCAvLyBbNDldXHJcblx0XHQnMicsIC8vIFs1MF1cclxuXHRcdCczJywgLy8gWzUxXVxyXG5cdFx0JzQnLCAvLyBbNTJdXHJcblx0XHQnNScsIC8vIFs1M11cclxuXHRcdCc2JywgLy8gWzU0XVxyXG5cdFx0JzcnLCAvLyBbNTVdXHJcblx0XHQnOCcsIC8vIFs1Nl1cclxuXHRcdCc5JywgLy8gWzU3XVxyXG5cdFx0J0NPTE9OJywgLy8gWzU4XVxyXG5cdFx0J1NFTUlDT0xPTicsIC8vIFs1OV1cclxuXHRcdCdMRVNTIFRIQU4nLCAvLyBbNjBdXHJcblx0XHQnRVFVQUxTJywgLy8gWzYxXVxyXG5cdFx0J0dSRUFURVIgVEhBTicsIC8vIFs2Ml1cclxuXHRcdCdRVUVTVElPTiBNQVJLJywgLy8gWzYzXVxyXG5cdFx0J0FUJywgLy8gWzY0XVxyXG5cdFx0J0EnLCAvLyBbNjVdXHJcblx0XHQnQicsIC8vIFs2Nl1cclxuXHRcdCdDJywgLy8gWzY3XVxyXG5cdFx0J0QnLCAvLyBbNjhdXHJcblx0XHQnRScsIC8vIFs2OV1cclxuXHRcdCdGJywgLy8gWzcwXVxyXG5cdFx0J0cnLCAvLyBbNzFdXHJcblx0XHQnSCcsIC8vIFs3Ml1cclxuXHRcdCdJJywgLy8gWzczXVxyXG5cdFx0J0onLCAvLyBbNzRdXHJcblx0XHQnSycsIC8vIFs3NV1cclxuXHRcdCdMJywgLy8gWzc2XVxyXG5cdFx0J00nLCAvLyBbNzddXHJcblx0XHQnTicsIC8vIFs3OF1cclxuXHRcdCdPJywgLy8gWzc5XVxyXG5cdFx0J1AnLCAvLyBbODBdXHJcblx0XHQnUScsIC8vIFs4MV1cclxuXHRcdCdSJywgLy8gWzgyXVxyXG5cdFx0J1MnLCAvLyBbODNdXHJcblx0XHQnVCcsIC8vIFs4NF1cclxuXHRcdCdVJywgLy8gWzg1XVxyXG5cdFx0J1YnLCAvLyBbODZdXHJcblx0XHQnVycsIC8vIFs4N11cclxuXHRcdCdYJywgLy8gWzg4XVxyXG5cdFx0J1knLCAvLyBbODldXHJcblx0XHQnWicsIC8vIFs5MF1cclxuXHRcdCdPUyBLRVknLCAvLyBbOTFdIFdpbmRvd3MgS2V5IChXaW5kb3dzKSBvciBDb21tYW5kIEtleSAoTWFjKVxyXG5cdFx0JycsIC8vIFs5Ml1cclxuXHRcdCdDT05URVhUIE1FTlUnLCAvLyBbOTNdXHJcblx0XHQnJywgLy8gWzk0XVxyXG5cdFx0J1NMRUVQJywgLy8gWzk1XVxyXG5cdFx0J05VTVBBRDAnLCAvLyBbOTZdXHJcblx0XHQnTlVNUEFEMScsIC8vIFs5N11cclxuXHRcdCdOVU1QQUQyJywgLy8gWzk4XVxyXG5cdFx0J05VTVBBRDMnLCAvLyBbOTldXHJcblx0XHQnTlVNUEFENCcsIC8vIFsxMDBdXHJcblx0XHQnTlVNUEFENScsIC8vIFsxMDFdXHJcblx0XHQnTlVNUEFENicsIC8vIFsxMDJdXHJcblx0XHQnTlVNUEFENycsIC8vIFsxMDNdXHJcblx0XHQnTlVNUEFEOCcsIC8vIFsxMDRdXHJcblx0XHQnTlVNUEFEOScsIC8vIFsxMDVdXHJcblx0XHQnTVVMVElQTFknLCAvLyBbMTA2XVxyXG5cdFx0J0FERCcsIC8vIFsxMDddXHJcblx0XHQnU0VQQVJBVE9SJywgLy8gWzEwOF1cclxuXHRcdCdTVUJUUkFDVCcsIC8vIFsxMDldXHJcblx0XHQnREVDSU1BTCcsIC8vIFsxMTBdXHJcblx0XHQnRElWSURFJywgLy8gWzExMV1cclxuXHRcdCdGMScsIC8vIFsxMTJdXHJcblx0XHQnRjInLCAvLyBbMTEzXVxyXG5cdFx0J0YzJywgLy8gWzExNF1cclxuXHRcdCdGNCcsIC8vIFsxMTVdXHJcblx0XHQnRjUnLCAvLyBbMTE2XVxyXG5cdFx0J0Y2JywgLy8gWzExN11cclxuXHRcdCdGNycsIC8vIFsxMThdXHJcblx0XHQnRjgnLCAvLyBbMTE5XVxyXG5cdFx0J0Y5JywgLy8gWzEyMF1cclxuXHRcdCdGMTAnLCAvLyBbMTIxXVxyXG5cdFx0J0YxMScsIC8vIFsxMjJdXHJcblx0XHQnRjEyJywgLy8gWzEyM11cclxuXHRcdCdGMTMnLCAvLyBbMTI0XVxyXG5cdFx0J0YxNCcsIC8vIFsxMjVdXHJcblx0XHQnRjE1JywgLy8gWzEyNl1cclxuXHRcdCdGMTYnLCAvLyBbMTI3XVxyXG5cdFx0J0YxNycsIC8vIFsxMjhdXHJcblx0XHQnRjE4JywgLy8gWzEyOV1cclxuXHRcdCdGMTknLCAvLyBbMTMwXVxyXG5cdFx0J0YyMCcsIC8vIFsxMzFdXHJcblx0XHQnRjIxJywgLy8gWzEzMl1cclxuXHRcdCdGMjInLCAvLyBbMTMzXVxyXG5cdFx0J0YyMycsIC8vIFsxMzRdXHJcblx0XHQnRjI0JywgLy8gWzEzNV1cclxuXHRcdCcnLCAvLyBbMTM2XVxyXG5cdFx0JycsIC8vIFsxMzddXHJcblx0XHQnJywgLy8gWzEzOF1cclxuXHRcdCcnLCAvLyBbMTM5XVxyXG5cdFx0JycsIC8vIFsxNDBdXHJcblx0XHQnJywgLy8gWzE0MV1cclxuXHRcdCcnLCAvLyBbMTQyXVxyXG5cdFx0JycsIC8vIFsxNDNdXHJcblx0XHQnTlVNIExPQ0snLCAvLyBbMTQ0XVxyXG5cdFx0J1NDUk9MTCBMT0NLJywgLy8gWzE0NV1cclxuXHRcdCdXSU4gT0VNIEZKIEpJU0hPJywgLy8gWzE0Nl1cclxuXHRcdCdXSU4gT0VNIEZKIE1BU1NIT1UnLCAvLyBbMTQ3XVxyXG5cdFx0J1dJTiBPRU0gRkogVE9VUk9LVScsIC8vIFsxNDhdXHJcblx0XHQnV0lOIE9FTSBGSiBMT1lBJywgLy8gWzE0OV1cclxuXHRcdCdXSU4gT0VNIEZKIFJPWUEnLCAvLyBbMTUwXVxyXG5cdFx0JycsIC8vIFsxNTFdXHJcblx0XHQnJywgLy8gWzE1Ml1cclxuXHRcdCcnLCAvLyBbMTUzXVxyXG5cdFx0JycsIC8vIFsxNTRdXHJcblx0XHQnJywgLy8gWzE1NV1cclxuXHRcdCcnLCAvLyBbMTU2XVxyXG5cdFx0JycsIC8vIFsxNTddXHJcblx0XHQnJywgLy8gWzE1OF1cclxuXHRcdCcnLCAvLyBbMTU5XVxyXG5cdFx0J0NJUkNVTUZMRVgnLCAvLyBbMTYwXVxyXG5cdFx0J0VYQ0xBTUFUSU9OJywgLy8gWzE2MV1cclxuXHRcdCdET1VCTEVfUVVPVEUnLCAvLyBbMTYyXVxyXG5cdFx0J0hBU0gnLCAvLyBbMTYzXVxyXG5cdFx0J0RPTExBUicsIC8vIFsxNjRdXHJcblx0XHQnUEVSQ0VOVCcsIC8vIFsxNjVdXHJcblx0XHQnQU1QRVJTQU5EJywgLy8gWzE2Nl1cclxuXHRcdCdVTkRFUlNDT1JFJywgLy8gWzE2N11cclxuXHRcdCdPUEVOIFBBUkVOVEhFU0lTJywgLy8gWzE2OF1cclxuXHRcdCdDTE9TRSBQQVJFTlRIRVNJUycsIC8vIFsxNjldXHJcblx0XHQnQVNURVJJU0snLCAvLyBbMTcwXVxyXG5cdFx0J1BMVVMnLCAvLyBbMTcxXVxyXG5cdFx0J1BJUEUnLCAvLyBbMTcyXVxyXG5cdFx0J0hZUEhFTicsIC8vIFsxNzNdXHJcblx0XHQnT1BFTiBDVVJMWSBCUkFDS0VUJywgLy8gWzE3NF1cclxuXHRcdCdDTE9TRSBDVVJMWSBCUkFDS0VUJywgLy8gWzE3NV1cclxuXHRcdCdUSUxERScsIC8vIFsxNzZdXHJcblx0XHQnJywgLy8gWzE3N11cclxuXHRcdCcnLCAvLyBbMTc4XVxyXG5cdFx0JycsIC8vIFsxNzldXHJcblx0XHQnJywgLy8gWzE4MF1cclxuXHRcdCdWT0xVTUUgTVVURScsIC8vIFsxODFdXHJcblx0XHQnVk9MVU1FIERPV04nLCAvLyBbMTgyXVxyXG5cdFx0J1ZPTFVNRSBVUCcsIC8vIFsxODNdXHJcblx0XHQnJywgLy8gWzE4NF1cclxuXHRcdCcnLCAvLyBbMTg1XVxyXG5cdFx0J1NFTUlDT0xPTicsIC8vIFsxODZdXHJcblx0XHQnRVFVQUxTJywgLy8gWzE4N11cclxuXHRcdCdDT01NQScsIC8vIFsxODhdXHJcblx0XHQnTUlOVVMnLCAvLyBbMTg5XVxyXG5cdFx0J1BFUklPRCcsIC8vIFsxOTBdXHJcblx0XHQnU0xBU0gnLCAvLyBbMTkxXVxyXG5cdFx0J0JBQ0sgUVVPVEUnLCAvLyBbMTkyXVxyXG5cdFx0JycsIC8vIFsxOTNdXHJcblx0XHQnJywgLy8gWzE5NF1cclxuXHRcdCcnLCAvLyBbMTk1XVxyXG5cdFx0JycsIC8vIFsxOTZdXHJcblx0XHQnJywgLy8gWzE5N11cclxuXHRcdCcnLCAvLyBbMTk4XVxyXG5cdFx0JycsIC8vIFsxOTldXHJcblx0XHQnJywgLy8gWzIwMF1cclxuXHRcdCcnLCAvLyBbMjAxXVxyXG5cdFx0JycsIC8vIFsyMDJdXHJcblx0XHQnJywgLy8gWzIwM11cclxuXHRcdCcnLCAvLyBbMjA0XVxyXG5cdFx0JycsIC8vIFsyMDVdXHJcblx0XHQnJywgLy8gWzIwNl1cclxuXHRcdCcnLCAvLyBbMjA3XVxyXG5cdFx0JycsIC8vIFsyMDhdXHJcblx0XHQnJywgLy8gWzIwOV1cclxuXHRcdCcnLCAvLyBbMjEwXVxyXG5cdFx0JycsIC8vIFsyMTFdXHJcblx0XHQnJywgLy8gWzIxMl1cclxuXHRcdCcnLCAvLyBbMjEzXVxyXG5cdFx0JycsIC8vIFsyMTRdXHJcblx0XHQnJywgLy8gWzIxNV1cclxuXHRcdCcnLCAvLyBbMjE2XVxyXG5cdFx0JycsIC8vIFsyMTddXHJcblx0XHQnJywgLy8gWzIxOF1cclxuXHRcdCdPUEVOIEJSQUNLRVQnLCAvLyBbMjE5XVxyXG5cdFx0J0JBQ0sgU0xBU0gnLCAvLyBbMjIwXVxyXG5cdFx0J0NMT1NFIEJSQUNLRVQnLCAvLyBbMjIxXVxyXG5cdFx0J1FVT1RFJywgLy8gWzIyMl1cclxuXHRcdCcnLCAvLyBbMjIzXVxyXG5cdFx0J01FVEEnLCAvLyBbMjI0XVxyXG5cdFx0J0FMVCBHUkFQSCcsIC8vIFsyMjVdXHJcblx0XHQnJywgLy8gWzIyNl1cclxuXHRcdCdXSU4gSUNPIEhFTFAnLCAvLyBbMjI3XVxyXG5cdFx0J1dJTiBJQ08gMDAnLCAvLyBbMjI4XVxyXG5cdFx0JycsIC8vIFsyMjldXHJcblx0XHQnV0lOIElDTyBDTEVBUicsIC8vIFsyMzBdXHJcblx0XHQnJywgLy8gWzIzMV1cclxuXHRcdCcnLCAvLyBbMjMyXVxyXG5cdFx0J1dJTiBPRU0gUkVTRVQnLCAvLyBbMjMzXVxyXG5cdFx0J1dJTiBPRU0gSlVNUCcsIC8vIFsyMzRdXHJcblx0XHQnV0lOIE9FTSBQQTEnLCAvLyBbMjM1XVxyXG5cdFx0J1dJTiBPRU0gUEEyJywgLy8gWzIzNl1cclxuXHRcdCdXSU4gT0VNIFBBMycsIC8vIFsyMzddXHJcblx0XHQnV0lOIE9FTSBXU0NUUkwnLCAvLyBbMjM4XVxyXG5cdFx0J1dJTiBPRU0gQ1VTRUwnLCAvLyBbMjM5XVxyXG5cdFx0J1dJTiBPRU0gQVRUTicsIC8vIFsyNDBdXHJcblx0XHQnV0lOIE9FTSBGSU5JU0gnLCAvLyBbMjQxXVxyXG5cdFx0J1dJTiBPRU0gQ09QWScsIC8vIFsyNDJdXHJcblx0XHQnV0lOIE9FTSBBVVRPJywgLy8gWzI0M11cclxuXHRcdCdXSU4gT0VNIEVOTFcnLCAvLyBbMjQ0XVxyXG5cdFx0J1dJTiBPRU0gQkFDS1RBQicsIC8vIFsyNDVdXHJcblx0XHQnQVRUTicsIC8vIFsyNDZdXHJcblx0XHQnQ1JTRUwnLCAvLyBbMjQ3XVxyXG5cdFx0J0VYU0VMJywgLy8gWzI0OF1cclxuXHRcdCdFUkVPRicsIC8vIFsyNDldXHJcblx0XHQnUExBWScsIC8vIFsyNTBdXHJcblx0XHQnWk9PTScsIC8vIFsyNTFdXHJcblx0XHQnJywgLy8gWzI1Ml1cclxuXHRcdCdQQTEnLCAvLyBbMjUzXVxyXG5cdFx0J1dJTiBPRU0gQ0xFQVInLCAvLyBbMjU0XVxyXG5cdFx0J1RPR0dMRSBUT1VDSFBBRCcsIC8vIFsyNTVdXHJcblx0XSwgLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTc3MjE3OS9nZXQtY2hhcmFjdGVyLXZhbHVlLWZyb20ta2V5Y29kZS1pbi1qYXZhc2NyaXB0LXRoZW4tdHJpbVxyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IEF1ZGlvQXNzZXRzID0ge1xyXG5cdHVpOiB7XHJcblx0XHRpbnZlbnRvcnlDbGFjazogbmV3IEF1ZGlvUmVzb3VyY2VHcm91cChbXHJcblx0XHRcdG5ldyBBdWRpb1Jlc291cmNlKCdhc3NldHMvc291bmRzL3NmeC91aS9jbGFjazEubXAzJyksXHJcblx0XHRcdG5ldyBBdWRpb1Jlc291cmNlKCdhc3NldHMvc291bmRzL3NmeC91aS9jbGFjazIubXAzJyksXHJcblx0XHRcdG5ldyBBdWRpb1Jlc291cmNlKCdhc3NldHMvc291bmRzL3NmeC91aS9jbGFjazMubXAzJyksXHJcblx0XHRdKSxcclxuXHR9LFxyXG5cdG11c2ljOiB7XHJcblx0XHR0aXRsZVNjcmVlbjogbmV3IEF1ZGlvUmVzb3VyY2UoJ2Fzc2V0cy9zb3VuZHMvbXVzaWMvVGl0bGVTY3JlZW4ubXAzJyksXHJcblx0fSxcclxuXHRhbWJpZW50OiB7XHJcblx0XHR3aW50ZXIxOiBuZXcgQXVkaW9SZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy9zb3VuZHMvc2Z4L2FtYmllbnQvNjU4MTNfX3BjYWVsZHJpZXNfX2NvdW50cnlzaWRld2ludGVyZXZlbmluZzAyLndhdicsXHJcblx0XHQpLFxyXG5cdH0sXHJcblx0d29ybGQ6IHtcclxuXHRcdG1ldGFscGxvc2l2ZTogbmV3IEF1ZGlvUmVzb3VyY2VHcm91cChbXHJcblx0XHRuZXcgQXVkaW9SZXNvdXJjZSgnYXNzZXRzL3NvdW5kcy9zZngvdGlsZXMvbWV0YWwxcGxvc2l2ZS5tcDMnKSxcclxuXHRcdG5ldyBBdWRpb1Jlc291cmNlKCdhc3NldHMvc291bmRzL3NmeC90aWxlcy9tZXRhbDJwbG9zaXZlLm1wMycpLFxyXG5cdFx0bmV3IEF1ZGlvUmVzb3VyY2UoJ2Fzc2V0cy9zb3VuZHMvc2Z4L3RpbGVzL21ldGFsM3Bsb3NpdmUubXAzJyksXHJcblx0XHRuZXcgQXVkaW9SZXNvdXJjZSgnYXNzZXRzL3NvdW5kcy9zZngvdGlsZXMvbWV0YWw0cGxvc2l2ZS5tcDMnKSxcclxuXHRcdG5ldyBBdWRpb1Jlc291cmNlKCdhc3NldHMvc291bmRzL3NmeC90aWxlcy9tZXRhbDVwbG9zaXZlLm1wMycpLFxyXG5cdFx0bmV3IEF1ZGlvUmVzb3VyY2UoJ2Fzc2V0cy9zb3VuZHMvc2Z4L3RpbGVzL21ldGFsNnBsb3NpdmUubXAzJyksXHJcblx0XHRuZXcgQXVkaW9SZXNvdXJjZSgnYXNzZXRzL3NvdW5kcy9zZngvdGlsZXMvbWV0YWw3cGxvc2l2ZS5tcDMnKSxcclxuXHRcdF0pLFxyXG5cdFx0c29mdHBsb3NpdmU6IG5ldyBBdWRpb1Jlc291cmNlKCdhc3NldHMvc291bmRzL3NmeC90aWxlcy9zb2Z0MXBsb3NpdmUubXAzJyksXHJcblx0XHR0ZXh0dXJlZHBsb3NpdmU6IG5ldyBBdWRpb1Jlc291cmNlKCdhc3NldHMvc291bmRzL3NmeC90aWxlcy90ZXh0dXJlZDFwbG9zaXZlLm1wMycpLFxyXG5cdH1cclxufTtcclxuXHJcbmV4cG9ydCB0eXBlIEFuaW1hdGlvbkZyYW1lPFQgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBbSW1hZ2VSZXNvdXJjZSwgbnVtYmVyXVtdPj4gPSBrZXlvZiBUO1xyXG5cclxuLy8gY29uc3QgYW5pbWF0aW9ucyA9IDxUIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgSW1hZ2VSZXNvdXJjZVtdPj4oZGF0YTogVCk6IFQgPT4gZGF0YVxyXG5cclxuZXhwb3J0IGNvbnN0IGxvYWRBc3NldHMgPSAoc2tldGNoOiBQNSwgLi4uYXNzZXRzOiBBc3NldEdyb3VwW10pID0+IHtcclxuXHRhc3NldHMuZm9yRWFjaChhc3NldEdyb3VwID0+IHtcclxuXHRcdHNlYXJjaEdyb3VwKGFzc2V0R3JvdXAsIHNrZXRjaCk7XHJcblx0fSk7XHJcbn07XHJcblxyXG5mdW5jdGlvbiBzZWFyY2hHcm91cChcclxuXHRhc3NldEdyb3VwOlxyXG5cdHtcclxuXHRcdFtuYW1lOiBzdHJpbmddOlxyXG5cdFx0XHR8IFJlc291cmNlXHJcblx0XHRcdHwgQXNzZXRHcm91cFxyXG5cdFx0XHR8IEF1ZGlvUmVzb3VyY2VHcm91cFtdXHJcblx0XHRcdHwgQXVkaW9SZXNvdXJjZUdyb3VwXHJcblx0XHRcdHwgQXVkaW9SZXNvdXJjZVxyXG5cdFx0XHR8IEltYWdlUmVzb3VyY2VbXVxyXG5cdFx0XHR8IEltYWdlUmVzb3VyY2VbXVtdXHJcblx0XHRcdHwgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlW11cclxuXHRcdFx0fCBSZWZsZWN0YWJsZUltYWdlUmVzb3VyY2VcclxuXHRcdFx0fCBbUmVmbGVjdGFibGVJbWFnZVJlc291cmNlLCBudW1iZXJdW107XHJcbiAgfVxyXG58IFJlc291cmNlXHJcbnwgQXNzZXRHcm91cFxyXG58IEF1ZGlvUmVzb3VyY2VHcm91cFtdXHJcbnwgQXVkaW9SZXNvdXJjZUdyb3VwXHJcbnwgQXVkaW9SZXNvdXJjZVxyXG58IEltYWdlUmVzb3VyY2VbXVxyXG58IEltYWdlUmVzb3VyY2VbXVtdXHJcbnwgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlW11cclxufCBSZWZsZWN0YWJsZUltYWdlUmVzb3VyY2VcclxufCBbUmVmbGVjdGFibGVJbWFnZVJlc291cmNlLCBudW1iZXJdW10sXHJcblx0c2tldGNoOiBQNSxcclxuKSB7XHJcblx0aWYgKGFzc2V0R3JvdXAgaW5zdGFuY2VvZiBSZXNvdXJjZSkge1xyXG5cdFx0Y29uc29sZS5sb2coYExvYWRpbmcgYXNzZXQgJHthc3NldEdyb3VwLnBhdGh9YCk7XHJcblx0XHRhc3NldEdyb3VwLmxvYWRSZXNvdXJjZShza2V0Y2gpO1xyXG5cdFx0Y29uc29sZS5sb2coXCJ1cCBhIGxldmVsXCIpXHJcblx0XHRyZXR1cm47XHJcblx0fVxyXG5cdE9iamVjdC5lbnRyaWVzKGFzc2V0R3JvdXApLmZvckVhY2goYXNzZXQgPT4ge1xyXG5cdFx0Y29uc29sZS5sb2coXCJkb3duIGEgbGV2ZWxcIilcclxuXHRcdC8vY29uc29sZS5sb2coYXNzZXRbMV0pO1xyXG5cdFx0c2VhcmNoR3JvdXAoYXNzZXRbMV0sIHNrZXRjaCk7XHJcblx0fSk7XHJcbn1cclxuIiwiaW1wb3J0IFA1IGZyb20gJ3A1JztcclxuaW1wb3J0IHsgUmVzb3VyY2UgfSBmcm9tICcuL1Jlc291cmNlJztcclxuaW1wb3J0IHsgSG93bGVyLCBIb3dsIH0gZnJvbSAnaG93bGVyJ1xyXG5cclxuZXhwb3J0IGNsYXNzIEF1ZGlvUmVzb3VyY2UgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgICBzb3VuZDogSG93bFxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBhdGg6IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKHBhdGgpO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWRSZXNvdXJjZShnYW1lOiBQNSkge1xyXG4gICAgICAgIHRoaXMuc291bmQgPSBuZXcgSG93bCh7XHJcbiAgICAgICAgICAgIHNyYzogW3RoaXMucGF0aF1cclxuICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHBsYXlSYW5kb20oc3RlcmVvOiBudW1iZXIsIHZvbHVtZT86IG51bWJlcikge1xyXG4gICAgICAgIC8vIFZlcmlmeSB0aGF0IHRoZSBzb3VuZCBoYXMgYmVlbiBsb2FkZWRcclxuICAgICAgICBpZiAodGhpcy5zb3VuZCA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAgICAgICAgICAgICBgVHJpZWQgdG8gcGxheSBzb3VuZCBiZWZvcmUgbG9hZGluZyBpdDogJHt0aGlzLnBhdGh9YFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwidHJpZWQgdG8gcGxheSByYW5kb21cIilcclxuICAgICAgICBpZih2b2x1bWU9PT11bmRlZmluZWQpIHZvbHVtZSA9IDE7XHJcbiAgICAgICAgdGhpcy5zb3VuZC52b2x1bWUodm9sdW1lKTtcclxuICAgICAgICB0aGlzLnNvdW5kLnN0ZXJlbyhzdGVyZW8pO1xyXG4gICAgICAgIHRoaXMuc291bmQucmF0ZShNYXRoLnJhbmRvbSgpKjAuNCswLjgpO1xyXG4gICAgICAgIHRoaXMuc291bmQucGxheSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHBsYXlTb3VuZChzdGVyZW86IG51bWJlcikgey8vIHBsYXkgdGhlIHNvdW5kXHJcbiAgICAgICAgLy9WZXJpZnkgdGhhdCB0aGUgc291bmQgaGFzIGJlZW4gbG9hZGVkXHJcbiAgICAgICAgaWYgKHRoaXMuc291bmQgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxyXG4gICAgICAgICAgICAgICAgYFRyaWVkIHRvIHBsYXkgc291bmQgYmVmb3JlIGxvYWRpbmcgaXQ6ICR7dGhpcy5wYXRofWBcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB0aGlzLnNvdW5kLnJhdGUoMSlcclxuICAgICAgICB0aGlzLnNvdW5kLnN0ZXJlbyhzdGVyZW8pXHJcbiAgICAgICAgdGhpcy5zb3VuZC5wbGF5KCk7XHJcbiAgICB9XHJcblxyXG59XHJcbiIsImltcG9ydCB7IEF1ZGlvUmVzb3VyY2UgfSBmcm9tICcuL0F1ZGlvUmVzb3VyY2UnO1xyXG5pbXBvcnQgUDUgZnJvbSBcInA1XCI7XHJcbmltcG9ydCB7IFJlc291cmNlIH0gZnJvbSAnLi9SZXNvdXJjZSc7XHJcblxyXG5leHBvcnQgY2xhc3MgQXVkaW9SZXNvdXJjZUdyb3VwIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG5cclxuICAgIHNvdW5kczogQXVkaW9SZXNvdXJjZVtdXHJcblxyXG4gICAgY29uc3RydWN0b3Ioc291bmRzOiBBdWRpb1Jlc291cmNlW10pIHsvLyBwYXNzIGluIGFuIGFycmF5IG9mIEF1ZGlvUmVzb3VyY2VzIHRoYXQgYXJlIGFsbCBzaW1pbGFyXHJcbiAgICAgICAgc3VwZXIoXCJBVURJT1JFU09VUkNFR1JPVVAgRE9FUyBOT1QgSEFWRSBQQVRIXCIpO1xyXG4gICAgICAgIHRoaXMuc291bmRzID0gc291bmRzO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWRSZXNvdXJjZShza2V0Y2g6IFA1KTogdm9pZCB7XHJcbiAgICAgICAgZm9yKGxldCBhdWRpb1Jlc291cmNlIG9mIHRoaXMuc291bmRzKSB7XHJcbiAgICAgICAgICAgIGF1ZGlvUmVzb3VyY2UubG9hZFJlc291cmNlKHNrZXRjaCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHBsYXlSYW5kb20oc3RlcmVvOiBudW1iZXIsIHZvbHVtZT86IG51bWJlcikgey8vIHBsYXkgYSByYW5kb20gc291bmRcclxuICAgICAgICBpZih0aGlzLnNvdW5kcyA9PT0gdW5kZWZpbmVkIHx8IHRoaXMuc291bmRzLmxlbmd0aCA9PT0gMClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxyXG4gICAgICAgICAgICAgICAgYFRoZXJlIGFyZSBubyBzb3VuZHM6ICR7dGhpcy5zb3VuZHN9YFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwidHJpZWQgdG8gcGxheSBhdWRpb3Jlc291cmNlZ3JvdXBcIilcclxuICAgICAgICBpZih2b2x1bWU9PT11bmRlZmluZWQpIHZvbHVtZSA9IDE7XHJcbiAgICAgICAgY29uc3QgciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHRoaXMuc291bmRzLmxlbmd0aCk7XHJcbiAgICAgICAgdGhpcy5zb3VuZHNbcl0ucGxheVJhbmRvbShzdGVyZW8sIHZvbHVtZSk7Ly8gcGxheSBhIHJhbmRvbSBzb3VuZCBmcm9tIHRoZSBhcnJheSBhdCBhIHNsaWdodGx5IHJhbmRvbWl6ZWQgcGl0Y2gsIGxlYWRpbmcgdG8gdGhlIGVmZmVjdCBvZiBpdCBtYWtpbmcgYSBuZXcgc291bmQgZWFjaCB0aW1lLCByZW1vdmluZyByZXBldGl0aXZlbmVzc1xyXG5cclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgeyBJbWFnZVJlc291cmNlIH0gZnJvbSAnLi9JbWFnZVJlc291cmNlJztcclxuaW1wb3J0IHA1IGZyb20gJ3A1JztcclxuaW1wb3J0IHsgZ2FtZSB9IGZyb20gJy4uLy4uL0dhbWUnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEZvbnRSZXNvdXJjZSBleHRlbmRzIEltYWdlUmVzb3VyY2Uge1xyXG5cclxuICAgIGFscGhhYmV0X3NvdXA6IHtbbGV0dGVyOiBzdHJpbmddOiB7eDogbnVtYmVyLCB5OiBudW1iZXIsIHc6IG51bWJlciwgaDogbnVtYmVyfX0gPSB7fVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBhdGg6IHN0cmluZywgY2hhcmFjdGVyRGF0YToge1tsZXR0ZXI6IHN0cmluZ106IG51bWJlcn0sIGNoYXJhY3Rlck9yZGVyOiBzdHJpbmcsIGZvbnRIZWlnaHQ6IG51bWJlcikge1xyXG4gICAgICAgIHN1cGVyKHBhdGgpO1xyXG4gICAgICAgIGxldCBydW5uaW5nVG90YWwgPSAwXHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaTxjaGFyYWN0ZXJPcmRlci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmFscGhhYmV0X3NvdXBbY2hhcmFjdGVyT3JkZXJbaV1dID0ge3g6IHJ1bm5pbmdUb3RhbCwgeTogMCwgdzogY2hhcmFjdGVyRGF0YVtjaGFyYWN0ZXJPcmRlcltpXV0sIGg6IGZvbnRIZWlnaHR9XHJcbiAgICAgICAgICAgIHJ1bm5pbmdUb3RhbCArPSBjaGFyYWN0ZXJEYXRhW2NoYXJhY3Rlck9yZGVyW2ldXSArIDFcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coY2hhcmFjdGVyT3JkZXJbaV0rXCI6IFwiK2NoYXJhY3RlckRhdGFbY2hhcmFjdGVyT3JkZXJbaV1dKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZHJhd1RleHQodGFyZ2V0OiBwNSwgc3RyOiBzdHJpbmcsIHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyh0aGlzLmFscGhhYmV0X3NvdXApO1xyXG4gICAgICAgIGxldCB4T2Zmc2V0OiBudW1iZXIgPSAwO1xyXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGk8c3RyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuYWxwaGFiZXRfc291cFtzdHJbaV1dIT11bmRlZmluZWQpe1xyXG4gICAgICAgICAgICB0aGlzLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4K3hPZmZzZXQqZ2FtZS51cHNjYWxlU2l6ZSwgeSwgdGhpcy5hbHBoYWJldF9zb3VwW3N0cltpXV0udypnYW1lLnVwc2NhbGVTaXplLCB0aGlzLmFscGhhYmV0X3NvdXBbc3RyW2ldXS5oKmdhbWUudXBzY2FsZVNpemUsIHRoaXMuYWxwaGFiZXRfc291cFtzdHJbaV1dLngsIHRoaXMuYWxwaGFiZXRfc291cFtzdHJbaV1dLnksIHRoaXMuYWxwaGFiZXRfc291cFtzdHJbaV1dLncsIHRoaXMuYWxwaGFiZXRfc291cFtzdHJbaV1dLmgpO1xyXG4gICAgICAgICAgICB4T2Zmc2V0ICs9IHRoaXMuYWxwaGFiZXRfc291cFtzdHJbaV1dLncrMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcInVua25vd24gbGV0dGVyOiAnXCIrc3RyW2ldK1wiJ1wiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImltcG9ydCBQNSBmcm9tICdwNSc7XHJcbmltcG9ydCB7IFJlc291cmNlIH0gZnJvbSAnLi9SZXNvdXJjZSc7XHJcblxyXG5leHBvcnQgY2xhc3MgSW1hZ2VSZXNvdXJjZSBleHRlbmRzIFJlc291cmNlIHtcclxuICAgIGltYWdlOiBQNS5JbWFnZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwYXRoOiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcihwYXRoKTtcclxuICAgIH1cclxuXHJcbiAgICBsb2FkUmVzb3VyY2UoZ2FtZTogUDUpIHtcclxuICAgICAgICB0aGlzLmltYWdlID0gZ2FtZS5sb2FkSW1hZ2UodGhpcy5wYXRoKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIodGFyZ2V0OiBhbnksIHg6IG51bWJlciwgeTogbnVtYmVyLCB3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcikge1xyXG4gICAgICAgIC8vIFZlcmlmeSB0aGF0IHRoZSB0aWxlcyBoYXMgYmVlbiBsb2FkZWRcclxuICAgICAgICBpZiAodGhpcy5pbWFnZSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAgICAgICAgICAgICBgVHJpZWQgdG8gcmVuZGVyIGltYWdlIGJlZm9yZSBsb2FkaW5nIGl0OiAke3RoaXMucGF0aH1gXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIC8vIERyYXcgbm9uIHRpbGVzIGltYWdlXHJcbiAgICAgICAgdGFyZ2V0LmltYWdlKHRoaXMuaW1hZ2UsIHgsIHksIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlclJvdGF0ZWQodGFyZ2V0OiBhbnksIHg6IG51bWJlciwgeTogbnVtYmVyLCB3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlciwgcm90YXRpb246IG51bWJlcikge1xyXG4gICAgICAgIC8vIFZlcmlmeSB0aGF0IHRoZSB0aWxlcyBoYXMgYmVlbiBsb2FkZWRcclxuICAgICAgICBpZiAodGhpcy5pbWFnZSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAgICAgICAgICAgICBgVHJpZWQgdG8gcmVuZGVyIGltYWdlIGJlZm9yZSBsb2FkaW5nIGl0OiAke3RoaXMucGF0aH1gXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIC8vIERyYXcgbm9uIHRpbGVzIGltYWdlXHJcbiAgICAgICAgdGFyZ2V0LnB1c2goKVxyXG4gICAgICAgIHRhcmdldC50cmFuc2xhdGUoeCt3aWR0aC8yLCB5K2hlaWdodC8yKTtcclxuICAgICAgICB0YXJnZXQucm90YXRlKHJvdGF0aW9uKTtcclxuICAgICAgICB0YXJnZXQudHJhbnNsYXRlKC13aWR0aC8yLCAtaGVpZ2h0LzIpO1xyXG4gICAgICAgIHRhcmdldC5pbWFnZSh0aGlzLmltYWdlLCAwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcclxuICAgICAgICB0YXJnZXQucG9wKClcclxuICAgIH1cclxuXHJcblxyXG4gICAgcmVuZGVyUGFydGlhbChcclxuICAgICAgICB0YXJnZXQ6IGFueSxcclxuICAgICAgICB4OiBudW1iZXIsXHJcbiAgICAgICAgeTogbnVtYmVyLFxyXG4gICAgICAgIHdpZHRoOiBudW1iZXIsXHJcbiAgICAgICAgaGVpZ2h0OiBudW1iZXIsXHJcbiAgICAgICAgc291cmNlWD86IG51bWJlcixcclxuICAgICAgICBzb3VyY2VZPzogbnVtYmVyLFxyXG4gICAgICAgIHNvdXJjZVdpZHRoPzogbnVtYmVyLFxyXG4gICAgICAgIHNvdXJjZUhlaWdodD86IG51bWJlclxyXG4gICAgKSB7XHJcbiAgICAgICAgLy8gVmVyaWZ5IHRoYXQgdGhlIHRpbGVzIGhhcyBiZWVuIGxvYWRlZFxyXG4gICAgICAgIGlmICh0aGlzLmltYWdlID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcclxuICAgICAgICAgICAgICAgIGBUcmllZCB0byByZW5kZXIgaW1hZ2UgYmVmb3JlIGxvYWRpbmcgaXQ6ICR7dGhpcy5wYXRofWBcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgLy8gRHJhdyBhIHBhcnRpYWwgcGFydCBvZiB0aGUgaW1hZ2VcclxuICAgICAgICB0YXJnZXQuaW1hZ2UoXHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2UsXHJcbiAgICAgICAgICAgIHgsXHJcbiAgICAgICAgICAgIHksXHJcbiAgICAgICAgICAgIHdpZHRoLFxyXG4gICAgICAgICAgICBoZWlnaHQsXHJcbiAgICAgICAgICAgIHNvdXJjZVgsXHJcbiAgICAgICAgICAgIHNvdXJjZVksXHJcbiAgICAgICAgICAgIHNvdXJjZVdpZHRoLFxyXG4gICAgICAgICAgICBzb3VyY2VIZWlnaHRcclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IFJlc291cmNlIH0gZnJvbSBcIi4vUmVzb3VyY2VcIjtcclxuaW1wb3J0IFA1IGZyb20gJ3A1JztcclxuaW1wb3J0IHsgR2FtZSwgZ2FtZSB9IGZyb20gJy4uLy4uL0dhbWUnO1xyXG5pbXBvcnQgeyBUaWxlVHlwZSB9IGZyb20gXCIuLi8uLi8uLi9nbG9iYWwvVGlsZVwiXHJcbmltcG9ydCB7IFdvcmxkVGlsZXMgfSBmcm9tIFwiLi4vLi4vd29ybGQvV29ybGRUaWxlc1wiO1xyXG5pbXBvcnQgcDUgZnJvbSBcInA1XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG5cclxuICAgIGltYWdlOiBQNS5JbWFnZTtcclxuICAgIGhhc1JlZmxlY3Rpb246IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHJlZmxlY3Rpb246IFA1LkltYWdlO1xyXG4gICAgcmVmbGVjdGl2aXR5QXJyYXk6IG51bWJlcltdID0gWzAsIDkwLCAxNTAsIDAsIDEwLCAxNSwgMTcsIDE5LCAyMSwgMjMsIDI1LCAyNywgMjksIDMxLCAxMCwgMTcsIDIxLCAyNSwgMjksIDUsIDUsIDUsIDUsIDUsIDUsIDUsIDUsIDUsIDVdO1xyXG4gICAgc2NhcmZDb2xvcjE/OiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXVxyXG4gICAgc2NhcmZDb2xvcjI/OiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBhdGg6IHN0cmluZywgc2NhcmZDb2xvcjE/OiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSwgc2NhcmZDb2xvcjI/OiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSkge1xyXG4gICAgICAgIHN1cGVyKHBhdGgpXHJcbiAgICAgICAgdGhpcy5zY2FyZkNvbG9yMSA9IHNjYXJmQ29sb3IxO1xyXG4gICAgICAgIHRoaXMuc2NhcmZDb2xvcjIgPSBzY2FyZkNvbG9yMjtcclxuICAgIH1cclxuXHJcbiAgICBsb2FkUmVzb3VyY2UoZ2FtZTogUDUpIHtcclxuICAgICAgICB0aGlzLmltYWdlID0gZ2FtZS5sb2FkSW1hZ2UodGhpcy5wYXRoLCAoKT0+e1xyXG4gICAgICAgICAgICBpZih0aGlzLnNjYXJmQ29sb3IxIT11bmRlZmluZWQgJiYgdGhpcy5zY2FyZkNvbG9yMiE9dW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmltYWdlLmxvYWRQaXhlbHMoKTtcclxuICAgICAgICAgICAgICAgIGZvcihsZXQgaSA9IDA7IGk8dGhpcy5pbWFnZS53aWR0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yKGxldCBqID0gMDsgajx0aGlzLmltYWdlLmhlaWdodDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwID0gdGhpcy5pbWFnZS5nZXQoaSwgaik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHBbMF0gPT09IDE2Nikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImNvbG9yMVwiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbWFnZS5zZXQoaSwgaiwgdGhpcy5zY2FyZkNvbG9yMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZihwWzBdID09PSAxNTUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJjb2xvcjJcIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW1hZ2Uuc2V0KGksIGosIHRoaXMuc2NhcmZDb2xvcjIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UodGhpcy5pbWFnZS5zZXQoaSwgaiwgcCkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vdGhpcy5pbWFnZS5zZXQoMywgMTAsIFswLCAyNTUsIDAsIDI1NV0pOy8vdGVzdCBwaXhlbFxyXG4gICAgICAgICAgICAgICAgdGhpcy5pbWFnZS51cGRhdGVQaXhlbHMoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmxvYWRSZWZsZWN0aW9uKGdhbWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJlZGVmaW5lU2NhcmZDb2xvcihzY2FyZkNvbG9yMTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0sIHNjYXJmQ29sb3IyOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSkge1xyXG4gICAgICAgIHRoaXMuc2NhcmZDb2xvcjEgPSBzY2FyZkNvbG9yMTtcclxuICAgICAgICB0aGlzLnNjYXJmQ29sb3IyID0gc2NhcmZDb2xvcjI7XHJcbiAgICAgICAgdGhpcy5pbWFnZS5sb2FkUGl4ZWxzKCk7XHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaTx0aGlzLmltYWdlLndpZHRoOyBpKyspIHtcclxuICAgICAgICAgICAgZm9yKGxldCBqID0gMDsgajx0aGlzLmltYWdlLmhlaWdodDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcCA9IHRoaXMuaW1hZ2UuZ2V0KGksIGopO1xyXG4gICAgICAgICAgICAgICAgaWYocFswXSA9PT0gMTY2KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImNvbG9yMVwiKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW1hZ2Uuc2V0KGksIGosIHRoaXMuc2NhcmZDb2xvcjEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZihwWzBdID09PSAxNTUpIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiY29sb3IyXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbWFnZS5zZXQoaSwgaiwgdGhpcy5zY2FyZkNvbG9yMik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlKHRoaXMuaW1hZ2Uuc2V0KGksIGosIHApKVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy90aGlzLmltYWdlLnNldCgzLCAxMCwgWzAsIDI1NSwgMCwgMjU1XSk7Ly90ZXN0IHBpeGVsXHJcbiAgICAgICAgdGhpcy5pbWFnZS51cGRhdGVQaXhlbHMoKTtcclxuICAgICAgICB0aGlzLmxvYWRSZWZsZWN0aW9uKGdhbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWRSZWZsZWN0aW9uKGdhbWU6IFA1KSB7XHJcbiAgICAgICAgdGhpcy5oYXNSZWZsZWN0aW9uID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnJlZmxlY3Rpb24gPSBnYW1lLmNyZWF0ZUltYWdlKHRoaXMuaW1hZ2Uud2lkdGgsIHRoaXMuaW1hZ2UuaGVpZ2h0KTtcclxuICAgICAgICB0aGlzLmltYWdlLmxvYWRQaXhlbHMoKTtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKHRoaXMuaW1hZ2UucGl4ZWxzKVxyXG4gICAgICAgIHRoaXMucmVmbGVjdGlvbi5sb2FkUGl4ZWxzKCk7XHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaTx0aGlzLnJlZmxlY3Rpb24ud2lkdGg7IGkrKykgey8vZ2VuZXJhdGUgYSByZWZsZWN0aW9uIGltYWdlIHRoYXQgaXMgZGlzcGxheWVkIGFzIGEgcmVmbGVjdGlvblxyXG4gICAgICAgICAgICBmb3IobGV0IGogPSAwOyBqPHRoaXMucmVmbGVjdGlvbi5oZWlnaHQ7IGorKykge1xyXG4gICAgICAgICAgICAgICAgZm9yKGxldCBrID0gMDsgazwzOyBrKyspIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlZmxlY3Rpb24ucGl4ZWxzWzQqKGoqdGhpcy5yZWZsZWN0aW9uLndpZHRoK2kpK2tdID0gdGhpcy5pbWFnZS5waXhlbHNbNCooKHRoaXMuaW1hZ2UuaGVpZ2h0LWotMSkqdGhpcy5pbWFnZS53aWR0aCtpKStrXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMucmVmbGVjdGlvbi5waXhlbHNbNCooaip0aGlzLnJlZmxlY3Rpb24ud2lkdGgraSkrM10gPSBcclxuICAgICAgICAgICAgICAgIHRoaXMuaW1hZ2UucGl4ZWxzWzQqKCh0aGlzLmltYWdlLmhlaWdodC1qLTEpKnRoaXMuaW1hZ2Uud2lkdGgraSkrM10gKiBcclxuICAgICAgICAgICAgICAgICgodGhpcy5yZWZsZWN0aW9uLmhlaWdodC1qKS90aGlzLnJlZmxlY3Rpb24uaGVpZ2h0KSAqIFxyXG4gICAgICAgICAgICAgICAgKHRoaXMucmVmbGVjdGlvbi53aWR0aC8yKzAuNS1NYXRoLmFicyhpLXRoaXMucmVmbGVjdGlvbi53aWR0aC8yKzAuNSkpLyh0aGlzLnJlZmxlY3Rpb24ud2lkdGgvMikgKiBNYXRoLm1pbigxLCAyOCoyOC90aGlzLnJlZmxlY3Rpb24uaGVpZ2h0L3RoaXMucmVmbGVjdGlvbi5oZWlnaHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucmVmbGVjdGlvbi51cGRhdGVQaXhlbHMoKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIodGFyZ2V0OiBhbnksIHg6IG51bWJlciwgeTogbnVtYmVyLCB3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcikge1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coV29ybGRUaWxlcyk7XHJcbiAgICAgICAgLy8gVmVyaWZ5IHRoYXQgdGhlIGltYWdlIGhhcyBiZWVuIGxvYWRlZFxyXG4gICAgICAgIGlmICh0aGlzLmltYWdlID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcclxuICAgICAgICAgICAgICAgIGBUcmllZCB0byByZW5kZXIgaW1hZ2UgYmVmb3JlIGxvYWRpbmcgaXQ6ICR7dGhpcy5wYXRofWBcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgLy8gRHJhdyBub24gdGlsZXMgaW1hZ2VcclxuICAgICAgICB0YXJnZXQuaW1hZ2UodGhpcy5pbWFnZSwgeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyUm90YXRlZCh0YXJnZXQ6IGFueSwgeDogbnVtYmVyLCB5OiBudW1iZXIsIHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyLCByb3RhdGlvbjogbnVtYmVyKSB7XHJcbiAgICAgICAgLy8gVmVyaWZ5IHRoYXQgdGhlIHRpbGVzIGhhcyBiZWVuIGxvYWRlZFxyXG4gICAgICAgIGlmICh0aGlzLmltYWdlID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcclxuICAgICAgICAgICAgICAgIGBUcmllZCB0byByZW5kZXIgaW1hZ2UgYmVmb3JlIGxvYWRpbmcgaXQ6ICR7dGhpcy5wYXRofWBcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgLy8gRHJhdyBub24gdGlsZXMgaW1hZ2VcclxuICAgICAgICB0YXJnZXQucHVzaCgpXHJcbiAgICAgICAgdGFyZ2V0LnRyYW5zbGF0ZSgtd2lkdGgvMiwgLWhlaWdodC8yKTtcclxuICAgICAgICB0YXJnZXQucm90YXRlKHJvdGF0aW9uKTtcclxuICAgICAgICB0YXJnZXQuaW1hZ2UodGhpcy5pbWFnZSwgeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgdGFyZ2V0LnBvcCgpXHJcbiAgICB9XHJcbiAgICBcclxuICAgIHJlbmRlcldvcmxkc3BhY2VSZWZsZWN0aW9uKHRhcmdldDogcDUsIHg6IG51bWJlciwgeTogbnVtYmVyLCB3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcikge1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuaGFzUmVmbGVjdGlvbilcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5yZWZsZWN0aW9uID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcclxuICAgICAgICAgICAgICAgIGBUcmllZCB0byByZW5kZXIgcmVmbGVjdGlvbiBvZiBpbWFnZSBiZWZvcmUgbG9hZGluZyBpdDogJHt0aGlzLnBhdGh9YFxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAvL2xvb3AgdGhyb3VnaCBldmVyeSB0aWxlIGl0IHBhc3NlcyB0aHJvdWdoXHJcbiAgICAgICAgZm9yKGxldCBpID0gTWF0aC5mbG9vcih4KTsgaTx4K3dpZHRoOyBpKyspIHtcclxuICAgICAgICAgICAgZm9yKGxldCBqID0gTWF0aC5mbG9vcih5KTsgajx5K2hlaWdodDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0YXJnZXQud29ybGQud29ybGRUaWxlcyk7XHJcbiAgICAgICAgICAgICAgICBsZXQgY3VycmVudEJsb2NrOiBUaWxlVHlwZSB8IHN0cmluZztcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRCbG9jayA9IGdhbWUud29ybGQud29ybGRUaWxlc1tqICogZ2FtZS53b3JsZFdpZHRoICsgaV07XHJcbiAgICAgICAgICAgICAgICBpZihjdXJyZW50QmxvY2sgPT09IHVuZGVmaW5lZCB8fCB0eXBlb2YgY3VycmVudEJsb2NrID09PSBcInN0cmluZ1wiIHx8IGN1cnJlbnRCbG9jayA9PSBUaWxlVHlwZS5BaXIpIHsvL3RoZSByZWZlcmVuY2UgdG8gVGlsZUVudGl0eSBjYW4gYmUgcmVtb3ZlZCBhcyBzb29uIGFzIHRoZSBiZXR0ZXIgc3lzdGVtIGlzIGluIHBsYWNlXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQuZHJhd2luZ0NvbnRleHQuZ2xvYmFsQWxwaGEgPSB0aGlzLnJlZmxlY3Rpdml0eUFycmF5W2N1cnJlbnRCbG9ja10vMjU1Oy8vVE9ETyBtYWtlIHRoaXMgYmFzZWQgb24gdGhlIHRpbGUgcmVmbGVjdGl2aXR5XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQuaW1hZ2UoXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWZsZWN0aW9uLFxyXG4gICAgICAgICAgICAgICAgICAgIChpICogZ2FtZS5USUxFX1dJRFRIIC1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2FtZS5pbnRlcnBvbGF0ZWRDYW1YICogZ2FtZS5USUxFX1dJRFRIKSAqXHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgKGogKiBnYW1lLlRJTEVfSEVJR0hUIC1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdhbWUuaW50ZXJwb2xhdGVkQ2FtWSAqIGdhbWUuVElMRV9IRUlHSFQpICpcclxuICAgICAgICAgICAgICAgICAgICBnYW1lLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICAgICAgICAgIGdhbWUuVElMRV9XSURUSCpnYW1lLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICAgICAgICAgIGdhbWUuVElMRV9IRUlHSFQqZ2FtZS51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICAoaS14KSpnYW1lLlRJTEVfV0lEVEgsXHJcbiAgICAgICAgICAgICAgICAgICAgKGoteSkqZ2FtZS5USUxFX0hFSUdIVCxcclxuICAgICAgICAgICAgICAgICAgICBnYW1lLlRJTEVfV0lEVEgsXHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS5USUxFX0hFSUdIVFxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIHRhcmdldC5kcmF3aW5nQ29udGV4dC5nbG9iYWxBbHBoYSA9IDEuMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZW5kZXJSZWZsZWN0aW9uKHRhcmdldDogcDUsIHg6IG51bWJlciwgeTogbnVtYmVyLCB3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlciwgd29ybGRUaWxlczogKHN0cmluZyB8IFRpbGVUeXBlKVtdKSB7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5oYXNSZWZsZWN0aW9uKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnJlZmxlY3Rpb24gPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxyXG4gICAgICAgICAgICAgICAgYFRyaWVkIHRvIHJlbmRlciByZWZsZWN0aW9uIG9mIGltYWdlIGJlZm9yZSBsb2FkaW5nIGl0OiAke3RoaXMucGF0aH1gXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIC8vbG9vcCB0aHJvdWdoIGV2ZXJ5IHRpbGUgaXQgcGFzc2VzIHRocm91Z2hcclxuICAgICAgICBmb3IobGV0IGkgPSBNYXRoLmZsb29yKHgpOyBpPHgrd2lkdGg7IGkrKykge1xyXG4gICAgICAgICAgICBmb3IobGV0IGogPSBNYXRoLmZsb29yKHkpOyBqPHkraGVpZ2h0OyBqKyspIHtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHRhcmdldC53b3JsZC53b3JsZFRpbGVzKTtcclxuICAgICAgICAgICAgICAgIGxldCBjdXJyZW50QmxvY2s6IFRpbGVUeXBlIHwgc3RyaW5nO1xyXG4gICAgICAgICAgICAgICAgY3VycmVudEJsb2NrID0gd29ybGRUaWxlc1tqICogZ2FtZS53b3JsZFdpZHRoICsgaV07XHJcbiAgICAgICAgICAgICAgICBpZihjdXJyZW50QmxvY2sgPT09IHVuZGVmaW5lZCB8fCB0eXBlb2YgY3VycmVudEJsb2NrID09PSBcInN0cmluZ1wiIHx8IGN1cnJlbnRCbG9jayA9PSBUaWxlVHlwZS5BaXIpIHsvL3RoZSByZWZlcmVuY2UgdG8gVGlsZUVudGl0eSBjYW4gYmUgcmVtb3ZlZCBhcyBzb29uIGFzIHRoZSBiZXR0ZXIgc3lzdGVtIGlzIGluIHBsYWNlXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQuZHJhd2luZ0NvbnRleHQuZ2xvYmFsQWxwaGEgPSB0aGlzLnJlZmxlY3Rpdml0eUFycmF5W2N1cnJlbnRCbG9ja10vMjU1Oy8vVE9ETyBtYWtlIHRoaXMgYmFzZWQgb24gdGhlIHRpbGUgcmVmbGVjdGl2aXR5XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQuaW1hZ2UoXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWZsZWN0aW9uLFxyXG4gICAgICAgICAgICAgICAgICAgIGkgKiBnYW1lLlRJTEVfV0lEVEgsXHJcbiAgICAgICAgICAgICAgICAgICAgaipnYW1lLlRJTEVfSEVJR0hULFxyXG4gICAgICAgICAgICAgICAgICAgIGdhbWUuVElMRV9XSURUSCxcclxuICAgICAgICAgICAgICAgICAgICBnYW1lLlRJTEVfSEVJR0hULFxyXG4gICAgICAgICAgICAgICAgICAgIChpLXgpKmdhbWUuVElMRV9XSURUSCxcclxuICAgICAgICAgICAgICAgICAgICAoai15KSpnYW1lLlRJTEVfSEVJR0hULFxyXG4gICAgICAgICAgICAgICAgICAgIGdhbWUuVElMRV9XSURUSCxcclxuICAgICAgICAgICAgICAgICAgICBnYW1lLlRJTEVfSEVJR0hUXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0LmRyYXdpbmdDb250ZXh0Lmdsb2JhbEFscGhhID0gMS4wO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlclBhcnRpYWwoXHJcbiAgICAgICAgdGFyZ2V0OiBhbnksXHJcbiAgICAgICAgeDogbnVtYmVyLFxyXG4gICAgICAgIHk6IG51bWJlcixcclxuICAgICAgICB3aWR0aDogbnVtYmVyLFxyXG4gICAgICAgIGhlaWdodDogbnVtYmVyLFxyXG4gICAgICAgIHNvdXJjZVg/OiBudW1iZXIsXHJcbiAgICAgICAgc291cmNlWT86IG51bWJlcixcclxuICAgICAgICBzb3VyY2VXaWR0aD86IG51bWJlcixcclxuICAgICAgICBzb3VyY2VIZWlnaHQ/OiBudW1iZXJcclxuICAgICkge1xyXG4gICAgICAgIC8vIFZlcmlmeSB0aGF0IHRoZSB0aWxlcyBoYXMgYmVlbiBsb2FkZWRcclxuICAgICAgICBpZiAodGhpcy5pbWFnZSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAgICAgICAgICAgICBgVHJpZWQgdG8gcmVuZGVyIGltYWdlIGJlZm9yZSBsb2FkaW5nIGl0OiAke3RoaXMucGF0aH1gXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIC8vIERyYXcgYSBwYXJ0aWFsIHBhcnQgb2YgdGhlIGltYWdlXHJcbiAgICAgICAgdGFyZ2V0LmltYWdlKFxyXG4gICAgICAgICAgICB0aGlzLmltYWdlLFxyXG4gICAgICAgICAgICB4LFxyXG4gICAgICAgICAgICB5LFxyXG4gICAgICAgICAgICB3aWR0aCxcclxuICAgICAgICAgICAgaGVpZ2h0LFxyXG4gICAgICAgICAgICBzb3VyY2VYLFxyXG4gICAgICAgICAgICBzb3VyY2VZLFxyXG4gICAgICAgICAgICBzb3VyY2VXaWR0aCxcclxuICAgICAgICAgICAgc291cmNlSGVpZ2h0XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufSIsImltcG9ydCBQNSBmcm9tICdwNSc7XHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUmVzb3VyY2Uge1xyXG4gICAgcGF0aDogc3RyaW5nO1xyXG5cclxuICAgIHByb3RlY3RlZCBjb25zdHJ1Y3RvcihwYXRoOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLnBhdGggPSBwYXRoO1xyXG4gICAgfVxyXG5cclxuICAgIGFic3RyYWN0IGxvYWRSZXNvdXJjZShza2V0Y2g6IFA1KTogdm9pZDtcclxufVxyXG4iLCJpbXBvcnQgeyBJbWFnZVJlc291cmNlIH0gZnJvbSAnLi9JbWFnZVJlc291cmNlJztcclxuXHJcbmV4cG9ydCBjbGFzcyBUaWxlUmVzb3VyY2UgZXh0ZW5kcyBJbWFnZVJlc291cmNlIHtcclxuICAgIC8vIFRoZSB3aWR0aCBhbmQgaGVpZ2h0IG9mIHRoZSB0aWxlcyBzZXRcclxuICAgIHdpZHRoOiBudW1iZXI7XHJcbiAgICBoZWlnaHQ6IG51bWJlcjtcclxuXHJcbiAgICAvLyBUaGUgd2lkdGggYW5kIGhlaWdodCBvZiBlYWNoIHRpbGVzIGluIHBpeGVsc1xyXG4gICAgdGlsZVdpZHRoOiBudW1iZXI7XHJcbiAgICB0aWxlSGVpZ2h0OiBudW1iZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcGF0aDogc3RyaW5nLFxyXG4gICAgICAgIHdpZHRoOiBudW1iZXIsXHJcbiAgICAgICAgaGVpZ2h0OiBudW1iZXIsXHJcbiAgICAgICAgdGlsZVdpZHRoOiBudW1iZXIsXHJcbiAgICAgICAgdGlsZUhlaWdodDogbnVtYmVyXHJcbiAgICApIHtcclxuICAgICAgICBzdXBlcihwYXRoKTtcclxuICAgICAgICB0aGlzLndpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICAgICAgdGhpcy50aWxlV2lkdGggPSB0aWxlV2lkdGg7XHJcbiAgICAgICAgdGhpcy50aWxlSGVpZ2h0ID0gdGlsZUhlaWdodDtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXJUaWxlKFxyXG4gICAgICAgIGk6IG51bWJlcixcclxuICAgICAgICB0YXJnZXQ6IGFueSxcclxuICAgICAgICB4OiBudW1iZXIsXHJcbiAgICAgICAgeTogbnVtYmVyLFxyXG4gICAgICAgIHdpZHRoOiBudW1iZXIsXHJcbiAgICAgICAgaGVpZ2h0OiBudW1iZXJcclxuICAgICkge1xyXG4gICAgICAgIGNvbnN0IHRpbGVTZXRYID0gaSAlIHRoaXMud2lkdGg7XHJcbiAgICAgICAgY29uc3QgdGlsZVNldFkgPSBNYXRoLmZsb29yKGkgLyB0aGlzLndpZHRoKTtcclxuXHJcbiAgICAgICAgLy8gTWFrZSBzdXJlIHRoZSB0aWxlcyBpc24ndCBvdXQgb2YgYm91bmRzXHJcbiAgICAgICAgaWYgKHRpbGVTZXRZID4gdGhpcy5oZWlnaHQpXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcclxuICAgICAgICAgICAgICAgIGBPdXQgb2YgYm91bmRzIHRpbGUuIFRyaWVkIHRvIHJlbmRlciB0aWxlIGluZGV4ICR7aX0gd2l0aCBhIG1heGltdW0gb2YgJHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLndpZHRoICogdGhpcy5oZWlnaHRcclxuICAgICAgICAgICAgICAgIH0gdGlsZXNgXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIHN1cGVyLnJlbmRlclBhcnRpYWwoXHJcbiAgICAgICAgICAgIHRhcmdldCxcclxuICAgICAgICAgICAgeCxcclxuICAgICAgICAgICAgeSxcclxuICAgICAgICAgICAgd2lkdGgsXHJcbiAgICAgICAgICAgIGhlaWdodCxcclxuICAgICAgICAgICAgdGlsZVNldFggKiB0aGlzLnRpbGVXaWR0aCxcclxuICAgICAgICAgICAgdGlsZVNldFkgKiB0aGlzLnRpbGVIZWlnaHQsXHJcbiAgICAgICAgICAgIHRoaXMudGlsZVdpZHRoLFxyXG4gICAgICAgICAgICB0aGlzLnRpbGVIZWlnaHRcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFRpbGVBdENvb3JkaW5hdGUoXHJcbiAgICAgICAgeDogbnVtYmVyLFxyXG4gICAgICAgIHk6IG51bWJlcixcclxuICAgICAgICB0YXJnZXQ6IGFueSxcclxuICAgICAgICB4UG9zOiBudW1iZXIsXHJcbiAgICAgICAgeVBvczogbnVtYmVyLFxyXG4gICAgICAgIHdpZHRoOiBudW1iZXIsXHJcbiAgICAgICAgaGVpZ2h0OiBudW1iZXJcclxuICAgICkge1xyXG4gICAgICAgIGlmICh4ID4gdGhpcy53aWR0aCB8fCB5ID4gdGhpcy5oZWlnaHQgfHwgeCA8IDAgfHwgeSA8IDApXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcclxuICAgICAgICAgICAgICAgIGBPdXQgb2YgYm91bmRzIHRpbGUuIFRyaWVkIHRvIGxvYWQgdGlsZSBhdCAke3h9LCAke3l9IG9uIGEgJHt0aGlzLndpZHRofSwgJHt0aGlzLmhlaWdodH0gZ3JpZGBcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgc3VwZXIucmVuZGVyUGFydGlhbChcclxuICAgICAgICAgICAgdGFyZ2V0LFxyXG4gICAgICAgICAgICB4UG9zLFxyXG4gICAgICAgICAgICB5UG9zLFxyXG4gICAgICAgICAgICB3aWR0aCxcclxuICAgICAgICAgICAgaGVpZ2h0LFxyXG4gICAgICAgICAgICB4ICogdGhpcy50aWxlV2lkdGgsXHJcbiAgICAgICAgICAgIHkgKiB0aGlzLnRpbGVIZWlnaHQsXHJcbiAgICAgICAgICAgIHRoaXMudGlsZVdpZHRoLFxyXG4gICAgICAgICAgICB0aGlzLnRpbGVIZWlnaHRcclxuICAgICAgICApO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGNsYXNzIENvbnRyb2wge1xyXG4gICAga2V5Ym9hcmQ6IGJvb2xlYW5cclxuICAgIGtleUNvZGU6IG51bWJlclxyXG4gICAgZGVzY3JpcHRpb246IHN0cmluZ1xyXG4gICAgb25QcmVzc2VkOiAoKSA9PiB2b2lkXHJcbiAgICBvblJlbGVhc2VkOiAoKSA9PiB2b2lkXHJcblxyXG4gICAgY29uc3RydWN0b3IoZGVzY3JpcHRpb246IHN0cmluZywga2V5Ym9hcmQ6IGJvb2xlYW4sIGtleUNvZGU6IG51bWJlciwgb25QcmVzc2VkOiAoKSA9PiB2b2lkLCBvblJlbGVhc2VkPzogKCkgPT4gdm9pZCkge1xyXG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvblxyXG4gICAgICAgIHRoaXMua2V5Ym9hcmQgPSBrZXlib2FyZDtcclxuICAgICAgICB0aGlzLmtleUNvZGUgPSBrZXlDb2RlO1xyXG4gICAgICAgIHRoaXMub25QcmVzc2VkID0gb25QcmVzc2VkO1xyXG4gICAgICAgIHRoaXMub25SZWxlYXNlZCA9IG9uUmVsZWFzZWQgfHwgZnVuY3Rpb24oKXt9Oy8vZm9yIHNvbWUgcmVhc29uIGFycm93IGZ1bmN0aW9uIGRvZXNuJ3QgbGlrZSB0byBleGlzdCBoZXJlIGJ1dCBpJ20gbm90IGdvbm5hIHdvcnJ5IHRvbyBtdWNoXHJcbiAgICAgICAgLy9pZiBpdCdzIHRvbyB1Z2x5LCB5b3UgY2FuIHRyeSB0byBmaXggaXRcclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgeyBDYXRlZ29yeURhdGEsIEludmVudG9yeVBheWxvYWQsIEl0ZW1DYXRlZ29yaWVzLCBJdGVtcywgSXRlbVN0YWNrLCBJdGVtVHlwZSB9IGZyb20gJy4uLy4uL2dsb2JhbC9JbnZlbnRvcnknO1xyXG5pbXBvcnQgeyBUaWxlVHlwZSB9IGZyb20gJy4uLy4uL2dsb2JhbC9UaWxlJztcclxuaW1wb3J0IHsgZ2FtZSB9IGZyb20gJy4uL0dhbWUnO1xyXG5pbXBvcnQgeyBDb2xvclBhcnRpY2xlIH0gZnJvbSAnLi4vd29ybGQvcGFydGljbGVzL0NvbG9yUGFydGljbGUnO1xyXG5pbXBvcnQgeyBXb3JsZFRpbGVzIH0gZnJvbSAnLi4vd29ybGQvV29ybGRUaWxlcyc7XHJcblxyXG5leHBvcnQgY2xhc3MgSW52ZW50b3J5IHtcclxuXHJcblx0aXRlbXM6IChJdGVtU3RhY2sgfCB1bmRlZmluZWQgfCBudWxsKVtdO1xyXG5cclxuXHR3aWR0aDogbnVtYmVyO1xyXG5cdGhlaWdodDogbnVtYmVyO1xyXG5cclxuXHRzZWxlY3RlZFNsb3Q6IG51bWJlciA9IDBcclxuXHRwaWNrZWRVcFNsb3Q6IG51bWJlciB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZFxyXG5cclxuXHRjb25zdHJ1Y3RvcihpbnZlbnRvcnk6IEludmVudG9yeVBheWxvYWQpIHtcclxuXHRcdHRoaXMuaXRlbXMgPSBpbnZlbnRvcnkuaXRlbXNcclxuXHRcdHRoaXMud2lkdGggPSBpbnZlbnRvcnkud2lkdGhcclxuXHRcdHRoaXMuaGVpZ2h0ID0gaW52ZW50b3J5LmhlaWdodFxyXG5cdH1cclxuXHJcblx0d29ybGRDbGljayh4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG5cdFx0Y29uc3Qgc2VsZWN0ZWRJdGVtID0gdGhpcy5pdGVtc1t0aGlzLnNlbGVjdGVkU2xvdF1cclxuXHRcdGlmKHNlbGVjdGVkSXRlbSA9PT0gdW5kZWZpbmVkIHx8IHNlbGVjdGVkSXRlbSA9PT0gbnVsbCkge1xyXG5cdFx0XHQvL2NvbnNvbGUuZXJyb3IoXCJCcmVha2luZyB0aWxlXCIpXHJcblx0XHRcdGxldCB0aWxlQmVpbmdCcm9rZW4gPSBnYW1lLndvcmxkLndvcmxkVGlsZXNbZ2FtZS53b3JsZC53aWR0aCAqIHkgKyB4XTtcclxuXHRcdFx0aWYodHlwZW9mIHRpbGVCZWluZ0Jyb2tlbiA9PT0gJ251bWJlcicpIHtcclxuXHRcdFx0XHRsZXQgd29ybGRUaWxlQmVpbmdCcm9rZW4gPSBXb3JsZFRpbGVzW3RpbGVCZWluZ0Jyb2tlbl1cclxuXHRcdFx0XHRmb3IobGV0IGkgPSAwOyBpPDUqZ2FtZS5wYXJ0aWNsZU11bHRpcGxpZXI7IGkrKykge1xyXG5cdFx0XHRcdFx0aWYgKHdvcmxkVGlsZUJlaW5nQnJva2VuICE9PSB1bmRlZmluZWQpXHJcblx0XHRcdFx0XHRnYW1lLnBhcnRpY2xlcy5wdXNoKG5ldyBDb2xvclBhcnRpY2xlKHdvcmxkVGlsZUJlaW5nQnJva2VuLmNvbG9yLCBNYXRoLnJhbmRvbSgpKjAuMiswLjEsIDEwLCB4K01hdGgucmFuZG9tKCksIHkrTWF0aC5yYW5kb20oKSwgMC4yKihNYXRoLnJhbmRvbSgpLTAuNSksIC0wLjE1Kk1hdGgucmFuZG9tKCkpKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRnYW1lLmNvbm5lY3Rpb24uZW1pdChcclxuXHRcdFx0XHQnd29ybGRCcmVha1N0YXJ0JyxcclxuXHRcdFx0XHRnYW1lLndvcmxkLndpZHRoICogeSArIHhcclxuXHRcdFx0KTtcclxuXHRcdFx0aWYodHlwZW9mIHRpbGVCZWluZ0Jyb2tlbiA9PT0gXCJudW1iZXJcIiAmJiBXb3JsZFRpbGVzW3RpbGVCZWluZ0Jyb2tlbl0/LmJyZWFrU291bmQhPT11bmRlZmluZWQpIHtcclxuXHRcdFx0XHQvL2NvbnNvbGUubG9nKCh4LWdhbWUuaW50ZXJwb2xhdGVkQ2FtWCkrXCIrXCIrKGdhbWUud2lkdGgvZ2FtZS5USUxFX1dJRFRIL2dhbWUudXBzY2FsZVNpemUpK1wiPVwiKyh4LWdhbWUuaW50ZXJwb2xhdGVkQ2FtWC1nYW1lLndpZHRoL2dhbWUuVElMRV9XSURUSC9nYW1lLnVwc2NhbGVTaXplKSk7XHJcblx0XHRcdFx0V29ybGRUaWxlc1t0aWxlQmVpbmdCcm9rZW5dPy5icmVha1NvdW5kPy5wbGF5UmFuZG9tKCh4LWdhbWUuaW50ZXJwb2xhdGVkQ2FtWC1nYW1lLndpZHRoL2dhbWUuVElMRV9XSURUSC9nYW1lLnVwc2NhbGVTaXplLzIpLzIwKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRnYW1lLmNvbm5lY3Rpb24uZW1pdCgnd29ybGRCcmVha0ZpbmlzaCcpO1xyXG5cdFx0XHRyZXR1cm5cclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCB3b3JsZENsaWNrID0gSXRlbUFjdGlvbnNbSXRlbXNbc2VsZWN0ZWRJdGVtLml0ZW1dLnR5cGVdLndvcmxkQ2xpY2tcclxuXHRcdGlmKHdvcmxkQ2xpY2sgPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRjb25zb2xlLmVycm9yKFwiQ2Fubm90IHBsYWNlIHNlbGVjdGVkIGl0ZW1cIilcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblxyXG5cdFx0d29ybGRDbGljayh4LCB5KVxyXG5cdH1cclxuXHR3b3JsZENsaWNrQ2hlY2soeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuXHRcdGxldCB0aWxlQmVpbmdCcm9rZW4gPSBnYW1lLndvcmxkLndvcmxkVGlsZXNbZ2FtZS53b3JsZC53aWR0aCAqIHkgKyB4XTtcclxuXHRcdGlmKHR5cGVvZiB0aWxlQmVpbmdCcm9rZW4gPT09ICdudW1iZXInKSB7XHJcblx0XHRcdGlmICh0aWxlQmVpbmdCcm9rZW4gPT09IFRpbGVUeXBlLkFpcikgZ2FtZS5icmVha2luZyA9IGZhbHNlO1xyXG5cdFx0XHRlbHNlIGdhbWUuYnJlYWtpbmcgPSB0cnVlO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuaW50ZXJmYWNlIEl0ZW1CYXNlIHtcclxuXHR3b3JsZENsaWNrPzogKHg6IG51bWJlciwgeTogbnVtYmVyKSA9PiB2b2lkXHJcbn1cclxuXHJcbmNvbnN0IEl0ZW1BY3Rpb25zOiBSZWNvcmQ8SXRlbUNhdGVnb3JpZXMsIEl0ZW1CYXNlPiA9IHtcclxuXHRbSXRlbUNhdGVnb3JpZXMuVGlsZV06IHtcclxuXHRcdHdvcmxkQ2xpY2soeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuXHRcdFx0Ly8gSWYgdGhlIHRpbGUgaXNuJ3QgYWlyXHJcblx0XHRcdGlmIChcclxuXHRcdFx0XHRnYW1lLndvcmxkLndvcmxkVGlsZXNbXHJcblx0XHRcdFx0Z2FtZS53b3JsZC53aWR0aCAqIHkgKyB4XHJcblx0XHRcdFx0XHRdICE9PSBUaWxlVHlwZS5BaXJcclxuXHRcdFx0KSB7XHJcblxyXG5cdFx0XHRcdGxldCB0aWxlQmVpbmdCcm9rZW4gPSBnYW1lLndvcmxkLndvcmxkVGlsZXNbZ2FtZS53b3JsZC53aWR0aCAqIHkgKyB4XTtcclxuXHRcdFx0XHRpZih0eXBlb2YgdGlsZUJlaW5nQnJva2VuID09PSAnbnVtYmVyJykgey8vdGlsZSBpcyB0aWxlXHJcblx0XHRcdFx0XHRpZiAoIWdhbWUuYnJlYWtpbmcgfHwgZ2FtZS5icm9rZW5UaWxlc1F1ZXVlLmluY2x1ZGVzKGdhbWUud29ybGQud2lkdGggKiB5ICsgeCkpIHJldHVybjtcclxuXHRcdFx0XHRcdGdhbWUuYnJva2VuVGlsZXNRdWV1ZS5wdXNoKGdhbWUud29ybGQud2lkdGgqeSt4KVxyXG5cdFx0XHRcdFx0bGV0IHdvcmxkVGlsZUJlaW5nQnJva2VuID0gV29ybGRUaWxlc1t0aWxlQmVpbmdCcm9rZW5dXHJcblx0XHRcdFx0XHRmb3IobGV0IGkgPSAwOyBpPDUqZ2FtZS5wYXJ0aWNsZU11bHRpcGxpZXI7IGkrKykge1xyXG5cdFx0XHRcdFx0XHRpZiAod29ybGRUaWxlQmVpbmdCcm9rZW4gIT09IHVuZGVmaW5lZClcclxuXHRcdFx0XHRcdFx0Z2FtZS5wYXJ0aWNsZXMucHVzaChuZXcgQ29sb3JQYXJ0aWNsZSh3b3JsZFRpbGVCZWluZ0Jyb2tlbi5jb2xvciwgTWF0aC5yYW5kb20oKSowLjIrMC4xLCAxMCwgeCtNYXRoLnJhbmRvbSgpLCB5K01hdGgucmFuZG9tKCksIDAuMiooTWF0aC5yYW5kb20oKS0wLjUpLCAtMC4xNSpNYXRoLnJhbmRvbSgpKSlcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGNvbnNvbGUuaW5mbygnYnJlYWtpbmcnKTtcclxuXHRcdFx0XHRcdGdhbWUuY29ubmVjdGlvbi5lbWl0KFxyXG5cdFx0XHRcdFx0XHQnd29ybGRCcmVha1N0YXJ0JyxcclxuXHRcdFx0XHRcdFx0Z2FtZS53b3JsZC53aWR0aCAqIHkgKyB4XHJcblx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdFx0Z2FtZS5jb25uZWN0aW9uLmVtaXQoXHJcblx0XHRcdFx0XHRcdCd3b3JsZEJyZWFrRmluaXNoJ1xyXG5cdFx0XHRcdFx0KTtcclxuXHRcdFx0XHRcdFdvcmxkVGlsZXNbdGlsZUJlaW5nQnJva2VuXT8uYnJlYWtTb3VuZD8ucGxheVJhbmRvbSh4VG9TdGVyZW8oeCkpO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHsvL3RpbGUgaXMgdGlsZSBlbnRpdHlcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwidGlsZSBlbnRpdHkgaW50ZXJhY3RcIilcclxuXHRcdFx0XHRcdGdhbWUuY29ubmVjdGlvbi5lbWl0KFxyXG5cdFx0XHRcdFx0XHQnd29ybGRCcmVha1N0YXJ0JyxcclxuXHRcdFx0XHRcdFx0Z2FtZS53b3JsZC53aWR0aCAqIHkgKyB4XHJcblx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdFx0Z2FtZS5jb25uZWN0aW9uLmVtaXQoXHJcblx0XHRcdFx0XHRcdCd3b3JsZEJyZWFrRmluaXNoJ1xyXG5cdFx0XHRcdFx0KTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0Ly9pZiB0aGUgdGlsZSBpcyBhaXIgYW5kIHRoZSBnYW1lIGlzIHRyeWluZyB0byBwbGFjZVxyXG5cdFx0XHRpZiAoZ2FtZS5icmVha2luZyB8fCBnYW1lLmJyb2tlblRpbGVzUXVldWUuaW5jbHVkZXMoZ2FtZS53b3JsZC53aWR0aCAqIHkgKyB4KSkgcmV0dXJuO1xyXG5cdFx0XHRnYW1lLmJyb2tlblRpbGVzUXVldWUucHVzaChnYW1lLndvcmxkLndpZHRoKnkreClcclxuXHRcdFx0Y29uc29sZS5pbmZvKCdQbGFjaW5nJyk7XHJcblx0XHRcdGxldCBpdGVtVHlwZUJlaW5nSGVsZCA9IGdhbWUud29ybGQuaW52ZW50b3J5Lml0ZW1zW2dhbWUud29ybGQuaW52ZW50b3J5LnNlbGVjdGVkU2xvdF0/Lml0ZW07XHJcblx0XHRcdGlmKGl0ZW1UeXBlQmVpbmdIZWxkPT09dW5kZWZpbmVkKXJldHVybjtcclxuXHRcdFx0XHRcdFx0bGV0IGl0ZW1EYXRhID0gSXRlbXNbaXRlbVR5cGVCZWluZ0hlbGRdO1xyXG5cdFx0XHRcdFx0XHRpZiAoXHJcblx0XHRcdFx0aXRlbURhdGEudHlwZSA9PT0gSXRlbUNhdGVnb3JpZXMuVGlsZVxyXG5cdFx0XHQpIHtcclxuXHRcdFx0XHRpZihXb3JsZFRpbGVzW2l0ZW1EYXRhLnBsYWNlZFRpbGVdPy5wbGFjZVNvdW5kIT09dW5kZWZpbmVkKSBXb3JsZFRpbGVzW2l0ZW1EYXRhLnBsYWNlZFRpbGVdPy5wbGFjZVNvdW5kPy5wbGF5UmFuZG9tKHhUb1N0ZXJlbyh4KSk7XHJcblx0XHRcdFx0ZWxzZSBXb3JsZFRpbGVzW2l0ZW1EYXRhLnBsYWNlZFRpbGVdPy5icmVha1NvdW5kPy5wbGF5UmFuZG9tKHhUb1N0ZXJlbyh4KSlcclxuXHRcdFx0fVxyXG5cdFx0XHRnYW1lLmNvbm5lY3Rpb24uZW1pdChcclxuXHRcdFx0XHQnd29ybGRQbGFjZScsXHJcblx0XHRcdFx0Z2FtZS53b3JsZC5pbnZlbnRvcnkuc2VsZWN0ZWRTbG90LFxyXG5cdFx0XHRcdHgsXHJcblx0XHRcdFx0eVxyXG5cdFx0XHQpO1xyXG5cdFx0XHRcclxuXHRcdH1cclxuXHR9LFxyXG5cdFtJdGVtQ2F0ZWdvcmllcy5SZXNvdXJjZV06IHt9LFxyXG5cdFtJdGVtQ2F0ZWdvcmllcy5Ub29sXToge30sXHJcblx0W0l0ZW1DYXRlZ29yaWVzLlRpbGVFbnRpdHldOiB7XHJcblx0XHR3b3JsZENsaWNrKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcblx0XHRcdGxldCBpdGVtUmVmID0gSXRlbXNbZ2FtZS53b3JsZC5pbnZlbnRvcnkuaXRlbXNbZ2FtZS53b3JsZC5pbnZlbnRvcnkuc2VsZWN0ZWRTbG90XT8uaXRlbSB8fCAwXTtcclxuXHRcdFx0bGV0IG9mZnNldDogW251bWJlciwgbnVtYmVyXSA9IFswLCAwXVxyXG5cdFx0XHRpZihcInRpbGVFbnRpdHlPZmZzZXRcIiBpbiBpdGVtUmVmKSB7XHJcblx0XHRcdFx0b2Zmc2V0ID0gaXRlbVJlZi50aWxlRW50aXR5T2Zmc2V0O1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRnYW1lLmNvbm5lY3Rpb24uZW1pdChcclxuXHRcdFx0XHQnd29ybGRQbGFjZScsXHJcblx0XHRcdFx0Z2FtZS53b3JsZC5pbnZlbnRvcnkuc2VsZWN0ZWRTbG90LFxyXG5cdFx0XHRcdHgsXHJcblx0XHRcdFx0eVxyXG5cdFx0XHQpO1xyXG5cdFx0fVxyXG5cdH0sXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB4VG9TdGVyZW8oeDogbnVtYmVyKSB7XHJcblx0cmV0dXJuICh4LWdhbWUuaW50ZXJwb2xhdGVkQ2FtWC1nYW1lLndpZHRoL2dhbWUuVElMRV9XSURUSC9nYW1lLnVwc2NhbGVTaXplLzIpLzIwXHJcbn0iLCJpbXBvcnQgcDUgZnJvbSAncDUnO1xyXG5pbXBvcnQgeyBFbnRpdGllcywgRW50aXR5UGF5bG9hZCB9IGZyb20gJy4uLy4uL2dsb2JhbC9FbnRpdHknO1xyXG5pbXBvcnQgeyBnYW1lIH0gZnJvbSAnLi4vR2FtZSc7XHJcbmltcG9ydCB7IFNlcnZlckVudGl0eSB9IGZyb20gJy4uL3dvcmxkL2VudGl0aWVzL1NlcnZlckVudGl0eSc7XHJcbi8vIGltcG9ydCB7IENvbG9yUGFydGljbGUgfSBmcm9tICcuLi93b3JsZC8nO1xyXG5pbXBvcnQgeyBBbmltYXRpb25GcmFtZSwgRm9udHMsIFBsYXllckFuaW1hdGlvbnMgfSBmcm9tICcuLi9hc3NldHMvQXNzZXRzJztcclxuaW1wb3J0IHsgVGlsZVR5cGUgfSBmcm9tICcuLi8uLi9nbG9iYWwvVGlsZSc7XHJcbmltcG9ydCB7IFdvcmxkVGlsZXMgfSBmcm9tICcuLi93b3JsZC9Xb3JsZFRpbGVzJztcclxuaW1wb3J0IHsgQ29sb3JQYXJ0aWNsZSB9IGZyb20gJy4uL3dvcmxkL3BhcnRpY2xlcy9Db2xvclBhcnRpY2xlJztcclxuaW1wb3J0IHsgeFRvU3RlcmVvIH0gZnJvbSAnLi9JbnZlbnRvcnknO1xyXG5cclxuZXhwb3J0IGNsYXNzIFBsYXllckxvY2FsIGV4dGVuZHMgU2VydmVyRW50aXR5IHtcclxuICAgIC8vIENvbnN0YW50IGRhdGFcclxuICAgIHdpZHRoOiBudW1iZXIgPSAxMiAvIGdhbWUuVElMRV9XSURUSDtcclxuICAgIGhlaWdodDogbnVtYmVyID0gMjggLyBnYW1lLlRJTEVfSEVJR0hUO1xyXG5cclxuICAgIC8vIFNoYXJlZCBkYXRhXHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcblxyXG4gICAgLy8gTG9jYWwgZGF0YVxyXG4gICAgeFZlbDogbnVtYmVyID0gMDtcclxuICAgIHlWZWw6IG51bWJlciA9IDA7XHJcbiAgICBzbGlkZVg6IG51bWJlcjtcclxuICAgIHNsaWRlWTogbnVtYmVyO1xyXG4gICAgaW50ZXJwb2xhdGVkWDogbnVtYmVyO1xyXG4gICAgaW50ZXJwb2xhdGVkWTogbnVtYmVyO1xyXG5cclxuICAgIHBYOiBudW1iZXI7XHJcbiAgICBwWTogbnVtYmVyO1xyXG4gICAgcFhWZWw6IG51bWJlciA9IDA7XHJcbiAgICBwWVZlbDogbnVtYmVyID0gMDtcclxuXHJcbiAgICBncm91bmRlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcEdyb3VuZGVkOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgY29sbGlzaW9uRGF0YTogYW55O1xyXG4gICAgY2xvc2VzdENvbGxpc2lvbjogW251bWJlciwgbnVtYmVyLCBudW1iZXJdO1xyXG5cclxuICAgIG1hc3M6IG51bWJlciA9IHRoaXMud2lkdGggKiB0aGlzLmhlaWdodDtcclxuXHJcblxyXG4gICAgLy9pbnB1dCBib29sZWFuc1xyXG4gICAgcmlnaHRCdXR0b246IGJvb2xlYW47XHJcbiAgICBsZWZ0QnV0dG9uOiBib29sZWFuO1xyXG4gICAganVtcEJ1dHRvbjogYm9vbGVhbjtcclxuXHJcbiAgICBjb2xvcjE6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdID0gWzAsIDAsIDAsIDI1NV1cclxuICAgIGNvbG9yMjogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPSBbMCwgMCwgMCwgMjU1XVxyXG5cclxuICAgIGN1cnJlbnRBbmltYXRpb246IEFuaW1hdGlvbkZyYW1lPHR5cGVvZiBQbGF5ZXJBbmltYXRpb25zPiA9IFwiaWRsZVwiO1xyXG4gICAgYW5pbUZyYW1lOiBudW1iZXIgPSAwO1xyXG4gICAgdGltZUluVGhpc0FuaW1hdGlvbkZyYW1lID0gMDtcclxuICAgIGZhY2luZ1JpZ2h0ID0gdHJ1ZTtcclxuXHJcbiAgICB0b3BDb2xsaXNpb246ICh0eXBlb2YgV29ybGRUaWxlc1tUaWxlVHlwZS5BaXJdKSA9IFdvcmxkVGlsZXNbVGlsZVR5cGUuQWlyXTsvL2hhY2t5XHJcbiAgICBib3R0b21Db2xsaXNpb246ICh0eXBlb2YgV29ybGRUaWxlc1tUaWxlVHlwZS5BaXJdKSA9IFdvcmxkVGlsZXNbVGlsZVR5cGUuQWlyXTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBkYXRhOiBFbnRpdHlQYXlsb2FkPEVudGl0aWVzLkxvY2FsUGxheWVyPlxyXG4gICAgKSB7XHJcbiAgICAgICAgc3VwZXIoZGF0YS5pZClcclxuXHJcbiAgICAgICAgdGhpcy5uYW1lID0gZGF0YS5kYXRhLm5hbWU7XHJcblxyXG4gICAgICAgIHRoaXMueCA9IGRhdGEuZGF0YS54O1xyXG4gICAgICAgIHRoaXMueSA9IGRhdGEuZGF0YS55O1xyXG5cclxuICAgICAgICB0aGlzLnBYID0gdGhpcy54O1xyXG4gICAgICAgIHRoaXMucFkgPSB0aGlzLnk7XHJcblxyXG4gICAgICAgIHRoaXMuaW50ZXJwb2xhdGVkWCA9IHRoaXMueDtcclxuICAgICAgICB0aGlzLmludGVycG9sYXRlZFkgPSB0aGlzLnk7XHJcblxyXG4gICAgICAgIHRoaXMuY2xvc2VzdENvbGxpc2lvbiA9IFsxLCAwLCBJbmZpbml0eV07XHJcblxyXG4gICAgICAgIHRoaXMubGVmdEJ1dHRvbiA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucmlnaHRCdXR0b24gPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmp1bXBCdXR0b24gPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIodGFyZ2V0OiBwNSwgdXBzY2FsZVNpemU6IG51bWJlcik6IHZvaWQge1xyXG5cclxuICAgICAgICB0aGlzLnRpbWVJblRoaXNBbmltYXRpb25GcmFtZSArPSBnYW1lLmRlbHRhVGltZTtcclxuICAgICAgICBpZiAodGhpcy50aW1lSW5UaGlzQW5pbWF0aW9uRnJhbWUgPiBQbGF5ZXJBbmltYXRpb25zW3RoaXMuY3VycmVudEFuaW1hdGlvbl1bdGhpcy5hbmltRnJhbWVdWzFdKSB7XHJcbiAgICAgICAgICAgIHRoaXMudGltZUluVGhpc0FuaW1hdGlvbkZyYW1lID0gMDsvL3RoaXMgZG9lcyBpbnRyb2R1Y2Ugc29tZSBzbGlnaHQgaW5hY2N1cmFjaWVzIHZzIHN1YnRyYWN0aW5nIGl0LCBidXQsIHdoZW4geW91IHRhYiBiYWNrIGludG8gdGhlIGJyb3dzZXIgYWZ0ZXIgYmVpbmcgdGFiYmVkIG91dCwgc3VidHJhY3RpbmcgaXQgY2F1c2VzIHNwYXp6aW5nXHJcbiAgICAgICAgICAgIHRoaXMuYW5pbUZyYW1lKys7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmFuaW1GcmFtZSA+PSBQbGF5ZXJBbmltYXRpb25zW3RoaXMuY3VycmVudEFuaW1hdGlvbl0ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFuaW1GcmFtZSA9IHRoaXMuYW5pbUZyYW1lICUgUGxheWVyQW5pbWF0aW9uc1t0aGlzLmN1cnJlbnRBbmltYXRpb25dLmxlbmd0aDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gdGFyZ2V0LnJlY3QoXHJcbiAgICAgICAgLy8gICAgICh0aGlzLmludGVycG9sYXRlZFggKiBnYW1lLlRJTEVfV0lEVEggLVxyXG4gICAgICAgIC8vICAgICAgICAgZ2FtZS5pbnRlcnBvbGF0ZWRDYW1YICogZ2FtZS5USUxFX1dJRFRIKSAqXHJcbiAgICAgICAgLy8gICAgICAgICB1cHNjYWxlU2l6ZSxcclxuICAgICAgICAvLyAgICAgKHRoaXMuaW50ZXJwb2xhdGVkWSAqIGdhbWUuVElMRV9IRUlHSFQgLVxyXG4gICAgICAgIC8vICAgICAgICAgZ2FtZS5pbnRlcnBvbGF0ZWRDYW1ZICogZ2FtZS5USUxFX0hFSUdIVCkgKlxyXG4gICAgICAgIC8vICAgICAgICAgdXBzY2FsZVNpemUsXHJcbiAgICAgICAgLy8gICAgIHRoaXMud2lkdGggKiB1cHNjYWxlU2l6ZSAqIGdhbWUuVElMRV9XSURUSCxcclxuICAgICAgICAvLyAgICAgdGhpcy5oZWlnaHQgKiB1cHNjYWxlU2l6ZSAqIGdhbWUuVElMRV9IRUlHSFRcclxuICAgICAgICAvLyApO1xyXG4gICAgICAgIFBsYXllckFuaW1hdGlvbnNbdGhpcy5jdXJyZW50QW5pbWF0aW9uXVt0aGlzLmFuaW1GcmFtZV1bMF0ucmVuZGVyXHJcbiAgICAgICAgICAgIChcclxuICAgICAgICAgICAgICAgIHRhcmdldCxcclxuICAgICAgICAgICAgICAgIE1hdGgucm91bmQoKHRoaXMuaW50ZXJwb2xhdGVkWCAqIGdhbWUuVElMRV9XSURUSCAtXHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS5pbnRlcnBvbGF0ZWRDYW1YICogZ2FtZS5USUxFX1dJRFRIKSAqXHJcbiAgICAgICAgICAgICAgICAgICAgdXBzY2FsZVNpemUpLFxyXG4gICAgICAgICAgICAgICAgTWF0aC5yb3VuZCgodGhpcy5pbnRlcnBvbGF0ZWRZICogZ2FtZS5USUxFX0hFSUdIVCAtXHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS5pbnRlcnBvbGF0ZWRDYW1ZICogZ2FtZS5USUxFX0hFSUdIVCkgKlxyXG4gICAgICAgICAgICAgICAgICAgIHVwc2NhbGVTaXplKSxcclxuICAgICAgICAgICAgICAgIHRoaXMud2lkdGggKiB1cHNjYWxlU2l6ZSAqIGdhbWUuVElMRV9XSURUSCxcclxuICAgICAgICAgICAgICAgIHRoaXMuaGVpZ2h0ICogdXBzY2FsZVNpemUgKiBnYW1lLlRJTEVfSEVJR0hUXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgUGxheWVyQW5pbWF0aW9uc1t0aGlzLmN1cnJlbnRBbmltYXRpb25dW3RoaXMuYW5pbUZyYW1lXVswXS5yZW5kZXJXb3JsZHNwYWNlUmVmbGVjdGlvblxyXG4gICAgICAgICAgICAoXHJcbiAgICAgICAgICAgICAgICBnYW1lLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5pbnRlcnBvbGF0ZWRYLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5pbnRlcnBvbGF0ZWRZICsgdGhpcy5oZWlnaHQsXHJcbiAgICAgICAgICAgICAgICB0aGlzLndpZHRoLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5oZWlnaHRcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgdGFyZ2V0LmZpbGwodGhpcy5jb2xvcjEpO1xyXG4gICAgICAgIHRhcmdldC5ub1N0cm9rZSgpO1xyXG4gICAgICAgIHRhcmdldC5yZWN0KFxyXG4gICAgICAgICAgICAodGhpcy5pbnRlcnBvbGF0ZWRYICogZ2FtZS5USUxFX1dJRFRIIC1cclxuICAgICAgICAgICAgICAgIGdhbWUuaW50ZXJwb2xhdGVkQ2FtWCAqIGdhbWUuVElMRV9XSURUSCArXHJcbiAgICAgICAgICAgICAgICAodGhpcy53aWR0aCAqIGdhbWUuVElMRV9XSURUSCkgLyAyKSAqXHJcbiAgICAgICAgICAgIHVwc2NhbGVTaXplIC0gKHRoaXMubmFtZS5sZW5ndGggKiAyICogZ2FtZS51cHNjYWxlU2l6ZSksXHJcbiAgICAgICAgICAgICh0aGlzLmludGVycG9sYXRlZFkgKiBnYW1lLlRJTEVfSEVJR0hUIC1cclxuICAgICAgICAgICAgICAgIGdhbWUuaW50ZXJwb2xhdGVkQ2FtWSAqIGdhbWUuVElMRV9IRUlHSFQgLVxyXG4gICAgICAgICAgICAgICAgKHRoaXMuaGVpZ2h0ICogZ2FtZS5USUxFX0hFSUdIVCkgLyAyLjUgKyA0KSAqXHJcbiAgICAgICAgICAgIHVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICAodGhpcy5uYW1lLmxlbmd0aCAqIDQgKiBnYW1lLnVwc2NhbGVTaXplKSxcclxuICAgICAgICAgICAgZ2FtZS51cHNjYWxlU2l6ZSk7XHJcblxyXG4gICAgICAgIHRhcmdldC5yZWN0KFxyXG4gICAgICAgICAgICAodGhpcy5pbnRlcnBvbGF0ZWRYICogZ2FtZS5USUxFX1dJRFRIIC1cclxuICAgICAgICAgICAgICAgIGdhbWUuaW50ZXJwb2xhdGVkQ2FtWCAqIGdhbWUuVElMRV9XSURUSCArXHJcbiAgICAgICAgICAgICAgICAodGhpcy53aWR0aCAqIGdhbWUuVElMRV9XSURUSCkgLyAyKSAqXHJcbiAgICAgICAgICAgIHVwc2NhbGVTaXplIC0gKCh0aGlzLm5hbWUubGVuZ3RoICogMiAtIDIpICogZ2FtZS51cHNjYWxlU2l6ZSksXHJcbiAgICAgICAgICAgICh0aGlzLmludGVycG9sYXRlZFkgKiBnYW1lLlRJTEVfSEVJR0hUIC1cclxuICAgICAgICAgICAgICAgIGdhbWUuaW50ZXJwb2xhdGVkQ2FtWSAqIGdhbWUuVElMRV9IRUlHSFQgLVxyXG4gICAgICAgICAgICAgICAgKHRoaXMuaGVpZ2h0ICogZ2FtZS5USUxFX0hFSUdIVCkgLyAyLjUgKyA2KSAqXHJcbiAgICAgICAgICAgIHVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICAoKHRoaXMubmFtZS5sZW5ndGggKiA0IC0gNCkgKiBnYW1lLnVwc2NhbGVTaXplKSxcclxuICAgICAgICAgICAgZ2FtZS51cHNjYWxlU2l6ZSk7XHJcblxyXG4gICAgICAgIEZvbnRzLnRvbV90aHVtYi5kcmF3VGV4dChcclxuICAgICAgICAgICAgZ2FtZSxcclxuICAgICAgICAgICAgdGhpcy5uYW1lLFxyXG4gICAgICAgICAgICAodGhpcy5pbnRlcnBvbGF0ZWRYICogZ2FtZS5USUxFX1dJRFRIIC1cclxuICAgICAgICAgICAgICAgIGdhbWUuaW50ZXJwb2xhdGVkQ2FtWCAqIGdhbWUuVElMRV9XSURUSCArXHJcbiAgICAgICAgICAgICAgICAodGhpcy53aWR0aCAqIGdhbWUuVElMRV9XSURUSCkgLyAyKSAqXHJcbiAgICAgICAgICAgIHVwc2NhbGVTaXplIC0gKHRoaXMubmFtZS5sZW5ndGggKiAyICogZ2FtZS51cHNjYWxlU2l6ZSksXHJcbiAgICAgICAgICAgICh0aGlzLmludGVycG9sYXRlZFkgKiBnYW1lLlRJTEVfSEVJR0hUIC1cclxuICAgICAgICAgICAgICAgIGdhbWUuaW50ZXJwb2xhdGVkQ2FtWSAqIGdhbWUuVElMRV9IRUlHSFQgLVxyXG4gICAgICAgICAgICAgICAgKHRoaXMuaGVpZ2h0ICogZ2FtZS5USUxFX0hFSUdIVCkgLyAyLjUgLSAyKSAqXHJcbiAgICAgICAgICAgIHVwc2NhbGVTaXplXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVEYXRhKGRhdGE6IEVudGl0eVBheWxvYWQpOiB2b2lkIHtcclxuICAgICAgICBpZiAoZGF0YS50eXBlID09PSBFbnRpdGllcy5QbGF5ZXIpIHRoaXMubmFtZSA9IGRhdGEuZGF0YS5uYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIGtleWJvYXJkSW5wdXQoKSB7XHJcblxyXG4gICAgICAgIHRoaXMueFZlbCArPVxyXG4gICAgICAgICAgICAwLjAyICogKCt0aGlzLnJpZ2h0QnV0dG9uIC0gK3RoaXMubGVmdEJ1dHRvbik7XHJcbiAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICB0aGlzLmdyb3VuZGVkICYmIHRoaXMuanVtcEJ1dHRvblxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICBnYW1lLnNjcmVlbnNoYWtlQW1vdW50ID0gMC41O1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwICogZ2FtZS5wYXJ0aWNsZU11bHRpcGxpZXI7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYm90dG9tQ29sbGlzaW9uICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBnYW1lLnBhcnRpY2xlcy5wdXNoKG5ldyBDb2xvclBhcnRpY2xlKHRoaXMuYm90dG9tQ29sbGlzaW9uLmNvbG9yLCAxIC8gOCArIE1hdGgucmFuZG9tKCkgLyA4LCAyMCwgdGhpcy54ICsgdGhpcy53aWR0aCAqIE1hdGgucmFuZG9tKCksIHRoaXMueSArIHRoaXMuaGVpZ2h0LCAwLjIgKiAoTWF0aC5yYW5kb20oKSAtIDAuNSksIDAuMiAqIC1NYXRoLnJhbmRvbSgpKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ib3R0b21Db2xsaXNpb24uanVtcFNvdW5kPy5wbGF5UmFuZG9tKHhUb1N0ZXJlbyh0aGlzLmludGVycG9sYXRlZFgpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnlWZWwgPSAtMS41O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBhcHBseUdyYXZpdHlBbmREcmFnKCkge1xyXG4gICAgICAgIC8vIHRoaXMgZnVuY3Rpb24gY2hhbmdlcyB0aGUgb2JqZWN0J3MgbmV4dCB0aWNrJ3MgdmVsb2NpdHkgaW4gYm90aCB0aGUgeCBhbmQgdGhlIHkgZGlyZWN0aW9uc1xyXG5cclxuICAgICAgICB0aGlzLnBYVmVsID0gdGhpcy54VmVsO1xyXG4gICAgICAgIHRoaXMucFlWZWwgPSB0aGlzLnlWZWw7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmJvdHRvbUNvbGxpc2lvbiA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMueFZlbCAtPVxyXG4gICAgICAgICAgICAgICAgKE1hdGguYWJzKHRoaXMueFZlbCkgKiB0aGlzLnhWZWwgKiBnYW1lLkRSQUdfQ09FRkZJQ0lFTlQgKiB0aGlzLndpZHRoKSAvIC8vYXBwbHkgYWlyIHJlc2lzdGFuY2VcclxuICAgICAgICAgICAgICAgIHRoaXMubWFzcztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnhWZWwgLT1cclxuICAgICAgICAgICAgICAgIChNYXRoLmFicyh0aGlzLnhWZWwpICogdGhpcy54VmVsICogZ2FtZS5EUkFHX0NPRUZGSUNJRU5UICogKHRoaXMuYm90dG9tQ29sbGlzaW9uLmZyaWN0aW9uKSAqIHRoaXMud2lkdGgpIC8gLy9hcHBseSBhaXIgcmVzaXN0YW5jZSBhbmQgZ3JvdW5kIGZyaWN0aW9uXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1hc3M7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMueVZlbCArPSBnYW1lLkdSQVZJVFlfU1BFRUQ7XHJcbiAgICAgICAgdGhpcy55VmVsIC09XHJcbiAgICAgICAgICAgIChnYW1lLmFicyh0aGlzLnlWZWwpICogdGhpcy55VmVsICogZ2FtZS5EUkFHX0NPRUZGSUNJRU5UICogdGhpcy5oZWlnaHQpIC9cclxuICAgICAgICAgICAgdGhpcy5tYXNzO1xyXG4gICAgICAgIC8vaWYgb24gdGhlIGdyb3VuZCwgbWFrZSB3YWxraW5nIHBhcnRpY2xlc1xyXG4gICAgICAgIGlmICh0aGlzLmdyb3VuZGVkKSB7XHJcbiAgICAgICAgICAgIC8vZm9vdHN0ZXBzXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmFuZG9tbHlUb0ludChNYXRoLmFicyh0aGlzLnhWZWwpICogZ2FtZS5wYXJ0aWNsZU11bHRpcGxpZXIgLyAyKTsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBnYW1lLnBhcnRpY2xlcy5wdXNoKG5ldyBDb2xvclBhcnRpY2xlKFwiI2JiYmJiYjQ1XCIsIDEgLyA0ICsgTWF0aC5yYW5kb20oKSAvIDgsIDUwLCB0aGlzLnggKyB0aGlzLndpZHRoIC8gMiArIGkgLyBnYW1lLnBhcnRpY2xlTXVsdGlwbGllciwgdGhpcy55ICsgdGhpcy5oZWlnaHQsIDAsIDAsIGZhbHNlKSk7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vZHVzdFxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJhbmRvbWx5VG9JbnQoTWF0aC5hYnModGhpcy54VmVsKSAqIGdhbWUucGFydGljbGVNdWx0aXBsaWVyIC8gMik7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYm90dG9tQ29sbGlzaW9uICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS5wYXJ0aWNsZXMucHVzaChuZXcgQ29sb3JQYXJ0aWNsZSh0aGlzLmJvdHRvbUNvbGxpc2lvbi5jb2xvciwgMSAvIDggKyBNYXRoLnJhbmRvbSgpIC8gOCwgMTAsIHRoaXMueCArIHRoaXMud2lkdGggLyAyLCB0aGlzLnkgKyB0aGlzLmhlaWdodCwgMC4yICogLXRoaXMueFZlbCArIDAuMiAqIChNYXRoLnJhbmRvbSgpIC0gMC41KSwgMC4yICogLU1hdGgucmFuZG9tKCksIHRydWUpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50QW5pbWF0aW9uICE9PSBcIndhbGtcIiAmJiAodGhpcy54VmVsKSA+IDAuMDUpIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50QW5pbWF0aW9uID0gXCJ3YWxrXCI7XHJcbiAgICAgICAgICAgIHRoaXMuYW5pbUZyYW1lID0gdGhpcy5hbmltRnJhbWUgJSBQbGF5ZXJBbmltYXRpb25zW3RoaXMuY3VycmVudEFuaW1hdGlvbl0ubGVuZ3RoO1xyXG4gICAgICAgICAgICB0aGlzLmZhY2luZ1JpZ2h0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgZ2FtZS5jb25uZWN0aW9uLmVtaXQoJ3BsYXllckFuaW1hdGlvbicsIHRoaXMuY3VycmVudEFuaW1hdGlvbiwgdGhpcy5lbnRpdHlJZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRBbmltYXRpb24gIT09IFwid2Fsa2xlZnRcIiAmJiAodGhpcy54VmVsKSA8IC0wLjA1KSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEFuaW1hdGlvbiA9IFwid2Fsa2xlZnRcIjtcclxuICAgICAgICAgICAgdGhpcy5mYWNpbmdSaWdodCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLmFuaW1GcmFtZSA9IHRoaXMuYW5pbUZyYW1lICUgUGxheWVyQW5pbWF0aW9uc1t0aGlzLmN1cnJlbnRBbmltYXRpb25dLmxlbmd0aDtcclxuICAgICAgICAgICAgZ2FtZS5jb25uZWN0aW9uLmVtaXQoJ3BsYXllckFuaW1hdGlvbicsIHRoaXMuY3VycmVudEFuaW1hdGlvbiwgdGhpcy5lbnRpdHlJZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRBbmltYXRpb24gIT09IFwiaWRsZVwiICYmIHRoaXMueFZlbCA8PSAwLjA1ICYmICh0aGlzLnhWZWwgPiAwIHx8IChnYW1lLndvcmxkTW91c2VYID4gdGhpcy5pbnRlcnBvbGF0ZWRYICsgdGhpcy53aWR0aCAvIDIgJiYgdGhpcy54VmVsID09PSAwKSkpIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50QW5pbWF0aW9uID0gXCJpZGxlXCI7XHJcbiAgICAgICAgICAgIHRoaXMuYW5pbUZyYW1lID0gdGhpcy5hbmltRnJhbWUgJSBQbGF5ZXJBbmltYXRpb25zW3RoaXMuY3VycmVudEFuaW1hdGlvbl0ubGVuZ3RoO1xyXG4gICAgICAgICAgICBnYW1lLmNvbm5lY3Rpb24uZW1pdCgncGxheWVyQW5pbWF0aW9uJywgdGhpcy5jdXJyZW50QW5pbWF0aW9uLCB0aGlzLmVudGl0eUlkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudEFuaW1hdGlvbiAhPT0gXCJpZGxlbGVmdFwiICYmIHRoaXMueFZlbCA+PSAtMC4wNSAmJiAodGhpcy54VmVsIDwgMCB8fCAoZ2FtZS53b3JsZE1vdXNlWCA8PSB0aGlzLmludGVycG9sYXRlZFggKyB0aGlzLndpZHRoIC8gMiAmJiB0aGlzLnhWZWwgPT09IDApKSkge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRBbmltYXRpb24gPSBcImlkbGVsZWZ0XCI7XHJcbiAgICAgICAgICAgIHRoaXMuYW5pbUZyYW1lID0gdGhpcy5hbmltRnJhbWUgJSBQbGF5ZXJBbmltYXRpb25zW3RoaXMuY3VycmVudEFuaW1hdGlvbl0ubGVuZ3RoO1xyXG4gICAgICAgICAgICBnYW1lLmNvbm5lY3Rpb24uZW1pdCgncGxheWVyQW5pbWF0aW9uJywgdGhpcy5jdXJyZW50QW5pbWF0aW9uLCB0aGlzLmVudGl0eUlkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyh0aGlzLmN1cnJlbnRBbmltYXRpb24sIHRoaXMuY3VycmVudEFuaW1hdGlvbiAhPT0gXCJ3YWxrXCIgJiYgKHRoaXMueFZlbCk+MC4wNSlcclxuICAgIH1cclxuXHJcbiAgICBmaW5kSW50ZXJwb2xhdGVkQ29vcmRpbmF0ZXMoKSB7XHJcbiAgICAgICAgLy8gdGhpcyBmdW5jdGlvbiBlc3NlbnRpYWxseSBtYWtlcyB0aGUgY2hhcmFjdGVyIGxhZyBiZWhpbmQgb25lIHRpY2ssIGJ1dCBtZWFucyB0aGF0IGl0IGdldHMgZGlzcGxheWVkIGF0IHRoZSBtYXhpbXVtIGZyYW1lIHJhdGUuXHJcbiAgICAgICAgaWYgKHRoaXMucFhWZWwgPiAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW50ZXJwb2xhdGVkWCA9IGdhbWUubWluKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5wWCArIHRoaXMucFhWZWwgKiBnYW1lLmFtb3VudFNpbmNlTGFzdFRpY2ssXHJcbiAgICAgICAgICAgICAgICB0aGlzLnhcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmludGVycG9sYXRlZFggPSBnYW1lLm1heChcclxuICAgICAgICAgICAgICAgIHRoaXMucFggKyB0aGlzLnBYVmVsICogZ2FtZS5hbW91bnRTaW5jZUxhc3RUaWNrLFxyXG4gICAgICAgICAgICAgICAgdGhpcy54XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLnBZVmVsID4gMCkge1xyXG4gICAgICAgICAgICB0aGlzLmludGVycG9sYXRlZFkgPSBnYW1lLm1pbihcclxuICAgICAgICAgICAgICAgIHRoaXMucFkgKyB0aGlzLnBZVmVsICogZ2FtZS5hbW91bnRTaW5jZUxhc3RUaWNrLFxyXG4gICAgICAgICAgICAgICAgdGhpcy55XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5pbnRlcnBvbGF0ZWRZID0gZ2FtZS5tYXgoXHJcbiAgICAgICAgICAgICAgICB0aGlzLnBZICsgdGhpcy5wWVZlbCAqIGdhbWUuYW1vdW50U2luY2VMYXN0VGljayxcclxuICAgICAgICAgICAgICAgIHRoaXMueVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBhcHBseVZlbG9jaXR5QW5kQ29sbGlkZSgpIHtcclxuICAgICAgICB0aGlzLnRvcENvbGxpc2lvbiA9IFdvcmxkVGlsZXNbVGlsZVR5cGUuQWlyXTtcclxuICAgICAgICB0aGlzLmJvdHRvbUNvbGxpc2lvbiA9IFdvcmxkVGlsZXNbVGlsZVR5cGUuQWlyXTtcclxuICAgICAgICB0aGlzLnBYID0gdGhpcy54O1xyXG4gICAgICAgIHRoaXMucFkgPSB0aGlzLnk7XHJcblxyXG4gICAgICAgIHRoaXMucEdyb3VuZGVkID0gdGhpcy5ncm91bmRlZDtcclxuICAgICAgICB0aGlzLmdyb3VuZGVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgVGhpcyBmdW5jdGlvbiBhc3N1bWVzIHRoYXQgdGhlIG9iamVjdCBkb2Vzbid0IHN0YXJ0IGluIGNvbGxpc2lvblxyXG5cclxuICAgICAgICBBbHNvLCBpdCB0YWtlcyBhZHZhbnRhZ2Ugb2YgdGhlIGZhY3QgdGhhdCBhbiBvYmplY3QgY2FuIG9ubHkgY29sbGlkZSBvbmNlIGluIGVhY2ggYXhpcyB3aXRoIHRoZXNlIGF4aXMtYWxpZ25lZCByZWN0YW5nbGVzLlxyXG4gICAgICAgIFRoYXQncyBhIHRvdGFsIG9mIGEgcG9zc2libGUgdHdvIGNvbGxpc2lvbnMsIG9yIGFuIGluaXRpYWwgY29sbGlzaW9uLCBhbmQgYSBzbGlkaW5nIGNvbGxpc2lvbi5cclxuICAgICAgICAqL1xyXG5cclxuICAgICAgICAvLyBjYWxjdWxhdGUgdGhlIGluaXRpYWwgY29sbGlzaW9uOlxyXG5cclxuICAgICAgICAvLyBzZXQgdGhlIGNsb3Nlc3QgY29sbGlzaW9uIHRvIG9uZSBpbmZpbml0ZWx5IGZhciBhd2F5LlxyXG4gICAgICAgIHRoaXMuY2xvc2VzdENvbGxpc2lvbiA9IFsxLCAwLCBJbmZpbml0eV07XHJcblxyXG4gICAgICAgIGxldCBtb3N0bHlHb2luZ0hvcml6b250YWxseTogYm9vbGVhbjtcclxuXHJcbiAgICAgICAgLy8gbG9vcCB0aHJvdWdoIGFsbCB0aGUgcG9zc2libGUgdGlsZXMgdGhlIHBoeXNpY3MgYm94IGNvdWxkIGJlIGludGVyc2VjdGluZyB3aXRoXHJcbiAgICAgICAgZm9yIChcclxuICAgICAgICAgICAgbGV0IGkgPSBNYXRoLmZsb29yKGdhbWUubWluKHRoaXMueCwgdGhpcy54ICsgdGhpcy54VmVsKSk7XHJcbiAgICAgICAgICAgIGkgPCBNYXRoLmNlaWwoZ2FtZS5tYXgodGhpcy54LCB0aGlzLnggKyB0aGlzLnhWZWwpICsgdGhpcy53aWR0aCk7XHJcbiAgICAgICAgICAgIGkrK1xyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICBmb3IgKFxyXG4gICAgICAgICAgICAgICAgbGV0IGogPSBNYXRoLmZsb29yKGdhbWUubWluKHRoaXMueSwgdGhpcy55ICsgdGhpcy55VmVsKSk7XHJcbiAgICAgICAgICAgICAgICBqIDwgTWF0aC5jZWlsKGdhbWUubWF4KHRoaXMueSwgdGhpcy55ICsgdGhpcy55VmVsKSArIHRoaXMuaGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgIGorK1xyXG4gICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBjdXJyZW50IHRpbGUgaXNuJ3QgYWlyICh2YWx1ZSAwKSwgdGhlbiBjb250aW51ZSB3aXRoIHRoZSBjb2xsaXNpb24gZGV0ZWN0aW9uXHJcbiAgICAgICAgICAgICAgICBsZXQgY3VycmVudEJsb2NrOiBUaWxlVHlwZSB8IHN0cmluZyA9IGdhbWUud29ybGQud29ybGRUaWxlc1tqICogZ2FtZS53b3JsZFdpZHRoICsgaV07XHJcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudEJsb2NrICE9PSBUaWxlVHlwZS5BaXIgJiYgdHlwZW9mIGN1cnJlbnRCbG9jayA9PT0gJ251bWJlcicpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBnZXQgdGhlIGRhdGEgYWJvdXQgdGhlIGNvbGxpc2lvbiBhbmQgc3RvcmUgaXQgaW4gYSB2YXJpYWJsZVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29sbGlzaW9uRGF0YSA9IGdhbWUucmVjdFZzUmF5KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpIC0gdGhpcy53aWR0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaiAtIHRoaXMuaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLndpZHRoICsgMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oZWlnaHQgKyAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLngsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMueSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy54VmVsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnlWZWxcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgIG1vc3RseUdvaW5nSG9yaXpvbnRhbGx5ID0gTWF0aC5hYnModGhpcy54VmVsKSA+IE1hdGguYWJzKHRoaXMueVZlbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbGxpc2lvbkRhdGEgIT09IGZhbHNlKSB7Ly9hIGNvbGxpc2lvbiBoYXBwZW5lZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMl0gPiB0aGlzLmNvbGxpc2lvbkRhdGFbMl1cclxuICAgICAgICAgICAgICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3Nlc3RDb2xsaXNpb24gPSB0aGlzLmNvbGxpc2lvbkRhdGE7Ly9ob25lc3RseSB0aGlzIGVudGlyZSBjb2xsaXNpb24gc3lzdGVtIGlzIGEgbWVzcyBidXQgaXQgd29yayBzbyBzbyB3aGF0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jbG9zZXN0Q29sbGlzaW9uWzBdID09PSAwKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMV0gPT09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b3BDb2xsaXNpb24gPSBXb3JsZFRpbGVzW2N1cnJlbnRCbG9ja107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJvdHRvbUNvbGxpc2lvbiA9IFdvcmxkVGlsZXNbY3VycmVudEJsb2NrXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5jbG9zZXN0Q29sbGlzaW9uWzJdID09PSB0aGlzLmNvbGxpc2lvbkRhdGFbMl0gJiYgbW9zdGx5R29pbmdIb3Jpem9udGFsbHkgPT09ICh0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMF0gPT09IDApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3Nlc3RDb2xsaXNpb24gPSB0aGlzLmNvbGxpc2lvbkRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jbG9zZXN0Q29sbGlzaW9uWzBdID09PSAwKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMV0gPT09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b3BDb2xsaXNpb24gPSBXb3JsZFRpbGVzW2N1cnJlbnRCbG9ja107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJvdHRvbUNvbGxpc2lvbiA9IFdvcmxkVGlsZXNbY3VycmVudEJsb2NrXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5jbG9zZXN0Q29sbGlzaW9uWzJdICE9PSBJbmZpbml0eSkge1xyXG4gICAgICAgICAgICAvLyB0aGVyZSBoYXMgYmVlbiBhdCBsZWFzdCBvbmUgY29sbGlzaW9uXHJcblxyXG4gICAgICAgICAgICAvLyBnbyB0byB0aGUgcG9pbnQgb2YgY29sbGlzaW9uICh0aGlzIG1ha2VzIGl0IGJlaGF2ZSBhcyBpZiB0aGUgd2FsbHMgYXJlIHN0aWNreSwgYnV0IHdlIHdpbGwgbGF0ZXIgc2xpZGUgYWdhaW5zdCB0aGUgd2FsbHMpXHJcbiAgICAgICAgICAgIHRoaXMueCArPSB0aGlzLnhWZWwgKiB0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMl07XHJcbiAgICAgICAgICAgIHRoaXMueSArPSB0aGlzLnlWZWwgKiB0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMl07XHJcbiAgICAgICAgICAgIC8vIHRoZSBjb2xsaXNpb24gaGFwcGVuZWQgZWl0aGVyIG9uIHRoZSB0b3Agb3IgYm90dG9tXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMF0gPT09IDApIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMV0gPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ncm91bmRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgaXQgY29sbGlkZWQgb24gdGhlIGhpZ2hlciBzaWRlLCBpdCBtdXN0IGJlIHRvdWNoaW5nIHRoZSBncm91bmQuIChoaWdoZXIgeSBpcyBkb3duKVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5wR3JvdW5kZWQpIHsvL2lmIGl0IGlzbid0IGdyb3VuZGVkIHlldCwgaXQgbXVzdCBiZSBjb2xsaWRpbmcgd2l0aCB0aGUgZ3JvdW5kIGZvciB0aGUgZmlyc3QgdGltZSwgc28gc3VtbW9uIHBhcnRpY2xlc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBnYW1lLnNjcmVlbnNoYWtlQW1vdW50ID0gTWF0aC5hYnModGhpcy55VmVsICogMC43NSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmJvdHRvbUNvbGxpc2lvbiAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDUgKiBnYW1lLnBhcnRpY2xlTXVsdGlwbGllcjsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2FtZS5wYXJ0aWNsZXMucHVzaChuZXcgQ29sb3JQYXJ0aWNsZSh0aGlzLmJvdHRvbUNvbGxpc2lvbi5jb2xvciwgMSAvIDggKyBNYXRoLnJhbmRvbSgpIC8gOCwgMjAsIHRoaXMueCArIHRoaXMud2lkdGggKiBNYXRoLnJhbmRvbSgpLCB0aGlzLnkgKyB0aGlzLmhlaWdodCwgMC4yICogKE1hdGgucmFuZG9tKCkgLSAwLjUpLCAwLjIgKiAtTWF0aC5yYW5kb20oKSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuYm90dG9tQ29sbGlzaW9uLmxhbmRTb3VuZCAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJvdHRvbUNvbGxpc2lvbi5sYW5kU291bmQ/LnBsYXlSYW5kb20oeFRvU3RlcmVvKHRoaXMuaW50ZXJwb2xhdGVkWCksIC10aGlzLnlWZWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5ib3R0b21Db2xsaXNpb24uanVtcFNvdW5kICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYm90dG9tQ29sbGlzaW9uLmp1bXBTb3VuZD8ucGxheVJhbmRvbSh4VG9TdGVyZW8odGhpcy5pbnRlcnBvbGF0ZWRYKSwgLXRoaXMueVZlbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJvdHRvbUNvbGxpc2lvbi5icmVha1NvdW5kPy5wbGF5UmFuZG9tKHhUb1N0ZXJlbyh0aGlzLmludGVycG9sYXRlZFgpLCAtdGhpcy55VmVsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGdhbWUuc2NyZWVuc2hha2VBbW91bnQgPSBNYXRoLmFicyh0aGlzLnlWZWwgKiAwLjc1KTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDUgKiBnYW1lLnBhcnRpY2xlTXVsdGlwbGllcjsgaSsrKSB7Ly9jZWlsaW5nIGNvbGxpc2lvbiBwYXJ0aWNsZXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMudG9wQ29sbGlzaW9uICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnYW1lLnBhcnRpY2xlcy5wdXNoKG5ldyBDb2xvclBhcnRpY2xlKHRoaXMudG9wQ29sbGlzaW9uLmNvbG9yLCAxIC8gOCArIE1hdGgucmFuZG9tKCkgLyA4LCAyMCwgdGhpcy54ICsgdGhpcy53aWR0aCAqIE1hdGgucmFuZG9tKCksIHRoaXMueSwgMC4yICogKE1hdGgucmFuZG9tKCkgLSAwLjUpLCAwLjIgKiAtTWF0aC5yYW5kb20oKSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMueVZlbCA9IDA7IC8vIHNldCB0aGUgeSB2ZWxvY2l0eSB0byAwIGJlY2F1c2UgdGhlIG9iamVjdCBoYXMgcnVuIGludG8gYSB3YWxsIG9uIGl0cyB0b3Agb3IgYm90dG9tXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNsaWRlWCA9IHRoaXMueFZlbCAqICgxIC0gdGhpcy5jbG9zZXN0Q29sbGlzaW9uWzJdKTsgLy8gdGhpcyBpcyB0aGUgcmVtYWluaW5nIGRpc3RhbmNlIHRvIHNsaWRlIGFmdGVyIHRoZSBjb2xsaXNpb25cclxuICAgICAgICAgICAgICAgIHRoaXMuc2xpZGVZID0gMDsgLy8gaXQgZG9lc24ndCBzbGlkZSBpbiB0aGUgeSBkaXJlY3Rpb24gYmVjYXVzZSB0aGVyZSdzIGEgd2FsbCBcXCguLS4pL1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy54VmVsID0gMDsgLy8gc2V0IHRoZSB4IHZlbG9jaXR5IHRvIDAgYmVjYXVzZSB3YWxsIGdvIG9vZlxyXG4gICAgICAgICAgICAgICAgdGhpcy5zbGlkZVggPSAwOyAvLyBpdCBkb2Vzbid0IHNsaWRlIGluIHRoZSB4IGRpcmVjdGlvbiBiZWNhdXNlIHRoZXJlJ3MgYSB3YWxsIC8oLl8uKVxcXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNsaWRlWSA9IHRoaXMueVZlbCAqICgxIC0gdGhpcy5jbG9zZXN0Q29sbGlzaW9uWzJdKTsgLy8gdGhpcyBpcyB0aGUgcmVtYWluaW5nIGRpc3RhbmNlIHRvIHNsaWRlIGFmdGVyIHRoZSBjb2xsaXNpb25cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gYXQgdGhpcyBwb2ludCwgdGhlIG9iamVjdCBpcyB0b3VjaGluZyBpdHMgZmlyc3QgY29sbGlzaW9uLCByZWFkeSB0byBzbGlkZS4gIFRoZSBhbW91bnQgaXQgd2FudHMgdG8gc2xpZGUgaXMgaGVsZCBpbiB0aGUgdGhpcy5zbGlkZVggYW5kIHRoaXMuc2xpZGVZIHZhcmlhYmxlcy5cclxuXHJcbiAgICAgICAgICAgIC8vIHRoaXMgY2FuIGJlIHRyZWF0ZWQgZXNzZW50aWFsbHkgdGhlIHNhbWUgYXMgdGhlIGZpcnN0IGNvbGxpc2lvbiwgc28gYSBsb3Qgb2YgdGhlIGNvZGUgd2lsbCBiZSByZXVzZWQuXHJcblxyXG4gICAgICAgICAgICAvLyBzZXQgdGhlIGNsb3Nlc3QgY29sbGlzaW9uIHRvIG9uZSBpbmZpbml0ZWx5IGZhciBhd2F5LlxyXG4gICAgICAgICAgICB0aGlzLmNsb3Nlc3RDb2xsaXNpb24gPSBbMSwgMCwgSW5maW5pdHldO1xyXG5cclxuICAgICAgICAgICAgLy8gbG9vcCB0aHJvdWdoIGFsbCB0aGUgcG9zc2libGUgdGlsZXMgdGhlIHBoeXNpY3MgYm94IGNvdWxkIGJlIGludGVyc2VjdGluZyB3aXRoXHJcbiAgICAgICAgICAgIGZvciAoXHJcbiAgICAgICAgICAgICAgICBsZXQgaSA9IE1hdGguZmxvb3IoZ2FtZS5taW4odGhpcy54LCB0aGlzLnggKyB0aGlzLnNsaWRlWCkpO1xyXG4gICAgICAgICAgICAgICAgaSA8IE1hdGguY2VpbChnYW1lLm1heCh0aGlzLngsIHRoaXMueCArIHRoaXMuc2xpZGVYKSArIHRoaXMud2lkdGgpO1xyXG4gICAgICAgICAgICAgICAgaSsrXHJcbiAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaiA9IE1hdGguZmxvb3IoZ2FtZS5taW4odGhpcy55LCB0aGlzLnkgKyB0aGlzLnNsaWRlWSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGogPFxyXG4gICAgICAgICAgICAgICAgICAgIE1hdGguY2VpbChnYW1lLm1heCh0aGlzLnksIHRoaXMueSArIHRoaXMuc2xpZGVZKSArIHRoaXMuaGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgICAgICBqKytcclxuICAgICAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBjdXJyZW50QmxvY2s6IFRpbGVUeXBlIHwgc3RyaW5nID0gZ2FtZS53b3JsZC53b3JsZFRpbGVzW2ogKiBnYW1lLndvcmxkV2lkdGggKyBpXTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBpZiB0aGUgY3VycmVudCB0aWxlIGlzbid0IGFpciwgdGhlbiBjb250aW51ZSB3aXRoIHRoZSBjb2xsaXNpb24gZGV0ZWN0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRCbG9jayAhPT0gVGlsZVR5cGUuQWlyICYmIHR5cGVvZiBjdXJyZW50QmxvY2sgPT09IFwibnVtYmVyXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZ2V0IHRoZSBkYXRhIGFib3V0IHRoZSBjb2xsaXNpb24gYW5kIHN0b3JlIGl0IGluIGEgdmFyaWFibGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb2xsaXNpb25EYXRhID0gZ2FtZS5yZWN0VnNSYXkoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpIC0gdGhpcy53aWR0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGogLSB0aGlzLmhlaWdodCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMud2lkdGggKyAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oZWlnaHQgKyAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy54LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy55LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zbGlkZVgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNsaWRlWVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbGxpc2lvbkRhdGEgIT09IGZhbHNlICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMl0gPiB0aGlzLmNvbGxpc2lvbkRhdGFbMl1cclxuICAgICAgICAgICAgICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3Nlc3RDb2xsaXNpb24gPSB0aGlzLmNvbGxpc2lvbkRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jbG9zZXN0Q29sbGlzaW9uWzBdID09PSAwKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMV0gPT09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b3BDb2xsaXNpb24gPSBXb3JsZFRpbGVzW2N1cnJlbnRCbG9ja107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJvdHRvbUNvbGxpc2lvbiA9IFdvcmxkVGlsZXNbY3VycmVudEJsb2NrXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIGl0IGhhcyBjb2xsaWRlZCB3aGlsZSB0cnlpbmcgdG8gc2xpZGVcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2xvc2VzdENvbGxpc2lvblsyXSAhPT0gSW5maW5pdHkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMueCArPSB0aGlzLnNsaWRlWCAqIHRoaXMuY2xvc2VzdENvbGxpc2lvblsyXTtcclxuICAgICAgICAgICAgICAgIHRoaXMueSArPSB0aGlzLnNsaWRlWSAqIHRoaXMuY2xvc2VzdENvbGxpc2lvblsyXTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jbG9zZXN0Q29sbGlzaW9uWzBdID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy55VmVsID0gMDsgLy8gc2V0IHRoZSB5IHZlbG9jaXR5IHRvIDAgYmVjYXVzZSB0aGUgb2JqZWN0IGhhcyBydW4gaW50byBhIHdhbGwgb24gaXRzIHRvcCBvciBib3R0b21cclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jbG9zZXN0Q29sbGlzaW9uWzFdID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiBpdCBjb2xsaWRlZCBvbiB0aGUgaGlnaGVyIHNpZGUsIGl0IG11c3QgYmUgdG91Y2hpbmcgdGhlIGdyb3VuZC4gKGhpZ2hlciB5IGlzIGRvd24pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ3JvdW5kZWQgPSB0cnVlO1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnhWZWwgPSAwOyAvLyBzZXQgdGhlIHggdmVsb2NpdHkgdG8gMCBiZWNhdXNlIHdhbGwgZ28gb29mXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBpdCBoYXMgbm90IGNvbGxpZGVkIHdoaWxlIHRyeWluZyB0byBzbGlkZVxyXG4gICAgICAgICAgICAgICAgdGhpcy54ICs9IHRoaXMuc2xpZGVYO1xyXG4gICAgICAgICAgICAgICAgdGhpcy55ICs9IHRoaXMuc2xpZGVZO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gdGhlcmUgaGFzIGJlZW4gbm8gY29sbGlzaW9uXHJcbiAgICAgICAgICAgIHRoaXMueCArPSB0aGlzLnhWZWw7XHJcbiAgICAgICAgICAgIHRoaXMueSArPSB0aGlzLnlWZWw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBjb2xsaWRlIHdpdGggc2lkZXMgb2YgbWFwXHJcblxyXG4gICAgICAgIGlmICh0aGlzLnggPCAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMueFZlbCA9IDA7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnggKyB0aGlzLndpZHRoID4gZ2FtZS53b3JsZFdpZHRoKSB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IGdhbWUud29ybGRXaWR0aCAtIHRoaXMud2lkdGg7XHJcbiAgICAgICAgICAgIHRoaXMueFZlbCA9IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy55ICsgdGhpcy5oZWlnaHQgPiBnYW1lLndvcmxkSGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIHRoaXMueSA9IGdhbWUud29ybGRIZWlnaHQgLSB0aGlzLmhlaWdodDtcclxuICAgICAgICAgICAgdGhpcy55VmVsID0gMDtcclxuICAgICAgICAgICAgdGhpcy5ncm91bmRlZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gcmFuZG9tbHlUb0ludChmOiBudW1iZXIpIHtcclxuICAgIGlmIChNYXRoLnJhbmRvbSgpID4gZiAtIE1hdGguZmxvb3IoZikpIHtcclxuICAgICAgICByZXR1cm4gKE1hdGguZmxvb3IoZikpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIChNYXRoLmNlaWwoZikpO1xyXG59IiwiaW1wb3J0IHsgUmVuZGVyYWJsZSB9IGZyb20gJy4uL2ludGVyZmFjZXMvUmVuZGVyYWJsZSc7XHJcbmltcG9ydCBwNSBmcm9tICdwNSc7XHJcbmltcG9ydCB7IEF1ZGlvQXNzZXRzLCBVaUFzc2V0cyB9IGZyb20gJy4uL2Fzc2V0cy9Bc3NldHMnO1xyXG5pbXBvcnQgeyBJbWFnZVJlc291cmNlIH0gZnJvbSAnLi4vYXNzZXRzL3Jlc291cmNlcy9JbWFnZVJlc291cmNlJztcclxuaW1wb3J0IHsgRm9udFJlc291cmNlIH0gZnJvbSAnLi4vYXNzZXRzL3Jlc291cmNlcy9Gb250UmVzb3VyY2UnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEJ1dHRvbiBpbXBsZW1lbnRzIFJlbmRlcmFibGUge1xyXG5cclxuICAgIGZvbnQ6IEZvbnRSZXNvdXJjZVxyXG4gICAgdHh0OiBzdHJpbmdcclxuICAgIGRlc2NyaXB0aW9uOiBzdHJpbmdcclxuICAgIG9uUHJlc3NlZEN1c3RvbTogRnVuY3Rpb25cclxuICAgIHg6IG51bWJlclxyXG4gICAgeTogbnVtYmVyXHJcbiAgICB3OiBudW1iZXJcclxuICAgIGg6IG51bWJlclxyXG4gICAgaW1hZ2U6IEltYWdlUmVzb3VyY2VcclxuICAgIG1vdXNlSXNPdmVyOiBib29sZWFuXHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgZm9udDogRm9udFJlc291cmNlLFxyXG4gICAgICAgIHR4dDogc3RyaW5nLFxyXG4gICAgICAgIGRlc2NyaXB0aW9uOiBzdHJpbmcsXHJcbiAgICAgICAgeDogbnVtYmVyLFxyXG4gICAgICAgIHk6IG51bWJlcixcclxuICAgICAgICB3OiBudW1iZXIsXHJcbiAgICAgICAgaDogbnVtYmVyLFxyXG4gICAgICAgIG9uUHJlc3NlZEN1c3RvbTogRnVuY3Rpb24pIHtcclxuICAgICAgICB0aGlzLmZvbnQgPSBmb250O1xyXG4gICAgICAgIHRoaXMudHh0ID0gdHh0XHJcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uXHJcbiAgICAgICAgdGhpcy5vblByZXNzZWRDdXN0b20gPSBvblByZXNzZWRDdXN0b21cclxuICAgICAgICB0aGlzLnggPSB4XHJcbiAgICAgICAgdGhpcy55ID0geVxyXG4gICAgICAgIHRoaXMudyA9IHdcclxuICAgICAgICB0aGlzLmggPSBoXHJcbiAgICAgICAgdGhpcy5pbWFnZSA9IFVpQXNzZXRzLmJ1dHRvbl91bnNlbGVjdGVkO1xyXG4gICAgICAgIHRoaXMubW91c2VJc092ZXIgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIodGFyZ2V0OiBwNSwgdXBzY2FsZVNpemU6IG51bWJlcikge1xyXG4gICAgICAgIC8vIHNldCB0aGUgY29vcmRzIGFuZCBkaW1lbnNpb25zIHRvIHJvdW5kIHRvIHRoZSBuZWFyZXN0IHVuLXVwc2NhbGVkIHBpeGVsXHJcbiAgICAgICAgY29uc3QgeCA9IE1hdGgucm91bmQodGhpcy54IC8gdXBzY2FsZVNpemUpICogdXBzY2FsZVNpemU7XHJcbiAgICAgICAgY29uc3QgeSA9IE1hdGgucm91bmQodGhpcy55IC8gdXBzY2FsZVNpemUpICogdXBzY2FsZVNpemU7XHJcbiAgICAgICAgY29uc3QgdyA9IE1hdGgucm91bmQodGhpcy53IC8gdXBzY2FsZVNpemUpICogdXBzY2FsZVNpemU7XHJcbiAgICAgICAgY29uc3QgaCA9IE1hdGgucm91bmQodGhpcy5oIC8gdXBzY2FsZVNpemUpICogdXBzY2FsZVNpemU7XHJcblxyXG4gICAgICAgIC8vIGNvcm5lcnNcclxuICAgICAgICB0aGlzLmltYWdlLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4LCB5LCA3ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgMCwgMCwgNywgNyk7XHJcbiAgICAgICAgdGhpcy5pbWFnZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCArIHcgLSA3ICogdXBzY2FsZVNpemUsIHksIDcgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCA4LCAwLCA3LCA3KTtcclxuICAgICAgICB0aGlzLmltYWdlLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4LCB5ICsgaCAtIDcgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCA3ICogdXBzY2FsZVNpemUsIDAsIDgsIDcsIDcpO1xyXG4gICAgICAgIHRoaXMuaW1hZ2UucmVuZGVyUGFydGlhbCh0YXJnZXQsIHggKyB3IC0gNyAqIHVwc2NhbGVTaXplLCB5ICsgaCAtIDcgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCA3ICogdXBzY2FsZVNpemUsIDgsIDgsIDcsIDcpO1xyXG5cclxuICAgICAgICAvLyB0b3AgYW5kIGJvdHRvbVxyXG4gICAgICAgIHRoaXMuaW1hZ2UucmVuZGVyUGFydGlhbCh0YXJnZXQsIHggKyA3ICogdXBzY2FsZVNpemUsIHksIHcgLSAxNCAqIHVwc2NhbGVTaXplLCA3ICogdXBzY2FsZVNpemUsIDcsIDAsIDEsIDcpO1xyXG4gICAgICAgIHRoaXMuaW1hZ2UucmVuZGVyUGFydGlhbCh0YXJnZXQsIHggKyA3ICogdXBzY2FsZVNpemUsIHkgKyBoIC0gNyAqIHVwc2NhbGVTaXplLCB3IC0gMTQgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCA3LCA4LCAxLCA3KTtcclxuXHJcbiAgICAgICAgLy8gbGVmdCBhbmQgcmlnaHRcclxuICAgICAgICB0aGlzLmltYWdlLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4LCB5ICsgNyAqIHVwc2NhbGVTaXplLCA3ICogdXBzY2FsZVNpemUsIGggLSAxNCAqIHVwc2NhbGVTaXplLCAwLCA3LCA3LCAxKTtcclxuICAgICAgICB0aGlzLmltYWdlLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4ICsgdyAtIDcgKiB1cHNjYWxlU2l6ZSwgeSArIDcgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCBoIC0gMTQgKiB1cHNjYWxlU2l6ZSwgOCwgNywgNywgMSk7XHJcblxyXG4gICAgICAgIC8vIGNlbnRlclxyXG4gICAgICAgIHRoaXMuaW1hZ2UucmVuZGVyUGFydGlhbCh0YXJnZXQsIHggKyA3ICogdXBzY2FsZVNpemUsIHkgKyA3ICogdXBzY2FsZVNpemUsIHcgLSAxNCAqIHVwc2NhbGVTaXplLCBoIC0gMTQgKiB1cHNjYWxlU2l6ZSwgNywgNywgMSwgMSk7XHJcblxyXG4gICAgICAgIHRoaXMuZm9udC5kcmF3VGV4dCh0YXJnZXQsIHRoaXMudHh0LCB4ICsgNiAqIHVwc2NhbGVTaXplLCBNYXRoLnJvdW5kKCh0aGlzLnkgKyB0aGlzLmggLyAyKSAvIHVwc2NhbGVTaXplKSAqIHVwc2NhbGVTaXplIC0gNiAqIHVwc2NhbGVTaXplKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVNb3VzZU92ZXIobW91c2VYOiBudW1iZXIsIG1vdXNlWTogbnVtYmVyKSB7XHJcbiAgICAgICAgLy8gaWYgdGhlIG1vdXNlIHBvc2l0aW9uIGlzIGluc2lkZSB0aGUgYnV0dG9uLCByZXR1cm4gdHJ1ZVxyXG4gICAgICAgIGlmIChtb3VzZVggPiB0aGlzLnggJiYgbW91c2VYIDwgdGhpcy54ICsgdGhpcy53ICYmIG1vdXNlWSA+IHRoaXMueSAmJiBtb3VzZVkgPCB0aGlzLnkgKyB0aGlzLmgpIHtcclxuICAgICAgICAgICAgdGhpcy5tb3VzZUlzT3ZlciA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2UgPSBVaUFzc2V0cy5idXR0b25fc2VsZWN0ZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLm1vdXNlSXNPdmVyID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2UgPSBVaUFzc2V0cy5idXR0b25fdW5zZWxlY3RlZDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb25QcmVzc2VkKCkge1xyXG4gICAgICAgIHRoaXMub25QcmVzc2VkQ3VzdG9tKCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJidXR0b24gcHJlc3NlZFwiKTtcclxuICAgICAgICAvL0F1ZGlvQXNzZXRzLnVpLmludmVudG9yeUNsYWNrLnBsYXlSYW5kb20oKTtcclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgeyBSZW5kZXJhYmxlIH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9SZW5kZXJhYmxlJztcclxuaW1wb3J0IHA1IGZyb20gJ3A1JztcclxuaW1wb3J0IHsgS2V5cywgVWlBc3NldHMgfSBmcm9tICcuLi9hc3NldHMvQXNzZXRzJztcclxuaW1wb3J0IHsgSW1hZ2VSZXNvdXJjZSB9IGZyb20gJy4uL2Fzc2V0cy9yZXNvdXJjZXMvSW1hZ2VSZXNvdXJjZSc7XHJcbmltcG9ydCB7IEZvbnRSZXNvdXJjZSB9IGZyb20gJy4uL2Fzc2V0cy9yZXNvdXJjZXMvRm9udFJlc291cmNlJztcclxuXHJcbmV4cG9ydCBjbGFzcyBJbnB1dEJveCBpbXBsZW1lbnRzIFJlbmRlcmFibGUge1xyXG5cclxuICAgIGZvbnQ6IEZvbnRSZXNvdXJjZVxyXG4gICAgdHh0OiBzdHJpbmdcclxuICAgIHZhbHVlOiBudW1iZXJcclxuICAgIGtleWJvYXJkOiBib29sZWFuXHJcbiAgICBpbmRleDogbnVtYmVyXHJcbiAgICB4OiBudW1iZXJcclxuICAgIHk6IG51bWJlclxyXG4gICAgdzogbnVtYmVyXHJcbiAgICBoOiBudW1iZXJcclxuICAgIGltYWdlOiBJbWFnZVJlc291cmNlXHJcbiAgICBtb3VzZUlzT3ZlcjogYm9vbGVhblxyXG4gICAgbGlzdGVuaW5nOiBib29sZWFuXHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgZm9udDogRm9udFJlc291cmNlLFxyXG4gICAgICAgIHR4dDogc3RyaW5nLFxyXG4gICAgICAgIGtleWJvYXJkOiBib29sZWFuLFxyXG4gICAgICAgIHZhbHVlOiBudW1iZXIsXHJcbiAgICAgICAgaW5kZXg6IG51bWJlciwvLyB0aGUgaW5kZXggaW4gdGhlIEdhbWUuY29udHJvbHMgYXJyYXkgdGhhdCBpdCBjaGFuZ2VzXHJcbiAgICAgICAgeDogbnVtYmVyLFxyXG4gICAgICAgIHk6IG51bWJlcixcclxuICAgICAgICB3OiBudW1iZXIsXHJcbiAgICAgICAgaDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5mb250ID0gZm9udDtcclxuICAgICAgICB0aGlzLnR4dCA9IHR4dFxyXG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLmtleWJvYXJkID0ga2V5Ym9hcmQ7XHJcbiAgICAgICAgdGhpcy5pbmRleCA9IGluZGV4O1xyXG4gICAgICAgIHRoaXMueCA9IHhcclxuICAgICAgICB0aGlzLnkgPSB5XHJcbiAgICAgICAgdGhpcy53ID0gd1xyXG4gICAgICAgIHRoaXMuaCA9IGhcclxuICAgICAgICB0aGlzLmltYWdlID0gVWlBc3NldHMuYnV0dG9uX3Vuc2VsZWN0ZWQ7XHJcbiAgICAgICAgdGhpcy5tb3VzZUlzT3ZlciA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMubGlzdGVuaW5nID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKHRhcmdldDogcDUsIHVwc2NhbGVTaXplOiBudW1iZXIpIHtcclxuICAgICAgICAvLyBzZXQgdGhlIGNvb3JkcyBhbmQgZGltZW5zaW9ucyB0byByb3VuZCB0byB0aGUgbmVhcmVzdCB1bi11cHNjYWxlZCBwaXhlbFxyXG4gICAgICAgIGNvbnN0IHggPSBNYXRoLnJvdW5kKHRoaXMueCAvIHVwc2NhbGVTaXplKSAqIHVwc2NhbGVTaXplO1xyXG4gICAgICAgIGNvbnN0IHkgPSBNYXRoLnJvdW5kKHRoaXMueSAvIHVwc2NhbGVTaXplKSAqIHVwc2NhbGVTaXplO1xyXG4gICAgICAgIGNvbnN0IHcgPSBNYXRoLnJvdW5kKHRoaXMudyAvIHVwc2NhbGVTaXplKSAqIHVwc2NhbGVTaXplO1xyXG4gICAgICAgIGNvbnN0IGggPSBNYXRoLnJvdW5kKHRoaXMuaCAvIHVwc2NhbGVTaXplKSAqIHVwc2NhbGVTaXplO1xyXG5cclxuICAgICAgICAvLyBjb3JuZXJzXHJcbiAgICAgICAgdGhpcy5pbWFnZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCwgeSwgNyAqIHVwc2NhbGVTaXplLCA3ICogdXBzY2FsZVNpemUsIDAsIDAsIDcsIDcpO1xyXG4gICAgICAgIHRoaXMuaW1hZ2UucmVuZGVyUGFydGlhbCh0YXJnZXQsIHggKyB3IC0gNyAqIHVwc2NhbGVTaXplLCB5LCA3ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgOCwgMCwgNywgNyk7XHJcbiAgICAgICAgdGhpcy5pbWFnZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCwgeSArIGggLSA3ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCAwLCA4LCA3LCA3KTtcclxuICAgICAgICB0aGlzLmltYWdlLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4ICsgdyAtIDcgKiB1cHNjYWxlU2l6ZSwgeSArIGggLSA3ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCA4LCA4LCA3LCA3KTtcclxuXHJcbiAgICAgICAgLy8gdG9wIGFuZCBib3R0b21cclxuICAgICAgICB0aGlzLmltYWdlLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4ICsgNyAqIHVwc2NhbGVTaXplLCB5LCB3IC0gMTQgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCA3LCAwLCAxLCA3KTtcclxuICAgICAgICB0aGlzLmltYWdlLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4ICsgNyAqIHVwc2NhbGVTaXplLCB5ICsgaCAtIDcgKiB1cHNjYWxlU2l6ZSwgdyAtIDE0ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgNywgOCwgMSwgNyk7XHJcblxyXG4gICAgICAgIC8vIGxlZnQgYW5kIHJpZ2h0XHJcbiAgICAgICAgdGhpcy5pbWFnZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCwgeSArIDcgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCBoIC0gMTQgKiB1cHNjYWxlU2l6ZSwgMCwgNywgNywgMSk7XHJcbiAgICAgICAgdGhpcy5pbWFnZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCArIHcgLSA3ICogdXBzY2FsZVNpemUsIHkgKyA3ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgaCAtIDE0ICogdXBzY2FsZVNpemUsIDgsIDcsIDcsIDEpO1xyXG5cclxuICAgICAgICAvLyBjZW50ZXJcclxuICAgICAgICB0aGlzLmltYWdlLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4ICsgNyAqIHVwc2NhbGVTaXplLCB5ICsgNyAqIHVwc2NhbGVTaXplLCB3IC0gMTQgKiB1cHNjYWxlU2l6ZSwgaCAtIDE0ICogdXBzY2FsZVNpemUsIDcsIDcsIDEsIDEpO1xyXG5cclxuICAgICAgICBpZih0aGlzLmxpc3RlbmluZykge1xyXG4gICAgICAgICAgICB0aGlzLmZvbnQuZHJhd1RleHQodGFyZ2V0LCB0aGlzLnR4dCtcIjogY2xpY2sgdG8gY2FuY2VsXCIsIHggKyA2ICogdXBzY2FsZVNpemUsIE1hdGgucm91bmQoKHRoaXMueSArIHRoaXMuaCAvIDIpIC8gdXBzY2FsZVNpemUpICogdXBzY2FsZVNpemUgLSA2ICogdXBzY2FsZVNpemUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYodGhpcy5rZXlib2FyZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mb250LmRyYXdUZXh0KHRhcmdldCwgdGhpcy50eHQrXCI6ICAgXCIrS2V5cy5rZXlib2FyZE1hcFt0aGlzLnZhbHVlXSwgeCArIDYgKiB1cHNjYWxlU2l6ZSwgTWF0aC5yb3VuZCgodGhpcy55ICsgdGhpcy5oIC8gMikgLyB1cHNjYWxlU2l6ZSkgKiB1cHNjYWxlU2l6ZSAtIDYgKiB1cHNjYWxlU2l6ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZvbnQuZHJhd1RleHQodGFyZ2V0LCB0aGlzLnR4dCtcIjogICBNb3VzZSBcIit0aGlzLnZhbHVlLCB4ICsgNiAqIHVwc2NhbGVTaXplLCBNYXRoLnJvdW5kKCh0aGlzLnkgKyB0aGlzLmggLyAyKSAvIHVwc2NhbGVTaXplKSAqIHVwc2NhbGVTaXplIC0gNiAqIHVwc2NhbGVTaXplKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVNb3VzZU92ZXIobW91c2VYOiBudW1iZXIsIG1vdXNlWTogbnVtYmVyKSB7XHJcbiAgICAgICAgLy8gaWYgdGhlIG1vdXNlIHBvc2l0aW9uIGlzIGluc2lkZSB0aGUgYnV0dG9uLCByZXR1cm4gdHJ1ZVxyXG4gICAgICAgIGlmIChtb3VzZVggPiB0aGlzLnggJiYgbW91c2VYIDwgdGhpcy54ICsgdGhpcy53ICYmIG1vdXNlWSA+IHRoaXMueSAmJiBtb3VzZVkgPCB0aGlzLnkgKyB0aGlzLmgpIHtcclxuICAgICAgICAgICAgdGhpcy5tb3VzZUlzT3ZlciA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLm1vdXNlSXNPdmVyID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9uUHJlc3NlZCgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImlucHV0IGJveCBwcmVzc2VkXCIpO1xyXG4gICAgICAgIHRoaXMubGlzdGVuaW5nID0gIXRoaXMubGlzdGVuaW5nO1xyXG4gICAgICAgIGlmKHRoaXMubGlzdGVuaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2UgPSBVaUFzc2V0cy5idXR0b25fc2VsZWN0ZWQ7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5pbWFnZSA9IFVpQXNzZXRzLmJ1dHRvbl91bnNlbGVjdGVkO1xyXG4gICAgICAgIC8vIEF1ZGlvQXNzZXRzLnVpLmludmVudG9yeUNsYWNrLnBsYXlSYW5kb20oKTtcclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgeyBSZW5kZXJhYmxlIH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9SZW5kZXJhYmxlJztcclxuaW1wb3J0IHA1IGZyb20gJ3A1JztcclxuaW1wb3J0IHsgVWlBc3NldHMgfSBmcm9tICcuLi9hc3NldHMvQXNzZXRzJztcclxuXHJcbmV4cG9ydCBjbGFzcyBVaUZyYW1lIGltcGxlbWVudHMgUmVuZGVyYWJsZSB7XHJcblxyXG4gICAgeDogbnVtYmVyXHJcbiAgICB5OiBudW1iZXJcclxuICAgIHc6IG51bWJlclxyXG4gICAgaDogbnVtYmVyXHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgeDogbnVtYmVyLFxyXG4gICAgICAgIHk6IG51bWJlcixcclxuICAgICAgICB3OiBudW1iZXIsXHJcbiAgICAgICAgaDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy54ID0geFxyXG4gICAgICAgIHRoaXMueSA9IHlcclxuICAgICAgICB0aGlzLncgPSB3XHJcbiAgICAgICAgdGhpcy5oID0gaFxyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcih0YXJnZXQ6IHA1LCB1cHNjYWxlU2l6ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgLy8gc2V0IHRoZSBjb29yZHMgYW5kIGRpbWVuc2lvbnMgdG8gcm91bmQgdG8gdGhlIG5lYXJlc3QgdW4tdXBzY2FsZWQgcGl4ZWxcclxuICAgICAgICBjb25zdCB4ID0gTWF0aC5yb3VuZCh0aGlzLngvdXBzY2FsZVNpemUpKnVwc2NhbGVTaXplO1xyXG4gICAgICAgIGNvbnN0IHkgPSBNYXRoLnJvdW5kKHRoaXMueS91cHNjYWxlU2l6ZSkqdXBzY2FsZVNpemU7XHJcbiAgICAgICAgY29uc3QgdyA9IE1hdGgucm91bmQodGhpcy53L3Vwc2NhbGVTaXplKSp1cHNjYWxlU2l6ZTtcclxuICAgICAgICBjb25zdCBoID0gTWF0aC5yb3VuZCh0aGlzLmgvdXBzY2FsZVNpemUpKnVwc2NhbGVTaXplO1xyXG5cclxuICAgICAgICAvLyBjb3JuZXJzXHJcbiAgICAgICAgVWlBc3NldHMudWlfZnJhbWUucmVuZGVyUGFydGlhbCh0YXJnZXQsIHgsIHksIDcqdXBzY2FsZVNpemUsIDcqdXBzY2FsZVNpemUsIDAsIDAsIDcsIDcpO1xyXG4gICAgICAgIFVpQXNzZXRzLnVpX2ZyYW1lLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4K3ctNyp1cHNjYWxlU2l6ZSwgeSwgNyp1cHNjYWxlU2l6ZSwgNyp1cHNjYWxlU2l6ZSwgOCwgMCwgNywgNyk7XHJcbiAgICAgICAgVWlBc3NldHMudWlfZnJhbWUucmVuZGVyUGFydGlhbCh0YXJnZXQsIHgsIHkraC03KnVwc2NhbGVTaXplLCA3KnVwc2NhbGVTaXplLCA3KnVwc2NhbGVTaXplLCAwLCA4LCA3LCA3KTtcclxuICAgICAgICBVaUFzc2V0cy51aV9mcmFtZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCt3LTcqdXBzY2FsZVNpemUsIHkraC03KnVwc2NhbGVTaXplLCA3KnVwc2NhbGVTaXplLCA3KnVwc2NhbGVTaXplLCA4LCA4LCA3LCA3KTtcclxuXHJcbiAgICAgICAgLy8gdG9wIGFuZCBib3R0b21cclxuICAgICAgICBVaUFzc2V0cy51aV9mcmFtZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCs3KnVwc2NhbGVTaXplLCB5LCB3LTE0KnVwc2NhbGVTaXplLCA3KnVwc2NhbGVTaXplLCA3LCAwLCAxLCA3KTtcclxuICAgICAgICBVaUFzc2V0cy51aV9mcmFtZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCs3KnVwc2NhbGVTaXplLCB5K2gtNyp1cHNjYWxlU2l6ZSwgdy0xNCp1cHNjYWxlU2l6ZSwgNyp1cHNjYWxlU2l6ZSwgNywgOCwgMSwgNyk7XHJcblxyXG4gICAgICAgIC8vIGxlZnQgYW5kIHJpZ2h0XHJcbiAgICAgICAgVWlBc3NldHMudWlfZnJhbWUucmVuZGVyUGFydGlhbCh0YXJnZXQsIHgsIHkrNyp1cHNjYWxlU2l6ZSwgNyp1cHNjYWxlU2l6ZSwgaC0xNCp1cHNjYWxlU2l6ZSwgMCwgNywgNywgMSk7XHJcbiAgICAgICAgVWlBc3NldHMudWlfZnJhbWUucmVuZGVyUGFydGlhbCh0YXJnZXQsIHgrdy03KnVwc2NhbGVTaXplLCB5KzcqdXBzY2FsZVNpemUsIDcqdXBzY2FsZVNpemUsIGgtMTQqdXBzY2FsZVNpemUsIDgsIDcsIDcsIDEpO1xyXG5cclxuICAgICAgICAvLyBjZW50ZXJcclxuICAgICAgICBVaUFzc2V0cy51aV9mcmFtZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCs3KnVwc2NhbGVTaXplLCB5KzcqdXBzY2FsZVNpemUsIHctMTQqdXBzY2FsZVNpemUsIGgtMTQqdXBzY2FsZVNpemUsIDcsIDcsIDEsIDEpO1xyXG5cclxuICAgIH1cclxufSIsImltcG9ydCB7IFJlbmRlcmFibGUgfSBmcm9tICcuLi9pbnRlcmZhY2VzL1JlbmRlcmFibGUnO1xyXG5pbXBvcnQgcDUgZnJvbSAncDUnO1xyXG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tICcuL0J1dHRvbic7XHJcbmltcG9ydCB7IFNsaWRlciB9IGZyb20gJy4vU2xpZGVyJztcclxuaW1wb3J0IHsgVWlGcmFtZSB9IGZyb20gJy4vVWlGcmFtZSc7XHJcbmltcG9ydCB7IGdhbWUgfSBmcm9tICcuLi9HYW1lJztcclxuaW1wb3J0IHsgSW5wdXRCb3ggfSBmcm9tICcuL0lucHV0Qm94JztcclxuaW1wb3J0IHsgVWlBc3NldHMgfSBmcm9tICcuLi9hc3NldHMvQXNzZXRzJztcclxuaW1wb3J0IHsgRm9udFJlc291cmNlIH0gZnJvbSAnLi4vYXNzZXRzL3Jlc291cmNlcy9Gb250UmVzb3VyY2UnO1xyXG5cclxuXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBVaVNjcmVlbiBpbXBsZW1lbnRzIFJlbmRlcmFibGUge1xyXG5cclxuICAgIGJ1dHRvbnM6IEJ1dHRvbltdO1xyXG4gICAgc2xpZGVyczogU2xpZGVyW107XHJcbiAgICBpbnB1dEJveGVzOiBJbnB1dEJveFtdO1xyXG4gICAgc2Nyb2xsPzogbnVtYmVyO1xyXG4gICAgbWluU2Nyb2xsOiBudW1iZXIgPSAwO1xyXG4gICAgbWF4U2Nyb2xsOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIGZyYW1lOiBVaUZyYW1lXHJcblxyXG4gICAgdGl0bGVGb250OiBGb250UmVzb3VyY2VcclxuXHJcbiAgICBhYnN0cmFjdCByZW5kZXIodGFyZ2V0OiBwNSwgdXBzY2FsZVNpemU6IG51bWJlcik6IHZvaWQ7XHJcblxyXG4gICAgYWJzdHJhY3Qgd2luZG93VXBkYXRlKCk6IHZvaWRcclxuXHJcbiAgICBtb3VzZVByZXNzZWQoYnRuOiBudW1iZXIpIHtcclxuICAgICAgICBpZih0aGlzLmJ1dHRvbnMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAvLyBsb29wIHRocm91Z2ggYWxsIHRoZSBidXR0b25zIGluIHRoaXMgbWVudSBhbmQgaWYgdGhlIG1vdXNlIGlzIG92ZXIgdGhlbSwgdGhlbiBjYWxsIHRoZSBidXR0b24ncyBvblByZXNzZWQoKSBmdW5jdGlvbi4gIFRoZSBvblByZXNzZWQoKSBmdW5jdGlvbiBpcyBwYXNzZWQgaW4gdGhyb3VnaCB0aGUgY29uc3RydWN0b3IuXHJcbiAgICAgICAgICAgIGZvcihjb25zdCBpIG9mIHRoaXMuYnV0dG9ucykge1xyXG4gICAgICAgICAgICAgICAgaWYoaS5tb3VzZUlzT3Zlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGkub25QcmVzc2VkKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMuc2xpZGVycyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIC8vIGxvb3AgdGhyb3VnaCBhbGwgdGhlIHNsaWRlcnMgYW5kIGludGVyYWN0IHdpdGggdGhlbSBhY2NvcmRpbmdseVxyXG4gICAgICAgICAgICBmb3IoY29uc3QgaSBvZiB0aGlzLnNsaWRlcnMpIHtcclxuICAgICAgICAgICAgICAgIGkudXBkYXRlU2xpZGVyUG9zaXRpb24oZ2FtZS5tb3VzZVgpO1xyXG4gICAgICAgICAgICAgICAgaWYoZ2FtZS5tb3VzZVg+aS54ICYmIGdhbWUubW91c2VYPGkueCtpLncgJiYgZ2FtZS5tb3VzZVk+aS55ICYmIGdhbWUubW91c2VZPGkueStpLmgpXHJcbiAgICAgICAgICAgICAgICAgICAgaS5iZWluZ0VkaXRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5pbnB1dEJveGVzICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyh0aGlzLmlucHV0Qm94ZXMpO1xyXG4gICAgICAgICAgICAvLyBsb29wIHRocm91Z2ggYWxsIHRoZSBpbnB1dCBib3hlcyBhbmQgaW50ZXJhY3Qgd2l0aCB0aGVtIGFjY29yZGluZ2x5XHJcbiAgICAgICAgICAgIGZvcihjb25zdCBpIG9mIHRoaXMuaW5wdXRCb3hlcykge1xyXG4gICAgICAgICAgICAgICAgaWYoaS5tb3VzZUlzT3Zlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGkub25QcmVzc2VkKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmKGkubGlzdGVuaW5nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaS5saXN0ZW5pbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBnYW1lLmNvbnRyb2xzW2kuaW5kZXhdLmtleUNvZGUgPSBidG47XHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS5jb250cm9sc1tpLmluZGV4XS5rZXlib2FyZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGkudmFsdWUgPSBidG47XHJcbiAgICAgICAgICAgICAgICAgICAgaS5rZXlib2FyZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGkuaW1hZ2UgPSBVaUFzc2V0cy5idXR0b25fdW5zZWxlY3RlZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBtb3VzZVJlbGVhc2VkKCkge1xyXG4gICAgICAgIGlmKHRoaXMuc2xpZGVycyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIC8vIGxvb3AgdGhyb3VnaCBhbGwgdGhlIHNsaWRlcnMgYW5kIGludGVyYWN0IHdpdGggdGhlbSBhY2NvcmRpbmdseVxyXG4gICAgICAgICAgICBmb3IoY29uc3QgaSBvZiB0aGlzLnNsaWRlcnMpIHtcclxuICAgICAgICAgICAgICAgIGkuYmVpbmdFZGl0ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgeyBVaVNjcmVlbiB9IGZyb20gJy4uL1VpU2NyZWVuJztcclxuaW1wb3J0IHA1IGZyb20gJ3A1JztcclxuaW1wb3J0IHsgVWlGcmFtZSB9IGZyb20gJy4uL1VpRnJhbWUnO1xyXG5pbXBvcnQgeyBnYW1lIH0gZnJvbSAnLi4vLi4vR2FtZSc7XHJcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gJy4uL0J1dHRvbic7XHJcbmltcG9ydCB7IEZvbnRSZXNvdXJjZSB9IGZyb20gJy4uLy4uL2Fzc2V0cy9yZXNvdXJjZXMvRm9udFJlc291cmNlJztcclxuaW1wb3J0IHsgT3B0aW9uc01lbnUgfSBmcm9tICcuL09wdGlvbnNNZW51JztcclxuaW1wb3J0IHsgSW5wdXRCb3ggfSBmcm9tICcuLi9JbnB1dEJveCc7XHJcbmltcG9ydCB7IENvbnRyb2wgfSBmcm9tICcuLi8uLi9pbnB1dC9Db250cm9sJ1xyXG5cclxuZXhwb3J0IGNsYXNzIENvbnRyb2xzTWVudSBleHRlbmRzIFVpU2NyZWVuIHtcclxuXHJcblx0Y29uc3RydWN0b3IoZm9udDogRm9udFJlc291cmNlLCB0aXRsZUZvbnQ6IEZvbnRSZXNvdXJjZSwgcHJldmlvdXNNZW51OiBzdHJpbmcpIHtcclxuXHRcdHN1cGVyKCk7XHJcblx0XHQvLyBtYWtlIHRoZSBmcmFtZSB3aXRoIHNvbWUgZGVmYXVsdCB2YWx1ZXMuICBUaGVzZSB3aWxsIGxhdGVyIGJlIGNoYW5nZWQgdG8gZml0IHRoZSBzY3JlZW4gc2l6ZS5cclxuXHRcdHRoaXMuZnJhbWUgPSBuZXcgVWlGcmFtZSgwLCAwLCAwLCAwKTtcclxuXHJcblx0XHQvLyBtYWtlIHNvbWUgYnV0dG9ucyB3aXRoIGRlZmF1bHQgcG9zaXRpb25zXHJcblx0XHR0aGlzLmJ1dHRvbnMgPSBbXHJcblx0XHRcdG5ldyBCdXR0b24oZm9udCwgXCJCYWNrXCIsIFwiUmV0dXJuIHRvIHRoZSBvcHRpb25zIG1lbnUuXCIsIDAsIDAsIDAsIDAsICgpID0+IHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhcIm9wdGlvbnMgbWVudVwiKTtcclxuXHRcdFx0XHRnYW1lLmN1cnJlbnRVaSA9IG5ldyBPcHRpb25zTWVudShmb250LCB0aXRsZUZvbnQsIHByZXZpb3VzTWVudSk7XHJcblx0XHRcdH0pXHJcblx0XHRdO1xyXG5cclxuXHRcdHRoaXMuaW5wdXRCb3hlcyA9IFtcclxuXHRcdFx0Ly8gbmV3IElucHV0Qm94KGZvbnQsIFwiV2FsayBSaWdodFwiLCB0cnVlLCA2OCwgMCwgMCwgMCwgMCwgMCksXHJcblx0XHRcdC8vIG5ldyBJbnB1dEJveChmb250LCBcIldhbGsgTGVmdFwiLCB0cnVlLCA2NSwgMSwgMCwgMCwgMCwgMCksXHJcblx0XHRcdC8vIG5ldyBJbnB1dEJveChmb250LCBcIkp1bXBcIiwgdHJ1ZSwgMzIsIDIsIDAsIDAsIDAsIDApLFxyXG5cdFx0XHQvLyBuZXcgSW5wdXRCb3goZm9udCwgXCJQYXVzZVwiLCB0cnVlLCAyNywgMywgMCwgMCwgMCwgMClcclxuXHRcdF1cclxuXHJcblx0XHRsZXQgaSA9IDA7XHJcblx0XHRmb3IgKGxldCBjb250cm9sIG9mIGdhbWUuY29udHJvbHMpIHtcclxuXHRcdFx0aSsrO1xyXG5cdFx0XHR0aGlzLmlucHV0Qm94ZXMucHVzaChuZXcgSW5wdXRCb3goZm9udCwgY29udHJvbC5kZXNjcmlwdGlvbiwgY29udHJvbC5rZXlib2FyZCwgY29udHJvbC5rZXlDb2RlLCBpLCAwLCAwLCAwLCAwKSk7XHJcblx0XHR9XHJcblx0XHQvLyB1cGRhdGUgdGhlIHNpemUgb2YgdGhlIGVsZW1lbnRzIGJhc2VkIG9uIHRoZSBpbml0aWFsIHNjcmVlbiBzaXplXHJcblx0XHR0aGlzLndpbmRvd1VwZGF0ZSgpO1xyXG5cdH1cclxuXHJcblx0cmVuZGVyKHRhcmdldDogcDUsIHVwc2NhbGVTaXplOiBudW1iZXIpOiB2b2lkIHtcclxuXHJcblx0XHQvLyByZW5kZXIgdGhlIHJlY3Rhbmd1bGFyIGltYWdlXHJcblx0XHR0aGlzLmZyYW1lLnJlbmRlcih0YXJnZXQsIHVwc2NhbGVTaXplKTtcclxuXHJcblx0XHQvLyBsb29wIHRocm91Z2ggdGhlIGJ1dHRvbnMgYXJyYXkgYW5kIHJlbmRlciBlYWNoIG9uZS5cclxuXHRcdHRoaXMuYnV0dG9ucy5mb3JFYWNoKGJ1dHRvbiA9PiB7XHJcblx0XHRcdGJ1dHRvbi5yZW5kZXIodGFyZ2V0LCB1cHNjYWxlU2l6ZSk7XHJcblx0XHR9KTtcclxuXHJcblx0XHQvLyBsb29wIHRocm91Z2ggdGhlIGlucHV0Qm94ZXMgYXJyYXkgYW5kIHJlbmRlciBlYWNoIG9uZS5cclxuXHRcdHRoaXMuaW5wdXRCb3hlcy5mb3JFYWNoKGlucHV0Qm94ID0+IHtcclxuXHRcdFx0aW5wdXRCb3gucmVuZGVyKHRhcmdldCwgdXBzY2FsZVNpemUpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHR3aW5kb3dVcGRhdGUoKSB7XHJcblx0XHQvLyBzZXQgdGhlIHBvc2l0aW9uIG9mIHRoZSBmcmFtZVxyXG5cdFx0dGhpcy5mcmFtZS54ID0gZ2FtZS53aWR0aCAvIDIgLSAyMDAgLyAyICogZ2FtZS51cHNjYWxlU2l6ZTsvLyBjZW50ZXIgdGhlIGZyYW1lIGluIHRoZSBjZW50ZXIgb2YgdGhlIHNjcmVlblxyXG5cdFx0dGhpcy5mcmFtZS55ID0gZ2FtZS5oZWlnaHQgLyAyIC0gNTYgKiBnYW1lLnVwc2NhbGVTaXplO1xyXG5cdFx0dGhpcy5mcmFtZS53ID0gMjAwICogZ2FtZS51cHNjYWxlU2l6ZTtcclxuXHRcdHRoaXMuZnJhbWUuaCA9IDQ4ICogZ2FtZS51cHNjYWxlU2l6ZTtcclxuXHR9XHJcbn0iLCJpbXBvcnQgeyBVaVNjcmVlbiB9IGZyb20gJy4uL1VpU2NyZWVuJztcclxuaW1wb3J0IHA1IGZyb20gJ3A1JztcclxuaW1wb3J0IHsgVWlGcmFtZSB9IGZyb20gJy4uL1VpRnJhbWUnO1xyXG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tICcuLi9CdXR0b24nO1xyXG5pbXBvcnQgeyBPcHRpb25zTWVudSB9IGZyb20gJy4vT3B0aW9uc01lbnUnO1xyXG5pbXBvcnQgeyBGb250UmVzb3VyY2UgfSBmcm9tICcuLi8uLi9hc3NldHMvcmVzb3VyY2VzL0ZvbnRSZXNvdXJjZSc7XHJcbmltcG9ydCB7IFVpQXNzZXRzIH0gZnJvbSAnLi4vLi4vYXNzZXRzL0Fzc2V0cyc7XHJcbmltcG9ydCB7IFdvcmxkQ3JlYXRpb25NZW51IH0gZnJvbSAnLi9Xb3JsZENyZWF0aW9uTWVudSc7XHJcbmltcG9ydCB7IGdhbWUgfSBmcm9tICcuLi8uLi9HYW1lJztcclxuXHJcbmV4cG9ydCBjbGFzcyBNYWluTWVudSBleHRlbmRzIFVpU2NyZWVuIHtcclxuXHJcbiAgICBpbnB1dEJveDogSFRNTEVsZW1lbnQgfCBudWxsXHJcblxyXG4gICAgY29uc3RydWN0b3IoZm9udDogRm9udFJlc291cmNlLCB0aXRsZUZvbnQ6IEZvbnRSZXNvdXJjZSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIHRoaXMuaW5wdXRCb3ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5hbWVcIik7XHJcblxyXG4gICAgICAgIGlmKHRoaXMuaW5wdXRCb3g9PW51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5pbnB1dEJveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgICAgICAgdGhpcy5pbnB1dEJveC5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwibmFtZVwiKTtcclxuICAgICAgICAgICAgdGhpcy5pbnB1dEJveC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBcIm5hbWVcIik7XHJcbiAgICAgICAgICAgIHRoaXMuaW5wdXRCb3guc2V0QXR0cmlidXRlKFwicGxhY2Vob2xkZXJcIiwgXCJDbGljayB0byBDaGFuZ2UgVXNlcm5hbWUuLi5cIik7XHJcbiAgICAgICAgICAgIHRoaXMuaW5wdXRCb3gub25pbnB1dCA9ICgpPT57XHJcbiAgICAgICAgICAgICAgICBsZXQgdiA9IChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5hbWVcIikgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWU7XHJcbiAgICAgICAgICAgICAgICBpZih2PT11bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaW5wdXRCb3ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5hbWVcIikgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICAgICAgICAgICAgICAgICAgICBpbnB1dEJveC52YWx1ZSA9IFwiZXJyb3JfIHVuZGVmaW5lZCB2YWx1ZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdiA9IHYuc3Vic3RyaW5nKDAsIDIwKVxyXG4gICAgICAgICAgICAgICAgZm9yKGxldCBpID0gMDsgaTx2Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoIVwiYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXpBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWjAxMjM0NTY3ODktXyBcIi5pbmNsdWRlcyh2W2ldKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiY29udGFpbnMgYmFkIGJhZDogXCIrdltpXSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgdiA9IHYuc2xpY2UoMCwgaSkgKyB2LnNsaWNlKGkrMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGktLTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBsZXQgaW5wdXRCb3ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5hbWVcIikgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICAgICAgICAgICAgICAgIGlucHV0Qm94LnZhbHVlID0gdlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5pbnB1dEJveCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBtYWtlIHRoZSBmcmFtZSB3aXRoIHNvbWUgZGVmYXVsdCB2YWx1ZXMuICBUaGVzZSB3aWxsIGxhdGVyIGJlIGNoYW5nZWQgdG8gZml0IHRoZSBzY3JlZW4gc2l6ZS5cclxuICAgICAgICB0aGlzLmZyYW1lID0gbmV3IFVpRnJhbWUoMCwgMCwgMCwgMCk7XHJcblxyXG4gICAgICAgIC8vIG1ha2UgNCBidXR0b25zIHdpdGggZGVmYXVsdCBwb3NpdGlvbnNcclxuICAgICAgICB0aGlzLmJ1dHRvbnMgPSBbXHJcbiAgICAgICAgICAgIG5ldyBCdXR0b24oZm9udCwgXCJKb2luIEdhbWVcIiwgXCJKb2luIGEgZ2FtZSB3aXRoIHlvdXIgZnJpZW5kcywgb3IgbWFrZSBuZXcgb25lcy5cIiwgMCwgMCwgMCwgMCwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJqb2luIGdhbWVcIik7XHJcbiAgICAgICAgICAgICAgICBsZXQgdiA9IChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5hbWVcIikgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWU7XHJcbiAgICAgICAgICAgICAgICBpZih2PT11bmRlZmluZWQpdj1cIkVSUk9SIFdJVEggUExBWUVSTkFNRVwiXHJcbiAgICAgICAgICAgICAgICB3aGlsZSh2W3YubGVuZ3RoLTFdPT09XCIgXCIpdiA9IHYuc3Vic3RyaW5nKDAsIHYubGVuZ3RoLTIpXHJcbiAgICAgICAgICAgICAgICB3aGlsZSh2Lmxlbmd0aDwzKXYgPSB2K1wiX1wiXHJcbiAgICAgICAgICAgICAgICBnYW1lLmNvbm5lY3Rpb24uZW1pdChcclxuICAgICAgICAgICAgICAgICAgICAnam9pbicsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2U0MDIyZDQwM2RjYzZkMTlkNmE2OGJhM2FiZmQwYTYwJyxcclxuICAgICAgICAgICAgICAgICAgICB2LFxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRCb3g/LnJlbW92ZSgpXHJcbiAgICAgICAgICAgICAgICBnYW1lLmN1cnJlbnRVaSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIG5ldyBCdXR0b24oZm9udCwgXCJPcHRpb25zXCIsIFwiQ2hhbmdlIHlvdXIga2V5YmluZHMsIHJlZHVjZSBsYWcsIGV0Yy5cIiwgMCwgMCwgMCwgMCwgKCkgPT57XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm9wdGlvbnNcIik7XHJcbiAgICAgICAgICAgICAgICBnYW1lLmN1cnJlbnRVaSA9IG5ldyBPcHRpb25zTWVudShmb250LCB0aXRsZUZvbnQsIFwibWFpbiBtZW51XCIpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIF07XHJcblxyXG4gICAgICAgIC8vIHVwZGF0ZSB0aGUgc2l6ZSBvZiB0aGUgZWxlbWVudHMgYmFzZWQgb24gdGhlIGluaXRpYWwgc2NyZWVuIHNpemVcclxuICAgICAgICB0aGlzLndpbmRvd1VwZGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcih0YXJnZXQ6IHA1LCB1cHNjYWxlU2l6ZTogbnVtYmVyKTogdm9pZCB7XHJcblxyXG4gICAgICAgIC8vIHJlbmRlciB0aGUgcmVjdGFuZ3VsYXIgaW1hZ2UgdGhhdCB0aGUgd2hvbGUgbWVudSBpcyBvblxyXG4gICAgICAgIHRoaXMuZnJhbWUucmVuZGVyKHRhcmdldCwgdXBzY2FsZVNpemUpO1xyXG5cclxuICAgICAgICBVaUFzc2V0cy50aXRsZV9pbWFnZS5yZW5kZXIodGFyZ2V0LCBNYXRoLnJvdW5kKHRoaXMuZnJhbWUueC91cHNjYWxlU2l6ZSsxKSp1cHNjYWxlU2l6ZSwgTWF0aC5yb3VuZCh0aGlzLmZyYW1lLnkvdXBzY2FsZVNpemUrNCkqdXBzY2FsZVNpemUsIDI1Nip1cHNjYWxlU2l6ZSwgNDAqdXBzY2FsZVNpemUpO1xyXG5cclxuICAgICAgICAvLyBsb29wIHRocm91Z2ggdGhlIGJ1dHRvbnMgYXJyYXkgYW5kIHJlbmRlciBlYWNoIG9uZS5cclxuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdGhpcy5idXR0b25zKSB7XHJcbiAgICAgICAgICAgIGl0ZW0ucmVuZGVyKHRhcmdldCwgdXBzY2FsZVNpemUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgd2luZG93VXBkYXRlKCkge1xyXG5cclxuICAgICAgICBpZih0aGlzLmlucHV0Qm94ICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW5wdXRCb3guc3R5bGUudG9wID0gKChnYW1lLmhlaWdodC8yKStcInB4XCIpXHJcbiAgICAgICAgICAgIHRoaXMuaW5wdXRCb3guc3R5bGUubGVmdCA9ICgoZ2FtZS53aWR0aC8yLTE5Mi8yKmdhbWUudXBzY2FsZVNpemUpK1wicHhcIilcclxuICAgICAgICAgICAgdGhpcy5pbnB1dEJveC5zdHlsZS53aWR0aCA9ICgoMTkyKmdhbWUudXBzY2FsZVNpemUtMTApK1wicHhcIilcclxuICAgICAgICAgICAgdGhpcy5pbnB1dEJveC5zdHlsZS5oZWlnaHQgPSgoMTYqZ2FtZS51cHNjYWxlU2l6ZS0xMCkrXCJweFwiKVxyXG4gICAgICAgICAgICB0aGlzLmlucHV0Qm94LnN0eWxlLmZvbnRTaXplID0oKDEwKmdhbWUudXBzY2FsZVNpemUpK1wicHhcIilcclxuICAgICAgICAgICAgdGhpcy5pbnB1dEJveC5zdHlsZS5ib3JkZXJSYWRpdXMgPSAoKDYqZ2FtZS51cHNjYWxlU2l6ZSkrXCJweFwiKVxyXG4gICAgICAgICAgICB0aGlzLmlucHV0Qm94LnN0eWxlLmJvcmRlcldpZHRoID0gKCgxKmdhbWUudXBzY2FsZVNpemUpK1wicHhcIilcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHNldCB0aGUgcG9zaXRpb24gb2YgdGhlIGZyYW1lXHJcbiAgICAgICAgdGhpcy5mcmFtZS54ID0gZ2FtZS53aWR0aC8yLTI2NC8yKmdhbWUudXBzY2FsZVNpemU7Ly8gY2VudGVyIHRoZSBmcmFtZSBpbiB0aGUgbWlkZGxlIG9mIHRoZSBzY3JlZW5cclxuICAgICAgICB0aGlzLmZyYW1lLnkgPSBnYW1lLmhlaWdodC8yLTU2KmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgdGhpcy5mcmFtZS53ID0gMjY0KmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgdGhpcy5mcmFtZS5oID0gNDgqZ2FtZS51cHNjYWxlU2l6ZTtcclxuXHJcbiAgICAgICAgLy8gc2V0IHRoZSBwb3NpdGlvbnMgb2YgYWxsIHRoZSBidXR0b25zXHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaTx0aGlzLmJ1dHRvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLnggPSBnYW1lLndpZHRoLzItMTkyLzIqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLnkgPSBnYW1lLmhlaWdodC8yKzIwKihpKzEpKmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS53ID0gMTkyKmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS5oID0gMTYqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLnVwZGF0ZU1vdXNlT3ZlcihnYW1lLm1vdXNlWCwgZ2FtZS5tb3VzZVkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IHsgVWlTY3JlZW4gfSBmcm9tICcuLi9VaVNjcmVlbic7XHJcbmltcG9ydCBwNSBmcm9tICdwNSc7XHJcbmltcG9ydCB7IFVpRnJhbWUgfSBmcm9tICcuLi9VaUZyYW1lJztcclxuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSAnLi4vQnV0dG9uJztcclxuaW1wb3J0IHsgRm9udFJlc291cmNlIH0gZnJvbSAnLi4vLi4vYXNzZXRzL3Jlc291cmNlcy9Gb250UmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBNYWluTWVudSB9IGZyb20gJy4vTWFpbk1lbnUnO1xyXG5pbXBvcnQgeyBWaWRlb1NldHRpbmdzTWVudSB9IGZyb20gJy4vVmlkZW9TZXR0aW5nc01lbnUnO1xyXG5pbXBvcnQgeyBDb250cm9sc01lbnUgfSBmcm9tICcuL0NvbnRyb2xzTWVudSc7XHJcbmltcG9ydCB7IGdhbWUgfSBmcm9tICcuLi8uLi9HYW1lJztcclxuaW1wb3J0IHsgUGF1c2VNZW51IH0gZnJvbSAnLi9QYXVzZU1lbnUnO1xyXG5cclxuZXhwb3J0IGNsYXNzIE9wdGlvbnNNZW51IGV4dGVuZHMgVWlTY3JlZW4ge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGZvbnQ6IEZvbnRSZXNvdXJjZSwgdGl0bGVGb250OiBGb250UmVzb3VyY2UsIHByZXZpb3VzTWVudTogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICAvLyBtYWtlIHRoZSBmcmFtZSB3aXRoIHNvbWUgZGVmYXVsdCB2YWx1ZXMuICBUaGVzZSB3aWxsIGxhdGVyIGJlIGNoYW5nZWQgdG8gZml0IHRoZSBzY3JlZW4gc2l6ZS5cclxuICAgICAgICB0aGlzLmZyYW1lID0gbmV3IFVpRnJhbWUoMCwgMCwgMCwgMCk7XHJcbiAgICAgICAgdGhpcy50aXRsZUZvbnQgPSB0aXRsZUZvbnQ7XHJcbiAgICAgICAgLy8gbWFrZSBzb21lIGJ1dHRvbnMgd2l0aCBkZWZhdWx0IHBvc2l0aW9uc1xyXG4gICAgICAgIHRoaXMuYnV0dG9ucyA9IFtcclxuICAgICAgICAgICAgbmV3IEJ1dHRvbihmb250LCBcIlZpZGVvIFNldHRpbmdzXCIsIFwiQ2hhbmdlIHRoZSBiYWxhbmNlIGJldHdlZW4gcGVyZm9ybWFuY2UgYW5kIGZpZGVsaXR5LlwiLCAwLCAwLCAwLCAwLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInZpZGVvIHNldHRpbmdzXCIpO1xyXG4gICAgICAgICAgICAgICAgZ2FtZS5jdXJyZW50VWkgPSBuZXcgVmlkZW9TZXR0aW5nc01lbnUoZm9udCwgdGl0bGVGb250LCBwcmV2aW91c01lbnUpO1xyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgbmV3IEJ1dHRvbihmb250LCBcIkNvbnRyb2xzXCIsIFwiQ2hhbmdlIHlvdXIga2V5YmluZHMuXCIsIDAsIDAsIDAsIDAsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY29udHJvbCBtZW51XCIpO1xyXG4gICAgICAgICAgICAgICAgZ2FtZS5jdXJyZW50VWkgPSBuZXcgQ29udHJvbHNNZW51KGZvbnQsIHRpdGxlRm9udCwgcHJldmlvdXNNZW51KTtcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIC8vIG5ldyBCdXR0b24oZm9udCwgXCJBdWRpbyBTZXR0aW5nc1wiLCBcIkNoYW5nZSB0aGUgdm9sdW1lIG9mIGRpZmZlcmVudCBzb3VuZHMuXCIsIDAsIDAsIDAsIDAsICgpID0+IHtcclxuICAgICAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKFwiYXVkaW8gbWVudVwiKTtcclxuICAgICAgICAgICAgLy8gICAgIGdhbWUuY3VycmVudFVpID0gbmV3IEF1ZGlvU2V0dGluZ3NNZW51KGZvbnQsIHRpdGxlRm9udCk7XHJcbiAgICAgICAgICAgIC8vIH0pLFxyXG4gICAgICAgICAgICBuZXcgQnV0dG9uKGZvbnQsIFwiQmFja1wiLCBcIlJldHVybiB0byB0aGUgXCIrcHJldmlvdXNNZW51K1wiLlwiLCAwLCAwLCAwLCAwLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZihwcmV2aW91c01lbnU9PT1cIm1haW4gbWVudVwiKWdhbWUuY3VycmVudFVpID0gbmV3IE1haW5NZW51KGZvbnQsIHRpdGxlRm9udCk7XHJcbiAgICAgICAgICAgICAgICBlbHNlIGdhbWUuY3VycmVudFVpID0gbmV3IFBhdXNlTWVudShmb250LCB0aXRsZUZvbnQpXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgXTtcclxuICAgICAgICAvLyB1cGRhdGUgdGhlIHNpemUgb2YgdGhlIGVsZW1lbnRzIGJhc2VkIG9uIHRoZSBpbml0aWFsIHNjcmVlbiBzaXplXHJcbiAgICAgICAgdGhpcy53aW5kb3dVcGRhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIodGFyZ2V0OiBwNSwgdXBzY2FsZVNpemU6IG51bWJlcik6IHZvaWQge1xyXG5cclxuICAgICAgICAvLyByZW5kZXIgdGhlIHJlY3Rhbmd1bGFyIGltYWdlIHRoYXQgdGhlIHdob2xlIG1lbnUgaXMgb25cclxuICAgICAgICB0aGlzLmZyYW1lLnJlbmRlcih0YXJnZXQsIHVwc2NhbGVTaXplKTtcclxuXHJcbiAgICAgICAgLy8gbG9vcCB0aHJvdWdoIHRoZSBidXR0b25zIGFycmF5IGFuZCByZW5kZXIgZWFjaCBvbmUuXHJcbiAgICAgICAgdGhpcy5idXR0b25zLmZvckVhY2goYnV0dG9uID0+IHtcclxuICAgICAgICAgICAgYnV0dG9uLnJlbmRlcih0YXJnZXQsIHVwc2NhbGVTaXplKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy50aXRsZUZvbnQuZHJhd1RleHQodGFyZ2V0LCBcIk9wdGlvbnNcIiwgdGhpcy5mcmFtZS54ICsgNTQqZ2FtZS51cHNjYWxlU2l6ZSwgdGhpcy5mcmFtZS55ICsgMTYqZ2FtZS51cHNjYWxlU2l6ZSlcclxuICAgIH1cclxuXHJcbiAgICB3aW5kb3dVcGRhdGUoKSB7XHJcbiAgICAgICAgLy8gc2V0IHRoZSBwb3NpdGlvbiBvZiB0aGUgZnJhbWVcclxuICAgICAgICB0aGlzLmZyYW1lLnggPSBnYW1lLndpZHRoLzItMjAwLzIqZ2FtZS51cHNjYWxlU2l6ZTsvLyBjZW50ZXIgdGhlIGZyYW1lIGluIHRoZSBjZW50ZXIgb2YgdGhlIHNjcmVlblxyXG4gICAgICAgIHRoaXMuZnJhbWUueSA9IGdhbWUuaGVpZ2h0LzItNTYqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICB0aGlzLmZyYW1lLncgPSAyMDAqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICB0aGlzLmZyYW1lLmggPSA0OCpnYW1lLnVwc2NhbGVTaXplO1xyXG5cclxuICAgICAgICAvLyBzZXQgdGhlIHBvc2l0aW9ucyBvZiBhbGwgdGhlIGJ1dHRvbnNcclxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpPHRoaXMuYnV0dG9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0ueCA9IGdhbWUud2lkdGgvMi0xOTIvMipnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0ueSA9IGdhbWUuaGVpZ2h0LzIrMjAqaSpnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0udyA9IDE5MipnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0uaCA9IDE2KmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS51cGRhdGVNb3VzZU92ZXIoZ2FtZS5tb3VzZVgsIGdhbWUubW91c2VZKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IHsgVWlTY3JlZW4gfSBmcm9tICcuLi9VaVNjcmVlbic7XHJcbmltcG9ydCBwNSBmcm9tICdwNSc7XHJcbmltcG9ydCB7IFVpRnJhbWUgfSBmcm9tICcuLi9VaUZyYW1lJztcclxuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSAnLi4vQnV0dG9uJztcclxuaW1wb3J0IHsgT3B0aW9uc01lbnUgfSBmcm9tICcuL09wdGlvbnNNZW51JztcclxuaW1wb3J0IHsgRm9udFJlc291cmNlIH0gZnJvbSAnLi4vLi4vYXNzZXRzL3Jlc291cmNlcy9Gb250UmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBNYWluTWVudSB9IGZyb20gJy4vTWFpbk1lbnUnO1xyXG5pbXBvcnQgeyBnYW1lIH0gZnJvbSAnLi4vLi4vR2FtZSc7XHJcblxyXG5leHBvcnQgY2xhc3MgUGF1c2VNZW51IGV4dGVuZHMgVWlTY3JlZW4ge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGZvbnQ6IEZvbnRSZXNvdXJjZSwgdGl0bGVGb250OiBGb250UmVzb3VyY2UpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICAvLyBtYWtlIHRoZSBmcmFtZSB3aXRoIHNvbWUgZGVmYXVsdCB2YWx1ZXMuICBUaGVzZSB3aWxsIGxhdGVyIGJlIGNoYW5nZWQgdG8gZml0IHRoZSBzY3JlZW4gc2l6ZS5cclxuICAgICAgICB0aGlzLmZyYW1lID0gbmV3IFVpRnJhbWUoMCwgMCwgMCwgMCk7XHJcblxyXG4gICAgICAgIHRoaXMudGl0bGVGb250ID0gdGl0bGVGb250O1xyXG5cclxuICAgICAgICAvLyBtYWtlIDQgYnV0dG9ucyB3aXRoIGRlZmF1bHQgcG9zaXRTaW9uc1xyXG4gICAgICAgIHRoaXMuYnV0dG9ucyA9IFtcclxuICAgICAgICAgICAgbmV3IEJ1dHRvbihmb250LCBcIlJlc3VtZSBnYW1lXCIsIFwiR28gYmFjayB0byB0aGUgZ2FtZS5cIiwgMCwgMCwgMCwgMCwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZ2FtZS5jdXJyZW50VWkgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBuZXcgQnV0dG9uKGZvbnQsIFwiT3B0aW9uc1wiLCBcIkNoYW5nZSB5b3VyIGtleWJpbmRzLCByZWR1Y2UgbGFnLCBldGMuXCIsIDAsIDAsIDAsIDAsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGdhbWUuY3VycmVudFVpID0gbmV3IE9wdGlvbnNNZW51KGZvbnQsIHRpdGxlRm9udCwgXCJwYXVzZSBtZW51XCIpO1xyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgbmV3IEJ1dHRvbihmb250LCBcIkxlYXZlIGdhbWVcIiwgXCJHbyBiYWNrIHRvIE1haW4gTWVudVwiLCAwLCAwLCAwLCAwLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBnYW1lLmN1cnJlbnRVaSA9IG5ldyBNYWluTWVudShmb250LCB0aXRsZUZvbnQpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIF07XHJcblxyXG4gICAgICAgIC8vIHVwZGF0ZSB0aGUgc2l6ZSBvZiB0aGUgZWxlbWVudHMgYmFzZWQgb24gdGhlIGluaXRpYWwgc2NyZWVuIHNpemVcclxuICAgICAgICB0aGlzLndpbmRvd1VwZGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICByZW5kZXIodGFyZ2V0OiBwNSwgdXBzY2FsZVNpemU6IG51bWJlcik6IHZvaWQge1xyXG5cclxuICAgICAgICAvLyByZW5kZXIgdGhlIHJlY3Rhbmd1bGFyIGltYWdlIHRoYXQgdGhlIHdob2xlIG1lbnUgaXMgb25cclxuICAgICAgICB0aGlzLmZyYW1lLnJlbmRlcih0YXJnZXQsIHVwc2NhbGVTaXplKTtcclxuXHJcbiAgICAgICAgLy8gbG9vcCB0aHJvdWdoIHRoZSBidXR0b25zIGFycmF5IGFuZCByZW5kZXIgZWFjaCBvbmUuXHJcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIHRoaXMuYnV0dG9ucykge1xyXG4gICAgICAgICAgICBpdGVtLnJlbmRlcih0YXJnZXQsIHVwc2NhbGVTaXplKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudGl0bGVGb250LmRyYXdUZXh0KHRhcmdldCwgXCJQYXVzZWRcIiwgdGhpcy5mcmFtZS54ICsgNTQqZ2FtZS51cHNjYWxlU2l6ZSwgdGhpcy5mcmFtZS55ICsgMTYqZ2FtZS51cHNjYWxlU2l6ZSlcclxuXHJcbiAgICB9XHJcblxyXG4gICAgd2luZG93VXBkYXRlKCkge1xyXG4gICAgICAgIC8vIHNldCB0aGUgcG9zaXRpb24gb2YgdGhlIGZyYW1lXHJcbiAgICAgICAgdGhpcy5mcmFtZS54ID0gZ2FtZS53aWR0aC8yLTIwMC8yKmdhbWUudXBzY2FsZVNpemU7Ly8gY2VudGVyIHRoZSBmcmFtZSBpbiB0aGUgbWlkZGxlIG9mIHRoZSBzY3JlZW5cclxuICAgICAgICB0aGlzLmZyYW1lLnkgPSBnYW1lLmhlaWdodC8yLTcyKmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgdGhpcy5mcmFtZS53ID0gMjAwKmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgdGhpcy5mcmFtZS5oID0gNTQqZ2FtZS51cHNjYWxlU2l6ZTtcclxuXHJcbiAgICAgICAgLy8gc2V0IHRoZSBwb3NpdGlvbnMgb2YgYWxsIHRoZSBidXR0b25zXHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaTx0aGlzLmJ1dHRvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLnggPSBnYW1lLndpZHRoLzItMTkyLzIqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLnkgPSBnYW1lLmhlaWdodC8yKzIwKmkqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLncgPSAxOTIqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLmggPSAxNipnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0udXBkYXRlTW91c2VPdmVyKGdhbWUubW91c2VYLCBnYW1lLm1vdXNlWSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgeyBVaVNjcmVlbiB9IGZyb20gJy4uL1VpU2NyZWVuJztcclxuaW1wb3J0IHA1IGZyb20gJ3A1JztcclxuaW1wb3J0IHsgVWlGcmFtZSB9IGZyb20gJy4uL1VpRnJhbWUnO1xyXG5pbXBvcnQgeyBnYW1lIH0gZnJvbSAnLi4vLi4vR2FtZSc7XHJcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gJy4uL0J1dHRvbic7XHJcbmltcG9ydCB7IEZvbnRSZXNvdXJjZSB9IGZyb20gJy4uLy4uL2Fzc2V0cy9yZXNvdXJjZXMvRm9udFJlc291cmNlJztcclxuaW1wb3J0IHsgT3B0aW9uc01lbnUgfSBmcm9tICcuL09wdGlvbnNNZW51JztcclxuXHJcbmV4cG9ydCBjbGFzcyBWaWRlb1NldHRpbmdzTWVudSBleHRlbmRzIFVpU2NyZWVuIHtcclxuXHJcblx0Y29uc3RydWN0b3IoZm9udDogRm9udFJlc291cmNlLCB0aXRsZUZvbnQ6IEZvbnRSZXNvdXJjZSwgcHJldmlvdXNNZW51OiBzdHJpbmcpIHtcclxuXHRcdHN1cGVyKCk7XHJcblx0XHQvLyBtYWtlIHRoZSBmcmFtZSB3aXRoIHNvbWUgZGVmYXVsdCB2YWx1ZXMuICBUaGVzZSB3aWxsIGxhdGVyIGJlIGNoYW5nZWQgdG8gZml0IHRoZSBzY3JlZW4gc2l6ZS5cclxuXHRcdHRoaXMuZnJhbWUgPSBuZXcgVWlGcmFtZSgwLCAwLCAwLCAwKTtcclxuXHJcblxyXG5cdFx0aWYoZ2FtZS5za3lNb2QgPT09IHVuZGVmaW5lZClcclxuXHRcdFx0Z2FtZS5za3lNb2QgPSAyO1xyXG5cclxuXHRcdGlmKGdhbWUuc2t5VG9nZ2xlID09PSB1bmRlZmluZWQpXHJcblx0XHRcdGdhbWUuc2t5VG9nZ2xlID0gdHJ1ZTtcclxuXHJcblx0XHRpZihnYW1lLnBhcnRpY2xlTXVsdGlwbGllciA9PT0gdW5kZWZpbmVkKVxyXG5cdFx0XHRnYW1lLnBhcnRpY2xlTXVsdGlwbGllciA9IDE7XHJcblxyXG5cdFx0bGV0IHRlbXBTa3lNb2RlVGV4dDtcclxuXHJcblx0XHRpZihnYW1lLnNreU1vZD09PTIpIHtcclxuXHRcdFx0dGVtcFNreU1vZGVUZXh0ID0gXCJIYWxmIEZyYW1lcmF0ZVwiO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZihnYW1lLnNreU1vZD09PTEpIHtcclxuXHRcdFx0dGVtcFNreU1vZGVUZXh0ID0gXCJGdWxsIEZyYW1lcmF0ZVwiO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHRlbXBTa3lNb2RlVGV4dCA9IFwiU29saWQgQ29sb3JcIjtcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgdGVtcFBhcnRpY2xlVGV4dDtcclxuXHJcblx0XHRpZihnYW1lLnBhcnRpY2xlTXVsdGlwbGllcj09PTIpIHtcclxuXHRcdFx0dGVtcFBhcnRpY2xlVGV4dCA9IFwiRG91YmxlXCI7XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmKGdhbWUucGFydGljbGVNdWx0aXBsaWVyPT09MSkge1xyXG5cdFx0XHR0ZW1wUGFydGljbGVUZXh0ID0gXCJOb3JtYWxcIjtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHR0ZW1wUGFydGljbGVUZXh0ID0gXCJNaW5pbWFsXCI7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vIG1ha2Ugc29tZSBidXR0b25zIHdpdGggZGVmYXVsdCBwb3NpdGlvbnNcclxuXHRcdHRoaXMuYnV0dG9ucyA9IFtcclxuXHRcdFx0bmV3IEJ1dHRvbihmb250LCBgU2t5OiAke3RlbXBTa3lNb2RlVGV4dH1gLCBcIkNoYW5nZSB0aGUgYXBwZWFyYW5jZSBvZiB0aGUgc2t5LlwiLCAwLCAwLCAwLCAwLCAoKSA9PiB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJza3kgdG9nZ2xlXCIpO1xyXG5cdFx0XHRcdGlmKHRoaXMuYnV0dG9uc1swXS50eHQgPT09IFwiU2t5OiBIYWxmIEZyYW1lcmF0ZVwiKXtcclxuXHRcdFx0XHRcdHRoaXMuYnV0dG9uc1swXS50eHQgPSBcIlNreTogRnVsbCBGcmFtZXJhdGVcIjtcclxuXHRcdFx0XHRcdGdhbWUuc2t5TW9kID0gMTtcclxuXHRcdFx0XHRcdGdhbWUuc2t5VG9nZ2xlID0gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSBpZih0aGlzLmJ1dHRvbnNbMF0udHh0ID09PSBcIlNreTogRnVsbCBGcmFtZXJhdGVcIikge1xyXG5cdFx0XHRcdFx0dGhpcy5idXR0b25zWzBdLnR4dCA9IFwiU2t5OiBTb2xpZCBDb2xvclwiO1xyXG5cdFx0XHRcdFx0Z2FtZS5za3lUb2dnbGUgPSBmYWxzZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLmJ1dHRvbnNbMF0udHh0ID0gXCJTa3k6IEhhbGYgRnJhbWVyYXRlXCI7XHJcblx0XHRcdFx0XHRnYW1lLnNreU1vZCA9IDI7XHJcblx0XHRcdFx0XHRnYW1lLnNreVRvZ2dsZSA9IHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KSxcclxuXHRcdFx0bmV3IEJ1dHRvbihmb250LCBgUGFydGljbGVzOiAke3RlbXBQYXJ0aWNsZVRleHR9YCwgXCJDaGFuZ2UgdGhlIGFtb3VudCBvZiBwYXJ0aWNsZXNcIiwgMCwgMCwgMCwgMCwgKCkgPT4ge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKFwicGFydGljbGVzXCIpO1xyXG5cdFx0XHRcdGlmKHRoaXMuYnV0dG9uc1sxXS50eHQgPT09IFwiUGFydGljbGVzOiBOb3JtYWxcIil7XHJcblx0XHRcdFx0XHR0aGlzLmJ1dHRvbnNbMV0udHh0ID0gXCJQYXJ0aWNsZXM6IERvdWJsZVwiO1xyXG5cdFx0XHRcdFx0Z2FtZS5wYXJ0aWNsZU11bHRpcGxpZXIgPSAyO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIGlmKHRoaXMuYnV0dG9uc1sxXS50eHQgPT09IFwiUGFydGljbGVzOiBEb3VibGVcIikge1xyXG5cdFx0XHRcdFx0dGhpcy5idXR0b25zWzFdLnR4dCA9IFwiUGFydGljbGVzOiBNaW5pbWFsXCI7XHJcblx0XHRcdFx0XHRnYW1lLnBhcnRpY2xlTXVsdGlwbGllciA9IDAuNTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLmJ1dHRvbnNbMV0udHh0ID0gXCJQYXJ0aWNsZXM6IE5vcm1hbFwiO1xyXG5cdFx0XHRcdFx0Z2FtZS5wYXJ0aWNsZU11bHRpcGxpZXIgPSAxO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSksXHJcblx0XHRcdG5ldyBCdXR0b24oZm9udCwgXCJCYWNrXCIsIFwiUmV0dXJuIHRvIHRoZSBtYWluIG1lbnUuXCIsIDAsIDAsIDAsIDAsICgpID0+IHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhcIm1haW4gbWVudVwiKTtcclxuXHRcdFx0XHRnYW1lLmN1cnJlbnRVaSA9IG5ldyBPcHRpb25zTWVudShmb250LCB0aXRsZUZvbnQsIHByZXZpb3VzTWVudSk7XHJcblx0XHRcdH0pXHJcblx0XHRdO1xyXG5cdFx0Ly8gdXBkYXRlIHRoZSBzaXplIG9mIHRoZSBlbGVtZW50cyBiYXNlZCBvbiB0aGUgaW5pdGlhbCBzY3JlZW4gc2l6ZVxyXG5cdFx0dGhpcy53aW5kb3dVcGRhdGUoKTtcclxuXHR9XHJcblxyXG5cdHJlbmRlcih0YXJnZXQ6IHA1LCB1cHNjYWxlU2l6ZTogbnVtYmVyKTogdm9pZCB7XHJcblxyXG5cdFx0Ly8gcmVuZGVyIHRoZSByZWN0YW5ndWxhciBpbWFnZVxyXG5cdFx0dGhpcy5mcmFtZS5yZW5kZXIodGFyZ2V0LCB1cHNjYWxlU2l6ZSk7XHJcblxyXG5cdFx0Ly8gbG9vcCB0aHJvdWdoIHRoZSBidXR0b25zIGFycmF5IGFuZCByZW5kZXIgZWFjaCBvbmUuXHJcblx0XHR0aGlzLmJ1dHRvbnMuZm9yRWFjaChidXR0b24gPT4ge1xyXG5cdFx0XHRidXR0b24ucmVuZGVyKHRhcmdldCwgdXBzY2FsZVNpemUpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHR3aW5kb3dVcGRhdGUoKSB7XHJcblx0XHQvLyBzZXQgdGhlIHBvc2l0aW9uIG9mIHRoZSBmcmFtZVxyXG5cdFx0dGhpcy5mcmFtZS54ID0gZ2FtZS53aWR0aCAvIDIgLSAyMDAgLyAyICogZ2FtZS51cHNjYWxlU2l6ZTsvLyBjZW50ZXIgdGhlIGZyYW1lIGluIHRoZSBjZW50ZXIgb2YgdGhlIHNjcmVlblxyXG5cdFx0dGhpcy5mcmFtZS55ID0gZ2FtZS5oZWlnaHQgLyAyIC0gNTYgKiBnYW1lLnVwc2NhbGVTaXplO1xyXG5cdFx0dGhpcy5mcmFtZS53ID0gMjAwICogZ2FtZS51cHNjYWxlU2l6ZTtcclxuXHRcdHRoaXMuZnJhbWUuaCA9IDQ4ICogZ2FtZS51cHNjYWxlU2l6ZTtcclxuXHJcblx0XHQvLyBzZXQgdGhlIHBvc2l0aW9ucyBvZiBhbGwgdGhlIGJ1dHRvbnNcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5idXR0b25zLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHRoaXMuYnV0dG9uc1tpXS54ID0gZ2FtZS53aWR0aCAvIDIgLSAxOTIgLyAyICogZ2FtZS51cHNjYWxlU2l6ZTtcclxuXHRcdFx0dGhpcy5idXR0b25zW2ldLnkgPSBnYW1lLmhlaWdodCAvIDIgKyAyMCAqIGkgKiBnYW1lLnVwc2NhbGVTaXplO1xyXG5cdFx0XHR0aGlzLmJ1dHRvbnNbaV0udyA9IDE5MiAqIGdhbWUudXBzY2FsZVNpemU7XHJcblx0XHRcdHRoaXMuYnV0dG9uc1tpXS5oID0gMTYgKiBnYW1lLnVwc2NhbGVTaXplO1xyXG5cdFx0XHR0aGlzLmJ1dHRvbnNbaV0udXBkYXRlTW91c2VPdmVyKGdhbWUubW91c2VYLCBnYW1lLm1vdXNlWSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxufSIsImltcG9ydCBQNSBmcm9tICdwNSc7XHJcbmltcG9ydCB7IFRpY2thYmxlIH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9UaWNrYWJsZSc7XHJcbmltcG9ydCB7IFJlbmRlcmFibGUgfSBmcm9tICcuLi9pbnRlcmZhY2VzL1JlbmRlcmFibGUnO1xyXG5pbXBvcnQgeyBnYW1lLCBHYW1lIH0gZnJvbSAnLi4vR2FtZSc7XHJcbmltcG9ydCB7IFBsYXllckxvY2FsIH0gZnJvbSAnLi4vcGxheWVyL1BsYXllckxvY2FsJztcclxuaW1wb3J0IHsgU2VydmVyRW50aXR5IH0gZnJvbSAnLi9lbnRpdGllcy9TZXJ2ZXJFbnRpdHknO1xyXG5pbXBvcnQgeyBTbmFwc2hvdEludGVycG9sYXRpb24gfSBmcm9tICdAZ2Vja29zLmlvL3NuYXBzaG90LWludGVycG9sYXRpb24nO1xyXG5pbXBvcnQgeyBFbnRpdHksIFNuYXBzaG90IH0gZnJvbSAnQGdlY2tvcy5pby9zbmFwc2hvdC1pbnRlcnBvbGF0aW9uL2xpYi90eXBlcyc7XHJcbmltcG9ydCB7IFdvcmxkVGlsZXMgfSBmcm9tICcuL1dvcmxkVGlsZXMnO1xyXG5pbXBvcnQgeyBUaWxlVHlwZSB9IGZyb20gJy4uLy4uL2dsb2JhbC9UaWxlJztcclxuaW1wb3J0IHsgSW52ZW50b3J5IH0gZnJvbSAnLi4vcGxheWVyL0ludmVudG9yeSc7XHJcbmltcG9ydCB7IFRpbGVFbnRpdHlQYXlsb2FkIH0gZnJvbSAnLi4vLi4vZ2xvYmFsL1RpbGVFbnRpdHknO1xyXG5pbXBvcnQgeyBDbGllbnRUaWxlRW50aXR5IH0gZnJvbSAnLi9lbnRpdGllcy9UaWxlRW50aXR5JztcclxuaW1wb3J0IHsgV29ybGRBc3NldHMgfSBmcm9tICcuLi9hc3NldHMvQXNzZXRzJztcclxuXHJcbmV4cG9ydCBjbGFzcyBXb3JsZCBpbXBsZW1lbnRzIFRpY2thYmxlLCBSZW5kZXJhYmxlIHtcclxuXHR3aWR0aDogbnVtYmVyOyAvLyB3aWR0aCBvZiB0aGUgd29ybGQgaW4gdGlsZXNcclxuXHRoZWlnaHQ6IG51bWJlcjsgLy8gaGVpZ2h0IG9mIHRoZSB3b3JsZCBpbiB0aWxlc1xyXG5cclxuXHR0aWxlTGF5ZXI6IFA1LkdyYXBoaWNzOyAvLyBUaWxlIGxheWVyIGdyYXBoaWNcclxuXHJcblx0d29ybGRUaWxlczogKFRpbGVUeXBlIHwgc3RyaW5nKVtdOyAvLyBudW1iZXIgZm9yIGVhY2ggdGlsZXMgaW4gdGhlIHdvcmxkIGV4OiBbMSwgMSwgMCwgMSwgMiwgMCwgMCwgMS4uLiAgXSBtZWFucyBzbm93LCBzbm93LCBhaXIsIHNub3csIGljZSwgYWlyLCBhaXIsIHNub3cuLi4gIHN0cmluZyBpcyBpZCBmb3IgdGlsZSBlbnRpdHkgb2NjdXB5aW5nIHRoYXQgdGlsZVxyXG5cclxuXHRwbGF5ZXI6IFBsYXllckxvY2FsO1xyXG5cclxuXHRpbnZlbnRvcnk6IEludmVudG9yeTtcclxuXHJcblx0ZW50aXRpZXM6IHsgW2lkOiBzdHJpbmddOiBTZXJ2ZXJFbnRpdHkgfSA9IHt9O1xyXG5cclxuXHR0aWxlRW50aXRpZXM6IHsgW2lkOiBzdHJpbmddOiBDbGllbnRUaWxlRW50aXR5IH07XHJcblxyXG5cdHNuYXBzaG90SW50ZXJwb2xhdGlvbjogU25hcHNob3RJbnRlcnBvbGF0aW9uO1xyXG5cclxuXHRjb25zdHJ1Y3RvcihcclxuXHRcdHdpZHRoOiBudW1iZXIsXHJcblx0XHRoZWlnaHQ6IG51bWJlcixcclxuXHRcdHRpbGVzOiAoVGlsZVR5cGUgfCBzdHJpbmcpW10sXHJcblx0XHR0aWxlRW50aXRpZXM6IHsgW2lkOiBzdHJpbmddOiBDbGllbnRUaWxlRW50aXR5IH0sXHJcblx0KSB7XHJcblx0XHQvLyBJbml0aWFsaXplIHRoZSB3b3JsZCB3aXRoIHRoZSB0aWxlcyBhbmQgZGltZW5zaW9ucyBmcm9tIHRoZSBzZXJ2ZXJcclxuXHRcdHRoaXMud2lkdGggPSB3aWR0aDtcclxuXHRcdHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG5cdFx0dGhpcy53b3JsZFRpbGVzID0gdGlsZXM7XHJcblx0XHR0aGlzLnRpbGVFbnRpdGllcyA9IHRpbGVFbnRpdGllcztcclxuXHJcblx0XHR0aGlzLnNuYXBzaG90SW50ZXJwb2xhdGlvbiA9IG5ldyBTbmFwc2hvdEludGVycG9sYXRpb24oKTtcclxuXHRcdHRoaXMuc25hcHNob3RJbnRlcnBvbGF0aW9uLmludGVycG9sYXRpb25CdWZmZXIuc2V0KFxyXG5cdFx0XHQoMTAwMCAvIGdhbWUubmV0TWFuYWdlci5wbGF5ZXJUaWNrUmF0ZSkqMyxcclxuXHRcdCk7XHJcblx0XHR0aGlzLnNuYXBzaG90SW50ZXJwb2xhdGlvbi5jb25maWcuYXV0b0NvcnJlY3RUaW1lT2Zmc2V0ID0gdHJ1ZTtcclxuXHJcblx0XHQvLyBkZWZpbmUgdGhlIHA1LkdyYXBoaWNzIG9iamVjdHMgdGhhdCBob2xkIGFuIGltYWdlIG9mIHRoZSB0aWxlcyBvZiB0aGUgd29ybGQuICBUaGVzZSBhY3Qgc29ydCBvZiBsaWtlIGEgdmlydHVhbCBjYW52YXMgYW5kIGNhbiBiZSBkcmF3biBvbiBqdXN0IGxpa2UgYSBub3JtYWwgY2FudmFzIGJ5IHVzaW5nIHRpbGVMYXllci5yZWN0KCk7LCB0aWxlTGF5ZXIuZWxsaXBzZSgpOywgdGlsZUxheWVyLmZpbGwoKTssIGV0Yy5cclxuXHRcdHRoaXMudGlsZUxheWVyID0gZ2FtZS5jcmVhdGVHcmFwaGljcyhcclxuXHRcdFx0dGhpcy53aWR0aCAqIGdhbWUuVElMRV9XSURUSCxcclxuXHRcdFx0dGhpcy5oZWlnaHQgKiBnYW1lLlRJTEVfSEVJR0hULFxyXG5cdFx0KTtcclxuXHRcdHRoaXMubG9hZFdvcmxkKCk7XHJcblx0fVxyXG5cclxuXHR0aWNrKGdhbWU6IEdhbWUpIHtcclxuXHRcdGlmICh0aGlzLnBsYXllciAhPT0gdW5kZWZpbmVkKVxyXG5cdFx0XHRnYW1lLmNvbm5lY3Rpb24uZW1pdCgncGxheWVyVXBkYXRlJywgdGhpcy5wbGF5ZXIueCwgdGhpcy5wbGF5ZXIueSk7XHJcblx0fVxyXG5cclxuXHRyZW5kZXIodGFyZ2V0OiBQNSwgdXBzY2FsZVNpemU6IG51bWJlcikge1xyXG5cdFx0Ly8gZHJhdyB0aGUgdGlsZXMgbGF5ZXIgb250byB0aGUgc2NyZWVuXHJcblx0XHR0YXJnZXQuaW1hZ2UoXHJcblx0XHRcdHRoaXMudGlsZUxheWVyLFxyXG5cdFx0XHQwLFxyXG5cdFx0XHQwLFxyXG5cdFx0XHQoZ2FtZS53aWR0aCAvIHVwc2NhbGVTaXplKSAqIHVwc2NhbGVTaXplLFxyXG5cdFx0XHQoZ2FtZS5oZWlnaHQgLyB1cHNjYWxlU2l6ZSkgKiB1cHNjYWxlU2l6ZSxcclxuXHRcdFx0Z2FtZS5pbnRlcnBvbGF0ZWRDYW1YICogZ2FtZS5USUxFX1dJRFRILFxyXG5cdFx0XHRnYW1lLmludGVycG9sYXRlZENhbVkgKiBnYW1lLlRJTEVfV0lEVEgsXHJcblx0XHRcdGdhbWUud2lkdGggLyB1cHNjYWxlU2l6ZSxcclxuXHRcdFx0Z2FtZS5oZWlnaHQgLyB1cHNjYWxlU2l6ZSxcclxuXHRcdCk7XHJcblxyXG5cdFx0dGhpcy5yZW5kZXJQbGF5ZXJzKHRhcmdldCwgdXBzY2FsZVNpemUpO1xyXG5cclxuXHRcdC8vIHRhcmdldC5zdHJva2UoMCk7XHJcblx0XHQvLyB0YXJnZXQuc3Ryb2tlV2VpZ2h0KDQpO1xyXG5cdFx0Ly8gdGFyZ2V0Lm5vRmlsbCgpO1xyXG5cdFx0Ly8gdGFyZ2V0LnJlY3QodGFyZ2V0LndpZHRoIC0gdGhpcy53aWR0aCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xyXG5cclxuXHRcdC8vIHRhcmdldC5pbWFnZShcclxuXHRcdC8vIFx0dGhpcy50aWxlTGF5ZXIsXHJcblx0XHQvLyBcdHRhcmdldC53aWR0aCAtIHRoaXMud2lkdGgsXHJcblx0XHQvLyBcdDAsXHJcblx0XHQvLyBcdHRoaXMud2lkdGgsXHJcblx0XHQvLyBcdHRoaXMuaGVpZ2h0LFxyXG5cdFx0Ly8gKTtcclxuXHR9XHJcblxyXG5cdHVwZGF0ZVBsYXllcnMoc25hcHNob3Q6IFNuYXBzaG90KSB7XHJcblx0XHR0aGlzLnNuYXBzaG90SW50ZXJwb2xhdGlvbi5zbmFwc2hvdC5hZGQoc25hcHNob3QpO1xyXG5cdH1cclxuXHJcblx0dXBkYXRlVGlsZSh0aWxlSW5kZXg6IG51bWJlciwgdGlsZTogVGlsZVR5cGUpIHtcclxuXHRcdC8vIFVwZGF0ZSB0aGUgdGlsZSBhbmQgdGhlIDQgbmVpZ2hib3VyaW5nIHRpbGVzXHJcblx0XHR0aGlzLndvcmxkVGlsZXNbdGlsZUluZGV4XSA9IHRpbGU7XHJcblxyXG5cdFx0Ly8gZXJhc2UgdGhlIGJyb2tlbiB0aWxlcyBhbmQgaXRzIHN1cnJvdW5kaW5nIHRpbGVzIGlmIHRoZXkncmUgdGlsZXNcclxuXHRcdHRoaXMudGlsZUxheWVyLmVyYXNlKCk7XHJcblx0XHR0aGlzLnRpbGVMYXllci5ub1N0cm9rZSgpO1xyXG5cdFx0dGhpcy50aWxlTGF5ZXIucmVjdChcclxuXHRcdFx0Ly9jZW50ZXJcclxuXHRcdFx0KHRpbGVJbmRleCAlIHRoaXMud2lkdGgpICogZ2FtZS5USUxFX1dJRFRILFxyXG5cdFx0XHRNYXRoLmZsb29yKHRpbGVJbmRleCAvIHRoaXMud2lkdGgpICogZ2FtZS5USUxFX0hFSUdIVCxcclxuXHRcdFx0Z2FtZS5USUxFX1dJRFRILFxyXG5cdFx0XHRnYW1lLlRJTEVfSEVJR0hULFxyXG5cdFx0KTtcclxuXHJcblx0XHRpZiAoXHJcblx0XHRcdHRpbGVJbmRleCAtIDEgPj0gMCAmJlxyXG5cdFx0XHR0eXBlb2YgdGhpcy53b3JsZFRpbGVzW3RpbGVJbmRleCAtIDFdICE9PSAnc3RyaW5nJyAmJlxyXG5cdFx0XHR0aGlzLndvcmxkVGlsZXNbdGlsZUluZGV4IC0gMV0gIT09IFRpbGVUeXBlLkFpclxyXG5cdFx0KSB7XHJcblx0XHRcdHRoaXMudGlsZUxheWVyLnJlY3QoXHJcblx0XHRcdFx0Ly9sZWZ0XHJcblx0XHRcdFx0KCh0aWxlSW5kZXggJSB0aGlzLndpZHRoKSAtIDEpICogZ2FtZS5USUxFX1dJRFRILFxyXG5cdFx0XHRcdE1hdGguZmxvb3IodGlsZUluZGV4IC8gdGhpcy53aWR0aCkgKiBnYW1lLlRJTEVfSEVJR0hULFxyXG5cdFx0XHRcdGdhbWUuVElMRV9XSURUSCxcclxuXHRcdFx0XHRnYW1lLlRJTEVfSEVJR0hULFxyXG5cdFx0XHQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChcclxuXHRcdFx0dGlsZUluZGV4ICsgMSA8IHRoaXMud2lkdGggKiB0aGlzLmhlaWdodCAmJlxyXG5cdFx0XHR0eXBlb2YgdGhpcy53b3JsZFRpbGVzW3RpbGVJbmRleCArIDFdICE9PSAnc3RyaW5nJyAmJlxyXG5cdFx0XHR0aGlzLndvcmxkVGlsZXNbdGlsZUluZGV4ICsgMV0gIT09IFRpbGVUeXBlLkFpclxyXG5cdFx0KSB7XHJcblx0XHRcdHRoaXMudGlsZUxheWVyLnJlY3QoXHJcblx0XHRcdFx0Ly9yaWdodFxyXG5cdFx0XHRcdCgodGlsZUluZGV4ICUgdGhpcy53aWR0aCkgLSAxKSAqIGdhbWUuVElMRV9XSURUSCxcclxuXHRcdFx0XHRNYXRoLmZsb29yKHRpbGVJbmRleCAvIHRoaXMud2lkdGgpICogZ2FtZS5USUxFX0hFSUdIVCxcclxuXHRcdFx0XHRnYW1lLlRJTEVfV0lEVEgsXHJcblx0XHRcdFx0Z2FtZS5USUxFX0hFSUdIVCxcclxuXHRcdFx0KTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoXHJcblx0XHRcdHRpbGVJbmRleCAtIHRoaXMud2lkdGggPj0gMCAmJlxyXG5cdFx0XHR0eXBlb2YgdGhpcy53b3JsZFRpbGVzW3RpbGVJbmRleCAtIHRoaXMud2lkdGhdICE9PSAnc3RyaW5nJyAmJlxyXG5cdFx0XHR0aGlzLndvcmxkVGlsZXNbdGlsZUluZGV4IC0gdGhpcy53aWR0aF0gIT09IFRpbGVUeXBlLkFpclxyXG5cdFx0KSB7XHJcblx0XHRcdHRoaXMudGlsZUxheWVyLnJlY3QoXHJcblx0XHRcdFx0Ly90b3BcclxuXHRcdFx0XHQodGlsZUluZGV4ICUgdGhpcy53aWR0aCkgKiBnYW1lLlRJTEVfV0lEVEgsXHJcblx0XHRcdFx0KE1hdGguZmxvb3IodGlsZUluZGV4IC8gdGhpcy53aWR0aCkgLSAxKSAqIGdhbWUuVElMRV9IRUlHSFQsXHJcblx0XHRcdFx0Z2FtZS5USUxFX1dJRFRILFxyXG5cdFx0XHRcdGdhbWUuVElMRV9IRUlHSFQsXHJcblx0XHRcdCk7XHJcblx0XHR9XHJcblx0XHRpZiAoXHJcblx0XHRcdHRpbGVJbmRleCArIHRoaXMud2lkdGggPCB0aGlzLndpZHRoICogdGhpcy5oZWlnaHQgJiZcclxuXHRcdFx0dHlwZW9mIHRoaXMud29ybGRUaWxlc1t0aWxlSW5kZXggKyB0aGlzLndpZHRoXSAhPT0gJ3N0cmluZycgJiZcclxuXHRcdFx0dGhpcy53b3JsZFRpbGVzW3RpbGVJbmRleCArIHRoaXMud2lkdGhdICE9PSBUaWxlVHlwZS5BaXJcclxuXHRcdCkge1xyXG5cdFx0XHR0aGlzLnRpbGVMYXllci5yZWN0KFxyXG5cdFx0XHRcdC8vYm90dG9tXHJcblx0XHRcdFx0KHRpbGVJbmRleCAlIHRoaXMud2lkdGgpICogZ2FtZS5USUxFX1dJRFRILFxyXG5cdFx0XHRcdChNYXRoLmZsb29yKHRpbGVJbmRleCAvIHRoaXMud2lkdGgpICsgMSkgKiBnYW1lLlRJTEVfSEVJR0hULFxyXG5cdFx0XHRcdGdhbWUuVElMRV9XSURUSCxcclxuXHRcdFx0XHRnYW1lLlRJTEVfSEVJR0hULFxyXG5cdFx0XHQpO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy50aWxlTGF5ZXIubm9FcmFzZSgpO1xyXG5cclxuXHRcdC8vIHJlZHJhdyB0aGUgbmVpZ2hib3JpbmcgdGlsZXNcclxuXHRcdHRoaXMuZHJhd1RpbGUodGlsZUluZGV4KTtcclxuXHRcdHRoaXMuZHJhd1RpbGUodGlsZUluZGV4ICsgdGhpcy53aWR0aCk7XHJcblx0XHR0aGlzLmRyYXdUaWxlKHRpbGVJbmRleCAtIDEpO1xyXG5cdFx0dGhpcy5kcmF3VGlsZSh0aWxlSW5kZXggLSB0aGlzLndpZHRoKTtcclxuXHRcdHRoaXMuZHJhd1RpbGUodGlsZUluZGV4ICsgMSk7XHJcblx0fVxyXG5cclxuXHRyZW5kZXJQbGF5ZXJzKHRhcmdldDogUDUsIHVwc2NhbGVTaXplOiBudW1iZXIpIHtcclxuXHRcdC8vIENhbGN1bGF0ZSB0aGUgaW50ZXJwb2xhdGVkIHBvc2l0aW9uIG9mIGFsbCB1cGRhdGVkIGVudGl0aWVzXHJcblx0XHRjb25zdCBwb3NpdGlvblN0YXRlczogeyBbaWQ6IHN0cmluZ106IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfSB9ID0ge307XHJcblx0XHR0cnkge1xyXG5cdFx0XHRjb25zdCBjYWxjdWxhdGVkU25hcHNob3QgPVxyXG5cdFx0XHRcdHRoaXMuc25hcHNob3RJbnRlcnBvbGF0aW9uLmNhbGNJbnRlcnBvbGF0aW9uKCd4IHknKTtcclxuXHRcdFx0aWYgKCFjYWxjdWxhdGVkU25hcHNob3QpIHtcclxuXHRcdFx0XHRjb25zb2xlLndhcm4oXCJubyBjYWxjdWxhdGVkIHNuYXBzaG90XCIpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGNvbnN0IHN0YXRlID0gY2FsY3VsYXRlZFNuYXBzaG90LnN0YXRlO1xyXG5cdFx0XHRcdGlmICghc3RhdGUpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUud2FybihcIm5vIGNhbGN1bGF0ZWQgc25hcHNob3Qgc3RhdGVcIik7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdC8vIFRoZSBuZXcgcG9zaXRpb25zIG9mIGVudGl0aWVzIGFzIG9iamVjdFxyXG5cdFx0XHRcdFx0c3RhdGUuZm9yRWFjaCgoeyBpZCwgeCwgeSB9OiBFbnRpdHkgJiB7IHg6IG51bWJlcjsgeTogbnVtYmVyIH0pID0+IHtcclxuXHRcdFx0XHRcdFx0cG9zaXRpb25TdGF0ZXNbaWRdID0geyB4LCB5IH07XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0gY2F0Y2ggKGUpIHt7Y29uc29sZS53YXJuKFwiZXJyb3IgaW4gcmVuZGVyUGxheWVyc1wiKTtyZXR1cm47fX1cclxuXHJcblx0XHQvLyBSZW5kZXIgZWFjaCBlbnRpdHkgaW4gdGhlIG9yZGVyIHRoZXkgYXBwZWFyXHJcblx0XHRPYmplY3QuZW50cmllcyh0aGlzLmVudGl0aWVzKS5mb3JFYWNoKFxyXG5cdFx0XHQoZW50aXR5OiBbc3RyaW5nLCBTZXJ2ZXJFbnRpdHldKSA9PiB7XHJcblx0XHRcdFx0Y29uc3QgdXBkYXRlZFBvc2l0aW9uID0gcG9zaXRpb25TdGF0ZXNbZW50aXR5WzBdXTtcclxuXHRcdFx0XHRpZiAodXBkYXRlZFBvc2l0aW9uICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHRcdGVudGl0eVsxXS54ID0gdXBkYXRlZFBvc2l0aW9uLng7XHJcblx0XHRcdFx0XHRlbnRpdHlbMV0ueSA9IHVwZGF0ZWRQb3NpdGlvbi55O1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0ZW50aXR5WzFdLnJlbmRlcih0YXJnZXQsIHVwc2NhbGVTaXplKTtcclxuXHRcdFx0fSxcclxuXHRcdCk7XHJcblxyXG5cdFx0Ly8gUmVuZGVyIHRoZSBwbGF5ZXIgb24gdG9wXHJcblx0XHRpZiAodGhpcy5wbGF5ZXIgIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHR0aGlzLnBsYXllci5maW5kSW50ZXJwb2xhdGVkQ29vcmRpbmF0ZXMoKTtcclxuXHRcdFx0dGhpcy5wbGF5ZXIucmVuZGVyKHRhcmdldCwgdXBzY2FsZVNpemUpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0bG9hZFdvcmxkKCkge1xyXG5cdFx0dGhpcy50aWxlTGF5ZXIubm9TdHJva2UoKTtcclxuXHRcdGZvciAobGV0IHggPSAwOyB4IDwgdGhpcy5oZWlnaHQ7IHgrKykge1xyXG5cdFx0XHQvL3ggYW5kIHkgYXJlIHN3aXRjaGVkIGZvciBzb21lIHN0dXBpZCByZWFzb25cclxuXHRcdFx0Ly8gaSB3aWxsIGJlIHRoZSB5IHBvc2l0aW9uIG9mIHRpbGVzIGJlaW5nIGRyYXduXHJcblx0XHRcdGZvciAobGV0IHkgPSAwOyB5IDwgdGhpcy53aWR0aDsgeSsrKSB7XHJcblx0XHRcdFx0Y29uc3QgdGlsZVZhbCA9IHRoaXMud29ybGRUaWxlc1t4ICogdGhpcy53aWR0aCArIHldO1xyXG5cclxuXHRcdFx0XHRpZiAodHlwZW9mIHRpbGVWYWwgPT09ICdzdHJpbmcnKSB7XHJcblx0XHRcdFx0XHRpZiAodGhpcy50aWxlRW50aXRpZXMgPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yKCd0aWxlIGVudGl0eSBhcnJheSBpcyB1bmRlZmluZWQnKTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRpZiAodGhpcy50aWxlRW50aXRpZXNbdGlsZVZhbF0gPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yKFxyXG5cdFx0XHRcdFx0XHRcdCd0aWxlIGVudGl0eSAnICsgdGlsZVZhbCArICcgaXMgdW5kZWZpbmVkJyxcclxuXHRcdFx0XHRcdFx0KTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRjb25zdCB0b3BMZWZ0ID0gTWF0aC5taW4oXHJcblx0XHRcdFx0XHRcdC4uLnRoaXMudGlsZUVudGl0aWVzW3RpbGVWYWxdLmNvdmVyZWRUaWxlcyxcclxuXHRcdFx0XHRcdCk7XHJcblx0XHRcdFx0XHRpZiAoeCAqIHRoaXMud2lkdGggKyB5ID09PSB0b3BMZWZ0KSB7XHJcblx0XHRcdFx0XHRcdC8vcmVuZGVyIHRpbGUgZW50aXR5IGltYWdlXHJcblx0XHRcdFx0XHRcdGxldCBpbWcgPVxyXG5cdFx0XHRcdFx0XHRcdFdvcmxkQXNzZXRzLnRpbGVFbnRpdGllc1tcclxuXHRcdFx0XHRcdFx0XHRcdHRoaXMudGlsZUVudGl0aWVzW3RpbGVWYWxdLnBheWxvYWQudHlwZV9cclxuXHRcdFx0XHRcdFx0XHRdW3RoaXMudGlsZUVudGl0aWVzW3RpbGVWYWxdLmFuaW1GcmFtZV07XHJcblx0XHRcdFx0XHRcdFx0aW1nLnJlbmRlcihcclxuXHRcdFx0XHRcdFx0XHRcdHRoaXMudGlsZUxheWVyLFxyXG5cdFx0XHRcdFx0XHRcdFx0eSAqIGdhbWUuVElMRV9XSURUSCxcclxuXHRcdFx0XHRcdFx0XHRcdHggKiBnYW1lLlRJTEVfSEVJR0hULFxyXG5cdFx0XHRcdFx0XHRcdFx0aW1nLmltYWdlLndpZHRoLFxyXG5cdFx0XHRcdFx0XHRcdFx0aW1nLmltYWdlLmhlaWdodCxcclxuXHRcdFx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhgQWxyZWFkeSByZW5kZXJlZCAke3RpbGVWYWx9YCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmICh0aWxlVmFsICE9PSBUaWxlVHlwZS5BaXIpIHtcclxuXHRcdFx0XHRcdC8vIERyYXcgdGhlIGNvcnJlY3QgaW1hZ2UgZm9yIHRoZSB0aWxlcyBvbnRvIHRoZSB0aWxlcyBsYXllclxyXG5cdFx0XHRcdFx0Y29uc3QgdGlsZSA9IFdvcmxkVGlsZXNbdGlsZVZhbF07XHJcblxyXG5cdFx0XHRcdFx0aWYgKHRpbGUgPT09IHVuZGVmaW5lZCkgY29udGludWU7XHJcblxyXG5cdFx0XHRcdFx0aWYgKHRpbGUuY29ubmVjdGVkICYmICdyZW5kZXJUaWxlJyBpbiB0aWxlLnRleHR1cmUpIHtcclxuXHRcdFx0XHRcdFx0Ly8gUmVuZGVyIGNvbm5lY3RlZCB0aWxlc1xyXG5cdFx0XHRcdFx0XHR0aWxlLnRleHR1cmUucmVuZGVyVGlsZShcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmZpbmRUaWxlc2V0SW5kZXgoXHJcblx0XHRcdFx0XHRcdFx0XHR4LFxyXG5cdFx0XHRcdFx0XHRcdFx0eSxcclxuXHRcdFx0XHRcdFx0XHRcdHRpbGVWYWwsXHJcblx0XHRcdFx0XHRcdFx0XHRXb3JsZFRpbGVzW3RpbGVWYWxdPy5hbnlDb25uZWN0aW9uLFxyXG5cdFx0XHRcdFx0XHRcdCksXHJcblx0XHRcdFx0XHRcdFx0dGhpcy50aWxlTGF5ZXIsXHJcblx0XHRcdFx0XHRcdFx0eSAqIGdhbWUuVElMRV9XSURUSCxcclxuXHRcdFx0XHRcdFx0XHR4ICogZ2FtZS5USUxFX0hFSUdIVCxcclxuXHRcdFx0XHRcdFx0XHRnYW1lLlRJTEVfV0lEVEgsXHJcblx0XHRcdFx0XHRcdFx0Z2FtZS5USUxFX0hFSUdIVCxcclxuXHRcdFx0XHRcdFx0KTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdC8vIFJlbmRlciBub24tY29ubmVjdGVkIHRpbGVzXHJcblx0XHRcdFx0XHRcdHRpbGUudGV4dHVyZS5yZW5kZXIoXHJcblx0XHRcdFx0XHRcdFx0dGhpcy50aWxlTGF5ZXIsXHJcblx0XHRcdFx0XHRcdFx0eSAqIGdhbWUuVElMRV9XSURUSCxcclxuXHRcdFx0XHRcdFx0XHR4ICogZ2FtZS5USUxFX0hFSUdIVCxcclxuXHRcdFx0XHRcdFx0XHRnYW1lLlRJTEVfV0lEVEgsXHJcblx0XHRcdFx0XHRcdFx0Z2FtZS5USUxFX0hFSUdIVCxcclxuXHRcdFx0XHRcdFx0KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGZvcihsZXQgdGlsZUVudGl0eSBvZiBPYmplY3QudmFsdWVzKHRoaXMudGlsZUVudGl0aWVzKSkge1xyXG5cdFx0XHRsZXQgaW1nID0gV29ybGRBc3NldHMudGlsZUVudGl0aWVzW1xyXG5cdFx0XHRcdHRpbGVFbnRpdHkucGF5bG9hZC50eXBlX1xyXG5cdFx0XHRdW3RpbGVFbnRpdHkuYW5pbUZyYW1lXTtcclxuXHRcdFx0Ly9jb25zb2xlLmxvZyhcImRlYnVnMVwiKVxyXG5cdFx0XHRpbWcucmVuZGVyUmVmbGVjdGlvbihcclxuXHRcdFx0XHR0aGlzLnRpbGVMYXllcixcclxuXHRcdFx0XHRNYXRoLm1pbihcclxuXHRcdFx0XHRcdC4uLnRpbGVFbnRpdHkuY292ZXJlZFRpbGVzLFxyXG5cdFx0XHRcdCkldGhpcy53aWR0aCxcclxuXHRcdFx0XHRNYXRoLmZsb29yKE1hdGgubWF4KFxyXG5cdFx0XHRcdFx0Li4udGlsZUVudGl0eS5jb3ZlcmVkVGlsZXMsXHJcblx0XHRcdFx0KS90aGlzLndpZHRoKSsxLFxyXG5cdFx0XHRcdGltZy5pbWFnZS53aWR0aC9nYW1lLlRJTEVfV0lEVEgsXHJcblx0XHRcdFx0aW1nLmltYWdlLmhlaWdodC9nYW1lLlRJTEVfSEVJR0hULFxyXG5cdFx0XHRcdHRoaXMud29ybGRUaWxlc1xyXG5cdFx0XHQpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZHJhd1RpbGUodGlsZUluZGV4OiBudW1iZXIpIHtcclxuXHRcdGNvbnN0IHggPSB0aWxlSW5kZXggJSB0aGlzLndpZHRoO1xyXG5cdFx0Y29uc3QgeSA9IE1hdGguZmxvb3IodGlsZUluZGV4IC8gdGhpcy53aWR0aCk7XHJcblxyXG5cdFx0aWYgKHRoaXMud29ybGRUaWxlc1t0aWxlSW5kZXhdICE9PSBUaWxlVHlwZS5BaXIpIHtcclxuXHRcdFx0Ly8gRHJhdyB0aGUgY29ycmVjdCBpbWFnZSBmb3IgdGhlIHRpbGVzIG9udG8gdGhlIHRpbGVzIGxheWVyXHJcblxyXG5cdFx0XHRjb25zdCB0aWxlVmFsID0gdGhpcy53b3JsZFRpbGVzW3RpbGVJbmRleF07XHJcblxyXG5cdFx0XHRpZiAodHlwZW9mIHRpbGVWYWwgPT09ICdzdHJpbmcnKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMudGlsZUVudGl0aWVzW3RpbGVWYWxdID09PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoJ3RpbGUgZW50aXR5ICcgKyB0aWxlVmFsICsgJyBpcyB1bmRlZmluZWQnKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGNvbnN0IHRvcExlZnQgPSBNYXRoLm1pbihcclxuXHRcdFx0XHRcdC4uLnRoaXMudGlsZUVudGl0aWVzW3RpbGVWYWxdLmNvdmVyZWRUaWxlcyxcclxuXHRcdFx0XHQpO1xyXG5cdFx0XHRcdGlmICh0aWxlSW5kZXggPT09IHRvcExlZnQpIHtcclxuXHRcdFx0XHRcdC8vcmVuZGVyIHRpbGUgZW50aXR5IGltYWdlXHJcblx0XHRcdFx0XHQvL3RoaXMudGlsZUVudGl0aWVzW3RpbGVWYWxdLnJlbmRlcih0aWxlTGF5ZXIsIHgqOCwgeSo4KTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhgQWxyZWFkeSByZW5kZXJlZCAke3RpbGVWYWx9YCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Y29uc3QgdGlsZSA9IFdvcmxkVGlsZXNbdGlsZVZhbF07XHJcblxyXG5cdFx0XHQvLyBpZiB0aGUgdGlsZXMgaXMgb2ZmLXNjcmVlblxyXG5cdFx0XHRpZiAodGlsZSA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAodGlsZS5jb25uZWN0ZWQgJiYgJ3JlbmRlclRpbGUnIGluIHRpbGUudGV4dHVyZSkge1xyXG5cdFx0XHRcdGxldCB0b3BUaWxlQm9vbCA9IGZhbHNlO1xyXG5cdFx0XHRcdGxldCBsZWZ0VGlsZUJvb2wgPSBmYWxzZTtcclxuXHRcdFx0XHRsZXQgYm90dG9tVGlsZUJvb2wgPSBmYWxzZTtcclxuXHRcdFx0XHRsZXQgcmlnaHRUaWxlQm9vbCA9IGZhbHNlO1xyXG5cdFx0XHRcdGlmICh0aWxlLmFueUNvbm5lY3Rpb24pIHtcclxuXHRcdFx0XHRcdC8vIHRlc3QgaWYgdGhlIG5laWdoYm9yaW5nIHRpbGVzIGFyZSBzb2xpZFxyXG5cdFx0XHRcdFx0dG9wVGlsZUJvb2wgPVxyXG5cdFx0XHRcdFx0XHR4ID09PSAwIHx8XHJcblx0XHRcdFx0XHRcdCh0aGlzLndvcmxkVGlsZXNbKHkgLSAxKSAqIHRoaXMud2lkdGggKyB4XSAhPT1cclxuXHRcdFx0XHRcdFx0XHRUaWxlVHlwZS5BaXIgJiZcclxuXHRcdFx0XHRcdFx0XHR0eXBlb2YgdGhpcy53b3JsZFRpbGVzWyh5IC0gMSkgKiB0aGlzLndpZHRoICsgeF0gIT09XHJcblx0XHRcdFx0XHRcdFx0XHQnc3RyaW5nJyk7XHJcblx0XHRcdFx0XHRsZWZ0VGlsZUJvb2wgPVxyXG5cdFx0XHRcdFx0XHR5ID09PSAwIHx8XHJcblx0XHRcdFx0XHRcdCh0aGlzLndvcmxkVGlsZXNbeSAqIHRoaXMud2lkdGggKyB4IC0gMV0gIT09XHJcblx0XHRcdFx0XHRcdFx0VGlsZVR5cGUuQWlyICYmXHJcblx0XHRcdFx0XHRcdFx0dHlwZW9mIHRoaXMud29ybGRUaWxlc1t5ICogdGhpcy53aWR0aCArIHggLSAxXSAhPT1cclxuXHRcdFx0XHRcdFx0XHRcdCdzdHJpbmcnKTtcclxuXHRcdFx0XHRcdGJvdHRvbVRpbGVCb29sID1cclxuXHRcdFx0XHRcdFx0eCA9PT0gdGhpcy5oZWlnaHQgLSAxIHx8XHJcblx0XHRcdFx0XHRcdCh0aGlzLndvcmxkVGlsZXNbKHkgKyAxKSAqIHRoaXMud2lkdGggKyB4XSAhPT1cclxuXHRcdFx0XHRcdFx0XHRUaWxlVHlwZS5BaXIgJiZcclxuXHRcdFx0XHRcdFx0XHR0eXBlb2YgdGhpcy53b3JsZFRpbGVzWyh5ICsgMSkgKiB0aGlzLndpZHRoICsgeF0gIT09XHJcblx0XHRcdFx0XHRcdFx0XHQnc3RyaW5nJyk7XHJcblx0XHRcdFx0XHRyaWdodFRpbGVCb29sID1cclxuXHRcdFx0XHRcdFx0eSA9PT0gdGhpcy53aWR0aCAtIDEgfHxcclxuXHRcdFx0XHRcdFx0KHRoaXMud29ybGRUaWxlc1t5ICogdGhpcy53aWR0aCArIHggKyAxXSAhPT1cclxuXHRcdFx0XHRcdFx0XHRUaWxlVHlwZS5BaXIgJiZcclxuXHRcdFx0XHRcdFx0XHR0eXBlb2YgdGhpcy53b3JsZFRpbGVzW3kgKiB0aGlzLndpZHRoICsgeCArIDFdICE9PVxyXG5cdFx0XHRcdFx0XHRcdFx0J3N0cmluZycpO1xyXG5cclxuXHRcdFx0XHRcdC8vIGNvbnNvbGUubG9nKFtcImJvcmluZ1wiLCBsZWZ0VGlsZUJvb2wsIGJvdHRvbVRpbGVCb29sLCB0aGlzLndvcmxkVGlsZXNbeCAqIHRoaXMud2lkdGggKyB5ICsgMV0sIHRvcFRpbGVCb29sXSlcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Ly8gdGVzdCBpZiB0aGUgbmVpZ2hib3JpbmcgdGlsZXMgYXJlIHRoZSBzYW1lIHRpbGVcclxuXHRcdFx0XHRcdHRvcFRpbGVCb29sID1cclxuXHRcdFx0XHRcdFx0eCA9PT0gMCB8fFxyXG5cdFx0XHRcdFx0XHR0aGlzLndvcmxkVGlsZXNbKHkgLSAxKSAqIHRoaXMud2lkdGggKyB4XSA9PT0gdGlsZVZhbDtcclxuXHRcdFx0XHRcdGxlZnRUaWxlQm9vbCA9XHJcblx0XHRcdFx0XHRcdHkgPT09IDAgfHxcclxuXHRcdFx0XHRcdFx0dGhpcy53b3JsZFRpbGVzW3kgKiB0aGlzLndpZHRoICsgeCAtIDFdID09PSB0aWxlVmFsO1xyXG5cdFx0XHRcdFx0Ym90dG9tVGlsZUJvb2wgPVxyXG5cdFx0XHRcdFx0XHR4ID09PSB0aGlzLmhlaWdodCAtIDEgfHxcclxuXHRcdFx0XHRcdFx0dGhpcy53b3JsZFRpbGVzWyh5ICsgMSkgKiB0aGlzLndpZHRoICsgeF0gPT09IHRpbGVWYWw7XHJcblx0XHRcdFx0XHRyaWdodFRpbGVCb29sID1cclxuXHRcdFx0XHRcdFx0eSA9PT0gdGhpcy53aWR0aCAtIDEgfHxcclxuXHRcdFx0XHRcdFx0dGhpcy53b3JsZFRpbGVzW3kgKiB0aGlzLndpZHRoICsgeCArIDFdID09PSB0aWxlVmFsO1xyXG5cdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhbXCJmYW5jeVwiLCBsZWZ0VGlsZUJvb2wsIGJvdHRvbVRpbGVCb29sLCByaWdodFRpbGVCb29sLCB0b3BUaWxlQm9vbF0pXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRoaXMud29ybGRUaWxlc1t0aWxlSW5kZXggKyAxXSAhPT0gVGlsZVR5cGUuQWlyO1xyXG5cclxuXHRcdFx0XHQvLyBjb252ZXJ0IDQgZGlnaXQgYmluYXJ5IG51bWJlciB0byBiYXNlIDEwXHJcblx0XHRcdFx0Y29uc3QgdGlsZVNldEluZGV4ID1cclxuXHRcdFx0XHRcdDggKiArdG9wVGlsZUJvb2wgK1xyXG5cdFx0XHRcdFx0NCAqICtyaWdodFRpbGVCb29sICtcclxuXHRcdFx0XHRcdDIgKiArYm90dG9tVGlsZUJvb2wgK1xyXG5cdFx0XHRcdFx0K2xlZnRUaWxlQm9vbDtcclxuXHJcblx0XHRcdFx0Ly8gUmVuZGVyIGNvbm5lY3RlZCB0aWxlc1xyXG5cdFx0XHRcdHRpbGUudGV4dHVyZS5yZW5kZXJUaWxlKFxyXG5cdFx0XHRcdFx0dGlsZVNldEluZGV4LFxyXG5cdFx0XHRcdFx0dGhpcy50aWxlTGF5ZXIsXHJcblx0XHRcdFx0XHR4ICogZ2FtZS5USUxFX1dJRFRILFxyXG5cdFx0XHRcdFx0eSAqIGdhbWUuVElMRV9IRUlHSFQsXHJcblx0XHRcdFx0XHRnYW1lLlRJTEVfV0lEVEgsXHJcblx0XHRcdFx0XHRnYW1lLlRJTEVfSEVJR0hULFxyXG5cdFx0XHRcdCk7XHJcblx0XHRcdH0gZWxzZSBpZiAoIXRpbGUuY29ubmVjdGVkKSB7XHJcblx0XHRcdFx0Ly8gUmVuZGVyIG5vbi1jb25uZWN0ZWQgdGlsZXNcclxuXHRcdFx0XHR0aWxlLnRleHR1cmUucmVuZGVyKFxyXG5cdFx0XHRcdFx0dGhpcy50aWxlTGF5ZXIsXHJcblx0XHRcdFx0XHR4ICogZ2FtZS5USUxFX1dJRFRILFxyXG5cdFx0XHRcdFx0eSAqIGdhbWUuVElMRV9IRUlHSFQsXHJcblx0XHRcdFx0XHRnYW1lLlRJTEVfV0lEVEgsXHJcblx0XHRcdFx0XHRnYW1lLlRJTEVfSEVJR0hULFxyXG5cdFx0XHRcdCk7XHJcblx0XHRcdH1cclxuXHRcdFx0Zm9yKGxldCB0aWxlRW50aXR5IG9mIE9iamVjdC52YWx1ZXModGhpcy50aWxlRW50aXRpZXMpKSB7XHJcblx0XHRcdFx0aWYodGlsZUVudGl0eS5yZWZsZWN0ZWRUaWxlcy5pbmNsdWRlcyh0aWxlSW5kZXgpKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcInJlZmxlY3Rpb24gYXQgaW5kZXggXCIrdGlsZUluZGV4KTtcclxuXHRcdFx0XHRcdGNvbnN0IHRvcExlZnQgPSBNYXRoLm1pbihcclxuXHRcdFx0XHRcdFx0Li4udGlsZUVudGl0eS5yZWZsZWN0ZWRUaWxlcyxcclxuXHRcdFx0XHRcdCk7XHJcblx0XHRcdFx0XHRjb25zdCB0aWxlRW50aXR5UmVmbGVjdGlvbkltYWdlID0gV29ybGRBc3NldHMudGlsZUVudGl0aWVzW3RpbGVFbnRpdHkucGF5bG9hZC50eXBlX11bdGlsZUVudGl0eS5hbmltRnJhbWVdO1xyXG5cdFx0XHRcdFx0dGhpcy50aWxlTGF5ZXIuZHJhd2luZ0NvbnRleHQuZ2xvYmFsQWxwaGEgPSB0aWxlRW50aXR5UmVmbGVjdGlvbkltYWdlLnJlZmxlY3Rpdml0eUFycmF5W3RpbGVWYWxdLzI1NTsvL1RPRE8gbWFrZSB0aGlzIGJhc2VkIG9uIHRoZSB0aWxlIHJlZmxlY3Rpdml0eVxyXG5cdFx0XHRcdFx0dGhpcy50aWxlTGF5ZXIuaW1hZ2UoXHJcblx0XHRcdFx0XHRcdHRpbGVFbnRpdHlSZWZsZWN0aW9uSW1hZ2UucmVmbGVjdGlvbixcclxuXHRcdFx0XHRcdFx0eCpnYW1lLlRJTEVfV0lEVEgsXHJcblx0XHRcdFx0XHRcdHkqZ2FtZS5USUxFX0hFSUdIVCxcclxuXHRcdFx0XHRcdFx0Z2FtZS5USUxFX1dJRFRILFxyXG5cdFx0XHRcdFx0XHRnYW1lLlRJTEVfSEVJR0hULFxyXG5cdFx0XHRcdFx0XHQoeC10b3BMZWZ0JXRoaXMud2lkdGgpKmdhbWUuVElMRV9XSURUSCxcclxuXHRcdFx0XHRcdFx0KHktTWF0aC5mbG9vcih0b3BMZWZ0L3RoaXMud2lkdGgpKSpnYW1lLlRJTEVfSEVJR0hULFxyXG5cdFx0XHRcdFx0XHRnYW1lLlRJTEVfV0lEVEgsXHJcblx0XHRcdFx0XHRcdGdhbWUuVElMRV9IRUlHSFRcclxuXHRcdFx0XHRcdCk7XHJcblx0XHRcdFx0XHR0aGlzLnRpbGVMYXllci5kcmF3aW5nQ29udGV4dC5nbG9iYWxBbHBoYSA9IDEuMDtcclxuXHRcdFx0XHRcdC8vV29ybGRBc3NldHMudGlsZUVudGl0aWVzW3RpbGVFbnRpdHkudHlwZV9dW3RpbGVFbnRpdHkuYW5pbUZyYW1lXS5yZW5kZXJQYXJ0aWFsV29ybGRzcGFjZVJlZmxlY3Rpb24odGhpcy50aWxlTGF5ZXIsIHRpbGVJbmRleCV0aGlzLndpZHRoLCBNYXRoLmZsb29yKHRpbGVJbmRleC90aGlzLndpZHRoKSwgdG9wTGVmdCV0aGlzLndpZHRoLCBNYXRoLmZsb29yKHRvcExlZnQvdGhpcy53aWR0aCkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZmluZFRpbGVzZXRJbmRleChcclxuXHRcdHg6IG51bWJlcixcclxuXHRcdHk6IG51bWJlcixcclxuXHRcdHRpbGVWYWw6IFRpbGVUeXBlLFxyXG5cdFx0YW55Q29ubmVjdGlvbj86IGJvb2xlYW4sXHJcblx0KSB7XHJcblx0XHRsZXQgdG9wVGlsZUJvb2wgPSBmYWxzZTtcclxuXHRcdGxldCBsZWZ0VGlsZUJvb2wgPSBmYWxzZTtcclxuXHRcdGxldCBib3R0b21UaWxlQm9vbCA9IGZhbHNlO1xyXG5cdFx0bGV0IHJpZ2h0VGlsZUJvb2wgPSBmYWxzZTtcclxuXHRcdGlmIChhbnlDb25uZWN0aW9uKSB7XHJcblx0XHRcdC8vIHRlc3QgaWYgdGhlIG5laWdoYm9yaW5nIHRpbGVzIGFyZSBzb2xpZFxyXG5cdFx0XHR0b3BUaWxlQm9vbCA9XHJcblx0XHRcdFx0eCA9PT0gMCB8fFxyXG5cdFx0XHRcdCh0aGlzLndvcmxkVGlsZXNbKHggLSAxKSAqIHRoaXMud2lkdGggKyB5XSAhPT0gVGlsZVR5cGUuQWlyICYmLy94IGFuZCB5IGFwcGVhciB0byBiZSBzd2l0Y2hlZFxyXG5cdFx0XHRcdFx0dHlwZW9mIHRoaXMud29ybGRUaWxlc1soeCAtIDEpICogdGhpcy53aWR0aCArIHldID09XHJcblx0XHRcdFx0XHRcdCdudW1iZXInKTtcclxuXHRcdFx0bGVmdFRpbGVCb29sID1cclxuXHRcdFx0XHR5ID09PSAwIHx8XHJcblx0XHRcdFx0KHRoaXMud29ybGRUaWxlc1t4ICogdGhpcy53aWR0aCArIHkgLSAxXSAhPT0gVGlsZVR5cGUuQWlyICYmXHJcblx0XHRcdFx0XHR0eXBlb2YgdGhpcy53b3JsZFRpbGVzW3ggKiB0aGlzLndpZHRoICsgeSAtIDFdID09XHJcblx0XHRcdFx0XHRcdCdudW1iZXInKTtcclxuXHRcdFx0Ym90dG9tVGlsZUJvb2wgPVxyXG5cdFx0XHRcdHggPT09IHRoaXMuaGVpZ2h0IC0gMSB8fFxyXG5cdFx0XHRcdCh0aGlzLndvcmxkVGlsZXNbKHggKyAxKSAqIHRoaXMud2lkdGggKyB5XSAhPT0gVGlsZVR5cGUuQWlyICYmXHJcblx0XHRcdFx0XHR0eXBlb2YgdGhpcy53b3JsZFRpbGVzWyh4ICsgMSkgKiB0aGlzLndpZHRoICsgeV0gPT1cclxuXHRcdFx0XHRcdFx0J251bWJlcicpO1xyXG5cdFx0XHRyaWdodFRpbGVCb29sID1cclxuXHRcdFx0XHR5ID09PSB0aGlzLndpZHRoIC0gMSB8fFxyXG5cdFx0XHRcdCh0aGlzLndvcmxkVGlsZXNbeCAqIHRoaXMud2lkdGggKyB5ICsgMV0gIT09IFRpbGVUeXBlLkFpciAmJlxyXG5cdFx0XHRcdFx0dHlwZW9mIHRoaXMud29ybGRUaWxlc1t4ICogdGhpcy53aWR0aCArIHkgKyAxXSA9PVxyXG5cdFx0XHRcdFx0XHQnbnVtYmVyJyk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHQvLyB0ZXN0IGlmIHRoZSBuZWlnaGJvcmluZyB0aWxlcyBhcmUgdGhlIHNhbWUgdGlsZVxyXG5cdFx0XHR0b3BUaWxlQm9vbCA9XHJcblx0XHRcdFx0eCA9PT0gMCB8fFxyXG5cdFx0XHRcdHRoaXMud29ybGRUaWxlc1soeCAtIDEpICogdGhpcy53aWR0aCArIHldID09PSB0aWxlVmFsO1xyXG5cdFx0XHRsZWZ0VGlsZUJvb2wgPVxyXG5cdFx0XHRcdHkgPT09IDAgfHwgdGhpcy53b3JsZFRpbGVzW3ggKiB0aGlzLndpZHRoICsgeSAtIDFdID09PSB0aWxlVmFsO1xyXG5cdFx0XHRib3R0b21UaWxlQm9vbCA9XHJcblx0XHRcdFx0eCA9PT0gdGhpcy5oZWlnaHQgLSAxIHx8XHJcblx0XHRcdFx0dGhpcy53b3JsZFRpbGVzWyh4ICsgMSkgKiB0aGlzLndpZHRoICsgeV0gPT09IHRpbGVWYWw7XHJcblx0XHRcdHJpZ2h0VGlsZUJvb2wgPVxyXG5cdFx0XHRcdHkgPT09IHRoaXMud2lkdGggLSAxIHx8XHJcblx0XHRcdFx0dGhpcy53b3JsZFRpbGVzW3ggKiB0aGlzLndpZHRoICsgeSArIDFdID09PSB0aWxlVmFsO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGNvbnZlcnQgNCBkaWdpdCBiaW5hcnkgbnVtYmVyIHRvIGJhc2UgMTBcclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDggKiArdG9wVGlsZUJvb2wgK1xyXG5cdFx0XHQ0ICogK3JpZ2h0VGlsZUJvb2wgK1xyXG5cdFx0XHQyICogK2JvdHRvbVRpbGVCb29sICtcclxuXHRcdFx0K2xlZnRUaWxlQm9vbFxyXG5cdFx0KTtcclxuXHR9XHJcbn1cclxuIiwiaW1wb3J0IHsgSW1hZ2VSZXNvdXJjZSB9IGZyb20gJy4uL2Fzc2V0cy9yZXNvdXJjZXMvSW1hZ2VSZXNvdXJjZSc7XHJcbmltcG9ydCB7IEF1ZGlvQXNzZXRzLCBXb3JsZEFzc2V0cyB9IGZyb20gJy4uL2Fzc2V0cy9Bc3NldHMnO1xyXG5pbXBvcnQgeyBUaWxlUmVzb3VyY2UgfSBmcm9tICcuLi9hc3NldHMvcmVzb3VyY2VzL1RpbGVSZXNvdXJjZSc7XHJcbmltcG9ydCB7IFRpbGVUeXBlIH0gZnJvbSAnLi4vLi4vZ2xvYmFsL1RpbGUnO1xyXG5pbXBvcnQgeyBUaWxlRW50aXRpZXMgfSBmcm9tICcuLi8uLi9nbG9iYWwvVGlsZUVudGl0eSc7XHJcbmltcG9ydCB7IEl0ZW1UeXBlIH0gZnJvbSAnLi4vLi4vZ2xvYmFsL0ludmVudG9yeSc7XHJcbmltcG9ydCB7IEF1ZGlvUmVzb3VyY2VHcm91cCB9IGZyb20gJy4uL2Fzc2V0cy9yZXNvdXJjZXMvQXVkaW9SZXNvdXJjZUdyb3VwJztcclxuaW1wb3J0IHsgQXVkaW9SZXNvdXJjZSB9IGZyb20gJy4uL2Fzc2V0cy9yZXNvdXJjZXMvQXVkaW9SZXNvdXJjZSc7XHJcblxyXG5leHBvcnQgdHlwZSBUaWxlID0ge1xyXG4gICAgbmFtZTogc3RyaW5nO1xyXG4gICAgdGV4dHVyZTogSW1hZ2VSZXNvdXJjZSB8IFRpbGVSZXNvdXJjZTtcclxuICAgIGNvbm5lY3RlZD86IGJvb2xlYW47XHJcbiAgICBhbnlDb25uZWN0aW9uPzogYm9vbGVhbjtcclxuICAgIGNvbG9yOiBzdHJpbmc7XHJcbiAgICBmcmljdGlvbjogbnVtYmVyO1xyXG4gICAgcmVmbGVjdGl2aXR5OiBudW1iZXI7XHJcbiAgICBicmVha1NvdW5kPzogQXVkaW9SZXNvdXJjZSB8IEF1ZGlvUmVzb3VyY2VHcm91cFxyXG4gICAgcGxhY2VTb3VuZD86IEF1ZGlvUmVzb3VyY2UgfCBBdWRpb1Jlc291cmNlR3JvdXBcclxuICAgIGp1bXBTb3VuZD86IEF1ZGlvUmVzb3VyY2UgfCBBdWRpb1Jlc291cmNlR3JvdXBcclxuICAgIGxhbmRTb3VuZD86IEF1ZGlvUmVzb3VyY2UgfCBBdWRpb1Jlc291cmNlR3JvdXBcclxufVxyXG5cclxuZXhwb3J0IHR5cGUgVGlsZUVudGl0eVJlbmRlckRhdGEgPSB7XHJcbiAgICB0ZXh0dXJlOiBJbWFnZVJlc291cmNlIHwgVGlsZVJlc291cmNlO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgV29ybGRUaWxlczogUmVjb3JkPFRpbGVUeXBlLCBUaWxlIHwgdW5kZWZpbmVkPiA9IHtcclxuICAgIFtUaWxlVHlwZS5BaXJdOiB1bmRlZmluZWQsXHJcbiAgICBbVGlsZVR5cGUuU25vd106IHtcclxuICAgICAgICBuYW1lOiAnc25vdycsXHJcbiAgICAgICAgdGV4dHVyZTogV29ybGRBc3NldHMubWlkZGxlZ3JvdW5kLnRpbGVzZXRfc25vdyxcclxuICAgICAgICBjb25uZWN0ZWQ6IHRydWUsXHJcbiAgICAgICAgYW55Q29ubmVjdGlvbjogdHJ1ZSxcclxuICAgICAgICBjb2xvcjogXCIjY2FmYWZjXCIsXHJcbiAgICAgICAgZnJpY3Rpb246IDIsXHJcbiAgICAgICAgcmVmbGVjdGl2aXR5OiA2MCwvL3RoaXMgcmVmbGVjdGl2aXR5IGFjdHVhbGx5IGRvZXMgbm90aGluZyBhbmQgaW5zdGVhZCByZWZsZWN0aXZpdHkgY2FuIGJlIGNoYW5nZWQgaW5zaWRlIFJlZmxlY3RlZEltYWdlUmVzb3VyY2UudHNcclxuICAgICAgICBicmVha1NvdW5kOiBBdWRpb0Fzc2V0cy53b3JsZC5zb2Z0cGxvc2l2ZVxyXG4gICAgfSxcclxuICAgIFtUaWxlVHlwZS5JY2VdOiB7XHJcbiAgICAgICAgbmFtZTogJ2ljZScsXHJcbiAgICAgICAgdGV4dHVyZTogV29ybGRBc3NldHMubWlkZGxlZ3JvdW5kLnRpbGVzZXRfaWNlLFxyXG4gICAgICAgIGNvbm5lY3RlZDogdHJ1ZSxcclxuICAgICAgICBhbnlDb25uZWN0aW9uOiB0cnVlLFxyXG4gICAgICAgIGNvbG9yOiBcIiM3NmFkYzRcIixcclxuICAgICAgICBmcmljdGlvbjogMS41LFxyXG4gICAgICAgIHJlZmxlY3Rpdml0eTogMTUwXHJcbiAgICB9LFxyXG4gICAgW1RpbGVUeXBlLkRpcnRdOiB7XHJcbiAgICAgICAgbmFtZTogJ2RpcnQnLFxyXG4gICAgICAgIHRleHR1cmU6IFdvcmxkQXNzZXRzLm1pZGRsZWdyb3VuZC50aWxlc2V0X2RpcnQsXHJcbiAgICAgICAgY29ubmVjdGVkOiB0cnVlLFxyXG4gICAgICAgIGFueUNvbm5lY3Rpb246IHRydWUsXHJcbiAgICAgICAgY29sb3I6IFwiIzRhMmUxZVwiLFxyXG4gICAgICAgIGZyaWN0aW9uOiA0LFxyXG4gICAgICAgIHJlZmxlY3Rpdml0eTogMCxcclxuICAgICAgICBicmVha1NvdW5kOiBBdWRpb0Fzc2V0cy53b3JsZC50ZXh0dXJlZHBsb3NpdmVcclxuICAgIH0sXHJcbiAgICBbVGlsZVR5cGUuU3RvbmUwXToge1xyXG4gICAgICAgIG5hbWU6ICdyYXcgc3RvbmUnLFxyXG4gICAgICAgIHRleHR1cmU6IFdvcmxkQXNzZXRzLm1pZGRsZWdyb3VuZC50aWxlc2V0X3N0b25lMCxcclxuICAgICAgICBjb25uZWN0ZWQ6IHRydWUsXHJcbiAgICAgICAgYW55Q29ubmVjdGlvbjogdHJ1ZSxcclxuICAgICAgICBjb2xvcjogXCIjNDE0MjQ1XCIsXHJcbiAgICAgICAgZnJpY3Rpb246IDMsXHJcbiAgICAgICAgcmVmbGVjdGl2aXR5OiAxMFxyXG4gICAgfSxcclxuICAgIFtUaWxlVHlwZS5TdG9uZTFdOiB7XHJcbiAgICAgICAgbmFtZTogJ3N0b25lIHRpZXIgMScsXHJcbiAgICAgICAgdGV4dHVyZTogV29ybGRBc3NldHMubWlkZGxlZ3JvdW5kLnRpbGVzZXRfc3RvbmUxLFxyXG4gICAgICAgIGNvbm5lY3RlZDogdHJ1ZSxcclxuICAgICAgICBhbnlDb25uZWN0aW9uOiB0cnVlLFxyXG4gICAgICAgIGNvbG9yOiBcIiMzMTMyM2JcIixcclxuICAgICAgICBmcmljdGlvbjogMyxcclxuICAgICAgICByZWZsZWN0aXZpdHk6IDE1XHJcbiAgICB9LFxyXG4gICAgW1RpbGVUeXBlLlN0b25lMl06IHtcclxuICAgICAgICBuYW1lOiAnc3RvbmUgdGllciAyJyxcclxuICAgICAgICB0ZXh0dXJlOiBXb3JsZEFzc2V0cy5taWRkbGVncm91bmQudGlsZXNldF9zdG9uZTIsXHJcbiAgICAgICAgY29ubmVjdGVkOiB0cnVlLFxyXG4gICAgICAgIGFueUNvbm5lY3Rpb246IHRydWUsXHJcbiAgICAgICAgY29sb3I6IFwiIzMxMzIzYlwiLC8vVE9ETyBjaGFuZ2UgdGhlc2UgY29sb3JzIHRvIGJlIG1vcmUgYWNjdXJhdGVcclxuICAgICAgICBmcmljdGlvbjogMyxcclxuICAgICAgICByZWZsZWN0aXZpdHk6IDE3XHJcbiAgICB9LFxyXG4gICAgW1RpbGVUeXBlLlN0b25lM106IHtcclxuICAgICAgICBuYW1lOiAnc3RvbmUgdGllciAzJyxcclxuICAgICAgICB0ZXh0dXJlOiBXb3JsZEFzc2V0cy5taWRkbGVncm91bmQudGlsZXNldF9zdG9uZTMsXHJcbiAgICAgICAgY29ubmVjdGVkOiB0cnVlLFxyXG4gICAgICAgIGFueUNvbm5lY3Rpb246IHRydWUsXHJcbiAgICAgICAgY29sb3I6IFwiIzMxMzIzYlwiLFxyXG4gICAgICAgIGZyaWN0aW9uOiAzLFxyXG4gICAgICAgIHJlZmxlY3Rpdml0eTogMTlcclxuICAgIH0sXHJcbiAgICBbVGlsZVR5cGUuU3RvbmU0XToge1xyXG4gICAgICAgIG5hbWU6ICdzdG9uZSB0aWVyIDQnLFxyXG4gICAgICAgIHRleHR1cmU6IFdvcmxkQXNzZXRzLm1pZGRsZWdyb3VuZC50aWxlc2V0X3N0b25lNCxcclxuICAgICAgICBjb25uZWN0ZWQ6IHRydWUsXHJcbiAgICAgICAgYW55Q29ubmVjdGlvbjogdHJ1ZSxcclxuICAgICAgICBjb2xvcjogXCIjMzEzMjNiXCIsXHJcbiAgICAgICAgZnJpY3Rpb246IDMsXHJcbiAgICAgICAgcmVmbGVjdGl2aXR5OiAyMVxyXG4gICAgfSxcclxuICAgIFtUaWxlVHlwZS5TdG9uZTVdOiB7XHJcbiAgICAgICAgbmFtZTogJ3N0b25lIHRpZXIgNScsXHJcbiAgICAgICAgdGV4dHVyZTogV29ybGRBc3NldHMubWlkZGxlZ3JvdW5kLnRpbGVzZXRfc3RvbmU1LFxyXG4gICAgICAgIGNvbm5lY3RlZDogdHJ1ZSxcclxuICAgICAgICBhbnlDb25uZWN0aW9uOiB0cnVlLFxyXG4gICAgICAgIGNvbG9yOiBcIiMzMTMyM2JcIixcclxuICAgICAgICBmcmljdGlvbjogMyxcclxuICAgICAgICByZWZsZWN0aXZpdHk6IDIzXHJcbiAgICB9LFxyXG4gICAgW1RpbGVUeXBlLlN0b25lNl06IHtcclxuICAgICAgICBuYW1lOiAnc3RvbmUgdGllciA2JyxcclxuICAgICAgICB0ZXh0dXJlOiBXb3JsZEFzc2V0cy5taWRkbGVncm91bmQudGlsZXNldF9zdG9uZTYsXHJcbiAgICAgICAgY29ubmVjdGVkOiB0cnVlLFxyXG4gICAgICAgIGFueUNvbm5lY3Rpb246IHRydWUsXHJcbiAgICAgICAgY29sb3I6IFwiIzMxMzIzYlwiLFxyXG4gICAgICAgIGZyaWN0aW9uOiAzLFxyXG4gICAgICAgIHJlZmxlY3Rpdml0eTogMjVcclxuICAgIH0sXHJcbiAgICBbVGlsZVR5cGUuU3RvbmU3XToge1xyXG4gICAgICAgIG5hbWU6ICdzdG9uZSB0aWVyIDcnLFxyXG4gICAgICAgIHRleHR1cmU6IFdvcmxkQXNzZXRzLm1pZGRsZWdyb3VuZC50aWxlc2V0X3N0b25lNyxcclxuICAgICAgICBjb25uZWN0ZWQ6IHRydWUsXHJcbiAgICAgICAgYW55Q29ubmVjdGlvbjogdHJ1ZSxcclxuICAgICAgICBjb2xvcjogXCIjMzEzMjNiXCIsXHJcbiAgICAgICAgZnJpY3Rpb246IDMsXHJcbiAgICAgICAgcmVmbGVjdGl2aXR5OiAyN1xyXG4gICAgfSxcclxuICAgIFtUaWxlVHlwZS5TdG9uZThdOiB7XHJcbiAgICAgICAgbmFtZTogJ3N0b25lIHRpZXIgOCcsXHJcbiAgICAgICAgdGV4dHVyZTogV29ybGRBc3NldHMubWlkZGxlZ3JvdW5kLnRpbGVzZXRfc3RvbmU4LFxyXG4gICAgICAgIGNvbm5lY3RlZDogdHJ1ZSxcclxuICAgICAgICBhbnlDb25uZWN0aW9uOiB0cnVlLFxyXG4gICAgICAgIGNvbG9yOiBcIiMzMTMyM2JcIixcclxuICAgICAgICBmcmljdGlvbjogMyxcclxuICAgICAgICByZWZsZWN0aXZpdHk6IDI5XHJcbiAgICB9LFxyXG4gICAgW1RpbGVUeXBlLlN0b25lOV06IHtcclxuICAgICAgICBuYW1lOiAnc3RvbmUgdGllciA5JyxcclxuICAgICAgICB0ZXh0dXJlOiBXb3JsZEFzc2V0cy5taWRkbGVncm91bmQudGlsZXNldF9zdG9uZTksXHJcbiAgICAgICAgY29ubmVjdGVkOiB0cnVlLFxyXG4gICAgICAgIGFueUNvbm5lY3Rpb246IHRydWUsXHJcbiAgICAgICAgY29sb3I6IFwiIzMxMzIzYlwiLFxyXG4gICAgICAgIGZyaWN0aW9uOiAzLFxyXG4gICAgICAgIHJlZmxlY3Rpdml0eTogMzFcclxuICAgIH0sXHJcbiAgICBbVGlsZVR5cGUuVGluXToge1xyXG4gICAgICAgIG5hbWU6ICd0aW4gb3JlJyxcclxuICAgICAgICB0ZXh0dXJlOiBXb3JsZEFzc2V0cy5taWRkbGVncm91bmQudGlsZXNldF90aW4sXHJcbiAgICAgICAgY29ubmVjdGVkOiB0cnVlLFxyXG4gICAgICAgIGFueUNvbm5lY3Rpb246IGZhbHNlLFxyXG4gICAgICAgIGNvbG9yOiBcIiMzMTMyM2JcIixcclxuICAgICAgICBmcmljdGlvbjogMyxcclxuICAgICAgICByZWZsZWN0aXZpdHk6IDEwLFxyXG4gICAgICAgIGJyZWFrU291bmQ6IEF1ZGlvQXNzZXRzLndvcmxkLm1ldGFscGxvc2l2ZVxyXG4gICAgfSxcclxuICAgIFtUaWxlVHlwZS5BbHVtaW51bV06IHtcclxuICAgICAgICBuYW1lOiAnYWx1bWludW0gb3JlJyxcclxuICAgICAgICB0ZXh0dXJlOiBXb3JsZEFzc2V0cy5taWRkbGVncm91bmQudGlsZXNldF9hbHVtaW51bSxcclxuICAgICAgICBjb25uZWN0ZWQ6IHRydWUsXHJcbiAgICAgICAgYW55Q29ubmVjdGlvbjogZmFsc2UsXHJcbiAgICAgICAgY29sb3I6IFwiIzMxMzIzYlwiLFxyXG4gICAgICAgIGZyaWN0aW9uOiAzLFxyXG4gICAgICAgIHJlZmxlY3Rpdml0eTogMTcsXHJcbiAgICAgICAgYnJlYWtTb3VuZDogQXVkaW9Bc3NldHMud29ybGQubWV0YWxwbG9zaXZlXHJcbiAgICB9LFxyXG4gICAgW1RpbGVUeXBlLkdvbGRdOiB7XHJcbiAgICAgICAgbmFtZTogJ2dvbGQgb3JlJyxcclxuICAgICAgICB0ZXh0dXJlOiBXb3JsZEFzc2V0cy5taWRkbGVncm91bmQudGlsZXNldF9nb2xkLFxyXG4gICAgICAgIGNvbm5lY3RlZDogdHJ1ZSxcclxuICAgICAgICBhbnlDb25uZWN0aW9uOiBmYWxzZSxcclxuICAgICAgICBjb2xvcjogXCIjMzEzMjNiXCIsXHJcbiAgICAgICAgZnJpY3Rpb246IDMsXHJcbiAgICAgICAgcmVmbGVjdGl2aXR5OiAyMSxcclxuICAgICAgICBicmVha1NvdW5kOiBBdWRpb0Fzc2V0cy53b3JsZC5tZXRhbHBsb3NpdmVcclxuICAgIH0sXHJcbiAgICBbVGlsZVR5cGUuVGl0YW5pdW1dOiB7XHJcbiAgICAgICAgbmFtZTogJ3RpdGFuaXVtIG9yZScsXHJcbiAgICAgICAgdGV4dHVyZTogV29ybGRBc3NldHMubWlkZGxlZ3JvdW5kLnRpbGVzZXRfdGl0YW5pdW0sXHJcbiAgICAgICAgY29ubmVjdGVkOiB0cnVlLFxyXG4gICAgICAgIGFueUNvbm5lY3Rpb246IGZhbHNlLFxyXG4gICAgICAgIGNvbG9yOiBcIiMzMTMyM2JcIixcclxuICAgICAgICBmcmljdGlvbjogMyxcclxuICAgICAgICByZWZsZWN0aXZpdHk6IDI1LFxyXG4gICAgICAgIGJyZWFrU291bmQ6IEF1ZGlvQXNzZXRzLndvcmxkLm1ldGFscGxvc2l2ZVxyXG4gICAgfSxcclxuICAgIFtUaWxlVHlwZS5HcmFwZV06IHtcclxuICAgICAgICBuYW1lOiAnZ3JhcGUgb3JlJyxcclxuICAgICAgICB0ZXh0dXJlOiBXb3JsZEFzc2V0cy5taWRkbGVncm91bmQudGlsZXNldF9ncmFwZSxcclxuICAgICAgICBjb25uZWN0ZWQ6IHRydWUsXHJcbiAgICAgICAgYW55Q29ubmVjdGlvbjogZmFsc2UsXHJcbiAgICAgICAgY29sb3I6IFwiIzMxMzIzYlwiLFxyXG4gICAgICAgIGZyaWN0aW9uOiAzLFxyXG4gICAgICAgIHJlZmxlY3Rpdml0eTogMjksXHJcbiAgICAgICAgYnJlYWtTb3VuZDogQXVkaW9Bc3NldHMud29ybGQubWV0YWxwbG9zaXZlXHJcbiAgICB9LFxyXG4gICAgW1RpbGVUeXBlLldvb2QwXToge1xyXG4gICAgICAgIG5hbWU6ICdyYXcgd29vZCcsXHJcbiAgICAgICAgdGV4dHVyZTogV29ybGRBc3NldHMubWlkZGxlZ3JvdW5kLnRpbGVzZXRfd29vZDAsXHJcbiAgICAgICAgY29ubmVjdGVkOiB0cnVlLFxyXG4gICAgICAgIGFueUNvbm5lY3Rpb246IHRydWUsXHJcbiAgICAgICAgY29sb3I6IFwiI2E3NzE0NVwiLFxyXG4gICAgICAgIGZyaWN0aW9uOiAzLFxyXG4gICAgICAgIHJlZmxlY3Rpdml0eTogNVxyXG4gICAgfSxcclxuICAgIFtUaWxlVHlwZS5Xb29kMV06IHtcclxuICAgICAgICBuYW1lOiAnd29vZCB0aWVyIDEnLFxyXG4gICAgICAgIHRleHR1cmU6IFdvcmxkQXNzZXRzLm1pZGRsZWdyb3VuZC50aWxlc2V0X3dvb2QxLFxyXG4gICAgICAgIGNvbm5lY3RlZDogdHJ1ZSxcclxuICAgICAgICBhbnlDb25uZWN0aW9uOiB0cnVlLFxyXG4gICAgICAgIGNvbG9yOiBcIiNhNzcxNDVcIixcclxuICAgICAgICBmcmljdGlvbjogMyxcclxuICAgICAgICByZWZsZWN0aXZpdHk6IDVcclxuICAgIH0sXHJcbiAgICBbVGlsZVR5cGUuV29vZDJdOiB7XHJcbiAgICAgICAgbmFtZTogJ3dvb2QgdGllciAyJyxcclxuICAgICAgICB0ZXh0dXJlOiBXb3JsZEFzc2V0cy5taWRkbGVncm91bmQudGlsZXNldF93b29kMixcclxuICAgICAgICBjb25uZWN0ZWQ6IHRydWUsXHJcbiAgICAgICAgYW55Q29ubmVjdGlvbjogdHJ1ZSxcclxuICAgICAgICBjb2xvcjogXCIjYTc3MTQ1XCIsXHJcbiAgICAgICAgZnJpY3Rpb246IDMsXHJcbiAgICAgICAgcmVmbGVjdGl2aXR5OiA1XHJcbiAgICB9LFxyXG4gICAgW1RpbGVUeXBlLldvb2QzXToge1xyXG4gICAgICAgIG5hbWU6ICd3b29kIHRpZXIgMycsXHJcbiAgICAgICAgdGV4dHVyZTogV29ybGRBc3NldHMubWlkZGxlZ3JvdW5kLnRpbGVzZXRfd29vZDMsXHJcbiAgICAgICAgY29ubmVjdGVkOiB0cnVlLFxyXG4gICAgICAgIGFueUNvbm5lY3Rpb246IHRydWUsXHJcbiAgICAgICAgY29sb3I6IFwiI2E3NzE0NVwiLFxyXG4gICAgICAgIGZyaWN0aW9uOiAzLFxyXG4gICAgICAgIHJlZmxlY3Rpdml0eTogNVxyXG4gICAgfSxcclxuICAgIFtUaWxlVHlwZS5Xb29kNF06IHtcclxuICAgICAgICBuYW1lOiAnd29vZCB0aWVyIDQnLFxyXG4gICAgICAgIHRleHR1cmU6IFdvcmxkQXNzZXRzLm1pZGRsZWdyb3VuZC50aWxlc2V0X3dvb2Q0LFxyXG4gICAgICAgIGNvbm5lY3RlZDogdHJ1ZSxcclxuICAgICAgICBhbnlDb25uZWN0aW9uOiB0cnVlLFxyXG4gICAgICAgIGNvbG9yOiBcIiNhNzcxNDVcIixcclxuICAgICAgICBmcmljdGlvbjogMyxcclxuICAgICAgICByZWZsZWN0aXZpdHk6IDVcclxuICAgIH0sXHJcbiAgICBbVGlsZVR5cGUuV29vZDVdOiB7XHJcbiAgICAgICAgbmFtZTogJ3dvb2QgdGllciA1JyxcclxuICAgICAgICB0ZXh0dXJlOiBXb3JsZEFzc2V0cy5taWRkbGVncm91bmQudGlsZXNldF93b29kNSxcclxuICAgICAgICBjb25uZWN0ZWQ6IHRydWUsXHJcbiAgICAgICAgYW55Q29ubmVjdGlvbjogdHJ1ZSxcclxuICAgICAgICBjb2xvcjogXCIjYTc3MTQ1XCIsXHJcbiAgICAgICAgZnJpY3Rpb246IDMsXHJcbiAgICAgICAgcmVmbGVjdGl2aXR5OiA1XHJcbiAgICB9LFxyXG4gICAgW1RpbGVUeXBlLldvb2Q2XToge1xyXG4gICAgICAgIG5hbWU6ICd3b29kIHRpZXIgNicsXHJcbiAgICAgICAgdGV4dHVyZTogV29ybGRBc3NldHMubWlkZGxlZ3JvdW5kLnRpbGVzZXRfd29vZDYsXHJcbiAgICAgICAgY29ubmVjdGVkOiB0cnVlLFxyXG4gICAgICAgIGFueUNvbm5lY3Rpb246IHRydWUsXHJcbiAgICAgICAgY29sb3I6IFwiI2E3NzE0NVwiLFxyXG4gICAgICAgIGZyaWN0aW9uOiAzLFxyXG4gICAgICAgIHJlZmxlY3Rpdml0eTogNVxyXG4gICAgfSxcclxuICAgIFtUaWxlVHlwZS5Xb29kN106IHtcclxuICAgICAgICBuYW1lOiAnd29vZCB0aWVyIDcnLFxyXG4gICAgICAgIHRleHR1cmU6IFdvcmxkQXNzZXRzLm1pZGRsZWdyb3VuZC50aWxlc2V0X3dvb2Q3LFxyXG4gICAgICAgIGNvbm5lY3RlZDogdHJ1ZSxcclxuICAgICAgICBhbnlDb25uZWN0aW9uOiB0cnVlLFxyXG4gICAgICAgIGNvbG9yOiBcIiNhNzcxNDVcIixcclxuICAgICAgICBmcmljdGlvbjogMyxcclxuICAgICAgICByZWZsZWN0aXZpdHk6IDVcclxuICAgIH0sXHJcbiAgICBbVGlsZVR5cGUuV29vZDhdOiB7XHJcbiAgICAgICAgbmFtZTogJ3dvb2QgdGllciA4JyxcclxuICAgICAgICB0ZXh0dXJlOiBXb3JsZEFzc2V0cy5taWRkbGVncm91bmQudGlsZXNldF93b29kOCxcclxuICAgICAgICBjb25uZWN0ZWQ6IHRydWUsXHJcbiAgICAgICAgYW55Q29ubmVjdGlvbjogdHJ1ZSxcclxuICAgICAgICBjb2xvcjogXCIjYTc3MTQ1XCIsXHJcbiAgICAgICAgZnJpY3Rpb246IDMsXHJcbiAgICAgICAgcmVmbGVjdGl2aXR5OiA1XHJcbiAgICB9LFxyXG4gICAgW1RpbGVUeXBlLldvb2Q5XToge1xyXG4gICAgICAgIG5hbWU6ICd3b29kIHRpZXIgOScsXHJcbiAgICAgICAgdGV4dHVyZTogV29ybGRBc3NldHMubWlkZGxlZ3JvdW5kLnRpbGVzZXRfd29vZDksXHJcbiAgICAgICAgY29ubmVjdGVkOiB0cnVlLFxyXG4gICAgICAgIGFueUNvbm5lY3Rpb246IHRydWUsXHJcbiAgICAgICAgY29sb3I6IFwiI2E3NzE0NVwiLFxyXG4gICAgICAgIGZyaWN0aW9uOiAzLFxyXG4gICAgICAgIHJlZmxlY3Rpdml0eTogNVxyXG4gICAgfSxcclxufTtcclxuXHJcbi8vIGV4cG9ydCBjb25zdCBUaWxlRW50aXRpZXNSZW5kZXJEYXRhOiBSZWNvcmQ8VGlsZUVudGl0aWVzLCBUaWxlRW50aXR5UmVuZGVyRGF0YT4gPSB7XHJcbiAgICAvLyBbVGlsZUVudGl0aWVzLlRpZXIxRHJpbGxdOiB7XHJcbiAgICAgICAgLy8gdGV4dHVyZTogdW5kZWZpbmVkXHJcbiAgICAvLyB9LFxyXG4gICAgLy8gW1RpbGVFbnRpdGllcy5UaWVyMkRyaWxsXToge1xyXG4gICAgICAgIC8vIHRleHR1cmU6IHVuZGVmaW5lZFxyXG4gICAgLy8gfVxyXG4vLyB9IiwiaW1wb3J0IHsgZ2FtZSB9IGZyb20gXCIuLi8uLi9HYW1lXCI7XHJcbmltcG9ydCBTaW1wbGV4Tm9pc2UgZnJvbSBcInNpbXBsZXgtbm9pc2VcIjtcclxuaW1wb3J0IHsgSW1hZ2VSZXNvdXJjZSB9IGZyb20gXCIuLi8uLi9hc3NldHMvcmVzb3VyY2VzL0ltYWdlUmVzb3VyY2VcIjtcclxuaW1wb3J0IHsgV29ybGRBc3NldHMgfSBmcm9tIFwiLi4vLi4vYXNzZXRzL0Fzc2V0c1wiO1xyXG5pbXBvcnQgcDUgZnJvbSAncDUnXHJcblxyXG5leHBvcnQgY2xhc3MgQ2xvdWQge1xyXG4gICAgeDogbnVtYmVyO1xyXG4gICAgeTogbnVtYmVyO1xyXG4gICAgeFZlbDogbnVtYmVyO1xyXG4gICAgaW1hZ2U6IEltYWdlUmVzb3VyY2VcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgdGhpcy54VmVsID0gTWF0aC5yYW5kb20oKSowLjA3KzAuMDU7XHJcbiAgICAgICAgdGhpcy55ID0geTtcclxuICAgICAgICB0aGlzLmltYWdlID0gV29ybGRBc3NldHMuY2xvdWRzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIFdvcmxkQXNzZXRzLmNsb3Vkcy5sZW5ndGgpXVxyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcih0YXJnZXQ6IHA1LCB1cHNjYWxlU2l6ZTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhgeDogJHt0aGlzLnh9LCB5OiAke3RoaXMueX1gKTtcclxuICAgICAgICAvL2RyYXcgYSBjbG91ZCBhdCB0aGUgcGxhY2UgOm9cclxuICAgICAgICB0aGlzLmltYWdlLnJlbmRlcihcclxuICAgICAgICAgICAgdGFyZ2V0LFxyXG4gICAgICAgICAgICAodGhpcy54ICogZ2FtZS5USUxFX1dJRFRIIC1cclxuICAgICAgICAgICAgICAgIGdhbWUuaW50ZXJwb2xhdGVkQ2FtWCAqIGdhbWUuVElMRV9XSURUSCkgKlxyXG4gICAgICAgICAgICB1cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgKHRoaXMueSAqIGdhbWUuVElMRV9IRUlHSFQgLVxyXG4gICAgICAgICAgICAgICAgZ2FtZS5pbnRlcnBvbGF0ZWRDYW1ZICogZ2FtZS5USUxFX0hFSUdIVCkgKlxyXG4gICAgICAgICAgICB1cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgdGhpcy5pbWFnZS5pbWFnZS53aWR0aCAqIHVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICB0aGlzLmltYWdlLmltYWdlLmhlaWdodCAqIHVwc2NhbGVTaXplXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICB0aWNrKCkge1xyXG4gICAgICAgIHRoaXMueCArPSB0aGlzLnhWZWw7XHJcbiAgICAgICAgbGV0IG4gPSAoKGdhbWUud2lkdGgvZ2FtZS51cHNjYWxlU2l6ZSs1MCkvZ2FtZS5USUxFX1dJRFRIKTtcclxuICAgICAgICBsZXQgeCA9IHRoaXMueC1nYW1lLmludGVycG9sYXRlZENhbVggKyA1MC9nYW1lLlRJTEVfV0lEVEg7XHJcbiAgICAgICAgdGhpcy54ID0gbW9kKHgsIG4pK2dhbWUuaW50ZXJwb2xhdGVkQ2FtWCAtIDUwL2dhbWUuVElMRV9XSURUSDtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1vZCh4MTogbnVtYmVyLCB4MjogbnVtYmVyKSB7XHJcbiAgICByZXR1cm4gKCh4MSAlIHgyKSArIHgyKSAlIHgyO1xyXG59IiwiaW1wb3J0IHA1IGZyb20gJ3A1JztcclxuaW1wb3J0IHsgU2VydmVyRW50aXR5IH0gZnJvbSAnLi9TZXJ2ZXJFbnRpdHknO1xyXG5pbXBvcnQgeyBFbnRpdGllcywgRW50aXR5UGF5bG9hZCB9IGZyb20gJy4uLy4uLy4uL2dsb2JhbC9FbnRpdHknO1xyXG5pbXBvcnQgeyBJdGVtVHlwZSB9IGZyb20gJy4uLy4uLy4uL2dsb2JhbC9JbnZlbnRvcnknO1xyXG5pbXBvcnQgeyBJdGVtQXNzZXRzLCBXb3JsZEFzc2V0cyB9IGZyb20gJy4uLy4uL2Fzc2V0cy9Bc3NldHMnO1xyXG5pbXBvcnQgeyBnYW1lIH0gZnJvbSAnLi4vLi4vR2FtZSc7XHJcblxyXG5leHBvcnQgY2xhc3MgRHJvbmVFbnRpdHkgZXh0ZW5kcyBTZXJ2ZXJFbnRpdHkge1xyXG5cclxuICAgIHhWZWw6IG51bWJlciA9IDA7XHJcbiAgICBsZXZlbDogbnVtYmVyID0gMTtcclxuICAgIGFuaW1GcmFtZTogbnVtYmVyID0gMDtcclxuICAgIHRpbWVJblRoaXNBbmltYXRpb25GcmFtZTogbnVtYmVyID0gMDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwYXlsb2FkOiBFbnRpdHlQYXlsb2FkPEVudGl0aWVzLkRyb25lPikge1xyXG4gICAgICAgIHN1cGVyKHBheWxvYWQuaWQpO1xyXG5cclxuICAgICAgICB0aGlzLmxldmVsID0gcGF5bG9hZC5kYXRhLmxldmVsO1xyXG4gICAgICAgIHRoaXMueCA9IHBheWxvYWQuZGF0YS54O1xyXG4gICAgICAgIHRoaXMueFZlbCA9IHBheWxvYWQuZGF0YS54VmVsO1xyXG4gICAgICAgIHRoaXMueSA9IHBheWxvYWQuZGF0YS55O1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcih0YXJnZXQ6IHA1LCB1cHNjYWxlU2l6ZTogbnVtYmVyKTogdm9pZCB7XHJcblxyXG4gICAgICAgIHRoaXMudGltZUluVGhpc0FuaW1hdGlvbkZyYW1lICs9IGdhbWUuZGVsdGFUaW1lO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2codGhpcy5hbmltRnJhbWUpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFt0aGlzLmxldmVsLCB0aGlzLmFuaW1GcmFtZV0pO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFdvcmxkQXNzZXRzLmVudGl0aWVzW3RoaXMubGV2ZWwtMV0pXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coV29ybGRBc3NldHMuZW50aXRpZXNbdGhpcy5sZXZlbC0xXVt0aGlzLmFuaW1GcmFtZV0pXHJcbiAgICAgICAgaWYodGhpcy50aW1lSW5UaGlzQW5pbWF0aW9uRnJhbWU+NzUpIHtcclxuICAgICAgICAgICAgdGhpcy50aW1lSW5UaGlzQW5pbWF0aW9uRnJhbWUgPSAwOy8vdGhpcyBkb2VzIGludHJvZHVjZSBzb21lIHNsaWdodCBpbmFjY3VyYWNpZXMgdnMgc3VidHJhY3RpbmcgaXQsIGJ1dCwgd2hlbiB5b3UgdGFiIGJhY2sgaW50byB0aGUgYnJvd3NlciBhZnRlciBiZWluZyB0YWJiZWQgb3V0LCBzdWJ0cmFjdGluZyBpdCBjYXVzZXMgc3BhenppbmdcclxuICAgICAgICAgICAgdGhpcy5hbmltRnJhbWUrKztcclxuICAgICAgICAgICAgaWYodGhpcy5hbmltRnJhbWU+PVdvcmxkQXNzZXRzLmVudGl0aWVzW3RoaXMubGV2ZWwtMV0ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFuaW1GcmFtZSA9IHRoaXMuYW5pbUZyYW1lJVdvcmxkQXNzZXRzLmVudGl0aWVzW3RoaXMubGV2ZWwtMV0ubGVuZ3RoO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBhc3NldCA9IFdvcmxkQXNzZXRzLmVudGl0aWVzW3RoaXMubGV2ZWwtMV1bdGhpcy5hbmltRnJhbWVdO1xyXG4gICAgICAgIGlmIChhc3NldCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGFzc2V0LnJlbmRlclJvdGF0ZWQodGFyZ2V0LCAodGhpcy54LWdhbWUuaW50ZXJwb2xhdGVkQ2FtWC0wLjQ1KygwLjEqTWF0aC5yYW5kb20oKSkpKmdhbWUuVElMRV9XSURUSCpnYW1lLnVwc2NhbGVTaXplLCAodGhpcy55LWdhbWUuaW50ZXJwb2xhdGVkQ2FtWS0wLjk1KygwLjEqTWF0aC5yYW5kb20oKSkpKmdhbWUuVElMRV9IRUlHSFQqZ2FtZS51cHNjYWxlU2l6ZSwgOCp1cHNjYWxlU2l6ZSwgMTYqdXBzY2FsZVNpemUsIHRoaXMueFZlbCowLjIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVEYXRhKGRhdGE6IEVudGl0eVBheWxvYWQ8RW50aXRpZXMuRHJvbmU+KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy54ID0gZGF0YS5kYXRhLng7XHJcbiAgICAgICAgdGhpcy55ID0gZGF0YS5kYXRhLnk7XHJcbiAgICAgICAgdGhpcy54VmVsID0gZGF0YS5kYXRhLnhWZWxcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBFbnRpdGllcyB9IGZyb20gJy4uLy4uLy4uL2dsb2JhbC9FbnRpdHknO1xyXG5pbXBvcnQgeyBQbGF5ZXJFbnRpdHkgfSBmcm9tICcuL1BsYXllckVudGl0eSc7XHJcbmltcG9ydCB7IEl0ZW1FbnRpdHkgfSBmcm9tICcuL0l0ZW1FbnRpdHknO1xyXG5pbXBvcnQgeyBEcm9uZUVudGl0eSB9IGZyb20gJy4vRHJvbmVFbnRpdHknO1xyXG5cclxuZXhwb3J0IGNvbnN0IEVudGl0eUNsYXNzZXM6IFJlY29yZDxFbnRpdGllcywgYW55PiA9IHtcclxuICAgIFtFbnRpdGllcy5Mb2NhbFBsYXllcl06IHVuZGVmaW5lZCxcclxuICAgIFtFbnRpdGllcy5QbGF5ZXJdOiBQbGF5ZXJFbnRpdHksXHJcbiAgICBbRW50aXRpZXMuSXRlbV06IEl0ZW1FbnRpdHksXHJcbiAgICBbRW50aXRpZXMuRHJvbmVdOiBEcm9uZUVudGl0eSxcclxufTsiLCJpbXBvcnQgcDUgZnJvbSAncDUnO1xyXG5pbXBvcnQgeyBTZXJ2ZXJFbnRpdHkgfSBmcm9tICcuL1NlcnZlckVudGl0eSc7XHJcbmltcG9ydCB7IEVudGl0aWVzLCBFbnRpdHlQYXlsb2FkIH0gZnJvbSAnLi4vLi4vLi4vZ2xvYmFsL0VudGl0eSc7XHJcbmltcG9ydCB7IEl0ZW1zLCBJdGVtVHlwZSB9IGZyb20gJy4uLy4uLy4uL2dsb2JhbC9JbnZlbnRvcnknO1xyXG5pbXBvcnQgeyBJdGVtQXNzZXRzIH0gZnJvbSAnLi4vLi4vYXNzZXRzL0Fzc2V0cyc7XHJcblxyXG5leHBvcnQgY2xhc3MgSXRlbUVudGl0eSBleHRlbmRzIFNlcnZlckVudGl0eSB7XHJcbiAgICBpdGVtOiBJdGVtVHlwZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwYXlsb2FkOiBFbnRpdHlQYXlsb2FkPEVudGl0aWVzLkl0ZW0+KSB7XHJcbiAgICAgICAgc3VwZXIocGF5bG9hZC5pZCk7XHJcblxyXG4gICAgICAgIHRoaXMuaXRlbSA9IHBheWxvYWQuZGF0YS5pdGVtO1xyXG4gICAgICAgIHRoaXMueCA9IHBheWxvYWQuZGF0YS54O1xyXG4gICAgICAgIHRoaXMueSA9IHBheWxvYWQuZGF0YS55O1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcih0YXJnZXQ6IHA1LCB1cHNjYWxlU2l6ZTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgYXNzZXQgPSBJdGVtQXNzZXRzW3RoaXMuaXRlbV07XHJcbiAgICAgICAgaWYgKGFzc2V0ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgYXNzZXQucmVuZGVyKHRhcmdldCwgdGhpcy54LCB0aGlzLnksIDgsIDgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVEYXRhKGRhdGE6IEVudGl0eVBheWxvYWQ8RW50aXRpZXMuSXRlbT4pOiB2b2lkIHtcclxuICAgICAgICB0aGlzLml0ZW0gPSBkYXRhLmRhdGEuaXRlbTtcclxuICAgICAgICB0aGlzLnggPSBkYXRhLmRhdGEueDtcclxuICAgICAgICB0aGlzLnkgPSBkYXRhLmRhdGEueTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgcDUgZnJvbSAncDUnO1xyXG5pbXBvcnQgeyBTZXJ2ZXJFbnRpdHkgfSBmcm9tICcuL1NlcnZlckVudGl0eSc7XHJcbmltcG9ydCB7IEVudGl0aWVzLCBFbnRpdHlQYXlsb2FkIH0gZnJvbSAnLi4vLi4vLi4vZ2xvYmFsL0VudGl0eSc7XHJcbmltcG9ydCB7IGdhbWUgfSBmcm9tICcuLi8uLi9HYW1lJztcclxuaW1wb3J0IHsgQW5pbWF0aW9uRnJhbWUsIEZvbnRzLCBQbGF5ZXJBbmltYXRpb25zLCBVaUFzc2V0cyB9IGZyb20gJy4uLy4uL2Fzc2V0cy9Bc3NldHMnO1xyXG5pbXBvcnQgeyBSZWZsZWN0YWJsZUltYWdlUmVzb3VyY2UgfSBmcm9tICcuLi8uLi9hc3NldHMvcmVzb3VyY2VzL1JlZmxlY3RlZEltYWdlUmVzb3VyY2UnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFBsYXllckVudGl0eSBleHRlbmRzIFNlcnZlckVudGl0eSB7XHJcbiAgICB3aWR0aDogbnVtYmVyID0gMTIgLyBnYW1lLlRJTEVfV0lEVEg7XHJcbiAgICBoZWlnaHQ6IG51bWJlciA9IDI4IC8gZ2FtZS5USUxFX0hFSUdIVDtcclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIGlkTnVtYmVyOiBudW1iZXI7XHJcbiAgICBjb2xvcjE6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdXHJcbiAgICBjb2xvcjI6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdXHJcbiAgICBjdXJyZW50QW5pbWF0aW9uOiBBbmltYXRpb25GcmFtZTx0eXBlb2YgUGxheWVyQW5pbWF0aW9ucz4gPSBcImlkbGVcIlxyXG4gICAgdGltZUluVGhpc0FuaW1hdGlvbkZyYW1lOiBudW1iZXIgPSAwO1xyXG4gICAgYW5pbUZyYW1lOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIFxyXG4gICAgYW5pbWF0aW9uczoge1xyXG4gICAgICAgIFtrZXk6IHN0cmluZ106IFtSZWZsZWN0YWJsZUltYWdlUmVzb3VyY2UsIG51bWJlcl1bXSxcclxuICAgIH0gPSB7fTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkYXRhOiBFbnRpdHlQYXlsb2FkKSB7XHJcbiAgICAgICAgc3VwZXIoZGF0YS5pZCk7XHJcbiAgICAgICAgaWYgKGRhdGEudHlwZSA9PT0gRW50aXRpZXMuUGxheWVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMubmFtZSA9IGRhdGEuZGF0YS5uYW1lO1xyXG4gICAgICAgIH1cclxuICAgICAgICBkYXRhLmlkID0gZGF0YS5pZC5zcGxpdChcIi1cIikuam9pbihcIlwiKTsvL3N0cmluZy5wcm90b3R5cGUucmVwbGFjZUFsbCByZXF1aXJlcyBFUzIwMjFcclxuICAgICAgICB0aGlzLmlkTnVtYmVyID0gKE51bWJlcihcIjB4XCIrZGF0YS5pZCkvMTAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwKSUxOy8vZ2V0IGEgbnVtYmVyIDAtMSBwc2V1ZG9yYW5kb21seSBzZWxlY3RlZCBmcm9tIHRoZSB1dWlkIG9mIHRoZSBwbGF5ZXJcclxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmlkTnVtYmVyKTtcclxuICAgICAgICB0aGlzLmNvbG9yMSA9IGhzbFRvUmdiKHRoaXMuaWROdW1iZXIsIDEsIDAuNDUpOy8vY29udmVydCB0aGlzIHRvIHR3byBIU0wgY29sb3JzIHdoaWNoIGFyZSB0aGVuIGNvbnZlcnRlZCB0byB0d28gUkdCIGNvbG9yczogb25lIGxpZ2h0IGFuZCBvbmUgZGFya1xyXG4gICAgICAgIHRoaXMuY29sb3IyID0gaHNsVG9SZ2IodGhpcy5pZE51bWJlciwgMSwgMC4zKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhgY3JlYXRpbmcgYW5pbWF0aW9ucyBmb3IgcGxheWVyIHdpdGggY29sb3JzICR7dGhpcy5jb2xvcjF9IGFuZCAke3RoaXMuY29sb3IyfWApXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcIlRFU1Q6IFwiKyh0aGlzLmFuaW1hdGlvbnMuaWRsZVswXVswXS5pbWFnZT09PVBsYXllckFuaW1hdGlvbnMuaWRsZVswXVswXS5pbWFnZSkpXHJcbiAgICAgICAgLy8gbGV0IGltZyA9IHRoaXMuYW5pbWF0aW9ucy5pZGxlWzBdWzBdLmltYWdlO1xyXG4gICAgICAgIC8vIGltZy5sb2FkUGl4ZWxzKCk7XHJcbiAgICAgICAgLy8gaW1nLnNldCgzLCAxMCwgWzAsIDI1NSwgMCwgMjU1XSk7XHJcbiAgICAgICAgLy8gaW1nLnVwZGF0ZVBpeGVscygpO1xyXG4gICAgICAgIE9iamVjdC5lbnRyaWVzKFBsYXllckFuaW1hdGlvbnMpLmZvckVhY2goZWxlbWVudCA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uc1tlbGVtZW50WzBdXSA9IFtdO1xyXG4gICAgICAgICAgICBmb3IobGV0IGZyYW1lIG9mIGVsZW1lbnRbMV0pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uc1tlbGVtZW50WzBdXS5wdXNoKFtuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKGZyYW1lWzBdLnBhdGgsIHRoaXMuY29sb3IxLCB0aGlzLmNvbG9yMiksIGZyYW1lWzFdXSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVmbGVjdGFibGVSZXNvdXJjZSA9IHRoaXMuYW5pbWF0aW9uc1tlbGVtZW50WzBdXVt0aGlzLmFuaW1hdGlvbnNbZWxlbWVudFswXV0ubGVuZ3RoLTFdWzBdO1xyXG4gICAgICAgICAgICAgICAgcmVmbGVjdGFibGVSZXNvdXJjZS5sb2FkUmVzb3VyY2UoZ2FtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVEYXRhKGRhdGE6IEVudGl0eVBheWxvYWQpOiB2b2lkIHtcclxuICAgICAgICBpZiAoZGF0YS50eXBlID09PSBFbnRpdGllcy5QbGF5ZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5uYW1lID0gZGF0YS5kYXRhLm5hbWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcih0YXJnZXQ6IHA1LCB1cHNjYWxlU2l6ZTogbnVtYmVyKTogdm9pZCB7XHJcblxyXG4gICAgICAgIC8vdXBkYXRlIGFuaW1hdGlvbiBmcmFtZSBiYXNlZCBvbiBkZWx0YVRpbWVcclxuICAgICAgICB0aGlzLnRpbWVJblRoaXNBbmltYXRpb25GcmFtZSArPSBnYW1lLmRlbHRhVGltZTtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKHRoaXMuYW5pbUZyYW1lKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhbdGhpcy5jdXJyZW50QW5pbWF0aW9uLCB0aGlzLmFuaW1GcmFtZV0pO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFBsYXllckFuaW1hdGlvbnNbdGhpcy5jdXJyZW50QW5pbWF0aW9uXSlcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhQbGF5ZXJBbmltYXRpb25zW3RoaXMuY3VycmVudEFuaW1hdGlvbl1bdGhpcy5hbmltRnJhbWVdKVxyXG4gICAgICAgIGlmKHRoaXMudGltZUluVGhpc0FuaW1hdGlvbkZyYW1lPlBsYXllckFuaW1hdGlvbnNbdGhpcy5jdXJyZW50QW5pbWF0aW9uXVt0aGlzLmFuaW1GcmFtZV1bMV0pIHtcclxuICAgICAgICAgICAgdGhpcy50aW1lSW5UaGlzQW5pbWF0aW9uRnJhbWUgPSAwOy8vdGhpcyBkb2VzIGludHJvZHVjZSBzb21lIHNsaWdodCBpbmFjY3VyYWNpZXMgdnMgc3VidHJhY3RpbmcgaXQsIGJ1dCwgd2hlbiB5b3UgdGFiIGJhY2sgaW50byB0aGUgYnJvd3NlciBhZnRlciBiZWluZyB0YWJiZWQgb3V0LCBzdWJ0cmFjdGluZyBpdCBjYXVzZXMgc3BhenppbmdcclxuICAgICAgICAgICAgdGhpcy5hbmltRnJhbWUrKztcclxuICAgICAgICAgICAgaWYodGhpcy5hbmltRnJhbWU+PVBsYXllckFuaW1hdGlvbnNbdGhpcy5jdXJyZW50QW5pbWF0aW9uXS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYW5pbUZyYW1lID0gdGhpcy5hbmltRnJhbWUlUGxheWVyQW5pbWF0aW9uc1t0aGlzLmN1cnJlbnRBbmltYXRpb25dLmxlbmd0aDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9QbGF5ZXJBXHJcbiAgICAgICAgLy8gUmVuZGVyIHRoZSBpdGVtIHF1YW50aXR5IGxhYmVsXHJcbiAgICAgICAgdGhpcy5hbmltYXRpb25zW3RoaXMuY3VycmVudEFuaW1hdGlvbl1bdGhpcy5hbmltRnJhbWVdWzBdLnJlbmRlcihcclxuICAgICAgICAgICAgdGFyZ2V0LFxyXG4gICAgICAgICAgICAodGhpcy54ICogZ2FtZS5USUxFX1dJRFRIIC1cclxuICAgICAgICAgICAgICAgIGdhbWUuaW50ZXJwb2xhdGVkQ2FtWCAqIGdhbWUuVElMRV9XSURUSCkgKlxyXG4gICAgICAgICAgICAgICAgdXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgICh0aGlzLnkgKiBnYW1lLlRJTEVfSEVJR0hUIC1cclxuICAgICAgICAgICAgICAgIGdhbWUuaW50ZXJwb2xhdGVkQ2FtWSAqIGdhbWUuVElMRV9IRUlHSFQpICpcclxuICAgICAgICAgICAgICAgIHVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICB0aGlzLndpZHRoICogdXBzY2FsZVNpemUgKiBnYW1lLlRJTEVfV0lEVEgsXHJcbiAgICAgICAgICAgIHRoaXMuaGVpZ2h0ICogdXBzY2FsZVNpemUgKiBnYW1lLlRJTEVfSEVJR0hUXHJcbiAgICAgICAgKTtcclxuICAgICAgICB0aGlzLmFuaW1hdGlvbnNbdGhpcy5jdXJyZW50QW5pbWF0aW9uXVt0aGlzLmFuaW1GcmFtZV1bMF0ucmVuZGVyV29ybGRzcGFjZVJlZmxlY3Rpb24oXHJcbiAgICAgICAgICAgIGdhbWUsXHJcbiAgICAgICAgICAgIHRoaXMueCxcclxuICAgICAgICAgICAgdGhpcy55K3RoaXMuaGVpZ2h0LFxyXG4gICAgICAgICAgICB0aGlzLndpZHRoLFxyXG4gICAgICAgICAgICB0aGlzLmhlaWdodFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIC8vIHRhcmdldC5ub1N0cm9rZSgpO1xyXG5cclxuICAgICAgICAvLyB0YXJnZXQudGV4dFNpemUoNSAqIHVwc2NhbGVTaXplKTtcclxuICAgICAgICAvLyB0YXJnZXQudGV4dEFsaWduKHRhcmdldC5DRU5URVIsIHRhcmdldC5UT1ApO1xyXG5cclxuICAgICAgICB0YXJnZXQuZmlsbCh0aGlzLmNvbG9yMSk7XHJcbiAgICAgICAgdGFyZ2V0Lm5vU3Ryb2tlKCk7XHJcbiAgICAgICAgdGFyZ2V0LnJlY3QoXHJcbiAgICAgICAgICAgICh0aGlzLnggKiBnYW1lLlRJTEVfV0lEVEggLVxyXG4gICAgICAgICAgICAgICAgZ2FtZS5pbnRlcnBvbGF0ZWRDYW1YICogZ2FtZS5USUxFX1dJRFRIICtcclxuICAgICAgICAgICAgICAgICh0aGlzLndpZHRoICogZ2FtZS5USUxFX1dJRFRIKSAvIDIpICpcclxuICAgICAgICAgICAgICAgIHVwc2NhbGVTaXplLSh0aGlzLm5hbWUubGVuZ3RoKjIqZ2FtZS51cHNjYWxlU2l6ZSksXHJcbiAgICAgICAgICAgICAgICAodGhpcy55ICogZ2FtZS5USUxFX0hFSUdIVCAtXHJcbiAgICAgICAgICAgICAgICBnYW1lLmludGVycG9sYXRlZENhbVkgKiBnYW1lLlRJTEVfSEVJR0hUIC1cclxuICAgICAgICAgICAgICAgICh0aGlzLmhlaWdodCAqIGdhbWUuVElMRV9IRUlHSFQpIC8gMi41ICsgNikgKlxyXG4gICAgICAgICAgICAgICAgdXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgICAgICAodGhpcy5uYW1lLmxlbmd0aCo0KmdhbWUudXBzY2FsZVNpemUpLFxyXG4gICAgICAgICAgICAgICAgZ2FtZS51cHNjYWxlU2l6ZSk7XHJcblxyXG4gICAgICAgIEZvbnRzLnRvbV90aHVtYi5kcmF3VGV4dChcclxuICAgICAgICAgICAgZ2FtZSxcclxuICAgICAgICAgICAgdGhpcy5uYW1lLFxyXG4gICAgICAgICAgICAodGhpcy54ICogZ2FtZS5USUxFX1dJRFRIIC1cclxuICAgICAgICAgICAgICAgIGdhbWUuaW50ZXJwb2xhdGVkQ2FtWCAqIGdhbWUuVElMRV9XSURUSCArXHJcbiAgICAgICAgICAgICAgICAodGhpcy53aWR0aCAqIGdhbWUuVElMRV9XSURUSCkgLyAyKSAqXHJcbiAgICAgICAgICAgICAgICB1cHNjYWxlU2l6ZS0odGhpcy5uYW1lLmxlbmd0aCoyKmdhbWUudXBzY2FsZVNpemUpLFxyXG4gICAgICAgICAgICAodGhpcy55ICogZ2FtZS5USUxFX0hFSUdIVCAtXHJcbiAgICAgICAgICAgICAgICBnYW1lLmludGVycG9sYXRlZENhbVkgKiBnYW1lLlRJTEVfSEVJR0hUIC1cclxuICAgICAgICAgICAgICAgICh0aGlzLmhlaWdodCAqIGdhbWUuVElMRV9IRUlHSFQpIC8gMi41KSAqXHJcbiAgICAgICAgICAgICAgICB1cHNjYWxlU2l6ZVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaHNsVG9SZ2IoaDogbnVtYmVyLCBzOiBudW1iZXIsIGw6IG51bWJlcik6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJde1xyXG4gICAgdmFyIHIsIGcsIGI7XHJcblxyXG4gICAgaWYocyA9PSAwKXtcclxuICAgICAgICByID0gZyA9IGIgPSBsOyAvLyBhY2hyb21hdGljXHJcbiAgICB9ZWxzZXtcclxuICAgICAgICB2YXIgaHVlMnJnYiA9IGZ1bmN0aW9uIGh1ZTJyZ2IocDogbnVtYmVyLCBxOiBudW1iZXIsIHQ6IG51bWJlcil7XHJcbiAgICAgICAgICAgIGlmKHQgPCAwKSB0ICs9IDE7XHJcbiAgICAgICAgICAgIGlmKHQgPiAxKSB0IC09IDE7XHJcbiAgICAgICAgICAgIGlmKHQgPCAxLzYpIHJldHVybiBwICsgKHEgLSBwKSAqIDYgKiB0O1xyXG4gICAgICAgICAgICBpZih0IDwgMS8yKSByZXR1cm4gcTtcclxuICAgICAgICAgICAgaWYodCA8IDIvMykgcmV0dXJuIHAgKyAocSAtIHApICogKDIvMyAtIHQpICogNjtcclxuICAgICAgICAgICAgcmV0dXJuIHA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgcSA9IGwgPCAwLjUgPyBsICogKDEgKyBzKSA6IGwgKyBzIC0gbCAqIHM7XHJcbiAgICAgICAgdmFyIHAgPSAyICogbCAtIHE7XHJcbiAgICAgICAgciA9IGh1ZTJyZ2IocCwgcSwgaCArIDEvMyk7XHJcbiAgICAgICAgZyA9IGh1ZTJyZ2IocCwgcSwgaCk7XHJcbiAgICAgICAgYiA9IGh1ZTJyZ2IocCwgcSwgaCAtIDEvMyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIFtNYXRoLnJvdW5kKHIgKiAyNTUpLCBNYXRoLnJvdW5kKGcgKiAyNTUpLCBNYXRoLnJvdW5kKGIgKiAyNTUpLCAyNTVdO1xyXG59IiwiaW1wb3J0IHA1IGZyb20gJ3A1JztcclxuaW1wb3J0IHsgUmVuZGVyYWJsZSB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvUmVuZGVyYWJsZSc7XHJcbmltcG9ydCB7IEVudGl0eVBheWxvYWQgfSBmcm9tICcuLi8uLi8uLi9nbG9iYWwvRW50aXR5JztcclxuXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBTZXJ2ZXJFbnRpdHkgaW1wbGVtZW50cyBSZW5kZXJhYmxlIHtcclxuICAgIGVudGl0eUlkOiBzdHJpbmc7XHJcblxyXG4gICAgeDogbnVtYmVyID0gMDtcclxuICAgIHk6IG51bWJlciA9IDA7XHJcblxyXG4gICAgcHJvdGVjdGVkIGNvbnN0cnVjdG9yKGVudGl0eUlkOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLmVudGl0eUlkID0gZW50aXR5SWQ7XHJcbiAgICB9XHJcblxyXG4gICAgYWJzdHJhY3QgdXBkYXRlRGF0YShkYXRhOiBFbnRpdHlQYXlsb2FkKTogdm9pZDtcclxuXHJcbiAgICBhYnN0cmFjdCByZW5kZXIodGFyZ2V0OiBwNSwgdXBzY2FsZVNpemU6IG51bWJlcik6IHZvaWQ7XHJcbn1cclxuIiwiaW1wb3J0IHsgVGlsZUVudGl0eVBheWxvYWQgfSBmcm9tICcuLi8uLi8uLi9nbG9iYWwvVGlsZUVudGl0eSc7XHJcblxyXG5leHBvcnQgdHlwZSBDbGllbnRUaWxlRW50aXR5ID0gVGlsZUVudGl0eVBheWxvYWQgJiB7XHJcblx0YW5pbUZyYW1lOiBudW1iZXJcclxuXHRhbmltYXRlOiBib29sZWFuXHJcbn1cclxuXHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IFRpbGVFbnRpdHlBbmltYXRpb25zID0gW1xyXG4gICAgZmFsc2UsLy90cmVlXHJcblx0dHJ1ZSwvL2RyaWxsXHJcblx0dHJ1ZSwvL2RyaWxsXHJcblx0dHJ1ZSwvL2RyaWxsXHJcblx0dHJ1ZSwvL2RyaWxsXHJcblx0dHJ1ZSwvL2RyaWxsXHJcblx0ZmFsc2UsLy9jcmFmdGluZyBiZW5jaFxyXG5cdGZhbHNlLC8vcGxhbnRlZCBzZWVkXHJcbl0iLCJpbXBvcnQgeyBnYW1lIH0gZnJvbSBcIi4uLy4uL0dhbWVcIjtcclxuaW1wb3J0IHsgUGFydGljbGUgfSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9QYXJ0aWNsZVwiO1xyXG5pbXBvcnQgU2ltcGxleE5vaXNlIGZyb20gXCJzaW1wbGV4LW5vaXNlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQ29sb3JQYXJ0aWNsZSBpbXBsZW1lbnRzIFBhcnRpY2xlIHtcclxuICAgIGNvbG9yOiBzdHJpbmdcclxuICAgIHg6IG51bWJlcjtcclxuICAgIHk6IG51bWJlcjtcclxuICAgIHNpemU6IG51bWJlcjtcclxuICAgIHhWZWw6IG51bWJlcjtcclxuICAgIHlWZWw6IG51bWJlcjtcclxuICAgIGdyYXZpdHk6IGJvb2xlYW47XHJcbiAgICB3aW5kOiBib29sZWFuO1xyXG4gICAgYWdlOiBudW1iZXI7XHJcbiAgICBsaWZlc3BhbjogbnVtYmVyO1xyXG4gICAgbm9pc2U6IFNpbXBsZXhOb2lzZVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKGNvbG9yOiBzdHJpbmcsIHNpemU6IG51bWJlciwgbGlmZXNwYW46IG51bWJlciwgeDogbnVtYmVyLCB5OiBudW1iZXIsIHhWZWw/OiBudW1iZXIsIHlWZWw/OiBudW1iZXIsIGdyYXZpdHk/OiBib29sZWFuLCB3aW5kPzogYm9vbGVhbikge1xyXG4gICAgICAgIHRoaXMuY29sb3IgPSBjb2xvcjtcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICAgICAgdGhpcy54VmVsID0geFZlbCB8fCAwO1xyXG4gICAgICAgIHRoaXMueVZlbCA9IHlWZWwgfHwgMDtcclxuICAgICAgICB0aGlzLnNpemUgPSBzaXplO1xyXG4gICAgICAgIHRoaXMuZ3Jhdml0eSA9IHRydWU7Ly91c2luZyB0aGUgb3IgbW9kaWZpZXIgd2l0aCBib29sZWFucyBjYXVzZXMgYnVnczsgdGhlcmUncyBwcm9iYWJseSBhIGJldHRlciB3YXkgdG8gZG8gdGhpc1xyXG4gICAgICAgIGlmIChncmF2aXR5ICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHRoaXMuZ3Jhdml0eSA9IGdyYXZpdHk7XHJcblxyXG4gICAgICAgIHRoaXMud2luZCA9IGZhbHNlOy8vdXNpbmcgdGhlIG9yIG1vZGlmaWVyIHdpdGggYm9vbGVhbnMgY2F1c2VzIGJ1Z3M7IHRoZXJlJ3MgcHJvYmFibHkgYSBiZXR0ZXIgd2F5IHRvIGRvIHRoaXNcclxuICAgICAgICBpZiAod2luZCAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB0aGlzLndpbmQgPSB3aW5kO1xyXG4gICAgICAgIHRoaXMuYWdlID0gMDtcclxuICAgICAgICB0aGlzLmxpZmVzcGFuID0gbGlmZXNwYW47XHJcbiAgICAgICAgdGhpcy5ub2lzZSA9IG5ldyBTaW1wbGV4Tm9pc2UoXCJhc2RmYXNkZmFzZGZhc1wiKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIodGFyZ2V0OiBpbXBvcnQoXCJwNVwiKSwgdXBzY2FsZVNpemU6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLmFnZSAvIHRoaXMubGlmZXNwYW4gPCAwLjgpIHsvL2lmIGl0J3MgdW5kZXIgODAlIG9mIHRoZSBwYXJ0aWNsZSdzIGxpZmVzcGFuLCBkcmF3IG5vcm1hbGx5IHdpdGhvdXQgZmFkZVxyXG4gICAgICAgICAgICB0YXJnZXQuZmlsbCh0aGlzLmNvbG9yKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7Ly90aGlzIG1lYW5zIHRoYXQgdGhlIHBhcnRpY2xlIGlzIGFsbW9zdCBnb2luZyB0byBiZSBkZWxldGVkLCBzbyBmYWRpbmcgaXMgbmVjZXNzYXJ5XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbG9yLmxlbmd0aCA9PT0gNykgey8vaWYgdGhlcmUgaXMgbm8gdHJhbnNwYXJlbmN5IGJ5IGRlZmF1bHQsIGp1c3QgbWFwIHRoZSB0aGluZ3NcclxuICAgICAgICAgICAgICAgIGxldCB0cmFuc3BhcmVuY3lTdHJpbmcgPSBNYXRoLnJvdW5kKDI1NSAqICgtNSAqICh0aGlzLmFnZSAvIHRoaXMubGlmZXNwYW4pICsgNSkpLnRvU3RyaW5nKDE2KS5zdWJzdHJpbmcoMCwgMik7XHJcbiAgICAgICAgICAgICAgICBpZiAodHJhbnNwYXJlbmN5U3RyaW5nPT09dW5kZWZpbmVkIHx8IHRyYW5zcGFyZW5jeVN0cmluZy5sZW5ndGg9PT11bmRlZmluZWQpLy9jYXRjaCB3aGF0IGNvdWxkIGJlIGFuIGluZmluaXRlIGxvb3Agb3IganVzdCBhbiBlcnJvclxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcclxuICAgICAgICAgICAgICAgICAgICAgICAgYHVuZGVmaW5lZCB0cmFuc3BhcmVuY3kgc3RyaW5nIG9uIHBhcnRpY2xlYFxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSh0cmFuc3BhcmVuY3lTdHJpbmcubGVuZ3RoPDIpIHsvL21ha2Ugc3VyZSBpdCdzIDIgY2hhcmFjdGVycyBsb25nOyB0aGlzIHN0b3BzIHRoZSBjb21wdXRlciBmcm9tIGludGVycHJldGluZyAjZmYgZmYgZmYgNSBhcyAjZmYgZmYgZmYgNTUgaW5zdGVhZCBvZiAjZmYgZmYgZmYgMDVcclxuICAgICAgICAgICAgICAgICAgICB0cmFuc3BhcmVuY3lTdHJpbmcgPSBcIjBcIit0cmFuc3BhcmVuY3lTdHJpbmc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQuZmlsbCh0aGlzLmNvbG9yLnN1YnN0cmluZygwLCA3KSArIHRyYW5zcGFyZW5jeVN0cmluZyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7Ly9pZiB0aGVyZSBpcyB0cmFuc3BhcmVuY3ksIG11bHRpcGx5XHJcbiAgICAgICAgICAgICAgICBsZXQgdHJhbnNwYXJlbmN5U3RyaW5nID0gTWF0aC5yb3VuZChwYXJzZUludCh0aGlzLmNvbG9yLnN1YnN0cmluZyg3LCA5KSwgMTYpICogKC01ICogKHRoaXMuYWdlIC8gdGhpcy5saWZlc3BhbikgKyA1KSkudG9TdHJpbmcoMTYpLnN1YnN0cmluZygwLCAyKTtcclxuICAgICAgICAgICAgICAgIGlmICh0cmFuc3BhcmVuY3lTdHJpbmc9PT11bmRlZmluZWQgfHwgdHJhbnNwYXJlbmN5U3RyaW5nLmxlbmd0aD09PXVuZGVmaW5lZCkvL2NhdGNoIHdoYXQgY291bGQgYmUgYW4gaW5maW5pdGUgbG9vcCBvciBqdXN0IGFuIGVycm9yXHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBgdW5kZWZpbmVkIHRyYW5zcGFyZW5jeSBzdHJpbmcgb24gcGFydGljbGVgXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIHdoaWxlKHRyYW5zcGFyZW5jeVN0cmluZy5sZW5ndGg8Mikgey8vbWFrZSBzdXJlIGl0J3MgMiBjaGFyYWN0ZXJzIGxvbmc7IHRoaXMgc3RvcHMgdGhlIGNvbXB1dGVyIGZyb20gaW50ZXJwcmV0aW5nICNmZiBmZiBmZiA1IGFzICNmZiBmZiBmZiA1NSBpbnN0ZWFkIG9mICNmZiBmZiBmZiAwNVxyXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zcGFyZW5jeVN0cmluZyA9IFwiMFwiK3RyYW5zcGFyZW5jeVN0cmluZztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRhcmdldC5maWxsKHRoaXMuY29sb3Iuc3Vic3RyaW5nKDAsIDcpICsgdHJhbnNwYXJlbmN5U3RyaW5nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvL2RyYXcgYSByZWN0YW5nbGUgY2VudGVyZWQgb24gdGhlIHggYW5kIHkgcG9zaXRpb24gZmlsbGVkIHdpdGggdGhlIGNvbG9yIG9mIHRoZSBvYmplY3RcclxuICAgICAgICB0YXJnZXQucmVjdChcclxuICAgICAgICAgICAgKC10aGlzLnNpemUgLyAyICsgdGhpcy54ICogZ2FtZS5USUxFX1dJRFRIIC1cclxuICAgICAgICAgICAgICAgIGdhbWUuaW50ZXJwb2xhdGVkQ2FtWCAqIGdhbWUuVElMRV9XSURUSCkgKlxyXG4gICAgICAgICAgICB1cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgKC10aGlzLnNpemUgLyAyICsgdGhpcy55ICogZ2FtZS5USUxFX0hFSUdIVCAtXHJcbiAgICAgICAgICAgICAgICBnYW1lLmludGVycG9sYXRlZENhbVkgKiBnYW1lLlRJTEVfSEVJR0hUKSAqXHJcbiAgICAgICAgICAgIHVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICB0aGlzLnNpemUgKiB1cHNjYWxlU2l6ZSAqIGdhbWUuVElMRV9XSURUSCxcclxuICAgICAgICAgICAgdGhpcy5zaXplICogdXBzY2FsZVNpemUgKiBnYW1lLlRJTEVfSEVJR0hUXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICB0aWNrKCkge1xyXG4gICAgICAgIHRoaXMuYWdlKys7XHJcbiAgICAgICAgdGhpcy54ICs9IHRoaXMueFZlbDtcclxuICAgICAgICB0aGlzLnkgKz0gdGhpcy55VmVsO1xyXG4gICAgICAgIHRoaXMueFZlbCAtPSAoTWF0aC5hYnModGhpcy54VmVsKSAqIHRoaXMueFZlbCAqIGdhbWUuRFJBR19DT0VGRklDSUVOVCAqIHRoaXMuc2l6ZSk7Ly9hc3N1bWluZyBjb25zdGFudCBtYXNzIGZvciBlYWNoIHBhcnRpY2xlXHJcbiAgICAgICAgaWYgKHRoaXMuZ3Jhdml0eSkge1xyXG4gICAgICAgICAgICB0aGlzLnlWZWwgKz0gZ2FtZS5HUkFWSVRZX1NQRUVEO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy53aW5kKSB7XHJcbiAgICAgICAgICAgIHRoaXMueFZlbCArPSB0aGlzLm5vaXNlLm5vaXNlMkQodGhpcy54LzEwLCB0aGlzLnkvMTApLzQwXHJcbiAgICAgICAgICAgIHRoaXMueVZlbCArPSB0aGlzLm5vaXNlLm5vaXNlMkQodGhpcy55LzEwLCB0aGlzLngvMTApLzQwXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMueVZlbCAtPSAoTWF0aC5hYnModGhpcy55VmVsKSAqIHRoaXMueVZlbCAqIGdhbWUuRFJBR19DT0VGRklDSUVOVCAqIHRoaXMuc2l6ZSk7XHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IHsgSW52ZW50b3J5UGF5bG9hZCwgSXRlbVR5cGUgfSBmcm9tICcuL0ludmVudG9yeSc7XHJcblxyXG5leHBvcnQgZW51bSBFbnRpdGllcyB7XHJcblx0TG9jYWxQbGF5ZXIsXHJcblx0UGxheWVyLFxyXG5cdEl0ZW0sXHJcblx0RHJvbmUsXHJcbn1cclxuXHJcbnR5cGUgRGF0YVBhaXJzPFQsIEsgZXh0ZW5kcyBrZXlvZiBUID0ga2V5b2YgVD4gPSBLIGV4dGVuZHMga2V5b2YgVFxyXG5cdD8geyB0eXBlOiBLOyBkYXRhOiBUW0tdIH1cclxuXHQ6IG5ldmVyO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBFbnRpdGllc0RhdGEge1xyXG5cdFtFbnRpdGllcy5Mb2NhbFBsYXllcl06IHtcclxuXHRcdG5hbWU6IHN0cmluZztcclxuXHRcdHg6IG51bWJlcjtcclxuXHRcdHk6IG51bWJlcjtcclxuXHR9O1xyXG5cdFtFbnRpdGllcy5QbGF5ZXJdOiB7IG5hbWU6IHN0cmluZyB9O1xyXG5cdFtFbnRpdGllcy5JdGVtXTogeyBpdGVtOiBJdGVtVHlwZTsgeDogbnVtYmVyOyB5OiBudW1iZXJ9O1xyXG5cdFtFbnRpdGllcy5Ecm9uZV06IHsgbGV2ZWw6IG51bWJlciwgeDogbnVtYmVyOyB5OiBudW1iZXI7IHhWZWw6IG51bWJlcn07XHJcblx0XHJcbn1cclxuXHJcbmV4cG9ydCB0eXBlIEVudGl0eURhdGE8VCBleHRlbmRzIEVudGl0aWVzID0ga2V5b2YgRW50aXRpZXNEYXRhPiA9IERhdGFQYWlyczxcclxuXHRFbnRpdGllc0RhdGEsXHJcblx0VFxyXG4+O1xyXG5cclxuZXhwb3J0IHR5cGUgRW50aXR5UGF5bG9hZDxUIGV4dGVuZHMgRW50aXRpZXMgPSBrZXlvZiBFbnRpdGllc0RhdGE+ID1cclxuXHRFbnRpdHlEYXRhPFQ+ICYgeyBpZDogc3RyaW5nIH07XHJcbiIsImltcG9ydCB7IFRpbGVUeXBlIH0gZnJvbSAnLi9UaWxlJztcclxuaW1wb3J0IHsgVGlsZUVudGl0aWVzIH0gZnJvbSAnLi9UaWxlRW50aXR5JztcclxuXHJcbnR5cGUgRGF0YVBhaXJzPFQsIEsgZXh0ZW5kcyBrZXlvZiBUID0ga2V5b2YgVD4gPSBLIGV4dGVuZHMga2V5b2YgVFxyXG5cdD8geyB0eXBlOiBLIH0gJiBUW0tdXHJcblx0OiBuZXZlcjtcclxuXHJcbmNvbnN0IGl0ZW1UeXBlRGF0YSA9IDxELCBUIGV4dGVuZHMgUmVjb3JkPEl0ZW1UeXBlLCBEYXRhUGFpcnM8Q2F0ZWdvcnlEYXRhPj4+KFxyXG5cdGRhdGE6IFQsXHJcbik6IFQgPT4gZGF0YTtcclxuXHJcbmV4cG9ydCBlbnVtIEl0ZW1DYXRlZ29yaWVzIHtcclxuXHRUaWxlLFxyXG5cdFJlc291cmNlLFxyXG5cdFRvb2wsXHJcblx0VGlsZUVudGl0eSxcclxufVxyXG5cclxuZXhwb3J0IHR5cGUgQ2F0ZWdvcnlEYXRhID0ge1xyXG5cdFtJdGVtQ2F0ZWdvcmllcy5UaWxlXTogeyBwbGFjZWRUaWxlOiBUaWxlVHlwZSwgbWF4U3RhY2tTaXplPzogbnVtYmVyfTtcclxuXHRbSXRlbUNhdGVnb3JpZXMuUmVzb3VyY2VdOiB7fTtcclxuXHRbSXRlbUNhdGVnb3JpZXMuVG9vbF06IHsgYnJlYWthYmxlVGlsZXM6IFRpbGVUeXBlW119O1xyXG5cdFtJdGVtQ2F0ZWdvcmllcy5UaWxlRW50aXR5XTogeyBwbGFjZWRUaWxlRW50aXR5OiBudW1iZXIsIHRpbGVFbnRpdHlPZmZzZXQ/OiBbbnVtYmVyLCBudW1iZXJdfTtcclxufTtcclxuXHJcbmV4cG9ydCBlbnVtIEl0ZW1UeXBlIHtcclxuXHRTbm93QmxvY2ssXHJcblx0SWNlQmxvY2ssXHJcblx0RGlydEJsb2NrLFxyXG5cdFN0b25lMEJsb2NrLFxyXG5cdFN0b25lMUJsb2NrLFxyXG5cdFN0b25lMkJsb2NrLFxyXG5cdFN0b25lM0Jsb2NrLFxyXG5cdFN0b25lNEJsb2NrLFxyXG5cdFN0b25lNUJsb2NrLFxyXG5cdFN0b25lNkJsb2NrLFxyXG5cdFN0b25lN0Jsb2NrLFxyXG5cdFN0b25lOEJsb2NrLFxyXG5cdFN0b25lOUJsb2NrLFxyXG5cdFRpbkJsb2NrLFxyXG5cdEFsdW1pbnVtQmxvY2ssXHJcblx0R29sZEJsb2NrLFxyXG5cdFRpdGFuaXVtQmxvY2ssXHJcblx0R3JhcGVCbG9jayxcclxuXHRXb29kMEJsb2NrLFxyXG5cdFdvb2QxQmxvY2ssXHJcblx0V29vZDJCbG9jayxcclxuXHRXb29kM0Jsb2NrLFxyXG5cdFdvb2Q0QmxvY2ssXHJcblx0V29vZDVCbG9jayxcclxuXHRXb29kNkJsb2NrLFxyXG5cdFdvb2Q3QmxvY2ssXHJcblx0V29vZDhCbG9jayxcclxuXHRXb29kOUJsb2NrLFxyXG5cdFNlZWQsXHJcbn1cclxuXHJcbmV4cG9ydCB0eXBlIEl0ZW1TdGFjayA9IHtcclxuXHRxdWFudGl0eTogbnVtYmVyO1xyXG5cdGl0ZW06IEl0ZW1UeXBlO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IEl0ZW1zID0gaXRlbVR5cGVEYXRhKHtcclxuXHRbSXRlbVR5cGUuU25vd0Jsb2NrXToge1xyXG5cdFx0dHlwZTogSXRlbUNhdGVnb3JpZXMuVGlsZSxcclxuXHRcdHBsYWNlZFRpbGU6IFRpbGVUeXBlLlNub3csXHJcblx0fSxcclxuXHRbSXRlbVR5cGUuSWNlQmxvY2tdOiB7XHJcblx0XHR0eXBlOiBJdGVtQ2F0ZWdvcmllcy5UaWxlLFxyXG5cdFx0cGxhY2VkVGlsZTogVGlsZVR5cGUuSWNlLFxyXG5cdH0sXHJcblx0W0l0ZW1UeXBlLkRpcnRCbG9ja106IHtcclxuXHRcdHR5cGU6IEl0ZW1DYXRlZ29yaWVzLlRpbGUsXHJcblx0XHRwbGFjZWRUaWxlOiBUaWxlVHlwZS5EaXJ0LFxyXG5cdH0sXHJcblx0W0l0ZW1UeXBlLlN0b25lMEJsb2NrXToge1xyXG5cdFx0dHlwZTogSXRlbUNhdGVnb3JpZXMuVGlsZSxcclxuXHRcdHBsYWNlZFRpbGU6IFRpbGVUeXBlLlN0b25lMCxcclxuXHR9LFxyXG5cdFtJdGVtVHlwZS5TdG9uZTFCbG9ja106IHtcclxuXHRcdHR5cGU6IEl0ZW1DYXRlZ29yaWVzLlRpbGUsXHJcblx0XHRwbGFjZWRUaWxlOiBUaWxlVHlwZS5TdG9uZTEsXHJcblx0fSxcclxuXHRbSXRlbVR5cGUuU3RvbmUyQmxvY2tdOiB7XHJcblx0XHR0eXBlOiBJdGVtQ2F0ZWdvcmllcy5UaWxlLFxyXG5cdFx0cGxhY2VkVGlsZTogVGlsZVR5cGUuU3RvbmUyLFxyXG5cdH0sXHJcblx0W0l0ZW1UeXBlLlN0b25lM0Jsb2NrXToge1xyXG5cdFx0dHlwZTogSXRlbUNhdGVnb3JpZXMuVGlsZSxcclxuXHRcdHBsYWNlZFRpbGU6IFRpbGVUeXBlLlN0b25lMyxcclxuXHR9LFxyXG5cdFtJdGVtVHlwZS5TdG9uZTRCbG9ja106IHtcclxuXHRcdHR5cGU6IEl0ZW1DYXRlZ29yaWVzLlRpbGUsXHJcblx0XHRwbGFjZWRUaWxlOiBUaWxlVHlwZS5TdG9uZTQsXHJcblx0fSxcclxuXHRbSXRlbVR5cGUuU3RvbmU1QmxvY2tdOiB7XHJcblx0XHR0eXBlOiBJdGVtQ2F0ZWdvcmllcy5UaWxlLFxyXG5cdFx0cGxhY2VkVGlsZTogVGlsZVR5cGUuU3RvbmU1LFxyXG5cdH0sXHJcblx0W0l0ZW1UeXBlLlN0b25lNkJsb2NrXToge1xyXG5cdFx0dHlwZTogSXRlbUNhdGVnb3JpZXMuVGlsZSxcclxuXHRcdHBsYWNlZFRpbGU6IFRpbGVUeXBlLlN0b25lNixcclxuXHR9LFxyXG5cdFtJdGVtVHlwZS5TdG9uZTdCbG9ja106IHtcclxuXHRcdHR5cGU6IEl0ZW1DYXRlZ29yaWVzLlRpbGUsXHJcblx0XHRwbGFjZWRUaWxlOiBUaWxlVHlwZS5TdG9uZTcsXHJcblx0fSxcclxuXHRbSXRlbVR5cGUuU3RvbmU4QmxvY2tdOiB7XHJcblx0XHR0eXBlOiBJdGVtQ2F0ZWdvcmllcy5UaWxlLFxyXG5cdFx0cGxhY2VkVGlsZTogVGlsZVR5cGUuU3RvbmU4LFxyXG5cdH0sXHJcblx0W0l0ZW1UeXBlLlN0b25lOUJsb2NrXToge1xyXG5cdFx0dHlwZTogSXRlbUNhdGVnb3JpZXMuVGlsZSxcclxuXHRcdHBsYWNlZFRpbGU6IFRpbGVUeXBlLlN0b25lOSxcclxuXHR9LFxyXG5cdFtJdGVtVHlwZS5UaW5CbG9ja106IHtcclxuXHRcdHR5cGU6IEl0ZW1DYXRlZ29yaWVzLlRpbGUsXHJcblx0XHRwbGFjZWRUaWxlOiBUaWxlVHlwZS5UaW4sXHJcblx0fSxcclxuXHRbSXRlbVR5cGUuQWx1bWludW1CbG9ja106IHtcclxuXHRcdHR5cGU6IEl0ZW1DYXRlZ29yaWVzLlRpbGUsXHJcblx0XHRwbGFjZWRUaWxlOiBUaWxlVHlwZS5BbHVtaW51bSxcclxuXHR9LFxyXG5cdFtJdGVtVHlwZS5Hb2xkQmxvY2tdOiB7XHJcblx0XHR0eXBlOiBJdGVtQ2F0ZWdvcmllcy5UaWxlLFxyXG5cdFx0cGxhY2VkVGlsZTogVGlsZVR5cGUuR29sZCxcclxuXHR9LFxyXG5cdFtJdGVtVHlwZS5UaXRhbml1bUJsb2NrXToge1xyXG5cdFx0dHlwZTogSXRlbUNhdGVnb3JpZXMuVGlsZSxcclxuXHRcdHBsYWNlZFRpbGU6IFRpbGVUeXBlLlRpdGFuaXVtLFxyXG5cdH0sXHJcblx0W0l0ZW1UeXBlLkdyYXBlQmxvY2tdOiB7XHJcblx0XHR0eXBlOiBJdGVtQ2F0ZWdvcmllcy5UaWxlLFxyXG5cdFx0cGxhY2VkVGlsZTogVGlsZVR5cGUuR3JhcGUsXHJcblx0fSxcclxuXHRbSXRlbVR5cGUuV29vZDBCbG9ja106IHtcclxuXHRcdHR5cGU6IEl0ZW1DYXRlZ29yaWVzLlRpbGUsXHJcblx0XHRwbGFjZWRUaWxlOiBUaWxlVHlwZS5Xb29kMCxcclxuXHR9LFxyXG5cdFtJdGVtVHlwZS5Xb29kMUJsb2NrXToge1xyXG5cdFx0dHlwZTogSXRlbUNhdGVnb3JpZXMuVGlsZSxcclxuXHRcdHBsYWNlZFRpbGU6IFRpbGVUeXBlLldvb2QxLFxyXG5cdH0sXHJcblx0W0l0ZW1UeXBlLldvb2QyQmxvY2tdOiB7XHJcblx0XHR0eXBlOiBJdGVtQ2F0ZWdvcmllcy5UaWxlLFxyXG5cdFx0cGxhY2VkVGlsZTogVGlsZVR5cGUuV29vZDIsXHJcblx0fSxcclxuXHRbSXRlbVR5cGUuV29vZDNCbG9ja106IHtcclxuXHRcdHR5cGU6IEl0ZW1DYXRlZ29yaWVzLlRpbGUsXHJcblx0XHRwbGFjZWRUaWxlOiBUaWxlVHlwZS5Xb29kMyxcclxuXHR9LFxyXG5cdFtJdGVtVHlwZS5Xb29kNEJsb2NrXToge1xyXG5cdFx0dHlwZTogSXRlbUNhdGVnb3JpZXMuVGlsZSxcclxuXHRcdHBsYWNlZFRpbGU6IFRpbGVUeXBlLldvb2Q0LFxyXG5cdH0sXHJcblx0W0l0ZW1UeXBlLldvb2Q1QmxvY2tdOiB7XHJcblx0XHR0eXBlOiBJdGVtQ2F0ZWdvcmllcy5UaWxlLFxyXG5cdFx0cGxhY2VkVGlsZTogVGlsZVR5cGUuV29vZDUsXHJcblx0fSxcclxuXHRbSXRlbVR5cGUuV29vZDZCbG9ja106IHtcclxuXHRcdHR5cGU6IEl0ZW1DYXRlZ29yaWVzLlRpbGUsXHJcblx0XHRwbGFjZWRUaWxlOiBUaWxlVHlwZS5Xb29kNixcclxuXHR9LFxyXG5cdFtJdGVtVHlwZS5Xb29kN0Jsb2NrXToge1xyXG5cdFx0dHlwZTogSXRlbUNhdGVnb3JpZXMuVGlsZSxcclxuXHRcdHBsYWNlZFRpbGU6IFRpbGVUeXBlLldvb2Q3LFxyXG5cdH0sXHJcblx0W0l0ZW1UeXBlLldvb2Q4QmxvY2tdOiB7XHJcblx0XHR0eXBlOiBJdGVtQ2F0ZWdvcmllcy5UaWxlLFxyXG5cdFx0cGxhY2VkVGlsZTogVGlsZVR5cGUuV29vZDgsXHJcblx0fSxcclxuXHRbSXRlbVR5cGUuV29vZDlCbG9ja106IHtcclxuXHRcdHR5cGU6IEl0ZW1DYXRlZ29yaWVzLlRpbGUsXHJcblx0XHRwbGFjZWRUaWxlOiBUaWxlVHlwZS5Xb29kOSxcclxuXHR9LFxyXG5cdFtJdGVtVHlwZS5TZWVkXToge1xyXG5cdFx0dHlwZTogSXRlbUNhdGVnb3JpZXMuVGlsZUVudGl0eSxcclxuXHRcdHBsYWNlZFRpbGVFbnRpdHk6IFRpbGVFbnRpdGllcy5TZWVkLFxyXG5cdFx0dGlsZUVudGl0eU9mZnNldDogWy0xLCAtNl0sXHJcblx0fSxcclxuXHQvLyBbSXRlbVR5cGUuVGluUGlja2F4ZV06IHtcclxuXHQvLyBcdHR5cGU6IEl0ZW1DYXRlZ29yaWVzLlRvb2wsXHJcblx0Ly8gXHRicmVha2FibGVUaWxlczogW1RpbGVUeXBlLlNub3csIFRpbGVUeXBlLkljZSwgVGlsZVR5cGUuRGlydCwgVGlsZVR5cGUuV29vZDAsIFRpbGVUeXBlLlN0b25lMCwgVGlsZVR5cGUuU3RvbmUxLCBUaWxlVHlwZS5UaW4sIFRpbGVUeXBlLkFsdW1pbnVtXVxyXG5cdC8vIH1cclxufSk7XHJcblxyXG5leHBvcnQgdHlwZSBJbnZlbnRvcnlVcGRhdGVQYXlsb2FkID0ge1xyXG5cdHNsb3Q6IG51bWJlcjtcclxuXHRpdGVtOiBJdGVtU3RhY2sgfCB1bmRlZmluZWQ7XHJcbn1bXTtcclxuXHJcbmV4cG9ydCB0eXBlIEludmVudG9yeVBheWxvYWQgPSB7XHJcblx0aXRlbXM6IChJdGVtU3RhY2sgfCB1bmRlZmluZWQpW107XHJcblxyXG5cdHdpZHRoOiBudW1iZXI7XHJcblx0aGVpZ2h0OiBudW1iZXI7XHJcbn07XHJcbiIsImV4cG9ydCBlbnVtIFRpbGVUeXBlIHtcclxuXHRBaXIsXHJcblx0U25vdyxcclxuXHRJY2UsXHJcblx0RGlydCxcclxuXHRTdG9uZTAsXHJcblx0U3RvbmUxLFxyXG5cdFN0b25lMixcclxuXHRTdG9uZTMsXHJcblx0U3RvbmU0LFxyXG5cdFN0b25lNSxcclxuXHRTdG9uZTYsXHJcblx0U3RvbmU3LFxyXG5cdFN0b25lOCxcclxuXHRTdG9uZTksXHJcblx0VGluLFxyXG5cdEFsdW1pbnVtLFxyXG5cdEdvbGQsXHJcblx0VGl0YW5pdW0sXHJcblx0R3JhcGUsXHJcblx0V29vZDAsXHJcblx0V29vZDEsXHJcblx0V29vZDIsXHJcblx0V29vZDMsXHJcblx0V29vZDQsXHJcblx0V29vZDUsXHJcblx0V29vZDYsXHJcblx0V29vZDcsXHJcblx0V29vZDgsXHJcblx0V29vZDksXHJcbn0iLCJleHBvcnQgZW51bSBUaWxlRW50aXRpZXMge1xyXG5cdFRyZWUsXHJcblx0VGllcjFEcmlsbCxcclxuXHRUaWVyMkRyaWxsLFxyXG5cdFRpZXIzRHJpbGwsXHJcblx0VGllcjREcmlsbCxcclxuXHRUaWVyNURyaWxsLFxyXG5cdENyYWZ0aW5nQmVuY2gsXHJcblx0U2VlZCxcclxufVxyXG5cclxudHlwZSBEYXRhUGFpcnM8VCwgSyBleHRlbmRzIGtleW9mIFQgPSBrZXlvZiBUPiA9IEsgZXh0ZW5kcyBrZXlvZiBUXHJcblx0PyB7IHR5cGVfOiBLOyBkYXRhOiBUW0tdIH1cclxuXHQ6IG5ldmVyO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBUaWxlRW50aXRpZXNEYXRhIHtcclxuXHRbVGlsZUVudGl0aWVzLlRyZWVdOiB7IHdvb2RDb3VudDogbnVtYmVyOyBzZWVkQ291bnQ6IG51bWJlciB9O1xyXG5cdFtUaWxlRW50aXRpZXMuVGllcjFEcmlsbF06IHsgIH07XHJcblx0W1RpbGVFbnRpdGllcy5UaWVyMkRyaWxsXTogeyAgfTtcclxuXHRbVGlsZUVudGl0aWVzLlRpZXIzRHJpbGxdOiB7ICB9O1xyXG5cdFtUaWxlRW50aXRpZXMuVGllcjREcmlsbF06IHsgIH07XHJcblx0W1RpbGVFbnRpdGllcy5UaWVyNURyaWxsXTogeyAgfTtcclxuXHRbVGlsZUVudGl0aWVzLkNyYWZ0aW5nQmVuY2hdOiB7ICB9O1xyXG5cdFtUaWxlRW50aXRpZXMuU2VlZF06IHsgIH07XHJcbn1cclxuXHJcbmV4cG9ydCB0eXBlIFRpbGVFbnRpdHlEYXRhID0gRGF0YVBhaXJzPFRpbGVFbnRpdGllc0RhdGE+ICYge31cclxuXHJcbmV4cG9ydCB0eXBlIFRpbGVFbnRpdHlQYXlsb2FkID0ge1xyXG5cdGlkOiBzdHJpbmc7XHJcblx0Y292ZXJlZFRpbGVzOiBudW1iZXJbXTtcclxuXHRyZWZsZWN0ZWRUaWxlczogbnVtYmVyW107XHJcblx0cGF5bG9hZDogVGlsZUVudGl0eURhdGE7XHJcbn07XHJcblxyXG5leHBvcnQgZW51bSBUaWxlRW50aXR5VGV4dHVyZXMge1xyXG5cdFRyZWUxLFxyXG5cdFRyZWUyLFxyXG5cdFRyZWUzLFxyXG5cdFRyZWU0LFxyXG5cdFRyZWU1LFxyXG5cdFRyZWU2LFxyXG5cdFRyZWU3LFxyXG5cdFRyZWU4LFxyXG5cdFRyZWU5LFxyXG5cdFRyZWUxMCxcclxufVxyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuLy8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbl9fd2VicGFja19yZXF1aXJlX18ubSA9IF9fd2VicGFja19tb2R1bGVzX187XG5cbiIsInZhciBkZWZlcnJlZCA9IFtdO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5PID0gKHJlc3VsdCwgY2h1bmtJZHMsIGZuLCBwcmlvcml0eSkgPT4ge1xuXHRpZihjaHVua0lkcykge1xuXHRcdHByaW9yaXR5ID0gcHJpb3JpdHkgfHwgMDtcblx0XHRmb3IodmFyIGkgPSBkZWZlcnJlZC5sZW5ndGg7IGkgPiAwICYmIGRlZmVycmVkW2kgLSAxXVsyXSA+IHByaW9yaXR5OyBpLS0pIGRlZmVycmVkW2ldID0gZGVmZXJyZWRbaSAtIDFdO1xuXHRcdGRlZmVycmVkW2ldID0gW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldO1xuXHRcdHJldHVybjtcblx0fVxuXHR2YXIgbm90RnVsZmlsbGVkID0gSW5maW5pdHk7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgZGVmZXJyZWQubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldID0gZGVmZXJyZWRbaV07XG5cdFx0dmFyIGZ1bGZpbGxlZCA9IHRydWU7XG5cdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBjaHVua0lkcy5sZW5ndGg7IGorKykge1xuXHRcdFx0aWYgKChwcmlvcml0eSAmIDEgPT09IDAgfHwgbm90RnVsZmlsbGVkID49IHByaW9yaXR5KSAmJiBPYmplY3Qua2V5cyhfX3dlYnBhY2tfcmVxdWlyZV9fLk8pLmV2ZXJ5KChrZXkpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fLk9ba2V5XShjaHVua0lkc1tqXSkpKSkge1xuXHRcdFx0XHRjaHVua0lkcy5zcGxpY2Uoai0tLCAxKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZ1bGZpbGxlZCA9IGZhbHNlO1xuXHRcdFx0XHRpZihwcmlvcml0eSA8IG5vdEZ1bGZpbGxlZCkgbm90RnVsZmlsbGVkID0gcHJpb3JpdHk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKGZ1bGZpbGxlZCkge1xuXHRcdFx0ZGVmZXJyZWQuc3BsaWNlKGktLSwgMSlcblx0XHRcdHZhciByID0gZm4oKTtcblx0XHRcdGlmIChyICE9PSB1bmRlZmluZWQpIHJlc3VsdCA9IHI7XG5cdFx0fVxuXHR9XG5cdHJldHVybiByZXN1bHQ7XG59OyIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gbm8gYmFzZVVSSVxuXG4vLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGFuZCBsb2FkaW5nIGNodW5rc1xuLy8gdW5kZWZpbmVkID0gY2h1bmsgbm90IGxvYWRlZCwgbnVsbCA9IGNodW5rIHByZWxvYWRlZC9wcmVmZXRjaGVkXG4vLyBbcmVzb2x2ZSwgcmVqZWN0LCBQcm9taXNlXSA9IGNodW5rIGxvYWRpbmcsIDAgPSBjaHVuayBsb2FkZWRcbnZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG5cdFwibWFpblwiOiAwXG59O1xuXG4vLyBubyBjaHVuayBvbiBkZW1hbmQgbG9hZGluZ1xuXG4vLyBubyBwcmVmZXRjaGluZ1xuXG4vLyBubyBwcmVsb2FkZWRcblxuLy8gbm8gSE1SXG5cbi8vIG5vIEhNUiBtYW5pZmVzdFxuXG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8uaiA9IChjaHVua0lkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID09PSAwKTtcblxuLy8gaW5zdGFsbCBhIEpTT05QIGNhbGxiYWNrIGZvciBjaHVuayBsb2FkaW5nXG52YXIgd2VicGFja0pzb25wQ2FsbGJhY2sgPSAocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24sIGRhdGEpID0+IHtcblx0dmFyIFtjaHVua0lkcywgbW9yZU1vZHVsZXMsIHJ1bnRpbWVdID0gZGF0YTtcblx0Ly8gYWRkIFwibW9yZU1vZHVsZXNcIiB0byB0aGUgbW9kdWxlcyBvYmplY3QsXG5cdC8vIHRoZW4gZmxhZyBhbGwgXCJjaHVua0lkc1wiIGFzIGxvYWRlZCBhbmQgZmlyZSBjYWxsYmFja1xuXHR2YXIgbW9kdWxlSWQsIGNodW5rSWQsIGkgPSAwO1xuXHRpZihjaHVua0lkcy5zb21lKChpZCkgPT4gKGluc3RhbGxlZENodW5rc1tpZF0gIT09IDApKSkge1xuXHRcdGZvcihtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xuXHRcdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcblx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYocnVudGltZSkgdmFyIHJlc3VsdCA9IHJ1bnRpbWUoX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cdH1cblx0aWYocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24pIHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKGRhdGEpO1xuXHRmb3IoO2kgPCBjaHVua0lkcy5sZW5ndGg7IGkrKykge1xuXHRcdGNodW5rSWQgPSBjaHVua0lkc1tpXTtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oaW5zdGFsbGVkQ2h1bmtzLCBjaHVua0lkKSAmJiBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pIHtcblx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXVswXSgpO1xuXHRcdH1cblx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPSAwO1xuXHR9XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLk8ocmVzdWx0KTtcbn1cblxudmFyIGNodW5rTG9hZGluZ0dsb2JhbCA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtzbm93ZWRfaW5cIl0gPSBzZWxmW1wid2VicGFja0NodW5rc25vd2VkX2luXCJdIHx8IFtdO1xuY2h1bmtMb2FkaW5nR2xvYmFsLmZvckVhY2god2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCAwKSk7XG5jaHVua0xvYWRpbmdHbG9iYWwucHVzaCA9IHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2guYmluZChjaHVua0xvYWRpbmdHbG9iYWwpKTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGRlcGVuZHMgb24gb3RoZXIgbG9hZGVkIGNodW5rcyBhbmQgZXhlY3V0aW9uIG5lZWQgdG8gYmUgZGVsYXllZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8odW5kZWZpbmVkLCBbXCJtb2R1bGVzLW1haW5cIl0sICgpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvY2xpZW50L0dhbWUudHNcIikpKVxuX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyhfX3dlYnBhY2tfZXhwb3J0c19fKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==