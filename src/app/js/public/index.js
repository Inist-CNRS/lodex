import '@babel/polyfill';
import 'url-api-polyfill';
import { createBrowserHistory } from 'history';
import React from 'react';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';

import reducers from './reducers';
import Routes from './Routes';
import sagas from './sagas';
import configureStore from '../configureStore';
import phrasesFor from '../i18n/translations';
import getLocale from '../../../common/getLocale';
import LodexThemeProvider from './LodexThemeProvider';
import { Router } from 'react-router-dom';

const locale = getLocale();
const initialState = {
    polyglot: {
        locale,
        phrases: phrasesFor(locale),
    },
};

const tenant = window.__TENANT__;

const browserHistory = createBrowserHistory({
    basename: `/instance/${tenant}`,
});

sessionStorage.setItem('lodex-tenant', tenant);

const { store, history } = configureStore(
    reducers,
    sagas,
    window.__PRELOADED_STATE__ || initialState,
    browserHistory,
);

hydrate(
    <Provider {...{ store }}>
        <Router history={history}>
            <LodexThemeProvider>
                <Routes history={history} tenant={window.__TENANT__} />
            </LodexThemeProvider>
        </Router>
    </Provider>,
    document.getElementById('root'),
);
