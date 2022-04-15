import p5 from 'p5';
import { Renderable } from '../../interfaces/Renderable';
import { EntityPayload } from '../../../global/Entity';

export abstract class ServerEntity implements Renderable {
    entityId: string;

    x: number = 0;
    y: number = 0;

    protected constructor(entityId: string) {
        this.entityId = entityId;
    }

    abstract updateData(data: EntityPayload): void;

    abstract render(target: p5, upscaleSize: number): void;
}
