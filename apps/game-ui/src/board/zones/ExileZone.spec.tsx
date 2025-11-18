import { render } from '@testing-library/react';

import ExileZone from './ExileZone';

describe('ExileZone', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ExileZone />);
    expect(baseElement).toBeTruthy();
  });
});
