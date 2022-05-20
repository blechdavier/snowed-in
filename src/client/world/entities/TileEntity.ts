export class ClientTileEntity {
    coveredTiles: number[]
    id: string
    type_: number
    data: object
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