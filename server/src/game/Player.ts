import { Entity } from './Entity';
import { EntityType } from '../../../api/SocketEvents';

export class Player extends Entity {
    userId: string
    name: string;

    socketId: string

    // Position
    x: number;
    y: number;

    breakingTile: { start: number, tileIndex: number}

    constructor(
        name: string,
        userId: string,
        entityId: number,
        x: number,
        y: number,
    ) {
        super(EntityType.Player, entityId)
        this.userId = userId;
        this.name = name;
        this.x = x;
        this.y = y;
    }

    getData(): object {
        return {name: this.name, x: this.x, y: this.y}
    }
}