import p5 from 'p5';

import PlayerLocal from './world/entities/PlayerLocal';
import EntityItem from './world/entities/EntityItem';
import World from './world/World';

import {
    Fonts,
    ItemsAssets,
    loadAssets,
    UiAssets,
    WorldAssets,
} from './assets/Assets';
import { Tile, Tiles } from './world/Tiles';
import ItemStack from './world/inventory/items/ItemStack';
import TileResource from './assets/resources/TileResource';
import ImageResource from './assets/resources/ImageResource';
import Renderable from './interfaces/Renderable';
import { MainMenu } from './ui/screens/MainMenu';
import { Socket } from 'socket.io-client';
import { ClientEvents, EntityType } from '../../api/SocketEvents';
import UiScreen from './ui/UiScreen';

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
fix stuck on side of block bug
fix collide with sides of map bug

item management behavior todo:
merge
right click stack to pick up ceil(half of it)
right click when picked up to add 1 if 0 or match
craftables

*/

class Game extends p5 {
    WORLD_WIDTH: number = 512; // width of the world in tiles   <!> MAKE SURE THIS IS NEVER LESS THAN 64!!! <!>
    WORLD_HEIGHT: number = 64; // height of the world in tiles  <!> MAKE SURE THIS IS NEVER LESS THAN 64!!! <!>

    TILE_WIDTH: number = 8; // width of a tile in pixels
    TILE_HEIGHT: number = 8; // height of a tile in pixels
    BACK_TILE_WIDTH: number = 12; // width of a tile in pixels
    BACK_TILE_HEIGHT: number = 12; // height of a tile in pixels

    upscaleSize: number = 6; // number of screen pixels per texture pixels (think of this as hud scale in Minecraft)

    camX: number = 0; // position of the top left corner of the screen in un-up-scaled pixels (0 is left of world) (WORLD_WIDTH*TILE_WIDTH is bottom of world)
    camY: number = 0; // position of the top left corner of the screen in un-up-scaled pixels (0 is top of world) (WORLD_HEIGHT*TILE_HEIGHT is bottom of world)
    pCamX: number = 0; // last frame's x of the camera
    pCamY: number = 0; // last frame's y of the camera
    interpolatedCamX: number = 0; // interpolated position of the camera
    interpolatedCamY: number = 0; // interpolated position of the camera

    // tick management
    msSinceTick: number = 0; // this is the running counter of how many milliseconds it has been since the last tick.  The game can then
    msPerTick: number = 20; // the number of milliseconds per game tick.  1000/msPerTick = ticks per second
    amountSinceLastTick: number = 0; // this is a variable calculated every frame used for interpolation - domain[0,1)
    forgivenessCount: number = 50; // if the computer needs to do more than 50 ticks in a single frame, then it could be running behind, probably because of a freeze or the user being on a different tab.  In these cases, it's probably best to just ignore that any time has passed to avoid further freezing

    // physics constants
    GRAVITY_SPEED: number = 0.04; // in units per second tick, positive means downward gravity, negative means upward gravity
    DRAG_COEFFICIENT: number = 0.21; // arbitrary number, 0 means no drag

    // array for all the items
    items: EntityItem[] = [];


    // CHARACTER SHOULD BE ROUGHLY 12 PIXELS BY 20 PIXELS

    hotBar: ItemStack[] = new Array(9);
    selectedSlot = 0;
    pickedUpSlot = -1;

    worldMouseX = 0; // the mouse position in world coordinates
    worldMouseY = 0; // the mouse position in world coordinates
    mouseOn = true; // is the mouse on the window?

    keys: boolean[] = [];

    // the keycode for the key that does the action
    controls = [
        68, // right
        65, // left
        87, // jump
        27, // settings
        69, // inventory?
        49, // hot bar 1
        50, // hot bar 2
        51, // hot bar 3
        52, // hot bar 4
        53, // hot bar 5
        54, // hot bar 6
        55, // hot bar 7
        56, // hot bar 8
        57, // hot bar 9
    ];

    canvas: p5.Renderer;

    world: World;

