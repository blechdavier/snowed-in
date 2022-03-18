import { Entities } from '../../../../api/Entity';
import { PlayerEntity } from './PlayerEntity';

export const EntityClasses: Record<Entities, any> = {
    [Entities.Player]: PlayerEntity,
    [Entities.Item]: null
}