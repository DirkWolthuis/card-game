import { setup } from 'xstate';

export const machine = setup({
  types: {
    context: {} as {},
    events: {} as
      | { type: 'SELECT_EXITING_ACCOUNT' }
      | { type: 'SELECT_NEW_ACCOUNT' }
      | { type: 'CREATE_ACCOUNT' }
      | { type: 'PROVIDE_ID' }
      | { type: 'SEND_INPUT' }
      | { type: 'PLAYER_INPUT_REQUIRED' }
      | { type: 'PLAYER_JOINED' },
  },
}).createMachine({
  context: {},
  id: 'card-game-frontend',
  initial: 'authenticate',
  states: {
    authenticate: {
      on: {
        SELECT_EXITING_ACCOUNT: {
          target: 'provide_game_id',
        },
        SELECT_NEW_ACCOUNT: {
          target: 'acount_setup',
        },
      },
    },
    provide_game_id: {
      on: {
        PROVIDE_ID: {
          target: 'game_screen',
        },
      },
    },
    acount_setup: {
      on: {
        CREATE_ACCOUNT: {
          target: 'provide_game_id',
        },
      },
    },
    game_screen: {
      initial: 'waiting_for_players',
      states: {
        waiting_for_players: {
          on: {
            PLAYER_JOINED: {
              target: 'reacting_to_events',
            },
          },
        },
        reacting_to_events: {
          on: {
            PLAYER_INPUT_REQUIRED: {
              target: 'player_input_required',
            },
          },
        },
        player_input_required: {
          on: {
            SEND_INPUT: {
              target: 'reacting_to_events',
            },
          },
        },
      },
    },
  },
});