    currentUi: UiScreen;

    connection: Socket & ClientEvents;

    playerTickRate: number;

    constructor(connection: Socket) {
        super(() => {}); // To create a new instance of p5 it will call back with the instance. We don't need this since we are extending the class
        this.connection = connection;
        this.connection.on('init', ({ playerTickRate, token }) => {
            console.log(`Tick rate set to: ${playerTickRate}`);
            this.playerTickRate = playerTickRate;
            if (token) {
                window.localStorage.setItem('token', token);
                (this.connection.auth as { token: string }).token = token;
            }
        });
    }

    preload() {
        console.log('Loading assets');
        loadAssets(this, UiAssets, ItemsAssets, WorldAssets, Fonts);
        console.log('Asset loading completed');
    }

    setup() {
        // make a canvas that fills the whole screen (a canvas is what is drawn to in p5.js, as well as lots of other JS rendering libraries)
        this.canvas = this.createCanvas(this.windowWidth, this.windowHeight);
        this.canvas.mouseOut(this.mouseExited);
        this.canvas.mouseOver(this.mouseEntered);

        this.currentUi = new MainMenu(Fonts.title);

        // Load the world and set the player
        this.connection.on(
            'load-world',
            (width, height, tiles, backgroundTiles, entityId) => {
                this.world = new World(
                    width,
                    height,
                    tiles,
                    backgroundTiles,
                    entityId
                );
            }
        );

        this.connection.on(
            'world-update',
            (updatedTiles: { tileIndex: number; tile: number }[]) => {
                updatedTiles.forEach((tile) => {
                    // set the broken tile to air in the world data
                    this.world.worldTiles[tile.tileIndex] = tile.tile;

                    // erase the broken tile and its surrounding tiles using two erasing rectangles in a + shape
                    this.world.tileLayer.erase();
                    this.world.tileLayer.noStroke();
                    this.world.tileLayer.rect(
                        ((tile.tileIndex % this.world.width) - 1) *
                            this.TILE_WIDTH,
                        Math.floor(tile.tileIndex / this.world.width) *
                            this.TILE_HEIGHT,
                        this.TILE_WIDTH * 3,
                        this.TILE_HEIGHT
                    );
                    this.world.tileLayer.rect(
                        (tile.tileIndex % this.world.width) * this.TILE_WIDTH,
                        (Math.floor(tile.tileIndex / this.world.width) - 1) *
                            this.TILE_HEIGHT,
                        this.TILE_WIDTH,
                        this.TILE_HEIGHT * 3
                    );
                    this.world.tileLayer.noErase();

                    // redraw the neighboring tiles
                    this.drawTile(tile.tileIndex);
                    this.drawTile(tile.tileIndex + this.world.width);
                    this.drawTile(tile.tileIndex - 1);
                    this.drawTile(tile.tileIndex - this.world.width);
                    this.drawTile(tile.tileIndex + 1);
                });
            }
        );

        // Update the player
        this.connection.on('set-player', (x, y, yVel, xVel) => {
            this.world.player.x = x;
            this.world.player.y = y;
            this.world.player.yVel = yVel;
            this.world.player.xVel = xVel;
        });

        this.connection.on('entities-update', (entities: (
            | { id: string; type: EntityType; data: object }
            )[]) => {
            this.world.updateEntities(entities)
        })

        // Update the other players in the world
        this.connection.on(
            'entity-snapshot',
            (snapshot: {
                id: string;
                time: number;
                state: { id: string; x: string; y: string }[];
            }) => {
                // If the world is not set
                if (this.world === undefined) return;

                // this.world.snapshotInterpolation.snapshot.add(snapshot);
                this.world.updatePlayers(snapshot)
            }
        );

        setInterval(() => {
            if (this.world === undefined) return;
            this.world.tick(this);
        }, 1000 / this.playerTickRate);

        // this.connection.emit(
        //     'create',
        //     "Numericly's Server",
        //     'Numericly',
        //     10,
        //     false
        // );
        this.connection.emit(
            'join',
            'e4022d403dcc6d19d6a68ba3abfd0a60',
            'player' + Math.floor(Math.random() * 1000)
        );

        // go for a scale of <64 tiles wide screen
        this.windowResized();

        // remove texture interpolation
        this.noSmooth();

        // the highest keycode is 255, which is "Toggle Touchpad", according to keycode.info
        for (let i = 0; i < 255; i++) {
            this.keys.push(false);
        }

        // set the framerate goal to as high as possible (this will end up capping to your monitor's refresh rate.)
        this.frameRate(Infinity);
    }

