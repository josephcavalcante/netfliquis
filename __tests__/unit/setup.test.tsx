import React from 'react';
import { render } from '@testing-library/react-native';
import CatalogScreen from '../../app/index';
import { ContentProvider } from '@/context/ContentContext';

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
  }),
}));

describe('[Issue #1] Expo & TypeScript Project Foundation', () => {
  it('renders the initial Netfliquis brand screen without crashing', () => {
    const { getByTestId } = render(
      <ContentProvider>
        <CatalogScreen />
      </ContentProvider>
    );
    expect(getByTestId('header-logo').props.children).toBe('NETFLIQUIS');
  });
});
