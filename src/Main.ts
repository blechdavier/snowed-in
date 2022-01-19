import P5 from 'p5'

/*
TODO:

sounds
NPC's
dirt
stone
better world generation
font consistency
finish item management
pause menu
fix cursor input lag (separate cursor and animation images)
fix stuck on side of block bug
fix collide with sides of map bug







item management behavior todo:

merge
right click stack to pick up ceil(half of it)
right click when picked up to add 1 if 0 or match

*/




let tempcol

const WORLD_WIDTH = 512 // width of the world in tiles
const WORLD_HEIGHT = 64 // height of the world in tiles

const TILE_WIDTH = 8 // width of a tile in pixels
const TILE_HEIGHT = 8 // height of a tile in pixels
const BACK_TILE_WIDTH = 12 // width of a tile in pixels
const BACK_TILE_HEIGHT = 12 // height of a tile in pixels
const TILE_SET_SIZE = 16 // number of tiles in the tile set (do not change this as parts of the program will break)

let backTileLayerOffsetWidth = -2 // calculated in the setup function, this variable is the number of pixels left of a tile to draw a background tile from at the same position
let backTileLayerOffsetHeight = -2 // calculated in the setup function, this variable is the number of pixels above a tile to draw a background tile from at the same position

let upscaleSize = 6 // number of screen pixels per texture pixels (think of this as hud scale in Minecraft)

const worldTiles = new Uint8Array(WORLD_WIDTH * WORLD_HEIGHT) // number for each tile in the world ex: [1, 1, 0, 1, 2, 0, 0, 1...  ] means snow, snow, air, snow, ice, air, air, snow...
const backgroundTiles = new Uint8Array(WORLD_WIDTH * WORLD_HEIGHT) // number for each background tile in the world ex: [1, 1, 0, 1, 2, 0, 0, 1...  ] means snow, snow, air, snow, ice, air, air, snow...

let camX = 0 // position of the top left corner of the screen in un-up-scaled pixels (0 is left of world) (WORLD_WIDTH*TILE_WIDTH is bottom of world)
let camY = 0 // position of the top left corner of the screen in un-up-scaled pixels (0 is top of world) (WORLD_HEIGHT*TILE_HEIGHT is bottom of world)
let pCamX = 0 // last frame's x of the camera
let pCamY = 0 // last frame's y of the camera
let interpolatedCamX = 0 // interpolated position of the camera
let interpolatedCamY = 0 // interpolated position of the camera

// tick management
let msSinceTick = 0 // this is the running counter of how many milliseconds it has been since the last tick.  The game can then
const msPerTick = 20 // the number of milliseconds per game tick.  1000/msPerTick = ticks per second
let amountSinceLastTick = 0 // this is a variable calculated every frame used for interpolation - domain[0,1)
const forgivenessCount = 50 // if the computer needs to do more than 50 ticks in a single frame, then it could be running behind, probably because of a freeze or the user being on a different tab.  In these cases, it's probably best to just ignore that any time has passed to avoid further freezing

// physics constants
const GRAVITY_SPEED = 0.04 // in units per second tick, positive means downward gravity, negative means upward gravity
const DRAG_COEFFICIENT = 0.21 // arbitrary number, 0 means no drag

// player instance holder
let player: any

// array for all the non-player physicsRects
const physicsRects: any = []

// CHARACTER SHOULD BE ROUGHLY 12 PIXELS BY 20 PIXELS

const TILE_SET_POSITIONS = [
    undefined, // air
    0, // snow
    1, // ice
]

const TILE_BROKEN = [
    // what drops when you break a tile
    // [broken, broken_quantity]
    [undefined, undefined],
    [4, 4],
    [5, 4],
]

const ITEM_DATA = [
    // ["name", "description", #stackSize]
    [undefined, undefined, Infinity],
    ['Snowberries', 'Tasty.', 100],
    ['Snow Tile', 'Can be placed.', 1000],
    ['Ice Tile', 'Can be placed.', 1000],
    [
        'Snowball',
        'Can be thrown or 4 can be compacted to make Snow Tile.',
        1000,
    ],
    ['Ice Shards', '4 can be compacted to make Ice Tile.', 1000],
]

// const FRICTION_CONSTANTS = [
//     0,              //air
//     0.3,                      //snow
//     0.05,                      //ice
// ];

const hotBar = [
    [1, 5],
    [0, 0],
    [1, 90],
    [1, 100],
    [1, 8],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
]
let selectedSlot = 0
let pickedUpSlot = -1
let pickUpAbleItems: any

let worldMouseX = 0 // the mouse position in world coordinates
let worldMouseY = 0 // the mouse position in world coordinates
let mouseOn = true // is the mouse on the window?

const keys: any = []

// world info

const isSnowing = true

// performance

const particleMultiplier = 1.0
// maybe add particle interpolation.

// particle layers

const backgroundParticles: any = []
const foregroundParticles: any = []

// cursor stuff
let cursorAnimFrame = 0
let msSinceCursorAnimFrame = 0
const msPerCursorAnimFrame = 100
const cursorIndex = 1

// the keycode for the key that does the action
const controls = [
    68, // right
    65, // left
    87, // jump
    27, // settings
    69, // inventory?
    49, // hot bar 1
    50, // hot bar 2
    51, // hot bar 3
    52, // hot bar 4
    52, // hot bar 5
    54, // hot bar 6
    55, // hot bar 7
    56, // hot bar 8
    57, // hot bar 9
    48, // hot bar 10
    189, // hot bar 11
    187, // hot bar 12
]

let canvas: P5.Renderer

let tileLayer: P5.Graphics
let backTileLayer: P5.Graphics

let assets: any

