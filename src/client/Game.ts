import p5, { Shader } from 'p5';

import Audio from 'ts-audio';

import { World } from './world/World';

import {
	AudioAssets,
	Fonts,
	ItemAssets,
	loadAssets,
	PlayerAnimations,
	UiAssets,
	WorldAssets,
} from './assets/Assets';
import { MainMenu } from './ui/screens/MainMenu';
import { io, Socket } from 'socket.io-client';
import { UiScreen } from './ui/UiScreen';
import { PauseMenu } from './ui/screens/PauseMenu';
import { NetManager } from './NetManager';
import { WorldTiles, Tile } from './world/WorldTiles';

import { ClientEvents, ServerEvents } from '../global/Events';

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
import { TileType } from '../global/Tile';
import { Control } from './input/Control';
import { ColorParticle } from './world/particles/ColorParticle';

export class Game extends p5 {
	worldWidth: number = 512; // width of the world in tiles   <!> MAKE SURE THIS IS NEVER LESS THAN 64!!! <!>
	worldHeight: number = 256; // height of the world in tiles  <!> MAKE SURE THIS IS NEVER LESS THAN 64!!! <!>

	TILE_WIDTH: number = 8; // width of a tiles in pixels
	TILE_HEIGHT: number = 8; // height of a tiles in pixels

	upscaleSize: number = 6; // number of screen pixels per texture pixels (think of this as hud scale in Minecraft)

	camX: number = 0; // position of the top left corner of the screen in un-up-scaled pixels (0 is left of world) (worldWidth*TILE_WIDTH is bottom of world)
	camY: number = 0; // position of the top left corner of the screen in un-up-scaled pixels (0 is top of world) (worldHeight*TILE_HEIGHT is bottom of world)
	pCamX: number = 0; // last frame's x of the camera
	pCamY: number = 0; // last frame's y of the camera
	interpolatedCamX: number = 0; // interpolated position of the camera
	interpolatedCamY: number = 0; // interpolated position of the camera
	desiredCamX: number = 0; // desired position of the camera
	desiredCamY: number = 0; // desired position of the camera
	screenshakeAmount: number = 0; // amount of screenshake happening at the current moment

	// tick management
	msSinceTick: number = 0; // this is the running counter of how many milliseconds it has been since the last tick.  The game can then
	msPerTick: number = 20; // the number of milliseconds per game tick.  1000/msPerTick = ticks per second
	amountSinceLastTick: number = 0; // this is a variable calculated every frame used for interpolation - domain[0,1)
	forgivenessCount: number = 50; // if the computer needs to do more than 50 ticks in a single frame, then it could be running behind, probably because of a freeze or the user being on a different tab.  In these cases, it's probably best to just ignore that any time has passed to avoid further freezing

	// physics constants
	GRAVITY_SPEED: number = 0.04; // in units per second tick, positive means downward gravity, negative means upward gravity
	DRAG_COEFFICIENT: number = 0.21; // arbitrary number, 0 means no drag

	// CHARACTER SHOULD BE ROUGHLY 12 PIXELS BY 20 PIXELS

	pickedUpSlot = -1;

	worldMouseX = 0; // the mouse position in world coordinates
	worldMouseY = 0; // the mouse position in world coordinates
    lastCursorMove = Date.now()
	mouseOn = true; // is the mouse on the window?

	keys: boolean[] = [];

