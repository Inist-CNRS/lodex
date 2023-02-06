import '@babel/polyfill';
import 'url-api-polyfill';

import React from 'react';
import { render } from 'react-dom';
import { createHashHistory } from 'history';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Redirect } from 'react-router';

import {
    ThemeProvider as MaterialThemeProvider,
    createTheme,
} from '@material-ui/core/styles';

import {
    createTheme as createThemeMui,
    ThemeProvider,
} from '@mui/material/styles';

import rootReducer from './reducers';
import sagas from './sagas';
import configureStore from '../configureStore';
import scrollToTop from '../lib/scrollToTop';
import phrasesFor from '../i18n/translations';
import getLocale from '../../../common/getLocale';
import colorsTheme from '../../custom/colorsTheme';
import App from './App';
import Login from '../user/Login';
import PrivateRoute from './PrivateRoute';
import { Display } from './Display';
import { Data } from './Data';
import { frFR as frFRDatagrid, enUS as enUSDatagrid } from '@mui/x-data-grid';
import { frFR, enUS } from '@mui/material/locale';

const localesMUI = new Map([
    ['fr', { ...frFR, ...frFRDatagrid }],
    ['en', { ...enUS, ...enUSDatagrid }],
]);

const theme = {
    palette: {
        secondary: {
            main: colorsTheme.orange.primary,
        },
        primary: {
            main: colorsTheme.green.primary,
            contrastText: colorsTheme.white.primary,
        },
        neutral: {
            main: colorsTheme.gray.primary,
        },
        contrastThreshold: 3,
        error: {
            main: colorsTheme.red.primary,
        },
        info: {
            main: colorsTheme.black.light,
        },
        // @TODO: find this usage or remove
        primary2Color: colorsTheme.purple.primary,
        text: {
            primary: colorsTheme.black.secondary,
        },
    },
};

const locale = getLocale();
const initialState = {
    polyglot: {
        locale,
        phrases: phrasesFor(locale),
    },
};

const history = createHashHistory();
export const store = configureStore(
    rootReducer,
    sagas,
    window.__PRELOADED_STATE__ || initialState,
    history,
);

render(
    <Provider store={store}>
        <MaterialThemeProvider
            theme={createTheme(theme, localesMUI.get(locale))}
        >
            <ThemeProvider
                theme={createThemeMui(theme, localesMUI.get(locale))}
            >
                <ConnectedRouter history={history} onUpdate={scrollToTop}>
                    <App>
                        <Route
                            path="/"
                            exact
                            render={() => <Redirect to="/data" />}
                        />
                        <PrivateRoute path="/data" component={Data} />
                        <PrivateRoute path="/display" component={Display} />
                        <Route path="/login" exact component={Login} />
                    </App>
                </ConnectedRouter>
            </ThemeProvider>
        </MaterialThemeProvider>
    </Provider>,
    document.getElementById('root'),
);
