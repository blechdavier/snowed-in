import { TileResource } from './resources/TileResource';
import { ImageResource } from './resources/ImageResource';
import { FontResource } from './resources/FontResource';
import { AudioResourceGroup } from './resources/AudioResourceGroup';
import { AudioResource } from './resources/AudioResource';
import { ItemType } from '../../global/Inventory';
import { ReflectableImageResource } from './resources/ReflectedImageResource';
import P5 from 'p5';
import { Resource } from './resources/Resource';

interface AssetGroup {
	[name: string]:
		| {
				[name: string]:
					| Resource
					| AssetGroup
					| AudioResourceGroup[]
					| AudioResourceGroup
					| AudioResource
					| ImageResource[]
					| ImageResource[][]
                    | ReflectableImageResource[]
                    | ReflectableImageResource
					| [ReflectableImageResource, number][];
		  }
		| Resource
		| AssetGroup
		| AudioResourceGroup[]
		| AudioResourceGroup
		| AudioResource
		| ImageResource[]
		| ImageResource[][]
        | ReflectableImageResource[]
        | ReflectableImageResource
		| [ReflectableImageResource, number][];
}

const playerAnimations = <T extends Record<string, [ReflectableImageResource, number][]>>(
	data: T,
): T => data;

export const PlayerAnimations = playerAnimations({
	//image, milliseconds to display for
	idle: [
		[new ReflectableImageResource('assets/textures/player/snowmanidle1.png'), 135],//ignore the atrocious naming scheme of these images
		[new ReflectableImageResource('assets/textures/player/snowmanidle2.png'), 135],
		[new ReflectableImageResource('assets/textures/player/snowmanidle3.png'), 135],
		[new ReflectableImageResource('assets/textures/player/snowmanidle4.png'), 135],
		[new ReflectableImageResource('assets/textures/player/snowmanidle5.png'), 135],
		[new ReflectableImageResource('assets/textures/player/snowmanidle6.png'), 135],
		[new ReflectableImageResource('assets/textures/player/snowmanidle7.png'), 135],
		[new ReflectableImageResource('assets/textures/player/snowmanidle8.png'), 135],
	],
	idleleft: [
		[new ReflectableImageResource('assets/textures/player/snowmanidleflipped1.png'), 135],
		[new ReflectableImageResource('assets/textures/player/snowmanidleflipped2.png'), 135],
		[new ReflectableImageResource('assets/textures/player/snowmanidleflipped3.png'), 135],
		[new ReflectableImageResource('assets/textures/player/snowmanidleflipped4.png'), 135],
		[new ReflectableImageResource('assets/textures/player/snowmanidleflipped5.png'), 135],
		[new ReflectableImageResource('assets/textures/player/snowmanidleflipped6.png'), 135],
		[new ReflectableImageResource('assets/textures/player/snowmanidleflipped7.png'), 135],
		[new ReflectableImageResource('assets/textures/player/snowmanidleflipped8.png'), 135],
	],
	walk: [
		[new ReflectableImageResource('assets/textures/player/snowmanroll01.png'), 75],
		[new ReflectableImageResource('assets/textures/player/snowmanroll02.png'), 75],
		[new ReflectableImageResource('assets/textures/player/snowmanroll03.png'), 75],
		[new ReflectableImageResource('assets/textures/player/snowmanroll04.png'), 75],
		[new ReflectableImageResource('assets/textures/player/snowmanroll05.png'), 75],
		[new ReflectableImageResource('assets/textures/player/snowmanroll06.png'), 75],
		[new ReflectableImageResource('assets/textures/player/snowmanroll07.png'), 75],
		[new ReflectableImageResource('assets/textures/player/snowmanroll08.png'), 75],
	],
	walkleft: [
		[new ReflectableImageResource('assets/textures/player/snowmanrollleft01.png'), 75],
		[new ReflectableImageResource('assets/textures/player/snowmanrollleft02.png'), 75],
		[new ReflectableImageResource('assets/textures/player/snowmanrollleft03.png'), 75],
		[new ReflectableImageResource('assets/textures/player/snowmanrollleft04.png'), 75],
		[new ReflectableImageResource('assets/textures/player/snowmanrollleft05.png'), 75],
		[new ReflectableImageResource('assets/textures/player/snowmanrollleft06.png'), 75],
		[new ReflectableImageResource('assets/textures/player/snowmanrollleft07.png'), 75],
		[new ReflectableImageResource('assets/textures/player/snowmanrollleft08.png'), 75],
	],
});

