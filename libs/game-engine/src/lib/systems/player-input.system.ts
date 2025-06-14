import { System } from '../event-bus/store';

export const PlayerInputSystem: System = {
  name: 'PlayerInputSystem',
  handle: async (event, ecs) => {
    if (event.type !== 'PingPlayer') return [];

    console.log(`Pinging ${event.playerId} for input`);
    return [];
  },
};
