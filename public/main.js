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
        for (let i = 0; i < 80; i++) {
            this.clouds.push(new _world_entities_Cloud__WEBPACK_IMPORTED_MODULE_10__.Cloud(Math.random() * this.width / this.upscaleSize / this.TILE_WIDTH, 4 / (0.1 + Math.random()) - 5));
        }
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
        for (let cloud of this.clouds) {
            cloud.render(this, this.upscaleSize);
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
        if (this.currentAnimation !== "idle" && _Game__WEBPACK_IMPORTED_MODULE_1__.game.worldMouseX > this.interpolatedX + this.width / 2) {
            this.currentAnimation = "idle";
            this.animFrame = this.animFrame % _assets_Assets__WEBPACK_IMPORTED_MODULE_3__.PlayerAnimations[this.currentAnimation].length;
            _Game__WEBPACK_IMPORTED_MODULE_1__.game.connection.emit('playerAnimation', this.currentAnimation, this.entityId);
        }
        if (this.currentAnimation !== "idleleft" && _Game__WEBPACK_IMPORTED_MODULE_1__.game.worldMouseX <= this.interpolatedX + this.width / 2) {
            this.currentAnimation = "idleleft";
            this.animFrame = this.animFrame % _assets_Assets__WEBPACK_IMPORTED_MODULE_3__.PlayerAnimations[this.currentAnimation].length;
            _Game__WEBPACK_IMPORTED_MODULE_1__.game.connection.emit('playerAnimation', this.currentAnimation, this.entityId);
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
        console.log(`x: ${this.x}, y: ${this.y}`);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztLQUNOLEVBQ0QsMEVBQTBFLEVBQzFFLEVBQUUsQ0FDRjtJQUVELEdBQUcsRUFBRSxJQUFJLGlFQUFZLENBQ3BCLGdDQUFnQyxFQUNoQztRQUNDLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsRUFBRTtRQUNQLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO0tBQ04sRUFDRCx3RUFBd0UsRUFDeEUsRUFBRSxDQUNGO0lBQ0QsU0FBUyxFQUFFLElBQUksaUVBQVksQ0FDMUIsa0NBQWtDLEVBQ2xDO1FBQ0MsR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLElBQUksRUFBRSxDQUFDO1FBQ1AsR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7UUFDTixHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUM7S0FDTixFQUNELDJGQUEyRixFQUMzRixDQUFDLENBQ0Q7Q0FDRCxDQUFDO0FBRUssTUFBTSxJQUFJLEdBQUc7SUFDbkIsV0FBVyxFQUFFO1FBQ1osRUFBRTtRQUNGLEVBQUU7UUFDRixFQUFFO1FBQ0YsUUFBUTtRQUNSLEVBQUU7UUFDRixFQUFFO1FBQ0YsTUFBTTtRQUNO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LENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDNUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRWxJLGlCQUFpQjtRQUNqQixJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDNUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRWxJLFNBQVM7UUFDVCxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENB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QUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDckYsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzNHLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUMzRyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFakksaUJBQWlCO1FBQ2pCLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM1RyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFbEksaUJBQWlCO1FBQ2pCLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM1RyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFbEksU0FBUztRQUNULElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUVuSSxJQUFHLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDZixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLEdBQUcsR0FBQyxtQkFBbUIsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxHQUFHLFdBQVcsR0FBRyxDQUFDLEdBQUcsV0FBVyxDQUFDLENBQUM7U0FDbEs7YUFDSTtZQUNELElBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDZCxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLEdBQUcsR0FBQyxNQUFNLEdBQUMsNERBQWdCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFDLEdBQUcsV0FBVyxHQUFHLENBQUMsR0FBRyxXQUFXLENBQUMsQ0FBQzthQUNsTDtpQkFDSTtnQkFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLEdBQUcsR0FBQyxZQUFZLEdBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxHQUFHLFdBQVcsR0FBRyxDQUFDLEdBQUcsV0FBVyxDQUFDLENBQUM7YUFDdEs7U0FDSjtJQUNMLENBQUM7SUFFRCxlQUFlLENBQUMsTUFBYyxFQUFFLE1BQWM7UUFDMUMsMERBQTBEO1FBQzFELElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxDQUFDLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLENBQUMsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUFFO1lBQzVGLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO1NBQzNCO2FBQ0k7WUFDRCxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztTQUM1QjtJQUNMLENBQUM7SUFFRCxTQUFTO1FBQ0wsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQ2pDLElBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNmLElBQUksQ0FBQyxLQUFLLEdBQUcsb0VBQXdCLENBQUM7WUFDdEMsT0FBTztTQUNWO1FBQ0QsSUFBSSxDQUFDLEtBQUssR0FBRyxzRUFBMEIsQ0FBQztRQUN4Qyw4Q0FBOEM7SUFDbEQsQ0FBQztDQUVKOzs7Ozs7Ozs7Ozs7Ozs7O0FDckcyQztBQUVyQyxNQUFNLE9BQU87SUFPaEIsWUFDSSxDQUFTLEVBQ1QsQ0FBUyxFQUNULENBQVMsRUFDVCxDQUFTO1FBQ1QsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDO1FBQ1YsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDO1FBQ1YsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDO1FBQ1YsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDO0lBQ2QsQ0FBQztJQUVELE1BQU0sQ0FBQyxNQUFVLEVBQUUsV0FBbUI7UUFDbEMsMEVBQTBFO1FBQzFFLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBQyxXQUFXLENBQUMsR0FBQyxXQUFXLENBQUM7UUFDckQsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFDLFdBQVcsQ0FBQyxHQUFDLFdBQVcsQ0FBQztRQUNyRCxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUMsV0FBVyxDQUFDLEdBQUMsV0FBVyxDQUFDO1FBQ3JELE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBQyxXQUFXLENBQUMsR0FBQyxXQUFXLENBQUM7UUFFckQsVUFBVTtRQUNWLDJFQUErQixDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBQyxXQUFXLEVBQUUsQ0FBQyxHQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN4RiwyRUFBK0IsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFDLENBQUMsR0FBQyxDQUFDLEdBQUMsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUMsV0FBVyxFQUFFLENBQUMsR0FBQyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDeEcsMkVBQStCLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxXQUFXLEVBQUUsQ0FBQyxHQUFDLFdBQVcsRUFBRSxDQUFDLEdBQUMsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3hHLDJFQUErQixDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxXQUFXLEVBQUUsQ0FBQyxHQUFDLENBQUMsR0FBQyxDQUFDLEdBQUMsV0FBVyxFQUFFLENBQUMsR0FBQyxXQUFXLEVBQUUsQ0FBQyxHQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUV4SCxpQkFBaUI7UUFDakIsMkVBQStCLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBQyxDQUFDLEdBQUMsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUMsRUFBRSxHQUFDLFdBQVcsRUFBRSxDQUFDLEdBQUMsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3pHLDJFQUErQixDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUMsQ0FBQyxHQUFDLFdBQVcsRUFBRSxDQUFDLEdBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxXQUFXLEVBQUUsQ0FBQyxHQUFDLEVBQUUsR0FBQyxXQUFXLEVBQUUsQ0FBQyxHQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUV6SCxpQkFBaUI7UUFDakIsMkVBQStCLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUMsQ0FBQyxHQUFDLFdBQVcsRUFBRSxDQUFDLEdBQUMsV0FBVyxFQUFFLENBQUMsR0FBQyxFQUFFLEdBQUMsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3pHLDJFQUErQixDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxXQUFXLEVBQUUsQ0FBQyxHQUFDLENBQUMsR0FBQyxXQUFXLEVBQUUsQ0FBQyxHQUFDLFdBQVcsRUFBRSxDQUFDLEdBQUMsRUFBRSxHQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUV6SCxTQUFTO1FBQ1QsMkVBQStCLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBQyxDQUFDLEdBQUMsV0FBVyxFQUFFLENBQUMsR0FBQyxDQUFDLEdBQUMsV0FBVyxFQUFFLENBQUMsR0FBQyxFQUFFLEdBQUMsV0FBVyxFQUFFLENBQUMsR0FBQyxFQUFFLEdBQUMsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRTlILENBQUM7Q0FDSjs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMxQzhCO0FBRWE7QUFJckMsTUFBZSxRQUFRO0lBQTlCO1FBTUksY0FBUyxHQUFXLENBQUMsQ0FBQztRQUN0QixjQUFTLEdBQVcsQ0FBQyxDQUFDO0lBd0QxQixDQUFDO0lBN0NHLFlBQVksQ0FBQyxHQUFXO1FBQ3BCLElBQUcsSUFBSSxDQUFDLE9BQU8sS0FBSyxTQUFTLEVBQUU7WUFDM0Isd0xBQXdMO1lBQ3hMLEtBQUksTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtnQkFDekIsSUFBRyxDQUFDLENBQUMsV0FBVyxFQUFFO29CQUNkLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztpQkFDakI7YUFDSjtZQUFBLENBQUM7U0FDTDtRQUNELElBQUcsSUFBSSxDQUFDLE9BQU8sS0FBSyxTQUFTLEVBQUU7WUFDM0Isa0VBQWtFO1lBQ2xFLEtBQUksTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtnQkFDekIsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLDhDQUFXLENBQUMsQ0FBQztnQkFDcEMsSUFBRyw4Q0FBVyxHQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksOENBQVcsR0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksOENBQVcsR0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLDhDQUFXLEdBQUMsQ0FBQyxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDL0UsQ0FBQyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7YUFDNUI7U0FDSjtRQUNELElBQUcsSUFBSSxDQUFDLFVBQVUsS0FBSyxTQUFTLEVBQUU7WUFDOUIsK0JBQStCO1lBQy9CLHNFQUFzRTtZQUN0RSxLQUFJLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7Z0JBQzVCLElBQUcsQ0FBQyxDQUFDLFdBQVcsRUFBRTtvQkFDZCxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7aUJBQ2pCO3FCQUNJLElBQUcsQ0FBQyxDQUFDLFNBQVMsRUFBRTtvQkFDakIsQ0FBQyxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7b0JBQ3BCLGdEQUFhLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUM7b0JBQ3JDLGdEQUFhLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7b0JBQ3hDLENBQUMsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO29CQUNkLENBQUMsQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO29CQUNuQixDQUFDLENBQUMsS0FBSyxHQUFHLHNFQUEwQixDQUFDO2lCQUN4QzthQUNKO1NBQ0o7SUFDTCxDQUFDO0lBRUQsYUFBYTtRQUNULElBQUcsSUFBSSxDQUFDLE9BQU8sS0FBSyxTQUFTLEVBQUU7WUFDM0Isa0VBQWtFO1lBQ2xFLEtBQUksTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtnQkFDekIsQ0FBQyxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7YUFDekI7U0FDSjtJQUNMLENBQUM7Q0FFSjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDMUVzQztBQUVGO0FBQ0g7QUFDQztBQUVTO0FBQ0w7QUFHaEMsTUFBTSxZQUFhLFNBQVEsK0NBQVE7SUFFekMsWUFBWSxJQUFrQixFQUFFLFNBQXVCLEVBQUUsWUFBb0I7UUFDNUUsS0FBSyxFQUFFLENBQUM7UUFDUixnR0FBZ0c7UUFDaEcsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLDZDQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFckMsMkNBQTJDO1FBQzNDLElBQUksQ0FBQyxPQUFPLEdBQUc7WUFDZCxJQUFJLDJDQUFNLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSw2QkFBNkIsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO2dCQUN4RSxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO2dCQUM1QixpREFBYyxHQUFHLElBQUkscURBQVcsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLFlBQVksQ0FBQyxDQUFDO1lBQ2pFLENBQUMsQ0FBQztTQUNGLENBQUM7UUFFRixJQUFJLENBQUMsVUFBVSxHQUFHO1FBQ2pCLDZEQUE2RDtRQUM3RCw0REFBNEQ7UUFDNUQsdURBQXVEO1FBQ3ZELHVEQUF1RDtTQUN2RDtRQUVELElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNWLEtBQUssSUFBSSxPQUFPLElBQUksZ0RBQWEsRUFBRTtZQUNsQyxDQUFDLEVBQUUsQ0FBQztZQUNKLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksK0NBQVEsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDaEg7UUFDRCxtRUFBbUU7UUFDbkUsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFFRCxNQUFNLENBQUMsTUFBVSxFQUFFLFdBQW1CO1FBRXJDLCtCQUErQjtRQUMvQixJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFFdkMsc0RBQXNEO1FBQ3RELElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQzdCLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ3BDLENBQUMsQ0FBQyxDQUFDO1FBRUgseURBQXlEO1FBQ3pELElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQ2xDLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ3RDLENBQUMsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVELFlBQVk7UUFDWCxnQ0FBZ0M7UUFDaEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsNkNBQVUsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxtREFBZ0IsQ0FBQyxnREFBK0M7UUFDMUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsOENBQVcsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLG1EQUFnQixDQUFDO1FBQ3ZELElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxtREFBZ0IsQ0FBQztRQUN0QyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsbURBQWdCLENBQUM7SUFDdEMsQ0FBQztDQUNEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNoRXNDO0FBRUY7QUFDRjtBQUNTO0FBRUc7QUFFYjtBQUUzQixNQUFNLFFBQVMsU0FBUSwrQ0FBUTtJQUVsQyxZQUFZLElBQWtCLEVBQUUsU0FBdUI7UUFDbkQsS0FBSyxFQUFFLENBQUM7UUFFUixnR0FBZ0c7UUFDaEcsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLDZDQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFckMsd0NBQXdDO1FBQ3hDLElBQUksQ0FBQyxPQUFPLEdBQUc7WUFDWCxJQUFJLDJDQUFNLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRSxrREFBa0QsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO2dCQUMvRixPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUN6QixJQUFHLDZDQUFVLElBQUUsU0FBUztvQkFBQyxPQUFPLHlDQUF3QztnQkFDeEUsaURBQWMsR0FBRyxTQUFTLENBQUM7WUFDL0IsQ0FBQyxDQUFDO1lBQ0YsSUFBSSwyQ0FBTSxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsd0NBQXdDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtnQkFDbkYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDdkIsaURBQWMsR0FBRyxJQUFJLHFEQUFXLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxXQUFXLENBQUMsQ0FBQztZQUNuRSxDQUFDLENBQUM7U0FDTCxDQUFDO1FBRUYsbUVBQW1FO1FBQ25FLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUN4QixDQUFDO0lBRUQsTUFBTSxDQUFDLE1BQVUsRUFBRSxXQUFtQjtRQUVsQyx5REFBeUQ7UUFDekQsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBRXZDLHVFQUEyQixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFDLFdBQVcsR0FBQyxDQUFDLENBQUMsR0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBQyxXQUFXLEdBQUMsQ0FBQyxDQUFDLEdBQUMsV0FBVyxFQUFFLEdBQUcsR0FBQyxXQUFXLEVBQUUsRUFBRSxHQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRTdLLHNEQUFzRDtRQUN0RCxLQUFLLE1BQU0sSUFBSSxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDN0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDLENBQUM7U0FDcEM7SUFFTCxDQUFDO0lBRUQsWUFBWTtRQUNSLGdDQUFnQztRQUNoQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyw2Q0FBVSxHQUFDLENBQUMsR0FBQyxHQUFHLEdBQUMsQ0FBQyxHQUFDLG1EQUFnQixDQUFDLGdEQUErQztRQUNsRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyw4Q0FBVyxHQUFDLENBQUMsR0FBQyxFQUFFLEdBQUMsbURBQWdCLENBQUM7UUFDakQsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFDLG1EQUFnQixDQUFDO1FBQ3BDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBQyxtREFBZ0IsQ0FBQztRQUVuQyx1Q0FBdUM7UUFDdkMsS0FBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3ZDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLDZDQUFVLEdBQUMsQ0FBQyxHQUFDLEdBQUcsR0FBQyxDQUFDLEdBQUMsbURBQWdCLENBQUM7WUFDeEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsOENBQVcsR0FBQyxDQUFDLEdBQUMsRUFBRSxHQUFDLENBQUMsR0FBQyxtREFBZ0IsQ0FBQztZQUN4RCxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUMsbURBQWdCLENBQUM7WUFDekMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFDLG1EQUFnQixDQUFDO1lBQ3hDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLDhDQUFXLEVBQUUsOENBQVcsQ0FBQyxDQUFDO1NBQzdEO0lBRUwsQ0FBQztDQUVKOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ25Fc0M7QUFFRjtBQUNGO0FBRUc7QUFDa0I7QUFDVjtBQUNaO0FBQ007QUFFakMsTUFBTSxXQUFZLFNBQVEsK0NBQVE7SUFFckMsWUFBWSxJQUFrQixFQUFFLFNBQXVCLEVBQUUsWUFBb0I7UUFDekUsS0FBSyxFQUFFLENBQUM7UUFDUixnR0FBZ0c7UUFDaEcsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLDZDQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDckMsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IsMkNBQTJDO1FBQzNDLElBQUksQ0FBQyxPQUFPLEdBQUc7WUFDWCxJQUFJLDJDQUFNLENBQUMsSUFBSSxFQUFFLGdCQUFnQixFQUFFLHNEQUFzRCxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Z0JBQ3hHLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztnQkFDOUIsaURBQWMsR0FBRyxJQUFJLGlFQUFpQixDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFDMUUsQ0FBQyxDQUFDO1lBQ0YsSUFBSSwyQ0FBTSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsdUJBQXVCLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtnQkFDbkUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztnQkFDNUIsaURBQWMsR0FBRyxJQUFJLHVEQUFZLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxZQUFZLENBQUMsQ0FBQztZQUNyRSxDQUFDLENBQUM7WUFDRixtR0FBbUc7WUFDbkcsaUNBQWlDO1lBQ2pDLCtEQUErRDtZQUMvRCxNQUFNO1lBQ04sSUFBSSwyQ0FBTSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsZ0JBQWdCLEdBQUMsWUFBWSxHQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO2dCQUN6RSxJQUFHLFlBQVksS0FBRyxXQUFXO29CQUFDLGlEQUFjLEdBQUcsSUFBSSwrQ0FBUSxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQzs7b0JBQ3hFLGlEQUFjLEdBQUcsSUFBSSxpREFBUyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUM7WUFDeEQsQ0FBQyxDQUFDO1NBQ0wsQ0FBQztRQUNGLG1FQUFtRTtRQUNuRSxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDeEIsQ0FBQztJQUVELE1BQU0sQ0FBQyxNQUFVLEVBQUUsV0FBbUI7UUFFbEMseURBQXlEO1FBQ3pELElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxXQUFXLENBQUMsQ0FBQztRQUV2QyxzREFBc0Q7UUFDdEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDMUIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBQyxtREFBZ0IsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUMsbURBQWdCLENBQUM7SUFDdEgsQ0FBQztJQUVELFlBQVk7UUFDUixnQ0FBZ0M7UUFDaEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsNkNBQVUsR0FBQyxDQUFDLEdBQUMsR0FBRyxHQUFDLENBQUMsR0FBQyxtREFBZ0IsQ0FBQyxnREFBK0M7UUFDbEcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsOENBQVcsR0FBQyxDQUFDLEdBQUMsRUFBRSxHQUFDLG1EQUFnQixDQUFDO1FBQ2pELElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBQyxtREFBZ0IsQ0FBQztRQUNwQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUMsbURBQWdCLENBQUM7UUFFbkMsdUNBQXVDO1FBQ3ZDLEtBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN2QyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyw2Q0FBVSxHQUFDLENBQUMsR0FBQyxHQUFHLEdBQUMsQ0FBQyxHQUFDLG1EQUFnQixDQUFDO1lBQ3hELElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLDhDQUFXLEdBQUMsQ0FBQyxHQUFDLEVBQUUsR0FBQyxDQUFDLEdBQUMsbURBQWdCLENBQUM7WUFDeEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFDLG1EQUFnQixDQUFDO1lBQ3pDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBQyxtREFBZ0IsQ0FBQztZQUN4QyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyw4Q0FBVyxFQUFFLDhDQUFXLENBQUMsQ0FBQztTQUM3RDtJQUNMLENBQUM7Q0FFSjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdkVzQztBQUVGO0FBQ0Y7QUFDUztBQUVOO0FBQ0o7QUFFM0IsTUFBTSxTQUFVLFNBQVEsK0NBQVE7SUFFbkMsWUFBWSxJQUFrQixFQUFFLFNBQXVCO1FBQ25ELEtBQUssRUFBRSxDQUFDO1FBRVIsZ0dBQWdHO1FBQ2hHLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSw2Q0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRXJDLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBRTNCLHlDQUF5QztRQUN6QyxJQUFJLENBQUMsT0FBTyxHQUFHO1lBQ1gsSUFBSSwyQ0FBTSxDQUFDLElBQUksRUFBRSxhQUFhLEVBQUUsc0JBQXNCLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtnQkFDckUsaURBQWMsR0FBRyxTQUFTLENBQUM7WUFDL0IsQ0FBQyxDQUFDO1lBQ0YsSUFBSSwyQ0FBTSxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsd0NBQXdDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtnQkFDbkYsaURBQWMsR0FBRyxJQUFJLHFEQUFXLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxZQUFZLENBQUMsQ0FBQztZQUNwRSxDQUFDLENBQUM7WUFDRixJQUFJLDJDQUFNLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRSxzQkFBc0IsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO2dCQUNwRSxpREFBYyxHQUFHLElBQUksK0NBQVEsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDbkQsQ0FBQyxDQUFDO1NBQ0wsQ0FBQztRQUVGLG1FQUFtRTtRQUNuRSxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDeEIsQ0FBQztJQUdELE1BQU0sQ0FBQyxNQUFVLEVBQUUsV0FBbUI7UUFFbEMseURBQXlEO1FBQ3pELElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxXQUFXLENBQUMsQ0FBQztRQUV2QyxzREFBc0Q7UUFDdEQsS0FBSyxNQUFNLElBQUksSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQzdCLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1NBQ3BDO1FBRUQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUMsbURBQWdCLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFDLG1EQUFnQixDQUFDO0lBRXJILENBQUM7SUFFRCxZQUFZO1FBQ1IsZ0NBQWdDO1FBQ2hDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLDZDQUFVLEdBQUMsQ0FBQyxHQUFDLEdBQUcsR0FBQyxDQUFDLEdBQUMsbURBQWdCLENBQUMsZ0RBQStDO1FBQ2xHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLDhDQUFXLEdBQUMsQ0FBQyxHQUFDLEVBQUUsR0FBQyxtREFBZ0IsQ0FBQztRQUNqRCxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUMsbURBQWdCLENBQUM7UUFDcEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFDLG1EQUFnQixDQUFDO1FBRW5DLHVDQUF1QztRQUN2QyxLQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDdkMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsNkNBQVUsR0FBQyxDQUFDLEdBQUMsR0FBRyxHQUFDLENBQUMsR0FBQyxtREFBZ0IsQ0FBQztZQUN4RCxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyw4Q0FBVyxHQUFDLENBQUMsR0FBQyxFQUFFLEdBQUMsQ0FBQyxHQUFDLG1EQUFnQixDQUFDO1lBQ3hELElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBQyxtREFBZ0IsQ0FBQztZQUN6QyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUMsbURBQWdCLENBQUM7WUFDeEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsOENBQVcsRUFBRSw4Q0FBVyxDQUFDLENBQUM7U0FDN0Q7SUFFTCxDQUFDO0NBRUo7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDckVzQztBQUVGO0FBQ0g7QUFDQztBQUVTO0FBRXJDLE1BQU0saUJBQWtCLFNBQVEsK0NBQVE7SUFFOUMsWUFBWSxJQUFrQixFQUFFLFNBQXVCLEVBQUUsWUFBb0I7UUFDNUUsS0FBSyxFQUFFLENBQUM7UUFDUixnR0FBZ0c7UUFDaEcsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLDZDQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFHckMsSUFBRyw4Q0FBVyxLQUFLLFNBQVM7WUFDM0IsOENBQVcsR0FBRyxDQUFDLENBQUM7UUFFakIsSUFBRyxpREFBYyxLQUFLLFNBQVM7WUFDOUIsaURBQWMsR0FBRyxJQUFJLENBQUM7UUFFdkIsSUFBRywwREFBdUIsS0FBSyxTQUFTO1lBQ3ZDLDBEQUF1QixHQUFHLENBQUMsQ0FBQztRQUU3QixJQUFJLGVBQWUsQ0FBQztRQUVwQixJQUFHLDhDQUFXLEtBQUcsQ0FBQyxFQUFFO1lBQ25CLGVBQWUsR0FBRyxnQkFBZ0IsQ0FBQztTQUNuQzthQUNJLElBQUcsOENBQVcsS0FBRyxDQUFDLEVBQUU7WUFDeEIsZUFBZSxHQUFHLGdCQUFnQixDQUFDO1NBQ25DO2FBQ0k7WUFDSixlQUFlLEdBQUcsYUFBYSxDQUFDO1NBQ2hDO1FBRUQsSUFBSSxnQkFBZ0IsQ0FBQztRQUVyQixJQUFHLDBEQUF1QixLQUFHLENBQUMsRUFBRTtZQUMvQixnQkFBZ0IsR0FBRyxRQUFRLENBQUM7U0FDNUI7YUFDSSxJQUFHLDBEQUF1QixLQUFHLENBQUMsRUFBRTtZQUNwQyxnQkFBZ0IsR0FBRyxRQUFRLENBQUM7U0FDNUI7YUFDSTtZQUNKLGdCQUFnQixHQUFHLFNBQVMsQ0FBQztTQUM3QjtRQUdELDJDQUEyQztRQUMzQyxJQUFJLENBQUMsT0FBTyxHQUFHO1lBQ2QsSUFBSSwyQ0FBTSxDQUFDLElBQUksRUFBRSxRQUFRLGVBQWUsRUFBRSxFQUFFLG1DQUFtQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Z0JBQ2pHLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBQzFCLElBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUsscUJBQXFCLEVBQUM7b0JBQ2hELElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLHFCQUFxQixDQUFDO29CQUM1Qyw4Q0FBVyxHQUFHLENBQUMsQ0FBQztvQkFDaEIsaURBQWMsR0FBRyxJQUFJLENBQUM7aUJBQ3RCO3FCQUNJLElBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUsscUJBQXFCLEVBQUU7b0JBQ3RELElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLGtCQUFrQixDQUFDO29CQUN6QyxpREFBYyxHQUFHLEtBQUssQ0FBQztpQkFDdkI7cUJBQ0k7b0JBQ0osSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcscUJBQXFCLENBQUM7b0JBQzVDLDhDQUFXLEdBQUcsQ0FBQyxDQUFDO29CQUNoQixpREFBYyxHQUFHLElBQUksQ0FBQztpQkFDdEI7WUFDRixDQUFDLENBQUM7WUFDRixJQUFJLDJDQUFNLENBQUMsSUFBSSxFQUFFLGNBQWMsZ0JBQWdCLEVBQUUsRUFBRSxnQ0FBZ0MsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO2dCQUNyRyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUN6QixJQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLG1CQUFtQixFQUFDO29CQUM5QyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxtQkFBbUIsQ0FBQztvQkFDMUMsMERBQXVCLEdBQUcsQ0FBQyxDQUFDO2lCQUM1QjtxQkFDSSxJQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLG1CQUFtQixFQUFFO29CQUNwRCxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxvQkFBb0IsQ0FBQztvQkFDM0MsMERBQXVCLEdBQUcsR0FBRyxDQUFDO2lCQUM5QjtxQkFDSTtvQkFDSixJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxtQkFBbUIsQ0FBQztvQkFDMUMsMERBQXVCLEdBQUcsQ0FBQyxDQUFDO2lCQUM1QjtZQUNGLENBQUMsQ0FBQztZQUNGLElBQUksMkNBQU0sQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLDBCQUEwQixFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Z0JBQ3JFLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBQ3pCLGlEQUFjLEdBQUcsSUFBSSxxREFBVyxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFDakUsQ0FBQyxDQUFDO1NBQ0YsQ0FBQztRQUNGLG1FQUFtRTtRQUNuRSxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDckIsQ0FBQztJQUVELE1BQU0sQ0FBQyxNQUFVLEVBQUUsV0FBbUI7UUFFckMsK0JBQStCO1FBQy9CLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxXQUFXLENBQUMsQ0FBQztRQUV2QyxzREFBc0Q7UUFDdEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDN0IsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDcEMsQ0FBQyxDQUFDLENBQUM7SUFDSixDQUFDO0lBRUQsWUFBWTtRQUNYLGdDQUFnQztRQUNoQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyw2Q0FBVSxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLG1EQUFnQixDQUFDLGdEQUErQztRQUMxRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyw4Q0FBVyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsbURBQWdCLENBQUM7UUFDdkQsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLG1EQUFnQixDQUFDO1FBQ3RDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxtREFBZ0IsQ0FBQztRQUVyQyx1Q0FBdUM7UUFDdkMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzdDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLDZDQUFVLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsbURBQWdCLENBQUM7WUFDaEUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsOENBQVcsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxtREFBZ0IsQ0FBQztZQUNoRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsbURBQWdCLENBQUM7WUFDM0MsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLG1EQUFnQixDQUFDO1lBQzFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLDhDQUFXLEVBQUUsOENBQVcsQ0FBQyxDQUFDO1NBQzFEO0lBQ0YsQ0FBQztDQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0SG9DO0FBR3FDO0FBRWhDO0FBQ0c7QUFJRTtBQUV4QyxNQUFNLEtBQUs7SUFtQmpCLFlBQ0MsS0FBYSxFQUNiLE1BQWMsRUFDZCxLQUE0QixFQUM1QixZQUFnRDtRQVhqRCxhQUFRLEdBQW1DLEVBQUUsQ0FBQztRQWE3QyxxRUFBcUU7UUFDckUsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7UUFDeEIsSUFBSSxDQUFDLFlBQVksR0FBRyxZQUFZLENBQUM7UUFFakMsSUFBSSxDQUFDLHFCQUFxQixHQUFHLElBQUksb0ZBQXFCLEVBQUUsQ0FBQztRQUN6RCxJQUFJLENBQUMscUJBQXFCLENBQUMsbUJBQW1CLENBQUMsR0FBRyxDQUNqRCxDQUFDLElBQUksR0FBRyxpRUFBOEIsQ0FBQyxHQUFHLENBQUMsQ0FDM0MsQ0FBQztRQUVGLGdQQUFnUDtRQUNoUCxJQUFJLENBQUMsU0FBUyxHQUFHLHNEQUFtQixDQUNuQyxJQUFJLENBQUMsS0FBSyxHQUFHLGtEQUFlLEVBQzVCLElBQUksQ0FBQyxNQUFNLEdBQUcsbURBQWdCLENBQzlCLENBQUM7UUFDRixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDbEIsQ0FBQztJQUVELElBQUksQ0FBQyxJQUFVO1FBQ2QsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLFNBQVM7WUFDNUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckUsQ0FBQztJQUVELE1BQU0sQ0FBQyxNQUFVLEVBQUUsV0FBbUI7UUFDckMsdUNBQXVDO1FBQ3ZDLE1BQU0sQ0FBQyxLQUFLLENBQ1gsSUFBSSxDQUFDLFNBQVMsRUFDZCxDQUFDLEVBQ0QsQ0FBQyxFQUNELENBQUMsNkNBQVUsR0FBRyxXQUFXLENBQUMsR0FBRyxXQUFXLEVBQ3hDLENBQUMsOENBQVcsR0FBRyxXQUFXLENBQUMsR0FBRyxXQUFXLEVBQ3pDLHdEQUFxQixHQUFHLGtEQUFlLEVBQ3ZDLHdEQUFxQixHQUFHLGtEQUFlLEVBQ3ZDLDZDQUFVLEdBQUcsV0FBVyxFQUN4Qiw4Q0FBVyxHQUFHLFdBQVcsQ0FDekIsQ0FBQztRQUVGLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBRXhDLG9CQUFvQjtRQUNwQiwwQkFBMEI7UUFDMUIsbUJBQW1CO1FBQ25CLHNFQUFzRTtRQUV0RSxnQkFBZ0I7UUFDaEIsbUJBQW1CO1FBQ25CLDhCQUE4QjtRQUM5QixNQUFNO1FBQ04sZUFBZTtRQUNmLGdCQUFnQjtRQUNoQixLQUFLO0lBQ04sQ0FBQztJQUVELGFBQWEsQ0FBQyxRQUFrQjtRQUMvQixJQUFJLENBQUMscUJBQXFCLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNuRCxDQUFDO0lBRUQsVUFBVSxDQUFDLFNBQWlCLEVBQUUsSUFBYztRQUMzQywrQ0FBK0M7UUFDL0MsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsR0FBRyxJQUFJLENBQUM7UUFFbEMsb0VBQW9FO1FBQ3BFLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDdkIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUMxQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUk7UUFDbEIsUUFBUTtRQUNSLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxrREFBZSxFQUMxQyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsbURBQWdCLEVBQ3JELGtEQUFlLEVBQ2YsbURBQWdCLENBQ2hCLENBQUM7UUFFRixJQUNDLFNBQVMsR0FBRyxDQUFDLElBQUksQ0FBQztZQUNsQixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxLQUFLLFFBQVE7WUFDbEQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLEtBQUssc0RBQVksRUFDOUM7WUFDRCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUk7WUFDbEIsTUFBTTtZQUNOLENBQUMsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLGtEQUFlLEVBQ2hELElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxtREFBZ0IsRUFDckQsa0RBQWUsRUFDZixtREFBZ0IsQ0FDaEIsQ0FBQztTQUNGO1FBRUQsSUFDQyxTQUFTLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU07WUFDeEMsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsS0FBSyxRQUFRO1lBQ2xELElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxLQUFLLHNEQUFZLEVBQzlDO1lBQ0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJO1lBQ2xCLE9BQU87WUFDUCxDQUFDLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxrREFBZSxFQUNoRCxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsbURBQWdCLEVBQ3JELGtEQUFlLEVBQ2YsbURBQWdCLENBQ2hCLENBQUM7U0FDRjtRQUVELElBQ0MsU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQztZQUMzQixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxRQUFRO1lBQzNELElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxzREFBWSxFQUN2RDtZQUNELElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSTtZQUNsQixLQUFLO1lBQ0wsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLGtEQUFlLEVBQzFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLG1EQUFnQixFQUMzRCxrREFBZSxFQUNmLG1EQUFnQixDQUNoQixDQUFDO1NBQ0Y7UUFDRCxJQUNDLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU07WUFDakQsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssUUFBUTtZQUMzRCxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssc0RBQVksRUFDdkQ7WUFDRCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUk7WUFDbEIsUUFBUTtZQUNSLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxrREFBZSxFQUMxQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxtREFBZ0IsRUFDM0Qsa0RBQWUsRUFDZixtREFBZ0IsQ0FDaEIsQ0FBQztTQUNGO1FBQ0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUV6QiwrQkFBK0I7UUFDL0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN6QixJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDN0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFRCxhQUFhLENBQUMsTUFBVSxFQUFFLFdBQW1CO1FBQzVDLDhEQUE4RDtRQUM5RCxNQUFNLGNBQWMsR0FBK0MsRUFBRSxDQUFDO1FBQ3RFLElBQUk7WUFDSCxNQUFNLGtCQUFrQixHQUN2QixJQUFJLENBQUMscUJBQXFCLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDckQsSUFBSSxDQUFDLGtCQUFrQjtnQkFBRSxPQUFPO1lBRWhDLE1BQU0sS0FBSyxHQUFHLGtCQUFrQixDQUFDLEtBQUssQ0FBQztZQUN2QyxJQUFJLENBQUMsS0FBSztnQkFBRSxPQUFPO1lBRW5CLDBDQUEwQztZQUMxQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBcUMsRUFBRSxFQUFFO2dCQUNqRSxjQUFjLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDL0IsQ0FBQyxDQUFDLENBQUM7U0FDSDtRQUFDLE9BQU8sQ0FBQyxFQUFFLEdBQUU7UUFFZCxxQ0FBcUM7UUFDckMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUNwQyxDQUFDLE1BQThCLEVBQUUsRUFBRTtZQUNsQyxNQUFNLGVBQWUsR0FBRyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEQsSUFBSSxlQUFlLEtBQUssU0FBUyxFQUFFO2dCQUNsQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLGVBQWUsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQzthQUNoQztZQUVELE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ3ZDLENBQUMsQ0FDRCxDQUFDO1FBRUYsMkJBQTJCO1FBQzNCLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxTQUFTLEVBQUU7WUFDOUIsSUFBSSxDQUFDLE1BQU0sQ0FBQywyQkFBMkIsRUFBRSxDQUFDO1lBQzFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxXQUFXLENBQUMsQ0FBQztTQUN4QztJQUNGLENBQUM7SUFFRCxTQUFTOztRQUNSLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDMUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUMvQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNyQyw2Q0FBNkM7WUFDN0MsZ0RBQWdEO1lBQ2hELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNwQyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUVwRCxJQUFJLE9BQU8sT0FBTyxLQUFLLFFBQVEsRUFBRTtvQkFDaEMsSUFBSSxJQUFJLENBQUMsWUFBWSxLQUFLLFNBQVMsRUFBRTt3QkFDcEMsT0FBTyxDQUFDLEtBQUssQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO3FCQUNoRDtvQkFFRCxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLEtBQUssU0FBUyxFQUFFO3dCQUM3QyxPQUFPLENBQUMsS0FBSyxDQUNaLGNBQWMsR0FBRyxPQUFPLEdBQUcsZUFBZSxDQUMxQyxDQUFDO3FCQUNGO29CQUVELE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQ3ZCLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQyxZQUFZLENBQzFDLENBQUM7b0JBQ0YsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLEtBQUssT0FBTyxFQUFFO3dCQUNuQywwQkFBMEI7d0JBQzFCLElBQUksR0FBRyxHQUNOLG9FQUF3QixDQUN2QixJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FDaEMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO3dCQUN6QyxHQUFHLENBQUMsTUFBTSxDQUNULElBQUksQ0FBQyxTQUFTLEVBQ2QsQ0FBQyxHQUFHLGtEQUFlLEVBQ25CLENBQUMsR0FBRyxtREFBZ0IsRUFDcEIsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQ2YsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQ2hCLENBQUM7cUJBQ0Y7eUJBQU07d0JBQ04sNkNBQTZDO3FCQUM3QztvQkFDRCxTQUFTO2lCQUNUO2dCQUVELElBQUksT0FBTyxLQUFLLHNEQUFZLEVBQUU7b0JBQzdCLDREQUE0RDtvQkFDNUQsTUFBTSxJQUFJLEdBQUcsbURBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFFakMsSUFBSSxJQUFJLEtBQUssU0FBUzt3QkFBRSxTQUFTO29CQUVqQyxJQUFJLElBQUksQ0FBQyxTQUFTLElBQUksWUFBWSxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7d0JBQ25ELHlCQUF5Qjt3QkFDekIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQ3RCLElBQUksQ0FBQyxnQkFBZ0IsQ0FDcEIsQ0FBQyxFQUNELENBQUMsRUFDRCxPQUFPLEVBQ1AseURBQVUsQ0FBQyxPQUFPLENBQUMsMENBQUUsYUFBYSxDQUNsQyxFQUNELElBQUksQ0FBQyxTQUFTLEVBQ2QsQ0FBQyxHQUFHLGtEQUFlLEVBQ25CLENBQUMsR0FBRyxtREFBZ0IsRUFDcEIsa0RBQWUsRUFDZixtREFBZ0IsQ0FDaEIsQ0FBQztxQkFDRjt5QkFBTTt3QkFDTiw2QkFBNkI7d0JBQzdCLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUNsQixJQUFJLENBQUMsU0FBUyxFQUNkLENBQUMsR0FBRyxrREFBZSxFQUNuQixDQUFDLEdBQUcsbURBQWdCLEVBQ3BCLGtEQUFlLEVBQ2YsbURBQWdCLENBQ2hCLENBQUM7cUJBQ0Y7aUJBQ0Q7YUFDRDtTQUNEO0lBQ0YsQ0FBQztJQUVELFFBQVEsQ0FBQyxTQUFpQjtRQUN6QixNQUFNLENBQUMsR0FBRyxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUNqQyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFN0MsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxLQUFLLHNEQUFZLEVBQUU7WUFDaEQsNERBQTREO1lBRTVELE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUM7WUFFM0MsSUFBSSxPQUFPLE9BQU8sS0FBSyxRQUFRLEVBQUU7Z0JBQ2hDLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsS0FBSyxTQUFTLEVBQUU7b0JBQzdDLE9BQU8sQ0FBQyxLQUFLLENBQUMsY0FBYyxHQUFHLE9BQU8sR0FBRyxlQUFlLENBQUMsQ0FBQztpQkFDMUQ7Z0JBRUQsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FDdkIsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFlBQVksQ0FDMUMsQ0FBQztnQkFDRixJQUFJLFNBQVMsS0FBSyxPQUFPLEVBQUU7b0JBQzFCLDBCQUEwQjtvQkFDMUIseURBQXlEO2lCQUN6RDtxQkFBTTtvQkFDTiw2Q0FBNkM7aUJBQzdDO2dCQUNELE9BQU87YUFDUDtZQUVELE1BQU0sSUFBSSxHQUFHLG1EQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFakMsNkJBQTZCO1lBQzdCLElBQUksSUFBSSxLQUFLLFNBQVMsRUFBRTtnQkFDdkIsT0FBTzthQUNQO1lBRUQsSUFBSSxJQUFJLENBQUMsU0FBUyxJQUFJLFlBQVksSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO2dCQUNuRCxJQUFJLFdBQVcsR0FBRyxLQUFLLENBQUM7Z0JBQ3hCLElBQUksWUFBWSxHQUFHLEtBQUssQ0FBQztnQkFDekIsSUFBSSxjQUFjLEdBQUcsS0FBSyxDQUFDO2dCQUMzQixJQUFJLGFBQWEsR0FBRyxLQUFLLENBQUM7Z0JBQzFCLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtvQkFDdkIsMENBQTBDO29CQUMxQyxXQUFXO3dCQUNWLENBQUMsS0FBSyxDQUFDOzRCQUNQLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztnQ0FDekMsc0RBQVk7Z0NBQ1osT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO29DQUMvQyxRQUFRLENBQUMsQ0FBQztvQkFDYixZQUFZO3dCQUNYLENBQUMsS0FBSyxDQUFDOzRCQUNQLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dDQUN2QyxzREFBWTtnQ0FDWixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQ0FDN0MsUUFBUSxDQUFDLENBQUM7b0JBQ2IsY0FBYzt3QkFDYixDQUFDLEtBQUssSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDOzRCQUNyQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7Z0NBQ3pDLHNEQUFZO2dDQUNaLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztvQ0FDL0MsUUFBUSxDQUFDLENBQUM7b0JBQ2IsYUFBYTt3QkFDWixDQUFDLEtBQUssSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDOzRCQUNwQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQ0FDdkMsc0RBQVk7Z0NBQ1osT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7b0NBQzdDLFFBQVEsQ0FBQyxDQUFDO29CQUViLDhHQUE4RztpQkFDOUc7cUJBQU07b0JBQ04sa0RBQWtEO29CQUNsRCxXQUFXO3dCQUNWLENBQUMsS0FBSyxDQUFDOzRCQUNQLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxPQUFPLENBQUM7b0JBQ3ZELFlBQVk7d0JBQ1gsQ0FBQyxLQUFLLENBQUM7NEJBQ1AsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssT0FBTyxDQUFDO29CQUNyRCxjQUFjO3dCQUNiLENBQUMsS0FBSyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUM7NEJBQ3JCLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxPQUFPLENBQUM7b0JBQ3ZELGFBQWE7d0JBQ1osQ0FBQyxLQUFLLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQzs0QkFDcEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssT0FBTyxDQUFDO29CQUNyRCxrRkFBa0Y7aUJBQ2xGO2dCQUNELElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxLQUFLLHNEQUFZLENBQUM7Z0JBRWhELDJDQUEyQztnQkFDM0MsTUFBTSxZQUFZLEdBQ2pCLENBQUMsR0FBRyxDQUFDLFdBQVc7b0JBQ2hCLENBQUMsR0FBRyxDQUFDLGFBQWE7b0JBQ2xCLENBQUMsR0FBRyxDQUFDLGNBQWM7b0JBQ25CLENBQUMsWUFBWSxDQUFDO2dCQUVmLHlCQUF5QjtnQkFDekIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQ3RCLFlBQVksRUFDWixJQUFJLENBQUMsU0FBUyxFQUNkLENBQUMsR0FBRyxrREFBZSxFQUNuQixDQUFDLEdBQUcsbURBQWdCLEVBQ3BCLGtEQUFlLEVBQ2YsbURBQWdCLENBQ2hCLENBQUM7YUFDRjtpQkFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtnQkFDM0IsNkJBQTZCO2dCQUM3QixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FDbEIsSUFBSSxDQUFDLFNBQVMsRUFDZCxDQUFDLEdBQUcsa0RBQWUsRUFDbkIsQ0FBQyxHQUFHLG1EQUFnQixFQUNwQixrREFBZSxFQUNmLG1EQUFnQixDQUNoQixDQUFDO2FBQ0Y7U0FDRDtJQUNGLENBQUM7SUFFRCxnQkFBZ0IsQ0FDZixDQUFTLEVBQ1QsQ0FBUyxFQUNULE9BQWlCLEVBQ2pCLGFBQXVCO1FBRXZCLElBQUksV0FBVyxHQUFHLEtBQUssQ0FBQztRQUN4QixJQUFJLFlBQVksR0FBRyxLQUFLLENBQUM7UUFDekIsSUFBSSxjQUFjLEdBQUcsS0FBSyxDQUFDO1FBQzNCLElBQUksYUFBYSxHQUFHLEtBQUssQ0FBQztRQUMxQixJQUFJLGFBQWEsRUFBRTtZQUNsQiwwQ0FBMEM7WUFDMUMsV0FBVztnQkFDVixDQUFDLEtBQUssQ0FBQztvQkFDUCxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxzREFBWSxJQUFHLCtCQUErQjt3QkFDNUYsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDOzRCQUMvQyxRQUFRLENBQUMsQ0FBQztZQUNiLFlBQVk7Z0JBQ1gsQ0FBQyxLQUFLLENBQUM7b0JBQ1AsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxzREFBWTt3QkFDeEQsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7NEJBQzdDLFFBQVEsQ0FBQyxDQUFDO1lBQ2IsY0FBYztnQkFDYixDQUFDLEtBQUssSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDO29CQUNyQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxzREFBWTt3QkFDMUQsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDOzRCQUMvQyxRQUFRLENBQUMsQ0FBQztZQUNiLGFBQWE7Z0JBQ1osQ0FBQyxLQUFLLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQztvQkFDcEIsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxzREFBWTt3QkFDeEQsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7NEJBQzdDLFFBQVEsQ0FBQyxDQUFDO1NBQ2I7YUFBTTtZQUNOLGtEQUFrRDtZQUNsRCxXQUFXO2dCQUNWLENBQUMsS0FBSyxDQUFDO29CQUNQLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxPQUFPLENBQUM7WUFDdkQsWUFBWTtnQkFDWCxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLE9BQU8sQ0FBQztZQUNoRSxjQUFjO2dCQUNiLENBQUMsS0FBSyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUM7b0JBQ3JCLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxPQUFPLENBQUM7WUFDdkQsYUFBYTtnQkFDWixDQUFDLEtBQUssSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDO29CQUNwQixJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxPQUFPLENBQUM7U0FDckQ7UUFFRCwyQ0FBMkM7UUFDM0MsT0FBTyxDQUNOLENBQUMsR0FBRyxDQUFDLFdBQVc7WUFDaEIsQ0FBQyxHQUFHLENBQUMsYUFBYTtZQUNsQixDQUFDLEdBQUcsQ0FBQyxjQUFjO1lBQ25CLENBQUMsWUFBWSxDQUNiLENBQUM7SUFDSCxDQUFDO0NBQ0Q7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDM2M4QztBQUVGO0FBa0J0QyxNQUFNLFVBQVUsR0FBdUM7SUFDMUQsQ0FBQyxzREFBWSxDQUFDLEVBQUUsU0FBUztJQUN6QixDQUFDLHVEQUFhLENBQUMsRUFBRTtRQUNiLElBQUksRUFBRSxNQUFNO1FBQ1osT0FBTyxFQUFFLGlGQUFxQztRQUM5QyxTQUFTLEVBQUUsSUFBSTtRQUNmLGFBQWEsRUFBRSxJQUFJO1FBQ25CLEtBQUssRUFBRSxTQUFTO1FBQ2hCLFFBQVEsRUFBRSxDQUFDO1FBQ1gsWUFBWSxFQUFFLEVBQUUsbUhBQWtIO0tBQ3JJO0lBQ0QsQ0FBQyxzREFBWSxDQUFDLEVBQUU7UUFDWixJQUFJLEVBQUUsS0FBSztRQUNYLE9BQU8sRUFBRSxnRkFBb0M7UUFDN0MsU0FBUyxFQUFFLElBQUk7UUFDZixhQUFhLEVBQUUsSUFBSTtRQUNuQixLQUFLLEVBQUUsU0FBUztRQUNoQixRQUFRLEVBQUUsR0FBRztRQUNiLFlBQVksRUFBRSxHQUFHO0tBQ3BCO0lBQ0QsQ0FBQyx1REFBYSxDQUFDLEVBQUU7UUFDYixJQUFJLEVBQUUsTUFBTTtRQUNaLE9BQU8sRUFBRSxpRkFBcUM7UUFDOUMsU0FBUyxFQUFFLElBQUk7UUFDZixhQUFhLEVBQUUsSUFBSTtRQUNuQixLQUFLLEVBQUUsU0FBUztRQUNoQixRQUFRLEVBQUUsQ0FBQztRQUNYLFlBQVksRUFBRSxDQUFDO0tBQ2xCO0lBQ0QsQ0FBQyx5REFBZSxDQUFDLEVBQUU7UUFDZixJQUFJLEVBQUUsV0FBVztRQUNqQixPQUFPLEVBQUUsbUZBQXVDO1FBQ2hELFNBQVMsRUFBRSxJQUFJO1FBQ2YsYUFBYSxFQUFFLElBQUk7UUFDbkIsS0FBSyxFQUFFLFNBQVM7UUFDaEIsUUFBUSxFQUFFLENBQUM7UUFDWCxZQUFZLEVBQUUsRUFBRTtLQUNuQjtJQUNELENBQUMseURBQWUsQ0FBQyxFQUFFO1FBQ2YsSUFBSSxFQUFFLGNBQWM7UUFDcEIsT0FBTyxFQUFFLG1GQUF1QztRQUNoRCxTQUFTLEVBQUUsSUFBSTtRQUNmLGFBQWEsRUFBRSxJQUFJO1FBQ25CLEtBQUssRUFBRSxTQUFTO1FBQ2hCLFFBQVEsRUFBRSxDQUFDO1FBQ1gsWUFBWSxFQUFFLEVBQUU7S0FDbkI7SUFDRCxDQUFDLHlEQUFlLENBQUMsRUFBRTtRQUNmLElBQUksRUFBRSxjQUFjO1FBQ3BCLE9BQU8sRUFBRSxtRkFBdUM7UUFDaEQsU0FBUyxFQUFFLElBQUk7UUFDZixhQUFhLEVBQUUsSUFBSTtRQUNuQixLQUFLLEVBQUUsU0FBUztRQUNoQixRQUFRLEVBQUUsQ0FBQztRQUNYLFlBQVksRUFBRSxFQUFFO0tBQ25CO0lBQ0QsQ0FBQyx5REFBZSxDQUFDLEVBQUU7UUFDZixJQUFJLEVBQUUsY0FBYztRQUNwQixPQUFPLEVBQUUsbUZBQXVDO1FBQ2hELFNBQVMsRUFBRSxJQUFJO1FBQ2YsYUFBYSxFQUFFLElBQUk7UUFDbkIsS0FBSyxFQUFFLFNBQVM7UUFDaEIsUUFBUSxFQUFFLENBQUM7UUFDWCxZQUFZLEVBQUUsRUFBRTtLQUNuQjtJQUNELENBQUMseURBQWUsQ0FBQyxFQUFFO1FBQ2YsSUFBSSxFQUFFLGNBQWM7UUFDcEIsT0FBTyxFQUFFLG1GQUF1QztRQUNoRCxTQUFTLEVBQUUsSUFBSTtRQUNmLGFBQWEsRUFBRSxJQUFJO1FBQ25CLEtBQUssRUFBRSxTQUFTO1FBQ2hCLFFBQVEsRUFBRSxDQUFDO1FBQ1gsWUFBWSxFQUFFLEVBQUU7S0FDbkI7SUFDRCxDQUFDLHlEQUFlLENBQUMsRUFBRTtRQUNmLElBQUksRUFBRSxjQUFjO1FBQ3BCLE9BQU8sRUFBRSxtRkFBdUM7UUFDaEQsU0FBUyxFQUFFLElBQUk7UUFDZixhQUFhLEVBQUUsSUFBSTtRQUNuQixLQUFLLEVBQUUsU0FBUztRQUNoQixRQUFRLEVBQUUsQ0FBQztRQUNYLFlBQVksRUFBRSxFQUFFO0tBQ25CO0lBQ0QsQ0FBQyx5REFBZSxDQUFDLEVBQUU7UUFDZixJQUFJLEVBQUUsY0FBYztRQUNwQixPQUFPLEVBQUUsbUZBQXVDO1FBQ2hELFNBQVMsRUFBRSxJQUFJO1FBQ2YsYUFBYSxFQUFFLElBQUk7UUFDbkIsS0FBSyxFQUFFLFNBQVM7UUFDaEIsUUFBUSxFQUFFLENBQUM7UUFDWCxZQUFZLEVBQUUsRUFBRTtLQUNuQjtJQUNELENBQUMseURBQWUsQ0FBQyxFQUFFO1FBQ2YsSUFBSSxFQUFFLGNBQWM7UUFDcEIsT0FBTyxFQUFFLG1GQUF1QztRQUNoRCxTQUFTLEVBQUUsSUFBSTtRQUNmLGFBQWEsRUFBRSxJQUFJO1FBQ25CLEtBQUssRUFBRSxTQUFTO1FBQ2hCLFFBQVEsRUFBRSxDQUFDO1FBQ1gsWUFBWSxFQUFFLEVBQUU7S0FDbkI7SUFDRCxDQUFDLHlEQUFlLENBQUMsRUFBRTtRQUNmLElBQUksRUFBRSxjQUFjO1FBQ3BCLE9BQU8sRUFBRSxtRkFBdUM7UUFDaEQsU0FBUyxFQUFFLElBQUk7UUFDZixhQUFhLEVBQUUsSUFBSTtRQUNuQixLQUFLLEVBQUUsU0FBUztRQUNoQixRQUFRLEVBQUUsQ0FBQztRQUNYLFlBQVksRUFBRSxFQUFFO0tBQ25CO0lBQ0QsQ0FBQyx5REFBZSxDQUFDLEVBQUU7UUFDZixJQUFJLEVBQUUsY0FBYztRQUNwQixPQUFPLEVBQUUsbUZBQXVDO1FBQ2hELFNBQVMsRUFBRSxJQUFJO1FBQ2YsYUFBYSxFQUFFLElBQUk7UUFDbkIsS0FBSyxFQUFFLFNBQVM7UUFDaEIsUUFBUSxFQUFFLENBQUM7UUFDWCxZQUFZLEVBQUUsRUFBRTtLQUNuQjtJQUNELENBQUMsc0RBQVksQ0FBQyxFQUFFO1FBQ1osSUFBSSxFQUFFLFNBQVM7UUFDZixPQUFPLEVBQUUsZ0ZBQW9DO1FBQzdDLFNBQVMsRUFBRSxJQUFJO1FBQ2YsYUFBYSxFQUFFLEtBQUs7UUFDcEIsS0FBSyxFQUFFLFNBQVM7UUFDaEIsUUFBUSxFQUFFLENBQUM7UUFDWCxZQUFZLEVBQUUsRUFBRTtLQUNuQjtJQUNELENBQUMsMkRBQWlCLENBQUMsRUFBRTtRQUNqQixJQUFJLEVBQUUsY0FBYztRQUNwQixPQUFPLEVBQUUscUZBQXlDO1FBQ2xELFNBQVMsRUFBRSxJQUFJO1FBQ2YsYUFBYSxFQUFFLEtBQUs7UUFDcEIsS0FBSyxFQUFFLFNBQVM7UUFDaEIsUUFBUSxFQUFFLENBQUM7UUFDWCxZQUFZLEVBQUUsRUFBRTtLQUNuQjtJQUNELENBQUMsdURBQWEsQ0FBQyxFQUFFO1FBQ2IsSUFBSSxFQUFFLFVBQVU7UUFDaEIsT0FBTyxFQUFFLGlGQUFxQztRQUM5QyxTQUFTLEVBQUUsSUFBSTtRQUNmLGFBQWEsRUFBRSxLQUFLO1FBQ3BCLEtBQUssRUFBRSxTQUFTO1FBQ2hCLFFBQVEsRUFBRSxDQUFDO1FBQ1gsWUFBWSxFQUFFLEVBQUU7S0FDbkI7SUFDRCxDQUFDLDJEQUFpQixDQUFDLEVBQUU7UUFDakIsSUFBSSxFQUFFLGNBQWM7UUFDcEIsT0FBTyxFQUFFLHFGQUF5QztRQUNsRCxTQUFTLEVBQUUsSUFBSTtRQUNmLGFBQWEsRUFBRSxLQUFLO1FBQ3BCLEtBQUssRUFBRSxTQUFTO1FBQ2hCLFFBQVEsRUFBRSxDQUFDO1FBQ1gsWUFBWSxFQUFFLEVBQUU7S0FDbkI7SUFDRCxDQUFDLHdEQUFjLENBQUMsRUFBRTtRQUNkLElBQUksRUFBRSxXQUFXO1FBQ2pCLE9BQU8sRUFBRSxrRkFBc0M7UUFDL0MsU0FBUyxFQUFFLElBQUk7UUFDZixhQUFhLEVBQUUsS0FBSztRQUNwQixLQUFLLEVBQUUsU0FBUztRQUNoQixRQUFRLEVBQUUsQ0FBQztRQUNYLFlBQVksRUFBRSxFQUFFO0tBQ25CO0lBQ0QsQ0FBQyx3REFBYyxDQUFDLEVBQUU7UUFDZCxJQUFJLEVBQUUsVUFBVTtRQUNoQixPQUFPLEVBQUUsa0ZBQXNDO1FBQy9DLFNBQVMsRUFBRSxLQUFLO1FBQ2hCLGFBQWEsRUFBRSxJQUFJO1FBQ25CLEtBQUssRUFBRSxTQUFTO1FBQ2hCLFFBQVEsRUFBRSxDQUFDO1FBQ1gsWUFBWSxFQUFFLENBQUM7S0FDbEI7SUFDRCxDQUFDLHdEQUFjLENBQUMsRUFBRTtRQUNkLElBQUksRUFBRSxhQUFhO1FBQ25CLE9BQU8sRUFBRSxrRkFBc0M7UUFDL0MsU0FBUyxFQUFFLElBQUk7UUFDZixhQUFhLEVBQUUsSUFBSTtRQUNuQixLQUFLLEVBQUUsU0FBUztRQUNoQixRQUFRLEVBQUUsQ0FBQztRQUNYLFlBQVksRUFBRSxDQUFDO0tBQ2xCO0lBQ0QsQ0FBQyx3REFBYyxDQUFDLEVBQUU7UUFDZCxJQUFJLEVBQUUsYUFBYTtRQUNuQixPQUFPLEVBQUUsa0ZBQXNDO1FBQy9DLFNBQVMsRUFBRSxJQUFJO1FBQ2YsYUFBYSxFQUFFLElBQUk7UUFDbkIsS0FBSyxFQUFFLFNBQVM7UUFDaEIsUUFBUSxFQUFFLENBQUM7UUFDWCxZQUFZLEVBQUUsQ0FBQztLQUNsQjtJQUNELENBQUMsd0RBQWMsQ0FBQyxFQUFFO1FBQ2QsSUFBSSxFQUFFLGFBQWE7UUFDbkIsT0FBTyxFQUFFLGtGQUFzQztRQUMvQyxTQUFTLEVBQUUsSUFBSTtRQUNmLGFBQWEsRUFBRSxJQUFJO1FBQ25CLEtBQUssRUFBRSxTQUFTO1FBQ2hCLFFBQVEsRUFBRSxDQUFDO1FBQ1gsWUFBWSxFQUFFLENBQUM7S0FDbEI7SUFDRCxDQUFDLHdEQUFjLENBQUMsRUFBRTtRQUNkLElBQUksRUFBRSxhQUFhO1FBQ25CLE9BQU8sRUFBRSxrRkFBc0M7UUFDL0MsU0FBUyxFQUFFLElBQUk7UUFDZixhQUFhLEVBQUUsSUFBSTtRQUNuQixLQUFLLEVBQUUsU0FBUztRQUNoQixRQUFRLEVBQUUsQ0FBQztRQUNYLFlBQVksRUFBRSxDQUFDO0tBQ2xCO0lBQ0QsQ0FBQyx3REFBYyxDQUFDLEVBQUU7UUFDZCxJQUFJLEVBQUUsYUFBYTtRQUNuQixPQUFPLEVBQUUsa0ZBQXNDO1FBQy9DLFNBQVMsRUFBRSxJQUFJO1FBQ2YsYUFBYSxFQUFFLElBQUk7UUFDbkIsS0FBSyxFQUFFLFNBQVM7UUFDaEIsUUFBUSxFQUFFLENBQUM7UUFDWCxZQUFZLEVBQUUsQ0FBQztLQUNsQjtJQUNELENBQUMsd0RBQWMsQ0FBQyxFQUFFO1FBQ2QsSUFBSSxFQUFFLGFBQWE7UUFDbkIsT0FBTyxFQUFFLGtGQUFzQztRQUMvQyxTQUFTLEVBQUUsSUFBSTtRQUNmLGFBQWEsRUFBRSxJQUFJO1FBQ25CLEtBQUssRUFBRSxTQUFTO1FBQ2hCLFFBQVEsRUFBRSxDQUFDO1FBQ1gsWUFBWSxFQUFFLENBQUM7S0FDbEI7SUFDRCxDQUFDLHdEQUFjLENBQUMsRUFBRTtRQUNkLElBQUksRUFBRSxhQUFhO1FBQ25CLE9BQU8sRUFBRSxrRkFBc0M7UUFDL0MsU0FBUyxFQUFFLElBQUk7UUFDZixhQUFhLEVBQUUsSUFBSTtRQUNuQixLQUFLLEVBQUUsU0FBUztRQUNoQixRQUFRLEVBQUUsQ0FBQztRQUNYLFlBQVksRUFBRSxDQUFDO0tBQ2xCO0lBQ0QsQ0FBQyx3REFBYyxDQUFDLEVBQUU7UUFDZCxJQUFJLEVBQUUsYUFBYTtRQUNuQixPQUFPLEVBQUUsa0ZBQXNDO1FBQy9DLFNBQVMsRUFBRSxJQUFJO1FBQ2YsYUFBYSxFQUFFLElBQUk7UUFDbkIsS0FBSyxFQUFFLFNBQVM7UUFDaEIsUUFBUSxFQUFFLENBQUM7UUFDWCxZQUFZLEVBQUUsQ0FBQztLQUNsQjtJQUNELENBQUMsd0RBQWMsQ0FBQyxFQUFFO1FBQ2QsSUFBSSxFQUFFLGFBQWE7UUFDbkIsT0FBTyxFQUFFLGtGQUFzQztRQUMvQyxTQUFTLEVBQUUsSUFBSTtRQUNmLGFBQWEsRUFBRSxJQUFJO1FBQ25CLEtBQUssRUFBRSxTQUFTO1FBQ2hCLFFBQVEsRUFBRSxDQUFDO1FBQ1gsWUFBWSxFQUFFLENBQUM7S0FDbEI7Q0FDSixDQUFDO0FBRUYsc0ZBQXNGO0FBQ2xGLCtCQUErQjtBQUMzQixxQkFBcUI7QUFDekIsS0FBSztBQUNMLCtCQUErQjtBQUMzQixxQkFBcUI7QUFDekIsSUFBSTtBQUNSLElBQUk7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDNVI4QjtBQUdnQjtBQUczQyxNQUFNLEtBQUs7SUFNZCxZQUFZLENBQVMsRUFBRSxDQUFTO1FBQzVCLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1gsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUMsSUFBSSxHQUFDLElBQUksQ0FBQztRQUNwQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNYLElBQUksQ0FBQyxLQUFLLEdBQUcsOERBQWtCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcscUVBQXlCLENBQUMsQ0FBQztJQUMxRixDQUFDO0lBRUQsTUFBTSxDQUFDLE1BQVUsRUFBRSxXQUFtQjtRQUNsQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsUUFBUSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMxQyw4QkFBOEI7UUFDOUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQ2IsTUFBTSxFQUNOLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxrREFBZTtZQUNyQix3REFBcUIsR0FBRyxrREFBZSxDQUFDO1lBQzVDLFdBQVcsRUFDWCxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsbURBQWdCO1lBQ3RCLHdEQUFxQixHQUFHLG1EQUFnQixDQUFDO1lBQzdDLFdBQVcsRUFDWCxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsV0FBVyxFQUNwQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsV0FBVyxDQUN4QyxDQUFDO0lBQ04sQ0FBQztJQUVELElBQUk7UUFDQSxJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDcEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLDZDQUFVLEdBQUMsbURBQWdCLEdBQUMsRUFBRSxDQUFDLEdBQUMsa0RBQWUsQ0FBQyxDQUFDO1FBQzNELElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUMsd0RBQXFCLEdBQUcsRUFBRSxHQUFDLGtEQUFlLENBQUM7UUFDMUQsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFDLHdEQUFxQixHQUFHLEVBQUUsR0FBQyxrREFBZSxDQUFDO0lBQ2xFLENBQUM7Q0FFSjtBQUVELFNBQVMsR0FBRyxDQUFDLEVBQVUsRUFBRSxFQUFVO0lBQy9CLE9BQU8sQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDakMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDOUNpRDtBQUNKO0FBQ0o7QUFFbkMsTUFBTSxhQUFhLEdBQTBCO0lBQ2hELENBQUMsZ0VBQW9CLENBQUMsRUFBRSxTQUFTO0lBQ2pDLENBQUMsMkRBQWUsQ0FBQyxFQUFFLHVEQUFZO0lBQy9CLENBQUMseURBQWEsQ0FBQyxFQUFFLG1EQUFVO0NBQzlCLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDUDRDO0FBR0c7QUFFMUMsTUFBTSxVQUFXLFNBQVEsdURBQVk7SUFHeEMsWUFBWSxPQUFxQztRQUM3QyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRWxCLElBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDOUIsSUFBSSxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUN4QixJQUFJLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFRCxNQUFNLENBQUMsTUFBVSxFQUFFLFdBQW1CO1FBQ2xDLE1BQU0sS0FBSyxHQUFHLHNEQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3BDLElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtZQUNyQixLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQzlDO0lBQ0wsQ0FBQztJQUVELFVBQVUsQ0FBQyxJQUFrQztRQUN6QyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQzNCLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDckIsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUN6QixDQUFDO0NBQ0o7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDNUI2QztBQUNtQjtBQUMvQjtBQUNxQztBQUNrQjtBQUVsRixNQUFNLFlBQWEsU0FBUSx1REFBWTtJQWdCMUMsWUFBWSxJQUFtQjtRQUMzQixLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBaEJuQixVQUFLLEdBQVcsRUFBRSxHQUFHLGtEQUFlLENBQUM7UUFDckMsV0FBTSxHQUFXLEVBQUUsR0FBRyxtREFBZ0IsQ0FBQztRQUt2QyxxQkFBZ0IsR0FBNEMsTUFBTTtRQUNsRSw2QkFBd0IsR0FBVyxDQUFDLENBQUM7UUFDckMsY0FBUyxHQUFXLENBQUMsQ0FBQztRQUd0QixlQUFVLEdBRU4sRUFBRSxDQUFDO1FBSUgsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLDJEQUFlLEVBQUU7WUFDL0IsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztTQUM5QjtRQUNELElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLDhDQUE2QztRQUNuRixJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksR0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUMsOEJBQThCLENBQUMsR0FBQyxDQUFDLENBQUMsdUVBQXNFO1FBQzlJLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzNCLElBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLG9HQUFtRztRQUNsSixJQUFJLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUM5QyxPQUFPLENBQUMsR0FBRyxDQUFDLDhDQUE4QyxJQUFJLENBQUMsTUFBTSxRQUFRLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUMzRiw4RkFBOEY7UUFDOUYsOENBQThDO1FBQzlDLG9CQUFvQjtRQUNwQixvQ0FBb0M7UUFDcEMsc0JBQXNCO1FBQ3RCLE1BQU0sQ0FBQyxPQUFPLENBQUMsNERBQWdCLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDL0MsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDakMsS0FBSSxJQUFJLEtBQUssSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQ3pCLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSw4RkFBd0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BILElBQUksbUJBQW1CLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDL0YsbUJBQW1CLENBQUMsWUFBWSxDQUFDLHVDQUFJLENBQUMsQ0FBQzthQUMxQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELFVBQVUsQ0FBQyxJQUFtQjtRQUMxQixJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssMkRBQWUsRUFBRTtZQUMvQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1NBQzlCO0lBQ0wsQ0FBQztJQUVELE1BQU0sQ0FBQyxNQUFVLEVBQUUsV0FBbUI7UUFFbEMsMkNBQTJDO1FBQzNDLElBQUksQ0FBQyx3QkFBd0IsSUFBSSxpREFBYyxDQUFDO1FBQ2hELE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzVCLHdEQUF3RDtRQUN4RCx1REFBdUQ7UUFDdkQsdUVBQXVFO1FBQ3ZFLElBQUcsSUFBSSxDQUFDLHdCQUF3QixHQUFDLDREQUFnQixDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUN6RixJQUFJLENBQUMsd0JBQXdCLEdBQUcsQ0FBQyxDQUFDLGlLQUFnSztZQUNsTSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDakIsSUFBRyxJQUFJLENBQUMsU0FBUyxJQUFFLDREQUFnQixDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLE1BQU0sRUFBRTtnQkFDL0QsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxHQUFDLDREQUFnQixDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLE1BQU0sQ0FBQzthQUNsRjtTQUNKO1FBRUQsU0FBUztRQUNULGlDQUFpQztRQUNqQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQzVELE1BQU0sRUFDTixDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsa0RBQWU7WUFDckIsd0RBQXFCLEdBQUcsa0RBQWUsQ0FBQztZQUN4QyxXQUFXLEVBQ2YsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLG1EQUFnQjtZQUN0Qix3REFBcUIsR0FBRyxtREFBZ0IsQ0FBQztZQUN6QyxXQUFXLEVBQ2YsSUFBSSxDQUFDLEtBQUssR0FBRyxXQUFXLEdBQUcsa0RBQWUsRUFDMUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxXQUFXLEdBQUcsbURBQWdCLENBQy9DLENBQUM7UUFDRixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQywwQkFBMEIsQ0FDaEYsSUFBSSxDQUFDLENBQUMsRUFDTixJQUFJLENBQUMsQ0FBQyxHQUFDLElBQUksQ0FBQyxNQUFNLEVBQ2xCLElBQUksQ0FBQyxLQUFLLEVBQ1YsSUFBSSxDQUFDLE1BQU0sQ0FDZCxDQUFDO1FBRUYsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBRWxCLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxDQUFDO1FBQ2pDLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFNUMsTUFBTSxDQUFDLElBQUksQ0FDUCxJQUFJLENBQUMsSUFBSSxHQUFDLFVBQVUsR0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFDaEUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLGtEQUFlO1lBQ3JCLHdEQUFxQixHQUFHLGtEQUFlO1lBQ3ZDLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxrREFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ25DLFdBQVcsRUFDZixDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsbURBQWdCO1lBQ3RCLHdEQUFxQixHQUFHLG1EQUFnQjtZQUN4QyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsa0RBQWUsQ0FBQyxHQUFHLEdBQUcsQ0FBQztZQUN0QyxXQUFXLENBQ2xCLENBQUM7SUFDTixDQUFDO0NBQ0o7QUFHRCxTQUFTLFFBQVEsQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVM7SUFDN0MsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUVaLElBQUcsQ0FBQyxJQUFJLENBQUMsRUFBQztRQUNOLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLGFBQWE7S0FDL0I7U0FBSTtRQUNELElBQUksT0FBTyxHQUFHLFNBQVMsT0FBTyxDQUFDLENBQVMsRUFBRSxDQUFTLEVBQUUsQ0FBUztZQUMxRCxJQUFHLENBQUMsR0FBRyxDQUFDO2dCQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDakIsSUFBRyxDQUFDLEdBQUcsQ0FBQztnQkFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2pCLElBQUcsQ0FBQyxHQUFHLENBQUMsR0FBQyxDQUFDO2dCQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDdkMsSUFBRyxDQUFDLEdBQUcsQ0FBQyxHQUFDLENBQUM7Z0JBQUUsT0FBTyxDQUFDLENBQUM7WUFDckIsSUFBRyxDQUFDLEdBQUcsQ0FBQyxHQUFDLENBQUM7Z0JBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMvQyxPQUFPLENBQUMsQ0FBQztRQUNiLENBQUM7UUFFRCxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM5QyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNsQixDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzQixDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDckIsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUMsQ0FBQyxDQUFDLENBQUM7S0FDOUI7SUFFRCxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDaEYsQ0FBQzs7Ozs7Ozs7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QWlCLHFCQUFxQjtXQUN0QztXQUNBO1dBQ0Esa0JBQWtCLHFCQUFxQjtXQUN2QztXQUNBO1dBQ0EsS0FBSztXQUNMO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7Ozs7V0MzQkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEdBQUc7V0FDSDtXQUNBO1dBQ0EsQ0FBQzs7Ozs7V0NQRDs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1dDTkE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLE1BQU0scUJBQXFCO1dBQzNCO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBOzs7OztVRWhEQTtVQUNBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2NsaWVudC9HYW1lLnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3NyYy9jbGllbnQvTmV0TWFuYWdlci50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi9zcmMvY2xpZW50L2Fzc2V0cy9Bc3NldHMudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2NsaWVudC9hc3NldHMvcmVzb3VyY2VzL0F1ZGlvUmVzb3VyY2UudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2NsaWVudC9hc3NldHMvcmVzb3VyY2VzL0F1ZGlvUmVzb3VyY2VHcm91cC50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi9zcmMvY2xpZW50L2Fzc2V0cy9yZXNvdXJjZXMvRm9udFJlc291cmNlLnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3NyYy9jbGllbnQvYXNzZXRzL3Jlc291cmNlcy9JbWFnZVJlc291cmNlLnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3NyYy9jbGllbnQvYXNzZXRzL3Jlc291cmNlcy9SZWZsZWN0ZWRJbWFnZVJlc291cmNlLnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3NyYy9jbGllbnQvYXNzZXRzL3Jlc291cmNlcy9SZXNvdXJjZS50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi9zcmMvY2xpZW50L2Fzc2V0cy9yZXNvdXJjZXMvVGlsZVJlc291cmNlLnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3NyYy9jbGllbnQvaW5wdXQvQ29udHJvbC50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi9zcmMvY2xpZW50L3BsYXllci9JbnZlbnRvcnkudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2NsaWVudC9wbGF5ZXIvUGxheWVyTG9jYWwudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2NsaWVudC91aS9CdXR0b24udHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2NsaWVudC91aS9JbnB1dEJveC50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi9zcmMvY2xpZW50L3VpL1VpRnJhbWUudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2NsaWVudC91aS9VaVNjcmVlbi50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi9zcmMvY2xpZW50L3VpL3NjcmVlbnMvQ29udHJvbHNNZW51LnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3NyYy9jbGllbnQvdWkvc2NyZWVucy9NYWluTWVudS50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi9zcmMvY2xpZW50L3VpL3NjcmVlbnMvT3B0aW9uc01lbnUudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2NsaWVudC91aS9zY3JlZW5zL1BhdXNlTWVudS50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi9zcmMvY2xpZW50L3VpL3NjcmVlbnMvVmlkZW9TZXR0aW5nc01lbnUudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2NsaWVudC93b3JsZC9Xb3JsZC50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi9zcmMvY2xpZW50L3dvcmxkL1dvcmxkVGlsZXMudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2NsaWVudC93b3JsZC9lbnRpdGllcy9DbG91ZC50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi9zcmMvY2xpZW50L3dvcmxkL2VudGl0aWVzL0VudGl0eUNsYXNzZXMudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luLy4vc3JjL2NsaWVudC93b3JsZC9lbnRpdGllcy9JdGVtRW50aXR5LnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3NyYy9jbGllbnQvd29ybGQvZW50aXRpZXMvUGxheWVyRW50aXR5LnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3NyYy9jbGllbnQvd29ybGQvZW50aXRpZXMvU2VydmVyRW50aXR5LnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3NyYy9jbGllbnQvd29ybGQvZW50aXRpZXMvVGlsZUVudGl0eS50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi9zcmMvY2xpZW50L3dvcmxkL3BhcnRpY2xlcy9Db2xvclBhcnRpY2xlLnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3NyYy9nbG9iYWwvRW50aXR5LnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3NyYy9nbG9iYWwvSW52ZW50b3J5LnRzIiwid2VicGFjazovL3Nub3dlZF9pbi8uL3NyYy9nbG9iYWwvVGlsZS50cyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vLi9zcmMvZ2xvYmFsL1RpbGVFbnRpdHkudHMiLCJ3ZWJwYWNrOi8vc25vd2VkX2luL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3Nub3dlZF9pbi93ZWJwYWNrL3J1bnRpbWUvY2h1bmsgbG9hZGVkIiwid2VicGFjazovL3Nub3dlZF9pbi93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3Nub3dlZF9pbi93ZWJwYWNrL3J1bnRpbWUvZ2xvYmFsIiwid2VicGFjazovL3Nub3dlZF9pbi93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3Nub3dlZF9pbi93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3Nub3dlZF9pbi93ZWJwYWNrL3J1bnRpbWUvanNvbnAgY2h1bmsgbG9hZGluZyIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9zbm93ZWRfaW4vd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL3Nub3dlZF9pbi93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHA1LCB7IFNoYWRlciB9IGZyb20gJ3A1JztcclxuXHJcbmltcG9ydCB7IFdvcmxkIH0gZnJvbSAnLi93b3JsZC9Xb3JsZCc7XHJcblxyXG5pbXBvcnQge1xyXG5cdEF1ZGlvQXNzZXRzLFxyXG5cdEZvbnRzLFxyXG5cdEl0ZW1Bc3NldHMsXHJcblx0bG9hZEFzc2V0cyxcclxuXHRQbGF5ZXJBbmltYXRpb25zLFxyXG5cdFVpQXNzZXRzLFxyXG5cdFdvcmxkQXNzZXRzLFxyXG59IGZyb20gJy4vYXNzZXRzL0Fzc2V0cyc7XHJcbmltcG9ydCB7IE1haW5NZW51IH0gZnJvbSAnLi91aS9zY3JlZW5zL01haW5NZW51JztcclxuaW1wb3J0IHsgaW8sIFNvY2tldCB9IGZyb20gJ3NvY2tldC5pby1jbGllbnQnO1xyXG5pbXBvcnQgeyBVaVNjcmVlbiB9IGZyb20gJy4vdWkvVWlTY3JlZW4nO1xyXG5pbXBvcnQgeyBQYXVzZU1lbnUgfSBmcm9tICcuL3VpL3NjcmVlbnMvUGF1c2VNZW51JztcclxuaW1wb3J0IHsgTmV0TWFuYWdlciB9IGZyb20gJy4vTmV0TWFuYWdlcic7XHJcbmltcG9ydCB7IFdvcmxkVGlsZXMsIFRpbGUgfSBmcm9tICcuL3dvcmxkL1dvcmxkVGlsZXMnO1xyXG5cclxuaW1wb3J0IHsgQ2xpZW50RXZlbnRzLCBTZXJ2ZXJFdmVudHMgfSBmcm9tICcuLi9nbG9iYWwvRXZlbnRzJztcclxuXHJcbi8qXHJcbi8vL0lORk9STUFUSU9OXHJcbi8vU3RhcnRpbmcgYSBnYW1lXHJcblByZXNzIExpdmUgU2VydmVyIHRvIHN0YXJ0IHRoZSBnYW1lXHJcbm9yXHJcblR5cGUgbnBtIHJ1biBwcmVzdGFydCB0byBzdGFydCB0aGUgZ2FtZS5cclxuLy9UT0RPXHJcbldoZW4gc29tZXRoaW5nIGluIHRoZSB0b2RvIHNlY3Rpb24sIGVpdGhlciBkZWxldGUgaXQgYW5kIG1hcmsgd2hhdCB3YXMgZG9uZSBpbiB0aGUgZGVzY3JpcHRpb24gLVxyXG4tIHdoZW4gcHVzaGluZywgb3IganVzdCBtYXJrIGl0IGxpa2UgdGhpc1xyXG4oZXhhbXBsZTogQ3JlYXRlIGEgbnVjbGVhciBleHBsb3Npb24gLS0gWClcclxuLy8vR0VORVJBTCBUT0RPOlxyXG5cclxuLy9BdWRpb1xyXG5zb3VuZHNcclxubXVzaWNcclxuTlBDJ3NcclxuXHJcbi8vVmlzdWFsXHJcblVwZGF0ZSBzbm93IHRleHR1cmVzXHJcblVwZGF0ZSBHVUkgdGV4dHVyZXNcclxucGxheWVyIGNoYXJhY3RlclxyXG5pdGVtIGxvcmUgaW1wbGVtZW50ZWRcclxuXHJcbi8vR2FtZXBsYXlcclxuZmluaXNoIGl0ZW0gbWFuYWdlbWVudFxyXG5wYXVzZSBtZW51XHJcbkh1bmdlciwgaGVhdCwgZXRjIHN5c3RlbVxyXG5pdGVtIGNyZWF0aW9uXHJcbml0ZW0gdXNlXHJcblBhcmVudCBXb3JrYmVuY2hcclxuXHJcbi8vT2JqZWN0c1xyXG5kaXJ0XHJcbnN0b25lXHJcbndvcmtiZW5jaFxyXG5iYWNrcGFjayAodXNlZCBhcyBjaGVzdClcclxuXHJcbi8vUG9saXNoXHJcbmJldHRlciB3b3JsZCBnZW5lcmF0aW9uXHJcbmZvbnQgY29uc2lzdGVuY3lcclxuZml4IGN1cnNvciBpbnB1dCBsYWcgKHNlcGFyYXRlIGN1cnNvciBhbmQgYW5pbWF0aW9uIGltYWdlcylcclxuZml4IHN0dWNrIG9uIHNpZGUgb2YgYmxvY2sgYnVnXHJcbmZpeCBjb2xsaWRlIHdpdGggc2lkZXMgb2YgbWFwIGJ1Z1xyXG4gKi9cclxuaW1wb3J0IHsgVGlsZVR5cGUgfSBmcm9tICcuLi9nbG9iYWwvVGlsZSc7XHJcbmltcG9ydCB7IENvbnRyb2wgfSBmcm9tICcuL2lucHV0L0NvbnRyb2wnO1xyXG5pbXBvcnQgeyBDb2xvclBhcnRpY2xlIH0gZnJvbSAnLi93b3JsZC9wYXJ0aWNsZXMvQ29sb3JQYXJ0aWNsZSc7XHJcbmltcG9ydCB7IFRpbGVFbnRpdGllcyB9IGZyb20gJy4uL2dsb2JhbC9UaWxlRW50aXR5JztcclxuaW1wb3J0IHsgQ2xvdWQgfSBmcm9tICcuL3dvcmxkL2VudGl0aWVzL0Nsb3VkJztcclxuXHJcbmV4cG9ydCBjbGFzcyBHYW1lIGV4dGVuZHMgcDUge1xyXG5cdHdvcmxkV2lkdGg6IG51bWJlciA9IDUxMjsgLy8gd2lkdGggb2YgdGhlIHdvcmxkIGluIHRpbGVzICAgPCE+IE1BS0UgU1VSRSBUSElTIElTIE5FVkVSIExFU1MgVEhBTiA2NCEhISA8IT5cclxuXHR3b3JsZEhlaWdodDogbnVtYmVyID0gMjU2OyAvLyBoZWlnaHQgb2YgdGhlIHdvcmxkIGluIHRpbGVzICA8IT4gTUFLRSBTVVJFIFRISVMgSVMgTkVWRVIgTEVTUyBUSEFOIDY0ISEhIDwhPlxyXG5cclxuXHRUSUxFX1dJRFRIOiBudW1iZXIgPSA4OyAvLyB3aWR0aCBvZiBhIHRpbGVzIGluIHBpeGVsc1xyXG5cdFRJTEVfSEVJR0hUOiBudW1iZXIgPSA4OyAvLyBoZWlnaHQgb2YgYSB0aWxlcyBpbiBwaXhlbHNcclxuXHJcblx0dXBzY2FsZVNpemU6IG51bWJlciA9IDY7IC8vIG51bWJlciBvZiBzY3JlZW4gcGl4ZWxzIHBlciB0ZXh0dXJlIHBpeGVscyAodGhpbmsgb2YgdGhpcyBhcyBodWQgc2NhbGUgaW4gTWluZWNyYWZ0KVxyXG5cclxuXHRjYW1YOiBudW1iZXIgPSAwOyAvLyBwb3NpdGlvbiBvZiB0aGUgdG9wIGxlZnQgY29ybmVyIG9mIHRoZSBzY3JlZW4gaW4gdW4tdXAtc2NhbGVkIHBpeGVscyAoMCBpcyBsZWZ0IG9mIHdvcmxkKSAod29ybGRXaWR0aCpUSUxFX1dJRFRIIGlzIGJvdHRvbSBvZiB3b3JsZClcclxuXHRjYW1ZOiBudW1iZXIgPSAwOyAvLyBwb3NpdGlvbiBvZiB0aGUgdG9wIGxlZnQgY29ybmVyIG9mIHRoZSBzY3JlZW4gaW4gdW4tdXAtc2NhbGVkIHBpeGVscyAoMCBpcyB0b3Agb2Ygd29ybGQpICh3b3JsZEhlaWdodCpUSUxFX0hFSUdIVCBpcyBib3R0b20gb2Ygd29ybGQpXHJcblx0cENhbVg6IG51bWJlciA9IDA7IC8vIGxhc3QgZnJhbWUncyB4IG9mIHRoZSBjYW1lcmFcclxuXHRwQ2FtWTogbnVtYmVyID0gMDsgLy8gbGFzdCBmcmFtZSdzIHkgb2YgdGhlIGNhbWVyYVxyXG5cdGludGVycG9sYXRlZENhbVg6IG51bWJlciA9IDA7IC8vIGludGVycG9sYXRlZCBwb3NpdGlvbiBvZiB0aGUgY2FtZXJhXHJcblx0aW50ZXJwb2xhdGVkQ2FtWTogbnVtYmVyID0gMDsgLy8gaW50ZXJwb2xhdGVkIHBvc2l0aW9uIG9mIHRoZSBjYW1lcmFcclxuXHRkZXNpcmVkQ2FtWDogbnVtYmVyID0gMDsgLy8gZGVzaXJlZCBwb3NpdGlvbiBvZiB0aGUgY2FtZXJhXHJcblx0ZGVzaXJlZENhbVk6IG51bWJlciA9IDA7IC8vIGRlc2lyZWQgcG9zaXRpb24gb2YgdGhlIGNhbWVyYVxyXG5cdHNjcmVlbnNoYWtlQW1vdW50OiBudW1iZXIgPSAwOyAvLyBhbW91bnQgb2Ygc2NyZWVuc2hha2UgaGFwcGVuaW5nIGF0IHRoZSBjdXJyZW50IG1vbWVudFxyXG5cclxuXHQvLyB0aWNrIG1hbmFnZW1lbnRcclxuXHRtc1NpbmNlVGljazogbnVtYmVyID0gMDsgLy8gdGhpcyBpcyB0aGUgcnVubmluZyBjb3VudGVyIG9mIGhvdyBtYW55IG1pbGxpc2Vjb25kcyBpdCBoYXMgYmVlbiBzaW5jZSB0aGUgbGFzdCB0aWNrLiAgVGhlIGdhbWUgY2FuIHRoZW5cclxuXHRtc1BlclRpY2s6IG51bWJlciA9IDIwOyAvLyB0aGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBwZXIgZ2FtZSB0aWNrLiAgMTAwMC9tc1BlclRpY2sgPSB0aWNrcyBwZXIgc2Vjb25kXHJcblx0YW1vdW50U2luY2VMYXN0VGljazogbnVtYmVyID0gMDsgLy8gdGhpcyBpcyBhIHZhcmlhYmxlIGNhbGN1bGF0ZWQgZXZlcnkgZnJhbWUgdXNlZCBmb3IgaW50ZXJwb2xhdGlvbiAtIGRvbWFpblswLDEpXHJcblx0Zm9yZ2l2ZW5lc3NDb3VudDogbnVtYmVyID0gNTA7IC8vIGlmIHRoZSBjb21wdXRlciBuZWVkcyB0byBkbyBtb3JlIHRoYW4gNTAgdGlja3MgaW4gYSBzaW5nbGUgZnJhbWUsIHRoZW4gaXQgY291bGQgYmUgcnVubmluZyBiZWhpbmQsIHByb2JhYmx5IGJlY2F1c2Ugb2YgYSBmcmVlemUgb3IgdGhlIHVzZXIgYmVpbmcgb24gYSBkaWZmZXJlbnQgdGFiLiAgSW4gdGhlc2UgY2FzZXMsIGl0J3MgcHJvYmFibHkgYmVzdCB0byBqdXN0IGlnbm9yZSB0aGF0IGFueSB0aW1lIGhhcyBwYXNzZWQgdG8gYXZvaWQgZnVydGhlciBmcmVlemluZ1xyXG5cclxuXHQvLyBwaHlzaWNzIGNvbnN0YW50c1xyXG5cdEdSQVZJVFlfU1BFRUQ6IG51bWJlciA9IDAuMDQ7IC8vIGluIHVuaXRzIHBlciBzZWNvbmQgdGljaywgcG9zaXRpdmUgbWVhbnMgZG93bndhcmQgZ3Jhdml0eSwgbmVnYXRpdmUgbWVhbnMgdXB3YXJkIGdyYXZpdHlcclxuXHREUkFHX0NPRUZGSUNJRU5UOiBudW1iZXIgPSAwLjIxOyAvLyBhcmJpdHJhcnkgbnVtYmVyLCAwIG1lYW5zIG5vIGRyYWdcclxuXHJcblx0Ly8gQ0hBUkFDVEVSIFNIT1VMRCBCRSBST1VHSExZIDEyIFBJWEVMUyBCWSAyMCBQSVhFTFNcclxuXHJcblx0cGlja2VkVXBTbG90ID0gLTE7XHJcblxyXG5cdHdvcmxkTW91c2VYID0gMDsgLy8gdGhlIG1vdXNlIHBvc2l0aW9uIGluIHdvcmxkIGNvb3JkaW5hdGVzXHJcblx0d29ybGRNb3VzZVkgPSAwOyAvLyB0aGUgbW91c2UgcG9zaXRpb24gaW4gd29ybGQgY29vcmRpbmF0ZXNcclxuXHRsYXN0Q3Vyc29yTW92ZSA9IERhdGUubm93KClcclxuXHRtb3VzZU9uID0gdHJ1ZTsgLy8gaXMgdGhlIG1vdXNlIG9uIHRoZSB3aW5kb3c/XHJcblxyXG5cdGtleXM6IGJvb2xlYW5bXSA9IFtdO1xyXG5cclxuXHQvLyB0aGUga2V5Y29kZSBmb3IgdGhlIGtleSB0aGF0IGRvZXMgdGhlIGFjdGlvblxyXG5cdGNvbnRyb2xzOiBDb250cm9sW10gPSBbXHJcblx0XHRuZXcgQ29udHJvbChcclxuXHRcdFx0J1dhbGsgUmlnaHQnLFxyXG5cdFx0XHR0cnVlLFxyXG5cdFx0XHQ2OCxcclxuXHRcdFx0KCkgPT4ge1xyXG5cdFx0XHRcdGlmICh0aGlzLmN1cnJlbnRVaSAhPT0gdW5kZWZpbmVkKSByZXR1cm47XHJcblx0XHRcdFx0dGhpcy53b3JsZC5wbGF5ZXIucmlnaHRCdXR0b24gPSB0cnVlO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHQoKSA9PiB7XHJcblx0XHRcdFx0aWYgKHRoaXMuY3VycmVudFVpICE9PSB1bmRlZmluZWQpIHJldHVybjtcclxuXHRcdFx0XHR0aGlzLndvcmxkLnBsYXllci5yaWdodEJ1dHRvbiA9IGZhbHNlO1xyXG5cdFx0XHR9LFxyXG5cdFx0KSwgLy8gcmlnaHRcclxuXHRcdG5ldyBDb250cm9sKFxyXG5cdFx0XHQnV2FsayBMZWZ0JyxcclxuXHRcdFx0dHJ1ZSxcclxuXHRcdFx0NjUsXHJcblx0XHRcdCgpID0+IHtcclxuXHRcdFx0XHRpZiAodGhpcy5jdXJyZW50VWkgIT09IHVuZGVmaW5lZCkgcmV0dXJuO1xyXG5cdFx0XHRcdHRoaXMud29ybGQucGxheWVyLmxlZnRCdXR0b24gPSB0cnVlO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHQoKSA9PiB7XHJcblx0XHRcdFx0aWYgKHRoaXMuY3VycmVudFVpICE9PSB1bmRlZmluZWQpIHJldHVybjtcclxuXHRcdFx0XHR0aGlzLndvcmxkLnBsYXllci5sZWZ0QnV0dG9uID0gZmFsc2U7XHJcblx0XHRcdH0sXHJcblx0XHQpLCAvLyBsZWZ0XHJcblx0XHRuZXcgQ29udHJvbChcclxuXHRcdFx0J0p1bXAnLFxyXG5cdFx0XHR0cnVlLFxyXG5cdFx0XHQ4NyxcclxuXHRcdFx0KCkgPT4ge1xyXG5cdFx0XHRcdGlmICh0aGlzLmN1cnJlbnRVaSAhPT0gdW5kZWZpbmVkKSByZXR1cm47XHJcblx0XHRcdFx0dGhpcy53b3JsZC5wbGF5ZXIuanVtcEJ1dHRvbiA9IHRydWU7XHJcblx0XHRcdH0sXHJcblx0XHRcdCgpID0+IHtcclxuXHRcdFx0XHRpZiAodGhpcy5jdXJyZW50VWkgIT09IHVuZGVmaW5lZCkgcmV0dXJuO1xyXG5cdFx0XHRcdHRoaXMud29ybGQucGxheWVyLmp1bXBCdXR0b24gPSBmYWxzZTtcclxuXHRcdFx0fSxcclxuXHRcdCksIC8vIGp1bXBcclxuXHRcdG5ldyBDb250cm9sKCdQYXVzZScsIHRydWUsIDI3LCAoKSA9PiB7XHJcblx0XHRcdC8vaWYgaW52ZW50b3J5IG9wZW57XHJcblx0XHRcdC8vY2xvc2UgaW52ZW50b3J5XHJcblx0XHRcdC8vcmV0dXJuO31cclxuXHRcdFx0aWYgKHRoaXMuY3VycmVudFVpID09PSB1bmRlZmluZWQpXHJcblx0XHRcdFx0dGhpcy5jdXJyZW50VWkgPSBuZXcgUGF1c2VNZW51KEZvbnRzLnRpdGxlLCBGb250cy5iaWcpO1xyXG5cdFx0XHRlbHNlIHRoaXMuY3VycmVudFVpID0gdW5kZWZpbmVkO1xyXG5cdFx0fSksIC8vIHNldHRpbmdzXHJcblx0XHRuZXcgQ29udHJvbCgnSW52ZW50b3J5JywgdHJ1ZSwgNjksICgpID0+IHtcclxuXHRcdFx0Ly9pZiB1aSBvcGVuIHJldHVybjtcclxuXHRcdFx0Ly9pZiBpbnZlbnRvcnkgY2xvc2VkIG9wZW4gaW52ZW50b3J5XHJcblx0XHRcdC8vZWxzZSBjbG9zZSBpbnZlbnRvcnlcclxuXHRcdFx0Y29uc29sZS5sb2coJ2ludmVudG9yeSBoYXMgbm90IGJlZW4gaW1wbGVtZW50ZWQgeWV0Jyk7XHJcblx0XHR9KSwgLy8gaW52ZW50b3J5XHJcblx0XHRuZXcgQ29udHJvbCgnSG90YmFyIDEnLCB0cnVlLCA0OSwgKCkgPT4ge1xyXG5cdFx0XHR0aGlzLndvcmxkLmludmVudG9yeS5zZWxlY3RlZFNsb3QgPSAwO1xyXG5cdFx0fSksIC8vIGhvdCBiYXIgMVxyXG5cdFx0bmV3IENvbnRyb2woJ0hvdGJhciAyJywgdHJ1ZSwgNTAsICgpID0+IHtcclxuXHRcdFx0dGhpcy53b3JsZC5pbnZlbnRvcnkuc2VsZWN0ZWRTbG90ID0gMTtcclxuXHRcdH0pLCAvLyBob3QgYmFyIDJcclxuXHRcdG5ldyBDb250cm9sKCdIb3RiYXIgMycsIHRydWUsIDUxLCAoKSA9PiB7XHJcblx0XHRcdHRoaXMud29ybGQuaW52ZW50b3J5LnNlbGVjdGVkU2xvdCA9IDI7XHJcblx0XHR9KSwgLy8gaG90IGJhciAzXHJcblx0XHRuZXcgQ29udHJvbCgnSG90YmFyIDQnLCB0cnVlLCA1MiwgKCkgPT4ge1xyXG5cdFx0XHR0aGlzLndvcmxkLmludmVudG9yeS5zZWxlY3RlZFNsb3QgPSAzO1xyXG5cdFx0fSksIC8vIGhvdCBiYXIgNFxyXG5cdFx0bmV3IENvbnRyb2woJ0hvdGJhciA1JywgdHJ1ZSwgNTMsICgpID0+IHtcclxuXHRcdFx0dGhpcy53b3JsZC5pbnZlbnRvcnkuc2VsZWN0ZWRTbG90ID0gNDtcclxuXHRcdH0pLCAvLyBob3QgYmFyIDVcclxuXHRcdG5ldyBDb250cm9sKCdIb3RiYXIgNicsIHRydWUsIDU0LCAoKSA9PiB7XHJcblx0XHRcdHRoaXMud29ybGQuaW52ZW50b3J5LnNlbGVjdGVkU2xvdCA9IDU7XHJcblx0XHR9KSwgLy8gaG90IGJhciA2XHJcblx0XHRuZXcgQ29udHJvbCgnSG90YmFyIDcnLCB0cnVlLCA1NSwgKCkgPT4ge1xyXG5cdFx0XHR0aGlzLndvcmxkLmludmVudG9yeS5zZWxlY3RlZFNsb3QgPSA2O1xyXG5cdFx0fSksIC8vIGhvdCBiYXIgN1xyXG5cdFx0bmV3IENvbnRyb2woJ0hvdGJhciA4JywgdHJ1ZSwgNTYsICgpID0+IHtcclxuXHRcdFx0dGhpcy53b3JsZC5pbnZlbnRvcnkuc2VsZWN0ZWRTbG90ID0gNztcclxuXHRcdH0pLCAvLyBob3QgYmFyIDhcclxuXHRcdG5ldyBDb250cm9sKCdIb3RiYXIgOScsIHRydWUsIDU3LCAoKSA9PiB7XHJcblx0XHRcdHRoaXMud29ybGQuaW52ZW50b3J5LnNlbGVjdGVkU2xvdCA9IDg7XHJcblx0XHR9KSwgLy8gaG90IGJhciA5XHJcblx0XHRuZXcgQ29udHJvbCgnSG90YmFyIDEwJywgdHJ1ZSwgNDgsICgpID0+IHtcclxuXHRcdFx0dGhpcy53b3JsZC5pbnZlbnRvcnkuc2VsZWN0ZWRTbG90ID0gOTtcclxuXHRcdH0pLCAvLyBob3QgYmFyIDEwXHJcblx0XHRuZXcgQ29udHJvbCgnSG90YmFyIDExJywgdHJ1ZSwgMTg5LCAoKSA9PiB7XHJcblx0XHRcdHRoaXMud29ybGQuaW52ZW50b3J5LnNlbGVjdGVkU2xvdCA9IDEwO1xyXG5cdFx0fSksIC8vIGhvdCBiYXIgMTFcclxuXHRcdG5ldyBDb250cm9sKCdIb3RiYXIgMTInLCB0cnVlLCAxODcsICgpID0+IHtcclxuXHRcdFx0dGhpcy53b3JsZC5pbnZlbnRvcnkuc2VsZWN0ZWRTbG90ID0gMTE7XHJcblx0XHR9KSwgLy8gaG90IGJhciAxMlxyXG5cdF07XHJcblxyXG5cdGNhbnZhczogcDUuUmVuZGVyZXI7IC8vdGhlIGNhbnZhcyBmb3IgdGhlIGdhbWVcclxuXHRza3lMYXllcjogcDUuR3JhcGhpY3M7IC8vYSBwNS5HcmFwaGljcyBvYmplY3QgdGhhdCB0aGUgc2hhZGVyIGlzIGRyYXduIG9udG8uICB0aGlzIGlzbid0IHRoZSBiZXN0IHdheSB0byBkbyB0aGlzLCBidXQgdGhlIG1haW4gZ2FtZSBjYW52YXMgaXNuJ3QgV0VCR0wsIGFuZCBpdCdzIHRvbyBtdWNoIHdvcmsgdG8gY2hhbmdlIHRoYXRcclxuXHRza3lTaGFkZXI6IHA1LlNoYWRlcjsgLy90aGUgc2hhZGVyIHRoYXQgZHJhd3MgdGhlIHNreSAodGhlIHBhdGggZm9yIHRoaXMgaXMgaW4gdGhlIHB1YmxpYyBmb2xkZXIpXHJcblxyXG5cdHdvcmxkOiBXb3JsZDtcclxuXHJcblx0Y3VycmVudFVpOiBVaVNjcmVlbiB8IHVuZGVmaW5lZDtcclxuXHJcblx0Y29ubmVjdGlvbjogU29ja2V0PFNlcnZlckV2ZW50cywgQ2xpZW50RXZlbnRzPjtcclxuXHJcblx0bmV0TWFuYWdlcjogTmV0TWFuYWdlcjtcclxuXHJcblx0Ly9jaGFuZ2VhYmxlIG9wdGlvbnMgZnJvbSBtZW51c1xyXG5cdHNlcnZlclZpc2liaWxpdHk6IHN0cmluZztcclxuXHR3b3JsZEJ1bXBpbmVzczogbnVtYmVyO1xyXG5cdHNreU1vZDogbnVtYmVyO1xyXG5cdHNreVRvZ2dsZTogYm9vbGVhbjtcclxuXHRwYXJ0aWNsZU11bHRpcGxpZXI6IG51bWJlcjtcclxuXHJcblx0cGFydGljbGVzOiBDb2xvclBhcnRpY2xlIC8qfEZvb3RzdGVwUGFydGljbGUqL1tdO1xyXG5cdGNsb3VkczogQ2xvdWQgLyp8Rm9vdHN0ZXBQYXJ0aWNsZSovW107XHJcblx0YnJlYWtpbmc6IGJvb2xlYW4gPSB0cnVlO1xyXG5cclxuXHRjb25zdHJ1Y3Rvcihjb25uZWN0aW9uOiBTb2NrZXQpIHtcclxuXHRcdHN1cGVyKCgpID0+IHsgfSk7IC8vIFRvIGNyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiBwNSBpdCB3aWxsIGNhbGwgYmFjayB3aXRoIHRoZSBpbnN0YW5jZS4gV2UgZG9uJ3QgbmVlZCB0aGlzIHNpbmNlIHdlIGFyZSBleHRlbmRpbmcgdGhlIGNsYXNzXHJcblx0XHR0aGlzLmNvbm5lY3Rpb24gPSBjb25uZWN0aW9uO1xyXG5cclxuXHRcdC8vIEluaXRpYWxpc2UgdGhlIG5ldHdvcmsgbWFuYWdlclxyXG5cdFx0dGhpcy5uZXRNYW5hZ2VyID0gbmV3IE5ldE1hbmFnZXIodGhpcyk7XHJcblx0fVxyXG5cclxuXHRwcmVsb2FkKCkge1xyXG5cdFx0Y29uc29sZS5sb2coJ0xvYWRpbmcgYXNzZXRzJyk7XHJcblx0XHRsb2FkQXNzZXRzKFxyXG5cdFx0XHR0aGlzLFxyXG5cdFx0XHRVaUFzc2V0cyxcclxuXHRcdFx0SXRlbUFzc2V0cyxcclxuXHRcdFx0V29ybGRBc3NldHMsXHJcblx0XHRcdEZvbnRzLFxyXG5cdFx0XHRQbGF5ZXJBbmltYXRpb25zLFxyXG5cdFx0KTtcclxuXHRcdGNvbnNvbGUubG9nKCdBc3NldCBsb2FkaW5nIGNvbXBsZXRlZCcpO1xyXG5cdFx0dGhpcy5za3lTaGFkZXIgPSB0aGlzLmxvYWRTaGFkZXIoXHJcblx0XHRcdCdhc3NldHMvc2hhZGVycy9iYXNpYy52ZXJ0JyxcclxuXHRcdFx0J2Fzc2V0cy9zaGFkZXJzL3NreS5mcmFnJyxcclxuXHRcdCk7XHJcblx0fVxyXG5cclxuXHRzZXR1cCgpIHtcclxuXHRcdGNvbnNvbGUubG9nKCdzZXR1cCBjYWxsZWQnKTtcclxuXHRcdC8vIG1ha2UgYSBjYW52YXMgdGhhdCBmaWxscyB0aGUgd2hvbGUgc2NyZWVuIChhIGNhbnZhcyBpcyB3aGF0IGlzIGRyYXduIHRvIGluIHA1LmpzLCBhcyB3ZWxsIGFzIGxvdHMgb2Ygb3RoZXIgSlMgcmVuZGVyaW5nIGxpYnJhcmllcylcclxuXHRcdHRoaXMuY2FudmFzID0gdGhpcy5jcmVhdGVDYW52YXModGhpcy53aW5kb3dXaWR0aCwgdGhpcy53aW5kb3dIZWlnaHQpO1xyXG5cdFx0dGhpcy5jYW52YXMubW91c2VPdXQodGhpcy5tb3VzZUV4aXRlZCk7XHJcblx0XHR0aGlzLmNhbnZhcy5tb3VzZU92ZXIodGhpcy5tb3VzZUVudGVyZWQpO1xyXG5cclxuXHRcdHRoaXMuc2t5TGF5ZXIgPSB0aGlzLmNyZWF0ZUdyYXBoaWNzKHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0LCAnd2ViZ2wnKTtcclxuXHJcblx0XHR0aGlzLmN1cnJlbnRVaSA9IG5ldyBNYWluTWVudShGb250cy50aXRsZSwgRm9udHMuYmlnKTtcclxuXHJcblx0XHQvLyBUaWNrXHJcblx0XHRzZXRJbnRlcnZhbCgoKSA9PiB7XHJcblx0XHRcdGlmICh0aGlzLndvcmxkID09PSB1bmRlZmluZWQpIHJldHVybjtcclxuXHRcdFx0dGhpcy53b3JsZC50aWNrKHRoaXMpO1xyXG5cdFx0fSwgMTAwMCAvIHRoaXMubmV0TWFuYWdlci5wbGF5ZXJUaWNrUmF0ZSk7XHJcblxyXG5cdFx0dGhpcy5jb25uZWN0aW9uLmVtaXQoXHJcblx0XHRcdCdqb2luJyxcclxuXHRcdFx0J2U0MDIyZDQwM2RjYzZkMTlkNmE2OGJhM2FiZmQwYTYwJyxcclxuXHRcdFx0J3BsYXllcicgKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDAwKSxcclxuXHRcdCk7XHJcblxyXG5cdFx0Ly8gZ28gZm9yIGEgc2NhbGUgb2YgPDY0IHRpbGVzIHdpZGUgc2NyZWVuXHJcblx0XHR0aGlzLndpbmRvd1Jlc2l6ZWQoKTtcclxuXHJcblx0XHQvLyByZW1vdmUgdGV4dHVyZSBpbnRlcnBvbGF0aW9uIChlbmFibGUgcG9pbnQgZmlsdGVyaW5nIGZvciBpbWFnZXMpXHJcblx0XHR0aGlzLm5vU21vb3RoKCk7XHJcblxyXG5cdFx0Ly8gdGhlIGhpZ2hlc3Qga2V5Y29kZSBpcyAyNTUsIHdoaWNoIGlzIFwiVG9nZ2xlIFRvdWNocGFkXCIsIGFjY29yZGluZyB0byBrZXljb2RlLmluZm9cclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgMjU1OyBpKyspIHtcclxuXHRcdFx0dGhpcy5rZXlzLnB1c2goZmFsc2UpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHNldCB0aGUgZnJhbWVyYXRlIGdvYWwgdG8gYXMgaGlnaCBhcyBwb3NzaWJsZSAodGhpcyB3aWxsIGVuZCB1cCBjYXBwaW5nIHRvIHlvdXIgbW9uaXRvcidzIHJlZnJlc2ggcmF0ZSB3aXRoIHZzeW5jLilcclxuXHRcdHRoaXMuZnJhbWVSYXRlKEluZmluaXR5KTtcclxuXHRcdC8vIEF1ZGlvQW5wc3NldHMuYW1iaWVudC53aW50ZXIxLnBsYXlTb3VuZCgpO1xyXG5cdFx0dGhpcy5wYXJ0aWNsZU11bHRpcGxpZXIgPSAxO1xyXG5cdFx0dGhpcy5za3lUb2dnbGUgPSB0cnVlO1xyXG5cdFx0dGhpcy5za3lNb2QgPSAyO1xyXG5cdFx0dGhpcy5wYXJ0aWNsZXMgPSBbXTtcclxuXHRcdHRoaXMuY2xvdWRzID0gW107XHJcblx0XHRmb3IobGV0IGkgPSAwOyBpPDgwOyBpKyspIHtcclxuXHRcdFx0dGhpcy5jbG91ZHMucHVzaChuZXcgQ2xvdWQoTWF0aC5yYW5kb20oKSp0aGlzLndpZHRoL3RoaXMudXBzY2FsZVNpemUvdGhpcy5USUxFX1dJRFRILCA0LygwLjErTWF0aC5yYW5kb20oKSktNSkpO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5jdXJzb3IoXCJhc3NldHMvdGV4dHVyZXMvdWkvY3Vyc29yMi5wbmdcIik7XHJcblx0fVxyXG5cclxuXHRkcmF3KCkge1xyXG5cdFx0aWYgKHRoaXMuZnJhbWVDb3VudCA9PT0gMikge1xyXG5cdFx0XHQvL2hhcyB0byBiZSBkb25lIG9uIHRoZSBzZWNvbmQgZnJhbWUgZm9yIHNvbWUgcmVhc29uP1xyXG5cdFx0XHR0aGlzLnNreVNoYWRlci5zZXRVbmlmb3JtKCdzY3JlZW5EaW1lbnNpb25zJywgW1xyXG5cdFx0XHRcdCh0aGlzLndpZHRoIC8gdGhpcy51cHNjYWxlU2l6ZSkgKiAyLFxyXG5cdFx0XHRcdCh0aGlzLmhlaWdodCAvIHRoaXMudXBzY2FsZVNpemUpICogMixcclxuXHRcdFx0XSk7XHJcblx0XHRcdHRoaXMuc2t5U2hhZGVyLnNldFVuaWZvcm0oXHJcblx0XHRcdFx0J3NreUltYWdlJyxcclxuXHRcdFx0XHRXb3JsZEFzc2V0cy5zaGFkZXJSZXNvdXJjZXMuc2t5SW1hZ2UuaW1hZ2UsXHJcblx0XHRcdCk7XHJcblx0XHRcdC8vIE9iamVjdC52YWx1ZXMoUGxheWVyQW5pbWF0aW9ucykuZm9yRWFjaChwbGF5ZXJBbmltYXRpb24gPT4ge1xyXG5cdFx0XHQvLyBcdHBsYXllckFuaW1hdGlvbi5mb3JFYWNoKGFuaW1hdGlvbkZyYW1lID0+IHtcclxuXHRcdFx0Ly8gXHRcdGNvbnNvbGUubG9nKFwibG9hZGluZyBhbmltYXRpb24gXCIrYW5pbWF0aW9uRnJhbWVbMF0ucGF0aClcclxuXHRcdFx0Ly8gXHRcdGFuaW1hdGlvbkZyYW1lWzBdLmxvYWRSZWZsZWN0aW9uKHRoaXMpXHJcblx0XHRcdC8vIFx0fSlcclxuXHRcdFx0Ly8gfSk7XHJcblx0XHR9XHJcblx0XHQvLyBkbyB0aGUgdGljayBjYWxjdWxhdGlvbnNcclxuXHRcdHRoaXMuZG9UaWNrcygpO1xyXG5cclxuXHRcdC8vIHVwZGF0ZSBtb3VzZSBwb3NpdGlvblxyXG5cdFx0dGhpcy51cGRhdGVNb3VzZSgpO1xyXG5cdFx0aWYodGhpcy5tb3VzZUlzUHJlc3NlZCkge1xyXG5cdFx0dGhpcy53b3JsZC5pbnZlbnRvcnkud29ybGRDbGljayh0aGlzLndvcmxkTW91c2VYLCB0aGlzLndvcmxkTW91c2VZKTt9XHJcblxyXG5cdFx0Ly8gdXBkYXRlIHRoZSBjYW1lcmEncyBpbnRlcnBvbGF0aW9uXHJcblx0XHR0aGlzLm1vdmVDYW1lcmEoKTtcclxuXHJcblx0XHQvLyB3aXBlIHRoZSBzY3JlZW4gd2l0aCBhIGhhcHB5IGxpdHRsZSBsYXllciBvZiBsaWdodCBibHVlXHJcblx0XHR0aGlzLnNreVNoYWRlci5zZXRVbmlmb3JtKCdvZmZzZXRDb29yZHMnLCBbXHJcblx0XHRcdHRoaXMuaW50ZXJwb2xhdGVkQ2FtWCxcclxuXHRcdFx0dGhpcy5pbnRlcnBvbGF0ZWRDYW1ZLFxyXG5cdFx0XSk7XHJcblx0XHR0aGlzLnNreVNoYWRlci5zZXRVbmlmb3JtKCdtaWxsaXMnLCB0aGlzLm1pbGxpcygpKTtcclxuXHRcdHRoaXMuc2t5TGF5ZXIuc2hhZGVyKHRoaXMuc2t5U2hhZGVyKTtcclxuXHRcdC8vIHRoaXMuZmlsbCgyNTUsIDAsIDApO1xyXG5cdFx0dGhpcy5za3lMYXllci5yZWN0KDAsIDAsIHRoaXMuc2t5TGF5ZXIud2lkdGgsIHRoaXMuc2t5TGF5ZXIuaGVpZ2h0KTtcclxuXHJcblx0XHR0aGlzLmltYWdlKHRoaXMuc2t5TGF5ZXIsIDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcclxuXHJcblx0XHRpZiAodGhpcy53b3JsZCAhPT0gdW5kZWZpbmVkKSB0aGlzLndvcmxkLnJlbmRlcih0aGlzLCB0aGlzLnVwc2NhbGVTaXplKTtcclxuXHJcblx0XHQvLyByZW5kZXIgdGhlIHBsYXllciwgYWxsIGl0ZW1zLCBldGMuXHJcblx0XHQvL3RoaXMucmVuZGVyRW50aXRpZXMoKTtcclxuXHJcblx0XHQvL2RlbGV0ZSBhbnkgcGFydGljbGVzIHRoYXQgaGF2ZSBnb3R0ZW4gdG9vIG9sZFxyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBhcnRpY2xlcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRpZiAodGhpcy5wYXJ0aWNsZXNbaV0uYWdlID4gdGhpcy5wYXJ0aWNsZXNbaV0ubGlmZXNwYW4pIHtcclxuXHRcdFx0XHR0aGlzLnBhcnRpY2xlcy5zcGxpY2UoaSwgMSk7XHJcblx0XHRcdFx0aS0tO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Ly9ubyBvdXRsaW5lIG9uIHBhcnRpY2xlc1xyXG5cdFx0dGhpcy5ub1N0cm9rZSgpO1xyXG5cdFx0Ly9kcmF3IGFsbCBvZiB0aGUgcGFydGljbGVzXHJcblx0XHRmb3IgKGxldCBwYXJ0aWNsZSBvZiB0aGlzLnBhcnRpY2xlcykge1xyXG5cdFx0XHRwYXJ0aWNsZS5yZW5kZXIodGhpcywgdGhpcy51cHNjYWxlU2l6ZSk7XHJcblx0XHR9XHJcblxyXG5cdFx0Zm9yIChsZXQgY2xvdWQgb2YgdGhpcy5jbG91ZHMpIHtcclxuXHRcdFx0Y2xvdWQucmVuZGVyKHRoaXMsIHRoaXMudXBzY2FsZVNpemUpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuc21vb3RoKCk7IC8vZW5hYmxlIGltYWdlIGxlcnBcclxuXHRcdHRoaXMuZHJhd2luZ0NvbnRleHQuZ2xvYmFsQWxwaGEgPSAwLjY7IC8vbWFrZSBpbWFnZSB0cmFuc2x1Y2VudFxyXG5cdFx0VWlBc3NldHMudmlnbmV0dGUucmVuZGVyKHRoaXMsIDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcclxuXHRcdHRoaXMuZHJhd2luZ0NvbnRleHQuZ2xvYmFsQWxwaGEgPSAxLjA7XHJcblx0XHR0aGlzLm5vU21vb3RoKCk7XHJcblxyXG5cdFx0Ly8gZHJhdyB0aGUgaG90IGJhclxyXG5cdFx0aWYgKHRoaXMud29ybGQgIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMud29ybGQuaW52ZW50b3J5LndpZHRoOyBpKyspIHtcclxuXHRcdFx0XHRjb25zdCBjdXJyZW50SXRlbSA9IHRoaXMud29ybGQuaW52ZW50b3J5Lml0ZW1zW2ldO1xyXG5cclxuXHRcdFx0XHRVaUFzc2V0cy51aV9zbG90LnJlbmRlcihcclxuXHRcdFx0XHRcdHRoaXMsXHJcblx0XHRcdFx0XHQyICogdGhpcy51cHNjYWxlU2l6ZSArIDE2ICogaSAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdFx0XHQyICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0XHRcdDE2ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0XHRcdDE2ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0XHQpO1xyXG5cclxuXHRcdFx0XHRpZiAodGhpcy53b3JsZC5pbnZlbnRvcnkuc2VsZWN0ZWRTbG90ID09PSBpKSB7XHJcblx0XHRcdFx0XHRVaUFzc2V0cy51aV9zbG90X3NlbGVjdGVkLnJlbmRlcihcclxuXHRcdFx0XHRcdFx0dGhpcyxcclxuXHRcdFx0XHRcdFx0MiAqIHRoaXMudXBzY2FsZVNpemUgKyAxNiAqIGkgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHRcdFx0XHQyICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0XHRcdFx0MTYgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHRcdFx0XHQxNiAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRVaUFzc2V0cy51aV9zbG90LnJlbmRlcihcclxuXHRcdFx0XHRcdFx0dGhpcyxcclxuXHRcdFx0XHRcdFx0MiAqIHRoaXMudXBzY2FsZVNpemUgKyAxNiAqIGkgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHRcdFx0XHQyICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0XHRcdFx0MTYgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHRcdFx0XHQxNiAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKGN1cnJlbnRJdGVtICE9PSB1bmRlZmluZWQgJiYgY3VycmVudEl0ZW0gIT09IG51bGwpIHtcclxuXHRcdFx0XHRcdHRoaXMuZmlsbCgwKTtcclxuXHRcdFx0XHRcdGlmICh0aGlzLnBpY2tlZFVwU2xvdCA9PT0gaSkge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmRyYXdpbmdDb250ZXh0Lmdsb2JhbEFscGhhID0gMC41O1xyXG5cdFx0XHRcdFx0XHR0aGlzLmZpbGwoMCwgMTI3KTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRJdGVtQXNzZXRzW2N1cnJlbnRJdGVtLml0ZW1dLnJlbmRlcihcclxuXHRcdFx0XHRcdFx0dGhpcyxcclxuXHRcdFx0XHRcdFx0NiAqIHRoaXMudXBzY2FsZVNpemUgKyAxNiAqIGkgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHRcdFx0XHQ2ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0XHRcdFx0OCAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdFx0XHRcdDggKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHRcdFx0KTtcclxuXHJcblx0XHRcdFx0XHRGb250cy50b21fdGh1bWIuZHJhd1RleHQodGhpcywgY3VycmVudEl0ZW0ucXVhbnRpdHkudG9TdHJpbmcoKSwgKC00ICogY3VycmVudEl0ZW0ucXVhbnRpdHkudG9TdHJpbmcoKS5sZW5ndGggKyAxNiAqIChpKzEuMDYyNSkpICogdGhpcy51cHNjYWxlU2l6ZSwgMTEgKiB0aGlzLnVwc2NhbGVTaXplKVxyXG5cdFx0XHRcdFx0Ly8gdGhpcy50ZXh0KFxyXG5cdFx0XHRcdFx0Ly8gXHRjdXJyZW50SXRlbS5xdWFudGl0eSxcclxuXHRcdFx0XHRcdC8vIFx0MTYgKiB0aGlzLnVwc2NhbGVTaXplICsgMTYgKiBpICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0XHRcdC8vIFx0MTYgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHRcdFx0Ly8gKTtcclxuXHJcblx0XHRcdFx0XHR0aGlzLmRyYXdpbmdDb250ZXh0Lmdsb2JhbEFscGhhID0gMS4wO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gZHJhdyB0aGUgY3Vyc29yXHJcblx0XHRcdHRoaXMuZHJhd0N1cnNvcigpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0aGlzLmN1cnJlbnRVaSAhPT0gdW5kZWZpbmVkKVxyXG5cdFx0XHR0aGlzLmN1cnJlbnRVaS5yZW5kZXIodGhpcywgdGhpcy51cHNjYWxlU2l6ZSk7XHJcblxyXG5cdFx0Rm9udHMudG9tX3RodW1iLmRyYXdUZXh0KHRoaXMsIFwiU25vd2VkIEluIHYxLjAuMFwiLCB0aGlzLnVwc2NhbGVTaXplLCB0aGlzLmhlaWdodC02KnRoaXMudXBzY2FsZVNpemUpO1xyXG5cclxuXHRcdC8vIGNvbnNvbGUudGltZUVuZChcImZyYW1lXCIpO1xyXG5cdH1cclxuXHJcblx0d2luZG93UmVzaXplZCgpIHtcclxuXHJcblx0XHRsZXQgcFVwc2NhbGVTaXplID0gdGhpcy51cHNjYWxlU2l6ZTtcclxuXHRcdC8vIGdvIGZvciBhIHNjYWxlIG9mIDw0OCB0aWxlcyBzY3JlZW5cclxuXHRcdHRoaXMudXBzY2FsZVNpemUgPSBNYXRoLm1pbihcclxuXHRcdFx0TWF0aC5jZWlsKHRoaXMud2luZG93V2lkdGggLyA0OCAvIHRoaXMuVElMRV9XSURUSCksXHJcblx0XHRcdE1hdGguY2VpbCh0aGlzLndpbmRvd0hlaWdodCAvIDQ4IC8gdGhpcy5USUxFX0hFSUdIVCksXHJcblx0XHQpO1xyXG5cclxuXHRcdGlmKHRoaXMuY2xvdWRzIT0gdW5kZWZpbmVkICYmIHRoaXMuY2xvdWRzLmxlbmd0aD4wKSB7Ly9zdHJldGNoIGNsb3VkIGxvY2F0aW9ucyBzbyBhcyB0byBub3QgY3JlYXRlIGdhcHNcclxuXHRcdFx0Zm9yKGxldCBjbG91ZCBvZiB0aGlzLmNsb3Vkcykge1xyXG5cdFx0XHRcdGNsb3VkLnggPSB0aGlzLmludGVycG9sYXRlZENhbVggKyAoY2xvdWQueC10aGlzLmludGVycG9sYXRlZENhbVgpKnRoaXMud2luZG93V2lkdGgvdGhpcy53aWR0aC90aGlzLnVwc2NhbGVTaXplKnBVcHNjYWxlU2l6ZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0dGhpcy5yZXNpemVDYW52YXModGhpcy53aW5kb3dXaWR0aCwgdGhpcy53aW5kb3dIZWlnaHQpO1xyXG5cdFx0dGhpcy5za3lMYXllci5yZXNpemVDYW52YXModGhpcy53aW5kb3dXaWR0aCwgdGhpcy53aW5kb3dIZWlnaHQpO1xyXG5cclxuXHRcdFxyXG5cclxuXHRcdHRoaXMuc2t5U2hhZGVyLnNldFVuaWZvcm0oJ3NjcmVlbkRpbWVuc2lvbnMnLCBbXHJcblx0XHRcdCh0aGlzLndpbmRvd1dpZHRoIC8gdGhpcy51cHNjYWxlU2l6ZSkgKiAyLFxyXG5cdFx0XHQodGhpcy53aW5kb3dIZWlnaHQgLyB0aGlzLnVwc2NhbGVTaXplKSAqIDIsXHJcblx0XHRdKTtcclxuXHJcblx0XHRpZiAodGhpcy5jdXJyZW50VWkgIT09IHVuZGVmaW5lZCkgdGhpcy5jdXJyZW50VWkud2luZG93VXBkYXRlKCk7XHJcblx0fVxyXG5cclxuXHRrZXlQcmVzc2VkKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XHJcblx0XHR0aGlzLmtleXNbdGhpcy5rZXlDb2RlXSA9IHRydWU7XHJcblx0XHRmb3IgKGxldCBjb250cm9sIG9mIHRoaXMuY29udHJvbHMpIHtcclxuXHRcdFx0aWYgKGNvbnRyb2wua2V5Ym9hcmQgJiYgY29udHJvbC5rZXlDb2RlID09PSBldmVudC5rZXlDb2RlKVxyXG5cdFx0XHRcdC8vZXZlbnQua2V5Q29kZSBpcyBkZXByZWNhdGVkIGJ1dCBpIGRvbid0IGNhcmVcclxuXHRcdFx0XHRjb250cm9sLm9uUHJlc3NlZCgpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKFxyXG5cdFx0XHR0aGlzLmN1cnJlbnRVaSAhPT0gdW5kZWZpbmVkICYmXHJcblx0XHRcdHRoaXMuY3VycmVudFVpLmlucHV0Qm94ZXMgIT09IHVuZGVmaW5lZFxyXG5cdFx0KSB7XHJcblx0XHRcdGZvciAobGV0IGkgb2YgdGhpcy5jdXJyZW50VWkuaW5wdXRCb3hlcykge1xyXG5cdFx0XHRcdGlmIChpLmxpc3RlbmluZykge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ3Rlc3QzJyk7XHJcblx0XHRcdFx0XHRpLmxpc3RlbmluZyA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0dGhpcy5jb250cm9sc1tpLmluZGV4XS5rZXlDb2RlID0gZXZlbnQua2V5Q29kZTtcclxuXHRcdFx0XHRcdHRoaXMuY29udHJvbHNbaS5pbmRleF0ua2V5Ym9hcmQgPSBmYWxzZTtcclxuXHRcdFx0XHRcdGkudmFsdWUgPSBldmVudC5rZXlDb2RlO1xyXG5cdFx0XHRcdFx0aS5rZXlib2FyZCA9IHRydWU7XHJcblx0XHRcdFx0XHRpLmltYWdlID0gVWlBc3NldHMuYnV0dG9uX3Vuc2VsZWN0ZWQ7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRrZXlSZWxlYXNlZChldmVudDogS2V5Ym9hcmRFdmVudCkge1xyXG5cdFx0dGhpcy5rZXlzW3RoaXMua2V5Q29kZV0gPSBmYWxzZTtcclxuXHRcdGZvciAobGV0IGNvbnRyb2wgb2YgdGhpcy5jb250cm9scykge1xyXG5cdFx0XHRpZiAoY29udHJvbC5rZXlib2FyZCAmJiBjb250cm9sLmtleUNvZGUgPT09IGV2ZW50LmtleUNvZGUpXHJcblx0XHRcdFx0Ly9ldmVudC5rZXlDb2RlIGlzIGRlcHJlY2F0ZWQgYnV0IGkgZG9uJ3QgY2FyZVxyXG5cdFx0XHRcdGNvbnRyb2wub25SZWxlYXNlZCgpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Ly8gd2hlbiBpdCdzIGRyYWdnZWQgdXBkYXRlIHRoZSBzbGlkZXJzXHJcblx0bW91c2VEcmFnZ2VkKCkge1xyXG5cdFx0aWYgKFxyXG5cdFx0XHR0aGlzLmN1cnJlbnRVaSAhPT0gdW5kZWZpbmVkICYmXHJcblx0XHRcdHRoaXMuY3VycmVudFVpLnNsaWRlcnMgIT09IHVuZGVmaW5lZFxyXG5cdFx0KSB7XHJcblx0XHRcdGZvciAoY29uc3QgaSBvZiB0aGlzLmN1cnJlbnRVaS5zbGlkZXJzKSB7XHJcblx0XHRcdFx0aS51cGRhdGVTbGlkZXJQb3NpdGlvbih0aGlzLm1vdXNlWCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdG1vdXNlTW92ZWQoKSB7XHJcblx0XHRpZiAodGhpcy5jdXJyZW50VWkgIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRpZiAodGhpcy5jdXJyZW50VWkuYnV0dG9ucyAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0Zm9yIChjb25zdCBpIG9mIHRoaXMuY3VycmVudFVpLmJ1dHRvbnMpIHtcclxuXHRcdFx0XHRcdGkudXBkYXRlTW91c2VPdmVyKHRoaXMubW91c2VYLCB0aGlzLm1vdXNlWSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmICh0aGlzLmN1cnJlbnRVaS5pbnB1dEJveGVzICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHRmb3IgKGNvbnN0IGkgb2YgdGhpcy5jdXJyZW50VWkuaW5wdXRCb3hlcykge1xyXG5cdFx0XHRcdFx0aS51cGRhdGVNb3VzZU92ZXIodGhpcy5tb3VzZVgsIHRoaXMubW91c2VZKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdG1vdXNlUHJlc3NlZChlOiBNb3VzZUV2ZW50KSB7XHJcblx0XHQvLyBpbWFnZSh1aVNsb3RJbWFnZSwgMip1cHNjYWxlU2l6ZSsxNippKnVwc2NhbGVTaXplLCAyKnVwc2NhbGVTaXplLCAxNip1cHNjYWxlU2l6ZSwgMTYqdXBzY2FsZVNpemUpO1xyXG5cdFx0aWYgKHRoaXMuY3VycmVudFVpICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0dGhpcy5jdXJyZW50VWkubW91c2VQcmVzc2VkKGUuYnV0dG9uKTtcclxuXHRcdFx0cmV0dXJuOyAvLyBhc2pnc2Fka2pmZ0lJU1VTVUVVRVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0aGlzLndvcmxkID09PSB1bmRlZmluZWQpIHJldHVybjtcclxuXHJcblx0XHRpZiAoXHJcblx0XHRcdHRoaXMubW91c2VYID4gMiAqIHRoaXMudXBzY2FsZVNpemUgJiZcclxuXHRcdFx0dGhpcy5tb3VzZVggPFxyXG5cdFx0XHQyICogdGhpcy51cHNjYWxlU2l6ZSArXHJcblx0XHRcdDE2ICogdGhpcy51cHNjYWxlU2l6ZSAqIHRoaXMud29ybGQuaW52ZW50b3J5LndpZHRoICYmXHJcblx0XHRcdHRoaXMubW91c2VZID4gMiAqIHRoaXMudXBzY2FsZVNpemUgJiZcclxuXHRcdFx0dGhpcy5tb3VzZVkgPCAxOCAqIHRoaXMudXBzY2FsZVNpemVcclxuXHRcdCkge1xyXG5cdFx0XHRjb25zdCBjbGlja2VkU2xvdDogbnVtYmVyID0gTWF0aC5mbG9vcihcclxuXHRcdFx0XHQodGhpcy5tb3VzZVggLSAyICogdGhpcy51cHNjYWxlU2l6ZSkgLyAxNiAvIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdCk7XHJcblxyXG5cdFx0XHRpZiAodGhpcy53b3JsZC5pbnZlbnRvcnkucGlja2VkVXBTbG90ID09PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHRpZiAodGhpcy53b3JsZC5pbnZlbnRvcnkuaXRlbXNbY2xpY2tlZFNsb3RdICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHRcdHRoaXMud29ybGQuaW52ZW50b3J5LnBpY2tlZFVwU2xvdCA9IGNsaWNrZWRTbG90O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHQvLyBTd2FwIGNsaWNrZWQgc2xvdCB3aXRoIHRoZSBwaWNrZWQgc2xvdFxyXG5cdFx0XHRcdHRoaXMuY29ubmVjdGlvbi5lbWl0KFxyXG5cdFx0XHRcdFx0J2ludmVudG9yeVN3YXAnLFxyXG5cdFx0XHRcdFx0dGhpcy53b3JsZC5pbnZlbnRvcnkucGlja2VkVXBTbG90LFxyXG5cdFx0XHRcdFx0Y2xpY2tlZFNsb3QsXHJcblx0XHRcdFx0KTtcclxuXHJcblx0XHRcdFx0Ly8gU2V0IHRoZSBwaWNrZWQgdXAgc2xvdCB0byBub3RoaW5nXHJcblx0XHRcdFx0dGhpcy53b3JsZC5pbnZlbnRvcnkucGlja2VkVXBTbG90ID0gdW5kZWZpbmVkO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLndvcmxkLmludmVudG9yeS53b3JsZENsaWNrQ2hlY2sodGhpcy53b3JsZE1vdXNlWCwgdGhpcy53b3JsZE1vdXNlWSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRtb3VzZVJlbGVhc2VkKCkge1xyXG5cdFx0LypcclxuXHRcdGlmKHRoaXMuY3VycmVudFVpICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0dGhpcy5jdXJyZW50VWkubW91c2VSZWxlYXNlZCgpO1xyXG5cdFx0fVxyXG5cdFx0Y29uc3QgcmVsZWFzZWRTbG90OiBudW1iZXIgPSBNYXRoLmZsb29yKFxyXG5cdFx0XHQodGhpcy5tb3VzZVggLSAyICogdGhpcy51cHNjYWxlU2l6ZSkgLyAxNiAvIHRoaXMudXBzY2FsZVNpemVcclxuXHRcdCk7XHJcblxyXG5cdFx0aWYgKHRoaXMucGlja2VkVXBTbG90ICE9PSAtMSkge1xyXG5cdFx0XHRpZiAoXHJcblx0XHRcdFx0dGhpcy5tb3VzZVggPiAyICogdGhpcy51cHNjYWxlU2l6ZSAmJlxyXG5cdFx0XHRcdHRoaXMubW91c2VYIDxcclxuXHRcdFx0XHRcdDIgKiB0aGlzLnVwc2NhbGVTaXplICtcclxuXHRcdFx0XHRcdFx0MTYgKiB0aGlzLnVwc2NhbGVTaXplICogdGhpcy5ob3RCYXIubGVuZ3RoICYmXHJcblx0XHRcdFx0dGhpcy5tb3VzZVkgPiAyICogdGhpcy51cHNjYWxlU2l6ZSAmJlxyXG5cdFx0XHRcdHRoaXMubW91c2VZIDwgMTggKiB0aGlzLnVwc2NhbGVTaXplXHJcblx0XHRcdCkge1xyXG5cdFx0XHRcdC8vIE1ha2Ugc3VyZSB0aGF0IHRoZSBzbG90IHRoYXQgdGhlIGN1cnNvciB3YXMgcmVsZWFzZWQgd2FzIG5vdCB0aGUgc2xvdCB0aGF0IHdhcyBzZWxlY3RlZFxyXG5cdFx0XHRcdGlmIChyZWxlYXNlZFNsb3QgPT09IHRoaXMucGlja2VkVXBTbG90KSByZXR1cm47XHJcblxyXG5cdFx0XHRcdC8vIFN3YXAgdGhlIHBpY2tlZCB1cCBzbG90IHdpdGggdGhlIHNsb3QgdGhlIG1vdXNlIHdhcyByZWxlYXNlZCBvblxyXG5cdFx0XHRcdFt0aGlzLmhvdEJhclt0aGlzLnBpY2tlZFVwU2xvdF0sIHRoaXMuaG90QmFyW3JlbGVhc2VkU2xvdF1dID0gW1xyXG5cdFx0XHRcdFx0dGhpcy5ob3RCYXJbcmVsZWFzZWRTbG90XSxcclxuXHRcdFx0XHRcdHRoaXMuaG90QmFyW3RoaXMucGlja2VkVXBTbG90XSxcclxuXHRcdFx0XHRdO1xyXG5cclxuXHRcdFx0XHR0aGlzLnBpY2tlZFVwU2xvdCA9IC0xO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMuaG90QmFyW3RoaXMucGlja2VkVXBTbG90XSA9IHVuZGVmaW5lZDtcclxuXHRcdFx0XHR0aGlzLnBpY2tlZFVwU2xvdCA9IC0xO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0ICovXHJcblx0fVxyXG5cclxuXHRtb3VzZVdoZWVsKGV2ZW50OiBhbnkpIHtcclxuXHRcdC8vbW91c2VFdmVudCBhcHBhcmVudGx5IGRvZXNuJ3QgaGF2ZSBhIGRlbHRhIHByb3BlcnR5IHNvb29vbyBpZGsgd2hhdCB0byBkbyBzb3JyeSBmb3IgdGhlIGFueSB0eXBlXHJcblx0XHRpZiAoXHJcblx0XHRcdHRoaXMuY3VycmVudFVpICE9PSB1bmRlZmluZWQgJiZcclxuXHRcdFx0dGhpcy5jdXJyZW50VWkuc2Nyb2xsICE9PSB1bmRlZmluZWRcclxuXHRcdCkge1xyXG5cdFx0XHR0aGlzLmN1cnJlbnRVaS5zY3JvbGwgKz0gZXZlbnQuZGVsdGEgLyAxMDtcclxuXHRcdFx0dGhpcy5jdXJyZW50VWkuc2Nyb2xsID0gdGhpcy5jb25zdHJhaW4oXHJcblx0XHRcdFx0dGhpcy5jdXJyZW50VWkuc2Nyb2xsLFxyXG5cdFx0XHRcdHRoaXMuY3VycmVudFVpLm1pblNjcm9sbCxcclxuXHRcdFx0XHR0aGlzLmN1cnJlbnRVaS5tYXhTY3JvbGwsXHJcblx0XHRcdCk7XHJcblx0XHRcdGNvbnNvbGUubG9nKFxyXG5cdFx0XHRcdGBTY3JvbGw6ICR7dGhpcy5jdXJyZW50VWkuc2Nyb2xsfSwgTWluOiAke3RoaXMuY3VycmVudFVpLm1pblNjcm9sbH0sIE1heDogJHt0aGlzLmN1cnJlbnRVaS5tYXhTY3JvbGx9YCxcclxuXHRcdFx0KTtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHR0aGlzLndvcmxkLmludmVudG9yeS5zZWxlY3RlZFNsb3QgKz0gTWF0aC5mbG9vcihldmVudC5kZWx0YS8xMDApXHJcblx0XHRcdHRoaXMud29ybGQuaW52ZW50b3J5LnNlbGVjdGVkU2xvdCA9IHRoaXMud29ybGQuaW52ZW50b3J5LnNlbGVjdGVkU2xvdCV0aGlzLndvcmxkLmludmVudG9yeS53aWR0aDtcclxuXHRcdFx0aWYodGhpcy53b3JsZC5pbnZlbnRvcnkuc2VsZWN0ZWRTbG90PDApIHRoaXMud29ybGQuaW52ZW50b3J5LnNlbGVjdGVkU2xvdCArPSB0aGlzLndvcmxkLmludmVudG9yeS53aWR0aFxyXG5cdFx0XHRjb25zb2xlLmxvZyh0aGlzLndvcmxkLmludmVudG9yeS5zZWxlY3RlZFNsb3QpXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRtb3ZlQ2FtZXJhKCkge1xyXG5cdFx0dGhpcy5pbnRlcnBvbGF0ZWRDYW1YID1cclxuXHRcdFx0dGhpcy5wQ2FtWCArXHJcblx0XHRcdCh0aGlzLmNhbVggLSB0aGlzLnBDYW1YKSAqIHRoaXMuYW1vdW50U2luY2VMYXN0VGljayArXHJcblx0XHRcdCh0aGlzLm5vaXNlKHRoaXMubWlsbGlzKCkgLyAyMDApIC0gMC41KSAqIHRoaXMuc2NyZWVuc2hha2VBbW91bnQ7XHJcblx0XHR0aGlzLmludGVycG9sYXRlZENhbVkgPVxyXG5cdFx0XHR0aGlzLnBDYW1ZICtcclxuXHRcdFx0KHRoaXMuY2FtWSAtIHRoaXMucENhbVkpICogdGhpcy5hbW91bnRTaW5jZUxhc3RUaWNrICtcclxuXHRcdFx0KHRoaXMubm9pc2UoMCwgdGhpcy5taWxsaXMoKSAvIDIwMCkgLSAwLjUpICogdGhpcy5zY3JlZW5zaGFrZUFtb3VudDtcclxuXHR9XHJcblxyXG5cdGRvVGlja3MoKSB7XHJcblx0XHQvLyBpbmNyZWFzZSB0aGUgdGltZSBzaW5jZSBhIHRpY2sgaGFzIGhhcHBlbmVkIGJ5IGRlbHRhVGltZSwgd2hpY2ggaXMgYSBidWlsdC1pbiBwNS5qcyB2YWx1ZVxyXG5cdFx0dGhpcy5tc1NpbmNlVGljayArPSB0aGlzLmRlbHRhVGltZTtcclxuXHJcblx0XHQvLyBkZWZpbmUgYSB0ZW1wb3JhcnkgdmFyaWFibGUgY2FsbGVkIHRpY2tzVGhpc0ZyYW1lIC0gdGhpcyBpcyB1c2VkIHRvIGtlZXAgdHJhY2sgb2YgaG93IG1hbnkgdGlja3MgaGF2ZSBiZWVuIGNhbGN1bGF0ZWQgd2l0aGluIHRoZSBkdXJhdGlvbiBvZiB0aGUgY3VycmVudCBmcmFtZS4gIEFzIGxvbmcgYXMgdGhpcyB2YWx1ZSBpcyBsZXNzIHRoYW4gdGhlIGZvcmdpdmVuZXNzQ291bnQgdmFyaWFibGUsIGl0IGNvbnRpbnVlcyB0byBjYWxjdWxhdGUgdGlja3MgYXMgbmVjZXNzYXJ5LlxyXG5cdFx0bGV0IHRpY2tzVGhpc0ZyYW1lID0gMDtcclxuXHRcdHdoaWxlIChcclxuXHRcdFx0dGhpcy5tc1NpbmNlVGljayA+IHRoaXMubXNQZXJUaWNrICYmXHJcblx0XHRcdHRpY2tzVGhpc0ZyYW1lICE9PSB0aGlzLmZvcmdpdmVuZXNzQ291bnRcclxuXHRcdCkge1xyXG5cdFx0XHQvLyBjb25zb2xlLnRpbWUoXCJ0aWNrXCIpO1xyXG5cdFx0XHRpZiAodGhpcy53b3JsZCAhPT0gdW5kZWZpbmVkKSB0aGlzLmRvVGljaygpO1xyXG5cdFx0XHQvLyBjb25zb2xlLnRpbWVFbmQoXCJ0aWNrXCIpO1xyXG5cdFx0XHR0aGlzLm1zU2luY2VUaWNrIC09IHRoaXMubXNQZXJUaWNrO1xyXG5cdFx0XHR0aWNrc1RoaXNGcmFtZSsrO1xyXG5cdFx0fVxyXG5cdFx0aWYgKHRpY2tzVGhpc0ZyYW1lID09PSB0aGlzLmZvcmdpdmVuZXNzQ291bnQpIHtcclxuXHRcdFx0dGhpcy5tc1NpbmNlVGljayA9IDA7XHJcblx0XHRcdGNvbnNvbGUud2FybihcclxuXHRcdFx0XHRcImxhZyBzcGlrZSBkZXRlY3RlZCwgdGljayBjYWxjdWxhdGlvbnMgY291bGRuJ3Qga2VlcCB1cFwiLFxyXG5cdFx0XHQpO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5hbW91bnRTaW5jZUxhc3RUaWNrID0gdGhpcy5tc1NpbmNlVGljayAvIHRoaXMubXNQZXJUaWNrO1xyXG5cdH1cclxuXHJcblx0ZG9UaWNrKCkge1xyXG5cdFx0aWYodGhpcy53b3JsZCAhPT0gdW5kZWZpbmVkICYmIHRoaXMud29ybGQudGlsZUVudGl0aWVzICE9PSB1bmRlZmluZWQpIHsvL3RpbGUgZW50aXR5IHBhcnRpY2xlc1xyXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IDEgKiB0aGlzLnBhcnRpY2xlTXVsdGlwbGllcjsgaSsrKSB7XHJcblx0XHRcdFx0bGV0IGsgPSBPYmplY3Qua2V5cyh0aGlzLndvcmxkLnRpbGVFbnRpdGllcyk7XHJcblx0XHRcdFx0bGV0IHIgPSB0aGlzLndvcmxkLnRpbGVFbnRpdGllc1trW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSprLmxlbmd0aCldXTtcclxuXHRcdFx0XHRpZihyLnR5cGVfPT09VGlsZUVudGl0aWVzLlRyZWUpIHtcclxuXHRcdFx0XHRcdGxldCB0ID0gci5jb3ZlcmVkVGlsZXNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKnIuY292ZXJlZFRpbGVzLmxlbmd0aCldO1xyXG5cdFx0XHRcdFx0dGhpcy5wYXJ0aWNsZXMucHVzaChuZXcgQ29sb3JQYXJ0aWNsZShcIiMzNDg5NjVcIiwgTWF0aC5yYW5kb20oKSowLjErMC4xLCAyMCwgdCV0aGlzLndvcmxkLndpZHRoK01hdGgucmFuZG9tKCksIE1hdGguZmxvb3IodC90aGlzLndvcmxkLndpZHRoKStNYXRoLnJhbmRvbSgpLCAwLjEqKE1hdGgucmFuZG9tKCktMC41KSwgMC4wNiooTWF0aC5yYW5kb20oKS0wLjcpLCBmYWxzZSkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Zm9yIChsZXQgcGFydGljbGUgb2YgdGhpcy5wYXJ0aWNsZXMpIHtcclxuXHRcdFx0cGFydGljbGUudGljaygpO1xyXG5cdFx0fVxyXG5cdFx0Zm9yIChsZXQgY2xvdWQgb2YgdGhpcy5jbG91ZHMpIHtcclxuXHRcdFx0Y2xvdWQudGljaygpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKHRoaXMud29ybGQucGxheWVyID09PSB1bmRlZmluZWQpIHJldHVybjtcclxuXHRcdGlmICh0aGlzLndvcmxkLnBsYXllciA9PT0gdW5kZWZpbmVkKSByZXR1cm47XHJcblx0XHR0aGlzLndvcmxkLnBsYXllci5rZXlib2FyZElucHV0KCk7XHJcblx0XHR0aGlzLndvcmxkLnBsYXllci5hcHBseUdyYXZpdHlBbmREcmFnKCk7XHJcblx0XHR0aGlzLndvcmxkLnBsYXllci5hcHBseVZlbG9jaXR5QW5kQ29sbGlkZSgpO1xyXG5cclxuXHRcdHRoaXMucENhbVggPSB0aGlzLmNhbVg7XHJcblx0XHR0aGlzLnBDYW1ZID0gdGhpcy5jYW1ZO1xyXG5cdFx0dGhpcy5kZXNpcmVkQ2FtWCA9XHJcblx0XHRcdHRoaXMud29ybGQucGxheWVyLnggK1xyXG5cdFx0XHR0aGlzLndvcmxkLnBsYXllci53aWR0aCAvIDIgLVxyXG5cdFx0XHR0aGlzLndpZHRoIC8gMiAvIHRoaXMuVElMRV9XSURUSCAvIHRoaXMudXBzY2FsZVNpemUgK1xyXG5cdFx0XHR0aGlzLndvcmxkLnBsYXllci54VmVsICogNDA7XHJcblx0XHR0aGlzLmRlc2lyZWRDYW1ZID1cclxuXHRcdFx0dGhpcy53b3JsZC5wbGF5ZXIueSArXHJcblx0XHRcdHRoaXMud29ybGQucGxheWVyLmhlaWdodCAvIDIgLVxyXG5cdFx0XHR0aGlzLmhlaWdodCAvIDIgLyB0aGlzLlRJTEVfSEVJR0hUIC8gdGhpcy51cHNjYWxlU2l6ZSArXHJcblx0XHRcdHRoaXMud29ybGQucGxheWVyLnlWZWwgKiAyMDtcclxuXHRcdHRoaXMuY2FtWCA9ICh0aGlzLmRlc2lyZWRDYW1YICsgdGhpcy5jYW1YICogMjQpIC8gMjU7XHJcblx0XHR0aGlzLmNhbVkgPSAodGhpcy5kZXNpcmVkQ2FtWSArIHRoaXMuY2FtWSAqIDI0KSAvIDI1O1xyXG5cclxuXHRcdHRoaXMuc2NyZWVuc2hha2VBbW91bnQgKj0gMC44O1xyXG5cclxuXHRcdGlmICh0aGlzLmNhbVggPCAwKSB7XHJcblx0XHRcdHRoaXMuY2FtWCA9IDA7XHJcblx0XHR9IGVsc2UgaWYgKFxyXG5cdFx0XHR0aGlzLmNhbVggPlxyXG5cdFx0XHR0aGlzLndvcmxkV2lkdGggLSB0aGlzLndpZHRoIC8gdGhpcy51cHNjYWxlU2l6ZSAvIHRoaXMuVElMRV9XSURUSFxyXG5cdFx0KSB7XHJcblx0XHRcdHRoaXMuY2FtWCA9XHJcblx0XHRcdFx0dGhpcy53b3JsZFdpZHRoIC1cclxuXHRcdFx0XHR0aGlzLndpZHRoIC8gdGhpcy51cHNjYWxlU2l6ZSAvIHRoaXMuVElMRV9XSURUSDtcclxuXHRcdH1cclxuXHRcdGlmIChcclxuXHRcdFx0dGhpcy5jYW1ZID5cclxuXHRcdFx0dGhpcy53b3JsZEhlaWdodCAtIHRoaXMuaGVpZ2h0IC8gdGhpcy51cHNjYWxlU2l6ZSAvIHRoaXMuVElMRV9IRUlHSFRcclxuXHRcdCkge1xyXG5cdFx0XHR0aGlzLmNhbVkgPVxyXG5cdFx0XHRcdHRoaXMud29ybGRIZWlnaHQgLVxyXG5cdFx0XHRcdHRoaXMuaGVpZ2h0IC8gdGhpcy51cHNjYWxlU2l6ZSAvIHRoaXMuVElMRV9IRUlHSFQ7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZm9yIChjb25zdCBpdGVtIG9mIHRoaXMuaXRlbXMpIHtcclxuXHRcdC8vICAgICBpdGVtLmdvVG93YXJkc1BsYXllcigpO1xyXG5cdFx0Ly8gICAgIGl0ZW0uY29tYmluZVdpdGhOZWFySXRlbXMoKTtcclxuXHRcdC8vICAgICBpdGVtLmFwcGx5R3Jhdml0eUFuZERyYWcoKTtcclxuXHRcdC8vICAgICBpdGVtLmFwcGx5VmVsb2NpdHlBbmRDb2xsaWRlKCk7XHJcblx0XHQvLyB9XHJcblx0XHQvL1xyXG5cdFx0Ly8gZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLml0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcblx0XHQvLyAgICAgaWYgKHRoaXMuaXRlbXNbaV0uZGVsZXRlZCA9PT0gdHJ1ZSkge1xyXG5cdFx0Ly8gICAgICAgICB0aGlzLml0ZW1zLnNwbGljZShpLCAxKTtcclxuXHRcdC8vICAgICAgICAgaS0tO1xyXG5cdFx0Ly8gICAgIH1cclxuXHRcdC8vIH1cclxuXHR9XHJcblxyXG5cdHVpRnJhbWVSZWN0KHg6IG51bWJlciwgeTogbnVtYmVyLCB3OiBudW1iZXIsIGg6IG51bWJlcikge1xyXG5cdFx0Ly8gc2V0IHRoZSBjb29yZHMgYW5kIGRpbWVuc2lvbnMgdG8gcm91bmQgdG8gdGhlIG5lYXJlc3QgdW4tdXBzY2FsZWQgcGl4ZWxcclxuXHRcdHggPSBNYXRoLnJvdW5kKHggLyB0aGlzLnVwc2NhbGVTaXplKSAqIHRoaXMudXBzY2FsZVNpemU7XHJcblx0XHR5ID0gTWF0aC5yb3VuZCh5IC8gdGhpcy51cHNjYWxlU2l6ZSkgKiB0aGlzLnVwc2NhbGVTaXplO1xyXG5cdFx0dyA9IE1hdGgucm91bmQodyAvIHRoaXMudXBzY2FsZVNpemUpICogdGhpcy51cHNjYWxlU2l6ZTtcclxuXHRcdGggPSBNYXRoLnJvdW5kKGggLyB0aGlzLnVwc2NhbGVTaXplKSAqIHRoaXMudXBzY2FsZVNpemU7XHJcblxyXG5cdFx0Ly8gY29ybmVyc1xyXG5cdFx0VWlBc3NldHMudWlfZnJhbWUucmVuZGVyUGFydGlhbChcclxuXHRcdFx0dGhpcyxcclxuXHRcdFx0eCxcclxuXHRcdFx0eSxcclxuXHRcdFx0NyAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHQwLFxyXG5cdFx0XHQwLFxyXG5cdFx0XHQ3LFxyXG5cdFx0XHQ3LFxyXG5cdFx0KTtcclxuXHRcdFVpQXNzZXRzLnVpX2ZyYW1lLnJlbmRlclBhcnRpYWwoXHJcblx0XHRcdHRoaXMsXHJcblx0XHRcdHggKyB3IC0gNyAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdHksXHJcblx0XHRcdDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHQ3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0OCxcclxuXHRcdFx0MCxcclxuXHRcdFx0NyxcclxuXHRcdFx0NyxcclxuXHRcdCk7XHJcblx0XHRVaUFzc2V0cy51aV9mcmFtZS5yZW5kZXJQYXJ0aWFsKFxyXG5cdFx0XHR0aGlzLFxyXG5cdFx0XHR4LFxyXG5cdFx0XHR5ICsgaCAtIDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHQ3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0NyAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdDAsXHJcblx0XHRcdDgsXHJcblx0XHRcdDcsXHJcblx0XHRcdDcsXHJcblx0XHQpO1xyXG5cdFx0VWlBc3NldHMudWlfZnJhbWUucmVuZGVyUGFydGlhbChcclxuXHRcdFx0dGhpcyxcclxuXHRcdFx0eCArIHcgLSA3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0eSArIGggLSA3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0NyAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHQ4LFxyXG5cdFx0XHQ4LFxyXG5cdFx0XHQ3LFxyXG5cdFx0XHQ3LFxyXG5cdFx0KTtcclxuXHJcblx0XHQvLyB0b3AgYW5kIGJvdHRvbVxyXG5cdFx0VWlBc3NldHMudWlfZnJhbWUucmVuZGVyUGFydGlhbChcclxuXHRcdFx0dGhpcyxcclxuXHRcdFx0eCArIDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHR5LFxyXG5cdFx0XHR3IC0gMTQgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHQ3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0NyxcclxuXHRcdFx0MCxcclxuXHRcdFx0MSxcclxuXHRcdFx0NyxcclxuXHRcdCk7XHJcblx0XHRVaUFzc2V0cy51aV9mcmFtZS5yZW5kZXJQYXJ0aWFsKFxyXG5cdFx0XHR0aGlzLFxyXG5cdFx0XHR4ICsgNyAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdHkgKyBoIC0gNyAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdHcgLSAxNCAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHQ3LFxyXG5cdFx0XHQ4LFxyXG5cdFx0XHQxLFxyXG5cdFx0XHQ3LFxyXG5cdFx0KTtcclxuXHJcblx0XHQvLyBsZWZ0IGFuZCByaWdodFxyXG5cdFx0VWlBc3NldHMudWlfZnJhbWUucmVuZGVyUGFydGlhbChcclxuXHRcdFx0dGhpcyxcclxuXHRcdFx0eCxcclxuXHRcdFx0eSArIDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHQ3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0aCAtIDE0ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0MCxcclxuXHRcdFx0NyxcclxuXHRcdFx0NyxcclxuXHRcdFx0MSxcclxuXHRcdCk7XHJcblx0XHRVaUFzc2V0cy51aV9mcmFtZS5yZW5kZXJQYXJ0aWFsKFxyXG5cdFx0XHR0aGlzLFxyXG5cdFx0XHR4ICsgdyAtIDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHR5ICsgNyAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHRoIC0gMTQgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHQ4LFxyXG5cdFx0XHQ3LFxyXG5cdFx0XHQ3LFxyXG5cdFx0XHQxLFxyXG5cdFx0KTtcclxuXHJcblx0XHQvLyBjZW50ZXJcclxuXHRcdFVpQXNzZXRzLnVpX2ZyYW1lLnJlbmRlclBhcnRpYWwoXHJcblx0XHRcdHRoaXMsXHJcblx0XHRcdHggKyA3ICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0eSArIDcgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHR3IC0gMTQgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHRoIC0gMTQgKiB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHQ3LFxyXG5cdFx0XHQ3LFxyXG5cdFx0XHQxLFxyXG5cdFx0XHQxLFxyXG5cdFx0KTtcclxuXHR9XHJcblxyXG5cdC8qXHJcbiAgIC8kJCQkJCQkICAvJCQgICAgICAgICAgICAgICAgICAgICAgICAgICAvJCRcclxuICB8ICQkX18gICQkfCAkJCAgICAgICAgICAgICAgICAgICAgICAgICAgfF9fL1xyXG4gIHwgJCQgIFxcICQkfCAkJCQkJCQkICAvJCQgICAvJCQgIC8kJCQkJCQkIC8kJCAgLyQkJCQkJCQgIC8kJCQkJCQkIC8kJFxyXG4gIHwgJCQkJCQkJC98ICQkX18gICQkfCAkJCAgfCAkJCAvJCRfX19fXy98ICQkIC8kJF9fX19fLyAvJCRfX19fXy98X18vXHJcbiAgfCAkJF9fX18vIHwgJCQgIFxcICQkfCAkJCAgfCAkJHwgICQkJCQkJCB8ICQkfCAkJCAgICAgIHwgICQkJCQkJFxyXG4gIHwgJCQgICAgICB8ICQkICB8ICQkfCAkJCAgfCAkJCBcXF9fX18gICQkfCAkJHwgJCQgICAgICAgXFxfX19fICAkJCAvJCRcclxuICB8ICQkICAgICAgfCAkJCAgfCAkJHwgICQkJCQkJCQgLyQkJCQkJCQvfCAkJHwgICQkJCQkJCQgLyQkJCQkJCQvfF9fL1xyXG4gIHxfXy8gICAgICB8X18vICB8X18vIFxcX19fXyAgJCR8X19fX19fXy8gfF9fLyBcXF9fX19fX18vfF9fX19fX18vXHJcblx0XHRcdFx0XHQgICAvJCQgIHwgJCRcclxuXHRcdFx0XHRcdCAgfCAgJCQkJCQkL1xyXG5cdFx0XHRcdFx0ICAgXFxfX19fX18vXHJcbiAgKi9cclxuXHJcblx0Ly8gdGhpcyBjbGFzcyBob2xkcyBhbiBheGlzLWFsaWduZWQgcmVjdGFuZ2xlIGFmZmVjdGVkIGJ5IGdyYXZpdHksIGRyYWcsIGFuZCBjb2xsaXNpb25zIHdpdGggdGlsZXMuXHJcblxyXG5cdHJlY3RWc1JheShcclxuXHRcdHJlY3RYPzogYW55LFxyXG5cdFx0cmVjdFk/OiBhbnksXHJcblx0XHRyZWN0Vz86IGFueSxcclxuXHRcdHJlY3RIPzogYW55LFxyXG5cdFx0cmF5WD86IGFueSxcclxuXHRcdHJheVk/OiBhbnksXHJcblx0XHRyYXlXPzogYW55LFxyXG5cdFx0cmF5SD86IGFueSxcclxuXHQpIHtcclxuXHRcdC8vIHRoaXMgcmF5IGlzIGFjdHVhbGx5IGEgbGluZSBzZWdtZW50IG1hdGhlbWF0aWNhbGx5LCBidXQgaXQncyBjb21tb24gdG8gc2VlIHBlb3BsZSByZWZlciB0byBzaW1pbGFyIGNoZWNrcyBhcyByYXktY2FzdHMsIHNvIGZvciB0aGUgZHVyYXRpb24gb2YgdGhlIGRlZmluaXRpb24gb2YgdGhpcyBmdW5jdGlvbiwgcmF5IGNhbiBiZSBhc3N1bWVkIHRvIG1lYW4gdGhlIHNhbWUgYXMgbGluZSBzZWdtZW50LlxyXG5cclxuXHRcdC8vIGlmIHRoZSByYXkgZG9lc24ndCBoYXZlIGEgbGVuZ3RoLCB0aGVuIGl0IGNhbid0IGhhdmUgZW50ZXJlZCB0aGUgcmVjdGFuZ2xlLiAgVGhpcyBhc3N1bWVzIHRoYXQgdGhlIG9iamVjdHMgZG9uJ3Qgc3RhcnQgaW4gY29sbGlzaW9uLCBvdGhlcndpc2UgdGhleSdsbCBiZWhhdmUgc3RyYW5nZWx5XHJcblx0XHRpZiAocmF5VyA9PT0gMCAmJiByYXlIID09PSAwKSB7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBjYWxjdWxhdGUgaG93IGZhciBhbG9uZyB0aGUgcmF5IGVhY2ggc2lkZSBvZiB0aGUgcmVjdGFuZ2xlIGludGVyc2VjdHMgd2l0aCBpdCAoZWFjaCBzaWRlIGlzIGV4dGVuZGVkIG91dCBpbmZpbml0ZWx5IGluIGJvdGggZGlyZWN0aW9ucylcclxuXHRcdGNvbnN0IHRvcEludGVyc2VjdGlvbiA9IChyZWN0WSAtIHJheVkpIC8gcmF5SDtcclxuXHRcdGNvbnN0IGJvdHRvbUludGVyc2VjdGlvbiA9IChyZWN0WSArIHJlY3RIIC0gcmF5WSkgLyByYXlIO1xyXG5cdFx0Y29uc3QgbGVmdEludGVyc2VjdGlvbiA9IChyZWN0WCAtIHJheVgpIC8gcmF5VztcclxuXHRcdGNvbnN0IHJpZ2h0SW50ZXJzZWN0aW9uID0gKHJlY3RYICsgcmVjdFcgLSByYXlYKSAvIHJheVc7XHJcblxyXG5cdFx0aWYgKFxyXG5cdFx0XHRpc05hTih0b3BJbnRlcnNlY3Rpb24pIHx8XHJcblx0XHRcdGlzTmFOKGJvdHRvbUludGVyc2VjdGlvbikgfHxcclxuXHRcdFx0aXNOYU4obGVmdEludGVyc2VjdGlvbikgfHxcclxuXHRcdFx0aXNOYU4ocmlnaHRJbnRlcnNlY3Rpb24pXHJcblx0XHQpIHtcclxuXHRcdFx0Ly8geW91IGhhdmUgdG8gdXNlIHRoZSBKUyBmdW5jdGlvbiBpc05hTigpIHRvIGNoZWNrIGlmIGEgdmFsdWUgaXMgTmFOIGJlY2F1c2UgYm90aCBOYU49PU5hTiBhbmQgTmFOPT09TmFOIGFyZSBmYWxzZS5cclxuXHRcdFx0Ly8gaWYgYW55IG9mIHRoZXNlIHZhbHVlcyBhcmUgTmFOLCBubyBjb2xsaXNpb24gaGFzIG9jY3VycmVkXHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBjYWxjdWxhdGUgdGhlIG5lYXJlc3QgYW5kIGZhcnRoZXN0IGludGVyc2VjdGlvbnMgZm9yIGJvdGggeCBhbmQgeVxyXG5cdFx0Y29uc3QgbmVhclggPSB0aGlzLm1pbihsZWZ0SW50ZXJzZWN0aW9uLCByaWdodEludGVyc2VjdGlvbik7XHJcblx0XHRjb25zdCBmYXJYID0gdGhpcy5tYXgobGVmdEludGVyc2VjdGlvbiwgcmlnaHRJbnRlcnNlY3Rpb24pO1xyXG5cdFx0Y29uc3QgbmVhclkgPSB0aGlzLm1pbih0b3BJbnRlcnNlY3Rpb24sIGJvdHRvbUludGVyc2VjdGlvbik7XHJcblx0XHRjb25zdCBmYXJZID0gdGhpcy5tYXgodG9wSW50ZXJzZWN0aW9uLCBib3R0b21JbnRlcnNlY3Rpb24pO1xyXG5cclxuXHRcdGlmIChuZWFyWCA+IGZhclkgfHwgbmVhclkgPiBmYXJYKSB7XHJcblx0XHRcdC8vIHRoaXMgbXVzdCBtZWFuIHRoYXQgdGhlIGxpbmUgdGhhdCBtYWtlcyB1cCB0aGUgbGluZSBzZWdtZW50IGRvZXNuJ3QgcGFzcyB0aHJvdWdoIHRoZSByYXlcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChmYXJYIDwgMCB8fCBmYXJZIDwgMCkge1xyXG5cdFx0XHQvLyB0aGUgaW50ZXJzZWN0aW9uIGlzIGhhcHBlbmluZyBiZWZvcmUgdGhlIHJheSBzdGFydHMsIHNvIHRoZSByYXkgaXMgcG9pbnRpbmcgYXdheSBmcm9tIHRoZSB0cmlhbmdsZVxyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gY2FsY3VsYXRlIHdoZXJlIHRoZSBwb3RlbnRpYWwgY29sbGlzaW9uIGNvdWxkIGJlXHJcblx0XHRjb25zdCBuZWFyQ29sbGlzaW9uUG9pbnQgPSB0aGlzLm1heChuZWFyWCwgbmVhclkpO1xyXG5cclxuXHRcdGlmIChuZWFyWCA+IDEgfHwgbmVhclkgPiAxKSB7XHJcblx0XHRcdC8vIHRoZSBpbnRlcnNlY3Rpb24gaGFwcGVucyBhZnRlciB0aGUgcmF5KGxpbmUgc2VnbWVudCkgZW5kc1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKG5lYXJYID09PSBuZWFyQ29sbGlzaW9uUG9pbnQpIHtcclxuXHRcdFx0Ly8gaXQgbXVzdCBoYXZlIGNvbGxpZGVkIG9uIGVpdGhlciB0aGUgbGVmdCBvciB0aGUgcmlnaHQhIG5vdyB3aGljaD9cclxuXHRcdFx0aWYgKGxlZnRJbnRlcnNlY3Rpb24gPT09IG5lYXJYKSB7XHJcblx0XHRcdFx0Ly8gSXQgbXVzdCBoYXZlIGNvbGxpZGVkIG9uIHRoZSBsZWZ0ISAgUmV0dXJuIHRoZSBjb2xsaXNpb24gbm9ybWFsIFstMSwgMF1cclxuXHRcdFx0XHRyZXR1cm4gWy0xLCAwLCBuZWFyQ29sbGlzaW9uUG9pbnRdO1xyXG5cdFx0XHR9XHJcblx0XHRcdC8vIElmIGl0IGRpZG4ndCBjb2xsaWRlIG9uIHRoZSBsZWZ0LCBpdCBtdXN0IGhhdmUgY29sbGlkZWQgb24gdGhlIHJpZ2h0LiAgUmV0dXJuIHRoZSBjb2xsaXNpb24gbm9ybWFsIFsxLCAwXVxyXG5cdFx0XHRyZXR1cm4gWzEsIDAsIG5lYXJDb2xsaXNpb25Qb2ludF07XHJcblx0XHR9XHJcblx0XHQvLyBJZiBpdCBkaWRuJ3QgY29sbGlkZSBvbiB0aGUgbGVmdCBvciByaWdodCwgaXQgbXVzdCBoYXZlIGNvbGxpZGVkIG9uIGVpdGhlciB0aGUgdG9wIG9yIHRoZSBib3R0b20hIG5vdyB3aGljaD9cclxuXHRcdGlmICh0b3BJbnRlcnNlY3Rpb24gPT09IG5lYXJZKSB7XHJcblx0XHRcdC8vIEl0IG11c3QgaGF2ZSBjb2xsaWRlZCBvbiB0aGUgdG9wISAgUmV0dXJuIHRoZSBjb2xsaXNpb24gbm9ybWFsIFswLCAtMV1cclxuXHRcdFx0cmV0dXJuIFswLCAtMSwgbmVhckNvbGxpc2lvblBvaW50XTtcclxuXHRcdH1cclxuXHRcdC8vIElmIGl0IGRpZG4ndCBjb2xsaWRlIG9uIHRoZSB0b3AsIGl0IG11c3QgaGF2ZSBjb2xsaWRlZCBvbiB0aGUgYm90dG9tLiAgUmV0dXJuIHRoZSBjb2xsaXNpb24gbm9ybWFsIFswLCAxXVxyXG5cdFx0cmV0dXJuIFswLCAxLCBuZWFyQ29sbGlzaW9uUG9pbnRdO1xyXG5cclxuXHRcdC8vIG91dHB1dCBpZiBubyBjb2xsaXNpb246IGZhbHNlXHJcblx0XHQvLyBvdXRwdXQgaWYgY29sbGlzaW9uOiBbY29sbGlzaW9uIG5vcm1hbCBYLCBjb2xsaXNpb24gbm9ybWFsIFksIG5lYXJDb2xsaXNpb25Qb2ludF1cclxuXHRcdC8vICAgICAgICAgICAgICAgICAgICAgICAgIC0xIHRvIDEgICAgICAgICAgICAgIC0xIHRvIDEgICAgICAgICAgICAwIHRvIDFcclxuXHR9XHJcblxyXG5cdHJlbmRlckVudGl0aWVzKCkge1xyXG5cdFx0Ly8gZHJhdyBwbGF5ZXJcclxuXHRcdC8vIHRoaXMuZmlsbCgyNTUsIDAsIDApO1xyXG5cdFx0Ly8gdGhpcy5ub1N0cm9rZSgpO1xyXG5cdFx0Ly8gdGhpcy5yZWN0KFxyXG5cdFx0Ly8gICAgICh0aGlzLndvcmxkLnBsYXllci5pbnRlcnBvbGF0ZWRYICogdGhpcy5USUxFX1dJRFRIIC1cclxuXHRcdC8vICAgICAgICAgdGhpcy5pbnRlcnBvbGF0ZWRDYW1YICogdGhpcy5USUxFX1dJRFRIKSAqXHJcblx0XHQvLyAgICAgICAgIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHQvLyAgICAgKHRoaXMud29ybGQucGxheWVyLmludGVycG9sYXRlZFkgKiB0aGlzLlRJTEVfSEVJR0hUIC1cclxuXHRcdC8vICAgICAgICAgdGhpcy5pbnRlcnBvbGF0ZWRDYW1ZICogdGhpcy5USUxFX0hFSUdIVCkgKlxyXG5cdFx0Ly8gICAgICAgICB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0Ly8gICAgIHRoaXMud29ybGQucGxheWVyLndpZHRoICogdGhpcy51cHNjYWxlU2l6ZSAqIHRoaXMuVElMRV9XSURUSCxcclxuXHRcdC8vICAgICB0aGlzLndvcmxkLnBsYXllci5oZWlnaHQgKiB0aGlzLnVwc2NhbGVTaXplICogdGhpcy5USUxFX0hFSUdIVFxyXG5cdFx0Ly8gKTtcclxuXHRcdC8vIGZvciAoY29uc3QgaXRlbSBvZiB0aGlzLml0ZW1zKSB7XHJcblx0XHQvLyAgICAgaXRlbS5maW5kSW50ZXJwb2xhdGVkQ29vcmRpbmF0ZXMoKTtcclxuXHRcdC8vXHJcblx0XHQvLyAgICAgaXRlbS5pdGVtU3RhY2sudGV4dHVyZS5yZW5kZXIoXHJcblx0XHQvLyAgICAgICAgIHRoaXMsXHJcblx0XHQvLyAgICAgICAgIChpdGVtLmludGVycG9sYXRlZFggKiB0aGlzLlRJTEVfV0lEVEggLVxyXG5cdFx0Ly8gICAgICAgICAgICAgdGhpcy5pbnRlcnBvbGF0ZWRDYW1YICogdGhpcy5USUxFX1dJRFRIKSAqXHJcblx0XHQvLyAgICAgICAgICAgICB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0Ly8gICAgICAgICAoaXRlbS5pbnRlcnBvbGF0ZWRZICogdGhpcy5USUxFX0hFSUdIVCAtXHJcblx0XHQvLyAgICAgICAgICAgICB0aGlzLmludGVycG9sYXRlZENhbVkgKiB0aGlzLlRJTEVfSEVJR0hUKSAqXHJcblx0XHQvLyAgICAgICAgICAgICB0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0Ly8gICAgICAgICBpdGVtLncgKiB0aGlzLnVwc2NhbGVTaXplICogdGhpcy5USUxFX1dJRFRILFxyXG5cdFx0Ly8gICAgICAgICBpdGVtLmggKiB0aGlzLnVwc2NhbGVTaXplICogdGhpcy5USUxFX0hFSUdIVFxyXG5cdFx0Ly8gICAgICk7XHJcblx0XHQvL1xyXG5cdFx0Ly8gICAgIC8vIFJlbmRlciB0aGUgaXRlbSBxdWFudGl0eSBsYWJlbFxyXG5cdFx0Ly8gICAgIHRoaXMuZmlsbCgwKTtcclxuXHRcdC8vXHJcblx0XHQvLyAgICAgdGhpcy5ub1N0cm9rZSgpO1xyXG5cdFx0Ly9cclxuXHRcdC8vICAgICB0aGlzLnRleHRBbGlnbih0aGlzLlJJR0hULCB0aGlzLkJPVFRPTSk7XHJcblx0XHQvLyAgICAgdGhpcy50ZXh0U2l6ZSg1ICogdGhpcy51cHNjYWxlU2l6ZSk7XHJcblx0XHQvL1xyXG5cdFx0Ly8gICAgIHRoaXMudGV4dChcclxuXHRcdC8vICAgICAgICAgaXRlbS5pdGVtU3RhY2suc3RhY2tTaXplLFxyXG5cdFx0Ly8gICAgICAgICAoaXRlbS5pbnRlcnBvbGF0ZWRYICogdGhpcy5USUxFX1dJRFRIIC1cclxuXHRcdC8vICAgICAgICAgICAgIHRoaXMuaW50ZXJwb2xhdGVkQ2FtWCAqIHRoaXMuVElMRV9XSURUSCkgKlxyXG5cdFx0Ly8gICAgICAgICAgICAgdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdC8vICAgICAgICAgKGl0ZW0uaW50ZXJwb2xhdGVkWSAqIHRoaXMuVElMRV9IRUlHSFQgLVxyXG5cdFx0Ly8gICAgICAgICAgICAgdGhpcy5pbnRlcnBvbGF0ZWRDYW1ZICogdGhpcy5USUxFX0hFSUdIVCkgKlxyXG5cdFx0Ly8gICAgICAgICAgICAgdGhpcy51cHNjYWxlU2l6ZVxyXG5cdFx0Ly8gICAgICk7XHJcblx0XHQvLyB9XHJcblx0fVxyXG5cclxuXHQvKlxyXG5cdHBpY2tVcEl0ZW0oaXRlbVN0YWNrOiBJdGVtU3RhY2spOiBib29sZWFuIHtcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5ob3RCYXIubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0Y29uc3QgaXRlbSA9IHRoaXMuaG90QmFyW2ldO1xyXG5cclxuXHRcdFx0Ly8gSWYgdGhlcmUgYXJlIG5vIGl0ZW1zIGluIHRoZSBjdXJyZW50IHNsb3Qgb2YgdGhlIGhvdEJhclxyXG5cdFx0XHRpZiAoaXRlbSA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0dGhpcy5ob3RCYXJbaV0gPSBpdGVtU3RhY2s7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChcclxuXHRcdFx0XHRpdGVtID09PSBpdGVtU3RhY2sgJiZcclxuXHRcdFx0XHRpdGVtLnN0YWNrU2l6ZSA8IGl0ZW0ubWF4U3RhY2tTaXplXHJcblx0XHRcdCkge1xyXG5cdFx0XHRcdGNvbnN0IHJlbWFpbmluZ1NwYWNlID0gaXRlbS5tYXhTdGFja1NpemUgLSBpdGVtLnN0YWNrU2l6ZTtcclxuXHJcblx0XHRcdFx0Ly8gVG9wIG9mZiB0aGUgc3RhY2sgd2l0aCBpdGVtcyBpZiBpdCBjYW4gdGFrZSBtb3JlIHRoYW4gdGhlIHN0YWNrIGJlaW5nIGFkZGVkXHJcblx0XHRcdFx0aWYgKHJlbWFpbmluZ1NwYWNlID49IGl0ZW1TdGFjay5zdGFja1NpemUpIHtcclxuXHRcdFx0XHRcdHRoaXMuaG90QmFyW2ldLnN0YWNrU2l6ZSA9XHJcblx0XHRcdFx0XHRcdGl0ZW0uc3RhY2tTaXplICsgaXRlbVN0YWNrLnN0YWNrU2l6ZTtcclxuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aXRlbVN0YWNrLnN0YWNrU2l6ZSAtPSByZW1haW5pbmdTcGFjZTtcclxuXHJcblx0XHRcdFx0dGhpcy5ob3RCYXJbaV0uc3RhY2tTaXplID0gaXRlbVN0YWNrLm1heFN0YWNrU2l6ZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Y29uc29sZS5lcnJvcihcclxuXHRcdFx0YENvdWxkIG5vdCBwaWNrdXAgJHtpdGVtU3RhY2suc3RhY2tTaXplfSAke2l0ZW1TdGFjay5uYW1lfWBcclxuXHRcdCk7XHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fVxyXG5cclxuXHQgKi9cclxuXHJcblx0bW91c2VFeGl0ZWQoKSB7XHJcblx0XHR0aGlzLm1vdXNlT24gPSBmYWxzZTtcclxuXHR9XHJcblxyXG5cdG1vdXNlRW50ZXJlZCgpIHtcclxuXHRcdHRoaXMubW91c2VPbiA9IHRydWU7XHJcblx0fVxyXG5cclxuXHR1cGRhdGVNb3VzZSgpIHtcclxuXHRcdGlmIChcclxuXHRcdFx0TWF0aC5mbG9vcihcclxuXHRcdFx0XHQodGhpcy5pbnRlcnBvbGF0ZWRDYW1YICogdGhpcy5USUxFX1dJRFRIICtcclxuXHRcdFx0XHRcdHRoaXMubW91c2VYIC8gdGhpcy51cHNjYWxlU2l6ZSkgL1xyXG5cdFx0XHRcdHRoaXMuVElMRV9XSURUSCxcclxuXHRcdFx0KSAhPT0gdGhpcy53b3JsZE1vdXNlWCB8fFxyXG5cdFx0XHRNYXRoLmZsb29yKFxyXG5cdFx0XHRcdCh0aGlzLmludGVycG9sYXRlZENhbVkgKiB0aGlzLlRJTEVfSEVJR0hUICtcclxuXHRcdFx0XHRcdHRoaXMubW91c2VZIC8gdGhpcy51cHNjYWxlU2l6ZSkgL1xyXG5cdFx0XHRcdHRoaXMuVElMRV9IRUlHSFQsXHJcblx0XHRcdCkgIT09IHRoaXMud29ybGRNb3VzZVlcclxuXHRcdCkge1xyXG5cdFx0XHR0aGlzLmxhc3RDdXJzb3JNb3ZlID0gRGF0ZS5ub3coKTtcclxuXHRcdH1cclxuXHRcdC8vIHdvcmxkIG1vdXNlIHggYW5kIHkgdmFyaWFibGVzIGhvbGQgdGhlIG1vdXNlIHBvc2l0aW9uIGluIHdvcmxkIHRpbGVzLiAgMCwgMCBpcyB0b3AgbGVmdFxyXG5cdFx0dGhpcy53b3JsZE1vdXNlWCA9IE1hdGguZmxvb3IoXHJcblx0XHRcdCh0aGlzLmludGVycG9sYXRlZENhbVggKiB0aGlzLlRJTEVfV0lEVEggK1xyXG5cdFx0XHRcdHRoaXMubW91c2VYIC8gdGhpcy51cHNjYWxlU2l6ZSkgL1xyXG5cdFx0XHR0aGlzLlRJTEVfV0lEVEgsXHJcblx0XHQpO1xyXG5cdFx0dGhpcy53b3JsZE1vdXNlWSA9IE1hdGguZmxvb3IoXHJcblx0XHRcdCh0aGlzLmludGVycG9sYXRlZENhbVkgKiB0aGlzLlRJTEVfSEVJR0hUICtcclxuXHRcdFx0XHR0aGlzLm1vdXNlWSAvIHRoaXMudXBzY2FsZVNpemUpIC9cclxuXHRcdFx0dGhpcy5USUxFX0hFSUdIVCxcclxuXHRcdCk7XHJcblx0fVxyXG5cclxuXHRkcmF3Q3Vyc29yKCkge1xyXG5cdFx0aWYgKHRoaXMubW91c2VPbikge1xyXG5cdFx0XHQvLyBpZiAodGhpcy5waWNrZWRVcFNsb3QgPiAtMSkge1xyXG5cdFx0XHQvLyAgICAgdGhpcy5ob3RiYXJbdGhpcy5waWNrZWRVcFNsb3RdLnRleHR1cmUucmVuZGVyKFxyXG5cdFx0XHQvLyAgICAgICAgIHRoaXMsXHJcblx0XHRcdC8vICAgICAgICAgdGhpcy5tb3VzZVgsXHJcblx0XHRcdC8vICAgICAgICAgdGhpcy5tb3VzZVksXHJcblx0XHRcdC8vICAgICAgICAgOCAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdC8vICAgICAgICAgOCAqIHRoaXMudXBzY2FsZVNpemVcclxuXHRcdFx0Ly8gICAgICk7XHJcblxyXG5cdFx0XHQvLyAgICAgdGhpcy50ZXh0KFxyXG5cdFx0XHQvLyAgICAgICAgIHRoaXMuaG90QmFyW3RoaXMucGlja2VkVXBTbG90XS5zdGFja1NpemUsXHJcblx0XHRcdC8vICAgICAgICAgdGhpcy5tb3VzZVggKyAxMCAqIHRoaXMudXBzY2FsZVNpemUsXHJcblx0XHRcdC8vICAgICAgICAgdGhpcy5tb3VzZVkgKyAxMCAqIHRoaXMudXBzY2FsZVNpemVcclxuXHRcdFx0Ly8gICAgICk7XHJcblx0XHRcdC8vIH1cclxuXHJcblx0XHRcdFVpQXNzZXRzLnNlbGVjdGVkX3RpbGUucmVuZGVyKFxyXG5cdFx0XHRcdHRoaXMsXHJcblx0XHRcdFx0TWF0aC5yb3VuZChcclxuXHRcdFx0XHRcdCh0aGlzLndvcmxkTW91c2VYIC0gdGhpcy5pbnRlcnBvbGF0ZWRDYW1YKSAqXHJcblx0XHRcdFx0XHR0aGlzLlRJTEVfV0lEVEggKlxyXG5cdFx0XHRcdFx0dGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0XHQpLFxyXG5cdFx0XHRcdE1hdGgucm91bmQoXHJcblx0XHRcdFx0XHQodGhpcy53b3JsZE1vdXNlWSAtIHRoaXMuaW50ZXJwb2xhdGVkQ2FtWSkgKlxyXG5cdFx0XHRcdFx0dGhpcy5USUxFX0hFSUdIVCAqXHJcblx0XHRcdFx0XHR0aGlzLnVwc2NhbGVTaXplLFxyXG5cdFx0XHRcdCksXHJcblx0XHRcdFx0dGhpcy5USUxFX1dJRFRIICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0XHR0aGlzLlRJTEVfSEVJR0hUICogdGhpcy51cHNjYWxlU2l6ZSxcclxuXHRcdFx0KTtcclxuXHRcdFx0aWYgKERhdGUubm93KCkgLSB0aGlzLmxhc3RDdXJzb3JNb3ZlID4gMTAwMCkge1xyXG5cdFx0XHRcdGxldCBzZWxlY3RlZFRpbGUgPSB0aGlzLndvcmxkLndvcmxkVGlsZXNbdGhpcy53b3JsZC53aWR0aCAqIHRoaXMud29ybGRNb3VzZVkgKyB0aGlzLndvcmxkTW91c2VYXTtcclxuXHRcdFx0XHRpZiAodHlwZW9mIChzZWxlY3RlZFRpbGUpID09PSAnc3RyaW5nJykge1xyXG5cdFx0XHRcdFx0dGhpcy50ZXh0KFwiVGlsZSBlbnRpdHk6IFwiICsgc2VsZWN0ZWRUaWxlLCB0aGlzLm1vdXNlWCwgdGhpcy5tb3VzZVkpOy8vSkFOS1kgQUxFUlRcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSBpZiAoV29ybGRUaWxlc1tzZWxlY3RlZFRpbGVdICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHRcdHRoaXMudGV4dCgoV29ybGRUaWxlc1tzZWxlY3RlZFRpbGVdIGFzIFRpbGUpLm5hbWUsIHRoaXMubW91c2VYLCB0aGlzLm1vdXNlWSk7Ly9KQU5LWSBBTEVSVFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuY29uc3QgY29ubmVjdGlvbiA9IGlvKHtcclxuXHRhdXRoOiB7IHRva2VuOiB3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3Rva2VuJykgfSxcclxufSk7XHJcblxyXG5leHBvcnQgY29uc3QgZ2FtZSA9IG5ldyBHYW1lKGNvbm5lY3Rpb24pO1xyXG4iLCJpbXBvcnQgeyBHYW1lIH0gZnJvbSAnLi9HYW1lJztcclxuaW1wb3J0IHsgV29ybGQgfSBmcm9tICcuL3dvcmxkL1dvcmxkJztcclxuaW1wb3J0IHsgRW50aXR5Q2xhc3NlcyB9IGZyb20gJy4vd29ybGQvZW50aXRpZXMvRW50aXR5Q2xhc3Nlcyc7XHJcbmltcG9ydCB7IFBsYXllckxvY2FsIH0gZnJvbSAnLi9wbGF5ZXIvUGxheWVyTG9jYWwnO1xyXG5pbXBvcnQgeyBJbnZlbnRvcnkgfSBmcm9tICcuL3BsYXllci9JbnZlbnRvcnknO1xyXG5pbXBvcnQgeyBUaWxlRW50aXR5QW5pbWF0aW9ucyB9IGZyb20gJy4vd29ybGQvZW50aXRpZXMvVGlsZUVudGl0eSc7XHJcbmltcG9ydCB7IFdvcmxkQXNzZXRzIH0gZnJvbSAnLi9hc3NldHMvQXNzZXRzJztcclxuaW1wb3J0IHsgUGxheWVyRW50aXR5IH0gZnJvbSAnLi93b3JsZC9lbnRpdGllcy9QbGF5ZXJFbnRpdHknO1xyXG5pbXBvcnQgeyBQbGF5ZXJBbmltYXRpb25zIH0gZnJvbSAnLi9hc3NldHMvQXNzZXRzJztcclxuaW1wb3J0IHsgQW5pbWF0aW9uRnJhbWUgfSBmcm9tICcuL2Fzc2V0cy9Bc3NldHMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIE5ldE1hbmFnZXIge1xyXG5cdGdhbWU6IEdhbWU7XHJcblxyXG5cdHBsYXllclRpY2tSYXRlOiBudW1iZXI7XHJcblxyXG5cdGNvbnN0cnVjdG9yKGdhbWU6IEdhbWUpIHtcclxuXHRcdHRoaXMuZ2FtZSA9IGdhbWU7XHJcblxyXG5cdFx0Ly8gSW5pdCBldmVudFxyXG5cdFx0dGhpcy5nYW1lLmNvbm5lY3Rpb24ub24oJ2luaXQnLCAocGxheWVyVGlja1JhdGUsIHRva2VuKSA9PiB7XHJcblx0XHRcdGNvbnNvbGUubG9nKGBUaWNrIHJhdGUgc2V0IHRvOiAke3BsYXllclRpY2tSYXRlfWApO1xyXG5cdFx0XHR0aGlzLnBsYXllclRpY2tSYXRlID0gcGxheWVyVGlja1JhdGU7XHJcblx0XHRcdGlmICh0b2tlbikge1xyXG5cdFx0XHRcdHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndG9rZW4nLCB0b2tlbik7XHJcblx0XHRcdFx0KHRoaXMuZ2FtZS5jb25uZWN0aW9uLmF1dGggYXMgeyB0b2tlbjogc3RyaW5nIH0pLnRva2VuID0gdG9rZW47XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdC8vIEluaXRpYWxpemF0aW9uIGV2ZW50c1xyXG5cdFx0e1xyXG5cdFx0XHQvLyBMb2FkIHRoZSB3b3JsZCBhbmQgc2V0IHRoZSBwbGF5ZXIgZW50aXR5IGlkXHJcblx0XHRcdHRoaXMuZ2FtZS5jb25uZWN0aW9uLm9uKFxyXG5cdFx0XHRcdCd3b3JsZExvYWQnLFxyXG5cdFx0XHRcdChcclxuXHRcdFx0XHRcdHdpZHRoLFxyXG5cdFx0XHRcdFx0aGVpZ2h0LFxyXG5cdFx0XHRcdFx0dGlsZXMsXHJcblx0XHRcdFx0XHR0aWxlRW50aXRpZXMsXHJcblx0XHRcdFx0XHRlbnRpdGllcyxcclxuXHRcdFx0XHRcdHBsYXllcixcclxuXHRcdFx0XHRcdGludmVudG9yeSxcclxuXHRcdFx0XHQpID0+IHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGVudGl0aWVzKTtcclxuXHRcdFx0XHRcdGxldCB0aWxlRW50aXRpZXMyOiB7XHJcblx0XHRcdFx0XHRcdFtpZDogc3RyaW5nXToge1xyXG5cdFx0XHRcdFx0XHRcdGlkOiBzdHJpbmc7XHJcblx0XHRcdFx0XHRcdFx0Y292ZXJlZFRpbGVzOiBudW1iZXJbXTtcclxuXHRcdFx0XHRcdFx0XHR0eXBlXzogbnVtYmVyO1xyXG5cdFx0XHRcdFx0XHRcdGRhdGE6IHt9O1xyXG5cdFx0XHRcdFx0XHRcdGFuaW1GcmFtZTogbnVtYmVyO1xyXG5cdFx0XHRcdFx0XHRcdGFuaW1hdGU6IGJvb2xlYW47XHJcblx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHR9ID0ge307XHJcblx0XHRcdFx0XHR0aWxlRW50aXRpZXMuZm9yRWFjaCh0aWxlRW50aXR5ID0+IHtcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coJ2FkZGluZyB0aWxlIGVudGl0eTogJyArIHRpbGVFbnRpdHkuaWQpO1xyXG5cdFx0XHRcdFx0XHR0aWxlRW50aXRpZXMyW3RpbGVFbnRpdHkuaWRdID0ge1xyXG5cdFx0XHRcdFx0XHRcdGlkOiB0aWxlRW50aXR5LmlkLFxyXG5cdFx0XHRcdFx0XHRcdGNvdmVyZWRUaWxlczogdGlsZUVudGl0eS5jb3ZlcmVkVGlsZXMsXHJcblx0XHRcdFx0XHRcdFx0dHlwZV86IHRpbGVFbnRpdHkucGF5bG9hZC50eXBlXyxcclxuXHRcdFx0XHRcdFx0XHRkYXRhOiB0aWxlRW50aXR5LnBheWxvYWQuZGF0YSxcclxuXHRcdFx0XHRcdFx0XHRhbmltRnJhbWU6IHJhbmRpbnQoXHJcblx0XHRcdFx0XHRcdFx0XHQwLFxyXG5cdFx0XHRcdFx0XHRcdFx0V29ybGRBc3NldHMudGlsZUVudGl0aWVzW1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR0aWxlRW50aXR5LnBheWxvYWQudHlwZV9cclxuXHRcdFx0XHRcdFx0XHRcdF0ubGVuZ3RoIC0gMSxcclxuXHRcdFx0XHRcdFx0XHQpLFxyXG5cdFx0XHRcdFx0XHRcdGFuaW1hdGU6XHJcblx0XHRcdFx0XHRcdFx0XHRUaWxlRW50aXR5QW5pbWF0aW9uc1t0aWxlRW50aXR5LnBheWxvYWQudHlwZV9dLFxyXG5cdFx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHR0aGlzLmdhbWUud29ybGQgPSBuZXcgV29ybGQoXHJcblx0XHRcdFx0XHRcdHdpZHRoLFxyXG5cdFx0XHRcdFx0XHRoZWlnaHQsXHJcblx0XHRcdFx0XHRcdHRpbGVzLFxyXG5cdFx0XHRcdFx0XHR0aWxlRW50aXRpZXMyLFxyXG5cdFx0XHRcdFx0KTtcclxuXHRcdFx0XHRcdHRoaXMuZ2FtZS53b3JsZC5pbnZlbnRvcnkgPSBuZXcgSW52ZW50b3J5KGludmVudG9yeSk7XHJcblx0XHRcdFx0XHR0aGlzLmdhbWUud29ybGQucGxheWVyID0gbmV3IFBsYXllckxvY2FsKHBsYXllcik7XHJcblx0XHRcdFx0XHRlbnRpdGllcy5mb3JFYWNoKGVudGl0eSA9PiB7XHJcblx0XHRcdFx0XHRcdHRoaXMuZ2FtZS53b3JsZC5lbnRpdGllc1tlbnRpdHkuaWRdID0gbmV3IEVudGl0eUNsYXNzZXNbXHJcblx0XHRcdFx0XHRcdFx0ZW50aXR5LnR5cGVcclxuXHRcdFx0XHRcdFx0XShlbnRpdHkpO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0KTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBXb3JsZCBldmVudHNcclxuXHRcdHtcclxuXHRcdFx0Ly8gVGlsZSB1cGRhdGVzIHN1Y2ggYXMgYnJlYWtpbmcgYW5kIHBsYWNpbmdcclxuXHRcdFx0dGhpcy5nYW1lLmNvbm5lY3Rpb24ub24oXHJcblx0XHRcdFx0J3dvcmxkVXBkYXRlJyxcclxuXHRcdFx0XHQodXBkYXRlZFRpbGVzOiB7IHRpbGVJbmRleDogbnVtYmVyOyB0aWxlOiBudW1iZXIgfVtdKSA9PiB7XHJcblx0XHRcdFx0XHQvLyBJZiB0aGUgd29ybGQgaXMgbm90IHNldFxyXG5cdFx0XHRcdFx0aWYgKHRoaXMuZ2FtZS53b3JsZCA9PT0gdW5kZWZpbmVkKSByZXR1cm47XHJcblxyXG5cdFx0XHRcdFx0dXBkYXRlZFRpbGVzLmZvckVhY2godGlsZSA9PiB7XHJcblx0XHRcdFx0XHRcdHRoaXMuZ2FtZS53b3JsZC51cGRhdGVUaWxlKHRpbGUudGlsZUluZGV4LCB0aWxlLnRpbGUpO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0KTtcclxuXHJcblx0XHRcdHRoaXMuZ2FtZS5jb25uZWN0aW9uLm9uKCdpbnZlbnRvcnlVcGRhdGUnLCB1cGRhdGVzID0+IHtcclxuXHRcdFx0XHQvLyBJZiB0aGUgd29ybGQgaXMgbm90IHNldFxyXG5cdFx0XHRcdGlmICh0aGlzLmdhbWUud29ybGQgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xyXG5cclxuXHRcdFx0XHR1cGRhdGVzLmZvckVhY2godXBkYXRlID0+IHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKHVwZGF0ZSk7XHJcblx0XHRcdFx0XHR0aGlzLmdhbWUud29ybGQuaW52ZW50b3J5Lml0ZW1zW3VwZGF0ZS5zbG90XSA9IHVwZGF0ZS5pdGVtO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBQbGF5ZXIgZXZlbnRzXHJcblx0XHR7XHJcblx0XHRcdHRoaXMuZ2FtZS5jb25uZWN0aW9uLm9uKCdlbnRpdHlVcGRhdGUnLCBlbnRpdHlEYXRhID0+IHtcclxuXHRcdFx0XHQvLyBJZiB0aGUgd29ybGQgaXMgbm90IHNldFxyXG5cdFx0XHRcdGlmICh0aGlzLmdhbWUud29ybGQgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xyXG5cclxuXHRcdFx0XHRjb25zdCBlbnRpdHkgPSB0aGlzLmdhbWUud29ybGQuZW50aXRpZXNbZW50aXR5RGF0YS5pZF07XHJcblx0XHRcdFx0aWYgKGVudGl0eSA9PT0gdW5kZWZpbmVkKSByZXR1cm47XHJcblxyXG5cdFx0XHRcdGVudGl0eS51cGRhdGVEYXRhKGVudGl0eURhdGEpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHRoaXMuZ2FtZS5jb25uZWN0aW9uLm9uKCdvblBsYXllckFuaW1hdGlvbicsIChhbmltYXRpb24sIHBsYXllcklkKSA9PiB7XHJcblx0XHRcdFx0aWYgKCgoKCgoKHRoaXMuZ2FtZS53b3JsZCA9PSB1bmRlZmluZWQpKSkpKSkpIHJldHVybjtcclxuXHRcdFx0XHRsZXQgZSA9IHRoaXMuZ2FtZS53b3JsZC5lbnRpdGllc1twbGF5ZXJJZF07XHJcblx0XHRcdFx0aWYoZSBpbnN0YW5jZW9mIFBsYXllckVudGl0eSAmJiBPYmplY3Qua2V5cyhQbGF5ZXJBbmltYXRpb25zKS5pbmNsdWRlcyhlLmN1cnJlbnRBbmltYXRpb24pKSB7XHJcblx0XHRcdFx0XHQvL0B0cy1leHBlY3QtZXJyb3JcclxuXHRcdFx0XHRcdGUuY3VycmVudEFuaW1hdGlvbiA9IGFuaW1hdGlvbjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0dGhpcy5nYW1lLmNvbm5lY3Rpb24ub24oJ2VudGl0eUNyZWF0ZScsIGVudGl0eURhdGEgPT4ge1xyXG5cdFx0XHRcdC8vIElmIHRoZSB3b3JsZCBpcyBub3Qgc2V0XHJcblx0XHRcdFx0aWYgKHRoaXMuZ2FtZS53b3JsZCA9PT0gdW5kZWZpbmVkKSByZXR1cm47XHJcblxyXG5cdFx0XHRcdHRoaXMuZ2FtZS53b3JsZC5lbnRpdGllc1tlbnRpdHlEYXRhLmlkXSA9IG5ldyBFbnRpdHlDbGFzc2VzW1xyXG5cdFx0XHRcdFx0ZW50aXR5RGF0YS50eXBlXHJcblx0XHRcdFx0XShlbnRpdHlEYXRhKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHR0aGlzLmdhbWUuY29ubmVjdGlvbi5vbignZW50aXR5RGVsZXRlJywgaWQgPT4ge1xyXG5cdFx0XHRcdC8vIElmIHRoZSB3b3JsZCBpcyBub3Qgc2V0XHJcblx0XHRcdFx0aWYgKHRoaXMuZ2FtZS53b3JsZCA9PT0gdW5kZWZpbmVkKSByZXR1cm47XHJcblxyXG5cdFx0XHRcdGRlbGV0ZSB0aGlzLmdhbWUud29ybGQuZW50aXRpZXNbaWRdO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdC8vIFVwZGF0ZSB0aGUgb3RoZXIgcGxheWVycyBpbiB0aGUgd29ybGRcclxuXHRcdFx0dGhpcy5nYW1lLmNvbm5lY3Rpb24ub24oXHJcblx0XHRcdFx0J2VudGl0eVNuYXBzaG90JyxcclxuXHRcdFx0XHQoc25hcHNob3Q6IHtcclxuXHRcdFx0XHRcdGlkOiBzdHJpbmc7XHJcblx0XHRcdFx0XHR0aW1lOiBudW1iZXI7XHJcblx0XHRcdFx0XHRzdGF0ZTogeyBpZDogc3RyaW5nOyB4OiBzdHJpbmc7IHk6IHN0cmluZyB9W107XHJcblx0XHRcdFx0fSkgPT4ge1xyXG5cdFx0XHRcdFx0Ly8gSWYgdGhlIHdvcmxkIGlzIG5vdCBzZXRcclxuXHRcdFx0XHRcdGlmICh0aGlzLmdhbWUud29ybGQgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xyXG5cclxuXHRcdFx0XHRcdHRoaXMuZ2FtZS53b3JsZC51cGRhdGVQbGF5ZXJzKHNuYXBzaG90KTtcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHQpO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gcmFuZGludCh4MTogbnVtYmVyLCB4MjogbnVtYmVyKSB7XHJcblx0cmV0dXJuIE1hdGguZmxvb3IoeDEgKyBNYXRoLnJhbmRvbSgpICogKHgyICsgMSAtIHgxKSk7XHJcbn1cclxuIiwiaW1wb3J0IHsgVGlsZVJlc291cmNlIH0gZnJvbSAnLi9yZXNvdXJjZXMvVGlsZVJlc291cmNlJztcclxuaW1wb3J0IHsgSW1hZ2VSZXNvdXJjZSB9IGZyb20gJy4vcmVzb3VyY2VzL0ltYWdlUmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBGb250UmVzb3VyY2UgfSBmcm9tICcuL3Jlc291cmNlcy9Gb250UmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBBdWRpb1Jlc291cmNlR3JvdXAgfSBmcm9tICcuL3Jlc291cmNlcy9BdWRpb1Jlc291cmNlR3JvdXAnO1xyXG5pbXBvcnQgeyBBdWRpb1Jlc291cmNlIH0gZnJvbSAnLi9yZXNvdXJjZXMvQXVkaW9SZXNvdXJjZSc7XHJcbmltcG9ydCB7IEl0ZW1UeXBlIH0gZnJvbSAnLi4vLi4vZ2xvYmFsL0ludmVudG9yeSc7XHJcbmltcG9ydCB7IFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZSB9IGZyb20gJy4vcmVzb3VyY2VzL1JlZmxlY3RlZEltYWdlUmVzb3VyY2UnO1xyXG5pbXBvcnQgUDUgZnJvbSAncDUnO1xyXG5pbXBvcnQgeyBSZXNvdXJjZSB9IGZyb20gJy4vcmVzb3VyY2VzL1Jlc291cmNlJztcclxuXHJcbmludGVyZmFjZSBBc3NldEdyb3VwIHtcclxuXHRbbmFtZTogc3RyaW5nXTpcclxuXHRcdHwge1xyXG5cdFx0XHRcdFtuYW1lOiBzdHJpbmddOlxyXG5cdFx0XHRcdFx0fCBSZXNvdXJjZVxyXG5cdFx0XHRcdFx0fCBBc3NldEdyb3VwXHJcblx0XHRcdFx0XHR8IEF1ZGlvUmVzb3VyY2VHcm91cFxyXG5cdFx0XHRcdFx0fCBBdWRpb1Jlc291cmNlXHJcblx0XHRcdFx0XHR8IEltYWdlUmVzb3VyY2VbXVxyXG4gICAgICAgICAgICAgICAgICAgIHwgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlW11cclxuICAgICAgICAgICAgICAgICAgICB8IFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZVxyXG5cdFx0XHRcdFx0fCBbUmVmbGVjdGFibGVJbWFnZVJlc291cmNlLCBudW1iZXJdW107XHJcblx0XHQgIH1cclxuXHRcdHwgUmVzb3VyY2VcclxuXHRcdHwgQXNzZXRHcm91cFxyXG5cdFx0fCBBdWRpb1Jlc291cmNlR3JvdXBcclxuXHRcdHwgQXVkaW9SZXNvdXJjZVxyXG5cdFx0fCBJbWFnZVJlc291cmNlW11cclxuXHRcdHwgSW1hZ2VSZXNvdXJjZVtdW11cclxuICAgICAgICB8IFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZVtdXHJcbiAgICAgICAgfCBSZWZsZWN0YWJsZUltYWdlUmVzb3VyY2VcclxuXHRcdHwgW1JlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZSwgbnVtYmVyXVtdO1xyXG59XHJcblxyXG5jb25zdCBwbGF5ZXJBbmltYXRpb25zID0gPFQgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBbUmVmbGVjdGFibGVJbWFnZVJlc291cmNlLCBudW1iZXJdW10+PihcclxuXHRkYXRhOiBULFxyXG4pOiBUID0+IGRhdGE7XHJcblxyXG5leHBvcnQgY29uc3QgUGxheWVyQW5pbWF0aW9ucyA9IHBsYXllckFuaW1hdGlvbnMoe1xyXG5cdC8vaW1hZ2UsIG1pbGxpc2Vjb25kcyB0byBkaXNwbGF5IGZvclxyXG5cdGlkbGU6IFtcclxuXHRcdFtuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvcGxheWVyL3Nub3dtYW5pZGxlMS5wbmcnKSwgMTM1XSwvL2lnbm9yZSB0aGUgYXRyb2Npb3VzIG5hbWluZyBzY2hlbWUgb2YgdGhlc2UgaW1hZ2VzXHJcblx0XHRbbmV3IFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3BsYXllci9zbm93bWFuaWRsZTIucG5nJyksIDEzNV0sXHJcblx0XHRbbmV3IFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3BsYXllci9zbm93bWFuaWRsZTMucG5nJyksIDEzNV0sXHJcblx0XHRbbmV3IFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3BsYXllci9zbm93bWFuaWRsZTQucG5nJyksIDEzNV0sXHJcblx0XHRbbmV3IFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3BsYXllci9zbm93bWFuaWRsZTUucG5nJyksIDEzNV0sXHJcblx0XHRbbmV3IFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3BsYXllci9zbm93bWFuaWRsZTYucG5nJyksIDEzNV0sXHJcblx0XHRbbmV3IFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3BsYXllci9zbm93bWFuaWRsZTcucG5nJyksIDEzNV0sXHJcblx0XHRbbmV3IFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3BsYXllci9zbm93bWFuaWRsZTgucG5nJyksIDEzNV0sXHJcblx0XSxcclxuXHRpZGxlbGVmdDogW1xyXG5cdFx0W25ldyBSZWZsZWN0YWJsZUltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy9wbGF5ZXIvc25vd21hbmlkbGVmbGlwcGVkMS5wbmcnKSwgMTM1XSxcclxuXHRcdFtuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvcGxheWVyL3Nub3dtYW5pZGxlZmxpcHBlZDIucG5nJyksIDEzNV0sXHJcblx0XHRbbmV3IFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3BsYXllci9zbm93bWFuaWRsZWZsaXBwZWQzLnBuZycpLCAxMzVdLFxyXG5cdFx0W25ldyBSZWZsZWN0YWJsZUltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy9wbGF5ZXIvc25vd21hbmlkbGVmbGlwcGVkNC5wbmcnKSwgMTM1XSxcclxuXHRcdFtuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvcGxheWVyL3Nub3dtYW5pZGxlZmxpcHBlZDUucG5nJyksIDEzNV0sXHJcblx0XHRbbmV3IFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3BsYXllci9zbm93bWFuaWRsZWZsaXBwZWQ2LnBuZycpLCAxMzVdLFxyXG5cdFx0W25ldyBSZWZsZWN0YWJsZUltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy9wbGF5ZXIvc25vd21hbmlkbGVmbGlwcGVkNy5wbmcnKSwgMTM1XSxcclxuXHRcdFtuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvcGxheWVyL3Nub3dtYW5pZGxlZmxpcHBlZDgucG5nJyksIDEzNV0sXHJcblx0XSxcclxuXHR3YWxrOiBbXHJcblx0XHRbbmV3IFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3BsYXllci9zbm93bWFucm9sbDAxLnBuZycpLCA3NV0sXHJcblx0XHRbbmV3IFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3BsYXllci9zbm93bWFucm9sbDAyLnBuZycpLCA3NV0sXHJcblx0XHRbbmV3IFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3BsYXllci9zbm93bWFucm9sbDAzLnBuZycpLCA3NV0sXHJcblx0XHRbbmV3IFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3BsYXllci9zbm93bWFucm9sbDA0LnBuZycpLCA3NV0sXHJcblx0XHRbbmV3IFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3BsYXllci9zbm93bWFucm9sbDA1LnBuZycpLCA3NV0sXHJcblx0XHRbbmV3IFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3BsYXllci9zbm93bWFucm9sbDA2LnBuZycpLCA3NV0sXHJcblx0XHRbbmV3IFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3BsYXllci9zbm93bWFucm9sbDA3LnBuZycpLCA3NV0sXHJcblx0XHRbbmV3IFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3BsYXllci9zbm93bWFucm9sbDA4LnBuZycpLCA3NV0sXHJcblx0XSxcclxuXHR3YWxrbGVmdDogW1xyXG5cdFx0W25ldyBSZWZsZWN0YWJsZUltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy9wbGF5ZXIvc25vd21hbnJvbGxsZWZ0MDEucG5nJyksIDc1XSxcclxuXHRcdFtuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvcGxheWVyL3Nub3dtYW5yb2xsbGVmdDAyLnBuZycpLCA3NV0sXHJcblx0XHRbbmV3IFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3BsYXllci9zbm93bWFucm9sbGxlZnQwMy5wbmcnKSwgNzVdLFxyXG5cdFx0W25ldyBSZWZsZWN0YWJsZUltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy9wbGF5ZXIvc25vd21hbnJvbGxsZWZ0MDQucG5nJyksIDc1XSxcclxuXHRcdFtuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvcGxheWVyL3Nub3dtYW5yb2xsbGVmdDA1LnBuZycpLCA3NV0sXHJcblx0XHRbbmV3IFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3BsYXllci9zbm93bWFucm9sbGxlZnQwNi5wbmcnKSwgNzVdLFxyXG5cdFx0W25ldyBSZWZsZWN0YWJsZUltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy9wbGF5ZXIvc25vd21hbnJvbGxsZWZ0MDcucG5nJyksIDc1XSxcclxuXHRcdFtuZXcgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvcGxheWVyL3Nub3dtYW5yb2xsbGVmdDA4LnBuZycpLCA3NV0sXHJcblx0XSxcclxufSk7XHJcblxyXG4vLyBJdGVtIHJlbGF0ZWQgYXNzZXRzXHJcbmV4cG9ydCBjb25zdCBJdGVtQXNzZXRzOiBSZWNvcmQ8SXRlbVR5cGUsIEltYWdlUmVzb3VyY2U+ID0ge1xyXG5cdFtJdGVtVHlwZS5Tbm93QmxvY2tdOiBuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdCdhc3NldHMvdGV4dHVyZXMvaXRlbXMvYmxvY2tfc25vdy5wbmcnLFxyXG5cdCksXHJcblx0W0l0ZW1UeXBlLkljZUJsb2NrXTogbmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHQnYXNzZXRzL3RleHR1cmVzL2l0ZW1zL2Jsb2NrX2ljZS5wbmcnLFxyXG5cdCksXHJcblx0W0l0ZW1UeXBlLkRpcnRCbG9ja106IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9ibG9ja19kaXJ0LnBuZycsXHJcblx0KSxcclxuXHRbSXRlbVR5cGUuU3RvbmUwQmxvY2tdOiBuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdCdhc3NldHMvdGV4dHVyZXMvaXRlbXMvYmxvY2tfc3RvbmUwLnBuZycsXHJcblx0KSxcclxuXHRbSXRlbVR5cGUuU3RvbmUxQmxvY2tdOiBuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdCdhc3NldHMvdGV4dHVyZXMvaXRlbXMvYmxvY2tfc3RvbmUxLnBuZycsXHJcblx0KSxcclxuXHRbSXRlbVR5cGUuU3RvbmUyQmxvY2tdOiBuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdCdhc3NldHMvdGV4dHVyZXMvaXRlbXMvYmxvY2tfc3RvbmUyLnBuZycsXHJcblx0KSxcclxuXHRbSXRlbVR5cGUuU3RvbmUzQmxvY2tdOiBuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdCdhc3NldHMvdGV4dHVyZXMvaXRlbXMvYmxvY2tfc3RvbmUzLnBuZycsXHJcblx0KSxcclxuXHRbSXRlbVR5cGUuU3RvbmU0QmxvY2tdOiBuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdCdhc3NldHMvdGV4dHVyZXMvaXRlbXMvYmxvY2tfc3RvbmU0LnBuZycsXHJcblx0KSxcclxuXHRbSXRlbVR5cGUuU3RvbmU1QmxvY2tdOiBuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdCdhc3NldHMvdGV4dHVyZXMvaXRlbXMvYmxvY2tfc3RvbmU1LnBuZycsXHJcblx0KSxcclxuXHRbSXRlbVR5cGUuU3RvbmU2QmxvY2tdOiBuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdCdhc3NldHMvdGV4dHVyZXMvaXRlbXMvYmxvY2tfc3RvbmU2LnBuZycsXHJcblx0KSxcclxuXHRbSXRlbVR5cGUuU3RvbmU3QmxvY2tdOiBuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdCdhc3NldHMvdGV4dHVyZXMvaXRlbXMvYmxvY2tfc3RvbmU3LnBuZycsXHJcblx0KSxcclxuXHRbSXRlbVR5cGUuU3RvbmU4QmxvY2tdOiBuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdCdhc3NldHMvdGV4dHVyZXMvaXRlbXMvYmxvY2tfc3RvbmU4LnBuZycsXHJcblx0KSxcclxuXHRbSXRlbVR5cGUuU3RvbmU5QmxvY2tdOiBuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdCdhc3NldHMvdGV4dHVyZXMvaXRlbXMvYmxvY2tfc3RvbmU5LnBuZycsXHJcblx0KSxcclxuXHRbSXRlbVR5cGUuVGluQmxvY2tdOiBuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdCdhc3NldHMvdGV4dHVyZXMvaXRlbXMvYmxvY2tfdGluLnBuZycsXHJcblx0KSxcclxuXHRbSXRlbVR5cGUuQWx1bWludW1CbG9ja106IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9ibG9ja19hbHVtaW51bS5wbmcnLFxyXG5cdCksXHJcblx0W0l0ZW1UeXBlLkdvbGRCbG9ja106IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9ibG9ja19nb2xkLnBuZycsXHJcblx0KSxcclxuXHRbSXRlbVR5cGUuVGl0YW5pdW1CbG9ja106IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9ibG9ja190aXRhbml1bS5wbmcnLFxyXG5cdCksXHJcblx0W0l0ZW1UeXBlLkdyYXBlQmxvY2tdOiBuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdCdhc3NldHMvdGV4dHVyZXMvaXRlbXMvYmxvY2tfZ3JhcGUucG5nJyxcclxuXHQpLFxyXG5cdFtJdGVtVHlwZS5Xb29kMEJsb2NrXTogbmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHQnYXNzZXRzL3RleHR1cmVzL2l0ZW1zL2Jsb2NrX3dvb2QwLnBuZycsXHJcblx0KSxcclxuXHRbSXRlbVR5cGUuV29vZDFCbG9ja106IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9ibG9ja193b29kMS5wbmcnLFxyXG5cdCksXHJcblx0W0l0ZW1UeXBlLldvb2QyQmxvY2tdOiBuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdCdhc3NldHMvdGV4dHVyZXMvaXRlbXMvYmxvY2tfd29vZDIucG5nJyxcclxuXHQpLFxyXG5cdFtJdGVtVHlwZS5Xb29kM0Jsb2NrXTogbmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHQnYXNzZXRzL3RleHR1cmVzL2l0ZW1zL2Jsb2NrX3dvb2QzLnBuZycsXHJcblx0KSxcclxuXHRbSXRlbVR5cGUuV29vZDRCbG9ja106IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9ibG9ja193b29kNC5wbmcnLFxyXG5cdCksXHJcblx0W0l0ZW1UeXBlLldvb2Q1QmxvY2tdOiBuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdCdhc3NldHMvdGV4dHVyZXMvaXRlbXMvYmxvY2tfd29vZDUucG5nJyxcclxuXHQpLFxyXG5cdFtJdGVtVHlwZS5Xb29kNkJsb2NrXTogbmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHQnYXNzZXRzL3RleHR1cmVzL2l0ZW1zL2Jsb2NrX3dvb2Q2LnBuZycsXHJcblx0KSxcclxuXHRbSXRlbVR5cGUuV29vZDdCbG9ja106IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9ibG9ja193b29kNy5wbmcnLFxyXG5cdCksXHJcblx0W0l0ZW1UeXBlLldvb2Q4QmxvY2tdOiBuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdCdhc3NldHMvdGV4dHVyZXMvaXRlbXMvYmxvY2tfd29vZDgucG5nJyxcclxuXHQpLFxyXG5cdFtJdGVtVHlwZS5Xb29kOUJsb2NrXTogbmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHQnYXNzZXRzL3RleHR1cmVzL2l0ZW1zL2Jsb2NrX3dvb2Q5LnBuZycsXHJcblx0KSxcclxuXHRbSXRlbVR5cGUuU2VlZF06IG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy9pdGVtcy9zZWVkLnBuZycsXHJcblx0KSxcclxufTtcclxuXHJcbi8vIFVpIHJlbGF0ZWQgYXNzZXRzXHJcbmV4cG9ydCBjb25zdCBVaUFzc2V0cyA9IHtcclxuXHR1aV9zbG90X3NlbGVjdGVkOiBuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdCdhc3NldHMvdGV4dHVyZXMvdWkvdWlzbG90X3NlbGVjdGVkLnBuZycsXHJcblx0KSxcclxuXHR1aV9zbG90OiBuZXcgSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3VpL3Vpc2xvdC5wbmcnKSxcclxuXHR1aV9mcmFtZTogbmV3IEltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy91aS91aWZyYW1lLnBuZycpLFxyXG5cdGJ1dHRvbl91bnNlbGVjdGVkOiBuZXcgSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3VpL2J1dHRvbjAucG5nJyksXHJcblx0YnV0dG9uX3NlbGVjdGVkOiBuZXcgSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3VpL2J1dHRvbjEucG5nJyksXHJcblx0c2xpZGVyX2JhcjogbmV3IEltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy91aS9zbGlkZXJCYXIucG5nJyksXHJcblx0c2xpZGVyX2hhbmRsZTogbmV3IEltYWdlUmVzb3VyY2UoJ2Fzc2V0cy90ZXh0dXJlcy91aS9zbGlkZXJIYW5kbGUucG5nJyksXHJcblx0dGl0bGVfaW1hZ2U6IG5ldyBJbWFnZVJlc291cmNlKCdhc3NldHMvdGV4dHVyZXMvdWkvc25vd2VkaW5CVU1QLnBuZycpLFxyXG5cdHZpZ25ldHRlOiBuZXcgSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3VpL3ZpZ25ldHRlLWV4cG9ydC5wbmcnKSxcclxuXHRzZWxlY3RlZF90aWxlOiBuZXcgSW1hZ2VSZXNvdXJjZSgnYXNzZXRzL3RleHR1cmVzL3VpL3NlbGVjdGVkdGlsZS5wbmcnKSxcclxufTtcclxuXHJcbi8vIFdvcmxkIHJlbGF0ZWQgYXNzZXRzXHJcbmV4cG9ydCBjb25zdCBXb3JsZEFzc2V0cyA9IHtcclxuXHRzaGFkZXJSZXNvdXJjZXM6IHtcclxuXHRcdHNreUltYWdlOiBuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy9zaGFkZXJfcmVzb3VyY2VzL3BvaXNzb25zbm93LnBuZycsXHJcblx0XHQpLFxyXG5cdH0sXHJcblx0bWlkZGxlZ3JvdW5kOiB7XHJcblx0XHR0aWxlc2V0X2ljZTogbmV3IFRpbGVSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9taWRkbGVncm91bmQvdGlsZXNldF9pY2UucG5nJyxcclxuXHRcdFx0MTYsXHJcblx0XHRcdDEsXHJcblx0XHRcdDgsXHJcblx0XHRcdDgsXHJcblx0XHQpLFxyXG5cdFx0dGlsZXNldF9zbm93OiBuZXcgVGlsZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL21pZGRsZWdyb3VuZC90aWxlc2V0X3Nub3cucG5nJyxcclxuXHRcdFx0MTYsXHJcblx0XHRcdDEsXHJcblx0XHRcdDgsXHJcblx0XHRcdDgsXHJcblx0XHQpLFxyXG5cdFx0dGlsZXNldF9kaXJ0OiBuZXcgVGlsZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL21pZGRsZWdyb3VuZC90aWxlc2V0X2RpcnQwLnBuZycsXHJcblx0XHRcdDE2LFxyXG5cdFx0XHQxLFxyXG5cdFx0XHQ4LFxyXG5cdFx0XHQ4LFxyXG5cdFx0KSxcclxuXHRcdHRpbGVzZXRfc3RvbmUwOiBuZXcgVGlsZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL21pZGRsZWdyb3VuZC90aWxlc2V0X3N0b25lMC5wbmcnLFxyXG5cdFx0XHQxNixcclxuXHRcdFx0MSxcclxuXHRcdFx0OCxcclxuXHRcdFx0OCxcclxuXHRcdCksXHJcblx0XHR0aWxlc2V0X3N0b25lMTogbmV3IFRpbGVSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9taWRkbGVncm91bmQvdGlsZXNldF9zdG9uZTEucG5nJyxcclxuXHRcdFx0MTYsXHJcblx0XHRcdDEsXHJcblx0XHRcdDgsXHJcblx0XHRcdDgsXHJcblx0XHQpLFxyXG5cdFx0dGlsZXNldF9zdG9uZTI6IG5ldyBUaWxlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvbWlkZGxlZ3JvdW5kL3RpbGVzZXRfc3RvbmUyLnBuZycsXHJcblx0XHRcdDE2LFxyXG5cdFx0XHQxLFxyXG5cdFx0XHQ4LFxyXG5cdFx0XHQ4LFxyXG5cdFx0KSxcclxuXHRcdHRpbGVzZXRfc3RvbmUzOiBuZXcgVGlsZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL21pZGRsZWdyb3VuZC90aWxlc2V0X3N0b25lMy5wbmcnLFxyXG5cdFx0XHQxNixcclxuXHRcdFx0MSxcclxuXHRcdFx0OCxcclxuXHRcdFx0OCxcclxuXHRcdCksXHJcblx0XHR0aWxlc2V0X3N0b25lNDogbmV3IFRpbGVSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9taWRkbGVncm91bmQvdGlsZXNldF9zdG9uZTQucG5nJyxcclxuXHRcdFx0MTYsXHJcblx0XHRcdDEsXHJcblx0XHRcdDgsXHJcblx0XHRcdDgsXHJcblx0XHQpLFxyXG5cdFx0dGlsZXNldF9zdG9uZTU6IG5ldyBUaWxlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvbWlkZGxlZ3JvdW5kL3RpbGVzZXRfc3RvbmU1LnBuZycsXHJcblx0XHRcdDE2LFxyXG5cdFx0XHQxLFxyXG5cdFx0XHQ4LFxyXG5cdFx0XHQ4LFxyXG5cdFx0KSxcclxuXHRcdHRpbGVzZXRfc3RvbmU2OiBuZXcgVGlsZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL21pZGRsZWdyb3VuZC90aWxlc2V0X3N0b25lNi5wbmcnLFxyXG5cdFx0XHQxNixcclxuXHRcdFx0MSxcclxuXHRcdFx0OCxcclxuXHRcdFx0OCxcclxuXHRcdCksXHJcblx0XHR0aWxlc2V0X3N0b25lNzogbmV3IFRpbGVSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9taWRkbGVncm91bmQvdGlsZXNldF9zdG9uZTcucG5nJyxcclxuXHRcdFx0MTYsXHJcblx0XHRcdDEsXHJcblx0XHRcdDgsXHJcblx0XHRcdDgsXHJcblx0XHQpLFxyXG5cdFx0dGlsZXNldF9zdG9uZTg6IG5ldyBUaWxlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvbWlkZGxlZ3JvdW5kL3RpbGVzZXRfc3RvbmU4LnBuZycsXHJcblx0XHRcdDE2LFxyXG5cdFx0XHQxLFxyXG5cdFx0XHQ4LFxyXG5cdFx0XHQ4LFxyXG5cdFx0KSxcclxuXHRcdHRpbGVzZXRfc3RvbmU5OiBuZXcgVGlsZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL21pZGRsZWdyb3VuZC90aWxlc2V0X3N0b25lOS5wbmcnLFxyXG5cdFx0XHQxNixcclxuXHRcdFx0MSxcclxuXHRcdFx0OCxcclxuXHRcdFx0OCxcclxuXHRcdCksXHJcblx0XHR0aWxlc2V0X3RpbjogbmV3IFRpbGVSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9taWRkbGVncm91bmQvdGlsZXNldF90aW4ucG5nJyxcclxuXHRcdFx0MTYsXHJcblx0XHRcdDEsXHJcblx0XHRcdDgsXHJcblx0XHRcdDgsXHJcblx0XHQpLFxyXG5cdFx0dGlsZXNldF9hbHVtaW51bTogbmV3IFRpbGVSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9taWRkbGVncm91bmQvdGlsZXNldF9hbHVtaW51bS5wbmcnLFxyXG5cdFx0XHQxNixcclxuXHRcdFx0MSxcclxuXHRcdFx0OCxcclxuXHRcdFx0OCxcclxuXHRcdCksXHJcblx0XHR0aWxlc2V0X2dvbGQ6IG5ldyBUaWxlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvbWlkZGxlZ3JvdW5kL3RpbGVzZXRfZ29sZC5wbmcnLFxyXG5cdFx0XHQxNixcclxuXHRcdFx0MSxcclxuXHRcdFx0OCxcclxuXHRcdFx0OCxcclxuXHRcdCksXHJcblx0XHR0aWxlc2V0X3RpdGFuaXVtOiBuZXcgVGlsZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL21pZGRsZWdyb3VuZC90aWxlc2V0X3RpdGFuaXVtLnBuZycsXHJcblx0XHRcdDE2LFxyXG5cdFx0XHQxLFxyXG5cdFx0XHQ4LFxyXG5cdFx0XHQ4LFxyXG5cdFx0KSxcclxuXHRcdHRpbGVzZXRfZ3JhcGU6IG5ldyBUaWxlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvbWlkZGxlZ3JvdW5kL3RpbGVzZXRfZ3JhcGUucG5nJyxcclxuXHRcdFx0MTYsXHJcblx0XHRcdDEsXHJcblx0XHRcdDgsXHJcblx0XHRcdDgsXHJcblx0XHQpLFxyXG5cdFx0dGlsZXNldF93b29kMDogbmV3IFRpbGVSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9taWRkbGVncm91bmQvd29vZDAucG5nJyxcclxuXHRcdFx0MSxcclxuXHRcdFx0MSxcclxuXHRcdFx0OCxcclxuXHRcdFx0OCxcclxuXHRcdCksXHJcblx0XHR0aWxlc2V0X3dvb2QxOiBuZXcgVGlsZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL21pZGRsZWdyb3VuZC90aWxlc2V0X3dvb2QxLnBuZycsXHJcblx0XHRcdDE2LFxyXG5cdFx0XHQxLFxyXG5cdFx0XHQ4LFxyXG5cdFx0XHQ4LFxyXG5cdFx0KSxcclxuXHRcdHRpbGVzZXRfd29vZDI6IG5ldyBUaWxlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvbWlkZGxlZ3JvdW5kL3RpbGVzZXRfd29vZDIucG5nJyxcclxuXHRcdFx0MTYsXHJcblx0XHRcdDEsXHJcblx0XHRcdDgsXHJcblx0XHRcdDgsXHJcblx0XHQpLFxyXG5cdFx0dGlsZXNldF93b29kMzogbmV3IFRpbGVSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9taWRkbGVncm91bmQvdGlsZXNldF93b29kMy5wbmcnLFxyXG5cdFx0XHQxNixcclxuXHRcdFx0MSxcclxuXHRcdFx0OCxcclxuXHRcdFx0OCxcclxuXHRcdCksXHJcblx0XHR0aWxlc2V0X3dvb2Q0OiBuZXcgVGlsZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL21pZGRsZWdyb3VuZC90aWxlc2V0X3dvb2Q0LnBuZycsXHJcblx0XHRcdDE2LFxyXG5cdFx0XHQxLFxyXG5cdFx0XHQ4LFxyXG5cdFx0XHQ4LFxyXG5cdFx0KSxcclxuXHRcdHRpbGVzZXRfd29vZDU6IG5ldyBUaWxlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvbWlkZGxlZ3JvdW5kL3RpbGVzZXRfd29vZDUucG5nJyxcclxuXHRcdFx0MTYsXHJcblx0XHRcdDEsXHJcblx0XHRcdDgsXHJcblx0XHRcdDgsXHJcblx0XHQpLFxyXG5cdFx0dGlsZXNldF93b29kNjogbmV3IFRpbGVSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9taWRkbGVncm91bmQvdGlsZXNldF93b29kNi5wbmcnLFxyXG5cdFx0XHQxNixcclxuXHRcdFx0MSxcclxuXHRcdFx0OCxcclxuXHRcdFx0OCxcclxuXHRcdCksXHJcblx0XHR0aWxlc2V0X3dvb2Q3OiBuZXcgVGlsZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL21pZGRsZWdyb3VuZC90aWxlc2V0X3dvb2Q3LnBuZycsXHJcblx0XHRcdDE2LFxyXG5cdFx0XHQxLFxyXG5cdFx0XHQ4LFxyXG5cdFx0XHQ4LFxyXG5cdFx0KSxcclxuXHRcdHRpbGVzZXRfd29vZDg6IG5ldyBUaWxlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvbWlkZGxlZ3JvdW5kL3RpbGVzZXRfd29vZDgucG5nJyxcclxuXHRcdFx0MTYsXHJcblx0XHRcdDEsXHJcblx0XHRcdDgsXHJcblx0XHRcdDgsXHJcblx0XHQpLFxyXG5cdFx0dGlsZXNldF93b29kOTogbmV3IFRpbGVSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9taWRkbGVncm91bmQvdGlsZXNldF93b29kOS5wbmcnLFxyXG5cdFx0XHQxNixcclxuXHRcdFx0MSxcclxuXHRcdFx0OCxcclxuXHRcdFx0OCxcclxuXHRcdCksXHJcblx0fSxcclxuXHRmb3JlZ3JvdW5kOiB7XHJcblx0XHRcclxuXHR9LFxyXG5cdHRpbGVFbnRpdGllczogW1xyXG5cdFx0Wy8vdHJlZVxyXG5cdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvdGlsZUVudGl0aWVzL3RyZWVzL1RyZWUxLnBuZycsXHJcblx0XHQpLFxyXG5cdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvdGlsZUVudGl0aWVzL3RyZWVzL1RyZWUyLnBuZycsXHJcblx0XHQpLFxyXG5cdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvdGlsZUVudGl0aWVzL3RyZWVzL1RyZWUzLnBuZycsXHJcblx0XHQpLFxyXG5cdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvdGlsZUVudGl0aWVzL3RyZWVzL1RyZWU0LnBuZycsXHJcblx0XHQpLFxyXG5cdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvdGlsZUVudGl0aWVzL3RyZWVzL1RyZWU1LnBuZycsXHJcblx0XHQpLFxyXG5cdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvdGlsZUVudGl0aWVzL3RyZWVzL1RyZWU2LnBuZycsXHJcblx0XHQpLFxyXG5cdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvdGlsZUVudGl0aWVzL3RyZWVzL1RyZWU3LnBuZycsXHJcblx0XHQpLFxyXG5cdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvdGlsZUVudGl0aWVzL3RyZWVzL1RyZWU4LnBuZycsXHJcblx0XHQpLFxyXG5cdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvdGlsZUVudGl0aWVzL3RyZWVzL1RyZWU5LnBuZycsXHJcblx0XHQpLFxyXG5cdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvdGlsZUVudGl0aWVzL3RyZWVzL1RyZWUxMC5wbmcnLFxyXG5cdFx0KSxcclxuXHRcdF0sXHJcblx0XHRbLy9kcmlsbCB0aWVyIDFcclxuXHRcdG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL3RpbGVFbnRpdGllcy9SdXN0eSBEcmlsbC9SdXN0eURyaWxsMS5wbmcnLFxyXG5cdFx0KSxcclxuXHRcdG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL3RpbGVFbnRpdGllcy9SdXN0eSBEcmlsbC9SdXN0eURyaWxsMi5wbmcnLFxyXG5cdFx0KSxcclxuXHRcdG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL3RpbGVFbnRpdGllcy9SdXN0eSBEcmlsbC9SdXN0eURyaWxsMy5wbmcnLFxyXG5cdFx0KSxcclxuXHRcdG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL3RpbGVFbnRpdGllcy9SdXN0eSBEcmlsbC9SdXN0eURyaWxsNC5wbmcnLFxyXG5cdFx0KSxcclxuXHRcdG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL3RpbGVFbnRpdGllcy9SdXN0eSBEcmlsbC9SdXN0eURyaWxsNS5wbmcnLFxyXG5cdFx0KSxcclxuXHRcdG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL3RpbGVFbnRpdGllcy9SdXN0eSBEcmlsbC9SdXN0eURyaWxsNi5wbmcnLFxyXG5cdFx0KSxcclxuXHRcdG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL3RpbGVFbnRpdGllcy9SdXN0eSBEcmlsbC9SdXN0eURyaWxsNy5wbmcnLFxyXG5cdFx0KSxcclxuXHRcdG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL3RpbGVFbnRpdGllcy9SdXN0eSBEcmlsbC9SdXN0eURyaWxsOC5wbmcnLFxyXG5cdFx0KSxcclxuXHRcdG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL3RpbGVFbnRpdGllcy9SdXN0eSBEcmlsbC9SdXN0eURyaWxsOS5wbmcnLFxyXG5cdFx0KSxcclxuXHRcdG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL3RpbGVFbnRpdGllcy9SdXN0eSBEcmlsbC9SdXN0eURyaWxsMTAucG5nJyxcclxuXHRcdCksXHJcblx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC90aWxlRW50aXRpZXMvUnVzdHkgRHJpbGwvUnVzdHlEcmlsbDExLnBuZycsXHJcblx0XHQpLFxyXG5cdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvdGlsZUVudGl0aWVzL1J1c3R5IERyaWxsL1J1c3R5RHJpbGwxMi5wbmcnLFxyXG5cdFx0KSxcclxuXHRcdG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL3RpbGVFbnRpdGllcy9SdXN0eSBEcmlsbC9SdXN0eURyaWxsMTMucG5nJyxcclxuXHRcdCksXHJcblx0XHRdLFxyXG5cdFx0Wy8vZHJpbGwgdGllciAyXHJcblxyXG5cdFx0XSxcclxuXHRcdFsvL2RyaWxsIHRpZXIgM1xyXG5cclxuXHRcdF0sXHJcblx0XHRbLy9kcmlsbCB0aWVyIDRcclxuXHJcblx0XHRdLFxyXG5cdFx0Wy8vZHJpbGwgdGllciA1XHJcblxyXG5cdFx0XSxcclxuXHRcdFsvL2NyYWZ0aW5nIGJlbmNoXHJcblx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC90aWxlRW50aXRpZXMvbWlzYy9jcmFmdGluZ0JlbmNoLnBuZycsXHJcblx0XHQpLFxyXG5cdFx0XSxcclxuXHRcdFsvL3NhcGxpbmcvc2VlZFxyXG5cdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvdGlsZUVudGl0aWVzL3RyZWVzL3NhcGxpbmcucG5nJyxcclxuXHRcdCksXHJcblx0XHRdXHJcblx0XSxcclxuXHRlbnRpdGllczoge1xyXG5cdFx0ZW50aXR5X3QxZHJvbmU6IFtcclxuXHRcdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9lbnRpdGllcy9TbWFsbCBEcm9uZS9TbWFsbERyb25lMDEucG5nJyxcclxuXHRcdFx0KSxcclxuXHRcdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9lbnRpdGllcy9TbWFsbCBEcm9uZS9TbWFsbERyb25lMDIucG5nJyxcclxuXHRcdFx0KSxcclxuXHRcdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9lbnRpdGllcy9TbWFsbCBEcm9uZS9TbWFsbERyb25lMDMucG5nJyxcclxuXHRcdFx0KSxcclxuXHRcdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9lbnRpdGllcy9TbWFsbCBEcm9uZS9TbWFsbERyb25lMDQucG5nJyxcclxuXHRcdFx0KSxcclxuXHRcdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9lbnRpdGllcy9TbWFsbCBEcm9uZS9TbWFsbERyb25lMDUucG5nJyxcclxuXHRcdFx0KSxcclxuXHRcdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9lbnRpdGllcy9TbWFsbCBEcm9uZS9TbWFsbERyb25lMDYucG5nJyxcclxuXHRcdFx0KSxcclxuXHRcdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9lbnRpdGllcy9TbWFsbCBEcm9uZS9TbWFsbERyb25lMDcucG5nJyxcclxuXHRcdFx0KSxcclxuXHRcdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9lbnRpdGllcy9TbWFsbCBEcm9uZS9TbWFsbERyb25lMDgucG5nJyxcclxuXHRcdFx0KSxcclxuXHRcdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9lbnRpdGllcy9TbWFsbCBEcm9uZS9TbWFsbERyb25lMDkucG5nJyxcclxuXHRcdFx0KSxcclxuXHRcdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9lbnRpdGllcy9TbWFsbCBEcm9uZS9TbWFsbERyb25lMTAucG5nJyxcclxuXHRcdFx0KSxcclxuXHRcdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9lbnRpdGllcy9TbWFsbCBEcm9uZS9TbWFsbERyb25lMTEucG5nJyxcclxuXHRcdFx0KSxcclxuXHRcdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9lbnRpdGllcy9TbWFsbCBEcm9uZS9TbWFsbERyb25lMTIucG5nJyxcclxuXHRcdFx0KSxcclxuXHRcdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9lbnRpdGllcy9TbWFsbCBEcm9uZS9TbWFsbERyb25lMTMucG5nJyxcclxuXHRcdFx0KSxcclxuXHRcdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9lbnRpdGllcy9TbWFsbCBEcm9uZS9TbWFsbERyb25lMTQucG5nJyxcclxuXHRcdFx0KSxcclxuXHRcdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9lbnRpdGllcy9TbWFsbCBEcm9uZS9TbWFsbERyb25lMTUucG5nJyxcclxuXHRcdFx0KSxcclxuXHRcdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9lbnRpdGllcy9TbWFsbCBEcm9uZS9TbWFsbERyb25lMTYucG5nJyxcclxuXHRcdFx0KSxcclxuXHRcdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9lbnRpdGllcy9TbWFsbCBEcm9uZS9TbWFsbERyb25lMTcucG5nJyxcclxuXHRcdFx0KSxcclxuXHRcdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9lbnRpdGllcy9TbWFsbCBEcm9uZS9TbWFsbERyb25lMTgucG5nJyxcclxuXHRcdFx0KSxcclxuXHRcdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9lbnRpdGllcy9TbWFsbCBEcm9uZS9TbWFsbERyb25lMTkucG5nJyxcclxuXHRcdFx0KSxcclxuXHRcdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9lbnRpdGllcy9TbWFsbCBEcm9uZS9TbWFsbERyb25lMjAucG5nJyxcclxuXHRcdFx0KSxcclxuXHRcdF0sXHJcblx0fSxcclxuXHRjbG91ZHM6IFtcclxuXHRcdG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL0Nsb3Vkcy9jbG91ZDEucG5nJyxcclxuXHRcdCksXHJcblx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9lbnRpdGllcy9DbG91ZHMvY2xvdWQyLnBuZycsXHJcblx0XHQpLFxyXG5cdFx0bmV3IEltYWdlUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvdGV4dHVyZXMvd29ybGQvZW50aXRpZXMvQ2xvdWRzL2Nsb3VkMy5wbmcnLFxyXG5cdFx0KSxcclxuXHRcdG5ldyBJbWFnZVJlc291cmNlKFxyXG5cdFx0XHQnYXNzZXRzL3RleHR1cmVzL3dvcmxkL2VudGl0aWVzL0Nsb3Vkcy9jbG91ZDQucG5nJyxcclxuXHRcdCksXHJcblx0XHRuZXcgSW1hZ2VSZXNvdXJjZShcclxuXHRcdFx0J2Fzc2V0cy90ZXh0dXJlcy93b3JsZC9lbnRpdGllcy9DbG91ZHMvY2xvdWQ1LnBuZycsXHJcblx0XHQpLFxyXG5cdF1cclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBGb250cyA9IHtcclxuXHR0aXRsZTogbmV3IEZvbnRSZXNvdXJjZShcclxuXHRcdCdhc3NldHMvdGV4dHVyZXMvdWkvZm9udC5wbmcnLFxyXG5cdFx0e1xyXG5cdFx0XHQnMCc6IDcsXHJcblx0XHRcdCcxJzogNyxcclxuXHRcdFx0JzInOiA3LFxyXG5cdFx0XHQnMyc6IDYsXHJcblx0XHRcdCc0JzogNixcclxuXHRcdFx0JzUnOiA2LFxyXG5cdFx0XHQnNic6IDYsXHJcblx0XHRcdCc3JzogNyxcclxuXHRcdFx0JzgnOiA3LFxyXG5cdFx0XHQnOSc6IDYsXHJcblx0XHRcdCdBJzogNixcclxuXHRcdFx0J0InOiA3LFxyXG5cdFx0XHQnQyc6IDcsXHJcblx0XHRcdCdEJzogNixcclxuXHRcdFx0J0UnOiA3LFxyXG5cdFx0XHQnRic6IDYsXHJcblx0XHRcdCdHJzogNyxcclxuXHRcdFx0J0gnOiA3LFxyXG5cdFx0XHQnSSc6IDcsXHJcblx0XHRcdCdKJzogOCxcclxuXHRcdFx0J0snOiA2LFxyXG5cdFx0XHQnTCc6IDYsXHJcblx0XHRcdCdNJzogOCxcclxuXHRcdFx0J04nOiA4LFxyXG5cdFx0XHQnTyc6IDgsXHJcblx0XHRcdCdQJzogOSxcclxuXHRcdFx0J1EnOiA4LFxyXG5cdFx0XHQnUic6IDcsXHJcblx0XHRcdCdTJzogNyxcclxuXHRcdFx0J1QnOiA4LFxyXG5cdFx0XHQnVSc6IDgsXHJcblx0XHRcdCdWJzogOCxcclxuXHRcdFx0J1cnOiAxMCxcclxuXHRcdFx0J1gnOiA4LFxyXG5cdFx0XHQnWSc6IDgsXHJcblx0XHRcdCdaJzogOSxcclxuXHRcdFx0J2EnOiA3LFxyXG5cdFx0XHQnYic6IDcsXHJcblx0XHRcdCdjJzogNixcclxuXHRcdFx0J2QnOiA3LFxyXG5cdFx0XHQnZSc6IDYsXHJcblx0XHRcdCdmJzogNixcclxuXHRcdFx0J2cnOiA2LFxyXG5cdFx0XHQnaCc6IDYsXHJcblx0XHRcdCdpJzogNSxcclxuXHRcdFx0J2onOiA2LFxyXG5cdFx0XHQnayc6IDUsXHJcblx0XHRcdCdsJzogNSxcclxuXHRcdFx0J20nOiA4LFxyXG5cdFx0XHQnbic6IDUsXHJcblx0XHRcdCdvJzogNSxcclxuXHRcdFx0J3AnOiA1LFxyXG5cdFx0XHQncSc6IDcsXHJcblx0XHRcdCdyJzogNSxcclxuXHRcdFx0J3MnOiA0LFxyXG5cdFx0XHQndCc6IDUsXHJcblx0XHRcdCd1JzogNSxcclxuXHRcdFx0J3YnOiA1LFxyXG5cdFx0XHQndyc6IDcsXHJcblx0XHRcdCd4JzogNixcclxuXHRcdFx0J3knOiA1LFxyXG5cdFx0XHQneic6IDUsXHJcblx0XHRcdCchJzogNCxcclxuXHRcdFx0Jy4nOiAyLFxyXG5cdFx0XHQnLCc6IDIsXHJcblx0XHRcdCc/JzogNixcclxuXHRcdFx0J18nOiA2LFxyXG5cdFx0XHQnLSc6IDQsXHJcblx0XHRcdCc6JzogMixcclxuXHRcdFx0J+KGkSc6IDcsXHJcblx0XHRcdCfihpMnOiA3LFxyXG5cdFx0XHQnICc6IDIsXHJcblx0XHR9LFxyXG5cdFx0J0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5IS4sP18tOuKGkeKGkyAnLFxyXG5cdFx0MTIsXHJcblx0KSxcclxuXHJcblx0YmlnOiBuZXcgRm9udFJlc291cmNlKFxyXG5cdFx0J2Fzc2V0cy90ZXh0dXJlcy91aS9mb250QmlnLnBuZycsXHJcblx0XHR7XHJcblx0XHRcdCcwJzogMTUsXHJcblx0XHRcdCcxJzogMTQsXHJcblx0XHRcdCcyJzogMTQsXHJcblx0XHRcdCczJzogMTMsXHJcblx0XHRcdCc0JzogMTIsXHJcblx0XHRcdCc1JzogMTMsXHJcblx0XHRcdCc2JzogMTIsXHJcblx0XHRcdCc3JzogMTQsXHJcblx0XHRcdCc4JzogMTUsXHJcblx0XHRcdCc5JzogMTIsXHJcblx0XHRcdCdBJzogMTMsXHJcblx0XHRcdCdCJzogMTQsXHJcblx0XHRcdCdDJzogMTUsXHJcblx0XHRcdCdEJzogMTIsXHJcblx0XHRcdCdFJzogMTQsXHJcblx0XHRcdCdGJzogMTMsXHJcblx0XHRcdCdHJzogMTQsXHJcblx0XHRcdCdIJzogMTUsXHJcblx0XHRcdCdJJzogMTUsXHJcblx0XHRcdCdKJzogMTYsXHJcblx0XHRcdCdLJzogMTIsXHJcblx0XHRcdCdMJzogMTMsXHJcblx0XHRcdCdNJzogMTYsXHJcblx0XHRcdCdOJzogMTcsXHJcblx0XHRcdCdPJzogMTcsXHJcblx0XHRcdCdQJzogMTksXHJcblx0XHRcdCdRJzogMTcsXHJcblx0XHRcdCdSJzogMTQsXHJcblx0XHRcdCdTJzogMTUsXHJcblx0XHRcdCdUJzogMTcsXHJcblx0XHRcdCdVJzogMTYsXHJcblx0XHRcdCdWJzogMTcsXHJcblx0XHRcdCdXJzogMjEsXHJcblx0XHRcdCdYJzogMTcsXHJcblx0XHRcdCdZJzogMTcsXHJcblx0XHRcdCdaJzogMTksXHJcblx0XHRcdCdhJzogMTIsXHJcblx0XHRcdCdiJzogMTUsXHJcblx0XHRcdCdjJzogMTIsXHJcblx0XHRcdCdkJzogMTUsXHJcblx0XHRcdCdlJzogMTMsXHJcblx0XHRcdCdmJzogMTIsXHJcblx0XHRcdCdnJzogMTMsXHJcblx0XHRcdCdoJzogMTIsXHJcblx0XHRcdCdpJzogMTEsXHJcblx0XHRcdCdqJzogMTIsXHJcblx0XHRcdCdrJzogMTAsXHJcblx0XHRcdCdsJzogMTAsXHJcblx0XHRcdCdtJzogMTYsXHJcblx0XHRcdCduJzogMTEsXHJcblx0XHRcdCdvJzogMTAsXHJcblx0XHRcdCdwJzogMTEsXHJcblx0XHRcdCdxJzogMTQsXHJcblx0XHRcdCdyJzogMTEsXHJcblx0XHRcdCdzJzogOCxcclxuXHRcdFx0J3QnOiAxMSxcclxuXHRcdFx0J3UnOiAxMCxcclxuXHRcdFx0J3YnOiAxMSxcclxuXHRcdFx0J3cnOiAxNSxcclxuXHRcdFx0J3gnOiAxMixcclxuXHRcdFx0J3knOiAxMSxcclxuXHRcdFx0J3onOiAxMCxcclxuXHRcdFx0JyEnOiA5LFxyXG5cdFx0XHQnLic6IDQsXHJcblx0XHRcdCcsJzogNCxcclxuXHRcdFx0Jz8nOiAxMyxcclxuXHRcdFx0J18nOiAxMyxcclxuXHRcdFx0Jy0nOiA4LFxyXG5cdFx0XHQnOic6IDQsXHJcblx0XHRcdCcgJzogNCxcclxuXHRcdH0sXHJcblx0XHQnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkhLiw/Xy06ICcsXHJcblx0XHQyNCxcclxuXHQpLFxyXG5cdHRvbV90aHVtYjogbmV3IEZvbnRSZXNvdXJjZShcclxuXHRcdCdhc3NldHMvdGV4dHVyZXMvdWkvdG9tX3RodW1iLnBuZycsXHJcblx0XHR7XHJcblx0XHRcdCdBJzogMyxcclxuXHRcdFx0J0InOiAzLFxyXG5cdFx0XHQnQyc6IDMsXHJcblx0XHRcdCdEJzogMyxcclxuXHRcdFx0J0UnOiAzLFxyXG5cdFx0XHQnRic6IDMsXHJcblx0XHRcdCdHJzogMyxcclxuXHRcdFx0J0gnOiAzLFxyXG5cdFx0XHQnSSc6IDMsXHJcblx0XHRcdCdKJzogMyxcclxuXHRcdFx0J0snOiAzLFxyXG5cdFx0XHQnTCc6IDMsXHJcblx0XHRcdCdNJzogMyxcclxuXHRcdFx0J04nOiAzLFxyXG5cdFx0XHQnTyc6IDMsXHJcblx0XHRcdCdQJzogMyxcclxuXHRcdFx0J1EnOiAzLFxyXG5cdFx0XHQnUic6IDMsXHJcblx0XHRcdCdTJzogMyxcclxuXHRcdFx0J1QnOiAzLFxyXG5cdFx0XHQnVSc6IDMsXHJcblx0XHRcdCdWJzogMyxcclxuXHRcdFx0J1cnOiAzLFxyXG5cdFx0XHQnWCc6IDMsXHJcblx0XHRcdCdZJzogMyxcclxuXHRcdFx0J1onOiAzLFxyXG5cdFx0XHQnYSc6IDMsXHJcblx0XHRcdCdiJzogMyxcclxuXHRcdFx0J2MnOiAzLFxyXG5cdFx0XHQnZCc6IDMsXHJcblx0XHRcdCdlJzogMyxcclxuXHRcdFx0J2YnOiAzLFxyXG5cdFx0XHQnZyc6IDMsXHJcblx0XHRcdCdoJzogMyxcclxuXHRcdFx0J2knOiAzLFxyXG5cdFx0XHQnaic6IDMsXHJcblx0XHRcdCdrJzogMyxcclxuXHRcdFx0J2wnOiAzLFxyXG5cdFx0XHQnbSc6IDMsXHJcblx0XHRcdCduJzogMyxcclxuXHRcdFx0J28nOiAzLFxyXG5cdFx0XHQncCc6IDMsXHJcblx0XHRcdCdxJzogMyxcclxuXHRcdFx0J3InOiAzLFxyXG5cdFx0XHQncyc6IDMsXHJcblx0XHRcdCd0JzogMyxcclxuXHRcdFx0J3UnOiAzLFxyXG5cdFx0XHQndic6IDMsXHJcblx0XHRcdCd3JzogMyxcclxuXHRcdFx0J3gnOiAzLFxyXG5cdFx0XHQneSc6IDMsXHJcblx0XHRcdCd6JzogMyxcclxuXHRcdFx0J1snOiAzLFxyXG5cdFx0XHQnXFxcXCc6IDMsXHJcblx0XHRcdCddJzogMyxcclxuXHRcdFx0J14nOiAzLFxyXG5cdFx0XHQnICc6IDMsXHJcblx0XHRcdCchJzogMyxcclxuXHRcdFx0J1wiJzogMyxcclxuXHRcdFx0JyMnOiAzLFxyXG5cdFx0XHQnJCc6IDMsXHJcblx0XHRcdCclJzogMyxcclxuXHRcdFx0JyYnOiAzLFxyXG5cdFx0XHRcIidcIjogMyxcclxuXHRcdFx0JygnOiAzLFxyXG5cdFx0XHQnKSc6IDMsXHJcblx0XHRcdCcqJzogMyxcclxuXHRcdFx0JysnOiAzLFxyXG5cdFx0XHQnLCc6IDMsXHJcblx0XHRcdCctJzogMyxcclxuXHRcdFx0Jy4nOiAzLFxyXG5cdFx0XHQnLyc6IDMsXHJcblx0XHRcdCcwJzogMyxcclxuXHRcdFx0JzEnOiAzLFxyXG5cdFx0XHQnMic6IDMsXHJcblx0XHRcdCczJzogMyxcclxuXHRcdFx0JzQnOiAzLFxyXG5cdFx0XHQnNSc6IDMsXHJcblx0XHRcdCc2JzogMyxcclxuXHRcdFx0JzcnOiAzLFxyXG5cdFx0XHQnOCc6IDMsXHJcblx0XHRcdCc5JzogMyxcclxuXHRcdFx0JzonOiAzLFxyXG5cdFx0XHQnOyc6IDMsXHJcblx0XHRcdCc8JzogMyxcclxuXHRcdFx0Jz0nOiAzLFxyXG5cdFx0XHQnPic6IDMsXHJcblx0XHRcdCc/JzogMyxcclxuXHRcdH0sXHJcblx0XHRgQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5eltcXFxcXV4gIVwiIyQlJicoKSorLC0uLzAxMjM0NTY3ODk6Ozw9Pj9gLFxyXG5cdFx0NSxcclxuXHQpLFxyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IEtleXMgPSB7XHJcblx0a2V5Ym9hcmRNYXA6IFtcclxuXHRcdCcnLCAvLyBbMF1cclxuXHRcdCcnLCAvLyBbMV1cclxuXHRcdCcnLCAvLyBbMl1cclxuXHRcdCdDQU5DRUwnLCAvLyBbM11cclxuXHRcdCcnLCAvLyBbNF1cclxuXHRcdCcnLCAvLyBbNV1cclxuXHRcdCdIRUxQJywgLy8gWzZdXHJcblx0XHQnJywgLy8gWzddXHJcblx0XHQnQkFDS1NQQUNFJywgLy8gWzhdXHJcblx0XHQnVEFCJywgLy8gWzldXHJcblx0XHQnJywgLy8gWzEwXVxyXG5cdFx0JycsIC8vIFsxMV1cclxuXHRcdCdDTEVBUicsIC8vIFsxMl1cclxuXHRcdCdFTlRFUicsIC8vIFsxM11cclxuXHRcdCdFTlRFUiBTUEVDSUFMJywgLy8gWzE0XVxyXG5cdFx0JycsIC8vIFsxNV1cclxuXHRcdCdTSElGVCcsIC8vIFsxNl1cclxuXHRcdCdDT05UUk9MJywgLy8gWzE3XVxyXG5cdFx0J0FMVCcsIC8vIFsxOF1cclxuXHRcdCdQQVVTRScsIC8vIFsxOV1cclxuXHRcdCdDQVBTIExPQ0snLCAvLyBbMjBdXHJcblx0XHQnS0FOQScsIC8vIFsyMV1cclxuXHRcdCdFSVNVJywgLy8gWzIyXVxyXG5cdFx0J0pVTkpBJywgLy8gWzIzXVxyXG5cdFx0J0ZJTkFMJywgLy8gWzI0XVxyXG5cdFx0J0hBTkpBJywgLy8gWzI1XVxyXG5cdFx0JycsIC8vIFsyNl1cclxuXHRcdCdFU0NBUEUnLCAvLyBbMjddXHJcblx0XHQnQ09OVkVSVCcsIC8vIFsyOF1cclxuXHRcdCdOT05DT05WRVJUJywgLy8gWzI5XVxyXG5cdFx0J0FDQ0VQVCcsIC8vIFszMF1cclxuXHRcdCdNT0RFQ0hBTkdFJywgLy8gWzMxXVxyXG5cdFx0J1NQQUNFJywgLy8gWzMyXVxyXG5cdFx0J1BBR0UgVVAnLCAvLyBbMzNdXHJcblx0XHQnUEFHRSBET1dOJywgLy8gWzM0XVxyXG5cdFx0J0VORCcsIC8vIFszNV1cclxuXHRcdCdIT01FJywgLy8gWzM2XVxyXG5cdFx0J0xFRlQnLCAvLyBbMzddXHJcblx0XHQnVVAnLCAvLyBbMzhdXHJcblx0XHQnUklHSFQnLCAvLyBbMzldXHJcblx0XHQnRE9XTicsIC8vIFs0MF1cclxuXHRcdCdTRUxFQ1QnLCAvLyBbNDFdXHJcblx0XHQnUFJJTlQnLCAvLyBbNDJdXHJcblx0XHQnRVhFQ1VURScsIC8vIFs0M11cclxuXHRcdCdQUklOVCBTQ1JFRU4nLCAvLyBbNDRdXHJcblx0XHQnSU5TRVJUJywgLy8gWzQ1XVxyXG5cdFx0J0RFTEVURScsIC8vIFs0Nl1cclxuXHRcdCcnLCAvLyBbNDddXHJcblx0XHQnMCcsIC8vIFs0OF1cclxuXHRcdCcxJywgLy8gWzQ5XVxyXG5cdFx0JzInLCAvLyBbNTBdXHJcblx0XHQnMycsIC8vIFs1MV1cclxuXHRcdCc0JywgLy8gWzUyXVxyXG5cdFx0JzUnLCAvLyBbNTNdXHJcblx0XHQnNicsIC8vIFs1NF1cclxuXHRcdCc3JywgLy8gWzU1XVxyXG5cdFx0JzgnLCAvLyBbNTZdXHJcblx0XHQnOScsIC8vIFs1N11cclxuXHRcdCdDT0xPTicsIC8vIFs1OF1cclxuXHRcdCdTRU1JQ09MT04nLCAvLyBbNTldXHJcblx0XHQnTEVTUyBUSEFOJywgLy8gWzYwXVxyXG5cdFx0J0VRVUFMUycsIC8vIFs2MV1cclxuXHRcdCdHUkVBVEVSIFRIQU4nLCAvLyBbNjJdXHJcblx0XHQnUVVFU1RJT04gTUFSSycsIC8vIFs2M11cclxuXHRcdCdBVCcsIC8vIFs2NF1cclxuXHRcdCdBJywgLy8gWzY1XVxyXG5cdFx0J0InLCAvLyBbNjZdXHJcblx0XHQnQycsIC8vIFs2N11cclxuXHRcdCdEJywgLy8gWzY4XVxyXG5cdFx0J0UnLCAvLyBbNjldXHJcblx0XHQnRicsIC8vIFs3MF1cclxuXHRcdCdHJywgLy8gWzcxXVxyXG5cdFx0J0gnLCAvLyBbNzJdXHJcblx0XHQnSScsIC8vIFs3M11cclxuXHRcdCdKJywgLy8gWzc0XVxyXG5cdFx0J0snLCAvLyBbNzVdXHJcblx0XHQnTCcsIC8vIFs3Nl1cclxuXHRcdCdNJywgLy8gWzc3XVxyXG5cdFx0J04nLCAvLyBbNzhdXHJcblx0XHQnTycsIC8vIFs3OV1cclxuXHRcdCdQJywgLy8gWzgwXVxyXG5cdFx0J1EnLCAvLyBbODFdXHJcblx0XHQnUicsIC8vIFs4Ml1cclxuXHRcdCdTJywgLy8gWzgzXVxyXG5cdFx0J1QnLCAvLyBbODRdXHJcblx0XHQnVScsIC8vIFs4NV1cclxuXHRcdCdWJywgLy8gWzg2XVxyXG5cdFx0J1cnLCAvLyBbODddXHJcblx0XHQnWCcsIC8vIFs4OF1cclxuXHRcdCdZJywgLy8gWzg5XVxyXG5cdFx0J1onLCAvLyBbOTBdXHJcblx0XHQnT1MgS0VZJywgLy8gWzkxXSBXaW5kb3dzIEtleSAoV2luZG93cykgb3IgQ29tbWFuZCBLZXkgKE1hYylcclxuXHRcdCcnLCAvLyBbOTJdXHJcblx0XHQnQ09OVEVYVCBNRU5VJywgLy8gWzkzXVxyXG5cdFx0JycsIC8vIFs5NF1cclxuXHRcdCdTTEVFUCcsIC8vIFs5NV1cclxuXHRcdCdOVU1QQUQwJywgLy8gWzk2XVxyXG5cdFx0J05VTVBBRDEnLCAvLyBbOTddXHJcblx0XHQnTlVNUEFEMicsIC8vIFs5OF1cclxuXHRcdCdOVU1QQUQzJywgLy8gWzk5XVxyXG5cdFx0J05VTVBBRDQnLCAvLyBbMTAwXVxyXG5cdFx0J05VTVBBRDUnLCAvLyBbMTAxXVxyXG5cdFx0J05VTVBBRDYnLCAvLyBbMTAyXVxyXG5cdFx0J05VTVBBRDcnLCAvLyBbMTAzXVxyXG5cdFx0J05VTVBBRDgnLCAvLyBbMTA0XVxyXG5cdFx0J05VTVBBRDknLCAvLyBbMTA1XVxyXG5cdFx0J01VTFRJUExZJywgLy8gWzEwNl1cclxuXHRcdCdBREQnLCAvLyBbMTA3XVxyXG5cdFx0J1NFUEFSQVRPUicsIC8vIFsxMDhdXHJcblx0XHQnU1VCVFJBQ1QnLCAvLyBbMTA5XVxyXG5cdFx0J0RFQ0lNQUwnLCAvLyBbMTEwXVxyXG5cdFx0J0RJVklERScsIC8vIFsxMTFdXHJcblx0XHQnRjEnLCAvLyBbMTEyXVxyXG5cdFx0J0YyJywgLy8gWzExM11cclxuXHRcdCdGMycsIC8vIFsxMTRdXHJcblx0XHQnRjQnLCAvLyBbMTE1XVxyXG5cdFx0J0Y1JywgLy8gWzExNl1cclxuXHRcdCdGNicsIC8vIFsxMTddXHJcblx0XHQnRjcnLCAvLyBbMTE4XVxyXG5cdFx0J0Y4JywgLy8gWzExOV1cclxuXHRcdCdGOScsIC8vIFsxMjBdXHJcblx0XHQnRjEwJywgLy8gWzEyMV1cclxuXHRcdCdGMTEnLCAvLyBbMTIyXVxyXG5cdFx0J0YxMicsIC8vIFsxMjNdXHJcblx0XHQnRjEzJywgLy8gWzEyNF1cclxuXHRcdCdGMTQnLCAvLyBbMTI1XVxyXG5cdFx0J0YxNScsIC8vIFsxMjZdXHJcblx0XHQnRjE2JywgLy8gWzEyN11cclxuXHRcdCdGMTcnLCAvLyBbMTI4XVxyXG5cdFx0J0YxOCcsIC8vIFsxMjldXHJcblx0XHQnRjE5JywgLy8gWzEzMF1cclxuXHRcdCdGMjAnLCAvLyBbMTMxXVxyXG5cdFx0J0YyMScsIC8vIFsxMzJdXHJcblx0XHQnRjIyJywgLy8gWzEzM11cclxuXHRcdCdGMjMnLCAvLyBbMTM0XVxyXG5cdFx0J0YyNCcsIC8vIFsxMzVdXHJcblx0XHQnJywgLy8gWzEzNl1cclxuXHRcdCcnLCAvLyBbMTM3XVxyXG5cdFx0JycsIC8vIFsxMzhdXHJcblx0XHQnJywgLy8gWzEzOV1cclxuXHRcdCcnLCAvLyBbMTQwXVxyXG5cdFx0JycsIC8vIFsxNDFdXHJcblx0XHQnJywgLy8gWzE0Ml1cclxuXHRcdCcnLCAvLyBbMTQzXVxyXG5cdFx0J05VTSBMT0NLJywgLy8gWzE0NF1cclxuXHRcdCdTQ1JPTEwgTE9DSycsIC8vIFsxNDVdXHJcblx0XHQnV0lOIE9FTSBGSiBKSVNITycsIC8vIFsxNDZdXHJcblx0XHQnV0lOIE9FTSBGSiBNQVNTSE9VJywgLy8gWzE0N11cclxuXHRcdCdXSU4gT0VNIEZKIFRPVVJPS1UnLCAvLyBbMTQ4XVxyXG5cdFx0J1dJTiBPRU0gRkogTE9ZQScsIC8vIFsxNDldXHJcblx0XHQnV0lOIE9FTSBGSiBST1lBJywgLy8gWzE1MF1cclxuXHRcdCcnLCAvLyBbMTUxXVxyXG5cdFx0JycsIC8vIFsxNTJdXHJcblx0XHQnJywgLy8gWzE1M11cclxuXHRcdCcnLCAvLyBbMTU0XVxyXG5cdFx0JycsIC8vIFsxNTVdXHJcblx0XHQnJywgLy8gWzE1Nl1cclxuXHRcdCcnLCAvLyBbMTU3XVxyXG5cdFx0JycsIC8vIFsxNThdXHJcblx0XHQnJywgLy8gWzE1OV1cclxuXHRcdCdDSVJDVU1GTEVYJywgLy8gWzE2MF1cclxuXHRcdCdFWENMQU1BVElPTicsIC8vIFsxNjFdXHJcblx0XHQnRE9VQkxFX1FVT1RFJywgLy8gWzE2Ml1cclxuXHRcdCdIQVNIJywgLy8gWzE2M11cclxuXHRcdCdET0xMQVInLCAvLyBbMTY0XVxyXG5cdFx0J1BFUkNFTlQnLCAvLyBbMTY1XVxyXG5cdFx0J0FNUEVSU0FORCcsIC8vIFsxNjZdXHJcblx0XHQnVU5ERVJTQ09SRScsIC8vIFsxNjddXHJcblx0XHQnT1BFTiBQQVJFTlRIRVNJUycsIC8vIFsxNjhdXHJcblx0XHQnQ0xPU0UgUEFSRU5USEVTSVMnLCAvLyBbMTY5XVxyXG5cdFx0J0FTVEVSSVNLJywgLy8gWzE3MF1cclxuXHRcdCdQTFVTJywgLy8gWzE3MV1cclxuXHRcdCdQSVBFJywgLy8gWzE3Ml1cclxuXHRcdCdIWVBIRU4nLCAvLyBbMTczXVxyXG5cdFx0J09QRU4gQ1VSTFkgQlJBQ0tFVCcsIC8vIFsxNzRdXHJcblx0XHQnQ0xPU0UgQ1VSTFkgQlJBQ0tFVCcsIC8vIFsxNzVdXHJcblx0XHQnVElMREUnLCAvLyBbMTc2XVxyXG5cdFx0JycsIC8vIFsxNzddXHJcblx0XHQnJywgLy8gWzE3OF1cclxuXHRcdCcnLCAvLyBbMTc5XVxyXG5cdFx0JycsIC8vIFsxODBdXHJcblx0XHQnVk9MVU1FIE1VVEUnLCAvLyBbMTgxXVxyXG5cdFx0J1ZPTFVNRSBET1dOJywgLy8gWzE4Ml1cclxuXHRcdCdWT0xVTUUgVVAnLCAvLyBbMTgzXVxyXG5cdFx0JycsIC8vIFsxODRdXHJcblx0XHQnJywgLy8gWzE4NV1cclxuXHRcdCdTRU1JQ09MT04nLCAvLyBbMTg2XVxyXG5cdFx0J0VRVUFMUycsIC8vIFsxODddXHJcblx0XHQnQ09NTUEnLCAvLyBbMTg4XVxyXG5cdFx0J01JTlVTJywgLy8gWzE4OV1cclxuXHRcdCdQRVJJT0QnLCAvLyBbMTkwXVxyXG5cdFx0J1NMQVNIJywgLy8gWzE5MV1cclxuXHRcdCdCQUNLIFFVT1RFJywgLy8gWzE5Ml1cclxuXHRcdCcnLCAvLyBbMTkzXVxyXG5cdFx0JycsIC8vIFsxOTRdXHJcblx0XHQnJywgLy8gWzE5NV1cclxuXHRcdCcnLCAvLyBbMTk2XVxyXG5cdFx0JycsIC8vIFsxOTddXHJcblx0XHQnJywgLy8gWzE5OF1cclxuXHRcdCcnLCAvLyBbMTk5XVxyXG5cdFx0JycsIC8vIFsyMDBdXHJcblx0XHQnJywgLy8gWzIwMV1cclxuXHRcdCcnLCAvLyBbMjAyXVxyXG5cdFx0JycsIC8vIFsyMDNdXHJcblx0XHQnJywgLy8gWzIwNF1cclxuXHRcdCcnLCAvLyBbMjA1XVxyXG5cdFx0JycsIC8vIFsyMDZdXHJcblx0XHQnJywgLy8gWzIwN11cclxuXHRcdCcnLCAvLyBbMjA4XVxyXG5cdFx0JycsIC8vIFsyMDldXHJcblx0XHQnJywgLy8gWzIxMF1cclxuXHRcdCcnLCAvLyBbMjExXVxyXG5cdFx0JycsIC8vIFsyMTJdXHJcblx0XHQnJywgLy8gWzIxM11cclxuXHRcdCcnLCAvLyBbMjE0XVxyXG5cdFx0JycsIC8vIFsyMTVdXHJcblx0XHQnJywgLy8gWzIxNl1cclxuXHRcdCcnLCAvLyBbMjE3XVxyXG5cdFx0JycsIC8vIFsyMThdXHJcblx0XHQnT1BFTiBCUkFDS0VUJywgLy8gWzIxOV1cclxuXHRcdCdCQUNLIFNMQVNIJywgLy8gWzIyMF1cclxuXHRcdCdDTE9TRSBCUkFDS0VUJywgLy8gWzIyMV1cclxuXHRcdCdRVU9URScsIC8vIFsyMjJdXHJcblx0XHQnJywgLy8gWzIyM11cclxuXHRcdCdNRVRBJywgLy8gWzIyNF1cclxuXHRcdCdBTFQgR1JBUEgnLCAvLyBbMjI1XVxyXG5cdFx0JycsIC8vIFsyMjZdXHJcblx0XHQnV0lOIElDTyBIRUxQJywgLy8gWzIyN11cclxuXHRcdCdXSU4gSUNPIDAwJywgLy8gWzIyOF1cclxuXHRcdCcnLCAvLyBbMjI5XVxyXG5cdFx0J1dJTiBJQ08gQ0xFQVInLCAvLyBbMjMwXVxyXG5cdFx0JycsIC8vIFsyMzFdXHJcblx0XHQnJywgLy8gWzIzMl1cclxuXHRcdCdXSU4gT0VNIFJFU0VUJywgLy8gWzIzM11cclxuXHRcdCdXSU4gT0VNIEpVTVAnLCAvLyBbMjM0XVxyXG5cdFx0J1dJTiBPRU0gUEExJywgLy8gWzIzNV1cclxuXHRcdCdXSU4gT0VNIFBBMicsIC8vIFsyMzZdXHJcblx0XHQnV0lOIE9FTSBQQTMnLCAvLyBbMjM3XVxyXG5cdFx0J1dJTiBPRU0gV1NDVFJMJywgLy8gWzIzOF1cclxuXHRcdCdXSU4gT0VNIENVU0VMJywgLy8gWzIzOV1cclxuXHRcdCdXSU4gT0VNIEFUVE4nLCAvLyBbMjQwXVxyXG5cdFx0J1dJTiBPRU0gRklOSVNIJywgLy8gWzI0MV1cclxuXHRcdCdXSU4gT0VNIENPUFknLCAvLyBbMjQyXVxyXG5cdFx0J1dJTiBPRU0gQVVUTycsIC8vIFsyNDNdXHJcblx0XHQnV0lOIE9FTSBFTkxXJywgLy8gWzI0NF1cclxuXHRcdCdXSU4gT0VNIEJBQ0tUQUInLCAvLyBbMjQ1XVxyXG5cdFx0J0FUVE4nLCAvLyBbMjQ2XVxyXG5cdFx0J0NSU0VMJywgLy8gWzI0N11cclxuXHRcdCdFWFNFTCcsIC8vIFsyNDhdXHJcblx0XHQnRVJFT0YnLCAvLyBbMjQ5XVxyXG5cdFx0J1BMQVknLCAvLyBbMjUwXVxyXG5cdFx0J1pPT00nLCAvLyBbMjUxXVxyXG5cdFx0JycsIC8vIFsyNTJdXHJcblx0XHQnUEExJywgLy8gWzI1M11cclxuXHRcdCdXSU4gT0VNIENMRUFSJywgLy8gWzI1NF1cclxuXHRcdCdUT0dHTEUgVE9VQ0hQQUQnLCAvLyBbMjU1XVxyXG5cdF0sIC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzE3NzIxNzkvZ2V0LWNoYXJhY3Rlci12YWx1ZS1mcm9tLWtleWNvZGUtaW4tamF2YXNjcmlwdC10aGVuLXRyaW1cclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBBdWRpb0Fzc2V0cyA9IHtcclxuXHR1aToge1xyXG5cdFx0aW52ZW50b3J5Q2xhY2s6IG5ldyBBdWRpb1Jlc291cmNlR3JvdXAoW1xyXG5cdFx0XHRuZXcgQXVkaW9SZXNvdXJjZSgnYXNzZXRzL3NvdW5kcy9zZngvdWkvY2xhY2sxLm1wMycpLFxyXG5cdFx0XHRuZXcgQXVkaW9SZXNvdXJjZSgnYXNzZXRzL3NvdW5kcy9zZngvdWkvY2xhY2syLm1wMycpLFxyXG5cdFx0XHRuZXcgQXVkaW9SZXNvdXJjZSgnYXNzZXRzL3NvdW5kcy9zZngvdWkvY2xhY2szLm1wMycpLFxyXG5cdFx0XSksXHJcblx0fSxcclxuXHRtdXNpYzoge1xyXG5cdFx0dGl0bGVTY3JlZW46IG5ldyBBdWRpb1Jlc291cmNlKCdhc3NldHMvc291bmRzL211c2ljL1RpdGxlU2NyZWVuLm1wMycpLFxyXG5cdH0sXHJcblx0YW1iaWVudDoge1xyXG5cdFx0d2ludGVyMTogbmV3IEF1ZGlvUmVzb3VyY2UoXHJcblx0XHRcdCdhc3NldHMvc291bmRzL3NmeC9hbWJpZW50LzY1ODEzX19wY2FlbGRyaWVzX19jb3VudHJ5c2lkZXdpbnRlcmV2ZW5pbmcwMi53YXYnLFxyXG5cdFx0KSxcclxuXHR9LFxyXG59O1xyXG5cclxuZXhwb3J0IHR5cGUgQW5pbWF0aW9uRnJhbWU8VCBleHRlbmRzIFJlY29yZDxzdHJpbmcsIFtJbWFnZVJlc291cmNlLCBudW1iZXJdW10+PiA9IGtleW9mIFQ7XHJcblxyXG4vLyBjb25zdCBhbmltYXRpb25zID0gPFQgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBJbWFnZVJlc291cmNlW10+PihkYXRhOiBUKTogVCA9PiBkYXRhXHJcblxyXG5leHBvcnQgY29uc3QgbG9hZEFzc2V0cyA9IChza2V0Y2g6IFA1LCAuLi5hc3NldHM6IEFzc2V0R3JvdXBbXSkgPT4ge1xyXG5cdGFzc2V0cy5mb3JFYWNoKGFzc2V0R3JvdXAgPT4ge1xyXG5cdFx0c2VhcmNoR3JvdXAoYXNzZXRHcm91cCwgc2tldGNoKTtcclxuXHR9KTtcclxufTtcclxuXHJcbmZ1bmN0aW9uIHNlYXJjaEdyb3VwKFxyXG5cdGFzc2V0R3JvdXA6XHJcblx0XHR8IEFzc2V0R3JvdXBcclxuXHRcdHwgUmVzb3VyY2VcclxuXHRcdHwgQXVkaW9SZXNvdXJjZVxyXG5cdFx0fCBBdWRpb1Jlc291cmNlR3JvdXAsXHJcblx0c2tldGNoOiBQNSxcclxuKSB7XHJcblx0aWYgKGFzc2V0R3JvdXAgaW5zdGFuY2VvZiBSZXNvdXJjZSkge1xyXG5cdFx0Y29uc29sZS5sb2coYExvYWRpbmcgYXNzZXQgJHthc3NldEdyb3VwLnBhdGh9YCk7XHJcblx0XHRhc3NldEdyb3VwLmxvYWRSZXNvdXJjZShza2V0Y2gpO1xyXG5cdFx0cmV0dXJuO1xyXG5cdH1cclxuXHRPYmplY3QuZW50cmllcyhhc3NldEdyb3VwKS5mb3JFYWNoKGFzc2V0ID0+IHtcclxuXHRcdHNlYXJjaEdyb3VwKGFzc2V0WzFdLCBza2V0Y2gpO1xyXG5cdH0pO1xyXG59XHJcbiIsImltcG9ydCBQNSBmcm9tICdwNSc7XHJcbmltcG9ydCB7IFJlc291cmNlIH0gZnJvbSAnLi9SZXNvdXJjZSc7XHJcblxyXG5leHBvcnQgY2xhc3MgQXVkaW9SZXNvdXJjZSBleHRlbmRzIFJlc291cmNlIHtcclxuICAgIC8vIHNvdW5kOiBBdWRpb1R5cGVcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwYXRoOiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcihwYXRoKTtcclxuICAgIH1cclxuXHJcbiAgICBsb2FkUmVzb3VyY2UoZ2FtZTogUDUpIHtcclxuICAgICAgICAvLyB0aGlzLnNvdW5kID0gQXVkaW8oe1xyXG4gICAgICAgIC8vICAgICBmaWxlOiB0aGlzLnBhdGgsXHJcbiAgICAgICAgLy8gICAgIGxvb3A6IGZhbHNlLFxyXG4gICAgICAgIC8vICAgICB2b2x1bWU6IDEuMCxcclxuICAgICAgICAvLyB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBwbGF5UmFuZG9tKCkge1xyXG4gICAgLy8gICAgIC8vIFZlcmlmeSB0aGF0IHRoZSBzb3VuZCBoYXMgYmVlbiBsb2FkZWRcclxuICAgIC8vICAgICBpZiAodGhpcy5zb3VuZCA9PT0gdW5kZWZpbmVkKVxyXG4gICAgLy8gICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAvLyAgICAgICAgICAgICBgVHJpZWQgdG8gcGxheSBzb3VuZCBiZWZvcmUgbG9hZGluZyBpdDogJHt0aGlzLnBhdGh9YFxyXG4gICAgLy8gICAgICAgICApO1xyXG5cclxuICAgIC8vICAgICB0aGlzLnNvdW5kLnBsYXkoKTtcclxuICAgIC8vIH1cclxuXHJcbiAgICBwbGF5U291bmQoKSB7Ly8gcGxheSB0aGUgc291bmRcclxuICAgICAgICAvL1ZlcmlmeSB0aGF0IHRoZSBzb3VuZCBoYXMgYmVlbiBsb2FkZWRcclxuICAgICAgICAvLyBpZiAodGhpcy5zb3VuZCA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgIC8vICAgICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAgICAgLy8gICAgICAgICBgVHJpZWQgdG8gcGxheSBzb3VuZCBiZWZvcmUgbG9hZGluZyBpdDogJHt0aGlzLnBhdGh9YFxyXG4gICAgICAgIC8vICAgICApO1xyXG4gICAgICAgIC8vIHRoaXMuc291bmQucGF1c2UoKTtcclxuICAgICAgICAvLyB0aGlzLnNvdW5kLnBsYXkoKTtcclxuICAgIH1cclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgQXVkaW9SZXNvdXJjZSB9IGZyb20gJy4vQXVkaW9SZXNvdXJjZSc7XHJcbmltcG9ydCBQNSBmcm9tIFwicDVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBBdWRpb1Jlc291cmNlR3JvdXAge1xyXG5cclxuICAgIHNvdW5kczogQXVkaW9SZXNvdXJjZVtdXHJcblxyXG4gICAgY29uc3RydWN0b3Ioc291bmRzOiBBdWRpb1Jlc291cmNlW10pIHsvLyBwYXNzIGluIGFuIGFycmF5IG9mIEF1ZGlvUmVzb3VyY2VzIHRoYXQgYXJlIGFsbCBzaW1pbGFyXHJcbiAgICAgICAgdGhpcy5zb3VuZHMgPSBzb3VuZHM7XHJcbiAgICB9XHJcblxyXG4gICAgcGxheVJhbmRvbSgpIHsvLyBwbGF5IGEgcmFuZG9tIHNvdW5kXHJcbiAgICAgICAgaWYodGhpcy5zb3VuZHMgPT09IHVuZGVmaW5lZCB8fCB0aGlzLnNvdW5kcy5sZW5ndGggPT09IDApXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcclxuICAgICAgICAgICAgICAgIGBUaGVyZSBhcmUgbm8gc291bmRzOiAke3RoaXMuc291bmRzfWBcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICBjb25zdCByID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdGhpcy5zb3VuZHMubGVuZ3RoKTtcclxuICAgICAgICB0aGlzLnNvdW5kc1tyXS5wbGF5U291bmQoKTsvLyBwbGF5IGEgcmFuZG9tIHNvdW5kIGZyb20gdGhlIGFycmF5IGF0IGEgc2xpZ2h0bHkgcmFuZG9taXplZCBwaXRjaCwgbGVhZGluZyB0byB0aGUgZWZmZWN0IG9mIGl0IG1ha2luZyBhIG5ldyBzb3VuZCBlYWNoIHRpbWUsIHJlbW92aW5nIHJlcGV0aXRpdmVuZXNzXHJcblxyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCB7IEltYWdlUmVzb3VyY2UgfSBmcm9tICcuL0ltYWdlUmVzb3VyY2UnO1xyXG5pbXBvcnQgcDUgZnJvbSAncDUnO1xyXG5pbXBvcnQgeyBnYW1lIH0gZnJvbSAnLi4vLi4vR2FtZSc7XHJcblxyXG5leHBvcnQgY2xhc3MgRm9udFJlc291cmNlIGV4dGVuZHMgSW1hZ2VSZXNvdXJjZSB7XHJcblxyXG4gICAgYWxwaGFiZXRfc291cDoge1tsZXR0ZXI6IHN0cmluZ106IHt4OiBudW1iZXIsIHk6IG51bWJlciwgdzogbnVtYmVyLCBoOiBudW1iZXJ9fSA9IHt9XHJcblxyXG4gICAgY29uc3RydWN0b3IocGF0aDogc3RyaW5nLCBjaGFyYWN0ZXJEYXRhOiB7W2xldHRlcjogc3RyaW5nXTogbnVtYmVyfSwgY2hhcmFjdGVyT3JkZXI6IHN0cmluZywgZm9udEhlaWdodDogbnVtYmVyKSB7XHJcbiAgICAgICAgc3VwZXIocGF0aCk7XHJcbiAgICAgICAgbGV0IHJ1bm5pbmdUb3RhbCA9IDBcclxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpPGNoYXJhY3Rlck9yZGVyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWxwaGFiZXRfc291cFtjaGFyYWN0ZXJPcmRlcltpXV0gPSB7eDogcnVubmluZ1RvdGFsLCB5OiAwLCB3OiBjaGFyYWN0ZXJEYXRhW2NoYXJhY3Rlck9yZGVyW2ldXSwgaDogZm9udEhlaWdodH1cclxuICAgICAgICAgICAgcnVubmluZ1RvdGFsICs9IGNoYXJhY3RlckRhdGFbY2hhcmFjdGVyT3JkZXJbaV1dICsgMVxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhjaGFyYWN0ZXJPcmRlcltpXStcIjogXCIrY2hhcmFjdGVyRGF0YVtjaGFyYWN0ZXJPcmRlcltpXV0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBkcmF3VGV4dCh0YXJnZXQ6IHA1LCBzdHI6IHN0cmluZywgeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuICAgICAgICBsZXQgeE9mZnNldDogbnVtYmVyID0gMDtcclxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpPHN0ci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4K3hPZmZzZXQqZ2FtZS51cHNjYWxlU2l6ZSwgeSwgdGhpcy5hbHBoYWJldF9zb3VwW3N0cltpXV0udypnYW1lLnVwc2NhbGVTaXplLCB0aGlzLmFscGhhYmV0X3NvdXBbc3RyW2ldXS5oKmdhbWUudXBzY2FsZVNpemUsIHRoaXMuYWxwaGFiZXRfc291cFtzdHJbaV1dLngsIHRoaXMuYWxwaGFiZXRfc291cFtzdHJbaV1dLnksIHRoaXMuYWxwaGFiZXRfc291cFtzdHJbaV1dLncsIHRoaXMuYWxwaGFiZXRfc291cFtzdHJbaV1dLmgpO1xyXG4gICAgICAgICAgICB4T2Zmc2V0ICs9IHRoaXMuYWxwaGFiZXRfc291cFtzdHJbaV1dLncrMTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgUDUgZnJvbSAncDUnO1xyXG5pbXBvcnQgeyBSZXNvdXJjZSB9IGZyb20gJy4vUmVzb3VyY2UnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEltYWdlUmVzb3VyY2UgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgICBpbWFnZTogUDUuSW1hZ2U7XHJcblxyXG4gICAgY29uc3RydWN0b3IocGF0aDogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIocGF0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZFJlc291cmNlKGdhbWU6IFA1KSB7XHJcbiAgICAgICAgdGhpcy5pbWFnZSA9IGdhbWUubG9hZEltYWdlKHRoaXMucGF0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKHRhcmdldDogYW55LCB4OiBudW1iZXIsIHk6IG51bWJlciwgd2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpIHtcclxuICAgICAgICAvLyBWZXJpZnkgdGhhdCB0aGUgdGlsZXMgaGFzIGJlZW4gbG9hZGVkXHJcbiAgICAgICAgaWYgKHRoaXMuaW1hZ2UgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxyXG4gICAgICAgICAgICAgICAgYFRyaWVkIHRvIHJlbmRlciBpbWFnZSBiZWZvcmUgbG9hZGluZyBpdDogJHt0aGlzLnBhdGh9YFxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAvLyBEcmF3IG5vbiB0aWxlcyBpbWFnZVxyXG4gICAgICAgIHRhcmdldC5pbWFnZSh0aGlzLmltYWdlLCB4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgcmVuZGVyUGFydGlhbChcclxuICAgICAgICB0YXJnZXQ6IGFueSxcclxuICAgICAgICB4OiBudW1iZXIsXHJcbiAgICAgICAgeTogbnVtYmVyLFxyXG4gICAgICAgIHdpZHRoOiBudW1iZXIsXHJcbiAgICAgICAgaGVpZ2h0OiBudW1iZXIsXHJcbiAgICAgICAgc291cmNlWD86IG51bWJlcixcclxuICAgICAgICBzb3VyY2VZPzogbnVtYmVyLFxyXG4gICAgICAgIHNvdXJjZVdpZHRoPzogbnVtYmVyLFxyXG4gICAgICAgIHNvdXJjZUhlaWdodD86IG51bWJlclxyXG4gICAgKSB7XHJcbiAgICAgICAgLy8gVmVyaWZ5IHRoYXQgdGhlIHRpbGVzIGhhcyBiZWVuIGxvYWRlZFxyXG4gICAgICAgIGlmICh0aGlzLmltYWdlID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcclxuICAgICAgICAgICAgICAgIGBUcmllZCB0byByZW5kZXIgaW1hZ2UgYmVmb3JlIGxvYWRpbmcgaXQ6ICR7dGhpcy5wYXRofWBcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgLy8gRHJhdyBhIHBhcnRpYWwgcGFydCBvZiB0aGUgaW1hZ2VcclxuICAgICAgICB0YXJnZXQuaW1hZ2UoXHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2UsXHJcbiAgICAgICAgICAgIHgsXHJcbiAgICAgICAgICAgIHksXHJcbiAgICAgICAgICAgIHdpZHRoLFxyXG4gICAgICAgICAgICBoZWlnaHQsXHJcbiAgICAgICAgICAgIHNvdXJjZVgsXHJcbiAgICAgICAgICAgIHNvdXJjZVksXHJcbiAgICAgICAgICAgIHNvdXJjZVdpZHRoLFxyXG4gICAgICAgICAgICBzb3VyY2VIZWlnaHRcclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IFJlc291cmNlIH0gZnJvbSBcIi4vUmVzb3VyY2VcIjtcclxuaW1wb3J0IFA1IGZyb20gJ3A1JztcclxuaW1wb3J0IHsgZ2FtZSB9IGZyb20gJy4uLy4uL0dhbWUnO1xyXG5pbXBvcnQgeyBUaWxlVHlwZSB9IGZyb20gXCIuLi8uLi8uLi9nbG9iYWwvVGlsZVwiXHJcbmltcG9ydCB7IFdvcmxkVGlsZXMgfSBmcm9tIFwiLi4vLi4vd29ybGQvV29ybGRUaWxlc1wiO1xyXG5pbXBvcnQgcDUgZnJvbSBcInA1XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUmVmbGVjdGFibGVJbWFnZVJlc291cmNlIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG5cclxuICAgIGltYWdlOiBQNS5JbWFnZTtcclxuICAgIGhhc1JlZmxlY3Rpb246IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHJlZmxlY3Rpb246IFA1LkltYWdlO1xyXG4gICAgcmVmbGVjdGl2aXR5QXJyYXk6IG51bWJlcltdID0gWzAsIDkwLCAxNTAsIDAsIDEwLCAxNSwgMTcsIDE5LCAyMSwgMjMsIDI1LCAyNywgMjksIDMxLCAxMCwgMTcsIDIxLCAyNSwgMjksIDUsIDUsIDUsIDUsIDUsIDUsIDUsIDUsIDUsIDVdO1xyXG4gICAgc2NhcmZDb2xvcjE/OiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXVxyXG4gICAgc2NhcmZDb2xvcjI/OiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBhdGg6IHN0cmluZywgc2NhcmZDb2xvcjE/OiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSwgc2NhcmZDb2xvcjI/OiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSkge1xyXG4gICAgICAgIHN1cGVyKHBhdGgpXHJcbiAgICAgICAgdGhpcy5zY2FyZkNvbG9yMSA9IHNjYXJmQ29sb3IxO1xyXG4gICAgICAgIHRoaXMuc2NhcmZDb2xvcjIgPSBzY2FyZkNvbG9yMjtcclxuICAgIH1cclxuXHJcbiAgICBsb2FkUmVzb3VyY2UoZ2FtZTogUDUpIHtcclxuICAgICAgICB0aGlzLmltYWdlID0gZ2FtZS5sb2FkSW1hZ2UodGhpcy5wYXRoLCAoKT0+e1xyXG4gICAgICAgICAgICBpZih0aGlzLnNjYXJmQ29sb3IxIT11bmRlZmluZWQgJiYgdGhpcy5zY2FyZkNvbG9yMiE9dW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmltYWdlLmxvYWRQaXhlbHMoKTtcclxuICAgICAgICAgICAgICAgIGZvcihsZXQgaSA9IDA7IGk8dGhpcy5pbWFnZS53aWR0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yKGxldCBqID0gMDsgajx0aGlzLmltYWdlLmhlaWdodDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwID0gdGhpcy5pbWFnZS5nZXQoaSwgaik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHBbMF0gPT09IDE2Nikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImNvbG9yMVwiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbWFnZS5zZXQoaSwgaiwgdGhpcy5zY2FyZkNvbG9yMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZihwWzBdID09PSAxNTUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJjb2xvcjJcIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW1hZ2Uuc2V0KGksIGosIHRoaXMuc2NhcmZDb2xvcjIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UodGhpcy5pbWFnZS5zZXQoaSwgaiwgcCkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vdGhpcy5pbWFnZS5zZXQoMywgMTAsIFswLCAyNTUsIDAsIDI1NV0pOy8vdGVzdCBwaXhlbFxyXG4gICAgICAgICAgICAgICAgdGhpcy5pbWFnZS51cGRhdGVQaXhlbHMoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmxvYWRSZWZsZWN0aW9uKGdhbWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWRSZWZsZWN0aW9uKGdhbWU6IFA1KSB7XHJcbiAgICAgICAgaWYoIXRoaXMuaGFzUmVmbGVjdGlvbikgey8vdGhpcyBpcyBzbyBpdCBkb2Vzbid0IGxvYWQgdGhlbSBhbGwgYXQgb25jZSBhbmQgaW5zdGVhZCBtYWtlcyB0aGUgcmVmbGVjdGlvbnMgd2hlbiB0aGV5IGFyZSBuZWVkZWRcclxuICAgICAgICAgICAgdGhpcy5oYXNSZWZsZWN0aW9uID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5yZWZsZWN0aW9uID0gZ2FtZS5jcmVhdGVJbWFnZSh0aGlzLmltYWdlLndpZHRoLCB0aGlzLmltYWdlLmhlaWdodCk7XHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2UubG9hZFBpeGVscygpO1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKHRoaXMuaW1hZ2UucGl4ZWxzKVxyXG4gICAgICAgICAgICB0aGlzLnJlZmxlY3Rpb24ubG9hZFBpeGVscygpO1xyXG4gICAgICAgICAgICBmb3IobGV0IGkgPSAwOyBpPHRoaXMucmVmbGVjdGlvbi53aWR0aDsgaSsrKSB7Ly9nZW5lcmF0ZSBhIHJlZmxlY3Rpb24gaW1hZ2UgdGhhdCBpcyBkaXNwbGF5ZWQgYXMgYSByZWZsZWN0aW9uXHJcbiAgICAgICAgICAgICAgICBmb3IobGV0IGogPSAwOyBqPHRoaXMucmVmbGVjdGlvbi5oZWlnaHQ7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvcihsZXQgayA9IDA7IGs8MzsgaysrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVmbGVjdGlvbi5waXhlbHNbNCooaip0aGlzLnJlZmxlY3Rpb24ud2lkdGgraSkra10gPSB0aGlzLmltYWdlLnBpeGVsc1s0KigodGhpcy5pbWFnZS5oZWlnaHQtai0xKSp0aGlzLmltYWdlLndpZHRoK2kpK2tdO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlZmxlY3Rpb24ucGl4ZWxzWzQqKGoqdGhpcy5yZWZsZWN0aW9uLndpZHRoK2kpKzNdID0gXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbWFnZS5waXhlbHNbNCooKHRoaXMuaW1hZ2UuaGVpZ2h0LWotMSkqdGhpcy5pbWFnZS53aWR0aCtpKSszXSAqIFxyXG4gICAgICAgICAgICAgICAgICAgICgodGhpcy5yZWZsZWN0aW9uLmhlaWdodC1qKS90aGlzLnJlZmxlY3Rpb24uaGVpZ2h0KSAqIFxyXG4gICAgICAgICAgICAgICAgICAgICh0aGlzLnJlZmxlY3Rpb24ud2lkdGgvMiswLjUtTWF0aC5hYnMoaS10aGlzLnJlZmxlY3Rpb24ud2lkdGgvMiswLjUpKS8odGhpcy5yZWZsZWN0aW9uLndpZHRoLzIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMucmVmbGVjdGlvbi51cGRhdGVQaXhlbHMoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKHRhcmdldDogYW55LCB4OiBudW1iZXIsIHk6IG51bWJlciwgd2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpIHtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKFdvcmxkVGlsZXMpO1xyXG4gICAgICAgIC8vIFZlcmlmeSB0aGF0IHRoZSBpbWFnZSBoYXMgYmVlbiBsb2FkZWRcclxuICAgICAgICBpZiAodGhpcy5pbWFnZSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAgICAgICAgICAgICBgVHJpZWQgdG8gcmVuZGVyIGltYWdlIGJlZm9yZSBsb2FkaW5nIGl0OiAke3RoaXMucGF0aH1gXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIC8vIERyYXcgbm9uIHRpbGVzIGltYWdlXHJcbiAgICAgICAgdGFyZ2V0LmltYWdlKHRoaXMuaW1hZ2UsIHgsIHksIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICByZW5kZXJXb3JsZHNwYWNlUmVmbGVjdGlvbih4OiBudW1iZXIsIHk6IG51bWJlciwgd2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpIHtcclxuICAgICAgICBpZiAodGhpcy5pbWFnZSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAgICAgICAgICAgICBgVHJpZWQgdG8gcmVuZGVyIHJlZmxlY3Rpb24gb2YgaW1hZ2UgYmVmb3JlIGxvYWRpbmcgaXQ6ICR7dGhpcy5wYXRofWBcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLmhhc1JlZmxlY3Rpb24pXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBcclxuICAgICAgICBnYW1lLmZpbGwoMjU1LCAwLCAwKTtcclxuICAgICAgICBnYW1lLnN0cm9rZSgxNTAsIDAsIDApO1xyXG5cclxuICAgICAgICAvL2xvb3AgdGhyb3VnaCBldmVyeSB0aWxlIGl0IHBhc3NlcyB0aHJvdWdoXHJcbiAgICAgICAgZm9yKGxldCBpID0gTWF0aC5mbG9vcih4KTsgaTx4K3dpZHRoOyBpKyspIHtcclxuICAgICAgICAgICAgZm9yKGxldCBqID0gTWF0aC5mbG9vcih5KTsgajx5K2hlaWdodDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0YXJnZXQud29ybGQud29ybGRUaWxlcyk7XHJcbiAgICAgICAgICAgICAgICBsZXQgY3VycmVudEJsb2NrOiBUaWxlVHlwZSB8IHN0cmluZyA9IGdhbWUud29ybGQud29ybGRUaWxlc1tqICogZ2FtZS53b3JsZFdpZHRoICsgaV07XHJcbiAgICAgICAgICAgICAgICBpZihjdXJyZW50QmxvY2sgPT09IHVuZGVmaW5lZCB8fCB0eXBlb2YgY3VycmVudEJsb2NrID09PSBcInN0cmluZ1wiIHx8IGN1cnJlbnRCbG9jayA9PSBUaWxlVHlwZS5BaXIpIHsvL3RoZSByZWZlcmVuY2UgdG8gVGlsZUVudGl0eSBjYW4gYmUgcmVtb3ZlZCBhcyBzb29uIGFzIHRoZSBiZXR0ZXIgc3lzdGVtIGlzIGluIHBsYWNlXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBnYW1lLmRyYXdpbmdDb250ZXh0Lmdsb2JhbEFscGhhID0gdGhpcy5yZWZsZWN0aXZpdHlBcnJheVtjdXJyZW50QmxvY2tdLzI1NTsvL1RPRE8gbWFrZSB0aGlzIGJhc2VkIG9uIHRoZSB0aWxlIHJlZmxlY3Rpdml0eVxyXG4gICAgICAgICAgICAgICAgZ2FtZS5pbWFnZShcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlZmxlY3Rpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgKGkgKiBnYW1lLlRJTEVfV0lEVEggLVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBnYW1lLmludGVycG9sYXRlZENhbVggKiBnYW1lLlRJTEVfV0lEVEgpICpcclxuICAgICAgICAgICAgICAgICAgICBnYW1lLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAoaiAqIGdhbWUuVElMRV9IRUlHSFQgLVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2FtZS5pbnRlcnBvbGF0ZWRDYW1ZICogZ2FtZS5USUxFX0hFSUdIVCkgKlxyXG4gICAgICAgICAgICAgICAgICAgIGdhbWUudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS5USUxFX1dJRFRIKmdhbWUudXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS5USUxFX0hFSUdIVCpnYW1lLnVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICAgICAgICAgIChpLXgpKmdhbWUuVElMRV9XSURUSCxcclxuICAgICAgICAgICAgICAgICAgICAoai15KSpnYW1lLlRJTEVfSEVJR0hULFxyXG4gICAgICAgICAgICAgICAgICAgIGdhbWUuVElMRV9XSURUSCxcclxuICAgICAgICAgICAgICAgICAgICBnYW1lLlRJTEVfSEVJR0hUXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgZ2FtZS5kcmF3aW5nQ29udGV4dC5nbG9iYWxBbHBoYSA9IDEuMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZW5kZXJQYXJ0aWFsKFxyXG4gICAgICAgIHRhcmdldDogYW55LFxyXG4gICAgICAgIHg6IG51bWJlcixcclxuICAgICAgICB5OiBudW1iZXIsXHJcbiAgICAgICAgd2lkdGg6IG51bWJlcixcclxuICAgICAgICBoZWlnaHQ6IG51bWJlcixcclxuICAgICAgICBzb3VyY2VYPzogbnVtYmVyLFxyXG4gICAgICAgIHNvdXJjZVk/OiBudW1iZXIsXHJcbiAgICAgICAgc291cmNlV2lkdGg/OiBudW1iZXIsXHJcbiAgICAgICAgc291cmNlSGVpZ2h0PzogbnVtYmVyXHJcbiAgICApIHtcclxuICAgICAgICAvLyBWZXJpZnkgdGhhdCB0aGUgdGlsZXMgaGFzIGJlZW4gbG9hZGVkXHJcbiAgICAgICAgaWYgKHRoaXMuaW1hZ2UgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxyXG4gICAgICAgICAgICAgICAgYFRyaWVkIHRvIHJlbmRlciBpbWFnZSBiZWZvcmUgbG9hZGluZyBpdDogJHt0aGlzLnBhdGh9YFxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAvLyBEcmF3IGEgcGFydGlhbCBwYXJ0IG9mIHRoZSBpbWFnZVxyXG4gICAgICAgIHRhcmdldC5pbWFnZShcclxuICAgICAgICAgICAgdGhpcy5pbWFnZSxcclxuICAgICAgICAgICAgeCxcclxuICAgICAgICAgICAgeSxcclxuICAgICAgICAgICAgd2lkdGgsXHJcbiAgICAgICAgICAgIGhlaWdodCxcclxuICAgICAgICAgICAgc291cmNlWCxcclxuICAgICAgICAgICAgc291cmNlWSxcclxuICAgICAgICAgICAgc291cmNlV2lkdGgsXHJcbiAgICAgICAgICAgIHNvdXJjZUhlaWdodFxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgUDUgZnJvbSAncDUnO1xyXG5cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFJlc291cmNlIHtcclxuICAgIHBhdGg6IHN0cmluZztcclxuXHJcbiAgICBwcm90ZWN0ZWQgY29uc3RydWN0b3IocGF0aDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5wYXRoID0gcGF0aDtcclxuICAgIH1cclxuXHJcbiAgICBhYnN0cmFjdCBsb2FkUmVzb3VyY2Uoc2tldGNoOiBQNSk6IHZvaWQ7XHJcbn1cclxuIiwiaW1wb3J0IHsgSW1hZ2VSZXNvdXJjZSB9IGZyb20gJy4vSW1hZ2VSZXNvdXJjZSc7XHJcblxyXG5leHBvcnQgY2xhc3MgVGlsZVJlc291cmNlIGV4dGVuZHMgSW1hZ2VSZXNvdXJjZSB7XHJcbiAgICAvLyBUaGUgd2lkdGggYW5kIGhlaWdodCBvZiB0aGUgdGlsZXMgc2V0XHJcbiAgICB3aWR0aDogbnVtYmVyO1xyXG4gICAgaGVpZ2h0OiBudW1iZXI7XHJcblxyXG4gICAgLy8gVGhlIHdpZHRoIGFuZCBoZWlnaHQgb2YgZWFjaCB0aWxlcyBpbiBwaXhlbHNcclxuICAgIHRpbGVXaWR0aDogbnVtYmVyO1xyXG4gICAgdGlsZUhlaWdodDogbnVtYmVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHBhdGg6IHN0cmluZyxcclxuICAgICAgICB3aWR0aDogbnVtYmVyLFxyXG4gICAgICAgIGhlaWdodDogbnVtYmVyLFxyXG4gICAgICAgIHRpbGVXaWR0aDogbnVtYmVyLFxyXG4gICAgICAgIHRpbGVIZWlnaHQ6IG51bWJlclxyXG4gICAgKSB7XHJcbiAgICAgICAgc3VwZXIocGF0aCk7XHJcbiAgICAgICAgdGhpcy53aWR0aCA9IHdpZHRoO1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG4gICAgICAgIHRoaXMudGlsZVdpZHRoID0gdGlsZVdpZHRoO1xyXG4gICAgICAgIHRoaXMudGlsZUhlaWdodCA9IHRpbGVIZWlnaHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyVGlsZShcclxuICAgICAgICBpOiBudW1iZXIsXHJcbiAgICAgICAgdGFyZ2V0OiBhbnksXHJcbiAgICAgICAgeDogbnVtYmVyLFxyXG4gICAgICAgIHk6IG51bWJlcixcclxuICAgICAgICB3aWR0aDogbnVtYmVyLFxyXG4gICAgICAgIGhlaWdodDogbnVtYmVyXHJcbiAgICApIHtcclxuICAgICAgICBjb25zdCB0aWxlU2V0WCA9IGkgJSB0aGlzLndpZHRoO1xyXG4gICAgICAgIGNvbnN0IHRpbGVTZXRZID0gTWF0aC5mbG9vcihpIC8gdGhpcy53aWR0aCk7XHJcblxyXG4gICAgICAgIC8vIE1ha2Ugc3VyZSB0aGUgdGlsZXMgaXNuJ3Qgb3V0IG9mIGJvdW5kc1xyXG4gICAgICAgIGlmICh0aWxlU2V0WSA+IHRoaXMuaGVpZ2h0KVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAgICAgICAgICAgICBgT3V0IG9mIGJvdW5kcyB0aWxlLiBUcmllZCB0byByZW5kZXIgdGlsZSBpbmRleCAke2l9IHdpdGggYSBtYXhpbXVtIG9mICR7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53aWR0aCAqIHRoaXMuaGVpZ2h0XHJcbiAgICAgICAgICAgICAgICB9IHRpbGVzYFxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICBzdXBlci5yZW5kZXJQYXJ0aWFsKFxyXG4gICAgICAgICAgICB0YXJnZXQsXHJcbiAgICAgICAgICAgIHgsXHJcbiAgICAgICAgICAgIHksXHJcbiAgICAgICAgICAgIHdpZHRoLFxyXG4gICAgICAgICAgICBoZWlnaHQsXHJcbiAgICAgICAgICAgIHRpbGVTZXRYICogdGhpcy50aWxlV2lkdGgsXHJcbiAgICAgICAgICAgIHRpbGVTZXRZICogdGhpcy50aWxlSGVpZ2h0LFxyXG4gICAgICAgICAgICB0aGlzLnRpbGVXaWR0aCxcclxuICAgICAgICAgICAgdGhpcy50aWxlSGVpZ2h0XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRUaWxlQXRDb29yZGluYXRlKFxyXG4gICAgICAgIHg6IG51bWJlcixcclxuICAgICAgICB5OiBudW1iZXIsXHJcbiAgICAgICAgdGFyZ2V0OiBhbnksXHJcbiAgICAgICAgeFBvczogbnVtYmVyLFxyXG4gICAgICAgIHlQb3M6IG51bWJlcixcclxuICAgICAgICB3aWR0aDogbnVtYmVyLFxyXG4gICAgICAgIGhlaWdodDogbnVtYmVyXHJcbiAgICApIHtcclxuICAgICAgICBpZiAoeCA+IHRoaXMud2lkdGggfHwgeSA+IHRoaXMuaGVpZ2h0IHx8IHggPCAwIHx8IHkgPCAwKVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAgICAgICAgICAgICBgT3V0IG9mIGJvdW5kcyB0aWxlLiBUcmllZCB0byBsb2FkIHRpbGUgYXQgJHt4fSwgJHt5fSBvbiBhICR7dGhpcy53aWR0aH0sICR7dGhpcy5oZWlnaHR9IGdyaWRgXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIHN1cGVyLnJlbmRlclBhcnRpYWwoXHJcbiAgICAgICAgICAgIHRhcmdldCxcclxuICAgICAgICAgICAgeFBvcyxcclxuICAgICAgICAgICAgeVBvcyxcclxuICAgICAgICAgICAgd2lkdGgsXHJcbiAgICAgICAgICAgIGhlaWdodCxcclxuICAgICAgICAgICAgeCAqIHRoaXMudGlsZVdpZHRoLFxyXG4gICAgICAgICAgICB5ICogdGhpcy50aWxlSGVpZ2h0LFxyXG4gICAgICAgICAgICB0aGlzLnRpbGVXaWR0aCxcclxuICAgICAgICAgICAgdGhpcy50aWxlSGVpZ2h0XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufSIsImV4cG9ydCBjbGFzcyBDb250cm9sIHtcclxuICAgIGtleWJvYXJkOiBib29sZWFuXHJcbiAgICBrZXlDb2RlOiBudW1iZXJcclxuICAgIGRlc2NyaXB0aW9uOiBzdHJpbmdcclxuICAgIG9uUHJlc3NlZDogKCkgPT4gdm9pZFxyXG4gICAgb25SZWxlYXNlZDogKCkgPT4gdm9pZFxyXG5cclxuICAgIGNvbnN0cnVjdG9yKGRlc2NyaXB0aW9uOiBzdHJpbmcsIGtleWJvYXJkOiBib29sZWFuLCBrZXlDb2RlOiBudW1iZXIsIG9uUHJlc3NlZDogKCkgPT4gdm9pZCwgb25SZWxlYXNlZD86ICgpID0+IHZvaWQpIHtcclxuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb25cclxuICAgICAgICB0aGlzLmtleWJvYXJkID0ga2V5Ym9hcmQ7XHJcbiAgICAgICAgdGhpcy5rZXlDb2RlID0ga2V5Q29kZTtcclxuICAgICAgICB0aGlzLm9uUHJlc3NlZCA9IG9uUHJlc3NlZDtcclxuICAgICAgICB0aGlzLm9uUmVsZWFzZWQgPSBvblJlbGVhc2VkIHx8IGZ1bmN0aW9uKCl7fTsvL2ZvciBzb21lIHJlYXNvbiBhcnJvdyBmdW5jdGlvbiBkb2Vzbid0IGxpa2UgdG8gZXhpc3QgaGVyZSBidXQgaSdtIG5vdCBnb25uYSB3b3JyeSB0b28gbXVjaFxyXG4gICAgICAgIC8vaWYgaXQncyB0b28gdWdseSwgeW91IGNhbiB0cnkgdG8gZml4IGl0XHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IHsgSW52ZW50b3J5UGF5bG9hZCwgSXRlbUNhdGVnb3JpZXMsIEl0ZW1zLCBJdGVtU3RhY2sgfSBmcm9tICcuLi8uLi9nbG9iYWwvSW52ZW50b3J5JztcclxuaW1wb3J0IHsgVGlsZVR5cGUgfSBmcm9tICcuLi8uLi9nbG9iYWwvVGlsZSc7XHJcbmltcG9ydCB7IGdhbWUgfSBmcm9tICcuLi9HYW1lJztcclxuaW1wb3J0IHsgQ29sb3JQYXJ0aWNsZSB9IGZyb20gJy4uL3dvcmxkL3BhcnRpY2xlcy9Db2xvclBhcnRpY2xlJztcclxuaW1wb3J0IHsgV29ybGRUaWxlcyB9IGZyb20gJy4uL3dvcmxkL1dvcmxkVGlsZXMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEludmVudG9yeSB7XHJcblxyXG5cdGl0ZW1zOiAoSXRlbVN0YWNrIHwgdW5kZWZpbmVkIHwgbnVsbClbXTtcclxuXHJcblx0d2lkdGg6IG51bWJlcjtcclxuXHRoZWlnaHQ6IG51bWJlcjtcclxuXHJcblx0c2VsZWN0ZWRTbG90OiBudW1iZXIgPSAwXHJcblx0cGlja2VkVXBTbG90OiBudW1iZXIgfCB1bmRlZmluZWQgPSB1bmRlZmluZWRcclxuXHJcblx0Y29uc3RydWN0b3IoaW52ZW50b3J5OiBJbnZlbnRvcnlQYXlsb2FkKSB7XHJcblx0XHR0aGlzLml0ZW1zID0gaW52ZW50b3J5Lml0ZW1zXHJcblx0XHR0aGlzLndpZHRoID0gaW52ZW50b3J5LndpZHRoXHJcblx0XHR0aGlzLmhlaWdodCA9IGludmVudG9yeS5oZWlnaHRcclxuXHR9XHJcblxyXG5cdHdvcmxkQ2xpY2soeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuXHRcdGNvbnN0IHNlbGVjdGVkSXRlbSA9IHRoaXMuaXRlbXNbdGhpcy5zZWxlY3RlZFNsb3RdXHJcblx0XHRpZihzZWxlY3RlZEl0ZW0gPT09IHVuZGVmaW5lZCB8fCBzZWxlY3RlZEl0ZW0gPT09IG51bGwpIHtcclxuXHRcdFx0Ly9jb25zb2xlLmVycm9yKFwiQnJlYWtpbmcgdGlsZVwiKVxyXG5cdFx0XHRsZXQgdGlsZUJlaW5nQnJva2VuID0gZ2FtZS53b3JsZC53b3JsZFRpbGVzW2dhbWUud29ybGQud2lkdGggKiB5ICsgeF07XHJcblx0XHRcdGlmKHR5cGVvZiB0aWxlQmVpbmdCcm9rZW4gPT09ICdudW1iZXInKSB7XHJcblx0XHRcdFx0bGV0IHdvcmxkVGlsZUJlaW5nQnJva2VuID0gV29ybGRUaWxlc1t0aWxlQmVpbmdCcm9rZW5dXHJcblx0XHRcdFx0Zm9yKGxldCBpID0gMDsgaTw1KmdhbWUucGFydGljbGVNdWx0aXBsaWVyOyBpKyspIHtcclxuXHRcdFx0XHRcdGlmICh3b3JsZFRpbGVCZWluZ0Jyb2tlbiAhPT0gdW5kZWZpbmVkKVxyXG5cdFx0XHRcdFx0Z2FtZS5wYXJ0aWNsZXMucHVzaChuZXcgQ29sb3JQYXJ0aWNsZSh3b3JsZFRpbGVCZWluZ0Jyb2tlbi5jb2xvciwgTWF0aC5yYW5kb20oKSowLjIrMC4xLCAxMCwgeCtNYXRoLnJhbmRvbSgpLCB5K01hdGgucmFuZG9tKCksIDAuMiooTWF0aC5yYW5kb20oKS0wLjUpLCAtMC4xNSpNYXRoLnJhbmRvbSgpKSlcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0Z2FtZS5jb25uZWN0aW9uLmVtaXQoXHJcblx0XHRcdFx0J3dvcmxkQnJlYWtTdGFydCcsXHJcblx0XHRcdFx0Z2FtZS53b3JsZC53aWR0aCAqIHkgKyB4XHJcblx0XHRcdCk7XHJcblx0XHRcdGdhbWUuY29ubmVjdGlvbi5lbWl0KCd3b3JsZEJyZWFrRmluaXNoJyk7XHJcblx0XHRcdHJldHVyblxyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IHdvcmxkQ2xpY2sgPSBJdGVtQWN0aW9uc1tJdGVtc1tzZWxlY3RlZEl0ZW0uaXRlbV0udHlwZV0ud29ybGRDbGlja1xyXG5cdFx0aWYod29ybGRDbGljayA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdGNvbnNvbGUuZXJyb3IoXCJDYW5ub3QgcGxhY2Ugc2VsZWN0ZWQgaXRlbVwiKVxyXG5cdFx0XHRyZXR1cm5cclxuXHRcdH1cclxuXHJcblx0XHR3b3JsZENsaWNrKHgsIHkpXHJcblx0fVxyXG5cdHdvcmxkQ2xpY2tDaGVjayh4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG5cdFx0bGV0IHRpbGVCZWluZ0Jyb2tlbiA9IGdhbWUud29ybGQud29ybGRUaWxlc1tnYW1lLndvcmxkLndpZHRoICogeSArIHhdO1xyXG5cdFx0aWYodHlwZW9mIHRpbGVCZWluZ0Jyb2tlbiA9PT0gJ251bWJlcicpIHtcclxuXHRcdFx0aWYgKHRpbGVCZWluZ0Jyb2tlbiA9PT0gVGlsZVR5cGUuQWlyKSBnYW1lLmJyZWFraW5nID0gZmFsc2U7XHJcblx0XHRcdGVsc2UgZ2FtZS5icmVha2luZyA9IHRydWU7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5pbnRlcmZhY2UgSXRlbUJhc2Uge1xyXG5cdHdvcmxkQ2xpY2s/OiAoeDogbnVtYmVyLCB5OiBudW1iZXIpID0+IHZvaWRcclxufVxyXG5cclxuY29uc3QgSXRlbUFjdGlvbnM6IFJlY29yZDxJdGVtQ2F0ZWdvcmllcywgSXRlbUJhc2U+ID0ge1xyXG5cdFtJdGVtQ2F0ZWdvcmllcy5UaWxlXToge1xyXG5cdFx0d29ybGRDbGljayh4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG5cdFx0XHQvLyBJZiB0aGUgdGlsZSBpc24ndCBhaXJcclxuXHRcdFx0aWYgKFxyXG5cdFx0XHRcdGdhbWUud29ybGQud29ybGRUaWxlc1tcclxuXHRcdFx0XHRnYW1lLndvcmxkLndpZHRoICogeSArIHhcclxuXHRcdFx0XHRcdF0gIT09IFRpbGVUeXBlLkFpclxyXG5cdFx0XHQpIHtcclxuXHJcblx0XHRcdFx0bGV0IHRpbGVCZWluZ0Jyb2tlbiA9IGdhbWUud29ybGQud29ybGRUaWxlc1tnYW1lLndvcmxkLndpZHRoICogeSArIHhdO1xyXG5cdFx0XHRcdGlmKHR5cGVvZiB0aWxlQmVpbmdCcm9rZW4gPT09ICdudW1iZXInKSB7Ly90aWxlIGlzIHRpbGVcclxuXHRcdFx0XHRcdGlmICghZ2FtZS5icmVha2luZykgcmV0dXJuO1xyXG5cdFx0XHRcdFx0bGV0IHdvcmxkVGlsZUJlaW5nQnJva2VuID0gV29ybGRUaWxlc1t0aWxlQmVpbmdCcm9rZW5dXHJcblx0XHRcdFx0XHRmb3IobGV0IGkgPSAwOyBpPDUqZ2FtZS5wYXJ0aWNsZU11bHRpcGxpZXI7IGkrKykge1xyXG5cdFx0XHRcdFx0XHRpZiAod29ybGRUaWxlQmVpbmdCcm9rZW4gIT09IHVuZGVmaW5lZClcclxuXHRcdFx0XHRcdFx0Z2FtZS5wYXJ0aWNsZXMucHVzaChuZXcgQ29sb3JQYXJ0aWNsZSh3b3JsZFRpbGVCZWluZ0Jyb2tlbi5jb2xvciwgTWF0aC5yYW5kb20oKSowLjIrMC4xLCAxMCwgeCtNYXRoLnJhbmRvbSgpLCB5K01hdGgucmFuZG9tKCksIDAuMiooTWF0aC5yYW5kb20oKS0wLjUpLCAtMC4xNSpNYXRoLnJhbmRvbSgpKSlcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGNvbnNvbGUuaW5mbygnYnJlYWtpbmcnKTtcclxuXHRcdFx0XHRcdGdhbWUuY29ubmVjdGlvbi5lbWl0KFxyXG5cdFx0XHRcdFx0XHQnd29ybGRCcmVha1N0YXJ0JyxcclxuXHRcdFx0XHRcdFx0Z2FtZS53b3JsZC53aWR0aCAqIHkgKyB4XHJcblx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdFx0Z2FtZS5jb25uZWN0aW9uLmVtaXQoXHJcblx0XHRcdFx0XHRcdCd3b3JsZEJyZWFrRmluaXNoJ1xyXG5cdFx0XHRcdFx0KTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7Ly90aWxlIGlzIHRpbGUgZW50aXR5XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcInRpbGUgZW50aXR5IGludGVyYWN0XCIpXHJcblx0XHRcdFx0XHRnYW1lLmNvbm5lY3Rpb24uZW1pdChcclxuXHRcdFx0XHRcdFx0J3dvcmxkQnJlYWtTdGFydCcsXHJcblx0XHRcdFx0XHRcdGdhbWUud29ybGQud2lkdGggKiB5ICsgeFxyXG5cdFx0XHRcdFx0KTtcclxuXHRcdFx0XHRcdGdhbWUuY29ubmVjdGlvbi5lbWl0KFxyXG5cdFx0XHRcdFx0XHQnd29ybGRCcmVha0ZpbmlzaCdcclxuXHRcdFx0XHRcdCk7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdC8vaWYgdGhlIHRpbGUgaXMgYWlyIGFuZCB0aGUgZ2FtZSBpcyB0cnlpbmcgdG8gcGxhY2VcclxuXHRcdFx0aWYgKGdhbWUuYnJlYWtpbmcpIHJldHVybjtcclxuXHRcdFx0Y29uc29sZS5pbmZvKCdQbGFjaW5nJyk7XHJcblx0XHRcdGdhbWUuY29ubmVjdGlvbi5lbWl0KFxyXG5cdFx0XHRcdCd3b3JsZFBsYWNlJyxcclxuXHRcdFx0XHRnYW1lLndvcmxkLmludmVudG9yeS5zZWxlY3RlZFNsb3QsXHJcblx0XHRcdFx0eCxcclxuXHRcdFx0XHR5XHJcblx0XHRcdCk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRbSXRlbUNhdGVnb3JpZXMuUmVzb3VyY2VdOiB7fSxcclxuXHRbSXRlbUNhdGVnb3JpZXMuVG9vbF06IHt9LFxyXG5cdFtJdGVtQ2F0ZWdvcmllcy5UaWxlRW50aXR5XToge1xyXG5cdFx0d29ybGRDbGljayh4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG5cdFx0XHRsZXQgaXRlbVJlZiA9IEl0ZW1zW2dhbWUud29ybGQuaW52ZW50b3J5Lml0ZW1zW2dhbWUud29ybGQuaW52ZW50b3J5LnNlbGVjdGVkU2xvdF0/Lml0ZW0gfHwgMF07XHJcblx0XHRcdGxldCBvZmZzZXQ6IFtudW1iZXIsIG51bWJlcl0gPSBbMCwgMF1cclxuXHRcdFx0aWYoXCJ0aWxlRW50aXR5T2Zmc2V0XCIgaW4gaXRlbVJlZikge1xyXG5cdFx0XHRcdG9mZnNldCA9IGl0ZW1SZWYudGlsZUVudGl0eU9mZnNldDtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0Z2FtZS5jb25uZWN0aW9uLmVtaXQoXHJcblx0XHRcdFx0J3dvcmxkUGxhY2UnLFxyXG5cdFx0XHRcdGdhbWUud29ybGQuaW52ZW50b3J5LnNlbGVjdGVkU2xvdCxcclxuXHRcdFx0XHR4LFxyXG5cdFx0XHRcdHlcclxuXHRcdFx0KTtcclxuXHRcdH1cclxuXHR9LFxyXG59IiwiaW1wb3J0IHA1IGZyb20gJ3A1JztcclxuaW1wb3J0IHsgRW50aXRpZXMsIEVudGl0eVBheWxvYWQgfSBmcm9tICcuLi8uLi9nbG9iYWwvRW50aXR5JztcclxuaW1wb3J0IHsgZ2FtZSB9IGZyb20gJy4uL0dhbWUnO1xyXG5pbXBvcnQgeyBTZXJ2ZXJFbnRpdHkgfSBmcm9tICcuLi93b3JsZC9lbnRpdGllcy9TZXJ2ZXJFbnRpdHknO1xyXG4vLyBpbXBvcnQgeyBDb2xvclBhcnRpY2xlIH0gZnJvbSAnLi4vd29ybGQvJztcclxuaW1wb3J0IHsgQW5pbWF0aW9uRnJhbWUsIFBsYXllckFuaW1hdGlvbnMgfSBmcm9tICcuLi9hc3NldHMvQXNzZXRzJztcclxuaW1wb3J0IHsgVGlsZVR5cGUgfSBmcm9tICcuLi8uLi9nbG9iYWwvVGlsZSc7XHJcbmltcG9ydCB7IFdvcmxkVGlsZXMgfSBmcm9tICcuLi93b3JsZC9Xb3JsZFRpbGVzJztcclxuaW1wb3J0IHsgQ29sb3JQYXJ0aWNsZSB9IGZyb20gJy4uL3dvcmxkL3BhcnRpY2xlcy9Db2xvclBhcnRpY2xlJztcclxuXHJcbmV4cG9ydCBjbGFzcyBQbGF5ZXJMb2NhbCBleHRlbmRzIFNlcnZlckVudGl0eSB7XHJcbiAgICAvLyBDb25zdGFudCBkYXRhXHJcbiAgICB3aWR0aDogbnVtYmVyID0gMTIgLyBnYW1lLlRJTEVfV0lEVEg7XHJcbiAgICBoZWlnaHQ6IG51bWJlciA9IDI4IC8gZ2FtZS5USUxFX0hFSUdIVDtcclxuXHJcbiAgICAvLyBTaGFyZWQgZGF0YVxyXG4gICAgbmFtZTogc3RyaW5nO1xyXG5cclxuICAgIC8vIExvY2FsIGRhdGFcclxuICAgIHhWZWw6IG51bWJlciA9IDA7XHJcbiAgICB5VmVsOiBudW1iZXIgPSAwO1xyXG4gICAgc2xpZGVYOiBudW1iZXI7XHJcbiAgICBzbGlkZVk6IG51bWJlcjtcclxuICAgIGludGVycG9sYXRlZFg6IG51bWJlcjtcclxuICAgIGludGVycG9sYXRlZFk6IG51bWJlcjtcclxuXHJcbiAgICBwWDogbnVtYmVyO1xyXG4gICAgcFk6IG51bWJlcjtcclxuICAgIHBYVmVsOiBudW1iZXIgPSAwO1xyXG4gICAgcFlWZWw6IG51bWJlciA9IDA7XHJcblxyXG4gICAgZ3JvdW5kZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHBHcm91bmRlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIGNvbGxpc2lvbkRhdGE6IGFueTtcclxuICAgIGNsb3Nlc3RDb2xsaXNpb246IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXTtcclxuXHJcbiAgICBtYXNzOiBudW1iZXIgPSB0aGlzLndpZHRoICogdGhpcy5oZWlnaHQ7XHJcblxyXG5cclxuICAgIC8vaW5wdXQgYm9vbGVhbnNcclxuICAgIHJpZ2h0QnV0dG9uOiBib29sZWFuO1xyXG4gICAgbGVmdEJ1dHRvbjogYm9vbGVhbjtcclxuICAgIGp1bXBCdXR0b246IGJvb2xlYW47XHJcblxyXG4gICAgY3VycmVudEFuaW1hdGlvbjogQW5pbWF0aW9uRnJhbWU8dHlwZW9mIFBsYXllckFuaW1hdGlvbnM+ID0gXCJpZGxlXCI7XHJcbiAgICBhbmltRnJhbWU6IG51bWJlciA9IDA7XHJcbiAgICB0aW1lSW5UaGlzQW5pbWF0aW9uRnJhbWUgPSAwO1xyXG4gICAgZmFjaW5nUmlnaHQgPSB0cnVlO1xyXG5cclxuICAgIHRvcENvbGxpc2lvbjogKHR5cGVvZiBXb3JsZFRpbGVzW1RpbGVUeXBlLkFpcl0pID0gV29ybGRUaWxlc1tUaWxlVHlwZS5BaXJdOy8vaGFja3lcclxuICAgIGJvdHRvbUNvbGxpc2lvbjogKHR5cGVvZiBXb3JsZFRpbGVzW1RpbGVUeXBlLkFpcl0pID0gV29ybGRUaWxlc1tUaWxlVHlwZS5BaXJdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIGRhdGE6IEVudGl0eVBheWxvYWQ8RW50aXRpZXMuTG9jYWxQbGF5ZXI+XHJcbiAgICApIHtcclxuICAgICAgICBzdXBlcihkYXRhLmlkKVxyXG5cclxuICAgICAgICB0aGlzLm5hbWUgPSBkYXRhLmRhdGEubmFtZTtcclxuXHJcbiAgICAgICAgdGhpcy54ID0gZGF0YS5kYXRhLng7XHJcbiAgICAgICAgdGhpcy55ID0gZGF0YS5kYXRhLnk7XHJcblxyXG4gICAgICAgIHRoaXMucFggPSB0aGlzLng7XHJcbiAgICAgICAgdGhpcy5wWSA9IHRoaXMueTtcclxuXHJcbiAgICAgICAgdGhpcy5pbnRlcnBvbGF0ZWRYID0gdGhpcy54O1xyXG4gICAgICAgIHRoaXMuaW50ZXJwb2xhdGVkWSA9IHRoaXMueTtcclxuXHJcbiAgICAgICAgdGhpcy5jbG9zZXN0Q29sbGlzaW9uID0gWzEsIDAsIEluZmluaXR5XTtcclxuICAgIFxyXG4gICAgICAgIHRoaXMubGVmdEJ1dHRvbiA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucmlnaHRCdXR0b24gPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmp1bXBCdXR0b24gPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIodGFyZ2V0OiBwNSwgdXBzY2FsZVNpemU6IG51bWJlcik6IHZvaWQge1xyXG5cclxuICAgICAgICB0aGlzLnRpbWVJblRoaXNBbmltYXRpb25GcmFtZSArPSBnYW1lLmRlbHRhVGltZTtcclxuICAgICAgICBpZih0aGlzLnRpbWVJblRoaXNBbmltYXRpb25GcmFtZT5QbGF5ZXJBbmltYXRpb25zW3RoaXMuY3VycmVudEFuaW1hdGlvbl1bdGhpcy5hbmltRnJhbWVdWzFdKSB7XHJcbiAgICAgICAgICAgIHRoaXMudGltZUluVGhpc0FuaW1hdGlvbkZyYW1lID0gMDsvL3RoaXMgZG9lcyBpbnRyb2R1Y2Ugc29tZSBzbGlnaHQgaW5hY2N1cmFjaWVzIHZzIHN1YnRyYWN0aW5nIGl0LCBidXQsIHdoZW4geW91IHRhYiBiYWNrIGludG8gdGhlIGJyb3dzZXIgYWZ0ZXIgYmVpbmcgdGFiYmVkIG91dCwgc3VidHJhY3RpbmcgaXQgY2F1c2VzIHNwYXp6aW5nXHJcbiAgICAgICAgICAgIHRoaXMuYW5pbUZyYW1lKys7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuYW5pbUZyYW1lPj1QbGF5ZXJBbmltYXRpb25zW3RoaXMuY3VycmVudEFuaW1hdGlvbl0ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFuaW1GcmFtZSA9IHRoaXMuYW5pbUZyYW1lJVBsYXllckFuaW1hdGlvbnNbdGhpcy5jdXJyZW50QW5pbWF0aW9uXS5sZW5ndGg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHRhcmdldC5yZWN0KFxyXG4gICAgICAgIC8vICAgICAodGhpcy5pbnRlcnBvbGF0ZWRYICogZ2FtZS5USUxFX1dJRFRIIC1cclxuICAgICAgICAvLyAgICAgICAgIGdhbWUuaW50ZXJwb2xhdGVkQ2FtWCAqIGdhbWUuVElMRV9XSURUSCkgKlxyXG4gICAgICAgIC8vICAgICAgICAgdXBzY2FsZVNpemUsXHJcbiAgICAgICAgLy8gICAgICh0aGlzLmludGVycG9sYXRlZFkgKiBnYW1lLlRJTEVfSEVJR0hUIC1cclxuICAgICAgICAvLyAgICAgICAgIGdhbWUuaW50ZXJwb2xhdGVkQ2FtWSAqIGdhbWUuVElMRV9IRUlHSFQpICpcclxuICAgICAgICAvLyAgICAgICAgIHVwc2NhbGVTaXplLFxyXG4gICAgICAgIC8vICAgICB0aGlzLndpZHRoICogdXBzY2FsZVNpemUgKiBnYW1lLlRJTEVfV0lEVEgsXHJcbiAgICAgICAgLy8gICAgIHRoaXMuaGVpZ2h0ICogdXBzY2FsZVNpemUgKiBnYW1lLlRJTEVfSEVJR0hUXHJcbiAgICAgICAgLy8gKTtcclxuICAgICAgICBQbGF5ZXJBbmltYXRpb25zW3RoaXMuY3VycmVudEFuaW1hdGlvbl1bdGhpcy5hbmltRnJhbWVdWzBdLnJlbmRlclxyXG4gICAgICAgICAgICAoXHJcbiAgICAgICAgICAgICAgICB0YXJnZXQsXHJcbiAgICAgICAgICAgICAgICBNYXRoLnJvdW5kKCh0aGlzLmludGVycG9sYXRlZFggKiBnYW1lLlRJTEVfV0lEVEggLVxyXG4gICAgICAgICAgICAgICAgICAgIGdhbWUuaW50ZXJwb2xhdGVkQ2FtWCAqIGdhbWUuVElMRV9XSURUSCkgKlxyXG4gICAgICAgICAgICAgICAgdXBzY2FsZVNpemUpLFxyXG4gICAgICAgICAgICAgICAgTWF0aC5yb3VuZCgodGhpcy5pbnRlcnBvbGF0ZWRZICogZ2FtZS5USUxFX0hFSUdIVCAtXHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS5pbnRlcnBvbGF0ZWRDYW1ZICogZ2FtZS5USUxFX0hFSUdIVCkgKlxyXG4gICAgICAgICAgICAgICAgdXBzY2FsZVNpemUpLFxyXG4gICAgICAgICAgICAgICAgdGhpcy53aWR0aCAqIHVwc2NhbGVTaXplICogZ2FtZS5USUxFX1dJRFRILFxyXG4gICAgICAgICAgICAgICAgdGhpcy5oZWlnaHQgKiB1cHNjYWxlU2l6ZSAqIGdhbWUuVElMRV9IRUlHSFRcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgUGxheWVyQW5pbWF0aW9uc1t0aGlzLmN1cnJlbnRBbmltYXRpb25dW3RoaXMuYW5pbUZyYW1lXVswXS5yZW5kZXJXb3JsZHNwYWNlUmVmbGVjdGlvblxyXG4gICAgICAgICAgICAoXHJcbiAgICAgICAgICAgICAgICB0aGlzLmludGVycG9sYXRlZFgsXHJcbiAgICAgICAgICAgICAgICB0aGlzLmludGVycG9sYXRlZFkrdGhpcy5oZWlnaHQsXHJcbiAgICAgICAgICAgICAgICB0aGlzLndpZHRoLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5oZWlnaHRcclxuICAgICAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVEYXRhKGRhdGE6IEVudGl0eVBheWxvYWQpOiB2b2lkIHtcclxuICAgICAgICBpZiAoZGF0YS50eXBlID09PSBFbnRpdGllcy5QbGF5ZXIpIHRoaXMubmFtZSA9IGRhdGEuZGF0YS5uYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIGtleWJvYXJkSW5wdXQoKSB7XHJcblxyXG4gICAgICAgIHRoaXMueFZlbCArPVxyXG4gICAgICAgICAgICAwLjAyICogKCt0aGlzLnJpZ2h0QnV0dG9uIC0gK3RoaXMubGVmdEJ1dHRvbik7XHJcbiAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICB0aGlzLmdyb3VuZGVkICYmIHRoaXMuanVtcEJ1dHRvblxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICBnYW1lLnNjcmVlbnNoYWtlQW1vdW50ID0gMC41O1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwICogZ2FtZS5wYXJ0aWNsZU11bHRpcGxpZXI7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5ib3R0b21Db2xsaXNpb24gIT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgICBnYW1lLnBhcnRpY2xlcy5wdXNoKG5ldyBDb2xvclBhcnRpY2xlKHRoaXMuYm90dG9tQ29sbGlzaW9uLmNvbG9yLCAxIC8gOCArIE1hdGgucmFuZG9tKCkgLyA4LCAyMCwgdGhpcy54ICsgdGhpcy53aWR0aCAqIE1hdGgucmFuZG9tKCksIHRoaXMueSArIHRoaXMuaGVpZ2h0LCAwLjIgKiAoTWF0aC5yYW5kb20oKSAtIDAuNSksIDAuMiAqIC1NYXRoLnJhbmRvbSgpKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy55VmVsID0gLTEuNTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYXBwbHlHcmF2aXR5QW5kRHJhZygpIHtcclxuICAgICAgICAvLyB0aGlzIGZ1bmN0aW9uIGNoYW5nZXMgdGhlIG9iamVjdCdzIG5leHQgdGljaydzIHZlbG9jaXR5IGluIGJvdGggdGhlIHggYW5kIHRoZSB5IGRpcmVjdGlvbnNcclxuXHJcbiAgICAgICAgdGhpcy5wWFZlbCA9IHRoaXMueFZlbDtcclxuICAgICAgICB0aGlzLnBZVmVsID0gdGhpcy55VmVsO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5ib3R0b21Db2xsaXNpb24gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLnhWZWwgLT1cclxuICAgICAgICAgICAgICAgIChNYXRoLmFicyh0aGlzLnhWZWwpICogdGhpcy54VmVsICogZ2FtZS5EUkFHX0NPRUZGSUNJRU5UICogdGhpcy53aWR0aCkgLyAvL2FwcGx5IGFpciByZXNpc3RhbmNlXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1hc3M7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy54VmVsIC09XHJcbiAgICAgICAgICAgICAgICAoTWF0aC5hYnModGhpcy54VmVsKSAqIHRoaXMueFZlbCAqIGdhbWUuRFJBR19DT0VGRklDSUVOVCAqICh0aGlzLmJvdHRvbUNvbGxpc2lvbi5mcmljdGlvbikgKiB0aGlzLndpZHRoKSAvIC8vYXBwbHkgYWlyIHJlc2lzdGFuY2UgYW5kIGdyb3VuZCBmcmljdGlvblxyXG4gICAgICAgICAgICAgICAgdGhpcy5tYXNzO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnlWZWwgKz0gZ2FtZS5HUkFWSVRZX1NQRUVEO1xyXG4gICAgICAgIHRoaXMueVZlbCAtPVxyXG4gICAgICAgICAgICAoZ2FtZS5hYnModGhpcy55VmVsKSAqIHRoaXMueVZlbCAqIGdhbWUuRFJBR19DT0VGRklDSUVOVCAqIHRoaXMuaGVpZ2h0KSAvXHJcbiAgICAgICAgICAgIHRoaXMubWFzcztcclxuICAgICAgICAvL2lmIG9uIHRoZSBncm91bmQsIG1ha2Ugd2Fsa2luZyBwYXJ0aWNsZXNcclxuICAgICAgICBpZiAodGhpcy5ncm91bmRlZCkge1xyXG4gICAgICAgICAgICAvL2Zvb3RzdGVwc1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJhbmRvbWx5VG9JbnQoTWF0aC5hYnModGhpcy54VmVsKSAqIGdhbWUucGFydGljbGVNdWx0aXBsaWVyIC8gMik7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgZ2FtZS5wYXJ0aWNsZXMucHVzaChuZXcgQ29sb3JQYXJ0aWNsZShcIiNiYmJiYmI0NVwiLCAxIC8gNCArIE1hdGgucmFuZG9tKCkgLyA4LCA1MCwgdGhpcy54ICsgdGhpcy53aWR0aCAvIDIgKyBpIC8gZ2FtZS5wYXJ0aWNsZU11bHRpcGxpZXIsIHRoaXMueSArIHRoaXMuaGVpZ2h0LCAwLCAwLCBmYWxzZSkpO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvL2R1c3RcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByYW5kb21seVRvSW50KE1hdGguYWJzKHRoaXMueFZlbCkgKiBnYW1lLnBhcnRpY2xlTXVsdGlwbGllciAvIDIpOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuYm90dG9tQ29sbGlzaW9uICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICBnYW1lLnBhcnRpY2xlcy5wdXNoKG5ldyBDb2xvclBhcnRpY2xlKHRoaXMuYm90dG9tQ29sbGlzaW9uLmNvbG9yLCAxIC8gOCArIE1hdGgucmFuZG9tKCkgLyA4LCAxMCwgdGhpcy54ICsgdGhpcy53aWR0aCAvIDIsIHRoaXMueSArIHRoaXMuaGVpZ2h0LCAwLjIgKiAtdGhpcy54VmVsICsgMC4yICogKE1hdGgucmFuZG9tKCkgLSAwLjUpLCAwLjIgKiAtTWF0aC5yYW5kb20oKSwgdHJ1ZSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMuY3VycmVudEFuaW1hdGlvbiAhPT0gXCJ3YWxrXCIgJiYgKHRoaXMueFZlbCk+MC4wNSkge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRBbmltYXRpb24gPSBcIndhbGtcIjtcclxuICAgICAgICAgICAgdGhpcy5hbmltRnJhbWUgPSB0aGlzLmFuaW1GcmFtZSAlIFBsYXllckFuaW1hdGlvbnNbdGhpcy5jdXJyZW50QW5pbWF0aW9uXS5sZW5ndGg7XHJcbiAgICAgICAgICAgIHRoaXMuZmFjaW5nUmlnaHQgPSB0cnVlO1xyXG4gICAgICAgICAgICBnYW1lLmNvbm5lY3Rpb24uZW1pdCgncGxheWVyQW5pbWF0aW9uJywgdGhpcy5jdXJyZW50QW5pbWF0aW9uLCB0aGlzLmVudGl0eUlkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5jdXJyZW50QW5pbWF0aW9uICE9PSBcIndhbGtsZWZ0XCIgJiYgKHRoaXMueFZlbCk8LTAuMDUpIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50QW5pbWF0aW9uID0gXCJ3YWxrbGVmdFwiO1xyXG4gICAgICAgICAgICB0aGlzLmZhY2luZ1JpZ2h0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuYW5pbUZyYW1lID0gdGhpcy5hbmltRnJhbWUgJSBQbGF5ZXJBbmltYXRpb25zW3RoaXMuY3VycmVudEFuaW1hdGlvbl0ubGVuZ3RoO1xyXG4gICAgICAgICAgICBnYW1lLmNvbm5lY3Rpb24uZW1pdCgncGxheWVyQW5pbWF0aW9uJywgdGhpcy5jdXJyZW50QW5pbWF0aW9uLCB0aGlzLmVudGl0eUlkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5jdXJyZW50QW5pbWF0aW9uICE9PSBcImlkbGVcIiAmJiBnYW1lLndvcmxkTW91c2VYPnRoaXMuaW50ZXJwb2xhdGVkWCt0aGlzLndpZHRoLzIpIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50QW5pbWF0aW9uID0gXCJpZGxlXCI7XHJcbiAgICAgICAgICAgIHRoaXMuYW5pbUZyYW1lID0gdGhpcy5hbmltRnJhbWUgJSBQbGF5ZXJBbmltYXRpb25zW3RoaXMuY3VycmVudEFuaW1hdGlvbl0ubGVuZ3RoO1xyXG4gICAgICAgICAgICBnYW1lLmNvbm5lY3Rpb24uZW1pdCgncGxheWVyQW5pbWF0aW9uJywgdGhpcy5jdXJyZW50QW5pbWF0aW9uLCB0aGlzLmVudGl0eUlkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5jdXJyZW50QW5pbWF0aW9uICE9PSBcImlkbGVsZWZ0XCIgJiYgZ2FtZS53b3JsZE1vdXNlWDw9dGhpcy5pbnRlcnBvbGF0ZWRYK3RoaXMud2lkdGgvMil7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEFuaW1hdGlvbiA9IFwiaWRsZWxlZnRcIjtcclxuICAgICAgICAgICAgdGhpcy5hbmltRnJhbWUgPSB0aGlzLmFuaW1GcmFtZSAlIFBsYXllckFuaW1hdGlvbnNbdGhpcy5jdXJyZW50QW5pbWF0aW9uXS5sZW5ndGg7XHJcbiAgICAgICAgICAgIGdhbWUuY29ubmVjdGlvbi5lbWl0KCdwbGF5ZXJBbmltYXRpb24nLCB0aGlzLmN1cnJlbnRBbmltYXRpb24sIHRoaXMuZW50aXR5SWQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmaW5kSW50ZXJwb2xhdGVkQ29vcmRpbmF0ZXMoKSB7XHJcbiAgICAgICAgLy8gdGhpcyBmdW5jdGlvbiBlc3NlbnRpYWxseSBtYWtlcyB0aGUgY2hhcmFjdGVyIGxhZyBiZWhpbmQgb25lIHRpY2ssIGJ1dCBtZWFucyB0aGF0IGl0IGdldHMgZGlzcGxheWVkIGF0IHRoZSBtYXhpbXVtIGZyYW1lIHJhdGUuXHJcbiAgICAgICAgaWYgKHRoaXMucFhWZWwgPiAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW50ZXJwb2xhdGVkWCA9IGdhbWUubWluKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5wWCArIHRoaXMucFhWZWwgKiBnYW1lLmFtb3VudFNpbmNlTGFzdFRpY2ssXHJcbiAgICAgICAgICAgICAgICB0aGlzLnhcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmludGVycG9sYXRlZFggPSBnYW1lLm1heChcclxuICAgICAgICAgICAgICAgIHRoaXMucFggKyB0aGlzLnBYVmVsICogZ2FtZS5hbW91bnRTaW5jZUxhc3RUaWNrLFxyXG4gICAgICAgICAgICAgICAgdGhpcy54XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLnBZVmVsID4gMCkge1xyXG4gICAgICAgICAgICB0aGlzLmludGVycG9sYXRlZFkgPSBnYW1lLm1pbihcclxuICAgICAgICAgICAgICAgIHRoaXMucFkgKyB0aGlzLnBZVmVsICogZ2FtZS5hbW91bnRTaW5jZUxhc3RUaWNrLFxyXG4gICAgICAgICAgICAgICAgdGhpcy55XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5pbnRlcnBvbGF0ZWRZID0gZ2FtZS5tYXgoXHJcbiAgICAgICAgICAgICAgICB0aGlzLnBZICsgdGhpcy5wWVZlbCAqIGdhbWUuYW1vdW50U2luY2VMYXN0VGljayxcclxuICAgICAgICAgICAgICAgIHRoaXMueVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBhcHBseVZlbG9jaXR5QW5kQ29sbGlkZSgpIHtcclxuICAgICAgICB0aGlzLnRvcENvbGxpc2lvbiA9IFdvcmxkVGlsZXNbVGlsZVR5cGUuQWlyXTtcclxuICAgICAgICB0aGlzLmJvdHRvbUNvbGxpc2lvbiA9IFdvcmxkVGlsZXNbVGlsZVR5cGUuQWlyXTtcclxuICAgICAgICB0aGlzLnBYID0gdGhpcy54O1xyXG4gICAgICAgIHRoaXMucFkgPSB0aGlzLnk7XHJcblxyXG4gICAgICAgIHRoaXMucEdyb3VuZGVkID0gdGhpcy5ncm91bmRlZDtcclxuICAgICAgICB0aGlzLmdyb3VuZGVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgVGhpcyBmdW5jdGlvbiBhc3N1bWVzIHRoYXQgdGhlIG9iamVjdCBkb2Vzbid0IHN0YXJ0IGluIGNvbGxpc2lvblxyXG5cclxuICAgICAgICBBbHNvLCBpdCB0YWtlcyBhZHZhbnRhZ2Ugb2YgdGhlIGZhY3QgdGhhdCBhbiBvYmplY3QgY2FuIG9ubHkgY29sbGlkZSBvbmNlIGluIGVhY2ggYXhpcyB3aXRoIHRoZXNlIGF4aXMtYWxpZ25lZCByZWN0YW5nbGVzLlxyXG4gICAgICAgIFRoYXQncyBhIHRvdGFsIG9mIGEgcG9zc2libGUgdHdvIGNvbGxpc2lvbnMsIG9yIGFuIGluaXRpYWwgY29sbGlzaW9uLCBhbmQgYSBzbGlkaW5nIGNvbGxpc2lvbi5cclxuICAgICAgICAqL1xyXG5cclxuICAgICAgICAvLyBjYWxjdWxhdGUgdGhlIGluaXRpYWwgY29sbGlzaW9uOlxyXG5cclxuICAgICAgICAvLyBzZXQgdGhlIGNsb3Nlc3QgY29sbGlzaW9uIHRvIG9uZSBpbmZpbml0ZWx5IGZhciBhd2F5LlxyXG4gICAgICAgIHRoaXMuY2xvc2VzdENvbGxpc2lvbiA9IFsxLCAwLCBJbmZpbml0eV07XHJcblxyXG4gICAgICAgIGxldCBtb3N0bHlHb2luZ0hvcml6b250YWxseTogYm9vbGVhbjtcclxuXHJcbiAgICAgICAgLy8gbG9vcCB0aHJvdWdoIGFsbCB0aGUgcG9zc2libGUgdGlsZXMgdGhlIHBoeXNpY3MgYm94IGNvdWxkIGJlIGludGVyc2VjdGluZyB3aXRoXHJcbiAgICAgICAgZm9yIChcclxuICAgICAgICAgICAgbGV0IGkgPSBNYXRoLmZsb29yKGdhbWUubWluKHRoaXMueCwgdGhpcy54ICsgdGhpcy54VmVsKSk7XHJcbiAgICAgICAgICAgIGkgPCBNYXRoLmNlaWwoZ2FtZS5tYXgodGhpcy54LCB0aGlzLnggKyB0aGlzLnhWZWwpICsgdGhpcy53aWR0aCk7XHJcbiAgICAgICAgICAgIGkrK1xyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICBmb3IgKFxyXG4gICAgICAgICAgICAgICAgbGV0IGogPSBNYXRoLmZsb29yKGdhbWUubWluKHRoaXMueSwgdGhpcy55ICsgdGhpcy55VmVsKSk7XHJcbiAgICAgICAgICAgICAgICBqIDwgTWF0aC5jZWlsKGdhbWUubWF4KHRoaXMueSwgdGhpcy55ICsgdGhpcy55VmVsKSArIHRoaXMuaGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgIGorK1xyXG4gICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBjdXJyZW50IHRpbGUgaXNuJ3QgYWlyICh2YWx1ZSAwKSwgdGhlbiBjb250aW51ZSB3aXRoIHRoZSBjb2xsaXNpb24gZGV0ZWN0aW9uXHJcbiAgICAgICAgICAgICAgICBsZXQgY3VycmVudEJsb2NrOiBUaWxlVHlwZSB8IHN0cmluZyA9IGdhbWUud29ybGQud29ybGRUaWxlc1tqICogZ2FtZS53b3JsZFdpZHRoICsgaV07XHJcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudEJsb2NrICE9PSBUaWxlVHlwZS5BaXIgJiYgdHlwZW9mIGN1cnJlbnRCbG9jayA9PT0gJ251bWJlcicpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBnZXQgdGhlIGRhdGEgYWJvdXQgdGhlIGNvbGxpc2lvbiBhbmQgc3RvcmUgaXQgaW4gYSB2YXJpYWJsZVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29sbGlzaW9uRGF0YSA9IGdhbWUucmVjdFZzUmF5KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpIC0gdGhpcy53aWR0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaiAtIHRoaXMuaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLndpZHRoICsgMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oZWlnaHQgKyAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLngsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMueSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy54VmVsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnlWZWxcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgIG1vc3RseUdvaW5nSG9yaXpvbnRhbGx5ID0gTWF0aC5hYnModGhpcy54VmVsKSA+IE1hdGguYWJzKHRoaXMueVZlbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbGxpc2lvbkRhdGEgIT09IGZhbHNlKSB7Ly9hIGNvbGxpc2lvbiBoYXBwZW5lZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMl0gPiB0aGlzLmNvbGxpc2lvbkRhdGFbMl1cclxuICAgICAgICAgICAgICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3Nlc3RDb2xsaXNpb24gPSB0aGlzLmNvbGxpc2lvbkRhdGE7Ly9ob25lc3RseSB0aGlzIGVudGlyZSBjb2xsaXNpb24gc3lzdGVtIGlzIGEgbWVzcyBidXQgaXQgd29yayBzbyBzbyB3aGF0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jbG9zZXN0Q29sbGlzaW9uWzBdID09PSAwKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMV0gPT09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b3BDb2xsaXNpb24gPSBXb3JsZFRpbGVzW2N1cnJlbnRCbG9ja107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJvdHRvbUNvbGxpc2lvbiA9IFdvcmxkVGlsZXNbY3VycmVudEJsb2NrXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5jbG9zZXN0Q29sbGlzaW9uWzJdID09PSB0aGlzLmNvbGxpc2lvbkRhdGFbMl0gJiYgbW9zdGx5R29pbmdIb3Jpem9udGFsbHkgPT09ICh0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMF0gPT09IDApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3Nlc3RDb2xsaXNpb24gPSB0aGlzLmNvbGxpc2lvbkRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jbG9zZXN0Q29sbGlzaW9uWzBdID09PSAwKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMV0gPT09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b3BDb2xsaXNpb24gPSBXb3JsZFRpbGVzW2N1cnJlbnRCbG9ja107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJvdHRvbUNvbGxpc2lvbiA9IFdvcmxkVGlsZXNbY3VycmVudEJsb2NrXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5jbG9zZXN0Q29sbGlzaW9uWzJdICE9PSBJbmZpbml0eSkge1xyXG4gICAgICAgICAgICAvLyB0aGVyZSBoYXMgYmVlbiBhdCBsZWFzdCBvbmUgY29sbGlzaW9uXHJcblxyXG4gICAgICAgICAgICAvLyBnbyB0byB0aGUgcG9pbnQgb2YgY29sbGlzaW9uICh0aGlzIG1ha2VzIGl0IGJlaGF2ZSBhcyBpZiB0aGUgd2FsbHMgYXJlIHN0aWNreSwgYnV0IHdlIHdpbGwgbGF0ZXIgc2xpZGUgYWdhaW5zdCB0aGUgd2FsbHMpXHJcbiAgICAgICAgICAgIHRoaXMueCArPSB0aGlzLnhWZWwgKiB0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMl07XHJcbiAgICAgICAgICAgIHRoaXMueSArPSB0aGlzLnlWZWwgKiB0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMl07XHJcbiAgICAgICAgICAgIC8vIHRoZSBjb2xsaXNpb24gaGFwcGVuZWQgZWl0aGVyIG9uIHRoZSB0b3Agb3IgYm90dG9tXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMF0gPT09IDApIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMV0gPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ncm91bmRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgaXQgY29sbGlkZWQgb24gdGhlIGhpZ2hlciBzaWRlLCBpdCBtdXN0IGJlIHRvdWNoaW5nIHRoZSBncm91bmQuIChoaWdoZXIgeSBpcyBkb3duKVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5wR3JvdW5kZWQpIHsvL2lmIGl0IGlzbid0IGdyb3VuZGVkIHlldCwgaXQgbXVzdCBiZSBjb2xsaWRpbmcgd2l0aCB0aGUgZ3JvdW5kIGZvciB0aGUgZmlyc3QgdGltZSwgc28gc3VtbW9uIHBhcnRpY2xlc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBnYW1lLnNjcmVlbnNoYWtlQW1vdW50ID0gTWF0aC5hYnModGhpcy55VmVsICogMC43NSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNSAqIGdhbWUucGFydGljbGVNdWx0aXBsaWVyOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuYm90dG9tQ29sbGlzaW9uICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2FtZS5wYXJ0aWNsZXMucHVzaChuZXcgQ29sb3JQYXJ0aWNsZSh0aGlzLmJvdHRvbUNvbGxpc2lvbi5jb2xvciwgMSAvIDggKyBNYXRoLnJhbmRvbSgpIC8gOCwgMjAsIHRoaXMueCArIHRoaXMud2lkdGggKiBNYXRoLnJhbmRvbSgpLCB0aGlzLnkgKyB0aGlzLmhlaWdodCwgMC4yICogKE1hdGgucmFuZG9tKCkgLSAwLjUpLCAwLjIgKiAtTWF0aC5yYW5kb20oKSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS5zY3JlZW5zaGFrZUFtb3VudCA9IE1hdGguYWJzKHRoaXMueVZlbCAqIDAuNzUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNSAqIGdhbWUucGFydGljbGVNdWx0aXBsaWVyOyBpKyspIHsvL2NlaWxpbmcgY29sbGlzaW9uIHBhcnRpY2xlc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZih0aGlzLnRvcENvbGxpc2lvbiAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2FtZS5wYXJ0aWNsZXMucHVzaChuZXcgQ29sb3JQYXJ0aWNsZSh0aGlzLnRvcENvbGxpc2lvbi5jb2xvciwgMSAvIDggKyBNYXRoLnJhbmRvbSgpIC8gOCwgMjAsIHRoaXMueCArIHRoaXMud2lkdGggKiBNYXRoLnJhbmRvbSgpLCB0aGlzLnksIDAuMiAqIChNYXRoLnJhbmRvbSgpIC0gMC41KSwgMC4yICogLU1hdGgucmFuZG9tKCkpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLnlWZWwgPSAwOyAvLyBzZXQgdGhlIHkgdmVsb2NpdHkgdG8gMCBiZWNhdXNlIHRoZSBvYmplY3QgaGFzIHJ1biBpbnRvIGEgd2FsbCBvbiBpdHMgdG9wIG9yIGJvdHRvbVxyXG4gICAgICAgICAgICAgICAgdGhpcy5zbGlkZVggPSB0aGlzLnhWZWwgKiAoMSAtIHRoaXMuY2xvc2VzdENvbGxpc2lvblsyXSk7IC8vIHRoaXMgaXMgdGhlIHJlbWFpbmluZyBkaXN0YW5jZSB0byBzbGlkZSBhZnRlciB0aGUgY29sbGlzaW9uXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNsaWRlWSA9IDA7IC8vIGl0IGRvZXNuJ3Qgc2xpZGUgaW4gdGhlIHkgZGlyZWN0aW9uIGJlY2F1c2UgdGhlcmUncyBhIHdhbGwgXFwoLi0uKS9cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMueFZlbCA9IDA7IC8vIHNldCB0aGUgeCB2ZWxvY2l0eSB0byAwIGJlY2F1c2Ugd2FsbCBnbyBvb2ZcclxuICAgICAgICAgICAgICAgIHRoaXMuc2xpZGVYID0gMDsgLy8gaXQgZG9lc24ndCBzbGlkZSBpbiB0aGUgeCBkaXJlY3Rpb24gYmVjYXVzZSB0aGVyZSdzIGEgd2FsbCAvKC5fLilcXFxyXG4gICAgICAgICAgICAgICAgdGhpcy5zbGlkZVkgPSB0aGlzLnlWZWwgKiAoMSAtIHRoaXMuY2xvc2VzdENvbGxpc2lvblsyXSk7IC8vIHRoaXMgaXMgdGhlIHJlbWFpbmluZyBkaXN0YW5jZSB0byBzbGlkZSBhZnRlciB0aGUgY29sbGlzaW9uXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIGF0IHRoaXMgcG9pbnQsIHRoZSBvYmplY3QgaXMgdG91Y2hpbmcgaXRzIGZpcnN0IGNvbGxpc2lvbiwgcmVhZHkgdG8gc2xpZGUuICBUaGUgYW1vdW50IGl0IHdhbnRzIHRvIHNsaWRlIGlzIGhlbGQgaW4gdGhlIHRoaXMuc2xpZGVYIGFuZCB0aGlzLnNsaWRlWSB2YXJpYWJsZXMuXHJcblxyXG4gICAgICAgICAgICAvLyB0aGlzIGNhbiBiZSB0cmVhdGVkIGVzc2VudGlhbGx5IHRoZSBzYW1lIGFzIHRoZSBmaXJzdCBjb2xsaXNpb24sIHNvIGEgbG90IG9mIHRoZSBjb2RlIHdpbGwgYmUgcmV1c2VkLlxyXG5cclxuICAgICAgICAgICAgLy8gc2V0IHRoZSBjbG9zZXN0IGNvbGxpc2lvbiB0byBvbmUgaW5maW5pdGVseSBmYXIgYXdheS5cclxuICAgICAgICAgICAgdGhpcy5jbG9zZXN0Q29sbGlzaW9uID0gWzEsIDAsIEluZmluaXR5XTtcclxuXHJcbiAgICAgICAgICAgIC8vIGxvb3AgdGhyb3VnaCBhbGwgdGhlIHBvc3NpYmxlIHRpbGVzIHRoZSBwaHlzaWNzIGJveCBjb3VsZCBiZSBpbnRlcnNlY3Rpbmcgd2l0aFxyXG4gICAgICAgICAgICBmb3IgKFxyXG4gICAgICAgICAgICAgICAgbGV0IGkgPSBNYXRoLmZsb29yKGdhbWUubWluKHRoaXMueCwgdGhpcy54ICsgdGhpcy5zbGlkZVgpKTtcclxuICAgICAgICAgICAgICAgIGkgPCBNYXRoLmNlaWwoZ2FtZS5tYXgodGhpcy54LCB0aGlzLnggKyB0aGlzLnNsaWRlWCkgKyB0aGlzLndpZHRoKTtcclxuICAgICAgICAgICAgICAgIGkrK1xyXG4gICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgIGZvciAoXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGogPSBNYXRoLmZsb29yKGdhbWUubWluKHRoaXMueSwgdGhpcy55ICsgdGhpcy5zbGlkZVkpKTtcclxuICAgICAgICAgICAgICAgICAgICBqIDxcclxuICAgICAgICAgICAgICAgICAgICBNYXRoLmNlaWwoZ2FtZS5tYXgodGhpcy55LCB0aGlzLnkgKyB0aGlzLnNsaWRlWSkgKyB0aGlzLmhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaisrXHJcbiAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgY3VycmVudEJsb2NrOiBUaWxlVHlwZSB8IHN0cmluZyA9IGdhbWUud29ybGQud29ybGRUaWxlc1tqICogZ2FtZS53b3JsZFdpZHRoICsgaV07XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhlIGN1cnJlbnQgdGlsZSBpc24ndCBhaXIsIHRoZW4gY29udGludWUgd2l0aCB0aGUgY29sbGlzaW9uIGRldGVjdGlvblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50QmxvY2sgIT09IFRpbGVUeXBlLkFpciAmJiB0eXBlb2YgY3VycmVudEJsb2NrID09PSBcIm51bWJlclwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGdldCB0aGUgZGF0YSBhYm91dCB0aGUgY29sbGlzaW9uIGFuZCBzdG9yZSBpdCBpbiBhIHZhcmlhYmxlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29sbGlzaW9uRGF0YSA9IGdhbWUucmVjdFZzUmF5KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaSAtIHRoaXMud2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqIC0gdGhpcy5oZWlnaHQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLndpZHRoICsgMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGVpZ2h0ICsgMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMueCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMueSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2xpZGVYLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zbGlkZVlcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb2xsaXNpb25EYXRhICE9PSBmYWxzZSAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9zZXN0Q29sbGlzaW9uWzJdID4gdGhpcy5jb2xsaXNpb25EYXRhWzJdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9zZXN0Q29sbGlzaW9uID0gdGhpcy5jb2xsaXNpb25EYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2xvc2VzdENvbGxpc2lvblswXSA9PT0gMCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jbG9zZXN0Q29sbGlzaW9uWzFdID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG9wQ29sbGlzaW9uID0gV29ybGRUaWxlc1tjdXJyZW50QmxvY2tdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ib3R0b21Db2xsaXNpb24gPSBXb3JsZFRpbGVzW2N1cnJlbnRCbG9ja107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBpdCBoYXMgY29sbGlkZWQgd2hpbGUgdHJ5aW5nIHRvIHNsaWRlXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMl0gIT09IEluZmluaXR5KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnggKz0gdGhpcy5zbGlkZVggKiB0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMl07XHJcbiAgICAgICAgICAgICAgICB0aGlzLnkgKz0gdGhpcy5zbGlkZVkgKiB0aGlzLmNsb3Nlc3RDb2xsaXNpb25bMl07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2xvc2VzdENvbGxpc2lvblswXSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMueVZlbCA9IDA7IC8vIHNldCB0aGUgeSB2ZWxvY2l0eSB0byAwIGJlY2F1c2UgdGhlIG9iamVjdCBoYXMgcnVuIGludG8gYSB3YWxsIG9uIGl0cyB0b3Agb3IgYm90dG9tXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2xvc2VzdENvbGxpc2lvblsxXSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgaXQgY29sbGlkZWQgb24gdGhlIGhpZ2hlciBzaWRlLCBpdCBtdXN0IGJlIHRvdWNoaW5nIHRoZSBncm91bmQuIChoaWdoZXIgeSBpcyBkb3duKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdyb3VuZGVkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnhWZWwgPSAwOyAvLyBzZXQgdGhlIHggdmVsb2NpdHkgdG8gMCBiZWNhdXNlIHdhbGwgZ28gb29mXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBpdCBoYXMgbm90IGNvbGxpZGVkIHdoaWxlIHRyeWluZyB0byBzbGlkZVxyXG4gICAgICAgICAgICAgICAgdGhpcy54ICs9IHRoaXMuc2xpZGVYO1xyXG4gICAgICAgICAgICAgICAgdGhpcy55ICs9IHRoaXMuc2xpZGVZO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gdGhlcmUgaGFzIGJlZW4gbm8gY29sbGlzaW9uXHJcbiAgICAgICAgICAgIHRoaXMueCArPSB0aGlzLnhWZWw7XHJcbiAgICAgICAgICAgIHRoaXMueSArPSB0aGlzLnlWZWw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBjb2xsaWRlIHdpdGggc2lkZXMgb2YgbWFwXHJcblxyXG4gICAgICAgIGlmICh0aGlzLnggPCAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMueFZlbCA9IDA7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnggKyB0aGlzLndpZHRoID4gZ2FtZS53b3JsZFdpZHRoKSB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IGdhbWUud29ybGRXaWR0aCAtIHRoaXMud2lkdGg7XHJcbiAgICAgICAgICAgIHRoaXMueFZlbCA9IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy55ICsgdGhpcy5oZWlnaHQgPiBnYW1lLndvcmxkSGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIHRoaXMueSA9IGdhbWUud29ybGRIZWlnaHQgLSB0aGlzLmhlaWdodDtcclxuICAgICAgICAgICAgdGhpcy55VmVsID0gMDtcclxuICAgICAgICAgICAgdGhpcy5ncm91bmRlZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gcmFuZG9tbHlUb0ludChmOiBudW1iZXIpIHtcclxuICAgIGlmIChNYXRoLnJhbmRvbSgpID4gZiAtIE1hdGguZmxvb3IoZikpIHtcclxuICAgICAgICByZXR1cm4gKE1hdGguZmxvb3IoZikpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIChNYXRoLmNlaWwoZikpO1xyXG59IiwiaW1wb3J0IHsgUmVuZGVyYWJsZSB9IGZyb20gJy4uL2ludGVyZmFjZXMvUmVuZGVyYWJsZSc7XHJcbmltcG9ydCBwNSBmcm9tICdwNSc7XHJcbmltcG9ydCB7IEF1ZGlvQXNzZXRzLCBVaUFzc2V0cyB9IGZyb20gJy4uL2Fzc2V0cy9Bc3NldHMnO1xyXG5pbXBvcnQgeyBJbWFnZVJlc291cmNlIH0gZnJvbSAnLi4vYXNzZXRzL3Jlc291cmNlcy9JbWFnZVJlc291cmNlJztcclxuaW1wb3J0IHsgRm9udFJlc291cmNlIH0gZnJvbSAnLi4vYXNzZXRzL3Jlc291cmNlcy9Gb250UmVzb3VyY2UnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEJ1dHRvbiBpbXBsZW1lbnRzIFJlbmRlcmFibGUge1xyXG5cclxuICAgIGZvbnQ6IEZvbnRSZXNvdXJjZVxyXG4gICAgdHh0OiBzdHJpbmdcclxuICAgIGRlc2NyaXB0aW9uOiBzdHJpbmdcclxuICAgIG9uUHJlc3NlZEN1c3RvbTogRnVuY3Rpb25cclxuICAgIHg6IG51bWJlclxyXG4gICAgeTogbnVtYmVyXHJcbiAgICB3OiBudW1iZXJcclxuICAgIGg6IG51bWJlclxyXG4gICAgaW1hZ2U6IEltYWdlUmVzb3VyY2VcclxuICAgIG1vdXNlSXNPdmVyOiBib29sZWFuXHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgZm9udDogRm9udFJlc291cmNlLFxyXG4gICAgICAgIHR4dDogc3RyaW5nLFxyXG4gICAgICAgIGRlc2NyaXB0aW9uOiBzdHJpbmcsXHJcbiAgICAgICAgeDogbnVtYmVyLFxyXG4gICAgICAgIHk6IG51bWJlcixcclxuICAgICAgICB3OiBudW1iZXIsXHJcbiAgICAgICAgaDogbnVtYmVyLFxyXG4gICAgICAgIG9uUHJlc3NlZEN1c3RvbTogRnVuY3Rpb24pIHtcclxuICAgICAgICB0aGlzLmZvbnQgPSBmb250O1xyXG4gICAgICAgIHRoaXMudHh0ID0gdHh0XHJcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uXHJcbiAgICAgICAgdGhpcy5vblByZXNzZWRDdXN0b20gPSBvblByZXNzZWRDdXN0b21cclxuICAgICAgICB0aGlzLnggPSB4XHJcbiAgICAgICAgdGhpcy55ID0geVxyXG4gICAgICAgIHRoaXMudyA9IHdcclxuICAgICAgICB0aGlzLmggPSBoXHJcbiAgICAgICAgdGhpcy5pbWFnZSA9IFVpQXNzZXRzLmJ1dHRvbl91bnNlbGVjdGVkO1xyXG4gICAgICAgIHRoaXMubW91c2VJc092ZXIgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIodGFyZ2V0OiBwNSwgdXBzY2FsZVNpemU6IG51bWJlcikge1xyXG4gICAgICAgIC8vIHNldCB0aGUgY29vcmRzIGFuZCBkaW1lbnNpb25zIHRvIHJvdW5kIHRvIHRoZSBuZWFyZXN0IHVuLXVwc2NhbGVkIHBpeGVsXHJcbiAgICAgICAgY29uc3QgeCA9IE1hdGgucm91bmQodGhpcy54IC8gdXBzY2FsZVNpemUpICogdXBzY2FsZVNpemU7XHJcbiAgICAgICAgY29uc3QgeSA9IE1hdGgucm91bmQodGhpcy55IC8gdXBzY2FsZVNpemUpICogdXBzY2FsZVNpemU7XHJcbiAgICAgICAgY29uc3QgdyA9IE1hdGgucm91bmQodGhpcy53IC8gdXBzY2FsZVNpemUpICogdXBzY2FsZVNpemU7XHJcbiAgICAgICAgY29uc3QgaCA9IE1hdGgucm91bmQodGhpcy5oIC8gdXBzY2FsZVNpemUpICogdXBzY2FsZVNpemU7XHJcblxyXG4gICAgICAgIC8vIGNvcm5lcnNcclxuICAgICAgICB0aGlzLmltYWdlLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4LCB5LCA3ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgMCwgMCwgNywgNyk7XHJcbiAgICAgICAgdGhpcy5pbWFnZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCArIHcgLSA3ICogdXBzY2FsZVNpemUsIHksIDcgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCA4LCAwLCA3LCA3KTtcclxuICAgICAgICB0aGlzLmltYWdlLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4LCB5ICsgaCAtIDcgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCA3ICogdXBzY2FsZVNpemUsIDAsIDgsIDcsIDcpO1xyXG4gICAgICAgIHRoaXMuaW1hZ2UucmVuZGVyUGFydGlhbCh0YXJnZXQsIHggKyB3IC0gNyAqIHVwc2NhbGVTaXplLCB5ICsgaCAtIDcgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCA3ICogdXBzY2FsZVNpemUsIDgsIDgsIDcsIDcpO1xyXG5cclxuICAgICAgICAvLyB0b3AgYW5kIGJvdHRvbVxyXG4gICAgICAgIHRoaXMuaW1hZ2UucmVuZGVyUGFydGlhbCh0YXJnZXQsIHggKyA3ICogdXBzY2FsZVNpemUsIHksIHcgLSAxNCAqIHVwc2NhbGVTaXplLCA3ICogdXBzY2FsZVNpemUsIDcsIDAsIDEsIDcpO1xyXG4gICAgICAgIHRoaXMuaW1hZ2UucmVuZGVyUGFydGlhbCh0YXJnZXQsIHggKyA3ICogdXBzY2FsZVNpemUsIHkgKyBoIC0gNyAqIHVwc2NhbGVTaXplLCB3IC0gMTQgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCA3LCA4LCAxLCA3KTtcclxuXHJcbiAgICAgICAgLy8gbGVmdCBhbmQgcmlnaHRcclxuICAgICAgICB0aGlzLmltYWdlLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4LCB5ICsgNyAqIHVwc2NhbGVTaXplLCA3ICogdXBzY2FsZVNpemUsIGggLSAxNCAqIHVwc2NhbGVTaXplLCAwLCA3LCA3LCAxKTtcclxuICAgICAgICB0aGlzLmltYWdlLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4ICsgdyAtIDcgKiB1cHNjYWxlU2l6ZSwgeSArIDcgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCBoIC0gMTQgKiB1cHNjYWxlU2l6ZSwgOCwgNywgNywgMSk7XHJcblxyXG4gICAgICAgIC8vIGNlbnRlclxyXG4gICAgICAgIHRoaXMuaW1hZ2UucmVuZGVyUGFydGlhbCh0YXJnZXQsIHggKyA3ICogdXBzY2FsZVNpemUsIHkgKyA3ICogdXBzY2FsZVNpemUsIHcgLSAxNCAqIHVwc2NhbGVTaXplLCBoIC0gMTQgKiB1cHNjYWxlU2l6ZSwgNywgNywgMSwgMSk7XHJcblxyXG4gICAgICAgIHRoaXMuZm9udC5kcmF3VGV4dCh0YXJnZXQsIHRoaXMudHh0LCB4ICsgNiAqIHVwc2NhbGVTaXplLCBNYXRoLnJvdW5kKCh0aGlzLnkgKyB0aGlzLmggLyAyKSAvIHVwc2NhbGVTaXplKSAqIHVwc2NhbGVTaXplIC0gNiAqIHVwc2NhbGVTaXplKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVNb3VzZU92ZXIobW91c2VYOiBudW1iZXIsIG1vdXNlWTogbnVtYmVyKSB7XHJcbiAgICAgICAgLy8gaWYgdGhlIG1vdXNlIHBvc2l0aW9uIGlzIGluc2lkZSB0aGUgYnV0dG9uLCByZXR1cm4gdHJ1ZVxyXG4gICAgICAgIGlmIChtb3VzZVggPiB0aGlzLnggJiYgbW91c2VYIDwgdGhpcy54ICsgdGhpcy53ICYmIG1vdXNlWSA+IHRoaXMueSAmJiBtb3VzZVkgPCB0aGlzLnkgKyB0aGlzLmgpIHtcclxuICAgICAgICAgICAgdGhpcy5tb3VzZUlzT3ZlciA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2UgPSBVaUFzc2V0cy5idXR0b25fc2VsZWN0ZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLm1vdXNlSXNPdmVyID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2UgPSBVaUFzc2V0cy5idXR0b25fdW5zZWxlY3RlZDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb25QcmVzc2VkKCkge1xyXG4gICAgICAgIHRoaXMub25QcmVzc2VkQ3VzdG9tKCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJidXR0b24gcHJlc3NlZFwiKTtcclxuICAgICAgICAvL0F1ZGlvQXNzZXRzLnVpLmludmVudG9yeUNsYWNrLnBsYXlSYW5kb20oKTtcclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgeyBSZW5kZXJhYmxlIH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9SZW5kZXJhYmxlJztcclxuaW1wb3J0IHA1IGZyb20gJ3A1JztcclxuaW1wb3J0IHsgS2V5cywgVWlBc3NldHMgfSBmcm9tICcuLi9hc3NldHMvQXNzZXRzJztcclxuaW1wb3J0IHsgSW1hZ2VSZXNvdXJjZSB9IGZyb20gJy4uL2Fzc2V0cy9yZXNvdXJjZXMvSW1hZ2VSZXNvdXJjZSc7XHJcbmltcG9ydCB7IEZvbnRSZXNvdXJjZSB9IGZyb20gJy4uL2Fzc2V0cy9yZXNvdXJjZXMvRm9udFJlc291cmNlJztcclxuXHJcbmV4cG9ydCBjbGFzcyBJbnB1dEJveCBpbXBsZW1lbnRzIFJlbmRlcmFibGUge1xyXG5cclxuICAgIGZvbnQ6IEZvbnRSZXNvdXJjZVxyXG4gICAgdHh0OiBzdHJpbmdcclxuICAgIHZhbHVlOiBudW1iZXJcclxuICAgIGtleWJvYXJkOiBib29sZWFuXHJcbiAgICBpbmRleDogbnVtYmVyXHJcbiAgICB4OiBudW1iZXJcclxuICAgIHk6IG51bWJlclxyXG4gICAgdzogbnVtYmVyXHJcbiAgICBoOiBudW1iZXJcclxuICAgIGltYWdlOiBJbWFnZVJlc291cmNlXHJcbiAgICBtb3VzZUlzT3ZlcjogYm9vbGVhblxyXG4gICAgbGlzdGVuaW5nOiBib29sZWFuXHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgZm9udDogRm9udFJlc291cmNlLFxyXG4gICAgICAgIHR4dDogc3RyaW5nLFxyXG4gICAgICAgIGtleWJvYXJkOiBib29sZWFuLFxyXG4gICAgICAgIHZhbHVlOiBudW1iZXIsXHJcbiAgICAgICAgaW5kZXg6IG51bWJlciwvLyB0aGUgaW5kZXggaW4gdGhlIEdhbWUuY29udHJvbHMgYXJyYXkgdGhhdCBpdCBjaGFuZ2VzXHJcbiAgICAgICAgeDogbnVtYmVyLFxyXG4gICAgICAgIHk6IG51bWJlcixcclxuICAgICAgICB3OiBudW1iZXIsXHJcbiAgICAgICAgaDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5mb250ID0gZm9udDtcclxuICAgICAgICB0aGlzLnR4dCA9IHR4dFxyXG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLmtleWJvYXJkID0ga2V5Ym9hcmQ7XHJcbiAgICAgICAgdGhpcy5pbmRleCA9IGluZGV4O1xyXG4gICAgICAgIHRoaXMueCA9IHhcclxuICAgICAgICB0aGlzLnkgPSB5XHJcbiAgICAgICAgdGhpcy53ID0gd1xyXG4gICAgICAgIHRoaXMuaCA9IGhcclxuICAgICAgICB0aGlzLmltYWdlID0gVWlBc3NldHMuYnV0dG9uX3Vuc2VsZWN0ZWQ7XHJcbiAgICAgICAgdGhpcy5tb3VzZUlzT3ZlciA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMubGlzdGVuaW5nID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKHRhcmdldDogcDUsIHVwc2NhbGVTaXplOiBudW1iZXIpIHtcclxuICAgICAgICAvLyBzZXQgdGhlIGNvb3JkcyBhbmQgZGltZW5zaW9ucyB0byByb3VuZCB0byB0aGUgbmVhcmVzdCB1bi11cHNjYWxlZCBwaXhlbFxyXG4gICAgICAgIGNvbnN0IHggPSBNYXRoLnJvdW5kKHRoaXMueCAvIHVwc2NhbGVTaXplKSAqIHVwc2NhbGVTaXplO1xyXG4gICAgICAgIGNvbnN0IHkgPSBNYXRoLnJvdW5kKHRoaXMueSAvIHVwc2NhbGVTaXplKSAqIHVwc2NhbGVTaXplO1xyXG4gICAgICAgIGNvbnN0IHcgPSBNYXRoLnJvdW5kKHRoaXMudyAvIHVwc2NhbGVTaXplKSAqIHVwc2NhbGVTaXplO1xyXG4gICAgICAgIGNvbnN0IGggPSBNYXRoLnJvdW5kKHRoaXMuaCAvIHVwc2NhbGVTaXplKSAqIHVwc2NhbGVTaXplO1xyXG5cclxuICAgICAgICAvLyBjb3JuZXJzXHJcbiAgICAgICAgdGhpcy5pbWFnZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCwgeSwgNyAqIHVwc2NhbGVTaXplLCA3ICogdXBzY2FsZVNpemUsIDAsIDAsIDcsIDcpO1xyXG4gICAgICAgIHRoaXMuaW1hZ2UucmVuZGVyUGFydGlhbCh0YXJnZXQsIHggKyB3IC0gNyAqIHVwc2NhbGVTaXplLCB5LCA3ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgOCwgMCwgNywgNyk7XHJcbiAgICAgICAgdGhpcy5pbWFnZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCwgeSArIGggLSA3ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCAwLCA4LCA3LCA3KTtcclxuICAgICAgICB0aGlzLmltYWdlLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4ICsgdyAtIDcgKiB1cHNjYWxlU2l6ZSwgeSArIGggLSA3ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCA4LCA4LCA3LCA3KTtcclxuXHJcbiAgICAgICAgLy8gdG9wIGFuZCBib3R0b21cclxuICAgICAgICB0aGlzLmltYWdlLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4ICsgNyAqIHVwc2NhbGVTaXplLCB5LCB3IC0gMTQgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCA3LCAwLCAxLCA3KTtcclxuICAgICAgICB0aGlzLmltYWdlLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4ICsgNyAqIHVwc2NhbGVTaXplLCB5ICsgaCAtIDcgKiB1cHNjYWxlU2l6ZSwgdyAtIDE0ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgNywgOCwgMSwgNyk7XHJcblxyXG4gICAgICAgIC8vIGxlZnQgYW5kIHJpZ2h0XHJcbiAgICAgICAgdGhpcy5pbWFnZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCwgeSArIDcgKiB1cHNjYWxlU2l6ZSwgNyAqIHVwc2NhbGVTaXplLCBoIC0gMTQgKiB1cHNjYWxlU2l6ZSwgMCwgNywgNywgMSk7XHJcbiAgICAgICAgdGhpcy5pbWFnZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCArIHcgLSA3ICogdXBzY2FsZVNpemUsIHkgKyA3ICogdXBzY2FsZVNpemUsIDcgKiB1cHNjYWxlU2l6ZSwgaCAtIDE0ICogdXBzY2FsZVNpemUsIDgsIDcsIDcsIDEpO1xyXG5cclxuICAgICAgICAvLyBjZW50ZXJcclxuICAgICAgICB0aGlzLmltYWdlLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4ICsgNyAqIHVwc2NhbGVTaXplLCB5ICsgNyAqIHVwc2NhbGVTaXplLCB3IC0gMTQgKiB1cHNjYWxlU2l6ZSwgaCAtIDE0ICogdXBzY2FsZVNpemUsIDcsIDcsIDEsIDEpO1xyXG5cclxuICAgICAgICBpZih0aGlzLmxpc3RlbmluZykge1xyXG4gICAgICAgICAgICB0aGlzLmZvbnQuZHJhd1RleHQodGFyZ2V0LCB0aGlzLnR4dCtcIjogY2xpY2sgdG8gY2FuY2VsXCIsIHggKyA2ICogdXBzY2FsZVNpemUsIE1hdGgucm91bmQoKHRoaXMueSArIHRoaXMuaCAvIDIpIC8gdXBzY2FsZVNpemUpICogdXBzY2FsZVNpemUgLSA2ICogdXBzY2FsZVNpemUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYodGhpcy5rZXlib2FyZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mb250LmRyYXdUZXh0KHRhcmdldCwgdGhpcy50eHQrXCI6ICAgXCIrS2V5cy5rZXlib2FyZE1hcFt0aGlzLnZhbHVlXSwgeCArIDYgKiB1cHNjYWxlU2l6ZSwgTWF0aC5yb3VuZCgodGhpcy55ICsgdGhpcy5oIC8gMikgLyB1cHNjYWxlU2l6ZSkgKiB1cHNjYWxlU2l6ZSAtIDYgKiB1cHNjYWxlU2l6ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZvbnQuZHJhd1RleHQodGFyZ2V0LCB0aGlzLnR4dCtcIjogICBNb3VzZSBcIit0aGlzLnZhbHVlLCB4ICsgNiAqIHVwc2NhbGVTaXplLCBNYXRoLnJvdW5kKCh0aGlzLnkgKyB0aGlzLmggLyAyKSAvIHVwc2NhbGVTaXplKSAqIHVwc2NhbGVTaXplIC0gNiAqIHVwc2NhbGVTaXplKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVNb3VzZU92ZXIobW91c2VYOiBudW1iZXIsIG1vdXNlWTogbnVtYmVyKSB7XHJcbiAgICAgICAgLy8gaWYgdGhlIG1vdXNlIHBvc2l0aW9uIGlzIGluc2lkZSB0aGUgYnV0dG9uLCByZXR1cm4gdHJ1ZVxyXG4gICAgICAgIGlmIChtb3VzZVggPiB0aGlzLnggJiYgbW91c2VYIDwgdGhpcy54ICsgdGhpcy53ICYmIG1vdXNlWSA+IHRoaXMueSAmJiBtb3VzZVkgPCB0aGlzLnkgKyB0aGlzLmgpIHtcclxuICAgICAgICAgICAgdGhpcy5tb3VzZUlzT3ZlciA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLm1vdXNlSXNPdmVyID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9uUHJlc3NlZCgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImlucHV0IGJveCBwcmVzc2VkXCIpO1xyXG4gICAgICAgIHRoaXMubGlzdGVuaW5nID0gIXRoaXMubGlzdGVuaW5nO1xyXG4gICAgICAgIGlmKHRoaXMubGlzdGVuaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2UgPSBVaUFzc2V0cy5idXR0b25fc2VsZWN0ZWQ7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5pbWFnZSA9IFVpQXNzZXRzLmJ1dHRvbl91bnNlbGVjdGVkO1xyXG4gICAgICAgIC8vIEF1ZGlvQXNzZXRzLnVpLmludmVudG9yeUNsYWNrLnBsYXlSYW5kb20oKTtcclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgeyBSZW5kZXJhYmxlIH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9SZW5kZXJhYmxlJztcclxuaW1wb3J0IHA1IGZyb20gJ3A1JztcclxuaW1wb3J0IHsgVWlBc3NldHMgfSBmcm9tICcuLi9hc3NldHMvQXNzZXRzJztcclxuXHJcbmV4cG9ydCBjbGFzcyBVaUZyYW1lIGltcGxlbWVudHMgUmVuZGVyYWJsZSB7XHJcblxyXG4gICAgeDogbnVtYmVyXHJcbiAgICB5OiBudW1iZXJcclxuICAgIHc6IG51bWJlclxyXG4gICAgaDogbnVtYmVyXHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgeDogbnVtYmVyLFxyXG4gICAgICAgIHk6IG51bWJlcixcclxuICAgICAgICB3OiBudW1iZXIsXHJcbiAgICAgICAgaDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy54ID0geFxyXG4gICAgICAgIHRoaXMueSA9IHlcclxuICAgICAgICB0aGlzLncgPSB3XHJcbiAgICAgICAgdGhpcy5oID0gaFxyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcih0YXJnZXQ6IHA1LCB1cHNjYWxlU2l6ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgLy8gc2V0IHRoZSBjb29yZHMgYW5kIGRpbWVuc2lvbnMgdG8gcm91bmQgdG8gdGhlIG5lYXJlc3QgdW4tdXBzY2FsZWQgcGl4ZWxcclxuICAgICAgICBjb25zdCB4ID0gTWF0aC5yb3VuZCh0aGlzLngvdXBzY2FsZVNpemUpKnVwc2NhbGVTaXplO1xyXG4gICAgICAgIGNvbnN0IHkgPSBNYXRoLnJvdW5kKHRoaXMueS91cHNjYWxlU2l6ZSkqdXBzY2FsZVNpemU7XHJcbiAgICAgICAgY29uc3QgdyA9IE1hdGgucm91bmQodGhpcy53L3Vwc2NhbGVTaXplKSp1cHNjYWxlU2l6ZTtcclxuICAgICAgICBjb25zdCBoID0gTWF0aC5yb3VuZCh0aGlzLmgvdXBzY2FsZVNpemUpKnVwc2NhbGVTaXplO1xyXG5cclxuICAgICAgICAvLyBjb3JuZXJzXHJcbiAgICAgICAgVWlBc3NldHMudWlfZnJhbWUucmVuZGVyUGFydGlhbCh0YXJnZXQsIHgsIHksIDcqdXBzY2FsZVNpemUsIDcqdXBzY2FsZVNpemUsIDAsIDAsIDcsIDcpO1xyXG4gICAgICAgIFVpQXNzZXRzLnVpX2ZyYW1lLnJlbmRlclBhcnRpYWwodGFyZ2V0LCB4K3ctNyp1cHNjYWxlU2l6ZSwgeSwgNyp1cHNjYWxlU2l6ZSwgNyp1cHNjYWxlU2l6ZSwgOCwgMCwgNywgNyk7XHJcbiAgICAgICAgVWlBc3NldHMudWlfZnJhbWUucmVuZGVyUGFydGlhbCh0YXJnZXQsIHgsIHkraC03KnVwc2NhbGVTaXplLCA3KnVwc2NhbGVTaXplLCA3KnVwc2NhbGVTaXplLCAwLCA4LCA3LCA3KTtcclxuICAgICAgICBVaUFzc2V0cy51aV9mcmFtZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCt3LTcqdXBzY2FsZVNpemUsIHkraC03KnVwc2NhbGVTaXplLCA3KnVwc2NhbGVTaXplLCA3KnVwc2NhbGVTaXplLCA4LCA4LCA3LCA3KTtcclxuXHJcbiAgICAgICAgLy8gdG9wIGFuZCBib3R0b21cclxuICAgICAgICBVaUFzc2V0cy51aV9mcmFtZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCs3KnVwc2NhbGVTaXplLCB5LCB3LTE0KnVwc2NhbGVTaXplLCA3KnVwc2NhbGVTaXplLCA3LCAwLCAxLCA3KTtcclxuICAgICAgICBVaUFzc2V0cy51aV9mcmFtZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCs3KnVwc2NhbGVTaXplLCB5K2gtNyp1cHNjYWxlU2l6ZSwgdy0xNCp1cHNjYWxlU2l6ZSwgNyp1cHNjYWxlU2l6ZSwgNywgOCwgMSwgNyk7XHJcblxyXG4gICAgICAgIC8vIGxlZnQgYW5kIHJpZ2h0XHJcbiAgICAgICAgVWlBc3NldHMudWlfZnJhbWUucmVuZGVyUGFydGlhbCh0YXJnZXQsIHgsIHkrNyp1cHNjYWxlU2l6ZSwgNyp1cHNjYWxlU2l6ZSwgaC0xNCp1cHNjYWxlU2l6ZSwgMCwgNywgNywgMSk7XHJcbiAgICAgICAgVWlBc3NldHMudWlfZnJhbWUucmVuZGVyUGFydGlhbCh0YXJnZXQsIHgrdy03KnVwc2NhbGVTaXplLCB5KzcqdXBzY2FsZVNpemUsIDcqdXBzY2FsZVNpemUsIGgtMTQqdXBzY2FsZVNpemUsIDgsIDcsIDcsIDEpO1xyXG5cclxuICAgICAgICAvLyBjZW50ZXJcclxuICAgICAgICBVaUFzc2V0cy51aV9mcmFtZS5yZW5kZXJQYXJ0aWFsKHRhcmdldCwgeCs3KnVwc2NhbGVTaXplLCB5KzcqdXBzY2FsZVNpemUsIHctMTQqdXBzY2FsZVNpemUsIGgtMTQqdXBzY2FsZVNpemUsIDcsIDcsIDEsIDEpO1xyXG5cclxuICAgIH1cclxufSIsImltcG9ydCB7IFJlbmRlcmFibGUgfSBmcm9tICcuLi9pbnRlcmZhY2VzL1JlbmRlcmFibGUnO1xyXG5pbXBvcnQgcDUgZnJvbSAncDUnO1xyXG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tICcuL0J1dHRvbic7XHJcbmltcG9ydCB7IFNsaWRlciB9IGZyb20gJy4vU2xpZGVyJztcclxuaW1wb3J0IHsgVWlGcmFtZSB9IGZyb20gJy4vVWlGcmFtZSc7XHJcbmltcG9ydCB7IGdhbWUgfSBmcm9tICcuLi9HYW1lJztcclxuaW1wb3J0IHsgSW5wdXRCb3ggfSBmcm9tICcuL0lucHV0Qm94JztcclxuaW1wb3J0IHsgVWlBc3NldHMgfSBmcm9tICcuLi9hc3NldHMvQXNzZXRzJztcclxuaW1wb3J0IHsgRm9udFJlc291cmNlIH0gZnJvbSAnLi4vYXNzZXRzL3Jlc291cmNlcy9Gb250UmVzb3VyY2UnO1xyXG5cclxuXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBVaVNjcmVlbiBpbXBsZW1lbnRzIFJlbmRlcmFibGUge1xyXG5cclxuICAgIGJ1dHRvbnM6IEJ1dHRvbltdO1xyXG4gICAgc2xpZGVyczogU2xpZGVyW107XHJcbiAgICBpbnB1dEJveGVzOiBJbnB1dEJveFtdO1xyXG4gICAgc2Nyb2xsPzogbnVtYmVyO1xyXG4gICAgbWluU2Nyb2xsOiBudW1iZXIgPSAwO1xyXG4gICAgbWF4U2Nyb2xsOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIGZyYW1lOiBVaUZyYW1lXHJcblxyXG5cclxuICAgIHRpdGxlRm9udDogRm9udFJlc291cmNlXHJcblxyXG4gICAgYWJzdHJhY3QgcmVuZGVyKHRhcmdldDogcDUsIHVwc2NhbGVTaXplOiBudW1iZXIpOiB2b2lkO1xyXG5cclxuICAgIGFic3RyYWN0IHdpbmRvd1VwZGF0ZSgpOiB2b2lkXHJcblxyXG4gICAgbW91c2VQcmVzc2VkKGJ0bjogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYodGhpcy5idXR0b25zICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgLy8gbG9vcCB0aHJvdWdoIGFsbCB0aGUgYnV0dG9ucyBpbiB0aGlzIG1lbnUgYW5kIGlmIHRoZSBtb3VzZSBpcyBvdmVyIHRoZW0sIHRoZW4gY2FsbCB0aGUgYnV0dG9uJ3Mgb25QcmVzc2VkKCkgZnVuY3Rpb24uICBUaGUgb25QcmVzc2VkKCkgZnVuY3Rpb24gaXMgcGFzc2VkIGluIHRocm91Z2ggdGhlIGNvbnN0cnVjdG9yLlxyXG4gICAgICAgICAgICBmb3IoY29uc3QgaSBvZiB0aGlzLmJ1dHRvbnMpIHtcclxuICAgICAgICAgICAgICAgIGlmKGkubW91c2VJc092ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBpLm9uUHJlc3NlZCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLnNsaWRlcnMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAvLyBsb29wIHRocm91Z2ggYWxsIHRoZSBzbGlkZXJzIGFuZCBpbnRlcmFjdCB3aXRoIHRoZW0gYWNjb3JkaW5nbHlcclxuICAgICAgICAgICAgZm9yKGNvbnN0IGkgb2YgdGhpcy5zbGlkZXJzKSB7XHJcbiAgICAgICAgICAgICAgICBpLnVwZGF0ZVNsaWRlclBvc2l0aW9uKGdhbWUubW91c2VYKTtcclxuICAgICAgICAgICAgICAgIGlmKGdhbWUubW91c2VYPmkueCAmJiBnYW1lLm1vdXNlWDxpLngraS53ICYmIGdhbWUubW91c2VZPmkueSAmJiBnYW1lLm1vdXNlWTxpLnkraS5oKVxyXG4gICAgICAgICAgICAgICAgICAgIGkuYmVpbmdFZGl0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMuaW5wdXRCb3hlcyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2codGhpcy5pbnB1dEJveGVzKTtcclxuICAgICAgICAgICAgLy8gbG9vcCB0aHJvdWdoIGFsbCB0aGUgaW5wdXQgYm94ZXMgYW5kIGludGVyYWN0IHdpdGggdGhlbSBhY2NvcmRpbmdseVxyXG4gICAgICAgICAgICBmb3IoY29uc3QgaSBvZiB0aGlzLmlucHV0Qm94ZXMpIHtcclxuICAgICAgICAgICAgICAgIGlmKGkubW91c2VJc092ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBpLm9uUHJlc3NlZCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZihpLmxpc3RlbmluZykge1xyXG4gICAgICAgICAgICAgICAgICAgIGkubGlzdGVuaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS5jb250cm9sc1tpLmluZGV4XS5rZXlDb2RlID0gYnRuO1xyXG4gICAgICAgICAgICAgICAgICAgIGdhbWUuY29udHJvbHNbaS5pbmRleF0ua2V5Ym9hcmQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBpLnZhbHVlID0gYnRuO1xyXG4gICAgICAgICAgICAgICAgICAgIGkua2V5Ym9hcmQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBpLmltYWdlID0gVWlBc3NldHMuYnV0dG9uX3Vuc2VsZWN0ZWQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbW91c2VSZWxlYXNlZCgpIHtcclxuICAgICAgICBpZih0aGlzLnNsaWRlcnMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAvLyBsb29wIHRocm91Z2ggYWxsIHRoZSBzbGlkZXJzIGFuZCBpbnRlcmFjdCB3aXRoIHRoZW0gYWNjb3JkaW5nbHlcclxuICAgICAgICAgICAgZm9yKGNvbnN0IGkgb2YgdGhpcy5zbGlkZXJzKSB7XHJcbiAgICAgICAgICAgICAgICBpLmJlaW5nRWRpdGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IHsgVWlTY3JlZW4gfSBmcm9tICcuLi9VaVNjcmVlbic7XHJcbmltcG9ydCBwNSBmcm9tICdwNSc7XHJcbmltcG9ydCB7IFVpRnJhbWUgfSBmcm9tICcuLi9VaUZyYW1lJztcclxuaW1wb3J0IHsgZ2FtZSB9IGZyb20gJy4uLy4uL0dhbWUnO1xyXG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tICcuLi9CdXR0b24nO1xyXG5pbXBvcnQgeyBGb250UmVzb3VyY2UgfSBmcm9tICcuLi8uLi9hc3NldHMvcmVzb3VyY2VzL0ZvbnRSZXNvdXJjZSc7XHJcbmltcG9ydCB7IE9wdGlvbnNNZW51IH0gZnJvbSAnLi9PcHRpb25zTWVudSc7XHJcbmltcG9ydCB7IElucHV0Qm94IH0gZnJvbSAnLi4vSW5wdXRCb3gnO1xyXG5pbXBvcnQgeyBDb250cm9sIH0gZnJvbSAnLi4vLi4vaW5wdXQvQ29udHJvbCdcclxuXHJcbmV4cG9ydCBjbGFzcyBDb250cm9sc01lbnUgZXh0ZW5kcyBVaVNjcmVlbiB7XHJcblxyXG5cdGNvbnN0cnVjdG9yKGZvbnQ6IEZvbnRSZXNvdXJjZSwgdGl0bGVGb250OiBGb250UmVzb3VyY2UsIHByZXZpb3VzTWVudTogc3RyaW5nKSB7XHJcblx0XHRzdXBlcigpO1xyXG5cdFx0Ly8gbWFrZSB0aGUgZnJhbWUgd2l0aCBzb21lIGRlZmF1bHQgdmFsdWVzLiAgVGhlc2Ugd2lsbCBsYXRlciBiZSBjaGFuZ2VkIHRvIGZpdCB0aGUgc2NyZWVuIHNpemUuXHJcblx0XHR0aGlzLmZyYW1lID0gbmV3IFVpRnJhbWUoMCwgMCwgMCwgMCk7XHJcblxyXG5cdFx0Ly8gbWFrZSBzb21lIGJ1dHRvbnMgd2l0aCBkZWZhdWx0IHBvc2l0aW9uc1xyXG5cdFx0dGhpcy5idXR0b25zID0gW1xyXG5cdFx0XHRuZXcgQnV0dG9uKGZvbnQsIFwiQmFja1wiLCBcIlJldHVybiB0byB0aGUgb3B0aW9ucyBtZW51LlwiLCAwLCAwLCAwLCAwLCAoKSA9PiB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJvcHRpb25zIG1lbnVcIik7XHJcblx0XHRcdFx0Z2FtZS5jdXJyZW50VWkgPSBuZXcgT3B0aW9uc01lbnUoZm9udCwgdGl0bGVGb250LCBwcmV2aW91c01lbnUpO1xyXG5cdFx0XHR9KVxyXG5cdFx0XTtcclxuXHJcblx0XHR0aGlzLmlucHV0Qm94ZXMgPSBbXHJcblx0XHRcdC8vIG5ldyBJbnB1dEJveChmb250LCBcIldhbGsgUmlnaHRcIiwgdHJ1ZSwgNjgsIDAsIDAsIDAsIDAsIDApLFxyXG5cdFx0XHQvLyBuZXcgSW5wdXRCb3goZm9udCwgXCJXYWxrIExlZnRcIiwgdHJ1ZSwgNjUsIDEsIDAsIDAsIDAsIDApLFxyXG5cdFx0XHQvLyBuZXcgSW5wdXRCb3goZm9udCwgXCJKdW1wXCIsIHRydWUsIDMyLCAyLCAwLCAwLCAwLCAwKSxcclxuXHRcdFx0Ly8gbmV3IElucHV0Qm94KGZvbnQsIFwiUGF1c2VcIiwgdHJ1ZSwgMjcsIDMsIDAsIDAsIDAsIDApXHJcblx0XHRdXHJcblxyXG5cdFx0bGV0IGkgPSAwO1xyXG5cdFx0Zm9yIChsZXQgY29udHJvbCBvZiBnYW1lLmNvbnRyb2xzKSB7XHJcblx0XHRcdGkrKztcclxuXHRcdFx0dGhpcy5pbnB1dEJveGVzLnB1c2gobmV3IElucHV0Qm94KGZvbnQsIGNvbnRyb2wuZGVzY3JpcHRpb24sIGNvbnRyb2wua2V5Ym9hcmQsIGNvbnRyb2wua2V5Q29kZSwgaSwgMCwgMCwgMCwgMCkpO1xyXG5cdFx0fVxyXG5cdFx0Ly8gdXBkYXRlIHRoZSBzaXplIG9mIHRoZSBlbGVtZW50cyBiYXNlZCBvbiB0aGUgaW5pdGlhbCBzY3JlZW4gc2l6ZVxyXG5cdFx0dGhpcy53aW5kb3dVcGRhdGUoKTtcclxuXHR9XHJcblxyXG5cdHJlbmRlcih0YXJnZXQ6IHA1LCB1cHNjYWxlU2l6ZTogbnVtYmVyKTogdm9pZCB7XHJcblxyXG5cdFx0Ly8gcmVuZGVyIHRoZSByZWN0YW5ndWxhciBpbWFnZVxyXG5cdFx0dGhpcy5mcmFtZS5yZW5kZXIodGFyZ2V0LCB1cHNjYWxlU2l6ZSk7XHJcblxyXG5cdFx0Ly8gbG9vcCB0aHJvdWdoIHRoZSBidXR0b25zIGFycmF5IGFuZCByZW5kZXIgZWFjaCBvbmUuXHJcblx0XHR0aGlzLmJ1dHRvbnMuZm9yRWFjaChidXR0b24gPT4ge1xyXG5cdFx0XHRidXR0b24ucmVuZGVyKHRhcmdldCwgdXBzY2FsZVNpemUpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0Ly8gbG9vcCB0aHJvdWdoIHRoZSBpbnB1dEJveGVzIGFycmF5IGFuZCByZW5kZXIgZWFjaCBvbmUuXHJcblx0XHR0aGlzLmlucHV0Qm94ZXMuZm9yRWFjaChpbnB1dEJveCA9PiB7XHJcblx0XHRcdGlucHV0Qm94LnJlbmRlcih0YXJnZXQsIHVwc2NhbGVTaXplKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0d2luZG93VXBkYXRlKCkge1xyXG5cdFx0Ly8gc2V0IHRoZSBwb3NpdGlvbiBvZiB0aGUgZnJhbWVcclxuXHRcdHRoaXMuZnJhbWUueCA9IGdhbWUud2lkdGggLyAyIC0gMjAwIC8gMiAqIGdhbWUudXBzY2FsZVNpemU7Ly8gY2VudGVyIHRoZSBmcmFtZSBpbiB0aGUgY2VudGVyIG9mIHRoZSBzY3JlZW5cclxuXHRcdHRoaXMuZnJhbWUueSA9IGdhbWUuaGVpZ2h0IC8gMiAtIDU2ICogZ2FtZS51cHNjYWxlU2l6ZTtcclxuXHRcdHRoaXMuZnJhbWUudyA9IDIwMCAqIGdhbWUudXBzY2FsZVNpemU7XHJcblx0XHR0aGlzLmZyYW1lLmggPSA0OCAqIGdhbWUudXBzY2FsZVNpemU7XHJcblx0fVxyXG59IiwiaW1wb3J0IHsgVWlTY3JlZW4gfSBmcm9tICcuLi9VaVNjcmVlbic7XHJcbmltcG9ydCBwNSBmcm9tICdwNSc7XHJcbmltcG9ydCB7IFVpRnJhbWUgfSBmcm9tICcuLi9VaUZyYW1lJztcclxuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSAnLi4vQnV0dG9uJztcclxuaW1wb3J0IHsgT3B0aW9uc01lbnUgfSBmcm9tICcuL09wdGlvbnNNZW51JztcclxuaW1wb3J0IHsgRm9udFJlc291cmNlIH0gZnJvbSAnLi4vLi4vYXNzZXRzL3Jlc291cmNlcy9Gb250UmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBVaUFzc2V0cyB9IGZyb20gJy4uLy4uL2Fzc2V0cy9Bc3NldHMnO1xyXG5pbXBvcnQgeyBXb3JsZENyZWF0aW9uTWVudSB9IGZyb20gJy4vV29ybGRDcmVhdGlvbk1lbnUnO1xyXG5pbXBvcnQgeyBnYW1lIH0gZnJvbSAnLi4vLi4vR2FtZSc7XHJcblxyXG5leHBvcnQgY2xhc3MgTWFpbk1lbnUgZXh0ZW5kcyBVaVNjcmVlbiB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZm9udDogRm9udFJlc291cmNlLCB0aXRsZUZvbnQ6IEZvbnRSZXNvdXJjZSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIC8vIG1ha2UgdGhlIGZyYW1lIHdpdGggc29tZSBkZWZhdWx0IHZhbHVlcy4gIFRoZXNlIHdpbGwgbGF0ZXIgYmUgY2hhbmdlZCB0byBmaXQgdGhlIHNjcmVlbiBzaXplLlxyXG4gICAgICAgIHRoaXMuZnJhbWUgPSBuZXcgVWlGcmFtZSgwLCAwLCAwLCAwKTtcclxuXHJcbiAgICAgICAgLy8gbWFrZSA0IGJ1dHRvbnMgd2l0aCBkZWZhdWx0IHBvc2l0aW9uc1xyXG4gICAgICAgIHRoaXMuYnV0dG9ucyA9IFtcclxuICAgICAgICAgICAgbmV3IEJ1dHRvbihmb250LCBcIkpvaW4gR2FtZVwiLCBcIkpvaW4gYSBnYW1lIHdpdGggeW91ciBmcmllbmRzLCBvciBtYWtlIG5ldyBvbmVzLlwiLCAwLCAwLCAwLCAwLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImpvaW4gZ2FtZVwiKTtcclxuICAgICAgICAgICAgICAgIGlmKGdhbWUud29ybGQ9PXVuZGVmaW5lZClyZXR1cm47Ly9pZiB0aGVyZSdzIG5vIHdvcmxkLCB0aGVyZSdzIG5vIHBvaW50LlxyXG4gICAgICAgICAgICAgICAgZ2FtZS5jdXJyZW50VWkgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBuZXcgQnV0dG9uKGZvbnQsIFwiT3B0aW9uc1wiLCBcIkNoYW5nZSB5b3VyIGtleWJpbmRzLCByZWR1Y2UgbGFnLCBldGMuXCIsIDAsIDAsIDAsIDAsICgpID0+e1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJvcHRpb25zXCIpO1xyXG4gICAgICAgICAgICAgICAgZ2FtZS5jdXJyZW50VWkgPSBuZXcgT3B0aW9uc01lbnUoZm9udCwgdGl0bGVGb250LCBcIm1haW4gbWVudVwiKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICBdO1xyXG5cclxuICAgICAgICAvLyB1cGRhdGUgdGhlIHNpemUgb2YgdGhlIGVsZW1lbnRzIGJhc2VkIG9uIHRoZSBpbml0aWFsIHNjcmVlbiBzaXplXHJcbiAgICAgICAgdGhpcy53aW5kb3dVcGRhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIodGFyZ2V0OiBwNSwgdXBzY2FsZVNpemU6IG51bWJlcik6IHZvaWQge1xyXG5cclxuICAgICAgICAvLyByZW5kZXIgdGhlIHJlY3Rhbmd1bGFyIGltYWdlIHRoYXQgdGhlIHdob2xlIG1lbnUgaXMgb25cclxuICAgICAgICB0aGlzLmZyYW1lLnJlbmRlcih0YXJnZXQsIHVwc2NhbGVTaXplKTtcclxuXHJcbiAgICAgICAgVWlBc3NldHMudGl0bGVfaW1hZ2UucmVuZGVyKHRhcmdldCwgTWF0aC5yb3VuZCh0aGlzLmZyYW1lLngvdXBzY2FsZVNpemUrMSkqdXBzY2FsZVNpemUsIE1hdGgucm91bmQodGhpcy5mcmFtZS55L3Vwc2NhbGVTaXplKzQpKnVwc2NhbGVTaXplLCAyNTYqdXBzY2FsZVNpemUsIDQwKnVwc2NhbGVTaXplKTtcclxuXHJcbiAgICAgICAgLy8gbG9vcCB0aHJvdWdoIHRoZSBidXR0b25zIGFycmF5IGFuZCByZW5kZXIgZWFjaCBvbmUuXHJcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIHRoaXMuYnV0dG9ucykge1xyXG4gICAgICAgICAgICBpdGVtLnJlbmRlcih0YXJnZXQsIHVwc2NhbGVTaXplKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHdpbmRvd1VwZGF0ZSgpIHtcclxuICAgICAgICAvLyBzZXQgdGhlIHBvc2l0aW9uIG9mIHRoZSBmcmFtZVxyXG4gICAgICAgIHRoaXMuZnJhbWUueCA9IGdhbWUud2lkdGgvMi0yNjQvMipnYW1lLnVwc2NhbGVTaXplOy8vIGNlbnRlciB0aGUgZnJhbWUgaW4gdGhlIG1pZGRsZSBvZiB0aGUgc2NyZWVuXHJcbiAgICAgICAgdGhpcy5mcmFtZS55ID0gZ2FtZS5oZWlnaHQvMi01NipnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgIHRoaXMuZnJhbWUudyA9IDI2NCpnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgIHRoaXMuZnJhbWUuaCA9IDQ4KmdhbWUudXBzY2FsZVNpemU7XHJcblxyXG4gICAgICAgIC8vIHNldCB0aGUgcG9zaXRpb25zIG9mIGFsbCB0aGUgYnV0dG9uc1xyXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGk8dGhpcy5idXR0b25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS54ID0gZ2FtZS53aWR0aC8yLTE5Mi8yKmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS55ID0gZ2FtZS5oZWlnaHQvMisyMCppKmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS53ID0gMTkyKmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS5oID0gMTYqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLnVwZGF0ZU1vdXNlT3ZlcihnYW1lLm1vdXNlWCwgZ2FtZS5tb3VzZVkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IHsgVWlTY3JlZW4gfSBmcm9tICcuLi9VaVNjcmVlbic7XHJcbmltcG9ydCBwNSBmcm9tICdwNSc7XHJcbmltcG9ydCB7IFVpRnJhbWUgfSBmcm9tICcuLi9VaUZyYW1lJztcclxuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSAnLi4vQnV0dG9uJztcclxuaW1wb3J0IHsgRm9udFJlc291cmNlIH0gZnJvbSAnLi4vLi4vYXNzZXRzL3Jlc291cmNlcy9Gb250UmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBNYWluTWVudSB9IGZyb20gJy4vTWFpbk1lbnUnO1xyXG5pbXBvcnQgeyBWaWRlb1NldHRpbmdzTWVudSB9IGZyb20gJy4vVmlkZW9TZXR0aW5nc01lbnUnO1xyXG5pbXBvcnQgeyBDb250cm9sc01lbnUgfSBmcm9tICcuL0NvbnRyb2xzTWVudSc7XHJcbmltcG9ydCB7IGdhbWUgfSBmcm9tICcuLi8uLi9HYW1lJztcclxuaW1wb3J0IHsgUGF1c2VNZW51IH0gZnJvbSAnLi9QYXVzZU1lbnUnO1xyXG5cclxuZXhwb3J0IGNsYXNzIE9wdGlvbnNNZW51IGV4dGVuZHMgVWlTY3JlZW4ge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGZvbnQ6IEZvbnRSZXNvdXJjZSwgdGl0bGVGb250OiBGb250UmVzb3VyY2UsIHByZXZpb3VzTWVudTogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICAvLyBtYWtlIHRoZSBmcmFtZSB3aXRoIHNvbWUgZGVmYXVsdCB2YWx1ZXMuICBUaGVzZSB3aWxsIGxhdGVyIGJlIGNoYW5nZWQgdG8gZml0IHRoZSBzY3JlZW4gc2l6ZS5cclxuICAgICAgICB0aGlzLmZyYW1lID0gbmV3IFVpRnJhbWUoMCwgMCwgMCwgMCk7XHJcbiAgICAgICAgdGhpcy50aXRsZUZvbnQgPSB0aXRsZUZvbnQ7XHJcbiAgICAgICAgLy8gbWFrZSBzb21lIGJ1dHRvbnMgd2l0aCBkZWZhdWx0IHBvc2l0aW9uc1xyXG4gICAgICAgIHRoaXMuYnV0dG9ucyA9IFtcclxuICAgICAgICAgICAgbmV3IEJ1dHRvbihmb250LCBcIlZpZGVvIFNldHRpbmdzXCIsIFwiQ2hhbmdlIHRoZSBiYWxhbmNlIGJldHdlZW4gcGVyZm9ybWFuY2UgYW5kIGZpZGVsaXR5LlwiLCAwLCAwLCAwLCAwLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInZpZGVvIHNldHRpbmdzXCIpO1xyXG4gICAgICAgICAgICAgICAgZ2FtZS5jdXJyZW50VWkgPSBuZXcgVmlkZW9TZXR0aW5nc01lbnUoZm9udCwgdGl0bGVGb250LCBwcmV2aW91c01lbnUpO1xyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgbmV3IEJ1dHRvbihmb250LCBcIkNvbnRyb2xzXCIsIFwiQ2hhbmdlIHlvdXIga2V5YmluZHMuXCIsIDAsIDAsIDAsIDAsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY29udHJvbCBtZW51XCIpO1xyXG4gICAgICAgICAgICAgICAgZ2FtZS5jdXJyZW50VWkgPSBuZXcgQ29udHJvbHNNZW51KGZvbnQsIHRpdGxlRm9udCwgcHJldmlvdXNNZW51KTtcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIC8vIG5ldyBCdXR0b24oZm9udCwgXCJBdWRpbyBTZXR0aW5nc1wiLCBcIkNoYW5nZSB0aGUgdm9sdW1lIG9mIGRpZmZlcmVudCBzb3VuZHMuXCIsIDAsIDAsIDAsIDAsICgpID0+IHtcclxuICAgICAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKFwiYXVkaW8gbWVudVwiKTtcclxuICAgICAgICAgICAgLy8gICAgIGdhbWUuY3VycmVudFVpID0gbmV3IEF1ZGlvU2V0dGluZ3NNZW51KGZvbnQsIHRpdGxlRm9udCk7XHJcbiAgICAgICAgICAgIC8vIH0pLFxyXG4gICAgICAgICAgICBuZXcgQnV0dG9uKGZvbnQsIFwiQmFja1wiLCBcIlJldHVybiB0byB0aGUgXCIrcHJldmlvdXNNZW51K1wiLlwiLCAwLCAwLCAwLCAwLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZihwcmV2aW91c01lbnU9PT1cIm1haW4gbWVudVwiKWdhbWUuY3VycmVudFVpID0gbmV3IE1haW5NZW51KGZvbnQsIHRpdGxlRm9udCk7XHJcbiAgICAgICAgICAgICAgICBlbHNlIGdhbWUuY3VycmVudFVpID0gbmV3IFBhdXNlTWVudShmb250LCB0aXRsZUZvbnQpXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgXTtcclxuICAgICAgICAvLyB1cGRhdGUgdGhlIHNpemUgb2YgdGhlIGVsZW1lbnRzIGJhc2VkIG9uIHRoZSBpbml0aWFsIHNjcmVlbiBzaXplXHJcbiAgICAgICAgdGhpcy53aW5kb3dVcGRhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIodGFyZ2V0OiBwNSwgdXBzY2FsZVNpemU6IG51bWJlcik6IHZvaWQge1xyXG5cclxuICAgICAgICAvLyByZW5kZXIgdGhlIHJlY3Rhbmd1bGFyIGltYWdlIHRoYXQgdGhlIHdob2xlIG1lbnUgaXMgb25cclxuICAgICAgICB0aGlzLmZyYW1lLnJlbmRlcih0YXJnZXQsIHVwc2NhbGVTaXplKTtcclxuXHJcbiAgICAgICAgLy8gbG9vcCB0aHJvdWdoIHRoZSBidXR0b25zIGFycmF5IGFuZCByZW5kZXIgZWFjaCBvbmUuXHJcbiAgICAgICAgdGhpcy5idXR0b25zLmZvckVhY2goYnV0dG9uID0+IHtcclxuICAgICAgICAgICAgYnV0dG9uLnJlbmRlcih0YXJnZXQsIHVwc2NhbGVTaXplKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy50aXRsZUZvbnQuZHJhd1RleHQodGFyZ2V0LCBcIk9wdGlvbnNcIiwgdGhpcy5mcmFtZS54ICsgNTQqZ2FtZS51cHNjYWxlU2l6ZSwgdGhpcy5mcmFtZS55ICsgMTYqZ2FtZS51cHNjYWxlU2l6ZSlcclxuICAgIH1cclxuXHJcbiAgICB3aW5kb3dVcGRhdGUoKSB7XHJcbiAgICAgICAgLy8gc2V0IHRoZSBwb3NpdGlvbiBvZiB0aGUgZnJhbWVcclxuICAgICAgICB0aGlzLmZyYW1lLnggPSBnYW1lLndpZHRoLzItMjAwLzIqZ2FtZS51cHNjYWxlU2l6ZTsvLyBjZW50ZXIgdGhlIGZyYW1lIGluIHRoZSBjZW50ZXIgb2YgdGhlIHNjcmVlblxyXG4gICAgICAgIHRoaXMuZnJhbWUueSA9IGdhbWUuaGVpZ2h0LzItNTYqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICB0aGlzLmZyYW1lLncgPSAyMDAqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICB0aGlzLmZyYW1lLmggPSA0OCpnYW1lLnVwc2NhbGVTaXplO1xyXG5cclxuICAgICAgICAvLyBzZXQgdGhlIHBvc2l0aW9ucyBvZiBhbGwgdGhlIGJ1dHRvbnNcclxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpPHRoaXMuYnV0dG9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0ueCA9IGdhbWUud2lkdGgvMi0xOTIvMipnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0ueSA9IGdhbWUuaGVpZ2h0LzIrMjAqaSpnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0udyA9IDE5MipnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0uaCA9IDE2KmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc1tpXS51cGRhdGVNb3VzZU92ZXIoZ2FtZS5tb3VzZVgsIGdhbWUubW91c2VZKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IHsgVWlTY3JlZW4gfSBmcm9tICcuLi9VaVNjcmVlbic7XHJcbmltcG9ydCBwNSBmcm9tICdwNSc7XHJcbmltcG9ydCB7IFVpRnJhbWUgfSBmcm9tICcuLi9VaUZyYW1lJztcclxuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSAnLi4vQnV0dG9uJztcclxuaW1wb3J0IHsgT3B0aW9uc01lbnUgfSBmcm9tICcuL09wdGlvbnNNZW51JztcclxuaW1wb3J0IHsgRm9udFJlc291cmNlIH0gZnJvbSAnLi4vLi4vYXNzZXRzL3Jlc291cmNlcy9Gb250UmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBNYWluTWVudSB9IGZyb20gJy4vTWFpbk1lbnUnO1xyXG5pbXBvcnQgeyBnYW1lIH0gZnJvbSAnLi4vLi4vR2FtZSc7XHJcblxyXG5leHBvcnQgY2xhc3MgUGF1c2VNZW51IGV4dGVuZHMgVWlTY3JlZW4ge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGZvbnQ6IEZvbnRSZXNvdXJjZSwgdGl0bGVGb250OiBGb250UmVzb3VyY2UpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICAvLyBtYWtlIHRoZSBmcmFtZSB3aXRoIHNvbWUgZGVmYXVsdCB2YWx1ZXMuICBUaGVzZSB3aWxsIGxhdGVyIGJlIGNoYW5nZWQgdG8gZml0IHRoZSBzY3JlZW4gc2l6ZS5cclxuICAgICAgICB0aGlzLmZyYW1lID0gbmV3IFVpRnJhbWUoMCwgMCwgMCwgMCk7XHJcblxyXG4gICAgICAgIHRoaXMudGl0bGVGb250ID0gdGl0bGVGb250O1xyXG5cclxuICAgICAgICAvLyBtYWtlIDQgYnV0dG9ucyB3aXRoIGRlZmF1bHQgcG9zaXRTaW9uc1xyXG4gICAgICAgIHRoaXMuYnV0dG9ucyA9IFtcclxuICAgICAgICAgICAgbmV3IEJ1dHRvbihmb250LCBcIlJlc3VtZSBnYW1lXCIsIFwiR28gYmFjayB0byB0aGUgZ2FtZS5cIiwgMCwgMCwgMCwgMCwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZ2FtZS5jdXJyZW50VWkgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBuZXcgQnV0dG9uKGZvbnQsIFwiT3B0aW9uc1wiLCBcIkNoYW5nZSB5b3VyIGtleWJpbmRzLCByZWR1Y2UgbGFnLCBldGMuXCIsIDAsIDAsIDAsIDAsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGdhbWUuY3VycmVudFVpID0gbmV3IE9wdGlvbnNNZW51KGZvbnQsIHRpdGxlRm9udCwgXCJwYXVzZSBtZW51XCIpO1xyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgbmV3IEJ1dHRvbihmb250LCBcIkxlYXZlIGdhbWVcIiwgXCJHbyBiYWNrIHRvIE1haW4gTWVudVwiLCAwLCAwLCAwLCAwLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBnYW1lLmN1cnJlbnRVaSA9IG5ldyBNYWluTWVudShmb250LCB0aXRsZUZvbnQpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIF07XHJcblxyXG4gICAgICAgIC8vIHVwZGF0ZSB0aGUgc2l6ZSBvZiB0aGUgZWxlbWVudHMgYmFzZWQgb24gdGhlIGluaXRpYWwgc2NyZWVuIHNpemVcclxuICAgICAgICB0aGlzLndpbmRvd1VwZGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICByZW5kZXIodGFyZ2V0OiBwNSwgdXBzY2FsZVNpemU6IG51bWJlcik6IHZvaWQge1xyXG5cclxuICAgICAgICAvLyByZW5kZXIgdGhlIHJlY3Rhbmd1bGFyIGltYWdlIHRoYXQgdGhlIHdob2xlIG1lbnUgaXMgb25cclxuICAgICAgICB0aGlzLmZyYW1lLnJlbmRlcih0YXJnZXQsIHVwc2NhbGVTaXplKTtcclxuXHJcbiAgICAgICAgLy8gbG9vcCB0aHJvdWdoIHRoZSBidXR0b25zIGFycmF5IGFuZCByZW5kZXIgZWFjaCBvbmUuXHJcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIHRoaXMuYnV0dG9ucykge1xyXG4gICAgICAgICAgICBpdGVtLnJlbmRlcih0YXJnZXQsIHVwc2NhbGVTaXplKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudGl0bGVGb250LmRyYXdUZXh0KHRhcmdldCwgXCJQYXVzZWRcIiwgdGhpcy5mcmFtZS54ICsgNTQqZ2FtZS51cHNjYWxlU2l6ZSwgdGhpcy5mcmFtZS55ICsgMTYqZ2FtZS51cHNjYWxlU2l6ZSlcclxuXHJcbiAgICB9XHJcblxyXG4gICAgd2luZG93VXBkYXRlKCkge1xyXG4gICAgICAgIC8vIHNldCB0aGUgcG9zaXRpb24gb2YgdGhlIGZyYW1lXHJcbiAgICAgICAgdGhpcy5mcmFtZS54ID0gZ2FtZS53aWR0aC8yLTIwMC8yKmdhbWUudXBzY2FsZVNpemU7Ly8gY2VudGVyIHRoZSBmcmFtZSBpbiB0aGUgbWlkZGxlIG9mIHRoZSBzY3JlZW5cclxuICAgICAgICB0aGlzLmZyYW1lLnkgPSBnYW1lLmhlaWdodC8yLTcyKmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgdGhpcy5mcmFtZS53ID0gMjAwKmdhbWUudXBzY2FsZVNpemU7XHJcbiAgICAgICAgdGhpcy5mcmFtZS5oID0gNTQqZ2FtZS51cHNjYWxlU2l6ZTtcclxuXHJcbiAgICAgICAgLy8gc2V0IHRoZSBwb3NpdGlvbnMgb2YgYWxsIHRoZSBidXR0b25zXHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaTx0aGlzLmJ1dHRvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLnggPSBnYW1lLndpZHRoLzItMTkyLzIqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLnkgPSBnYW1lLmhlaWdodC8yKzIwKmkqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLncgPSAxOTIqZ2FtZS51cHNjYWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zW2ldLmggPSAxNipnYW1lLnVwc2NhbGVTaXplO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNbaV0udXBkYXRlTW91c2VPdmVyKGdhbWUubW91c2VYLCBnYW1lLm1vdXNlWSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgeyBVaVNjcmVlbiB9IGZyb20gJy4uL1VpU2NyZWVuJztcclxuaW1wb3J0IHA1IGZyb20gJ3A1JztcclxuaW1wb3J0IHsgVWlGcmFtZSB9IGZyb20gJy4uL1VpRnJhbWUnO1xyXG5pbXBvcnQgeyBnYW1lIH0gZnJvbSAnLi4vLi4vR2FtZSc7XHJcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gJy4uL0J1dHRvbic7XHJcbmltcG9ydCB7IEZvbnRSZXNvdXJjZSB9IGZyb20gJy4uLy4uL2Fzc2V0cy9yZXNvdXJjZXMvRm9udFJlc291cmNlJztcclxuaW1wb3J0IHsgT3B0aW9uc01lbnUgfSBmcm9tICcuL09wdGlvbnNNZW51JztcclxuXHJcbmV4cG9ydCBjbGFzcyBWaWRlb1NldHRpbmdzTWVudSBleHRlbmRzIFVpU2NyZWVuIHtcclxuXHJcblx0Y29uc3RydWN0b3IoZm9udDogRm9udFJlc291cmNlLCB0aXRsZUZvbnQ6IEZvbnRSZXNvdXJjZSwgcHJldmlvdXNNZW51OiBzdHJpbmcpIHtcclxuXHRcdHN1cGVyKCk7XHJcblx0XHQvLyBtYWtlIHRoZSBmcmFtZSB3aXRoIHNvbWUgZGVmYXVsdCB2YWx1ZXMuICBUaGVzZSB3aWxsIGxhdGVyIGJlIGNoYW5nZWQgdG8gZml0IHRoZSBzY3JlZW4gc2l6ZS5cclxuXHRcdHRoaXMuZnJhbWUgPSBuZXcgVWlGcmFtZSgwLCAwLCAwLCAwKTtcclxuXHJcblxyXG5cdFx0aWYoZ2FtZS5za3lNb2QgPT09IHVuZGVmaW5lZClcclxuXHRcdFx0Z2FtZS5za3lNb2QgPSAyO1xyXG5cclxuXHRcdGlmKGdhbWUuc2t5VG9nZ2xlID09PSB1bmRlZmluZWQpXHJcblx0XHRcdGdhbWUuc2t5VG9nZ2xlID0gdHJ1ZTtcclxuXHJcblx0XHRpZihnYW1lLnBhcnRpY2xlTXVsdGlwbGllciA9PT0gdW5kZWZpbmVkKVxyXG5cdFx0XHRnYW1lLnBhcnRpY2xlTXVsdGlwbGllciA9IDE7XHJcblxyXG5cdFx0bGV0IHRlbXBTa3lNb2RlVGV4dDtcclxuXHJcblx0XHRpZihnYW1lLnNreU1vZD09PTIpIHtcclxuXHRcdFx0dGVtcFNreU1vZGVUZXh0ID0gXCJIYWxmIEZyYW1lcmF0ZVwiO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZihnYW1lLnNreU1vZD09PTEpIHtcclxuXHRcdFx0dGVtcFNreU1vZGVUZXh0ID0gXCJGdWxsIEZyYW1lcmF0ZVwiO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHRlbXBTa3lNb2RlVGV4dCA9IFwiU29saWQgQ29sb3JcIjtcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgdGVtcFBhcnRpY2xlVGV4dDtcclxuXHJcblx0XHRpZihnYW1lLnBhcnRpY2xlTXVsdGlwbGllcj09PTIpIHtcclxuXHRcdFx0dGVtcFBhcnRpY2xlVGV4dCA9IFwiRG91YmxlXCI7XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmKGdhbWUucGFydGljbGVNdWx0aXBsaWVyPT09MSkge1xyXG5cdFx0XHR0ZW1wUGFydGljbGVUZXh0ID0gXCJOb3JtYWxcIjtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHR0ZW1wUGFydGljbGVUZXh0ID0gXCJNaW5pbWFsXCI7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vIG1ha2Ugc29tZSBidXR0b25zIHdpdGggZGVmYXVsdCBwb3NpdGlvbnNcclxuXHRcdHRoaXMuYnV0dG9ucyA9IFtcclxuXHRcdFx0bmV3IEJ1dHRvbihmb250LCBgU2t5OiAke3RlbXBTa3lNb2RlVGV4dH1gLCBcIkNoYW5nZSB0aGUgYXBwZWFyYW5jZSBvZiB0aGUgc2t5LlwiLCAwLCAwLCAwLCAwLCAoKSA9PiB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJza3kgdG9nZ2xlXCIpO1xyXG5cdFx0XHRcdGlmKHRoaXMuYnV0dG9uc1swXS50eHQgPT09IFwiU2t5OiBIYWxmIEZyYW1lcmF0ZVwiKXtcclxuXHRcdFx0XHRcdHRoaXMuYnV0dG9uc1swXS50eHQgPSBcIlNreTogRnVsbCBGcmFtZXJhdGVcIjtcclxuXHRcdFx0XHRcdGdhbWUuc2t5TW9kID0gMTtcclxuXHRcdFx0XHRcdGdhbWUuc2t5VG9nZ2xlID0gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSBpZih0aGlzLmJ1dHRvbnNbMF0udHh0ID09PSBcIlNreTogRnVsbCBGcmFtZXJhdGVcIikge1xyXG5cdFx0XHRcdFx0dGhpcy5idXR0b25zWzBdLnR4dCA9IFwiU2t5OiBTb2xpZCBDb2xvclwiO1xyXG5cdFx0XHRcdFx0Z2FtZS5za3lUb2dnbGUgPSBmYWxzZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLmJ1dHRvbnNbMF0udHh0ID0gXCJTa3k6IEhhbGYgRnJhbWVyYXRlXCI7XHJcblx0XHRcdFx0XHRnYW1lLnNreU1vZCA9IDI7XHJcblx0XHRcdFx0XHRnYW1lLnNreVRvZ2dsZSA9IHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KSxcclxuXHRcdFx0bmV3IEJ1dHRvbihmb250LCBgUGFydGljbGVzOiAke3RlbXBQYXJ0aWNsZVRleHR9YCwgXCJDaGFuZ2UgdGhlIGFtb3VudCBvZiBwYXJ0aWNsZXNcIiwgMCwgMCwgMCwgMCwgKCkgPT4ge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKFwicGFydGljbGVzXCIpO1xyXG5cdFx0XHRcdGlmKHRoaXMuYnV0dG9uc1sxXS50eHQgPT09IFwiUGFydGljbGVzOiBOb3JtYWxcIil7XHJcblx0XHRcdFx0XHR0aGlzLmJ1dHRvbnNbMV0udHh0ID0gXCJQYXJ0aWNsZXM6IERvdWJsZVwiO1xyXG5cdFx0XHRcdFx0Z2FtZS5wYXJ0aWNsZU11bHRpcGxpZXIgPSAyO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIGlmKHRoaXMuYnV0dG9uc1sxXS50eHQgPT09IFwiUGFydGljbGVzOiBEb3VibGVcIikge1xyXG5cdFx0XHRcdFx0dGhpcy5idXR0b25zWzFdLnR4dCA9IFwiUGFydGljbGVzOiBNaW5pbWFsXCI7XHJcblx0XHRcdFx0XHRnYW1lLnBhcnRpY2xlTXVsdGlwbGllciA9IDAuNTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLmJ1dHRvbnNbMV0udHh0ID0gXCJQYXJ0aWNsZXM6IE5vcm1hbFwiO1xyXG5cdFx0XHRcdFx0Z2FtZS5wYXJ0aWNsZU11bHRpcGxpZXIgPSAxO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSksXHJcblx0XHRcdG5ldyBCdXR0b24oZm9udCwgXCJCYWNrXCIsIFwiUmV0dXJuIHRvIHRoZSBtYWluIG1lbnUuXCIsIDAsIDAsIDAsIDAsICgpID0+IHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhcIm1haW4gbWVudVwiKTtcclxuXHRcdFx0XHRnYW1lLmN1cnJlbnRVaSA9IG5ldyBPcHRpb25zTWVudShmb250LCB0aXRsZUZvbnQsIHByZXZpb3VzTWVudSk7XHJcblx0XHRcdH0pXHJcblx0XHRdO1xyXG5cdFx0Ly8gdXBkYXRlIHRoZSBzaXplIG9mIHRoZSBlbGVtZW50cyBiYXNlZCBvbiB0aGUgaW5pdGlhbCBzY3JlZW4gc2l6ZVxyXG5cdFx0dGhpcy53aW5kb3dVcGRhdGUoKTtcclxuXHR9XHJcblxyXG5cdHJlbmRlcih0YXJnZXQ6IHA1LCB1cHNjYWxlU2l6ZTogbnVtYmVyKTogdm9pZCB7XHJcblxyXG5cdFx0Ly8gcmVuZGVyIHRoZSByZWN0YW5ndWxhciBpbWFnZVxyXG5cdFx0dGhpcy5mcmFtZS5yZW5kZXIodGFyZ2V0LCB1cHNjYWxlU2l6ZSk7XHJcblxyXG5cdFx0Ly8gbG9vcCB0aHJvdWdoIHRoZSBidXR0b25zIGFycmF5IGFuZCByZW5kZXIgZWFjaCBvbmUuXHJcblx0XHR0aGlzLmJ1dHRvbnMuZm9yRWFjaChidXR0b24gPT4ge1xyXG5cdFx0XHRidXR0b24ucmVuZGVyKHRhcmdldCwgdXBzY2FsZVNpemUpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHR3aW5kb3dVcGRhdGUoKSB7XHJcblx0XHQvLyBzZXQgdGhlIHBvc2l0aW9uIG9mIHRoZSBmcmFtZVxyXG5cdFx0dGhpcy5mcmFtZS54ID0gZ2FtZS53aWR0aCAvIDIgLSAyMDAgLyAyICogZ2FtZS51cHNjYWxlU2l6ZTsvLyBjZW50ZXIgdGhlIGZyYW1lIGluIHRoZSBjZW50ZXIgb2YgdGhlIHNjcmVlblxyXG5cdFx0dGhpcy5mcmFtZS55ID0gZ2FtZS5oZWlnaHQgLyAyIC0gNTYgKiBnYW1lLnVwc2NhbGVTaXplO1xyXG5cdFx0dGhpcy5mcmFtZS53ID0gMjAwICogZ2FtZS51cHNjYWxlU2l6ZTtcclxuXHRcdHRoaXMuZnJhbWUuaCA9IDQ4ICogZ2FtZS51cHNjYWxlU2l6ZTtcclxuXHJcblx0XHQvLyBzZXQgdGhlIHBvc2l0aW9ucyBvZiBhbGwgdGhlIGJ1dHRvbnNcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5idXR0b25zLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHRoaXMuYnV0dG9uc1tpXS54ID0gZ2FtZS53aWR0aCAvIDIgLSAxOTIgLyAyICogZ2FtZS51cHNjYWxlU2l6ZTtcclxuXHRcdFx0dGhpcy5idXR0b25zW2ldLnkgPSBnYW1lLmhlaWdodCAvIDIgKyAyMCAqIGkgKiBnYW1lLnVwc2NhbGVTaXplO1xyXG5cdFx0XHR0aGlzLmJ1dHRvbnNbaV0udyA9IDE5MiAqIGdhbWUudXBzY2FsZVNpemU7XHJcblx0XHRcdHRoaXMuYnV0dG9uc1tpXS5oID0gMTYgKiBnYW1lLnVwc2NhbGVTaXplO1xyXG5cdFx0XHR0aGlzLmJ1dHRvbnNbaV0udXBkYXRlTW91c2VPdmVyKGdhbWUubW91c2VYLCBnYW1lLm1vdXNlWSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxufSIsImltcG9ydCBQNSBmcm9tICdwNSc7XHJcbmltcG9ydCB7IFRpY2thYmxlIH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9UaWNrYWJsZSc7XHJcbmltcG9ydCB7IFJlbmRlcmFibGUgfSBmcm9tICcuLi9pbnRlcmZhY2VzL1JlbmRlcmFibGUnO1xyXG5pbXBvcnQgeyBnYW1lLCBHYW1lIH0gZnJvbSAnLi4vR2FtZSc7XHJcbmltcG9ydCB7IFBsYXllckxvY2FsIH0gZnJvbSAnLi4vcGxheWVyL1BsYXllckxvY2FsJztcclxuaW1wb3J0IHsgU2VydmVyRW50aXR5IH0gZnJvbSAnLi9lbnRpdGllcy9TZXJ2ZXJFbnRpdHknO1xyXG5pbXBvcnQgeyBTbmFwc2hvdEludGVycG9sYXRpb24gfSBmcm9tICdAZ2Vja29zLmlvL3NuYXBzaG90LWludGVycG9sYXRpb24nO1xyXG5pbXBvcnQgeyBFbnRpdHksIFNuYXBzaG90IH0gZnJvbSAnQGdlY2tvcy5pby9zbmFwc2hvdC1pbnRlcnBvbGF0aW9uL2xpYi90eXBlcyc7XHJcbmltcG9ydCB7IFdvcmxkVGlsZXMgfSBmcm9tICcuL1dvcmxkVGlsZXMnO1xyXG5pbXBvcnQgeyBUaWxlVHlwZSB9IGZyb20gJy4uLy4uL2dsb2JhbC9UaWxlJztcclxuaW1wb3J0IHsgSW52ZW50b3J5IH0gZnJvbSAnLi4vcGxheWVyL0ludmVudG9yeSc7XHJcbmltcG9ydCB7IFRpbGVFbnRpdHlQYXlsb2FkIH0gZnJvbSAnLi4vLi4vZ2xvYmFsL1RpbGVFbnRpdHknO1xyXG5pbXBvcnQgeyBDbGllbnRUaWxlRW50aXR5IH0gZnJvbSAnLi9lbnRpdGllcy9UaWxlRW50aXR5JztcclxuaW1wb3J0IHsgV29ybGRBc3NldHMgfSBmcm9tICcuLi9hc3NldHMvQXNzZXRzJztcclxuXHJcbmV4cG9ydCBjbGFzcyBXb3JsZCBpbXBsZW1lbnRzIFRpY2thYmxlLCBSZW5kZXJhYmxlIHtcclxuXHR3aWR0aDogbnVtYmVyOyAvLyB3aWR0aCBvZiB0aGUgd29ybGQgaW4gdGlsZXNcclxuXHRoZWlnaHQ6IG51bWJlcjsgLy8gaGVpZ2h0IG9mIHRoZSB3b3JsZCBpbiB0aWxlc1xyXG5cclxuXHR0aWxlTGF5ZXI6IFA1LkdyYXBoaWNzOyAvLyBUaWxlIGxheWVyIGdyYXBoaWNcclxuXHJcblx0d29ybGRUaWxlczogKFRpbGVUeXBlIHwgc3RyaW5nKVtdOyAvLyBudW1iZXIgZm9yIGVhY2ggdGlsZXMgaW4gdGhlIHdvcmxkIGV4OiBbMSwgMSwgMCwgMSwgMiwgMCwgMCwgMS4uLiAgXSBtZWFucyBzbm93LCBzbm93LCBhaXIsIHNub3csIGljZSwgYWlyLCBhaXIsIHNub3cuLi4gIHN0cmluZyBpcyBpZCBmb3IgdGlsZSBlbnRpdHkgb2NjdXB5aW5nIHRoYXQgdGlsZVxyXG5cclxuXHRwbGF5ZXI6IFBsYXllckxvY2FsO1xyXG5cclxuXHRpbnZlbnRvcnk6IEludmVudG9yeTtcclxuXHJcblx0ZW50aXRpZXM6IHsgW2lkOiBzdHJpbmddOiBTZXJ2ZXJFbnRpdHkgfSA9IHt9O1xyXG5cclxuXHR0aWxlRW50aXR5UGF5bG9hZHM6IHsgW2lkOiBzdHJpbmddOiBUaWxlRW50aXR5UGF5bG9hZCB9O1xyXG5cdHRpbGVFbnRpdGllczogeyBbaWQ6IHN0cmluZ106IENsaWVudFRpbGVFbnRpdHkgfTtcclxuXHJcblx0c25hcHNob3RJbnRlcnBvbGF0aW9uOiBTbmFwc2hvdEludGVycG9sYXRpb247XHJcblxyXG5cdGNvbnN0cnVjdG9yKFxyXG5cdFx0d2lkdGg6IG51bWJlcixcclxuXHRcdGhlaWdodDogbnVtYmVyLFxyXG5cdFx0dGlsZXM6IChUaWxlVHlwZSB8IHN0cmluZylbXSxcclxuXHRcdHRpbGVFbnRpdGllczogeyBbaWQ6IHN0cmluZ106IENsaWVudFRpbGVFbnRpdHkgfSxcclxuXHQpIHtcclxuXHRcdC8vIEluaXRpYWxpemUgdGhlIHdvcmxkIHdpdGggdGhlIHRpbGVzIGFuZCBkaW1lbnNpb25zIGZyb20gdGhlIHNlcnZlclxyXG5cdFx0dGhpcy53aWR0aCA9IHdpZHRoO1xyXG5cdFx0dGhpcy5oZWlnaHQgPSBoZWlnaHQ7XHJcblx0XHR0aGlzLndvcmxkVGlsZXMgPSB0aWxlcztcclxuXHRcdHRoaXMudGlsZUVudGl0aWVzID0gdGlsZUVudGl0aWVzO1xyXG5cclxuXHRcdHRoaXMuc25hcHNob3RJbnRlcnBvbGF0aW9uID0gbmV3IFNuYXBzaG90SW50ZXJwb2xhdGlvbigpO1xyXG5cdFx0dGhpcy5zbmFwc2hvdEludGVycG9sYXRpb24uaW50ZXJwb2xhdGlvbkJ1ZmZlci5zZXQoXHJcblx0XHRcdCgxMDAwIC8gZ2FtZS5uZXRNYW5hZ2VyLnBsYXllclRpY2tSYXRlKSAqIDIsXHJcblx0XHQpO1xyXG5cclxuXHRcdC8vIGRlZmluZSB0aGUgcDUuR3JhcGhpY3Mgb2JqZWN0cyB0aGF0IGhvbGQgYW4gaW1hZ2Ugb2YgdGhlIHRpbGVzIG9mIHRoZSB3b3JsZC4gIFRoZXNlIGFjdCBzb3J0IG9mIGxpa2UgYSB2aXJ0dWFsIGNhbnZhcyBhbmQgY2FuIGJlIGRyYXduIG9uIGp1c3QgbGlrZSBhIG5vcm1hbCBjYW52YXMgYnkgdXNpbmcgdGlsZUxheWVyLnJlY3QoKTssIHRpbGVMYXllci5lbGxpcHNlKCk7LCB0aWxlTGF5ZXIuZmlsbCgpOywgZXRjLlxyXG5cdFx0dGhpcy50aWxlTGF5ZXIgPSBnYW1lLmNyZWF0ZUdyYXBoaWNzKFxyXG5cdFx0XHR0aGlzLndpZHRoICogZ2FtZS5USUxFX1dJRFRILFxyXG5cdFx0XHR0aGlzLmhlaWdodCAqIGdhbWUuVElMRV9IRUlHSFQsXHJcblx0XHQpO1xyXG5cdFx0dGhpcy5sb2FkV29ybGQoKTtcclxuXHR9XHJcblxyXG5cdHRpY2soZ2FtZTogR2FtZSkge1xyXG5cdFx0aWYgKHRoaXMucGxheWVyICE9PSB1bmRlZmluZWQpXHJcblx0XHRcdGdhbWUuY29ubmVjdGlvbi5lbWl0KCdwbGF5ZXJVcGRhdGUnLCB0aGlzLnBsYXllci54LCB0aGlzLnBsYXllci55KTtcclxuXHR9XHJcblxyXG5cdHJlbmRlcih0YXJnZXQ6IFA1LCB1cHNjYWxlU2l6ZTogbnVtYmVyKSB7XHJcblx0XHQvLyBkcmF3IHRoZSB0aWxlcyBsYXllciBvbnRvIHRoZSBzY3JlZW5cclxuXHRcdHRhcmdldC5pbWFnZShcclxuXHRcdFx0dGhpcy50aWxlTGF5ZXIsXHJcblx0XHRcdDAsXHJcblx0XHRcdDAsXHJcblx0XHRcdChnYW1lLndpZHRoIC8gdXBzY2FsZVNpemUpICogdXBzY2FsZVNpemUsXHJcblx0XHRcdChnYW1lLmhlaWdodCAvIHVwc2NhbGVTaXplKSAqIHVwc2NhbGVTaXplLFxyXG5cdFx0XHRnYW1lLmludGVycG9sYXRlZENhbVggKiBnYW1lLlRJTEVfV0lEVEgsXHJcblx0XHRcdGdhbWUuaW50ZXJwb2xhdGVkQ2FtWSAqIGdhbWUuVElMRV9XSURUSCxcclxuXHRcdFx0Z2FtZS53aWR0aCAvIHVwc2NhbGVTaXplLFxyXG5cdFx0XHRnYW1lLmhlaWdodCAvIHVwc2NhbGVTaXplLFxyXG5cdFx0KTtcclxuXHJcblx0XHR0aGlzLnJlbmRlclBsYXllcnModGFyZ2V0LCB1cHNjYWxlU2l6ZSk7XHJcblxyXG5cdFx0Ly8gdGFyZ2V0LnN0cm9rZSgwKTtcclxuXHRcdC8vIHRhcmdldC5zdHJva2VXZWlnaHQoNCk7XHJcblx0XHQvLyB0YXJnZXQubm9GaWxsKCk7XHJcblx0XHQvLyB0YXJnZXQucmVjdCh0YXJnZXQud2lkdGggLSB0aGlzLndpZHRoLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XHJcblxyXG5cdFx0Ly8gdGFyZ2V0LmltYWdlKFxyXG5cdFx0Ly8gXHR0aGlzLnRpbGVMYXllcixcclxuXHRcdC8vIFx0dGFyZ2V0LndpZHRoIC0gdGhpcy53aWR0aCxcclxuXHRcdC8vIFx0MCxcclxuXHRcdC8vIFx0dGhpcy53aWR0aCxcclxuXHRcdC8vIFx0dGhpcy5oZWlnaHQsXHJcblx0XHQvLyApO1xyXG5cdH1cclxuXHJcblx0dXBkYXRlUGxheWVycyhzbmFwc2hvdDogU25hcHNob3QpIHtcclxuXHRcdHRoaXMuc25hcHNob3RJbnRlcnBvbGF0aW9uLnNuYXBzaG90LmFkZChzbmFwc2hvdCk7XHJcblx0fVxyXG5cclxuXHR1cGRhdGVUaWxlKHRpbGVJbmRleDogbnVtYmVyLCB0aWxlOiBUaWxlVHlwZSkge1xyXG5cdFx0Ly8gVXBkYXRlIHRoZSB0aWxlIGFuZCB0aGUgNCBuZWlnaGJvdXJpbmcgdGlsZXNcclxuXHRcdHRoaXMud29ybGRUaWxlc1t0aWxlSW5kZXhdID0gdGlsZTtcclxuXHJcblx0XHQvLyBlcmFzZSB0aGUgYnJva2VuIHRpbGVzIGFuZCBpdHMgc3Vycm91bmRpbmcgdGlsZXMgaWYgdGhleSdyZSB0aWxlc1xyXG5cdFx0dGhpcy50aWxlTGF5ZXIuZXJhc2UoKTtcclxuXHRcdHRoaXMudGlsZUxheWVyLm5vU3Ryb2tlKCk7XHJcblx0XHR0aGlzLnRpbGVMYXllci5yZWN0KFxyXG5cdFx0XHQvL2NlbnRlclxyXG5cdFx0XHQodGlsZUluZGV4ICUgdGhpcy53aWR0aCkgKiBnYW1lLlRJTEVfV0lEVEgsXHJcblx0XHRcdE1hdGguZmxvb3IodGlsZUluZGV4IC8gdGhpcy53aWR0aCkgKiBnYW1lLlRJTEVfSEVJR0hULFxyXG5cdFx0XHRnYW1lLlRJTEVfV0lEVEgsXHJcblx0XHRcdGdhbWUuVElMRV9IRUlHSFQsXHJcblx0XHQpO1xyXG5cclxuXHRcdGlmIChcclxuXHRcdFx0dGlsZUluZGV4IC0gMSA+PSAwICYmXHJcblx0XHRcdHR5cGVvZiB0aGlzLndvcmxkVGlsZXNbdGlsZUluZGV4IC0gMV0gIT09ICdzdHJpbmcnICYmXHJcblx0XHRcdHRoaXMud29ybGRUaWxlc1t0aWxlSW5kZXggLSAxXSAhPT0gVGlsZVR5cGUuQWlyXHJcblx0XHQpIHtcclxuXHRcdFx0dGhpcy50aWxlTGF5ZXIucmVjdChcclxuXHRcdFx0XHQvL2xlZnRcclxuXHRcdFx0XHQoKHRpbGVJbmRleCAlIHRoaXMud2lkdGgpIC0gMSkgKiBnYW1lLlRJTEVfV0lEVEgsXHJcblx0XHRcdFx0TWF0aC5mbG9vcih0aWxlSW5kZXggLyB0aGlzLndpZHRoKSAqIGdhbWUuVElMRV9IRUlHSFQsXHJcblx0XHRcdFx0Z2FtZS5USUxFX1dJRFRILFxyXG5cdFx0XHRcdGdhbWUuVElMRV9IRUlHSFQsXHJcblx0XHRcdCk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKFxyXG5cdFx0XHR0aWxlSW5kZXggKyAxIDwgdGhpcy53aWR0aCAqIHRoaXMuaGVpZ2h0ICYmXHJcblx0XHRcdHR5cGVvZiB0aGlzLndvcmxkVGlsZXNbdGlsZUluZGV4ICsgMV0gIT09ICdzdHJpbmcnICYmXHJcblx0XHRcdHRoaXMud29ybGRUaWxlc1t0aWxlSW5kZXggKyAxXSAhPT0gVGlsZVR5cGUuQWlyXHJcblx0XHQpIHtcclxuXHRcdFx0dGhpcy50aWxlTGF5ZXIucmVjdChcclxuXHRcdFx0XHQvL3JpZ2h0XHJcblx0XHRcdFx0KCh0aWxlSW5kZXggJSB0aGlzLndpZHRoKSAtIDEpICogZ2FtZS5USUxFX1dJRFRILFxyXG5cdFx0XHRcdE1hdGguZmxvb3IodGlsZUluZGV4IC8gdGhpcy53aWR0aCkgKiBnYW1lLlRJTEVfSEVJR0hULFxyXG5cdFx0XHRcdGdhbWUuVElMRV9XSURUSCxcclxuXHRcdFx0XHRnYW1lLlRJTEVfSEVJR0hULFxyXG5cdFx0XHQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChcclxuXHRcdFx0dGlsZUluZGV4IC0gdGhpcy53aWR0aCA+PSAwICYmXHJcblx0XHRcdHR5cGVvZiB0aGlzLndvcmxkVGlsZXNbdGlsZUluZGV4IC0gdGhpcy53aWR0aF0gIT09ICdzdHJpbmcnICYmXHJcblx0XHRcdHRoaXMud29ybGRUaWxlc1t0aWxlSW5kZXggLSB0aGlzLndpZHRoXSAhPT0gVGlsZVR5cGUuQWlyXHJcblx0XHQpIHtcclxuXHRcdFx0dGhpcy50aWxlTGF5ZXIucmVjdChcclxuXHRcdFx0XHQvL3RvcFxyXG5cdFx0XHRcdCh0aWxlSW5kZXggJSB0aGlzLndpZHRoKSAqIGdhbWUuVElMRV9XSURUSCxcclxuXHRcdFx0XHQoTWF0aC5mbG9vcih0aWxlSW5kZXggLyB0aGlzLndpZHRoKSAtIDEpICogZ2FtZS5USUxFX0hFSUdIVCxcclxuXHRcdFx0XHRnYW1lLlRJTEVfV0lEVEgsXHJcblx0XHRcdFx0Z2FtZS5USUxFX0hFSUdIVCxcclxuXHRcdFx0KTtcclxuXHRcdH1cclxuXHRcdGlmIChcclxuXHRcdFx0dGlsZUluZGV4ICsgdGhpcy53aWR0aCA8IHRoaXMud2lkdGggKiB0aGlzLmhlaWdodCAmJlxyXG5cdFx0XHR0eXBlb2YgdGhpcy53b3JsZFRpbGVzW3RpbGVJbmRleCArIHRoaXMud2lkdGhdICE9PSAnc3RyaW5nJyAmJlxyXG5cdFx0XHR0aGlzLndvcmxkVGlsZXNbdGlsZUluZGV4ICsgdGhpcy53aWR0aF0gIT09IFRpbGVUeXBlLkFpclxyXG5cdFx0KSB7XHJcblx0XHRcdHRoaXMudGlsZUxheWVyLnJlY3QoXHJcblx0XHRcdFx0Ly9ib3R0b21cclxuXHRcdFx0XHQodGlsZUluZGV4ICUgdGhpcy53aWR0aCkgKiBnYW1lLlRJTEVfV0lEVEgsXHJcblx0XHRcdFx0KE1hdGguZmxvb3IodGlsZUluZGV4IC8gdGhpcy53aWR0aCkgKyAxKSAqIGdhbWUuVElMRV9IRUlHSFQsXHJcblx0XHRcdFx0Z2FtZS5USUxFX1dJRFRILFxyXG5cdFx0XHRcdGdhbWUuVElMRV9IRUlHSFQsXHJcblx0XHRcdCk7XHJcblx0XHR9XHJcblx0XHR0aGlzLnRpbGVMYXllci5ub0VyYXNlKCk7XHJcblxyXG5cdFx0Ly8gcmVkcmF3IHRoZSBuZWlnaGJvcmluZyB0aWxlc1xyXG5cdFx0dGhpcy5kcmF3VGlsZSh0aWxlSW5kZXgpO1xyXG5cdFx0dGhpcy5kcmF3VGlsZSh0aWxlSW5kZXggKyB0aGlzLndpZHRoKTtcclxuXHRcdHRoaXMuZHJhd1RpbGUodGlsZUluZGV4IC0gMSk7XHJcblx0XHR0aGlzLmRyYXdUaWxlKHRpbGVJbmRleCAtIHRoaXMud2lkdGgpO1xyXG5cdFx0dGhpcy5kcmF3VGlsZSh0aWxlSW5kZXggKyAxKTtcclxuXHR9XHJcblxyXG5cdHJlbmRlclBsYXllcnModGFyZ2V0OiBQNSwgdXBzY2FsZVNpemU6IG51bWJlcikge1xyXG5cdFx0Ly8gQ2FsY3VsYXRlIHRoZSBpbnRlcnBvbGF0ZWQgcG9zaXRpb24gb2YgYWxsIHVwZGF0ZWQgZW50aXRpZXNcclxuXHRcdGNvbnN0IHBvc2l0aW9uU3RhdGVzOiB7IFtpZDogc3RyaW5nXTogeyB4OiBudW1iZXI7IHk6IG51bWJlciB9IH0gPSB7fTtcclxuXHRcdHRyeSB7XHJcblx0XHRcdGNvbnN0IGNhbGN1bGF0ZWRTbmFwc2hvdCA9XHJcblx0XHRcdFx0dGhpcy5zbmFwc2hvdEludGVycG9sYXRpb24uY2FsY0ludGVycG9sYXRpb24oJ3ggeScpO1xyXG5cdFx0XHRpZiAoIWNhbGN1bGF0ZWRTbmFwc2hvdCkgcmV0dXJuO1xyXG5cclxuXHRcdFx0Y29uc3Qgc3RhdGUgPSBjYWxjdWxhdGVkU25hcHNob3Quc3RhdGU7XHJcblx0XHRcdGlmICghc3RhdGUpIHJldHVybjtcclxuXHJcblx0XHRcdC8vIFRoZSBuZXcgcG9zaXRpb25zIG9mIGVudGl0aWVzIGFzIG9iamVjdFxyXG5cdFx0XHRzdGF0ZS5mb3JFYWNoKCh7IGlkLCB4LCB5IH06IEVudGl0eSAmIHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfSkgPT4ge1xyXG5cdFx0XHRcdHBvc2l0aW9uU3RhdGVzW2lkXSA9IHsgeCwgeSB9O1xyXG5cdFx0XHR9KTtcclxuXHRcdH0gY2F0Y2ggKGUpIHt9XHJcblxyXG5cdFx0Ly8gUmVuZGVyIGVhY2ggZW50aXR5IGluIHJhbmRvbSBvcmRlclxyXG5cdFx0T2JqZWN0LmVudHJpZXModGhpcy5lbnRpdGllcykuZm9yRWFjaChcclxuXHRcdFx0KGVudGl0eTogW3N0cmluZywgU2VydmVyRW50aXR5XSkgPT4ge1xyXG5cdFx0XHRcdGNvbnN0IHVwZGF0ZWRQb3NpdGlvbiA9IHBvc2l0aW9uU3RhdGVzW2VudGl0eVswXV07XHJcblx0XHRcdFx0aWYgKHVwZGF0ZWRQb3NpdGlvbiAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0XHRlbnRpdHlbMV0ueCA9IHVwZGF0ZWRQb3NpdGlvbi54O1xyXG5cdFx0XHRcdFx0ZW50aXR5WzFdLnkgPSB1cGRhdGVkUG9zaXRpb24ueTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGVudGl0eVsxXS5yZW5kZXIodGFyZ2V0LCB1cHNjYWxlU2l6ZSk7XHJcblx0XHRcdH0sXHJcblx0XHQpO1xyXG5cclxuXHRcdC8vIFJlbmRlciB0aGUgcGxheWVyIG9uIHRvcFxyXG5cdFx0aWYgKHRoaXMucGxheWVyICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0dGhpcy5wbGF5ZXIuZmluZEludGVycG9sYXRlZENvb3JkaW5hdGVzKCk7XHJcblx0XHRcdHRoaXMucGxheWVyLnJlbmRlcih0YXJnZXQsIHVwc2NhbGVTaXplKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGxvYWRXb3JsZCgpIHtcclxuXHRcdHRoaXMudGlsZUxheWVyLm5vU3Ryb2tlKCk7XHJcblx0XHR0aGlzLnRpbGVMYXllci5maWxsKDI1NSwgMCwgMCk7XHJcblx0XHRmb3IgKGxldCB4ID0gMDsgeCA8IHRoaXMuaGVpZ2h0OyB4KyspIHtcclxuXHRcdFx0Ly94IGFuZCB5IGFyZSBzd2l0Y2hlZCBmb3Igc29tZSBzdHVwaWQgcmVhc29uXHJcblx0XHRcdC8vIGkgd2lsbCBiZSB0aGUgeSBwb3NpdGlvbiBvZiB0aWxlcyBiZWluZyBkcmF3blxyXG5cdFx0XHRmb3IgKGxldCB5ID0gMDsgeSA8IHRoaXMud2lkdGg7IHkrKykge1xyXG5cdFx0XHRcdGNvbnN0IHRpbGVWYWwgPSB0aGlzLndvcmxkVGlsZXNbeCAqIHRoaXMud2lkdGggKyB5XTtcclxuXHJcblx0XHRcdFx0aWYgKHR5cGVvZiB0aWxlVmFsID09PSAnc3RyaW5nJykge1xyXG5cdFx0XHRcdFx0aWYgKHRoaXMudGlsZUVudGl0aWVzID09PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvcigndGlsZSBlbnRpdHkgYXJyYXkgaXMgdW5kZWZpbmVkJyk7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0aWYgKHRoaXMudGlsZUVudGl0aWVzW3RpbGVWYWxdID09PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvcihcclxuXHRcdFx0XHRcdFx0XHQndGlsZSBlbnRpdHkgJyArIHRpbGVWYWwgKyAnIGlzIHVuZGVmaW5lZCcsXHJcblx0XHRcdFx0XHRcdCk7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0Y29uc3QgdG9wTGVmdCA9IE1hdGgubWluKFxyXG5cdFx0XHRcdFx0XHQuLi50aGlzLnRpbGVFbnRpdGllc1t0aWxlVmFsXS5jb3ZlcmVkVGlsZXMsXHJcblx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdFx0aWYgKHggKiB0aGlzLndpZHRoICsgeSA9PT0gdG9wTGVmdCkge1xyXG5cdFx0XHRcdFx0XHQvL3JlbmRlciB0aWxlIGVudGl0eSBpbWFnZVxyXG5cdFx0XHRcdFx0XHRsZXQgaW1nID1cclxuXHRcdFx0XHRcdFx0XHRXb3JsZEFzc2V0cy50aWxlRW50aXRpZXNbXHJcblx0XHRcdFx0XHRcdFx0XHR0aGlzLnRpbGVFbnRpdGllc1t0aWxlVmFsXS50eXBlX1xyXG5cdFx0XHRcdFx0XHRcdF1bdGhpcy50aWxlRW50aXRpZXNbdGlsZVZhbF0uYW5pbUZyYW1lXTtcclxuXHRcdFx0XHRcdFx0aW1nLnJlbmRlcihcclxuXHRcdFx0XHRcdFx0XHR0aGlzLnRpbGVMYXllcixcclxuXHRcdFx0XHRcdFx0XHR5ICogZ2FtZS5USUxFX1dJRFRILFxyXG5cdFx0XHRcdFx0XHRcdHggKiBnYW1lLlRJTEVfSEVJR0hULFxyXG5cdFx0XHRcdFx0XHRcdGltZy5pbWFnZS53aWR0aCxcclxuXHRcdFx0XHRcdFx0XHRpbWcuaW1hZ2UuaGVpZ2h0LFxyXG5cdFx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhgQWxyZWFkeSByZW5kZXJlZCAke3RpbGVWYWx9YCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmICh0aWxlVmFsICE9PSBUaWxlVHlwZS5BaXIpIHtcclxuXHRcdFx0XHRcdC8vIERyYXcgdGhlIGNvcnJlY3QgaW1hZ2UgZm9yIHRoZSB0aWxlcyBvbnRvIHRoZSB0aWxlcyBsYXllclxyXG5cdFx0XHRcdFx0Y29uc3QgdGlsZSA9IFdvcmxkVGlsZXNbdGlsZVZhbF07XHJcblxyXG5cdFx0XHRcdFx0aWYgKHRpbGUgPT09IHVuZGVmaW5lZCkgY29udGludWU7XHJcblxyXG5cdFx0XHRcdFx0aWYgKHRpbGUuY29ubmVjdGVkICYmICdyZW5kZXJUaWxlJyBpbiB0aWxlLnRleHR1cmUpIHtcclxuXHRcdFx0XHRcdFx0Ly8gUmVuZGVyIGNvbm5lY3RlZCB0aWxlc1xyXG5cdFx0XHRcdFx0XHR0aWxlLnRleHR1cmUucmVuZGVyVGlsZShcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmZpbmRUaWxlc2V0SW5kZXgoXHJcblx0XHRcdFx0XHRcdFx0XHR4LFxyXG5cdFx0XHRcdFx0XHRcdFx0eSxcclxuXHRcdFx0XHRcdFx0XHRcdHRpbGVWYWwsXHJcblx0XHRcdFx0XHRcdFx0XHRXb3JsZFRpbGVzW3RpbGVWYWxdPy5hbnlDb25uZWN0aW9uLFxyXG5cdFx0XHRcdFx0XHRcdCksXHJcblx0XHRcdFx0XHRcdFx0dGhpcy50aWxlTGF5ZXIsXHJcblx0XHRcdFx0XHRcdFx0eSAqIGdhbWUuVElMRV9XSURUSCxcclxuXHRcdFx0XHRcdFx0XHR4ICogZ2FtZS5USUxFX0hFSUdIVCxcclxuXHRcdFx0XHRcdFx0XHRnYW1lLlRJTEVfV0lEVEgsXHJcblx0XHRcdFx0XHRcdFx0Z2FtZS5USUxFX0hFSUdIVCxcclxuXHRcdFx0XHRcdFx0KTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdC8vIFJlbmRlciBub24tY29ubmVjdGVkIHRpbGVzXHJcblx0XHRcdFx0XHRcdHRpbGUudGV4dHVyZS5yZW5kZXIoXHJcblx0XHRcdFx0XHRcdFx0dGhpcy50aWxlTGF5ZXIsXHJcblx0XHRcdFx0XHRcdFx0eSAqIGdhbWUuVElMRV9XSURUSCxcclxuXHRcdFx0XHRcdFx0XHR4ICogZ2FtZS5USUxFX0hFSUdIVCxcclxuXHRcdFx0XHRcdFx0XHRnYW1lLlRJTEVfV0lEVEgsXHJcblx0XHRcdFx0XHRcdFx0Z2FtZS5USUxFX0hFSUdIVCxcclxuXHRcdFx0XHRcdFx0KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGRyYXdUaWxlKHRpbGVJbmRleDogbnVtYmVyKSB7XHJcblx0XHRjb25zdCB4ID0gdGlsZUluZGV4ICUgdGhpcy53aWR0aDtcclxuXHRcdGNvbnN0IHkgPSBNYXRoLmZsb29yKHRpbGVJbmRleCAvIHRoaXMud2lkdGgpO1xyXG5cclxuXHRcdGlmICh0aGlzLndvcmxkVGlsZXNbdGlsZUluZGV4XSAhPT0gVGlsZVR5cGUuQWlyKSB7XHJcblx0XHRcdC8vIERyYXcgdGhlIGNvcnJlY3QgaW1hZ2UgZm9yIHRoZSB0aWxlcyBvbnRvIHRoZSB0aWxlcyBsYXllclxyXG5cclxuXHRcdFx0Y29uc3QgdGlsZVZhbCA9IHRoaXMud29ybGRUaWxlc1t0aWxlSW5kZXhdO1xyXG5cclxuXHRcdFx0aWYgKHR5cGVvZiB0aWxlVmFsID09PSAnc3RyaW5nJykge1xyXG5cdFx0XHRcdGlmICh0aGlzLnRpbGVFbnRpdGllc1t0aWxlVmFsXSA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKCd0aWxlIGVudGl0eSAnICsgdGlsZVZhbCArICcgaXMgdW5kZWZpbmVkJyk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRjb25zdCB0b3BMZWZ0ID0gTWF0aC5taW4oXHJcblx0XHRcdFx0XHQuLi50aGlzLnRpbGVFbnRpdGllc1t0aWxlVmFsXS5jb3ZlcmVkVGlsZXMsXHJcblx0XHRcdFx0KTtcclxuXHRcdFx0XHRpZiAodGlsZUluZGV4ID09PSB0b3BMZWZ0KSB7XHJcblx0XHRcdFx0XHQvL3JlbmRlciB0aWxlIGVudGl0eSBpbWFnZVxyXG5cdFx0XHRcdFx0Ly90aGlzLnRpbGVFbnRpdGllc1t0aWxlVmFsXS5yZW5kZXIodGlsZUxheWVyLCB4KjgsIHkqOCk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdC8vY29uc29sZS5sb2coYEFscmVhZHkgcmVuZGVyZWQgJHt0aWxlVmFsfWApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGNvbnN0IHRpbGUgPSBXb3JsZFRpbGVzW3RpbGVWYWxdO1xyXG5cclxuXHRcdFx0Ly8gaWYgdGhlIHRpbGVzIGlzIG9mZi1zY3JlZW5cclxuXHRcdFx0aWYgKHRpbGUgPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHRpbGUuY29ubmVjdGVkICYmICdyZW5kZXJUaWxlJyBpbiB0aWxlLnRleHR1cmUpIHtcclxuXHRcdFx0XHRsZXQgdG9wVGlsZUJvb2wgPSBmYWxzZTtcclxuXHRcdFx0XHRsZXQgbGVmdFRpbGVCb29sID0gZmFsc2U7XHJcblx0XHRcdFx0bGV0IGJvdHRvbVRpbGVCb29sID0gZmFsc2U7XHJcblx0XHRcdFx0bGV0IHJpZ2h0VGlsZUJvb2wgPSBmYWxzZTtcclxuXHRcdFx0XHRpZiAodGlsZS5hbnlDb25uZWN0aW9uKSB7XHJcblx0XHRcdFx0XHQvLyB0ZXN0IGlmIHRoZSBuZWlnaGJvcmluZyB0aWxlcyBhcmUgc29saWRcclxuXHRcdFx0XHRcdHRvcFRpbGVCb29sID1cclxuXHRcdFx0XHRcdFx0eCA9PT0gMCB8fFxyXG5cdFx0XHRcdFx0XHQodGhpcy53b3JsZFRpbGVzWyh5IC0gMSkgKiB0aGlzLndpZHRoICsgeF0gIT09XHJcblx0XHRcdFx0XHRcdFx0VGlsZVR5cGUuQWlyICYmXHJcblx0XHRcdFx0XHRcdFx0dHlwZW9mIHRoaXMud29ybGRUaWxlc1soeSAtIDEpICogdGhpcy53aWR0aCArIHhdICE9PVxyXG5cdFx0XHRcdFx0XHRcdFx0J3N0cmluZycpO1xyXG5cdFx0XHRcdFx0bGVmdFRpbGVCb29sID1cclxuXHRcdFx0XHRcdFx0eSA9PT0gMCB8fFxyXG5cdFx0XHRcdFx0XHQodGhpcy53b3JsZFRpbGVzW3kgKiB0aGlzLndpZHRoICsgeCAtIDFdICE9PVxyXG5cdFx0XHRcdFx0XHRcdFRpbGVUeXBlLkFpciAmJlxyXG5cdFx0XHRcdFx0XHRcdHR5cGVvZiB0aGlzLndvcmxkVGlsZXNbeSAqIHRoaXMud2lkdGggKyB4IC0gMV0gIT09XHJcblx0XHRcdFx0XHRcdFx0XHQnc3RyaW5nJyk7XHJcblx0XHRcdFx0XHRib3R0b21UaWxlQm9vbCA9XHJcblx0XHRcdFx0XHRcdHggPT09IHRoaXMuaGVpZ2h0IC0gMSB8fFxyXG5cdFx0XHRcdFx0XHQodGhpcy53b3JsZFRpbGVzWyh5ICsgMSkgKiB0aGlzLndpZHRoICsgeF0gIT09XHJcblx0XHRcdFx0XHRcdFx0VGlsZVR5cGUuQWlyICYmXHJcblx0XHRcdFx0XHRcdFx0dHlwZW9mIHRoaXMud29ybGRUaWxlc1soeSArIDEpICogdGhpcy53aWR0aCArIHhdICE9PVxyXG5cdFx0XHRcdFx0XHRcdFx0J3N0cmluZycpO1xyXG5cdFx0XHRcdFx0cmlnaHRUaWxlQm9vbCA9XHJcblx0XHRcdFx0XHRcdHkgPT09IHRoaXMud2lkdGggLSAxIHx8XHJcblx0XHRcdFx0XHRcdCh0aGlzLndvcmxkVGlsZXNbeSAqIHRoaXMud2lkdGggKyB4ICsgMV0gIT09XHJcblx0XHRcdFx0XHRcdFx0VGlsZVR5cGUuQWlyICYmXHJcblx0XHRcdFx0XHRcdFx0dHlwZW9mIHRoaXMud29ybGRUaWxlc1t5ICogdGhpcy53aWR0aCArIHggKyAxXSAhPT1cclxuXHRcdFx0XHRcdFx0XHRcdCdzdHJpbmcnKTtcclxuXHJcblx0XHRcdFx0XHQvLyBjb25zb2xlLmxvZyhbXCJib3JpbmdcIiwgbGVmdFRpbGVCb29sLCBib3R0b21UaWxlQm9vbCwgdGhpcy53b3JsZFRpbGVzW3ggKiB0aGlzLndpZHRoICsgeSArIDFdLCB0b3BUaWxlQm9vbF0pXHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdC8vIHRlc3QgaWYgdGhlIG5laWdoYm9yaW5nIHRpbGVzIGFyZSB0aGUgc2FtZSB0aWxlXHJcblx0XHRcdFx0XHR0b3BUaWxlQm9vbCA9XHJcblx0XHRcdFx0XHRcdHggPT09IDAgfHxcclxuXHRcdFx0XHRcdFx0dGhpcy53b3JsZFRpbGVzWyh5IC0gMSkgKiB0aGlzLndpZHRoICsgeF0gPT09IHRpbGVWYWw7XHJcblx0XHRcdFx0XHRsZWZ0VGlsZUJvb2wgPVxyXG5cdFx0XHRcdFx0XHR5ID09PSAwIHx8XHJcblx0XHRcdFx0XHRcdHRoaXMud29ybGRUaWxlc1t5ICogdGhpcy53aWR0aCArIHggLSAxXSA9PT0gdGlsZVZhbDtcclxuXHRcdFx0XHRcdGJvdHRvbVRpbGVCb29sID1cclxuXHRcdFx0XHRcdFx0eCA9PT0gdGhpcy5oZWlnaHQgLSAxIHx8XHJcblx0XHRcdFx0XHRcdHRoaXMud29ybGRUaWxlc1soeSArIDEpICogdGhpcy53aWR0aCArIHhdID09PSB0aWxlVmFsO1xyXG5cdFx0XHRcdFx0cmlnaHRUaWxlQm9vbCA9XHJcblx0XHRcdFx0XHRcdHkgPT09IHRoaXMud2lkdGggLSAxIHx8XHJcblx0XHRcdFx0XHRcdHRoaXMud29ybGRUaWxlc1t5ICogdGhpcy53aWR0aCArIHggKyAxXSA9PT0gdGlsZVZhbDtcclxuXHRcdFx0XHRcdC8vY29uc29sZS5sb2coW1wiZmFuY3lcIiwgbGVmdFRpbGVCb29sLCBib3R0b21UaWxlQm9vbCwgcmlnaHRUaWxlQm9vbCwgdG9wVGlsZUJvb2xdKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0aGlzLndvcmxkVGlsZXNbdGlsZUluZGV4ICsgMV0gIT09IFRpbGVUeXBlLkFpcjtcclxuXHJcblx0XHRcdFx0Ly8gY29udmVydCA0IGRpZ2l0IGJpbmFyeSBudW1iZXIgdG8gYmFzZSAxMFxyXG5cdFx0XHRcdGNvbnN0IHRpbGVTZXRJbmRleCA9XHJcblx0XHRcdFx0XHQ4ICogK3RvcFRpbGVCb29sICtcclxuXHRcdFx0XHRcdDQgKiArcmlnaHRUaWxlQm9vbCArXHJcblx0XHRcdFx0XHQyICogK2JvdHRvbVRpbGVCb29sICtcclxuXHRcdFx0XHRcdCtsZWZ0VGlsZUJvb2w7XHJcblxyXG5cdFx0XHRcdC8vIFJlbmRlciBjb25uZWN0ZWQgdGlsZXNcclxuXHRcdFx0XHR0aWxlLnRleHR1cmUucmVuZGVyVGlsZShcclxuXHRcdFx0XHRcdHRpbGVTZXRJbmRleCxcclxuXHRcdFx0XHRcdHRoaXMudGlsZUxheWVyLFxyXG5cdFx0XHRcdFx0eCAqIGdhbWUuVElMRV9XSURUSCxcclxuXHRcdFx0XHRcdHkgKiBnYW1lLlRJTEVfSEVJR0hULFxyXG5cdFx0XHRcdFx0Z2FtZS5USUxFX1dJRFRILFxyXG5cdFx0XHRcdFx0Z2FtZS5USUxFX0hFSUdIVCxcclxuXHRcdFx0XHQpO1xyXG5cdFx0XHR9IGVsc2UgaWYgKCF0aWxlLmNvbm5lY3RlZCkge1xyXG5cdFx0XHRcdC8vIFJlbmRlciBub24tY29ubmVjdGVkIHRpbGVzXHJcblx0XHRcdFx0dGlsZS50ZXh0dXJlLnJlbmRlcihcclxuXHRcdFx0XHRcdHRoaXMudGlsZUxheWVyLFxyXG5cdFx0XHRcdFx0eCAqIGdhbWUuVElMRV9XSURUSCxcclxuXHRcdFx0XHRcdHkgKiBnYW1lLlRJTEVfSEVJR0hULFxyXG5cdFx0XHRcdFx0Z2FtZS5USUxFX1dJRFRILFxyXG5cdFx0XHRcdFx0Z2FtZS5USUxFX0hFSUdIVCxcclxuXHRcdFx0XHQpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRmaW5kVGlsZXNldEluZGV4KFxyXG5cdFx0eDogbnVtYmVyLFxyXG5cdFx0eTogbnVtYmVyLFxyXG5cdFx0dGlsZVZhbDogVGlsZVR5cGUsXHJcblx0XHRhbnlDb25uZWN0aW9uPzogYm9vbGVhbixcclxuXHQpIHtcclxuXHRcdGxldCB0b3BUaWxlQm9vbCA9IGZhbHNlO1xyXG5cdFx0bGV0IGxlZnRUaWxlQm9vbCA9IGZhbHNlO1xyXG5cdFx0bGV0IGJvdHRvbVRpbGVCb29sID0gZmFsc2U7XHJcblx0XHRsZXQgcmlnaHRUaWxlQm9vbCA9IGZhbHNlO1xyXG5cdFx0aWYgKGFueUNvbm5lY3Rpb24pIHtcclxuXHRcdFx0Ly8gdGVzdCBpZiB0aGUgbmVpZ2hib3JpbmcgdGlsZXMgYXJlIHNvbGlkXHJcblx0XHRcdHRvcFRpbGVCb29sID1cclxuXHRcdFx0XHR4ID09PSAwIHx8XHJcblx0XHRcdFx0KHRoaXMud29ybGRUaWxlc1soeCAtIDEpICogdGhpcy53aWR0aCArIHldICE9PSBUaWxlVHlwZS5BaXIgJiYvL3ggYW5kIHkgYXBwZWFyIHRvIGJlIHN3aXRjaGVkXHJcblx0XHRcdFx0XHR0eXBlb2YgdGhpcy53b3JsZFRpbGVzWyh4IC0gMSkgKiB0aGlzLndpZHRoICsgeV0gPT1cclxuXHRcdFx0XHRcdFx0J251bWJlcicpO1xyXG5cdFx0XHRsZWZ0VGlsZUJvb2wgPVxyXG5cdFx0XHRcdHkgPT09IDAgfHxcclxuXHRcdFx0XHQodGhpcy53b3JsZFRpbGVzW3ggKiB0aGlzLndpZHRoICsgeSAtIDFdICE9PSBUaWxlVHlwZS5BaXIgJiZcclxuXHRcdFx0XHRcdHR5cGVvZiB0aGlzLndvcmxkVGlsZXNbeCAqIHRoaXMud2lkdGggKyB5IC0gMV0gPT1cclxuXHRcdFx0XHRcdFx0J251bWJlcicpO1xyXG5cdFx0XHRib3R0b21UaWxlQm9vbCA9XHJcblx0XHRcdFx0eCA9PT0gdGhpcy5oZWlnaHQgLSAxIHx8XHJcblx0XHRcdFx0KHRoaXMud29ybGRUaWxlc1soeCArIDEpICogdGhpcy53aWR0aCArIHldICE9PSBUaWxlVHlwZS5BaXIgJiZcclxuXHRcdFx0XHRcdHR5cGVvZiB0aGlzLndvcmxkVGlsZXNbKHggKyAxKSAqIHRoaXMud2lkdGggKyB5XSA9PVxyXG5cdFx0XHRcdFx0XHQnbnVtYmVyJyk7XHJcblx0XHRcdHJpZ2h0VGlsZUJvb2wgPVxyXG5cdFx0XHRcdHkgPT09IHRoaXMud2lkdGggLSAxIHx8XHJcblx0XHRcdFx0KHRoaXMud29ybGRUaWxlc1t4ICogdGhpcy53aWR0aCArIHkgKyAxXSAhPT0gVGlsZVR5cGUuQWlyICYmXHJcblx0XHRcdFx0XHR0eXBlb2YgdGhpcy53b3JsZFRpbGVzW3ggKiB0aGlzLndpZHRoICsgeSArIDFdID09XHJcblx0XHRcdFx0XHRcdCdudW1iZXInKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdC8vIHRlc3QgaWYgdGhlIG5laWdoYm9yaW5nIHRpbGVzIGFyZSB0aGUgc2FtZSB0aWxlXHJcblx0XHRcdHRvcFRpbGVCb29sID1cclxuXHRcdFx0XHR4ID09PSAwIHx8XHJcblx0XHRcdFx0dGhpcy53b3JsZFRpbGVzWyh4IC0gMSkgKiB0aGlzLndpZHRoICsgeV0gPT09IHRpbGVWYWw7XHJcblx0XHRcdGxlZnRUaWxlQm9vbCA9XHJcblx0XHRcdFx0eSA9PT0gMCB8fCB0aGlzLndvcmxkVGlsZXNbeCAqIHRoaXMud2lkdGggKyB5IC0gMV0gPT09IHRpbGVWYWw7XHJcblx0XHRcdGJvdHRvbVRpbGVCb29sID1cclxuXHRcdFx0XHR4ID09PSB0aGlzLmhlaWdodCAtIDEgfHxcclxuXHRcdFx0XHR0aGlzLndvcmxkVGlsZXNbKHggKyAxKSAqIHRoaXMud2lkdGggKyB5XSA9PT0gdGlsZVZhbDtcclxuXHRcdFx0cmlnaHRUaWxlQm9vbCA9XHJcblx0XHRcdFx0eSA9PT0gdGhpcy53aWR0aCAtIDEgfHxcclxuXHRcdFx0XHR0aGlzLndvcmxkVGlsZXNbeCAqIHRoaXMud2lkdGggKyB5ICsgMV0gPT09IHRpbGVWYWw7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gY29udmVydCA0IGRpZ2l0IGJpbmFyeSBudW1iZXIgdG8gYmFzZSAxMFxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0OCAqICt0b3BUaWxlQm9vbCArXHJcblx0XHRcdDQgKiArcmlnaHRUaWxlQm9vbCArXHJcblx0XHRcdDIgKiArYm90dG9tVGlsZUJvb2wgK1xyXG5cdFx0XHQrbGVmdFRpbGVCb29sXHJcblx0XHQpO1xyXG5cdH1cclxufVxyXG4iLCJpbXBvcnQgeyBJbWFnZVJlc291cmNlIH0gZnJvbSAnLi4vYXNzZXRzL3Jlc291cmNlcy9JbWFnZVJlc291cmNlJztcclxuaW1wb3J0IHsgV29ybGRBc3NldHMgfSBmcm9tICcuLi9hc3NldHMvQXNzZXRzJztcclxuaW1wb3J0IHsgVGlsZVJlc291cmNlIH0gZnJvbSAnLi4vYXNzZXRzL3Jlc291cmNlcy9UaWxlUmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBUaWxlVHlwZSB9IGZyb20gJy4uLy4uL2dsb2JhbC9UaWxlJztcclxuaW1wb3J0IHsgVGlsZUVudGl0aWVzIH0gZnJvbSAnLi4vLi4vZ2xvYmFsL1RpbGVFbnRpdHknO1xyXG5pbXBvcnQgeyBJdGVtVHlwZSB9IGZyb20gJy4uLy4uL2dsb2JhbC9JbnZlbnRvcnknO1xyXG5cclxuZXhwb3J0IHR5cGUgVGlsZSA9IHtcclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIHRleHR1cmU6IEltYWdlUmVzb3VyY2UgfCBUaWxlUmVzb3VyY2U7XHJcbiAgICBjb25uZWN0ZWQ/OiBib29sZWFuO1xyXG4gICAgYW55Q29ubmVjdGlvbj86IGJvb2xlYW47XHJcbiAgICBjb2xvcjogc3RyaW5nO1xyXG4gICAgZnJpY3Rpb246IG51bWJlcjtcclxuICAgIHJlZmxlY3Rpdml0eTogbnVtYmVyO1xyXG59XHJcblxyXG5leHBvcnQgdHlwZSBUaWxlRW50aXR5UmVuZGVyRGF0YSA9IHtcclxuICAgIHRleHR1cmU6IEltYWdlUmVzb3VyY2UgfCBUaWxlUmVzb3VyY2U7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBXb3JsZFRpbGVzOiBSZWNvcmQ8VGlsZVR5cGUsIFRpbGUgfCB1bmRlZmluZWQ+ID0ge1xyXG4gICAgW1RpbGVUeXBlLkFpcl06IHVuZGVmaW5lZCxcclxuICAgIFtUaWxlVHlwZS5Tbm93XToge1xyXG4gICAgICAgIG5hbWU6ICdzbm93JyxcclxuICAgICAgICB0ZXh0dXJlOiBXb3JsZEFzc2V0cy5taWRkbGVncm91bmQudGlsZXNldF9zbm93LFxyXG4gICAgICAgIGNvbm5lY3RlZDogdHJ1ZSxcclxuICAgICAgICBhbnlDb25uZWN0aW9uOiB0cnVlLFxyXG4gICAgICAgIGNvbG9yOiBcIiNjYWZhZmNcIixcclxuICAgICAgICBmcmljdGlvbjogMixcclxuICAgICAgICByZWZsZWN0aXZpdHk6IDUwLy90aGlzIHJlZmxlY3Rpdml0eSBhY3R1YWxseSBkb2VzIG5vdGhpbmcgYW5kIGluc3RlYWQgcmVmbGVjdGl2aXR5IGNhbiBiZSBjaGFuZ2VkIGluc2lkZSBSZWZsZWN0ZWRJbWFnZVJlc291cmNlLnRzXHJcbiAgICB9LFxyXG4gICAgW1RpbGVUeXBlLkljZV06IHtcclxuICAgICAgICBuYW1lOiAnaWNlJyxcclxuICAgICAgICB0ZXh0dXJlOiBXb3JsZEFzc2V0cy5taWRkbGVncm91bmQudGlsZXNldF9pY2UsXHJcbiAgICAgICAgY29ubmVjdGVkOiB0cnVlLFxyXG4gICAgICAgIGFueUNvbm5lY3Rpb246IHRydWUsXHJcbiAgICAgICAgY29sb3I6IFwiIzc2YWRjNFwiLFxyXG4gICAgICAgIGZyaWN0aW9uOiAxLjUsXHJcbiAgICAgICAgcmVmbGVjdGl2aXR5OiAxNTBcclxuICAgIH0sXHJcbiAgICBbVGlsZVR5cGUuRGlydF06IHtcclxuICAgICAgICBuYW1lOiAnZGlydCcsXHJcbiAgICAgICAgdGV4dHVyZTogV29ybGRBc3NldHMubWlkZGxlZ3JvdW5kLnRpbGVzZXRfZGlydCxcclxuICAgICAgICBjb25uZWN0ZWQ6IHRydWUsXHJcbiAgICAgICAgYW55Q29ubmVjdGlvbjogdHJ1ZSxcclxuICAgICAgICBjb2xvcjogXCIjNGEyZTFlXCIsXHJcbiAgICAgICAgZnJpY3Rpb246IDQsXHJcbiAgICAgICAgcmVmbGVjdGl2aXR5OiAwXHJcbiAgICB9LFxyXG4gICAgW1RpbGVUeXBlLlN0b25lMF06IHtcclxuICAgICAgICBuYW1lOiAncmF3IHN0b25lJyxcclxuICAgICAgICB0ZXh0dXJlOiBXb3JsZEFzc2V0cy5taWRkbGVncm91bmQudGlsZXNldF9zdG9uZTAsXHJcbiAgICAgICAgY29ubmVjdGVkOiB0cnVlLFxyXG4gICAgICAgIGFueUNvbm5lY3Rpb246IHRydWUsXHJcbiAgICAgICAgY29sb3I6IFwiIzQxNDI0NVwiLFxyXG4gICAgICAgIGZyaWN0aW9uOiAzLFxyXG4gICAgICAgIHJlZmxlY3Rpdml0eTogMTBcclxuICAgIH0sXHJcbiAgICBbVGlsZVR5cGUuU3RvbmUxXToge1xyXG4gICAgICAgIG5hbWU6ICdzdG9uZSB0aWVyIDEnLFxyXG4gICAgICAgIHRleHR1cmU6IFdvcmxkQXNzZXRzLm1pZGRsZWdyb3VuZC50aWxlc2V0X3N0b25lMSxcclxuICAgICAgICBjb25uZWN0ZWQ6IHRydWUsXHJcbiAgICAgICAgYW55Q29ubmVjdGlvbjogdHJ1ZSxcclxuICAgICAgICBjb2xvcjogXCIjMzEzMjNiXCIsXHJcbiAgICAgICAgZnJpY3Rpb246IDMsXHJcbiAgICAgICAgcmVmbGVjdGl2aXR5OiAxNVxyXG4gICAgfSxcclxuICAgIFtUaWxlVHlwZS5TdG9uZTJdOiB7XHJcbiAgICAgICAgbmFtZTogJ3N0b25lIHRpZXIgMicsXHJcbiAgICAgICAgdGV4dHVyZTogV29ybGRBc3NldHMubWlkZGxlZ3JvdW5kLnRpbGVzZXRfc3RvbmUyLFxyXG4gICAgICAgIGNvbm5lY3RlZDogdHJ1ZSxcclxuICAgICAgICBhbnlDb25uZWN0aW9uOiB0cnVlLFxyXG4gICAgICAgIGNvbG9yOiBcIiMzMTMyM2JcIiwvL1RPRE8gY2hhbmdlIHRoZXNlIGNvbG9ycyB0byBiZSBtb3JlIGFjY3VyYXRlXHJcbiAgICAgICAgZnJpY3Rpb246IDMsXHJcbiAgICAgICAgcmVmbGVjdGl2aXR5OiAxN1xyXG4gICAgfSxcclxuICAgIFtUaWxlVHlwZS5TdG9uZTNdOiB7XHJcbiAgICAgICAgbmFtZTogJ3N0b25lIHRpZXIgMycsXHJcbiAgICAgICAgdGV4dHVyZTogV29ybGRBc3NldHMubWlkZGxlZ3JvdW5kLnRpbGVzZXRfc3RvbmUzLFxyXG4gICAgICAgIGNvbm5lY3RlZDogdHJ1ZSxcclxuICAgICAgICBhbnlDb25uZWN0aW9uOiB0cnVlLFxyXG4gICAgICAgIGNvbG9yOiBcIiMzMTMyM2JcIixcclxuICAgICAgICBmcmljdGlvbjogMyxcclxuICAgICAgICByZWZsZWN0aXZpdHk6IDE5XHJcbiAgICB9LFxyXG4gICAgW1RpbGVUeXBlLlN0b25lNF06IHtcclxuICAgICAgICBuYW1lOiAnc3RvbmUgdGllciA0JyxcclxuICAgICAgICB0ZXh0dXJlOiBXb3JsZEFzc2V0cy5taWRkbGVncm91bmQudGlsZXNldF9zdG9uZTQsXHJcbiAgICAgICAgY29ubmVjdGVkOiB0cnVlLFxyXG4gICAgICAgIGFueUNvbm5lY3Rpb246IHRydWUsXHJcbiAgICAgICAgY29sb3I6IFwiIzMxMzIzYlwiLFxyXG4gICAgICAgIGZyaWN0aW9uOiAzLFxyXG4gICAgICAgIHJlZmxlY3Rpdml0eTogMjFcclxuICAgIH0sXHJcbiAgICBbVGlsZVR5cGUuU3RvbmU1XToge1xyXG4gICAgICAgIG5hbWU6ICdzdG9uZSB0aWVyIDUnLFxyXG4gICAgICAgIHRleHR1cmU6IFdvcmxkQXNzZXRzLm1pZGRsZWdyb3VuZC50aWxlc2V0X3N0b25lNSxcclxuICAgICAgICBjb25uZWN0ZWQ6IHRydWUsXHJcbiAgICAgICAgYW55Q29ubmVjdGlvbjogdHJ1ZSxcclxuICAgICAgICBjb2xvcjogXCIjMzEzMjNiXCIsXHJcbiAgICAgICAgZnJpY3Rpb246IDMsXHJcbiAgICAgICAgcmVmbGVjdGl2aXR5OiAyM1xyXG4gICAgfSxcclxuICAgIFtUaWxlVHlwZS5TdG9uZTZdOiB7XHJcbiAgICAgICAgbmFtZTogJ3N0b25lIHRpZXIgNicsXHJcbiAgICAgICAgdGV4dHVyZTogV29ybGRBc3NldHMubWlkZGxlZ3JvdW5kLnRpbGVzZXRfc3RvbmU2LFxyXG4gICAgICAgIGNvbm5lY3RlZDogdHJ1ZSxcclxuICAgICAgICBhbnlDb25uZWN0aW9uOiB0cnVlLFxyXG4gICAgICAgIGNvbG9yOiBcIiMzMTMyM2JcIixcclxuICAgICAgICBmcmljdGlvbjogMyxcclxuICAgICAgICByZWZsZWN0aXZpdHk6IDI1XHJcbiAgICB9LFxyXG4gICAgW1RpbGVUeXBlLlN0b25lN106IHtcclxuICAgICAgICBuYW1lOiAnc3RvbmUgdGllciA3JyxcclxuICAgICAgICB0ZXh0dXJlOiBXb3JsZEFzc2V0cy5taWRkbGVncm91bmQudGlsZXNldF9zdG9uZTcsXHJcbiAgICAgICAgY29ubmVjdGVkOiB0cnVlLFxyXG4gICAgICAgIGFueUNvbm5lY3Rpb246IHRydWUsXHJcbiAgICAgICAgY29sb3I6IFwiIzMxMzIzYlwiLFxyXG4gICAgICAgIGZyaWN0aW9uOiAzLFxyXG4gICAgICAgIHJlZmxlY3Rpdml0eTogMjdcclxuICAgIH0sXHJcbiAgICBbVGlsZVR5cGUuU3RvbmU4XToge1xyXG4gICAgICAgIG5hbWU6ICdzdG9uZSB0aWVyIDgnLFxyXG4gICAgICAgIHRleHR1cmU6IFdvcmxkQXNzZXRzLm1pZGRsZWdyb3VuZC50aWxlc2V0X3N0b25lOCxcclxuICAgICAgICBjb25uZWN0ZWQ6IHRydWUsXHJcbiAgICAgICAgYW55Q29ubmVjdGlvbjogdHJ1ZSxcclxuICAgICAgICBjb2xvcjogXCIjMzEzMjNiXCIsXHJcbiAgICAgICAgZnJpY3Rpb246IDMsXHJcbiAgICAgICAgcmVmbGVjdGl2aXR5OiAyOVxyXG4gICAgfSxcclxuICAgIFtUaWxlVHlwZS5TdG9uZTldOiB7XHJcbiAgICAgICAgbmFtZTogJ3N0b25lIHRpZXIgOScsXHJcbiAgICAgICAgdGV4dHVyZTogV29ybGRBc3NldHMubWlkZGxlZ3JvdW5kLnRpbGVzZXRfc3RvbmU5LFxyXG4gICAgICAgIGNvbm5lY3RlZDogdHJ1ZSxcclxuICAgICAgICBhbnlDb25uZWN0aW9uOiB0cnVlLFxyXG4gICAgICAgIGNvbG9yOiBcIiMzMTMyM2JcIixcclxuICAgICAgICBmcmljdGlvbjogMyxcclxuICAgICAgICByZWZsZWN0aXZpdHk6IDMxXHJcbiAgICB9LFxyXG4gICAgW1RpbGVUeXBlLlRpbl06IHtcclxuICAgICAgICBuYW1lOiAndGluIG9yZScsXHJcbiAgICAgICAgdGV4dHVyZTogV29ybGRBc3NldHMubWlkZGxlZ3JvdW5kLnRpbGVzZXRfdGluLFxyXG4gICAgICAgIGNvbm5lY3RlZDogdHJ1ZSxcclxuICAgICAgICBhbnlDb25uZWN0aW9uOiBmYWxzZSxcclxuICAgICAgICBjb2xvcjogXCIjMzEzMjNiXCIsXHJcbiAgICAgICAgZnJpY3Rpb246IDMsXHJcbiAgICAgICAgcmVmbGVjdGl2aXR5OiAxMFxyXG4gICAgfSxcclxuICAgIFtUaWxlVHlwZS5BbHVtaW51bV06IHtcclxuICAgICAgICBuYW1lOiAnYWx1bWludW0gb3JlJyxcclxuICAgICAgICB0ZXh0dXJlOiBXb3JsZEFzc2V0cy5taWRkbGVncm91bmQudGlsZXNldF9hbHVtaW51bSxcclxuICAgICAgICBjb25uZWN0ZWQ6IHRydWUsXHJcbiAgICAgICAgYW55Q29ubmVjdGlvbjogZmFsc2UsXHJcbiAgICAgICAgY29sb3I6IFwiIzMxMzIzYlwiLFxyXG4gICAgICAgIGZyaWN0aW9uOiAzLFxyXG4gICAgICAgIHJlZmxlY3Rpdml0eTogMTdcclxuICAgIH0sXHJcbiAgICBbVGlsZVR5cGUuR29sZF06IHtcclxuICAgICAgICBuYW1lOiAnZ29sZCBvcmUnLFxyXG4gICAgICAgIHRleHR1cmU6IFdvcmxkQXNzZXRzLm1pZGRsZWdyb3VuZC50aWxlc2V0X2dvbGQsXHJcbiAgICAgICAgY29ubmVjdGVkOiB0cnVlLFxyXG4gICAgICAgIGFueUNvbm5lY3Rpb246IGZhbHNlLFxyXG4gICAgICAgIGNvbG9yOiBcIiMzMTMyM2JcIixcclxuICAgICAgICBmcmljdGlvbjogMyxcclxuICAgICAgICByZWZsZWN0aXZpdHk6IDIxXHJcbiAgICB9LFxyXG4gICAgW1RpbGVUeXBlLlRpdGFuaXVtXToge1xyXG4gICAgICAgIG5hbWU6ICd0aXRhbml1bSBvcmUnLFxyXG4gICAgICAgIHRleHR1cmU6IFdvcmxkQXNzZXRzLm1pZGRsZWdyb3VuZC50aWxlc2V0X3RpdGFuaXVtLFxyXG4gICAgICAgIGNvbm5lY3RlZDogdHJ1ZSxcclxuICAgICAgICBhbnlDb25uZWN0aW9uOiBmYWxzZSxcclxuICAgICAgICBjb2xvcjogXCIjMzEzMjNiXCIsXHJcbiAgICAgICAgZnJpY3Rpb246IDMsXHJcbiAgICAgICAgcmVmbGVjdGl2aXR5OiAyNVxyXG4gICAgfSxcclxuICAgIFtUaWxlVHlwZS5HcmFwZV06IHtcclxuICAgICAgICBuYW1lOiAnZ3JhcGUgb3JlJyxcclxuICAgICAgICB0ZXh0dXJlOiBXb3JsZEFzc2V0cy5taWRkbGVncm91bmQudGlsZXNldF9ncmFwZSxcclxuICAgICAgICBjb25uZWN0ZWQ6IHRydWUsXHJcbiAgICAgICAgYW55Q29ubmVjdGlvbjogZmFsc2UsXHJcbiAgICAgICAgY29sb3I6IFwiIzMxMzIzYlwiLFxyXG4gICAgICAgIGZyaWN0aW9uOiAzLFxyXG4gICAgICAgIHJlZmxlY3Rpdml0eTogMjlcclxuICAgIH0sXHJcbiAgICBbVGlsZVR5cGUuV29vZDBdOiB7XHJcbiAgICAgICAgbmFtZTogJ3JhdyB3b29kJyxcclxuICAgICAgICB0ZXh0dXJlOiBXb3JsZEFzc2V0cy5taWRkbGVncm91bmQudGlsZXNldF93b29kMCxcclxuICAgICAgICBjb25uZWN0ZWQ6IGZhbHNlLFxyXG4gICAgICAgIGFueUNvbm5lY3Rpb246IHRydWUsXHJcbiAgICAgICAgY29sb3I6IFwiI2E3NzE0NVwiLFxyXG4gICAgICAgIGZyaWN0aW9uOiAzLFxyXG4gICAgICAgIHJlZmxlY3Rpdml0eTogNVxyXG4gICAgfSxcclxuICAgIFtUaWxlVHlwZS5Xb29kMV06IHtcclxuICAgICAgICBuYW1lOiAnd29vZCB0aWVyIDEnLFxyXG4gICAgICAgIHRleHR1cmU6IFdvcmxkQXNzZXRzLm1pZGRsZWdyb3VuZC50aWxlc2V0X3dvb2QxLFxyXG4gICAgICAgIGNvbm5lY3RlZDogdHJ1ZSxcclxuICAgICAgICBhbnlDb25uZWN0aW9uOiB0cnVlLFxyXG4gICAgICAgIGNvbG9yOiBcIiNhNzcxNDVcIixcclxuICAgICAgICBmcmljdGlvbjogMyxcclxuICAgICAgICByZWZsZWN0aXZpdHk6IDVcclxuICAgIH0sXHJcbiAgICBbVGlsZVR5cGUuV29vZDJdOiB7XHJcbiAgICAgICAgbmFtZTogJ3dvb2QgdGllciAyJyxcclxuICAgICAgICB0ZXh0dXJlOiBXb3JsZEFzc2V0cy5taWRkbGVncm91bmQudGlsZXNldF93b29kMixcclxuICAgICAgICBjb25uZWN0ZWQ6IHRydWUsXHJcbiAgICAgICAgYW55Q29ubmVjdGlvbjogdHJ1ZSxcclxuICAgICAgICBjb2xvcjogXCIjYTc3MTQ1XCIsXHJcbiAgICAgICAgZnJpY3Rpb246IDMsXHJcbiAgICAgICAgcmVmbGVjdGl2aXR5OiA1XHJcbiAgICB9LFxyXG4gICAgW1RpbGVUeXBlLldvb2QzXToge1xyXG4gICAgICAgIG5hbWU6ICd3b29kIHRpZXIgMycsXHJcbiAgICAgICAgdGV4dHVyZTogV29ybGRBc3NldHMubWlkZGxlZ3JvdW5kLnRpbGVzZXRfd29vZDMsXHJcbiAgICAgICAgY29ubmVjdGVkOiB0cnVlLFxyXG4gICAgICAgIGFueUNvbm5lY3Rpb246IHRydWUsXHJcbiAgICAgICAgY29sb3I6IFwiI2E3NzE0NVwiLFxyXG4gICAgICAgIGZyaWN0aW9uOiAzLFxyXG4gICAgICAgIHJlZmxlY3Rpdml0eTogNVxyXG4gICAgfSxcclxuICAgIFtUaWxlVHlwZS5Xb29kNF06IHtcclxuICAgICAgICBuYW1lOiAnd29vZCB0aWVyIDQnLFxyXG4gICAgICAgIHRleHR1cmU6IFdvcmxkQXNzZXRzLm1pZGRsZWdyb3VuZC50aWxlc2V0X3dvb2Q0LFxyXG4gICAgICAgIGNvbm5lY3RlZDogdHJ1ZSxcclxuICAgICAgICBhbnlDb25uZWN0aW9uOiB0cnVlLFxyXG4gICAgICAgIGNvbG9yOiBcIiNhNzcxNDVcIixcclxuICAgICAgICBmcmljdGlvbjogMyxcclxuICAgICAgICByZWZsZWN0aXZpdHk6IDVcclxuICAgIH0sXHJcbiAgICBbVGlsZVR5cGUuV29vZDVdOiB7XHJcbiAgICAgICAgbmFtZTogJ3dvb2QgdGllciA1JyxcclxuICAgICAgICB0ZXh0dXJlOiBXb3JsZEFzc2V0cy5taWRkbGVncm91bmQudGlsZXNldF93b29kNSxcclxuICAgICAgICBjb25uZWN0ZWQ6IHRydWUsXHJcbiAgICAgICAgYW55Q29ubmVjdGlvbjogdHJ1ZSxcclxuICAgICAgICBjb2xvcjogXCIjYTc3MTQ1XCIsXHJcbiAgICAgICAgZnJpY3Rpb246IDMsXHJcbiAgICAgICAgcmVmbGVjdGl2aXR5OiA1XHJcbiAgICB9LFxyXG4gICAgW1RpbGVUeXBlLldvb2Q2XToge1xyXG4gICAgICAgIG5hbWU6ICd3b29kIHRpZXIgNicsXHJcbiAgICAgICAgdGV4dHVyZTogV29ybGRBc3NldHMubWlkZGxlZ3JvdW5kLnRpbGVzZXRfd29vZDYsXHJcbiAgICAgICAgY29ubmVjdGVkOiB0cnVlLFxyXG4gICAgICAgIGFueUNvbm5lY3Rpb246IHRydWUsXHJcbiAgICAgICAgY29sb3I6IFwiI2E3NzE0NVwiLFxyXG4gICAgICAgIGZyaWN0aW9uOiAzLFxyXG4gICAgICAgIHJlZmxlY3Rpdml0eTogNVxyXG4gICAgfSxcclxuICAgIFtUaWxlVHlwZS5Xb29kN106IHtcclxuICAgICAgICBuYW1lOiAnd29vZCB0aWVyIDcnLFxyXG4gICAgICAgIHRleHR1cmU6IFdvcmxkQXNzZXRzLm1pZGRsZWdyb3VuZC50aWxlc2V0X3dvb2Q3LFxyXG4gICAgICAgIGNvbm5lY3RlZDogdHJ1ZSxcclxuICAgICAgICBhbnlDb25uZWN0aW9uOiB0cnVlLFxyXG4gICAgICAgIGNvbG9yOiBcIiNhNzcxNDVcIixcclxuICAgICAgICBmcmljdGlvbjogMyxcclxuICAgICAgICByZWZsZWN0aXZpdHk6IDVcclxuICAgIH0sXHJcbiAgICBbVGlsZVR5cGUuV29vZDhdOiB7XHJcbiAgICAgICAgbmFtZTogJ3dvb2QgdGllciA4JyxcclxuICAgICAgICB0ZXh0dXJlOiBXb3JsZEFzc2V0cy5taWRkbGVncm91bmQudGlsZXNldF93b29kOCxcclxuICAgICAgICBjb25uZWN0ZWQ6IHRydWUsXHJcbiAgICAgICAgYW55Q29ubmVjdGlvbjogdHJ1ZSxcclxuICAgICAgICBjb2xvcjogXCIjYTc3MTQ1XCIsXHJcbiAgICAgICAgZnJpY3Rpb246IDMsXHJcbiAgICAgICAgcmVmbGVjdGl2aXR5OiA1XHJcbiAgICB9LFxyXG4gICAgW1RpbGVUeXBlLldvb2Q5XToge1xyXG4gICAgICAgIG5hbWU6ICd3b29kIHRpZXIgOScsXHJcbiAgICAgICAgdGV4dHVyZTogV29ybGRBc3NldHMubWlkZGxlZ3JvdW5kLnRpbGVzZXRfd29vZDksXHJcbiAgICAgICAgY29ubmVjdGVkOiB0cnVlLFxyXG4gICAgICAgIGFueUNvbm5lY3Rpb246IHRydWUsXHJcbiAgICAgICAgY29sb3I6IFwiI2E3NzE0NVwiLFxyXG4gICAgICAgIGZyaWN0aW9uOiAzLFxyXG4gICAgICAgIHJlZmxlY3Rpdml0eTogNVxyXG4gICAgfSxcclxufTtcclxuXHJcbi8vIGV4cG9ydCBjb25zdCBUaWxlRW50aXRpZXNSZW5kZXJEYXRhOiBSZWNvcmQ8VGlsZUVudGl0aWVzLCBUaWxlRW50aXR5UmVuZGVyRGF0YT4gPSB7XHJcbiAgICAvLyBbVGlsZUVudGl0aWVzLlRpZXIxRHJpbGxdOiB7XHJcbiAgICAgICAgLy8gdGV4dHVyZTogdW5kZWZpbmVkXHJcbiAgICAvLyB9LFxyXG4gICAgLy8gW1RpbGVFbnRpdGllcy5UaWVyMkRyaWxsXToge1xyXG4gICAgICAgIC8vIHRleHR1cmU6IHVuZGVmaW5lZFxyXG4gICAgLy8gfVxyXG4vLyB9IiwiaW1wb3J0IHsgZ2FtZSB9IGZyb20gXCIuLi8uLi9HYW1lXCI7XHJcbmltcG9ydCBTaW1wbGV4Tm9pc2UgZnJvbSBcInNpbXBsZXgtbm9pc2VcIjtcclxuaW1wb3J0IHsgSW1hZ2VSZXNvdXJjZSB9IGZyb20gXCIuLi8uLi9hc3NldHMvcmVzb3VyY2VzL0ltYWdlUmVzb3VyY2VcIjtcclxuaW1wb3J0IHsgV29ybGRBc3NldHMgfSBmcm9tIFwiLi4vLi4vYXNzZXRzL0Fzc2V0c1wiO1xyXG5pbXBvcnQgcDUgZnJvbSAncDUnXHJcblxyXG5leHBvcnQgY2xhc3MgQ2xvdWQge1xyXG4gICAgeDogbnVtYmVyO1xyXG4gICAgeTogbnVtYmVyO1xyXG4gICAgeFZlbDogbnVtYmVyO1xyXG4gICAgaW1hZ2U6IEltYWdlUmVzb3VyY2VcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgdGhpcy54VmVsID0gTWF0aC5yYW5kb20oKSowLjA3KzAuMDU7XHJcbiAgICAgICAgdGhpcy55ID0geTtcclxuICAgICAgICB0aGlzLmltYWdlID0gV29ybGRBc3NldHMuY2xvdWRzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIFdvcmxkQXNzZXRzLmNsb3Vkcy5sZW5ndGgpXVxyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcih0YXJnZXQ6IHA1LCB1cHNjYWxlU2l6ZTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgY29uc29sZS5sb2coYHg6ICR7dGhpcy54fSwgeTogJHt0aGlzLnl9YCk7XHJcbiAgICAgICAgLy9kcmF3IGEgY2xvdWQgYXQgdGhlIHBsYWNlIDpvXHJcbiAgICAgICAgdGhpcy5pbWFnZS5yZW5kZXIoXHJcbiAgICAgICAgICAgIHRhcmdldCxcclxuICAgICAgICAgICAgKHRoaXMueCAqIGdhbWUuVElMRV9XSURUSCAtXHJcbiAgICAgICAgICAgICAgICBnYW1lLmludGVycG9sYXRlZENhbVggKiBnYW1lLlRJTEVfV0lEVEgpICpcclxuICAgICAgICAgICAgdXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgICh0aGlzLnkgKiBnYW1lLlRJTEVfSEVJR0hUIC1cclxuICAgICAgICAgICAgICAgIGdhbWUuaW50ZXJwb2xhdGVkQ2FtWSAqIGdhbWUuVElMRV9IRUlHSFQpICpcclxuICAgICAgICAgICAgdXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2UuaW1hZ2Uud2lkdGggKiB1cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgdGhpcy5pbWFnZS5pbWFnZS5oZWlnaHQgKiB1cHNjYWxlU2l6ZVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgdGljaygpIHtcclxuICAgICAgICB0aGlzLnggKz0gdGhpcy54VmVsO1xyXG4gICAgICAgIGxldCBuID0gKChnYW1lLndpZHRoL2dhbWUudXBzY2FsZVNpemUrNTApL2dhbWUuVElMRV9XSURUSCk7XHJcbiAgICAgICAgbGV0IHggPSB0aGlzLngtZ2FtZS5pbnRlcnBvbGF0ZWRDYW1YICsgNTAvZ2FtZS5USUxFX1dJRFRIO1xyXG4gICAgICAgIHRoaXMueCA9IG1vZCh4LCBuKStnYW1lLmludGVycG9sYXRlZENhbVggLSA1MC9nYW1lLlRJTEVfV0lEVEg7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5mdW5jdGlvbiBtb2QoeDE6IG51bWJlciwgeDI6IG51bWJlcikge1xyXG4gICAgcmV0dXJuICgoeDEgJSB4MikgKyB4MikgJSB4MjtcclxufSIsImltcG9ydCB7IEVudGl0aWVzIH0gZnJvbSAnLi4vLi4vLi4vZ2xvYmFsL0VudGl0eSc7XHJcbmltcG9ydCB7IFBsYXllckVudGl0eSB9IGZyb20gJy4vUGxheWVyRW50aXR5JztcclxuaW1wb3J0IHsgSXRlbUVudGl0eSB9IGZyb20gJy4vSXRlbUVudGl0eSc7XHJcblxyXG5leHBvcnQgY29uc3QgRW50aXR5Q2xhc3NlczogUmVjb3JkPEVudGl0aWVzLCBhbnk+ID0ge1xyXG4gICAgW0VudGl0aWVzLkxvY2FsUGxheWVyXTogdW5kZWZpbmVkLFxyXG4gICAgW0VudGl0aWVzLlBsYXllcl06IFBsYXllckVudGl0eSxcclxuICAgIFtFbnRpdGllcy5JdGVtXTogSXRlbUVudGl0eSxcclxufTtcclxuIiwiaW1wb3J0IHA1IGZyb20gJ3A1JztcclxuaW1wb3J0IHsgU2VydmVyRW50aXR5IH0gZnJvbSAnLi9TZXJ2ZXJFbnRpdHknO1xyXG5pbXBvcnQgeyBFbnRpdGllcywgRW50aXR5UGF5bG9hZCB9IGZyb20gJy4uLy4uLy4uL2dsb2JhbC9FbnRpdHknO1xyXG5pbXBvcnQgeyBJdGVtcywgSXRlbVR5cGUgfSBmcm9tICcuLi8uLi8uLi9nbG9iYWwvSW52ZW50b3J5JztcclxuaW1wb3J0IHsgSXRlbUFzc2V0cyB9IGZyb20gJy4uLy4uL2Fzc2V0cy9Bc3NldHMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEl0ZW1FbnRpdHkgZXh0ZW5kcyBTZXJ2ZXJFbnRpdHkge1xyXG4gICAgaXRlbTogSXRlbVR5cGU7XHJcblxyXG4gICAgY29uc3RydWN0b3IocGF5bG9hZDogRW50aXR5UGF5bG9hZDxFbnRpdGllcy5JdGVtPikge1xyXG4gICAgICAgIHN1cGVyKHBheWxvYWQuaWQpO1xyXG5cclxuICAgICAgICB0aGlzLml0ZW0gPSBwYXlsb2FkLmRhdGEuaXRlbTtcclxuICAgICAgICB0aGlzLnggPSBwYXlsb2FkLmRhdGEueDtcclxuICAgICAgICB0aGlzLnkgPSBwYXlsb2FkLmRhdGEueTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIodGFyZ2V0OiBwNSwgdXBzY2FsZVNpemU6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IGFzc2V0ID0gSXRlbUFzc2V0c1t0aGlzLml0ZW1dO1xyXG4gICAgICAgIGlmIChhc3NldCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGFzc2V0LnJlbmRlcih0YXJnZXQsIHRoaXMueCwgdGhpcy55LCA4LCA4KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlRGF0YShkYXRhOiBFbnRpdHlQYXlsb2FkPEVudGl0aWVzLkl0ZW0+KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5pdGVtID0gZGF0YS5kYXRhLml0ZW07XHJcbiAgICAgICAgdGhpcy54ID0gZGF0YS5kYXRhLng7XHJcbiAgICAgICAgdGhpcy55ID0gZGF0YS5kYXRhLnk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHA1IGZyb20gJ3A1JztcclxuaW1wb3J0IHsgU2VydmVyRW50aXR5IH0gZnJvbSAnLi9TZXJ2ZXJFbnRpdHknO1xyXG5pbXBvcnQgeyBFbnRpdGllcywgRW50aXR5UGF5bG9hZCB9IGZyb20gJy4uLy4uLy4uL2dsb2JhbC9FbnRpdHknO1xyXG5pbXBvcnQgeyBnYW1lIH0gZnJvbSAnLi4vLi4vR2FtZSc7XHJcbmltcG9ydCB7IEFuaW1hdGlvbkZyYW1lLCBQbGF5ZXJBbmltYXRpb25zIH0gZnJvbSAnLi4vLi4vYXNzZXRzL0Fzc2V0cyc7XHJcbmltcG9ydCB7IFJlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZSB9IGZyb20gJy4uLy4uL2Fzc2V0cy9yZXNvdXJjZXMvUmVmbGVjdGVkSW1hZ2VSZXNvdXJjZSc7XHJcblxyXG5leHBvcnQgY2xhc3MgUGxheWVyRW50aXR5IGV4dGVuZHMgU2VydmVyRW50aXR5IHtcclxuICAgIHdpZHRoOiBudW1iZXIgPSAxMiAvIGdhbWUuVElMRV9XSURUSDtcclxuICAgIGhlaWdodDogbnVtYmVyID0gMjggLyBnYW1lLlRJTEVfSEVJR0hUO1xyXG4gICAgbmFtZTogc3RyaW5nO1xyXG4gICAgaWROdW1iZXI6IG51bWJlcjtcclxuICAgIGNvbG9yMTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl1cclxuICAgIGNvbG9yMjogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl1cclxuICAgIGN1cnJlbnRBbmltYXRpb246IEFuaW1hdGlvbkZyYW1lPHR5cGVvZiBQbGF5ZXJBbmltYXRpb25zPiA9IFwiaWRsZVwiXHJcbiAgICB0aW1lSW5UaGlzQW5pbWF0aW9uRnJhbWU6IG51bWJlciA9IDA7XHJcbiAgICBhbmltRnJhbWU6IG51bWJlciA9IDA7XHJcblxyXG4gICAgXHJcbiAgICBhbmltYXRpb25zOiB7XHJcbiAgICAgICAgW2tleTogc3RyaW5nXTogW1JlZmxlY3RhYmxlSW1hZ2VSZXNvdXJjZSwgbnVtYmVyXVtdLFxyXG4gICAgfSA9IHt9O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGRhdGE6IEVudGl0eVBheWxvYWQpIHtcclxuICAgICAgICBzdXBlcihkYXRhLmlkKTtcclxuICAgICAgICBpZiAoZGF0YS50eXBlID09PSBFbnRpdGllcy5QbGF5ZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5uYW1lID0gZGF0YS5kYXRhLm5hbWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRhdGEuaWQgPSBkYXRhLmlkLnNwbGl0KFwiLVwiKS5qb2luKFwiXCIpOy8vc3RyaW5nLnByb3RvdHlwZS5yZXBsYWNlQWxsIHJlcXVpcmVzIEVTMjAyMVxyXG4gICAgICAgIHRoaXMuaWROdW1iZXIgPSAoTnVtYmVyKFwiMHhcIitkYXRhLmlkKS8xMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDApJTE7Ly9nZXQgYSBudW1iZXIgMC0xIHBzZXVkb3JhbmRvbWx5IHNlbGVjdGVkIGZyb20gdGhlIHV1aWQgb2YgdGhlIHBsYXllclxyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuaWROdW1iZXIpO1xyXG4gICAgICAgIHRoaXMuY29sb3IxID0gaHNsVG9SZ2IodGhpcy5pZE51bWJlciwgMSwgMC40NSk7Ly9jb252ZXJ0IHRoaXMgdG8gdHdvIEhTTCBjb2xvcnMgd2hpY2ggYXJlIHRoZW4gY29udmVydGVkIHRvIHR3byBSR0IgY29sb3JzOiBvbmUgbGlnaHQgYW5kIG9uZSBkYXJrXHJcbiAgICAgICAgdGhpcy5jb2xvcjIgPSBoc2xUb1JnYih0aGlzLmlkTnVtYmVyLCAxLCAwLjMpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBjcmVhdGluZyBhbmltYXRpb25zIGZvciBwbGF5ZXIgd2l0aCBjb2xvcnMgJHt0aGlzLmNvbG9yMX0gYW5kICR7dGhpcy5jb2xvcjJ9YClcclxuICAgICAgICAvL2NvbnNvbGUubG9nKFwiVEVTVDogXCIrKHRoaXMuYW5pbWF0aW9ucy5pZGxlWzBdWzBdLmltYWdlPT09UGxheWVyQW5pbWF0aW9ucy5pZGxlWzBdWzBdLmltYWdlKSlcclxuICAgICAgICAvLyBsZXQgaW1nID0gdGhpcy5hbmltYXRpb25zLmlkbGVbMF1bMF0uaW1hZ2U7XHJcbiAgICAgICAgLy8gaW1nLmxvYWRQaXhlbHMoKTtcclxuICAgICAgICAvLyBpbWcuc2V0KDMsIDEwLCBbMCwgMjU1LCAwLCAyNTVdKTtcclxuICAgICAgICAvLyBpbWcudXBkYXRlUGl4ZWxzKCk7XHJcbiAgICAgICAgT2JqZWN0LmVudHJpZXMoUGxheWVyQW5pbWF0aW9ucykuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICAgICAgdGhpcy5hbmltYXRpb25zW2VsZW1lbnRbMF1dID0gW107XHJcbiAgICAgICAgICAgIGZvcihsZXQgZnJhbWUgb2YgZWxlbWVudFsxXSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hbmltYXRpb25zW2VsZW1lbnRbMF1dLnB1c2goW25ldyBSZWZsZWN0YWJsZUltYWdlUmVzb3VyY2UoZnJhbWVbMF0ucGF0aCwgdGhpcy5jb2xvcjEsIHRoaXMuY29sb3IyKSwgZnJhbWVbMV1dKTtcclxuICAgICAgICAgICAgICAgIGxldCByZWZsZWN0YWJsZVJlc291cmNlID0gdGhpcy5hbmltYXRpb25zW2VsZW1lbnRbMF1dW3RoaXMuYW5pbWF0aW9uc1tlbGVtZW50WzBdXS5sZW5ndGgtMV1bMF07XHJcbiAgICAgICAgICAgICAgICByZWZsZWN0YWJsZVJlc291cmNlLmxvYWRSZXNvdXJjZShnYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZURhdGEoZGF0YTogRW50aXR5UGF5bG9hZCk6IHZvaWQge1xyXG4gICAgICAgIGlmIChkYXRhLnR5cGUgPT09IEVudGl0aWVzLlBsYXllcikge1xyXG4gICAgICAgICAgICB0aGlzLm5hbWUgPSBkYXRhLmRhdGEubmFtZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKHRhcmdldDogcDUsIHVwc2NhbGVTaXplOiBudW1iZXIpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgLy91cGRhdGUgYW5pbWF0aW9uIGZyYW1lIGJhc2VkIG9uIGRlbHRhVGltZVxyXG4gICAgICAgIHRoaXMudGltZUluVGhpc0FuaW1hdGlvbkZyYW1lICs9IGdhbWUuZGVsdGFUaW1lO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuYW5pbUZyYW1lKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhbdGhpcy5jdXJyZW50QW5pbWF0aW9uLCB0aGlzLmFuaW1GcmFtZV0pO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFBsYXllckFuaW1hdGlvbnNbdGhpcy5jdXJyZW50QW5pbWF0aW9uXSlcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhQbGF5ZXJBbmltYXRpb25zW3RoaXMuY3VycmVudEFuaW1hdGlvbl1bdGhpcy5hbmltRnJhbWVdKVxyXG4gICAgICAgIGlmKHRoaXMudGltZUluVGhpc0FuaW1hdGlvbkZyYW1lPlBsYXllckFuaW1hdGlvbnNbdGhpcy5jdXJyZW50QW5pbWF0aW9uXVt0aGlzLmFuaW1GcmFtZV1bMV0pIHtcclxuICAgICAgICAgICAgdGhpcy50aW1lSW5UaGlzQW5pbWF0aW9uRnJhbWUgPSAwOy8vdGhpcyBkb2VzIGludHJvZHVjZSBzb21lIHNsaWdodCBpbmFjY3VyYWNpZXMgdnMgc3VidHJhY3RpbmcgaXQsIGJ1dCwgd2hlbiB5b3UgdGFiIGJhY2sgaW50byB0aGUgYnJvd3NlciBhZnRlciBiZWluZyB0YWJiZWQgb3V0LCBzdWJ0cmFjdGluZyBpdCBjYXVzZXMgc3BhenppbmdcclxuICAgICAgICAgICAgdGhpcy5hbmltRnJhbWUrKztcclxuICAgICAgICAgICAgaWYodGhpcy5hbmltRnJhbWU+PVBsYXllckFuaW1hdGlvbnNbdGhpcy5jdXJyZW50QW5pbWF0aW9uXS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYW5pbUZyYW1lID0gdGhpcy5hbmltRnJhbWUlUGxheWVyQW5pbWF0aW9uc1t0aGlzLmN1cnJlbnRBbmltYXRpb25dLmxlbmd0aDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9QbGF5ZXJBXHJcbiAgICAgICAgLy8gUmVuZGVyIHRoZSBpdGVtIHF1YW50aXR5IGxhYmVsXHJcbiAgICAgICAgdGhpcy5hbmltYXRpb25zW3RoaXMuY3VycmVudEFuaW1hdGlvbl1bdGhpcy5hbmltRnJhbWVdWzBdLnJlbmRlcihcclxuICAgICAgICAgICAgdGFyZ2V0LFxyXG4gICAgICAgICAgICAodGhpcy54ICogZ2FtZS5USUxFX1dJRFRIIC1cclxuICAgICAgICAgICAgICAgIGdhbWUuaW50ZXJwb2xhdGVkQ2FtWCAqIGdhbWUuVElMRV9XSURUSCkgKlxyXG4gICAgICAgICAgICAgICAgdXBzY2FsZVNpemUsXHJcbiAgICAgICAgICAgICh0aGlzLnkgKiBnYW1lLlRJTEVfSEVJR0hUIC1cclxuICAgICAgICAgICAgICAgIGdhbWUuaW50ZXJwb2xhdGVkQ2FtWSAqIGdhbWUuVElMRV9IRUlHSFQpICpcclxuICAgICAgICAgICAgICAgIHVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICB0aGlzLndpZHRoICogdXBzY2FsZVNpemUgKiBnYW1lLlRJTEVfV0lEVEgsXHJcbiAgICAgICAgICAgIHRoaXMuaGVpZ2h0ICogdXBzY2FsZVNpemUgKiBnYW1lLlRJTEVfSEVJR0hUXHJcbiAgICAgICAgKTtcclxuICAgICAgICB0aGlzLmFuaW1hdGlvbnNbdGhpcy5jdXJyZW50QW5pbWF0aW9uXVt0aGlzLmFuaW1GcmFtZV1bMF0ucmVuZGVyV29ybGRzcGFjZVJlZmxlY3Rpb24oXHJcbiAgICAgICAgICAgIHRoaXMueCxcclxuICAgICAgICAgICAgdGhpcy55K3RoaXMuaGVpZ2h0LFxyXG4gICAgICAgICAgICB0aGlzLndpZHRoLFxyXG4gICAgICAgICAgICB0aGlzLmhlaWdodFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHRhcmdldC5ub1N0cm9rZSgpO1xyXG5cclxuICAgICAgICB0YXJnZXQudGV4dFNpemUoNSAqIHVwc2NhbGVTaXplKTtcclxuICAgICAgICB0YXJnZXQudGV4dEFsaWduKHRhcmdldC5DRU5URVIsIHRhcmdldC5UT1ApO1xyXG5cclxuICAgICAgICB0YXJnZXQudGV4dChcclxuICAgICAgICAgICAgdGhpcy5uYW1lK1wiLCB0ZXN0OiBcIit0aGlzLmFuaW1hdGlvbnMuaWRsZVswXVswXS5pbWFnZS5nZXQoMywgMTApLFxyXG4gICAgICAgICAgICAodGhpcy54ICogZ2FtZS5USUxFX1dJRFRIIC1cclxuICAgICAgICAgICAgICAgIGdhbWUuaW50ZXJwb2xhdGVkQ2FtWCAqIGdhbWUuVElMRV9XSURUSCArXHJcbiAgICAgICAgICAgICAgICAodGhpcy53aWR0aCAqIGdhbWUuVElMRV9XSURUSCkgLyAyKSAqXHJcbiAgICAgICAgICAgICAgICB1cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgKHRoaXMueSAqIGdhbWUuVElMRV9IRUlHSFQgLVxyXG4gICAgICAgICAgICAgICAgZ2FtZS5pbnRlcnBvbGF0ZWRDYW1ZICogZ2FtZS5USUxFX0hFSUdIVCAtXHJcbiAgICAgICAgICAgICAgICAodGhpcy5oZWlnaHQgKiBnYW1lLlRJTEVfV0lEVEgpIC8gMi41KSAqXHJcbiAgICAgICAgICAgICAgICB1cHNjYWxlU2l6ZVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBoc2xUb1JnYihoOiBudW1iZXIsIHM6IG51bWJlciwgbDogbnVtYmVyKTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl17XHJcbiAgICB2YXIgciwgZywgYjtcclxuXHJcbiAgICBpZihzID09IDApe1xyXG4gICAgICAgIHIgPSBnID0gYiA9IGw7IC8vIGFjaHJvbWF0aWNcclxuICAgIH1lbHNle1xyXG4gICAgICAgIHZhciBodWUycmdiID0gZnVuY3Rpb24gaHVlMnJnYihwOiBudW1iZXIsIHE6IG51bWJlciwgdDogbnVtYmVyKXtcclxuICAgICAgICAgICAgaWYodCA8IDApIHQgKz0gMTtcclxuICAgICAgICAgICAgaWYodCA+IDEpIHQgLT0gMTtcclxuICAgICAgICAgICAgaWYodCA8IDEvNikgcmV0dXJuIHAgKyAocSAtIHApICogNiAqIHQ7XHJcbiAgICAgICAgICAgIGlmKHQgPCAxLzIpIHJldHVybiBxO1xyXG4gICAgICAgICAgICBpZih0IDwgMi8zKSByZXR1cm4gcCArIChxIC0gcCkgKiAoMi8zIC0gdCkgKiA2O1xyXG4gICAgICAgICAgICByZXR1cm4gcDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBxID0gbCA8IDAuNSA/IGwgKiAoMSArIHMpIDogbCArIHMgLSBsICogcztcclxuICAgICAgICB2YXIgcCA9IDIgKiBsIC0gcTtcclxuICAgICAgICByID0gaHVlMnJnYihwLCBxLCBoICsgMS8zKTtcclxuICAgICAgICBnID0gaHVlMnJnYihwLCBxLCBoKTtcclxuICAgICAgICBiID0gaHVlMnJnYihwLCBxLCBoIC0gMS8zKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gW01hdGgucm91bmQociAqIDI1NSksIE1hdGgucm91bmQoZyAqIDI1NSksIE1hdGgucm91bmQoYiAqIDI1NSksIDI1NV07XHJcbn0iLCJpbXBvcnQgcDUgZnJvbSAncDUnO1xyXG5pbXBvcnQgeyBSZW5kZXJhYmxlIH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9SZW5kZXJhYmxlJztcclxuaW1wb3J0IHsgRW50aXR5UGF5bG9hZCB9IGZyb20gJy4uLy4uLy4uL2dsb2JhbC9FbnRpdHknO1xyXG5cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFNlcnZlckVudGl0eSBpbXBsZW1lbnRzIFJlbmRlcmFibGUge1xyXG4gICAgZW50aXR5SWQ6IHN0cmluZztcclxuXHJcbiAgICB4OiBudW1iZXIgPSAwO1xyXG4gICAgeTogbnVtYmVyID0gMDtcclxuXHJcbiAgICBwcm90ZWN0ZWQgY29uc3RydWN0b3IoZW50aXR5SWQ6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuZW50aXR5SWQgPSBlbnRpdHlJZDtcclxuICAgIH1cclxuXHJcbiAgICBhYnN0cmFjdCB1cGRhdGVEYXRhKGRhdGE6IEVudGl0eVBheWxvYWQpOiB2b2lkO1xyXG5cclxuICAgIGFic3RyYWN0IHJlbmRlcih0YXJnZXQ6IHA1LCB1cHNjYWxlU2l6ZTogbnVtYmVyKTogdm9pZDtcclxufVxyXG4iLCJleHBvcnQgY2xhc3MgQ2xpZW50VGlsZUVudGl0eSB7XHJcbiAgICBjb3ZlcmVkVGlsZXM6IG51bWJlcltdXHJcbiAgICBpZDogc3RyaW5nXHJcbiAgICB0eXBlXzogbnVtYmVyXHJcbiAgICBkYXRhOiBvYmplY3RcclxuICAgIGFuaW1GcmFtZTogbnVtYmVyXHJcbiAgICBhbmltYXRlOiBib29sZWFuXHJcbn1cclxuZXhwb3J0IGNvbnN0IFRpbGVFbnRpdHlBbmltYXRpb25zID0gW1xyXG4gICAgZmFsc2UsLy90cmVlXHJcblx0dHJ1ZSwvL2RyaWxsXHJcblx0dHJ1ZSwvL2RyaWxsXHJcblx0dHJ1ZSwvL2RyaWxsXHJcblx0dHJ1ZSwvL2RyaWxsXHJcblx0dHJ1ZSwvL2RyaWxsXHJcblx0ZmFsc2UsLy9jcmFmdGluZyBiZW5jaFxyXG5cdGZhbHNlLC8vcGxhbnRlZCBzZWVkXHJcbl0iLCJpbXBvcnQgeyBnYW1lIH0gZnJvbSBcIi4uLy4uL0dhbWVcIjtcclxuaW1wb3J0IHsgUGFydGljbGUgfSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9QYXJ0aWNsZVwiO1xyXG5pbXBvcnQgU2ltcGxleE5vaXNlIGZyb20gXCJzaW1wbGV4LW5vaXNlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQ29sb3JQYXJ0aWNsZSBpbXBsZW1lbnRzIFBhcnRpY2xlIHtcclxuICAgIGNvbG9yOiBzdHJpbmdcclxuICAgIHg6IG51bWJlcjtcclxuICAgIHk6IG51bWJlcjtcclxuICAgIHNpemU6IG51bWJlcjtcclxuICAgIHhWZWw6IG51bWJlcjtcclxuICAgIHlWZWw6IG51bWJlcjtcclxuICAgIGdyYXZpdHk6IGJvb2xlYW47XHJcbiAgICB3aW5kOiBib29sZWFuO1xyXG4gICAgYWdlOiBudW1iZXI7XHJcbiAgICBsaWZlc3BhbjogbnVtYmVyO1xyXG4gICAgbm9pc2U6IFNpbXBsZXhOb2lzZVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKGNvbG9yOiBzdHJpbmcsIHNpemU6IG51bWJlciwgbGlmZXNwYW46IG51bWJlciwgeDogbnVtYmVyLCB5OiBudW1iZXIsIHhWZWw/OiBudW1iZXIsIHlWZWw/OiBudW1iZXIsIGdyYXZpdHk/OiBib29sZWFuLCB3aW5kPzogYm9vbGVhbikge1xyXG4gICAgICAgIHRoaXMuY29sb3IgPSBjb2xvcjtcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICAgICAgdGhpcy54VmVsID0geFZlbCB8fCAwO1xyXG4gICAgICAgIHRoaXMueVZlbCA9IHlWZWwgfHwgMDtcclxuICAgICAgICB0aGlzLnNpemUgPSBzaXplO1xyXG4gICAgICAgIHRoaXMuZ3Jhdml0eSA9IHRydWU7Ly91c2luZyB0aGUgb3IgbW9kaWZpZXIgd2l0aCBib29sZWFucyBjYXVzZXMgYnVnczsgdGhlcmUncyBwcm9iYWJseSBhIGJldHRlciB3YXkgdG8gZG8gdGhpc1xyXG4gICAgICAgIGlmIChncmF2aXR5ICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHRoaXMuZ3Jhdml0eSA9IGdyYXZpdHk7XHJcblxyXG4gICAgICAgIHRoaXMud2luZCA9IGZhbHNlOy8vdXNpbmcgdGhlIG9yIG1vZGlmaWVyIHdpdGggYm9vbGVhbnMgY2F1c2VzIGJ1Z3M7IHRoZXJlJ3MgcHJvYmFibHkgYSBiZXR0ZXIgd2F5IHRvIGRvIHRoaXNcclxuICAgICAgICBpZiAod2luZCAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB0aGlzLndpbmQgPSB3aW5kO1xyXG4gICAgICAgIHRoaXMuYWdlID0gMDtcclxuICAgICAgICB0aGlzLmxpZmVzcGFuID0gbGlmZXNwYW47XHJcbiAgICAgICAgdGhpcy5ub2lzZSA9IG5ldyBTaW1wbGV4Tm9pc2UoXCJhc2RmYXNkZmFzZGZhc1wiKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIodGFyZ2V0OiBpbXBvcnQoXCJwNVwiKSwgdXBzY2FsZVNpemU6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLmFnZSAvIHRoaXMubGlmZXNwYW4gPCAwLjgpIHsvL2lmIGl0J3MgdW5kZXIgODAlIG9mIHRoZSBwYXJ0aWNsZSdzIGxpZmVzcGFuLCBkcmF3IG5vcm1hbGx5IHdpdGhvdXQgZmFkZVxyXG4gICAgICAgICAgICB0YXJnZXQuZmlsbCh0aGlzLmNvbG9yKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7Ly90aGlzIG1lYW5zIHRoYXQgdGhlIHBhcnRpY2xlIGlzIGFsbW9zdCBnb2luZyB0byBiZSBkZWxldGVkLCBzbyBmYWRpbmcgaXMgbmVjZXNzYXJ5XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbG9yLmxlbmd0aCA9PT0gNykgey8vaWYgdGhlcmUgaXMgbm8gdHJhbnNwYXJlbmN5IGJ5IGRlZmF1bHQsIGp1c3QgbWFwIHRoZSB0aGluZ3NcclxuICAgICAgICAgICAgICAgIGxldCB0cmFuc3BhcmVuY3lTdHJpbmcgPSBNYXRoLnJvdW5kKDI1NSAqICgtNSAqICh0aGlzLmFnZSAvIHRoaXMubGlmZXNwYW4pICsgNSkpLnRvU3RyaW5nKDE2KS5zdWJzdHJpbmcoMCwgMik7XHJcbiAgICAgICAgICAgICAgICBpZiAodHJhbnNwYXJlbmN5U3RyaW5nPT09dW5kZWZpbmVkIHx8IHRyYW5zcGFyZW5jeVN0cmluZy5sZW5ndGg9PT11bmRlZmluZWQpLy9jYXRjaCB3aGF0IGNvdWxkIGJlIGFuIGluZmluaXRlIGxvb3Agb3IganVzdCBhbiBlcnJvclxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcclxuICAgICAgICAgICAgICAgICAgICAgICAgYHVuZGVmaW5lZCB0cmFuc3BhcmVuY3kgc3RyaW5nIG9uIHBhcnRpY2xlYFxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSh0cmFuc3BhcmVuY3lTdHJpbmcubGVuZ3RoPDIpIHsvL21ha2Ugc3VyZSBpdCdzIDIgY2hhcmFjdGVycyBsb25nOyB0aGlzIHN0b3BzIHRoZSBjb21wdXRlciBmcm9tIGludGVycHJldGluZyAjZmYgZmYgZmYgNSBhcyAjZmYgZmYgZmYgNTUgaW5zdGVhZCBvZiAjZmYgZmYgZmYgMDVcclxuICAgICAgICAgICAgICAgICAgICB0cmFuc3BhcmVuY3lTdHJpbmcgPSBcIjBcIit0cmFuc3BhcmVuY3lTdHJpbmc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQuZmlsbCh0aGlzLmNvbG9yLnN1YnN0cmluZygwLCA3KSArIHRyYW5zcGFyZW5jeVN0cmluZyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7Ly9pZiB0aGVyZSBpcyB0cmFuc3BhcmVuY3ksIG11bHRpcGx5XHJcbiAgICAgICAgICAgICAgICBsZXQgdHJhbnNwYXJlbmN5U3RyaW5nID0gTWF0aC5yb3VuZChwYXJzZUludCh0aGlzLmNvbG9yLnN1YnN0cmluZyg3LCA5KSwgMTYpICogKC01ICogKHRoaXMuYWdlIC8gdGhpcy5saWZlc3BhbikgKyA1KSkudG9TdHJpbmcoMTYpLnN1YnN0cmluZygwLCAyKTtcclxuICAgICAgICAgICAgICAgIGlmICh0cmFuc3BhcmVuY3lTdHJpbmc9PT11bmRlZmluZWQgfHwgdHJhbnNwYXJlbmN5U3RyaW5nLmxlbmd0aD09PXVuZGVmaW5lZCkvL2NhdGNoIHdoYXQgY291bGQgYmUgYW4gaW5maW5pdGUgbG9vcCBvciBqdXN0IGFuIGVycm9yXHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBgdW5kZWZpbmVkIHRyYW5zcGFyZW5jeSBzdHJpbmcgb24gcGFydGljbGVgXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIHdoaWxlKHRyYW5zcGFyZW5jeVN0cmluZy5sZW5ndGg8Mikgey8vbWFrZSBzdXJlIGl0J3MgMiBjaGFyYWN0ZXJzIGxvbmc7IHRoaXMgc3RvcHMgdGhlIGNvbXB1dGVyIGZyb20gaW50ZXJwcmV0aW5nICNmZiBmZiBmZiA1IGFzICNmZiBmZiBmZiA1NSBpbnN0ZWFkIG9mICNmZiBmZiBmZiAwNVxyXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zcGFyZW5jeVN0cmluZyA9IFwiMFwiK3RyYW5zcGFyZW5jeVN0cmluZztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRhcmdldC5maWxsKHRoaXMuY29sb3Iuc3Vic3RyaW5nKDAsIDcpICsgdHJhbnNwYXJlbmN5U3RyaW5nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvL2RyYXcgYSByZWN0YW5nbGUgY2VudGVyZWQgb24gdGhlIHggYW5kIHkgcG9zaXRpb24gZmlsbGVkIHdpdGggdGhlIGNvbG9yIG9mIHRoZSBvYmplY3RcclxuICAgICAgICB0YXJnZXQucmVjdChcclxuICAgICAgICAgICAgKC10aGlzLnNpemUgLyAyICsgdGhpcy54ICogZ2FtZS5USUxFX1dJRFRIIC1cclxuICAgICAgICAgICAgICAgIGdhbWUuaW50ZXJwb2xhdGVkQ2FtWCAqIGdhbWUuVElMRV9XSURUSCkgKlxyXG4gICAgICAgICAgICB1cHNjYWxlU2l6ZSxcclxuICAgICAgICAgICAgKC10aGlzLnNpemUgLyAyICsgdGhpcy55ICogZ2FtZS5USUxFX0hFSUdIVCAtXHJcbiAgICAgICAgICAgICAgICBnYW1lLmludGVycG9sYXRlZENhbVkgKiBnYW1lLlRJTEVfSEVJR0hUKSAqXHJcbiAgICAgICAgICAgIHVwc2NhbGVTaXplLFxyXG4gICAgICAgICAgICB0aGlzLnNpemUgKiB1cHNjYWxlU2l6ZSAqIGdhbWUuVElMRV9XSURUSCxcclxuICAgICAgICAgICAgdGhpcy5zaXplICogdXBzY2FsZVNpemUgKiBnYW1lLlRJTEVfSEVJR0hUXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICB0aWNrKCkge1xyXG4gICAgICAgIHRoaXMuYWdlKys7XHJcbiAgICAgICAgdGhpcy54ICs9IHRoaXMueFZlbDtcclxuICAgICAgICB0aGlzLnkgKz0gdGhpcy55VmVsO1xyXG4gICAgICAgIHRoaXMueFZlbCAtPSAoTWF0aC5hYnModGhpcy54VmVsKSAqIHRoaXMueFZlbCAqIGdhbWUuRFJBR19DT0VGRklDSUVOVCAqIHRoaXMuc2l6ZSk7Ly9hc3N1bWluZyBjb25zdGFudCBtYXNzIGZvciBlYWNoIHBhcnRpY2xlXHJcbiAgICAgICAgaWYgKHRoaXMuZ3Jhdml0eSkge1xyXG4gICAgICAgICAgICB0aGlzLnlWZWwgKz0gZ2FtZS5HUkFWSVRZX1NQRUVEO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy53aW5kKSB7XHJcbiAgICAgICAgICAgIHRoaXMueFZlbCArPSB0aGlzLm5vaXNlLm5vaXNlMkQodGhpcy54LzEwLCB0aGlzLnkvMTApLzQwXHJcbiAgICAgICAgICAgIHRoaXMueVZlbCArPSB0aGlzLm5vaXNlLm5vaXNlMkQodGhpcy55LzEwLCB0aGlzLngvMTApLzQwXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMueVZlbCAtPSAoTWF0aC5hYnModGhpcy55VmVsKSAqIHRoaXMueVZlbCAqIGdhbWUuRFJBR19DT0VGRklDSUVOVCAqIHRoaXMuc2l6ZSk7XHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IHsgSW52ZW50b3J5UGF5bG9hZCwgSXRlbVR5cGUgfSBmcm9tICcuL0ludmVudG9yeSc7XHJcblxyXG5leHBvcnQgZW51bSBFbnRpdGllcyB7XHJcblx0TG9jYWxQbGF5ZXIsXHJcblx0UGxheWVyLFxyXG5cdEl0ZW0sXHJcbn1cclxuXHJcbnR5cGUgRGF0YVBhaXJzPFQsIEsgZXh0ZW5kcyBrZXlvZiBUID0ga2V5b2YgVD4gPSBLIGV4dGVuZHMga2V5b2YgVFxyXG5cdD8geyB0eXBlOiBLOyBkYXRhOiBUW0tdIH1cclxuXHQ6IG5ldmVyO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBFbnRpdGllc0RhdGEge1xyXG5cdFtFbnRpdGllcy5Mb2NhbFBsYXllcl06IHtcclxuXHRcdG5hbWU6IHN0cmluZztcclxuXHRcdHg6IG51bWJlcjtcclxuXHRcdHk6IG51bWJlcjtcclxuXHR9O1xyXG5cdFtFbnRpdGllcy5QbGF5ZXJdOiB7IG5hbWU6IHN0cmluZyB9O1xyXG5cdFtFbnRpdGllcy5JdGVtXTogeyBpdGVtOiBJdGVtVHlwZTsgeDogbnVtYmVyOyB5OiBudW1iZXIgfTtcclxufVxyXG5cclxuZXhwb3J0IHR5cGUgRW50aXR5RGF0YTxUIGV4dGVuZHMgRW50aXRpZXMgPSBrZXlvZiBFbnRpdGllc0RhdGE+ID0gRGF0YVBhaXJzPFxyXG5cdEVudGl0aWVzRGF0YSxcclxuXHRUXHJcbj47XHJcblxyXG5leHBvcnQgdHlwZSBFbnRpdHlQYXlsb2FkPFQgZXh0ZW5kcyBFbnRpdGllcyA9IGtleW9mIEVudGl0aWVzRGF0YT4gPVxyXG5cdEVudGl0eURhdGE8VD4gJiB7IGlkOiBzdHJpbmcgfTtcclxuIiwiaW1wb3J0IHsgVGlsZVR5cGUgfSBmcm9tICcuL1RpbGUnO1xyXG5pbXBvcnQgeyBUaWxlRW50aXRpZXMgfSBmcm9tICcuL1RpbGVFbnRpdHknO1xyXG5cclxudHlwZSBEYXRhUGFpcnM8VCwgSyBleHRlbmRzIGtleW9mIFQgPSBrZXlvZiBUPiA9IEsgZXh0ZW5kcyBrZXlvZiBUXHJcblx0PyB7IHR5cGU6IEsgfSAmIFRbS11cclxuXHQ6IG5ldmVyO1xyXG5cclxuY29uc3QgaXRlbVR5cGVEYXRhID0gPEQsIFQgZXh0ZW5kcyBSZWNvcmQ8SXRlbVR5cGUsIERhdGFQYWlyczxDYXRlZ29yeURhdGE+Pj4oXHJcblx0ZGF0YTogVCxcclxuKTogVCA9PiBkYXRhO1xyXG5cclxuZXhwb3J0IGVudW0gSXRlbUNhdGVnb3JpZXMge1xyXG5cdFRpbGUsXHJcblx0UmVzb3VyY2UsXHJcblx0VG9vbCxcclxuXHRUaWxlRW50aXR5LFxyXG59XHJcblxyXG5leHBvcnQgdHlwZSBDYXRlZ29yeURhdGEgPSB7XHJcblx0W0l0ZW1DYXRlZ29yaWVzLlRpbGVdOiB7IHBsYWNlZFRpbGU6IFRpbGVUeXBlLCBtYXhTdGFja1NpemU/OiBudW1iZXJ9O1xyXG5cdFtJdGVtQ2F0ZWdvcmllcy5SZXNvdXJjZV06IHt9O1xyXG5cdFtJdGVtQ2F0ZWdvcmllcy5Ub29sXTogeyBicmVha2FibGVUaWxlczogVGlsZVR5cGVbXX07XHJcblx0W0l0ZW1DYXRlZ29yaWVzLlRpbGVFbnRpdHldOiB7IHBsYWNlZFRpbGVFbnRpdHk6IG51bWJlciwgdGlsZUVudGl0eU9mZnNldD86IFtudW1iZXIsIG51bWJlcl19O1xyXG59O1xyXG5cclxuZXhwb3J0IGVudW0gSXRlbVR5cGUge1xyXG5cdFNub3dCbG9jayxcclxuXHRJY2VCbG9jayxcclxuXHREaXJ0QmxvY2ssXHJcblx0U3RvbmUwQmxvY2ssXHJcblx0U3RvbmUxQmxvY2ssXHJcblx0U3RvbmUyQmxvY2ssXHJcblx0U3RvbmUzQmxvY2ssXHJcblx0U3RvbmU0QmxvY2ssXHJcblx0U3RvbmU1QmxvY2ssXHJcblx0U3RvbmU2QmxvY2ssXHJcblx0U3RvbmU3QmxvY2ssXHJcblx0U3RvbmU4QmxvY2ssXHJcblx0U3RvbmU5QmxvY2ssXHJcblx0VGluQmxvY2ssXHJcblx0QWx1bWludW1CbG9jayxcclxuXHRHb2xkQmxvY2ssXHJcblx0VGl0YW5pdW1CbG9jayxcclxuXHRHcmFwZUJsb2NrLFxyXG5cdFdvb2QwQmxvY2ssXHJcblx0V29vZDFCbG9jayxcclxuXHRXb29kMkJsb2NrLFxyXG5cdFdvb2QzQmxvY2ssXHJcblx0V29vZDRCbG9jayxcclxuXHRXb29kNUJsb2NrLFxyXG5cdFdvb2Q2QmxvY2ssXHJcblx0V29vZDdCbG9jayxcclxuXHRXb29kOEJsb2NrLFxyXG5cdFdvb2Q5QmxvY2ssXHJcblx0U2VlZCxcclxufVxyXG5cclxuZXhwb3J0IHR5cGUgSXRlbVN0YWNrID0ge1xyXG5cdHF1YW50aXR5OiBudW1iZXI7XHJcblx0aXRlbTogSXRlbVR5cGU7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgSXRlbXMgPSBpdGVtVHlwZURhdGEoe1xyXG5cdFtJdGVtVHlwZS5Tbm93QmxvY2tdOiB7XHJcblx0XHR0eXBlOiBJdGVtQ2F0ZWdvcmllcy5UaWxlLFxyXG5cdFx0cGxhY2VkVGlsZTogVGlsZVR5cGUuU25vdyxcclxuXHR9LFxyXG5cdFtJdGVtVHlwZS5JY2VCbG9ja106IHtcclxuXHRcdHR5cGU6IEl0ZW1DYXRlZ29yaWVzLlRpbGUsXHJcblx0XHRwbGFjZWRUaWxlOiBUaWxlVHlwZS5JY2UsXHJcblx0fSxcclxuXHRbSXRlbVR5cGUuRGlydEJsb2NrXToge1xyXG5cdFx0dHlwZTogSXRlbUNhdGVnb3JpZXMuVGlsZSxcclxuXHRcdHBsYWNlZFRpbGU6IFRpbGVUeXBlLkRpcnQsXHJcblx0fSxcclxuXHRbSXRlbVR5cGUuU3RvbmUwQmxvY2tdOiB7XHJcblx0XHR0eXBlOiBJdGVtQ2F0ZWdvcmllcy5UaWxlLFxyXG5cdFx0cGxhY2VkVGlsZTogVGlsZVR5cGUuU3RvbmUwLFxyXG5cdH0sXHJcblx0W0l0ZW1UeXBlLlN0b25lMUJsb2NrXToge1xyXG5cdFx0dHlwZTogSXRlbUNhdGVnb3JpZXMuVGlsZSxcclxuXHRcdHBsYWNlZFRpbGU6IFRpbGVUeXBlLlN0b25lMSxcclxuXHR9LFxyXG5cdFtJdGVtVHlwZS5TdG9uZTJCbG9ja106IHtcclxuXHRcdHR5cGU6IEl0ZW1DYXRlZ29yaWVzLlRpbGUsXHJcblx0XHRwbGFjZWRUaWxlOiBUaWxlVHlwZS5TdG9uZTIsXHJcblx0fSxcclxuXHRbSXRlbVR5cGUuU3RvbmUzQmxvY2tdOiB7XHJcblx0XHR0eXBlOiBJdGVtQ2F0ZWdvcmllcy5UaWxlLFxyXG5cdFx0cGxhY2VkVGlsZTogVGlsZVR5cGUuU3RvbmUzLFxyXG5cdH0sXHJcblx0W0l0ZW1UeXBlLlN0b25lNEJsb2NrXToge1xyXG5cdFx0dHlwZTogSXRlbUNhdGVnb3JpZXMuVGlsZSxcclxuXHRcdHBsYWNlZFRpbGU6IFRpbGVUeXBlLlN0b25lNCxcclxuXHR9LFxyXG5cdFtJdGVtVHlwZS5TdG9uZTVCbG9ja106IHtcclxuXHRcdHR5cGU6IEl0ZW1DYXRlZ29yaWVzLlRpbGUsXHJcblx0XHRwbGFjZWRUaWxlOiBUaWxlVHlwZS5TdG9uZTUsXHJcblx0fSxcclxuXHRbSXRlbVR5cGUuU3RvbmU2QmxvY2tdOiB7XHJcblx0XHR0eXBlOiBJdGVtQ2F0ZWdvcmllcy5UaWxlLFxyXG5cdFx0cGxhY2VkVGlsZTogVGlsZVR5cGUuU3RvbmU2LFxyXG5cdH0sXHJcblx0W0l0ZW1UeXBlLlN0b25lN0Jsb2NrXToge1xyXG5cdFx0dHlwZTogSXRlbUNhdGVnb3JpZXMuVGlsZSxcclxuXHRcdHBsYWNlZFRpbGU6IFRpbGVUeXBlLlN0b25lNyxcclxuXHR9LFxyXG5cdFtJdGVtVHlwZS5TdG9uZThCbG9ja106IHtcclxuXHRcdHR5cGU6IEl0ZW1DYXRlZ29yaWVzLlRpbGUsXHJcblx0XHRwbGFjZWRUaWxlOiBUaWxlVHlwZS5TdG9uZTgsXHJcblx0fSxcclxuXHRbSXRlbVR5cGUuU3RvbmU5QmxvY2tdOiB7XHJcblx0XHR0eXBlOiBJdGVtQ2F0ZWdvcmllcy5UaWxlLFxyXG5cdFx0cGxhY2VkVGlsZTogVGlsZVR5cGUuU3RvbmU5LFxyXG5cdH0sXHJcblx0W0l0ZW1UeXBlLlRpbkJsb2NrXToge1xyXG5cdFx0dHlwZTogSXRlbUNhdGVnb3JpZXMuVGlsZSxcclxuXHRcdHBsYWNlZFRpbGU6IFRpbGVUeXBlLlRpbixcclxuXHR9LFxyXG5cdFtJdGVtVHlwZS5BbHVtaW51bUJsb2NrXToge1xyXG5cdFx0dHlwZTogSXRlbUNhdGVnb3JpZXMuVGlsZSxcclxuXHRcdHBsYWNlZFRpbGU6IFRpbGVUeXBlLkFsdW1pbnVtLFxyXG5cdH0sXHJcblx0W0l0ZW1UeXBlLkdvbGRCbG9ja106IHtcclxuXHRcdHR5cGU6IEl0ZW1DYXRlZ29yaWVzLlRpbGUsXHJcblx0XHRwbGFjZWRUaWxlOiBUaWxlVHlwZS5Hb2xkLFxyXG5cdH0sXHJcblx0W0l0ZW1UeXBlLlRpdGFuaXVtQmxvY2tdOiB7XHJcblx0XHR0eXBlOiBJdGVtQ2F0ZWdvcmllcy5UaWxlLFxyXG5cdFx0cGxhY2VkVGlsZTogVGlsZVR5cGUuVGl0YW5pdW0sXHJcblx0fSxcclxuXHRbSXRlbVR5cGUuR3JhcGVCbG9ja106IHtcclxuXHRcdHR5cGU6IEl0ZW1DYXRlZ29yaWVzLlRpbGUsXHJcblx0XHRwbGFjZWRUaWxlOiBUaWxlVHlwZS5HcmFwZSxcclxuXHR9LFxyXG5cdFtJdGVtVHlwZS5Xb29kMEJsb2NrXToge1xyXG5cdFx0dHlwZTogSXRlbUNhdGVnb3JpZXMuVGlsZSxcclxuXHRcdHBsYWNlZFRpbGU6IFRpbGVUeXBlLldvb2QwLFxyXG5cdH0sXHJcblx0W0l0ZW1UeXBlLldvb2QxQmxvY2tdOiB7XHJcblx0XHR0eXBlOiBJdGVtQ2F0ZWdvcmllcy5UaWxlLFxyXG5cdFx0cGxhY2VkVGlsZTogVGlsZVR5cGUuV29vZDEsXHJcblx0fSxcclxuXHRbSXRlbVR5cGUuV29vZDJCbG9ja106IHtcclxuXHRcdHR5cGU6IEl0ZW1DYXRlZ29yaWVzLlRpbGUsXHJcblx0XHRwbGFjZWRUaWxlOiBUaWxlVHlwZS5Xb29kMixcclxuXHR9LFxyXG5cdFtJdGVtVHlwZS5Xb29kM0Jsb2NrXToge1xyXG5cdFx0dHlwZTogSXRlbUNhdGVnb3JpZXMuVGlsZSxcclxuXHRcdHBsYWNlZFRpbGU6IFRpbGVUeXBlLldvb2QzLFxyXG5cdH0sXHJcblx0W0l0ZW1UeXBlLldvb2Q0QmxvY2tdOiB7XHJcblx0XHR0eXBlOiBJdGVtQ2F0ZWdvcmllcy5UaWxlLFxyXG5cdFx0cGxhY2VkVGlsZTogVGlsZVR5cGUuV29vZDQsXHJcblx0fSxcclxuXHRbSXRlbVR5cGUuV29vZDVCbG9ja106IHtcclxuXHRcdHR5cGU6IEl0ZW1DYXRlZ29yaWVzLlRpbGUsXHJcblx0XHRwbGFjZWRUaWxlOiBUaWxlVHlwZS5Xb29kNSxcclxuXHR9LFxyXG5cdFtJdGVtVHlwZS5Xb29kNkJsb2NrXToge1xyXG5cdFx0dHlwZTogSXRlbUNhdGVnb3JpZXMuVGlsZSxcclxuXHRcdHBsYWNlZFRpbGU6IFRpbGVUeXBlLldvb2Q2LFxyXG5cdH0sXHJcblx0W0l0ZW1UeXBlLldvb2Q3QmxvY2tdOiB7XHJcblx0XHR0eXBlOiBJdGVtQ2F0ZWdvcmllcy5UaWxlLFxyXG5cdFx0cGxhY2VkVGlsZTogVGlsZVR5cGUuV29vZDcsXHJcblx0fSxcclxuXHRbSXRlbVR5cGUuV29vZDhCbG9ja106IHtcclxuXHRcdHR5cGU6IEl0ZW1DYXRlZ29yaWVzLlRpbGUsXHJcblx0XHRwbGFjZWRUaWxlOiBUaWxlVHlwZS5Xb29kOCxcclxuXHR9LFxyXG5cdFtJdGVtVHlwZS5Xb29kOUJsb2NrXToge1xyXG5cdFx0dHlwZTogSXRlbUNhdGVnb3JpZXMuVGlsZSxcclxuXHRcdHBsYWNlZFRpbGU6IFRpbGVUeXBlLldvb2Q5LFxyXG5cdH0sXHJcblx0W0l0ZW1UeXBlLlNlZWRdOiB7XHJcblx0XHR0eXBlOiBJdGVtQ2F0ZWdvcmllcy5UaWxlRW50aXR5LFxyXG5cdFx0cGxhY2VkVGlsZUVudGl0eTogVGlsZUVudGl0aWVzLlNlZWQsXHJcblx0XHR0aWxlRW50aXR5T2Zmc2V0OiBbLTEsIC02XSxcclxuXHR9LFxyXG5cdC8vIFtJdGVtVHlwZS5UaW5QaWNrYXhlXToge1xyXG5cdC8vIFx0dHlwZTogSXRlbUNhdGVnb3JpZXMuVG9vbCxcclxuXHQvLyBcdGJyZWFrYWJsZVRpbGVzOiBbVGlsZVR5cGUuU25vdywgVGlsZVR5cGUuSWNlLCBUaWxlVHlwZS5EaXJ0LCBUaWxlVHlwZS5Xb29kMCwgVGlsZVR5cGUuU3RvbmUwLCBUaWxlVHlwZS5TdG9uZTEsIFRpbGVUeXBlLlRpbiwgVGlsZVR5cGUuQWx1bWludW1dXHJcblx0Ly8gfVxyXG59KTtcclxuXHJcbmV4cG9ydCB0eXBlIEludmVudG9yeVVwZGF0ZVBheWxvYWQgPSB7XHJcblx0c2xvdDogbnVtYmVyO1xyXG5cdGl0ZW06IEl0ZW1TdGFjayB8IHVuZGVmaW5lZDtcclxufVtdO1xyXG5cclxuZXhwb3J0IHR5cGUgSW52ZW50b3J5UGF5bG9hZCA9IHtcclxuXHRpdGVtczogKEl0ZW1TdGFjayB8IHVuZGVmaW5lZClbXTtcclxuXHJcblx0d2lkdGg6IG51bWJlcjtcclxuXHRoZWlnaHQ6IG51bWJlcjtcclxufTtcclxuIiwiZXhwb3J0IGVudW0gVGlsZVR5cGUge1xyXG5cdEFpcixcclxuXHRTbm93LFxyXG5cdEljZSxcclxuXHREaXJ0LFxyXG5cdFN0b25lMCxcclxuXHRTdG9uZTEsXHJcblx0U3RvbmUyLFxyXG5cdFN0b25lMyxcclxuXHRTdG9uZTQsXHJcblx0U3RvbmU1LFxyXG5cdFN0b25lNixcclxuXHRTdG9uZTcsXHJcblx0U3RvbmU4LFxyXG5cdFN0b25lOSxcclxuXHRUaW4sXHJcblx0QWx1bWludW0sXHJcblx0R29sZCxcclxuXHRUaXRhbml1bSxcclxuXHRHcmFwZSxcclxuXHRXb29kMCxcclxuXHRXb29kMSxcclxuXHRXb29kMixcclxuXHRXb29kMyxcclxuXHRXb29kNCxcclxuXHRXb29kNSxcclxuXHRXb29kNixcclxuXHRXb29kNyxcclxuXHRXb29kOCxcclxuXHRXb29kOSxcclxufSIsImV4cG9ydCBlbnVtIFRpbGVFbnRpdGllcyB7XHJcblx0VHJlZSxcclxuXHRUaWVyMURyaWxsLFxyXG5cdFRpZXIyRHJpbGwsXHJcblx0VGllcjNEcmlsbCxcclxuXHRUaWVyNERyaWxsLFxyXG5cdFRpZXI1RHJpbGwsXHJcblx0Q3JhZnRpbmdCZW5jaCxcclxuXHRTZWVkLFxyXG59XHJcblxyXG50eXBlIERhdGFQYWlyczxULCBLIGV4dGVuZHMga2V5b2YgVCA9IGtleW9mIFQ+ID0gSyBleHRlbmRzIGtleW9mIFRcclxuXHQ/IHsgdHlwZV86IEs7IGRhdGE6IFRbS10gfVxyXG5cdDogbmV2ZXI7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFRpbGVFbnRpdGllc0RhdGEge1xyXG5cdFtUaWxlRW50aXRpZXMuVHJlZV06IHsgd29vZENvdW50OiBudW1iZXI7IHNlZWRDb3VudDogbnVtYmVyIH07XHJcblx0W1RpbGVFbnRpdGllcy5UaWVyMURyaWxsXTogeyAgfTtcclxuXHRbVGlsZUVudGl0aWVzLlRpZXIyRHJpbGxdOiB7ICB9O1xyXG5cdFtUaWxlRW50aXRpZXMuVGllcjNEcmlsbF06IHsgIH07XHJcblx0W1RpbGVFbnRpdGllcy5UaWVyNERyaWxsXTogeyAgfTtcclxuXHRbVGlsZUVudGl0aWVzLlRpZXI1RHJpbGxdOiB7ICB9O1xyXG5cdFtUaWxlRW50aXRpZXMuQ3JhZnRpbmdCZW5jaF06IHsgIH07XHJcblx0W1RpbGVFbnRpdGllcy5TZWVkXTogeyAgfTtcclxufVxyXG5cclxuZXhwb3J0IHR5cGUgVGlsZUVudGl0eURhdGEgPSBEYXRhUGFpcnM8VGlsZUVudGl0aWVzRGF0YT4gJiB7fVxyXG5cclxuZXhwb3J0IHR5cGUgVGlsZUVudGl0eVBheWxvYWQgPSB7XHJcblx0aWQ6IHN0cmluZztcclxuXHRjb3ZlcmVkVGlsZXM6IG51bWJlcltdO1xyXG5cdHBheWxvYWQ6IFRpbGVFbnRpdHlEYXRhO1xyXG59O1xyXG5cclxuZXhwb3J0IGVudW0gVGlsZUVudGl0eVRleHR1cmVzIHtcclxuXHRUcmVlMSxcclxuXHRUcmVlMixcclxuXHRUcmVlMyxcclxuXHRUcmVlNCxcclxuXHRUcmVlNSxcclxuXHRUcmVlNixcclxuXHRUcmVlNyxcclxuXHRUcmVlOCxcclxuXHRUcmVlOSxcclxuXHRUcmVlMTAsXHJcbn1cclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbi8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBfX3dlYnBhY2tfbW9kdWxlc19fO1xuXG4iLCJ2YXIgZGVmZXJyZWQgPSBbXTtcbl9fd2VicGFja19yZXF1aXJlX18uTyA9IChyZXN1bHQsIGNodW5rSWRzLCBmbiwgcHJpb3JpdHkpID0+IHtcblx0aWYoY2h1bmtJZHMpIHtcblx0XHRwcmlvcml0eSA9IHByaW9yaXR5IHx8IDA7XG5cdFx0Zm9yKHZhciBpID0gZGVmZXJyZWQubGVuZ3RoOyBpID4gMCAmJiBkZWZlcnJlZFtpIC0gMV1bMl0gPiBwcmlvcml0eTsgaS0tKSBkZWZlcnJlZFtpXSA9IGRlZmVycmVkW2kgLSAxXTtcblx0XHRkZWZlcnJlZFtpXSA9IFtjaHVua0lkcywgZm4sIHByaW9yaXR5XTtcblx0XHRyZXR1cm47XG5cdH1cblx0dmFyIG5vdEZ1bGZpbGxlZCA9IEluZmluaXR5O1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IGRlZmVycmVkLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIFtjaHVua0lkcywgZm4sIHByaW9yaXR5XSA9IGRlZmVycmVkW2ldO1xuXHRcdHZhciBmdWxmaWxsZWQgPSB0cnVlO1xuXHRcdGZvciAodmFyIGogPSAwOyBqIDwgY2h1bmtJZHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdGlmICgocHJpb3JpdHkgJiAxID09PSAwIHx8IG5vdEZ1bGZpbGxlZCA+PSBwcmlvcml0eSkgJiYgT2JqZWN0LmtleXMoX193ZWJwYWNrX3JlcXVpcmVfXy5PKS5ldmVyeSgoa2V5KSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXy5PW2tleV0oY2h1bmtJZHNbal0pKSkpIHtcblx0XHRcdFx0Y2h1bmtJZHMuc3BsaWNlKGotLSwgMSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmdWxmaWxsZWQgPSBmYWxzZTtcblx0XHRcdFx0aWYocHJpb3JpdHkgPCBub3RGdWxmaWxsZWQpIG5vdEZ1bGZpbGxlZCA9IHByaW9yaXR5O1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihmdWxmaWxsZWQpIHtcblx0XHRcdGRlZmVycmVkLnNwbGljZShpLS0sIDEpXG5cdFx0XHR2YXIgciA9IGZuKCk7XG5cdFx0XHRpZiAociAhPT0gdW5kZWZpbmVkKSByZXN1bHQgPSByO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gcmVzdWx0O1xufTsiLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18uZyA9IChmdW5jdGlvbigpIHtcblx0aWYgKHR5cGVvZiBnbG9iYWxUaGlzID09PSAnb2JqZWN0JykgcmV0dXJuIGdsb2JhbFRoaXM7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIHRoaXMgfHwgbmV3IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHJldHVybiB3aW5kb3c7XG5cdH1cbn0pKCk7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIG5vIGJhc2VVUklcblxuLy8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3Ncbi8vIHVuZGVmaW5lZCA9IGNodW5rIG5vdCBsb2FkZWQsIG51bGwgPSBjaHVuayBwcmVsb2FkZWQvcHJlZmV0Y2hlZFxuLy8gW3Jlc29sdmUsIHJlamVjdCwgUHJvbWlzZV0gPSBjaHVuayBsb2FkaW5nLCAwID0gY2h1bmsgbG9hZGVkXG52YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuXHRcIm1haW5cIjogMFxufTtcblxuLy8gbm8gY2h1bmsgb24gZGVtYW5kIGxvYWRpbmdcblxuLy8gbm8gcHJlZmV0Y2hpbmdcblxuLy8gbm8gcHJlbG9hZGVkXG5cbi8vIG5vIEhNUlxuXG4vLyBubyBITVIgbWFuaWZlc3RcblxuX193ZWJwYWNrX3JlcXVpcmVfXy5PLmogPSAoY2h1bmtJZCkgPT4gKGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9PT0gMCk7XG5cbi8vIGluc3RhbGwgYSBKU09OUCBjYWxsYmFjayBmb3IgY2h1bmsgbG9hZGluZ1xudmFyIHdlYnBhY2tKc29ucENhbGxiYWNrID0gKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uLCBkYXRhKSA9PiB7XG5cdHZhciBbY2h1bmtJZHMsIG1vcmVNb2R1bGVzLCBydW50aW1lXSA9IGRhdGE7XG5cdC8vIGFkZCBcIm1vcmVNb2R1bGVzXCIgdG8gdGhlIG1vZHVsZXMgb2JqZWN0LFxuXHQvLyB0aGVuIGZsYWcgYWxsIFwiY2h1bmtJZHNcIiBhcyBsb2FkZWQgYW5kIGZpcmUgY2FsbGJhY2tcblx0dmFyIG1vZHVsZUlkLCBjaHVua0lkLCBpID0gMDtcblx0aWYoY2h1bmtJZHMuc29tZSgoaWQpID0+IChpbnN0YWxsZWRDaHVua3NbaWRdICE9PSAwKSkpIHtcblx0XHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcblx0XHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XG5cdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18ubVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKHJ1bnRpbWUpIHZhciByZXN1bHQgPSBydW50aW1lKF9fd2VicGFja19yZXF1aXJlX18pO1xuXHR9XG5cdGlmKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKSBwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbihkYXRhKTtcblx0Zm9yKDtpIDwgY2h1bmtJZHMubGVuZ3RoOyBpKyspIHtcblx0XHRjaHVua0lkID0gY2h1bmtJZHNbaV07XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGluc3RhbGxlZENodW5rcywgY2h1bmtJZCkgJiYgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKSB7XG5cdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF1bMF0oKTtcblx0XHR9XG5cdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gMDtcblx0fVxuXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHJlc3VsdCk7XG59XG5cbnZhciBjaHVua0xvYWRpbmdHbG9iYWwgPSBzZWxmW1wid2VicGFja0NodW5rc25vd2VkX2luXCJdID0gc2VsZltcIndlYnBhY2tDaHVua3Nub3dlZF9pblwiXSB8fCBbXTtcbmNodW5rTG9hZGluZ0dsb2JhbC5mb3JFYWNoKHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgMCkpO1xuY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2ggPSB3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIGNodW5rTG9hZGluZ0dsb2JhbC5wdXNoLmJpbmQoY2h1bmtMb2FkaW5nR2xvYmFsKSk7IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBkZXBlbmRzIG9uIG90aGVyIGxvYWRlZCBjaHVua3MgYW5kIGV4ZWN1dGlvbiBuZWVkIHRvIGJlIGRlbGF5ZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHVuZGVmaW5lZCwgW1wibW9kdWxlcy1tYWluXCJdLCAoKSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2NsaWVudC9HYW1lLnRzXCIpKSlcbl9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8oX193ZWJwYWNrX2V4cG9ydHNfXyk7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=