// Item related assets
export const ItemAssets: Record<ItemType, ImageResource> = {
	[ItemType.SnowBlock]: new ImageResource(
		'assets/textures/items/block_snow.png',
	),
	[ItemType.IceBlock]: new ImageResource(
		'assets/textures/items/block_ice.png',
	),
	[ItemType.DirtBlock]: new ImageResource(
		'assets/textures/items/block_dirt.png',
	),
	[ItemType.Stone0Block]: new ImageResource(
		'assets/textures/items/block_stone0.png',
	),
	[ItemType.Stone1Block]: new ImageResource(
		'assets/textures/items/block_stone1.png',
	),
	[ItemType.Stone2Block]: new ImageResource(
		'assets/textures/items/block_stone2.png',
	),
	[ItemType.Stone3Block]: new ImageResource(
		'assets/textures/items/block_stone3.png',
	),
	[ItemType.Stone4Block]: new ImageResource(
		'assets/textures/items/block_stone4.png',
	),
	[ItemType.Stone5Block]: new ImageResource(
		'assets/textures/items/block_stone5.png',
	),
	[ItemType.Stone6Block]: new ImageResource(
		'assets/textures/items/block_stone6.png',
	),
	[ItemType.Stone7Block]: new ImageResource(
		'assets/textures/items/block_stone7.png',
	),
	[ItemType.Stone8Block]: new ImageResource(
		'assets/textures/items/block_stone8.png',
	),
	[ItemType.Stone9Block]: new ImageResource(
		'assets/textures/items/block_stone9.png',
	),
	[ItemType.TinBlock]: new ImageResource(
		'assets/textures/items/block_tin.png',
	),
	[ItemType.AluminumBlock]: new ImageResource(
		'assets/textures/items/block_aluminum.png',
	),
	[ItemType.GoldBlock]: new ImageResource(
		'assets/textures/items/block_gold.png',
	),
	[ItemType.TitaniumBlock]: new ImageResource(
		'assets/textures/items/block_titanium.png',
	),
	[ItemType.GrapeBlock]: new ImageResource(
		'assets/textures/items/block_grape.png',
	),
	[ItemType.Wood0Block]: new ImageResource(
		'assets/textures/items/block_wood0.png',
	),
	[ItemType.Wood1Block]: new ImageResource(
		'assets/textures/items/block_wood1.png',
	),
	[ItemType.Wood2Block]: new ImageResource(
		'assets/textures/items/block_wood2.png',
	),
	[ItemType.Wood3Block]: new ImageResource(
		'assets/textures/items/block_wood3.png',
	),
	[ItemType.Wood4Block]: new ImageResource(
		'assets/textures/items/block_wood4.png',
	),
	[ItemType.Wood5Block]: new ImageResource(
		'assets/textures/items/block_wood5.png',
	),
	[ItemType.Wood6Block]: new ImageResource(
		'assets/textures/items/block_wood6.png',
	),
	[ItemType.Wood7Block]: new ImageResource(
		'assets/textures/items/block_wood7.png',
	),
	[ItemType.Wood8Block]: new ImageResource(
		'assets/textures/items/block_wood8.png',
	),
	[ItemType.Wood9Block]: new ImageResource(
		'assets/textures/items/block_wood9.png',
	),
	[ItemType.Seed]: new ImageResource(
		'assets/textures/items/seed.png',
	),
};

// Ui related assets
export const UiAssets = {
	ui_slot_selected: new ImageResource(
		'assets/textures/ui/uislot_selected.png',
	),
	ui_slot: new ImageResource('assets/textures/ui/uislot.png'),
	ui_frame: new ImageResource('assets/textures/ui/uiframe.png'),
	button_unselected: new ImageResource('assets/textures/ui/button0.png'),
	button_selected: new ImageResource('assets/textures/ui/button1.png'),
	slider_bar: new ImageResource('assets/textures/ui/sliderBar.png'),
	slider_handle: new ImageResource('assets/textures/ui/sliderHandle.png'),
	title_image: new ImageResource('assets/textures/ui/snowedinBUMP.png'),
	vignette: new ImageResource('assets/textures/ui/vignette-export.png'),
	selected_tile: new ImageResource('assets/textures/ui/selectedtile.png'),
};