    draw() {
        // console.time("frame");

        // wipe the screen with a happy little layer of light blue
        this.background(129, 206, 243);

        // do the tick calculations
        this.doTicks();

        // update mouse position
        this.updateMouse();

        // update the camera's interpolation
        this.moveCamera();

        if (this.world !== undefined) this.world.render(this, this.upscaleSize);

        // render the player, all items, etc.  Basically any physicsRect or particle
        this.renderEntities();

        // draw the hot bar
        this.noStroke();
        this.textAlign(this.RIGHT, this.BOTTOM);
        this.textSize(5 * this.upscaleSize);
        for (let i = 0; i < this.hotBar.length; i++) {
            if (this.selectedSlot === i) {
                UiAssets.ui_slot_selected.render(
                    this,
                    2 * this.upscaleSize + 16 * i * this.upscaleSize,
                    2 * this.upscaleSize,
                    16 * this.upscaleSize,
                    16 * this.upscaleSize
                );
            } else {
                UiAssets.ui_slot.render(
                    this,
                    2 * this.upscaleSize + 16 * i * this.upscaleSize,
                    2 * this.upscaleSize,
                    16 * this.upscaleSize,
                    16 * this.upscaleSize
                );
            }

            if (this.hotBar[i] !== undefined) {
                this.fill(0);
                if (this.pickedUpSlot === i) {
                    this.tint(255, 127);
                    this.fill(0, 127);
                }

                this.hotBar[i].item.texture.render(
                    this,
                    6 * this.upscaleSize + 16 * i * this.upscaleSize,
                    6 * this.upscaleSize,
                    8 * this.upscaleSize,
                    8 * this.upscaleSize
                );

                this.text(
                    this.hotBar[i].stackSize,
                    16 * this.upscaleSize + 16 * i * this.upscaleSize,
                    16 * this.upscaleSize
                );

                this.noTint();
            }
        }

        // draw the cursor
        this.drawCursor();

        this.currentUi.render(this, this.upscaleSize);

        // console.timeEnd("frame");
    }

    windowResized() {
        this.resizeCanvas(this.windowWidth, this.windowHeight);

        // go for a scale of <48 tiles screen
        this.upscaleSize = Math.min(
            this.ceil(this.windowWidth / 48 / this.TILE_WIDTH),
            this.ceil(this.windowHeight / 48 / this.TILE_HEIGHT)
        );

        this.currentUi.windowUpdate();

        // if the world width or height are either less than 64, I think a bug will happen where the screen shakes.  If you need to, uncomment this code.

        // // if the world is too zoomed out, then zoom it in.
        // while (
        //     this.WORLD_WIDTH * this.TILE_WIDTH - this.width / this.upscaleSize <
        //         0 ||
        //     this.WORLD_HEIGHT * this.TILE_HEIGHT -
        //         this.height / this.upscaleSize <
        //         0
        // ) {
        //     this.upscaleSize += 2;
        // }
    }

    keyPressed() {
        this.keys[this.keyCode] = true;
        if (this.controls.includes(this.keyCode)) {
            // hot bar slots
            for (let i = 0; i < 12; i++) {
                if (this.keyCode === this.controls[i + 5]) {
                    if (
                        this.mouseX > 2 * this.upscaleSize &&
                        this.mouseX <
                            2 * this.upscaleSize +
                                16 * this.upscaleSize * this.hotBar.length &&
                        this.mouseY > 2 * this.upscaleSize &&
                        this.mouseY < 18 * this.upscaleSize
                    ) {
                        const temp = this.hotBar[i];
                        this.hotBar[i] =
                            this.hotBar[
                                this.floor(
                                    (this.mouseX - 2 * this.upscaleSize) /
                                        16 /
                                        this.upscaleSize
                                )
                            ];
                        this.hotBar[
                            this.floor(
                                (this.mouseX - 2 * this.upscaleSize) /
                                    16 /
                                    this.upscaleSize
                            )
                        ] = temp;
                    } else this.selectedSlot = i;
                    return;
                }
            }

            if (this.keyCode === this.controls[4]) {
                console.log('Inventory opened');
            }
        }
    }

