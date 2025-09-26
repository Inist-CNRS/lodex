import '@babel/polyfill';
// @ts-expect-error TS7016
import { createBrowserHistory } from 'history';
import React from 'react';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';
import 'url-api-polyfill';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// @ts-expect-error TS7016
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

// @ts-expect-error TS2339
const tenant = window.__TENANT__;

const browserHistory = createBrowserHistory({
    basename: `/instance/${tenant}`,
});

sessionStorage.setItem('lodex-tenant', tenant);

const { store, history } = configureStore(
    reducers,
    sagas,
    // @ts-expect-error TS2339
    window.__PRELOADED_STATE__ || initialState,
    browserHistory,
);

const queryClient = new QueryClient();

hydrate(
    <Provider {...{ store }}>
        <I18N>
            {/*
             // @ts-expect-error TS2322 */}
            <QueryClientProvider client={queryClient}>
                <AnnotationStorageProvider>
                    {/*
                     // @ts-expect-error TS2322 */}
                    <Router history={history}>
                        <LodexThemeProvider>
                            {/*
                             // @ts-expect-error TS2322 */}
                            <Routes
                                history={history}
                                // @ts-expect-error TS2339
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
