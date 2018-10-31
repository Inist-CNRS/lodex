import 'babel-polyfill';
import 'url-api-polyfill';

import React from 'react';
import { render } from 'react-dom';

import Root from '../Root';
import rootReducer from './reducers';
import Routes from './Routes';
import sagas from './sagas';
import configureStore from '../configureStore';
import phrasesFor from '../i18n/translations';
import { createHashHistory } from 'history';
import getLocale from '../../../common/getLocale';

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
    <Root {...{ store, routes: <Routes />, history }} />,
    document.getElementById('root'),
);
