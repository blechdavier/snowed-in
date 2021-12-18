const WORLD_WIDTH = 64;//width of the world in tiles
const WORLD_HEIGHT = 64;//height of the world in tiles

const TILE_WIDTH = 8;//width of a tile in pixels
const TILE_HEIGHT = 8;//height of a tile in pixels
const TILESET_SIZE = 16;//number of tiles in the tileset

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
    tilesetImage = loadImage("assets/textures/tilesets/snowtilesetline.png");
};

function setup() {
    createCanvas(windowWidth, windowHeight);
    noSmooth();
    tileLayer = createGraphics(WORLD_WIDTH*TILE_WIDTH, WORLD_HEIGHT*TILE_HEIGHT);
    //this generation algorithm is by no means optimized
    for(let i = 0; i<WORLD_HEIGHT; i++) {//i is y position of tile being generated
        for(let j = 0; j<WORLD_WIDTH; j++) {//j is x position " "    "      "
            if(i>32*noise(j/50)) {
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
                tileLayer.image(tilesetImage, j*TILE_WIDTH, i*TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT, TILESET_POSITIONS[worldTiles[i*WORLD_WIDTH+j]]*TILE_WIDTH*TILESET_SIZE+15*TILE_WIDTH, 0, TILE_WIDTH, TILE_HEIGHT);
            }
        }
    }
    //p5js erase()
}

function draw() {
    background(0);
    moveCamera()
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