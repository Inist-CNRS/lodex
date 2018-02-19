import 'babel-polyfill';
import 'url-api-polyfill';

import injectTapEventPlugin from 'react-tap-event-plugin';
import React from 'react';
import { render } from 'react-dom';

import Root from '../Root';
import rootReducer from './reducers';
import routesFactory from './routes';
import sagas from './sagas';
import configureStore from '../configureStore';
import phrasesFor from '../i18n/translations';
import { createHashHistory } from 'history';

const language = window.navigator.language || 'en';
const initialState = {
    polyglot: {
        locale: language,
        phrases: phrasesFor(language),
    },
};

const history = createHashHistory();
const store = configureStore(rootReducer, sagas, initialState, history);
const routes = routesFactory(store);

injectTapEventPlugin();

render(
    <Root {...{ store, routes, history }} />,
    document.getElementById('root'),
);

// Hot Module Replacement API
if (module.hot) {
    module.hot.accept('../Root', () => {
        const NewRoot = require('../Root').default; // eslint-disable-line
        render(
            <NewRoot {...{ store, routes, history }} />,
            document.getElementById('root'),
        );
    });
}
