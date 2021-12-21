// let ts = 5;

const WORLD_WIDTH = 128;//width of the world in tiles
const WORLD_HEIGHT = 128;//height of the world in tiles

const TILE_WIDTH = 8;//width of a tile in pixels
const TILE_HEIGHT = 8;//height of a tile in pixels
const BACK_TILE_WIDTH = 12;//width of a tile in pixels
const BACK_TILE_HEIGHT = 12;//height of a tile in pixels
const TILESET_SIZE = 16;//number of tiles in the tileset (do not change this as parts of the program will break)

let backTileLayerOffsetWidth = -2;//calculated in the setup function, this variable is the number of pixels left of a tile to draw a background tile from at the same position
let backTileLayerOffsetHeight = -2;//calculated in the setup function, this variable is the number of pixels above a tile to draw a background tile from at the same position

let upscaleSize = 6;//number of screen pixels per texture pixels (think of this as hud scale in Minecraft)


let worldTiles = [];//number for each tile in the world ex: [1, 1, 0, 1, 2, 0, 0, 1...  ] means snow, snow, air, snow, ice, air, air, snow...
let backgroundTiles = [];//number for each background tile in the world ex: [1, 1, 0, 1, 2, 0, 0, 1...  ] means snow, snow, air, snow, ice, air, air, snow...


let camX = 0;//position of the top left corner of the screen in un-upscaled pixels (0 is left of world) (WORLD_WIDTH*TILE_WIDTH is bottom of world)
let camY = 0;//position of the top left corner of the screen in un-upscaled pixels (0 is top of world) (WORLD_HEIGHT*TILE_HEIGHT is bottom of world)


//tick management
let msSinceTick = 0; //this is the running counter of how many milliseconds it has been since the last tick.  The game can then 
let msPerTick = 50; //the number of milliseconds per game tick.  1000/msPerTick = ticks per second
let forgivenessCount = 50; //if the computer needs to do more than 50 ticks in a single frame, then it could be running behind, probably because of a freeze or the user being on a different tab.  In these cases, it's probably best to just ignore that any time has passed to avoid further freezing
let physicsInterpolation = false;

//character physics information
let charX = 16;
let charY = 0;


const TILESET_POSITIONS = [
    undefined,              //air
    0                       //snow
];

let hotbar = [[1, 56], [1, 23], [0, 0], [0, 24], [1, 2]];

let worldMouseX = 0;
let worldMouseY = 0;

function preload() {
    tilesetImage = loadImage("assets/textures/tilesets/foreground/indexedsnow.png");
    backgroundTilesetImage = loadImage("assets/textures/tilesets/background/backgroundsnow.png");
    uiSlotImage = loadImage("assets/textures/ui/uislot.png");
    itemsImage = loadImage("assets/textures/items/items.png");
    TitleFont = loadFont("assets/fonts/Cave-Story.ttf");
};

function setup() {
    createCanvas(windowWidth, windowHeight);

    //go for a scale of <64 blocks wide screen
    upscaleSize = ceil(windowWidth/64/TILE_WIDTH);

    //if the world is too zoomed out, then zoom it in.
    while(WORLD_WIDTH*TILE_WIDTH-width/upscaleSize<0 || WORLD_HEIGHT*TILE_HEIGHT-height/upscaleSize<0) {
        upscaleSize++;
    }

    cursor("assets/textures/cursors/cursor.png");

    //remove texture interpolation
    noSmooth();

    //define the p5.Graphics objects that hold an image of the tiles of the world.  These act sort of like a virtual canvas and can be drawn on just like a normal canvas by using tileLayer.rect();, tileLayer.ellipse();, tileLayer.fill();, etc.
    tileLayer = createGraphics(WORLD_WIDTH*TILE_WIDTH, WORLD_HEIGHT*TILE_HEIGHT);
    backTileLayer = createGraphics(WORLD_WIDTH*TILE_WIDTH, WORLD_HEIGHT*TILE_HEIGHT);


    //calculate these variables:
    backTileLayerOffsetWidth = (TILE_WIDTH-BACK_TILE_WIDTH)/2;//calculated in the setup function, this variable is the number of pixels left of a tile to draw a background tile from at the same position
    backTileLayerOffsetHeight = (TILE_HEIGHT-BACK_TILE_HEIGHT)/2;//calculated in the setup function, this variable is the number of pixels above a tile to draw a background tile from at the same position
    
    //generate and draw the world onto the p5.Graphics objects
    generateWorld();

}