	// the keycode for the key that does the action
	controls: Control[] = [
		new Control(
			'Walk Right',
			true,
			68,
			() => {
				if (this.currentUi !== undefined) return;
				this.world.player.rightButton = true;
			},
			() => {
				if (this.currentUi !== undefined) return;
				this.world.player.rightButton = false;
			},
		), // right
		new Control(
			'Walk Left',
			true,
			65,
			() => {
				if (this.currentUi !== undefined) return;
				this.world.player.leftButton = true;
			},
			() => {
				if (this.currentUi !== undefined) return;
				this.world.player.leftButton = false;
			},
		), // left
		new Control(
			'Jump',
			true,
			87,
			() => {
				if (this.currentUi !== undefined) return;
				this.world.player.jumpButton = true;
			},
			() => {
				if (this.currentUi !== undefined) return;
				this.world.player.jumpButton = false;
			},
		), // jump
		new Control('Pause', true, 27, () => {
			//if inventory open{
			//close inventory
			//return;}
			if (this.currentUi === undefined)
				this.currentUi = new PauseMenu(Fonts.title, Fonts.big);
			else this.currentUi = undefined;
		}), // settings
		new Control('Inventory', true, 69, () => {
			//if ui open return;
			//if inventory closed open inventory
			//else close inventory
			console.log('inventory has not been implemented yet');
		}), // inventory
		new Control('Hotbar 1', true, 49, () => {
			this.world.inventory.selectedSlot = 0;
		}), // hot bar 1
		new Control('Hotbar 2', true, 50, () => {
			this.world.inventory.selectedSlot = 1;
		}), // hot bar 2
		new Control('Hotbar 3', true, 51, () => {
			this.world.inventory.selectedSlot = 2;
		}), // hot bar 3
		new Control('Hotbar 4', true, 52, () => {
			this.world.inventory.selectedSlot = 3;
		}), // hot bar 4
		new Control('Hotbar 5', true, 53, () => {
			this.world.inventory.selectedSlot = 4;
		}), // hot bar 5
		new Control('Hotbar 6', true, 54, () => {
			this.world.inventory.selectedSlot = 5;
		}), // hot bar 6
		new Control('Hotbar 7', true, 55, () => {
			this.world.inventory.selectedSlot = 6;
		}), // hot bar 7
		new Control('Hotbar 8', true, 56, () => {
			this.world.inventory.selectedSlot = 7;
		}), // hot bar 8
		new Control('Hotbar 9', true, 57, () => {
			this.world.inventory.selectedSlot = 8;
		}), // hot bar 9
	];

	canvas: p5.Renderer; //the canvas for the game
	skyLayer: p5.Graphics; //a p5.Graphics object that the shader is drawn onto.  this isn't the best way to do this, but the main game canvas isn't WEBGL, and it's too much work to change that
	skyShader: p5.Shader; //the shader that draws the sky (the path for this is in the public folder)

	world: World;

	currentUi: UiScreen | undefined;

	connection: Socket<ServerEvents, ClientEvents>;

	netManager: NetManager;

	//changeable options from menus
	serverVisibility: string;
	worldBumpiness: number;
	skyMod: number;
	skyToggle: boolean;
	particleMultiplier: number;

	particles: ColorParticle /*|FootstepParticle*/[];

	constructor(connection: Socket) {
		super(() => {}); // To create a new instance of p5 it will call back with the instance. We don't need this since we are extending the class
		this.connection = connection;

		// Initialise the network manager
		this.netManager = new NetManager(this);
	}

	preload() {
		console.log(this);
		console.log('Loading assets');
		loadAssets(
			this,
			UiAssets,
			ItemAssets,
			WorldAssets,
			Fonts,
			PlayerAnimations,
		);
		console.log('Asset loading completed');
		this.skyShader = this.loadShader(
			'assets/shaders/basic.vert',
			'assets/shaders/sky.frag',
		);
	}

	setup() {
		console.log('setup called');
		// make a canvas that fills the whole screen (a canvas is what is drawn to in p5.js, as well as lots of other JS rendering libraries)
		this.canvas = this.createCanvas(this.windowWidth, this.windowHeight);
		this.canvas.mouseOut(this.mouseExited);
		this.canvas.mouseOver(this.mouseEntered);

		this.skyLayer = this.createGraphics(this.width, this.height, 'webgl');

		this.currentUi = new MainMenu(Fonts.title, Fonts.big);

		// Tick
		setInterval(() => {
			if (this.world === undefined) return;
			this.world.tick(this);
		}, 1000 / this.netManager.playerTickRate);

		this.connection.emit(
			'join',
			'e4022d403dcc6d19d6a68ba3abfd0a60',
			'player' + Math.floor(Math.random() * 1000),
		);

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
	}

