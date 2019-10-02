import '@babel/polyfill';
import 'url-api-polyfill';
import { createBrowserHistory } from 'history';
import React from 'react';
import { hydrate } from 'react-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Provider } from 'react-redux';

import rootReducer from './reducers';
import Routes from './Routes';
import sagas from './sagas';
import configureStore from '../configureStore';
import phrasesFor from '../i18n/translations';
import getLocale from '../../../common/getLocale';
import customTheme from './customTheme';

const muiTheme = createMuiTheme(customTheme);

const language = getLocale();
const initialState = {
    polyglot: {
        locale: language,
        phrases: phrasesFor(language),
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
