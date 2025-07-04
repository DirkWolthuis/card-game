import {
  Ability,
  AbillityType,
  EffectType,
  TriggerType,
} from '@loe/shared/game-types';

export const cardBlueprints = new Map<number, Ability>([
  [
    1,
    {
      description: 'Counter target ritual',
      type: AbillityType.REACTION,
      trigger: [TriggerType.RITUAL_ENTERS_STACK],
      effect: {
        type: EffectType.COUNTER_RITUAL,
      },
    },
  ],
]);
