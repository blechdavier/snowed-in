import { TileEntityPayload } from '../../../global/TileEntity';

export type ClientTileEntity = TileEntityPayload & {
	animFrame: number
	animate: boolean
}



export const TileEntityAnimations = [
    false,//tree
	true,//drill
	true,//drill
	true,//drill
	true,//drill
	true,//drill
	false,//crafting bench
	false,//planted seed
]