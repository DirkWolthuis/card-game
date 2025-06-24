import { useContext } from 'react';
import { MachineContext } from '../machine-context';

export function Authenticate() {
  const { state, send } = useContext(MachineContext)!;
  const setUserId = (id: string) => {
    send({ type: 'SET_USER_ID', userId: id });
  };
  const isLoading = state.matches('authenticating');
  const error = state.context.error;

  return (
    <div>
      <h2>Authenticate</h2>
      <input
        type="text"
        placeholder="Enter Account ID"
        value={state.context.userId}
        onChange={(e) => setUserId(e.target.value)}
        disabled={isLoading}
      />
      <button disabled={isLoading}>
        {isLoading ? 'Checking...' : 'Check'}
      </button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
}

export default Authenticate;
