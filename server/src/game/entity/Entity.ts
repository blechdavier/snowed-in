import { Entity as EntitySnapshotData } from '@geckos.io/snapshot-interpolation/lib/types';
import { EntityData, Entities, EntityPayload } from '../../../../api/Entity';

export abstract class Entity {
    // Type and id
    type: Entities;
    id: string;

    // Position
    x: number;
    y: number;

    protected constructor(type: Entities, id: string) {
        this.type = type;
        this.id = id;
    }

    abstract getData(): EntityData;

    getPayload(): EntityPayload {
        return {
            id: this.id.toString(),
            ...this.getData()
        };
    }

    getSnapshot(): EntitySnapshotData {
        return { id: this.id.toString(), x: this.x, y: this.y };
    }
}