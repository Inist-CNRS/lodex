import React from 'react';
import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import PropTypes from 'prop-types';

import configureStore from './app/js/configureStore';
import rootReducer from './app/js/public/reducers';
import sagas from './app/js/admin/sagas';

global.__DEBUG__ = false;

const history = createMemoryHistory();
const store = configureStore(rootReducer, sagas, {}, history);

const Wrapper = ({ children }) => (
    <Provider store={store}>
        <MuiThemeProvider>
            <ConnectedRouter history={history} onUpdate={() => {}}>
                {children}
            </ConnectedRouter>
        </MuiThemeProvider>
    </Provider>
);

Wrapper.propTypes = {
    children: PropTypes.node.isRequired,
};

const customRender = (ui, options) =>
    render(ui, { wrapper: Wrapper, ...options });

export * from '@testing-library/react';

export { customRender as render };
