import '@babel/polyfill';
import 'url-api-polyfill';
import { createBrowserHistory } from 'history';
import React from 'react';
import { render } from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Provider } from 'react-redux';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import rootReducer from './reducers';
import Routes from './Routes';
import sagas from './sagas';
import configureStore from '../configureStore';
import phrasesFor from '../i18n/translations';
import getLocale from '../../../common/getLocale';
import customTheme from './customTheme';

const muiTheme = getMuiTheme(customTheme);

const language = getLocale();
const initialState = {
    polyglot: {
        locale: language,
        phrases: phrasesFor(language),
    },
};

const history = createBrowserHistory();

const store = configureStore(
    rootReducer,
    sagas,
    window.__PRELOADED_STATE__ || initialState,
    history,
);

render(
    <Provider {...{ store }}>
        <MuiThemeProvider muiTheme={muiTheme}>
            <Routes history={history} />
        </MuiThemeProvider>
    </Provider>,
    document.getElementById('root'),
);