// World related assets
export const WorldAssets = {
	shaderResources: {
		skyImage: new ImageResource(
			'assets/textures/shader_resources/poissonsnow.png',
		),
	},
	middleground: {
		tileset_ice: new TileResource(
			'assets/textures/world/middleground/tileset_ice.png',
			16,
			1,
			8,
			8,
		),
		tileset_snow: new TileResource(
			'assets/textures/world/middleground/tileset_snow.png',
			16,
			1,
			8,
			8,
		),
		tileset_dirt: new TileResource(
			'assets/textures/world/middleground/tileset_dirt0.png',
			16,
			1,
			8,
			8,
		),
		tileset_stone0: new TileResource(
			'assets/textures/world/middleground/tileset_stone0.png',
			16,
			1,
			8,
			8,
		),
		tileset_stone1: new TileResource(
			'assets/textures/world/middleground/tileset_stone1.png',
			16,
			1,
			8,
			8,
		),
		tileset_stone2: new TileResource(
			'assets/textures/world/middleground/tileset_stone2.png',
			16,
			1,
			8,
			8,
		),
		tileset_stone3: new TileResource(
			'assets/textures/world/middleground/tileset_stone3.png',
			16,
			1,
			8,
			8,
		),
		tileset_stone4: new TileResource(
			'assets/textures/world/middleground/tileset_stone4.png',
			16,
			1,
			8,
			8,
		),
		tileset_stone5: new TileResource(
			'assets/textures/world/middleground/tileset_stone5.png',
			16,
			1,
			8,
			8,
		),
		tileset_stone6: new TileResource(
			'assets/textures/world/middleground/tileset_stone6.png',
			16,
			1,
			8,
			8,
		),
		tileset_stone7: new TileResource(
			'assets/textures/world/middleground/tileset_stone7.png',
			16,
			1,
			8,
			8,
		),
		tileset_stone8: new TileResource(
			'assets/textures/world/middleground/tileset_stone8.png',
			16,
			1,
			8,
			8,
		),
		tileset_stone9: new TileResource(
			'assets/textures/world/middleground/tileset_stone9.png',
			16,
			1,
			8,
			8,
		),
		tileset_tin: new TileResource(
			'assets/textures/world/middleground/tileset_tin.png',
			16,
			1,
			8,
			8,
		),
		tileset_aluminum: new TileResource(
			'assets/textures/world/middleground/tileset_aluminum.png',
			16,
			1,
			8,
			8,
		),
		tileset_gold: new TileResource(
			'assets/textures/world/middleground/tileset_gold.png',
			16,
			1,
			8,
			8,
		),
		tileset_titanium: new TileResource(
			'assets/textures/world/middleground/tileset_titanium.png',
			16,
			1,
			8,
			8,
		),
		tileset_grape: new TileResource(
			'assets/textures/world/middleground/tileset_grape.png',
			16,
			1,
			8,
			8,
		),
		tileset_wood0: new TileResource(
			'assets/textures/world/middleground/tileset_wood0.png',
			16,
			1,
			8,
			8,
		),
		tileset_wood1: new TileResource(
			'assets/textures/world/middleground/tileset_wood1.png',
			16,
			1,
			8,
			8,
		),
		tileset_wood2: new TileResource(
			'assets/textures/world/middleground/tileset_wood2.png',
			16,
			1,
			8,
			8,
		),
		tileset_wood3: new TileResource(
			'assets/textures/world/middleground/tileset_wood3.png',
			16,
			1,
			8,
			8,
		),
		tileset_wood4: new TileResource(
			'assets/textures/world/middleground/tileset_wood4.png',
			16,
			1,
			8,
			8,
		),
		tileset_wood5: new TileResource(
			'assets/textures/world/middleground/tileset_wood5.png',
			16,
			1,
			8,
			8,
		),
		tileset_wood6: new TileResource(
			'assets/textures/world/middleground/tileset_wood6.png',
			16,
			1,
			8,
			8,
		),
		tileset_wood7: new TileResource(
			'assets/textures/world/middleground/tileset_wood7.png',
			16,
			1,
			8,
			8,
		),
		tileset_wood8: new TileResource(
			'assets/textures/world/middleground/tileset_wood8.png',
			16,
			1,
			8,
			8,
		),
		tileset_wood9: new TileResource(
			'assets/textures/world/middleground/tileset_wood9.png',
			16,
			1,
			8,
			8,
		),
	},
	foreground: {
		
	},
	tileEntities: [
		[//tree
		new ReflectableImageResource(
			'assets/textures/world/tileEntities/trees/tree1.png',
		),
		new ReflectableImageResource(
			'assets/textures/world/tileEntities/trees/tree2.png',
		),
		new ReflectableImageResource(
			'assets/textures/world/tileEntities/trees/tree3.png',
		),
		new ReflectableImageResource(
			'assets/textures/world/tileEntities/trees/tree4.png',
		),
		new ReflectableImageResource(
			'assets/textures/world/tileEntities/trees/tree5.png',
		),
		new ReflectableImageResource(
			'assets/textures/world/tileEntities/trees/tree6.png',
		),
		new ReflectableImageResource(
			'assets/textures/world/tileEntities/trees/tree7.png',
		),
		new ReflectableImageResource(
			'assets/textures/world/tileEntities/trees/tree8.png',
		),
		new ReflectableImageResource(
			'assets/textures/world/tileEntities/trees/tree9.png',
		),
		new ReflectableImageResource(
			'assets/textures/world/tileEntities/trees/tree10.png',
		),
		],
		[//drill tier 1
		new ReflectableImageResource(
			'assets/textures/world/tileEntities/Rusty Drill/RustyDrill1.png',
		),
		new ReflectableImageResource(
			'assets/textures/world/tileEntities/Rusty Drill/RustyDrill2.png',
		),
		new ReflectableImageResource(
			'assets/textures/world/tileEntities/Rusty Drill/RustyDrill3.png',
		),
		new ReflectableImageResource(
			'assets/textures/world/tileEntities/Rusty Drill/RustyDrill4.png',
		),
		new ReflectableImageResource(
			'assets/textures/world/tileEntities/Rusty Drill/RustyDrill5.png',
		),
		new ReflectableImageResource(
			'assets/textures/world/tileEntities/Rusty Drill/RustyDrill6.png',
		),
		new ReflectableImageResource(
			'assets/textures/world/tileEntities/Rusty Drill/RustyDrill7.png',
		),
		new ReflectableImageResource(
			'assets/textures/world/tileEntities/Rusty Drill/RustyDrill8.png',
		),
		new ReflectableImageResource(
			'assets/textures/world/tileEntities/Rusty Drill/RustyDrill9.png',
		),
		new ReflectableImageResource(
			'assets/textures/world/tileEntities/Rusty Drill/RustyDrill10.png',
		),
		new ReflectableImageResource(
			'assets/textures/world/tileEntities/Rusty Drill/RustyDrill11.png',
		),
		new ReflectableImageResource(
			'assets/textures/world/tileEntities/Rusty Drill/RustyDrill12.png',
		),
		new ReflectableImageResource(
			'assets/textures/world/tileEntities/Rusty Drill/RustyDrill13.png',
		),
		],
		[//drill tier 2
	
		],
		[//drill tier 3
	
		],
		[//drill tier 4
	
		],
		[//drill tier 5
	
		],
		[//crafting bench
		new ReflectableImageResource(
			'assets/textures/world/tileEntities/misc/craftingBench.png',
		),
		],
		[//sapling/seed
		new ReflectableImageResource(
			'assets/textures/world/tileEntities/trees/sapling.png',
		),
		]
	],
	entities: [
		[
			new ImageResource(
				'assets/textures/world/entities/Small Drone/smalldrone01.png',
			),
			new ImageResource(
				'assets/textures/world/entities/Small Drone/smalldrone02.png',
			),
			new ImageResource(
				'assets/textures/world/entities/Small Drone/smalldrone03.png',
			),
			new ImageResource(
				'assets/textures/world/entities/Small Drone/smalldrone04.png',
			),
			new ImageResource(
				'assets/textures/world/entities/Small Drone/smalldrone05.png',
			),
			new ImageResource(
				'assets/textures/world/entities/Small Drone/smalldrone06.png',
			),
			new ImageResource(
				'assets/textures/world/entities/Small Drone/smalldrone07.png',
			),
			new ImageResource(
				'assets/textures/world/entities/Small Drone/smalldrone08.png',
			),
			new ImageResource(
				'assets/textures/world/entities/Small Drone/smalldrone09.png',
			),
			new ImageResource(
				'assets/textures/world/entities/Small Drone/smalldrone10.png',
			),
			new ImageResource(
				'assets/textures/world/entities/Small Drone/smalldrone11.png',
			),
			new ImageResource(
				'assets/textures/world/entities/Small Drone/smalldrone12.png',
			),
			new ImageResource(
				'assets/textures/world/entities/Small Drone/smalldrone13.png',
			),
			new ImageResource(
				'assets/textures/world/entities/Small Drone/smalldrone14.png',
			),
			new ImageResource(
				'assets/textures/world/entities/Small Drone/smalldrone15.png',
			),
			new ImageResource(
				'assets/textures/world/entities/Small Drone/smalldrone16.png',
			),
			new ImageResource(
				'assets/textures/world/entities/Small Drone/smalldrone17.png',
			),
			new ImageResource(
				'assets/textures/world/entities/Small Drone/smalldrone18.png',
			),
			new ImageResource(
				'assets/textures/world/entities/Small Drone/smalldrone19.png',
			),
			new ImageResource(
				'assets/textures/world/entities/Small Drone/smalldrone20.png',
			),
		],
	],

	clouds: [
		new ImageResource(
			'assets/textures/world/entities/Clouds/cloud1.png',
		),
		new ImageResource(
			'assets/textures/world/entities/Clouds/cloud2.png',
		),
		new ImageResource(
			'assets/textures/world/entities/Clouds/cloud3.png',
		),
		new ImageResource(
			'assets/textures/world/entities/Clouds/cloud4.png',
		),
		new ImageResource(
			'assets/textures/world/entities/Clouds/cloud5.png',
		),
	]}

	

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
			'A': 6,
			'B': 7,
			'C': 7,
			'D': 6,
			'E': 7,
			'F': 6,
			'G': 7,
			'H': 7,
			'I': 7,
			'J': 8,
			'K': 6,
			'L': 6,
			'M': 8,
			'N': 8,
			'O': 8,
			'P': 9,
			'Q': 8,
			'R': 7,
			'S': 7,
			'T': 8,
			'U': 8,
			'V': 8,
			'W': 10,
			'X': 8,
			'Y': 8,
			'Z': 9,
			'a': 7,
			'b': 7,
			'c': 6,
			'd': 7,
			'e': 6,
			'f': 6,
			'g': 6,
			'h': 6,
			'i': 5,
			'j': 6,
			'k': 5,
			'l': 5,
			'm': 8,
			'n': 5,
			'o': 5,
			'p': 5,
			'q': 7,
			'r': 5,
			's': 4,
			't': 5,
			'u': 5,
			'v': 5,
			'w': 7,
			'x': 6,
			'y': 5,
			'z': 5,
			'!': 4,
			'.': 2,
			',': 2,
			'?': 6,
			'_': 6,
			'-': 4,
			':': 2,
			'↑': 7,
			'↓': 7,
			' ': 2,
		},
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!.,?_-:↑↓ ',
		12,
	),

	big: new FontResource(
		'assets/textures/ui/fontBig.png',
		{
			'0': 15,
			'1': 14,
			'2': 14,
			'3': 13,
			'4': 12,
			'5': 13,
			'6': 12,
			'7': 14,
			'8': 15,
			'9': 12,
			'A': 13,
			'B': 14,
			'C': 15,
			'D': 12,
			'E': 14,
			'F': 13,
			'G': 14,
			'H': 15,
			'I': 15,
			'J': 16,
			'K': 12,
			'L': 13,
			'M': 16,
			'N': 17,
			'O': 17,
			'P': 19,
			'Q': 17,
			'R': 14,
			'S': 15,
			'T': 17,
			'U': 16,
			'V': 17,
			'W': 21,
			'X': 17,
			'Y': 17,
			'Z': 19,
			'a': 12,
			'b': 15,
			'c': 12,
			'd': 15,
			'e': 13,
			'f': 12,
			'g': 13,
			'h': 12,
			'i': 11,
			'j': 12,
			'k': 10,
			'l': 10,
			'm': 16,
			'n': 11,
			'o': 10,
			'p': 11,
			'q': 14,
			'r': 11,
			's': 8,
			't': 11,
			'u': 10,
			'v': 11,
			'w': 15,
			'x': 12,
			'y': 11,
			'z': 10,
			'!': 9,
			'.': 4,
			',': 4,
			'?': 13,
			'_': 13,
			'-': 8,
			':': 4,
			' ': 4,
		},
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!.,?_-: ',
		24,
	),
	tom_thumb: new FontResource(
		'assets/textures/ui/tom_thumb.png',
		{
			'A': 3,
			'B': 3,
			'C': 3,
			'D': 3,
			'E': 3,
			'F': 3,
			'G': 3,
			'H': 3,
			'I': 3,
			'J': 3,
			'K': 3,
			'L': 3,
			'M': 3,
			'N': 3,
			'O': 3,
			'P': 3,
			'Q': 3,
			'R': 3,
			'S': 3,
			'T': 3,
			'U': 3,
			'V': 3,
			'W': 3,
			'X': 3,
			'Y': 3,
			'Z': 3,
			'a': 3,
			'b': 3,
			'c': 3,
			'd': 3,
			'e': 3,
			'f': 3,
			'g': 3,
			'h': 3,
			'i': 3,
			'j': 3,
			'k': 3,
			'l': 3,
			'm': 3,
			'n': 3,
			'o': 3,
			'p': 3,
			'q': 3,
			'r': 3,
			's': 3,
			't': 3,
			'u': 3,
			'v': 3,
			'w': 3,
			'x': 3,
			'y': 3,
			'z': 3,
			'[': 3,
			'\\': 3,
			']': 3,
			'^': 3,
			' ': 3,
			'!': 3,
			'"': 3,
			'#': 3,
			'$': 3,
			'%': 3,
			'&': 3,
			"'": 3,
			'(': 3,
			')': 3,
			'*': 3,
			'+': 3,
			',': 3,
			'-': 3,
			'.': 3,
			'/': 3,
			'0': 3,
			'1': 3,
			'2': 3,
			'3': 3,
			'4': 3,
			'5': 3,
			'6': 3,
			'7': 3,
			'8': 3,
			'9': 3,
			':': 3,
			';': 3,
			'<': 3,
			'=': 3,
			'>': 3,
			'?': 3,
			'_': 3,
		},
		`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz[\\]^ !"#$%&'()*+,-./0123456789:;<=>?_`,
		5,
	),
};

