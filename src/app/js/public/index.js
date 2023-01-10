import '@babel/polyfill';
import 'url-api-polyfill';
import { createBrowserHistory } from 'history';
import React from 'react';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';

import {
    createTheme,
    ThemeProvider as MuiThemeProvider,
} from '@material-ui/core/styles';

import rootReducer from './reducers';
import Routes from './Routes';
import sagas from './sagas';
import configureStore from '../configureStore';
import phrasesFor from '../i18n/translations';
import getLocale from '../../../common/getLocale';
import customTheme from '../../custom/customTheme';

const theme = createTheme(customTheme);

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
        <MuiThemeProvider theme={theme}>
            <Routes history={history} />
        </MuiThemeProvider>
    </Provider>,
    document.getElementById('root'),
);
