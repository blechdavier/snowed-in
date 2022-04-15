import { TileResource } from './resources/TileResource';
import { ImageResource } from './resources/ImageResource';
import { FontResource } from './resources/FontResource';
import { Resource } from './resources/Resource';
import { AudioResourceGroup } from './resources/AudioResourceGroup';
import p5 from 'p5';
import { AudioResource } from './resources/AudioResource';
import { ItemType } from '../../global/Inventory';
import { TileType } from '../../global/Tile';

interface AssetGroup {
    [name: string]:
        | {
              [name: string]: Resource | AssetGroup | AudioResourceGroup | undefined;
          }
        | Resource | undefined;
}

// Ui related assets
export const UiAssets = {
    ui_slot_selected: new ImageResource(
        'assets/textures/ui/uislot_selected.png'
    ),
    ui_slot: new ImageResource('assets/textures/ui/uislot.png'),
    ui_frame: new ImageResource('assets/textures/ui/uiframe.png'),
    button_unselected: new ImageResource('assets/textures/ui/button0.png'),
    button_selected: new ImageResource('assets/textures/ui/button1.png'),
    slider_bar: new ImageResource('assets/textures/ui/sliderBar.png'),
    slider_handle: new ImageResource('assets/textures/ui/sliderHandle.png'),
    title_image: new ImageResource('assets/textures/ui/snowedinBUMP.png'),
};

// Item related assets
export const ItemAssets: Record<ItemType, ImageResource> = {
    [ItemType.SnowBlock]: new ImageResource(
        'assets/textures/items/block_snow.png'
    ),
    [ItemType.IceBlock]: new ImageResource(
        'assets/textures/items/block_ice.png'
    ),
};

// World related assets
const tileAssetData = <T extends Record<TileType, ImageResource | TileResource | undefined>, K>(data: T, ): T => data

export const WorldAssets = tileAssetData( {
    [TileType.Air]: undefined,
    [TileType.Snow]: new TileResource(
        'assets/textures/world/middleground/tileset_snow.png',
        16,
        1,
        8,
        8
    ),
    [TileType.Ice]: new TileResource(
        'assets/textures/world/middleground/tileset_ice.png',
        16,
        1,
        8,
        8
    ),
})

export const Fonts = {
    title: new FontResource(
        'assets/textures/ui/font.png',
        {
            '0': 7,
            '1': 7,
            '2': 7,
            '3': 6,
            '4': 6,
            '5': 6,
            '6': 6,
            '7': 7,
            '8': 7,
            '9': 6,
            A: 6,
            B: 7,
            C: 7,
            D: 6,
            E: 7,
            F: 6,
            G: 7,
            H: 7,
            I: 7,
            J: 8,
            K: 6,
            L: 6,
            M: 8,
            N: 8,
            O: 8,
            P: 9,
            Q: 8,
            R: 7,
            S: 7,
            T: 8,
            U: 8,
            V: 8,
            W: 10,
            X: 8,
            Y: 8,
            Z: 9,
            a: 7,
            b: 7,
            c: 6,
            d: 7,
            e: 6,
            f: 6,
            g: 6,
            h: 6,
            i: 5,
            j: 6,
            k: 5,
            l: 5,
            m: 8,
            n: 5,
            o: 5,
            p: 5,
            q: 7,
            r: 5,
            s: 4,
            t: 5,
            u: 5,
            v: 5,
            w: 7,
            x: 6,
            y: 5,
            z: 5,
            '!': 4,
            '.': 2,
            ',': 2,
            '?': 6,
            _: 6,
            '-': 4,
            ':': 2,
            ' ': 2,
        },
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!.,?_-: '
    ),
};

export const AudioAssets = {
    ui: {
        inventoryClack: new AudioResourceGroup([
            new AudioResource('assets/sounds/clack1.mp3'),
            new AudioResource('assets/sounds/clack3.mp3'),
            new AudioResource('assets/sounds/clack3.mp3'),
        ]),
    },
};

export const loadAssets = (sketch: p5, ...assets: AssetGroup[]) => {
    assets.forEach((assetGroup) => {
        searchGroup(assetGroup, sketch);
    });
};

export function searchGroup(
    assetGroup: AssetGroup | Resource,
    sketch: p5
) {
    if (assetGroup instanceof Resource) {
        console.log(`Loading asset ${assetGroup.path}`);
        assetGroup.loadResource(sketch);
        return;
    }
    Object.values(assetGroup).forEach((asset: Resource) => {
        if(asset != undefined)
          searchGroup(asset, sketch);
    });
}

