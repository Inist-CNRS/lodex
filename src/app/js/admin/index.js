import '@babel/polyfill';
import 'url-api-polyfill';

import React from 'react';
import { render } from 'react-dom';
import { createHashHistory } from 'history';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';

import {
    ThemeProvider as MuiThemeProvider,
    createMuiTheme,
} from '@material-ui/core/styles';

import rootReducer from './reducers';
import Routes from './Routes';
import sagas from './sagas';
import configureStore from '../configureStore';
import scrollToTop from '../lib/scrollToTop';
import phrasesFor from '../i18n/translations';
import getLocale from '../../../common/getLocale';
import theme from '../theme';

const adminTheme = createMuiTheme({
    palette: {
        accent1Color: theme.orange.primary,
        primary1Color: theme.green.primary,
        primary2Color: theme.purple.primary,
        textColor: '#5F6368',
    },
});

const locale = getLocale();
const initialState = {
    polyglot: {
        locale,
        phrases: phrasesFor(locale),
    },
};

const history = createHashHistory();
const store = configureStore(
    rootReducer,
    sagas,
    window.__PRELOADED_STATE__ || initialState,
    history,
);

render(
    <Provider {...{ store }}>
        <MuiThemeProvider theme={adminTheme}>
            <ConnectedRouter history={history} onUpdate={scrollToTop}>
                <Routes />
            </ConnectedRouter>
        </MuiThemeProvider>
    </Provider>,
    document.getElementById('root'),
);
