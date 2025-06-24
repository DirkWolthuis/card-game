import { fromPromise, setup, assign } from 'xstate';

const fetchUser = (userId: string) => {
  return new Promise((resolve) =>
    setTimeout(() => resolve({ id: userId, name: 'Test User' }), 500)
  );
};

export const machine = setup({
  types: {
    context: {} as { userId: string; user: object | undefined; error: unknown },
    events: {} as
      | { type: 'SELECT_EXITING_ACCOUNT' }
      | { type: 'SELECT_NEW_ACCOUNT' }
      | { type: 'CREATE_ACCOUNT' }
      | { type: 'PROVIDE_ID' }
      | { type: 'SEND_INPUT' }
      | { type: 'PLAYER_INPUT_REQUIRED' }
      | { type: 'PLAYER_JOINED' }
      | { type: 'FETCH_USER' }
      | { type: 'SET_USER_ID'; userId: string },
  },
  actors: {
    fetchUser: fromPromise(async ({ input }: { input: { userId: string } }) => {
      // Simulate fetching a user with a fake promise and timeout
      const res = await fetchUser(input.userId);
      return res;
    }),
  },
}).createMachine({
  context: {
    userId: '',
    user: undefined,
    error: null,
  },
  id: 'card-game-frontend',
  initial: 'authenticate',
  states: {
    authenticating: {
      states: {
        idle: {
          on: {
            FETCH_USER: {
              target: 'loading',
            },
          },
        },
        loading: {
          invoke: {
            id: 'getUser',
            src: 'fetchUser',
            input: ({ context: { userId } }) => ({ userId }),
            onDone: {
              target: 'success',
              actions: assign({ user: ({ event }) => event.output }),
            },
            onError: {
              target: 'failure',
              actions: assign({ error: ({ event }) => event.error }),
            },
          },
        },
        error: {},
      },
      on: {
        SET_USER_ID: {
          actions: assign({
            userId: ({ event }) => event.userId,
          }),
        },
        SELECT_EXITING_ACCOUNT: {
          target: 'connectingToGame',
        },
        SELECT_NEW_ACCOUNT: {
          target: 'settingUpAccount',
        },
      },
    },
    connectingToGame: {
      on: {
        PROVIDE_ID: {
          target: 'runningGame',
        },
      },
    },
    settingUpAccount: {
      on: {
        CREATE_ACCOUNT: {
          target: 'connectingToGame',
        },
      },
    },
    runningGame: {
      initial: 'waitingForPlayers',
      states: {
        waitingForPlayers: {
          on: {
            PLAYER_JOINED: {
              target: 'reactingToEvents',
            },
          },
        },
        reactingToEvents: {
          on: {
            PLAYER_INPUT_REQUIRED: {
              target: 'waitingForPlayerInput',
            },
          },
        },
        waitingForPlayerInput: {
          on: {
            SEND_INPUT: {
              target: 'reactingToEvents',
            },
          },
        },
      },
    },
  },
});
