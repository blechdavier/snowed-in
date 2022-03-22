import { Entity } from './Entity';
import { Entities, EntityData, EntityPayload } from '../../../../api/Entity';

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

    getLocal(): EntityPayload<Entities.LocalPlayer> {
        return {
            id: this.id,
            type: Entities.LocalPlayer,
            data: {name: this.name, x: this.x, y: this.y}
        }
    }
}