import p5 from 'p5';
import { ServerEntity } from './ServerEntity';
import { Entities, EntityPayload } from '../../../global/Entity';
import { ItemType } from '../../../global/Inventory';
import { ItemAssets, WorldAssets } from '../../assets/Assets';
import { game } from '../../Game';

export class DroneEntity extends ServerEntity {

    xVel: number = 0;
    level: number = 1;
    animFrame: number = 0;
    timeInThisAnimationFrame: number = 0;

    constructor(payload: EntityPayload<Entities.Drone>) {
        super(payload.id);

        this.level = payload.data.level;
        this.x = payload.data.x;
        this.xVel = payload.data.xVel;
        this.y = payload.data.y;
    }

    render(target: p5, upscaleSize: number): void {

        this.timeInThisAnimationFrame += game.deltaTime;
        //console.log(this.animFrame);
        // console.log([this.level, this.animFrame]);
        // console.log(WorldAssets.entities[this.level-1])
        // console.log(WorldAssets.entities[this.level-1][this.animFrame])
        if(this.timeInThisAnimationFrame>75) {
            this.timeInThisAnimationFrame = 0;//this does introduce some slight inaccuracies vs subtracting it, but, when you tab back into the browser after being tabbed out, subtracting it causes spazzing
            this.animFrame++;
            if(this.animFrame>=WorldAssets.entities[this.level-1].length) {
                this.animFrame = this.animFrame%WorldAssets.entities[this.level-1].length;
            }
        }

        const asset = WorldAssets.entities[this.level-1][this.animFrame];
        if (asset !== undefined) {
            asset.renderRotated(target, (this.x-game.interpolatedCamX-0.45+(0.1*Math.random()))*game.TILE_WIDTH*game.upscaleSize, (this.y-game.interpolatedCamY-0.95+(0.1*Math.random()))*game.TILE_HEIGHT*game.upscaleSize, 8*upscaleSize, 16*upscaleSize, this.xVel*0.2);
        }
    }

    updateData(data: EntityPayload<Entities.Drone>): void {
        this.x = data.data.x;
        this.y = data.data.y;
        this.xVel = data.data.xVel
    }
}
