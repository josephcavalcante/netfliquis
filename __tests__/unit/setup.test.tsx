import React from 'react';
import { render } from '@testing-library/react-native';
import CatalogScreenPlaceholder from '../../app/index';

describe('[Issue #1] Expo & TypeScript Project Foundation', () => {
  it('renders the initial Netfliquis brand screen without crashing', () => {
    const { getByText } = render(<CatalogScreenPlaceholder />);
    expect(getByText('NETFLIQUIS')).toBeTruthy();
  });
});
