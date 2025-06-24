import NxWelcome from './nx-welcome';
import { FeatureGameInterface } from '@card-game/feature-game-interface';

export function App() {
  return (
    <div>
      <NxWelcome title="card-game-frontend" />
      <FeatureGameInterface />
    </div>
  );
}

export default App;
