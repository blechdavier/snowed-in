import { EntityType } from '../../../api/SocketEvents';

export abstract class Entity {
    // Type and id
    _type: EntityType
    _id: number

    // Position
    x: number
    y: number

    protected constructor(type: EntityType, id: number) {
        this._type = type
        this._id = id
    }

    abstract getData(): object;

    get() {
        return {id: this._id.toString(), type: this._type, data: this.getData()}
    }

    getState() {
        return {id: this._id.toString(), x: this.x, y: this.y}
    }
}