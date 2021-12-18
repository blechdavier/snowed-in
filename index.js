const WORLD_WIDTH = 64;//width of the world in tiles
const WORLD_HEIGHT = 256;//height of the world in tiles

const TILE_WIDTH = 8;//width of a tile in pixels
const TILE_HEIGHT = 8;//height of a tile in pixels
const TILESET_SIZE = 16;//number of tiles in the tileset (do not change this as parts of the program will break)

let upscaleSize = 6;//number of screen pixels per texture pixels (think of this as hud scale in Minecraft)


let worldTiles = [];//number for each tile in the world ex: [1, 1, 0, 1, 2, 0, 0, 1...  ] means snow, snow, air, snow, ice, air, air, snow...


let camX = 0;//position of the top left corner of the screen in un-upscaled pixels (0 is left of world) (WORLD_WIDTH*TILE_WIDTH is bottom of world)
let camY = 0;//position of the top left corner of the screen in un-upscaled pixels (0 is top of world) (WORLD_HEIGHT*TILE_HEIGHT is bottom of world)

const TILESET_POSITIONS = [
    undefined,              //air
    0                       //snow
];

let worldMouseX = 0;
let worldMouseY = 0;

function preload() {
    tilesetImage = loadImage("assets/textures/tilesets/indexedsnow.png");
};

function setup() {
    createCanvas(windowWidth, windowHeight);

    //go for a scale of <32 blocks wide screen
    upscaleSize = ceil(windowWidth/32/TILE_WIDTH);

    //if the world is too zoomed out, then zoom it in.
    while(WORLD_WIDTH*TILE_WIDTH-width/upscaleSize<0 || WORLD_HEIGHT*TILE_HEIGHT-height/upscaleSize<0) {
        upscaleSize++;
    }

    //remove texture interpolation
    noSmooth();

    //define the p5.Graphics object that holds an image of the tiles of the world.  This acts sort of like a virtual canvas and can be drawn on just like a normal canvas by using tileLayer.rect();, tileLayer.ellipse();, tileLayer.fill();, etc.
    tileLayer = createGraphics(WORLD_WIDTH*TILE_WIDTH, WORLD_HEIGHT*TILE_HEIGHT);
    //any shape erases instead of draws on the tile layer - this doesn't work with images.
    generateWorld();
    //p5js erase()
}

function draw() {

    //wipe the screen with a happy little layer of black
    background(0);
    //move camera
    moveCamera()
    //update mouse position
    updateMouse();
    //draw the tile layer onto the screen
    image(tileLayer, 0, 0, width, height, camX, camY, width/upscaleSize, height/upscaleSize);
    //renderEntities();
    text(round(frameRate()), mouseX, mouseY);
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
            if(noise(j/50)*32<i && noise(j/20, i/20)<0.68) {
               worldTiles.push(1); 
            }
            else {
                worldTiles.push(0);
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
                tileLayer.image(tilesetImage, j*TILE_WIDTH, i*TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT, TILESET_POSITIONS[worldTiles[i*WORLD_WIDTH+j]]*TILE_WIDTH*TILESET_SIZE+tilesetIndex*TILE_WIDTH, 0, TILE_WIDTH, TILE_HEIGHT);
            }
        }
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);

    //go for a scale of <32 blocks wide screen
    upscaleSize = ceil(windowWidth/32/TILE_WIDTH);

    //if the world is too zoomed out, then zoom it in.
    while(WORLD_WIDTH*TILE_WIDTH-width/upscaleSize<0 || WORLD_HEIGHT*TILE_HEIGHT-height/upscaleSize<0) {
        upscaleSize++;
    }
}

function updateMouse() {
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