import '@babel/polyfill';
import 'url-api-polyfill';

import React from 'react';
import { render } from 'react-dom';
import { createHashHistory } from 'history';
import { connect, Provider } from 'react-redux';
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
import Login from '../user/Login';
import PrivateRoute from './PrivateRoute';
import { Display } from './Display';
import { Data } from './Data';
import { dumpDataset } from './dump/index';
import compose from 'recompose/compose';

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

const Settingss = props => {
    console.log({ props });
    return (
        <span>
            Settings<button onClick={() => props.dumpDataset()}>OK</button>
        </span>
    );
};

const Settings = compose(connect(undefined, { dumpDataset }))(Settingss);

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
                    <PrivateRoute path="/data" component={Data} />
                    <PrivateRoute path="/display" component={Display} />
                    <PrivateRoute path="/settings" component={Settings} />
                    <Route path="/login" exact component={Login} />
                </App>
            </ConnectedRouter>
        </MuiThemeProvider>
    </Provider>,
    document.getElementById('root'),
);
