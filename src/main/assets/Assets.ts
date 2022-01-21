import TileResource from './TileResource';
import { game } from '../Main';
import * as fs from 'fs';
import Resource from './Resource';
import P5 from 'p5';

const SelectedUISlot: Resource = new Resource(game.loadImage(
    'assets/textures/ui/selecteduislot.png'
))

const UiSlot: Resource = new Resource(game.loadImage('assets/textures/ui/uislot.png'));

const ItemsTileSet: TileResource = new TileResource(
    32,
    1,
    8,
    8,
    game.loadImage(
        'assets/textures/tilesets/middleground/indexedtileset.png'
    )
)

// Background snow (Not really a tile set)
const BackgroundTileSet = new Resource(
    game.loadImage('assets/textures/tilesets/background/backgroundsnow.png')
)

// the image that holds all versions of each tile (snow, ice, etc.)
const WorldTileSet: TileResource = new TileResource(
        32,
        1,
        8,
        8,
        game.loadImage(
            'assets/textures/tilesets/middleground/indexedtileset.png'
        )
    )

// This holds the font for the game
const TitleFont: P5.Font = game.loadFont('assets/fonts/Cave-Story.ttf');

// This holds the default custom cursor
const DefaultCursor: Resource = new Resource(game.loadImage('assets/textures/cursors/cursor.png'));

// This is the data for the cursor while it is digging
const DiggingCursor: Resource[] = [
        new Resource(game.loadImage('assets/textures/cursors/cursor_dig_0.png')),
        new Resource(game.loadImage('assets/textures/cursors/cursor_dig_1.png')),
        new Resource(game.loadImage('assets/textures/cursors/cursor_dig_2.png')),
        new Resource(game.loadImage('assets/textures/cursors/cursor_dig_3.png')),
        new Resource(game.loadImage('assets/textures/cursors/cursor_dig_4.png')),
        new Resource(game.loadImage('assets/textures/cursors/cursor_dig_5.png')),
        new Resource(game.loadImage('assets/textures/cursors/cursor_dig_6.png')),
        new Resource(game.loadImage('assets/textures/cursors/cursor_dig_7.png')),
        new Resource(game.loadImage('assets/textures/cursors/cursor_dig_8.png')),
        new Resource(game.loadImage('assets/textures/cursors/cursor_dig_9.png')),
        new Resource(game.loadImage('assets/textures/cursors/cursor_dig_10.png')),
        new Resource(game.loadImage('assets/textures/cursors/cursor_dig_11.png')),
    ];

export {};