const sketch = (p5js: P5) => {
    p5js.preload = () => {
        // load all the in-game assets
        assets = {
            tileSetImage: p5js.loadImage(
                'https://blechdavier.github.io/flexfriday/assets/textures/tilesets/middleground/indexedtileset.png'
            ), // the image that holds all versions of each tile (snow, ice, etc.)
            backgroundTileSetImage: p5js.loadImage(
                'https://blechdavier.github.io/flexfriday/assets/textures/tilesets/background/backgroundsnow.png'
            ), // the image that holds each background tile (snow, ice, etc.)
            uiSlotImage: p5js.loadImage(
                'https://blechdavier.github.io/flexfriday/assets/textures/ui/uislot.png'
            ), // the image of each UI slot
            selectedUISlotImage: p5js.loadImage(
                'https://blechdavier.github.io/flexfriday/assets/textures/ui/selecteduislot.png'
            ), // the image of the selected UI slot
            itemsImage: p5js.loadImage(
                'https://blechdavier.github.io/flexfriday/assets/textures/items/items.png'
            ), // the image that holds all item images (tile of snow, winterberries, etc.)
            TitleFont: p5js.loadFont(
                'https://blechdavier.github.io/flexfriday/assets/fonts/Cave-Story.ttf'
            ), // the font
            snowflakeImage: p5js.loadImage(
                'https://blechdavier.github.io/flexfriday/assets/textures/particles/snowflakes.png'
            ), // the image containing two snowflakes that are randomly chosen between.

            // load the cursor images
            cursors: [
                [
                    p5js.loadImage(
                        'https://blechdavier.github.io/flexfriday/assets/textures/cursors/cursor.png'
                    ),
                ],
                [
                    p5js.loadImage(
                        'https://blechdavier.github.io/flexfriday/assets/textures/cursors/cursor_dig_0.png'
                    ),
                    p5js.loadImage(
                        'https://blechdavier.github.io/flexfriday/assets/textures/cursors/cursor_dig_1.png'
                    ),
                    p5js.loadImage(
                        'https://blechdavier.github.io/flexfriday/assets/textures/cursors/cursor_dig_2.png'
                    ),
                    p5js.loadImage(
                        'https://blechdavier.github.io/flexfriday/assets/textures/cursors/cursor_dig_3.png'
                    ),
                    p5js.loadImage(
                        'https://blechdavier.github.io/flexfriday/assets/textures/cursors/cursor_dig_4.png'
                    ),
                    p5js.loadImage(
                        'https://blechdavier.github.io/flexfriday/assets/textures/cursors/cursor_dig_5.png'
                    ),
                    p5js.loadImage(
                        'https://blechdavier.github.io/flexfriday/assets/textures/cursors/cursor_dig_6.png'
                    ),
                    p5js.loadImage(
                        'https://blechdavier.github.io/flexfriday/assets/textures/cursors/cursor_dig_7.png'
                    ),
                    p5js.loadImage(
                        'https://blechdavier.github.io/flexfriday/assets/textures/cursors/cursor_dig_8.png'
                    ),
                    p5js.loadImage(
                        'https://blechdavier.github.io/flexfriday/assets/textures/cursors/cursor_dig_9.png'
                    ),
                    p5js.loadImage(
                        'https://blechdavier.github.io/flexfriday/assets/textures/cursors/cursor_dig_10.png'
                    ),
                    p5js.loadImage(
                        'https://blechdavier.github.io/flexfriday/assets/textures/cursors/cursor_dig_11.png'
                    ),
                ],
            ],
        }
    }

    p5js.setup = () => {
        // make a canvas that fills the whole screen (a canvas is what is drawn to in p5.js, as well as lots of other JS rendering libraries)
        canvas = p5js.createCanvas(p5js.windowWidth, p5js.windowHeight)
        canvas.mouseOut(mouseExited)
        canvas.mouseOver(mouseEntered)

        player = new PhysicsRect(
            16,
            4,
            12 / TILE_WIDTH,
            20 / TILE_HEIGHT,
            0,
            0,
            true
        )

        // go for a scale of <64 tiles wide screen
        upscaleSize = p5js.ceil(p5js.windowWidth / 64 / TILE_WIDTH / 2) * 2

        // if the world is too zoomed out, then zoom it in.
        while (
            WORLD_WIDTH * TILE_WIDTH - p5js.width / upscaleSize < 0 ||
            WORLD_HEIGHT * TILE_HEIGHT - p5js.height / upscaleSize < 0
        ) {
            upscaleSize += 2
        }

        // turn off the cursor image
        p5js.noCursor()

        // remove texture interpolation
        p5js.noSmooth()

        // define the p5.Graphics objects that hold an image of the tiles of the world.  These act sort of like a virtual canvas and can be drawn on just like a normal canvas by using tileLayer.rect();, tileLayer.ellipse();, tileLayer.fill();, etc.
        tileLayer = p5js.createGraphics(
            WORLD_WIDTH * TILE_WIDTH,
            WORLD_HEIGHT * TILE_HEIGHT
        )
        backTileLayer = p5js.createGraphics(
            WORLD_WIDTH * TILE_WIDTH,
            WORLD_HEIGHT * TILE_HEIGHT
        )

        // calculate these variables:
        backTileLayerOffsetWidth = (TILE_WIDTH - BACK_TILE_WIDTH) / 2 // calculated in the setup function, this variable is the number of pixels left of a tile to draw a background tile from at the same position
        backTileLayerOffsetHeight = (TILE_HEIGHT - BACK_TILE_HEIGHT) / 2 // calculated in the setup function, this variable is the number of pixels above a tile to draw a background tile from at the same position

        // generate and draw the world onto the p5.Graphics objects
        generateWorld()

        // the highest keycode is 255, which is "Toggle Touchpad", according to keycode.info
        for (let i = 0; i < 255; i++) {
            keys.push(false)
        }

        updatePickUpAbleItems()

        // set the framerate goal to as high as possible (this will end up capping to your monitor's refresh rate.)
        p5js.frameRate(Infinity)
    }

    /*
   /$$      /$$           /$$                 /$$
  | $$$    /$$$          |__/                | $$
  | $$$$  /$$$$  /$$$$$$  /$$ /$$$$$$$       | $$        /$$$$$$   /$$$$$$   /$$$$$$  /$$
  | $$ $$/$$ $$ |____  $$| $$| $$__  $$      | $$       /$$__  $$ /$$__  $$ /$$__  $$|__/
  | $$  $$$| $$  /$$$$$$$| $$| $$  \ $$      | $$      | $$  \ $$| $$  \ $$| $$  \ $$
  | $$\  $ | $$ /$$__  $$| $$| $$  | $$      | $$      | $$  | $$| $$  | $$| $$  | $$ /$$
  | $$ \/  | $$|  $$$$$$$| $$| $$  | $$      | $$$$$$$$|  $$$$$$/|  $$$$$$/| $$$$$$$/|__/
  |__/     |__/ \_______/|__/|__/  |__/      |________/ \______/  \______/ | $$____/
                                                                           | $$
                                                                           | $$
                                                                           |__/
  */

    p5js.draw = () => {
        // console.time("frame");

        // wipe the screen with a happy little layer of light blue
        p5js.background(129, 206, 243)

        // do the tick calculations
        doTicks()

        // update mouse position
        updateMouse()

        // update the camera's interpolation
        moveCamera()

        // draw the background tile layer onto the screen
        p5js.image(
            backTileLayer,
            0,
            0,
            p5js.width,
            p5js.height,
            interpolatedCamX * TILE_WIDTH,
            interpolatedCamY * TILE_WIDTH,
            p5js.width / upscaleSize,
            p5js.height / upscaleSize
        )

        // draw the tile layer onto the screen
        p5js.image(
            tileLayer,
            0,
            0,
            p5js.width,
            p5js.height,
            interpolatedCamX * TILE_WIDTH,
            interpolatedCamY * TILE_WIDTH,
            p5js.width / upscaleSize,
            p5js.height / upscaleSize
        )

        // render the player, all items, etc.  Basically any physicsRect or particle
        renderEntities()

        // draw the hot bar
        p5js.noStroke()
        p5js.textAlign(p5js.RIGHT, p5js.BOTTOM)
        p5js.textSize(5 * upscaleSize)
        for (let i = 0; i < hotBar.length; i++) {
            if (selectedSlot === i) {
                p5js.image(
                    assets.selectedUISlotImage,
                    2 * upscaleSize + 16 * i * upscaleSize,
                    2 * upscaleSize,
                    16 * upscaleSize,
                    16 * upscaleSize
                )
            } else {
                p5js.image(
                    assets.uiSlotImage,
                    2 * upscaleSize + 16 * i * upscaleSize,
                    2 * upscaleSize,
                    16 * upscaleSize,
                    16 * upscaleSize
                )
            }
            if (hotBar[i][0] !== 0) {
                p5js.fill(0)
                if (pickedUpSlot === i) {
                    if (hotBar[i][1] > 1) {
                        p5js.text(
                            hotBar[i][1],
                            p5js.mouseX + 16 * upscaleSize,
                            p5js.mouseY + 16 * upscaleSize
                        )
                    }
                    p5js.tint(255, 127)
                    p5js.fill(0, 127)
                }
                p5js.image(
                    assets.itemsImage,
                    6 * upscaleSize + 16 * i * upscaleSize,
                    6 * upscaleSize,
                    8 * upscaleSize,
                    8 * upscaleSize,
                    8 * hotBar[i][0] - 8,
                    0,
                    8,
                    8
                )
                if (hotBar[i][1] > 1) {
                    p5js.text(
                        hotBar[i][1],
                        16 * upscaleSize + 16 * i * upscaleSize,
                        16 * upscaleSize
                    )
                }
                p5js.noTint()
            }
        }

        // draw the cursor
        drawCursor()

        // console.timeEnd("frame");
    }

    function moveCamera() {
        interpolatedCamX = pCamX + (camX - pCamX) * amountSinceLastTick
        interpolatedCamY = pCamY + (camY - pCamY) * amountSinceLastTick
    }

    function generateWorld() {
        // this generation algorithm is by no means optimized
        for (let i = 0; i < WORLD_HEIGHT; i++) {
            // i will be the y position of tile being generated
            for (let j = 0; j < WORLD_WIDTH; j++) {
                // j is x position " "    "      "
                if (belowTerrainHeight(j, i)) {
                    if (belowIceHeight(j, i)) {
                        worldTiles[i * WORLD_WIDTH + j] = 2
                    } else {
                        worldTiles[i * WORLD_WIDTH + j] = 1
                    }
                } else {
                    worldTiles[i * WORLD_WIDTH + j] = 0
                }
            }
        }
        for (let i = 0; i < WORLD_HEIGHT; i++) {
            // i will be the y position of background tile being generated
            for (let j = 0; j < WORLD_WIDTH; j++) {
                // j is x position " "    "      "
                // if this tile and its eight surrounding tiles are below the height of the terrain (at one point could be a tile of snow, ice, etc.), then add a background tile there.
                if (
                    belowTerrainHeight(j - 1, i - 1) &&
                    belowTerrainHeight(j - 1, i) &&
                    belowTerrainHeight(j - 1, i + 1) &&
                    belowTerrainHeight(j, i - 1) &&
                    belowTerrainHeight(j, i) &&
                    belowTerrainHeight(j, i + 1) &&
                    belowTerrainHeight(j + 1, i - 1) &&
                    belowTerrainHeight(j + 1, i) &&
                    belowTerrainHeight(j + 1, i + 1)
                ) {
                    backgroundTiles[i * WORLD_WIDTH + j] = 1
                } else {
                    backgroundTiles[i * WORLD_WIDTH + j] = 0
                }
            }
        }
        for (let i = 0; i < WORLD_HEIGHT; i++) {
            // i will be the y position of tile being drawn
            for (let j = 0; j < WORLD_WIDTH; j++) {
                // j is x position " "    "      "
                if (worldTiles[i * WORLD_WIDTH + j] !== 0) {
                    // test if the neighboring tiles are solid
                    const topTileBool =
                        i === 0 || worldTiles[(i - 1) * WORLD_WIDTH + j] !== 0
                    const leftTileBool =
                        j === 0 || worldTiles[i * WORLD_WIDTH + j - 1] !== 0
                    const bottomTileBool =
                        i === WORLD_HEIGHT - 1 ||
                        worldTiles[(i + 1) * WORLD_WIDTH + j] !== 0
                    const rightTileBool =
                        j === WORLD_WIDTH - 1 ||
                        worldTiles[i * WORLD_WIDTH + j + 1] !== 0

                    // convert 4 digit binary number to base 10
                    const tileSetIndex =
                        8 * +topTileBool +
                        4 * +rightTileBool +
                        2 * +bottomTileBool +
                        +leftTileBool

                    // draw the correct image for the tile onto the tile layer
                    tileLayer.image(
                        assets.tilesetImage,
                        j * TILE_WIDTH,
                        i * TILE_HEIGHT,
                        TILE_WIDTH,
                        TILE_HEIGHT,
                        (TILE_SET_POSITIONS[worldTiles[i * WORLD_WIDTH + j]] *
                            TILE_SET_SIZE +
                            tileSetIndex) *
                            TILE_WIDTH,
                        0,
                        TILE_WIDTH,
                        TILE_HEIGHT
                    )
                }
                if (backgroundTiles[i * WORLD_WIDTH + j] !== 0) {
                    // draw the correct image for the background tile onto the background tile layer
                    backTileLayer.image(
                        assets.backgroundTilesetImage,
                        j * TILE_WIDTH + backTileLayerOffsetWidth,
                        i * TILE_HEIGHT + backTileLayerOffsetHeight,
                        BACK_TILE_WIDTH,
                        BACK_TILE_HEIGHT,
                        TILE_SET_POSITIONS[
                            backgroundTiles[i * WORLD_WIDTH + j]
                        ] * BACK_TILE_WIDTH,
                        0,
                        BACK_TILE_WIDTH,
                        BACK_TILE_HEIGHT
                    )
                }
            }
        }
    }

    function drawTile(j?: any, i?: any) {
        if (worldTiles[i * WORLD_WIDTH + j] !== 0) {
            // test if the neighboring tiles are solid
            const topTileBool =
                i === 0 || worldTiles[(i - 1) * WORLD_WIDTH + j] !== 0
            const leftTileBool =
                j === 0 || worldTiles[i * WORLD_WIDTH + j - 1] !== 0
            const bottomTileBool =
                i === WORLD_HEIGHT - 1 ||
                worldTiles[(i + 1) * WORLD_WIDTH + j] !== 0
            const rightTileBool =
                j === WORLD_WIDTH - 1 || worldTiles[i * WORLD_WIDTH + j + 1] !== 0

            // convert 4 digit binary number to base 10
            const tileSetIndex =
                8 * +topTileBool +
                4 * +rightTileBool +
                2 * +bottomTileBool +
                +leftTileBool

            // draw the correct image for the tile onto the tile layer
            tileLayer.image(
                assets.tilesetImage,
                j * TILE_WIDTH,
                i * TILE_HEIGHT,
                TILE_WIDTH,
                TILE_HEIGHT,
                TILE_SET_POSITIONS[worldTiles[i * WORLD_WIDTH + j]] *
                    TILE_WIDTH *
                    TILE_SET_SIZE +
                    tileSetIndex * TILE_WIDTH,
                0,
                TILE_WIDTH,
                TILE_HEIGHT
            )
        }
    }

    function belowTerrainHeight(x?: any, y?: any) {
        return p5js.noise(x / 50) * 16 + 20 < y
    }

    function belowIceHeight(x?: any, y?: any) {
        return p5js.noise(x / 50) * 6 + 31 < y + 0
    }

    // function keyReleased() {
    //     ts++;
    // }

    function doTicks() {
        // increase the time since a tick has happened by deltaTime, which is a built-in p5.js value
        msSinceTick += p5js.deltaTime

        // define a temporary variable called ticksThisFrame - this is used to keep track of how many ticks have been calculated within the duration of the current frame.  As long as this value is less than the forgivenessCount variable, it continues to calculate ticks as necessary.
        let ticksThisFrame = 0
        while (msSinceTick > msPerTick && ticksThisFrame !== forgivenessCount) {
            // console.time("tick");
            doTick()
            // console.timeEnd("tick");
            msSinceTick -= msPerTick
            ticksThisFrame++
        }
        if (ticksThisFrame === forgivenessCount) {
            msSinceTick = 0
            console.warn(
                "lag spike detected, tick calculations couldn't keep up"
            )
        }
        amountSinceLastTick = msSinceTick / msPerTick
    }

    function doTick() {
        player.keyboardInput()
        player.applyGravityAndDrag()
        player.applyVelocityAndCollide()

        pCamX = camX
        pCamY = camY
        const desiredCamX =
            player.x +
            player.w / 2 -
            p5js.width / 2 / TILE_WIDTH / upscaleSize +
            player.xVel * 40
        const desiredCamY =
            player.y +
            player.h / 2 -
            p5js.height / 2 / TILE_HEIGHT / upscaleSize +
            player.yVel * 20
        camX = (desiredCamX + camX * 24) / 25
        camY = (desiredCamY + camY * 24) / 25

        if (camX < 0) {
            camX = 0
        } else if (camX > WORLD_WIDTH - p5js.width / upscaleSize / TILE_WIDTH) {
            camX = WORLD_WIDTH - p5js.width / upscaleSize / TILE_WIDTH
        }
        if (camY > WORLD_HEIGHT - p5js.height / upscaleSize / TILE_HEIGHT) {
            camY = WORLD_HEIGHT - p5js.height / upscaleSize / TILE_HEIGHT
        }

        for (const item of backgroundParticles) {
            item.updatePhysics()
        }
        for (const item of foregroundParticles) {
            item.updatePhysics()
        }

        for (const item of physicsRects) {
            if (item.type === 'item') {
                item.goTowardsPlayer()
            }
            item.applyGravityAndDrag()
            item.applyVelocityAndCollide()
        }

        for (let i = 0; i < physicsRects.length; i++) {
            if (physicsRects[i].deleted === true) {
                physicsRects.splice(i, 1)
                i--
            }
        }

    }

    /*
   /$$$$$$$                       /$$     /$$           /$$
  | $$__  $$                     | $$    |__/          | $$
  | $$  \ $$ /$$$$$$   /$$$$$$  /$$$$$$   /$$  /$$$$$$$| $$  /$$$$$$   /$$$$$$$ /$$
  | $$$$$$$/|____  $$ /$$__  $$|_  $$_/  | $$ /$$_____/| $$ /$$__  $$ /$$_____/|__/
  | $$____/  /$$$$$$$| $$  \__/  | $$    | $$| $$      | $$| $$$$$$$$|  $$$$$$
  | $$      /$$__  $$| $$        | $$ /$$| $$| $$      | $$| $$_____/ \____  $$ /$$
  | $$     |  $$$$$$$| $$        |  $$$$/| $$|  $$$$$$$| $$|  $$$$$$$ /$$$$$$$/|__/
  |__/      \_______/|__/         \___/  |__/ \_______/|__/ \_______/|_______/

  */

    class SnowFlake {
        x: any
        y: any
        isForeground: any
        xVel: any
        yVel: any
        snowflakeIndex: any

        constructor(x?: any, y?: any, isForeground?: any) {
            this.x = x
            this.y = y
            this.isForeground = isForeground
            this.xVel = p5js.random(-0.4, 0.4)
            this.yVel = p5js.random(0.6, 0.9)
            this.snowflakeIndex = p5js.floor(p5js.random(2))
        }

        updatePhysics() {
            this.xVel += p5js.random(-0.05, 0.05)
            this.x += this.xVel
            this.y += this.yVel
        }

        display() {
            p5js.image(
                assets.snowflakeImage,
                ((this.x - camX) / TILE_WIDTH) * upscaleSize,
                ((this.y - camY) / TILE_HEIGHT) * upscaleSize,
                3,
                3,
                this.snowflakeIndex * 3,
                0,
                3,
                3
            )
        }
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
    class PhysicsRect {
        x: any
        y: any
        w: any
        h: any
        xVel: any
        yVel: any
        mass: any
        controllable: any
        grounded: any
        collisionData: any
        closestCollision: any
        interpolatedX
        interpolatedY
        pX: any
        pY: any
        pXVel: any
        pYVel: any
        type: any
        itemType: any
        deleted: any
        slideX: any
        slideY: any

        constructor(
            x?: any,
            y?: any,
            w?: any,
            h?: any,
            xVel?: any,
            yVel?: any,
            controllable?: any,
            mass = w * h
        ) {
            // generic
            this.x = x
            this.y = y
            this.w = w
            this.h = h
            this.xVel = xVel
            this.yVel = yVel
            this.mass = mass

            this.controllable = controllable

            this.grounded = false

            this.closestCollision = [1, 0, Infinity]

            this.interpolatedX = x
            this.interpolatedY = y

            this.pX = x - xVel
            this.pY = y - yVel
            this.pXVel = xVel
            this.pYVel = yVel

            // for items
            this.deleted = false
        }

        keyboardInput() {
            if (this.controllable) {
                this.xVel +=
                    0.02 *
                    (+(!!keys[68] || !!keys[39]) - +(!!keys[65] || !!keys[37]))
                if (this.grounded && (keys[87] || keys[38] || keys[32])) {
                    this.yVel = -1.5
                }
            }
        }

        goTowardsPlayer() {
            if (
                pickUpAbleItems[this.itemType] &&
                (this.x + this.w / 2 - player.x - player.w / 2) *
                    (this.x + this.w / 2 - player.x - player.w / 2) +
                    (this.y + this.h / 2 - player.y - player.h / 2) *
                        (this.y + this.h / 2 - player.y - player.h / 2) <
                    50
            ) {
                if (
                    (this.x + this.w / 2 - player.x - player.w / 2) *
                        (this.x + this.w / 2 - player.x - player.w / 2) +
                        (this.y + this.h / 2 - player.y - player.h / 2) *
                            (this.y + this.h / 2 - player.y - player.h / 2) <
                    1
                ) {
                    this.deleted = true
                    pickUpItem(this.itemType)
                } else {
                    this.xVel -=
                        (this.x + this.w / 2 - player.x - player.w / 2) / 20
                    this.yVel -=
                        (this.y + this.h / 2 - player.y - player.h / 2) / 20
                }
            }
        }

        applyGravityAndDrag() {
            // this function changes the object's next tick's velocity in both the x and the y directions

            this.pXVel = this.xVel
            this.pYVel = this.yVel

            this.xVel -=
                (p5js.abs(this.xVel) * this.xVel * DRAG_COEFFICIENT * this.w) /
                this.mass
            this.yVel += GRAVITY_SPEED
            this.yVel -=
                (p5js.abs(this.yVel) * this.yVel * DRAG_COEFFICIENT * this.h) /
                this.mass
        }

        findInterpolatedCoordinates() {
            // this function essentially makes the character lag behind one tick, but means that it gets displayed at the maximum frame rate.
            if (this.pXVel > 0) {
                this.interpolatedX = p5js.min(
                    this.pX + this.pXVel * amountSinceLastTick,
                    this.x
                )
            } else {
                this.interpolatedX = p5js.max(
                    this.pX + this.pXVel * amountSinceLastTick,
                    this.x
                )
            }
            if (this.pYVel > 0) {
                this.interpolatedY = p5js.min(
                    this.pY + this.pYVel * amountSinceLastTick,
                    this.y
                )
            } else {
                this.interpolatedY = p5js.max(
                    this.pY + this.pYVel * amountSinceLastTick,
                    this.y
                )
            }
        }

        applyVelocityAndCollide() {
            this.pX = this.x
            this.pY = this.y

            this.grounded = false

            /*

      This function assumes that the object doesn't start in collision

      Also, it takes advantage of the fact that an object can only collide once in each axis with these axis-aligned rectangles.
      That's a total of a possible two collisions, or an initial collision, and a sliding collision.

      */

            // calculate the initial collision:

            // set the closest collision to one infinitely far away.
            this.closestCollision = [1, 0, Infinity]

            // loop through all the possible tiles the physics box could be intersecting with
            for (
                let i = p5js.floor(p5js.min(this.x, this.x + this.xVel));
                i < p5js.ceil(p5js.max(this.x, this.x + this.xVel) + this.w);
                i++
            ) {
                for (
                    let j = p5js.floor(p5js.min(this.y, this.y + this.yVel));
                    j <
                    p5js.ceil(p5js.max(this.y, this.y + this.yVel) + this.h);
                    j++
                ) {
                    // if the current tile isn't air (value 0), then continue with the collision detection
                    if (worldTiles[j * WORLD_WIDTH + i] !== 0) {
                        // get the data about the collision and store it in a variable
                        this.collisionData = rectVsRay(
                            i - this.w,
                            j - this.h,
                            this.w + 1,
                            this.h + 1,
                            this.x,
                            this.y,
                            this.xVel,
                            this.yVel
                        )
                        if (
                            this.collisionData !== false &&
                            this.closestCollision[2] > this.collisionData[2]
                        ) {
                            this.closestCollision = this.collisionData
                            tempcol = [
                                i - this.w,
                                j - this.h,
                                this.w + 1,
                                this.h + 1,
                                this.x,
                                this.y,
                                this.xVel,
                                this.yVel,
                            ]
                        }
                    }
                }
            }

            if (this.closestCollision[2] !== Infinity) {
                // there has been at least one collision

                // go to the point of collision (this makes it behave as if the walls are sticky, but we will later slide against the walls)
                this.x += this.xVel * this.closestCollision[2]
                this.y += this.yVel * this.closestCollision[2]
                // the collision happened either on the top or bottom
                if (this.closestCollision[0] === 0) {
                    this.yVel = 0 // set the y velocity to 0 because the object has run into a wall on its top or bottom
                    this.slideX = this.xVel * (1 - this.closestCollision[2]) // this is the remaining distance to slide after the collision
                    this.slideY = 0 // it doesn't slide in the y direction because there's a wall \(.-.)/
                    if (this.closestCollision[1] === -1) {
                        // if it collided on the higher side, it must be touching the ground. (higher y is down)
                        this.grounded = true
                    }
                } else {
                    this.xVel = 0 // set the x velocity to 0 because wall go oof
                    this.slideX = 0 // it doesn't slide in the x direction because there's a wall /(._.)\
                    this.slideY = this.yVel * (1 - this.closestCollision[2]) // this is the remaining distance to slide after the collision
                }

                // at this point, the object is touching its first collision, ready to slide.  The amount it wants to slide is held in the this.slideX and this.slideY variables.

                // this can be treated essentially the same as the first collision, so a lot of the code will be reused.

                // set the closest collision to one infinitely far away.
                this.closestCollision = [1, 0, Infinity]

                // loop through all the possible tiles the physics box could be intersecting with
                for (
                    let i = p5js.floor(p5js.min(this.x, this.x + this.slideX));
                    i <
                    p5js.ceil(p5js.max(this.x, this.x + this.slideX) + this.w);
                    i++
                ) {
                    for (
                        let j = p5js.floor(
                            p5js.min(this.y, this.y + this.slideY)
                        );
                        j <
                        p5js.ceil(
                            p5js.max(this.y, this.y + this.slideY) + this.h
                        );
                        j++
                    ) {
                        // if the current tile isn't air (value 0), then continue with the collision detection
                        if (worldTiles[j * WORLD_WIDTH + i] !== 0) {
                            // get the data about the collision and store it in a variable
                            this.collisionData = rectVsRay(
                                i - this.w,
                                j - this.h,
                                this.w + 1,
                                this.h + 1,
                                this.x,
                                this.y,
                                this.slideX,
                                this.slideY
                            )
                            if (
                                this.collisionData !== false &&
                                this.closestCollision[2] > this.collisionData[2]
                            ) {
                                this.closestCollision = this.collisionData
                                tempcol = [
                                    i - this.w,
                                    j - this.h,
                                    this.w + 1,
                                    this.h + 1,
                                    this.x,
                                    this.y,
                                    this.slideX,
                                    this.slideY,
                                ]
                            }
                        }
                    }
                }

                // it has collided while trying to slide
                if (this.closestCollision[2] !== Infinity) {
                    this.x += this.slideX * this.closestCollision[2]
                    this.y += this.slideY * this.closestCollision[2]

                    if (this.closestCollision[0] === 0) {
                        this.yVel = 0 // set the y velocity to 0 because the object has run into a wall on its top or bottom
                        if (this.closestCollision[1] === -1) {
                            // if it collided on the higher side, it must be touching the ground. (higher y is down)
                            this.grounded = true
                        }
                    } else {
                        this.xVel = 0 // set the x velocity to 0 because wall go oof
                    }
                } else {
                    // it has not collided while trying to slide
                    this.x += this.slideX
                    this.y += this.slideY
                }
            } else {
                // there has been no collision
                this.x += this.xVel
                this.y += this.yVel
            }

            // collide with sides of map

            if (this.x < 0) {
                this.x = 0
                this.xVel = 0
            } else if (this.x + this.w > WORLD_WIDTH) {
                this.x = WORLD_WIDTH - this.w
                this.xVel = 0
            }

            if (this.y < 0) {
                this.y = 0
                this.yVel = 0
            } else if (this.y + this.h > WORLD_HEIGHT) {
                this.y = WORLD_HEIGHT - this.h
                this.yVel = 0
                this.grounded = true
            }
        }
    }

    function rectVsRay(
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
            return false
        }

        // calculate how far along the ray each side of the rectangle intersects with it (each side is extended out infinitely in both directions)
        const topIntersection = (rectY - rayY) / rayH
        const bottomIntersection = (rectY + rectH - rayY) / rayH
        const leftIntersection = (rectX - rayX) / rayW
        const rightIntersection = (rectX + rectW - rayX) / rayW

        if (
            isNaN(topIntersection) ||
            isNaN(bottomIntersection) ||
            isNaN(leftIntersection) ||
            isNaN(rightIntersection)
        ) {
            // you have to use the JS function isNaN() to check if a value is NaN because both NaN==NaN and NaN===NaN are false.
            // if any of these values are NaN, no collision has occurred
            return false
        }

        // calculate the nearest and farthest intersections for both x and y
        const nearX = p5js.min(leftIntersection, rightIntersection)
        const farX = p5js.max(leftIntersection, rightIntersection)
        const nearY = p5js.min(topIntersection, bottomIntersection)
        const farY = p5js.max(topIntersection, bottomIntersection)

        if (nearX > farY || nearY > farX) {
            // this must mean that the line that makes up the line segment doesn't pass through the ray
            return false
        }

        if (farX < 0 || farY < 0) {
            // the intersection is happening before the ray starts, so the ray is pointing away from the triangle
            return false
        }

        // calculate where the potential collision could be
        const nearCollisionPoint = p5js.max(nearX, nearY)

        if (nearX > 1 || nearY > 1) {
            // the intersection happens after the ray(line segment) ends
            return false
        }

        if (nearX === nearCollisionPoint) {
            // it must have collided on either the left or the right! now which?
            if (leftIntersection === nearX) {
                // It must have collided on the left!  Return the collision normal [-1, 0]
                return [-1, 0, nearCollisionPoint]
            }
            // If it didn't collide on the left, it must have collided on the right.  Return the collision normal [1, 0]
            return [1, 0, nearCollisionPoint]
        }
        // If it didn't collide on the left or right, it must have collided on either the top or the bottom! now which?
        if (topIntersection === nearY) {
            // It must have collided on the top!  Return the collision normal [0, -1]
            return [0, -1, nearCollisionPoint]
        }
        // If it didn't collide on the top, it must have collided on the bottom.  Return the collision normal [0, 1]
        return [0, 1, nearCollisionPoint]

        // output if no collision: false
        // output if collision: [collision normal X, collision normal Y, nearCollisionPoint]
        //                         -1 to 1              -1 to 1            0 to 1
    }

    function renderEntities() {
        // draw player
        p5js.fill(255, 0, 0)
        p5js.noStroke()
        player.findInterpolatedCoordinates()
        p5js.rect(
            (player.interpolatedX * TILE_WIDTH -
                interpolatedCamX * TILE_WIDTH) *
                upscaleSize,
            (player.interpolatedY * TILE_HEIGHT -
                interpolatedCamY * TILE_HEIGHT) *
                upscaleSize,
            player.w * upscaleSize * TILE_WIDTH,
            player.h * upscaleSize * TILE_HEIGHT
        )

        for (const item of physicsRects) {
            item.findInterpolatedCoordinates()
            if (item.type === 'item') {
                p5js.image(
                    assets.itemsImage,
                    (item.interpolatedX * TILE_WIDTH -
                        interpolatedCamX * TILE_WIDTH) *
                        upscaleSize,
                    (item.interpolatedY * TILE_HEIGHT -
                        interpolatedCamY * TILE_HEIGHT) *
                        upscaleSize,
                    item.w * upscaleSize * TILE_WIDTH,
                    item.h * upscaleSize * TILE_HEIGHT,
                    8 * item.itemType - 8,
                    0,
                    8,
                    8
                )
            }
        }
    }

    function dropItem(type?: any, count?: any, x?: any, y?: any) {
        for (let i = 0; i < count; i++) {
            physicsRects.push(
                new PhysicsRect(
                    x,
                    y,
                    0.5,
                    0.5,
                    p5js.random(-0.1, 0.1),
                    p5js.random(-0.1, 0)
                )
            )
            physicsRects[physicsRects.length - 1].type = 'item'
            physicsRects[physicsRects.length - 1].itemType = type
        }
    }

    function pickUpItem(type?: any) {
        // see if there is already a stack of this item in the hot bar, if so, check if it's less than the max stack size, if so, then add it to the stack
        for (const item of hotBar) {
            if (item[0] === type && item[1] < ITEM_DATA[type][2]) {
                item[1]++
                // if the stack is full, then the possible items to pick up have changed.
                if (item[1] === ITEM_DATA[type][2]) {
                    updatePickUpAbleItems()
                }
                return
            }
        }
        // see if there is a blank slot in the hot bar
        for (let i = 0; i < hotBar.length; i++) {
            if (hotBar[i][0] === 0) {
                hotBar[i] = [type, 1]

                updatePickUpAbleItems()
                return
            }
        }
        console.error(
            'Item ' +
                type +
                " couldn't be picked up.  The program shouldn't have tried to pick it up in the first place."
        )
    }

    function updatePickUpAbleItems() {
        pickUpAbleItems = []
        outerLoop: for (let i = 0; i < ITEM_DATA.length; i++) {
            // see if there is already a stack of this item in the hot bar, if so, check if it's less than the max stack size
            for (const item of hotBar) {
                if (item[0] === i && item[1] < ITEM_DATA[i][2]) {
                    pickUpAbleItems.push(true)
                    continue outerLoop
                }
            }
            // see if there is a blank slot in the hot bar
            for (const item of hotBar) {
                if (item[0] === 0) {
                    pickUpAbleItems.push(true)
                    continue outerLoop
                }
            }
            pickUpAbleItems.push(false)
        }
    }

    /*
   /$$$$$$                                 /$$
  |_  $$_/                                | $$
    | $$   /$$$$$$$   /$$$$$$  /$$   /$$ /$$$$$$   /$$
    | $$  | $$__  $$ /$$__  $$| $$  | $$|_  $$_/  |__/
    | $$  | $$  \ $$| $$  \ $$| $$  | $$  | $$
    | $$  | $$  | $$| $$  | $$| $$  | $$  | $$ /$$ /$$
   /$$$$$$| $$  | $$| $$$$$$$/|  $$$$$$/  |  $$$$/|__/
  |______/|__/  |__/| $$____/  \______/    \___/
                    | $$
                    | $$
                    |__/
  */

    p5js.windowResized = () => {
        p5js.resizeCanvas(p5js.windowWidth, p5js.windowHeight)

        // go for a scale of <64 tiles wide screen
        upscaleSize = p5js.ceil(p5js.windowWidth / 64 / TILE_WIDTH / 2) * 2

        // if the world is too zoomed out, then zoom it in.
        while (
            WORLD_WIDTH * TILE_WIDTH - p5js.width / upscaleSize < 0 ||
            WORLD_HEIGHT * TILE_HEIGHT - p5js.height / upscaleSize < 0
        ) {
            upscaleSize += 2
        }
    }

    function mouseExited() {
        mouseOn = false
    }

    function mouseEntered() {
        mouseOn = true
    }

    function updateMouse() {
        // world mouse x and y variables hold the mouse position in world tiles.  0, 0 is top left
        worldMouseX = p5js.floor(
            (interpolatedCamX * TILE_WIDTH + p5js.mouseX / upscaleSize) /
                TILE_WIDTH
        )
        worldMouseY = p5js.floor(
            (interpolatedCamY * TILE_HEIGHT + p5js.mouseY / upscaleSize) /
                TILE_HEIGHT
        )
    }

    p5js.mousePressed = () => {
        // image(uiSlotImage, 2*upscaleSize+16*i*upscaleSize, 2*upscaleSize, 16*upscaleSize, 16*upscaleSize);

        if (
            p5js.mouseX > 2 * upscaleSize &&
            p5js.mouseX < 2 * upscaleSize + 16 * upscaleSize * hotBar.length &&
            p5js.mouseY > 2 * upscaleSize &&
            p5js.mouseY < 18 * upscaleSize
        ) {
            if (pickedUpSlot === -1) {
                if (
                    hotBar[
                        p5js.floor(
                            (p5js.mouseX - 2 * upscaleSize) / 16 / upscaleSize
                        )
                    ][0] !== 0
                ) {
                    pickedUpSlot = p5js.floor(
                        (p5js.mouseX - 2 * upscaleSize) / 16 / upscaleSize
                    )
                }
            } else {
                const temp = hotBar[pickedUpSlot]
                hotBar[pickedUpSlot] =
                    hotBar[
                        p5js.floor(
                            (p5js.mouseX - 2 * upscaleSize) / 16 / upscaleSize
                        )
                    ]
                pickedUpSlot = -1
                hotBar[
                    p5js.floor(
                        (p5js.mouseX - 2 * upscaleSize) / 16 / upscaleSize
                    )
                ] = temp
            }
        } else {
            dropItem(
                TILE_BROKEN[
                    worldTiles[WORLD_WIDTH * worldMouseY + worldMouseX]
                ][0],
                TILE_BROKEN[
                    worldTiles[WORLD_WIDTH * worldMouseY + worldMouseX]
                ][1],
                worldMouseX,
                worldMouseY
            )

            // set the broken tile to air in the world data
            worldTiles[WORLD_WIDTH * worldMouseY + worldMouseX] = 0

            // erase the broken tile and its surrounding tiles using two erasing rectangles in a + shape
            tileLayer.erase()
            tileLayer.noStroke()
            tileLayer.rect(
                (worldMouseX - 1) * TILE_WIDTH,
                worldMouseY * TILE_HEIGHT,
                TILE_WIDTH * 3,
                TILE_HEIGHT
            )
            tileLayer.rect(
                worldMouseX * TILE_WIDTH,
                (worldMouseY - 1) * TILE_HEIGHT,
                TILE_WIDTH,
                TILE_HEIGHT * 3
            )
            tileLayer.noErase()

            // redraw the neighboring tiles
            drawTile(worldMouseX + 1, worldMouseY)
            drawTile(worldMouseX - 1, worldMouseY)
            drawTile(worldMouseX, worldMouseY + 1)
            drawTile(worldMouseX, worldMouseY - 1)
        }
    }

    p5js.mouseReleased = () => {
        if (pickedUpSlot !== -1) {
            if (
                !(
                    p5js.mouseX > 2 * upscaleSize &&
                    p5js.mouseX <
                        2 * upscaleSize + 16 * upscaleSize * hotBar.length &&
                    p5js.mouseY > 2 * upscaleSize &&
                    p5js.mouseY < 18 * upscaleSize
                )
            ) {
                dropItem(
                    hotBar[pickedUpSlot][0],
                    hotBar[pickedUpSlot][1],
                    (interpolatedCamX * TILE_WIDTH +
                        p5js.mouseX / upscaleSize) /
                        TILE_WIDTH,
                    (interpolatedCamY * TILE_HEIGHT +
                        p5js.mouseY / upscaleSize) /
                        TILE_HEIGHT
                )
                hotBar[pickedUpSlot] = [0, 0]
                pickedUpSlot = -1
            } else if (
                p5js.floor(
                    (p5js.mouseX - 2 * upscaleSize) / 16 / upscaleSize
                ) !== pickedUpSlot
            ) {
                const temp = hotBar[pickedUpSlot]
                hotBar[pickedUpSlot] =
                    hotBar[
                        p5js.floor(
                            (p5js.mouseX - 2 * upscaleSize) / 16 / upscaleSize
                        )
                    ]
                pickedUpSlot = -1
                hotBar[
                    p5js.floor(
                        (p5js.mouseX - 2 * upscaleSize) / 16 / upscaleSize
                    )
                ] = temp
            }
        }
    }

    p5js.keyPressed = () => {
        keys[p5js.keyCode] = true
        if (controls.includes(p5js.keyCode)) {
            // hot bar slots
            for (let i = 0; i < 12; i++) {
                if (p5js.keyCode === controls[i + 5]) {
                    if (
                        p5js.mouseX > 2 * upscaleSize &&
                        p5js.mouseX <
                            2 * upscaleSize +
                                16 * upscaleSize * hotBar.length &&
                        p5js.mouseY > 2 * upscaleSize &&
                        p5js.mouseY < 18 * upscaleSize
                    ) {
                        const temp = hotBar[i]
                        hotBar[i] =
                            hotBar[
                                p5js.floor(
                                    (p5js.mouseX - 2 * upscaleSize) /
                                        16 /
                                        upscaleSize
                                )
                            ]
                        hotBar[
                            p5js.floor(
                                (p5js.mouseX - 2 * upscaleSize) /
                                    16 /
                                    upscaleSize
                            )
                        ] = temp
                    } else selectedSlot = i
                    return
                }
                console.log(undefined)
            }

            if (p5js.keyCode === controls[4]) {
                console.log("Inventory opened")
            }
        }
    }

    p5js.keyReleased = () => {
        keys[p5js.keyCode] = false
    }

    function drawCursor() {
        if (mouseOn) {
            // don't do anything if the mouse isn't on the screen
            // increase the time since an animFrame has happened by deltaTime, which is a built-in p5.js value
            msSinceCursorAnimFrame += p5js.deltaTime
            cursorAnimFrame += p5js.floor(
                msSinceCursorAnimFrame / msPerCursorAnimFrame
            )
            msSinceCursorAnimFrame -=
                msPerCursorAnimFrame *
                p5js.floor(msSinceCursorAnimFrame / msPerCursorAnimFrame)
            cursorAnimFrame =
                cursorAnimFrame % assets.cursors[cursorIndex].length
            p5js.image(
                assets.cursors[cursorIndex][cursorAnimFrame],
                p5js.mouseX,
                p5js.mouseY
            )
        }
        if (pickedUpSlot > -1) {
            p5js.image(
                assets.itemsImage,
                p5js.mouseX + 6 * upscaleSize,
                p5js.mouseY + 6 * upscaleSize,
                8 * upscaleSize,
                8 * upscaleSize,
                8 * hotBar[pickedUpSlot][0] - 8,
                0,
                8,
                8
            )
        }
    }
}

export = new P5(sketch);
