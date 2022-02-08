import ImageResource from '../../../assets/resources/ImageResource';
import { ItemsAssets } from '../../../assets/Assets';

enum ItemType {
    Resource = 'resource',
}

interface Item {
    name: string;
    texture: ImageResource;
    maxStackSize?: number;
    lore?: string;
}

const Items = {
    snow_berries: {
        name: 'Snow Berries',
        texture: ItemsAssets.consumables.snow_berries,
        maxStackSize: 100,
    },
    snowballs: {
        name: 'Snowballs',
        texture: ItemsAssets.resources.snowball,
        maxStackSize: 100,
    },
    ice_shards: {
        name: 'Ice Shards',
        texture: ItemsAssets.resources.ice_shard,
        maxStackSize: 100,
    },
    snow_block: {
        name: 'Snow',
        texture: ItemsAssets.blocks.snow,
        maxStackSize: 10,
    },
    ice_block: {
        name: 'Ice',
        texture: ItemsAssets.blocks.ice,
        maxStackSize: 100,
    },
};

export { Items, Item };