export const Keys = {
	keyboardMap: [
		'', // [0]
		'', // [1]
		'', // [2]
		'CANCEL', // [3]
		'', // [4]
		'', // [5]
		'HELP', // [6]
		'', // [7]
		'BACKSPACE', // [8]
		'TAB', // [9]
		'', // [10]
		'', // [11]
		'CLEAR', // [12]
		'ENTER', // [13]
		'ENTER SPECIAL', // [14]
		'', // [15]
		'SHIFT', // [16]
		'CONTROL', // [17]
		'ALT', // [18]
		'PAUSE', // [19]
		'CAPS LOCK', // [20]
		'KANA', // [21]
		'EISU', // [22]
		'JUNJA', // [23]
		'FINAL', // [24]
		'HANJA', // [25]
		'', // [26]
		'ESCAPE', // [27]
		'CONVERT', // [28]
		'NONCONVERT', // [29]
		'ACCEPT', // [30]
		'MODECHANGE', // [31]
		'SPACE', // [32]
		'PAGE UP', // [33]
		'PAGE DOWN', // [34]
		'END', // [35]
		'HOME', // [36]
		'LEFT', // [37]
		'UP', // [38]
		'RIGHT', // [39]
		'DOWN', // [40]
		'SELECT', // [41]
		'PRINT', // [42]
		'EXECUTE', // [43]
		'PRINT SCREEN', // [44]
		'INSERT', // [45]
		'DELETE', // [46]
		'', // [47]
		'0', // [48]
		'1', // [49]
		'2', // [50]
		'3', // [51]
		'4', // [52]
		'5', // [53]
		'6', // [54]
		'7', // [55]
		'8', // [56]
		'9', // [57]
		'COLON', // [58]
		'SEMICOLON', // [59]
		'LESS THAN', // [60]
		'EQUALS', // [61]
		'GREATER THAN', // [62]
		'QUESTION MARK', // [63]
		'AT', // [64]
		'A', // [65]
		'B', // [66]
		'C', // [67]
		'D', // [68]
		'E', // [69]
		'F', // [70]
		'G', // [71]
		'H', // [72]
		'I', // [73]
		'J', // [74]
		'K', // [75]
		'L', // [76]
		'M', // [77]
		'N', // [78]
		'O', // [79]
		'P', // [80]
		'Q', // [81]
		'R', // [82]
		'S', // [83]
		'T', // [84]
		'U', // [85]
		'V', // [86]
		'W', // [87]
		'X', // [88]
		'Y', // [89]
		'Z', // [90]
		'OS KEY', // [91] Windows Key (Windows) or Command Key (Mac)
		'', // [92]
		'CONTEXT MENU', // [93]
		'', // [94]
		'SLEEP', // [95]
		'NUMPAD0', // [96]
		'NUMPAD1', // [97]
		'NUMPAD2', // [98]
		'NUMPAD3', // [99]
		'NUMPAD4', // [100]
		'NUMPAD5', // [101]
		'NUMPAD6', // [102]
		'NUMPAD7', // [103]
		'NUMPAD8', // [104]
		'NUMPAD9', // [105]
		'MULTIPLY', // [106]
		'ADD', // [107]
		'SEPARATOR', // [108]
		'SUBTRACT', // [109]
		'DECIMAL', // [110]
		'DIVIDE', // [111]
		'F1', // [112]
		'F2', // [113]
		'F3', // [114]
		'F4', // [115]
		'F5', // [116]
		'F6', // [117]
		'F7', // [118]
		'F8', // [119]
		'F9', // [120]
		'F10', // [121]
		'F11', // [122]
		'F12', // [123]
		'F13', // [124]
		'F14', // [125]
		'F15', // [126]
		'F16', // [127]
		'F17', // [128]
		'F18', // [129]
		'F19', // [130]
		'F20', // [131]
		'F21', // [132]
		'F22', // [133]
		'F23', // [134]
		'F24', // [135]
		'', // [136]
		'', // [137]
		'', // [138]
		'', // [139]
		'', // [140]
		'', // [141]
		'', // [142]
		'', // [143]
		'NUM LOCK', // [144]
		'SCROLL LOCK', // [145]
		'WIN OEM FJ JISHO', // [146]
		'WIN OEM FJ MASSHOU', // [147]
		'WIN OEM FJ TOUROKU', // [148]
		'WIN OEM FJ LOYA', // [149]
		'WIN OEM FJ ROYA', // [150]
		'', // [151]
		'', // [152]
		'', // [153]
		'', // [154]
		'', // [155]
		'', // [156]
		'', // [157]
		'', // [158]
		'', // [159]
		'CIRCUMFLEX', // [160]
		'EXCLAMATION', // [161]
		'DOUBLE_QUOTE', // [162]
		'HASH', // [163]
		'DOLLAR', // [164]
		'PERCENT', // [165]
		'AMPERSAND', // [166]
		'UNDERSCORE', // [167]
		'OPEN PARENTHESIS', // [168]
		'CLOSE PARENTHESIS', // [169]
		'ASTERISK', // [170]
		'PLUS', // [171]
		'PIPE', // [172]
		'HYPHEN', // [173]
		'OPEN CURLY BRACKET', // [174]
		'CLOSE CURLY BRACKET', // [175]
		'TILDE', // [176]
		'', // [177]
		'', // [178]
		'', // [179]
		'', // [180]
		'VOLUME MUTE', // [181]
		'VOLUME DOWN', // [182]
		'VOLUME UP', // [183]
		'', // [184]
		'', // [185]
		'SEMICOLON', // [186]
		'EQUALS', // [187]
		'COMMA', // [188]
		'MINUS', // [189]
		'PERIOD', // [190]
		'SLASH', // [191]
		'BACK QUOTE', // [192]
		'', // [193]
		'', // [194]
		'', // [195]
		'', // [196]
		'', // [197]
		'', // [198]
		'', // [199]
		'', // [200]
		'', // [201]
		'', // [202]
		'', // [203]
		'', // [204]
		'', // [205]
		'', // [206]
		'', // [207]
		'', // [208]
		'', // [209]
		'', // [210]
		'', // [211]
		'', // [212]
		'', // [213]
		'', // [214]
		'', // [215]
		'', // [216]
		'', // [217]
		'', // [218]
		'OPEN BRACKET', // [219]
		'BACK SLASH', // [220]
		'CLOSE BRACKET', // [221]
		'QUOTE', // [222]
		'', // [223]
		'META', // [224]
		'ALT GRAPH', // [225]
		'', // [226]
		'WIN ICO HELP', // [227]
		'WIN ICO 00', // [228]
		'', // [229]
		'WIN ICO CLEAR', // [230]
		'', // [231]
		'', // [232]
		'WIN OEM RESET', // [233]
		'WIN OEM JUMP', // [234]
		'WIN OEM PA1', // [235]
		'WIN OEM PA2', // [236]
		'WIN OEM PA3', // [237]
		'WIN OEM WSCTRL', // [238]
		'WIN OEM CUSEL', // [239]
		'WIN OEM ATTN', // [240]
		'WIN OEM FINISH', // [241]
		'WIN OEM COPY', // [242]
		'WIN OEM AUTO', // [243]
		'WIN OEM ENLW', // [244]
		'WIN OEM BACKTAB', // [245]
		'ATTN', // [246]
		'CRSEL', // [247]
		'EXSEL', // [248]
		'EREOF', // [249]
		'PLAY', // [250]
		'ZOOM', // [251]
		'', // [252]
		'PA1', // [253]
		'WIN OEM CLEAR', // [254]
		'TOGGLE TOUCHPAD', // [255]
	], // https://stackoverflow.com/questions/1772179/get-character-value-from-keycode-in-javascript-then-trim
};

