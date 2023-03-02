import '@babel/polyfill';
import 'url-api-polyfill';
import { createBrowserHistory } from 'history';
import React from 'react';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';

import {
    createTheme as createThemeMui,
    ThemeProvider,
} from '@mui/material/styles';

import rootReducer from './reducers';
import Routes from './Routes';
import sagas from './sagas';
import configureStore from '../configureStore';
import phrasesFor from '../i18n/translations';
import getLocale from '../../../common/getLocale';
import customTheme from '../../custom/customTheme';

const locale = getLocale();
const initialState = {
    polyglot: {
        locale,
        phrases: phrasesFor(locale),
    },
};

const history = createBrowserHistory();

const store = configureStore(
    rootReducer,
    sagas,
    window.__PRELOADED_STATE__ || initialState,
    history,
);

hydrate(
    <Provider {...{ store }}>
        <ThemeProvider theme={createThemeMui(customTheme)}>
            <Routes history={history} />
        </ThemeProvider>
    </Provider>,
    document.getElementById('root'),
);
