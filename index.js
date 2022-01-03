/*
 /$$    /$$                    /$$           /$$       /$$                        
| $$   | $$                   |__/          | $$      | $$                        
| $$   | $$ /$$$$$$   /$$$$$$  /$$  /$$$$$$ | $$$$$$$ | $$  /$$$$$$   /$$$$$$$ /$$
|  $$ / $$/|____  $$ /$$__  $$| $$ |____  $$| $$__  $$| $$ /$$__  $$ /$$_____/|__/
 \  $$ $$/  /$$$$$$$| $$  \__/| $$  /$$$$$$$| $$  \ $$| $$| $$$$$$$$|  $$$$$$     
  \  $$$/  /$$__  $$| $$      | $$ /$$__  $$| $$  | $$| $$| $$_____/ \____  $$ /$$
   \  $/  |  $$$$$$$| $$      | $$|  $$$$$$$| $$$$$$$/| $$|  $$$$$$$ /$$$$$$$/|__/
    \_/    \_______/|__/      |__/ \_______/|_______/ |__/ \_______/|_______/     
*/


let tempcol;

const WORLD_WIDTH = 512;//width of the world in tiles
const WORLD_HEIGHT = 64;//height of the world in tiles

const TILE_WIDTH = 8;//width of a tile in pixels
const TILE_HEIGHT = 8;//height of a tile in pixels
const BACK_TILE_WIDTH = 12;//width of a tile in pixels
const BACK_TILE_HEIGHT = 12;//height of a tile in pixels
const TILESET_SIZE = 16;//number of tiles in the tileset (do not change this as parts of the program will break)

let backTileLayerOffsetWidth = -2;//calculated in the setup function, this variable is the number of pixels left of a tile to draw a background tile from at the same position
let backTileLayerOffsetHeight = -2;//calculated in the setup function, this variable is the number of pixels above a tile to draw a background tile from at the same position

let upscaleSize = 6;//number of screen pixels per texture pixels (think of this as hud scale in Minecraft)


let worldTiles = new Uint8Array(WORLD_WIDTH*WORLD_HEIGHT);//number for each tile in the world ex: [1, 1, 0, 1, 2, 0, 0, 1...  ] means snow, snow, air, snow, ice, air, air, snow...
let backgroundTiles = new Uint8Array(WORLD_WIDTH*WORLD_HEIGHT);//number for each background tile in the world ex: [1, 1, 0, 1, 2, 0, 0, 1...  ] means snow, snow, air, snow, ice, air, air, snow...


let camX = 0;//position of the top left corner of the screen in un-upscaled pixels (0 is left of world) (WORLD_WIDTH*TILE_WIDTH is bottom of world)
let camY = 0;//position of the top left corner of the screen in un-upscaled pixels (0 is top of world) (WORLD_HEIGHT*TILE_HEIGHT is bottom of world)


//tick management
let msSinceTick = 0; //this is the running counter of how many milliseconds it has been since the last tick.  The game can then 
let msPerTick = 20; //the number of milliseconds per game tick.  1000/msPerTick = ticks per second
let amountSinceLastTick = 0;//this is a variable calculated every frame used for interpolation - domain[0,1)
let forgivenessCount = 50; //if the computer needs to do more than 50 ticks in a single frame, then it could be running behind, probably because of a freeze or the user being on a different tab.  In these cases, it's probably best to just ignore that any time has passed to avoid further freezing


//physics constants
const GRAVITY_SPEED = 0.04; // in units per second per tick, positive means downward gravity, negative means upward gravity
const DRAG_COEFFICIENT = 0.21;//arbitrary number, 0 means no drag


//player instance holder
let player;

//CHARACTER SHOULD BE ROUGHLY 12 PIXELS BY 20 PIXELS


const TILESET_POSITIONS = [
    undefined,              //air
    0,                       //snow
    1                       //ice
];

