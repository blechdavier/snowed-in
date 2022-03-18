import ImageResource from '../../assets/resources/ImageResource';
import { ItemType } from '../../../../api/Item';

abstract class ItemStack {
    // Item information
    itemType: ItemType;
    texture: ImageResource;

    maxStackSize: number = 1
    name: string
    description: string

    // Instance values
    stackSize: number = 1;

    protected constructor(itemType: ItemType, texture: ImageResource, name: string, description?: string, maxStackSize?: number) {
        this.itemType = itemType
        this.texture = texture
        this.name = name
        this.description = `${this.name}.`
        if(description !== undefined)
            this.description = description
        if(maxStackSize !== undefined)
            this.maxStackSize = maxStackSize
    }

    use() {}
}

export = ItemStack;