	draw() {
		for (let i = 0; i < 40 * this.particleMultiplier; i++) {
			//this.particles.push(new ColorParticle("#eb5834", 1/4, 10, this.worldMouseX+Math.random(), this.worldMouseY+Math.random(), Math.random()-0.5, Math.random()/4-0.5, false));
		}
		if (this.frameCount === 2) {
			//has to be done on the second frame for some reason?
			this.skyShader.setUniform('screenDimensions', [
				(this.width / this.upscaleSize) * 2,
				(this.height / this.upscaleSize) * 2,
			]);
			this.skyShader.setUniform(
				'skyImage',
				WorldAssets.shaderResources.skyImage.image,
			);
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

		if (this.world !== undefined) this.world.render(this, this.upscaleSize);

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
		this.tint(255, 150); //make image translucent
		UiAssets.vignette.render(this, 0, 0, this.width, this.height);
		this.noTint();
		this.noSmooth();

		// draw the hot bar
		if (this.world !== undefined) {
			this.noStroke();
			this.textAlign(this.RIGHT, this.BOTTOM);
			this.textSize(5 * this.upscaleSize);
			for (let i = 0; i < this.world.inventory.width; i++) {
				const currentItem = this.world.inventory.items[i];

				UiAssets.ui_slot.render(
					this,
					2 * this.upscaleSize + 16 * i * this.upscaleSize,
					2 * this.upscaleSize,
					16 * this.upscaleSize,
					16 * this.upscaleSize,
				);

				if (this.world.inventory.selectedSlot === i) {
					UiAssets.ui_slot_selected.render(
						this,
						2 * this.upscaleSize + 16 * i * this.upscaleSize,
						2 * this.upscaleSize,
						16 * this.upscaleSize,
						16 * this.upscaleSize,
					);
				} else {
					UiAssets.ui_slot.render(
						this,
						2 * this.upscaleSize + 16 * i * this.upscaleSize,
						2 * this.upscaleSize,
						16 * this.upscaleSize,
						16 * this.upscaleSize,
					);
				}

				if (currentItem !== undefined && currentItem !== null) {
					this.fill(0);
					if (this.pickedUpSlot === i) {
						this.tint(255, 127);
						this.fill(0, 127);
					}

					ItemAssets[currentItem.item].render(
						this,
						6 * this.upscaleSize + 16 * i * this.upscaleSize,
						6 * this.upscaleSize,
						8 * this.upscaleSize,
						8 * this.upscaleSize,
					);

					this.text(
						currentItem.quantity,
						16 * this.upscaleSize + 16 * i * this.upscaleSize,
						16 * this.upscaleSize,
					);

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

		// console.timeEnd("frame");
	}

	windowResized() {
		this.resizeCanvas(this.windowWidth, this.windowHeight);
		this.skyLayer.resizeCanvas(this.windowWidth, this.windowHeight);

		// go for a scale of <48 tiles screen
		this.upscaleSize = Math.min(
			Math.ceil(this.windowWidth / 48 / this.TILE_WIDTH),
			Math.ceil(this.windowHeight / 48 / this.TILE_HEIGHT),
		);

		this.skyShader.setUniform('screenDimensions', [
			(this.windowWidth / this.upscaleSize) * 2,
			(this.windowHeight / this.upscaleSize) * 2,
		]);

		if (this.currentUi !== undefined) this.currentUi.windowUpdate();
	}

	keyPressed(event: KeyboardEvent) {
		this.keys[this.keyCode] = true;
		for (let control of this.controls) {
			if (control.keyboard && control.keyCode === event.keyCode)
				//event.keyCode is deprecated but i don't care
				control.onPressed();
		}
		if (
			this.currentUi !== undefined &&
			this.currentUi.inputBoxes !== undefined
		) {
			for (let i of this.currentUi.inputBoxes) {
				if (i.listening) {
					console.log('test3');
					i.listening = false;
					this.controls[i.index].keyCode = event.keyCode;
					this.controls[i.index].keyboard = false;
					i.value = event.keyCode;
					i.keyboard = true;
					i.image = UiAssets.button_unselected;
				}
			}
		}
	}

	keyReleased(event: KeyboardEvent) {
		this.keys[this.keyCode] = false;
		for (let control of this.controls) {
			if (control.keyboard && control.keyCode === event.keyCode)
				//event.keyCode is deprecated but i don't care
				control.onReleased();
		}
	}

	// when it's dragged update the sliders
	mouseDragged() {
		if (
			this.currentUi !== undefined &&
			this.currentUi.sliders !== undefined
		) {
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

	mousePressed(e: MouseEvent) {
		// image(uiSlotImage, 2*upscaleSize+16*i*upscaleSize, 2*upscaleSize, 16*upscaleSize, 16*upscaleSize);
		if (this.currentUi !== undefined) {
			this.currentUi.mousePressed(e.button);
			return; // asjgsadkjfgIISUSUEUE
		}

		if (this.world === undefined) return;

		if (
			this.mouseX > 2 * this.upscaleSize &&
			this.mouseX <
				2 * this.upscaleSize +
					16 * this.upscaleSize * this.world.inventory.width &&
			this.mouseY > 2 * this.upscaleSize &&
			this.mouseY < 18 * this.upscaleSize
		) {
			const clickedSlot: number = Math.floor(
				(this.mouseX - 2 * this.upscaleSize) / 16 / this.upscaleSize,
			);

			if (this.world.inventory.pickedUpSlot === undefined) {
				if (this.world.inventory.items[clickedSlot] !== undefined) {
					this.world.inventory.pickedUpSlot = clickedSlot;
				}
			} else {
				// Swap clicked slot with the picked slot
				this.connection.emit(
					'inventorySwap',
					this.world.inventory.pickedUpSlot,
					clickedSlot,
				);

				// Set the picked up slot to nothing
				this.world.inventory.pickedUpSlot = undefined;
			}
		} else {
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

	mouseWheel(event: any) {
		//mouseEvent apparently doesn't have a delta property sooooo idk what to do sorry for the any type
		if (
			this.currentUi !== undefined &&
			this.currentUi.scroll !== undefined
		) {
			this.currentUi.scroll += event.delta / 10;
			this.currentUi.scroll = this.constrain(
				this.currentUi.scroll,
				this.currentUi.minScroll,
				this.currentUi.maxScroll,
			);
			console.log(
				`Scroll: ${this.currentUi.scroll}, Min: ${this.currentUi.minScroll}, Max: ${this.currentUi.maxScroll}`,
			);
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
		while (
			this.msSinceTick > this.msPerTick &&
			ticksThisFrame !== this.forgivenessCount
		) {
			// console.time("tick");
			if (this.world !== undefined) this.doTick();
			// console.timeEnd("tick");
			this.msSinceTick -= this.msPerTick;
			ticksThisFrame++;
		}
		if (ticksThisFrame === this.forgivenessCount) {
			this.msSinceTick = 0;
			console.warn(
				"lag spike detected, tick calculations couldn't keep up",
			);
		}
		this.amountSinceLastTick = this.msSinceTick / this.msPerTick;
	}

	doTick() {
		for (let particle of this.particles) {
			particle.tick();
		}
		if (this.world.player === undefined) return;
		if (this.world.player === undefined) return;
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
		} else if (
			this.camX >
			this.worldWidth - this.width / this.upscaleSize / this.TILE_WIDTH
		) {
			this.camX =
				this.worldWidth -
				this.width / this.upscaleSize / this.TILE_WIDTH;
		}
		if (
			this.camY >
			this.worldHeight - this.height / this.upscaleSize / this.TILE_HEIGHT
		) {
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

	uiFrameRect(x: number, y: number, w: number, h: number) {
		// set the coords and dimensions to round to the nearest un-upscaled pixel
		x = Math.round(x / this.upscaleSize) * this.upscaleSize;
		y = Math.round(y / this.upscaleSize) * this.upscaleSize;
		w = Math.round(w / this.upscaleSize) * this.upscaleSize;
		h = Math.round(h / this.upscaleSize) * this.upscaleSize;

		// corners
		UiAssets.ui_frame.renderPartial(
			this,
			x,
			y,
			7 * this.upscaleSize,
			7 * this.upscaleSize,
			0,
			0,
			7,
			7,
		);
		UiAssets.ui_frame.renderPartial(
			this,
			x + w - 7 * this.upscaleSize,
			y,
			7 * this.upscaleSize,
			7 * this.upscaleSize,
			8,
			0,
			7,
			7,
		);
		UiAssets.ui_frame.renderPartial(
			this,
			x,
			y + h - 7 * this.upscaleSize,
			7 * this.upscaleSize,
			7 * this.upscaleSize,
			0,
			8,
			7,
			7,
		);
		UiAssets.ui_frame.renderPartial(
			this,
			x + w - 7 * this.upscaleSize,
			y + h - 7 * this.upscaleSize,
			7 * this.upscaleSize,
			7 * this.upscaleSize,
			8,
			8,
			7,
			7,
		);

		// top and bottom
		UiAssets.ui_frame.renderPartial(
			this,
			x + 7 * this.upscaleSize,
			y,
			w - 14 * this.upscaleSize,
			7 * this.upscaleSize,
			7,
			0,
			1,
			7,
		);
		UiAssets.ui_frame.renderPartial(
			this,
			x + 7 * this.upscaleSize,
			y + h - 7 * this.upscaleSize,
			w - 14 * this.upscaleSize,
			7 * this.upscaleSize,
			7,
			8,
			1,
			7,
		);

		// left and right
		UiAssets.ui_frame.renderPartial(
			this,
			x,
			y + 7 * this.upscaleSize,
			7 * this.upscaleSize,
			h - 14 * this.upscaleSize,
			0,
			7,
			7,
			1,
		);
		UiAssets.ui_frame.renderPartial(
			this,
			x + w - 7 * this.upscaleSize,
			y + 7 * this.upscaleSize,
			7 * this.upscaleSize,
			h - 14 * this.upscaleSize,
			8,
			7,
			7,
			1,
		);

		// center
		UiAssets.ui_frame.renderPartial(
			this,
			x + 7 * this.upscaleSize,
			y + 7 * this.upscaleSize,
			w - 14 * this.upscaleSize,
			h - 14 * this.upscaleSize,
			7,
			7,
			1,
			1,
		);
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

	rectVsRay(
		rectX?: any,
		rectY?: any,
		rectW?: any,
		rectH?: any,
		rayX?: any,
		rayY?: any,
		rayW?: any,
		rayH?: any,
	) {
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

		if (
			isNaN(topIntersection) ||
			isNaN(bottomIntersection) ||
			isNaN(leftIntersection) ||
			isNaN(rightIntersection)
		) {
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
		if (
			Math.floor(
				(this.interpolatedCamX * this.TILE_WIDTH +
					this.mouseX / this.upscaleSize) /
					this.TILE_WIDTH,
			) !== this.worldMouseX ||
			Math.floor(
				(this.interpolatedCamY * this.TILE_HEIGHT +
					this.mouseY / this.upscaleSize) /
					this.TILE_HEIGHT,
			) !== this.worldMouseY
		) {
			this.lastCursorMove = Date.now();
		}
		// world mouse x and y variables hold the mouse position in world tiles.  0, 0 is top left
		this.worldMouseX = Math.floor(
			(this.interpolatedCamX * this.TILE_WIDTH +
				this.mouseX / this.upscaleSize) /
				this.TILE_WIDTH,
		);
		this.worldMouseY = Math.floor(
			(this.interpolatedCamY * this.TILE_HEIGHT +
				this.mouseY / this.upscaleSize) /
				this.TILE_HEIGHT,
		);
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

			UiAssets.selected_tile.render(
				this,
				Math.round(
					(this.worldMouseX - this.interpolatedCamX) *
						this.TILE_WIDTH *
						this.upscaleSize,
				),
				Math.round(
					(this.worldMouseY - this.interpolatedCamY) *
						this.TILE_HEIGHT *
						this.upscaleSize,
				),
				this.TILE_WIDTH * this.upscaleSize,
				this.TILE_HEIGHT * this.upscaleSize,
			);
            if(Date.now()-this.lastCursorMove>1000) {
                let selectedTile = this.world.worldTiles[this.world.width*this.worldMouseY+this.worldMouseX];
                if(typeof(selectedTile) === 'string') {
                    this.text("Tile entity: "+selectedTile, this.mouseX, this.mouseY);//JANKY ALERT
                }
                else if (WorldTiles[selectedTile] !== undefined) {
                    this.text((WorldTiles[selectedTile] as Tile).name, this.mouseX, this.mouseY);//JANKY ALERT
                }
            }
		}
	}
}

const connection = io({
	auth: { token: window.localStorage.getItem('token') },
});

export const game = new Game(connection);