    keyReleased() {
        this.keys[this.keyCode] = false;
    }

    // when it's dragged update the sliders
    mouseDragged() {
        for(const i of this.currentUi.sliders) {
            i.updateSliderPosition(this.mouseX, this.mouseY);
        }
    }

    mouseMoved() {
        for(const i of this.currentUi.buttons) {
            i.updateMouseOver(this.mouseX, this.mouseY);
        }
    }

    mousePressed() {
        // image(uiSlotImage, 2*upscaleSize+16*i*upscaleSize, 2*upscaleSize, 16*upscaleSize, 16*upscaleSize);
        if(this.currentUi !== undefined) {
            this.currentUi.mousePressed();
            for(const i of this.currentUi.sliders) {
                i.updateSliderPosition(this.mouseX, this.mouseY);
            }
            return;
        }
            if (
                this.mouseX > 2 * this.upscaleSize &&
                this.mouseX <
                    2 * this.upscaleSize +
                        16 * this.upscaleSize * this.hotBar.length &&
                this.mouseY > 2 * this.upscaleSize &&
                this.mouseY < 18 * this.upscaleSize
            ) {
                const clickedSlot: number = this.floor(
                    (this.mouseX - 2 * this.upscaleSize) / 16 / this.upscaleSize
                );

                if (this.pickedUpSlot === -1) {
                    if (this.hotBar[clickedSlot] !== undefined) {
                        this.pickedUpSlot = clickedSlot;
                    }
                } else {
                    // Swap clicked slot with the picked slot
                    [this.hotBar[this.pickedUpSlot], this.hotBar[clickedSlot]] = [
                        this.hotBar[clickedSlot],
                        this.hotBar[this.pickedUpSlot],
                    ];

                    // Set the picked up slot to nothing
                    this.pickedUpSlot = -1;
                }
            } else {
                // If the tile is air
                if (
                    this.world.worldTiles[
                        this.world.width * this.worldMouseY + this.worldMouseX
                    ] === 0
                )
                    return;

                this.connection.emit(
                    'world-break-start',
                    this.world.width * this.worldMouseY + this.worldMouseX
                );
                this.connection.emit('world-break-finish');
                /*
                const tile: Tile =
                    Tiles[
                        this.world.worldTiles[
                            this.WORLD_WIDTH * this.worldMouseY + this.worldMouseX
                        ]
                    ];

                if (tile === undefined) return;

                if (tile.itemDrop !== undefined) {
                    // Default drop quantity
                    let quantity: number = 1;

                    // Update the quantity based on
                    if (
                        tile.itemDropMax !== undefined &&
                        tile.itemDropMin !== undefined
                    ) {
                        quantity = Math.round(
                            Math.random() * (tile.itemDropMax - tile.itemDropMin) +
                                tile.itemDropMin
                        );
                    } else if (tile.itemDropMax !== undefined) {
                        quantity = tile.itemDropMax;
                    }

                    this.dropItemStack(
                        new ItemStack(tile.itemDrop, quantity),
                        this.worldMouseX,
                        this.worldMouseY
                    );
                }



                */
            }
    }

