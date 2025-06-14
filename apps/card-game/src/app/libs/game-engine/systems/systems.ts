import { System } from '../event-bus/store';

export const DamageSystem: System = {
  name: 'DamageSystem',
  handle: async (event, ecs) => {
    console.log('No log:', event);
    if (event.type !== 'Damage') return [];
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve([
            {
              type: 'DamageApplied',
            },
          ]),
        1000
      )
    );
  },
};

export const PlayCardSystem: System = {
  name: 'PlayCardSystem',
  handle: async (event, ecs) => {
    if (event.type !== 'PlayCard') return [];
    console.log(`${event.playerId} plays ${event.cardId}`);
    return [{ type: 'Damage', targetId: 'p2', amount: 3 }];
  },
};

export const PlayerInputSystem: System = {
  name: 'PlayerInputSystem',
  handle: async (event, ecs) => {
    if (event.type !== 'PingPlayer') return [];

    console.log(`Pinging ${event.playerId} for input`);
    return [];
  },
};
