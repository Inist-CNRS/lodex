import '@babel/polyfill';
import { createBrowserHistory } from 'history';
import React from 'react';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';
import 'url-api-polyfill';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Router } from 'react-router-dom';
import getLocale from '../../../common/getLocale';
import configureStore from '../configureStore';
import { I18N } from '../i18n/I18NContext';
import phrasesFor from '../i18n/translations';
import LodexThemeProvider from './LodexThemeProvider';
import reducers from './reducers';
import Routes from './Routes';
import sagas from './sagas';

import 'react-toastify/dist/ReactToastify.css';
import { AnnotationStorageProvider } from '../annotation/annotationStorage';

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

const queryClient = new QueryClient();

hydrate(
    <Provider {...{ store }}>
        <I18N>
            <QueryClientProvider client={queryClient}>
                <AnnotationStorageProvider>
                    <Router history={history}>
                        <LodexThemeProvider>
                            <Routes
                                history={history}
                                tenant={window.__TENANT__}
                            />
                        </LodexThemeProvider>
                    </Router>
                </AnnotationStorageProvider>
            </QueryClientProvider>
        </I18N>
    </Provider>,
    document.getElementById('root'),
);
