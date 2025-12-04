import {
    createTheme,
    ThemeProvider as MuiThemeProvider,
} from '@mui/material/styles';
import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { type ReactNode } from 'react';
import { Provider } from 'react-redux';

import userEvent from '@testing-library/user-event';
import defaultMuiTheme from '../../src/app/custom/themes/default/defaultTheme';
import sagas from './sharedSagas';
import configureStore from './configureStore';
import reducers from './sharedReducers';
import { TestI18N } from './i18n/I18NContext';
import type { Store } from 'redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router';

// @ts-expect-error TS7017
global.__DEBUG__ = false;

const memoryHistory = createMemoryHistory();

const theme = createTheme(defaultMuiTheme, {
    userAgent: navigator.userAgent,
});

export const Wrapper = ({
    children,
    store,
    queryClient = new QueryClient(),
}: {
    children: ReactNode;
    store: Store;
    queryClient?: QueryClient;
}) => (
    <MemoryRouter>
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                <TestI18N>
                    <MuiThemeProvider theme={theme}>
                        {children}
                    </MuiThemeProvider>
                </TestI18N>
            </Provider>
        </QueryClientProvider>
    </MemoryRouter>
);

export const getStore = (initialState = {}) =>
    configureStore(reducers, sagas, initialState, memoryHistory).store;

const customRender = (
    ui: ReactNode,
    { initialState = {}, ...options } = {},
) => {
    const store = getStore(initialState);
    const WrapperWithStore = ({ children }: { children: ReactNode }) => (
        <Wrapper store={store}>{children}</Wrapper>
    );

    return render(ui, { wrapper: WrapperWithStore, ...options });
};

export { act, cleanup, configure, getConfig } from '@testing-library/react';

export { customRender as render, userEvent };
