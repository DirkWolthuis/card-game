import { render } from '@testing-library/react';

import BattlefieldZone from './BattlefieldZone';

describe('BattlefieldZone', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BattlefieldZone />);
    expect(baseElement).toBeTruthy();
  });
});