function draw() {

    //wipe the screen with a happy little layer of light blue
    background(129, 206, 243);

    //do the tick calculations
    doTicks();

    //move camera
    moveCamera()

    //update mouse position
    updateMouse();

    //draw the background tile layer onto the screen
    image(backTileLayer, 0, 0, width, height, camX, camY, width/upscaleSize, height/upscaleSize);

    //draw the tile layer onto the screen
    image(tileLayer, 0, 0, width, height, camX, camY, width/upscaleSize, height/upscaleSize);

    //renderEntities();

    // textFont(TitleFont);
    // textSize(ts);
    // text("The quick brown fox jumps over the lazy dog.", floor(mouseX/2), floor(mouseY/2));

    //draw the hotbar
    for(let i = 0; i<hotbar.length; i++) {
        image(uiSlotImage, 2*upscaleSize+16*i*upscaleSize, 2*upscaleSize, 16*upscaleSize, 16*upscaleSize);
        image(itemsImage, 6*upscaleSize+16*i*upscaleSize, 6*upscaleSize, 8*upscaleSize, 8*upscaleSize);
    }

    //set the framerate goal to as high as possible (this will end up capping to your monitor's refresh rate.)
    frameRate(Infinity);
    
}

function moveCamera() {
    camX += round((mouseX-width/2)*0.025)/4;
    camY += round((mouseY-height/2)*0.025)/4;
    
    if(camX<0) {
        camX = 0;
    }
    else if(camX>WORLD_WIDTH*TILE_WIDTH-width/upscaleSize) {
        camX = WORLD_WIDTH*TILE_WIDTH-width/upscaleSize;
    }
    if(camY<0) {
        camY = 0;
    }
    else if(camY>WORLD_HEIGHT*TILE_HEIGHT-height/upscaleSize) {
        camY = WORLD_HEIGHT*TILE_HEIGHT-height/upscaleSize;
    }
}

function generateWorld() {
    //this generation algorithm is by no means optimized
    for(let i = 0; i<WORLD_HEIGHT; i++) {//i is y position of tile being generated
        for(let j = 0; j<WORLD_WIDTH; j++) {//j is x position " "    "      "
            if(belowTerrainHeight(j, i) && noise(j/20, i/20)<0.6) {
               worldTiles.push(1); 
            }
            else {
                worldTiles.push(0);
            }
        }
    }
    for(let i = 0; i<WORLD_HEIGHT; i++) {//i is y position of background tile being generated
        for(let j = 0; j<WORLD_WIDTH; j++) {//j is x position " "    "      "
            //if this tile and its eight surrounding tiles are below the height of the terrain (at one point could be a block of snow, ice, etc.), then add a background tile there.
            if(belowTerrainHeight(j-1, i-1) && belowTerrainHeight(j-1, i) && belowTerrainHeight(j-1, i+1) && belowTerrainHeight(j, i-1) && belowTerrainHeight(j, i) && belowTerrainHeight(j, i+1) && belowTerrainHeight(j+1, i-1) && belowTerrainHeight(j+1, i) && belowTerrainHeight(j+1, i+1)) {
               backgroundTiles.push(1); 
            }
            else {
                backgroundTiles.push(0);
            }
        }
    }
    for(let i = 0; i<WORLD_HEIGHT; i++) {//i is y position of tile being drawn
        for(let j = 0; j<WORLD_WIDTH; j++) {//j is x position " "    "      "
            if(worldTiles[i*WORLD_WIDTH+j] != 0) {

                //test if the neighboring tiles are solid
                topTileBool = i==0 || worldTiles[(i-1)*WORLD_WIDTH+j] != 0;
                leftTileBool = j==0 || worldTiles[i*WORLD_WIDTH+j-1] != 0;
                bottomTileBool = i==WORLD_HEIGHT-1 || worldTiles[(i+1)*WORLD_WIDTH+j] != 0;
                rightTileBool = j==WORLD_WIDTH-1 || worldTiles[i*WORLD_WIDTH+j+1] != 0;
                
                //convert 4 digit binary number to base 10
                tilesetIndex = 8*topTileBool+4*rightTileBool+2*bottomTileBool+leftTileBool;

                //draw the correct image for the tile onto the tile layer
                tileLayer.image(tilesetImage, j*TILE_WIDTH, i*TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT, (TILESET_POSITIONS[worldTiles[i*WORLD_WIDTH+j]]*TILESET_SIZE+tilesetIndex)*TILE_WIDTH, 0, TILE_WIDTH, TILE_HEIGHT);
            }
            if(backgroundTiles[i*WORLD_WIDTH+j] != 0) {

                //draw the correct image for the background tile onto the background tile layer
                backTileLayer.image(backgroundTilesetImage, j*TILE_WIDTH+backTileLayerOffsetWidth, i*TILE_HEIGHT+backTileLayerOffsetHeight, BACK_TILE_WIDTH, BACK_TILE_HEIGHT, (TILESET_POSITIONS[backgroundTiles[i*WORLD_WIDTH+j]])*BACK_TILE_WIDTH, 0, BACK_TILE_WIDTH, BACK_TILE_HEIGHT);
            }
        }
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);

    //go for a scale of <64 blocks wide screen
    upscaleSize = ceil(windowWidth/64/TILE_WIDTH);

    //if the world is too zoomed out, then zoom it in.
    while(WORLD_WIDTH*TILE_WIDTH-width/upscaleSize<0 || WORLD_HEIGHT*TILE_HEIGHT-height/upscaleSize<0) {
        upscaleSize++;
    }

}

