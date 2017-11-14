import path from 'path';
import { renderToString } from 'react-dom/server';
import React from 'react';
import Koa from 'koa';
import serve from 'koa-static';
import mount from 'koa-mount';
import { Provider } from 'react-redux';
import { createMemoryHistory, match, RouterContext } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import rootReducer from '../../../app/js/public/reducers';
import sagas from '../../../app/js/public/sagas';
import configureStoreServer from '../../../app/js/configureStoreServer';
import routesFactory from '../../../app/js/public/routes';
import phrasesForEn from '../../../app/js/i18n/translations/en';

const initialState = {
    polyglot: {
        locale: 'en',
        phrases: phrasesForEn,
    },
};

const renderFullPage = (html, preloadedState) => (
    `<!doctype html>
    <html>
    <head>
    <title>Redux Universal Example</title>
    </head>
    <body>
    <div id="root">${html}</div>
    <script>
    // WARNING: See the following for security issues around embedding JSON in HTML:
    // http://redux.js.org/docs/recipes/ServerRendering.html#security-considerations
    window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
    </script>
    <script src="/static/index.js"></script>
    </body>
    </html>`
);

const handleRender = async (ctx) => {
    const { url } = ctx.request;
    const memoryHistory = createMemoryHistory(url);
    const store = configureStoreServer(rootReducer, sagas, initialState, memoryHistory);
    const history = syncHistoryWithStore(memoryHistory, store);
    const routes = routesFactory(store);
    match({ history, routes, location: url }, (err, redirect, props) => {
        const html = renderToString(
            <Provider store={store}>
                <RouterContext {...props} />
            </Provider>
        );
        const preloadedState = store.getState();
        ctx.body = renderFullPage(html, preloadedState);
    });
};

const app = new Koa();
app.use(mount('/static', serve(path.resolve(__dirname, '../../../build'))));
app.use(handleRender);

export default app;
