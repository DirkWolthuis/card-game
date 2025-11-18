import { render } from '@testing-library/react';

import GraveyardZone from './GraveyardZone';

describe('GraveyardZone', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<GraveyardZone />);
    expect(baseElement).toBeTruthy();
  });
});
