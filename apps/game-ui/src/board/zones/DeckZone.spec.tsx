import { render } from '@testing-library/react';

import DeckZone from './DeckZone';

describe('DeckZone', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DeckZone />);
    expect(baseElement).toBeTruthy();
  });
});
