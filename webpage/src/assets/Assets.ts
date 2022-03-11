import TileResource from './resources/TileResource';
import ImageResource from './resources/ImageResource';
import FontResource from './resources/FontResource';
import Resource from './resources/Resource';
import AudioResourceGroup from './resources/AudioResourceGroup';
import P5 from 'p5';
import AudioResource from './resources/AudioResource';

interface AssetGroup {
    [name: string]:
    | {
        [name: string]: Resource | AssetGroup | AudioResourceGroup;
    }
    | Resource;
}

// Ui related assets
const UiAssets = {
    ui_slot_selected: new ImageResource(
        'assets/textures/ui/uislot_selected.png'
    ),
    ui_slot: new ImageResource('assets/textures/ui/uislot.png'),
    ui_frame: new ImageResource('assets/textures/ui/uiframe.png'),
    button_unselected: new ImageResource('assets/textures/ui/button0.png'),
    button_selected: new ImageResource('assets/textures/ui/button1.png'),
    slider_bar: new ImageResource('assets/textures/ui/sliderBar.png'),
    slider_handle: new ImageResource('assets/textures/ui/sliderHandle.png'),
    title_image: new ImageResource('assets/textures/ui/snowedinBUMP.png')
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
    title: new FontResource('assets/textures/ui/font.png', {
        "0": 7,
        "1": 7,
        "2": 7,
        "3": 6,
        "4": 6,
        "5": 6,
        "6": 6,
        "7": 7,
        "8": 7,
        "9": 6,
        "A": 6,
        "B": 7,
        "C": 7,
        "D": 6,
        "E": 7,
        "F": 6,
        "G": 7,
        "H": 7,
        "I": 7,
        "J": 8,
        "K": 6,
        "L": 6,
        "M": 8,
        "N": 8,
        "O": 8,
        "P": 9,
        "Q": 8,
        "R": 7,
        "S": 7,
        "T": 8,
        "U": 8,
        "V": 8,
        "W": 10,
        "X": 8,
        "Y": 8,
        "Z": 9,
        "a": 7,
        "b": 7,
        "c": 6,
        "d": 7,
        "e": 6,
        "f": 6,
        "g": 6,
        "h": 6,
        "i": 5,
        "j": 6,
        "k": 5,
        "l": 5,
        "m": 8,
        "n": 5,
        "o": 5,
        "p": 5,
        "q": 7,
        "r": 5,
        "s": 4,
        "t": 5,
        "u": 5,
        "v": 5,
        "w": 7,
        "x": 6,
        "y": 5,
        "z": 5,
        "!": 4,
        ".": 2,
        ",": 2,
        "?": 6,
        "_": 6,
        "-": 4,
        ":": 2,
        " ": 2
    }, "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!.,?_-: "),
};

const AudioAssets = {
    ui: {
        inventoryClack: new AudioResourceGroup([new AudioResource('assets/sounds/clack1.mp3'), new AudioResource('assets/sounds/clack3.mp3'), new AudioResource('assets/sounds/clack3.mp3')])
    }
}

