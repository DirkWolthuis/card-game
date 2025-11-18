import { render } from '@testing-library/react';

import HandZone from './HandZone';

describe('HandZone', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<HandZone />);
    expect(baseElement).toBeTruthy();
  });
});
