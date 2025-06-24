import React from 'react';
import type { ActorRefFrom } from 'xstate';
import { machine } from '@card-game/data-access-state-machine';

export interface MachineContextType {
  state: any;
  send: ActorRefFrom<typeof machine>['send'];
}

export const MachineContext = React.createContext<
  MachineContextType | undefined
>(undefined);