const FRICTION_CONSTANTS = [
    0,              //air
    0.3,                      //snow
    0.05,                      //ice
];

let hotbar = [[1, 56], [1, 23], [0, 0], [0, 24], [1, 2]];

let worldMouseX = 0;
let worldMouseY = 0;

let keys = [];

function preload() {
    //load all the in-game assets
    tilesetImage = loadImage("assets/textures/tilesets/foreground/indexedtileset.png");//the image that holds all versions of each tile (snow, ice, etc.)
    backgroundTilesetImage = loadImage("assets/textures/tilesets/background/backgroundsnow.png");//the image that holds each background tile (snow, ice, etc.)
    uiSlotImage = loadImage("assets/textures/ui/uislot.png");//the image of each UI slot
    itemsImage = loadImage("assets/textures/items/items.png");//the image that holds all item images (tile of snow, winterberries, etc.)
    TitleFont = loadFont("assets/fonts/Cave-Story.ttf");//the font
};

function setup() {
    //make a canvas that fills the whole screen (a canvas is what is drawn to in p5.js, as well as lots of other JS rendering libraries)
    createCanvas(windowWidth, windowHeight);

    //go for a scale of <64 blocks wide screen
    upscaleSize = ceil(windowWidth/64/TILE_WIDTH);

    //if the world is too zoomed out, then zoom it in.
    while(WORLD_WIDTH*TILE_WIDTH-width/upscaleSize<0 || WORLD_HEIGHT*TILE_HEIGHT-height/upscaleSize<0) {
        upscaleSize++;
    }

    //set the cursor to a custom image for a cursor.  This isn't in preload because it's not too jarring if it loads slightly after the rest of the project loads (the cursor() function is async afaik)
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

    player = new physicsRect(16, 4, 12/TILE_WIDTH, 20/TILE_HEIGHT, 0, 0);

    //the highest keycode is 255, which is "Toggle Touchpad", according to keycode.info
    for(let i = 0; i<255; i++) {
        keys.push(false);
    }


    //set the framerate goal to as high as possible (this will end up capping to your monitor's refresh rate.)
    frameRate(Infinity);
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

    //fill(255, 100, 100);
    //rect(((player.x+player.xVel)*TILE_WIDTH-camX)*upscaleSize, ((player.y+player.yVel)*TILE_HEIGHT-camY)*upscaleSize, player.w*upscaleSize*TILE_WIDTH, player.h*upscaleSize*TILE_HEIGHT);
    fill(255, 0, 0);
    noStroke();
    player.findInterpolatedCoordinates();
    rect((player.interpolatedX*TILE_WIDTH-camX)*upscaleSize, (player.interpolatedY*TILE_HEIGHT-camY)*upscaleSize, player.w*upscaleSize*TILE_WIDTH, player.h*upscaleSize*TILE_HEIGHT);

    //renderEntities();

    // textFont(TitleFont);
    // textSize(ts);
    // text("The quick brown fox jumps over the lazy dog.", floor(mouseX/2), floor(mouseY/2));

    //draw the hotbar
    for(let i = 0; i<hotbar.length; i++) {
        image(uiSlotImage, 2*upscaleSize+16*i*upscaleSize, 2*upscaleSize, 16*upscaleSize, 16*upscaleSize);
        image(itemsImage, 6*upscaleSize+16*i*upscaleSize, 6*upscaleSize, 8*upscaleSize, 8*upscaleSize);
    }
    
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
            if(belowTerrainHeight(j, i)) {
                if(belowIceHeight(j, i)) {
                    worldTiles[i*WORLD_WIDTH+j] = 2; 
                }
                else {
                    worldTiles[i*WORLD_WIDTH+j] = 1; 
                }
            }
            else {
                worldTiles[i*WORLD_WIDTH+j] = 0;
            }
        }
    }
    for(let i = 0; i<WORLD_HEIGHT; i++) {//i is y position of background tile being generated
        for(let j = 0; j<WORLD_WIDTH; j++) {//j is x position " "    "      "
            //if this tile and its eight surrounding tiles are below the height of the terrain (at one point could be a block of snow, ice, etc.), then add a background tile there.
            if(belowTerrainHeight(j-1, i-1) && belowTerrainHeight(j-1, i) && belowTerrainHeight(j-1, i+1) && belowTerrainHeight(j, i-1) && belowTerrainHeight(j, i) && belowTerrainHeight(j, i+1) && belowTerrainHeight(j+1, i-1) && belowTerrainHeight(j+1, i) && belowTerrainHeight(j+1, i+1)) {
               backgroundTiles[i*WORLD_WIDTH+j] = 1; 
            }
            else {
                backgroundTiles[i*WORLD_WIDTH+j] = 0;
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
    return noise(x/50)*16+20<y;
}

function belowIceHeight(x, y) {
    return noise(x/50)*6+31<y+noise(x/2, y/2)*0;
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
    amountSinceLastTick = msSinceTick/msPerTick;
}

function doTick() {
    
    //check
    player.keyboardInput();
    player.applyGravityAndDrag();
    player.applyVelocityAndCollide();

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



//this class holds an axis-aligned rectangle affected by gravity, drag, and collisions with tiles.
class physicsRect {

    constructor(x, y, w, h, xVel, yVel, mass = w*h) {

        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.xVel = xVel;
        this.yVel = yVel;
        this.mass = mass;

        this.controllable = true;

        this.grounded = false;

        this.collisionData;
        this.closestCollision = [1, 0, Infinity];

        this.interpolatedX = x;
        this.interpolatedY = y;

        this.pX = x-xVel;
        this.pY = y-yVel;
        this.pXVel = xVel;
        this.pYVel = yVel;
    }

    keyboardInput() {
        if(this.controllable) {
            this.xVel += 0.02*((keys[68] || keys[39]) - (keys[65] || keys[37]));
            if(this.grounded && (keys[87] || keys[38] || keys[32]) ) {
                this.yVel = -1.5;
            }
        }
    }

    applyGravityAndDrag() {//this function changes the object's next tick's velocity in both the x and the y directions

        this.pXVel = this.xVel;
        this.pYVel = this.yVel;

        this.xVel -= abs(this.xVel)*this.xVel*DRAG_COEFFICIENT*this.w/this.mass;
        this.yVel += GRAVITY_SPEED;
        this.yVel -= abs(this.yVel)*this.yVel*DRAG_COEFFICIENT*this.h/this.mass;

    }

    findInterpolatedCoordinates() {//this function essentially makes the character lag behind one tick, but means that it gets displayed at the maximum frame rate.
        if(this.pXVel>0) {
            this.interpolatedX = min(this.pX+this.pXVel*amountSinceLastTick, this.x);
        }
        else {
            this.interpolatedX = max(this.pX+this.pXVel*amountSinceLastTick, this.x);
        }
        if(this.pYVel>0) {
            this.interpolatedY = min(this.pY+this.pYVel*amountSinceLastTick, this.y);
            console.log(this.pY+this.yVel*amountSinceLastTick+", "+this.y);
        }
        else {
            this.interpolatedY = max(this.pY+this.pYVel*amountSinceLastTick, this.y);
        }
    }

    applyVelocityAndCollide() {

        this.pX = this.x;
        this.pY = this.y;

        this.grounded = false;


        /*
        
        This function assumes that the object doesn't start in collision
        
        Also, it takes advantage of the fact that an object can only collide once in each axis with these axis-aligned rectangles.
        That's a total of a possible two collisions, or an initial collision, and a sliding collision.
        
        */





        //calculate the initial collision:



        //set the closest collision to one infinitely far away.
        this.closestCollision = [1, 0, Infinity];

        //loop through all the possible tiles the physics box could be intersecting with
        for(let i = floor(min(this.x, this.x+this.xVel)); i<ceil(max(this.x, this.x+this.xVel)+this.w); i++) {
            for(let j = floor(min(this.y, this.y+this.yVel)); j<ceil(max(this.y, this.y+this.yVel)+this.h); j++) {

                //if the current tile isn't air (value 0), then continue with the collision detection
                if(worldTiles[j*WORLD_WIDTH+i] !== 0) {
                    //get the data about the collision and store it in a variable
                    this.collisionData = rectVsRay(i-this.w, j-this.h, this.w+1, this.h+1, this.x, this.y, this.xVel, this.yVel);
                    if(this.collisionData !== false && this.closestCollision[2]>this.collisionData[2]) {
                        this.closestCollision = this.collisionData;
                        tempcol = ([i-this.w, j-this.h, this.w+1, this.h+1, this.x, this.y, this.xVel, this.yVel]);
                    }
                }
            }
        }

        if(this.closestCollision[2] !== Infinity) {//there has been at least one collision

            //go to the point of collision (this makes it behave as if the walls are sticky, but we will later slide against the walls)
            this.x += this.xVel*this.closestCollision[2];
            this.y += this.yVel*this.closestCollision[2];
            //the collision happened either on the top or bottom
            if(this.closestCollision[0]===0) {
                this.yVel = 0;//set the y velocity to 0 because the object has run into a wall on its top or bottom
                this.slideX = this.xVel*(1-this.closestCollision[2]);//this is the remaining distance to slide after the collision
                this.slideY = 0;//it doesn't slide in the y direction because there's a wall \(.-.)/
                if(this.closestCollision[1] === -1) {//if it collided on the higher side, it must be touching the ground. (higher y is down)
                    this.grounded = true;
                }
            }
            else {
                this.xVel = 0;//set the x velocity to 0 because wall go oof
                this.slideX = 0;//it doesn't slide in the x direction because there's a wall /(._.)\
                this.slideY = this.yVel*(1-this.closestCollision[2]);//this is the remaining distance to slide after the collision
            }



            //at this point, the object is touching its first collision, ready to slide.  The amount it wants to slide is held in the this.slideX and this.slideY variables.
            
            //this can be treated essentially the same as the first collision, so a lot of the code will be reused.

            //set the closest collision to one infinitely far away.
            this.closestCollision = [1, 0, Infinity];

            //loop through all the possible tiles the physics box could be intersecting with
            for(let i = floor(min(this.x, this.x+this.slideX)); i<ceil(max(this.x, this.x+this.slideX)+this.w); i++) {
                for(let j = floor(min(this.y, this.y+this.slideY)); j<ceil(max(this.y, this.y+this.slideY)+this.h); j++) {

                    //if the current tile isn't air (value 0), then continue with the collision detection
                    if(worldTiles[j*WORLD_WIDTH+i] !== 0) {
                        //get the data about the collision and store it in a variable
                        this.collisionData = rectVsRay(i-this.w, j-this.h, this.w+1, this.h+1, this.x, this.y, this.slideX, this.slideY);
                        if(this.collisionData !== false && this.closestCollision[2]>this.collisionData[2]) {
                            this.closestCollision = this.collisionData;
                            tempcol = ([i-this.w, j-this.h, this.w+1, this.h+1, this.x, this.y, this.slideX, this.slideY]);
                        }
                    }
                }
            }


            //it has collided while trying to slide
            if(this.closestCollision[2] !== Infinity) {

                this.x += this.slideX*this.closestCollision[2];
                this.y += this.slideY*this.closestCollision[2];

                if(this.closestCollision[0]===0) {
                    this.yVel = 0;//set the y velocity to 0 because the object has run into a wall on its top or bottom
                    if(this.closestCollision[1] === -1) {//if it collided on the higher side, it must be touching the ground. (higher y is down)
                        this.grounded = true;
                    }
                }
                else {
                    this.xVel = 0;//set the x velocity to 0 because wall go oof
                }
            }
            else {//it has not collided while trying to slide
                this.x += this.slideX;
                this.y += this.slideY;
            }


        }
        else {//there has been no collision
            this.x += this.xVel;
            this.y += this.yVel;
        }

        //collide with sides of map

        if(this.x<0) {
            this.x = 0;
            this.xVel = 0;
        }
        else if(this.x+this.w>WORLD_WIDTH) {
            this.x = WORLD_WIDTH-this.w;
            this.xVel = 0;
        }

        if(this.y<0) {
            this.y = 0;
            this.yVel = 0;
        }
        else if(this.y+this.h>WORLD_HEIGHT) {
            this.y = WORLD_HEIGHT-this.h;
            this.yVel = 0;
            this.grounded = true;
        }

    }


}


function rectVsRay(rectX, rectY, rectW, rectH, rayX, rayY, rayW, rayH) {

    //this ray is actually a line segment mathematically, but it's common to see people refer to similar checks as raycasts, so for the duration of the definition of this function, ray can be assumed to mean the same as line segment.

    //if the ray doesn't have a length, then it can't have entered the rectangle.  This assumes that the objects don't start in collision, otherwise they'll behave strangely
    if(rayW === 0 && rayH === 0) {
        return false;
    }

    //calculate how far along the ray each side of the rectangle intersects with it (each side is extended out infinitely in both directions)
    topIntersection = (rectY-rayY)/rayH;
    bottomIntersection = (rectY+rectH-rayY)/rayH;
    leftIntersection = (rectX-rayX)/rayW;
    rightIntersection = (rectX+rectW-rayX)/rayW;

    if(isNaN(topIntersection) || isNaN(bottomIntersection) || isNaN(leftIntersection) || isNaN(rightIntersection)) {//you have to use the JS function isNaN() to check if a value is NaN because both NaN==NaN and NaN===NaN are false.
        //if any of these values are NaN, no collision has occurred
        return false;
    }

    //calculate the nearest and farthest intersections for both x and y
    nearX = min(leftIntersection, rightIntersection);
    farX = max(leftIntersection, rightIntersection);
    nearY = min(topIntersection, bottomIntersection);
    farY = max(topIntersection, bottomIntersection);

    if(nearX>farY || nearY>farX) {//this must mean that the line that makes up the line segment doesn't pass through the ray
        return false;
    }

    if(farX<0 || farY<0) {//the intersection is happening before the ray starts, so the ray is pointing away from the triangle
        return false
    }

    //calculate where the potential collision could be
    nearCollisionPoint = max(nearX, nearY);

    if(nearX>1 || nearY>1) {//the intersection happens after the ray(line segment) ends
        return false
    }

    if(nearX===nearCollisionPoint) {
        //it must have collided on either the left or the right! now which?
        if(leftIntersection===nearX) {
            //It must have collided on the left!  Return the collision normal [-1, 0]
            return [-1, 0, nearCollisionPoint];
        }
        //If it didn't collide on the left, it must have collided on the right.  Return the collision normal [1, 0]
        return [1, 0, nearCollisionPoint];
    }
    //If it didn't collide on the left or right, it must have collided on either the top or the bottom! now which?
    if(topIntersection===nearY) {
        //It must have collided on the top!  Return the collision normal [0, -1]
        return [0, -1, nearCollisionPoint];
    }
    //If it didn't collide on the top, it must have collided on the bottom.  Return the collision normal [0, 1]
    return [0, 1, nearCollisionPoint];
    

    //output if no collision: false
    //output if collision: [collision normal X, collision normal Y, nearCollisionPoint]
    //                         -1 to 1              -1 to 1            0 to 1


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

function keyPressed() {
    keys[keyCode] = true;
}

function keyReleased() {
    keys[keyCode] = false;
}