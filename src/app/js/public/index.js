import '@babel/polyfill';
import 'url-api-polyfill';
import { createBrowserHistory } from 'history';
import React from 'react';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';

import rootReducer from './reducers';
import Routes from './Routes';
import sagas from './sagas';
import configureStore from '../configureStore';
import phrasesFor from '../i18n/translations';
import getLocale from '../../../common/getLocale';
import LodexThemeProvider from './LodexThemeProvider';

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

hydrate(
    <Provider {...{ store }}>
        <LodexThemeProvider>
            <Routes history={history} />
        </LodexThemeProvider>
    </Provider>,
    document.getElementById('root'),
);
