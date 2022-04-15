import { Entity as EntitySnapshotData } from '@geckos.io/snapshot-interpolation/lib/types';
import { EntityData, Entities, EntityPayload } from '../../../global/Entity';

export abstract class Entity {
	// Type and id
	type: Entities;
	id: string;

	// Position
	x: number = 0;
	y: number = 0;

	protected constructor(type: Entities, id: string) {
		this.type = type;
		this.id = id;
	}

	abstract getData(): EntityData;

	getPayload(): EntityPayload {
		return {
			id: this.id.toString(),
			...this.getData(),
		};
	}

	getSnapshot(): EntitySnapshotData {
		return { id: this.id.toString(), x: this.x, y: this.y };
	}
}
