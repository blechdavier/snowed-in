import { Entity } from './Entity';
import { Entities, EntityData } from '../../../../api/Entity';

export class Player extends Entity {
    userId: string
    name: string;

    socketId: string

    breakingTile: { start: number, tileIndex: number}

    constructor(
        name: string,
        userId: string,
        entityId: string,
        x: number,
        y: number,
    ) {
        super(Entities.Player, entityId)
        this.userId = userId;
        this.name = name;
        this.x = x;
        this.y = y;
    }

    getData(): EntityData {
        return {
            type: Entities.Player,
            data: {name: this.name}
        }

    }
}