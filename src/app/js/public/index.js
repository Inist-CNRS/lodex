import '@babel/polyfill';
import 'url-api-polyfill';
import { createBrowserHistory } from 'history';
import React from 'react';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';

import {
    createMuiTheme,
    ThemeProvider as MuiThemeProvider,
} from '@material-ui/core/styles';

import rootReducer from './reducers';
import Routes from './Routes';
import sagas from './sagas';
import configureStore from '../configureStore';
import phrasesFor from '../i18n/translations';
import getLocale from '../../../common/getLocale';
import customTheme from './customTheme';

const muiTheme = createMuiTheme(customTheme);

const locale = getLocale();
const initialState = {
    polyglot: {
        locale,
        phrases: phrasesFor(locale),
    },
};

const history = createBrowserHistory();

const store = configureStore(
    rootReducer,
    sagas,
    window.__PRELOADED_STATE__ || initialState,
    history,
);

hydrate(
    <Provider {...{ store }}>
        <MuiThemeProvider theme={muiTheme}>
            <Routes history={history} />
        </MuiThemeProvider>
    </Provider>,
    document.getElementById('root'),
);
