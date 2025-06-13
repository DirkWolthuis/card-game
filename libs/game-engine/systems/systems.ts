import { System } from '../event-bus/store';
import { HP } from '../events/events';

export const DamageSystem: System = {
  name: 'DamageSystem',
  handle(event, ecs) {
    console.log(event, 'damage?');
    if (event.type !== 'Damage') return [];

    const targets = ecs.getComponents<HP>(event.targetId, 'hp');
    targets.forEach((hp) => {
      hp.value -= event.amount;
      console.log(
        `Entity ${event.targetId} takes ${event.amount} damage, now ${hp.value} HP`
      );
    });
    return [];
  },
};

export const PlayCardSystem: System = {
  name: 'PlayCardSystem',
  handle(event, ecs) {
    if (event.type !== 'PlayCard') return [];
    console.log(`${event.playerId} plays ${event.cardId}`);
    return [{ type: 'Damage', targetId: 'p2', amount: 3 }];
  },
};

export const PlayerInputSystem: System = {
  name: 'PlayerInputSystem',
  handle(event, ecs) {
    if (event.type !== 'PingPlayer') return [];

    console.log(`Pinging ${event.playerId} for input`);
    return [];
  },
};
