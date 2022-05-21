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
        if (this.mouseIsPressed) {
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
        this.drawingContext.globalAlpha = 0.6; //make image translucent
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
        for (let cloud of this.clouds) {
            cloud.tick();
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
                console.log(entities);
                let tileEntities2 = {};
                tileEntities.forEach(tileEntity => {
                    console.log('adding tile entity: ' + tileEntity.id);
                    tileEntities2[tileEntity.id] = {
                        id: tileEntity.id,
                        coveredTiles: tileEntity.coveredTiles,
                        type_: tileEntity.payload.type_,
                        data: tileEntity.payload.data,
                        animFrame: randint(0, _assets_Assets__WEBPACK_IMPORTED_MODULE_5__.WorldAssets.tileEntities[tileEntity.payload.type_].length - 1),
                        animate: _world_entities_TileEntity__WEBPACK_IMPORTED_MODULE_4__.TileEntityAnimations[tileEntity.payload.type_],
                    };
                });
                this.game.world = new _world_World__WEBPACK_IMPORTED_MODULE_0__.World(width, height, tiles, tileEntities2);
                this.game.world.inventory = new _player_Inventory__WEBPACK_IMPORTED_MODULE_3__.Inventory(inventory);
                this.game.world.player = new _player_PlayerLocal__WEBPACK_IMPORTED_MODULE_2__.PlayerLocal(player);
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
    },
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
    loadReflection(game) {
        if (!this.hasReflection) { //this is so it doesn't load them all at once and instead makes the reflections when they are needed
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
                            (this.reflection.width / 2 + 0.5 - Math.abs(i - this.reflection.width / 2 + 0.5)) / (this.reflection.width / 2);
                }
            }
            this.reflection.updatePixels();
        }
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
        if (this.image === undefined)
            throw new Error(`Tried to render reflection of image before loading it: ${this.path}`);
        if (!this.hasReflection)
            return;
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
                _Game__WEBPACK_IMPORTED_MODULE_1__.game.drawingContext.globalAlpha = this.reflectivityArray[currentBlock] / 255; //TODO make this based on the tile reflectivity
                _Game__WEBPACK_IMPORTED_MODULE_1__.game.image(this.reflection, (i * _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_WIDTH -
                    _Game__WEBPACK_IMPORTED_MODULE_1__.game.interpolatedCamX * _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_WIDTH) *
                    _Game__WEBPACK_IMPORTED_MODULE_1__.game.upscaleSize, (j * _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_HEIGHT -
                    _Game__WEBPACK_IMPORTED_MODULE_1__.game.interpolatedCamY * _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_HEIGHT) *
                    _Game__WEBPACK_IMPORTED_MODULE_1__.game.upscaleSize, _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_WIDTH * _Game__WEBPACK_IMPORTED_MODULE_1__.game.upscaleSize, _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_HEIGHT * _Game__WEBPACK_IMPORTED_MODULE_1__.game.upscaleSize, (i - x) * _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_WIDTH, (j - y) * _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_HEIGHT, _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_WIDTH, _Game__WEBPACK_IMPORTED_MODULE_1__.game.TILE_HEIGHT);
                _Game__WEBPACK_IMPORTED_MODULE_1__.game.drawingContext.globalAlpha = 1.0;
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
        _assets_Assets__WEBPACK_IMPORTED_MODULE_3__.PlayerAnimations[this.currentAnimation][this.animFrame][0].renderWorldspaceReflection(this.interpolatedX, this.interpolatedY + this.height, this.width, this.height);
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
        if (this.currentAnimation !== "idle" && Math.abs(this.xVel) <= 0.05 && _Game__WEBPACK_IMPORTED_MODULE_1__.game.worldMouseX > this.interpolatedX + this.width / 2) {
            this.currentAnimation = "idle";
            this.animFrame = this.animFrame % _assets_Assets__WEBPACK_IMPORTED_MODULE_3__.PlayerAnimations[this.currentAnimation].length;
            _Game__WEBPACK_IMPORTED_MODULE_1__.game.connection.emit('playerAnimation', this.currentAnimation, this.entityId);
        }
        if (this.currentAnimation !== "idleleft" && Math.abs(this.xVel) <= 0.05 && _Game__WEBPACK_IMPORTED_MODULE_1__.game.worldMouseX <= this.interpolatedX + this.width / 2) {
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
        // make the frame with some default values.  These will later be changed to fit the screen size.
        this.frame = new _UiFrame__WEBPACK_IMPORTED_MODULE_1__.UiFrame(0, 0, 0, 0);
        // make 4 buttons with default positions
        this.buttons = [
            new _Button__WEBPACK_IMPORTED_MODULE_2__.Button(font, "Join Game", "Join a game with your friends, or make new ones.", 0, 0, 0, 0, () => {
                console.log("join game");
                if (_Game__WEBPACK_IMPORTED_MODULE_5__.game.world == undefined)
                    return; //if there's no world, there's no point.
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
        // set the position of the frame
        this.frame.x = _Game__WEBPACK_IMPORTED_MODULE_5__.game.width / 2 - 264 / 2 * _Game__WEBPACK_IMPORTED_MODULE_5__.game.upscaleSize; // center the frame in the middle of the screen
        this.frame.y = _Game__WEBPACK_IMPORTED_MODULE_5__.game.height / 2 - 56 * _Game__WEBPACK_IMPORTED_MODULE_5__.game.upscaleSize;
        this.frame.w = 264 * _Game__WEBPACK_IMPORTED_MODULE_5__.game.upscaleSize;
        this.frame.h = 48 * _Game__WEBPACK_IMPORTED_MODULE_5__.game.upscaleSize;
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
        reflectivity: 50 //this reflectivity actually does nothing and instead reflectivity can be changed inside ReflectedImageResource.ts
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
        console.log(this.animFrame);
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
        this.animations[this.currentAnimation][this.animFrame][0].renderWorldspaceReflection(this.x, this.y + this.height, this.width, this.height);
        target.noStroke();
        target.textSize(5 * upscaleSize);
        target.textAlign(target.CENTER, target.TOP);
        target.text(this.name + ", test: " + this.animations.idle[0][0].image.get(3, 10), (this.x * _Game__WEBPACK_IMPORTED_MODULE_2__.game.TILE_WIDTH -
            _Game__WEBPACK_IMPORTED_MODULE_2__.game.interpolatedCamX * _Game__WEBPACK_IMPORTED_MODULE_2__.game.TILE_WIDTH +
            (this.width * _Game__WEBPACK_IMPORTED_MODULE_2__.game.TILE_WIDTH) / 2) *
            upscaleSize, (this.y * _Game__WEBPACK_IMPORTED_MODULE_2__.game.TILE_HEIGHT -
            _Game__WEBPACK_IMPORTED_MODULE_2__.game.interpolatedCamY * _Game__WEBPACK_IMPORTED_MODULE_2__.game.TILE_HEIGHT -
            (this.height * _Game__WEBPACK_IMPORTED_MODULE_2__.game.TILE_WIDTH) / 2.5) *
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
/* harmony export */   "ClientTileEntity": () => (/* binding */ ClientTileEntity),
/* harmony export */   "TileEntityAnimations": () => (/* binding */ TileEntityAnimations)
/* harmony export */ });
class ClientTileEntity {
}
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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SSxDQUFDLElBQUkseUVBQWEsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFDLEdBQUcsR0FBQyxHQUFHLEVBQUUsRUFBRSxFQUFFLENBQUMsR0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsR0FBRyxHQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksR0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBQyxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO2lCQUN2TjthQUNEO1NBQ0Q7UUFDRCxLQUFLLElBQUksUUFBUSxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDcEMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ2hCO1FBQ0QsS0FBSyxJQUFJLEtBQUssSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQzlCLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUNiO1FBQ0QsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sS0FBSyxTQUFTO1lBQUUsT0FBTztRQUM1QyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxLQUFLLFNBQVM7WUFBRSxPQUFPO1FBQzVDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLG1CQUFtQixFQUFFLENBQUM7UUFDeEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztRQUU1QyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDdkIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxXQUFXO1lBQ2YsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDbkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLENBQUM7Z0JBQzNCLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFdBQVc7Z0JBQ25ELElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7UUFDN0IsSUFBSSxDQUFDLFdBQVc7WUFDZixJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNuQixJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQztnQkFDNUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVztnQkFDckQsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUM3QixJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUNyRCxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUVyRCxJQUFJLENBQUMsaUJBQWlCLElBQUksR0FBRyxDQUFDO1FBRTlCLElBQUksSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUU7WUFDbEIsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7U0FDZDthQUFNLElBQ04sSUFBSSxDQUFDLElBQUk7WUFDVCxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsVUFBVSxFQUNoRTtZQUNELElBQUksQ0FBQyxJQUFJO2dCQUNSLElBQUksQ0FBQyxVQUFVO29CQUNmLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO1NBQ2pEO1FBQ0QsSUFDQyxJQUFJLENBQUMsSUFBSTtZQUNULElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQ25FO1lBQ0QsSUFBSSxDQUFDLElBQUk7Z0JBQ1IsSUFBSSxDQUFDLFdBQVc7b0JBQ2hCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1NBQ25EO1FBRUQsbUNBQW1DO1FBQ25DLDhCQUE4QjtRQUM5QixtQ0FBbUM7UUFDbkMsa0NBQWtDO1FBQ2xDLHNDQUFzQztRQUN0QyxJQUFJO1FBQ0osRUFBRTtRQUNGLGdEQUFnRDtRQUNoRCw0Q0FBNEM7UUFDNUMsbUNBQW1DO1FBQ25DLGVBQWU7UUFDZixRQUFRO1FBQ1IsSUFBSTtJQUNMLENBQUM7SUFFRCxXQUFXLENBQUMsQ0FBUyxFQUFFLENBQVMsRUFBRSxDQUFTLEVBQUUsQ0FBUztRQUNyRCwwRUFBMEU7UUFDMUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBQ3hELENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUN4RCxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDeEQsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBRXhELFVBQVU7UUFDViwyRUFBK0IsQ0FDOUIsSUFBSSxFQUNKLENBQUMsRUFDRCxDQUFDLEVBQ0QsQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQ3BCLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUNwQixDQUFDLEVBQ0QsQ0FBQyxFQUNELENBQUMsRUFDRCxDQUFDLENBQ0QsQ0FBQztRQUNGLDJFQUErQixDQUM5QixJQUFJLEVBQ0osQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFDNUIsQ0FBQyxFQUNELENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUNwQixDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFDcEIsQ0FBQyxFQUNELENBQUMsRUFDRCxDQUFDLEVBQ0QsQ0FBQyxDQUNELENBQUM7UUFDRiwyRUFBK0IsQ0FDOUIsSUFBSSxFQUNKLENBQUMsRUFDRCxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUM1QixDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFDcEIsQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQ3BCLENBQUMsRUFDRCxDQUFDLEVBQ0QsQ0FBQyxFQUNELENBQUMsQ0FDRCxDQUFDO1FBQ0YsMkVBQStCLENBQzlCLElBQUksRUFDSixDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUM1QixDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUM1QixDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFDcEIsQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQ3BCLENBQUMsRUFDRCxDQUFDLEVBQ0QsQ0FBQyxFQUNELENBQUMsQ0FDRCxDQUFDO1FBRUYsaUJBQWlCO1FBQ2pCLDJFQUErQixDQUM5QixJQUFJLEVBQ0osQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUN4QixDQUFDLEVBQ0QsQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUN6QixDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFDcEIsQ0FBQyxFQUNELENBQUMsRUFDRCxDQUFDLEVBQ0QsQ0FBQyxDQUNELENBQUM7UUFDRiwyRUFBK0IsQ0FDOUIsSUFBSSxFQUNKLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFDeEIsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFDNUIsQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUN6QixDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFDcEIsQ0FBQyxFQUNELENBQUMsRUFDRCxDQUFDLEVBQ0QsQ0FBQyxDQUNELENBQUM7UUFFRixpQkFBaUI7UUFDakIsMkVBQStCLENBQzlCLElBQUksRUFDSixDQUFDLEVBQ0QsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUN4QixDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFDcEIsQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUN6QixDQUFDLEVBQ0QsQ0FBQyxFQUNELENBQUMsRUFDRCxDQUFDLENBQ0QsQ0FBQztRQUNGLDJFQUErQixDQUM5QixJQUFJLEVBQ0osQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFDNUIsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUN4QixDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFDcEIsQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUN6QixDQUFDLEVBQ0QsQ0FBQyxFQUNELENBQUMsRUFDRCxDQUFDLENBQ0QsQ0FBQztRQUVGLFNBQVM7UUFDVCwyRUFBK0IsQ0FDOUIsSUFBSSxFQUNKLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFDeEIsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUN4QixDQUFDLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQ3pCLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFDekIsQ0FBQyxFQUNELENBQUMsRUFDRCxDQUFDLEVBQ0QsQ0FBQyxDQUNELENBQUM7SUFDSCxDQUFDO0lBRUQ7Ozs7Ozs7Ozs7OztJQVlHO0lBRUgsbUdBQW1HO0lBRW5HLFNBQVMsQ0FDUixLQUFXLEVBQ1gsS0FBVyxFQUNYLEtBQVcsRUFDWCxLQUFXLEVBQ1gsSUFBVSxFQUNWLElBQVUsRUFDVixJQUFVLEVBQ1YsSUFBVTtRQUVWLHVPQUF1TztRQUV2TywwS0FBMEs7UUFDMUssSUFBSSxJQUFJLEtBQUssQ0FBQyxJQUFJLElBQUksS0FBSyxDQUFDLEVBQUU7WUFDN0IsT0FBTyxLQUFLLENBQUM7U0FDYjtRQUVELDBJQUEwSTtRQUMxSSxNQUFNLGVBQWUsR0FBRyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDOUMsTUFBTSxrQkFBa0IsR0FBRyxDQUFDLEtBQUssR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ3pELE1BQU0sZ0JBQWdCLEdBQUcsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQy9DLE1BQU0saUJBQWlCLEdBQUcsQ0FBQyxLQUFLLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQztRQUV4RCxJQUNDLEtBQUssQ0FBQyxlQUFlLENBQUM7WUFDdEIsS0FBSyxDQUFDLGtCQUFrQixDQUFDO1lBQ3pCLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQztZQUN2QixLQUFLLENBQUMsaUJBQWlCLENBQUMsRUFDdkI7WUFDRCxvSEFBb0g7WUFDcEgsNERBQTREO1lBQzVELE9BQU8sS0FBSyxDQUFDO1NBQ2I7UUFFRCxvRUFBb0U7UUFDcEUsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO1FBQzVELE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztRQUMzRCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1FBQzVELE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLGtCQUFrQixDQUFDLENBQUM7UUFFM0QsSUFBSSxLQUFLLEdBQUcsSUFBSSxJQUFJLEtBQUssR0FBRyxJQUFJLEVBQUU7WUFDakMsMkZBQTJGO1lBQzNGLE9BQU8sS0FBSyxDQUFDO1NBQ2I7UUFFRCxJQUFJLElBQUksR0FBRyxDQUFDLElBQUksSUFBSSxHQUFHLENBQUMsRUFBRTtZQUN6QixxR0FBcUc7WUFDckcsT0FBTyxLQUFLLENBQUM7U0FDYjtRQUVELG1EQUFtRDtRQUNuRCxNQUFNLGtCQUFrQixHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRWxELElBQUksS0FBSyxHQUFHLENBQUMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFO1lBQzNCLDREQUE0RDtZQUM1RCxPQUFPLEtBQUssQ0FBQztTQUNiO1FBRUQsSUFBSSxLQUFLLEtBQUssa0JBQWtCLEVBQUU7WUFDakMsb0VBQW9FO1lBQ3BFLElBQUksZ0JBQWdCLEtBQUssS0FBSyxFQUFFO2dCQUMvQiwwRUFBMEU7Z0JBQzFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsa0JBQWtCLENBQUMsQ0FBQzthQUNuQztZQUNELDRHQUE0RztZQUM1RyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1NBQ2xDO1FBQ0QsK0dBQStHO1FBQy9HLElBQUksZUFBZSxLQUFLLEtBQUssRUFBRTtZQUM5Qix5RUFBeUU7WUFDekUsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1NBQ25DO1FBQ0QsNEdBQTRHO1FBQzVHLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLGtCQUFrQixDQUFDLENBQUM7UUFFbEMsZ0NBQWdDO1FBQ2hDLG9GQUFvRjtRQUNwRix5RUFBeUU7SUFDMUUsQ0FBQztJQUVELGNBQWM7UUFDYixjQUFjO1FBQ2Qsd0JBQXdCO1FBQ3hCLG1CQUFtQjtRQUNuQixhQUFhO1FBQ2IsMkRBQTJEO1FBQzNELHFEQUFxRDtRQUNyRCw0QkFBNEI7UUFDNUIsNERBQTREO1FBQzVELHNEQUFzRDtRQUN0RCw0QkFBNEI7UUFDNUIsb0VBQW9FO1FBQ3BFLHFFQUFxRTtRQUNyRSxLQUFLO1FBQ0wsbUNBQW1DO1FBQ25DLDBDQUEwQztRQUMxQyxFQUFFO1FBQ0YscUNBQXFDO1FBQ3JDLGdCQUFnQjtRQUNoQixrREFBa0Q7UUFDbEQseURBQXlEO1FBQ3pELGdDQUFnQztRQUNoQyxtREFBbUQ7UUFDbkQsMERBQTBEO1FBQzFELGdDQUFnQztRQUNoQyx1REFBdUQ7UUFDdkQsdURBQXVEO1FBQ3ZELFNBQVM7UUFDVCxFQUFFO1FBQ0Ysd0NBQXdDO1FBQ3hDLG9CQUFvQjtRQUNwQixFQUFFO1FBQ0YsdUJBQXVCO1FBQ3ZCLEVBQUU7UUFDRiwrQ0FBK0M7UUFDL0MsMkNBQTJDO1FBQzNDLEVBQUU7UUFDRixpQkFBaUI7UUFDakIsb0NBQW9DO1FBQ3BDLGtEQUFrRDtRQUNsRCx5REFBeUQ7UUFDekQsZ0NBQWdDO1FBQ2hDLG1EQUFtRDtRQUNuRCwwREFBMEQ7UUFDMUQsK0JBQStCO1FBQy9CLFNBQVM7UUFDVCxJQUFJO0lBQ0wsQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQW1DRztJQUVILFdBQVc7UUFDVixJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztJQUN0QixDQUFDO0lBRUQsWUFBWTtRQUNYLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0lBQ3JCLENBQUM7SUFFRCxXQUFXO1FBQ1YsSUFDQyxJQUFJLENBQUMsS0FBSyxDQUNULENBQUMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxVQUFVO1lBQ3ZDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztZQUNoQyxJQUFJLENBQUMsVUFBVSxDQUNmLEtBQUssSUFBSSxDQUFDLFdBQVc7WUFDdEIsSUFBSSxDQUFDLEtBQUssQ0FDVCxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsV0FBVztnQkFDeEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO2dCQUNoQyxJQUFJLENBQUMsV0FBVyxDQUNoQixLQUFLLElBQUksQ0FBQyxXQUFXLEVBQ3JCO1lBQ0QsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7U0FDakM7UUFDRCwwRkFBMEY7UUFDMUYsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUM1QixDQUFDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsVUFBVTtZQUN2QyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7WUFDaEMsSUFBSSxDQUFDLFVBQVUsQ0FDZixDQUFDO1FBQ0YsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUM1QixDQUFDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsV0FBVztZQUN4QyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7WUFDaEMsSUFBSSxDQUFDLFdBQVcsQ0FDaEIsQ0FBQztJQUNILENBQUM7SUFFRCxVQUFVO1FBQ1QsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2pCLGdDQUFnQztZQUNoQyxxREFBcUQ7WUFDckQsZ0JBQWdCO1lBQ2hCLHVCQUF1QjtZQUN2Qix1QkFBdUI7WUFDdkIsZ0NBQWdDO1lBQ2hDLCtCQUErQjtZQUMvQixTQUFTO1lBRVQsaUJBQWlCO1lBQ2pCLG9EQUFvRDtZQUNwRCwrQ0FBK0M7WUFDL0MsOENBQThDO1lBQzlDLFNBQVM7WUFDVCxJQUFJO1lBRUoseUVBQTZCLENBQzVCLElBQUksRUFDSixJQUFJLENBQUMsS0FBSyxDQUNULENBQUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7Z0JBQzFDLElBQUksQ0FBQyxVQUFVO2dCQUNmLElBQUksQ0FBQyxXQUFXLENBQ2hCLEVBQ0QsSUFBSSxDQUFDLEtBQUssQ0FDVCxDQUFDLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDO2dCQUMxQyxJQUFJLENBQUMsV0FBVztnQkFDaEIsSUFBSSxDQUFDLFdBQVcsQ0FDaEIsRUFDRCxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQ2xDLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FDbkMsQ0FBQztZQUNGLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxFQUFFO2dCQUM1QyxJQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFDakcsSUFBSSxPQUFPLENBQUMsWUFBWSxDQUFDLEtBQUssUUFBUSxFQUFFO29CQUN2QyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsR0FBRyxZQUFZLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsY0FBYTtpQkFDakY7cUJBQ0ksSUFBSSx5REFBVSxDQUFDLFlBQVksQ0FBQyxLQUFLLFNBQVMsRUFBRTtvQkFDaEQsSUFBSSxDQUFDLElBQUksQ0FBRSx5REFBVSxDQUFDLFlBQVksQ0FBVSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxjQUFhO2lCQUMxRjthQUNEO1NBQ0Q7SUFDRixDQUFDO0NBQ0Q7QUFFRCxNQUFNLFVBQVUsR0FBRyxvREFBRSxDQUFDO0lBQ3JCLElBQUksRUFBRSxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtDQUNyRCxDQUFDLENBQUM7QUFFSSxNQUFNLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3BtQ0g7QUFDeUI7QUFDWjtBQUNKO0FBQ29CO0FBQ3JCO0FBQ2U7QUFDVjtBQUc1QyxNQUFNLFVBQVU7SUFLdEIsWUFBWSxJQUFVO1FBQ3JCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBRWpCLGFBQWE7UUFDYixJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsY0FBYyxFQUFFLEtBQUssRUFBRSxFQUFFO1lBQ3pELE9BQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLGNBQWMsRUFBRSxDQUFDLENBQUM7WUFDbkQsSUFBSSxDQUFDLGNBQWMsR0FBRyxjQUFjLENBQUM7WUFDckMsSUFBSSxLQUFLLEVBQUU7Z0JBQ1YsTUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUMzQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUEwQixDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7YUFDL0Q7UUFDRixDQUFDLENBQUMsQ0FBQztRQUVILHdCQUF3QjtRQUN4QjtZQUNDLDhDQUE4QztZQUM5QyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQ3RCLFdBQVcsRUFDWCxDQUNDLEtBQUssRUFDTCxNQUFNLEVBQ04sS0FBSyxFQUNMLFlBQVksRUFDWixRQUFRLEVBQ1IsTUFBTSxFQUNOLFNBQVMsRUFDUixFQUFFO2dCQUNILE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ3RCLElBQUksYUFBYSxHQVNiLEVBQUUsQ0FBQztnQkFDUCxZQUFZLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFO29CQUNqQyxPQUFPLENBQUMsR0FBRyxDQUFDLHNCQUFzQixHQUFHLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDcEQsYUFBYSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsR0FBRzt3QkFDOUIsRUFBRSxFQUFFLFVBQVUsQ0FBQyxFQUFFO3dCQUNqQixZQUFZLEVBQUUsVUFBVSxDQUFDLFlBQVk7d0JBQ3JDLEtBQUssRUFBRSxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUs7d0JBQy9CLElBQUksRUFBRSxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUk7d0JBQzdCLFNBQVMsRUFBRSxPQUFPLENBQ2pCLENBQUMsRUFDRCxvRUFBd0IsQ0FDdkIsVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQ3hCLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FDWjt3QkFDRCxPQUFPLEVBQ04sNEVBQW9CLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7cUJBQy9DLENBQUM7Z0JBQ0gsQ0FBQyxDQUFDLENBQUM7Z0JBQ0gsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSwrQ0FBSyxDQUMxQixLQUFLLEVBQ0wsTUFBTSxFQUNOLEtBQUssRUFDTCxhQUFhLENBQ2IsQ0FBQztnQkFDRixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsSUFBSSx3REFBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUNyRCxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSw0REFBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNqRCxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFO29CQUN6QixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksd0VBQWEsQ0FDdEQsTUFBTSxDQUFDLElBQUksQ0FDWCxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNYLENBQUMsQ0FBQyxDQUFDO1lBQ0osQ0FBQyxDQUNELENBQUM7U0FDRjtRQUVELGVBQWU7UUFDZjtZQUNDLDRDQUE0QztZQUM1QyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQ3RCLGFBQWEsRUFDYixDQUFDLFlBQW1ELEVBQUUsRUFBRTtnQkFDdkQsMEJBQTBCO2dCQUMxQixJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxLQUFLLFNBQVM7b0JBQUUsT0FBTztnQkFFMUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtvQkFDM0IsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN2RCxDQUFDLENBQUMsQ0FBQztZQUNKLENBQUMsQ0FDRCxDQUFDO1lBRUYsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLGlCQUFpQixFQUFFLE9BQU8sQ0FBQyxFQUFFO2dCQUNwRCwwQkFBMEI7Z0JBQzFCLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEtBQUssU0FBUztvQkFBRSxPQUFPO2dCQUUxQyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFO29CQUN4QixPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO29CQUNwQixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDO2dCQUM1RCxDQUFDLENBQUMsQ0FBQztZQUNKLENBQUMsQ0FBQyxDQUFDO1NBQ0g7UUFFRCxnQkFBZ0I7UUFDaEI7WUFDQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsY0FBYyxFQUFFLFVBQVUsQ0FBQyxFQUFFO2dCQUNwRCwwQkFBMEI7Z0JBQzFCLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEtBQUssU0FBUztvQkFBRSxPQUFPO2dCQUUxQyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUN2RCxJQUFJLE1BQU0sS0FBSyxTQUFTO29CQUFFLE9BQU87Z0JBRWpDLE1BQU0sQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDL0IsQ0FBQyxDQUFDLENBQUM7WUFFSCxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLEVBQUU7Z0JBQ3BFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFBRSxPQUFPO2dCQUNyRCxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQzNDLElBQUcsQ0FBQyxZQUFZLHNFQUFZLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyw0REFBZ0IsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsRUFBRTtvQkFDM0Ysa0JBQWtCO29CQUNsQixDQUFDLENBQUMsZ0JBQWdCLEdBQUcsU0FBUyxDQUFDO2lCQUMvQjtZQUNGLENBQUMsQ0FBQyxDQUFDO1lBRUgsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLGNBQWMsRUFBRSxVQUFVLENBQUMsRUFBRTtnQkFDcEQsMEJBQTBCO2dCQUMxQixJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxLQUFLLFNBQVM7b0JBQUUsT0FBTztnQkFFMUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLHdFQUFhLENBQzFELFVBQVUsQ0FBQyxJQUFJLENBQ2YsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNmLENBQUMsQ0FBQyxDQUFDO1lBRUgsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLGNBQWMsRUFBRSxFQUFFLENBQUMsRUFBRTtnQkFDNUMsMEJBQTBCO2dCQUMxQixJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxLQUFLLFNBQVM7b0JBQUUsT0FBTztnQkFFMUMsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDckMsQ0FBQyxDQUFDLENBQUM7WUFFSCx3Q0FBd0M7WUFDeEMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUN0QixnQkFBZ0IsRUFDaEIsQ0FBQyxRQUlBLEVBQUUsRUFBRTtnQkFDSiwwQkFBMEI7Z0JBQzFCLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEtBQUssU0FBUztvQkFBRSxPQUFPO2dCQUUxQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDekMsQ0FBQyxDQUNELENBQUM7U0FDRjtJQUNGLENBQUM7Q0FDRDtBQUVELFNBQVMsT0FBTyxDQUFDLEVBQVUsRUFBRSxFQUFVO0lBQ3RDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3ZELENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzNLdUQ7QUFDRTtBQUNGO0FBQ1k7QUFDVjtBQUNSO0FBQzRCO0FBRTlCO0FBMEJoRCxNQUFNLGdCQUFnQixHQUFHLENBQ3hCLElBQU8sRUFDSCxFQUFFLENBQUMsSUFBSSxDQUFDO0FBRU4sTUFBTSxnQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FBQztJQUNoRCxvQ0FBb0M7SUFDcEMsSUFBSSxFQUFFO1FBQ0wsQ0FBQyxJQUFJLHVGQUF3QixDQUFDLHlDQUF5QyxDQUFDLEVBQUUsR0FBRyxDQUFDO1FBQzlFLENBQUMsSUFBSSx1RkFBd0IsQ0FBQyx5Q0FBeUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQztRQUM5RSxDQUFDLElBQUksdUZBQXdCLENBQUMseUNBQXlDLENBQUMsRUFBRSxHQUFHLENBQUM7UUFDOUUsQ0FBQyxJQUFJLHVGQUF3QixDQUFDLHlDQUF5QyxDQUFDLEVBQUUsR0FBRyxDQUFDO1FBQzlFLENBQUMsSUFBSSx1RkFBd0IsQ0FBQyx5Q0FBeUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQztRQUM5RSxDQUFDLElBQUksdUZBQXdCLENBQUMseUNBQXlDLENBQUMsRUFBRSxHQUFHLENBQUM7UUFDOUUsQ0FBQyxJQUFJLHVGQUF3QixDQUFDLHlDQUF5QyxDQUFDLEVBQUUsR0FBRyxDQUFDO1FBQzlFLENBQUMsSUFBSSx1RkFBd0IsQ0FBQyx5Q0FBeUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQztLQUM5RTtJQUNELFFBQVEsRUFBRTtRQUNULENBQUMsSUFBSSx1RkFBd0IsQ0FBQyxnREFBZ0QsQ0FBQyxFQUFFLEdBQUcsQ0FBQztRQUNyRixDQUFDLElBQUksdUZBQXdCLENBQUMsZ0RBQWdELENBQUMsRUFBRSxHQUFHLENBQUM7UUFDckYsQ0FBQyxJQUFJLHVGQUF3QixDQUFDLGdEQUFnRCxDQUFDLEVBQUUsR0FBRyxDQUFDO1FBQ3JGLENBQUMsSUFBSSx1RkFBd0IsQ0FBQyxnREFBZ0QsQ0FBQyxFQUFFLEdBQUcsQ0FBQztRQUNyRixDQUFDLElBQUksdUZBQXdCLENBQUMsZ0RBQWdELENBQUMsRUFBRSxHQUFHLENBQUM7UUFDckYsQ0FBQyxJQUFJLHVGQUF3QixDQUFDLGdEQUFnRCxDQUFDLEVBQUUsR0FBRyxDQUFDO1FBQ3JGLENBQUMsSUFBSSx1RkFBd0IsQ0FBQyxnREFBZ0QsQ0FBQyxFQUFFLEdBQUcsQ0FBQztRQUNyRixDQUFDLElBQUksdUZBQXdCLENBQUMsZ0RBQWdELENBQUMsRUFBRSxHQUFHLENBQUM7S0FDckY7SUFDRCxJQUFJLEVBQUU7UUFDTCxDQUFDLElBQUksdUZBQXdCLENBQUMsMENBQTBDLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDOUUsQ0FBQyxJQUFJLHVGQUF3QixDQUFDLDBDQUEwQyxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBQzlFLENBQUMsSUFBSSx1RkFBd0IsQ0FBQywwQ0FBMEMsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUM5RSxDQUFDLElBQUksdUZBQXdCLENBQUMsMENBQTBDLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDOUUsQ0FBQyxJQUFJLHVGQUF3QixDQUFDLDBDQUEwQyxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBQzlFLENBQUMsSUFBSSx1RkFBd0IsQ0FBQywwQ0FBMEMsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUM5RSxDQUFDLElBQUksdUZBQXdCLENBQUMsMENBQTBDLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDOUUsQ0FBQyxJQUFJLHVGQUF3QixDQUFDLDBDQUEwQyxDQUFDLEVBQUUsRUFBRSxDQUFDO0tBQzlFO0lBQ0QsUUFBUSxFQUFFO1FBQ1QsQ0FBQyxJQUFJLHVGQUF3QixDQUFDLDhDQUE4QyxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBQ2xGLENBQUMsSUFBSSx1RkFBd0IsQ0FBQyw4Q0FBOEMsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUNsRixDQUFDLElBQUksdUZBQXdCLENBQUMsOENBQThDLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDbEYsQ0FBQyxJQUFJLHVGQUF3QixDQUFDLDhDQUE4QyxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBQ2xGLENBQUMsSUFBSSx1RkFBd0IsQ0FBQyw4Q0FBOEMsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUNsRixDQUFDLElBQUksdUZBQXdCLENBQUMsOENBQThDLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDbEYsQ0FBQyxJQUFJLHVGQUF3QixDQUFDLDhDQUE4QyxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBQ2xGLENBQUMsSUFBSSx1RkFBd0IsQ0FBQyw4Q0FBOEMsQ0FBQyxFQUFFLEVBQUUsQ0FBQztLQUNsRjtDQUNELENBQUMsQ0FBQztBQUVILHNCQUFzQjtBQUNmLE1BQU0sVUFBVSxHQUFvQztJQUMxRCxDQUFDLGlFQUFrQixDQUFDLEVBQUUsSUFBSSxtRUFBYSxDQUN0QyxzQ0FBc0MsQ0FDdEM7SUFDRCxDQUFDLGdFQUFpQixDQUFDLEVBQUUsSUFBSSxtRUFBYSxDQUNyQyxxQ0FBcUMsQ0FDckM7SUFDRCxDQUFDLGlFQUFrQixDQUFDLEVBQUUsSUFBSSxtRUFBYSxDQUN0QyxzQ0FBc0MsQ0FDdEM7SUFDRCxDQUFDLG1FQUFvQixDQUFDLEVBQUUsSUFBSSxtRUFBYSxDQUN4Qyx3Q0FBd0MsQ0FDeEM7SUFDRCxDQUFDLG1FQUFvQixDQUFDLEVBQUUsSUFBSSxtRUFBYSxDQUN4Qyx3Q0FBd0MsQ0FDeEM7SUFDRCxDQUFDLG1FQUFvQixDQUFDLEVBQUUsSUFBSSxtRUFBYSxDQUN4Qyx3Q0FBd0MsQ0FDeEM7SUFDRCxDQUFDLG1FQUFvQixDQUFDLEVBQUUsSUFBSSxtRUFBYSxDQUN4Qyx3Q0FBd0MsQ0FDeEM7SUFDRCxDQUFDLG1FQUFvQixDQUFDLEVBQUUsSUFBSSxtRUFBYSxDQUN4Qyx3Q0FBd0MsQ0FDeEM7SUFDRCxDQUFDLG1FQUFvQixDQUFDLEVBQUUsSUFBSSxtRUFBYSxDQUN4Qyx3Q0FBd0MsQ0FDeEM7SUFDRCxDQUFDLG1FQUFvQixDQUFDLEVBQUUsSUFBSSxtRUFBYSxDQUN4Qyx3Q0FBd0MsQ0FDeEM7SUFDRCxDQUFDLG1FQUFvQixDQUFDLEVBQUUsSUFBSSxtRUFBYSxDQUN4Qyx3Q0FBd0MsQ0FDeEM7SUFDRCxDQUFDLG1FQUFvQixDQUFDLEVBQUUsSUFBSSxtRUFBYSxDQUN4Qyx3Q0FBd0MsQ0FDeEM7SUFDRCxDQUFDLG1FQUFvQixDQUFDLEVBQUUsSUFBSSxtRUFBYSxDQUN4Qyx3Q0FBd0MsQ0FDeEM7SUFDRCxDQUFDLGdFQUFpQixDQUFDLEVBQUUsSUFBSSxtRUFBYSxDQUNyQyxxQ0FBcUMsQ0FDckM7SUFDRCxDQUFDLHFFQUFzQixDQUFDLEVBQUUsSUFBSSxtRUFBYSxDQUMxQywwQ0FBMEMsQ0FDMUM7SUFDRCxDQUFDLGlFQUFrQixDQUFDLEVBQUUsSUFBSSxtRUFBYSxDQUN0QyxzQ0FBc0MsQ0FDdEM7SUFDRCxDQUFDLHFFQUFzQixDQUFDLEVBQUUsSUFBSSxtRUFBYSxDQUMxQywwQ0FBMEMsQ0FDMUM7SUFDRCxDQUFDLGtFQUFtQixDQUFDLEVBQUUsSUFBSSxtRUFBYSxDQUN2Qyx1Q0FBdUMsQ0FDdkM7SUFDRCxDQUFDLGtFQUFtQixDQUFDLEVBQUUsSUFBSSxtRUFBYSxDQUN2Qyx1Q0FBdUMsQ0FDdkM7SUFDRCxDQUFDLGtFQUFtQixDQUFDLEVBQUUsSUFBSSxtRUFBYSxDQUN2Qyx1Q0FBdUMsQ0FDdkM7SUFDRCxDQUFDLGtFQUFtQixDQUFDLEVBQUUsSUFBSSxtRUFBYSxDQUN2Qyx1Q0FBdUMsQ0FDdkM7SUFDRCxDQUFDLGtFQUFtQixDQUFDLEVBQUUsSUFBSSxtRUFBYSxDQUN2Qyx1Q0FBdUMsQ0FDdkM7SUFDRCxDQUFDLGtFQUFtQixDQUFDLEVBQUUsSUFBSSxtRUFBYSxDQUN2Qyx1Q0FBdUMsQ0FDdkM7SUFDRCxDQUFDLGtFQUFtQixDQUFDLEVBQUUsSUFBSSxtRUFBYSxDQUN2Qyx1Q0FBdUMsQ0FDdkM7SUFDRCxDQUFDLGtFQUFtQixDQUFDLEVBQUUsSUFBSSxtRUFBYSxDQUN2Qyx1Q0FBdUMsQ0FDdkM7SUFDRCxDQUFDLGtFQUFtQixDQUFDLEVBQUUsSUFBSSxtRUFBYSxDQUN2Qyx1Q0FBdUMsQ0FDdkM7SUFDRCxDQUFDLGtFQUFtQixDQUFDLEVBQUUsSUFBSSxtRUFBYSxDQUN2Qyx1Q0FBdUMsQ0FDdkM7SUFDRCxDQUFDLGtFQUFtQixDQUFDLEVBQUUsSUFBSSxtRUFBYSxDQUN2Qyx1Q0FBdUMsQ0FD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RSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO0tBQ04sRUFDRCwwRUFBMEUsRUFDMUUsRUFBRSxDQUNGO0lBRUQsR0FBRyxFQUFFLElBQUksaUVBQVksQ0FDcEIsZ0NBQWdDLEVBQ2hDO1FBQ0MsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7S0FDTixFQUNELHdFQUF3RSxFQUN4RSxFQUFFLENBQ0Y7SUFDRCxTQUFTLEVBQUUsSUFBSSxpRUFBWSxDQUMxQixrQ0FBa0MsRUFDbEM7UUFDQyxHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sSUFBSSxFQUFFLENBQUM7UUFDUCxHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztLQUNOLEVBQ0QsMkZBQTJGLEVBQzNGLENBQUMsQ0FDRDtDQUNE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QUFDLEdBQUcsV0FBVyxDQUFDO1FBQ3pELE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxXQUFXLENBQUMsR0FBRyxXQUFXLENBQUM7UUFDekQsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxHQUFHLFdBQVcsQ0FBQztRQUN6RCxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFDLEdBQUcsV0FBVyxDQUFDO1FBRXpELFVBQVU7UUFDVixJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDckYsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzNHLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUMzRyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFakksaUJBQWlCO1FBQ2pCLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM1RyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFbEksaUJBQWlCO1FBQ2pCLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM1RyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFD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Q0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzVHLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUVsSSxpQkFBaUI7UUFDakIsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzVHLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUVsSSxTQUFTO1FBQ1QsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRW5JLElBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNmLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsR0FBRyxHQUFDLG1CQUFtQixFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFDLEdBQUcsV0FBVyxHQUFHLENBQUMsR0FBRyxXQUFXLENBQUMsQ0FBQztTQUNsSzthQUNJO1lBQ0QsSUFBRyxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUNkLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsR0FBRyxHQUFDLE1BQU0sR0FBQyw0REFBZ0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxXQUFXLENBQUMsR0FBRyxXQUFXLEdBQUcsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxDQUFDO2FBQ2xMO2lCQUNJO2dCQUNELElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsR0FBRyxHQUFDLFlBQVksR0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsV0FB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QyxXQUFXLEVBQUUsQ0FBQyxHQUFDLFdBQVcsRUFBRSxDQUFDLEdBQUMsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRXhILGlCQUFpQjtRQUNqQiwyRUFBK0IsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFDLENBQUMsR0FBQyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBQyxFQUFFLEdBQUMsV0FBVyxFQUFFLENBQUMsR0FBQyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDekcsMkVBQStCLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBQyxDQUFDLEdBQUMsV0FBVyxFQUFFLENBQUMsR0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFDLFdBQVcsRUFBRSxDQUFDLEdBQUMsRUFBRSxHQUFDLFdBQVcsRUFBRSxDQUFDLEdBQUMsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRXpILGlCQUFpQjtRQUNqQiwyRUFBK0IsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBQyxDQUFDLEdBQUMsV0FBVyxFQUFFLENBQUMsR0FBQyxXQUFXLEVBQUUsQ0FBQyxHQUFDLEVBQUUsR0FBQyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDekcsMkVBQStCLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFDLFdBQVcsRUFBRSxDQUFDLEdBQUMsQ0FBQyxHQUFDLFdBQVcsRUFBRSxDQUFDLEdBQUMsV0FBVyxFQUFFLENBQUMsR0FBQyxFQUFFLEdBQUMsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRXpILFNBQVM7UUFDVCwyRUFBK0IsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFDLENBQUMsR0FBQyxXQUFXLEVB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VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7Ozs7V0N6QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSwrQkFBK0Isd0NBQXdDO1dBQ3ZFO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUJBQWlCLHFCQUFxQjtXQUN0QztXQUNBO1dBQ0Esa0JBQWtCLHFCQUFxQjtXQUN2QztXQUNBO1dBQ0EsS0FBSztXQUNMO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7Ozs7V0MzQkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEdBQUc7V0FDSDtXQUNBO1dBQ0EsQ0FBQzs7Ozs7V0NQRDs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1dDTkE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLE1BQU0scUJBQXFCO1dBQzNCO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBOzs7OztVRWhEQTtVQUNBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2NsaWVudC9HYW1lLnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3NyYy9jbGllbnQvTmV0TWFuYWdlci50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi9zcmMvY2xpZW50L2Fzc2V0cy9Bc3NldHMudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2NsaWVudC9hc3NldHMvcmVzb3VyY2VzL0F1ZGlvUmVzb3VyY2UudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2NsaWVudC9hc3NldHMvcmVzb3VyY2VzL0F1ZGlvUmVzb3VyY2VHcm91cC50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi9zcmMvY2xpZW50L2Fzc2V0cy9yZXNvdXJjZXMvRm9udFJlc291cmNlLnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3NyYy9jbGllbnQvYXNzZXRzL3Jlc291cmNlcy9JbWFnZVJlc291cmNlLnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3NyYy9jbGllbnQvYXNzZXRzL3Jlc291cmNlcy9SZWZsZWN0ZWRJbWFnZVJlc291cmNlLnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3NyYy9jbGllbnQvYXNzZXRzL3Jlc291cmNlcy9SZXNvdXJjZS50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi9zcmMvY2xpZW50L2Fzc2V0cy9yZXNvdXJjZXMvVGlsZVJlc291cmNlLnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3NyYy9jbGllbnQvaW5wdXQvQ29udHJvbC50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi9zcmMvY2xpZW50L3BsYXllci9JbnZlbnRvcnkudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2NsaWVudC9wbGF5ZXIvUGxheWVyTG9jYWwudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2NsaWVudC91aS9CdXR0b24udHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2NsaWVudC91aS9JbnB1dEJveC50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi9zcmMvY2xpZW50L3VpL1VpRnJhbWUudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2NsaWVudC91aS9VaVNjcmVlbi50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi9zcmMvY2xpZW50L3VpL3NjcmVlbnMvQ29udHJvbHNNZW51LnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3NyYy9jbGllbnQvdWkvc2NyZWVucy9NYWluTWVudS50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi9zcmMvY2xpZW50L3VpL3NjcmVlbnMvT3B0aW9uc01lbnUudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2NsaWVudC91aS9zY3JlZW5zL1BhdXNlTWVudS50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi9zcmMvY2xpZW50L3VpL3NjcmVlbnMvVmlkZW9TZXR0aW5nc01lbnUudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2NsaWVudC93b3JsZC9Xb3JsZC50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi9zcmMvY2xpZW50L3dvcmxkL1dvcmxkVGlsZXMudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2NsaWVudC93b3JsZC9lbnRpdGllcy9DbG91ZC50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi9zcmMvY2xpZW50L3dvcmxkL2VudGl0aWVzL0VudGl0eUNsYXNzZXMudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2NsaWVudC93b3JsZC9lbnRpdGllcy9JdGVtRW50aXR5LnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3NyYy9jbGllbnQvd29ybGQvZW50aXRpZXMvUGxheWVyRW50aXR5LnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3NyYy9jbGllbnQvd29ybGQvZW50aXRpZXMvU2VydmVyRW50aXR5LnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3NyYy9jbGllbnQvd29ybGQvZW50aXRpZXMvVGlsZUVudGl0eS50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi9zcmMvY2xpZW50L3dvcmxkL3BhcnRpY2xlcy9Db2xvclBhcnRpY2xlLnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3NyYy9nbG9iYWwvRW50aXR5LnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3NyYy9nbG9iYWwvSW52ZW50b3J5LnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3NyYy9nbG9iYWwvVGlsZS50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi9zcmMvZ2xvYmFsL1RpbGVFbnRpdHkudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3Nub3dlZF9pbi93ZWJwYWNrL3J1bnRpbWUvY2h1bmsgbG9hZGVkIiwid2VicGFjazovL3Nub3dlZF9pbi93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3Nub3dlZF9pbi93ZWJwYWNrL3J1bnRpbWUvZ2xvYmFsIiwid2VicGFjazovL3Nub3dlZF9pbi93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3Nub3dlZF9pbi93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3Nub3dlZF9pbi93ZWJwYWNrL3J1bnRpbWUvanNvbnAgY2h1bmsgbG9hZGluZyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL3Nub3dlZF9pbi93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHA1LCB7IFNoYWRlciB9IGZyb20gJ3A1JztcclxuXHJcbmltcG9ydCB7IFdvcmxkIH0gZnJvbSAnLi93b3JsZC9Xb3JsZCc7XHJcblxyXG5pbXBvcnQge1xyXG5cdEF1ZGlvQXNzZXRzLFxyXG5cdEZvbnRzLFxyXG5cdEl0ZW1Bc3NldHMsXHJcblx0bG9hZEFzc2V0cyxcclxuXHRQbGF5ZXJBbmltYXRpb25zLFxyXG5cdFVpQXNzZXRzLFxyXG5cdFdvcmxkQXNzZXRzLFxyXG59IGZyb20gJy4vYXNzZXRzL0Fzc2V0cyc7XHJcbmltcG9ydCB7IE1haW5NZW51IH0gZnJvbSAnLi91aS9zY3JlZW5zL01haW5NZW51JztcclxuaW1wb3J0IHsgaW8sIFNvY2tldCB9IGZyb20gJ3NvY2tldC5pby1jbGllbnQnO1xyXG5pbXBvcnQgeyBVaVNjcmVlbiB9IGZyb20gJy4vdWkvVWlTY3JlZW4nO1xyXG5pbXBvcnQgeyBQYXVzZU1lbnUgfSBmcm9tICcuL3VpL3NjcmVlbnMvUGF1c2VNZW51JztcclxuaW1wb3J0IHsgTmV0TWFuYWdlciB9IGZyb20gJy4vTmV0TWFuYWdlcic7XHJcbmltcG9ydCB7IFdvcmxkVGlsZXMsIFRpbGUgfSBmcm9tICcuL3dvcmxkL1dvcmxkVGlsZXMnO1xyXG5cclxuaW1wb3J0IHsgQ2xpZW50RXZlbnRzLCBTZXJ2ZXJFdmVudHMgfSBmcm9tICcuLi9nbG9iYWwvRXZlbnRzJztcclxuXHJcbi8qXHJcbi8vL0lORk9STUFUSU9OXHJcbi8vU3RhcnRpbmcgYSBnYW1lXHJcblByZXNzIExpdmUgU2VydmVyIHRvIHN0YXJ0IHRoZSBnYW1lXHJcbm9yXHJcblR5cGUgbnBtIHJ1biBwcmVzdGFydCB0byBzdGFydCB0aGUgZ2FtZS5cclxuLy9UT0RPXHJcbldoZW4gc29tZXRoaW5nIGluIHRoZSB0b2RvIHNlY3Rpb24sIGVpdGhlciBkZWxldGUgaXQgYW5kIG1hcmsgd2hhdCB3YXMgZG9uZSBpbiB0aGUgZGVzY3JpcHRpb24gLVxyXG4tIHdoZW4gcHVzaGluZywgb3IganVzdCBtYXJrIGl0IGxpa2UgdGhpc1xyXG4oZXhhbXBsZTogQ3JlYXRlIGEgbnVjbGVhciBleHBsb3Npb24gLS0gWClcclxuLy8vR0VORVJBTCBUT0RPOlxyXG5cclxuLy9BdWRpb1xyXG5zb3VuZHNcclxubXVzaWNcclxuTlBDJ3NcclxuXHJcbi8vVmlzdWFsXHJcblVwZGF0ZSBzbm93IHRleHR1cmVzXHJcblVwZGF0ZSBHVUkgdGV4dHVyZXNcclxucGxheWVyIGNoYXJhY3RlclxyXG5pdGVtIGxvcmUgaW1wbGVtZW50ZWRcclxuXHJcbi8vR2FtZXBsYXlcclxuZmluaXNoIGl0ZW0gbWFuYWdlbWVudFxyXG5wYXVzZSBtZW51XHJcbkh1bmdlciwgaGVhdCwgZXRjIHN5c3RlbVxyXG5pdGVtIGNyZWF0aW9uXHJcbml0ZW0gdXNlXHJcblBhcmVudCBXb3JrYmVuY2hcclxuXHJcbi8vT2JqZWN0c1xyXG5kaXJ0XHJcbnN0b25lXHJcbndvcmtiZW5jaFxyXG5iYWNrcGFjayAodXNlZCBhcyBjaGVzdClcclxuXHJcbi8vUG9saXNoXHJcbmJldHRlciB3b3JsZCBnZW5lcmF0aW9uXHJcbmZvbnQgY29uc2lzdGVuY3lcclxuZml4IGN1cnNvciBpbnB1dCBsYWcgKHNlcGFyYXRlIGN1cnNvciBhbmQgYW5pbWF0aW9uIGltYWdlcylcclxuZml4IHN0dWNrIG9uIHNpZGUgb2YgYmxvY2sgYnVnXHJcbmZpeCBjb2xsaWRlIHdpdGggc2lkZXMgb2YgbWFwIGJ1Z1xyXG4gKi9cclxuaW1wb3J0IHsgVGlsZVR5cGUgfSBmcm9tICcuLi9nbG9iYWwvVGlsZSc7XHJcbmltcG9ydCB7IENvbnRyb2wgfSBmcm9tICcuL2lucHV0L0NvbnRyb2wnO1xyXG5pbXBvcnQgeyBDb2xvclBhcnRpY2xlIH0gZnJvbSAnLi93b3JsZC9wYXJ0aWNsZXMvQ29sb3JQYXJ0aWNsZSc7XHJcbmltcG9ydCB7IFRpbGVFbnRpdGllcyB9IGZyb20gJy4uL2dsb2JhbC9UaWxlRW50aXR5JztcclxuaW1wb3J0IHsgQ2xvdWQgfSBmcm9tICcuL3dvcmxkL2VudGl0aWVzL0Nsb3VkJztcclxuXHJcbmV4cG9ydCBjbGFzcyBHYW1lIGV4dGVuZHMgcDUge1xyXG5cdHdvcmxkV2lkdGg6IG51bWJlciA9IDUxMjsgLy8gd2lkdGggb2YgdGhlIHdvcmxkIGluIHRpbGVzICAgPCE+IE1BS0UgU1VSRSBUSElTIElTIE5FVkVSIExFU1MgVEhBTiA2NCEhISA8IT5cclxuXHR3b3JsZEhlaWdodDogbnVtYmVyID0gMjU2OyAvLyBoZWlnaHQgb2YgdGhlIHdvcmxkIGluIHRpbGVzICA8IT4gTUFLRSBTVVJFIFRISVMgSVMgTkVWRVIgTEVTUyBUSEFOIDY0ISEhIDwhPlxyXG5cclxuXHRUSUxFX1dJRFRIOiBudW1iZXIgPSA4OyAvLyB3aWR0aCBvZiBhIHRpbGVzIGluIHBpeGVsc1xyXG5cdFRJTEVfSEVJR0hUOiBudW1iZXIgPSA4OyAvLyBoZWlnaHQgb2YgYSB0aWxlcyBpbiBwaXhlbHNcclxuXHJcblx0dXBzY2FsZVNpemU6IG51bWJlciA9IDY7IC8vIG51bWJlciBvZiBzY3JlZW4gcGl4ZWxzIHBlciB0ZXh0dXJlIHBpeGVscyAodGhpbmsgb2YgdGhpcyBhcyBodWQgc2NhbGUgaW4gTWluZWNyYWZ0KVxyXG5cclxuXHRjYW1YOiBudW1iZXIgPSAwOyAvLyBwb3NpdGlvbiBvZiB0aGUgdG9wIGxlZnQgY29ybmVyIG9mIHRoZSBzY3JlZW4gaW4gdW4tdXAtc2NhbGVkIHBpeGVscyAoMCBpcyBsZWZ0IG9mIHdvcmxkKSAod29ybGRXaWR0aCpUSUxFX1dJRFRIIGlzIGJvdHRvbSBvZiB3b3JsZClcclxuXHRjYW1ZOiBudW1iZXIgPSAwOyAvLyBwb3NpdGlvbiBvZiB0aGUgdG9wIGxlZnQgY29ybmVyIG9mIHRoZSBzY3JlZW4gaW4gdW4tdXAtc2NhbGVkIHBpeGVscyAoMCBpcyB0b3Agb2Ygd29ybGQpICh3b3JsZEhlaWdodCpUSUxFX0hFSUdIVCBpcyBib3R0b20gb2Ygd29ybGQpXHJcblx0cENhbVg6IG51bWJlciA9IDA7IC8vIGxhc3QgZnJhbWUncyB4IG9mIHRoZSBjYW1lcmFcclxuXHRwQ2FtWTogbnVtYmVyID0gMDsgLy8gbGFzdCBmcmFtZSdzIHkgb2YgdGhlIGNhbWVyYVxyXG5cdGludGVycG9sYXRlZENhbVg6IG51bWJlciA9IDA7IC8vIGludGVycG9sYXRlZCBwb3NpdGlvbiBvZiB0aGUgY2FtZXJhXHJcblx0aW50ZXJwb2xhdGVkQ2FtWTogbnVtYmVyID0gMDsgLy8gaW50ZXJwb2xhdGVkIHBvc2l0aW9uIG9mIHRoZSBjYW1lcmFcclxuXHRkZXNpcmVkQ2FtWDogbnVtYmVyID0gMDsgLy8gZGVzaXJlZCBwb3NpdGlvbiBvZiB0aGUgY2FtZXJhXHJcblx0ZGVzaXJlZENhbVk6IG51bWJlciA9IDA7IC8vIGRlc2lyZWQgcG9zaXRpb24gb2YgdGhlIGNhbWVyYVxyXG5cdHNjcmVlbnNoYWtlQW1vdW50OiBudW1iZXIgPSAwOyAvLyBhbW91bnQgb2Ygc2NyZWVuc2hha2UgaGFwcGVuaW5nIGF0IHRoZSBjdXJyZW50IG1vbWVudFxyXG5cclxuXHQvLyB0aWNrIG1hbmFnZW1lbnRcclxuXHRtc1NpbmNlVGljazogbnVtYmVyID0gMDsgLy8gdGhpcyBpcyB0aGUgcnVubmluZyBjb3VudGVyIG9mIGhvdyBtYW55IG1pbGxpc2Vjb25kcyBpdCBoYXMgYmVlbiBzaW5jZSB0aGUgbGFzdCB0aWNrLiAgVGhlIGdhbWUgY2FuIHRoZW5cclxuXHRtc1BlclRpY2s6IG51bWJlciA9IDIwOyAvLyB0aGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBwZXIgZ2FtZSB0aWNrLiAgMTAwMC9tc1BlclRpY2sgPSB0aWNrcyBwZXIgc2Vjb25kXHJcblx0YW1vdW50U2luY2VMYXN0VGljazogbnVtYmVyID0gMDsgLy8gdGhpcyBpcyBhIHZhcmlhYmxlIGNhbGN1bGF0ZWQgZXZlcnkgZnJhbWUgdXNlZCBmb3IgaW50ZXJwb2xhdGlvbiAtIGRvbWFpblswLDEpXHJcblx0Zm9yZ2l2ZW5lc3NDb3VudDogbnVtYmVyID0gNTA7IC8vIGlmIHRoZSBjb21wdXRlciBuZWVkcyB0byBkbyBtb3JlIHRoYW4gNTAgdGlja3MgaW4gYSBzaW5nbGUgZnJhbWUsIHRoZW4gaXQgY291bGQgYmUgcnVubmluZyBiZWhpbmQsIHByb2JhYmx5IGJlY2F1c2Ugb2YgYSBmcmVlemUgb3IgdGhlIHVzZXIgYmVpbmcgb24gYSBkaWZmZXJlbnQgdGFiLiAgSW4gdGhlc2UgY2FzZXMsIGl0J3MgcHJvYmFibHkgYmVzdCB0byBqdXN0IGlnbm9yZSB0aGF0IGFueSB0aW1lIGhhcyBwYXNzZWQgdG8gYXZvaWQgZnVydGhlciBmcmVlemluZ1xyXG5cclxuXHQvLyBwaHlzaWNzIGNvbnN0YW50c1xyXG5cdEdSQVZJVFlfU1BFRUQ6IG51bWJlciA9IDAuMDQ7IC8vIGluIHVuaXRzIHBlciBzZWNvbmQgdGljaywgcG9zaXRpdmUgbWVhbnMgZG93bndhcmQgZ3Jhdml0eSwgbmVnYXRpdmUgbWVhbnMgdXB3YXJkIGdyYXZpdHlcclxuXHREUkFHX0NPRUZGSUNJRU5UOiBudW1iZXIgPSAwLjIxOyAvLyBhcmJpdHJhcnkgbnVtYmVyLCAwIG1lYW5zIG5vIGRyYWdcclxuXHJcblx0Ly8gQ0hBUkFDVEVSIFNIT1VMRCBCRSBST1VHSExZIDEyIFBJWEVMUyBCWSAyMCBQSVhFTFNcclxuXHJcblx0cGlja2VkVXBTbG90ID0gLTE7XHJcblxyXG5cdHdvcmxkTW91c2VYID0gMDsgLy8gdGhlIG1vdXNlIHBvc2l0aW9uIGluIHdvcmxkIGNvb3JkaW5hdGVzXHJcblx0d29ybGRNb3VzZVkgPSAwOyAvLyB0aGUgbW91c2UgcG9zaXRpb24gaW4gd29ybGQgY29vcmRpbmF0ZXNcclxuXHRsYXN0Q3Vyc29yTW92ZSA9IERhdGUubm93KClcclxuXHRtb3VzZU9uID0gdHJ1ZTsgLy8gaXMgdGhlIG1vdXNlIG9uIHRoZSB3aW5kb3c/XHJcblxyXG5cdGtleXM6IGJvb2xlYW5bXSA9IFtdO1xyXG5cclxuXHQvLyB0aGUga2V5Y29kZSBmb3IgdGhlIGtleSB0aGF0IGRvZXMgdGhlIGFjdGlvblxyXG5cdGNvbnRyb2xzOiBDb250cm9sW10gPSBbXHJcblx0XHRuZXcgQ29udHJvbChcclxuXHRcdFx0J1dhbGsgUmlnaHQnLFxyXG5cdFx0XHR0cnVlLFxyXG5cdFx0XHQ2OCxcclxuXHRcdFx0KCkgPT4ge1xyXG5cdFx0XHRcdGlmICh0aGlzLmN1cnJlbnRVaSAhPT0gdW5kZWZpbmVkKSByZXR1cm47XHJcblx0XHRcdFx0dGhpcy53b3JsZC5wbGF5ZXIucmlnaHRCdXR0b24gPSB0cnVlO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHQoKSA9PiB7XHJcblx0XHRcdFx0aWYgKHRoaXMuY3VycmVudFVpICE9PSB1bmRlZmluZWQpIHJldHVybjtcclxuXHRcdFx0XHR0aGlzLndvcmxkLnBsYXllci5yaWdodEJ1dHRvbiA9IGZhbHNlO1xyXG5cdFx0XHR9LFxyXG5cdFx0KSwgLy8gcmlnaHRcclxuXHRcdG5ldyBDb250cm9sKFxyXG5cdFx0XHQnV2FsayBMZWZ0JyxcclxuXHRcdFx0dHJ1ZSxcclxuXHRcdFx0NjUsXHJcblx0XHRcdCgpID0+IHtcclxuXHRcdFx0XHRpZiAodGhpcy5jdXJyZW50VWkgIT09IHVuZGVmaW5lZCkgcmV0dXJuO1xyXG5cdFx0XHRcdHRoaXMud29ybGQucGxheWVyLmxlZnRCdXR0b24gPSB0cnVlO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHQoKSA9PiB7XHJcblx0XHRcdFx0aWYgKHRoaXMuY3VycmVudFVpICE9PSB1bmRlZmluZWQpIHJldHVybjtcclxuXHRcdFx0XHR0aGlzLndvcmxkLnBsYXllci5sZWZ0QnV0dG9uID0gZmFsc2U7XHJcblx0XHRcdH0sXHJcblx0XHQpLCAvLyBsZWZ0XHJcblx0XHRuZXcgQ29udHJvbChcclxuXHRcdFx0J0p1bXAnLFxyXG5cdFx0XHR0cnVlLFxyXG5cdFx0XHQ4NyxcclxuXHRcdFx0KCkgPT4ge1xyXG5cdFx0XHRcdGlmICh0aGlzLmN1cnJlbnRVaSAhPT0gdW5kZWZpbmVkKSByZXR1cm47XHJcblx0XHRcdFx0dGhpcy53b3JsZC5wbGF5ZXIuanVtcEJ1dHRvbiA9IHRydWU7XHJcblx0XHRcdH0sXHJcblx0XHRcdCgpID0+IHtcclxuXHRcdFx0XHRpZiAodGhpcy5jdXJyZW50VWkgIT09IHVuZGVmaW5lZCkgcmV0dXJuO1xyXG5cdFx0XHRcdHRoaXMud29ybGQucGxheWVyLmp1bXBCdXR0b24gPSBmYWxzZTtcclxuXHRcdFx0fSxcclxuXHRcdCksIC8vIGp1bXBcclxuXHRcdG5ldyBDb250cm9sKCdQYXVzZScsIHRydWUsIDI3LCAoKSA9PiB7XHJcblx0XHRcdC8vaWYgaW52ZW50b3J5IG9wZW57XHJcblx0XHRcdC8vY2xvc2UgaW52ZW50b3J5XHJcblx0XHRcdC8vcmV0dXJuO31cclxuXHRcdFx0aWYgKHRoaXMuY3VycmVudFVpID09PSB1bmRlZmluZWQpXHJcblx0XHRcdFx0dGhpcy5jdXJyZW50VWkgPSBuZXcgUGF1c2VNZW51KEZvbnRzLnRpdGxlLCBGb250cy5iaWcpO1xyXG5cdFx0XHRlbHNlIHRoaXMuY3VycmVudFVpID0gdW5kZWZpbmVkO1xyXG5cdFx0fSksIC8vIHNldHRpbmdzXHJcblx0XHRuZXcgQ29udHJvbCgnSW52ZW50b3J5JywgdHJ1ZSwgNjksICgpID0+IHtcclxuXHRcdFx0Ly9pZiB1aSBvcGVuIHJldHVybjtcclxuXHRcdFx0Ly9pZiBpbnZlbnRvcnkgY2xvc2VkIG9wZW4gaW52ZW50b3J5XHJcblx0XHRcdC8vZWxzZSBjbG9zZSBpbnZlbnRvcnlcclxuXHRcdFx0Y29uc29sZS5sb2coJ2ludmVudG9yeSBoYXMgbm90IGJlZW4gaW1wbGVtZW50ZWQgeWV0Jyk7XHJcblx0XHR9KSwgLy8gaW52ZW50b3J5XHJcblx0XHRuZXcgQ29udHJvbCgnSG90YmFyIDEnLCB0cnVlLCA0OSwgKCkgPT4ge1xyXG5cdFx0XHR0aGlzLndvcmxkLmludmVudG9yeS5zZWxlY3RlZFNsb3QgPSAwO1xyXG5cdFx0fSksIC8vIGhvdCBiYXIgMVxyXG5cdFx0bmV3IENvbnRyb2woJ0hvdGJhciAyJywgdHJ1ZSwgNTAsICgpID0+IHtcclxuXHRcdFx0dGhpcy53b3JsZC5pbnZlbnRvcnkuc2VsZWN0ZWRTbG90ID0gMTtcclxuXHRcdH0pLCAvLyBob3QgYmFyIDJcclxuXHRcdG5ldyBDb250cm9sKCdIb3RiYXIgMycsIHRydWUsIDUxLCAoKSA9PiB7XHJcblx0XHRcdHRoaXMud29ybGQuaW52ZW50b3J5LnNlbGVjdGVkU2xvdCA9IDI7XHJcblx0XHR9KSwgLy8gaG90IGJhciAzXHJcblx0XHRuZXcgQ29udHJvbCgnSG90YmFyIDQnLCB0cnVlLCA1MiwgKCkgPT4ge1xyXG5cdFx0XHR0aGlzLndvcmxkLmludmVudG9yeS5zZWxlY3RlZFNsb3QgPSAzO1xyXG5cdFx0fSksIC8vIGhvdCBiYXIgNFxyXG5cdFx0bmV3IENvbnRyb2woJ0hvdGJhciA1JywgdHJ1ZSwgNTMsICgpID0+IHtcclxuXHRcdFx0dGhpcy53b3JsZC5pbnZlbnRvcnkuc2VsZWN0ZWRTbG90ID0gNDtcclxuXHRcdH0pLCAvLyBob3QgYmFyIDVcclxuXHRcdG5ldyBDb250cm9sKCdIb3RiYXIgNicsIHRydWUsIDU0LCAoKSA9PiB7XHJcblx0XHRcdHRoaXMud29ybGQuaW52ZW50b3J5LnNlbGVjdGVkU2xvdCA9IDU7XHJcblx0XHR9KSwgLy8gaG90IGJhciA2XHJcblx0XHRuZXcgQ29udHJvbCgnSG90YmFyIDcnLCB0cnVlLCA1NSwgKCkgPT4ge1xyXG5cdFx0XHR0aGlzLndvcmxkLmludmVudG9yeS5zZWxlY3RlZFNsb3QgPSA2O1xyXG5cdFx0fSksIC8vIGhvdCBiYXIgN1xyXG5cdFx0bmV3IENvbnRyb2woJ0hvdGJhciA4JywgdHJ1ZSwgNTYsICgpID0+IHtcclxuXHRcdFx0dGhpcy53b3JsZC5pbnZlbnRvcnkuc2VsZWN0ZWRTbG90ID0gNztcclxuXHRcdH0pLCAvLyBob3QgYmFyIDhcclxuXHRcdG5ldyBDb250cm9sKCdIb3RiYXIgOScsIHRydWUsIDU3LCAoKSA9PiB7XHJcblx0XHRcdHRoaXMud29ybGQuaW52ZW50b3J5LnNlbGVjdGVkU2xvdCA9IDg7XHJcblx0XHR9KSwgLy8gaG90IGJhciA5XHJcblx0XHRuZXcgQ29udHJvbCgnSG90YmFyIDEwJywgdHJ1ZSwgNDgsICgpID0+IHtcclxuXHRcdFx0dGhpcy53b3JsZC5pbnZlbnRvcnkuc2VsZWN0ZWRTbG90ID0gOTtcclxuXHRcdH0pLCAvLyBob3QgYmFyIDEwXHJcblx0XHRuZXcgQ29udHJvbCgnSG90YmFyIDExJywgdHJ1ZSwgMTg5LCAoKSA9PiB7XHJcblx0XHRcdHRoaXMud29ybGQuaW52ZW50b3J5LnNlbGVjdGVkU2xvdCA9IDEwO1xyXG5cdFx0fSksIC8vIGhvdCBiYXIgMTFcclxuXHRcdG5ldyBDb250cm9sKCdIb3RiYXIgMTInLCB0cnVlLCAxODcsICgpID0+IHtcclxuXHRcdFx0dGhpcy53b3JsZC5pbnZlbnRvcnkuc2VsZWN0ZWRTbG90ID0gMTE7XHJcblx0XHR9KSwgLy8gaG90IGJhciAxMlxyXG5cdF07XHJcblxyXG5cdGNhbnZhczogcDUuUmVuZGVyZXI7IC8vdGhlIGNhbnZhcyBmb3IgdGhlIGdhbWVcclxuXHRza3lMYXllcjogcDUuR3JhcGhpY3M7IC8vYSBwNS5HcmFwaGljcyBvYmplY3QgdGhhdCB0aGUgc2hhZGVyIGlzIGRyYXduIG9udG8uICB0aGlzIGlzbid0IHRoZSBiZXN0IHdheSB0byBkbyB0aGlzLCBidXQgdGhlIG1haW4gZ2FtZSBjYW52YXMgaXNuJ3QgV0VCR0wsIGFuZCBpdCdzIHRvbyBtdWNoIHdvcmsgdG8gY2hhbmdlIHRoYXRcclxuXHRza3lTaGFkZXI6IHA1LlNoYWRlcjsgLy90aGUgc2hhZGVyIHRoYXQgZHJhd3MgdGhlIHNreSAodGhlIHBhdGggZm9yIHRoaXMgaXMgaW4gdGhlIHB1YmxpYyBmb2xkZXIpXHJcblxyXG5cdHdvcmxkOiBXb3JsZDtcclxuXHJcblx0Y3VycmVudFVpOiBVaVNjcmVlbiB8IHVuZGVmaW5lZDtcclxuXHJcblx0Y29ubmVjdGlvbjogU29ja2V0PFNlcnZlckV2ZW50cywgQ2xpZW50RXZlbnRzPjtcclxuXHJcblx0bmV0TWFuYWdlcjogTmV0TWFuYWdlcjtcclxuXHJcblx0Ly9jaGFuZ2VhYmxlIG9wdGlvbnMgZnJvbSBtZW51c1xyXG5cdHNlcnZlclZpc2liaWxpdHk6IHN0cmluZztcclxuXHR3b3JsZEJ1bXBpbmVzczogbnVtYmVyO1xyXG5cdHNreU1vZDogbnVtYmVyO1xyXG5cdHNreVRvZ2dsZTogYm9vbGVhbjtcclxuXHRwYXJ0aWNsZU11bHRpcGxpZXI6IG51bWJlcjtcclxuXHJcblx0cGFydGljbGVzOiBDb2xvclBhcnRpY2xlIC8qfEZvb3RzdGVwUGFydGljbGUqL1tdO1xyXG5cdGNsb3VkczogQ2xvdWQgLyp8Rm9vdHN0ZXBQYXJ0aWNsZSovW107XHJcblx0YnJlYWtpbmc6IGJvb2xlYW4gPSB0cnVlO1xyXG5cclxuXHRjb25zdHJ1Y3Rvcihjb25uZWN0aW9uOiBTb2NrZXQpIHtcclxuXHRcdHN1cGVyKCgpID0+IHsgfSk7IC8vIFRvIGNyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiBwNSBpdCB3aWxsIGNhbGwgYmFjayB3aXRoIHRoZSBpbnN0YW5jZS4gV2UgZG9uJ3QgbmVlZCB0aGlzIHNpbmNlIHdlIGFyZSBleHRlbmRpbmcgdGhlIGNsYXNzXHJcblx0XHR0aGlzLmNvbm5lY3Rpb24gPSBjb25uZWN0aW9uO1xyXG5cclxuXHRcdC8vIEluaXRpYWxpc2UgdGhlIG5ldHdvcmsgbWFuYWdlclxyXG5cdFx0dGhpcy5uZXRNYW5hZ2VyID0gbmV3IE5ldE1hbmFnZXIodGhpcyk7XHJcblx0fVxyXG5cclxuXHRwcmVsb2FkKCkge1xyXG5cdFx0Y29uc29sZS5sb2coJ0xvYWRpbmcgYXNzZXRzJyk7XHJcblx0XHRsb2FkQXNzZXRzKFxyXG5cdFx0XHR0aGlzLFxyXG5cdFx0XHRVaUFzc2V0cyxcclxuXHRcdFx0SXRlbUFzc2V0cyxcclxuXHRcdFx0V29ybGRBc3NldHMsXHJcblx0XHRcdEZvbnRzLFxyXG5cdFx0XHRQbGF5ZXJBbmltYXRpb25zLFxyXG5cdFx0KTtcclxuXHRcdGNvbnNvbGUubG9nKCdBc3NldCBsb2FkaW5nIGNvbXBsZXRlZCcpO1xyXG5cdFx0dGhpcy5za3lTaGFkZXIgPSB0aGlzLmxvYWRTaGFkZXIoXHJcblx0XHRcdCdhc3NldHMvc2hhZGVycy9iYXNpYy52ZXJ0JyxcclxuXHRcdFx0J2Fzc2V0cy9zaGFkZXJzL3NreS5mcmFnJyxcclxuXHRcdCk7XHJcblx0fVxyXG5cclxuXHRzZXR1cCgpIHtcclxuXHRcdGNvbnNvbGUubG9nKCdzZXR1cCBjYWxsZWQnKTtcclxuXHRcdC8vIG1ha2UgYSBjYW52YXMgdGhhdCBmaWxscyB0aGUgd2hvbGUgc2NyZWVuIChhIGNhbnZhcyBpcyB3aGF0IGlzIGRyYXduIHRvIGluIHA1LmpzLCBhcyB3ZWxsIGFzIGxvdHMgb2Ygb3RoZXIgSlMgcmVuZGVyaW5nIGxpYnJhcmllcylcclxuXHRcdHRoaXMuY2FudmFzID0gdGhpcy5jcmVhdGVDYW52YXModGhpcy53aW5kb3dXaWR0aCwgdGhpcy53aW5kb3dIZWlnaHQpO1xyXG5cdFx0dGhpcy5jYW52YXMubW91c2VPdXQodGhpcy5tb3VzZUV4aXRlZCk7XHJcblx0XHR0aGlzLmNhbnZhcy5tb3VzZU92ZXIodGhpcy5tb3VzZUVudGVyZWQpO1xyXG5cclxuXHRcdHRoaXMuc2t5TGF5ZXIgPSB0aGlzLmNyZWF0ZUdyYXBoaWNzKHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0LCAnd2ViZ2wnKTtcclxuXHJcblx0XHR0aGlzLmN1cnJlbnRVaSA9IG5ldyBNYWluTWVudShGb250cy50aXRsZSwgRm9udHMuYmlnKTtcclxuXHJcblx0XHQvLyBUaWNrXHJcblx0XHRzZXRJbnRlcnZhbCgoKSA9PiB7XHJcblx0XHRcdGlmICh0aGlzLndvcmxkID09PSB1bmRlZmluZWQpIHJldHVybjtcclxuXHRcdFx0dGhpcy53b3JsZC50aWNrKHRoaXMpO1xyXG5cdFx0fSwgMTAwMCAvIHRoaXMubmV0TWFuYWdlci5wbGF5ZXJUaWNrUmF0ZSk7XHJcblxyXG5cdFx0dGhpcy5jb25uZWN0aW9uLmVtaXQoXHJcblx0XHRcdCdqb2luJyxcclxuXHRcdFx0J2U0MDIyZDQwM2RjYzZkMTlkNmE2OGJhM2FiZmQwYTYwJyxcclxuXHRcdFx0J3BsYXllcicgKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDAwKSxcclxuXHRcdCk7XHJcblxyXG5cdFx0Ly8gZ28gZm9yIGEgc2NhbGUgb2YgPDY0IHRpbGVzIHdpZGUgc2NyZWVuXHJcblx0XHR0aGlzLndpbmRvd1Jlc2l6ZWQoKTtcclxuXHJcblx0XHQvLyByZW1vdmUgdGV4dHVyZSBpbnRlcnBvbGF0aW9uIChlbmFibGUgcG9pbnQgZmlsdGVyaW5nIGZvciBpbWFnZXMpXHJcblx0XHR0aGlzLm5vU21vb3RoKCk7XHJcblxyXG5cdFx0Ly8gdGhlIGhpZ2hlc3Qga2V5Y29kZSBpcyAyNTUsIHdoaWNoIGlzIFwiVG9nZ2xlIFRvdWNocGFkXCIsIGFjY29yZGluZyB0byBrZXljb2RlLmluZm9cclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgMjU1OyBpKyspIHtcclxuXHRcdFx0dGhpcy5rZXlzLnB1c2goZmFsc2UpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCB0aGUgZnJhbWVyYXRlIGdvYWwgdG8gYXMgaGlnaCBhcyBwb3NzaWJsZSAodGhpcyB3aWxsIGVuZCB1cCBjYXBwaW5nIHRvIHlvdXIgbW9uaXRvcidzIHJlZnJlc2ggcmF0ZSB3aXRoIHZzeW5jLilcclxuXHRcdHRoaXMuZnJhbWVSYXRlKEluZmluaXR5KTtcclxuXHRcdC8vIEF1ZGlvQW5wc3NldHMuYW1iaWVudC53aW50ZXIxLnBsYXlTb3VuZCgpO1xyXG5cdFx0dGhpcy5wYXJ0aWNsZU11bHRpcGxpZXIgPSAxO1xyXG5cdFx0dGhpcy5za3lUb2dnbGUgPSB0cnVlO1xyXG5cdFx0dGhpcy5za3lNb2QgPSAyO1xyXG5cdFx0dGhpcy5wYXJ0aWNsZXMgPSBbXTtcclxuXHRcdHRoaXMuY2xvdWRzID0gW107XHJcblx0XHRmb3IobGV0IGkgPSAwOyBpPHRoaXMud2lkdGgvdGhpcy51cHNjYWxlU2l6ZS8xNTsgaSsrKSB7XHJcblx0XHRcdHRoaXMuY2xvdWRzLnB1c2gobmV3IENsb3VkKE1hdGgucmFuZG9tKCkqdGhpcy53aWR0aC90aGlzLnVwc2NhbGVTaXplL3RoaXMuVElMRV9XSURUSCwgMi8oMC4wMytNYXRoLnJhbmRvbSgpKS01KSk7XHJcblx0XHR9XHJcblx0XHRjb25zb2xlLmxvZyhcInRoZXJlIGFyZSBcIit0aGlzLmNsb3Vkcy5sZW5ndGgrXCIgY2xvdWRzXCIpXHJcblx0XHR0aGlzLmN1cnNvcihcImFzc2V0cy90ZXh0dXJlcy91aS9jdXJzb3IyLnBuZ1wiKTtcclxuXHR9XHJcblxyXG5cdGRyYXcoKSB7XHJcblx0XHRpZiAodGhpcy5mcmFtZUNvdW50ID09PSAyKSB7XHJcblx0XHRcdC8vaGFzIHRvIGJlIGRvbmUgb24gdGhlIHNlY29uZCBmcmFtZSBmb3Igc29tZSByZWFzb24/XHJcblx0XHRcdHRoaXMuc2t5U2hhZGVyLnNldFVuaWZvcm0oJ3NjcmVlbkRpbWVuc2lvbnMnLCBbXHJcblx0XHRcdFx0KHRoaXMud2lkdGggLyB0aGlzLnVwc2NhbGVTaXplKSAqIDIsXHJcblx0XHRcdFx0KHRoaXMuaGVpZ2h0IC8gdGhpcy51cHNjYWxlU2l6ZSkgKiAyLFxyXG5cdFx0XHRdKTtcclxuXHRcdFx0dGhpcy5za3lTaGFkZXIuc2V0VW5pZm9ybShcclxuXHRcdFx0XHQnc2t5SW1hZ2UnLFxyXG5cdFx0XHRcdFdvcmxkQXNzZXRzLnNoYWRlclJlc291cmNlcy5za3lJbWFnZS5pbWFnZSxcclxuXHRcdFx0KTtcclxuXHRcdFx0Ly8gT2JqZWN0LnZhbHVlcyhQbGF5ZXJBbmltYXRpb25zKS5mb3JFYWNoKHBsYXllckFuaW1hdGlvbiA9PiB7XHJcblx0XHRcdC8vIFx0cGxheWVyQW5pbWF0aW9uLmZvckVhY2goYW5pbWF0aW9uRnJhbWUgPT4ge1xyXG5cdFx0XHQvLyBcdFx0Y29uc29sZS5sb2coXCJsb2FkaW5nIGFuaW1hdGlvbiBcIithbmltYXRpb25GcmFtZVswXS5wYXRoKVxyXG5cdFx0XHQvLyBcdFx0YW5pbWF0aW9uRnJhbWVbMF0ubG9hZFJlZmxlY3Rpb24odGhpcylcclxuXHRcdFx0Ly8gXHR9KVxyXG5cdFx0XHQvLyB9KTtcclxuXHRcdH1cclxuXHRcdC8vIGRvIHRoZSB0aWNrIGNhbGN1bGF0aW9uc1xyXG5cdFx0dGhpcy5kb1RpY2tzKCk7XHJcblxyXG5cdFx0Ly8gdXBkYXRlIG1vdXNlIHBvc2l0aW9uXHJcblx0XHR0aGlzLnVwZGF0ZU1vdXNlKCk7XHJcblx0XHRpZih0aGlzLm1vdXNlSXNQcmVzc2VkKSB7XHJcblx0XHR0aGlzLndvcmxkLmludmVudG9yeS53b3JsZENsaWNrKHRoaXMud29ybGRNb3VzZVgsIHRoaXMud29ybGRNb3VzZVkpO31cclxuXHJcblx0XHQvLyB1cGRhdGUgdGhlIGNhbWVyYSdzIGludGVycG9sYXRpb25cclxuXHRcdHRoaXMubW92ZUNhbWVyYSgpO1xyXG5cclxuXHRcdC8vIHdpcGUgdGhlIHNjcmVlbiB3aXRoIGEgaGFwcHkgbGl0dGxlIGxheWVyIG9mIGxpZ2h0IGJsdWVcclxuXHRcdHRoaXMuc2t5U2hhZGVyLnNldFVuaWZvcm0oJ29mZnNldENvb3JkcycsIFtcclxuXHRcdFx0dGhpcy5pbnRlcnBvbGF0ZWRDYW1YLFxyXG5cdFx0XHR0aGlzLmludGVycG9sYXRlZENhbVksXHJcblx0XHRdKTtcclxuXHRcdHRoaXMuc2t5U2hhZGVyLnNldFVuaWZvcm0oJ21pbGxpcycsIHRoaXMubWlsbGlzKCkpO1xyXG5cdFx0dGhpcy5za3lMYXllci5zaGFkZXIodGhpcy5za3lTaGFkZXIpO1xyXG5cdFx0Ly8gdGhpcy5maWxsKDI1NSwgMCwgMCk7XHJcblx0XHR0aGlzLnNreUxheWVyLnJlY3QoMCwgMCwgdGhpcy5za3lMYXllci53aWR0aCwgdGhpcy5za3lMYXllci5oZWlnaHQpO1xyXG5cclxuXHRcdHRoaXMuaW1hZ2UodGhpcy5za3lMYXllciwgMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xyXG5cclxuXHRcdGZvciAobGV0IGNsb3VkIG9mIHRoaXMuY2xvdWRzKSB7XHJcblx0XHRcdGNsb3VkLnJlbmRlcih0aGlzLCB0aGlzLnVwc2NhbGVTaXplKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy53b3JsZCAhPT0gdW5kZWZpbmVkKSB0aGlzLndvcmxkLnJlbmRlcih0aGlzLCB0aGlzLnVwc2NhbGVTaXplKTtcclxuXHJcblx0XHQvLyByZW5kZXIgdGhlIHBsYXllciwgYWxsIGl0ZW1zLCBldGMuXHJcblx0XHQvL3RoaXMucmVuZGVyRW50aXRpZXMoKTtcclxuXHJcblx0XHQvL2RlbGV0ZSBhbnkgcGFydGljbGVzIHRoYXQgaGF2ZSBnb3R0ZW4gdG9vIG9sZFxyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBhcnRpY2xlcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRpZiAodGhpcy5wYXJ0aWNsZXNbaV0uYWdlID4gdGhpcy5wYXJ0aWNsZXNbaV0ubGlmZXNwYW4pIHtcclxuXHRcdFx0XHR0aGlzLnBhcnRpY2xlcy5zcGxpY2UoaSwgMSk7XHJcblx0XHRcdFx0aS0tO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Ly9ubyBvdXRsaW5lIG9uIHBhcnRpY2xlc1xyXG5cdFx0dGhpcy5ub1N0cm9rZSgpO1xyXG5cdFx0Ly9kcmF3IGFsbCBvZiB0aGUgcGFydGljbGVzXHJcblx0XHRmb3IgKGxldCBwYXJ0aWNsZSBvZiB0aGlzLnBhcnRpY2xlcykge1xyXG5cdFx0XHRwYXJ0aWNsZS5yZW5kZXIodGhpcywgdGhpcy51cHNjYWxlU2l6ZSk7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5zbW9vdGgoKTsgLy9lbmFibGUgaW1hZ2UgbGVycFxyXG5cdFx0dGhpcy5kcmF3aW5nQ29udGV4dC5nbG9iYWxBbHBoYSA9IDAuNjsgLy9tYWtlIGltYWdlIHRyYW5zbHVjZW50XHJcblx0XHRVaUFzc2V0cy52aWduZXR0ZS5yZW5kZXIodGhpcywgMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xyXG5cdFx0dGhpcy5kcmF3aW5nQ29udGV4dC5nbG9iYWxBbHBoYSA9IDEuMDtcclxuXHRcdHRoaXMubm9TbW9vdGgoKTtcclxuXHJcblx0XHQvLyBkcmF3IHRoZSBob3QgYmFyXHJcblx0XHRpZiAodGhpcy53b3JsZCAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy53b3JsZC5pbnZlbnRvcnkud2lkdGg7IGkrKykge1xyXG5cdFx0XHRcdGNvbnN0IGN1cnJlbnRJdGVtID0gdGhpcy53b3JsZC5pbnZlbnRvcnkuaXRlbXNbaV07XHJcblxyXG5cdFx0XHRcdFVpQXNzZXRzLnVpX3Nsb3QucmVuZGVyKFxyXG5cdFx0XHRcdFx0dGhpcyxcclxuXHRcdFx0XHRcdDIgKiB0aGlzLnVwc2NhbGVTaXplICsgMTYgKiBpICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0XHRcdDIgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHRcdFx0MTYgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHRcdFx0MTYgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHRcdCk7XHJcblxyXG5cdFx0XHRcdGlmICh0aGlzLndvcmxkLmludmVudG9yeS5zZWxlY3RlZFNsb3QgPT09IGkpIHtcclxuXHRcdFx0XHRcdFVpQXNzZXRzLnVpX3Nsb3Rfc2VsZWN0ZWQucmVuZGVyKFxyXG5cdFx0XHRcdFx0XHR0aGlzLFxyXG5cdFx0XHRcdFx0XHQyICogdGhpcy51cHNjYWxlU2l6ZSArIDE2ICogaSAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdFx0XHRcdDIgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHRcdFx0XHQxNiAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdFx0XHRcdDE2ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0XHRcdCk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFVpQXNzZXRzLnVpX3Nsb3QucmVuZGVyKFxyXG5cdFx0XHRcdFx0XHR0aGlzLFxyXG5cdFx0XHRcdFx0XHQyICogdGhpcy51cHNjYWxlU2l6ZSArIDE2ICogaSAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdFx0XHRcdDIgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHRcdFx0XHQxNiAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdFx0XHRcdDE2ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0XHRcdCk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAoY3VycmVudEl0ZW0gIT09IHVuZGVmaW5lZCAmJiBjdXJyZW50SXRlbSAhPT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0dGhpcy5maWxsKDApO1xyXG5cdFx0XHRcdFx0aWYgKHRoaXMucGlja2VkVXBTbG90ID09PSBpKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuZHJhd2luZ0NvbnRleHQuZ2xvYmFsQWxwaGEgPSAwLjU7XHJcblx0XHRcdFx0XHRcdHRoaXMuZmlsbCgwLCAxMjcpO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdEl0ZW1Bc3NldHNbY3VycmVudEl0ZW0uaXRlbV0ucmVuZGVyKFxyXG5cdFx0XHRcdFx0XHR0aGlzLFxyXG5cdFx0XHRcdFx0XHQ2ICogdGhpcy51cHNjYWxlU2l6ZSArIDE2ICogaSAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdFx0XHRcdDYgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHRcdFx0XHQ4ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0XHRcdFx0OCAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdFx0XHQpO1xyXG5cclxuXHRcdFx0XHRcdEZvbnRzLnRvbV90aHVtYi5kcmF3VGV4dCh0aGlzLCBjdXJyZW50SXRlbS5xdWFudGl0eS50b1N0cmluZygpLCAoLTQgKiBjdXJyZW50SXRlbS5xdWFudGl0eS50b1N0cmluZygpLmxlbmd0aCArIDE2ICogKGkrMS4wNjI1KSkgKiB0aGlzLnVwc2NhbGVTaXplLCAxMSAqIHRoaXMudXBzY2FsZVNpemUpXHJcblx0XHRcdFx0XHQvLyB0aGlzLnRleHQoXHJcblx0XHRcdFx0XHQvLyBcdGN1cnJlbnRJdGVtLnF1YW50aXR5LFxyXG5cdFx0XHRcdFx0Ly8gXHQxNiAqIHRoaXMudXBzY2FsZVNpemUgKyAxNiAqIGkgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHRcdFx0Ly8gXHQxNiAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdFx0XHQvLyApO1xyXG5cclxuXHRcdFx0XHRcdHRoaXMuZHJhd2luZ0NvbnRleHQuZ2xvYmFsQWxwaGEgPSAxLjA7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBkcmF3IHRoZSBjdXJzb3JcclxuXHRcdFx0dGhpcy5kcmF3Q3Vyc29yKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHRoaXMuY3VycmVudFVpICE9PSB1bmRlZmluZWQpXHJcblx0XHRcdHRoaXMuY3VycmVudFVpLnJlbmRlcih0aGlzLCB0aGlzLnVwc2NhbGVTaXplKTtcclxuXHJcblx0XHRGb250cy50b21fdGh1bWIuZHJhd1RleHQodGhpcywgXCJTbm93ZWQgSW4gdjEuMC4wXCIsIHRoaXMudXBzY2FsZVNpemUsIHRoaXMuaGVpZ2h0LTYqdGhpcy51cHNjYWxlU2l6ZSk7XHJcblxyXG5cdFx0Ly8gY29uc29sZS50aW1lRW5kKFwiZnJhbWVcIik7XHJcblx0fVxyXG5cclxuXHR3aW5kb3dSZXNpemVkKCkge1xyXG5cclxuXHRcdGxldCBwVXBzY2FsZVNpemUgPSB0aGlzLnVwc2NhbGVTaXplO1xyXG5cdFx0Ly8gZ28gZm9yIGEgc2NhbGUgb2YgPDQ4IHRpbGVzIHNjcmVlblxyXG5cdFx0dGhpcy51cHNjYWxlU2l6ZSA9IE1hdGgubWluKFxyXG5cdFx0XHRNYXRoLmNlaWwodGhpcy53aW5kb3dXaWR0aCAvIDQ4IC8gdGhpcy5USUxFX1dJRFRIKSxcclxuXHRcdFx0TWF0aC5jZWlsKHRoaXMud2luZG93SGVpZ2h0IC8gNDggLyB0aGlzLlRJTEVfSEVJR0hUKSxcclxuXHRcdCk7XHJcblxyXG5cdFx0aWYodGhpcy5jbG91ZHMhPSB1bmRlZmluZWQgJiYgdGhpcy5jbG91ZHMubGVuZ3RoPjApIHsvL3N0cmV0Y2ggY2xvdWQgbG9jYXRpb25zIHNvIGFzIHRvIG5vdCBjcmVhdGUgZ2Fwc1xyXG5cdFx0XHRmb3IobGV0IGNsb3VkIG9mIHRoaXMuY2xvdWRzKSB7XHJcblx0XHRcdFx0Y2xvdWQueCA9IHRoaXMuaW50ZXJwb2xhdGVkQ2FtWCArIChjbG91ZC54LXRoaXMuaW50ZXJwb2xhdGVkQ2FtWCkqdGhpcy53aW5kb3dXaWR0aC90aGlzLndpZHRoL3RoaXMudXBzY2FsZVNpemUqcFVwc2NhbGVTaXplO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHR0aGlzLnJlc2l6ZUNhbnZhcyh0aGlzLndpbmRvd1dpZHRoLCB0aGlzLndpbmRvd0hlaWdodCk7XHJcblx0XHR0aGlzLnNreUxheWVyLnJlc2l6ZUNhbnZhcyh0aGlzLndpbmRvd1dpZHRoLCB0aGlzLndpbmRvd0hlaWdodCk7XHJcblxyXG5cdFx0XHJcblxyXG5cdFx0dGhpcy5za3lTaGFkZXIuc2V0VW5pZm9ybSgnc2NyZWVuRGltZW5zaW9ucycsIFtcclxuXHRcdFx0KHRoaXMud2luZG93V2lkdGggLyB0aGlzLnVwc2NhbGVTaXplKSAqIDIsXHJcblx0XHRcdCh0aGlzLndpbmRvd0hlaWdodCAvIHRoaXMudXBzY2FsZVNpemUpICogMixcclxuXHRcdF0pO1xyXG5cclxuXHRcdGlmICh0aGlzLmN1cnJlbnRVaSAhPT0gdW5kZWZpbmVkKSB0aGlzLmN1cnJlbnRVaS53aW5kb3dVcGRhdGUoKTtcclxuXHR9XHJcblxyXG5cdGtleVByZXNzZWQoZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcclxuXHRcdHRoaXMua2V5c1t0aGlzLmtleUNvZGVdID0gdHJ1ZTtcclxuXHRcdGZvciAobGV0IGNvbnRyb2wgb2YgdGhpcy5jb250cm9scykge1xyXG5cdFx0XHRpZiAoY29udHJvbC5rZXlib2FyZCAmJiBjb250cm9sLmtleUNvZGUgPT09IGV2ZW50LmtleUNvZGUpXHJcblx0XHRcdFx0Ly9ldmVudC5rZXlDb2RlIGlzIGRlcHJlY2F0ZWQgYnV0IGkgZG9uJ3QgY2FyZVxyXG5cdFx0XHRcdGNvbnRyb2wub25QcmVzc2VkKCk7XHJcblx0XHR9XHJcblx0XHRpZiAoXHJcblx0XHRcdHRoaXMuY3VycmVudFVpICE9PSB1bmRlZmluZWQgJiZcclxuXHRcdFx0dGhpcy5jdXJyZW50VWkuaW5wdXRCb3hlcyAhPT0gdW5kZWZpbmVkXHJcblx0XHQpIHtcclxuXHRcdFx0Zm9yIChsZXQgaSBvZiB0aGlzLmN1cnJlbnRVaS5pbnB1dEJveGVzKSB7XHJcblx0XHRcdFx0aWYgKGkubGlzdGVuaW5nKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZygndGVzdDMnKTtcclxuXHRcdFx0XHRcdGkubGlzdGVuaW5nID0gZmFsc2U7XHJcblx0XHRcdFx0XHR0aGlzLmNvbnRyb2xzW2kuaW5kZXhdLmtleUNvZGUgPSBldmVudC5rZXlDb2RlO1xyXG5cdFx0XHRcdFx0dGhpcy5jb250cm9sc1tpLmluZGV4XS5rZXlib2FyZCA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0aS52YWx1ZSA9IGV2ZW50LmtleUNvZGU7XHJcblx0XHRcdFx0XHRpLmtleWJvYXJkID0gdHJ1ZTtcclxuXHRcdFx0XHRcdGkuaW1hZ2UgPSBVaUFzc2V0cy5idXR0b25fdW5zZWxlY3RlZDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGtleVJlbGVhc2VkKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XHJcblx0XHR0aGlzLmtleXNbdGhpcy5rZXlDb2RlXSA9IGZhbHNlO1xyXG5cdFx0Zm9yIChsZXQgY29udHJvbCBvZiB0aGlzLmNvbnRyb2xzKSB7XHJcblx0XHRcdGlmIChjb250cm9sLmtleWJvYXJkICYmIGNvbnRyb2wua2V5Q29kZSA9PT0gZXZlbnQua2V5Q29kZSlcclxuXHRcdFx0XHQvL2V2ZW50LmtleUNvZGUgaXMgZGVwcmVjYXRlZCBidXQgaSBkb24ndCBjYXJlXHJcblx0XHRcdFx0Y29udHJvbC5vblJlbGVhc2VkKCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvLyB3aGVuIGl0J3MgZHJhZ2dlZCB1cGRhdGUgdGhlIHNsaWRlcnNcclxuXHRtb3VzZURyYWdnZWQoKSB7XHJcblx0XHRpZiAoXHJcblx0XHRcdHRoaXMuY3VycmVudFVpICE9PSB1bmRlZmluZWQgJiZcclxuXHRcdFx0dGhpcy5jdXJyZW50VWkuc2xpZGVycyAhPT0gdW5kZWZpbmVkXHJcblx0XHQpIHtcclxuXHRcdFx0Zm9yIChjb25zdCBpIG9mIHRoaXMuY3VycmVudFVpLnNsaWRlcnMpIHtcclxuXHRcdFx0XHRpLnVwZGF0ZVNsaWRlclBvc2l0aW9uKHRoaXMubW91c2VYKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0bW91c2VNb3ZlZCgpIHtcclxuXHRcdGlmICh0aGlzLmN1cnJlbnRVaSAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdGlmICh0aGlzLmN1cnJlbnRVaS5idXR0b25zICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHRmb3IgKGNvbnN0IGkgb2YgdGhpcy5jdXJyZW50VWkuYnV0dG9ucykge1xyXG5cdFx0XHRcdFx0aS51cGRhdGVNb3VzZU92ZXIodGhpcy5tb3VzZVgsIHRoaXMubW91c2VZKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHRoaXMuY3VycmVudFVpLmlucHV0Qm94ZXMgIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdGZvciAoY29uc3QgaSBvZiB0aGlzLmN1cnJlbnRVaS5pbnB1dEJveGVzKSB7XHJcblx0XHRcdFx0XHRpLnVwZGF0ZU1vdXNlT3Zlcih0aGlzLm1vdXNlWCwgdGhpcy5tb3VzZVkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0bW91c2VQcmVzc2VkKGU6IE1vdXNlRXZlbnQpIHtcclxuXHRcdC8vIGltYWdlKHVpU2xvdEltYWdlLCAyKnVwc2NhbGVTaXplKzE2KmkqdXBzY2FsZVNpemUsIDIqdXBzY2FsZVNpemUsIDE2KnVwc2NhbGVTaXplLCAxNip1cHNjYWxlU2l6ZSk7XHJcblx0XHRpZiAodGhpcy5jdXJyZW50VWkgIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHR0aGlzLmN1cnJlbnRVaS5tb3VzZVByZXNzZWQoZS5idXR0b24pO1xyXG5cdFx0XHRyZXR1cm47IC8vIGFzamdzYWRramZnSUlTVVNVRVVFXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHRoaXMud29ybGQgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xyXG5cclxuXHRcdGlmIChcclxuXHRcdFx0dGhpcy5tb3VzZVggPiAyICogdGhpcy51cHNjYWxlU2l6ZSAmJlxyXG5cdFx0XHR0aGlzLm1vdXNlWCA8XHJcblx0XHRcdDIgKiB0aGlzLnVwc2NhbGVTaXplICtcclxuXHRcdFx0MTYgKiB0aGlzLnVwc2NhbGVTaXplICogdGhpcy53b3JsZC5pbnZlbnRvcnkud2lkdGggJiZcclxuXHRcdFx0dGhpcy5tb3VzZVkgPiAyICogdGhpcy51cHNjYWxlU2l6ZSAmJlxyXG5cdFx0XHR0aGlzLm1vdXNlWSA8IDE4ICogdGhpcy51cHNjYWxlU2l6ZVxyXG5cdFx0KSB7XHJcblx0XHRcdGNvbnN0IGNsaWNrZWRTbG90OiBudW1iZXIgPSBNYXRoLmZsb29yKFxyXG5cdFx0XHRcdCh0aGlzLm1vdXNlWCAtIDIgKiB0aGlzLnVwc2NhbGVTaXplKSAvIDE2IC8gdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0KTtcclxuXHJcblx0XHRcdGlmICh0aGlzLndvcmxkLmludmVudG9yeS5waWNrZWRVcFNsb3QgPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdGlmICh0aGlzLndvcmxkLmludmVudG9yeS5pdGVtc1tjbGlja2VkU2xvdF0gIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdFx0dGhpcy53b3JsZC5pbnZlbnRvcnkucGlja2VkVXBTbG90ID0gY2xpY2tlZFNsb3Q7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdC8vIFN3YXAgY2xpY2tlZCBzbG90IHdpdGggdGhlIHBpY2tlZCBzbG90XHJcblx0XHRcdFx0dGhpcy5jb25uZWN0aW9uLmVtaXQoXHJcblx0XHRcdFx0XHQnaW52ZW50b3J5U3dhcCcsXHJcblx0XHRcdFx0XHR0aGlzLndvcmxkLmludmVudG9yeS5waWNrZWRVcFNsb3QsXHJcblx0XHRcdFx0XHRjbGlja2VkU2xvdCxcclxuXHRcdFx0XHQpO1xyXG5cclxuXHRcdFx0XHQvLyBTZXQgdGhlIHBpY2tlZCB1cCBzbG90IHRvIG5vdGhpbmdcclxuXHRcdFx0XHR0aGlzLndvcmxkLmludmVudG9yeS5waWNrZWRVcFNsb3QgPSB1bmRlZmluZWQ7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMud29ybGQuaW52ZW50b3J5LndvcmxkQ2xpY2tDaGVjayh0aGlzLndvcmxkTW91c2VYLCB0aGlzLndvcmxkTW91c2VZKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdG1vdXNlUmVsZWFzZWQoKSB7XHJcblx0XHQvKlxyXG5cdFx0aWYodGhpcy5jdXJyZW50VWkgIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHR0aGlzLmN1cnJlbnRVaS5tb3VzZVJlbGVhc2VkKCk7XHJcblx0XHR9XHJcblx0XHRjb25zdCByZWxlYXNlZFNsb3Q6IG51bWJlciA9IE1hdGguZmxvb3IoXHJcblx0XHRcdCh0aGlzLm1vdXNlWCAtIDIgKiB0aGlzLnVwc2NhbGVTaXplKSAvIDE2IC8gdGhpcy51cHNjYWxlU2l6ZVxyXG5cdFx0KTtcclxuXHJcblx0XHRpZiAodGhpcy5waWNrZWRVcFNsb3QgIT09IC0xKSB7XHJcblx0XHRcdGlmIChcclxuXHRcdFx0XHR0aGlzLm1vdXNlWCA+IDIgKiB0aGlzLnVwc2NhbGVTaXplICYmXHJcblx0XHRcdFx0dGhpcy5tb3VzZVggPFxyXG5cdFx0XHRcdFx0MiAqIHRoaXMudXBzY2FsZVNpemUgK1xyXG5cdFx0XHRcdFx0XHQxNiAqIHRoaXMudXBzY2FsZVNpemUgKiB0aGlzLmhvdEJhci5sZW5ndGggJiZcclxuXHRcdFx0XHR0aGlzLm1vdXNlWSA+IDIgKiB0aGlzLnVwc2NhbGVTaXplICYmXHJcblx0XHRcdFx0dGhpcy5tb3VzZVkgPCAxOCAqIHRoaXMudXBzY2FsZVNpemVcclxuXHRcdFx0KSB7XHJcblx0XHRcdFx0Ly8gTWFrZSBzdXJlIHRoYXQgdGhlIHNsb3QgdGhhdCB0aGUgY3Vyc29yIHdhcyByZWxlYXNlZCB3YXMgbm90IHRoZSBzbG90IHRoYXQgd2FzIHNlbGVjdGVkXHJcblx0XHRcdFx0aWYgKHJlbGVhc2VkU2xvdCA9PT0gdGhpcy5waWNrZWRVcFNsb3QpIHJldHVybjtcclxuXHJcblx0XHRcdFx0Ly8gU3dhcCB0aGUgcGlja2VkIHVwIHNsb3Qgd2l0aCB0aGUgc2xvdCB0aGUgbW91c2Ugd2FzIHJlbGVhc2VkIG9uXHJcblx0XHRcdFx0W3RoaXMuaG90QmFyW3RoaXMucGlja2VkVXBTbG90XSwgdGhpcy5ob3RCYXJbcmVsZWFzZWRTbG90XV0gPSBbXHJcblx0XHRcdFx0XHR0aGlzLmhvdEJhcltyZWxlYXNlZFNsb3RdLFxyXG5cdFx0XHRcdFx0dGhpcy5ob3RCYXJbdGhpcy5waWNrZWRVcFNsb3RdLFxyXG5cdFx0XHRcdF07XHJcblxyXG5cdFx0XHRcdHRoaXMucGlja2VkVXBTbG90ID0gLTE7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGhpcy5ob3RCYXJbdGhpcy5waWNrZWRVcFNsb3RdID0gdW5kZWZpbmVkO1xyXG5cdFx0XHRcdHRoaXMucGlja2VkVXBTbG90ID0gLTE7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHQgKi9cclxuXHR9XHJcblxyXG5cdG1vdXNlV2hlZWwoZXZlbnQ6IGFueSkge1xyXG5cdFx0Ly9tb3VzZUV2ZW50IGFwcGFyZW50bHkgZG9lc24ndCBoYXZlIGEgZGVsdGEgcHJvcGVydHkgc29vb29vIGlkayB3aGF0IHRvIGRvIHNvcnJ5IGZvciB0aGUgYW55IHR5cGVcclxuXHRcdGlmIChcclxuXHRcdFx0dGhpcy5jdXJyZW50VWkgIT09IHVuZGVmaW5lZCAmJlxyXG5cdFx0XHR0aGlzLmN1cnJlbnRVaS5zY3JvbGwgIT09IHVuZGVmaW5lZFxyXG5cdFx0KSB7XHJcblx0XHRcdHRoaXMuY3VycmVudFVpLnNjcm9sbCArPSBldmVudC5kZWx0YSAvIDEwO1xyXG5cdFx0XHR0aGlzLmN1cnJlbnRVaS5zY3JvbGwgPSB0aGlzLmNvbnN0cmFpbihcclxuXHRcdFx0XHR0aGlzLmN1cnJlbnRVaS5zY3JvbGwsXHJcblx0XHRcdFx0dGhpcy5jdXJyZW50VWkubWluU2Nyb2xsLFxyXG5cdFx0XHRcdHRoaXMuY3VycmVudFVpLm1heFNjcm9sbCxcclxuXHRcdFx0KTtcclxuXHRcdFx0Y29uc29sZS5sb2coXHJcblx0XHRcdFx0YFNjcm9sbDogJHt0aGlzLmN1cnJlbnRVaS5zY3JvbGx9LCBNaW46ICR7dGhpcy5jdXJyZW50VWkubWluU2Nyb2xsfSwgTWF4OiAke3RoaXMuY3VycmVudFVpLm1heFNjcm9sbH1gLFxyXG5cdFx0XHQpO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHRoaXMud29ybGQuaW52ZW50b3J5LnNlbGVjdGVkU2xvdCArPSBNYXRoLmZsb29yKGV2ZW50LmRlbHRhLzEwMClcclxuXHRcdFx0dGhpcy53b3JsZC5pbnZlbnRvcnkuc2VsZWN0ZWRTbG90ID0gdGhpcy53b3JsZC5pbnZlbnRvcnkuc2VsZWN0ZWRTbG90JXRoaXMud29ybGQuaW52ZW50b3J5LndpZHRoO1xyXG5cdFx0XHRpZih0aGlzLndvcmxkLmludmVudG9yeS5zZWxlY3RlZFNsb3Q8MCkgdGhpcy53b3JsZC5pbnZlbnRvcnkuc2VsZWN0ZWRTbG90ICs9IHRoaXMud29ybGQuaW52ZW50b3J5LndpZHRoXHJcblx0XHRcdGNvbnNvbGUubG9nKHRoaXMud29ybGQuaW52ZW50b3J5LnNlbGVjdGVkU2xvdClcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdG1vdmVDYW1lcmEoKSB7XHJcblx0XHR0aGlzLmludGVycG9sYXRlZENhbVggPVxyXG5cdFx0XHR0aGlzLnBDYW1YICtcclxuXHRcdFx0KHRoaXMuY2FtWCAtIHRoaXMucENhbVgpICogdGhpcy5hbW91bnRTaW5jZUxhc3RUaWNrICtcclxuXHRcdFx0KHRoaXMubm9pc2UodGhpcy5taWxsaXMoKSAvIDIwMCkgLSAwLjUpICogdGhpcy5zY3JlZW5zaGFrZUFtb3VudDtcclxuXHRcdHRoaXMuaW50ZXJwb2xhdGVkQ2FtWSA9XHJcblx0XHRcdHRoaXMucENhbVkgK1xyXG5cdFx0XHQodGhpcy5jYW1ZIC0gdGhpcy5wQ2FtWSkgKiB0aGlzLmFtb3VudFNpbmNlTGFzdFRpY2sgK1xyXG5cdFx0XHQodGhpcy5ub2lzZSgwLCB0aGlzLm1pbGxpcygpIC8gMjAwKSAtIDAuNSkgKiB0aGlzLnNjcmVlbnNoYWtlQW1vdW50O1xyXG5cdH1cclxuXHJcblx0ZG9UaWNrcygpIHtcclxuXHRcdC8vIGluY3JlYXNlIHRoZSB0aW1lIHNpbmNlIGEgdGljayBoYXMgaGFwcGVuZWQgYnkgZGVsdGFUaW1lLCB3aGljaCBpcyBhIGJ1aWx0LWluIHA1LmpzIHZhbHVlXHJcblx0XHR0aGlzLm1zU2luY2VUaWNrICs9IHRoaXMuZGVsdGFUaW1lO1xyXG5cclxuXHRcdC8vIGRlZmluZSBhIHRlbXBvcmFyeSB2YXJpYWJsZSBjYWxsZWQgdGlja3NUaGlzRnJhbWUgLSB0aGlzIGlzIHVzZWQgdG8ga2VlcCB0cmFjayBvZiBob3cgbWFueSB0aWNrcyBoYXZlIGJlZW4gY2FsY3VsYXRlZCB3aXRoaW4gdGhlIGR1cmF0aW9uIG9mIHRoZSBjdXJyZW50IGZyYW1lLiAgQXMgbG9uZyBhcyB0aGlzIHZhbHVlIGlzIGxlc3MgdGhhbiB0aGUgZm9yZ2l2ZW5lc3NDb3VudCB2YXJpYWJsZSwgaXQgY29udGludWVzIHRvIGNhbGN1bGF0ZSB0aWNrcyBhcyBuZWNlc3NhcnkuXHJcblx0XHRsZXQgdGlja3NUaGlzRnJhbWUgPSAwO1xyXG5cdFx0d2hpbGUgKFxyXG5cdFx0XHR0aGlzLm1zU2luY2VUaWNrID4gdGhpcy5tc1BlclRpY2sgJiZcclxuXHRcdFx0dGlja3NUaGlzRnJhbWUgIT09IHRoaXMuZm9yZ2l2ZW5lc3NDb3VudFxyXG5cdFx0KSB7XHJcblx0XHRcdC8vIGNvbnNvbGUudGltZShcInRpY2tcIik7XHJcblx0XHRcdGlmICh0aGlzLndvcmxkICE9PSB1bmRlZmluZWQpIHRoaXMuZG9UaWNrKCk7XHJcblx0XHRcdC8vIGNvbnNvbGUudGltZUVuZChcInRpY2tcIik7XHJcblx0XHRcdHRoaXMubXNTaW5jZVRpY2sgLT0gdGhpcy5tc1BlclRpY2s7XHJcblx0XHRcdHRpY2tzVGhpc0ZyYW1lKys7XHJcblx0XHR9XHJcblx0XHRpZiAodGlja3NUaGlzRnJhbWUgPT09IHRoaXMuZm9yZ2l2ZW5lc3NDb3VudCkge1xyXG5cdFx0XHR0aGlzLm1zU2luY2VUaWNrID0gMDtcclxuXHRcdFx0Y29uc29sZS53YXJuKFxyXG5cdFx0XHRcdFwibGFnIHNwaWtlIGRldGVjdGVkLCB0aWNrIGNhbGN1bGF0aW9ucyBjb3VsZG4ndCBrZWVwIHVwXCIsXHJcblx0XHRcdCk7XHJcblx0XHR9XHJcblx0XHR0aGlzLmFtb3VudFNpbmNlTGFzdFRpY2sgPSB0aGlzLm1zU2luY2VUaWNrIC8gdGhpcy5tc1BlclRpY2s7XHJcblx0fVxyXG5cclxuXHRkb1RpY2soKSB7XHJcblx0XHRpZih0aGlzLndvcmxkICE9PSB1bmRlZmluZWQgJiYgdGhpcy53b3JsZC50aWxlRW50aXRpZXMgIT09IHVuZGVmaW5lZCkgey8vdGlsZSBlbnRpdHkgcGFydGljbGVzXHJcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgMSAqIHRoaXMucGFydGljbGVNdWx0aXBsaWVyOyBpKyspIHtcclxuXHRcdFx0XHRsZXQgayA9IE9iamVjdC5rZXlzKHRoaXMud29ybGQudGlsZUVudGl0aWVzKTtcclxuXHRcdFx0XHRsZXQgciA9IHRoaXMud29ybGQudGlsZUVudGl0aWVzW2tbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKmsubGVuZ3RoKV1dO1xyXG5cdFx0XHRcdGlmKHIudHlwZV89PT1UaWxlRW50aXRpZXMuVHJlZSkge1xyXG5cdFx0XHRcdFx0bGV0IHQgPSByLmNvdmVyZWRUaWxlc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqci5jb3ZlcmVkVGlsZXMubGVuZ3RoKV07XHJcblx0XHRcdFx0XHR0aGlzLnBhcnRpY2xlcy5wdXNoKG5ldyBDb2xvclBhcnRpY2xlKFwiIzM0ODk2NVwiLCBNYXRoLnJhbmRvbSgpKjAuMSswLjEsIDIwLCB0JXRoaXMud29ybGQud2lkdGgrTWF0aC5yYW5kb20oKSwgTWF0aC5mbG9vcih0L3RoaXMud29ybGQud2lkdGgpK01hdGgucmFuZG9tKCksIDAuMSooTWF0aC5yYW5kb20oKS0wLjUpLCAwLjA2KihNYXRoLnJhbmRvbSgpLTAuNyksIGZhbHNlKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRmb3IgKGxldCBwYXJ0aWNsZSBvZiB0aGlzLnBhcnRpY2xlcykge1xyXG5cdFx0XHRwYXJ0aWNsZS50aWNrKCk7XHJcblx0XHR9XHJcblx0XHRmb3IgKGxldCBjbG91ZCBvZiB0aGlzLmNsb3Vkcykge1xyXG5cdFx0XHRjbG91ZC50aWNrKCk7XHJcblx0XHR9XHJcblx0XHRpZiAodGhpcy53b3JsZC5wbGF5ZXIgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xyXG5cdFx0aWYgKHRoaXMud29ybGQucGxheWVyID09PSB1bmRlZmluZWQpIHJldHVybjtcclxuXHRcdHRoaXMud29ybGQucGxheWVyLmtleWJvYXJkSW5wdXQoKTtcclxuXHRcdHRoaXMud29ybGQucGxheWVyLmFwcGx5R3Jhdml0eUFuZERyYWcoKTtcclxuXHRcdHRoaXMud29ybGQucGxheWVyLmFwcGx5VmVsb2NpdHlBbmRDb2xsaWRlKCk7XHJcblxyXG5cdFx0dGhpcy5wQ2FtWCA9IHRoaXMuY2FtWDtcclxuXHRcdHRoaXMucENhbVkgPSB0aGlzLmNhbVk7XHJcblx0XHR0aGlzLmRlc2lyZWRDYW1YID1cclxuXHRcdFx0dGhpcy53b3JsZC5wbGF5ZXIueCArXHJcblx0XHRcdHRoaXMud29ybGQucGxheWVyLndpZHRoIC8gMiAtXHJcblx0XHRcdHRoaXMud2lkdGggLyAyIC8gdGhpcy5USUxFX1dJRFRIIC8gdGhpcy51cHNjYWxlU2l6ZSArXHJcblx0XHRcdHRoaXMud29ybGQucGxheWVyLnhWZWwgKiA0MDtcclxuXHRcdHRoaXMuZGVzaXJlZENhbVkgPVxyXG5cdFx0XHR0aGlzLndvcmxkLnBsYXllci55ICtcclxuXHRcdFx0dGhpcy53b3JsZC5wbGF5ZXIuaGVpZ2h0IC8gMiAtXHJcblx0XHRcdHRoaXMuaGVpZ2h0IC8gMiAvIHRoaXMuVElMRV9IRUlHSFQgLyB0aGlzLnVwc2NhbGVTaXplICtcclxuXHRcdFx0dGhpcy53b3JsZC5wbGF5ZXIueVZlbCAqIDIwO1xyXG5cdFx0dGhpcy5jYW1YID0gKHRoaXMuZGVzaXJlZENhbVggKyB0aGlzLmNhbVggKiAyNCkgLyAyNTtcclxuXHRcdHRoaXMuY2FtWSA9ICh0aGlzLmRlc2lyZWRDYW1ZICsgdGhpcy5jYW1ZICogMjQpIC8gMjU7XHJcblxyXG5cdFx0dGhpcy5zY3JlZW5zaGFrZUFtb3VudCAqPSAwLjg7XHJcblxyXG5cdFx0aWYgKHRoaXMuY2FtWCA8IDApIHtcclxuXHRcdFx0dGhpcy5jYW1YID0gMDtcclxuXHRcdH0gZWxzZSBpZiAoXHJcblx0XHRcdHRoaXMuY2FtWCA+XHJcblx0XHRcdHRoaXMud29ybGRXaWR0aCAtIHRoaXMud2lkdGggLyB0aGlzLnVwc2NhbGVTaXplIC8gdGhpcy5USUxFX1dJRFRIXHJcblx0XHQpIHtcclxuXHRcdFx0dGhpcy5jYW1YID1cclxuXHRcdFx0XHR0aGlzLndvcmxkV2lkdGggLVxyXG5cdFx0XHRcdHRoaXMud2lkdGggLyB0aGlzLnVwc2NhbGVTaXplIC8gdGhpcy5USUxFX1dJRFRIO1xyXG5cdFx0fVxyXG5cdFx0aWYgKFxyXG5cdFx0XHR0aGlzLmNhbVkgPlxyXG5cdFx0XHR0aGlzLndvcmxkSGVpZ2h0IC0gdGhpcy5oZWlnaHQgLyB0aGlzLnVwc2NhbGVTaXplIC8gdGhpcy5USUxFX0hFSUdIVFxyXG5cdFx0KSB7XHJcblx0XHRcdHRoaXMuY2FtWSA9XHJcblx0XHRcdFx0dGhpcy53b3JsZEhlaWdodCAtXHJcblx0XHRcdFx0dGhpcy5oZWlnaHQgLyB0aGlzLnVwc2NhbGVTaXplIC8gdGhpcy5USUxFX0hFSUdIVDtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBmb3IgKGNvbnN0IGl0ZW0gb2YgdGhpcy5pdGVtcykge1xyXG5cdFx0Ly8gICAgIGl0ZW0uZ29Ub3dhcmRzUGxheWVyKCk7XHJcblx0XHQvLyAgICAgaXRlbS5jb21iaW5lV2l0aE5lYXJJdGVtcygpO1xyXG5cdFx0Ly8gICAgIGl0ZW0uYXBwbHlHcmF2aXR5QW5kRHJhZygpO1xyXG5cdFx0Ly8gICAgIGl0ZW0uYXBwbHlWZWxvY2l0eUFuZENvbGxpZGUoKTtcclxuXHRcdC8vIH1cclxuXHRcdC8vXHJcblx0XHQvLyBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaXRlbXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdC8vICAgICBpZiAodGhpcy5pdGVtc1tpXS5kZWxldGVkID09PSB0cnVlKSB7XHJcblx0XHQvLyAgICAgICAgIHRoaXMuaXRlbXMuc3BsaWNlKGksIDEpO1xyXG5cdFx0Ly8gICAgICAgICBpLS07XHJcblx0XHQvLyAgICAgfVxyXG5cdFx0Ly8gfVxyXG5cdH1cclxuXHJcblx0dWlGcmFtZVJlY3QoeDogbnVtYmVyLCB5OiBudW1iZXIsIHc6IG51bWJlciwgaDogbnVtYmVyKSB7XHJcblx0XHQvLyBzZXQgdGhlIGNvb3JkcyBhbmQgZGltZW5zaW9ucyB0byByb3VuZCB0byB0aGUgbmVhcmVzdCB1bi11cHNjYWxlZCBwaXhlbFxyXG5cdFx0eCA9IE1hdGgucm91bmQoeCAvIHRoaXMudXBzY2FsZVNpemUpICogdGhpcy51cHNjYWxlU2l6ZTtcclxuXHRcdHkgPSBNYXRoLnJvdW5kKHkgLyB0aGlzLnVwc2NhbGVTaXplKSAqIHRoaXMudXBzY2FsZVNpemU7XHJcblx0XHR3ID0gTWF0aC5yb3VuZCh3IC8gdGhpcy51cHNjYWxlU2l6ZSkgKiB0aGlzLnVwc2NhbGVTaXplO1xyXG5cdFx0aCA9IE1hdGgucm91bmQoaCAvIHRoaXMudXBzY2FsZVNpemUpICogdGhpcy51cHNjYWxlU2l6ZTtcclxuXHJcblx0XHQvLyBjb3JuZXJzXHJcblx0XHRVaUFzc2V0cy51aV9mcmFtZS5yZW5kZXJQYXJ0aWFsKFxyXG5cdFx0XHR0aGlzLFxyXG5cdFx0XHR4LFxyXG5cdFx0XHR5LFxyXG5cdFx0XHQ3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0NyAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdDAsXHJcblx0XHRcdDAsXHJcblx0XHRcdDcsXHJcblx0XHRcdDcsXHJcblx0XHQpO1xyXG5cdFx0VWlBc3NldHMudWlfZnJhbWUucmVuZGVyUGFydGlhbChcclxuXHRcdFx0dGhpcyxcclxuXHRcdFx0eCArIHcgLSA3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0eSxcclxuXHRcdFx0NyAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHQ4LFxyXG5cdFx0XHQwLFxyXG5cdFx0XHQ3LFxyXG5cdFx0XHQ3LFxyXG5cdFx0KTtcclxuXHRcdFVpQXNzZXRzLnVpX2ZyYW1lLnJlbmRlclBhcnRpYWwoXHJcblx0XHRcdHRoaXMsXHJcblx0XHRcdHgsXHJcblx0XHRcdHkgKyBoIC0gNyAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHQ3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0MCxcclxuXHRcdFx0OCxcclxuXHRcdFx0NyxcclxuXHRcdFx0NyxcclxuXHRcdCk7XHJcblx0XHRVaUFzc2V0cy51aV9mcmFtZS5yZW5kZXJQYXJ0aWFsKFxyXG5cdFx0XHR0aGlzLFxyXG5cdFx0XHR4ICsgdyAtIDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHR5ICsgaCAtIDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHQ3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0NyAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdDgsXHJcblx0XHRcdDgsXHJcblx0XHRcdDcsXHJcblx0XHRcdDcsXHJcblx0XHQpO1xyXG5cclxuXHRcdC8vIHRvcCBhbmQgYm90dG9tXHJcblx0XHRVaUFzc2V0cy51aV9mcmFtZS5yZW5kZXJQYXJ0aWFsKFxyXG5cdFx0XHR0aGlzLFxyXG5cdFx0XHR4ICsgNyAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdHksXHJcblx0XHRcdHcgLSAxNCAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHQ3LFxyXG5cdFx0XHQwLFxyXG5cdFx0XHQxLFxyXG5cdFx0XHQ3LFxyXG5cdFx0KTtcclxuXHRcdFVpQXNzZXRzLnVpX2ZyYW1lLnJlbmRlclBhcnRpYWwoXHJcblx0XHRcdHRoaXMsXHJcblx0XHRcdHggKyA3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0eSArIGggLSA3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0dyAtIDE0ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0NyAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdDcsXHJcblx0XHRcdDgsXHJcblx0XHRcdDEsXHJcblx0XHRcdDcsXHJcblx0XHQpO1xyXG5cclxuXHRcdC8vIGxlZnQgYW5kIHJpZ2h0XHJcblx0XHRVaUFzc2V0cy51aV9mcmFtZS5yZW5kZXJQYXJ0aWFsKFxyXG5cdFx0XHR0aGlzLFxyXG5cdFx0XHR4LFxyXG5cdFx0XHR5ICsgNyAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHRoIC0gMTQgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHQwLFxyXG5cdFx0XHQ3LFxyXG5cdFx0XHQ3LFxyXG5cdFx0XHQxLFxyXG5cdFx0KTtcclxuXHRcdFVpQXNzZXRzLnVpX2ZyYW1lLnJlbmRlclBhcnRpYWwoXHJcblx0XHRcdHRoaXMsXHJcblx0XHRcdHggKyB3IC0gNyAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdHkgKyA3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0NyAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdGggLSAxNCAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdDgsXHJcblx0XHRcdDcsXHJcblx0XHRcdDcsXHJcblx0XHRcdDEsXHJcblx0XHQpO1xyXG5cclxuXHRcdC8vIGNlbnRlclxyXG5cdFx0VWlBc3NldHMudWlfZnJhbWUucmVuZGVyUGFydGlhbChcclxuXHRcdFx0dGhpcyxcclxuXHRcdFx0eCArIDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHR5ICsgNyAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdHcgLSAxNCAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdGggLSAxNCAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdDcsXHJcblx0XHRcdDcsXHJcblx0XHRcdDEsXHJcblx0XHRcdDEsXHJcblx0XHQpO1xyXG5cdH1cclxuXHJcblx0LypcclxuICAgLyQkJCQkJCQgIC8kJCAgICAgICAgICAgICAgICAgICAgICAgICAgIC8kJFxyXG4gIHwgJCRfXyAgJCR8ICQkICAgICAgICAgICAgICAgICAgICAgICAgICB8X18vXHJcbiAgfCAkJCAgXFwgJCR8ICQkJCQkJCQgIC8kJCAgIC8kJCAgLyQkJCQkJCQgLyQkICAvJCQkJCQkJCAgLyQkJCQkJCQgLyQkXHJcbiAgfCAkJCQkJCQkL3wgJCRfXyAgJCR8ICQkICB8ICQkIC8kJF9fX19fL3wgJCQgLyQkX19fX18vIC8kJF9fX19fL3xfXy9cclxuICB8ICQkX19fXy8gfCAkJCAgXFwgJCR8ICQkICB8ICQkfCAgJCQkJCQkIHwgJCR8ICQkICAgICAgfCAgJCQkJCQkXHJcbiAgfCAkJCAgICAgIHwgJCQgIHwgJCR8ICQkICB8ICQkIFxcX19fXyAgJCR8ICQkfCAkJCAgICAgICBcXF9fX18gICQkIC8kJFxyXG4gIHwgJCQgICAgICB8ICQkICB8ICQkfCAgJCQkJCQkJCAvJCQkJCQkJC98ICQkfCAgJCQkJCQkJCAvJCQkJCQkJC98X18vXHJcbiAgfF9fLyAgICAgIHxfXy8gIHxfXy8gXFxfX19fICAkJHxfX19fX19fLyB8X18vIFxcX19fX19fXy98X19fX19fXy9cclxuXHRcdFx0XHRcdCAgIC8kJCAgfCAkJFxyXG5cdFx0XHRcdFx0ICB8ICAkJCQkJCQvXHJcblx0XHRcdFx0XHQgICBcXF9fX19fXy9cclxuICAqL1xyXG5cclxuXHQvLyB0aGlzIGNsYXNzIGhvbGRzIGFuIGF4aXMtYWxpZ25lZCByZWN0YW5nbGUgYWZmZWN0ZWQgYnkgZ3Jhdml0eSwgZHJhZywgYW5kIGNvbGxpc2lvbnMgd2l0aCB0aWxlcy5cclxuXHJcblx0cmVjdFZzUmF5KFxyXG5cdFx0cmVjdFg/OiBhbnksXHJcblx0XHRyZWN0WT86IGFueSxcclxuXHRcdHJlY3RXPzogYW55LFxyXG5cdFx0cmVjdEg/OiBhbnksXHJcblx0XHRyYXlYPzogYW55LFxyXG5cdFx0cmF5WT86IGFueSxcclxuXHRcdHJheVc/OiBhbnksXHJcblx0XHRyYXlIPzogYW55LFxyXG5cdCkge1xyXG5cdFx0Ly8gdGhpcyByYXkgaXMgYWN0dWFsbHkgYSBsaW5lIHNlZ21lbnQgbWF0aGVtYXRpY2FsbHksIGJ1dCBpdCdzIGNvbW1vbiB0byBzZWUgcGVvcGxlIHJlZmVyIHRvIHNpbWlsYXIgY2hlY2tzIGFzIHJheS1jYXN0cywgc28gZm9yIHRoZSBkdXJhdGlvbiBvZiB0aGUgZGVmaW5pdGlvbiBvZiB0aGlzIGZ1bmN0aW9uLCByYXkgY2FuIGJlIGFzc3VtZWQgdG8gbWVhbiB0aGUgc2FtZSBhcyBsaW5lIHNlZ21lbnQuXHJcblxyXG5cdFx0Ly8gaWYgdGhlIHJheSBkb2Vzbid0IGhhdmUgYSBsZW5ndGgsIHRoZW4gaXQgY2FuJ3QgaGF2ZSBlbnRlcmVkIHRoZSByZWN0YW5nbGUuICBUaGlzIGFzc3VtZXMgdGhhdCB0aGUgb2JqZWN0cyBkb24ndCBzdGFydCBpbiBjb2xsaXNpb24sIG90aGVyd2lzZSB0aGV5J2xsIGJlaGF2ZSBzdHJhbmdlbHlcclxuXHRcdGlmIChyYXlXID09PSAwICYmIHJheUggPT09IDApIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGNhbGN1bGF0ZSBob3cgZmFyIGFsb25nIHRoZSByYXkgZWFjaCBzaWRlIG9mIHRoZSByZWN0YW5nbGUgaW50ZXJzZWN0cyB3aXRoIGl0IChlYWNoIHNpZGUgaXMgZXh0ZW5kZWQgb3V0IGluZmluaXRlbHkgaW4gYm90aCBkaXJlY3Rpb25zKVxyXG5cdFx0Y29uc3QgdG9wSW50ZXJzZWN0aW9uID0gKHJlY3RZIC0gcmF5WSkgLyByYXlIO1xyXG5cdFx0Y29uc3QgYm90dG9tSW50ZXJzZWN0aW9uID0gKHJlY3RZICsgcmVjdEggLSByYXlZKSAvIHJheUg7XHJcblx0XHRjb25zdCBsZWZ0SW50ZXJzZWN0aW9uID0gKHJlY3RYIC0gcmF5WCkgLyByYXlXO1xyXG5cdFx0Y29uc3QgcmlnaHRJbnRlcnNlY3Rpb24gPSAocmVjdFggKyByZWN0VyAtIHJheVgpIC8gcmF5VztcclxuXHJcblx0XHRpZiAoXHJcblx0XHRcdGlzTmFOKHRvcEludGVyc2VjdGlvbikgfHxcclxuXHRcdFx0aXNOYU4oYm90dG9tSW50ZXJzZWN0aW9uKSB8fFxyXG5cdFx0XHRpc05hTihsZWZ0SW50ZXJzZWN0aW9uKSB8fFxyXG5cdFx0XHRpc05hTihyaWdodEludGVyc2VjdGlvbilcclxuXHRcdCkge1xyXG5cdFx0XHQvLyB5b3UgaGF2ZSB0byB1c2UgdGhlIEpTIGZ1bmN0aW9uIGlzTmFOKCkgdG8gY2hlY2sgaWYgYSB2YWx1ZSBpcyBOYU4gYmVjYXVzZSBib3RoIE5hTj09TmFOIGFuZCBOYU49PT1OYU4gYXJlIGZhbHNlLlxyXG5cdFx0XHQvLyBpZiBhbnkgb2YgdGhlc2UgdmFsdWVzIGFyZSBOYU4sIG5vIGNvbGxpc2lvbiBoYXMgb2NjdXJyZWRcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGNhbGN1bGF0ZSB0aGUgbmVhcmVzdCBhbmQgZmFydGhlc3QgaW50ZXJzZWN0aW9ucyBmb3IgYm90aCB4IGFuZCB5XHJcblx0XHRjb25zdCBuZWFyWCA9IHRoaXMubWluKGxlZnRJbnRlcnNlY3Rpb24sIHJpZ2h0SW50ZXJzZWN0aW9uKTtcclxuXHRcdGNvbnN0IGZhclggPSB0aGlzLm1heChsZWZ0SW50ZXJzZWN0aW9uLCByaWdodEludGVyc2VjdGlvbik7XHJcblx0XHRjb25zdCBuZWFyWSA9IHRoaXMubWluKHRvcEludGVyc2VjdGlvbiwgYm90dG9tSW50ZXJzZWN0aW9uKTtcclxuXHRcdGNvbnN0IGZhclkgPSB0aGlzLm1heCh0b3BJbnRlcnNlY3Rpb24sIGJvdHRvbUludGVyc2VjdGlvbik7XHJcblxyXG5cdFx0aWYgKG5lYXJYID4gZmFyWSB8fCBuZWFyWSA+IGZhclgpIHtcclxuXHRcdFx0Ly8gdGhpcyBtdXN0IG1lYW4gdGhhdCB0aGUgbGluZSB0aGF0IG1ha2VzIHVwIHRoZSBsaW5lIHNlZ21lbnQgZG9lc24ndCBwYXNzIHRocm91Z2ggdGhlIHJheVxyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGZhclggPCAwIHx8IGZhclkgPCAwKSB7XHJcblx0XHRcdC8vIHRoZSBpbnRlcnNlY3Rpb24gaXMgaGFwcGVuaW5nIGJlZm9yZSB0aGUgcmF5IHN0YXJ0cywgc28gdGhlIHJheSBpcyBwb2ludGluZyBhd2F5IGZyb20gdGhlIHRyaWFuZ2xlXHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBjYWxjdWxhdGUgd2hlcmUgdGhlIHBvdGVudGlhbCBjb2xsaXNpb24gY291bGQgYmVcclxuXHRcdGNvbnN0IG5lYXJDb2xsaXNpb25Qb2ludCA9IHRoaXMubWF4KG5lYXJYLCBuZWFyWSk7XHJcblxyXG5cdFx0aWYgKG5lYXJYID4gMSB8fCBuZWFyWSA+IDEpIHtcclxuXHRcdFx0Ly8gdGhlIGludGVyc2VjdGlvbiBoYXBwZW5zIGFmdGVyIHRoZSByYXkobGluZSBzZWdtZW50KSBlbmRzXHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAobmVhclggPT09IG5lYXJDb2xsaXNpb25Qb2ludCkge1xyXG5cdFx0XHQvLyBpdCBtdXN0IGhhdmUgY29sbGlkZWQgb24gZWl0aGVyIHRoZSBsZWZ0IG9yIHRoZSByaWdodCEgbm93IHdoaWNoP1xyXG5cdFx0XHRpZiAobGVmdEludGVyc2VjdGlvbiA9PT0gbmVhclgpIHtcclxuXHRcdFx0XHQvLyBJdCBtdXN0IGhhdmUgY29sbGlkZWQgb24gdGhlIGxlZnQhICBSZXR1cm4gdGhlIGNvbGxpc2lvbiBub3JtYWwgWy0xLCAwXVxyXG5cdFx0XHRcdHJldHVybiBbLTEsIDAsIG5lYXJDb2xsaXNpb25Qb2ludF07XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8gSWYgaXQgZGlkbid0IGNvbGxpZGUgb24gdGhlIGxlZnQsIGl0IG11c3QgaGF2ZSBjb2xsaWRlZCBvbiB0aGUgcmlnaHQuICBSZXR1cm4gdGhlIGNvbGxpc2lvbiBub3JtYWwgWzEsIDBdXHJcblx0XHRcdHJldHVybiBbMSwgMCwgbmVhckNvbGxpc2lvblBvaW50XTtcclxuXHRcdH1cclxuXHRcdC8vIElmIGl0IGRpZG4ndCBjb2xsaWRlIG9uIHRoZSBsZWZ0IG9yIHJpZ2h0LCBpdCBtdXN0IGhhdmUgY29sbGlkZWQgb24gZWl0aGVyIHRoZSB0b3Agb3IgdGhlIGJvdHRvbSEgbm93IHdoaWNoP1xyXG5cdFx0aWYgKHRvcEludGVyc2VjdGlvbiA9PT0gbmVhclkpIHtcclxuXHRcdFx0Ly8gSXQgbXVzdCBoYXZlIGNvbGxpZGVkIG9uIHRoZSB0b3AhICBSZXR1cm4gdGhlIGNvbGxpc2lvbiBub3JtYWwgWzAsIC0xXVxyXG5cdFx0XHRyZXR1cm4gWzAsIC0xLCBuZWFyQ29sbGlzaW9uUG9pbnRdO1xyXG5cdFx0fVxyXG5cdFx0Ly8gSWYgaXQgZGlkbid0IGNvbGxpZGUgb24gdGhlIHRvcCwgaXQgbXVzdCBoYXZlIGNvbGxpZGVkIG9uIHRoZSBib3R0b20uICBSZXR1cm4gdGhlIGNvbGxpc2lvbiBub3JtYWwgWzAsIDFdXHJcblx0XHRyZXR1cm4gWzAsIDEsIG5lYXJDb2xsaXNpb25Qb2ludF07XHJcblxyXG5cdFx0Ly8gb3V0cHV0IGlmIG5vIGNvbGxpc2lvbjogZmFsc2VcclxuXHRcdC8vIG91dHB1dCBpZiBjb2xsaXNpb246IFtjb2xsaXNpb24gbm9ybWFsIFgsIGNvbGxpc2lvbiBub3JtYWwgWSwgbmVhckNvbGxpc2lvblBvaW50XVxyXG5cdFx0Ly8gICAgICAgICAgICAgICAgICAgICAgICAgLTEgdG8gMSAgICAgICAgICAgICAgLTEgdG8gMSAgICAgICAgICAgIDAgdG8gMVxyXG5cdH1cclxuXHJcblx0cmVuZGVyRW50aXRpZXMoKSB7XHJcblx0XHQvLyBkcmF3IHBsYXllclxyXG5cdFx0Ly8gdGhpcy5maWxsKDI1NSwgMCwgMCk7XHJcblx0XHQvLyB0aGlzLm5vU3Ryb2tlKCk7XHJcblx0XHQvLyB0aGlzLnJlY3QoXHJcblx0XHQvLyAgICAgKHRoaXMud29ybGQucGxheWVyLmludGVycG9sYXRlZFggKiB0aGlzLlRJTEVfV0lEVEggLVxyXG5cdFx0Ly8gICAgICAgICB0aGlzLmludGVycG9sYXRlZENhbVggKiB0aGlzLlRJTEVfV0lEVEgpICpcclxuXHRcdC8vICAgICAgICAgdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdC8vICAgICAodGhpcy53b3JsZC5wbGF5ZXIuaW50ZXJwb2xhdGVkWSAqIHRoaXMuVElMRV9IRUlHSFQgLVxyXG5cdFx0Ly8gICAgICAgICB0aGlzLmludGVycG9sYXRlZENhbVkgKiB0aGlzLlRJTEVfSEVJR0hUKSAqXHJcblx0XHQvLyAgICAgICAgIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHQvLyAgICAgdGhpcy53b3JsZC5wbGF5ZXIud2lkdGggKiB0aGlzLnVwc2NhbGVTaXplICogdGhpcy5USUxFX1dJRFRILFxyXG5cdFx0Ly8gICAgIHRoaXMud29ybGQucGxheWVyLmhlaWdodCAqIHRoaXMudXBzY2FsZVNpemUgKiB0aGlzLlRJTEVfSEVJR0hUXHJcblx0XHQvLyApO1xyXG5cdFx0Ly8gZm9yIChjb25zdCBpdGVtIG9mIHRoaXMuaXRlbXMpIHtcclxuXHRcdC8vICAgICBpdGVtLmZpbmRJbnRlcnBvbGF0ZWRDb29yZGluYXRlcygpO1xyXG5cdFx0Ly9cclxuXHRcdC8vICAgICBpdGVtLml0ZW1TdGFjay50ZXh0dXJlLnJlbmRlcihcclxuXHRcdC8vICAgICAgICAgdGhpcyxcclxuXHRcdC8vICAgICAgICAgKGl0ZW0uaW50ZXJwb2xhdGVkWCAqIHRoaXMuVElMRV9XSURUSCAtXHJcblx0XHQvLyAgICAgICAgICAgICB0aGlzLmludGVycG9sYXRlZENhbVggKiB0aGlzLlRJTEVfV0lEVEgpICpcclxuXHRcdC8vICAgICAgICAgICAgIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHQvLyAgICAgICAgIChpdGVtLmludGVycG9sYXRlZFkgKiB0aGlzLlRJTEVfSEVJR0hUIC1cclxuXHRcdC8vICAgICAgICAgICAgIHRoaXMuaW50ZXJwb2xhdGVkQ2FtWSAqIHRoaXMuVElMRV9IRUlHSFQpICpcclxuXHRcdC8vICAgICAgICAgICAgIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHQvLyAgICAgICAgIGl0ZW0udyAqIHRoaXMudXBzY2FsZVNpemUgKiB0aGlzLlRJTEVfV0lEVEgsXHJcblx0XHQvLyAgICAgICAgIGl0ZW0uaCAqIHRoaXMudXBzY2FsZVNpemUgKiB0aGlzLlRJTEVfSEVJR0hUXHJcblx0XHQvLyAgICAgKTtcclxuXHRcdC8vXHJcblx0XHQvLyAgICAgLy8gUmVuZGVyIHRoZSBpdGVtIHF1YW50aXR5IGxhYmVsXHJcblx0XHQvLyAgICAgdGhpcy5maWxsKDApO1xyXG5cdFx0Ly9cclxuXHRcdC8vICAgICB0aGlzLm5vU3Ryb2tlKCk7XHJcblx0XHQvL1xyXG5cdFx0Ly8gICAgIHRoaXMudGV4dEFsaWduKHRoaXMuUklHSFQsIHRoaXMuQk9UVE9NKTtcclxuXHRcdC8vICAgICB0aGlzLnRleHRTaXplKDUgKiB0aGlzLnVwc2NhbGVTaXplKTtcclxuXHRcdC8vXHJcblx0XHQvLyAgICAgdGhpcy50ZXh0KFxyXG5cdFx0Ly8gICAgICAgICBpdGVtLml0ZW1TdGFjay5zdGFja1NpemUsXHJcblx0XHQvLyAgICAgICAgIChpdGVtLmludGVycG9sYXRlZFggKiB0aGlzLlRJTEVfV0lEVEggLVxyXG5cdFx0Ly8gICAgICAgICAgICAgdGhpcy5pbnRlcnBvbGF0ZWRDYW1YICogdGhpcy5USUxFX1dJRFRIKSAqXHJcblx0XHQvLyAgICAgICAgICAgICB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0Ly8gICAgICAgICAoaXRlbS5pbnRlcnBvbGF0ZWRZICogdGhpcy5USUxFX0hFSUdIVCAtXHJcblx0XHQvLyAgICAgICAgICAgICB0aGlzLmludGVycG9sYXRlZENhbVkgKiB0aGlzLlRJTEVfSEVJR0hUKSAqXHJcblx0XHQvLyAgICAgICAgICAgICB0aGlzLnVwc2NhbGVTaXplXHJcblx0XHQvLyAgICAgKTtcclxuXHRcdC8vIH1cclxuXHR9XHJcblxyXG5cdC8qXHJcblx0cGlja1VwSXRlbShpdGVtU3RhY2s6IEl0ZW1TdGFjayk6IGJvb2xlYW4ge1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmhvdEJhci5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRjb25zdCBpdGVtID0gdGhpcy5ob3RCYXJbaV07XHJcblxyXG5cdFx0XHQvLyBJZiB0aGVyZSBhcmUgbm8gaXRlbXMgaW4gdGhlIGN1cnJlbnQgc2xvdCBvZiB0aGUgaG90QmFyXHJcblx0XHRcdGlmIChpdGVtID09PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHR0aGlzLmhvdEJhcltpXSA9IGl0ZW1TdGFjaztcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKFxyXG5cdFx0XHRcdGl0ZW0gPT09IGl0ZW1TdGFjayAmJlxyXG5cdFx0XHRcdGl0ZW0uc3RhY2tTaXplIDwgaXRlbS5tYXhTdGFja1NpemVcclxuXHRcdFx0KSB7XHJcblx0XHRcdFx0Y29uc3QgcmVtYWluaW5nU3BhY2UgPSBpdGVtLm1heFN0YWNrU2l6ZSAtIGl0ZW0uc3RhY2tTaXplO1xyXG5cclxuXHRcdFx0XHQvLyBUb3Agb2ZmIHRoZSBzdGFjayB3aXRoIGl0ZW1zIGlmIGl0IGNhbiB0YWtlIG1vcmUgdGhhbiB0aGUgc3RhY2sgYmVpbmcgYWRkZWRcclxuXHRcdFx0XHRpZiAocmVtYWluaW5nU3BhY2UgPj0gaXRlbVN0YWNrLnN0YWNrU2l6ZSkge1xyXG5cdFx0XHRcdFx0dGhpcy5ob3RCYXJbaV0uc3RhY2tTaXplID1cclxuXHRcdFx0XHRcdFx0aXRlbS5zdGFja1NpemUgKyBpdGVtU3RhY2suc3RhY2tTaXplO1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpdGVtU3RhY2suc3RhY2tTaXplIC09IHJlbWFpbmluZ1NwYWNlO1xyXG5cclxuXHRcdFx0XHR0aGlzLmhvdEJhcltpXS5zdGFja1NpemUgPSBpdGVtU3RhY2subWF4U3RhY2tTaXplO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRjb25zb2xlLmVycm9yKFxyXG5cdFx0XHRgQ291bGQgbm90IHBpY2t1cCAke2l0ZW1TdGFjay5zdGFja1NpemV9ICR7aXRlbVN0YWNrLm5hbWV9YFxyXG5cdFx0KTtcclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9XHJcblxyXG5cdCAqL1xyXG5cclxuXHRtb3VzZUV4aXRlZCgpIHtcclxuXHRcdHRoaXMubW91c2VPbiA9IGZhbHNlO1xyXG5cdH1cclxuXHJcblx0bW91c2VFbnRlcmVkKCkge1xyXG5cdFx0dGhpcy5tb3VzZU9uID0gdHJ1ZTtcclxuXHR9XHJcblxyXG5cdHVwZGF0ZU1vdXNlKCkge1xyXG5cdFx0aWYgKFxyXG5cdFx0XHRNYXRoLmZsb29yKFxyXG5cdFx0XHRcdCh0aGlzLmludGVycG9sYXRlZENhbVggKiB0aGlzLlRJTEVfV0lEVEggK1xyXG5cdFx0XHRcdFx0dGhpcy5tb3VzZVggLyB0aGlzLnVwc2NhbGVTaXplKSAvXHJcblx0XHRcdFx0dGhpcy5USUxFX1dJRFRILFxyXG5cdFx0XHQpICE9PSB0aGlzLndvcmxkTW91c2VYIHx8XHJcblx0XHRcdE1hdGguZmxvb3IoXHJcblx0XHRcdFx0KHRoaXMuaW50ZXJwb2xhdGVkQ2FtWSAqIHRoaXMuVElMRV9IRUlHSFQgK1xyXG5cdFx0XHRcdFx0dGhpcy5tb3VzZVkgLyB0aGlzLnVwc2NhbGVTaXplKSAvXHJcblx0XHRcdFx0dGhpcy5USUxFX0hFSUdIVCxcclxuXHRcdFx0KSAhPT0gdGhpcy53b3JsZE1vdXNlWVxyXG5cdFx0KSB7XHJcblx0XHRcdHRoaXMubGFzdEN1cnNvck1vdmUgPSBEYXRlLm5vdygpO1xyXG5cdFx0fVxyXG5cdFx0Ly8gd29ybGQgbW91c2UgeCBhbmQgeSB2YXJpYWJsZXMgaG9sZCB0aGUgbW91c2UgcG9zaXRpb24gaW4gd29ybGQgdGlsZXMuICAwLCAwIGlzIHRvcCBsZWZ0XHJcblx0XHR0aGlzLndvcmxkTW91c2VYID0gTWF0aC5mbG9vcihcclxuXHRcdFx0KHRoaXMuaW50ZXJwb2xhdGVkQ2FtWCAqIHRoaXMuVElMRV9XSURUSCArXHJcblx0XHRcdFx0dGhpcy5tb3VzZVggLyB0aGlzLnVwc2NhbGVTaXplKSAvXHJcblx0XHRcdHRoaXMuVElMRV9XSURUSCxcclxuXHRcdCk7XHJcblx0XHR0aGlzLndvcmxkTW91c2VZID0gTWF0aC5mbG9vcihcclxuXHRcdFx0KHRoaXMuaW50ZXJwb2xhdGVkQ2FtWSAqIHRoaXMuVElMRV9IRUlHSFQgK1xyXG5cdFx0XHRcdHRoaXMubW91c2VZIC8gdGhpcy51cHNjYWxlU2l6ZSkgL1xyXG5cdFx0XHR0aGlzLlRJTEVfSEVJR0hULFxyXG5cdFx0KTtcclxuXHR9XHJcblxyXG5cdGRyYXdDdXJzb3IoKSB7XHJcblx0XHRpZiAodGhpcy5tb3VzZU9uKSB7XHJcblx0XHRcdC8vIGlmICh0aGlzLnBpY2tlZFVwU2xvdCA+IC0xKSB7XHJcblx0XHRcdC8vICAgICB0aGlzLmhvdGJhclt0aGlzLnBpY2tlZFVwU2xvdF0udGV4dHVyZS5yZW5kZXIoXHJcblx0XHRcdC8vICAgICAgICAgdGhpcyxcclxuXHRcdFx0Ly8gICAgICAgICB0aGlzLm1vdXNlWCxcclxuXHRcdFx0Ly8gICAgICAgICB0aGlzLm1vdXNlWSxcclxuXHRcdFx0Ly8gICAgICAgICA4ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0Ly8gICAgICAgICA4ICogdGhpcy51cHNjYWxlU2l6ZVxyXG5cdFx0XHQvLyAgICAgKTtcclxuXHJcblx0XHRcdC8vICAgICB0aGlzLnRleHQoXHJcblx0XHRcdC8vICAgICAgICAgdGhpcy5ob3RCYXJbdGhpcy5waWNrZWRVcFNsb3RdLnN0YWNrU2l6ZSxcclxuXHRcdFx0Ly8gICAgICAgICB0aGlzLm1vdXNlWCArIDEwICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0Ly8gICAgICAgICB0aGlzLm1vdXNlWSArIDEwICogdGhpcy51cHNjYWxlU2l6ZVxyXG5cdFx0XHQvLyAgICAgKTtcclxuXHRcdFx0Ly8gfVxyXG5cclxuXHRcdFx0VWlBc3NldHMuc2VsZWN0ZWRfdGlsZS5yZW5kZXIoXHJcblx0XHRcdFx0dGhpcyxcclxuXHRcdFx0XHRNYXRoLnJvdW5kKFxyXG5cdFx0XHRcdFx0KHRoaXMud29ybGRNb3VzZVggLSB0aGlzLmludGVycG9sYXRlZENhbVgpICpcclxuXHRcdFx0XHRcdHRoaXMuVElMRV9XSURUSCAqXHJcblx0XHRcdFx0XHR0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHRcdCksXHJcblx0XHRcdFx0TWF0aC5yb3VuZChcclxuXHRcdFx0XHRcdCh0aGlzLndvcmxkTW91c2VZIC0gdGhpcy5pbnRlcnBvbGF0ZWRDYW1ZKSAqXHJcblx0XHRcdFx0XHR0aGlzLlRJTEVfSEVJR0hUICpcclxuXHRcdFx0XHRcdHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdFx0KSxcclxuXHRcdFx0XHR0aGlzLlRJTEVfV0lEVEggKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHRcdHRoaXMuVElMRV9IRUlHSFQgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHQpO1xyXG5cdFx0XHRpZiAoRGF0ZS5ub3coKSAtIHRoaXMubGFzdEN1cnNvck1vdmUgPiAxMDAwKSB7XHJcblx0XHRcdFx0bGV0IHNlbGVjdGVkVGlsZSA9IHRoaXMud29ybGQud29ybGRUaWxlc1t0aGlzLndvcmxkLndpZHRoICogdGhpcy53b3JsZE1vdXNlWSArIHRoaXMud29ybGRNb3VzZVhdO1xyXG5cdFx0XHRcdGlmICh0eXBlb2YgKHNlbGVjdGVkVGlsZSkgPT09ICdzdHJpbmcnKSB7XHJcblx0XHRcdFx0XHR0aGlzLnRleHQoXCJUaWxlIGVudGl0eTogXCIgKyBzZWxlY3RlZFRpbGUsIHRoaXMubW91c2VYLCB0aGlzLm1vdXNlWSk7Ly9KQU5LWSBBTEVSVFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIGlmIChXb3JsZFRpbGVzW3NlbGVjdGVkVGlsZV0gIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdFx0dGhpcy50ZXh0KChXb3JsZFRpbGVzW3NlbGVjdGVkVGlsZV0gYXMgVGlsZSkubmFtZSwgdGhpcy5tb3VzZVgsIHRoaXMubW91c2VZKTsvL0pBTktZIEFMRVJUXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5jb25zdCBjb25uZWN0aW9uID0gaW8oe1xyXG5cdGF1dGg6IHsgdG9rZW46IHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndG9rZW4nKSB9LFxyXG59KTtcclxuXHJcbmV4cG9ydCBjb25zdCBnYW1lID0gbmV3IEdhbWUoY29ubmVjdGlvbik7XHJcbiIsImltcG9ydCB7IEdhbWUgfSBmcm9tICcuL0dhbWUnO1xyXG5pbXBvcnQgeyBXb3JsZCB9IGZyb20gJy4vd29ybGQvV29ybGQnO1xyXG5pbXBvcnQgeyBFbnRpdHlDbGFzc2VzIH0gZnJvbSAnLi93b3JsZC9lbnRpdGllcy9FbnRpdHlDbGFzc2VzJztcclxuaW1wb3J0IHsgUGxheWVyTG9jYWwgfSBmcm9tICcuL3BsYXllci9QbGF5ZXJMb2NhbCc7XHJcbmltcG9ydCB7IEludmVudG9yeSB9IGZyb20gJy4vcGxheWVyL0ludmVudG9yeSc7XHJcbmltcG9ydCB7IFRpbGVFbnRpdHlBbmltYXRpb25zIH0gZnJvbSAnLi93b3JsZC9lbnRpdGllcy9UaWxlRW50aXR5JztcclxuaW1wb3J0IHsgV29ybGRBc3NldHMgfSBmcm9tICcuL2Fzc2V0cy9Bc3NldHMnO1xyXG5pbXBvcnQgeyBQbGF5ZXJFbnRpdHkgfSBmcm9tICcuL3dvcmxkL2VudGl0aWVzL1BsYXllckVudGl0eSc7XHJcbmltcG9ydCB7IFBsYXllckFuaW1hdGlvbnMgfSBmcm9tICcuL2Fzc2V0cy9Bc3NldHMnO1xyXG5pbXBvcnQgeyBBbmltYXRpb25GcmFtZSB9IGZyb20gJy4vYXNzZXRzL0Fzc2V0cyc7XHJcblxyXG5leHBvcnQgY2xhc3MgTmV0TWFuYWdlciB7XHJcblx0Z2FtZTogR2FtZTtcclxuXHJcblx0cGxheWVyVGlja1JhdGU6IG51bWJlcjtcclxuXHJcblx0Y29uc3RydWN0b3IoZ2FtZTogR2FtZSkge1xyXG5cdFx0dGhpcy5nYW1lID0gZ2FtZTtcclxuXHJcblx0XHQvLyBJbml0IGV2ZW50XHJcblx0XHR0aGlzLmdhbWUuY29ubmVjdGlvbi5vbignaW5pdCcsIChwbGF5ZXJUaWNrUmF0ZSwgdG9rZW4pID0+IHtcclxuXHRcdFx0Y29uc29sZS5sb2coYFRpY2sgcmF0ZSBzZXQgdG86ICR7cGxheWVyVGlja1JhdGV9YCk7XHJcblx0XHRcdHRoaXMucGxheWVyVGlja1JhdGUgPSBwbGF5ZXJUaWNrUmF0ZTtcclxuXHRcdFx0aWYgKHRva2VuKSB7XHJcblx0XHRcdFx0d2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKCd0b2tlbicsIHRva2VuKTtcclxuXHRcdFx0XHQodGhpcy5nYW1lLmNvbm5lY3Rpb24uYXV0aCBhcyB7IHRva2VuOiBzdHJpbmcgfSkudG9rZW4gPSB0b2tlbjtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0Ly8gSW5pdGlhbGl6YXRpb24gZXZlbnRzXHJcblx0XHR7XHJcblx0XHRcdC8vIExvYWQgdGhlIHdvcmxkIGFuZCBzZXQgdGhlIHBsYXllciBlbnRpdHkgaWRcclxuXHRcdFx0dGhpcy5nYW1lLmNvbm5lY3Rpb24ub24oXHJcblx0XHRcdFx0J3dvcmxkTG9hZCcsXHJcblx0XHRcdFx0KFxyXG5cdFx0XHRcdFx0d2lkdGgsXHJcblx0XHRcdFx0XHRoZWlnaHQsXHJcblx0XHRcdFx0XHR0aWxlcyxcclxuXHRcdFx0XHRcdHRpbGVFbnRpdGllcyxcclxuXHRcdFx0XHRcdGVudGl0aWVzLFxyXG5cdFx0XHRcdFx0cGxheWVyLFxyXG5cdFx0XHRcdFx0aW52ZW50b3J5LFxyXG5cdFx0XHRcdCkgPT4ge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coZW50aXRpZXMpO1xyXG5cdFx0XHRcdFx0bGV0IHRpbGVFbnRpdGllczI6IHtcclxuXHRcdFx0XHRcdFx0W2lkOiBzdHJpbmddOiB7XHJcblx0XHRcdFx0XHRcdFx0aWQ6IHN0cmluZztcclxuXHRcdFx0XHRcdFx0XHRjb3ZlcmVkVGlsZXM6IG51bWJlcltdO1xyXG5cdFx0XHRcdFx0XHRcdHR5cGVfOiBudW1iZXI7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YToge307XHJcblx0XHRcdFx0XHRcdFx0YW5pbUZyYW1lOiBudW1iZXI7XHJcblx0XHRcdFx0XHRcdFx0YW5pbWF0ZTogYm9vbGVhbjtcclxuXHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdH0gPSB7fTtcclxuXHRcdFx0XHRcdHRpbGVFbnRpdGllcy5mb3JFYWNoKHRpbGVFbnRpdHkgPT4ge1xyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZygnYWRkaW5nIHRpbGUgZW50aXR5OiAnICsgdGlsZUVudGl0eS5pZCk7XHJcblx0XHRcdFx0XHRcdHRpbGVFbnRpdGllczJbdGlsZUVudGl0eS5pZF0gPSB7XHJcblx0XHRcdFx0XHRcdFx0aWQ6IHRpbGVFbnRpdHkuaWQsXHJcblx0XHRcdFx0XHRcdFx0Y292ZXJlZFRpbGVzOiB0aWxlRW50aXR5LmNvdmVyZWRUaWxlcyxcclxuXHRcdFx0XHRcdFx0XHR0eXBlXzogdGlsZUVudGl0eS5wYXlsb2FkLnR5cGVfLFxyXG5cdFx0XHRcdFx0XHRcdGRhdGE6IHRpbGVFbnRpdHkucGF5bG9hZC5kYXRhLFxyXG5cdFx0XHRcdFx0XHRcdGFuaW1GcmFtZTogcmFuZGludChcclxuXHRcdFx0XHRcdFx0XHRcdDAsXHJcblx0XHRcdFx0XHRcdFx0XHRXb3JsZEFzc2V0cy50aWxlRW50aXRpZXNbXHJcblx0XHRcdFx0XHRcdFx0XHRcdHRpbGVFbnRpdHkucGF5bG9hZC50eXBlX1xyXG5cdFx0XHRcdFx0XHRcdFx0XS5sZW5ndGggLSAxLFxyXG5cdFx0XHRcdFx0XHRcdCksXHJcblx0XHRcdFx0XHRcdFx0YW5pbWF0ZTpcclxuXHRcdFx0XHRcdFx0XHRcdFRpbGVFbnRpdHlBbmltYXRpb25zW3RpbGVFbnRpdHkucGF5bG9hZC50eXBlX10sXHJcblx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdHRoaXMuZ2FtZS53b3JsZCA9IG5ldyBXb3JsZChcclxuXHRcdFx0XHRcdFx0d2lkdGgsXHJcblx0XHRcdFx0XHRcdGhlaWdodCxcclxuXHRcdFx0XHRcdFx0dGlsZXMsXHJcblx0XHRcdFx0XHRcdHRpbGVFbnRpdGllczIsXHJcblx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdFx0dGhpcy5nYW1lLndvcmxkLmludmVudG9yeSA9IG5ldyBJbnZlbnRvcnkoaW52ZW50b3J5KTtcclxuXHRcdFx0XHRcdHRoaXMuZ2FtZS53b3JsZC5wbGF5ZXIgPSBuZXcgUGxheWVyTG9jYWwocGxheWVyKTtcclxuXHRcdFx0XHRcdGVudGl0aWVzLmZvckVhY2goZW50aXR5ID0+IHtcclxuXHRcdFx0XHRcdFx0dGhpcy5nYW1lLndvcmxkLmVudGl0aWVzW2VudGl0eS5pZF0gPSBuZXcgRW50aXR5Q2xhc3Nlc1tcclxuXHRcdFx0XHRcdFx0XHRlbnRpdHkudHlwZVxyXG5cdFx0XHRcdFx0XHRdKGVudGl0eSk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFdvcmxkIGV2ZW50c1xyXG5cdFx0e1xyXG5cdFx0XHQvLyBUaWxlIHVwZGF0ZXMgc3VjaCBhcyBicmVha2luZyBhbmQgcGxhY2luZ1xyXG5cdFx0XHR0aGlzLmdhbWUuY29ubmVjdGlvbi5vbihcclxuXHRcdFx0XHQnd29ybGRVcGRhdGUnLFxyXG5cdFx0XHRcdCh1cGRhdGVkVGlsZXM6IHsgdGlsZUluZGV4OiBudW1iZXI7IHRpbGU6IG51bWJlciB9W10pID0+IHtcclxuXHRcdFx0XHRcdC8vIElmIHRoZSB3b3JsZCBpcyBub3Qgc2V0XHJcblx0XHRcdFx0XHRpZiAodGhpcy5nYW1lLndvcmxkID09PSB1bmRlZmluZWQpIHJldHVybjtcclxuXHJcblx0XHRcdFx0XHR1cGRhdGVkVGlsZXMuZm9yRWFjaCh0aWxlID0+IHtcclxuXHRcdFx0XHRcdFx0dGhpcy5nYW1lLndvcmxkLnVwZGF0ZVRpbGUodGlsZS50aWxlSW5kZXgsIHRpbGUudGlsZSk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHQpO1xyXG5cclxuXHRcdFx0dGhpcy5nYW1lLmNvbm5lY3Rpb24ub24oJ2ludmVudG9yeVVwZGF0ZScsIHVwZGF0ZXMgPT4ge1xyXG5cdFx0XHRcdC8vIElmIHRoZSB3b3JsZCBpcyBub3Qgc2V0XHJcblx0XHRcdFx0aWYgKHRoaXMuZ2FtZS53b3JsZCA9PT0gdW5kZWZpbmVkKSByZXR1cm47XHJcblxyXG5cdFx0XHRcdHVwZGF0ZXMuZm9yRWFjaCh1cGRhdGUgPT4ge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2codXBkYXRlKTtcclxuXHRcdFx0XHRcdHRoaXMuZ2FtZS53b3JsZC5pbnZlbnRvcnkuaXRlbXNbdXBkYXRlLnNsb3RdID0gdXBkYXRlLml0ZW07XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFBsYXllciBldmVudHNcclxuXHRcdHtcclxuXHRcdFx0dGhpcy5nYW1lLmNvbm5lY3Rpb24ub24oJ2VudGl0eVVwZGF0ZScsIGVudGl0eURhdGEgPT4ge1xyXG5cdFx0XHRcdC8vIElmIHRoZSB3b3JsZCBpcyBub3Qgc2V0XHJcblx0XHRcdFx0aWYgKHRoaXMuZ2FtZS53b3JsZCA9PT0gdW5kZWZpbmVkKSByZXR1cm47XHJcblxyXG5cdFx0XHRcdGNvbnN0IGVudGl0eSA9IHRoaXMuZ2FtZS53b3JsZC5lbnRpdGllc1tlbnRpdHlEYXRhLmlkXTtcclxuXHRcdFx0XHRpZiAoZW50aXR5ID09PSB1bmRlZmluZWQpIHJldHVybjtcclxuXHJcblx0XHRcdFx0ZW50aXR5LnVwZGF0ZURhdGEoZW50aXR5RGF0YSk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0dGhpcy5nYW1lLmNvbm5lY3Rpb24ub24oJ29uUGxheWVyQW5pbWF0aW9uJywgKGFuaW1hdGlvbiwgcGxheWVySWQpID0+IHtcclxuXHRcdFx0XHRpZiAoKCgoKCgodGhpcy5nYW1lLndvcmxkID09IHVuZGVmaW5lZCkpKSkpKSkgcmV0dXJuO1xyXG5cdFx0XHRcdGxldCBlID0gdGhpcy5nYW1lLndvcmxkLmVudGl0aWVzW3BsYXllcklkXTtcclxuXHRcdFx0XHRpZihlIGluc3RhbmNlb2YgUGxheWVyRW50aXR5ICYmIE9iamVjdC5rZXlzKFBsYXllckFuaW1hdGlvbnMpLmluY2x1ZGVzKGUuY3VycmVudEFuaW1hdGlvbikpIHtcclxuXHRcdFx0XHRcdC8vQHRzLWV4cGVjdC1lcnJvclxyXG5cdFx0XHRcdFx0ZS5jdXJyZW50QW5pbWF0aW9uID0gYW5pbWF0aW9uO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHR0aGlzLmdhbWUuY29ubmVjdGlvbi5vbignZW50aXR5Q3JlYXRlJywgZW50aXR5RGF0YSA9PiB7XHJcblx0XHRcdFx0Ly8gSWYgdGhlIHdvcmxkIGlzIG5vdCBzZXRcclxuXHRcdFx0XHRpZiAodGhpcy5nYW1lLndvcmxkID09PSB1bmRlZmluZWQpIHJldHVybjtcclxuXHJcblx0XHRcdFx0dGhpcy5nYW1lLndvcmxkLmVudGl0aWVzW2VudGl0eURhdGEuaWRdID0gbmV3IEVudGl0eUNsYXNzZXNbXHJcblx0XHRcdFx0XHRlbnRpdHlEYXRhLnR5cGVcclxuXHRcdFx0XHRdKGVudGl0eURhdGEpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHRoaXMuZ2FtZS5jb25uZWN0aW9uLm9uKCdlbnRpdHlEZWxldGUnLCBpZCA9PiB7XHJcblx0XHRcdFx0Ly8gSWYgdGhlIHdvcmxkIGlzIG5vdCBzZXRcclxuXHRcdFx0XHRpZiAodGhpcy5nYW1lLndvcmxkID09PSB1bmRlZmluZWQpIHJldHVybjtcclxuXHJcblx0XHRcdFx0ZGVsZXRlIHRoaXMuZ2FtZS53b3JsZC5lbnRpdGllc1tpZF07XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0Ly8gVXBkYXRlIHRoZSBvdGhlciBwbGF5ZXJzIGluIHRoZSB3b3JsZFxyXG5cdFx0XHR0aGlzLmdhbWUuY29ubmVjdGlvbi5vbihcclxuXHRcdFx0XHQnZW50aXR5U25hcHNob3QnLFxyXG5cdFx0XHRcdChzbmFwc2hvdDoge1xyXG5cdFx0XHRcdFx0aWQ6IHN0cmluZztcclxuXHRcdFx0XHRcdHRpbWU6IG51bWJlcjtcclxuXHRcdFx0XHRcdHN0YXRlOiB7IGlkOiBzdHJpbmc7IHg6IHN0cmluZzsgeTogc3RyaW5nIH1bXTtcclxuXHRcdFx0XHR9KSA9PiB7XHJcblx0XHRcdFx0XHQvLyBJZiB0aGUgd29ybGQgaXMgbm90IHNldFxyXG5cdFx0XHRcdFx0aWYgKHRoaXMuZ2FtZS53b3JsZCA9PT0gdW5kZWZpbmVkKSByZXR1cm47XHJcblxyXG5cdFx0XHRcdFx0dGhpcy5nYW1lLndvcmxkLnVwZGF0ZVBsYXllcnMoc25hcHNob3QpO1xyXG5cdFx0XHRcdH0sXHJcblx0XHRcdCk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiByYW5kaW50KHgxOiBudW1iZXIsIHgyOiBudW1iZXIpIHtcclxuXHRyZXR1cm4gTWF0aC5mbG9vcih4MSArIE1hdGgucmFuZG9tKCkgKiAoeDIgKyAxIC0geDEpKTtcclxufVxyXG4iLCJpbXBvcnQgeyBUaWxlUmVzb3VyY2UgfSBmcm9tICcuL3Jlc291cmNlcy9UaWxlUmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBJbWFnZVJlc291cmNlIH0gZnJvbSAnLi9yZXNvdXJjZXMvSW1hZ2VSZXNvdXJjZSc7XHJcbmltcG9ydCB7IEZvbnRSZXNvdXJjZSB9IGZyb20gJy4vcmVzb3VyY2VzL0ZvbnRSZXNvdXJjZSc7XHJcbmltcG9ydCB7IEF1ZGlvUmVzb3VyY2VHcm91cCB9IGZyb20gJy4vcmVzb3VyY2VzL0F1ZGlvUmVzb3VyY2VHcm91cCc7XHJcbmltcG9ydCB7IEF1ZGlvUmVzb3VyY2UgfSBmcm9tICcuL3Jlc291cmNlcy9BdWRpb1Jlc291cmNlJztcclxuaW1wb3J0IHsgSXRlbVR5cGUgfSBmcm9tICcuLi8uLi9nbG9iYWwvSW52ZW50b3J5JztcclxuaW1wb3J0IHsgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlIH0gZnJvbSAnLi9yZXNvdXJjZXMvUmVmbGVjdGVkSW1hZ2VSZXNvdXJjZSc7XHJcbmltcG9ydCBQNSBmcm9tICdwNSc7XHJcbmltcG9ydCB7IFJlc291cmNlIH0gZnJvbSAnLi9yZXNvdXJjZXMvUmVzb3VyY2UnO1xyXG5cclxuaW50ZXJmYWNlIEFzc2V0R3JvdXAge1xyXG5cdFtuYW1lOiBzdHJpbmddOlxyXG5cdFx0fCB7XHJcblx0XHRcdFx0W25hbWU6IHN0cmluZ106XHJcblx0XHRcdFx0XHR8IFJlc291cmNlXHJcblx0XHRcdFx0XHR8IEFzc2V0R3JvdXBcclxuXHRcdFx0XHRcdHwgQXVkaW9SZXNvdXJjZUdyb3VwXHJcblx0XHRcdFx0XHR8IEF1ZGlvUmVzb3VyY2VcclxuXHRcdFx0XHRcdHwgSW1hZ2VSZXNvdXJjZVtdXHJcbiAgICAgICAgICAgICAgICAgICAgfCBSZWZsZWN0YWJsZUltYWdlUmVzb3VyY2VbXVxyXG4gICAgICAgICAgICAgICAgICAgIHwgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlXHJcblx0XHRcdFx0XHR8IFtSZWZsZWN0YWJsZUltYWdlUmVzb3VyY2UsIG51bWJlcl1bXTtcclxuXHRcdCAgfVxyXG5cdFx0fCBSZXNvdXJjZVxyXG5cdFx0fCBBc3NldEdyb3VwXHJcblx0XHR8IEF1ZGlvUmVzb3VyY2VHcm91cFxyXG5cdFx0fCBBdWRpb1Jlc291cmNlXHJcblx0XHR8IEltYWdlUmVzb3VyY2VbXVxyXG5cdFx0fCBJbWFnZVJlc291cmNlW11bXVxyXG4gICAgICAgIHwgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlW11cclxuICAgICAgICB8IFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZVxyXG5cdFx0fCBbUmVmbGVjdGFibGVJbWFnZVJlc291cmNlLCBudW1iZXJdW107XHJcbn1cclxuXHJcbmNvbnN0IHBsYXllckFuaW1hdGlvbnMgPSA8VCBleHRlbmRzIFJlY29yZDxzdHJpbmcsIFtSZWZsZWN0YWJsZUltYWdlUmVzb3VyY2UsIG51bWJlcl1bXT4+KFxyXG5cdGRhdGE6IFQsXHJcbik6IFQgPT4gZGF0YTtcclxuXHJcbmV4cG9ydCBjb25zdCBQbGF5ZXJBbmltYXRpb25zID0gcGxheWVyQW5pbWF0aW9ucyh7XHJcblx0Ly9pbWFnZSwgbWlsbGlzZWNvbmRzIHRvIGRpc3BsYXkgZm9yXHJcblx0aWRsZTogW1xyXG5cdFx0W25ldyBSZWZsZWN0YWJsZUltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy9wbGF5ZXIvc25vd21hbmlkbGUxLnBuZycpLCAxMzVdLC8vaWdub3JlIHRoZSBhdHJvY2lvdXMgbmFtaW5nIHNjaGVtZSBvZiB0aGVzZSBpbWFnZXNcclxuXHRcdFtuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvcGxheWVyL3Nub3dtYW5pZGxlMi5wbmcnKSwgMTM1XSxcclxuXHRcdFtuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvcGxheWVyL3Nub3dtYW5pZGxlMy5wbmcnKSwgMTM1XSxcclxuXHRcdFtuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvcGxheWVyL3Nub3dtYW5pZGxlNC5wbmcnKSwgMTM1XSxcclxuXHRcdFtuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvcGxheWVyL3Nub3dtYW5pZGxlNS5wbmcnKSwgMTM1XSxcclxuXHRcdFtuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvcGxheWVyL3Nub3dtYW5pZGxlNi5wbmcnKSwgMTM1XSxcclxuXHRcdFtuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvcGxheWVyL3Nub3dtYW5pZGxlNy5wbmcnKSwgMTM1XSxcclxuXHRcdFtuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvcGxheWVyL3Nub3dtYW5pZGxlOC5wbmcnKSwgMTM1XSxcclxuXHRdLFxyXG5cdGlkbGVsZWZ0OiBbXHJcblx0XHRbbmV3IFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3BsYXllci9zbm93bWFuaWRsZWZsaXBwZWQxLnBuZycpLCAxMzVdLFxyXG5cdFx0W25ldyBSZWZsZWN0YWJsZUltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy9wbGF5ZXIvc25vd21hbmlkbGVmbGlwcGVkMi5wbmcnKSwgMTM1XSxcclxuXHRcdFtuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvcGxheWVyL3Nub3dtYW5pZGxlZmxpcHBlZDMucG5nJyksIDEzNV0sXHJcblx0XHRbbmV3IFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3BsYXllci9zbm93bWFuaWRsZWZsaXBwZWQ0LnBuZycpLCAxMzVdLFxyXG5cdFx0W25ldyBSZWZsZWN0YWJsZUltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy9wbGF5ZXIvc25vd21hbmlkbGVmbGlwcGVkNS5wbmcnKSwgMTM1XSxcclxuXHRcdFtuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvcGxheWVyL3Nub3dtYW5pZGxlZmxpcHBlZDYucG5nJyksIDEzNV0sXHJcblx0XHRbbmV3IFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3BsYXllci9zbm93bWFuaWRsZWZsaXBwZWQ3LnBuZycpLCAxMzVdLFxyXG5cdFx0W25ldyBSZWZsZWN0YWJsZUltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy9wbGF5ZXIvc25vd21hbmlkbGVmbGlwcGVkOC5wbmcnKSwgMTM1XSxcclxuXHRdLFxyXG5cdHdhbGs6IFtcclxuXHRcdFtuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvcGxheWVyL3Nub3dtYW5yb2xsMDEucG5nJyksIDc1XSxcclxuXHRcdFtuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvcGxheWVyL3Nub3dtYW5yb2xsMDIucG5nJyksIDc1XSxcclxuXHRcdFtuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvcGxheWVyL3Nub3dtYW5yb2xsMDMucG5nJyksIDc1XSxcclxuXHRcdFtuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvcGxheWVyL3Nub3dtYW5yb2xsMDQucG5nJyksIDc1XSxcclxuXHRcdFtuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvcGxheWVyL3Nub3dtYW5yb2xsMDUucG5nJyksIDc1XSxcclxuXHRcdFtuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvcGxheWVyL3Nub3dtYW5yb2xsMDYucG5nJyksIDc1XSxcclxuXHRcdFtuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvcGxheWVyL3Nub3dtYW5yb2xsMDcucG5nJyksIDc1XSxcclxuXHRcdFtuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvcGxheWVyL3Nub3dtYW5yb2xsMDgucG5nJyksIDc1XSxcclxuXHRdLFxyXG5cdHdhbGtsZWZ0OiBbXHJcblx0XHRbbmV3IFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3BsYXllci9zbm93bWFucm9sbGxlZnQwMS5wbmcnKSwgNzVdLFxyXG5cdFx0W25ldyBSZWZsZWN0YWJsZUltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy9wbGF5ZXIvc25vd21hbnJvbGxsZWZ0MDIucG5nJyksIDc1XSxcclxuXHRcdFtuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvcGxheWVyL3Nub3dtYW5yb2xsbGVmdDAzLnBuZycpLCA3NV0sXHJcblx0XHRbbmV3IFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3BsYXllci9zbm93bWFucm9sbGxlZnQwNC5wbmcnKSwgNzVdLFxyXG5cdFx0W25ldyBSZWZsZWN0YWJsZUltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy9wbGF5ZXIvc25vd21hbnJvbGxsZWZ0MDUucG5nJyksIDc1XSxcclxuXHRcdFtuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvcGxheWVyL3Nub3dtYW5yb2xsbGVmdDA2LnBuZycpLCA3NV0sXHJcblx0XHRbbmV3IFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3BsYXllci9zbm93bWFucm9sbGxlZnQwNy5wbmcnKSwgNzVdLFxyXG5cdFx0W25ldyBSZWZsZWN0YWJsZUltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy9wbGF5ZXIvc25vd21hbnJvbGxsZWZ0MDgucG5nJyksIDc1XSxcclxuXHRdLFxyXG59KTtcclxuXHJcbi8vIEl0ZW0gcmVsYXRlZCBhc3NldHNcclxuZXhwb3J0IGNvbnN0IEl0ZW1Bc3NldHM6IFJlY29yZDxJdGVtVHlwZSwgSW1hZ2VSZXNvdXJjZT4gPSB7XHJcblx0W0l0ZW1UeXBlLlNub3dCbG9ja106IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9ibG9ja19zbm93LnBuZycsXHJcblx0KSxcclxuXHRbSXRlbVR5cGUuSWNlQmxvY2tdOiBuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdCdhc3NldHMvdGV4dHVyZXMvaXRlbXMvYmxvY2tfaWNlLnBuZycsXHJcblx0KSxcclxuXHRbSXRlbVR5cGUuRGlydEJsb2NrXTogbmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHQnYXNzZXRzL3RleHR1cmVzL2l0ZW1zL2Jsb2NrX2RpcnQucG5nJyxcclxuXHQpLFxyXG5cdFtJdGVtVHlwZS5TdG9uZTBCbG9ja106IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9ibG9ja19zdG9uZTAucG5nJyxcclxuXHQpLFxyXG5cdFtJdGVtVHlwZS5TdG9uZTFCbG9ja106IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9ibG9ja19zdG9uZTEucG5nJyxcclxuXHQpLFxyXG5cdFtJdGVtVHlwZS5TdG9uZTJCbG9ja106IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9ibG9ja19zdG9uZTIucG5nJyxcclxuXHQpLFxyXG5cdFtJdGVtVHlwZS5TdG9uZTNCbG9ja106IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9ibG9ja19zdG9uZTMucG5nJyxcclxuXHQpLFxyXG5cdFtJdGVtVHlwZS5TdG9uZTRCbG9ja106IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9ibG9ja19zdG9uZTQucG5nJyxcclxuXHQpLFxyXG5cdFtJdGVtVHlwZS5TdG9uZTVCbG9ja106IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9ibG9ja19zdG9uZTUucG5nJyxcclxuXHQpLFxyXG5cdFtJdGVtVHlwZS5TdG9uZTZCbG9ja106IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9ibG9ja19zdG9uZTYucG5nJyxcclxuXHQpLFxyXG5cdFtJdGVtVHlwZS5TdG9uZTdCbG9ja106IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9ibG9ja19zdG9uZTcucG5nJyxcclxuXHQpLFxyXG5cdFtJdGVtVHlwZS5TdG9uZThCbG9ja106IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9ibG9ja19zdG9uZTgucG5nJyxcclxuXHQpLFxyXG5cdFtJdGVtVHlwZS5TdG9uZTlCbG9ja106IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9ibG9ja19zdG9uZTkucG5nJyxcclxuXHQpLFxyXG5cdFtJdGVtVHlwZS5UaW5CbG9ja106IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9ibG9ja190aW4ucG5nJyxcclxuXHQpLFxyXG5cdFtJdGVtVHlwZS5BbHVtaW51bUJsb2NrXTogbmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHQnYXNzZXRzL3RleHR1cmVzL2l0ZW1zL2Jsb2NrX2FsdW1pbnVtLnBuZycsXHJcblx0KSxcclxuXHRbSXRlbVR5cGUuR29sZEJsb2NrXTogbmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHQnYXNzZXRzL3RleHR1cmVzL2l0ZW1zL2Jsb2NrX2dvbGQucG5nJyxcclxuXHQpLFxyXG5cdFtJdGVtVHlwZS5UaXRhbml1bUJsb2NrXTogbmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHQnYXNzZXRzL3RleHR1cmVzL2l0ZW1zL2Jsb2NrX3RpdGFuaXVtLnBuZycsXHJcblx0KSxcclxuXHRbSXRlbVR5cGUuR3JhcGVCbG9ja106IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9ibG9ja19ncmFwZS5wbmcnLFxyXG5cdCksXHJcblx0W0l0ZW1UeXBlLldvb2QwQmxvY2tdOiBuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdCdhc3NldHMvdGV4dHVyZXMvaXRlbXMvYmxvY2tfd29vZDAucG5nJyxcclxuXHQpLFxyXG5cdFtJdGVtVHlwZS5Xb29kMUJsb2NrXTogbmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHQnYXNzZXRzL3RleHR1cmVzL2l0ZW1zL2Jsb2NrX3dvb2QxLnBuZycsXHJcblx0KSxcclxuXHRbSXRlbVR5cGUuV29vZDJCbG9ja106IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9ibG9ja193b29kMi5wbmcnLFxyXG5cdCksXHJcblx0W0l0ZW1UeXBlLldvb2QzQmxvY2tdOiBuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdCdhc3NldHMvdGV4dHVyZXMvaXRlbXMvYmxvY2tfd29vZDMucG5nJyxcclxuXHQpLFxyXG5cdFtJdGVtVHlwZS5Xb29kNEJsb2NrXTogbmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHQnYXNzZXRzL3RleHR1cmVzL2l0ZW1zL2Jsb2NrX3dvb2Q0LnBuZycsXHJcblx0KSxcclxuXHRbSXRlbVR5cGUuV29vZDVCbG9ja106IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9ibG9ja193b29kNS5wbmcnLFxyXG5cdCksXHJcblx0W0l0ZW1UeXBlLldvb2Q2QmxvY2tdOiBuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdCdhc3NldHMvdGV4dHVyZXMvaXRlbXMvYmxvY2tfd29vZDYucG5nJyxcclxuXHQpLFxyXG5cdFtJdGVtVHlwZS5Xb29kN0Jsb2NrXTogbmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHQnYXNzZXRzL3RleHR1cmVzL2l0ZW1zL2Jsb2NrX3dvb2Q3LnBuZycsXHJcblx0KSxcclxuXHRbSXRlbVR5cGUuV29vZDhCbG9ja106IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9ibG9ja193b29kOC5wbmcnLFxyXG5cdCksXHJcblx0W0l0ZW1UeXBlLldvb2Q5QmxvY2tdOiBuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdCdhc3NldHMvdGV4dHVyZXMvaXRlbXMvYmxvY2tfd29vZDkucG5nJyxcclxuXHQpLFxyXG5cdFtJdGVtVHlwZS5TZWVkXTogbmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHQnYXNzZXRzL3RleHR1cmVzL2l0ZW1zL3NlZWQucG5nJyxcclxuXHQpLFxyXG59O1xyXG5cclxuLy8gVWkgcmVsYXRlZCBhc3NldHNcclxuZXhwb3J0IGNvbnN0IFVpQXNzZXRzID0ge1xyXG5cdHVpX3Nsb3Rfc2VsZWN0ZWQ6IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy91aS91aXNsb3Rfc2VsZWN0ZWQucG5nJyxcclxuXHQpLFxyXG5cdHVpX3Nsb3Q6IG5ldyBJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvdWkvdWlzbG90LnBuZycpLFxyXG5cdHVpX2ZyYW1lOiBuZXcgSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3VpL3VpZnJhbWUucG5nJyksXHJcblx0YnV0dG9uX3Vuc2VsZWN0ZWQ6IG5ldyBJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvdWkvYnV0dG9uMC5wbmcnKSxcclxuXHRidXR0b25fc2VsZWN0ZWQ6IG5ldyBJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvdWkvYnV0dG9uMS5wbmcnKSxcclxuXHRzbGlkZXJfYmFyOiBuZXcgSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3VpL3NsaWRlckJhci5wbmcnKSxcclxuXHRzbGlkZXJfaGFuZGxlOiBuZXcgSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3VpL3NsaWRlckhhbmRsZS5wbmcnKSxcclxuXHR0aXRsZV9pbWFnZTogbmV3IEltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy91aS9zbm93ZWRpbkJVTVAucG5nJyksXHJcblx0dmlnbmV0dGU6IG5ldyBJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvdWkvdmlnbmV0dGUtZXhwb3J0LnBuZycpLFxyXG5cdHNlbGVjdGVkX3RpbGU6IG5ldyBJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvdWkvc2VsZWN0ZWR0aWxlLnBuZycpLFxyXG59O1xyXG5cclxuLy8gV29ybGQgcmVsYXRlZCBhc3NldHNcclxuZXhwb3J0IGNvbnN0IFdvcmxkQXNzZXRzID0ge1xyXG5cdHNoYWRlclJlc291cmNlczoge1xyXG5cdFx0c2t5SW1hZ2U6IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3NoYWRlcl9yZXNvdXJjZXMvcG9pc3NvbnNub3cucG5nJyxcclxuXHRcdCksXHJcblx0fSxcclxuXHRtaWRkbGVncm91bmQ6IHtcclxuXHRcdHRpbGVzZXRfaWNlOiBuZXcgVGlsZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL21pZGRsZWdyb3VuZC90aWxlc2V0X2ljZS5wbmcnLFxyXG5cdFx0XHQxNixcclxuXHRcdFx0MSxcclxuXHRcdFx0OCxcclxuXHRcdFx0OCxcclxuXHRcdCksXHJcblx0XHR0aWxlc2V0X3Nub3c6IG5ldyBUaWxlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvbWlkZGxlZ3JvdW5kL3RpbGVzZXRfc25vdy5wbmcnLFxyXG5cdFx0XHQxNixcclxuXHRcdFx0MSxcclxuXHRcdFx0OCxcclxuXHRcdFx0OCxcclxuXHRcdCksXHJcblx0XHR0aWxlc2V0X2RpcnQ6IG5ldyBUaWxlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvbWlkZGxlZ3JvdW5kL3RpbGVzZXRfZGlydDAucG5nJyxcclxuXHRcdFx0MTYsXHJcblx0XHRcdDEsXHJcblx0XHRcdDgsXHJcblx0XHRcdDgsXHJcblx0XHQpLFxyXG5cdFx0dGlsZXNldF9zdG9uZTA6IG5ldyBUaWxlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvbWlkZGxlZ3JvdW5kL3RpbGVzZXRfc3RvbmUwLnBuZycsXHJcblx0XHRcdDE2LFxyXG5cdFx0XHQxLFxyXG5cdFx0XHQ4LFxyXG5cdFx0XHQ4LFxyXG5cdFx0KSxcclxuXHRcdHRpbGVzZXRfc3RvbmUxOiBuZXcgVGlsZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL21pZGRsZWdyb3VuZC90aWxlc2V0X3N0b25lMS5wbmcnLFxyXG5cdFx0XHQxNixcclxuXHRcdFx0MSxcclxuXHRcdFx0OCxcclxuXHRcdFx0OCxcclxuXHRcdCksXHJcblx0XHR0aWxlc2V0X3N0b25lMjogbmV3IFRpbGVSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9taWRkbGVncm91bmQvdGlsZXNldF9zdG9uZTIucG5nJyxcclxuXHRcdFx0MTYsXHJcblx0XHRcdDEsXHJcblx0XHRcdDgsXHJcblx0XHRcdDgsXHJcblx0XHQpLFxyXG5cdFx0dGlsZXNldF9zdG9uZTM6IG5ldyBUaWxlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvbWlkZGxlZ3JvdW5kL3RpbGVzZXRfc3RvbmUzLnBuZycsXHJcblx0XHRcdDE2LFxyXG5cdFx0XHQxLFxyXG5cdFx0XHQ4LFxyXG5cdFx0XHQ4LFxyXG5cdFx0KSxcclxuXHRcdHRpbGVzZXRfc3RvbmU0OiBuZXcgVGlsZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL21pZGRsZWdyb3VuZC90aWxlc2V0X3N0b25lNC5wbmcnLFxyXG5cdFx0XHQxNixcclxuXHRcdFx0MSxcclxuXHRcdFx0OCxcclxuXHRcdFx0OCxcclxuXHRcdCksXHJcblx0XHR0aWxlc2V0X3N0b25lNTogbmV3IFRpbGVSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9taWRkbGVncm91bmQvdGlsZXNldF9zdG9uZTUucG5nJyxcclxuXHRcdFx0MTYsXHJcblx0XHRcdDEsXHJcblx0XHRcdDgsXHJcblx0XHRcdDgsXHJcblx0XHQpLFxyXG5cdFx0dGlsZXNldF9zdG9uZTY6IG5ldyBUaWxlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvbWlkZGxlZ3JvdW5kL3RpbGVzZXRfc3RvbmU2LnBuZycsXHJcblx0XHRcdDE2LFxyXG5cdFx0XHQxLFxyXG5cdFx0XHQ4LFxyXG5cdFx0XHQ4LFxyXG5cdFx0KSxcclxuXHRcdHRpbGVzZXRfc3RvbmU3OiBuZXcgVGlsZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL21pZGRsZWdyb3VuZC90aWxlc2V0X3N0b25lNy5wbmcnLFxyXG5cdFx0XHQxNixcclxuXHRcdFx0MSxcclxuXHRcdFx0OCxcclxuXHRcdFx0OCxcclxuXHRcdCksXHJcblx0XHR0aWxlc2V0X3N0b25lODogbmV3IFRpbGVSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9taWRkbGVncm91bmQvdGlsZXNldF9zdG9uZTgucG5nJyxcclxuXHRcdFx0MTYsXHJcblx0XHRcdDEsXHJcblx0XHRcdDgsXHJcblx0XHRcdDgsXHJcblx0XHQpLFxyXG5cdFx0dGlsZXNldF9zdG9uZTk6IG5ldyBUaWxlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvbWlkZGxlZ3JvdW5kL3RpbGVzZXRfc3RvbmU5LnBuZycsXHJcblx0XHRcdDE2LFxyXG5cdFx0XHQxLFxyXG5cdFx0XHQ4LFxyXG5cdFx0XHQ4LFxyXG5cdFx0KSxcclxuXHRcdHRpbGVzZXRfdGluOiBuZXcgVGlsZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL21pZGRsZWdyb3VuZC90aWxlc2V0X3Rpbi5wbmcnLFxyXG5cdFx0XHQxNixcclxuXHRcdFx0MSxcclxuXHRcdFx0OCxcclxuXHRcdFx0OCxcclxuXHRcdCksXHJcblx0XHR0aWxlc2V0X2FsdW1pbnVtOiBuZXcgVGlsZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL21pZGRsZWdyb3VuZC90aWxlc2V0X2FsdW1pbnVtLnBuZycsXHJcblx0XHRcdDE2LFxyXG5cdFx0XHQxLFxyXG5cdFx0XHQ4LFxyXG5cdFx0XHQ4LFxyXG5cdFx0KSxcclxuXHRcdHRpbGVzZXRfZ29sZDogbmV3IFRpbGVSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9taWRkbGVncm91bmQvdGlsZXNldF9nb2xkLnBuZycsXHJcblx0XHRcdDE2LFxyXG5cdFx0XHQxLFxyXG5cdFx0XHQ4LFxyXG5cdFx0XHQ4LFxyXG5cdFx0KSxcclxuXHRcdHRpbGVzZXRfdGl0YW5pdW06IG5ldyBUaWxlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvbWlkZGxlZ3JvdW5kL3RpbGVzZXRfdGl0YW5pdW0ucG5nJyxcclxuXHRcdFx0MTYsXHJcblx0XHRcdDEsXHJcblx0XHRcdDgsXHJcblx0XHRcdDgsXHJcblx0XHQpLFxyXG5cdFx0dGlsZXNldF9ncmFwZTogbmV3IFRpbGVSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9taWRkbGVncm91bmQvdGlsZXNldF9ncmFwZS5wbmcnLFxyXG5cdFx0XHQxNixcclxuXHRcdFx0MSxcclxuXHRcdFx0OCxcclxuXHRcdFx0OCxcclxuXHRcdCksXHJcblx0XHR0aWxlc2V0X3dvb2QwOiBuZXcgVGlsZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL21pZGRsZWdyb3VuZC93b29kMC5wbmcnLFxyXG5cdFx0XHQxLFxyXG5cdFx0XHQxLFxyXG5cdFx0XHQ4LFxyXG5cdFx0XHQ4LFxyXG5cdFx0KSxcclxuXHRcdHRpbGVzZXRfd29vZDE6IG5ldyBUaWxlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvbWlkZGxlZ3JvdW5kL3RpbGVzZXRfd29vZDEucG5nJyxcclxuXHRcdFx0MTYsXHJcblx0XHRcdDEsXHJcblx0XHRcdDgsXHJcblx0XHRcdDgsXHJcblx0XHQpLFxyXG5cdFx0dGlsZXNldF93b29kMjogbmV3IFRpbGVSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9taWRkbGVncm91bmQvdGlsZXNldF93b29kMi5wbmcnLFxyXG5cdFx0XHQxNixcclxuXHRcdFx0MSxcclxuXHRcdFx0OCxcclxuXHRcdFx0OCxcclxuXHRcdCksXHJcblx0XHR0aWxlc2V0X3dvb2QzOiBuZXcgVGlsZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL21pZGRsZWdyb3VuZC90aWxlc2V0X3dvb2QzLnBuZycsXHJcblx0XHRcdDE2LFxyXG5cdFx0XHQxLFxyXG5cdFx0XHQ4LFxyXG5cdFx0XHQ4LFxyXG5cdFx0KSxcclxuXHRcdHRpbGVzZXRfd29vZDQ6IG5ldyBUaWxlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvbWlkZGxlZ3JvdW5kL3RpbGVzZXRfd29vZDQucG5nJyxcclxuXHRcdFx0MTYsXHJcblx0XHRcdDEsXHJcblx0XHRcdDgsXHJcblx0XHRcdDgsXHJcblx0XHQpLFxyXG5cdFx0dGlsZXNldF93b29kNTogbmV3IFRpbGVSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9taWRkbGVncm91bmQvdGlsZXNldF93b29kNS5wbmcnLFxyXG5cdFx0XHQxNixcclxuXHRcdFx0MSxcclxuXHRcdFx0OCxcclxuXHRcdFx0OCxcclxuXHRcdCksXHJcblx0XHR0aWxlc2V0X3dvb2Q2OiBuZXcgVGlsZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL21pZGRsZWdyb3VuZC90aWxlc2V0X3dvb2Q2LnBuZycsXHJcblx0XHRcdDE2LFxyXG5cdFx0XHQxLFxyXG5cdFx0XHQ4LFxyXG5cdFx0XHQ4LFxyXG5cdFx0KSxcclxuXHRcdHRpbGVzZXRfd29vZDc6IG5ldyBUaWxlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvbWlkZGxlZ3JvdW5kL3RpbGVzZXRfd29vZDcucG5nJyxcclxuXHRcdFx0MTYsXHJcblx0XHRcdDEsXHJcblx0XHRcdDgsXHJcblx0XHRcdDgsXHJcblx0XHQpLFxyXG5cdFx0dGlsZXNldF93b29kODogbmV3IFRpbGVSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9taWRkbGVncm91bmQvdGlsZXNldF93b29kOC5wbmcnLFxyXG5cdFx0XHQxNixcclxuXHRcdFx0MSxcclxuXHRcdFx0OCxcclxuXHRcdFx0OCxcclxuXHRcdCksXHJcblx0XHR0aWxlc2V0X3dvb2Q5OiBuZXcgVGlsZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL21pZGRsZWdyb3VuZC90aWxlc2V0X3dvb2Q5LnBuZycsXHJcblx0XHRcdDE2LFxyXG5cdFx0XHQxLFxyXG5cdFx0XHQ4LFxyXG5cdFx0XHQ4LFxyXG5cdFx0KSxcclxuXHR9LFxyXG5cdGZvcmVncm91bmQ6IHtcclxuXHRcdFxyXG5cdH0sXHJcblx0dGlsZUVudGl0aWVzOiBbXHJcblx0XHRbLy90cmVlXHJcblx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC90aWxlRW50aXRpZXMvdHJlZXMvVHJlZTEucG5nJyxcclxuXHRcdCksXHJcblx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC90aWxlRW50aXRpZXMvdHJlZXMvVHJlZTIucG5nJyxcclxuXHRcdCksXHJcblx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC90aWxlRW50aXRpZXMvdHJlZXMvVHJlZTMucG5nJyxcclxuXHRcdCksXHJcblx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC90aWxlRW50aXRpZXMvdHJlZXMvVHJlZTQucG5nJyxcclxuXHRcdCksXHJcblx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC90aWxlRW50aXRpZXMvdHJlZXMvVHJlZTUucG5nJyxcclxuXHRcdCksXHJcblx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC90aWxlRW50aXRpZXMvdHJlZXMvVHJlZTYucG5nJyxcclxuXHRcdCksXHJcblx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC90aWxlRW50aXRpZXMvdHJlZXMvVHJlZTcucG5nJyxcclxuXHRcdCksXHJcblx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC90aWxlRW50aXRpZXMvdHJlZXMvVHJlZTgucG5nJyxcclxuXHRcdCksXHJcblx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC90aWxlRW50aXRpZXMvdHJlZXMvVHJlZTkucG5nJyxcclxuXHRcdCksXHJcblx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC90aWxlRW50aXRpZXMvdHJlZXMvVHJlZTEwLnBuZycsXHJcblx0XHQpLFxyXG5cdFx0XSxcclxuXHRcdFsvL2RyaWxsIHRpZXIgMVxyXG5cdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvdGlsZUVudGl0aWVzL1J1c3R5IERyaWxsL1J1c3R5RHJpbGwxLnBuZycsXHJcblx0XHQpLFxyXG5cdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvdGlsZUVudGl0aWVzL1J1c3R5IERyaWxsL1J1c3R5RHJpbGwyLnBuZycsXHJcblx0XHQpLFxyXG5cdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvdGlsZUVudGl0aWVzL1J1c3R5IERyaWxsL1J1c3R5RHJpbGwzLnBuZycsXHJcblx0XHQpLFxyXG5cdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvdGlsZUVudGl0aWVzL1J1c3R5IERyaWxsL1J1c3R5RHJpbGw0LnBuZycsXHJcblx0XHQpLFxyXG5cdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvdGlsZUVudGl0aWVzL1J1c3R5IERyaWxsL1J1c3R5RHJpbGw1LnBuZycsXHJcblx0XHQpLFxyXG5cdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvdGlsZUVudGl0aWVzL1J1c3R5IERyaWxsL1J1c3R5RHJpbGw2LnBuZycsXHJcblx0XHQpLFxyXG5cdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvdGlsZUVudGl0aWVzL1J1c3R5IERyaWxsL1J1c3R5RHJpbGw3LnBuZycsXHJcblx0XHQpLFxyXG5cdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvdGlsZUVudGl0aWVzL1J1c3R5IERyaWxsL1J1c3R5RHJpbGw4LnBuZycsXHJcblx0XHQpLFxyXG5cdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvdGlsZUVudGl0aWVzL1J1c3R5IERyaWxsL1J1c3R5RHJpbGw5LnBuZycsXHJcblx0XHQpLFxyXG5cdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvdGlsZUVudGl0aWVzL1J1c3R5IERyaWxsL1J1c3R5RHJpbGwxMC5wbmcnLFxyXG5cdFx0KSxcclxuXHRcdG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL3RpbGVFbnRpdGllcy9SdXN0eSBEcmlsbC9SdXN0eURyaWxsMTEucG5nJyxcclxuXHRcdCksXHJcblx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC90aWxlRW50aXRpZXMvUnVzdHkgRHJpbGwvUnVzdHlEcmlsbDEyLnBuZycsXHJcblx0XHQpLFxyXG5cdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvdGlsZUVudGl0aWVzL1J1c3R5IERyaWxsL1J1c3R5RHJpbGwxMy5wbmcnLFxyXG5cdFx0KSxcclxuXHRcdF0sXHJcblx0XHRbLy9kcmlsbCB0aWVyIDJcclxuXHJcblx0XHRdLFxyXG5cdFx0Wy8vZHJpbGwgdGllciAzXHJcblxyXG5cdFx0XSxcclxuXHRcdFsvL2RyaWxsIHRpZXIgNFxyXG5cclxuXHRcdF0sXHJcblx0XHRbLy9kcmlsbCB0aWVyIDVcclxuXHJcblx0XHRdLFxyXG5cdFx0Wy8vY3JhZnRpbmcgYmVuY2hcclxuXHRcdG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL3RpbGVFbnRpdGllcy9taXNjL2NyYWZ0aW5nQmVuY2gucG5nJyxcclxuXHRcdCksXHJcblx0XHRdLFxyXG5cdFx0Wy8vc2FwbGluZy9zZWVkXHJcblx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC90aWxlRW50aXRpZXMvdHJlZXMvc2FwbGluZy5wbmcnLFxyXG5cdFx0KSxcclxuXHRcdF1cclxuXHRdLFxyXG5cdGVudGl0aWVzOiB7XHJcblx0XHRlbnRpdHlfdDFkcm9uZTogW1xyXG5cdFx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUwMS5wbmcnLFxyXG5cdFx0XHQpLFxyXG5cdFx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUwMi5wbmcnLFxyXG5cdFx0XHQpLFxyXG5cdFx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUwMy5wbmcnLFxyXG5cdFx0XHQpLFxyXG5cdFx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUwNC5wbmcnLFxyXG5cdFx0XHQpLFxyXG5cdFx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUwNS5wbmcnLFxyXG5cdFx0XHQpLFxyXG5cdFx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUwNi5wbmcnLFxyXG5cdFx0XHQpLFxyXG5cdFx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUwNy5wbmcnLFxyXG5cdFx0XHQpLFxyXG5cdFx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUwOC5wbmcnLFxyXG5cdFx0XHQpLFxyXG5cdFx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUwOS5wbmcnLFxyXG5cdFx0XHQpLFxyXG5cdFx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUxMC5wbmcnLFxyXG5cdFx0XHQpLFxyXG5cdFx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUxMS5wbmcnLFxyXG5cdFx0XHQpLFxyXG5cdFx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUxMi5wbmcnLFxyXG5cdFx0XHQpLFxyXG5cdFx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUxMy5wbmcnLFxyXG5cdFx0XHQpLFxyXG5cdFx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUxNC5wbmcnLFxyXG5cdFx0XHQpLFxyXG5cdFx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUxNS5wbmcnLFxyXG5cdFx0XHQpLFxyXG5cdFx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUxNi5wbmcnLFxyXG5cdFx0XHQpLFxyXG5cdFx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUxNy5wbmcnLFxyXG5cdFx0XHQpLFxyXG5cdFx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUxOC5wbmcnLFxyXG5cdFx0XHQpLFxyXG5cdFx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUxOS5wbmcnLFxyXG5cdFx0XHQpLFxyXG5cdFx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL1NtYWxsIERyb25lL1NtYWxsRHJvbmUyMC5wbmcnLFxyXG5cdFx0XHQpLFxyXG5cdFx0XSxcclxuXHR9LFxyXG5cdGNsb3VkczogW1xyXG5cdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvZW50aXRpZXMvQ2xvdWRzL2Nsb3VkMS5wbmcnLFxyXG5cdFx0KSxcclxuXHRcdG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL0Nsb3Vkcy9jbG91ZDIucG5nJyxcclxuXHRcdCksXHJcblx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9lbnRpdGllcy9DbG91ZHMvY2xvdWQzLnBuZycsXHJcblx0XHQpLFxyXG5cdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvZW50aXRpZXMvQ2xvdWRzL2Nsb3VkNC5wbmcnLFxyXG5cdFx0KSxcclxuXHRcdG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL0Nsb3Vkcy9jbG91ZDUucG5nJyxcclxuXHRcdCksXHJcblx0XVxyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IEZvbnRzID0ge1xyXG5cdHRpdGxlOiBuZXcgRm9udFJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy91aS9mb250LnBuZycsXHJcblx0XHR7XHJcblx0XHRcdCcwJzogNyxcclxuXHRcdFx0JzEnOiA3LFxyXG5cdFx0XHQnMic6IDcsXHJcblx0XHRcdCczJzogNixcclxuXHRcdFx0JzQnOiA2LFxyXG5cdFx0XHQnNSc6IDYsXHJcblx0XHRcdCc2JzogNixcclxuXHRcdFx0JzcnOiA3LFxyXG5cdFx0XHQnOCc6IDcsXHJcblx0XHRcdCc5JzogNixcclxuXHRcdFx0J0EnOiA2LFxyXG5cdFx0XHQnQic6IDcsXHJcblx0XHRcdCdDJzogNyxcclxuXHRcdFx0J0QnOiA2LFxyXG5cdFx0XHQnRSc6IDcsXHJcblx0XHRcdCdGJzogNixcclxuXHRcdFx0J0cnOiA3LFxyXG5cdFx0XHQnSCc6IDcsXHJcblx0XHRcdCdJJzogNyxcclxuXHRcdFx0J0onOiA4LFxyXG5cdFx0XHQnSyc6IDYsXHJcblx0XHRcdCdMJzogNixcclxuXHRcdFx0J00nOiA4LFxyXG5cdFx0XHQnTic6IDgsXHJcblx0XHRcdCdPJzogOCxcclxuXHRcdFx0J1AnOiA5LFxyXG5cdFx0XHQnUSc6IDgsXHJcblx0XHRcdCdSJzogNyxcclxuXHRcdFx0J1MnOiA3LFxyXG5cdFx0XHQnVCc6IDgsXHJcblx0XHRcdCdVJzogOCxcclxuXHRcdFx0J1YnOiA4LFxyXG5cdFx0XHQnVyc6IDEwLFxyXG5cdFx0XHQnWCc6IDgsXHJcblx0XHRcdCdZJzogOCxcclxuXHRcdFx0J1onOiA5LFxyXG5cdFx0XHQnYSc6IDcsXHJcblx0XHRcdCdiJzogNyxcclxuXHRcdFx0J2MnOiA2LFxyXG5cdFx0XHQnZCc6IDcsXHJcblx0XHRcdCdlJzogNixcclxuXHRcdFx0J2YnOiA2LFxyXG5cdFx0XHQnZyc6IDYsXHJcblx0XHRcdCdoJzogNixcclxuXHRcdFx0J2knOiA1LFxyXG5cdFx0XHQnaic6IDYsXHJcblx0XHRcdCdrJzogNSxcclxuXHRcdFx0J2wnOiA1LFxyXG5cdFx0XHQnbSc6IDgsXHJcblx0XHRcdCduJzogNSxcclxuXHRcdFx0J28nOiA1LFxyXG5cdFx0XHQncCc6IDUsXHJcblx0XHRcdCdxJzogNyxcclxuXHRcdFx0J3InOiA1LFxyXG5cdFx0XHQncyc6IDQsXHJcblx0XHRcdCd0JzogNSxcclxuXHRcdFx0J3UnOiA1LFxyXG5cdFx0XHQndic6IDUsXHJcblx0XHRcdCd3JzogNyxcclxuXHRcdFx0J3gnOiA2LFxyXG5cdFx0XHQneSc6IDUsXHJcblx0XHRcdCd6JzogNSxcclxuXHRcdFx0JyEnOiA0LFxyXG5cdFx0XHQnLic6IDIsXHJcblx0XHRcdCcsJzogMixcclxuXHRcdFx0Jz8nOiA2LFxyXG5cdFx0XHQnXyc6IDYsXHJcblx0XHRcdCctJzogNCxcclxuXHRcdFx0JzonOiAyLFxyXG5cdFx0XHQn4oaRJzogNyxcclxuXHRcdFx0J+KGkyc6IDcsXHJcblx0XHRcdCcgJzogMixcclxuXHRcdH0sXHJcblx0XHQnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkhLiw/Xy064oaR4oaTICcsXHJcblx0XHQxMixcclxuXHQpLFxyXG5cclxuXHRiaWc6IG5ldyBGb250UmVzb3VyY2UoXHJcblx0XHQnYXNzZXRzL3RleHR1cmVzL3VpL2ZvbnRCaWcucG5nJyxcclxuXHRcdHtcclxuXHRcdFx0JzAnOiAxNSxcclxuXHRcdFx0JzEnOiAxNCxcclxuXHRcdFx0JzInOiAxNCxcclxuXHRcdFx0JzMnOiAxMyxcclxuXHRcdFx0JzQnOiAxMixcclxuXHRcdFx0JzUnOiAxMyxcclxuXHRcdFx0JzYnOiAxMixcclxuXHRcdFx0JzcnOiAxNCxcclxuXHRcdFx0JzgnOiAxNSxcclxuXHRcdFx0JzknOiAxMixcclxuXHRcdFx0J0EnOiAxMyxcclxuXHRcdFx0J0InOiAxNCxcclxuXHRcdFx0J0MnOiAxNSxcclxuXHRcdFx0J0QnOiAxMixcclxuXHRcdFx0J0UnOiAxNCxcclxuXHRcdFx0J0YnOiAxMyxcclxuXHRcdFx0J0cnOiAxNCxcclxuXHRcdFx0J0gnOiAxNSxcclxuXHRcdFx0J0knOiAxNSxcclxuXHRcdFx0J0onOiAxNixcclxuXHRcdFx0J0snOiAxMixcclxuXHRcdFx0J0wnOiAxMyxcclxuXHRcdFx0J00nOiAxNixcclxuXHRcdFx0J04nOiAxNyxcclxuXHRcdFx0J08nOiAxNyxcclxuXHRcdFx0J1AnOiAxOSxcclxuXHRcdFx0J1EnOiAxNyxcclxuXHRcdFx0J1InOiAxNCxcclxuXHRcdFx0J1MnOiAxNSxcclxuXHRcdFx0J1QnOiAxNyxcclxuXHRcdFx0J1UnOiAxNixcclxuXHRcdFx0J1YnOiAxNyxcclxuXHRcdFx0J1cnOiAyMSxcclxuXHRcdFx0J1gnOiAxNyxcclxuXHRcdFx0J1knOiAxNyxcclxuXHRcdFx0J1onOiAxOSxcclxuXHRcdFx0J2EnOiAxMixcclxuXHRcdFx0J2InOiAxNSxcclxuXHRcdFx0J2MnOiAxMixcclxuXHRcdFx0J2QnOiAxNSxcclxuXHRcdFx0J2UnOiAxMyxcclxuXHRcdFx0J2YnOiAxMixcclxuXHRcdFx0J2cnOiAxMyxcclxuXHRcdFx0J2gnOiAxMixcclxuXHRcdFx0J2knOiAxMSxcclxuXHRcdFx0J2onOiAxMixcclxuXHRcdFx0J2snOiAxMCxcclxuXHRcdFx0J2wnOiAxMCxcclxuXHRcdFx0J20nOiAxNixcclxuXHRcdFx0J24nOiAxMSxcclxuXHRcdFx0J28nOiAxMCxcclxuXHRcdFx0J3AnOiAxMSxcclxuXHRcdFx0J3EnOiAxNCxcclxuXHRcdFx0J3InOiAxMSxcclxuXHRcdFx0J3MnOiA4LFxyXG5cdFx0XHQndCc6IDExLFxyXG5cdFx0XHQndSc6IDEwLFxyXG5cdFx0XHQndic6IDExLFxyXG5cdFx0XHQndyc6IDE1LFxyXG5cdFx0XHQneCc6IDEyLFxyXG5cdFx0XHQneSc6IDExLFxyXG5cdFx0XHQneic6IDEwLFxyXG5cdFx0XHQnISc6IDksXHJcblx0XHRcdCcuJzogNCxcclxuXHRcdFx0JywnOiA0LFxyXG5cdFx0XHQnPyc6IDEzLFxyXG5cdFx0XHQnXyc6IDEzLFxyXG5cdFx0XHQnLSc6IDgsXHJcblx0XHRcdCc6JzogNCxcclxuXHRcdFx0JyAnOiA0LFxyXG5cdFx0fSxcclxuXHRcdCdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSEuLD9fLTogJyxcclxuXHRcdDI0LFxyXG5cdCksXHJcblx0dG9tX3RodW1iOiBuZXcgRm9udFJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy91aS90b21fdGh1bWIucG5nJyxcclxuXHRcdHtcclxuXHRcdFx0J0EnOiAzLFxyXG5cdFx0XHQnQic6IDMsXHJcblx0XHRcdCdDJzogMyxcclxuXHRcdFx0J0QnOiAzLFxyXG5cdFx0XHQnRSc6IDMsXHJcblx0XHRcdCdGJzogMyxcclxuXHRcdFx0J0cnOiAzLFxyXG5cdFx0XHQnSCc6IDMsXHJcblx0XHRcdCdJJzogMyxcclxuXHRcdFx0J0onOiAzLFxyXG5cdFx0XHQnSyc6IDMsXHJcblx0XHRcdCdMJzogMyxcclxuXHRcdFx0J00nOiAzLFxyXG5cdFx0XHQnTic6IDMsXHJcblx0XHRcdCdPJzogMyxcclxuXHRcdFx0J1AnOiAzLFxyXG5cdFx0XHQnUSc6IDMsXHJcblx0XHRcdCdSJzogMyxcclxuXHRcdFx0J1MnOiAzLFxyXG5cdFx0XHQnVCc6IDMsXHJcblx0XHRcdCdVJzogMyxcclxuXHRcdFx0J1YnOiAzLFxyXG5cdFx0XHQnVyc6IDMsXHJcblx0XHRcdCdYJzogMyxcclxuXHRcdFx0J1knOiAzLFxyXG5cdFx0XHQnWic6IDMsXHJcblx0XHRcdCdhJzogMyxcclxuXHRcdFx0J2InOiAzLFxyXG5cdFx0XHQnYyc6IDMsXHJcblx0XHRcdCdkJzogMyxcclxuXHRcdFx0J2UnOiAzLFxyXG5cdFx0XHQnZic6IDMsXHJcblx0XHRcdCdnJzogMyxcclxuXHRcdFx0J2gnOiAzLFxyXG5cdFx0XHQnaSc6IDMsXHJcblx0XHRcdCdqJzogMyxcclxuXHRcdFx0J2snOiAzLFxyXG5cdFx0XHQnbCc6IDMsXHJcblx0XHRcdCdtJzogMyxcclxuXHRcdFx0J24nOiAzLFxyXG5cdFx0XHQnbyc6IDMsXHJcblx0XHRcdCdwJzogMyxcclxuXHRcdFx0J3EnOiAzLFxyXG5cdFx0XHQncic6IDMsXHJcblx0XHRcdCdzJzogMyxcclxuXHRcdFx0J3QnOiAzLFxyXG5cdFx0XHQndSc6IDMsXHJcblx0XHRcdCd2JzogMyxcclxuXHRcdFx0J3cnOiAzLFxyXG5cdFx0XHQneCc6IDMsXHJcblx0XHRcdCd5JzogMyxcclxuXHRcdFx0J3onOiAzLFxyXG5cdFx0XHQnWyc6IDMsXHJcblx0XHRcdCdcXFxcJzogMyxcclxuXHRcdFx0J10nOiAzLFxyXG5cdFx0XHQnXic6IDMsXHJcblx0XHRcdCcgJzogMyxcclxuXHRcdFx0JyEnOiAzLFxyXG5cdFx0XHQnXCInOiAzLFxyXG5cdFx0XHQnIyc6IDMsXHJcblx0XHRcdCckJzogMyxcclxuXHRcdFx0JyUnOiAzLFxyXG5cdFx0XHQnJic6IDMsXHJcblx0XHRcdFwiJ1wiOiAzLFxyXG5cdFx0XHQnKCc6IDMsXHJcblx0XHRcdCcpJzogMyxcclxuXHRcdFx0JyonOiAzLFxyXG5cdFx0XHQnKyc6IDMsXHJcblx0XHRcdCcsJzogMyxcclxuXHRcdFx0Jy0nOiAzLFxyXG5cdFx0XHQnLic6IDMsXHJcblx0XHRcdCcvJzogMyxcclxuXHRcdFx0JzAnOiAzLFxyXG5cdFx0XHQnMSc6IDMsXHJcblx0XHRcdCcyJzogMyxcclxuXHRcdFx0JzMnOiAzLFxyXG5cdFx0XHQnNCc6IDMsXHJcblx0XHRcdCc1JzogMyxcclxuXHRcdFx0JzYnOiAzLFxyXG5cdFx0XHQnNyc6IDMsXHJcblx0XHRcdCc4JzogMyxcclxuXHRcdFx0JzknOiAzLFxyXG5cdFx0XHQnOic6IDMsXHJcblx0XHRcdCc7JzogMyxcclxuXHRcdFx0JzwnOiAzLFxyXG5cdFx0XHQnPSc6IDMsXHJcblx0XHRcdCc+JzogMyxcclxuXHRcdFx0Jz8nOiAzLFxyXG5cdFx0fSxcclxuXHRcdGBBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6W1xcXFxdXiAhXCIjJCUmJygpKissLS4vMDEyMzQ1Njc4OTo7PD0+P2AsXHJcblx0XHQ1LFxyXG5cdCksXHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgS2V5cyA9IHtcclxuXHRrZXlib2FyZE1hcDogW1xyXG5cdFx0JycsIC8vIFswXVxyXG5cdFx0JycsIC8vIFsxXVxyXG5cdFx0JycsIC8vIFsyXVxyXG5cdFx0J0NBTkNFTCcsIC8vIFszXVxyXG5cdFx0JycsIC8vIFs0XVxyXG5cdFx0JycsIC8vIFs1XVxyXG5cdFx0J0hFTFAnLCAvLyBbNl1cclxuXHRcdCcnLCAvLyBbN11cclxuXHRcdCdCQUNLU1BBQ0UnLCAvLyBbOF1cclxuXHRcdCdUQUInLCAvLyBbOV1cclxuXHRcdCcnLCAvLyBbMTBdXHJcblx0XHQnJywgLy8gWzExXVxyXG5cdFx0J0NMRUFSJywgLy8gWzEyXVxyXG5cdFx0J0VOVEVSJywgLy8gWzEzXVxyXG5cdFx0J0VOVEVSIFNQRUNJQUwnLCAvLyBbMTRdXHJcblx0XHQnJywgLy8gWzE1XVxyXG5cdFx0J1NISUZUJywgLy8gWzE2XVxyXG5cdFx0J0NPTlRST0wnLCAvLyBbMTddXHJcblx0XHQnQUxUJywgLy8gWzE4XVxyXG5cdFx0J1BBVVNFJywgLy8gWzE5XVxyXG5cdFx0J0NBUFMgTE9DSycsIC8vIFsyMF1cclxuXHRcdCdLQU5BJywgLy8gWzIxXVxyXG5cdFx0J0VJU1UnLCAvLyBbMjJdXHJcblx0XHQnSlVOSkEnLCAvLyBbMjNdXHJcblx0XHQnRklOQUwnLCAvLyBbMjRdXHJcblx0XHQnSEFOSkEnLCAvLyBbMjVdXHJcblx0XHQnJywgLy8gWzI2XVxyXG5cdFx0J0VTQ0FQRScsIC8vIFsyN11cclxuXHRcdCdDT05WRVJUJywgLy8gWzI4XVxyXG5cdFx0J05PTkNPTlZFUlQnLCAvLyBbMjldXHJcblx0XHQnQUNDRVBUJywgLy8gWzMwXVxyXG5cdFx0J01PREVDSEFOR0UnLCAvLyBbMzFdXHJcblx0XHQnU1BBQ0UnLCAvLyBbMzJdXHJcblx0XHQnUEFHRSBVUCcsIC8vIFszM11cclxuXHRcdCdQQUdFIERPV04nLCAvLyBbMzRdXHJcblx0XHQnRU5EJywgLy8gWzM1XVxyXG5cdFx0J0hPTUUnLCAvLyBbMzZdXHJcblx0XHQnTEVGVCcsIC8vIFszN11cclxuXHRcdCdVUCcsIC8vIFszOF1cclxuXHRcdCdSSUdIVCcsIC8vIFszOV1cclxuXHRcdCdET1dOJywgLy8gWzQwXVxyXG5cdFx0J1NFTEVDVCcsIC8vIFs0MV1cclxuXHRcdCdQUklOVCcsIC8vIFs0Ml1cclxuXHRcdCdFWEVDVVRFJywgLy8gWzQzXVxyXG5cdFx0J1BSSU5UIFNDUkVFTicsIC8vIFs0NF1cclxuXHRcdCdJTlNFUlQnLCAvLyBbNDVdXHJcblx0XHQnREVMRVRFJywgLy8gWzQ2XVxyXG5cdFx0JycsIC8vIFs0N11cclxuXHRcdCcwJywgLy8gWzQ4XVxyXG5cdFx0JzEnLCAvLyBbNDldXHJcblx0XHQnMicsIC8vIFs1MF1cclxuXHRcdCczJywgLy8gWzUxXVxyXG5cdFx0JzQnLCAvLyBbNTJdXHJcblx0XHQnNScsIC8vIFs1M11cclxuXHRcdCc2JywgLy8gWzU0XVxyXG5cdFx0JzcnLCAvLyBbNTVdXHJcblx0XHQnOCcsIC8vIFs1Nl1cclxuXHRcdCc5JywgLy8gWzU3XVxyXG5cdFx0J0NPTE9OJywgLy8gWzU4XVxyXG5cdFx0J1NFTUlDT0xPTicsIC8vIFs1OV1cclxuXHRcdCdMRVNTIFRIQU4nLCAvLyBbNjBdXHJcblx0XHQnRVFVQUxTJywgLy8gWzYxXVxyXG5cdFx0J0dSRUFURVIgVEhBTicsIC8vIFs2Ml1cclxuXHRcdCdRVUVTVElPTiBNQVJLJywgLy8gWzYzXVxyXG5cdFx0J0FUJywgLy8gWzY0XVxyXG5cdFx0J0EnLCAvLyBbNjVdXHJcblx0XHQnQicsIC8vIFs2Nl1cclxuXHRcdCdDJywgLy8gWzY3XVxyXG5cdFx0J0QnLCAvLyBbNjhdXHJcblx0XHQnRScsIC8vIFs2OV1cclxuXHRcdCdGJywgLy8gWzcwXVxyXG5cdFx0J0cnLCAvLyBbNzFdXHJcblx0XHQnSCcsIC8vIFs3Ml1cclxuXHRcdCdJJywgLy8gWzczXVxyXG5cdFx0J0onLCAvLyBbNzRdXHJcblx0XHQnSycsIC8vIFs3NV1cclxuXHRcdCdMJywgLy8gWzc2XVxyXG5cdFx0J00nLCAvLyBbNzddXHJcblx0XHQnTicsIC8vIFs3OF1cclxuXHRcdCdPJywgLy8gWzc5XVxyXG5cdFx0J1AnLCAvLyBbODBdXHJcblx0XHQnUScsIC8vIFs4MV1cclxuXHRcdCdSJywgLy8gWzgyXVxyXG5cdFx0J1MnLCAvLyBbODNdXHJcblx0XHQnVCcsIC8vIFs4NF1cclxuXHRcdCdVJywgLy8gWzg1XVxyXG5cdFx0J1YnLCAvLyBbODZdXHJcblx0XHQnVycsIC8vIFs4N11cclxuXHRcdCdYJywgLy8gWzg4XVxyXG5cdFx0J1knLCAvLyBbODldXHJcblx0XHQnWicsIC8vIFs5MF1cclxuXHRcdCdPUyBLRVknLCAvLyBbOTFdIFdpbmRvd3MgS2V5IChXaW5kb3dzKSBvciBDb21tYW5kIEtleSAoTWFjKVxyXG5cdFx0JycsIC8vIFs5Ml1cclxuXHRcdCdDT05URVhUIE1FTlUnLCAvLyBbOTNdXHJcblx0XHQnJywgLy8gWzk0XVxyXG5cdFx0J1NMRUVQJywgLy8gWzk1XVxyXG5cdFx0J05VTVBBRDAnLCAvLyBbOTZdXHJcblx0XHQnTlVNUEFEMScsIC8vIFs5N11cclxuXHRcdCdOVU1QQUQyJywgLy8gWzk4XVxyXG5cdFx0J05VTVBBRDMnLCAvLyBbOTldXHJcblx0XHQnTlVNUEFENCcsIC8vIFsxMDBdXHJcblx0XHQnTlVNUEFENScsIC8vIFsxMDFdXHJcblx0XHQnTlVNUEFENicsIC8vIFsxMDJdXHJcblx0XHQnTlVNUEFENycsIC8vIFsxMDNdXHJcblx0XHQnTlVNUEFEOCcsIC8vIFsxMDRdXHJcblx0XHQnTlVNUEFEOScsIC8vIFsxMDVdXHJcblx0XHQnTVVMVElQTFknLCAvLyBbMTA2XVxyXG5cdFx0J0FERCcsIC8vIFsxMDddXHJcblx0XHQnU0VQQVJBVE9SJywgLy8gWzEwOF1cclxuXHRcdCdTVUJUUkFDVCcsIC8vIFsxMDldXHJcblx0XHQnREVDSU1BTCcsIC8vIFsxMTBdXHJcblx0XHQnRElWSURFJywgLy8gWzExMV1cclxuXHRcdCdGMScsIC8vIFsxMTJdXHJcblx0XHQnRjInLCAvLyBbMTEzXVxyXG5cdFx0J0YzJywgLy8gWzExNF1cclxuXHRcdCdGNCcsIC8vIFsxMTVdXHJcblx0XHQnRjUnLCAvLyBbMTE2XVxyXG5cdFx0J0Y2JywgLy8gWzExN11cclxuXHRcdCdGNycsIC8vIFsxMThdXHJcblx0XHQnRjgnLCAvLyBbMTE5XVxyXG5cdFx0J0Y5JywgLy8gWzEyMF1cclxuXHRcdCdGMTAnLCAvLyBbMTIxXVxyXG5cdFx0J0YxMScsIC8vIFsxMjJdXHJcblx0XHQnRjEyJywgLy8gWzEyM11cclxuXHRcdCdGMTMnLCAvLyBbMTI0XVxyXG5cdFx0J0YxNCcsIC8vIFsxMjVdXHJcblx0XHQnRjE1JywgLy8gWzEyNl1cclxuXHRcdCdGMTYnLCAvLyBbMTI3XVxyXG5cdFx0J0YxNycsIC8vIFsxMjhdXHJcblx0XHQnRjE4JywgLy8gWzEyOV1cclxuXHRcdCdGMTknLCAvLyBbMTMwXVxyXG5cdFx0J0YyMCcsIC8vIFsxMzFdXHJcblx0XHQnRjIxJywgLy8gWzEzMl1cclxuXHRcdCdGMjInLCAvLyBbMTMzXVxyXG5cdFx0J0YyMycsIC8vIFsxMzRdXHJcblx0XHQnRjI0JywgLy8gWzEzNV1cclxuXHRcdCcnLCAvLyBbMTM2XVxyXG5cdFx0JycsIC8vIFsxMzddXHJcblx0XHQnJywgLy8gWzEzOF1cclxuXHRcdCcnLCAvLyBbMTM5XVxyXG5cdFx0JycsIC8vIFsxNDBdXHJcblx0XHQnJywgLy8gWzE0MV1cclxuXHRcdCcnLCAvLyBbMTQyXVxyXG5cdFx0JycsIC8vIFsxNDNdXHJcblx0XHQnTlVNIExPQ0snLCAvLyBbMTQ0XVxyXG5cdFx0J1NDUk9MTCBMT0NLJywgLy8gWzE0NV1cclxuXHRcdCdXSU4gT0VNIEZKIEpJU0hPJywgLy8gWzE0Nl1cclxuXHRcdCdXSU4gT0VNIEZKIE1BU1NIT1UnLCAvLyBbMTQ3XVxyXG5cdFx0J1dJTiBPRU0gRkogVE9VUk9LVScsIC8vIFsxNDhdXHJcblx0XHQnV0lOIE9FTSBGSiBMT1lBJywgLy8gWzE0OV1cclxuXHRcdCdXSU4gT0VNIEZKIFJPWUEnLCAvLyBbMTUwXVxyXG5cdFx0JycsIC8vIFsxNTFdXHJcblx0XHQnJywgLy8gWzE1Ml1cclxuXHRcdCcnLCAvLyBbMTUzXVxyXG5cdFx0JycsIC8vIFsxNTRdXHJcblx0XHQnJywgLy8gWzE1NV1cclxuXHRcdCcnLCAvLyBbMTU2XVxyXG5cdFx0JycsIC8vIFsxNTddXHJcblx0XHQnJywgLy8gWzE1OF1cclxuXHRcdCcnLCAvLyBbMTU5XVxyXG5cdFx0J0NJUkNVTUZMRVgnLCAvLyBbMTYwXVxyXG5cdFx0J0VYQ0xBTUFUSU9OJywgLy8gWzE2MV1cclxuXHRcdCdET1VCTEVfUVVPVEUnLCAvLyBbMTYyXVxyXG5cdFx0J0hBU0gnLCAvLyBbMTYzXVxyXG5cdFx0J0RPTExBUicsIC8vIFsxNjRdXHJcblx0XHQnUEVSQ0VOVCcsIC8vIFsxNjVdXHJcblx0XHQnQU1QRVJTQU5EJywgLy8gWzE2Nl1cclxuXHRcdCdVTkRFUlNDT1JFJywgLy8gWzE2N11cclxuXHRcdCdPUEVOIFBBUkVOVEhFU0lTJywgLy8gWzE2OF1cclxuXHRcdCdDTE9TRSBQQVJFTlRIRVNJUycsIC8vIFsxNjldXHJcblx0XHQnQVNURVJJU0snLCAvLyBbMTcwXVxyXG5cdFx0J1BMVVMnLCAvLyBbMTcxXVxyXG5cdFx0J1BJUEUnLCAvLyBbMTcyXVxyXG5cdFx0J0hZUEhFTicsIC8vIFsxNzNdXHJcblx0XHQnT1BFTiBDVVJMWSBCUkFDS0VUJywgLy8gWzE3NF1cclxuXHRcdCdDTE9TRSBDVVJMWSBCUkFDS0VUJywgLy8gWzE3NV1cclxuXHRcdCdUSUxERScsIC8vIFsxNzZdXHJcblx0XHQnJywgLy8gWzE3N11cclxuXHRcdCcnLCAvLyBbMTc4XVxyXG5cdFx0JycsIC8vIFsxNzldXHJcblx0XHQnJywgLy8gWzE4MF1cclxuXHRcdCdWT0xVTUUgTVVURScsIC8vIFsxODFdXHJcblx0XHQnVk9MVU1FIERPV04nLCAvLyBbMTgyXVxyXG5cdFx0J1ZPTFVNRSBVUCcsIC8vIFsxODNdXHJcblx0XHQnJywgLy8gWzE4NF1cclxuXHRcdCcnLCAvLyBbMTg1XVxyXG5cdFx0J1NFTUlDT0xPTicsIC8vIFsxODZdXHJcblx0XHQnRVFVQUxTJywgLy8gWzE4N11cclxuXHRcdCdDT01NQScsIC8vIFsxODhdXHJcblx0XHQnTUlOVVMnLCAvLyBbMTg5XVxyXG5cdFx0J1BFUklPRCcsIC8vIFsxOTBdXHJcblx0XHQnU0xBU0gnLCAvLyBbMTkxXVxyXG5cdFx0J0JBQ0sgUVVPVEUnLCAvLyBbMTkyXVxyXG5cdFx0JycsIC8vIFsxOTNdXHJcblx0XHQnJywgLy8gWzE5NF1cclxuXHRcdCcnLCAvLyBbMTk1XVxyXG5cdFx0JycsIC8vIFsxOTZdXHJcblx0XHQnJywgLy8gWzE5N11cclxuXHRcdCcnLCAvLyBbMTk4XVxyXG5cdFx0JycsIC8vIFsxOTldXHJcblx0XHQnJywgLy8gWzIwMF1cclxuXHRcdCcnLCAvLyBbMjAxXVxyXG5cdFx0JycsIC8vIFsyMDJdXHJcblx0XHQnJywgLy8gWzIwM11cclxuXHRcdCcnLCAvLyBbMjA0XVxyXG5cdFx0JycsIC8vIFsyMDVdXHJcblx0XHQnJywgLy8gWzIwNl1cclxuXHRcdCcnLCAvLyBbMjA3XVxyXG5cdFx0JycsIC8vIFsyMDhdXHJcblx0XHQnJywgLy8gWzIwOV1cclxuXHRcdCcnLCAvLyBbMjEwXVxyXG5cdFx0JycsIC8vIFsyMTFdXHJcblx0XHQnJywgLy8gWzIxMl1cclxuXHRcdCcnLCAvLyBbMjEzXVxyXG5cdFx0JycsIC8vIFsyMTRdXHJcblx0XHQnJywgLy8gWzIxNV1cclxuXHRcdCcnLCAvLyBbMjE2XVxyXG5cdFx0JycsIC8vIFsyMTddXHJcblx0XHQnJywgLy8gWzIxOF1cclxuXHRcdCdPUEVOIEJSQUNLRVQnLCAvLyBbMjE5XVxyXG5cdFx0J0JBQ0sgU0xBU0gnLCAvLyBbMjIwXVxyXG5cdFx0J0NMT1NFIEJSQUNLRVQnLCAvLyBbMjIxXVxyXG5cdFx0J1FVT1RFJywgLy8gWzIyMl1cclxuXHRcdCcnLCAvLyBbMjIzXVxyXG5cdFx0J01FVEEnLCAvLyBbMjI0XVxyXG5cdFx0J0FMVCBHUkFQSCcsIC8vIFsyMjVdXHJcblx0XHQnJywgLy8gWzIyNl1cclxuXHRcdCdXSU4gSUNPIEhFTFAnLCAvLyBbMjI3XVxyXG5cdFx0J1dJTiBJQ08gMDAnLCAvLyBbMjI4XVxyXG5cdFx0JycsIC8vIFsyMjldXHJcblx0XHQnV0lOIElDTyBDTEVBUicsIC8vIFsyMzBdXHJcblx0XHQnJywgLy8gWzIzMV1cclxuXHRcdCcnLCAvLyBbMjMyXVxyXG5cdFx0J1dJTiBPRU0gUkVTRVQnLCAvLyBbMjMzXVxyXG5cdFx0J1dJTiBPRU0gSlVNUCcsIC8vIFsyMzRdXHJcblx0XHQnV0lOIE9FTSBQQTEnLCAvLyBbMjM1XVxyXG5cdFx0J1dJTiBPRU0gUEEyJywgLy8gWzIzNl1cclxuXHRcdCdXSU4gT0VNIFBBMycsIC8vIFsyMzddXHJcblx0XHQnV0lOIE9FTSBXU0NUUkwnLCAvLyBbMjM4XVxyXG5cdFx0J1dJTiBPRU0gQ1VTRUwnLCAvLyBbMjM5XVxyXG5cdFx0J1dJTiBPRU0gQVRUTicsIC8vIFsyNDBdXHJcblx0XHQnV0lOIE9FTSBGSU5JU0gnLCAvLyBbMjQxXVxyXG5cdFx0J1dJTiBPRU0gQ09QWScsIC8vIFsyNDJdXHJcblx0XHQnV0lOIE9FTSBBVVRPJywgLy8gWzI0M11cclxuXHRcdCdXSU4gT0VNIEVOTFcnLCAvLyBbMjQ0XVxyXG5cdFx0J1dJTiBPRU0gQkFDS1RBQicsIC8vIFsyNDVdXHJcblx0XHQnQVRUTicsIC8vIFsyNDZdXHJcblx0XHQnQ1JTRUwnLCAvLyBbMjQ3XVxyXG5cdFx0J0VYU0VMJywgLy8gWzI0OF1cclxuXHRcdCdFUkVPRicsIC8vIFsyNDldXHJcblx0XHQnUExBWScsIC8vIFsyNTBdXHJcblx0XHQnWk9PTScsIC8vIFsyNTFdXHJcblx0XHQnJywgLy8gWzI1Ml1cclxuXHRcdCdQQTEnLCAvLyBbMjUzXVxyXG5cdFx0J1dJTiBPRU0gQ0xFQVInLCAvLyBbMjU0XVxyXG5cdFx0J1RPR0dMRSBUT1VDSFBBRCcsIC8vIFsyNTVdXHJcblx0XSwgLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTc3MjE3OS9nZXQtY2hhcmFjdGVyLXZhbHVlLWZyb20ta2V5Y29kZS1pbi1qYXZhc2NyaXB0LXRoZW4tdHJpbVxyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IEF1ZGlvQXNzZXRzID0ge1xyXG5cdHVpOiB7XHJcblx0XHRpbnZlbnRvcnlDbGFjazogbmV3IEF1ZGlvUmVzb3VyY2VHcm91cChbXHJcblx0XHRcdG5ldyBBdWRpb1Jlc291cmNlKCdhc3NldHMvc291bmRzL3NmeC91aS9jbGFjazEubXAzJyksXHJcblx0XHRcdG5ldyBBdWRpb1Jlc291cmNlKCdhc3NldHMvc291bmRzL3NmeC91aS9jbGFjazIubXAzJyksXHJcblx0XHRcdG5ldyBBdWRpb1Jlc291cmNlKCdhc3NldHMvc291bmRzL3NmeC91aS9jbGFjazMubXAzJyksXHJcblx0XHRdKSxcclxuXHR9LFxyXG5cdG11c2ljOiB7XHJcblx0XHR0aXRsZVNjcmVlbjogbmV3IEF1ZGlvUmVzb3VyY2UoJ2Fzc2V0cy9zb3VuZHMvbXVzaWMvVGl0bGVTY3JlZW4ubXAzJyksXHJcblx0fSxcclxuXHRhbWJpZW50OiB7XHJcblx0XHR3aW50ZXIxOiBuZXcgQXVkaW9SZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy9zb3VuZHMvc2Z4L2FtYmllbnQvNjU4MTNfX3BjYWVsZHJpZXNfX2NvdW50cnlzaWRld2ludGVyZXZlbmluZzAyLndhdicsXHJcblx0XHQpLFxyXG5cdH0sXHJcbn07XHJcblxyXG5leHBvcnQgdHlwZSBBbmltYXRpb25GcmFtZTxUIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgW0ltYWdlUmVzb3VyY2UsIG51bWJlcl1bXT4+ID0ga2V5b2YgVDtcclxuXHJcbi8vIGNvbnN0IGFuaW1hdGlvbnMgPSA8VCBleHRlbmRzIFJlY29yZDxzdHJpbmcsIEltYWdlUmVzb3VyY2VbXT4+KGRhdGE6IFQpOiBUID0+IGRhdGFcclxuXHJcbmV4cG9ydCBjb25zdCBsb2FkQXNzZXRzID0gKHNrZXRjaDogUDUsIC4uLmFzc2V0czogQXNzZXRHcm91cFtdKSA9PiB7XHJcblx0YXNzZXRzLmZvckVhY2goYXNzZXRHcm91cCA9PiB7XHJcblx0XHRzZWFyY2hHcm91cChhc3NldEdyb3VwLCBza2V0Y2gpO1xyXG5cdH0pO1xyXG59O1xyXG5cclxuZnVuY3Rpb24gc2VhcmNoR3JvdXAoXHJcblx0YXNzZXRHcm91cDpcclxuXHRcdHwgQXNzZXRHcm91cFxyXG5cdFx0fCBSZXNvdXJjZVxyXG5cdFx0fCBBdWRpb1Jlc291cmNlXHJcblx0XHR8IEF1ZGlvUmVzb3VyY2VHcm91cCxcclxuXHRza2V0Y2g6IFA1LFxyXG4pIHtcclxuXHRpZiAoYXNzZXRHcm91cCBpbnN0YW5jZW9mIFJlc291cmNlKSB7XHJcblx0XHRjb25zb2xlLmxvZyhgTG9hZGluZyBhc3NldCAke2Fzc2V0R3JvdXAucGF0aH1gKTtcclxuXHRcdGFzc2V0R3JvdXAubG9hZFJlc291cmNlKHNrZXRjaCk7XHJcblx0XHRyZXR1cm47XHJcblx0fVxyXG5cdE9iamVjdC5lbnRyaWVzKGFzc2V0R3JvdXApLmZvckVhY2goYXNzZXQgPT4ge1xyXG5cdFx0c2VhcmNoR3JvdXAoYXNzZXRbMV0sIHNrZXRjaCk7XHJcblx0fSk7XHJcbn1cclxuIiwiaW1wb3J0IFA1IGZyb20gJ3A1JztcclxuaW1wb3J0IHsgUmVzb3VyY2UgfSBmcm9tICcuL1Jlc291cmNlJztcclxuXHJcbmV4cG9ydCBjbGFzcyBBdWRpb1Jlc291cmNlIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gICAgLy8gc291bmQ6IEF1ZGlvVHlwZVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBhdGg6IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKHBhdGgpO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWRSZXNvdXJjZShnYW1lOiBQNSkge1xyXG4gICAgICAgIC8vIHRoaXMuc291bmQgPSBBdWRpbyh7XHJcbiAgICAgICAgLy8gICAgIGZpbGU6IHRoaXMucGF0aCxcclxuICAgICAgICAvLyAgICAgbG9vcDogZmFsc2UsXHJcbiAgICAgICAgLy8gICAgIHZvbHVtZTogMS4wLFxyXG4gICAgICAgIC8vIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHBsYXlSYW5kb20oKSB7XHJcbiAgICAvLyAgICAgLy8gVmVyaWZ5IHRoYXQgdGhlIHNvdW5kIGhhcyBiZWVuIGxvYWRlZFxyXG4gICAgLy8gICAgIGlmICh0aGlzLnNvdW5kID09PSB1bmRlZmluZWQpXHJcbiAgICAvLyAgICAgICAgIHRocm93IG5ldyBFcnJvcihcclxuICAgIC8vICAgICAgICAgICAgIGBUcmllZCB0byBwbGF5IHNvdW5kIGJlZm9yZSBsb2FkaW5nIGl0OiAke3RoaXMucGF0aH1gXHJcbiAgICAvLyAgICAgICAgICk7XHJcblxyXG4gICAgLy8gICAgIHRoaXMuc291bmQucGxheSgpO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIHBsYXlTb3VuZCgpIHsvLyBwbGF5IHRoZSBzb3VuZFxyXG4gICAgICAgIC8vVmVyaWZ5IHRoYXQgdGhlIHNvdW5kIGhhcyBiZWVuIGxvYWRlZFxyXG4gICAgICAgIC8vIGlmICh0aGlzLnNvdW5kID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgLy8gICAgIHRocm93IG5ldyBFcnJvcihcclxuICAgICAgICAvLyAgICAgICAgIGBUcmllZCB0byBwbGF5IHNvdW5kIGJlZm9yZSBsb2FkaW5nIGl0OiAke3RoaXMucGF0aH1gXHJcbiAgICAgICAgLy8gICAgICk7XHJcbiAgICAgICAgLy8gdGhpcy5zb3VuZC5wYXVzZSgpO1xyXG4gICAgICAgIC8vIHRoaXMuc291bmQucGxheSgpO1xyXG4gICAgfVxyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBBdWRpb1Jlc291cmNlIH0gZnJvbSAnLi9BdWRpb1Jlc291cmNlJztcclxuaW1wb3J0IFA1IGZyb20gXCJwNVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEF1ZGlvUmVzb3VyY2VHcm91cCB7XHJcblxyXG4gICAgc291bmRzOiBBdWRpb1Jlc291cmNlW11cclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihzb3VuZHM6IEF1ZGlvUmVzb3VyY2VbXSkgey8vIHBhc3MgaW4gYW4gYXJyYXkgb2YgQXVkaW9SZXNvdXJjZXMgdGhhdCBhcmUgYWxsIHNpbWlsYXJcclxuICAgICAgICB0aGlzLnNvdW5kcyA9IHNvdW5kcztcclxuICAgIH1cclxuXHJcbiAgICBwbGF5UmFuZG9tKCkgey8vIHBsYXkgYSByYW5kb20gc291bmRcclxuICAgICAgICBpZih0aGlzLnNvdW5kcyA9PT0gdW5kZWZpbmVkIHx8IHRoaXMuc291bmRzLmxlbmd0aCA9PT0gMClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxyXG4gICAgICAgICAgICAgICAgYFRoZXJlIGFyZSBubyBzb3VuZHM6ICR7dGhpcy5zb3VuZHN9YFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIGNvbnN0IHIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0aGlzLnNvdW5kcy5sZW5ndGgpO1xyXG4gICAgICAgIHRoaXMuc291bmRzW3JdLnBsYXlTb3VuZCgpOy8vIHBsYXkgYSByYW5kb20gc291bmQgZnJvbSB0aGUgYXJyYXkgYXQgYSBzbGlnaHRseSByYW5kb21pemVkIHBpdGNoLCBsZWFkaW5nIHRvIHRoZSBlZmZlY3Qgb2YgaXQgbWFraW5nIGEgbmV3IHNvdW5kIGVhY2ggdGltZSwgcmVtb3ZpbmcgcmVwZXRpdGl2ZW5lc3NcclxuXHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IHsgSW1hZ2VSZXNvdXJjZSB9IGZyb20gJy4vSW1hZ2VSZXNvdXJjZSc7XHJcbmltcG9ydCBwNSBmcm9tICdwNSc7XHJcbmltcG9ydCB7IGdhbWUgfSBmcm9tICcuLi8uLi9HYW1lJztcclxuXHJcbmV4cG9ydCBjbGFzcyBGb250UmVzb3VyY2UgZXh0ZW5kcyBJbWFnZVJlc291cmNlIHtcclxuXHJcbiAgICBhbHBoYWJldF9zb3VwOiB7W2xldHRlcjogc3RyaW5nXToge3g6IG51bWJlciwgeTogbnVtYmVyLCB3OiBudW1iZXIsIGg6IG51bWJlcn19ID0ge31cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwYXRoOiBzdHJpbmcsIGNoYXJhY3RlckRhdGE6IHtbbGV0dGVyOiBzdHJpbmddOiBudW1iZXJ9LCBjaGFyYWN0ZXJPcmRlcjogc3RyaW5nLCBmb250SGVpZ2h0OiBudW1iZXIpIHtcclxuICAgICAgICBzdXBlcihwYXRoKTtcclxuICAgICAgICBsZXQgcnVubmluZ1RvdGFsID0gMFxyXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGk8Y2hhcmFjdGVyT3JkZXIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5hbHBoYWJldF9zb3VwW2NoYXJhY3Rlck9yZGVyW2ldXSA9IHt4OiBydW5uaW5nVG90YWwsIHk6IDAsIHc6IGNoYXJhY3RlckRhdGFbY2hhcmFjdGVyT3JkZXJbaV1dLCBoOiBmb250SGVpZ2h0fVxyXG4gICAgICAgICAgICBydW5uaW5nVG90YWwgKz0gY2hhcmFjdGVyRGF0YVtjaGFyYWN0ZXJPcmRlcltpXV0gKyAxXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGNoYXJhY3Rlck9yZGVyW2ldK1wiOiBcIitjaGFyYWN0ZXJEYXRhW2NoYXJhY3Rlck9yZGVyW2ldXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGRyYXdUZXh0KHRhcmdldDogcDUsIHN0cjogc3RyaW5nLCB4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG4gICAgICAgIGxldCB4T2Zmc2V0OiBudW1iZXIgPSAwO1xyXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGk8c3RyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVuZGVyUGFydGlhbCh0YXJnZXQsIHgreE9mZnNldCpnYW1lLnVwc2NhbGVTaXplLCB5LCB0aGlzLmFscGhhYmV0X3NvdXBbc3RyW2ldXS53KmdhbWUudXBzY2FsZVNpemUsIHRoaXMuYWxwaGFiZXRfc291cFtzdHJbaV1dLmgqZ2FtZS51cHNjYWxlU2l6ZSwgdGhpcy5hbHBoYWJldF9zb3VwW3N0cltpXV0ueCwgdGhpcy5hbHBoYWJldF9zb3VwW3N0cltpXV0ueSwgdGhpcy5hbHBoYWJldF9zb3VwW3N0cltpXV0udywgdGhpcy5hbHBoYWJldF9zb3VwW3N0cltpXV0uaCk7XHJcbiAgICAgICAgICAgIHhPZmZzZXQgKz0gdGhpcy5hbHBoYWJldF9zb3VwW3N0cltpXV0udysxO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImltcG9ydCBQNSBmcm9tICdwNSc7XHJcbmltcG9ydCB7IFJlc291cmNlIH0gZnJvbSAnLi9SZXNvdXJjZSc7XHJcblxyXG5leHBvcnQgY2xhc3MgSW1hZ2VSZXNvdXJjZSBleHRlbmRzIFJlc291cmNlIHtcclxuICAgIGltYWdlOiBQNS5JbWFnZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwYXRoOiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcihwYXRoKTtcclxuICAgIH1cclxuXHJcbiAgICBsb2FkUmVzb3VyY2UoZ2FtZTogUDUpIHtcclxuICAgICAgICB0aGlzLmltYWdlID0gZ2FtZS5sb2FkSW1hZ2UodGhpcy5wYXRoKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIodGFyZ2V0OiBhbnksIHg6IG51bWJlciwgeTogbnVtYmVyLCB3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcikge1xyXG4gICAgICAgIC8vIFZlcmlmeSB0aGF0IHRoZSB0aWxlcyBoYXMgYmVlbiBsb2FkZWRcclxuICAgICAgICBpZiAodGhpcy5pbWFnZSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAgICAgICAgICAgICBgVHJpZWQgdG8gcmVuZGVyIGltYWdlIGJlZm9yZSBsb2FkaW5nIGl0OiAke3RoaXMucGF0aH1gXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIC8vIERyYXcgbm9uIHRpbGVzIGltYWdlXHJcbiAgICAgICAgdGFyZ2V0LmltYWdlKHRoaXMuaW1hZ2UsIHgsIHksIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICByZW5kZXJQYXJ0aWFsKFxyXG4gICAgICAgIHRhcmdldDogYW55LFxyXG4gICAgICAgIHg6IG51bWJlcixcclxuICAgICAgICB5OiBudW1iZXIsXHJcbiAgICAgICAgd2lkdGg6IG51bWJlcixcclxuICAgICAgICBoZWlnaHQ6IG51bWJlcixcclxuICAgICAgICBzb3VyY2VYPzogbnVtYmVyLFxyXG4gICAgICAgIHNvdXJjZVk/OiBudW1iZXIsXHJcbiAgICAgICAgc291cmNlV2lkdGg/OiBudW1iZXIsXHJcbiAgICAgICAgc291cmNlSGVpZ2h0PzogbnVtYmVyXHJcbiAgICApIHtcclxuICAgICAgICAvLyBWZXJpZnkgdGhhdCB0aGUgdGlsZXMgaGFzIGJlZW4gbG9hZGVkXHJcbiAgICAgICAgaWYgKHRoaXMuaW1hZ2UgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxyXG4gICAgICAgICAgICAgICAgYFRyaWVkIHRvIHJlbmRlciBpbWFnZSBiZWZvcmUgbG9hZGluZyBpdDogJHt0aGlzLnBhdGh9YFxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAvLyBEcmF3IGEgcGFydGlhbCBwYXJ0IG9mIHRoZSBpbWFnZVxyXG4gICAgICAgIHRhcmdldC5pbWFnZShcclxuICAgICAgICAgICAgdGhpcy5pbWFnZSxcclxuICAgICAgICAgICAgeCxcclxuICAgICAgICAgICAgeSxcclxuICAgICAgICAgICAgd2lkdGgsXHJcbiAgICAgICAgICAgIGhlaWdodCxcclxuICAgICAgICAgICAgc291cmNlWCxcclxuICAgICAgICAgICAgc291cmNlWSxcclxuICAgICAgICAgICAgc291cmNlV2lkdGgsXHJcbiAgICAgICAgICAgIHNvdXJjZUhlaWdodFxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgUmVzb3VyY2UgfSBmcm9tIFwiLi9SZXNvdXJjZVwiO1xyXG5pbXBvcnQgUDUgZnJvbSAncDUnO1xyXG5pbXBvcnQgeyBnYW1lIH0gZnJvbSAnLi4vLi4vR2FtZSc7XHJcbmltcG9ydCB7IFRpbGVUeXBlIH0gZnJvbSBcIi4uLy4uLy4uL2dsb2JhbC9UaWxlXCJcclxuaW1wb3J0IHsgV29ybGRUaWxlcyB9IGZyb20gXCIuLi8uLi93b3JsZC9Xb3JsZFRpbGVzXCI7XHJcbmltcG9ydCBwNSBmcm9tIFwicDVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBSZWZsZWN0YWJsZUltYWdlUmVzb3VyY2UgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcblxyXG4gICAgaW1hZ2U6IFA1LkltYWdlO1xyXG4gICAgaGFzUmVmbGVjdGlvbjogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcmVmbGVjdGlvbjogUDUuSW1hZ2U7XHJcbiAgICByZWZsZWN0aXZpdHlBcnJheTogbnVtYmVyW10gPSBbMCwgOTAsIDE1MCwgMCwgMTAsIDE1LCAxNywgMTksIDIxLCAyMywgMjUsIDI3LCAyOSwgMzEsIDEwLCAxNywgMjEsIDI1LCAyOSwgNSwgNSwgNSwgNSwgNSwgNSwgNSwgNSwgNSwgNV07XHJcbiAgICBzY2FyZkNvbG9yMT86IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdXHJcbiAgICBzY2FyZkNvbG9yMj86IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdXHJcblxyXG4gICAgY29uc3RydWN0b3IocGF0aDogc3RyaW5nLCBzY2FyZkNvbG9yMT86IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdLCBzY2FyZkNvbG9yMj86IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdKSB7XHJcbiAgICAgICAgc3VwZXIocGF0aClcclxuICAgICAgICB0aGlzLnNjYXJmQ29sb3IxID0gc2NhcmZDb2xvcjE7XHJcbiAgICAgICAgdGhpcy5zY2FyZkNvbG9yMiA9IHNjYXJmQ29sb3IyO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWRSZXNvdXJjZShnYW1lOiBQNSkge1xyXG4gICAgICAgIHRoaXMuaW1hZ2UgPSBnYW1lLmxvYWRJbWFnZSh0aGlzLnBhdGgsICgpPT57XHJcbiAgICAgICAgICAgIGlmKHRoaXMuc2NhcmZDb2xvcjEhPXVuZGVmaW5lZCAmJiB0aGlzLnNjYXJmQ29sb3IyIT11bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW1hZ2UubG9hZFBpeGVscygpO1xyXG4gICAgICAgICAgICAgICAgZm9yKGxldCBpID0gMDsgaTx0aGlzLmltYWdlLndpZHRoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IobGV0IGogPSAwOyBqPHRoaXMuaW1hZ2UuaGVpZ2h0OyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHAgPSB0aGlzLmltYWdlLmdldChpLCBqKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYocFswXSA9PT0gMTY2KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiY29sb3IxXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmltYWdlLnNldChpLCBqLCB0aGlzLnNjYXJmQ29sb3IxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmKHBbMF0gPT09IDE1NSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImNvbG9yMlwiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbWFnZS5zZXQoaSwgaiwgdGhpcy5zY2FyZkNvbG9yMik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSh0aGlzLmltYWdlLnNldChpLCBqLCBwKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy90aGlzLmltYWdlLnNldCgzLCAxMCwgWzAsIDI1NSwgMCwgMjU1XSk7Ly90ZXN0IHBpeGVsXHJcbiAgICAgICAgICAgICAgICB0aGlzLmltYWdlLnVwZGF0ZVBpeGVscygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMubG9hZFJlZmxlY3Rpb24oZ2FtZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZFJlZmxlY3Rpb24oZ2FtZTogUDUpIHtcclxuICAgICAgICBpZighdGhpcy5oYXNSZWZsZWN0aW9uKSB7Ly90aGlzIGlzIHNvIGl0IGRvZXNuJ3QgbG9hZCB0aGVtIGFsbCBhdCBvbmNlIGFuZCBpbnN0ZWFkIG1ha2VzIHRoZSByZWZsZWN0aW9ucyB3aGVuIHRoZXkgYXJlIG5lZWRlZFxyXG4gICAgICAgICAgICB0aGlzLmhhc1JlZmxlY3Rpb24gPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLnJlZmxlY3Rpb24gPSBnYW1lLmNyZWF0ZUltYWdlKHRoaXMuaW1hZ2Uud2lkdGgsIHRoaXMuaW1hZ2UuaGVpZ2h0KTtcclxuICAgICAgICAgICAgdGhpcy5pbWFnZS5sb2FkUGl4ZWxzKCk7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2codGhpcy5pbWFnZS5waXhlbHMpXHJcbiAgICAgICAgICAgIHRoaXMucmVmbGVjdGlvbi5sb2FkUGl4ZWxzKCk7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaSA9IDA7IGk8dGhpcy5yZWZsZWN0aW9uLndpZHRoOyBpKyspIHsvL2dlbmVyYXRlIGEgcmVmbGVjdGlvbiBpbWFnZSB0aGF0IGlzIGRpc3BsYXllZCBhcyBhIHJlZmxlY3Rpb25cclxuICAgICAgICAgICAgICAgIGZvcihsZXQgaiA9IDA7IGo8dGhpcy5yZWZsZWN0aW9uLmhlaWdodDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yKGxldCBrID0gMDsgazwzOyBrKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWZsZWN0aW9uLnBpeGVsc1s0KihqKnRoaXMucmVmbGVjdGlvbi53aWR0aCtpKStrXSA9IHRoaXMuaW1hZ2UucGl4ZWxzWzQqKCh0aGlzLmltYWdlLmhlaWdodC1qLTEpKnRoaXMuaW1hZ2Uud2lkdGgraSkra107XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVmbGVjdGlvbi5waXhlbHNbNCooaip0aGlzLnJlZmxlY3Rpb24ud2lkdGgraSkrM10gPSBcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmltYWdlLnBpeGVsc1s0KigodGhpcy5pbWFnZS5oZWlnaHQtai0xKSp0aGlzLmltYWdlLndpZHRoK2kpKzNdICogXHJcbiAgICAgICAgICAgICAgICAgICAgKCh0aGlzLnJlZmxlY3Rpb24uaGVpZ2h0LWopL3RoaXMucmVmbGVjdGlvbi5oZWlnaHQpICogXHJcbiAgICAgICAgICAgICAgICAgICAgKHRoaXMucmVmbGVjdGlvbi53aWR0aC8yKzAuNS1NYXRoLmFicyhpLXRoaXMucmVmbGVjdGlvbi53aWR0aC8yKzAuNSkpLyh0aGlzLnJlZmxlY3Rpb24ud2lkdGgvMik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5yZWZsZWN0aW9uLnVwZGF0ZVBpeGVscygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIodGFyZ2V0OiBhbnksIHg6IG51bWJlciwgeTogbnVtYmVyLCB3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcikge1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coV29ybGRUaWxlcyk7XHJcbiAgICAgICAgLy8gVmVyaWZ5IHRoYXQgdGhlIGltYWdlIGhhcyBiZWVuIGxvYWRlZFxyXG4gICAgICAgIGlmICh0aGlzLmltYWdlID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcclxuICAgICAgICAgICAgICAgIGBUcmllZCB0byByZW5kZXIgaW1hZ2UgYmVmb3JlIGxvYWRpbmcgaXQ6ICR7dGhpcy5wYXRofWBcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgLy8gRHJhdyBub24gdGlsZXMgaW1hZ2VcclxuICAgICAgICB0YXJnZXQuaW1hZ2UodGhpcy5pbWFnZSwgeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHJlbmRlcldvcmxkc3BhY2VSZWZsZWN0aW9uKHg6IG51bWJlciwgeTogbnVtYmVyLCB3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcikge1xyXG4gICAgICAgIGlmICh0aGlzLmltYWdlID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcclxuICAgICAgICAgICAgICAgIGBUcmllZCB0byByZW5kZXIgcmVmbGVjdGlvbiBvZiBpbWFnZSBiZWZvcmUgbG9hZGluZyBpdDogJHt0aGlzLnBhdGh9YFxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuaGFzUmVmbGVjdGlvbilcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGdhbWUuZmlsbCgyNTUsIDAsIDApO1xyXG4gICAgICAgIGdhbWUuc3Ryb2tlKDE1MCwgMCwgMCk7XHJcblxyXG4gICAgICAgIC8vbG9vcCB0aHJvdWdoIGV2ZXJ5IHRpbGUgaXQgcGFzc2VzIHRocm91Z2hcclxuICAgICAgICBmb3IobGV0IGkgPSBNYXRoLmZsb29yKHgpOyBpPHgrd2lkdGg7IGkrKykge1xyXG4gICAgICAgICAgICBmb3IobGV0IGogPSBNYXRoLmZsb29yKHkpOyBqPHkraGVpZ2h0OyBqKyspIHtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHRhcmdldC53b3JsZC53b3JsZFRpbGVzKTtcclxuICAgICAgICAgICAgICAgIGxldCBjdXJyZW50QmxvY2s6IFRpbGVUeXBlIHwgc3RyaW5nID0gZ2FtZS53b3JsZC53b3JsZFRpbGVzW2ogKiBnYW1lLndvcmxkV2lkdGggKyBpXTtcclxuICAgICAgICAgICAgICAgIGlmKGN1cnJlbnRCbG9jayA9PT0gdW5kZWZpbmVkIHx8IHR5cGVvZiBjdXJyZW50QmxvY2sgPT09IFwic3RyaW5nXCIgfHwgY3VycmVudEJsb2NrID09IFRpbGVUeXBlLkFpcikgey8vdGhlIHJlZmVyZW5jZSB0byBUaWxlRW50aXR5IGNhbiBiZSByZW1vdmVkIGFzIHNvb24gYXMgdGhlIGJldHRlciBzeXN0ZW0gaXMgaW4gcGxhY2VcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGdhbWUuZHJhd2luZ0NvbnRleHQuZ2xvYmFsQWxwaGEgPSB0aGlzLnJlZmxlY3Rpdml0eUFycmF5W2N1cnJlbnRCbG9ja10vMjU1Oy8vVE9ETyBtYWtlIHRoaXMgYmFzZWQgb24gdGhlIHRpbGUgcmVmbGVjdGl2aXR5XHJcbiAgICAgICAgICAgICAgICBnYW1lLmltYWdlKFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVmbGVjdGlvbixcclxuICAgICAgICAgICAgICAgICAgICAoaSAqIGdhbWUuVElMRV9XSURUSCAtXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdhbWUuaW50ZXJwb2xhdGVkQ2FtWCAqIGdhbWUuVElMRV9XSURUSCkgKlxyXG4gICAgICAgICAgICAgICAgICAgIGdhbWUudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIChqICogZ2FtZS5USUxFX0hFSUdIVCAtXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnYW1lLmludGVycG9sYXRlZENhbVkgKiBnYW1lLlRJTEVfSEVJR0hUKSAqXHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICBnYW1lLlRJTEVfV0lEVEgqZ2FtZS51cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICBnYW1lLlRJTEVfSEVJR0hUKmdhbWUudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgICAgICAgICAgKGkteCkqZ2FtZS5USUxFX1dJRFRILFxyXG4gICAgICAgICAgICAgICAgICAgIChqLXkpKmdhbWUuVElMRV9IRUlHSFQsXHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS5USUxFX1dJRFRILFxyXG4gICAgICAgICAgICAgICAgICAgIGdhbWUuVElMRV9IRUlHSFRcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICBnYW1lLmRyYXdpbmdDb250ZXh0Lmdsb2JhbEFscGhhID0gMS4wO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlclBhcnRpYWwoXHJcbiAgICAgICAgdGFyZ2V0OiBhbnksXHJcbiAgICAgICAgeDogbnVtYmVyLFxyXG4gICAgICAgIHk6IG51bWJlcixcclxuICAgICAgICB3aWR0aDogbnVtYmVyLFxyXG4gICAgICAgIGhlaWdodDogbnVtYmVyLFxyXG4gICAgICAgIHNvdXJjZVg/OiBudW1iZXIsXHJcbiAgICAgICAgc291cmNlWT86IG51bWJlcixcclxuICAgICAgICBzb3VyY2VXaWR0aD86IG51bWJlcixcclxuICAgICAgICBzb3VyY2VIZWlnaHQ/OiBudW1iZXJcclxuICAgICkge1xyXG4gICAgICAgIC8vIFZlcmlmeSB0aGF0IHRoZSB0aWxlcyBoYXMgYmVlbiBsb2FkZWRcclxuICAgICAgICBpZiAodGhpcy5pbWFnZSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAgICAgICAgICAgICBgVHJpZWQgdG8gcmVuZGVyIGltYWdlIGJlZm9yZSBsb2FkaW5nIGl0OiAke3RoaXMucGF0aH1gXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIC8vIERyYXcgYSBwYXJ0aWFsIHBhcnQgb2YgdGhlIGltYWdlXHJcbiAgICAgICAgdGFyZ2V0LmltYWdlKFxyXG4gICAgICAgICAgICB0aGlzLmltYWdlLFxyXG4gICAgICAgICAgICB4LFxyXG4gICAgICAgICAgICB5LFxyXG4gICAgICAgICAgICB3aWR0aCxcclxuICAgICAgICAgICAgaGVpZ2h0LFxyXG4gICAgICAgICAgICBzb3VyY2VYLFxyXG4gICAgICAgICAgICBzb3VyY2VZLFxyXG4gICAgICAgICAgICBzb3VyY2VXaWR0aCxcclxuICAgICAgICAgICAgc291cmNlSGVpZ2h0XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufSIsImltcG9ydCBQNSBmcm9tICdwNSc7XHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUmVzb3VyY2Uge1xyXG4gICAgcGF0aDogc3RyaW5nO1xyXG5cclxuICAgIHByb3RlY3RlZCBjb25zdHJ1Y3RvcihwYXRoOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLnBhdGggPSBwYXRoO1xyXG4gICAgfVxyXG5cclxuICAgIGFic3RyYWN0IGxvYWRSZXNvdXJjZShza2V0Y2g6IFA1KTogdm9pZDtcclxufVxyXG4iLCJpbXBvcnQgeyBJbWFnZVJlc291cmNlIH0gZnJvbSAnLi9JbWFnZVJlc291cmNlJztcclxuXHJcbmV4cG9ydCBjbGFzcyBUaWxlUmVzb3VyY2UgZXh0ZW5kcyBJbWFnZVJlc291cmNlIHtcclxuICAgIC8vIFRoZSB3aWR0aCBhbmQgaGVpZ2h0IG9mIHRoZSB0aWxlcyBzZXRcclxuICAgIHdpZHRoOiBudW1iZXI7XHJcbiAgICBoZWlnaHQ6IG51bWJlcjtcclxuXHJcbiAgICAvLyBUaGUgd2lkdGggYW5kIGhlaWdodCBvZiBlYWNoIHRpbGVzIGluIHBpeGVsc1xyXG4gICAgdGlsZVdpZHRoOiBudW1iZXI7XHJcbiAgICB0aWxlSGVpZ2h0OiBudW1iZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcGF0aDogc3RyaW5nLFxyXG4gICAgICAgIHdpZHRoOiBudW1iZXIsXHJcbiAgICAgICAgaGVpZ2h0OiBudW1iZXIsXHJcbiAgICAgICAgdGlsZVdpZHRoOiBudW1iZXIsXHJcbiAgICAgICAgdGlsZUhlaWdodDogbnVtYmVyXHJcbiAgICApIHtcclxuICAgICAgICBzdXBlcihwYXRoKTtcclxuICAgICAgICB0aGlzLndpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICAgICAgdGhpcy50aWxlV2lkdGggPSB0aWxlV2lkdGg7XHJcbiAgICAgICAgdGhpcy50aWxlSGVpZ2h0ID0gdGlsZUhlaWdodDtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXJUaWxlKFxyXG4gICAgICAgIGk6IG51bWJlcixcclxuICAgICAgICB0YXJnZXQ6IGFueSxcclxuICAgICAgICB4OiBudW1iZXIsXHJcbiAgICAgICAgeTogbnVtYmVyLFxyXG4gICAgICAgIHdpZHRoOiBudW1iZXIsXHJcbiAgICAgICAgaGVpZ2h0OiBudW1iZXJcclxuICAgICkge1xyXG4gICAgICAgIGNvbnN0IHRpbGVTZXRYID0gaSAlIHRoaXMud2lkdGg7XHJcbiAgICAgICAgY29uc3QgdGlsZVNldFkgPSBNYXRoLmZsb29yKGkgLyB0aGlzLndpZHRoKTtcclxuXHJcbiAgICAgICAgLy8gTWFrZSBzdXJlIHRoZSB0aWxlcyBpc24ndCBvdXQgb2YgYm91bmRzXHJcbiAgICAgICAgaWYgKHRpbGVTZXRZID4gdGhpcy5oZWlnaHQpXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcclxuICAgICAgICAgICAgICAgIGBPdXQgb2YgYm91bmRzIHRpbGUuIFRyaWVkIHRvIHJlbmRlciB0aWxlIGluZGV4ICR7aX0gd2l0aCBhIG1heGltdW0gb2YgJHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLndpZHRoICogdGhpcy5oZWlnaHRcclxuICAgICAgICAgICAgICAgIH0gdGlsZXNgXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIHN1cGVyLnJlbmRlclBhcnRpYWwoXHJcbiAgICAgICAgICAgIHRhcmdldCxcclxuICAgICAgICAgICAgeCxcclxuICAgICAgICAgICAgeSxcclxuICAgICAgICAgICAgd2lkdGgsXHJcbiAgICAgICAgICAgIGhlaWdodCxcclxuICAgICAgICAgICAgdGlsZVNldFggKiB0aGlzLnRpbGVXaWR0aCxcclxuICAgICAgICAgICAgdGlsZVNldFkgKiB0aGlzLnRpbGVIZWlnaHQsXHJcbiAgICAgICAgICAgIHRoaXMudGlsZVdpZHRoLFxyXG4gICAgICAgICAgICB0aGlzLnRpbGVIZWlnaHRcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFRpbGVBdENvb3JkaW5hdGUoXHJcbiAgICAgICAgeDogbnVtYmVyLFxyXG4gICAgICAgIHk6IG51bWJlcixcclxuICAgICAgICB0YXJnZXQ6IGFueSxcclxuICAgICAgICB4UG9zOiBudW1iZXIsXHJcbiAgICAgICAgeVBvczogbnVtYmVyLFxyXG4gICAgICAgIHdpZHRoOiBudW1iZXIsXHJcbiAgICAgICAgaGVpZ2h0OiBudW1iZXJcclxuICAgICkge1xyXG4gICAgICAgIGlmICh4ID4gdGhpcy53aWR0aCB8fCB5ID4gdGhpcy5oZWlnaHQgfHwgeCA8IDAgfHwgeSA8IDApXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcclxuICAgICAgICAgICAgICAgIGBPdXQgb2YgYm91bmRzIHRpbGUuIFRyaWVkIHRvIGxvYWQgdGlsZSBhdCAke3h9LCAke3l9IG9uIGEgJHt0aGlzLndpZHRofSwgJHt0aGlzLmhlaWdodH0gZ3JpZGBcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgc3VwZXIucmVuZGVyUGFydGlhbChcclxuICAgICAgICAgICAgdGFyZ2V0LFxyXG4gICAgICAgICAgICB4UG9zLFxyXG4gICAgICAgICAgICB5UG9zLFxyXG4gICAgICAgICAgICB3aWR0aCxcclxuICAgICAgICAgICAgaGVpZ2h0LFxyXG4gICAgICAgICAgICB4ICogdGhpcy50aWxlV2lkdGgsXHJcbiAgICAgICAgICAgIHkgKiB0aGlzLnRpbGVIZWlnaHQsXHJcbiAgICAgICAgICAgIHRoaXMudGlsZVdpZHRoLFxyXG4gICAgICAgICAgICB0aGlzLnRpbGVIZWlnaHRcclxuICAgICAgICApO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGNsYXNzIENvbnRyb2wge1xyXG4gICAga2V5Ym9hcmQ6IGJvb2xlYW5cclxuICAgIGtleUNvZGU6IG51bWJlclxyXG4gICAgZGVzY3JpcHRpb246IHN0cmluZ1xyXG4gICAgb25QcmVzc2VkOiAoKSA9PiB2b2lkXHJcbiAgICBvblJlbGVhc2VkOiAoKSA9PiB2b2lkXHJcblxyXG4gICAgY29uc3RydWN0b3IoZGVzY3JpcHRpb246IHN0cmluZywga2V5Ym9hcmQ6IGJvb2xlYW4sIGtleUNvZGU6IG51bWJlciwgb25QcmVzc2VkOiAoKSA9PiB2b2lkLCBvblJlbGVhc2VkPzogKCkgPT4gdm9pZCkge1xyXG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvblxyXG4gICAgICAgIHRoaXMua2V5Ym9hcmQgPSBrZXlib2FyZDtcclxuICAgICAgICB0aGlzLmtleUNvZGUgPSBrZXlDb2RlO1xyXG4gICAgICAgIHRoaXMub25QcmVzc2VkID0gb25QcmVzc2VkO1xyXG4gICAgICAgIHRoaXMub25SZWxlYXNlZCA9IG9uUmVsZWFzZWQgfHwgZnVuY3Rpb24oKXt9Oy8vZm9yIHNvbWUgcmVhc29uIGFycm93IGZ1bmN0aW9uIGRvZXNuJ3QgbGlrZSB0byBleGlzdCBoZXJlIGJ1dCBpJ20gbm90IGdvbm5hIHdvcnJ5IHRvbyBtdWNoXHJcbiAgICAgICAgLy9pZiBpdCdzIHRvbyB1Z2x5LCB5b3UgY2FuIHRyeSB0byBmaXggaXRcclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgeyBJbnZlbnRvcnlQYXlsb2FkLCBJdGVtQ2F0ZWdvcmllcywgSXRlbXMsIEl0ZW1TdGFjayB9IGZyb20gJy4uLy4uL2dsb2JhbC9JbnZlbnRvcnknO1xyXG5pbXBvcnQgeyBUaWxlVHlwZSB9IGZyb20gJy4uLy4uL2dsb2JhbC9UaWxlJztcclxuaW1wb3J0IHsgZ2FtZSB9IGZyb20gJy4uL0dhbWUnO1xyXG5pbXBvcnQgeyBDb2xvclBhcnRpY2xlIH0gZnJvbSAnLi4vd29ybGQvcGFydGljbGVzL0NvbG9yUGFydGljbGUnO1xyXG5pbXBvcnQgeyBXb3JsZFRpbGVzIH0gZnJvbSAnLi4vd29ybGQvV29ybGRUaWxlcyc7XHJcblxyXG5leHBvcnQgY2xhc3MgSW52ZW50b3J5IHtcclxuXHJcblx0aXRlbXM6IChJdGVtU3RhY2sgfCB1bmRlZmluZWQgfCBudWxsKVtdO1xyXG5cclxuXHR3aWR0aDogbnVtYmVyO1xyXG5cdGhlaWdodDogbnVtYmVyO1xyXG5cclxuXHRzZWxlY3RlZFNsb3Q6IG51bWJlciA9IDBcclxuXHRwaWNrZWRVcFNsb3Q6IG51bWJlciB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZFxyXG5cclxuXHRjb25zdHJ1Y3RvcihpbnZlbnRvcnk6IEludmVudG9yeVBheWxvYWQpIHtcclxuXHRcdHRoaXMuaXRlbXMgPSBpbnZlbnRvcnkuaXRlbXNcclxuXHRcdHRoaXMud2lkdGggPSBpbnZlbnRvcnkud2lkdGhcclxuXHRcdHRoaXMuaGVpZ2h0ID0gaW52ZW50b3J5LmhlaWdodFxyXG5cdH1cclxuXHJcblx0d29ybGRDbGljayh4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG5cdFx0Y29uc3Qgc2VsZWN0ZWRJdGVtID0gdGhpcy5pdGVtc1t0aGlzLnNlbGVjdGVkU2xvdF1cclxuXHRcdGlmKHNlbGVjdGVkSXRlbSA9PT0gdW5kZWZpbmVkIHx8IHNlbGVjdGVkSXRlbSA9PT0gbnVsbCkge1xyXG5cdFx0XHQvL2NvbnNvbGUuZXJyb3IoXCJCcmVha2luZyB0aWxlXCIpXHJcblx0XHRcdGxldCB0aWxlQmVpbmdCcm9rZW4gPSBnYW1lLndvcmxkLndvcmxkVGlsZXNbZ2FtZS53b3JsZC53aWR0aCAqIHkgKyB4XTtcclxuXHRcdFx0aWYodHlwZW9mIHRpbGVCZWluZ0Jyb2tlbiA9PT0gJ251bWJlcicpIHtcclxuXHRcdFx0XHRsZXQgd29ybGRUaWxlQmVpbmdCcm9rZW4gPSBXb3JsZFRpbGVzW3RpbGVCZWluZ0Jyb2tlbl1cclxuXHRcdFx0XHRmb3IobGV0IGkgPSAwOyBpPDUqZ2FtZS5wYXJ0aWNsZU11bHRpcGxpZXI7IGkrKykge1xyXG5cdFx0XHRcdFx0aWYgKHdvcmxkVGlsZUJlaW5nQnJva2VuICE9PSB1bmRlZmluZWQpXHJcblx0XHRcdFx0XHRnYW1lLnBhcnRpY2xlcy5wdXNoKG5ldyBDb2xvclBhcnRpY2xlKHdvcmxkVGlsZUJlaW5nQnJva2VuLmNvbG9yLCBNYXRoLnJhbmRvbSgpKjAuMiswLjEsIDEwLCB4K01hdGgucmFuZG9tKCksIHkrTWF0aC5yYW5kb20oKSwgMC4yKihNYXRoLnJhbmRvbSgpLTAuNSksIC0wLjE1Kk1hdGgucmFuZG9tKCkpKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRnYW1lLmNvbm5lY3Rpb24uZW1pdChcclxuXHRcdFx0XHQnd29ybGRCcmVha1N0YXJ0JyxcclxuXHRcdFx0XHRnYW1lLndvcmxkLndpZHRoICogeSArIHhcclxuXHRcdFx0KTtcclxuXHRcdFx0Z2FtZS5jb25uZWN0aW9uLmVtaXQoJ3dvcmxkQnJlYWtGaW5pc2gnKTtcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3Qgd29ybGRDbGljayA9IEl0ZW1BY3Rpb25zW0l0ZW1zW3NlbGVjdGVkSXRlbS5pdGVtXS50eXBlXS53b3JsZENsaWNrXHJcblx0XHRpZih3b3JsZENsaWNrID09PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0Y29uc29sZS5lcnJvcihcIkNhbm5vdCBwbGFjZSBzZWxlY3RlZCBpdGVtXCIpXHJcblx0XHRcdHJldHVyblxyXG5cdFx0fVxyXG5cclxuXHRcdHdvcmxkQ2xpY2soeCwgeSlcclxuXHR9XHJcblx0d29ybGRDbGlja0NoZWNrKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcblx0XHRsZXQgdGlsZUJlaW5nQnJva2VuID0gZ2FtZS53b3JsZC53b3JsZFRpbGVzW2dhbWUud29ybGQud2lkdGggKiB5ICsgeF07XHJcblx0XHRpZih0eXBlb2YgdGlsZUJlaW5nQnJva2VuID09PSAnbnVtYmVyJykge1xyXG5cdFx0XHRpZiAodGlsZUJlaW5nQnJva2VuID09PSBUaWxlVHlwZS5BaXIpIGdhbWUuYnJlYWtpbmcgPSBmYWxzZTtcclxuXHRcdFx0ZWxzZSBnYW1lLmJyZWFraW5nID0gdHJ1ZTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmludGVyZmFjZSBJdGVtQmFzZSB7XHJcblx0d29ybGRDbGljaz86ICh4OiBudW1iZXIsIHk6IG51bWJlcikgPT4gdm9pZFxyXG59XHJcblxyXG5jb25zdCBJdGVtQWN0aW9uczogUmVjb3JkPEl0ZW1DYXRlZ29yaWVzLCBJdGVtQmFzZT4gPSB7XHJcblx0W0l0ZW1DYXRlZ29yaWVzLlRpbGVdOiB7XHJcblx0XHR3b3JsZENsaWNrKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcblx0XHRcdC8vIElmIHRoZSB0aWxlIGlzbid0IGFpclxyXG5cdFx0XHRpZiAoXHJcblx0XHRcdFx0Z2FtZS53b3JsZC53b3JsZFRpbGVzW1xyXG5cdFx0XHRcdGdhbWUud29ybGQud2lkdGggKiB5ICsgeFxyXG5cdFx0XHRcdFx0XSAhPT0gVGlsZVR5cGUuQWlyXHJcblx0XHRcdCkge1xyXG5cclxuXHRcdFx0XHRsZXQgdGlsZUJlaW5nQnJva2VuID0gZ2FtZS53b3JsZC53b3JsZFRpbGVzW2dhbWUud29ybGQud2lkdGggKiB5ICsgeF07XHJcblx0XHRcdFx0aWYodHlwZW9mIHRpbGVCZWluZ0Jyb2tlbiA9PT0gJ251bWJlcicpIHsvL3RpbGUgaXMgdGlsZVxyXG5cdFx0XHRcdFx0aWYgKCFnYW1lLmJyZWFraW5nKSByZXR1cm47XHJcblx0XHRcdFx0XHRsZXQgd29ybGRUaWxlQmVpbmdCcm9rZW4gPSBXb3JsZFRpbGVzW3RpbGVCZWluZ0Jyb2tlbl1cclxuXHRcdFx0XHRcdGZvcihsZXQgaSA9IDA7IGk8NSpnYW1lLnBhcnRpY2xlTXVsdGlwbGllcjsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdGlmICh3b3JsZFRpbGVCZWluZ0Jyb2tlbiAhPT0gdW5kZWZpbmVkKVxyXG5cdFx0XHRcdFx0XHRnYW1lLnBhcnRpY2xlcy5wdXNoKG5ldyBDb2xvclBhcnRpY2xlKHdvcmxkVGlsZUJlaW5nQnJva2VuLmNvbG9yLCBNYXRoLnJhbmRvbSgpKjAuMiswLjEsIDEwLCB4K01hdGgucmFuZG9tKCksIHkrTWF0aC5yYW5kb20oKSwgMC4yKihNYXRoLnJhbmRvbSgpLTAuNSksIC0wLjE1Kk1hdGgucmFuZG9tKCkpKVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Y29uc29sZS5pbmZvKCdicmVha2luZycpO1xyXG5cdFx0XHRcdFx0Z2FtZS5jb25uZWN0aW9uLmVtaXQoXHJcblx0XHRcdFx0XHRcdCd3b3JsZEJyZWFrU3RhcnQnLFxyXG5cdFx0XHRcdFx0XHRnYW1lLndvcmxkLndpZHRoICogeSArIHhcclxuXHRcdFx0XHRcdCk7XHJcblx0XHRcdFx0XHRnYW1lLmNvbm5lY3Rpb24uZW1pdChcclxuXHRcdFx0XHRcdFx0J3dvcmxkQnJlYWtGaW5pc2gnXHJcblx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHsvL3RpbGUgaXMgdGlsZSBlbnRpdHlcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwidGlsZSBlbnRpdHkgaW50ZXJhY3RcIilcclxuXHRcdFx0XHRcdGdhbWUuY29ubmVjdGlvbi5lbWl0KFxyXG5cdFx0XHRcdFx0XHQnd29ybGRCcmVha1N0YXJ0JyxcclxuXHRcdFx0XHRcdFx0Z2FtZS53b3JsZC53aWR0aCAqIHkgKyB4XHJcblx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdFx0Z2FtZS5jb25uZWN0aW9uLmVtaXQoXHJcblx0XHRcdFx0XHRcdCd3b3JsZEJyZWFrRmluaXNoJ1xyXG5cdFx0XHRcdFx0KTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0Ly9pZiB0aGUgdGlsZSBpcyBhaXIgYW5kIHRoZSBnYW1lIGlzIHRyeWluZyB0byBwbGFjZVxyXG5cdFx0XHRpZiAoZ2FtZS5icmVha2luZykgcmV0dXJuO1xyXG5cdFx0XHRjb25zb2xlLmluZm8oJ1BsYWNpbmcnKTtcclxuXHRcdFx0Z2FtZS5jb25uZWN0aW9uLmVtaXQoXHJcblx0XHRcdFx0J3dvcmxkUGxhY2UnLFxyXG5cdFx0XHRcdGdhbWUud29ybGQuaW52ZW50b3J5LnNlbGVjdGVkU2xvdCxcclxuXHRcdFx0XHR4LFxyXG5cdFx0XHRcdHlcclxuXHRcdFx0KTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdFtJdGVtQ2F0ZWdvcmllcy5SZXNvdXJjZV06IHt9LFxyXG5cdFtJdGVtQ2F0ZWdvcmllcy5Ub29sXToge30sXHJcblx0W0l0ZW1DYXRlZ29yaWVzLlRpbGVFbnRpdHldOiB7XHJcblx0XHR3b3JsZENsaWNrKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcblx0XHRcdGxldCBpdGVtUmVmID0gSXRlbXNbZ2FtZS53b3JsZC5pbnZlbnRvcnkuaXRlbXNbZ2FtZS53b3JsZC5pbnZlbnRvcnkuc2VsZWN0ZWRTbG90XT8uaXRlbSB8fCAwXTtcclxuXHRcdFx0bGV0IG9mZnNldDogW251bWJlciwgbnVtYmVyXSA9IFswLCAwXVxyXG5cdFx0XHRpZihcInRpbGVFbnRpdHlPZmZzZXRcIiBpbiBpdGVtUmVmKSB7XHJcblx0XHRcdFx0b2Zmc2V0ID0gaXRlbVJlZi50aWxlRW50aXR5T2Zmc2V0O1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRnYW1lLmNvbm5lY3Rpb24uZW1pdChcclxuXHRcdFx0XHQnd29ybGRQbGFjZScsXHJcblx0XHRcdFx0Z2FtZS53b3JsZC5pbnZlbnRvcnkuc2VsZWN0ZWRTbG90LFxyXG5cdFx0XHRcdHgsXHJcblx0XHRcdFx0eVxyXG5cdFx0XHQpO1xyXG5cdFx0fVxyXG5cdH0sXHJcbn0iLCJpbXBvcnQgcDUgZnJvbSAncDUnO1xyXG5pbXBvcnQgeyBFbnRpdGllcywgRW50aXR5UGF5bG9hZCB9IGZyb20gJy4uLy4uL2dsb2JhbC9FbnRpdHknO1xyXG5pbXBvcnQgeyBnYW1lIH0gZnJvbSAnLi4vR2FtZSc7XHJcbmltcG9ydCB7IFNlcnZlckVudGl0eSB9IGZyb20gJy4uL3dvcmxkL2VudGl0aWVzL1NlcnZlckVudGl0eSc7XHJcbi8vIGltcG9ydCB7IENvbG9yUGFydGljbGUgfSBmcm9tICcuLi93b3JsZC8nO1xyXG5pbXBvcnQgeyBBbmltYXRpb25GcmFtZSwgUGxheWVyQW5pbWF0aW9ucyB9IGZyb20gJy4uL2Fzc2V0cy9Bc3NldHMnO1xyXG5pbXBvcnQgeyBUaWxlVHlwZSB9IGZyb20gJy4uLy4uL2dsb2JhbC9UaWxlJztcclxuaW1wb3J0IHsgV29ybGRUaWxlcyB9IGZyb20gJy4uL3dvcmxkL1dvcmxkVGlsZXMnO1xyXG5pbXBvcnQgeyBDb2xvclBhcnRpY2xlIH0gZnJvbSAnLi4vd29ybGQvcGFydGljbGVzL0NvbG9yUGFydGljbGUnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFBsYXllckxvY2FsIGV4dGVuZHMgU2VydmVyRW50aXR5IHtcclxuICAgIC8vIENvbnN0YW50IGRhdGFcclxuICAgIHdpZHRoOiBudW1iZXIgPSAxMiAvIGdhbWUuVElMRV9XSURUSDtcclxuICAgIGhlaWdodDogbnVtYmVyID0gMjggLyBnYW1lLlRJTEVfSEVJR0hUO1xyXG5cclxuICAgIC8vIFNoYXJlZCBkYXRhXHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcblxyXG4gICAgLy8gTG9jYWwgZGF0YVxyXG4gICAgeFZlbDogbnVtYmVyID0gMDtcclxuICAgIHlWZWw6IG51bWJlciA9IDA7XHJcbiAgICBzbGlkZVg6IG51bWJlcjtcclxuICAgIHNsaWRlWTogbnVtYmVyO1xyXG4gICAgaW50ZXJwb2xhdGVkWDogbnVtYmVyO1xyXG4gICAgaW50ZXJwb2xhdGVkWTogbnVtYmVyO1xyXG5cclxuICAgIHBYOiBudW1iZXI7XHJcbiAgICBwWTogbnVtYmVyO1xyXG4gICAgcFhWZWw6IG51bWJlciA9IDA7XHJcbiAgICBwWVZlbDogbnVtYmVyID0gMDtcclxuXHJcbiAgICBncm91bmRlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcEdyb3VuZGVkOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgY29sbGlzaW9uRGF0YTogYW55O1xyXG4gICAgY2xvc2VzdENvbGxpc2lvbjogW251bWJlciwgbnVtYmVyLCBudW1iZXJdO1xyXG5cclxuICAgIG1hc3M6IG51bWJlciA9IHRoaXMud2lkdGggKiB0aGlzLmhlaWdodDtcclxuXHJcblxyXG4gICAgLy9pbnB1dCBib29sZWFuc1xyXG4gICAgcmlnaHRCdXR0b246IGJvb2xlYW47XHJcbiAgICBsZWZ0QnV0dG9uOiBib29sZWFuO1xyXG4gICAganVtcEJ1dHRvbjogYm9vbGVhbjtcclxuXHJcbiAgICBjdXJyZW50QW5pbWF0aW9uOiBBbmltYXRpb25GcmFtZTx0eXBlb2YgUGxheWVyQW5pbWF0aW9ucz4gPSBcImlkbGVcIjtcclxuICAgIGFuaW1GcmFtZTogbnVtYmVyID0gMDtcclxuICAgIHRpbWVJblRoaXNBbmltYXRpb25GcmFtZSA9IDA7XHJcbiAgICBmYWNpbmdSaWdodCA9IHRydWU7XHJcblxyXG4gICAgdG9wQ29sbGlzaW9uOiAodHlwZW9mIFdvcmxkVGlsZXNbVGlsZVR5cGUuQWlyXSkgPSBXb3JsZFRpbGVzW1RpbGVUeXBlLkFpcl07Ly9oYWNreVxyXG4gICAgYm90dG9tQ29sbGlzaW9uOiAodHlwZW9mIFdvcmxkVGlsZXNbVGlsZVR5cGUuQWlyXSkgPSBXb3JsZFRpbGVzW1RpbGVUeXBlLkFpcl07XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgZGF0YTogRW50aXR5UGF5bG9hZDxFbnRpdGllcy5Mb2NhbFBsYXllcj5cclxuICAgICkge1xyXG4gICAgICAgIHN1cGVyKGRhdGEuaWQpXHJcblxyXG4gICAgICAgIHRoaXMubmFtZSA9IGRhdGEuZGF0YS5uYW1lO1xyXG5cclxuICAgICAgICB0aGlzLnggPSBkYXRhLmRhdGEueDtcclxuICAgICAgICB0aGlzLnkgPSBkYXRhLmRhdGEueTtcclxuXHJcbiAgICAgICAgdGhpcy5wWCA9IHRoaXMueDtcclxuICAgICAgICB0aGlzLnBZID0gdGhpcy55O1xyXG5cclxuICAgICAgICB0aGlzLmludGVycG9sYXRlZFggPSB0aGlzLng7XHJcbiAgICAgICAgdGhpcy5pbnRlcnBvbGF0ZWRZID0gdGhpcy55O1xyXG5cclxuICAgICAgICB0aGlzLmNsb3Nlc3RDb2xsaXNpb24gPSBbMSwgMCwgSW5maW5pdHldO1xyXG4gICAgXHJcbiAgICAgICAgdGhpcy5sZWZ0QnV0dG9uID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5yaWdodEJ1dHRvbiA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuanVtcEJ1dHRvbiA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcih0YXJnZXQ6IHA1LCB1cHNjYWxlU2l6ZTogbnVtYmVyKTogdm9pZCB7XHJcblxyXG4gICAgICAgIHRoaXMudGltZUluVGhpc0FuaW1hdGlvbkZyYW1lICs9IGdhbWUuZGVsdGFUaW1lO1xyXG4gICAgICAgIGlmKHRoaXMudGltZUluVGhpc0FuaW1hdGlvbkZyYW1lPlBsYXllckFuaW1hdGlvbnNbdGhpcy5jdXJyZW50QW5pbWF0aW9uXVt0aGlzLmFuaW1GcmFtZV1bMV0pIHtcclxuICAgICAgICAgICAgdGhpcy50aW1lSW5UaGlzQW5pbWF0aW9uRnJhbWUgPSAwOy8vdGhpcyBkb2VzIGludHJvZHVjZSBzb21lIHNsaWdodCBpbmFjY3VyYWNpZXMgdnMgc3VidHJhY3RpbmcgaXQsIGJ1dCwgd2hlbiB5b3UgdGFiIGJhY2sgaW50byB0aGUgYnJvd3NlciBhZnRlciBiZWluZyB0YWJiZWQgb3V0LCBzdWJ0cmFjdGluZyBpdCBjYXVzZXMgc3BhenppbmdcclxuICAgICAgICAgICAgdGhpcy5hbmltRnJhbWUrKztcclxuICAgICAgICAgICAgaWYodGhpcy5hbmltRnJhbWU+PVBsYXllckFuaW1hdGlvbnNbdGhpcy5jdXJyZW50QW5pbWF0aW9uXS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYW5pbUZyYW1lID0gdGhpcy5hbmltRnJhbWUlUGxheWVyQW5pbWF0aW9uc1t0aGlzLmN1cnJlbnRBbmltYXRpb25dLmxlbmd0aDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gdGFyZ2V0LnJlY3QoXHJcbiAgICAgICAgLy8gICAgICh0aGlzLmludGVycG9sYXRlZFggKiBnYW1lLlRJTEVfV0lEVEggLVxyXG4gICAgICAgIC8vICAgICAgICAgZ2FtZS5pbnRlcnBvbGF0ZWRDYW1YICogZ2FtZS5USUxFX1dJRFRIKSAqXHJcbiAgICAgICAgLy8gICAgICAgICB1cHNjYWxlU2l6ZSxcclxuICAgICAgICAvLyAgICAgKHRoaXMuaW50ZXJwb2xhdGVkWSAqIGdhbWUuVElMRV9IRUlHSFQgLVxyXG4gICAgICAgIC8vICAgICAgICAgZ2FtZS5pbnRlcnBvbGF0ZWRDYW1ZICogZ2FtZS5USUxFX0hFSUdIVCkgKlxyXG4gICAgICAgIC8vICAgICAgICAgdXBzY2FsZVNpemUsXHJcbiAgICAgICAgLy8gICAgIHRoaXMud2lkdGggKiB1cHNjYWxlU2l6ZSAqIGdhbWUuVElMRV9XSURUSCxcclxuICAgICAgICAvLyAgICAgdGhpcy5oZWlnaHQgKiB1cHNjYWxlU2l6ZSAqIGdhbWUuVElMRV9IRUlHSFRcclxuICAgICAgICAvLyApO1xyXG4gICAgICAgIFBsYXllckFuaW1hdGlvbnNbdGhpcy5jdXJyZW50QW5pbWF0aW9uXVt0aGlzLmFuaW1GcmFtZV1bMF0ucmVuZGVyXHJcbiAgICAgICAgICAgIChcclxuICAgICAgICAgICAgICAgIHRhcmdldCxcclxuICAgICAgICAgICAgICAgIE1hdGgucm91bmQoKHRoaXMuaW50ZXJwb2xhdGVkWCAqIGdhbWUuVElMRV9XSURUSCAtXHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS5pbnRlcnBvbGF0ZWRDYW1YICogZ2FtZS5USUxFX1dJRFRIKSAqXHJcbiAgICAgICAgICAgICAgICB1cHNjYWxlU2l6ZSksXHJcbiAgICAgICAgICAgICAgICBNYXRoLnJvdW5kKCh0aGlzLmludGVycG9sYXRlZFkgKiBnYW1lLlRJTEVfSEVJR0hUIC1cclxuICAgICAgICAgICAgICAgICAgICBnYW1lLmludGVycG9sYXRlZENhbVkgKiBnYW1lLlRJTEVfSEVJR0hUKSAqXHJcbiAgICAgICAgICAgICAgICB1cHNjYWxlU2l6ZSksXHJcbiAgICAgICAgICAgICAgICB0aGlzLndpZHRoICogdXBzY2FsZVNpemUgKiBnYW1lLlRJTEVfV0lEVEgsXHJcbiAgICAgICAgICAgICAgICB0aGlzLmhlaWdodCAqIHVwc2NhbGVTaXplICogZ2FtZS5USUxFX0hFSUdIVFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBQbGF5ZXJBbmltYXRpb25zW3RoaXMuY3VycmVudEFuaW1hdGlvbl1bdGhpcy5hbmltRnJhbWVdWzBdLnJlbmRlcldvcmxkc3BhY2VSZWZsZWN0aW9uXHJcbiAgICAgICAgICAgIChcclxuICAgICAgICAgICAgICAgIHRoaXMuaW50ZXJwb2xhdGVkWCxcclxuICAgICAgICAgICAgICAgIHRoaXMuaW50ZXJwb2xhdGVkWSt0aGlzLmhlaWdodCxcclxuICAgICAgICAgICAgICAgIHRoaXMud2lkdGgsXHJcbiAgICAgICAgICAgICAgICB0aGlzLmhlaWdodFxyXG4gICAgICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZURhdGEoZGF0YTogRW50aXR5UGF5bG9hZCk6IHZvaWQge1xyXG4gICAgICAgIGlmIChkYXRhLnR5cGUgPT09IEVudGl0aWVzLlBsYXllcikgdGhpcy5uYW1lID0gZGF0YS5kYXRhLm5hbWU7XHJcbiAgICB9XHJcblxyXG4gICAga2V5Ym9hcmRJbnB1dCgpIHtcclxuXHJcbiAgICAgICAgdGhpcy54VmVsICs9XHJcbiAgICAgICAgICAgIDAuMDIgKiAoK3RoaXMucmlnaHRCdXR0b24gLSArdGhpcy5sZWZ0QnV0dG9uKTtcclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgIHRoaXMuZ3JvdW5kZWQgJiYgdGhpcy5qdW1wQnV0dG9uXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIGdhbWUuc2NyZWVuc2hha2VBbW91bnQgPSAwLjU7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTAgKiBnYW1lLnBhcnRpY2xlTXVsdGlwbGllcjsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLmJvdHRvbUNvbGxpc2lvbiAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgICAgIGdhbWUucGFydGljbGVzLnB1c2gobmV3IENvbG9yUGFydGljbGUodGhpcy5ib3R0b21Db2xsaXNpb24uY29sb3IsIDEgLyA4ICsgTWF0aC5yYW5kb20oKSAvIDgsIDIwLCB0aGlzLnggKyB0aGlzLndpZHRoICogTWF0aC5yYW5kb20oKSwgdGhpcy55ICsgdGhpcy5oZWlnaHQsIDAuMiAqIChNYXRoLnJhbmRvbSgpIC0gMC41KSwgMC4yICogLU1hdGgucmFuZG9tKCkpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnlWZWwgPSAtMS41O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBhcHBseUdyYXZpdHlBbmREcmFnKCkge1xyXG4gICAgICAgIC8vIHRoaXMgZnVuY3Rpb24gY2hhbmdlcyB0aGUgb2JqZWN0J3MgbmV4dCB0aWNrJ3MgdmVsb2NpdHkgaW4gYm90aCB0aGUgeCBhbmQgdGhlIHkgZGlyZWN0aW9uc1xyXG5cclxuICAgICAgICB0aGlzLnBYVmVsID0gdGhpcy54VmVsO1xyXG4gICAgICAgIHRoaXMucFlWZWwgPSB0aGlzLnlWZWw7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmJvdHRvbUNvbGxpc2lvbiA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMueFZlbCAtPVxyXG4gICAgICAgICAgICAgICAgKE1hdGguYWJzKHRoaXMueFZlbCkgKiB0aGlzLnhWZWwgKiBnYW1lLkRSQUdfQ09FRkZJQ0lFTlQgKiB0aGlzLndpZHRoKSAvIC8vYXBwbHkgYWlyIHJlc2lzdGFuY2VcclxuICAgICAgICAgICAgICAgIHRoaXMubWFzcztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnhWZWwgLT1cclxuICAgICAgICAgICAgICAgIChNYXRoLmFicyh0aGlzLnhWZWwpICogdGhpcy54VmVsICogZ2FtZS5EUkFHX0NPRUZGSUNJRU5UICogKHRoaXMuYm90dG9tQ29sbGlzaW9uLmZyaWN0aW9uKSAqIHRoaXMud2lkdGgpIC8gLy9hcHBseSBhaXIgcmVzaXN0YW5jZSBhbmQgZ3JvdW5kIGZyaWN0aW9uXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1hc3M7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMueVZlbCArPSBnYW1lLkdSQVZJVFlfU1BFRUQ7XHJcbiAgICAgICAgdGhpcy55VmVsIC09XHJcbiAgICAgICAgICAgIChnYW1lLmFicyh0aGlzLnlWZWwpICogdGhpcy55VmVsICogZ2FtZS5EUkFHX0NPRUZGSUNJRU5UICogdGhpcy5oZWlnaHQpIC9cclxuICAgICAgICAgICAgdGhpcy5tYXNzO1xyXG4gICAgICAgIC8vaWYgb24gdGhlIGdyb3VuZCwgbWFrZSB3YWxraW5nIHBhcnRpY2xlc1xyXG4gICAgICAgIGlmICh0aGlzLmdyb3VuZGVkKSB7XHJcbiAgICAgICAgICAgIC8vZm9vdHN0ZXBzXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmFuZG9tbHlUb0ludChNYXRoLmFicyh0aGlzLnhWZWwpICogZ2FtZS5wYXJ0aWNsZU11bHRpcGxpZXIgLyAyKTsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBnYW1lLnBhcnRpY2xlcy5wdXNoKG5ldyBDb2xvclBhcnRpY2xlKFwiI2JiYmJiYjQ1XCIsIDEgLyA0ICsgTWF0aC5yYW5kb20oKSAvIDgsIDUwLCB0aGlzLnggKyB0aGlzLndpZHRoIC8gMiArIGkgLyBnYW1lLnBhcnRpY2xlTXVsdGlwbGllciwgdGhpcy55ICsgdGhpcy5oZWlnaHQsIDAsIDAsIGZhbHNlKSk7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vZHVzdFxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJhbmRvbWx5VG9JbnQoTWF0aC5hYnModGhpcy54VmVsKSAqIGdhbWUucGFydGljbGVNdWx0aXBsaWVyIC8gMik7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5ib3R0b21Db2xsaXNpb24gIT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgIGdhbWUucGFydGljbGVzLnB1c2gobmV3IENvbG9yUGFydGljbGUodGhpcy5ib3R0b21Db2xsaXNpb24uY29sb3IsIDEgLyA4ICsgTWF0aC5yYW5kb20oKSAvIDgsIDEwLCB0aGlzLnggKyB0aGlzLndpZHRoIC8gMiwgdGhpcy55ICsgdGhpcy5oZWlnaHQsIDAuMiAqIC10aGlzLnhWZWwgKyAwLjIgKiAoTWF0aC5yYW5kb20oKSAtIDAuNSksIDAuMiAqIC1NYXRoLnJhbmRvbSgpLCB0cnVlKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5jdXJyZW50QW5pbWF0aW9uICE9PSBcIndhbGtcIiAmJiAodGhpcy54VmVsKT4wLjA1KSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEFuaW1hdGlvbiA9IFwid2Fsa1wiO1xyXG4gICAgICAgICAgICB0aGlzLmFuaW1GcmFtZSA9IHRoaXMuYW5pbUZyYW1lICUgUGxheWVyQW5pbWF0aW9uc1t0aGlzLmN1cnJlbnRBbmltYXRpb25dLmxlbmd0aDtcclxuICAgICAgICAgICAgdGhpcy5mYWNpbmdSaWdodCA9IHRydWU7XHJcbiAgICAgICAgICAgIGdhbWUuY29ubmVjdGlvbi5lbWl0KCdwbGF5ZXJBbmltYXRpb24nLCB0aGlzLmN1cnJlbnRBbmltYXRpb24sIHRoaXMuZW50aXR5SWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLmN1cnJlbnRBbmltYXRpb24gIT09IFwid2Fsa2xlZnRcIiAmJiAodGhpcy54VmVsKTwtMC4wNSkge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRBbmltYXRpb24gPSBcIndhbGtsZWZ0XCI7XHJcbiAgICAgICAgICAgIHRoaXMuZmFjaW5nUmlnaHQgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5hbmltRnJhbWUgPSB0aGlzLmFuaW1GcmFtZSAlIFBsYXllckFuaW1hdGlvbnNbdGhpcy5jdXJyZW50QW5pbWF0aW9uXS5sZW5ndGg7XHJcbiAgICAgICAgICAgIGdhbWUuY29ubmVjdGlvbi5lbWl0KCdwbGF5ZXJBbmltYXRpb24nLCB0aGlzLmN1cnJlbnRBbmltYXRpb24sIHRoaXMuZW50aXR5SWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLmN1cnJlbnRBbmltYXRpb24gIT09IFwiaWRsZVwiICYmIE1hdGguYWJzKHRoaXMueFZlbCk8PTAuMDUgJiYgZ2FtZS53b3JsZE1vdXNlWD50aGlzLmludGVycG9sYXRlZFgrdGhpcy53aWR0aC8yKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEFuaW1hdGlvbiA9IFwiaWRsZVwiO1xyXG4gICAgICAgICAgICB0aGlzLmFuaW1GcmFtZSA9IHRoaXMuYW5pbUZyYW1lICUgUGxheWVyQW5pbWF0aW9uc1t0aGlzLmN1cnJlbnRBbmltYXRpb25dLmxlbmd0aDtcclxuICAgICAgICAgICAgZ2FtZS5jb25uZWN0aW9uLmVtaXQoJ3BsYXllckFuaW1hdGlvbicsIHRoaXMuY3VycmVudEFuaW1hdGlvbiwgdGhpcy5lbnRpdHlJZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMuY3VycmVudEFuaW1hdGlvbiAhPT0gXCJpZGxlbGVmdFwiICYmIE1hdGguYWJzKHRoaXMueFZlbCk8PTAuMDUgJiYgZ2FtZS53b3JsZE1vdXNlWDw9dGhpcy5pbnRlcnBvbGF0ZWRYK3RoaXMud2lkdGgvMil7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEFuaW1hdGlvbiA9IFwiaWRsZWxlZnRcIjtcclxuICAgICAgICAgICAgdGhpcy5hbmltRnJhbWUgPSB0aGlzLmFuaW1GcmFtZSAlIFBsYXllckFuaW1hdGlvbnNbdGhpcy5jdXJyZW50QW5pbWF0aW9uXS5sZW5ndGg7XHJcbiAgICAgICAgICAgIGdhbWUuY29ubmVjdGlvbi5lbWl0KCdwbGF5ZXJBbmltYXRpb24nLCB0aGlzLmN1cnJlbnRBbmltYXRpb24sIHRoaXMuZW50aXR5SWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvL2NvbnNvbGUubG9nKHRoaXMuY3VycmVudEFuaW1hdGlvbiwgdGhpcy5jdXJyZW50QW5pbWF0aW9uICE9PSBcIndhbGtcIiAmJiAodGhpcy54VmVsKT4wLjA1KVxyXG4gICAgfVxyXG5cclxuICAgIGZpbmRJbnRlcnBvbGF0ZWRDb29yZGluYXRlcygpIHtcclxuICAgICAgICAvLyB0aGlzIGZ1bmN0aW9uIGVzc2VudGlhbGx5IG1ha2VzIHRoZSBjaGFyYWN0ZXIgbGFnIGJlaGluZCBvbmUgdGljaywgYnV0IG1lYW5zIHRoYXQgaXQgZ2V0cyBkaXNwbGF5ZWQgYXQgdGhlIG1heGltdW0gZnJhbWUgcmF0ZS5cclxuICAgICAgICBpZiAodGhpcy5wWFZlbCA+IDApIHtcclxuICAgICAgICAgICAgdGhpcy5pbnRlcnBvbGF0ZWRYID0gZ2FtZS5taW4oXHJcbiAgICAgICAgICAgICAgICB0aGlzLnBYICsgdGhpcy5wWFZlbCAqIGdhbWUuYW1vdW50U2luY2VMYXN0VGljayxcclxuICAgICAgICAgICAgICAgIHRoaXMueFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW50ZXJwb2xhdGVkWCA9IGdhbWUubWF4KFxyXG4gICAgICAgICAgICAgICAgdGhpcy5wWCArIHRoaXMucFhWZWwgKiBnYW1lLmFtb3VudFNpbmNlTGFzdFRpY2ssXHJcbiAgICAgICAgICAgICAgICB0aGlzLnhcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMucFlWZWwgPiAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW50ZXJwb2xhdGVkWSA9IGdhbWUubWluKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5wWSArIHRoaXMucFlWZWwgKiBnYW1lLmFtb3VudFNpbmNlTGFzdFRpY2ssXHJcbiAgICAgICAgICAgICAgICB0aGlzLnlcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmludGVycG9sYXRlZFkgPSBnYW1lLm1heChcclxuICAgICAgICAgICAgICAgIHRoaXMucFkgKyB0aGlzLnBZVmVsICogZ2FtZS5hbW91bnRTaW5jZUxhc3RUaWNrLFxyXG4gICAgICAgICAgICAgICAgdGhpcy55XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFwcGx5VmVsb2NpdHlBbmRDb2xsaWRlKCkge1xyXG4gICAgICAgIHRoaXMudG9wQ29sbGlzaW9uID0gV29ybGRUaWxlc1tUaWxlVHlwZS5BaXJdO1xyXG4gICAgICAgIHRoaXMuYm90dG9tQ29sbGlzaW9uID0gV29ybGRUaWxlc1tUaWxlVHlwZS5BaXJdO1xyXG4gICAgICAgIHRoaXMucFggPSB0aGlzLng7XHJcbiAgICAgICAgdGhpcy5wWSA9IHRoaXMueTtcclxuXHJcbiAgICAgICAgdGhpcy5wR3JvdW5kZWQgPSB0aGlzLmdyb3VuZGVkO1xyXG4gICAgICAgIHRoaXMuZ3JvdW5kZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICBUaGlzIGZ1bmN0aW9uIGFzc3VtZXMgdGhhdCB0aGUgb2JqZWN0IGRvZXNuJ3Qgc3RhcnQgaW4gY29sbGlzaW9uXHJcblxyXG4gICAgICAgIEFsc28sIGl0IHRha2VzIGFkdmFudGFnZSBvZiB0aGUgZmFjdCB0aGF0IGFuIG9iamVjdCBjYW4gb25seSBjb2xsaWRlIG9uY2UgaW4gZWFjaCBheGlzIHdpdGggdGhlc2UgYXhpcy1hbGlnbmVkIHJlY3RhbmdsZXMuXHJcbiAgICAgICAgVGhhdCdzIGEgdG90YWwgb2YgYSBwb3NzaWJsZSB0d28gY29sbGlzaW9ucywgb3IgYW4gaW5pdGlhbCBjb2xsaXNpb24sIGFuZCBhIHNsaWRpbmcgY29sbGlzaW9uLlxyXG4gICAgICAgICovXHJcblxyXG4gICAgICAgIC8vIGNhbGN1bGF0ZSB0aGUgaW5pdGlhbCBjb2xsaXNpb246XHJcblxyXG4gICAgICAgIC8vIHNldCB0aGUgY2xvc2VzdCBjb2xsaXNpb24gdG8gb25lIGluZmluaXRlbHkgZmFyIGF3YXkuXHJcbiAgICAgICAgdGhpcy5jbG9zZXN0Q29sbGlzaW9uID0gWzEsIDAsIEluZmluaXR5XTtcclxuXHJcbiAgICAgICAgbGV0IG1vc3RseUdvaW5nSG9yaXpvbnRhbGx5OiBib29sZWFuO1xyXG5cclxuICAgICAgICAvLyBsb29wIHRocm91Z2ggYWxsIHRoZSBwb3NzaWJsZSB0aWxlcyB0aGUgcGh5c2ljcyBib3ggY291bGQgYmUgaW50ZXJzZWN0aW5nIHdpdGhcclxuICAgICAgICBmb3IgKFxyXG4gICAgICAgICAgICBsZXQgaSA9IE1hdGguZmxvb3IoZ2FtZS5taW4odGhpcy54LCB0aGlzLnggKyB0aGlzLnhWZWwpKTtcclxuICAgICAgICAgICAgaSA8IE1hdGguY2VpbChnYW1lLm1heCh0aGlzLngsIHRoaXMueCArIHRoaXMueFZlbCkgKyB0aGlzLndpZHRoKTtcclxuICAgICAgICAgICAgaSsrXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIGZvciAoXHJcbiAgICAgICAgICAgICAgICBsZXQgaiA9IE1hdGguZmxvb3IoZ2FtZS5taW4odGhpcy55LCB0aGlzLnkgKyB0aGlzLnlWZWwpKTtcclxuICAgICAgICAgICAgICAgIGogPCBNYXRoLmNlaWwoZ2FtZS5tYXgodGhpcy55LCB0aGlzLnkgKyB0aGlzLnlWZWwpICsgdGhpcy5oZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgaisrXHJcbiAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgLy8gaWYgdGhlIGN1cnJlbnQgdGlsZSBpc24ndCBhaXIgKHZhbHVlIDApLCB0aGVuIGNvbnRpbnVlIHdpdGggdGhlIGNvbGxpc2lvbiBkZXRlY3Rpb25cclxuICAgICAgICAgICAgICAgIGxldCBjdXJyZW50QmxvY2s6IFRpbGVUeXBlIHwgc3RyaW5nID0gZ2FtZS53b3JsZC53b3JsZFRpbGVzW2ogKiBnYW1lLndvcmxkV2lkdGggKyBpXTtcclxuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50QmxvY2sgIT09IFRpbGVUeXBlLkFpciAmJiB0eXBlb2YgY3VycmVudEJsb2NrID09PSAnbnVtYmVyJykge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGdldCB0aGUgZGF0YSBhYm91dCB0aGUgY29sbGlzaW9uIGFuZCBzdG9yZSBpdCBpbiBhIHZhcmlhYmxlXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb2xsaXNpb25EYXRhID0gZ2FtZS5yZWN0VnNSYXkoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGkgLSB0aGlzLndpZHRoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBqIC0gdGhpcy5oZWlnaHQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMud2lkdGggKyAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhlaWdodCArIDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMueCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy55LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnhWZWwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMueVZlbFxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgbW9zdGx5R29pbmdIb3Jpem9udGFsbHkgPSBNYXRoLmFicyh0aGlzLnhWZWwpID4gTWF0aC5hYnModGhpcy55VmVsKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29sbGlzaW9uRGF0YSAhPT0gZmFsc2UpIHsvL2EgY29sbGlzaW9uIGhhcHBlbmVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2VzdENvbGxpc2lvblsyXSA+IHRoaXMuY29sbGlzaW9uRGF0YVsyXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2VzdENvbGxpc2lvbiA9IHRoaXMuY29sbGlzaW9uRGF0YTsvL2hvbmVzdGx5IHRoaXMgZW50aXJlIGNvbGxpc2lvbiBzeXN0ZW0gaXMgYSBtZXNzIGJ1dCBpdCB3b3JrIHNvIHNvIHdoYXRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMF0gPT09IDApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2xvc2VzdENvbGxpc2lvblsxXSA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRvcENvbGxpc2lvbiA9IFdvcmxkVGlsZXNbY3VycmVudEJsb2NrXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYm90dG9tQ29sbGlzaW9uID0gV29ybGRUaWxlc1tjdXJyZW50QmxvY2tdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMl0gPT09IHRoaXMuY29sbGlzaW9uRGF0YVsyXSAmJiBtb3N0bHlHb2luZ0hvcml6b250YWxseSA9PT0gKHRoaXMuY2xvc2VzdENvbGxpc2lvblswXSA9PT0gMCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2VzdENvbGxpc2lvbiA9IHRoaXMuY29sbGlzaW9uRGF0YTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMF0gPT09IDApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2xvc2VzdENvbGxpc2lvblsxXSA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRvcENvbGxpc2lvbiA9IFdvcmxkVGlsZXNbY3VycmVudEJsb2NrXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYm90dG9tQ29sbGlzaW9uID0gV29ybGRUaWxlc1tjdXJyZW50QmxvY2tdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMl0gIT09IEluZmluaXR5KSB7XHJcbiAgICAgICAgICAgIC8vIHRoZXJlIGhhcyBiZWVuIGF0IGxlYXN0IG9uZSBjb2xsaXNpb25cclxuXHJcbiAgICAgICAgICAgIC8vIGdvIHRvIHRoZSBwb2ludCBvZiBjb2xsaXNpb24gKHRoaXMgbWFrZXMgaXQgYmVoYXZlIGFzIGlmIHRoZSB3YWxscyBhcmUgc3RpY2t5LCBidXQgd2Ugd2lsbCBsYXRlciBzbGlkZSBhZ2FpbnN0IHRoZSB3YWxscylcclxuICAgICAgICAgICAgdGhpcy54ICs9IHRoaXMueFZlbCAqIHRoaXMuY2xvc2VzdENvbGxpc2lvblsyXTtcclxuICAgICAgICAgICAgdGhpcy55ICs9IHRoaXMueVZlbCAqIHRoaXMuY2xvc2VzdENvbGxpc2lvblsyXTtcclxuICAgICAgICAgICAgLy8gdGhlIGNvbGxpc2lvbiBoYXBwZW5lZCBlaXRoZXIgb24gdGhlIHRvcCBvciBib3R0b21cclxuICAgICAgICAgICAgaWYgKHRoaXMuY2xvc2VzdENvbGxpc2lvblswXSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2xvc2VzdENvbGxpc2lvblsxXSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdyb3VuZGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBpZiBpdCBjb2xsaWRlZCBvbiB0aGUgaGlnaGVyIHNpZGUsIGl0IG11c3QgYmUgdG91Y2hpbmcgdGhlIGdyb3VuZC4gKGhpZ2hlciB5IGlzIGRvd24pXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLnBHcm91bmRlZCkgey8vaWYgaXQgaXNuJ3QgZ3JvdW5kZWQgeWV0LCBpdCBtdXN0IGJlIGNvbGxpZGluZyB3aXRoIHRoZSBncm91bmQgZm9yIHRoZSBmaXJzdCB0aW1lLCBzbyBzdW1tb24gcGFydGljbGVzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdhbWUuc2NyZWVuc2hha2VBbW91bnQgPSBNYXRoLmFicyh0aGlzLnlWZWwgKiAwLjc1KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA1ICogZ2FtZS5wYXJ0aWNsZU11bHRpcGxpZXI7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5ib3R0b21Db2xsaXNpb24gIT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnYW1lLnBhcnRpY2xlcy5wdXNoKG5ldyBDb2xvclBhcnRpY2xlKHRoaXMuYm90dG9tQ29sbGlzaW9uLmNvbG9yLCAxIC8gOCArIE1hdGgucmFuZG9tKCkgLyA4LCAyMCwgdGhpcy54ICsgdGhpcy53aWR0aCAqIE1hdGgucmFuZG9tKCksIHRoaXMueSArIHRoaXMuaGVpZ2h0LCAwLjIgKiAoTWF0aC5yYW5kb20oKSAtIDAuNSksIDAuMiAqIC1NYXRoLnJhbmRvbSgpKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBnYW1lLnNjcmVlbnNoYWtlQW1vdW50ID0gTWF0aC5hYnModGhpcy55VmVsICogMC43NSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA1ICogZ2FtZS5wYXJ0aWNsZU11bHRpcGxpZXI7IGkrKykgey8vY2VpbGluZyBjb2xsaXNpb24gcGFydGljbGVzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMudG9wQ29sbGlzaW9uICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnYW1lLnBhcnRpY2xlcy5wdXNoKG5ldyBDb2xvclBhcnRpY2xlKHRoaXMudG9wQ29sbGlzaW9uLmNvbG9yLCAxIC8gOCArIE1hdGgucmFuZG9tKCkgLyA4LCAyMCwgdGhpcy54ICsgdGhpcy53aWR0aCAqIE1hdGgucmFuZG9tKCksIHRoaXMueSwgMC4yICogKE1hdGgucmFuZG9tKCkgLSAwLjUpLCAwLjIgKiAtTWF0aC5yYW5kb20oKSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMueVZlbCA9IDA7IC8vIHNldCB0aGUgeSB2ZWxvY2l0eSB0byAwIGJlY2F1c2UgdGhlIG9iamVjdCBoYXMgcnVuIGludG8gYSB3YWxsIG9uIGl0cyB0b3Agb3IgYm90dG9tXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNsaWRlWCA9IHRoaXMueFZlbCAqICgxIC0gdGhpcy5jbG9zZXN0Q29sbGlzaW9uWzJdKTsgLy8gdGhpcyBpcyB0aGUgcmVtYWluaW5nIGRpc3RhbmNlIHRvIHNsaWRlIGFmdGVyIHRoZSBjb2xsaXNpb25cclxuICAgICAgICAgICAgICAgIHRoaXMuc2xpZGVZID0gMDsgLy8gaXQgZG9lc24ndCBzbGlkZSBpbiB0aGUgeSBkaXJlY3Rpb24gYmVjYXVzZSB0aGVyZSdzIGEgd2FsbCBcXCguLS4pL1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy54VmVsID0gMDsgLy8gc2V0IHRoZSB4IHZlbG9jaXR5IHRvIDAgYmVjYXVzZSB3YWxsIGdvIG9vZlxyXG4gICAgICAgICAgICAgICAgdGhpcy5zbGlkZVggPSAwOyAvLyBpdCBkb2Vzbid0IHNsaWRlIGluIHRoZSB4IGRpcmVjdGlvbiBiZWNhdXNlIHRoZXJlJ3MgYSB3YWxsIC8oLl8uKVxcXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNsaWRlWSA9IHRoaXMueVZlbCAqICgxIC0gdGhpcy5jbG9zZXN0Q29sbGlzaW9uWzJdKTsgLy8gdGhpcyBpcyB0aGUgcmVtYWluaW5nIGRpc3RhbmNlIHRvIHNsaWRlIGFmdGVyIHRoZSBjb2xsaXNpb25cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gYXQgdGhpcyBwb2ludCwgdGhlIG9iamVjdCBpcyB0b3VjaGluZyBpdHMgZmlyc3QgY29sbGlzaW9uLCByZWFkeSB0byBzbGlkZS4gIFRoZSBhbW91bnQgaXQgd2FudHMgdG8gc2xpZGUgaXMgaGVsZCBpbiB0aGUgdGhpcy5zbGlkZVggYW5kIHRoaXMuc2xpZGVZIHZhcmlhYmxlcy5cclxuXHJcbiAgICAgICAgICAgIC8vIHRoaXMgY2FuIGJlIHRyZWF0ZWQgZXNzZW50aWFsbHkgdGhlIHNhbWUgYXMgdGhlIGZpcnN0IGNvbGxpc2lvbiwgc28gYSBsb3Qgb2YgdGhlIGNvZGUgd2lsbCBiZSByZXVzZWQuXHJcblxyXG4gICAgICAgICAgICAvLyBzZXQgdGhlIGNsb3Nlc3QgY29sbGlzaW9uIHRvIG9uZSBpbmZpbml0ZWx5IGZhciBhd2F5LlxyXG4gICAgICAgICAgICB0aGlzLmNsb3Nlc3RDb2xsaXNpb24gPSBbMSwgMCwgSW5maW5pdHldO1xyXG5cclxuICAgICAgICAgICAgLy8gbG9vcCB0aHJvdWdoIGFsbCB0aGUgcG9zc2libGUgdGlsZXMgdGhlIHBoeXNpY3MgYm94IGNvdWxkIGJlIGludGVyc2VjdGluZyB3aXRoXHJcbiAgICAgICAgICAgIGZvciAoXHJcbiAgICAgICAgICAgICAgICBsZXQgaSA9IE1hdGguZmxvb3IoZ2FtZS5taW4odGhpcy54LCB0aGlzLnggKyB0aGlzLnNsaWRlWCkpO1xyXG4gICAgICAgICAgICAgICAgaSA8IE1hdGguY2VpbChnYW1lLm1heCh0aGlzLngsIHRoaXMueCArIHRoaXMuc2xpZGVYKSArIHRoaXMud2lkdGgpO1xyXG4gICAgICAgICAgICAgICAgaSsrXHJcbiAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaiA9IE1hdGguZmxvb3IoZ2FtZS5taW4odGhpcy55LCB0aGlzLnkgKyB0aGlzLnNsaWRlWSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGogPFxyXG4gICAgICAgICAgICAgICAgICAgIE1hdGguY2VpbChnYW1lLm1heCh0aGlzLnksIHRoaXMueSArIHRoaXMuc2xpZGVZKSArIHRoaXMuaGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgICAgICBqKytcclxuICAgICAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBjdXJyZW50QmxvY2s6IFRpbGVUeXBlIHwgc3RyaW5nID0gZ2FtZS53b3JsZC53b3JsZFRpbGVzW2ogKiBnYW1lLndvcmxkV2lkdGggKyBpXTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBpZiB0aGUgY3VycmVudCB0aWxlIGlzbid0IGFpciwgdGhlbiBjb250aW51ZSB3aXRoIHRoZSBjb2xsaXNpb24gZGV0ZWN0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRCbG9jayAhPT0gVGlsZVR5cGUuQWlyICYmIHR5cGVvZiBjdXJyZW50QmxvY2sgPT09IFwibnVtYmVyXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZ2V0IHRoZSBkYXRhIGFib3V0IHRoZSBjb2xsaXNpb24gYW5kIHN0b3JlIGl0IGluIGEgdmFyaWFibGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb2xsaXNpb25EYXRhID0gZ2FtZS5yZWN0VnNSYXkoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpIC0gdGhpcy53aWR0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGogLSB0aGlzLmhlaWdodCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMud2lkdGggKyAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oZWlnaHQgKyAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy54LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy55LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zbGlkZVgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNsaWRlWVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbGxpc2lvbkRhdGEgIT09IGZhbHNlICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMl0gPiB0aGlzLmNvbGxpc2lvbkRhdGFbMl1cclxuICAgICAgICAgICAgICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3Nlc3RDb2xsaXNpb24gPSB0aGlzLmNvbGxpc2lvbkRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jbG9zZXN0Q29sbGlzaW9uWzBdID09PSAwKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMV0gPT09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b3BDb2xsaXNpb24gPSBXb3JsZFRpbGVzW2N1cnJlbnRCbG9ja107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJvdHRvbUNvbGxpc2lvbiA9IFdvcmxkVGlsZXNbY3VycmVudEJsb2NrXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIGl0IGhhcyBjb2xsaWRlZCB3aGlsZSB0cnlpbmcgdG8gc2xpZGVcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2xvc2VzdENvbGxpc2lvblsyXSAhPT0gSW5maW5pdHkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMueCArPSB0aGlzLnNsaWRlWCAqIHRoaXMuY2xvc2VzdENvbGxpc2lvblsyXTtcclxuICAgICAgICAgICAgICAgIHRoaXMueSArPSB0aGlzLnNsaWRlWSAqIHRoaXMuY2xvc2VzdENvbGxpc2lvblsyXTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jbG9zZXN0Q29sbGlzaW9uWzBdID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy55VmVsID0gMDsgLy8gc2V0IHRoZSB5IHZlbG9jaXR5IHRvIDAgYmVjYXVzZSB0aGUgb2JqZWN0IGhhcyBydW4gaW50byBhIHdhbGwgb24gaXRzIHRvcCBvciBib3R0b21cclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jbG9zZXN0Q29sbGlzaW9uWzFdID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiBpdCBjb2xsaWRlZCBvbiB0aGUgaGlnaGVyIHNpZGUsIGl0IG11c3QgYmUgdG91Y2hpbmcgdGhlIGdyb3VuZC4gKGhpZ2hlciB5IGlzIGRvd24pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ3JvdW5kZWQgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMueFZlbCA9IDA7IC8vIHNldCB0aGUgeCB2ZWxvY2l0eSB0byAwIGJlY2F1c2Ugd2FsbCBnbyBvb2ZcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIGl0IGhhcyBub3QgY29sbGlkZWQgd2hpbGUgdHJ5aW5nIHRvIHNsaWRlXHJcbiAgICAgICAgICAgICAgICB0aGlzLnggKz0gdGhpcy5zbGlkZVg7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnkgKz0gdGhpcy5zbGlkZVk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyB0aGVyZSBoYXMgYmVlbiBubyBjb2xsaXNpb25cclxuICAgICAgICAgICAgdGhpcy54ICs9IHRoaXMueFZlbDtcclxuICAgICAgICAgICAgdGhpcy55ICs9IHRoaXMueVZlbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGNvbGxpZGUgd2l0aCBzaWRlcyBvZiBtYXBcclxuXHJcbiAgICAgICAgaWYgKHRoaXMueCA8IDApIHtcclxuICAgICAgICAgICAgdGhpcy54ID0gMDtcclxuICAgICAgICAgICAgdGhpcy54VmVsID0gMDtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMueCArIHRoaXMud2lkdGggPiBnYW1lLndvcmxkV2lkdGgpIHtcclxuICAgICAgICAgICAgdGhpcy54ID0gZ2FtZS53b3JsZFdpZHRoIC0gdGhpcy53aWR0aDtcclxuICAgICAgICAgICAgdGhpcy54VmVsID0gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnkgKyB0aGlzLmhlaWdodCA+IGdhbWUud29ybGRIZWlnaHQpIHtcclxuICAgICAgICAgICAgdGhpcy55ID0gZ2FtZS53b3JsZEhlaWdodCAtIHRoaXMuaGVpZ2h0O1xyXG4gICAgICAgICAgICB0aGlzLnlWZWwgPSAwO1xyXG4gICAgICAgICAgICB0aGlzLmdyb3VuZGVkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiByYW5kb21seVRvSW50KGY6IG51bWJlcikge1xyXG4gICAgaWYgKE1hdGgucmFuZG9tKCkgPiBmIC0gTWF0aC5mbG9vcihmKSkge1xyXG4gICAgICAgIHJldHVybiAoTWF0aC5mbG9vcihmKSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gKE1hdGguY2VpbChmKSk7XHJcbn0iLCJpbXBvcnQgeyBSZW5kZXJhYmxlIH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9SZW5kZXJhYmxlJztcclxuaW1wb3J0IHA1IGZyb20gJ3A1JztcclxuaW1wb3J0IHsgQXVkaW9Bc3NldHMsIFVpQXNzZXRzIH0gZnJvbSAnLi4vYXNzZXRzL0Fzc2V0cyc7XHJcbmltcG9ydCB7IEltYWdlUmVzb3VyY2UgfSBmcm9tICcuLi9hc3NldHMvcmVzb3VyY2VzL0ltYWdlUmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBGb250UmVzb3VyY2UgfSBmcm9tICcuLi9hc3NldHMvcmVzb3VyY2VzL0ZvbnRSZXNvdXJjZSc7XHJcblxyXG5leHBvcnQgY2xhc3MgQnV0dG9uIGltcGxlbWVudHMgUmVuZGVyYWJsZSB7XHJcblxyXG4gICAgZm9udDogRm9udFJlc291cmNlXHJcbiAgICB0eHQ6IHN0cmluZ1xyXG4gICAgZGVzY3JpcHRpb246IHN0cmluZ1xyXG4gICAgb25QcmVzc2VkQ3VzdG9tOiBGdW5jdGlvblxyXG4gICAgeDogbnVtYmVyXHJcbiAgICB5OiBudW1iZXJcclxuICAgIHc6IG51bWJlclxyXG4gICAgaDogbnVtYmVyXHJcbiAgICBpbWFnZTogSW1hZ2VSZXNvdXJjZVxyXG4gICAgbW91c2VJc092ZXI6IGJvb2xlYW5cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBmb250OiBGb250UmVzb3VyY2UsXHJcbiAgICAgICAgdHh0OiBzdHJpbmcsXHJcbiAgICAgICAgZGVzY3JpcHRpb246IHN0cmluZyxcclxuICAgICAgICB4OiBudW1iZXIsXHJcbiAgICAgICAgeTogbnVtYmVyLFxyXG4gICAgICAgIHc6IG51bWJlcixcclxuICAgICAgICBoOiBudW1iZXIsXHJcbiAgICAgICAgb25QcmVzc2VkQ3VzdG9tOiBGdW5jdGlvbikge1xyXG4gICAgICAgIHRoaXMuZm9udCA9IGZvbnQ7XHJcbiAgICAgICAgdGhpcy50eHQgPSB0eHRcclxuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb25cclxuICAgICAgICB0aGlzLm9uUHJlc3NlZEN1c3RvbSA9IG9uUHJlc3NlZEN1c3RvbVxyXG4gICAgICAgIHRoaXMueCA9IHhcclxuICAgICAgICB0aGlzLnkgPSB5XHJcbiAgICAgICAgdGhpcy53ID0gd1xyXG4gICAgICAgIHRoaXMuaCA9IGhcclxuICAgICAgICB0aGlzLmltYWdlID0gVWlBc3NldHMuYnV0dG9uX3Vuc2VsZWN0ZWQ7XHJcbiAgICAgICAgdGhpcy5tb3VzZUlzT3ZlciA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcih0YXJnZXQ6IHA1LCB1cHNjYWxlU2l6ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgLy8gc2V0IHRoZSBjb29yZHMgYW5kIGRpbWVuc2lvbnMgdG8gcm91bmQgdG8gdGhlIG5lYXJlc3QgdW4tdXBzY2FsZWQgcGl4ZWxcclxuICAgICAgICBjb25zdCB4ID0gTWF0aC5yb3VuZCh0aGlzLnggLyB1cHNjYWxlU2l6ZSkgKiB1cHNjYWxlU2l6ZTtcclxuICAgICAgICBjb25zdCB5ID0gTWF0aC5yb3VuZCh0aGlzLnkgLyB1cHNjYWxlU2l6ZSkgKiB1cHNjYWxlU2l6ZTtcclxuICAgICAgICBjb25zdCB3ID0gTWF0aC5yb3VuZCh0aGlzLncgLyB1cHNjYWxlU2l6ZSkgKiB1cHNjYWxlU2l6ZTtcclxuICAgICAgICBjb25zdCBoID0gTWF0aC5yb3VuZCh0aGlzLmggLyB1cHNjYWxlU2l6ZSkgKiB1cHNjYWxlU2l6ZTtcclxuXHJcbiAgICAgICAgLy8gY29ybmVyc1xyXG4gICAgICAgIHRoaXMuaW1hZ2UucmVuZGVyUGFydGlhbCh0YXJnZXQsIHgsIHksIDcgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCAwLCAwLCA3LCA3KTtcclxuICAgICAgICB0aGlzLmltYWdlLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4ICsgdyAtIDcgKiB1cHNjYWxlU2l6ZSwgeSwgNyAqIHVwc2NhbGVTaXplLCA3ICogdXBzY2FsZVNpemUsIDgsIDAsIDcsIDcpO1xyXG4gICAgICAgIHRoaXMuaW1hZ2UucmVuZGVyUGFydGlhbCh0YXJnZXQsIHgsIHkgKyBoIC0gNyAqIHVwc2NhbGVTaXplLCA3ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgMCwgOCwgNywgNyk7XHJcbiAgICAgICAgdGhpcy5pbWFnZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCArIHcgLSA3ICogdXBzY2FsZVNpemUsIHkgKyBoIC0gNyAqIHVwc2NhbGVTaXplLCA3ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgOCwgOCwgNywgNyk7XHJcblxyXG4gICAgICAgIC8vIHRvcCBhbmQgYm90dG9tXHJcbiAgICAgICAgdGhpcy5pbWFnZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCArIDcgKiB1cHNjYWxlU2l6ZSwgeSwgdyAtIDE0ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgNywgMCwgMSwgNyk7XHJcbiAgICAgICAgdGhpcy5pbWFnZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCArIDcgKiB1cHNjYWxlU2l6ZSwgeSArIGggLSA3ICogdXBzY2FsZVNpemUsIHcgLSAxNCAqIHVwc2NhbGVTaXplLCA3ICogdXBzY2FsZVNpemUsIDcsIDgsIDEsIDcpO1xyXG5cclxuICAgICAgICAvLyBsZWZ0IGFuZCByaWdodFxyXG4gICAgICAgIHRoaXMuaW1hZ2UucmVuZGVyUGFydGlhbCh0YXJnZXQsIHgsIHkgKyA3ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgaCAtIDE0ICogdXBzY2FsZVNpemUsIDAsIDcsIDcsIDEpO1xyXG4gICAgICAgIHRoaXMuaW1hZ2UucmVuZGVyUGFydGlhbCh0YXJnZXQsIHggKyB3IC0gNyAqIHVwc2NhbGVTaXplLCB5ICsgNyAqIHVwc2NhbGVTaXplLCA3ICogdXBzY2FsZVNpemUsIGggLSAxNCAqIHVwc2NhbGVTaXplLCA4LCA3LCA3LCAxKTtcclxuXHJcbiAgICAgICAgLy8gY2VudGVyXHJcbiAgICAgICAgdGhpcy5pbWFnZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCArIDcgKiB1cHNjYWxlU2l6ZSwgeSArIDcgKiB1cHNjYWxlU2l6ZSwgdyAtIDE0ICogdXBzY2FsZVNpemUsIGggLSAxNCAqIHVwc2NhbGVTaXplLCA3LCA3LCAxLCAxKTtcclxuXHJcbiAgICAgICAgdGhpcy5mb250LmRyYXdUZXh0KHRhcmdldCwgdGhpcy50eHQsIHggKyA2ICogdXBzY2FsZVNpemUsIE1hdGgucm91bmQoKHRoaXMueSArIHRoaXMuaCAvIDIpIC8gdXBzY2FsZVNpemUpICogdXBzY2FsZVNpemUgLSA2ICogdXBzY2FsZVNpemUpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZU1vdXNlT3Zlcihtb3VzZVg6IG51bWJlciwgbW91c2VZOiBudW1iZXIpIHtcclxuICAgICAgICAvLyBpZiB0aGUgbW91c2UgcG9zaXRpb24gaXMgaW5zaWRlIHRoZSBidXR0b24sIHJldHVybiB0cnVlXHJcbiAgICAgICAgaWYgKG1vdXNlWCA+IHRoaXMueCAmJiBtb3VzZVggPCB0aGlzLnggKyB0aGlzLncgJiYgbW91c2VZID4gdGhpcy55ICYmIG1vdXNlWSA8IHRoaXMueSArIHRoaXMuaCkge1xyXG4gICAgICAgICAgICB0aGlzLm1vdXNlSXNPdmVyID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5pbWFnZSA9IFVpQXNzZXRzLmJ1dHRvbl9zZWxlY3RlZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMubW91c2VJc092ZXIgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5pbWFnZSA9IFVpQXNzZXRzLmJ1dHRvbl91bnNlbGVjdGVkO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvblByZXNzZWQoKSB7XHJcbiAgICAgICAgdGhpcy5vblByZXNzZWRDdXN0b20oKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImJ1dHRvbiBwcmVzc2VkXCIpO1xyXG4gICAgICAgIC8vQXVkaW9Bc3NldHMudWkuaW52ZW50b3J5Q2xhY2sucGxheVJhbmRvbSgpO1xyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCB7IFJlbmRlcmFibGUgfSBmcm9tICcuLi9pbnRlcmZhY2VzL1JlbmRlcmFibGUnO1xyXG5pbXBvcnQgcDUgZnJvbSAncDUnO1xyXG5pbXBvcnQgeyBLZXlzLCBVaUFzc2V0cyB9IGZyb20gJy4uL2Fzc2V0cy9Bc3NldHMnO1xyXG5pbXBvcnQgeyBJbWFnZVJlc291cmNlIH0gZnJvbSAnLi4vYXNzZXRzL3Jlc291cmNlcy9JbWFnZVJlc291cmNlJztcclxuaW1wb3J0IHsgRm9udFJlc291cmNlIH0gZnJvbSAnLi4vYXNzZXRzL3Jlc291cmNlcy9Gb250UmVzb3VyY2UnO1xyXG5cclxuZXhwb3J0IGNsYXNzIElucHV0Qm94IGltcGxlbWVudHMgUmVuZGVyYWJsZSB7XHJcblxyXG4gICAgZm9udDogRm9udFJlc291cmNlXHJcbiAgICB0eHQ6IHN0cmluZ1xyXG4gICAgdmFsdWU6IG51bWJlclxyXG4gICAga2V5Ym9hcmQ6IGJvb2xlYW5cclxuICAgIGluZGV4OiBudW1iZXJcclxuICAgIHg6IG51bWJlclxyXG4gICAgeTogbnVtYmVyXHJcbiAgICB3OiBudW1iZXJcclxuICAgIGg6IG51bWJlclxyXG4gICAgaW1hZ2U6IEltYWdlUmVzb3VyY2VcclxuICAgIG1vdXNlSXNPdmVyOiBib29sZWFuXHJcbiAgICBsaXN0ZW5pbmc6IGJvb2xlYW5cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBmb250OiBGb250UmVzb3VyY2UsXHJcbiAgICAgICAgdHh0OiBzdHJpbmcsXHJcbiAgICAgICAga2V5Ym9hcmQ6IGJvb2xlYW4sXHJcbiAgICAgICAgdmFsdWU6IG51bWJlcixcclxuICAgICAgICBpbmRleDogbnVtYmVyLC8vIHRoZSBpbmRleCBpbiB0aGUgR2FtZS5jb250cm9scyBhcnJheSB0aGF0IGl0IGNoYW5nZXNcclxuICAgICAgICB4OiBudW1iZXIsXHJcbiAgICAgICAgeTogbnVtYmVyLFxyXG4gICAgICAgIHc6IG51bWJlcixcclxuICAgICAgICBoOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmZvbnQgPSBmb250O1xyXG4gICAgICAgIHRoaXMudHh0ID0gdHh0XHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMua2V5Ym9hcmQgPSBrZXlib2FyZDtcclxuICAgICAgICB0aGlzLmluZGV4ID0gaW5kZXg7XHJcbiAgICAgICAgdGhpcy54ID0geFxyXG4gICAgICAgIHRoaXMueSA9IHlcclxuICAgICAgICB0aGlzLncgPSB3XHJcbiAgICAgICAgdGhpcy5oID0gaFxyXG4gICAgICAgIHRoaXMuaW1hZ2UgPSBVaUFzc2V0cy5idXR0b25fdW5zZWxlY3RlZDtcclxuICAgICAgICB0aGlzLm1vdXNlSXNPdmVyID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5saXN0ZW5pbmcgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIodGFyZ2V0OiBwNSwgdXBzY2FsZVNpemU6IG51bWJlcikge1xyXG4gICAgICAgIC8vIHNldCB0aGUgY29vcmRzIGFuZCBkaW1lbnNpb25zIHRvIHJvdW5kIHRvIHRoZSBuZWFyZXN0IHVuLXVwc2NhbGVkIHBpeGVsXHJcbiAgICAgICAgY29uc3QgeCA9IE1hdGgucm91bmQodGhpcy54IC8gdXBzY2FsZVNpemUpICogdXBzY2FsZVNpemU7XHJcbiAgICAgICAgY29uc3QgeSA9IE1hdGgucm91bmQodGhpcy55IC8gdXBzY2FsZVNpemUpICogdXBzY2FsZVNpemU7XHJcbiAgICAgICAgY29uc3QgdyA9IE1hdGgucm91bmQodGhpcy53IC8gdXBzY2FsZVNpemUpICogdXBzY2FsZVNpemU7XHJcbiAgICAgICAgY29uc3QgaCA9IE1hdGgucm91bmQodGhpcy5oIC8gdXBzY2FsZVNpemUpICogdXBzY2FsZVNpemU7XHJcblxyXG4gICAgICAgIC8vIGNvcm5lcnNcclxuICAgICAgICB0aGlzLmltYWdlLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4LCB5LCA3ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgMCwgMCwgNywgNyk7XHJcbiAgICAgICAgdGhpcy5pbWFnZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCArIHcgLSA3ICogdXBzY2FsZVNpemUsIHksIDcgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCA4LCAwLCA3LCA3KTtcclxuICAgICAgICB0aGlzLmltYWdlLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4LCB5ICsgaCAtIDcgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCA3ICogdXBzY2FsZVNpemUsIDAsIDgsIDcsIDcpO1xyXG4gICAgICAgIHRoaXMuaW1hZ2UucmVuZGVyUGFydGlhbCh0YXJnZXQsIHggKyB3IC0gNyAqIHVwc2NhbGVTaXplLCB5ICsgaCAtIDcgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCA3ICogdXBzY2FsZVNpemUsIDgsIDgsIDcsIDcpO1xyXG5cclxuICAgICAgICAvLyB0b3AgYW5kIGJvdHRvbVxyXG4gICAgICAgIHRoaXMuaW1hZ2UucmVuZGVyUGFydGlhbCh0YXJnZXQsIHggKyA3ICogdXBzY2FsZVNpemUsIHksIHcgLSAxNCAqIHVwc2NhbGVTaXplLCA3ICogdXBzY2FsZVNpemUsIDcsIDAsIDEsIDcpO1xyXG4gICAgICAgIHRoaXMuaW1hZ2UucmVuZGVyUGFydGlhbCh0YXJnZXQsIHggKyA3ICogdXBzY2FsZVNpemUsIHkgKyBoIC0gNyAqIHVwc2NhbGVTaXplLCB3IC0gMTQgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCA3LCA4LCAxLCA3KTtcclxuXHJcbiAgICAgICAgLy8gbGVmdCBhbmQgcmlnaHRcclxuICAgICAgICB0aGlzLmltYWdlLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4LCB5ICsgNyAqIHVwc2NhbGVTaXplLCA3ICogdXBzY2FsZVNpemUsIGggLSAxNCAqIHVwc2NhbGVTaXplLCAwLCA3LCA3LCAxKTtcclxuICAgICAgICB0aGlzLmltYWdlLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4ICsgdyAtIDcgKiB1cHNjYWxlU2l6ZSwgeSArIDcgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCBoIC0gMTQgKiB1cHNjYWxlU2l6ZSwgOCwgNywgNywgMSk7XHJcblxyXG4gICAgICAgIC8vIGNlbnRlclxyXG4gICAgICAgIHRoaXMuaW1hZ2UucmVuZGVyUGFydGlhbCh0YXJnZXQsIHggKyA3ICogdXBzY2FsZVNpemUsIHkgKyA3ICogdXBzY2FsZVNpemUsIHcgLSAxNCAqIHVwc2NhbGVTaXplLCBoIC0gMTQgKiB1cHNjYWxlU2l6ZSwgNywgNywgMSwgMSk7XHJcblxyXG4gICAgICAgIGlmKHRoaXMubGlzdGVuaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZm9udC5kcmF3VGV4dCh0YXJnZXQsIHRoaXMudHh0K1wiOiBjbGljayB0byBjYW5jZWxcIiwgeCArIDYgKiB1cHNjYWxlU2l6ZSwgTWF0aC5yb3VuZCgodGhpcy55ICsgdGhpcy5oIC8gMikgLyB1cHNjYWxlU2l6ZSkgKiB1cHNjYWxlU2l6ZSAtIDYgKiB1cHNjYWxlU2l6ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZih0aGlzLmtleWJvYXJkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZvbnQuZHJhd1RleHQodGFyZ2V0LCB0aGlzLnR4dCtcIjogICBcIitLZXlzLmtleWJvYXJkTWFwW3RoaXMudmFsdWVdLCB4ICsgNiAqIHVwc2NhbGVTaXplLCBNYXRoLnJvdW5kKCh0aGlzLnkgKyB0aGlzLmggLyAyKSAvIHVwc2NhbGVTaXplKSAqIHVwc2NhbGVTaXplIC0gNiAqIHVwc2NhbGVTaXplKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZm9udC5kcmF3VGV4dCh0YXJnZXQsIHRoaXMudHh0K1wiOiAgIE1vdXNlIFwiK3RoaXMudmFsdWUsIHggKyA2ICogdXBzY2FsZVNpemUsIE1hdGgucm91bmQoKHRoaXMueSArIHRoaXMuaCAvIDIpIC8gdXBzY2FsZVNpemUpICogdXBzY2FsZVNpemUgLSA2ICogdXBzY2FsZVNpemUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZU1vdXNlT3Zlcihtb3VzZVg6IG51bWJlciwgbW91c2VZOiBudW1iZXIpIHtcclxuICAgICAgICAvLyBpZiB0aGUgbW91c2UgcG9zaXRpb24gaXMgaW5zaWRlIHRoZSBidXR0b24sIHJldHVybiB0cnVlXHJcbiAgICAgICAgaWYgKG1vdXNlWCA+IHRoaXMueCAmJiBtb3VzZVggPCB0aGlzLnggKyB0aGlzLncgJiYgbW91c2VZID4gdGhpcy55ICYmIG1vdXNlWSA8IHRoaXMueSArIHRoaXMuaCkge1xyXG4gICAgICAgICAgICB0aGlzLm1vdXNlSXNPdmVyID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMubW91c2VJc092ZXIgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb25QcmVzc2VkKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiaW5wdXQgYm94IHByZXNzZWRcIik7XHJcbiAgICAgICAgdGhpcy5saXN0ZW5pbmcgPSAhdGhpcy5saXN0ZW5pbmc7XHJcbiAgICAgICAgaWYodGhpcy5saXN0ZW5pbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5pbWFnZSA9IFVpQXNzZXRzLmJ1dHRvbl9zZWxlY3RlZDtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmltYWdlID0gVWlBc3NldHMuYnV0dG9uX3Vuc2VsZWN0ZWQ7XHJcbiAgICAgICAgLy8gQXVkaW9Bc3NldHMudWkuaW52ZW50b3J5Q2xhY2sucGxheVJhbmRvbSgpO1xyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCB7IFJlbmRlcmFibGUgfSBmcm9tICcuLi9pbnRlcmZhY2VzL1JlbmRlcmFibGUnO1xyXG5pbXBvcnQgcDUgZnJvbSAncDUnO1xyXG5pbXBvcnQgeyBVaUFzc2V0cyB9IGZyb20gJy4uL2Fzc2V0cy9Bc3NldHMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFVpRnJhbWUgaW1wbGVtZW50cyBSZW5kZXJhYmxlIHtcclxuXHJcbiAgICB4OiBudW1iZXJcclxuICAgIHk6IG51bWJlclxyXG4gICAgdzogbnVtYmVyXHJcbiAgICBoOiBudW1iZXJcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICB4OiBudW1iZXIsXHJcbiAgICAgICAgeTogbnVtYmVyLFxyXG4gICAgICAgIHc6IG51bWJlcixcclxuICAgICAgICBoOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnggPSB4XHJcbiAgICAgICAgdGhpcy55ID0geVxyXG4gICAgICAgIHRoaXMudyA9IHdcclxuICAgICAgICB0aGlzLmggPSBoXHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKHRhcmdldDogcDUsIHVwc2NhbGVTaXplOiBudW1iZXIpIHtcclxuICAgICAgICAvLyBzZXQgdGhlIGNvb3JkcyBhbmQgZGltZW5zaW9ucyB0byByb3VuZCB0byB0aGUgbmVhcmVzdCB1bi11cHNjYWxlZCBwaXhlbFxyXG4gICAgICAgIGNvbnN0IHggPSBNYXRoLnJvdW5kKHRoaXMueC91cHNjYWxlU2l6ZSkqdXBzY2FsZVNpemU7XHJcbiAgICAgICAgY29uc3QgeSA9IE1hdGgucm91bmQodGhpcy55L3Vwc2NhbGVTaXplKSp1cHNjYWxlU2l6ZTtcclxuICAgICAgICBjb25zdCB3ID0gTWF0aC5yb3VuZCh0aGlzLncvdXBzY2FsZVNpemUpKnVwc2NhbGVTaXplO1xyXG4gICAgICAgIGNvbnN0IGggPSBNYXRoLnJvdW5kKHRoaXMuaC91cHNjYWxlU2l6ZSkqdXBzY2FsZVNpemU7XHJcblxyXG4gICAgICAgIC8vIGNvcm5lcnNcclxuICAgICAgICBVaUFzc2V0cy51aV9mcmFtZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCwgeSwgNyp1cHNjYWxlU2l6ZSwgNyp1cHNjYWxlU2l6ZSwgMCwgMCwgNywgNyk7XHJcbiAgICAgICAgVWlBc3NldHMudWlfZnJhbWUucmVuZGVyUGFydGlhbCh0YXJnZXQsIHgrdy03KnVwc2NhbGVTaXplLCB5LCA3KnVwc2NhbGVTaXplLCA3KnVwc2NhbGVTaXplLCA4LCAwLCA3LCA3KTtcclxuICAgICAgICBVaUFzc2V0cy51aV9mcmFtZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCwgeStoLTcqdXBzY2FsZVNpemUsIDcqdXBzY2FsZVNpemUsIDcqdXBzY2FsZVNpemUsIDAsIDgsIDcsIDcpO1xyXG4gICAgICAgIFVpQXNzZXRzLnVpX2ZyYW1lLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4K3ctNyp1cHNjYWxlU2l6ZSwgeStoLTcqdXBzY2FsZVNpemUsIDcqdXBzY2FsZVNpemUsIDcqdXBzY2FsZVNpemUsIDgsIDgsIDcsIDcpO1xyXG5cclxuICAgICAgICAvLyB0b3AgYW5kIGJvdHRvbVxyXG4gICAgICAgIFVpQXNzZXRzLnVpX2ZyYW1lLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4KzcqdXBzY2FsZVNpemUsIHksIHctMTQqdXBzY2FsZVNpemUsIDcqdXBzY2FsZVNpemUsIDcsIDAsIDEsIDcpO1xyXG4gICAgICAgIFVpQXNzZXRzLnVpX2ZyYW1lLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4KzcqdXBzY2FsZVNpemUsIHkraC03KnVwc2NhbGVTaXplLCB3LTE0KnVwc2NhbGVTaXplLCA3KnVwc2NhbGVTaXplLCA3LCA4LCAxLCA3KTtcclxuXHJcbiAgICAgICAgLy8gbGVmdCBhbmQgcmlnaHRcclxuICAgICAgICBVaUFzc2V0cy51aV9mcmFtZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCwgeSs3KnVwc2NhbGVTaXplLCA3KnVwc2NhbGVTaXplLCBoLTE0KnVwc2NhbGVTaXplLCAwLCA3LCA3LCAxKTtcclxuICAgICAgICBVaUFzc2V0cy51aV9mcmFtZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCt3LTcqdXBzY2FsZVNpemUsIHkrNyp1cHNjYWxlU2l6ZSwgNyp1cHNjYWxlU2l6ZSwgaC0xNCp1cHNjYWxlU2l6ZSwgOCwgNywgNywgMSk7XHJcblxyXG4gICAgICAgIC8vIGNlbnRlclxyXG4gICAgICAgIFVpQXNzZXRzLnVpX2ZyYW1lLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4KzcqdXBzY2FsZVNpemUsIHkrNyp1cHNjYWxlU2l6ZSwgdy0xNCp1cHNjYWxlU2l6ZSwgaC0xNCp1cHNjYWxlU2l6ZSwgNywgNywgMSwgMSk7XHJcblxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgUmVuZGVyYWJsZSB9IGZyb20gJy4uL2ludGVyZmFjZXMvUmVuZGVyYWJsZSc7XHJcbmltcG9ydCBwNSBmcm9tICdwNSc7XHJcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gJy4vQnV0dG9uJztcclxuaW1wb3J0IHsgU2xpZGVyIH0gZnJvbSAnLi9TbGlkZXInO1xyXG5pbXBvcnQgeyBVaUZyYW1lIH0gZnJvbSAnLi9VaUZyYW1lJztcclxuaW1wb3J0IHsgZ2FtZSB9IGZyb20gJy4uL0dhbWUnO1xyXG5pbXBvcnQgeyBJbnB1dEJveCB9IGZyb20gJy4vSW5wdXRCb3gnO1xyXG5pbXBvcnQgeyBVaUFzc2V0cyB9IGZyb20gJy4uL2Fzc2V0cy9Bc3NldHMnO1xyXG5pbXBvcnQgeyBGb250UmVzb3VyY2UgfSBmcm9tICcuLi9hc3NldHMvcmVzb3VyY2VzL0ZvbnRSZXNvdXJjZSc7XHJcblxyXG5cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFVpU2NyZWVuIGltcGxlbWVudHMgUmVuZGVyYWJsZSB7XHJcblxyXG4gICAgYnV0dG9uczogQnV0dG9uW107XHJcbiAgICBzbGlkZXJzOiBTbGlkZXJbXTtcclxuICAgIGlucHV0Qm94ZXM6IElucHV0Qm94W107XHJcbiAgICBzY3JvbGw/OiBudW1iZXI7XHJcbiAgICBtaW5TY3JvbGw6IG51bWJlciA9IDA7XHJcbiAgICBtYXhTY3JvbGw6IG51bWJlciA9IDA7XHJcblxyXG4gICAgZnJhbWU6IFVpRnJhbWVcclxuXHJcblxyXG4gICAgdGl0bGVGb250OiBGb250UmVzb3VyY2VcclxuXHJcbiAgICBhYnN0cmFjdCByZW5kZXIodGFyZ2V0OiBwNSwgdXBzY2FsZVNpemU6IG51bWJlcik6IHZvaWQ7XHJcblxyXG4gICAgYWJzdHJhY3Qgd2luZG93VXBkYXRlKCk6IHZvaWRcclxuXHJcbiAgICBtb3VzZVByZXNzZWQoYnRuOiBudW1iZXIpIHtcclxuICAgICAgICBpZih0aGlzLmJ1dHRvbnMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAvLyBsb29wIHRocm91Z2ggYWxsIHRoZSBidXR0b25zIGluIHRoaXMgbWVudSBhbmQgaWYgdGhlIG1vdXNlIGlzIG92ZXIgdGhlbSwgdGhlbiBjYWxsIHRoZSBidXR0b24ncyBvblByZXNzZWQoKSBmdW5jdGlvbi4gIFRoZSBvblByZXNzZWQoKSBmdW5jdGlvbiBpcyBwYXNzZWQgaW4gdGhyb3VnaCB0aGUgY29uc3RydWN0b3IuXHJcbiAgICAgICAgICAgIGZvcihjb25zdCBpIG9mIHRoaXMuYnV0dG9ucykge1xyXG4gICAgICAgICAgICAgICAgaWYoaS5tb3VzZUlzT3Zlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGkub25QcmVzc2VkKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMuc2xpZGVycyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIC8vIGxvb3AgdGhyb3VnaCBhbGwgdGhlIHNsaWRlcnMgYW5kIGludGVyYWN0IHdpdGggdGhlbSBhY2NvcmRpbmdseVxyXG4gICAgICAgICAgICBmb3IoY29uc3QgaSBvZiB0aGlzLnNsaWRlcnMpIHtcclxuICAgICAgICAgICAgICAgIGkudXBkYXRlU2xpZGVyUG9zaXRpb24oZ2FtZS5tb3VzZVgpO1xyXG4gICAgICAgICAgICAgICAgaWYoZ2FtZS5tb3VzZVg+aS54ICYmIGdhbWUubW91c2VYPGkueCtpLncgJiYgZ2FtZS5tb3VzZVk+aS55ICYmIGdhbWUubW91c2VZPGkueStpLmgpXHJcbiAgICAgICAgICAgICAgICAgICAgaS5iZWluZ0VkaXRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5pbnB1dEJveGVzICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyh0aGlzLmlucHV0Qm94ZXMpO1xyXG4gICAgICAgICAgICAvLyBsb29wIHRocm91Z2ggYWxsIHRoZSBpbnB1dCBib3hlcyBhbmQgaW50ZXJhY3Qgd2l0aCB0aGVtIGFjY29yZGluZ2x5XHJcbiAgICAgICAgICAgIGZvcihjb25zdCBpIG9mIHRoaXMuaW5wdXRCb3hlcykge1xyXG4gICAgICAgICAgICAgICAgaWYoaS5tb3VzZUlzT3Zlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGkub25QcmVzc2VkKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmKGkubGlzdGVuaW5nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaS5saXN0ZW5pbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBnYW1lLmNvbnRyb2xzW2kuaW5kZXhdLmtleUNvZGUgPSBidG47XHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS5jb250cm9sc1tpLmluZGV4XS5rZXlib2FyZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGkudmFsdWUgPSBidG47XHJcbiAgICAgICAgICAgICAgICAgICAgaS5rZXlib2FyZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGkuaW1hZ2UgPSBVaUFzc2V0cy5idXR0b25fdW5zZWxlY3RlZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBtb3VzZVJlbGVhc2VkKCkge1xyXG4gICAgICAgIGlmKHRoaXMuc2xpZGVycyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIC8vIGxvb3AgdGhyb3VnaCBhbGwgdGhlIHNsaWRlcnMgYW5kIGludGVyYWN0IHdpdGggdGhlbSBhY2NvcmRpbmdseVxyXG4gICAgICAgICAgICBmb3IoY29uc3QgaSBvZiB0aGlzLnNsaWRlcnMpIHtcclxuICAgICAgICAgICAgICAgIGkuYmVpbmdFZGl0ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgeyBVaVNjcmVlbiB9IGZyb20gJy4uL1VpU2NyZWVuJztcclxuaW1wb3J0IHA1IGZyb20gJ3A1JztcclxuaW1wb3J0IHsgVWlGcmFtZSB9IGZyb20gJy4uL1VpRnJhbWUnO1xyXG5pbXBvcnQgeyBnYW1lIH0gZnJvbSAnLi4vLi4vR2FtZSc7XHJcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gJy4uL0J1dHRvbic7XHJcbmltcG9ydCB7IEZvbnRSZXNvdXJjZSB9IGZyb20gJy4uLy4uL2Fzc2V0cy9yZXNvdXJjZXMvRm9udFJlc291cmNlJztcclxuaW1wb3J0IHsgT3B0aW9uc01lbnUgfSBmcm9tICcuL09wdGlvbnNNZW51JztcclxuaW1wb3J0IHsgSW5wdXRCb3ggfSBmcm9tICcuLi9JbnB1dEJveCc7XHJcbmltcG9ydCB7IENvbnRyb2wgfSBmcm9tICcuLi8uLi9pbnB1dC9Db250cm9sJ1xyXG5cclxuZXhwb3J0IGNsYXNzIENvbnRyb2xzTWVudSBleHRlbmRzIFVpU2NyZWVuIHtcclxuXHJcblx0Y29uc3RydWN0b3IoZm9udDogRm9udFJlc291cmNlLCB0aXRsZUZvbnQ6IEZvbnRSZXNvdXJjZSwgcHJldmlvdXNNZW51OiBzdHJpbmcpIHtcclxuXHRcdHN1cGVyKCk7XHJcblx0XHQvLyBtYWtlIHRoZSBmcmFtZSB3aXRoIHNvbWUgZGVmYXVsdCB2YWx1ZXMuICBUaGVzZSB3aWxsIGxhdGVyIGJlIGNoYW5nZWQgdG8gZml0IHRoZSBzY3JlZW4gc2l6ZS5cclxuXHRcdHRoaXMuZnJhbWUgPSBuZXcgVWlGcmFtZSgwLCAwLCAwLCAwKTtcclxuXHJcblx0XHQvLyBtYWtlIHNvbWUgYnV0dG9ucyB3aXRoIGRlZmF1bHQgcG9zaXRpb25zXHJcblx0XHR0aGlzLmJ1dHRvbnMgPSBbXHJcblx0XHRcdG5ldyBCdXR0b24oZm9udCwgXCJCYWNrXCIsIFwiUmV0dXJuIHRvIHRoZSBvcHRpb25zIG1lbnUuXCIsIDAsIDAsIDAsIDAsICgpID0+IHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhcIm9wdGlvbnMgbWVudVwiKTtcclxuXHRcdFx0XHRnYW1lLmN1cnJlbnRVaSA9IG5ldyBPcHRpb25zTWVudShmb250LCB0aXRsZUZvbnQsIHByZXZpb3VzTWVudSk7XHJcblx0XHRcdH0pXHJcblx0XHRdO1xyXG5cclxuXHRcdHRoaXMuaW5wdXRCb3hlcyA9IFtcclxuXHRcdFx0Ly8gbmV3IElucHV0Qm94KGZvbnQsIFwiV2FsayBSaWdodFwiLCB0cnVlLCA2OCwgMCwgMCwgMCwgMCwgMCksXHJcblx0XHRcdC8vIG5ldyBJbnB1dEJveChmb250LCBcIldhbGsgTGVmdFwiLCB0cnVlLCA2NSwgMSwgMCwgMCwgMCwgMCksXHJcblx0XHRcdC8vIG5ldyBJbnB1dEJveChmb250LCBcIkp1bXBcIiwgdHJ1ZSwgMzIsIDIsIDAsIDAsIDAsIDApLFxyXG5cdFx0XHQvLyBuZXcgSW5wdXRCb3goZm9udCwgXCJQYXVzZVwiLCB0cnVlLCAyNywgMywgMCwgMCwgMCwgMClcclxuXHRcdF1cclxuXHJcblx0XHRsZXQgaSA9IDA7XHJcblx0XHRmb3IgKGxldCBjb250cm9sIG9mIGdhbWUuY29udHJvbHMpIHtcclxuXHRcdFx0aSsrO1xyXG5cdFx0XHR0aGlzLmlucHV0Qm94ZXMucHVzaChuZXcgSW5wdXRCb3goZm9udCwgY29udHJvbC5kZXNjcmlwdGlvbiwgY29udHJvbC5rZXlib2FyZCwgY29udHJvbC5rZXlDb2RlLCBpLCAwLCAwLCAwLCAwKSk7XHJcblx0XHR9XHJcblx0XHQvLyB1cGRhdGUgdGhlIHNpemUgb2YgdGhlIGVsZW1lbnRzIGJhc2VkIG9uIHRoZSBpbml0aWFsIHNjcmVlbiBzaXplXHJcblx0XHR0aGlzLndpbmRvd1VwZGF0ZSgpO1xyXG5cdH1cclxuXHJcblx0cmVuZGVyKHRhcmdldDogcDUsIHVwc2NhbGVTaXplOiBudW1iZXIpOiB2b2lkIHtcclxuXHJcblx0XHQvLyByZW5kZXIgdGhlIHJlY3Rhbmd1bGFyIGltYWdlXHJcblx0XHR0aGlzLmZyYW1lLnJlbmRlcih0YXJnZXQsIHVwc2NhbGVTaXplKTtcclxuXHJcblx0XHQvLyBsb29wIHRocm91Z2ggdGhlIGJ1dHRvbnMgYXJyYXkgYW5kIHJlbmRlciBlYWNoIG9uZS5cclxuXHRcdHRoaXMuYnV0dG9ucy5mb3JFYWNoKGJ1dHRvbiA9PiB7XHJcblx0XHRcdGJ1dHRvbi5yZW5kZXIodGFyZ2V0LCB1cHNjYWxlU2l6ZSk7XHJcblx0XHR9KTtcclxuXHJcblx0XHQvLyBsb29wIHRocm91Z2ggdGhlIGlucHV0Qm94ZXMgYXJyYXkgYW5kIHJlbmRlciBlYWNoIG9uZS5cclxuXHRcdHRoaXMuaW5wdXRCb3hlcy5mb3JFYWNoKGlucHV0Qm94ID0+IHtcclxuXHRcdFx0aW5wdXRCb3gucmVuZGVyKHRhcmdldCwgdXBzY2FsZVNpemUpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHR3aW5kb3dVcGRhdGUoKSB7XHJcblx0XHQvLyBzZXQgdGhlIHBvc2l0aW9uIG9mIHRoZSBmcmFtZVxyXG5cdFx0dGhpcy5mcmFtZS54ID0gZ2FtZS53aWR0aCAvIDIgLSAyMDAgLyAyICogZ2FtZS51cHNjYWxlU2l6ZTsvLyBjZW50ZXIgdGhlIGZyYW1lIGluIHRoZSBjZW50ZXIgb2YgdGhlIHNjcmVlblxyXG5cdFx0dGhpcy5mcmFtZS55ID0gZ2FtZS5oZWlnaHQgLyAyIC0gNTYgKiBnYW1lLnVwc2NhbGVTaXplO1xyXG5cdFx0dGhpcy5mcmFtZS53ID0gMjAwICogZ2FtZS51cHNjYWxlU2l6ZTtcclxuXHRcdHRoaXMuZnJhbWUuaCA9IDQ4ICogZ2FtZS51cHNjYWxlU2l6ZTtcclxuXHR9XHJcbn0iLCJpbXBvcnQgeyBVaVNjcmVlbiB9IGZyb20gJy4uL1VpU2NyZWVuJztcclxuaW1wb3J0IHA1IGZyb20gJ3A1JztcclxuaW1wb3J0IHsgVWlGcmFtZSB9IGZyb20gJy4uL1VpRnJhbWUnO1xyXG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tICcuLi9CdXR0b24nO1xyXG5pbXBvcnQgeyBPcHRpb25zTWVudSB9IGZyb20gJy4vT3B0aW9uc01lbnUnO1xyXG5pbXBvcnQgeyBGb250UmVzb3VyY2UgfSBmcm9tICcuLi8uLi9hc3NldHMvcmVzb3VyY2VzL0ZvbnRSZXNvdXJjZSc7XHJcbmltcG9ydCB7IFVpQXNzZXRzIH0gZnJvbSAnLi4vLi4vYXNzZXRzL0Fzc2V0cyc7XHJcbmltcG9ydCB7IFdvcmxkQ3JlYXRpb25NZW51IH0gZnJvbSAnLi9Xb3JsZENyZWF0aW9uTWVudSc7XHJcbmltcG9ydCB7IGdhbWUgfSBmcm9tICcuLi8uLi9HYW1lJztcclxuXHJcbmV4cG9ydCBjbGFzcyBNYWluTWVudSBleHRlbmRzIFVpU2NyZWVuIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihmb250OiBGb250UmVzb3VyY2UsIHRpdGxlRm9udDogRm9udFJlc291cmNlKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgLy8gbWFrZSB0aGUgZnJhbWUgd2l0aCBzb21lIGRlZmF1bHQgdmFsdWVzLiAgVGhlc2Ugd2lsbCBsYXRlciBiZSBjaGFuZ2VkIHRvIGZpdCB0aGUgc2NyZWVuIHNpemUuXHJcbiAgICAgICAgdGhpcy5mcmFtZSA9IG5ldyBVaUZyYW1lKDAsIDAsIDAsIDApO1xyXG5cclxuICAgICAgICAvLyBtYWtlIDQgYnV0dG9ucyB3aXRoIGRlZmF1bHQgcG9zaXRpb25zXHJcbiAgICAgICAgdGhpcy5idXR0b25zID0gW1xyXG4gICAgICAgICAgICBuZXcgQnV0dG9uKGZvbnQsIFwiSm9pbiBHYW1lXCIsIFwiSm9pbiBhIGdhbWUgd2l0aCB5b3VyIGZyaWVuZHMsIG9yIG1ha2UgbmV3IG9uZXMuXCIsIDAsIDAsIDAsIDAsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiam9pbiBnYW1lXCIpO1xyXG4gICAgICAgICAgICAgICAgaWYoZ2FtZS53b3JsZD09dW5kZWZpbmVkKXJldHVybjsvL2lmIHRoZXJlJ3Mgbm8gd29ybGQsIHRoZXJlJ3Mgbm8gcG9pbnQuXHJcbiAgICAgICAgICAgICAgICBnYW1lLmN1cnJlbnRVaSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIG5ldyBCdXR0b24oZm9udCwgXCJPcHRpb25zXCIsIFwiQ2hhbmdlIHlvdXIga2V5YmluZHMsIHJlZHVjZSBsYWcsIGV0Yy5cIiwgMCwgMCwgMCwgMCwgKCkgPT57XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm9wdGlvbnNcIik7XHJcbiAgICAgICAgICAgICAgICBnYW1lLmN1cnJlbnRVaSA9IG5ldyBPcHRpb25zTWVudShmb250LCB0aXRsZUZvbnQsIFwibWFpbiBtZW51XCIpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIF07XHJcblxyXG4gICAgICAgIC8vIHVwZGF0ZSB0aGUgc2l6ZSBvZiB0aGUgZWxlbWVudHMgYmFzZWQgb24gdGhlIGluaXRpYWwgc2NyZWVuIHNpemVcclxuICAgICAgICB0aGlzLndpbmRvd1VwZGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcih0YXJnZXQ6IHA1LCB1cHNjYWxlU2l6ZTogbnVtYmVyKTogdm9pZCB7XHJcblxyXG4gICAgICAgIC8vIHJlbmRlciB0aGUgcmVjdGFuZ3VsYXIgaW1hZ2UgdGhhdCB0aGUgd2hvbGUgbWVudSBpcyBvblxyXG4gICAgICAgIHRoaXMuZnJhbWUucmVuZGVyKHRhcmdldCwgdXBzY2FsZVNpemUpO1xyXG5cclxuICAgICAgICBVaUFzc2V0cy50aXRsZV9pbWFnZS5yZW5kZXIodGFyZ2V0LCBNYXRoLnJvdW5kKHRoaXMuZnJhbWUueC91cHNjYWxlU2l6ZSsxKSp1cHNjYWxlU2l6ZSwgTWF0aC5yb3VuZCh0aGlzLmZyYW1lLnkvdXBzY2FsZVNpemUrNCkqdXBzY2FsZVNpemUsIDI1Nip1cHNjYWxlU2l6ZSwgNDAqdXBzY2FsZVNpemUpO1xyXG5cclxuICAgICAgICAvLyBsb29wIHRocm91Z2ggdGhlIGJ1dHRvbnMgYXJyYXkgYW5kIHJlbmRlciBlYWNoIG9uZS5cclxuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdGhpcy5idXR0b25zKSB7XHJcbiAgICAgICAgICAgIGl0ZW0ucmVuZGVyKHRhcmdldCwgdXBzY2FsZVNpemUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgd2luZG93VXBkYXRlKCkge1xyXG4gICAgICAgIC8vIHNldCB0aGUgcG9zaXRpb24gb2YgdGhlIGZyYW1lXHJcbiAgICAgICAgdGhpcy5mcmFtZS54ID0gZ2FtZS53aWR0aC8yLTI2NC8yKmdhbWUudXBzY2FsZVNpemU7Ly8gY2VudGVyIHRoZSBmcmFtZSBpbiB0aGUgbWlkZGxlIG9mIHRoZSBzY3JlZW5cclxuICAgICAgICB0aGlzLmZyYW1lLnkgPSBnYW1lLmhlaWdodC8yLTU2KmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgdGhpcy5mcmFtZS53ID0gMjY0KmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgdGhpcy5mcmFtZS5oID0gNDgqZ2FtZS51cHNjYWxlU2l6ZTtcclxuXHJcbiAgICAgICAgLy8gc2V0IHRoZSBwb3NpdGlvbnMgb2YgYWxsIHRoZSBidXR0b25zXHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaTx0aGlzLmJ1dHRvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLnggPSBnYW1lLndpZHRoLzItMTkyLzIqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLnkgPSBnYW1lLmhlaWdodC8yKzIwKmkqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLncgPSAxOTIqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLmggPSAxNipnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0udXBkYXRlTW91c2VPdmVyKGdhbWUubW91c2VYLCBnYW1lLm1vdXNlWSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgeyBVaVNjcmVlbiB9IGZyb20gJy4uL1VpU2NyZWVuJztcclxuaW1wb3J0IHA1IGZyb20gJ3A1JztcclxuaW1wb3J0IHsgVWlGcmFtZSB9IGZyb20gJy4uL1VpRnJhbWUnO1xyXG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tICcuLi9CdXR0b24nO1xyXG5pbXBvcnQgeyBGb250UmVzb3VyY2UgfSBmcm9tICcuLi8uLi9hc3NldHMvcmVzb3VyY2VzL0ZvbnRSZXNvdXJjZSc7XHJcbmltcG9ydCB7IE1haW5NZW51IH0gZnJvbSAnLi9NYWluTWVudSc7XHJcbmltcG9ydCB7IFZpZGVvU2V0dGluZ3NNZW51IH0gZnJvbSAnLi9WaWRlb1NldHRpbmdzTWVudSc7XHJcbmltcG9ydCB7IENvbnRyb2xzTWVudSB9IGZyb20gJy4vQ29udHJvbHNNZW51JztcclxuaW1wb3J0IHsgZ2FtZSB9IGZyb20gJy4uLy4uL0dhbWUnO1xyXG5pbXBvcnQgeyBQYXVzZU1lbnUgfSBmcm9tICcuL1BhdXNlTWVudSc7XHJcblxyXG5leHBvcnQgY2xhc3MgT3B0aW9uc01lbnUgZXh0ZW5kcyBVaVNjcmVlbiB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZm9udDogRm9udFJlc291cmNlLCB0aXRsZUZvbnQ6IEZvbnRSZXNvdXJjZSwgcHJldmlvdXNNZW51OiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIC8vIG1ha2UgdGhlIGZyYW1lIHdpdGggc29tZSBkZWZhdWx0IHZhbHVlcy4gIFRoZXNlIHdpbGwgbGF0ZXIgYmUgY2hhbmdlZCB0byBmaXQgdGhlIHNjcmVlbiBzaXplLlxyXG4gICAgICAgIHRoaXMuZnJhbWUgPSBuZXcgVWlGcmFtZSgwLCAwLCAwLCAwKTtcclxuICAgICAgICB0aGlzLnRpdGxlRm9udCA9IHRpdGxlRm9udDtcclxuICAgICAgICAvLyBtYWtlIHNvbWUgYnV0dG9ucyB3aXRoIGRlZmF1bHQgcG9zaXRpb25zXHJcbiAgICAgICAgdGhpcy5idXR0b25zID0gW1xyXG4gICAgICAgICAgICBuZXcgQnV0dG9uKGZvbnQsIFwiVmlkZW8gU2V0dGluZ3NcIiwgXCJDaGFuZ2UgdGhlIGJhbGFuY2UgYmV0d2VlbiBwZXJmb3JtYW5jZSBhbmQgZmlkZWxpdHkuXCIsIDAsIDAsIDAsIDAsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidmlkZW8gc2V0dGluZ3NcIik7XHJcbiAgICAgICAgICAgICAgICBnYW1lLmN1cnJlbnRVaSA9IG5ldyBWaWRlb1NldHRpbmdzTWVudShmb250LCB0aXRsZUZvbnQsIHByZXZpb3VzTWVudSk7XHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBuZXcgQnV0dG9uKGZvbnQsIFwiQ29udHJvbHNcIiwgXCJDaGFuZ2UgeW91ciBrZXliaW5kcy5cIiwgMCwgMCwgMCwgMCwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJjb250cm9sIG1lbnVcIik7XHJcbiAgICAgICAgICAgICAgICBnYW1lLmN1cnJlbnRVaSA9IG5ldyBDb250cm9sc01lbnUoZm9udCwgdGl0bGVGb250LCBwcmV2aW91c01lbnUpO1xyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgLy8gbmV3IEJ1dHRvbihmb250LCBcIkF1ZGlvIFNldHRpbmdzXCIsIFwiQ2hhbmdlIHRoZSB2b2x1bWUgb2YgZGlmZmVyZW50IHNvdW5kcy5cIiwgMCwgMCwgMCwgMCwgKCkgPT4ge1xyXG4gICAgICAgICAgICAvLyAgICAgY29uc29sZS5sb2coXCJhdWRpbyBtZW51XCIpO1xyXG4gICAgICAgICAgICAvLyAgICAgZ2FtZS5jdXJyZW50VWkgPSBuZXcgQXVkaW9TZXR0aW5nc01lbnUoZm9udCwgdGl0bGVGb250KTtcclxuICAgICAgICAgICAgLy8gfSksXHJcbiAgICAgICAgICAgIG5ldyBCdXR0b24oZm9udCwgXCJCYWNrXCIsIFwiUmV0dXJuIHRvIHRoZSBcIitwcmV2aW91c01lbnUrXCIuXCIsIDAsIDAsIDAsIDAsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmKHByZXZpb3VzTWVudT09PVwibWFpbiBtZW51XCIpZ2FtZS5jdXJyZW50VWkgPSBuZXcgTWFpbk1lbnUoZm9udCwgdGl0bGVGb250KTtcclxuICAgICAgICAgICAgICAgIGVsc2UgZ2FtZS5jdXJyZW50VWkgPSBuZXcgUGF1c2VNZW51KGZvbnQsIHRpdGxlRm9udClcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICBdO1xyXG4gICAgICAgIC8vIHVwZGF0ZSB0aGUgc2l6ZSBvZiB0aGUgZWxlbWVudHMgYmFzZWQgb24gdGhlIGluaXRpYWwgc2NyZWVuIHNpemVcclxuICAgICAgICB0aGlzLndpbmRvd1VwZGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcih0YXJnZXQ6IHA1LCB1cHNjYWxlU2l6ZTogbnVtYmVyKTogdm9pZCB7XHJcblxyXG4gICAgICAgIC8vIHJlbmRlciB0aGUgcmVjdGFuZ3VsYXIgaW1hZ2UgdGhhdCB0aGUgd2hvbGUgbWVudSBpcyBvblxyXG4gICAgICAgIHRoaXMuZnJhbWUucmVuZGVyKHRhcmdldCwgdXBzY2FsZVNpemUpO1xyXG5cclxuICAgICAgICAvLyBsb29wIHRocm91Z2ggdGhlIGJ1dHRvbnMgYXJyYXkgYW5kIHJlbmRlciBlYWNoIG9uZS5cclxuICAgICAgICB0aGlzLmJ1dHRvbnMuZm9yRWFjaChidXR0b24gPT4ge1xyXG4gICAgICAgICAgICBidXR0b24ucmVuZGVyKHRhcmdldCwgdXBzY2FsZVNpemUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnRpdGxlRm9udC5kcmF3VGV4dCh0YXJnZXQsIFwiT3B0aW9uc1wiLCB0aGlzLmZyYW1lLnggKyA1NCpnYW1lLnVwc2NhbGVTaXplLCB0aGlzLmZyYW1lLnkgKyAxNipnYW1lLnVwc2NhbGVTaXplKVxyXG4gICAgfVxyXG5cclxuICAgIHdpbmRvd1VwZGF0ZSgpIHtcclxuICAgICAgICAvLyBzZXQgdGhlIHBvc2l0aW9uIG9mIHRoZSBmcmFtZVxyXG4gICAgICAgIHRoaXMuZnJhbWUueCA9IGdhbWUud2lkdGgvMi0yMDAvMipnYW1lLnVwc2NhbGVTaXplOy8vIGNlbnRlciB0aGUgZnJhbWUgaW4gdGhlIGNlbnRlciBvZiB0aGUgc2NyZWVuXHJcbiAgICAgICAgdGhpcy5mcmFtZS55ID0gZ2FtZS5oZWlnaHQvMi01NipnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgIHRoaXMuZnJhbWUudyA9IDIwMCpnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgIHRoaXMuZnJhbWUuaCA9IDQ4KmdhbWUudXBzY2FsZVNpemU7XHJcblxyXG4gICAgICAgIC8vIHNldCB0aGUgcG9zaXRpb25zIG9mIGFsbCB0aGUgYnV0dG9uc1xyXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGk8dGhpcy5idXR0b25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS54ID0gZ2FtZS53aWR0aC8yLTE5Mi8yKmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS55ID0gZ2FtZS5oZWlnaHQvMisyMCppKmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS53ID0gMTkyKmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS5oID0gMTYqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLnVwZGF0ZU1vdXNlT3ZlcihnYW1lLm1vdXNlWCwgZ2FtZS5tb3VzZVkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgeyBVaVNjcmVlbiB9IGZyb20gJy4uL1VpU2NyZWVuJztcclxuaW1wb3J0IHA1IGZyb20gJ3A1JztcclxuaW1wb3J0IHsgVWlGcmFtZSB9IGZyb20gJy4uL1VpRnJhbWUnO1xyXG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tICcuLi9CdXR0b24nO1xyXG5pbXBvcnQgeyBPcHRpb25zTWVudSB9IGZyb20gJy4vT3B0aW9uc01lbnUnO1xyXG5pbXBvcnQgeyBGb250UmVzb3VyY2UgfSBmcm9tICcuLi8uLi9hc3NldHMvcmVzb3VyY2VzL0ZvbnRSZXNvdXJjZSc7XHJcbmltcG9ydCB7IE1haW5NZW51IH0gZnJvbSAnLi9NYWluTWVudSc7XHJcbmltcG9ydCB7IGdhbWUgfSBmcm9tICcuLi8uLi9HYW1lJztcclxuXHJcbmV4cG9ydCBjbGFzcyBQYXVzZU1lbnUgZXh0ZW5kcyBVaVNjcmVlbiB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZm9udDogRm9udFJlc291cmNlLCB0aXRsZUZvbnQ6IEZvbnRSZXNvdXJjZSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIC8vIG1ha2UgdGhlIGZyYW1lIHdpdGggc29tZSBkZWZhdWx0IHZhbHVlcy4gIFRoZXNlIHdpbGwgbGF0ZXIgYmUgY2hhbmdlZCB0byBmaXQgdGhlIHNjcmVlbiBzaXplLlxyXG4gICAgICAgIHRoaXMuZnJhbWUgPSBuZXcgVWlGcmFtZSgwLCAwLCAwLCAwKTtcclxuXHJcbiAgICAgICAgdGhpcy50aXRsZUZvbnQgPSB0aXRsZUZvbnQ7XHJcblxyXG4gICAgICAgIC8vIG1ha2UgNCBidXR0b25zIHdpdGggZGVmYXVsdCBwb3NpdFNpb25zXHJcbiAgICAgICAgdGhpcy5idXR0b25zID0gW1xyXG4gICAgICAgICAgICBuZXcgQnV0dG9uKGZvbnQsIFwiUmVzdW1lIGdhbWVcIiwgXCJHbyBiYWNrIHRvIHRoZSBnYW1lLlwiLCAwLCAwLCAwLCAwLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBnYW1lLmN1cnJlbnRVaSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIG5ldyBCdXR0b24oZm9udCwgXCJPcHRpb25zXCIsIFwiQ2hhbmdlIHlvdXIga2V5YmluZHMsIHJlZHVjZSBsYWcsIGV0Yy5cIiwgMCwgMCwgMCwgMCwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZ2FtZS5jdXJyZW50VWkgPSBuZXcgT3B0aW9uc01lbnUoZm9udCwgdGl0bGVGb250LCBcInBhdXNlIG1lbnVcIik7XHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBuZXcgQnV0dG9uKGZvbnQsIFwiTGVhdmUgZ2FtZVwiLCBcIkdvIGJhY2sgdG8gTWFpbiBNZW51XCIsIDAsIDAsIDAsIDAsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGdhbWUuY3VycmVudFVpID0gbmV3IE1haW5NZW51KGZvbnQsIHRpdGxlRm9udCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgXTtcclxuXHJcbiAgICAgICAgLy8gdXBkYXRlIHRoZSBzaXplIG9mIHRoZSBlbGVtZW50cyBiYXNlZCBvbiB0aGUgaW5pdGlhbCBzY3JlZW4gc2l6ZVxyXG4gICAgICAgIHRoaXMud2luZG93VXBkYXRlKCk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHJlbmRlcih0YXJnZXQ6IHA1LCB1cHNjYWxlU2l6ZTogbnVtYmVyKTogdm9pZCB7XHJcblxyXG4gICAgICAgIC8vIHJlbmRlciB0aGUgcmVjdGFuZ3VsYXIgaW1hZ2UgdGhhdCB0aGUgd2hvbGUgbWVudSBpcyBvblxyXG4gICAgICAgIHRoaXMuZnJhbWUucmVuZGVyKHRhcmdldCwgdXBzY2FsZVNpemUpO1xyXG5cclxuICAgICAgICAvLyBsb29wIHRocm91Z2ggdGhlIGJ1dHRvbnMgYXJyYXkgYW5kIHJlbmRlciBlYWNoIG9uZS5cclxuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdGhpcy5idXR0b25zKSB7XHJcbiAgICAgICAgICAgIGl0ZW0ucmVuZGVyKHRhcmdldCwgdXBzY2FsZVNpemUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy50aXRsZUZvbnQuZHJhd1RleHQodGFyZ2V0LCBcIlBhdXNlZFwiLCB0aGlzLmZyYW1lLnggKyA1NCpnYW1lLnVwc2NhbGVTaXplLCB0aGlzLmZyYW1lLnkgKyAxNipnYW1lLnVwc2NhbGVTaXplKVxyXG5cclxuICAgIH1cclxuXHJcbiAgICB3aW5kb3dVcGRhdGUoKSB7XHJcbiAgICAgICAgLy8gc2V0IHRoZSBwb3NpdGlvbiBvZiB0aGUgZnJhbWVcclxuICAgICAgICB0aGlzLmZyYW1lLnggPSBnYW1lLndpZHRoLzItMjAwLzIqZ2FtZS51cHNjYWxlU2l6ZTsvLyBjZW50ZXIgdGhlIGZyYW1lIGluIHRoZSBtaWRkbGUgb2YgdGhlIHNjcmVlblxyXG4gICAgICAgIHRoaXMuZnJhbWUueSA9IGdhbWUuaGVpZ2h0LzItNzIqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICB0aGlzLmZyYW1lLncgPSAyMDAqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICB0aGlzLmZyYW1lLmggPSA1NCpnYW1lLnVwc2NhbGVTaXplO1xyXG5cclxuICAgICAgICAvLyBzZXQgdGhlIHBvc2l0aW9ucyBvZiBhbGwgdGhlIGJ1dHRvbnNcclxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpPHRoaXMuYnV0dG9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0ueCA9IGdhbWUud2lkdGgvMi0xOTIvMipnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0ueSA9IGdhbWUuaGVpZ2h0LzIrMjAqaSpnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0udyA9IDE5MipnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0uaCA9IDE2KmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS51cGRhdGVNb3VzZU92ZXIoZ2FtZS5tb3VzZVgsIGdhbWUubW91c2VZKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCB7IFVpU2NyZWVuIH0gZnJvbSAnLi4vVWlTY3JlZW4nO1xyXG5pbXBvcnQgcDUgZnJvbSAncDUnO1xyXG5pbXBvcnQgeyBVaUZyYW1lIH0gZnJvbSAnLi4vVWlGcmFtZSc7XHJcbmltcG9ydCB7IGdhbWUgfSBmcm9tICcuLi8uLi9HYW1lJztcclxuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSAnLi4vQnV0dG9uJztcclxuaW1wb3J0IHsgRm9udFJlc291cmNlIH0gZnJvbSAnLi4vLi4vYXNzZXRzL3Jlc291cmNlcy9Gb250UmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBPcHRpb25zTWVudSB9IGZyb20gJy4vT3B0aW9uc01lbnUnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFZpZGVvU2V0dGluZ3NNZW51IGV4dGVuZHMgVWlTY3JlZW4ge1xyXG5cclxuXHRjb25zdHJ1Y3Rvcihmb250OiBGb250UmVzb3VyY2UsIHRpdGxlRm9udDogRm9udFJlc291cmNlLCBwcmV2aW91c01lbnU6IHN0cmluZykge1xyXG5cdFx0c3VwZXIoKTtcclxuXHRcdC8vIG1ha2UgdGhlIGZyYW1lIHdpdGggc29tZSBkZWZhdWx0IHZhbHVlcy4gIFRoZXNlIHdpbGwgbGF0ZXIgYmUgY2hhbmdlZCB0byBmaXQgdGhlIHNjcmVlbiBzaXplLlxyXG5cdFx0dGhpcy5mcmFtZSA9IG5ldyBVaUZyYW1lKDAsIDAsIDAsIDApO1xyXG5cclxuXHJcblx0XHRpZihnYW1lLnNreU1vZCA9PT0gdW5kZWZpbmVkKVxyXG5cdFx0XHRnYW1lLnNreU1vZCA9IDI7XHJcblxyXG5cdFx0aWYoZ2FtZS5za3lUb2dnbGUgPT09IHVuZGVmaW5lZClcclxuXHRcdFx0Z2FtZS5za3lUb2dnbGUgPSB0cnVlO1xyXG5cclxuXHRcdGlmKGdhbWUucGFydGljbGVNdWx0aXBsaWVyID09PSB1bmRlZmluZWQpXHJcblx0XHRcdGdhbWUucGFydGljbGVNdWx0aXBsaWVyID0gMTtcclxuXHJcblx0XHRsZXQgdGVtcFNreU1vZGVUZXh0O1xyXG5cclxuXHRcdGlmKGdhbWUuc2t5TW9kPT09Mikge1xyXG5cdFx0XHR0ZW1wU2t5TW9kZVRleHQgPSBcIkhhbGYgRnJhbWVyYXRlXCI7XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmKGdhbWUuc2t5TW9kPT09MSkge1xyXG5cdFx0XHR0ZW1wU2t5TW9kZVRleHQgPSBcIkZ1bGwgRnJhbWVyYXRlXCI7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0dGVtcFNreU1vZGVUZXh0ID0gXCJTb2xpZCBDb2xvclwiO1xyXG5cdFx0fVxyXG5cclxuXHRcdGxldCB0ZW1wUGFydGljbGVUZXh0O1xyXG5cclxuXHRcdGlmKGdhbWUucGFydGljbGVNdWx0aXBsaWVyPT09Mikge1xyXG5cdFx0XHR0ZW1wUGFydGljbGVUZXh0ID0gXCJEb3VibGVcIjtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYoZ2FtZS5wYXJ0aWNsZU11bHRpcGxpZXI9PT0xKSB7XHJcblx0XHRcdHRlbXBQYXJ0aWNsZVRleHQgPSBcIk5vcm1hbFwiO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHRlbXBQYXJ0aWNsZVRleHQgPSBcIk1pbmltYWxcIjtcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gbWFrZSBzb21lIGJ1dHRvbnMgd2l0aCBkZWZhdWx0IHBvc2l0aW9uc1xyXG5cdFx0dGhpcy5idXR0b25zID0gW1xyXG5cdFx0XHRuZXcgQnV0dG9uKGZvbnQsIGBTa3k6ICR7dGVtcFNreU1vZGVUZXh0fWAsIFwiQ2hhbmdlIHRoZSBhcHBlYXJhbmNlIG9mIHRoZSBza3kuXCIsIDAsIDAsIDAsIDAsICgpID0+IHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhcInNreSB0b2dnbGVcIik7XHJcblx0XHRcdFx0aWYodGhpcy5idXR0b25zWzBdLnR4dCA9PT0gXCJTa3k6IEhhbGYgRnJhbWVyYXRlXCIpe1xyXG5cdFx0XHRcdFx0dGhpcy5idXR0b25zWzBdLnR4dCA9IFwiU2t5OiBGdWxsIEZyYW1lcmF0ZVwiO1xyXG5cdFx0XHRcdFx0Z2FtZS5za3lNb2QgPSAxO1xyXG5cdFx0XHRcdFx0Z2FtZS5za3lUb2dnbGUgPSB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIGlmKHRoaXMuYnV0dG9uc1swXS50eHQgPT09IFwiU2t5OiBGdWxsIEZyYW1lcmF0ZVwiKSB7XHJcblx0XHRcdFx0XHR0aGlzLmJ1dHRvbnNbMF0udHh0ID0gXCJTa3k6IFNvbGlkIENvbG9yXCI7XHJcblx0XHRcdFx0XHRnYW1lLnNreVRvZ2dsZSA9IGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMuYnV0dG9uc1swXS50eHQgPSBcIlNreTogSGFsZiBGcmFtZXJhdGVcIjtcclxuXHRcdFx0XHRcdGdhbWUuc2t5TW9kID0gMjtcclxuXHRcdFx0XHRcdGdhbWUuc2t5VG9nZ2xlID0gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pLFxyXG5cdFx0XHRuZXcgQnV0dG9uKGZvbnQsIGBQYXJ0aWNsZXM6ICR7dGVtcFBhcnRpY2xlVGV4dH1gLCBcIkNoYW5nZSB0aGUgYW1vdW50IG9mIHBhcnRpY2xlc1wiLCAwLCAwLCAwLCAwLCAoKSA9PiB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJwYXJ0aWNsZXNcIik7XHJcblx0XHRcdFx0aWYodGhpcy5idXR0b25zWzFdLnR4dCA9PT0gXCJQYXJ0aWNsZXM6IE5vcm1hbFwiKXtcclxuXHRcdFx0XHRcdHRoaXMuYnV0dG9uc1sxXS50eHQgPSBcIlBhcnRpY2xlczogRG91YmxlXCI7XHJcblx0XHRcdFx0XHRnYW1lLnBhcnRpY2xlTXVsdGlwbGllciA9IDI7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2UgaWYodGhpcy5idXR0b25zWzFdLnR4dCA9PT0gXCJQYXJ0aWNsZXM6IERvdWJsZVwiKSB7XHJcblx0XHRcdFx0XHR0aGlzLmJ1dHRvbnNbMV0udHh0ID0gXCJQYXJ0aWNsZXM6IE1pbmltYWxcIjtcclxuXHRcdFx0XHRcdGdhbWUucGFydGljbGVNdWx0aXBsaWVyID0gMC41O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMuYnV0dG9uc1sxXS50eHQgPSBcIlBhcnRpY2xlczogTm9ybWFsXCI7XHJcblx0XHRcdFx0XHRnYW1lLnBhcnRpY2xlTXVsdGlwbGllciA9IDE7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KSxcclxuXHRcdFx0bmV3IEJ1dHRvbihmb250LCBcIkJhY2tcIiwgXCJSZXR1cm4gdG8gdGhlIG1haW4gbWVudS5cIiwgMCwgMCwgMCwgMCwgKCkgPT4ge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKFwibWFpbiBtZW51XCIpO1xyXG5cdFx0XHRcdGdhbWUuY3VycmVudFVpID0gbmV3IE9wdGlvbnNNZW51KGZvbnQsIHRpdGxlRm9udCwgcHJldmlvdXNNZW51KTtcclxuXHRcdFx0fSlcclxuXHRcdF07XHJcblx0XHQvLyB1cGRhdGUgdGhlIHNpemUgb2YgdGhlIGVsZW1lbnRzIGJhc2VkIG9uIHRoZSBpbml0aWFsIHNjcmVlbiBzaXplXHJcblx0XHR0aGlzLndpbmRvd1VwZGF0ZSgpO1xyXG5cdH1cclxuXHJcblx0cmVuZGVyKHRhcmdldDogcDUsIHVwc2NhbGVTaXplOiBudW1iZXIpOiB2b2lkIHtcclxuXHJcblx0XHQvLyByZW5kZXIgdGhlIHJlY3Rhbmd1bGFyIGltYWdlXHJcblx0XHR0aGlzLmZyYW1lLnJlbmRlcih0YXJnZXQsIHVwc2NhbGVTaXplKTtcclxuXHJcblx0XHQvLyBsb29wIHRocm91Z2ggdGhlIGJ1dHRvbnMgYXJyYXkgYW5kIHJlbmRlciBlYWNoIG9uZS5cclxuXHRcdHRoaXMuYnV0dG9ucy5mb3JFYWNoKGJ1dHRvbiA9PiB7XHJcblx0XHRcdGJ1dHRvbi5yZW5kZXIodGFyZ2V0LCB1cHNjYWxlU2l6ZSk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdHdpbmRvd1VwZGF0ZSgpIHtcclxuXHRcdC8vIHNldCB0aGUgcG9zaXRpb24gb2YgdGhlIGZyYW1lXHJcblx0XHR0aGlzLmZyYW1lLnggPSBnYW1lLndpZHRoIC8gMiAtIDIwMCAvIDIgKiBnYW1lLnVwc2NhbGVTaXplOy8vIGNlbnRlciB0aGUgZnJhbWUgaW4gdGhlIGNlbnRlciBvZiB0aGUgc2NyZWVuXHJcblx0XHR0aGlzLmZyYW1lLnkgPSBnYW1lLmhlaWdodCAvIDIgLSA1NiAqIGdhbWUudXBzY2FsZVNpemU7XHJcblx0XHR0aGlzLmZyYW1lLncgPSAyMDAgKiBnYW1lLnVwc2NhbGVTaXplO1xyXG5cdFx0dGhpcy5mcmFtZS5oID0gNDggKiBnYW1lLnVwc2NhbGVTaXplO1xyXG5cclxuXHRcdC8vIHNldCB0aGUgcG9zaXRpb25zIG9mIGFsbCB0aGUgYnV0dG9uc1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmJ1dHRvbnMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dGhpcy5idXR0b25zW2ldLnggPSBnYW1lLndpZHRoIC8gMiAtIDE5MiAvIDIgKiBnYW1lLnVwc2NhbGVTaXplO1xyXG5cdFx0XHR0aGlzLmJ1dHRvbnNbaV0ueSA9IGdhbWUuaGVpZ2h0IC8gMiArIDIwICogaSAqIGdhbWUudXBzY2FsZVNpemU7XHJcblx0XHRcdHRoaXMuYnV0dG9uc1tpXS53ID0gMTkyICogZ2FtZS51cHNjYWxlU2l6ZTtcclxuXHRcdFx0dGhpcy5idXR0b25zW2ldLmggPSAxNiAqIGdhbWUudXBzY2FsZVNpemU7XHJcblx0XHRcdHRoaXMuYnV0dG9uc1tpXS51cGRhdGVNb3VzZU92ZXIoZ2FtZS5tb3VzZVgsIGdhbWUubW91c2VZKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG59IiwiaW1wb3J0IFA1IGZyb20gJ3A1JztcclxuaW1wb3J0IHsgVGlja2FibGUgfSBmcm9tICcuLi9pbnRlcmZhY2VzL1RpY2thYmxlJztcclxuaW1wb3J0IHsgUmVuZGVyYWJsZSB9IGZyb20gJy4uL2ludGVyZmFjZXMvUmVuZGVyYWJsZSc7XHJcbmltcG9ydCB7IGdhbWUsIEdhbWUgfSBmcm9tICcuLi9HYW1lJztcclxuaW1wb3J0IHsgUGxheWVyTG9jYWwgfSBmcm9tICcuLi9wbGF5ZXIvUGxheWVyTG9jYWwnO1xyXG5pbXBvcnQgeyBTZXJ2ZXJFbnRpdHkgfSBmcm9tICcuL2VudGl0aWVzL1NlcnZlckVudGl0eSc7XHJcbmltcG9ydCB7IFNuYXBzaG90SW50ZXJwb2xhdGlvbiB9IGZyb20gJ0BnZWNrb3MuaW8vc25hcHNob3QtaW50ZXJwb2xhdGlvbic7XHJcbmltcG9ydCB7IEVudGl0eSwgU25hcHNob3QgfSBmcm9tICdAZ2Vja29zLmlvL3NuYXBzaG90LWludGVycG9sYXRpb24vbGliL3R5cGVzJztcclxuaW1wb3J0IHsgV29ybGRUaWxlcyB9IGZyb20gJy4vV29ybGRUaWxlcyc7XHJcbmltcG9ydCB7IFRpbGVUeXBlIH0gZnJvbSAnLi4vLi4vZ2xvYmFsL1RpbGUnO1xyXG5pbXBvcnQgeyBJbnZlbnRvcnkgfSBmcm9tICcuLi9wbGF5ZXIvSW52ZW50b3J5JztcclxuaW1wb3J0IHsgVGlsZUVudGl0eVBheWxvYWQgfSBmcm9tICcuLi8uLi9nbG9iYWwvVGlsZUVudGl0eSc7XHJcbmltcG9ydCB7IENsaWVudFRpbGVFbnRpdHkgfSBmcm9tICcuL2VudGl0aWVzL1RpbGVFbnRpdHknO1xyXG5pbXBvcnQgeyBXb3JsZEFzc2V0cyB9IGZyb20gJy4uL2Fzc2V0cy9Bc3NldHMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdvcmxkIGltcGxlbWVudHMgVGlja2FibGUsIFJlbmRlcmFibGUge1xyXG5cdHdpZHRoOiBudW1iZXI7IC8vIHdpZHRoIG9mIHRoZSB3b3JsZCBpbiB0aWxlc1xyXG5cdGhlaWdodDogbnVtYmVyOyAvLyBoZWlnaHQgb2YgdGhlIHdvcmxkIGluIHRpbGVzXHJcblxyXG5cdHRpbGVMYXllcjogUDUuR3JhcGhpY3M7IC8vIFRpbGUgbGF5ZXIgZ3JhcGhpY1xyXG5cclxuXHR3b3JsZFRpbGVzOiAoVGlsZVR5cGUgfCBzdHJpbmcpW107IC8vIG51bWJlciBmb3IgZWFjaCB0aWxlcyBpbiB0aGUgd29ybGQgZXg6IFsxLCAxLCAwLCAxLCAyLCAwLCAwLCAxLi4uICBdIG1lYW5zIHNub3csIHNub3csIGFpciwgc25vdywgaWNlLCBhaXIsIGFpciwgc25vdy4uLiAgc3RyaW5nIGlzIGlkIGZvciB0aWxlIGVudGl0eSBvY2N1cHlpbmcgdGhhdCB0aWxlXHJcblxyXG5cdHBsYXllcjogUGxheWVyTG9jYWw7XHJcblxyXG5cdGludmVudG9yeTogSW52ZW50b3J5O1xyXG5cclxuXHRlbnRpdGllczogeyBbaWQ6IHN0cmluZ106IFNlcnZlckVudGl0eSB9ID0ge307XHJcblxyXG5cdHRpbGVFbnRpdHlQYXlsb2FkczogeyBbaWQ6IHN0cmluZ106IFRpbGVFbnRpdHlQYXlsb2FkIH07XHJcblx0dGlsZUVudGl0aWVzOiB7IFtpZDogc3RyaW5nXTogQ2xpZW50VGlsZUVudGl0eSB9O1xyXG5cclxuXHRzbmFwc2hvdEludGVycG9sYXRpb246IFNuYXBzaG90SW50ZXJwb2xhdGlvbjtcclxuXHJcblx0Y29uc3RydWN0b3IoXHJcblx0XHR3aWR0aDogbnVtYmVyLFxyXG5cdFx0aGVpZ2h0OiBudW1iZXIsXHJcblx0XHR0aWxlczogKFRpbGVUeXBlIHwgc3RyaW5nKVtdLFxyXG5cdFx0dGlsZUVudGl0aWVzOiB7IFtpZDogc3RyaW5nXTogQ2xpZW50VGlsZUVudGl0eSB9LFxyXG5cdCkge1xyXG5cdFx0Ly8gSW5pdGlhbGl6ZSB0aGUgd29ybGQgd2l0aCB0aGUgdGlsZXMgYW5kIGRpbWVuc2lvbnMgZnJvbSB0aGUgc2VydmVyXHJcblx0XHR0aGlzLndpZHRoID0gd2lkdGg7XHJcblx0XHR0aGlzLmhlaWdodCA9IGhlaWdodDtcclxuXHRcdHRoaXMud29ybGRUaWxlcyA9IHRpbGVzO1xyXG5cdFx0dGhpcy50aWxlRW50aXRpZXMgPSB0aWxlRW50aXRpZXM7XHJcblxyXG5cdFx0dGhpcy5zbmFwc2hvdEludGVycG9sYXRpb24gPSBuZXcgU25hcHNob3RJbnRlcnBvbGF0aW9uKCk7XHJcblx0XHR0aGlzLnNuYXBzaG90SW50ZXJwb2xhdGlvbi5pbnRlcnBvbGF0aW9uQnVmZmVyLnNldChcclxuXHRcdFx0KDEwMDAgLyBnYW1lLm5ldE1hbmFnZXIucGxheWVyVGlja1JhdGUpICogMixcclxuXHRcdCk7XHJcblxyXG5cdFx0Ly8gZGVmaW5lIHRoZSBwNS5HcmFwaGljcyBvYmplY3RzIHRoYXQgaG9sZCBhbiBpbWFnZSBvZiB0aGUgdGlsZXMgb2YgdGhlIHdvcmxkLiAgVGhlc2UgYWN0IHNvcnQgb2YgbGlrZSBhIHZpcnR1YWwgY2FudmFzIGFuZCBjYW4gYmUgZHJhd24gb24ganVzdCBsaWtlIGEgbm9ybWFsIGNhbnZhcyBieSB1c2luZyB0aWxlTGF5ZXIucmVjdCgpOywgdGlsZUxheWVyLmVsbGlwc2UoKTssIHRpbGVMYXllci5maWxsKCk7LCBldGMuXHJcblx0XHR0aGlzLnRpbGVMYXllciA9IGdhbWUuY3JlYXRlR3JhcGhpY3MoXHJcblx0XHRcdHRoaXMud2lkdGggKiBnYW1lLlRJTEVfV0lEVEgsXHJcblx0XHRcdHRoaXMuaGVpZ2h0ICogZ2FtZS5USUxFX0hFSUdIVCxcclxuXHRcdCk7XHJcblx0XHR0aGlzLmxvYWRXb3JsZCgpO1xyXG5cdH1cclxuXHJcblx0dGljayhnYW1lOiBHYW1lKSB7XHJcblx0XHRpZiAodGhpcy5wbGF5ZXIgIT09IHVuZGVmaW5lZClcclxuXHRcdFx0Z2FtZS5jb25uZWN0aW9uLmVtaXQoJ3BsYXllclVwZGF0ZScsIHRoaXMucGxheWVyLngsIHRoaXMucGxheWVyLnkpO1xyXG5cdH1cclxuXHJcblx0cmVuZGVyKHRhcmdldDogUDUsIHVwc2NhbGVTaXplOiBudW1iZXIpIHtcclxuXHRcdC8vIGRyYXcgdGhlIHRpbGVzIGxheWVyIG9udG8gdGhlIHNjcmVlblxyXG5cdFx0dGFyZ2V0LmltYWdlKFxyXG5cdFx0XHR0aGlzLnRpbGVMYXllcixcclxuXHRcdFx0MCxcclxuXHRcdFx0MCxcclxuXHRcdFx0KGdhbWUud2lkdGggLyB1cHNjYWxlU2l6ZSkgKiB1cHNjYWxlU2l6ZSxcclxuXHRcdFx0KGdhbWUuaGVpZ2h0IC8gdXBzY2FsZVNpemUpICogdXBzY2FsZVNpemUsXHJcblx0XHRcdGdhbWUuaW50ZXJwb2xhdGVkQ2FtWCAqIGdhbWUuVElMRV9XSURUSCxcclxuXHRcdFx0Z2FtZS5pbnRlcnBvbGF0ZWRDYW1ZICogZ2FtZS5USUxFX1dJRFRILFxyXG5cdFx0XHRnYW1lLndpZHRoIC8gdXBzY2FsZVNpemUsXHJcblx0XHRcdGdhbWUuaGVpZ2h0IC8gdXBzY2FsZVNpemUsXHJcblx0XHQpO1xyXG5cclxuXHRcdHRoaXMucmVuZGVyUGxheWVycyh0YXJnZXQsIHVwc2NhbGVTaXplKTtcclxuXHJcblx0XHQvLyB0YXJnZXQuc3Ryb2tlKDApO1xyXG5cdFx0Ly8gdGFyZ2V0LnN0cm9rZVdlaWdodCg0KTtcclxuXHRcdC8vIHRhcmdldC5ub0ZpbGwoKTtcclxuXHRcdC8vIHRhcmdldC5yZWN0KHRhcmdldC53aWR0aCAtIHRoaXMud2lkdGgsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcclxuXHJcblx0XHQvLyB0YXJnZXQuaW1hZ2UoXHJcblx0XHQvLyBcdHRoaXMudGlsZUxheWVyLFxyXG5cdFx0Ly8gXHR0YXJnZXQud2lkdGggLSB0aGlzLndpZHRoLFxyXG5cdFx0Ly8gXHQwLFxyXG5cdFx0Ly8gXHR0aGlzLndpZHRoLFxyXG5cdFx0Ly8gXHR0aGlzLmhlaWdodCxcclxuXHRcdC8vICk7XHJcblx0fVxyXG5cclxuXHR1cGRhdGVQbGF5ZXJzKHNuYXBzaG90OiBTbmFwc2hvdCkge1xyXG5cdFx0dGhpcy5zbmFwc2hvdEludGVycG9sYXRpb24uc25hcHNob3QuYWRkKHNuYXBzaG90KTtcclxuXHR9XHJcblxyXG5cdHVwZGF0ZVRpbGUodGlsZUluZGV4OiBudW1iZXIsIHRpbGU6IFRpbGVUeXBlKSB7XHJcblx0XHQvLyBVcGRhdGUgdGhlIHRpbGUgYW5kIHRoZSA0IG5laWdoYm91cmluZyB0aWxlc1xyXG5cdFx0dGhpcy53b3JsZFRpbGVzW3RpbGVJbmRleF0gPSB0aWxlO1xyXG5cclxuXHRcdC8vIGVyYXNlIHRoZSBicm9rZW4gdGlsZXMgYW5kIGl0cyBzdXJyb3VuZGluZyB0aWxlcyBpZiB0aGV5J3JlIHRpbGVzXHJcblx0XHR0aGlzLnRpbGVMYXllci5lcmFzZSgpO1xyXG5cdFx0dGhpcy50aWxlTGF5ZXIubm9TdHJva2UoKTtcclxuXHRcdHRoaXMudGlsZUxheWVyLnJlY3QoXHJcblx0XHRcdC8vY2VudGVyXHJcblx0XHRcdCh0aWxlSW5kZXggJSB0aGlzLndpZHRoKSAqIGdhbWUuVElMRV9XSURUSCxcclxuXHRcdFx0TWF0aC5mbG9vcih0aWxlSW5kZXggLyB0aGlzLndpZHRoKSAqIGdhbWUuVElMRV9IRUlHSFQsXHJcblx0XHRcdGdhbWUuVElMRV9XSURUSCxcclxuXHRcdFx0Z2FtZS5USUxFX0hFSUdIVCxcclxuXHRcdCk7XHJcblxyXG5cdFx0aWYgKFxyXG5cdFx0XHR0aWxlSW5kZXggLSAxID49IDAgJiZcclxuXHRcdFx0dHlwZW9mIHRoaXMud29ybGRUaWxlc1t0aWxlSW5kZXggLSAxXSAhPT0gJ3N0cmluZycgJiZcclxuXHRcdFx0dGhpcy53b3JsZFRpbGVzW3RpbGVJbmRleCAtIDFdICE9PSBUaWxlVHlwZS5BaXJcclxuXHRcdCkge1xyXG5cdFx0XHR0aGlzLnRpbGVMYXllci5yZWN0KFxyXG5cdFx0XHRcdC8vbGVmdFxyXG5cdFx0XHRcdCgodGlsZUluZGV4ICUgdGhpcy53aWR0aCkgLSAxKSAqIGdhbWUuVElMRV9XSURUSCxcclxuXHRcdFx0XHRNYXRoLmZsb29yKHRpbGVJbmRleCAvIHRoaXMud2lkdGgpICogZ2FtZS5USUxFX0hFSUdIVCxcclxuXHRcdFx0XHRnYW1lLlRJTEVfV0lEVEgsXHJcblx0XHRcdFx0Z2FtZS5USUxFX0hFSUdIVCxcclxuXHRcdFx0KTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoXHJcblx0XHRcdHRpbGVJbmRleCArIDEgPCB0aGlzLndpZHRoICogdGhpcy5oZWlnaHQgJiZcclxuXHRcdFx0dHlwZW9mIHRoaXMud29ybGRUaWxlc1t0aWxlSW5kZXggKyAxXSAhPT0gJ3N0cmluZycgJiZcclxuXHRcdFx0dGhpcy53b3JsZFRpbGVzW3RpbGVJbmRleCArIDFdICE9PSBUaWxlVHlwZS5BaXJcclxuXHRcdCkge1xyXG5cdFx0XHR0aGlzLnRpbGVMYXllci5yZWN0KFxyXG5cdFx0XHRcdC8vcmlnaHRcclxuXHRcdFx0XHQoKHRpbGVJbmRleCAlIHRoaXMud2lkdGgpIC0gMSkgKiBnYW1lLlRJTEVfV0lEVEgsXHJcblx0XHRcdFx0TWF0aC5mbG9vcih0aWxlSW5kZXggLyB0aGlzLndpZHRoKSAqIGdhbWUuVElMRV9IRUlHSFQsXHJcblx0XHRcdFx0Z2FtZS5USUxFX1dJRFRILFxyXG5cdFx0XHRcdGdhbWUuVElMRV9IRUlHSFQsXHJcblx0XHRcdCk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKFxyXG5cdFx0XHR0aWxlSW5kZXggLSB0aGlzLndpZHRoID49IDAgJiZcclxuXHRcdFx0dHlwZW9mIHRoaXMud29ybGRUaWxlc1t0aWxlSW5kZXggLSB0aGlzLndpZHRoXSAhPT0gJ3N0cmluZycgJiZcclxuXHRcdFx0dGhpcy53b3JsZFRpbGVzW3RpbGVJbmRleCAtIHRoaXMud2lkdGhdICE9PSBUaWxlVHlwZS5BaXJcclxuXHRcdCkge1xyXG5cdFx0XHR0aGlzLnRpbGVMYXllci5yZWN0KFxyXG5cdFx0XHRcdC8vdG9wXHJcblx0XHRcdFx0KHRpbGVJbmRleCAlIHRoaXMud2lkdGgpICogZ2FtZS5USUxFX1dJRFRILFxyXG5cdFx0XHRcdChNYXRoLmZsb29yKHRpbGVJbmRleCAvIHRoaXMud2lkdGgpIC0gMSkgKiBnYW1lLlRJTEVfSEVJR0hULFxyXG5cdFx0XHRcdGdhbWUuVElMRV9XSURUSCxcclxuXHRcdFx0XHRnYW1lLlRJTEVfSEVJR0hULFxyXG5cdFx0XHQpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKFxyXG5cdFx0XHR0aWxlSW5kZXggKyB0aGlzLndpZHRoIDwgdGhpcy53aWR0aCAqIHRoaXMuaGVpZ2h0ICYmXHJcblx0XHRcdHR5cGVvZiB0aGlzLndvcmxkVGlsZXNbdGlsZUluZGV4ICsgdGhpcy53aWR0aF0gIT09ICdzdHJpbmcnICYmXHJcblx0XHRcdHRoaXMud29ybGRUaWxlc1t0aWxlSW5kZXggKyB0aGlzLndpZHRoXSAhPT0gVGlsZVR5cGUuQWlyXHJcblx0XHQpIHtcclxuXHRcdFx0dGhpcy50aWxlTGF5ZXIucmVjdChcclxuXHRcdFx0XHQvL2JvdHRvbVxyXG5cdFx0XHRcdCh0aWxlSW5kZXggJSB0aGlzLndpZHRoKSAqIGdhbWUuVElMRV9XSURUSCxcclxuXHRcdFx0XHQoTWF0aC5mbG9vcih0aWxlSW5kZXggLyB0aGlzLndpZHRoKSArIDEpICogZ2FtZS5USUxFX0hFSUdIVCxcclxuXHRcdFx0XHRnYW1lLlRJTEVfV0lEVEgsXHJcblx0XHRcdFx0Z2FtZS5USUxFX0hFSUdIVCxcclxuXHRcdFx0KTtcclxuXHRcdH1cclxuXHRcdHRoaXMudGlsZUxheWVyLm5vRXJhc2UoKTtcclxuXHJcblx0XHQvLyByZWRyYXcgdGhlIG5laWdoYm9yaW5nIHRpbGVzXHJcblx0XHR0aGlzLmRyYXdUaWxlKHRpbGVJbmRleCk7XHJcblx0XHR0aGlzLmRyYXdUaWxlKHRpbGVJbmRleCArIHRoaXMud2lkdGgpO1xyXG5cdFx0dGhpcy5kcmF3VGlsZSh0aWxlSW5kZXggLSAxKTtcclxuXHRcdHRoaXMuZHJhd1RpbGUodGlsZUluZGV4IC0gdGhpcy53aWR0aCk7XHJcblx0XHR0aGlzLmRyYXdUaWxlKHRpbGVJbmRleCArIDEpO1xyXG5cdH1cclxuXHJcblx0cmVuZGVyUGxheWVycyh0YXJnZXQ6IFA1LCB1cHNjYWxlU2l6ZTogbnVtYmVyKSB7XHJcblx0XHQvLyBDYWxjdWxhdGUgdGhlIGludGVycG9sYXRlZCBwb3NpdGlvbiBvZiBhbGwgdXBkYXRlZCBlbnRpdGllc1xyXG5cdFx0Y29uc3QgcG9zaXRpb25TdGF0ZXM6IHsgW2lkOiBzdHJpbmddOiB7IHg6IG51bWJlcjsgeTogbnVtYmVyIH0gfSA9IHt9O1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0Y29uc3QgY2FsY3VsYXRlZFNuYXBzaG90ID1cclxuXHRcdFx0XHR0aGlzLnNuYXBzaG90SW50ZXJwb2xhdGlvbi5jYWxjSW50ZXJwb2xhdGlvbigneCB5Jyk7XHJcblx0XHRcdGlmICghY2FsY3VsYXRlZFNuYXBzaG90KSByZXR1cm47XHJcblxyXG5cdFx0XHRjb25zdCBzdGF0ZSA9IGNhbGN1bGF0ZWRTbmFwc2hvdC5zdGF0ZTtcclxuXHRcdFx0aWYgKCFzdGF0ZSkgcmV0dXJuO1xyXG5cclxuXHRcdFx0Ly8gVGhlIG5ldyBwb3NpdGlvbnMgb2YgZW50aXRpZXMgYXMgb2JqZWN0XHJcblx0XHRcdHN0YXRlLmZvckVhY2goKHsgaWQsIHgsIHkgfTogRW50aXR5ICYgeyB4OiBudW1iZXI7IHk6IG51bWJlciB9KSA9PiB7XHJcblx0XHRcdFx0cG9zaXRpb25TdGF0ZXNbaWRdID0geyB4LCB5IH07XHJcblx0XHRcdH0pO1xyXG5cdFx0fSBjYXRjaCAoZSkge31cclxuXHJcblx0XHQvLyBSZW5kZXIgZWFjaCBlbnRpdHkgaW4gcmFuZG9tIG9yZGVyXHJcblx0XHRPYmplY3QuZW50cmllcyh0aGlzLmVudGl0aWVzKS5mb3JFYWNoKFxyXG5cdFx0XHQoZW50aXR5OiBbc3RyaW5nLCBTZXJ2ZXJFbnRpdHldKSA9PiB7XHJcblx0XHRcdFx0Y29uc3QgdXBkYXRlZFBvc2l0aW9uID0gcG9zaXRpb25TdGF0ZXNbZW50aXR5WzBdXTtcclxuXHRcdFx0XHRpZiAodXBkYXRlZFBvc2l0aW9uICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHRcdGVudGl0eVsxXS54ID0gdXBkYXRlZFBvc2l0aW9uLng7XHJcblx0XHRcdFx0XHRlbnRpdHlbMV0ueSA9IHVwZGF0ZWRQb3NpdGlvbi55O1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0ZW50aXR5WzFdLnJlbmRlcih0YXJnZXQsIHVwc2NhbGVTaXplKTtcclxuXHRcdFx0fSxcclxuXHRcdCk7XHJcblxyXG5cdFx0Ly8gUmVuZGVyIHRoZSBwbGF5ZXIgb24gdG9wXHJcblx0XHRpZiAodGhpcy5wbGF5ZXIgIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHR0aGlzLnBsYXllci5maW5kSW50ZXJwb2xhdGVkQ29vcmRpbmF0ZXMoKTtcclxuXHRcdFx0dGhpcy5wbGF5ZXIucmVuZGVyKHRhcmdldCwgdXBzY2FsZVNpemUpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0bG9hZFdvcmxkKCkge1xyXG5cdFx0dGhpcy50aWxlTGF5ZXIubm9TdHJva2UoKTtcclxuXHRcdHRoaXMudGlsZUxheWVyLmZpbGwoMjU1LCAwLCAwKTtcclxuXHRcdGZvciAobGV0IHggPSAwOyB4IDwgdGhpcy5oZWlnaHQ7IHgrKykge1xyXG5cdFx0XHQvL3ggYW5kIHkgYXJlIHN3aXRjaGVkIGZvciBzb21lIHN0dXBpZCByZWFzb25cclxuXHRcdFx0Ly8gaSB3aWxsIGJlIHRoZSB5IHBvc2l0aW9uIG9mIHRpbGVzIGJlaW5nIGRyYXduXHJcblx0XHRcdGZvciAobGV0IHkgPSAwOyB5IDwgdGhpcy53aWR0aDsgeSsrKSB7XHJcblx0XHRcdFx0Y29uc3QgdGlsZVZhbCA9IHRoaXMud29ybGRUaWxlc1t4ICogdGhpcy53aWR0aCArIHldO1xyXG5cclxuXHRcdFx0XHRpZiAodHlwZW9mIHRpbGVWYWwgPT09ICdzdHJpbmcnKSB7XHJcblx0XHRcdFx0XHRpZiAodGhpcy50aWxlRW50aXRpZXMgPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yKCd0aWxlIGVudGl0eSBhcnJheSBpcyB1bmRlZmluZWQnKTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRpZiAodGhpcy50aWxlRW50aXRpZXNbdGlsZVZhbF0gPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yKFxyXG5cdFx0XHRcdFx0XHRcdCd0aWxlIGVudGl0eSAnICsgdGlsZVZhbCArICcgaXMgdW5kZWZpbmVkJyxcclxuXHRcdFx0XHRcdFx0KTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRjb25zdCB0b3BMZWZ0ID0gTWF0aC5taW4oXHJcblx0XHRcdFx0XHRcdC4uLnRoaXMudGlsZUVudGl0aWVzW3RpbGVWYWxdLmNvdmVyZWRUaWxlcyxcclxuXHRcdFx0XHRcdCk7XHJcblx0XHRcdFx0XHRpZiAoeCAqIHRoaXMud2lkdGggKyB5ID09PSB0b3BMZWZ0KSB7XHJcblx0XHRcdFx0XHRcdC8vcmVuZGVyIHRpbGUgZW50aXR5IGltYWdlXHJcblx0XHRcdFx0XHRcdGxldCBpbWcgPVxyXG5cdFx0XHRcdFx0XHRcdFdvcmxkQXNzZXRzLnRpbGVFbnRpdGllc1tcclxuXHRcdFx0XHRcdFx0XHRcdHRoaXMudGlsZUVudGl0aWVzW3RpbGVWYWxdLnR5cGVfXHJcblx0XHRcdFx0XHRcdFx0XVt0aGlzLnRpbGVFbnRpdGllc1t0aWxlVmFsXS5hbmltRnJhbWVdO1xyXG5cdFx0XHRcdFx0XHRpbWcucmVuZGVyKFxyXG5cdFx0XHRcdFx0XHRcdHRoaXMudGlsZUxheWVyLFxyXG5cdFx0XHRcdFx0XHRcdHkgKiBnYW1lLlRJTEVfV0lEVEgsXHJcblx0XHRcdFx0XHRcdFx0eCAqIGdhbWUuVElMRV9IRUlHSFQsXHJcblx0XHRcdFx0XHRcdFx0aW1nLmltYWdlLndpZHRoLFxyXG5cdFx0XHRcdFx0XHRcdGltZy5pbWFnZS5oZWlnaHQsXHJcblx0XHRcdFx0XHRcdCk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKGBBbHJlYWR5IHJlbmRlcmVkICR7dGlsZVZhbH1gKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKHRpbGVWYWwgIT09IFRpbGVUeXBlLkFpcikge1xyXG5cdFx0XHRcdFx0Ly8gRHJhdyB0aGUgY29ycmVjdCBpbWFnZSBmb3IgdGhlIHRpbGVzIG9udG8gdGhlIHRpbGVzIGxheWVyXHJcblx0XHRcdFx0XHRjb25zdCB0aWxlID0gV29ybGRUaWxlc1t0aWxlVmFsXTtcclxuXHJcblx0XHRcdFx0XHRpZiAodGlsZSA9PT0gdW5kZWZpbmVkKSBjb250aW51ZTtcclxuXHJcblx0XHRcdFx0XHRpZiAodGlsZS5jb25uZWN0ZWQgJiYgJ3JlbmRlclRpbGUnIGluIHRpbGUudGV4dHVyZSkge1xyXG5cdFx0XHRcdFx0XHQvLyBSZW5kZXIgY29ubmVjdGVkIHRpbGVzXHJcblx0XHRcdFx0XHRcdHRpbGUudGV4dHVyZS5yZW5kZXJUaWxlKFxyXG5cdFx0XHRcdFx0XHRcdHRoaXMuZmluZFRpbGVzZXRJbmRleChcclxuXHRcdFx0XHRcdFx0XHRcdHgsXHJcblx0XHRcdFx0XHRcdFx0XHR5LFxyXG5cdFx0XHRcdFx0XHRcdFx0dGlsZVZhbCxcclxuXHRcdFx0XHRcdFx0XHRcdFdvcmxkVGlsZXNbdGlsZVZhbF0/LmFueUNvbm5lY3Rpb24sXHJcblx0XHRcdFx0XHRcdFx0KSxcclxuXHRcdFx0XHRcdFx0XHR0aGlzLnRpbGVMYXllcixcclxuXHRcdFx0XHRcdFx0XHR5ICogZ2FtZS5USUxFX1dJRFRILFxyXG5cdFx0XHRcdFx0XHRcdHggKiBnYW1lLlRJTEVfSEVJR0hULFxyXG5cdFx0XHRcdFx0XHRcdGdhbWUuVElMRV9XSURUSCxcclxuXHRcdFx0XHRcdFx0XHRnYW1lLlRJTEVfSEVJR0hULFxyXG5cdFx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0Ly8gUmVuZGVyIG5vbi1jb25uZWN0ZWQgdGlsZXNcclxuXHRcdFx0XHRcdFx0dGlsZS50ZXh0dXJlLnJlbmRlcihcclxuXHRcdFx0XHRcdFx0XHR0aGlzLnRpbGVMYXllcixcclxuXHRcdFx0XHRcdFx0XHR5ICogZ2FtZS5USUxFX1dJRFRILFxyXG5cdFx0XHRcdFx0XHRcdHggKiBnYW1lLlRJTEVfSEVJR0hULFxyXG5cdFx0XHRcdFx0XHRcdGdhbWUuVElMRV9XSURUSCxcclxuXHRcdFx0XHRcdFx0XHRnYW1lLlRJTEVfSEVJR0hULFxyXG5cdFx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZHJhd1RpbGUodGlsZUluZGV4OiBudW1iZXIpIHtcclxuXHRcdGNvbnN0IHggPSB0aWxlSW5kZXggJSB0aGlzLndpZHRoO1xyXG5cdFx0Y29uc3QgeSA9IE1hdGguZmxvb3IodGlsZUluZGV4IC8gdGhpcy53aWR0aCk7XHJcblxyXG5cdFx0aWYgKHRoaXMud29ybGRUaWxlc1t0aWxlSW5kZXhdICE9PSBUaWxlVHlwZS5BaXIpIHtcclxuXHRcdFx0Ly8gRHJhdyB0aGUgY29ycmVjdCBpbWFnZSBmb3IgdGhlIHRpbGVzIG9udG8gdGhlIHRpbGVzIGxheWVyXHJcblxyXG5cdFx0XHRjb25zdCB0aWxlVmFsID0gdGhpcy53b3JsZFRpbGVzW3RpbGVJbmRleF07XHJcblxyXG5cdFx0XHRpZiAodHlwZW9mIHRpbGVWYWwgPT09ICdzdHJpbmcnKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMudGlsZUVudGl0aWVzW3RpbGVWYWxdID09PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoJ3RpbGUgZW50aXR5ICcgKyB0aWxlVmFsICsgJyBpcyB1bmRlZmluZWQnKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGNvbnN0IHRvcExlZnQgPSBNYXRoLm1pbihcclxuXHRcdFx0XHRcdC4uLnRoaXMudGlsZUVudGl0aWVzW3RpbGVWYWxdLmNvdmVyZWRUaWxlcyxcclxuXHRcdFx0XHQpO1xyXG5cdFx0XHRcdGlmICh0aWxlSW5kZXggPT09IHRvcExlZnQpIHtcclxuXHRcdFx0XHRcdC8vcmVuZGVyIHRpbGUgZW50aXR5IGltYWdlXHJcblx0XHRcdFx0XHQvL3RoaXMudGlsZUVudGl0aWVzW3RpbGVWYWxdLnJlbmRlcih0aWxlTGF5ZXIsIHgqOCwgeSo4KTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhgQWxyZWFkeSByZW5kZXJlZCAke3RpbGVWYWx9YCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Y29uc3QgdGlsZSA9IFdvcmxkVGlsZXNbdGlsZVZhbF07XHJcblxyXG5cdFx0XHQvLyBpZiB0aGUgdGlsZXMgaXMgb2ZmLXNjcmVlblxyXG5cdFx0XHRpZiAodGlsZSA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAodGlsZS5jb25uZWN0ZWQgJiYgJ3JlbmRlclRpbGUnIGluIHRpbGUudGV4dHVyZSkge1xyXG5cdFx0XHRcdGxldCB0b3BUaWxlQm9vbCA9IGZhbHNlO1xyXG5cdFx0XHRcdGxldCBsZWZ0VGlsZUJvb2wgPSBmYWxzZTtcclxuXHRcdFx0XHRsZXQgYm90dG9tVGlsZUJvb2wgPSBmYWxzZTtcclxuXHRcdFx0XHRsZXQgcmlnaHRUaWxlQm9vbCA9IGZhbHNlO1xyXG5cdFx0XHRcdGlmICh0aWxlLmFueUNvbm5lY3Rpb24pIHtcclxuXHRcdFx0XHRcdC8vIHRlc3QgaWYgdGhlIG5laWdoYm9yaW5nIHRpbGVzIGFyZSBzb2xpZFxyXG5cdFx0XHRcdFx0dG9wVGlsZUJvb2wgPVxyXG5cdFx0XHRcdFx0XHR4ID09PSAwIHx8XHJcblx0XHRcdFx0XHRcdCh0aGlzLndvcmxkVGlsZXNbKHkgLSAxKSAqIHRoaXMud2lkdGggKyB4XSAhPT1cclxuXHRcdFx0XHRcdFx0XHRUaWxlVHlwZS5BaXIgJiZcclxuXHRcdFx0XHRcdFx0XHR0eXBlb2YgdGhpcy53b3JsZFRpbGVzWyh5IC0gMSkgKiB0aGlzLndpZHRoICsgeF0gIT09XHJcblx0XHRcdFx0XHRcdFx0XHQnc3RyaW5nJyk7XHJcblx0XHRcdFx0XHRsZWZ0VGlsZUJvb2wgPVxyXG5cdFx0XHRcdFx0XHR5ID09PSAwIHx8XHJcblx0XHRcdFx0XHRcdCh0aGlzLndvcmxkVGlsZXNbeSAqIHRoaXMud2lkdGggKyB4IC0gMV0gIT09XHJcblx0XHRcdFx0XHRcdFx0VGlsZVR5cGUuQWlyICYmXHJcblx0XHRcdFx0XHRcdFx0dHlwZW9mIHRoaXMud29ybGRUaWxlc1t5ICogdGhpcy53aWR0aCArIHggLSAxXSAhPT1cclxuXHRcdFx0XHRcdFx0XHRcdCdzdHJpbmcnKTtcclxuXHRcdFx0XHRcdGJvdHRvbVRpbGVCb29sID1cclxuXHRcdFx0XHRcdFx0eCA9PT0gdGhpcy5oZWlnaHQgLSAxIHx8XHJcblx0XHRcdFx0XHRcdCh0aGlzLndvcmxkVGlsZXNbKHkgKyAxKSAqIHRoaXMud2lkdGggKyB4XSAhPT1cclxuXHRcdFx0XHRcdFx0XHRUaWxlVHlwZS5BaXIgJiZcclxuXHRcdFx0XHRcdFx0XHR0eXBlb2YgdGhpcy53b3JsZFRpbGVzWyh5ICsgMSkgKiB0aGlzLndpZHRoICsgeF0gIT09XHJcblx0XHRcdFx0XHRcdFx0XHQnc3RyaW5nJyk7XHJcblx0XHRcdFx0XHRyaWdodFRpbGVCb29sID1cclxuXHRcdFx0XHRcdFx0eSA9PT0gdGhpcy53aWR0aCAtIDEgfHxcclxuXHRcdFx0XHRcdFx0KHRoaXMud29ybGRUaWxlc1t5ICogdGhpcy53aWR0aCArIHggKyAxXSAhPT1cclxuXHRcdFx0XHRcdFx0XHRUaWxlVHlwZS5BaXIgJiZcclxuXHRcdFx0XHRcdFx0XHR0eXBlb2YgdGhpcy53b3JsZFRpbGVzW3kgKiB0aGlzLndpZHRoICsgeCArIDFdICE9PVxyXG5cdFx0XHRcdFx0XHRcdFx0J3N0cmluZycpO1xyXG5cclxuXHRcdFx0XHRcdC8vIGNvbnNvbGUubG9nKFtcImJvcmluZ1wiLCBsZWZ0VGlsZUJvb2wsIGJvdHRvbVRpbGVCb29sLCB0aGlzLndvcmxkVGlsZXNbeCAqIHRoaXMud2lkdGggKyB5ICsgMV0sIHRvcFRpbGVCb29sXSlcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Ly8gdGVzdCBpZiB0aGUgbmVpZ2hib3JpbmcgdGlsZXMgYXJlIHRoZSBzYW1lIHRpbGVcclxuXHRcdFx0XHRcdHRvcFRpbGVCb29sID1cclxuXHRcdFx0XHRcdFx0eCA9PT0gMCB8fFxyXG5cdFx0XHRcdFx0XHR0aGlzLndvcmxkVGlsZXNbKHkgLSAxKSAqIHRoaXMud2lkdGggKyB4XSA9PT0gdGlsZVZhbDtcclxuXHRcdFx0XHRcdGxlZnRUaWxlQm9vbCA9XHJcblx0XHRcdFx0XHRcdHkgPT09IDAgfHxcclxuXHRcdFx0XHRcdFx0dGhpcy53b3JsZFRpbGVzW3kgKiB0aGlzLndpZHRoICsgeCAtIDFdID09PSB0aWxlVmFsO1xyXG5cdFx0XHRcdFx0Ym90dG9tVGlsZUJvb2wgPVxyXG5cdFx0XHRcdFx0XHR4ID09PSB0aGlzLmhlaWdodCAtIDEgfHxcclxuXHRcdFx0XHRcdFx0dGhpcy53b3JsZFRpbGVzWyh5ICsgMSkgKiB0aGlzLndpZHRoICsgeF0gPT09IHRpbGVWYWw7XHJcblx0XHRcdFx0XHRyaWdodFRpbGVCb29sID1cclxuXHRcdFx0XHRcdFx0eSA9PT0gdGhpcy53aWR0aCAtIDEgfHxcclxuXHRcdFx0XHRcdFx0dGhpcy53b3JsZFRpbGVzW3kgKiB0aGlzLndpZHRoICsgeCArIDFdID09PSB0aWxlVmFsO1xyXG5cdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhbXCJmYW5jeVwiLCBsZWZ0VGlsZUJvb2wsIGJvdHRvbVRpbGVCb29sLCByaWdodFRpbGVCb29sLCB0b3BUaWxlQm9vbF0pXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRoaXMud29ybGRUaWxlc1t0aWxlSW5kZXggKyAxXSAhPT0gVGlsZVR5cGUuQWlyO1xyXG5cclxuXHRcdFx0XHQvLyBjb252ZXJ0IDQgZGlnaXQgYmluYXJ5IG51bWJlciB0byBiYXNlIDEwXHJcblx0XHRcdFx0Y29uc3QgdGlsZVNldEluZGV4ID1cclxuXHRcdFx0XHRcdDggKiArdG9wVGlsZUJvb2wgK1xyXG5cdFx0XHRcdFx0NCAqICtyaWdodFRpbGVCb29sICtcclxuXHRcdFx0XHRcdDIgKiArYm90dG9tVGlsZUJvb2wgK1xyXG5cdFx0XHRcdFx0K2xlZnRUaWxlQm9vbDtcclxuXHJcblx0XHRcdFx0Ly8gUmVuZGVyIGNvbm5lY3RlZCB0aWxlc1xyXG5cdFx0XHRcdHRpbGUudGV4dHVyZS5yZW5kZXJUaWxlKFxyXG5cdFx0XHRcdFx0dGlsZVNldEluZGV4LFxyXG5cdFx0XHRcdFx0dGhpcy50aWxlTGF5ZXIsXHJcblx0XHRcdFx0XHR4ICogZ2FtZS5USUxFX1dJRFRILFxyXG5cdFx0XHRcdFx0eSAqIGdhbWUuVElMRV9IRUlHSFQsXHJcblx0XHRcdFx0XHRnYW1lLlRJTEVfV0lEVEgsXHJcblx0XHRcdFx0XHRnYW1lLlRJTEVfSEVJR0hULFxyXG5cdFx0XHRcdCk7XHJcblx0XHRcdH0gZWxzZSBpZiAoIXRpbGUuY29ubmVjdGVkKSB7XHJcblx0XHRcdFx0Ly8gUmVuZGVyIG5vbi1jb25uZWN0ZWQgdGlsZXNcclxuXHRcdFx0XHR0aWxlLnRleHR1cmUucmVuZGVyKFxyXG5cdFx0XHRcdFx0dGhpcy50aWxlTGF5ZXIsXHJcblx0XHRcdFx0XHR4ICogZ2FtZS5USUxFX1dJRFRILFxyXG5cdFx0XHRcdFx0eSAqIGdhbWUuVElMRV9IRUlHSFQsXHJcblx0XHRcdFx0XHRnYW1lLlRJTEVfV0lEVEgsXHJcblx0XHRcdFx0XHRnYW1lLlRJTEVfSEVJR0hULFxyXG5cdFx0XHRcdCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGZpbmRUaWxlc2V0SW5kZXgoXHJcblx0XHR4OiBudW1iZXIsXHJcblx0XHR5OiBudW1iZXIsXHJcblx0XHR0aWxlVmFsOiBUaWxlVHlwZSxcclxuXHRcdGFueUNvbm5lY3Rpb24/OiBib29sZWFuLFxyXG5cdCkge1xyXG5cdFx0bGV0IHRvcFRpbGVCb29sID0gZmFsc2U7XHJcblx0XHRsZXQgbGVmdFRpbGVCb29sID0gZmFsc2U7XHJcblx0XHRsZXQgYm90dG9tVGlsZUJvb2wgPSBmYWxzZTtcclxuXHRcdGxldCByaWdodFRpbGVCb29sID0gZmFsc2U7XHJcblx0XHRpZiAoYW55Q29ubmVjdGlvbikge1xyXG5cdFx0XHQvLyB0ZXN0IGlmIHRoZSBuZWlnaGJvcmluZyB0aWxlcyBhcmUgc29saWRcclxuXHRcdFx0dG9wVGlsZUJvb2wgPVxyXG5cdFx0XHRcdHggPT09IDAgfHxcclxuXHRcdFx0XHQodGhpcy53b3JsZFRpbGVzWyh4IC0gMSkgKiB0aGlzLndpZHRoICsgeV0gIT09IFRpbGVUeXBlLkFpciAmJi8veCBhbmQgeSBhcHBlYXIgdG8gYmUgc3dpdGNoZWRcclxuXHRcdFx0XHRcdHR5cGVvZiB0aGlzLndvcmxkVGlsZXNbKHggLSAxKSAqIHRoaXMud2lkdGggKyB5XSA9PVxyXG5cdFx0XHRcdFx0XHQnbnVtYmVyJyk7XHJcblx0XHRcdGxlZnRUaWxlQm9vbCA9XHJcblx0XHRcdFx0eSA9PT0gMCB8fFxyXG5cdFx0XHRcdCh0aGlzLndvcmxkVGlsZXNbeCAqIHRoaXMud2lkdGggKyB5IC0gMV0gIT09IFRpbGVUeXBlLkFpciAmJlxyXG5cdFx0XHRcdFx0dHlwZW9mIHRoaXMud29ybGRUaWxlc1t4ICogdGhpcy53aWR0aCArIHkgLSAxXSA9PVxyXG5cdFx0XHRcdFx0XHQnbnVtYmVyJyk7XHJcblx0XHRcdGJvdHRvbVRpbGVCb29sID1cclxuXHRcdFx0XHR4ID09PSB0aGlzLmhlaWdodCAtIDEgfHxcclxuXHRcdFx0XHQodGhpcy53b3JsZFRpbGVzWyh4ICsgMSkgKiB0aGlzLndpZHRoICsgeV0gIT09IFRpbGVUeXBlLkFpciAmJlxyXG5cdFx0XHRcdFx0dHlwZW9mIHRoaXMud29ybGRUaWxlc1soeCArIDEpICogdGhpcy53aWR0aCArIHldID09XHJcblx0XHRcdFx0XHRcdCdudW1iZXInKTtcclxuXHRcdFx0cmlnaHRUaWxlQm9vbCA9XHJcblx0XHRcdFx0eSA9PT0gdGhpcy53aWR0aCAtIDEgfHxcclxuXHRcdFx0XHQodGhpcy53b3JsZFRpbGVzW3ggKiB0aGlzLndpZHRoICsgeSArIDFdICE9PSBUaWxlVHlwZS5BaXIgJiZcclxuXHRcdFx0XHRcdHR5cGVvZiB0aGlzLndvcmxkVGlsZXNbeCAqIHRoaXMud2lkdGggKyB5ICsgMV0gPT1cclxuXHRcdFx0XHRcdFx0J251bWJlcicpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Ly8gdGVzdCBpZiB0aGUgbmVpZ2hib3JpbmcgdGlsZXMgYXJlIHRoZSBzYW1lIHRpbGVcclxuXHRcdFx0dG9wVGlsZUJvb2wgPVxyXG5cdFx0XHRcdHggPT09IDAgfHxcclxuXHRcdFx0XHR0aGlzLndvcmxkVGlsZXNbKHggLSAxKSAqIHRoaXMud2lkdGggKyB5XSA9PT0gdGlsZVZhbDtcclxuXHRcdFx0bGVmdFRpbGVCb29sID1cclxuXHRcdFx0XHR5ID09PSAwIHx8IHRoaXMud29ybGRUaWxlc1t4ICogdGhpcy53aWR0aCArIHkgLSAxXSA9PT0gdGlsZVZhbDtcclxuXHRcdFx0Ym90dG9tVGlsZUJvb2wgPVxyXG5cdFx0XHRcdHggPT09IHRoaXMuaGVpZ2h0IC0gMSB8fFxyXG5cdFx0XHRcdHRoaXMud29ybGRUaWxlc1soeCArIDEpICogdGhpcy53aWR0aCArIHldID09PSB0aWxlVmFsO1xyXG5cdFx0XHRyaWdodFRpbGVCb29sID1cclxuXHRcdFx0XHR5ID09PSB0aGlzLndpZHRoIC0gMSB8fFxyXG5cdFx0XHRcdHRoaXMud29ybGRUaWxlc1t4ICogdGhpcy53aWR0aCArIHkgKyAxXSA9PT0gdGlsZVZhbDtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBjb252ZXJ0IDQgZGlnaXQgYmluYXJ5IG51bWJlciB0byBiYXNlIDEwXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ4ICogK3RvcFRpbGVCb29sICtcclxuXHRcdFx0NCAqICtyaWdodFRpbGVCb29sICtcclxuXHRcdFx0MiAqICtib3R0b21UaWxlQm9vbCArXHJcblx0XHRcdCtsZWZ0VGlsZUJvb2xcclxuXHRcdCk7XHJcblx0fVxyXG59XHJcbiIsImltcG9ydCB7IEltYWdlUmVzb3VyY2UgfSBmcm9tICcuLi9hc3NldHMvcmVzb3VyY2VzL0ltYWdlUmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBXb3JsZEFzc2V0cyB9IGZyb20gJy4uL2Fzc2V0cy9Bc3NldHMnO1xyXG5pbXBvcnQgeyBUaWxlUmVzb3VyY2UgfSBmcm9tICcuLi9hc3NldHMvcmVzb3VyY2VzL1RpbGVSZXNvdXJjZSc7XHJcbmltcG9ydCB7IFRpbGVUeXBlIH0gZnJvbSAnLi4vLi4vZ2xvYmFsL1RpbGUnO1xyXG5pbXBvcnQgeyBUaWxlRW50aXRpZXMgfSBmcm9tICcuLi8uLi9nbG9iYWwvVGlsZUVudGl0eSc7XHJcbmltcG9ydCB7IEl0ZW1UeXBlIH0gZnJvbSAnLi4vLi4vZ2xvYmFsL0ludmVudG9yeSc7XHJcblxyXG5leHBvcnQgdHlwZSBUaWxlID0ge1xyXG4gICAgbmFtZTogc3RyaW5nO1xyXG4gICAgdGV4dHVyZTogSW1hZ2VSZXNvdXJjZSB8IFRpbGVSZXNvdXJjZTtcclxuICAgIGNvbm5lY3RlZD86IGJvb2xlYW47XHJcbiAgICBhbnlDb25uZWN0aW9uPzogYm9vbGVhbjtcclxuICAgIGNvbG9yOiBzdHJpbmc7XHJcbiAgICBmcmljdGlvbjogbnVtYmVyO1xyXG4gICAgcmVmbGVjdGl2aXR5OiBudW1iZXI7XHJcbn1cclxuXHJcbmV4cG9ydCB0eXBlIFRpbGVFbnRpdHlSZW5kZXJEYXRhID0ge1xyXG4gICAgdGV4dHVyZTogSW1hZ2VSZXNvdXJjZSB8IFRpbGVSZXNvdXJjZTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IFdvcmxkVGlsZXM6IFJlY29yZDxUaWxlVHlwZSwgVGlsZSB8IHVuZGVmaW5lZD4gPSB7XHJcbiAgICBbVGlsZVR5cGUuQWlyXTogdW5kZWZpbmVkLFxyXG4gICAgW1RpbGVUeXBlLlNub3ddOiB7XHJcbiAgICAgICAgbmFtZTogJ3Nub3cnLFxyXG4gICAgICAgIHRleHR1cmU6IFdvcmxkQXNzZXRzLm1pZGRsZWdyb3VuZC50aWxlc2V0X3Nub3csXHJcbiAgICAgICAgY29ubmVjdGVkOiB0cnVlLFxyXG4gICAgICAgIGFueUNvbm5lY3Rpb246IHRydWUsXHJcbiAgICAgICAgY29sb3I6IFwiI2NhZmFmY1wiLFxyXG4gICAgICAgIGZyaWN0aW9uOiAyLFxyXG4gICAgICAgIHJlZmxlY3Rpdml0eTogNTAvL3RoaXMgcmVmbGVjdGl2aXR5IGFjdHVhbGx5IGRvZXMgbm90aGluZyBhbmQgaW5zdGVhZCByZWZsZWN0aXZpdHkgY2FuIGJlIGNoYW5nZWQgaW5zaWRlIFJlZmxlY3RlZEltYWdlUmVzb3VyY2UudHNcclxuICAgIH0sXHJcbiAgICBbVGlsZVR5cGUuSWNlXToge1xyXG4gICAgICAgIG5hbWU6ICdpY2UnLFxyXG4gICAgICAgIHRleHR1cmU6IFdvcmxkQXNzZXRzLm1pZGRsZWdyb3VuZC50aWxlc2V0X2ljZSxcclxuICAgICAgICBjb25uZWN0ZWQ6IHRydWUsXHJcbiAgICAgICAgYW55Q29ubmVjdGlvbjogdHJ1ZSxcclxuICAgICAgICBjb2xvcjogXCIjNzZhZGM0XCIsXHJcbiAgICAgICAgZnJpY3Rpb246IDEuNSxcclxuICAgICAgICByZWZsZWN0aXZpdHk6IDE1MFxyXG4gICAgfSxcclxuICAgIFtUaWxlVHlwZS5EaXJ0XToge1xyXG4gICAgICAgIG5hbWU6ICdkaXJ0JyxcclxuICAgICAgICB0ZXh0dXJlOiBXb3JsZEFzc2V0cy5taWRkbGVncm91bmQudGlsZXNldF9kaXJ0LFxyXG4gICAgICAgIGNvbm5lY3RlZDogdHJ1ZSxcclxuICAgICAgICBhbnlDb25uZWN0aW9uOiB0cnVlLFxyXG4gICAgICAgIGNvbG9yOiBcIiM0YTJlMWVcIixcclxuICAgICAgICBmcmljdGlvbjogNCxcclxuICAgICAgICByZWZsZWN0aXZpdHk6IDBcclxuICAgIH0sXHJcbiAgICBbVGlsZVR5cGUuU3RvbmUwXToge1xyXG4gICAgICAgIG5hbWU6ICdyYXcgc3RvbmUnLFxyXG4gICAgICAgIHRleHR1cmU6IFdvcmxkQXNzZXRzLm1pZGRsZWdyb3VuZC50aWxlc2V0X3N0b25lMCxcclxuICAgICAgICBjb25uZWN0ZWQ6IHRydWUsXHJcbiAgICAgICAgYW55Q29ubmVjdGlvbjogdHJ1ZSxcclxuICAgICAgICBjb2xvcjogXCIjNDE0MjQ1XCIsXHJcbiAgICAgICAgZnJpY3Rpb246IDMsXHJcbiAgICAgICAgcmVmbGVjdGl2aXR5OiAxMFxyXG4gICAgfSxcclxuICAgIFtUaWxlVHlwZS5TdG9uZTFdOiB7XHJcbiAgICAgICAgbmFtZTogJ3N0b25lIHRpZXIgMScsXHJcbiAgICAgICAgdGV4dHVyZTogV29ybGRBc3NldHMubWlkZGxlZ3JvdW5kLnRpbGVzZXRfc3RvbmUxLFxyXG4gICAgICAgIGNvbm5lY3RlZDogdHJ1ZSxcclxuICAgICAgICBhbnlDb25uZWN0aW9uOiB0cnVlLFxyXG4gICAgICAgIGNvbG9yOiBcIiMzMTMyM2JcIixcclxuICAgICAgICBmcmljdGlvbjogMyxcclxuICAgICAgICByZWZsZWN0aXZpdHk6IDE1XHJcbiAgICB9LFxyXG4gICAgW1RpbGVUeXBlLlN0b25lMl06IHtcclxuICAgICAgICBuYW1lOiAnc3RvbmUgdGllciAyJyxcclxuICAgICAgICB0ZXh0dXJlOiBXb3JsZEFzc2V0cy5taWRkbGVncm91bmQudGlsZXNldF9zdG9uZTIsXHJcbiAgICAgICAgY29ubmVjdGVkOiB0cnVlLFxyXG4gICAgICAgIGFueUNvbm5lY3Rpb246IHRydWUsXHJcbiAgICAgICAgY29sb3I6IFwiIzMxMzIzYlwiLC8vVE9ETyBjaGFuZ2UgdGhlc2UgY29sb3JzIHRvIGJlIG1vcmUgYWNjdXJhdGVcclxuICAgICAgICBmcmljdGlvbjogMyxcclxuICAgICAgICByZWZsZWN0aXZpdHk6IDE3XHJcbiAgICB9LFxyXG4gICAgW1RpbGVUeXBlLlN0b25lM106IHtcclxuICAgICAgICBuYW1lOiAnc3RvbmUgdGllciAzJyxcclxuICAgICAgICB0ZXh0dXJlOiBXb3JsZEFzc2V0cy5taWRkbGVncm91bmQudGlsZXNldF9zdG9uZTMsXHJcbiAgICAgICAgY29ubmVjdGVkOiB0cnVlLFxyXG4gICAgICAgIGFueUNvbm5lY3Rpb246IHRydWUsXHJcbiAgICAgICAgY29sb3I6IFwiIzMxMzIzYlwiLFxyXG4gICAgICAgIGZyaWN0aW9uOiAzLFxyXG4gICAgICAgIHJlZmxlY3Rpdml0eTogMTlcclxuICAgIH0sXHJcbiAgICBbVGlsZVR5cGUuU3RvbmU0XToge1xyXG4gICAgICAgIG5hbWU6ICdzdG9uZSB0aWVyIDQnLFxyXG4gICAgICAgIHRleHR1cmU6IFdvcmxkQXNzZXRzLm1pZGRsZWdyb3VuZC50aWxlc2V0X3N0b25lNCxcclxuICAgICAgICBjb25uZWN0ZWQ6IHRydWUsXHJcbiAgICAgICAgYW55Q29ubmVjdGlvbjogdHJ1ZSxcclxuICAgICAgICBjb2xvcjogXCIjMzEzMjNiXCIsXHJcbiAgICAgICAgZnJpY3Rpb246IDMsXHJcbiAgICAgICAgcmVmbGVjdGl2aXR5OiAyMVxyXG4gICAgfSxcclxuICAgIFtUaWxlVHlwZS5TdG9uZTVdOiB7XHJcbiAgICAgICAgbmFtZTogJ3N0b25lIHRpZXIgNScsXHJcbiAgICAgICAgdGV4dHVyZTogV29ybGRBc3NldHMubWlkZGxlZ3JvdW5kLnRpbGVzZXRfc3RvbmU1LFxyXG4gICAgICAgIGNvbm5lY3RlZDogdHJ1ZSxcclxuICAgICAgICBhbnlDb25uZWN0aW9uOiB0cnVlLFxyXG4gICAgICAgIGNvbG9yOiBcIiMzMTMyM2JcIixcclxuICAgICAgICBmcmljdGlvbjogMyxcclxuICAgICAgICByZWZsZWN0aXZpdHk6IDIzXHJcbiAgICB9LFxyXG4gICAgW1RpbGVUeXBlLlN0b25lNl06IHtcclxuICAgICAgICBuYW1lOiAnc3RvbmUgdGllciA2JyxcclxuICAgICAgICB0ZXh0dXJlOiBXb3JsZEFzc2V0cy5taWRkbGVncm91bmQudGlsZXNldF9zdG9uZTYsXHJcbiAgICAgICAgY29ubmVjdGVkOiB0cnVlLFxyXG4gICAgICAgIGFueUNvbm5lY3Rpb246IHRydWUsXHJcbiAgICAgICAgY29sb3I6IFwiIzMxMzIzYlwiLFxyXG4gICAgICAgIGZyaWN0aW9uOiAzLFxyXG4gICAgICAgIHJlZmxlY3Rpdml0eTogMjVcclxuICAgIH0sXHJcbiAgICBbVGlsZVR5cGUuU3RvbmU3XToge1xyXG4gICAgICAgIG5hbWU6ICdzdG9uZSB0aWVyIDcnLFxyXG4gICAgICAgIHRleHR1cmU6IFdvcmxkQXNzZXRzLm1pZGRsZWdyb3VuZC50aWxlc2V0X3N0b25lNyxcclxuICAgICAgICBjb25uZWN0ZWQ6IHRydWUsXHJcbiAgICAgICAgYW55Q29ubmVjdGlvbjogdHJ1ZSxcclxuICAgICAgICBjb2xvcjogXCIjMzEzMjNiXCIsXHJcbiAgICAgICAgZnJpY3Rpb246IDMsXHJcbiAgICAgICAgcmVmbGVjdGl2aXR5OiAyN1xyXG4gICAgfSxcclxuICAgIFtUaWxlVHlwZS5TdG9uZThdOiB7XHJcbiAgICAgICAgbmFtZTogJ3N0b25lIHRpZXIgOCcsXHJcbiAgICAgICAgdGV4dHVyZTogV29ybGRBc3NldHMubWlkZGxlZ3JvdW5kLnRpbGVzZXRfc3RvbmU4LFxyXG4gICAgICAgIGNvbm5lY3RlZDogdHJ1ZSxcclxuICAgICAgICBhbnlDb25uZWN0aW9uOiB0cnVlLFxyXG4gICAgICAgIGNvbG9yOiBcIiMzMTMyM2JcIixcclxuICAgICAgICBmcmljdGlvbjogMyxcclxuICAgICAgICByZWZsZWN0aXZpdHk6IDI5XHJcbiAgICB9LFxyXG4gICAgW1RpbGVUeXBlLlN0b25lOV06IHtcclxuICAgICAgICBuYW1lOiAnc3RvbmUgdGllciA5JyxcclxuICAgICAgICB0ZXh0dXJlOiBXb3JsZEFzc2V0cy5taWRkbGVncm91bmQudGlsZXNldF9zdG9uZTksXHJcbiAgICAgICAgY29ubmVjdGVkOiB0cnVlLFxyXG4gICAgICAgIGFueUNvbm5lY3Rpb246IHRydWUsXHJcbiAgICAgICAgY29sb3I6IFwiIzMxMzIzYlwiLFxyXG4gICAgICAgIGZyaWN0aW9uOiAzLFxyXG4gICAgICAgIHJlZmxlY3Rpdml0eTogMzFcclxuICAgIH0sXHJcbiAgICBbVGlsZVR5cGUuVGluXToge1xyXG4gICAgICAgIG5hbWU6ICd0aW4gb3JlJyxcclxuICAgICAgICB0ZXh0dXJlOiBXb3JsZEFzc2V0cy5taWRkbGVncm91bmQudGlsZXNldF90aW4sXHJcbiAgICAgICAgY29ubmVjdGVkOiB0cnVlLFxyXG4gICAgICAgIGFueUNvbm5lY3Rpb246IGZhbHNlLFxyXG4gICAgICAgIGNvbG9yOiBcIiMzMTMyM2JcIixcclxuICAgICAgICBmcmljdGlvbjogMyxcclxuICAgICAgICByZWZsZWN0aXZpdHk6IDEwXHJcbiAgICB9LFxyXG4gICAgW1RpbGVUeXBlLkFsdW1pbnVtXToge1xyXG4gICAgICAgIG5hbWU6ICdhbHVtaW51bSBvcmUnLFxyXG4gICAgICAgIHRleHR1cmU6IFdvcmxkQXNzZXRzLm1pZGRsZWdyb3VuZC50aWxlc2V0X2FsdW1pbnVtLFxyXG4gICAgICAgIGNvbm5lY3RlZDogdHJ1ZSxcclxuICAgICAgICBhbnlDb25uZWN0aW9uOiBmYWxzZSxcclxuICAgICAgICBjb2xvcjogXCIjMzEzMjNiXCIsXHJcbiAgICAgICAgZnJpY3Rpb246IDMsXHJcbiAgICAgICAgcmVmbGVjdGl2aXR5OiAxN1xyXG4gICAgfSxcclxuICAgIFtUaWxlVHlwZS5Hb2xkXToge1xyXG4gICAgICAgIG5hbWU6ICdnb2xkIG9yZScsXHJcbiAgICAgICAgdGV4dHVyZTogV29ybGRBc3NldHMubWlkZGxlZ3JvdW5kLnRpbGVzZXRfZ29sZCxcclxuICAgICAgICBjb25uZWN0ZWQ6IHRydWUsXHJcbiAgICAgICAgYW55Q29ubmVjdGlvbjogZmFsc2UsXHJcbiAgICAgICAgY29sb3I6IFwiIzMxMzIzYlwiLFxyXG4gICAgICAgIGZyaWN0aW9uOiAzLFxyXG4gICAgICAgIHJlZmxlY3Rpdml0eTogMjFcclxuICAgIH0sXHJcbiAgICBbVGlsZVR5cGUuVGl0YW5pdW1dOiB7XHJcbiAgICAgICAgbmFtZTogJ3RpdGFuaXVtIG9yZScsXHJcbiAgICAgICAgdGV4dHVyZTogV29ybGRBc3NldHMubWlkZGxlZ3JvdW5kLnRpbGVzZXRfdGl0YW5pdW0sXHJcbiAgICAgICAgY29ubmVjdGVkOiB0cnVlLFxyXG4gICAgICAgIGFueUNvbm5lY3Rpb246IGZhbHNlLFxyXG4gICAgICAgIGNvbG9yOiBcIiMzMTMyM2JcIixcclxuICAgICAgICBmcmljdGlvbjogMyxcclxuICAgICAgICByZWZsZWN0aXZpdHk6IDI1XHJcbiAgICB9LFxyXG4gICAgW1RpbGVUeXBlLkdyYXBlXToge1xyXG4gICAgICAgIG5hbWU6ICdncmFwZSBvcmUnLFxyXG4gICAgICAgIHRleHR1cmU6IFdvcmxkQXNzZXRzLm1pZGRsZWdyb3VuZC50aWxlc2V0X2dyYXBlLFxyXG4gICAgICAgIGNvbm5lY3RlZDogdHJ1ZSxcclxuICAgICAgICBhbnlDb25uZWN0aW9uOiBmYWxzZSxcclxuICAgICAgICBjb2xvcjogXCIjMzEzMjNiXCIsXHJcbiAgICAgICAgZnJpY3Rpb246IDMsXHJcbiAgICAgICAgcmVmbGVjdGl2aXR5OiAyOVxyXG4gICAgfSxcclxuICAgIFtUaWxlVHlwZS5Xb29kMF06IHtcclxuICAgICAgICBuYW1lOiAncmF3IHdvb2QnLFxyXG4gICAgICAgIHRleHR1cmU6IFdvcmxkQXNzZXRzLm1pZGRsZWdyb3VuZC50aWxlc2V0X3dvb2QwLFxyXG4gICAgICAgIGNvbm5lY3RlZDogZmFsc2UsXHJcbiAgICAgICAgYW55Q29ubmVjdGlvbjogdHJ1ZSxcclxuICAgICAgICBjb2xvcjogXCIjYTc3MTQ1XCIsXHJcbiAgICAgICAgZnJpY3Rpb246IDMsXHJcbiAgICAgICAgcmVmbGVjdGl2aXR5OiA1XHJcbiAgICB9LFxyXG4gICAgW1RpbGVUeXBlLldvb2QxXToge1xyXG4gICAgICAgIG5hbWU6ICd3b29kIHRpZXIgMScsXHJcbiAgICAgICAgdGV4dHVyZTogV29ybGRBc3NldHMubWlkZGxlZ3JvdW5kLnRpbGVzZXRfd29vZDEsXHJcbiAgICAgICAgY29ubmVjdGVkOiB0cnVlLFxyXG4gICAgICAgIGFueUNvbm5lY3Rpb246IHRydWUsXHJcbiAgICAgICAgY29sb3I6IFwiI2E3NzE0NVwiLFxyXG4gICAgICAgIGZyaWN0aW9uOiAzLFxyXG4gICAgICAgIHJlZmxlY3Rpdml0eTogNVxyXG4gICAgfSxcclxuICAgIFtUaWxlVHlwZS5Xb29kMl06IHtcclxuICAgICAgICBuYW1lOiAnd29vZCB0aWVyIDInLFxyXG4gICAgICAgIHRleHR1cmU6IFdvcmxkQXNzZXRzLm1pZGRsZWdyb3VuZC50aWxlc2V0X3dvb2QyLFxyXG4gICAgICAgIGNvbm5lY3RlZDogdHJ1ZSxcclxuICAgICAgICBhbnlDb25uZWN0aW9uOiB0cnVlLFxyXG4gICAgICAgIGNvbG9yOiBcIiNhNzcxNDVcIixcclxuICAgICAgICBmcmljdGlvbjogMyxcclxuICAgICAgICByZWZsZWN0aXZpdHk6IDVcclxuICAgIH0sXHJcbiAgICBbVGlsZVR5cGUuV29vZDNdOiB7XHJcbiAgICAgICAgbmFtZTogJ3dvb2QgdGllciAzJyxcclxuICAgICAgICB0ZXh0dXJlOiBXb3JsZEFzc2V0cy5taWRkbGVncm91bmQudGlsZXNldF93b29kMyxcclxuICAgICAgICBjb25uZWN0ZWQ6IHRydWUsXHJcbiAgICAgICAgYW55Q29ubmVjdGlvbjogdHJ1ZSxcclxuICAgICAgICBjb2xvcjogXCIjYTc3MTQ1XCIsXHJcbiAgICAgICAgZnJpY3Rpb246IDMsXHJcbiAgICAgICAgcmVmbGVjdGl2aXR5OiA1XHJcbiAgICB9LFxyXG4gICAgW1RpbGVUeXBlLldvb2Q0XToge1xyXG4gICAgICAgIG5hbWU6ICd3b29kIHRpZXIgNCcsXHJcbiAgICAgICAgdGV4dHVyZTogV29ybGRBc3NldHMubWlkZGxlZ3JvdW5kLnRpbGVzZXRfd29vZDQsXHJcbiAgICAgICAgY29ubmVjdGVkOiB0cnVlLFxyXG4gICAgICAgIGFueUNvbm5lY3Rpb246IHRydWUsXHJcbiAgICAgICAgY29sb3I6IFwiI2E3NzE0NVwiLFxyXG4gICAgICAgIGZyaWN0aW9uOiAzLFxyXG4gICAgICAgIHJlZmxlY3Rpdml0eTogNVxyXG4gICAgfSxcclxuICAgIFtUaWxlVHlwZS5Xb29kNV06IHtcclxuICAgICAgICBuYW1lOiAnd29vZCB0aWVyIDUnLFxyXG4gICAgICAgIHRleHR1cmU6IFdvcmxkQXNzZXRzLm1pZGRsZWdyb3VuZC50aWxlc2V0X3dvb2Q1LFxyXG4gICAgICAgIGNvbm5lY3RlZDogdHJ1ZSxcclxuICAgICAgICBhbnlDb25uZWN0aW9uOiB0cnVlLFxyXG4gICAgICAgIGNvbG9yOiBcIiNhNzcxNDVcIixcclxuICAgICAgICBmcmljdGlvbjogMyxcclxuICAgICAgICByZWZsZWN0aXZpdHk6IDVcclxuICAgIH0sXHJcbiAgICBbVGlsZVR5cGUuV29vZDZdOiB7XHJcbiAgICAgICAgbmFtZTogJ3dvb2QgdGllciA2JyxcclxuICAgICAgICB0ZXh0dXJlOiBXb3JsZEFzc2V0cy5taWRkbGVncm91bmQudGlsZXNldF93b29kNixcclxuICAgICAgICBjb25uZWN0ZWQ6IHRydWUsXHJcbiAgICAgICAgYW55Q29ubmVjdGlvbjogdHJ1ZSxcclxuICAgICAgICBjb2xvcjogXCIjYTc3MTQ1XCIsXHJcbiAgICAgICAgZnJpY3Rpb246IDMsXHJcbiAgICAgICAgcmVmbGVjdGl2aXR5OiA1XHJcbiAgICB9LFxyXG4gICAgW1RpbGVUeXBlLldvb2Q3XToge1xyXG4gICAgICAgIG5hbWU6ICd3b29kIHRpZXIgNycsXHJcbiAgICAgICAgdGV4dHVyZTogV29ybGRBc3NldHMubWlkZGxlZ3JvdW5kLnRpbGVzZXRfd29vZDcsXHJcbiAgICAgICAgY29ubmVjdGVkOiB0cnVlLFxyXG4gICAgICAgIGFueUNvbm5lY3Rpb246IHRydWUsXHJcbiAgICAgICAgY29sb3I6IFwiI2E3NzE0NVwiLFxyXG4gICAgICAgIGZyaWN0aW9uOiAzLFxyXG4gICAgICAgIHJlZmxlY3Rpdml0eTogNVxyXG4gICAgfSxcclxuICAgIFtUaWxlVHlwZS5Xb29kOF06IHtcclxuICAgICAgICBuYW1lOiAnd29vZCB0aWVyIDgnLFxyXG4gICAgICAgIHRleHR1cmU6IFdvcmxkQXNzZXRzLm1pZGRsZWdyb3VuZC50aWxlc2V0X3dvb2Q4LFxyXG4gICAgICAgIGNvbm5lY3RlZDogdHJ1ZSxcclxuICAgICAgICBhbnlDb25uZWN0aW9uOiB0cnVlLFxyXG4gICAgICAgIGNvbG9yOiBcIiNhNzcxNDVcIixcclxuICAgICAgICBmcmljdGlvbjogMyxcclxuICAgICAgICByZWZsZWN0aXZpdHk6IDVcclxuICAgIH0sXHJcbiAgICBbVGlsZVR5cGUuV29vZDldOiB7XHJcbiAgICAgICAgbmFtZTogJ3dvb2QgdGllciA5JyxcclxuICAgICAgICB0ZXh0dXJlOiBXb3JsZEFzc2V0cy5taWRkbGVncm91bmQudGlsZXNldF93b29kOSxcclxuICAgICAgICBjb25uZWN0ZWQ6IHRydWUsXHJcbiAgICAgICAgYW55Q29ubmVjdGlvbjogdHJ1ZSxcclxuICAgICAgICBjb2xvcjogXCIjYTc3MTQ1XCIsXHJcbiAgICAgICAgZnJpY3Rpb246IDMsXHJcbiAgICAgICAgcmVmbGVjdGl2aXR5OiA1XHJcbiAgICB9LFxyXG59O1xyXG5cclxuLy8gZXhwb3J0IGNvbnN0IFRpbGVFbnRpdGllc1JlbmRlckRhdGE6IFJlY29yZDxUaWxlRW50aXRpZXMsIFRpbGVFbnRpdHlSZW5kZXJEYXRhPiA9IHtcclxuICAgIC8vIFtUaWxlRW50aXRpZXMuVGllcjFEcmlsbF06IHtcclxuICAgICAgICAvLyB0ZXh0dXJlOiB1bmRlZmluZWRcclxuICAgIC8vIH0sXHJcbiAgICAvLyBbVGlsZUVudGl0aWVzLlRpZXIyRHJpbGxdOiB7XHJcbiAgICAgICAgLy8gdGV4dHVyZTogdW5kZWZpbmVkXHJcbiAgICAvLyB9XHJcbi8vIH0iLCJpbXBvcnQgeyBnYW1lIH0gZnJvbSBcIi4uLy4uL0dhbWVcIjtcclxuaW1wb3J0IFNpbXBsZXhOb2lzZSBmcm9tIFwic2ltcGxleC1ub2lzZVwiO1xyXG5pbXBvcnQgeyBJbWFnZVJlc291cmNlIH0gZnJvbSBcIi4uLy4uL2Fzc2V0cy9yZXNvdXJjZXMvSW1hZ2VSZXNvdXJjZVwiO1xyXG5pbXBvcnQgeyBXb3JsZEFzc2V0cyB9IGZyb20gXCIuLi8uLi9hc3NldHMvQXNzZXRzXCI7XHJcbmltcG9ydCBwNSBmcm9tICdwNSdcclxuXHJcbmV4cG9ydCBjbGFzcyBDbG91ZCB7XHJcbiAgICB4OiBudW1iZXI7XHJcbiAgICB5OiBudW1iZXI7XHJcbiAgICB4VmVsOiBudW1iZXI7XHJcbiAgICBpbWFnZTogSW1hZ2VSZXNvdXJjZVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICB0aGlzLnhWZWwgPSBNYXRoLnJhbmRvbSgpKjAuMDcrMC4wNTtcclxuICAgICAgICB0aGlzLnkgPSB5O1xyXG4gICAgICAgIHRoaXMuaW1hZ2UgPSBXb3JsZEFzc2V0cy5jbG91ZHNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogV29ybGRBc3NldHMuY2xvdWRzLmxlbmd0aCldXHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKHRhcmdldDogcDUsIHVwc2NhbGVTaXplOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKGB4OiAke3RoaXMueH0sIHk6ICR7dGhpcy55fWApO1xyXG4gICAgICAgIC8vZHJhdyBhIGNsb3VkIGF0IHRoZSBwbGFjZSA6b1xyXG4gICAgICAgIHRoaXMuaW1hZ2UucmVuZGVyKFxyXG4gICAgICAgICAgICB0YXJnZXQsXHJcbiAgICAgICAgICAgICh0aGlzLnggKiBnYW1lLlRJTEVfV0lEVEggLVxyXG4gICAgICAgICAgICAgICAgZ2FtZS5pbnRlcnBvbGF0ZWRDYW1YICogZ2FtZS5USUxFX1dJRFRIKSAqXHJcbiAgICAgICAgICAgIHVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICAodGhpcy55ICogZ2FtZS5USUxFX0hFSUdIVCAtXHJcbiAgICAgICAgICAgICAgICBnYW1lLmludGVycG9sYXRlZENhbVkgKiBnYW1lLlRJTEVfSEVJR0hUKSAqXHJcbiAgICAgICAgICAgIHVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICB0aGlzLmltYWdlLmltYWdlLndpZHRoICogdXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2UuaW1hZ2UuaGVpZ2h0ICogdXBzY2FsZVNpemVcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHRpY2soKSB7XHJcbiAgICAgICAgdGhpcy54ICs9IHRoaXMueFZlbDtcclxuICAgICAgICBsZXQgbiA9ICgoZ2FtZS53aWR0aC9nYW1lLnVwc2NhbGVTaXplKzUwKS9nYW1lLlRJTEVfV0lEVEgpO1xyXG4gICAgICAgIGxldCB4ID0gdGhpcy54LWdhbWUuaW50ZXJwb2xhdGVkQ2FtWCArIDUwL2dhbWUuVElMRV9XSURUSDtcclxuICAgICAgICB0aGlzLnggPSBtb2QoeCwgbikrZ2FtZS5pbnRlcnBvbGF0ZWRDYW1YIC0gNTAvZ2FtZS5USUxFX1dJRFRIO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuZnVuY3Rpb24gbW9kKHgxOiBudW1iZXIsIHgyOiBudW1iZXIpIHtcclxuICAgIHJldHVybiAoKHgxICUgeDIpICsgeDIpICUgeDI7XHJcbn0iLCJpbXBvcnQgeyBFbnRpdGllcyB9IGZyb20gJy4uLy4uLy4uL2dsb2JhbC9FbnRpdHknO1xyXG5pbXBvcnQgeyBQbGF5ZXJFbnRpdHkgfSBmcm9tICcuL1BsYXllckVudGl0eSc7XHJcbmltcG9ydCB7IEl0ZW1FbnRpdHkgfSBmcm9tICcuL0l0ZW1FbnRpdHknO1xyXG5cclxuZXhwb3J0IGNvbnN0IEVudGl0eUNsYXNzZXM6IFJlY29yZDxFbnRpdGllcywgYW55PiA9IHtcclxuICAgIFtFbnRpdGllcy5Mb2NhbFBsYXllcl06IHVuZGVmaW5lZCxcclxuICAgIFtFbnRpdGllcy5QbGF5ZXJdOiBQbGF5ZXJFbnRpdHksXHJcbiAgICBbRW50aXRpZXMuSXRlbV06IEl0ZW1FbnRpdHksXHJcbn07XHJcbiIsImltcG9ydCBwNSBmcm9tICdwNSc7XHJcbmltcG9ydCB7IFNlcnZlckVudGl0eSB9IGZyb20gJy4vU2VydmVyRW50aXR5JztcclxuaW1wb3J0IHsgRW50aXRpZXMsIEVudGl0eVBheWxvYWQgfSBmcm9tICcuLi8uLi8uLi9nbG9iYWwvRW50aXR5JztcclxuaW1wb3J0IHsgSXRlbXMsIEl0ZW1UeXBlIH0gZnJvbSAnLi4vLi4vLi4vZ2xvYmFsL0ludmVudG9yeSc7XHJcbmltcG9ydCB7IEl0ZW1Bc3NldHMgfSBmcm9tICcuLi8uLi9hc3NldHMvQXNzZXRzJztcclxuXHJcbmV4cG9ydCBjbGFzcyBJdGVtRW50aXR5IGV4dGVuZHMgU2VydmVyRW50aXR5IHtcclxuICAgIGl0ZW06IEl0ZW1UeXBlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBheWxvYWQ6IEVudGl0eVBheWxvYWQ8RW50aXRpZXMuSXRlbT4pIHtcclxuICAgICAgICBzdXBlcihwYXlsb2FkLmlkKTtcclxuXHJcbiAgICAgICAgdGhpcy5pdGVtID0gcGF5bG9hZC5kYXRhLml0ZW07XHJcbiAgICAgICAgdGhpcy54ID0gcGF5bG9hZC5kYXRhLng7XHJcbiAgICAgICAgdGhpcy55ID0gcGF5bG9hZC5kYXRhLnk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKHRhcmdldDogcDUsIHVwc2NhbGVTaXplOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBhc3NldCA9IEl0ZW1Bc3NldHNbdGhpcy5pdGVtXTtcclxuICAgICAgICBpZiAoYXNzZXQgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBhc3NldC5yZW5kZXIodGFyZ2V0LCB0aGlzLngsIHRoaXMueSwgOCwgOCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZURhdGEoZGF0YTogRW50aXR5UGF5bG9hZDxFbnRpdGllcy5JdGVtPik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuaXRlbSA9IGRhdGEuZGF0YS5pdGVtO1xyXG4gICAgICAgIHRoaXMueCA9IGRhdGEuZGF0YS54O1xyXG4gICAgICAgIHRoaXMueSA9IGRhdGEuZGF0YS55O1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCBwNSBmcm9tICdwNSc7XHJcbmltcG9ydCB7IFNlcnZlckVudGl0eSB9IGZyb20gJy4vU2VydmVyRW50aXR5JztcclxuaW1wb3J0IHsgRW50aXRpZXMsIEVudGl0eVBheWxvYWQgfSBmcm9tICcuLi8uLi8uLi9nbG9iYWwvRW50aXR5JztcclxuaW1wb3J0IHsgZ2FtZSB9IGZyb20gJy4uLy4uL0dhbWUnO1xyXG5pbXBvcnQgeyBBbmltYXRpb25GcmFtZSwgUGxheWVyQW5pbWF0aW9ucyB9IGZyb20gJy4uLy4uL2Fzc2V0cy9Bc3NldHMnO1xyXG5pbXBvcnQgeyBSZWZsZWN0YWJsZUltYWdlUmVzb3VyY2UgfSBmcm9tICcuLi8uLi9hc3NldHMvcmVzb3VyY2VzL1JlZmxlY3RlZEltYWdlUmVzb3VyY2UnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFBsYXllckVudGl0eSBleHRlbmRzIFNlcnZlckVudGl0eSB7XHJcbiAgICB3aWR0aDogbnVtYmVyID0gMTIgLyBnYW1lLlRJTEVfV0lEVEg7XHJcbiAgICBoZWlnaHQ6IG51bWJlciA9IDI4IC8gZ2FtZS5USUxFX0hFSUdIVDtcclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIGlkTnVtYmVyOiBudW1iZXI7XHJcbiAgICBjb2xvcjE6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdXHJcbiAgICBjb2xvcjI6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdXHJcbiAgICBjdXJyZW50QW5pbWF0aW9uOiBBbmltYXRpb25GcmFtZTx0eXBlb2YgUGxheWVyQW5pbWF0aW9ucz4gPSBcImlkbGVcIlxyXG4gICAgdGltZUluVGhpc0FuaW1hdGlvbkZyYW1lOiBudW1iZXIgPSAwO1xyXG4gICAgYW5pbUZyYW1lOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIFxyXG4gICAgYW5pbWF0aW9uczoge1xyXG4gICAgICAgIFtrZXk6IHN0cmluZ106IFtSZWZsZWN0YWJsZUltYWdlUmVzb3VyY2UsIG51bWJlcl1bXSxcclxuICAgIH0gPSB7fTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkYXRhOiBFbnRpdHlQYXlsb2FkKSB7XHJcbiAgICAgICAgc3VwZXIoZGF0YS5pZCk7XHJcbiAgICAgICAgaWYgKGRhdGEudHlwZSA9PT0gRW50aXRpZXMuUGxheWVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMubmFtZSA9IGRhdGEuZGF0YS5uYW1lO1xyXG4gICAgICAgIH1cclxuICAgICAgICBkYXRhLmlkID0gZGF0YS5pZC5zcGxpdChcIi1cIikuam9pbihcIlwiKTsvL3N0cmluZy5wcm90b3R5cGUucmVwbGFjZUFsbCByZXF1aXJlcyBFUzIwMjFcclxuICAgICAgICB0aGlzLmlkTnVtYmVyID0gKE51bWJlcihcIjB4XCIrZGF0YS5pZCkvMTAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwKSUxOy8vZ2V0IGEgbnVtYmVyIDAtMSBwc2V1ZG9yYW5kb21seSBzZWxlY3RlZCBmcm9tIHRoZSB1dWlkIG9mIHRoZSBwbGF5ZXJcclxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmlkTnVtYmVyKTtcclxuICAgICAgICB0aGlzLmNvbG9yMSA9IGhzbFRvUmdiKHRoaXMuaWROdW1iZXIsIDEsIDAuNDUpOy8vY29udmVydCB0aGlzIHRvIHR3byBIU0wgY29sb3JzIHdoaWNoIGFyZSB0aGVuIGNvbnZlcnRlZCB0byB0d28gUkdCIGNvbG9yczogb25lIGxpZ2h0IGFuZCBvbmUgZGFya1xyXG4gICAgICAgIHRoaXMuY29sb3IyID0gaHNsVG9SZ2IodGhpcy5pZE51bWJlciwgMSwgMC4zKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhgY3JlYXRpbmcgYW5pbWF0aW9ucyBmb3IgcGxheWVyIHdpdGggY29sb3JzICR7dGhpcy5jb2xvcjF9IGFuZCAke3RoaXMuY29sb3IyfWApXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcIlRFU1Q6IFwiKyh0aGlzLmFuaW1hdGlvbnMuaWRsZVswXVswXS5pbWFnZT09PVBsYXllckFuaW1hdGlvbnMuaWRsZVswXVswXS5pbWFnZSkpXHJcbiAgICAgICAgLy8gbGV0IGltZyA9IHRoaXMuYW5pbWF0aW9ucy5pZGxlWzBdWzBdLmltYWdlO1xyXG4gICAgICAgIC8vIGltZy5sb2FkUGl4ZWxzKCk7XHJcbiAgICAgICAgLy8gaW1nLnNldCgzLCAxMCwgWzAsIDI1NSwgMCwgMjU1XSk7XHJcbiAgICAgICAgLy8gaW1nLnVwZGF0ZVBpeGVscygpO1xyXG4gICAgICAgIE9iamVjdC5lbnRyaWVzKFBsYXllckFuaW1hdGlvbnMpLmZvckVhY2goZWxlbWVudCA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uc1tlbGVtZW50WzBdXSA9IFtdO1xyXG4gICAgICAgICAgICBmb3IobGV0IGZyYW1lIG9mIGVsZW1lbnRbMV0pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uc1tlbGVtZW50WzBdXS5wdXNoKFtuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKGZyYW1lWzBdLnBhdGgsIHRoaXMuY29sb3IxLCB0aGlzLmNvbG9yMiksIGZyYW1lWzFdXSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVmbGVjdGFibGVSZXNvdXJjZSA9IHRoaXMuYW5pbWF0aW9uc1tlbGVtZW50WzBdXVt0aGlzLmFuaW1hdGlvbnNbZWxlbWVudFswXV0ubGVuZ3RoLTFdWzBdO1xyXG4gICAgICAgICAgICAgICAgcmVmbGVjdGFibGVSZXNvdXJjZS5sb2FkUmVzb3VyY2UoZ2FtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVEYXRhKGRhdGE6IEVudGl0eVBheWxvYWQpOiB2b2lkIHtcclxuICAgICAgICBpZiAoZGF0YS50eXBlID09PSBFbnRpdGllcy5QbGF5ZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5uYW1lID0gZGF0YS5kYXRhLm5hbWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcih0YXJnZXQ6IHA1LCB1cHNjYWxlU2l6ZTogbnVtYmVyKTogdm9pZCB7XHJcblxyXG4gICAgICAgIC8vdXBkYXRlIGFuaW1hdGlvbiBmcmFtZSBiYXNlZCBvbiBkZWx0YVRpbWVcclxuICAgICAgICB0aGlzLnRpbWVJblRoaXNBbmltYXRpb25GcmFtZSArPSBnYW1lLmRlbHRhVGltZTtcclxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmFuaW1GcmFtZSk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coW3RoaXMuY3VycmVudEFuaW1hdGlvbiwgdGhpcy5hbmltRnJhbWVdKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhQbGF5ZXJBbmltYXRpb25zW3RoaXMuY3VycmVudEFuaW1hdGlvbl0pXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coUGxheWVyQW5pbWF0aW9uc1t0aGlzLmN1cnJlbnRBbmltYXRpb25dW3RoaXMuYW5pbUZyYW1lXSlcclxuICAgICAgICBpZih0aGlzLnRpbWVJblRoaXNBbmltYXRpb25GcmFtZT5QbGF5ZXJBbmltYXRpb25zW3RoaXMuY3VycmVudEFuaW1hdGlvbl1bdGhpcy5hbmltRnJhbWVdWzFdKSB7XHJcbiAgICAgICAgICAgIHRoaXMudGltZUluVGhpc0FuaW1hdGlvbkZyYW1lID0gMDsvL3RoaXMgZG9lcyBpbnRyb2R1Y2Ugc29tZSBzbGlnaHQgaW5hY2N1cmFjaWVzIHZzIHN1YnRyYWN0aW5nIGl0LCBidXQsIHdoZW4geW91IHRhYiBiYWNrIGludG8gdGhlIGJyb3dzZXIgYWZ0ZXIgYmVpbmcgdGFiYmVkIG91dCwgc3VidHJhY3RpbmcgaXQgY2F1c2VzIHNwYXp6aW5nXHJcbiAgICAgICAgICAgIHRoaXMuYW5pbUZyYW1lKys7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuYW5pbUZyYW1lPj1QbGF5ZXJBbmltYXRpb25zW3RoaXMuY3VycmVudEFuaW1hdGlvbl0ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFuaW1GcmFtZSA9IHRoaXMuYW5pbUZyYW1lJVBsYXllckFuaW1hdGlvbnNbdGhpcy5jdXJyZW50QW5pbWF0aW9uXS5sZW5ndGg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vUGxheWVyQVxyXG4gICAgICAgIC8vIFJlbmRlciB0aGUgaXRlbSBxdWFudGl0eSBsYWJlbFxyXG4gICAgICAgIHRoaXMuYW5pbWF0aW9uc1t0aGlzLmN1cnJlbnRBbmltYXRpb25dW3RoaXMuYW5pbUZyYW1lXVswXS5yZW5kZXIoXHJcbiAgICAgICAgICAgIHRhcmdldCxcclxuICAgICAgICAgICAgKHRoaXMueCAqIGdhbWUuVElMRV9XSURUSCAtXHJcbiAgICAgICAgICAgICAgICBnYW1lLmludGVycG9sYXRlZENhbVggKiBnYW1lLlRJTEVfV0lEVEgpICpcclxuICAgICAgICAgICAgICAgIHVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICAodGhpcy55ICogZ2FtZS5USUxFX0hFSUdIVCAtXHJcbiAgICAgICAgICAgICAgICBnYW1lLmludGVycG9sYXRlZENhbVkgKiBnYW1lLlRJTEVfSEVJR0hUKSAqXHJcbiAgICAgICAgICAgICAgICB1cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgdGhpcy53aWR0aCAqIHVwc2NhbGVTaXplICogZ2FtZS5USUxFX1dJRFRILFxyXG4gICAgICAgICAgICB0aGlzLmhlaWdodCAqIHVwc2NhbGVTaXplICogZ2FtZS5USUxFX0hFSUdIVFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgdGhpcy5hbmltYXRpb25zW3RoaXMuY3VycmVudEFuaW1hdGlvbl1bdGhpcy5hbmltRnJhbWVdWzBdLnJlbmRlcldvcmxkc3BhY2VSZWZsZWN0aW9uKFxyXG4gICAgICAgICAgICB0aGlzLngsXHJcbiAgICAgICAgICAgIHRoaXMueSt0aGlzLmhlaWdodCxcclxuICAgICAgICAgICAgdGhpcy53aWR0aCxcclxuICAgICAgICAgICAgdGhpcy5oZWlnaHRcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICB0YXJnZXQubm9TdHJva2UoKTtcclxuXHJcbiAgICAgICAgdGFyZ2V0LnRleHRTaXplKDUgKiB1cHNjYWxlU2l6ZSk7XHJcbiAgICAgICAgdGFyZ2V0LnRleHRBbGlnbih0YXJnZXQuQ0VOVEVSLCB0YXJnZXQuVE9QKTtcclxuXHJcbiAgICAgICAgdGFyZ2V0LnRleHQoXHJcbiAgICAgICAgICAgIHRoaXMubmFtZStcIiwgdGVzdDogXCIrdGhpcy5hbmltYXRpb25zLmlkbGVbMF1bMF0uaW1hZ2UuZ2V0KDMsIDEwKSxcclxuICAgICAgICAgICAgKHRoaXMueCAqIGdhbWUuVElMRV9XSURUSCAtXHJcbiAgICAgICAgICAgICAgICBnYW1lLmludGVycG9sYXRlZENhbVggKiBnYW1lLlRJTEVfV0lEVEggK1xyXG4gICAgICAgICAgICAgICAgKHRoaXMud2lkdGggKiBnYW1lLlRJTEVfV0lEVEgpIC8gMikgKlxyXG4gICAgICAgICAgICAgICAgdXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgICh0aGlzLnkgKiBnYW1lLlRJTEVfSEVJR0hUIC1cclxuICAgICAgICAgICAgICAgIGdhbWUuaW50ZXJwb2xhdGVkQ2FtWSAqIGdhbWUuVElMRV9IRUlHSFQgLVxyXG4gICAgICAgICAgICAgICAgKHRoaXMuaGVpZ2h0ICogZ2FtZS5USUxFX1dJRFRIKSAvIDIuNSkgKlxyXG4gICAgICAgICAgICAgICAgdXBzY2FsZVNpemVcclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gaHNsVG9SZ2IoaDogbnVtYmVyLCBzOiBudW1iZXIsIGw6IG51bWJlcik6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJde1xyXG4gICAgdmFyIHIsIGcsIGI7XHJcblxyXG4gICAgaWYocyA9PSAwKXtcclxuICAgICAgICByID0gZyA9IGIgPSBsOyAvLyBhY2hyb21hdGljXHJcbiAgICB9ZWxzZXtcclxuICAgICAgICB2YXIgaHVlMnJnYiA9IGZ1bmN0aW9uIGh1ZTJyZ2IocDogbnVtYmVyLCBxOiBudW1iZXIsIHQ6IG51bWJlcil7XHJcbiAgICAgICAgICAgIGlmKHQgPCAwKSB0ICs9IDE7XHJcbiAgICAgICAgICAgIGlmKHQgPiAxKSB0IC09IDE7XHJcbiAgICAgICAgICAgIGlmKHQgPCAxLzYpIHJldHVybiBwICsgKHEgLSBwKSAqIDYgKiB0O1xyXG4gICAgICAgICAgICBpZih0IDwgMS8yKSByZXR1cm4gcTtcclxuICAgICAgICAgICAgaWYodCA8IDIvMykgcmV0dXJuIHAgKyAocSAtIHApICogKDIvMyAtIHQpICogNjtcclxuICAgICAgICAgICAgcmV0dXJuIHA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgcSA9IGwgPCAwLjUgPyBsICogKDEgKyBzKSA6IGwgKyBzIC0gbCAqIHM7XHJcbiAgICAgICAgdmFyIHAgPSAyICogbCAtIHE7XHJcbiAgICAgICAgciA9IGh1ZTJyZ2IocCwgcSwgaCArIDEvMyk7XHJcbiAgICAgICAgZyA9IGh1ZTJyZ2IocCwgcSwgaCk7XHJcbiAgICAgICAgYiA9IGh1ZTJyZ2IocCwgcSwgaCAtIDEvMyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIFtNYXRoLnJvdW5kKHIgKiAyNTUpLCBNYXRoLnJvdW5kKGcgKiAyNTUpLCBNYXRoLnJvdW5kKGIgKiAyNTUpLCAyNTVdO1xyXG59IiwiaW1wb3J0IHA1IGZyb20gJ3A1JztcclxuaW1wb3J0IHsgUmVuZGVyYWJsZSB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvUmVuZGVyYWJsZSc7XHJcbmltcG9ydCB7IEVudGl0eVBheWxvYWQgfSBmcm9tICcuLi8uLi8uLi9nbG9iYWwvRW50aXR5JztcclxuXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBTZXJ2ZXJFbnRpdHkgaW1wbGVtZW50cyBSZW5kZXJhYmxlIHtcclxuICAgIGVudGl0eUlkOiBzdHJpbmc7XHJcblxyXG4gICAgeDogbnVtYmVyID0gMDtcclxuICAgIHk6IG51bWJlciA9IDA7XHJcblxyXG4gICAgcHJvdGVjdGVkIGNvbnN0cnVjdG9yKGVudGl0eUlkOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLmVudGl0eUlkID0gZW50aXR5SWQ7XHJcbiAgICB9XHJcblxyXG4gICAgYWJzdHJhY3QgdXBkYXRlRGF0YShkYXRhOiBFbnRpdHlQYXlsb2FkKTogdm9pZDtcclxuXHJcbiAgICBhYnN0cmFjdCByZW5kZXIodGFyZ2V0OiBwNSwgdXBzY2FsZVNpemU6IG51bWJlcik6IHZvaWQ7XHJcbn1cclxuIiwiZXhwb3J0IGNsYXNzIENsaWVudFRpbGVFbnRpdHkge1xyXG4gICAgY292ZXJlZFRpbGVzOiBudW1iZXJbXVxyXG4gICAgaWQ6IHN0cmluZ1xyXG4gICAgdHlwZV86IG51bWJlclxyXG4gICAgZGF0YTogb2JqZWN0XHJcbiAgICBhbmltRnJhbWU6IG51bWJlclxyXG4gICAgYW5pbWF0ZTogYm9vbGVhblxyXG59XHJcbmV4cG9ydCBjb25zdCBUaWxlRW50aXR5QW5pbWF0aW9ucyA9IFtcclxuICAgIGZhbHNlLC8vdHJlZVxyXG5cdHRydWUsLy9kcmlsbFxyXG5cdHRydWUsLy9kcmlsbFxyXG5cdHRydWUsLy9kcmlsbFxyXG5cdHRydWUsLy9kcmlsbFxyXG5cdHRydWUsLy9kcmlsbFxyXG5cdGZhbHNlLC8vY3JhZnRpbmcgYmVuY2hcclxuXHRmYWxzZSwvL3BsYW50ZWQgc2VlZFxyXG5dIiwiaW1wb3J0IHsgZ2FtZSB9IGZyb20gXCIuLi8uLi9HYW1lXCI7XHJcbmltcG9ydCB7IFBhcnRpY2xlIH0gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvUGFydGljbGVcIjtcclxuaW1wb3J0IFNpbXBsZXhOb2lzZSBmcm9tIFwic2ltcGxleC1ub2lzZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIENvbG9yUGFydGljbGUgaW1wbGVtZW50cyBQYXJ0aWNsZSB7XHJcbiAgICBjb2xvcjogc3RyaW5nXHJcbiAgICB4OiBudW1iZXI7XHJcbiAgICB5OiBudW1iZXI7XHJcbiAgICBzaXplOiBudW1iZXI7XHJcbiAgICB4VmVsOiBudW1iZXI7XHJcbiAgICB5VmVsOiBudW1iZXI7XHJcbiAgICBncmF2aXR5OiBib29sZWFuO1xyXG4gICAgd2luZDogYm9vbGVhbjtcclxuICAgIGFnZTogbnVtYmVyO1xyXG4gICAgbGlmZXNwYW46IG51bWJlcjtcclxuICAgIG5vaXNlOiBTaW1wbGV4Tm9pc2VcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihjb2xvcjogc3RyaW5nLCBzaXplOiBudW1iZXIsIGxpZmVzcGFuOiBudW1iZXIsIHg6IG51bWJlciwgeTogbnVtYmVyLCB4VmVsPzogbnVtYmVyLCB5VmVsPzogbnVtYmVyLCBncmF2aXR5PzogYm9vbGVhbiwgd2luZD86IGJvb2xlYW4pIHtcclxuICAgICAgICB0aGlzLmNvbG9yID0gY29sb3I7XHJcbiAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICB0aGlzLnkgPSB5O1xyXG4gICAgICAgIHRoaXMueFZlbCA9IHhWZWwgfHwgMDtcclxuICAgICAgICB0aGlzLnlWZWwgPSB5VmVsIHx8IDA7XHJcbiAgICAgICAgdGhpcy5zaXplID0gc2l6ZTtcclxuICAgICAgICB0aGlzLmdyYXZpdHkgPSB0cnVlOy8vdXNpbmcgdGhlIG9yIG1vZGlmaWVyIHdpdGggYm9vbGVhbnMgY2F1c2VzIGJ1Z3M7IHRoZXJlJ3MgcHJvYmFibHkgYSBiZXR0ZXIgd2F5IHRvIGRvIHRoaXNcclxuICAgICAgICBpZiAoZ3Jhdml0eSAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB0aGlzLmdyYXZpdHkgPSBncmF2aXR5O1xyXG5cclxuICAgICAgICB0aGlzLndpbmQgPSBmYWxzZTsvL3VzaW5nIHRoZSBvciBtb2RpZmllciB3aXRoIGJvb2xlYW5zIGNhdXNlcyBidWdzOyB0aGVyZSdzIHByb2JhYmx5IGEgYmV0dGVyIHdheSB0byBkbyB0aGlzXHJcbiAgICAgICAgaWYgKHdpbmQgIT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgdGhpcy53aW5kID0gd2luZDtcclxuICAgICAgICB0aGlzLmFnZSA9IDA7XHJcbiAgICAgICAgdGhpcy5saWZlc3BhbiA9IGxpZmVzcGFuO1xyXG4gICAgICAgIHRoaXMubm9pc2UgPSBuZXcgU2ltcGxleE5vaXNlKFwiYXNkZmFzZGZhc2RmYXNcIik7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKHRhcmdldDogaW1wb3J0KFwicDVcIiksIHVwc2NhbGVTaXplOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5hZ2UgLyB0aGlzLmxpZmVzcGFuIDwgMC44KSB7Ly9pZiBpdCdzIHVuZGVyIDgwJSBvZiB0aGUgcGFydGljbGUncyBsaWZlc3BhbiwgZHJhdyBub3JtYWxseSB3aXRob3V0IGZhZGVcclxuICAgICAgICAgICAgdGFyZ2V0LmZpbGwodGhpcy5jb2xvcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Ugey8vdGhpcyBtZWFucyB0aGF0IHRoZSBwYXJ0aWNsZSBpcyBhbG1vc3QgZ29pbmcgdG8gYmUgZGVsZXRlZCwgc28gZmFkaW5nIGlzIG5lY2Vzc2FyeVxyXG4gICAgICAgICAgICBpZiAodGhpcy5jb2xvci5sZW5ndGggPT09IDcpIHsvL2lmIHRoZXJlIGlzIG5vIHRyYW5zcGFyZW5jeSBieSBkZWZhdWx0LCBqdXN0IG1hcCB0aGUgdGhpbmdzXHJcbiAgICAgICAgICAgICAgICBsZXQgdHJhbnNwYXJlbmN5U3RyaW5nID0gTWF0aC5yb3VuZCgyNTUgKiAoLTUgKiAodGhpcy5hZ2UgLyB0aGlzLmxpZmVzcGFuKSArIDUpKS50b1N0cmluZygxNikuc3Vic3RyaW5nKDAsIDIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRyYW5zcGFyZW5jeVN0cmluZz09PXVuZGVmaW5lZCB8fCB0cmFuc3BhcmVuY3lTdHJpbmcubGVuZ3RoPT09dW5kZWZpbmVkKS8vY2F0Y2ggd2hhdCBjb3VsZCBiZSBhbiBpbmZpbml0ZSBsb29wIG9yIGp1c3QgYW4gZXJyb3JcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGB1bmRlZmluZWQgdHJhbnNwYXJlbmN5IHN0cmluZyBvbiBwYXJ0aWNsZWBcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgd2hpbGUodHJhbnNwYXJlbmN5U3RyaW5nLmxlbmd0aDwyKSB7Ly9tYWtlIHN1cmUgaXQncyAyIGNoYXJhY3RlcnMgbG9uZzsgdGhpcyBzdG9wcyB0aGUgY29tcHV0ZXIgZnJvbSBpbnRlcnByZXRpbmcgI2ZmIGZmIGZmIDUgYXMgI2ZmIGZmIGZmIDU1IGluc3RlYWQgb2YgI2ZmIGZmIGZmIDA1XHJcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNwYXJlbmN5U3RyaW5nID0gXCIwXCIrdHJhbnNwYXJlbmN5U3RyaW5nO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0LmZpbGwodGhpcy5jb2xvci5zdWJzdHJpbmcoMCwgNykgKyB0cmFuc3BhcmVuY3lTdHJpbmcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Ugey8vaWYgdGhlcmUgaXMgdHJhbnNwYXJlbmN5LCBtdWx0aXBseVxyXG4gICAgICAgICAgICAgICAgbGV0IHRyYW5zcGFyZW5jeVN0cmluZyA9IE1hdGgucm91bmQocGFyc2VJbnQodGhpcy5jb2xvci5zdWJzdHJpbmcoNywgOSksIDE2KSAqICgtNSAqICh0aGlzLmFnZSAvIHRoaXMubGlmZXNwYW4pICsgNSkpLnRvU3RyaW5nKDE2KS5zdWJzdHJpbmcoMCwgMik7XHJcbiAgICAgICAgICAgICAgICBpZiAodHJhbnNwYXJlbmN5U3RyaW5nPT09dW5kZWZpbmVkIHx8IHRyYW5zcGFyZW5jeVN0cmluZy5sZW5ndGg9PT11bmRlZmluZWQpLy9jYXRjaCB3aGF0IGNvdWxkIGJlIGFuIGluZmluaXRlIGxvb3Agb3IganVzdCBhbiBlcnJvclxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcclxuICAgICAgICAgICAgICAgICAgICAgICAgYHVuZGVmaW5lZCB0cmFuc3BhcmVuY3kgc3RyaW5nIG9uIHBhcnRpY2xlYFxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSh0cmFuc3BhcmVuY3lTdHJpbmcubGVuZ3RoPDIpIHsvL21ha2Ugc3VyZSBpdCdzIDIgY2hhcmFjdGVycyBsb25nOyB0aGlzIHN0b3BzIHRoZSBjb21wdXRlciBmcm9tIGludGVycHJldGluZyAjZmYgZmYgZmYgNSBhcyAjZmYgZmYgZmYgNTUgaW5zdGVhZCBvZiAjZmYgZmYgZmYgMDVcclxuICAgICAgICAgICAgICAgICAgICB0cmFuc3BhcmVuY3lTdHJpbmcgPSBcIjBcIit0cmFuc3BhcmVuY3lTdHJpbmc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQuZmlsbCh0aGlzLmNvbG9yLnN1YnN0cmluZygwLCA3KSArIHRyYW5zcGFyZW5jeVN0cmluZyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy9kcmF3IGEgcmVjdGFuZ2xlIGNlbnRlcmVkIG9uIHRoZSB4IGFuZCB5IHBvc2l0aW9uIGZpbGxlZCB3aXRoIHRoZSBjb2xvciBvZiB0aGUgb2JqZWN0XHJcbiAgICAgICAgdGFyZ2V0LnJlY3QoXHJcbiAgICAgICAgICAgICgtdGhpcy5zaXplIC8gMiArIHRoaXMueCAqIGdhbWUuVElMRV9XSURUSCAtXHJcbiAgICAgICAgICAgICAgICBnYW1lLmludGVycG9sYXRlZENhbVggKiBnYW1lLlRJTEVfV0lEVEgpICpcclxuICAgICAgICAgICAgdXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgICgtdGhpcy5zaXplIC8gMiArIHRoaXMueSAqIGdhbWUuVElMRV9IRUlHSFQgLVxyXG4gICAgICAgICAgICAgICAgZ2FtZS5pbnRlcnBvbGF0ZWRDYW1ZICogZ2FtZS5USUxFX0hFSUdIVCkgKlxyXG4gICAgICAgICAgICB1cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgdGhpcy5zaXplICogdXBzY2FsZVNpemUgKiBnYW1lLlRJTEVfV0lEVEgsXHJcbiAgICAgICAgICAgIHRoaXMuc2l6ZSAqIHVwc2NhbGVTaXplICogZ2FtZS5USUxFX0hFSUdIVFxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgdGljaygpIHtcclxuICAgICAgICB0aGlzLmFnZSsrO1xyXG4gICAgICAgIHRoaXMueCArPSB0aGlzLnhWZWw7XHJcbiAgICAgICAgdGhpcy55ICs9IHRoaXMueVZlbDtcclxuICAgICAgICB0aGlzLnhWZWwgLT0gKE1hdGguYWJzKHRoaXMueFZlbCkgKiB0aGlzLnhWZWwgKiBnYW1lLkRSQUdfQ09FRkZJQ0lFTlQgKiB0aGlzLnNpemUpOy8vYXNzdW1pbmcgY29uc3RhbnQgbWFzcyBmb3IgZWFjaCBwYXJ0aWNsZVxyXG4gICAgICAgIGlmICh0aGlzLmdyYXZpdHkpIHtcclxuICAgICAgICAgICAgdGhpcy55VmVsICs9IGdhbWUuR1JBVklUWV9TUEVFRDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMud2luZCkge1xyXG4gICAgICAgICAgICB0aGlzLnhWZWwgKz0gdGhpcy5ub2lzZS5ub2lzZTJEKHRoaXMueC8xMCwgdGhpcy55LzEwKS80MFxyXG4gICAgICAgICAgICB0aGlzLnlWZWwgKz0gdGhpcy5ub2lzZS5ub2lzZTJEKHRoaXMueS8xMCwgdGhpcy54LzEwKS80MFxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnlWZWwgLT0gKE1hdGguYWJzKHRoaXMueVZlbCkgKiB0aGlzLnlWZWwgKiBnYW1lLkRSQUdfQ09FRkZJQ0lFTlQgKiB0aGlzLnNpemUpO1xyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCB7IEludmVudG9yeVBheWxvYWQsIEl0ZW1UeXBlIH0gZnJvbSAnLi9JbnZlbnRvcnknO1xyXG5cclxuZXhwb3J0IGVudW0gRW50aXRpZXMge1xyXG5cdExvY2FsUGxheWVyLFxyXG5cdFBsYXllcixcclxuXHRJdGVtLFxyXG59XHJcblxyXG50eXBlIERhdGFQYWlyczxULCBLIGV4dGVuZHMga2V5b2YgVCA9IGtleW9mIFQ+ID0gSyBleHRlbmRzIGtleW9mIFRcclxuXHQ/IHsgdHlwZTogSzsgZGF0YTogVFtLXSB9XHJcblx0OiBuZXZlcjtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgRW50aXRpZXNEYXRhIHtcclxuXHRbRW50aXRpZXMuTG9jYWxQbGF5ZXJdOiB7XHJcblx0XHRuYW1lOiBzdHJpbmc7XHJcblx0XHR4OiBudW1iZXI7XHJcblx0XHR5OiBudW1iZXI7XHJcblx0fTtcclxuXHRbRW50aXRpZXMuUGxheWVyXTogeyBuYW1lOiBzdHJpbmcgfTtcclxuXHRbRW50aXRpZXMuSXRlbV06IHsgaXRlbTogSXRlbVR5cGU7IHg6IG51bWJlcjsgeTogbnVtYmVyIH07XHJcbn1cclxuXHJcbmV4cG9ydCB0eXBlIEVudGl0eURhdGE8VCBleHRlbmRzIEVudGl0aWVzID0ga2V5b2YgRW50aXRpZXNEYXRhPiA9IERhdGFQYWlyczxcclxuXHRFbnRpdGllc0RhdGEsXHJcblx0VFxyXG4+O1xyXG5cclxuZXhwb3J0IHR5cGUgRW50aXR5UGF5bG9hZDxUIGV4dGVuZHMgRW50aXRpZXMgPSBrZXlvZiBFbnRpdGllc0RhdGE+ID1cclxuXHRFbnRpdHlEYXRhPFQ+ICYgeyBpZDogc3RyaW5nIH07XHJcbiIsImltcG9ydCB7IFRpbGVUeXBlIH0gZnJvbSAnLi9UaWxlJztcclxuaW1wb3J0IHsgVGlsZUVudGl0aWVzIH0gZnJvbSAnLi9UaWxlRW50aXR5JztcclxuXHJcbnR5cGUgRGF0YVBhaXJzPFQsIEsgZXh0ZW5kcyBrZXlvZiBUID0ga2V5b2YgVD4gPSBLIGV4dGVuZHMga2V5b2YgVFxyXG5cdD8geyB0eXBlOiBLIH0gJiBUW0tdXHJcblx0OiBuZXZlcjtcclxuXHJcbmNvbnN0IGl0ZW1UeXBlRGF0YSA9IDxELCBUIGV4dGVuZHMgUmVjb3JkPEl0ZW1UeXBlLCBEYXRhUGFpcnM8Q2F0ZWdvcnlEYXRhPj4+KFxyXG5cdGRhdGE6IFQsXHJcbik6IFQgPT4gZGF0YTtcclxuXHJcbmV4cG9ydCBlbnVtIEl0ZW1DYXRlZ29yaWVzIHtcclxuXHRUaWxlLFxyXG5cdFJlc291cmNlLFxyXG5cdFRvb2wsXHJcblx0VGlsZUVudGl0eSxcclxufVxyXG5cclxuZXhwb3J0IHR5cGUgQ2F0ZWdvcnlEYXRhID0ge1xyXG5cdFtJdGVtQ2F0ZWdvcmllcy5UaWxlXTogeyBwbGFjZWRUaWxlOiBUaWxlVHlwZSwgbWF4U3RhY2tTaXplPzogbnVtYmVyfTtcclxuXHRbSXRlbUNhdGVnb3JpZXMuUmVzb3VyY2VdOiB7fTtcclxuXHRbSXRlbUNhdGVnb3JpZXMuVG9vbF06IHsgYnJlYWthYmxlVGlsZXM6IFRpbGVUeXBlW119O1xyXG5cdFtJdGVtQ2F0ZWdvcmllcy5UaWxlRW50aXR5XTogeyBwbGFjZWRUaWxlRW50aXR5OiBudW1iZXIsIHRpbGVFbnRpdHlPZmZzZXQ/OiBbbnVtYmVyLCBudW1iZXJdfTtcclxufTtcclxuXHJcbmV4cG9ydCBlbnVtIEl0ZW1UeXBlIHtcclxuXHRTbm93QmxvY2ssXHJcblx0SWNlQmxvY2ssXHJcblx0RGlydEJsb2NrLFxyXG5cdFN0b25lMEJsb2NrLFxyXG5cdFN0b25lMUJsb2NrLFxyXG5cdFN0b25lMkJsb2NrLFxyXG5cdFN0b25lM0Jsb2NrLFxyXG5cdFN0b25lNEJsb2NrLFxyXG5cdFN0b25lNUJsb2NrLFxyXG5cdFN0b25lNkJsb2NrLFxyXG5cdFN0b25lN0Jsb2NrLFxyXG5cdFN0b25lOEJsb2NrLFxyXG5cdFN0b25lOUJsb2NrLFxyXG5cdFRpbkJsb2NrLFxyXG5cdEFsdW1pbnVtQmxvY2ssXHJcblx0R29sZEJsb2NrLFxyXG5cdFRpdGFuaXVtQmxvY2ssXHJcblx0R3JhcGVCbG9jayxcclxuXHRXb29kMEJsb2NrLFxyXG5cdFdvb2QxQmxvY2ssXHJcblx0V29vZDJCbG9jayxcclxuXHRXb29kM0Jsb2NrLFxyXG5cdFdvb2Q0QmxvY2ssXHJcblx0V29vZDVCbG9jayxcclxuXHRXb29kNkJsb2NrLFxyXG5cdFdvb2Q3QmxvY2ssXHJcblx0V29vZDhCbG9jayxcclxuXHRXb29kOUJsb2NrLFxyXG5cdFNlZWQsXHJcbn1cclxuXHJcbmV4cG9ydCB0eXBlIEl0ZW1TdGFjayA9IHtcclxuXHRxdWFudGl0eTogbnVtYmVyO1xyXG5cdGl0ZW06IEl0ZW1UeXBlO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IEl0ZW1zID0gaXRlbVR5cGVEYXRhKHtcclxuXHRbSXRlbVR5cGUuU25vd0Jsb2NrXToge1xyXG5cdFx0dHlwZTogSXRlbUNhdGVnb3JpZXMuVGlsZSxcclxuXHRcdHBsYWNlZFRpbGU6IFRpbGVUeXBlLlNub3csXHJcblx0fSxcclxuXHRbSXRlbVR5cGUuSWNlQmxvY2tdOiB7XHJcblx0XHR0eXBlOiBJdGVtQ2F0ZWdvcmllcy5UaWxlLFxyXG5cdFx0cGxhY2VkVGlsZTogVGlsZVR5cGUuSWNlLFxyXG5cdH0sXHJcblx0W0l0ZW1UeXBlLkRpcnRCbG9ja106IHtcclxuXHRcdHR5cGU6IEl0ZW1DYXRlZ29yaWVzLlRpbGUsXHJcblx0XHRwbGFjZWRUaWxlOiBUaWxlVHlwZS5EaXJ0LFxyXG5cdH0sXHJcblx0W0l0ZW1UeXBlLlN0b25lMEJsb2NrXToge1xyXG5cdFx0dHlwZTogSXRlbUNhdGVnb3JpZXMuVGlsZSxcclxuXHRcdHBsYWNlZFRpbGU6IFRpbGVUeXBlLlN0b25lMCxcclxuXHR9LFxyXG5cdFtJdGVtVHlwZS5TdG9uZTFCbG9ja106IHtcclxuXHRcdHR5cGU6IEl0ZW1DYXRlZ29yaWVzLlRpbGUsXHJcblx0XHRwbGFjZWRUaWxlOiBUaWxlVHlwZS5TdG9uZTEsXHJcblx0fSxcclxuXHRbSXRlbVR5cGUuU3RvbmUyQmxvY2tdOiB7XHJcblx0XHR0eXBlOiBJdGVtQ2F0ZWdvcmllcy5UaWxlLFxyXG5cdFx0cGxhY2VkVGlsZTogVGlsZVR5cGUuU3RvbmUyLFxyXG5cdH0sXHJcblx0W0l0ZW1UeXBlLlN0b25lM0Jsb2NrXToge1xyXG5cdFx0dHlwZTogSXRlbUNhdGVnb3JpZXMuVGlsZSxcclxuXHRcdHBsYWNlZFRpbGU6IFRpbGVUeXBlLlN0b25lMyxcclxuXHR9LFxyXG5cdFtJdGVtVHlwZS5TdG9uZTRCbG9ja106IHtcclxuXHRcdHR5cGU6IEl0ZW1DYXRlZ29yaWVzLlRpbGUsXHJcblx0XHRwbGFjZWRUaWxlOiBUaWxlVHlwZS5TdG9uZTQsXHJcblx0fSxcclxuXHRbSXRlbVR5cGUuU3RvbmU1QmxvY2tdOiB7XHJcblx0XHR0eXBlOiBJdGVtQ2F0ZWdvcmllcy5UaWxlLFxyXG5cdFx0cGxhY2VkVGlsZTogVGlsZVR5cGUuU3RvbmU1LFxyXG5cdH0sXHJcblx0W0l0ZW1UeXBlLlN0b25lNkJsb2NrXToge1xyXG5cdFx0dHlwZTogSXRlbUNhdGVnb3JpZXMuVGlsZSxcclxuXHRcdHBsYWNlZFRpbGU6IFRpbGVUeXBlLlN0b25lNixcclxuXHR9LFxyXG5cdFtJdGVtVHlwZS5TdG9uZTdCbG9ja106IHtcclxuXHRcdHR5cGU6IEl0ZW1DYXRlZ29yaWVzLlRpbGUsXHJcblx0XHRwbGFjZWRUaWxlOiBUaWxlVHlwZS5TdG9uZTcsXHJcblx0fSxcclxuXHRbSXRlbVR5cGUuU3RvbmU4QmxvY2tdOiB7XHJcblx0XHR0eXBlOiBJdGVtQ2F0ZWdvcmllcy5UaWxlLFxyXG5cdFx0cGxhY2VkVGlsZTogVGlsZVR5cGUuU3RvbmU4LFxyXG5cdH0sXHJcblx0W0l0ZW1UeXBlLlN0b25lOUJsb2NrXToge1xyXG5cdFx0dHlwZTogSXRlbUNhdGVnb3JpZXMuVGlsZSxcclxuXHRcdHBsYWNlZFRpbGU6IFRpbGVUeXBlLlN0b25lOSxcclxuXHR9LFxyXG5cdFtJdGVtVHlwZS5UaW5CbG9ja106IHtcclxuXHRcdHR5cGU6IEl0ZW1DYXRlZ29yaWVzLlRpbGUsXHJcblx0XHRwbGFjZWRUaWxlOiBUaWxlVHlwZS5UaW4sXHJcblx0fSxcclxuXHRbSXRlbVR5cGUuQWx1bWludW1CbG9ja106IHtcclxuXHRcdHR5cGU6IEl0ZW1DYXRlZ29yaWVzLlRpbGUsXHJcblx0XHRwbGFjZWRUaWxlOiBUaWxlVHlwZS5BbHVtaW51bSxcclxuXHR9LFxyXG5cdFtJdGVtVHlwZS5Hb2xkQmxvY2tdOiB7XHJcblx0XHR0eXBlOiBJdGVtQ2F0ZWdvcmllcy5UaWxlLFxyXG5cdFx0cGxhY2VkVGlsZTogVGlsZVR5cGUuR29sZCxcclxuXHR9LFxyXG5cdFtJdGVtVHlwZS5UaXRhbml1bUJsb2NrXToge1xyXG5cdFx0dHlwZTogSXRlbUNhdGVnb3JpZXMuVGlsZSxcclxuXHRcdHBsYWNlZFRpbGU6IFRpbGVUeXBlLlRpdGFuaXVtLFxyXG5cdH0sXHJcblx0W0l0ZW1UeXBlLkdyYXBlQmxvY2tdOiB7XHJcblx0XHR0eXBlOiBJdGVtQ2F0ZWdvcmllcy5UaWxlLFxyXG5cdFx0cGxhY2VkVGlsZTogVGlsZVR5cGUuR3JhcGUsXHJcblx0fSxcclxuXHRbSXRlbVR5cGUuV29vZDBCbG9ja106IHtcclxuXHRcdHR5cGU6IEl0ZW1DYXRlZ29yaWVzLlRpbGUsXHJcblx0XHRwbGFjZWRUaWxlOiBUaWxlVHlwZS5Xb29kMCxcclxuXHR9LFxyXG5cdFtJdGVtVHlwZS5Xb29kMUJsb2NrXToge1xyXG5cdFx0dHlwZTogSXRlbUNhdGVnb3JpZXMuVGlsZSxcclxuXHRcdHBsYWNlZFRpbGU6IFRpbGVUeXBlLldvb2QxLFxyXG5cdH0sXHJcblx0W0l0ZW1UeXBlLldvb2QyQmxvY2tdOiB7XHJcblx0XHR0eXBlOiBJdGVtQ2F0ZWdvcmllcy5UaWxlLFxyXG5cdFx0cGxhY2VkVGlsZTogVGlsZVR5cGUuV29vZDIsXHJcblx0fSxcclxuXHRbSXRlbVR5cGUuV29vZDNCbG9ja106IHtcclxuXHRcdHR5cGU6IEl0ZW1DYXRlZ29yaWVzLlRpbGUsXHJcblx0XHRwbGFjZWRUaWxlOiBUaWxlVHlwZS5Xb29kMyxcclxuXHR9LFxyXG5cdFtJdGVtVHlwZS5Xb29kNEJsb2NrXToge1xyXG5cdFx0dHlwZTogSXRlbUNhdGVnb3JpZXMuVGlsZSxcclxuXHRcdHBsYWNlZFRpbGU6IFRpbGVUeXBlLldvb2Q0LFxyXG5cdH0sXHJcblx0W0l0ZW1UeXBlLldvb2Q1QmxvY2tdOiB7XHJcblx0XHR0eXBlOiBJdGVtQ2F0ZWdvcmllcy5UaWxlLFxyXG5cdFx0cGxhY2VkVGlsZTogVGlsZVR5cGUuV29vZDUsXHJcblx0fSxcclxuXHRbSXRlbVR5cGUuV29vZDZCbG9ja106IHtcclxuXHRcdHR5cGU6IEl0ZW1DYXRlZ29yaWVzLlRpbGUsXHJcblx0XHRwbGFjZWRUaWxlOiBUaWxlVHlwZS5Xb29kNixcclxuXHR9LFxyXG5cdFtJdGVtVHlwZS5Xb29kN0Jsb2NrXToge1xyXG5cdFx0dHlwZTogSXRlbUNhdGVnb3JpZXMuVGlsZSxcclxuXHRcdHBsYWNlZFRpbGU6IFRpbGVUeXBlLldvb2Q3LFxyXG5cdH0sXHJcblx0W0l0ZW1UeXBlLldvb2Q4QmxvY2tdOiB7XHJcblx0XHR0eXBlOiBJdGVtQ2F0ZWdvcmllcy5UaWxlLFxyXG5cdFx0cGxhY2VkVGlsZTogVGlsZVR5cGUuV29vZDgsXHJcblx0fSxcclxuXHRbSXRlbVR5cGUuV29vZDlCbG9ja106IHtcclxuXHRcdHR5cGU6IEl0ZW1DYXRlZ29yaWVzLlRpbGUsXHJcblx0XHRwbGFjZWRUaWxlOiBUaWxlVHlwZS5Xb29kOSxcclxuXHR9LFxyXG5cdFtJdGVtVHlwZS5TZWVkXToge1xyXG5cdFx0dHlwZTogSXRlbUNhdGVnb3JpZXMuVGlsZUVudGl0eSxcclxuXHRcdHBsYWNlZFRpbGVFbnRpdHk6IFRpbGVFbnRpdGllcy5TZWVkLFxyXG5cdFx0dGlsZUVudGl0eU9mZnNldDogWy0xLCAtNl0sXHJcblx0fSxcclxuXHQvLyBbSXRlbVR5cGUuVGluUGlja2F4ZV06IHtcclxuXHQvLyBcdHR5cGU6IEl0ZW1DYXRlZ29yaWVzLlRvb2wsXHJcblx0Ly8gXHRicmVha2FibGVUaWxlczogW1RpbGVUeXBlLlNub3csIFRpbGVUeXBlLkljZSwgVGlsZVR5cGUuRGlydCwgVGlsZVR5cGUuV29vZDAsIFRpbGVUeXBlLlN0b25lMCwgVGlsZVR5cGUuU3RvbmUxLCBUaWxlVHlwZS5UaW4sIFRpbGVUeXBlLkFsdW1pbnVtXVxyXG5cdC8vIH1cclxufSk7XHJcblxyXG5leHBvcnQgdHlwZSBJbnZlbnRvcnlVcGRhdGVQYXlsb2FkID0ge1xyXG5cdHNsb3Q6IG51bWJlcjtcclxuXHRpdGVtOiBJdGVtU3RhY2sgfCB1bmRlZmluZWQ7XHJcbn1bXTtcclxuXHJcbmV4cG9ydCB0eXBlIEludmVudG9yeVBheWxvYWQgPSB7XHJcblx0aXRlbXM6IChJdGVtU3RhY2sgfCB1bmRlZmluZWQpW107XHJcblxyXG5cdHdpZHRoOiBudW1iZXI7XHJcblx0aGVpZ2h0OiBudW1iZXI7XHJcbn07XHJcbiIsImV4cG9ydCBlbnVtIFRpbGVUeXBlIHtcclxuXHRBaXIsXHJcblx0U25vdyxcclxuXHRJY2UsXHJcblx0RGlydCxcclxuXHRTdG9uZTAsXHJcblx0U3RvbmUxLFxyXG5cdFN0b25lMixcclxuXHRTdG9uZTMsXHJcblx0U3RvbmU0LFxyXG5cdFN0b25lNSxcclxuXHRTdG9uZTYsXHJcblx0U3RvbmU3LFxyXG5cdFN0b25lOCxcclxuXHRTdG9uZTksXHJcblx0VGluLFxyXG5cdEFsdW1pbnVtLFxyXG5cdEdvbGQsXHJcblx0VGl0YW5pdW0sXHJcblx0R3JhcGUsXHJcblx0V29vZDAsXHJcblx0V29vZDEsXHJcblx0V29vZDIsXHJcblx0V29vZDMsXHJcblx0V29vZDQsXHJcblx0V29vZDUsXHJcblx0V29vZDYsXHJcblx0V29vZDcsXHJcblx0V29vZDgsXHJcblx0V29vZDksXHJcbn0iLCJleHBvcnQgZW51bSBUaWxlRW50aXRpZXMge1xyXG5cdFRyZWUsXHJcblx0VGllcjFEcmlsbCxcclxuXHRUaWVyMkRyaWxsLFxyXG5cdFRpZXIzRHJpbGwsXHJcblx0VGllcjREcmlsbCxcclxuXHRUaWVyNURyaWxsLFxyXG5cdENyYWZ0aW5nQmVuY2gsXHJcblx0U2VlZCxcclxufVxyXG5cclxudHlwZSBEYXRhUGFpcnM8VCwgSyBleHRlbmRzIGtleW9mIFQgPSBrZXlvZiBUPiA9IEsgZXh0ZW5kcyBrZXlvZiBUXHJcblx0PyB7IHR5cGVfOiBLOyBkYXRhOiBUW0tdIH1cclxuXHQ6IG5ldmVyO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBUaWxlRW50aXRpZXNEYXRhIHtcclxuXHRbVGlsZUVudGl0aWVzLlRyZWVdOiB7IHdvb2RDb3VudDogbnVtYmVyOyBzZWVkQ291bnQ6IG51bWJlciB9O1xyXG5cdFtUaWxlRW50aXRpZXMuVGllcjFEcmlsbF06IHsgIH07XHJcblx0W1RpbGVFbnRpdGllcy5UaWVyMkRyaWxsXTogeyAgfTtcclxuXHRbVGlsZUVudGl0aWVzLlRpZXIzRHJpbGxdOiB7ICB9O1xyXG5cdFtUaWxlRW50aXRpZXMuVGllcjREcmlsbF06IHsgIH07XHJcblx0W1RpbGVFbnRpdGllcy5UaWVyNURyaWxsXTogeyAgfTtcclxuXHRbVGlsZUVudGl0aWVzLkNyYWZ0aW5nQmVuY2hdOiB7ICB9O1xyXG5cdFtUaWxlRW50aXRpZXMuU2VlZF06IHsgIH07XHJcbn1cclxuXHJcbmV4cG9ydCB0eXBlIFRpbGVFbnRpdHlEYXRhID0gRGF0YVBhaXJzPFRpbGVFbnRpdGllc0RhdGE+ICYge31cclxuXHJcbmV4cG9ydCB0eXBlIFRpbGVFbnRpdHlQYXlsb2FkID0ge1xyXG5cdGlkOiBzdHJpbmc7XHJcblx0Y292ZXJlZFRpbGVzOiBudW1iZXJbXTtcclxuXHRwYXlsb2FkOiBUaWxlRW50aXR5RGF0YTtcclxufTtcclxuXHJcbmV4cG9ydCBlbnVtIFRpbGVFbnRpdHlUZXh0dXJlcyB7XHJcblx0VHJlZTEsXHJcblx0VHJlZTIsXHJcblx0VHJlZTMsXHJcblx0VHJlZTQsXHJcblx0VHJlZTUsXHJcblx0VHJlZTYsXHJcblx0VHJlZTcsXHJcblx0VHJlZTgsXHJcblx0VHJlZTksXHJcblx0VHJlZTEwLFxyXG59XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuIiwidmFyIGRlZmVycmVkID0gW107XG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8gPSAocmVzdWx0LCBjaHVua0lkcywgZm4sIHByaW9yaXR5KSA9PiB7XG5cdGlmKGNodW5rSWRzKSB7XG5cdFx0cHJpb3JpdHkgPSBwcmlvcml0eSB8fCAwO1xuXHRcdGZvcih2YXIgaSA9IGRlZmVycmVkLmxlbmd0aDsgaSA+IDAgJiYgZGVmZXJyZWRbaSAtIDFdWzJdID4gcHJpb3JpdHk7IGktLSkgZGVmZXJyZWRbaV0gPSBkZWZlcnJlZFtpIC0gMV07XG5cdFx0ZGVmZXJyZWRbaV0gPSBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV07XG5cdFx0cmV0dXJuO1xuXHR9XG5cdHZhciBub3RGdWxmaWxsZWQgPSBJbmZpbml0eTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZWZlcnJlZC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV0gPSBkZWZlcnJlZFtpXTtcblx0XHR2YXIgZnVsZmlsbGVkID0gdHJ1ZTtcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGNodW5rSWRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRpZiAoKHByaW9yaXR5ICYgMSA9PT0gMCB8fCBub3RGdWxmaWxsZWQgPj0gcHJpb3JpdHkpICYmIE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uTykuZXZlcnkoKGtleSkgPT4gKF9fd2VicGFja19yZXF1aXJlX18uT1trZXldKGNodW5rSWRzW2pdKSkpKSB7XG5cdFx0XHRcdGNodW5rSWRzLnNwbGljZShqLS0sIDEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZnVsZmlsbGVkID0gZmFsc2U7XG5cdFx0XHRcdGlmKHByaW9yaXR5IDwgbm90RnVsZmlsbGVkKSBub3RGdWxmaWxsZWQgPSBwcmlvcml0eTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYoZnVsZmlsbGVkKSB7XG5cdFx0XHRkZWZlcnJlZC5zcGxpY2UoaS0tLCAxKVxuXHRcdFx0dmFyIHIgPSBmbigpO1xuXHRcdFx0aWYgKHIgIT09IHVuZGVmaW5lZCkgcmVzdWx0ID0gcjtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn07IiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmcgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpIHJldHVybiBnbG9iYWxUaGlzO1xuXHR0cnkge1xuXHRcdHJldHVybiB0aGlzIHx8IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSByZXR1cm4gd2luZG93O1xuXHR9XG59KSgpOyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBubyBiYXNlVVJJXG5cbi8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4vLyB1bmRlZmluZWQgPSBjaHVuayBub3QgbG9hZGVkLCBudWxsID0gY2h1bmsgcHJlbG9hZGVkL3ByZWZldGNoZWRcbi8vIFtyZXNvbHZlLCByZWplY3QsIFByb21pc2VdID0gY2h1bmsgbG9hZGluZywgMCA9IGNodW5rIGxvYWRlZFxudmFyIGluc3RhbGxlZENodW5rcyA9IHtcblx0XCJtYWluXCI6IDBcbn07XG5cbi8vIG5vIGNodW5rIG9uIGRlbWFuZCBsb2FkaW5nXG5cbi8vIG5vIHByZWZldGNoaW5nXG5cbi8vIG5vIHByZWxvYWRlZFxuXG4vLyBubyBITVJcblxuLy8gbm8gSE1SIG1hbmlmZXN0XG5cbl9fd2VicGFja19yZXF1aXJlX18uTy5qID0gKGNodW5rSWQpID0+IChpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPT09IDApO1xuXG4vLyBpbnN0YWxsIGEgSlNPTlAgY2FsbGJhY2sgZm9yIGNodW5rIGxvYWRpbmdcbnZhciB3ZWJwYWNrSnNvbnBDYWxsYmFjayA9IChwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbiwgZGF0YSkgPT4ge1xuXHR2YXIgW2NodW5rSWRzLCBtb3JlTW9kdWxlcywgcnVudGltZV0gPSBkYXRhO1xuXHQvLyBhZGQgXCJtb3JlTW9kdWxlc1wiIHRvIHRoZSBtb2R1bGVzIG9iamVjdCxcblx0Ly8gdGhlbiBmbGFnIGFsbCBcImNodW5rSWRzXCIgYXMgbG9hZGVkIGFuZCBmaXJlIGNhbGxiYWNrXG5cdHZhciBtb2R1bGVJZCwgY2h1bmtJZCwgaSA9IDA7XG5cdGlmKGNodW5rSWRzLnNvbWUoKGlkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2lkXSAhPT0gMCkpKSB7XG5cdFx0Zm9yKG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XG5cdFx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8obW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuXHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLm1bbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihydW50aW1lKSB2YXIgcmVzdWx0ID0gcnVudGltZShfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblx0fVxuXHRpZihwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbikgcGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24oZGF0YSk7XG5cdGZvcig7aSA8IGNodW5rSWRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0Y2h1bmtJZCA9IGNodW5rSWRzW2ldO1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhpbnN0YWxsZWRDaHVua3MsIGNodW5rSWQpICYmIGluc3RhbGxlZENodW5rc1tjaHVua0lkXSkge1xuXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdWzBdKCk7XG5cdFx0fVxuXHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9IDA7XG5cdH1cblx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18uTyhyZXN1bHQpO1xufVxuXG52YXIgY2h1bmtMb2FkaW5nR2xvYmFsID0gc2VsZltcIndlYnBhY2tDaHVua3Nub3dlZF9pblwiXSA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtzbm93ZWRfaW5cIl0gfHwgW107XG5jaHVua0xvYWRpbmdHbG9iYWwuZm9yRWFjaCh3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIDApKTtcbmNodW5rTG9hZGluZ0dsb2JhbC5wdXNoID0gd2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCBjaHVua0xvYWRpbmdHbG9iYWwucHVzaC5iaW5kKGNodW5rTG9hZGluZ0dsb2JhbCkpOyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgZGVwZW5kcyBvbiBvdGhlciBsb2FkZWQgY2h1bmtzIGFuZCBleGVjdXRpb24gbmVlZCB0byBiZSBkZWxheWVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyh1bmRlZmluZWQsIFtcIm1vZHVsZXMtbWFpblwiXSwgKCkgPT4gKF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9jbGllbnQvR2FtZS50c1wiKSkpXG5fX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKF9fd2VicGFja19leHBvcnRzX18pO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9