import { ServerEntity } from './ServerEntity';
import p5 from 'p5';
import game from '../../Main';
import { Entities, EntityPayload } from '../../../../api/Entity';

export class PlayerEntity extends ServerEntity {

    width: number = 12 / game.TILE_WIDTH;
    height: number = 20 / game.TILE_HEIGHT;
    name: string

    constructor(data: EntityPayload) {
        super(data.id);
        if(data.type === Entities.Player) {
            this.name = data.data.name;
        }
    }

    updateData(data: EntityPayload): void {
        if(data.type === Entities.Player) {
            this.name = data.data.name;
        }
    }

    render(target: p5, upscaleSize: number): void {
        target.fill(0, 255, 0);

        target.rect(
            (this.x * game.TILE_WIDTH -
                game.interpolatedCamX * game.TILE_WIDTH) *
            upscaleSize,
            (this.y * game.TILE_HEIGHT -
                game.interpolatedCamY * game.TILE_HEIGHT) *
            upscaleSize,
            this.width * upscaleSize * game.TILE_WIDTH,
            this.height * upscaleSize * game.TILE_HEIGHT
        );
        // Render the item quantity label
        target.fill(0);

        target.noStroke();

        target.textSize(5 * upscaleSize);
        target.textAlign(target.CENTER, target.TOP);

        target.text(
            this.name,
            (((this.x * game.TILE_WIDTH) -
                game.interpolatedCamX * game.TILE_WIDTH) + (this.width * game.TILE_WIDTH) / 2) *
            upscaleSize,
            (((this.y * game.TILE_HEIGHT) -
                game.interpolatedCamY * game.TILE_HEIGHT) - (this.height * game.TILE_WIDTH) / 2.5) *
            upscaleSize
        );
    }
}