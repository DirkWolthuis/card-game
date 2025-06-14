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