    mouseReleased() {
        const releasedSlot: number = this.floor(
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
                this.dropItemStack(
                    this.hotBar[this.pickedUpSlot],
                    (this.interpolatedCamX * this.TILE_WIDTH +
                        this.mouseX / this.upscaleSize) /
                        this.TILE_WIDTH,
                    (this.interpolatedCamY * this.TILE_HEIGHT +
                        this.mouseY / this.upscaleSize) /
                        this.TILE_HEIGHT
                );
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

    drawTile(tileIndex: number) {
        if (this.world.worldTiles[tileIndex] !== 0) {
            // Draw the correct image for the tile onto the tile layer

            const tile: Tile = Tiles[this.world.worldTiles[tileIndex]];

            // if the tile is off-screen
            if (tile === undefined) {
                return;
            }

            if (tile.connected && tile.texture instanceof TileResource) {
                // test if the neighboring tiles are solid
                // console.log(Math.floor((tileIndex - this.world.width) / this.world.width))
                const topTileBool =
                    Math.floor(
                        (tileIndex - this.world.width) / this.world.width
                    ) <= 0 ||
                    this.world.worldTiles[tileIndex - this.world.width] !== 0;
                const leftTileBool =
                    tileIndex % this.world.width === 0 ||
                    this.world.worldTiles[tileIndex - 1] !== 0;
                const bottomTileBool =
                    Math.floor(
                        (tileIndex - this.world.width) / this.world.width
                    ) >=
                        this.world.height - 1 ||
                    this.world.worldTiles[tileIndex + this.world.width] !== 0;
                const rightTileBool =
                    tileIndex % this.world.width === this.world.width - 1 ||
                    this.world.worldTiles[tileIndex + 1] !== 0;

                // convert 4 digit binary number to base 10
                const tileSetIndex =
                    8 * +topTileBool +
                    4 * +rightTileBool +
                    2 * +bottomTileBool +
                    +leftTileBool;

                // Render connected tile
                tile.texture.renderTile(
                    tileSetIndex,
                    this.world.tileLayer,
                    (tileIndex % this.world.width) * this.TILE_WIDTH,
                    Math.floor(tileIndex / this.world.width) * this.TILE_HEIGHT,
                    this.TILE_WIDTH,
                    this.TILE_HEIGHT
                );
            } else if (
                !tile.connected &&
                tile.texture instanceof ImageResource
            ) {
                // Render non-connected tile
                tile.texture.render(
                    this.world.tileLayer,
                    tileIndex % this.world.width,
                    Math.floor(tileIndex / this.world.width),
                    this.TILE_WIDTH,
                    this.TILE_HEIGHT
                );
            }
        }
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
                "lag spike detected, tick calculations couldn't keep up"
            );
        }
        this.amountSinceLastTick = this.msSinceTick / this.msPerTick;
    }

