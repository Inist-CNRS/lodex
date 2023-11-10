import '@babel/polyfill';
import 'url-api-polyfill';
import { createBrowserHistory } from 'history';
import React from 'react';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';

import {
    createTheme as createThemeMui,
    ThemeProvider,
} from '@mui/material/styles';

import rootReducer from './reducers';
import Routes from './Routes';
import sagas from './sagas';
import configureStore from '../configureStore';
import phrasesFor from '../i18n/translations';
import getLocale from '../../../common/getLocale';
import customTheme from '../../custom/customTheme';
import { themeLoader } from './api/themeLoader';

const locale = getLocale();
const initialState = {
    polyglot: {
        locale,
        phrases: phrasesFor(locale),
    },
};

const tenant = window.__TENANT__;

const history = createBrowserHistory({
    basename: `/instance/${tenant}`,
});

sessionStorage.setItem('lodex-tenant', tenant);

const store = configureStore(
    rootReducer,
    sagas,
    window.__PRELOADED_STATE__ || initialState,
    history,
);

themeLoader()
    .then(lodexTheme => {
        hydrate(
            <Provider {...{ store }}>
                <ThemeProvider theme={createThemeMui(lodexTheme)}>
                    <Routes history={history} />
                </ThemeProvider>
            </Provider>,
            document.getElementById('root'),
        );
    })
    .catch(() => {
        hydrate(
            <Provider {...{ store }}>
                <ThemeProvider theme={createThemeMui(customTheme)}>
                    <Routes history={history} />
                </ThemeProvider>
            </Provider>,
            document.getElementById('root'),
        );
    });
