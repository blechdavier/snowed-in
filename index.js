const WORLD_WIDTH = 128;//width of the world in tiles
const WORLD_HEIGHT = 64;//height of the world in tiles

const TILE_WIDTH = 8;//width of a tile in pixels
const TILE_HEIGHT = 8;//height of a tile in pixels
const TILESET_SIZE = 16;//number of tiles in the tileset (do not change this as parts of the program will break)

const UPSCALE_SIZE = 6;//number of screen pixels per texture pixels (think of this as hud scale in Minecraft)


let worldTiles = [];//number for each tile in the  ex: [1, 1, 0, 1, 2, 0, 0, 1...  ]


let camX = 0;//position of the top left corner of the screen in un-upscaled pixels (0 is left of world) (WORLD_WIDTH*TILE_WIDTH is bottom of world)
let camY = 0;//position of the top left corner of the screen in un-upscaled pixels (0 is top of world) (WORLD_HEIGHT*TILE_HEIGHT is bottom of world)

const TILESET_POSITIONS = [
    undefined,              //air
    0                       //snow
];

//variables to hold the vertex and fragment shaders
let vert, frag;

function preload() {
    tilesetImage = loadImage("assets/textures/tilesets/indexedsnow.png");
};

function setup() {
    createCanvas(windowWidth, windowHeight);
    noSmooth();
    tileLayer = createGraphics(WORLD_WIDTH*TILE_WIDTH, WORLD_HEIGHT*TILE_HEIGHT);
    generateWorld();
    //p5js erase()
}

function draw() {

    //wipe the screen with a happy little layer of black
    background(0);

    moveCamera()
    //draw the tile layer onto the screen
    image(tileLayer, 0, 0, width, height, camX, camY, width/UPSCALE_SIZE, height/UPSCALE_SIZE);
    //renderEntities();
    text(round(frameRate()), mouseX, mouseY);
}

function moveCamera() {
    camX += round((mouseX-width/2)*0.025)/4;
    camY += round((mouseY-height/2)*0.025)/4;
    
    if(camX<0) {
        camX = 0;
    }
    else if(camX>WORLD_WIDTH*TILE_WIDTH-width/UPSCALE_SIZE) {
        camX = WORLD_WIDTH*TILE_WIDTH-width/UPSCALE_SIZE;
    }
    if(camY<0) {
        camY = 0;
    }
    else if(camY>WORLD_HEIGHT*TILE_HEIGHT-height/UPSCALE_SIZE) {
        camY = WORLD_HEIGHT*TILE_HEIGHT-height/UPSCALE_SIZE;
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