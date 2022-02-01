"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TileResource_1 = __importDefault(require("./TileResource"));
const Main_1 = require("../Main");
const Resource_1 = __importDefault(require("./Resource"));
const SelectedUISlot = new Resource_1.default(Main_1.game.loadImage('assets/textures/ui/selecteduislot.png'));
const UiSlot = new Resource_1.default(Main_1.game.loadImage('assets/textures/ui/uislot.png'));
const ItemsTileSet = new TileResource_1.default(32, 1, 8, 8, Main_1.game.loadImage('assets/textures/tilesets/middleground/indexedtileset.png'));
// Background snow (Not really a tile set)
const BackgroundTileSet = new Resource_1.default(Main_1.game.loadImage('assets/textures/tilesets/background/backgroundsnow.png'));
// the image that holds all versions of each tile (snow, ice, etc.)
const WorldTileSet = new TileResource_1.default(32, 1, 8, 8, Main_1.game.loadImage('assets/textures/tilesets/middleground/indexedtileset.png'));
// This holds the font for the game
const TitleFont = Main_1.game.loadFont('assets/fonts/Cave-Story.ttf');
// This holds the default custom cursor
const DefaultCursor = new Resource_1.default(Main_1.game.loadImage('assets/textures/cursors/cursor.png'));
// This is the data for the cursor while it is digging
const DiggingCursor = [
    new Resource_1.default(Main_1.game.loadImage('assets/textures/cursors/cursor_dig_0.png')),
    new Resource_1.default(Main_1.game.loadImage('assets/textures/cursors/cursor_dig_1.png')),
    new Resource_1.default(Main_1.game.loadImage('assets/textures/cursors/cursor_dig_2.png')),
    new Resource_1.default(Main_1.game.loadImage('assets/textures/cursors/cursor_dig_3.png')),
    new Resource_1.default(Main_1.game.loadImage('assets/textures/cursors/cursor_dig_4.png')),
    new Resource_1.default(Main_1.game.loadImage('assets/textures/cursors/cursor_dig_5.png')),
    new Resource_1.default(Main_1.game.loadImage('assets/textures/cursors/cursor_dig_6.png')),
    new Resource_1.default(Main_1.game.loadImage('assets/textures/cursors/cursor_dig_7.png')),
    new Resource_1.default(Main_1.game.loadImage('assets/textures/cursors/cursor_dig_8.png')),
    new Resource_1.default(Main_1.game.loadImage('assets/textures/cursors/cursor_dig_9.png')),
    new Resource_1.default(Main_1.game.loadImage('assets/textures/cursors/cursor_dig_10.png')),
    new Resource_1.default(Main_1.game.loadImage('assets/textures/cursors/cursor_dig_11.png')),
];
//# sourceMappingURL=Assets.js.map