function updateMouse() {
    //world mouse x and y variables hold the mouse position in world tiles.  0, 0 is top left
    worldMouseX = floor((camX+mouseX/upscaleSize)/TILE_WIDTH);
    worldMouseY = floor((camY+mouseY/upscaleSize)/TILE_HEIGHT);
}

function mousePressed() {
    
    //set the broken block to air in the world data
    worldTiles[WORLD_WIDTH*worldMouseY+worldMouseX] = 0;

    //erase the broken tile and its surrounding tiles using two erasing rectangles in a + shape
    tileLayer.erase();
    tileLayer.noStroke();
    tileLayer.rect((worldMouseX-1)*TILE_WIDTH, worldMouseY*TILE_HEIGHT, TILE_WIDTH*3, TILE_HEIGHT);
    tileLayer.rect(worldMouseX*TILE_WIDTH, (worldMouseY-1)*TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT*3);
    tileLayer.noErase();
    
    //redraw the neighboring tiles
    drawTile(worldMouseX+1, worldMouseY);
    drawTile(worldMouseX-1, worldMouseY);
    drawTile(worldMouseX, worldMouseY+1);
    drawTile(worldMouseX, worldMouseY-1);

}

function drawTile(j, i) {
    if(worldTiles[i*WORLD_WIDTH+j] != 0) {

        //test if the neighboring tiles are solid
        topTileBool = i==0 || worldTiles[(i-1)*WORLD_WIDTH+j] != 0;
        leftTileBool = j==0 || worldTiles[i*WORLD_WIDTH+j-1] != 0;
        bottomTileBool = i==WORLD_HEIGHT-1 || worldTiles[(i+1)*WORLD_WIDTH+j] != 0;
        rightTileBool = j==WORLD_WIDTH-1 || worldTiles[i*WORLD_WIDTH+j+1] != 0;
        
        //convert 4 digit binary number to base 10
        tilesetIndex = 8*topTileBool+4*rightTileBool+2*bottomTileBool+leftTileBool;

        //draw the correct image for the tile onto the tile layer
        tileLayer.image(tilesetImage, j*TILE_WIDTH, i*TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT, TILESET_POSITIONS[worldTiles[i*WORLD_WIDTH+j]]*TILE_WIDTH*TILESET_SIZE+tilesetIndex*TILE_WIDTH, 0, TILE_WIDTH, TILE_HEIGHT);
    }
}

function belowTerrainHeight(x, y) {
    return noise(x/50)*16<y;
}

// function keyReleased() {
//     ts++;
// }

function doTicks() {

    //increase the time since a tick has happened by deltaTime, which is a built-in p5.js value
    msSinceTick += deltaTime;

    //define a temporary variable called ticksThisFrame - this is used to keep track of how many ticks have been calculated within the duration of the current frame.  As long as this value is less than the forgivenessCount variable, it continues to calculate ticks as necessary.
    ticksThisFrame = 0;
    while(msSinceTick>msPerTick && ticksThisFrame!==forgivenessCount) {
        //
        doTick();
        msSinceTick -= msPerTick;
        ticksThisFrame++;
    }
    if(ticksThisFrame===forgivenessCount) {
        msSinceTick = 0;
        console.warn("lag spike detected, tick calculations couldn't keep up");
    }
}

function doTick() {
    console.log("did tick");
}