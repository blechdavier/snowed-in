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
        // AudioAssets.ambient.winter1.playSound();
        this.particleMultiplier = 1;
        this.skyToggle = true;
        this.skyMod = 2;
        this.particles = [];
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
        }
        // do the tick calculations
        this.doTicks();
        // update mouse position
        this.updateMouse();
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
        if (this.world !== undefined)
            this.world.render(this, this.upscaleSize);
        // render the player, all items, etc.
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
        this.tint(255, 150); //make image translucent
        _assets_Assets__WEBPACK_IMPORTED_MODULE_1__.UiAssets.vignette.render(this, 0, 0, this.width, this.height);
        this.noTint();
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
                        this.tint(255, 127);
                        this.fill(0, 127);
                    }
                    _assets_Assets__WEBPACK_IMPORTED_MODULE_1__.ItemAssets[currentItem.item].render(this, 6 * this.upscaleSize + 16 * i * this.upscaleSize, 6 * this.upscaleSize, 8 * this.upscaleSize, 8 * this.upscaleSize);
                    _assets_Assets__WEBPACK_IMPORTED_MODULE_1__.Fonts.tom_thumb.drawText(this, currentItem.quantity.toString(), (-4 * currentItem.quantity.toString().length + 16 * (i + 1.0625)) * this.upscaleSize, 11 * this.upscaleSize);
                    // this.text(
                    // 	currentItem.quantity,
                    // 	16 * this.upscaleSize + 16 * i * this.upscaleSize,
                    // 	16 * this.upscaleSize,
                    // );
                    this.noTint();
                }
            }
            // draw the cursor
            this.drawCursor();
        }
        if (this.currentUi !== undefined)
            this.currentUi.render(this, this.upscaleSize);
        if (this.currentUi !== undefined)
            this.currentUi.render(this, this.upscaleSize);
        _assets_Assets__WEBPACK_IMPORTED_MODULE_1__.Fonts.tom_thumb.drawText(this, "Snowed In v1.0.0", this.upscaleSize, this.height - 6 * this.upscaleSize);
        // console.timeEnd("frame");
    }
    windowResized() {
        this.resizeCanvas(this.windowWidth, this.windowHeight);
        this.skyLayer.resizeCanvas(this.windowWidth, this.windowHeight);
        // go for a scale of <48 tiles screen
        this.upscaleSize = Math.min(Math.ceil(this.windowWidth / 48 / this.TILE_WIDTH), Math.ceil(this.windowHeight / 48 / this.TILE_HEIGHT));
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
            this.world.inventory.worldClick(this.worldMouseX, this.worldMouseY);
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
        //mouseEvent apparently doesn't have a delta property sooooo idk what to do sorry for the any type
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
            for (let i = 0; i < 1 * this.particleMultiplier; i++) {
                let k = Object.keys(this.world.tileEntities);
                let r = this.world.tileEntities[k[Math.floor(Math.random() * k.length)]];
                if (r.type_ === _global_TileEntity__WEBPACK_IMPORTED_MODULE_9__.TileEntities.Tree) {
                    let t = r.coveredTiles[Math.floor(Math.random() * r.coveredTiles.length)];
                    this.particles.push(new _world_particles_ColorParticle__WEBPACK_IMPORTED_MODULE_8__.ColorParticle("#348965", Math.random() * 0.1 + 0.1, 20, t % this.world.width + Math.random(), Math.floor(t / this.world.width) + Math.random(), 0.1 * (Math.random() - 0.5), 0.06 * (Math.random() - 0.7), false));
                }
            }
        }
        for (let particle of this.particles) {
            particle.tick();
        }
        if (this.world.player === undefined)
            return;
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
                    this.text(_world_WorldTiles__WEBPACK_IMPORTED_MODULE_6__.WorldTiles[selectedTile].name, this.mouseX, this.mouseY); //JANKY ALERT
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
                console.log(entities);
                let tileEntities2 = {};
                tileEntities.forEach((tileEntity) => {
                    console.log("adding tile entity: " + tileEntity.id);
                    tileEntities2[tileEntity.id] = { id: tileEntity.id, coveredTiles: tileEntity.coveredTiles, type_: tileEntity.payload.type_, data: tileEntity.payload.data, animFrame: tileEntity.payload.animFrame, animate: tileEntity.payload.animate };
                });
                this.game.world = new _world_World__WEBPACK_IMPORTED_MODULE_0__.World(width, height, tiles, tileEntities2);
                this.game.world.inventory = new _player_Inventory__WEBPACK_IMPORTED_MODULE_3__.Inventory(inventory);
                this.game.world.player = new _player_PlayerLocal__WEBPACK_IMPORTED_MODULE_2__.PlayerLocal(player);
                entities.forEach((entity) => {
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
                updatedTiles.forEach((tile) => {
                    this.game.world.updateTile(tile.tileIndex, tile.tile);
                });
            });
            this.game.connection.on('inventoryUpdate', (updates) => {
                // If the world is not set
                if (this.game.world === undefined)
                    return;
                updates.forEach((update) => {
                    console.log(update);
                    this.game.world.inventory.items[update.slot] = update.item;
                });
            });
        }
        // Player events
        {
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
                this.game.world.entities[entityData.id] = new _world_entities_EntityClasses__WEBPACK_IMPORTED_MODULE_1__.EntityClasses[entityData.type](entityData);
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








const PlayerAnimations = {
    idle: [
        new _resources_ReflectedImageResource__WEBPACK_IMPORTED_MODULE_6__.ReflectableImageResource('assets/textures/player/snowman.png'),
    ],
};
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
        tileset_wood0: new _resources_TileResource__WEBPACK_IMPORTED_MODULE_0__.TileResource('assets/textures/world/middleground/wood0.png', 1, 1, 8, 8),
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
            new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/world/tileEntities/trees/Tree1.png'),
            new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/world/tileEntities/trees/Tree2.png'),
            new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/world/tileEntities/trees/Tree3.png'),
            new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/world/tileEntities/trees/Tree4.png'),
            new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/world/tileEntities/trees/Tree5.png'),
            new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/world/tileEntities/trees/Tree6.png'),
            new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/world/tileEntities/trees/Tree7.png'),
            new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/world/tileEntities/trees/Tree8.png'),
            new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/world/tileEntities/trees/Tree9.png'),
            new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/world/tileEntities/trees/Tree10.png'),
        ],
        [
            new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/world/tileEntities/Rusty Drill/RustyDrill1.png'),
            new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/world/tileEntities/Rusty Drill/RustyDrill2.png'),
            new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/world/tileEntities/Rusty Drill/RustyDrill3.png'),
            new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/world/tileEntities/Rusty Drill/RustyDrill4.png'),
            new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/world/tileEntities/Rusty Drill/RustyDrill5.png'),
            new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/world/tileEntities/Rusty Drill/RustyDrill6.png'),
            new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/world/tileEntities/Rusty Drill/RustyDrill7.png'),
            new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/world/tileEntities/Rusty Drill/RustyDrill8.png'),
            new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/world/tileEntities/Rusty Drill/RustyDrill9.png'),
            new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/world/tileEntities/Rusty Drill/RustyDrill10.png'),
            new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/world/tileEntities/Rusty Drill/RustyDrill11.png'),
            new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/world/tileEntities/Rusty Drill/RustyDrill12.png'),
            new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/world/tileEntities/Rusty Drill/RustyDrill13.png'),
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
            new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/world/tileEntities/misc/craftingBench.png'),
        ],
        [
            new _resources_ImageResource__WEBPACK_IMPORTED_MODULE_1__.ImageResource('assets/textures/world/tileEntities/trees/sapling.png'),
        ]
    ],
    entities: {
        entity_t1drone: [
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
    }
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
    }, `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz[\\]^ !"#$%&'()*+,-./0123456789:;<=>?`, 5),
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
        let xOffset = 0;
        for (let i = 0; i < str.length; i++) {
            this.renderPartial(target, x + xOffset * _Game__WEBPACK_IMPORTED_MODULE_1__.game.upscaleSize, y, this.alphabet_soup[str[i]].w * _Game__WEBPACK_IMPORTED_MODULE_1__.game.upscaleSize, this.alphabet_soup[str[i]].h * _Game__WEBPACK_IMPORTED_MODULE_1__.game.upscaleSize, this.alphabet_soup[str[i]].x, this.alphabet_soup[str[i]].y, this.alphabet_soup[str[i]].w, this.alphabet_soup[str[i]].h);
            xOffset += this.alphabet_soup[str[i]].w + 1;
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
    constructor(path) {
        super(path);
        this.hasReflection = false;
    }
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
    renderWorldspaceReflection(x, y, width, height) {
        return;
        if (this.image === undefined)
            throw new Error(`Tried to render reflection of image before loading it: ${this.path}`);
        if (!this.hasReflection) { //this is so it doesn't load them all at once and instead makes the reflections when they are needed
            this.hasReflection = true;
            this.reflection = _Game__WEBPACK_IMPORTED_MODULE_1__.game.createImage(this.image.width, this.image.height);
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
        _Game__WEBPACK_IMPORTED_MODULE_1__.game.fill(255, 0, 0);
        _Game__WEBPACK_IMPORTED_MODULE_1__.game.stroke(150, 0, 0);
        //loop through every tile it passes through
        for (let i = Math.floor(x); i < x + width; i++) {
            for (let j = Math.floor(y); j < y + height; j++) {
                // console.log(target.world.worldTiles);
                let currentBlock = _Game__WEBPACK_IMPORTED_MODULE_1__.game.world.worldTiles[j * _Game__WEBPACK_IMPORTED_MODULE_1__.game.worldWidth + i];
                if (currentBlock === undefined || typeof currentBlock === "string" || currentBlock == _global_Tile__WEBPACK_IMPORTED_MODULE_2__.TileType.Air) { //the reference to TileEntity can be removed as soon as the better system is in place
                    continue;
                }
                _Game__WEBPACK_IMPORTED_MODULE_1__.game.tint(255, 150); //TODO make it somewhat translucent based on the reflectivity of the tile
                _Game__WEBPACK_IMPORTED_MODULE_1__.game.image(this.reflection, (i * _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_WIDTH -
                    _Game__WEBPACK_IMPORTED_MODULE_1__.game.interpolatedCamX * _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_WIDTH) *
                    _Game__WEBPACK_IMPORTED_MODULE_1__.game.upscaleSize, (j * _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_HEIGHT -
                    _Game__WEBPACK_IMPORTED_MODULE_1__.game.interpolatedCamY * _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_HEIGHT) *
                    _Game__WEBPACK_IMPORTED_MODULE_1__.game.upscaleSize, _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_WIDTH * _Game__WEBPACK_IMPORTED_MODULE_1__.game.upscaleSize, _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_HEIGHT * _Game__WEBPACK_IMPORTED_MODULE_1__.game.upscaleSize, (i - x) * _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_WIDTH, (j - y) * _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_HEIGHT, _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_WIDTH, _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_HEIGHT);
                _Game__WEBPACK_IMPORTED_MODULE_1__.game.noTint();
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
}
const ItemActions = {
    [_global_Inventory__WEBPACK_IMPORTED_MODULE_0__.ItemCategories.Tile]: {
        worldClick(x, y) {
            // If the tile isn't air
            if (_Game__WEBPACK_IMPORTED_MODULE_2__.game.world.worldTiles[_Game__WEBPACK_IMPORTED_MODULE_2__.game.world.width * y + x] !== _global_Tile__WEBPACK_IMPORTED_MODULE_1__.TileType.Air) {
                let tileBeingBroken = _Game__WEBPACK_IMPORTED_MODULE_2__.game.world.worldTiles[_Game__WEBPACK_IMPORTED_MODULE_2__.game.world.width * y + x];
                if (typeof tileBeingBroken === 'number') { //tile is tile
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
            //if the tile is air
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
        this.height = 20 / _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_HEIGHT;
        // Local data
        this.xVel = 0;
        this.yVel = 0;
        this.pXVel = 0;
        this.pYVel = 0;
        this.grounded = false;
        this.pGrounded = false;
        this.mass = this.width * this.height;
        this.currentAnimation = "idle";
        this.animFrame = 0;
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
        _assets_Assets__WEBPACK_IMPORTED_MODULE_3__.PlayerAnimations[this.currentAnimation][this.animFrame].render(target, Math.round((this.interpolatedX * _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_WIDTH -
            _Game__WEBPACK_IMPORTED_MODULE_1__.game.interpolatedCamX * _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_WIDTH) *
            upscaleSize), Math.round((this.interpolatedY * _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_HEIGHT -
            _Game__WEBPACK_IMPORTED_MODULE_1__.game.interpolatedCamY * _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_HEIGHT) *
            upscaleSize), this.width * upscaleSize * _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_WIDTH, this.height * upscaleSize * _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_HEIGHT);
        _assets_Assets__WEBPACK_IMPORTED_MODULE_3__.PlayerAnimations[this.currentAnimation][this.animFrame].renderWorldspaceReflection(this.interpolatedX, this.interpolatedY + this.height, this.width, this.height);
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
                if (currentBlock !== _global_Tile__WEBPACK_IMPORTED_MODULE_4__.TileType.Air && typeof currentBlock !== 'string') {
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
                    if (currentBlock !== _global_Tile__WEBPACK_IMPORTED_MODULE_4__.TileType.Air && typeof currentBlock !== "string") {
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

/***/ "./src/client/ui/Slider.ts":
/*!*********************************!*\
  !*** ./src/client/ui/Slider.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Slider": () => (/* binding */ Slider)
/* harmony export */ });
/* harmony import */ var _assets_Assets__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../assets/Assets */ "./src/client/assets/Assets.ts");
/* harmony import */ var _Game__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Game */ "./src/client/Game.ts");


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
        _assets_Assets__WEBPACK_IMPORTED_MODULE_0__.UiAssets.slider_bar.renderPartial(target, x, y - 2 * upscaleSize, 2 * upscaleSize, 4 * upscaleSize, 0, 0, 2, 4);
        // right side of slider bar
        _assets_Assets__WEBPACK_IMPORTED_MODULE_0__.UiAssets.slider_bar.renderPartial(target, x + w - 2 * upscaleSize, y - 2 * upscaleSize, 2 * upscaleSize, 4 * upscaleSize, 3, 0, 2, 4);
        // center of slider bar
        _assets_Assets__WEBPACK_IMPORTED_MODULE_0__.UiAssets.slider_bar.renderPartial(target, x + 2 * upscaleSize, y - 2 * upscaleSize, w - 4 * upscaleSize, 4 * upscaleSize, 2, 0, 1, 4);
        // handle
        _assets_Assets__WEBPACK_IMPORTED_MODULE_0__.UiAssets.slider_handle.render(target, x + Math.round((this.value - this.min) / (this.max - this.min) * (w - 8 * upscaleSize) / upscaleSize) * upscaleSize, y - 4 * upscaleSize, 8 * upscaleSize, 9 * upscaleSize);
    }
    updateSliderPosition(mouseX) {
        if (this.beingEdited) {
            this.value = Math.max(this.min, Math.min(this.max, Math.round((this.min + (this.max - this.min) * (((mouseX - this.x - 4 * _Game__WEBPACK_IMPORTED_MODULE_1__.game.upscaleSize) / (this.w - (8 * _Game__WEBPACK_IMPORTED_MODULE_1__.game.upscaleSize))))) / this.step) * this.step));
            this.onChanged();
        }
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
    constructor(font, titleFont) {
        super();
        // make the frame with some default values.  These will later be changed to fit the screen size.
        this.frame = new _UiFrame__WEBPACK_IMPORTED_MODULE_1__.UiFrame(0, 0, 0, 0);
        // make some buttons with default positions
        this.buttons = [
            new _Button__WEBPACK_IMPORTED_MODULE_3__.Button(font, "Back", "Return to the options menu.", 0, 0, 0, 0, () => {
                console.log("options menu");
                _Game__WEBPACK_IMPORTED_MODULE_2__.game.currentUi = new _OptionsMenu__WEBPACK_IMPORTED_MODULE_4__.OptionsMenu(font, titleFont);
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
/* harmony import */ var _WorldCreationMenu__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./WorldCreationMenu */ "./src/client/ui/screens/WorldCreationMenu.ts");
/* harmony import */ var _Game__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../Game */ "./src/client/Game.ts");







class MainMenu extends _UiScreen__WEBPACK_IMPORTED_MODULE_0__.UiScreen {
    constructor(font, titleFont) {
        super();
        // make the frame with some default values.  These will later be changed to fit the screen size.
        this.frame = new _UiFrame__WEBPACK_IMPORTED_MODULE_1__.UiFrame(0, 0, 0, 0);
        // make 4 buttons with default positions
        this.buttons = [
            new _Button__WEBPACK_IMPORTED_MODULE_2__.Button(font, "Resume Game", "Keep playing where you left off.", 0, 0, 0, 0, () => {
                console.log("resume game");
                _Game__WEBPACK_IMPORTED_MODULE_6__.game.currentUi = undefined;
            }),
            new _Button__WEBPACK_IMPORTED_MODULE_2__.Button(font, "New Game", "Creates a new server that your friends can join.", 0, 0, 0, 0, () => {
                console.log("new game");
                _Game__WEBPACK_IMPORTED_MODULE_6__.game.currentUi = new _WorldCreationMenu__WEBPACK_IMPORTED_MODULE_5__.WorldCreationMenu(font, titleFont);
            }),
            new _Button__WEBPACK_IMPORTED_MODULE_2__.Button(font, "Join Game", "Join a game with your friends, or make new ones.", 0, 0, 0, 0, () => {
                console.log("join game");
                _Game__WEBPACK_IMPORTED_MODULE_6__.game.currentUi = undefined;
            }),
            new _Button__WEBPACK_IMPORTED_MODULE_2__.Button(font, "Options", "Change your keybinds, reduce lag, etc.", 0, 0, 0, 0, () => {
                console.log("options");
                _Game__WEBPACK_IMPORTED_MODULE_6__.game.currentUi = new _OptionsMenu__WEBPACK_IMPORTED_MODULE_3__.OptionsMenu(font, titleFont);
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
        // set the position of the frame
        this.frame.x = _Game__WEBPACK_IMPORTED_MODULE_6__.game.width / 2 - 264 / 2 * _Game__WEBPACK_IMPORTED_MODULE_6__.game.upscaleSize; // center the frame in the middle of the screen
        this.frame.y = _Game__WEBPACK_IMPORTED_MODULE_6__.game.height / 2 - 56 * _Game__WEBPACK_IMPORTED_MODULE_6__.game.upscaleSize;
        this.frame.w = 264 * _Game__WEBPACK_IMPORTED_MODULE_6__.game.upscaleSize;
        this.frame.h = 48 * _Game__WEBPACK_IMPORTED_MODULE_6__.game.upscaleSize;
        // set the positions of all the buttons
        for (let i = 0; i < 4; i++) {
            this.buttons[i].x = _Game__WEBPACK_IMPORTED_MODULE_6__.game.width / 2 - 192 / 2 * _Game__WEBPACK_IMPORTED_MODULE_6__.game.upscaleSize;
            this.buttons[i].y = _Game__WEBPACK_IMPORTED_MODULE_6__.game.height / 2 + 20 * i * _Game__WEBPACK_IMPORTED_MODULE_6__.game.upscaleSize;
            this.buttons[i].w = 192 * _Game__WEBPACK_IMPORTED_MODULE_6__.game.upscaleSize;
            this.buttons[i].h = 16 * _Game__WEBPACK_IMPORTED_MODULE_6__.game.upscaleSize;
            this.buttons[i].updateMouseOver(_Game__WEBPACK_IMPORTED_MODULE_6__.game.mouseX, _Game__WEBPACK_IMPORTED_MODULE_6__.game.mouseY);
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







class OptionsMenu extends _UiScreen__WEBPACK_IMPORTED_MODULE_0__.UiScreen {
    constructor(font, titleFont) {
        super();
        // make the frame with some default values.  These will later be changed to fit the screen size.
        this.frame = new _UiFrame__WEBPACK_IMPORTED_MODULE_1__.UiFrame(0, 0, 0, 0);
        this.titleFont = titleFont;
        // make some buttons with default positions
        this.buttons = [
            new _Button__WEBPACK_IMPORTED_MODULE_2__.Button(font, "Video Settings", "Change the balance between performance and fidelity.", 0, 0, 0, 0, () => {
                console.log("video settings");
                _Game__WEBPACK_IMPORTED_MODULE_6__.game.currentUi = new _VideoSettingsMenu__WEBPACK_IMPORTED_MODULE_4__.VideoSettingsMenu(font, titleFont);
            }),
            new _Button__WEBPACK_IMPORTED_MODULE_2__.Button(font, "Controls", "Change your keybinds.", 0, 0, 0, 0, () => {
                console.log("control menu");
                _Game__WEBPACK_IMPORTED_MODULE_6__.game.currentUi = new _ControlsMenu__WEBPACK_IMPORTED_MODULE_5__.ControlsMenu(font, titleFont);
            }),
            new _Button__WEBPACK_IMPORTED_MODULE_2__.Button(font, "Audio Settings", "Change the volume of different sounds.", 0, 0, 0, 0, () => {
                console.log("audio menu");
                _Game__WEBPACK_IMPORTED_MODULE_6__.game.currentUi = undefined;
            }),
            new _Button__WEBPACK_IMPORTED_MODULE_2__.Button(font, "Back", "Return to the main menu.", 0, 0, 0, 0, () => {
                console.log("main menu");
                _Game__WEBPACK_IMPORTED_MODULE_6__.game.currentUi = new _MainMenu__WEBPACK_IMPORTED_MODULE_3__.MainMenu(font, titleFont);
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
        for (let i = 0; i < 4; i++) {
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
                _Game__WEBPACK_IMPORTED_MODULE_5__.game.currentUi = new _OptionsMenu__WEBPACK_IMPORTED_MODULE_3__.OptionsMenu(font, titleFont);
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
        for (let i = 0; i < 3; i++) {
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
    constructor(font, titleFont) {
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
                _Game__WEBPACK_IMPORTED_MODULE_2__.game.currentUi = new _OptionsMenu__WEBPACK_IMPORTED_MODULE_4__.OptionsMenu(font, titleFont);
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
        for (let i = 0; i < 3; i++) {
            this.buttons[i].x = _Game__WEBPACK_IMPORTED_MODULE_2__.game.width / 2 - 192 / 2 * _Game__WEBPACK_IMPORTED_MODULE_2__.game.upscaleSize;
            this.buttons[i].y = _Game__WEBPACK_IMPORTED_MODULE_2__.game.height / 2 + 20 * i * _Game__WEBPACK_IMPORTED_MODULE_2__.game.upscaleSize;
            this.buttons[i].w = 192 * _Game__WEBPACK_IMPORTED_MODULE_2__.game.upscaleSize;
            this.buttons[i].h = 16 * _Game__WEBPACK_IMPORTED_MODULE_2__.game.upscaleSize;
            this.buttons[i].updateMouseOver(_Game__WEBPACK_IMPORTED_MODULE_2__.game.mouseX, _Game__WEBPACK_IMPORTED_MODULE_2__.game.mouseY);
        }
    }
}


/***/ }),

/***/ "./src/client/ui/screens/WorldCreationMenu.ts":
/*!****************************************************!*\
  !*** ./src/client/ui/screens/WorldCreationMenu.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "WorldCreationMenu": () => (/* binding */ WorldCreationMenu)
/* harmony export */ });
/* harmony import */ var _UiScreen__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../UiScreen */ "./src/client/ui/UiScreen.ts");
/* harmony import */ var _UiFrame__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../UiFrame */ "./src/client/ui/UiFrame.ts");
/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Button */ "./src/client/ui/Button.ts");
/* harmony import */ var _MainMenu__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./MainMenu */ "./src/client/ui/screens/MainMenu.ts");
/* harmony import */ var _WorldOptionsMenu__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./WorldOptionsMenu */ "./src/client/ui/screens/WorldOptionsMenu.ts");
/* harmony import */ var _Game__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../Game */ "./src/client/Game.ts");






class WorldCreationMenu extends _UiScreen__WEBPACK_IMPORTED_MODULE_0__.UiScreen {
    constructor(font, titleFont) {
        super();
        // make the frame with some default values.  These will later be changed to fit the screen size.
        this.frame = new _UiFrame__WEBPACK_IMPORTED_MODULE_1__.UiFrame(0, 0, 0, 0);
        this.titleFont = titleFont;
        // make some buttons with default positions
        if (_Game__WEBPACK_IMPORTED_MODULE_5__.game.serverVisibility === undefined)
            _Game__WEBPACK_IMPORTED_MODULE_5__.game.serverVisibility = "Public";
        this.buttons = [
            new _Button__WEBPACK_IMPORTED_MODULE_2__.Button(font, `Server Visibility: ${_Game__WEBPACK_IMPORTED_MODULE_5__.game.serverVisibility}`, "Change the visibility of the server", 0, 0, 0, 0, () => {
                if (this.buttons[0].txt === "Server Visibility: Public") {
                    _Game__WEBPACK_IMPORTED_MODULE_5__.game.serverVisibility = "Unlisted";
                    this.buttons[0].txt = "Server Visibility: Unlisted";
                }
                else if (this.buttons[0].txt === "Server Visibility: Unlisted") {
                    _Game__WEBPACK_IMPORTED_MODULE_5__.game.serverVisibility = "Private";
                    this.buttons[0].txt = "Server Visibility: Private";
                }
                else {
                    _Game__WEBPACK_IMPORTED_MODULE_5__.game.serverVisibility = "Public";
                    this.buttons[0].txt = "Server Visibility: Public";
                }
            }),
            new _Button__WEBPACK_IMPORTED_MODULE_2__.Button(font, "World Options", "Change how your world looks and generates.", 0, 0, 0, 0, () => {
                console.log("world menu");
                _Game__WEBPACK_IMPORTED_MODULE_5__.game.currentUi = new _WorldOptionsMenu__WEBPACK_IMPORTED_MODULE_4__.WorldOptionsMenu(font, titleFont);
            }),
            new _Button__WEBPACK_IMPORTED_MODULE_2__.Button(font, "Back", "Return to the main menu.", 0, 0, 0, 0, () => {
                console.log("main menu");
                _Game__WEBPACK_IMPORTED_MODULE_5__.game.currentUi = new _MainMenu__WEBPACK_IMPORTED_MODULE_3__.MainMenu(font, titleFont);
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
        this.titleFont.drawText(target, "Create World", this.frame.x + 30 * _Game__WEBPACK_IMPORTED_MODULE_5__.game.upscaleSize, this.frame.y + 16 * _Game__WEBPACK_IMPORTED_MODULE_5__.game.upscaleSize);
    }
    windowUpdate() {
        // set the position of the frame
        this.frame.x = _Game__WEBPACK_IMPORTED_MODULE_5__.game.width / 2 - 200 / 2 * _Game__WEBPACK_IMPORTED_MODULE_5__.game.upscaleSize; // center the frame in the center of the screen
        this.frame.y = _Game__WEBPACK_IMPORTED_MODULE_5__.game.height / 2 - 56 * _Game__WEBPACK_IMPORTED_MODULE_5__.game.upscaleSize;
        this.frame.w = 200 * _Game__WEBPACK_IMPORTED_MODULE_5__.game.upscaleSize;
        this.frame.h = 48 * _Game__WEBPACK_IMPORTED_MODULE_5__.game.upscaleSize;
        // set the positions of all the buttons
        for (let i = 0; i < 3; i++) {
            this.buttons[i].x = _Game__WEBPACK_IMPORTED_MODULE_5__.game.width / 2 - 192 / 2 * _Game__WEBPACK_IMPORTED_MODULE_5__.game.upscaleSize;
            this.buttons[i].y = _Game__WEBPACK_IMPORTED_MODULE_5__.game.height / 2 + 20 * i * _Game__WEBPACK_IMPORTED_MODULE_5__.game.upscaleSize;
            this.buttons[i].w = 192 * _Game__WEBPACK_IMPORTED_MODULE_5__.game.upscaleSize;
            this.buttons[i].h = 16 * _Game__WEBPACK_IMPORTED_MODULE_5__.game.upscaleSize;
            this.buttons[i].updateMouseOver(_Game__WEBPACK_IMPORTED_MODULE_5__.game.mouseX, _Game__WEBPACK_IMPORTED_MODULE_5__.game.mouseY);
        }
    }
}


/***/ }),

/***/ "./src/client/ui/screens/WorldOptionsMenu.ts":
/*!***************************************************!*\
  !*** ./src/client/ui/screens/WorldOptionsMenu.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "WorldOptionsMenu": () => (/* binding */ WorldOptionsMenu)
/* harmony export */ });
/* harmony import */ var _UiScreen__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../UiScreen */ "./src/client/ui/UiScreen.ts");
/* harmony import */ var _UiFrame__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../UiFrame */ "./src/client/ui/UiFrame.ts");
/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Button */ "./src/client/ui/Button.ts");
/* harmony import */ var _WorldCreationMenu__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./WorldCreationMenu */ "./src/client/ui/screens/WorldCreationMenu.ts");
/* harmony import */ var _Slider__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Slider */ "./src/client/ui/Slider.ts");
/* harmony import */ var _Game__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../Game */ "./src/client/Game.ts");






class WorldOptionsMenu extends _UiScreen__WEBPACK_IMPORTED_MODULE_0__.UiScreen {
    constructor(font, titleFont) {
        super();
        // make the frame with some default values.  These will later be changed to fit the screen size.
        this.frame = new _UiFrame__WEBPACK_IMPORTED_MODULE_1__.UiFrame(0, 0, 0, 0);
        this.titleFont = titleFont;
        // make some buttons with default positions
        if (_Game__WEBPACK_IMPORTED_MODULE_5__.game.worldBumpiness === undefined)
            _Game__WEBPACK_IMPORTED_MODULE_5__.game.worldBumpiness = 1;
        let tempWorldBumpinessText;
        if (_Game__WEBPACK_IMPORTED_MODULE_5__.game.worldBumpiness === 1) {
            tempWorldBumpinessText = "Normal";
        }
        else if (_Game__WEBPACK_IMPORTED_MODULE_5__.game.worldBumpiness === 0) {
            tempWorldBumpinessText = "Superflat";
        }
        else {
            tempWorldBumpinessText = "Amplified";
        }
        this.buttons = [
            new _Button__WEBPACK_IMPORTED_MODULE_2__.Button(font, `World Bumpiness: ${tempWorldBumpinessText}`, "Change the intensity of the world's bumps.", 0, 0, 0, 0, () => {
                if (this.buttons[0].txt === "World Bumpiness: Normal") {
                    this.buttons[0].txt = "World Bumpiness: Amplified";
                    _Game__WEBPACK_IMPORTED_MODULE_5__.game.worldBumpiness = 3;
                }
                else if (this.buttons[0].txt === "World Bumpiness: Amplified") {
                    this.buttons[0].txt = "World Bumpiness: Superflat";
                    _Game__WEBPACK_IMPORTED_MODULE_5__.game.worldBumpiness = 0;
                }
                else {
                    this.buttons[0].txt = "World Bumpiness: Normal";
                    _Game__WEBPACK_IMPORTED_MODULE_5__.game.worldBumpiness = 1;
                }
            }),
            new _Button__WEBPACK_IMPORTED_MODULE_2__.Button(font, "Back", "Return to the main menu.", 0, 0, 0, 0, () => {
                console.log("main menu");
                _Game__WEBPACK_IMPORTED_MODULE_5__.game.currentUi = new _WorldCreationMenu__WEBPACK_IMPORTED_MODULE_3__.WorldCreationMenu(font, titleFont);
            })
        ];
        this.sliders = [
            new _Slider__WEBPACK_IMPORTED_MODULE_4__.Slider(font, "Width", 512, 64, 2048, 64, 0, 0, 0, 0, () => {
                _Game__WEBPACK_IMPORTED_MODULE_5__.game.worldWidth = this.sliders[0].value;
            }),
            new _Slider__WEBPACK_IMPORTED_MODULE_4__.Slider(font, "Height", 64, 64, 512, 16, 0, 0, 0, 0, () => {
                _Game__WEBPACK_IMPORTED_MODULE_5__.game.worldHeight = this.sliders[1].value;
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
        this.titleFont.drawText(target, "World Options", this.frame.x + 30 * _Game__WEBPACK_IMPORTED_MODULE_5__.game.upscaleSize, this.frame.y + 16 * _Game__WEBPACK_IMPORTED_MODULE_5__.game.upscaleSize);
    }
    windowUpdate() {
        // set the position of the frame
        this.frame.x = _Game__WEBPACK_IMPORTED_MODULE_5__.game.width / 2 - 200 / 2 * _Game__WEBPACK_IMPORTED_MODULE_5__.game.upscaleSize; // center the frame in the center of the screen
        this.frame.y = _Game__WEBPACK_IMPORTED_MODULE_5__.game.height / 2 - 56 * _Game__WEBPACK_IMPORTED_MODULE_5__.game.upscaleSize;
        this.frame.w = 200 * _Game__WEBPACK_IMPORTED_MODULE_5__.game.upscaleSize;
        this.frame.h = 48 * _Game__WEBPACK_IMPORTED_MODULE_5__.game.upscaleSize;
        // set the positions of all the buttons
        for (let i = 0; i < 2; i++) {
            this.buttons[i].x = _Game__WEBPACK_IMPORTED_MODULE_5__.game.width / 2 - 192 / 2 * _Game__WEBPACK_IMPORTED_MODULE_5__.game.upscaleSize;
            this.buttons[i].y = _Game__WEBPACK_IMPORTED_MODULE_5__.game.height / 2 + 60 * i * _Game__WEBPACK_IMPORTED_MODULE_5__.game.upscaleSize;
            this.buttons[i].w = 192 * _Game__WEBPACK_IMPORTED_MODULE_5__.game.upscaleSize;
            this.buttons[i].h = 16 * _Game__WEBPACK_IMPORTED_MODULE_5__.game.upscaleSize;
            this.buttons[i].updateMouseOver(_Game__WEBPACK_IMPORTED_MODULE_5__.game.mouseX, _Game__WEBPACK_IMPORTED_MODULE_5__.game.mouseY);
        }
        // set the positions of all the sliders
        for (let i = 0; i < 2; i++) {
            this.sliders[i].x = _Game__WEBPACK_IMPORTED_MODULE_5__.game.width / 2 - 192 / 2 * _Game__WEBPACK_IMPORTED_MODULE_5__.game.upscaleSize;
            this.sliders[i].y = _Game__WEBPACK_IMPORTED_MODULE_5__.game.height / 2 + 20 * _Game__WEBPACK_IMPORTED_MODULE_5__.game.upscaleSize + 20 * i * _Game__WEBPACK_IMPORTED_MODULE_5__.game.upscaleSize;
            this.sliders[i].w = 192 * _Game__WEBPACK_IMPORTED_MODULE_5__.game.upscaleSize;
            this.sliders[i].h = 16 * _Game__WEBPACK_IMPORTED_MODULE_5__.game.upscaleSize;
            if (_Game__WEBPACK_IMPORTED_MODULE_5__.game.mouseIsPressed)
                this.sliders[i].updateSliderPosition(_Game__WEBPACK_IMPORTED_MODULE_5__.game.mouseX);
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
        this.snapshotInterpolation.interpolationBuffer.set((1000 / _Game__WEBPACK_IMPORTED_MODULE_0__.game.netManager.playerTickRate) * 2);
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
        // Render each entity in random order
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
        this.tileLayer.fill(255, 0, 0);
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
                        let img = _assets_Assets__WEBPACK_IMPORTED_MODULE_4__.WorldAssets.tileEntities[this.tileEntities[tileVal].type_][this.tileEntities[tileVal].animFrame];
                        img.render(this.tileLayer, y * _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_WIDTH, x * _Game__WEBPACK_IMPORTED_MODULE_0__.game.TILE_HEIGHT, img.image.width, img.image.height);
                    }
                    else {
                        console.log(`Already rendered ${tileVal}`);
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
                    console.log(`Already rendered ${tileVal}`);
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
        reflectivity: 50
    },
    [_global_Tile__WEBPACK_IMPORTED_MODULE_1__.TileType.Ice]: {
        name: 'ice',
        texture: _assets_Assets__WEBPACK_IMPORTED_MODULE_0__.WorldAssets.middleground.tileset_ice,
        connected: true,
        anyConnection: true,
        color: "#76adc4",
        friction: 1.5,
        reflectivity: 255
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
        connected: false,
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



const EntityClasses = {
    [_global_Entity__WEBPACK_IMPORTED_MODULE_0__.Entities.LocalPlayer]: undefined,
    [_global_Entity__WEBPACK_IMPORTED_MODULE_0__.Entities.Player]: _PlayerEntity__WEBPACK_IMPORTED_MODULE_1__.PlayerEntity,
    [_global_Entity__WEBPACK_IMPORTED_MODULE_0__.Entities.Item]: _ItemEntity__WEBPACK_IMPORTED_MODULE_2__.ItemEntity,
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
/* harmony export */   "PlayerEntity": () => (/* binding */ PlayerEntity)
/* harmony export */ });
/* harmony import */ var _ServerEntity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ServerEntity */ "./src/client/world/entities/ServerEntity.ts");
/* harmony import */ var _global_Entity__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../global/Entity */ "./src/global/Entity.ts");
/* harmony import */ var _Game__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../Game */ "./src/client/Game.ts");



class PlayerEntity extends _ServerEntity__WEBPACK_IMPORTED_MODULE_0__.ServerEntity {
    constructor(data) {
        super(data.id);
        this.width = 12 / _Game__WEBPACK_IMPORTED_MODULE_2__.game.TILE_WIDTH;
        this.height = 20 / _Game__WEBPACK_IMPORTED_MODULE_2__.game.TILE_HEIGHT;
        if (data.type === _global_Entity__WEBPACK_IMPORTED_MODULE_1__.Entities.Player) {
            this.name = data.data.name;
        }
    }
    updateData(data) {
        if (data.type === _global_Entity__WEBPACK_IMPORTED_MODULE_1__.Entities.Player) {
            this.name = data.data.name;
        }
    }
    render(target, upscaleSize) {
        target.fill(0, 255, 0);
        target.rect((this.x * _Game__WEBPACK_IMPORTED_MODULE_2__.game.TILE_WIDTH -
            _Game__WEBPACK_IMPORTED_MODULE_2__.game.interpolatedCamX * _Game__WEBPACK_IMPORTED_MODULE_2__.game.TILE_WIDTH) *
            upscaleSize, (this.y * _Game__WEBPACK_IMPORTED_MODULE_2__.game.TILE_HEIGHT -
            _Game__WEBPACK_IMPORTED_MODULE_2__.game.interpolatedCamY * _Game__WEBPACK_IMPORTED_MODULE_2__.game.TILE_HEIGHT) *
            upscaleSize, this.width * upscaleSize * _Game__WEBPACK_IMPORTED_MODULE_2__.game.TILE_WIDTH, this.height * upscaleSize * _Game__WEBPACK_IMPORTED_MODULE_2__.game.TILE_HEIGHT);
        // Render the item quantity label
        target.fill(0);
        target.noStroke();
        target.textSize(5 * upscaleSize);
        target.textAlign(target.CENTER, target.TOP);
        target.text(this.name, (this.x * _Game__WEBPACK_IMPORTED_MODULE_2__.game.TILE_WIDTH -
            _Game__WEBPACK_IMPORTED_MODULE_2__.game.interpolatedCamX * _Game__WEBPACK_IMPORTED_MODULE_2__.game.TILE_WIDTH +
            (this.width * _Game__WEBPACK_IMPORTED_MODULE_2__.game.TILE_WIDTH) / 2) *
            upscaleSize, (this.y * _Game__WEBPACK_IMPORTED_MODULE_2__.game.TILE_HEIGHT -
            _Game__WEBPACK_IMPORTED_MODULE_2__.game.interpolatedCamY * _Game__WEBPACK_IMPORTED_MODULE_2__.game.TILE_HEIGHT -
            (this.height * _Game__WEBPACK_IMPORTED_MODULE_2__.game.TILE_WIDTH) / 2.5) *
            upscaleSize);
    }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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TixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7S0FDTixFQUNELDBFQUEwRSxFQUMxRSxFQUFFLENBQ0Y7SUFFRCxHQUFHLEVBQUUsSUFBSSxpRUFBWSxDQUNwQixnQ0FBZ0MsRUFDaEM7UUFDQyxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztLQUNOLEVBQ0Qsd0VBQXdFLEVBQ3hFLEVBQUUsQ0FDRjtJQUNELFNBQVMsRUFBRSxJQUFJLGlFQUFZLENBQzFCLGtDQUFrQyxFQUNsQztRQUNDLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixJQUFJLEVBQUUsQ0FBQztRQUNQLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdB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QUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBQywrREFBK0Q7Z0JBQ3pHLEtBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDMUMsS0FBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTt3QkFDckIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxHQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxHQUFDLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxHQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFDLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUNqSTtvQkFDRCxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLEdBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEdBQUMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDO3dCQUN2RCxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsR0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBQyxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUM7NEJBQ25FLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBQyxDQUFDLENBQUMsR0FBQyxJQUFJLENB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LEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3JGLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUMzRyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDM0csSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRWpJLGlCQUFpQjtRQUNqQixJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDNUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRWxJLGlCQUFpQjtRQUNqQixJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDNUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRWxJLFNBQVM7UUFDVCxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFbkksSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLEVBQUUsSUFBSSxDQUFD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RyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzNHLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUMzRyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFakksaUJBQWlCO1FBQ2pCLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM1RyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxD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LEdBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxXQUFXLEVBQUUsQ0FBQyxHQUFDLENBQUMsR0FBQyxDQUFDLEdBQUMsV0FBVyxFQUFFLENBQUMsR0FBQyxXQUFXLEVBQUUsQ0FBQyxHQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUV4SCxpQkFBaUI7UUFDakIsMkVBQStCLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBQyxDQUFDLEdBQUMsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUMsRUFBRSxHQUFDLFdBQVcsRUFBRSxDQUFDLEdBQUMsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3pHLDJFQUErQixDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUMsQ0FBQyxHQUFDLFdBQVcsRUFBRSxDQUFDLEdBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxXQUFXLEVBQUUsQ0FBQyxHQUFDLEVBQUUsR0FBQyxXQUFXLEVBQUUsQ0FBQyxHQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUV6SCxpQkFBaUI7UUFDakIsMkVBQStCLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUMsQ0FBQyxHQUFDLFdBQVcsRUFBRSxDQUFDLEdBQUMsV0FBVyxFQUFFLENBQUMsR0FBQyxFQUFFLEdBQUMsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3pHLDJFQUErQixDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxXQUFXLEVBQUUsQ0FBQyxHQUFDLENBQUMsR0FBQyxXQUFXLEVBQUUsQ0FBQyxHQUFDLFdBQVcsRUFBRSxDQUFDLEdBQUMsRUFBRSxHQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztR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V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7Ozs7V0MzQkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEdBQUc7V0FDSDtXQUNBO1dBQ0EsQ0FBQzs7Ozs7V0NQRDs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1dDTkE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLE1BQU0scUJBQXFCO1dBQzNCO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBOzs7OztVRWhEQTtVQUNBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2NsaWVudC9HYW1lLnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3NyYy9jbGllbnQvTmV0TWFuYWdlci50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi9zcmMvY2xpZW50L2Fzc2V0cy9Bc3NldHMudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2NsaWVudC9hc3NldHMvcmVzb3VyY2VzL0F1ZGlvUmVzb3VyY2UudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2NsaWVudC9hc3NldHMvcmVzb3VyY2VzL0F1ZGlvUmVzb3VyY2VHcm91cC50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi9zcmMvY2xpZW50L2Fzc2V0cy9yZXNvdXJjZXMvRm9udFJlc291cmNlLnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3NyYy9jbGllbnQvYXNzZXRzL3Jlc291cmNlcy9JbWFnZVJlc291cmNlLnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3NyYy9jbGllbnQvYXNzZXRzL3Jlc291cmNlcy9SZWZsZWN0ZWRJbWFnZVJlc291cmNlLnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3NyYy9jbGllbnQvYXNzZXRzL3Jlc291cmNlcy9SZXNvdXJjZS50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi9zcmMvY2xpZW50L2Fzc2V0cy9yZXNvdXJjZXMvVGlsZVJlc291cmNlLnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3NyYy9jbGllbnQvaW5wdXQvQ29udHJvbC50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi9zcmMvY2xpZW50L3BsYXllci9JbnZlbnRvcnkudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2NsaWVudC9wbGF5ZXIvUGxheWVyTG9jYWwudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2NsaWVudC91aS9CdXR0b24udHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2NsaWVudC91aS9JbnB1dEJveC50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi9zcmMvY2xpZW50L3VpL1NsaWRlci50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi9zcmMvY2xpZW50L3VpL1VpRnJhbWUudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2NsaWVudC91aS9VaVNjcmVlbi50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi9zcmMvY2xpZW50L3VpL3NjcmVlbnMvQ29udHJvbHNNZW51LnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3NyYy9jbGllbnQvdWkvc2NyZWVucy9NYWluTWVudS50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi9zcmMvY2xpZW50L3VpL3NjcmVlbnMvT3B0aW9uc01lbnUudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2NsaWVudC91aS9zY3JlZW5zL1BhdXNlTWVudS50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi9zcmMvY2xpZW50L3VpL3NjcmVlbnMvVmlkZW9TZXR0aW5nc01lbnUudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2NsaWVudC91aS9zY3JlZW5zL1dvcmxkQ3JlYXRpb25NZW51LnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3NyYy9jbGllbnQvdWkvc2NyZWVucy9Xb3JsZE9wdGlvbnNNZW51LnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3NyYy9jbGllbnQvd29ybGQvV29ybGQudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2NsaWVudC93b3JsZC9Xb3JsZFRpbGVzLnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3NyYy9jbGllbnQvd29ybGQvZW50aXRpZXMvRW50aXR5Q2xhc3Nlcy50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi9zcmMvY2xpZW50L3dvcmxkL2VudGl0aWVzL0l0ZW1FbnRpdHkudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2NsaWVudC93b3JsZC9lbnRpdGllcy9QbGF5ZXJFbnRpdHkudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2NsaWVudC93b3JsZC9lbnRpdGllcy9TZXJ2ZXJFbnRpdHkudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2NsaWVudC93b3JsZC9wYXJ0aWNsZXMvQ29sb3JQYXJ0aWNsZS50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi9zcmMvZ2xvYmFsL0VudGl0eS50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi9zcmMvZ2xvYmFsL0ludmVudG9yeS50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi9zcmMvZ2xvYmFsL1RpbGUudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2dsb2JhbC9UaWxlRW50aXR5LnRzIiwid2VicGFjazovL3Nub3dlZF9pbi93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vd2VicGFjay9ydW50aW1lL2NodW5rIGxvYWRlZCIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vc25vd2VkX2luL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vd2VicGFjay9ydW50aW1lL2pzb25wIGNodW5rIGxvYWRpbmciLCJ3ZWJwYWNrOi8vc25vd2VkX2luL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vc25vd2VkX2luL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwNSwgeyBTaGFkZXIgfSBmcm9tICdwNSc7XHJcblxyXG5pbXBvcnQgeyBXb3JsZCB9IGZyb20gJy4vd29ybGQvV29ybGQnO1xyXG5cclxuaW1wb3J0IHtcclxuXHRBdWRpb0Fzc2V0cyxcclxuXHRGb250cyxcclxuXHRJdGVtQXNzZXRzLFxyXG5cdGxvYWRBc3NldHMsXHJcblx0UGxheWVyQW5pbWF0aW9ucyxcclxuXHRVaUFzc2V0cyxcclxuXHRXb3JsZEFzc2V0cyxcclxufSBmcm9tICcuL2Fzc2V0cy9Bc3NldHMnO1xyXG5pbXBvcnQgeyBNYWluTWVudSB9IGZyb20gJy4vdWkvc2NyZWVucy9NYWluTWVudSc7XHJcbmltcG9ydCB7IGlvLCBTb2NrZXQgfSBmcm9tICdzb2NrZXQuaW8tY2xpZW50JztcclxuaW1wb3J0IHsgVWlTY3JlZW4gfSBmcm9tICcuL3VpL1VpU2NyZWVuJztcclxuaW1wb3J0IHsgUGF1c2VNZW51IH0gZnJvbSAnLi91aS9zY3JlZW5zL1BhdXNlTWVudSc7XHJcbmltcG9ydCB7IE5ldE1hbmFnZXIgfSBmcm9tICcuL05ldE1hbmFnZXInO1xyXG5pbXBvcnQgeyBXb3JsZFRpbGVzLCBUaWxlIH0gZnJvbSAnLi93b3JsZC9Xb3JsZFRpbGVzJztcclxuXHJcbmltcG9ydCB7IENsaWVudEV2ZW50cywgU2VydmVyRXZlbnRzIH0gZnJvbSAnLi4vZ2xvYmFsL0V2ZW50cyc7XHJcblxyXG4vKlxyXG4vLy9JTkZPUk1BVElPTlxyXG4vL1N0YXJ0aW5nIGEgZ2FtZVxyXG5QcmVzcyBMaXZlIFNlcnZlciB0byBzdGFydCB0aGUgZ2FtZVxyXG5vclxyXG5UeXBlIG5wbSBydW4gcHJlc3RhcnQgdG8gc3RhcnQgdGhlIGdhbWUuXHJcbi8vVE9ET1xyXG5XaGVuIHNvbWV0aGluZyBpbiB0aGUgdG9kbyBzZWN0aW9uLCBlaXRoZXIgZGVsZXRlIGl0IGFuZCBtYXJrIHdoYXQgd2FzIGRvbmUgaW4gdGhlIGRlc2NyaXB0aW9uIC1cclxuLSB3aGVuIHB1c2hpbmcsIG9yIGp1c3QgbWFyayBpdCBsaWtlIHRoaXNcclxuKGV4YW1wbGU6IENyZWF0ZSBhIG51Y2xlYXIgZXhwbG9zaW9uIC0tIFgpXHJcbi8vL0dFTkVSQUwgVE9ETzpcclxuXHJcbi8vQXVkaW9cclxuc291bmRzXHJcbm11c2ljXHJcbk5QQydzXHJcblxyXG4vL1Zpc3VhbFxyXG5VcGRhdGUgc25vdyB0ZXh0dXJlc1xyXG5VcGRhdGUgR1VJIHRleHR1cmVzXHJcbnBsYXllciBjaGFyYWN0ZXJcclxuaXRlbSBsb3JlIGltcGxlbWVudGVkXHJcblxyXG4vL0dhbWVwbGF5XHJcbmZpbmlzaCBpdGVtIG1hbmFnZW1lbnRcclxucGF1c2UgbWVudVxyXG5IdW5nZXIsIGhlYXQsIGV0YyBzeXN0ZW1cclxuaXRlbSBjcmVhdGlvblxyXG5pdGVtIHVzZVxyXG5QYXJlbnQgV29ya2JlbmNoXHJcblxyXG4vL09iamVjdHNcclxuZGlydFxyXG5zdG9uZVxyXG53b3JrYmVuY2hcclxuYmFja3BhY2sgKHVzZWQgYXMgY2hlc3QpXHJcblxyXG4vL1BvbGlzaFxyXG5iZXR0ZXIgd29ybGQgZ2VuZXJhdGlvblxyXG5mb250IGNvbnNpc3RlbmN5XHJcbmZpeCBjdXJzb3IgaW5wdXQgbGFnIChzZXBhcmF0ZSBjdXJzb3IgYW5kIGFuaW1hdGlvbiBpbWFnZXMpXHJcbmZpeCBzdHVjayBvbiBzaWRlIG9mIGJsb2NrIGJ1Z1xyXG5maXggY29sbGlkZSB3aXRoIHNpZGVzIG9mIG1hcCBidWdcclxuICovXHJcbmltcG9ydCB7IFRpbGVUeXBlIH0gZnJvbSAnLi4vZ2xvYmFsL1RpbGUnO1xyXG5pbXBvcnQgeyBDb250cm9sIH0gZnJvbSAnLi9pbnB1dC9Db250cm9sJztcclxuaW1wb3J0IHsgQ29sb3JQYXJ0aWNsZSB9IGZyb20gJy4vd29ybGQvcGFydGljbGVzL0NvbG9yUGFydGljbGUnO1xyXG5pbXBvcnQgeyBUaWxlRW50aXRpZXMgfSBmcm9tICcuLi9nbG9iYWwvVGlsZUVudGl0eSc7XHJcblxyXG5leHBvcnQgY2xhc3MgR2FtZSBleHRlbmRzIHA1IHtcclxuXHR3b3JsZFdpZHRoOiBudW1iZXIgPSA1MTI7IC8vIHdpZHRoIG9mIHRoZSB3b3JsZCBpbiB0aWxlcyAgIDwhPiBNQUtFIFNVUkUgVEhJUyBJUyBORVZFUiBMRVNTIFRIQU4gNjQhISEgPCE+XHJcblx0d29ybGRIZWlnaHQ6IG51bWJlciA9IDI1NjsgLy8gaGVpZ2h0IG9mIHRoZSB3b3JsZCBpbiB0aWxlcyAgPCE+IE1BS0UgU1VSRSBUSElTIElTIE5FVkVSIExFU1MgVEhBTiA2NCEhISA8IT5cclxuXHJcblx0VElMRV9XSURUSDogbnVtYmVyID0gODsgLy8gd2lkdGggb2YgYSB0aWxlcyBpbiBwaXhlbHNcclxuXHRUSUxFX0hFSUdIVDogbnVtYmVyID0gODsgLy8gaGVpZ2h0IG9mIGEgdGlsZXMgaW4gcGl4ZWxzXHJcblxyXG5cdHVwc2NhbGVTaXplOiBudW1iZXIgPSA2OyAvLyBudW1iZXIgb2Ygc2NyZWVuIHBpeGVscyBwZXIgdGV4dHVyZSBwaXhlbHMgKHRoaW5rIG9mIHRoaXMgYXMgaHVkIHNjYWxlIGluIE1pbmVjcmFmdClcclxuXHJcblx0Y2FtWDogbnVtYmVyID0gMDsgLy8gcG9zaXRpb24gb2YgdGhlIHRvcCBsZWZ0IGNvcm5lciBvZiB0aGUgc2NyZWVuIGluIHVuLXVwLXNjYWxlZCBwaXhlbHMgKDAgaXMgbGVmdCBvZiB3b3JsZCkgKHdvcmxkV2lkdGgqVElMRV9XSURUSCBpcyBib3R0b20gb2Ygd29ybGQpXHJcblx0Y2FtWTogbnVtYmVyID0gMDsgLy8gcG9zaXRpb24gb2YgdGhlIHRvcCBsZWZ0IGNvcm5lciBvZiB0aGUgc2NyZWVuIGluIHVuLXVwLXNjYWxlZCBwaXhlbHMgKDAgaXMgdG9wIG9mIHdvcmxkKSAod29ybGRIZWlnaHQqVElMRV9IRUlHSFQgaXMgYm90dG9tIG9mIHdvcmxkKVxyXG5cdHBDYW1YOiBudW1iZXIgPSAwOyAvLyBsYXN0IGZyYW1lJ3MgeCBvZiB0aGUgY2FtZXJhXHJcblx0cENhbVk6IG51bWJlciA9IDA7IC8vIGxhc3QgZnJhbWUncyB5IG9mIHRoZSBjYW1lcmFcclxuXHRpbnRlcnBvbGF0ZWRDYW1YOiBudW1iZXIgPSAwOyAvLyBpbnRlcnBvbGF0ZWQgcG9zaXRpb24gb2YgdGhlIGNhbWVyYVxyXG5cdGludGVycG9sYXRlZENhbVk6IG51bWJlciA9IDA7IC8vIGludGVycG9sYXRlZCBwb3NpdGlvbiBvZiB0aGUgY2FtZXJhXHJcblx0ZGVzaXJlZENhbVg6IG51bWJlciA9IDA7IC8vIGRlc2lyZWQgcG9zaXRpb24gb2YgdGhlIGNhbWVyYVxyXG5cdGRlc2lyZWRDYW1ZOiBudW1iZXIgPSAwOyAvLyBkZXNpcmVkIHBvc2l0aW9uIG9mIHRoZSBjYW1lcmFcclxuXHRzY3JlZW5zaGFrZUFtb3VudDogbnVtYmVyID0gMDsgLy8gYW1vdW50IG9mIHNjcmVlbnNoYWtlIGhhcHBlbmluZyBhdCB0aGUgY3VycmVudCBtb21lbnRcclxuXHJcblx0Ly8gdGljayBtYW5hZ2VtZW50XHJcblx0bXNTaW5jZVRpY2s6IG51bWJlciA9IDA7IC8vIHRoaXMgaXMgdGhlIHJ1bm5pbmcgY291bnRlciBvZiBob3cgbWFueSBtaWxsaXNlY29uZHMgaXQgaGFzIGJlZW4gc2luY2UgdGhlIGxhc3QgdGljay4gIFRoZSBnYW1lIGNhbiB0aGVuXHJcblx0bXNQZXJUaWNrOiBudW1iZXIgPSAyMDsgLy8gdGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgcGVyIGdhbWUgdGljay4gIDEwMDAvbXNQZXJUaWNrID0gdGlja3MgcGVyIHNlY29uZFxyXG5cdGFtb3VudFNpbmNlTGFzdFRpY2s6IG51bWJlciA9IDA7IC8vIHRoaXMgaXMgYSB2YXJpYWJsZSBjYWxjdWxhdGVkIGV2ZXJ5IGZyYW1lIHVzZWQgZm9yIGludGVycG9sYXRpb24gLSBkb21haW5bMCwxKVxyXG5cdGZvcmdpdmVuZXNzQ291bnQ6IG51bWJlciA9IDUwOyAvLyBpZiB0aGUgY29tcHV0ZXIgbmVlZHMgdG8gZG8gbW9yZSB0aGFuIDUwIHRpY2tzIGluIGEgc2luZ2xlIGZyYW1lLCB0aGVuIGl0IGNvdWxkIGJlIHJ1bm5pbmcgYmVoaW5kLCBwcm9iYWJseSBiZWNhdXNlIG9mIGEgZnJlZXplIG9yIHRoZSB1c2VyIGJlaW5nIG9uIGEgZGlmZmVyZW50IHRhYi4gIEluIHRoZXNlIGNhc2VzLCBpdCdzIHByb2JhYmx5IGJlc3QgdG8ganVzdCBpZ25vcmUgdGhhdCBhbnkgdGltZSBoYXMgcGFzc2VkIHRvIGF2b2lkIGZ1cnRoZXIgZnJlZXppbmdcclxuXHJcblx0Ly8gcGh5c2ljcyBjb25zdGFudHNcclxuXHRHUkFWSVRZX1NQRUVEOiBudW1iZXIgPSAwLjA0OyAvLyBpbiB1bml0cyBwZXIgc2Vjb25kIHRpY2ssIHBvc2l0aXZlIG1lYW5zIGRvd253YXJkIGdyYXZpdHksIG5lZ2F0aXZlIG1lYW5zIHVwd2FyZCBncmF2aXR5XHJcblx0RFJBR19DT0VGRklDSUVOVDogbnVtYmVyID0gMC4yMTsgLy8gYXJiaXRyYXJ5IG51bWJlciwgMCBtZWFucyBubyBkcmFnXHJcblxyXG5cdC8vIENIQVJBQ1RFUiBTSE9VTEQgQkUgUk9VR0hMWSAxMiBQSVhFTFMgQlkgMjAgUElYRUxTXHJcblxyXG5cdHBpY2tlZFVwU2xvdCA9IC0xO1xyXG5cclxuXHR3b3JsZE1vdXNlWCA9IDA7IC8vIHRoZSBtb3VzZSBwb3NpdGlvbiBpbiB3b3JsZCBjb29yZGluYXRlc1xyXG5cdHdvcmxkTW91c2VZID0gMDsgLy8gdGhlIG1vdXNlIHBvc2l0aW9uIGluIHdvcmxkIGNvb3JkaW5hdGVzXHJcblx0bGFzdEN1cnNvck1vdmUgPSBEYXRlLm5vdygpXHJcblx0bW91c2VPbiA9IHRydWU7IC8vIGlzIHRoZSBtb3VzZSBvbiB0aGUgd2luZG93P1xyXG5cclxuXHRrZXlzOiBib29sZWFuW10gPSBbXTtcclxuXHJcblx0Ly8gdGhlIGtleWNvZGUgZm9yIHRoZSBrZXkgdGhhdCBkb2VzIHRoZSBhY3Rpb25cclxuXHRjb250cm9sczogQ29udHJvbFtdID0gW1xyXG5cdFx0bmV3IENvbnRyb2woXHJcblx0XHRcdCdXYWxrIFJpZ2h0JyxcclxuXHRcdFx0dHJ1ZSxcclxuXHRcdFx0NjgsXHJcblx0XHRcdCgpID0+IHtcclxuXHRcdFx0XHRpZiAodGhpcy5jdXJyZW50VWkgIT09IHVuZGVmaW5lZCkgcmV0dXJuO1xyXG5cdFx0XHRcdHRoaXMud29ybGQucGxheWVyLnJpZ2h0QnV0dG9uID0gdHJ1ZTtcclxuXHRcdFx0fSxcclxuXHRcdFx0KCkgPT4ge1xyXG5cdFx0XHRcdGlmICh0aGlzLmN1cnJlbnRVaSAhPT0gdW5kZWZpbmVkKSByZXR1cm47XHJcblx0XHRcdFx0dGhpcy53b3JsZC5wbGF5ZXIucmlnaHRCdXR0b24gPSBmYWxzZTtcclxuXHRcdFx0fSxcclxuXHRcdCksIC8vIHJpZ2h0XHJcblx0XHRuZXcgQ29udHJvbChcclxuXHRcdFx0J1dhbGsgTGVmdCcsXHJcblx0XHRcdHRydWUsXHJcblx0XHRcdDY1LFxyXG5cdFx0XHQoKSA9PiB7XHJcblx0XHRcdFx0aWYgKHRoaXMuY3VycmVudFVpICE9PSB1bmRlZmluZWQpIHJldHVybjtcclxuXHRcdFx0XHR0aGlzLndvcmxkLnBsYXllci5sZWZ0QnV0dG9uID0gdHJ1ZTtcclxuXHRcdFx0fSxcclxuXHRcdFx0KCkgPT4ge1xyXG5cdFx0XHRcdGlmICh0aGlzLmN1cnJlbnRVaSAhPT0gdW5kZWZpbmVkKSByZXR1cm47XHJcblx0XHRcdFx0dGhpcy53b3JsZC5wbGF5ZXIubGVmdEJ1dHRvbiA9IGZhbHNlO1xyXG5cdFx0XHR9LFxyXG5cdFx0KSwgLy8gbGVmdFxyXG5cdFx0bmV3IENvbnRyb2woXHJcblx0XHRcdCdKdW1wJyxcclxuXHRcdFx0dHJ1ZSxcclxuXHRcdFx0ODcsXHJcblx0XHRcdCgpID0+IHtcclxuXHRcdFx0XHRpZiAodGhpcy5jdXJyZW50VWkgIT09IHVuZGVmaW5lZCkgcmV0dXJuO1xyXG5cdFx0XHRcdHRoaXMud29ybGQucGxheWVyLmp1bXBCdXR0b24gPSB0cnVlO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHQoKSA9PiB7XHJcblx0XHRcdFx0aWYgKHRoaXMuY3VycmVudFVpICE9PSB1bmRlZmluZWQpIHJldHVybjtcclxuXHRcdFx0XHR0aGlzLndvcmxkLnBsYXllci5qdW1wQnV0dG9uID0gZmFsc2U7XHJcblx0XHRcdH0sXHJcblx0XHQpLCAvLyBqdW1wXHJcblx0XHRuZXcgQ29udHJvbCgnUGF1c2UnLCB0cnVlLCAyNywgKCkgPT4ge1xyXG5cdFx0XHQvL2lmIGludmVudG9yeSBvcGVue1xyXG5cdFx0XHQvL2Nsb3NlIGludmVudG9yeVxyXG5cdFx0XHQvL3JldHVybjt9XHJcblx0XHRcdGlmICh0aGlzLmN1cnJlbnRVaSA9PT0gdW5kZWZpbmVkKVxyXG5cdFx0XHRcdHRoaXMuY3VycmVudFVpID0gbmV3IFBhdXNlTWVudShGb250cy50aXRsZSwgRm9udHMuYmlnKTtcclxuXHRcdFx0ZWxzZSB0aGlzLmN1cnJlbnRVaSA9IHVuZGVmaW5lZDtcclxuXHRcdH0pLCAvLyBzZXR0aW5nc1xyXG5cdFx0bmV3IENvbnRyb2woJ0ludmVudG9yeScsIHRydWUsIDY5LCAoKSA9PiB7XHJcblx0XHRcdC8vaWYgdWkgb3BlbiByZXR1cm47XHJcblx0XHRcdC8vaWYgaW52ZW50b3J5IGNsb3NlZCBvcGVuIGludmVudG9yeVxyXG5cdFx0XHQvL2Vsc2UgY2xvc2UgaW52ZW50b3J5XHJcblx0XHRcdGNvbnNvbGUubG9nKCdpbnZlbnRvcnkgaGFzIG5vdCBiZWVuIGltcGxlbWVudGVkIHlldCcpO1xyXG5cdFx0fSksIC8vIGludmVudG9yeVxyXG5cdFx0bmV3IENvbnRyb2woJ0hvdGJhciAxJywgdHJ1ZSwgNDksICgpID0+IHtcclxuXHRcdFx0dGhpcy53b3JsZC5pbnZlbnRvcnkuc2VsZWN0ZWRTbG90ID0gMDtcclxuXHRcdH0pLCAvLyBob3QgYmFyIDFcclxuXHRcdG5ldyBDb250cm9sKCdIb3RiYXIgMicsIHRydWUsIDUwLCAoKSA9PiB7XHJcblx0XHRcdHRoaXMud29ybGQuaW52ZW50b3J5LnNlbGVjdGVkU2xvdCA9IDE7XHJcblx0XHR9KSwgLy8gaG90IGJhciAyXHJcblx0XHRuZXcgQ29udHJvbCgnSG90YmFyIDMnLCB0cnVlLCA1MSwgKCkgPT4ge1xyXG5cdFx0XHR0aGlzLndvcmxkLmludmVudG9yeS5zZWxlY3RlZFNsb3QgPSAyO1xyXG5cdFx0fSksIC8vIGhvdCBiYXIgM1xyXG5cdFx0bmV3IENvbnRyb2woJ0hvdGJhciA0JywgdHJ1ZSwgNTIsICgpID0+IHtcclxuXHRcdFx0dGhpcy53b3JsZC5pbnZlbnRvcnkuc2VsZWN0ZWRTbG90ID0gMztcclxuXHRcdH0pLCAvLyBob3QgYmFyIDRcclxuXHRcdG5ldyBDb250cm9sKCdIb3RiYXIgNScsIHRydWUsIDUzLCAoKSA9PiB7XHJcblx0XHRcdHRoaXMud29ybGQuaW52ZW50b3J5LnNlbGVjdGVkU2xvdCA9IDQ7XHJcblx0XHR9KSwgLy8gaG90IGJhciA1XHJcblx0XHRuZXcgQ29udHJvbCgnSG90YmFyIDYnLCB0cnVlLCA1NCwgKCkgPT4ge1xyXG5cdFx0XHR0aGlzLndvcmxkLmludmVudG9yeS5zZWxlY3RlZFNsb3QgPSA1O1xyXG5cdFx0fSksIC8vIGhvdCBiYXIgNlxyXG5cdFx0bmV3IENvbnRyb2woJ0hvdGJhciA3JywgdHJ1ZSwgNTUsICgpID0+IHtcclxuXHRcdFx0dGhpcy53b3JsZC5pbnZlbnRvcnkuc2VsZWN0ZWRTbG90ID0gNjtcclxuXHRcdH0pLCAvLyBob3QgYmFyIDdcclxuXHRcdG5ldyBDb250cm9sKCdIb3RiYXIgOCcsIHRydWUsIDU2LCAoKSA9PiB7XHJcblx0XHRcdHRoaXMud29ybGQuaW52ZW50b3J5LnNlbGVjdGVkU2xvdCA9IDc7XHJcblx0XHR9KSwgLy8gaG90IGJhciA4XHJcblx0XHRuZXcgQ29udHJvbCgnSG90YmFyIDknLCB0cnVlLCA1NywgKCkgPT4ge1xyXG5cdFx0XHR0aGlzLndvcmxkLmludmVudG9yeS5zZWxlY3RlZFNsb3QgPSA4O1xyXG5cdFx0fSksIC8vIGhvdCBiYXIgOVxyXG5cdFx0bmV3IENvbnRyb2woJ0hvdGJhciAxMCcsIHRydWUsIDQ4LCAoKSA9PiB7XHJcblx0XHRcdHRoaXMud29ybGQuaW52ZW50b3J5LnNlbGVjdGVkU2xvdCA9IDk7XHJcblx0XHR9KSwgLy8gaG90IGJhciAxMFxyXG5cdFx0bmV3IENvbnRyb2woJ0hvdGJhciAxMScsIHRydWUsIDE4OSwgKCkgPT4ge1xyXG5cdFx0XHR0aGlzLndvcmxkLmludmVudG9yeS5zZWxlY3RlZFNsb3QgPSAxMDtcclxuXHRcdH0pLCAvLyBob3QgYmFyIDExXHJcblx0XHRuZXcgQ29udHJvbCgnSG90YmFyIDEyJywgdHJ1ZSwgMTg3LCAoKSA9PiB7XHJcblx0XHRcdHRoaXMud29ybGQuaW52ZW50b3J5LnNlbGVjdGVkU2xvdCA9IDExO1xyXG5cdFx0fSksIC8vIGhvdCBiYXIgMTJcclxuXHRdO1xyXG5cclxuXHRjYW52YXM6IHA1LlJlbmRlcmVyOyAvL3RoZSBjYW52YXMgZm9yIHRoZSBnYW1lXHJcblx0c2t5TGF5ZXI6IHA1LkdyYXBoaWNzOyAvL2EgcDUuR3JhcGhpY3Mgb2JqZWN0IHRoYXQgdGhlIHNoYWRlciBpcyBkcmF3biBvbnRvLiAgdGhpcyBpc24ndCB0aGUgYmVzdCB3YXkgdG8gZG8gdGhpcywgYnV0IHRoZSBtYWluIGdhbWUgY2FudmFzIGlzbid0IFdFQkdMLCBhbmQgaXQncyB0b28gbXVjaCB3b3JrIHRvIGNoYW5nZSB0aGF0XHJcblx0c2t5U2hhZGVyOiBwNS5TaGFkZXI7IC8vdGhlIHNoYWRlciB0aGF0IGRyYXdzIHRoZSBza3kgKHRoZSBwYXRoIGZvciB0aGlzIGlzIGluIHRoZSBwdWJsaWMgZm9sZGVyKVxyXG5cclxuXHR3b3JsZDogV29ybGQ7XHJcblxyXG5cdGN1cnJlbnRVaTogVWlTY3JlZW4gfCB1bmRlZmluZWQ7XHJcblxyXG5cdGNvbm5lY3Rpb246IFNvY2tldDxTZXJ2ZXJFdmVudHMsIENsaWVudEV2ZW50cz47XHJcblxyXG5cdG5ldE1hbmFnZXI6IE5ldE1hbmFnZXI7XHJcblxyXG5cdC8vY2hhbmdlYWJsZSBvcHRpb25zIGZyb20gbWVudXNcclxuXHRzZXJ2ZXJWaXNpYmlsaXR5OiBzdHJpbmc7XHJcblx0d29ybGRCdW1waW5lc3M6IG51bWJlcjtcclxuXHRza3lNb2Q6IG51bWJlcjtcclxuXHRza3lUb2dnbGU6IGJvb2xlYW47XHJcblx0cGFydGljbGVNdWx0aXBsaWVyOiBudW1iZXI7XHJcblxyXG5cdHBhcnRpY2xlczogQ29sb3JQYXJ0aWNsZSAvKnxGb290c3RlcFBhcnRpY2xlKi9bXTtcclxuXHJcblx0Y29uc3RydWN0b3IoY29ubmVjdGlvbjogU29ja2V0KSB7XHJcblx0XHRzdXBlcigoKSA9PiB7IH0pOyAvLyBUbyBjcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgcDUgaXQgd2lsbCBjYWxsIGJhY2sgd2l0aCB0aGUgaW5zdGFuY2UuIFdlIGRvbid0IG5lZWQgdGhpcyBzaW5jZSB3ZSBhcmUgZXh0ZW5kaW5nIHRoZSBjbGFzc1xyXG5cdFx0dGhpcy5jb25uZWN0aW9uID0gY29ubmVjdGlvbjtcclxuXHJcblx0XHQvLyBJbml0aWFsaXNlIHRoZSBuZXR3b3JrIG1hbmFnZXJcclxuXHRcdHRoaXMubmV0TWFuYWdlciA9IG5ldyBOZXRNYW5hZ2VyKHRoaXMpO1xyXG5cdH1cclxuXHJcblx0cHJlbG9hZCgpIHtcclxuXHRcdGNvbnNvbGUubG9nKCdMb2FkaW5nIGFzc2V0cycpO1xyXG5cdFx0bG9hZEFzc2V0cyhcclxuXHRcdFx0dGhpcyxcclxuXHRcdFx0VWlBc3NldHMsXHJcblx0XHRcdEl0ZW1Bc3NldHMsXHJcblx0XHRcdFdvcmxkQXNzZXRzLFxyXG5cdFx0XHRGb250cyxcclxuXHRcdFx0UGxheWVyQW5pbWF0aW9ucyxcclxuXHRcdCk7XHJcblx0XHRjb25zb2xlLmxvZygnQXNzZXQgbG9hZGluZyBjb21wbGV0ZWQnKTtcclxuXHRcdHRoaXMuc2t5U2hhZGVyID0gdGhpcy5sb2FkU2hhZGVyKFxyXG5cdFx0XHQnYXNzZXRzL3NoYWRlcnMvYmFzaWMudmVydCcsXHJcblx0XHRcdCdhc3NldHMvc2hhZGVycy9za3kuZnJhZycsXHJcblx0XHQpO1xyXG5cdH1cclxuXHJcblx0c2V0dXAoKSB7XHJcblx0XHRjb25zb2xlLmxvZygnc2V0dXAgY2FsbGVkJyk7XHJcblx0XHQvLyBtYWtlIGEgY2FudmFzIHRoYXQgZmlsbHMgdGhlIHdob2xlIHNjcmVlbiAoYSBjYW52YXMgaXMgd2hhdCBpcyBkcmF3biB0byBpbiBwNS5qcywgYXMgd2VsbCBhcyBsb3RzIG9mIG90aGVyIEpTIHJlbmRlcmluZyBsaWJyYXJpZXMpXHJcblx0XHR0aGlzLmNhbnZhcyA9IHRoaXMuY3JlYXRlQ2FudmFzKHRoaXMud2luZG93V2lkdGgsIHRoaXMud2luZG93SGVpZ2h0KTtcclxuXHRcdHRoaXMuY2FudmFzLm1vdXNlT3V0KHRoaXMubW91c2VFeGl0ZWQpO1xyXG5cdFx0dGhpcy5jYW52YXMubW91c2VPdmVyKHRoaXMubW91c2VFbnRlcmVkKTtcclxuXHJcblx0XHR0aGlzLnNreUxheWVyID0gdGhpcy5jcmVhdGVHcmFwaGljcyh0aGlzLndpZHRoLCB0aGlzLmhlaWdodCwgJ3dlYmdsJyk7XHJcblxyXG5cdFx0dGhpcy5jdXJyZW50VWkgPSBuZXcgTWFpbk1lbnUoRm9udHMudGl0bGUsIEZvbnRzLmJpZyk7XHJcblxyXG5cdFx0Ly8gVGlja1xyXG5cdFx0c2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG5cdFx0XHRpZiAodGhpcy53b3JsZCA9PT0gdW5kZWZpbmVkKSByZXR1cm47XHJcblx0XHRcdHRoaXMud29ybGQudGljayh0aGlzKTtcclxuXHRcdH0sIDEwMDAgLyB0aGlzLm5ldE1hbmFnZXIucGxheWVyVGlja1JhdGUpO1xyXG5cclxuXHRcdHRoaXMuY29ubmVjdGlvbi5lbWl0KFxyXG5cdFx0XHQnam9pbicsXHJcblx0XHRcdCdlNDAyMmQ0MDNkY2M2ZDE5ZDZhNjhiYTNhYmZkMGE2MCcsXHJcblx0XHRcdCdwbGF5ZXInICsgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwMCksXHJcblx0XHQpO1xyXG5cclxuXHRcdC8vIGdvIGZvciBhIHNjYWxlIG9mIDw2NCB0aWxlcyB3aWRlIHNjcmVlblxyXG5cdFx0dGhpcy53aW5kb3dSZXNpemVkKCk7XHJcblxyXG5cdFx0Ly8gcmVtb3ZlIHRleHR1cmUgaW50ZXJwb2xhdGlvbiAoZW5hYmxlIHBvaW50IGZpbHRlcmluZyBmb3IgaW1hZ2VzKVxyXG5cdFx0dGhpcy5ub1Ntb290aCgpO1xyXG5cclxuXHRcdC8vIHRoZSBoaWdoZXN0IGtleWNvZGUgaXMgMjU1LCB3aGljaCBpcyBcIlRvZ2dsZSBUb3VjaHBhZFwiLCBhY2NvcmRpbmcgdG8ga2V5Y29kZS5pbmZvXHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IDI1NTsgaSsrKSB7XHJcblx0XHRcdHRoaXMua2V5cy5wdXNoKGZhbHNlKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBzZXQgdGhlIGZyYW1lcmF0ZSBnb2FsIHRvIGFzIGhpZ2ggYXMgcG9zc2libGUgKHRoaXMgd2lsbCBlbmQgdXAgY2FwcGluZyB0byB5b3VyIG1vbml0b3IncyByZWZyZXNoIHJhdGUgd2l0aCB2c3luYy4pXHJcblx0XHR0aGlzLmZyYW1lUmF0ZShJbmZpbml0eSk7XHJcblx0XHQvLyBBdWRpb0Fzc2V0cy5hbWJpZW50LndpbnRlcjEucGxheVNvdW5kKCk7XHJcblx0XHR0aGlzLnBhcnRpY2xlTXVsdGlwbGllciA9IDE7XHJcblx0XHR0aGlzLnNreVRvZ2dsZSA9IHRydWU7XHJcblx0XHR0aGlzLnNreU1vZCA9IDI7XHJcblx0XHR0aGlzLnBhcnRpY2xlcyA9IFtdO1xyXG5cdFx0dGhpcy5jdXJzb3IoXCJhc3NldHMvdGV4dHVyZXMvdWkvY3Vyc29yMi5wbmdcIik7XHJcblx0fVxyXG5cclxuXHRkcmF3KCkge1xyXG5cdFx0aWYgKHRoaXMuZnJhbWVDb3VudCA9PT0gMikge1xyXG5cdFx0XHQvL2hhcyB0byBiZSBkb25lIG9uIHRoZSBzZWNvbmQgZnJhbWUgZm9yIHNvbWUgcmVhc29uP1xyXG5cdFx0XHR0aGlzLnNreVNoYWRlci5zZXRVbmlmb3JtKCdzY3JlZW5EaW1lbnNpb25zJywgW1xyXG5cdFx0XHRcdCh0aGlzLndpZHRoIC8gdGhpcy51cHNjYWxlU2l6ZSkgKiAyLFxyXG5cdFx0XHRcdCh0aGlzLmhlaWdodCAvIHRoaXMudXBzY2FsZVNpemUpICogMixcclxuXHRcdFx0XSk7XHJcblx0XHRcdHRoaXMuc2t5U2hhZGVyLnNldFVuaWZvcm0oXHJcblx0XHRcdFx0J3NreUltYWdlJyxcclxuXHRcdFx0XHRXb3JsZEFzc2V0cy5zaGFkZXJSZXNvdXJjZXMuc2t5SW1hZ2UuaW1hZ2UsXHJcblx0XHRcdCk7XHJcblx0XHR9XHJcblx0XHQvLyBkbyB0aGUgdGljayBjYWxjdWxhdGlvbnNcclxuXHRcdHRoaXMuZG9UaWNrcygpO1xyXG5cclxuXHRcdC8vIHVwZGF0ZSBtb3VzZSBwb3NpdGlvblxyXG5cdFx0dGhpcy51cGRhdGVNb3VzZSgpO1xyXG5cclxuXHRcdC8vIHVwZGF0ZSB0aGUgY2FtZXJhJ3MgaW50ZXJwb2xhdGlvblxyXG5cdFx0dGhpcy5tb3ZlQ2FtZXJhKCk7XHJcblxyXG5cdFx0Ly8gd2lwZSB0aGUgc2NyZWVuIHdpdGggYSBoYXBweSBsaXR0bGUgbGF5ZXIgb2YgbGlnaHQgYmx1ZVxyXG5cdFx0dGhpcy5za3lTaGFkZXIuc2V0VW5pZm9ybSgnb2Zmc2V0Q29vcmRzJywgW1xyXG5cdFx0XHR0aGlzLmludGVycG9sYXRlZENhbVgsXHJcblx0XHRcdHRoaXMuaW50ZXJwb2xhdGVkQ2FtWSxcclxuXHRcdF0pO1xyXG5cdFx0dGhpcy5za3lTaGFkZXIuc2V0VW5pZm9ybSgnbWlsbGlzJywgdGhpcy5taWxsaXMoKSk7XHJcblx0XHR0aGlzLnNreUxheWVyLnNoYWRlcih0aGlzLnNreVNoYWRlcik7XHJcblx0XHQvLyB0aGlzLmZpbGwoMjU1LCAwLCAwKTtcclxuXHRcdHRoaXMuc2t5TGF5ZXIucmVjdCgwLCAwLCB0aGlzLnNreUxheWVyLndpZHRoLCB0aGlzLnNreUxheWVyLmhlaWdodCk7XHJcblxyXG5cdFx0dGhpcy5pbWFnZSh0aGlzLnNreUxheWVyLCAwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XHJcblxyXG5cdFx0aWYgKHRoaXMud29ybGQgIT09IHVuZGVmaW5lZCkgdGhpcy53b3JsZC5yZW5kZXIodGhpcywgdGhpcy51cHNjYWxlU2l6ZSk7XHJcblxyXG5cdFx0Ly8gcmVuZGVyIHRoZSBwbGF5ZXIsIGFsbCBpdGVtcywgZXRjLlxyXG5cdFx0dGhpcy5yZW5kZXJFbnRpdGllcygpO1xyXG5cclxuXHRcdC8vZGVsZXRlIGFueSBwYXJ0aWNsZXMgdGhhdCBoYXZlIGdvdHRlbiB0b28gb2xkXHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGFydGljbGVzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGlmICh0aGlzLnBhcnRpY2xlc1tpXS5hZ2UgPiB0aGlzLnBhcnRpY2xlc1tpXS5saWZlc3Bhbikge1xyXG5cdFx0XHRcdHRoaXMucGFydGljbGVzLnNwbGljZShpLCAxKTtcclxuXHRcdFx0XHRpLS07XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHQvL25vIG91dGxpbmUgb24gcGFydGljbGVzXHJcblx0XHR0aGlzLm5vU3Ryb2tlKCk7XHJcblx0XHQvL2RyYXcgYWxsIG9mIHRoZSBwYXJ0aWNsZXNcclxuXHRcdGZvciAobGV0IHBhcnRpY2xlIG9mIHRoaXMucGFydGljbGVzKSB7XHJcblx0XHRcdHBhcnRpY2xlLnJlbmRlcih0aGlzLCB0aGlzLnVwc2NhbGVTaXplKTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLnNtb290aCgpOyAvL2VuYWJsZSBpbWFnZSBsZXJwXHJcblx0XHR0aGlzLnRpbnQoMjU1LCAxNTApOyAvL21ha2UgaW1hZ2UgdHJhbnNsdWNlbnRcclxuXHRcdFVpQXNzZXRzLnZpZ25ldHRlLnJlbmRlcih0aGlzLCAwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XHJcblx0XHR0aGlzLm5vVGludCgpO1xyXG5cdFx0dGhpcy5ub1Ntb290aCgpO1xyXG5cclxuXHRcdC8vIGRyYXcgdGhlIGhvdCBiYXJcclxuXHRcdGlmICh0aGlzLndvcmxkICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLndvcmxkLmludmVudG9yeS53aWR0aDsgaSsrKSB7XHJcblx0XHRcdFx0Y29uc3QgY3VycmVudEl0ZW0gPSB0aGlzLndvcmxkLmludmVudG9yeS5pdGVtc1tpXTtcclxuXHJcblx0XHRcdFx0VWlBc3NldHMudWlfc2xvdC5yZW5kZXIoXHJcblx0XHRcdFx0XHR0aGlzLFxyXG5cdFx0XHRcdFx0MiAqIHRoaXMudXBzY2FsZVNpemUgKyAxNiAqIGkgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHRcdFx0MiAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdFx0XHQxNiAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdFx0XHQxNiAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdFx0KTtcclxuXHJcblx0XHRcdFx0aWYgKHRoaXMud29ybGQuaW52ZW50b3J5LnNlbGVjdGVkU2xvdCA9PT0gaSkge1xyXG5cdFx0XHRcdFx0VWlBc3NldHMudWlfc2xvdF9zZWxlY3RlZC5yZW5kZXIoXHJcblx0XHRcdFx0XHRcdHRoaXMsXHJcblx0XHRcdFx0XHRcdDIgKiB0aGlzLnVwc2NhbGVTaXplICsgMTYgKiBpICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0XHRcdFx0MiAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdFx0XHRcdDE2ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0XHRcdFx0MTYgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHRcdFx0KTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0VWlBc3NldHMudWlfc2xvdC5yZW5kZXIoXHJcblx0XHRcdFx0XHRcdHRoaXMsXHJcblx0XHRcdFx0XHRcdDIgKiB0aGlzLnVwc2NhbGVTaXplICsgMTYgKiBpICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0XHRcdFx0MiAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdFx0XHRcdDE2ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0XHRcdFx0MTYgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHRcdFx0KTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmIChjdXJyZW50SXRlbSAhPT0gdW5kZWZpbmVkICYmIGN1cnJlbnRJdGVtICE9PSBudWxsKSB7XHJcblx0XHRcdFx0XHR0aGlzLmZpbGwoMCk7XHJcblx0XHRcdFx0XHRpZiAodGhpcy5waWNrZWRVcFNsb3QgPT09IGkpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy50aW50KDI1NSwgMTI3KTtcclxuXHRcdFx0XHRcdFx0dGhpcy5maWxsKDAsIDEyNyk7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0SXRlbUFzc2V0c1tjdXJyZW50SXRlbS5pdGVtXS5yZW5kZXIoXHJcblx0XHRcdFx0XHRcdHRoaXMsXHJcblx0XHRcdFx0XHRcdDYgKiB0aGlzLnVwc2NhbGVTaXplICsgMTYgKiBpICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0XHRcdFx0NiAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdFx0XHRcdDggKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHRcdFx0XHQ4ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0XHRcdCk7XHJcblxyXG5cdFx0XHRcdFx0Rm9udHMudG9tX3RodW1iLmRyYXdUZXh0KHRoaXMsIGN1cnJlbnRJdGVtLnF1YW50aXR5LnRvU3RyaW5nKCksICgtNCAqIGN1cnJlbnRJdGVtLnF1YW50aXR5LnRvU3RyaW5nKCkubGVuZ3RoICsgMTYgKiAoaSsxLjA2MjUpKSAqIHRoaXMudXBzY2FsZVNpemUsIDExICogdGhpcy51cHNjYWxlU2l6ZSlcclxuXHRcdFx0XHRcdC8vIHRoaXMudGV4dChcclxuXHRcdFx0XHRcdC8vIFx0Y3VycmVudEl0ZW0ucXVhbnRpdHksXHJcblx0XHRcdFx0XHQvLyBcdDE2ICogdGhpcy51cHNjYWxlU2l6ZSArIDE2ICogaSAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdFx0XHQvLyBcdDE2ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0XHRcdC8vICk7XHJcblxyXG5cdFx0XHRcdFx0dGhpcy5ub1RpbnQoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIGRyYXcgdGhlIGN1cnNvclxyXG5cdFx0XHR0aGlzLmRyYXdDdXJzb3IoKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy5jdXJyZW50VWkgIT09IHVuZGVmaW5lZClcclxuXHRcdFx0dGhpcy5jdXJyZW50VWkucmVuZGVyKHRoaXMsIHRoaXMudXBzY2FsZVNpemUpO1xyXG5cdFx0aWYgKHRoaXMuY3VycmVudFVpICE9PSB1bmRlZmluZWQpXHJcblx0XHRcdHRoaXMuY3VycmVudFVpLnJlbmRlcih0aGlzLCB0aGlzLnVwc2NhbGVTaXplKTtcclxuXHJcblx0XHRGb250cy50b21fdGh1bWIuZHJhd1RleHQodGhpcywgXCJTbm93ZWQgSW4gdjEuMC4wXCIsIHRoaXMudXBzY2FsZVNpemUsIHRoaXMuaGVpZ2h0LTYqdGhpcy51cHNjYWxlU2l6ZSk7XHJcblxyXG5cdFx0Ly8gY29uc29sZS50aW1lRW5kKFwiZnJhbWVcIik7XHJcblx0fVxyXG5cclxuXHR3aW5kb3dSZXNpemVkKCkge1xyXG5cdFx0dGhpcy5yZXNpemVDYW52YXModGhpcy53aW5kb3dXaWR0aCwgdGhpcy53aW5kb3dIZWlnaHQpO1xyXG5cdFx0dGhpcy5za3lMYXllci5yZXNpemVDYW52YXModGhpcy53aW5kb3dXaWR0aCwgdGhpcy53aW5kb3dIZWlnaHQpO1xyXG5cclxuXHRcdC8vIGdvIGZvciBhIHNjYWxlIG9mIDw0OCB0aWxlcyBzY3JlZW5cclxuXHRcdHRoaXMudXBzY2FsZVNpemUgPSBNYXRoLm1pbihcclxuXHRcdFx0TWF0aC5jZWlsKHRoaXMud2luZG93V2lkdGggLyA0OCAvIHRoaXMuVElMRV9XSURUSCksXHJcblx0XHRcdE1hdGguY2VpbCh0aGlzLndpbmRvd0hlaWdodCAvIDQ4IC8gdGhpcy5USUxFX0hFSUdIVCksXHJcblx0XHQpO1xyXG5cclxuXHRcdHRoaXMuc2t5U2hhZGVyLnNldFVuaWZvcm0oJ3NjcmVlbkRpbWVuc2lvbnMnLCBbXHJcblx0XHRcdCh0aGlzLndpbmRvd1dpZHRoIC8gdGhpcy51cHNjYWxlU2l6ZSkgKiAyLFxyXG5cdFx0XHQodGhpcy53aW5kb3dIZWlnaHQgLyB0aGlzLnVwc2NhbGVTaXplKSAqIDIsXHJcblx0XHRdKTtcclxuXHJcblx0XHRpZiAodGhpcy5jdXJyZW50VWkgIT09IHVuZGVmaW5lZCkgdGhpcy5jdXJyZW50VWkud2luZG93VXBkYXRlKCk7XHJcblx0fVxyXG5cclxuXHRrZXlQcmVzc2VkKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XHJcblx0XHR0aGlzLmtleXNbdGhpcy5rZXlDb2RlXSA9IHRydWU7XHJcblx0XHRmb3IgKGxldCBjb250cm9sIG9mIHRoaXMuY29udHJvbHMpIHtcclxuXHRcdFx0aWYgKGNvbnRyb2wua2V5Ym9hcmQgJiYgY29udHJvbC5rZXlDb2RlID09PSBldmVudC5rZXlDb2RlKVxyXG5cdFx0XHRcdC8vZXZlbnQua2V5Q29kZSBpcyBkZXByZWNhdGVkIGJ1dCBpIGRvbid0IGNhcmVcclxuXHRcdFx0XHRjb250cm9sLm9uUHJlc3NlZCgpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKFxyXG5cdFx0XHR0aGlzLmN1cnJlbnRVaSAhPT0gdW5kZWZpbmVkICYmXHJcblx0XHRcdHRoaXMuY3VycmVudFVpLmlucHV0Qm94ZXMgIT09IHVuZGVmaW5lZFxyXG5cdFx0KSB7XHJcblx0XHRcdGZvciAobGV0IGkgb2YgdGhpcy5jdXJyZW50VWkuaW5wdXRCb3hlcykge1xyXG5cdFx0XHRcdGlmIChpLmxpc3RlbmluZykge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ3Rlc3QzJyk7XHJcblx0XHRcdFx0XHRpLmxpc3RlbmluZyA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0dGhpcy5jb250cm9sc1tpLmluZGV4XS5rZXlDb2RlID0gZXZlbnQua2V5Q29kZTtcclxuXHRcdFx0XHRcdHRoaXMuY29udHJvbHNbaS5pbmRleF0ua2V5Ym9hcmQgPSBmYWxzZTtcclxuXHRcdFx0XHRcdGkudmFsdWUgPSBldmVudC5rZXlDb2RlO1xyXG5cdFx0XHRcdFx0aS5rZXlib2FyZCA9IHRydWU7XHJcblx0XHRcdFx0XHRpLmltYWdlID0gVWlBc3NldHMuYnV0dG9uX3Vuc2VsZWN0ZWQ7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRrZXlSZWxlYXNlZChldmVudDogS2V5Ym9hcmRFdmVudCkge1xyXG5cdFx0dGhpcy5rZXlzW3RoaXMua2V5Q29kZV0gPSBmYWxzZTtcclxuXHRcdGZvciAobGV0IGNvbnRyb2wgb2YgdGhpcy5jb250cm9scykge1xyXG5cdFx0XHRpZiAoY29udHJvbC5rZXlib2FyZCAmJiBjb250cm9sLmtleUNvZGUgPT09IGV2ZW50LmtleUNvZGUpXHJcblx0XHRcdFx0Ly9ldmVudC5rZXlDb2RlIGlzIGRlcHJlY2F0ZWQgYnV0IGkgZG9uJ3QgY2FyZVxyXG5cdFx0XHRcdGNvbnRyb2wub25SZWxlYXNlZCgpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Ly8gd2hlbiBpdCdzIGRyYWdnZWQgdXBkYXRlIHRoZSBzbGlkZXJzXHJcblx0bW91c2VEcmFnZ2VkKCkge1xyXG5cdFx0aWYgKFxyXG5cdFx0XHR0aGlzLmN1cnJlbnRVaSAhPT0gdW5kZWZpbmVkICYmXHJcblx0XHRcdHRoaXMuY3VycmVudFVpLnNsaWRlcnMgIT09IHVuZGVmaW5lZFxyXG5cdFx0KSB7XHJcblx0XHRcdGZvciAoY29uc3QgaSBvZiB0aGlzLmN1cnJlbnRVaS5zbGlkZXJzKSB7XHJcblx0XHRcdFx0aS51cGRhdGVTbGlkZXJQb3NpdGlvbih0aGlzLm1vdXNlWCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdG1vdXNlTW92ZWQoKSB7XHJcblx0XHRpZiAodGhpcy5jdXJyZW50VWkgIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRpZiAodGhpcy5jdXJyZW50VWkuYnV0dG9ucyAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0Zm9yIChjb25zdCBpIG9mIHRoaXMuY3VycmVudFVpLmJ1dHRvbnMpIHtcclxuXHRcdFx0XHRcdGkudXBkYXRlTW91c2VPdmVyKHRoaXMubW91c2VYLCB0aGlzLm1vdXNlWSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmICh0aGlzLmN1cnJlbnRVaS5pbnB1dEJveGVzICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHRmb3IgKGNvbnN0IGkgb2YgdGhpcy5jdXJyZW50VWkuaW5wdXRCb3hlcykge1xyXG5cdFx0XHRcdFx0aS51cGRhdGVNb3VzZU92ZXIodGhpcy5tb3VzZVgsIHRoaXMubW91c2VZKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdG1vdXNlUHJlc3NlZChlOiBNb3VzZUV2ZW50KSB7XHJcblx0XHQvLyBpbWFnZSh1aVNsb3RJbWFnZSwgMip1cHNjYWxlU2l6ZSsxNippKnVwc2NhbGVTaXplLCAyKnVwc2NhbGVTaXplLCAxNip1cHNjYWxlU2l6ZSwgMTYqdXBzY2FsZVNpemUpO1xyXG5cdFx0aWYgKHRoaXMuY3VycmVudFVpICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0dGhpcy5jdXJyZW50VWkubW91c2VQcmVzc2VkKGUuYnV0dG9uKTtcclxuXHRcdFx0cmV0dXJuOyAvLyBhc2pnc2Fka2pmZ0lJU1VTVUVVRVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0aGlzLndvcmxkID09PSB1bmRlZmluZWQpIHJldHVybjtcclxuXHJcblx0XHRpZiAoXHJcblx0XHRcdHRoaXMubW91c2VYID4gMiAqIHRoaXMudXBzY2FsZVNpemUgJiZcclxuXHRcdFx0dGhpcy5tb3VzZVggPFxyXG5cdFx0XHQyICogdGhpcy51cHNjYWxlU2l6ZSArXHJcblx0XHRcdDE2ICogdGhpcy51cHNjYWxlU2l6ZSAqIHRoaXMud29ybGQuaW52ZW50b3J5LndpZHRoICYmXHJcblx0XHRcdHRoaXMubW91c2VZID4gMiAqIHRoaXMudXBzY2FsZVNpemUgJiZcclxuXHRcdFx0dGhpcy5tb3VzZVkgPCAxOCAqIHRoaXMudXBzY2FsZVNpemVcclxuXHRcdCkge1xyXG5cdFx0XHRjb25zdCBjbGlja2VkU2xvdDogbnVtYmVyID0gTWF0aC5mbG9vcihcclxuXHRcdFx0XHQodGhpcy5tb3VzZVggLSAyICogdGhpcy51cHNjYWxlU2l6ZSkgLyAxNiAvIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdCk7XHJcblxyXG5cdFx0XHRpZiAodGhpcy53b3JsZC5pbnZlbnRvcnkucGlja2VkVXBTbG90ID09PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHRpZiAodGhpcy53b3JsZC5pbnZlbnRvcnkuaXRlbXNbY2xpY2tlZFNsb3RdICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHRcdHRoaXMud29ybGQuaW52ZW50b3J5LnBpY2tlZFVwU2xvdCA9IGNsaWNrZWRTbG90O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHQvLyBTd2FwIGNsaWNrZWQgc2xvdCB3aXRoIHRoZSBwaWNrZWQgc2xvdFxyXG5cdFx0XHRcdHRoaXMuY29ubmVjdGlvbi5lbWl0KFxyXG5cdFx0XHRcdFx0J2ludmVudG9yeVN3YXAnLFxyXG5cdFx0XHRcdFx0dGhpcy53b3JsZC5pbnZlbnRvcnkucGlja2VkVXBTbG90LFxyXG5cdFx0XHRcdFx0Y2xpY2tlZFNsb3QsXHJcblx0XHRcdFx0KTtcclxuXHJcblx0XHRcdFx0Ly8gU2V0IHRoZSBwaWNrZWQgdXAgc2xvdCB0byBub3RoaW5nXHJcblx0XHRcdFx0dGhpcy53b3JsZC5pbnZlbnRvcnkucGlja2VkVXBTbG90ID0gdW5kZWZpbmVkO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLndvcmxkLmludmVudG9yeS53b3JsZENsaWNrKHRoaXMud29ybGRNb3VzZVgsIHRoaXMud29ybGRNb3VzZVkpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0bW91c2VSZWxlYXNlZCgpIHtcclxuXHRcdC8qXHJcblx0XHRpZih0aGlzLmN1cnJlbnRVaSAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdHRoaXMuY3VycmVudFVpLm1vdXNlUmVsZWFzZWQoKTtcclxuXHRcdH1cclxuXHRcdGNvbnN0IHJlbGVhc2VkU2xvdDogbnVtYmVyID0gTWF0aC5mbG9vcihcclxuXHRcdFx0KHRoaXMubW91c2VYIC0gMiAqIHRoaXMudXBzY2FsZVNpemUpIC8gMTYgLyB0aGlzLnVwc2NhbGVTaXplXHJcblx0XHQpO1xyXG5cclxuXHRcdGlmICh0aGlzLnBpY2tlZFVwU2xvdCAhPT0gLTEpIHtcclxuXHRcdFx0aWYgKFxyXG5cdFx0XHRcdHRoaXMubW91c2VYID4gMiAqIHRoaXMudXBzY2FsZVNpemUgJiZcclxuXHRcdFx0XHR0aGlzLm1vdXNlWCA8XHJcblx0XHRcdFx0XHQyICogdGhpcy51cHNjYWxlU2l6ZSArXHJcblx0XHRcdFx0XHRcdDE2ICogdGhpcy51cHNjYWxlU2l6ZSAqIHRoaXMuaG90QmFyLmxlbmd0aCAmJlxyXG5cdFx0XHRcdHRoaXMubW91c2VZID4gMiAqIHRoaXMudXBzY2FsZVNpemUgJiZcclxuXHRcdFx0XHR0aGlzLm1vdXNlWSA8IDE4ICogdGhpcy51cHNjYWxlU2l6ZVxyXG5cdFx0XHQpIHtcclxuXHRcdFx0XHQvLyBNYWtlIHN1cmUgdGhhdCB0aGUgc2xvdCB0aGF0IHRoZSBjdXJzb3Igd2FzIHJlbGVhc2VkIHdhcyBub3QgdGhlIHNsb3QgdGhhdCB3YXMgc2VsZWN0ZWRcclxuXHRcdFx0XHRpZiAocmVsZWFzZWRTbG90ID09PSB0aGlzLnBpY2tlZFVwU2xvdCkgcmV0dXJuO1xyXG5cclxuXHRcdFx0XHQvLyBTd2FwIHRoZSBwaWNrZWQgdXAgc2xvdCB3aXRoIHRoZSBzbG90IHRoZSBtb3VzZSB3YXMgcmVsZWFzZWQgb25cclxuXHRcdFx0XHRbdGhpcy5ob3RCYXJbdGhpcy5waWNrZWRVcFNsb3RdLCB0aGlzLmhvdEJhcltyZWxlYXNlZFNsb3RdXSA9IFtcclxuXHRcdFx0XHRcdHRoaXMuaG90QmFyW3JlbGVhc2VkU2xvdF0sXHJcblx0XHRcdFx0XHR0aGlzLmhvdEJhclt0aGlzLnBpY2tlZFVwU2xvdF0sXHJcblx0XHRcdFx0XTtcclxuXHJcblx0XHRcdFx0dGhpcy5waWNrZWRVcFNsb3QgPSAtMTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aGlzLmhvdEJhclt0aGlzLnBpY2tlZFVwU2xvdF0gPSB1bmRlZmluZWQ7XHJcblx0XHRcdFx0dGhpcy5waWNrZWRVcFNsb3QgPSAtMTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdCAqL1xyXG5cdH1cclxuXHJcblx0bW91c2VXaGVlbChldmVudDogYW55KSB7XHJcblx0XHQvL21vdXNlRXZlbnQgYXBwYXJlbnRseSBkb2Vzbid0IGhhdmUgYSBkZWx0YSBwcm9wZXJ0eSBzb29vb28gaWRrIHdoYXQgdG8gZG8gc29ycnkgZm9yIHRoZSBhbnkgdHlwZVxyXG5cdFx0aWYgKFxyXG5cdFx0XHR0aGlzLmN1cnJlbnRVaSAhPT0gdW5kZWZpbmVkICYmXHJcblx0XHRcdHRoaXMuY3VycmVudFVpLnNjcm9sbCAhPT0gdW5kZWZpbmVkXHJcblx0XHQpIHtcclxuXHRcdFx0dGhpcy5jdXJyZW50VWkuc2Nyb2xsICs9IGV2ZW50LmRlbHRhIC8gMTA7XHJcblx0XHRcdHRoaXMuY3VycmVudFVpLnNjcm9sbCA9IHRoaXMuY29uc3RyYWluKFxyXG5cdFx0XHRcdHRoaXMuY3VycmVudFVpLnNjcm9sbCxcclxuXHRcdFx0XHR0aGlzLmN1cnJlbnRVaS5taW5TY3JvbGwsXHJcblx0XHRcdFx0dGhpcy5jdXJyZW50VWkubWF4U2Nyb2xsLFxyXG5cdFx0XHQpO1xyXG5cdFx0XHRjb25zb2xlLmxvZyhcclxuXHRcdFx0XHRgU2Nyb2xsOiAke3RoaXMuY3VycmVudFVpLnNjcm9sbH0sIE1pbjogJHt0aGlzLmN1cnJlbnRVaS5taW5TY3JvbGx9LCBNYXg6ICR7dGhpcy5jdXJyZW50VWkubWF4U2Nyb2xsfWAsXHJcblx0XHRcdCk7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0dGhpcy53b3JsZC5pbnZlbnRvcnkuc2VsZWN0ZWRTbG90ICs9IE1hdGguZmxvb3IoZXZlbnQuZGVsdGEvMTAwKVxyXG5cdFx0XHR0aGlzLndvcmxkLmludmVudG9yeS5zZWxlY3RlZFNsb3QgPSB0aGlzLndvcmxkLmludmVudG9yeS5zZWxlY3RlZFNsb3QldGhpcy53b3JsZC5pbnZlbnRvcnkud2lkdGg7XHJcblx0XHRcdGlmKHRoaXMud29ybGQuaW52ZW50b3J5LnNlbGVjdGVkU2xvdDwwKSB0aGlzLndvcmxkLmludmVudG9yeS5zZWxlY3RlZFNsb3QgKz0gdGhpcy53b3JsZC5pbnZlbnRvcnkud2lkdGhcclxuXHRcdFx0Y29uc29sZS5sb2codGhpcy53b3JsZC5pbnZlbnRvcnkuc2VsZWN0ZWRTbG90KVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0bW92ZUNhbWVyYSgpIHtcclxuXHRcdHRoaXMuaW50ZXJwb2xhdGVkQ2FtWCA9XHJcblx0XHRcdHRoaXMucENhbVggK1xyXG5cdFx0XHQodGhpcy5jYW1YIC0gdGhpcy5wQ2FtWCkgKiB0aGlzLmFtb3VudFNpbmNlTGFzdFRpY2sgK1xyXG5cdFx0XHQodGhpcy5ub2lzZSh0aGlzLm1pbGxpcygpIC8gMjAwKSAtIDAuNSkgKiB0aGlzLnNjcmVlbnNoYWtlQW1vdW50O1xyXG5cdFx0dGhpcy5pbnRlcnBvbGF0ZWRDYW1ZID1cclxuXHRcdFx0dGhpcy5wQ2FtWSArXHJcblx0XHRcdCh0aGlzLmNhbVkgLSB0aGlzLnBDYW1ZKSAqIHRoaXMuYW1vdW50U2luY2VMYXN0VGljayArXHJcblx0XHRcdCh0aGlzLm5vaXNlKDAsIHRoaXMubWlsbGlzKCkgLyAyMDApIC0gMC41KSAqIHRoaXMuc2NyZWVuc2hha2VBbW91bnQ7XHJcblx0fVxyXG5cclxuXHRkb1RpY2tzKCkge1xyXG5cdFx0Ly8gaW5jcmVhc2UgdGhlIHRpbWUgc2luY2UgYSB0aWNrIGhhcyBoYXBwZW5lZCBieSBkZWx0YVRpbWUsIHdoaWNoIGlzIGEgYnVpbHQtaW4gcDUuanMgdmFsdWVcclxuXHRcdHRoaXMubXNTaW5jZVRpY2sgKz0gdGhpcy5kZWx0YVRpbWU7XHJcblxyXG5cdFx0Ly8gZGVmaW5lIGEgdGVtcG9yYXJ5IHZhcmlhYmxlIGNhbGxlZCB0aWNrc1RoaXNGcmFtZSAtIHRoaXMgaXMgdXNlZCB0byBrZWVwIHRyYWNrIG9mIGhvdyBtYW55IHRpY2tzIGhhdmUgYmVlbiBjYWxjdWxhdGVkIHdpdGhpbiB0aGUgZHVyYXRpb24gb2YgdGhlIGN1cnJlbnQgZnJhbWUuICBBcyBsb25nIGFzIHRoaXMgdmFsdWUgaXMgbGVzcyB0aGFuIHRoZSBmb3JnaXZlbmVzc0NvdW50IHZhcmlhYmxlLCBpdCBjb250aW51ZXMgdG8gY2FsY3VsYXRlIHRpY2tzIGFzIG5lY2Vzc2FyeS5cclxuXHRcdGxldCB0aWNrc1RoaXNGcmFtZSA9IDA7XHJcblx0XHR3aGlsZSAoXHJcblx0XHRcdHRoaXMubXNTaW5jZVRpY2sgPiB0aGlzLm1zUGVyVGljayAmJlxyXG5cdFx0XHR0aWNrc1RoaXNGcmFtZSAhPT0gdGhpcy5mb3JnaXZlbmVzc0NvdW50XHJcblx0XHQpIHtcclxuXHRcdFx0Ly8gY29uc29sZS50aW1lKFwidGlja1wiKTtcclxuXHRcdFx0aWYgKHRoaXMud29ybGQgIT09IHVuZGVmaW5lZCkgdGhpcy5kb1RpY2soKTtcclxuXHRcdFx0Ly8gY29uc29sZS50aW1lRW5kKFwidGlja1wiKTtcclxuXHRcdFx0dGhpcy5tc1NpbmNlVGljayAtPSB0aGlzLm1zUGVyVGljaztcclxuXHRcdFx0dGlja3NUaGlzRnJhbWUrKztcclxuXHRcdH1cclxuXHRcdGlmICh0aWNrc1RoaXNGcmFtZSA9PT0gdGhpcy5mb3JnaXZlbmVzc0NvdW50KSB7XHJcblx0XHRcdHRoaXMubXNTaW5jZVRpY2sgPSAwO1xyXG5cdFx0XHRjb25zb2xlLndhcm4oXHJcblx0XHRcdFx0XCJsYWcgc3Bpa2UgZGV0ZWN0ZWQsIHRpY2sgY2FsY3VsYXRpb25zIGNvdWxkbid0IGtlZXAgdXBcIixcclxuXHRcdFx0KTtcclxuXHRcdH1cclxuXHRcdHRoaXMuYW1vdW50U2luY2VMYXN0VGljayA9IHRoaXMubXNTaW5jZVRpY2sgLyB0aGlzLm1zUGVyVGljaztcclxuXHR9XHJcblxyXG5cdGRvVGljaygpIHtcclxuXHRcdGlmKHRoaXMud29ybGQgIT09IHVuZGVmaW5lZCAmJiB0aGlzLndvcmxkLnRpbGVFbnRpdGllcyAhPT0gdW5kZWZpbmVkKSB7Ly90aWxlIGVudGl0eSBwYXJ0aWNsZXNcclxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCAxICogdGhpcy5wYXJ0aWNsZU11bHRpcGxpZXI7IGkrKykge1xyXG5cdFx0XHRcdGxldCBrID0gT2JqZWN0LmtleXModGhpcy53b3JsZC50aWxlRW50aXRpZXMpO1xyXG5cdFx0XHRcdGxldCByID0gdGhpcy53b3JsZC50aWxlRW50aXRpZXNba1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqay5sZW5ndGgpXV07XHJcblx0XHRcdFx0aWYoci50eXBlXz09PVRpbGVFbnRpdGllcy5UcmVlKSB7XHJcblx0XHRcdFx0XHRsZXQgdCA9IHIuY292ZXJlZFRpbGVzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSpyLmNvdmVyZWRUaWxlcy5sZW5ndGgpXTtcclxuXHRcdFx0XHRcdHRoaXMucGFydGljbGVzLnB1c2gobmV3IENvbG9yUGFydGljbGUoXCIjMzQ4OTY1XCIsIE1hdGgucmFuZG9tKCkqMC4xKzAuMSwgMjAsIHQldGhpcy53b3JsZC53aWR0aCtNYXRoLnJhbmRvbSgpLCBNYXRoLmZsb29yKHQvdGhpcy53b3JsZC53aWR0aCkrTWF0aC5yYW5kb20oKSwgMC4xKihNYXRoLnJhbmRvbSgpLTAuNSksIDAuMDYqKE1hdGgucmFuZG9tKCktMC43KSwgZmFsc2UpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGZvciAobGV0IHBhcnRpY2xlIG9mIHRoaXMucGFydGljbGVzKSB7XHJcblx0XHRcdHBhcnRpY2xlLnRpY2soKTtcclxuXHRcdH1cclxuXHRcdGlmICh0aGlzLndvcmxkLnBsYXllciA9PT0gdW5kZWZpbmVkKSByZXR1cm47XHJcblx0XHRpZiAodGhpcy53b3JsZC5wbGF5ZXIgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xyXG5cdFx0dGhpcy53b3JsZC5wbGF5ZXIua2V5Ym9hcmRJbnB1dCgpO1xyXG5cdFx0dGhpcy53b3JsZC5wbGF5ZXIuYXBwbHlHcmF2aXR5QW5kRHJhZygpO1xyXG5cdFx0dGhpcy53b3JsZC5wbGF5ZXIuYXBwbHlWZWxvY2l0eUFuZENvbGxpZGUoKTtcclxuXHJcblx0XHR0aGlzLnBDYW1YID0gdGhpcy5jYW1YO1xyXG5cdFx0dGhpcy5wQ2FtWSA9IHRoaXMuY2FtWTtcclxuXHRcdHRoaXMuZGVzaXJlZENhbVggPVxyXG5cdFx0XHR0aGlzLndvcmxkLnBsYXllci54ICtcclxuXHRcdFx0dGhpcy53b3JsZC5wbGF5ZXIud2lkdGggLyAyIC1cclxuXHRcdFx0dGhpcy53aWR0aCAvIDIgLyB0aGlzLlRJTEVfV0lEVEggLyB0aGlzLnVwc2NhbGVTaXplICtcclxuXHRcdFx0dGhpcy53b3JsZC5wbGF5ZXIueFZlbCAqIDQwO1xyXG5cdFx0dGhpcy5kZXNpcmVkQ2FtWSA9XHJcblx0XHRcdHRoaXMud29ybGQucGxheWVyLnkgK1xyXG5cdFx0XHR0aGlzLndvcmxkLnBsYXllci5oZWlnaHQgLyAyIC1cclxuXHRcdFx0dGhpcy5oZWlnaHQgLyAyIC8gdGhpcy5USUxFX0hFSUdIVCAvIHRoaXMudXBzY2FsZVNpemUgK1xyXG5cdFx0XHR0aGlzLndvcmxkLnBsYXllci55VmVsICogMjA7XHJcblx0XHR0aGlzLmNhbVggPSAodGhpcy5kZXNpcmVkQ2FtWCArIHRoaXMuY2FtWCAqIDI0KSAvIDI1O1xyXG5cdFx0dGhpcy5jYW1ZID0gKHRoaXMuZGVzaXJlZENhbVkgKyB0aGlzLmNhbVkgKiAyNCkgLyAyNTtcclxuXHJcblx0XHR0aGlzLnNjcmVlbnNoYWtlQW1vdW50ICo9IDAuODtcclxuXHJcblx0XHRpZiAodGhpcy5jYW1YIDwgMCkge1xyXG5cdFx0XHR0aGlzLmNhbVggPSAwO1xyXG5cdFx0fSBlbHNlIGlmIChcclxuXHRcdFx0dGhpcy5jYW1YID5cclxuXHRcdFx0dGhpcy53b3JsZFdpZHRoIC0gdGhpcy53aWR0aCAvIHRoaXMudXBzY2FsZVNpemUgLyB0aGlzLlRJTEVfV0lEVEhcclxuXHRcdCkge1xyXG5cdFx0XHR0aGlzLmNhbVggPVxyXG5cdFx0XHRcdHRoaXMud29ybGRXaWR0aCAtXHJcblx0XHRcdFx0dGhpcy53aWR0aCAvIHRoaXMudXBzY2FsZVNpemUgLyB0aGlzLlRJTEVfV0lEVEg7XHJcblx0XHR9XHJcblx0XHRpZiAoXHJcblx0XHRcdHRoaXMuY2FtWSA+XHJcblx0XHRcdHRoaXMud29ybGRIZWlnaHQgLSB0aGlzLmhlaWdodCAvIHRoaXMudXBzY2FsZVNpemUgLyB0aGlzLlRJTEVfSEVJR0hUXHJcblx0XHQpIHtcclxuXHRcdFx0dGhpcy5jYW1ZID1cclxuXHRcdFx0XHR0aGlzLndvcmxkSGVpZ2h0IC1cclxuXHRcdFx0XHR0aGlzLmhlaWdodCAvIHRoaXMudXBzY2FsZVNpemUgLyB0aGlzLlRJTEVfSEVJR0hUO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGZvciAoY29uc3QgaXRlbSBvZiB0aGlzLml0ZW1zKSB7XHJcblx0XHQvLyAgICAgaXRlbS5nb1Rvd2FyZHNQbGF5ZXIoKTtcclxuXHRcdC8vICAgICBpdGVtLmNvbWJpbmVXaXRoTmVhckl0ZW1zKCk7XHJcblx0XHQvLyAgICAgaXRlbS5hcHBseUdyYXZpdHlBbmREcmFnKCk7XHJcblx0XHQvLyAgICAgaXRlbS5hcHBseVZlbG9jaXR5QW5kQ29sbGlkZSgpO1xyXG5cdFx0Ly8gfVxyXG5cdFx0Ly9cclxuXHRcdC8vIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5pdGVtcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0Ly8gICAgIGlmICh0aGlzLml0ZW1zW2ldLmRlbGV0ZWQgPT09IHRydWUpIHtcclxuXHRcdC8vICAgICAgICAgdGhpcy5pdGVtcy5zcGxpY2UoaSwgMSk7XHJcblx0XHQvLyAgICAgICAgIGktLTtcclxuXHRcdC8vICAgICB9XHJcblx0XHQvLyB9XHJcblx0fVxyXG5cclxuXHR1aUZyYW1lUmVjdCh4OiBudW1iZXIsIHk6IG51bWJlciwgdzogbnVtYmVyLCBoOiBudW1iZXIpIHtcclxuXHRcdC8vIHNldCB0aGUgY29vcmRzIGFuZCBkaW1lbnNpb25zIHRvIHJvdW5kIHRvIHRoZSBuZWFyZXN0IHVuLXVwc2NhbGVkIHBpeGVsXHJcblx0XHR4ID0gTWF0aC5yb3VuZCh4IC8gdGhpcy51cHNjYWxlU2l6ZSkgKiB0aGlzLnVwc2NhbGVTaXplO1xyXG5cdFx0eSA9IE1hdGgucm91bmQoeSAvIHRoaXMudXBzY2FsZVNpemUpICogdGhpcy51cHNjYWxlU2l6ZTtcclxuXHRcdHcgPSBNYXRoLnJvdW5kKHcgLyB0aGlzLnVwc2NhbGVTaXplKSAqIHRoaXMudXBzY2FsZVNpemU7XHJcblx0XHRoID0gTWF0aC5yb3VuZChoIC8gdGhpcy51cHNjYWxlU2l6ZSkgKiB0aGlzLnVwc2NhbGVTaXplO1xyXG5cclxuXHRcdC8vIGNvcm5lcnNcclxuXHRcdFVpQXNzZXRzLnVpX2ZyYW1lLnJlbmRlclBhcnRpYWwoXHJcblx0XHRcdHRoaXMsXHJcblx0XHRcdHgsXHJcblx0XHRcdHksXHJcblx0XHRcdDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHQ3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0MCxcclxuXHRcdFx0MCxcclxuXHRcdFx0NyxcclxuXHRcdFx0NyxcclxuXHRcdCk7XHJcblx0XHRVaUFzc2V0cy51aV9mcmFtZS5yZW5kZXJQYXJ0aWFsKFxyXG5cdFx0XHR0aGlzLFxyXG5cdFx0XHR4ICsgdyAtIDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHR5LFxyXG5cdFx0XHQ3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0NyAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdDgsXHJcblx0XHRcdDAsXHJcblx0XHRcdDcsXHJcblx0XHRcdDcsXHJcblx0XHQpO1xyXG5cdFx0VWlBc3NldHMudWlfZnJhbWUucmVuZGVyUGFydGlhbChcclxuXHRcdFx0dGhpcyxcclxuXHRcdFx0eCxcclxuXHRcdFx0eSArIGggLSA3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0NyAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHQwLFxyXG5cdFx0XHQ4LFxyXG5cdFx0XHQ3LFxyXG5cdFx0XHQ3LFxyXG5cdFx0KTtcclxuXHRcdFVpQXNzZXRzLnVpX2ZyYW1lLnJlbmRlclBhcnRpYWwoXHJcblx0XHRcdHRoaXMsXHJcblx0XHRcdHggKyB3IC0gNyAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdHkgKyBoIC0gNyAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHQ3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0OCxcclxuXHRcdFx0OCxcclxuXHRcdFx0NyxcclxuXHRcdFx0NyxcclxuXHRcdCk7XHJcblxyXG5cdFx0Ly8gdG9wIGFuZCBib3R0b21cclxuXHRcdFVpQXNzZXRzLnVpX2ZyYW1lLnJlbmRlclBhcnRpYWwoXHJcblx0XHRcdHRoaXMsXHJcblx0XHRcdHggKyA3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0eSxcclxuXHRcdFx0dyAtIDE0ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0NyAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdDcsXHJcblx0XHRcdDAsXHJcblx0XHRcdDEsXHJcblx0XHRcdDcsXHJcblx0XHQpO1xyXG5cdFx0VWlBc3NldHMudWlfZnJhbWUucmVuZGVyUGFydGlhbChcclxuXHRcdFx0dGhpcyxcclxuXHRcdFx0eCArIDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHR5ICsgaCAtIDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHR3IC0gMTQgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHQ3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0NyxcclxuXHRcdFx0OCxcclxuXHRcdFx0MSxcclxuXHRcdFx0NyxcclxuXHRcdCk7XHJcblxyXG5cdFx0Ly8gbGVmdCBhbmQgcmlnaHRcclxuXHRcdFVpQXNzZXRzLnVpX2ZyYW1lLnJlbmRlclBhcnRpYWwoXHJcblx0XHRcdHRoaXMsXHJcblx0XHRcdHgsXHJcblx0XHRcdHkgKyA3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0NyAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdGggLSAxNCAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdDAsXHJcblx0XHRcdDcsXHJcblx0XHRcdDcsXHJcblx0XHRcdDEsXHJcblx0XHQpO1xyXG5cdFx0VWlBc3NldHMudWlfZnJhbWUucmVuZGVyUGFydGlhbChcclxuXHRcdFx0dGhpcyxcclxuXHRcdFx0eCArIHcgLSA3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0eSArIDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHQ3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0aCAtIDE0ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0OCxcclxuXHRcdFx0NyxcclxuXHRcdFx0NyxcclxuXHRcdFx0MSxcclxuXHRcdCk7XHJcblxyXG5cdFx0Ly8gY2VudGVyXHJcblx0XHRVaUFzc2V0cy51aV9mcmFtZS5yZW5kZXJQYXJ0aWFsKFxyXG5cdFx0XHR0aGlzLFxyXG5cdFx0XHR4ICsgNyAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdHkgKyA3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0dyAtIDE0ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0aCAtIDE0ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0NyxcclxuXHRcdFx0NyxcclxuXHRcdFx0MSxcclxuXHRcdFx0MSxcclxuXHRcdCk7XHJcblx0fVxyXG5cclxuXHQvKlxyXG4gICAvJCQkJCQkJCAgLyQkICAgICAgICAgICAgICAgICAgICAgICAgICAgLyQkXHJcbiAgfCAkJF9fICAkJHwgJCQgICAgICAgICAgICAgICAgICAgICAgICAgIHxfXy9cclxuICB8ICQkICBcXCAkJHwgJCQkJCQkJCAgLyQkICAgLyQkICAvJCQkJCQkJCAvJCQgIC8kJCQkJCQkICAvJCQkJCQkJCAvJCRcclxuICB8ICQkJCQkJCQvfCAkJF9fICAkJHwgJCQgIHwgJCQgLyQkX19fX18vfCAkJCAvJCRfX19fXy8gLyQkX19fX18vfF9fL1xyXG4gIHwgJCRfX19fLyB8ICQkICBcXCAkJHwgJCQgIHwgJCR8ICAkJCQkJCQgfCAkJHwgJCQgICAgICB8ICAkJCQkJCRcclxuICB8ICQkICAgICAgfCAkJCAgfCAkJHwgJCQgIHwgJCQgXFxfX19fICAkJHwgJCR8ICQkICAgICAgIFxcX19fXyAgJCQgLyQkXHJcbiAgfCAkJCAgICAgIHwgJCQgIHwgJCR8ICAkJCQkJCQkIC8kJCQkJCQkL3wgJCR8ICAkJCQkJCQkIC8kJCQkJCQkL3xfXy9cclxuICB8X18vICAgICAgfF9fLyAgfF9fLyBcXF9fX18gICQkfF9fX19fX18vIHxfXy8gXFxfX19fX19fL3xfX19fX19fL1xyXG5cdFx0XHRcdFx0ICAgLyQkICB8ICQkXHJcblx0XHRcdFx0XHQgIHwgICQkJCQkJC9cclxuXHRcdFx0XHRcdCAgIFxcX19fX19fL1xyXG4gICovXHJcblxyXG5cdC8vIHRoaXMgY2xhc3MgaG9sZHMgYW4gYXhpcy1hbGlnbmVkIHJlY3RhbmdsZSBhZmZlY3RlZCBieSBncmF2aXR5LCBkcmFnLCBhbmQgY29sbGlzaW9ucyB3aXRoIHRpbGVzLlxyXG5cclxuXHRyZWN0VnNSYXkoXHJcblx0XHRyZWN0WD86IGFueSxcclxuXHRcdHJlY3RZPzogYW55LFxyXG5cdFx0cmVjdFc/OiBhbnksXHJcblx0XHRyZWN0SD86IGFueSxcclxuXHRcdHJheVg/OiBhbnksXHJcblx0XHRyYXlZPzogYW55LFxyXG5cdFx0cmF5Vz86IGFueSxcclxuXHRcdHJheUg/OiBhbnksXHJcblx0KSB7XHJcblx0XHQvLyB0aGlzIHJheSBpcyBhY3R1YWxseSBhIGxpbmUgc2VnbWVudCBtYXRoZW1hdGljYWxseSwgYnV0IGl0J3MgY29tbW9uIHRvIHNlZSBwZW9wbGUgcmVmZXIgdG8gc2ltaWxhciBjaGVja3MgYXMgcmF5LWNhc3RzLCBzbyBmb3IgdGhlIGR1cmF0aW9uIG9mIHRoZSBkZWZpbml0aW9uIG9mIHRoaXMgZnVuY3Rpb24sIHJheSBjYW4gYmUgYXNzdW1lZCB0byBtZWFuIHRoZSBzYW1lIGFzIGxpbmUgc2VnbWVudC5cclxuXHJcblx0XHQvLyBpZiB0aGUgcmF5IGRvZXNuJ3QgaGF2ZSBhIGxlbmd0aCwgdGhlbiBpdCBjYW4ndCBoYXZlIGVudGVyZWQgdGhlIHJlY3RhbmdsZS4gIFRoaXMgYXNzdW1lcyB0aGF0IHRoZSBvYmplY3RzIGRvbid0IHN0YXJ0IGluIGNvbGxpc2lvbiwgb3RoZXJ3aXNlIHRoZXknbGwgYmVoYXZlIHN0cmFuZ2VseVxyXG5cdFx0aWYgKHJheVcgPT09IDAgJiYgcmF5SCA9PT0gMCkge1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gY2FsY3VsYXRlIGhvdyBmYXIgYWxvbmcgdGhlIHJheSBlYWNoIHNpZGUgb2YgdGhlIHJlY3RhbmdsZSBpbnRlcnNlY3RzIHdpdGggaXQgKGVhY2ggc2lkZSBpcyBleHRlbmRlZCBvdXQgaW5maW5pdGVseSBpbiBib3RoIGRpcmVjdGlvbnMpXHJcblx0XHRjb25zdCB0b3BJbnRlcnNlY3Rpb24gPSAocmVjdFkgLSByYXlZKSAvIHJheUg7XHJcblx0XHRjb25zdCBib3R0b21JbnRlcnNlY3Rpb24gPSAocmVjdFkgKyByZWN0SCAtIHJheVkpIC8gcmF5SDtcclxuXHRcdGNvbnN0IGxlZnRJbnRlcnNlY3Rpb24gPSAocmVjdFggLSByYXlYKSAvIHJheVc7XHJcblx0XHRjb25zdCByaWdodEludGVyc2VjdGlvbiA9IChyZWN0WCArIHJlY3RXIC0gcmF5WCkgLyByYXlXO1xyXG5cclxuXHRcdGlmIChcclxuXHRcdFx0aXNOYU4odG9wSW50ZXJzZWN0aW9uKSB8fFxyXG5cdFx0XHRpc05hTihib3R0b21JbnRlcnNlY3Rpb24pIHx8XHJcblx0XHRcdGlzTmFOKGxlZnRJbnRlcnNlY3Rpb24pIHx8XHJcblx0XHRcdGlzTmFOKHJpZ2h0SW50ZXJzZWN0aW9uKVxyXG5cdFx0KSB7XHJcblx0XHRcdC8vIHlvdSBoYXZlIHRvIHVzZSB0aGUgSlMgZnVuY3Rpb24gaXNOYU4oKSB0byBjaGVjayBpZiBhIHZhbHVlIGlzIE5hTiBiZWNhdXNlIGJvdGggTmFOPT1OYU4gYW5kIE5hTj09PU5hTiBhcmUgZmFsc2UuXHJcblx0XHRcdC8vIGlmIGFueSBvZiB0aGVzZSB2YWx1ZXMgYXJlIE5hTiwgbm8gY29sbGlzaW9uIGhhcyBvY2N1cnJlZFxyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gY2FsY3VsYXRlIHRoZSBuZWFyZXN0IGFuZCBmYXJ0aGVzdCBpbnRlcnNlY3Rpb25zIGZvciBib3RoIHggYW5kIHlcclxuXHRcdGNvbnN0IG5lYXJYID0gdGhpcy5taW4obGVmdEludGVyc2VjdGlvbiwgcmlnaHRJbnRlcnNlY3Rpb24pO1xyXG5cdFx0Y29uc3QgZmFyWCA9IHRoaXMubWF4KGxlZnRJbnRlcnNlY3Rpb24sIHJpZ2h0SW50ZXJzZWN0aW9uKTtcclxuXHRcdGNvbnN0IG5lYXJZID0gdGhpcy5taW4odG9wSW50ZXJzZWN0aW9uLCBib3R0b21JbnRlcnNlY3Rpb24pO1xyXG5cdFx0Y29uc3QgZmFyWSA9IHRoaXMubWF4KHRvcEludGVyc2VjdGlvbiwgYm90dG9tSW50ZXJzZWN0aW9uKTtcclxuXHJcblx0XHRpZiAobmVhclggPiBmYXJZIHx8IG5lYXJZID4gZmFyWCkge1xyXG5cdFx0XHQvLyB0aGlzIG11c3QgbWVhbiB0aGF0IHRoZSBsaW5lIHRoYXQgbWFrZXMgdXAgdGhlIGxpbmUgc2VnbWVudCBkb2Vzbid0IHBhc3MgdGhyb3VnaCB0aGUgcmF5XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoZmFyWCA8IDAgfHwgZmFyWSA8IDApIHtcclxuXHRcdFx0Ly8gdGhlIGludGVyc2VjdGlvbiBpcyBoYXBwZW5pbmcgYmVmb3JlIHRoZSByYXkgc3RhcnRzLCBzbyB0aGUgcmF5IGlzIHBvaW50aW5nIGF3YXkgZnJvbSB0aGUgdHJpYW5nbGVcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGNhbGN1bGF0ZSB3aGVyZSB0aGUgcG90ZW50aWFsIGNvbGxpc2lvbiBjb3VsZCBiZVxyXG5cdFx0Y29uc3QgbmVhckNvbGxpc2lvblBvaW50ID0gdGhpcy5tYXgobmVhclgsIG5lYXJZKTtcclxuXHJcblx0XHRpZiAobmVhclggPiAxIHx8IG5lYXJZID4gMSkge1xyXG5cdFx0XHQvLyB0aGUgaW50ZXJzZWN0aW9uIGhhcHBlbnMgYWZ0ZXIgdGhlIHJheShsaW5lIHNlZ21lbnQpIGVuZHNcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChuZWFyWCA9PT0gbmVhckNvbGxpc2lvblBvaW50KSB7XHJcblx0XHRcdC8vIGl0IG11c3QgaGF2ZSBjb2xsaWRlZCBvbiBlaXRoZXIgdGhlIGxlZnQgb3IgdGhlIHJpZ2h0ISBub3cgd2hpY2g/XHJcblx0XHRcdGlmIChsZWZ0SW50ZXJzZWN0aW9uID09PSBuZWFyWCkge1xyXG5cdFx0XHRcdC8vIEl0IG11c3QgaGF2ZSBjb2xsaWRlZCBvbiB0aGUgbGVmdCEgIFJldHVybiB0aGUgY29sbGlzaW9uIG5vcm1hbCBbLTEsIDBdXHJcblx0XHRcdFx0cmV0dXJuIFstMSwgMCwgbmVhckNvbGxpc2lvblBvaW50XTtcclxuXHRcdFx0fVxyXG5cdFx0XHQvLyBJZiBpdCBkaWRuJ3QgY29sbGlkZSBvbiB0aGUgbGVmdCwgaXQgbXVzdCBoYXZlIGNvbGxpZGVkIG9uIHRoZSByaWdodC4gIFJldHVybiB0aGUgY29sbGlzaW9uIG5vcm1hbCBbMSwgMF1cclxuXHRcdFx0cmV0dXJuIFsxLCAwLCBuZWFyQ29sbGlzaW9uUG9pbnRdO1xyXG5cdFx0fVxyXG5cdFx0Ly8gSWYgaXQgZGlkbid0IGNvbGxpZGUgb24gdGhlIGxlZnQgb3IgcmlnaHQsIGl0IG11c3QgaGF2ZSBjb2xsaWRlZCBvbiBlaXRoZXIgdGhlIHRvcCBvciB0aGUgYm90dG9tISBub3cgd2hpY2g/XHJcblx0XHRpZiAodG9wSW50ZXJzZWN0aW9uID09PSBuZWFyWSkge1xyXG5cdFx0XHQvLyBJdCBtdXN0IGhhdmUgY29sbGlkZWQgb24gdGhlIHRvcCEgIFJldHVybiB0aGUgY29sbGlzaW9uIG5vcm1hbCBbMCwgLTFdXHJcblx0XHRcdHJldHVybiBbMCwgLTEsIG5lYXJDb2xsaXNpb25Qb2ludF07XHJcblx0XHR9XHJcblx0XHQvLyBJZiBpdCBkaWRuJ3QgY29sbGlkZSBvbiB0aGUgdG9wLCBpdCBtdXN0IGhhdmUgY29sbGlkZWQgb24gdGhlIGJvdHRvbS4gIFJldHVybiB0aGUgY29sbGlzaW9uIG5vcm1hbCBbMCwgMV1cclxuXHRcdHJldHVybiBbMCwgMSwgbmVhckNvbGxpc2lvblBvaW50XTtcclxuXHJcblx0XHQvLyBvdXRwdXQgaWYgbm8gY29sbGlzaW9uOiBmYWxzZVxyXG5cdFx0Ly8gb3V0cHV0IGlmIGNvbGxpc2lvbjogW2NvbGxpc2lvbiBub3JtYWwgWCwgY29sbGlzaW9uIG5vcm1hbCBZLCBuZWFyQ29sbGlzaW9uUG9pbnRdXHJcblx0XHQvLyAgICAgICAgICAgICAgICAgICAgICAgICAtMSB0byAxICAgICAgICAgICAgICAtMSB0byAxICAgICAgICAgICAgMCB0byAxXHJcblx0fVxyXG5cclxuXHRyZW5kZXJFbnRpdGllcygpIHtcclxuXHRcdC8vIGRyYXcgcGxheWVyXHJcblx0XHQvLyB0aGlzLmZpbGwoMjU1LCAwLCAwKTtcclxuXHRcdC8vIHRoaXMubm9TdHJva2UoKTtcclxuXHRcdC8vIHRoaXMucmVjdChcclxuXHRcdC8vICAgICAodGhpcy53b3JsZC5wbGF5ZXIuaW50ZXJwb2xhdGVkWCAqIHRoaXMuVElMRV9XSURUSCAtXHJcblx0XHQvLyAgICAgICAgIHRoaXMuaW50ZXJwb2xhdGVkQ2FtWCAqIHRoaXMuVElMRV9XSURUSCkgKlxyXG5cdFx0Ly8gICAgICAgICB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0Ly8gICAgICh0aGlzLndvcmxkLnBsYXllci5pbnRlcnBvbGF0ZWRZICogdGhpcy5USUxFX0hFSUdIVCAtXHJcblx0XHQvLyAgICAgICAgIHRoaXMuaW50ZXJwb2xhdGVkQ2FtWSAqIHRoaXMuVElMRV9IRUlHSFQpICpcclxuXHRcdC8vICAgICAgICAgdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdC8vICAgICB0aGlzLndvcmxkLnBsYXllci53aWR0aCAqIHRoaXMudXBzY2FsZVNpemUgKiB0aGlzLlRJTEVfV0lEVEgsXHJcblx0XHQvLyAgICAgdGhpcy53b3JsZC5wbGF5ZXIuaGVpZ2h0ICogdGhpcy51cHNjYWxlU2l6ZSAqIHRoaXMuVElMRV9IRUlHSFRcclxuXHRcdC8vICk7XHJcblx0XHQvLyBmb3IgKGNvbnN0IGl0ZW0gb2YgdGhpcy5pdGVtcykge1xyXG5cdFx0Ly8gICAgIGl0ZW0uZmluZEludGVycG9sYXRlZENvb3JkaW5hdGVzKCk7XHJcblx0XHQvL1xyXG5cdFx0Ly8gICAgIGl0ZW0uaXRlbVN0YWNrLnRleHR1cmUucmVuZGVyKFxyXG5cdFx0Ly8gICAgICAgICB0aGlzLFxyXG5cdFx0Ly8gICAgICAgICAoaXRlbS5pbnRlcnBvbGF0ZWRYICogdGhpcy5USUxFX1dJRFRIIC1cclxuXHRcdC8vICAgICAgICAgICAgIHRoaXMuaW50ZXJwb2xhdGVkQ2FtWCAqIHRoaXMuVElMRV9XSURUSCkgKlxyXG5cdFx0Ly8gICAgICAgICAgICAgdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdC8vICAgICAgICAgKGl0ZW0uaW50ZXJwb2xhdGVkWSAqIHRoaXMuVElMRV9IRUlHSFQgLVxyXG5cdFx0Ly8gICAgICAgICAgICAgdGhpcy5pbnRlcnBvbGF0ZWRDYW1ZICogdGhpcy5USUxFX0hFSUdIVCkgKlxyXG5cdFx0Ly8gICAgICAgICAgICAgdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdC8vICAgICAgICAgaXRlbS53ICogdGhpcy51cHNjYWxlU2l6ZSAqIHRoaXMuVElMRV9XSURUSCxcclxuXHRcdC8vICAgICAgICAgaXRlbS5oICogdGhpcy51cHNjYWxlU2l6ZSAqIHRoaXMuVElMRV9IRUlHSFRcclxuXHRcdC8vICAgICApO1xyXG5cdFx0Ly9cclxuXHRcdC8vICAgICAvLyBSZW5kZXIgdGhlIGl0ZW0gcXVhbnRpdHkgbGFiZWxcclxuXHRcdC8vICAgICB0aGlzLmZpbGwoMCk7XHJcblx0XHQvL1xyXG5cdFx0Ly8gICAgIHRoaXMubm9TdHJva2UoKTtcclxuXHRcdC8vXHJcblx0XHQvLyAgICAgdGhpcy50ZXh0QWxpZ24odGhpcy5SSUdIVCwgdGhpcy5CT1RUT00pO1xyXG5cdFx0Ly8gICAgIHRoaXMudGV4dFNpemUoNSAqIHRoaXMudXBzY2FsZVNpemUpO1xyXG5cdFx0Ly9cclxuXHRcdC8vICAgICB0aGlzLnRleHQoXHJcblx0XHQvLyAgICAgICAgIGl0ZW0uaXRlbVN0YWNrLnN0YWNrU2l6ZSxcclxuXHRcdC8vICAgICAgICAgKGl0ZW0uaW50ZXJwb2xhdGVkWCAqIHRoaXMuVElMRV9XSURUSCAtXHJcblx0XHQvLyAgICAgICAgICAgICB0aGlzLmludGVycG9sYXRlZENhbVggKiB0aGlzLlRJTEVfV0lEVEgpICpcclxuXHRcdC8vICAgICAgICAgICAgIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHQvLyAgICAgICAgIChpdGVtLmludGVycG9sYXRlZFkgKiB0aGlzLlRJTEVfSEVJR0hUIC1cclxuXHRcdC8vICAgICAgICAgICAgIHRoaXMuaW50ZXJwb2xhdGVkQ2FtWSAqIHRoaXMuVElMRV9IRUlHSFQpICpcclxuXHRcdC8vICAgICAgICAgICAgIHRoaXMudXBzY2FsZVNpemVcclxuXHRcdC8vICAgICApO1xyXG5cdFx0Ly8gfVxyXG5cdH1cclxuXHJcblx0LypcclxuXHRwaWNrVXBJdGVtKGl0ZW1TdGFjazogSXRlbVN0YWNrKTogYm9vbGVhbiB7XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaG90QmFyLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGNvbnN0IGl0ZW0gPSB0aGlzLmhvdEJhcltpXTtcclxuXHJcblx0XHRcdC8vIElmIHRoZXJlIGFyZSBubyBpdGVtcyBpbiB0aGUgY3VycmVudCBzbG90IG9mIHRoZSBob3RCYXJcclxuXHRcdFx0aWYgKGl0ZW0gPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdHRoaXMuaG90QmFyW2ldID0gaXRlbVN0YWNrO1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoXHJcblx0XHRcdFx0aXRlbSA9PT0gaXRlbVN0YWNrICYmXHJcblx0XHRcdFx0aXRlbS5zdGFja1NpemUgPCBpdGVtLm1heFN0YWNrU2l6ZVxyXG5cdFx0XHQpIHtcclxuXHRcdFx0XHRjb25zdCByZW1haW5pbmdTcGFjZSA9IGl0ZW0ubWF4U3RhY2tTaXplIC0gaXRlbS5zdGFja1NpemU7XHJcblxyXG5cdFx0XHRcdC8vIFRvcCBvZmYgdGhlIHN0YWNrIHdpdGggaXRlbXMgaWYgaXQgY2FuIHRha2UgbW9yZSB0aGFuIHRoZSBzdGFjayBiZWluZyBhZGRlZFxyXG5cdFx0XHRcdGlmIChyZW1haW5pbmdTcGFjZSA+PSBpdGVtU3RhY2suc3RhY2tTaXplKSB7XHJcblx0XHRcdFx0XHR0aGlzLmhvdEJhcltpXS5zdGFja1NpemUgPVxyXG5cdFx0XHRcdFx0XHRpdGVtLnN0YWNrU2l6ZSArIGl0ZW1TdGFjay5zdGFja1NpemU7XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGl0ZW1TdGFjay5zdGFja1NpemUgLT0gcmVtYWluaW5nU3BhY2U7XHJcblxyXG5cdFx0XHRcdHRoaXMuaG90QmFyW2ldLnN0YWNrU2l6ZSA9IGl0ZW1TdGFjay5tYXhTdGFja1NpemU7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGNvbnNvbGUuZXJyb3IoXHJcblx0XHRcdGBDb3VsZCBub3QgcGlja3VwICR7aXRlbVN0YWNrLnN0YWNrU2l6ZX0gJHtpdGVtU3RhY2submFtZX1gXHJcblx0XHQpO1xyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH1cclxuXHJcblx0ICovXHJcblxyXG5cdG1vdXNlRXhpdGVkKCkge1xyXG5cdFx0dGhpcy5tb3VzZU9uID0gZmFsc2U7XHJcblx0fVxyXG5cclxuXHRtb3VzZUVudGVyZWQoKSB7XHJcblx0XHR0aGlzLm1vdXNlT24gPSB0cnVlO1xyXG5cdH1cclxuXHJcblx0dXBkYXRlTW91c2UoKSB7XHJcblx0XHRpZiAoXHJcblx0XHRcdE1hdGguZmxvb3IoXHJcblx0XHRcdFx0KHRoaXMuaW50ZXJwb2xhdGVkQ2FtWCAqIHRoaXMuVElMRV9XSURUSCArXHJcblx0XHRcdFx0XHR0aGlzLm1vdXNlWCAvIHRoaXMudXBzY2FsZVNpemUpIC9cclxuXHRcdFx0XHR0aGlzLlRJTEVfV0lEVEgsXHJcblx0XHRcdCkgIT09IHRoaXMud29ybGRNb3VzZVggfHxcclxuXHRcdFx0TWF0aC5mbG9vcihcclxuXHRcdFx0XHQodGhpcy5pbnRlcnBvbGF0ZWRDYW1ZICogdGhpcy5USUxFX0hFSUdIVCArXHJcblx0XHRcdFx0XHR0aGlzLm1vdXNlWSAvIHRoaXMudXBzY2FsZVNpemUpIC9cclxuXHRcdFx0XHR0aGlzLlRJTEVfSEVJR0hULFxyXG5cdFx0XHQpICE9PSB0aGlzLndvcmxkTW91c2VZXHJcblx0XHQpIHtcclxuXHRcdFx0dGhpcy5sYXN0Q3Vyc29yTW92ZSA9IERhdGUubm93KCk7XHJcblx0XHR9XHJcblx0XHQvLyB3b3JsZCBtb3VzZSB4IGFuZCB5IHZhcmlhYmxlcyBob2xkIHRoZSBtb3VzZSBwb3NpdGlvbiBpbiB3b3JsZCB0aWxlcy4gIDAsIDAgaXMgdG9wIGxlZnRcclxuXHRcdHRoaXMud29ybGRNb3VzZVggPSBNYXRoLmZsb29yKFxyXG5cdFx0XHQodGhpcy5pbnRlcnBvbGF0ZWRDYW1YICogdGhpcy5USUxFX1dJRFRIICtcclxuXHRcdFx0XHR0aGlzLm1vdXNlWCAvIHRoaXMudXBzY2FsZVNpemUpIC9cclxuXHRcdFx0dGhpcy5USUxFX1dJRFRILFxyXG5cdFx0KTtcclxuXHRcdHRoaXMud29ybGRNb3VzZVkgPSBNYXRoLmZsb29yKFxyXG5cdFx0XHQodGhpcy5pbnRlcnBvbGF0ZWRDYW1ZICogdGhpcy5USUxFX0hFSUdIVCArXHJcblx0XHRcdFx0dGhpcy5tb3VzZVkgLyB0aGlzLnVwc2NhbGVTaXplKSAvXHJcblx0XHRcdHRoaXMuVElMRV9IRUlHSFQsXHJcblx0XHQpO1xyXG5cdH1cclxuXHJcblx0ZHJhd0N1cnNvcigpIHtcclxuXHRcdGlmICh0aGlzLm1vdXNlT24pIHtcclxuXHRcdFx0Ly8gaWYgKHRoaXMucGlja2VkVXBTbG90ID4gLTEpIHtcclxuXHRcdFx0Ly8gICAgIHRoaXMuaG90YmFyW3RoaXMucGlja2VkVXBTbG90XS50ZXh0dXJlLnJlbmRlcihcclxuXHRcdFx0Ly8gICAgICAgICB0aGlzLFxyXG5cdFx0XHQvLyAgICAgICAgIHRoaXMubW91c2VYLFxyXG5cdFx0XHQvLyAgICAgICAgIHRoaXMubW91c2VZLFxyXG5cdFx0XHQvLyAgICAgICAgIDggKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHQvLyAgICAgICAgIDggKiB0aGlzLnVwc2NhbGVTaXplXHJcblx0XHRcdC8vICAgICApO1xyXG5cclxuXHRcdFx0Ly8gICAgIHRoaXMudGV4dChcclxuXHRcdFx0Ly8gICAgICAgICB0aGlzLmhvdEJhclt0aGlzLnBpY2tlZFVwU2xvdF0uc3RhY2tTaXplLFxyXG5cdFx0XHQvLyAgICAgICAgIHRoaXMubW91c2VYICsgMTAgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHQvLyAgICAgICAgIHRoaXMubW91c2VZICsgMTAgKiB0aGlzLnVwc2NhbGVTaXplXHJcblx0XHRcdC8vICAgICApO1xyXG5cdFx0XHQvLyB9XHJcblxyXG5cdFx0XHRVaUFzc2V0cy5zZWxlY3RlZF90aWxlLnJlbmRlcihcclxuXHRcdFx0XHR0aGlzLFxyXG5cdFx0XHRcdE1hdGgucm91bmQoXHJcblx0XHRcdFx0XHQodGhpcy53b3JsZE1vdXNlWCAtIHRoaXMuaW50ZXJwb2xhdGVkQ2FtWCkgKlxyXG5cdFx0XHRcdFx0dGhpcy5USUxFX1dJRFRIICpcclxuXHRcdFx0XHRcdHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdFx0KSxcclxuXHRcdFx0XHRNYXRoLnJvdW5kKFxyXG5cdFx0XHRcdFx0KHRoaXMud29ybGRNb3VzZVkgLSB0aGlzLmludGVycG9sYXRlZENhbVkpICpcclxuXHRcdFx0XHRcdHRoaXMuVElMRV9IRUlHSFQgKlxyXG5cdFx0XHRcdFx0dGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0XHQpLFxyXG5cdFx0XHRcdHRoaXMuVElMRV9XSURUSCAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdFx0dGhpcy5USUxFX0hFSUdIVCAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdCk7XHJcblx0XHRcdGlmIChEYXRlLm5vdygpIC0gdGhpcy5sYXN0Q3Vyc29yTW92ZSA+IDEwMDApIHtcclxuXHRcdFx0XHRsZXQgc2VsZWN0ZWRUaWxlID0gdGhpcy53b3JsZC53b3JsZFRpbGVzW3RoaXMud29ybGQud2lkdGggKiB0aGlzLndvcmxkTW91c2VZICsgdGhpcy53b3JsZE1vdXNlWF07XHJcblx0XHRcdFx0aWYgKHR5cGVvZiAoc2VsZWN0ZWRUaWxlKSA9PT0gJ3N0cmluZycpIHtcclxuXHRcdFx0XHRcdHRoaXMudGV4dChcIlRpbGUgZW50aXR5OiBcIiArIHNlbGVjdGVkVGlsZSwgdGhpcy5tb3VzZVgsIHRoaXMubW91c2VZKTsvL0pBTktZIEFMRVJUXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2UgaWYgKFdvcmxkVGlsZXNbc2VsZWN0ZWRUaWxlXSAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0XHR0aGlzLnRleHQoKFdvcmxkVGlsZXNbc2VsZWN0ZWRUaWxlXSBhcyBUaWxlKS5uYW1lLCB0aGlzLm1vdXNlWCwgdGhpcy5tb3VzZVkpOy8vSkFOS1kgQUxFUlRcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmNvbnN0IGNvbm5lY3Rpb24gPSBpbyh7XHJcblx0YXV0aDogeyB0b2tlbjogd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKCd0b2tlbicpIH0sXHJcbn0pO1xyXG5cclxuZXhwb3J0IGNvbnN0IGdhbWUgPSBuZXcgR2FtZShjb25uZWN0aW9uKTtcclxuIiwiaW1wb3J0IHsgR2FtZSB9IGZyb20gJy4vR2FtZSc7XHJcbmltcG9ydCB7IFdvcmxkIH0gZnJvbSAnLi93b3JsZC9Xb3JsZCc7XHJcbmltcG9ydCB7IEVudGl0eUNsYXNzZXMgfSBmcm9tICcuL3dvcmxkL2VudGl0aWVzL0VudGl0eUNsYXNzZXMnO1xyXG5pbXBvcnQgeyBQbGF5ZXJMb2NhbCB9IGZyb20gJy4vcGxheWVyL1BsYXllckxvY2FsJztcclxuaW1wb3J0IHsgSXRlbVR5cGUgfSBmcm9tICcuLi9nbG9iYWwvSW52ZW50b3J5JztcclxuaW1wb3J0IHsgSW52ZW50b3J5IH0gZnJvbSAnLi9wbGF5ZXIvSW52ZW50b3J5JztcclxuXHJcbmV4cG9ydCBjbGFzcyBOZXRNYW5hZ2VyIHtcclxuICAgIGdhbWU6IEdhbWU7XHJcblxyXG4gICAgcGxheWVyVGlja1JhdGU6IG51bWJlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihnYW1lOiBHYW1lKSB7XHJcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcclxuXHJcbiAgICAgICAgLy8gSW5pdCBldmVudFxyXG4gICAgICAgIHRoaXMuZ2FtZS5jb25uZWN0aW9uLm9uKCdpbml0JywgKHBsYXllclRpY2tSYXRlLCB0b2tlbikgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgVGljayByYXRlIHNldCB0bzogJHtwbGF5ZXJUaWNrUmF0ZX1gKTtcclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXJUaWNrUmF0ZSA9IHBsYXllclRpY2tSYXRlO1xyXG4gICAgICAgICAgICBpZiAodG9rZW4pIHtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndG9rZW4nLCB0b2tlbik7XHJcbiAgICAgICAgICAgICAgICAodGhpcy5nYW1lLmNvbm5lY3Rpb24uYXV0aCBhcyB7IHRva2VuOiBzdHJpbmcgfSkudG9rZW4gPSB0b2tlbjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBJbml0aWFsaXphdGlvbiBldmVudHNcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vIExvYWQgdGhlIHdvcmxkIGFuZCBzZXQgdGhlIHBsYXllciBlbnRpdHkgaWRcclxuICAgICAgICAgICAgdGhpcy5nYW1lLmNvbm5lY3Rpb24ub24oXHJcbiAgICAgICAgICAgICAgICAnd29ybGRMb2FkJyxcclxuICAgICAgICAgICAgICAgICh3aWR0aCwgaGVpZ2h0LCB0aWxlcywgdGlsZUVudGl0aWVzLCBlbnRpdGllcywgcGxheWVyLCBpbnZlbnRvcnkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlbnRpdGllcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRpbGVFbnRpdGllczI6IHtbaWQ6IHN0cmluZ106IHtpZDogc3RyaW5nLCBjb3ZlcmVkVGlsZXM6IG51bWJlcltdLCB0eXBlXzogbnVtYmVyLCBkYXRhOiB7fSwgYW5pbUZyYW1lOiBudW1iZXIsIGFuaW1hdGU6IGJvb2xlYW59fSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgIHRpbGVFbnRpdGllcy5mb3JFYWNoKCh0aWxlRW50aXR5KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYWRkaW5nIHRpbGUgZW50aXR5OiBcIit0aWxlRW50aXR5LmlkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aWxlRW50aXRpZXMyW3RpbGVFbnRpdHkuaWRdID0ge2lkOiB0aWxlRW50aXR5LmlkLCBjb3ZlcmVkVGlsZXM6IHRpbGVFbnRpdHkuY292ZXJlZFRpbGVzLCB0eXBlXzogdGlsZUVudGl0eS5wYXlsb2FkLnR5cGVfLCBkYXRhOiB0aWxlRW50aXR5LnBheWxvYWQuZGF0YSwgYW5pbUZyYW1lOiB0aWxlRW50aXR5LnBheWxvYWQuYW5pbUZyYW1lLCBhbmltYXRlOiB0aWxlRW50aXR5LnBheWxvYWQuYW5pbWF0ZX1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWUud29ybGQgPSBuZXcgV29ybGQod2lkdGgsIGhlaWdodCwgdGlsZXMsIHRpbGVFbnRpdGllczIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS53b3JsZC5pbnZlbnRvcnkgPSBuZXcgSW52ZW50b3J5KGludmVudG9yeSlcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWUud29ybGQucGxheWVyID0gbmV3IFBsYXllckxvY2FsKHBsYXllcik7XHJcbiAgICAgICAgICAgICAgICAgICAgZW50aXRpZXMuZm9yRWFjaCgoZW50aXR5KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS53b3JsZC5lbnRpdGllc1tlbnRpdHkuaWRdID0gbmV3IEVudGl0eUNsYXNzZXNbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbnRpdHkudHlwZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdKGVudGl0eSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBXb3JsZCBldmVudHNcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vIFRpbGUgdXBkYXRlcyBzdWNoIGFzIGJyZWFraW5nIGFuZCBwbGFjaW5nXHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5jb25uZWN0aW9uLm9uKFxyXG4gICAgICAgICAgICAgICAgJ3dvcmxkVXBkYXRlJyxcclxuICAgICAgICAgICAgICAgICh1cGRhdGVkVGlsZXM6IHsgdGlsZUluZGV4OiBudW1iZXI7IHRpbGU6IG51bWJlciB9W10pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGUgd29ybGQgaXMgbm90IHNldFxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmdhbWUud29ybGQgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB1cGRhdGVkVGlsZXMuZm9yRWFjaCgodGlsZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWUud29ybGQudXBkYXRlVGlsZSh0aWxlLnRpbGVJbmRleCwgdGlsZS50aWxlKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5jb25uZWN0aW9uLm9uKCdpbnZlbnRvcnlVcGRhdGUnLCAodXBkYXRlcykgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlIHdvcmxkIGlzIG5vdCBzZXRcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdhbWUud29ybGQgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgIHVwZGF0ZXMuZm9yRWFjaCgodXBkYXRlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2codXBkYXRlKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS53b3JsZC5pbnZlbnRvcnkuaXRlbXNbdXBkYXRlLnNsb3RdID0gdXBkYXRlLml0ZW07XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBQbGF5ZXIgZXZlbnRzXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmdhbWUuY29ubmVjdGlvbi5vbignZW50aXR5VXBkYXRlJywgKGVudGl0eURhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIElmIHRoZSB3b3JsZCBpcyBub3Qgc2V0XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nYW1lLndvcmxkID09PSB1bmRlZmluZWQpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBlbnRpdHkgPSB0aGlzLmdhbWUud29ybGQuZW50aXRpZXNbZW50aXR5RGF0YS5pZF07XHJcbiAgICAgICAgICAgICAgICBpZiAoZW50aXR5ID09PSB1bmRlZmluZWQpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgICAgICBlbnRpdHkudXBkYXRlRGF0YShlbnRpdHlEYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmdhbWUuY29ubmVjdGlvbi5vbignZW50aXR5Q3JlYXRlJywgKGVudGl0eURhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIElmIHRoZSB3b3JsZCBpcyBub3Qgc2V0XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nYW1lLndvcmxkID09PSB1bmRlZmluZWQpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUud29ybGQuZW50aXRpZXNbZW50aXR5RGF0YS5pZF0gPSBuZXcgRW50aXR5Q2xhc3Nlc1tcclxuICAgICAgICAgICAgICAgICAgICBlbnRpdHlEYXRhLnR5cGVcclxuICAgICAgICAgICAgICAgIF0oZW50aXR5RGF0YSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5nYW1lLmNvbm5lY3Rpb24ub24oJ2VudGl0eURlbGV0ZScsIChpZCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlIHdvcmxkIGlzIG5vdCBzZXRcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdhbWUud29ybGQgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmdhbWUud29ybGQuZW50aXRpZXNbaWRdO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vIFVwZGF0ZSB0aGUgb3RoZXIgcGxheWVycyBpbiB0aGUgd29ybGRcclxuICAgICAgICAgICAgdGhpcy5nYW1lLmNvbm5lY3Rpb24ub24oXHJcbiAgICAgICAgICAgICAgICAnZW50aXR5U25hcHNob3QnLFxyXG4gICAgICAgICAgICAgICAgKHNuYXBzaG90OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWQ6IHN0cmluZztcclxuICAgICAgICAgICAgICAgICAgICB0aW1lOiBudW1iZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGU6IHsgaWQ6IHN0cmluZzsgeDogc3RyaW5nOyB5OiBzdHJpbmcgfVtdO1xyXG4gICAgICAgICAgICAgICAgfSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIElmIHRoZSB3b3JsZCBpcyBub3Qgc2V0XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2FtZS53b3JsZCA9PT0gdW5kZWZpbmVkKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS53b3JsZC51cGRhdGVQbGF5ZXJzKHNuYXBzaG90KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgVGlsZVJlc291cmNlIH0gZnJvbSAnLi9yZXNvdXJjZXMvVGlsZVJlc291cmNlJztcclxuaW1wb3J0IHsgSW1hZ2VSZXNvdXJjZSB9IGZyb20gJy4vcmVzb3VyY2VzL0ltYWdlUmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBGb250UmVzb3VyY2UgfSBmcm9tICcuL3Jlc291cmNlcy9Gb250UmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBBdWRpb1Jlc291cmNlR3JvdXAgfSBmcm9tICcuL3Jlc291cmNlcy9BdWRpb1Jlc291cmNlR3JvdXAnO1xyXG5pbXBvcnQgeyBBdWRpb1Jlc291cmNlIH0gZnJvbSAnLi9yZXNvdXJjZXMvQXVkaW9SZXNvdXJjZSc7XHJcbmltcG9ydCB7IEl0ZW1UeXBlIH0gZnJvbSAnLi4vLi4vZ2xvYmFsL0ludmVudG9yeSc7XHJcbmltcG9ydCB7IFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZSB9IGZyb20gJy4vcmVzb3VyY2VzL1JlZmxlY3RlZEltYWdlUmVzb3VyY2UnO1xyXG5pbXBvcnQgUDUgZnJvbSAncDUnO1xyXG5pbXBvcnQgeyBSZXNvdXJjZSB9IGZyb20gJy4vcmVzb3VyY2VzL1Jlc291cmNlJztcclxuXHJcbmludGVyZmFjZSBBc3NldEdyb3VwIHtcclxuXHRbbmFtZTogc3RyaW5nXTpcclxuXHRcdHwge1xyXG5cdFx0XHRcdFtuYW1lOiBzdHJpbmddOlxyXG5cdFx0XHRcdFx0fCBSZXNvdXJjZVxyXG5cdFx0XHRcdFx0fCBBc3NldEdyb3VwXHJcblx0XHRcdFx0XHR8IEF1ZGlvUmVzb3VyY2VHcm91cFxyXG5cdFx0XHRcdFx0fCBBdWRpb1Jlc291cmNlXHJcblx0XHRcdFx0XHR8IEltYWdlUmVzb3VyY2VbXVxyXG4gICAgICAgICAgICAgICAgICAgIHwgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlW11cclxuICAgICAgICAgICAgICAgICAgICB8IFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZTtcclxuXHRcdCAgfVxyXG5cdFx0fCBSZXNvdXJjZVxyXG5cdFx0fCBBc3NldEdyb3VwXHJcblx0XHR8IEF1ZGlvUmVzb3VyY2VHcm91cFxyXG5cdFx0fCBBdWRpb1Jlc291cmNlXHJcblx0XHR8IEltYWdlUmVzb3VyY2VbXVxyXG5cdFx0fCBJbWFnZVJlc291cmNlW11bXVxyXG4gICAgICAgIHwgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlW11cclxuICAgICAgICB8IFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IFBsYXllckFuaW1hdGlvbnMgPSB7XHJcblx0aWRsZTogW1xyXG5cdFx0bmV3IFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3BsYXllci9zbm93bWFuLnBuZycpLFxyXG5cdF0sXHJcbn07XHJcblxyXG4vLyBJdGVtIHJlbGF0ZWQgYXNzZXRzXHJcbmV4cG9ydCBjb25zdCBJdGVtQXNzZXRzOiBSZWNvcmQ8SXRlbVR5cGUsIEltYWdlUmVzb3VyY2U+ID0ge1xyXG5cdFtJdGVtVHlwZS5Tbm93QmxvY2tdOiBuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdCdhc3NldHMvdGV4dHVyZXMvaXRlbXMvYmxvY2tfc25vdy5wbmcnLFxyXG5cdCksXHJcblx0W0l0ZW1UeXBlLkljZUJsb2NrXTogbmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHQnYXNzZXRzL3RleHR1cmVzL2l0ZW1zL2Jsb2NrX2ljZS5wbmcnLFxyXG5cdCksXHJcblx0W0l0ZW1UeXBlLkRpcnRCbG9ja106IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9ibG9ja19kaXJ0LnBuZycsXHJcblx0KSxcclxuXHRbSXRlbVR5cGUuU3RvbmUwQmxvY2tdOiBuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdCdhc3NldHMvdGV4dHVyZXMvaXRlbXMvYmxvY2tfc3RvbmUwLnBuZycsXHJcblx0KSxcclxuXHRbSXRlbVR5cGUuU3RvbmUxQmxvY2tdOiBuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdCdhc3NldHMvdGV4dHVyZXMvaXRlbXMvYmxvY2tfc3RvbmUxLnBuZycsXHJcblx0KSxcclxuXHRbSXRlbVR5cGUuU3RvbmUyQmxvY2tdOiBuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdCdhc3NldHMvdGV4dHVyZXMvaXRlbXMvYmxvY2tfc3RvbmUyLnBuZycsXHJcblx0KSxcclxuXHRbSXRlbVR5cGUuU3RvbmUzQmxvY2tdOiBuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdCdhc3NldHMvdGV4dHVyZXMvaXRlbXMvYmxvY2tfc3RvbmUzLnBuZycsXHJcblx0KSxcclxuXHRbSXRlbVR5cGUuU3RvbmU0QmxvY2tdOiBuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdCdhc3NldHMvdGV4dHVyZXMvaXRlbXMvYmxvY2tfc3RvbmU0LnBuZycsXHJcblx0KSxcclxuXHRbSXRlbVR5cGUuU3RvbmU1QmxvY2tdOiBuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdCdhc3NldHMvdGV4dHVyZXMvaXRlbXMvYmxvY2tfc3RvbmU1LnBuZycsXHJcblx0KSxcclxuXHRbSXRlbVR5cGUuU3RvbmU2QmxvY2tdOiBuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdCdhc3NldHMvdGV4dHVyZXMvaXRlbXMvYmxvY2tfc3RvbmU2LnBuZycsXHJcblx0KSxcclxuXHRbSXRlbVR5cGUuU3RvbmU3QmxvY2tdOiBuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdCdhc3NldHMvdGV4dHVyZXMvaXRlbXMvYmxvY2tfc3RvbmU3LnBuZycsXHJcblx0KSxcclxuXHRbSXRlbVR5cGUuU3RvbmU4QmxvY2tdOiBuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdCdhc3NldHMvdGV4dHVyZXMvaXRlbXMvYmxvY2tfc3RvbmU4LnBuZycsXHJcblx0KSxcclxuXHRbSXRlbVR5cGUuU3RvbmU5QmxvY2tdOiBuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdCdhc3NldHMvdGV4dHVyZXMvaXRlbXMvYmxvY2tfc3RvbmU5LnBuZycsXHJcblx0KSxcclxuXHRbSXRlbVR5cGUuVGluQmxvY2tdOiBuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdCdhc3NldHMvdGV4dHVyZXMvaXRlbXMvYmxvY2tfdGluLnBuZycsXHJcblx0KSxcclxuXHRbSXRlbVR5cGUuQWx1bWludW1CbG9ja106IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9ibG9ja19hbHVtaW51bS5wbmcnLFxyXG5cdCksXHJcblx0W0l0ZW1UeXBlLkdvbGRCbG9ja106IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9ibG9ja19nb2xkLnBuZycsXHJcblx0KSxcclxuXHRbSXRlbVR5cGUuVGl0YW5pdW1CbG9ja106IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9ibG9ja190aXRhbml1bS5wbmcnLFxyXG5cdCksXHJcblx0W0l0ZW1UeXBlLkdyYXBlQmxvY2tdOiBuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdCdhc3NldHMvdGV4dHVyZXMvaXRlbXMvYmxvY2tfZ3JhcGUucG5nJyxcclxuXHQpLFxyXG5cdFtJdGVtVHlwZS5Xb29kMEJsb2NrXTogbmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHQnYXNzZXRzL3RleHR1cmVzL2l0ZW1zL2Jsb2NrX3dvb2QwLnBuZycsXHJcblx0KSxcclxuXHRbSXRlbVR5cGUuV29vZDFCbG9ja106IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9ibG9ja193b29kMS5wbmcnLFxyXG5cdCksXHJcblx0W0l0ZW1UeXBlLldvb2QyQmxvY2tdOiBuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdCdhc3NldHMvdGV4dHVyZXMvaXRlbXMvYmxvY2tfd29vZDIucG5nJyxcclxuXHQpLFxyXG5cdFtJdGVtVHlwZS5Xb29kM0Jsb2NrXTogbmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHQnYXNzZXRzL3RleHR1cmVzL2l0ZW1zL2Jsb2NrX3dvb2QzLnBuZycsXHJcblx0KSxcclxuXHRbSXRlbVR5cGUuV29vZDRCbG9ja106IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9ibG9ja193b29kNC5wbmcnLFxyXG5cdCksXHJcblx0W0l0ZW1UeXBlLldvb2Q1QmxvY2tdOiBuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdCdhc3NldHMvdGV4dHVyZXMvaXRlbXMvYmxvY2tfd29vZDUucG5nJyxcclxuXHQpLFxyXG5cdFtJdGVtVHlwZS5Xb29kNkJsb2NrXTogbmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHQnYXNzZXRzL3RleHR1cmVzL2l0ZW1zL2Jsb2NrX3dvb2Q2LnBuZycsXHJcblx0KSxcclxuXHRbSXRlbVR5cGUuV29vZDdCbG9ja106IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9ibG9ja193b29kNy5wbmcnLFxyXG5cdCksXHJcblx0W0l0ZW1UeXBlLldvb2Q4QmxvY2tdOiBuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdCdhc3NldHMvdGV4dHVyZXMvaXRlbXMvYmxvY2tfd29vZDgucG5nJyxcclxuXHQpLFxyXG5cdFtJdGVtVHlwZS5Xb29kOUJsb2NrXTogbmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHQnYXNzZXRzL3RleHR1cmVzL2l0ZW1zL2Jsb2NrX3dvb2Q5LnBuZycsXHJcblx0KSxcclxuXHRbSXRlbVR5cGUuU2VlZF06IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9zZWVkLnBuZycsXHJcblx0KSxcclxufTtcclxuXHJcbi8vIFVpIHJlbGF0ZWQgYXNzZXRzXHJcbmV4cG9ydCBjb25zdCBVaUFzc2V0cyA9IHtcclxuXHR1aV9zbG90X3NlbGVjdGVkOiBuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdCdhc3NldHMvdGV4dHVyZXMvdWkvdWlzbG90X3NlbGVjdGVkLnBuZycsXHJcblx0KSxcclxuXHR1aV9zbG90OiBuZXcgSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3VpL3Vpc2xvdC5wbmcnKSxcclxuXHR1aV9mcmFtZTogbmV3IEltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy91aS91aWZyYW1lLnBuZycpLFxyXG5cdGJ1dHRvbl91bnNlbGVjdGVkOiBuZXcgSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3VpL2J1dHRvbjAucG5nJyksXHJcblx0YnV0dG9uX3NlbGVjdGVkOiBuZXcgSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3VpL2J1dHRvbjEucG5nJyksXHJcblx0c2xpZGVyX2JhcjogbmV3IEltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy91aS9zbGlkZXJCYXIucG5nJyksXHJcblx0c2xpZGVyX2hhbmRsZTogbmV3IEltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy91aS9zbGlkZXJIYW5kbGUucG5nJyksXHJcblx0dGl0bGVfaW1hZ2U6IG5ldyBJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvdWkvc25vd2VkaW5CVU1QLnBuZycpLFxyXG5cdHZpZ25ldHRlOiBuZXcgSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3VpL3ZpZ25ldHRlLWV4cG9ydC5wbmcnKSxcclxuXHRzZWxlY3RlZF90aWxlOiBuZXcgSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3VpL3NlbGVjdGVkdGlsZS5wbmcnKSxcclxufTtcclxuXHJcbi8vIFdvcmxkIHJlbGF0ZWQgYXNzZXRzXHJcbmV4cG9ydCBjb25zdCBXb3JsZEFzc2V0cyA9IHtcclxuXHRzaGFkZXJSZXNvdXJjZXM6IHtcclxuXHRcdHNreUltYWdlOiBuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy9zaGFkZXJfcmVzb3VyY2VzL3BvaXNzb25zbm93LnBuZycsXHJcblx0XHQpLFxyXG5cdH0sXHJcblx0bWlkZGxlZ3JvdW5kOiB7XHJcblx0XHR0aWxlc2V0X2ljZTogbmV3IFRpbGVSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9taWRkbGVncm91bmQvdGlsZXNldF9pY2UucG5nJyxcclxuXHRcdFx0MTYsXHJcblx0XHRcdDEsXHJcblx0XHRcdDgsXHJcblx0XHRcdDgsXHJcblx0XHQpLFxyXG5cdFx0dGlsZXNldF9zbm93OiBuZXcgVGlsZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL21pZGRsZWdyb3VuZC90aWxlc2V0X3Nub3cucG5nJyxcclxuXHRcdFx0MTYsXHJcblx0XHRcdDEsXHJcblx0XHRcdDgsXHJcblx0XHRcdDgsXHJcblx0XHQpLFxyXG5cdFx0dGlsZXNldF9kaXJ0OiBuZXcgVGlsZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL21pZGRsZWdyb3VuZC90aWxlc2V0X2RpcnQwLnBuZycsXHJcblx0XHRcdDE2LFxyXG5cdFx0XHQxLFxyXG5cdFx0XHQ4LFxyXG5cdFx0XHQ4LFxyXG5cdFx0KSxcclxuXHRcdHRpbGVzZXRfc3RvbmUwOiBuZXcgVGlsZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL21pZGRsZWdyb3VuZC90aWxlc2V0X3N0b25lMC5wbmcnLFxyXG5cdFx0XHQxNixcclxuXHRcdFx0MSxcclxuXHRcdFx0OCxcclxuXHRcdFx0OCxcclxuXHRcdCksXHJcblx0XHR0aWxlc2V0X3N0b25lMTogbmV3IFRpbGVSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9taWRkbGVncm91bmQvdGlsZXNldF9zdG9uZTEucG5nJyxcclxuXHRcdFx0MTYsXHJcblx0XHRcdDEsXHJcblx0XHRcdDgsXHJcblx0XHRcdDgsXHJcblx0XHQpLFxyXG5cdFx0dGlsZXNldF9zdG9uZTI6IG5ldyBUaWxlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvbWlkZGxlZ3JvdW5kL3RpbGVzZXRfc3RvbmUyLnBuZycsXHJcblx0XHRcdDE2LFxyXG5cdFx0XHQxLFxyXG5cdFx0XHQ4LFxyXG5cdFx0XHQ4LFxyXG5cdFx0KSxcclxuXHRcdHRpbGVzZXRfc3RvbmUzOiBuZXcgVGlsZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL21pZGRsZWdyb3VuZC90aWxlc2V0X3N0b25lMy5wbmcnLFxyXG5cdFx0XHQxNixcclxuXHRcdFx0MSxcclxuXHRcdFx0OCxcclxuXHRcdFx0OCxcclxuXHRcdCksXHJcblx0XHR0aWxlc2V0X3N0b25lNDogbmV3IFRpbGVSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9taWRkbGVncm91bmQvdGlsZXNldF9zdG9uZTQucG5nJyxcclxuXHRcdFx0MTYsXHJcblx0XHRcdDEsXHJcblx0XHRcdDgsXHJcblx0XHRcdDgsXHJcblx0XHQpLFxyXG5cdFx0dGlsZXNldF9zdG9uZTU6IG5ldyBUaWxlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvbWlkZGxlZ3JvdW5kL3RpbGVzZXRfc3RvbmU1LnBuZycsXHJcblx0XHRcdDE2LFxyXG5cdFx0XHQxLFxyXG5cdFx0XHQ4LFxyXG5cdFx0XHQ4LFxyXG5cdFx0KSxcclxuXHRcdHRpbGVzZXRfc3RvbmU2OiBuZXcgVGlsZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL21pZGRsZWdyb3VuZC90aWxlc2V0X3N0b25lNi5wbmcnLFxyXG5cdFx0XHQxNixcclxuXHRcdFx0MSxcclxuXHRcdFx0OCxcclxuXHRcdFx0OCxcclxuXHRcdCksXHJcblx0XHR0aWxlc2V0X3N0b25lNzogbmV3IFRpbGVSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9taWRkbGVncm91bmQvdGlsZXNldF9zdG9uZTcucG5nJyxcclxuXHRcdFx0MTYsXHJcblx0XHRcdDEsXHJcblx0XHRcdDgsXHJcblx0XHRcdDgsXHJcblx0XHQpLFxyXG5cdFx0dGlsZXNldF9zdG9uZTg6IG5ldyBUaWxlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvbWlkZGxlZ3JvdW5kL3RpbGVzZXRfc3RvbmU4LnBuZycsXHJcblx0XHRcdDE2LFxyXG5cdFx0XHQxLFxyXG5cdFx0XHQ4LFxyXG5cdFx0XHQ4LFxyXG5cdFx0KSxcclxuXHRcdHRpbGVzZXRfc3RvbmU5OiBuZXcgVGlsZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL21pZGRsZWdyb3VuZC90aWxlc2V0X3N0b25lOS5wbmcnLFxyXG5cdFx0XHQxNixcclxuXHRcdFx0MSxcclxuXHRcdFx0OCxcclxuXHRcdFx0OCxcclxuXHRcdCksXHJcblx0XHR0aWxlc2V0X3RpbjogbmV3IFRpbGVSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9taWRkbGVncm91bmQvdGlsZXNldF90aW4ucG5nJyxcclxuXHRcdFx0MTYsXHJcblx0XHRcdDEsXHJcblx0XHRcdDgsXHJcblx0XHRcdDgsXHJcblx0XHQpLFxyXG5cdFx0dGlsZXNldF9hbHVtaW51bTogbmV3IFRpbGVSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9taWRkbGVncm91bmQvdGlsZXNldF9hbHVtaW51bS5wbmcnLFxyXG5cdFx0XHQxNixcclxuXHRcdFx0MSxcclxuXHRcdFx0OCxcclxuXHRcdFx0OCxcclxuXHRcdCksXHJcblx0XHR0aWxlc2V0X2dvbGQ6IG5ldyBUaWxlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvbWlkZGxlZ3JvdW5kL3RpbGVzZXRfZ29sZC5wbmcnLFxyXG5cdFx0XHQxNixcclxuXHRcdFx0MSxcclxuXHRcdFx0OCxcclxuXHRcdFx0OCxcclxuXHRcdCksXHJcblx0XHR0aWxlc2V0X3RpdGFuaXVtOiBuZXcgVGlsZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL21pZGRsZWdyb3VuZC90aWxlc2V0X3RpdGFuaXVtLnBuZycsXHJcblx0XHRcdDE2LFxyXG5cdFx0XHQxLFxyXG5cdFx0XHQ4LFxyXG5cdFx0XHQ4LFxyXG5cdFx0KSxcclxuXHRcdHRpbGVzZXRfZ3JhcGU6IG5ldyBUaWxlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvbWlkZGxlZ3JvdW5kL3RpbGVzZXRfZ3JhcGUucG5nJyxcclxuXHRcdFx0MTYsXHJcblx0XHRcdDEsXHJcblx0XHRcdDgsXHJcblx0XHRcdDgsXHJcblx0XHQpLFxyXG5cdFx0dGlsZXNldF93b29kMDogbmV3IFRpbGVSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9taWRkbGVncm91bmQvd29vZDAucG5nJyxcclxuXHRcdFx0MSxcclxuXHRcdFx0MSxcclxuXHRcdFx0OCxcclxuXHRcdFx0OCxcclxuXHRcdCksXHJcblx0XHR0aWxlc2V0X3dvb2QxOiBuZXcgVGlsZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL21pZGRsZWdyb3VuZC90aWxlc2V0X3dvb2QxLnBuZycsXHJcblx0XHRcdDE2LFxyXG5cdFx0XHQxLFxyXG5cdFx0XHQ4LFxyXG5cdFx0XHQ4LFxyXG5cdFx0KSxcclxuXHRcdHRpbGVzZXRfd29vZDI6IG5ldyBUaWxlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvbWlkZGxlZ3JvdW5kL3RpbGVzZXRfd29vZDIucG5nJyxcclxuXHRcdFx0MTYsXHJcblx0XHRcdDEsXHJcblx0XHRcdDgsXHJcblx0XHRcdDgsXHJcblx0XHQpLFxyXG5cdFx0dGlsZXNldF93b29kMzogbmV3IFRpbGVSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9taWRkbGVncm91bmQvdGlsZXNldF93b29kMy5wbmcnLFxyXG5cdFx0XHQxNixcclxuXHRcdFx0MSxcclxuXHRcdFx0OCxcclxuXHRcdFx0OCxcclxuXHRcdCksXHJcblx0XHR0aWxlc2V0X3dvb2Q0OiBuZXcgVGlsZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL21pZGRsZWdyb3VuZC90aWxlc2V0X3dvb2Q0LnBuZycsXHJcblx0XHRcdDE2LFxyXG5cdFx0XHQxLFxyXG5cdFx0XHQ4LFxyXG5cdFx0XHQ4LFxyXG5cdFx0KSxcclxuXHRcdHRpbGVzZXRfd29vZDU6IG5ldyBUaWxlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvbWlkZGxlZ3JvdW5kL3RpbGVzZXRfd29vZDUucG5nJyxcclxuXHRcdFx0MTYsXHJcblx0XHRcdDEsXHJcblx0XHRcdDgsXHJcblx0XHRcdDgsXHJcblx0XHQpLFxyXG5cdFx0dGlsZXNldF93b29kNjogbmV3IFRpbGVSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9taWRkbGVncm91bmQvdGlsZXNldF93b29kNi5wbmcnLFxyXG5cdFx0XHQxNixcclxuXHRcdFx0MSxcclxuXHRcdFx0OCxcclxuXHRcdFx0OCxcclxuXHRcdCksXHJcblx0XHR0aWxlc2V0X3dvb2Q3OiBuZXcgVGlsZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL21pZGRsZWdyb3VuZC90aWxlc2V0X3dvb2Q3LnBuZycsXHJcblx0XHRcdDE2LFxyXG5cdFx0XHQxLFxyXG5cdFx0XHQ4LFxyXG5cdFx0XHQ4LFxyXG5cdFx0KSxcclxuXHRcdHRpbGVzZXRfd29vZDg6IG5ldyBUaWxlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvbWlkZGxlZ3JvdW5kL3RpbGVzZXRfd29vZDgucG5nJyxcclxuXHRcdFx0MTYsXHJcblx0XHRcdDEsXHJcblx0XHRcdDgsXHJcblx0XHRcdDgsXHJcblx0XHQpLFxyXG5cdFx0dGlsZXNldF93b29kOTogbmV3IFRpbGVSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9taWRkbGVncm91bmQvdGlsZXNldF93b29kOS5wbmcnLFxyXG5cdFx0XHQxNixcclxuXHRcdFx0MSxcclxuXHRcdFx0OCxcclxuXHRcdFx0OCxcclxuXHRcdCksXHJcblx0fSxcclxuXHRmb3JlZ3JvdW5kOiB7XHJcblx0XHRcclxuXHR9LFxyXG5cdHRpbGVFbnRpdGllczogW1xyXG5cdFx0Wy8vdHJlZVxyXG5cdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvdGlsZUVudGl0aWVzL3RyZWVzL1RyZWUxLnBuZycsXHJcblx0XHQpLFxyXG5cdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvdGlsZUVudGl0aWVzL3RyZWVzL1RyZWUyLnBuZycsXHJcblx0XHQpLFxyXG5cdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvdGlsZUVudGl0aWVzL3RyZWVzL1RyZWUzLnBuZycsXHJcblx0XHQpLFxyXG5cdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvdGlsZUVudGl0aWVzL3RyZWVzL1RyZWU0LnBuZycsXHJcblx0XHQpLFxyXG5cdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvdGlsZUVudGl0aWVzL3RyZWVzL1RyZWU1LnBuZycsXHJcblx0XHQpLFxyXG5cdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvdGlsZUVudGl0aWVzL3RyZWVzL1RyZWU2LnBuZycsXHJcblx0XHQpLFxyXG5cdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvdGlsZUVudGl0aWVzL3RyZWVzL1RyZWU3LnBuZycsXHJcblx0XHQpLFxyXG5cdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvdGlsZUVudGl0aWVzL3RyZWVzL1RyZWU4LnBuZycsXHJcblx0XHQpLFxyXG5cdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvdGlsZUVudGl0aWVzL3RyZWVzL1RyZWU5LnBuZycsXHJcblx0XHQpLFxyXG5cdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvdGlsZUVudGl0aWVzL3RyZWVzL1RyZWUxMC5wbmcnLFxyXG5cdFx0KSxcclxuXHRcdF0sXHJcblx0XHRbLy9kcmlsbCB0aWVyIDFcclxuXHRcdG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL3RpbGVFbnRpdGllcy9SdXN0eSBEcmlsbC9SdXN0eURyaWxsMS5wbmcnLFxyXG5cdFx0KSxcclxuXHRcdG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL3RpbGVFbnRpdGllcy9SdXN0eSBEcmlsbC9SdXN0eURyaWxsMi5wbmcnLFxyXG5cdFx0KSxcclxuXHRcdG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL3RpbGVFbnRpdGllcy9SdXN0eSBEcmlsbC9SdXN0eURyaWxsMy5wbmcnLFxyXG5cdFx0KSxcclxuXHRcdG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL3RpbGVFbnRpdGllcy9SdXN0eSBEcmlsbC9SdXN0eURyaWxsNC5wbmcnLFxyXG5cdFx0KSxcclxuXHRcdG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL3RpbGVFbnRpdGllcy9SdXN0eSBEcmlsbC9SdXN0eURyaWxsNS5wbmcnLFxyXG5cdFx0KSxcclxuXHRcdG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL3RpbGVFbnRpdGllcy9SdXN0eSBEcmlsbC9SdXN0eURyaWxsNi5wbmcnLFxyXG5cdFx0KSxcclxuXHRcdG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL3RpbGVFbnRpdGllcy9SdXN0eSBEcmlsbC9SdXN0eURyaWxsNy5wbmcnLFxyXG5cdFx0KSxcclxuXHRcdG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL3RpbGVFbnRpdGllcy9SdXN0eSBEcmlsbC9SdXN0eURyaWxsOC5wbmcnLFxyXG5cdFx0KSxcclxuXHRcdG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL3RpbGVFbnRpdGllcy9SdXN0eSBEcmlsbC9SdXN0eURyaWxsOS5wbmcnLFxyXG5cdFx0KSxcclxuXHRcdG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL3RpbGVFbnRpdGllcy9SdXN0eSBEcmlsbC9SdXN0eURyaWxsMTAucG5nJyxcclxuXHRcdCksXHJcblx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC90aWxlRW50aXRpZXMvUnVzdHkgRHJpbGwvUnVzdHlEcmlsbDExLnBuZycsXHJcblx0XHQpLFxyXG5cdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvdGlsZUVudGl0aWVzL1J1c3R5IERyaWxsL1J1c3R5RHJpbGwxMi5wbmcnLFxyXG5cdFx0KSxcclxuXHRcdG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL3RpbGVFbnRpdGllcy9SdXN0eSBEcmlsbC9SdXN0eURyaWxsMTMucG5nJyxcclxuXHRcdCksXHJcblx0XHRdLFxyXG5cdFx0Wy8vZHJpbGwgdGllciAyXHJcblxyXG5cdFx0XSxcclxuXHRcdFsvL2RyaWxsIHRpZXIgM1xyXG5cclxuXHRcdF0sXHJcblx0XHRbLy9kcmlsbCB0aWVyIDRcclxuXHJcblx0XHRdLFxyXG5cdFx0Wy8vZHJpbGwgdGllciA1XHJcblxyXG5cdFx0XSxcclxuXHRcdFsvL2NyYWZ0aW5nIGJlbmNoXHJcblx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC90aWxlRW50aXRpZXMvbWlzYy9jcmFmdGluZ0JlbmNoLnBuZycsXHJcblx0XHQpLFxyXG5cdFx0XSxcclxuXHRcdFsvL3NhcGxpbmcvc2VlZFxyXG5cdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvdGlsZUVudGl0aWVzL3RyZWVzL3NhcGxpbmcucG5nJyxcclxuXHRcdCksXHJcblx0XHRdXHJcblx0XSxcclxuXHRlbnRpdGllczoge1xyXG5cdFx0ZW50aXR5X3QxZHJvbmU6IFtcclxuXHRcdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9lbnRpdGllcy9TbWFsbCBEcm9uZS9TbWFsbERyb25lMDEucG5nJyxcclxuXHRcdFx0KSxcclxuXHRcdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9lbnRpdGllcy9TbWFsbCBEcm9uZS9TbWFsbERyb25lMDIucG5nJyxcclxuXHRcdFx0KSxcclxuXHRcdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9lbnRpdGllcy9TbWFsbCBEcm9uZS9TbWFsbERyb25lMDMucG5nJyxcclxuXHRcdFx0KSxcclxuXHRcdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9lbnRpdGllcy9TbWFsbCBEcm9uZS9TbWFsbERyb25lMDQucG5nJyxcclxuXHRcdFx0KSxcclxuXHRcdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9lbnRpdGllcy9TbWFsbCBEcm9uZS9TbWFsbERyb25lMDUucG5nJyxcclxuXHRcdFx0KSxcclxuXHRcdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9lbnRpdGllcy9TbWFsbCBEcm9uZS9TbWFsbERyb25lMDYucG5nJyxcclxuXHRcdFx0KSxcclxuXHRcdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9lbnRpdGllcy9TbWFsbCBEcm9uZS9TbWFsbERyb25lMDcucG5nJyxcclxuXHRcdFx0KSxcclxuXHRcdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9lbnRpdGllcy9TbWFsbCBEcm9uZS9TbWFsbERyb25lMDgucG5nJyxcclxuXHRcdFx0KSxcclxuXHRcdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9lbnRpdGllcy9TbWFsbCBEcm9uZS9TbWFsbERyb25lMDkucG5nJyxcclxuXHRcdFx0KSxcclxuXHRcdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9lbnRpdGllcy9TbWFsbCBEcm9uZS9TbWFsbERyb25lMTAucG5nJyxcclxuXHRcdFx0KSxcclxuXHRcdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9lbnRpdGllcy9TbWFsbCBEcm9uZS9TbWFsbERyb25lMTEucG5nJyxcclxuXHRcdFx0KSxcclxuXHRcdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9lbnRpdGllcy9TbWFsbCBEcm9uZS9TbWFsbERyb25lMTIucG5nJyxcclxuXHRcdFx0KSxcclxuXHRcdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9lbnRpdGllcy9TbWFsbCBEcm9uZS9TbWFsbERyb25lMTMucG5nJyxcclxuXHRcdFx0KSxcclxuXHRcdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9lbnRpdGllcy9TbWFsbCBEcm9uZS9TbWFsbERyb25lMTQucG5nJyxcclxuXHRcdFx0KSxcclxuXHRcdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9lbnRpdGllcy9TbWFsbCBEcm9uZS9TbWFsbERyb25lMTUucG5nJyxcclxuXHRcdFx0KSxcclxuXHRcdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9lbnRpdGllcy9TbWFsbCBEcm9uZS9TbWFsbERyb25lMTYucG5nJyxcclxuXHRcdFx0KSxcclxuXHRcdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9lbnRpdGllcy9TbWFsbCBEcm9uZS9TbWFsbERyb25lMTcucG5nJyxcclxuXHRcdFx0KSxcclxuXHRcdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9lbnRpdGllcy9TbWFsbCBEcm9uZS9TbWFsbERyb25lMTgucG5nJyxcclxuXHRcdFx0KSxcclxuXHRcdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9lbnRpdGllcy9TbWFsbCBEcm9uZS9TbWFsbERyb25lMTkucG5nJyxcclxuXHRcdFx0KSxcclxuXHRcdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9lbnRpdGllcy9TbWFsbCBEcm9uZS9TbWFsbERyb25lMjAucG5nJyxcclxuXHRcdFx0KSxcclxuXHRcdF0sXHJcblx0fVxyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IEZvbnRzID0ge1xyXG5cdHRpdGxlOiBuZXcgRm9udFJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy91aS9mb250LnBuZycsXHJcblx0XHR7XHJcblx0XHRcdCcwJzogNyxcclxuXHRcdFx0JzEnOiA3LFxyXG5cdFx0XHQnMic6IDcsXHJcblx0XHRcdCczJzogNixcclxuXHRcdFx0JzQnOiA2LFxyXG5cdFx0XHQnNSc6IDYsXHJcblx0XHRcdCc2JzogNixcclxuXHRcdFx0JzcnOiA3LFxyXG5cdFx0XHQnOCc6IDcsXHJcblx0XHRcdCc5JzogNixcclxuXHRcdFx0J0EnOiA2LFxyXG5cdFx0XHQnQic6IDcsXHJcblx0XHRcdCdDJzogNyxcclxuXHRcdFx0J0QnOiA2LFxyXG5cdFx0XHQnRSc6IDcsXHJcblx0XHRcdCdGJzogNixcclxuXHRcdFx0J0cnOiA3LFxyXG5cdFx0XHQnSCc6IDcsXHJcblx0XHRcdCdJJzogNyxcclxuXHRcdFx0J0onOiA4LFxyXG5cdFx0XHQnSyc6IDYsXHJcblx0XHRcdCdMJzogNixcclxuXHRcdFx0J00nOiA4LFxyXG5cdFx0XHQnTic6IDgsXHJcblx0XHRcdCdPJzogOCxcclxuXHRcdFx0J1AnOiA5LFxyXG5cdFx0XHQnUSc6IDgsXHJcblx0XHRcdCdSJzogNyxcclxuXHRcdFx0J1MnOiA3LFxyXG5cdFx0XHQnVCc6IDgsXHJcblx0XHRcdCdVJzogOCxcclxuXHRcdFx0J1YnOiA4LFxyXG5cdFx0XHQnVyc6IDEwLFxyXG5cdFx0XHQnWCc6IDgsXHJcblx0XHRcdCdZJzogOCxcclxuXHRcdFx0J1onOiA5LFxyXG5cdFx0XHQnYSc6IDcsXHJcblx0XHRcdCdiJzogNyxcclxuXHRcdFx0J2MnOiA2LFxyXG5cdFx0XHQnZCc6IDcsXHJcblx0XHRcdCdlJzogNixcclxuXHRcdFx0J2YnOiA2LFxyXG5cdFx0XHQnZyc6IDYsXHJcblx0XHRcdCdoJzogNixcclxuXHRcdFx0J2knOiA1LFxyXG5cdFx0XHQnaic6IDYsXHJcblx0XHRcdCdrJzogNSxcclxuXHRcdFx0J2wnOiA1LFxyXG5cdFx0XHQnbSc6IDgsXHJcblx0XHRcdCduJzogNSxcclxuXHRcdFx0J28nOiA1LFxyXG5cdFx0XHQncCc6IDUsXHJcblx0XHRcdCdxJzogNyxcclxuXHRcdFx0J3InOiA1LFxyXG5cdFx0XHQncyc6IDQsXHJcblx0XHRcdCd0JzogNSxcclxuXHRcdFx0J3UnOiA1LFxyXG5cdFx0XHQndic6IDUsXHJcblx0XHRcdCd3JzogNyxcclxuXHRcdFx0J3gnOiA2LFxyXG5cdFx0XHQneSc6IDUsXHJcblx0XHRcdCd6JzogNSxcclxuXHRcdFx0JyEnOiA0LFxyXG5cdFx0XHQnLic6IDIsXHJcblx0XHRcdCcsJzogMixcclxuXHRcdFx0Jz8nOiA2LFxyXG5cdFx0XHQnXyc6IDYsXHJcblx0XHRcdCctJzogNCxcclxuXHRcdFx0JzonOiAyLFxyXG5cdFx0XHQn4oaRJzogNyxcclxuXHRcdFx0J+KGkyc6IDcsXHJcblx0XHRcdCcgJzogMixcclxuXHRcdH0sXHJcblx0XHQnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkhLiw/Xy064oaR4oaTICcsXHJcblx0XHQxMixcclxuXHQpLFxyXG5cclxuXHRiaWc6IG5ldyBGb250UmVzb3VyY2UoXHJcblx0XHQnYXNzZXRzL3RleHR1cmVzL3VpL2ZvbnRCaWcucG5nJyxcclxuXHRcdHtcclxuXHRcdFx0JzAnOiAxNSxcclxuXHRcdFx0JzEnOiAxNCxcclxuXHRcdFx0JzInOiAxNCxcclxuXHRcdFx0JzMnOiAxMyxcclxuXHRcdFx0JzQnOiAxMixcclxuXHRcdFx0JzUnOiAxMyxcclxuXHRcdFx0JzYnOiAxMixcclxuXHRcdFx0JzcnOiAxNCxcclxuXHRcdFx0JzgnOiAxNSxcclxuXHRcdFx0JzknOiAxMixcclxuXHRcdFx0J0EnOiAxMyxcclxuXHRcdFx0J0InOiAxNCxcclxuXHRcdFx0J0MnOiAxNSxcclxuXHRcdFx0J0QnOiAxMixcclxuXHRcdFx0J0UnOiAxNCxcclxuXHRcdFx0J0YnOiAxMyxcclxuXHRcdFx0J0cnOiAxNCxcclxuXHRcdFx0J0gnOiAxNSxcclxuXHRcdFx0J0knOiAxNSxcclxuXHRcdFx0J0onOiAxNixcclxuXHRcdFx0J0snOiAxMixcclxuXHRcdFx0J0wnOiAxMyxcclxuXHRcdFx0J00nOiAxNixcclxuXHRcdFx0J04nOiAxNyxcclxuXHRcdFx0J08nOiAxNyxcclxuXHRcdFx0J1AnOiAxOSxcclxuXHRcdFx0J1EnOiAxNyxcclxuXHRcdFx0J1InOiAxNCxcclxuXHRcdFx0J1MnOiAxNSxcclxuXHRcdFx0J1QnOiAxNyxcclxuXHRcdFx0J1UnOiAxNixcclxuXHRcdFx0J1YnOiAxNyxcclxuXHRcdFx0J1cnOiAyMSxcclxuXHRcdFx0J1gnOiAxNyxcclxuXHRcdFx0J1knOiAxNyxcclxuXHRcdFx0J1onOiAxOSxcclxuXHRcdFx0J2EnOiAxMixcclxuXHRcdFx0J2InOiAxNSxcclxuXHRcdFx0J2MnOiAxMixcclxuXHRcdFx0J2QnOiAxNSxcclxuXHRcdFx0J2UnOiAxMyxcclxuXHRcdFx0J2YnOiAxMixcclxuXHRcdFx0J2cnOiAxMyxcclxuXHRcdFx0J2gnOiAxMixcclxuXHRcdFx0J2knOiAxMSxcclxuXHRcdFx0J2onOiAxMixcclxuXHRcdFx0J2snOiAxMCxcclxuXHRcdFx0J2wnOiAxMCxcclxuXHRcdFx0J20nOiAxNixcclxuXHRcdFx0J24nOiAxMSxcclxuXHRcdFx0J28nOiAxMCxcclxuXHRcdFx0J3AnOiAxMSxcclxuXHRcdFx0J3EnOiAxNCxcclxuXHRcdFx0J3InOiAxMSxcclxuXHRcdFx0J3MnOiA4LFxyXG5cdFx0XHQndCc6IDExLFxyXG5cdFx0XHQndSc6IDEwLFxyXG5cdFx0XHQndic6IDExLFxyXG5cdFx0XHQndyc6IDE1LFxyXG5cdFx0XHQneCc6IDEyLFxyXG5cdFx0XHQneSc6IDExLFxyXG5cdFx0XHQneic6IDEwLFxyXG5cdFx0XHQnISc6IDksXHJcblx0XHRcdCcuJzogNCxcclxuXHRcdFx0JywnOiA0LFxyXG5cdFx0XHQnPyc6IDEzLFxyXG5cdFx0XHQnXyc6IDEzLFxyXG5cdFx0XHQnLSc6IDgsXHJcblx0XHRcdCc6JzogNCxcclxuXHRcdFx0JyAnOiA0LFxyXG5cdFx0fSxcclxuXHRcdCdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSEuLD9fLTogJyxcclxuXHRcdDI0LFxyXG5cdCksXHJcblx0dG9tX3RodW1iOiBuZXcgRm9udFJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy91aS90b21fdGh1bWIucG5nJyxcclxuXHRcdHtcclxuXHRcdFx0J0EnOiAzLFxyXG5cdFx0XHQnQic6IDMsXHJcblx0XHRcdCdDJzogMyxcclxuXHRcdFx0J0QnOiAzLFxyXG5cdFx0XHQnRSc6IDMsXHJcblx0XHRcdCdGJzogMyxcclxuXHRcdFx0J0cnOiAzLFxyXG5cdFx0XHQnSCc6IDMsXHJcblx0XHRcdCdJJzogMyxcclxuXHRcdFx0J0onOiAzLFxyXG5cdFx0XHQnSyc6IDMsXHJcblx0XHRcdCdMJzogMyxcclxuXHRcdFx0J00nOiAzLFxyXG5cdFx0XHQnTic6IDMsXHJcblx0XHRcdCdPJzogMyxcclxuXHRcdFx0J1AnOiAzLFxyXG5cdFx0XHQnUSc6IDMsXHJcblx0XHRcdCdSJzogMyxcclxuXHRcdFx0J1MnOiAzLFxyXG5cdFx0XHQnVCc6IDMsXHJcblx0XHRcdCdVJzogMyxcclxuXHRcdFx0J1YnOiAzLFxyXG5cdFx0XHQnVyc6IDMsXHJcblx0XHRcdCdYJzogMyxcclxuXHRcdFx0J1knOiAzLFxyXG5cdFx0XHQnWic6IDMsXHJcblx0XHRcdCdhJzogMyxcclxuXHRcdFx0J2InOiAzLFxyXG5cdFx0XHQnYyc6IDMsXHJcblx0XHRcdCdkJzogMyxcclxuXHRcdFx0J2UnOiAzLFxyXG5cdFx0XHQnZic6IDMsXHJcblx0XHRcdCdnJzogMyxcclxuXHRcdFx0J2gnOiAzLFxyXG5cdFx0XHQnaSc6IDMsXHJcblx0XHRcdCdqJzogMyxcclxuXHRcdFx0J2snOiAzLFxyXG5cdFx0XHQnbCc6IDMsXHJcblx0XHRcdCdtJzogMyxcclxuXHRcdFx0J24nOiAzLFxyXG5cdFx0XHQnbyc6IDMsXHJcblx0XHRcdCdwJzogMyxcclxuXHRcdFx0J3EnOiAzLFxyXG5cdFx0XHQncic6IDMsXHJcblx0XHRcdCdzJzogMyxcclxuXHRcdFx0J3QnOiAzLFxyXG5cdFx0XHQndSc6IDMsXHJcblx0XHRcdCd2JzogMyxcclxuXHRcdFx0J3cnOiAzLFxyXG5cdFx0XHQneCc6IDMsXHJcblx0XHRcdCd5JzogMyxcclxuXHRcdFx0J3onOiAzLFxyXG5cdFx0XHQnWyc6IDMsXHJcblx0XHRcdCdcXFxcJzogMyxcclxuXHRcdFx0J10nOiAzLFxyXG5cdFx0XHQnXic6IDMsXHJcblx0XHRcdCcgJzogMyxcclxuXHRcdFx0JyEnOiAzLFxyXG5cdFx0XHQnXCInOiAzLFxyXG5cdFx0XHQnIyc6IDMsXHJcblx0XHRcdCckJzogMyxcclxuXHRcdFx0JyUnOiAzLFxyXG5cdFx0XHQnJic6IDMsXHJcblx0XHRcdFwiJ1wiOiAzLFxyXG5cdFx0XHQnKCc6IDMsXHJcblx0XHRcdCcpJzogMyxcclxuXHRcdFx0JyonOiAzLFxyXG5cdFx0XHQnKyc6IDMsXHJcblx0XHRcdCcsJzogMyxcclxuXHRcdFx0Jy0nOiAzLFxyXG5cdFx0XHQnLic6IDMsXHJcblx0XHRcdCcvJzogMyxcclxuXHRcdFx0JzAnOiAzLFxyXG5cdFx0XHQnMSc6IDMsXHJcblx0XHRcdCcyJzogMyxcclxuXHRcdFx0JzMnOiAzLFxyXG5cdFx0XHQnNCc6IDMsXHJcblx0XHRcdCc1JzogMyxcclxuXHRcdFx0JzYnOiAzLFxyXG5cdFx0XHQnNyc6IDMsXHJcblx0XHRcdCc4JzogMyxcclxuXHRcdFx0JzknOiAzLFxyXG5cdFx0XHQnOic6IDMsXHJcblx0XHRcdCc7JzogMyxcclxuXHRcdFx0JzwnOiAzLFxyXG5cdFx0XHQnPSc6IDMsXHJcblx0XHRcdCc+JzogMyxcclxuXHRcdFx0Jz8nOiAzLFxyXG5cdFx0fSxcclxuXHRcdGBBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6W1xcXFxdXiAhXCIjJCUmJygpKissLS4vMDEyMzQ1Njc4OTo7PD0+P2AsXHJcblx0XHQ1LFxyXG5cdCksXHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgS2V5cyA9IHtcclxuXHRrZXlib2FyZE1hcDogW1xyXG5cdFx0JycsIC8vIFswXVxyXG5cdFx0JycsIC8vIFsxXVxyXG5cdFx0JycsIC8vIFsyXVxyXG5cdFx0J0NBTkNFTCcsIC8vIFszXVxyXG5cdFx0JycsIC8vIFs0XVxyXG5cdFx0JycsIC8vIFs1XVxyXG5cdFx0J0hFTFAnLCAvLyBbNl1cclxuXHRcdCcnLCAvLyBbN11cclxuXHRcdCdCQUNLU1BBQ0UnLCAvLyBbOF1cclxuXHRcdCdUQUInLCAvLyBbOV1cclxuXHRcdCcnLCAvLyBbMTBdXHJcblx0XHQnJywgLy8gWzExXVxyXG5cdFx0J0NMRUFSJywgLy8gWzEyXVxyXG5cdFx0J0VOVEVSJywgLy8gWzEzXVxyXG5cdFx0J0VOVEVSIFNQRUNJQUwnLCAvLyBbMTRdXHJcblx0XHQnJywgLy8gWzE1XVxyXG5cdFx0J1NISUZUJywgLy8gWzE2XVxyXG5cdFx0J0NPTlRST0wnLCAvLyBbMTddXHJcblx0XHQnQUxUJywgLy8gWzE4XVxyXG5cdFx0J1BBVVNFJywgLy8gWzE5XVxyXG5cdFx0J0NBUFMgTE9DSycsIC8vIFsyMF1cclxuXHRcdCdLQU5BJywgLy8gWzIxXVxyXG5cdFx0J0VJU1UnLCAvLyBbMjJdXHJcblx0XHQnSlVOSkEnLCAvLyBbMjNdXHJcblx0XHQnRklOQUwnLCAvLyBbMjRdXHJcblx0XHQnSEFOSkEnLCAvLyBbMjVdXHJcblx0XHQnJywgLy8gWzI2XVxyXG5cdFx0J0VTQ0FQRScsIC8vIFsyN11cclxuXHRcdCdDT05WRVJUJywgLy8gWzI4XVxyXG5cdFx0J05PTkNPTlZFUlQnLCAvLyBbMjldXHJcblx0XHQnQUNDRVBUJywgLy8gWzMwXVxyXG5cdFx0J01PREVDSEFOR0UnLCAvLyBbMzFdXHJcblx0XHQnU1BBQ0UnLCAvLyBbMzJdXHJcblx0XHQnUEFHRSBVUCcsIC8vIFszM11cclxuXHRcdCdQQUdFIERPV04nLCAvLyBbMzRdXHJcblx0XHQnRU5EJywgLy8gWzM1XVxyXG5cdFx0J0hPTUUnLCAvLyBbMzZdXHJcblx0XHQnTEVGVCcsIC8vIFszN11cclxuXHRcdCdVUCcsIC8vIFszOF1cclxuXHRcdCdSSUdIVCcsIC8vIFszOV1cclxuXHRcdCdET1dOJywgLy8gWzQwXVxyXG5cdFx0J1NFTEVDVCcsIC8vIFs0MV1cclxuXHRcdCdQUklOVCcsIC8vIFs0Ml1cclxuXHRcdCdFWEVDVVRFJywgLy8gWzQzXVxyXG5cdFx0J1BSSU5UIFNDUkVFTicsIC8vIFs0NF1cclxuXHRcdCdJTlNFUlQnLCAvLyBbNDVdXHJcblx0XHQnREVMRVRFJywgLy8gWzQ2XVxyXG5cdFx0JycsIC8vIFs0N11cclxuXHRcdCcwJywgLy8gWzQ4XVxyXG5cdFx0JzEnLCAvLyBbNDldXHJcblx0XHQnMicsIC8vIFs1MF1cclxuXHRcdCczJywgLy8gWzUxXVxyXG5cdFx0JzQnLCAvLyBbNTJdXHJcblx0XHQnNScsIC8vIFs1M11cclxuXHRcdCc2JywgLy8gWzU0XVxyXG5cdFx0JzcnLCAvLyBbNTVdXHJcblx0XHQnOCcsIC8vIFs1Nl1cclxuXHRcdCc5JywgLy8gWzU3XVxyXG5cdFx0J0NPTE9OJywgLy8gWzU4XVxyXG5cdFx0J1NFTUlDT0xPTicsIC8vIFs1OV1cclxuXHRcdCdMRVNTIFRIQU4nLCAvLyBbNjBdXHJcblx0XHQnRVFVQUxTJywgLy8gWzYxXVxyXG5cdFx0J0dSRUFURVIgVEhBTicsIC8vIFs2Ml1cclxuXHRcdCdRVUVTVElPTiBNQVJLJywgLy8gWzYzXVxyXG5cdFx0J0FUJywgLy8gWzY0XVxyXG5cdFx0J0EnLCAvLyBbNjVdXHJcblx0XHQnQicsIC8vIFs2Nl1cclxuXHRcdCdDJywgLy8gWzY3XVxyXG5cdFx0J0QnLCAvLyBbNjhdXHJcblx0XHQnRScsIC8vIFs2OV1cclxuXHRcdCdGJywgLy8gWzcwXVxyXG5cdFx0J0cnLCAvLyBbNzFdXHJcblx0XHQnSCcsIC8vIFs3Ml1cclxuXHRcdCdJJywgLy8gWzczXVxyXG5cdFx0J0onLCAvLyBbNzRdXHJcblx0XHQnSycsIC8vIFs3NV1cclxuXHRcdCdMJywgLy8gWzc2XVxyXG5cdFx0J00nLCAvLyBbNzddXHJcblx0XHQnTicsIC8vIFs3OF1cclxuXHRcdCdPJywgLy8gWzc5XVxyXG5cdFx0J1AnLCAvLyBbODBdXHJcblx0XHQnUScsIC8vIFs4MV1cclxuXHRcdCdSJywgLy8gWzgyXVxyXG5cdFx0J1MnLCAvLyBbODNdXHJcblx0XHQnVCcsIC8vIFs4NF1cclxuXHRcdCdVJywgLy8gWzg1XVxyXG5cdFx0J1YnLCAvLyBbODZdXHJcblx0XHQnVycsIC8vIFs4N11cclxuXHRcdCdYJywgLy8gWzg4XVxyXG5cdFx0J1knLCAvLyBbODldXHJcblx0XHQnWicsIC8vIFs5MF1cclxuXHRcdCdPUyBLRVknLCAvLyBbOTFdIFdpbmRvd3MgS2V5IChXaW5kb3dzKSBvciBDb21tYW5kIEtleSAoTWFjKVxyXG5cdFx0JycsIC8vIFs5Ml1cclxuXHRcdCdDT05URVhUIE1FTlUnLCAvLyBbOTNdXHJcblx0XHQnJywgLy8gWzk0XVxyXG5cdFx0J1NMRUVQJywgLy8gWzk1XVxyXG5cdFx0J05VTVBBRDAnLCAvLyBbOTZdXHJcblx0XHQnTlVNUEFEMScsIC8vIFs5N11cclxuXHRcdCdOVU1QQUQyJywgLy8gWzk4XVxyXG5cdFx0J05VTVBBRDMnLCAvLyBbOTldXHJcblx0XHQnTlVNUEFENCcsIC8vIFsxMDBdXHJcblx0XHQnTlVNUEFENScsIC8vIFsxMDFdXHJcblx0XHQnTlVNUEFENicsIC8vIFsxMDJdXHJcblx0XHQnTlVNUEFENycsIC8vIFsxMDNdXHJcblx0XHQnTlVNUEFEOCcsIC8vIFsxMDRdXHJcblx0XHQnTlVNUEFEOScsIC8vIFsxMDVdXHJcblx0XHQnTVVMVElQTFknLCAvLyBbMTA2XVxyXG5cdFx0J0FERCcsIC8vIFsxMDddXHJcblx0XHQnU0VQQVJBVE9SJywgLy8gWzEwOF1cclxuXHRcdCdTVUJUUkFDVCcsIC8vIFsxMDldXHJcblx0XHQnREVDSU1BTCcsIC8vIFsxMTBdXHJcblx0XHQnRElWSURFJywgLy8gWzExMV1cclxuXHRcdCdGMScsIC8vIFsxMTJdXHJcblx0XHQnRjInLCAvLyBbMTEzXVxyXG5cdFx0J0YzJywgLy8gWzExNF1cclxuXHRcdCdGNCcsIC8vIFsxMTVdXHJcblx0XHQnRjUnLCAvLyBbMTE2XVxyXG5cdFx0J0Y2JywgLy8gWzExN11cclxuXHRcdCdGNycsIC8vIFsxMThdXHJcblx0XHQnRjgnLCAvLyBbMTE5XVxyXG5cdFx0J0Y5JywgLy8gWzEyMF1cclxuXHRcdCdGMTAnLCAvLyBbMTIxXVxyXG5cdFx0J0YxMScsIC8vIFsxMjJdXHJcblx0XHQnRjEyJywgLy8gWzEyM11cclxuXHRcdCdGMTMnLCAvLyBbMTI0XVxyXG5cdFx0J0YxNCcsIC8vIFsxMjVdXHJcblx0XHQnRjE1JywgLy8gWzEyNl1cclxuXHRcdCdGMTYnLCAvLyBbMTI3XVxyXG5cdFx0J0YxNycsIC8vIFsxMjhdXHJcblx0XHQnRjE4JywgLy8gWzEyOV1cclxuXHRcdCdGMTknLCAvLyBbMTMwXVxyXG5cdFx0J0YyMCcsIC8vIFsxMzFdXHJcblx0XHQnRjIxJywgLy8gWzEzMl1cclxuXHRcdCdGMjInLCAvLyBbMTMzXVxyXG5cdFx0J0YyMycsIC8vIFsxMzRdXHJcblx0XHQnRjI0JywgLy8gWzEzNV1cclxuXHRcdCcnLCAvLyBbMTM2XVxyXG5cdFx0JycsIC8vIFsxMzddXHJcblx0XHQnJywgLy8gWzEzOF1cclxuXHRcdCcnLCAvLyBbMTM5XVxyXG5cdFx0JycsIC8vIFsxNDBdXHJcblx0XHQnJywgLy8gWzE0MV1cclxuXHRcdCcnLCAvLyBbMTQyXVxyXG5cdFx0JycsIC8vIFsxNDNdXHJcblx0XHQnTlVNIExPQ0snLCAvLyBbMTQ0XVxyXG5cdFx0J1NDUk9MTCBMT0NLJywgLy8gWzE0NV1cclxuXHRcdCdXSU4gT0VNIEZKIEpJU0hPJywgLy8gWzE0Nl1cclxuXHRcdCdXSU4gT0VNIEZKIE1BU1NIT1UnLCAvLyBbMTQ3XVxyXG5cdFx0J1dJTiBPRU0gRkogVE9VUk9LVScsIC8vIFsxNDhdXHJcblx0XHQnV0lOIE9FTSBGSiBMT1lBJywgLy8gWzE0OV1cclxuXHRcdCdXSU4gT0VNIEZKIFJPWUEnLCAvLyBbMTUwXVxyXG5cdFx0JycsIC8vIFsxNTFdXHJcblx0XHQnJywgLy8gWzE1Ml1cclxuXHRcdCcnLCAvLyBbMTUzXVxyXG5cdFx0JycsIC8vIFsxNTRdXHJcblx0XHQnJywgLy8gWzE1NV1cclxuXHRcdCcnLCAvLyBbMTU2XVxyXG5cdFx0JycsIC8vIFsxNTddXHJcblx0XHQnJywgLy8gWzE1OF1cclxuXHRcdCcnLCAvLyBbMTU5XVxyXG5cdFx0J0NJUkNVTUZMRVgnLCAvLyBbMTYwXVxyXG5cdFx0J0VYQ0xBTUFUSU9OJywgLy8gWzE2MV1cclxuXHRcdCdET1VCTEVfUVVPVEUnLCAvLyBbMTYyXVxyXG5cdFx0J0hBU0gnLCAvLyBbMTYzXVxyXG5cdFx0J0RPTExBUicsIC8vIFsxNjRdXHJcblx0XHQnUEVSQ0VOVCcsIC8vIFsxNjVdXHJcblx0XHQnQU1QRVJTQU5EJywgLy8gWzE2Nl1cclxuXHRcdCdVTkRFUlNDT1JFJywgLy8gWzE2N11cclxuXHRcdCdPUEVOIFBBUkVOVEhFU0lTJywgLy8gWzE2OF1cclxuXHRcdCdDTE9TRSBQQVJFTlRIRVNJUycsIC8vIFsxNjldXHJcblx0XHQnQVNURVJJU0snLCAvLyBbMTcwXVxyXG5cdFx0J1BMVVMnLCAvLyBbMTcxXVxyXG5cdFx0J1BJUEUnLCAvLyBbMTcyXVxyXG5cdFx0J0hZUEhFTicsIC8vIFsxNzNdXHJcblx0XHQnT1BFTiBDVVJMWSBCUkFDS0VUJywgLy8gWzE3NF1cclxuXHRcdCdDTE9TRSBDVVJMWSBCUkFDS0VUJywgLy8gWzE3NV1cclxuXHRcdCdUSUxERScsIC8vIFsxNzZdXHJcblx0XHQnJywgLy8gWzE3N11cclxuXHRcdCcnLCAvLyBbMTc4XVxyXG5cdFx0JycsIC8vIFsxNzldXHJcblx0XHQnJywgLy8gWzE4MF1cclxuXHRcdCdWT0xVTUUgTVVURScsIC8vIFsxODFdXHJcblx0XHQnVk9MVU1FIERPV04nLCAvLyBbMTgyXVxyXG5cdFx0J1ZPTFVNRSBVUCcsIC8vIFsxODNdXHJcblx0XHQnJywgLy8gWzE4NF1cclxuXHRcdCcnLCAvLyBbMTg1XVxyXG5cdFx0J1NFTUlDT0xPTicsIC8vIFsxODZdXHJcblx0XHQnRVFVQUxTJywgLy8gWzE4N11cclxuXHRcdCdDT01NQScsIC8vIFsxODhdXHJcblx0XHQnTUlOVVMnLCAvLyBbMTg5XVxyXG5cdFx0J1BFUklPRCcsIC8vIFsxOTBdXHJcblx0XHQnU0xBU0gnLCAvLyBbMTkxXVxyXG5cdFx0J0JBQ0sgUVVPVEUnLCAvLyBbMTkyXVxyXG5cdFx0JycsIC8vIFsxOTNdXHJcblx0XHQnJywgLy8gWzE5NF1cclxuXHRcdCcnLCAvLyBbMTk1XVxyXG5cdFx0JycsIC8vIFsxOTZdXHJcblx0XHQnJywgLy8gWzE5N11cclxuXHRcdCcnLCAvLyBbMTk4XVxyXG5cdFx0JycsIC8vIFsxOTldXHJcblx0XHQnJywgLy8gWzIwMF1cclxuXHRcdCcnLCAvLyBbMjAxXVxyXG5cdFx0JycsIC8vIFsyMDJdXHJcblx0XHQnJywgLy8gWzIwM11cclxuXHRcdCcnLCAvLyBbMjA0XVxyXG5cdFx0JycsIC8vIFsyMDVdXHJcblx0XHQnJywgLy8gWzIwNl1cclxuXHRcdCcnLCAvLyBbMjA3XVxyXG5cdFx0JycsIC8vIFsyMDhdXHJcblx0XHQnJywgLy8gWzIwOV1cclxuXHRcdCcnLCAvLyBbMjEwXVxyXG5cdFx0JycsIC8vIFsyMTFdXHJcblx0XHQnJywgLy8gWzIxMl1cclxuXHRcdCcnLCAvLyBbMjEzXVxyXG5cdFx0JycsIC8vIFsyMTRdXHJcblx0XHQnJywgLy8gWzIxNV1cclxuXHRcdCcnLCAvLyBbMjE2XVxyXG5cdFx0JycsIC8vIFsyMTddXHJcblx0XHQnJywgLy8gWzIxOF1cclxuXHRcdCdPUEVOIEJSQUNLRVQnLCAvLyBbMjE5XVxyXG5cdFx0J0JBQ0sgU0xBU0gnLCAvLyBbMjIwXVxyXG5cdFx0J0NMT1NFIEJSQUNLRVQnLCAvLyBbMjIxXVxyXG5cdFx0J1FVT1RFJywgLy8gWzIyMl1cclxuXHRcdCcnLCAvLyBbMjIzXVxyXG5cdFx0J01FVEEnLCAvLyBbMjI0XVxyXG5cdFx0J0FMVCBHUkFQSCcsIC8vIFsyMjVdXHJcblx0XHQnJywgLy8gWzIyNl1cclxuXHRcdCdXSU4gSUNPIEhFTFAnLCAvLyBbMjI3XVxyXG5cdFx0J1dJTiBJQ08gMDAnLCAvLyBbMjI4XVxyXG5cdFx0JycsIC8vIFsyMjldXHJcblx0XHQnV0lOIElDTyBDTEVBUicsIC8vIFsyMzBdXHJcblx0XHQnJywgLy8gWzIzMV1cclxuXHRcdCcnLCAvLyBbMjMyXVxyXG5cdFx0J1dJTiBPRU0gUkVTRVQnLCAvLyBbMjMzXVxyXG5cdFx0J1dJTiBPRU0gSlVNUCcsIC8vIFsyMzRdXHJcblx0XHQnV0lOIE9FTSBQQTEnLCAvLyBbMjM1XVxyXG5cdFx0J1dJTiBPRU0gUEEyJywgLy8gWzIzNl1cclxuXHRcdCdXSU4gT0VNIFBBMycsIC8vIFsyMzddXHJcblx0XHQnV0lOIE9FTSBXU0NUUkwnLCAvLyBbMjM4XVxyXG5cdFx0J1dJTiBPRU0gQ1VTRUwnLCAvLyBbMjM5XVxyXG5cdFx0J1dJTiBPRU0gQVRUTicsIC8vIFsyNDBdXHJcblx0XHQnV0lOIE9FTSBGSU5JU0gnLCAvLyBbMjQxXVxyXG5cdFx0J1dJTiBPRU0gQ09QWScsIC8vIFsyNDJdXHJcblx0XHQnV0lOIE9FTSBBVVRPJywgLy8gWzI0M11cclxuXHRcdCdXSU4gT0VNIEVOTFcnLCAvLyBbMjQ0XVxyXG5cdFx0J1dJTiBPRU0gQkFDS1RBQicsIC8vIFsyNDVdXHJcblx0XHQnQVRUTicsIC8vIFsyNDZdXHJcblx0XHQnQ1JTRUwnLCAvLyBbMjQ3XVxyXG5cdFx0J0VYU0VMJywgLy8gWzI0OF1cclxuXHRcdCdFUkVPRicsIC8vIFsyNDldXHJcblx0XHQnUExBWScsIC8vIFsyNTBdXHJcblx0XHQnWk9PTScsIC8vIFsyNTFdXHJcblx0XHQnJywgLy8gWzI1Ml1cclxuXHRcdCdQQTEnLCAvLyBbMjUzXVxyXG5cdFx0J1dJTiBPRU0gQ0xFQVInLCAvLyBbMjU0XVxyXG5cdFx0J1RPR0dMRSBUT1VDSFBBRCcsIC8vIFsyNTVdXHJcblx0XSwgLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTc3MjE3OS9nZXQtY2hhcmFjdGVyLXZhbHVlLWZyb20ta2V5Y29kZS1pbi1qYXZhc2NyaXB0LXRoZW4tdHJpbVxyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IEF1ZGlvQXNzZXRzID0ge1xyXG5cdHVpOiB7XHJcblx0XHRpbnZlbnRvcnlDbGFjazogbmV3IEF1ZGlvUmVzb3VyY2VHcm91cChbXHJcblx0XHRcdG5ldyBBdWRpb1Jlc291cmNlKCdhc3NldHMvc291bmRzL3NmeC91aS9jbGFjazEubXAzJyksXHJcblx0XHRcdG5ldyBBdWRpb1Jlc291cmNlKCdhc3NldHMvc291bmRzL3NmeC91aS9jbGFjazIubXAzJyksXHJcblx0XHRcdG5ldyBBdWRpb1Jlc291cmNlKCdhc3NldHMvc291bmRzL3NmeC91aS9jbGFjazMubXAzJyksXHJcblx0XHRdKSxcclxuXHR9LFxyXG5cdG11c2ljOiB7XHJcblx0XHR0aXRsZVNjcmVlbjogbmV3IEF1ZGlvUmVzb3VyY2UoJ2Fzc2V0cy9zb3VuZHMvbXVzaWMvVGl0bGVTY3JlZW4ubXAzJyksXHJcblx0fSxcclxuXHRhbWJpZW50OiB7XHJcblx0XHR3aW50ZXIxOiBuZXcgQXVkaW9SZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy9zb3VuZHMvc2Z4L2FtYmllbnQvNjU4MTNfX3BjYWVsZHJpZXNfX2NvdW50cnlzaWRld2ludGVyZXZlbmluZzAyLndhdicsXHJcblx0XHQpLFxyXG5cdH0sXHJcbn07XHJcblxyXG5leHBvcnQgdHlwZSBBbmltYXRpb25GcmFtZTxUIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgSW1hZ2VSZXNvdXJjZVtdPj4gPSBrZXlvZiBUO1xyXG5cclxuLy8gY29uc3QgYW5pbWF0aW9ucyA9IDxUIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgSW1hZ2VSZXNvdXJjZVtdPj4oZGF0YTogVCk6IFQgPT4gZGF0YVxyXG5cclxuZXhwb3J0IGNvbnN0IGxvYWRBc3NldHMgPSAoc2tldGNoOiBQNSwgLi4uYXNzZXRzOiBBc3NldEdyb3VwW10pID0+IHtcclxuXHRhc3NldHMuZm9yRWFjaChhc3NldEdyb3VwID0+IHtcclxuXHRcdHNlYXJjaEdyb3VwKGFzc2V0R3JvdXAsIHNrZXRjaCk7XHJcblx0fSk7XHJcbn07XHJcblxyXG5mdW5jdGlvbiBzZWFyY2hHcm91cChcclxuXHRhc3NldEdyb3VwOlxyXG5cdFx0fCBBc3NldEdyb3VwXHJcblx0XHR8IFJlc291cmNlXHJcblx0XHR8IEF1ZGlvUmVzb3VyY2VcclxuXHRcdHwgQXVkaW9SZXNvdXJjZUdyb3VwLFxyXG5cdHNrZXRjaDogUDUsXHJcbikge1xyXG5cdGlmIChhc3NldEdyb3VwIGluc3RhbmNlb2YgUmVzb3VyY2UpIHtcclxuXHRcdGNvbnNvbGUubG9nKGBMb2FkaW5nIGFzc2V0ICR7YXNzZXRHcm91cC5wYXRofWApO1xyXG5cdFx0YXNzZXRHcm91cC5sb2FkUmVzb3VyY2Uoc2tldGNoKTtcclxuXHRcdHJldHVybjtcclxuXHR9XHJcblx0T2JqZWN0LmVudHJpZXMoYXNzZXRHcm91cCkuZm9yRWFjaChhc3NldCA9PiB7XHJcblx0XHRzZWFyY2hHcm91cChhc3NldFsxXSwgc2tldGNoKTtcclxuXHR9KTtcclxufVxyXG4iLCJpbXBvcnQgUDUgZnJvbSAncDUnO1xyXG5pbXBvcnQgeyBSZXNvdXJjZSB9IGZyb20gJy4vUmVzb3VyY2UnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEF1ZGlvUmVzb3VyY2UgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgICAvLyBzb3VuZDogQXVkaW9UeXBlXHJcblxyXG4gICAgY29uc3RydWN0b3IocGF0aDogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIocGF0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZFJlc291cmNlKGdhbWU6IFA1KSB7XHJcbiAgICAgICAgLy8gdGhpcy5zb3VuZCA9IEF1ZGlvKHtcclxuICAgICAgICAvLyAgICAgZmlsZTogdGhpcy5wYXRoLFxyXG4gICAgICAgIC8vICAgICBsb29wOiBmYWxzZSxcclxuICAgICAgICAvLyAgICAgdm9sdW1lOiAxLjAsXHJcbiAgICAgICAgLy8gfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcGxheVJhbmRvbSgpIHtcclxuICAgIC8vICAgICAvLyBWZXJpZnkgdGhhdCB0aGUgc291bmQgaGFzIGJlZW4gbG9hZGVkXHJcbiAgICAvLyAgICAgaWYgKHRoaXMuc291bmQgPT09IHVuZGVmaW5lZClcclxuICAgIC8vICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxyXG4gICAgLy8gICAgICAgICAgICAgYFRyaWVkIHRvIHBsYXkgc291bmQgYmVmb3JlIGxvYWRpbmcgaXQ6ICR7dGhpcy5wYXRofWBcclxuICAgIC8vICAgICAgICAgKTtcclxuXHJcbiAgICAvLyAgICAgdGhpcy5zb3VuZC5wbGF5KCk7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgcGxheVNvdW5kKCkgey8vIHBsYXkgdGhlIHNvdW5kXHJcbiAgICAgICAgLy9WZXJpZnkgdGhhdCB0aGUgc291bmQgaGFzIGJlZW4gbG9hZGVkXHJcbiAgICAgICAgLy8gaWYgKHRoaXMuc291bmQgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAvLyAgICAgdGhyb3cgbmV3IEVycm9yKFxyXG4gICAgICAgIC8vICAgICAgICAgYFRyaWVkIHRvIHBsYXkgc291bmQgYmVmb3JlIGxvYWRpbmcgaXQ6ICR7dGhpcy5wYXRofWBcclxuICAgICAgICAvLyAgICAgKTtcclxuICAgICAgICAvLyB0aGlzLnNvdW5kLnBhdXNlKCk7XHJcbiAgICAgICAgLy8gdGhpcy5zb3VuZC5wbGF5KCk7XHJcbiAgICB9XHJcblxyXG59XHJcbiIsImltcG9ydCB7IEF1ZGlvUmVzb3VyY2UgfSBmcm9tICcuL0F1ZGlvUmVzb3VyY2UnO1xyXG5pbXBvcnQgUDUgZnJvbSBcInA1XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQXVkaW9SZXNvdXJjZUdyb3VwIHtcclxuXHJcbiAgICBzb3VuZHM6IEF1ZGlvUmVzb3VyY2VbXVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHNvdW5kczogQXVkaW9SZXNvdXJjZVtdKSB7Ly8gcGFzcyBpbiBhbiBhcnJheSBvZiBBdWRpb1Jlc291cmNlcyB0aGF0IGFyZSBhbGwgc2ltaWxhclxyXG4gICAgICAgIHRoaXMuc291bmRzID0gc291bmRzO1xyXG4gICAgfVxyXG5cclxuICAgIHBsYXlSYW5kb20oKSB7Ly8gcGxheSBhIHJhbmRvbSBzb3VuZFxyXG4gICAgICAgIGlmKHRoaXMuc291bmRzID09PSB1bmRlZmluZWQgfHwgdGhpcy5zb3VuZHMubGVuZ3RoID09PSAwKVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAgICAgICAgICAgICBgVGhlcmUgYXJlIG5vIHNvdW5kczogJHt0aGlzLnNvdW5kc31gXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgY29uc3QgciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHRoaXMuc291bmRzLmxlbmd0aCk7XHJcbiAgICAgICAgdGhpcy5zb3VuZHNbcl0ucGxheVNvdW5kKCk7Ly8gcGxheSBhIHJhbmRvbSBzb3VuZCBmcm9tIHRoZSBhcnJheSBhdCBhIHNsaWdodGx5IHJhbmRvbWl6ZWQgcGl0Y2gsIGxlYWRpbmcgdG8gdGhlIGVmZmVjdCBvZiBpdCBtYWtpbmcgYSBuZXcgc291bmQgZWFjaCB0aW1lLCByZW1vdmluZyByZXBldGl0aXZlbmVzc1xyXG5cclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgeyBJbWFnZVJlc291cmNlIH0gZnJvbSAnLi9JbWFnZVJlc291cmNlJztcclxuaW1wb3J0IHA1IGZyb20gJ3A1JztcclxuaW1wb3J0IHsgZ2FtZSB9IGZyb20gJy4uLy4uL0dhbWUnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEZvbnRSZXNvdXJjZSBleHRlbmRzIEltYWdlUmVzb3VyY2Uge1xyXG5cclxuICAgIGFscGhhYmV0X3NvdXA6IHtbbGV0dGVyOiBzdHJpbmddOiB7eDogbnVtYmVyLCB5OiBudW1iZXIsIHc6IG51bWJlciwgaDogbnVtYmVyfX0gPSB7fVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBhdGg6IHN0cmluZywgY2hhcmFjdGVyRGF0YToge1tsZXR0ZXI6IHN0cmluZ106IG51bWJlcn0sIGNoYXJhY3Rlck9yZGVyOiBzdHJpbmcsIGZvbnRIZWlnaHQ6IG51bWJlcikge1xyXG4gICAgICAgIHN1cGVyKHBhdGgpO1xyXG4gICAgICAgIGxldCBydW5uaW5nVG90YWwgPSAwXHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaTxjaGFyYWN0ZXJPcmRlci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmFscGhhYmV0X3NvdXBbY2hhcmFjdGVyT3JkZXJbaV1dID0ge3g6IHJ1bm5pbmdUb3RhbCwgeTogMCwgdzogY2hhcmFjdGVyRGF0YVtjaGFyYWN0ZXJPcmRlcltpXV0sIGg6IGZvbnRIZWlnaHR9XHJcbiAgICAgICAgICAgIHJ1bm5pbmdUb3RhbCArPSBjaGFyYWN0ZXJEYXRhW2NoYXJhY3Rlck9yZGVyW2ldXSArIDFcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coY2hhcmFjdGVyT3JkZXJbaV0rXCI6IFwiK2NoYXJhY3RlckRhdGFbY2hhcmFjdGVyT3JkZXJbaV1dKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZHJhd1RleHQodGFyZ2V0OiBwNSwgc3RyOiBzdHJpbmcsIHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcbiAgICAgICAgbGV0IHhPZmZzZXQ6IG51bWJlciA9IDA7XHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaTxzdHIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCt4T2Zmc2V0KmdhbWUudXBzY2FsZVNpemUsIHksIHRoaXMuYWxwaGFiZXRfc291cFtzdHJbaV1dLncqZ2FtZS51cHNjYWxlU2l6ZSwgdGhpcy5hbHBoYWJldF9zb3VwW3N0cltpXV0uaCpnYW1lLnVwc2NhbGVTaXplLCB0aGlzLmFscGhhYmV0X3NvdXBbc3RyW2ldXS54LCB0aGlzLmFscGhhYmV0X3NvdXBbc3RyW2ldXS55LCB0aGlzLmFscGhhYmV0X3NvdXBbc3RyW2ldXS53LCB0aGlzLmFscGhhYmV0X3NvdXBbc3RyW2ldXS5oKTtcclxuICAgICAgICAgICAgeE9mZnNldCArPSB0aGlzLmFscGhhYmV0X3NvdXBbc3RyW2ldXS53KzE7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IFA1IGZyb20gJ3A1JztcclxuaW1wb3J0IHsgUmVzb3VyY2UgfSBmcm9tICcuL1Jlc291cmNlJztcclxuXHJcbmV4cG9ydCBjbGFzcyBJbWFnZVJlc291cmNlIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gICAgaW1hZ2U6IFA1LkltYWdlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBhdGg6IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKHBhdGgpO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWRSZXNvdXJjZShnYW1lOiBQNSkge1xyXG4gICAgICAgIHRoaXMuaW1hZ2UgPSBnYW1lLmxvYWRJbWFnZSh0aGlzLnBhdGgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcih0YXJnZXQ6IGFueSwgeDogbnVtYmVyLCB5OiBudW1iZXIsIHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyKSB7XHJcbiAgICAgICAgLy8gVmVyaWZ5IHRoYXQgdGhlIHRpbGVzIGhhcyBiZWVuIGxvYWRlZFxyXG4gICAgICAgIGlmICh0aGlzLmltYWdlID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcclxuICAgICAgICAgICAgICAgIGBUcmllZCB0byByZW5kZXIgaW1hZ2UgYmVmb3JlIGxvYWRpbmcgaXQ6ICR7dGhpcy5wYXRofWBcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgLy8gRHJhdyBub24gdGlsZXMgaW1hZ2VcclxuICAgICAgICB0YXJnZXQuaW1hZ2UodGhpcy5pbWFnZSwgeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHJlbmRlclBhcnRpYWwoXHJcbiAgICAgICAgdGFyZ2V0OiBhbnksXHJcbiAgICAgICAgeDogbnVtYmVyLFxyXG4gICAgICAgIHk6IG51bWJlcixcclxuICAgICAgICB3aWR0aDogbnVtYmVyLFxyXG4gICAgICAgIGhlaWdodDogbnVtYmVyLFxyXG4gICAgICAgIHNvdXJjZVg/OiBudW1iZXIsXHJcbiAgICAgICAgc291cmNlWT86IG51bWJlcixcclxuICAgICAgICBzb3VyY2VXaWR0aD86IG51bWJlcixcclxuICAgICAgICBzb3VyY2VIZWlnaHQ/OiBudW1iZXJcclxuICAgICkge1xyXG4gICAgICAgIC8vIFZlcmlmeSB0aGF0IHRoZSB0aWxlcyBoYXMgYmVlbiBsb2FkZWRcclxuICAgICAgICBpZiAodGhpcy5pbWFnZSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAgICAgICAgICAgICBgVHJpZWQgdG8gcmVuZGVyIGltYWdlIGJlZm9yZSBsb2FkaW5nIGl0OiAke3RoaXMucGF0aH1gXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIC8vIERyYXcgYSBwYXJ0aWFsIHBhcnQgb2YgdGhlIGltYWdlXHJcbiAgICAgICAgdGFyZ2V0LmltYWdlKFxyXG4gICAgICAgICAgICB0aGlzLmltYWdlLFxyXG4gICAgICAgICAgICB4LFxyXG4gICAgICAgICAgICB5LFxyXG4gICAgICAgICAgICB3aWR0aCxcclxuICAgICAgICAgICAgaGVpZ2h0LFxyXG4gICAgICAgICAgICBzb3VyY2VYLFxyXG4gICAgICAgICAgICBzb3VyY2VZLFxyXG4gICAgICAgICAgICBzb3VyY2VXaWR0aCxcclxuICAgICAgICAgICAgc291cmNlSGVpZ2h0XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBSZXNvdXJjZSB9IGZyb20gXCIuL1Jlc291cmNlXCI7XHJcbmltcG9ydCBQNSBmcm9tICdwNSc7XHJcbmltcG9ydCB7IGdhbWUsIEdhbWUgfSBmcm9tICcuLi8uLi9HYW1lJztcclxuaW1wb3J0IHsgVGlsZVR5cGUgfSBmcm9tIFwiLi4vLi4vLi4vZ2xvYmFsL1RpbGVcIlxyXG5cclxuZXhwb3J0IGNsYXNzIFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZSBleHRlbmRzIFJlc291cmNlIHtcclxuXHJcbiAgICBpbWFnZTogUDUuSW1hZ2U7XHJcbiAgICBoYXNSZWZsZWN0aW9uOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICByZWZsZWN0aW9uOiBQNS5JbWFnZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwYXRoOiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcihwYXRoKTtcclxuICAgIH1cclxuXHJcbiAgICBsb2FkUmVzb3VyY2UoZ2FtZTogUDUpIHtcclxuICAgICAgICB0aGlzLmltYWdlID0gZ2FtZS5sb2FkSW1hZ2UodGhpcy5wYXRoKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIodGFyZ2V0OiBhbnksIHg6IG51bWJlciwgeTogbnVtYmVyLCB3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcikge1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coV29ybGRUaWxlcyk7XHJcbiAgICAgICAgLy8gVmVyaWZ5IHRoYXQgdGhlIGltYWdlIGhhcyBiZWVuIGxvYWRlZFxyXG4gICAgICAgIGlmICh0aGlzLmltYWdlID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcclxuICAgICAgICAgICAgICAgIGBUcmllZCB0byByZW5kZXIgaW1hZ2UgYmVmb3JlIGxvYWRpbmcgaXQ6ICR7dGhpcy5wYXRofWBcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgLy8gRHJhdyBub24gdGlsZXMgaW1hZ2VcclxuICAgICAgICB0YXJnZXQuaW1hZ2UodGhpcy5pbWFnZSwgeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHJlbmRlcldvcmxkc3BhY2VSZWZsZWN0aW9uKHg6IG51bWJlciwgeTogbnVtYmVyLCB3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcikgey8vdGhpcyBpcyBicm9rZW5cclxuICAgICAgICByZXR1cm47XHJcbiAgICAgICAgaWYgKHRoaXMuaW1hZ2UgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxyXG4gICAgICAgICAgICAgICAgYFRyaWVkIHRvIHJlbmRlciByZWZsZWN0aW9uIG9mIGltYWdlIGJlZm9yZSBsb2FkaW5nIGl0OiAke3RoaXMucGF0aH1gXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgaWYoIXRoaXMuaGFzUmVmbGVjdGlvbikgey8vdGhpcyBpcyBzbyBpdCBkb2Vzbid0IGxvYWQgdGhlbSBhbGwgYXQgb25jZSBhbmQgaW5zdGVhZCBtYWtlcyB0aGUgcmVmbGVjdGlvbnMgd2hlbiB0aGV5IGFyZSBuZWVkZWRcclxuICAgICAgICAgICAgdGhpcy5oYXNSZWZsZWN0aW9uID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5yZWZsZWN0aW9uID0gZ2FtZS5jcmVhdGVJbWFnZSh0aGlzLmltYWdlLndpZHRoLCB0aGlzLmltYWdlLmhlaWdodCk7XHJcbiAgICAgICAgICAgIHRoaXMucmVmbGVjdGlvbi5sb2FkUGl4ZWxzKCk7XHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2UubG9hZFBpeGVscygpO1xyXG4gICAgICAgICAgICBmb3IobGV0IGkgPSAwOyBpPHRoaXMucmVmbGVjdGlvbi53aWR0aDsgaSsrKSB7Ly9nZW5lcmF0ZSBhIHJlZmxlY3Rpb24gaW1hZ2UgdGhhdCBpcyBkaXNwbGF5ZWQgYXMgYSByZWZsZWN0aW9uXHJcbiAgICAgICAgICAgICAgICBmb3IobGV0IGogPSAwOyBqPHRoaXMucmVmbGVjdGlvbi5oZWlnaHQ7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvcihsZXQgayA9IDA7IGs8MzsgaysrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVmbGVjdGlvbi5waXhlbHNbNCooaip0aGlzLnJlZmxlY3Rpb24ud2lkdGgraSkra10gPSB0aGlzLmltYWdlLnBpeGVsc1s0KigodGhpcy5pbWFnZS5oZWlnaHQtai0xKSp0aGlzLmltYWdlLndpZHRoK2kpK2tdO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlZmxlY3Rpb24ucGl4ZWxzWzQqKGoqdGhpcy5yZWZsZWN0aW9uLndpZHRoK2kpKzNdID0gXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbWFnZS5waXhlbHNbNCooKHRoaXMuaW1hZ2UuaGVpZ2h0LWotMSkqdGhpcy5pbWFnZS53aWR0aCtpKSszXSAqIFxyXG4gICAgICAgICAgICAgICAgICAgICgodGhpcy5yZWZsZWN0aW9uLmhlaWdodC1qKS90aGlzLnJlZmxlY3Rpb24uaGVpZ2h0KSAqIFxyXG4gICAgICAgICAgICAgICAgICAgICh0aGlzLnJlZmxlY3Rpb24ud2lkdGgvMiswLjUtTWF0aC5hYnMoaS10aGlzLnJlZmxlY3Rpb24ud2lkdGgvMiswLjUpKS8odGhpcy5yZWZsZWN0aW9uLndpZHRoLzIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMucmVmbGVjdGlvbi51cGRhdGVQaXhlbHMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZ2FtZS5maWxsKDI1NSwgMCwgMCk7XHJcbiAgICAgICAgZ2FtZS5zdHJva2UoMTUwLCAwLCAwKTtcclxuXHJcbiAgICAgICAgLy9sb29wIHRocm91Z2ggZXZlcnkgdGlsZSBpdCBwYXNzZXMgdGhyb3VnaFxyXG4gICAgICAgIGZvcihsZXQgaSA9IE1hdGguZmxvb3IoeCk7IGk8eCt3aWR0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaiA9IE1hdGguZmxvb3IoeSk7IGo8eStoZWlnaHQ7IGorKykge1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2codGFyZ2V0LndvcmxkLndvcmxkVGlsZXMpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGN1cnJlbnRCbG9jazogVGlsZVR5cGUgfCBzdHJpbmcgPSBnYW1lLndvcmxkLndvcmxkVGlsZXNbaiAqIGdhbWUud29ybGRXaWR0aCArIGldO1xyXG4gICAgICAgICAgICAgICAgaWYoY3VycmVudEJsb2NrID09PSB1bmRlZmluZWQgfHwgdHlwZW9mIGN1cnJlbnRCbG9jayA9PT0gXCJzdHJpbmdcIiB8fCBjdXJyZW50QmxvY2sgPT0gVGlsZVR5cGUuQWlyKSB7Ly90aGUgcmVmZXJlbmNlIHRvIFRpbGVFbnRpdHkgY2FuIGJlIHJlbW92ZWQgYXMgc29vbiBhcyB0aGUgYmV0dGVyIHN5c3RlbSBpcyBpbiBwbGFjZVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZ2FtZS50aW50KDI1NSwgMTUwKTsvL1RPRE8gbWFrZSBpdCBzb21ld2hhdCB0cmFuc2x1Y2VudCBiYXNlZCBvbiB0aGUgcmVmbGVjdGl2aXR5IG9mIHRoZSB0aWxlXHJcbiAgICAgICAgICAgICAgICBnYW1lLmltYWdlKFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVmbGVjdGlvbixcclxuICAgICAgICAgICAgICAgICAgICAoaSAqIGdhbWUuVElMRV9XSURUSCAtXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdhbWUuaW50ZXJwb2xhdGVkQ2FtWCAqIGdhbWUuVElMRV9XSURUSCkgKlxyXG4gICAgICAgICAgICAgICAgICAgIGdhbWUudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIChqICogZ2FtZS5USUxFX0hFSUdIVCAtXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnYW1lLmludGVycG9sYXRlZENhbVkgKiBnYW1lLlRJTEVfSEVJR0hUKSAqXHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICBnYW1lLlRJTEVfV0lEVEgqZ2FtZS51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICBnYW1lLlRJTEVfSEVJR0hUKmdhbWUudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgICAgICAgICAgKGkteCkqZ2FtZS5USUxFX1dJRFRILFxyXG4gICAgICAgICAgICAgICAgICAgIChqLXkpKmdhbWUuVElMRV9IRUlHSFQsXHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS5USUxFX1dJRFRILFxyXG4gICAgICAgICAgICAgICAgICAgIGdhbWUuVElMRV9IRUlHSFRcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICBnYW1lLm5vVGludCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlclBhcnRpYWwoXHJcbiAgICAgICAgdGFyZ2V0OiBhbnksXHJcbiAgICAgICAgeDogbnVtYmVyLFxyXG4gICAgICAgIHk6IG51bWJlcixcclxuICAgICAgICB3aWR0aDogbnVtYmVyLFxyXG4gICAgICAgIGhlaWdodDogbnVtYmVyLFxyXG4gICAgICAgIHNvdXJjZVg/OiBudW1iZXIsXHJcbiAgICAgICAgc291cmNlWT86IG51bWJlcixcclxuICAgICAgICBzb3VyY2VXaWR0aD86IG51bWJlcixcclxuICAgICAgICBzb3VyY2VIZWlnaHQ/OiBudW1iZXJcclxuICAgICkge1xyXG4gICAgICAgIC8vIFZlcmlmeSB0aGF0IHRoZSB0aWxlcyBoYXMgYmVlbiBsb2FkZWRcclxuICAgICAgICBpZiAodGhpcy5pbWFnZSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAgICAgICAgICAgICBgVHJpZWQgdG8gcmVuZGVyIGltYWdlIGJlZm9yZSBsb2FkaW5nIGl0OiAke3RoaXMucGF0aH1gXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIC8vIERyYXcgYSBwYXJ0aWFsIHBhcnQgb2YgdGhlIGltYWdlXHJcbiAgICAgICAgdGFyZ2V0LmltYWdlKFxyXG4gICAgICAgICAgICB0aGlzLmltYWdlLFxyXG4gICAgICAgICAgICB4LFxyXG4gICAgICAgICAgICB5LFxyXG4gICAgICAgICAgICB3aWR0aCxcclxuICAgICAgICAgICAgaGVpZ2h0LFxyXG4gICAgICAgICAgICBzb3VyY2VYLFxyXG4gICAgICAgICAgICBzb3VyY2VZLFxyXG4gICAgICAgICAgICBzb3VyY2VXaWR0aCxcclxuICAgICAgICAgICAgc291cmNlSGVpZ2h0XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufSIsImltcG9ydCBQNSBmcm9tICdwNSc7XHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUmVzb3VyY2Uge1xyXG4gICAgcGF0aDogc3RyaW5nO1xyXG5cclxuICAgIHByb3RlY3RlZCBjb25zdHJ1Y3RvcihwYXRoOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLnBhdGggPSBwYXRoO1xyXG4gICAgfVxyXG5cclxuICAgIGFic3RyYWN0IGxvYWRSZXNvdXJjZShza2V0Y2g6IFA1KTogdm9pZDtcclxufVxyXG4iLCJpbXBvcnQgeyBJbWFnZVJlc291cmNlIH0gZnJvbSAnLi9JbWFnZVJlc291cmNlJztcclxuXHJcbmV4cG9ydCBjbGFzcyBUaWxlUmVzb3VyY2UgZXh0ZW5kcyBJbWFnZVJlc291cmNlIHtcclxuICAgIC8vIFRoZSB3aWR0aCBhbmQgaGVpZ2h0IG9mIHRoZSB0aWxlcyBzZXRcclxuICAgIHdpZHRoOiBudW1iZXI7XHJcbiAgICBoZWlnaHQ6IG51bWJlcjtcclxuXHJcbiAgICAvLyBUaGUgd2lkdGggYW5kIGhlaWdodCBvZiBlYWNoIHRpbGVzIGluIHBpeGVsc1xyXG4gICAgdGlsZVdpZHRoOiBudW1iZXI7XHJcbiAgICB0aWxlSGVpZ2h0OiBudW1iZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcGF0aDogc3RyaW5nLFxyXG4gICAgICAgIHdpZHRoOiBudW1iZXIsXHJcbiAgICAgICAgaGVpZ2h0OiBudW1iZXIsXHJcbiAgICAgICAgdGlsZVdpZHRoOiBudW1iZXIsXHJcbiAgICAgICAgdGlsZUhlaWdodDogbnVtYmVyXHJcbiAgICApIHtcclxuICAgICAgICBzdXBlcihwYXRoKTtcclxuICAgICAgICB0aGlzLndpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICAgICAgdGhpcy50aWxlV2lkdGggPSB0aWxlV2lkdGg7XHJcbiAgICAgICAgdGhpcy50aWxlSGVpZ2h0ID0gdGlsZUhlaWdodDtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXJUaWxlKFxyXG4gICAgICAgIGk6IG51bWJlcixcclxuICAgICAgICB0YXJnZXQ6IGFueSxcclxuICAgICAgICB4OiBudW1iZXIsXHJcbiAgICAgICAgeTogbnVtYmVyLFxyXG4gICAgICAgIHdpZHRoOiBudW1iZXIsXHJcbiAgICAgICAgaGVpZ2h0OiBudW1iZXJcclxuICAgICkge1xyXG4gICAgICAgIGNvbnN0IHRpbGVTZXRYID0gaSAlIHRoaXMud2lkdGg7XHJcbiAgICAgICAgY29uc3QgdGlsZVNldFkgPSBNYXRoLmZsb29yKGkgLyB0aGlzLndpZHRoKTtcclxuXHJcbiAgICAgICAgLy8gTWFrZSBzdXJlIHRoZSB0aWxlcyBpc24ndCBvdXQgb2YgYm91bmRzXHJcbiAgICAgICAgaWYgKHRpbGVTZXRZID4gdGhpcy5oZWlnaHQpXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcclxuICAgICAgICAgICAgICAgIGBPdXQgb2YgYm91bmRzIHRpbGUuIFRyaWVkIHRvIHJlbmRlciB0aWxlIGluZGV4ICR7aX0gd2l0aCBhIG1heGltdW0gb2YgJHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLndpZHRoICogdGhpcy5oZWlnaHRcclxuICAgICAgICAgICAgICAgIH0gdGlsZXNgXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIHN1cGVyLnJlbmRlclBhcnRpYWwoXHJcbiAgICAgICAgICAgIHRhcmdldCxcclxuICAgICAgICAgICAgeCxcclxuICAgICAgICAgICAgeSxcclxuICAgICAgICAgICAgd2lkdGgsXHJcbiAgICAgICAgICAgIGhlaWdodCxcclxuICAgICAgICAgICAgdGlsZVNldFggKiB0aGlzLnRpbGVXaWR0aCxcclxuICAgICAgICAgICAgdGlsZVNldFkgKiB0aGlzLnRpbGVIZWlnaHQsXHJcbiAgICAgICAgICAgIHRoaXMudGlsZVdpZHRoLFxyXG4gICAgICAgICAgICB0aGlzLnRpbGVIZWlnaHRcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFRpbGVBdENvb3JkaW5hdGUoXHJcbiAgICAgICAgeDogbnVtYmVyLFxyXG4gICAgICAgIHk6IG51bWJlcixcclxuICAgICAgICB0YXJnZXQ6IGFueSxcclxuICAgICAgICB4UG9zOiBudW1iZXIsXHJcbiAgICAgICAgeVBvczogbnVtYmVyLFxyXG4gICAgICAgIHdpZHRoOiBudW1iZXIsXHJcbiAgICAgICAgaGVpZ2h0OiBudW1iZXJcclxuICAgICkge1xyXG4gICAgICAgIGlmICh4ID4gdGhpcy53aWR0aCB8fCB5ID4gdGhpcy5oZWlnaHQgfHwgeCA8IDAgfHwgeSA8IDApXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcclxuICAgICAgICAgICAgICAgIGBPdXQgb2YgYm91bmRzIHRpbGUuIFRyaWVkIHRvIGxvYWQgdGlsZSBhdCAke3h9LCAke3l9IG9uIGEgJHt0aGlzLndpZHRofSwgJHt0aGlzLmhlaWdodH0gZ3JpZGBcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgc3VwZXIucmVuZGVyUGFydGlhbChcclxuICAgICAgICAgICAgdGFyZ2V0LFxyXG4gICAgICAgICAgICB4UG9zLFxyXG4gICAgICAgICAgICB5UG9zLFxyXG4gICAgICAgICAgICB3aWR0aCxcclxuICAgICAgICAgICAgaGVpZ2h0LFxyXG4gICAgICAgICAgICB4ICogdGhpcy50aWxlV2lkdGgsXHJcbiAgICAgICAgICAgIHkgKiB0aGlzLnRpbGVIZWlnaHQsXHJcbiAgICAgICAgICAgIHRoaXMudGlsZVdpZHRoLFxyXG4gICAgICAgICAgICB0aGlzLnRpbGVIZWlnaHRcclxuICAgICAgICApO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGNsYXNzIENvbnRyb2wge1xyXG4gICAga2V5Ym9hcmQ6IGJvb2xlYW5cclxuICAgIGtleUNvZGU6IG51bWJlclxyXG4gICAgZGVzY3JpcHRpb246IHN0cmluZ1xyXG4gICAgb25QcmVzc2VkOiAoKSA9PiB2b2lkXHJcbiAgICBvblJlbGVhc2VkOiAoKSA9PiB2b2lkXHJcblxyXG4gICAgY29uc3RydWN0b3IoZGVzY3JpcHRpb246IHN0cmluZywga2V5Ym9hcmQ6IGJvb2xlYW4sIGtleUNvZGU6IG51bWJlciwgb25QcmVzc2VkOiAoKSA9PiB2b2lkLCBvblJlbGVhc2VkPzogKCkgPT4gdm9pZCkge1xyXG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvblxyXG4gICAgICAgIHRoaXMua2V5Ym9hcmQgPSBrZXlib2FyZDtcclxuICAgICAgICB0aGlzLmtleUNvZGUgPSBrZXlDb2RlO1xyXG4gICAgICAgIHRoaXMub25QcmVzc2VkID0gb25QcmVzc2VkO1xyXG4gICAgICAgIHRoaXMub25SZWxlYXNlZCA9IG9uUmVsZWFzZWQgfHwgZnVuY3Rpb24oKXt9Oy8vZm9yIHNvbWUgcmVhc29uIGFycm93IGZ1bmN0aW9uIGRvZXNuJ3QgbGlrZSB0byBleGlzdCBoZXJlIGJ1dCBpJ20gbm90IGdvbm5hIHdvcnJ5IHRvbyBtdWNoXHJcbiAgICAgICAgLy9pZiBpdCdzIHRvbyB1Z2x5LCB5b3UgY2FuIHRyeSB0byBmaXggaXRcclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgeyBJbnZlbnRvcnlQYXlsb2FkLCBJdGVtQ2F0ZWdvcmllcywgSXRlbXMsIEl0ZW1TdGFjayB9IGZyb20gJy4uLy4uL2dsb2JhbC9JbnZlbnRvcnknO1xyXG5pbXBvcnQgeyBUaWxlVHlwZSB9IGZyb20gJy4uLy4uL2dsb2JhbC9UaWxlJztcclxuaW1wb3J0IHsgZ2FtZSB9IGZyb20gJy4uL0dhbWUnO1xyXG5pbXBvcnQgeyBDb2xvclBhcnRpY2xlIH0gZnJvbSAnLi4vd29ybGQvcGFydGljbGVzL0NvbG9yUGFydGljbGUnO1xyXG5pbXBvcnQgeyBXb3JsZFRpbGVzIH0gZnJvbSAnLi4vd29ybGQvV29ybGRUaWxlcyc7XHJcblxyXG5leHBvcnQgY2xhc3MgSW52ZW50b3J5IHtcclxuXHJcblx0aXRlbXM6IChJdGVtU3RhY2sgfCB1bmRlZmluZWQgfCBudWxsKVtdO1xyXG5cclxuXHR3aWR0aDogbnVtYmVyO1xyXG5cdGhlaWdodDogbnVtYmVyO1xyXG5cclxuXHRzZWxlY3RlZFNsb3Q6IG51bWJlciA9IDBcclxuXHRwaWNrZWRVcFNsb3Q6IG51bWJlciB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZFxyXG5cclxuXHRjb25zdHJ1Y3RvcihpbnZlbnRvcnk6IEludmVudG9yeVBheWxvYWQpIHtcclxuXHRcdHRoaXMuaXRlbXMgPSBpbnZlbnRvcnkuaXRlbXNcclxuXHRcdHRoaXMud2lkdGggPSBpbnZlbnRvcnkud2lkdGhcclxuXHRcdHRoaXMuaGVpZ2h0ID0gaW52ZW50b3J5LmhlaWdodFxyXG5cdH1cclxuXHJcblx0d29ybGRDbGljayh4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG5cdFx0Y29uc3Qgc2VsZWN0ZWRJdGVtID0gdGhpcy5pdGVtc1t0aGlzLnNlbGVjdGVkU2xvdF1cclxuXHRcdGlmKHNlbGVjdGVkSXRlbSA9PT0gdW5kZWZpbmVkIHx8IHNlbGVjdGVkSXRlbSA9PT0gbnVsbCkge1xyXG5cdFx0XHQvL2NvbnNvbGUuZXJyb3IoXCJCcmVha2luZyB0aWxlXCIpXHJcblx0XHRcdGxldCB0aWxlQmVpbmdCcm9rZW4gPSBnYW1lLndvcmxkLndvcmxkVGlsZXNbZ2FtZS53b3JsZC53aWR0aCAqIHkgKyB4XTtcclxuXHRcdFx0aWYodHlwZW9mIHRpbGVCZWluZ0Jyb2tlbiA9PT0gJ251bWJlcicpIHtcclxuXHRcdFx0XHRsZXQgd29ybGRUaWxlQmVpbmdCcm9rZW4gPSBXb3JsZFRpbGVzW3RpbGVCZWluZ0Jyb2tlbl1cclxuXHRcdFx0XHRmb3IobGV0IGkgPSAwOyBpPDUqZ2FtZS5wYXJ0aWNsZU11bHRpcGxpZXI7IGkrKykge1xyXG5cdFx0XHRcdFx0aWYgKHdvcmxkVGlsZUJlaW5nQnJva2VuICE9PSB1bmRlZmluZWQpXHJcblx0XHRcdFx0XHRnYW1lLnBhcnRpY2xlcy5wdXNoKG5ldyBDb2xvclBhcnRpY2xlKHdvcmxkVGlsZUJlaW5nQnJva2VuLmNvbG9yLCBNYXRoLnJhbmRvbSgpKjAuMiswLjEsIDEwLCB4K01hdGgucmFuZG9tKCksIHkrTWF0aC5yYW5kb20oKSwgMC4yKihNYXRoLnJhbmRvbSgpLTAuNSksIC0wLjE1Kk1hdGgucmFuZG9tKCkpKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRnYW1lLmNvbm5lY3Rpb24uZW1pdChcclxuXHRcdFx0XHQnd29ybGRCcmVha1N0YXJ0JyxcclxuXHRcdFx0XHRnYW1lLndvcmxkLndpZHRoICogeSArIHhcclxuXHRcdFx0KTtcclxuXHRcdFx0Z2FtZS5jb25uZWN0aW9uLmVtaXQoJ3dvcmxkQnJlYWtGaW5pc2gnKTtcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3Qgd29ybGRDbGljayA9IEl0ZW1BY3Rpb25zW0l0ZW1zW3NlbGVjdGVkSXRlbS5pdGVtXS50eXBlXS53b3JsZENsaWNrXHJcblx0XHRpZih3b3JsZENsaWNrID09PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0Y29uc29sZS5lcnJvcihcIkNhbm5vdCBwbGFjZSBzZWxlY3RlZCBpdGVtXCIpXHJcblx0XHRcdHJldHVyblxyXG5cdFx0fVxyXG5cclxuXHRcdHdvcmxkQ2xpY2soeCwgeSlcclxuXHR9XHJcbn1cclxuXHJcbmludGVyZmFjZSBJdGVtQmFzZSB7XHJcblx0d29ybGRDbGljaz86ICh4OiBudW1iZXIsIHk6IG51bWJlcikgPT4gdm9pZFxyXG59XHJcblxyXG5jb25zdCBJdGVtQWN0aW9uczogUmVjb3JkPEl0ZW1DYXRlZ29yaWVzLCBJdGVtQmFzZT4gPSB7XHJcblx0W0l0ZW1DYXRlZ29yaWVzLlRpbGVdOiB7XHJcblx0XHR3b3JsZENsaWNrKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcblx0XHRcdC8vIElmIHRoZSB0aWxlIGlzbid0IGFpclxyXG5cdFx0XHRpZiAoXHJcblx0XHRcdFx0Z2FtZS53b3JsZC53b3JsZFRpbGVzW1xyXG5cdFx0XHRcdGdhbWUud29ybGQud2lkdGggKiB5ICsgeFxyXG5cdFx0XHRcdFx0XSAhPT0gVGlsZVR5cGUuQWlyXHJcblx0XHRcdCkge1xyXG5cclxuXHRcdFx0XHRsZXQgdGlsZUJlaW5nQnJva2VuID0gZ2FtZS53b3JsZC53b3JsZFRpbGVzW2dhbWUud29ybGQud2lkdGggKiB5ICsgeF07XHJcblx0XHRcdFx0aWYodHlwZW9mIHRpbGVCZWluZ0Jyb2tlbiA9PT0gJ251bWJlcicpIHsvL3RpbGUgaXMgdGlsZVxyXG5cdFx0XHRcdFx0bGV0IHdvcmxkVGlsZUJlaW5nQnJva2VuID0gV29ybGRUaWxlc1t0aWxlQmVpbmdCcm9rZW5dXHJcblx0XHRcdFx0XHRmb3IobGV0IGkgPSAwOyBpPDUqZ2FtZS5wYXJ0aWNsZU11bHRpcGxpZXI7IGkrKykge1xyXG5cdFx0XHRcdFx0XHRpZiAod29ybGRUaWxlQmVpbmdCcm9rZW4gIT09IHVuZGVmaW5lZClcclxuXHRcdFx0XHRcdFx0Z2FtZS5wYXJ0aWNsZXMucHVzaChuZXcgQ29sb3JQYXJ0aWNsZSh3b3JsZFRpbGVCZWluZ0Jyb2tlbi5jb2xvciwgTWF0aC5yYW5kb20oKSowLjIrMC4xLCAxMCwgeCtNYXRoLnJhbmRvbSgpLCB5K01hdGgucmFuZG9tKCksIDAuMiooTWF0aC5yYW5kb20oKS0wLjUpLCAtMC4xNSpNYXRoLnJhbmRvbSgpKSlcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGNvbnNvbGUuaW5mbygnYnJlYWtpbmcnKTtcclxuXHRcdFx0XHRcdGdhbWUuY29ubmVjdGlvbi5lbWl0KFxyXG5cdFx0XHRcdFx0XHQnd29ybGRCcmVha1N0YXJ0JyxcclxuXHRcdFx0XHRcdFx0Z2FtZS53b3JsZC53aWR0aCAqIHkgKyB4XHJcblx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdFx0Z2FtZS5jb25uZWN0aW9uLmVtaXQoXHJcblx0XHRcdFx0XHRcdCd3b3JsZEJyZWFrRmluaXNoJ1xyXG5cdFx0XHRcdFx0KTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7Ly90aWxlIGlzIHRpbGUgZW50aXR5XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcInRpbGUgZW50aXR5IGludGVyYWN0XCIpXHJcblx0XHRcdFx0XHRnYW1lLmNvbm5lY3Rpb24uZW1pdChcclxuXHRcdFx0XHRcdFx0J3dvcmxkQnJlYWtTdGFydCcsXHJcblx0XHRcdFx0XHRcdGdhbWUud29ybGQud2lkdGggKiB5ICsgeFxyXG5cdFx0XHRcdFx0KTtcclxuXHRcdFx0XHRcdGdhbWUuY29ubmVjdGlvbi5lbWl0KFxyXG5cdFx0XHRcdFx0XHQnd29ybGRCcmVha0ZpbmlzaCdcclxuXHRcdFx0XHRcdCk7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdC8vaWYgdGhlIHRpbGUgaXMgYWlyXHJcblx0XHRcdGNvbnNvbGUuaW5mbygnUGxhY2luZycpO1xyXG5cdFx0XHRnYW1lLmNvbm5lY3Rpb24uZW1pdChcclxuXHRcdFx0XHQnd29ybGRQbGFjZScsXHJcblx0XHRcdFx0Z2FtZS53b3JsZC5pbnZlbnRvcnkuc2VsZWN0ZWRTbG90LFxyXG5cdFx0XHRcdHgsXHJcblx0XHRcdFx0eVxyXG5cdFx0XHQpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0W0l0ZW1DYXRlZ29yaWVzLlJlc291cmNlXToge30sXHJcblx0W0l0ZW1DYXRlZ29yaWVzLlRvb2xdOiB7fSxcclxuXHRbSXRlbUNhdGVnb3JpZXMuVGlsZUVudGl0eV06IHtcclxuXHRcdHdvcmxkQ2xpY2soeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuXHRcdFx0bGV0IGl0ZW1SZWYgPSBJdGVtc1tnYW1lLndvcmxkLmludmVudG9yeS5pdGVtc1tnYW1lLndvcmxkLmludmVudG9yeS5zZWxlY3RlZFNsb3RdPy5pdGVtIHx8IDBdO1xyXG5cdFx0XHRsZXQgb2Zmc2V0OiBbbnVtYmVyLCBudW1iZXJdID0gWzAsIDBdXHJcblx0XHRcdGlmKFwidGlsZUVudGl0eU9mZnNldFwiIGluIGl0ZW1SZWYpIHtcclxuXHRcdFx0XHRvZmZzZXQgPSBpdGVtUmVmLnRpbGVFbnRpdHlPZmZzZXQ7XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdGdhbWUuY29ubmVjdGlvbi5lbWl0KFxyXG5cdFx0XHRcdCd3b3JsZFBsYWNlJyxcclxuXHRcdFx0XHRnYW1lLndvcmxkLmludmVudG9yeS5zZWxlY3RlZFNsb3QsXHJcblx0XHRcdFx0eCxcclxuXHRcdFx0XHR5XHJcblx0XHRcdCk7XHJcblx0XHR9XHJcblx0fSxcclxufSIsImltcG9ydCBwNSBmcm9tICdwNSc7XHJcbmltcG9ydCB7IEVudGl0aWVzLCBFbnRpdHlQYXlsb2FkIH0gZnJvbSAnLi4vLi4vZ2xvYmFsL0VudGl0eSc7XHJcbmltcG9ydCB7IGdhbWUgfSBmcm9tICcuLi9HYW1lJztcclxuaW1wb3J0IHsgU2VydmVyRW50aXR5IH0gZnJvbSAnLi4vd29ybGQvZW50aXRpZXMvU2VydmVyRW50aXR5JztcclxuLy8gaW1wb3J0IHsgQ29sb3JQYXJ0aWNsZSB9IGZyb20gJy4uL3dvcmxkLyc7XHJcbmltcG9ydCB7IEFuaW1hdGlvbkZyYW1lLCBQbGF5ZXJBbmltYXRpb25zIH0gZnJvbSAnLi4vYXNzZXRzL0Fzc2V0cyc7XHJcbmltcG9ydCB7IFRpbGVUeXBlIH0gZnJvbSAnLi4vLi4vZ2xvYmFsL1RpbGUnO1xyXG5pbXBvcnQgeyBXb3JsZFRpbGVzIH0gZnJvbSAnLi4vd29ybGQvV29ybGRUaWxlcyc7XHJcbmltcG9ydCB7IENvbG9yUGFydGljbGUgfSBmcm9tICcuLi93b3JsZC9wYXJ0aWNsZXMvQ29sb3JQYXJ0aWNsZSc7XHJcblxyXG5leHBvcnQgY2xhc3MgUGxheWVyTG9jYWwgZXh0ZW5kcyBTZXJ2ZXJFbnRpdHkge1xyXG4gICAgLy8gQ29uc3RhbnQgZGF0YVxyXG4gICAgd2lkdGg6IG51bWJlciA9IDEyIC8gZ2FtZS5USUxFX1dJRFRIO1xyXG4gICAgaGVpZ2h0OiBudW1iZXIgPSAyMCAvIGdhbWUuVElMRV9IRUlHSFQ7XHJcblxyXG4gICAgLy8gU2hhcmVkIGRhdGFcclxuICAgIG5hbWU6IHN0cmluZztcclxuXHJcbiAgICAvLyBMb2NhbCBkYXRhXHJcbiAgICB4VmVsOiBudW1iZXIgPSAwO1xyXG4gICAgeVZlbDogbnVtYmVyID0gMDtcclxuICAgIHNsaWRlWDogbnVtYmVyO1xyXG4gICAgc2xpZGVZOiBudW1iZXI7XHJcbiAgICBpbnRlcnBvbGF0ZWRYOiBudW1iZXI7XHJcbiAgICBpbnRlcnBvbGF0ZWRZOiBudW1iZXI7XHJcblxyXG4gICAgcFg6IG51bWJlcjtcclxuICAgIHBZOiBudW1iZXI7XHJcbiAgICBwWFZlbDogbnVtYmVyID0gMDtcclxuICAgIHBZVmVsOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIGdyb3VuZGVkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwR3JvdW5kZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICBjb2xsaXNpb25EYXRhOiBhbnk7XHJcbiAgICBjbG9zZXN0Q29sbGlzaW9uOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl07XHJcblxyXG4gICAgbWFzczogbnVtYmVyID0gdGhpcy53aWR0aCAqIHRoaXMuaGVpZ2h0O1xyXG5cclxuXHJcbiAgICAvL2lucHV0IGJvb2xlYW5zXHJcbiAgICByaWdodEJ1dHRvbjogYm9vbGVhbjtcclxuICAgIGxlZnRCdXR0b246IGJvb2xlYW47XHJcbiAgICBqdW1wQnV0dG9uOiBib29sZWFuO1xyXG5cclxuICAgIGN1cnJlbnRBbmltYXRpb246IEFuaW1hdGlvbkZyYW1lPHR5cGVvZiBQbGF5ZXJBbmltYXRpb25zPiA9IFwiaWRsZVwiO1xyXG4gICAgYW5pbUZyYW1lOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIHRvcENvbGxpc2lvbjogKHR5cGVvZiBXb3JsZFRpbGVzW1RpbGVUeXBlLkFpcl0pID0gV29ybGRUaWxlc1tUaWxlVHlwZS5BaXJdOy8vaGFja3lcclxuICAgIGJvdHRvbUNvbGxpc2lvbjogKHR5cGVvZiBXb3JsZFRpbGVzW1RpbGVUeXBlLkFpcl0pID0gV29ybGRUaWxlc1tUaWxlVHlwZS5BaXJdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIGRhdGE6IEVudGl0eVBheWxvYWQ8RW50aXRpZXMuTG9jYWxQbGF5ZXI+XHJcbiAgICApIHtcclxuICAgICAgICBzdXBlcihkYXRhLmlkKVxyXG5cclxuICAgICAgICB0aGlzLm5hbWUgPSBkYXRhLmRhdGEubmFtZTtcclxuXHJcbiAgICAgICAgdGhpcy54ID0gZGF0YS5kYXRhLng7XHJcbiAgICAgICAgdGhpcy55ID0gZGF0YS5kYXRhLnk7XHJcblxyXG4gICAgICAgIHRoaXMucFggPSB0aGlzLng7XHJcbiAgICAgICAgdGhpcy5wWSA9IHRoaXMueTtcclxuXHJcbiAgICAgICAgdGhpcy5pbnRlcnBvbGF0ZWRYID0gdGhpcy54O1xyXG4gICAgICAgIHRoaXMuaW50ZXJwb2xhdGVkWSA9IHRoaXMueTtcclxuXHJcbiAgICAgICAgdGhpcy5jbG9zZXN0Q29sbGlzaW9uID0gWzEsIDAsIEluZmluaXR5XTtcclxuICAgIFxyXG4gICAgICAgIHRoaXMubGVmdEJ1dHRvbiA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucmlnaHRCdXR0b24gPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmp1bXBCdXR0b24gPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIodGFyZ2V0OiBwNSwgdXBzY2FsZVNpemU6IG51bWJlcik6IHZvaWQge1xyXG5cclxuICAgICAgICAvLyB0YXJnZXQucmVjdChcclxuICAgICAgICAvLyAgICAgKHRoaXMuaW50ZXJwb2xhdGVkWCAqIGdhbWUuVElMRV9XSURUSCAtXHJcbiAgICAgICAgLy8gICAgICAgICBnYW1lLmludGVycG9sYXRlZENhbVggKiBnYW1lLlRJTEVfV0lEVEgpICpcclxuICAgICAgICAvLyAgICAgICAgIHVwc2NhbGVTaXplLFxyXG4gICAgICAgIC8vICAgICAodGhpcy5pbnRlcnBvbGF0ZWRZICogZ2FtZS5USUxFX0hFSUdIVCAtXHJcbiAgICAgICAgLy8gICAgICAgICBnYW1lLmludGVycG9sYXRlZENhbVkgKiBnYW1lLlRJTEVfSEVJR0hUKSAqXHJcbiAgICAgICAgLy8gICAgICAgICB1cHNjYWxlU2l6ZSxcclxuICAgICAgICAvLyAgICAgdGhpcy53aWR0aCAqIHVwc2NhbGVTaXplICogZ2FtZS5USUxFX1dJRFRILFxyXG4gICAgICAgIC8vICAgICB0aGlzLmhlaWdodCAqIHVwc2NhbGVTaXplICogZ2FtZS5USUxFX0hFSUdIVFxyXG4gICAgICAgIC8vICk7XHJcbiAgICAgICAgUGxheWVyQW5pbWF0aW9uc1t0aGlzLmN1cnJlbnRBbmltYXRpb25dW3RoaXMuYW5pbUZyYW1lXS5yZW5kZXJcclxuICAgICAgICAgICAgKFxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0LFxyXG4gICAgICAgICAgICAgICAgTWF0aC5yb3VuZCgodGhpcy5pbnRlcnBvbGF0ZWRYICogZ2FtZS5USUxFX1dJRFRIIC1cclxuICAgICAgICAgICAgICAgICAgICBnYW1lLmludGVycG9sYXRlZENhbVggKiBnYW1lLlRJTEVfV0lEVEgpICpcclxuICAgICAgICAgICAgICAgIHVwc2NhbGVTaXplKSxcclxuICAgICAgICAgICAgICAgIE1hdGgucm91bmQoKHRoaXMuaW50ZXJwb2xhdGVkWSAqIGdhbWUuVElMRV9IRUlHSFQgLVxyXG4gICAgICAgICAgICAgICAgICAgIGdhbWUuaW50ZXJwb2xhdGVkQ2FtWSAqIGdhbWUuVElMRV9IRUlHSFQpICpcclxuICAgICAgICAgICAgICAgIHVwc2NhbGVTaXplKSxcclxuICAgICAgICAgICAgICAgIHRoaXMud2lkdGggKiB1cHNjYWxlU2l6ZSAqIGdhbWUuVElMRV9XSURUSCxcclxuICAgICAgICAgICAgICAgIHRoaXMuaGVpZ2h0ICogdXBzY2FsZVNpemUgKiBnYW1lLlRJTEVfSEVJR0hUXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIFBsYXllckFuaW1hdGlvbnNbdGhpcy5jdXJyZW50QW5pbWF0aW9uXVt0aGlzLmFuaW1GcmFtZV0ucmVuZGVyV29ybGRzcGFjZVJlZmxlY3Rpb25cclxuICAgICAgICAgICAgKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5pbnRlcnBvbGF0ZWRYLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5pbnRlcnBvbGF0ZWRZK3RoaXMuaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgdGhpcy53aWR0aCxcclxuICAgICAgICAgICAgICAgIHRoaXMuaGVpZ2h0XHJcbiAgICAgICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlRGF0YShkYXRhOiBFbnRpdHlQYXlsb2FkKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKGRhdGEudHlwZSA9PT0gRW50aXRpZXMuUGxheWVyKSB0aGlzLm5hbWUgPSBkYXRhLmRhdGEubmFtZTtcclxuICAgIH1cclxuXHJcbiAgICBrZXlib2FyZElucHV0KCkge1xyXG5cclxuICAgICAgICB0aGlzLnhWZWwgKz1cclxuICAgICAgICAgICAgMC4wMiAqICgrdGhpcy5yaWdodEJ1dHRvbiAtICt0aGlzLmxlZnRCdXR0b24pO1xyXG4gICAgICAgIGlmIChcclxuICAgICAgICAgICAgdGhpcy5ncm91bmRlZCAmJiB0aGlzLmp1bXBCdXR0b25cclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgZ2FtZS5zY3JlZW5zaGFrZUFtb3VudCA9IDAuNTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMCAqIGdhbWUucGFydGljbGVNdWx0aXBsaWVyOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuYm90dG9tQ29sbGlzaW9uICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS5wYXJ0aWNsZXMucHVzaChuZXcgQ29sb3JQYXJ0aWNsZSh0aGlzLmJvdHRvbUNvbGxpc2lvbi5jb2xvciwgMSAvIDggKyBNYXRoLnJhbmRvbSgpIC8gOCwgMjAsIHRoaXMueCArIHRoaXMud2lkdGggKiBNYXRoLnJhbmRvbSgpLCB0aGlzLnkgKyB0aGlzLmhlaWdodCwgMC4yICogKE1hdGgucmFuZG9tKCkgLSAwLjUpLCAwLjIgKiAtTWF0aC5yYW5kb20oKSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMueVZlbCA9IC0xLjU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFwcGx5R3Jhdml0eUFuZERyYWcoKSB7XHJcbiAgICAgICAgLy8gdGhpcyBmdW5jdGlvbiBjaGFuZ2VzIHRoZSBvYmplY3QncyBuZXh0IHRpY2sncyB2ZWxvY2l0eSBpbiBib3RoIHRoZSB4IGFuZCB0aGUgeSBkaXJlY3Rpb25zXHJcblxyXG4gICAgICAgIHRoaXMucFhWZWwgPSB0aGlzLnhWZWw7XHJcbiAgICAgICAgdGhpcy5wWVZlbCA9IHRoaXMueVZlbDtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuYm90dG9tQ29sbGlzaW9uID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy54VmVsIC09XHJcbiAgICAgICAgICAgICAgICAoTWF0aC5hYnModGhpcy54VmVsKSAqIHRoaXMueFZlbCAqIGdhbWUuRFJBR19DT0VGRklDSUVOVCAqIHRoaXMud2lkdGgpIC8gLy9hcHBseSBhaXIgcmVzaXN0YW5jZVxyXG4gICAgICAgICAgICAgICAgdGhpcy5tYXNzO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMueFZlbCAtPVxyXG4gICAgICAgICAgICAgICAgKE1hdGguYWJzKHRoaXMueFZlbCkgKiB0aGlzLnhWZWwgKiBnYW1lLkRSQUdfQ09FRkZJQ0lFTlQgKiAodGhpcy5ib3R0b21Db2xsaXNpb24uZnJpY3Rpb24pICogdGhpcy53aWR0aCkgLyAvL2FwcGx5IGFpciByZXNpc3RhbmNlIGFuZCBncm91bmQgZnJpY3Rpb25cclxuICAgICAgICAgICAgICAgIHRoaXMubWFzcztcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy55VmVsICs9IGdhbWUuR1JBVklUWV9TUEVFRDtcclxuICAgICAgICB0aGlzLnlWZWwgLT1cclxuICAgICAgICAgICAgKGdhbWUuYWJzKHRoaXMueVZlbCkgKiB0aGlzLnlWZWwgKiBnYW1lLkRSQUdfQ09FRkZJQ0lFTlQgKiB0aGlzLmhlaWdodCkgL1xyXG4gICAgICAgICAgICB0aGlzLm1hc3M7XHJcbiAgICAgICAgLy9pZiBvbiB0aGUgZ3JvdW5kLCBtYWtlIHdhbGtpbmcgcGFydGljbGVzXHJcbiAgICAgICAgaWYgKHRoaXMuZ3JvdW5kZWQpIHtcclxuICAgICAgICAgICAgLy9mb290c3RlcHNcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByYW5kb21seVRvSW50KE1hdGguYWJzKHRoaXMueFZlbCkgKiBnYW1lLnBhcnRpY2xlTXVsdGlwbGllciAvIDIpOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGdhbWUucGFydGljbGVzLnB1c2gobmV3IENvbG9yUGFydGljbGUoXCIjYmJiYmJiNDVcIiwgMSAvIDQgKyBNYXRoLnJhbmRvbSgpIC8gOCwgNTAsIHRoaXMueCArIHRoaXMud2lkdGggLyAyICsgaSAvIGdhbWUucGFydGljbGVNdWx0aXBsaWVyLCB0aGlzLnkgKyB0aGlzLmhlaWdodCwgMCwgMCwgZmFsc2UpKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy9kdXN0XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmFuZG9tbHlUb0ludChNYXRoLmFicyh0aGlzLnhWZWwpICogZ2FtZS5wYXJ0aWNsZU11bHRpcGxpZXIgLyAyKTsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLmJvdHRvbUNvbGxpc2lvbiAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgZ2FtZS5wYXJ0aWNsZXMucHVzaChuZXcgQ29sb3JQYXJ0aWNsZSh0aGlzLmJvdHRvbUNvbGxpc2lvbi5jb2xvciwgMSAvIDggKyBNYXRoLnJhbmRvbSgpIC8gOCwgMTAsIHRoaXMueCArIHRoaXMud2lkdGggLyAyLCB0aGlzLnkgKyB0aGlzLmhlaWdodCwgMC4yICogLXRoaXMueFZlbCArIDAuMiAqIChNYXRoLnJhbmRvbSgpIC0gMC41KSwgMC4yICogLU1hdGgucmFuZG9tKCksIHRydWUpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmaW5kSW50ZXJwb2xhdGVkQ29vcmRpbmF0ZXMoKSB7XHJcbiAgICAgICAgLy8gdGhpcyBmdW5jdGlvbiBlc3NlbnRpYWxseSBtYWtlcyB0aGUgY2hhcmFjdGVyIGxhZyBiZWhpbmQgb25lIHRpY2ssIGJ1dCBtZWFucyB0aGF0IGl0IGdldHMgZGlzcGxheWVkIGF0IHRoZSBtYXhpbXVtIGZyYW1lIHJhdGUuXHJcbiAgICAgICAgaWYgKHRoaXMucFhWZWwgPiAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW50ZXJwb2xhdGVkWCA9IGdhbWUubWluKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5wWCArIHRoaXMucFhWZWwgKiBnYW1lLmFtb3VudFNpbmNlTGFzdFRpY2ssXHJcbiAgICAgICAgICAgICAgICB0aGlzLnhcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmludGVycG9sYXRlZFggPSBnYW1lLm1heChcclxuICAgICAgICAgICAgICAgIHRoaXMucFggKyB0aGlzLnBYVmVsICogZ2FtZS5hbW91bnRTaW5jZUxhc3RUaWNrLFxyXG4gICAgICAgICAgICAgICAgdGhpcy54XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLnBZVmVsID4gMCkge1xyXG4gICAgICAgICAgICB0aGlzLmludGVycG9sYXRlZFkgPSBnYW1lLm1pbihcclxuICAgICAgICAgICAgICAgIHRoaXMucFkgKyB0aGlzLnBZVmVsICogZ2FtZS5hbW91bnRTaW5jZUxhc3RUaWNrLFxyXG4gICAgICAgICAgICAgICAgdGhpcy55XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5pbnRlcnBvbGF0ZWRZID0gZ2FtZS5tYXgoXHJcbiAgICAgICAgICAgICAgICB0aGlzLnBZICsgdGhpcy5wWVZlbCAqIGdhbWUuYW1vdW50U2luY2VMYXN0VGljayxcclxuICAgICAgICAgICAgICAgIHRoaXMueVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBhcHBseVZlbG9jaXR5QW5kQ29sbGlkZSgpIHtcclxuICAgICAgICB0aGlzLnRvcENvbGxpc2lvbiA9IFdvcmxkVGlsZXNbVGlsZVR5cGUuQWlyXTtcclxuICAgICAgICB0aGlzLmJvdHRvbUNvbGxpc2lvbiA9IFdvcmxkVGlsZXNbVGlsZVR5cGUuQWlyXTtcclxuICAgICAgICB0aGlzLnBYID0gdGhpcy54O1xyXG4gICAgICAgIHRoaXMucFkgPSB0aGlzLnk7XHJcblxyXG4gICAgICAgIHRoaXMucEdyb3VuZGVkID0gdGhpcy5ncm91bmRlZDtcclxuICAgICAgICB0aGlzLmdyb3VuZGVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgVGhpcyBmdW5jdGlvbiBhc3N1bWVzIHRoYXQgdGhlIG9iamVjdCBkb2Vzbid0IHN0YXJ0IGluIGNvbGxpc2lvblxyXG5cclxuICAgICAgICBBbHNvLCBpdCB0YWtlcyBhZHZhbnRhZ2Ugb2YgdGhlIGZhY3QgdGhhdCBhbiBvYmplY3QgY2FuIG9ubHkgY29sbGlkZSBvbmNlIGluIGVhY2ggYXhpcyB3aXRoIHRoZXNlIGF4aXMtYWxpZ25lZCByZWN0YW5nbGVzLlxyXG4gICAgICAgIFRoYXQncyBhIHRvdGFsIG9mIGEgcG9zc2libGUgdHdvIGNvbGxpc2lvbnMsIG9yIGFuIGluaXRpYWwgY29sbGlzaW9uLCBhbmQgYSBzbGlkaW5nIGNvbGxpc2lvbi5cclxuICAgICAgICAqL1xyXG5cclxuICAgICAgICAvLyBjYWxjdWxhdGUgdGhlIGluaXRpYWwgY29sbGlzaW9uOlxyXG5cclxuICAgICAgICAvLyBzZXQgdGhlIGNsb3Nlc3QgY29sbGlzaW9uIHRvIG9uZSBpbmZpbml0ZWx5IGZhciBhd2F5LlxyXG4gICAgICAgIHRoaXMuY2xvc2VzdENvbGxpc2lvbiA9IFsxLCAwLCBJbmZpbml0eV07XHJcblxyXG4gICAgICAgIGxldCBtb3N0bHlHb2luZ0hvcml6b250YWxseTogYm9vbGVhbjtcclxuXHJcbiAgICAgICAgLy8gbG9vcCB0aHJvdWdoIGFsbCB0aGUgcG9zc2libGUgdGlsZXMgdGhlIHBoeXNpY3MgYm94IGNvdWxkIGJlIGludGVyc2VjdGluZyB3aXRoXHJcbiAgICAgICAgZm9yIChcclxuICAgICAgICAgICAgbGV0IGkgPSBNYXRoLmZsb29yKGdhbWUubWluKHRoaXMueCwgdGhpcy54ICsgdGhpcy54VmVsKSk7XHJcbiAgICAgICAgICAgIGkgPCBNYXRoLmNlaWwoZ2FtZS5tYXgodGhpcy54LCB0aGlzLnggKyB0aGlzLnhWZWwpICsgdGhpcy53aWR0aCk7XHJcbiAgICAgICAgICAgIGkrK1xyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICBmb3IgKFxyXG4gICAgICAgICAgICAgICAgbGV0IGogPSBNYXRoLmZsb29yKGdhbWUubWluKHRoaXMueSwgdGhpcy55ICsgdGhpcy55VmVsKSk7XHJcbiAgICAgICAgICAgICAgICBqIDwgTWF0aC5jZWlsKGdhbWUubWF4KHRoaXMueSwgdGhpcy55ICsgdGhpcy55VmVsKSArIHRoaXMuaGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgIGorK1xyXG4gICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBjdXJyZW50IHRpbGUgaXNuJ3QgYWlyICh2YWx1ZSAwKSwgdGhlbiBjb250aW51ZSB3aXRoIHRoZSBjb2xsaXNpb24gZGV0ZWN0aW9uXHJcbiAgICAgICAgICAgICAgICBsZXQgY3VycmVudEJsb2NrOiBUaWxlVHlwZSB8IHN0cmluZyA9IGdhbWUud29ybGQud29ybGRUaWxlc1tqICogZ2FtZS53b3JsZFdpZHRoICsgaV07XHJcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudEJsb2NrICE9PSBUaWxlVHlwZS5BaXIgJiYgdHlwZW9mIGN1cnJlbnRCbG9jayAhPT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBnZXQgdGhlIGRhdGEgYWJvdXQgdGhlIGNvbGxpc2lvbiBhbmQgc3RvcmUgaXQgaW4gYSB2YXJpYWJsZVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29sbGlzaW9uRGF0YSA9IGdhbWUucmVjdFZzUmF5KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpIC0gdGhpcy53aWR0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaiAtIHRoaXMuaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLndpZHRoICsgMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oZWlnaHQgKyAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLngsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMueSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy54VmVsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnlWZWxcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgIG1vc3RseUdvaW5nSG9yaXpvbnRhbGx5ID0gTWF0aC5hYnModGhpcy54VmVsKSA+IE1hdGguYWJzKHRoaXMueVZlbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbGxpc2lvbkRhdGEgIT09IGZhbHNlKSB7Ly9hIGNvbGxpc2lvbiBoYXBwZW5lZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMl0gPiB0aGlzLmNvbGxpc2lvbkRhdGFbMl1cclxuICAgICAgICAgICAgICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3Nlc3RDb2xsaXNpb24gPSB0aGlzLmNvbGxpc2lvbkRhdGE7Ly9ob25lc3RseSB0aGlzIGVudGlyZSBjb2xsaXNpb24gc3lzdGVtIGlzIGEgbWVzcyBidXQgaXQgd29yayBzbyBzbyB3aGF0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jbG9zZXN0Q29sbGlzaW9uWzBdID09PSAwKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMV0gPT09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b3BDb2xsaXNpb24gPSBXb3JsZFRpbGVzW2N1cnJlbnRCbG9ja107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJvdHRvbUNvbGxpc2lvbiA9IFdvcmxkVGlsZXNbY3VycmVudEJsb2NrXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5jbG9zZXN0Q29sbGlzaW9uWzJdID09PSB0aGlzLmNvbGxpc2lvbkRhdGFbMl0gJiYgbW9zdGx5R29pbmdIb3Jpem9udGFsbHkgPT09ICh0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMF0gPT09IDApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3Nlc3RDb2xsaXNpb24gPSB0aGlzLmNvbGxpc2lvbkRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jbG9zZXN0Q29sbGlzaW9uWzBdID09PSAwKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMV0gPT09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b3BDb2xsaXNpb24gPSBXb3JsZFRpbGVzW2N1cnJlbnRCbG9ja107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJvdHRvbUNvbGxpc2lvbiA9IFdvcmxkVGlsZXNbY3VycmVudEJsb2NrXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5jbG9zZXN0Q29sbGlzaW9uWzJdICE9PSBJbmZpbml0eSkge1xyXG4gICAgICAgICAgICAvLyB0aGVyZSBoYXMgYmVlbiBhdCBsZWFzdCBvbmUgY29sbGlzaW9uXHJcblxyXG4gICAgICAgICAgICAvLyBnbyB0byB0aGUgcG9pbnQgb2YgY29sbGlzaW9uICh0aGlzIG1ha2VzIGl0IGJlaGF2ZSBhcyBpZiB0aGUgd2FsbHMgYXJlIHN0aWNreSwgYnV0IHdlIHdpbGwgbGF0ZXIgc2xpZGUgYWdhaW5zdCB0aGUgd2FsbHMpXHJcbiAgICAgICAgICAgIHRoaXMueCArPSB0aGlzLnhWZWwgKiB0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMl07XHJcbiAgICAgICAgICAgIHRoaXMueSArPSB0aGlzLnlWZWwgKiB0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMl07XHJcbiAgICAgICAgICAgIC8vIHRoZSBjb2xsaXNpb24gaGFwcGVuZWQgZWl0aGVyIG9uIHRoZSB0b3Agb3IgYm90dG9tXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMF0gPT09IDApIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMV0gPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ncm91bmRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgaXQgY29sbGlkZWQgb24gdGhlIGhpZ2hlciBzaWRlLCBpdCBtdXN0IGJlIHRvdWNoaW5nIHRoZSBncm91bmQuIChoaWdoZXIgeSBpcyBkb3duKVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5wR3JvdW5kZWQpIHsvL2lmIGl0IGlzbid0IGdyb3VuZGVkIHlldCwgaXQgbXVzdCBiZSBjb2xsaWRpbmcgd2l0aCB0aGUgZ3JvdW5kIGZvciB0aGUgZmlyc3QgdGltZSwgc28gc3VtbW9uIHBhcnRpY2xlc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBnYW1lLnNjcmVlbnNoYWtlQW1vdW50ID0gTWF0aC5hYnModGhpcy55VmVsICogMC43NSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNSAqIGdhbWUucGFydGljbGVNdWx0aXBsaWVyOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuYm90dG9tQ29sbGlzaW9uICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2FtZS5wYXJ0aWNsZXMucHVzaChuZXcgQ29sb3JQYXJ0aWNsZSh0aGlzLmJvdHRvbUNvbGxpc2lvbi5jb2xvciwgMSAvIDggKyBNYXRoLnJhbmRvbSgpIC8gOCwgMjAsIHRoaXMueCArIHRoaXMud2lkdGggKiBNYXRoLnJhbmRvbSgpLCB0aGlzLnkgKyB0aGlzLmhlaWdodCwgMC4yICogKE1hdGgucmFuZG9tKCkgLSAwLjUpLCAwLjIgKiAtTWF0aC5yYW5kb20oKSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS5zY3JlZW5zaGFrZUFtb3VudCA9IE1hdGguYWJzKHRoaXMueVZlbCAqIDAuNzUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNSAqIGdhbWUucGFydGljbGVNdWx0aXBsaWVyOyBpKyspIHsvL2NlaWxpbmcgY29sbGlzaW9uIHBhcnRpY2xlc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZih0aGlzLnRvcENvbGxpc2lvbiAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2FtZS5wYXJ0aWNsZXMucHVzaChuZXcgQ29sb3JQYXJ0aWNsZSh0aGlzLnRvcENvbGxpc2lvbi5jb2xvciwgMSAvIDggKyBNYXRoLnJhbmRvbSgpIC8gOCwgMjAsIHRoaXMueCArIHRoaXMud2lkdGggKiBNYXRoLnJhbmRvbSgpLCB0aGlzLnksIDAuMiAqIChNYXRoLnJhbmRvbSgpIC0gMC41KSwgMC4yICogLU1hdGgucmFuZG9tKCkpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLnlWZWwgPSAwOyAvLyBzZXQgdGhlIHkgdmVsb2NpdHkgdG8gMCBiZWNhdXNlIHRoZSBvYmplY3QgaGFzIHJ1biBpbnRvIGEgd2FsbCBvbiBpdHMgdG9wIG9yIGJvdHRvbVxyXG4gICAgICAgICAgICAgICAgdGhpcy5zbGlkZVggPSB0aGlzLnhWZWwgKiAoMSAtIHRoaXMuY2xvc2VzdENvbGxpc2lvblsyXSk7IC8vIHRoaXMgaXMgdGhlIHJlbWFpbmluZyBkaXN0YW5jZSB0byBzbGlkZSBhZnRlciB0aGUgY29sbGlzaW9uXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNsaWRlWSA9IDA7IC8vIGl0IGRvZXNuJ3Qgc2xpZGUgaW4gdGhlIHkgZGlyZWN0aW9uIGJlY2F1c2UgdGhlcmUncyBhIHdhbGwgXFwoLi0uKS9cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMueFZlbCA9IDA7IC8vIHNldCB0aGUgeCB2ZWxvY2l0eSB0byAwIGJlY2F1c2Ugd2FsbCBnbyBvb2ZcclxuICAgICAgICAgICAgICAgIHRoaXMuc2xpZGVYID0gMDsgLy8gaXQgZG9lc24ndCBzbGlkZSBpbiB0aGUgeCBkaXJlY3Rpb24gYmVjYXVzZSB0aGVyZSdzIGEgd2FsbCAvKC5fLilcXFxyXG4gICAgICAgICAgICAgICAgdGhpcy5zbGlkZVkgPSB0aGlzLnlWZWwgKiAoMSAtIHRoaXMuY2xvc2VzdENvbGxpc2lvblsyXSk7IC8vIHRoaXMgaXMgdGhlIHJlbWFpbmluZyBkaXN0YW5jZSB0byBzbGlkZSBhZnRlciB0aGUgY29sbGlzaW9uXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIGF0IHRoaXMgcG9pbnQsIHRoZSBvYmplY3QgaXMgdG91Y2hpbmcgaXRzIGZpcnN0IGNvbGxpc2lvbiwgcmVhZHkgdG8gc2xpZGUuICBUaGUgYW1vdW50IGl0IHdhbnRzIHRvIHNsaWRlIGlzIGhlbGQgaW4gdGhlIHRoaXMuc2xpZGVYIGFuZCB0aGlzLnNsaWRlWSB2YXJpYWJsZXMuXHJcblxyXG4gICAgICAgICAgICAvLyB0aGlzIGNhbiBiZSB0cmVhdGVkIGVzc2VudGlhbGx5IHRoZSBzYW1lIGFzIHRoZSBmaXJzdCBjb2xsaXNpb24sIHNvIGEgbG90IG9mIHRoZSBjb2RlIHdpbGwgYmUgcmV1c2VkLlxyXG5cclxuICAgICAgICAgICAgLy8gc2V0IHRoZSBjbG9zZXN0IGNvbGxpc2lvbiB0byBvbmUgaW5maW5pdGVseSBmYXIgYXdheS5cclxuICAgICAgICAgICAgdGhpcy5jbG9zZXN0Q29sbGlzaW9uID0gWzEsIDAsIEluZmluaXR5XTtcclxuXHJcbiAgICAgICAgICAgIC8vIGxvb3AgdGhyb3VnaCBhbGwgdGhlIHBvc3NpYmxlIHRpbGVzIHRoZSBwaHlzaWNzIGJveCBjb3VsZCBiZSBpbnRlcnNlY3Rpbmcgd2l0aFxyXG4gICAgICAgICAgICBmb3IgKFxyXG4gICAgICAgICAgICAgICAgbGV0IGkgPSBNYXRoLmZsb29yKGdhbWUubWluKHRoaXMueCwgdGhpcy54ICsgdGhpcy5zbGlkZVgpKTtcclxuICAgICAgICAgICAgICAgIGkgPCBNYXRoLmNlaWwoZ2FtZS5tYXgodGhpcy54LCB0aGlzLnggKyB0aGlzLnNsaWRlWCkgKyB0aGlzLndpZHRoKTtcclxuICAgICAgICAgICAgICAgIGkrK1xyXG4gICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgIGZvciAoXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGogPSBNYXRoLmZsb29yKGdhbWUubWluKHRoaXMueSwgdGhpcy55ICsgdGhpcy5zbGlkZVkpKTtcclxuICAgICAgICAgICAgICAgICAgICBqIDxcclxuICAgICAgICAgICAgICAgICAgICBNYXRoLmNlaWwoZ2FtZS5tYXgodGhpcy55LCB0aGlzLnkgKyB0aGlzLnNsaWRlWSkgKyB0aGlzLmhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaisrXHJcbiAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgY3VycmVudEJsb2NrOiBUaWxlVHlwZSB8IHN0cmluZyA9IGdhbWUud29ybGQud29ybGRUaWxlc1tqICogZ2FtZS53b3JsZFdpZHRoICsgaV07XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhlIGN1cnJlbnQgdGlsZSBpc24ndCBhaXIsIHRoZW4gY29udGludWUgd2l0aCB0aGUgY29sbGlzaW9uIGRldGVjdGlvblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50QmxvY2sgIT09IFRpbGVUeXBlLkFpciAmJiB0eXBlb2YgY3VycmVudEJsb2NrICE9PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGdldCB0aGUgZGF0YSBhYm91dCB0aGUgY29sbGlzaW9uIGFuZCBzdG9yZSBpdCBpbiBhIHZhcmlhYmxlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29sbGlzaW9uRGF0YSA9IGdhbWUucmVjdFZzUmF5KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaSAtIHRoaXMud2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqIC0gdGhpcy5oZWlnaHQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLndpZHRoICsgMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGVpZ2h0ICsgMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMueCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMueSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2xpZGVYLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zbGlkZVlcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb2xsaXNpb25EYXRhICE9PSBmYWxzZSAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9zZXN0Q29sbGlzaW9uWzJdID4gdGhpcy5jb2xsaXNpb25EYXRhWzJdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9zZXN0Q29sbGlzaW9uID0gdGhpcy5jb2xsaXNpb25EYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2xvc2VzdENvbGxpc2lvblswXSA9PT0gMCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jbG9zZXN0Q29sbGlzaW9uWzFdID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG9wQ29sbGlzaW9uID0gV29ybGRUaWxlc1tjdXJyZW50QmxvY2tdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ib3R0b21Db2xsaXNpb24gPSBXb3JsZFRpbGVzW2N1cnJlbnRCbG9ja107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBpdCBoYXMgY29sbGlkZWQgd2hpbGUgdHJ5aW5nIHRvIHNsaWRlXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMl0gIT09IEluZmluaXR5KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnggKz0gdGhpcy5zbGlkZVggKiB0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMl07XHJcbiAgICAgICAgICAgICAgICB0aGlzLnkgKz0gdGhpcy5zbGlkZVkgKiB0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMl07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2xvc2VzdENvbGxpc2lvblswXSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMueVZlbCA9IDA7IC8vIHNldCB0aGUgeSB2ZWxvY2l0eSB0byAwIGJlY2F1c2UgdGhlIG9iamVjdCBoYXMgcnVuIGludG8gYSB3YWxsIG9uIGl0cyB0b3Agb3IgYm90dG9tXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2xvc2VzdENvbGxpc2lvblsxXSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgaXQgY29sbGlkZWQgb24gdGhlIGhpZ2hlciBzaWRlLCBpdCBtdXN0IGJlIHRvdWNoaW5nIHRoZSBncm91bmQuIChoaWdoZXIgeSBpcyBkb3duKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdyb3VuZGVkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnhWZWwgPSAwOyAvLyBzZXQgdGhlIHggdmVsb2NpdHkgdG8gMCBiZWNhdXNlIHdhbGwgZ28gb29mXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBpdCBoYXMgbm90IGNvbGxpZGVkIHdoaWxlIHRyeWluZyB0byBzbGlkZVxyXG4gICAgICAgICAgICAgICAgdGhpcy54ICs9IHRoaXMuc2xpZGVYO1xyXG4gICAgICAgICAgICAgICAgdGhpcy55ICs9IHRoaXMuc2xpZGVZO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gdGhlcmUgaGFzIGJlZW4gbm8gY29sbGlzaW9uXHJcbiAgICAgICAgICAgIHRoaXMueCArPSB0aGlzLnhWZWw7XHJcbiAgICAgICAgICAgIHRoaXMueSArPSB0aGlzLnlWZWw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBjb2xsaWRlIHdpdGggc2lkZXMgb2YgbWFwXHJcblxyXG4gICAgICAgIGlmICh0aGlzLnggPCAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMueFZlbCA9IDA7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnggKyB0aGlzLndpZHRoID4gZ2FtZS53b3JsZFdpZHRoKSB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IGdhbWUud29ybGRXaWR0aCAtIHRoaXMud2lkdGg7XHJcbiAgICAgICAgICAgIHRoaXMueFZlbCA9IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy55ICsgdGhpcy5oZWlnaHQgPiBnYW1lLndvcmxkSGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIHRoaXMueSA9IGdhbWUud29ybGRIZWlnaHQgLSB0aGlzLmhlaWdodDtcclxuICAgICAgICAgICAgdGhpcy55VmVsID0gMDtcclxuICAgICAgICAgICAgdGhpcy5ncm91bmRlZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gcmFuZG9tbHlUb0ludChmOiBudW1iZXIpIHtcclxuICAgIGlmIChNYXRoLnJhbmRvbSgpID4gZiAtIE1hdGguZmxvb3IoZikpIHtcclxuICAgICAgICByZXR1cm4gKE1hdGguZmxvb3IoZikpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIChNYXRoLmNlaWwoZikpO1xyXG59IiwiaW1wb3J0IHsgUmVuZGVyYWJsZSB9IGZyb20gJy4uL2ludGVyZmFjZXMvUmVuZGVyYWJsZSc7XHJcbmltcG9ydCBwNSBmcm9tICdwNSc7XHJcbmltcG9ydCB7IEF1ZGlvQXNzZXRzLCBVaUFzc2V0cyB9IGZyb20gJy4uL2Fzc2V0cy9Bc3NldHMnO1xyXG5pbXBvcnQgeyBJbWFnZVJlc291cmNlIH0gZnJvbSAnLi4vYXNzZXRzL3Jlc291cmNlcy9JbWFnZVJlc291cmNlJztcclxuaW1wb3J0IHsgRm9udFJlc291cmNlIH0gZnJvbSAnLi4vYXNzZXRzL3Jlc291cmNlcy9Gb250UmVzb3VyY2UnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEJ1dHRvbiBpbXBsZW1lbnRzIFJlbmRlcmFibGUge1xyXG5cclxuICAgIGZvbnQ6IEZvbnRSZXNvdXJjZVxyXG4gICAgdHh0OiBzdHJpbmdcclxuICAgIGRlc2NyaXB0aW9uOiBzdHJpbmdcclxuICAgIG9uUHJlc3NlZEN1c3RvbTogRnVuY3Rpb25cclxuICAgIHg6IG51bWJlclxyXG4gICAgeTogbnVtYmVyXHJcbiAgICB3OiBudW1iZXJcclxuICAgIGg6IG51bWJlclxyXG4gICAgaW1hZ2U6IEltYWdlUmVzb3VyY2VcclxuICAgIG1vdXNlSXNPdmVyOiBib29sZWFuXHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgZm9udDogRm9udFJlc291cmNlLFxyXG4gICAgICAgIHR4dDogc3RyaW5nLFxyXG4gICAgICAgIGRlc2NyaXB0aW9uOiBzdHJpbmcsXHJcbiAgICAgICAgeDogbnVtYmVyLFxyXG4gICAgICAgIHk6IG51bWJlcixcclxuICAgICAgICB3OiBudW1iZXIsXHJcbiAgICAgICAgaDogbnVtYmVyLFxyXG4gICAgICAgIG9uUHJlc3NlZEN1c3RvbTogRnVuY3Rpb24pIHtcclxuICAgICAgICB0aGlzLmZvbnQgPSBmb250O1xyXG4gICAgICAgIHRoaXMudHh0ID0gdHh0XHJcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uXHJcbiAgICAgICAgdGhpcy5vblByZXNzZWRDdXN0b20gPSBvblByZXNzZWRDdXN0b21cclxuICAgICAgICB0aGlzLnggPSB4XHJcbiAgICAgICAgdGhpcy55ID0geVxyXG4gICAgICAgIHRoaXMudyA9IHdcclxuICAgICAgICB0aGlzLmggPSBoXHJcbiAgICAgICAgdGhpcy5pbWFnZSA9IFVpQXNzZXRzLmJ1dHRvbl91bnNlbGVjdGVkO1xyXG4gICAgICAgIHRoaXMubW91c2VJc092ZXIgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIodGFyZ2V0OiBwNSwgdXBzY2FsZVNpemU6IG51bWJlcikge1xyXG4gICAgICAgIC8vIHNldCB0aGUgY29vcmRzIGFuZCBkaW1lbnNpb25zIHRvIHJvdW5kIHRvIHRoZSBuZWFyZXN0IHVuLXVwc2NhbGVkIHBpeGVsXHJcbiAgICAgICAgY29uc3QgeCA9IE1hdGgucm91bmQodGhpcy54IC8gdXBzY2FsZVNpemUpICogdXBzY2FsZVNpemU7XHJcbiAgICAgICAgY29uc3QgeSA9IE1hdGgucm91bmQodGhpcy55IC8gdXBzY2FsZVNpemUpICogdXBzY2FsZVNpemU7XHJcbiAgICAgICAgY29uc3QgdyA9IE1hdGgucm91bmQodGhpcy53IC8gdXBzY2FsZVNpemUpICogdXBzY2FsZVNpemU7XHJcbiAgICAgICAgY29uc3QgaCA9IE1hdGgucm91bmQodGhpcy5oIC8gdXBzY2FsZVNpemUpICogdXBzY2FsZVNpemU7XHJcblxyXG4gICAgICAgIC8vIGNvcm5lcnNcclxuICAgICAgICB0aGlzLmltYWdlLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4LCB5LCA3ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgMCwgMCwgNywgNyk7XHJcbiAgICAgICAgdGhpcy5pbWFnZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCArIHcgLSA3ICogdXBzY2FsZVNpemUsIHksIDcgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCA4LCAwLCA3LCA3KTtcclxuICAgICAgICB0aGlzLmltYWdlLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4LCB5ICsgaCAtIDcgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCA3ICogdXBzY2FsZVNpemUsIDAsIDgsIDcsIDcpO1xyXG4gICAgICAgIHRoaXMuaW1hZ2UucmVuZGVyUGFydGlhbCh0YXJnZXQsIHggKyB3IC0gNyAqIHVwc2NhbGVTaXplLCB5ICsgaCAtIDcgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCA3ICogdXBzY2FsZVNpemUsIDgsIDgsIDcsIDcpO1xyXG5cclxuICAgICAgICAvLyB0b3AgYW5kIGJvdHRvbVxyXG4gICAgICAgIHRoaXMuaW1hZ2UucmVuZGVyUGFydGlhbCh0YXJnZXQsIHggKyA3ICogdXBzY2FsZVNpemUsIHksIHcgLSAxNCAqIHVwc2NhbGVTaXplLCA3ICogdXBzY2FsZVNpemUsIDcsIDAsIDEsIDcpO1xyXG4gICAgICAgIHRoaXMuaW1hZ2UucmVuZGVyUGFydGlhbCh0YXJnZXQsIHggKyA3ICogdXBzY2FsZVNpemUsIHkgKyBoIC0gNyAqIHVwc2NhbGVTaXplLCB3IC0gMTQgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCA3LCA4LCAxLCA3KTtcclxuXHJcbiAgICAgICAgLy8gbGVmdCBhbmQgcmlnaHRcclxuICAgICAgICB0aGlzLmltYWdlLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4LCB5ICsgNyAqIHVwc2NhbGVTaXplLCA3ICogdXBzY2FsZVNpemUsIGggLSAxNCAqIHVwc2NhbGVTaXplLCAwLCA3LCA3LCAxKTtcclxuICAgICAgICB0aGlzLmltYWdlLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4ICsgdyAtIDcgKiB1cHNjYWxlU2l6ZSwgeSArIDcgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCBoIC0gMTQgKiB1cHNjYWxlU2l6ZSwgOCwgNywgNywgMSk7XHJcblxyXG4gICAgICAgIC8vIGNlbnRlclxyXG4gICAgICAgIHRoaXMuaW1hZ2UucmVuZGVyUGFydGlhbCh0YXJnZXQsIHggKyA3ICogdXBzY2FsZVNpemUsIHkgKyA3ICogdXBzY2FsZVNpemUsIHcgLSAxNCAqIHVwc2NhbGVTaXplLCBoIC0gMTQgKiB1cHNjYWxlU2l6ZSwgNywgNywgMSwgMSk7XHJcblxyXG4gICAgICAgIHRoaXMuZm9udC5kcmF3VGV4dCh0YXJnZXQsIHRoaXMudHh0LCB4ICsgNiAqIHVwc2NhbGVTaXplLCBNYXRoLnJvdW5kKCh0aGlzLnkgKyB0aGlzLmggLyAyKSAvIHVwc2NhbGVTaXplKSAqIHVwc2NhbGVTaXplIC0gNiAqIHVwc2NhbGVTaXplKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVNb3VzZU92ZXIobW91c2VYOiBudW1iZXIsIG1vdXNlWTogbnVtYmVyKSB7XHJcbiAgICAgICAgLy8gaWYgdGhlIG1vdXNlIHBvc2l0aW9uIGlzIGluc2lkZSB0aGUgYnV0dG9uLCByZXR1cm4gdHJ1ZVxyXG4gICAgICAgIGlmIChtb3VzZVggPiB0aGlzLnggJiYgbW91c2VYIDwgdGhpcy54ICsgdGhpcy53ICYmIG1vdXNlWSA+IHRoaXMueSAmJiBtb3VzZVkgPCB0aGlzLnkgKyB0aGlzLmgpIHtcclxuICAgICAgICAgICAgdGhpcy5tb3VzZUlzT3ZlciA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2UgPSBVaUFzc2V0cy5idXR0b25fc2VsZWN0ZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLm1vdXNlSXNPdmVyID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2UgPSBVaUFzc2V0cy5idXR0b25fdW5zZWxlY3RlZDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb25QcmVzc2VkKCkge1xyXG4gICAgICAgIHRoaXMub25QcmVzc2VkQ3VzdG9tKCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJidXR0b24gcHJlc3NlZFwiKTtcclxuICAgICAgICAvL0F1ZGlvQXNzZXRzLnVpLmludmVudG9yeUNsYWNrLnBsYXlSYW5kb20oKTtcclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgeyBSZW5kZXJhYmxlIH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9SZW5kZXJhYmxlJztcclxuaW1wb3J0IHA1IGZyb20gJ3A1JztcclxuaW1wb3J0IHsgS2V5cywgVWlBc3NldHMgfSBmcm9tICcuLi9hc3NldHMvQXNzZXRzJztcclxuaW1wb3J0IHsgSW1hZ2VSZXNvdXJjZSB9IGZyb20gJy4uL2Fzc2V0cy9yZXNvdXJjZXMvSW1hZ2VSZXNvdXJjZSc7XHJcbmltcG9ydCB7IEZvbnRSZXNvdXJjZSB9IGZyb20gJy4uL2Fzc2V0cy9yZXNvdXJjZXMvRm9udFJlc291cmNlJztcclxuXHJcbmV4cG9ydCBjbGFzcyBJbnB1dEJveCBpbXBsZW1lbnRzIFJlbmRlcmFibGUge1xyXG5cclxuICAgIGZvbnQ6IEZvbnRSZXNvdXJjZVxyXG4gICAgdHh0OiBzdHJpbmdcclxuICAgIHZhbHVlOiBudW1iZXJcclxuICAgIGtleWJvYXJkOiBib29sZWFuXHJcbiAgICBpbmRleDogbnVtYmVyXHJcbiAgICB4OiBudW1iZXJcclxuICAgIHk6IG51bWJlclxyXG4gICAgdzogbnVtYmVyXHJcbiAgICBoOiBudW1iZXJcclxuICAgIGltYWdlOiBJbWFnZVJlc291cmNlXHJcbiAgICBtb3VzZUlzT3ZlcjogYm9vbGVhblxyXG4gICAgbGlzdGVuaW5nOiBib29sZWFuXHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgZm9udDogRm9udFJlc291cmNlLFxyXG4gICAgICAgIHR4dDogc3RyaW5nLFxyXG4gICAgICAgIGtleWJvYXJkOiBib29sZWFuLFxyXG4gICAgICAgIHZhbHVlOiBudW1iZXIsXHJcbiAgICAgICAgaW5kZXg6IG51bWJlciwvLyB0aGUgaW5kZXggaW4gdGhlIEdhbWUuY29udHJvbHMgYXJyYXkgdGhhdCBpdCBjaGFuZ2VzXHJcbiAgICAgICAgeDogbnVtYmVyLFxyXG4gICAgICAgIHk6IG51bWJlcixcclxuICAgICAgICB3OiBudW1iZXIsXHJcbiAgICAgICAgaDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5mb250ID0gZm9udDtcclxuICAgICAgICB0aGlzLnR4dCA9IHR4dFxyXG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLmtleWJvYXJkID0ga2V5Ym9hcmQ7XHJcbiAgICAgICAgdGhpcy5pbmRleCA9IGluZGV4O1xyXG4gICAgICAgIHRoaXMueCA9IHhcclxuICAgICAgICB0aGlzLnkgPSB5XHJcbiAgICAgICAgdGhpcy53ID0gd1xyXG4gICAgICAgIHRoaXMuaCA9IGhcclxuICAgICAgICB0aGlzLmltYWdlID0gVWlBc3NldHMuYnV0dG9uX3Vuc2VsZWN0ZWQ7XHJcbiAgICAgICAgdGhpcy5tb3VzZUlzT3ZlciA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMubGlzdGVuaW5nID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKHRhcmdldDogcDUsIHVwc2NhbGVTaXplOiBudW1iZXIpIHtcclxuICAgICAgICAvLyBzZXQgdGhlIGNvb3JkcyBhbmQgZGltZW5zaW9ucyB0byByb3VuZCB0byB0aGUgbmVhcmVzdCB1bi11cHNjYWxlZCBwaXhlbFxyXG4gICAgICAgIGNvbnN0IHggPSBNYXRoLnJvdW5kKHRoaXMueCAvIHVwc2NhbGVTaXplKSAqIHVwc2NhbGVTaXplO1xyXG4gICAgICAgIGNvbnN0IHkgPSBNYXRoLnJvdW5kKHRoaXMueSAvIHVwc2NhbGVTaXplKSAqIHVwc2NhbGVTaXplO1xyXG4gICAgICAgIGNvbnN0IHcgPSBNYXRoLnJvdW5kKHRoaXMudyAvIHVwc2NhbGVTaXplKSAqIHVwc2NhbGVTaXplO1xyXG4gICAgICAgIGNvbnN0IGggPSBNYXRoLnJvdW5kKHRoaXMuaCAvIHVwc2NhbGVTaXplKSAqIHVwc2NhbGVTaXplO1xyXG5cclxuICAgICAgICAvLyBjb3JuZXJzXHJcbiAgICAgICAgdGhpcy5pbWFnZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCwgeSwgNyAqIHVwc2NhbGVTaXplLCA3ICogdXBzY2FsZVNpemUsIDAsIDAsIDcsIDcpO1xyXG4gICAgICAgIHRoaXMuaW1hZ2UucmVuZGVyUGFydGlhbCh0YXJnZXQsIHggKyB3IC0gNyAqIHVwc2NhbGVTaXplLCB5LCA3ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgOCwgMCwgNywgNyk7XHJcbiAgICAgICAgdGhpcy5pbWFnZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCwgeSArIGggLSA3ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCAwLCA4LCA3LCA3KTtcclxuICAgICAgICB0aGlzLmltYWdlLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4ICsgdyAtIDcgKiB1cHNjYWxlU2l6ZSwgeSArIGggLSA3ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCA4LCA4LCA3LCA3KTtcclxuXHJcbiAgICAgICAgLy8gdG9wIGFuZCBib3R0b21cclxuICAgICAgICB0aGlzLmltYWdlLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4ICsgNyAqIHVwc2NhbGVTaXplLCB5LCB3IC0gMTQgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCA3LCAwLCAxLCA3KTtcclxuICAgICAgICB0aGlzLmltYWdlLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4ICsgNyAqIHVwc2NhbGVTaXplLCB5ICsgaCAtIDcgKiB1cHNjYWxlU2l6ZSwgdyAtIDE0ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgNywgOCwgMSwgNyk7XHJcblxyXG4gICAgICAgIC8vIGxlZnQgYW5kIHJpZ2h0XHJcbiAgICAgICAgdGhpcy5pbWFnZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCwgeSArIDcgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCBoIC0gMTQgKiB1cHNjYWxlU2l6ZSwgMCwgNywgNywgMSk7XHJcbiAgICAgICAgdGhpcy5pbWFnZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCArIHcgLSA3ICogdXBzY2FsZVNpemUsIHkgKyA3ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgaCAtIDE0ICogdXBzY2FsZVNpemUsIDgsIDcsIDcsIDEpO1xyXG5cclxuICAgICAgICAvLyBjZW50ZXJcclxuICAgICAgICB0aGlzLmltYWdlLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4ICsgNyAqIHVwc2NhbGVTaXplLCB5ICsgNyAqIHVwc2NhbGVTaXplLCB3IC0gMTQgKiB1cHNjYWxlU2l6ZSwgaCAtIDE0ICogdXBzY2FsZVNpemUsIDcsIDcsIDEsIDEpO1xyXG5cclxuICAgICAgICBpZih0aGlzLmxpc3RlbmluZykge1xyXG4gICAgICAgICAgICB0aGlzLmZvbnQuZHJhd1RleHQodGFyZ2V0LCB0aGlzLnR4dCtcIjogY2xpY2sgdG8gY2FuY2VsXCIsIHggKyA2ICogdXBzY2FsZVNpemUsIE1hdGgucm91bmQoKHRoaXMueSArIHRoaXMuaCAvIDIpIC8gdXBzY2FsZVNpemUpICogdXBzY2FsZVNpemUgLSA2ICogdXBzY2FsZVNpemUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYodGhpcy5rZXlib2FyZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mb250LmRyYXdUZXh0KHRhcmdldCwgdGhpcy50eHQrXCI6ICAgXCIrS2V5cy5rZXlib2FyZE1hcFt0aGlzLnZhbHVlXSwgeCArIDYgKiB1cHNjYWxlU2l6ZSwgTWF0aC5yb3VuZCgodGhpcy55ICsgdGhpcy5oIC8gMikgLyB1cHNjYWxlU2l6ZSkgKiB1cHNjYWxlU2l6ZSAtIDYgKiB1cHNjYWxlU2l6ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZvbnQuZHJhd1RleHQodGFyZ2V0LCB0aGlzLnR4dCtcIjogICBNb3VzZSBcIit0aGlzLnZhbHVlLCB4ICsgNiAqIHVwc2NhbGVTaXplLCBNYXRoLnJvdW5kKCh0aGlzLnkgKyB0aGlzLmggLyAyKSAvIHVwc2NhbGVTaXplKSAqIHVwc2NhbGVTaXplIC0gNiAqIHVwc2NhbGVTaXplKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVNb3VzZU92ZXIobW91c2VYOiBudW1iZXIsIG1vdXNlWTogbnVtYmVyKSB7XHJcbiAgICAgICAgLy8gaWYgdGhlIG1vdXNlIHBvc2l0aW9uIGlzIGluc2lkZSB0aGUgYnV0dG9uLCByZXR1cm4gdHJ1ZVxyXG4gICAgICAgIGlmIChtb3VzZVggPiB0aGlzLnggJiYgbW91c2VYIDwgdGhpcy54ICsgdGhpcy53ICYmIG1vdXNlWSA+IHRoaXMueSAmJiBtb3VzZVkgPCB0aGlzLnkgKyB0aGlzLmgpIHtcclxuICAgICAgICAgICAgdGhpcy5tb3VzZUlzT3ZlciA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLm1vdXNlSXNPdmVyID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9uUHJlc3NlZCgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImlucHV0IGJveCBwcmVzc2VkXCIpO1xyXG4gICAgICAgIHRoaXMubGlzdGVuaW5nID0gIXRoaXMubGlzdGVuaW5nO1xyXG4gICAgICAgIGlmKHRoaXMubGlzdGVuaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2UgPSBVaUFzc2V0cy5idXR0b25fc2VsZWN0ZWQ7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5pbWFnZSA9IFVpQXNzZXRzLmJ1dHRvbl91bnNlbGVjdGVkO1xyXG4gICAgICAgIC8vIEF1ZGlvQXNzZXRzLnVpLmludmVudG9yeUNsYWNrLnBsYXlSYW5kb20oKTtcclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgcDUgZnJvbSAncDUnO1xyXG5pbXBvcnQgeyBSZW5kZXJhYmxlIH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9SZW5kZXJhYmxlJztcclxuaW1wb3J0IHsgVWlBc3NldHMgfSBmcm9tICcuLi9hc3NldHMvQXNzZXRzJztcclxuaW1wb3J0IHsgRm9udFJlc291cmNlIH0gZnJvbSAnLi4vYXNzZXRzL3Jlc291cmNlcy9Gb250UmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBnYW1lIH0gZnJvbSAnLi4vR2FtZSc7XHJcblxyXG5leHBvcnQgY2xhc3MgU2xpZGVyIGltcGxlbWVudHMgUmVuZGVyYWJsZSB7XHJcblxyXG4gICAgdmFsdWU6IG51bWJlclxyXG4gICAgbWluOiBudW1iZXJcclxuICAgIG1heDogbnVtYmVyXHJcbiAgICBzdGVwOiBudW1iZXJcclxuICAgIG9uQ2hhbmdlZDogRnVuY3Rpb25cclxuICAgIHg6IG51bWJlclxyXG4gICAgeTogbnVtYmVyXHJcbiAgICB3OiBudW1iZXJcclxuICAgIGg6IG51bWJlclxyXG4gICAgYmVpbmdFZGl0ZWQ6IGJvb2xlYW5cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBmb250OiBGb250UmVzb3VyY2UsXHJcbiAgICAgICAgdHh0OiBzdHJpbmcsXHJcbiAgICAgICAgdmFsdWU6bnVtYmVyLFxyXG4gICAgICAgIG1pbjogbnVtYmVyLFxyXG4gICAgICAgIG1heDogbnVtYmVyLFxyXG4gICAgICAgIHN0ZXA6IG51bWJlcixcclxuICAgICAgICB4OiBudW1iZXIsXHJcbiAgICAgICAgeTogbnVtYmVyLFxyXG4gICAgICAgIHc6IG51bWJlcixcclxuICAgICAgICBoOiBudW1iZXIsXHJcbiAgICAgICAgb25DaGFuZ2VkOiBGdW5jdGlvbikge1xyXG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZVxyXG4gICAgICAgIHRoaXMubWluID0gbWluXHJcbiAgICAgICAgdGhpcy5tYXggPSBtYXhcclxuICAgICAgICB0aGlzLnN0ZXAgPSBzdGVwXHJcbiAgICAgICAgdGhpcy5vbkNoYW5nZWQgPSBvbkNoYW5nZWRcclxuICAgICAgICB0aGlzLnggPSB4XHJcbiAgICAgICAgdGhpcy55ID0geVxyXG4gICAgICAgIHRoaXMudyA9IHdcclxuICAgICAgICB0aGlzLmggPSBoXHJcbiAgICAgICAgdGhpcy5iZWluZ0VkaXRlZCA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcih0YXJnZXQ6IHA1LCB1cHNjYWxlU2l6ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgLy8gc2V0IHRoZSBjb29yZHMgYW5kIGRpbWVuc2lvbnMgdG8gcm91bmQgdG8gdGhlIG5lYXJlc3QgdW4tdXBzY2FsZWQgcGl4ZWxcclxuICAgICAgICBjb25zdCB4ID0gTWF0aC5yb3VuZCh0aGlzLngvdXBzY2FsZVNpemUpKnVwc2NhbGVTaXplO1xyXG4gICAgICAgIGNvbnN0IHkgPSBNYXRoLnJvdW5kKCh0aGlzLnkrdGhpcy5oLzIpL3Vwc2NhbGVTaXplKSp1cHNjYWxlU2l6ZTtcclxuICAgICAgICBjb25zdCB3ID0gTWF0aC5yb3VuZCh0aGlzLncvdXBzY2FsZVNpemUpKnVwc2NhbGVTaXplO1xyXG5cclxuICAgICAgICAvLyBsZWZ0IHNpZGUgb2Ygc2xpZGVyIGJhclxyXG4gICAgICAgIFVpQXNzZXRzLnNsaWRlcl9iYXIucmVuZGVyUGFydGlhbCh0YXJnZXQsIHgsIHktMip1cHNjYWxlU2l6ZSwgMip1cHNjYWxlU2l6ZSwgNCp1cHNjYWxlU2l6ZSwgMCwgMCwgMiwgNCk7XHJcbiAgICAgICAgLy8gcmlnaHQgc2lkZSBvZiBzbGlkZXIgYmFyXHJcbiAgICAgICAgVWlBc3NldHMuc2xpZGVyX2Jhci5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCt3LTIqdXBzY2FsZVNpemUsIHktMip1cHNjYWxlU2l6ZSwgMip1cHNjYWxlU2l6ZSwgNCp1cHNjYWxlU2l6ZSwgMywgMCwgMiwgNCk7XHJcbiAgICAgICAgLy8gY2VudGVyIG9mIHNsaWRlciBiYXJcclxuICAgICAgICBVaUFzc2V0cy5zbGlkZXJfYmFyLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4KzIqdXBzY2FsZVNpemUsIHktMip1cHNjYWxlU2l6ZSwgdy00KnVwc2NhbGVTaXplLCA0KnVwc2NhbGVTaXplLCAyLCAwLCAxLCA0KTtcclxuICAgICAgICAvLyBoYW5kbGVcclxuICAgICAgICBVaUFzc2V0cy5zbGlkZXJfaGFuZGxlLnJlbmRlcih0YXJnZXQsIHgrTWF0aC5yb3VuZCgodGhpcy52YWx1ZS10aGlzLm1pbikvKHRoaXMubWF4LXRoaXMubWluKSoody04KnVwc2NhbGVTaXplKS91cHNjYWxlU2l6ZSkqdXBzY2FsZVNpemUsIHktNCp1cHNjYWxlU2l6ZSwgOCp1cHNjYWxlU2l6ZSwgOSp1cHNjYWxlU2l6ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlU2xpZGVyUG9zaXRpb24obW91c2VYOiBudW1iZXIpIHtcclxuICAgICAgICBpZih0aGlzLmJlaW5nRWRpdGVkKXtcclxuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IE1hdGgubWF4KHRoaXMubWluLCBNYXRoLm1pbih0aGlzLm1heCwgTWF0aC5yb3VuZCgodGhpcy5taW4rKHRoaXMubWF4LXRoaXMubWluKSooKChtb3VzZVgtdGhpcy54LTQqZ2FtZS51cHNjYWxlU2l6ZSkgLyAodGhpcy53LSg4KmdhbWUudXBzY2FsZVNpemUpKSkpKS90aGlzLnN0ZXApKnRoaXMuc3RlcCkpO1xyXG4gICAgICAgICAgICB0aGlzLm9uQ2hhbmdlZCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgeyBSZW5kZXJhYmxlIH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9SZW5kZXJhYmxlJztcclxuaW1wb3J0IHA1IGZyb20gJ3A1JztcclxuaW1wb3J0IHsgVWlBc3NldHMgfSBmcm9tICcuLi9hc3NldHMvQXNzZXRzJztcclxuXHJcbmV4cG9ydCBjbGFzcyBVaUZyYW1lIGltcGxlbWVudHMgUmVuZGVyYWJsZSB7XHJcblxyXG4gICAgeDogbnVtYmVyXHJcbiAgICB5OiBudW1iZXJcclxuICAgIHc6IG51bWJlclxyXG4gICAgaDogbnVtYmVyXHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgeDogbnVtYmVyLFxyXG4gICAgICAgIHk6IG51bWJlcixcclxuICAgICAgICB3OiBudW1iZXIsXHJcbiAgICAgICAgaDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy54ID0geFxyXG4gICAgICAgIHRoaXMueSA9IHlcclxuICAgICAgICB0aGlzLncgPSB3XHJcbiAgICAgICAgdGhpcy5oID0gaFxyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcih0YXJnZXQ6IHA1LCB1cHNjYWxlU2l6ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgLy8gc2V0IHRoZSBjb29yZHMgYW5kIGRpbWVuc2lvbnMgdG8gcm91bmQgdG8gdGhlIG5lYXJlc3QgdW4tdXBzY2FsZWQgcGl4ZWxcclxuICAgICAgICBjb25zdCB4ID0gTWF0aC5yb3VuZCh0aGlzLngvdXBzY2FsZVNpemUpKnVwc2NhbGVTaXplO1xyXG4gICAgICAgIGNvbnN0IHkgPSBNYXRoLnJvdW5kKHRoaXMueS91cHNjYWxlU2l6ZSkqdXBzY2FsZVNpemU7XHJcbiAgICAgICAgY29uc3QgdyA9IE1hdGgucm91bmQodGhpcy53L3Vwc2NhbGVTaXplKSp1cHNjYWxlU2l6ZTtcclxuICAgICAgICBjb25zdCBoID0gTWF0aC5yb3VuZCh0aGlzLmgvdXBzY2FsZVNpemUpKnVwc2NhbGVTaXplO1xyXG5cclxuICAgICAgICAvLyBjb3JuZXJzXHJcbiAgICAgICAgVWlBc3NldHMudWlfZnJhbWUucmVuZGVyUGFydGlhbCh0YXJnZXQsIHgsIHksIDcqdXBzY2FsZVNpemUsIDcqdXBzY2FsZVNpemUsIDAsIDAsIDcsIDcpO1xyXG4gICAgICAgIFVpQXNzZXRzLnVpX2ZyYW1lLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4K3ctNyp1cHNjYWxlU2l6ZSwgeSwgNyp1cHNjYWxlU2l6ZSwgNyp1cHNjYWxlU2l6ZSwgOCwgMCwgNywgNyk7XHJcbiAgICAgICAgVWlBc3NldHMudWlfZnJhbWUucmVuZGVyUGFydGlhbCh0YXJnZXQsIHgsIHkraC03KnVwc2NhbGVTaXplLCA3KnVwc2NhbGVTaXplLCA3KnVwc2NhbGVTaXplLCAwLCA4LCA3LCA3KTtcclxuICAgICAgICBVaUFzc2V0cy51aV9mcmFtZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCt3LTcqdXBzY2FsZVNpemUsIHkraC03KnVwc2NhbGVTaXplLCA3KnVwc2NhbGVTaXplLCA3KnVwc2NhbGVTaXplLCA4LCA4LCA3LCA3KTtcclxuXHJcbiAgICAgICAgLy8gdG9wIGFuZCBib3R0b21cclxuICAgICAgICBVaUFzc2V0cy51aV9mcmFtZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCs3KnVwc2NhbGVTaXplLCB5LCB3LTE0KnVwc2NhbGVTaXplLCA3KnVwc2NhbGVTaXplLCA3LCAwLCAxLCA3KTtcclxuICAgICAgICBVaUFzc2V0cy51aV9mcmFtZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCs3KnVwc2NhbGVTaXplLCB5K2gtNyp1cHNjYWxlU2l6ZSwgdy0xNCp1cHNjYWxlU2l6ZSwgNyp1cHNjYWxlU2l6ZSwgNywgOCwgMSwgNyk7XHJcblxyXG4gICAgICAgIC8vIGxlZnQgYW5kIHJpZ2h0XHJcbiAgICAgICAgVWlBc3NldHMudWlfZnJhbWUucmVuZGVyUGFydGlhbCh0YXJnZXQsIHgsIHkrNyp1cHNjYWxlU2l6ZSwgNyp1cHNjYWxlU2l6ZSwgaC0xNCp1cHNjYWxlU2l6ZSwgMCwgNywgNywgMSk7XHJcbiAgICAgICAgVWlBc3NldHMudWlfZnJhbWUucmVuZGVyUGFydGlhbCh0YXJnZXQsIHgrdy03KnVwc2NhbGVTaXplLCB5KzcqdXBzY2FsZVNpemUsIDcqdXBzY2FsZVNpemUsIGgtMTQqdXBzY2FsZVNpemUsIDgsIDcsIDcsIDEpO1xyXG5cclxuICAgICAgICAvLyBjZW50ZXJcclxuICAgICAgICBVaUFzc2V0cy51aV9mcmFtZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCs3KnVwc2NhbGVTaXplLCB5KzcqdXBzY2FsZVNpemUsIHctMTQqdXBzY2FsZVNpemUsIGgtMTQqdXBzY2FsZVNpemUsIDcsIDcsIDEsIDEpO1xyXG5cclxuICAgIH1cclxufSIsImltcG9ydCB7IFJlbmRlcmFibGUgfSBmcm9tICcuLi9pbnRlcmZhY2VzL1JlbmRlcmFibGUnO1xyXG5pbXBvcnQgcDUgZnJvbSAncDUnO1xyXG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tICcuL0J1dHRvbic7XHJcbmltcG9ydCB7IFNsaWRlciB9IGZyb20gJy4vU2xpZGVyJztcclxuaW1wb3J0IHsgVWlGcmFtZSB9IGZyb20gJy4vVWlGcmFtZSc7XHJcbmltcG9ydCB7IGdhbWUgfSBmcm9tICcuLi9HYW1lJztcclxuaW1wb3J0IHsgSW5wdXRCb3ggfSBmcm9tICcuL0lucHV0Qm94JztcclxuaW1wb3J0IHsgVWlBc3NldHMgfSBmcm9tICcuLi9hc3NldHMvQXNzZXRzJztcclxuaW1wb3J0IHsgRm9udFJlc291cmNlIH0gZnJvbSAnLi4vYXNzZXRzL3Jlc291cmNlcy9Gb250UmVzb3VyY2UnO1xyXG5cclxuXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBVaVNjcmVlbiBpbXBsZW1lbnRzIFJlbmRlcmFibGUge1xyXG5cclxuICAgIGJ1dHRvbnM6IEJ1dHRvbltdO1xyXG4gICAgc2xpZGVyczogU2xpZGVyW107XHJcbiAgICBpbnB1dEJveGVzOiBJbnB1dEJveFtdO1xyXG4gICAgc2Nyb2xsPzogbnVtYmVyO1xyXG4gICAgbWluU2Nyb2xsOiBudW1iZXIgPSAwO1xyXG4gICAgbWF4U2Nyb2xsOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIGZyYW1lOiBVaUZyYW1lXHJcblxyXG5cclxuICAgIHRpdGxlRm9udDogRm9udFJlc291cmNlXHJcblxyXG4gICAgYWJzdHJhY3QgcmVuZGVyKHRhcmdldDogcDUsIHVwc2NhbGVTaXplOiBudW1iZXIpOiB2b2lkO1xyXG5cclxuICAgIGFic3RyYWN0IHdpbmRvd1VwZGF0ZSgpOiB2b2lkXHJcblxyXG4gICAgbW91c2VQcmVzc2VkKGJ0bjogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYodGhpcy5idXR0b25zICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgLy8gbG9vcCB0aHJvdWdoIGFsbCB0aGUgYnV0dG9ucyBpbiB0aGlzIG1lbnUgYW5kIGlmIHRoZSBtb3VzZSBpcyBvdmVyIHRoZW0sIHRoZW4gY2FsbCB0aGUgYnV0dG9uJ3Mgb25QcmVzc2VkKCkgZnVuY3Rpb24uICBUaGUgb25QcmVzc2VkKCkgZnVuY3Rpb24gaXMgcGFzc2VkIGluIHRocm91Z2ggdGhlIGNvbnN0cnVjdG9yLlxyXG4gICAgICAgICAgICBmb3IoY29uc3QgaSBvZiB0aGlzLmJ1dHRvbnMpIHtcclxuICAgICAgICAgICAgICAgIGlmKGkubW91c2VJc092ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBpLm9uUHJlc3NlZCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLnNsaWRlcnMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAvLyBsb29wIHRocm91Z2ggYWxsIHRoZSBzbGlkZXJzIGFuZCBpbnRlcmFjdCB3aXRoIHRoZW0gYWNjb3JkaW5nbHlcclxuICAgICAgICAgICAgZm9yKGNvbnN0IGkgb2YgdGhpcy5zbGlkZXJzKSB7XHJcbiAgICAgICAgICAgICAgICBpLnVwZGF0ZVNsaWRlclBvc2l0aW9uKGdhbWUubW91c2VYKTtcclxuICAgICAgICAgICAgICAgIGlmKGdhbWUubW91c2VYPmkueCAmJiBnYW1lLm1vdXNlWDxpLngraS53ICYmIGdhbWUubW91c2VZPmkueSAmJiBnYW1lLm1vdXNlWTxpLnkraS5oKVxyXG4gICAgICAgICAgICAgICAgICAgIGkuYmVpbmdFZGl0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMuaW5wdXRCb3hlcyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2codGhpcy5pbnB1dEJveGVzKTtcclxuICAgICAgICAgICAgLy8gbG9vcCB0aHJvdWdoIGFsbCB0aGUgaW5wdXQgYm94ZXMgYW5kIGludGVyYWN0IHdpdGggdGhlbSBhY2NvcmRpbmdseVxyXG4gICAgICAgICAgICBmb3IoY29uc3QgaSBvZiB0aGlzLmlucHV0Qm94ZXMpIHtcclxuICAgICAgICAgICAgICAgIGlmKGkubW91c2VJc092ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBpLm9uUHJlc3NlZCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZihpLmxpc3RlbmluZykge1xyXG4gICAgICAgICAgICAgICAgICAgIGkubGlzdGVuaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS5jb250cm9sc1tpLmluZGV4XS5rZXlDb2RlID0gYnRuO1xyXG4gICAgICAgICAgICAgICAgICAgIGdhbWUuY29udHJvbHNbaS5pbmRleF0ua2V5Ym9hcmQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBpLnZhbHVlID0gYnRuO1xyXG4gICAgICAgICAgICAgICAgICAgIGkua2V5Ym9hcmQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBpLmltYWdlID0gVWlBc3NldHMuYnV0dG9uX3Vuc2VsZWN0ZWQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbW91c2VSZWxlYXNlZCgpIHtcclxuICAgICAgICBpZih0aGlzLnNsaWRlcnMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAvLyBsb29wIHRocm91Z2ggYWxsIHRoZSBzbGlkZXJzIGFuZCBpbnRlcmFjdCB3aXRoIHRoZW0gYWNjb3JkaW5nbHlcclxuICAgICAgICAgICAgZm9yKGNvbnN0IGkgb2YgdGhpcy5zbGlkZXJzKSB7XHJcbiAgICAgICAgICAgICAgICBpLmJlaW5nRWRpdGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IHsgVWlTY3JlZW4gfSBmcm9tICcuLi9VaVNjcmVlbic7XHJcbmltcG9ydCBwNSBmcm9tICdwNSc7XHJcbmltcG9ydCB7IFVpRnJhbWUgfSBmcm9tICcuLi9VaUZyYW1lJztcclxuaW1wb3J0IHsgZ2FtZSB9IGZyb20gJy4uLy4uL0dhbWUnO1xyXG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tICcuLi9CdXR0b24nO1xyXG5pbXBvcnQgeyBGb250UmVzb3VyY2UgfSBmcm9tICcuLi8uLi9hc3NldHMvcmVzb3VyY2VzL0ZvbnRSZXNvdXJjZSc7XHJcbmltcG9ydCB7IE9wdGlvbnNNZW51IH0gZnJvbSAnLi9PcHRpb25zTWVudSc7XHJcbmltcG9ydCB7IElucHV0Qm94IH0gZnJvbSAnLi4vSW5wdXRCb3gnO1xyXG5pbXBvcnQgeyBDb250cm9sIH0gZnJvbSAnLi4vLi4vaW5wdXQvQ29udHJvbCdcclxuXHJcbmV4cG9ydCBjbGFzcyBDb250cm9sc01lbnUgZXh0ZW5kcyBVaVNjcmVlbiB7XHJcblxyXG5cdGNvbnN0cnVjdG9yKGZvbnQ6IEZvbnRSZXNvdXJjZSwgdGl0bGVGb250OiBGb250UmVzb3VyY2UpIHtcclxuXHRcdHN1cGVyKCk7XHJcblx0XHQvLyBtYWtlIHRoZSBmcmFtZSB3aXRoIHNvbWUgZGVmYXVsdCB2YWx1ZXMuICBUaGVzZSB3aWxsIGxhdGVyIGJlIGNoYW5nZWQgdG8gZml0IHRoZSBzY3JlZW4gc2l6ZS5cclxuXHRcdHRoaXMuZnJhbWUgPSBuZXcgVWlGcmFtZSgwLCAwLCAwLCAwKTtcclxuXHJcblx0XHQvLyBtYWtlIHNvbWUgYnV0dG9ucyB3aXRoIGRlZmF1bHQgcG9zaXRpb25zXHJcblx0XHR0aGlzLmJ1dHRvbnMgPSBbXHJcblx0XHRcdG5ldyBCdXR0b24oZm9udCwgXCJCYWNrXCIsIFwiUmV0dXJuIHRvIHRoZSBvcHRpb25zIG1lbnUuXCIsIDAsIDAsIDAsIDAsICgpID0+IHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhcIm9wdGlvbnMgbWVudVwiKTtcclxuXHRcdFx0XHRnYW1lLmN1cnJlbnRVaSA9IG5ldyBPcHRpb25zTWVudShmb250LCB0aXRsZUZvbnQpO1xyXG5cdFx0XHR9KVxyXG5cdFx0XTtcclxuXHJcblx0XHR0aGlzLmlucHV0Qm94ZXMgPSBbXHJcblx0XHRcdC8vIG5ldyBJbnB1dEJveChmb250LCBcIldhbGsgUmlnaHRcIiwgdHJ1ZSwgNjgsIDAsIDAsIDAsIDAsIDApLFxyXG5cdFx0XHQvLyBuZXcgSW5wdXRCb3goZm9udCwgXCJXYWxrIExlZnRcIiwgdHJ1ZSwgNjUsIDEsIDAsIDAsIDAsIDApLFxyXG5cdFx0XHQvLyBuZXcgSW5wdXRCb3goZm9udCwgXCJKdW1wXCIsIHRydWUsIDMyLCAyLCAwLCAwLCAwLCAwKSxcclxuXHRcdFx0Ly8gbmV3IElucHV0Qm94KGZvbnQsIFwiUGF1c2VcIiwgdHJ1ZSwgMjcsIDMsIDAsIDAsIDAsIDApXHJcblx0XHRdXHJcblxyXG5cdFx0bGV0IGkgPSAwO1xyXG5cdFx0Zm9yIChsZXQgY29udHJvbCBvZiBnYW1lLmNvbnRyb2xzKSB7XHJcblx0XHRcdGkrKztcclxuXHRcdFx0dGhpcy5pbnB1dEJveGVzLnB1c2gobmV3IElucHV0Qm94KGZvbnQsIGNvbnRyb2wuZGVzY3JpcHRpb24sIGNvbnRyb2wua2V5Ym9hcmQsIGNvbnRyb2wua2V5Q29kZSwgaSwgMCwgMCwgMCwgMCkpO1xyXG5cdFx0fVxyXG5cdFx0Ly8gdXBkYXRlIHRoZSBzaXplIG9mIHRoZSBlbGVtZW50cyBiYXNlZCBvbiB0aGUgaW5pdGlhbCBzY3JlZW4gc2l6ZVxyXG5cdFx0dGhpcy53aW5kb3dVcGRhdGUoKTtcclxuXHR9XHJcblxyXG5cdHJlbmRlcih0YXJnZXQ6IHA1LCB1cHNjYWxlU2l6ZTogbnVtYmVyKTogdm9pZCB7XHJcblxyXG5cdFx0Ly8gcmVuZGVyIHRoZSByZWN0YW5ndWxhciBpbWFnZVxyXG5cdFx0dGhpcy5mcmFtZS5yZW5kZXIodGFyZ2V0LCB1cHNjYWxlU2l6ZSk7XHJcblxyXG5cdFx0Ly8gbG9vcCB0aHJvdWdoIHRoZSBidXR0b25zIGFycmF5IGFuZCByZW5kZXIgZWFjaCBvbmUuXHJcblx0XHR0aGlzLmJ1dHRvbnMuZm9yRWFjaChidXR0b24gPT4ge1xyXG5cdFx0XHRidXR0b24ucmVuZGVyKHRhcmdldCwgdXBzY2FsZVNpemUpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0Ly8gbG9vcCB0aHJvdWdoIHRoZSBpbnB1dEJveGVzIGFycmF5IGFuZCByZW5kZXIgZWFjaCBvbmUuXHJcblx0XHR0aGlzLmlucHV0Qm94ZXMuZm9yRWFjaChpbnB1dEJveCA9PiB7XHJcblx0XHRcdGlucHV0Qm94LnJlbmRlcih0YXJnZXQsIHVwc2NhbGVTaXplKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0d2luZG93VXBkYXRlKCkge1xyXG5cdFx0Ly8gc2V0IHRoZSBwb3NpdGlvbiBvZiB0aGUgZnJhbWVcclxuXHRcdHRoaXMuZnJhbWUueCA9IGdhbWUud2lkdGggLyAyIC0gMjAwIC8gMiAqIGdhbWUudXBzY2FsZVNpemU7Ly8gY2VudGVyIHRoZSBmcmFtZSBpbiB0aGUgY2VudGVyIG9mIHRoZSBzY3JlZW5cclxuXHRcdHRoaXMuZnJhbWUueSA9IGdhbWUuaGVpZ2h0IC8gMiAtIDU2ICogZ2FtZS51cHNjYWxlU2l6ZTtcclxuXHRcdHRoaXMuZnJhbWUudyA9IDIwMCAqIGdhbWUudXBzY2FsZVNpemU7XHJcblx0XHR0aGlzLmZyYW1lLmggPSA0OCAqIGdhbWUudXBzY2FsZVNpemU7XHJcblx0fVxyXG59IiwiaW1wb3J0IHsgVWlTY3JlZW4gfSBmcm9tICcuLi9VaVNjcmVlbic7XHJcbmltcG9ydCBwNSBmcm9tICdwNSc7XHJcbmltcG9ydCB7IFVpRnJhbWUgfSBmcm9tICcuLi9VaUZyYW1lJztcclxuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSAnLi4vQnV0dG9uJztcclxuaW1wb3J0IHsgT3B0aW9uc01lbnUgfSBmcm9tICcuL09wdGlvbnNNZW51JztcclxuaW1wb3J0IHsgRm9udFJlc291cmNlIH0gZnJvbSAnLi4vLi4vYXNzZXRzL3Jlc291cmNlcy9Gb250UmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBVaUFzc2V0cyB9IGZyb20gJy4uLy4uL2Fzc2V0cy9Bc3NldHMnO1xyXG5pbXBvcnQgeyBXb3JsZENyZWF0aW9uTWVudSB9IGZyb20gJy4vV29ybGRDcmVhdGlvbk1lbnUnO1xyXG5pbXBvcnQgeyBnYW1lIH0gZnJvbSAnLi4vLi4vR2FtZSc7XHJcblxyXG5leHBvcnQgY2xhc3MgTWFpbk1lbnUgZXh0ZW5kcyBVaVNjcmVlbiB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZm9udDogRm9udFJlc291cmNlLCB0aXRsZUZvbnQ6IEZvbnRSZXNvdXJjZSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIC8vIG1ha2UgdGhlIGZyYW1lIHdpdGggc29tZSBkZWZhdWx0IHZhbHVlcy4gIFRoZXNlIHdpbGwgbGF0ZXIgYmUgY2hhbmdlZCB0byBmaXQgdGhlIHNjcmVlbiBzaXplLlxyXG4gICAgICAgIHRoaXMuZnJhbWUgPSBuZXcgVWlGcmFtZSgwLCAwLCAwLCAwKTtcclxuXHJcbiAgICAgICAgLy8gbWFrZSA0IGJ1dHRvbnMgd2l0aCBkZWZhdWx0IHBvc2l0aW9uc1xyXG4gICAgICAgIHRoaXMuYnV0dG9ucyA9IFtcclxuICAgICAgICAgICAgbmV3IEJ1dHRvbihmb250LCBcIlJlc3VtZSBHYW1lXCIsIFwiS2VlcCBwbGF5aW5nIHdoZXJlIHlvdSBsZWZ0IG9mZi5cIiwgMCwgMCwgMCwgMCwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJyZXN1bWUgZ2FtZVwiKTtcclxuICAgICAgICAgICAgICAgIGdhbWUuY3VycmVudFVpID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgbmV3IEJ1dHRvbihmb250LCBcIk5ldyBHYW1lXCIsIFwiQ3JlYXRlcyBhIG5ldyBzZXJ2ZXIgdGhhdCB5b3VyIGZyaWVuZHMgY2FuIGpvaW4uXCIsIDAsIDAsIDAsIDAsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibmV3IGdhbWVcIik7XHJcbiAgICAgICAgICAgICAgICBnYW1lLmN1cnJlbnRVaSA9IG5ldyBXb3JsZENyZWF0aW9uTWVudShmb250LCB0aXRsZUZvbnQpO1xyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgbmV3IEJ1dHRvbihmb250LCBcIkpvaW4gR2FtZVwiLCBcIkpvaW4gYSBnYW1lIHdpdGggeW91ciBmcmllbmRzLCBvciBtYWtlIG5ldyBvbmVzLlwiLCAwLCAwLCAwLCAwLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImpvaW4gZ2FtZVwiKTtcclxuICAgICAgICAgICAgICAgIGdhbWUuY3VycmVudFVpID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgbmV3IEJ1dHRvbihmb250LCBcIk9wdGlvbnNcIiwgXCJDaGFuZ2UgeW91ciBrZXliaW5kcywgcmVkdWNlIGxhZywgZXRjLlwiLCAwLCAwLCAwLCAwLCAoKSA9PntcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwib3B0aW9uc1wiKTtcclxuICAgICAgICAgICAgICAgIGdhbWUuY3VycmVudFVpID0gbmV3IE9wdGlvbnNNZW51KGZvbnQsIHRpdGxlRm9udCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgXTtcclxuXHJcbiAgICAgICAgLy8gdXBkYXRlIHRoZSBzaXplIG9mIHRoZSBlbGVtZW50cyBiYXNlZCBvbiB0aGUgaW5pdGlhbCBzY3JlZW4gc2l6ZVxyXG4gICAgICAgIHRoaXMud2luZG93VXBkYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKHRhcmdldDogcDUsIHVwc2NhbGVTaXplOiBudW1iZXIpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgLy8gcmVuZGVyIHRoZSByZWN0YW5ndWxhciBpbWFnZSB0aGF0IHRoZSB3aG9sZSBtZW51IGlzIG9uXHJcbiAgICAgICAgdGhpcy5mcmFtZS5yZW5kZXIodGFyZ2V0LCB1cHNjYWxlU2l6ZSk7XHJcblxyXG4gICAgICAgIFVpQXNzZXRzLnRpdGxlX2ltYWdlLnJlbmRlcih0YXJnZXQsIE1hdGgucm91bmQodGhpcy5mcmFtZS54L3Vwc2NhbGVTaXplKzEpKnVwc2NhbGVTaXplLCBNYXRoLnJvdW5kKHRoaXMuZnJhbWUueS91cHNjYWxlU2l6ZSs0KSp1cHNjYWxlU2l6ZSwgMjU2KnVwc2NhbGVTaXplLCA0MCp1cHNjYWxlU2l6ZSk7XHJcblxyXG4gICAgICAgIC8vIGxvb3AgdGhyb3VnaCB0aGUgYnV0dG9ucyBhcnJheSBhbmQgcmVuZGVyIGVhY2ggb25lLlxyXG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB0aGlzLmJ1dHRvbnMpIHtcclxuICAgICAgICAgICAgaXRlbS5yZW5kZXIodGFyZ2V0LCB1cHNjYWxlU2l6ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICB3aW5kb3dVcGRhdGUoKSB7XHJcbiAgICAgICAgLy8gc2V0IHRoZSBwb3NpdGlvbiBvZiB0aGUgZnJhbWVcclxuICAgICAgICB0aGlzLmZyYW1lLnggPSBnYW1lLndpZHRoLzItMjY0LzIqZ2FtZS51cHNjYWxlU2l6ZTsvLyBjZW50ZXIgdGhlIGZyYW1lIGluIHRoZSBtaWRkbGUgb2YgdGhlIHNjcmVlblxyXG4gICAgICAgIHRoaXMuZnJhbWUueSA9IGdhbWUuaGVpZ2h0LzItNTYqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICB0aGlzLmZyYW1lLncgPSAyNjQqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICB0aGlzLmZyYW1lLmggPSA0OCpnYW1lLnVwc2NhbGVTaXplO1xyXG5cclxuICAgICAgICAvLyBzZXQgdGhlIHBvc2l0aW9ucyBvZiBhbGwgdGhlIGJ1dHRvbnNcclxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpPDQ7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0ueCA9IGdhbWUud2lkdGgvMi0xOTIvMipnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0ueSA9IGdhbWUuaGVpZ2h0LzIrMjAqaSpnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0udyA9IDE5MipnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0uaCA9IDE2KmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS51cGRhdGVNb3VzZU92ZXIoZ2FtZS5tb3VzZVgsIGdhbWUubW91c2VZKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCB7IFVpU2NyZWVuIH0gZnJvbSAnLi4vVWlTY3JlZW4nO1xyXG5pbXBvcnQgcDUgZnJvbSAncDUnO1xyXG5pbXBvcnQgeyBVaUZyYW1lIH0gZnJvbSAnLi4vVWlGcmFtZSc7XHJcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gJy4uL0J1dHRvbic7XHJcbmltcG9ydCB7IEZvbnRSZXNvdXJjZSB9IGZyb20gJy4uLy4uL2Fzc2V0cy9yZXNvdXJjZXMvRm9udFJlc291cmNlJztcclxuaW1wb3J0IHsgTWFpbk1lbnUgfSBmcm9tICcuL01haW5NZW51JztcclxuaW1wb3J0IHsgVmlkZW9TZXR0aW5nc01lbnUgfSBmcm9tICcuL1ZpZGVvU2V0dGluZ3NNZW51JztcclxuaW1wb3J0IHsgQ29udHJvbHNNZW51IH0gZnJvbSAnLi9Db250cm9sc01lbnUnO1xyXG5pbXBvcnQgeyBnYW1lIH0gZnJvbSAnLi4vLi4vR2FtZSc7XHJcblxyXG5leHBvcnQgY2xhc3MgT3B0aW9uc01lbnUgZXh0ZW5kcyBVaVNjcmVlbiB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZm9udDogRm9udFJlc291cmNlLCB0aXRsZUZvbnQ6IEZvbnRSZXNvdXJjZSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgLy8gbWFrZSB0aGUgZnJhbWUgd2l0aCBzb21lIGRlZmF1bHQgdmFsdWVzLiAgVGhlc2Ugd2lsbCBsYXRlciBiZSBjaGFuZ2VkIHRvIGZpdCB0aGUgc2NyZWVuIHNpemUuXHJcbiAgICAgICAgdGhpcy5mcmFtZSA9IG5ldyBVaUZyYW1lKDAsIDAsIDAsIDApO1xyXG4gICAgICAgIHRoaXMudGl0bGVGb250ID0gdGl0bGVGb250O1xyXG4gICAgICAgIC8vIG1ha2Ugc29tZSBidXR0b25zIHdpdGggZGVmYXVsdCBwb3NpdGlvbnNcclxuICAgICAgICB0aGlzLmJ1dHRvbnMgPSBbXHJcbiAgICAgICAgICAgIG5ldyBCdXR0b24oZm9udCwgXCJWaWRlbyBTZXR0aW5nc1wiLCBcIkNoYW5nZSB0aGUgYmFsYW5jZSBiZXR3ZWVuIHBlcmZvcm1hbmNlIGFuZCBmaWRlbGl0eS5cIiwgMCwgMCwgMCwgMCwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ2aWRlbyBzZXR0aW5nc1wiKTtcclxuICAgICAgICAgICAgICAgIGdhbWUuY3VycmVudFVpID0gbmV3IFZpZGVvU2V0dGluZ3NNZW51KGZvbnQsIHRpdGxlRm9udCk7XHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBuZXcgQnV0dG9uKGZvbnQsIFwiQ29udHJvbHNcIiwgXCJDaGFuZ2UgeW91ciBrZXliaW5kcy5cIiwgMCwgMCwgMCwgMCwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJjb250cm9sIG1lbnVcIik7XHJcbiAgICAgICAgICAgICAgICBnYW1lLmN1cnJlbnRVaSA9IG5ldyBDb250cm9sc01lbnUoZm9udCwgdGl0bGVGb250KTtcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIG5ldyBCdXR0b24oZm9udCwgXCJBdWRpbyBTZXR0aW5nc1wiLCBcIkNoYW5nZSB0aGUgdm9sdW1lIG9mIGRpZmZlcmVudCBzb3VuZHMuXCIsIDAsIDAsIDAsIDAsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYXVkaW8gbWVudVwiKTtcclxuICAgICAgICAgICAgICAgIGdhbWUuY3VycmVudFVpID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgbmV3IEJ1dHRvbihmb250LCBcIkJhY2tcIiwgXCJSZXR1cm4gdG8gdGhlIG1haW4gbWVudS5cIiwgMCwgMCwgMCwgMCwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJtYWluIG1lbnVcIik7XHJcbiAgICAgICAgICAgICAgICBnYW1lLmN1cnJlbnRVaSA9IG5ldyBNYWluTWVudShmb250LCB0aXRsZUZvbnQpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIF07XHJcbiAgICAgICAgLy8gdXBkYXRlIHRoZSBzaXplIG9mIHRoZSBlbGVtZW50cyBiYXNlZCBvbiB0aGUgaW5pdGlhbCBzY3JlZW4gc2l6ZVxyXG4gICAgICAgIHRoaXMud2luZG93VXBkYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKHRhcmdldDogcDUsIHVwc2NhbGVTaXplOiBudW1iZXIpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgLy8gcmVuZGVyIHRoZSByZWN0YW5ndWxhciBpbWFnZSB0aGF0IHRoZSB3aG9sZSBtZW51IGlzIG9uXHJcbiAgICAgICAgdGhpcy5mcmFtZS5yZW5kZXIodGFyZ2V0LCB1cHNjYWxlU2l6ZSk7XHJcblxyXG4gICAgICAgIC8vIGxvb3AgdGhyb3VnaCB0aGUgYnV0dG9ucyBhcnJheSBhbmQgcmVuZGVyIGVhY2ggb25lLlxyXG4gICAgICAgIHRoaXMuYnV0dG9ucy5mb3JFYWNoKGJ1dHRvbiA9PiB7XHJcbiAgICAgICAgICAgIGJ1dHRvbi5yZW5kZXIodGFyZ2V0LCB1cHNjYWxlU2l6ZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMudGl0bGVGb250LmRyYXdUZXh0KHRhcmdldCwgXCJPcHRpb25zXCIsIHRoaXMuZnJhbWUueCArIDU0KmdhbWUudXBzY2FsZVNpemUsIHRoaXMuZnJhbWUueSArIDE2KmdhbWUudXBzY2FsZVNpemUpXHJcbiAgICB9XHJcblxyXG4gICAgd2luZG93VXBkYXRlKCkge1xyXG4gICAgICAgIC8vIHNldCB0aGUgcG9zaXRpb24gb2YgdGhlIGZyYW1lXHJcbiAgICAgICAgdGhpcy5mcmFtZS54ID0gZ2FtZS53aWR0aC8yLTIwMC8yKmdhbWUudXBzY2FsZVNpemU7Ly8gY2VudGVyIHRoZSBmcmFtZSBpbiB0aGUgY2VudGVyIG9mIHRoZSBzY3JlZW5cclxuICAgICAgICB0aGlzLmZyYW1lLnkgPSBnYW1lLmhlaWdodC8yLTU2KmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgdGhpcy5mcmFtZS53ID0gMjAwKmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgdGhpcy5mcmFtZS5oID0gNDgqZ2FtZS51cHNjYWxlU2l6ZTtcclxuXHJcbiAgICAgICAgLy8gc2V0IHRoZSBwb3NpdGlvbnMgb2YgYWxsIHRoZSBidXR0b25zXHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaTw0OyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLnggPSBnYW1lLndpZHRoLzItMTkyLzIqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLnkgPSBnYW1lLmhlaWdodC8yKzIwKmkqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLncgPSAxOTIqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLmggPSAxNipnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0udXBkYXRlTW91c2VPdmVyKGdhbWUubW91c2VYLCBnYW1lLm1vdXNlWSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCB7IFVpU2NyZWVuIH0gZnJvbSAnLi4vVWlTY3JlZW4nO1xyXG5pbXBvcnQgcDUgZnJvbSAncDUnO1xyXG5pbXBvcnQgeyBVaUZyYW1lIH0gZnJvbSAnLi4vVWlGcmFtZSc7XHJcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gJy4uL0J1dHRvbic7XHJcbmltcG9ydCB7IE9wdGlvbnNNZW51IH0gZnJvbSAnLi9PcHRpb25zTWVudSc7XHJcbmltcG9ydCB7IEZvbnRSZXNvdXJjZSB9IGZyb20gJy4uLy4uL2Fzc2V0cy9yZXNvdXJjZXMvRm9udFJlc291cmNlJztcclxuaW1wb3J0IHsgTWFpbk1lbnUgfSBmcm9tICcuL01haW5NZW51JztcclxuaW1wb3J0IHsgZ2FtZSB9IGZyb20gJy4uLy4uL0dhbWUnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFBhdXNlTWVudSBleHRlbmRzIFVpU2NyZWVuIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihmb250OiBGb250UmVzb3VyY2UsIHRpdGxlRm9udDogRm9udFJlc291cmNlKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgLy8gbWFrZSB0aGUgZnJhbWUgd2l0aCBzb21lIGRlZmF1bHQgdmFsdWVzLiAgVGhlc2Ugd2lsbCBsYXRlciBiZSBjaGFuZ2VkIHRvIGZpdCB0aGUgc2NyZWVuIHNpemUuXHJcbiAgICAgICAgdGhpcy5mcmFtZSA9IG5ldyBVaUZyYW1lKDAsIDAsIDAsIDApO1xyXG5cclxuICAgICAgICB0aGlzLnRpdGxlRm9udCA9IHRpdGxlRm9udDtcclxuXHJcbiAgICAgICAgLy8gbWFrZSA0IGJ1dHRvbnMgd2l0aCBkZWZhdWx0IHBvc2l0U2lvbnNcclxuICAgICAgICB0aGlzLmJ1dHRvbnMgPSBbXHJcbiAgICAgICAgICAgIG5ldyBCdXR0b24oZm9udCwgXCJSZXN1bWUgZ2FtZVwiLCBcIkdvIGJhY2sgdG8gdGhlIGdhbWUuXCIsIDAsIDAsIDAsIDAsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGdhbWUuY3VycmVudFVpID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgbmV3IEJ1dHRvbihmb250LCBcIk9wdGlvbnNcIiwgXCJDaGFuZ2UgeW91ciBrZXliaW5kcywgcmVkdWNlIGxhZywgZXRjLlwiLCAwLCAwLCAwLCAwLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBnYW1lLmN1cnJlbnRVaSA9IG5ldyBPcHRpb25zTWVudShmb250LCB0aXRsZUZvbnQpO1xyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgbmV3IEJ1dHRvbihmb250LCBcIkxlYXZlIGdhbWVcIiwgXCJHbyBiYWNrIHRvIE1haW4gTWVudVwiLCAwLCAwLCAwLCAwLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBnYW1lLmN1cnJlbnRVaSA9IG5ldyBNYWluTWVudShmb250LCB0aXRsZUZvbnQpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIF07XHJcblxyXG4gICAgICAgIC8vIHVwZGF0ZSB0aGUgc2l6ZSBvZiB0aGUgZWxlbWVudHMgYmFzZWQgb24gdGhlIGluaXRpYWwgc2NyZWVuIHNpemVcclxuICAgICAgICB0aGlzLndpbmRvd1VwZGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICByZW5kZXIodGFyZ2V0OiBwNSwgdXBzY2FsZVNpemU6IG51bWJlcik6IHZvaWQge1xyXG5cclxuICAgICAgICAvLyByZW5kZXIgdGhlIHJlY3Rhbmd1bGFyIGltYWdlIHRoYXQgdGhlIHdob2xlIG1lbnUgaXMgb25cclxuICAgICAgICB0aGlzLmZyYW1lLnJlbmRlcih0YXJnZXQsIHVwc2NhbGVTaXplKTtcclxuXHJcbiAgICAgICAgLy8gbG9vcCB0aHJvdWdoIHRoZSBidXR0b25zIGFycmF5IGFuZCByZW5kZXIgZWFjaCBvbmUuXHJcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIHRoaXMuYnV0dG9ucykge1xyXG4gICAgICAgICAgICBpdGVtLnJlbmRlcih0YXJnZXQsIHVwc2NhbGVTaXplKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudGl0bGVGb250LmRyYXdUZXh0KHRhcmdldCwgXCJQYXVzZWRcIiwgdGhpcy5mcmFtZS54ICsgNTQqZ2FtZS51cHNjYWxlU2l6ZSwgdGhpcy5mcmFtZS55ICsgMTYqZ2FtZS51cHNjYWxlU2l6ZSlcclxuXHJcbiAgICB9XHJcblxyXG4gICAgd2luZG93VXBkYXRlKCkge1xyXG4gICAgICAgIC8vIHNldCB0aGUgcG9zaXRpb24gb2YgdGhlIGZyYW1lXHJcbiAgICAgICAgdGhpcy5mcmFtZS54ID0gZ2FtZS53aWR0aC8yLTIwMC8yKmdhbWUudXBzY2FsZVNpemU7Ly8gY2VudGVyIHRoZSBmcmFtZSBpbiB0aGUgbWlkZGxlIG9mIHRoZSBzY3JlZW5cclxuICAgICAgICB0aGlzLmZyYW1lLnkgPSBnYW1lLmhlaWdodC8yLTcyKmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgdGhpcy5mcmFtZS53ID0gMjAwKmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgdGhpcy5mcmFtZS5oID0gNTQqZ2FtZS51cHNjYWxlU2l6ZTtcclxuXHJcbiAgICAgICAgLy8gc2V0IHRoZSBwb3NpdGlvbnMgb2YgYWxsIHRoZSBidXR0b25zXHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaTwzOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLnggPSBnYW1lLndpZHRoLzItMTkyLzIqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLnkgPSBnYW1lLmhlaWdodC8yKzIwKmkqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLncgPSAxOTIqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLmggPSAxNipnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0udXBkYXRlTW91c2VPdmVyKGdhbWUubW91c2VYLCBnYW1lLm1vdXNlWSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgeyBVaVNjcmVlbiB9IGZyb20gJy4uL1VpU2NyZWVuJztcclxuaW1wb3J0IHA1IGZyb20gJ3A1JztcclxuaW1wb3J0IHsgVWlGcmFtZSB9IGZyb20gJy4uL1VpRnJhbWUnO1xyXG5pbXBvcnQgeyBnYW1lIH0gZnJvbSAnLi4vLi4vR2FtZSc7XHJcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gJy4uL0J1dHRvbic7XHJcbmltcG9ydCB7IEZvbnRSZXNvdXJjZSB9IGZyb20gJy4uLy4uL2Fzc2V0cy9yZXNvdXJjZXMvRm9udFJlc291cmNlJztcclxuaW1wb3J0IHsgT3B0aW9uc01lbnUgfSBmcm9tICcuL09wdGlvbnNNZW51JztcclxuXHJcbmV4cG9ydCBjbGFzcyBWaWRlb1NldHRpbmdzTWVudSBleHRlbmRzIFVpU2NyZWVuIHtcclxuXHJcblx0Y29uc3RydWN0b3IoZm9udDogRm9udFJlc291cmNlLCB0aXRsZUZvbnQ6IEZvbnRSZXNvdXJjZSkge1xyXG5cdFx0c3VwZXIoKTtcclxuXHRcdC8vIG1ha2UgdGhlIGZyYW1lIHdpdGggc29tZSBkZWZhdWx0IHZhbHVlcy4gIFRoZXNlIHdpbGwgbGF0ZXIgYmUgY2hhbmdlZCB0byBmaXQgdGhlIHNjcmVlbiBzaXplLlxyXG5cdFx0dGhpcy5mcmFtZSA9IG5ldyBVaUZyYW1lKDAsIDAsIDAsIDApO1xyXG5cclxuXHJcblx0XHRpZihnYW1lLnNreU1vZCA9PT0gdW5kZWZpbmVkKVxyXG5cdFx0XHRnYW1lLnNreU1vZCA9IDI7XHJcblxyXG5cdFx0aWYoZ2FtZS5za3lUb2dnbGUgPT09IHVuZGVmaW5lZClcclxuXHRcdFx0Z2FtZS5za3lUb2dnbGUgPSB0cnVlO1xyXG5cclxuXHRcdGlmKGdhbWUucGFydGljbGVNdWx0aXBsaWVyID09PSB1bmRlZmluZWQpXHJcblx0XHRcdGdhbWUucGFydGljbGVNdWx0aXBsaWVyID0gMTtcclxuXHJcblx0XHRsZXQgdGVtcFNreU1vZGVUZXh0O1xyXG5cclxuXHRcdGlmKGdhbWUuc2t5TW9kPT09Mikge1xyXG5cdFx0XHR0ZW1wU2t5TW9kZVRleHQgPSBcIkhhbGYgRnJhbWVyYXRlXCI7XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmKGdhbWUuc2t5TW9kPT09MSkge1xyXG5cdFx0XHR0ZW1wU2t5TW9kZVRleHQgPSBcIkZ1bGwgRnJhbWVyYXRlXCI7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0dGVtcFNreU1vZGVUZXh0ID0gXCJTb2xpZCBDb2xvclwiO1xyXG5cdFx0fVxyXG5cclxuXHRcdGxldCB0ZW1wUGFydGljbGVUZXh0O1xyXG5cclxuXHRcdGlmKGdhbWUucGFydGljbGVNdWx0aXBsaWVyPT09Mikge1xyXG5cdFx0XHR0ZW1wUGFydGljbGVUZXh0ID0gXCJEb3VibGVcIjtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYoZ2FtZS5wYXJ0aWNsZU11bHRpcGxpZXI9PT0xKSB7XHJcblx0XHRcdHRlbXBQYXJ0aWNsZVRleHQgPSBcIk5vcm1hbFwiO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHRlbXBQYXJ0aWNsZVRleHQgPSBcIk1pbmltYWxcIjtcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gbWFrZSBzb21lIGJ1dHRvbnMgd2l0aCBkZWZhdWx0IHBvc2l0aW9uc1xyXG5cdFx0dGhpcy5idXR0b25zID0gW1xyXG5cdFx0XHRuZXcgQnV0dG9uKGZvbnQsIGBTa3k6ICR7dGVtcFNreU1vZGVUZXh0fWAsIFwiQ2hhbmdlIHRoZSBhcHBlYXJhbmNlIG9mIHRoZSBza3kuXCIsIDAsIDAsIDAsIDAsICgpID0+IHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhcInNreSB0b2dnbGVcIik7XHJcblx0XHRcdFx0aWYodGhpcy5idXR0b25zWzBdLnR4dCA9PT0gXCJTa3k6IEhhbGYgRnJhbWVyYXRlXCIpe1xyXG5cdFx0XHRcdFx0dGhpcy5idXR0b25zWzBdLnR4dCA9IFwiU2t5OiBGdWxsIEZyYW1lcmF0ZVwiO1xyXG5cdFx0XHRcdFx0Z2FtZS5za3lNb2QgPSAxO1xyXG5cdFx0XHRcdFx0Z2FtZS5za3lUb2dnbGUgPSB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIGlmKHRoaXMuYnV0dG9uc1swXS50eHQgPT09IFwiU2t5OiBGdWxsIEZyYW1lcmF0ZVwiKSB7XHJcblx0XHRcdFx0XHR0aGlzLmJ1dHRvbnNbMF0udHh0ID0gXCJTa3k6IFNvbGlkIENvbG9yXCI7XHJcblx0XHRcdFx0XHRnYW1lLnNreVRvZ2dsZSA9IGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMuYnV0dG9uc1swXS50eHQgPSBcIlNreTogSGFsZiBGcmFtZXJhdGVcIjtcclxuXHRcdFx0XHRcdGdhbWUuc2t5TW9kID0gMjtcclxuXHRcdFx0XHRcdGdhbWUuc2t5VG9nZ2xlID0gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pLFxyXG5cdFx0XHRuZXcgQnV0dG9uKGZvbnQsIGBQYXJ0aWNsZXM6ICR7dGVtcFBhcnRpY2xlVGV4dH1gLCBcIkNoYW5nZSB0aGUgYW1vdW50IG9mIHBhcnRpY2xlc1wiLCAwLCAwLCAwLCAwLCAoKSA9PiB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJwYXJ0aWNsZXNcIik7XHJcblx0XHRcdFx0aWYodGhpcy5idXR0b25zWzFdLnR4dCA9PT0gXCJQYXJ0aWNsZXM6IE5vcm1hbFwiKXtcclxuXHRcdFx0XHRcdHRoaXMuYnV0dG9uc1sxXS50eHQgPSBcIlBhcnRpY2xlczogRG91YmxlXCI7XHJcblx0XHRcdFx0XHRnYW1lLnBhcnRpY2xlTXVsdGlwbGllciA9IDI7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2UgaWYodGhpcy5idXR0b25zWzFdLnR4dCA9PT0gXCJQYXJ0aWNsZXM6IERvdWJsZVwiKSB7XHJcblx0XHRcdFx0XHR0aGlzLmJ1dHRvbnNbMV0udHh0ID0gXCJQYXJ0aWNsZXM6IE1pbmltYWxcIjtcclxuXHRcdFx0XHRcdGdhbWUucGFydGljbGVNdWx0aXBsaWVyID0gMC41O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMuYnV0dG9uc1sxXS50eHQgPSBcIlBhcnRpY2xlczogTm9ybWFsXCI7XHJcblx0XHRcdFx0XHRnYW1lLnBhcnRpY2xlTXVsdGlwbGllciA9IDE7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KSxcclxuXHRcdFx0bmV3IEJ1dHRvbihmb250LCBcIkJhY2tcIiwgXCJSZXR1cm4gdG8gdGhlIG1haW4gbWVudS5cIiwgMCwgMCwgMCwgMCwgKCkgPT4ge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKFwibWFpbiBtZW51XCIpO1xyXG5cdFx0XHRcdGdhbWUuY3VycmVudFVpID0gbmV3IE9wdGlvbnNNZW51KGZvbnQsIHRpdGxlRm9udCk7XHJcblx0XHRcdH0pXHJcblx0XHRdO1xyXG5cdFx0Ly8gdXBkYXRlIHRoZSBzaXplIG9mIHRoZSBlbGVtZW50cyBiYXNlZCBvbiB0aGUgaW5pdGlhbCBzY3JlZW4gc2l6ZVxyXG5cdFx0dGhpcy53aW5kb3dVcGRhdGUoKTtcclxuXHR9XHJcblxyXG5cdHJlbmRlcih0YXJnZXQ6IHA1LCB1cHNjYWxlU2l6ZTogbnVtYmVyKTogdm9pZCB7XHJcblxyXG5cdFx0Ly8gcmVuZGVyIHRoZSByZWN0YW5ndWxhciBpbWFnZVxyXG5cdFx0dGhpcy5mcmFtZS5yZW5kZXIodGFyZ2V0LCB1cHNjYWxlU2l6ZSk7XHJcblxyXG5cdFx0Ly8gbG9vcCB0aHJvdWdoIHRoZSBidXR0b25zIGFycmF5IGFuZCByZW5kZXIgZWFjaCBvbmUuXHJcblx0XHR0aGlzLmJ1dHRvbnMuZm9yRWFjaChidXR0b24gPT4ge1xyXG5cdFx0XHRidXR0b24ucmVuZGVyKHRhcmdldCwgdXBzY2FsZVNpemUpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHR3aW5kb3dVcGRhdGUoKSB7XHJcblx0XHQvLyBzZXQgdGhlIHBvc2l0aW9uIG9mIHRoZSBmcmFtZVxyXG5cdFx0dGhpcy5mcmFtZS54ID0gZ2FtZS53aWR0aCAvIDIgLSAyMDAgLyAyICogZ2FtZS51cHNjYWxlU2l6ZTsvLyBjZW50ZXIgdGhlIGZyYW1lIGluIHRoZSBjZW50ZXIgb2YgdGhlIHNjcmVlblxyXG5cdFx0dGhpcy5mcmFtZS55ID0gZ2FtZS5oZWlnaHQgLyAyIC0gNTYgKiBnYW1lLnVwc2NhbGVTaXplO1xyXG5cdFx0dGhpcy5mcmFtZS53ID0gMjAwICogZ2FtZS51cHNjYWxlU2l6ZTtcclxuXHRcdHRoaXMuZnJhbWUuaCA9IDQ4ICogZ2FtZS51cHNjYWxlU2l6ZTtcclxuXHJcblx0XHQvLyBzZXQgdGhlIHBvc2l0aW9ucyBvZiBhbGwgdGhlIGJ1dHRvbnNcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSB7XHJcblx0XHRcdHRoaXMuYnV0dG9uc1tpXS54ID0gZ2FtZS53aWR0aCAvIDIgLSAxOTIgLyAyICogZ2FtZS51cHNjYWxlU2l6ZTtcclxuXHRcdFx0dGhpcy5idXR0b25zW2ldLnkgPSBnYW1lLmhlaWdodCAvIDIgKyAyMCAqIGkgKiBnYW1lLnVwc2NhbGVTaXplO1xyXG5cdFx0XHR0aGlzLmJ1dHRvbnNbaV0udyA9IDE5MiAqIGdhbWUudXBzY2FsZVNpemU7XHJcblx0XHRcdHRoaXMuYnV0dG9uc1tpXS5oID0gMTYgKiBnYW1lLnVwc2NhbGVTaXplO1xyXG5cdFx0XHR0aGlzLmJ1dHRvbnNbaV0udXBkYXRlTW91c2VPdmVyKGdhbWUubW91c2VYLCBnYW1lLm1vdXNlWSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxufSIsImltcG9ydCB7IFVpU2NyZWVuIH0gZnJvbSAnLi4vVWlTY3JlZW4nO1xyXG5pbXBvcnQgcDUgZnJvbSAncDUnO1xyXG5pbXBvcnQgeyBVaUZyYW1lIH0gZnJvbSAnLi4vVWlGcmFtZSc7XHJcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gJy4uL0J1dHRvbic7XHJcbmltcG9ydCB7IEZvbnRSZXNvdXJjZSB9IGZyb20gJy4uLy4uL2Fzc2V0cy9yZXNvdXJjZXMvRm9udFJlc291cmNlJztcclxuaW1wb3J0IHsgTWFpbk1lbnUgfSBmcm9tICcuL01haW5NZW51JztcclxuaW1wb3J0IHsgV29ybGRPcHRpb25zTWVudSB9IGZyb20gJy4vV29ybGRPcHRpb25zTWVudSc7XHJcbmltcG9ydCB7IGdhbWUgfSBmcm9tICcuLi8uLi9HYW1lJztcclxuXHJcbmV4cG9ydCBjbGFzcyBXb3JsZENyZWF0aW9uTWVudSBleHRlbmRzIFVpU2NyZWVuIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihmb250OiBGb250UmVzb3VyY2UsIHRpdGxlRm9udDogRm9udFJlc291cmNlKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICAvLyBtYWtlIHRoZSBmcmFtZSB3aXRoIHNvbWUgZGVmYXVsdCB2YWx1ZXMuICBUaGVzZSB3aWxsIGxhdGVyIGJlIGNoYW5nZWQgdG8gZml0IHRoZSBzY3JlZW4gc2l6ZS5cclxuICAgICAgICB0aGlzLmZyYW1lID0gbmV3IFVpRnJhbWUoMCwgMCwgMCwgMCk7XHJcblxyXG4gICAgICAgIHRoaXMudGl0bGVGb250ID0gdGl0bGVGb250O1xyXG4gICAgICAgIC8vIG1ha2Ugc29tZSBidXR0b25zIHdpdGggZGVmYXVsdCBwb3NpdGlvbnNcclxuICAgICAgICBpZiAoZ2FtZS5zZXJ2ZXJWaXNpYmlsaXR5ID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIGdhbWUuc2VydmVyVmlzaWJpbGl0eSA9IFwiUHVibGljXCI7XHJcblxyXG4gICAgICAgIHRoaXMuYnV0dG9ucyA9IFtcclxuICAgICAgICAgICAgbmV3IEJ1dHRvbihmb250LCBgU2VydmVyIFZpc2liaWxpdHk6ICR7Z2FtZS5zZXJ2ZXJWaXNpYmlsaXR5fWAsIFwiQ2hhbmdlIHRoZSB2aXNpYmlsaXR5IG9mIHRoZSBzZXJ2ZXJcIiwgMCwgMCwgMCwgMCwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYnV0dG9uc1swXS50eHQgPT09IFwiU2VydmVyIFZpc2liaWxpdHk6IFB1YmxpY1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS5zZXJ2ZXJWaXNpYmlsaXR5ID0gXCJVbmxpc3RlZFwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnV0dG9uc1swXS50eHQgPSBcIlNlcnZlciBWaXNpYmlsaXR5OiBVbmxpc3RlZFwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5idXR0b25zWzBdLnR4dCA9PT0gXCJTZXJ2ZXIgVmlzaWJpbGl0eTogVW5saXN0ZWRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIGdhbWUuc2VydmVyVmlzaWJpbGl0eSA9IFwiUHJpdmF0ZVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnV0dG9uc1swXS50eHQgPSBcIlNlcnZlciBWaXNpYmlsaXR5OiBQcml2YXRlXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBnYW1lLnNlcnZlclZpc2liaWxpdHkgPSBcIlB1YmxpY1wiO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnV0dG9uc1swXS50eHQgPSBcIlNlcnZlciBWaXNpYmlsaXR5OiBQdWJsaWNcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIG5ldyBCdXR0b24oZm9udCwgXCJXb3JsZCBPcHRpb25zXCIsIFwiQ2hhbmdlIGhvdyB5b3VyIHdvcmxkIGxvb2tzIGFuZCBnZW5lcmF0ZXMuXCIsIDAsIDAsIDAsIDAsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwid29ybGQgbWVudVwiKTtcclxuICAgICAgICAgICAgICAgIGdhbWUuY3VycmVudFVpID0gbmV3IFdvcmxkT3B0aW9uc01lbnUoZm9udCwgdGl0bGVGb250KTtcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIG5ldyBCdXR0b24oZm9udCwgXCJCYWNrXCIsIFwiUmV0dXJuIHRvIHRoZSBtYWluIG1lbnUuXCIsIDAsIDAsIDAsIDAsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibWFpbiBtZW51XCIpO1xyXG4gICAgICAgICAgICAgICAgZ2FtZS5jdXJyZW50VWkgPSBuZXcgTWFpbk1lbnUoZm9udCwgdGl0bGVGb250KTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICBdO1xyXG4gICAgICAgIC8vIHVwZGF0ZSB0aGUgc2l6ZSBvZiB0aGUgZWxlbWVudHMgYmFzZWQgb24gdGhlIGluaXRpYWwgc2NyZWVuIHNpemVcclxuICAgICAgICB0aGlzLndpbmRvd1VwZGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcih0YXJnZXQ6IHA1LCB1cHNjYWxlU2l6ZTogbnVtYmVyKTogdm9pZCB7XHJcblxyXG4gICAgICAgIC8vIHJlbmRlciB0aGUgcmVjdGFuZ3VsYXIgaW1hZ2UgdGhhdCB0aGUgd2hvbGUgbWVudSBpcyBvblxyXG4gICAgICAgIHRoaXMuZnJhbWUucmVuZGVyKHRhcmdldCwgdXBzY2FsZVNpemUpO1xyXG5cclxuICAgICAgICAvLyBsb29wIHRocm91Z2ggdGhlIGJ1dHRvbnMgYXJyYXkgYW5kIHJlbmRlciBlYWNoIG9uZS5cclxuICAgICAgICB0aGlzLmJ1dHRvbnMuZm9yRWFjaChidXR0b24gPT4ge1xyXG4gICAgICAgICAgICBidXR0b24ucmVuZGVyKHRhcmdldCwgdXBzY2FsZVNpemUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnRpdGxlRm9udC5kcmF3VGV4dCh0YXJnZXQsIFwiQ3JlYXRlIFdvcmxkXCIsIHRoaXMuZnJhbWUueCArIDMwKmdhbWUudXBzY2FsZVNpemUsIHRoaXMuZnJhbWUueSArIDE2KmdhbWUudXBzY2FsZVNpemUpXHJcbiAgICB9XHJcblxyXG4gICAgd2luZG93VXBkYXRlKCkge1xyXG4gICAgICAgIC8vIHNldCB0aGUgcG9zaXRpb24gb2YgdGhlIGZyYW1lXHJcbiAgICAgICAgdGhpcy5mcmFtZS54ID0gZ2FtZS53aWR0aCAvIDIgLSAyMDAgLyAyICogZ2FtZS51cHNjYWxlU2l6ZTsvLyBjZW50ZXIgdGhlIGZyYW1lIGluIHRoZSBjZW50ZXIgb2YgdGhlIHNjcmVlblxyXG4gICAgICAgIHRoaXMuZnJhbWUueSA9IGdhbWUuaGVpZ2h0IC8gMiAtIDU2ICogZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICB0aGlzLmZyYW1lLncgPSAyMDAgKiBnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgIHRoaXMuZnJhbWUuaCA9IDQ4ICogZ2FtZS51cHNjYWxlU2l6ZTtcclxuXHJcbiAgICAgICAgLy8gc2V0IHRoZSBwb3NpdGlvbnMgb2YgYWxsIHRoZSBidXR0b25zXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAzOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLnggPSBnYW1lLndpZHRoIC8gMiAtIDE5MiAvIDIgKiBnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0ueSA9IGdhbWUuaGVpZ2h0IC8gMiArIDIwICogaSAqIGdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS53ID0gMTkyICogZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLmggPSAxNiAqIGdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS51cGRhdGVNb3VzZU92ZXIoZ2FtZS5tb3VzZVgsIGdhbWUubW91c2VZKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IHsgVWlTY3JlZW4gfSBmcm9tICcuLi9VaVNjcmVlbic7XHJcbmltcG9ydCBwNSBmcm9tICdwNSc7XHJcbmltcG9ydCB7IFVpRnJhbWUgfSBmcm9tICcuLi9VaUZyYW1lJztcclxuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSAnLi4vQnV0dG9uJztcclxuaW1wb3J0IHsgRm9udFJlc291cmNlIH0gZnJvbSAnLi4vLi4vYXNzZXRzL3Jlc291cmNlcy9Gb250UmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBXb3JsZENyZWF0aW9uTWVudSB9IGZyb20gJy4vV29ybGRDcmVhdGlvbk1lbnUnO1xyXG5pbXBvcnQgeyBTbGlkZXIgfSBmcm9tICcuLi9TbGlkZXInO1xyXG5pbXBvcnQgeyBnYW1lIH0gZnJvbSAnLi4vLi4vR2FtZSc7XHJcblxyXG5leHBvcnQgY2xhc3MgV29ybGRPcHRpb25zTWVudSBleHRlbmRzIFVpU2NyZWVuIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihmb250OiBGb250UmVzb3VyY2UsIHRpdGxlRm9udDogRm9udFJlc291cmNlKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICAvLyBtYWtlIHRoZSBmcmFtZSB3aXRoIHNvbWUgZGVmYXVsdCB2YWx1ZXMuICBUaGVzZSB3aWxsIGxhdGVyIGJlIGNoYW5nZWQgdG8gZml0IHRoZSBzY3JlZW4gc2l6ZS5cclxuICAgICAgICB0aGlzLmZyYW1lID0gbmV3IFVpRnJhbWUoMCwgMCwgMCwgMCk7XHJcblxyXG4gICAgICAgIHRoaXMudGl0bGVGb250ID0gdGl0bGVGb250XHJcblxyXG4gICAgICAgIC8vIG1ha2Ugc29tZSBidXR0b25zIHdpdGggZGVmYXVsdCBwb3NpdGlvbnNcclxuICAgICAgICBpZihnYW1lLndvcmxkQnVtcGluZXNzID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIGdhbWUud29ybGRCdW1waW5lc3MgPSAxO1xyXG5cclxuXHJcbiAgICAgICAgbGV0IHRlbXBXb3JsZEJ1bXBpbmVzc1RleHQ7XHJcblxyXG4gICAgICAgIGlmKGdhbWUud29ybGRCdW1waW5lc3M9PT0xKSB7XHJcbiAgICAgICAgICAgIHRlbXBXb3JsZEJ1bXBpbmVzc1RleHQgPSBcIk5vcm1hbFwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKGdhbWUud29ybGRCdW1waW5lc3M9PT0wKSB7XHJcbiAgICAgICAgICAgIHRlbXBXb3JsZEJ1bXBpbmVzc1RleHQgPSBcIlN1cGVyZmxhdFwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGVtcFdvcmxkQnVtcGluZXNzVGV4dCA9IFwiQW1wbGlmaWVkXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuYnV0dG9ucyA9IFtcclxuICAgICAgICAgICAgbmV3IEJ1dHRvbihmb250LCBgV29ybGQgQnVtcGluZXNzOiAke3RlbXBXb3JsZEJ1bXBpbmVzc1RleHR9YCwgXCJDaGFuZ2UgdGhlIGludGVuc2l0eSBvZiB0aGUgd29ybGQncyBidW1wcy5cIiwgMCwgMCwgMCwgMCwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5idXR0b25zWzBdLnR4dCA9PT0gXCJXb3JsZCBCdW1waW5lc3M6IE5vcm1hbFwiKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1dHRvbnNbMF0udHh0ID0gXCJXb3JsZCBCdW1waW5lc3M6IEFtcGxpZmllZFwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGdhbWUud29ybGRCdW1waW5lc3MgPSAzO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZih0aGlzLmJ1dHRvbnNbMF0udHh0ID09PSBcIldvcmxkIEJ1bXBpbmVzczogQW1wbGlmaWVkXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1dHRvbnNbMF0udHh0ID0gXCJXb3JsZCBCdW1waW5lc3M6IFN1cGVyZmxhdFwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGdhbWUud29ybGRCdW1waW5lc3MgPSAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idXR0b25zWzBdLnR4dCA9IFwiV29ybGQgQnVtcGluZXNzOiBOb3JtYWxcIjtcclxuICAgICAgICAgICAgICAgICAgICBnYW1lLndvcmxkQnVtcGluZXNzID0gMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIG5ldyBCdXR0b24oZm9udCwgXCJCYWNrXCIsIFwiUmV0dXJuIHRvIHRoZSBtYWluIG1lbnUuXCIsIDAsIDAsIDAsIDAsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibWFpbiBtZW51XCIpO1xyXG4gICAgICAgICAgICAgICAgZ2FtZS5jdXJyZW50VWkgPSBuZXcgV29ybGRDcmVhdGlvbk1lbnUoZm9udCwgdGl0bGVGb250KTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICBdO1xyXG4gICAgICAgIHRoaXMuc2xpZGVycyA9IFtcclxuICAgICAgICAgICAgbmV3IFNsaWRlcihmb250LCBcIldpZHRoXCIsIDUxMiwgNjQsIDIwNDgsIDY0LCAwLCAwLCAwLCAwLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBnYW1lLndvcmxkV2lkdGggPSB0aGlzLnNsaWRlcnNbMF0udmFsdWU7XHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBuZXcgU2xpZGVyKGZvbnQsIFwiSGVpZ2h0XCIsIDY0LCA2NCwgNTEyLCAxNiwgMCwgMCwgMCwgMCwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZ2FtZS53b3JsZEhlaWdodCA9IHRoaXMuc2xpZGVyc1sxXS52YWx1ZTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICBdO1xyXG4gICAgICAgIC8vIHVwZGF0ZSB0aGUgc2l6ZSBvZiB0aGUgZWxlbWVudHMgYmFzZWQgb24gdGhlIGluaXRpYWwgc2NyZWVuIHNpemVcclxuICAgICAgICB0aGlzLndpbmRvd1VwZGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcih0YXJnZXQ6IHA1LCB1cHNjYWxlU2l6ZTogbnVtYmVyKTogdm9pZCB7XHJcblxyXG4gICAgICAgIC8vIHJlbmRlciB0aGUgcmVjdGFuZ3VsYXIgaW1hZ2UgdGhhdCB0aGUgd2hvbGUgbWVudSBpcyBvblxyXG4gICAgICAgIHRoaXMuZnJhbWUucmVuZGVyKHRhcmdldCwgdXBzY2FsZVNpemUpO1xyXG5cclxuICAgICAgICAvLyBsb29wIHRocm91Z2ggdGhlIGJ1dHRvbnMgYXJyYXkgYW5kIHJlbmRlciBlYWNoIG9uZS5cclxuICAgICAgICB0aGlzLmJ1dHRvbnMuZm9yRWFjaChidXR0b24gPT4ge1xyXG4gICAgICAgICAgICBidXR0b24ucmVuZGVyKHRhcmdldCwgdXBzY2FsZVNpemUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBsb29wIHRocm91Z2ggdGhlIHNsaWRlcnMgYXJyYXkgYW5kIHJlbmRlciBlYWNoIG9uZS5cclxuICAgICAgICB0aGlzLnNsaWRlcnMuZm9yRWFjaChzbGlkZXIgPT4ge1xyXG4gICAgICAgICAgICBzbGlkZXIucmVuZGVyKHRhcmdldCwgdXBzY2FsZVNpemUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnRpdGxlRm9udC5kcmF3VGV4dCh0YXJnZXQsIFwiV29ybGQgT3B0aW9uc1wiLCB0aGlzLmZyYW1lLnggKyAzMCpnYW1lLnVwc2NhbGVTaXplLCB0aGlzLmZyYW1lLnkgKyAxNipnYW1lLnVwc2NhbGVTaXplKVxyXG4gICAgfVxyXG5cclxuICAgIHdpbmRvd1VwZGF0ZSgpIHtcclxuICAgICAgICAvLyBzZXQgdGhlIHBvc2l0aW9uIG9mIHRoZSBmcmFtZVxyXG4gICAgICAgIHRoaXMuZnJhbWUueCA9IGdhbWUud2lkdGgvMi0yMDAvMipnYW1lLnVwc2NhbGVTaXplOy8vIGNlbnRlciB0aGUgZnJhbWUgaW4gdGhlIGNlbnRlciBvZiB0aGUgc2NyZWVuXHJcbiAgICAgICAgdGhpcy5mcmFtZS55ID0gZ2FtZS5oZWlnaHQvMi01NipnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgIHRoaXMuZnJhbWUudyA9IDIwMCpnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgIHRoaXMuZnJhbWUuaCA9IDQ4KmdhbWUudXBzY2FsZVNpemU7XHJcblxyXG4gICAgICAgIC8vIHNldCB0aGUgcG9zaXRpb25zIG9mIGFsbCB0aGUgYnV0dG9uc1xyXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGk8MjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS54ID0gZ2FtZS53aWR0aC8yLTE5Mi8yKmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS55ID0gZ2FtZS5oZWlnaHQvMis2MCppKmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS53ID0gMTkyKmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS5oID0gMTYqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLnVwZGF0ZU1vdXNlT3ZlcihnYW1lLm1vdXNlWCwgZ2FtZS5tb3VzZVkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gc2V0IHRoZSBwb3NpdGlvbnMgb2YgYWxsIHRoZSBzbGlkZXJzXHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaTwyOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5zbGlkZXJzW2ldLnggPSBnYW1lLndpZHRoLzItMTkyLzIqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5zbGlkZXJzW2ldLnkgPSBnYW1lLmhlaWdodC8yKzIwKmdhbWUudXBzY2FsZVNpemUrMjAqaSpnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLnNsaWRlcnNbaV0udyA9IDE5MipnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLnNsaWRlcnNbaV0uaCA9IDE2KmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIGlmKGdhbWUubW91c2VJc1ByZXNzZWQpXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNsaWRlcnNbaV0udXBkYXRlU2xpZGVyUG9zaXRpb24oZ2FtZS5tb3VzZVgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgUDUgZnJvbSAncDUnO1xyXG5pbXBvcnQgeyBUaWNrYWJsZSB9IGZyb20gJy4uL2ludGVyZmFjZXMvVGlja2FibGUnO1xyXG5pbXBvcnQgeyBSZW5kZXJhYmxlIH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9SZW5kZXJhYmxlJztcclxuaW1wb3J0IHsgZ2FtZSwgR2FtZSB9IGZyb20gJy4uL0dhbWUnO1xyXG5pbXBvcnQgeyBQbGF5ZXJMb2NhbCB9IGZyb20gJy4uL3BsYXllci9QbGF5ZXJMb2NhbCc7XHJcbmltcG9ydCB7IFNlcnZlckVudGl0eSB9IGZyb20gJy4vZW50aXRpZXMvU2VydmVyRW50aXR5JztcclxuaW1wb3J0IHsgU25hcHNob3RJbnRlcnBvbGF0aW9uIH0gZnJvbSAnQGdlY2tvcy5pby9zbmFwc2hvdC1pbnRlcnBvbGF0aW9uJztcclxuaW1wb3J0IHsgRW50aXR5LCBTbmFwc2hvdCB9IGZyb20gJ0BnZWNrb3MuaW8vc25hcHNob3QtaW50ZXJwb2xhdGlvbi9saWIvdHlwZXMnO1xyXG5pbXBvcnQgeyBXb3JsZFRpbGVzIH0gZnJvbSAnLi9Xb3JsZFRpbGVzJztcclxuaW1wb3J0IHsgVGlsZVR5cGUgfSBmcm9tICcuLi8uLi9nbG9iYWwvVGlsZSc7XHJcbmltcG9ydCB7IEludmVudG9yeSB9IGZyb20gJy4uL3BsYXllci9JbnZlbnRvcnknO1xyXG5pbXBvcnQgeyBUaWxlRW50aXR5UGF5bG9hZCB9IGZyb20gJy4uLy4uL2dsb2JhbC9UaWxlRW50aXR5JztcclxuaW1wb3J0IHsgQ2xpZW50VGlsZUVudGl0eSB9IGZyb20gJy4vZW50aXRpZXMvVGlsZUVudGl0eSc7XHJcbmltcG9ydCB7IFdvcmxkQXNzZXRzIH0gZnJvbSAnLi4vYXNzZXRzL0Fzc2V0cyc7XHJcblxyXG5leHBvcnQgY2xhc3MgV29ybGQgaW1wbGVtZW50cyBUaWNrYWJsZSwgUmVuZGVyYWJsZSB7XHJcblx0d2lkdGg6IG51bWJlcjsgLy8gd2lkdGggb2YgdGhlIHdvcmxkIGluIHRpbGVzXHJcblx0aGVpZ2h0OiBudW1iZXI7IC8vIGhlaWdodCBvZiB0aGUgd29ybGQgaW4gdGlsZXNcclxuXHJcblx0dGlsZUxheWVyOiBQNS5HcmFwaGljczsgLy8gVGlsZSBsYXllciBncmFwaGljXHJcblxyXG5cdHdvcmxkVGlsZXM6IChUaWxlVHlwZSB8IHN0cmluZylbXTsgLy8gbnVtYmVyIGZvciBlYWNoIHRpbGVzIGluIHRoZSB3b3JsZCBleDogWzEsIDEsIDAsIDEsIDIsIDAsIDAsIDEuLi4gIF0gbWVhbnMgc25vdywgc25vdywgYWlyLCBzbm93LCBpY2UsIGFpciwgYWlyLCBzbm93Li4uICBzdHJpbmcgaXMgaWQgZm9yIHRpbGUgZW50aXR5IG9jY3VweWluZyB0aGF0IHRpbGVcclxuXHJcblx0cGxheWVyOiBQbGF5ZXJMb2NhbDtcclxuXHJcblx0aW52ZW50b3J5OiBJbnZlbnRvcnk7XHJcblxyXG5cdGVudGl0aWVzOiB7IFtpZDogc3RyaW5nXTogU2VydmVyRW50aXR5IH0gPSB7fTtcclxuXHJcblx0dGlsZUVudGl0eVBheWxvYWRzOiB7IFtpZDogc3RyaW5nXTogVGlsZUVudGl0eVBheWxvYWQgfTtcclxuXHR0aWxlRW50aXRpZXM6IHsgW2lkOiBzdHJpbmddOiBDbGllbnRUaWxlRW50aXR5IH07XHJcblxyXG5cdHNuYXBzaG90SW50ZXJwb2xhdGlvbjogU25hcHNob3RJbnRlcnBvbGF0aW9uO1xyXG5cclxuXHRjb25zdHJ1Y3RvcihcclxuXHRcdHdpZHRoOiBudW1iZXIsXHJcblx0XHRoZWlnaHQ6IG51bWJlcixcclxuXHRcdHRpbGVzOiAoVGlsZVR5cGUgfCBzdHJpbmcpW10sXHJcblx0XHR0aWxlRW50aXRpZXM6IHsgW2lkOiBzdHJpbmddOiBDbGllbnRUaWxlRW50aXR5IH0sXHJcblx0KSB7XHJcblx0XHQvLyBJbml0aWFsaXplIHRoZSB3b3JsZCB3aXRoIHRoZSB0aWxlcyBhbmQgZGltZW5zaW9ucyBmcm9tIHRoZSBzZXJ2ZXJcclxuXHRcdHRoaXMud2lkdGggPSB3aWR0aDtcclxuXHRcdHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG5cdFx0dGhpcy53b3JsZFRpbGVzID0gdGlsZXM7XHJcblx0XHR0aGlzLnRpbGVFbnRpdGllcyA9IHRpbGVFbnRpdGllcztcclxuXHJcblx0XHR0aGlzLnNuYXBzaG90SW50ZXJwb2xhdGlvbiA9IG5ldyBTbmFwc2hvdEludGVycG9sYXRpb24oKTtcclxuXHRcdHRoaXMuc25hcHNob3RJbnRlcnBvbGF0aW9uLmludGVycG9sYXRpb25CdWZmZXIuc2V0KFxyXG5cdFx0XHQoMTAwMCAvIGdhbWUubmV0TWFuYWdlci5wbGF5ZXJUaWNrUmF0ZSkgKiAyLFxyXG5cdFx0KTtcclxuXHJcblx0XHQvLyBkZWZpbmUgdGhlIHA1LkdyYXBoaWNzIG9iamVjdHMgdGhhdCBob2xkIGFuIGltYWdlIG9mIHRoZSB0aWxlcyBvZiB0aGUgd29ybGQuICBUaGVzZSBhY3Qgc29ydCBvZiBsaWtlIGEgdmlydHVhbCBjYW52YXMgYW5kIGNhbiBiZSBkcmF3biBvbiBqdXN0IGxpa2UgYSBub3JtYWwgY2FudmFzIGJ5IHVzaW5nIHRpbGVMYXllci5yZWN0KCk7LCB0aWxlTGF5ZXIuZWxsaXBzZSgpOywgdGlsZUxheWVyLmZpbGwoKTssIGV0Yy5cclxuXHRcdHRoaXMudGlsZUxheWVyID0gZ2FtZS5jcmVhdGVHcmFwaGljcyhcclxuXHRcdFx0dGhpcy53aWR0aCAqIGdhbWUuVElMRV9XSURUSCxcclxuXHRcdFx0dGhpcy5oZWlnaHQgKiBnYW1lLlRJTEVfSEVJR0hULFxyXG5cdFx0KTtcclxuXHRcdHRoaXMubG9hZFdvcmxkKCk7XHJcblx0fVxyXG5cclxuXHR0aWNrKGdhbWU6IEdhbWUpIHtcclxuXHRcdGlmICh0aGlzLnBsYXllciAhPT0gdW5kZWZpbmVkKVxyXG5cdFx0XHRnYW1lLmNvbm5lY3Rpb24uZW1pdCgncGxheWVyVXBkYXRlJywgdGhpcy5wbGF5ZXIueCwgdGhpcy5wbGF5ZXIueSk7XHJcblx0fVxyXG5cclxuXHRyZW5kZXIodGFyZ2V0OiBQNSwgdXBzY2FsZVNpemU6IG51bWJlcikge1xyXG5cdFx0Ly8gZHJhdyB0aGUgdGlsZXMgbGF5ZXIgb250byB0aGUgc2NyZWVuXHJcblx0XHR0YXJnZXQuaW1hZ2UoXHJcblx0XHRcdHRoaXMudGlsZUxheWVyLFxyXG5cdFx0XHQwLFxyXG5cdFx0XHQwLFxyXG5cdFx0XHQoZ2FtZS53aWR0aCAvIHVwc2NhbGVTaXplKSAqIHVwc2NhbGVTaXplLFxyXG5cdFx0XHQoZ2FtZS5oZWlnaHQgLyB1cHNjYWxlU2l6ZSkgKiB1cHNjYWxlU2l6ZSxcclxuXHRcdFx0Z2FtZS5pbnRlcnBvbGF0ZWRDYW1YICogZ2FtZS5USUxFX1dJRFRILFxyXG5cdFx0XHRnYW1lLmludGVycG9sYXRlZENhbVkgKiBnYW1lLlRJTEVfV0lEVEgsXHJcblx0XHRcdGdhbWUud2lkdGggLyB1cHNjYWxlU2l6ZSxcclxuXHRcdFx0Z2FtZS5oZWlnaHQgLyB1cHNjYWxlU2l6ZSxcclxuXHRcdCk7XHJcblxyXG5cdFx0dGhpcy5yZW5kZXJQbGF5ZXJzKHRhcmdldCwgdXBzY2FsZVNpemUpO1xyXG5cclxuXHRcdHRhcmdldC5zdHJva2UoMCk7XHJcblx0XHR0YXJnZXQuc3Ryb2tlV2VpZ2h0KDQpO1xyXG5cdFx0dGFyZ2V0Lm5vRmlsbCgpO1xyXG5cdFx0dGFyZ2V0LnJlY3QodGFyZ2V0LndpZHRoIC0gdGhpcy53aWR0aCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xyXG5cclxuXHRcdHRhcmdldC5pbWFnZShcclxuXHRcdFx0dGhpcy50aWxlTGF5ZXIsXHJcblx0XHRcdHRhcmdldC53aWR0aCAtIHRoaXMud2lkdGgsXHJcblx0XHRcdDAsXHJcblx0XHRcdHRoaXMud2lkdGgsXHJcblx0XHRcdHRoaXMuaGVpZ2h0LFxyXG5cdFx0KTtcclxuXHR9XHJcblxyXG5cdHVwZGF0ZVBsYXllcnMoc25hcHNob3Q6IFNuYXBzaG90KSB7XHJcblx0XHR0aGlzLnNuYXBzaG90SW50ZXJwb2xhdGlvbi5zbmFwc2hvdC5hZGQoc25hcHNob3QpO1xyXG5cdH1cclxuXHJcblx0dXBkYXRlVGlsZSh0aWxlSW5kZXg6IG51bWJlciwgdGlsZTogVGlsZVR5cGUpIHtcclxuXHRcdC8vIFVwZGF0ZSB0aGUgdGlsZSBhbmQgdGhlIDQgbmVpZ2hib3VyaW5nIHRpbGVzXHJcblx0XHR0aGlzLndvcmxkVGlsZXNbdGlsZUluZGV4XSA9IHRpbGU7XHJcblxyXG5cdFx0Ly8gZXJhc2UgdGhlIGJyb2tlbiB0aWxlcyBhbmQgaXRzIHN1cnJvdW5kaW5nIHRpbGVzIGlmIHRoZXkncmUgdGlsZXNcclxuXHRcdHRoaXMudGlsZUxheWVyLmVyYXNlKCk7XHJcblx0XHR0aGlzLnRpbGVMYXllci5ub1N0cm9rZSgpO1xyXG5cdFx0dGhpcy50aWxlTGF5ZXIucmVjdChcclxuXHRcdFx0Ly9jZW50ZXJcclxuXHRcdFx0KHRpbGVJbmRleCAlIHRoaXMud2lkdGgpICogZ2FtZS5USUxFX1dJRFRILFxyXG5cdFx0XHRNYXRoLmZsb29yKHRpbGVJbmRleCAvIHRoaXMud2lkdGgpICogZ2FtZS5USUxFX0hFSUdIVCxcclxuXHRcdFx0Z2FtZS5USUxFX1dJRFRILFxyXG5cdFx0XHRnYW1lLlRJTEVfSEVJR0hULFxyXG5cdFx0KTtcclxuXHJcblx0XHRpZiAoXHJcblx0XHRcdHRpbGVJbmRleCAtIDEgPj0gMCAmJlxyXG5cdFx0XHR0eXBlb2YgdGhpcy53b3JsZFRpbGVzW3RpbGVJbmRleCAtIDFdICE9PSAnc3RyaW5nJyAmJlxyXG5cdFx0XHR0aGlzLndvcmxkVGlsZXNbdGlsZUluZGV4IC0gMV0gIT09IFRpbGVUeXBlLkFpclxyXG5cdFx0KSB7XHJcblx0XHRcdHRoaXMudGlsZUxheWVyLnJlY3QoXHJcblx0XHRcdFx0Ly9sZWZ0XHJcblx0XHRcdFx0KCh0aWxlSW5kZXggJSB0aGlzLndpZHRoKSAtIDEpICogZ2FtZS5USUxFX1dJRFRILFxyXG5cdFx0XHRcdE1hdGguZmxvb3IodGlsZUluZGV4IC8gdGhpcy53aWR0aCkgKiBnYW1lLlRJTEVfSEVJR0hULFxyXG5cdFx0XHRcdGdhbWUuVElMRV9XSURUSCxcclxuXHRcdFx0XHRnYW1lLlRJTEVfSEVJR0hULFxyXG5cdFx0XHQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChcclxuXHRcdFx0dGlsZUluZGV4ICsgMSA8IHRoaXMud2lkdGggKiB0aGlzLmhlaWdodCAmJlxyXG5cdFx0XHR0eXBlb2YgdGhpcy53b3JsZFRpbGVzW3RpbGVJbmRleCArIDFdICE9PSAnc3RyaW5nJyAmJlxyXG5cdFx0XHR0aGlzLndvcmxkVGlsZXNbdGlsZUluZGV4ICsgMV0gIT09IFRpbGVUeXBlLkFpclxyXG5cdFx0KSB7XHJcblx0XHRcdHRoaXMudGlsZUxheWVyLnJlY3QoXHJcblx0XHRcdFx0Ly9yaWdodFxyXG5cdFx0XHRcdCgodGlsZUluZGV4ICUgdGhpcy53aWR0aCkgLSAxKSAqIGdhbWUuVElMRV9XSURUSCxcclxuXHRcdFx0XHRNYXRoLmZsb29yKHRpbGVJbmRleCAvIHRoaXMud2lkdGgpICogZ2FtZS5USUxFX0hFSUdIVCxcclxuXHRcdFx0XHRnYW1lLlRJTEVfV0lEVEgsXHJcblx0XHRcdFx0Z2FtZS5USUxFX0hFSUdIVCxcclxuXHRcdFx0KTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoXHJcblx0XHRcdHRpbGVJbmRleCAtIHRoaXMud2lkdGggPj0gMCAmJlxyXG5cdFx0XHR0eXBlb2YgdGhpcy53b3JsZFRpbGVzW3RpbGVJbmRleCAtIHRoaXMud2lkdGhdICE9PSAnc3RyaW5nJyAmJlxyXG5cdFx0XHR0aGlzLndvcmxkVGlsZXNbdGlsZUluZGV4IC0gdGhpcy53aWR0aF0gIT09IFRpbGVUeXBlLkFpclxyXG5cdFx0KSB7XHJcblx0XHRcdHRoaXMudGlsZUxheWVyLnJlY3QoXHJcblx0XHRcdFx0Ly90b3BcclxuXHRcdFx0XHQodGlsZUluZGV4ICUgdGhpcy53aWR0aCkgKiBnYW1lLlRJTEVfV0lEVEgsXHJcblx0XHRcdFx0KE1hdGguZmxvb3IodGlsZUluZGV4IC8gdGhpcy53aWR0aCkgLSAxKSAqIGdhbWUuVElMRV9IRUlHSFQsXHJcblx0XHRcdFx0Z2FtZS5USUxFX1dJRFRILFxyXG5cdFx0XHRcdGdhbWUuVElMRV9IRUlHSFQsXHJcblx0XHRcdCk7XHJcblx0XHR9XHJcblx0XHRpZiAoXHJcblx0XHRcdHRpbGVJbmRleCArIHRoaXMud2lkdGggPCB0aGlzLndpZHRoICogdGhpcy5oZWlnaHQgJiZcclxuXHRcdFx0dHlwZW9mIHRoaXMud29ybGRUaWxlc1t0aWxlSW5kZXggKyB0aGlzLndpZHRoXSAhPT0gJ3N0cmluZycgJiZcclxuXHRcdFx0dGhpcy53b3JsZFRpbGVzW3RpbGVJbmRleCArIHRoaXMud2lkdGhdICE9PSBUaWxlVHlwZS5BaXJcclxuXHRcdCkge1xyXG5cdFx0XHR0aGlzLnRpbGVMYXllci5yZWN0KFxyXG5cdFx0XHRcdC8vYm90dG9tXHJcblx0XHRcdFx0KHRpbGVJbmRleCAlIHRoaXMud2lkdGgpICogZ2FtZS5USUxFX1dJRFRILFxyXG5cdFx0XHRcdChNYXRoLmZsb29yKHRpbGVJbmRleCAvIHRoaXMud2lkdGgpICsgMSkgKiBnYW1lLlRJTEVfSEVJR0hULFxyXG5cdFx0XHRcdGdhbWUuVElMRV9XSURUSCxcclxuXHRcdFx0XHRnYW1lLlRJTEVfSEVJR0hULFxyXG5cdFx0XHQpO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy50aWxlTGF5ZXIubm9FcmFzZSgpO1xyXG5cclxuXHRcdC8vIHJlZHJhdyB0aGUgbmVpZ2hib3JpbmcgdGlsZXNcclxuXHRcdHRoaXMuZHJhd1RpbGUodGlsZUluZGV4KTtcclxuXHRcdHRoaXMuZHJhd1RpbGUodGlsZUluZGV4ICsgdGhpcy53aWR0aCk7XHJcblx0XHR0aGlzLmRyYXdUaWxlKHRpbGVJbmRleCAtIDEpO1xyXG5cdFx0dGhpcy5kcmF3VGlsZSh0aWxlSW5kZXggLSB0aGlzLndpZHRoKTtcclxuXHRcdHRoaXMuZHJhd1RpbGUodGlsZUluZGV4ICsgMSk7XHJcblx0fVxyXG5cclxuXHRyZW5kZXJQbGF5ZXJzKHRhcmdldDogUDUsIHVwc2NhbGVTaXplOiBudW1iZXIpIHtcclxuXHRcdC8vIENhbGN1bGF0ZSB0aGUgaW50ZXJwb2xhdGVkIHBvc2l0aW9uIG9mIGFsbCB1cGRhdGVkIGVudGl0aWVzXHJcblx0XHRjb25zdCBwb3NpdGlvblN0YXRlczogeyBbaWQ6IHN0cmluZ106IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfSB9ID0ge307XHJcblx0XHR0cnkge1xyXG5cdFx0XHRjb25zdCBjYWxjdWxhdGVkU25hcHNob3QgPVxyXG5cdFx0XHRcdHRoaXMuc25hcHNob3RJbnRlcnBvbGF0aW9uLmNhbGNJbnRlcnBvbGF0aW9uKCd4IHknKTtcclxuXHRcdFx0aWYgKCFjYWxjdWxhdGVkU25hcHNob3QpIHJldHVybjtcclxuXHJcblx0XHRcdGNvbnN0IHN0YXRlID0gY2FsY3VsYXRlZFNuYXBzaG90LnN0YXRlO1xyXG5cdFx0XHRpZiAoIXN0YXRlKSByZXR1cm47XHJcblxyXG5cdFx0XHQvLyBUaGUgbmV3IHBvc2l0aW9ucyBvZiBlbnRpdGllcyBhcyBvYmplY3RcclxuXHRcdFx0c3RhdGUuZm9yRWFjaCgoeyBpZCwgeCwgeSB9OiBFbnRpdHkgJiB7IHg6IG51bWJlcjsgeTogbnVtYmVyIH0pID0+IHtcclxuXHRcdFx0XHRwb3NpdGlvblN0YXRlc1tpZF0gPSB7IHgsIHkgfTtcclxuXHRcdFx0fSk7XHJcblx0XHR9IGNhdGNoIChlKSB7fVxyXG5cclxuXHRcdC8vIFJlbmRlciBlYWNoIGVudGl0eSBpbiByYW5kb20gb3JkZXJcclxuXHRcdE9iamVjdC5lbnRyaWVzKHRoaXMuZW50aXRpZXMpLmZvckVhY2goXHJcblx0XHRcdChlbnRpdHk6IFtzdHJpbmcsIFNlcnZlckVudGl0eV0pID0+IHtcclxuXHRcdFx0XHRjb25zdCB1cGRhdGVkUG9zaXRpb24gPSBwb3NpdGlvblN0YXRlc1tlbnRpdHlbMF1dO1xyXG5cdFx0XHRcdGlmICh1cGRhdGVkUG9zaXRpb24gIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdFx0ZW50aXR5WzFdLnggPSB1cGRhdGVkUG9zaXRpb24ueDtcclxuXHRcdFx0XHRcdGVudGl0eVsxXS55ID0gdXBkYXRlZFBvc2l0aW9uLnk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRlbnRpdHlbMV0ucmVuZGVyKHRhcmdldCwgdXBzY2FsZVNpemUpO1xyXG5cdFx0XHR9LFxyXG5cdFx0KTtcclxuXHJcblx0XHQvLyBSZW5kZXIgdGhlIHBsYXllciBvbiB0b3BcclxuXHRcdGlmICh0aGlzLnBsYXllciAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdHRoaXMucGxheWVyLmZpbmRJbnRlcnBvbGF0ZWRDb29yZGluYXRlcygpO1xyXG5cdFx0XHR0aGlzLnBsYXllci5yZW5kZXIodGFyZ2V0LCB1cHNjYWxlU2l6ZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRsb2FkV29ybGQoKSB7XHJcblx0XHR0aGlzLnRpbGVMYXllci5ub1N0cm9rZSgpO1xyXG5cdFx0dGhpcy50aWxlTGF5ZXIuZmlsbCgyNTUsIDAsIDApO1xyXG5cdFx0Zm9yIChsZXQgeCA9IDA7IHggPCB0aGlzLmhlaWdodDsgeCsrKSB7XHJcblx0XHRcdC8veCBhbmQgeSBhcmUgc3dpdGNoZWQgZm9yIHNvbWUgc3R1cGlkIHJlYXNvblxyXG5cdFx0XHQvLyBpIHdpbGwgYmUgdGhlIHkgcG9zaXRpb24gb2YgdGlsZXMgYmVpbmcgZHJhd25cclxuXHRcdFx0Zm9yIChsZXQgeSA9IDA7IHkgPCB0aGlzLndpZHRoOyB5KyspIHtcclxuXHRcdFx0XHRjb25zdCB0aWxlVmFsID0gdGhpcy53b3JsZFRpbGVzW3ggKiB0aGlzLndpZHRoICsgeV07XHJcblxyXG5cdFx0XHRcdGlmICh0eXBlb2YgdGlsZVZhbCA9PT0gJ3N0cmluZycpIHtcclxuXHRcdFx0XHRcdGlmICh0aGlzLnRpbGVFbnRpdGllcyA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoJ3RpbGUgZW50aXR5IGFycmF5IGlzIHVuZGVmaW5lZCcpO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGlmICh0aGlzLnRpbGVFbnRpdGllc1t0aWxlVmFsXSA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoXHJcblx0XHRcdFx0XHRcdFx0J3RpbGUgZW50aXR5ICcgKyB0aWxlVmFsICsgJyBpcyB1bmRlZmluZWQnLFxyXG5cdFx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGNvbnN0IHRvcExlZnQgPSBNYXRoLm1pbihcclxuXHRcdFx0XHRcdFx0Li4udGhpcy50aWxlRW50aXRpZXNbdGlsZVZhbF0uY292ZXJlZFRpbGVzLFxyXG5cdFx0XHRcdFx0KTtcclxuXHRcdFx0XHRcdGlmICh4ICogdGhpcy53aWR0aCArIHkgPT09IHRvcExlZnQpIHtcclxuXHRcdFx0XHRcdFx0Ly9yZW5kZXIgdGlsZSBlbnRpdHkgaW1hZ2VcclxuXHRcdFx0XHRcdFx0bGV0IGltZyA9XHJcblx0XHRcdFx0XHRcdFx0V29ybGRBc3NldHMudGlsZUVudGl0aWVzW1xyXG5cdFx0XHRcdFx0XHRcdFx0dGhpcy50aWxlRW50aXRpZXNbdGlsZVZhbF0udHlwZV9cclxuXHRcdFx0XHRcdFx0XHRdW3RoaXMudGlsZUVudGl0aWVzW3RpbGVWYWxdLmFuaW1GcmFtZV07XHJcblx0XHRcdFx0XHRcdGltZy5yZW5kZXIoXHJcblx0XHRcdFx0XHRcdFx0dGhpcy50aWxlTGF5ZXIsXHJcblx0XHRcdFx0XHRcdFx0eSAqIGdhbWUuVElMRV9XSURUSCxcclxuXHRcdFx0XHRcdFx0XHR4ICogZ2FtZS5USUxFX0hFSUdIVCxcclxuXHRcdFx0XHRcdFx0XHRpbWcuaW1hZ2Uud2lkdGgsXHJcblx0XHRcdFx0XHRcdFx0aW1nLmltYWdlLmhlaWdodCxcclxuXHRcdFx0XHRcdFx0KTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGBBbHJlYWR5IHJlbmRlcmVkICR7dGlsZVZhbH1gKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKHRpbGVWYWwgIT09IFRpbGVUeXBlLkFpcikge1xyXG5cdFx0XHRcdFx0Ly8gRHJhdyB0aGUgY29ycmVjdCBpbWFnZSBmb3IgdGhlIHRpbGVzIG9udG8gdGhlIHRpbGVzIGxheWVyXHJcblx0XHRcdFx0XHRjb25zdCB0aWxlID0gV29ybGRUaWxlc1t0aWxlVmFsXTtcclxuXHJcblx0XHRcdFx0XHRpZiAodGlsZSA9PT0gdW5kZWZpbmVkKSBjb250aW51ZTtcclxuXHJcblx0XHRcdFx0XHRpZiAodGlsZS5jb25uZWN0ZWQgJiYgJ3JlbmRlclRpbGUnIGluIHRpbGUudGV4dHVyZSkge1xyXG5cdFx0XHRcdFx0XHQvLyBSZW5kZXIgY29ubmVjdGVkIHRpbGVzXHJcblx0XHRcdFx0XHRcdHRpbGUudGV4dHVyZS5yZW5kZXJUaWxlKFxyXG5cdFx0XHRcdFx0XHRcdHRoaXMuZmluZFRpbGVzZXRJbmRleChcclxuXHRcdFx0XHRcdFx0XHRcdHgsXHJcblx0XHRcdFx0XHRcdFx0XHR5LFxyXG5cdFx0XHRcdFx0XHRcdFx0dGlsZVZhbCxcclxuXHRcdFx0XHRcdFx0XHRcdFdvcmxkVGlsZXNbdGlsZVZhbF0/LmFueUNvbm5lY3Rpb24sXHJcblx0XHRcdFx0XHRcdFx0KSxcclxuXHRcdFx0XHRcdFx0XHR0aGlzLnRpbGVMYXllcixcclxuXHRcdFx0XHRcdFx0XHR5ICogZ2FtZS5USUxFX1dJRFRILFxyXG5cdFx0XHRcdFx0XHRcdHggKiBnYW1lLlRJTEVfSEVJR0hULFxyXG5cdFx0XHRcdFx0XHRcdGdhbWUuVElMRV9XSURUSCxcclxuXHRcdFx0XHRcdFx0XHRnYW1lLlRJTEVfSEVJR0hULFxyXG5cdFx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0Ly8gUmVuZGVyIG5vbi1jb25uZWN0ZWQgdGlsZXNcclxuXHRcdFx0XHRcdFx0dGlsZS50ZXh0dXJlLnJlbmRlcihcclxuXHRcdFx0XHRcdFx0XHR0aGlzLnRpbGVMYXllcixcclxuXHRcdFx0XHRcdFx0XHR5ICogZ2FtZS5USUxFX1dJRFRILFxyXG5cdFx0XHRcdFx0XHRcdHggKiBnYW1lLlRJTEVfSEVJR0hULFxyXG5cdFx0XHRcdFx0XHRcdGdhbWUuVElMRV9XSURUSCxcclxuXHRcdFx0XHRcdFx0XHRnYW1lLlRJTEVfSEVJR0hULFxyXG5cdFx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZHJhd1RpbGUodGlsZUluZGV4OiBudW1iZXIpIHtcclxuXHRcdGNvbnN0IHggPSB0aWxlSW5kZXggJSB0aGlzLndpZHRoO1xyXG5cdFx0Y29uc3QgeSA9IE1hdGguZmxvb3IodGlsZUluZGV4IC8gdGhpcy53aWR0aCk7XHJcblxyXG5cdFx0aWYgKHRoaXMud29ybGRUaWxlc1t0aWxlSW5kZXhdICE9PSBUaWxlVHlwZS5BaXIpIHtcclxuXHRcdFx0Ly8gRHJhdyB0aGUgY29ycmVjdCBpbWFnZSBmb3IgdGhlIHRpbGVzIG9udG8gdGhlIHRpbGVzIGxheWVyXHJcblxyXG5cdFx0XHRjb25zdCB0aWxlVmFsID0gdGhpcy53b3JsZFRpbGVzW3RpbGVJbmRleF07XHJcblxyXG5cdFx0XHRpZiAodHlwZW9mIHRpbGVWYWwgPT09ICdzdHJpbmcnKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMudGlsZUVudGl0aWVzW3RpbGVWYWxdID09PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoJ3RpbGUgZW50aXR5ICcgKyB0aWxlVmFsICsgJyBpcyB1bmRlZmluZWQnKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGNvbnN0IHRvcExlZnQgPSBNYXRoLm1pbihcclxuXHRcdFx0XHRcdC4uLnRoaXMudGlsZUVudGl0aWVzW3RpbGVWYWxdLmNvdmVyZWRUaWxlcyxcclxuXHRcdFx0XHQpO1xyXG5cdFx0XHRcdGlmICh0aWxlSW5kZXggPT09IHRvcExlZnQpIHtcclxuXHRcdFx0XHRcdC8vcmVuZGVyIHRpbGUgZW50aXR5IGltYWdlXHJcblx0XHRcdFx0XHQvL3RoaXMudGlsZUVudGl0aWVzW3RpbGVWYWxdLnJlbmRlcih0aWxlTGF5ZXIsIHgqOCwgeSo4KTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coYEFscmVhZHkgcmVuZGVyZWQgJHt0aWxlVmFsfWApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGNvbnN0IHRpbGUgPSBXb3JsZFRpbGVzW3RpbGVWYWxdO1xyXG5cclxuXHRcdFx0Ly8gaWYgdGhlIHRpbGVzIGlzIG9mZi1zY3JlZW5cclxuXHRcdFx0aWYgKHRpbGUgPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHRpbGUuY29ubmVjdGVkICYmICdyZW5kZXJUaWxlJyBpbiB0aWxlLnRleHR1cmUpIHtcclxuXHRcdFx0XHRsZXQgdG9wVGlsZUJvb2wgPSBmYWxzZTtcclxuXHRcdFx0XHRsZXQgbGVmdFRpbGVCb29sID0gZmFsc2U7XHJcblx0XHRcdFx0bGV0IGJvdHRvbVRpbGVCb29sID0gZmFsc2U7XHJcblx0XHRcdFx0bGV0IHJpZ2h0VGlsZUJvb2wgPSBmYWxzZTtcclxuXHRcdFx0XHRpZiAodGlsZS5hbnlDb25uZWN0aW9uKSB7XHJcblx0XHRcdFx0XHQvLyB0ZXN0IGlmIHRoZSBuZWlnaGJvcmluZyB0aWxlcyBhcmUgc29saWRcclxuXHRcdFx0XHRcdHRvcFRpbGVCb29sID1cclxuXHRcdFx0XHRcdFx0eCA9PT0gMCB8fFxyXG5cdFx0XHRcdFx0XHQodGhpcy53b3JsZFRpbGVzWyh5IC0gMSkgKiB0aGlzLndpZHRoICsgeF0gIT09XHJcblx0XHRcdFx0XHRcdFx0VGlsZVR5cGUuQWlyICYmXHJcblx0XHRcdFx0XHRcdFx0dHlwZW9mIHRoaXMud29ybGRUaWxlc1soeSAtIDEpICogdGhpcy53aWR0aCArIHhdICE9PVxyXG5cdFx0XHRcdFx0XHRcdFx0J3N0cmluZycpO1xyXG5cdFx0XHRcdFx0bGVmdFRpbGVCb29sID1cclxuXHRcdFx0XHRcdFx0eSA9PT0gMCB8fFxyXG5cdFx0XHRcdFx0XHQodGhpcy53b3JsZFRpbGVzW3kgKiB0aGlzLndpZHRoICsgeCAtIDFdICE9PVxyXG5cdFx0XHRcdFx0XHRcdFRpbGVUeXBlLkFpciAmJlxyXG5cdFx0XHRcdFx0XHRcdHR5cGVvZiB0aGlzLndvcmxkVGlsZXNbeSAqIHRoaXMud2lkdGggKyB4IC0gMV0gIT09XHJcblx0XHRcdFx0XHRcdFx0XHQnc3RyaW5nJyk7XHJcblx0XHRcdFx0XHRib3R0b21UaWxlQm9vbCA9XHJcblx0XHRcdFx0XHRcdHggPT09IHRoaXMuaGVpZ2h0IC0gMSB8fFxyXG5cdFx0XHRcdFx0XHQodGhpcy53b3JsZFRpbGVzWyh5ICsgMSkgKiB0aGlzLndpZHRoICsgeF0gIT09XHJcblx0XHRcdFx0XHRcdFx0VGlsZVR5cGUuQWlyICYmXHJcblx0XHRcdFx0XHRcdFx0dHlwZW9mIHRoaXMud29ybGRUaWxlc1soeSArIDEpICogdGhpcy53aWR0aCArIHhdICE9PVxyXG5cdFx0XHRcdFx0XHRcdFx0J3N0cmluZycpO1xyXG5cdFx0XHRcdFx0cmlnaHRUaWxlQm9vbCA9XHJcblx0XHRcdFx0XHRcdHkgPT09IHRoaXMud2lkdGggLSAxIHx8XHJcblx0XHRcdFx0XHRcdCh0aGlzLndvcmxkVGlsZXNbeSAqIHRoaXMud2lkdGggKyB4ICsgMV0gIT09XHJcblx0XHRcdFx0XHRcdFx0VGlsZVR5cGUuQWlyICYmXHJcblx0XHRcdFx0XHRcdFx0dHlwZW9mIHRoaXMud29ybGRUaWxlc1t5ICogdGhpcy53aWR0aCArIHggKyAxXSAhPT1cclxuXHRcdFx0XHRcdFx0XHRcdCdzdHJpbmcnKTtcclxuXHJcblx0XHRcdFx0XHQvLyBjb25zb2xlLmxvZyhbXCJib3JpbmdcIiwgbGVmdFRpbGVCb29sLCBib3R0b21UaWxlQm9vbCwgdGhpcy53b3JsZFRpbGVzW3ggKiB0aGlzLndpZHRoICsgeSArIDFdLCB0b3BUaWxlQm9vbF0pXHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdC8vIHRlc3QgaWYgdGhlIG5laWdoYm9yaW5nIHRpbGVzIGFyZSB0aGUgc2FtZSB0aWxlXHJcblx0XHRcdFx0XHR0b3BUaWxlQm9vbCA9XHJcblx0XHRcdFx0XHRcdHggPT09IDAgfHxcclxuXHRcdFx0XHRcdFx0dGhpcy53b3JsZFRpbGVzWyh5IC0gMSkgKiB0aGlzLndpZHRoICsgeF0gPT09IHRpbGVWYWw7XHJcblx0XHRcdFx0XHRsZWZ0VGlsZUJvb2wgPVxyXG5cdFx0XHRcdFx0XHR5ID09PSAwIHx8XHJcblx0XHRcdFx0XHRcdHRoaXMud29ybGRUaWxlc1t5ICogdGhpcy53aWR0aCArIHggLSAxXSA9PT0gdGlsZVZhbDtcclxuXHRcdFx0XHRcdGJvdHRvbVRpbGVCb29sID1cclxuXHRcdFx0XHRcdFx0eCA9PT0gdGhpcy5oZWlnaHQgLSAxIHx8XHJcblx0XHRcdFx0XHRcdHRoaXMud29ybGRUaWxlc1soeSArIDEpICogdGhpcy53aWR0aCArIHhdID09PSB0aWxlVmFsO1xyXG5cdFx0XHRcdFx0cmlnaHRUaWxlQm9vbCA9XHJcblx0XHRcdFx0XHRcdHkgPT09IHRoaXMud2lkdGggLSAxIHx8XHJcblx0XHRcdFx0XHRcdHRoaXMud29ybGRUaWxlc1t5ICogdGhpcy53aWR0aCArIHggKyAxXSA9PT0gdGlsZVZhbDtcclxuXHRcdFx0XHRcdC8vY29uc29sZS5sb2coW1wiZmFuY3lcIiwgbGVmdFRpbGVCb29sLCBib3R0b21UaWxlQm9vbCwgcmlnaHRUaWxlQm9vbCwgdG9wVGlsZUJvb2xdKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0aGlzLndvcmxkVGlsZXNbdGlsZUluZGV4ICsgMV0gIT09IFRpbGVUeXBlLkFpcjtcclxuXHJcblx0XHRcdFx0Ly8gY29udmVydCA0IGRpZ2l0IGJpbmFyeSBudW1iZXIgdG8gYmFzZSAxMFxyXG5cdFx0XHRcdGNvbnN0IHRpbGVTZXRJbmRleCA9XHJcblx0XHRcdFx0XHQ4ICogK3RvcFRpbGVCb29sICtcclxuXHRcdFx0XHRcdDQgKiArcmlnaHRUaWxlQm9vbCArXHJcblx0XHRcdFx0XHQyICogK2JvdHRvbVRpbGVCb29sICtcclxuXHRcdFx0XHRcdCtsZWZ0VGlsZUJvb2w7XHJcblxyXG5cdFx0XHRcdC8vIFJlbmRlciBjb25uZWN0ZWQgdGlsZXNcclxuXHRcdFx0XHR0aWxlLnRleHR1cmUucmVuZGVyVGlsZShcclxuXHRcdFx0XHRcdHRpbGVTZXRJbmRleCxcclxuXHRcdFx0XHRcdHRoaXMudGlsZUxheWVyLFxyXG5cdFx0XHRcdFx0eCAqIGdhbWUuVElMRV9XSURUSCxcclxuXHRcdFx0XHRcdHkgKiBnYW1lLlRJTEVfSEVJR0hULFxyXG5cdFx0XHRcdFx0Z2FtZS5USUxFX1dJRFRILFxyXG5cdFx0XHRcdFx0Z2FtZS5USUxFX0hFSUdIVCxcclxuXHRcdFx0XHQpO1xyXG5cdFx0XHR9IGVsc2UgaWYgKCF0aWxlLmNvbm5lY3RlZCkge1xyXG5cdFx0XHRcdC8vIFJlbmRlciBub24tY29ubmVjdGVkIHRpbGVzXHJcblx0XHRcdFx0dGlsZS50ZXh0dXJlLnJlbmRlcihcclxuXHRcdFx0XHRcdHRoaXMudGlsZUxheWVyLFxyXG5cdFx0XHRcdFx0eCAqIGdhbWUuVElMRV9XSURUSCxcclxuXHRcdFx0XHRcdHkgKiBnYW1lLlRJTEVfSEVJR0hULFxyXG5cdFx0XHRcdFx0Z2FtZS5USUxFX1dJRFRILFxyXG5cdFx0XHRcdFx0Z2FtZS5USUxFX0hFSUdIVCxcclxuXHRcdFx0XHQpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRmaW5kVGlsZXNldEluZGV4KFxyXG5cdFx0eDogbnVtYmVyLFxyXG5cdFx0eTogbnVtYmVyLFxyXG5cdFx0dGlsZVZhbDogVGlsZVR5cGUsXHJcblx0XHRhbnlDb25uZWN0aW9uPzogYm9vbGVhbixcclxuXHQpIHtcclxuXHRcdGxldCB0b3BUaWxlQm9vbCA9IGZhbHNlO1xyXG5cdFx0bGV0IGxlZnRUaWxlQm9vbCA9IGZhbHNlO1xyXG5cdFx0bGV0IGJvdHRvbVRpbGVCb29sID0gZmFsc2U7XHJcblx0XHRsZXQgcmlnaHRUaWxlQm9vbCA9IGZhbHNlO1xyXG5cdFx0aWYgKGFueUNvbm5lY3Rpb24pIHtcclxuXHRcdFx0Ly8gdGVzdCBpZiB0aGUgbmVpZ2hib3JpbmcgdGlsZXMgYXJlIHNvbGlkXHJcblx0XHRcdHRvcFRpbGVCb29sID1cclxuXHRcdFx0XHR4ID09PSAwIHx8XHJcblx0XHRcdFx0KHRoaXMud29ybGRUaWxlc1soeCAtIDEpICogdGhpcy53aWR0aCArIHldICE9PSBUaWxlVHlwZS5BaXIgJiYvL3ggYW5kIHkgYXBwZWFyIHRvIGJlIHN3aXRjaGVkXHJcblx0XHRcdFx0XHR0eXBlb2YgdGhpcy53b3JsZFRpbGVzWyh4IC0gMSkgKiB0aGlzLndpZHRoICsgeV0gPT1cclxuXHRcdFx0XHRcdFx0J251bWJlcicpO1xyXG5cdFx0XHRsZWZ0VGlsZUJvb2wgPVxyXG5cdFx0XHRcdHkgPT09IDAgfHxcclxuXHRcdFx0XHQodGhpcy53b3JsZFRpbGVzW3ggKiB0aGlzLndpZHRoICsgeSAtIDFdICE9PSBUaWxlVHlwZS5BaXIgJiZcclxuXHRcdFx0XHRcdHR5cGVvZiB0aGlzLndvcmxkVGlsZXNbeCAqIHRoaXMud2lkdGggKyB5IC0gMV0gPT1cclxuXHRcdFx0XHRcdFx0J251bWJlcicpO1xyXG5cdFx0XHRib3R0b21UaWxlQm9vbCA9XHJcblx0XHRcdFx0eCA9PT0gdGhpcy5oZWlnaHQgLSAxIHx8XHJcblx0XHRcdFx0KHRoaXMud29ybGRUaWxlc1soeCArIDEpICogdGhpcy53aWR0aCArIHldICE9PSBUaWxlVHlwZS5BaXIgJiZcclxuXHRcdFx0XHRcdHR5cGVvZiB0aGlzLndvcmxkVGlsZXNbKHggKyAxKSAqIHRoaXMud2lkdGggKyB5XSA9PVxyXG5cdFx0XHRcdFx0XHQnbnVtYmVyJyk7XHJcblx0XHRcdHJpZ2h0VGlsZUJvb2wgPVxyXG5cdFx0XHRcdHkgPT09IHRoaXMud2lkdGggLSAxIHx8XHJcblx0XHRcdFx0KHRoaXMud29ybGRUaWxlc1t4ICogdGhpcy53aWR0aCArIHkgKyAxXSAhPT0gVGlsZVR5cGUuQWlyICYmXHJcblx0XHRcdFx0XHR0eXBlb2YgdGhpcy53b3JsZFRpbGVzW3ggKiB0aGlzLndpZHRoICsgeSArIDFdID09XHJcblx0XHRcdFx0XHRcdCdudW1iZXInKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdC8vIHRlc3QgaWYgdGhlIG5laWdoYm9yaW5nIHRpbGVzIGFyZSB0aGUgc2FtZSB0aWxlXHJcblx0XHRcdHRvcFRpbGVCb29sID1cclxuXHRcdFx0XHR4ID09PSAwIHx8XHJcblx0XHRcdFx0dGhpcy53b3JsZFRpbGVzWyh4IC0gMSkgKiB0aGlzLndpZHRoICsgeV0gPT09IHRpbGVWYWw7XHJcblx0XHRcdGxlZnRUaWxlQm9vbCA9XHJcblx0XHRcdFx0eSA9PT0gMCB8fCB0aGlzLndvcmxkVGlsZXNbeCAqIHRoaXMud2lkdGggKyB5IC0gMV0gPT09IHRpbGVWYWw7XHJcblx0XHRcdGJvdHRvbVRpbGVCb29sID1cclxuXHRcdFx0XHR4ID09PSB0aGlzLmhlaWdodCAtIDEgfHxcclxuXHRcdFx0XHR0aGlzLndvcmxkVGlsZXNbKHggKyAxKSAqIHRoaXMud2lkdGggKyB5XSA9PT0gdGlsZVZhbDtcclxuXHRcdFx0cmlnaHRUaWxlQm9vbCA9XHJcblx0XHRcdFx0eSA9PT0gdGhpcy53aWR0aCAtIDEgfHxcclxuXHRcdFx0XHR0aGlzLndvcmxkVGlsZXNbeCAqIHRoaXMud2lkdGggKyB5ICsgMV0gPT09IHRpbGVWYWw7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gY29udmVydCA0IGRpZ2l0IGJpbmFyeSBudW1iZXIgdG8gYmFzZSAxMFxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0OCAqICt0b3BUaWxlQm9vbCArXHJcblx0XHRcdDQgKiArcmlnaHRUaWxlQm9vbCArXHJcblx0XHRcdDIgKiArYm90dG9tVGlsZUJvb2wgK1xyXG5cdFx0XHQrbGVmdFRpbGVCb29sXHJcblx0XHQpO1xyXG5cdH1cclxufVxyXG4iLCJpbXBvcnQgeyBJbWFnZVJlc291cmNlIH0gZnJvbSAnLi4vYXNzZXRzL3Jlc291cmNlcy9JbWFnZVJlc291cmNlJztcclxuaW1wb3J0IHsgV29ybGRBc3NldHMgfSBmcm9tICcuLi9hc3NldHMvQXNzZXRzJztcclxuaW1wb3J0IHsgVGlsZVJlc291cmNlIH0gZnJvbSAnLi4vYXNzZXRzL3Jlc291cmNlcy9UaWxlUmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBUaWxlVHlwZSB9IGZyb20gJy4uLy4uL2dsb2JhbC9UaWxlJztcclxuaW1wb3J0IHsgVGlsZUVudGl0aWVzIH0gZnJvbSAnLi4vLi4vZ2xvYmFsL1RpbGVFbnRpdHknO1xyXG5pbXBvcnQgeyBJdGVtVHlwZSB9IGZyb20gJy4uLy4uL2dsb2JhbC9JbnZlbnRvcnknO1xyXG5cclxuZXhwb3J0IHR5cGUgVGlsZSA9IHtcclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIHRleHR1cmU6IEltYWdlUmVzb3VyY2UgfCBUaWxlUmVzb3VyY2U7XHJcbiAgICBjb25uZWN0ZWQ/OiBib29sZWFuO1xyXG4gICAgYW55Q29ubmVjdGlvbj86IGJvb2xlYW47XHJcbiAgICBjb2xvcjogc3RyaW5nO1xyXG4gICAgZnJpY3Rpb246IG51bWJlcjtcclxuICAgIHJlZmxlY3Rpdml0eTogbnVtYmVyO1xyXG59XHJcblxyXG5leHBvcnQgdHlwZSBUaWxlRW50aXR5UmVuZGVyRGF0YSA9IHtcclxuICAgIHRleHR1cmU6IEltYWdlUmVzb3VyY2UgfCBUaWxlUmVzb3VyY2U7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBXb3JsZFRpbGVzOiBSZWNvcmQ8VGlsZVR5cGUsIFRpbGUgfCB1bmRlZmluZWQ+ID0ge1xyXG4gICAgW1RpbGVUeXBlLkFpcl06IHVuZGVmaW5lZCxcclxuICAgIFtUaWxlVHlwZS5Tbm93XToge1xyXG4gICAgICAgIG5hbWU6ICdzbm93JyxcclxuICAgICAgICB0ZXh0dXJlOiBXb3JsZEFzc2V0cy5taWRkbGVncm91bmQudGlsZXNldF9zbm93LFxyXG4gICAgICAgIGNvbm5lY3RlZDogdHJ1ZSxcclxuICAgICAgICBhbnlDb25uZWN0aW9uOiB0cnVlLFxyXG4gICAgICAgIGNvbG9yOiBcIiNjYWZhZmNcIixcclxuICAgICAgICBmcmljdGlvbjogMixcclxuICAgICAgICByZWZsZWN0aXZpdHk6IDUwXHJcbiAgICB9LFxyXG4gICAgW1RpbGVUeXBlLkljZV06IHtcclxuICAgICAgICBuYW1lOiAnaWNlJyxcclxuICAgICAgICB0ZXh0dXJlOiBXb3JsZEFzc2V0cy5taWRkbGVncm91bmQudGlsZXNldF9pY2UsXHJcbiAgICAgICAgY29ubmVjdGVkOiB0cnVlLFxyXG4gICAgICAgIGFueUNvbm5lY3Rpb246IHRydWUsXHJcbiAgICAgICAgY29sb3I6IFwiIzc2YWRjNFwiLFxyXG4gICAgICAgIGZyaWN0aW9uOiAxLjUsXHJcbiAgICAgICAgcmVmbGVjdGl2aXR5OiAyNTVcclxuICAgIH0sXHJcbiAgICBbVGlsZVR5cGUuRGlydF06IHtcclxuICAgICAgICBuYW1lOiAnZGlydCcsXHJcbiAgICAgICAgdGV4dHVyZTogV29ybGRBc3NldHMubWlkZGxlZ3JvdW5kLnRpbGVzZXRfZGlydCxcclxuICAgICAgICBjb25uZWN0ZWQ6IHRydWUsXHJcbiAgICAgICAgYW55Q29ubmVjdGlvbjogdHJ1ZSxcclxuICAgICAgICBjb2xvcjogXCIjNGEyZTFlXCIsXHJcbiAgICAgICAgZnJpY3Rpb246IDQsXHJcbiAgICAgICAgcmVmbGVjdGl2aXR5OiAwXHJcbiAgICB9LFxyXG4gICAgW1RpbGVUeXBlLlN0b25lMF06IHtcclxuICAgICAgICBuYW1lOiAncmF3IHN0b25lJyxcclxuICAgICAgICB0ZXh0dXJlOiBXb3JsZEFzc2V0cy5taWRkbGVncm91bmQudGlsZXNldF9zdG9uZTAsXHJcbiAgICAgICAgY29ubmVjdGVkOiB0cnVlLFxyXG4gICAgICAgIGFueUNvbm5lY3Rpb246IHRydWUsXHJcbiAgICAgICAgY29sb3I6IFwiIzQxNDI0NVwiLFxyXG4gICAgICAgIGZyaWN0aW9uOiAzLFxyXG4gICAgICAgIHJlZmxlY3Rpdml0eTogMTBcclxuICAgIH0sXHJcbiAgICBbVGlsZVR5cGUuU3RvbmUxXToge1xyXG4gICAgICAgIG5hbWU6ICdzdG9uZSB0aWVyIDEnLFxyXG4gICAgICAgIHRleHR1cmU6IFdvcmxkQXNzZXRzLm1pZGRsZWdyb3VuZC50aWxlc2V0X3N0b25lMSxcclxuICAgICAgICBjb25uZWN0ZWQ6IHRydWUsXHJcbiAgICAgICAgYW55Q29ubmVjdGlvbjogdHJ1ZSxcclxuICAgICAgICBjb2xvcjogXCIjMzEzMjNiXCIsXHJcbiAgICAgICAgZnJpY3Rpb246IDMsXHJcbiAgICAgICAgcmVmbGVjdGl2aXR5OiAxNVxyXG4gICAgfSxcclxuICAgIFtUaWxlVHlwZS5TdG9uZTJdOiB7XHJcbiAgICAgICAgbmFtZTogJ3N0b25lIHRpZXIgMicsXHJcbiAgICAgICAgdGV4dHVyZTogV29ybGRBc3NldHMubWlkZGxlZ3JvdW5kLnRpbGVzZXRfc3RvbmUyLFxyXG4gICAgICAgIGNvbm5lY3RlZDogdHJ1ZSxcclxuICAgICAgICBhbnlDb25uZWN0aW9uOiB0cnVlLFxyXG4gICAgICAgIGNvbG9yOiBcIiMzMTMyM2JcIiwvL1RPRE8gY2hhbmdlIHRoZXNlIGNvbG9ycyB0byBiZSBtb3JlIGFjY3VyYXRlXHJcbiAgICAgICAgZnJpY3Rpb246IDMsXHJcbiAgICAgICAgcmVmbGVjdGl2aXR5OiAxN1xyXG4gICAgfSxcclxuICAgIFtUaWxlVHlwZS5TdG9uZTNdOiB7XHJcbiAgICAgICAgbmFtZTogJ3N0b25lIHRpZXIgMycsXHJcbiAgICAgICAgdGV4dHVyZTogV29ybGRBc3NldHMubWlkZGxlZ3JvdW5kLnRpbGVzZXRfc3RvbmUzLFxyXG4gICAgICAgIGNvbm5lY3RlZDogdHJ1ZSxcclxuICAgICAgICBhbnlDb25uZWN0aW9uOiB0cnVlLFxyXG4gICAgICAgIGNvbG9yOiBcIiMzMTMyM2JcIixcclxuICAgICAgICBmcmljdGlvbjogMyxcclxuICAgICAgICByZWZsZWN0aXZpdHk6IDE5XHJcbiAgICB9LFxyXG4gICAgW1RpbGVUeXBlLlN0b25lNF06IHtcclxuICAgICAgICBuYW1lOiAnc3RvbmUgdGllciA0JyxcclxuICAgICAgICB0ZXh0dXJlOiBXb3JsZEFzc2V0cy5taWRkbGVncm91bmQudGlsZXNldF9zdG9uZTQsXHJcbiAgICAgICAgY29ubmVjdGVkOiB0cnVlLFxyXG4gICAgICAgIGFueUNvbm5lY3Rpb246IHRydWUsXHJcbiAgICAgICAgY29sb3I6IFwiIzMxMzIzYlwiLFxyXG4gICAgICAgIGZyaWN0aW9uOiAzLFxyXG4gICAgICAgIHJlZmxlY3Rpdml0eTogMjFcclxuICAgIH0sXHJcbiAgICBbVGlsZVR5cGUuU3RvbmU1XToge1xyXG4gICAgICAgIG5hbWU6ICdzdG9uZSB0aWVyIDUnLFxyXG4gICAgICAgIHRleHR1cmU6IFdvcmxkQXNzZXRzLm1pZGRsZWdyb3VuZC50aWxlc2V0X3N0b25lNSxcclxuICAgICAgICBjb25uZWN0ZWQ6IHRydWUsXHJcbiAgICAgICAgYW55Q29ubmVjdGlvbjogdHJ1ZSxcclxuICAgICAgICBjb2xvcjogXCIjMzEzMjNiXCIsXHJcbiAgICAgICAgZnJpY3Rpb246IDMsXHJcbiAgICAgICAgcmVmbGVjdGl2aXR5OiAyM1xyXG4gICAgfSxcclxuICAgIFtUaWxlVHlwZS5TdG9uZTZdOiB7XHJcbiAgICAgICAgbmFtZTogJ3N0b25lIHRpZXIgNicsXHJcbiAgICAgICAgdGV4dHVyZTogV29ybGRBc3NldHMubWlkZGxlZ3JvdW5kLnRpbGVzZXRfc3RvbmU2LFxyXG4gICAgICAgIGNvbm5lY3RlZDogdHJ1ZSxcclxuICAgICAgICBhbnlDb25uZWN0aW9uOiB0cnVlLFxyXG4gICAgICAgIGNvbG9yOiBcIiMzMTMyM2JcIixcclxuICAgICAgICBmcmljdGlvbjogMyxcclxuICAgICAgICByZWZsZWN0aXZpdHk6IDI1XHJcbiAgICB9LFxyXG4gICAgW1RpbGVUeXBlLlN0b25lN106IHtcclxuICAgICAgICBuYW1lOiAnc3RvbmUgdGllciA3JyxcclxuICAgICAgICB0ZXh0dXJlOiBXb3JsZEFzc2V0cy5taWRkbGVncm91bmQudGlsZXNldF9zdG9uZTcsXHJcbiAgICAgICAgY29ubmVjdGVkOiB0cnVlLFxyXG4gICAgICAgIGFueUNvbm5lY3Rpb246IHRydWUsXHJcbiAgICAgICAgY29sb3I6IFwiIzMxMzIzYlwiLFxyXG4gICAgICAgIGZyaWN0aW9uOiAzLFxyXG4gICAgICAgIHJlZmxlY3Rpdml0eTogMjdcclxuICAgIH0sXHJcbiAgICBbVGlsZVR5cGUuU3RvbmU4XToge1xyXG4gICAgICAgIG5hbWU6ICdzdG9uZSB0aWVyIDgnLFxyXG4gICAgICAgIHRleHR1cmU6IFdvcmxkQXNzZXRzLm1pZGRsZWdyb3VuZC50aWxlc2V0X3N0b25lOCxcclxuICAgICAgICBjb25uZWN0ZWQ6IHRydWUsXHJcbiAgICAgICAgYW55Q29ubmVjdGlvbjogdHJ1ZSxcclxuICAgICAgICBjb2xvcjogXCIjMzEzMjNiXCIsXHJcbiAgICAgICAgZnJpY3Rpb246IDMsXHJcbiAgICAgICAgcmVmbGVjdGl2aXR5OiAyOVxyXG4gICAgfSxcclxuICAgIFtUaWxlVHlwZS5TdG9uZTldOiB7XHJcbiAgICAgICAgbmFtZTogJ3N0b25lIHRpZXIgOScsXHJcbiAgICAgICAgdGV4dHVyZTogV29ybGRBc3NldHMubWlkZGxlZ3JvdW5kLnRpbGVzZXRfc3RvbmU5LFxyXG4gICAgICAgIGNvbm5lY3RlZDogdHJ1ZSxcclxuICAgICAgICBhbnlDb25uZWN0aW9uOiB0cnVlLFxyXG4gICAgICAgIGNvbG9yOiBcIiMzMTMyM2JcIixcclxuICAgICAgICBmcmljdGlvbjogMyxcclxuICAgICAgICByZWZsZWN0aXZpdHk6IDMxXHJcbiAgICB9LFxyXG4gICAgW1RpbGVUeXBlLlRpbl06IHtcclxuICAgICAgICBuYW1lOiAndGluIG9yZScsXHJcbiAgICAgICAgdGV4dHVyZTogV29ybGRBc3NldHMubWlkZGxlZ3JvdW5kLnRpbGVzZXRfdGluLFxyXG4gICAgICAgIGNvbm5lY3RlZDogdHJ1ZSxcclxuICAgICAgICBhbnlDb25uZWN0aW9uOiBmYWxzZSxcclxuICAgICAgICBjb2xvcjogXCIjMzEzMjNiXCIsXHJcbiAgICAgICAgZnJpY3Rpb246IDMsXHJcbiAgICAgICAgcmVmbGVjdGl2aXR5OiAxMFxyXG4gICAgfSxcclxuICAgIFtUaWxlVHlwZS5BbHVtaW51bV06IHtcclxuICAgICAgICBuYW1lOiAnYWx1bWludW0gb3JlJyxcclxuICAgICAgICB0ZXh0dXJlOiBXb3JsZEFzc2V0cy5taWRkbGVncm91bmQudGlsZXNldF9hbHVtaW51bSxcclxuICAgICAgICBjb25uZWN0ZWQ6IHRydWUsXHJcbiAgICAgICAgYW55Q29ubmVjdGlvbjogZmFsc2UsXHJcbiAgICAgICAgY29sb3I6IFwiIzMxMzIzYlwiLFxyXG4gICAgICAgIGZyaWN0aW9uOiAzLFxyXG4gICAgICAgIHJlZmxlY3Rpdml0eTogMTdcclxuICAgIH0sXHJcbiAgICBbVGlsZVR5cGUuR29sZF06IHtcclxuICAgICAgICBuYW1lOiAnZ29sZCBvcmUnLFxyXG4gICAgICAgIHRleHR1cmU6IFdvcmxkQXNzZXRzLm1pZGRsZWdyb3VuZC50aWxlc2V0X2dvbGQsXHJcbiAgICAgICAgY29ubmVjdGVkOiB0cnVlLFxyXG4gICAgICAgIGFueUNvbm5lY3Rpb246IGZhbHNlLFxyXG4gICAgICAgIGNvbG9yOiBcIiMzMTMyM2JcIixcclxuICAgICAgICBmcmljdGlvbjogMyxcclxuICAgICAgICByZWZsZWN0aXZpdHk6IDIxXHJcbiAgICB9LFxyXG4gICAgW1RpbGVUeXBlLlRpdGFuaXVtXToge1xyXG4gICAgICAgIG5hbWU6ICd0aXRhbml1bSBvcmUnLFxyXG4gICAgICAgIHRleHR1cmU6IFdvcmxkQXNzZXRzLm1pZGRsZWdyb3VuZC50aWxlc2V0X3RpdGFuaXVtLFxyXG4gICAgICAgIGNvbm5lY3RlZDogdHJ1ZSxcclxuICAgICAgICBhbnlDb25uZWN0aW9uOiBmYWxzZSxcclxuICAgICAgICBjb2xvcjogXCIjMzEzMjNiXCIsXHJcbiAgICAgICAgZnJpY3Rpb246IDMsXHJcbiAgICAgICAgcmVmbGVjdGl2aXR5OiAyNVxyXG4gICAgfSxcclxuICAgIFtUaWxlVHlwZS5HcmFwZV06IHtcclxuICAgICAgICBuYW1lOiAnZ3JhcGUgb3JlJyxcclxuICAgICAgICB0ZXh0dXJlOiBXb3JsZEFzc2V0cy5taWRkbGVncm91bmQudGlsZXNldF9ncmFwZSxcclxuICAgICAgICBjb25uZWN0ZWQ6IHRydWUsXHJcbiAgICAgICAgYW55Q29ubmVjdGlvbjogZmFsc2UsXHJcbiAgICAgICAgY29sb3I6IFwiIzMxMzIzYlwiLFxyXG4gICAgICAgIGZyaWN0aW9uOiAzLFxyXG4gICAgICAgIHJlZmxlY3Rpdml0eTogMjlcclxuICAgIH0sXHJcbiAgICBbVGlsZVR5cGUuV29vZDBdOiB7XHJcbiAgICAgICAgbmFtZTogJ3JhdyB3b29kJyxcclxuICAgICAgICB0ZXh0dXJlOiBXb3JsZEFzc2V0cy5taWRkbGVncm91bmQudGlsZXNldF93b29kMCxcclxuICAgICAgICBjb25uZWN0ZWQ6IGZhbHNlLFxyXG4gICAgICAgIGFueUNvbm5lY3Rpb246IHRydWUsXHJcbiAgICAgICAgY29sb3I6IFwiI2E3NzE0NVwiLFxyXG4gICAgICAgIGZyaWN0aW9uOiAzLFxyXG4gICAgICAgIHJlZmxlY3Rpdml0eTogNVxyXG4gICAgfSxcclxuICAgIFtUaWxlVHlwZS5Xb29kMV06IHtcclxuICAgICAgICBuYW1lOiAnd29vZCB0aWVyIDEnLFxyXG4gICAgICAgIHRleHR1cmU6IFdvcmxkQXNzZXRzLm1pZGRsZWdyb3VuZC50aWxlc2V0X3dvb2QxLFxyXG4gICAgICAgIGNvbm5lY3RlZDogdHJ1ZSxcclxuICAgICAgICBhbnlDb25uZWN0aW9uOiB0cnVlLFxyXG4gICAgICAgIGNvbG9yOiBcIiNhNzcxNDVcIixcclxuICAgICAgICBmcmljdGlvbjogMyxcclxuICAgICAgICByZWZsZWN0aXZpdHk6IDVcclxuICAgIH0sXHJcbiAgICBbVGlsZVR5cGUuV29vZDJdOiB7XHJcbiAgICAgICAgbmFtZTogJ3dvb2QgdGllciAyJyxcclxuICAgICAgICB0ZXh0dXJlOiBXb3JsZEFzc2V0cy5taWRkbGVncm91bmQudGlsZXNldF93b29kMixcclxuICAgICAgICBjb25uZWN0ZWQ6IHRydWUsXHJcbiAgICAgICAgYW55Q29ubmVjdGlvbjogdHJ1ZSxcclxuICAgICAgICBjb2xvcjogXCIjYTc3MTQ1XCIsXHJcbiAgICAgICAgZnJpY3Rpb246IDMsXHJcbiAgICAgICAgcmVmbGVjdGl2aXR5OiA1XHJcbiAgICB9LFxyXG4gICAgW1RpbGVUeXBlLldvb2QzXToge1xyXG4gICAgICAgIG5hbWU6ICd3b29kIHRpZXIgMycsXHJcbiAgICAgICAgdGV4dHVyZTogV29ybGRBc3NldHMubWlkZGxlZ3JvdW5kLnRpbGVzZXRfd29vZDMsXHJcbiAgICAgICAgY29ubmVjdGVkOiB0cnVlLFxyXG4gICAgICAgIGFueUNvbm5lY3Rpb246IHRydWUsXHJcbiAgICAgICAgY29sb3I6IFwiI2E3NzE0NVwiLFxyXG4gICAgICAgIGZyaWN0aW9uOiAzLFxyXG4gICAgICAgIHJlZmxlY3Rpdml0eTogNVxyXG4gICAgfSxcclxuICAgIFtUaWxlVHlwZS5Xb29kNF06IHtcclxuICAgICAgICBuYW1lOiAnd29vZCB0aWVyIDQnLFxyXG4gICAgICAgIHRleHR1cmU6IFdvcmxkQXNzZXRzLm1pZGRsZWdyb3VuZC50aWxlc2V0X3dvb2Q0LFxyXG4gICAgICAgIGNvbm5lY3RlZDogdHJ1ZSxcclxuICAgICAgICBhbnlDb25uZWN0aW9uOiB0cnVlLFxyXG4gICAgICAgIGNvbG9yOiBcIiNhNzcxNDVcIixcclxuICAgICAgICBmcmljdGlvbjogMyxcclxuICAgICAgICByZWZsZWN0aXZpdHk6IDVcclxuICAgIH0sXHJcbiAgICBbVGlsZVR5cGUuV29vZDVdOiB7XHJcbiAgICAgICAgbmFtZTogJ3dvb2QgdGllciA1JyxcclxuICAgICAgICB0ZXh0dXJlOiBXb3JsZEFzc2V0cy5taWRkbGVncm91bmQudGlsZXNldF93b29kNSxcclxuICAgICAgICBjb25uZWN0ZWQ6IHRydWUsXHJcbiAgICAgICAgYW55Q29ubmVjdGlvbjogdHJ1ZSxcclxuICAgICAgICBjb2xvcjogXCIjYTc3MTQ1XCIsXHJcbiAgICAgICAgZnJpY3Rpb246IDMsXHJcbiAgICAgICAgcmVmbGVjdGl2aXR5OiA1XHJcbiAgICB9LFxyXG4gICAgW1RpbGVUeXBlLldvb2Q2XToge1xyXG4gICAgICAgIG5hbWU6ICd3b29kIHRpZXIgNicsXHJcbiAgICAgICAgdGV4dHVyZTogV29ybGRBc3NldHMubWlkZGxlZ3JvdW5kLnRpbGVzZXRfd29vZDYsXHJcbiAgICAgICAgY29ubmVjdGVkOiB0cnVlLFxyXG4gICAgICAgIGFueUNvbm5lY3Rpb246IHRydWUsXHJcbiAgICAgICAgY29sb3I6IFwiI2E3NzE0NVwiLFxyXG4gICAgICAgIGZyaWN0aW9uOiAzLFxyXG4gICAgICAgIHJlZmxlY3Rpdml0eTogNVxyXG4gICAgfSxcclxuICAgIFtUaWxlVHlwZS5Xb29kN106IHtcclxuICAgICAgICBuYW1lOiAnd29vZCB0aWVyIDcnLFxyXG4gICAgICAgIHRleHR1cmU6IFdvcmxkQXNzZXRzLm1pZGRsZWdyb3VuZC50aWxlc2V0X3dvb2Q3LFxyXG4gICAgICAgIGNvbm5lY3RlZDogdHJ1ZSxcclxuICAgICAgICBhbnlDb25uZWN0aW9uOiB0cnVlLFxyXG4gICAgICAgIGNvbG9yOiBcIiNhNzcxNDVcIixcclxuICAgICAgICBmcmljdGlvbjogMyxcclxuICAgICAgICByZWZsZWN0aXZpdHk6IDVcclxuICAgIH0sXHJcbiAgICBbVGlsZVR5cGUuV29vZDhdOiB7XHJcbiAgICAgICAgbmFtZTogJ3dvb2QgdGllciA4JyxcclxuICAgICAgICB0ZXh0dXJlOiBXb3JsZEFzc2V0cy5taWRkbGVncm91bmQudGlsZXNldF93b29kOCxcclxuICAgICAgICBjb25uZWN0ZWQ6IHRydWUsXHJcbiAgICAgICAgYW55Q29ubmVjdGlvbjogdHJ1ZSxcclxuICAgICAgICBjb2xvcjogXCIjYTc3MTQ1XCIsXHJcbiAgICAgICAgZnJpY3Rpb246IDMsXHJcbiAgICAgICAgcmVmbGVjdGl2aXR5OiA1XHJcbiAgICB9LFxyXG4gICAgW1RpbGVUeXBlLldvb2Q5XToge1xyXG4gICAgICAgIG5hbWU6ICd3b29kIHRpZXIgOScsXHJcbiAgICAgICAgdGV4dHVyZTogV29ybGRBc3NldHMubWlkZGxlZ3JvdW5kLnRpbGVzZXRfd29vZDksXHJcbiAgICAgICAgY29ubmVjdGVkOiB0cnVlLFxyXG4gICAgICAgIGFueUNvbm5lY3Rpb246IHRydWUsXHJcbiAgICAgICAgY29sb3I6IFwiI2E3NzE0NVwiLFxyXG4gICAgICAgIGZyaWN0aW9uOiAzLFxyXG4gICAgICAgIHJlZmxlY3Rpdml0eTogNVxyXG4gICAgfSxcclxufTtcclxuXHJcbi8vIGV4cG9ydCBjb25zdCBUaWxlRW50aXRpZXNSZW5kZXJEYXRhOiBSZWNvcmQ8VGlsZUVudGl0aWVzLCBUaWxlRW50aXR5UmVuZGVyRGF0YT4gPSB7XHJcbiAgICAvLyBbVGlsZUVudGl0aWVzLlRpZXIxRHJpbGxdOiB7XHJcbiAgICAgICAgLy8gdGV4dHVyZTogdW5kZWZpbmVkXHJcbiAgICAvLyB9LFxyXG4gICAgLy8gW1RpbGVFbnRpdGllcy5UaWVyMkRyaWxsXToge1xyXG4gICAgICAgIC8vIHRleHR1cmU6IHVuZGVmaW5lZFxyXG4gICAgLy8gfVxyXG4vLyB9IiwiaW1wb3J0IHsgRW50aXRpZXMgfSBmcm9tICcuLi8uLi8uLi9nbG9iYWwvRW50aXR5JztcclxuaW1wb3J0IHsgUGxheWVyRW50aXR5IH0gZnJvbSAnLi9QbGF5ZXJFbnRpdHknO1xyXG5pbXBvcnQgeyBJdGVtRW50aXR5IH0gZnJvbSAnLi9JdGVtRW50aXR5JztcclxuXHJcbmV4cG9ydCBjb25zdCBFbnRpdHlDbGFzc2VzOiBSZWNvcmQ8RW50aXRpZXMsIGFueT4gPSB7XHJcbiAgICBbRW50aXRpZXMuTG9jYWxQbGF5ZXJdOiB1bmRlZmluZWQsXHJcbiAgICBbRW50aXRpZXMuUGxheWVyXTogUGxheWVyRW50aXR5LFxyXG4gICAgW0VudGl0aWVzLkl0ZW1dOiBJdGVtRW50aXR5LFxyXG59O1xyXG4iLCJpbXBvcnQgcDUgZnJvbSAncDUnO1xyXG5pbXBvcnQgeyBTZXJ2ZXJFbnRpdHkgfSBmcm9tICcuL1NlcnZlckVudGl0eSc7XHJcbmltcG9ydCB7IEVudGl0aWVzLCBFbnRpdHlQYXlsb2FkIH0gZnJvbSAnLi4vLi4vLi4vZ2xvYmFsL0VudGl0eSc7XHJcbmltcG9ydCB7IEl0ZW1zLCBJdGVtVHlwZSB9IGZyb20gJy4uLy4uLy4uL2dsb2JhbC9JbnZlbnRvcnknO1xyXG5pbXBvcnQgeyBJdGVtQXNzZXRzIH0gZnJvbSAnLi4vLi4vYXNzZXRzL0Fzc2V0cyc7XHJcblxyXG5leHBvcnQgY2xhc3MgSXRlbUVudGl0eSBleHRlbmRzIFNlcnZlckVudGl0eSB7XHJcbiAgICBpdGVtOiBJdGVtVHlwZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwYXlsb2FkOiBFbnRpdHlQYXlsb2FkPEVudGl0aWVzLkl0ZW0+KSB7XHJcbiAgICAgICAgc3VwZXIocGF5bG9hZC5pZCk7XHJcblxyXG4gICAgICAgIHRoaXMuaXRlbSA9IHBheWxvYWQuZGF0YS5pdGVtO1xyXG4gICAgICAgIHRoaXMueCA9IHBheWxvYWQuZGF0YS54O1xyXG4gICAgICAgIHRoaXMueSA9IHBheWxvYWQuZGF0YS55O1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcih0YXJnZXQ6IHA1LCB1cHNjYWxlU2l6ZTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgYXNzZXQgPSBJdGVtQXNzZXRzW3RoaXMuaXRlbV07XHJcbiAgICAgICAgaWYgKGFzc2V0ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgYXNzZXQucmVuZGVyKHRhcmdldCwgdGhpcy54LCB0aGlzLnksIDgsIDgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVEYXRhKGRhdGE6IEVudGl0eVBheWxvYWQ8RW50aXRpZXMuSXRlbT4pOiB2b2lkIHtcclxuICAgICAgICB0aGlzLml0ZW0gPSBkYXRhLmRhdGEuaXRlbTtcclxuICAgICAgICB0aGlzLnggPSBkYXRhLmRhdGEueDtcclxuICAgICAgICB0aGlzLnkgPSBkYXRhLmRhdGEueTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgcDUgZnJvbSAncDUnO1xyXG5pbXBvcnQgeyBTZXJ2ZXJFbnRpdHkgfSBmcm9tICcuL1NlcnZlckVudGl0eSc7XHJcbmltcG9ydCB7IEVudGl0aWVzLCBFbnRpdHlQYXlsb2FkIH0gZnJvbSAnLi4vLi4vLi4vZ2xvYmFsL0VudGl0eSc7XHJcbmltcG9ydCB7IGdhbWUgfSBmcm9tICcuLi8uLi9HYW1lJztcclxuXHJcbmV4cG9ydCBjbGFzcyBQbGF5ZXJFbnRpdHkgZXh0ZW5kcyBTZXJ2ZXJFbnRpdHkge1xyXG4gICAgd2lkdGg6IG51bWJlciA9IDEyIC8gZ2FtZS5USUxFX1dJRFRIO1xyXG4gICAgaGVpZ2h0OiBudW1iZXIgPSAyMCAvIGdhbWUuVElMRV9IRUlHSFQ7XHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZGF0YTogRW50aXR5UGF5bG9hZCkge1xyXG4gICAgICAgIHN1cGVyKGRhdGEuaWQpO1xyXG4gICAgICAgIGlmIChkYXRhLnR5cGUgPT09IEVudGl0aWVzLlBsYXllcikge1xyXG4gICAgICAgICAgICB0aGlzLm5hbWUgPSBkYXRhLmRhdGEubmFtZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlRGF0YShkYXRhOiBFbnRpdHlQYXlsb2FkKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKGRhdGEudHlwZSA9PT0gRW50aXRpZXMuUGxheWVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMubmFtZSA9IGRhdGEuZGF0YS5uYW1lO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIodGFyZ2V0OiBwNSwgdXBzY2FsZVNpemU6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHRhcmdldC5maWxsKDAsIDI1NSwgMCk7XHJcblxyXG4gICAgICAgIHRhcmdldC5yZWN0KFxyXG4gICAgICAgICAgICAodGhpcy54ICogZ2FtZS5USUxFX1dJRFRIIC1cclxuICAgICAgICAgICAgICAgIGdhbWUuaW50ZXJwb2xhdGVkQ2FtWCAqIGdhbWUuVElMRV9XSURUSCkgKlxyXG4gICAgICAgICAgICAgICAgdXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgICh0aGlzLnkgKiBnYW1lLlRJTEVfSEVJR0hUIC1cclxuICAgICAgICAgICAgICAgIGdhbWUuaW50ZXJwb2xhdGVkQ2FtWSAqIGdhbWUuVElMRV9IRUlHSFQpICpcclxuICAgICAgICAgICAgICAgIHVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICB0aGlzLndpZHRoICogdXBzY2FsZVNpemUgKiBnYW1lLlRJTEVfV0lEVEgsXHJcbiAgICAgICAgICAgIHRoaXMuaGVpZ2h0ICogdXBzY2FsZVNpemUgKiBnYW1lLlRJTEVfSEVJR0hUXHJcbiAgICAgICAgKTtcclxuICAgICAgICAvLyBSZW5kZXIgdGhlIGl0ZW0gcXVhbnRpdHkgbGFiZWxcclxuICAgICAgICB0YXJnZXQuZmlsbCgwKTtcclxuXHJcbiAgICAgICAgdGFyZ2V0Lm5vU3Ryb2tlKCk7XHJcblxyXG4gICAgICAgIHRhcmdldC50ZXh0U2l6ZSg1ICogdXBzY2FsZVNpemUpO1xyXG4gICAgICAgIHRhcmdldC50ZXh0QWxpZ24odGFyZ2V0LkNFTlRFUiwgdGFyZ2V0LlRPUCk7XHJcblxyXG4gICAgICAgIHRhcmdldC50ZXh0KFxyXG4gICAgICAgICAgICB0aGlzLm5hbWUsXHJcbiAgICAgICAgICAgICh0aGlzLnggKiBnYW1lLlRJTEVfV0lEVEggLVxyXG4gICAgICAgICAgICAgICAgZ2FtZS5pbnRlcnBvbGF0ZWRDYW1YICogZ2FtZS5USUxFX1dJRFRIICtcclxuICAgICAgICAgICAgICAgICh0aGlzLndpZHRoICogZ2FtZS5USUxFX1dJRFRIKSAvIDIpICpcclxuICAgICAgICAgICAgICAgIHVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICAodGhpcy55ICogZ2FtZS5USUxFX0hFSUdIVCAtXHJcbiAgICAgICAgICAgICAgICBnYW1lLmludGVycG9sYXRlZENhbVkgKiBnYW1lLlRJTEVfSEVJR0hUIC1cclxuICAgICAgICAgICAgICAgICh0aGlzLmhlaWdodCAqIGdhbWUuVElMRV9XSURUSCkgLyAyLjUpICpcclxuICAgICAgICAgICAgICAgIHVwc2NhbGVTaXplXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgcDUgZnJvbSAncDUnO1xyXG5pbXBvcnQgeyBSZW5kZXJhYmxlIH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9SZW5kZXJhYmxlJztcclxuaW1wb3J0IHsgRW50aXR5UGF5bG9hZCB9IGZyb20gJy4uLy4uLy4uL2dsb2JhbC9FbnRpdHknO1xyXG5cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFNlcnZlckVudGl0eSBpbXBsZW1lbnRzIFJlbmRlcmFibGUge1xyXG4gICAgZW50aXR5SWQ6IHN0cmluZztcclxuXHJcbiAgICB4OiBudW1iZXIgPSAwO1xyXG4gICAgeTogbnVtYmVyID0gMDtcclxuXHJcbiAgICBwcm90ZWN0ZWQgY29uc3RydWN0b3IoZW50aXR5SWQ6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuZW50aXR5SWQgPSBlbnRpdHlJZDtcclxuICAgIH1cclxuXHJcbiAgICBhYnN0cmFjdCB1cGRhdGVEYXRhKGRhdGE6IEVudGl0eVBheWxvYWQpOiB2b2lkO1xyXG5cclxuICAgIGFic3RyYWN0IHJlbmRlcih0YXJnZXQ6IHA1LCB1cHNjYWxlU2l6ZTogbnVtYmVyKTogdm9pZDtcclxufVxyXG4iLCJpbXBvcnQgeyBnYW1lIH0gZnJvbSBcIi4uLy4uL0dhbWVcIjtcclxuaW1wb3J0IHsgUGFydGljbGUgfSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9QYXJ0aWNsZVwiO1xyXG5pbXBvcnQgU2ltcGxleE5vaXNlIGZyb20gXCJzaW1wbGV4LW5vaXNlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQ29sb3JQYXJ0aWNsZSBpbXBsZW1lbnRzIFBhcnRpY2xlIHtcclxuICAgIGNvbG9yOiBzdHJpbmdcclxuICAgIHg6IG51bWJlcjtcclxuICAgIHk6IG51bWJlcjtcclxuICAgIHNpemU6IG51bWJlcjtcclxuICAgIHhWZWw6IG51bWJlcjtcclxuICAgIHlWZWw6IG51bWJlcjtcclxuICAgIGdyYXZpdHk6IGJvb2xlYW47XHJcbiAgICB3aW5kOiBib29sZWFuO1xyXG4gICAgYWdlOiBudW1iZXI7XHJcbiAgICBsaWZlc3BhbjogbnVtYmVyO1xyXG4gICAgbm9pc2U6IFNpbXBsZXhOb2lzZVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKGNvbG9yOiBzdHJpbmcsIHNpemU6IG51bWJlciwgbGlmZXNwYW46IG51bWJlciwgeDogbnVtYmVyLCB5OiBudW1iZXIsIHhWZWw/OiBudW1iZXIsIHlWZWw/OiBudW1iZXIsIGdyYXZpdHk/OiBib29sZWFuLCB3aW5kPzogYm9vbGVhbikge1xyXG4gICAgICAgIHRoaXMuY29sb3IgPSBjb2xvcjtcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICAgICAgdGhpcy54VmVsID0geFZlbCB8fCAwO1xyXG4gICAgICAgIHRoaXMueVZlbCA9IHlWZWwgfHwgMDtcclxuICAgICAgICB0aGlzLnNpemUgPSBzaXplO1xyXG4gICAgICAgIHRoaXMuZ3Jhdml0eSA9IHRydWU7Ly91c2luZyB0aGUgb3IgbW9kaWZpZXIgd2l0aCBib29sZWFucyBjYXVzZXMgYnVnczsgdGhlcmUncyBwcm9iYWJseSBhIGJldHRlciB3YXkgdG8gZG8gdGhpc1xyXG4gICAgICAgIGlmIChncmF2aXR5ICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHRoaXMuZ3Jhdml0eSA9IGdyYXZpdHk7XHJcblxyXG4gICAgICAgIHRoaXMud2luZCA9IGZhbHNlOy8vdXNpbmcgdGhlIG9yIG1vZGlmaWVyIHdpdGggYm9vbGVhbnMgY2F1c2VzIGJ1Z3M7IHRoZXJlJ3MgcHJvYmFibHkgYSBiZXR0ZXIgd2F5IHRvIGRvIHRoaXNcclxuICAgICAgICBpZiAod2luZCAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB0aGlzLndpbmQgPSB3aW5kO1xyXG4gICAgICAgIHRoaXMuYWdlID0gMDtcclxuICAgICAgICB0aGlzLmxpZmVzcGFuID0gbGlmZXNwYW47XHJcbiAgICAgICAgdGhpcy5ub2lzZSA9IG5ldyBTaW1wbGV4Tm9pc2UoXCJhc2RmYXNkZmFzZGZhc1wiKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIodGFyZ2V0OiBpbXBvcnQoXCJwNVwiKSwgdXBzY2FsZVNpemU6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLmFnZSAvIHRoaXMubGlmZXNwYW4gPCAwLjgpIHsvL2lmIGl0J3MgdW5kZXIgODAlIG9mIHRoZSBwYXJ0aWNsZSdzIGxpZmVzcGFuLCBkcmF3IG5vcm1hbGx5IHdpdGhvdXQgZmFkZVxyXG4gICAgICAgICAgICB0YXJnZXQuZmlsbCh0aGlzLmNvbG9yKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7Ly90aGlzIG1lYW5zIHRoYXQgdGhlIHBhcnRpY2xlIGlzIGFsbW9zdCBnb2luZyB0byBiZSBkZWxldGVkLCBzbyBmYWRpbmcgaXMgbmVjZXNzYXJ5XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbG9yLmxlbmd0aCA9PT0gNykgey8vaWYgdGhlcmUgaXMgbm8gdHJhbnNwYXJlbmN5IGJ5IGRlZmF1bHQsIGp1c3QgbWFwIHRoZSB0aGluZ3NcclxuICAgICAgICAgICAgICAgIGxldCB0cmFuc3BhcmVuY3lTdHJpbmcgPSBNYXRoLnJvdW5kKDI1NSAqICgtNSAqICh0aGlzLmFnZSAvIHRoaXMubGlmZXNwYW4pICsgNSkpLnRvU3RyaW5nKDE2KS5zdWJzdHJpbmcoMCwgMik7XHJcbiAgICAgICAgICAgICAgICBpZiAodHJhbnNwYXJlbmN5U3RyaW5nPT09dW5kZWZpbmVkIHx8IHRyYW5zcGFyZW5jeVN0cmluZy5sZW5ndGg9PT11bmRlZmluZWQpLy9jYXRjaCB3aGF0IGNvdWxkIGJlIGFuIGluZmluaXRlIGxvb3Agb3IganVzdCBhbiBlcnJvclxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcclxuICAgICAgICAgICAgICAgICAgICAgICAgYHVuZGVmaW5lZCB0cmFuc3BhcmVuY3kgc3RyaW5nIG9uIHBhcnRpY2xlYFxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSh0cmFuc3BhcmVuY3lTdHJpbmcubGVuZ3RoPDIpIHsvL21ha2Ugc3VyZSBpdCdzIDIgY2hhcmFjdGVycyBsb25nOyB0aGlzIHN0b3BzIHRoZSBjb21wdXRlciBmcm9tIGludGVycHJldGluZyAjZmYgZmYgZmYgNSBhcyAjZmYgZmYgZmYgNTUgaW5zdGVhZCBvZiAjZmYgZmYgZmYgMDVcclxuICAgICAgICAgICAgICAgICAgICB0cmFuc3BhcmVuY3lTdHJpbmcgPSBcIjBcIit0cmFuc3BhcmVuY3lTdHJpbmc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQuZmlsbCh0aGlzLmNvbG9yLnN1YnN0cmluZygwLCA3KSArIHRyYW5zcGFyZW5jeVN0cmluZyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7Ly9pZiB0aGVyZSBpcyB0cmFuc3BhcmVuY3ksIG11bHRpcGx5XHJcbiAgICAgICAgICAgICAgICBsZXQgdHJhbnNwYXJlbmN5U3RyaW5nID0gTWF0aC5yb3VuZChwYXJzZUludCh0aGlzLmNvbG9yLnN1YnN0cmluZyg3LCA5KSwgMTYpICogKC01ICogKHRoaXMuYWdlIC8gdGhpcy5saWZlc3BhbikgKyA1KSkudG9TdHJpbmcoMTYpLnN1YnN0cmluZygwLCAyKTtcclxuICAgICAgICAgICAgICAgIGlmICh0cmFuc3BhcmVuY3lTdHJpbmc9PT11bmRlZmluZWQgfHwgdHJhbnNwYXJlbmN5U3RyaW5nLmxlbmd0aD09PXVuZGVmaW5lZCkvL2NhdGNoIHdoYXQgY291bGQgYmUgYW4gaW5maW5pdGUgbG9vcCBvciBqdXN0IGFuIGVycm9yXHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBgdW5kZWZpbmVkIHRyYW5zcGFyZW5jeSBzdHJpbmcgb24gcGFydGljbGVgXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIHdoaWxlKHRyYW5zcGFyZW5jeVN0cmluZy5sZW5ndGg8Mikgey8vbWFrZSBzdXJlIGl0J3MgMiBjaGFyYWN0ZXJzIGxvbmc7IHRoaXMgc3RvcHMgdGhlIGNvbXB1dGVyIGZyb20gaW50ZXJwcmV0aW5nICNmZiBmZiBmZiA1IGFzICNmZiBmZiBmZiA1NSBpbnN0ZWFkIG9mICNmZiBmZiBmZiAwNVxyXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zcGFyZW5jeVN0cmluZyA9IFwiMFwiK3RyYW5zcGFyZW5jeVN0cmluZztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRhcmdldC5maWxsKHRoaXMuY29sb3Iuc3Vic3RyaW5nKDAsIDcpICsgdHJhbnNwYXJlbmN5U3RyaW5nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvL2RyYXcgYSByZWN0YW5nbGUgY2VudGVyZWQgb24gdGhlIHggYW5kIHkgcG9zaXRpb24gZmlsbGVkIHdpdGggdGhlIGNvbG9yIG9mIHRoZSBvYmplY3RcclxuICAgICAgICB0YXJnZXQucmVjdChcclxuICAgICAgICAgICAgKC10aGlzLnNpemUgLyAyICsgdGhpcy54ICogZ2FtZS5USUxFX1dJRFRIIC1cclxuICAgICAgICAgICAgICAgIGdhbWUuaW50ZXJwb2xhdGVkQ2FtWCAqIGdhbWUuVElMRV9XSURUSCkgKlxyXG4gICAgICAgICAgICB1cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgKC10aGlzLnNpemUgLyAyICsgdGhpcy55ICogZ2FtZS5USUxFX0hFSUdIVCAtXHJcbiAgICAgICAgICAgICAgICBnYW1lLmludGVycG9sYXRlZENhbVkgKiBnYW1lLlRJTEVfSEVJR0hUKSAqXHJcbiAgICAgICAgICAgIHVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICB0aGlzLnNpemUgKiB1cHNjYWxlU2l6ZSAqIGdhbWUuVElMRV9XSURUSCxcclxuICAgICAgICAgICAgdGhpcy5zaXplICogdXBzY2FsZVNpemUgKiBnYW1lLlRJTEVfSEVJR0hUXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICB0aWNrKCkge1xyXG4gICAgICAgIHRoaXMuYWdlKys7XHJcbiAgICAgICAgdGhpcy54ICs9IHRoaXMueFZlbDtcclxuICAgICAgICB0aGlzLnkgKz0gdGhpcy55VmVsO1xyXG4gICAgICAgIHRoaXMueFZlbCAtPSAoTWF0aC5hYnModGhpcy54VmVsKSAqIHRoaXMueFZlbCAqIGdhbWUuRFJBR19DT0VGRklDSUVOVCAqIHRoaXMuc2l6ZSk7Ly9hc3N1bWluZyBjb25zdGFudCBtYXNzIGZvciBlYWNoIHBhcnRpY2xlXHJcbiAgICAgICAgaWYgKHRoaXMuZ3Jhdml0eSkge1xyXG4gICAgICAgICAgICB0aGlzLnlWZWwgKz0gZ2FtZS5HUkFWSVRZX1NQRUVEO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy53aW5kKSB7XHJcbiAgICAgICAgICAgIHRoaXMueFZlbCArPSB0aGlzLm5vaXNlLm5vaXNlMkQodGhpcy54LzEwLCB0aGlzLnkvMTApLzQwXHJcbiAgICAgICAgICAgIHRoaXMueVZlbCArPSB0aGlzLm5vaXNlLm5vaXNlMkQodGhpcy55LzEwLCB0aGlzLngvMTApLzQwXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMueVZlbCAtPSAoTWF0aC5hYnModGhpcy55VmVsKSAqIHRoaXMueVZlbCAqIGdhbWUuRFJBR19DT0VGRklDSUVOVCAqIHRoaXMuc2l6ZSk7XHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IHsgSW52ZW50b3J5UGF5bG9hZCwgSXRlbVR5cGUgfSBmcm9tICcuL0ludmVudG9yeSc7XHJcblxyXG5leHBvcnQgZW51bSBFbnRpdGllcyB7XHJcblx0TG9jYWxQbGF5ZXIsXHJcblx0UGxheWVyLFxyXG5cdEl0ZW0sXHJcbn1cclxuXHJcbnR5cGUgRGF0YVBhaXJzPFQsIEsgZXh0ZW5kcyBrZXlvZiBUID0ga2V5b2YgVD4gPSBLIGV4dGVuZHMga2V5b2YgVFxyXG5cdD8geyB0eXBlOiBLOyBkYXRhOiBUW0tdIH1cclxuXHQ6IG5ldmVyO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBFbnRpdGllc0RhdGEge1xyXG5cdFtFbnRpdGllcy5Mb2NhbFBsYXllcl06IHtcclxuXHRcdG5hbWU6IHN0cmluZztcclxuXHRcdHg6IG51bWJlcjtcclxuXHRcdHk6IG51bWJlcjtcclxuXHR9O1xyXG5cdFtFbnRpdGllcy5QbGF5ZXJdOiB7IG5hbWU6IHN0cmluZyB9O1xyXG5cdFtFbnRpdGllcy5JdGVtXTogeyBpdGVtOiBJdGVtVHlwZTsgeDogbnVtYmVyOyB5OiBudW1iZXIgfTtcclxufVxyXG5cclxuZXhwb3J0IHR5cGUgRW50aXR5RGF0YTxUIGV4dGVuZHMgRW50aXRpZXMgPSBrZXlvZiBFbnRpdGllc0RhdGE+ID0gRGF0YVBhaXJzPFxyXG5cdEVudGl0aWVzRGF0YSxcclxuXHRUXHJcbj47XHJcblxyXG5leHBvcnQgdHlwZSBFbnRpdHlQYXlsb2FkPFQgZXh0ZW5kcyBFbnRpdGllcyA9IGtleW9mIEVudGl0aWVzRGF0YT4gPVxyXG5cdEVudGl0eURhdGE8VD4gJiB7IGlkOiBzdHJpbmcgfTtcclxuIiwiaW1wb3J0IHsgVGlsZVR5cGUgfSBmcm9tICcuL1RpbGUnO1xyXG5pbXBvcnQgeyBUaWxlRW50aXRpZXMgfSBmcm9tICcuL1RpbGVFbnRpdHknO1xyXG5cclxudHlwZSBEYXRhUGFpcnM8VCwgSyBleHRlbmRzIGtleW9mIFQgPSBrZXlvZiBUPiA9IEsgZXh0ZW5kcyBrZXlvZiBUXHJcblx0PyB7IHR5cGU6IEsgfSAmIFRbS11cclxuXHQ6IG5ldmVyO1xyXG5cclxuY29uc3QgaXRlbVR5cGVEYXRhID0gPEQsIFQgZXh0ZW5kcyBSZWNvcmQ8SXRlbVR5cGUsIERhdGFQYWlyczxDYXRlZ29yeURhdGE+Pj4oXHJcblx0ZGF0YTogVCxcclxuKTogVCA9PiBkYXRhO1xyXG5cclxuZXhwb3J0IGVudW0gSXRlbUNhdGVnb3JpZXMge1xyXG5cdFRpbGUsXHJcblx0UmVzb3VyY2UsXHJcblx0VG9vbCxcclxuXHRUaWxlRW50aXR5LFxyXG59XHJcblxyXG5leHBvcnQgdHlwZSBDYXRlZ29yeURhdGEgPSB7XHJcblx0W0l0ZW1DYXRlZ29yaWVzLlRpbGVdOiB7IHBsYWNlZFRpbGU6IFRpbGVUeXBlLCBtYXhTdGFja1NpemU/OiBudW1iZXJ9O1xyXG5cdFtJdGVtQ2F0ZWdvcmllcy5SZXNvdXJjZV06IHt9O1xyXG5cdFtJdGVtQ2F0ZWdvcmllcy5Ub29sXTogeyBicmVha2FibGVUaWxlczogVGlsZVR5cGVbXX07XHJcblx0W0l0ZW1DYXRlZ29yaWVzLlRpbGVFbnRpdHldOiB7IHBsYWNlZFRpbGVFbnRpdHk6IG51bWJlciwgdGlsZUVudGl0eU9mZnNldD86IFtudW1iZXIsIG51bWJlcl19O1xyXG59O1xyXG5cclxuZXhwb3J0IGVudW0gSXRlbVR5cGUge1xyXG5cdFNub3dCbG9jayxcclxuXHRJY2VCbG9jayxcclxuXHREaXJ0QmxvY2ssXHJcblx0U3RvbmUwQmxvY2ssXHJcblx0U3RvbmUxQmxvY2ssXHJcblx0U3RvbmUyQmxvY2ssXHJcblx0U3RvbmUzQmxvY2ssXHJcblx0U3RvbmU0QmxvY2ssXHJcblx0U3RvbmU1QmxvY2ssXHJcblx0U3RvbmU2QmxvY2ssXHJcblx0U3RvbmU3QmxvY2ssXHJcblx0U3RvbmU4QmxvY2ssXHJcblx0U3RvbmU5QmxvY2ssXHJcblx0VGluQmxvY2ssXHJcblx0QWx1bWludW1CbG9jayxcclxuXHRHb2xkQmxvY2ssXHJcblx0VGl0YW5pdW1CbG9jayxcclxuXHRHcmFwZUJsb2NrLFxyXG5cdFdvb2QwQmxvY2ssXHJcblx0V29vZDFCbG9jayxcclxuXHRXb29kMkJsb2NrLFxyXG5cdFdvb2QzQmxvY2ssXHJcblx0V29vZDRCbG9jayxcclxuXHRXb29kNUJsb2NrLFxyXG5cdFdvb2Q2QmxvY2ssXHJcblx0V29vZDdCbG9jayxcclxuXHRXb29kOEJsb2NrLFxyXG5cdFdvb2Q5QmxvY2ssXHJcblx0U2VlZCxcclxufVxyXG5cclxuZXhwb3J0IHR5cGUgSXRlbVN0YWNrID0ge1xyXG5cdHF1YW50aXR5OiBudW1iZXI7XHJcblx0aXRlbTogSXRlbVR5cGU7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgSXRlbXMgPSBpdGVtVHlwZURhdGEoe1xyXG5cdFtJdGVtVHlwZS5Tbm93QmxvY2tdOiB7XHJcblx0XHR0eXBlOiBJdGVtQ2F0ZWdvcmllcy5UaWxlLFxyXG5cdFx0cGxhY2VkVGlsZTogVGlsZVR5cGUuU25vdyxcclxuXHR9LFxyXG5cdFtJdGVtVHlwZS5JY2VCbG9ja106IHtcclxuXHRcdHR5cGU6IEl0ZW1DYXRlZ29yaWVzLlRpbGUsXHJcblx0XHRwbGFjZWRUaWxlOiBUaWxlVHlwZS5JY2UsXHJcblx0fSxcclxuXHRbSXRlbVR5cGUuRGlydEJsb2NrXToge1xyXG5cdFx0dHlwZTogSXRlbUNhdGVnb3JpZXMuVGlsZSxcclxuXHRcdHBsYWNlZFRpbGU6IFRpbGVUeXBlLkRpcnQsXHJcblx0fSxcclxuXHRbSXRlbVR5cGUuU3RvbmUwQmxvY2tdOiB7XHJcblx0XHR0eXBlOiBJdGVtQ2F0ZWdvcmllcy5UaWxlLFxyXG5cdFx0cGxhY2VkVGlsZTogVGlsZVR5cGUuU3RvbmUwLFxyXG5cdH0sXHJcblx0W0l0ZW1UeXBlLlN0b25lMUJsb2NrXToge1xyXG5cdFx0dHlwZTogSXRlbUNhdGVnb3JpZXMuVGlsZSxcclxuXHRcdHBsYWNlZFRpbGU6IFRpbGVUeXBlLlN0b25lMSxcclxuXHR9LFxyXG5cdFtJdGVtVHlwZS5TdG9uZTJCbG9ja106IHtcclxuXHRcdHR5cGU6IEl0ZW1DYXRlZ29yaWVzLlRpbGUsXHJcblx0XHRwbGFjZWRUaWxlOiBUaWxlVHlwZS5TdG9uZTIsXHJcblx0fSxcclxuXHRbSXRlbVR5cGUuU3RvbmUzQmxvY2tdOiB7XHJcblx0XHR0eXBlOiBJdGVtQ2F0ZWdvcmllcy5UaWxlLFxyXG5cdFx0cGxhY2VkVGlsZTogVGlsZVR5cGUuU3RvbmUzLFxyXG5cdH0sXHJcblx0W0l0ZW1UeXBlLlN0b25lNEJsb2NrXToge1xyXG5cdFx0dHlwZTogSXRlbUNhdGVnb3JpZXMuVGlsZSxcclxuXHRcdHBsYWNlZFRpbGU6IFRpbGVUeXBlLlN0b25lNCxcclxuXHR9LFxyXG5cdFtJdGVtVHlwZS5TdG9uZTVCbG9ja106IHtcclxuXHRcdHR5cGU6IEl0ZW1DYXRlZ29yaWVzLlRpbGUsXHJcblx0XHRwbGFjZWRUaWxlOiBUaWxlVHlwZS5TdG9uZTUsXHJcblx0fSxcclxuXHRbSXRlbVR5cGUuU3RvbmU2QmxvY2tdOiB7XHJcblx0XHR0eXBlOiBJdGVtQ2F0ZWdvcmllcy5UaWxlLFxyXG5cdFx0cGxhY2VkVGlsZTogVGlsZVR5cGUuU3RvbmU2LFxyXG5cdH0sXHJcblx0W0l0ZW1UeXBlLlN0b25lN0Jsb2NrXToge1xyXG5cdFx0dHlwZTogSXRlbUNhdGVnb3JpZXMuVGlsZSxcclxuXHRcdHBsYWNlZFRpbGU6IFRpbGVUeXBlLlN0b25lNyxcclxuXHR9LFxyXG5cdFtJdGVtVHlwZS5TdG9uZThCbG9ja106IHtcclxuXHRcdHR5cGU6IEl0ZW1DYXRlZ29yaWVzLlRpbGUsXHJcblx0XHRwbGFjZWRUaWxlOiBUaWxlVHlwZS5TdG9uZTgsXHJcblx0fSxcclxuXHRbSXRlbVR5cGUuU3RvbmU5QmxvY2tdOiB7XHJcblx0XHR0eXBlOiBJdGVtQ2F0ZWdvcmllcy5UaWxlLFxyXG5cdFx0cGxhY2VkVGlsZTogVGlsZVR5cGUuU3RvbmU5LFxyXG5cdH0sXHJcblx0W0l0ZW1UeXBlLlRpbkJsb2NrXToge1xyXG5cdFx0dHlwZTogSXRlbUNhdGVnb3JpZXMuVGlsZSxcclxuXHRcdHBsYWNlZFRpbGU6IFRpbGVUeXBlLlRpbixcclxuXHR9LFxyXG5cdFtJdGVtVHlwZS5BbHVtaW51bUJsb2NrXToge1xyXG5cdFx0dHlwZTogSXRlbUNhdGVnb3JpZXMuVGlsZSxcclxuXHRcdHBsYWNlZFRpbGU6IFRpbGVUeXBlLkFsdW1pbnVtLFxyXG5cdH0sXHJcblx0W0l0ZW1UeXBlLkdvbGRCbG9ja106IHtcclxuXHRcdHR5cGU6IEl0ZW1DYXRlZ29yaWVzLlRpbGUsXHJcblx0XHRwbGFjZWRUaWxlOiBUaWxlVHlwZS5Hb2xkLFxyXG5cdH0sXHJcblx0W0l0ZW1UeXBlLlRpdGFuaXVtQmxvY2tdOiB7XHJcblx0XHR0eXBlOiBJdGVtQ2F0ZWdvcmllcy5UaWxlLFxyXG5cdFx0cGxhY2VkVGlsZTogVGlsZVR5cGUuVGl0YW5pdW0sXHJcblx0fSxcclxuXHRbSXRlbVR5cGUuR3JhcGVCbG9ja106IHtcclxuXHRcdHR5cGU6IEl0ZW1DYXRlZ29yaWVzLlRpbGUsXHJcblx0XHRwbGFjZWRUaWxlOiBUaWxlVHlwZS5HcmFwZSxcclxuXHR9LFxyXG5cdFtJdGVtVHlwZS5Xb29kMEJsb2NrXToge1xyXG5cdFx0dHlwZTogSXRlbUNhdGVnb3JpZXMuVGlsZSxcclxuXHRcdHBsYWNlZFRpbGU6IFRpbGVUeXBlLldvb2QwLFxyXG5cdH0sXHJcblx0W0l0ZW1UeXBlLldvb2QxQmxvY2tdOiB7XHJcblx0XHR0eXBlOiBJdGVtQ2F0ZWdvcmllcy5UaWxlLFxyXG5cdFx0cGxhY2VkVGlsZTogVGlsZVR5cGUuV29vZDEsXHJcblx0fSxcclxuXHRbSXRlbVR5cGUuV29vZDJCbG9ja106IHtcclxuXHRcdHR5cGU6IEl0ZW1DYXRlZ29yaWVzLlRpbGUsXHJcblx0XHRwbGFjZWRUaWxlOiBUaWxlVHlwZS5Xb29kMixcclxuXHR9LFxyXG5cdFtJdGVtVHlwZS5Xb29kM0Jsb2NrXToge1xyXG5cdFx0dHlwZTogSXRlbUNhdGVnb3JpZXMuVGlsZSxcclxuXHRcdHBsYWNlZFRpbGU6IFRpbGVUeXBlLldvb2QzLFxyXG5cdH0sXHJcblx0W0l0ZW1UeXBlLldvb2Q0QmxvY2tdOiB7XHJcblx0XHR0eXBlOiBJdGVtQ2F0ZWdvcmllcy5UaWxlLFxyXG5cdFx0cGxhY2VkVGlsZTogVGlsZVR5cGUuV29vZDQsXHJcblx0fSxcclxuXHRbSXRlbVR5cGUuV29vZDVCbG9ja106IHtcclxuXHRcdHR5cGU6IEl0ZW1DYXRlZ29yaWVzLlRpbGUsXHJcblx0XHRwbGFjZWRUaWxlOiBUaWxlVHlwZS5Xb29kNSxcclxuXHR9LFxyXG5cdFtJdGVtVHlwZS5Xb29kNkJsb2NrXToge1xyXG5cdFx0dHlwZTogSXRlbUNhdGVnb3JpZXMuVGlsZSxcclxuXHRcdHBsYWNlZFRpbGU6IFRpbGVUeXBlLldvb2Q2LFxyXG5cdH0sXHJcblx0W0l0ZW1UeXBlLldvb2Q3QmxvY2tdOiB7XHJcblx0XHR0eXBlOiBJdGVtQ2F0ZWdvcmllcy5UaWxlLFxyXG5cdFx0cGxhY2VkVGlsZTogVGlsZVR5cGUuV29vZDcsXHJcblx0fSxcclxuXHRbSXRlbVR5cGUuV29vZDhCbG9ja106IHtcclxuXHRcdHR5cGU6IEl0ZW1DYXRlZ29yaWVzLlRpbGUsXHJcblx0XHRwbGFjZWRUaWxlOiBUaWxlVHlwZS5Xb29kOCxcclxuXHR9LFxyXG5cdFtJdGVtVHlwZS5Xb29kOUJsb2NrXToge1xyXG5cdFx0dHlwZTogSXRlbUNhdGVnb3JpZXMuVGlsZSxcclxuXHRcdHBsYWNlZFRpbGU6IFRpbGVUeXBlLldvb2Q5LFxyXG5cdH0sXHJcblx0W0l0ZW1UeXBlLlNlZWRdOiB7XHJcblx0XHR0eXBlOiBJdGVtQ2F0ZWdvcmllcy5UaWxlRW50aXR5LFxyXG5cdFx0cGxhY2VkVGlsZUVudGl0eTogVGlsZUVudGl0aWVzLlNlZWQsXHJcblx0XHR0aWxlRW50aXR5T2Zmc2V0OiBbLTEsIC02XSxcclxuXHR9LFxyXG5cdC8vIFtJdGVtVHlwZS5UaW5QaWNrYXhlXToge1xyXG5cdC8vIFx0dHlwZTogSXRlbUNhdGVnb3JpZXMuVG9vbCxcclxuXHQvLyBcdGJyZWFrYWJsZVRpbGVzOiBbVGlsZVR5cGUuU25vdywgVGlsZVR5cGUuSWNlLCBUaWxlVHlwZS5EaXJ0LCBUaWxlVHlwZS5Xb29kMCwgVGlsZVR5cGUuU3RvbmUwLCBUaWxlVHlwZS5TdG9uZTEsIFRpbGVUeXBlLlRpbiwgVGlsZVR5cGUuQWx1bWludW1dXHJcblx0Ly8gfVxyXG59KTtcclxuXHJcbmV4cG9ydCB0eXBlIEludmVudG9yeVVwZGF0ZVBheWxvYWQgPSB7XHJcblx0c2xvdDogbnVtYmVyO1xyXG5cdGl0ZW06IEl0ZW1TdGFjayB8IHVuZGVmaW5lZDtcclxufVtdO1xyXG5cclxuZXhwb3J0IHR5cGUgSW52ZW50b3J5UGF5bG9hZCA9IHtcclxuXHRpdGVtczogKEl0ZW1TdGFjayB8IHVuZGVmaW5lZClbXTtcclxuXHJcblx0d2lkdGg6IG51bWJlcjtcclxuXHRoZWlnaHQ6IG51bWJlcjtcclxufTtcclxuIiwiZXhwb3J0IGVudW0gVGlsZVR5cGUge1xyXG5cdEFpcixcclxuXHRTbm93LFxyXG5cdEljZSxcclxuXHREaXJ0LFxyXG5cdFN0b25lMCxcclxuXHRTdG9uZTEsXHJcblx0U3RvbmUyLFxyXG5cdFN0b25lMyxcclxuXHRTdG9uZTQsXHJcblx0U3RvbmU1LFxyXG5cdFN0b25lNixcclxuXHRTdG9uZTcsXHJcblx0U3RvbmU4LFxyXG5cdFN0b25lOSxcclxuXHRUaW4sXHJcblx0QWx1bWludW0sXHJcblx0R29sZCxcclxuXHRUaXRhbml1bSxcclxuXHRHcmFwZSxcclxuXHRXb29kMCxcclxuXHRXb29kMSxcclxuXHRXb29kMixcclxuXHRXb29kMyxcclxuXHRXb29kNCxcclxuXHRXb29kNSxcclxuXHRXb29kNixcclxuXHRXb29kNyxcclxuXHRXb29kOCxcclxuXHRXb29kOSxcclxufSIsImV4cG9ydCBlbnVtIFRpbGVFbnRpdGllcyB7XHJcblx0VHJlZSxcclxuXHRUaWVyMURyaWxsLFxyXG5cdFRpZXIyRHJpbGwsXHJcblx0VGllcjNEcmlsbCxcclxuXHRUaWVyNERyaWxsLFxyXG5cdFRpZXI1RHJpbGwsXHJcblx0Q3JhZnRpbmdCZW5jaCxcclxuXHRTZWVkLFxyXG59XHJcblxyXG50eXBlIERhdGFQYWlyczxULCBLIGV4dGVuZHMga2V5b2YgVCA9IGtleW9mIFQ+ID0gSyBleHRlbmRzIGtleW9mIFRcclxuXHQ/IHsgdHlwZV86IEs7IGRhdGE6IFRbS10gfVxyXG5cdDogbmV2ZXI7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFRpbGVFbnRpdGllc0RhdGEge1xyXG5cdFtUaWxlRW50aXRpZXMuVHJlZV06IHsgd29vZENvdW50OiBudW1iZXI7IHNlZWRDb3VudDogbnVtYmVyIH07XHJcblx0W1RpbGVFbnRpdGllcy5UaWVyMURyaWxsXTogeyAgfTtcclxuXHRbVGlsZUVudGl0aWVzLlRpZXIyRHJpbGxdOiB7ICB9O1xyXG5cdFtUaWxlRW50aXRpZXMuVGllcjNEcmlsbF06IHsgIH07XHJcblx0W1RpbGVFbnRpdGllcy5UaWVyNERyaWxsXTogeyAgfTtcclxuXHRbVGlsZUVudGl0aWVzLlRpZXI1RHJpbGxdOiB7ICB9O1xyXG5cdFtUaWxlRW50aXRpZXMuQ3JhZnRpbmdCZW5jaF06IHsgIH07XHJcblx0W1RpbGVFbnRpdGllcy5TZWVkXTogeyAgfTtcclxufVxyXG5cclxuZXhwb3J0IHR5cGUgVGlsZUVudGl0eURhdGEgPSBEYXRhUGFpcnM8VGlsZUVudGl0aWVzRGF0YT4gJiB7XHJcblx0YW5pbWF0ZTogYm9vbGVhbjtcclxuXHRhbmltRnJhbWU6IG51bWJlcjtcclxufTtcclxuXHJcbmV4cG9ydCB0eXBlIFRpbGVFbnRpdHlQYXlsb2FkID0ge1xyXG5cdGlkOiBzdHJpbmc7XHJcblx0Y292ZXJlZFRpbGVzOiBudW1iZXJbXTtcclxuXHRwYXlsb2FkOiBUaWxlRW50aXR5RGF0YTtcclxufTtcclxuXHJcbmV4cG9ydCBlbnVtIFRpbGVFbnRpdHlUZXh0dXJlcyB7XHJcblx0VHJlZTEsXHJcblx0VHJlZTIsXHJcblx0VHJlZTMsXHJcblx0VHJlZTQsXHJcblx0VHJlZTUsXHJcblx0VHJlZTYsXHJcblx0VHJlZTcsXHJcblx0VHJlZTgsXHJcblx0VHJlZTksXHJcblx0VHJlZTEwLFxyXG59XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuIiwidmFyIGRlZmVycmVkID0gW107XG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8gPSAocmVzdWx0LCBjaHVua0lkcywgZm4sIHByaW9yaXR5KSA9PiB7XG5cdGlmKGNodW5rSWRzKSB7XG5cdFx0cHJpb3JpdHkgPSBwcmlvcml0eSB8fCAwO1xuXHRcdGZvcih2YXIgaSA9IGRlZmVycmVkLmxlbmd0aDsgaSA+IDAgJiYgZGVmZXJyZWRbaSAtIDFdWzJdID4gcHJpb3JpdHk7IGktLSkgZGVmZXJyZWRbaV0gPSBkZWZlcnJlZFtpIC0gMV07XG5cdFx0ZGVmZXJyZWRbaV0gPSBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV07XG5cdFx0cmV0dXJuO1xuXHR9XG5cdHZhciBub3RGdWxmaWxsZWQgPSBJbmZpbml0eTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZWZlcnJlZC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV0gPSBkZWZlcnJlZFtpXTtcblx0XHR2YXIgZnVsZmlsbGVkID0gdHJ1ZTtcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGNodW5rSWRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRpZiAoKHByaW9yaXR5ICYgMSA9PT0gMCB8fCBub3RGdWxmaWxsZWQgPj0gcHJpb3JpdHkpICYmIE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uTykuZXZlcnkoKGtleSkgPT4gKF9fd2VicGFja19yZXF1aXJlX18uT1trZXldKGNodW5rSWRzW2pdKSkpKSB7XG5cdFx0XHRcdGNodW5rSWRzLnNwbGljZShqLS0sIDEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZnVsZmlsbGVkID0gZmFsc2U7XG5cdFx0XHRcdGlmKHByaW9yaXR5IDwgbm90RnVsZmlsbGVkKSBub3RGdWxmaWxsZWQgPSBwcmlvcml0eTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYoZnVsZmlsbGVkKSB7XG5cdFx0XHRkZWZlcnJlZC5zcGxpY2UoaS0tLCAxKVxuXHRcdFx0dmFyIHIgPSBmbigpO1xuXHRcdFx0aWYgKHIgIT09IHVuZGVmaW5lZCkgcmVzdWx0ID0gcjtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn07IiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmcgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpIHJldHVybiBnbG9iYWxUaGlzO1xuXHR0cnkge1xuXHRcdHJldHVybiB0aGlzIHx8IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSByZXR1cm4gd2luZG93O1xuXHR9XG59KSgpOyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBubyBiYXNlVVJJXG5cbi8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4vLyB1bmRlZmluZWQgPSBjaHVuayBub3QgbG9hZGVkLCBudWxsID0gY2h1bmsgcHJlbG9hZGVkL3ByZWZldGNoZWRcbi8vIFtyZXNvbHZlLCByZWplY3QsIFByb21pc2VdID0gY2h1bmsgbG9hZGluZywgMCA9IGNodW5rIGxvYWRlZFxudmFyIGluc3RhbGxlZENodW5rcyA9IHtcblx0XCJtYWluXCI6IDBcbn07XG5cbi8vIG5vIGNodW5rIG9uIGRlbWFuZCBsb2FkaW5nXG5cbi8vIG5vIHByZWZldGNoaW5nXG5cbi8vIG5vIHByZWxvYWRlZFxuXG4vLyBubyBITVJcblxuLy8gbm8gSE1SIG1hbmlmZXN0XG5cbl9fd2VicGFja19yZXF1aXJlX18uTy5qID0gKGNodW5rSWQpID0+IChpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPT09IDApO1xuXG4vLyBpbnN0YWxsIGEgSlNPTlAgY2FsbGJhY2sgZm9yIGNodW5rIGxvYWRpbmdcbnZhciB3ZWJwYWNrSnNvbnBDYWxsYmFjayA9IChwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbiwgZGF0YSkgPT4ge1xuXHR2YXIgW2NodW5rSWRzLCBtb3JlTW9kdWxlcywgcnVudGltZV0gPSBkYXRhO1xuXHQvLyBhZGQgXCJtb3JlTW9kdWxlc1wiIHRvIHRoZSBtb2R1bGVzIG9iamVjdCxcblx0Ly8gdGhlbiBmbGFnIGFsbCBcImNodW5rSWRzXCIgYXMgbG9hZGVkIGFuZCBmaXJlIGNhbGxiYWNrXG5cdHZhciBtb2R1bGVJZCwgY2h1bmtJZCwgaSA9IDA7XG5cdGlmKGNodW5rSWRzLnNvbWUoKGlkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2lkXSAhPT0gMCkpKSB7XG5cdFx0Zm9yKG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XG5cdFx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8obW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuXHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLm1bbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihydW50aW1lKSB2YXIgcmVzdWx0ID0gcnVudGltZShfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblx0fVxuXHRpZihwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbikgcGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24oZGF0YSk7XG5cdGZvcig7aSA8IGNodW5rSWRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0Y2h1bmtJZCA9IGNodW5rSWRzW2ldO1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhpbnN0YWxsZWRDaHVua3MsIGNodW5rSWQpICYmIGluc3RhbGxlZENodW5rc1tjaHVua0lkXSkge1xuXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdWzBdKCk7XG5cdFx0fVxuXHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9IDA7XG5cdH1cblx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18uTyhyZXN1bHQpO1xufVxuXG52YXIgY2h1bmtMb2FkaW5nR2xvYmFsID0gc2VsZltcIndlYnBhY2tDaHVua3Nub3dlZF9pblwiXSA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtzbm93ZWRfaW5cIl0gfHwgW107XG5jaHVua0xvYWRpbmdHbG9iYWwuZm9yRWFjaCh3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIDApKTtcbmNodW5rTG9hZGluZ0dsb2JhbC5wdXNoID0gd2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCBjaHVua0xvYWRpbmdHbG9iYWwucHVzaC5iaW5kKGNodW5rTG9hZGluZ0dsb2JhbCkpOyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgZGVwZW5kcyBvbiBvdGhlciBsb2FkZWQgY2h1bmtzIGFuZCBleGVjdXRpb24gbmVlZCB0byBiZSBkZWxheWVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyh1bmRlZmluZWQsIFtcIm1vZHVsZXMtbWFpblwiXSwgKCkgPT4gKF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9jbGllbnQvR2FtZS50c1wiKSkpXG5fX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKF9fd2VicGFja19leHBvcnRzX18pO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9