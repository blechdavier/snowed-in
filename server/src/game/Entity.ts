enum EntityType {
    Player = "player",
    Item = "item"
}

export abstract class Entity {
    type: EntityType
    id: number

    x: number
    y: number


    get() {
        return { id: this.id, type: this.type.toString() , x: this.x, y: this.y}
    }
}