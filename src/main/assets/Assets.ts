import TileResource from './resources/TileResource';
import ImageResource from './resources/ImageResource';
import FontResource from './resources/FontResource';
import Resource from './resources/Resource';
import P5 from 'p5';

interface AssetGroup {
    [name: string]:
        | {
              [name: string]: Resource | AssetGroup;
          }
        | Resource;
}

// Ui related assets
const UiAssets = {
    ui_slot_selected: new ImageResource(
        'assets/textures/ui/uislot_selected.png'
    ),
    ui_slot: new ImageResource('assets/textures/ui/uislot.png'),
    ui_frame: new ImageResource('assets/textures/ui/uiframe.png')
};

// Item related assets
const ItemsAssets = {
    resources: {
        ice_shard: new ImageResource(
            'assets/textures/items/resource_ice_shards.png'
        ),

        snowball: new ImageResource(
            'assets/textures/items/resource_snowball.png'
        ),
    },
    consumables: {
        snow_berries: new ImageResource(
            'assets/textures/items/consumable_snow_berries.png'
        ),
    },
    blocks: {
        ice: new ImageResource('assets/textures/items/block_ice.png'),
        snow: new ImageResource('assets/textures/items/block_snow.png'),
    },
    tools: {},
};

// World related assets
const WorldAssets = {
    background: {
        snow: new ImageResource('assets/textures/world/background/snow.png'),
    },
    middleground: {
        tileset_ice: new TileResource(
            'assets/textures/world/middleground/tileset_ice.png',
            16,
            1,
            8,
            8
        ),
        tileset_snow: new TileResource(
            'assets/textures/world/middleground/tileset_snow.png',
            16,
            1,
            8,
            8
        ),
    },
    foreground: {
        tileset_pipe: new TileResource(
            'assets/textures/world/foreground/tileset_pipe.png',
            16,
            1,
            8,
            8
        ),
    },
};

// The game font
const Fonts = {
    title: new FontResource('assets/fonts/Cave-Story.ttf'),
};

const loadAssets = (sketch: P5, ...assets: AssetGroup[]) => {
    assets.forEach((assetGroup) => {
        searchGroup(assetGroup, sketch);
    });
};

function searchGroup(assetGroup: AssetGroup | Resource, sketch: P5) {
    if (assetGroup instanceof Resource) {
        console.log(`Loading asset ${assetGroup.path}`);
        assetGroup.loadResource(sketch);
        return;
    }
    Object.entries(assetGroup).forEach((asset) => {
        searchGroup(asset[1], sketch);
    });
}

export { UiAssets, ItemsAssets, WorldAssets, Fonts, loadAssets };
