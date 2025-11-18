import { render } from '@testing-library/react';

import Board from './Board';

describe('Board', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Board />);
    expect(baseElement).toBeTruthy();
  });
});
