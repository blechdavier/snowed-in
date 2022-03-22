import { Entities } from '../../../../api/Entity';
import { PlayerEntity } from './PlayerEntity';
import PlayerLocal from './PlayerLocal';

export const EntityClasses: Record<Entities, any> = {
    [Entities.LocalPlayer]: PlayerLocal,
    [Entities.Player]: PlayerEntity,
    [Entities.Item]: null
}