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
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import scrollToTop from '../lib/scrollToTop';
import { ConnectedRouter } from 'connected-react-router';

import getLocale from '../../../common/getLocale';

const muiTheme = getMuiTheme({
    palette: {
        accent1Color: '#F48022',
        accent2Color: '#f5f5f5',
        accent3Color: '#9e9e9e',
        alternateTextColor: '#ffffff',
        disabledColor: '#5F6368',
        primary1Color: '#7DBD42',
        primary2Color: '#B22F90',
        primary3Color: '#7DBD42',
        shadowColor: 'rgba(0, 0, 0, 1)',
        textColor: '#5F6368',
    },
});

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
