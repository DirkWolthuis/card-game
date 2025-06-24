import { useMachine } from '@xstate/react';
import { machine } from '@card-game/data-access-state-machine';
import Authenticate from './authenticate/authenticate';
import ProvideGameId from './provide-game-id/provide-game-id';
import AccountSetup from './account-setup/account-setup';
import GameScreen from './game-screen/game-screen';
import { MachineContext } from './machine-context';

export function FeatureGameInterface() {
  const [state, send] = useMachine(machine);

  let component = null;
  if (state.matches('authenticating')) {
    component = <Authenticate />;
  } else if (state.matches('connectingToGame')) {
    component = <ProvideGameId />;
  } else if (state.matches('settingUpAccount')) {
    component = <AccountSetup />;
  } else if (state.matches('runningGame')) {
    component = <GameScreen />;
  }

  return (
    <MachineContext.Provider value={{ state, send }}>
      {component}
    </MachineContext.Provider>
  );
}

export default FeatureGameInterface;
