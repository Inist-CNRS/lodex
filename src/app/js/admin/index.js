import '@babel/polyfill';
import 'url-api-polyfill';

import React from 'react';
import { render } from 'react-dom';
import { createHashHistory } from 'history';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Redirect } from 'react-router';

import {
    ThemeProvider as MuiThemeProvider,
    createMuiTheme,
} from '@material-ui/core/styles';

import rootReducer from './reducers';
import sagas from './sagas';
import configureStore from '../configureStore';
import scrollToTop from '../lib/scrollToTop';
import phrasesFor from '../i18n/translations';
import getLocale from '../../../common/getLocale';
import theme from '../theme';
import App from './App';
import RemovedResourcePage from './removedResources/RemovedResourcePage';
import Login from '../user/Login';
import PrivateRoute from './PrivateRoute';
import { Display } from './Display';
import { Data } from './Data';

const adminTheme = createMuiTheme({
    palette: {
        secondary: {
            main: theme.orange.primary,
        },
        primary: {
            main: theme.green.primary,
            contrastText: theme.white.primary,
        },
        contrastThreshold: 3,
        // @TODO: find this usage or remove
        primary2Color: theme.purple.primary,
        text: {
            primary: theme.black.secondary,
        },
    },
});

const locale = getLocale();
const initialState = {
    polyglot: {
        locale,
        phrases: phrasesFor(locale),
    },
};

const history = createHashHistory();
const store = configureStore(
    rootReducer,
    sagas,
    window.__PRELOADED_STATE__ || initialState,
    history,
);

render(
    <Provider store={store}>
        <MuiThemeProvider theme={adminTheme}>
            <ConnectedRouter history={history} onUpdate={scrollToTop}>
                <App>
                    <Route
                        path="/"
                        exact
                        render={() => <Redirect to="/data" />}
                    />
                    <PrivateRoute
                        path="/data/removed"
                        exact
                        component={RemovedResourcePage}
                    />
                    <PrivateRoute path="/data" exact component={Data} />
                    <PrivateRoute path="/display" exact component={Display} />
                    <Route path="/login" exact component={Login} />
                </App>
            </ConnectedRouter>
        </MuiThemeProvider>
    </Provider>,
    document.getElementById('root'),
);