export const AudioAssets = {
	ui: {
		inventoryClack: new AudioResourceGroup([
			new AudioResource('assets/sounds/sfx/ui/clack1.mp3'),
			new AudioResource('assets/sounds/sfx/ui/clack2.mp3'),
			new AudioResource('assets/sounds/sfx/ui/clack3.mp3'),
		]),
	},
	music: {
		titleScreen: new AudioResource('assets/sounds/music/TitleScreen.mp3'),
	},
	ambient: {
		winter1: new AudioResource(
			'assets/sounds/sfx/ambient/65813__pcaeldries__countrysidewinterevening02.wav',
		),
	},
	world: {
		metalplosive: new AudioResourceGroup([
		new AudioResource('assets/sounds/sfx/tiles/metal1plosive.mp3'),
		new AudioResource('assets/sounds/sfx/tiles/metal2plosive.mp3'),
		new AudioResource('assets/sounds/sfx/tiles/metal3plosive.mp3'),
		new AudioResource('assets/sounds/sfx/tiles/metal4plosive.mp3'),
		new AudioResource('assets/sounds/sfx/tiles/metal5plosive.mp3'),
		new AudioResource('assets/sounds/sfx/tiles/metal6plosive.mp3'),
		new AudioResource('assets/sounds/sfx/tiles/metal7plosive.mp3'),
		]),
		softplosive: new AudioResource('assets/sounds/sfx/tiles/soft1plosive.mp3'),
		texturedplosive: new AudioResource('assets/sounds/sfx/tiles/textured1plosive.mp3'),
		hightonalnoise: new AudioResource('assets/sounds/sfx/tiles/ICEBREAK.mp3'),
		stone: new AudioResource('assets/sounds/sfx/tiles/stone.mp3'),
		wood: new AudioResource('assets/sounds/sfx/tiles/wood.mp3'),
		treebreak: new AudioResource('assets/sounds/sfx/tiles/treebreak.mp3')
	}
};