    doTick() {
        if(this.world.player === undefined)
            return
        this.world.player.keyboardInput();
        this.world.player.applyGravityAndDrag();
        this.world.player.applyVelocityAndCollide();

        this.pCamX = this.camX;
        this.pCamY = this.camY;
        const desiredCamX =
            this.world.player.x +
            this.world.player.width / 2 -
            this.width / 2 / this.TILE_WIDTH / this.upscaleSize +
            this.world.player.xVel * 40;
        const desiredCamY =
            this.world.player.y +
            this.world.player.height / 2 -
            this.height / 2 / this.TILE_HEIGHT / this.upscaleSize +
            this.world.player.yVel * 20;
        this.camX = (desiredCamX + this.camX * 24) / 25;
        this.camY = (desiredCamY + this.camY * 24) / 25;

        if (this.camX < 0) {
            this.camX = 0;
        } else if (
            this.camX >
            this.WORLD_WIDTH - this.width / this.upscaleSize / this.TILE_WIDTH
        ) {
            this.camX =
                this.WORLD_WIDTH -
                this.width / this.upscaleSize / this.TILE_WIDTH;
        }
        if (
            this.camY >
            this.WORLD_HEIGHT -
                this.height / this.upscaleSize / this.TILE_HEIGHT
        ) {
            this.camY =
                this.WORLD_HEIGHT -
                this.height / this.upscaleSize / this.TILE_HEIGHT;
        }

        for (const item of this.items) {
            item.goTowardsPlayer();
            item.combineWithNearItems();
            item.applyGravityAndDrag();
            item.applyVelocityAndCollide();
        }

        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].deleted === true) {
                this.items.splice(i, 1);
                i--;
            }
        }
    }

    uiFrameRect(x: number, y: number, w: number, h: number) {
        // set the coords and dimensions to round to the nearest un-upscaled pixel
        x = this.round(x / this.upscaleSize) * this.upscaleSize;
        y = this.round(y / this.upscaleSize) * this.upscaleSize;
        w = this.round(w / this.upscaleSize) * this.upscaleSize;
        h = this.round(h / this.upscaleSize) * this.upscaleSize;

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
            7
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
            7
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
            7
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
            7
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
            7
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
            7
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
            1
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
            1
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
            1
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
        rayH?: any
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
        this.fill(255, 0, 0);
        this.noStroke();
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

        for (const item of this.items) {
            item.findInterpolatedCoordinates();

            item.itemStack.item.texture.render(
                this,
                (item.interpolatedX * this.TILE_WIDTH -
                    this.interpolatedCamX * this.TILE_WIDTH) *
                    this.upscaleSize,
                (item.interpolatedY * this.TILE_HEIGHT -
                    this.interpolatedCamY * this.TILE_HEIGHT) *
                    this.upscaleSize,
                item.w * this.upscaleSize * this.TILE_WIDTH,
                item.h * this.upscaleSize * this.TILE_HEIGHT
            );

            // Render the item quantity label
            this.fill(0);

            this.noStroke();

            this.textAlign(this.RIGHT, this.BOTTOM);
            this.textSize(5 * this.upscaleSize);

            this.text(
                item.itemStack.stackSize,
                (item.interpolatedX * this.TILE_WIDTH -
                    this.interpolatedCamX * this.TILE_WIDTH) *
                    this.upscaleSize,
                (item.interpolatedY * this.TILE_HEIGHT -
                    this.interpolatedCamY * this.TILE_HEIGHT) *
                    this.upscaleSize
            );
        }
    }

    dropItemStack(itemStack: ItemStack, x: number, y: number) {
        this.items.push(
            new EntityItem(
                itemStack,
                x,
                y,
                0.5,
                0.5,
                this.random(-0.1, 0.1),
                this.random(-0.1, 0)
            )
        );
    }

    pickUpItem(itemStack: ItemStack): boolean {
        for (let i = 0; i < this.hotBar.length; i++) {
            const item = this.hotBar[i];

            // If there are no items in the current slot of the hotBar
            if (item === undefined) {
                this.hotBar[i] = itemStack;
                return true;
            }

            if (
                item.item === itemStack.item &&
                item.stackSize < item.item.maxStackSize
            ) {
                const remainingSpace = item.item.maxStackSize - item.stackSize;

                // Top off the stack with items if it can take more than the stack being added
                if (remainingSpace >= itemStack.stackSize) {
                    this.hotBar[i].stackSize =
                        item.stackSize + itemStack.stackSize;
                    return true;
                }

                itemStack.stackSize -= remainingSpace;

                this.hotBar[i].stackSize = itemStack.item.maxStackSize;
            }
        }
        console.error(
            `Could not pickup ${itemStack.stackSize} ${itemStack.item.name}`
        );
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
        this.worldMouseX = this.floor(
            (this.interpolatedCamX * this.TILE_WIDTH +
                this.mouseX / this.upscaleSize) /
                this.TILE_WIDTH
        );
        this.worldMouseY = this.floor(
            (this.interpolatedCamY * this.TILE_HEIGHT +
                this.mouseY / this.upscaleSize) /
                this.TILE_HEIGHT
        );
    }

    drawCursor() {
        if (this.mouseOn) {
            if (this.pickedUpSlot > -1) {
                this.hotBar[this.pickedUpSlot].item.texture.render(
                    this,
                    this.mouseX,
                    this.mouseY,
                    8 * this.upscaleSize,
                    8 * this.upscaleSize
                );

                this.text(
                    this.hotBar[this.pickedUpSlot].stackSize,
                    this.mouseX + 10 * this.upscaleSize,
                    this.mouseY + 10 * this.upscaleSize
                );
            }
        }
    }
}
export = Game