const Keys = {
    keyboardMap: [
        "", // [0]
        "", // [1]
        "", // [2]
        "CANCEL", // [3]
        "", // [4]
        "", // [5]
        "HELP", // [6]
        "", // [7]
        "BACK_SPACE", // [8]
        "TAB", // [9]
        "", // [10]
        "", // [11]
        "CLEAR", // [12]
        "ENTER", // [13]
        "ENTER_SPECIAL", // [14]
        "", // [15]
        "SHIFT", // [16]
        "CONTROL", // [17]
        "ALT", // [18]
        "PAUSE", // [19]
        "CAPS_LOCK", // [20]
        "KANA", // [21]
        "EISU", // [22]
        "JUNJA", // [23]
        "FINAL", // [24]
        "HANJA", // [25]
        "", // [26]
        "ESCAPE", // [27]
        "CONVERT", // [28]
        "NONCONVERT", // [29]
        "ACCEPT", // [30]
        "MODECHANGE", // [31]
        "SPACE", // [32]
        "PAGE_UP", // [33]
        "PAGE_DOWN", // [34]
        "END", // [35]
        "HOME", // [36]
        "LEFT", // [37]
        "UP", // [38]
        "RIGHT", // [39]
        "DOWN", // [40]
        "SELECT", // [41]
        "PRINT", // [42]
        "EXECUTE", // [43]
        "PRINTSCREEN", // [44]
        "INSERT", // [45]
        "DELETE", // [46]
        "", // [47]
        "0", // [48]
        "1", // [49]
        "2", // [50]
        "3", // [51]
        "4", // [52]
        "5", // [53]
        "6", // [54]
        "7", // [55]
        "8", // [56]
        "9", // [57]
        "COLON", // [58]
        "SEMICOLON", // [59]
        "LESS_THAN", // [60]
        "EQUALS", // [61]
        "GREATER_THAN", // [62]
        "QUESTION_MARK", // [63]
        "AT", // [64]
        "A", // [65]
        "B", // [66]
        "C", // [67]
        "D", // [68]
        "E", // [69]
        "F", // [70]
        "G", // [71]
        "H", // [72]
        "I", // [73]
        "J", // [74]
        "K", // [75]
        "L", // [76]
        "M", // [77]
        "N", // [78]
        "O", // [79]
        "P", // [80]
        "Q", // [81]
        "R", // [82]
        "S", // [83]
        "T", // [84]
        "U", // [85]
        "V", // [86]
        "W", // [87]
        "X", // [88]
        "Y", // [89]
        "Z", // [90]
        "OS_KEY", // [91] Windows Key (Windows) or Command Key (Mac)
        "", // [92]
        "CONTEXT_MENU", // [93]
        "", // [94]
        "SLEEP", // [95]
        "NUMPAD0", // [96]
        "NUMPAD1", // [97]
        "NUMPAD2", // [98]
        "NUMPAD3", // [99]
        "NUMPAD4", // [100]
        "NUMPAD5", // [101]
        "NUMPAD6", // [102]
        "NUMPAD7", // [103]
        "NUMPAD8", // [104]
        "NUMPAD9", // [105]
        "MULTIPLY", // [106]
        "ADD", // [107]
        "SEPARATOR", // [108]
        "SUBTRACT", // [109]
        "DECIMAL", // [110]
        "DIVIDE", // [111]
        "F1", // [112]
        "F2", // [113]
        "F3", // [114]
        "F4", // [115]
        "F5", // [116]
        "F6", // [117]
        "F7", // [118]
        "F8", // [119]
        "F9", // [120]
        "F10", // [121]
        "F11", // [122]
        "F12", // [123]
        "F13", // [124]
        "F14", // [125]
        "F15", // [126]
        "F16", // [127]
        "F17", // [128]
        "F18", // [129]
        "F19", // [130]
        "F20", // [131]
        "F21", // [132]
        "F22", // [133]
        "F23", // [134]
        "F24", // [135]
        "", // [136]
        "", // [137]
        "", // [138]
        "", // [139]
        "", // [140]
        "", // [141]
        "", // [142]
        "", // [143]
        "NUM_LOCK", // [144]
        "SCROLL_LOCK", // [145]
        "WIN_OEM_FJ_JISHO", // [146]
        "WIN_OEM_FJ_MASSHOU", // [147]
        "WIN_OEM_FJ_TOUROKU", // [148]
        "WIN_OEM_FJ_LOYA", // [149]
        "WIN_OEM_FJ_ROYA", // [150]
        "", // [151]
        "", // [152]
        "", // [153]
        "", // [154]
        "", // [155]
        "", // [156]
        "", // [157]
        "", // [158]
        "", // [159]
        "CIRCUMFLEX", // [160]
        "EXCLAMATION", // [161]
        "DOUBLE_QUOTE", // [162]
        "HASH", // [163]
        "DOLLAR", // [164]
        "PERCENT", // [165]
        "AMPERSAND", // [166]
        "UNDERSCORE", // [167]
        "OPEN_PAREN", // [168]
        "CLOSE_PAREN", // [169]
        "ASTERISK", // [170]
        "PLUS", // [171]
        "PIPE", // [172]
        "HYPHEN_MINUS", // [173]
        "OPEN_CURLY_BRACKET", // [174]
        "CLOSE_CURLY_BRACKET", // [175]
        "TILDE", // [176]
        "", // [177]
        "", // [178]
        "", // [179]
        "", // [180]
        "VOLUME_MUTE", // [181]
        "VOLUME_DOWN", // [182]
        "VOLUME_UP", // [183]
        "", // [184]
        "", // [185]
        "SEMICOLON", // [186]
        "EQUALS", // [187]
        "COMMA", // [188]
        "MINUS", // [189]
        "PERIOD", // [190]
        "SLASH", // [191]
        "BACK_QUOTE", // [192]
        "", // [193]
        "", // [194]
        "", // [195]
        "", // [196]
        "", // [197]
        "", // [198]
        "", // [199]
        "", // [200]
        "", // [201]
        "", // [202]
        "", // [203]
        "", // [204]
        "", // [205]
        "", // [206]
        "", // [207]
        "", // [208]
        "", // [209]
        "", // [210]
        "", // [211]
        "", // [212]
        "", // [213]
        "", // [214]
        "", // [215]
        "", // [216]
        "", // [217]
        "", // [218]
        "OPEN_BRACKET", // [219]
        "BACK_SLASH", // [220]
        "CLOSE_BRACKET", // [221]
        "QUOTE", // [222]
        "", // [223]
        "META", // [224]
        "ALTGR", // [225]
        "", // [226]
        "WIN_ICO_HELP", // [227]
        "WIN_ICO_00", // [228]
        "", // [229]
        "WIN_ICO_CLEAR", // [230]
        "", // [231]
        "", // [232]
        "WIN_OEM_RESET", // [233]
        "WIN_OEM_JUMP", // [234]
        "WIN_OEM_PA1", // [235]
        "WIN_OEM_PA2", // [236]
        "WIN_OEM_PA3", // [237]
        "WIN_OEM_WSCTRL", // [238]
        "WIN_OEM_CUSEL", // [239]
        "WIN_OEM_ATTN", // [240]
        "WIN_OEM_FINISH", // [241]
        "WIN_OEM_COPY", // [242]
        "WIN_OEM_AUTO", // [243]
        "WIN_OEM_ENLW", // [244]
        "WIN_OEM_BACKTAB", // [245]
        "ATTN", // [246]
        "CRSEL", // [247]
        "EXSEL", // [248]
        "EREOF", // [249]
        "PLAY", // [250]
        "ZOOM", // [251]
        "", // [252]
        "PA1", // [253]
        "WIN_OEM_CLEAR", // [254]
        "" // [255]
      ]// https://stackoverflow.com/questions/1772179/get-character-value-from-keycode-in-javascript-then-trim
}


const loadAssets = (sketch: P5, ...assets: AssetGroup[]) => {
    assets.forEach((assetGroup) => {
        searchGroup(assetGroup, sketch);
    });

};

function searchGroup(assetGroup: AssetGroup | Resource | AudioResourceGroup, sketch: P5) {
    if (assetGroup instanceof Resource) {
        console.log(`Loading asset ${assetGroup.path}`);
        assetGroup.loadResource(sketch);
        return;
    }
    Object.entries(assetGroup).forEach((asset) => {
        searchGroup(asset[1], sketch);
    });
}

export { UiAssets, ItemsAssets, WorldAssets, Fonts, AudioAssets, Keys, loadAssets };