export type AnimationFrame<T extends Record<string, [ImageResource, number][]>> = keyof T;

// const animations = <T extends Record<string, ImageResource[]>>(data: T): T => data

export const loadAssets = (sketch: P5, ...assets: AssetGroup[]) => {
	assets.forEach(assetGroup => {
		searchGroup(assetGroup, sketch);
	});
};

function searchGroup(
	assetGroup:
	{
		[name: string]:
			| Resource
			| AssetGroup
			| AudioResourceGroup[]
			| AudioResourceGroup
			| AudioResource
			| ImageResource[]
			| ImageResource[][]
			| ReflectableImageResource[]
			| ReflectableImageResource
			| [ReflectableImageResource, number][];
  }
| Resource
| AssetGroup
| AudioResourceGroup[]
| AudioResourceGroup
| AudioResource
| ImageResource[]
| ImageResource[][]
| ReflectableImageResource[]
| ReflectableImageResource
| [ReflectableImageResource, number][],
	sketch: P5,
) {
	if (assetGroup instanceof Resource) {
		console.log(`Loading asset ${assetGroup.path}`);
		assetGroup.loadResource(sketch);
		console.log("up a level")
		return;
	}
	Object.entries(assetGroup).forEach(asset => {
		console.log("down a level")
		//console.log(asset[1]);
		searchGroup(asset[1], sketch);
	});
}
