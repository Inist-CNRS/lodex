import '@babel/polyfill';
import 'url-api-polyfill';

import React from 'react';
import { render } from 'react-dom';
import { createHashHistory } from 'history';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Redirect } from 'react-router';

import {
    createTheme as createThemeMui,
    ThemeProvider,
} from '@mui/material/styles';

import createRootReducer from './reducers';
import sagas from './sagas';
import configureStore from '../configureStore';
import scrollToTop from '../lib/scrollToTop';
import phrasesFor from '../i18n/translations';
import getLocale from '../../../common/getLocale';
import App from './App';
import PrivateRoute from './PrivateRoute';
import { Display } from './Display';
import { Data } from './Data';
import { frFR as frFRDatagrid, enUS as enUSDatagrid } from '@mui/x-data-grid';
import { frFR, enUS } from '@mui/material/locale';
import LoginAdmin from './LoginAdmin';
import { ConfigTenantRoute } from './ConfigTenantRoute';
import '../../ace-webpack-loader';
import defaultTheme from '../../custom/themes/default/defaultTheme';

const localesMUI = new Map([
    ['fr', { ...frFR, ...frFRDatagrid }],
    ['en', { ...enUS, ...enUSDatagrid }],
]);

const locale = getLocale();
const initialState = {
    polyglot: {
        locale,
        phrases: phrasesFor(locale),
    },
};

const history = createHashHistory();
export const store = configureStore(
    createRootReducer(history),
    sagas,
    window.__PRELOADED_STATE__ || initialState,
    history,
);

if (process.env.NODE_ENV === 'e2e') {
    sessionStorage.setItem('lodex-dbName', 'lodex_test');
} else {
    const dbName = window.__DBNAME__;
    const tenant = window.__TENANT__;
    sessionStorage.setItem('lodex-dbName', dbName);
    sessionStorage.setItem('lodex-tenant', tenant);
}

render(
    <Provider store={store}>
        <ThemeProvider
            theme={createThemeMui(defaultTheme, localesMUI.get(locale))}
        >
            <ConnectedRouter history={history} onUpdate={scrollToTop}>
                <App tenant={window.__TENANT__}>
                    <Route
                        path="/"
                        exact
                        render={() => <Redirect to="/data" />}
                    />
                    <PrivateRoute path="/data" component={Data} />
                    <PrivateRoute path="/display" component={Display} />
                    <PrivateRoute
                        path="/config"
                        component={ConfigTenantRoute}
                    />
                    <Route path="/login" exact component={LoginAdmin} />
                </App>
            </ConnectedRouter>
        </ThemeProvider>
    </Provider>,
    document.getElementById('root'),
);
