import '@babel/polyfill';
import 'url-api-polyfill';

import { createHashHistory } from 'history';
// @ts-expect-error TS6133
import React from 'react';
// ignoring deprecation warning react 18 we are using version 17
// eslint-disable-next-line react/no-deprecated
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Redirect, Route } from 'react-router';

import {
    createTheme as createThemeMui,
    ThemeProvider,
} from '@mui/material/styles';

import { enUS, frFR } from '@mui/material/locale';
import { enUS as enUSDatagrid, frFR as frFRDatagrid } from '@mui/x-data-grid';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Router } from 'react-router-dom';
import getLocale from '../../../common/getLocale';
import '../../ace-vite-loader';
import defaultTheme from '../../custom/themes/default/defaultTheme';
import configureStore from '../configureStore';
import { I18N } from '../i18n/I18NContext';
import phrasesFor from '../i18n/translations';
import { default as AnnotationDetail } from './annotations/AnnotationDetail';
import { default as AnnotationList } from './annotations/AnnotationList';
import App from './App';
import { ConfigTenantRoute } from './ConfigTenantRoute';
import { Data } from './Data';
import { Display } from './Display';
import LoginAdmin from './LoginAdmin';
import PrivateRoute from './PrivateRoute';
import reducers from './reducers';
import sagas from './sagas';

const localesMUI = new Map([
    ['fr', { ...frFR, ...frFRDatagrid }],
    ['en', { ...enUS, ...enUSDatagrid }],
]);

const locale = getLocale();
const initialState = {
    i18n: {
        locale,
        phrases: phrasesFor(locale),
    },
};

const hashHistory = createHashHistory();
export const { store, history } = configureStore(
    reducers,
    sagas,
    // @ts-expect-error TS2339
    window.__PRELOADED_STATE__ || initialState,
    hashHistory,
);

if (process.env.NODE_ENV === 'e2e') {
    sessionStorage.setItem('lodex-dbName', 'lodex_test');
} else {
    // @ts-expect-error TS2339
    const dbName = window.__DBNAME__;
    // @ts-expect-error TS2339
    const tenant = window.__TENANT__;
    sessionStorage.setItem('lodex-dbName', dbName);
    sessionStorage.setItem('lodex-tenant', tenant);
}

const queryClient = new QueryClient();

render(
    <Provider store={store}>
        <QueryClientProvider client={queryClient}>
            <ThemeProvider
                // @ts-expect-error TS2345
                theme={createThemeMui(defaultTheme, localesMUI.get(locale))}
            >
                <I18N>
                    <Router history={history}>
                        {/*
                         // @ts-expect-error TS2339 */}
                        <App tenant={window.__TENANT__}>
                            <Route
                                path="/"
                                exact
                                render={() => <Redirect to="/data" />}
                            />
                            {/*
                             // @ts-expect-error TS2322 */}
                            <PrivateRoute path="/data" component={Data} />
                            {/*
                             // @ts-expect-error TS2322 */}
                            <PrivateRoute path="/display" component={Display} />
                            <PrivateRoute
                                // @ts-expect-error TS2322
                                path="/annotations/:annotationId"
                                component={AnnotationDetail}
                            />
                            <PrivateRoute
                                // @ts-expect-error TS2322
                                path="/annotations"
                                component={AnnotationList}
                                exact
                            />
                            <PrivateRoute
                                // @ts-expect-error TS2322
                                path="/config"
                                component={ConfigTenantRoute}
                            />
                            <Route path="/login" exact component={LoginAdmin} />
                        </App>
                    </Router>
                </I18N>
            </ThemeProvider>
        </QueryClientProvider>
    </Provider>,
    document.getElementById('root'),
);
