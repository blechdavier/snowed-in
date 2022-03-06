"use strict";

var __extends = void 0 && (void 0).__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var p5_1 = require("p5");

var EntityItem_1 = require("./world/entities/EntityItem");

var World_1 = require("./world/World");

var Assets_1 = require("./assets/Assets");

var Tiles_1 = require("./world/Tiles");

var TileResource_1 = require("./assets/resources/TileResource");

var ImageResource_1 = require("./assets/resources/ImageResource");

var MainMenu_1 = require("./ui/screens/MainMenu");

var PauseMenu_1 = require("./ui/screens/PauseMenu");
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


var Game =
/** @class */
function (_super) {
  __extends(Game, _super);

  function Game(connection) {
    var _this = _super.call(this, function () {}) || this;

    _this.worldWidth = 512; // width of the world in tiles   <!> MAKE SURE THIS IS NEVER LESS THAN 64!!! <!>

    _this.worldHeight = 64; // height of the world in tiles  <!> MAKE SURE THIS IS NEVER LESS THAN 64!!! <!>

    _this.TILE_WIDTH = 8; // width of a tile in pixels

    _this.TILE_HEIGHT = 8; // height of a tile in pixels

    _this.BACK_TILE_WIDTH = 12; // width of a tile in pixels

    _this.BACK_TILE_HEIGHT = 12; // height of a tile in pixels

    _this.upscaleSize = 6; // number of screen pixels per texture pixels (think of this as hud scale in Minecraft)

    _this.camX = 0; // position of the top left corner of the screen in un-up-scaled pixels (0 is left of world) (worldWidth*TILE_WIDTH is bottom of world)

    _this.camY = 0; // position of the top left corner of the screen in un-up-scaled pixels (0 is top of world) (worldHeight*TILE_HEIGHT is bottom of world)

    _this.pCamX = 0; // last frame's x of the camera

    _this.pCamY = 0; // last frame's y of the camera

    _this.interpolatedCamX = 0; // interpolated position of the camera

    _this.interpolatedCamY = 0; // interpolated position of the camera
    // tick management

    _this.msSinceTick = 0; // this is the running counter of how many milliseconds it has been since the last tick.  The game can then

    _this.msPerTick = 20; // the number of milliseconds per game tick.  1000/msPerTick = ticks per second

    _this.amountSinceLastTick = 0; // this is a variable calculated every frame used for interpolation - domain[0,1)

    _this.forgivenessCount = 50; // if the computer needs to do more than 50 ticks in a single frame, then it could be running behind, probably because of a freeze or the user being on a different tab.  In these cases, it's probably best to just ignore that any time has passed to avoid further freezing
    // physics constants

    _this.GRAVITY_SPEED = 0.04; // in units per second tick, positive means downward gravity, negative means upward gravity

    _this.DRAG_COEFFICIENT = 0.21; // arbitrary number, 0 means no drag
    // array for all the items

    _this.items = [];
    _this.hotBar = new Array(9);
    _this.selectedSlot = 0;
    _this.pickedUpSlot = -1;
    _this.worldMouseX = 0; // the mouse position in world coordinates

    _this.worldMouseY = 0; // the mouse position in world coordinates

    _this.mouseOn = true; // is the mouse on the window?

    _this.keys = []; // the keycode for the key that does the action

    _this.controls = [68, 65, 87, 27, 69, 49, 50, 51, 52, 53, 54, 55, 56, 57 // hot bar 9
    ];
    _this.connection = connection;

    _this.connection.on('init', function (_a) {
      var playerTickRate = _a.playerTickRate,
          token = _a.token;
      console.log("Tick rate set to: " + playerTickRate);
      _this.playerTickRate = playerTickRate;

      if (token) {
        window.localStorage.setItem('token', token);
        _this.connection.auth.token = token;
      }
    });

    return _this;
  }

  Game.prototype.preload = function () {
    console.log('Loading assets');
    Assets_1.loadAssets(this, Assets_1.UiAssets, Assets_1.ItemsAssets, Assets_1.WorldAssets, Assets_1.Fonts);
    console.log('Asset loading completed');
    this.skyShader = this.loadShader("assets/shaders/basic.vert", "assets/shaders/sky.frag");
  };

  Game.prototype.setup = function () {
    var _this = this; // make a canvas that fills the whole screen (a canvas is what is drawn to in p5.js, as well as lots of other JS rendering libraries)


    this.canvas = this.createCanvas(this.windowWidth, this.windowHeight);
    this.canvas.mouseOut(this.mouseExited);
    this.canvas.mouseOver(this.mouseEntered);
    this.skyLayer = this.createGraphics(this.width, this.height, "webgl");
    this.currentUi = new MainMenu_1.MainMenu(Assets_1.Fonts.title); // Load the world and set the player

    this.connection.on('load-world', function (width, height, tiles, backgroundTiles, entityId) {
      _this.world = new World_1["default"](width, height, tiles, backgroundTiles, entityId);
    });
    this.connection.on('world-update', function (updatedTiles) {
      updatedTiles.forEach(function (tile) {
        // set the broken tile to air in the world data
        _this.world.worldTiles[tile.tileIndex] = tile.tile; // erase the broken tile and its surrounding tiles using two erasing rectangles in a + shape

        _this.world.tileLayer.erase();

        _this.world.tileLayer.noStroke();

        _this.world.tileLayer.rect((tile.tileIndex % _this.world.width - 1) * _this.TILE_WIDTH, Math.floor(tile.tileIndex / _this.world.width) * _this.TILE_HEIGHT, _this.TILE_WIDTH * 3, _this.TILE_HEIGHT);

        _this.world.tileLayer.rect(tile.tileIndex % _this.world.width * _this.TILE_WIDTH, (Math.floor(tile.tileIndex / _this.world.width) - 1) * _this.TILE_HEIGHT, _this.TILE_WIDTH, _this.TILE_HEIGHT * 3);

        _this.world.tileLayer.noErase(); // redraw the neighboring tiles


        _this.drawTile(tile.tileIndex);

        _this.drawTile(tile.tileIndex + _this.world.width);

        _this.drawTile(tile.tileIndex - 1);

        _this.drawTile(tile.tileIndex - _this.world.width);

        _this.drawTile(tile.tileIndex + 1);
      });
    }); // Update the player

    this.connection.on('set-player', function (x, y, yVel, xVel) {
      _this.world.player.x = x;
      _this.world.player.y = y;
      _this.world.player.yVel = yVel;
      _this.world.player.xVel = xVel;
    });
    this.connection.on('entities-update', function (entities) {
      _this.world.updateEntities(entities);
    }); // Update the other players in the world

    this.connection.on('entity-snapshot', function (snapshot) {
      // If the world is not set
      if (_this.world === undefined) return; // this.world.snapshotInterpolation.snapshot.add(snapshot);

      _this.world.updatePlayers(snapshot);
    });
    setInterval(function () {
      if (_this.world === undefined) return;

      _this.world.tick(_this);
    }, 1000 / this.playerTickRate); // this.connection.emit(
    //     'create',
    //     "Numericly's Server",
    //     'Numericly',
    //     10,
    //     false
    // );

    this.connection.emit('join', 'e4022d403dcc6d19d6a68ba3abfd0a60', 'player' + Math.floor(Math.random() * 1000)); // go for a scale of <64 tiles wide screen

    this.windowResized(); // remove texture interpolation

    this.noSmooth(); // the highest keycode is 255, which is "Toggle Touchpad", according to keycode.info

    for (var i = 0; i < 255; i++) {
      this.keys.push(false);
    } // set the framerate goal to as high as possible (this will end up capping to your monitor's refresh rate with vsync.)


    this.frameRate(Infinity);
  };

  Game.prototype.draw = function () {
    if (this.frameCount === 2) {
      this.skyShader.setUniform("screenDimensions", [this.skyLayer.width / this.upscaleSize, this.skyLayer.height / this.upscaleSize]);
    } // do the tick calculations


    this.doTicks(); // update mouse position

    this.updateMouse(); // update the camera's interpolation

    this.moveCamera(); // wipe the screen with a happy little layer of light blue

    this.skyShader.setUniform("offsetCoords", [this.interpolatedCamX, this.interpolatedCamY]);
    this.skyShader.setUniform("millis", this.millis());
    this.skyLayer.shader(this.skyShader); // this.fill(255, 0, 0);

    this.skyLayer.rect(0, 0, this.skyLayer.width, this.skyLayer.height);
    this.image(this.skyLayer, 0, 0, this.width, this.height);
    if (this.world !== undefined) this.world.render(this, this.upscaleSize); // render the player, all items, etc.  Basically any physicsRect or particle

    this.renderEntities(); // draw the hot bar

    this.noStroke();
    this.textAlign(this.RIGHT, this.BOTTOM);
    this.textSize(5 * this.upscaleSize);

    for (var i = 0; i < this.hotBar.length; i++) {
      if (this.selectedSlot === i) {
        Assets_1.UiAssets.ui_slot_selected.render(this, 2 * this.upscaleSize + 16 * i * this.upscaleSize, 2 * this.upscaleSize, 16 * this.upscaleSize, 16 * this.upscaleSize);
      } else {
        Assets_1.UiAssets.ui_slot.render(this, 2 * this.upscaleSize + 16 * i * this.upscaleSize, 2 * this.upscaleSize, 16 * this.upscaleSize, 16 * this.upscaleSize);
      }

      if (this.hotBar[i] !== undefined) {
        this.fill(0);

        if (this.pickedUpSlot === i) {
          this.tint(255, 127);
          this.fill(0, 127);
        }

        this.hotBar[i].item.texture.render(this, 6 * this.upscaleSize + 16 * i * this.upscaleSize, 6 * this.upscaleSize, 8 * this.upscaleSize, 8 * this.upscaleSize);
        this.text(this.hotBar[i].stackSize, 16 * this.upscaleSize + 16 * i * this.upscaleSize, 16 * this.upscaleSize);
        this.noTint();
      }
    } // draw the cursor


    this.drawCursor();
    if (this.currentUi !== undefined) this.currentUi.render(this, this.upscaleSize); // console.timeEnd("frame");
  };

  Game.prototype.windowResized = function () {
    this.resizeCanvas(this.windowWidth, this.windowHeight); // go for a scale of <48 tiles screen

    this.upscaleSize = Math.min(this.ceil(this.windowWidth / 48 / this.TILE_WIDTH), this.ceil(this.windowHeight / 48 / this.TILE_HEIGHT)); // according to a google search, there isn't a resizeGraphics() function????

    this.skyLayer.resizeCanvas(this.width, this.height);
    this.skyShader.setUniform("screenDimensions", [this.skyLayer.width / this.upscaleSize, this.skyLayer.height / this.upscaleSize]);
    if (this.currentUi !== undefined) this.currentUi.windowUpdate(); // if the world width or height are either less than 64, I think a bug will happen where the screen shakes.  If you need to, uncomment this code.
    // // if the world is too zoomed out, then zoom it in.
    // while (
    //     this.worldWidth * this.TILE_WIDTH - this.width / this.upscaleSize <
    //         0 ||
    //     this.worldHeight * this.TILE_HEIGHT -
    //         this.height / this.upscaleSize <
    //         0
    // ) {
    //     this.upscaleSize += 2;
    // }
  };

  Game.prototype.keyPressed = function () {
    this.keys[this.keyCode] = true;

    if (this.controls.includes(this.keyCode)) {
      // hot bar slots
      for (var i = 0; i < 12; i++) {
        if (this.keyCode === this.controls[i + 5]) {
          if (this.mouseX > 2 * this.upscaleSize && this.mouseX < 2 * this.upscaleSize + 16 * this.upscaleSize * this.hotBar.length && this.mouseY > 2 * this.upscaleSize && this.mouseY < 18 * this.upscaleSize) {
            var temp = this.hotBar[i];
            this.hotBar[i] = this.hotBar[this.floor((this.mouseX - 2 * this.upscaleSize) / 16 / this.upscaleSize)];
            this.hotBar[this.floor((this.mouseX - 2 * this.upscaleSize) / 16 / this.upscaleSize)] = temp;
          } else this.selectedSlot = i;

          return;
        }
      }

      if (this.keyCode === this.controls[4]) {
        console.log('Inventory opened');
      }

      if (this.keyCode === this.controls[3]) {
        console.log("paused");
        this.currentUi = new PauseMenu_1.PauseMenu(Assets_1.Fonts.title);
        console.log(this.currentUi);
      }
    }
  };

  Game.prototype.keyReleased = function () {
    this.keys[this.keyCode] = false;
  }; // when it's dragged update the sliders


  Game.prototype.mouseDragged = function () {
    if (this.currentUi !== undefined && this.currentUi.sliders !== undefined) {
      for (var _i = 0, _a = this.currentUi.sliders; _i < _a.length; _i++) {
        var i = _a[_i];
        i.updateSliderPosition(this.mouseX, this.mouseY);
      }
    }
  };

  Game.prototype.mouseMoved = function () {
    if (this.currentUi !== undefined && this.currentUi.buttons !== undefined) {
      for (var _i = 0, _a = this.currentUi.buttons; _i < _a.length; _i++) {
        var i = _a[_i];
        i.updateMouseOver(this.mouseX, this.mouseY);
      }
    }
  };

  Game.prototype.mousePressed = function () {
    var _a; // image(uiSlotImage, 2*upscaleSize+16*i*upscaleSize, 2*upscaleSize, 16*upscaleSize, 16*upscaleSize);


    if (this.currentUi !== undefined) {
      this.currentUi.mousePressed();
      return; // asjgsadkjfgIISUSUEUE
    }

    if (this.mouseX > 2 * this.upscaleSize && this.mouseX < 2 * this.upscaleSize + 16 * this.upscaleSize * this.hotBar.length && this.mouseY > 2 * this.upscaleSize && this.mouseY < 18 * this.upscaleSize) {
      var clickedSlot = this.floor((this.mouseX - 2 * this.upscaleSize) / 16 / this.upscaleSize);

      if (this.pickedUpSlot === -1) {
        if (this.hotBar[clickedSlot] !== undefined) {
          this.pickedUpSlot = clickedSlot;
        }
      } else {
        // Swap clicked slot with the picked slot
        _a = [this.hotBar[clickedSlot], this.hotBar[this.pickedUpSlot]], this.hotBar[this.pickedUpSlot] = _a[0], this.hotBar[clickedSlot] = _a[1]; // Set the picked up slot to nothing

        this.pickedUpSlot = -1;
      }
    } else if (this.world !== undefined && this.world.worldTiles !== undefined) {
      // If the tile is air
      if (this.world.worldTiles[this.world.width * this.worldMouseY + this.worldMouseX] === 0) return;
      this.connection.emit('world-break-start', this.world.width * this.worldMouseY + this.worldMouseX);
      this.connection.emit('world-break-finish');
      /*
      const tile: Tile =
          Tiles[
              this.world.worldTiles[
                  this.worldWidth * this.worldMouseY + this.worldMouseX
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
  };

  Game.prototype.mouseReleased = function () {
    var _a;

    var releasedSlot = this.floor((this.mouseX - 2 * this.upscaleSize) / 16 / this.upscaleSize);

    if (this.pickedUpSlot !== -1) {
      if (this.mouseX > 2 * this.upscaleSize && this.mouseX < 2 * this.upscaleSize + 16 * this.upscaleSize * this.hotBar.length && this.mouseY > 2 * this.upscaleSize && this.mouseY < 18 * this.upscaleSize) {
        // Make sure that the slot that the cursor was released was not the slot that was selected
        if (releasedSlot === this.pickedUpSlot) return; // Swap the picked up slot with the slot the mouse was released on

        _a = [this.hotBar[releasedSlot], this.hotBar[this.pickedUpSlot]], this.hotBar[this.pickedUpSlot] = _a[0], this.hotBar[releasedSlot] = _a[1];
        this.pickedUpSlot = -1;
      } else {
        this.dropItemStack(this.hotBar[this.pickedUpSlot], (this.interpolatedCamX * this.TILE_WIDTH + this.mouseX / this.upscaleSize) / this.TILE_WIDTH, (this.interpolatedCamY * this.TILE_HEIGHT + this.mouseY / this.upscaleSize) / this.TILE_HEIGHT);
        this.hotBar[this.pickedUpSlot] = undefined;
        this.pickedUpSlot = -1;
      }
    }
  };

  Game.prototype.moveCamera = function () {
    this.interpolatedCamX = this.pCamX + (this.camX - this.pCamX) * this.amountSinceLastTick;
    this.interpolatedCamY = this.pCamY + (this.camY - this.pCamY) * this.amountSinceLastTick;
  };

  Game.prototype.drawTile = function (tileIndex) {
    if (this.world.worldTiles[tileIndex] !== 0) {
      // Draw the correct image for the tile onto the tile layer
      var tile = Tiles_1.Tiles[this.world.worldTiles[tileIndex]]; // if the tile is off-screen

      if (tile === undefined) {
        return;
      }

      if (tile.connected && tile.texture instanceof TileResource_1["default"]) {
        // test if the neighboring tiles are solid
        // console.log(Math.floor((tileIndex - this.world.width) / this.world.width))
        var topTileBool = Math.floor((tileIndex - this.world.width) / this.world.width) <= 0 || this.world.worldTiles[tileIndex - this.world.width] !== 0;
        var leftTileBool = tileIndex % this.world.width === 0 || this.world.worldTiles[tileIndex - 1] !== 0;
        var bottomTileBool = Math.floor((tileIndex - this.world.width) / this.world.width) >= this.world.height - 1 || this.world.worldTiles[tileIndex + this.world.width] !== 0;
        var rightTileBool = tileIndex % this.world.width === this.world.width - 1 || this.world.worldTiles[tileIndex + 1] !== 0; // convert 4 digit binary number to base 10

        var tileSetIndex = 8 * +topTileBool + 4 * +rightTileBool + 2 * +bottomTileBool + +leftTileBool; // Render connected tile

        tile.texture.renderTile(tileSetIndex, this.world.tileLayer, tileIndex % this.world.width * this.TILE_WIDTH, Math.floor(tileIndex / this.world.width) * this.TILE_HEIGHT, this.TILE_WIDTH, this.TILE_HEIGHT);
      } else if (!tile.connected && tile.texture instanceof ImageResource_1["default"]) {
        // Render non-connected tile
        tile.texture.render(this.world.tileLayer, tileIndex % this.world.width, Math.floor(tileIndex / this.world.width), this.TILE_WIDTH, this.TILE_HEIGHT);
      }
    }
  };

  Game.prototype.doTicks = function () {
    // increase the time since a tick has happened by deltaTime, which is a built-in p5.js value
    this.msSinceTick += this.deltaTime; // define a temporary variable called ticksThisFrame - this is used to keep track of how many ticks have been calculated within the duration of the current frame.  As long as this value is less than the forgivenessCount variable, it continues to calculate ticks as necessary.

    var ticksThisFrame = 0;

    while (this.msSinceTick > this.msPerTick && ticksThisFrame !== this.forgivenessCount) {
      // console.time("tick");
      if (this.world !== undefined) this.doTick(); // console.timeEnd("tick");

      this.msSinceTick -= this.msPerTick;
      ticksThisFrame++;
    }

    if (ticksThisFrame === this.forgivenessCount) {
      this.msSinceTick = 0;
      console.warn("lag spike detected, tick calculations couldn't keep up");
    }

    this.amountSinceLastTick = this.msSinceTick / this.msPerTick;
  };

  Game.prototype.doTick = function () {
    if (this.world.player === undefined) return;
    this.world.player.keyboardInput();
    this.world.player.applyGravityAndDrag();
    this.world.player.applyVelocityAndCollide();
    this.pCamX = this.camX;
    this.pCamY = this.camY;
    var desiredCamX = this.world.player.x + this.world.player.width / 2 - this.width / 2 / this.TILE_WIDTH / this.upscaleSize + this.world.player.xVel * 40;
    var desiredCamY = this.world.player.y + this.world.player.height / 2 - this.height / 2 / this.TILE_HEIGHT / this.upscaleSize + this.world.player.yVel * 20;
    this.camX = (desiredCamX + this.camX * 24) / 25;
    this.camY = (desiredCamY + this.camY * 24) / 25;

    if (this.camX < 0) {
      this.camX = 0;
    } else if (this.camX > this.worldWidth - this.width / this.upscaleSize / this.TILE_WIDTH) {
      this.camX = this.worldWidth - this.width / this.upscaleSize / this.TILE_WIDTH;
    }

    if (this.camY > this.worldHeight - this.height / this.upscaleSize / this.TILE_HEIGHT) {
      this.camY = this.worldHeight - this.height / this.upscaleSize / this.TILE_HEIGHT;
    }

    for (var _i = 0, _a = this.items; _i < _a.length; _i++) {
      var item = _a[_i];
      item.goTowardsPlayer();
      item.combineWithNearItems();
      item.applyGravityAndDrag();
      item.applyVelocityAndCollide();
    }

    for (var i = 0; i < this.items.length; i++) {
      if (this.items[i].deleted === true) {
        this.items.splice(i, 1);
        i--;
      }
    }
  };

  Game.prototype.uiFrameRect = function (x, y, w, h) {
    // set the coords and dimensions to round to the nearest un-upscaled pixel
    x = this.round(x / this.upscaleSize) * this.upscaleSize;
    y = this.round(y / this.upscaleSize) * this.upscaleSize;
    w = this.round(w / this.upscaleSize) * this.upscaleSize;
    h = this.round(h / this.upscaleSize) * this.upscaleSize; // corners

    Assets_1.UiAssets.ui_frame.renderPartial(this, x, y, 7 * this.upscaleSize, 7 * this.upscaleSize, 0, 0, 7, 7);
    Assets_1.UiAssets.ui_frame.renderPartial(this, x + w - 7 * this.upscaleSize, y, 7 * this.upscaleSize, 7 * this.upscaleSize, 8, 0, 7, 7);
    Assets_1.UiAssets.ui_frame.renderPartial(this, x, y + h - 7 * this.upscaleSize, 7 * this.upscaleSize, 7 * this.upscaleSize, 0, 8, 7, 7);
    Assets_1.UiAssets.ui_frame.renderPartial(this, x + w - 7 * this.upscaleSize, y + h - 7 * this.upscaleSize, 7 * this.upscaleSize, 7 * this.upscaleSize, 8, 8, 7, 7); // top and bottom

    Assets_1.UiAssets.ui_frame.renderPartial(this, x + 7 * this.upscaleSize, y, w - 14 * this.upscaleSize, 7 * this.upscaleSize, 7, 0, 1, 7);
    Assets_1.UiAssets.ui_frame.renderPartial(this, x + 7 * this.upscaleSize, y + h - 7 * this.upscaleSize, w - 14 * this.upscaleSize, 7 * this.upscaleSize, 7, 8, 1, 7); // left and right

    Assets_1.UiAssets.ui_frame.renderPartial(this, x, y + 7 * this.upscaleSize, 7 * this.upscaleSize, h - 14 * this.upscaleSize, 0, 7, 7, 1);
    Assets_1.UiAssets.ui_frame.renderPartial(this, x + w - 7 * this.upscaleSize, y + 7 * this.upscaleSize, 7 * this.upscaleSize, h - 14 * this.upscaleSize, 8, 7, 7, 1); // center

    Assets_1.UiAssets.ui_frame.renderPartial(this, x + 7 * this.upscaleSize, y + 7 * this.upscaleSize, w - 14 * this.upscaleSize, h - 14 * this.upscaleSize, 7, 7, 1, 1);
  };
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


  Game.prototype.rectVsRay = function (rectX, rectY, rectW, rectH, rayX, rayY, rayW, rayH) {
    // this ray is actually a line segment mathematically, but it's common to see people refer to similar checks as ray-casts, so for the duration of the definition of this function, ray can be assumed to mean the same as line segment.
    // if the ray doesn't have a length, then it can't have entered the rectangle.  This assumes that the objects don't start in collision, otherwise they'll behave strangely
    if (rayW === 0 && rayH === 0) {
      return false;
    } // calculate how far along the ray each side of the rectangle intersects with it (each side is extended out infinitely in both directions)


    var topIntersection = (rectY - rayY) / rayH;
    var bottomIntersection = (rectY + rectH - rayY) / rayH;
    var leftIntersection = (rectX - rayX) / rayW;
    var rightIntersection = (rectX + rectW - rayX) / rayW;

    if (isNaN(topIntersection) || isNaN(bottomIntersection) || isNaN(leftIntersection) || isNaN(rightIntersection)) {
      // you have to use the JS function isNaN() to check if a value is NaN because both NaN==NaN and NaN===NaN are false.
      // if any of these values are NaN, no collision has occurred
      return false;
    } // calculate the nearest and farthest intersections for both x and y


    var nearX = this.min(leftIntersection, rightIntersection);
    var farX = this.max(leftIntersection, rightIntersection);
    var nearY = this.min(topIntersection, bottomIntersection);
    var farY = this.max(topIntersection, bottomIntersection);

    if (nearX > farY || nearY > farX) {
      // this must mean that the line that makes up the line segment doesn't pass through the ray
      return false;
    }

    if (farX < 0 || farY < 0) {
      // the intersection is happening before the ray starts, so the ray is pointing away from the triangle
      return false;
    } // calculate where the potential collision could be


    var nearCollisionPoint = this.max(nearX, nearY);

    if (nearX > 1 || nearY > 1) {
      // the intersection happens after the ray(line segment) ends
      return false;
    }

    if (nearX === nearCollisionPoint) {
      // it must have collided on either the left or the right! now which?
      if (leftIntersection === nearX) {
        // It must have collided on the left!  Return the collision normal [-1, 0]
        return [-1, 0, nearCollisionPoint];
      } // If it didn't collide on the left, it must have collided on the right.  Return the collision normal [1, 0]


      return [1, 0, nearCollisionPoint];
    } // If it didn't collide on the left or right, it must have collided on either the top or the bottom! now which?


    if (topIntersection === nearY) {
      // It must have collided on the top!  Return the collision normal [0, -1]
      return [0, -1, nearCollisionPoint];
    } // If it didn't collide on the top, it must have collided on the bottom.  Return the collision normal [0, 1]


    return [0, 1, nearCollisionPoint]; // output if no collision: false
    // output if collision: [collision normal X, collision normal Y, nearCollisionPoint]
    //                         -1 to 1              -1 to 1            0 to 1
  };

  Game.prototype.renderEntities = function () {
    // draw player
    this.fill(255, 0, 0);
    this.noStroke(); // this.rect(
    //     (this.world.player.interpolatedX * this.TILE_WIDTH -
    //         this.interpolatedCamX * this.TILE_WIDTH) *
    //         this.upscaleSize,
    //     (this.world.player.interpolatedY * this.TILE_HEIGHT -
    //         this.interpolatedCamY * this.TILE_HEIGHT) *
    //         this.upscaleSize,
    //     this.world.player.width * this.upscaleSize * this.TILE_WIDTH,
    //     this.world.player.height * this.upscaleSize * this.TILE_HEIGHT
    // );

    for (var _i = 0, _a = this.items; _i < _a.length; _i++) {
      var item = _a[_i];
      item.findInterpolatedCoordinates();
      item.itemStack.item.texture.render(this, (item.interpolatedX * this.TILE_WIDTH - this.interpolatedCamX * this.TILE_WIDTH) * this.upscaleSize, (item.interpolatedY * this.TILE_HEIGHT - this.interpolatedCamY * this.TILE_HEIGHT) * this.upscaleSize, item.w * this.upscaleSize * this.TILE_WIDTH, item.h * this.upscaleSize * this.TILE_HEIGHT); // Render the item quantity label

      this.fill(0);
      this.noStroke();
      this.textAlign(this.RIGHT, this.BOTTOM);
      this.textSize(5 * this.upscaleSize);
      this.text(item.itemStack.stackSize, (item.interpolatedX * this.TILE_WIDTH - this.interpolatedCamX * this.TILE_WIDTH) * this.upscaleSize, (item.interpolatedY * this.TILE_HEIGHT - this.interpolatedCamY * this.TILE_HEIGHT) * this.upscaleSize);
    }
  };

  Game.prototype.dropItemStack = function (itemStack, x, y) {
    this.items.push(new EntityItem_1["default"](itemStack, x, y, 0.5, 0.5, this.random(-0.1, 0.1), this.random(-0.1, 0)));
  };

  Game.prototype.pickUpItem = function (itemStack) {
    for (var i = 0; i < this.hotBar.length; i++) {
      var item = this.hotBar[i]; // If there are no items in the current slot of the hotBar

      if (item === undefined) {
        this.hotBar[i] = itemStack;
        return true;
      }

      if (item.item === itemStack.item && item.stackSize < item.item.maxStackSize) {
        var remainingSpace = item.item.maxStackSize - item.stackSize; // Top off the stack with items if it can take more than the stack being added

        if (remainingSpace >= itemStack.stackSize) {
          this.hotBar[i].stackSize = item.stackSize + itemStack.stackSize;
          return true;
        }

        itemStack.stackSize -= remainingSpace;
        this.hotBar[i].stackSize = itemStack.item.maxStackSize;
      }
    }

    console.error("Could not pickup " + itemStack.stackSize + " " + itemStack.item.name);
    return false;
  };

  Game.prototype.mouseExited = function () {
    this.mouseOn = false;
  };

  Game.prototype.mouseEntered = function () {
    this.mouseOn = true;
  };

  Game.prototype.updateMouse = function () {
    // world mouse x and y variables hold the mouse position in world tiles.  0, 0 is top left
    this.worldMouseX = this.floor((this.interpolatedCamX * this.TILE_WIDTH + this.mouseX / this.upscaleSize) / this.TILE_WIDTH);
    this.worldMouseY = this.floor((this.interpolatedCamY * this.TILE_HEIGHT + this.mouseY / this.upscaleSize) / this.TILE_HEIGHT);
  };

  Game.prototype.drawCursor = function () {
    if (this.mouseOn) {
      if (this.pickedUpSlot > -1) {
        this.hotBar[this.pickedUpSlot].item.texture.render(this, this.mouseX, this.mouseY, 8 * this.upscaleSize, 8 * this.upscaleSize);
        this.text(this.hotBar[this.pickedUpSlot].stackSize, this.mouseX + 10 * this.upscaleSize, this.mouseY + 10 * this.upscaleSize);
      }
    }
  };

  return Game;
}(p5_1["default"]);

module.exports = Game;