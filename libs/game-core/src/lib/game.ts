// Game.ts
import type { Game } from 'boardgame.io';
import { GameState } from '@game/models';
// // define a function to initialize each player’s state
// const playerSetup = (playerID: string): Player => ({
//   id: playerID,
//   life: 20,
//   name: 'hello?',
// });

// // filter data returned to each client to hide secret state (OPTIONAL)
// const playerView = (players: Record<string, Player>, playerID: string) => ({
//   [playerID]: players[playerID],
// });

export const GameEngine: Game<GameState> = {
  name: 'card-game',
  setup: ({ ctx }) => {
    // optimize later
    const players = ctx.playOrder.reduce(
      (prev, playerID) => ({
        ...prev,
        [playerID]: {
          id: playerID,
          life: 20,
          name: playerID,
        },
      }),
      {}
    );
    const decks = ctx.playOrder.reduce(
      (prev, playerID) => ({
        ...prev,
        [playerID]: {
          cardIds: ['aaaa', 'bbb'],
        },
      }),
      {}
    );
    const zones = ctx.playOrder.reduce(
      (prev, playerID) => ({
        ...prev,
        [playerID]: {
          hand: { cardIds: [] },
          battlefield: { cardIds: [] },
          graveyard: { cardIds: [] },
          exile: { cardIds: [] },
        },
      }),
      {}
    );
    console.log(ctx);
    return {
      players: players,
      decks: decks,
      zones: zones,
    };
  },
  moves: {
    playCardFromHand: (x, y) => {
      console.log('debug', x, y);
    },
  },
  //   plugins: [
  //     // pass your function to the player plugin
  //     PluginPlayer<Player>({
  //       setup: playerSetup,
  //       playerView: playerView,
  //     }),
  //   ],
  minPlayers: 2,
  maxPlayers: 4,
};
