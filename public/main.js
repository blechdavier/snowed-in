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
        this.connection = connection;
        // Initialise the network manager
        this.netManager = new _NetManager__WEBPACK_IMPORTED_MODULE_5__.NetManager(this);
    }
    preload() {
        console.log('Loading assets');
        (0,_assets_Assets__WEBPACK_IMPORTED_MODULE_1__.loadAssets)(this, _assets_Assets__WEBPACK_IMPORTED_MODULE_1__.UiAssets, _assets_Assets__WEBPACK_IMPORTED_MODULE_1__.ItemAssets, _assets_Assets__WEBPACK_IMPORTED_MODULE_1__.WorldAssets, _assets_Assets__WEBPACK_IMPORTED_MODULE_1__.Fonts, _assets_Assets__WEBPACK_IMPORTED_MODULE_1__.PlayerAnimations);
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
        return;
    }
    Object.entries(assetGroup).forEach(asset => {
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

class AudioResource extends _Resource__WEBPACK_IMPORTED_MODULE_0__.Resource {
    // sound: AudioType
    constructor(path) {
        super(path);
    }
    loadResource(game) {
        // this.sound = Audio({
        //     file: this.path,
        //     loop: false,
        //     volume: 1.0,
        // });
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
        // if (this.sound === undefined)
        //     throw new Error(
        //         `Tried to play sound before loading it: ${this.path}`
        //     );
        // this.sound.pause();
        // this.sound.play();
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
/* harmony export */   "Inventory": () => (/* binding */ Inventory)
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
            // If the tile isn't air
            if (_Game__WEBPACK_IMPORTED_MODULE_2__.game.world.worldTiles[_Game__WEBPACK_IMPORTED_MODULE_2__.game.world.width * y + x] !== _global_Tile__WEBPACK_IMPORTED_MODULE_1__.TileType.Air) {
                let tileBeingBroken = _Game__WEBPACK_IMPORTED_MODULE_2__.game.world.worldTiles[_Game__WEBPACK_IMPORTED_MODULE_2__.game.world.width * y + x];
                if (typeof tileBeingBroken === 'number') { //tile is tile
                    if (!_Game__WEBPACK_IMPORTED_MODULE_2__.game.breaking)
                        return;
                    let worldTileBeingBroken = _world_WorldTiles__WEBPACK_IMPORTED_MODULE_4__.WorldTiles[tileBeingBroken];
                    for (let i = 0; i < 5 * _Game__WEBPACK_IMPORTED_MODULE_2__.game.particleMultiplier; i++) {
                        if (worldTileBeingBroken !== undefined)
                            _Game__WEBPACK_IMPORTED_MODULE_2__.game.particles.push(new _world_particles_ColorParticle__WEBPACK_IMPORTED_MODULE_3__.ColorParticle(worldTileBeingBroken.color, Math.random() * 0.2 + 0.1, 10, x + Math.random(), y + Math.random(), 0.2 * (Math.random() - 0.5), -0.15 * Math.random()));
                    }
                    console.info('breaking');
                    _Game__WEBPACK_IMPORTED_MODULE_2__.game.connection.emit('worldBreakStart', _Game__WEBPACK_IMPORTED_MODULE_2__.game.world.width * y + x);
                    _Game__WEBPACK_IMPORTED_MODULE_2__.game.connection.emit('worldBreakFinish');
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
            if (_Game__WEBPACK_IMPORTED_MODULE_2__.game.breaking)
                return;
            console.info('Placing');
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
        this.xVel +=
            0.02 * (+this.rightButton - +this.leftButton);
        if (this.grounded && this.jumpButton) {
            _Game__WEBPACK_IMPORTED_MODULE_1__.game.screenshakeAmount = 0.5;
            for (let i = 0; i < 10 * _Game__WEBPACK_IMPORTED_MODULE_1__.game.particleMultiplier; i++) {
                if (this.bottomCollision !== undefined)
                    _Game__WEBPACK_IMPORTED_MODULE_1__.game.particles.push(new _world_particles_ColorParticle__WEBPACK_IMPORTED_MODULE_6__.ColorParticle(this.bottomCollision.color, 1 / 8 + Math.random() / 8, 20, this.x + this.width * Math.random(), this.y + this.height, 0.2 * (Math.random() - 0.5), 0.2 * -Math.random()));
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
                        for (let i = 0; i < 5 * _Game__WEBPACK_IMPORTED_MODULE_1__.game.particleMultiplier; i++) {
                            if (this.bottomCollision !== undefined)
                                _Game__WEBPACK_IMPORTED_MODULE_1__.game.particles.push(new _world_particles_ColorParticle__WEBPACK_IMPORTED_MODULE_6__.ColorParticle(this.bottomCollision.color, 1 / 8 + Math.random() / 8, 20, this.x + this.width * Math.random(), this.y + this.height, 0.2 * (Math.random() - 0.5), 0.2 * -Math.random()));
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
        reflectivity: 60 //this reflectivity actually does nothing and instead reflectivity can be changed inside ReflectedImageResource.ts
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
        reflectivity: 0
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
        reflectivity: 10
    },
    [_global_Tile__WEBPACK_IMPORTED_MODULE_1__.TileType.Aluminum]: {
        name: 'aluminum ore',
        texture: _assets_Assets__WEBPACK_IMPORTED_MODULE_0__.WorldAssets.middleground.tileset_aluminum,
        connected: true,
        anyConnection: false,
        color: "#31323b",
        friction: 3,
        reflectivity: 17
    },
    [_global_Tile__WEBPACK_IMPORTED_MODULE_1__.TileType.Gold]: {
        name: 'gold ore',
        texture: _assets_Assets__WEBPACK_IMPORTED_MODULE_0__.WorldAssets.middleground.tileset_gold,
        connected: true,
        anyConnection: false,
        color: "#31323b",
        friction: 3,
        reflectivity: 21
    },
    [_global_Tile__WEBPACK_IMPORTED_MODULE_1__.TileType.Titanium]: {
        name: 'titanium ore',
        texture: _assets_Assets__WEBPACK_IMPORTED_MODULE_0__.WorldAssets.middleground.tileset_titanium,
        connected: true,
        anyConnection: false,
        color: "#31323b",
        friction: 3,
        reflectivity: 25
    },
    [_global_Tile__WEBPACK_IMPORTED_MODULE_1__.TileType.Grape]: {
        name: 'grape ore',
        texture: _assets_Assets__WEBPACK_IMPORTED_MODULE_0__.WorldAssets.middleground.tileset_grape,
        connected: true,
        anyConnection: false,
        color: "#31323b",
        friction: 3,
        reflectivity: 29
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBZ0M7QUFZUDtBQUN3QjtBQUNIO0FBRUs7QUFDVDtBQUNZO0FBSXREOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBMkNHO0FBQ3VDO0FBQ3NCO0FBQ1o7QUFDTDtBQUV4QyxNQUFNLElBQUssU0FBUSwyQ0FBRTtJQThKM0IsWUFBWSxVQUFrQjtRQUM3QixLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQywwSEFBMEg7UUE5SjdJLGVBQVUsR0FBVyxHQUFHLENBQUMsQ0FBQyxnRkFBZ0Y7UUFDMUcsZ0JBQVcsR0FBVyxHQUFHLENBQUMsQ0FBQyxnRkFBZ0Y7UUFFM0csZUFBVSxHQUFXLENBQUMsQ0FBQyxDQUFDLDZCQUE2QjtRQUNyRCxnQkFBVyxHQUFXLENBQUMsQ0FBQyxDQUFDLDhCQUE4QjtRQUV2RCxnQkFBVyxHQUFXLENBQUMsQ0FBQyxDQUFDLHVGQUF1RjtRQUVoSCxTQUFJLEdBQVcsQ0FBQyxDQUFDLENBQUMsdUlBQXVJO1FBQ3pKLFNBQUksR0FBVyxDQUFDLENBQUMsQ0FBQyx3SUFBd0k7UUFDMUosVUFBSyxHQUFXLENBQUMsQ0FBQyxDQUFDLCtCQUErQjtRQUNsRCxVQUFLLEdBQVcsQ0FBQyxDQUFDLENBQUMsK0JBQStCO1FBQ2xELHFCQUFnQixHQUFXLENBQUMsQ0FBQyxDQUFDLHNDQUFzQztRQUNwRSxxQkFBZ0IsR0FBVyxDQUFDLENBQUMsQ0FBQyxzQ0FBc0M7UUFDcEUsZ0JBQVcsR0FBVyxDQUFDLENBQUMsQ0FBQyxpQ0FBaUM7UUFDMUQsZ0JBQVcsR0FBVyxDQUFDLENBQUMsQ0FBQyxpQ0FBaUM7UUFDMUQsc0JBQWlCLEdBQVcsQ0FBQyxDQUFDLENBQUMsd0RBQXdEO1FBRXZGLGtCQUFrQjtRQUNsQixnQkFBVyxHQUFXLENBQUMsQ0FBQyxDQUFDLDJHQUEyRztRQUNwSSxjQUFTLEdBQVcsRUFBRSxDQUFDLENBQUMsK0VBQStFO1FBQ3ZHLHdCQUFtQixHQUFXLENBQUMsQ0FBQyxDQUFDLGlGQUFpRjtRQUNsSCxxQkFBZ0IsR0FBVyxFQUFFLENBQUMsQ0FBQyw4UUFBOFE7UUFFN1Msb0JBQW9CO1FBQ3BCLGtCQUFhLEdBQVcsSUFBSSxDQUFDLENBQUMsMkZBQTJGO1FBQ3pILHFCQUFnQixHQUFXLElBQUksQ0FBQyxDQUFDLG9DQUFvQztRQUVyRSxxREFBcUQ7UUFFckQsaUJBQVksR0FBRyxDQUFDLENBQUMsQ0FBQztRQUVsQixnQkFBVyxHQUFHLENBQUMsQ0FBQyxDQUFDLDBDQUEwQztRQUMzRCxnQkFBVyxHQUFHLENBQUMsQ0FBQyxDQUFDLDBDQUEwQztRQUMzRCxtQkFBYyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUU7UUFDM0IsWUFBTyxHQUFHLElBQUksQ0FBQyxDQUFDLDhCQUE4QjtRQUU5QyxTQUFJLEdBQWMsRUFBRSxDQUFDO1FBRXJCLGdCQUFXLEdBQVksS0FBSyxDQUFDO1FBRTdCLCtDQUErQztRQUMvQyxhQUFRLEdBQWM7WUFDckIsSUFBSSxtREFBTyxDQUNWLFlBQVksRUFDWixJQUFJLEVBQ0osRUFBRSxFQUNGLEdBQUcsRUFBRTtnQkFDSixJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssU0FBUztvQkFBRSxPQUFPO2dCQUN6QyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO1lBQ3RDLENBQUMsRUFDRCxHQUFHLEVBQUU7Z0JBQ0osSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLFNBQVM7b0JBQUUsT0FBTztnQkFDekMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztZQUN2QyxDQUFDLENBQ0Q7WUFDRCxJQUFJLG1EQUFPLENBQ1YsV0FBVyxFQUNYLElBQUksRUFDSixFQUFFLEVBQ0YsR0FBRyxFQUFFO2dCQUNKLElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxTQUFTO29CQUFFLE9BQU87Z0JBQ3pDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7WUFDckMsQ0FBQyxFQUNELEdBQUcsRUFBRTtnQkFDSixJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssU0FBUztvQkFBRSxPQUFPO2dCQUN6QyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO1lBQ3RDLENBQUMsQ0FDRDtZQUNELElBQUksbURBQU8sQ0FDVixNQUFNLEVBQ04sSUFBSSxFQUNKLEVBQUUsRUFDRixHQUFHLEVBQUU7Z0JBQ0osSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLFNBQVM7b0JBQUUsT0FBTztnQkFDekMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztZQUNyQyxDQUFDLEVBQ0QsR0FBRyxFQUFFO2dCQUNKLElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxTQUFTO29CQUFFLE9BQU87Z0JBQ3pDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7WUFDdEMsQ0FBQyxDQUNEO1lBQ0QsSUFBSSxtREFBTyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRTtnQkFDbkMsb0JBQW9CO2dCQUNwQixpQkFBaUI7Z0JBQ2pCLFVBQVU7Z0JBQ1YsSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLFNBQVM7b0JBQy9CLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSw0REFBUyxDQUFDLHVEQUFXLEVBQUUscURBQVMsQ0FBQyxDQUFDOztvQkFDbkQsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7WUFDakMsQ0FBQyxDQUFDO1lBQ0YsSUFBSSxtREFBTyxDQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRTtnQkFDdkMsb0JBQW9CO2dCQUNwQixvQ0FBb0M7Z0JBQ3BDLHNCQUFzQjtnQkFDdEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO1lBQ3ZELENBQUMsQ0FBQztZQUNGLElBQUksbURBQU8sQ0FBQyxVQUFVLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUU7Z0JBQ3RDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUM7WUFDdkMsQ0FBQyxDQUFDO1lBQ0YsSUFBSSxtREFBTyxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRTtnQkFDdEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQztZQUN2QyxDQUFDLENBQUM7WUFDRixJQUFJLG1EQUFPLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFO2dCQUN0QyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDO1lBQ3ZDLENBQUMsQ0FBQztZQUNGLElBQUksbURBQU8sQ0FBQyxVQUFVLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUU7Z0JBQ3RDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUM7WUFDdkMsQ0FBQyxDQUFDO1lBQ0YsSUFBSSxtREFBTyxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRTtnQkFDdEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQztZQUN2QyxDQUFDLENBQUM7WUFDRixJQUFJLG1EQUFPLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFO2dCQUN0QyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDO1lBQ3ZDLENBQUMsQ0FBQztZQUNGLElBQUksbURBQU8sQ0FBQyxVQUFVLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUU7Z0JBQ3RDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUM7WUFDdkMsQ0FBQyxDQUFDO1lBQ0YsSUFBSSxtREFBTyxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRTtnQkFDdEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQztZQUN2QyxDQUFDLENBQUM7WUFDRixJQUFJLG1EQUFPLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFO2dCQUN0QyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDO1lBQ3ZDLENBQUMsQ0FBQztZQUNGLElBQUksbURBQU8sQ0FBQyxXQUFXLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUU7Z0JBQ3ZDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUM7WUFDdkMsQ0FBQyxDQUFDO1lBQ0YsSUFBSSxtREFBTyxDQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRTtnQkFDeEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQztZQUN4QyxDQUFDLENBQUM7WUFDRixJQUFJLG1EQUFPLENBQUMsV0FBVyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFO2dCQUN4QyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDO1lBQ3hDLENBQUMsQ0FBQyxFQUFFLGFBQWE7U0FDakIsQ0FBQztRQXVCRixhQUFRLEdBQVksSUFBSSxDQUFDO1FBSXhCLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1FBRTdCLGlDQUFpQztRQUNqQyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksbURBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBRUQsT0FBTztRQUNOLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUM5QiwwREFBVSxDQUNULElBQUksRUFDSixvREFBUSxFQUNSLHNEQUFVLEVBQ1YsdURBQVcsRUFDWCxpREFBSyxFQUNMLDREQUFnQixDQUNoQixDQUFDO1FBQ0YsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FDL0IsMkJBQTJCLEVBQzNCLHlCQUF5QixDQUN6QixDQUFDO0lBQ0gsQ0FBQztJQUVELEtBQUs7UUFDSixPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzVCLHFJQUFxSTtRQUNySSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDckUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUV6QyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRXRFLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSwwREFBUSxDQUFDLHVEQUFXLEVBQUUscURBQVMsQ0FBQyxDQUFDO1FBRXRELE9BQU87UUFDUCxXQUFXLENBQUMsR0FBRyxFQUFFO1lBQ2hCLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxTQUFTO2dCQUFFLE9BQU87WUFDckMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkIsQ0FBQyxFQUFFLElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBRTFDLDBDQUEwQztRQUMxQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7UUFFckIsbUVBQW1FO1FBQ25FLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUVoQixvRkFBb0Y7UUFDcEYsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUM3QixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUN0QjtRQUVELHNIQUFzSDtRQUN0SCxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3pCLDZDQUE2QztRQUM3QyxJQUFJLENBQUMsa0JBQWtCLEdBQUcsQ0FBQyxDQUFDO1FBQzVCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ2hCLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBQ2pCLEtBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBQyxJQUFJLENBQUMsS0FBSyxHQUFDLElBQUksQ0FBQyxXQUFXLEdBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3JELElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUkseURBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUMsSUFBSSxDQUFDLEtBQUssR0FBQyxJQUFJLENBQUMsV0FBVyxHQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxHQUFDLENBQUMsSUFBSSxHQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDakg7UUFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksR0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBQyxTQUFTLENBQUM7UUFDdEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFRCxJQUFJO1FBQ0gsSUFBSSxJQUFJLENBQUMsVUFBVSxLQUFLLENBQUMsRUFBRTtZQUMxQixxREFBcUQ7WUFDckQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsa0JBQWtCLEVBQUU7Z0JBQzdDLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQztnQkFDbkMsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDO2FBQ3BDLENBQUMsQ0FBQztZQUNILElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUN4QixVQUFVLEVBQ1Ysc0ZBQTBDLENBQzFDLENBQUM7WUFDRiwrREFBK0Q7WUFDL0QsK0NBQStDO1lBQy9DLDZEQUE2RDtZQUM3RCwyQ0FBMkM7WUFDM0MsTUFBTTtZQUNOLE1BQU07U0FDTjtRQUNELDJCQUEyQjtRQUMzQixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFFZix3QkFBd0I7UUFDeEIsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ25CLElBQUcsSUFBSSxDQUFDLGNBQWMsSUFBSSxJQUFJLENBQUMsS0FBSyxJQUFFLFNBQVMsRUFBRTtZQUNqRCxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7U0FBQztRQUVyRSxvQ0FBb0M7UUFDcEMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBRWxCLDBEQUEwRDtRQUMxRCxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxjQUFjLEVBQUU7WUFDekMsSUFBSSxDQUFDLGdCQUFnQjtZQUNyQixJQUFJLENBQUMsZ0JBQWdCO1NBQ3JCLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUNuRCxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDckMsd0JBQXdCO1FBQ3hCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVwRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUV6RCxLQUFLLElBQUksS0FBSyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDOUIsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1NBQ3JDO1FBRUQsSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLFNBQVM7WUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRXhFLHFDQUFxQztRQUNyQyx3QkFBd0I7UUFFeEIsK0NBQStDO1FBQy9DLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUMvQyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFO2dCQUN2RCxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQzVCLENBQUMsRUFBRSxDQUFDO2FBQ0o7U0FDRDtRQUVELHlCQUF5QjtRQUN6QixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDaEIsMkJBQTJCO1FBQzNCLEtBQUssSUFBSSxRQUFRLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNwQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7U0FDeEM7UUFFRCxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxtQkFBbUI7UUFDbEMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxXQUFXLEdBQUcsSUFBSSxHQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUMsRUFBRSxDQUFDLENBQUMsd0JBQXdCO1FBQzVGLG9FQUF3QixDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzlELElBQUksQ0FBQyxjQUFjLENBQUMsV0FBVyxHQUFHLEdBQUcsQ0FBQztRQUN0QyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFFaEIsbUJBQW1CO1FBQ25CLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxTQUFTLEVBQUU7WUFDN0IsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDcEQsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUVsRCxtRUFBdUIsQ0FDdEIsSUFBSSxFQUNKLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFDaEQsQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQ3BCLEVBQUUsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUNyQixFQUFFLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FDckIsQ0FBQztnQkFFRixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFlBQVksS0FBSyxDQUFDLEVBQUU7b0JBQzVDLDRFQUFnQyxDQUMvQixJQUFJLEVBQ0osQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUNoRCxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFDcEIsRUFBRSxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQ3JCLEVBQUUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUNyQixDQUFDO2lCQUNGO3FCQUFNO29CQUNOLG1FQUF1QixDQUN0QixJQUFJLEVBQ0osQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUNoRCxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFDcEIsRUFBRSxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQ3JCLEVBQUUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUNyQixDQUFDO2lCQUNGO2dCQUVELElBQUksV0FBVyxLQUFLLFNBQVMsSUFBSSxXQUFXLEtBQUssSUFBSSxFQUFFO29CQUN0RCxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNiLElBQUksSUFBSSxDQUFDLFlBQVksS0FBSyxDQUFDLEVBQUU7d0JBQzVCLElBQUksQ0FBQyxjQUFjLENBQUMsV0FBVyxHQUFHLEdBQUcsQ0FBQzt3QkFDdEMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7cUJBQ2xCO29CQUVELHNEQUFVLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FDbEMsSUFBSSxFQUNKLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFDaEQsQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQ3BCLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUNwQixDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FDcEIsQ0FBQztvQkFFRixvRUFBd0IsQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUMsTUFBTSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUUsRUFBRSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7b0JBQzFLLGFBQWE7b0JBQ2IseUJBQXlCO29CQUN6QixzREFBc0Q7b0JBQ3RELDBCQUEwQjtvQkFDMUIsS0FBSztvQkFFTCxJQUFJLENBQUMsY0FBYyxDQUFDLFdBQVcsR0FBRyxHQUFHLENBQUM7aUJBQ3RDO2FBQ0Q7WUFFRCxrQkFBa0I7WUFDbEIsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1NBQ2xCO1FBRUQsSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLFNBQVM7WUFDL0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUUvQyxvRUFBd0IsQ0FBQyxJQUFJLEVBQUUsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsTUFBTSxHQUFDLENBQUMsR0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDckcsSUFBRyxDQUFDLElBQUksQ0FBQyxXQUFXO1lBQ3BCLGdFQUFvQixDQUFDLElBQUksRUFBRSwyQkFBMkIsRUFBRSxJQUFJLENBQUMsS0FBSyxHQUFDLENBQUMsR0FBQyxJQUFJLENBQUMsV0FBVyxHQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsV0FBVyxHQUFDLENBQUMsR0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUMsSUFBSSxDQUFDLFdBQVcsR0FBQyxFQUFFLENBQUMsQ0FBQztRQUV4Syw0QkFBNEI7SUFDN0IsQ0FBQztJQUVELGFBQWE7UUFFWixJQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBQ3BDLHFDQUFxQztRQUNyQyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQzFCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUNsRCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FDcEQsQ0FBQztRQUVGLElBQUcsSUFBSSxDQUFDLE1BQU0sSUFBRyxTQUFTLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUMsQ0FBQyxFQUFFLEVBQUMsa0RBQWtEO1lBQ3RHLEtBQUksSUFBSSxLQUFLLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtnQkFDN0IsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFDLElBQUksQ0FBQyxXQUFXLEdBQUMsSUFBSSxDQUFDLEtBQUssR0FBQyxJQUFJLENBQUMsV0FBVyxHQUFDLFlBQVksQ0FBQzthQUM1SDtTQUNEO1FBQ0QsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUN2RCxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUloRSxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsRUFBRTtZQUM3QyxDQUFDLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUM7WUFDekMsQ0FBQyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDO1NBQzFDLENBQUMsQ0FBQztRQUVILElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxTQUFTO1lBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUNqRSxDQUFDO0lBRUQsVUFBVSxDQUFDLEtBQW9CO1FBQzlCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLElBQUksQ0FBQztRQUMvQixLQUFLLElBQUksT0FBTyxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDbEMsSUFBSSxPQUFPLENBQUMsUUFBUSxJQUFJLE9BQU8sQ0FBQyxPQUFPLEtBQUssS0FBSyxDQUFDLE9BQU87Z0JBQ3hELDhDQUE4QztnQkFDOUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDO1NBQ3JCO1FBQ0QsSUFDQyxJQUFJLENBQUMsU0FBUyxLQUFLLFNBQVM7WUFDNUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEtBQUssU0FBUyxFQUN0QztZQUNELEtBQUssSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUU7Z0JBQ3hDLElBQUksQ0FBQyxDQUFDLFNBQVMsRUFBRTtvQkFDaEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDckIsQ0FBQyxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7b0JBQ3BCLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO29CQUMvQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO29CQUN4QyxDQUFDLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7b0JBQ3hCLENBQUMsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO29CQUNsQixDQUFDLENBQUMsS0FBSyxHQUFHLHNFQUEwQixDQUFDO2lCQUNyQzthQUNEO1NBQ0Q7SUFDRixDQUFDO0lBRUQsV0FBVyxDQUFDLEtBQW9CO1FBQy9CLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEtBQUssQ0FBQztRQUNoQyxLQUFLLElBQUksT0FBTyxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDbEMsSUFBSSxPQUFPLENBQUMsUUFBUSxJQUFJLE9BQU8sQ0FBQyxPQUFPLEtBQUssS0FBSyxDQUFDLE9BQU87Z0JBQ3hELDhDQUE4QztnQkFDOUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDO1NBQ3RCO0lBQ0YsQ0FBQztJQUVELHVDQUF1QztJQUN2QyxZQUFZO1FBQ1gsSUFDQyxJQUFJLENBQUMsU0FBUyxLQUFLLFNBQVM7WUFDNUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEtBQUssU0FBUyxFQUNuQztZQUNELEtBQUssTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUU7Z0JBQ3ZDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDcEM7U0FDRDtJQUNGLENBQUM7SUFFRCxVQUFVO1FBQ1QsSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLFNBQVMsRUFBRTtZQUNqQyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxLQUFLLFNBQVMsRUFBRTtnQkFDekMsS0FBSyxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRTtvQkFDdkMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztpQkFDNUM7YUFDRDtZQUNELElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEtBQUssU0FBUyxFQUFFO2dCQUM1QyxLQUFLLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFO29CQUMxQyxDQUFDLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2lCQUM1QzthQUNEO1NBQ0Q7SUFDRixDQUFDO0lBRUQsWUFBWSxDQUFDLENBQWE7UUFDekIsSUFBRyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDckIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7WUFDeEIsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQ25CO1FBQ0QscUdBQXFHO1FBQ3JHLElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxTQUFTLEVBQUU7WUFDakMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3RDLE9BQU8sQ0FBQyx1QkFBdUI7U0FDL0I7UUFFRCxJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssU0FBUztZQUFFLE9BQU87UUFFckMsSUFDQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVztZQUNsQyxJQUFJLENBQUMsTUFBTTtnQkFDWCxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVc7b0JBQ3BCLEVBQUUsR0FBRyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUs7WUFDbEQsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVc7WUFDbEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFDbEM7WUFDRCxNQUFNLFdBQVcsR0FBVyxJQUFJLENBQUMsS0FBSyxDQUNyQyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FDNUQsQ0FBQztZQUVGLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsWUFBWSxLQUFLLFNBQVMsRUFBRTtnQkFDcEQsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLEtBQUssU0FBUyxFQUFFO29CQUMxRCxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxZQUFZLEdBQUcsV0FBVyxDQUFDO2lCQUNoRDthQUNEO2lCQUFNO2dCQUNOLHlDQUF5QztnQkFDekMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQ25CLGVBQWUsRUFDZixJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxZQUFZLEVBQ2pDLFdBQVcsQ0FDWCxDQUFDO2dCQUVGLG9DQUFvQztnQkFDcEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsWUFBWSxHQUFHLFNBQVMsQ0FBQzthQUM5QztTQUNEO2FBQU07WUFDTixJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7U0FDekU7SUFDRixDQUFDO0lBRUQsYUFBYTtRQUNaOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7V0FpQ0c7SUFDSixDQUFDO0lBRUQsVUFBVSxDQUFDLEtBQXNCO1FBQ2hDLElBQ0MsSUFBSSxDQUFDLFNBQVMsS0FBSyxTQUFTO1lBQzVCLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxLQUFLLFNBQVMsRUFDbEM7WUFDRCxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztZQUMxQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUNyQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFDckIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQ3hCLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUN4QixDQUFDO1lBQ0YsT0FBTyxDQUFDLEdBQUcsQ0FDVixXQUFXLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxVQUFVLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxVQUFVLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLENBQ3RHLENBQUM7U0FDRjthQUNJO1lBQ0osSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsWUFBWSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBQyxHQUFHLENBQUM7WUFDaEUsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFlBQVksR0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUM7WUFDakcsSUFBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxZQUFZLEdBQUMsQ0FBQztnQkFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxZQUFZLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSztZQUN2RyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQztTQUM5QztJQUNGLENBQUM7SUFFRCxVQUFVO1FBQ1QsSUFBSSxDQUFDLGdCQUFnQjtZQUNwQixJQUFJLENBQUMsS0FBSztnQkFDVixDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxtQkFBbUI7Z0JBQ25ELENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDO1FBQ2xFLElBQUksQ0FBQyxnQkFBZ0I7WUFDcEIsSUFBSSxDQUFDLEtBQUs7Z0JBQ1YsQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsbUJBQW1CO2dCQUNuRCxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUM7SUFDdEUsQ0FBQztJQUVELE9BQU87UUFDTiw0RkFBNEY7UUFDNUYsSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDO1FBRW5DLG1SQUFtUjtRQUNuUixJQUFJLGNBQWMsR0FBRyxDQUFDLENBQUM7UUFDdkIsT0FDQyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxTQUFTO1lBQ2pDLGNBQWMsS0FBSyxJQUFJLENBQUMsZ0JBQWdCLEVBQ3ZDO1lBQ0Qsd0JBQXdCO1lBQ3hCLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxTQUFTO2dCQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUM1QywyQkFBMkI7WUFDM0IsSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDO1lBQ25DLGNBQWMsRUFBRSxDQUFDO1NBQ2pCO1FBQ0QsSUFBSSxjQUFjLEtBQUssSUFBSSxDQUFDLGdCQUFnQixFQUFFO1lBQzdDLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDO1lBQ3JCLE9BQU8sQ0FBQyxJQUFJLENBQ1gsd0RBQXdELENBQ3hELENBQUM7U0FDRjtRQUNELElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDOUQsQ0FBQztJQUVELE1BQU07UUFDTCxJQUFHLElBQUksQ0FBQyxLQUFLLEtBQUssU0FBUyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxLQUFLLFNBQVMsRUFBRSxFQUFDLHVCQUF1QjtZQUM3RixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNqRCxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBQzdDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN2RSxJQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxLQUFLLGlFQUFpQixFQUFFO29CQUN6QyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztvQkFDeEUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSx5RUFBYSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUMsR0FBRyxHQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsQ0FBQyxHQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxHQUFHLEdBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxHQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFDLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7aUJBQ3ZOO2FBQ0Q7U0FDRDtRQUNELEtBQUssSUFBSSxRQUFRLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNwQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDaEI7UUFDRCxLQUFLLElBQUksS0FBSyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDOUIsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ2I7UUFDRCxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxLQUFLLFNBQVM7WUFBRSxPQUFPO1FBRTVDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLG1CQUFtQixFQUFFLENBQUM7UUFDeEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztRQUU1QyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDdkIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxXQUFXO1lBQ2YsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDbkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLENBQUM7Z0JBQzNCLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFdBQVc7Z0JBQ25ELElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7UUFDN0IsSUFBSSxDQUFDLFdBQVc7WUFDZixJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNuQixJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQztnQkFDNUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVztnQkFDckQsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUM3QixJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUNyRCxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUVyRCxJQUFJLENBQUMsaUJBQWlCLElBQUksR0FBRyxDQUFDO1FBRTlCLElBQUksSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUU7WUFDbEIsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7U0FDZDthQUFNLElBQ04sSUFBSSxDQUFDLElBQUk7WUFDVCxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsVUFBVSxFQUNoRTtZQUNELElBQUksQ0FBQyxJQUFJO2dCQUNSLElBQUksQ0FBQyxVQUFVO29CQUNmLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO1NBQ2pEO1FBQ0QsSUFDQyxJQUFJLENBQUMsSUFBSTtZQUNULElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQ25FO1lBQ0QsSUFBSSxDQUFDLElBQUk7Z0JBQ1IsSUFBSSxDQUFDLFdBQVc7b0JBQ2hCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1NBQ25EO0lBQ0YsQ0FBQztJQUVELFdBQVc7UUFDVixPQUFPLENBQUMsR0FBRyxDQUFDLCtDQUErQyxDQUFDO0lBQzdELENBQUM7SUFFRCxXQUFXLENBQUMsQ0FBUyxFQUFFLENBQVMsRUFBRSxDQUFTLEVBQUUsQ0FBUztRQUNyRCwwRUFBMEU7UUFDMUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBQ3hELENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUN4RCxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDeEQsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBRXhELFVBQVU7UUFDViwyRUFBK0IsQ0FDOUIsSUFBSSxFQUNKLENBQUMsRUFDRCxDQUFDLEVBQ0QsQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQ3BCLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUNwQixDQUFDLEVBQ0QsQ0FBQyxFQUNELENBQUMsRUFDRCxDQUFDLENBQ0QsQ0FBQztRQUNGLDJFQUErQixDQUM5QixJQUFJLEVBQ0osQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFDNUIsQ0FBQyxFQUNELENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUNwQixDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFDcEIsQ0FBQyxFQUNELENBQUMsRUFDRCxDQUFDLEVBQ0QsQ0FBQyxDQUNELENBQUM7UUFDRiwyRUFBK0IsQ0FDOUIsSUFBSSxFQUNKLENBQUMsRUFDRCxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUM1QixDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFDcEIsQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQ3BCLENBQUMsRUFDRCxDQUFDLEVBQ0QsQ0FBQyxFQUNELENBQUMsQ0FDRCxDQUFDO1FBQ0YsMkVBQStCLENBQzlCLElBQUksRUFDSixDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUM1QixDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUM1QixDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFDcEIsQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQ3BCLENBQUMsRUFDRCxDQUFDLEVBQ0QsQ0FBQyxFQUNELENBQUMsQ0FDRCxDQUFDO1FBRUYsaUJBQWlCO1FBQ2pCLDJFQUErQixDQUM5QixJQUFJLEVBQ0osQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUN4QixDQUFDLEVBQ0QsQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUN6QixDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFDcEIsQ0FBQyxFQUNELENBQUMsRUFDRCxDQUFDLEVBQ0QsQ0FBQyxDQUNELENBQUM7UUFDRiwyRUFBK0IsQ0FDOUIsSUFBSSxFQUNKLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFDeEIsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFDNUIsQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUN6QixDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFDcEIsQ0FBQyxFQUNELENBQUMsRUFDRCxDQUFDLEVBQ0QsQ0FBQyxDQUNELENBQUM7UUFFRixpQkFBaUI7UUFDakIsMkVBQStCLENBQzlCLElBQUksRUFDSixDQUFDLEVBQ0QsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUN4QixDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFDcEIsQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUN6QixDQUFDLEVBQ0QsQ0FBQyxFQUNELENBQUMsRUFDRCxDQUFDLENBQ0QsQ0FBQztRQUNGLDJFQUErQixDQUM5QixJQUFJLEVBQ0osQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFDNUIsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUN4QixDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFDcEIsQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUN6QixDQUFDLEVBQ0QsQ0FBQyxFQUNELENBQUMsRUFDRCxDQUFDLENBQ0QsQ0FBQztRQUVGLFNBQVM7UUFDVCwyRUFBK0IsQ0FDOUIsSUFBSSxFQUNKLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFDeEIsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUN4QixDQUFDLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQ3pCLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFDekIsQ0FBQyxFQUNELENBQUMsRUFDRCxDQUFDLEVBQ0QsQ0FBQyxDQUNELENBQUM7SUFDSCxDQUFDO0lBRUQ7Ozs7Ozs7Ozs7OztJQVlHO0lBRUgsbUdBQW1HO0lBRW5HLFNBQVMsQ0FDUixLQUFXLEVBQ1gsS0FBVyxFQUNYLEtBQVcsRUFDWCxLQUFXLEVBQ1gsSUFBVSxFQUNWLElBQVUsRUFDVixJQUFVLEVBQ1YsSUFBVTtRQUVWLHVPQUF1TztRQUV2TywwS0FBMEs7UUFDMUssSUFBSSxJQUFJLEtBQUssQ0FBQyxJQUFJLElBQUksS0FBSyxDQUFDLEVBQUU7WUFDN0IsT0FBTyxLQUFLLENBQUM7U0FDYjtRQUVELDBJQUEwSTtRQUMxSSxNQUFNLGVBQWUsR0FBRyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDOUMsTUFBTSxrQkFBa0IsR0FBRyxDQUFDLEtBQUssR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ3pELE1BQU0sZ0JBQWdCLEdBQUcsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQy9DLE1BQU0saUJBQWlCLEdBQUcsQ0FBQyxLQUFLLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQztRQUV4RCxJQUNDLEtBQUssQ0FBQyxlQUFlLENBQUM7WUFDdEIsS0FBSyxDQUFDLGtCQUFrQixDQUFDO1lBQ3pCLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQztZQUN2QixLQUFLLENBQUMsaUJBQWlCLENBQUMsRUFDdkI7WUFDRCxvSEFBb0g7WUFDcEgsNERBQTREO1lBQzVELE9BQU8sS0FBSyxDQUFDO1NBQ2I7UUFFRCxvRUFBb0U7UUFDcEUsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO1FBQzVELE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztRQUMzRCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1FBQzVELE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLGtCQUFrQixDQUFDLENBQUM7UUFFM0QsSUFBSSxLQUFLLEdBQUcsSUFBSSxJQUFJLEtBQUssR0FBRyxJQUFJLEVBQUU7WUFDakMsMkZBQTJGO1lBQzNGLE9BQU8sS0FBSyxDQUFDO1NBQ2I7UUFFRCxJQUFJLElBQUksR0FBRyxDQUFDLElBQUksSUFBSSxHQUFHLENBQUMsRUFBRTtZQUN6QixxR0FBcUc7WUFDckcsT0FBTyxLQUFLLENBQUM7U0FDYjtRQUVELG1EQUFtRDtRQUNuRCxNQUFNLGtCQUFrQixHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRWxELElBQUksS0FBSyxHQUFHLENBQUMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFO1lBQzNCLDREQUE0RDtZQUM1RCxPQUFPLEtBQUssQ0FBQztTQUNiO1FBRUQsSUFBSSxLQUFLLEtBQUssa0JBQWtCLEVBQUU7WUFDakMsb0VBQW9FO1lBQ3BFLElBQUksZ0JBQWdCLEtBQUssS0FBSyxFQUFFO2dCQUMvQiwwRUFBMEU7Z0JBQzFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsa0JBQWtCLENBQUMsQ0FBQzthQUNuQztZQUNELDRHQUE0RztZQUM1RyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1NBQ2xDO1FBQ0QsK0dBQStHO1FBQy9HLElBQUksZUFBZSxLQUFLLEtBQUssRUFBRTtZQUM5Qix5RUFBeUU7WUFDekUsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1NBQ25DO1FBQ0QsNEdBQTRHO1FBQzVHLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLGtCQUFrQixDQUFDLENBQUM7UUFFbEMsZ0NBQWdDO1FBQ2hDLG9GQUFvRjtRQUNwRix5RUFBeUU7SUFDMUUsQ0FBQztJQUVELGNBQWM7UUFDYixjQUFjO1FBQ2Qsd0JBQXdCO1FBQ3hCLG1CQUFtQjtRQUNuQixhQUFhO1FBQ2IsMkRBQTJEO1FBQzNELHFEQUFxRDtRQUNyRCw0QkFBNEI7UUFDNUIsNERBQTREO1FBQzVELHNEQUFzRDtRQUN0RCw0QkFBNEI7UUFDNUIsb0VBQW9FO1FBQ3BFLHFFQUFxRTtRQUNyRSxLQUFLO1FBQ0wsbUNBQW1DO1FBQ25DLDBDQUEwQztRQUMxQyxFQUFFO1FBQ0YscUNBQXFDO1FBQ3JDLGdCQUFnQjtRQUNoQixrREFBa0Q7UUFDbEQseURBQXlEO1FBQ3pELGdDQUFnQztRQUNoQyxtREFBbUQ7UUFDbkQsMERBQTBEO1FBQzFELGdDQUFnQztRQUNoQyx1REFBdUQ7UUFDdkQsdURBQXVEO1FBQ3ZELFNBQVM7UUFDVCxFQUFFO1FBQ0Ysd0NBQXdDO1FBQ3hDLG9CQUFvQjtRQUNwQixFQUFFO1FBQ0YsdUJBQXVCO1FBQ3ZCLEVBQUU7UUFDRiwrQ0FBK0M7UUFDL0MsMkNBQTJDO1FBQzNDLEVBQUU7UUFDRixpQkFBaUI7UUFDakIsb0NBQW9DO1FBQ3BDLGtEQUFrRDtRQUNsRCx5REFBeUQ7UUFDekQsZ0NBQWdDO1FBQ2hDLG1EQUFtRDtRQUNuRCwwREFBMEQ7UUFDMUQsK0JBQStCO1FBQy9CLFNBQVM7UUFDVCxJQUFJO0lBQ0wsQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQW1DRztJQUVILFdBQVc7UUFDVixJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztJQUN0QixDQUFDO0lBRUQsWUFBWTtRQUNYLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0lBQ3JCLENBQUM7SUFFRCxXQUFXO1FBQ1YsSUFDQyxJQUFJLENBQUMsS0FBSyxDQUNULENBQUMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxVQUFVO1lBQ3ZDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztZQUNoQyxJQUFJLENBQUMsVUFBVSxDQUNmLEtBQUssSUFBSSxDQUFDLFdBQVc7WUFDdEIsSUFBSSxDQUFDLEtBQUssQ0FDVCxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsV0FBVztnQkFDeEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO2dCQUNoQyxJQUFJLENBQUMsV0FBVyxDQUNoQixLQUFLLElBQUksQ0FBQyxXQUFXLEVBQ3JCO1lBQ0QsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7U0FDakM7UUFDRCwwRkFBMEY7UUFDMUYsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUM1QixDQUFDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsVUFBVTtZQUN2QyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7WUFDaEMsSUFBSSxDQUFDLFVBQVUsQ0FDZixDQUFDO1FBQ0YsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUM1QixDQUFDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsV0FBVztZQUN4QyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7WUFDaEMsSUFBSSxDQUFDLFdBQVcsQ0FDaEIsQ0FBQztJQUNILENBQUM7SUFFRCxVQUFVO1FBQ1QsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2pCLGdDQUFnQztZQUNoQyxxREFBcUQ7WUFDckQsZ0JBQWdCO1lBQ2hCLHVCQUF1QjtZQUN2Qix1QkFBdUI7WUFDdkIsZ0NBQWdDO1lBQ2hDLCtCQUErQjtZQUMvQixTQUFTO1lBRVQsaUJBQWlCO1lBQ2pCLG9EQUFvRDtZQUNwRCwrQ0FBK0M7WUFDL0MsOENBQThDO1lBQzlDLFNBQVM7WUFDVCxJQUFJO1lBRUoseUVBQTZCLENBQzVCLElBQUksRUFDSixJQUFJLENBQUMsS0FBSyxDQUNULENBQUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7Z0JBQzFDLElBQUksQ0FBQyxVQUFVO2dCQUNmLElBQUksQ0FBQyxXQUFXLENBQ2hCLEVBQ0QsSUFBSSxDQUFDLEtBQUssQ0FDVCxDQUFDLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDO2dCQUMxQyxJQUFJLENBQUMsV0FBVztnQkFDaEIsSUFBSSxDQUFDLFdBQVcsQ0FDaEIsRUFDRCxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQ2xDLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FDbkMsQ0FBQztZQUNGLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxFQUFFO2dCQUM1QyxJQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFDakcsSUFBSSxPQUFPLENBQUMsWUFBWSxDQUFDLEtBQUssUUFBUSxFQUFFO29CQUN2QyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsR0FBRyxZQUFZLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsY0FBYTtpQkFDakY7cUJBQ0ksSUFBSSx5REFBVSxDQUFDLFlBQVksQ0FBQyxLQUFLLFNBQVMsRUFBRTtvQkFDaEQsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFDLElBQUksR0FBRSx5REFBVSxDQUFDLFlBQVksQ0FBVSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxjQUFhO2lCQUN4SjthQUNEO1NBQ0Q7SUFDRixDQUFDO0NBQ0Q7QUFFRCxNQUFNLFVBQVUsR0FBRyxvREFBRSxDQUFDO0lBQ3JCLElBQUksRUFBRSxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtDQUNyRCxDQUFDLENBQUM7QUFFSSxNQUFNLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzFsQ0g7QUFDeUI7QUFDWjtBQUNKO0FBQ3NDO0FBQ3ZDO0FBQ3lCO0FBQ3BCO0FBSTVDLE1BQU0sVUFBVTtJQUt0QixZQUFZLElBQVU7UUFDckIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFFakIsYUFBYTtRQUNiLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxjQUFjLEVBQUUsS0FBSyxFQUFFLEVBQUU7WUFDekQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsY0FBYyxFQUFFLENBQUMsQ0FBQztZQUNuRCxJQUFJLENBQUMsY0FBYyxHQUFHLGNBQWMsQ0FBQztZQUNyQyxJQUFJLEtBQUssRUFBRTtnQkFDVixNQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQzNDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQTBCLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQzthQUMvRDtRQUNGLENBQUMsQ0FBQyxDQUFDO1FBRUgsd0JBQXdCO1FBQ3hCO1lBQ0MsOENBQThDO1lBQzlDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FDdEIsV0FBVyxFQUNYLENBQ0MsS0FBSyxFQUNMLE1BQU0sRUFDTixLQUFLLEVBQ0wsWUFBWSxFQUNaLFFBQVEsRUFDUixNQUFNLEVBQ04sU0FBUyxFQUNSLEVBQUU7Z0JBQ0gsd0JBQXdCO2dCQUN4QixJQUFJLEVBQUUsR0FBRyxNQUFNLENBQUMsRUFBRTtnQkFDbEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsR0FBRSxFQUFFLENBQUM7Z0JBQ3ZDLEVBQUUsR0FBRyxNQUFNLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsOENBQTZDO2dCQUNoRixPQUFPLENBQUMsR0FBRyxDQUFDLHNCQUFzQixHQUFFLEVBQUUsQ0FBQztnQkFDdkMsSUFBSSxRQUFRLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFDLEVBQUUsQ0FBQyxHQUFDLDhCQUE4QixDQUFDLEdBQUMsQ0FBQyxDQUFDLHVFQUFzRTtnQkFDeEksT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsR0FBRSxRQUFRLENBQUM7Z0JBQzdDLE1BQU0sQ0FBQyxPQUFPLENBQUMsNERBQWdCLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7b0JBQ2xELEtBQUksSUFBSSxLQUFLLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFO3dCQUM1QixLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsc0VBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLHNFQUFRLENBQUMsUUFBUSxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO3FCQUNyRjtnQkFDRixDQUFDLENBQUMsQ0FBQztnQkFDSCxJQUFJLGFBQWEsR0FXYixFQUFFLENBQUM7Z0JBQ1AsWUFBWSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRTtvQkFDakMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsR0FBRyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQ3BELGFBQWEsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLG1DQUN4QixVQUFVLEtBQ2IsRUFBRSxFQUFFLFVBQVUsQ0FBQyxFQUFFLEVBQ2pCLFlBQVksRUFBRSxVQUFVLENBQUMsWUFBWSxFQUNyQyxjQUFjLEVBQUUsVUFBVSxDQUFDLGNBQWMsRUFDekMsU0FBUyxFQUFFLE9BQU8sQ0FDakIsQ0FBQyxFQUNELG9FQUF3QixDQUN2QixVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FDeEIsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUNaLEVBQ0QsT0FBTyxFQUNOLDRFQUFvQixDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQy9DLENBQUM7Z0JBQ0gsQ0FBQyxDQUFDLENBQUM7Z0JBQ0gsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSwrQ0FBSyxDQUMxQixLQUFLLEVBQ0wsTUFBTSxFQUNOLEtBQUssRUFDTCxhQUFhLENBQ2IsQ0FBQztnQkFDRixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsSUFBSSx3REFBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUNyRCxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSw0REFBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNqRCxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLHNFQUFRLENBQUMsUUFBUSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDNUQsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxzRUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQzNELFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7b0JBQ3pCLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSx3RUFBYSxDQUN0RCxNQUFNLENBQUMsSUFBSSxDQUNYLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ1gsQ0FBQyxDQUFDLENBQUM7WUFDSixDQUFDLENBQ0QsQ0FBQztTQUNGO1FBRUQsZUFBZTtRQUNmO1lBQ0MsNENBQTRDO1lBQzVDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FDdEIsYUFBYSxFQUNiLENBQUMsWUFBbUQsRUFBRSxFQUFFO2dCQUN2RCwwQkFBMEI7Z0JBQzFCLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEtBQUssU0FBUztvQkFBRSxPQUFPO2dCQUUxQyxZQUFZLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO29CQUMzQixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3ZELENBQUMsQ0FBQyxDQUFDO1lBQ0osQ0FBQyxDQUNELENBQUM7WUFFRixJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsaUJBQWlCLEVBQUUsT0FBTyxDQUFDLEVBQUU7Z0JBQ3BELDBCQUEwQjtnQkFDMUIsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssS0FBSyxTQUFTO29CQUFFLE9BQU87Z0JBRTFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7b0JBQ3hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBQ3BCLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7Z0JBQzVELENBQUMsQ0FBQyxDQUFDO1lBQ0osQ0FBQyxDQUFDLENBQUM7U0FDSDtRQUVELGdCQUFnQjtRQUNoQjtZQUNDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxjQUFjLEVBQUUsVUFBVSxDQUFDLEVBQUU7Z0JBQ3BELDBCQUEwQjtnQkFDMUIsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssS0FBSyxTQUFTO29CQUFFLE9BQU87Z0JBRTFDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ3ZELElBQUksTUFBTSxLQUFLLFNBQVM7b0JBQUUsT0FBTztnQkFFakMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUMvQixDQUFDLENBQUMsQ0FBQztZQUVILElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsRUFBRTtnQkFDcEUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUFFLE9BQU87Z0JBQ3JELElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDM0MsSUFBRyxDQUFDLFlBQVksc0VBQVksSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLDREQUFnQixDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFO29CQUMzRixrQkFBa0I7b0JBQ2xCLENBQUMsQ0FBQyxnQkFBZ0IsR0FBRyxTQUFTLENBQUM7aUJBQy9CO1lBQ0YsQ0FBQyxDQUFDLENBQUM7WUFFSCxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsY0FBYyxFQUFFLFVBQVUsQ0FBQyxFQUFFO2dCQUNwRCwwQkFBMEI7Z0JBQzFCLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEtBQUssU0FBUztvQkFBRSxPQUFPO2dCQUUxQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksd0VBQWEsQ0FDMUQsVUFBVSxDQUFDLElBQUksQ0FDZixDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ2YsQ0FBQyxDQUFDLENBQUM7WUFFSCxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsY0FBYyxFQUFFLEVBQUUsQ0FBQyxFQUFFO2dCQUM1QywwQkFBMEI7Z0JBQzFCLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEtBQUssU0FBUztvQkFBRSxPQUFPO2dCQUUxQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNyQyxDQUFDLENBQUMsQ0FBQztZQUVILHdDQUF3QztZQUN4QyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQ3RCLGdCQUFnQixFQUNoQixDQUFDLFFBSUEsRUFBRSxFQUFFO2dCQUNKLDBCQUEwQjtnQkFDMUIsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssS0FBSyxTQUFTO29CQUFFLE9BQU87Z0JBRTFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN6QyxDQUFDLENBQ0QsQ0FBQztTQUNGO0lBQ0YsQ0FBQztDQUNEO0FBRUQsU0FBUyxPQUFPLENBQUMsRUFBVSxFQUFFLEVBQVU7SUFDdEMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdkQsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDM0x1RDtBQUNFO0FBQ0Y7QUFDWTtBQUNWO0FBQ1I7QUFDNEI7QUFFOUI7QUEwQmhELE1BQU0sZ0JBQWdCLEdBQUcsQ0FDeEIsSUFBTyxFQUNILEVBQUUsQ0FBQyxJQUFJLENBQUM7QUFFTixNQUFNLGdCQUFnQixHQUFHLGdCQUFnQixDQUFDO0lBQ2hELG9DQUFvQztJQUNwQyxJQUFJLEVBQUU7UUFDTCxDQUFDLElBQUksdUZBQXdCLENBQUMseUNBQXlDLENBQUMsRUFBRSxHQUFHLENBQUM7UUFDOUUsQ0FBQyxJQUFJLHVGQUF3QixDQUFDLHlDQUF5QyxDQUFDLEVBQUUsR0FBRyxDQUFDO1FBQzlFLENBQUMsSUFBSSx1RkFBd0IsQ0FBQyx5Q0FBeUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQztRQUM5RSxDQUFDLElBQUksdUZBQXdCLENBQUMseUNBQXlDLENBQUMsRUFBRSxHQUFHLENBQUM7UUFDOUUsQ0FBQyxJQUFJLHVGQUF3QixDQUFDLHlDQUF5QyxDQUFDLEVBQUUsR0FBRyxDQUFDO1FBQzlFLENBQUMsSUFBSSx1RkFBd0IsQ0FBQyx5Q0FBeUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQztRQUM5RSxDQUFDLElBQUksdUZBQXdCLENBQUMseUNBQXlDLENBQUMsRUFBRSxHQUFHLENBQUM7UUFDOUUsQ0FBQyxJQUFJLHVGQUF3QixDQUFDLHlDQUF5QyxDQUFDLEVBQUUsR0FBRyxDQUFDO0tBQzlFO0lBQ0QsUUFBUSxFQUFFO1FBQ1QsQ0FBQyxJQUFJLHVGQUF3QixDQUFDLGdEQUFnRCxDQUFDLEVBQUUsR0FBRyxDQUFDO1FBQ3JGLENBQUMsSUFBSSx1RkFBd0IsQ0FBQyxnREFBZ0QsQ0FBQyxFQUFFLEdBQUcsQ0FBQztRQUNyRixDQUFDLElBQUksdUZBQXdCLENBQUMsZ0RBQWdELENBQUMsRUFBRSxHQUFHLENBQUM7UUFDckYsQ0FBQyxJQUFJLHVGQUF3QixDQUFDLGdEQUFnRCxDQUFDLEVBQUUsR0FBRyxDQUFDO1FBQ3JGLENBQUMsSUFBSSx1RkFBd0IsQ0FBQyxnREFBZ0QsQ0FBQyxFQUFFLEdBQUcsQ0FBQztRQUNyRixDQUFDLElBQUksdUZBQXdCLENBQUMsZ0RBQWdELENBQUMsRUFBRSxHQUFHLENBQUM7UUFDckYsQ0FBQyxJQUFJLHVGQUF3QixDQUFDLGdEQUFnRCxDQUFDLEVBQUUsR0FBRyxDQUFDO1FBQ3JGLENBQUMsSUFBSSx1RkFBd0IsQ0FBQyxnREFBZ0QsQ0FBQyxFQUFFLEdBQUcsQ0FBQztLQUNyRjtJQUNELElBQUksRUFBRTtRQUNMLENBQUMsSUFBSSx1RkFBd0IsQ0FBQywwQ0FBMEMsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUM5RSxDQUFDLElBQUksdUZBQXdCLENBQUMsMENBQTBDLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDOUUsQ0FBQyxJQUFJLHVGQUF3QixDQUFDLDBDQUEwQyxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBQzlFLENBQUMsSUFBSSx1RkFBd0IsQ0FBQywwQ0FBMEMsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUM5RSxDQUFDLElBQUksdUZBQXdCLENBQUMsMENBQTBDLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDOUUsQ0FBQyxJQUFJLHVGQUF3QixDQUFDLDBDQUEwQyxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBQzlFLENBQUMsSUFBSSx1RkFBd0IsQ0FBQywwQ0FBMEMsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUM5RSxDQUFDLElBQUksdUZBQXdCLENBQUMsMENBQTBDLENBQUMsRUFBRSxFQUFFLENBQUM7S0FDOUU7SUFDRCxRQUFRLEVBQUU7UUFDVCxDQUFDLElBQUksdUZBQXdCLENBQUMsOENBQThDLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDbEYsQ0FBQyxJQUFJLHVGQUF3QixDQUFDLDhDQUE4QyxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBQ2xGLENBQUMsSUFBSSx1RkFBd0IsQ0FBQyw4Q0FBOEMsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUNsRixDQUFDLElBQUksdUZBQXdCLENBQUMsOENBQThDLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDbEYsQ0FBQyxJQUFJLHVGQUF3QixDQUFDLDhDQUE4QyxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBQ2xGLENBQUMsSUFBSSx1RkFBd0IsQ0FBQyw4Q0FBOEMsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUNsRixDQUFDLElBQUksdUZBQXdCLENBQUMsOENBQThDLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDbEYsQ0FBQyxJQUFJLHVGQUF3QixDQUFDLDhDQUE4QyxDQUFDLEVBQUUsRUFBRSxDQUFDO0tBQ2xGO0NBQ0QsQ0FBQyxDQUFDO0FBRUgsc0JBQXNCO0FBQ2YsTUFBTSxVQUFVLEdBQW9DO0lBQzFELENBQUMsaUVBQWtCLENBQUMsRUFBRSxJQUFJLG1FQUFhLENBQ3RDLHNDQUFzQyxDQUN0QztJQUNELENBQUMsZ0VBQWlCLENBQUMsRUFBRSxJQUFJLG1FQUFhLENBQ3JDLHFDQUFxQyxDQUNyQztJQUNELENBQUMsaUVBQWtCLENBQUMsRUFBRSxJQUFJLG1FQUFhLENBQ3RDLHNDQUFzQyxDQUN0QztJQUNELENBQUMsbUVBQW9CLENBQUMsRUFBRSxJQUFJLG1FQUFhLENBQ3hDLHdDQUF3QyxDQUN4QztJQUNELENBQUMsbUVBQW9CLENBQUMsRUFBRSxJQUFJLG1FQUFhLENBQ3hDLHdDQUF3QyxDQUN4QztJQUNELENBQUMsbUVBQW9CLENBQUMsRUFBRSxJQUFJLG1FQUFhLENBQ3hDLHdDQUF3QyxDQUN4QztJQUNELENBQUMsbUVBQW9CLENBQUMsRUFBRSxJQUFJLG1FQUFhLENBQ3hDLHdDQUF3QyxDQUN4QztJQUNELENBQUMsbUVBQW9CLENBQUMsRUFBRSxJQUFJLG1FQUFhLENBQ3hDLHdDQUF3QyxDQUN4QztJQUNELENBQUMsbUVBQW9CLENBQUMsRUFBRSxJQUFJLG1FQUFhLENBQ3hDLHdDQUF3QyxDQUN4QztJQUNELENBQUMsbUVBQW9CLENBQUMsRUFBRSxJQUFJLG1FQUFhLENBQ3hDLHdDQUF3QyxDQUN4QztJQUNELENBQUMsbUVBQW9CLENBQUMsRUFBRSxJQUFJLG1FQUFhLENBQ3hDLHdDQUF3QyxDQUN4QztJQUNELENBQUMsbUVBQW9CLENBQUMsRUFBRSxJQUFJLG1FQUFhLENBQ3hDLHdDQUF3QyxDQUN4QztJQUNELENBQUMsbUVBQW9CLENBQUMsRUFBRSxJQUFJLG1FQUFhLENBQ3hDLHdDQUF3QyxDQUN4QztJQUNELENBQUMsZ0VBQWlCLENBQUMsRUFBRSxJQUFJLG1FQUFhLENBQ3JDLHFDQUFxQyxDQUNyQztJQUNELENBQUMscUVBQXNCLENBQUMsRUFBRSxJQUFJLG1FQUFhLENBQzFDLDBDQUEwQyxDQUMxQztJQUNELENBQUMsaUVBQWtCLENBQUMsRUFBRSxJQUFJLG1FQUFhLENBQ3RDLHNDQUFzQyxDQUN0QztJQUNELENBQUMscUVBQXNCLENBQUMsRUFBRSxJQUFJLG1FQUFhLENBQzFDLDBDQUEwQyxDQUMxQztJQUNELENBQUMsa0VBQW1CLENBQUMsRUFBRSxJQUFJLG1FQUFhLENBQ3ZDLHVDQUF1QyxDQUN2QztJQUNELENBQUMsa0VBQW1CLENBQUMsRUFBRSxJQUFJLG1FQUFhLENBQ3ZDLHVDQUF1QyxDQUN2QztJQUNELENBQUMsa0VBQW1CLENBQUMsRUFBRSxJQUFJLG1FQUFhLENBQ3ZDLHVDQUF1QyxDQUN2QztJQUNELENBQUMsa0VBQW1CLENBQUMsRUFBRSxJQUFJLG1FQUFhLENBQ3ZDLHVDQUF1QyxDQUN2QztJQUNELENBQUMsa0VBQW1CLENBQUMsRUFBRSxJQUFJLG1FQUFhLENBQ3ZDLHVDQUF1QyxDQUN2QztJQUNELENBQUMsa0VBQW1CLENBQUMsRUFBRSxJQUFJLG1FQUFhLENBQ3ZDLHVDQUF1QyxDQUN2QztJQUNELENBQUMsa0VBQW1CLENBQUMsRUFBRSxJQUFJLG1FQUFhLENBQ3ZDLHVDQUF1QyxDQUN2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QUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO0tBQ04sRUFDRCwwRUFBMEUsRUFDMUUsRUFBRSxDQUNGO0lBRUQsR0FBRyxFQUFFLElBQUksaUVBQVksQ0FDcEIsZ0NBQWdDLEVBQ2hDO1FBQ0MsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7S0FDTixFQUNELHdFQUF3RSxFQUN4RSxFQUFFLENBQ0Y7SUFDRCxTQUFTLEVBQUUsSUFBSSxpRUFBWSxDQUMxQixrQ0FBa0MsRUFDbEM7UUFDQyxHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sSUFBSSxFQUFFLENBQUM7UUFDUCxHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO0tBQ04sRUFDRCw0RkFBNEYsRUFDNUYsQ0FBQyxDQUNEO0NBQ0QsQ0FBQztBQUVLLE1BQU0sSUFBSSxHQUFHO0lBQ25CLFdBQVcsRUFBRTtRQUNaLEVBQUU7UUFDRixFQUFFO1FBQ0YsRUFBRTtRQUNGLFFBQVE7UUFDUixFQUFFO1FBQ0YsRUFBRTtRQUNGLE1BQU07UUFDTixFQUFFO1FBQ0YsV0FBVztRQUNYLEtBQUs7UUFDTCxFQUFFO1FBQ0YsRUFBRTtRQUNGLE9BQU87UUFDUCxPQUFPO1FBQ1AsZUFBZTtRQUNmLEVBQUU7UUFDRixPQUFPO1FBQ1AsU0FBUztRQUNULEtBQUs7UUFDTCxPQUFPO1FBQ1AsV0FBVztRQUNYLE1BQU07UUFDTixNQUFNO1FBQ04sT0FBTztRQUNQLE9BQU87UUFDUCxPQUFPO1FBQ1AsRUFBRTtRQUNGLFFBQVE7UUFDUixTQUFTO1FBQ1QsWUFBWTtRQUNaLFFBQVE7UUFDUixZQUFZO1FBQ1osT0FBTztRQUNQLFNBQVM7UUFDVCxXQUFXO1FBQ1gsS0FBSztRQUNMLE1BQU07UUFDTixNQUFNO1FBQ04sSUFBSTtRQUNKLE9BQU87UUFDUCxNQUFNO1FBQ04sUUFBUTtRQUNSLE9BQU87UUFDUCxTQUFTO1FBQ1QsY0FBYztRQUNkLFFBQVE7UUFDUixRQUFRO1FBQ1IsRUFBRTtRQUNGLEdBQUc7UUFDSCxHQUFHO1FBQ0gsR0FBRztRQUNILEdBQUc7UUFDSCxHQUFHO1FBQ0gsR0FBRztRQUNILEdBQUc7UUFDSCxHQUFHO1FBQ0gsR0FBRztRQUNILEdBQUc7UUFDSCxPQUFPO1FBQ1AsV0FBVztRQUNYLFdBQVc7UUFDWCxRQUFRO1FBQ1IsY0FBYztRQUNkLGVBQWU7UUFDZixJQUFJO1FBQ0osR0FBRztRQUNILEdBQUc7UUFDSCxHQUFHO1FBQ0gsR0FBRztRQUNILEdBQUc7UUFDSCxHQUFHO1FBQ0gsR0FBRztRQUNILEdBQUc7UUFDSCxHQUFHO1FBQ0gsR0FBRztRQUNILEdBQUc7UUFDSCxHQUFHO1FBQ0gsR0FBRztRQUNILEdBQUc7UUFDSCxHQUFHO1FBQ0gsR0FBRztRQUNILEdBQUc7UUFDSCxHQUFHO1FBQ0gsR0FBRztRQUNILEdBQUc7UUFDSCxHQUFHO1FBQ0gsR0FBRztRQUNILEdBQUc7UUFDSCxHQUFHO1FBQ0gsR0FBRztRQUNILEdBQUc7UUFDSCxRQUFRO1FBQ1IsRUFBRTtRQUNGLGNBQWM7UUFDZCxFQUFFO1FBQ0YsT0FBTztRQUNQLFNBQVM7UUFDVCxTQUFTO1FBQ1QsU0FBUztRQUNULFNBQVM7UUFDVCxTQUFTO1FBQ1QsU0FBUztRQUNULFNBQVM7UUFDVCxTQUFTO1FBQ1QsU0FBUztRQUNULFNBQVM7UUFDVCxVQUFVO1FBQ1YsS0FBSztRQUNMLFdBQVc7UUFDWCxVQUFVO1FBQ1YsU0FBUztRQUNULFFBQVE7UUFDUixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxFQUFFO1FBQ0YsRUFBRTtRQUNGLEVBQUU7UUFDRixFQUFFO1FBQ0YsRUFBRTtRQUNGLEVBQUU7UUFDRixFQUFFO1FBQ0YsRUFBRTtRQUNGLFVBQVU7UUFDVixhQUFhO1FBQ2Isa0JBQWtCO1FBQ2xCLG9CQUFvQjtRQUNwQixvQkFBb0I7UUFDcEIsaUJBQWlCO1FBQ2pCLGlCQUFpQjtRQUNqQixFQUFFO1FBQ0YsRUFBRTtRQUNGLEVBQUU7UUFDRixFQUFFO1FBQ0YsRUFBRTtRQUNGLEVBQUU7UUFDRixFQUFFO1FBQ0YsRUFBRTtRQUNGLEVBQUU7UUFDRixZQUFZO1FBQ1osYUFBYTtRQUNiLGNBQWM7UUFDZCxNQUFNO1FBQ04sUUFBUTtRQUNSLFNBQVM7UUFDVCxXQUFXO1FBQ1gsWUFBWTtRQUNaLGtCQUFrQjtRQUNsQixtQkFBbUI7UUFDbkIsVUFBVTtRQUNWLE1BQU07UUFDTixNQUFNO1FBQ04sUUFBUTtRQUNSLG9CQUFvQjtRQUNwQixxQkFBcUI7UUFDckIsT0FBTztRQUNQLEVBQUU7UUFDRixFQUFFO1FBQ0YsRUFBRTtRQUNGLEVBQUU7UUFDRixhQUFhO1FBQ2IsYUFBYTtRQUNiLFdBQVc7UUFDWCxFQUFFO1FBQ0YsRUFBRTtRQUNGLFdBQVc7UUFDWCxRQUFRO1FBQ1IsT0FBTztRQUNQLE9BQU87UUFDUCxRQUFRO1FBQ1IsT0FBTztRQUNQLFlBQVk7UUFDWixFQUFFO1FBQ0YsRUFBRTtRQUNGLEVBQUU7UUFDRixFQUFFO1FBQ0YsRUFBRTtRQUNGLEVBQUU7UUFDRixFQUFFO1FBQ0YsRUFBRTtRQUNGLEVBQUU7UUFDRixFQUFFO1FBQ0YsRUFBRTtRQUNGLEVBQUU7UUFDRixFQUFFO1FBQ0YsRUFBRTtRQUNGLEVBQUU7UUFDRixFQUFFO1FBQ0YsRUFBRTtRQUNGLEVBQUU7UUFDRixFQUFFO1FBQ0YsRUFBRTtRQUNGLEVBQUU7UUFDRixFQUFFO1FBQ0YsRUFBRTtRQUNGLEVBQUU7UUFDRixFQUFFO1FBQ0YsRUFBRTtRQUNGLGNBQWM7UUFDZCxZQUFZO1FBQ1osZUFBZTtRQUNmLE9BQU87UUFDUCxFQUFFO1FBQ0YsTUFBTTtRQUNOLFdBQVc7UUFDWCxFQUFFO1FBQ0YsY0FBYztRQUNkLFlBQVk7UUFDWixFQUFFO1FBQ0YsZUFBZTtRQUNmLEVBQUU7UUFDRixFQUFFO1FBQ0YsZUFBZTtRQUNmLGNBQWM7UUFDZCxhQUFhO1FBQ2IsYUFBYTtRQUNiLGFBQWE7UUFDYixnQkFBZ0I7UUFDaEIsZUFBZTtRQUNmLGNBQWM7UUFDZCxnQkFBZ0I7UUFDaEIsY0FBYztRQUNkLGNBQWM7UUFDZCxjQUFjO1FBQ2QsaUJBQWlCO1FBQ2pCLE1BQU07UUFDTixPQUFPO1FBQ1AsT0FBTztRQUNQLE9BQU87UUFDUCxNQUFNO1FBQ04sTUFBTTtRQUNOLEVBQUU7UUFDRixLQUFLO1FBQ0wsZUFBZTtRQUNmLGlCQUFpQixFQUFFLFFBQVE7S0FDM0IsRUFBRSx1R0FBdUc7Q0FDMUcsQ0FBQztBQUVLLE1BQU0sV0FBVyxHQUFHO0lBQzFCLEVBQUUsRUFBRTtRQUNILGNBQWMsRUFBRSxJQUFJLDZFQUFrQixDQUFDO1lBQ3RDLElBQUksbUVBQWEsQ0FBQyxpQ0FBaUMsQ0FBQztZQUNwRCxJQUFJLG1FQUFhLENBQUMsaUNBQWlDLENBQUM7WUFDcEQsSUFBSSxtRUFBYSxDQUFDLGlDQUFpQyxDQUFDO1NBQ3BELENBQUM7S0FDRjtJQUNELEtBQUssRUFBRTtRQUNOLFdBQVcsRUFBRSxJQUFJLG1FQUFhLENBQUMscUNBQXFDLENBQUM7S0FDckU7SUFDRCxPQUFPLEVBQUU7UUFDUixPQUFPLEVBQUUsSUFBSSxtRUFBYSxDQUN6Qiw2RUFBNkUsQ0FDN0U7S0FDRDtDQUNELENBQUM7QUFJRixxRkFBcUY7QUFFOUUsTUFBTSxVQUFVLEdBQUcsQ0FBQyxNQUFVLEVBQUUsR0FBRyxNQUFvQixFQUFFLEVBQUU7SUFDakUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRTtRQUMzQixXQUFXLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ2pDLENBQUMsQ0FBQyxDQUFDO0FBQ0osQ0FBQyxDQUFDO0FBRUYsU0FBUyxXQUFXLENBQ25CLFVBSXFCLEVBQ3JCLE1BQVU7SUFFVixJQUFJLFVBQVUsWUFBWSx5REFBUSxFQUFFO1FBQ25DLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ2hELFVBQVUsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDaEMsT0FBTztLQUNQO0lBQ0QsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDMUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUMvQixDQUFDLENBQUMsQ0FBQztBQUNKLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7QUNubkNxQztBQUUvQixNQUFNLGFBQWMsU0FBUSwrQ0FBUTtJQUN2QyxtQkFBbUI7SUFFbkIsWUFBWSxJQUFZO1FBQ3BCLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNoQixDQUFDO0lBRUQsWUFBWSxDQUFDLElBQVE7UUFDakIsdUJBQXVCO1FBQ3ZCLHVCQUF1QjtRQUN2QixtQkFBbUI7UUFDbkIsbUJBQW1CO1FBQ25CLE1BQU07SUFDVixDQUFDO0lBRUQsaUJBQWlCO0lBQ2pCLCtDQUErQztJQUMvQyxvQ0FBb0M7SUFDcEMsMkJBQTJCO0lBQzNCLG9FQUFvRTtJQUNwRSxhQUFhO0lBRWIseUJBQXlCO0lBQ3pCLElBQUk7SUFFSixTQUFTO1FBQ0wsdUNBQXVDO1FBQ3ZDLGdDQUFnQztRQUNoQyx1QkFBdUI7UUFDdkIsZ0VBQWdFO1FBQ2hFLFNBQVM7UUFDVCxzQkFBc0I7UUFDdEIscUJBQXFCO0lBQ3pCLENBQUM7Q0FFSjs7Ozs7Ozs7Ozs7Ozs7O0FDbkNNLE1BQU0sa0JBQWtCO0lBSTNCLFlBQVksTUFBdUI7UUFDL0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDekIsQ0FBQztJQUVELFVBQVU7UUFDTixJQUFHLElBQUksQ0FBQyxNQUFNLEtBQUssU0FBUyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxLQUFLLENBQUM7WUFDcEQsTUFBTSxJQUFJLEtBQUssQ0FDWCx3QkFBd0IsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUN4QyxDQUFDO1FBQ04sTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN6RCxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLHdKQUF1SjtJQUV0TCxDQUFDO0NBRUo7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDckIrQztBQUVkO0FBRTNCLE1BQU0sWUFBYSxTQUFRLHlEQUFhO0lBSTNDLFlBQVksSUFBWSxFQUFFLGFBQXlDLEVBQUUsY0FBc0IsRUFBRSxVQUFrQjtRQUMzRyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFIaEIsa0JBQWEsR0FBcUUsRUFBRTtRQUloRixJQUFJLFlBQVksR0FBRyxDQUFDO1FBQ3BCLEtBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3pDLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLEVBQUUsWUFBWSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsVUFBVSxFQUFDO1lBQ25ILFlBQVksSUFBSSxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztZQUNwRCx3RUFBd0U7U0FDM0U7SUFDTCxDQUFDO0lBRUQsUUFBUSxDQUFDLE1BQVUsRUFBRSxHQUFXLEVBQUUsQ0FBUyxFQUFFLENBQVM7UUFDbEQsa0NBQWtDO1FBQ2xDLElBQUksT0FBTyxHQUFXLENBQUMsQ0FBQztRQUN4QixLQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUM5QixJQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUUsU0FBUyxFQUFDO2dCQUN6QyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUMsT0FBTyxHQUFDLG1EQUFnQixFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBQyxtREFBZ0IsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBQyxtREFBZ0IsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNoUixPQUFPLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDO2FBQ3pDO2lCQUNJO2dCQUNELE9BQU8sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEdBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ2hEO1NBQ0o7SUFDTCxDQUFDO0NBQ0o7Ozs7Ozs7Ozs7Ozs7Ozs7QUM5QnFDO0FBRS9CLE1BQU0sYUFBYyxTQUFRLCtDQUFRO0lBR3ZDLFlBQVksSUFBWTtRQUNwQixLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDaEIsQ0FBQztJQUVELFlBQVksQ0FBQyxJQUFRO1FBQ2pCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUVELE1BQU0sQ0FBQyxNQUFXLEVBQUUsQ0FBUyxFQUFFLENBQVMsRUFBRSxLQUFhLEVBQUUsTUFBYztRQUNuRSx3Q0FBd0M7UUFDeEMsSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLFNBQVM7WUFDeEIsTUFBTSxJQUFJLEtBQUssQ0FDWCw0Q0FBNEMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUMxRCxDQUFDO1FBRU4sdUJBQXVCO1FBQ3ZCLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRUQsYUFBYSxDQUFDLE1BQVcsRUFBRSxDQUFTLEVBQUUsQ0FBUyxFQUFFLEtBQWEsRUFBRSxNQUFjLEVBQUUsUUFBZ0I7UUFDNUYsd0NBQXdDO1FBQ3hDLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxTQUFTO1lBQ3hCLE1BQU0sSUFBSSxLQUFLLENBQ1gsNENBQTRDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FDMUQsQ0FBQztRQUVOLHVCQUF1QjtRQUN2QixNQUFNLENBQUMsSUFBSSxFQUFFO1FBQ2IsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUMsS0FBSyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsTUFBTSxHQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hDLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDeEIsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEtBQUssR0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLEdBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzlDLE1BQU0sQ0FBQyxHQUFHLEVBQUU7SUFDaEIsQ0FBQztJQUdELGFBQWEsQ0FDVCxNQUFXLEVBQ1gsQ0FBUyxFQUNULENBQVMsRUFDVCxLQUFhLEVBQ2IsTUFBYyxFQUNkLE9BQWdCLEVBQ2hCLE9BQWdCLEVBQ2hCLFdBQW9CLEVBQ3BCLFlBQXFCO1FBRXJCLHdDQUF3QztRQUN4QyxJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssU0FBUztZQUN4QixNQUFNLElBQUksS0FBSyxDQUNYLDRDQUE0QyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQzFELENBQUM7UUFFTixtQ0FBbUM7UUFDbkMsTUFBTSxDQUFDLEtBQUssQ0FDUixJQUFJLENBQUMsS0FBSyxFQUNWLENBQUMsRUFDRCxDQUFDLEVBQ0QsS0FBSyxFQUNMLE1BQU0sRUFDTixPQUFPLEVBQ1AsT0FBTyxFQUNQLFdBQVcsRUFDWCxZQUFZLENBQ2YsQ0FBQztJQUNOLENBQUM7Q0FDSjs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDeEVxQztBQUVFO0FBQ087QUFJeEMsTUFBTSx3QkFBeUIsU0FBUSwrQ0FBUTtJQVNsRCxZQUFZLElBQVksRUFBRSxXQUE4QyxFQUFFLFdBQThDO1FBQ3BILEtBQUssQ0FBQyxJQUFJLENBQUM7UUFQZixrQkFBYSxHQUFZLEtBQUssQ0FBQztRQUUvQixzQkFBaUIsR0FBYSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQU1wSSxJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztRQUMvQixJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztJQUNuQyxDQUFDO0lBRUQsWUFBWSxDQUFDLElBQVE7UUFDakIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRSxFQUFFO1lBQ3ZDLElBQUcsSUFBSSxDQUFDLFdBQVcsSUFBRSxTQUFTLElBQUksSUFBSSxDQUFDLFdBQVcsSUFBRSxTQUFTLEVBQUU7Z0JBQzNELElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUM7Z0JBQ3hCLEtBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDcEMsS0FBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO3dCQUNyQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQzdCLElBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsRUFBRTs0QkFDYix1QkFBdUI7NEJBQ3ZCLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO3lCQUMxQzs2QkFDSSxJQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUU7NEJBQ2xCLHVCQUF1Qjs0QkFDdkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7eUJBQzFDOzs0QkFDRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7cUJBRWhDO2lCQUNKO2dCQUNELHNEQUFzRDtnQkFDdEQsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUUsQ0FBQzthQUM3QjtZQUNELElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDOUIsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsa0JBQWtCLENBQUMsV0FBNkMsRUFBRSxXQUE2QztRQUMzRyxJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztRQUMvQixJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztRQUMvQixJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ3hCLEtBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNwQyxLQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3JDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDN0IsSUFBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFO29CQUNiLHVCQUF1QjtvQkFDdkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7aUJBQzFDO3FCQUNJLElBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsRUFBRTtvQkFDbEIsdUJBQXVCO29CQUN2QixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztpQkFDMUM7O29CQUNHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzthQUVoQztTQUNKO1FBQ0Qsc0RBQXNEO1FBQ3RELElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDMUIsSUFBSSxDQUFDLGNBQWMsQ0FBQyx1Q0FBSSxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVELGNBQWMsQ0FBQyxJQUFRO1FBQ25CLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO1FBQzFCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3hFLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDeEIsZ0NBQWdDO1FBQ2hDLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDN0IsS0FBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUMsK0RBQStEO1lBQ3pHLEtBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDMUMsS0FBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDckIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxHQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxHQUFDLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxHQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFDLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNqSTtnQkFDRCxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLEdBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEdBQUMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDO29CQUN2RCxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsR0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBQyxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUM7d0JBQ25FLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBQyxDQUFDLENBQUMsR0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQzt3QkFDbkQsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssR0FBQyxDQUFDLEdBQUMsR0FBRyxHQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxHQUFDLENBQUMsR0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEdBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFDLEVBQUUsR0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQ3RLO1NBQ0o7UUFDRCxJQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ25DLENBQUM7SUFFRCxNQUFNLENBQUMsTUFBVyxFQUFFLENBQVMsRUFBRSxDQUFTLEVBQUUsS0FBYSxFQUFFLE1BQWM7UUFDbkUsMEJBQTBCO1FBQzFCLHdDQUF3QztRQUN4QyxJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssU0FBUztZQUN4QixNQUFNLElBQUksS0FBSyxDQUNYLDRDQUE0QyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQzFELENBQUM7UUFFTix1QkFBdUI7UUFDdkIsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFFRCxhQUFhLENBQUMsTUFBVyxFQUFFLENBQVMsRUFBRSxDQUFTLEVBQUUsS0FBYSxFQUFFLE1BQWMsRUFBRSxRQUFnQjtRQUM1Rix3Q0FBd0M7UUFDeEMsSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLFNBQVM7WUFDeEIsTUFBTSxJQUFJLEtBQUssQ0FDWCw0Q0FBNEMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUMxRCxDQUFDO1FBRU4sdUJBQXVCO1FBQ3ZCLE1BQU0sQ0FBQyxJQUFJLEVBQUU7UUFDYixNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsS0FBSyxHQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sR0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QyxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3hCLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztRQUM5QyxNQUFNLENBQUMsR0FBRyxFQUFFO0lBQ2hCLENBQUM7SUFFRCwwQkFBMEIsQ0FBQyxNQUFVLEVBQUUsQ0FBUyxFQUFFLENBQVMsRUFBRSxLQUFhLEVBQUUsTUFBYztRQUV0RixJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWE7WUFDbkIsT0FBTztRQUVYLElBQUksSUFBSSxDQUFDLFVBQVUsS0FBSyxTQUFTO1lBQzdCLE1BQU0sSUFBSSxLQUFLLENBQ1gsMERBQTBELElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FDeEUsQ0FBQztRQUVOLDJDQUEyQztRQUMzQyxLQUFJLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLENBQUMsR0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDdkMsS0FBSSxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxDQUFDLEdBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUN4Qyx3Q0FBd0M7Z0JBQ3hDLElBQUksWUFBK0IsQ0FBQztnQkFDcEMsWUFBWSxHQUFHLHdEQUFxQixDQUFDLENBQUMsR0FBRyxrREFBZSxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUM5RCxJQUFHLFlBQVksS0FBSyxTQUFTLElBQUksT0FBTyxZQUFZLEtBQUssUUFBUSxJQUFJLFlBQVksSUFBSSxzREFBWSxFQUFFLEVBQUMscUZBQXFGO29CQUNyTCxTQUFTO2lCQUNaO2dCQUNELE1BQU0sQ0FBQyxjQUFjLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLENBQUMsR0FBQyxHQUFHLENBQUMsZ0RBQStDO2dCQUM1SCxNQUFNLENBQUMsS0FBSyxDQUNSLElBQUksQ0FBQyxVQUFVLEVBQ2YsQ0FBQyxDQUFDLEdBQUcsa0RBQWU7b0JBQ2hCLHdEQUFxQixHQUFHLGtEQUFlLENBQUM7b0JBQzVDLG1EQUFnQixFQUNaLENBQUMsQ0FBQyxHQUFHLG1EQUFnQjtvQkFDakIsd0RBQXFCLEdBQUcsbURBQWdCLENBQUM7b0JBQ2pELG1EQUFnQixFQUNoQixrREFBZSxHQUFDLG1EQUFnQixFQUNoQyxtREFBZ0IsR0FBQyxtREFBZ0IsRUFDakMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLEdBQUMsa0RBQWUsRUFDckIsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLEdBQUMsbURBQWdCLEVBQ3RCLGtEQUFlLEVBQ2YsbURBQWdCLENBQ25CLENBQUM7Z0JBQ0YsTUFBTSxDQUFDLGNBQWMsQ0FBQyxXQUFXLEdBQUcsR0FBRyxDQUFDO2FBQzNDO1NBQ0o7SUFDTCxDQUFDO0lBRUQsZ0JBQWdCLENBQUMsTUFBVSxFQUFFLENBQVMsRUFBRSxDQUFTLEVBQUUsS0FBYSxFQUFFLE1BQWMsRUFBRSxVQUFpQztRQUUvRyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWE7WUFDbkIsT0FBTztRQUVYLElBQUksSUFBSSxDQUFDLFVBQVUsS0FBSyxTQUFTO1lBQzdCLE1BQU0sSUFBSSxLQUFLLENBQ1gsMERBQTBELElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FDeEUsQ0FBQztRQUVOLDJDQUEyQztRQUMzQyxLQUFJLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLENBQUMsR0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDdkMsS0FBSSxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxDQUFDLEdBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUN4Qyx3Q0FBd0M7Z0JBQ3hDLElBQUksWUFBK0IsQ0FBQztnQkFDcEMsWUFBWSxHQUFHLFVBQVUsQ0FBQyxDQUFDLEdBQUcsa0RBQWUsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDbkQsSUFBRyxZQUFZLEtBQUssU0FBUyxJQUFJLE9BQU8sWUFBWSxLQUFLLFFBQVEsSUFBSSxZQUFZLElBQUksc0RBQVksRUFBRSxFQUFDLHFGQUFxRjtvQkFDckwsU0FBUztpQkFDWjtnQkFDRCxNQUFNLENBQUMsY0FBYyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsWUFBWSxDQUFDLEdBQUMsR0FBRyxDQUFDLGdEQUErQztnQkFDNUgsTUFBTSxDQUFDLEtBQUssQ0FDUixJQUFJLENBQUMsVUFBVSxFQUNmLENBQUMsR0FBRyxrREFBZSxFQUNuQixDQUFDLEdBQUMsbURBQWdCLEVBQ2xCLGtEQUFlLEVBQ2YsbURBQWdCLEVBQ2hCLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxHQUFDLGtEQUFlLEVBQ3JCLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxHQUFDLG1EQUFnQixFQUN0QixrREFBZSxFQUNmLG1EQUFnQixDQUNuQixDQUFDO2dCQUNGLE1BQU0sQ0FBQyxjQUFjLENBQUMsV0FBVyxHQUFHLEdBQUcsQ0FBQzthQUMzQztTQUNKO0lBQ0wsQ0FBQztJQUVELGFBQWEsQ0FDVCxNQUFXLEVBQ1gsQ0FBUyxFQUNULENBQVMsRUFDVCxLQUFhLEVBQ2IsTUFBYyxFQUNkLE9BQWdCLEVBQ2hCLE9BQWdCLEVBQ2hCLFdBQW9CLEVBQ3BCLFlBQXFCO1FBRXJCLHdDQUF3QztRQUN4QyxJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssU0FBUztZQUN4QixNQUFNLElBQUksS0FBSyxDQUNYLDRDQUE0QyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQzFELENBQUM7UUFFTixtQ0FBbUM7UUFDbkMsTUFBTSxDQUFDLEtBQUssQ0FDUixJQUFJLENBQUMsS0FBSyxFQUNWLENBQUMsRUFDRCxDQUFDLEVBQ0QsS0FBSyxFQUNMLE1BQU0sRUFDTixPQUFPLEVBQ1AsT0FBTyxFQUNQLFdBQVcsRUFDWCxZQUFZLENBQ2YsQ0FBQztJQUNOLENBQUM7Q0FDSjs7Ozs7Ozs7Ozs7Ozs7O0FDL05NLE1BQWUsUUFBUTtJQUcxQixZQUFzQixJQUFZO1FBQzlCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ3JCLENBQUM7Q0FHSjs7Ozs7Ozs7Ozs7Ozs7OztBQ1YrQztBQUV6QyxNQUFNLFlBQWEsU0FBUSx5REFBYTtJQVMzQyxZQUNJLElBQVksRUFDWixLQUFhLEVBQ2IsTUFBYyxFQUNkLFNBQWlCLEVBQ2pCLFVBQWtCO1FBRWxCLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNaLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQzNCLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO0lBQ2pDLENBQUM7SUFFRCxVQUFVLENBQ04sQ0FBUyxFQUNULE1BQVcsRUFDWCxDQUFTLEVBQ1QsQ0FBUyxFQUNULEtBQWEsRUFDYixNQUFjO1FBRWQsTUFBTSxRQUFRLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDaEMsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRTVDLDBDQUEwQztRQUMxQyxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTTtZQUN0QixNQUFNLElBQUksS0FBSyxDQUNYLGtEQUFrRCxDQUFDLHNCQUMvQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxNQUN0QixRQUFRLENBQ1gsQ0FBQztRQUVOLEtBQUssQ0FBQyxhQUFhLENBQ2YsTUFBTSxFQUNOLENBQUMsRUFDRCxDQUFDLEVBQ0QsS0FBSyxFQUNMLE1BQU0sRUFDTixRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFDekIsUUFBUSxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQzFCLElBQUksQ0FBQyxTQUFTLEVBQ2QsSUFBSSxDQUFDLFVBQVUsQ0FDbEIsQ0FBQztJQUNOLENBQUM7SUFFRCxtQkFBbUIsQ0FDZixDQUFTLEVBQ1QsQ0FBUyxFQUNULE1BQVcsRUFDWCxJQUFZLEVBQ1osSUFBWSxFQUNaLEtBQWEsRUFDYixNQUFjO1FBRWQsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO1lBQ25ELE1BQU0sSUFBSSxLQUFLLENBQ1gsNkNBQTZDLENBQUMsS0FBSyxDQUFDLFNBQVMsSUFBSSxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsTUFBTSxPQUFPLENBQ2pHLENBQUM7UUFFTixLQUFLLENBQUMsYUFBYSxDQUNmLE1BQU0sRUFDTixJQUFJLEVBQ0osSUFBSSxFQUNKLEtBQUssRUFDTCxNQUFNLEVBQ04sQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQ2xCLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxFQUNuQixJQUFJLENBQUMsU0FBUyxFQUNkLElBQUksQ0FBQyxVQUFVLENBQ2xCLENBQUM7SUFDTixDQUFDO0NBQ0o7Ozs7Ozs7Ozs7Ozs7OztBQ25GTSxNQUFNLE9BQU87SUFPaEIsWUFBWSxXQUFtQixFQUFFLFFBQWlCLEVBQUUsT0FBZSxFQUFFLFNBQXFCLEVBQUUsVUFBdUI7UUFDL0csSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXO1FBQzlCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQzNCLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxJQUFJLGNBQVcsQ0FBQyxDQUFDLDZGQUE0RjtRQUN6SSx5Q0FBeUM7SUFDN0MsQ0FBQztDQUVKOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2hCMkY7QUFDL0M7QUFDZDtBQUNrQztBQUNoQjtBQUUxQyxNQUFNLFNBQVM7SUFVckIsWUFBWSxTQUEyQjtRQUh2QyxpQkFBWSxHQUFXLENBQUM7UUFDeEIsaUJBQVksR0FBdUIsU0FBUztRQUczQyxJQUFJLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQyxLQUFLO1FBQzVCLElBQUksQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDLEtBQUs7UUFDNUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUMsTUFBTTtJQUMvQixDQUFDO0lBRUQsVUFBVSxDQUFDLENBQVMsRUFBRSxDQUFTO1FBQzlCLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQztRQUNsRCxJQUFHLFlBQVksS0FBSyxTQUFTLElBQUksWUFBWSxLQUFLLElBQUksRUFBRTtZQUN2RCxnQ0FBZ0M7WUFDaEMsSUFBSSxlQUFlLEdBQUcsd0RBQXFCLENBQUMsbURBQWdCLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3RFLElBQUcsT0FBTyxlQUFlLEtBQUssUUFBUSxFQUFFO2dCQUN2QyxJQUFJLG9CQUFvQixHQUFHLHlEQUFVLENBQUMsZUFBZSxDQUFDO2dCQUN0RCxLQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUMsQ0FBQyxHQUFDLDBEQUF1QixFQUFFLENBQUMsRUFBRSxFQUFFO29CQUNoRCxJQUFJLG9CQUFvQixLQUFLLFNBQVM7d0JBQ3RDLHNEQUFtQixDQUFDLElBQUkseUVBQWEsQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFDLEdBQUcsR0FBQyxHQUFHLEVBQUUsRUFBRSxFQUFFLENBQUMsR0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxHQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxHQUFHLEdBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEdBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7aUJBQzdLO2FBQ0Q7WUFDRCx1REFBb0IsQ0FDbkIsaUJBQWlCLEVBQ2pCLG1EQUFnQixHQUFHLENBQUMsR0FBRyxDQUFDLENBQ3hCLENBQUM7WUFDRix1REFBb0IsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1lBQ3pDLE9BQU07U0FDTjtRQUVELE1BQU0sVUFBVSxHQUFHLFdBQVcsQ0FBQyxvREFBSyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVO1FBQ3hFLElBQUcsVUFBVSxLQUFLLFNBQVMsRUFBRTtZQUM1QixPQUFPLENBQUMsS0FBSyxDQUFDLDRCQUE0QixDQUFDO1lBQzNDLE9BQU07U0FDTjtRQUVELFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2pCLENBQUM7SUFDRCxlQUFlLENBQUMsQ0FBUyxFQUFFLENBQVM7UUFDbkMsSUFBSSxlQUFlLEdBQUcsd0RBQXFCLENBQUMsbURBQWdCLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3RFLElBQUcsT0FBTyxlQUFlLEtBQUssUUFBUSxFQUFFO1lBQ3ZDLElBQUksZUFBZSxLQUFLLHNEQUFZO2dCQUFFLGdEQUFhLEdBQUcsS0FBSyxDQUFDOztnQkFDdkQsZ0RBQWEsR0FBRyxJQUFJLENBQUM7U0FDMUI7SUFDRixDQUFDO0NBQ0Q7QUFNRCxNQUFNLFdBQVcsR0FBcUM7SUFDckQsQ0FBQyxrRUFBbUIsQ0FBQyxFQUFFO1FBQ3RCLFVBQVUsQ0FBQyxDQUFTLEVBQUUsQ0FBUztZQUM5Qix3QkFBd0I7WUFDeEIsSUFDQyx3REFBcUIsQ0FDckIsbURBQWdCLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FDdEIsS0FBSyxzREFBWSxFQUNsQjtnQkFFRCxJQUFJLGVBQWUsR0FBRyx3REFBcUIsQ0FBQyxtREFBZ0IsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RFLElBQUcsT0FBTyxlQUFlLEtBQUssUUFBUSxFQUFFLEVBQUMsY0FBYztvQkFDdEQsSUFBSSxDQUFDLGdEQUFhO3dCQUFFLE9BQU87b0JBQzNCLElBQUksb0JBQW9CLEdBQUcseURBQVUsQ0FBQyxlQUFlLENBQUM7b0JBQ3RELEtBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBQyxDQUFDLEdBQUMsMERBQXVCLEVBQUUsQ0FBQyxFQUFFLEVBQUU7d0JBQ2hELElBQUksb0JBQW9CLEtBQUssU0FBUzs0QkFDdEMsc0RBQW1CLENBQUMsSUFBSSx5RUFBYSxDQUFDLG9CQUFvQixDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUMsR0FBRyxHQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsQ0FBQyxHQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEdBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLEdBQUcsR0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksR0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztxQkFDN0s7b0JBQ0QsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztvQkFDekIsdURBQW9CLENBQ25CLGlCQUFpQixFQUNqQixtREFBZ0IsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUN4QixDQUFDO29CQUNGLHVEQUFvQixDQUNuQixrQkFBa0IsQ0FDbEIsQ0FBQztvQkFDRixPQUFPO2lCQUNQO3FCQUNJLEVBQUMscUJBQXFCO29CQUMxQixPQUFPLENBQUMsR0FBRyxDQUFDLHNCQUFzQixDQUFDO29CQUNuQyx1REFBb0IsQ0FDbkIsaUJBQWlCLEVBQ2pCLG1EQUFnQixHQUFHLENBQUMsR0FBRyxDQUFDLENBQ3hCLENBQUM7b0JBQ0YsdURBQW9CLENBQ25CLGtCQUFrQixDQUNsQixDQUFDO29CQUNGLE9BQU87aUJBQ1A7YUFDRDtZQUNELG9EQUFvRDtZQUNwRCxJQUFJLGdEQUFhO2dCQUFFLE9BQU87WUFDMUIsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUN4Qix1REFBb0IsQ0FDbkIsWUFBWSxFQUNaLG9FQUFpQyxFQUNqQyxDQUFDLEVBQ0QsQ0FBQyxDQUNELENBQUM7UUFDSCxDQUFDO0tBQ0Q7SUFDRCxDQUFDLHNFQUF1QixDQUFDLEVBQUUsRUFBRTtJQUM3QixDQUFDLGtFQUFtQixDQUFDLEVBQUUsRUFBRTtJQUN6QixDQUFDLHdFQUF5QixDQUFDLEVBQUU7UUFDNUIsVUFBVSxDQUFDLENBQVMsRUFBRSxDQUFTOztZQUM5QixJQUFJLE9BQU8sR0FBRyxvREFBSyxDQUFDLG9FQUEwQixDQUFDLG9FQUFpQyxDQUFDLDBDQUFFLElBQUksS0FBSSxDQUFDLENBQUMsQ0FBQztZQUM5RixJQUFJLE1BQU0sR0FBcUIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3JDLElBQUcsa0JBQWtCLElBQUksT0FBTyxFQUFFO2dCQUNqQyxNQUFNLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDO2FBQ2xDO1lBRUQsdURBQW9CLENBQ25CLFlBQVksRUFDWixvRUFBaUMsRUFDakMsQ0FBQyxFQUNELENBQUMsQ0FDRCxDQUFDO1FBQ0gsQ0FBQztLQUNEO0NBQ0Q7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNuSTZEO0FBQy9CO0FBQytCO0FBQzlELDZDQUE2QztBQUM4QjtBQUM5QjtBQUNJO0FBQ2dCO0FBRTFELE1BQU0sV0FBWSxTQUFRLHNFQUFZO0lBOEN6QyxZQUNJLElBQXlDO1FBRXpDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBaERsQixnQkFBZ0I7UUFDaEIsVUFBSyxHQUFXLEVBQUUsR0FBRyxrREFBZSxDQUFDO1FBQ3JDLFdBQU0sR0FBVyxFQUFFLEdBQUcsbURBQWdCLENBQUM7UUFLdkMsYUFBYTtRQUNiLFNBQUksR0FBVyxDQUFDLENBQUM7UUFDakIsU0FBSSxHQUFXLENBQUMsQ0FBQztRQVFqQixVQUFLLEdBQVcsQ0FBQyxDQUFDO1FBQ2xCLFVBQUssR0FBVyxDQUFDLENBQUM7UUFFbEIsYUFBUSxHQUFZLEtBQUssQ0FBQztRQUMxQixjQUFTLEdBQVksS0FBSyxDQUFDO1FBSzNCLFNBQUksR0FBVyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFReEMsV0FBTSxHQUFxQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQztRQUN6RCxXQUFNLEdBQXFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDO1FBRXpELHFCQUFnQixHQUE0QyxNQUFNLENBQUM7UUFDbkUsY0FBUyxHQUFXLENBQUMsQ0FBQztRQUN0Qiw2QkFBd0IsR0FBRyxDQUFDLENBQUM7UUFDN0IsZ0JBQVcsR0FBRyxJQUFJLENBQUM7UUFFbkIsaUJBQVksR0FBc0MseURBQVUsQ0FBQyxzREFBWSxDQUFDLENBQUMsUUFBTztRQUNsRixvQkFBZSxHQUFzQyx5REFBVSxDQUFDLHNEQUFZLENBQUMsQ0FBQztRQU8xRSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBRTNCLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDckIsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUVyQixJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDakIsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBRWpCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUM1QixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7UUFFNUIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUV6QyxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztRQUN4QixJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztRQUN6QixJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztJQUM1QixDQUFDO0lBRUQsTUFBTSxDQUFDLE1BQVUsRUFBRSxXQUFtQjtRQUVsQyxJQUFJLENBQUMsd0JBQXdCLElBQUksaURBQWMsQ0FBQztRQUNoRCxJQUFHLElBQUksQ0FBQyx3QkFBd0IsR0FBQyw0REFBZ0IsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDekYsSUFBSSxDQUFDLHdCQUF3QixHQUFHLENBQUMsQ0FBQyxpS0FBZ0s7WUFDbE0sSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ2pCLElBQUcsSUFBSSxDQUFDLFNBQVMsSUFBRSw0REFBZ0IsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxNQUFNLEVBQUU7Z0JBQy9ELElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsR0FBQyw0REFBZ0IsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxNQUFNLENBQUM7YUFDbEY7U0FDSjtRQUVELGVBQWU7UUFDZiw4Q0FBOEM7UUFDOUMscURBQXFEO1FBQ3JELHVCQUF1QjtRQUN2QiwrQ0FBK0M7UUFDL0Msc0RBQXNEO1FBQ3RELHVCQUF1QjtRQUN2QixrREFBa0Q7UUFDbEQsbURBQW1EO1FBQ25ELEtBQUs7UUFDTCw0REFBZ0IsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUV6RCxNQUFNLEVBQ04sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLEdBQUcsa0RBQWU7WUFDNUMsd0RBQXFCLEdBQUcsa0RBQWUsQ0FBQztZQUM1QyxXQUFXLENBQUMsRUFDWixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsR0FBRyxtREFBZ0I7WUFDN0Msd0RBQXFCLEdBQUcsbURBQWdCLENBQUM7WUFDN0MsV0FBVyxDQUFDLEVBQ1osSUFBSSxDQUFDLEtBQUssR0FBRyxXQUFXLEdBQUcsa0RBQWUsRUFDMUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxXQUFXLEdBQUcsbURBQWdCLENBQy9DLENBQUM7UUFDRiw0REFBZ0IsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsMEJBQTBCLENBRWpGLHVDQUFJLEVBQ0osSUFBSSxDQUFDLGFBQWEsRUFDbEIsSUFBSSxDQUFDLGFBQWEsR0FBQyxJQUFJLENBQUMsTUFBTSxFQUM5QixJQUFJLENBQUMsS0FBSyxFQUNWLElBQUksQ0FBQyxNQUFNLENBQ2QsQ0FBQztRQUVGLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzdCLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNsQixNQUFNLENBQUMsSUFBSSxDQUNQLENBQUMsSUFBSSxDQUFDLGFBQWEsR0FBRyxrREFBZTtZQUNqQyx3REFBcUIsR0FBRyxrREFBZTtZQUN2QyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsa0RBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNuQyxXQUFXLEdBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBQyxDQUFDLEdBQUMsbURBQWdCLENBQUMsRUFDakQsQ0FBQyxJQUFJLENBQUMsYUFBYSxHQUFHLG1EQUFnQjtZQUN0Qyx3REFBcUIsR0FBRyxtREFBZ0I7WUFDeEMsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLG1EQUFnQixDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQztZQUMzQyxXQUFXLEVBQ1gsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBQyxDQUFDLEdBQUMsbURBQWdCLENBQUMsRUFDckMsbURBQWdCLENBQUMsQ0FBQztRQUUxQixNQUFNLENBQUMsSUFBSSxDQUNDLENBQUMsSUFBSSxDQUFDLGFBQWEsR0FBRyxrREFBZTtZQUNqQyx3REFBcUIsR0FBRyxrREFBZTtZQUN2QyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsa0RBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNuQyxXQUFXLEdBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsR0FBQyxtREFBZ0IsQ0FBQyxFQUNyRCxDQUFDLElBQUksQ0FBQyxhQUFhLEdBQUcsbURBQWdCO1lBQ3RDLHdEQUFxQixHQUFHLG1EQUFnQjtZQUN4QyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsbURBQWdCLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1lBQzNDLFdBQVcsRUFDWCxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxHQUFDLG1EQUFnQixDQUFDLEVBQ3pDLG1EQUFnQixDQUFDLENBQUM7UUFFbEMsb0VBQXdCLENBQ3BCLHVDQUFJLEVBQ0osSUFBSSxDQUFDLElBQUksRUFDVCxDQUFDLElBQUksQ0FBQyxhQUFhLEdBQUcsa0RBQWU7WUFDakMsd0RBQXFCLEdBQUcsa0RBQWU7WUFDdkMsQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLGtEQUFlLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbkMsV0FBVyxHQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUMsQ0FBQyxHQUFDLG1EQUFnQixDQUFDLEVBQ3JELENBQUMsSUFBSSxDQUFDLGFBQWEsR0FBRyxtREFBZ0I7WUFDbEMsd0RBQXFCLEdBQUcsbURBQWdCO1lBQ3hDLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxtREFBZ0IsQ0FBQyxHQUFHLEdBQUcsR0FBQyxDQUFDLENBQUM7WUFDekMsV0FBVyxDQUNsQixDQUFDO0lBQ04sQ0FBQztJQUVELFVBQVUsQ0FBQyxJQUFtQjtRQUMxQixJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssMkRBQWU7WUFBRSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ2xFLENBQUM7SUFFRCxhQUFhO1FBRVQsSUFBSSxDQUFDLElBQUk7WUFDTCxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDbEQsSUFDSSxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQ2xDO1lBQ0UseURBQXNCLEdBQUcsR0FBRyxDQUFDO1lBQzdCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsMERBQXVCLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ25ELElBQUcsSUFBSSxDQUFDLGVBQWUsS0FBSyxTQUFTO29CQUNqQyxzREFBbUIsQ0FBQyxJQUFJLHlFQUFhLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQzthQUN2TjtZQUNELElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUM7U0FDcEI7SUFDTCxDQUFDO0lBRUQsbUJBQW1CO1FBQ2YsNkZBQTZGO1FBRTdGLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUN2QixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFFdkIsSUFBSSxJQUFJLENBQUMsZUFBZSxLQUFLLFNBQVMsRUFBRTtZQUNwQyxJQUFJLENBQUMsSUFBSTtnQkFDTCxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsd0RBQXFCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLHNCQUFzQjtvQkFDL0YsSUFBSSxDQUFDLElBQUksQ0FBQztTQUNqQjthQUFNO1lBQ0gsSUFBSSxDQUFDLElBQUk7Z0JBQ0wsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLHdEQUFxQixHQUFHLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsMENBQTBDO29CQUNySixJQUFJLENBQUMsSUFBSSxDQUFDO1NBQ2pCO1FBQ0QsSUFBSSxDQUFDLElBQUksSUFBSSxxREFBa0IsQ0FBQztRQUNoQyxJQUFJLENBQUMsSUFBSTtZQUNMLENBQUMsMkNBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyx3REFBcUIsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO2dCQUN2RSxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ2QsMENBQTBDO1FBQzFDLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNmLFdBQVc7WUFDWCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLDBEQUF1QixHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUN2RixzREFBbUIsQ0FBQyxJQUFJLHlFQUFhLENBQUMsV0FBVyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsMERBQXVCLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQzthQUVoTDtZQUNELE1BQU07WUFDTixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLDBEQUF1QixHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUN2RixJQUFHLElBQUksQ0FBQyxlQUFlLEtBQUssU0FBUztvQkFDckMsc0RBQW1CLENBQUMsSUFBSSx5RUFBYSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7YUFDaE87U0FDSjtRQUNELElBQUcsSUFBSSxDQUFDLGdCQUFnQixLQUFLLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBQyxJQUFJLEVBQUU7WUFDckQsSUFBSSxDQUFDLGdCQUFnQixHQUFHLE1BQU0sQ0FBQztZQUMvQixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLEdBQUcsNERBQWdCLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsTUFBTSxDQUFDO1lBQ2pGLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO1lBQ3hCLHVEQUFvQixDQUFDLGlCQUFpQixFQUFFLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDakY7UUFDRCxJQUFHLElBQUksQ0FBQyxnQkFBZ0IsS0FBSyxVQUFVLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUMsQ0FBQyxJQUFJLEVBQUU7WUFDMUQsSUFBSSxDQUFDLGdCQUFnQixHQUFHLFVBQVUsQ0FBQztZQUNuQyxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztZQUN6QixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLEdBQUcsNERBQWdCLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsTUFBTSxDQUFDO1lBQ2pGLHVEQUFvQixDQUFDLGlCQUFpQixFQUFFLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDakY7UUFDRCxJQUFHLElBQUksQ0FBQyxnQkFBZ0IsS0FBSyxNQUFNLElBQUksSUFBSSxDQUFDLElBQUksSUFBRSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFDLENBQUMsSUFBSSxDQUFDLG1EQUFnQixHQUFDLElBQUksQ0FBQyxhQUFhLEdBQUMsSUFBSSxDQUFDLEtBQUssR0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksS0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQzVJLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxNQUFNLENBQUM7WUFDL0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxHQUFHLDREQUFnQixDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLE1BQU0sQ0FBQztZQUNqRix1REFBb0IsQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ2pGO1FBQ0QsSUFBRyxJQUFJLENBQUMsZ0JBQWdCLEtBQUssVUFBVSxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFDLENBQUMsSUFBSSxDQUFDLG1EQUFnQixJQUFFLElBQUksQ0FBQyxhQUFhLEdBQUMsSUFBSSxDQUFDLEtBQUssR0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksS0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFDO1lBQ2pKLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxVQUFVLENBQUM7WUFDbkMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxHQUFHLDREQUFnQixDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLE1BQU0sQ0FBQztZQUNqRix1REFBb0IsQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ2pGO1FBQ0QsMEZBQTBGO0lBQzlGLENBQUM7SUFFRCwyQkFBMkI7UUFDdkIsaUlBQWlJO1FBQ2pJLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUU7WUFDaEIsSUFBSSxDQUFDLGFBQWEsR0FBRywyQ0FBUSxDQUN6QixJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsMkRBQXdCLEVBQy9DLElBQUksQ0FBQyxDQUFDLENBQ1QsQ0FBQztTQUNMO2FBQU07WUFDSCxJQUFJLENBQUMsYUFBYSxHQUFHLDJDQUFRLENBQ3pCLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRywyREFBd0IsRUFDL0MsSUFBSSxDQUFDLENBQUMsQ0FDVCxDQUFDO1NBQ0w7UUFDRCxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFO1lBQ2hCLElBQUksQ0FBQyxhQUFhLEdBQUcsMkNBQVEsQ0FDekIsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLDJEQUF3QixFQUMvQyxJQUFJLENBQUMsQ0FBQyxDQUNULENBQUM7U0FDTDthQUFNO1lBQ0gsSUFBSSxDQUFDLGFBQWEsR0FBRywyQ0FBUSxDQUN6QixJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsMkRBQXdCLEVBQy9DLElBQUksQ0FBQyxDQUFDLENBQ1QsQ0FBQztTQUNMO0lBQ0wsQ0FBQztJQUVELHVCQUF1QjtRQUNuQixJQUFJLENBQUMsWUFBWSxHQUFHLHlEQUFVLENBQUMsc0RBQVksQ0FBQyxDQUFDO1FBQzdDLElBQUksQ0FBQyxlQUFlLEdBQUcseURBQVUsQ0FBQyxzREFBWSxDQUFDLENBQUM7UUFDaEQsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2pCLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUVqQixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDL0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7UUFFdEI7Ozs7O1VBS0U7UUFFRixtQ0FBbUM7UUFFbkMsd0RBQXdEO1FBQ3hELElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFFekMsSUFBSSx1QkFBZ0MsQ0FBQztRQUVyQyxpRkFBaUY7UUFDakYsS0FDSSxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLDJDQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUN4RCxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQywyQ0FBUSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUNoRSxDQUFDLEVBQUUsRUFDTDtZQUNFLEtBQ0ksSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQywyQ0FBUSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsRUFDeEQsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsMkNBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsRUFDakUsQ0FBQyxFQUFFLEVBQ0w7Z0JBQ0Usc0ZBQXNGO2dCQUN0RixJQUFJLFlBQVksR0FBc0Isd0RBQXFCLENBQUMsQ0FBQyxHQUFHLGtEQUFlLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JGLElBQUksWUFBWSxLQUFLLHNEQUFZLElBQUksT0FBTyxZQUFZLEtBQUssUUFBUSxFQUFFO29CQUNuRSw4REFBOEQ7b0JBQzlELElBQUksQ0FBQyxhQUFhLEdBQUcsaURBQWMsQ0FDL0IsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQ2QsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQ2YsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQ2QsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQ2YsSUFBSSxDQUFDLENBQUMsRUFDTixJQUFJLENBQUMsQ0FBQyxFQUNOLElBQUksQ0FBQyxJQUFJLEVBQ1QsSUFBSSxDQUFDLElBQUksQ0FDWixDQUFDO29CQUNGLHVCQUF1QixHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNwRSxJQUNJLElBQUksQ0FBQyxhQUFhLEtBQUssS0FBSyxFQUFFLEVBQUMsc0JBQXNCO3dCQUNyRCxJQUNJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxFQUNsRDs0QkFDRSxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyx5RUFBd0U7NEJBQ25ILElBQUksSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRTtnQ0FFaEMsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFO29DQUNoQyxJQUFJLENBQUMsWUFBWSxHQUFHLHlEQUFVLENBQUMsWUFBWSxDQUFDLENBQUM7aUNBQ2hEO3FDQUNJO29DQUNELElBQUksQ0FBQyxlQUFlLEdBQUcseURBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQztpQ0FDbkQ7NkJBQ0o7eUJBQ0o7NkJBQU0sSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsSUFBSSx1QkFBdUIsS0FBSyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTs0QkFDM0gsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7NEJBQzNDLElBQUksSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRTtnQ0FFaEMsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFO29DQUNoQyxJQUFJLENBQUMsWUFBWSxHQUFHLHlEQUFVLENBQUMsWUFBWSxDQUFDLENBQUM7aUNBQ2hEO3FDQUNJO29DQUNELElBQUksQ0FBQyxlQUFlLEdBQUcseURBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQztpQ0FDbkQ7NkJBQ0o7eUJBQ0o7cUJBRUo7aUJBQ0o7YUFDSjtTQUNKO1FBRUQsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLEtBQUssUUFBUSxFQUFFO1lBQ3ZDLHdDQUF3QztZQUV4Qyw0SEFBNEg7WUFDNUgsSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMvQyxJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQy9DLHFEQUFxRDtZQUNyRCxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQ2hDLElBQUksSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO29CQUNqQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztvQkFDckIsd0ZBQXdGO29CQUN4RixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFDLHdHQUF3Rzt3QkFDMUgseURBQXNCLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDO3dCQUNwRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLDBEQUF1QixFQUFFLENBQUMsRUFBRSxFQUFFOzRCQUNsRCxJQUFHLElBQUksQ0FBQyxlQUFlLEtBQUssU0FBUztnQ0FDakMsc0RBQW1CLENBQUMsSUFBSSx5RUFBYSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7eUJBQ3ZOO3FCQUNKO2lCQUNKO3FCQUNJO29CQUNELHlEQUFzQixHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQztvQkFDcEQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRywwREFBdUIsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFDLDZCQUE2Qjt3QkFDaEYsSUFBRyxJQUFJLENBQUMsWUFBWSxLQUFLLFNBQVM7NEJBQzlCLHNEQUFtQixDQUFDLElBQUkseUVBQWEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztxQkFDdE07aUJBQ0o7Z0JBQ0QsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxzRkFBc0Y7Z0JBQ3JHLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLDhEQUE4RDtnQkFDeEgsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxxRUFBcUU7YUFDekY7aUJBQU07Z0JBQ0gsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyw4Q0FBOEM7Z0JBQzdELElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMscUVBQXFFO2dCQUN0RixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyw4REFBOEQ7YUFDM0g7WUFFRCxpS0FBaUs7WUFFakssd0dBQXdHO1lBRXhHLHdEQUF3RDtZQUN4RCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBRXpDLGlGQUFpRjtZQUNqRixLQUNJLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsMkNBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQzFELENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLDJDQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQ2xFLENBQUMsRUFBRSxFQUNMO2dCQUNFLEtBQ0ksSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQywyQ0FBUSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFDMUQsQ0FBQztvQkFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLDJDQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQy9ELENBQUMsRUFBRSxFQUNMO29CQUNFLElBQUksWUFBWSxHQUFzQix3REFBcUIsQ0FBQyxDQUFDLEdBQUcsa0RBQWUsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDckYsNEVBQTRFO29CQUM1RSxJQUFJLFlBQVksS0FBSyxzREFBWSxJQUFJLE9BQU8sWUFBWSxLQUFLLFFBQVEsRUFBRTt3QkFDbkUsOERBQThEO3dCQUM5RCxJQUFJLENBQUMsYUFBYSxHQUFHLGlEQUFjLENBQy9CLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxFQUNkLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUNmLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUNkLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUNmLElBQUksQ0FBQyxDQUFDLEVBQ04sSUFBSSxDQUFDLENBQUMsRUFDTixJQUFJLENBQUMsTUFBTSxFQUNYLElBQUksQ0FBQyxNQUFNLENBQ2QsQ0FBQzt3QkFDRixJQUNJLElBQUksQ0FBQyxhQUFhLEtBQUssS0FBSzs0QkFDNUIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLEVBQ2xEOzRCQUNFLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDOzRCQUMzQyxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0NBRWhDLElBQUksSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRTtvQ0FDaEMsSUFBSSxDQUFDLFlBQVksR0FBRyx5REFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDO2lDQUNoRDtxQ0FDSTtvQ0FDRCxJQUFJLENBQUMsZUFBZSxHQUFHLHlEQUFVLENBQUMsWUFBWSxDQUFDLENBQUM7aUNBQ25EOzZCQUNKO3lCQUNKO3FCQUNKO2lCQUNKO2FBQ0o7WUFFRCx3Q0FBd0M7WUFDeEMsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLEtBQUssUUFBUSxFQUFFO2dCQUN2QyxJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNqRCxJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUVqRCxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUU7b0JBQ2hDLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsc0ZBQXNGO29CQUNyRyxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTt3QkFDakMsd0ZBQXdGO3dCQUN4RixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztxQkFFeEI7aUJBQ0o7cUJBQU07b0JBQ0gsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyw4Q0FBOEM7aUJBQ2hFO2FBQ0o7aUJBQU07Z0JBQ0gsNENBQTRDO2dCQUM1QyxJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUM7Z0JBQ3RCLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQzthQUN6QjtTQUNKO2FBQU07WUFDSCw4QkFBOEI7WUFDOUIsSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ3BCLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQztTQUN2QjtRQUVELDRCQUE0QjtRQUU1QixJQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ1osSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDWCxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztTQUNqQjthQUFNLElBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLGtEQUFlLEVBQUU7WUFDOUMsSUFBSSxDQUFDLENBQUMsR0FBRyxrREFBZSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDdEMsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7U0FDakI7UUFFRCxJQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxtREFBZ0IsRUFBRTtZQUN6QyxJQUFJLENBQUMsQ0FBQyxHQUFHLG1EQUFnQixHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7WUFDeEMsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7WUFDZCxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztTQUN4QjtJQUNMLENBQUM7Q0FDSjtBQUdELFNBQVMsYUFBYSxDQUFDLENBQVM7SUFDNUIsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDbkMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUMxQjtJQUNELE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUIsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7OztBQ2pld0Q7QUFJbEQsTUFBTSxNQUFNO0lBYWYsWUFDSSxJQUFrQixFQUNsQixHQUFXLEVBQ1gsV0FBbUIsRUFDbkIsQ0FBUyxFQUNULENBQVMsRUFDVCxDQUFTLEVBQ1QsQ0FBUyxFQUNULGVBQXlCO1FBQ3pCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRztRQUNkLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVztRQUM5QixJQUFJLENBQUMsZUFBZSxHQUFHLGVBQWU7UUFDdEMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDO1FBQ1YsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDO1FBQ1YsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDO1FBQ1YsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDO1FBQ1YsSUFBSSxDQUFDLEtBQUssR0FBRyxzRUFBMEIsQ0FBQztRQUN4QyxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztJQUM3QixDQUFDO0lBRUQsTUFBTSxDQUFDLE1BQVUsRUFBRSxXQUFtQjtRQUNsQywwRUFBMEU7UUFDMUUsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxHQUFHLFdBQVcsQ0FBQztRQUN6RCxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFDLEdBQUcsV0FBVyxDQUFDO1FBQ3pELE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxXQUFXLENBQUMsR0FBRyxXQUFXLENBQUM7UUFDekQsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxHQUFHLFdBQVcsQ0FBQztRQUV6RCxVQUFVO1FBQ1YsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3JGLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUMzRyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDM0csSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRWpJLGlCQUFpQjtRQUNqQixJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDNUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRWxJLGlCQUFpQjtRQUNqQixJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDNUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRWxJLFNBQVM7UUFDVCxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFbkksSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLEVB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QUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzNHLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUMzRyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFakksaUJBQWlCO1FBQ2pCLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM1RyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFF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Q0FBQyxVQUFVLENBQUMsRUFBRTtRQUN0QixJQUFJLEVBQUUsY0FBYyxDQUFDLElBQUk7UUFDekIsVUFBVSxFQUFFLGlEQUFjO0tBQzFCO0lBQ0QsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLEVBQUU7UUFDdEIsSUFBSSxFQUFFLGNBQWMsQ0FBQyxJQUFJO1FBQ3pCLFVBQVUsRUFBRSxpREFBYztLQUMxQjtJQUNELENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1FBQ3RCLElBQUksRUFBRSxjQUFjLENBQUMsSUFBSTtRQUN6QixVQUFVLEVBQUUsaURBQWM7S0FDMUI7SUFDRCxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsRUFBRTtRQUN0QixJQUFJLEVBQUUsY0FBYyxDQUFDLElBQUk7UUFDekIsVUFBVSxFQUFFLGlEQUFjO0tBQzFCO0lBQ0QsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLEVBQUU7UUFDdEIsSUFBSSxFQUFFLGNBQWMsQ0FBQyxJQUFJO1FBQ3pCLFVBQVUsRUFBRSxpREFBYztLQUMxQjtJQUNELENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1FBQ3RCLElBQUksRUFBRSxjQUFjLENBQUMsSUFBSTtRQUN6QixVQUFVLEVBQUUsaURBQWM7S0FDMUI7SUFDRCxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsRUFBRTtRQUN0QixJQUFJLEVBQUUsY0FBYyxDQUFDLElBQUk7UUFDekIsVUFBVSxFQUFFLGlEQUFjO0tBQzFCO0lBQ0QsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLEVBQUU7UUFDdEIsSUFBSSxFQUFFLGNBQWMsQ0FBQyxJQUFJO1FBQ3pCLFVBQVUsRUFBRSxpREFBYztLQUMxQjtJQUNELENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1FBQ3RCLElBQUksRUFBRSxjQUFjLENBQUMsSUFBSTtRQUN6QixVQUFVLEVBQUUsaURBQWM7S0FDMUI7SUFDRCxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUNoQixJQUFJLEVBQUUsY0FBYyxDQUFDLFVBQVU7UUFDL0IsZ0JBQWdCLEVBQUUsMERBQWlCO1FBQ25DLGdCQUFnQixFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDMUI7SUFDRCwyQkFBMkI7SUFDM0IsOEJBQThCO0lBQzlCLG1KQUFtSjtJQUNuSixJQUFJO0NBQ0osQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7QUN4TEgsSUFBWSxRQThCWDtBQTlCRCxXQUFZLFFBQVE7SUFDbkIscUNBQUc7SUFDSCx1Q0FBSTtJQUNKLHFDQUFHO0lBQ0gsdUNBQUk7SUFDSiwyQ0FBTTtJQUNOLDJDQUFNO0lBQ04sMkNBQU07SUFDTiwyQ0FBTTtJQUNOLDJDQUFNO0lBQ04sMkNBQU07SUFDTiw0Q0FBTTtJQUNOLDRDQUFNO0lBQ04sNENBQU07SUFDTiw0Q0FBTTtJQUNOLHNDQUFHO0lBQ0gsZ0RBQVE7SUFDUix3Q0FBSTtJQUNKLGdEQUFRO0lBQ1IsMENBQUs7SUFDTCwwQ0FBSztJQUNMLDBDQUFLO0lBQ0wsMENBQUs7SUFDTCwwQ0FBSztJQUNMLDBDQUFLO0lBQ0wsMENBQUs7SUFDTCwwQ0FBSztJQUNMLDBDQUFLO0lBQ0wsMENBQUs7SUFDTCwwQ0FBSztBQUNOLENBQUMsRUE5QlcsUUFBUSxLQUFSLFFBQVEsUUE4Qm5COzs7Ozs7Ozs7Ozs7Ozs7O0FDOUJELElBQVksWUFTWDtBQVRELFdBQVksWUFBWTtJQUN2QiwrQ0FBSTtJQUNKLDJEQUFVO0lBQ1YsMkRBQVU7SUFDViwyREFBVTtJQUNWLDJEQUFVO0lBQ1YsMkRBQVU7SUFDVixpRUFBYTtJQUNiLCtDQUFJO0FBQ0wsQ0FBQyxFQVRXLFlBQVksS0FBWixZQUFZLFFBU3ZCO0FBMEJELElBQVksa0JBV1g7QUFYRCxXQUFZLGtCQUFrQjtJQUM3Qiw2REFBSztJQUNMLDZEQUFLO0lBQ0wsNkRBQUs7SUFDTCw2REFBSztJQUNMLDZEQUFLO0lBQ0wsNkRBQUs7SUFDTCw2REFBSztJQUNMLDZEQUFLO0lBQ0wsNkRBQUs7SUFDTCwrREFBTTtBQUNQLENBQUMsRUFYVyxrQkFBa0IsS0FBbEIsa0JBQWtCLFFBVzdCOzs7Ozs7O1VDOUNEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7Ozs7V0N6QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSwrQkFBK0Isd0NBQXdDO1dBQ3ZFO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUJBQWlCLHFCQUFxQjtXQUN0QztXQUNBO1dBQ0Esa0JBQWtCLHFCQUFxQjtXQUN2QztXQUNBO1dBQ0EsS0FBSztXQUNMO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7Ozs7V0MzQkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEdBQUc7V0FDSDtXQUNBO1dBQ0EsQ0FBQzs7Ozs7V0NQRDs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1dDTkE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLE1BQU0scUJBQXFCO1dBQzNCO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBOzs7OztVRWhEQTtVQUNBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2NsaWVudC9HYW1lLnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3NyYy9jbGllbnQvTmV0TWFuYWdlci50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi9zcmMvY2xpZW50L2Fzc2V0cy9Bc3NldHMudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2NsaWVudC9hc3NldHMvcmVzb3VyY2VzL0F1ZGlvUmVzb3VyY2UudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2NsaWVudC9hc3NldHMvcmVzb3VyY2VzL0F1ZGlvUmVzb3VyY2VHcm91cC50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi9zcmMvY2xpZW50L2Fzc2V0cy9yZXNvdXJjZXMvRm9udFJlc291cmNlLnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3NyYy9jbGllbnQvYXNzZXRzL3Jlc291cmNlcy9JbWFnZVJlc291cmNlLnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3NyYy9jbGllbnQvYXNzZXRzL3Jlc291cmNlcy9SZWZsZWN0ZWRJbWFnZVJlc291cmNlLnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3NyYy9jbGllbnQvYXNzZXRzL3Jlc291cmNlcy9SZXNvdXJjZS50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi9zcmMvY2xpZW50L2Fzc2V0cy9yZXNvdXJjZXMvVGlsZVJlc291cmNlLnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3NyYy9jbGllbnQvaW5wdXQvQ29udHJvbC50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi9zcmMvY2xpZW50L3BsYXllci9JbnZlbnRvcnkudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2NsaWVudC9wbGF5ZXIvUGxheWVyTG9jYWwudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2NsaWVudC91aS9CdXR0b24udHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2NsaWVudC91aS9JbnB1dEJveC50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi9zcmMvY2xpZW50L3VpL1VpRnJhbWUudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2NsaWVudC91aS9VaVNjcmVlbi50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi9zcmMvY2xpZW50L3VpL3NjcmVlbnMvQ29udHJvbHNNZW51LnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3NyYy9jbGllbnQvdWkvc2NyZWVucy9NYWluTWVudS50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi9zcmMvY2xpZW50L3VpL3NjcmVlbnMvT3B0aW9uc01lbnUudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2NsaWVudC91aS9zY3JlZW5zL1BhdXNlTWVudS50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi9zcmMvY2xpZW50L3VpL3NjcmVlbnMvVmlkZW9TZXR0aW5nc01lbnUudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2NsaWVudC93b3JsZC9Xb3JsZC50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi9zcmMvY2xpZW50L3dvcmxkL1dvcmxkVGlsZXMudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2NsaWVudC93b3JsZC9lbnRpdGllcy9DbG91ZC50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi9zcmMvY2xpZW50L3dvcmxkL2VudGl0aWVzL0Ryb25lRW50aXR5LnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3NyYy9jbGllbnQvd29ybGQvZW50aXRpZXMvRW50aXR5Q2xhc3Nlcy50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi9zcmMvY2xpZW50L3dvcmxkL2VudGl0aWVzL0l0ZW1FbnRpdHkudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2NsaWVudC93b3JsZC9lbnRpdGllcy9QbGF5ZXJFbnRpdHkudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2NsaWVudC93b3JsZC9lbnRpdGllcy9TZXJ2ZXJFbnRpdHkudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2NsaWVudC93b3JsZC9lbnRpdGllcy9UaWxlRW50aXR5LnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3NyYy9jbGllbnQvd29ybGQvcGFydGljbGVzL0NvbG9yUGFydGljbGUudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2dsb2JhbC9FbnRpdHkudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2dsb2JhbC9JbnZlbnRvcnkudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2dsb2JhbC9UaWxlLnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3NyYy9nbG9iYWwvVGlsZUVudGl0eS50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vc25vd2VkX2luL3dlYnBhY2svcnVudGltZS9jaHVuayBsb2FkZWQiLCJ3ZWJwYWNrOi8vc25vd2VkX2luL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL3Nub3dlZF9pbi93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luL3dlYnBhY2svcnVudGltZS9nbG9iYWwiLCJ3ZWJwYWNrOi8vc25vd2VkX2luL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vc25vd2VkX2luL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vc25vd2VkX2luL3dlYnBhY2svcnVudGltZS9qc29ucCBjaHVuayBsb2FkaW5nIiwid2VicGFjazovL3Nub3dlZF9pbi93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL3Nub3dlZF9pbi93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vc25vd2VkX2luL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcDUsIHsgU2hhZGVyIH0gZnJvbSAncDUnO1xyXG5cclxuaW1wb3J0IHsgV29ybGQgfSBmcm9tICcuL3dvcmxkL1dvcmxkJztcclxuXHJcbmltcG9ydCB7XHJcblx0QXVkaW9Bc3NldHMsXHJcblx0Rm9udHMsXHJcblx0SXRlbUFzc2V0cyxcclxuXHRsb2FkQXNzZXRzLFxyXG5cdFBsYXllckFuaW1hdGlvbnMsXHJcblx0VWlBc3NldHMsXHJcblx0V29ybGRBc3NldHMsXHJcbn0gZnJvbSAnLi9hc3NldHMvQXNzZXRzJztcclxuaW1wb3J0IHsgTWFpbk1lbnUgfSBmcm9tICcuL3VpL3NjcmVlbnMvTWFpbk1lbnUnO1xyXG5pbXBvcnQgeyBpbywgU29ja2V0IH0gZnJvbSAnc29ja2V0LmlvLWNsaWVudCc7XHJcbmltcG9ydCB7IFVpU2NyZWVuIH0gZnJvbSAnLi91aS9VaVNjcmVlbic7XHJcbmltcG9ydCB7IFBhdXNlTWVudSB9IGZyb20gJy4vdWkvc2NyZWVucy9QYXVzZU1lbnUnO1xyXG5pbXBvcnQgeyBOZXRNYW5hZ2VyIH0gZnJvbSAnLi9OZXRNYW5hZ2VyJztcclxuaW1wb3J0IHsgV29ybGRUaWxlcywgVGlsZSB9IGZyb20gJy4vd29ybGQvV29ybGRUaWxlcyc7XHJcblxyXG5pbXBvcnQgeyBDbGllbnRFdmVudHMsIFNlcnZlckV2ZW50cyB9IGZyb20gJy4uL2dsb2JhbC9FdmVudHMnO1xyXG5cclxuLypcclxuLy8vSU5GT1JNQVRJT05cclxuLy9TdGFydGluZyBhIGdhbWVcclxuUHJlc3MgTGl2ZSBTZXJ2ZXIgdG8gc3RhcnQgdGhlIGdhbWVcclxub3JcclxuVHlwZSBucG0gcnVuIHByZXN0YXJ0IHRvIHN0YXJ0IHRoZSBnYW1lLlxyXG4vL1RPRE9cclxuV2hlbiBzb21ldGhpbmcgaW4gdGhlIHRvZG8gc2VjdGlvbiwgZWl0aGVyIGRlbGV0ZSBpdCBhbmQgbWFyayB3aGF0IHdhcyBkb25lIGluIHRoZSBkZXNjcmlwdGlvbiAtXHJcbi0gd2hlbiBwdXNoaW5nLCBvciBqdXN0IG1hcmsgaXQgbGlrZSB0aGlzXHJcbihleGFtcGxlOiBDcmVhdGUgYSBudWNsZWFyIGV4cGxvc2lvbiAtLSBYKVxyXG4vLy9HRU5FUkFMIFRPRE86XHJcblxyXG4vL0F1ZGlvXHJcbnNvdW5kc1xyXG5tdXNpY1xyXG5OUEMnc1xyXG5cclxuLy9WaXN1YWxcclxuVXBkYXRlIHNub3cgdGV4dHVyZXNcclxuVXBkYXRlIEdVSSB0ZXh0dXJlc1xyXG5wbGF5ZXIgY2hhcmFjdGVyXHJcbml0ZW0gbG9yZSBpbXBsZW1lbnRlZFxyXG5cclxuLy9HYW1lcGxheVxyXG5maW5pc2ggaXRlbSBtYW5hZ2VtZW50XHJcbnBhdXNlIG1lbnVcclxuSHVuZ2VyLCBoZWF0LCBldGMgc3lzdGVtXHJcbml0ZW0gY3JlYXRpb25cclxuaXRlbSB1c2VcclxuUGFyZW50IFdvcmtiZW5jaFxyXG5cclxuLy9PYmplY3RzXHJcbmRpcnRcclxuc3RvbmVcclxud29ya2JlbmNoXHJcbmJhY2twYWNrICh1c2VkIGFzIGNoZXN0KVxyXG5cclxuLy9Qb2xpc2hcclxuYmV0dGVyIHdvcmxkIGdlbmVyYXRpb25cclxuZm9udCBjb25zaXN0ZW5jeVxyXG5maXggY3Vyc29yIGlucHV0IGxhZyAoc2VwYXJhdGUgY3Vyc29yIGFuZCBhbmltYXRpb24gaW1hZ2VzKVxyXG5maXggc3R1Y2sgb24gc2lkZSBvZiBibG9jayBidWdcclxuZml4IGNvbGxpZGUgd2l0aCBzaWRlcyBvZiBtYXAgYnVnXHJcbiAqL1xyXG5pbXBvcnQgeyBDb250cm9sIH0gZnJvbSAnLi9pbnB1dC9Db250cm9sJztcclxuaW1wb3J0IHsgQ29sb3JQYXJ0aWNsZSB9IGZyb20gJy4vd29ybGQvcGFydGljbGVzL0NvbG9yUGFydGljbGUnO1xyXG5pbXBvcnQgeyBUaWxlRW50aXRpZXMgfSBmcm9tICcuLi9nbG9iYWwvVGlsZUVudGl0eSc7XHJcbmltcG9ydCB7IENsb3VkIH0gZnJvbSAnLi93b3JsZC9lbnRpdGllcy9DbG91ZCc7XHJcblxyXG5leHBvcnQgY2xhc3MgR2FtZSBleHRlbmRzIHA1IHtcclxuXHR3b3JsZFdpZHRoOiBudW1iZXIgPSA1MTI7IC8vIHdpZHRoIG9mIHRoZSB3b3JsZCBpbiB0aWxlcyAgIDwhPiBNQUtFIFNVUkUgVEhJUyBJUyBORVZFUiBMRVNTIFRIQU4gNjQhISEgPCE+XHJcblx0d29ybGRIZWlnaHQ6IG51bWJlciA9IDI1NjsgLy8gaGVpZ2h0IG9mIHRoZSB3b3JsZCBpbiB0aWxlcyAgPCE+IE1BS0UgU1VSRSBUSElTIElTIE5FVkVSIExFU1MgVEhBTiA2NCEhISA8IT5cclxuXHJcblx0VElMRV9XSURUSDogbnVtYmVyID0gODsgLy8gd2lkdGggb2YgYSB0aWxlcyBpbiBwaXhlbHNcclxuXHRUSUxFX0hFSUdIVDogbnVtYmVyID0gODsgLy8gaGVpZ2h0IG9mIGEgdGlsZXMgaW4gcGl4ZWxzXHJcblxyXG5cdHVwc2NhbGVTaXplOiBudW1iZXIgPSA2OyAvLyBudW1iZXIgb2Ygc2NyZWVuIHBpeGVscyBwZXIgdGV4dHVyZSBwaXhlbHMgKHRoaW5rIG9mIHRoaXMgYXMgaHVkIHNjYWxlIGluIE1pbmVjcmFmdClcclxuXHJcblx0Y2FtWDogbnVtYmVyID0gMDsgLy8gcG9zaXRpb24gb2YgdGhlIHRvcCBsZWZ0IGNvcm5lciBvZiB0aGUgc2NyZWVuIGluIHVuLXVwLXNjYWxlZCBwaXhlbHMgKDAgaXMgbGVmdCBvZiB3b3JsZCkgKHdvcmxkV2lkdGgqVElMRV9XSURUSCBpcyBib3R0b20gb2Ygd29ybGQpXHJcblx0Y2FtWTogbnVtYmVyID0gMDsgLy8gcG9zaXRpb24gb2YgdGhlIHRvcCBsZWZ0IGNvcm5lciBvZiB0aGUgc2NyZWVuIGluIHVuLXVwLXNjYWxlZCBwaXhlbHMgKDAgaXMgdG9wIG9mIHdvcmxkKSAod29ybGRIZWlnaHQqVElMRV9IRUlHSFQgaXMgYm90dG9tIG9mIHdvcmxkKVxyXG5cdHBDYW1YOiBudW1iZXIgPSAwOyAvLyBsYXN0IGZyYW1lJ3MgeCBvZiB0aGUgY2FtZXJhXHJcblx0cENhbVk6IG51bWJlciA9IDA7IC8vIGxhc3QgZnJhbWUncyB5IG9mIHRoZSBjYW1lcmFcclxuXHRpbnRlcnBvbGF0ZWRDYW1YOiBudW1iZXIgPSAwOyAvLyBpbnRlcnBvbGF0ZWQgcG9zaXRpb24gb2YgdGhlIGNhbWVyYVxyXG5cdGludGVycG9sYXRlZENhbVk6IG51bWJlciA9IDA7IC8vIGludGVycG9sYXRlZCBwb3NpdGlvbiBvZiB0aGUgY2FtZXJhXHJcblx0ZGVzaXJlZENhbVg6IG51bWJlciA9IDA7IC8vIGRlc2lyZWQgcG9zaXRpb24gb2YgdGhlIGNhbWVyYVxyXG5cdGRlc2lyZWRDYW1ZOiBudW1iZXIgPSAwOyAvLyBkZXNpcmVkIHBvc2l0aW9uIG9mIHRoZSBjYW1lcmFcclxuXHRzY3JlZW5zaGFrZUFtb3VudDogbnVtYmVyID0gMDsgLy8gYW1vdW50IG9mIHNjcmVlbnNoYWtlIGhhcHBlbmluZyBhdCB0aGUgY3VycmVudCBtb21lbnRcclxuXHJcblx0Ly8gdGljayBtYW5hZ2VtZW50XHJcblx0bXNTaW5jZVRpY2s6IG51bWJlciA9IDA7IC8vIHRoaXMgaXMgdGhlIHJ1bm5pbmcgY291bnRlciBvZiBob3cgbWFueSBtaWxsaXNlY29uZHMgaXQgaGFzIGJlZW4gc2luY2UgdGhlIGxhc3QgdGljay4gIFRoZSBnYW1lIGNhbiB0aGVuXHJcblx0bXNQZXJUaWNrOiBudW1iZXIgPSAyMDsgLy8gdGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgcGVyIGdhbWUgdGljay4gIDEwMDAvbXNQZXJUaWNrID0gdGlja3MgcGVyIHNlY29uZFxyXG5cdGFtb3VudFNpbmNlTGFzdFRpY2s6IG51bWJlciA9IDA7IC8vIHRoaXMgaXMgYSB2YXJpYWJsZSBjYWxjdWxhdGVkIGV2ZXJ5IGZyYW1lIHVzZWQgZm9yIGludGVycG9sYXRpb24gLSBkb21haW5bMCwxKVxyXG5cdGZvcmdpdmVuZXNzQ291bnQ6IG51bWJlciA9IDUwOyAvLyBpZiB0aGUgY29tcHV0ZXIgbmVlZHMgdG8gZG8gbW9yZSB0aGFuIDUwIHRpY2tzIGluIGEgc2luZ2xlIGZyYW1lLCB0aGVuIGl0IGNvdWxkIGJlIHJ1bm5pbmcgYmVoaW5kLCBwcm9iYWJseSBiZWNhdXNlIG9mIGEgZnJlZXplIG9yIHRoZSB1c2VyIGJlaW5nIG9uIGEgZGlmZmVyZW50IHRhYi4gIEluIHRoZXNlIGNhc2VzLCBpdCdzIHByb2JhYmx5IGJlc3QgdG8ganVzdCBpZ25vcmUgdGhhdCBhbnkgdGltZSBoYXMgcGFzc2VkIHRvIGF2b2lkIGZ1cnRoZXIgZnJlZXppbmdcclxuXHJcblx0Ly8gcGh5c2ljcyBjb25zdGFudHNcclxuXHRHUkFWSVRZX1NQRUVEOiBudW1iZXIgPSAwLjA0OyAvLyBpbiB1bml0cyBwZXIgc2Vjb25kIHRpY2ssIHBvc2l0aXZlIG1lYW5zIGRvd253YXJkIGdyYXZpdHksIG5lZ2F0aXZlIG1lYW5zIHVwd2FyZCBncmF2aXR5XHJcblx0RFJBR19DT0VGRklDSUVOVDogbnVtYmVyID0gMC4yMTsgLy8gYXJiaXRyYXJ5IG51bWJlciwgMCBtZWFucyBubyBkcmFnXHJcblxyXG5cdC8vIENIQVJBQ1RFUiBTSE9VTEQgQkUgUk9VR0hMWSAxMiBQSVhFTFMgQlkgMjAgUElYRUxTXHJcblxyXG5cdHBpY2tlZFVwU2xvdCA9IC0xO1xyXG5cclxuXHR3b3JsZE1vdXNlWCA9IDA7IC8vIHRoZSBtb3VzZSBwb3NpdGlvbiBpbiB3b3JsZCBjb29yZGluYXRlc1xyXG5cdHdvcmxkTW91c2VZID0gMDsgLy8gdGhlIG1vdXNlIHBvc2l0aW9uIGluIHdvcmxkIGNvb3JkaW5hdGVzXHJcblx0bGFzdEN1cnNvck1vdmUgPSBEYXRlLm5vdygpXHJcblx0bW91c2VPbiA9IHRydWU7IC8vIGlzIHRoZSBtb3VzZSBvbiB0aGUgd2luZG93P1xyXG5cclxuXHRrZXlzOiBib29sZWFuW10gPSBbXTtcclxuXHJcblx0dXNlckdlc3R1cmU6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcblx0Ly8gdGhlIGtleWNvZGUgZm9yIHRoZSBrZXkgdGhhdCBkb2VzIHRoZSBhY3Rpb25cclxuXHRjb250cm9sczogQ29udHJvbFtdID0gW1xyXG5cdFx0bmV3IENvbnRyb2woXHJcblx0XHRcdCdXYWxrIFJpZ2h0JyxcclxuXHRcdFx0dHJ1ZSxcclxuXHRcdFx0NjgsXHJcblx0XHRcdCgpID0+IHtcclxuXHRcdFx0XHRpZiAodGhpcy5jdXJyZW50VWkgIT09IHVuZGVmaW5lZCkgcmV0dXJuO1xyXG5cdFx0XHRcdHRoaXMud29ybGQucGxheWVyLnJpZ2h0QnV0dG9uID0gdHJ1ZTtcclxuXHRcdFx0fSxcclxuXHRcdFx0KCkgPT4ge1xyXG5cdFx0XHRcdGlmICh0aGlzLmN1cnJlbnRVaSAhPT0gdW5kZWZpbmVkKSByZXR1cm47XHJcblx0XHRcdFx0dGhpcy53b3JsZC5wbGF5ZXIucmlnaHRCdXR0b24gPSBmYWxzZTtcclxuXHRcdFx0fSxcclxuXHRcdCksIC8vIHJpZ2h0XHJcblx0XHRuZXcgQ29udHJvbChcclxuXHRcdFx0J1dhbGsgTGVmdCcsXHJcblx0XHRcdHRydWUsXHJcblx0XHRcdDY1LFxyXG5cdFx0XHQoKSA9PiB7XHJcblx0XHRcdFx0aWYgKHRoaXMuY3VycmVudFVpICE9PSB1bmRlZmluZWQpIHJldHVybjtcclxuXHRcdFx0XHR0aGlzLndvcmxkLnBsYXllci5sZWZ0QnV0dG9uID0gdHJ1ZTtcclxuXHRcdFx0fSxcclxuXHRcdFx0KCkgPT4ge1xyXG5cdFx0XHRcdGlmICh0aGlzLmN1cnJlbnRVaSAhPT0gdW5kZWZpbmVkKSByZXR1cm47XHJcblx0XHRcdFx0dGhpcy53b3JsZC5wbGF5ZXIubGVmdEJ1dHRvbiA9IGZhbHNlO1xyXG5cdFx0XHR9LFxyXG5cdFx0KSwgLy8gbGVmdFxyXG5cdFx0bmV3IENvbnRyb2woXHJcblx0XHRcdCdKdW1wJyxcclxuXHRcdFx0dHJ1ZSxcclxuXHRcdFx0ODcsXHJcblx0XHRcdCgpID0+IHtcclxuXHRcdFx0XHRpZiAodGhpcy5jdXJyZW50VWkgIT09IHVuZGVmaW5lZCkgcmV0dXJuO1xyXG5cdFx0XHRcdHRoaXMud29ybGQucGxheWVyLmp1bXBCdXR0b24gPSB0cnVlO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHQoKSA9PiB7XHJcblx0XHRcdFx0aWYgKHRoaXMuY3VycmVudFVpICE9PSB1bmRlZmluZWQpIHJldHVybjtcclxuXHRcdFx0XHR0aGlzLndvcmxkLnBsYXllci5qdW1wQnV0dG9uID0gZmFsc2U7XHJcblx0XHRcdH0sXHJcblx0XHQpLCAvLyBqdW1wXHJcblx0XHRuZXcgQ29udHJvbCgnUGF1c2UnLCB0cnVlLCAyNywgKCkgPT4ge1xyXG5cdFx0XHQvL2lmIGludmVudG9yeSBvcGVue1xyXG5cdFx0XHQvL2Nsb3NlIGludmVudG9yeVxyXG5cdFx0XHQvL3JldHVybjt9XHJcblx0XHRcdGlmICh0aGlzLmN1cnJlbnRVaSA9PT0gdW5kZWZpbmVkKVxyXG5cdFx0XHRcdHRoaXMuY3VycmVudFVpID0gbmV3IFBhdXNlTWVudShGb250cy50aXRsZSwgRm9udHMuYmlnKTtcclxuXHRcdFx0ZWxzZSB0aGlzLmN1cnJlbnRVaSA9IHVuZGVmaW5lZDtcclxuXHRcdH0pLCAvLyBzZXR0aW5nc1xyXG5cdFx0bmV3IENvbnRyb2woJ0ludmVudG9yeScsIHRydWUsIDY5LCAoKSA9PiB7XHJcblx0XHRcdC8vaWYgdWkgb3BlbiByZXR1cm47XHJcblx0XHRcdC8vaWYgaW52ZW50b3J5IGNsb3NlZCBvcGVuIGludmVudG9yeVxyXG5cdFx0XHQvL2Vsc2UgY2xvc2UgaW52ZW50b3J5XHJcblx0XHRcdGNvbnNvbGUubG9nKCdpbnZlbnRvcnkgaGFzIG5vdCBiZWVuIGltcGxlbWVudGVkIHlldCcpO1xyXG5cdFx0fSksIC8vIGludmVudG9yeVxyXG5cdFx0bmV3IENvbnRyb2woJ0hvdGJhciAxJywgdHJ1ZSwgNDksICgpID0+IHtcclxuXHRcdFx0dGhpcy53b3JsZC5pbnZlbnRvcnkuc2VsZWN0ZWRTbG90ID0gMDtcclxuXHRcdH0pLCAvLyBob3QgYmFyIDFcclxuXHRcdG5ldyBDb250cm9sKCdIb3RiYXIgMicsIHRydWUsIDUwLCAoKSA9PiB7XHJcblx0XHRcdHRoaXMud29ybGQuaW52ZW50b3J5LnNlbGVjdGVkU2xvdCA9IDE7XHJcblx0XHR9KSwgLy8gaG90IGJhciAyXHJcblx0XHRuZXcgQ29udHJvbCgnSG90YmFyIDMnLCB0cnVlLCA1MSwgKCkgPT4ge1xyXG5cdFx0XHR0aGlzLndvcmxkLmludmVudG9yeS5zZWxlY3RlZFNsb3QgPSAyO1xyXG5cdFx0fSksIC8vIGhvdCBiYXIgM1xyXG5cdFx0bmV3IENvbnRyb2woJ0hvdGJhciA0JywgdHJ1ZSwgNTIsICgpID0+IHtcclxuXHRcdFx0dGhpcy53b3JsZC5pbnZlbnRvcnkuc2VsZWN0ZWRTbG90ID0gMztcclxuXHRcdH0pLCAvLyBob3QgYmFyIDRcclxuXHRcdG5ldyBDb250cm9sKCdIb3RiYXIgNScsIHRydWUsIDUzLCAoKSA9PiB7XHJcblx0XHRcdHRoaXMud29ybGQuaW52ZW50b3J5LnNlbGVjdGVkU2xvdCA9IDQ7XHJcblx0XHR9KSwgLy8gaG90IGJhciA1XHJcblx0XHRuZXcgQ29udHJvbCgnSG90YmFyIDYnLCB0cnVlLCA1NCwgKCkgPT4ge1xyXG5cdFx0XHR0aGlzLndvcmxkLmludmVudG9yeS5zZWxlY3RlZFNsb3QgPSA1O1xyXG5cdFx0fSksIC8vIGhvdCBiYXIgNlxyXG5cdFx0bmV3IENvbnRyb2woJ0hvdGJhciA3JywgdHJ1ZSwgNTUsICgpID0+IHtcclxuXHRcdFx0dGhpcy53b3JsZC5pbnZlbnRvcnkuc2VsZWN0ZWRTbG90ID0gNjtcclxuXHRcdH0pLCAvLyBob3QgYmFyIDdcclxuXHRcdG5ldyBDb250cm9sKCdIb3RiYXIgOCcsIHRydWUsIDU2LCAoKSA9PiB7XHJcblx0XHRcdHRoaXMud29ybGQuaW52ZW50b3J5LnNlbGVjdGVkU2xvdCA9IDc7XHJcblx0XHR9KSwgLy8gaG90IGJhciA4XHJcblx0XHRuZXcgQ29udHJvbCgnSG90YmFyIDknLCB0cnVlLCA1NywgKCkgPT4ge1xyXG5cdFx0XHR0aGlzLndvcmxkLmludmVudG9yeS5zZWxlY3RlZFNsb3QgPSA4O1xyXG5cdFx0fSksIC8vIGhvdCBiYXIgOVxyXG5cdFx0bmV3IENvbnRyb2woJ0hvdGJhciAxMCcsIHRydWUsIDQ4LCAoKSA9PiB7XHJcblx0XHRcdHRoaXMud29ybGQuaW52ZW50b3J5LnNlbGVjdGVkU2xvdCA9IDk7XHJcblx0XHR9KSwgLy8gaG90IGJhciAxMFxyXG5cdFx0bmV3IENvbnRyb2woJ0hvdGJhciAxMScsIHRydWUsIDE4OSwgKCkgPT4ge1xyXG5cdFx0XHR0aGlzLndvcmxkLmludmVudG9yeS5zZWxlY3RlZFNsb3QgPSAxMDtcclxuXHRcdH0pLCAvLyBob3QgYmFyIDExXHJcblx0XHRuZXcgQ29udHJvbCgnSG90YmFyIDEyJywgdHJ1ZSwgMTg3LCAoKSA9PiB7XHJcblx0XHRcdHRoaXMud29ybGQuaW52ZW50b3J5LnNlbGVjdGVkU2xvdCA9IDExO1xyXG5cdFx0fSksIC8vIGhvdCBiYXIgMTJcclxuXHRdO1xyXG5cclxuXHRjYW52YXM6IHA1LlJlbmRlcmVyOyAvL3RoZSBjYW52YXMgZm9yIHRoZSBnYW1lXHJcblx0c2t5TGF5ZXI6IHA1LkdyYXBoaWNzOyAvL2EgcDUuR3JhcGhpY3Mgb2JqZWN0IHRoYXQgdGhlIHNoYWRlciBpcyBkcmF3biBvbnRvLiAgdGhpcyBpc24ndCB0aGUgYmVzdCB3YXkgdG8gZG8gdGhpcywgYnV0IHRoZSBtYWluIGdhbWUgY2FudmFzIGlzbid0IFdFQkdMLCBhbmQgaXQncyB0b28gbXVjaCB3b3JrIHRvIGNoYW5nZSB0aGF0XHJcblx0c2t5U2hhZGVyOiBwNS5TaGFkZXI7IC8vdGhlIHNoYWRlciB0aGF0IGRyYXdzIHRoZSBza3kgKHRoZSBwYXRoIGZvciB0aGlzIGlzIGluIHRoZSBwdWJsaWMgZm9sZGVyKVxyXG5cclxuXHR3b3JsZDogV29ybGQ7XHJcblxyXG5cdGN1cnJlbnRVaTogVWlTY3JlZW4gfCB1bmRlZmluZWQ7XHJcblxyXG5cdGNvbm5lY3Rpb246IFNvY2tldDxTZXJ2ZXJFdmVudHMsIENsaWVudEV2ZW50cz47XHJcblxyXG5cdG5ldE1hbmFnZXI6IE5ldE1hbmFnZXI7XHJcblxyXG5cdC8vY2hhbmdlYWJsZSBvcHRpb25zIGZyb20gbWVudXNcclxuXHRzZXJ2ZXJWaXNpYmlsaXR5OiBzdHJpbmc7XHJcblx0d29ybGRCdW1waW5lc3M6IG51bWJlcjtcclxuXHRza3lNb2Q6IG51bWJlcjtcclxuXHRza3lUb2dnbGU6IGJvb2xlYW47XHJcblx0cGFydGljbGVNdWx0aXBsaWVyOiBudW1iZXI7XHJcblxyXG5cdHBhcnRpY2xlczogQ29sb3JQYXJ0aWNsZSAvKnxGb290c3RlcFBhcnRpY2xlKi9bXTtcclxuXHRjbG91ZHM6IENsb3VkIC8qfEZvb3RzdGVwUGFydGljbGUqL1tdO1xyXG5cdGJyZWFraW5nOiBib29sZWFuID0gdHJ1ZTtcclxuXHJcblx0Y29uc3RydWN0b3IoY29ubmVjdGlvbjogU29ja2V0KSB7XHJcblx0XHRzdXBlcigoKSA9PiB7IH0pOyAvLyBUbyBjcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgcDUgaXQgd2lsbCBjYWxsIGJhY2sgd2l0aCB0aGUgaW5zdGFuY2UuIFdlIGRvbid0IG5lZWQgdGhpcyBzaW5jZSB3ZSBhcmUgZXh0ZW5kaW5nIHRoZSBjbGFzc1xyXG5cdFx0dGhpcy5jb25uZWN0aW9uID0gY29ubmVjdGlvbjtcclxuXHJcblx0XHQvLyBJbml0aWFsaXNlIHRoZSBuZXR3b3JrIG1hbmFnZXJcclxuXHRcdHRoaXMubmV0TWFuYWdlciA9IG5ldyBOZXRNYW5hZ2VyKHRoaXMpO1xyXG5cdH1cclxuXHJcblx0cHJlbG9hZCgpIHtcclxuXHRcdGNvbnNvbGUubG9nKCdMb2FkaW5nIGFzc2V0cycpO1xyXG5cdFx0bG9hZEFzc2V0cyhcclxuXHRcdFx0dGhpcyxcclxuXHRcdFx0VWlBc3NldHMsXHJcblx0XHRcdEl0ZW1Bc3NldHMsXHJcblx0XHRcdFdvcmxkQXNzZXRzLFxyXG5cdFx0XHRGb250cyxcclxuXHRcdFx0UGxheWVyQW5pbWF0aW9ucyxcclxuXHRcdCk7XHJcblx0XHRjb25zb2xlLmxvZygnQXNzZXQgbG9hZGluZyBjb21wbGV0ZWQnKTtcclxuXHRcdHRoaXMuc2t5U2hhZGVyID0gdGhpcy5sb2FkU2hhZGVyKFxyXG5cdFx0XHQnYXNzZXRzL3NoYWRlcnMvYmFzaWMudmVydCcsXHJcblx0XHRcdCdhc3NldHMvc2hhZGVycy9za3kuZnJhZycsXHJcblx0XHQpO1xyXG5cdH1cclxuXHJcblx0c2V0dXAoKSB7XHJcblx0XHRjb25zb2xlLmxvZygnc2V0dXAgY2FsbGVkJyk7XHJcblx0XHQvLyBtYWtlIGEgY2FudmFzIHRoYXQgZmlsbHMgdGhlIHdob2xlIHNjcmVlbiAoYSBjYW52YXMgaXMgd2hhdCBpcyBkcmF3biB0byBpbiBwNS5qcywgYXMgd2VsbCBhcyBsb3RzIG9mIG90aGVyIEpTIHJlbmRlcmluZyBsaWJyYXJpZXMpXHJcblx0XHR0aGlzLmNhbnZhcyA9IHRoaXMuY3JlYXRlQ2FudmFzKHRoaXMud2luZG93V2lkdGgsIHRoaXMud2luZG93SGVpZ2h0KTtcclxuXHRcdHRoaXMuY2FudmFzLm1vdXNlT3V0KHRoaXMubW91c2VFeGl0ZWQpO1xyXG5cdFx0dGhpcy5jYW52YXMubW91c2VPdmVyKHRoaXMubW91c2VFbnRlcmVkKTtcclxuXHJcblx0XHR0aGlzLnNreUxheWVyID0gdGhpcy5jcmVhdGVHcmFwaGljcyh0aGlzLndpZHRoLCB0aGlzLmhlaWdodCwgJ3dlYmdsJyk7XHJcblxyXG5cdFx0dGhpcy5jdXJyZW50VWkgPSBuZXcgTWFpbk1lbnUoRm9udHMudGl0bGUsIEZvbnRzLmJpZyk7XHJcblxyXG5cdFx0Ly8gVGlja1xyXG5cdFx0c2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG5cdFx0XHRpZiAodGhpcy53b3JsZCA9PT0gdW5kZWZpbmVkKSByZXR1cm47XHJcblx0XHRcdHRoaXMud29ybGQudGljayh0aGlzKTtcclxuXHRcdH0sIDEwMDAgLyB0aGlzLm5ldE1hbmFnZXIucGxheWVyVGlja1JhdGUpO1xyXG5cclxuXHRcdC8vIGdvIGZvciBhIHNjYWxlIG9mIDw2NCB0aWxlcyB3aWRlIHNjcmVlblxyXG5cdFx0dGhpcy53aW5kb3dSZXNpemVkKCk7XHJcblxyXG5cdFx0Ly8gcmVtb3ZlIHRleHR1cmUgaW50ZXJwb2xhdGlvbiAoZW5hYmxlIHBvaW50IGZpbHRlcmluZyBmb3IgaW1hZ2VzKVxyXG5cdFx0dGhpcy5ub1Ntb290aCgpO1xyXG5cclxuXHRcdC8vIHRoZSBoaWdoZXN0IGtleWNvZGUgaXMgMjU1LCB3aGljaCBpcyBcIlRvZ2dsZSBUb3VjaHBhZFwiLCBhY2NvcmRpbmcgdG8ga2V5Y29kZS5pbmZvXHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IDI1NTsgaSsrKSB7XHJcblx0XHRcdHRoaXMua2V5cy5wdXNoKGZhbHNlKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgdGhlIGZyYW1lcmF0ZSBnb2FsIHRvIGFzIGhpZ2ggYXMgcG9zc2libGUgKHRoaXMgd2lsbCBlbmQgdXAgY2FwcGluZyB0byB5b3VyIG1vbml0b3IncyByZWZyZXNoIHJhdGUgd2l0aCB2c3luYy4pXHJcblx0XHR0aGlzLmZyYW1lUmF0ZShJbmZpbml0eSk7XHJcblx0XHQvLyBBdWRpb0FucHNzZXRzLmFtYmllbnQud2ludGVyMS5wbGF5U291bmQoKTtcclxuXHRcdHRoaXMucGFydGljbGVNdWx0aXBsaWVyID0gMTtcclxuXHRcdHRoaXMuc2t5VG9nZ2xlID0gdHJ1ZTtcclxuXHRcdHRoaXMuc2t5TW9kID0gMjtcclxuXHRcdHRoaXMucGFydGljbGVzID0gW107XHJcblx0XHR0aGlzLmNsb3VkcyA9IFtdO1xyXG5cdFx0Zm9yKGxldCBpID0gMDsgaTx0aGlzLndpZHRoL3RoaXMudXBzY2FsZVNpemUvMTU7IGkrKykge1xyXG5cdFx0XHR0aGlzLmNsb3Vkcy5wdXNoKG5ldyBDbG91ZChNYXRoLnJhbmRvbSgpKnRoaXMud2lkdGgvdGhpcy51cHNjYWxlU2l6ZS90aGlzLlRJTEVfV0lEVEgsIDIvKDAuMDMrTWF0aC5yYW5kb20oKSktNSkpO1xyXG5cdFx0fVxyXG5cdFx0Y29uc29sZS5sb2coXCJ0aGVyZSBhcmUgXCIrdGhpcy5jbG91ZHMubGVuZ3RoK1wiIGNsb3Vkc1wiKVxyXG5cdFx0dGhpcy5jdXJzb3IoXCJhc3NldHMvdGV4dHVyZXMvdWkvY3Vyc29yMi5wbmdcIik7XHJcblx0fVxyXG5cclxuXHRkcmF3KCkge1xyXG5cdFx0aWYgKHRoaXMuZnJhbWVDb3VudCA9PT0gMikge1xyXG5cdFx0XHQvL2hhcyB0byBiZSBkb25lIG9uIHRoZSBzZWNvbmQgZnJhbWUgZm9yIHNvbWUgcmVhc29uP1xyXG5cdFx0XHR0aGlzLnNreVNoYWRlci5zZXRVbmlmb3JtKCdzY3JlZW5EaW1lbnNpb25zJywgW1xyXG5cdFx0XHRcdCh0aGlzLndpZHRoIC8gdGhpcy51cHNjYWxlU2l6ZSkgKiAyLFxyXG5cdFx0XHRcdCh0aGlzLmhlaWdodCAvIHRoaXMudXBzY2FsZVNpemUpICogMixcclxuXHRcdFx0XSk7XHJcblx0XHRcdHRoaXMuc2t5U2hhZGVyLnNldFVuaWZvcm0oXHJcblx0XHRcdFx0J3NreUltYWdlJyxcclxuXHRcdFx0XHRXb3JsZEFzc2V0cy5zaGFkZXJSZXNvdXJjZXMuc2t5SW1hZ2UuaW1hZ2UsXHJcblx0XHRcdCk7XHJcblx0XHRcdC8vIE9iamVjdC52YWx1ZXMoUGxheWVyQW5pbWF0aW9ucykuZm9yRWFjaChwbGF5ZXJBbmltYXRpb24gPT4ge1xyXG5cdFx0XHQvLyBcdHBsYXllckFuaW1hdGlvbi5mb3JFYWNoKGFuaW1hdGlvbkZyYW1lID0+IHtcclxuXHRcdFx0Ly8gXHRcdGNvbnNvbGUubG9nKFwibG9hZGluZyBhbmltYXRpb24gXCIrYW5pbWF0aW9uRnJhbWVbMF0ucGF0aClcclxuXHRcdFx0Ly8gXHRcdGFuaW1hdGlvbkZyYW1lWzBdLmxvYWRSZWZsZWN0aW9uKHRoaXMpXHJcblx0XHRcdC8vIFx0fSlcclxuXHRcdFx0Ly8gfSk7XHJcblx0XHR9XHJcblx0XHQvLyBkbyB0aGUgdGljayBjYWxjdWxhdGlvbnNcclxuXHRcdHRoaXMuZG9UaWNrcygpO1xyXG5cclxuXHRcdC8vIHVwZGF0ZSBtb3VzZSBwb3NpdGlvblxyXG5cdFx0dGhpcy51cGRhdGVNb3VzZSgpO1xyXG5cdFx0aWYodGhpcy5tb3VzZUlzUHJlc3NlZCAmJiB0aGlzLndvcmxkIT11bmRlZmluZWQpIHtcclxuXHRcdHRoaXMud29ybGQuaW52ZW50b3J5LndvcmxkQ2xpY2sodGhpcy53b3JsZE1vdXNlWCwgdGhpcy53b3JsZE1vdXNlWSk7fVxyXG5cclxuXHRcdC8vIHVwZGF0ZSB0aGUgY2FtZXJhJ3MgaW50ZXJwb2xhdGlvblxyXG5cdFx0dGhpcy5tb3ZlQ2FtZXJhKCk7XHJcblxyXG5cdFx0Ly8gd2lwZSB0aGUgc2NyZWVuIHdpdGggYSBoYXBweSBsaXR0bGUgbGF5ZXIgb2YgbGlnaHQgYmx1ZVxyXG5cdFx0dGhpcy5za3lTaGFkZXIuc2V0VW5pZm9ybSgnb2Zmc2V0Q29vcmRzJywgW1xyXG5cdFx0XHR0aGlzLmludGVycG9sYXRlZENhbVgsXHJcblx0XHRcdHRoaXMuaW50ZXJwb2xhdGVkQ2FtWSxcclxuXHRcdF0pO1xyXG5cdFx0dGhpcy5za3lTaGFkZXIuc2V0VW5pZm9ybSgnbWlsbGlzJywgdGhpcy5taWxsaXMoKSk7XHJcblx0XHR0aGlzLnNreUxheWVyLnNoYWRlcih0aGlzLnNreVNoYWRlcik7XHJcblx0XHQvLyB0aGlzLmZpbGwoMjU1LCAwLCAwKTtcclxuXHRcdHRoaXMuc2t5TGF5ZXIucmVjdCgwLCAwLCB0aGlzLnNreUxheWVyLndpZHRoLCB0aGlzLnNreUxheWVyLmhlaWdodCk7XHJcblxyXG5cdFx0dGhpcy5pbWFnZSh0aGlzLnNreUxheWVyLCAwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XHJcblxyXG5cdFx0Zm9yIChsZXQgY2xvdWQgb2YgdGhpcy5jbG91ZHMpIHtcclxuXHRcdFx0Y2xvdWQucmVuZGVyKHRoaXMsIHRoaXMudXBzY2FsZVNpemUpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0aGlzLndvcmxkICE9PSB1bmRlZmluZWQpIHRoaXMud29ybGQucmVuZGVyKHRoaXMsIHRoaXMudXBzY2FsZVNpemUpO1xyXG5cclxuXHRcdC8vIHJlbmRlciB0aGUgcGxheWVyLCBhbGwgaXRlbXMsIGV0Yy5cclxuXHRcdC8vdGhpcy5yZW5kZXJFbnRpdGllcygpO1xyXG5cclxuXHRcdC8vZGVsZXRlIGFueSBwYXJ0aWNsZXMgdGhhdCBoYXZlIGdvdHRlbiB0b28gb2xkXHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGFydGljbGVzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGlmICh0aGlzLnBhcnRpY2xlc1tpXS5hZ2UgPiB0aGlzLnBhcnRpY2xlc1tpXS5saWZlc3Bhbikge1xyXG5cdFx0XHRcdHRoaXMucGFydGljbGVzLnNwbGljZShpLCAxKTtcclxuXHRcdFx0XHRpLS07XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHQvL25vIG91dGxpbmUgb24gcGFydGljbGVzXHJcblx0XHR0aGlzLm5vU3Ryb2tlKCk7XHJcblx0XHQvL2RyYXcgYWxsIG9mIHRoZSBwYXJ0aWNsZXNcclxuXHRcdGZvciAobGV0IHBhcnRpY2xlIG9mIHRoaXMucGFydGljbGVzKSB7XHJcblx0XHRcdHBhcnRpY2xlLnJlbmRlcih0aGlzLCB0aGlzLnVwc2NhbGVTaXplKTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLnNtb290aCgpOyAvL2VuYWJsZSBpbWFnZSBsZXJwXHJcblx0XHR0aGlzLmRyYXdpbmdDb250ZXh0Lmdsb2JhbEFscGhhID0gMC42NS1OdW1iZXIodGhpcy51c2VyR2VzdHVyZSkvMjA7IC8vbWFrZSBpbWFnZSB0cmFuc2x1Y2VudFxyXG5cdFx0VWlBc3NldHMudmlnbmV0dGUucmVuZGVyKHRoaXMsIDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcclxuXHRcdHRoaXMuZHJhd2luZ0NvbnRleHQuZ2xvYmFsQWxwaGEgPSAxLjA7XHJcblx0XHR0aGlzLm5vU21vb3RoKCk7XHJcblxyXG5cdFx0Ly8gZHJhdyB0aGUgaG90IGJhclxyXG5cdFx0aWYgKHRoaXMud29ybGQgIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMud29ybGQuaW52ZW50b3J5LndpZHRoOyBpKyspIHtcclxuXHRcdFx0XHRjb25zdCBjdXJyZW50SXRlbSA9IHRoaXMud29ybGQuaW52ZW50b3J5Lml0ZW1zW2ldO1xyXG5cclxuXHRcdFx0XHRVaUFzc2V0cy51aV9zbG90LnJlbmRlcihcclxuXHRcdFx0XHRcdHRoaXMsXHJcblx0XHRcdFx0XHQyICogdGhpcy51cHNjYWxlU2l6ZSArIDE2ICogaSAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdFx0XHQyICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0XHRcdDE2ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0XHRcdDE2ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0XHQpO1xyXG5cclxuXHRcdFx0XHRpZiAodGhpcy53b3JsZC5pbnZlbnRvcnkuc2VsZWN0ZWRTbG90ID09PSBpKSB7XHJcblx0XHRcdFx0XHRVaUFzc2V0cy51aV9zbG90X3NlbGVjdGVkLnJlbmRlcihcclxuXHRcdFx0XHRcdFx0dGhpcyxcclxuXHRcdFx0XHRcdFx0MiAqIHRoaXMudXBzY2FsZVNpemUgKyAxNiAqIGkgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHRcdFx0XHQyICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0XHRcdFx0MTYgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHRcdFx0XHQxNiAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRVaUFzc2V0cy51aV9zbG90LnJlbmRlcihcclxuXHRcdFx0XHRcdFx0dGhpcyxcclxuXHRcdFx0XHRcdFx0MiAqIHRoaXMudXBzY2FsZVNpemUgKyAxNiAqIGkgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHRcdFx0XHQyICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0XHRcdFx0MTYgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHRcdFx0XHQxNiAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKGN1cnJlbnRJdGVtICE9PSB1bmRlZmluZWQgJiYgY3VycmVudEl0ZW0gIT09IG51bGwpIHtcclxuXHRcdFx0XHRcdHRoaXMuZmlsbCgwKTtcclxuXHRcdFx0XHRcdGlmICh0aGlzLnBpY2tlZFVwU2xvdCA9PT0gaSkge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmRyYXdpbmdDb250ZXh0Lmdsb2JhbEFscGhhID0gMC41O1xyXG5cdFx0XHRcdFx0XHR0aGlzLmZpbGwoMCwgMTI3KTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRJdGVtQXNzZXRzW2N1cnJlbnRJdGVtLml0ZW1dLnJlbmRlcihcclxuXHRcdFx0XHRcdFx0dGhpcyxcclxuXHRcdFx0XHRcdFx0NiAqIHRoaXMudXBzY2FsZVNpemUgKyAxNiAqIGkgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHRcdFx0XHQ2ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0XHRcdFx0OCAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdFx0XHRcdDggKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHRcdFx0KTtcclxuXHJcblx0XHRcdFx0XHRGb250cy50b21fdGh1bWIuZHJhd1RleHQodGhpcywgY3VycmVudEl0ZW0ucXVhbnRpdHkudG9TdHJpbmcoKSwgKC00ICogY3VycmVudEl0ZW0ucXVhbnRpdHkudG9TdHJpbmcoKS5sZW5ndGggKyAxNiAqIChpKzEuMDYyNSkpICogdGhpcy51cHNjYWxlU2l6ZSwgMTEgKiB0aGlzLnVwc2NhbGVTaXplKVxyXG5cdFx0XHRcdFx0Ly8gdGhpcy50ZXh0KFxyXG5cdFx0XHRcdFx0Ly8gXHRjdXJyZW50SXRlbS5xdWFudGl0eSxcclxuXHRcdFx0XHRcdC8vIFx0MTYgKiB0aGlzLnVwc2NhbGVTaXplICsgMTYgKiBpICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0XHRcdC8vIFx0MTYgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHRcdFx0Ly8gKTtcclxuXHJcblx0XHRcdFx0XHR0aGlzLmRyYXdpbmdDb250ZXh0Lmdsb2JhbEFscGhhID0gMS4wO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gZHJhdyB0aGUgY3Vyc29yXHJcblx0XHRcdHRoaXMuZHJhd0N1cnNvcigpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0aGlzLmN1cnJlbnRVaSAhPT0gdW5kZWZpbmVkKVxyXG5cdFx0XHR0aGlzLmN1cnJlbnRVaS5yZW5kZXIodGhpcywgdGhpcy51cHNjYWxlU2l6ZSk7XHJcblxyXG5cdFx0Rm9udHMudG9tX3RodW1iLmRyYXdUZXh0KHRoaXMsIFwiU25vd2VkIEluIHYxLjAuMFwiLCB0aGlzLnVwc2NhbGVTaXplLCB0aGlzLmhlaWdodC02KnRoaXMudXBzY2FsZVNpemUpO1xyXG5cdFx0aWYoIXRoaXMudXNlckdlc3R1cmUpXHJcblx0XHRGb250cy50aXRsZS5kcmF3VGV4dCh0aGlzLCBcIkNsaWNrIEFueXdoZXJlIFRvIFVubXV0ZS5cIiwgdGhpcy53aWR0aC8yLXRoaXMudXBzY2FsZVNpemUqNzYsIHRoaXMudXBzY2FsZVNpemUqNStNYXRoLmFicyhNYXRoLnNpbih0aGlzLm1pbGxpcygpLzIwMCkpKnRoaXMudXBzY2FsZVNpemUqMTApO1xyXG5cclxuXHRcdC8vIGNvbnNvbGUudGltZUVuZChcImZyYW1lXCIpO1xyXG5cdH1cclxuXHJcblx0d2luZG93UmVzaXplZCgpIHtcclxuXHJcblx0XHRsZXQgcFVwc2NhbGVTaXplID0gdGhpcy51cHNjYWxlU2l6ZTtcclxuXHRcdC8vIGdvIGZvciBhIHNjYWxlIG9mIDw0OCB0aWxlcyBzY3JlZW5cclxuXHRcdHRoaXMudXBzY2FsZVNpemUgPSBNYXRoLm1pbihcclxuXHRcdFx0TWF0aC5jZWlsKHRoaXMud2luZG93V2lkdGggLyA0OCAvIHRoaXMuVElMRV9XSURUSCksXHJcblx0XHRcdE1hdGguY2VpbCh0aGlzLndpbmRvd0hlaWdodCAvIDQ4IC8gdGhpcy5USUxFX0hFSUdIVCksXHJcblx0XHQpO1xyXG5cclxuXHRcdGlmKHRoaXMuY2xvdWRzIT0gdW5kZWZpbmVkICYmIHRoaXMuY2xvdWRzLmxlbmd0aD4wKSB7Ly9zdHJldGNoIGNsb3VkIGxvY2F0aW9ucyBzbyBhcyB0byBub3QgY3JlYXRlIGdhcHNcclxuXHRcdFx0Zm9yKGxldCBjbG91ZCBvZiB0aGlzLmNsb3Vkcykge1xyXG5cdFx0XHRcdGNsb3VkLnggPSB0aGlzLmludGVycG9sYXRlZENhbVggKyAoY2xvdWQueC10aGlzLmludGVycG9sYXRlZENhbVgpKnRoaXMud2luZG93V2lkdGgvdGhpcy53aWR0aC90aGlzLnVwc2NhbGVTaXplKnBVcHNjYWxlU2l6ZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0dGhpcy5yZXNpemVDYW52YXModGhpcy53aW5kb3dXaWR0aCwgdGhpcy53aW5kb3dIZWlnaHQpO1xyXG5cdFx0dGhpcy5za3lMYXllci5yZXNpemVDYW52YXModGhpcy53aW5kb3dXaWR0aCwgdGhpcy53aW5kb3dIZWlnaHQpO1xyXG5cclxuXHRcdFxyXG5cclxuXHRcdHRoaXMuc2t5U2hhZGVyLnNldFVuaWZvcm0oJ3NjcmVlbkRpbWVuc2lvbnMnLCBbXHJcblx0XHRcdCh0aGlzLndpbmRvd1dpZHRoIC8gdGhpcy51cHNjYWxlU2l6ZSkgKiAyLFxyXG5cdFx0XHQodGhpcy53aW5kb3dIZWlnaHQgLyB0aGlzLnVwc2NhbGVTaXplKSAqIDIsXHJcblx0XHRdKTtcclxuXHJcblx0XHRpZiAodGhpcy5jdXJyZW50VWkgIT09IHVuZGVmaW5lZCkgdGhpcy5jdXJyZW50VWkud2luZG93VXBkYXRlKCk7XHJcblx0fVxyXG5cclxuXHRrZXlQcmVzc2VkKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XHJcblx0XHR0aGlzLmtleXNbdGhpcy5rZXlDb2RlXSA9IHRydWU7XHJcblx0XHRmb3IgKGxldCBjb250cm9sIG9mIHRoaXMuY29udHJvbHMpIHtcclxuXHRcdFx0aWYgKGNvbnRyb2wua2V5Ym9hcmQgJiYgY29udHJvbC5rZXlDb2RlID09PSBldmVudC5rZXlDb2RlKVxyXG5cdFx0XHRcdC8vZXZlbnQua2V5Q29kZSBpcyBkZXByZWNhdGVkIGJ1dCBpIGRvbid0IGNhcmVcclxuXHRcdFx0XHRjb250cm9sLm9uUHJlc3NlZCgpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKFxyXG5cdFx0XHR0aGlzLmN1cnJlbnRVaSAhPT0gdW5kZWZpbmVkICYmXHJcblx0XHRcdHRoaXMuY3VycmVudFVpLmlucHV0Qm94ZXMgIT09IHVuZGVmaW5lZFxyXG5cdFx0KSB7XHJcblx0XHRcdGZvciAobGV0IGkgb2YgdGhpcy5jdXJyZW50VWkuaW5wdXRCb3hlcykge1xyXG5cdFx0XHRcdGlmIChpLmxpc3RlbmluZykge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ3Rlc3QzJyk7XHJcblx0XHRcdFx0XHRpLmxpc3RlbmluZyA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0dGhpcy5jb250cm9sc1tpLmluZGV4XS5rZXlDb2RlID0gZXZlbnQua2V5Q29kZTtcclxuXHRcdFx0XHRcdHRoaXMuY29udHJvbHNbaS5pbmRleF0ua2V5Ym9hcmQgPSBmYWxzZTtcclxuXHRcdFx0XHRcdGkudmFsdWUgPSBldmVudC5rZXlDb2RlO1xyXG5cdFx0XHRcdFx0aS5rZXlib2FyZCA9IHRydWU7XHJcblx0XHRcdFx0XHRpLmltYWdlID0gVWlBc3NldHMuYnV0dG9uX3Vuc2VsZWN0ZWQ7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRrZXlSZWxlYXNlZChldmVudDogS2V5Ym9hcmRFdmVudCkge1xyXG5cdFx0dGhpcy5rZXlzW3RoaXMua2V5Q29kZV0gPSBmYWxzZTtcclxuXHRcdGZvciAobGV0IGNvbnRyb2wgb2YgdGhpcy5jb250cm9scykge1xyXG5cdFx0XHRpZiAoY29udHJvbC5rZXlib2FyZCAmJiBjb250cm9sLmtleUNvZGUgPT09IGV2ZW50LmtleUNvZGUpXHJcblx0XHRcdFx0Ly9ldmVudC5rZXlDb2RlIGlzIGRlcHJlY2F0ZWQgYnV0IGkgZG9uJ3QgY2FyZVxyXG5cdFx0XHRcdGNvbnRyb2wub25SZWxlYXNlZCgpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Ly8gd2hlbiBpdCdzIGRyYWdnZWQgdXBkYXRlIHRoZSBzbGlkZXJzXHJcblx0bW91c2VEcmFnZ2VkKCkge1xyXG5cdFx0aWYgKFxyXG5cdFx0XHR0aGlzLmN1cnJlbnRVaSAhPT0gdW5kZWZpbmVkICYmXHJcblx0XHRcdHRoaXMuY3VycmVudFVpLnNsaWRlcnMgIT09IHVuZGVmaW5lZFxyXG5cdFx0KSB7XHJcblx0XHRcdGZvciAoY29uc3QgaSBvZiB0aGlzLmN1cnJlbnRVaS5zbGlkZXJzKSB7XHJcblx0XHRcdFx0aS51cGRhdGVTbGlkZXJQb3NpdGlvbih0aGlzLm1vdXNlWCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdG1vdXNlTW92ZWQoKSB7XHJcblx0XHRpZiAodGhpcy5jdXJyZW50VWkgIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRpZiAodGhpcy5jdXJyZW50VWkuYnV0dG9ucyAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0Zm9yIChjb25zdCBpIG9mIHRoaXMuY3VycmVudFVpLmJ1dHRvbnMpIHtcclxuXHRcdFx0XHRcdGkudXBkYXRlTW91c2VPdmVyKHRoaXMubW91c2VYLCB0aGlzLm1vdXNlWSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmICh0aGlzLmN1cnJlbnRVaS5pbnB1dEJveGVzICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHRmb3IgKGNvbnN0IGkgb2YgdGhpcy5jdXJyZW50VWkuaW5wdXRCb3hlcykge1xyXG5cdFx0XHRcdFx0aS51cGRhdGVNb3VzZU92ZXIodGhpcy5tb3VzZVgsIHRoaXMubW91c2VZKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdG1vdXNlUHJlc3NlZChlOiBNb3VzZUV2ZW50KSB7XHJcblx0XHRpZighdGhpcy51c2VyR2VzdHVyZSkge1xyXG5cdFx0XHR0aGlzLnVzZXJHZXN0dXJlID0gdHJ1ZTtcclxuXHRcdFx0dGhpcy5zdGFydFNvdW5kcygpO1xyXG5cdFx0fVxyXG5cdFx0Ly8gaW1hZ2UodWlTbG90SW1hZ2UsIDIqdXBzY2FsZVNpemUrMTYqaSp1cHNjYWxlU2l6ZSwgMip1cHNjYWxlU2l6ZSwgMTYqdXBzY2FsZVNpemUsIDE2KnVwc2NhbGVTaXplKTtcclxuXHRcdGlmICh0aGlzLmN1cnJlbnRVaSAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdHRoaXMuY3VycmVudFVpLm1vdXNlUHJlc3NlZChlLmJ1dHRvbik7XHJcblx0XHRcdHJldHVybjsgLy8gYXNqZ3NhZGtqZmdJSVNVU1VFVUVcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy53b3JsZCA9PT0gdW5kZWZpbmVkKSByZXR1cm47XHJcblxyXG5cdFx0aWYgKFxyXG5cdFx0XHR0aGlzLm1vdXNlWCA+IDIgKiB0aGlzLnVwc2NhbGVTaXplICYmXHJcblx0XHRcdHRoaXMubW91c2VYIDxcclxuXHRcdFx0MiAqIHRoaXMudXBzY2FsZVNpemUgK1xyXG5cdFx0XHQxNiAqIHRoaXMudXBzY2FsZVNpemUgKiB0aGlzLndvcmxkLmludmVudG9yeS53aWR0aCAmJlxyXG5cdFx0XHR0aGlzLm1vdXNlWSA+IDIgKiB0aGlzLnVwc2NhbGVTaXplICYmXHJcblx0XHRcdHRoaXMubW91c2VZIDwgMTggKiB0aGlzLnVwc2NhbGVTaXplXHJcblx0XHQpIHtcclxuXHRcdFx0Y29uc3QgY2xpY2tlZFNsb3Q6IG51bWJlciA9IE1hdGguZmxvb3IoXHJcblx0XHRcdFx0KHRoaXMubW91c2VYIC0gMiAqIHRoaXMudXBzY2FsZVNpemUpIC8gMTYgLyB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHQpO1xyXG5cclxuXHRcdFx0aWYgKHRoaXMud29ybGQuaW52ZW50b3J5LnBpY2tlZFVwU2xvdCA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMud29ybGQuaW52ZW50b3J5Lml0ZW1zW2NsaWNrZWRTbG90XSAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0XHR0aGlzLndvcmxkLmludmVudG9yeS5waWNrZWRVcFNsb3QgPSBjbGlja2VkU2xvdDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Ly8gU3dhcCBjbGlja2VkIHNsb3Qgd2l0aCB0aGUgcGlja2VkIHNsb3RcclxuXHRcdFx0XHR0aGlzLmNvbm5lY3Rpb24uZW1pdChcclxuXHRcdFx0XHRcdCdpbnZlbnRvcnlTd2FwJyxcclxuXHRcdFx0XHRcdHRoaXMud29ybGQuaW52ZW50b3J5LnBpY2tlZFVwU2xvdCxcclxuXHRcdFx0XHRcdGNsaWNrZWRTbG90LFxyXG5cdFx0XHRcdCk7XHJcblxyXG5cdFx0XHRcdC8vIFNldCB0aGUgcGlja2VkIHVwIHNsb3QgdG8gbm90aGluZ1xyXG5cdFx0XHRcdHRoaXMud29ybGQuaW52ZW50b3J5LnBpY2tlZFVwU2xvdCA9IHVuZGVmaW5lZDtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy53b3JsZC5pbnZlbnRvcnkud29ybGRDbGlja0NoZWNrKHRoaXMud29ybGRNb3VzZVgsIHRoaXMud29ybGRNb3VzZVkpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0bW91c2VSZWxlYXNlZCgpIHtcclxuXHRcdC8qXHJcblx0XHRpZih0aGlzLmN1cnJlbnRVaSAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdHRoaXMuY3VycmVudFVpLm1vdXNlUmVsZWFzZWQoKTtcclxuXHRcdH1cclxuXHRcdGNvbnN0IHJlbGVhc2VkU2xvdDogbnVtYmVyID0gTWF0aC5mbG9vcihcclxuXHRcdFx0KHRoaXMubW91c2VYIC0gMiAqIHRoaXMudXBzY2FsZVNpemUpIC8gMTYgLyB0aGlzLnVwc2NhbGVTaXplXHJcblx0XHQpO1xyXG5cclxuXHRcdGlmICh0aGlzLnBpY2tlZFVwU2xvdCAhPT0gLTEpIHtcclxuXHRcdFx0aWYgKFxyXG5cdFx0XHRcdHRoaXMubW91c2VYID4gMiAqIHRoaXMudXBzY2FsZVNpemUgJiZcclxuXHRcdFx0XHR0aGlzLm1vdXNlWCA8XHJcblx0XHRcdFx0XHQyICogdGhpcy51cHNjYWxlU2l6ZSArXHJcblx0XHRcdFx0XHRcdDE2ICogdGhpcy51cHNjYWxlU2l6ZSAqIHRoaXMuaG90QmFyLmxlbmd0aCAmJlxyXG5cdFx0XHRcdHRoaXMubW91c2VZID4gMiAqIHRoaXMudXBzY2FsZVNpemUgJiZcclxuXHRcdFx0XHR0aGlzLm1vdXNlWSA8IDE4ICogdGhpcy51cHNjYWxlU2l6ZVxyXG5cdFx0XHQpIHtcclxuXHRcdFx0XHQvLyBNYWtlIHN1cmUgdGhhdCB0aGUgc2xvdCB0aGF0IHRoZSBjdXJzb3Igd2FzIHJlbGVhc2VkIHdhcyBub3QgdGhlIHNsb3QgdGhhdCB3YXMgc2VsZWN0ZWRcclxuXHRcdFx0XHRpZiAocmVsZWFzZWRTbG90ID09PSB0aGlzLnBpY2tlZFVwU2xvdCkgcmV0dXJuO1xyXG5cclxuXHRcdFx0XHQvLyBTd2FwIHRoZSBwaWNrZWQgdXAgc2xvdCB3aXRoIHRoZSBzbG90IHRoZSBtb3VzZSB3YXMgcmVsZWFzZWQgb25cclxuXHRcdFx0XHRbdGhpcy5ob3RCYXJbdGhpcy5waWNrZWRVcFNsb3RdLCB0aGlzLmhvdEJhcltyZWxlYXNlZFNsb3RdXSA9IFtcclxuXHRcdFx0XHRcdHRoaXMuaG90QmFyW3JlbGVhc2VkU2xvdF0sXHJcblx0XHRcdFx0XHR0aGlzLmhvdEJhclt0aGlzLnBpY2tlZFVwU2xvdF0sXHJcblx0XHRcdFx0XTtcclxuXHJcblx0XHRcdFx0dGhpcy5waWNrZWRVcFNsb3QgPSAtMTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aGlzLmhvdEJhclt0aGlzLnBpY2tlZFVwU2xvdF0gPSB1bmRlZmluZWQ7XHJcblx0XHRcdFx0dGhpcy5waWNrZWRVcFNsb3QgPSAtMTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdCAqL1xyXG5cdH1cclxuXHJcblx0bW91c2VXaGVlbChldmVudDoge2RlbHRhOiBudW1iZXJ9KSB7XHJcblx0XHRpZiAoXHJcblx0XHRcdHRoaXMuY3VycmVudFVpICE9PSB1bmRlZmluZWQgJiZcclxuXHRcdFx0dGhpcy5jdXJyZW50VWkuc2Nyb2xsICE9PSB1bmRlZmluZWRcclxuXHRcdCkge1xyXG5cdFx0XHR0aGlzLmN1cnJlbnRVaS5zY3JvbGwgKz0gZXZlbnQuZGVsdGEgLyAxMDtcclxuXHRcdFx0dGhpcy5jdXJyZW50VWkuc2Nyb2xsID0gdGhpcy5jb25zdHJhaW4oXHJcblx0XHRcdFx0dGhpcy5jdXJyZW50VWkuc2Nyb2xsLFxyXG5cdFx0XHRcdHRoaXMuY3VycmVudFVpLm1pblNjcm9sbCxcclxuXHRcdFx0XHR0aGlzLmN1cnJlbnRVaS5tYXhTY3JvbGwsXHJcblx0XHRcdCk7XHJcblx0XHRcdGNvbnNvbGUubG9nKFxyXG5cdFx0XHRcdGBTY3JvbGw6ICR7dGhpcy5jdXJyZW50VWkuc2Nyb2xsfSwgTWluOiAke3RoaXMuY3VycmVudFVpLm1pblNjcm9sbH0sIE1heDogJHt0aGlzLmN1cnJlbnRVaS5tYXhTY3JvbGx9YCxcclxuXHRcdFx0KTtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHR0aGlzLndvcmxkLmludmVudG9yeS5zZWxlY3RlZFNsb3QgKz0gTWF0aC5mbG9vcihldmVudC5kZWx0YS8xMDApXHJcblx0XHRcdHRoaXMud29ybGQuaW52ZW50b3J5LnNlbGVjdGVkU2xvdCA9IHRoaXMud29ybGQuaW52ZW50b3J5LnNlbGVjdGVkU2xvdCV0aGlzLndvcmxkLmludmVudG9yeS53aWR0aDtcclxuXHRcdFx0aWYodGhpcy53b3JsZC5pbnZlbnRvcnkuc2VsZWN0ZWRTbG90PDApIHRoaXMud29ybGQuaW52ZW50b3J5LnNlbGVjdGVkU2xvdCArPSB0aGlzLndvcmxkLmludmVudG9yeS53aWR0aFxyXG5cdFx0XHRjb25zb2xlLmxvZyh0aGlzLndvcmxkLmludmVudG9yeS5zZWxlY3RlZFNsb3QpXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRtb3ZlQ2FtZXJhKCkge1xyXG5cdFx0dGhpcy5pbnRlcnBvbGF0ZWRDYW1YID1cclxuXHRcdFx0dGhpcy5wQ2FtWCArXHJcblx0XHRcdCh0aGlzLmNhbVggLSB0aGlzLnBDYW1YKSAqIHRoaXMuYW1vdW50U2luY2VMYXN0VGljayArXHJcblx0XHRcdCh0aGlzLm5vaXNlKHRoaXMubWlsbGlzKCkgLyAyMDApIC0gMC41KSAqIHRoaXMuc2NyZWVuc2hha2VBbW91bnQ7XHJcblx0XHR0aGlzLmludGVycG9sYXRlZENhbVkgPVxyXG5cdFx0XHR0aGlzLnBDYW1ZICtcclxuXHRcdFx0KHRoaXMuY2FtWSAtIHRoaXMucENhbVkpICogdGhpcy5hbW91bnRTaW5jZUxhc3RUaWNrICtcclxuXHRcdFx0KHRoaXMubm9pc2UoMCwgdGhpcy5taWxsaXMoKSAvIDIwMCkgLSAwLjUpICogdGhpcy5zY3JlZW5zaGFrZUFtb3VudDtcclxuXHR9XHJcblxyXG5cdGRvVGlja3MoKSB7XHJcblx0XHQvLyBpbmNyZWFzZSB0aGUgdGltZSBzaW5jZSBhIHRpY2sgaGFzIGhhcHBlbmVkIGJ5IGRlbHRhVGltZSwgd2hpY2ggaXMgYSBidWlsdC1pbiBwNS5qcyB2YWx1ZVxyXG5cdFx0dGhpcy5tc1NpbmNlVGljayArPSB0aGlzLmRlbHRhVGltZTtcclxuXHJcblx0XHQvLyBkZWZpbmUgYSB0ZW1wb3JhcnkgdmFyaWFibGUgY2FsbGVkIHRpY2tzVGhpc0ZyYW1lIC0gdGhpcyBpcyB1c2VkIHRvIGtlZXAgdHJhY2sgb2YgaG93IG1hbnkgdGlja3MgaGF2ZSBiZWVuIGNhbGN1bGF0ZWQgd2l0aGluIHRoZSBkdXJhdGlvbiBvZiB0aGUgY3VycmVudCBmcmFtZS4gIEFzIGxvbmcgYXMgdGhpcyB2YWx1ZSBpcyBsZXNzIHRoYW4gdGhlIGZvcmdpdmVuZXNzQ291bnQgdmFyaWFibGUsIGl0IGNvbnRpbnVlcyB0byBjYWxjdWxhdGUgdGlja3MgYXMgbmVjZXNzYXJ5LlxyXG5cdFx0bGV0IHRpY2tzVGhpc0ZyYW1lID0gMDtcclxuXHRcdHdoaWxlIChcclxuXHRcdFx0dGhpcy5tc1NpbmNlVGljayA+IHRoaXMubXNQZXJUaWNrICYmXHJcblx0XHRcdHRpY2tzVGhpc0ZyYW1lICE9PSB0aGlzLmZvcmdpdmVuZXNzQ291bnRcclxuXHRcdCkge1xyXG5cdFx0XHQvLyBjb25zb2xlLnRpbWUoXCJ0aWNrXCIpO1xyXG5cdFx0XHRpZiAodGhpcy53b3JsZCAhPT0gdW5kZWZpbmVkKSB0aGlzLmRvVGljaygpO1xyXG5cdFx0XHQvLyBjb25zb2xlLnRpbWVFbmQoXCJ0aWNrXCIpO1xyXG5cdFx0XHR0aGlzLm1zU2luY2VUaWNrIC09IHRoaXMubXNQZXJUaWNrO1xyXG5cdFx0XHR0aWNrc1RoaXNGcmFtZSsrO1xyXG5cdFx0fVxyXG5cdFx0aWYgKHRpY2tzVGhpc0ZyYW1lID09PSB0aGlzLmZvcmdpdmVuZXNzQ291bnQpIHtcclxuXHRcdFx0dGhpcy5tc1NpbmNlVGljayA9IDA7XHJcblx0XHRcdGNvbnNvbGUud2FybihcclxuXHRcdFx0XHRcImxhZyBzcGlrZSBkZXRlY3RlZCwgdGljayBjYWxjdWxhdGlvbnMgY291bGRuJ3Qga2VlcCB1cFwiLFxyXG5cdFx0XHQpO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5hbW91bnRTaW5jZUxhc3RUaWNrID0gdGhpcy5tc1NpbmNlVGljayAvIHRoaXMubXNQZXJUaWNrO1xyXG5cdH1cclxuXHJcblx0ZG9UaWNrKCkge1xyXG5cdFx0aWYodGhpcy53b3JsZCAhPT0gdW5kZWZpbmVkICYmIHRoaXMud29ybGQudGlsZUVudGl0aWVzICE9PSB1bmRlZmluZWQpIHsvL3RpbGUgZW50aXR5IHBhcnRpY2xlc1xyXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGFydGljbGVNdWx0aXBsaWVyOyBpKyspIHtcclxuXHRcdFx0XHRsZXQgayA9IE9iamVjdC5rZXlzKHRoaXMud29ybGQudGlsZUVudGl0aWVzKTtcclxuXHRcdFx0XHRsZXQgciA9IHRoaXMud29ybGQudGlsZUVudGl0aWVzW2tbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKmsubGVuZ3RoKV1dO1xyXG5cdFx0XHRcdGlmKHIucGF5bG9hZC50eXBlXyA9PT0gVGlsZUVudGl0aWVzLlRyZWUpIHtcclxuXHRcdFx0XHRcdGxldCB0ID0gci5jb3ZlcmVkVGlsZXNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKnIuY292ZXJlZFRpbGVzLmxlbmd0aCldO1xyXG5cdFx0XHRcdFx0dGhpcy5wYXJ0aWNsZXMucHVzaChuZXcgQ29sb3JQYXJ0aWNsZShcIiMzNDg5NjVcIiwgTWF0aC5yYW5kb20oKSowLjErMC4xLCAyMCwgdCV0aGlzLndvcmxkLndpZHRoK01hdGgucmFuZG9tKCksIE1hdGguZmxvb3IodC90aGlzLndvcmxkLndpZHRoKStNYXRoLnJhbmRvbSgpLCAwLjEqKE1hdGgucmFuZG9tKCktMC41KSwgMC4wNiooTWF0aC5yYW5kb20oKS0wLjcpLCBmYWxzZSkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Zm9yIChsZXQgcGFydGljbGUgb2YgdGhpcy5wYXJ0aWNsZXMpIHtcclxuXHRcdFx0cGFydGljbGUudGljaygpO1xyXG5cdFx0fVxyXG5cdFx0Zm9yIChsZXQgY2xvdWQgb2YgdGhpcy5jbG91ZHMpIHtcclxuXHRcdFx0Y2xvdWQudGljaygpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKHRoaXMud29ybGQucGxheWVyID09PSB1bmRlZmluZWQpIHJldHVybjtcclxuXHJcblx0XHR0aGlzLndvcmxkLnBsYXllci5rZXlib2FyZElucHV0KCk7XHJcblx0XHR0aGlzLndvcmxkLnBsYXllci5hcHBseUdyYXZpdHlBbmREcmFnKCk7XHJcblx0XHR0aGlzLndvcmxkLnBsYXllci5hcHBseVZlbG9jaXR5QW5kQ29sbGlkZSgpO1xyXG5cclxuXHRcdHRoaXMucENhbVggPSB0aGlzLmNhbVg7XHJcblx0XHR0aGlzLnBDYW1ZID0gdGhpcy5jYW1ZO1xyXG5cdFx0dGhpcy5kZXNpcmVkQ2FtWCA9XHJcblx0XHRcdHRoaXMud29ybGQucGxheWVyLnggK1xyXG5cdFx0XHR0aGlzLndvcmxkLnBsYXllci53aWR0aCAvIDIgLVxyXG5cdFx0XHR0aGlzLndpZHRoIC8gMiAvIHRoaXMuVElMRV9XSURUSCAvIHRoaXMudXBzY2FsZVNpemUgK1xyXG5cdFx0XHR0aGlzLndvcmxkLnBsYXllci54VmVsICogNDA7XHJcblx0XHR0aGlzLmRlc2lyZWRDYW1ZID1cclxuXHRcdFx0dGhpcy53b3JsZC5wbGF5ZXIueSArXHJcblx0XHRcdHRoaXMud29ybGQucGxheWVyLmhlaWdodCAvIDIgLVxyXG5cdFx0XHR0aGlzLmhlaWdodCAvIDIgLyB0aGlzLlRJTEVfSEVJR0hUIC8gdGhpcy51cHNjYWxlU2l6ZSArXHJcblx0XHRcdHRoaXMud29ybGQucGxheWVyLnlWZWwgKiAyMDtcclxuXHRcdHRoaXMuY2FtWCA9ICh0aGlzLmRlc2lyZWRDYW1YICsgdGhpcy5jYW1YICogMjQpIC8gMjU7XHJcblx0XHR0aGlzLmNhbVkgPSAodGhpcy5kZXNpcmVkQ2FtWSArIHRoaXMuY2FtWSAqIDI0KSAvIDI1O1xyXG5cclxuXHRcdHRoaXMuc2NyZWVuc2hha2VBbW91bnQgKj0gMC44O1xyXG5cclxuXHRcdGlmICh0aGlzLmNhbVggPCAwKSB7XHJcblx0XHRcdHRoaXMuY2FtWCA9IDA7XHJcblx0XHR9IGVsc2UgaWYgKFxyXG5cdFx0XHR0aGlzLmNhbVggPlxyXG5cdFx0XHR0aGlzLndvcmxkV2lkdGggLSB0aGlzLndpZHRoIC8gdGhpcy51cHNjYWxlU2l6ZSAvIHRoaXMuVElMRV9XSURUSFxyXG5cdFx0KSB7XHJcblx0XHRcdHRoaXMuY2FtWCA9XHJcblx0XHRcdFx0dGhpcy53b3JsZFdpZHRoIC1cclxuXHRcdFx0XHR0aGlzLndpZHRoIC8gdGhpcy51cHNjYWxlU2l6ZSAvIHRoaXMuVElMRV9XSURUSDtcclxuXHRcdH1cclxuXHRcdGlmIChcclxuXHRcdFx0dGhpcy5jYW1ZID5cclxuXHRcdFx0dGhpcy53b3JsZEhlaWdodCAtIHRoaXMuaGVpZ2h0IC8gdGhpcy51cHNjYWxlU2l6ZSAvIHRoaXMuVElMRV9IRUlHSFRcclxuXHRcdCkge1xyXG5cdFx0XHR0aGlzLmNhbVkgPVxyXG5cdFx0XHRcdHRoaXMud29ybGRIZWlnaHQgLVxyXG5cdFx0XHRcdHRoaXMuaGVpZ2h0IC8gdGhpcy51cHNjYWxlU2l6ZSAvIHRoaXMuVElMRV9IRUlHSFQ7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRzdGFydFNvdW5kcygpIHtcclxuXHRcdGNvbnNvbGUubG9nKFwic3RhcnRpbmcgc291bmRzIGhhcyBub3QgYmVlbiBpbXBsZW1lbnRlZCB5ZXQuXCIpXHJcblx0fVxyXG5cclxuXHR1aUZyYW1lUmVjdCh4OiBudW1iZXIsIHk6IG51bWJlciwgdzogbnVtYmVyLCBoOiBudW1iZXIpIHtcclxuXHRcdC8vIHNldCB0aGUgY29vcmRzIGFuZCBkaW1lbnNpb25zIHRvIHJvdW5kIHRvIHRoZSBuZWFyZXN0IHVuLXVwc2NhbGVkIHBpeGVsXHJcblx0XHR4ID0gTWF0aC5yb3VuZCh4IC8gdGhpcy51cHNjYWxlU2l6ZSkgKiB0aGlzLnVwc2NhbGVTaXplO1xyXG5cdFx0eSA9IE1hdGgucm91bmQoeSAvIHRoaXMudXBzY2FsZVNpemUpICogdGhpcy51cHNjYWxlU2l6ZTtcclxuXHRcdHcgPSBNYXRoLnJvdW5kKHcgLyB0aGlzLnVwc2NhbGVTaXplKSAqIHRoaXMudXBzY2FsZVNpemU7XHJcblx0XHRoID0gTWF0aC5yb3VuZChoIC8gdGhpcy51cHNjYWxlU2l6ZSkgKiB0aGlzLnVwc2NhbGVTaXplO1xyXG5cclxuXHRcdC8vIGNvcm5lcnNcclxuXHRcdFVpQXNzZXRzLnVpX2ZyYW1lLnJlbmRlclBhcnRpYWwoXHJcblx0XHRcdHRoaXMsXHJcblx0XHRcdHgsXHJcblx0XHRcdHksXHJcblx0XHRcdDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHQ3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0MCxcclxuXHRcdFx0MCxcclxuXHRcdFx0NyxcclxuXHRcdFx0NyxcclxuXHRcdCk7XHJcblx0XHRVaUFzc2V0cy51aV9mcmFtZS5yZW5kZXJQYXJ0aWFsKFxyXG5cdFx0XHR0aGlzLFxyXG5cdFx0XHR4ICsgdyAtIDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHR5LFxyXG5cdFx0XHQ3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0NyAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdDgsXHJcblx0XHRcdDAsXHJcblx0XHRcdDcsXHJcblx0XHRcdDcsXHJcblx0XHQpO1xyXG5cdFx0VWlBc3NldHMudWlfZnJhbWUucmVuZGVyUGFydGlhbChcclxuXHRcdFx0dGhpcyxcclxuXHRcdFx0eCxcclxuXHRcdFx0eSArIGggLSA3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0NyAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHQwLFxyXG5cdFx0XHQ4LFxyXG5cdFx0XHQ3LFxyXG5cdFx0XHQ3LFxyXG5cdFx0KTtcclxuXHRcdFVpQXNzZXRzLnVpX2ZyYW1lLnJlbmRlclBhcnRpYWwoXHJcblx0XHRcdHRoaXMsXHJcblx0XHRcdHggKyB3IC0gNyAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdHkgKyBoIC0gNyAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHQ3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0OCxcclxuXHRcdFx0OCxcclxuXHRcdFx0NyxcclxuXHRcdFx0NyxcclxuXHRcdCk7XHJcblxyXG5cdFx0Ly8gdG9wIGFuZCBib3R0b21cclxuXHRcdFVpQXNzZXRzLnVpX2ZyYW1lLnJlbmRlclBhcnRpYWwoXHJcblx0XHRcdHRoaXMsXHJcblx0XHRcdHggKyA3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0eSxcclxuXHRcdFx0dyAtIDE0ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0NyAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdDcsXHJcblx0XHRcdDAsXHJcblx0XHRcdDEsXHJcblx0XHRcdDcsXHJcblx0XHQpO1xyXG5cdFx0VWlBc3NldHMudWlfZnJhbWUucmVuZGVyUGFydGlhbChcclxuXHRcdFx0dGhpcyxcclxuXHRcdFx0eCArIDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHR5ICsgaCAtIDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHR3IC0gMTQgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHQ3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0NyxcclxuXHRcdFx0OCxcclxuXHRcdFx0MSxcclxuXHRcdFx0NyxcclxuXHRcdCk7XHJcblxyXG5cdFx0Ly8gbGVmdCBhbmQgcmlnaHRcclxuXHRcdFVpQXNzZXRzLnVpX2ZyYW1lLnJlbmRlclBhcnRpYWwoXHJcblx0XHRcdHRoaXMsXHJcblx0XHRcdHgsXHJcblx0XHRcdHkgKyA3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0NyAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdGggLSAxNCAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdDAsXHJcblx0XHRcdDcsXHJcblx0XHRcdDcsXHJcblx0XHRcdDEsXHJcblx0XHQpO1xyXG5cdFx0VWlBc3NldHMudWlfZnJhbWUucmVuZGVyUGFydGlhbChcclxuXHRcdFx0dGhpcyxcclxuXHRcdFx0eCArIHcgLSA3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0eSArIDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHQ3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0aCAtIDE0ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0OCxcclxuXHRcdFx0NyxcclxuXHRcdFx0NyxcclxuXHRcdFx0MSxcclxuXHRcdCk7XHJcblxyXG5cdFx0Ly8gY2VudGVyXHJcblx0XHRVaUFzc2V0cy51aV9mcmFtZS5yZW5kZXJQYXJ0aWFsKFxyXG5cdFx0XHR0aGlzLFxyXG5cdFx0XHR4ICsgNyAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdHkgKyA3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0dyAtIDE0ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0aCAtIDE0ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0NyxcclxuXHRcdFx0NyxcclxuXHRcdFx0MSxcclxuXHRcdFx0MSxcclxuXHRcdCk7XHJcblx0fVxyXG5cclxuXHQvKlxyXG4gICAvJCQkJCQkJCAgLyQkICAgICAgICAgICAgICAgICAgICAgICAgICAgLyQkXHJcbiAgfCAkJF9fICAkJHwgJCQgICAgICAgICAgICAgICAgICAgICAgICAgIHxfXy9cclxuICB8ICQkICBcXCAkJHwgJCQkJCQkJCAgLyQkICAgLyQkICAvJCQkJCQkJCAvJCQgIC8kJCQkJCQkICAvJCQkJCQkJCAvJCRcclxuICB8ICQkJCQkJCQvfCAkJF9fICAkJHwgJCQgIHwgJCQgLyQkX19fX18vfCAkJCAvJCRfX19fXy8gLyQkX19fX18vfF9fL1xyXG4gIHwgJCRfX19fLyB8ICQkICBcXCAkJHwgJCQgIHwgJCR8ICAkJCQkJCQgfCAkJHwgJCQgICAgICB8ICAkJCQkJCRcclxuICB8ICQkICAgICAgfCAkJCAgfCAkJHwgJCQgIHwgJCQgXFxfX19fICAkJHwgJCR8ICQkICAgICAgIFxcX19fXyAgJCQgLyQkXHJcbiAgfCAkJCAgICAgIHwgJCQgIHwgJCR8ICAkJCQkJCQkIC8kJCQkJCQkL3wgJCR8ICAkJCQkJCQkIC8kJCQkJCQkL3xfXy9cclxuICB8X18vICAgICAgfF9fLyAgfF9fLyBcXF9fX18gICQkfF9fX19fX18vIHxfXy8gXFxfX19fX19fL3xfX19fX19fL1xyXG5cdFx0XHRcdFx0ICAgLyQkICB8ICQkXHJcblx0XHRcdFx0XHQgIHwgICQkJCQkJC9cclxuXHRcdFx0XHRcdCAgIFxcX19fX19fL1xyXG4gICovXHJcblxyXG5cdC8vIHRoaXMgY2xhc3MgaG9sZHMgYW4gYXhpcy1hbGlnbmVkIHJlY3RhbmdsZSBhZmZlY3RlZCBieSBncmF2aXR5LCBkcmFnLCBhbmQgY29sbGlzaW9ucyB3aXRoIHRpbGVzLlxyXG5cclxuXHRyZWN0VnNSYXkoXHJcblx0XHRyZWN0WD86IGFueSxcclxuXHRcdHJlY3RZPzogYW55LFxyXG5cdFx0cmVjdFc/OiBhbnksXHJcblx0XHRyZWN0SD86IGFueSxcclxuXHRcdHJheVg/OiBhbnksXHJcblx0XHRyYXlZPzogYW55LFxyXG5cdFx0cmF5Vz86IGFueSxcclxuXHRcdHJheUg/OiBhbnksXHJcblx0KSB7XHJcblx0XHQvLyB0aGlzIHJheSBpcyBhY3R1YWxseSBhIGxpbmUgc2VnbWVudCBtYXRoZW1hdGljYWxseSwgYnV0IGl0J3MgY29tbW9uIHRvIHNlZSBwZW9wbGUgcmVmZXIgdG8gc2ltaWxhciBjaGVja3MgYXMgcmF5LWNhc3RzLCBzbyBmb3IgdGhlIGR1cmF0aW9uIG9mIHRoZSBkZWZpbml0aW9uIG9mIHRoaXMgZnVuY3Rpb24sIHJheSBjYW4gYmUgYXNzdW1lZCB0byBtZWFuIHRoZSBzYW1lIGFzIGxpbmUgc2VnbWVudC5cclxuXHJcblx0XHQvLyBpZiB0aGUgcmF5IGRvZXNuJ3QgaGF2ZSBhIGxlbmd0aCwgdGhlbiBpdCBjYW4ndCBoYXZlIGVudGVyZWQgdGhlIHJlY3RhbmdsZS4gIFRoaXMgYXNzdW1lcyB0aGF0IHRoZSBvYmplY3RzIGRvbid0IHN0YXJ0IGluIGNvbGxpc2lvbiwgb3RoZXJ3aXNlIHRoZXknbGwgYmVoYXZlIHN0cmFuZ2VseVxyXG5cdFx0aWYgKHJheVcgPT09IDAgJiYgcmF5SCA9PT0gMCkge1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gY2FsY3VsYXRlIGhvdyBmYXIgYWxvbmcgdGhlIHJheSBlYWNoIHNpZGUgb2YgdGhlIHJlY3RhbmdsZSBpbnRlcnNlY3RzIHdpdGggaXQgKGVhY2ggc2lkZSBpcyBleHRlbmRlZCBvdXQgaW5maW5pdGVseSBpbiBib3RoIGRpcmVjdGlvbnMpXHJcblx0XHRjb25zdCB0b3BJbnRlcnNlY3Rpb24gPSAocmVjdFkgLSByYXlZKSAvIHJheUg7XHJcblx0XHRjb25zdCBib3R0b21JbnRlcnNlY3Rpb24gPSAocmVjdFkgKyByZWN0SCAtIHJheVkpIC8gcmF5SDtcclxuXHRcdGNvbnN0IGxlZnRJbnRlcnNlY3Rpb24gPSAocmVjdFggLSByYXlYKSAvIHJheVc7XHJcblx0XHRjb25zdCByaWdodEludGVyc2VjdGlvbiA9IChyZWN0WCArIHJlY3RXIC0gcmF5WCkgLyByYXlXO1xyXG5cclxuXHRcdGlmIChcclxuXHRcdFx0aXNOYU4odG9wSW50ZXJzZWN0aW9uKSB8fFxyXG5cdFx0XHRpc05hTihib3R0b21JbnRlcnNlY3Rpb24pIHx8XHJcblx0XHRcdGlzTmFOKGxlZnRJbnRlcnNlY3Rpb24pIHx8XHJcblx0XHRcdGlzTmFOKHJpZ2h0SW50ZXJzZWN0aW9uKVxyXG5cdFx0KSB7XHJcblx0XHRcdC8vIHlvdSBoYXZlIHRvIHVzZSB0aGUgSlMgZnVuY3Rpb24gaXNOYU4oKSB0byBjaGVjayBpZiBhIHZhbHVlIGlzIE5hTiBiZWNhdXNlIGJvdGggTmFOPT1OYU4gYW5kIE5hTj09PU5hTiBhcmUgZmFsc2UuXHJcblx0XHRcdC8vIGlmIGFueSBvZiB0aGVzZSB2YWx1ZXMgYXJlIE5hTiwgbm8gY29sbGlzaW9uIGhhcyBvY2N1cnJlZFxyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gY2FsY3VsYXRlIHRoZSBuZWFyZXN0IGFuZCBmYXJ0aGVzdCBpbnRlcnNlY3Rpb25zIGZvciBib3RoIHggYW5kIHlcclxuXHRcdGNvbnN0IG5lYXJYID0gdGhpcy5taW4obGVmdEludGVyc2VjdGlvbiwgcmlnaHRJbnRlcnNlY3Rpb24pO1xyXG5cdFx0Y29uc3QgZmFyWCA9IHRoaXMubWF4KGxlZnRJbnRlcnNlY3Rpb24sIHJpZ2h0SW50ZXJzZWN0aW9uKTtcclxuXHRcdGNvbnN0IG5lYXJZID0gdGhpcy5taW4odG9wSW50ZXJzZWN0aW9uLCBib3R0b21JbnRlcnNlY3Rpb24pO1xyXG5cdFx0Y29uc3QgZmFyWSA9IHRoaXMubWF4KHRvcEludGVyc2VjdGlvbiwgYm90dG9tSW50ZXJzZWN0aW9uKTtcclxuXHJcblx0XHRpZiAobmVhclggPiBmYXJZIHx8IG5lYXJZID4gZmFyWCkge1xyXG5cdFx0XHQvLyB0aGlzIG11c3QgbWVhbiB0aGF0IHRoZSBsaW5lIHRoYXQgbWFrZXMgdXAgdGhlIGxpbmUgc2VnbWVudCBkb2Vzbid0IHBhc3MgdGhyb3VnaCB0aGUgcmF5XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoZmFyWCA8IDAgfHwgZmFyWSA8IDApIHtcclxuXHRcdFx0Ly8gdGhlIGludGVyc2VjdGlvbiBpcyBoYXBwZW5pbmcgYmVmb3JlIHRoZSByYXkgc3RhcnRzLCBzbyB0aGUgcmF5IGlzIHBvaW50aW5nIGF3YXkgZnJvbSB0aGUgdHJpYW5nbGVcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGNhbGN1bGF0ZSB3aGVyZSB0aGUgcG90ZW50aWFsIGNvbGxpc2lvbiBjb3VsZCBiZVxyXG5cdFx0Y29uc3QgbmVhckNvbGxpc2lvblBvaW50ID0gdGhpcy5tYXgobmVhclgsIG5lYXJZKTtcclxuXHJcblx0XHRpZiAobmVhclggPiAxIHx8IG5lYXJZID4gMSkge1xyXG5cdFx0XHQvLyB0aGUgaW50ZXJzZWN0aW9uIGhhcHBlbnMgYWZ0ZXIgdGhlIHJheShsaW5lIHNlZ21lbnQpIGVuZHNcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChuZWFyWCA9PT0gbmVhckNvbGxpc2lvblBvaW50KSB7XHJcblx0XHRcdC8vIGl0IG11c3QgaGF2ZSBjb2xsaWRlZCBvbiBlaXRoZXIgdGhlIGxlZnQgb3IgdGhlIHJpZ2h0ISBub3cgd2hpY2g/XHJcblx0XHRcdGlmIChsZWZ0SW50ZXJzZWN0aW9uID09PSBuZWFyWCkge1xyXG5cdFx0XHRcdC8vIEl0IG11c3QgaGF2ZSBjb2xsaWRlZCBvbiB0aGUgbGVmdCEgIFJldHVybiB0aGUgY29sbGlzaW9uIG5vcm1hbCBbLTEsIDBdXHJcblx0XHRcdFx0cmV0dXJuIFstMSwgMCwgbmVhckNvbGxpc2lvblBvaW50XTtcclxuXHRcdFx0fVxyXG5cdFx0XHQvLyBJZiBpdCBkaWRuJ3QgY29sbGlkZSBvbiB0aGUgbGVmdCwgaXQgbXVzdCBoYXZlIGNvbGxpZGVkIG9uIHRoZSByaWdodC4gIFJldHVybiB0aGUgY29sbGlzaW9uIG5vcm1hbCBbMSwgMF1cclxuXHRcdFx0cmV0dXJuIFsxLCAwLCBuZWFyQ29sbGlzaW9uUG9pbnRdO1xyXG5cdFx0fVxyXG5cdFx0Ly8gSWYgaXQgZGlkbid0IGNvbGxpZGUgb24gdGhlIGxlZnQgb3IgcmlnaHQsIGl0IG11c3QgaGF2ZSBjb2xsaWRlZCBvbiBlaXRoZXIgdGhlIHRvcCBvciB0aGUgYm90dG9tISBub3cgd2hpY2g/XHJcblx0XHRpZiAodG9wSW50ZXJzZWN0aW9uID09PSBuZWFyWSkge1xyXG5cdFx0XHQvLyBJdCBtdXN0IGhhdmUgY29sbGlkZWQgb24gdGhlIHRvcCEgIFJldHVybiB0aGUgY29sbGlzaW9uIG5vcm1hbCBbMCwgLTFdXHJcblx0XHRcdHJldHVybiBbMCwgLTEsIG5lYXJDb2xsaXNpb25Qb2ludF07XHJcblx0XHR9XHJcblx0XHQvLyBJZiBpdCBkaWRuJ3QgY29sbGlkZSBvbiB0aGUgdG9wLCBpdCBtdXN0IGhhdmUgY29sbGlkZWQgb24gdGhlIGJvdHRvbS4gIFJldHVybiB0aGUgY29sbGlzaW9uIG5vcm1hbCBbMCwgMV1cclxuXHRcdHJldHVybiBbMCwgMSwgbmVhckNvbGxpc2lvblBvaW50XTtcclxuXHJcblx0XHQvLyBvdXRwdXQgaWYgbm8gY29sbGlzaW9uOiBmYWxzZVxyXG5cdFx0Ly8gb3V0cHV0IGlmIGNvbGxpc2lvbjogW2NvbGxpc2lvbiBub3JtYWwgWCwgY29sbGlzaW9uIG5vcm1hbCBZLCBuZWFyQ29sbGlzaW9uUG9pbnRdXHJcblx0XHQvLyAgICAgICAgICAgICAgICAgICAgICAgICAtMSB0byAxICAgICAgICAgICAgICAtMSB0byAxICAgICAgICAgICAgMCB0byAxXHJcblx0fVxyXG5cclxuXHRyZW5kZXJFbnRpdGllcygpIHtcclxuXHRcdC8vIGRyYXcgcGxheWVyXHJcblx0XHQvLyB0aGlzLmZpbGwoMjU1LCAwLCAwKTtcclxuXHRcdC8vIHRoaXMubm9TdHJva2UoKTtcclxuXHRcdC8vIHRoaXMucmVjdChcclxuXHRcdC8vICAgICAodGhpcy53b3JsZC5wbGF5ZXIuaW50ZXJwb2xhdGVkWCAqIHRoaXMuVElMRV9XSURUSCAtXHJcblx0XHQvLyAgICAgICAgIHRoaXMuaW50ZXJwb2xhdGVkQ2FtWCAqIHRoaXMuVElMRV9XSURUSCkgKlxyXG5cdFx0Ly8gICAgICAgICB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0Ly8gICAgICh0aGlzLndvcmxkLnBsYXllci5pbnRlcnBvbGF0ZWRZICogdGhpcy5USUxFX0hFSUdIVCAtXHJcblx0XHQvLyAgICAgICAgIHRoaXMuaW50ZXJwb2xhdGVkQ2FtWSAqIHRoaXMuVElMRV9IRUlHSFQpICpcclxuXHRcdC8vICAgICAgICAgdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdC8vICAgICB0aGlzLndvcmxkLnBsYXllci53aWR0aCAqIHRoaXMudXBzY2FsZVNpemUgKiB0aGlzLlRJTEVfV0lEVEgsXHJcblx0XHQvLyAgICAgdGhpcy53b3JsZC5wbGF5ZXIuaGVpZ2h0ICogdGhpcy51cHNjYWxlU2l6ZSAqIHRoaXMuVElMRV9IRUlHSFRcclxuXHRcdC8vICk7XHJcblx0XHQvLyBmb3IgKGNvbnN0IGl0ZW0gb2YgdGhpcy5pdGVtcykge1xyXG5cdFx0Ly8gICAgIGl0ZW0uZmluZEludGVycG9sYXRlZENvb3JkaW5hdGVzKCk7XHJcblx0XHQvL1xyXG5cdFx0Ly8gICAgIGl0ZW0uaXRlbVN0YWNrLnRleHR1cmUucmVuZGVyKFxyXG5cdFx0Ly8gICAgICAgICB0aGlzLFxyXG5cdFx0Ly8gICAgICAgICAoaXRlbS5pbnRlcnBvbGF0ZWRYICogdGhpcy5USUxFX1dJRFRIIC1cclxuXHRcdC8vICAgICAgICAgICAgIHRoaXMuaW50ZXJwb2xhdGVkQ2FtWCAqIHRoaXMuVElMRV9XSURUSCkgKlxyXG5cdFx0Ly8gICAgICAgICAgICAgdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdC8vICAgICAgICAgKGl0ZW0uaW50ZXJwb2xhdGVkWSAqIHRoaXMuVElMRV9IRUlHSFQgLVxyXG5cdFx0Ly8gICAgICAgICAgICAgdGhpcy5pbnRlcnBvbGF0ZWRDYW1ZICogdGhpcy5USUxFX0hFSUdIVCkgKlxyXG5cdFx0Ly8gICAgICAgICAgICAgdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdC8vICAgICAgICAgaXRlbS53ICogdGhpcy51cHNjYWxlU2l6ZSAqIHRoaXMuVElMRV9XSURUSCxcclxuXHRcdC8vICAgICAgICAgaXRlbS5oICogdGhpcy51cHNjYWxlU2l6ZSAqIHRoaXMuVElMRV9IRUlHSFRcclxuXHRcdC8vICAgICApO1xyXG5cdFx0Ly9cclxuXHRcdC8vICAgICAvLyBSZW5kZXIgdGhlIGl0ZW0gcXVhbnRpdHkgbGFiZWxcclxuXHRcdC8vICAgICB0aGlzLmZpbGwoMCk7XHJcblx0XHQvL1xyXG5cdFx0Ly8gICAgIHRoaXMubm9TdHJva2UoKTtcclxuXHRcdC8vXHJcblx0XHQvLyAgICAgdGhpcy50ZXh0QWxpZ24odGhpcy5SSUdIVCwgdGhpcy5CT1RUT00pO1xyXG5cdFx0Ly8gICAgIHRoaXMudGV4dFNpemUoNSAqIHRoaXMudXBzY2FsZVNpemUpO1xyXG5cdFx0Ly9cclxuXHRcdC8vICAgICB0aGlzLnRleHQoXHJcblx0XHQvLyAgICAgICAgIGl0ZW0uaXRlbVN0YWNrLnN0YWNrU2l6ZSxcclxuXHRcdC8vICAgICAgICAgKGl0ZW0uaW50ZXJwb2xhdGVkWCAqIHRoaXMuVElMRV9XSURUSCAtXHJcblx0XHQvLyAgICAgICAgICAgICB0aGlzLmludGVycG9sYXRlZENhbVggKiB0aGlzLlRJTEVfV0lEVEgpICpcclxuXHRcdC8vICAgICAgICAgICAgIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHQvLyAgICAgICAgIChpdGVtLmludGVycG9sYXRlZFkgKiB0aGlzLlRJTEVfSEVJR0hUIC1cclxuXHRcdC8vICAgICAgICAgICAgIHRoaXMuaW50ZXJwb2xhdGVkQ2FtWSAqIHRoaXMuVElMRV9IRUlHSFQpICpcclxuXHRcdC8vICAgICAgICAgICAgIHRoaXMudXBzY2FsZVNpemVcclxuXHRcdC8vICAgICApO1xyXG5cdFx0Ly8gfVxyXG5cdH1cclxuXHJcblx0LypcclxuXHRwaWNrVXBJdGVtKGl0ZW1TdGFjazogSXRlbVN0YWNrKTogYm9vbGVhbiB7XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaG90QmFyLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGNvbnN0IGl0ZW0gPSB0aGlzLmhvdEJhcltpXTtcclxuXHJcblx0XHRcdC8vIElmIHRoZXJlIGFyZSBubyBpdGVtcyBpbiB0aGUgY3VycmVudCBzbG90IG9mIHRoZSBob3RCYXJcclxuXHRcdFx0aWYgKGl0ZW0gPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdHRoaXMuaG90QmFyW2ldID0gaXRlbVN0YWNrO1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoXHJcblx0XHRcdFx0aXRlbSA9PT0gaXRlbVN0YWNrICYmXHJcblx0XHRcdFx0aXRlbS5zdGFja1NpemUgPCBpdGVtLm1heFN0YWNrU2l6ZVxyXG5cdFx0XHQpIHtcclxuXHRcdFx0XHRjb25zdCByZW1haW5pbmdTcGFjZSA9IGl0ZW0ubWF4U3RhY2tTaXplIC0gaXRlbS5zdGFja1NpemU7XHJcblxyXG5cdFx0XHRcdC8vIFRvcCBvZmYgdGhlIHN0YWNrIHdpdGggaXRlbXMgaWYgaXQgY2FuIHRha2UgbW9yZSB0aGFuIHRoZSBzdGFjayBiZWluZyBhZGRlZFxyXG5cdFx0XHRcdGlmIChyZW1haW5pbmdTcGFjZSA+PSBpdGVtU3RhY2suc3RhY2tTaXplKSB7XHJcblx0XHRcdFx0XHR0aGlzLmhvdEJhcltpXS5zdGFja1NpemUgPVxyXG5cdFx0XHRcdFx0XHRpdGVtLnN0YWNrU2l6ZSArIGl0ZW1TdGFjay5zdGFja1NpemU7XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGl0ZW1TdGFjay5zdGFja1NpemUgLT0gcmVtYWluaW5nU3BhY2U7XHJcblxyXG5cdFx0XHRcdHRoaXMuaG90QmFyW2ldLnN0YWNrU2l6ZSA9IGl0ZW1TdGFjay5tYXhTdGFja1NpemU7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGNvbnNvbGUuZXJyb3IoXHJcblx0XHRcdGBDb3VsZCBub3QgcGlja3VwICR7aXRlbVN0YWNrLnN0YWNrU2l6ZX0gJHtpdGVtU3RhY2submFtZX1gXHJcblx0XHQpO1xyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH1cclxuXHJcblx0ICovXHJcblxyXG5cdG1vdXNlRXhpdGVkKCkge1xyXG5cdFx0dGhpcy5tb3VzZU9uID0gZmFsc2U7XHJcblx0fVxyXG5cclxuXHRtb3VzZUVudGVyZWQoKSB7XHJcblx0XHR0aGlzLm1vdXNlT24gPSB0cnVlO1xyXG5cdH1cclxuXHJcblx0dXBkYXRlTW91c2UoKSB7XHJcblx0XHRpZiAoXHJcblx0XHRcdE1hdGguZmxvb3IoXHJcblx0XHRcdFx0KHRoaXMuaW50ZXJwb2xhdGVkQ2FtWCAqIHRoaXMuVElMRV9XSURUSCArXHJcblx0XHRcdFx0XHR0aGlzLm1vdXNlWCAvIHRoaXMudXBzY2FsZVNpemUpIC9cclxuXHRcdFx0XHR0aGlzLlRJTEVfV0lEVEgsXHJcblx0XHRcdCkgIT09IHRoaXMud29ybGRNb3VzZVggfHxcclxuXHRcdFx0TWF0aC5mbG9vcihcclxuXHRcdFx0XHQodGhpcy5pbnRlcnBvbGF0ZWRDYW1ZICogdGhpcy5USUxFX0hFSUdIVCArXHJcblx0XHRcdFx0XHR0aGlzLm1vdXNlWSAvIHRoaXMudXBzY2FsZVNpemUpIC9cclxuXHRcdFx0XHR0aGlzLlRJTEVfSEVJR0hULFxyXG5cdFx0XHQpICE9PSB0aGlzLndvcmxkTW91c2VZXHJcblx0XHQpIHtcclxuXHRcdFx0dGhpcy5sYXN0Q3Vyc29yTW92ZSA9IERhdGUubm93KCk7XHJcblx0XHR9XHJcblx0XHQvLyB3b3JsZCBtb3VzZSB4IGFuZCB5IHZhcmlhYmxlcyBob2xkIHRoZSBtb3VzZSBwb3NpdGlvbiBpbiB3b3JsZCB0aWxlcy4gIDAsIDAgaXMgdG9wIGxlZnRcclxuXHRcdHRoaXMud29ybGRNb3VzZVggPSBNYXRoLmZsb29yKFxyXG5cdFx0XHQodGhpcy5pbnRlcnBvbGF0ZWRDYW1YICogdGhpcy5USUxFX1dJRFRIICtcclxuXHRcdFx0XHR0aGlzLm1vdXNlWCAvIHRoaXMudXBzY2FsZVNpemUpIC9cclxuXHRcdFx0dGhpcy5USUxFX1dJRFRILFxyXG5cdFx0KTtcclxuXHRcdHRoaXMud29ybGRNb3VzZVkgPSBNYXRoLmZsb29yKFxyXG5cdFx0XHQodGhpcy5pbnRlcnBvbGF0ZWRDYW1ZICogdGhpcy5USUxFX0hFSUdIVCArXHJcblx0XHRcdFx0dGhpcy5tb3VzZVkgLyB0aGlzLnVwc2NhbGVTaXplKSAvXHJcblx0XHRcdHRoaXMuVElMRV9IRUlHSFQsXHJcblx0XHQpO1xyXG5cdH1cclxuXHJcblx0ZHJhd0N1cnNvcigpIHtcclxuXHRcdGlmICh0aGlzLm1vdXNlT24pIHtcclxuXHRcdFx0Ly8gaWYgKHRoaXMucGlja2VkVXBTbG90ID4gLTEpIHtcclxuXHRcdFx0Ly8gICAgIHRoaXMuaG90YmFyW3RoaXMucGlja2VkVXBTbG90XS50ZXh0dXJlLnJlbmRlcihcclxuXHRcdFx0Ly8gICAgICAgICB0aGlzLFxyXG5cdFx0XHQvLyAgICAgICAgIHRoaXMubW91c2VYLFxyXG5cdFx0XHQvLyAgICAgICAgIHRoaXMubW91c2VZLFxyXG5cdFx0XHQvLyAgICAgICAgIDggKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHQvLyAgICAgICAgIDggKiB0aGlzLnVwc2NhbGVTaXplXHJcblx0XHRcdC8vICAgICApO1xyXG5cclxuXHRcdFx0Ly8gICAgIHRoaXMudGV4dChcclxuXHRcdFx0Ly8gICAgICAgICB0aGlzLmhvdEJhclt0aGlzLnBpY2tlZFVwU2xvdF0uc3RhY2tTaXplLFxyXG5cdFx0XHQvLyAgICAgICAgIHRoaXMubW91c2VYICsgMTAgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHQvLyAgICAgICAgIHRoaXMubW91c2VZICsgMTAgKiB0aGlzLnVwc2NhbGVTaXplXHJcblx0XHRcdC8vICAgICApO1xyXG5cdFx0XHQvLyB9XHJcblxyXG5cdFx0XHRVaUFzc2V0cy5zZWxlY3RlZF90aWxlLnJlbmRlcihcclxuXHRcdFx0XHR0aGlzLFxyXG5cdFx0XHRcdE1hdGgucm91bmQoXHJcblx0XHRcdFx0XHQodGhpcy53b3JsZE1vdXNlWCAtIHRoaXMuaW50ZXJwb2xhdGVkQ2FtWCkgKlxyXG5cdFx0XHRcdFx0dGhpcy5USUxFX1dJRFRIICpcclxuXHRcdFx0XHRcdHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdFx0KSxcclxuXHRcdFx0XHRNYXRoLnJvdW5kKFxyXG5cdFx0XHRcdFx0KHRoaXMud29ybGRNb3VzZVkgLSB0aGlzLmludGVycG9sYXRlZENhbVkpICpcclxuXHRcdFx0XHRcdHRoaXMuVElMRV9IRUlHSFQgKlxyXG5cdFx0XHRcdFx0dGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0XHQpLFxyXG5cdFx0XHRcdHRoaXMuVElMRV9XSURUSCAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdFx0dGhpcy5USUxFX0hFSUdIVCAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdCk7XHJcblx0XHRcdGlmIChEYXRlLm5vdygpIC0gdGhpcy5sYXN0Q3Vyc29yTW92ZSA+IDEwMDApIHtcclxuXHRcdFx0XHRsZXQgc2VsZWN0ZWRUaWxlID0gdGhpcy53b3JsZC53b3JsZFRpbGVzW3RoaXMud29ybGQud2lkdGggKiB0aGlzLndvcmxkTW91c2VZICsgdGhpcy53b3JsZE1vdXNlWF07XHJcblx0XHRcdFx0aWYgKHR5cGVvZiAoc2VsZWN0ZWRUaWxlKSA9PT0gJ3N0cmluZycpIHtcclxuXHRcdFx0XHRcdHRoaXMudGV4dChcIlRpbGUgZW50aXR5OiBcIiArIHNlbGVjdGVkVGlsZSwgdGhpcy5tb3VzZVgsIHRoaXMubW91c2VZKTsvL0pBTktZIEFMRVJUXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2UgaWYgKFdvcmxkVGlsZXNbc2VsZWN0ZWRUaWxlXSAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0XHR0aGlzLnRleHQoKHRoaXMud29ybGQud2lkdGggKiB0aGlzLndvcmxkTW91c2VZICsgdGhpcy53b3JsZE1vdXNlWCkrXCI6IFwiKyhXb3JsZFRpbGVzW3NlbGVjdGVkVGlsZV0gYXMgVGlsZSkubmFtZSwgdGhpcy5tb3VzZVgsIHRoaXMubW91c2VZKTsvL0pBTktZIEFMRVJUXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5jb25zdCBjb25uZWN0aW9uID0gaW8oe1xyXG5cdGF1dGg6IHsgdG9rZW46IHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndG9rZW4nKSB9LFxyXG59KTtcclxuXHJcbmV4cG9ydCBjb25zdCBnYW1lID0gbmV3IEdhbWUoY29ubmVjdGlvbik7XHJcbiIsImltcG9ydCB7IEdhbWUgfSBmcm9tICcuL0dhbWUnO1xyXG5pbXBvcnQgeyBXb3JsZCB9IGZyb20gJy4vd29ybGQvV29ybGQnO1xyXG5pbXBvcnQgeyBFbnRpdHlDbGFzc2VzIH0gZnJvbSAnLi93b3JsZC9lbnRpdGllcy9FbnRpdHlDbGFzc2VzJztcclxuaW1wb3J0IHsgUGxheWVyTG9jYWwgfSBmcm9tICcuL3BsYXllci9QbGF5ZXJMb2NhbCc7XHJcbmltcG9ydCB7IEludmVudG9yeSB9IGZyb20gJy4vcGxheWVyL0ludmVudG9yeSc7XHJcbmltcG9ydCB7IENsaWVudFRpbGVFbnRpdHksIFRpbGVFbnRpdHlBbmltYXRpb25zIH0gZnJvbSAnLi93b3JsZC9lbnRpdGllcy9UaWxlRW50aXR5JztcclxuaW1wb3J0IHsgV29ybGRBc3NldHMgfSBmcm9tICcuL2Fzc2V0cy9Bc3NldHMnO1xyXG5pbXBvcnQgeyBoc2xUb1JnYiwgUGxheWVyRW50aXR5IH0gZnJvbSAnLi93b3JsZC9lbnRpdGllcy9QbGF5ZXJFbnRpdHknO1xyXG5pbXBvcnQgeyBQbGF5ZXJBbmltYXRpb25zIH0gZnJvbSAnLi9hc3NldHMvQXNzZXRzJztcclxuaW1wb3J0IHsgQW5pbWF0aW9uRnJhbWUgfSBmcm9tICcuL2Fzc2V0cy9Bc3NldHMnO1xyXG5pbXBvcnQgeyBSZWZsZWN0YWJsZUltYWdlUmVzb3VyY2UgfSBmcm9tICcuL2Fzc2V0cy9yZXNvdXJjZXMvUmVmbGVjdGVkSW1hZ2VSZXNvdXJjZSc7XHJcblxyXG5leHBvcnQgY2xhc3MgTmV0TWFuYWdlciB7XHJcblx0Z2FtZTogR2FtZTtcclxuXHJcblx0cGxheWVyVGlja1JhdGU6IG51bWJlcjtcclxuXHJcblx0Y29uc3RydWN0b3IoZ2FtZTogR2FtZSkge1xyXG5cdFx0dGhpcy5nYW1lID0gZ2FtZTtcclxuXHJcblx0XHQvLyBJbml0IGV2ZW50XHJcblx0XHR0aGlzLmdhbWUuY29ubmVjdGlvbi5vbignaW5pdCcsIChwbGF5ZXJUaWNrUmF0ZSwgdG9rZW4pID0+IHtcclxuXHRcdFx0Y29uc29sZS5sb2coYFRpY2sgcmF0ZSBzZXQgdG86ICR7cGxheWVyVGlja1JhdGV9YCk7XHJcblx0XHRcdHRoaXMucGxheWVyVGlja1JhdGUgPSBwbGF5ZXJUaWNrUmF0ZTtcclxuXHRcdFx0aWYgKHRva2VuKSB7XHJcblx0XHRcdFx0d2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKCd0b2tlbicsIHRva2VuKTtcclxuXHRcdFx0XHQodGhpcy5nYW1lLmNvbm5lY3Rpb24uYXV0aCBhcyB7IHRva2VuOiBzdHJpbmcgfSkudG9rZW4gPSB0b2tlbjtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0Ly8gSW5pdGlhbGl6YXRpb24gZXZlbnRzXHJcblx0XHR7XHJcblx0XHRcdC8vIExvYWQgdGhlIHdvcmxkIGFuZCBzZXQgdGhlIHBsYXllciBlbnRpdHkgaWRcclxuXHRcdFx0dGhpcy5nYW1lLmNvbm5lY3Rpb24ub24oXHJcblx0XHRcdFx0J3dvcmxkTG9hZCcsXHJcblx0XHRcdFx0KFxyXG5cdFx0XHRcdFx0d2lkdGgsXHJcblx0XHRcdFx0XHRoZWlnaHQsXHJcblx0XHRcdFx0XHR0aWxlcyxcclxuXHRcdFx0XHRcdHRpbGVFbnRpdGllcyxcclxuXHRcdFx0XHRcdGVudGl0aWVzLFxyXG5cdFx0XHRcdFx0cGxheWVyLFxyXG5cdFx0XHRcdFx0aW52ZW50b3J5LFxyXG5cdFx0XHRcdCkgPT4ge1xyXG5cdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhlbnRpdGllcyk7XHJcblx0XHRcdFx0XHRsZXQgaWQgPSBwbGF5ZXIuaWRcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwicGxheWVyIGlkZGRhZHNhc2RmOiBcIiAraWQpXHJcblx0XHRcdFx0XHRpZCA9IHBsYXllci5pZC5zcGxpdChcIi1cIikuam9pbihcIlwiKTsvL3N0cmluZy5wcm90b3R5cGUucmVwbGFjZUFsbCByZXF1aXJlcyBFUzIwMjFcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwicGxheWVyIGlkZGRhZHNhc2RmOiBcIiAraWQpXHJcblx0XHRcdFx0XHRsZXQgaWROdW1iZXIgPSAoTnVtYmVyKFwiMHhcIitpZCkvMTAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwKSUxOy8vZ2V0IGEgbnVtYmVyIDAtMSBwc2V1ZG9yYW5kb21seSBzZWxlY3RlZCBmcm9tIHRoZSB1dWlkIG9mIHRoZSBwbGF5ZXJcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwicGxheWVyIGlkZGRhZHNhc2RmOiBcIiAraWROdW1iZXIpXHJcblx0XHRcdFx0XHRPYmplY3QuZW50cmllcyhQbGF5ZXJBbmltYXRpb25zKS5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG5cdFx0XHRcdFx0XHRmb3IobGV0IGZyYW1lIG9mIGVsZW1lbnRbMV0pIHtcclxuXHRcdFx0XHRcdFx0XHRmcmFtZVswXS5yZWRlZmluZVNjYXJmQ29sb3IoaHNsVG9SZ2IoaWROdW1iZXIsIDEsIDAuNDUpLCBoc2xUb1JnYihpZE51bWJlciwgMSwgMC4zKSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0bGV0IHRpbGVFbnRpdGllczI6IHtcclxuXHRcdFx0XHRcdFx0W2lkOiBzdHJpbmddOiBDbGllbnRUaWxlRW50aXR5XHJcblx0XHRcdFx0XHRcdC8vIFtpZDogc3RyaW5nXToge1xyXG5cdFx0XHRcdFx0XHQvLyBcdGlkOiBzdHJpbmc7XHJcblx0XHRcdFx0XHRcdC8vIFx0Y292ZXJlZFRpbGVzOiBudW1iZXJbXTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRyZWZsZWN0ZWRUaWxlczogbnVtYmVyW107Ly90aGlzIGhvbmVzdGx5IHNob3VsZG4ndCBiZSBzZW50IG92ZXIgc29ja2V0IGJ1dCBpbSB0aXJlZFxyXG5cdFx0XHRcdFx0XHQvLyBcdHR5cGVfOiBudW1iZXI7XHJcblx0XHRcdFx0XHRcdC8vIFx0ZGF0YToge307XHJcblx0XHRcdFx0XHRcdC8vIFx0YW5pbUZyYW1lOiBudW1iZXI7XHJcblx0XHRcdFx0XHRcdC8vIFx0YW5pbWF0ZTogYm9vbGVhbjtcclxuXHRcdFx0XHRcdFx0Ly8gfTtcclxuXHRcdFx0XHRcdH0gPSB7fTtcclxuXHRcdFx0XHRcdHRpbGVFbnRpdGllcy5mb3JFYWNoKHRpbGVFbnRpdHkgPT4ge1xyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZygnYWRkaW5nIHRpbGUgZW50aXR5OiAnICsgdGlsZUVudGl0eS5pZCk7XHJcblx0XHRcdFx0XHRcdHRpbGVFbnRpdGllczJbdGlsZUVudGl0eS5pZF0gPSB7XHJcblx0XHRcdFx0XHRcdFx0Li4udGlsZUVudGl0eSxcclxuXHRcdFx0XHRcdFx0XHRpZDogdGlsZUVudGl0eS5pZCxcclxuXHRcdFx0XHRcdFx0XHRjb3ZlcmVkVGlsZXM6IHRpbGVFbnRpdHkuY292ZXJlZFRpbGVzLFxyXG5cdFx0XHRcdFx0XHRcdHJlZmxlY3RlZFRpbGVzOiB0aWxlRW50aXR5LnJlZmxlY3RlZFRpbGVzLFxyXG5cdFx0XHRcdFx0XHRcdGFuaW1GcmFtZTogcmFuZGludChcclxuXHRcdFx0XHRcdFx0XHRcdDAsXHJcblx0XHRcdFx0XHRcdFx0XHRXb3JsZEFzc2V0cy50aWxlRW50aXRpZXNbXHJcblx0XHRcdFx0XHRcdFx0XHRcdHRpbGVFbnRpdHkucGF5bG9hZC50eXBlX1xyXG5cdFx0XHRcdFx0XHRcdFx0XS5sZW5ndGggLSAxLFxyXG5cdFx0XHRcdFx0XHRcdCksXHJcblx0XHRcdFx0XHRcdFx0YW5pbWF0ZTpcclxuXHRcdFx0XHRcdFx0XHRcdFRpbGVFbnRpdHlBbmltYXRpb25zW3RpbGVFbnRpdHkucGF5bG9hZC50eXBlX10sXHJcblx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdHRoaXMuZ2FtZS53b3JsZCA9IG5ldyBXb3JsZChcclxuXHRcdFx0XHRcdFx0d2lkdGgsXHJcblx0XHRcdFx0XHRcdGhlaWdodCxcclxuXHRcdFx0XHRcdFx0dGlsZXMsXHJcblx0XHRcdFx0XHRcdHRpbGVFbnRpdGllczIsXHJcblx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdFx0dGhpcy5nYW1lLndvcmxkLmludmVudG9yeSA9IG5ldyBJbnZlbnRvcnkoaW52ZW50b3J5KTtcclxuXHRcdFx0XHRcdHRoaXMuZ2FtZS53b3JsZC5wbGF5ZXIgPSBuZXcgUGxheWVyTG9jYWwocGxheWVyKTtcclxuXHRcdFx0XHRcdHRoaXMuZ2FtZS53b3JsZC5wbGF5ZXIuY29sb3IxID0gaHNsVG9SZ2IoaWROdW1iZXIsIDEsIDAuNDUpO1xyXG5cdFx0XHRcdFx0dGhpcy5nYW1lLndvcmxkLnBsYXllci5jb2xvcjEgPSBoc2xUb1JnYihpZE51bWJlciwgMSwgMC4zKTtcclxuXHRcdFx0XHRcdGVudGl0aWVzLmZvckVhY2goZW50aXR5ID0+IHtcclxuXHRcdFx0XHRcdFx0dGhpcy5nYW1lLndvcmxkLmVudGl0aWVzW2VudGl0eS5pZF0gPSBuZXcgRW50aXR5Q2xhc3Nlc1tcclxuXHRcdFx0XHRcdFx0XHRlbnRpdHkudHlwZVxyXG5cdFx0XHRcdFx0XHRdKGVudGl0eSk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFdvcmxkIGV2ZW50c1xyXG5cdFx0e1xyXG5cdFx0XHQvLyBUaWxlIHVwZGF0ZXMgc3VjaCBhcyBicmVha2luZyBhbmQgcGxhY2luZ1xyXG5cdFx0XHR0aGlzLmdhbWUuY29ubmVjdGlvbi5vbihcclxuXHRcdFx0XHQnd29ybGRVcGRhdGUnLFxyXG5cdFx0XHRcdCh1cGRhdGVkVGlsZXM6IHsgdGlsZUluZGV4OiBudW1iZXI7IHRpbGU6IG51bWJlciB9W10pID0+IHtcclxuXHRcdFx0XHRcdC8vIElmIHRoZSB3b3JsZCBpcyBub3Qgc2V0XHJcblx0XHRcdFx0XHRpZiAodGhpcy5nYW1lLndvcmxkID09PSB1bmRlZmluZWQpIHJldHVybjtcclxuXHJcblx0XHRcdFx0XHR1cGRhdGVkVGlsZXMuZm9yRWFjaCh0aWxlID0+IHtcclxuXHRcdFx0XHRcdFx0dGhpcy5nYW1lLndvcmxkLnVwZGF0ZVRpbGUodGlsZS50aWxlSW5kZXgsIHRpbGUudGlsZSk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHQpO1xyXG5cclxuXHRcdFx0dGhpcy5nYW1lLmNvbm5lY3Rpb24ub24oJ2ludmVudG9yeVVwZGF0ZScsIHVwZGF0ZXMgPT4ge1xyXG5cdFx0XHRcdC8vIElmIHRoZSB3b3JsZCBpcyBub3Qgc2V0XHJcblx0XHRcdFx0aWYgKHRoaXMuZ2FtZS53b3JsZCA9PT0gdW5kZWZpbmVkKSByZXR1cm47XHJcblxyXG5cdFx0XHRcdHVwZGF0ZXMuZm9yRWFjaCh1cGRhdGUgPT4ge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2codXBkYXRlKTtcclxuXHRcdFx0XHRcdHRoaXMuZ2FtZS53b3JsZC5pbnZlbnRvcnkuaXRlbXNbdXBkYXRlLnNsb3RdID0gdXBkYXRlLml0ZW07XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFBsYXllciBldmVudHNcclxuXHRcdHtcclxuXHRcdFx0dGhpcy5nYW1lLmNvbm5lY3Rpb24ub24oJ2VudGl0eVVwZGF0ZScsIGVudGl0eURhdGEgPT4ge1xyXG5cdFx0XHRcdC8vIElmIHRoZSB3b3JsZCBpcyBub3Qgc2V0XHJcblx0XHRcdFx0aWYgKHRoaXMuZ2FtZS53b3JsZCA9PT0gdW5kZWZpbmVkKSByZXR1cm47XHJcblxyXG5cdFx0XHRcdGNvbnN0IGVudGl0eSA9IHRoaXMuZ2FtZS53b3JsZC5lbnRpdGllc1tlbnRpdHlEYXRhLmlkXTtcclxuXHRcdFx0XHRpZiAoZW50aXR5ID09PSB1bmRlZmluZWQpIHJldHVybjtcclxuXHJcblx0XHRcdFx0ZW50aXR5LnVwZGF0ZURhdGEoZW50aXR5RGF0YSk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0dGhpcy5nYW1lLmNvbm5lY3Rpb24ub24oJ29uUGxheWVyQW5pbWF0aW9uJywgKGFuaW1hdGlvbiwgcGxheWVySWQpID0+IHtcclxuXHRcdFx0XHRpZiAoKCgoKCgodGhpcy5nYW1lLndvcmxkID09IHVuZGVmaW5lZCkpKSkpKSkgcmV0dXJuO1xyXG5cdFx0XHRcdGxldCBlID0gdGhpcy5nYW1lLndvcmxkLmVudGl0aWVzW3BsYXllcklkXTtcclxuXHRcdFx0XHRpZihlIGluc3RhbmNlb2YgUGxheWVyRW50aXR5ICYmIE9iamVjdC5rZXlzKFBsYXllckFuaW1hdGlvbnMpLmluY2x1ZGVzKGUuY3VycmVudEFuaW1hdGlvbikpIHtcclxuXHRcdFx0XHRcdC8vQHRzLWV4cGVjdC1lcnJvclxyXG5cdFx0XHRcdFx0ZS5jdXJyZW50QW5pbWF0aW9uID0gYW5pbWF0aW9uO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHR0aGlzLmdhbWUuY29ubmVjdGlvbi5vbignZW50aXR5Q3JlYXRlJywgZW50aXR5RGF0YSA9PiB7XHJcblx0XHRcdFx0Ly8gSWYgdGhlIHdvcmxkIGlzIG5vdCBzZXRcclxuXHRcdFx0XHRpZiAodGhpcy5nYW1lLndvcmxkID09PSB1bmRlZmluZWQpIHJldHVybjtcclxuXHJcblx0XHRcdFx0dGhpcy5nYW1lLndvcmxkLmVudGl0aWVzW2VudGl0eURhdGEuaWRdID0gbmV3IEVudGl0eUNsYXNzZXNbXHJcblx0XHRcdFx0XHRlbnRpdHlEYXRhLnR5cGVcclxuXHRcdFx0XHRdKGVudGl0eURhdGEpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHRoaXMuZ2FtZS5jb25uZWN0aW9uLm9uKCdlbnRpdHlEZWxldGUnLCBpZCA9PiB7XHJcblx0XHRcdFx0Ly8gSWYgdGhlIHdvcmxkIGlzIG5vdCBzZXRcclxuXHRcdFx0XHRpZiAodGhpcy5nYW1lLndvcmxkID09PSB1bmRlZmluZWQpIHJldHVybjtcclxuXHJcblx0XHRcdFx0ZGVsZXRlIHRoaXMuZ2FtZS53b3JsZC5lbnRpdGllc1tpZF07XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0Ly8gVXBkYXRlIHRoZSBvdGhlciBwbGF5ZXJzIGluIHRoZSB3b3JsZFxyXG5cdFx0XHR0aGlzLmdhbWUuY29ubmVjdGlvbi5vbihcclxuXHRcdFx0XHQnZW50aXR5U25hcHNob3QnLFxyXG5cdFx0XHRcdChzbmFwc2hvdDoge1xyXG5cdFx0XHRcdFx0aWQ6IHN0cmluZztcclxuXHRcdFx0XHRcdHRpbWU6IG51bWJlcjtcclxuXHRcdFx0XHRcdHN0YXRlOiB7IGlkOiBzdHJpbmc7IHg6IHN0cmluZzsgeTogc3RyaW5nIH1bXTtcclxuXHRcdFx0XHR9KSA9PiB7XHJcblx0XHRcdFx0XHQvLyBJZiB0aGUgd29ybGQgaXMgbm90IHNldFxyXG5cdFx0XHRcdFx0aWYgKHRoaXMuZ2FtZS53b3JsZCA9PT0gdW5kZWZpbmVkKSByZXR1cm47XHJcblxyXG5cdFx0XHRcdFx0dGhpcy5nYW1lLndvcmxkLnVwZGF0ZVBsYXllcnMoc25hcHNob3QpO1xyXG5cdFx0XHRcdH0sXHJcblx0XHRcdCk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiByYW5kaW50KHgxOiBudW1iZXIsIHgyOiBudW1iZXIpIHtcclxuXHRyZXR1cm4gTWF0aC5mbG9vcih4MSArIE1hdGgucmFuZG9tKCkgKiAoeDIgKyAxIC0geDEpKTtcclxufVxyXG4iLCJpbXBvcnQgeyBUaWxlUmVzb3VyY2UgfSBmcm9tICcuL3Jlc291cmNlcy9UaWxlUmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBJbWFnZVJlc291cmNlIH0gZnJvbSAnLi9yZXNvdXJjZXMvSW1hZ2VSZXNvdXJjZSc7XHJcbmltcG9ydCB7IEZvbnRSZXNvdXJjZSB9IGZyb20gJy4vcmVzb3VyY2VzL0ZvbnRSZXNvdXJjZSc7XHJcbmltcG9ydCB7IEF1ZGlvUmVzb3VyY2VHcm91cCB9IGZyb20gJy4vcmVzb3VyY2VzL0F1ZGlvUmVzb3VyY2VHcm91cCc7XHJcbmltcG9ydCB7IEF1ZGlvUmVzb3VyY2UgfSBmcm9tICcuL3Jlc291cmNlcy9BdWRpb1Jlc291cmNlJztcclxuaW1wb3J0IHsgSXRlbVR5cGUgfSBmcm9tICcuLi8uLi9nbG9iYWwvSW52ZW50b3J5JztcclxuaW1wb3J0IHsgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlIH0gZnJvbSAnLi9yZXNvdXJjZXMvUmVmbGVjdGVkSW1hZ2VSZXNvdXJjZSc7XHJcbmltcG9ydCBQNSBmcm9tICdwNSc7XHJcbmltcG9ydCB7IFJlc291cmNlIH0gZnJvbSAnLi9yZXNvdXJjZXMvUmVzb3VyY2UnO1xyXG5cclxuaW50ZXJmYWNlIEFzc2V0R3JvdXAge1xyXG5cdFtuYW1lOiBzdHJpbmddOlxyXG5cdFx0fCB7XHJcblx0XHRcdFx0W25hbWU6IHN0cmluZ106XHJcblx0XHRcdFx0XHR8IFJlc291cmNlXHJcblx0XHRcdFx0XHR8IEFzc2V0R3JvdXBcclxuXHRcdFx0XHRcdHwgQXVkaW9SZXNvdXJjZUdyb3VwXHJcblx0XHRcdFx0XHR8IEF1ZGlvUmVzb3VyY2VcclxuXHRcdFx0XHRcdHwgSW1hZ2VSZXNvdXJjZVtdXHJcbiAgICAgICAgICAgICAgICAgICAgfCBSZWZsZWN0YWJsZUltYWdlUmVzb3VyY2VbXVxyXG4gICAgICAgICAgICAgICAgICAgIHwgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlXHJcblx0XHRcdFx0XHR8IFtSZWZsZWN0YWJsZUltYWdlUmVzb3VyY2UsIG51bWJlcl1bXTtcclxuXHRcdCAgfVxyXG5cdFx0fCBSZXNvdXJjZVxyXG5cdFx0fCBBc3NldEdyb3VwXHJcblx0XHR8IEF1ZGlvUmVzb3VyY2VHcm91cFxyXG5cdFx0fCBBdWRpb1Jlc291cmNlXHJcblx0XHR8IEltYWdlUmVzb3VyY2VbXVxyXG5cdFx0fCBJbWFnZVJlc291cmNlW11bXVxyXG4gICAgICAgIHwgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlW11cclxuICAgICAgICB8IFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZVxyXG5cdFx0fCBbUmVmbGVjdGFibGVJbWFnZVJlc291cmNlLCBudW1iZXJdW107XHJcbn1cclxuXHJcbmNvbnN0IHBsYXllckFuaW1hdGlvbnMgPSA8VCBleHRlbmRzIFJlY29yZDxzdHJpbmcsIFtSZWZsZWN0YWJsZUltYWdlUmVzb3VyY2UsIG51bWJlcl1bXT4+KFxyXG5cdGRhdGE6IFQsXHJcbik6IFQgPT4gZGF0YTtcclxuXHJcbmV4cG9ydCBjb25zdCBQbGF5ZXJBbmltYXRpb25zID0gcGxheWVyQW5pbWF0aW9ucyh7XHJcblx0Ly9pbWFnZSwgbWlsbGlzZWNvbmRzIHRvIGRpc3BsYXkgZm9yXHJcblx0aWRsZTogW1xyXG5cdFx0W25ldyBSZWZsZWN0YWJsZUltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy9wbGF5ZXIvc25vd21hbmlkbGUxLnBuZycpLCAxMzVdLC8vaWdub3JlIHRoZSBhdHJvY2lvdXMgbmFtaW5nIHNjaGVtZSBvZiB0aGVzZSBpbWFnZXNcclxuXHRcdFtuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvcGxheWVyL3Nub3dtYW5pZGxlMi5wbmcnKSwgMTM1XSxcclxuXHRcdFtuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvcGxheWVyL3Nub3dtYW5pZGxlMy5wbmcnKSwgMTM1XSxcclxuXHRcdFtuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvcGxheWVyL3Nub3dtYW5pZGxlNC5wbmcnKSwgMTM1XSxcclxuXHRcdFtuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvcGxheWVyL3Nub3dtYW5pZGxlNS5wbmcnKSwgMTM1XSxcclxuXHRcdFtuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvcGxheWVyL3Nub3dtYW5pZGxlNi5wbmcnKSwgMTM1XSxcclxuXHRcdFtuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvcGxheWVyL3Nub3dtYW5pZGxlNy5wbmcnKSwgMTM1XSxcclxuXHRcdFtuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvcGxheWVyL3Nub3dtYW5pZGxlOC5wbmcnKSwgMTM1XSxcclxuXHRdLFxyXG5cdGlkbGVsZWZ0OiBbXHJcblx0XHRbbmV3IFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3BsYXllci9zbm93bWFuaWRsZWZsaXBwZWQxLnBuZycpLCAxMzVdLFxyXG5cdFx0W25ldyBSZWZsZWN0YWJsZUltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy9wbGF5ZXIvc25vd21hbmlkbGVmbGlwcGVkMi5wbmcnKSwgMTM1XSxcclxuXHRcdFtuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvcGxheWVyL3Nub3dtYW5pZGxlZmxpcHBlZDMucG5nJyksIDEzNV0sXHJcblx0XHRbbmV3IFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3BsYXllci9zbm93bWFuaWRsZWZsaXBwZWQ0LnBuZycpLCAxMzVdLFxyXG5cdFx0W25ldyBSZWZsZWN0YWJsZUltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy9wbGF5ZXIvc25vd21hbmlkbGVmbGlwcGVkNS5wbmcnKSwgMTM1XSxcclxuXHRcdFtuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvcGxheWVyL3Nub3dtYW5pZGxlZmxpcHBlZDYucG5nJyksIDEzNV0sXHJcblx0XHRbbmV3IFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3BsYXllci9zbm93bWFuaWRsZWZsaXBwZWQ3LnBuZycpLCAxMzVdLFxyXG5cdFx0W25ldyBSZWZsZWN0YWJsZUltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy9wbGF5ZXIvc25vd21hbmlkbGVmbGlwcGVkOC5wbmcnKSwgMTM1XSxcclxuXHRdLFxyXG5cdHdhbGs6IFtcclxuXHRcdFtuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvcGxheWVyL3Nub3dtYW5yb2xsMDEucG5nJyksIDc1XSxcclxuXHRcdFtuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvcGxheWVyL3Nub3dtYW5yb2xsMDIucG5nJyksIDc1XSxcclxuXHRcdFtuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvcGxheWVyL3Nub3dtYW5yb2xsMDMucG5nJyksIDc1XSxcclxuXHRcdFtuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvcGxheWVyL3Nub3dtYW5yb2xsMDQucG5nJyksIDc1XSxcclxuXHRcdFtuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvcGxheWVyL3Nub3dtYW5yb2xsMDUucG5nJyksIDc1XSxcclxuXHRcdFtuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvcGxheWVyL3Nub3dtYW5yb2xsMDYucG5nJyksIDc1XSxcclxuXHRcdFtuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvcGxheWVyL3Nub3dtYW5yb2xsMDcucG5nJyksIDc1XSxcclxuXHRcdFtuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvcGxheWVyL3Nub3dtYW5yb2xsMDgucG5nJyksIDc1XSxcclxuXHRdLFxyXG5cdHdhbGtsZWZ0OiBbXHJcblx0XHRbbmV3IFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3BsYXllci9zbm93bWFucm9sbGxlZnQwMS5wbmcnKSwgNzVdLFxyXG5cdFx0W25ldyBSZWZsZWN0YWJsZUltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy9wbGF5ZXIvc25vd21hbnJvbGxsZWZ0MDIucG5nJyksIDc1XSxcclxuXHRcdFtuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvcGxheWVyL3Nub3dtYW5yb2xsbGVmdDAzLnBuZycpLCA3NV0sXHJcblx0XHRbbmV3IFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3BsYXllci9zbm93bWFucm9sbGxlZnQwNC5wbmcnKSwgNzVdLFxyXG5cdFx0W25ldyBSZWZsZWN0YWJsZUltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy9wbGF5ZXIvc25vd21hbnJvbGxsZWZ0MDUucG5nJyksIDc1XSxcclxuXHRcdFtuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvcGxheWVyL3Nub3dtYW5yb2xsbGVmdDA2LnBuZycpLCA3NV0sXHJcblx0XHRbbmV3IFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3BsYXllci9zbm93bWFucm9sbGxlZnQwNy5wbmcnKSwgNzVdLFxyXG5cdFx0W25ldyBSZWZsZWN0YWJsZUltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy9wbGF5ZXIvc25vd21hbnJvbGxsZWZ0MDgucG5nJyksIDc1XSxcclxuXHRdLFxyXG59KTtcclxuXHJcbi8vIEl0ZW0gcmVsYXRlZCBhc3NldHNcclxuZXhwb3J0IGNvbnN0IEl0ZW1Bc3NldHM6IFJlY29yZDxJdGVtVHlwZSwgSW1hZ2VSZXNvdXJjZT4gPSB7XHJcblx0W0l0ZW1UeXBlLlNub3dCbG9ja106IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9ibG9ja19zbm93LnBuZycsXHJcblx0KSxcclxuXHRbSXRlbVR5cGUuSWNlQmxvY2tdOiBuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdCdhc3NldHMvdGV4dHVyZXMvaXRlbXMvYmxvY2tfaWNlLnBuZycsXHJcblx0KSxcclxuXHRbSXRlbVR5cGUuRGlydEJsb2NrXTogbmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHQnYXNzZXRzL3RleHR1cmVzL2l0ZW1zL2Jsb2NrX2RpcnQucG5nJyxcclxuXHQpLFxyXG5cdFtJdGVtVHlwZS5TdG9uZTBCbG9ja106IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9ibG9ja19zdG9uZTAucG5nJyxcclxuXHQpLFxyXG5cdFtJdGVtVHlwZS5TdG9uZTFCbG9ja106IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9ibG9ja19zdG9uZTEucG5nJyxcclxuXHQpLFxyXG5cdFtJdGVtVHlwZS5TdG9uZTJCbG9ja106IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9ibG9ja19zdG9uZTIucG5nJyxcclxuXHQpLFxyXG5cdFtJdGVtVHlwZS5TdG9uZTNCbG9ja106IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9ibG9ja19zdG9uZTMucG5nJyxcclxuXHQpLFxyXG5cdFtJdGVtVHlwZS5TdG9uZTRCbG9ja106IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9ibG9ja19zdG9uZTQucG5nJyxcclxuXHQpLFxyXG5cdFtJdGVtVHlwZS5TdG9uZTVCbG9ja106IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9ibG9ja19zdG9uZTUucG5nJyxcclxuXHQpLFxyXG5cdFtJdGVtVHlwZS5TdG9uZTZCbG9ja106IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9ibG9ja19zdG9uZTYucG5nJyxcclxuXHQpLFxyXG5cdFtJdGVtVHlwZS5TdG9uZTdCbG9ja106IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9ibG9ja19zdG9uZTcucG5nJyxcclxuXHQpLFxyXG5cdFtJdGVtVHlwZS5TdG9uZThCbG9ja106IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9ibG9ja19zdG9uZTgucG5nJyxcclxuXHQpLFxyXG5cdFtJdGVtVHlwZS5TdG9uZTlCbG9ja106IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9ibG9ja19zdG9uZTkucG5nJyxcclxuXHQpLFxyXG5cdFtJdGVtVHlwZS5UaW5CbG9ja106IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9ibG9ja190aW4ucG5nJyxcclxuXHQpLFxyXG5cdFtJdGVtVHlwZS5BbHVtaW51bUJsb2NrXTogbmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHQnYXNzZXRzL3RleHR1cmVzL2l0ZW1zL2Jsb2NrX2FsdW1pbnVtLnBuZycsXHJcblx0KSxcclxuXHRbSXRlbVR5cGUuR29sZEJsb2NrXTogbmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHQnYXNzZXRzL3RleHR1cmVzL2l0ZW1zL2Jsb2NrX2dvbGQucG5nJyxcclxuXHQpLFxyXG5cdFtJdGVtVHlwZS5UaXRhbml1bUJsb2NrXTogbmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHQnYXNzZXRzL3RleHR1cmVzL2l0ZW1zL2Jsb2NrX3RpdGFuaXVtLnBuZycsXHJcblx0KSxcclxuXHRbSXRlbVR5cGUuR3JhcGVCbG9ja106IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9ibG9ja19ncmFwZS5wbmcnLFxyXG5cdCksXHJcblx0W0l0ZW1UeXBlLldvb2QwQmxvY2tdOiBuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdCdhc3NldHMvdGV4dHVyZXMvaXRlbXMvYmxvY2tfd29vZDAucG5nJyxcclxuXHQpLFxyXG5cdFtJdGVtVHlwZS5Xb29kMUJsb2NrXTogbmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHQnYXNzZXRzL3RleHR1cmVzL2l0ZW1zL2Jsb2NrX3dvb2QxLnBuZycsXHJcblx0KSxcclxuXHRbSXRlbVR5cGUuV29vZDJCbG9ja106IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9ibG9ja193b29kMi5wbmcnLFxyXG5cdCksXHJcblx0W0l0ZW1UeXBlLldvb2QzQmxvY2tdOiBuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdCdhc3NldHMvdGV4dHVyZXMvaXRlbXMvYmxvY2tfd29vZDMucG5nJyxcclxuXHQpLFxyXG5cdFtJdGVtVHlwZS5Xb29kNEJsb2NrXTogbmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHQnYXNzZXRzL3RleHR1cmVzL2l0ZW1zL2Jsb2NrX3dvb2Q0LnBuZycsXHJcblx0KSxcclxuXHRbSXRlbVR5cGUuV29vZDVCbG9ja106IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9ibG9ja193b29kNS5wbmcnLFxyXG5cdCksXHJcblx0W0l0ZW1UeXBlLldvb2Q2QmxvY2tdOiBuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdCdhc3NldHMvdGV4dHVyZXMvaXRlbXMvYmxvY2tfd29vZDYucG5nJyxcclxuXHQpLFxyXG5cdFtJdGVtVHlwZS5Xb29kN0Jsb2NrXTogbmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHQnYXNzZXRzL3RleHR1cmVzL2l0ZW1zL2Jsb2NrX3dvb2Q3LnBuZycsXHJcblx0KSxcclxuXHRbSXRlbVR5cGUuV29vZDhCbG9ja106IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9ibG9ja193b29kOC5wbmcnLFxyXG5cdCksXHJcblx0W0l0ZW1UeXBlLldvb2Q5QmxvY2tdOiBuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdCdhc3NldHMvdGV4dHVyZXMvaXRlbXMvYmxvY2tfd29vZDkucG5nJyxcclxuXHQpLFxyXG5cdFtJdGVtVHlwZS5TZWVkXTogbmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHQnYXNzZXRzL3RleHR1cmVzL2l0ZW1zL3NlZWQucG5nJyxcclxuXHQpLFxyXG59O1xyXG5cclxuLy8gVWkgcmVsYXRlZCBhc3NldHNcclxuZXhwb3J0IGNvbnN0IFVpQXNzZXRzID0ge1xyXG5cdHVpX3Nsb3Rfc2VsZWN0ZWQ6IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy91aS91aXNsb3Rfc2VsZWN0ZWQucG5nJyxcclxuXHQpLFxyXG5cdHVpX3Nsb3Q6IG5ldyBJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvdWkvdWlzbG90LnBuZycpLFxyXG5cdHVpX2ZyYW1lOiBuZXcgSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3VpL3VpZnJhbWUucG5nJyksXHJcblx0YnV0dG9uX3Vuc2VsZWN0ZWQ6IG5ldyBJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvdWkvYnV0dG9uMC5wbmcnKSxcclxuXHRidXR0b25fc2VsZWN0ZWQ6IG5ldyBJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvdWkvYnV0dG9uMS5wbmcnKSxcclxuXHRzbGlkZXJfYmFyOiBuZXcgSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3VpL3NsaWRlckJhci5wbmcnKSxcclxuXHRzbGlkZXJfaGFuZGxlOiBuZXcgSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3VpL3NsaWRlckhhbmRsZS5wbmcnKSxcclxuXHR0aXRsZV9pbWFnZTogbmV3IEltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy91aS9zbm93ZWRpbkJVTVAucG5nJyksXHJcblx0dmlnbmV0dGU6IG5ldyBJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvdWkvdmlnbmV0dGUtZXhwb3J0LnBuZycpLFxyXG5cdHNlbGVjdGVkX3RpbGU6IG5ldyBJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvdWkvc2VsZWN0ZWR0aWxlLnBuZycpLFxyXG59O1xyXG5cclxuLy8gV29ybGQgcmVsYXRlZCBhc3NldHNcclxuZXhwb3J0IGNvbnN0IFdvcmxkQXNzZXRzID0ge1xyXG5cdHNoYWRlclJlc291cmNlczoge1xyXG5cdFx0c2t5SW1hZ2U6IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3NoYWRlcl9yZXNvdXJjZXMvcG9pc3NvbnNub3cucG5nJyxcclxuXHRcdCksXHJcblx0fSxcclxuXHRtaWRkbGVncm91bmQ6IHtcclxuXHRcdHRpbGVzZXRfaWNlOiBuZXcgVGlsZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL21pZGRsZWdyb3VuZC90aWxlc2V0X2ljZS5wbmcnLFxyXG5cdFx0XHQxNixcclxuXHRcdFx0MSxcclxuXHRcdFx0OCxcclxuXHRcdFx0OCxcclxuXHRcdCksXHJcblx0XHR0aWxlc2V0X3Nub3c6IG5ldyBUaWxlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvbWlkZGxlZ3JvdW5kL3RpbGVzZXRfc25vdy5wbmcnLFxyXG5cdFx0XHQxNixcclxuXHRcdFx0MSxcclxuXHRcdFx0OCxcclxuXHRcdFx0OCxcclxuXHRcdCksXHJcblx0XHR0aWxlc2V0X2RpcnQ6IG5ldyBUaWxlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvbWlkZGxlZ3JvdW5kL3RpbGVzZXRfZGlydDAucG5nJyxcclxuXHRcdFx0MTYsXHJcblx0XHRcdDEsXHJcblx0XHRcdDgsXHJcblx0XHRcdDgsXHJcblx0XHQpLFxyXG5cdFx0dGlsZXNldF9zdG9uZTA6IG5ldyBUaWxlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvbWlkZGxlZ3JvdW5kL3RpbGVzZXRfc3RvbmUwLnBuZycsXHJcblx0XHRcdDE2LFxyXG5cdFx0XHQxLFxyXG5cdFx0XHQ4LFxyXG5cdFx0XHQ4LFxyXG5cdFx0KSxcclxuXHRcdHRpbGVzZXRfc3RvbmUxOiBuZXcgVGlsZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL21pZGRsZWdyb3VuZC90aWxlc2V0X3N0b25lMS5wbmcnLFxyXG5cdFx0XHQxNixcclxuXHRcdFx0MSxcclxuXHRcdFx0OCxcclxuXHRcdFx0OCxcclxuXHRcdCksXHJcblx0XHR0aWxlc2V0X3N0b25lMjogbmV3IFRpbGVSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9taWRkbGVncm91bmQvdGlsZXNldF9zdG9uZTIucG5nJyxcclxuXHRcdFx0MTYsXHJcblx0XHRcdDEsXHJcblx0XHRcdDgsXHJcblx0XHRcdDgsXHJcblx0XHQpLFxyXG5cdFx0dGlsZXNldF9zdG9uZTM6IG5ldyBUaWxlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvbWlkZGxlZ3JvdW5kL3RpbGVzZXRfc3RvbmUzLnBuZycsXHJcblx0XHRcdDE2LFxyXG5cdFx0XHQxLFxyXG5cdFx0XHQ4LFxyXG5cdFx0XHQ4LFxyXG5cdFx0KSxcclxuXHRcdHRpbGVzZXRfc3RvbmU0OiBuZXcgVGlsZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL21pZGRsZWdyb3VuZC90aWxlc2V0X3N0b25lNC5wbmcnLFxyXG5cdFx0XHQxNixcclxuXHRcdFx0MSxcclxuXHRcdFx0OCxcclxuXHRcdFx0OCxcclxuXHRcdCksXHJcblx0XHR0aWxlc2V0X3N0b25lNTogbmV3IFRpbGVSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9taWRkbGVncm91bmQvdGlsZXNldF9zdG9uZTUucG5nJyxcclxuXHRcdFx0MTYsXHJcblx0XHRcdDEsXHJcblx0XHRcdDgsXHJcblx0XHRcdDgsXHJcblx0XHQpLFxyXG5cdFx0dGlsZXNldF9zdG9uZTY6IG5ldyBUaWxlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvbWlkZGxlZ3JvdW5kL3RpbGVzZXRfc3RvbmU2LnBuZycsXHJcblx0XHRcdDE2LFxyXG5cdFx0XHQxLFxyXG5cdFx0XHQ4LFxyXG5cdFx0XHQ4LFxyXG5cdFx0KSxcclxuXHRcdHRpbGVzZXRfc3RvbmU3OiBuZXcgVGlsZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL21pZGRsZWdyb3VuZC90aWxlc2V0X3N0b25lNy5wbmcnLFxyXG5cdFx0XHQxNixcclxuXHRcdFx0MSxcclxuXHRcdFx0OCxcclxuXHRcdFx0OCxcclxuXHRcdCksXHJcblx0XHR0aWxlc2V0X3N0b25lODogbmV3IFRpbGVSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9taWRkbGVncm91bmQvdGlsZXNldF9zdG9uZTgucG5nJyxcclxuXHRcdFx0MTYsXHJcblx0XHRcdDEsXHJcblx0XHRcdDgsXHJcblx0XHRcdDgsXHJcblx0XHQpLFxyXG5cdFx0dGlsZXNldF9zdG9uZTk6IG5ldyBUaWxlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvbWlkZGxlZ3JvdW5kL3RpbGVzZXRfc3RvbmU5LnBuZycsXHJcblx0XHRcdDE2LFxyXG5cdFx0XHQxLFxyXG5cdFx0XHQ4LFxyXG5cdFx0XHQ4LFxyXG5cdFx0KSxcclxuXHRcdHRpbGVzZXRfdGluOiBuZXcgVGlsZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL21pZGRsZWdyb3VuZC90aWxlc2V0X3Rpbi5wbmcnLFxyXG5cdFx0XHQxNixcclxuXHRcdFx0MSxcclxuXHRcdFx0OCxcclxuXHRcdFx0OCxcclxuXHRcdCksXHJcblx0XHR0aWxlc2V0X2FsdW1pbnVtOiBuZXcgVGlsZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL21pZGRsZWdyb3VuZC90aWxlc2V0X2FsdW1pbnVtLnBuZycsXHJcblx0XHRcdDE2LFxyXG5cdFx0XHQxLFxyXG5cdFx0XHQ4LFxyXG5cdFx0XHQ4LFxyXG5cdFx0KSxcclxuXHRcdHRpbGVzZXRfZ29sZDogbmV3IFRpbGVSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9taWRkbGVncm91bmQvdGlsZXNldF9nb2xkLnBuZycsXHJcblx0XHRcdDE2LFxyXG5cdFx0XHQxLFxyXG5cdFx0XHQ4LFxyXG5cdFx0XHQ4LFxyXG5cdFx0KSxcclxuXHRcdHRpbGVzZXRfdGl0YW5pdW06IG5ldyBUaWxlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvbWlkZGxlZ3JvdW5kL3RpbGVzZXRfdGl0YW5pdW0ucG5nJyxcclxuXHRcdFx0MTYsXHJcblx0XHRcdDEsXHJcblx0XHRcdDgsXHJcblx0XHRcdDgsXHJcblx0XHQpLFxyXG5cdFx0dGlsZXNldF9ncmFwZTogbmV3IFRpbGVSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9taWRkbGVncm91bmQvdGlsZXNldF9ncmFwZS5wbmcnLFxyXG5cdFx0XHQxNixcclxuXHRcdFx0MSxcclxuXHRcdFx0OCxcclxuXHRcdFx0OCxcclxuXHRcdCksXHJcblx0XHR0aWxlc2V0X3dvb2QwOiBuZXcgVGlsZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL21pZGRsZWdyb3VuZC90aWxlc2V0X3dvb2QwLnBuZycsXHJcblx0XHRcdDE2LFxyXG5cdFx0XHQxLFxyXG5cdFx0XHQ4LFxyXG5cdFx0XHQ4LFxyXG5cdFx0KSxcclxuXHRcdHRpbGVzZXRfd29vZDE6IG5ldyBUaWxlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvbWlkZGxlZ3JvdW5kL3RpbGVzZXRfd29vZDEucG5nJyxcclxuXHRcdFx0MTYsXHJcblx0XHRcdDEsXHJcblx0XHRcdDgsXHJcblx0XHRcdDgsXHJcblx0XHQpLFxyXG5cdFx0dGlsZXNldF93b29kMjogbmV3IFRpbGVSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9taWRkbGVncm91bmQvdGlsZXNldF93b29kMi5wbmcnLFxyXG5cdFx0XHQxNixcclxuXHRcdFx0MSxcclxuXHRcdFx0OCxcclxuXHRcdFx0OCxcclxuXHRcdCksXHJcblx0XHR0aWxlc2V0X3dvb2QzOiBuZXcgVGlsZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL21pZGRsZWdyb3VuZC90aWxlc2V0X3dvb2QzLnBuZycsXHJcblx0XHRcdDE2LFxyXG5cdFx0XHQxLFxyXG5cdFx0XHQ4LFxyXG5cdFx0XHQ4LFxyXG5cdFx0KSxcclxuXHRcdHRpbGVzZXRfd29vZDQ6IG5ldyBUaWxlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvbWlkZGxlZ3JvdW5kL3RpbGVzZXRfd29vZDQucG5nJyxcclxuXHRcdFx0MTYsXHJcblx0XHRcdDEsXHJcblx0XHRcdDgsXHJcblx0XHRcdDgsXHJcblx0XHQpLFxyXG5cdFx0dGlsZXNldF93b29kNTogbmV3IFRpbGVSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9taWRkbGVncm91bmQvdGlsZXNldF93b29kNS5wbmcnLFxyXG5cdFx0XHQxNixcclxuXHRcdFx0MSxcclxuXHRcdFx0OCxcclxuXHRcdFx0OCxcclxuXHRcdCksXHJcblx0XHR0aWxlc2V0X3dvb2Q2OiBuZXcgVGlsZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL21pZGRsZWdyb3VuZC90aWxlc2V0X3dvb2Q2LnBuZycsXHJcblx0XHRcdDE2LFxyXG5cdFx0XHQxLFxyXG5cdFx0XHQ4LFxyXG5cdFx0XHQ4LFxyXG5cdFx0KSxcclxuXHRcdHRpbGVzZXRfd29vZDc6IG5ldyBUaWxlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvbWlkZGxlZ3JvdW5kL3RpbGVzZXRfd29vZDcucG5nJyxcclxuXHRcdFx0MTYsXHJcblx0XHRcdDEsXHJcblx0XHRcdDgsXHJcblx0XHRcdDgsXHJcblx0XHQpLFxyXG5cdFx0dGlsZXNldF93b29kODogbmV3IFRpbGVSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9taWRkbGVncm91bmQvdGlsZXNldF93b29kOC5wbmcnLFxyXG5cdFx0XHQxNixcclxuXHRcdFx0MSxcclxuXHRcdFx0OCxcclxuXHRcdFx0OCxcclxuXHRcdCksXHJcblx0XHR0aWxlc2V0X3dvb2Q5OiBuZXcgVGlsZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL21pZGRsZWdyb3VuZC90aWxlc2V0X3dvb2Q5LnBuZycsXHJcblx0XHRcdDE2LFxyXG5cdFx0XHQxLFxyXG5cdFx0XHQ4LFxyXG5cdFx0XHQ4LFxyXG5cdFx0KSxcclxuXHR9LFxyXG5cdGZvcmVncm91bmQ6IHtcclxuXHRcdFxyXG5cdH0sXHJcblx0dGlsZUVudGl0aWVzOiBbXHJcblx0XHRbLy90cmVlXHJcblx0XHRuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL3RpbGVFbnRpdGllcy90cmVlcy9UcmVlMS5wbmcnLFxyXG5cdFx0KSxcclxuXHRcdG5ldyBSZWZsZWN0YWJsZUltYWdlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvdGlsZUVudGl0aWVzL3RyZWVzL1RyZWUyLnBuZycsXHJcblx0XHQpLFxyXG5cdFx0bmV3IFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC90aWxlRW50aXRpZXMvdHJlZXMvVHJlZTMucG5nJyxcclxuXHRcdCksXHJcblx0XHRuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL3RpbGVFbnRpdGllcy90cmVlcy9UcmVlNC5wbmcnLFxyXG5cdFx0KSxcclxuXHRcdG5ldyBSZWZsZWN0YWJsZUltYWdlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvdGlsZUVudGl0aWVzL3RyZWVzL1RyZWU1LnBuZycsXHJcblx0XHQpLFxyXG5cdFx0bmV3IFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC90aWxlRW50aXRpZXMvdHJlZXMvVHJlZTYucG5nJyxcclxuXHRcdCksXHJcblx0XHRuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL3RpbGVFbnRpdGllcy90cmVlcy9UcmVlNy5wbmcnLFxyXG5cdFx0KSxcclxuXHRcdG5ldyBSZWZsZWN0YWJsZUltYWdlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvdGlsZUVudGl0aWVzL3RyZWVzL1RyZWU4LnBuZycsXHJcblx0XHQpLFxyXG5cdFx0bmV3IFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC90aWxlRW50aXRpZXMvdHJlZXMvVHJlZTkucG5nJyxcclxuXHRcdCksXHJcblx0XHRuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL3RpbGVFbnRpdGllcy90cmVlcy9UcmVlMTAucG5nJyxcclxuXHRcdCksXHJcblx0XHRdLFxyXG5cdFx0Wy8vZHJpbGwgdGllciAxXHJcblx0XHRuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL3RpbGVFbnRpdGllcy9SdXN0eSBEcmlsbC9SdXN0eURyaWxsMS5wbmcnLFxyXG5cdFx0KSxcclxuXHRcdG5ldyBSZWZsZWN0YWJsZUltYWdlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvdGlsZUVudGl0aWVzL1J1c3R5IERyaWxsL1J1c3R5RHJpbGwyLnBuZycsXHJcblx0XHQpLFxyXG5cdFx0bmV3IFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC90aWxlRW50aXRpZXMvUnVzdHkgRHJpbGwvUnVzdHlEcmlsbDMucG5nJyxcclxuXHRcdCksXHJcblx0XHRuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL3RpbGVFbnRpdGllcy9SdXN0eSBEcmlsbC9SdXN0eURyaWxsNC5wbmcnLFxyXG5cdFx0KSxcclxuXHRcdG5ldyBSZWZsZWN0YWJsZUltYWdlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvdGlsZUVudGl0aWVzL1J1c3R5IERyaWxsL1J1c3R5RHJpbGw1LnBuZycsXHJcblx0XHQpLFxyXG5cdFx0bmV3IFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC90aWxlRW50aXRpZXMvUnVzdHkgRHJpbGwvUnVzdHlEcmlsbDYucG5nJyxcclxuXHRcdCksXHJcblx0XHRuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL3RpbGVFbnRpdGllcy9SdXN0eSBEcmlsbC9SdXN0eURyaWxsNy5wbmcnLFxyXG5cdFx0KSxcclxuXHRcdG5ldyBSZWZsZWN0YWJsZUltYWdlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvdGlsZUVudGl0aWVzL1J1c3R5IERyaWxsL1J1c3R5RHJpbGw4LnBuZycsXHJcblx0XHQpLFxyXG5cdFx0bmV3IFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC90aWxlRW50aXRpZXMvUnVzdHkgRHJpbGwvUnVzdHlEcmlsbDkucG5nJyxcclxuXHRcdCksXHJcblx0XHRuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL3RpbGVFbnRpdGllcy9SdXN0eSBEcmlsbC9SdXN0eURyaWxsMTAucG5nJyxcclxuXHRcdCksXHJcblx0XHRuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL3RpbGVFbnRpdGllcy9SdXN0eSBEcmlsbC9SdXN0eURyaWxsMTEucG5nJyxcclxuXHRcdCksXHJcblx0XHRuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL3RpbGVFbnRpdGllcy9SdXN0eSBEcmlsbC9SdXN0eURyaWxsMTIucG5nJyxcclxuXHRcdCksXHJcblx0XHRuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL3RpbGVFbnRpdGllcy9SdXN0eSBEcmlsbC9SdXN0eURyaWxsMTMucG5nJyxcclxuXHRcdCksXHJcblx0XHRdLFxyXG5cdFx0Wy8vZHJpbGwgdGllciAyXHJcblx0XHJcblx0XHRdLFxyXG5cdFx0Wy8vZHJpbGwgdGllciAzXHJcblx0XHJcblx0XHRdLFxyXG5cdFx0Wy8vZHJpbGwgdGllciA0XHJcblx0XHJcblx0XHRdLFxyXG5cdFx0Wy8vZHJpbGwgdGllciA1XHJcblx0XHJcblx0XHRdLFxyXG5cdFx0Wy8vY3JhZnRpbmcgYmVuY2hcclxuXHRcdG5ldyBSZWZsZWN0YWJsZUltYWdlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvdGlsZUVudGl0aWVzL21pc2MvY3JhZnRpbmdCZW5jaC5wbmcnLFxyXG5cdFx0KSxcclxuXHRcdF0sXHJcblx0XHRbLy9zYXBsaW5nL3NlZWRcclxuXHRcdG5ldyBSZWZsZWN0YWJsZUltYWdlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvdGlsZUVudGl0aWVzL3RyZWVzL3NhcGxpbmcucG5nJyxcclxuXHRcdCksXHJcblx0XHRdXHJcblx0XSxcclxuXHRlbnRpdGllczogW1xyXG5cdFx0W1xyXG5cdFx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUwMS5wbmcnLFxyXG5cdFx0XHQpLFxyXG5cdFx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUwMi5wbmcnLFxyXG5cdFx0XHQpLFxyXG5cdFx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUwMy5wbmcnLFxyXG5cdFx0XHQpLFxyXG5cdFx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUwNC5wbmcnLFxyXG5cdFx0XHQpLFxyXG5cdFx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUwNS5wbmcnLFxyXG5cdFx0XHQpLFxyXG5cdFx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUwNi5wbmcnLFxyXG5cdFx0XHQpLFxyXG5cdFx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUwNy5wbmcnLFxyXG5cdFx0XHQpLFxyXG5cdFx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUwOC5wbmcnLFxyXG5cdFx0XHQpLFxyXG5cdFx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUwOS5wbmcnLFxyXG5cdFx0XHQpLFxyXG5cdFx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUxMC5wbmcnLFxyXG5cdFx0XHQpLFxyXG5cdFx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUxMS5wbmcnLFxyXG5cdFx0XHQpLFxyXG5cdFx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUxMi5wbmcnLFxyXG5cdFx0XHQpLFxyXG5cdFx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUxMy5wbmcnLFxyXG5cdFx0XHQpLFxyXG5cdFx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUxNC5wbmcnLFxyXG5cdFx0XHQpLFxyXG5cdFx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUxNS5wbmcnLFxyXG5cdFx0XHQpLFxyXG5cdFx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUxNi5wbmcnLFxyXG5cdFx0XHQpLFxyXG5cdFx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUxNy5wbmcnLFxyXG5cdFx0XHQpLFxyXG5cdFx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUxOC5wbmcnLFxyXG5cdFx0XHQpLFxyXG5cdFx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUxOS5wbmcnLFxyXG5cdFx0XHQpLFxyXG5cdFx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUyMC5wbmcnLFxyXG5cdFx0XHQpLFxyXG5cdFx0XSxcclxuXHRdLFxyXG5cclxuXHRjbG91ZHM6IFtcclxuXHRcdG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL0Nsb3Vkcy9jbG91ZDEucG5nJyxcclxuXHRcdCksXHJcblx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9lbnRpdGllcy9DbG91ZHMvY2xvdWQyLnBuZycsXHJcblx0XHQpLFxyXG5cdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvZW50aXRpZXMvQ2xvdWRzL2Nsb3VkMy5wbmcnLFxyXG5cdFx0KSxcclxuXHRcdG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL0Nsb3Vkcy9jbG91ZDQucG5nJyxcclxuXHRcdCksXHJcblx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9lbnRpdGllcy9DbG91ZHMvY2xvdWQ1LnBuZycsXHJcblx0XHQpLFxyXG5cdF19XHJcblxyXG5cdFxyXG5cclxuZXhwb3J0IGNvbnN0IEZvbnRzID0ge1xyXG5cdHRpdGxlOiBuZXcgRm9udFJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy91aS9mb250LnBuZycsXHJcblx0XHR7XHJcblx0XHRcdCcwJzogNyxcclxuXHRcdFx0JzEnOiA3LFxyXG5cdFx0XHQnMic6IDcsXHJcblx0XHRcdCczJzogNixcclxuXHRcdFx0JzQnOiA2LFxyXG5cdFx0XHQnNSc6IDYsXHJcblx0XHRcdCc2JzogNixcclxuXHRcdFx0JzcnOiA3LFxyXG5cdFx0XHQnOCc6IDcsXHJcblx0XHRcdCc5JzogNixcclxuXHRcdFx0J0EnOiA2LFxyXG5cdFx0XHQnQic6IDcsXHJcblx0XHRcdCdDJzogNyxcclxuXHRcdFx0J0QnOiA2LFxyXG5cdFx0XHQnRSc6IDcsXHJcblx0XHRcdCdGJzogNixcclxuXHRcdFx0J0cnOiA3LFxyXG5cdFx0XHQnSCc6IDcsXHJcblx0XHRcdCdJJzogNyxcclxuXHRcdFx0J0onOiA4LFxyXG5cdFx0XHQnSyc6IDYsXHJcblx0XHRcdCdMJzogNixcclxuXHRcdFx0J00nOiA4LFxyXG5cdFx0XHQnTic6IDgsXHJcblx0XHRcdCdPJzogOCxcclxuXHRcdFx0J1AnOiA5LFxyXG5cdFx0XHQnUSc6IDgsXHJcblx0XHRcdCdSJzogNyxcclxuXHRcdFx0J1MnOiA3LFxyXG5cdFx0XHQnVCc6IDgsXHJcblx0XHRcdCdVJzogOCxcclxuXHRcdFx0J1YnOiA4LFxyXG5cdFx0XHQnVyc6IDEwLFxyXG5cdFx0XHQnWCc6IDgsXHJcblx0XHRcdCdZJzogOCxcclxuXHRcdFx0J1onOiA5LFxyXG5cdFx0XHQnYSc6IDcsXHJcblx0XHRcdCdiJzogNyxcclxuXHRcdFx0J2MnOiA2LFxyXG5cdFx0XHQnZCc6IDcsXHJcblx0XHRcdCdlJzogNixcclxuXHRcdFx0J2YnOiA2LFxyXG5cdFx0XHQnZyc6IDYsXHJcblx0XHRcdCdoJzogNixcclxuXHRcdFx0J2knOiA1LFxyXG5cdFx0XHQnaic6IDYsXHJcblx0XHRcdCdrJzogNSxcclxuXHRcdFx0J2wnOiA1LFxyXG5cdFx0XHQnbSc6IDgsXHJcblx0XHRcdCduJzogNSxcclxuXHRcdFx0J28nOiA1LFxyXG5cdFx0XHQncCc6IDUsXHJcblx0XHRcdCdxJzogNyxcclxuXHRcdFx0J3InOiA1LFxyXG5cdFx0XHQncyc6IDQsXHJcblx0XHRcdCd0JzogNSxcclxuXHRcdFx0J3UnOiA1LFxyXG5cdFx0XHQndic6IDUsXHJcblx0XHRcdCd3JzogNyxcclxuXHRcdFx0J3gnOiA2LFxyXG5cdFx0XHQneSc6IDUsXHJcblx0XHRcdCd6JzogNSxcclxuXHRcdFx0JyEnOiA0LFxyXG5cdFx0XHQnLic6IDIsXHJcblx0XHRcdCcsJzogMixcclxuXHRcdFx0Jz8nOiA2LFxyXG5cdFx0XHQnXyc6IDYsXHJcblx0XHRcdCctJzogNCxcclxuXHRcdFx0JzonOiAyLFxyXG5cdFx0XHQn4oaRJzogNyxcclxuXHRcdFx0J+KGkyc6IDcsXHJcblx0XHRcdCcgJzogMixcclxuXHRcdH0sXHJcblx0XHQnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkhLiw/Xy064oaR4oaTICcsXHJcblx0XHQxMixcclxuXHQpLFxyXG5cclxuXHRiaWc6IG5ldyBGb250UmVzb3VyY2UoXHJcblx0XHQnYXNzZXRzL3RleHR1cmVzL3VpL2ZvbnRCaWcucG5nJyxcclxuXHRcdHtcclxuXHRcdFx0JzAnOiAxNSxcclxuXHRcdFx0JzEnOiAxNCxcclxuXHRcdFx0JzInOiAxNCxcclxuXHRcdFx0JzMnOiAxMyxcclxuXHRcdFx0JzQnOiAxMixcclxuXHRcdFx0JzUnOiAxMyxcclxuXHRcdFx0JzYnOiAxMixcclxuXHRcdFx0JzcnOiAxNCxcclxuXHRcdFx0JzgnOiAxNSxcclxuXHRcdFx0JzknOiAxMixcclxuXHRcdFx0J0EnOiAxMyxcclxuXHRcdFx0J0InOiAxNCxcclxuXHRcdFx0J0MnOiAxNSxcclxuXHRcdFx0J0QnOiAxMixcclxuXHRcdFx0J0UnOiAxNCxcclxuXHRcdFx0J0YnOiAxMyxcclxuXHRcdFx0J0cnOiAxNCxcclxuXHRcdFx0J0gnOiAxNSxcclxuXHRcdFx0J0knOiAxNSxcclxuXHRcdFx0J0onOiAxNixcclxuXHRcdFx0J0snOiAxMixcclxuXHRcdFx0J0wnOiAxMyxcclxuXHRcdFx0J00nOiAxNixcclxuXHRcdFx0J04nOiAxNyxcclxuXHRcdFx0J08nOiAxNyxcclxuXHRcdFx0J1AnOiAxOSxcclxuXHRcdFx0J1EnOiAxNyxcclxuXHRcdFx0J1InOiAxNCxcclxuXHRcdFx0J1MnOiAxNSxcclxuXHRcdFx0J1QnOiAxNyxcclxuXHRcdFx0J1UnOiAxNixcclxuXHRcdFx0J1YnOiAxNyxcclxuXHRcdFx0J1cnOiAyMSxcclxuXHRcdFx0J1gnOiAxNyxcclxuXHRcdFx0J1knOiAxNyxcclxuXHRcdFx0J1onOiAxOSxcclxuXHRcdFx0J2EnOiAxMixcclxuXHRcdFx0J2InOiAxNSxcclxuXHRcdFx0J2MnOiAxMixcclxuXHRcdFx0J2QnOiAxNSxcclxuXHRcdFx0J2UnOiAxMyxcclxuXHRcdFx0J2YnOiAxMixcclxuXHRcdFx0J2cnOiAxMyxcclxuXHRcdFx0J2gnOiAxMixcclxuXHRcdFx0J2knOiAxMSxcclxuXHRcdFx0J2onOiAxMixcclxuXHRcdFx0J2snOiAxMCxcclxuXHRcdFx0J2wnOiAxMCxcclxuXHRcdFx0J20nOiAxNixcclxuXHRcdFx0J24nOiAxMSxcclxuXHRcdFx0J28nOiAxMCxcclxuXHRcdFx0J3AnOiAxMSxcclxuXHRcdFx0J3EnOiAxNCxcclxuXHRcdFx0J3InOiAxMSxcclxuXHRcdFx0J3MnOiA4LFxyXG5cdFx0XHQndCc6IDExLFxyXG5cdFx0XHQndSc6IDEwLFxyXG5cdFx0XHQndic6IDExLFxyXG5cdFx0XHQndyc6IDE1LFxyXG5cdFx0XHQneCc6IDEyLFxyXG5cdFx0XHQneSc6IDExLFxyXG5cdFx0XHQneic6IDEwLFxyXG5cdFx0XHQnISc6IDksXHJcblx0XHRcdCcuJzogNCxcclxuXHRcdFx0JywnOiA0LFxyXG5cdFx0XHQnPyc6IDEzLFxyXG5cdFx0XHQnXyc6IDEzLFxyXG5cdFx0XHQnLSc6IDgsXHJcblx0XHRcdCc6JzogNCxcclxuXHRcdFx0JyAnOiA0LFxyXG5cdFx0fSxcclxuXHRcdCdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSEuLD9fLTogJyxcclxuXHRcdDI0LFxyXG5cdCksXHJcblx0dG9tX3RodW1iOiBuZXcgRm9udFJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy91aS90b21fdGh1bWIucG5nJyxcclxuXHRcdHtcclxuXHRcdFx0J0EnOiAzLFxyXG5cdFx0XHQnQic6IDMsXHJcblx0XHRcdCdDJzogMyxcclxuXHRcdFx0J0QnOiAzLFxyXG5cdFx0XHQnRSc6IDMsXHJcblx0XHRcdCdGJzogMyxcclxuXHRcdFx0J0cnOiAzLFxyXG5cdFx0XHQnSCc6IDMsXHJcblx0XHRcdCdJJzogMyxcclxuXHRcdFx0J0onOiAzLFxyXG5cdFx0XHQnSyc6IDMsXHJcblx0XHRcdCdMJzogMyxcclxuXHRcdFx0J00nOiAzLFxyXG5cdFx0XHQnTic6IDMsXHJcblx0XHRcdCdPJzogMyxcclxuXHRcdFx0J1AnOiAzLFxyXG5cdFx0XHQnUSc6IDMsXHJcblx0XHRcdCdSJzogMyxcclxuXHRcdFx0J1MnOiAzLFxyXG5cdFx0XHQnVCc6IDMsXHJcblx0XHRcdCdVJzogMyxcclxuXHRcdFx0J1YnOiAzLFxyXG5cdFx0XHQnVyc6IDMsXHJcblx0XHRcdCdYJzogMyxcclxuXHRcdFx0J1knOiAzLFxyXG5cdFx0XHQnWic6IDMsXHJcblx0XHRcdCdhJzogMyxcclxuXHRcdFx0J2InOiAzLFxyXG5cdFx0XHQnYyc6IDMsXHJcblx0XHRcdCdkJzogMyxcclxuXHRcdFx0J2UnOiAzLFxyXG5cdFx0XHQnZic6IDMsXHJcblx0XHRcdCdnJzogMyxcclxuXHRcdFx0J2gnOiAzLFxyXG5cdFx0XHQnaSc6IDMsXHJcblx0XHRcdCdqJzogMyxcclxuXHRcdFx0J2snOiAzLFxyXG5cdFx0XHQnbCc6IDMsXHJcblx0XHRcdCdtJzogMyxcclxuXHRcdFx0J24nOiAzLFxyXG5cdFx0XHQnbyc6IDMsXHJcblx0XHRcdCdwJzogMyxcclxuXHRcdFx0J3EnOiAzLFxyXG5cdFx0XHQncic6IDMsXHJcblx0XHRcdCdzJzogMyxcclxuXHRcdFx0J3QnOiAzLFxyXG5cdFx0XHQndSc6IDMsXHJcblx0XHRcdCd2JzogMyxcclxuXHRcdFx0J3cnOiAzLFxyXG5cdFx0XHQneCc6IDMsXHJcblx0XHRcdCd5JzogMyxcclxuXHRcdFx0J3onOiAzLFxyXG5cdFx0XHQnWyc6IDMsXHJcblx0XHRcdCdcXFxcJzogMyxcclxuXHRcdFx0J10nOiAzLFxyXG5cdFx0XHQnXic6IDMsXHJcblx0XHRcdCcgJzogMyxcclxuXHRcdFx0JyEnOiAzLFxyXG5cdFx0XHQnXCInOiAzLFxyXG5cdFx0XHQnIyc6IDMsXHJcblx0XHRcdCckJzogMyxcclxuXHRcdFx0JyUnOiAzLFxyXG5cdFx0XHQnJic6IDMsXHJcblx0XHRcdFwiJ1wiOiAzLFxyXG5cdFx0XHQnKCc6IDMsXHJcblx0XHRcdCcpJzogMyxcclxuXHRcdFx0JyonOiAzLFxyXG5cdFx0XHQnKyc6IDMsXHJcblx0XHRcdCcsJzogMyxcclxuXHRcdFx0Jy0nOiAzLFxyXG5cdFx0XHQnLic6IDMsXHJcblx0XHRcdCcvJzogMyxcclxuXHRcdFx0JzAnOiAzLFxyXG5cdFx0XHQnMSc6IDMsXHJcblx0XHRcdCcyJzogMyxcclxuXHRcdFx0JzMnOiAzLFxyXG5cdFx0XHQnNCc6IDMsXHJcblx0XHRcdCc1JzogMyxcclxuXHRcdFx0JzYnOiAzLFxyXG5cdFx0XHQnNyc6IDMsXHJcblx0XHRcdCc4JzogMyxcclxuXHRcdFx0JzknOiAzLFxyXG5cdFx0XHQnOic6IDMsXHJcblx0XHRcdCc7JzogMyxcclxuXHRcdFx0JzwnOiAzLFxyXG5cdFx0XHQnPSc6IDMsXHJcblx0XHRcdCc+JzogMyxcclxuXHRcdFx0Jz8nOiAzLFxyXG5cdFx0XHQnXyc6IDMsXHJcblx0XHR9LFxyXG5cdFx0YEFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXpbXFxcXF1eICFcIiMkJSYnKCkqKywtLi8wMTIzNDU2Nzg5Ojs8PT4/X2AsXHJcblx0XHQ1LFxyXG5cdCksXHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgS2V5cyA9IHtcclxuXHRrZXlib2FyZE1hcDogW1xyXG5cdFx0JycsIC8vIFswXVxyXG5cdFx0JycsIC8vIFsxXVxyXG5cdFx0JycsIC8vIFsyXVxyXG5cdFx0J0NBTkNFTCcsIC8vIFszXVxyXG5cdFx0JycsIC8vIFs0XVxyXG5cdFx0JycsIC8vIFs1XVxyXG5cdFx0J0hFTFAnLCAvLyBbNl1cclxuXHRcdCcnLCAvLyBbN11cclxuXHRcdCdCQUNLU1BBQ0UnLCAvLyBbOF1cclxuXHRcdCdUQUInLCAvLyBbOV1cclxuXHRcdCcnLCAvLyBbMTBdXHJcblx0XHQnJywgLy8gWzExXVxyXG5cdFx0J0NMRUFSJywgLy8gWzEyXVxyXG5cdFx0J0VOVEVSJywgLy8gWzEzXVxyXG5cdFx0J0VOVEVSIFNQRUNJQUwnLCAvLyBbMTRdXHJcblx0XHQnJywgLy8gWzE1XVxyXG5cdFx0J1NISUZUJywgLy8gWzE2XVxyXG5cdFx0J0NPTlRST0wnLCAvLyBbMTddXHJcblx0XHQnQUxUJywgLy8gWzE4XVxyXG5cdFx0J1BBVVNFJywgLy8gWzE5XVxyXG5cdFx0J0NBUFMgTE9DSycsIC8vIFsyMF1cclxuXHRcdCdLQU5BJywgLy8gWzIxXVxyXG5cdFx0J0VJU1UnLCAvLyBbMjJdXHJcblx0XHQnSlVOSkEnLCAvLyBbMjNdXHJcblx0XHQnRklOQUwnLCAvLyBbMjRdXHJcblx0XHQnSEFOSkEnLCAvLyBbMjVdXHJcblx0XHQnJywgLy8gWzI2XVxyXG5cdFx0J0VTQ0FQRScsIC8vIFsyN11cclxuXHRcdCdDT05WRVJUJywgLy8gWzI4XVxyXG5cdFx0J05PTkNPTlZFUlQnLCAvLyBbMjldXHJcblx0XHQnQUNDRVBUJywgLy8gWzMwXVxyXG5cdFx0J01PREVDSEFOR0UnLCAvLyBbMzFdXHJcblx0XHQnU1BBQ0UnLCAvLyBbMzJdXHJcblx0XHQnUEFHRSBVUCcsIC8vIFszM11cclxuXHRcdCdQQUdFIERPV04nLCAvLyBbMzRdXHJcblx0XHQnRU5EJywgLy8gWzM1XVxyXG5cdFx0J0hPTUUnLCAvLyBbMzZdXHJcblx0XHQnTEVGVCcsIC8vIFszN11cclxuXHRcdCdVUCcsIC8vIFszOF1cclxuXHRcdCdSSUdIVCcsIC8vIFszOV1cclxuXHRcdCdET1dOJywgLy8gWzQwXVxyXG5cdFx0J1NFTEVDVCcsIC8vIFs0MV1cclxuXHRcdCdQUklOVCcsIC8vIFs0Ml1cclxuXHRcdCdFWEVDVVRFJywgLy8gWzQzXVxyXG5cdFx0J1BSSU5UIFNDUkVFTicsIC8vIFs0NF1cclxuXHRcdCdJTlNFUlQnLCAvLyBbNDVdXHJcblx0XHQnREVMRVRFJywgLy8gWzQ2XVxyXG5cdFx0JycsIC8vIFs0N11cclxuXHRcdCcwJywgLy8gWzQ4XVxyXG5cdFx0JzEnLCAvLyBbNDldXHJcblx0XHQnMicsIC8vIFs1MF1cclxuXHRcdCczJywgLy8gWzUxXVxyXG5cdFx0JzQnLCAvLyBbNTJdXHJcblx0XHQnNScsIC8vIFs1M11cclxuXHRcdCc2JywgLy8gWzU0XVxyXG5cdFx0JzcnLCAvLyBbNTVdXHJcblx0XHQnOCcsIC8vIFs1Nl1cclxuXHRcdCc5JywgLy8gWzU3XVxyXG5cdFx0J0NPTE9OJywgLy8gWzU4XVxyXG5cdFx0J1NFTUlDT0xPTicsIC8vIFs1OV1cclxuXHRcdCdMRVNTIFRIQU4nLCAvLyBbNjBdXHJcblx0XHQnRVFVQUxTJywgLy8gWzYxXVxyXG5cdFx0J0dSRUFURVIgVEhBTicsIC8vIFs2Ml1cclxuXHRcdCdRVUVTVElPTiBNQVJLJywgLy8gWzYzXVxyXG5cdFx0J0FUJywgLy8gWzY0XVxyXG5cdFx0J0EnLCAvLyBbNjVdXHJcblx0XHQnQicsIC8vIFs2Nl1cclxuXHRcdCdDJywgLy8gWzY3XVxyXG5cdFx0J0QnLCAvLyBbNjhdXHJcblx0XHQnRScsIC8vIFs2OV1cclxuXHRcdCdGJywgLy8gWzcwXVxyXG5cdFx0J0cnLCAvLyBbNzFdXHJcblx0XHQnSCcsIC8vIFs3Ml1cclxuXHRcdCdJJywgLy8gWzczXVxyXG5cdFx0J0onLCAvLyBbNzRdXHJcblx0XHQnSycsIC8vIFs3NV1cclxuXHRcdCdMJywgLy8gWzc2XVxyXG5cdFx0J00nLCAvLyBbNzddXHJcblx0XHQnTicsIC8vIFs3OF1cclxuXHRcdCdPJywgLy8gWzc5XVxyXG5cdFx0J1AnLCAvLyBbODBdXHJcblx0XHQnUScsIC8vIFs4MV1cclxuXHRcdCdSJywgLy8gWzgyXVxyXG5cdFx0J1MnLCAvLyBbODNdXHJcblx0XHQnVCcsIC8vIFs4NF1cclxuXHRcdCdVJywgLy8gWzg1XVxyXG5cdFx0J1YnLCAvLyBbODZdXHJcblx0XHQnVycsIC8vIFs4N11cclxuXHRcdCdYJywgLy8gWzg4XVxyXG5cdFx0J1knLCAvLyBbODldXHJcblx0XHQnWicsIC8vIFs5MF1cclxuXHRcdCdPUyBLRVknLCAvLyBbOTFdIFdpbmRvd3MgS2V5IChXaW5kb3dzKSBvciBDb21tYW5kIEtleSAoTWFjKVxyXG5cdFx0JycsIC8vIFs5Ml1cclxuXHRcdCdDT05URVhUIE1FTlUnLCAvLyBbOTNdXHJcblx0XHQnJywgLy8gWzk0XVxyXG5cdFx0J1NMRUVQJywgLy8gWzk1XVxyXG5cdFx0J05VTVBBRDAnLCAvLyBbOTZdXHJcblx0XHQnTlVNUEFEMScsIC8vIFs5N11cclxuXHRcdCdOVU1QQUQyJywgLy8gWzk4XVxyXG5cdFx0J05VTVBBRDMnLCAvLyBbOTldXHJcblx0XHQnTlVNUEFENCcsIC8vIFsxMDBdXHJcblx0XHQnTlVNUEFENScsIC8vIFsxMDFdXHJcblx0XHQnTlVNUEFENicsIC8vIFsxMDJdXHJcblx0XHQnTlVNUEFENycsIC8vIFsxMDNdXHJcblx0XHQnTlVNUEFEOCcsIC8vIFsxMDRdXHJcblx0XHQnTlVNUEFEOScsIC8vIFsxMDVdXHJcblx0XHQnTVVMVElQTFknLCAvLyBbMTA2XVxyXG5cdFx0J0FERCcsIC8vIFsxMDddXHJcblx0XHQnU0VQQVJBVE9SJywgLy8gWzEwOF1cclxuXHRcdCdTVUJUUkFDVCcsIC8vIFsxMDldXHJcblx0XHQnREVDSU1BTCcsIC8vIFsxMTBdXHJcblx0XHQnRElWSURFJywgLy8gWzExMV1cclxuXHRcdCdGMScsIC8vIFsxMTJdXHJcblx0XHQnRjInLCAvLyBbMTEzXVxyXG5cdFx0J0YzJywgLy8gWzExNF1cclxuXHRcdCdGNCcsIC8vIFsxMTVdXHJcblx0XHQnRjUnLCAvLyBbMTE2XVxyXG5cdFx0J0Y2JywgLy8gWzExN11cclxuXHRcdCdGNycsIC8vIFsxMThdXHJcblx0XHQnRjgnLCAvLyBbMTE5XVxyXG5cdFx0J0Y5JywgLy8gWzEyMF1cclxuXHRcdCdGMTAnLCAvLyBbMTIxXVxyXG5cdFx0J0YxMScsIC8vIFsxMjJdXHJcblx0XHQnRjEyJywgLy8gWzEyM11cclxuXHRcdCdGMTMnLCAvLyBbMTI0XVxyXG5cdFx0J0YxNCcsIC8vIFsxMjVdXHJcblx0XHQnRjE1JywgLy8gWzEyNl1cclxuXHRcdCdGMTYnLCAvLyBbMTI3XVxyXG5cdFx0J0YxNycsIC8vIFsxMjhdXHJcblx0XHQnRjE4JywgLy8gWzEyOV1cclxuXHRcdCdGMTknLCAvLyBbMTMwXVxyXG5cdFx0J0YyMCcsIC8vIFsxMzFdXHJcblx0XHQnRjIxJywgLy8gWzEzMl1cclxuXHRcdCdGMjInLCAvLyBbMTMzXVxyXG5cdFx0J0YyMycsIC8vIFsxMzRdXHJcblx0XHQnRjI0JywgLy8gWzEzNV1cclxuXHRcdCcnLCAvLyBbMTM2XVxyXG5cdFx0JycsIC8vIFsxMzddXHJcblx0XHQnJywgLy8gWzEzOF1cclxuXHRcdCcnLCAvLyBbMTM5XVxyXG5cdFx0JycsIC8vIFsxNDBdXHJcblx0XHQnJywgLy8gWzE0MV1cclxuXHRcdCcnLCAvLyBbMTQyXVxyXG5cdFx0JycsIC8vIFsxNDNdXHJcblx0XHQnTlVNIExPQ0snLCAvLyBbMTQ0XVxyXG5cdFx0J1NDUk9MTCBMT0NLJywgLy8gWzE0NV1cclxuXHRcdCdXSU4gT0VNIEZKIEpJU0hPJywgLy8gWzE0Nl1cclxuXHRcdCdXSU4gT0VNIEZKIE1BU1NIT1UnLCAvLyBbMTQ3XVxyXG5cdFx0J1dJTiBPRU0gRkogVE9VUk9LVScsIC8vIFsxNDhdXHJcblx0XHQnV0lOIE9FTSBGSiBMT1lBJywgLy8gWzE0OV1cclxuXHRcdCdXSU4gT0VNIEZKIFJPWUEnLCAvLyBbMTUwXVxyXG5cdFx0JycsIC8vIFsxNTFdXHJcblx0XHQnJywgLy8gWzE1Ml1cclxuXHRcdCcnLCAvLyBbMTUzXVxyXG5cdFx0JycsIC8vIFsxNTRdXHJcblx0XHQnJywgLy8gWzE1NV1cclxuXHRcdCcnLCAvLyBbMTU2XVxyXG5cdFx0JycsIC8vIFsxNTddXHJcblx0XHQnJywgLy8gWzE1OF1cclxuXHRcdCcnLCAvLyBbMTU5XVxyXG5cdFx0J0NJUkNVTUZMRVgnLCAvLyBbMTYwXVxyXG5cdFx0J0VYQ0xBTUFUSU9OJywgLy8gWzE2MV1cclxuXHRcdCdET1VCTEVfUVVPVEUnLCAvLyBbMTYyXVxyXG5cdFx0J0hBU0gnLCAvLyBbMTYzXVxyXG5cdFx0J0RPTExBUicsIC8vIFsxNjRdXHJcblx0XHQnUEVSQ0VOVCcsIC8vIFsxNjVdXHJcblx0XHQnQU1QRVJTQU5EJywgLy8gWzE2Nl1cclxuXHRcdCdVTkRFUlNDT1JFJywgLy8gWzE2N11cclxuXHRcdCdPUEVOIFBBUkVOVEhFU0lTJywgLy8gWzE2OF1cclxuXHRcdCdDTE9TRSBQQVJFTlRIRVNJUycsIC8vIFsxNjldXHJcblx0XHQnQVNURVJJU0snLCAvLyBbMTcwXVxyXG5cdFx0J1BMVVMnLCAvLyBbMTcxXVxyXG5cdFx0J1BJUEUnLCAvLyBbMTcyXVxyXG5cdFx0J0hZUEhFTicsIC8vIFsxNzNdXHJcblx0XHQnT1BFTiBDVVJMWSBCUkFDS0VUJywgLy8gWzE3NF1cclxuXHRcdCdDTE9TRSBDVVJMWSBCUkFDS0VUJywgLy8gWzE3NV1cclxuXHRcdCdUSUxERScsIC8vIFsxNzZdXHJcblx0XHQnJywgLy8gWzE3N11cclxuXHRcdCcnLCAvLyBbMTc4XVxyXG5cdFx0JycsIC8vIFsxNzldXHJcblx0XHQnJywgLy8gWzE4MF1cclxuXHRcdCdWT0xVTUUgTVVURScsIC8vIFsxODFdXHJcblx0XHQnVk9MVU1FIERPV04nLCAvLyBbMTgyXVxyXG5cdFx0J1ZPTFVNRSBVUCcsIC8vIFsxODNdXHJcblx0XHQnJywgLy8gWzE4NF1cclxuXHRcdCcnLCAvLyBbMTg1XVxyXG5cdFx0J1NFTUlDT0xPTicsIC8vIFsxODZdXHJcblx0XHQnRVFVQUxTJywgLy8gWzE4N11cclxuXHRcdCdDT01NQScsIC8vIFsxODhdXHJcblx0XHQnTUlOVVMnLCAvLyBbMTg5XVxyXG5cdFx0J1BFUklPRCcsIC8vIFsxOTBdXHJcblx0XHQnU0xBU0gnLCAvLyBbMTkxXVxyXG5cdFx0J0JBQ0sgUVVPVEUnLCAvLyBbMTkyXVxyXG5cdFx0JycsIC8vIFsxOTNdXHJcblx0XHQnJywgLy8gWzE5NF1cclxuXHRcdCcnLCAvLyBbMTk1XVxyXG5cdFx0JycsIC8vIFsxOTZdXHJcblx0XHQnJywgLy8gWzE5N11cclxuXHRcdCcnLCAvLyBbMTk4XVxyXG5cdFx0JycsIC8vIFsxOTldXHJcblx0XHQnJywgLy8gWzIwMF1cclxuXHRcdCcnLCAvLyBbMjAxXVxyXG5cdFx0JycsIC8vIFsyMDJdXHJcblx0XHQnJywgLy8gWzIwM11cclxuXHRcdCcnLCAvLyBbMjA0XVxyXG5cdFx0JycsIC8vIFsyMDVdXHJcblx0XHQnJywgLy8gWzIwNl1cclxuXHRcdCcnLCAvLyBbMjA3XVxyXG5cdFx0JycsIC8vIFsyMDhdXHJcblx0XHQnJywgLy8gWzIwOV1cclxuXHRcdCcnLCAvLyBbMjEwXVxyXG5cdFx0JycsIC8vIFsyMTFdXHJcblx0XHQnJywgLy8gWzIxMl1cclxuXHRcdCcnLCAvLyBbMjEzXVxyXG5cdFx0JycsIC8vIFsyMTRdXHJcblx0XHQnJywgLy8gWzIxNV1cclxuXHRcdCcnLCAvLyBbMjE2XVxyXG5cdFx0JycsIC8vIFsyMTddXHJcblx0XHQnJywgLy8gWzIxOF1cclxuXHRcdCdPUEVOIEJSQUNLRVQnLCAvLyBbMjE5XVxyXG5cdFx0J0JBQ0sgU0xBU0gnLCAvLyBbMjIwXVxyXG5cdFx0J0NMT1NFIEJSQUNLRVQnLCAvLyBbMjIxXVxyXG5cdFx0J1FVT1RFJywgLy8gWzIyMl1cclxuXHRcdCcnLCAvLyBbMjIzXVxyXG5cdFx0J01FVEEnLCAvLyBbMjI0XVxyXG5cdFx0J0FMVCBHUkFQSCcsIC8vIFsyMjVdXHJcblx0XHQnJywgLy8gWzIyNl1cclxuXHRcdCdXSU4gSUNPIEhFTFAnLCAvLyBbMjI3XVxyXG5cdFx0J1dJTiBJQ08gMDAnLCAvLyBbMjI4XVxyXG5cdFx0JycsIC8vIFsyMjldXHJcblx0XHQnV0lOIElDTyBDTEVBUicsIC8vIFsyMzBdXHJcblx0XHQnJywgLy8gWzIzMV1cclxuXHRcdCcnLCAvLyBbMjMyXVxyXG5cdFx0J1dJTiBPRU0gUkVTRVQnLCAvLyBbMjMzXVxyXG5cdFx0J1dJTiBPRU0gSlVNUCcsIC8vIFsyMzRdXHJcblx0XHQnV0lOIE9FTSBQQTEnLCAvLyBbMjM1XVxyXG5cdFx0J1dJTiBPRU0gUEEyJywgLy8gWzIzNl1cclxuXHRcdCdXSU4gT0VNIFBBMycsIC8vIFsyMzddXHJcblx0XHQnV0lOIE9FTSBXU0NUUkwnLCAvLyBbMjM4XVxyXG5cdFx0J1dJTiBPRU0gQ1VTRUwnLCAvLyBbMjM5XVxyXG5cdFx0J1dJTiBPRU0gQVRUTicsIC8vIFsyNDBdXHJcblx0XHQnV0lOIE9FTSBGSU5JU0gnLCAvLyBbMjQxXVxyXG5cdFx0J1dJTiBPRU0gQ09QWScsIC8vIFsyNDJdXHJcblx0XHQnV0lOIE9FTSBBVVRPJywgLy8gWzI0M11cclxuXHRcdCdXSU4gT0VNIEVOTFcnLCAvLyBbMjQ0XVxyXG5cdFx0J1dJTiBPRU0gQkFDS1RBQicsIC8vIFsyNDVdXHJcblx0XHQnQVRUTicsIC8vIFsyNDZdXHJcblx0XHQnQ1JTRUwnLCAvLyBbMjQ3XVxyXG5cdFx0J0VYU0VMJywgLy8gWzI0OF1cclxuXHRcdCdFUkVPRicsIC8vIFsyNDldXHJcblx0XHQnUExBWScsIC8vIFsyNTBdXHJcblx0XHQnWk9PTScsIC8vIFsyNTFdXHJcblx0XHQnJywgLy8gWzI1Ml1cclxuXHRcdCdQQTEnLCAvLyBbMjUzXVxyXG5cdFx0J1dJTiBPRU0gQ0xFQVInLCAvLyBbMjU0XVxyXG5cdFx0J1RPR0dMRSBUT1VDSFBBRCcsIC8vIFsyNTVdXHJcblx0XSwgLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTc3MjE3OS9nZXQtY2hhcmFjdGVyLXZhbHVlLWZyb20ta2V5Y29kZS1pbi1qYXZhc2NyaXB0LXRoZW4tdHJpbVxyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IEF1ZGlvQXNzZXRzID0ge1xyXG5cdHVpOiB7XHJcblx0XHRpbnZlbnRvcnlDbGFjazogbmV3IEF1ZGlvUmVzb3VyY2VHcm91cChbXHJcblx0XHRcdG5ldyBBdWRpb1Jlc291cmNlKCdhc3NldHMvc291bmRzL3NmeC91aS9jbGFjazEubXAzJyksXHJcblx0XHRcdG5ldyBBdWRpb1Jlc291cmNlKCdhc3NldHMvc291bmRzL3NmeC91aS9jbGFjazIubXAzJyksXHJcblx0XHRcdG5ldyBBdWRpb1Jlc291cmNlKCdhc3NldHMvc291bmRzL3NmeC91aS9jbGFjazMubXAzJyksXHJcblx0XHRdKSxcclxuXHR9LFxyXG5cdG11c2ljOiB7XHJcblx0XHR0aXRsZVNjcmVlbjogbmV3IEF1ZGlvUmVzb3VyY2UoJ2Fzc2V0cy9zb3VuZHMvbXVzaWMvVGl0bGVTY3JlZW4ubXAzJyksXHJcblx0fSxcclxuXHRhbWJpZW50OiB7XHJcblx0XHR3aW50ZXIxOiBuZXcgQXVkaW9SZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy9zb3VuZHMvc2Z4L2FtYmllbnQvNjU4MTNfX3BjYWVsZHJpZXNfX2NvdW50cnlzaWRld2ludGVyZXZlbmluZzAyLndhdicsXHJcblx0XHQpLFxyXG5cdH0sXHJcbn07XHJcblxyXG5leHBvcnQgdHlwZSBBbmltYXRpb25GcmFtZTxUIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgW0ltYWdlUmVzb3VyY2UsIG51bWJlcl1bXT4+ID0ga2V5b2YgVDtcclxuXHJcbi8vIGNvbnN0IGFuaW1hdGlvbnMgPSA8VCBleHRlbmRzIFJlY29yZDxzdHJpbmcsIEltYWdlUmVzb3VyY2VbXT4+KGRhdGE6IFQpOiBUID0+IGRhdGFcclxuXHJcbmV4cG9ydCBjb25zdCBsb2FkQXNzZXRzID0gKHNrZXRjaDogUDUsIC4uLmFzc2V0czogQXNzZXRHcm91cFtdKSA9PiB7XHJcblx0YXNzZXRzLmZvckVhY2goYXNzZXRHcm91cCA9PiB7XHJcblx0XHRzZWFyY2hHcm91cChhc3NldEdyb3VwLCBza2V0Y2gpO1xyXG5cdH0pO1xyXG59O1xyXG5cclxuZnVuY3Rpb24gc2VhcmNoR3JvdXAoXHJcblx0YXNzZXRHcm91cDpcclxuXHRcdHwgQXNzZXRHcm91cFxyXG5cdFx0fCBSZXNvdXJjZVxyXG5cdFx0fCBBdWRpb1Jlc291cmNlXHJcblx0XHR8IEF1ZGlvUmVzb3VyY2VHcm91cCxcclxuXHRza2V0Y2g6IFA1LFxyXG4pIHtcclxuXHRpZiAoYXNzZXRHcm91cCBpbnN0YW5jZW9mIFJlc291cmNlKSB7XHJcblx0XHRjb25zb2xlLmxvZyhgTG9hZGluZyBhc3NldCAke2Fzc2V0R3JvdXAucGF0aH1gKTtcclxuXHRcdGFzc2V0R3JvdXAubG9hZFJlc291cmNlKHNrZXRjaCk7XHJcblx0XHRyZXR1cm47XHJcblx0fVxyXG5cdE9iamVjdC5lbnRyaWVzKGFzc2V0R3JvdXApLmZvckVhY2goYXNzZXQgPT4ge1xyXG5cdFx0c2VhcmNoR3JvdXAoYXNzZXRbMV0sIHNrZXRjaCk7XHJcblx0fSk7XHJcbn1cclxuIiwiaW1wb3J0IFA1IGZyb20gJ3A1JztcclxuaW1wb3J0IHsgUmVzb3VyY2UgfSBmcm9tICcuL1Jlc291cmNlJztcclxuXHJcbmV4cG9ydCBjbGFzcyBBdWRpb1Jlc291cmNlIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gICAgLy8gc291bmQ6IEF1ZGlvVHlwZVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBhdGg6IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKHBhdGgpO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWRSZXNvdXJjZShnYW1lOiBQNSkge1xyXG4gICAgICAgIC8vIHRoaXMuc291bmQgPSBBdWRpbyh7XHJcbiAgICAgICAgLy8gICAgIGZpbGU6IHRoaXMucGF0aCxcclxuICAgICAgICAvLyAgICAgbG9vcDogZmFsc2UsXHJcbiAgICAgICAgLy8gICAgIHZvbHVtZTogMS4wLFxyXG4gICAgICAgIC8vIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHBsYXlSYW5kb20oKSB7XHJcbiAgICAvLyAgICAgLy8gVmVyaWZ5IHRoYXQgdGhlIHNvdW5kIGhhcyBiZWVuIGxvYWRlZFxyXG4gICAgLy8gICAgIGlmICh0aGlzLnNvdW5kID09PSB1bmRlZmluZWQpXHJcbiAgICAvLyAgICAgICAgIHRocm93IG5ldyBFcnJvcihcclxuICAgIC8vICAgICAgICAgICAgIGBUcmllZCB0byBwbGF5IHNvdW5kIGJlZm9yZSBsb2FkaW5nIGl0OiAke3RoaXMucGF0aH1gXHJcbiAgICAvLyAgICAgICAgICk7XHJcblxyXG4gICAgLy8gICAgIHRoaXMuc291bmQucGxheSgpO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIHBsYXlTb3VuZCgpIHsvLyBwbGF5IHRoZSBzb3VuZFxyXG4gICAgICAgIC8vVmVyaWZ5IHRoYXQgdGhlIHNvdW5kIGhhcyBiZWVuIGxvYWRlZFxyXG4gICAgICAgIC8vIGlmICh0aGlzLnNvdW5kID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgLy8gICAgIHRocm93IG5ldyBFcnJvcihcclxuICAgICAgICAvLyAgICAgICAgIGBUcmllZCB0byBwbGF5IHNvdW5kIGJlZm9yZSBsb2FkaW5nIGl0OiAke3RoaXMucGF0aH1gXHJcbiAgICAgICAgLy8gICAgICk7XHJcbiAgICAgICAgLy8gdGhpcy5zb3VuZC5wYXVzZSgpO1xyXG4gICAgICAgIC8vIHRoaXMuc291bmQucGxheSgpO1xyXG4gICAgfVxyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBBdWRpb1Jlc291cmNlIH0gZnJvbSAnLi9BdWRpb1Jlc291cmNlJztcclxuaW1wb3J0IFA1IGZyb20gXCJwNVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEF1ZGlvUmVzb3VyY2VHcm91cCB7XHJcblxyXG4gICAgc291bmRzOiBBdWRpb1Jlc291cmNlW11cclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihzb3VuZHM6IEF1ZGlvUmVzb3VyY2VbXSkgey8vIHBhc3MgaW4gYW4gYXJyYXkgb2YgQXVkaW9SZXNvdXJjZXMgdGhhdCBhcmUgYWxsIHNpbWlsYXJcclxuICAgICAgICB0aGlzLnNvdW5kcyA9IHNvdW5kcztcclxuICAgIH1cclxuXHJcbiAgICBwbGF5UmFuZG9tKCkgey8vIHBsYXkgYSByYW5kb20gc291bmRcclxuICAgICAgICBpZih0aGlzLnNvdW5kcyA9PT0gdW5kZWZpbmVkIHx8IHRoaXMuc291bmRzLmxlbmd0aCA9PT0gMClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxyXG4gICAgICAgICAgICAgICAgYFRoZXJlIGFyZSBubyBzb3VuZHM6ICR7dGhpcy5zb3VuZHN9YFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIGNvbnN0IHIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0aGlzLnNvdW5kcy5sZW5ndGgpO1xyXG4gICAgICAgIHRoaXMuc291bmRzW3JdLnBsYXlTb3VuZCgpOy8vIHBsYXkgYSByYW5kb20gc291bmQgZnJvbSB0aGUgYXJyYXkgYXQgYSBzbGlnaHRseSByYW5kb21pemVkIHBpdGNoLCBsZWFkaW5nIHRvIHRoZSBlZmZlY3Qgb2YgaXQgbWFraW5nIGEgbmV3IHNvdW5kIGVhY2ggdGltZSwgcmVtb3ZpbmcgcmVwZXRpdGl2ZW5lc3NcclxuXHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IHsgSW1hZ2VSZXNvdXJjZSB9IGZyb20gJy4vSW1hZ2VSZXNvdXJjZSc7XHJcbmltcG9ydCBwNSBmcm9tICdwNSc7XHJcbmltcG9ydCB7IGdhbWUgfSBmcm9tICcuLi8uLi9HYW1lJztcclxuXHJcbmV4cG9ydCBjbGFzcyBGb250UmVzb3VyY2UgZXh0ZW5kcyBJbWFnZVJlc291cmNlIHtcclxuXHJcbiAgICBhbHBoYWJldF9zb3VwOiB7W2xldHRlcjogc3RyaW5nXToge3g6IG51bWJlciwgeTogbnVtYmVyLCB3OiBudW1iZXIsIGg6IG51bWJlcn19ID0ge31cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwYXRoOiBzdHJpbmcsIGNoYXJhY3RlckRhdGE6IHtbbGV0dGVyOiBzdHJpbmddOiBudW1iZXJ9LCBjaGFyYWN0ZXJPcmRlcjogc3RyaW5nLCBmb250SGVpZ2h0OiBudW1iZXIpIHtcclxuICAgICAgICBzdXBlcihwYXRoKTtcclxuICAgICAgICBsZXQgcnVubmluZ1RvdGFsID0gMFxyXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGk8Y2hhcmFjdGVyT3JkZXIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5hbHBoYWJldF9zb3VwW2NoYXJhY3Rlck9yZGVyW2ldXSA9IHt4OiBydW5uaW5nVG90YWwsIHk6IDAsIHc6IGNoYXJhY3RlckRhdGFbY2hhcmFjdGVyT3JkZXJbaV1dLCBoOiBmb250SGVpZ2h0fVxyXG4gICAgICAgICAgICBydW5uaW5nVG90YWwgKz0gY2hhcmFjdGVyRGF0YVtjaGFyYWN0ZXJPcmRlcltpXV0gKyAxXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGNoYXJhY3Rlck9yZGVyW2ldK1wiOiBcIitjaGFyYWN0ZXJEYXRhW2NoYXJhY3Rlck9yZGVyW2ldXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGRyYXdUZXh0KHRhcmdldDogcDUsIHN0cjogc3RyaW5nLCB4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG4gICAgICAgIC8vY29uc29sZS5sb2codGhpcy5hbHBoYWJldF9zb3VwKTtcclxuICAgICAgICBsZXQgeE9mZnNldDogbnVtYmVyID0gMDtcclxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpPHN0ci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZih0aGlzLmFscGhhYmV0X3NvdXBbc3RyW2ldXSE9dW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgdGhpcy5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCt4T2Zmc2V0KmdhbWUudXBzY2FsZVNpemUsIHksIHRoaXMuYWxwaGFiZXRfc291cFtzdHJbaV1dLncqZ2FtZS51cHNjYWxlU2l6ZSwgdGhpcy5hbHBoYWJldF9zb3VwW3N0cltpXV0uaCpnYW1lLnVwc2NhbGVTaXplLCB0aGlzLmFscGhhYmV0X3NvdXBbc3RyW2ldXS54LCB0aGlzLmFscGhhYmV0X3NvdXBbc3RyW2ldXS55LCB0aGlzLmFscGhhYmV0X3NvdXBbc3RyW2ldXS53LCB0aGlzLmFscGhhYmV0X3NvdXBbc3RyW2ldXS5oKTtcclxuICAgICAgICAgICAgeE9mZnNldCArPSB0aGlzLmFscGhhYmV0X3NvdXBbc3RyW2ldXS53KzE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJ1bmtub3duIGxldHRlcjogJ1wiK3N0cltpXStcIidcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgUDUgZnJvbSAncDUnO1xyXG5pbXBvcnQgeyBSZXNvdXJjZSB9IGZyb20gJy4vUmVzb3VyY2UnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEltYWdlUmVzb3VyY2UgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgICBpbWFnZTogUDUuSW1hZ2U7XHJcblxyXG4gICAgY29uc3RydWN0b3IocGF0aDogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIocGF0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZFJlc291cmNlKGdhbWU6IFA1KSB7XHJcbiAgICAgICAgdGhpcy5pbWFnZSA9IGdhbWUubG9hZEltYWdlKHRoaXMucGF0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKHRhcmdldDogYW55LCB4OiBudW1iZXIsIHk6IG51bWJlciwgd2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpIHtcclxuICAgICAgICAvLyBWZXJpZnkgdGhhdCB0aGUgdGlsZXMgaGFzIGJlZW4gbG9hZGVkXHJcbiAgICAgICAgaWYgKHRoaXMuaW1hZ2UgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxyXG4gICAgICAgICAgICAgICAgYFRyaWVkIHRvIHJlbmRlciBpbWFnZSBiZWZvcmUgbG9hZGluZyBpdDogJHt0aGlzLnBhdGh9YFxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAvLyBEcmF3IG5vbiB0aWxlcyBpbWFnZVxyXG4gICAgICAgIHRhcmdldC5pbWFnZSh0aGlzLmltYWdlLCB4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXJSb3RhdGVkKHRhcmdldDogYW55LCB4OiBudW1iZXIsIHk6IG51bWJlciwgd2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIsIHJvdGF0aW9uOiBudW1iZXIpIHtcclxuICAgICAgICAvLyBWZXJpZnkgdGhhdCB0aGUgdGlsZXMgaGFzIGJlZW4gbG9hZGVkXHJcbiAgICAgICAgaWYgKHRoaXMuaW1hZ2UgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxyXG4gICAgICAgICAgICAgICAgYFRyaWVkIHRvIHJlbmRlciBpbWFnZSBiZWZvcmUgbG9hZGluZyBpdDogJHt0aGlzLnBhdGh9YFxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAvLyBEcmF3IG5vbiB0aWxlcyBpbWFnZVxyXG4gICAgICAgIHRhcmdldC5wdXNoKClcclxuICAgICAgICB0YXJnZXQudHJhbnNsYXRlKHgrd2lkdGgvMiwgeStoZWlnaHQvMik7XHJcbiAgICAgICAgdGFyZ2V0LnJvdGF0ZShyb3RhdGlvbik7XHJcbiAgICAgICAgdGFyZ2V0LnRyYW5zbGF0ZSgtd2lkdGgvMiwgLWhlaWdodC8yKTtcclxuICAgICAgICB0YXJnZXQuaW1hZ2UodGhpcy5pbWFnZSwgMCwgMCwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgdGFyZ2V0LnBvcCgpXHJcbiAgICB9XHJcblxyXG5cclxuICAgIHJlbmRlclBhcnRpYWwoXHJcbiAgICAgICAgdGFyZ2V0OiBhbnksXHJcbiAgICAgICAgeDogbnVtYmVyLFxyXG4gICAgICAgIHk6IG51bWJlcixcclxuICAgICAgICB3aWR0aDogbnVtYmVyLFxyXG4gICAgICAgIGhlaWdodDogbnVtYmVyLFxyXG4gICAgICAgIHNvdXJjZVg/OiBudW1iZXIsXHJcbiAgICAgICAgc291cmNlWT86IG51bWJlcixcclxuICAgICAgICBzb3VyY2VXaWR0aD86IG51bWJlcixcclxuICAgICAgICBzb3VyY2VIZWlnaHQ/OiBudW1iZXJcclxuICAgICkge1xyXG4gICAgICAgIC8vIFZlcmlmeSB0aGF0IHRoZSB0aWxlcyBoYXMgYmVlbiBsb2FkZWRcclxuICAgICAgICBpZiAodGhpcy5pbWFnZSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAgICAgICAgICAgICBgVHJpZWQgdG8gcmVuZGVyIGltYWdlIGJlZm9yZSBsb2FkaW5nIGl0OiAke3RoaXMucGF0aH1gXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIC8vIERyYXcgYSBwYXJ0aWFsIHBhcnQgb2YgdGhlIGltYWdlXHJcbiAgICAgICAgdGFyZ2V0LmltYWdlKFxyXG4gICAgICAgICAgICB0aGlzLmltYWdlLFxyXG4gICAgICAgICAgICB4LFxyXG4gICAgICAgICAgICB5LFxyXG4gICAgICAgICAgICB3aWR0aCxcclxuICAgICAgICAgICAgaGVpZ2h0LFxyXG4gICAgICAgICAgICBzb3VyY2VYLFxyXG4gICAgICAgICAgICBzb3VyY2VZLFxyXG4gICAgICAgICAgICBzb3VyY2VXaWR0aCxcclxuICAgICAgICAgICAgc291cmNlSGVpZ2h0XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBSZXNvdXJjZSB9IGZyb20gXCIuL1Jlc291cmNlXCI7XHJcbmltcG9ydCBQNSBmcm9tICdwNSc7XHJcbmltcG9ydCB7IEdhbWUsIGdhbWUgfSBmcm9tICcuLi8uLi9HYW1lJztcclxuaW1wb3J0IHsgVGlsZVR5cGUgfSBmcm9tIFwiLi4vLi4vLi4vZ2xvYmFsL1RpbGVcIlxyXG5pbXBvcnQgeyBXb3JsZFRpbGVzIH0gZnJvbSBcIi4uLy4uL3dvcmxkL1dvcmxkVGlsZXNcIjtcclxuaW1wb3J0IHA1IGZyb20gXCJwNVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZSBleHRlbmRzIFJlc291cmNlIHtcclxuXHJcbiAgICBpbWFnZTogUDUuSW1hZ2U7XHJcbiAgICBoYXNSZWZsZWN0aW9uOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICByZWZsZWN0aW9uOiBQNS5JbWFnZTtcclxuICAgIHJlZmxlY3Rpdml0eUFycmF5OiBudW1iZXJbXSA9IFswLCA5MCwgMTUwLCAwLCAxMCwgMTUsIDE3LCAxOSwgMjEsIDIzLCAyNSwgMjcsIDI5LCAzMSwgMTAsIDE3LCAyMSwgMjUsIDI5LCA1LCA1LCA1LCA1LCA1LCA1LCA1LCA1LCA1LCA1XTtcclxuICAgIHNjYXJmQ29sb3IxPzogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl1cclxuICAgIHNjYXJmQ29sb3IyPzogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl1cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwYXRoOiBzdHJpbmcsIHNjYXJmQ29sb3IxPzogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0sIHNjYXJmQ29sb3IyPzogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0pIHtcclxuICAgICAgICBzdXBlcihwYXRoKVxyXG4gICAgICAgIHRoaXMuc2NhcmZDb2xvcjEgPSBzY2FyZkNvbG9yMTtcclxuICAgICAgICB0aGlzLnNjYXJmQ29sb3IyID0gc2NhcmZDb2xvcjI7XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZFJlc291cmNlKGdhbWU6IFA1KSB7XHJcbiAgICAgICAgdGhpcy5pbWFnZSA9IGdhbWUubG9hZEltYWdlKHRoaXMucGF0aCwgKCk9PntcclxuICAgICAgICAgICAgaWYodGhpcy5zY2FyZkNvbG9yMSE9dW5kZWZpbmVkICYmIHRoaXMuc2NhcmZDb2xvcjIhPXVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbWFnZS5sb2FkUGl4ZWxzKCk7XHJcbiAgICAgICAgICAgICAgICBmb3IobGV0IGkgPSAwOyBpPHRoaXMuaW1hZ2Uud2lkdGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvcihsZXQgaiA9IDA7IGo8dGhpcy5pbWFnZS5oZWlnaHQ7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcCA9IHRoaXMuaW1hZ2UuZ2V0KGksIGopO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihwWzBdID09PSAxNjYpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJjb2xvcjFcIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW1hZ2Uuc2V0KGksIGosIHRoaXMuc2NhcmZDb2xvcjEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYocFswXSA9PT0gMTU1KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiY29sb3IyXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmltYWdlLnNldChpLCBqLCB0aGlzLnNjYXJmQ29sb3IyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlKHRoaXMuaW1hZ2Uuc2V0KGksIGosIHApKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvL3RoaXMuaW1hZ2Uuc2V0KDMsIDEwLCBbMCwgMjU1LCAwLCAyNTVdKTsvL3Rlc3QgcGl4ZWxcclxuICAgICAgICAgICAgICAgIHRoaXMuaW1hZ2UudXBkYXRlUGl4ZWxzKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5sb2FkUmVmbGVjdGlvbihnYW1lKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZWRlZmluZVNjYXJmQ29sb3Ioc2NhcmZDb2xvcjE6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdLCBzY2FyZkNvbG9yMjogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0pIHtcclxuICAgICAgICB0aGlzLnNjYXJmQ29sb3IxID0gc2NhcmZDb2xvcjE7XHJcbiAgICAgICAgdGhpcy5zY2FyZkNvbG9yMiA9IHNjYXJmQ29sb3IyO1xyXG4gICAgICAgIHRoaXMuaW1hZ2UubG9hZFBpeGVscygpO1xyXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGk8dGhpcy5pbWFnZS53aWR0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaiA9IDA7IGo8dGhpcy5pbWFnZS5oZWlnaHQ7IGorKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IHAgPSB0aGlzLmltYWdlLmdldChpLCBqKTtcclxuICAgICAgICAgICAgICAgIGlmKHBbMF0gPT09IDE2Nikge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJjb2xvcjFcIilcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmltYWdlLnNldChpLCBqLCB0aGlzLnNjYXJmQ29sb3IxKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYocFswXSA9PT0gMTU1KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImNvbG9yMlwiKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW1hZ2Uuc2V0KGksIGosIHRoaXMuc2NhcmZDb2xvcjIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSh0aGlzLmltYWdlLnNldChpLCBqLCBwKSlcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vdGhpcy5pbWFnZS5zZXQoMywgMTAsIFswLCAyNTUsIDAsIDI1NV0pOy8vdGVzdCBwaXhlbFxyXG4gICAgICAgIHRoaXMuaW1hZ2UudXBkYXRlUGl4ZWxzKCk7XHJcbiAgICAgICAgdGhpcy5sb2FkUmVmbGVjdGlvbihnYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICBsb2FkUmVmbGVjdGlvbihnYW1lOiBQNSkge1xyXG4gICAgICAgIHRoaXMuaGFzUmVmbGVjdGlvbiA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5yZWZsZWN0aW9uID0gZ2FtZS5jcmVhdGVJbWFnZSh0aGlzLmltYWdlLndpZHRoLCB0aGlzLmltYWdlLmhlaWdodCk7XHJcbiAgICAgICAgdGhpcy5pbWFnZS5sb2FkUGl4ZWxzKCk7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyh0aGlzLmltYWdlLnBpeGVscylcclxuICAgICAgICB0aGlzLnJlZmxlY3Rpb24ubG9hZFBpeGVscygpO1xyXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGk8dGhpcy5yZWZsZWN0aW9uLndpZHRoOyBpKyspIHsvL2dlbmVyYXRlIGEgcmVmbGVjdGlvbiBpbWFnZSB0aGF0IGlzIGRpc3BsYXllZCBhcyBhIHJlZmxlY3Rpb25cclxuICAgICAgICAgICAgZm9yKGxldCBqID0gMDsgajx0aGlzLnJlZmxlY3Rpb24uaGVpZ2h0OyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGZvcihsZXQgayA9IDA7IGs8MzsgaysrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWZsZWN0aW9uLnBpeGVsc1s0KihqKnRoaXMucmVmbGVjdGlvbi53aWR0aCtpKStrXSA9IHRoaXMuaW1hZ2UucGl4ZWxzWzQqKCh0aGlzLmltYWdlLmhlaWdodC1qLTEpKnRoaXMuaW1hZ2Uud2lkdGgraSkra107XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlZmxlY3Rpb24ucGl4ZWxzWzQqKGoqdGhpcy5yZWZsZWN0aW9uLndpZHRoK2kpKzNdID0gXHJcbiAgICAgICAgICAgICAgICB0aGlzLmltYWdlLnBpeGVsc1s0KigodGhpcy5pbWFnZS5oZWlnaHQtai0xKSp0aGlzLmltYWdlLndpZHRoK2kpKzNdICogXHJcbiAgICAgICAgICAgICAgICAoKHRoaXMucmVmbGVjdGlvbi5oZWlnaHQtaikvdGhpcy5yZWZsZWN0aW9uLmhlaWdodCkgKiBcclxuICAgICAgICAgICAgICAgICh0aGlzLnJlZmxlY3Rpb24ud2lkdGgvMiswLjUtTWF0aC5hYnMoaS10aGlzLnJlZmxlY3Rpb24ud2lkdGgvMiswLjUpKS8odGhpcy5yZWZsZWN0aW9uLndpZHRoLzIpICogTWF0aC5taW4oMSwgMjgqMjgvdGhpcy5yZWZsZWN0aW9uLmhlaWdodC90aGlzLnJlZmxlY3Rpb24uaGVpZ2h0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnJlZmxlY3Rpb24udXBkYXRlUGl4ZWxzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKHRhcmdldDogYW55LCB4OiBudW1iZXIsIHk6IG51bWJlciwgd2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpIHtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKFdvcmxkVGlsZXMpO1xyXG4gICAgICAgIC8vIFZlcmlmeSB0aGF0IHRoZSBpbWFnZSBoYXMgYmVlbiBsb2FkZWRcclxuICAgICAgICBpZiAodGhpcy5pbWFnZSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAgICAgICAgICAgICBgVHJpZWQgdG8gcmVuZGVyIGltYWdlIGJlZm9yZSBsb2FkaW5nIGl0OiAke3RoaXMucGF0aH1gXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIC8vIERyYXcgbm9uIHRpbGVzIGltYWdlXHJcbiAgICAgICAgdGFyZ2V0LmltYWdlKHRoaXMuaW1hZ2UsIHgsIHksIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlclJvdGF0ZWQodGFyZ2V0OiBhbnksIHg6IG51bWJlciwgeTogbnVtYmVyLCB3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlciwgcm90YXRpb246IG51bWJlcikge1xyXG4gICAgICAgIC8vIFZlcmlmeSB0aGF0IHRoZSB0aWxlcyBoYXMgYmVlbiBsb2FkZWRcclxuICAgICAgICBpZiAodGhpcy5pbWFnZSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAgICAgICAgICAgICBgVHJpZWQgdG8gcmVuZGVyIGltYWdlIGJlZm9yZSBsb2FkaW5nIGl0OiAke3RoaXMucGF0aH1gXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIC8vIERyYXcgbm9uIHRpbGVzIGltYWdlXHJcbiAgICAgICAgdGFyZ2V0LnB1c2goKVxyXG4gICAgICAgIHRhcmdldC50cmFuc2xhdGUoLXdpZHRoLzIsIC1oZWlnaHQvMik7XHJcbiAgICAgICAgdGFyZ2V0LnJvdGF0ZShyb3RhdGlvbik7XHJcbiAgICAgICAgdGFyZ2V0LmltYWdlKHRoaXMuaW1hZ2UsIHgsIHksIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgIHRhcmdldC5wb3AoKVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICByZW5kZXJXb3JsZHNwYWNlUmVmbGVjdGlvbih0YXJnZXQ6IHA1LCB4OiBudW1iZXIsIHk6IG51bWJlciwgd2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpIHtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLmhhc1JlZmxlY3Rpb24pXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMucmVmbGVjdGlvbiA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAgICAgICAgICAgICBgVHJpZWQgdG8gcmVuZGVyIHJlZmxlY3Rpb24gb2YgaW1hZ2UgYmVmb3JlIGxvYWRpbmcgaXQ6ICR7dGhpcy5wYXRofWBcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgLy9sb29wIHRocm91Z2ggZXZlcnkgdGlsZSBpdCBwYXNzZXMgdGhyb3VnaFxyXG4gICAgICAgIGZvcihsZXQgaSA9IE1hdGguZmxvb3IoeCk7IGk8eCt3aWR0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaiA9IE1hdGguZmxvb3IoeSk7IGo8eStoZWlnaHQ7IGorKykge1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2codGFyZ2V0LndvcmxkLndvcmxkVGlsZXMpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGN1cnJlbnRCbG9jazogVGlsZVR5cGUgfCBzdHJpbmc7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50QmxvY2sgPSBnYW1lLndvcmxkLndvcmxkVGlsZXNbaiAqIGdhbWUud29ybGRXaWR0aCArIGldO1xyXG4gICAgICAgICAgICAgICAgaWYoY3VycmVudEJsb2NrID09PSB1bmRlZmluZWQgfHwgdHlwZW9mIGN1cnJlbnRCbG9jayA9PT0gXCJzdHJpbmdcIiB8fCBjdXJyZW50QmxvY2sgPT0gVGlsZVR5cGUuQWlyKSB7Ly90aGUgcmVmZXJlbmNlIHRvIFRpbGVFbnRpdHkgY2FuIGJlIHJlbW92ZWQgYXMgc29vbiBhcyB0aGUgYmV0dGVyIHN5c3RlbSBpcyBpbiBwbGFjZVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0LmRyYXdpbmdDb250ZXh0Lmdsb2JhbEFscGhhID0gdGhpcy5yZWZsZWN0aXZpdHlBcnJheVtjdXJyZW50QmxvY2tdLzI1NTsvL1RPRE8gbWFrZSB0aGlzIGJhc2VkIG9uIHRoZSB0aWxlIHJlZmxlY3Rpdml0eVxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0LmltYWdlKFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVmbGVjdGlvbixcclxuICAgICAgICAgICAgICAgICAgICAoaSAqIGdhbWUuVElMRV9XSURUSCAtXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdhbWUuaW50ZXJwb2xhdGVkQ2FtWCAqIGdhbWUuVElMRV9XSURUSCkgKlxyXG4gICAgICAgICAgICAgICAgICAgIGdhbWUudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIChqICogZ2FtZS5USUxFX0hFSUdIVCAtXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnYW1lLmludGVycG9sYXRlZENhbVkgKiBnYW1lLlRJTEVfSEVJR0hUKSAqXHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICBnYW1lLlRJTEVfV0lEVEgqZ2FtZS51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICBnYW1lLlRJTEVfSEVJR0hUKmdhbWUudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgICAgICAgICAgKGkteCkqZ2FtZS5USUxFX1dJRFRILFxyXG4gICAgICAgICAgICAgICAgICAgIChqLXkpKmdhbWUuVElMRV9IRUlHSFQsXHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS5USUxFX1dJRFRILFxyXG4gICAgICAgICAgICAgICAgICAgIGdhbWUuVElMRV9IRUlHSFRcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQuZHJhd2luZ0NvbnRleHQuZ2xvYmFsQWxwaGEgPSAxLjA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyUmVmbGVjdGlvbih0YXJnZXQ6IHA1LCB4OiBudW1iZXIsIHk6IG51bWJlciwgd2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIsIHdvcmxkVGlsZXM6IChzdHJpbmcgfCBUaWxlVHlwZSlbXSkge1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuaGFzUmVmbGVjdGlvbilcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5yZWZsZWN0aW9uID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcclxuICAgICAgICAgICAgICAgIGBUcmllZCB0byByZW5kZXIgcmVmbGVjdGlvbiBvZiBpbWFnZSBiZWZvcmUgbG9hZGluZyBpdDogJHt0aGlzLnBhdGh9YFxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAvL2xvb3AgdGhyb3VnaCBldmVyeSB0aWxlIGl0IHBhc3NlcyB0aHJvdWdoXHJcbiAgICAgICAgZm9yKGxldCBpID0gTWF0aC5mbG9vcih4KTsgaTx4K3dpZHRoOyBpKyspIHtcclxuICAgICAgICAgICAgZm9yKGxldCBqID0gTWF0aC5mbG9vcih5KTsgajx5K2hlaWdodDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0YXJnZXQud29ybGQud29ybGRUaWxlcyk7XHJcbiAgICAgICAgICAgICAgICBsZXQgY3VycmVudEJsb2NrOiBUaWxlVHlwZSB8IHN0cmluZztcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRCbG9jayA9IHdvcmxkVGlsZXNbaiAqIGdhbWUud29ybGRXaWR0aCArIGldO1xyXG4gICAgICAgICAgICAgICAgaWYoY3VycmVudEJsb2NrID09PSB1bmRlZmluZWQgfHwgdHlwZW9mIGN1cnJlbnRCbG9jayA9PT0gXCJzdHJpbmdcIiB8fCBjdXJyZW50QmxvY2sgPT0gVGlsZVR5cGUuQWlyKSB7Ly90aGUgcmVmZXJlbmNlIHRvIFRpbGVFbnRpdHkgY2FuIGJlIHJlbW92ZWQgYXMgc29vbiBhcyB0aGUgYmV0dGVyIHN5c3RlbSBpcyBpbiBwbGFjZVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0LmRyYXdpbmdDb250ZXh0Lmdsb2JhbEFscGhhID0gdGhpcy5yZWZsZWN0aXZpdHlBcnJheVtjdXJyZW50QmxvY2tdLzI1NTsvL1RPRE8gbWFrZSB0aGlzIGJhc2VkIG9uIHRoZSB0aWxlIHJlZmxlY3Rpdml0eVxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0LmltYWdlKFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVmbGVjdGlvbixcclxuICAgICAgICAgICAgICAgICAgICBpICogZ2FtZS5USUxFX1dJRFRILFxyXG4gICAgICAgICAgICAgICAgICAgIGoqZ2FtZS5USUxFX0hFSUdIVCxcclxuICAgICAgICAgICAgICAgICAgICBnYW1lLlRJTEVfV0lEVEgsXHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS5USUxFX0hFSUdIVCxcclxuICAgICAgICAgICAgICAgICAgICAoaS14KSpnYW1lLlRJTEVfV0lEVEgsXHJcbiAgICAgICAgICAgICAgICAgICAgKGoteSkqZ2FtZS5USUxFX0hFSUdIVCxcclxuICAgICAgICAgICAgICAgICAgICBnYW1lLlRJTEVfV0lEVEgsXHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS5USUxFX0hFSUdIVFxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIHRhcmdldC5kcmF3aW5nQ29udGV4dC5nbG9iYWxBbHBoYSA9IDEuMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZW5kZXJQYXJ0aWFsKFxyXG4gICAgICAgIHRhcmdldDogYW55LFxyXG4gICAgICAgIHg6IG51bWJlcixcclxuICAgICAgICB5OiBudW1iZXIsXHJcbiAgICAgICAgd2lkdGg6IG51bWJlcixcclxuICAgICAgICBoZWlnaHQ6IG51bWJlcixcclxuICAgICAgICBzb3VyY2VYPzogbnVtYmVyLFxyXG4gICAgICAgIHNvdXJjZVk/OiBudW1iZXIsXHJcbiAgICAgICAgc291cmNlV2lkdGg/OiBudW1iZXIsXHJcbiAgICAgICAgc291cmNlSGVpZ2h0PzogbnVtYmVyXHJcbiAgICApIHtcclxuICAgICAgICAvLyBWZXJpZnkgdGhhdCB0aGUgdGlsZXMgaGFzIGJlZW4gbG9hZGVkXHJcbiAgICAgICAgaWYgKHRoaXMuaW1hZ2UgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxyXG4gICAgICAgICAgICAgICAgYFRyaWVkIHRvIHJlbmRlciBpbWFnZSBiZWZvcmUgbG9hZGluZyBpdDogJHt0aGlzLnBhdGh9YFxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAvLyBEcmF3IGEgcGFydGlhbCBwYXJ0IG9mIHRoZSBpbWFnZVxyXG4gICAgICAgIHRhcmdldC5pbWFnZShcclxuICAgICAgICAgICAgdGhpcy5pbWFnZSxcclxuICAgICAgICAgICAgeCxcclxuICAgICAgICAgICAgeSxcclxuICAgICAgICAgICAgd2lkdGgsXHJcbiAgICAgICAgICAgIGhlaWdodCxcclxuICAgICAgICAgICAgc291cmNlWCxcclxuICAgICAgICAgICAgc291cmNlWSxcclxuICAgICAgICAgICAgc291cmNlV2lkdGgsXHJcbiAgICAgICAgICAgIHNvdXJjZUhlaWdodFxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgUDUgZnJvbSAncDUnO1xyXG5cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFJlc291cmNlIHtcclxuICAgIHBhdGg6IHN0cmluZztcclxuXHJcbiAgICBwcm90ZWN0ZWQgY29uc3RydWN0b3IocGF0aDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5wYXRoID0gcGF0aDtcclxuICAgIH1cclxuXHJcbiAgICBhYnN0cmFjdCBsb2FkUmVzb3VyY2Uoc2tldGNoOiBQNSk6IHZvaWQ7XHJcbn1cclxuIiwiaW1wb3J0IHsgSW1hZ2VSZXNvdXJjZSB9IGZyb20gJy4vSW1hZ2VSZXNvdXJjZSc7XHJcblxyXG5leHBvcnQgY2xhc3MgVGlsZVJlc291cmNlIGV4dGVuZHMgSW1hZ2VSZXNvdXJjZSB7XHJcbiAgICAvLyBUaGUgd2lkdGggYW5kIGhlaWdodCBvZiB0aGUgdGlsZXMgc2V0XHJcbiAgICB3aWR0aDogbnVtYmVyO1xyXG4gICAgaGVpZ2h0OiBudW1iZXI7XHJcblxyXG4gICAgLy8gVGhlIHdpZHRoIGFuZCBoZWlnaHQgb2YgZWFjaCB0aWxlcyBpbiBwaXhlbHNcclxuICAgIHRpbGVXaWR0aDogbnVtYmVyO1xyXG4gICAgdGlsZUhlaWdodDogbnVtYmVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHBhdGg6IHN0cmluZyxcclxuICAgICAgICB3aWR0aDogbnVtYmVyLFxyXG4gICAgICAgIGhlaWdodDogbnVtYmVyLFxyXG4gICAgICAgIHRpbGVXaWR0aDogbnVtYmVyLFxyXG4gICAgICAgIHRpbGVIZWlnaHQ6IG51bWJlclxyXG4gICAgKSB7XHJcbiAgICAgICAgc3VwZXIocGF0aCk7XHJcbiAgICAgICAgdGhpcy53aWR0aCA9IHdpZHRoO1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG4gICAgICAgIHRoaXMudGlsZVdpZHRoID0gdGlsZVdpZHRoO1xyXG4gICAgICAgIHRoaXMudGlsZUhlaWdodCA9IHRpbGVIZWlnaHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyVGlsZShcclxuICAgICAgICBpOiBudW1iZXIsXHJcbiAgICAgICAgdGFyZ2V0OiBhbnksXHJcbiAgICAgICAgeDogbnVtYmVyLFxyXG4gICAgICAgIHk6IG51bWJlcixcclxuICAgICAgICB3aWR0aDogbnVtYmVyLFxyXG4gICAgICAgIGhlaWdodDogbnVtYmVyXHJcbiAgICApIHtcclxuICAgICAgICBjb25zdCB0aWxlU2V0WCA9IGkgJSB0aGlzLndpZHRoO1xyXG4gICAgICAgIGNvbnN0IHRpbGVTZXRZID0gTWF0aC5mbG9vcihpIC8gdGhpcy53aWR0aCk7XHJcblxyXG4gICAgICAgIC8vIE1ha2Ugc3VyZSB0aGUgdGlsZXMgaXNuJ3Qgb3V0IG9mIGJvdW5kc1xyXG4gICAgICAgIGlmICh0aWxlU2V0WSA+IHRoaXMuaGVpZ2h0KVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAgICAgICAgICAgICBgT3V0IG9mIGJvdW5kcyB0aWxlLiBUcmllZCB0byByZW5kZXIgdGlsZSBpbmRleCAke2l9IHdpdGggYSBtYXhpbXVtIG9mICR7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53aWR0aCAqIHRoaXMuaGVpZ2h0XHJcbiAgICAgICAgICAgICAgICB9IHRpbGVzYFxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICBzdXBlci5yZW5kZXJQYXJ0aWFsKFxyXG4gICAgICAgICAgICB0YXJnZXQsXHJcbiAgICAgICAgICAgIHgsXHJcbiAgICAgICAgICAgIHksXHJcbiAgICAgICAgICAgIHdpZHRoLFxyXG4gICAgICAgICAgICBoZWlnaHQsXHJcbiAgICAgICAgICAgIHRpbGVTZXRYICogdGhpcy50aWxlV2lkdGgsXHJcbiAgICAgICAgICAgIHRpbGVTZXRZICogdGhpcy50aWxlSGVpZ2h0LFxyXG4gICAgICAgICAgICB0aGlzLnRpbGVXaWR0aCxcclxuICAgICAgICAgICAgdGhpcy50aWxlSGVpZ2h0XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRUaWxlQXRDb29yZGluYXRlKFxyXG4gICAgICAgIHg6IG51bWJlcixcclxuICAgICAgICB5OiBudW1iZXIsXHJcbiAgICAgICAgdGFyZ2V0OiBhbnksXHJcbiAgICAgICAgeFBvczogbnVtYmVyLFxyXG4gICAgICAgIHlQb3M6IG51bWJlcixcclxuICAgICAgICB3aWR0aDogbnVtYmVyLFxyXG4gICAgICAgIGhlaWdodDogbnVtYmVyXHJcbiAgICApIHtcclxuICAgICAgICBpZiAoeCA+IHRoaXMud2lkdGggfHwgeSA+IHRoaXMuaGVpZ2h0IHx8IHggPCAwIHx8IHkgPCAwKVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAgICAgICAgICAgICBgT3V0IG9mIGJvdW5kcyB0aWxlLiBUcmllZCB0byBsb2FkIHRpbGUgYXQgJHt4fSwgJHt5fSBvbiBhICR7dGhpcy53aWR0aH0sICR7dGhpcy5oZWlnaHR9IGdyaWRgXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIHN1cGVyLnJlbmRlclBhcnRpYWwoXHJcbiAgICAgICAgICAgIHRhcmdldCxcclxuICAgICAgICAgICAgeFBvcyxcclxuICAgICAgICAgICAgeVBvcyxcclxuICAgICAgICAgICAgd2lkdGgsXHJcbiAgICAgICAgICAgIGhlaWdodCxcclxuICAgICAgICAgICAgeCAqIHRoaXMudGlsZVdpZHRoLFxyXG4gICAgICAgICAgICB5ICogdGhpcy50aWxlSGVpZ2h0LFxyXG4gICAgICAgICAgICB0aGlzLnRpbGVXaWR0aCxcclxuICAgICAgICAgICAgdGhpcy50aWxlSGVpZ2h0XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufSIsImV4cG9ydCBjbGFzcyBDb250cm9sIHtcclxuICAgIGtleWJvYXJkOiBib29sZWFuXHJcbiAgICBrZXlDb2RlOiBudW1iZXJcclxuICAgIGRlc2NyaXB0aW9uOiBzdHJpbmdcclxuICAgIG9uUHJlc3NlZDogKCkgPT4gdm9pZFxyXG4gICAgb25SZWxlYXNlZDogKCkgPT4gdm9pZFxyXG5cclxuICAgIGNvbnN0cnVjdG9yKGRlc2NyaXB0aW9uOiBzdHJpbmcsIGtleWJvYXJkOiBib29sZWFuLCBrZXlDb2RlOiBudW1iZXIsIG9uUHJlc3NlZDogKCkgPT4gdm9pZCwgb25SZWxlYXNlZD86ICgpID0+IHZvaWQpIHtcclxuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb25cclxuICAgICAgICB0aGlzLmtleWJvYXJkID0ga2V5Ym9hcmQ7XHJcbiAgICAgICAgdGhpcy5rZXlDb2RlID0ga2V5Q29kZTtcclxuICAgICAgICB0aGlzLm9uUHJlc3NlZCA9IG9uUHJlc3NlZDtcclxuICAgICAgICB0aGlzLm9uUmVsZWFzZWQgPSBvblJlbGVhc2VkIHx8IGZ1bmN0aW9uKCl7fTsvL2ZvciBzb21lIHJlYXNvbiBhcnJvdyBmdW5jdGlvbiBkb2Vzbid0IGxpa2UgdG8gZXhpc3QgaGVyZSBidXQgaSdtIG5vdCBnb25uYSB3b3JyeSB0b28gbXVjaFxyXG4gICAgICAgIC8vaWYgaXQncyB0b28gdWdseSwgeW91IGNhbiB0cnkgdG8gZml4IGl0XHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IHsgSW52ZW50b3J5UGF5bG9hZCwgSXRlbUNhdGVnb3JpZXMsIEl0ZW1zLCBJdGVtU3RhY2sgfSBmcm9tICcuLi8uLi9nbG9iYWwvSW52ZW50b3J5JztcclxuaW1wb3J0IHsgVGlsZVR5cGUgfSBmcm9tICcuLi8uLi9nbG9iYWwvVGlsZSc7XHJcbmltcG9ydCB7IGdhbWUgfSBmcm9tICcuLi9HYW1lJztcclxuaW1wb3J0IHsgQ29sb3JQYXJ0aWNsZSB9IGZyb20gJy4uL3dvcmxkL3BhcnRpY2xlcy9Db2xvclBhcnRpY2xlJztcclxuaW1wb3J0IHsgV29ybGRUaWxlcyB9IGZyb20gJy4uL3dvcmxkL1dvcmxkVGlsZXMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEludmVudG9yeSB7XHJcblxyXG5cdGl0ZW1zOiAoSXRlbVN0YWNrIHwgdW5kZWZpbmVkIHwgbnVsbClbXTtcclxuXHJcblx0d2lkdGg6IG51bWJlcjtcclxuXHRoZWlnaHQ6IG51bWJlcjtcclxuXHJcblx0c2VsZWN0ZWRTbG90OiBudW1iZXIgPSAwXHJcblx0cGlja2VkVXBTbG90OiBudW1iZXIgfCB1bmRlZmluZWQgPSB1bmRlZmluZWRcclxuXHJcblx0Y29uc3RydWN0b3IoaW52ZW50b3J5OiBJbnZlbnRvcnlQYXlsb2FkKSB7XHJcblx0XHR0aGlzLml0ZW1zID0gaW52ZW50b3J5Lml0ZW1zXHJcblx0XHR0aGlzLndpZHRoID0gaW52ZW50b3J5LndpZHRoXHJcblx0XHR0aGlzLmhlaWdodCA9IGludmVudG9yeS5oZWlnaHRcclxuXHR9XHJcblxyXG5cdHdvcmxkQ2xpY2soeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuXHRcdGNvbnN0IHNlbGVjdGVkSXRlbSA9IHRoaXMuaXRlbXNbdGhpcy5zZWxlY3RlZFNsb3RdXHJcblx0XHRpZihzZWxlY3RlZEl0ZW0gPT09IHVuZGVmaW5lZCB8fCBzZWxlY3RlZEl0ZW0gPT09IG51bGwpIHtcclxuXHRcdFx0Ly9jb25zb2xlLmVycm9yKFwiQnJlYWtpbmcgdGlsZVwiKVxyXG5cdFx0XHRsZXQgdGlsZUJlaW5nQnJva2VuID0gZ2FtZS53b3JsZC53b3JsZFRpbGVzW2dhbWUud29ybGQud2lkdGggKiB5ICsgeF07XHJcblx0XHRcdGlmKHR5cGVvZiB0aWxlQmVpbmdCcm9rZW4gPT09ICdudW1iZXInKSB7XHJcblx0XHRcdFx0bGV0IHdvcmxkVGlsZUJlaW5nQnJva2VuID0gV29ybGRUaWxlc1t0aWxlQmVpbmdCcm9rZW5dXHJcblx0XHRcdFx0Zm9yKGxldCBpID0gMDsgaTw1KmdhbWUucGFydGljbGVNdWx0aXBsaWVyOyBpKyspIHtcclxuXHRcdFx0XHRcdGlmICh3b3JsZFRpbGVCZWluZ0Jyb2tlbiAhPT0gdW5kZWZpbmVkKVxyXG5cdFx0XHRcdFx0Z2FtZS5wYXJ0aWNsZXMucHVzaChuZXcgQ29sb3JQYXJ0aWNsZSh3b3JsZFRpbGVCZWluZ0Jyb2tlbi5jb2xvciwgTWF0aC5yYW5kb20oKSowLjIrMC4xLCAxMCwgeCtNYXRoLnJhbmRvbSgpLCB5K01hdGgucmFuZG9tKCksIDAuMiooTWF0aC5yYW5kb20oKS0wLjUpLCAtMC4xNSpNYXRoLnJhbmRvbSgpKSlcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0Z2FtZS5jb25uZWN0aW9uLmVtaXQoXHJcblx0XHRcdFx0J3dvcmxkQnJlYWtTdGFydCcsXHJcblx0XHRcdFx0Z2FtZS53b3JsZC53aWR0aCAqIHkgKyB4XHJcblx0XHRcdCk7XHJcblx0XHRcdGdhbWUuY29ubmVjdGlvbi5lbWl0KCd3b3JsZEJyZWFrRmluaXNoJyk7XHJcblx0XHRcdHJldHVyblxyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IHdvcmxkQ2xpY2sgPSBJdGVtQWN0aW9uc1tJdGVtc1tzZWxlY3RlZEl0ZW0uaXRlbV0udHlwZV0ud29ybGRDbGlja1xyXG5cdFx0aWYod29ybGRDbGljayA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdGNvbnNvbGUuZXJyb3IoXCJDYW5ub3QgcGxhY2Ugc2VsZWN0ZWQgaXRlbVwiKVxyXG5cdFx0XHRyZXR1cm5cclxuXHRcdH1cclxuXHJcblx0XHR3b3JsZENsaWNrKHgsIHkpXHJcblx0fVxyXG5cdHdvcmxkQ2xpY2tDaGVjayh4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG5cdFx0bGV0IHRpbGVCZWluZ0Jyb2tlbiA9IGdhbWUud29ybGQud29ybGRUaWxlc1tnYW1lLndvcmxkLndpZHRoICogeSArIHhdO1xyXG5cdFx0aWYodHlwZW9mIHRpbGVCZWluZ0Jyb2tlbiA9PT0gJ251bWJlcicpIHtcclxuXHRcdFx0aWYgKHRpbGVCZWluZ0Jyb2tlbiA9PT0gVGlsZVR5cGUuQWlyKSBnYW1lLmJyZWFraW5nID0gZmFsc2U7XHJcblx0XHRcdGVsc2UgZ2FtZS5icmVha2luZyA9IHRydWU7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5pbnRlcmZhY2UgSXRlbUJhc2Uge1xyXG5cdHdvcmxkQ2xpY2s/OiAoeDogbnVtYmVyLCB5OiBudW1iZXIpID0+IHZvaWRcclxufVxyXG5cclxuY29uc3QgSXRlbUFjdGlvbnM6IFJlY29yZDxJdGVtQ2F0ZWdvcmllcywgSXRlbUJhc2U+ID0ge1xyXG5cdFtJdGVtQ2F0ZWdvcmllcy5UaWxlXToge1xyXG5cdFx0d29ybGRDbGljayh4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG5cdFx0XHQvLyBJZiB0aGUgdGlsZSBpc24ndCBhaXJcclxuXHRcdFx0aWYgKFxyXG5cdFx0XHRcdGdhbWUud29ybGQud29ybGRUaWxlc1tcclxuXHRcdFx0XHRnYW1lLndvcmxkLndpZHRoICogeSArIHhcclxuXHRcdFx0XHRcdF0gIT09IFRpbGVUeXBlLkFpclxyXG5cdFx0XHQpIHtcclxuXHJcblx0XHRcdFx0bGV0IHRpbGVCZWluZ0Jyb2tlbiA9IGdhbWUud29ybGQud29ybGRUaWxlc1tnYW1lLndvcmxkLndpZHRoICogeSArIHhdO1xyXG5cdFx0XHRcdGlmKHR5cGVvZiB0aWxlQmVpbmdCcm9rZW4gPT09ICdudW1iZXInKSB7Ly90aWxlIGlzIHRpbGVcclxuXHRcdFx0XHRcdGlmICghZ2FtZS5icmVha2luZykgcmV0dXJuO1xyXG5cdFx0XHRcdFx0bGV0IHdvcmxkVGlsZUJlaW5nQnJva2VuID0gV29ybGRUaWxlc1t0aWxlQmVpbmdCcm9rZW5dXHJcblx0XHRcdFx0XHRmb3IobGV0IGkgPSAwOyBpPDUqZ2FtZS5wYXJ0aWNsZU11bHRpcGxpZXI7IGkrKykge1xyXG5cdFx0XHRcdFx0XHRpZiAod29ybGRUaWxlQmVpbmdCcm9rZW4gIT09IHVuZGVmaW5lZClcclxuXHRcdFx0XHRcdFx0Z2FtZS5wYXJ0aWNsZXMucHVzaChuZXcgQ29sb3JQYXJ0aWNsZSh3b3JsZFRpbGVCZWluZ0Jyb2tlbi5jb2xvciwgTWF0aC5yYW5kb20oKSowLjIrMC4xLCAxMCwgeCtNYXRoLnJhbmRvbSgpLCB5K01hdGgucmFuZG9tKCksIDAuMiooTWF0aC5yYW5kb20oKS0wLjUpLCAtMC4xNSpNYXRoLnJhbmRvbSgpKSlcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGNvbnNvbGUuaW5mbygnYnJlYWtpbmcnKTtcclxuXHRcdFx0XHRcdGdhbWUuY29ubmVjdGlvbi5lbWl0KFxyXG5cdFx0XHRcdFx0XHQnd29ybGRCcmVha1N0YXJ0JyxcclxuXHRcdFx0XHRcdFx0Z2FtZS53b3JsZC53aWR0aCAqIHkgKyB4XHJcblx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdFx0Z2FtZS5jb25uZWN0aW9uLmVtaXQoXHJcblx0XHRcdFx0XHRcdCd3b3JsZEJyZWFrRmluaXNoJ1xyXG5cdFx0XHRcdFx0KTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7Ly90aWxlIGlzIHRpbGUgZW50aXR5XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcInRpbGUgZW50aXR5IGludGVyYWN0XCIpXHJcblx0XHRcdFx0XHRnYW1lLmNvbm5lY3Rpb24uZW1pdChcclxuXHRcdFx0XHRcdFx0J3dvcmxkQnJlYWtTdGFydCcsXHJcblx0XHRcdFx0XHRcdGdhbWUud29ybGQud2lkdGggKiB5ICsgeFxyXG5cdFx0XHRcdFx0KTtcclxuXHRcdFx0XHRcdGdhbWUuY29ubmVjdGlvbi5lbWl0KFxyXG5cdFx0XHRcdFx0XHQnd29ybGRCcmVha0ZpbmlzaCdcclxuXHRcdFx0XHRcdCk7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdC8vaWYgdGhlIHRpbGUgaXMgYWlyIGFuZCB0aGUgZ2FtZSBpcyB0cnlpbmcgdG8gcGxhY2VcclxuXHRcdFx0aWYgKGdhbWUuYnJlYWtpbmcpIHJldHVybjtcclxuXHRcdFx0Y29uc29sZS5pbmZvKCdQbGFjaW5nJyk7XHJcblx0XHRcdGdhbWUuY29ubmVjdGlvbi5lbWl0KFxyXG5cdFx0XHRcdCd3b3JsZFBsYWNlJyxcclxuXHRcdFx0XHRnYW1lLndvcmxkLmludmVudG9yeS5zZWxlY3RlZFNsb3QsXHJcblx0XHRcdFx0eCxcclxuXHRcdFx0XHR5XHJcblx0XHRcdCk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRbSXRlbUNhdGVnb3JpZXMuUmVzb3VyY2VdOiB7fSxcclxuXHRbSXRlbUNhdGVnb3JpZXMuVG9vbF06IHt9LFxyXG5cdFtJdGVtQ2F0ZWdvcmllcy5UaWxlRW50aXR5XToge1xyXG5cdFx0d29ybGRDbGljayh4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG5cdFx0XHRsZXQgaXRlbVJlZiA9IEl0ZW1zW2dhbWUud29ybGQuaW52ZW50b3J5Lml0ZW1zW2dhbWUud29ybGQuaW52ZW50b3J5LnNlbGVjdGVkU2xvdF0/Lml0ZW0gfHwgMF07XHJcblx0XHRcdGxldCBvZmZzZXQ6IFtudW1iZXIsIG51bWJlcl0gPSBbMCwgMF1cclxuXHRcdFx0aWYoXCJ0aWxlRW50aXR5T2Zmc2V0XCIgaW4gaXRlbVJlZikge1xyXG5cdFx0XHRcdG9mZnNldCA9IGl0ZW1SZWYudGlsZUVudGl0eU9mZnNldDtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0Z2FtZS5jb25uZWN0aW9uLmVtaXQoXHJcblx0XHRcdFx0J3dvcmxkUGxhY2UnLFxyXG5cdFx0XHRcdGdhbWUud29ybGQuaW52ZW50b3J5LnNlbGVjdGVkU2xvdCxcclxuXHRcdFx0XHR4LFxyXG5cdFx0XHRcdHlcclxuXHRcdFx0KTtcclxuXHRcdH1cclxuXHR9LFxyXG59IiwiaW1wb3J0IHA1IGZyb20gJ3A1JztcclxuaW1wb3J0IHsgRW50aXRpZXMsIEVudGl0eVBheWxvYWQgfSBmcm9tICcuLi8uLi9nbG9iYWwvRW50aXR5JztcclxuaW1wb3J0IHsgZ2FtZSB9IGZyb20gJy4uL0dhbWUnO1xyXG5pbXBvcnQgeyBTZXJ2ZXJFbnRpdHkgfSBmcm9tICcuLi93b3JsZC9lbnRpdGllcy9TZXJ2ZXJFbnRpdHknO1xyXG4vLyBpbXBvcnQgeyBDb2xvclBhcnRpY2xlIH0gZnJvbSAnLi4vd29ybGQvJztcclxuaW1wb3J0IHsgQW5pbWF0aW9uRnJhbWUsIEZvbnRzLCBQbGF5ZXJBbmltYXRpb25zIH0gZnJvbSAnLi4vYXNzZXRzL0Fzc2V0cyc7XHJcbmltcG9ydCB7IFRpbGVUeXBlIH0gZnJvbSAnLi4vLi4vZ2xvYmFsL1RpbGUnO1xyXG5pbXBvcnQgeyBXb3JsZFRpbGVzIH0gZnJvbSAnLi4vd29ybGQvV29ybGRUaWxlcyc7XHJcbmltcG9ydCB7IENvbG9yUGFydGljbGUgfSBmcm9tICcuLi93b3JsZC9wYXJ0aWNsZXMvQ29sb3JQYXJ0aWNsZSc7XHJcblxyXG5leHBvcnQgY2xhc3MgUGxheWVyTG9jYWwgZXh0ZW5kcyBTZXJ2ZXJFbnRpdHkge1xyXG4gICAgLy8gQ29uc3RhbnQgZGF0YVxyXG4gICAgd2lkdGg6IG51bWJlciA9IDEyIC8gZ2FtZS5USUxFX1dJRFRIO1xyXG4gICAgaGVpZ2h0OiBudW1iZXIgPSAyOCAvIGdhbWUuVElMRV9IRUlHSFQ7XHJcblxyXG4gICAgLy8gU2hhcmVkIGRhdGFcclxuICAgIG5hbWU6IHN0cmluZztcclxuXHJcbiAgICAvLyBMb2NhbCBkYXRhXHJcbiAgICB4VmVsOiBudW1iZXIgPSAwO1xyXG4gICAgeVZlbDogbnVtYmVyID0gMDtcclxuICAgIHNsaWRlWDogbnVtYmVyO1xyXG4gICAgc2xpZGVZOiBudW1iZXI7XHJcbiAgICBpbnRlcnBvbGF0ZWRYOiBudW1iZXI7XHJcbiAgICBpbnRlcnBvbGF0ZWRZOiBudW1iZXI7XHJcblxyXG4gICAgcFg6IG51bWJlcjtcclxuICAgIHBZOiBudW1iZXI7XHJcbiAgICBwWFZlbDogbnVtYmVyID0gMDtcclxuICAgIHBZVmVsOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIGdyb3VuZGVkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwR3JvdW5kZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICBjb2xsaXNpb25EYXRhOiBhbnk7XHJcbiAgICBjbG9zZXN0Q29sbGlzaW9uOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl07XHJcblxyXG4gICAgbWFzczogbnVtYmVyID0gdGhpcy53aWR0aCAqIHRoaXMuaGVpZ2h0O1xyXG5cclxuXHJcbiAgICAvL2lucHV0IGJvb2xlYW5zXHJcbiAgICByaWdodEJ1dHRvbjogYm9vbGVhbjtcclxuICAgIGxlZnRCdXR0b246IGJvb2xlYW47XHJcbiAgICBqdW1wQnV0dG9uOiBib29sZWFuO1xyXG5cclxuICAgIGNvbG9yMTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPSBbMCwgMCwgMCwgMjU1XVxyXG4gICAgY29sb3IyOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9IFswLCAwLCAwLCAyNTVdXHJcblxyXG4gICAgY3VycmVudEFuaW1hdGlvbjogQW5pbWF0aW9uRnJhbWU8dHlwZW9mIFBsYXllckFuaW1hdGlvbnM+ID0gXCJpZGxlXCI7XHJcbiAgICBhbmltRnJhbWU6IG51bWJlciA9IDA7XHJcbiAgICB0aW1lSW5UaGlzQW5pbWF0aW9uRnJhbWUgPSAwO1xyXG4gICAgZmFjaW5nUmlnaHQgPSB0cnVlO1xyXG5cclxuICAgIHRvcENvbGxpc2lvbjogKHR5cGVvZiBXb3JsZFRpbGVzW1RpbGVUeXBlLkFpcl0pID0gV29ybGRUaWxlc1tUaWxlVHlwZS5BaXJdOy8vaGFja3lcclxuICAgIGJvdHRvbUNvbGxpc2lvbjogKHR5cGVvZiBXb3JsZFRpbGVzW1RpbGVUeXBlLkFpcl0pID0gV29ybGRUaWxlc1tUaWxlVHlwZS5BaXJdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIGRhdGE6IEVudGl0eVBheWxvYWQ8RW50aXRpZXMuTG9jYWxQbGF5ZXI+XHJcbiAgICApIHtcclxuICAgICAgICBzdXBlcihkYXRhLmlkKVxyXG5cclxuICAgICAgICB0aGlzLm5hbWUgPSBkYXRhLmRhdGEubmFtZTtcclxuXHJcbiAgICAgICAgdGhpcy54ID0gZGF0YS5kYXRhLng7XHJcbiAgICAgICAgdGhpcy55ID0gZGF0YS5kYXRhLnk7XHJcblxyXG4gICAgICAgIHRoaXMucFggPSB0aGlzLng7XHJcbiAgICAgICAgdGhpcy5wWSA9IHRoaXMueTtcclxuXHJcbiAgICAgICAgdGhpcy5pbnRlcnBvbGF0ZWRYID0gdGhpcy54O1xyXG4gICAgICAgIHRoaXMuaW50ZXJwb2xhdGVkWSA9IHRoaXMueTtcclxuXHJcbiAgICAgICAgdGhpcy5jbG9zZXN0Q29sbGlzaW9uID0gWzEsIDAsIEluZmluaXR5XTtcclxuICAgIFxyXG4gICAgICAgIHRoaXMubGVmdEJ1dHRvbiA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucmlnaHRCdXR0b24gPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmp1bXBCdXR0b24gPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIodGFyZ2V0OiBwNSwgdXBzY2FsZVNpemU6IG51bWJlcik6IHZvaWQge1xyXG5cclxuICAgICAgICB0aGlzLnRpbWVJblRoaXNBbmltYXRpb25GcmFtZSArPSBnYW1lLmRlbHRhVGltZTtcclxuICAgICAgICBpZih0aGlzLnRpbWVJblRoaXNBbmltYXRpb25GcmFtZT5QbGF5ZXJBbmltYXRpb25zW3RoaXMuY3VycmVudEFuaW1hdGlvbl1bdGhpcy5hbmltRnJhbWVdWzFdKSB7XHJcbiAgICAgICAgICAgIHRoaXMudGltZUluVGhpc0FuaW1hdGlvbkZyYW1lID0gMDsvL3RoaXMgZG9lcyBpbnRyb2R1Y2Ugc29tZSBzbGlnaHQgaW5hY2N1cmFjaWVzIHZzIHN1YnRyYWN0aW5nIGl0LCBidXQsIHdoZW4geW91IHRhYiBiYWNrIGludG8gdGhlIGJyb3dzZXIgYWZ0ZXIgYmVpbmcgdGFiYmVkIG91dCwgc3VidHJhY3RpbmcgaXQgY2F1c2VzIHNwYXp6aW5nXHJcbiAgICAgICAgICAgIHRoaXMuYW5pbUZyYW1lKys7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuYW5pbUZyYW1lPj1QbGF5ZXJBbmltYXRpb25zW3RoaXMuY3VycmVudEFuaW1hdGlvbl0ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFuaW1GcmFtZSA9IHRoaXMuYW5pbUZyYW1lJVBsYXllckFuaW1hdGlvbnNbdGhpcy5jdXJyZW50QW5pbWF0aW9uXS5sZW5ndGg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHRhcmdldC5yZWN0KFxyXG4gICAgICAgIC8vICAgICAodGhpcy5pbnRlcnBvbGF0ZWRYICogZ2FtZS5USUxFX1dJRFRIIC1cclxuICAgICAgICAvLyAgICAgICAgIGdhbWUuaW50ZXJwb2xhdGVkQ2FtWCAqIGdhbWUuVElMRV9XSURUSCkgKlxyXG4gICAgICAgIC8vICAgICAgICAgdXBzY2FsZVNpemUsXHJcbiAgICAgICAgLy8gICAgICh0aGlzLmludGVycG9sYXRlZFkgKiBnYW1lLlRJTEVfSEVJR0hUIC1cclxuICAgICAgICAvLyAgICAgICAgIGdhbWUuaW50ZXJwb2xhdGVkQ2FtWSAqIGdhbWUuVElMRV9IRUlHSFQpICpcclxuICAgICAgICAvLyAgICAgICAgIHVwc2NhbGVTaXplLFxyXG4gICAgICAgIC8vICAgICB0aGlzLndpZHRoICogdXBzY2FsZVNpemUgKiBnYW1lLlRJTEVfV0lEVEgsXHJcbiAgICAgICAgLy8gICAgIHRoaXMuaGVpZ2h0ICogdXBzY2FsZVNpemUgKiBnYW1lLlRJTEVfSEVJR0hUXHJcbiAgICAgICAgLy8gKTtcclxuICAgICAgICBQbGF5ZXJBbmltYXRpb25zW3RoaXMuY3VycmVudEFuaW1hdGlvbl1bdGhpcy5hbmltRnJhbWVdWzBdLnJlbmRlclxyXG4gICAgICAgICAgICAoXHJcbiAgICAgICAgICAgICAgICB0YXJnZXQsXHJcbiAgICAgICAgICAgICAgICBNYXRoLnJvdW5kKCh0aGlzLmludGVycG9sYXRlZFggKiBnYW1lLlRJTEVfV0lEVEggLVxyXG4gICAgICAgICAgICAgICAgICAgIGdhbWUuaW50ZXJwb2xhdGVkQ2FtWCAqIGdhbWUuVElMRV9XSURUSCkgKlxyXG4gICAgICAgICAgICAgICAgdXBzY2FsZVNpemUpLFxyXG4gICAgICAgICAgICAgICAgTWF0aC5yb3VuZCgodGhpcy5pbnRlcnBvbGF0ZWRZICogZ2FtZS5USUxFX0hFSUdIVCAtXHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS5pbnRlcnBvbGF0ZWRDYW1ZICogZ2FtZS5USUxFX0hFSUdIVCkgKlxyXG4gICAgICAgICAgICAgICAgdXBzY2FsZVNpemUpLFxyXG4gICAgICAgICAgICAgICAgdGhpcy53aWR0aCAqIHVwc2NhbGVTaXplICogZ2FtZS5USUxFX1dJRFRILFxyXG4gICAgICAgICAgICAgICAgdGhpcy5oZWlnaHQgKiB1cHNjYWxlU2l6ZSAqIGdhbWUuVElMRV9IRUlHSFRcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgUGxheWVyQW5pbWF0aW9uc1t0aGlzLmN1cnJlbnRBbmltYXRpb25dW3RoaXMuYW5pbUZyYW1lXVswXS5yZW5kZXJXb3JsZHNwYWNlUmVmbGVjdGlvblxyXG4gICAgICAgICAgICAoXHJcbiAgICAgICAgICAgICAgICBnYW1lLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5pbnRlcnBvbGF0ZWRYLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5pbnRlcnBvbGF0ZWRZK3RoaXMuaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgdGhpcy53aWR0aCxcclxuICAgICAgICAgICAgICAgIHRoaXMuaGVpZ2h0XHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICB0YXJnZXQuZmlsbCh0aGlzLmNvbG9yMSk7XHJcbiAgICAgICAgdGFyZ2V0Lm5vU3Ryb2tlKCk7XHJcbiAgICAgICAgdGFyZ2V0LnJlY3QoXHJcbiAgICAgICAgICAgICh0aGlzLmludGVycG9sYXRlZFggKiBnYW1lLlRJTEVfV0lEVEggLVxyXG4gICAgICAgICAgICAgICAgZ2FtZS5pbnRlcnBvbGF0ZWRDYW1YICogZ2FtZS5USUxFX1dJRFRIICtcclxuICAgICAgICAgICAgICAgICh0aGlzLndpZHRoICogZ2FtZS5USUxFX1dJRFRIKSAvIDIpICpcclxuICAgICAgICAgICAgICAgIHVwc2NhbGVTaXplLSh0aGlzLm5hbWUubGVuZ3RoKjIqZ2FtZS51cHNjYWxlU2l6ZSksXHJcbiAgICAgICAgICAgICAgICAodGhpcy5pbnRlcnBvbGF0ZWRZICogZ2FtZS5USUxFX0hFSUdIVCAtXHJcbiAgICAgICAgICAgICAgICBnYW1lLmludGVycG9sYXRlZENhbVkgKiBnYW1lLlRJTEVfSEVJR0hUIC1cclxuICAgICAgICAgICAgICAgICh0aGlzLmhlaWdodCAqIGdhbWUuVElMRV9IRUlHSFQpIC8gMi41ICsgNCkgKlxyXG4gICAgICAgICAgICAgICAgdXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgICAgICAodGhpcy5uYW1lLmxlbmd0aCo0KmdhbWUudXBzY2FsZVNpemUpLFxyXG4gICAgICAgICAgICAgICAgZ2FtZS51cHNjYWxlU2l6ZSk7XHJcblxyXG4gICAgICAgIHRhcmdldC5yZWN0KFxyXG4gICAgICAgICAgICAgICAgICAgICh0aGlzLmludGVycG9sYXRlZFggKiBnYW1lLlRJTEVfV0lEVEggLVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBnYW1lLmludGVycG9sYXRlZENhbVggKiBnYW1lLlRJTEVfV0lEVEggK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAodGhpcy53aWR0aCAqIGdhbWUuVElMRV9XSURUSCkgLyAyKSAqXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwc2NhbGVTaXplLSgodGhpcy5uYW1lLmxlbmd0aCoyLTIpKmdhbWUudXBzY2FsZVNpemUpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAodGhpcy5pbnRlcnBvbGF0ZWRZICogZ2FtZS5USUxFX0hFSUdIVCAtXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdhbWUuaW50ZXJwb2xhdGVkQ2FtWSAqIGdhbWUuVElMRV9IRUlHSFQgLVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAodGhpcy5oZWlnaHQgKiBnYW1lLlRJTEVfSEVJR0hUKSAvIDIuNSArIDYpICpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICgodGhpcy5uYW1lLmxlbmd0aCo0LTQpKmdhbWUudXBzY2FsZVNpemUpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBnYW1lLnVwc2NhbGVTaXplKTtcclxuXHJcbiAgICAgICAgRm9udHMudG9tX3RodW1iLmRyYXdUZXh0KFxyXG4gICAgICAgICAgICBnYW1lLFxyXG4gICAgICAgICAgICB0aGlzLm5hbWUsXHJcbiAgICAgICAgICAgICh0aGlzLmludGVycG9sYXRlZFggKiBnYW1lLlRJTEVfV0lEVEggLVxyXG4gICAgICAgICAgICAgICAgZ2FtZS5pbnRlcnBvbGF0ZWRDYW1YICogZ2FtZS5USUxFX1dJRFRIICtcclxuICAgICAgICAgICAgICAgICh0aGlzLndpZHRoICogZ2FtZS5USUxFX1dJRFRIKSAvIDIpICpcclxuICAgICAgICAgICAgICAgIHVwc2NhbGVTaXplLSh0aGlzLm5hbWUubGVuZ3RoKjIqZ2FtZS51cHNjYWxlU2l6ZSksXHJcbiAgICAgICAgICAgICh0aGlzLmludGVycG9sYXRlZFkgKiBnYW1lLlRJTEVfSEVJR0hUIC1cclxuICAgICAgICAgICAgICAgIGdhbWUuaW50ZXJwb2xhdGVkQ2FtWSAqIGdhbWUuVElMRV9IRUlHSFQgLVxyXG4gICAgICAgICAgICAgICAgKHRoaXMuaGVpZ2h0ICogZ2FtZS5USUxFX0hFSUdIVCkgLyAyLjUtMikgKlxyXG4gICAgICAgICAgICAgICAgdXBzY2FsZVNpemVcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZURhdGEoZGF0YTogRW50aXR5UGF5bG9hZCk6IHZvaWQge1xyXG4gICAgICAgIGlmIChkYXRhLnR5cGUgPT09IEVudGl0aWVzLlBsYXllcikgdGhpcy5uYW1lID0gZGF0YS5kYXRhLm5hbWU7XHJcbiAgICB9XHJcblxyXG4gICAga2V5Ym9hcmRJbnB1dCgpIHtcclxuXHJcbiAgICAgICAgdGhpcy54VmVsICs9XHJcbiAgICAgICAgICAgIDAuMDIgKiAoK3RoaXMucmlnaHRCdXR0b24gLSArdGhpcy5sZWZ0QnV0dG9uKTtcclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgIHRoaXMuZ3JvdW5kZWQgJiYgdGhpcy5qdW1wQnV0dG9uXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIGdhbWUuc2NyZWVuc2hha2VBbW91bnQgPSAwLjU7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTAgKiBnYW1lLnBhcnRpY2xlTXVsdGlwbGllcjsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLmJvdHRvbUNvbGxpc2lvbiAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgICAgIGdhbWUucGFydGljbGVzLnB1c2gobmV3IENvbG9yUGFydGljbGUodGhpcy5ib3R0b21Db2xsaXNpb24uY29sb3IsIDEgLyA4ICsgTWF0aC5yYW5kb20oKSAvIDgsIDIwLCB0aGlzLnggKyB0aGlzLndpZHRoICogTWF0aC5yYW5kb20oKSwgdGhpcy55ICsgdGhpcy5oZWlnaHQsIDAuMiAqIChNYXRoLnJhbmRvbSgpIC0gMC41KSwgMC4yICogLU1hdGgucmFuZG9tKCkpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnlWZWwgPSAtMS41O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBhcHBseUdyYXZpdHlBbmREcmFnKCkge1xyXG4gICAgICAgIC8vIHRoaXMgZnVuY3Rpb24gY2hhbmdlcyB0aGUgb2JqZWN0J3MgbmV4dCB0aWNrJ3MgdmVsb2NpdHkgaW4gYm90aCB0aGUgeCBhbmQgdGhlIHkgZGlyZWN0aW9uc1xyXG5cclxuICAgICAgICB0aGlzLnBYVmVsID0gdGhpcy54VmVsO1xyXG4gICAgICAgIHRoaXMucFlWZWwgPSB0aGlzLnlWZWw7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmJvdHRvbUNvbGxpc2lvbiA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMueFZlbCAtPVxyXG4gICAgICAgICAgICAgICAgKE1hdGguYWJzKHRoaXMueFZlbCkgKiB0aGlzLnhWZWwgKiBnYW1lLkRSQUdfQ09FRkZJQ0lFTlQgKiB0aGlzLndpZHRoKSAvIC8vYXBwbHkgYWlyIHJlc2lzdGFuY2VcclxuICAgICAgICAgICAgICAgIHRoaXMubWFzcztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnhWZWwgLT1cclxuICAgICAgICAgICAgICAgIChNYXRoLmFicyh0aGlzLnhWZWwpICogdGhpcy54VmVsICogZ2FtZS5EUkFHX0NPRUZGSUNJRU5UICogKHRoaXMuYm90dG9tQ29sbGlzaW9uLmZyaWN0aW9uKSAqIHRoaXMud2lkdGgpIC8gLy9hcHBseSBhaXIgcmVzaXN0YW5jZSBhbmQgZ3JvdW5kIGZyaWN0aW9uXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1hc3M7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMueVZlbCArPSBnYW1lLkdSQVZJVFlfU1BFRUQ7XHJcbiAgICAgICAgdGhpcy55VmVsIC09XHJcbiAgICAgICAgICAgIChnYW1lLmFicyh0aGlzLnlWZWwpICogdGhpcy55VmVsICogZ2FtZS5EUkFHX0NPRUZGSUNJRU5UICogdGhpcy5oZWlnaHQpIC9cclxuICAgICAgICAgICAgdGhpcy5tYXNzO1xyXG4gICAgICAgIC8vaWYgb24gdGhlIGdyb3VuZCwgbWFrZSB3YWxraW5nIHBhcnRpY2xlc1xyXG4gICAgICAgIGlmICh0aGlzLmdyb3VuZGVkKSB7XHJcbiAgICAgICAgICAgIC8vZm9vdHN0ZXBzXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmFuZG9tbHlUb0ludChNYXRoLmFicyh0aGlzLnhWZWwpICogZ2FtZS5wYXJ0aWNsZU11bHRpcGxpZXIgLyAyKTsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBnYW1lLnBhcnRpY2xlcy5wdXNoKG5ldyBDb2xvclBhcnRpY2xlKFwiI2JiYmJiYjQ1XCIsIDEgLyA0ICsgTWF0aC5yYW5kb20oKSAvIDgsIDUwLCB0aGlzLnggKyB0aGlzLndpZHRoIC8gMiArIGkgLyBnYW1lLnBhcnRpY2xlTXVsdGlwbGllciwgdGhpcy55ICsgdGhpcy5oZWlnaHQsIDAsIDAsIGZhbHNlKSk7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vZHVzdFxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJhbmRvbWx5VG9JbnQoTWF0aC5hYnModGhpcy54VmVsKSAqIGdhbWUucGFydGljbGVNdWx0aXBsaWVyIC8gMik7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5ib3R0b21Db2xsaXNpb24gIT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgIGdhbWUucGFydGljbGVzLnB1c2gobmV3IENvbG9yUGFydGljbGUodGhpcy5ib3R0b21Db2xsaXNpb24uY29sb3IsIDEgLyA4ICsgTWF0aC5yYW5kb20oKSAvIDgsIDEwLCB0aGlzLnggKyB0aGlzLndpZHRoIC8gMiwgdGhpcy55ICsgdGhpcy5oZWlnaHQsIDAuMiAqIC10aGlzLnhWZWwgKyAwLjIgKiAoTWF0aC5yYW5kb20oKSAtIDAuNSksIDAuMiAqIC1NYXRoLnJhbmRvbSgpLCB0cnVlKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5jdXJyZW50QW5pbWF0aW9uICE9PSBcIndhbGtcIiAmJiAodGhpcy54VmVsKT4wLjA1KSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEFuaW1hdGlvbiA9IFwid2Fsa1wiO1xyXG4gICAgICAgICAgICB0aGlzLmFuaW1GcmFtZSA9IHRoaXMuYW5pbUZyYW1lICUgUGxheWVyQW5pbWF0aW9uc1t0aGlzLmN1cnJlbnRBbmltYXRpb25dLmxlbmd0aDtcclxuICAgICAgICAgICAgdGhpcy5mYWNpbmdSaWdodCA9IHRydWU7XHJcbiAgICAgICAgICAgIGdhbWUuY29ubmVjdGlvbi5lbWl0KCdwbGF5ZXJBbmltYXRpb24nLCB0aGlzLmN1cnJlbnRBbmltYXRpb24sIHRoaXMuZW50aXR5SWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLmN1cnJlbnRBbmltYXRpb24gIT09IFwid2Fsa2xlZnRcIiAmJiAodGhpcy54VmVsKTwtMC4wNSkge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRBbmltYXRpb24gPSBcIndhbGtsZWZ0XCI7XHJcbiAgICAgICAgICAgIHRoaXMuZmFjaW5nUmlnaHQgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5hbmltRnJhbWUgPSB0aGlzLmFuaW1GcmFtZSAlIFBsYXllckFuaW1hdGlvbnNbdGhpcy5jdXJyZW50QW5pbWF0aW9uXS5sZW5ndGg7XHJcbiAgICAgICAgICAgIGdhbWUuY29ubmVjdGlvbi5lbWl0KCdwbGF5ZXJBbmltYXRpb24nLCB0aGlzLmN1cnJlbnRBbmltYXRpb24sIHRoaXMuZW50aXR5SWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLmN1cnJlbnRBbmltYXRpb24gIT09IFwiaWRsZVwiICYmIHRoaXMueFZlbDw9MC4wNSAmJiAodGhpcy54VmVsPjAgfHwgKGdhbWUud29ybGRNb3VzZVg+dGhpcy5pbnRlcnBvbGF0ZWRYK3RoaXMud2lkdGgvMiAmJiB0aGlzLnhWZWw9PT0wKSkpIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50QW5pbWF0aW9uID0gXCJpZGxlXCI7XHJcbiAgICAgICAgICAgIHRoaXMuYW5pbUZyYW1lID0gdGhpcy5hbmltRnJhbWUgJSBQbGF5ZXJBbmltYXRpb25zW3RoaXMuY3VycmVudEFuaW1hdGlvbl0ubGVuZ3RoO1xyXG4gICAgICAgICAgICBnYW1lLmNvbm5lY3Rpb24uZW1pdCgncGxheWVyQW5pbWF0aW9uJywgdGhpcy5jdXJyZW50QW5pbWF0aW9uLCB0aGlzLmVudGl0eUlkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5jdXJyZW50QW5pbWF0aW9uICE9PSBcImlkbGVsZWZ0XCIgJiYgdGhpcy54VmVsPj0tMC4wNSAmJiAodGhpcy54VmVsPDAgfHwgKGdhbWUud29ybGRNb3VzZVg8PXRoaXMuaW50ZXJwb2xhdGVkWCt0aGlzLndpZHRoLzIgJiYgdGhpcy54VmVsPT09MCkpKXtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50QW5pbWF0aW9uID0gXCJpZGxlbGVmdFwiO1xyXG4gICAgICAgICAgICB0aGlzLmFuaW1GcmFtZSA9IHRoaXMuYW5pbUZyYW1lICUgUGxheWVyQW5pbWF0aW9uc1t0aGlzLmN1cnJlbnRBbmltYXRpb25dLmxlbmd0aDtcclxuICAgICAgICAgICAgZ2FtZS5jb25uZWN0aW9uLmVtaXQoJ3BsYXllckFuaW1hdGlvbicsIHRoaXMuY3VycmVudEFuaW1hdGlvbiwgdGhpcy5lbnRpdHlJZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vY29uc29sZS5sb2codGhpcy5jdXJyZW50QW5pbWF0aW9uLCB0aGlzLmN1cnJlbnRBbmltYXRpb24gIT09IFwid2Fsa1wiICYmICh0aGlzLnhWZWwpPjAuMDUpXHJcbiAgICB9XHJcblxyXG4gICAgZmluZEludGVycG9sYXRlZENvb3JkaW5hdGVzKCkge1xyXG4gICAgICAgIC8vIHRoaXMgZnVuY3Rpb24gZXNzZW50aWFsbHkgbWFrZXMgdGhlIGNoYXJhY3RlciBsYWcgYmVoaW5kIG9uZSB0aWNrLCBidXQgbWVhbnMgdGhhdCBpdCBnZXRzIGRpc3BsYXllZCBhdCB0aGUgbWF4aW11bSBmcmFtZSByYXRlLlxyXG4gICAgICAgIGlmICh0aGlzLnBYVmVsID4gMCkge1xyXG4gICAgICAgICAgICB0aGlzLmludGVycG9sYXRlZFggPSBnYW1lLm1pbihcclxuICAgICAgICAgICAgICAgIHRoaXMucFggKyB0aGlzLnBYVmVsICogZ2FtZS5hbW91bnRTaW5jZUxhc3RUaWNrLFxyXG4gICAgICAgICAgICAgICAgdGhpcy54XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5pbnRlcnBvbGF0ZWRYID0gZ2FtZS5tYXgoXHJcbiAgICAgICAgICAgICAgICB0aGlzLnBYICsgdGhpcy5wWFZlbCAqIGdhbWUuYW1vdW50U2luY2VMYXN0VGljayxcclxuICAgICAgICAgICAgICAgIHRoaXMueFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5wWVZlbCA+IDApIHtcclxuICAgICAgICAgICAgdGhpcy5pbnRlcnBvbGF0ZWRZID0gZ2FtZS5taW4oXHJcbiAgICAgICAgICAgICAgICB0aGlzLnBZICsgdGhpcy5wWVZlbCAqIGdhbWUuYW1vdW50U2luY2VMYXN0VGljayxcclxuICAgICAgICAgICAgICAgIHRoaXMueVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW50ZXJwb2xhdGVkWSA9IGdhbWUubWF4KFxyXG4gICAgICAgICAgICAgICAgdGhpcy5wWSArIHRoaXMucFlWZWwgKiBnYW1lLmFtb3VudFNpbmNlTGFzdFRpY2ssXHJcbiAgICAgICAgICAgICAgICB0aGlzLnlcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYXBwbHlWZWxvY2l0eUFuZENvbGxpZGUoKSB7XHJcbiAgICAgICAgdGhpcy50b3BDb2xsaXNpb24gPSBXb3JsZFRpbGVzW1RpbGVUeXBlLkFpcl07XHJcbiAgICAgICAgdGhpcy5ib3R0b21Db2xsaXNpb24gPSBXb3JsZFRpbGVzW1RpbGVUeXBlLkFpcl07XHJcbiAgICAgICAgdGhpcy5wWCA9IHRoaXMueDtcclxuICAgICAgICB0aGlzLnBZID0gdGhpcy55O1xyXG5cclxuICAgICAgICB0aGlzLnBHcm91bmRlZCA9IHRoaXMuZ3JvdW5kZWQ7XHJcbiAgICAgICAgdGhpcy5ncm91bmRlZCA9IGZhbHNlO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgIFRoaXMgZnVuY3Rpb24gYXNzdW1lcyB0aGF0IHRoZSBvYmplY3QgZG9lc24ndCBzdGFydCBpbiBjb2xsaXNpb25cclxuXHJcbiAgICAgICAgQWxzbywgaXQgdGFrZXMgYWR2YW50YWdlIG9mIHRoZSBmYWN0IHRoYXQgYW4gb2JqZWN0IGNhbiBvbmx5IGNvbGxpZGUgb25jZSBpbiBlYWNoIGF4aXMgd2l0aCB0aGVzZSBheGlzLWFsaWduZWQgcmVjdGFuZ2xlcy5cclxuICAgICAgICBUaGF0J3MgYSB0b3RhbCBvZiBhIHBvc3NpYmxlIHR3byBjb2xsaXNpb25zLCBvciBhbiBpbml0aWFsIGNvbGxpc2lvbiwgYW5kIGEgc2xpZGluZyBjb2xsaXNpb24uXHJcbiAgICAgICAgKi9cclxuXHJcbiAgICAgICAgLy8gY2FsY3VsYXRlIHRoZSBpbml0aWFsIGNvbGxpc2lvbjpcclxuXHJcbiAgICAgICAgLy8gc2V0IHRoZSBjbG9zZXN0IGNvbGxpc2lvbiB0byBvbmUgaW5maW5pdGVseSBmYXIgYXdheS5cclxuICAgICAgICB0aGlzLmNsb3Nlc3RDb2xsaXNpb24gPSBbMSwgMCwgSW5maW5pdHldO1xyXG5cclxuICAgICAgICBsZXQgbW9zdGx5R29pbmdIb3Jpem9udGFsbHk6IGJvb2xlYW47XHJcblxyXG4gICAgICAgIC8vIGxvb3AgdGhyb3VnaCBhbGwgdGhlIHBvc3NpYmxlIHRpbGVzIHRoZSBwaHlzaWNzIGJveCBjb3VsZCBiZSBpbnRlcnNlY3Rpbmcgd2l0aFxyXG4gICAgICAgIGZvciAoXHJcbiAgICAgICAgICAgIGxldCBpID0gTWF0aC5mbG9vcihnYW1lLm1pbih0aGlzLngsIHRoaXMueCArIHRoaXMueFZlbCkpO1xyXG4gICAgICAgICAgICBpIDwgTWF0aC5jZWlsKGdhbWUubWF4KHRoaXMueCwgdGhpcy54ICsgdGhpcy54VmVsKSArIHRoaXMud2lkdGgpO1xyXG4gICAgICAgICAgICBpKytcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgZm9yIChcclxuICAgICAgICAgICAgICAgIGxldCBqID0gTWF0aC5mbG9vcihnYW1lLm1pbih0aGlzLnksIHRoaXMueSArIHRoaXMueVZlbCkpO1xyXG4gICAgICAgICAgICAgICAgaiA8IE1hdGguY2VpbChnYW1lLm1heCh0aGlzLnksIHRoaXMueSArIHRoaXMueVZlbCkgKyB0aGlzLmhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICBqKytcclxuICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBpZiB0aGUgY3VycmVudCB0aWxlIGlzbid0IGFpciAodmFsdWUgMCksIHRoZW4gY29udGludWUgd2l0aCB0aGUgY29sbGlzaW9uIGRldGVjdGlvblxyXG4gICAgICAgICAgICAgICAgbGV0IGN1cnJlbnRCbG9jazogVGlsZVR5cGUgfCBzdHJpbmcgPSBnYW1lLndvcmxkLndvcmxkVGlsZXNbaiAqIGdhbWUud29ybGRXaWR0aCArIGldO1xyXG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRCbG9jayAhPT0gVGlsZVR5cGUuQWlyICYmIHR5cGVvZiBjdXJyZW50QmxvY2sgPT09ICdudW1iZXInKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZ2V0IHRoZSBkYXRhIGFib3V0IHRoZSBjb2xsaXNpb24gYW5kIHN0b3JlIGl0IGluIGEgdmFyaWFibGVcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbGxpc2lvbkRhdGEgPSBnYW1lLnJlY3RWc1JheShcclxuICAgICAgICAgICAgICAgICAgICAgICAgaSAtIHRoaXMud2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGogLSB0aGlzLmhlaWdodCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy53aWR0aCArIDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGVpZ2h0ICsgMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy54LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMueFZlbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy55VmVsXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICBtb3N0bHlHb2luZ0hvcml6b250YWxseSA9IE1hdGguYWJzKHRoaXMueFZlbCkgPiBNYXRoLmFicyh0aGlzLnlWZWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb2xsaXNpb25EYXRhICE9PSBmYWxzZSkgey8vYSBjb2xsaXNpb24gaGFwcGVuZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9zZXN0Q29sbGlzaW9uWzJdID4gdGhpcy5jb2xsaXNpb25EYXRhWzJdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9zZXN0Q29sbGlzaW9uID0gdGhpcy5jb2xsaXNpb25EYXRhOy8vaG9uZXN0bHkgdGhpcyBlbnRpcmUgY29sbGlzaW9uIHN5c3RlbSBpcyBhIG1lc3MgYnV0IGl0IHdvcmsgc28gc28gd2hhdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2xvc2VzdENvbGxpc2lvblswXSA9PT0gMCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jbG9zZXN0Q29sbGlzaW9uWzFdID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG9wQ29sbGlzaW9uID0gV29ybGRUaWxlc1tjdXJyZW50QmxvY2tdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ib3R0b21Db2xsaXNpb24gPSBXb3JsZFRpbGVzW2N1cnJlbnRCbG9ja107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY2xvc2VzdENvbGxpc2lvblsyXSA9PT0gdGhpcy5jb2xsaXNpb25EYXRhWzJdICYmIG1vc3RseUdvaW5nSG9yaXpvbnRhbGx5ID09PSAodGhpcy5jbG9zZXN0Q29sbGlzaW9uWzBdID09PSAwKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9zZXN0Q29sbGlzaW9uID0gdGhpcy5jb2xsaXNpb25EYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2xvc2VzdENvbGxpc2lvblswXSA9PT0gMCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jbG9zZXN0Q29sbGlzaW9uWzFdID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG9wQ29sbGlzaW9uID0gV29ybGRUaWxlc1tjdXJyZW50QmxvY2tdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ib3R0b21Db2xsaXNpb24gPSBXb3JsZFRpbGVzW2N1cnJlbnRCbG9ja107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY2xvc2VzdENvbGxpc2lvblsyXSAhPT0gSW5maW5pdHkpIHtcclxuICAgICAgICAgICAgLy8gdGhlcmUgaGFzIGJlZW4gYXQgbGVhc3Qgb25lIGNvbGxpc2lvblxyXG5cclxuICAgICAgICAgICAgLy8gZ28gdG8gdGhlIHBvaW50IG9mIGNvbGxpc2lvbiAodGhpcyBtYWtlcyBpdCBiZWhhdmUgYXMgaWYgdGhlIHdhbGxzIGFyZSBzdGlja3ksIGJ1dCB3ZSB3aWxsIGxhdGVyIHNsaWRlIGFnYWluc3QgdGhlIHdhbGxzKVxyXG4gICAgICAgICAgICB0aGlzLnggKz0gdGhpcy54VmVsICogdGhpcy5jbG9zZXN0Q29sbGlzaW9uWzJdO1xyXG4gICAgICAgICAgICB0aGlzLnkgKz0gdGhpcy55VmVsICogdGhpcy5jbG9zZXN0Q29sbGlzaW9uWzJdO1xyXG4gICAgICAgICAgICAvLyB0aGUgY29sbGlzaW9uIGhhcHBlbmVkIGVpdGhlciBvbiB0aGUgdG9wIG9yIGJvdHRvbVxyXG4gICAgICAgICAgICBpZiAodGhpcy5jbG9zZXN0Q29sbGlzaW9uWzBdID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jbG9zZXN0Q29sbGlzaW9uWzFdID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ3JvdW5kZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIGl0IGNvbGxpZGVkIG9uIHRoZSBoaWdoZXIgc2lkZSwgaXQgbXVzdCBiZSB0b3VjaGluZyB0aGUgZ3JvdW5kLiAoaGlnaGVyIHkgaXMgZG93bilcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMucEdyb3VuZGVkKSB7Ly9pZiBpdCBpc24ndCBncm91bmRlZCB5ZXQsIGl0IG11c3QgYmUgY29sbGlkaW5nIHdpdGggdGhlIGdyb3VuZCBmb3IgdGhlIGZpcnN0IHRpbWUsIHNvIHN1bW1vbiBwYXJ0aWNsZXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2FtZS5zY3JlZW5zaGFrZUFtb3VudCA9IE1hdGguYWJzKHRoaXMueVZlbCAqIDAuNzUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDUgKiBnYW1lLnBhcnRpY2xlTXVsdGlwbGllcjsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZih0aGlzLmJvdHRvbUNvbGxpc2lvbiAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdhbWUucGFydGljbGVzLnB1c2gobmV3IENvbG9yUGFydGljbGUodGhpcy5ib3R0b21Db2xsaXNpb24uY29sb3IsIDEgLyA4ICsgTWF0aC5yYW5kb20oKSAvIDgsIDIwLCB0aGlzLnggKyB0aGlzLndpZHRoICogTWF0aC5yYW5kb20oKSwgdGhpcy55ICsgdGhpcy5oZWlnaHQsIDAuMiAqIChNYXRoLnJhbmRvbSgpIC0gMC41KSwgMC4yICogLU1hdGgucmFuZG9tKCkpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGdhbWUuc2NyZWVuc2hha2VBbW91bnQgPSBNYXRoLmFicyh0aGlzLnlWZWwgKiAwLjc1KTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDUgKiBnYW1lLnBhcnRpY2xlTXVsdGlwbGllcjsgaSsrKSB7Ly9jZWlsaW5nIGNvbGxpc2lvbiBwYXJ0aWNsZXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYodGhpcy50b3BDb2xsaXNpb24gIT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdhbWUucGFydGljbGVzLnB1c2gobmV3IENvbG9yUGFydGljbGUodGhpcy50b3BDb2xsaXNpb24uY29sb3IsIDEgLyA4ICsgTWF0aC5yYW5kb20oKSAvIDgsIDIwLCB0aGlzLnggKyB0aGlzLndpZHRoICogTWF0aC5yYW5kb20oKSwgdGhpcy55LCAwLjIgKiAoTWF0aC5yYW5kb20oKSAtIDAuNSksIDAuMiAqIC1NYXRoLnJhbmRvbSgpKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy55VmVsID0gMDsgLy8gc2V0IHRoZSB5IHZlbG9jaXR5IHRvIDAgYmVjYXVzZSB0aGUgb2JqZWN0IGhhcyBydW4gaW50byBhIHdhbGwgb24gaXRzIHRvcCBvciBib3R0b21cclxuICAgICAgICAgICAgICAgIHRoaXMuc2xpZGVYID0gdGhpcy54VmVsICogKDEgLSB0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMl0pOyAvLyB0aGlzIGlzIHRoZSByZW1haW5pbmcgZGlzdGFuY2UgdG8gc2xpZGUgYWZ0ZXIgdGhlIGNvbGxpc2lvblxyXG4gICAgICAgICAgICAgICAgdGhpcy5zbGlkZVkgPSAwOyAvLyBpdCBkb2Vzbid0IHNsaWRlIGluIHRoZSB5IGRpcmVjdGlvbiBiZWNhdXNlIHRoZXJlJ3MgYSB3YWxsIFxcKC4tLikvXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnhWZWwgPSAwOyAvLyBzZXQgdGhlIHggdmVsb2NpdHkgdG8gMCBiZWNhdXNlIHdhbGwgZ28gb29mXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNsaWRlWCA9IDA7IC8vIGl0IGRvZXNuJ3Qgc2xpZGUgaW4gdGhlIHggZGlyZWN0aW9uIGJlY2F1c2UgdGhlcmUncyBhIHdhbGwgLyguXy4pXFxcclxuICAgICAgICAgICAgICAgIHRoaXMuc2xpZGVZID0gdGhpcy55VmVsICogKDEgLSB0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMl0pOyAvLyB0aGlzIGlzIHRoZSByZW1haW5pbmcgZGlzdGFuY2UgdG8gc2xpZGUgYWZ0ZXIgdGhlIGNvbGxpc2lvblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBhdCB0aGlzIHBvaW50LCB0aGUgb2JqZWN0IGlzIHRvdWNoaW5nIGl0cyBmaXJzdCBjb2xsaXNpb24sIHJlYWR5IHRvIHNsaWRlLiAgVGhlIGFtb3VudCBpdCB3YW50cyB0byBzbGlkZSBpcyBoZWxkIGluIHRoZSB0aGlzLnNsaWRlWCBhbmQgdGhpcy5zbGlkZVkgdmFyaWFibGVzLlxyXG5cclxuICAgICAgICAgICAgLy8gdGhpcyBjYW4gYmUgdHJlYXRlZCBlc3NlbnRpYWxseSB0aGUgc2FtZSBhcyB0aGUgZmlyc3QgY29sbGlzaW9uLCBzbyBhIGxvdCBvZiB0aGUgY29kZSB3aWxsIGJlIHJldXNlZC5cclxuXHJcbiAgICAgICAgICAgIC8vIHNldCB0aGUgY2xvc2VzdCBjb2xsaXNpb24gdG8gb25lIGluZmluaXRlbHkgZmFyIGF3YXkuXHJcbiAgICAgICAgICAgIHRoaXMuY2xvc2VzdENvbGxpc2lvbiA9IFsxLCAwLCBJbmZpbml0eV07XHJcblxyXG4gICAgICAgICAgICAvLyBsb29wIHRocm91Z2ggYWxsIHRoZSBwb3NzaWJsZSB0aWxlcyB0aGUgcGh5c2ljcyBib3ggY291bGQgYmUgaW50ZXJzZWN0aW5nIHdpdGhcclxuICAgICAgICAgICAgZm9yIChcclxuICAgICAgICAgICAgICAgIGxldCBpID0gTWF0aC5mbG9vcihnYW1lLm1pbih0aGlzLngsIHRoaXMueCArIHRoaXMuc2xpZGVYKSk7XHJcbiAgICAgICAgICAgICAgICBpIDwgTWF0aC5jZWlsKGdhbWUubWF4KHRoaXMueCwgdGhpcy54ICsgdGhpcy5zbGlkZVgpICsgdGhpcy53aWR0aCk7XHJcbiAgICAgICAgICAgICAgICBpKytcclxuICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKFxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBqID0gTWF0aC5mbG9vcihnYW1lLm1pbih0aGlzLnksIHRoaXMueSArIHRoaXMuc2xpZGVZKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaiA8XHJcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5jZWlsKGdhbWUubWF4KHRoaXMueSwgdGhpcy55ICsgdGhpcy5zbGlkZVkpICsgdGhpcy5oZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGorK1xyXG4gICAgICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGN1cnJlbnRCbG9jazogVGlsZVR5cGUgfCBzdHJpbmcgPSBnYW1lLndvcmxkLndvcmxkVGlsZXNbaiAqIGdhbWUud29ybGRXaWR0aCArIGldO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBjdXJyZW50IHRpbGUgaXNuJ3QgYWlyLCB0aGVuIGNvbnRpbnVlIHdpdGggdGhlIGNvbGxpc2lvbiBkZXRlY3Rpb25cclxuICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudEJsb2NrICE9PSBUaWxlVHlwZS5BaXIgJiYgdHlwZW9mIGN1cnJlbnRCbG9jayA9PT0gXCJudW1iZXJcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBnZXQgdGhlIGRhdGEgYWJvdXQgdGhlIGNvbGxpc2lvbiBhbmQgc3RvcmUgaXQgaW4gYSB2YXJpYWJsZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbGxpc2lvbkRhdGEgPSBnYW1lLnJlY3RWc1JheShcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGkgLSB0aGlzLndpZHRoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaiAtIHRoaXMuaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy53aWR0aCArIDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhlaWdodCArIDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLngsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNsaWRlWCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2xpZGVZXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29sbGlzaW9uRGF0YSAhPT0gZmFsc2UgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2VzdENvbGxpc2lvblsyXSA+IHRoaXMuY29sbGlzaW9uRGF0YVsyXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2VzdENvbGxpc2lvbiA9IHRoaXMuY29sbGlzaW9uRGF0YTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMF0gPT09IDApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2xvc2VzdENvbGxpc2lvblsxXSA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRvcENvbGxpc2lvbiA9IFdvcmxkVGlsZXNbY3VycmVudEJsb2NrXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYm90dG9tQ29sbGlzaW9uID0gV29ybGRUaWxlc1tjdXJyZW50QmxvY2tdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gaXQgaGFzIGNvbGxpZGVkIHdoaWxlIHRyeWluZyB0byBzbGlkZVxyXG4gICAgICAgICAgICBpZiAodGhpcy5jbG9zZXN0Q29sbGlzaW9uWzJdICE9PSBJbmZpbml0eSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy54ICs9IHRoaXMuc2xpZGVYICogdGhpcy5jbG9zZXN0Q29sbGlzaW9uWzJdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy55ICs9IHRoaXMuc2xpZGVZICogdGhpcy5jbG9zZXN0Q29sbGlzaW9uWzJdO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMF0gPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnlWZWwgPSAwOyAvLyBzZXQgdGhlIHkgdmVsb2NpdHkgdG8gMCBiZWNhdXNlIHRoZSBvYmplY3QgaGFzIHJ1biBpbnRvIGEgd2FsbCBvbiBpdHMgdG9wIG9yIGJvdHRvbVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMV0gPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIGl0IGNvbGxpZGVkIG9uIHRoZSBoaWdoZXIgc2lkZSwgaXQgbXVzdCBiZSB0b3VjaGluZyB0aGUgZ3JvdW5kLiAoaGlnaGVyIHkgaXMgZG93bilcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ncm91bmRlZCA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy54VmVsID0gMDsgLy8gc2V0IHRoZSB4IHZlbG9jaXR5IHRvIDAgYmVjYXVzZSB3YWxsIGdvIG9vZlxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gaXQgaGFzIG5vdCBjb2xsaWRlZCB3aGlsZSB0cnlpbmcgdG8gc2xpZGVcclxuICAgICAgICAgICAgICAgIHRoaXMueCArPSB0aGlzLnNsaWRlWDtcclxuICAgICAgICAgICAgICAgIHRoaXMueSArPSB0aGlzLnNsaWRlWTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIHRoZXJlIGhhcyBiZWVuIG5vIGNvbGxpc2lvblxyXG4gICAgICAgICAgICB0aGlzLnggKz0gdGhpcy54VmVsO1xyXG4gICAgICAgICAgICB0aGlzLnkgKz0gdGhpcy55VmVsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gY29sbGlkZSB3aXRoIHNpZGVzIG9mIG1hcFxyXG5cclxuICAgICAgICBpZiAodGhpcy54IDwgMCkge1xyXG4gICAgICAgICAgICB0aGlzLnggPSAwO1xyXG4gICAgICAgICAgICB0aGlzLnhWZWwgPSAwO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy54ICsgdGhpcy53aWR0aCA+IGdhbWUud29ybGRXaWR0aCkge1xyXG4gICAgICAgICAgICB0aGlzLnggPSBnYW1lLndvcmxkV2lkdGggLSB0aGlzLndpZHRoO1xyXG4gICAgICAgICAgICB0aGlzLnhWZWwgPSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMueSArIHRoaXMuaGVpZ2h0ID4gZ2FtZS53b3JsZEhlaWdodCkge1xyXG4gICAgICAgICAgICB0aGlzLnkgPSBnYW1lLndvcmxkSGVpZ2h0IC0gdGhpcy5oZWlnaHQ7XHJcbiAgICAgICAgICAgIHRoaXMueVZlbCA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JvdW5kZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIHJhbmRvbWx5VG9JbnQoZjogbnVtYmVyKSB7XHJcbiAgICBpZiAoTWF0aC5yYW5kb20oKSA+IGYgLSBNYXRoLmZsb29yKGYpKSB7XHJcbiAgICAgICAgcmV0dXJuIChNYXRoLmZsb29yKGYpKTtcclxuICAgIH1cclxuICAgIHJldHVybiAoTWF0aC5jZWlsKGYpKTtcclxufSIsImltcG9ydCB7IFJlbmRlcmFibGUgfSBmcm9tICcuLi9pbnRlcmZhY2VzL1JlbmRlcmFibGUnO1xyXG5pbXBvcnQgcDUgZnJvbSAncDUnO1xyXG5pbXBvcnQgeyBBdWRpb0Fzc2V0cywgVWlBc3NldHMgfSBmcm9tICcuLi9hc3NldHMvQXNzZXRzJztcclxuaW1wb3J0IHsgSW1hZ2VSZXNvdXJjZSB9IGZyb20gJy4uL2Fzc2V0cy9yZXNvdXJjZXMvSW1hZ2VSZXNvdXJjZSc7XHJcbmltcG9ydCB7IEZvbnRSZXNvdXJjZSB9IGZyb20gJy4uL2Fzc2V0cy9yZXNvdXJjZXMvRm9udFJlc291cmNlJztcclxuXHJcbmV4cG9ydCBjbGFzcyBCdXR0b24gaW1wbGVtZW50cyBSZW5kZXJhYmxlIHtcclxuXHJcbiAgICBmb250OiBGb250UmVzb3VyY2VcclxuICAgIHR4dDogc3RyaW5nXHJcbiAgICBkZXNjcmlwdGlvbjogc3RyaW5nXHJcbiAgICBvblByZXNzZWRDdXN0b206IEZ1bmN0aW9uXHJcbiAgICB4OiBudW1iZXJcclxuICAgIHk6IG51bWJlclxyXG4gICAgdzogbnVtYmVyXHJcbiAgICBoOiBudW1iZXJcclxuICAgIGltYWdlOiBJbWFnZVJlc291cmNlXHJcbiAgICBtb3VzZUlzT3ZlcjogYm9vbGVhblxyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIGZvbnQ6IEZvbnRSZXNvdXJjZSxcclxuICAgICAgICB0eHQ6IHN0cmluZyxcclxuICAgICAgICBkZXNjcmlwdGlvbjogc3RyaW5nLFxyXG4gICAgICAgIHg6IG51bWJlcixcclxuICAgICAgICB5OiBudW1iZXIsXHJcbiAgICAgICAgdzogbnVtYmVyLFxyXG4gICAgICAgIGg6IG51bWJlcixcclxuICAgICAgICBvblByZXNzZWRDdXN0b206IEZ1bmN0aW9uKSB7XHJcbiAgICAgICAgdGhpcy5mb250ID0gZm9udDtcclxuICAgICAgICB0aGlzLnR4dCA9IHR4dFxyXG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvblxyXG4gICAgICAgIHRoaXMub25QcmVzc2VkQ3VzdG9tID0gb25QcmVzc2VkQ3VzdG9tXHJcbiAgICAgICAgdGhpcy54ID0geFxyXG4gICAgICAgIHRoaXMueSA9IHlcclxuICAgICAgICB0aGlzLncgPSB3XHJcbiAgICAgICAgdGhpcy5oID0gaFxyXG4gICAgICAgIHRoaXMuaW1hZ2UgPSBVaUFzc2V0cy5idXR0b25fdW5zZWxlY3RlZDtcclxuICAgICAgICB0aGlzLm1vdXNlSXNPdmVyID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKHRhcmdldDogcDUsIHVwc2NhbGVTaXplOiBudW1iZXIpIHtcclxuICAgICAgICAvLyBzZXQgdGhlIGNvb3JkcyBhbmQgZGltZW5zaW9ucyB0byByb3VuZCB0byB0aGUgbmVhcmVzdCB1bi11cHNjYWxlZCBwaXhlbFxyXG4gICAgICAgIGNvbnN0IHggPSBNYXRoLnJvdW5kKHRoaXMueCAvIHVwc2NhbGVTaXplKSAqIHVwc2NhbGVTaXplO1xyXG4gICAgICAgIGNvbnN0IHkgPSBNYXRoLnJvdW5kKHRoaXMueSAvIHVwc2NhbGVTaXplKSAqIHVwc2NhbGVTaXplO1xyXG4gICAgICAgIGNvbnN0IHcgPSBNYXRoLnJvdW5kKHRoaXMudyAvIHVwc2NhbGVTaXplKSAqIHVwc2NhbGVTaXplO1xyXG4gICAgICAgIGNvbnN0IGggPSBNYXRoLnJvdW5kKHRoaXMuaCAvIHVwc2NhbGVTaXplKSAqIHVwc2NhbGVTaXplO1xyXG5cclxuICAgICAgICAvLyBjb3JuZXJzXHJcbiAgICAgICAgdGhpcy5pbWFnZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCwgeSwgNyAqIHVwc2NhbGVTaXplLCA3ICogdXBzY2FsZVNpemUsIDAsIDAsIDcsIDcpO1xyXG4gICAgICAgIHRoaXMuaW1hZ2UucmVuZGVyUGFydGlhbCh0YXJnZXQsIHggKyB3IC0gNyAqIHVwc2NhbGVTaXplLCB5LCA3ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgOCwgMCwgNywgNyk7XHJcbiAgICAgICAgdGhpcy5pbWFnZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCwgeSArIGggLSA3ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCAwLCA4LCA3LCA3KTtcclxuICAgICAgICB0aGlzLmltYWdlLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4ICsgdyAtIDcgKiB1cHNjYWxlU2l6ZSwgeSArIGggLSA3ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCA4LCA4LCA3LCA3KTtcclxuXHJcbiAgICAgICAgLy8gdG9wIGFuZCBib3R0b21cclxuICAgICAgICB0aGlzLmltYWdlLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4ICsgNyAqIHVwc2NhbGVTaXplLCB5LCB3IC0gMTQgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCA3LCAwLCAxLCA3KTtcclxuICAgICAgICB0aGlzLmltYWdlLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4ICsgNyAqIHVwc2NhbGVTaXplLCB5ICsgaCAtIDcgKiB1cHNjYWxlU2l6ZSwgdyAtIDE0ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgNywgOCwgMSwgNyk7XHJcblxyXG4gICAgICAgIC8vIGxlZnQgYW5kIHJpZ2h0XHJcbiAgICAgICAgdGhpcy5pbWFnZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCwgeSArIDcgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCBoIC0gMTQgKiB1cHNjYWxlU2l6ZSwgMCwgNywgNywgMSk7XHJcbiAgICAgICAgdGhpcy5pbWFnZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCArIHcgLSA3ICogdXBzY2FsZVNpemUsIHkgKyA3ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgaCAtIDE0ICogdXBzY2FsZVNpemUsIDgsIDcsIDcsIDEpO1xyXG5cclxuICAgICAgICAvLyBjZW50ZXJcclxuICAgICAgICB0aGlzLmltYWdlLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4ICsgNyAqIHVwc2NhbGVTaXplLCB5ICsgNyAqIHVwc2NhbGVTaXplLCB3IC0gMTQgKiB1cHNjYWxlU2l6ZSwgaCAtIDE0ICogdXBzY2FsZVNpemUsIDcsIDcsIDEsIDEpO1xyXG5cclxuICAgICAgICB0aGlzLmZvbnQuZHJhd1RleHQodGFyZ2V0LCB0aGlzLnR4dCwgeCArIDYgKiB1cHNjYWxlU2l6ZSwgTWF0aC5yb3VuZCgodGhpcy55ICsgdGhpcy5oIC8gMikgLyB1cHNjYWxlU2l6ZSkgKiB1cHNjYWxlU2l6ZSAtIDYgKiB1cHNjYWxlU2l6ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlTW91c2VPdmVyKG1vdXNlWDogbnVtYmVyLCBtb3VzZVk6IG51bWJlcikge1xyXG4gICAgICAgIC8vIGlmIHRoZSBtb3VzZSBwb3NpdGlvbiBpcyBpbnNpZGUgdGhlIGJ1dHRvbiwgcmV0dXJuIHRydWVcclxuICAgICAgICBpZiAobW91c2VYID4gdGhpcy54ICYmIG1vdXNlWCA8IHRoaXMueCArIHRoaXMudyAmJiBtb3VzZVkgPiB0aGlzLnkgJiYgbW91c2VZIDwgdGhpcy55ICsgdGhpcy5oKSB7XHJcbiAgICAgICAgICAgIHRoaXMubW91c2VJc092ZXIgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLmltYWdlID0gVWlBc3NldHMuYnV0dG9uX3NlbGVjdGVkO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5tb3VzZUlzT3ZlciA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLmltYWdlID0gVWlBc3NldHMuYnV0dG9uX3Vuc2VsZWN0ZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9uUHJlc3NlZCgpIHtcclxuICAgICAgICB0aGlzLm9uUHJlc3NlZEN1c3RvbSgpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiYnV0dG9uIHByZXNzZWRcIik7XHJcbiAgICAgICAgLy9BdWRpb0Fzc2V0cy51aS5pbnZlbnRvcnlDbGFjay5wbGF5UmFuZG9tKCk7XHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IHsgUmVuZGVyYWJsZSB9IGZyb20gJy4uL2ludGVyZmFjZXMvUmVuZGVyYWJsZSc7XHJcbmltcG9ydCBwNSBmcm9tICdwNSc7XHJcbmltcG9ydCB7IEtleXMsIFVpQXNzZXRzIH0gZnJvbSAnLi4vYXNzZXRzL0Fzc2V0cyc7XHJcbmltcG9ydCB7IEltYWdlUmVzb3VyY2UgfSBmcm9tICcuLi9hc3NldHMvcmVzb3VyY2VzL0ltYWdlUmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBGb250UmVzb3VyY2UgfSBmcm9tICcuLi9hc3NldHMvcmVzb3VyY2VzL0ZvbnRSZXNvdXJjZSc7XHJcblxyXG5leHBvcnQgY2xhc3MgSW5wdXRCb3ggaW1wbGVtZW50cyBSZW5kZXJhYmxlIHtcclxuXHJcbiAgICBmb250OiBGb250UmVzb3VyY2VcclxuICAgIHR4dDogc3RyaW5nXHJcbiAgICB2YWx1ZTogbnVtYmVyXHJcbiAgICBrZXlib2FyZDogYm9vbGVhblxyXG4gICAgaW5kZXg6IG51bWJlclxyXG4gICAgeDogbnVtYmVyXHJcbiAgICB5OiBudW1iZXJcclxuICAgIHc6IG51bWJlclxyXG4gICAgaDogbnVtYmVyXHJcbiAgICBpbWFnZTogSW1hZ2VSZXNvdXJjZVxyXG4gICAgbW91c2VJc092ZXI6IGJvb2xlYW5cclxuICAgIGxpc3RlbmluZzogYm9vbGVhblxyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIGZvbnQ6IEZvbnRSZXNvdXJjZSxcclxuICAgICAgICB0eHQ6IHN0cmluZyxcclxuICAgICAgICBrZXlib2FyZDogYm9vbGVhbixcclxuICAgICAgICB2YWx1ZTogbnVtYmVyLFxyXG4gICAgICAgIGluZGV4OiBudW1iZXIsLy8gdGhlIGluZGV4IGluIHRoZSBHYW1lLmNvbnRyb2xzIGFycmF5IHRoYXQgaXQgY2hhbmdlc1xyXG4gICAgICAgIHg6IG51bWJlcixcclxuICAgICAgICB5OiBudW1iZXIsXHJcbiAgICAgICAgdzogbnVtYmVyLFxyXG4gICAgICAgIGg6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuZm9udCA9IGZvbnQ7XHJcbiAgICAgICAgdGhpcy50eHQgPSB0eHRcclxuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5rZXlib2FyZCA9IGtleWJvYXJkO1xyXG4gICAgICAgIHRoaXMuaW5kZXggPSBpbmRleDtcclxuICAgICAgICB0aGlzLnggPSB4XHJcbiAgICAgICAgdGhpcy55ID0geVxyXG4gICAgICAgIHRoaXMudyA9IHdcclxuICAgICAgICB0aGlzLmggPSBoXHJcbiAgICAgICAgdGhpcy5pbWFnZSA9IFVpQXNzZXRzLmJ1dHRvbl91bnNlbGVjdGVkO1xyXG4gICAgICAgIHRoaXMubW91c2VJc092ZXIgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmxpc3RlbmluZyA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcih0YXJnZXQ6IHA1LCB1cHNjYWxlU2l6ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgLy8gc2V0IHRoZSBjb29yZHMgYW5kIGRpbWVuc2lvbnMgdG8gcm91bmQgdG8gdGhlIG5lYXJlc3QgdW4tdXBzY2FsZWQgcGl4ZWxcclxuICAgICAgICBjb25zdCB4ID0gTWF0aC5yb3VuZCh0aGlzLnggLyB1cHNjYWxlU2l6ZSkgKiB1cHNjYWxlU2l6ZTtcclxuICAgICAgICBjb25zdCB5ID0gTWF0aC5yb3VuZCh0aGlzLnkgLyB1cHNjYWxlU2l6ZSkgKiB1cHNjYWxlU2l6ZTtcclxuICAgICAgICBjb25zdCB3ID0gTWF0aC5yb3VuZCh0aGlzLncgLyB1cHNjYWxlU2l6ZSkgKiB1cHNjYWxlU2l6ZTtcclxuICAgICAgICBjb25zdCBoID0gTWF0aC5yb3VuZCh0aGlzLmggLyB1cHNjYWxlU2l6ZSkgKiB1cHNjYWxlU2l6ZTtcclxuXHJcbiAgICAgICAgLy8gY29ybmVyc1xyXG4gICAgICAgIHRoaXMuaW1hZ2UucmVuZGVyUGFydGlhbCh0YXJnZXQsIHgsIHksIDcgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCAwLCAwLCA3LCA3KTtcclxuICAgICAgICB0aGlzLmltYWdlLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4ICsgdyAtIDcgKiB1cHNjYWxlU2l6ZSwgeSwgNyAqIHVwc2NhbGVTaXplLCA3ICogdXBzY2FsZVNpemUsIDgsIDAsIDcsIDcpO1xyXG4gICAgICAgIHRoaXMuaW1hZ2UucmVuZGVyUGFydGlhbCh0YXJnZXQsIHgsIHkgKyBoIC0gNyAqIHVwc2NhbGVTaXplLCA3ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgMCwgOCwgNywgNyk7XHJcbiAgICAgICAgdGhpcy5pbWFnZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCArIHcgLSA3ICogdXBzY2FsZVNpemUsIHkgKyBoIC0gNyAqIHVwc2NhbGVTaXplLCA3ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgOCwgOCwgNywgNyk7XHJcblxyXG4gICAgICAgIC8vIHRvcCBhbmQgYm90dG9tXHJcbiAgICAgICAgdGhpcy5pbWFnZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCArIDcgKiB1cHNjYWxlU2l6ZSwgeSwgdyAtIDE0ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgNywgMCwgMSwgNyk7XHJcbiAgICAgICAgdGhpcy5pbWFnZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCArIDcgKiB1cHNjYWxlU2l6ZSwgeSArIGggLSA3ICogdXBzY2FsZVNpemUsIHcgLSAxNCAqIHVwc2NhbGVTaXplLCA3ICogdXBzY2FsZVNpemUsIDcsIDgsIDEsIDcpO1xyXG5cclxuICAgICAgICAvLyBsZWZ0IGFuZCByaWdodFxyXG4gICAgICAgIHRoaXMuaW1hZ2UucmVuZGVyUGFydGlhbCh0YXJnZXQsIHgsIHkgKyA3ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgaCAtIDE0ICogdXBzY2FsZVNpemUsIDAsIDcsIDcsIDEpO1xyXG4gICAgICAgIHRoaXMuaW1hZ2UucmVuZGVyUGFydGlhbCh0YXJnZXQsIHggKyB3IC0gNyAqIHVwc2NhbGVTaXplLCB5ICsgNyAqIHVwc2NhbGVTaXplLCA3ICogdXBzY2FsZVNpemUsIGggLSAxNCAqIHVwc2NhbGVTaXplLCA4LCA3LCA3LCAxKTtcclxuXHJcbiAgICAgICAgLy8gY2VudGVyXHJcbiAgICAgICAgdGhpcy5pbWFnZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCArIDcgKiB1cHNjYWxlU2l6ZSwgeSArIDcgKiB1cHNjYWxlU2l6ZSwgdyAtIDE0ICogdXBzY2FsZVNpemUsIGggLSAxNCAqIHVwc2NhbGVTaXplLCA3LCA3LCAxLCAxKTtcclxuXHJcbiAgICAgICAgaWYodGhpcy5saXN0ZW5pbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5mb250LmRyYXdUZXh0KHRhcmdldCwgdGhpcy50eHQrXCI6IGNsaWNrIHRvIGNhbmNlbFwiLCB4ICsgNiAqIHVwc2NhbGVTaXplLCBNYXRoLnJvdW5kKCh0aGlzLnkgKyB0aGlzLmggLyAyKSAvIHVwc2NhbGVTaXplKSAqIHVwc2NhbGVTaXplIC0gNiAqIHVwc2NhbGVTaXplKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmKHRoaXMua2V5Ym9hcmQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZm9udC5kcmF3VGV4dCh0YXJnZXQsIHRoaXMudHh0K1wiOiAgIFwiK0tleXMua2V5Ym9hcmRNYXBbdGhpcy52YWx1ZV0sIHggKyA2ICogdXBzY2FsZVNpemUsIE1hdGgucm91bmQoKHRoaXMueSArIHRoaXMuaCAvIDIpIC8gdXBzY2FsZVNpemUpICogdXBzY2FsZVNpemUgLSA2ICogdXBzY2FsZVNpemUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mb250LmRyYXdUZXh0KHRhcmdldCwgdGhpcy50eHQrXCI6ICAgTW91c2UgXCIrdGhpcy52YWx1ZSwgeCArIDYgKiB1cHNjYWxlU2l6ZSwgTWF0aC5yb3VuZCgodGhpcy55ICsgdGhpcy5oIC8gMikgLyB1cHNjYWxlU2l6ZSkgKiB1cHNjYWxlU2l6ZSAtIDYgKiB1cHNjYWxlU2l6ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlTW91c2VPdmVyKG1vdXNlWDogbnVtYmVyLCBtb3VzZVk6IG51bWJlcikge1xyXG4gICAgICAgIC8vIGlmIHRoZSBtb3VzZSBwb3NpdGlvbiBpcyBpbnNpZGUgdGhlIGJ1dHRvbiwgcmV0dXJuIHRydWVcclxuICAgICAgICBpZiAobW91c2VYID4gdGhpcy54ICYmIG1vdXNlWCA8IHRoaXMueCArIHRoaXMudyAmJiBtb3VzZVkgPiB0aGlzLnkgJiYgbW91c2VZIDwgdGhpcy55ICsgdGhpcy5oKSB7XHJcbiAgICAgICAgICAgIHRoaXMubW91c2VJc092ZXIgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5tb3VzZUlzT3ZlciA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvblByZXNzZWQoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJpbnB1dCBib3ggcHJlc3NlZFwiKTtcclxuICAgICAgICB0aGlzLmxpc3RlbmluZyA9ICF0aGlzLmxpc3RlbmluZztcclxuICAgICAgICBpZih0aGlzLmxpc3RlbmluZykge1xyXG4gICAgICAgICAgICB0aGlzLmltYWdlID0gVWlBc3NldHMuYnV0dG9uX3NlbGVjdGVkO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuaW1hZ2UgPSBVaUFzc2V0cy5idXR0b25fdW5zZWxlY3RlZDtcclxuICAgICAgICAvLyBBdWRpb0Fzc2V0cy51aS5pbnZlbnRvcnlDbGFjay5wbGF5UmFuZG9tKCk7XHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IHsgUmVuZGVyYWJsZSB9IGZyb20gJy4uL2ludGVyZmFjZXMvUmVuZGVyYWJsZSc7XHJcbmltcG9ydCBwNSBmcm9tICdwNSc7XHJcbmltcG9ydCB7IFVpQXNzZXRzIH0gZnJvbSAnLi4vYXNzZXRzL0Fzc2V0cyc7XHJcblxyXG5leHBvcnQgY2xhc3MgVWlGcmFtZSBpbXBsZW1lbnRzIFJlbmRlcmFibGUge1xyXG5cclxuICAgIHg6IG51bWJlclxyXG4gICAgeTogbnVtYmVyXHJcbiAgICB3OiBudW1iZXJcclxuICAgIGg6IG51bWJlclxyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHg6IG51bWJlcixcclxuICAgICAgICB5OiBudW1iZXIsXHJcbiAgICAgICAgdzogbnVtYmVyLFxyXG4gICAgICAgIGg6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMueCA9IHhcclxuICAgICAgICB0aGlzLnkgPSB5XHJcbiAgICAgICAgdGhpcy53ID0gd1xyXG4gICAgICAgIHRoaXMuaCA9IGhcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIodGFyZ2V0OiBwNSwgdXBzY2FsZVNpemU6IG51bWJlcikge1xyXG4gICAgICAgIC8vIHNldCB0aGUgY29vcmRzIGFuZCBkaW1lbnNpb25zIHRvIHJvdW5kIHRvIHRoZSBuZWFyZXN0IHVuLXVwc2NhbGVkIHBpeGVsXHJcbiAgICAgICAgY29uc3QgeCA9IE1hdGgucm91bmQodGhpcy54L3Vwc2NhbGVTaXplKSp1cHNjYWxlU2l6ZTtcclxuICAgICAgICBjb25zdCB5ID0gTWF0aC5yb3VuZCh0aGlzLnkvdXBzY2FsZVNpemUpKnVwc2NhbGVTaXplO1xyXG4gICAgICAgIGNvbnN0IHcgPSBNYXRoLnJvdW5kKHRoaXMudy91cHNjYWxlU2l6ZSkqdXBzY2FsZVNpemU7XHJcbiAgICAgICAgY29uc3QgaCA9IE1hdGgucm91bmQodGhpcy5oL3Vwc2NhbGVTaXplKSp1cHNjYWxlU2l6ZTtcclxuXHJcbiAgICAgICAgLy8gY29ybmVyc1xyXG4gICAgICAgIFVpQXNzZXRzLnVpX2ZyYW1lLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4LCB5LCA3KnVwc2NhbGVTaXplLCA3KnVwc2NhbGVTaXplLCAwLCAwLCA3LCA3KTtcclxuICAgICAgICBVaUFzc2V0cy51aV9mcmFtZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCt3LTcqdXBzY2FsZVNpemUsIHksIDcqdXBzY2FsZVNpemUsIDcqdXBzY2FsZVNpemUsIDgsIDAsIDcsIDcpO1xyXG4gICAgICAgIFVpQXNzZXRzLnVpX2ZyYW1lLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4LCB5K2gtNyp1cHNjYWxlU2l6ZSwgNyp1cHNjYWxlU2l6ZSwgNyp1cHNjYWxlU2l6ZSwgMCwgOCwgNywgNyk7XHJcbiAgICAgICAgVWlBc3NldHMudWlfZnJhbWUucmVuZGVyUGFydGlhbCh0YXJnZXQsIHgrdy03KnVwc2NhbGVTaXplLCB5K2gtNyp1cHNjYWxlU2l6ZSwgNyp1cHNjYWxlU2l6ZSwgNyp1cHNjYWxlU2l6ZSwgOCwgOCwgNywgNyk7XHJcblxyXG4gICAgICAgIC8vIHRvcCBhbmQgYm90dG9tXHJcbiAgICAgICAgVWlBc3NldHMudWlfZnJhbWUucmVuZGVyUGFydGlhbCh0YXJnZXQsIHgrNyp1cHNjYWxlU2l6ZSwgeSwgdy0xNCp1cHNjYWxlU2l6ZSwgNyp1cHNjYWxlU2l6ZSwgNywgMCwgMSwgNyk7XHJcbiAgICAgICAgVWlBc3NldHMudWlfZnJhbWUucmVuZGVyUGFydGlhbCh0YXJnZXQsIHgrNyp1cHNjYWxlU2l6ZSwgeStoLTcqdXBzY2FsZVNpemUsIHctMTQqdXBzY2FsZVNpemUsIDcqdXBzY2FsZVNpemUsIDcsIDgsIDEsIDcpO1xyXG5cclxuICAgICAgICAvLyBsZWZ0IGFuZCByaWdodFxyXG4gICAgICAgIFVpQXNzZXRzLnVpX2ZyYW1lLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4LCB5KzcqdXBzY2FsZVNpemUsIDcqdXBzY2FsZVNpemUsIGgtMTQqdXBzY2FsZVNpemUsIDAsIDcsIDcsIDEpO1xyXG4gICAgICAgIFVpQXNzZXRzLnVpX2ZyYW1lLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4K3ctNyp1cHNjYWxlU2l6ZSwgeSs3KnVwc2NhbGVTaXplLCA3KnVwc2NhbGVTaXplLCBoLTE0KnVwc2NhbGVTaXplLCA4LCA3LCA3LCAxKTtcclxuXHJcbiAgICAgICAgLy8gY2VudGVyXHJcbiAgICAgICAgVWlBc3NldHMudWlfZnJhbWUucmVuZGVyUGFydGlhbCh0YXJnZXQsIHgrNyp1cHNjYWxlU2l6ZSwgeSs3KnVwc2NhbGVTaXplLCB3LTE0KnVwc2NhbGVTaXplLCBoLTE0KnVwc2NhbGVTaXplLCA3LCA3LCAxLCAxKTtcclxuXHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBSZW5kZXJhYmxlIH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9SZW5kZXJhYmxlJztcclxuaW1wb3J0IHA1IGZyb20gJ3A1JztcclxuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSAnLi9CdXR0b24nO1xyXG5pbXBvcnQgeyBTbGlkZXIgfSBmcm9tICcuL1NsaWRlcic7XHJcbmltcG9ydCB7IFVpRnJhbWUgfSBmcm9tICcuL1VpRnJhbWUnO1xyXG5pbXBvcnQgeyBnYW1lIH0gZnJvbSAnLi4vR2FtZSc7XHJcbmltcG9ydCB7IElucHV0Qm94IH0gZnJvbSAnLi9JbnB1dEJveCc7XHJcbmltcG9ydCB7IFVpQXNzZXRzIH0gZnJvbSAnLi4vYXNzZXRzL0Fzc2V0cyc7XHJcbmltcG9ydCB7IEZvbnRSZXNvdXJjZSB9IGZyb20gJy4uL2Fzc2V0cy9yZXNvdXJjZXMvRm9udFJlc291cmNlJztcclxuXHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgVWlTY3JlZW4gaW1wbGVtZW50cyBSZW5kZXJhYmxlIHtcclxuXHJcbiAgICBidXR0b25zOiBCdXR0b25bXTtcclxuICAgIHNsaWRlcnM6IFNsaWRlcltdO1xyXG4gICAgaW5wdXRCb3hlczogSW5wdXRCb3hbXTtcclxuICAgIHNjcm9sbD86IG51bWJlcjtcclxuICAgIG1pblNjcm9sbDogbnVtYmVyID0gMDtcclxuICAgIG1heFNjcm9sbDogbnVtYmVyID0gMDtcclxuXHJcbiAgICBmcmFtZTogVWlGcmFtZVxyXG5cclxuICAgIHRpdGxlRm9udDogRm9udFJlc291cmNlXHJcblxyXG4gICAgYWJzdHJhY3QgcmVuZGVyKHRhcmdldDogcDUsIHVwc2NhbGVTaXplOiBudW1iZXIpOiB2b2lkO1xyXG5cclxuICAgIGFic3RyYWN0IHdpbmRvd1VwZGF0ZSgpOiB2b2lkXHJcblxyXG4gICAgbW91c2VQcmVzc2VkKGJ0bjogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYodGhpcy5idXR0b25zICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgLy8gbG9vcCB0aHJvdWdoIGFsbCB0aGUgYnV0dG9ucyBpbiB0aGlzIG1lbnUgYW5kIGlmIHRoZSBtb3VzZSBpcyBvdmVyIHRoZW0sIHRoZW4gY2FsbCB0aGUgYnV0dG9uJ3Mgb25QcmVzc2VkKCkgZnVuY3Rpb24uICBUaGUgb25QcmVzc2VkKCkgZnVuY3Rpb24gaXMgcGFzc2VkIGluIHRocm91Z2ggdGhlIGNvbnN0cnVjdG9yLlxyXG4gICAgICAgICAgICBmb3IoY29uc3QgaSBvZiB0aGlzLmJ1dHRvbnMpIHtcclxuICAgICAgICAgICAgICAgIGlmKGkubW91c2VJc092ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBpLm9uUHJlc3NlZCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLnNsaWRlcnMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAvLyBsb29wIHRocm91Z2ggYWxsIHRoZSBzbGlkZXJzIGFuZCBpbnRlcmFjdCB3aXRoIHRoZW0gYWNjb3JkaW5nbHlcclxuICAgICAgICAgICAgZm9yKGNvbnN0IGkgb2YgdGhpcy5zbGlkZXJzKSB7XHJcbiAgICAgICAgICAgICAgICBpLnVwZGF0ZVNsaWRlclBvc2l0aW9uKGdhbWUubW91c2VYKTtcclxuICAgICAgICAgICAgICAgIGlmKGdhbWUubW91c2VYPmkueCAmJiBnYW1lLm1vdXNlWDxpLngraS53ICYmIGdhbWUubW91c2VZPmkueSAmJiBnYW1lLm1vdXNlWTxpLnkraS5oKVxyXG4gICAgICAgICAgICAgICAgICAgIGkuYmVpbmdFZGl0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMuaW5wdXRCb3hlcyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2codGhpcy5pbnB1dEJveGVzKTtcclxuICAgICAgICAgICAgLy8gbG9vcCB0aHJvdWdoIGFsbCB0aGUgaW5wdXQgYm94ZXMgYW5kIGludGVyYWN0IHdpdGggdGhlbSBhY2NvcmRpbmdseVxyXG4gICAgICAgICAgICBmb3IoY29uc3QgaSBvZiB0aGlzLmlucHV0Qm94ZXMpIHtcclxuICAgICAgICAgICAgICAgIGlmKGkubW91c2VJc092ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBpLm9uUHJlc3NlZCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZihpLmxpc3RlbmluZykge1xyXG4gICAgICAgICAgICAgICAgICAgIGkubGlzdGVuaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS5jb250cm9sc1tpLmluZGV4XS5rZXlDb2RlID0gYnRuO1xyXG4gICAgICAgICAgICAgICAgICAgIGdhbWUuY29udHJvbHNbaS5pbmRleF0ua2V5Ym9hcmQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBpLnZhbHVlID0gYnRuO1xyXG4gICAgICAgICAgICAgICAgICAgIGkua2V5Ym9hcmQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBpLmltYWdlID0gVWlBc3NldHMuYnV0dG9uX3Vuc2VsZWN0ZWQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbW91c2VSZWxlYXNlZCgpIHtcclxuICAgICAgICBpZih0aGlzLnNsaWRlcnMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAvLyBsb29wIHRocm91Z2ggYWxsIHRoZSBzbGlkZXJzIGFuZCBpbnRlcmFjdCB3aXRoIHRoZW0gYWNjb3JkaW5nbHlcclxuICAgICAgICAgICAgZm9yKGNvbnN0IGkgb2YgdGhpcy5zbGlkZXJzKSB7XHJcbiAgICAgICAgICAgICAgICBpLmJlaW5nRWRpdGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IHsgVWlTY3JlZW4gfSBmcm9tICcuLi9VaVNjcmVlbic7XHJcbmltcG9ydCBwNSBmcm9tICdwNSc7XHJcbmltcG9ydCB7IFVpRnJhbWUgfSBmcm9tICcuLi9VaUZyYW1lJztcclxuaW1wb3J0IHsgZ2FtZSB9IGZyb20gJy4uLy4uL0dhbWUnO1xyXG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tICcuLi9CdXR0b24nO1xyXG5pbXBvcnQgeyBGb250UmVzb3VyY2UgfSBmcm9tICcuLi8uLi9hc3NldHMvcmVzb3VyY2VzL0ZvbnRSZXNvdXJjZSc7XHJcbmltcG9ydCB7IE9wdGlvbnNNZW51IH0gZnJvbSAnLi9PcHRpb25zTWVudSc7XHJcbmltcG9ydCB7IElucHV0Qm94IH0gZnJvbSAnLi4vSW5wdXRCb3gnO1xyXG5pbXBvcnQgeyBDb250cm9sIH0gZnJvbSAnLi4vLi4vaW5wdXQvQ29udHJvbCdcclxuXHJcbmV4cG9ydCBjbGFzcyBDb250cm9sc01lbnUgZXh0ZW5kcyBVaVNjcmVlbiB7XHJcblxyXG5cdGNvbnN0cnVjdG9yKGZvbnQ6IEZvbnRSZXNvdXJjZSwgdGl0bGVGb250OiBGb250UmVzb3VyY2UsIHByZXZpb3VzTWVudTogc3RyaW5nKSB7XHJcblx0XHRzdXBlcigpO1xyXG5cdFx0Ly8gbWFrZSB0aGUgZnJhbWUgd2l0aCBzb21lIGRlZmF1bHQgdmFsdWVzLiAgVGhlc2Ugd2lsbCBsYXRlciBiZSBjaGFuZ2VkIHRvIGZpdCB0aGUgc2NyZWVuIHNpemUuXHJcblx0XHR0aGlzLmZyYW1lID0gbmV3IFVpRnJhbWUoMCwgMCwgMCwgMCk7XHJcblxyXG5cdFx0Ly8gbWFrZSBzb21lIGJ1dHRvbnMgd2l0aCBkZWZhdWx0IHBvc2l0aW9uc1xyXG5cdFx0dGhpcy5idXR0b25zID0gW1xyXG5cdFx0XHRuZXcgQnV0dG9uKGZvbnQsIFwiQmFja1wiLCBcIlJldHVybiB0byB0aGUgb3B0aW9ucyBtZW51LlwiLCAwLCAwLCAwLCAwLCAoKSA9PiB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJvcHRpb25zIG1lbnVcIik7XHJcblx0XHRcdFx0Z2FtZS5jdXJyZW50VWkgPSBuZXcgT3B0aW9uc01lbnUoZm9udCwgdGl0bGVGb250LCBwcmV2aW91c01lbnUpO1xyXG5cdFx0XHR9KVxyXG5cdFx0XTtcclxuXHJcblx0XHR0aGlzLmlucHV0Qm94ZXMgPSBbXHJcblx0XHRcdC8vIG5ldyBJbnB1dEJveChmb250LCBcIldhbGsgUmlnaHRcIiwgdHJ1ZSwgNjgsIDAsIDAsIDAsIDAsIDApLFxyXG5cdFx0XHQvLyBuZXcgSW5wdXRCb3goZm9udCwgXCJXYWxrIExlZnRcIiwgdHJ1ZSwgNjUsIDEsIDAsIDAsIDAsIDApLFxyXG5cdFx0XHQvLyBuZXcgSW5wdXRCb3goZm9udCwgXCJKdW1wXCIsIHRydWUsIDMyLCAyLCAwLCAwLCAwLCAwKSxcclxuXHRcdFx0Ly8gbmV3IElucHV0Qm94KGZvbnQsIFwiUGF1c2VcIiwgdHJ1ZSwgMjcsIDMsIDAsIDAsIDAsIDApXHJcblx0XHRdXHJcblxyXG5cdFx0bGV0IGkgPSAwO1xyXG5cdFx0Zm9yIChsZXQgY29udHJvbCBvZiBnYW1lLmNvbnRyb2xzKSB7XHJcblx0XHRcdGkrKztcclxuXHRcdFx0dGhpcy5pbnB1dEJveGVzLnB1c2gobmV3IElucHV0Qm94KGZvbnQsIGNvbnRyb2wuZGVzY3JpcHRpb24sIGNvbnRyb2wua2V5Ym9hcmQsIGNvbnRyb2wua2V5Q29kZSwgaSwgMCwgMCwgMCwgMCkpO1xyXG5cdFx0fVxyXG5cdFx0Ly8gdXBkYXRlIHRoZSBzaXplIG9mIHRoZSBlbGVtZW50cyBiYXNlZCBvbiB0aGUgaW5pdGlhbCBzY3JlZW4gc2l6ZVxyXG5cdFx0dGhpcy53aW5kb3dVcGRhdGUoKTtcclxuXHR9XHJcblxyXG5cdHJlbmRlcih0YXJnZXQ6IHA1LCB1cHNjYWxlU2l6ZTogbnVtYmVyKTogdm9pZCB7XHJcblxyXG5cdFx0Ly8gcmVuZGVyIHRoZSByZWN0YW5ndWxhciBpbWFnZVxyXG5cdFx0dGhpcy5mcmFtZS5yZW5kZXIodGFyZ2V0LCB1cHNjYWxlU2l6ZSk7XHJcblxyXG5cdFx0Ly8gbG9vcCB0aHJvdWdoIHRoZSBidXR0b25zIGFycmF5IGFuZCByZW5kZXIgZWFjaCBvbmUuXHJcblx0XHR0aGlzLmJ1dHRvbnMuZm9yRWFjaChidXR0b24gPT4ge1xyXG5cdFx0XHRidXR0b24ucmVuZGVyKHRhcmdldCwgdXBzY2FsZVNpemUpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0Ly8gbG9vcCB0aHJvdWdoIHRoZSBpbnB1dEJveGVzIGFycmF5IGFuZCByZW5kZXIgZWFjaCBvbmUuXHJcblx0XHR0aGlzLmlucHV0Qm94ZXMuZm9yRWFjaChpbnB1dEJveCA9PiB7XHJcblx0XHRcdGlucHV0Qm94LnJlbmRlcih0YXJnZXQsIHVwc2NhbGVTaXplKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0d2luZG93VXBkYXRlKCkge1xyXG5cdFx0Ly8gc2V0IHRoZSBwb3NpdGlvbiBvZiB0aGUgZnJhbWVcclxuXHRcdHRoaXMuZnJhbWUueCA9IGdhbWUud2lkdGggLyAyIC0gMjAwIC8gMiAqIGdhbWUudXBzY2FsZVNpemU7Ly8gY2VudGVyIHRoZSBmcmFtZSBpbiB0aGUgY2VudGVyIG9mIHRoZSBzY3JlZW5cclxuXHRcdHRoaXMuZnJhbWUueSA9IGdhbWUuaGVpZ2h0IC8gMiAtIDU2ICogZ2FtZS51cHNjYWxlU2l6ZTtcclxuXHRcdHRoaXMuZnJhbWUudyA9IDIwMCAqIGdhbWUudXBzY2FsZVNpemU7XHJcblx0XHR0aGlzLmZyYW1lLmggPSA0OCAqIGdhbWUudXBzY2FsZVNpemU7XHJcblx0fVxyXG59IiwiaW1wb3J0IHsgVWlTY3JlZW4gfSBmcm9tICcuLi9VaVNjcmVlbic7XHJcbmltcG9ydCBwNSBmcm9tICdwNSc7XHJcbmltcG9ydCB7IFVpRnJhbWUgfSBmcm9tICcuLi9VaUZyYW1lJztcclxuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSAnLi4vQnV0dG9uJztcclxuaW1wb3J0IHsgT3B0aW9uc01lbnUgfSBmcm9tICcuL09wdGlvbnNNZW51JztcclxuaW1wb3J0IHsgRm9udFJlc291cmNlIH0gZnJvbSAnLi4vLi4vYXNzZXRzL3Jlc291cmNlcy9Gb250UmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBVaUFzc2V0cyB9IGZyb20gJy4uLy4uL2Fzc2V0cy9Bc3NldHMnO1xyXG5pbXBvcnQgeyBXb3JsZENyZWF0aW9uTWVudSB9IGZyb20gJy4vV29ybGRDcmVhdGlvbk1lbnUnO1xyXG5pbXBvcnQgeyBnYW1lIH0gZnJvbSAnLi4vLi4vR2FtZSc7XHJcblxyXG5leHBvcnQgY2xhc3MgTWFpbk1lbnUgZXh0ZW5kcyBVaVNjcmVlbiB7XHJcblxyXG4gICAgaW5wdXRCb3g6IEhUTUxFbGVtZW50IHwgbnVsbFxyXG5cclxuICAgIGNvbnN0cnVjdG9yKGZvbnQ6IEZvbnRSZXNvdXJjZSwgdGl0bGVGb250OiBGb250UmVzb3VyY2UpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICB0aGlzLmlucHV0Qm94ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuYW1lXCIpO1xyXG5cclxuICAgICAgICBpZih0aGlzLmlucHV0Qm94PT1udWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW5wdXRCb3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgICAgICAgIHRoaXMuaW5wdXRCb3guc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcIm5hbWVcIik7XHJcbiAgICAgICAgICAgIHRoaXMuaW5wdXRCb3guc2V0QXR0cmlidXRlKFwiaWRcIiwgXCJuYW1lXCIpO1xyXG4gICAgICAgICAgICB0aGlzLmlucHV0Qm94LnNldEF0dHJpYnV0ZShcInBsYWNlaG9sZGVyXCIsIFwiQ2xpY2sgdG8gQ2hhbmdlIFVzZXJuYW1lLi4uXCIpO1xyXG4gICAgICAgICAgICB0aGlzLmlucHV0Qm94Lm9uaW5wdXQgPSAoKT0+e1xyXG4gICAgICAgICAgICAgICAgbGV0IHYgPSAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuYW1lXCIpIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgaWYodj09dW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGlucHV0Qm94ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuYW1lXCIpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5wdXRCb3gudmFsdWUgPSBcImVycm9yXyB1bmRlZmluZWQgdmFsdWVcIlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHYgPSB2LnN1YnN0cmluZygwLCAyMClcclxuICAgICAgICAgICAgICAgIGZvcihsZXQgaSA9IDA7IGk8di5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKCFcImFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVowMTIzNDU2Nzg5LV8gXCIuaW5jbHVkZXModltpXSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImNvbnRhaW5zIGJhZCBiYWQ6IFwiK3ZbaV0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHYgPSB2LnNsaWNlKDAsIGkpICsgdi5zbGljZShpKzEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpLS07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbGV0IGlucHV0Qm94ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuYW1lXCIpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICAgICAgICAgICAgICBpbnB1dEJveC52YWx1ZSA9IHZcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuaW5wdXRCb3gpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gbWFrZSB0aGUgZnJhbWUgd2l0aCBzb21lIGRlZmF1bHQgdmFsdWVzLiAgVGhlc2Ugd2lsbCBsYXRlciBiZSBjaGFuZ2VkIHRvIGZpdCB0aGUgc2NyZWVuIHNpemUuXHJcbiAgICAgICAgdGhpcy5mcmFtZSA9IG5ldyBVaUZyYW1lKDAsIDAsIDAsIDApO1xyXG5cclxuICAgICAgICAvLyBtYWtlIDQgYnV0dG9ucyB3aXRoIGRlZmF1bHQgcG9zaXRpb25zXHJcbiAgICAgICAgdGhpcy5idXR0b25zID0gW1xyXG4gICAgICAgICAgICBuZXcgQnV0dG9uKGZvbnQsIFwiSm9pbiBHYW1lXCIsIFwiSm9pbiBhIGdhbWUgd2l0aCB5b3VyIGZyaWVuZHMsIG9yIG1ha2UgbmV3IG9uZXMuXCIsIDAsIDAsIDAsIDAsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiam9pbiBnYW1lXCIpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHYgPSAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuYW1lXCIpIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgaWYodj09dW5kZWZpbmVkKXY9XCJFUlJPUiBXSVRIIFBMQVlFUk5BTUVcIlxyXG4gICAgICAgICAgICAgICAgd2hpbGUodlt2Lmxlbmd0aC0xXT09PVwiIFwiKXYgPSB2LnN1YnN0cmluZygwLCB2Lmxlbmd0aC0yKVxyXG4gICAgICAgICAgICAgICAgd2hpbGUodi5sZW5ndGg8Myl2ID0gditcIl9cIlxyXG4gICAgICAgICAgICAgICAgZ2FtZS5jb25uZWN0aW9uLmVtaXQoXHJcbiAgICAgICAgICAgICAgICAgICAgJ2pvaW4nLFxyXG4gICAgICAgICAgICAgICAgICAgICdlNDAyMmQ0MDNkY2M2ZDE5ZDZhNjhiYTNhYmZkMGE2MCcsXHJcbiAgICAgICAgICAgICAgICAgICAgdixcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmlucHV0Qm94Py5yZW1vdmUoKVxyXG4gICAgICAgICAgICAgICAgZ2FtZS5jdXJyZW50VWkgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBuZXcgQnV0dG9uKGZvbnQsIFwiT3B0aW9uc1wiLCBcIkNoYW5nZSB5b3VyIGtleWJpbmRzLCByZWR1Y2UgbGFnLCBldGMuXCIsIDAsIDAsIDAsIDAsICgpID0+e1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJvcHRpb25zXCIpO1xyXG4gICAgICAgICAgICAgICAgZ2FtZS5jdXJyZW50VWkgPSBuZXcgT3B0aW9uc01lbnUoZm9udCwgdGl0bGVGb250LCBcIm1haW4gbWVudVwiKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICBdO1xyXG5cclxuICAgICAgICAvLyB1cGRhdGUgdGhlIHNpemUgb2YgdGhlIGVsZW1lbnRzIGJhc2VkIG9uIHRoZSBpbml0aWFsIHNjcmVlbiBzaXplXHJcbiAgICAgICAgdGhpcy53aW5kb3dVcGRhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIodGFyZ2V0OiBwNSwgdXBzY2FsZVNpemU6IG51bWJlcik6IHZvaWQge1xyXG5cclxuICAgICAgICAvLyByZW5kZXIgdGhlIHJlY3Rhbmd1bGFyIGltYWdlIHRoYXQgdGhlIHdob2xlIG1lbnUgaXMgb25cclxuICAgICAgICB0aGlzLmZyYW1lLnJlbmRlcih0YXJnZXQsIHVwc2NhbGVTaXplKTtcclxuXHJcbiAgICAgICAgVWlBc3NldHMudGl0bGVfaW1hZ2UucmVuZGVyKHRhcmdldCwgTWF0aC5yb3VuZCh0aGlzLmZyYW1lLngvdXBzY2FsZVNpemUrMSkqdXBzY2FsZVNpemUsIE1hdGgucm91bmQodGhpcy5mcmFtZS55L3Vwc2NhbGVTaXplKzQpKnVwc2NhbGVTaXplLCAyNTYqdXBzY2FsZVNpemUsIDQwKnVwc2NhbGVTaXplKTtcclxuXHJcbiAgICAgICAgLy8gbG9vcCB0aHJvdWdoIHRoZSBidXR0b25zIGFycmF5IGFuZCByZW5kZXIgZWFjaCBvbmUuXHJcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIHRoaXMuYnV0dG9ucykge1xyXG4gICAgICAgICAgICBpdGVtLnJlbmRlcih0YXJnZXQsIHVwc2NhbGVTaXplKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHdpbmRvd1VwZGF0ZSgpIHtcclxuXHJcbiAgICAgICAgaWYodGhpcy5pbnB1dEJveCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLmlucHV0Qm94LnN0eWxlLnRvcCA9ICgoZ2FtZS5oZWlnaHQvMikrXCJweFwiKVxyXG4gICAgICAgICAgICB0aGlzLmlucHV0Qm94LnN0eWxlLmxlZnQgPSAoKGdhbWUud2lkdGgvMi0xOTIvMipnYW1lLnVwc2NhbGVTaXplKStcInB4XCIpXHJcbiAgICAgICAgICAgIHRoaXMuaW5wdXRCb3guc3R5bGUud2lkdGggPSAoKDE5MipnYW1lLnVwc2NhbGVTaXplLTEwKStcInB4XCIpXHJcbiAgICAgICAgICAgIHRoaXMuaW5wdXRCb3guc3R5bGUuaGVpZ2h0ID0oKDE2KmdhbWUudXBzY2FsZVNpemUtMTApK1wicHhcIilcclxuICAgICAgICAgICAgdGhpcy5pbnB1dEJveC5zdHlsZS5mb250U2l6ZSA9KCgxMCpnYW1lLnVwc2NhbGVTaXplKStcInB4XCIpXHJcbiAgICAgICAgICAgIHRoaXMuaW5wdXRCb3guc3R5bGUuYm9yZGVyUmFkaXVzID0gKCg2KmdhbWUudXBzY2FsZVNpemUpK1wicHhcIilcclxuICAgICAgICAgICAgdGhpcy5pbnB1dEJveC5zdHlsZS5ib3JkZXJXaWR0aCA9ICgoMSpnYW1lLnVwc2NhbGVTaXplKStcInB4XCIpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBzZXQgdGhlIHBvc2l0aW9uIG9mIHRoZSBmcmFtZVxyXG4gICAgICAgIHRoaXMuZnJhbWUueCA9IGdhbWUud2lkdGgvMi0yNjQvMipnYW1lLnVwc2NhbGVTaXplOy8vIGNlbnRlciB0aGUgZnJhbWUgaW4gdGhlIG1pZGRsZSBvZiB0aGUgc2NyZWVuXHJcbiAgICAgICAgdGhpcy5mcmFtZS55ID0gZ2FtZS5oZWlnaHQvMi01NipnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgIHRoaXMuZnJhbWUudyA9IDI2NCpnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgIHRoaXMuZnJhbWUuaCA9IDQ4KmdhbWUudXBzY2FsZVNpemU7XHJcblxyXG4gICAgICAgIC8vIHNldCB0aGUgcG9zaXRpb25zIG9mIGFsbCB0aGUgYnV0dG9uc1xyXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGk8dGhpcy5idXR0b25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS54ID0gZ2FtZS53aWR0aC8yLTE5Mi8yKmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS55ID0gZ2FtZS5oZWlnaHQvMisyMCooaSsxKSpnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0udyA9IDE5MipnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0uaCA9IDE2KmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS51cGRhdGVNb3VzZU92ZXIoZ2FtZS5tb3VzZVgsIGdhbWUubW91c2VZKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCB7IFVpU2NyZWVuIH0gZnJvbSAnLi4vVWlTY3JlZW4nO1xyXG5pbXBvcnQgcDUgZnJvbSAncDUnO1xyXG5pbXBvcnQgeyBVaUZyYW1lIH0gZnJvbSAnLi4vVWlGcmFtZSc7XHJcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gJy4uL0J1dHRvbic7XHJcbmltcG9ydCB7IEZvbnRSZXNvdXJjZSB9IGZyb20gJy4uLy4uL2Fzc2V0cy9yZXNvdXJjZXMvRm9udFJlc291cmNlJztcclxuaW1wb3J0IHsgTWFpbk1lbnUgfSBmcm9tICcuL01haW5NZW51JztcclxuaW1wb3J0IHsgVmlkZW9TZXR0aW5nc01lbnUgfSBmcm9tICcuL1ZpZGVvU2V0dGluZ3NNZW51JztcclxuaW1wb3J0IHsgQ29udHJvbHNNZW51IH0gZnJvbSAnLi9Db250cm9sc01lbnUnO1xyXG5pbXBvcnQgeyBnYW1lIH0gZnJvbSAnLi4vLi4vR2FtZSc7XHJcbmltcG9ydCB7IFBhdXNlTWVudSB9IGZyb20gJy4vUGF1c2VNZW51JztcclxuXHJcbmV4cG9ydCBjbGFzcyBPcHRpb25zTWVudSBleHRlbmRzIFVpU2NyZWVuIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihmb250OiBGb250UmVzb3VyY2UsIHRpdGxlRm9udDogRm9udFJlc291cmNlLCBwcmV2aW91c01lbnU6IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgLy8gbWFrZSB0aGUgZnJhbWUgd2l0aCBzb21lIGRlZmF1bHQgdmFsdWVzLiAgVGhlc2Ugd2lsbCBsYXRlciBiZSBjaGFuZ2VkIHRvIGZpdCB0aGUgc2NyZWVuIHNpemUuXHJcbiAgICAgICAgdGhpcy5mcmFtZSA9IG5ldyBVaUZyYW1lKDAsIDAsIDAsIDApO1xyXG4gICAgICAgIHRoaXMudGl0bGVGb250ID0gdGl0bGVGb250O1xyXG4gICAgICAgIC8vIG1ha2Ugc29tZSBidXR0b25zIHdpdGggZGVmYXVsdCBwb3NpdGlvbnNcclxuICAgICAgICB0aGlzLmJ1dHRvbnMgPSBbXHJcbiAgICAgICAgICAgIG5ldyBCdXR0b24oZm9udCwgXCJWaWRlbyBTZXR0aW5nc1wiLCBcIkNoYW5nZSB0aGUgYmFsYW5jZSBiZXR3ZWVuIHBlcmZvcm1hbmNlIGFuZCBmaWRlbGl0eS5cIiwgMCwgMCwgMCwgMCwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ2aWRlbyBzZXR0aW5nc1wiKTtcclxuICAgICAgICAgICAgICAgIGdhbWUuY3VycmVudFVpID0gbmV3IFZpZGVvU2V0dGluZ3NNZW51KGZvbnQsIHRpdGxlRm9udCwgcHJldmlvdXNNZW51KTtcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIG5ldyBCdXR0b24oZm9udCwgXCJDb250cm9sc1wiLCBcIkNoYW5nZSB5b3VyIGtleWJpbmRzLlwiLCAwLCAwLCAwLCAwLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImNvbnRyb2wgbWVudVwiKTtcclxuICAgICAgICAgICAgICAgIGdhbWUuY3VycmVudFVpID0gbmV3IENvbnRyb2xzTWVudShmb250LCB0aXRsZUZvbnQsIHByZXZpb3VzTWVudSk7XHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAvLyBuZXcgQnV0dG9uKGZvbnQsIFwiQXVkaW8gU2V0dGluZ3NcIiwgXCJDaGFuZ2UgdGhlIHZvbHVtZSBvZiBkaWZmZXJlbnQgc291bmRzLlwiLCAwLCAwLCAwLCAwLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIC8vICAgICBjb25zb2xlLmxvZyhcImF1ZGlvIG1lbnVcIik7XHJcbiAgICAgICAgICAgIC8vICAgICBnYW1lLmN1cnJlbnRVaSA9IG5ldyBBdWRpb1NldHRpbmdzTWVudShmb250LCB0aXRsZUZvbnQpO1xyXG4gICAgICAgICAgICAvLyB9KSxcclxuICAgICAgICAgICAgbmV3IEJ1dHRvbihmb250LCBcIkJhY2tcIiwgXCJSZXR1cm4gdG8gdGhlIFwiK3ByZXZpb3VzTWVudStcIi5cIiwgMCwgMCwgMCwgMCwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYocHJldmlvdXNNZW51PT09XCJtYWluIG1lbnVcIilnYW1lLmN1cnJlbnRVaSA9IG5ldyBNYWluTWVudShmb250LCB0aXRsZUZvbnQpO1xyXG4gICAgICAgICAgICAgICAgZWxzZSBnYW1lLmN1cnJlbnRVaSA9IG5ldyBQYXVzZU1lbnUoZm9udCwgdGl0bGVGb250KVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIF07XHJcbiAgICAgICAgLy8gdXBkYXRlIHRoZSBzaXplIG9mIHRoZSBlbGVtZW50cyBiYXNlZCBvbiB0aGUgaW5pdGlhbCBzY3JlZW4gc2l6ZVxyXG4gICAgICAgIHRoaXMud2luZG93VXBkYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKHRhcmdldDogcDUsIHVwc2NhbGVTaXplOiBudW1iZXIpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgLy8gcmVuZGVyIHRoZSByZWN0YW5ndWxhciBpbWFnZSB0aGF0IHRoZSB3aG9sZSBtZW51IGlzIG9uXHJcbiAgICAgICAgdGhpcy5mcmFtZS5yZW5kZXIodGFyZ2V0LCB1cHNjYWxlU2l6ZSk7XHJcblxyXG4gICAgICAgIC8vIGxvb3AgdGhyb3VnaCB0aGUgYnV0dG9ucyBhcnJheSBhbmQgcmVuZGVyIGVhY2ggb25lLlxyXG4gICAgICAgIHRoaXMuYnV0dG9ucy5mb3JFYWNoKGJ1dHRvbiA9PiB7XHJcbiAgICAgICAgICAgIGJ1dHRvbi5yZW5kZXIodGFyZ2V0LCB1cHNjYWxlU2l6ZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMudGl0bGVGb250LmRyYXdUZXh0KHRhcmdldCwgXCJPcHRpb25zXCIsIHRoaXMuZnJhbWUueCArIDU0KmdhbWUudXBzY2FsZVNpemUsIHRoaXMuZnJhbWUueSArIDE2KmdhbWUudXBzY2FsZVNpemUpXHJcbiAgICB9XHJcblxyXG4gICAgd2luZG93VXBkYXRlKCkge1xyXG4gICAgICAgIC8vIHNldCB0aGUgcG9zaXRpb24gb2YgdGhlIGZyYW1lXHJcbiAgICAgICAgdGhpcy5mcmFtZS54ID0gZ2FtZS53aWR0aC8yLTIwMC8yKmdhbWUudXBzY2FsZVNpemU7Ly8gY2VudGVyIHRoZSBmcmFtZSBpbiB0aGUgY2VudGVyIG9mIHRoZSBzY3JlZW5cclxuICAgICAgICB0aGlzLmZyYW1lLnkgPSBnYW1lLmhlaWdodC8yLTU2KmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgdGhpcy5mcmFtZS53ID0gMjAwKmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgdGhpcy5mcmFtZS5oID0gNDgqZ2FtZS51cHNjYWxlU2l6ZTtcclxuXHJcbiAgICAgICAgLy8gc2V0IHRoZSBwb3NpdGlvbnMgb2YgYWxsIHRoZSBidXR0b25zXHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaTx0aGlzLmJ1dHRvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLnggPSBnYW1lLndpZHRoLzItMTkyLzIqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLnkgPSBnYW1lLmhlaWdodC8yKzIwKmkqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLncgPSAxOTIqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLmggPSAxNipnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0udXBkYXRlTW91c2VPdmVyKGdhbWUubW91c2VYLCBnYW1lLm1vdXNlWSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCB7IFVpU2NyZWVuIH0gZnJvbSAnLi4vVWlTY3JlZW4nO1xyXG5pbXBvcnQgcDUgZnJvbSAncDUnO1xyXG5pbXBvcnQgeyBVaUZyYW1lIH0gZnJvbSAnLi4vVWlGcmFtZSc7XHJcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gJy4uL0J1dHRvbic7XHJcbmltcG9ydCB7IE9wdGlvbnNNZW51IH0gZnJvbSAnLi9PcHRpb25zTWVudSc7XHJcbmltcG9ydCB7IEZvbnRSZXNvdXJjZSB9IGZyb20gJy4uLy4uL2Fzc2V0cy9yZXNvdXJjZXMvRm9udFJlc291cmNlJztcclxuaW1wb3J0IHsgTWFpbk1lbnUgfSBmcm9tICcuL01haW5NZW51JztcclxuaW1wb3J0IHsgZ2FtZSB9IGZyb20gJy4uLy4uL0dhbWUnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFBhdXNlTWVudSBleHRlbmRzIFVpU2NyZWVuIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihmb250OiBGb250UmVzb3VyY2UsIHRpdGxlRm9udDogRm9udFJlc291cmNlKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgLy8gbWFrZSB0aGUgZnJhbWUgd2l0aCBzb21lIGRlZmF1bHQgdmFsdWVzLiAgVGhlc2Ugd2lsbCBsYXRlciBiZSBjaGFuZ2VkIHRvIGZpdCB0aGUgc2NyZWVuIHNpemUuXHJcbiAgICAgICAgdGhpcy5mcmFtZSA9IG5ldyBVaUZyYW1lKDAsIDAsIDAsIDApO1xyXG5cclxuICAgICAgICB0aGlzLnRpdGxlRm9udCA9IHRpdGxlRm9udDtcclxuXHJcbiAgICAgICAgLy8gbWFrZSA0IGJ1dHRvbnMgd2l0aCBkZWZhdWx0IHBvc2l0U2lvbnNcclxuICAgICAgICB0aGlzLmJ1dHRvbnMgPSBbXHJcbiAgICAgICAgICAgIG5ldyBCdXR0b24oZm9udCwgXCJSZXN1bWUgZ2FtZVwiLCBcIkdvIGJhY2sgdG8gdGhlIGdhbWUuXCIsIDAsIDAsIDAsIDAsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGdhbWUuY3VycmVudFVpID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgbmV3IEJ1dHRvbihmb250LCBcIk9wdGlvbnNcIiwgXCJDaGFuZ2UgeW91ciBrZXliaW5kcywgcmVkdWNlIGxhZywgZXRjLlwiLCAwLCAwLCAwLCAwLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBnYW1lLmN1cnJlbnRVaSA9IG5ldyBPcHRpb25zTWVudShmb250LCB0aXRsZUZvbnQsIFwicGF1c2UgbWVudVwiKTtcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIG5ldyBCdXR0b24oZm9udCwgXCJMZWF2ZSBnYW1lXCIsIFwiR28gYmFjayB0byBNYWluIE1lbnVcIiwgMCwgMCwgMCwgMCwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZ2FtZS5jdXJyZW50VWkgPSBuZXcgTWFpbk1lbnUoZm9udCwgdGl0bGVGb250KTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICBdO1xyXG5cclxuICAgICAgICAvLyB1cGRhdGUgdGhlIHNpemUgb2YgdGhlIGVsZW1lbnRzIGJhc2VkIG9uIHRoZSBpbml0aWFsIHNjcmVlbiBzaXplXHJcbiAgICAgICAgdGhpcy53aW5kb3dVcGRhdGUoKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgcmVuZGVyKHRhcmdldDogcDUsIHVwc2NhbGVTaXplOiBudW1iZXIpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgLy8gcmVuZGVyIHRoZSByZWN0YW5ndWxhciBpbWFnZSB0aGF0IHRoZSB3aG9sZSBtZW51IGlzIG9uXHJcbiAgICAgICAgdGhpcy5mcmFtZS5yZW5kZXIodGFyZ2V0LCB1cHNjYWxlU2l6ZSk7XHJcblxyXG4gICAgICAgIC8vIGxvb3AgdGhyb3VnaCB0aGUgYnV0dG9ucyBhcnJheSBhbmQgcmVuZGVyIGVhY2ggb25lLlxyXG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB0aGlzLmJ1dHRvbnMpIHtcclxuICAgICAgICAgICAgaXRlbS5yZW5kZXIodGFyZ2V0LCB1cHNjYWxlU2l6ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnRpdGxlRm9udC5kcmF3VGV4dCh0YXJnZXQsIFwiUGF1c2VkXCIsIHRoaXMuZnJhbWUueCArIDU0KmdhbWUudXBzY2FsZVNpemUsIHRoaXMuZnJhbWUueSArIDE2KmdhbWUudXBzY2FsZVNpemUpXHJcblxyXG4gICAgfVxyXG5cclxuICAgIHdpbmRvd1VwZGF0ZSgpIHtcclxuICAgICAgICAvLyBzZXQgdGhlIHBvc2l0aW9uIG9mIHRoZSBmcmFtZVxyXG4gICAgICAgIHRoaXMuZnJhbWUueCA9IGdhbWUud2lkdGgvMi0yMDAvMipnYW1lLnVwc2NhbGVTaXplOy8vIGNlbnRlciB0aGUgZnJhbWUgaW4gdGhlIG1pZGRsZSBvZiB0aGUgc2NyZWVuXHJcbiAgICAgICAgdGhpcy5mcmFtZS55ID0gZ2FtZS5oZWlnaHQvMi03MipnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgIHRoaXMuZnJhbWUudyA9IDIwMCpnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgIHRoaXMuZnJhbWUuaCA9IDU0KmdhbWUudXBzY2FsZVNpemU7XHJcblxyXG4gICAgICAgIC8vIHNldCB0aGUgcG9zaXRpb25zIG9mIGFsbCB0aGUgYnV0dG9uc1xyXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGk8dGhpcy5idXR0b25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS54ID0gZ2FtZS53aWR0aC8yLTE5Mi8yKmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS55ID0gZ2FtZS5oZWlnaHQvMisyMCppKmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS53ID0gMTkyKmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS5oID0gMTYqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLnVwZGF0ZU1vdXNlT3ZlcihnYW1lLm1vdXNlWCwgZ2FtZS5tb3VzZVkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IHsgVWlTY3JlZW4gfSBmcm9tICcuLi9VaVNjcmVlbic7XHJcbmltcG9ydCBwNSBmcm9tICdwNSc7XHJcbmltcG9ydCB7IFVpRnJhbWUgfSBmcm9tICcuLi9VaUZyYW1lJztcclxuaW1wb3J0IHsgZ2FtZSB9IGZyb20gJy4uLy4uL0dhbWUnO1xyXG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tICcuLi9CdXR0b24nO1xyXG5pbXBvcnQgeyBGb250UmVzb3VyY2UgfSBmcm9tICcuLi8uLi9hc3NldHMvcmVzb3VyY2VzL0ZvbnRSZXNvdXJjZSc7XHJcbmltcG9ydCB7IE9wdGlvbnNNZW51IH0gZnJvbSAnLi9PcHRpb25zTWVudSc7XHJcblxyXG5leHBvcnQgY2xhc3MgVmlkZW9TZXR0aW5nc01lbnUgZXh0ZW5kcyBVaVNjcmVlbiB7XHJcblxyXG5cdGNvbnN0cnVjdG9yKGZvbnQ6IEZvbnRSZXNvdXJjZSwgdGl0bGVGb250OiBGb250UmVzb3VyY2UsIHByZXZpb3VzTWVudTogc3RyaW5nKSB7XHJcblx0XHRzdXBlcigpO1xyXG5cdFx0Ly8gbWFrZSB0aGUgZnJhbWUgd2l0aCBzb21lIGRlZmF1bHQgdmFsdWVzLiAgVGhlc2Ugd2lsbCBsYXRlciBiZSBjaGFuZ2VkIHRvIGZpdCB0aGUgc2NyZWVuIHNpemUuXHJcblx0XHR0aGlzLmZyYW1lID0gbmV3IFVpRnJhbWUoMCwgMCwgMCwgMCk7XHJcblxyXG5cclxuXHRcdGlmKGdhbWUuc2t5TW9kID09PSB1bmRlZmluZWQpXHJcblx0XHRcdGdhbWUuc2t5TW9kID0gMjtcclxuXHJcblx0XHRpZihnYW1lLnNreVRvZ2dsZSA9PT0gdW5kZWZpbmVkKVxyXG5cdFx0XHRnYW1lLnNreVRvZ2dsZSA9IHRydWU7XHJcblxyXG5cdFx0aWYoZ2FtZS5wYXJ0aWNsZU11bHRpcGxpZXIgPT09IHVuZGVmaW5lZClcclxuXHRcdFx0Z2FtZS5wYXJ0aWNsZU11bHRpcGxpZXIgPSAxO1xyXG5cclxuXHRcdGxldCB0ZW1wU2t5TW9kZVRleHQ7XHJcblxyXG5cdFx0aWYoZ2FtZS5za3lNb2Q9PT0yKSB7XHJcblx0XHRcdHRlbXBTa3lNb2RlVGV4dCA9IFwiSGFsZiBGcmFtZXJhdGVcIjtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYoZ2FtZS5za3lNb2Q9PT0xKSB7XHJcblx0XHRcdHRlbXBTa3lNb2RlVGV4dCA9IFwiRnVsbCBGcmFtZXJhdGVcIjtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHR0ZW1wU2t5TW9kZVRleHQgPSBcIlNvbGlkIENvbG9yXCI7XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IHRlbXBQYXJ0aWNsZVRleHQ7XHJcblxyXG5cdFx0aWYoZ2FtZS5wYXJ0aWNsZU11bHRpcGxpZXI9PT0yKSB7XHJcblx0XHRcdHRlbXBQYXJ0aWNsZVRleHQgPSBcIkRvdWJsZVwiO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZihnYW1lLnBhcnRpY2xlTXVsdGlwbGllcj09PTEpIHtcclxuXHRcdFx0dGVtcFBhcnRpY2xlVGV4dCA9IFwiTm9ybWFsXCI7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0dGVtcFBhcnRpY2xlVGV4dCA9IFwiTWluaW1hbFwiO1xyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyBtYWtlIHNvbWUgYnV0dG9ucyB3aXRoIGRlZmF1bHQgcG9zaXRpb25zXHJcblx0XHR0aGlzLmJ1dHRvbnMgPSBbXHJcblx0XHRcdG5ldyBCdXR0b24oZm9udCwgYFNreTogJHt0ZW1wU2t5TW9kZVRleHR9YCwgXCJDaGFuZ2UgdGhlIGFwcGVhcmFuY2Ugb2YgdGhlIHNreS5cIiwgMCwgMCwgMCwgMCwgKCkgPT4ge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKFwic2t5IHRvZ2dsZVwiKTtcclxuXHRcdFx0XHRpZih0aGlzLmJ1dHRvbnNbMF0udHh0ID09PSBcIlNreTogSGFsZiBGcmFtZXJhdGVcIil7XHJcblx0XHRcdFx0XHR0aGlzLmJ1dHRvbnNbMF0udHh0ID0gXCJTa3k6IEZ1bGwgRnJhbWVyYXRlXCI7XHJcblx0XHRcdFx0XHRnYW1lLnNreU1vZCA9IDE7XHJcblx0XHRcdFx0XHRnYW1lLnNreVRvZ2dsZSA9IHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2UgaWYodGhpcy5idXR0b25zWzBdLnR4dCA9PT0gXCJTa3k6IEZ1bGwgRnJhbWVyYXRlXCIpIHtcclxuXHRcdFx0XHRcdHRoaXMuYnV0dG9uc1swXS50eHQgPSBcIlNreTogU29saWQgQ29sb3JcIjtcclxuXHRcdFx0XHRcdGdhbWUuc2t5VG9nZ2xlID0gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5idXR0b25zWzBdLnR4dCA9IFwiU2t5OiBIYWxmIEZyYW1lcmF0ZVwiO1xyXG5cdFx0XHRcdFx0Z2FtZS5za3lNb2QgPSAyO1xyXG5cdFx0XHRcdFx0Z2FtZS5za3lUb2dnbGUgPSB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSksXHJcblx0XHRcdG5ldyBCdXR0b24oZm9udCwgYFBhcnRpY2xlczogJHt0ZW1wUGFydGljbGVUZXh0fWAsIFwiQ2hhbmdlIHRoZSBhbW91bnQgb2YgcGFydGljbGVzXCIsIDAsIDAsIDAsIDAsICgpID0+IHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhcInBhcnRpY2xlc1wiKTtcclxuXHRcdFx0XHRpZih0aGlzLmJ1dHRvbnNbMV0udHh0ID09PSBcIlBhcnRpY2xlczogTm9ybWFsXCIpe1xyXG5cdFx0XHRcdFx0dGhpcy5idXR0b25zWzFdLnR4dCA9IFwiUGFydGljbGVzOiBEb3VibGVcIjtcclxuXHRcdFx0XHRcdGdhbWUucGFydGljbGVNdWx0aXBsaWVyID0gMjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSBpZih0aGlzLmJ1dHRvbnNbMV0udHh0ID09PSBcIlBhcnRpY2xlczogRG91YmxlXCIpIHtcclxuXHRcdFx0XHRcdHRoaXMuYnV0dG9uc1sxXS50eHQgPSBcIlBhcnRpY2xlczogTWluaW1hbFwiO1xyXG5cdFx0XHRcdFx0Z2FtZS5wYXJ0aWNsZU11bHRpcGxpZXIgPSAwLjU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5idXR0b25zWzFdLnR4dCA9IFwiUGFydGljbGVzOiBOb3JtYWxcIjtcclxuXHRcdFx0XHRcdGdhbWUucGFydGljbGVNdWx0aXBsaWVyID0gMTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pLFxyXG5cdFx0XHRuZXcgQnV0dG9uKGZvbnQsIFwiQmFja1wiLCBcIlJldHVybiB0byB0aGUgbWFpbiBtZW51LlwiLCAwLCAwLCAwLCAwLCAoKSA9PiB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJtYWluIG1lbnVcIik7XHJcblx0XHRcdFx0Z2FtZS5jdXJyZW50VWkgPSBuZXcgT3B0aW9uc01lbnUoZm9udCwgdGl0bGVGb250LCBwcmV2aW91c01lbnUpO1xyXG5cdFx0XHR9KVxyXG5cdFx0XTtcclxuXHRcdC8vIHVwZGF0ZSB0aGUgc2l6ZSBvZiB0aGUgZWxlbWVudHMgYmFzZWQgb24gdGhlIGluaXRpYWwgc2NyZWVuIHNpemVcclxuXHRcdHRoaXMud2luZG93VXBkYXRlKCk7XHJcblx0fVxyXG5cclxuXHRyZW5kZXIodGFyZ2V0OiBwNSwgdXBzY2FsZVNpemU6IG51bWJlcik6IHZvaWQge1xyXG5cclxuXHRcdC8vIHJlbmRlciB0aGUgcmVjdGFuZ3VsYXIgaW1hZ2VcclxuXHRcdHRoaXMuZnJhbWUucmVuZGVyKHRhcmdldCwgdXBzY2FsZVNpemUpO1xyXG5cclxuXHRcdC8vIGxvb3AgdGhyb3VnaCB0aGUgYnV0dG9ucyBhcnJheSBhbmQgcmVuZGVyIGVhY2ggb25lLlxyXG5cdFx0dGhpcy5idXR0b25zLmZvckVhY2goYnV0dG9uID0+IHtcclxuXHRcdFx0YnV0dG9uLnJlbmRlcih0YXJnZXQsIHVwc2NhbGVTaXplKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0d2luZG93VXBkYXRlKCkge1xyXG5cdFx0Ly8gc2V0IHRoZSBwb3NpdGlvbiBvZiB0aGUgZnJhbWVcclxuXHRcdHRoaXMuZnJhbWUueCA9IGdhbWUud2lkdGggLyAyIC0gMjAwIC8gMiAqIGdhbWUudXBzY2FsZVNpemU7Ly8gY2VudGVyIHRoZSBmcmFtZSBpbiB0aGUgY2VudGVyIG9mIHRoZSBzY3JlZW5cclxuXHRcdHRoaXMuZnJhbWUueSA9IGdhbWUuaGVpZ2h0IC8gMiAtIDU2ICogZ2FtZS51cHNjYWxlU2l6ZTtcclxuXHRcdHRoaXMuZnJhbWUudyA9IDIwMCAqIGdhbWUudXBzY2FsZVNpemU7XHJcblx0XHR0aGlzLmZyYW1lLmggPSA0OCAqIGdhbWUudXBzY2FsZVNpemU7XHJcblxyXG5cdFx0Ly8gc2V0IHRoZSBwb3NpdGlvbnMgb2YgYWxsIHRoZSBidXR0b25zXHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYnV0dG9ucy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHR0aGlzLmJ1dHRvbnNbaV0ueCA9IGdhbWUud2lkdGggLyAyIC0gMTkyIC8gMiAqIGdhbWUudXBzY2FsZVNpemU7XHJcblx0XHRcdHRoaXMuYnV0dG9uc1tpXS55ID0gZ2FtZS5oZWlnaHQgLyAyICsgMjAgKiBpICogZ2FtZS51cHNjYWxlU2l6ZTtcclxuXHRcdFx0dGhpcy5idXR0b25zW2ldLncgPSAxOTIgKiBnYW1lLnVwc2NhbGVTaXplO1xyXG5cdFx0XHR0aGlzLmJ1dHRvbnNbaV0uaCA9IDE2ICogZ2FtZS51cHNjYWxlU2l6ZTtcclxuXHRcdFx0dGhpcy5idXR0b25zW2ldLnVwZGF0ZU1vdXNlT3ZlcihnYW1lLm1vdXNlWCwgZ2FtZS5tb3VzZVkpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcbn0iLCJpbXBvcnQgUDUgZnJvbSAncDUnO1xyXG5pbXBvcnQgeyBUaWNrYWJsZSB9IGZyb20gJy4uL2ludGVyZmFjZXMvVGlja2FibGUnO1xyXG5pbXBvcnQgeyBSZW5kZXJhYmxlIH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9SZW5kZXJhYmxlJztcclxuaW1wb3J0IHsgZ2FtZSwgR2FtZSB9IGZyb20gJy4uL0dhbWUnO1xyXG5pbXBvcnQgeyBQbGF5ZXJMb2NhbCB9IGZyb20gJy4uL3BsYXllci9QbGF5ZXJMb2NhbCc7XHJcbmltcG9ydCB7IFNlcnZlckVudGl0eSB9IGZyb20gJy4vZW50aXRpZXMvU2VydmVyRW50aXR5JztcclxuaW1wb3J0IHsgU25hcHNob3RJbnRlcnBvbGF0aW9uIH0gZnJvbSAnQGdlY2tvcy5pby9zbmFwc2hvdC1pbnRlcnBvbGF0aW9uJztcclxuaW1wb3J0IHsgRW50aXR5LCBTbmFwc2hvdCB9IGZyb20gJ0BnZWNrb3MuaW8vc25hcHNob3QtaW50ZXJwb2xhdGlvbi9saWIvdHlwZXMnO1xyXG5pbXBvcnQgeyBXb3JsZFRpbGVzIH0gZnJvbSAnLi9Xb3JsZFRpbGVzJztcclxuaW1wb3J0IHsgVGlsZVR5cGUgfSBmcm9tICcuLi8uLi9nbG9iYWwvVGlsZSc7XHJcbmltcG9ydCB7IEludmVudG9yeSB9IGZyb20gJy4uL3BsYXllci9JbnZlbnRvcnknO1xyXG5pbXBvcnQgeyBUaWxlRW50aXR5UGF5bG9hZCB9IGZyb20gJy4uLy4uL2dsb2JhbC9UaWxlRW50aXR5JztcclxuaW1wb3J0IHsgQ2xpZW50VGlsZUVudGl0eSB9IGZyb20gJy4vZW50aXRpZXMvVGlsZUVudGl0eSc7XHJcbmltcG9ydCB7IFdvcmxkQXNzZXRzIH0gZnJvbSAnLi4vYXNzZXRzL0Fzc2V0cyc7XHJcblxyXG5leHBvcnQgY2xhc3MgV29ybGQgaW1wbGVtZW50cyBUaWNrYWJsZSwgUmVuZGVyYWJsZSB7XHJcblx0d2lkdGg6IG51bWJlcjsgLy8gd2lkdGggb2YgdGhlIHdvcmxkIGluIHRpbGVzXHJcblx0aGVpZ2h0OiBudW1iZXI7IC8vIGhlaWdodCBvZiB0aGUgd29ybGQgaW4gdGlsZXNcclxuXHJcblx0dGlsZUxheWVyOiBQNS5HcmFwaGljczsgLy8gVGlsZSBsYXllciBncmFwaGljXHJcblxyXG5cdHdvcmxkVGlsZXM6IChUaWxlVHlwZSB8IHN0cmluZylbXTsgLy8gbnVtYmVyIGZvciBlYWNoIHRpbGVzIGluIHRoZSB3b3JsZCBleDogWzEsIDEsIDAsIDEsIDIsIDAsIDAsIDEuLi4gIF0gbWVhbnMgc25vdywgc25vdywgYWlyLCBzbm93LCBpY2UsIGFpciwgYWlyLCBzbm93Li4uICBzdHJpbmcgaXMgaWQgZm9yIHRpbGUgZW50aXR5IG9jY3VweWluZyB0aGF0IHRpbGVcclxuXHJcblx0cGxheWVyOiBQbGF5ZXJMb2NhbDtcclxuXHJcblx0aW52ZW50b3J5OiBJbnZlbnRvcnk7XHJcblxyXG5cdGVudGl0aWVzOiB7IFtpZDogc3RyaW5nXTogU2VydmVyRW50aXR5IH0gPSB7fTtcclxuXHJcblx0dGlsZUVudGl0aWVzOiB7IFtpZDogc3RyaW5nXTogQ2xpZW50VGlsZUVudGl0eSB9O1xyXG5cclxuXHRzbmFwc2hvdEludGVycG9sYXRpb246IFNuYXBzaG90SW50ZXJwb2xhdGlvbjtcclxuXHJcblx0Y29uc3RydWN0b3IoXHJcblx0XHR3aWR0aDogbnVtYmVyLFxyXG5cdFx0aGVpZ2h0OiBudW1iZXIsXHJcblx0XHR0aWxlczogKFRpbGVUeXBlIHwgc3RyaW5nKVtdLFxyXG5cdFx0dGlsZUVudGl0aWVzOiB7IFtpZDogc3RyaW5nXTogQ2xpZW50VGlsZUVudGl0eSB9LFxyXG5cdCkge1xyXG5cdFx0Ly8gSW5pdGlhbGl6ZSB0aGUgd29ybGQgd2l0aCB0aGUgdGlsZXMgYW5kIGRpbWVuc2lvbnMgZnJvbSB0aGUgc2VydmVyXHJcblx0XHR0aGlzLndpZHRoID0gd2lkdGg7XHJcblx0XHR0aGlzLmhlaWdodCA9IGhlaWdodDtcclxuXHRcdHRoaXMud29ybGRUaWxlcyA9IHRpbGVzO1xyXG5cdFx0dGhpcy50aWxlRW50aXRpZXMgPSB0aWxlRW50aXRpZXM7XHJcblxyXG5cdFx0dGhpcy5zbmFwc2hvdEludGVycG9sYXRpb24gPSBuZXcgU25hcHNob3RJbnRlcnBvbGF0aW9uKCk7XHJcblx0XHR0aGlzLnNuYXBzaG90SW50ZXJwb2xhdGlvbi5pbnRlcnBvbGF0aW9uQnVmZmVyLnNldChcclxuXHRcdFx0KDEwMDAgLyBnYW1lLm5ldE1hbmFnZXIucGxheWVyVGlja1JhdGUpKjMsXHJcblx0XHQpO1xyXG5cdFx0dGhpcy5zbmFwc2hvdEludGVycG9sYXRpb24uY29uZmlnLmF1dG9Db3JyZWN0VGltZU9mZnNldCA9IHRydWU7XHJcblxyXG5cdFx0Ly8gZGVmaW5lIHRoZSBwNS5HcmFwaGljcyBvYmplY3RzIHRoYXQgaG9sZCBhbiBpbWFnZSBvZiB0aGUgdGlsZXMgb2YgdGhlIHdvcmxkLiAgVGhlc2UgYWN0IHNvcnQgb2YgbGlrZSBhIHZpcnR1YWwgY2FudmFzIGFuZCBjYW4gYmUgZHJhd24gb24ganVzdCBsaWtlIGEgbm9ybWFsIGNhbnZhcyBieSB1c2luZyB0aWxlTGF5ZXIucmVjdCgpOywgdGlsZUxheWVyLmVsbGlwc2UoKTssIHRpbGVMYXllci5maWxsKCk7LCBldGMuXHJcblx0XHR0aGlzLnRpbGVMYXllciA9IGdhbWUuY3JlYXRlR3JhcGhpY3MoXHJcblx0XHRcdHRoaXMud2lkdGggKiBnYW1lLlRJTEVfV0lEVEgsXHJcblx0XHRcdHRoaXMuaGVpZ2h0ICogZ2FtZS5USUxFX0hFSUdIVCxcclxuXHRcdCk7XHJcblx0XHR0aGlzLmxvYWRXb3JsZCgpO1xyXG5cdH1cclxuXHJcblx0dGljayhnYW1lOiBHYW1lKSB7XHJcblx0XHRpZiAodGhpcy5wbGF5ZXIgIT09IHVuZGVmaW5lZClcclxuXHRcdFx0Z2FtZS5jb25uZWN0aW9uLmVtaXQoJ3BsYXllclVwZGF0ZScsIHRoaXMucGxheWVyLngsIHRoaXMucGxheWVyLnkpO1xyXG5cdH1cclxuXHJcblx0cmVuZGVyKHRhcmdldDogUDUsIHVwc2NhbGVTaXplOiBudW1iZXIpIHtcclxuXHRcdC8vIGRyYXcgdGhlIHRpbGVzIGxheWVyIG9udG8gdGhlIHNjcmVlblxyXG5cdFx0dGFyZ2V0LmltYWdlKFxyXG5cdFx0XHR0aGlzLnRpbGVMYXllcixcclxuXHRcdFx0MCxcclxuXHRcdFx0MCxcclxuXHRcdFx0KGdhbWUud2lkdGggLyB1cHNjYWxlU2l6ZSkgKiB1cHNjYWxlU2l6ZSxcclxuXHRcdFx0KGdhbWUuaGVpZ2h0IC8gdXBzY2FsZVNpemUpICogdXBzY2FsZVNpemUsXHJcblx0XHRcdGdhbWUuaW50ZXJwb2xhdGVkQ2FtWCAqIGdhbWUuVElMRV9XSURUSCxcclxuXHRcdFx0Z2FtZS5pbnRlcnBvbGF0ZWRDYW1ZICogZ2FtZS5USUxFX1dJRFRILFxyXG5cdFx0XHRnYW1lLndpZHRoIC8gdXBzY2FsZVNpemUsXHJcblx0XHRcdGdhbWUuaGVpZ2h0IC8gdXBzY2FsZVNpemUsXHJcblx0XHQpO1xyXG5cclxuXHRcdHRoaXMucmVuZGVyUGxheWVycyh0YXJnZXQsIHVwc2NhbGVTaXplKTtcclxuXHJcblx0XHQvLyB0YXJnZXQuc3Ryb2tlKDApO1xyXG5cdFx0Ly8gdGFyZ2V0LnN0cm9rZVdlaWdodCg0KTtcclxuXHRcdC8vIHRhcmdldC5ub0ZpbGwoKTtcclxuXHRcdC8vIHRhcmdldC5yZWN0KHRhcmdldC53aWR0aCAtIHRoaXMud2lkdGgsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcclxuXHJcblx0XHQvLyB0YXJnZXQuaW1hZ2UoXHJcblx0XHQvLyBcdHRoaXMudGlsZUxheWVyLFxyXG5cdFx0Ly8gXHR0YXJnZXQud2lkdGggLSB0aGlzLndpZHRoLFxyXG5cdFx0Ly8gXHQwLFxyXG5cdFx0Ly8gXHR0aGlzLndpZHRoLFxyXG5cdFx0Ly8gXHR0aGlzLmhlaWdodCxcclxuXHRcdC8vICk7XHJcblx0fVxyXG5cclxuXHR1cGRhdGVQbGF5ZXJzKHNuYXBzaG90OiBTbmFwc2hvdCkge1xyXG5cdFx0dGhpcy5zbmFwc2hvdEludGVycG9sYXRpb24uc25hcHNob3QuYWRkKHNuYXBzaG90KTtcclxuXHR9XHJcblxyXG5cdHVwZGF0ZVRpbGUodGlsZUluZGV4OiBudW1iZXIsIHRpbGU6IFRpbGVUeXBlKSB7XHJcblx0XHQvLyBVcGRhdGUgdGhlIHRpbGUgYW5kIHRoZSA0IG5laWdoYm91cmluZyB0aWxlc1xyXG5cdFx0dGhpcy53b3JsZFRpbGVzW3RpbGVJbmRleF0gPSB0aWxlO1xyXG5cclxuXHRcdC8vIGVyYXNlIHRoZSBicm9rZW4gdGlsZXMgYW5kIGl0cyBzdXJyb3VuZGluZyB0aWxlcyBpZiB0aGV5J3JlIHRpbGVzXHJcblx0XHR0aGlzLnRpbGVMYXllci5lcmFzZSgpO1xyXG5cdFx0dGhpcy50aWxlTGF5ZXIubm9TdHJva2UoKTtcclxuXHRcdHRoaXMudGlsZUxheWVyLnJlY3QoXHJcblx0XHRcdC8vY2VudGVyXHJcblx0XHRcdCh0aWxlSW5kZXggJSB0aGlzLndpZHRoKSAqIGdhbWUuVElMRV9XSURUSCxcclxuXHRcdFx0TWF0aC5mbG9vcih0aWxlSW5kZXggLyB0aGlzLndpZHRoKSAqIGdhbWUuVElMRV9IRUlHSFQsXHJcblx0XHRcdGdhbWUuVElMRV9XSURUSCxcclxuXHRcdFx0Z2FtZS5USUxFX0hFSUdIVCxcclxuXHRcdCk7XHJcblxyXG5cdFx0aWYgKFxyXG5cdFx0XHR0aWxlSW5kZXggLSAxID49IDAgJiZcclxuXHRcdFx0dHlwZW9mIHRoaXMud29ybGRUaWxlc1t0aWxlSW5kZXggLSAxXSAhPT0gJ3N0cmluZycgJiZcclxuXHRcdFx0dGhpcy53b3JsZFRpbGVzW3RpbGVJbmRleCAtIDFdICE9PSBUaWxlVHlwZS5BaXJcclxuXHRcdCkge1xyXG5cdFx0XHR0aGlzLnRpbGVMYXllci5yZWN0KFxyXG5cdFx0XHRcdC8vbGVmdFxyXG5cdFx0XHRcdCgodGlsZUluZGV4ICUgdGhpcy53aWR0aCkgLSAxKSAqIGdhbWUuVElMRV9XSURUSCxcclxuXHRcdFx0XHRNYXRoLmZsb29yKHRpbGVJbmRleCAvIHRoaXMud2lkdGgpICogZ2FtZS5USUxFX0hFSUdIVCxcclxuXHRcdFx0XHRnYW1lLlRJTEVfV0lEVEgsXHJcblx0XHRcdFx0Z2FtZS5USUxFX0hFSUdIVCxcclxuXHRcdFx0KTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoXHJcblx0XHRcdHRpbGVJbmRleCArIDEgPCB0aGlzLndpZHRoICogdGhpcy5oZWlnaHQgJiZcclxuXHRcdFx0dHlwZW9mIHRoaXMud29ybGRUaWxlc1t0aWxlSW5kZXggKyAxXSAhPT0gJ3N0cmluZycgJiZcclxuXHRcdFx0dGhpcy53b3JsZFRpbGVzW3RpbGVJbmRleCArIDFdICE9PSBUaWxlVHlwZS5BaXJcclxuXHRcdCkge1xyXG5cdFx0XHR0aGlzLnRpbGVMYXllci5yZWN0KFxyXG5cdFx0XHRcdC8vcmlnaHRcclxuXHRcdFx0XHQoKHRpbGVJbmRleCAlIHRoaXMud2lkdGgpIC0gMSkgKiBnYW1lLlRJTEVfV0lEVEgsXHJcblx0XHRcdFx0TWF0aC5mbG9vcih0aWxlSW5kZXggLyB0aGlzLndpZHRoKSAqIGdhbWUuVElMRV9IRUlHSFQsXHJcblx0XHRcdFx0Z2FtZS5USUxFX1dJRFRILFxyXG5cdFx0XHRcdGdhbWUuVElMRV9IRUlHSFQsXHJcblx0XHRcdCk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKFxyXG5cdFx0XHR0aWxlSW5kZXggLSB0aGlzLndpZHRoID49IDAgJiZcclxuXHRcdFx0dHlwZW9mIHRoaXMud29ybGRUaWxlc1t0aWxlSW5kZXggLSB0aGlzLndpZHRoXSAhPT0gJ3N0cmluZycgJiZcclxuXHRcdFx0dGhpcy53b3JsZFRpbGVzW3RpbGVJbmRleCAtIHRoaXMud2lkdGhdICE9PSBUaWxlVHlwZS5BaXJcclxuXHRcdCkge1xyXG5cdFx0XHR0aGlzLnRpbGVMYXllci5yZWN0KFxyXG5cdFx0XHRcdC8vdG9wXHJcblx0XHRcdFx0KHRpbGVJbmRleCAlIHRoaXMud2lkdGgpICogZ2FtZS5USUxFX1dJRFRILFxyXG5cdFx0XHRcdChNYXRoLmZsb29yKHRpbGVJbmRleCAvIHRoaXMud2lkdGgpIC0gMSkgKiBnYW1lLlRJTEVfSEVJR0hULFxyXG5cdFx0XHRcdGdhbWUuVElMRV9XSURUSCxcclxuXHRcdFx0XHRnYW1lLlRJTEVfSEVJR0hULFxyXG5cdFx0XHQpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKFxyXG5cdFx0XHR0aWxlSW5kZXggKyB0aGlzLndpZHRoIDwgdGhpcy53aWR0aCAqIHRoaXMuaGVpZ2h0ICYmXHJcblx0XHRcdHR5cGVvZiB0aGlzLndvcmxkVGlsZXNbdGlsZUluZGV4ICsgdGhpcy53aWR0aF0gIT09ICdzdHJpbmcnICYmXHJcblx0XHRcdHRoaXMud29ybGRUaWxlc1t0aWxlSW5kZXggKyB0aGlzLndpZHRoXSAhPT0gVGlsZVR5cGUuQWlyXHJcblx0XHQpIHtcclxuXHRcdFx0dGhpcy50aWxlTGF5ZXIucmVjdChcclxuXHRcdFx0XHQvL2JvdHRvbVxyXG5cdFx0XHRcdCh0aWxlSW5kZXggJSB0aGlzLndpZHRoKSAqIGdhbWUuVElMRV9XSURUSCxcclxuXHRcdFx0XHQoTWF0aC5mbG9vcih0aWxlSW5kZXggLyB0aGlzLndpZHRoKSArIDEpICogZ2FtZS5USUxFX0hFSUdIVCxcclxuXHRcdFx0XHRnYW1lLlRJTEVfV0lEVEgsXHJcblx0XHRcdFx0Z2FtZS5USUxFX0hFSUdIVCxcclxuXHRcdFx0KTtcclxuXHRcdH1cclxuXHRcdHRoaXMudGlsZUxheWVyLm5vRXJhc2UoKTtcclxuXHJcblx0XHQvLyByZWRyYXcgdGhlIG5laWdoYm9yaW5nIHRpbGVzXHJcblx0XHR0aGlzLmRyYXdUaWxlKHRpbGVJbmRleCk7XHJcblx0XHR0aGlzLmRyYXdUaWxlKHRpbGVJbmRleCArIHRoaXMud2lkdGgpO1xyXG5cdFx0dGhpcy5kcmF3VGlsZSh0aWxlSW5kZXggLSAxKTtcclxuXHRcdHRoaXMuZHJhd1RpbGUodGlsZUluZGV4IC0gdGhpcy53aWR0aCk7XHJcblx0XHR0aGlzLmRyYXdUaWxlKHRpbGVJbmRleCArIDEpO1xyXG5cdH1cclxuXHJcblx0cmVuZGVyUGxheWVycyh0YXJnZXQ6IFA1LCB1cHNjYWxlU2l6ZTogbnVtYmVyKSB7XHJcblx0XHQvLyBDYWxjdWxhdGUgdGhlIGludGVycG9sYXRlZCBwb3NpdGlvbiBvZiBhbGwgdXBkYXRlZCBlbnRpdGllc1xyXG5cdFx0Y29uc3QgcG9zaXRpb25TdGF0ZXM6IHsgW2lkOiBzdHJpbmddOiB7IHg6IG51bWJlcjsgeTogbnVtYmVyIH0gfSA9IHt9O1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0Y29uc3QgY2FsY3VsYXRlZFNuYXBzaG90ID1cclxuXHRcdFx0XHR0aGlzLnNuYXBzaG90SW50ZXJwb2xhdGlvbi5jYWxjSW50ZXJwb2xhdGlvbigneCB5Jyk7XHJcblx0XHRcdGlmICghY2FsY3VsYXRlZFNuYXBzaG90KSB7XHJcblx0XHRcdFx0Y29uc29sZS53YXJuKFwibm8gY2FsY3VsYXRlZCBzbmFwc2hvdFwiKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRjb25zdCBzdGF0ZSA9IGNhbGN1bGF0ZWRTbmFwc2hvdC5zdGF0ZTtcclxuXHRcdFx0XHRpZiAoIXN0YXRlKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLndhcm4oXCJubyBjYWxjdWxhdGVkIHNuYXBzaG90IHN0YXRlXCIpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHQvLyBUaGUgbmV3IHBvc2l0aW9ucyBvZiBlbnRpdGllcyBhcyBvYmplY3RcclxuXHRcdFx0XHRcdHN0YXRlLmZvckVhY2goKHsgaWQsIHgsIHkgfTogRW50aXR5ICYgeyB4OiBudW1iZXI7IHk6IG51bWJlciB9KSA9PiB7XHJcblx0XHRcdFx0XHRcdHBvc2l0aW9uU3RhdGVzW2lkXSA9IHsgeCwgeSB9O1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9IGNhdGNoIChlKSB7e2NvbnNvbGUud2FybihcImVycm9yIGluIHJlbmRlclBsYXllcnNcIik7cmV0dXJuO319XHJcblxyXG5cdFx0Ly8gUmVuZGVyIGVhY2ggZW50aXR5IGluIHRoZSBvcmRlciB0aGV5IGFwcGVhclxyXG5cdFx0T2JqZWN0LmVudHJpZXModGhpcy5lbnRpdGllcykuZm9yRWFjaChcclxuXHRcdFx0KGVudGl0eTogW3N0cmluZywgU2VydmVyRW50aXR5XSkgPT4ge1xyXG5cdFx0XHRcdGNvbnN0IHVwZGF0ZWRQb3NpdGlvbiA9IHBvc2l0aW9uU3RhdGVzW2VudGl0eVswXV07XHJcblx0XHRcdFx0aWYgKHVwZGF0ZWRQb3NpdGlvbiAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0XHRlbnRpdHlbMV0ueCA9IHVwZGF0ZWRQb3NpdGlvbi54O1xyXG5cdFx0XHRcdFx0ZW50aXR5WzFdLnkgPSB1cGRhdGVkUG9zaXRpb24ueTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGVudGl0eVsxXS5yZW5kZXIodGFyZ2V0LCB1cHNjYWxlU2l6ZSk7XHJcblx0XHRcdH0sXHJcblx0XHQpO1xyXG5cclxuXHRcdC8vIFJlbmRlciB0aGUgcGxheWVyIG9uIHRvcFxyXG5cdFx0aWYgKHRoaXMucGxheWVyICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0dGhpcy5wbGF5ZXIuZmluZEludGVycG9sYXRlZENvb3JkaW5hdGVzKCk7XHJcblx0XHRcdHRoaXMucGxheWVyLnJlbmRlcih0YXJnZXQsIHVwc2NhbGVTaXplKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGxvYWRXb3JsZCgpIHtcclxuXHRcdHRoaXMudGlsZUxheWVyLm5vU3Ryb2tlKCk7XHJcblx0XHRmb3IgKGxldCB4ID0gMDsgeCA8IHRoaXMuaGVpZ2h0OyB4KyspIHtcclxuXHRcdFx0Ly94IGFuZCB5IGFyZSBzd2l0Y2hlZCBmb3Igc29tZSBzdHVwaWQgcmVhc29uXHJcblx0XHRcdC8vIGkgd2lsbCBiZSB0aGUgeSBwb3NpdGlvbiBvZiB0aWxlcyBiZWluZyBkcmF3blxyXG5cdFx0XHRmb3IgKGxldCB5ID0gMDsgeSA8IHRoaXMud2lkdGg7IHkrKykge1xyXG5cdFx0XHRcdGNvbnN0IHRpbGVWYWwgPSB0aGlzLndvcmxkVGlsZXNbeCAqIHRoaXMud2lkdGggKyB5XTtcclxuXHJcblx0XHRcdFx0aWYgKHR5cGVvZiB0aWxlVmFsID09PSAnc3RyaW5nJykge1xyXG5cdFx0XHRcdFx0aWYgKHRoaXMudGlsZUVudGl0aWVzID09PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvcigndGlsZSBlbnRpdHkgYXJyYXkgaXMgdW5kZWZpbmVkJyk7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0aWYgKHRoaXMudGlsZUVudGl0aWVzW3RpbGVWYWxdID09PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvcihcclxuXHRcdFx0XHRcdFx0XHQndGlsZSBlbnRpdHkgJyArIHRpbGVWYWwgKyAnIGlzIHVuZGVmaW5lZCcsXHJcblx0XHRcdFx0XHRcdCk7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0Y29uc3QgdG9wTGVmdCA9IE1hdGgubWluKFxyXG5cdFx0XHRcdFx0XHQuLi50aGlzLnRpbGVFbnRpdGllc1t0aWxlVmFsXS5jb3ZlcmVkVGlsZXMsXHJcblx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdFx0aWYgKHggKiB0aGlzLndpZHRoICsgeSA9PT0gdG9wTGVmdCkge1xyXG5cdFx0XHRcdFx0XHQvL3JlbmRlciB0aWxlIGVudGl0eSBpbWFnZVxyXG5cdFx0XHRcdFx0XHRsZXQgaW1nID1cclxuXHRcdFx0XHRcdFx0XHRXb3JsZEFzc2V0cy50aWxlRW50aXRpZXNbXHJcblx0XHRcdFx0XHRcdFx0XHR0aGlzLnRpbGVFbnRpdGllc1t0aWxlVmFsXS5wYXlsb2FkLnR5cGVfXHJcblx0XHRcdFx0XHRcdFx0XVt0aGlzLnRpbGVFbnRpdGllc1t0aWxlVmFsXS5hbmltRnJhbWVdO1xyXG5cdFx0XHRcdFx0XHRcdGltZy5yZW5kZXIoXHJcblx0XHRcdFx0XHRcdFx0XHR0aGlzLnRpbGVMYXllcixcclxuXHRcdFx0XHRcdFx0XHRcdHkgKiBnYW1lLlRJTEVfV0lEVEgsXHJcblx0XHRcdFx0XHRcdFx0XHR4ICogZ2FtZS5USUxFX0hFSUdIVCxcclxuXHRcdFx0XHRcdFx0XHRcdGltZy5pbWFnZS53aWR0aCxcclxuXHRcdFx0XHRcdFx0XHRcdGltZy5pbWFnZS5oZWlnaHQsXHJcblx0XHRcdFx0XHRcdFx0KTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdC8vY29uc29sZS5sb2coYEFscmVhZHkgcmVuZGVyZWQgJHt0aWxlVmFsfWApO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAodGlsZVZhbCAhPT0gVGlsZVR5cGUuQWlyKSB7XHJcblx0XHRcdFx0XHQvLyBEcmF3IHRoZSBjb3JyZWN0IGltYWdlIGZvciB0aGUgdGlsZXMgb250byB0aGUgdGlsZXMgbGF5ZXJcclxuXHRcdFx0XHRcdGNvbnN0IHRpbGUgPSBXb3JsZFRpbGVzW3RpbGVWYWxdO1xyXG5cclxuXHRcdFx0XHRcdGlmICh0aWxlID09PSB1bmRlZmluZWQpIGNvbnRpbnVlO1xyXG5cclxuXHRcdFx0XHRcdGlmICh0aWxlLmNvbm5lY3RlZCAmJiAncmVuZGVyVGlsZScgaW4gdGlsZS50ZXh0dXJlKSB7XHJcblx0XHRcdFx0XHRcdC8vIFJlbmRlciBjb25uZWN0ZWQgdGlsZXNcclxuXHRcdFx0XHRcdFx0dGlsZS50ZXh0dXJlLnJlbmRlclRpbGUoXHJcblx0XHRcdFx0XHRcdFx0dGhpcy5maW5kVGlsZXNldEluZGV4KFxyXG5cdFx0XHRcdFx0XHRcdFx0eCxcclxuXHRcdFx0XHRcdFx0XHRcdHksXHJcblx0XHRcdFx0XHRcdFx0XHR0aWxlVmFsLFxyXG5cdFx0XHRcdFx0XHRcdFx0V29ybGRUaWxlc1t0aWxlVmFsXT8uYW55Q29ubmVjdGlvbixcclxuXHRcdFx0XHRcdFx0XHQpLFxyXG5cdFx0XHRcdFx0XHRcdHRoaXMudGlsZUxheWVyLFxyXG5cdFx0XHRcdFx0XHRcdHkgKiBnYW1lLlRJTEVfV0lEVEgsXHJcblx0XHRcdFx0XHRcdFx0eCAqIGdhbWUuVElMRV9IRUlHSFQsXHJcblx0XHRcdFx0XHRcdFx0Z2FtZS5USUxFX1dJRFRILFxyXG5cdFx0XHRcdFx0XHRcdGdhbWUuVElMRV9IRUlHSFQsXHJcblx0XHRcdFx0XHRcdCk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHQvLyBSZW5kZXIgbm9uLWNvbm5lY3RlZCB0aWxlc1xyXG5cdFx0XHRcdFx0XHR0aWxlLnRleHR1cmUucmVuZGVyKFxyXG5cdFx0XHRcdFx0XHRcdHRoaXMudGlsZUxheWVyLFxyXG5cdFx0XHRcdFx0XHRcdHkgKiBnYW1lLlRJTEVfV0lEVEgsXHJcblx0XHRcdFx0XHRcdFx0eCAqIGdhbWUuVElMRV9IRUlHSFQsXHJcblx0XHRcdFx0XHRcdFx0Z2FtZS5USUxFX1dJRFRILFxyXG5cdFx0XHRcdFx0XHRcdGdhbWUuVElMRV9IRUlHSFQsXHJcblx0XHRcdFx0XHRcdCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRmb3IobGV0IHRpbGVFbnRpdHkgb2YgT2JqZWN0LnZhbHVlcyh0aGlzLnRpbGVFbnRpdGllcykpIHtcclxuXHRcdFx0bGV0IGltZyA9IFdvcmxkQXNzZXRzLnRpbGVFbnRpdGllc1tcclxuXHRcdFx0XHR0aWxlRW50aXR5LnBheWxvYWQudHlwZV9cclxuXHRcdFx0XVt0aWxlRW50aXR5LmFuaW1GcmFtZV07XHJcblx0XHRcdC8vY29uc29sZS5sb2coXCJkZWJ1ZzFcIilcclxuXHRcdFx0aW1nLnJlbmRlclJlZmxlY3Rpb24oXHJcblx0XHRcdFx0dGhpcy50aWxlTGF5ZXIsXHJcblx0XHRcdFx0TWF0aC5taW4oXHJcblx0XHRcdFx0XHQuLi50aWxlRW50aXR5LmNvdmVyZWRUaWxlcyxcclxuXHRcdFx0XHQpJXRoaXMud2lkdGgsXHJcblx0XHRcdFx0TWF0aC5mbG9vcihNYXRoLm1heChcclxuXHRcdFx0XHRcdC4uLnRpbGVFbnRpdHkuY292ZXJlZFRpbGVzLFxyXG5cdFx0XHRcdCkvdGhpcy53aWR0aCkrMSxcclxuXHRcdFx0XHRpbWcuaW1hZ2Uud2lkdGgvZ2FtZS5USUxFX1dJRFRILFxyXG5cdFx0XHRcdGltZy5pbWFnZS5oZWlnaHQvZ2FtZS5USUxFX0hFSUdIVCxcclxuXHRcdFx0XHR0aGlzLndvcmxkVGlsZXNcclxuXHRcdFx0KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGRyYXdUaWxlKHRpbGVJbmRleDogbnVtYmVyKSB7XHJcblx0XHRjb25zdCB4ID0gdGlsZUluZGV4ICUgdGhpcy53aWR0aDtcclxuXHRcdGNvbnN0IHkgPSBNYXRoLmZsb29yKHRpbGVJbmRleCAvIHRoaXMud2lkdGgpO1xyXG5cclxuXHRcdGlmICh0aGlzLndvcmxkVGlsZXNbdGlsZUluZGV4XSAhPT0gVGlsZVR5cGUuQWlyKSB7XHJcblx0XHRcdC8vIERyYXcgdGhlIGNvcnJlY3QgaW1hZ2UgZm9yIHRoZSB0aWxlcyBvbnRvIHRoZSB0aWxlcyBsYXllclxyXG5cclxuXHRcdFx0Y29uc3QgdGlsZVZhbCA9IHRoaXMud29ybGRUaWxlc1t0aWxlSW5kZXhdO1xyXG5cclxuXHRcdFx0aWYgKHR5cGVvZiB0aWxlVmFsID09PSAnc3RyaW5nJykge1xyXG5cdFx0XHRcdGlmICh0aGlzLnRpbGVFbnRpdGllc1t0aWxlVmFsXSA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKCd0aWxlIGVudGl0eSAnICsgdGlsZVZhbCArICcgaXMgdW5kZWZpbmVkJyk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRjb25zdCB0b3BMZWZ0ID0gTWF0aC5taW4oXHJcblx0XHRcdFx0XHQuLi50aGlzLnRpbGVFbnRpdGllc1t0aWxlVmFsXS5jb3ZlcmVkVGlsZXMsXHJcblx0XHRcdFx0KTtcclxuXHRcdFx0XHRpZiAodGlsZUluZGV4ID09PSB0b3BMZWZ0KSB7XHJcblx0XHRcdFx0XHQvL3JlbmRlciB0aWxlIGVudGl0eSBpbWFnZVxyXG5cdFx0XHRcdFx0Ly90aGlzLnRpbGVFbnRpdGllc1t0aWxlVmFsXS5yZW5kZXIodGlsZUxheWVyLCB4KjgsIHkqOCk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdC8vY29uc29sZS5sb2coYEFscmVhZHkgcmVuZGVyZWQgJHt0aWxlVmFsfWApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGNvbnN0IHRpbGUgPSBXb3JsZFRpbGVzW3RpbGVWYWxdO1xyXG5cclxuXHRcdFx0Ly8gaWYgdGhlIHRpbGVzIGlzIG9mZi1zY3JlZW5cclxuXHRcdFx0aWYgKHRpbGUgPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHRpbGUuY29ubmVjdGVkICYmICdyZW5kZXJUaWxlJyBpbiB0aWxlLnRleHR1cmUpIHtcclxuXHRcdFx0XHRsZXQgdG9wVGlsZUJvb2wgPSBmYWxzZTtcclxuXHRcdFx0XHRsZXQgbGVmdFRpbGVCb29sID0gZmFsc2U7XHJcblx0XHRcdFx0bGV0IGJvdHRvbVRpbGVCb29sID0gZmFsc2U7XHJcblx0XHRcdFx0bGV0IHJpZ2h0VGlsZUJvb2wgPSBmYWxzZTtcclxuXHRcdFx0XHRpZiAodGlsZS5hbnlDb25uZWN0aW9uKSB7XHJcblx0XHRcdFx0XHQvLyB0ZXN0IGlmIHRoZSBuZWlnaGJvcmluZyB0aWxlcyBhcmUgc29saWRcclxuXHRcdFx0XHRcdHRvcFRpbGVCb29sID1cclxuXHRcdFx0XHRcdFx0eCA9PT0gMCB8fFxyXG5cdFx0XHRcdFx0XHQodGhpcy53b3JsZFRpbGVzWyh5IC0gMSkgKiB0aGlzLndpZHRoICsgeF0gIT09XHJcblx0XHRcdFx0XHRcdFx0VGlsZVR5cGUuQWlyICYmXHJcblx0XHRcdFx0XHRcdFx0dHlwZW9mIHRoaXMud29ybGRUaWxlc1soeSAtIDEpICogdGhpcy53aWR0aCArIHhdICE9PVxyXG5cdFx0XHRcdFx0XHRcdFx0J3N0cmluZycpO1xyXG5cdFx0XHRcdFx0bGVmdFRpbGVCb29sID1cclxuXHRcdFx0XHRcdFx0eSA9PT0gMCB8fFxyXG5cdFx0XHRcdFx0XHQodGhpcy53b3JsZFRpbGVzW3kgKiB0aGlzLndpZHRoICsgeCAtIDFdICE9PVxyXG5cdFx0XHRcdFx0XHRcdFRpbGVUeXBlLkFpciAmJlxyXG5cdFx0XHRcdFx0XHRcdHR5cGVvZiB0aGlzLndvcmxkVGlsZXNbeSAqIHRoaXMud2lkdGggKyB4IC0gMV0gIT09XHJcblx0XHRcdFx0XHRcdFx0XHQnc3RyaW5nJyk7XHJcblx0XHRcdFx0XHRib3R0b21UaWxlQm9vbCA9XHJcblx0XHRcdFx0XHRcdHggPT09IHRoaXMuaGVpZ2h0IC0gMSB8fFxyXG5cdFx0XHRcdFx0XHQodGhpcy53b3JsZFRpbGVzWyh5ICsgMSkgKiB0aGlzLndpZHRoICsgeF0gIT09XHJcblx0XHRcdFx0XHRcdFx0VGlsZVR5cGUuQWlyICYmXHJcblx0XHRcdFx0XHRcdFx0dHlwZW9mIHRoaXMud29ybGRUaWxlc1soeSArIDEpICogdGhpcy53aWR0aCArIHhdICE9PVxyXG5cdFx0XHRcdFx0XHRcdFx0J3N0cmluZycpO1xyXG5cdFx0XHRcdFx0cmlnaHRUaWxlQm9vbCA9XHJcblx0XHRcdFx0XHRcdHkgPT09IHRoaXMud2lkdGggLSAxIHx8XHJcblx0XHRcdFx0XHRcdCh0aGlzLndvcmxkVGlsZXNbeSAqIHRoaXMud2lkdGggKyB4ICsgMV0gIT09XHJcblx0XHRcdFx0XHRcdFx0VGlsZVR5cGUuQWlyICYmXHJcblx0XHRcdFx0XHRcdFx0dHlwZW9mIHRoaXMud29ybGRUaWxlc1t5ICogdGhpcy53aWR0aCArIHggKyAxXSAhPT1cclxuXHRcdFx0XHRcdFx0XHRcdCdzdHJpbmcnKTtcclxuXHJcblx0XHRcdFx0XHQvLyBjb25zb2xlLmxvZyhbXCJib3JpbmdcIiwgbGVmdFRpbGVCb29sLCBib3R0b21UaWxlQm9vbCwgdGhpcy53b3JsZFRpbGVzW3ggKiB0aGlzLndpZHRoICsgeSArIDFdLCB0b3BUaWxlQm9vbF0pXHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdC8vIHRlc3QgaWYgdGhlIG5laWdoYm9yaW5nIHRpbGVzIGFyZSB0aGUgc2FtZSB0aWxlXHJcblx0XHRcdFx0XHR0b3BUaWxlQm9vbCA9XHJcblx0XHRcdFx0XHRcdHggPT09IDAgfHxcclxuXHRcdFx0XHRcdFx0dGhpcy53b3JsZFRpbGVzWyh5IC0gMSkgKiB0aGlzLndpZHRoICsgeF0gPT09IHRpbGVWYWw7XHJcblx0XHRcdFx0XHRsZWZ0VGlsZUJvb2wgPVxyXG5cdFx0XHRcdFx0XHR5ID09PSAwIHx8XHJcblx0XHRcdFx0XHRcdHRoaXMud29ybGRUaWxlc1t5ICogdGhpcy53aWR0aCArIHggLSAxXSA9PT0gdGlsZVZhbDtcclxuXHRcdFx0XHRcdGJvdHRvbVRpbGVCb29sID1cclxuXHRcdFx0XHRcdFx0eCA9PT0gdGhpcy5oZWlnaHQgLSAxIHx8XHJcblx0XHRcdFx0XHRcdHRoaXMud29ybGRUaWxlc1soeSArIDEpICogdGhpcy53aWR0aCArIHhdID09PSB0aWxlVmFsO1xyXG5cdFx0XHRcdFx0cmlnaHRUaWxlQm9vbCA9XHJcblx0XHRcdFx0XHRcdHkgPT09IHRoaXMud2lkdGggLSAxIHx8XHJcblx0XHRcdFx0XHRcdHRoaXMud29ybGRUaWxlc1t5ICogdGhpcy53aWR0aCArIHggKyAxXSA9PT0gdGlsZVZhbDtcclxuXHRcdFx0XHRcdC8vY29uc29sZS5sb2coW1wiZmFuY3lcIiwgbGVmdFRpbGVCb29sLCBib3R0b21UaWxlQm9vbCwgcmlnaHRUaWxlQm9vbCwgdG9wVGlsZUJvb2xdKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0aGlzLndvcmxkVGlsZXNbdGlsZUluZGV4ICsgMV0gIT09IFRpbGVUeXBlLkFpcjtcclxuXHJcblx0XHRcdFx0Ly8gY29udmVydCA0IGRpZ2l0IGJpbmFyeSBudW1iZXIgdG8gYmFzZSAxMFxyXG5cdFx0XHRcdGNvbnN0IHRpbGVTZXRJbmRleCA9XHJcblx0XHRcdFx0XHQ4ICogK3RvcFRpbGVCb29sICtcclxuXHRcdFx0XHRcdDQgKiArcmlnaHRUaWxlQm9vbCArXHJcblx0XHRcdFx0XHQyICogK2JvdHRvbVRpbGVCb29sICtcclxuXHRcdFx0XHRcdCtsZWZ0VGlsZUJvb2w7XHJcblxyXG5cdFx0XHRcdC8vIFJlbmRlciBjb25uZWN0ZWQgdGlsZXNcclxuXHRcdFx0XHR0aWxlLnRleHR1cmUucmVuZGVyVGlsZShcclxuXHRcdFx0XHRcdHRpbGVTZXRJbmRleCxcclxuXHRcdFx0XHRcdHRoaXMudGlsZUxheWVyLFxyXG5cdFx0XHRcdFx0eCAqIGdhbWUuVElMRV9XSURUSCxcclxuXHRcdFx0XHRcdHkgKiBnYW1lLlRJTEVfSEVJR0hULFxyXG5cdFx0XHRcdFx0Z2FtZS5USUxFX1dJRFRILFxyXG5cdFx0XHRcdFx0Z2FtZS5USUxFX0hFSUdIVCxcclxuXHRcdFx0XHQpO1xyXG5cdFx0XHR9IGVsc2UgaWYgKCF0aWxlLmNvbm5lY3RlZCkge1xyXG5cdFx0XHRcdC8vIFJlbmRlciBub24tY29ubmVjdGVkIHRpbGVzXHJcblx0XHRcdFx0dGlsZS50ZXh0dXJlLnJlbmRlcihcclxuXHRcdFx0XHRcdHRoaXMudGlsZUxheWVyLFxyXG5cdFx0XHRcdFx0eCAqIGdhbWUuVElMRV9XSURUSCxcclxuXHRcdFx0XHRcdHkgKiBnYW1lLlRJTEVfSEVJR0hULFxyXG5cdFx0XHRcdFx0Z2FtZS5USUxFX1dJRFRILFxyXG5cdFx0XHRcdFx0Z2FtZS5USUxFX0hFSUdIVCxcclxuXHRcdFx0XHQpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZvcihsZXQgdGlsZUVudGl0eSBvZiBPYmplY3QudmFsdWVzKHRoaXMudGlsZUVudGl0aWVzKSkge1xyXG5cdFx0XHRcdGlmKHRpbGVFbnRpdHkucmVmbGVjdGVkVGlsZXMuaW5jbHVkZXModGlsZUluZGV4KSkge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCJyZWZsZWN0aW9uIGF0IGluZGV4IFwiK3RpbGVJbmRleCk7XHJcblx0XHRcdFx0XHRjb25zdCB0b3BMZWZ0ID0gTWF0aC5taW4oXHJcblx0XHRcdFx0XHRcdC4uLnRpbGVFbnRpdHkucmVmbGVjdGVkVGlsZXMsXHJcblx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdFx0Y29uc3QgdGlsZUVudGl0eVJlZmxlY3Rpb25JbWFnZSA9IFdvcmxkQXNzZXRzLnRpbGVFbnRpdGllc1t0aWxlRW50aXR5LnBheWxvYWQudHlwZV9dW3RpbGVFbnRpdHkuYW5pbUZyYW1lXTtcclxuXHRcdFx0XHRcdHRoaXMudGlsZUxheWVyLmRyYXdpbmdDb250ZXh0Lmdsb2JhbEFscGhhID0gdGlsZUVudGl0eVJlZmxlY3Rpb25JbWFnZS5yZWZsZWN0aXZpdHlBcnJheVt0aWxlVmFsXS8yNTU7Ly9UT0RPIG1ha2UgdGhpcyBiYXNlZCBvbiB0aGUgdGlsZSByZWZsZWN0aXZpdHlcclxuXHRcdFx0XHRcdHRoaXMudGlsZUxheWVyLmltYWdlKFxyXG5cdFx0XHRcdFx0XHR0aWxlRW50aXR5UmVmbGVjdGlvbkltYWdlLnJlZmxlY3Rpb24sXHJcblx0XHRcdFx0XHRcdHgqZ2FtZS5USUxFX1dJRFRILFxyXG5cdFx0XHRcdFx0XHR5KmdhbWUuVElMRV9IRUlHSFQsXHJcblx0XHRcdFx0XHRcdGdhbWUuVElMRV9XSURUSCxcclxuXHRcdFx0XHRcdFx0Z2FtZS5USUxFX0hFSUdIVCxcclxuXHRcdFx0XHRcdFx0KHgtdG9wTGVmdCV0aGlzLndpZHRoKSpnYW1lLlRJTEVfV0lEVEgsXHJcblx0XHRcdFx0XHRcdCh5LU1hdGguZmxvb3IodG9wTGVmdC90aGlzLndpZHRoKSkqZ2FtZS5USUxFX0hFSUdIVCxcclxuXHRcdFx0XHRcdFx0Z2FtZS5USUxFX1dJRFRILFxyXG5cdFx0XHRcdFx0XHRnYW1lLlRJTEVfSEVJR0hUXHJcblx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdFx0dGhpcy50aWxlTGF5ZXIuZHJhd2luZ0NvbnRleHQuZ2xvYmFsQWxwaGEgPSAxLjA7XHJcblx0XHRcdFx0XHQvL1dvcmxkQXNzZXRzLnRpbGVFbnRpdGllc1t0aWxlRW50aXR5LnR5cGVfXVt0aWxlRW50aXR5LmFuaW1GcmFtZV0ucmVuZGVyUGFydGlhbFdvcmxkc3BhY2VSZWZsZWN0aW9uKHRoaXMudGlsZUxheWVyLCB0aWxlSW5kZXgldGhpcy53aWR0aCwgTWF0aC5mbG9vcih0aWxlSW5kZXgvdGhpcy53aWR0aCksIHRvcExlZnQldGhpcy53aWR0aCwgTWF0aC5mbG9vcih0b3BMZWZ0L3RoaXMud2lkdGgpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGZpbmRUaWxlc2V0SW5kZXgoXHJcblx0XHR4OiBudW1iZXIsXHJcblx0XHR5OiBudW1iZXIsXHJcblx0XHR0aWxlVmFsOiBUaWxlVHlwZSxcclxuXHRcdGFueUNvbm5lY3Rpb24/OiBib29sZWFuLFxyXG5cdCkge1xyXG5cdFx0bGV0IHRvcFRpbGVCb29sID0gZmFsc2U7XHJcblx0XHRsZXQgbGVmdFRpbGVCb29sID0gZmFsc2U7XHJcblx0XHRsZXQgYm90dG9tVGlsZUJvb2wgPSBmYWxzZTtcclxuXHRcdGxldCByaWdodFRpbGVCb29sID0gZmFsc2U7XHJcblx0XHRpZiAoYW55Q29ubmVjdGlvbikge1xyXG5cdFx0XHQvLyB0ZXN0IGlmIHRoZSBuZWlnaGJvcmluZyB0aWxlcyBhcmUgc29saWRcclxuXHRcdFx0dG9wVGlsZUJvb2wgPVxyXG5cdFx0XHRcdHggPT09IDAgfHxcclxuXHRcdFx0XHQodGhpcy53b3JsZFRpbGVzWyh4IC0gMSkgKiB0aGlzLndpZHRoICsgeV0gIT09IFRpbGVUeXBlLkFpciAmJi8veCBhbmQgeSBhcHBlYXIgdG8gYmUgc3dpdGNoZWRcclxuXHRcdFx0XHRcdHR5cGVvZiB0aGlzLndvcmxkVGlsZXNbKHggLSAxKSAqIHRoaXMud2lkdGggKyB5XSA9PVxyXG5cdFx0XHRcdFx0XHQnbnVtYmVyJyk7XHJcblx0XHRcdGxlZnRUaWxlQm9vbCA9XHJcblx0XHRcdFx0eSA9PT0gMCB8fFxyXG5cdFx0XHRcdCh0aGlzLndvcmxkVGlsZXNbeCAqIHRoaXMud2lkdGggKyB5IC0gMV0gIT09IFRpbGVUeXBlLkFpciAmJlxyXG5cdFx0XHRcdFx0dHlwZW9mIHRoaXMud29ybGRUaWxlc1t4ICogdGhpcy53aWR0aCArIHkgLSAxXSA9PVxyXG5cdFx0XHRcdFx0XHQnbnVtYmVyJyk7XHJcblx0XHRcdGJvdHRvbVRpbGVCb29sID1cclxuXHRcdFx0XHR4ID09PSB0aGlzLmhlaWdodCAtIDEgfHxcclxuXHRcdFx0XHQodGhpcy53b3JsZFRpbGVzWyh4ICsgMSkgKiB0aGlzLndpZHRoICsgeV0gIT09IFRpbGVUeXBlLkFpciAmJlxyXG5cdFx0XHRcdFx0dHlwZW9mIHRoaXMud29ybGRUaWxlc1soeCArIDEpICogdGhpcy53aWR0aCArIHldID09XHJcblx0XHRcdFx0XHRcdCdudW1iZXInKTtcclxuXHRcdFx0cmlnaHRUaWxlQm9vbCA9XHJcblx0XHRcdFx0eSA9PT0gdGhpcy53aWR0aCAtIDEgfHxcclxuXHRcdFx0XHQodGhpcy53b3JsZFRpbGVzW3ggKiB0aGlzLndpZHRoICsgeSArIDFdICE9PSBUaWxlVHlwZS5BaXIgJiZcclxuXHRcdFx0XHRcdHR5cGVvZiB0aGlzLndvcmxkVGlsZXNbeCAqIHRoaXMud2lkdGggKyB5ICsgMV0gPT1cclxuXHRcdFx0XHRcdFx0J251bWJlcicpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Ly8gdGVzdCBpZiB0aGUgbmVpZ2hib3JpbmcgdGlsZXMgYXJlIHRoZSBzYW1lIHRpbGVcclxuXHRcdFx0dG9wVGlsZUJvb2wgPVxyXG5cdFx0XHRcdHggPT09IDAgfHxcclxuXHRcdFx0XHR0aGlzLndvcmxkVGlsZXNbKHggLSAxKSAqIHRoaXMud2lkdGggKyB5XSA9PT0gdGlsZVZhbDtcclxuXHRcdFx0bGVmdFRpbGVCb29sID1cclxuXHRcdFx0XHR5ID09PSAwIHx8IHRoaXMud29ybGRUaWxlc1t4ICogdGhpcy53aWR0aCArIHkgLSAxXSA9PT0gdGlsZVZhbDtcclxuXHRcdFx0Ym90dG9tVGlsZUJvb2wgPVxyXG5cdFx0XHRcdHggPT09IHRoaXMuaGVpZ2h0IC0gMSB8fFxyXG5cdFx0XHRcdHRoaXMud29ybGRUaWxlc1soeCArIDEpICogdGhpcy53aWR0aCArIHldID09PSB0aWxlVmFsO1xyXG5cdFx0XHRyaWdodFRpbGVCb29sID1cclxuXHRcdFx0XHR5ID09PSB0aGlzLndpZHRoIC0gMSB8fFxyXG5cdFx0XHRcdHRoaXMud29ybGRUaWxlc1t4ICogdGhpcy53aWR0aCArIHkgKyAxXSA9PT0gdGlsZVZhbDtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBjb252ZXJ0IDQgZGlnaXQgYmluYXJ5IG51bWJlciB0byBiYXNlIDEwXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ4ICogK3RvcFRpbGVCb29sICtcclxuXHRcdFx0NCAqICtyaWdodFRpbGVCb29sICtcclxuXHRcdFx0MiAqICtib3R0b21UaWxlQm9vbCArXHJcblx0XHRcdCtsZWZ0VGlsZUJvb2xcclxuXHRcdCk7XHJcblx0fVxyXG59XHJcbiIsImltcG9ydCB7IEltYWdlUmVzb3VyY2UgfSBmcm9tICcuLi9hc3NldHMvcmVzb3VyY2VzL0ltYWdlUmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBXb3JsZEFzc2V0cyB9IGZyb20gJy4uL2Fzc2V0cy9Bc3NldHMnO1xyXG5pbXBvcnQgeyBUaWxlUmVzb3VyY2UgfSBmcm9tICcuLi9hc3NldHMvcmVzb3VyY2VzL1RpbGVSZXNvdXJjZSc7XHJcbmltcG9ydCB7IFRpbGVUeXBlIH0gZnJvbSAnLi4vLi4vZ2xvYmFsL1RpbGUnO1xyXG5pbXBvcnQgeyBUaWxlRW50aXRpZXMgfSBmcm9tICcuLi8uLi9nbG9iYWwvVGlsZUVudGl0eSc7XHJcbmltcG9ydCB7IEl0ZW1UeXBlIH0gZnJvbSAnLi4vLi4vZ2xvYmFsL0ludmVudG9yeSc7XHJcblxyXG5leHBvcnQgdHlwZSBUaWxlID0ge1xyXG4gICAgbmFtZTogc3RyaW5nO1xyXG4gICAgdGV4dHVyZTogSW1hZ2VSZXNvdXJjZSB8IFRpbGVSZXNvdXJjZTtcclxuICAgIGNvbm5lY3RlZD86IGJvb2xlYW47XHJcbiAgICBhbnlDb25uZWN0aW9uPzogYm9vbGVhbjtcclxuICAgIGNvbG9yOiBzdHJpbmc7XHJcbiAgICBmcmljdGlvbjogbnVtYmVyO1xyXG4gICAgcmVmbGVjdGl2aXR5OiBudW1iZXI7XHJcbn1cclxuXHJcbmV4cG9ydCB0eXBlIFRpbGVFbnRpdHlSZW5kZXJEYXRhID0ge1xyXG4gICAgdGV4dHVyZTogSW1hZ2VSZXNvdXJjZSB8IFRpbGVSZXNvdXJjZTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IFdvcmxkVGlsZXM6IFJlY29yZDxUaWxlVHlwZSwgVGlsZSB8IHVuZGVmaW5lZD4gPSB7XHJcbiAgICBbVGlsZVR5cGUuQWlyXTogdW5kZWZpbmVkLFxyXG4gICAgW1RpbGVUeXBlLlNub3ddOiB7XHJcbiAgICAgICAgbmFtZTogJ3Nub3cnLFxyXG4gICAgICAgIHRleHR1cmU6IFdvcmxkQXNzZXRzLm1pZGRsZWdyb3VuZC50aWxlc2V0X3Nub3csXHJcbiAgICAgICAgY29ubmVjdGVkOiB0cnVlLFxyXG4gICAgICAgIGFueUNvbm5lY3Rpb246IHRydWUsXHJcbiAgICAgICAgY29sb3I6IFwiI2NhZmFmY1wiLFxyXG4gICAgICAgIGZyaWN0aW9uOiAyLFxyXG4gICAgICAgIHJlZmxlY3Rpdml0eTogNjAvL3RoaXMgcmVmbGVjdGl2aXR5IGFjdHVhbGx5IGRvZXMgbm90aGluZyBhbmQgaW5zdGVhZCByZWZsZWN0aXZpdHkgY2FuIGJlIGNoYW5nZWQgaW5zaWRlIFJlZmxlY3RlZEltYWdlUmVzb3VyY2UudHNcclxuICAgIH0sXHJcbiAgICBbVGlsZVR5cGUuSWNlXToge1xyXG4gICAgICAgIG5hbWU6ICdpY2UnLFxyXG4gICAgICAgIHRleHR1cmU6IFdvcmxkQXNzZXRzLm1pZGRsZWdyb3VuZC50aWxlc2V0X2ljZSxcclxuICAgICAgICBjb25uZWN0ZWQ6IHRydWUsXHJcbiAgICAgICAgYW55Q29ubmVjdGlvbjogdHJ1ZSxcclxuICAgICAgICBjb2xvcjogXCIjNzZhZGM0XCIsXHJcbiAgICAgICAgZnJpY3Rpb246IDEuNSxcclxuICAgICAgICByZWZsZWN0aXZpdHk6IDE1MFxyXG4gICAgfSxcclxuICAgIFtUaWxlVHlwZS5EaXJ0XToge1xyXG4gICAgICAgIG5hbWU6ICdkaXJ0JyxcclxuICAgICAgICB0ZXh0dXJlOiBXb3JsZEFzc2V0cy5taWRkbGVncm91bmQudGlsZXNldF9kaXJ0LFxyXG4gICAgICAgIGNvbm5lY3RlZDogdHJ1ZSxcclxuICAgICAgICBhbnlDb25uZWN0aW9uOiB0cnVlLFxyXG4gICAgICAgIGNvbG9yOiBcIiM0YTJlMWVcIixcclxuICAgICAgICBmcmljdGlvbjogNCxcclxuICAgICAgICByZWZsZWN0aXZpdHk6IDBcclxuICAgIH0sXHJcbiAgICBbVGlsZVR5cGUuU3RvbmUwXToge1xyXG4gICAgICAgIG5hbWU6ICdyYXcgc3RvbmUnLFxyXG4gICAgICAgIHRleHR1cmU6IFdvcmxkQXNzZXRzLm1pZGRsZWdyb3VuZC50aWxlc2V0X3N0b25lMCxcclxuICAgICAgICBjb25uZWN0ZWQ6IHRydWUsXHJcbiAgICAgICAgYW55Q29ubmVjdGlvbjogdHJ1ZSxcclxuICAgICAgICBjb2xvcjogXCIjNDE0MjQ1XCIsXHJcbiAgICAgICAgZnJpY3Rpb246IDMsXHJcbiAgICAgICAgcmVmbGVjdGl2aXR5OiAxMFxyXG4gICAgfSxcclxuICAgIFtUaWxlVHlwZS5TdG9uZTFdOiB7XHJcbiAgICAgICAgbmFtZTogJ3N0b25lIHRpZXIgMScsXHJcbiAgICAgICAgdGV4dHVyZTogV29ybGRBc3NldHMubWlkZGxlZ3JvdW5kLnRpbGVzZXRfc3RvbmUxLFxyXG4gICAgICAgIGNvbm5lY3RlZDogdHJ1ZSxcclxuICAgICAgICBhbnlDb25uZWN0aW9uOiB0cnVlLFxyXG4gICAgICAgIGNvbG9yOiBcIiMzMTMyM2JcIixcclxuICAgICAgICBmcmljdGlvbjogMyxcclxuICAgICAgICByZWZsZWN0aXZpdHk6IDE1XHJcbiAgICB9LFxyXG4gICAgW1RpbGVUeXBlLlN0b25lMl06IHtcclxuICAgICAgICBuYW1lOiAnc3RvbmUgdGllciAyJyxcclxuICAgICAgICB0ZXh0dXJlOiBXb3JsZEFzc2V0cy5taWRkbGVncm91bmQudGlsZXNldF9zdG9uZTIsXHJcbiAgICAgICAgY29ubmVjdGVkOiB0cnVlLFxyXG4gICAgICAgIGFueUNvbm5lY3Rpb246IHRydWUsXHJcbiAgICAgICAgY29sb3I6IFwiIzMxMzIzYlwiLC8vVE9ETyBjaGFuZ2UgdGhlc2UgY29sb3JzIHRvIGJlIG1vcmUgYWNjdXJhdGVcclxuICAgICAgICBmcmljdGlvbjogMyxcclxuICAgICAgICByZWZsZWN0aXZpdHk6IDE3XHJcbiAgICB9LFxyXG4gICAgW1RpbGVUeXBlLlN0b25lM106IHtcclxuICAgICAgICBuYW1lOiAnc3RvbmUgdGllciAzJyxcclxuICAgICAgICB0ZXh0dXJlOiBXb3JsZEFzc2V0cy5taWRkbGVncm91bmQudGlsZXNldF9zdG9uZTMsXHJcbiAgICAgICAgY29ubmVjdGVkOiB0cnVlLFxyXG4gICAgICAgIGFueUNvbm5lY3Rpb246IHRydWUsXHJcbiAgICAgICAgY29sb3I6IFwiIzMxMzIzYlwiLFxyXG4gICAgICAgIGZyaWN0aW9uOiAzLFxyXG4gICAgICAgIHJlZmxlY3Rpdml0eTogMTlcclxuICAgIH0sXHJcbiAgICBbVGlsZVR5cGUuU3RvbmU0XToge1xyXG4gICAgICAgIG5hbWU6ICdzdG9uZSB0aWVyIDQnLFxyXG4gICAgICAgIHRleHR1cmU6IFdvcmxkQXNzZXRzLm1pZGRsZWdyb3VuZC50aWxlc2V0X3N0b25lNCxcclxuICAgICAgICBjb25uZWN0ZWQ6IHRydWUsXHJcbiAgICAgICAgYW55Q29ubmVjdGlvbjogdHJ1ZSxcclxuICAgICAgICBjb2xvcjogXCIjMzEzMjNiXCIsXHJcbiAgICAgICAgZnJpY3Rpb246IDMsXHJcbiAgICAgICAgcmVmbGVjdGl2aXR5OiAyMVxyXG4gICAgfSxcclxuICAgIFtUaWxlVHlwZS5TdG9uZTVdOiB7XHJcbiAgICAgICAgbmFtZTogJ3N0b25lIHRpZXIgNScsXHJcbiAgICAgICAgdGV4dHVyZTogV29ybGRBc3NldHMubWlkZGxlZ3JvdW5kLnRpbGVzZXRfc3RvbmU1LFxyXG4gICAgICAgIGNvbm5lY3RlZDogdHJ1ZSxcclxuICAgICAgICBhbnlDb25uZWN0aW9uOiB0cnVlLFxyXG4gICAgICAgIGNvbG9yOiBcIiMzMTMyM2JcIixcclxuICAgICAgICBmcmljdGlvbjogMyxcclxuICAgICAgICByZWZsZWN0aXZpdHk6IDIzXHJcbiAgICB9LFxyXG4gICAgW1RpbGVUeXBlLlN0b25lNl06IHtcclxuICAgICAgICBuYW1lOiAnc3RvbmUgdGllciA2JyxcclxuICAgICAgICB0ZXh0dXJlOiBXb3JsZEFzc2V0cy5taWRkbGVncm91bmQudGlsZXNldF9zdG9uZTYsXHJcbiAgICAgICAgY29ubmVjdGVkOiB0cnVlLFxyXG4gICAgICAgIGFueUNvbm5lY3Rpb246IHRydWUsXHJcbiAgICAgICAgY29sb3I6IFwiIzMxMzIzYlwiLFxyXG4gICAgICAgIGZyaWN0aW9uOiAzLFxyXG4gICAgICAgIHJlZmxlY3Rpdml0eTogMjVcclxuICAgIH0sXHJcbiAgICBbVGlsZVR5cGUuU3RvbmU3XToge1xyXG4gICAgICAgIG5hbWU6ICdzdG9uZSB0aWVyIDcnLFxyXG4gICAgICAgIHRleHR1cmU6IFdvcmxkQXNzZXRzLm1pZGRsZWdyb3VuZC50aWxlc2V0X3N0b25lNyxcclxuICAgICAgICBjb25uZWN0ZWQ6IHRydWUsXHJcbiAgICAgICAgYW55Q29ubmVjdGlvbjogdHJ1ZSxcclxuICAgICAgICBjb2xvcjogXCIjMzEzMjNiXCIsXHJcbiAgICAgICAgZnJpY3Rpb246IDMsXHJcbiAgICAgICAgcmVmbGVjdGl2aXR5OiAyN1xyXG4gICAgfSxcclxuICAgIFtUaWxlVHlwZS5TdG9uZThdOiB7XHJcbiAgICAgICAgbmFtZTogJ3N0b25lIHRpZXIgOCcsXHJcbiAgICAgICAgdGV4dHVyZTogV29ybGRBc3NldHMubWlkZGxlZ3JvdW5kLnRpbGVzZXRfc3RvbmU4LFxyXG4gICAgICAgIGNvbm5lY3RlZDogdHJ1ZSxcclxuICAgICAgICBhbnlDb25uZWN0aW9uOiB0cnVlLFxyXG4gICAgICAgIGNvbG9yOiBcIiMzMTMyM2JcIixcclxuICAgICAgICBmcmljdGlvbjogMyxcclxuICAgICAgICByZWZsZWN0aXZpdHk6IDI5XHJcbiAgICB9LFxyXG4gICAgW1RpbGVUeXBlLlN0b25lOV06IHtcclxuICAgICAgICBuYW1lOiAnc3RvbmUgdGllciA5JyxcclxuICAgICAgICB0ZXh0dXJlOiBXb3JsZEFzc2V0cy5taWRkbGVncm91bmQudGlsZXNldF9zdG9uZTksXHJcbiAgICAgICAgY29ubmVjdGVkOiB0cnVlLFxyXG4gICAgICAgIGFueUNvbm5lY3Rpb246IHRydWUsXHJcbiAgICAgICAgY29sb3I6IFwiIzMxMzIzYlwiLFxyXG4gICAgICAgIGZyaWN0aW9uOiAzLFxyXG4gICAgICAgIHJlZmxlY3Rpdml0eTogMzFcclxuICAgIH0sXHJcbiAgICBbVGlsZVR5cGUuVGluXToge1xyXG4gICAgICAgIG5hbWU6ICd0aW4gb3JlJyxcclxuICAgICAgICB0ZXh0dXJlOiBXb3JsZEFzc2V0cy5taWRkbGVncm91bmQudGlsZXNldF90aW4sXHJcbiAgICAgICAgY29ubmVjdGVkOiB0cnVlLFxyXG4gICAgICAgIGFueUNvbm5lY3Rpb246IGZhbHNlLFxyXG4gICAgICAgIGNvbG9yOiBcIiMzMTMyM2JcIixcclxuICAgICAgICBmcmljdGlvbjogMyxcclxuICAgICAgICByZWZsZWN0aXZpdHk6IDEwXHJcbiAgICB9LFxyXG4gICAgW1RpbGVUeXBlLkFsdW1pbnVtXToge1xyXG4gICAgICAgIG5hbWU6ICdhbHVtaW51bSBvcmUnLFxyXG4gICAgICAgIHRleHR1cmU6IFdvcmxkQXNzZXRzLm1pZGRsZWdyb3VuZC50aWxlc2V0X2FsdW1pbnVtLFxyXG4gICAgICAgIGNvbm5lY3RlZDogdHJ1ZSxcclxuICAgICAgICBhbnlDb25uZWN0aW9uOiBmYWxzZSxcclxuICAgICAgICBjb2xvcjogXCIjMzEzMjNiXCIsXHJcbiAgICAgICAgZnJpY3Rpb246IDMsXHJcbiAgICAgICAgcmVmbGVjdGl2aXR5OiAxN1xyXG4gICAgfSxcclxuICAgIFtUaWxlVHlwZS5Hb2xkXToge1xyXG4gICAgICAgIG5hbWU6ICdnb2xkIG9yZScsXHJcbiAgICAgICAgdGV4dHVyZTogV29ybGRBc3NldHMubWlkZGxlZ3JvdW5kLnRpbGVzZXRfZ29sZCxcclxuICAgICAgICBjb25uZWN0ZWQ6IHRydWUsXHJcbiAgICAgICAgYW55Q29ubmVjdGlvbjogZmFsc2UsXHJcbiAgICAgICAgY29sb3I6IFwiIzMxMzIzYlwiLFxyXG4gICAgICAgIGZyaWN0aW9uOiAzLFxyXG4gICAgICAgIHJlZmxlY3Rpdml0eTogMjFcclxuICAgIH0sXHJcbiAgICBbVGlsZVR5cGUuVGl0YW5pdW1dOiB7XHJcbiAgICAgICAgbmFtZTogJ3RpdGFuaXVtIG9yZScsXHJcbiAgICAgICAgdGV4dHVyZTogV29ybGRBc3NldHMubWlkZGxlZ3JvdW5kLnRpbGVzZXRfdGl0YW5pdW0sXHJcbiAgICAgICAgY29ubmVjdGVkOiB0cnVlLFxyXG4gICAgICAgIGFueUNvbm5lY3Rpb246IGZhbHNlLFxyXG4gICAgICAgIGNvbG9yOiBcIiMzMTMyM2JcIixcclxuICAgICAgICBmcmljdGlvbjogMyxcclxuICAgICAgICByZWZsZWN0aXZpdHk6IDI1XHJcbiAgICB9LFxyXG4gICAgW1RpbGVUeXBlLkdyYXBlXToge1xyXG4gICAgICAgIG5hbWU6ICdncmFwZSBvcmUnLFxyXG4gICAgICAgIHRleHR1cmU6IFdvcmxkQXNzZXRzLm1pZGRsZWdyb3VuZC50aWxlc2V0X2dyYXBlLFxyXG4gICAgICAgIGNvbm5lY3RlZDogdHJ1ZSxcclxuICAgICAgICBhbnlDb25uZWN0aW9uOiBmYWxzZSxcclxuICAgICAgICBjb2xvcjogXCIjMzEzMjNiXCIsXHJcbiAgICAgICAgZnJpY3Rpb246IDMsXHJcbiAgICAgICAgcmVmbGVjdGl2aXR5OiAyOVxyXG4gICAgfSxcclxuICAgIFtUaWxlVHlwZS5Xb29kMF06IHtcclxuICAgICAgICBuYW1lOiAncmF3IHdvb2QnLFxyXG4gICAgICAgIHRleHR1cmU6IFdvcmxkQXNzZXRzLm1pZGRsZWdyb3VuZC50aWxlc2V0X3dvb2QwLFxyXG4gICAgICAgIGNvbm5lY3RlZDogdHJ1ZSxcclxuICAgICAgICBhbnlDb25uZWN0aW9uOiB0cnVlLFxyXG4gICAgICAgIGNvbG9yOiBcIiNhNzcxNDVcIixcclxuICAgICAgICBmcmljdGlvbjogMyxcclxuICAgICAgICByZWZsZWN0aXZpdHk6IDVcclxuICAgIH0sXHJcbiAgICBbVGlsZVR5cGUuV29vZDFdOiB7XHJcbiAgICAgICAgbmFtZTogJ3dvb2QgdGllciAxJyxcclxuICAgICAgICB0ZXh0dXJlOiBXb3JsZEFzc2V0cy5taWRkbGVncm91bmQudGlsZXNldF93b29kMSxcclxuICAgICAgICBjb25uZWN0ZWQ6IHRydWUsXHJcbiAgICAgICAgYW55Q29ubmVjdGlvbjogdHJ1ZSxcclxuICAgICAgICBjb2xvcjogXCIjYTc3MTQ1XCIsXHJcbiAgICAgICAgZnJpY3Rpb246IDMsXHJcbiAgICAgICAgcmVmbGVjdGl2aXR5OiA1XHJcbiAgICB9LFxyXG4gICAgW1RpbGVUeXBlLldvb2QyXToge1xyXG4gICAgICAgIG5hbWU6ICd3b29kIHRpZXIgMicsXHJcbiAgICAgICAgdGV4dHVyZTogV29ybGRBc3NldHMubWlkZGxlZ3JvdW5kLnRpbGVzZXRfd29vZDIsXHJcbiAgICAgICAgY29ubmVjdGVkOiB0cnVlLFxyXG4gICAgICAgIGFueUNvbm5lY3Rpb246IHRydWUsXHJcbiAgICAgICAgY29sb3I6IFwiI2E3NzE0NVwiLFxyXG4gICAgICAgIGZyaWN0aW9uOiAzLFxyXG4gICAgICAgIHJlZmxlY3Rpdml0eTogNVxyXG4gICAgfSxcclxuICAgIFtUaWxlVHlwZS5Xb29kM106IHtcclxuICAgICAgICBuYW1lOiAnd29vZCB0aWVyIDMnLFxyXG4gICAgICAgIHRleHR1cmU6IFdvcmxkQXNzZXRzLm1pZGRsZWdyb3VuZC50aWxlc2V0X3dvb2QzLFxyXG4gICAgICAgIGNvbm5lY3RlZDogdHJ1ZSxcclxuICAgICAgICBhbnlDb25uZWN0aW9uOiB0cnVlLFxyXG4gICAgICAgIGNvbG9yOiBcIiNhNzcxNDVcIixcclxuICAgICAgICBmcmljdGlvbjogMyxcclxuICAgICAgICByZWZsZWN0aXZpdHk6IDVcclxuICAgIH0sXHJcbiAgICBbVGlsZVR5cGUuV29vZDRdOiB7XHJcbiAgICAgICAgbmFtZTogJ3dvb2QgdGllciA0JyxcclxuICAgICAgICB0ZXh0dXJlOiBXb3JsZEFzc2V0cy5taWRkbGVncm91bmQudGlsZXNldF93b29kNCxcclxuICAgICAgICBjb25uZWN0ZWQ6IHRydWUsXHJcbiAgICAgICAgYW55Q29ubmVjdGlvbjogdHJ1ZSxcclxuICAgICAgICBjb2xvcjogXCIjYTc3MTQ1XCIsXHJcbiAgICAgICAgZnJpY3Rpb246IDMsXHJcbiAgICAgICAgcmVmbGVjdGl2aXR5OiA1XHJcbiAgICB9LFxyXG4gICAgW1RpbGVUeXBlLldvb2Q1XToge1xyXG4gICAgICAgIG5hbWU6ICd3b29kIHRpZXIgNScsXHJcbiAgICAgICAgdGV4dHVyZTogV29ybGRBc3NldHMubWlkZGxlZ3JvdW5kLnRpbGVzZXRfd29vZDUsXHJcbiAgICAgICAgY29ubmVjdGVkOiB0cnVlLFxyXG4gICAgICAgIGFueUNvbm5lY3Rpb246IHRydWUsXHJcbiAgICAgICAgY29sb3I6IFwiI2E3NzE0NVwiLFxyXG4gICAgICAgIGZyaWN0aW9uOiAzLFxyXG4gICAgICAgIHJlZmxlY3Rpdml0eTogNVxyXG4gICAgfSxcclxuICAgIFtUaWxlVHlwZS5Xb29kNl06IHtcclxuICAgICAgICBuYW1lOiAnd29vZCB0aWVyIDYnLFxyXG4gICAgICAgIHRleHR1cmU6IFdvcmxkQXNzZXRzLm1pZGRsZWdyb3VuZC50aWxlc2V0X3dvb2Q2LFxyXG4gICAgICAgIGNvbm5lY3RlZDogdHJ1ZSxcclxuICAgICAgICBhbnlDb25uZWN0aW9uOiB0cnVlLFxyXG4gICAgICAgIGNvbG9yOiBcIiNhNzcxNDVcIixcclxuICAgICAgICBmcmljdGlvbjogMyxcclxuICAgICAgICByZWZsZWN0aXZpdHk6IDVcclxuICAgIH0sXHJcbiAgICBbVGlsZVR5cGUuV29vZDddOiB7XHJcbiAgICAgICAgbmFtZTogJ3dvb2QgdGllciA3JyxcclxuICAgICAgICB0ZXh0dXJlOiBXb3JsZEFzc2V0cy5taWRkbGVncm91bmQudGlsZXNldF93b29kNyxcclxuICAgICAgICBjb25uZWN0ZWQ6IHRydWUsXHJcbiAgICAgICAgYW55Q29ubmVjdGlvbjogdHJ1ZSxcclxuICAgICAgICBjb2xvcjogXCIjYTc3MTQ1XCIsXHJcbiAgICAgICAgZnJpY3Rpb246IDMsXHJcbiAgICAgICAgcmVmbGVjdGl2aXR5OiA1XHJcbiAgICB9LFxyXG4gICAgW1RpbGVUeXBlLldvb2Q4XToge1xyXG4gICAgICAgIG5hbWU6ICd3b29kIHRpZXIgOCcsXHJcbiAgICAgICAgdGV4dHVyZTogV29ybGRBc3NldHMubWlkZGxlZ3JvdW5kLnRpbGVzZXRfd29vZDgsXHJcbiAgICAgICAgY29ubmVjdGVkOiB0cnVlLFxyXG4gICAgICAgIGFueUNvbm5lY3Rpb246IHRydWUsXHJcbiAgICAgICAgY29sb3I6IFwiI2E3NzE0NVwiLFxyXG4gICAgICAgIGZyaWN0aW9uOiAzLFxyXG4gICAgICAgIHJlZmxlY3Rpdml0eTogNVxyXG4gICAgfSxcclxuICAgIFtUaWxlVHlwZS5Xb29kOV06IHtcclxuICAgICAgICBuYW1lOiAnd29vZCB0aWVyIDknLFxyXG4gICAgICAgIHRleHR1cmU6IFdvcmxkQXNzZXRzLm1pZGRsZWdyb3VuZC50aWxlc2V0X3dvb2Q5LFxyXG4gICAgICAgIGNvbm5lY3RlZDogdHJ1ZSxcclxuICAgICAgICBhbnlDb25uZWN0aW9uOiB0cnVlLFxyXG4gICAgICAgIGNvbG9yOiBcIiNhNzcxNDVcIixcclxuICAgICAgICBmcmljdGlvbjogMyxcclxuICAgICAgICByZWZsZWN0aXZpdHk6IDVcclxuICAgIH0sXHJcbn07XHJcblxyXG4vLyBleHBvcnQgY29uc3QgVGlsZUVudGl0aWVzUmVuZGVyRGF0YTogUmVjb3JkPFRpbGVFbnRpdGllcywgVGlsZUVudGl0eVJlbmRlckRhdGE+ID0ge1xyXG4gICAgLy8gW1RpbGVFbnRpdGllcy5UaWVyMURyaWxsXToge1xyXG4gICAgICAgIC8vIHRleHR1cmU6IHVuZGVmaW5lZFxyXG4gICAgLy8gfSxcclxuICAgIC8vIFtUaWxlRW50aXRpZXMuVGllcjJEcmlsbF06IHtcclxuICAgICAgICAvLyB0ZXh0dXJlOiB1bmRlZmluZWRcclxuICAgIC8vIH1cclxuLy8gfSIsImltcG9ydCB7IGdhbWUgfSBmcm9tIFwiLi4vLi4vR2FtZVwiO1xyXG5pbXBvcnQgU2ltcGxleE5vaXNlIGZyb20gXCJzaW1wbGV4LW5vaXNlXCI7XHJcbmltcG9ydCB7IEltYWdlUmVzb3VyY2UgfSBmcm9tIFwiLi4vLi4vYXNzZXRzL3Jlc291cmNlcy9JbWFnZVJlc291cmNlXCI7XHJcbmltcG9ydCB7IFdvcmxkQXNzZXRzIH0gZnJvbSBcIi4uLy4uL2Fzc2V0cy9Bc3NldHNcIjtcclxuaW1wb3J0IHA1IGZyb20gJ3A1J1xyXG5cclxuZXhwb3J0IGNsYXNzIENsb3VkIHtcclxuICAgIHg6IG51bWJlcjtcclxuICAgIHk6IG51bWJlcjtcclxuICAgIHhWZWw6IG51bWJlcjtcclxuICAgIGltYWdlOiBJbWFnZVJlc291cmNlXHJcblxyXG4gICAgY29uc3RydWN0b3IoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgIHRoaXMueFZlbCA9IE1hdGgucmFuZG9tKCkqMC4wNyswLjA1O1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICAgICAgdGhpcy5pbWFnZSA9IFdvcmxkQXNzZXRzLmNsb3Vkc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBXb3JsZEFzc2V0cy5jbG91ZHMubGVuZ3RoKV1cclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIodGFyZ2V0OiBwNSwgdXBzY2FsZVNpemU6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coYHg6ICR7dGhpcy54fSwgeTogJHt0aGlzLnl9YCk7XHJcbiAgICAgICAgLy9kcmF3IGEgY2xvdWQgYXQgdGhlIHBsYWNlIDpvXHJcbiAgICAgICAgdGhpcy5pbWFnZS5yZW5kZXIoXHJcbiAgICAgICAgICAgIHRhcmdldCxcclxuICAgICAgICAgICAgKHRoaXMueCAqIGdhbWUuVElMRV9XSURUSCAtXHJcbiAgICAgICAgICAgICAgICBnYW1lLmludGVycG9sYXRlZENhbVggKiBnYW1lLlRJTEVfV0lEVEgpICpcclxuICAgICAgICAgICAgdXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgICh0aGlzLnkgKiBnYW1lLlRJTEVfSEVJR0hUIC1cclxuICAgICAgICAgICAgICAgIGdhbWUuaW50ZXJwb2xhdGVkQ2FtWSAqIGdhbWUuVElMRV9IRUlHSFQpICpcclxuICAgICAgICAgICAgdXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2UuaW1hZ2Uud2lkdGggKiB1cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgdGhpcy5pbWFnZS5pbWFnZS5oZWlnaHQgKiB1cHNjYWxlU2l6ZVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgdGljaygpIHtcclxuICAgICAgICB0aGlzLnggKz0gdGhpcy54VmVsO1xyXG4gICAgICAgIGxldCBuID0gKChnYW1lLndpZHRoL2dhbWUudXBzY2FsZVNpemUrNTApL2dhbWUuVElMRV9XSURUSCk7XHJcbiAgICAgICAgbGV0IHggPSB0aGlzLngtZ2FtZS5pbnRlcnBvbGF0ZWRDYW1YICsgNTAvZ2FtZS5USUxFX1dJRFRIO1xyXG4gICAgICAgIHRoaXMueCA9IG1vZCh4LCBuKStnYW1lLmludGVycG9sYXRlZENhbVggLSA1MC9nYW1lLlRJTEVfV0lEVEg7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5mdW5jdGlvbiBtb2QoeDE6IG51bWJlciwgeDI6IG51bWJlcikge1xyXG4gICAgcmV0dXJuICgoeDEgJSB4MikgKyB4MikgJSB4MjtcclxufSIsImltcG9ydCBwNSBmcm9tICdwNSc7XHJcbmltcG9ydCB7IFNlcnZlckVudGl0eSB9IGZyb20gJy4vU2VydmVyRW50aXR5JztcclxuaW1wb3J0IHsgRW50aXRpZXMsIEVudGl0eVBheWxvYWQgfSBmcm9tICcuLi8uLi8uLi9nbG9iYWwvRW50aXR5JztcclxuaW1wb3J0IHsgSXRlbVR5cGUgfSBmcm9tICcuLi8uLi8uLi9nbG9iYWwvSW52ZW50b3J5JztcclxuaW1wb3J0IHsgSXRlbUFzc2V0cywgV29ybGRBc3NldHMgfSBmcm9tICcuLi8uLi9hc3NldHMvQXNzZXRzJztcclxuaW1wb3J0IHsgZ2FtZSB9IGZyb20gJy4uLy4uL0dhbWUnO1xyXG5cclxuZXhwb3J0IGNsYXNzIERyb25lRW50aXR5IGV4dGVuZHMgU2VydmVyRW50aXR5IHtcclxuXHJcbiAgICB4VmVsOiBudW1iZXIgPSAwO1xyXG4gICAgbGV2ZWw6IG51bWJlciA9IDE7XHJcbiAgICBhbmltRnJhbWU6IG51bWJlciA9IDA7XHJcbiAgICB0aW1lSW5UaGlzQW5pbWF0aW9uRnJhbWU6IG51bWJlciA9IDA7XHJcblxyXG4gICAgY29uc3RydWN0b3IocGF5bG9hZDogRW50aXR5UGF5bG9hZDxFbnRpdGllcy5Ecm9uZT4pIHtcclxuICAgICAgICBzdXBlcihwYXlsb2FkLmlkKTtcclxuXHJcbiAgICAgICAgdGhpcy5sZXZlbCA9IHBheWxvYWQuZGF0YS5sZXZlbDtcclxuICAgICAgICB0aGlzLnggPSBwYXlsb2FkLmRhdGEueDtcclxuICAgICAgICB0aGlzLnhWZWwgPSBwYXlsb2FkLmRhdGEueFZlbDtcclxuICAgICAgICB0aGlzLnkgPSBwYXlsb2FkLmRhdGEueTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIodGFyZ2V0OiBwNSwgdXBzY2FsZVNpemU6IG51bWJlcik6IHZvaWQge1xyXG5cclxuICAgICAgICB0aGlzLnRpbWVJblRoaXNBbmltYXRpb25GcmFtZSArPSBnYW1lLmRlbHRhVGltZTtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKHRoaXMuYW5pbUZyYW1lKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhbdGhpcy5sZXZlbCwgdGhpcy5hbmltRnJhbWVdKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhXb3JsZEFzc2V0cy5lbnRpdGllc1t0aGlzLmxldmVsLTFdKVxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFdvcmxkQXNzZXRzLmVudGl0aWVzW3RoaXMubGV2ZWwtMV1bdGhpcy5hbmltRnJhbWVdKVxyXG4gICAgICAgIGlmKHRoaXMudGltZUluVGhpc0FuaW1hdGlvbkZyYW1lPjc1KSB7XHJcbiAgICAgICAgICAgIHRoaXMudGltZUluVGhpc0FuaW1hdGlvbkZyYW1lID0gMDsvL3RoaXMgZG9lcyBpbnRyb2R1Y2Ugc29tZSBzbGlnaHQgaW5hY2N1cmFjaWVzIHZzIHN1YnRyYWN0aW5nIGl0LCBidXQsIHdoZW4geW91IHRhYiBiYWNrIGludG8gdGhlIGJyb3dzZXIgYWZ0ZXIgYmVpbmcgdGFiYmVkIG91dCwgc3VidHJhY3RpbmcgaXQgY2F1c2VzIHNwYXp6aW5nXHJcbiAgICAgICAgICAgIHRoaXMuYW5pbUZyYW1lKys7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuYW5pbUZyYW1lPj1Xb3JsZEFzc2V0cy5lbnRpdGllc1t0aGlzLmxldmVsLTFdLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hbmltRnJhbWUgPSB0aGlzLmFuaW1GcmFtZSVXb3JsZEFzc2V0cy5lbnRpdGllc1t0aGlzLmxldmVsLTFdLmxlbmd0aDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgYXNzZXQgPSBXb3JsZEFzc2V0cy5lbnRpdGllc1t0aGlzLmxldmVsLTFdW3RoaXMuYW5pbUZyYW1lXTtcclxuICAgICAgICBpZiAoYXNzZXQgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBhc3NldC5yZW5kZXJSb3RhdGVkKHRhcmdldCwgKHRoaXMueC1nYW1lLmludGVycG9sYXRlZENhbVgtMC40NSsoMC4xKk1hdGgucmFuZG9tKCkpKSpnYW1lLlRJTEVfV0lEVEgqZ2FtZS51cHNjYWxlU2l6ZSwgKHRoaXMueS1nYW1lLmludGVycG9sYXRlZENhbVktMC45NSsoMC4xKk1hdGgucmFuZG9tKCkpKSpnYW1lLlRJTEVfSEVJR0hUKmdhbWUudXBzY2FsZVNpemUsIDgqdXBzY2FsZVNpemUsIDE2KnVwc2NhbGVTaXplLCB0aGlzLnhWZWwqMC4yKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlRGF0YShkYXRhOiBFbnRpdHlQYXlsb2FkPEVudGl0aWVzLkRyb25lPik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMueCA9IGRhdGEuZGF0YS54O1xyXG4gICAgICAgIHRoaXMueSA9IGRhdGEuZGF0YS55O1xyXG4gICAgICAgIHRoaXMueFZlbCA9IGRhdGEuZGF0YS54VmVsXHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgRW50aXRpZXMgfSBmcm9tICcuLi8uLi8uLi9nbG9iYWwvRW50aXR5JztcclxuaW1wb3J0IHsgUGxheWVyRW50aXR5IH0gZnJvbSAnLi9QbGF5ZXJFbnRpdHknO1xyXG5pbXBvcnQgeyBJdGVtRW50aXR5IH0gZnJvbSAnLi9JdGVtRW50aXR5JztcclxuaW1wb3J0IHsgRHJvbmVFbnRpdHkgfSBmcm9tICcuL0Ryb25lRW50aXR5JztcclxuXHJcbmV4cG9ydCBjb25zdCBFbnRpdHlDbGFzc2VzOiBSZWNvcmQ8RW50aXRpZXMsIGFueT4gPSB7XHJcbiAgICBbRW50aXRpZXMuTG9jYWxQbGF5ZXJdOiB1bmRlZmluZWQsXHJcbiAgICBbRW50aXRpZXMuUGxheWVyXTogUGxheWVyRW50aXR5LFxyXG4gICAgW0VudGl0aWVzLkl0ZW1dOiBJdGVtRW50aXR5LFxyXG4gICAgW0VudGl0aWVzLkRyb25lXTogRHJvbmVFbnRpdHksXHJcbn07IiwiaW1wb3J0IHA1IGZyb20gJ3A1JztcclxuaW1wb3J0IHsgU2VydmVyRW50aXR5IH0gZnJvbSAnLi9TZXJ2ZXJFbnRpdHknO1xyXG5pbXBvcnQgeyBFbnRpdGllcywgRW50aXR5UGF5bG9hZCB9IGZyb20gJy4uLy4uLy4uL2dsb2JhbC9FbnRpdHknO1xyXG5pbXBvcnQgeyBJdGVtcywgSXRlbVR5cGUgfSBmcm9tICcuLi8uLi8uLi9nbG9iYWwvSW52ZW50b3J5JztcclxuaW1wb3J0IHsgSXRlbUFzc2V0cyB9IGZyb20gJy4uLy4uL2Fzc2V0cy9Bc3NldHMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEl0ZW1FbnRpdHkgZXh0ZW5kcyBTZXJ2ZXJFbnRpdHkge1xyXG4gICAgaXRlbTogSXRlbVR5cGU7XHJcblxyXG4gICAgY29uc3RydWN0b3IocGF5bG9hZDogRW50aXR5UGF5bG9hZDxFbnRpdGllcy5JdGVtPikge1xyXG4gICAgICAgIHN1cGVyKHBheWxvYWQuaWQpO1xyXG5cclxuICAgICAgICB0aGlzLml0ZW0gPSBwYXlsb2FkLmRhdGEuaXRlbTtcclxuICAgICAgICB0aGlzLnggPSBwYXlsb2FkLmRhdGEueDtcclxuICAgICAgICB0aGlzLnkgPSBwYXlsb2FkLmRhdGEueTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIodGFyZ2V0OiBwNSwgdXBzY2FsZVNpemU6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IGFzc2V0ID0gSXRlbUFzc2V0c1t0aGlzLml0ZW1dO1xyXG4gICAgICAgIGlmIChhc3NldCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGFzc2V0LnJlbmRlcih0YXJnZXQsIHRoaXMueCwgdGhpcy55LCA4LCA4KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlRGF0YShkYXRhOiBFbnRpdHlQYXlsb2FkPEVudGl0aWVzLkl0ZW0+KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5pdGVtID0gZGF0YS5kYXRhLml0ZW07XHJcbiAgICAgICAgdGhpcy54ID0gZGF0YS5kYXRhLng7XHJcbiAgICAgICAgdGhpcy55ID0gZGF0YS5kYXRhLnk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHA1IGZyb20gJ3A1JztcclxuaW1wb3J0IHsgU2VydmVyRW50aXR5IH0gZnJvbSAnLi9TZXJ2ZXJFbnRpdHknO1xyXG5pbXBvcnQgeyBFbnRpdGllcywgRW50aXR5UGF5bG9hZCB9IGZyb20gJy4uLy4uLy4uL2dsb2JhbC9FbnRpdHknO1xyXG5pbXBvcnQgeyBnYW1lIH0gZnJvbSAnLi4vLi4vR2FtZSc7XHJcbmltcG9ydCB7IEFuaW1hdGlvbkZyYW1lLCBGb250cywgUGxheWVyQW5pbWF0aW9ucywgVWlBc3NldHMgfSBmcm9tICcuLi8uLi9hc3NldHMvQXNzZXRzJztcclxuaW1wb3J0IHsgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlIH0gZnJvbSAnLi4vLi4vYXNzZXRzL3Jlc291cmNlcy9SZWZsZWN0ZWRJbWFnZVJlc291cmNlJztcclxuXHJcbmV4cG9ydCBjbGFzcyBQbGF5ZXJFbnRpdHkgZXh0ZW5kcyBTZXJ2ZXJFbnRpdHkge1xyXG4gICAgd2lkdGg6IG51bWJlciA9IDEyIC8gZ2FtZS5USUxFX1dJRFRIO1xyXG4gICAgaGVpZ2h0OiBudW1iZXIgPSAyOCAvIGdhbWUuVElMRV9IRUlHSFQ7XHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICBpZE51bWJlcjogbnVtYmVyO1xyXG4gICAgY29sb3IxOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXVxyXG4gICAgY29sb3IyOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXVxyXG4gICAgY3VycmVudEFuaW1hdGlvbjogQW5pbWF0aW9uRnJhbWU8dHlwZW9mIFBsYXllckFuaW1hdGlvbnM+ID0gXCJpZGxlXCJcclxuICAgIHRpbWVJblRoaXNBbmltYXRpb25GcmFtZTogbnVtYmVyID0gMDtcclxuICAgIGFuaW1GcmFtZTogbnVtYmVyID0gMDtcclxuXHJcbiAgICBcclxuICAgIGFuaW1hdGlvbnM6IHtcclxuICAgICAgICBba2V5OiBzdHJpbmddOiBbUmVmbGVjdGFibGVJbWFnZVJlc291cmNlLCBudW1iZXJdW10sXHJcbiAgICB9ID0ge307XHJcblxyXG4gICAgY29uc3RydWN0b3IoZGF0YTogRW50aXR5UGF5bG9hZCkge1xyXG4gICAgICAgIHN1cGVyKGRhdGEuaWQpO1xyXG4gICAgICAgIGlmIChkYXRhLnR5cGUgPT09IEVudGl0aWVzLlBsYXllcikge1xyXG4gICAgICAgICAgICB0aGlzLm5hbWUgPSBkYXRhLmRhdGEubmFtZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZGF0YS5pZCA9IGRhdGEuaWQuc3BsaXQoXCItXCIpLmpvaW4oXCJcIik7Ly9zdHJpbmcucHJvdG90eXBlLnJlcGxhY2VBbGwgcmVxdWlyZXMgRVMyMDIxXHJcbiAgICAgICAgdGhpcy5pZE51bWJlciA9IChOdW1iZXIoXCIweFwiK2RhdGEuaWQpLzEwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMCklMTsvL2dldCBhIG51bWJlciAwLTEgcHNldWRvcmFuZG9tbHkgc2VsZWN0ZWQgZnJvbSB0aGUgdXVpZCBvZiB0aGUgcGxheWVyXHJcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5pZE51bWJlcik7XHJcbiAgICAgICAgdGhpcy5jb2xvcjEgPSBoc2xUb1JnYih0aGlzLmlkTnVtYmVyLCAxLCAwLjQ1KTsvL2NvbnZlcnQgdGhpcyB0byB0d28gSFNMIGNvbG9ycyB3aGljaCBhcmUgdGhlbiBjb252ZXJ0ZWQgdG8gdHdvIFJHQiBjb2xvcnM6IG9uZSBsaWdodCBhbmQgb25lIGRhcmtcclxuICAgICAgICB0aGlzLmNvbG9yMiA9IGhzbFRvUmdiKHRoaXMuaWROdW1iZXIsIDEsIDAuMyk7XHJcbiAgICAgICAgY29uc29sZS5sb2coYGNyZWF0aW5nIGFuaW1hdGlvbnMgZm9yIHBsYXllciB3aXRoIGNvbG9ycyAke3RoaXMuY29sb3IxfSBhbmQgJHt0aGlzLmNvbG9yMn1gKVxyXG4gICAgICAgIC8vY29uc29sZS5sb2coXCJURVNUOiBcIisodGhpcy5hbmltYXRpb25zLmlkbGVbMF1bMF0uaW1hZ2U9PT1QbGF5ZXJBbmltYXRpb25zLmlkbGVbMF1bMF0uaW1hZ2UpKVxyXG4gICAgICAgIC8vIGxldCBpbWcgPSB0aGlzLmFuaW1hdGlvbnMuaWRsZVswXVswXS5pbWFnZTtcclxuICAgICAgICAvLyBpbWcubG9hZFBpeGVscygpO1xyXG4gICAgICAgIC8vIGltZy5zZXQoMywgMTAsIFswLCAyNTUsIDAsIDI1NV0pO1xyXG4gICAgICAgIC8vIGltZy51cGRhdGVQaXhlbHMoKTtcclxuICAgICAgICBPYmplY3QuZW50cmllcyhQbGF5ZXJBbmltYXRpb25zKS5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmFuaW1hdGlvbnNbZWxlbWVudFswXV0gPSBbXTtcclxuICAgICAgICAgICAgZm9yKGxldCBmcmFtZSBvZiBlbGVtZW50WzFdKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFuaW1hdGlvbnNbZWxlbWVudFswXV0ucHVzaChbbmV3IFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZShmcmFtZVswXS5wYXRoLCB0aGlzLmNvbG9yMSwgdGhpcy5jb2xvcjIpLCBmcmFtZVsxXV0pO1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlZmxlY3RhYmxlUmVzb3VyY2UgPSB0aGlzLmFuaW1hdGlvbnNbZWxlbWVudFswXV1bdGhpcy5hbmltYXRpb25zW2VsZW1lbnRbMF1dLmxlbmd0aC0xXVswXTtcclxuICAgICAgICAgICAgICAgIHJlZmxlY3RhYmxlUmVzb3VyY2UubG9hZFJlc291cmNlKGdhbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlRGF0YShkYXRhOiBFbnRpdHlQYXlsb2FkKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKGRhdGEudHlwZSA9PT0gRW50aXRpZXMuUGxheWVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMubmFtZSA9IGRhdGEuZGF0YS5uYW1lO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIodGFyZ2V0OiBwNSwgdXBzY2FsZVNpemU6IG51bWJlcik6IHZvaWQge1xyXG5cclxuICAgICAgICAvL3VwZGF0ZSBhbmltYXRpb24gZnJhbWUgYmFzZWQgb24gZGVsdGFUaW1lXHJcbiAgICAgICAgdGhpcy50aW1lSW5UaGlzQW5pbWF0aW9uRnJhbWUgKz0gZ2FtZS5kZWx0YVRpbWU7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyh0aGlzLmFuaW1GcmFtZSk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coW3RoaXMuY3VycmVudEFuaW1hdGlvbiwgdGhpcy5hbmltRnJhbWVdKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhQbGF5ZXJBbmltYXRpb25zW3RoaXMuY3VycmVudEFuaW1hdGlvbl0pXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coUGxheWVyQW5pbWF0aW9uc1t0aGlzLmN1cnJlbnRBbmltYXRpb25dW3RoaXMuYW5pbUZyYW1lXSlcclxuICAgICAgICBpZih0aGlzLnRpbWVJblRoaXNBbmltYXRpb25GcmFtZT5QbGF5ZXJBbmltYXRpb25zW3RoaXMuY3VycmVudEFuaW1hdGlvbl1bdGhpcy5hbmltRnJhbWVdWzFdKSB7XHJcbiAgICAgICAgICAgIHRoaXMudGltZUluVGhpc0FuaW1hdGlvbkZyYW1lID0gMDsvL3RoaXMgZG9lcyBpbnRyb2R1Y2Ugc29tZSBzbGlnaHQgaW5hY2N1cmFjaWVzIHZzIHN1YnRyYWN0aW5nIGl0LCBidXQsIHdoZW4geW91IHRhYiBiYWNrIGludG8gdGhlIGJyb3dzZXIgYWZ0ZXIgYmVpbmcgdGFiYmVkIG91dCwgc3VidHJhY3RpbmcgaXQgY2F1c2VzIHNwYXp6aW5nXHJcbiAgICAgICAgICAgIHRoaXMuYW5pbUZyYW1lKys7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuYW5pbUZyYW1lPj1QbGF5ZXJBbmltYXRpb25zW3RoaXMuY3VycmVudEFuaW1hdGlvbl0ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFuaW1GcmFtZSA9IHRoaXMuYW5pbUZyYW1lJVBsYXllckFuaW1hdGlvbnNbdGhpcy5jdXJyZW50QW5pbWF0aW9uXS5sZW5ndGg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vUGxheWVyQVxyXG4gICAgICAgIC8vIFJlbmRlciB0aGUgaXRlbSBxdWFudGl0eSBsYWJlbFxyXG4gICAgICAgIHRoaXMuYW5pbWF0aW9uc1t0aGlzLmN1cnJlbnRBbmltYXRpb25dW3RoaXMuYW5pbUZyYW1lXVswXS5yZW5kZXIoXHJcbiAgICAgICAgICAgIHRhcmdldCxcclxuICAgICAgICAgICAgKHRoaXMueCAqIGdhbWUuVElMRV9XSURUSCAtXHJcbiAgICAgICAgICAgICAgICBnYW1lLmludGVycG9sYXRlZENhbVggKiBnYW1lLlRJTEVfV0lEVEgpICpcclxuICAgICAgICAgICAgICAgIHVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICAodGhpcy55ICogZ2FtZS5USUxFX0hFSUdIVCAtXHJcbiAgICAgICAgICAgICAgICBnYW1lLmludGVycG9sYXRlZENhbVkgKiBnYW1lLlRJTEVfSEVJR0hUKSAqXHJcbiAgICAgICAgICAgICAgICB1cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgdGhpcy53aWR0aCAqIHVwc2NhbGVTaXplICogZ2FtZS5USUxFX1dJRFRILFxyXG4gICAgICAgICAgICB0aGlzLmhlaWdodCAqIHVwc2NhbGVTaXplICogZ2FtZS5USUxFX0hFSUdIVFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgdGhpcy5hbmltYXRpb25zW3RoaXMuY3VycmVudEFuaW1hdGlvbl1bdGhpcy5hbmltRnJhbWVdWzBdLnJlbmRlcldvcmxkc3BhY2VSZWZsZWN0aW9uKFxyXG4gICAgICAgICAgICBnYW1lLFxyXG4gICAgICAgICAgICB0aGlzLngsXHJcbiAgICAgICAgICAgIHRoaXMueSt0aGlzLmhlaWdodCxcclxuICAgICAgICAgICAgdGhpcy53aWR0aCxcclxuICAgICAgICAgICAgdGhpcy5oZWlnaHRcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICAvLyB0YXJnZXQubm9TdHJva2UoKTtcclxuXHJcbiAgICAgICAgLy8gdGFyZ2V0LnRleHRTaXplKDUgKiB1cHNjYWxlU2l6ZSk7XHJcbiAgICAgICAgLy8gdGFyZ2V0LnRleHRBbGlnbih0YXJnZXQuQ0VOVEVSLCB0YXJnZXQuVE9QKTtcclxuXHJcbiAgICAgICAgdGFyZ2V0LmZpbGwodGhpcy5jb2xvcjEpO1xyXG4gICAgICAgIHRhcmdldC5ub1N0cm9rZSgpO1xyXG4gICAgICAgIHRhcmdldC5yZWN0KFxyXG4gICAgICAgICAgICAodGhpcy54ICogZ2FtZS5USUxFX1dJRFRIIC1cclxuICAgICAgICAgICAgICAgIGdhbWUuaW50ZXJwb2xhdGVkQ2FtWCAqIGdhbWUuVElMRV9XSURUSCArXHJcbiAgICAgICAgICAgICAgICAodGhpcy53aWR0aCAqIGdhbWUuVElMRV9XSURUSCkgLyAyKSAqXHJcbiAgICAgICAgICAgICAgICB1cHNjYWxlU2l6ZS0odGhpcy5uYW1lLmxlbmd0aCoyKmdhbWUudXBzY2FsZVNpemUpLFxyXG4gICAgICAgICAgICAgICAgKHRoaXMueSAqIGdhbWUuVElMRV9IRUlHSFQgLVxyXG4gICAgICAgICAgICAgICAgZ2FtZS5pbnRlcnBvbGF0ZWRDYW1ZICogZ2FtZS5USUxFX0hFSUdIVCAtXHJcbiAgICAgICAgICAgICAgICAodGhpcy5oZWlnaHQgKiBnYW1lLlRJTEVfSEVJR0hUKSAvIDIuNSArIDYpICpcclxuICAgICAgICAgICAgICAgIHVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICAgICAgKHRoaXMubmFtZS5sZW5ndGgqNCpnYW1lLnVwc2NhbGVTaXplKSxcclxuICAgICAgICAgICAgICAgIGdhbWUudXBzY2FsZVNpemUpO1xyXG5cclxuICAgICAgICBGb250cy50b21fdGh1bWIuZHJhd1RleHQoXHJcbiAgICAgICAgICAgIGdhbWUsXHJcbiAgICAgICAgICAgIHRoaXMubmFtZSxcclxuICAgICAgICAgICAgKHRoaXMueCAqIGdhbWUuVElMRV9XSURUSCAtXHJcbiAgICAgICAgICAgICAgICBnYW1lLmludGVycG9sYXRlZENhbVggKiBnYW1lLlRJTEVfV0lEVEggK1xyXG4gICAgICAgICAgICAgICAgKHRoaXMud2lkdGggKiBnYW1lLlRJTEVfV0lEVEgpIC8gMikgKlxyXG4gICAgICAgICAgICAgICAgdXBzY2FsZVNpemUtKHRoaXMubmFtZS5sZW5ndGgqMipnYW1lLnVwc2NhbGVTaXplKSxcclxuICAgICAgICAgICAgKHRoaXMueSAqIGdhbWUuVElMRV9IRUlHSFQgLVxyXG4gICAgICAgICAgICAgICAgZ2FtZS5pbnRlcnBvbGF0ZWRDYW1ZICogZ2FtZS5USUxFX0hFSUdIVCAtXHJcbiAgICAgICAgICAgICAgICAodGhpcy5oZWlnaHQgKiBnYW1lLlRJTEVfSEVJR0hUKSAvIDIuNSkgKlxyXG4gICAgICAgICAgICAgICAgdXBzY2FsZVNpemVcclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGhzbFRvUmdiKGg6IG51bWJlciwgczogbnVtYmVyLCBsOiBudW1iZXIpOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXXtcclxuICAgIHZhciByLCBnLCBiO1xyXG5cclxuICAgIGlmKHMgPT0gMCl7XHJcbiAgICAgICAgciA9IGcgPSBiID0gbDsgLy8gYWNocm9tYXRpY1xyXG4gICAgfWVsc2V7XHJcbiAgICAgICAgdmFyIGh1ZTJyZ2IgPSBmdW5jdGlvbiBodWUycmdiKHA6IG51bWJlciwgcTogbnVtYmVyLCB0OiBudW1iZXIpe1xyXG4gICAgICAgICAgICBpZih0IDwgMCkgdCArPSAxO1xyXG4gICAgICAgICAgICBpZih0ID4gMSkgdCAtPSAxO1xyXG4gICAgICAgICAgICBpZih0IDwgMS82KSByZXR1cm4gcCArIChxIC0gcCkgKiA2ICogdDtcclxuICAgICAgICAgICAgaWYodCA8IDEvMikgcmV0dXJuIHE7XHJcbiAgICAgICAgICAgIGlmKHQgPCAyLzMpIHJldHVybiBwICsgKHEgLSBwKSAqICgyLzMgLSB0KSAqIDY7XHJcbiAgICAgICAgICAgIHJldHVybiBwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHEgPSBsIDwgMC41ID8gbCAqICgxICsgcykgOiBsICsgcyAtIGwgKiBzO1xyXG4gICAgICAgIHZhciBwID0gMiAqIGwgLSBxO1xyXG4gICAgICAgIHIgPSBodWUycmdiKHAsIHEsIGggKyAxLzMpO1xyXG4gICAgICAgIGcgPSBodWUycmdiKHAsIHEsIGgpO1xyXG4gICAgICAgIGIgPSBodWUycmdiKHAsIHEsIGggLSAxLzMpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBbTWF0aC5yb3VuZChyICogMjU1KSwgTWF0aC5yb3VuZChnICogMjU1KSwgTWF0aC5yb3VuZChiICogMjU1KSwgMjU1XTtcclxufSIsImltcG9ydCBwNSBmcm9tICdwNSc7XHJcbmltcG9ydCB7IFJlbmRlcmFibGUgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL1JlbmRlcmFibGUnO1xyXG5pbXBvcnQgeyBFbnRpdHlQYXlsb2FkIH0gZnJvbSAnLi4vLi4vLi4vZ2xvYmFsL0VudGl0eSc7XHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgU2VydmVyRW50aXR5IGltcGxlbWVudHMgUmVuZGVyYWJsZSB7XHJcbiAgICBlbnRpdHlJZDogc3RyaW5nO1xyXG5cclxuICAgIHg6IG51bWJlciA9IDA7XHJcbiAgICB5OiBudW1iZXIgPSAwO1xyXG5cclxuICAgIHByb3RlY3RlZCBjb25zdHJ1Y3RvcihlbnRpdHlJZDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5lbnRpdHlJZCA9IGVudGl0eUlkO1xyXG4gICAgfVxyXG5cclxuICAgIGFic3RyYWN0IHVwZGF0ZURhdGEoZGF0YTogRW50aXR5UGF5bG9hZCk6IHZvaWQ7XHJcblxyXG4gICAgYWJzdHJhY3QgcmVuZGVyKHRhcmdldDogcDUsIHVwc2NhbGVTaXplOiBudW1iZXIpOiB2b2lkO1xyXG59XHJcbiIsImltcG9ydCB7IFRpbGVFbnRpdHlQYXlsb2FkIH0gZnJvbSAnLi4vLi4vLi4vZ2xvYmFsL1RpbGVFbnRpdHknO1xyXG5cclxuZXhwb3J0IHR5cGUgQ2xpZW50VGlsZUVudGl0eSA9IFRpbGVFbnRpdHlQYXlsb2FkICYge1xyXG5cdGFuaW1GcmFtZTogbnVtYmVyXHJcblx0YW5pbWF0ZTogYm9vbGVhblxyXG59XHJcblxyXG5cclxuXHJcbmV4cG9ydCBjb25zdCBUaWxlRW50aXR5QW5pbWF0aW9ucyA9IFtcclxuICAgIGZhbHNlLC8vdHJlZVxyXG5cdHRydWUsLy9kcmlsbFxyXG5cdHRydWUsLy9kcmlsbFxyXG5cdHRydWUsLy9kcmlsbFxyXG5cdHRydWUsLy9kcmlsbFxyXG5cdHRydWUsLy9kcmlsbFxyXG5cdGZhbHNlLC8vY3JhZnRpbmcgYmVuY2hcclxuXHRmYWxzZSwvL3BsYW50ZWQgc2VlZFxyXG5dIiwiaW1wb3J0IHsgZ2FtZSB9IGZyb20gXCIuLi8uLi9HYW1lXCI7XHJcbmltcG9ydCB7IFBhcnRpY2xlIH0gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvUGFydGljbGVcIjtcclxuaW1wb3J0IFNpbXBsZXhOb2lzZSBmcm9tIFwic2ltcGxleC1ub2lzZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIENvbG9yUGFydGljbGUgaW1wbGVtZW50cyBQYXJ0aWNsZSB7XHJcbiAgICBjb2xvcjogc3RyaW5nXHJcbiAgICB4OiBudW1iZXI7XHJcbiAgICB5OiBudW1iZXI7XHJcbiAgICBzaXplOiBudW1iZXI7XHJcbiAgICB4VmVsOiBudW1iZXI7XHJcbiAgICB5VmVsOiBudW1iZXI7XHJcbiAgICBncmF2aXR5OiBib29sZWFuO1xyXG4gICAgd2luZDogYm9vbGVhbjtcclxuICAgIGFnZTogbnVtYmVyO1xyXG4gICAgbGlmZXNwYW46IG51bWJlcjtcclxuICAgIG5vaXNlOiBTaW1wbGV4Tm9pc2VcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihjb2xvcjogc3RyaW5nLCBzaXplOiBudW1iZXIsIGxpZmVzcGFuOiBudW1iZXIsIHg6IG51bWJlciwgeTogbnVtYmVyLCB4VmVsPzogbnVtYmVyLCB5VmVsPzogbnVtYmVyLCBncmF2aXR5PzogYm9vbGVhbiwgd2luZD86IGJvb2xlYW4pIHtcclxuICAgICAgICB0aGlzLmNvbG9yID0gY29sb3I7XHJcbiAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICB0aGlzLnkgPSB5O1xyXG4gICAgICAgIHRoaXMueFZlbCA9IHhWZWwgfHwgMDtcclxuICAgICAgICB0aGlzLnlWZWwgPSB5VmVsIHx8IDA7XHJcbiAgICAgICAgdGhpcy5zaXplID0gc2l6ZTtcclxuICAgICAgICB0aGlzLmdyYXZpdHkgPSB0cnVlOy8vdXNpbmcgdGhlIG9yIG1vZGlmaWVyIHdpdGggYm9vbGVhbnMgY2F1c2VzIGJ1Z3M7IHRoZXJlJ3MgcHJvYmFibHkgYSBiZXR0ZXIgd2F5IHRvIGRvIHRoaXNcclxuICAgICAgICBpZiAoZ3Jhdml0eSAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB0aGlzLmdyYXZpdHkgPSBncmF2aXR5O1xyXG5cclxuICAgICAgICB0aGlzLndpbmQgPSBmYWxzZTsvL3VzaW5nIHRoZSBvciBtb2RpZmllciB3aXRoIGJvb2xlYW5zIGNhdXNlcyBidWdzOyB0aGVyZSdzIHByb2JhYmx5IGEgYmV0dGVyIHdheSB0byBkbyB0aGlzXHJcbiAgICAgICAgaWYgKHdpbmQgIT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgdGhpcy53aW5kID0gd2luZDtcclxuICAgICAgICB0aGlzLmFnZSA9IDA7XHJcbiAgICAgICAgdGhpcy5saWZlc3BhbiA9IGxpZmVzcGFuO1xyXG4gICAgICAgIHRoaXMubm9pc2UgPSBuZXcgU2ltcGxleE5vaXNlKFwiYXNkZmFzZGZhc2RmYXNcIik7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKHRhcmdldDogaW1wb3J0KFwicDVcIiksIHVwc2NhbGVTaXplOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5hZ2UgLyB0aGlzLmxpZmVzcGFuIDwgMC44KSB7Ly9pZiBpdCdzIHVuZGVyIDgwJSBvZiB0aGUgcGFydGljbGUncyBsaWZlc3BhbiwgZHJhdyBub3JtYWxseSB3aXRob3V0IGZhZGVcclxuICAgICAgICAgICAgdGFyZ2V0LmZpbGwodGhpcy5jb2xvcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Ugey8vdGhpcyBtZWFucyB0aGF0IHRoZSBwYXJ0aWNsZSBpcyBhbG1vc3QgZ29pbmcgdG8gYmUgZGVsZXRlZCwgc28gZmFkaW5nIGlzIG5lY2Vzc2FyeVxyXG4gICAgICAgICAgICBpZiAodGhpcy5jb2xvci5sZW5ndGggPT09IDcpIHsvL2lmIHRoZXJlIGlzIG5vIHRyYW5zcGFyZW5jeSBieSBkZWZhdWx0LCBqdXN0IG1hcCB0aGUgdGhpbmdzXHJcbiAgICAgICAgICAgICAgICBsZXQgdHJhbnNwYXJlbmN5U3RyaW5nID0gTWF0aC5yb3VuZCgyNTUgKiAoLTUgKiAodGhpcy5hZ2UgLyB0aGlzLmxpZmVzcGFuKSArIDUpKS50b1N0cmluZygxNikuc3Vic3RyaW5nKDAsIDIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRyYW5zcGFyZW5jeVN0cmluZz09PXVuZGVmaW5lZCB8fCB0cmFuc3BhcmVuY3lTdHJpbmcubGVuZ3RoPT09dW5kZWZpbmVkKS8vY2F0Y2ggd2hhdCBjb3VsZCBiZSBhbiBpbmZpbml0ZSBsb29wIG9yIGp1c3QgYW4gZXJyb3JcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGB1bmRlZmluZWQgdHJhbnNwYXJlbmN5IHN0cmluZyBvbiBwYXJ0aWNsZWBcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgd2hpbGUodHJhbnNwYXJlbmN5U3RyaW5nLmxlbmd0aDwyKSB7Ly9tYWtlIHN1cmUgaXQncyAyIGNoYXJhY3RlcnMgbG9uZzsgdGhpcyBzdG9wcyB0aGUgY29tcHV0ZXIgZnJvbSBpbnRlcnByZXRpbmcgI2ZmIGZmIGZmIDUgYXMgI2ZmIGZmIGZmIDU1IGluc3RlYWQgb2YgI2ZmIGZmIGZmIDA1XHJcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNwYXJlbmN5U3RyaW5nID0gXCIwXCIrdHJhbnNwYXJlbmN5U3RyaW5nO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0LmZpbGwodGhpcy5jb2xvci5zdWJzdHJpbmcoMCwgNykgKyB0cmFuc3BhcmVuY3lTdHJpbmcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Ugey8vaWYgdGhlcmUgaXMgdHJhbnNwYXJlbmN5LCBtdWx0aXBseVxyXG4gICAgICAgICAgICAgICAgbGV0IHRyYW5zcGFyZW5jeVN0cmluZyA9IE1hdGgucm91bmQocGFyc2VJbnQodGhpcy5jb2xvci5zdWJzdHJpbmcoNywgOSksIDE2KSAqICgtNSAqICh0aGlzLmFnZSAvIHRoaXMubGlmZXNwYW4pICsgNSkpLnRvU3RyaW5nKDE2KS5zdWJzdHJpbmcoMCwgMik7XHJcbiAgICAgICAgICAgICAgICBpZiAodHJhbnNwYXJlbmN5U3RyaW5nPT09dW5kZWZpbmVkIHx8IHRyYW5zcGFyZW5jeVN0cmluZy5sZW5ndGg9PT11bmRlZmluZWQpLy9jYXRjaCB3aGF0IGNvdWxkIGJlIGFuIGluZmluaXRlIGxvb3Agb3IganVzdCBhbiBlcnJvclxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcclxuICAgICAgICAgICAgICAgICAgICAgICAgYHVuZGVmaW5lZCB0cmFuc3BhcmVuY3kgc3RyaW5nIG9uIHBhcnRpY2xlYFxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSh0cmFuc3BhcmVuY3lTdHJpbmcubGVuZ3RoPDIpIHsvL21ha2Ugc3VyZSBpdCdzIDIgY2hhcmFjdGVycyBsb25nOyB0aGlzIHN0b3BzIHRoZSBjb21wdXRlciBmcm9tIGludGVycHJldGluZyAjZmYgZmYgZmYgNSBhcyAjZmYgZmYgZmYgNTUgaW5zdGVhZCBvZiAjZmYgZmYgZmYgMDVcclxuICAgICAgICAgICAgICAgICAgICB0cmFuc3BhcmVuY3lTdHJpbmcgPSBcIjBcIit0cmFuc3BhcmVuY3lTdHJpbmc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQuZmlsbCh0aGlzLmNvbG9yLnN1YnN0cmluZygwLCA3KSArIHRyYW5zcGFyZW5jeVN0cmluZyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy9kcmF3IGEgcmVjdGFuZ2xlIGNlbnRlcmVkIG9uIHRoZSB4IGFuZCB5IHBvc2l0aW9uIGZpbGxlZCB3aXRoIHRoZSBjb2xvciBvZiB0aGUgb2JqZWN0XHJcbiAgICAgICAgdGFyZ2V0LnJlY3QoXHJcbiAgICAgICAgICAgICgtdGhpcy5zaXplIC8gMiArIHRoaXMueCAqIGdhbWUuVElMRV9XSURUSCAtXHJcbiAgICAgICAgICAgICAgICBnYW1lLmludGVycG9sYXRlZENhbVggKiBnYW1lLlRJTEVfV0lEVEgpICpcclxuICAgICAgICAgICAgdXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgICgtdGhpcy5zaXplIC8gMiArIHRoaXMueSAqIGdhbWUuVElMRV9IRUlHSFQgLVxyXG4gICAgICAgICAgICAgICAgZ2FtZS5pbnRlcnBvbGF0ZWRDYW1ZICogZ2FtZS5USUxFX0hFSUdIVCkgKlxyXG4gICAgICAgICAgICB1cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgdGhpcy5zaXplICogdXBzY2FsZVNpemUgKiBnYW1lLlRJTEVfV0lEVEgsXHJcbiAgICAgICAgICAgIHRoaXMuc2l6ZSAqIHVwc2NhbGVTaXplICogZ2FtZS5USUxFX0hFSUdIVFxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgdGljaygpIHtcclxuICAgICAgICB0aGlzLmFnZSsrO1xyXG4gICAgICAgIHRoaXMueCArPSB0aGlzLnhWZWw7XHJcbiAgICAgICAgdGhpcy55ICs9IHRoaXMueVZlbDtcclxuICAgICAgICB0aGlzLnhWZWwgLT0gKE1hdGguYWJzKHRoaXMueFZlbCkgKiB0aGlzLnhWZWwgKiBnYW1lLkRSQUdfQ09FRkZJQ0lFTlQgKiB0aGlzLnNpemUpOy8vYXNzdW1pbmcgY29uc3RhbnQgbWFzcyBmb3IgZWFjaCBwYXJ0aWNsZVxyXG4gICAgICAgIGlmICh0aGlzLmdyYXZpdHkpIHtcclxuICAgICAgICAgICAgdGhpcy55VmVsICs9IGdhbWUuR1JBVklUWV9TUEVFRDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMud2luZCkge1xyXG4gICAgICAgICAgICB0aGlzLnhWZWwgKz0gdGhpcy5ub2lzZS5ub2lzZTJEKHRoaXMueC8xMCwgdGhpcy55LzEwKS80MFxyXG4gICAgICAgICAgICB0aGlzLnlWZWwgKz0gdGhpcy5ub2lzZS5ub2lzZTJEKHRoaXMueS8xMCwgdGhpcy54LzEwKS80MFxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnlWZWwgLT0gKE1hdGguYWJzKHRoaXMueVZlbCkgKiB0aGlzLnlWZWwgKiBnYW1lLkRSQUdfQ09FRkZJQ0lFTlQgKiB0aGlzLnNpemUpO1xyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCB7IEludmVudG9yeVBheWxvYWQsIEl0ZW1UeXBlIH0gZnJvbSAnLi9JbnZlbnRvcnknO1xyXG5cclxuZXhwb3J0IGVudW0gRW50aXRpZXMge1xyXG5cdExvY2FsUGxheWVyLFxyXG5cdFBsYXllcixcclxuXHRJdGVtLFxyXG5cdERyb25lLFxyXG59XHJcblxyXG50eXBlIERhdGFQYWlyczxULCBLIGV4dGVuZHMga2V5b2YgVCA9IGtleW9mIFQ+ID0gSyBleHRlbmRzIGtleW9mIFRcclxuXHQ/IHsgdHlwZTogSzsgZGF0YTogVFtLXSB9XHJcblx0OiBuZXZlcjtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgRW50aXRpZXNEYXRhIHtcclxuXHRbRW50aXRpZXMuTG9jYWxQbGF5ZXJdOiB7XHJcblx0XHRuYW1lOiBzdHJpbmc7XHJcblx0XHR4OiBudW1iZXI7XHJcblx0XHR5OiBudW1iZXI7XHJcblx0fTtcclxuXHRbRW50aXRpZXMuUGxheWVyXTogeyBuYW1lOiBzdHJpbmcgfTtcclxuXHRbRW50aXRpZXMuSXRlbV06IHsgaXRlbTogSXRlbVR5cGU7IHg6IG51bWJlcjsgeTogbnVtYmVyfTtcclxuXHRbRW50aXRpZXMuRHJvbmVdOiB7IGxldmVsOiBudW1iZXIsIHg6IG51bWJlcjsgeTogbnVtYmVyOyB4VmVsOiBudW1iZXJ9O1xyXG5cdFxyXG59XHJcblxyXG5leHBvcnQgdHlwZSBFbnRpdHlEYXRhPFQgZXh0ZW5kcyBFbnRpdGllcyA9IGtleW9mIEVudGl0aWVzRGF0YT4gPSBEYXRhUGFpcnM8XHJcblx0RW50aXRpZXNEYXRhLFxyXG5cdFRcclxuPjtcclxuXHJcbmV4cG9ydCB0eXBlIEVudGl0eVBheWxvYWQ8VCBleHRlbmRzIEVudGl0aWVzID0ga2V5b2YgRW50aXRpZXNEYXRhPiA9XHJcblx0RW50aXR5RGF0YTxUPiAmIHsgaWQ6IHN0cmluZyB9O1xyXG4iLCJpbXBvcnQgeyBUaWxlVHlwZSB9IGZyb20gJy4vVGlsZSc7XHJcbmltcG9ydCB7IFRpbGVFbnRpdGllcyB9IGZyb20gJy4vVGlsZUVudGl0eSc7XHJcblxyXG50eXBlIERhdGFQYWlyczxULCBLIGV4dGVuZHMga2V5b2YgVCA9IGtleW9mIFQ+ID0gSyBleHRlbmRzIGtleW9mIFRcclxuXHQ/IHsgdHlwZTogSyB9ICYgVFtLXVxyXG5cdDogbmV2ZXI7XHJcblxyXG5jb25zdCBpdGVtVHlwZURhdGEgPSA8RCwgVCBleHRlbmRzIFJlY29yZDxJdGVtVHlwZSwgRGF0YVBhaXJzPENhdGVnb3J5RGF0YT4+PihcclxuXHRkYXRhOiBULFxyXG4pOiBUID0+IGRhdGE7XHJcblxyXG5leHBvcnQgZW51bSBJdGVtQ2F0ZWdvcmllcyB7XHJcblx0VGlsZSxcclxuXHRSZXNvdXJjZSxcclxuXHRUb29sLFxyXG5cdFRpbGVFbnRpdHksXHJcbn1cclxuXHJcbmV4cG9ydCB0eXBlIENhdGVnb3J5RGF0YSA9IHtcclxuXHRbSXRlbUNhdGVnb3JpZXMuVGlsZV06IHsgcGxhY2VkVGlsZTogVGlsZVR5cGUsIG1heFN0YWNrU2l6ZT86IG51bWJlcn07XHJcblx0W0l0ZW1DYXRlZ29yaWVzLlJlc291cmNlXToge307XHJcblx0W0l0ZW1DYXRlZ29yaWVzLlRvb2xdOiB7IGJyZWFrYWJsZVRpbGVzOiBUaWxlVHlwZVtdfTtcclxuXHRbSXRlbUNhdGVnb3JpZXMuVGlsZUVudGl0eV06IHsgcGxhY2VkVGlsZUVudGl0eTogbnVtYmVyLCB0aWxlRW50aXR5T2Zmc2V0PzogW251bWJlciwgbnVtYmVyXX07XHJcbn07XHJcblxyXG5leHBvcnQgZW51bSBJdGVtVHlwZSB7XHJcblx0U25vd0Jsb2NrLFxyXG5cdEljZUJsb2NrLFxyXG5cdERpcnRCbG9jayxcclxuXHRTdG9uZTBCbG9jayxcclxuXHRTdG9uZTFCbG9jayxcclxuXHRTdG9uZTJCbG9jayxcclxuXHRTdG9uZTNCbG9jayxcclxuXHRTdG9uZTRCbG9jayxcclxuXHRTdG9uZTVCbG9jayxcclxuXHRTdG9uZTZCbG9jayxcclxuXHRTdG9uZTdCbG9jayxcclxuXHRTdG9uZThCbG9jayxcclxuXHRTdG9uZTlCbG9jayxcclxuXHRUaW5CbG9jayxcclxuXHRBbHVtaW51bUJsb2NrLFxyXG5cdEdvbGRCbG9jayxcclxuXHRUaXRhbml1bUJsb2NrLFxyXG5cdEdyYXBlQmxvY2ssXHJcblx0V29vZDBCbG9jayxcclxuXHRXb29kMUJsb2NrLFxyXG5cdFdvb2QyQmxvY2ssXHJcblx0V29vZDNCbG9jayxcclxuXHRXb29kNEJsb2NrLFxyXG5cdFdvb2Q1QmxvY2ssXHJcblx0V29vZDZCbG9jayxcclxuXHRXb29kN0Jsb2NrLFxyXG5cdFdvb2Q4QmxvY2ssXHJcblx0V29vZDlCbG9jayxcclxuXHRTZWVkLFxyXG59XHJcblxyXG5leHBvcnQgdHlwZSBJdGVtU3RhY2sgPSB7XHJcblx0cXVhbnRpdHk6IG51bWJlcjtcclxuXHRpdGVtOiBJdGVtVHlwZTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBJdGVtcyA9IGl0ZW1UeXBlRGF0YSh7XHJcblx0W0l0ZW1UeXBlLlNub3dCbG9ja106IHtcclxuXHRcdHR5cGU6IEl0ZW1DYXRlZ29yaWVzLlRpbGUsXHJcblx0XHRwbGFjZWRUaWxlOiBUaWxlVHlwZS5Tbm93LFxyXG5cdH0sXHJcblx0W0l0ZW1UeXBlLkljZUJsb2NrXToge1xyXG5cdFx0dHlwZTogSXRlbUNhdGVnb3JpZXMuVGlsZSxcclxuXHRcdHBsYWNlZFRpbGU6IFRpbGVUeXBlLkljZSxcclxuXHR9LFxyXG5cdFtJdGVtVHlwZS5EaXJ0QmxvY2tdOiB7XHJcblx0XHR0eXBlOiBJdGVtQ2F0ZWdvcmllcy5UaWxlLFxyXG5cdFx0cGxhY2VkVGlsZTogVGlsZVR5cGUuRGlydCxcclxuXHR9LFxyXG5cdFtJdGVtVHlwZS5TdG9uZTBCbG9ja106IHtcclxuXHRcdHR5cGU6IEl0ZW1DYXRlZ29yaWVzLlRpbGUsXHJcblx0XHRwbGFjZWRUaWxlOiBUaWxlVHlwZS5TdG9uZTAsXHJcblx0fSxcclxuXHRbSXRlbVR5cGUuU3RvbmUxQmxvY2tdOiB7XHJcblx0XHR0eXBlOiBJdGVtQ2F0ZWdvcmllcy5UaWxlLFxyXG5cdFx0cGxhY2VkVGlsZTogVGlsZVR5cGUuU3RvbmUxLFxyXG5cdH0sXHJcblx0W0l0ZW1UeXBlLlN0b25lMkJsb2NrXToge1xyXG5cdFx0dHlwZTogSXRlbUNhdGVnb3JpZXMuVGlsZSxcclxuXHRcdHBsYWNlZFRpbGU6IFRpbGVUeXBlLlN0b25lMixcclxuXHR9LFxyXG5cdFtJdGVtVHlwZS5TdG9uZTNCbG9ja106IHtcclxuXHRcdHR5cGU6IEl0ZW1DYXRlZ29yaWVzLlRpbGUsXHJcblx0XHRwbGFjZWRUaWxlOiBUaWxlVHlwZS5TdG9uZTMsXHJcblx0fSxcclxuXHRbSXRlbVR5cGUuU3RvbmU0QmxvY2tdOiB7XHJcblx0XHR0eXBlOiBJdGVtQ2F0ZWdvcmllcy5UaWxlLFxyXG5cdFx0cGxhY2VkVGlsZTogVGlsZVR5cGUuU3RvbmU0LFxyXG5cdH0sXHJcblx0W0l0ZW1UeXBlLlN0b25lNUJsb2NrXToge1xyXG5cdFx0dHlwZTogSXRlbUNhdGVnb3JpZXMuVGlsZSxcclxuXHRcdHBsYWNlZFRpbGU6IFRpbGVUeXBlLlN0b25lNSxcclxuXHR9LFxyXG5cdFtJdGVtVHlwZS5TdG9uZTZCbG9ja106IHtcclxuXHRcdHR5cGU6IEl0ZW1DYXRlZ29yaWVzLlRpbGUsXHJcblx0XHRwbGFjZWRUaWxlOiBUaWxlVHlwZS5TdG9uZTYsXHJcblx0fSxcclxuXHRbSXRlbVR5cGUuU3RvbmU3QmxvY2tdOiB7XHJcblx0XHR0eXBlOiBJdGVtQ2F0ZWdvcmllcy5UaWxlLFxyXG5cdFx0cGxhY2VkVGlsZTogVGlsZVR5cGUuU3RvbmU3LFxyXG5cdH0sXHJcblx0W0l0ZW1UeXBlLlN0b25lOEJsb2NrXToge1xyXG5cdFx0dHlwZTogSXRlbUNhdGVnb3JpZXMuVGlsZSxcclxuXHRcdHBsYWNlZFRpbGU6IFRpbGVUeXBlLlN0b25lOCxcclxuXHR9LFxyXG5cdFtJdGVtVHlwZS5TdG9uZTlCbG9ja106IHtcclxuXHRcdHR5cGU6IEl0ZW1DYXRlZ29yaWVzLlRpbGUsXHJcblx0XHRwbGFjZWRUaWxlOiBUaWxlVHlwZS5TdG9uZTksXHJcblx0fSxcclxuXHRbSXRlbVR5cGUuVGluQmxvY2tdOiB7XHJcblx0XHR0eXBlOiBJdGVtQ2F0ZWdvcmllcy5UaWxlLFxyXG5cdFx0cGxhY2VkVGlsZTogVGlsZVR5cGUuVGluLFxyXG5cdH0sXHJcblx0W0l0ZW1UeXBlLkFsdW1pbnVtQmxvY2tdOiB7XHJcblx0XHR0eXBlOiBJdGVtQ2F0ZWdvcmllcy5UaWxlLFxyXG5cdFx0cGxhY2VkVGlsZTogVGlsZVR5cGUuQWx1bWludW0sXHJcblx0fSxcclxuXHRbSXRlbVR5cGUuR29sZEJsb2NrXToge1xyXG5cdFx0dHlwZTogSXRlbUNhdGVnb3JpZXMuVGlsZSxcclxuXHRcdHBsYWNlZFRpbGU6IFRpbGVUeXBlLkdvbGQsXHJcblx0fSxcclxuXHRbSXRlbVR5cGUuVGl0YW5pdW1CbG9ja106IHtcclxuXHRcdHR5cGU6IEl0ZW1DYXRlZ29yaWVzLlRpbGUsXHJcblx0XHRwbGFjZWRUaWxlOiBUaWxlVHlwZS5UaXRhbml1bSxcclxuXHR9LFxyXG5cdFtJdGVtVHlwZS5HcmFwZUJsb2NrXToge1xyXG5cdFx0dHlwZTogSXRlbUNhdGVnb3JpZXMuVGlsZSxcclxuXHRcdHBsYWNlZFRpbGU6IFRpbGVUeXBlLkdyYXBlLFxyXG5cdH0sXHJcblx0W0l0ZW1UeXBlLldvb2QwQmxvY2tdOiB7XHJcblx0XHR0eXBlOiBJdGVtQ2F0ZWdvcmllcy5UaWxlLFxyXG5cdFx0cGxhY2VkVGlsZTogVGlsZVR5cGUuV29vZDAsXHJcblx0fSxcclxuXHRbSXRlbVR5cGUuV29vZDFCbG9ja106IHtcclxuXHRcdHR5cGU6IEl0ZW1DYXRlZ29yaWVzLlRpbGUsXHJcblx0XHRwbGFjZWRUaWxlOiBUaWxlVHlwZS5Xb29kMSxcclxuXHR9LFxyXG5cdFtJdGVtVHlwZS5Xb29kMkJsb2NrXToge1xyXG5cdFx0dHlwZTogSXRlbUNhdGVnb3JpZXMuVGlsZSxcclxuXHRcdHBsYWNlZFRpbGU6IFRpbGVUeXBlLldvb2QyLFxyXG5cdH0sXHJcblx0W0l0ZW1UeXBlLldvb2QzQmxvY2tdOiB7XHJcblx0XHR0eXBlOiBJdGVtQ2F0ZWdvcmllcy5UaWxlLFxyXG5cdFx0cGxhY2VkVGlsZTogVGlsZVR5cGUuV29vZDMsXHJcblx0fSxcclxuXHRbSXRlbVR5cGUuV29vZDRCbG9ja106IHtcclxuXHRcdHR5cGU6IEl0ZW1DYXRlZ29yaWVzLlRpbGUsXHJcblx0XHRwbGFjZWRUaWxlOiBUaWxlVHlwZS5Xb29kNCxcclxuXHR9LFxyXG5cdFtJdGVtVHlwZS5Xb29kNUJsb2NrXToge1xyXG5cdFx0dHlwZTogSXRlbUNhdGVnb3JpZXMuVGlsZSxcclxuXHRcdHBsYWNlZFRpbGU6IFRpbGVUeXBlLldvb2Q1LFxyXG5cdH0sXHJcblx0W0l0ZW1UeXBlLldvb2Q2QmxvY2tdOiB7XHJcblx0XHR0eXBlOiBJdGVtQ2F0ZWdvcmllcy5UaWxlLFxyXG5cdFx0cGxhY2VkVGlsZTogVGlsZVR5cGUuV29vZDYsXHJcblx0fSxcclxuXHRbSXRlbVR5cGUuV29vZDdCbG9ja106IHtcclxuXHRcdHR5cGU6IEl0ZW1DYXRlZ29yaWVzLlRpbGUsXHJcblx0XHRwbGFjZWRUaWxlOiBUaWxlVHlwZS5Xb29kNyxcclxuXHR9LFxyXG5cdFtJdGVtVHlwZS5Xb29kOEJsb2NrXToge1xyXG5cdFx0dHlwZTogSXRlbUNhdGVnb3JpZXMuVGlsZSxcclxuXHRcdHBsYWNlZFRpbGU6IFRpbGVUeXBlLldvb2Q4LFxyXG5cdH0sXHJcblx0W0l0ZW1UeXBlLldvb2Q5QmxvY2tdOiB7XHJcblx0XHR0eXBlOiBJdGVtQ2F0ZWdvcmllcy5UaWxlLFxyXG5cdFx0cGxhY2VkVGlsZTogVGlsZVR5cGUuV29vZDksXHJcblx0fSxcclxuXHRbSXRlbVR5cGUuU2VlZF06IHtcclxuXHRcdHR5cGU6IEl0ZW1DYXRlZ29yaWVzLlRpbGVFbnRpdHksXHJcblx0XHRwbGFjZWRUaWxlRW50aXR5OiBUaWxlRW50aXRpZXMuU2VlZCxcclxuXHRcdHRpbGVFbnRpdHlPZmZzZXQ6IFstMSwgLTZdLFxyXG5cdH0sXHJcblx0Ly8gW0l0ZW1UeXBlLlRpblBpY2theGVdOiB7XHJcblx0Ly8gXHR0eXBlOiBJdGVtQ2F0ZWdvcmllcy5Ub29sLFxyXG5cdC8vIFx0YnJlYWthYmxlVGlsZXM6IFtUaWxlVHlwZS5Tbm93LCBUaWxlVHlwZS5JY2UsIFRpbGVUeXBlLkRpcnQsIFRpbGVUeXBlLldvb2QwLCBUaWxlVHlwZS5TdG9uZTAsIFRpbGVUeXBlLlN0b25lMSwgVGlsZVR5cGUuVGluLCBUaWxlVHlwZS5BbHVtaW51bV1cclxuXHQvLyB9XHJcbn0pO1xyXG5cclxuZXhwb3J0IHR5cGUgSW52ZW50b3J5VXBkYXRlUGF5bG9hZCA9IHtcclxuXHRzbG90OiBudW1iZXI7XHJcblx0aXRlbTogSXRlbVN0YWNrIHwgdW5kZWZpbmVkO1xyXG59W107XHJcblxyXG5leHBvcnQgdHlwZSBJbnZlbnRvcnlQYXlsb2FkID0ge1xyXG5cdGl0ZW1zOiAoSXRlbVN0YWNrIHwgdW5kZWZpbmVkKVtdO1xyXG5cclxuXHR3aWR0aDogbnVtYmVyO1xyXG5cdGhlaWdodDogbnVtYmVyO1xyXG59O1xyXG4iLCJleHBvcnQgZW51bSBUaWxlVHlwZSB7XHJcblx0QWlyLFxyXG5cdFNub3csXHJcblx0SWNlLFxyXG5cdERpcnQsXHJcblx0U3RvbmUwLFxyXG5cdFN0b25lMSxcclxuXHRTdG9uZTIsXHJcblx0U3RvbmUzLFxyXG5cdFN0b25lNCxcclxuXHRTdG9uZTUsXHJcblx0U3RvbmU2LFxyXG5cdFN0b25lNyxcclxuXHRTdG9uZTgsXHJcblx0U3RvbmU5LFxyXG5cdFRpbixcclxuXHRBbHVtaW51bSxcclxuXHRHb2xkLFxyXG5cdFRpdGFuaXVtLFxyXG5cdEdyYXBlLFxyXG5cdFdvb2QwLFxyXG5cdFdvb2QxLFxyXG5cdFdvb2QyLFxyXG5cdFdvb2QzLFxyXG5cdFdvb2Q0LFxyXG5cdFdvb2Q1LFxyXG5cdFdvb2Q2LFxyXG5cdFdvb2Q3LFxyXG5cdFdvb2Q4LFxyXG5cdFdvb2Q5LFxyXG59IiwiZXhwb3J0IGVudW0gVGlsZUVudGl0aWVzIHtcclxuXHRUcmVlLFxyXG5cdFRpZXIxRHJpbGwsXHJcblx0VGllcjJEcmlsbCxcclxuXHRUaWVyM0RyaWxsLFxyXG5cdFRpZXI0RHJpbGwsXHJcblx0VGllcjVEcmlsbCxcclxuXHRDcmFmdGluZ0JlbmNoLFxyXG5cdFNlZWQsXHJcbn1cclxuXHJcbnR5cGUgRGF0YVBhaXJzPFQsIEsgZXh0ZW5kcyBrZXlvZiBUID0ga2V5b2YgVD4gPSBLIGV4dGVuZHMga2V5b2YgVFxyXG5cdD8geyB0eXBlXzogSzsgZGF0YTogVFtLXSB9XHJcblx0OiBuZXZlcjtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgVGlsZUVudGl0aWVzRGF0YSB7XHJcblx0W1RpbGVFbnRpdGllcy5UcmVlXTogeyB3b29kQ291bnQ6IG51bWJlcjsgc2VlZENvdW50OiBudW1iZXIgfTtcclxuXHRbVGlsZUVudGl0aWVzLlRpZXIxRHJpbGxdOiB7ICB9O1xyXG5cdFtUaWxlRW50aXRpZXMuVGllcjJEcmlsbF06IHsgIH07XHJcblx0W1RpbGVFbnRpdGllcy5UaWVyM0RyaWxsXTogeyAgfTtcclxuXHRbVGlsZUVudGl0aWVzLlRpZXI0RHJpbGxdOiB7ICB9O1xyXG5cdFtUaWxlRW50aXRpZXMuVGllcjVEcmlsbF06IHsgIH07XHJcblx0W1RpbGVFbnRpdGllcy5DcmFmdGluZ0JlbmNoXTogeyAgfTtcclxuXHRbVGlsZUVudGl0aWVzLlNlZWRdOiB7ICB9O1xyXG59XHJcblxyXG5leHBvcnQgdHlwZSBUaWxlRW50aXR5RGF0YSA9IERhdGFQYWlyczxUaWxlRW50aXRpZXNEYXRhPiAmIHt9XHJcblxyXG5leHBvcnQgdHlwZSBUaWxlRW50aXR5UGF5bG9hZCA9IHtcclxuXHRpZDogc3RyaW5nO1xyXG5cdGNvdmVyZWRUaWxlczogbnVtYmVyW107XHJcblx0cmVmbGVjdGVkVGlsZXM6IG51bWJlcltdO1xyXG5cdHBheWxvYWQ6IFRpbGVFbnRpdHlEYXRhO1xyXG59O1xyXG5cclxuZXhwb3J0IGVudW0gVGlsZUVudGl0eVRleHR1cmVzIHtcclxuXHRUcmVlMSxcclxuXHRUcmVlMixcclxuXHRUcmVlMyxcclxuXHRUcmVlNCxcclxuXHRUcmVlNSxcclxuXHRUcmVlNixcclxuXHRUcmVlNyxcclxuXHRUcmVlOCxcclxuXHRUcmVlOSxcclxuXHRUcmVlMTAsXHJcbn1cclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbi8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBfX3dlYnBhY2tfbW9kdWxlc19fO1xuXG4iLCJ2YXIgZGVmZXJyZWQgPSBbXTtcbl9fd2VicGFja19yZXF1aXJlX18uTyA9IChyZXN1bHQsIGNodW5rSWRzLCBmbiwgcHJpb3JpdHkpID0+IHtcblx0aWYoY2h1bmtJZHMpIHtcblx0XHRwcmlvcml0eSA9IHByaW9yaXR5IHx8IDA7XG5cdFx0Zm9yKHZhciBpID0gZGVmZXJyZWQubGVuZ3RoOyBpID4gMCAmJiBkZWZlcnJlZFtpIC0gMV1bMl0gPiBwcmlvcml0eTsgaS0tKSBkZWZlcnJlZFtpXSA9IGRlZmVycmVkW2kgLSAxXTtcblx0XHRkZWZlcnJlZFtpXSA9IFtjaHVua0lkcywgZm4sIHByaW9yaXR5XTtcblx0XHRyZXR1cm47XG5cdH1cblx0dmFyIG5vdEZ1bGZpbGxlZCA9IEluZmluaXR5O1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IGRlZmVycmVkLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIFtjaHVua0lkcywgZm4sIHByaW9yaXR5XSA9IGRlZmVycmVkW2ldO1xuXHRcdHZhciBmdWxmaWxsZWQgPSB0cnVlO1xuXHRcdGZvciAodmFyIGogPSAwOyBqIDwgY2h1bmtJZHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdGlmICgocHJpb3JpdHkgJiAxID09PSAwIHx8IG5vdEZ1bGZpbGxlZCA+PSBwcmlvcml0eSkgJiYgT2JqZWN0LmtleXMoX193ZWJwYWNrX3JlcXVpcmVfXy5PKS5ldmVyeSgoa2V5KSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXy5PW2tleV0oY2h1bmtJZHNbal0pKSkpIHtcblx0XHRcdFx0Y2h1bmtJZHMuc3BsaWNlKGotLSwgMSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmdWxmaWxsZWQgPSBmYWxzZTtcblx0XHRcdFx0aWYocHJpb3JpdHkgPCBub3RGdWxmaWxsZWQpIG5vdEZ1bGZpbGxlZCA9IHByaW9yaXR5O1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihmdWxmaWxsZWQpIHtcblx0XHRcdGRlZmVycmVkLnNwbGljZShpLS0sIDEpXG5cdFx0XHR2YXIgciA9IGZuKCk7XG5cdFx0XHRpZiAociAhPT0gdW5kZWZpbmVkKSByZXN1bHQgPSByO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gcmVzdWx0O1xufTsiLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18uZyA9IChmdW5jdGlvbigpIHtcblx0aWYgKHR5cGVvZiBnbG9iYWxUaGlzID09PSAnb2JqZWN0JykgcmV0dXJuIGdsb2JhbFRoaXM7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIHRoaXMgfHwgbmV3IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHJldHVybiB3aW5kb3c7XG5cdH1cbn0pKCk7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIG5vIGJhc2VVUklcblxuLy8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3Ncbi8vIHVuZGVmaW5lZCA9IGNodW5rIG5vdCBsb2FkZWQsIG51bGwgPSBjaHVuayBwcmVsb2FkZWQvcHJlZmV0Y2hlZFxuLy8gW3Jlc29sdmUsIHJlamVjdCwgUHJvbWlzZV0gPSBjaHVuayBsb2FkaW5nLCAwID0gY2h1bmsgbG9hZGVkXG52YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuXHRcIm1haW5cIjogMFxufTtcblxuLy8gbm8gY2h1bmsgb24gZGVtYW5kIGxvYWRpbmdcblxuLy8gbm8gcHJlZmV0Y2hpbmdcblxuLy8gbm8gcHJlbG9hZGVkXG5cbi8vIG5vIEhNUlxuXG4vLyBubyBITVIgbWFuaWZlc3RcblxuX193ZWJwYWNrX3JlcXVpcmVfXy5PLmogPSAoY2h1bmtJZCkgPT4gKGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9PT0gMCk7XG5cbi8vIGluc3RhbGwgYSBKU09OUCBjYWxsYmFjayBmb3IgY2h1bmsgbG9hZGluZ1xudmFyIHdlYnBhY2tKc29ucENhbGxiYWNrID0gKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uLCBkYXRhKSA9PiB7XG5cdHZhciBbY2h1bmtJZHMsIG1vcmVNb2R1bGVzLCBydW50aW1lXSA9IGRhdGE7XG5cdC8vIGFkZCBcIm1vcmVNb2R1bGVzXCIgdG8gdGhlIG1vZHVsZXMgb2JqZWN0LFxuXHQvLyB0aGVuIGZsYWcgYWxsIFwiY2h1bmtJZHNcIiBhcyBsb2FkZWQgYW5kIGZpcmUgY2FsbGJhY2tcblx0dmFyIG1vZHVsZUlkLCBjaHVua0lkLCBpID0gMDtcblx0aWYoY2h1bmtJZHMuc29tZSgoaWQpID0+IChpbnN0YWxsZWRDaHVua3NbaWRdICE9PSAwKSkpIHtcblx0XHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcblx0XHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XG5cdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18ubVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKHJ1bnRpbWUpIHZhciByZXN1bHQgPSBydW50aW1lKF9fd2VicGFja19yZXF1aXJlX18pO1xuXHR9XG5cdGlmKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKSBwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbihkYXRhKTtcblx0Zm9yKDtpIDwgY2h1bmtJZHMubGVuZ3RoOyBpKyspIHtcblx0XHRjaHVua0lkID0gY2h1bmtJZHNbaV07XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGluc3RhbGxlZENodW5rcywgY2h1bmtJZCkgJiYgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKSB7XG5cdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF1bMF0oKTtcblx0XHR9XG5cdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gMDtcblx0fVxuXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHJlc3VsdCk7XG59XG5cbnZhciBjaHVua0xvYWRpbmdHbG9iYWwgPSBzZWxmW1wid2VicGFja0NodW5rc25vd2VkX2luXCJdID0gc2VsZltcIndlYnBhY2tDaHVua3Nub3dlZF9pblwiXSB8fCBbXTtcbmNodW5rTG9hZGluZ0dsb2JhbC5mb3JFYWNoKHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgMCkpO1xuY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2ggPSB3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIGNodW5rTG9hZGluZ0dsb2JhbC5wdXNoLmJpbmQoY2h1bmtMb2FkaW5nR2xvYmFsKSk7IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBkZXBlbmRzIG9uIG90aGVyIGxvYWRlZCBjaHVua3MgYW5kIGV4ZWN1dGlvbiBuZWVkIHRvIGJlIGRlbGF5ZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHVuZGVmaW5lZCwgW1wibW9kdWxlcy1tYWluXCJdLCAoKSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2NsaWVudC9HYW1lLnRzXCIpKSlcbl9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8oX193ZWJwYWNrX2V4cG9ydHNfXyk7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=