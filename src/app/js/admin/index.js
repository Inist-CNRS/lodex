import 'babel-polyfill';
import 'url-api-polyfill';

import React from 'react';
import { render } from 'react-dom';

import rootReducer from './reducers';
import Routes from './Routes';
import sagas from './sagas';
import configureStore from '../configureStore';
import phrasesFor from '../i18n/translations';
import { createHashHistory } from 'history';
import { Provider } from 'react-redux';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import scrollToTop from '../lib/scrollToTop';
import { ConnectedRouter } from 'connected-react-router';

import getLocale from '../../../common/getLocale';
import customTheme from '../public/customTheme';

const muiTheme = createMuiTheme(customTheme);

const language = getLocale();
const initialState = {
    polyglot: {
        locale: language,
        phrases: phrasesFor(language),
    },
};

const history = createHashHistory();
const store = configureStore(rootReducer, sagas, initialState, history);

render(
    <Provider {...{ store }}>
        <MuiThemeProvider muiTheme={muiTheme}>
            <ConnectedRouter history={history} onUpdate={scrollToTop}>
                <Routes />
            </ConnectedRouter>
        </MuiThemeProvider>
    </Provider>,
    document.getElementById('root'),
);
