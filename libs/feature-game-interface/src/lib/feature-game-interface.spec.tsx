import { render } from '@testing-library/react';

import FeatureGameInterface from './feature-game-interface';

describe('FeatureGameInterface', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FeatureGameInterface />);
    expect(baseElement).toBeTruthy();
  });
});
