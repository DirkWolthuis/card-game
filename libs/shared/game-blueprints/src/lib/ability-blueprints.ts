import {
  AbilityBlueprint,
  AbillityType,
  EffectType,
  TriggerType,
} from '@loe/shared/game-types';

export const abilityBlueprints = new Map<number, AbilityBlueprint>([
  [
    1,
    {
      id: 1,
      description: 'Counter target ritual',
      type: AbillityType.REACTION,
      trigger: [TriggerType.RITUAL_ENTERS_STACK],
      effect: {
        type: EffectType.COUNTER_RITUAL,
      },
    },
  ],
]);
