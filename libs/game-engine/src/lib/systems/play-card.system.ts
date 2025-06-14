import { System } from '../event-bus/store';

export const PlayCardSystem: System = {
  name: 'PlayCardSystem',
  handle: async (event, ecs) => {
    if (event.type !== 'PlayCard') return [];
    console.log(`${event.playerId} plays ${event.cardId}`);
    return [{ type: 'Damage', targetId: 'p2', amount: 3 }];
  },
};
