import { Entities } from '../../../global/Entity';
import { PlayerEntity } from './PlayerEntity';
import { ItemEntity } from './ItemEntity';
import { DroneEntity } from './DroneEntity';

export const EntityClasses: Record<Entities, any> = {
    [Entities.LocalPlayer]: undefined,
    [Entities.Player]: PlayerEntity,
    [Entities.Item]: ItemEntity,
    [Entities.Drone]: DroneEntity,
};