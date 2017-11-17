import path from 'path';
import config from 'config';
import { renderToString } from 'react-dom/server';
import React from 'react';
import Koa from 'koa';
import serve from 'koa-static';
import mount from 'koa-mount';
import { Provider } from 'react-redux';
import { createMemoryHistory, match, RouterContext } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import DocumentTitle from 'react-document-title';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { END } from 'redux-saga';

import rootReducer from '../../../app/js/public/reducers';
import sagas from '../../../app/js/public/sagas';
import configureStoreServer from '../../../app/js/configureStoreServer';
import routes from '../../../app/js/public/routes';
import phrasesForEn from '../../../app/js/i18n/translations/en';

const initialState = {
    fields: {
        loading: false,
        isSaving: false,
        byName: {},
        allValid: true,
        list: [],
        invalidFields: [],
        editedFieldName: undefined,
        editedValueFieldName: null,
        configuredFieldName: null,
        published: true,
    },
    polyglot: {
        locale: 'en',
        phrases: phrasesForEn,
    },
};

const renderFullPage = (html, preloadedState) => (
    `<!doctype html>
    <html>
    <head>
        <title>Lodex</title>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">

        <style>
            body { padding-top: 70px; }
        </style>
    </head>

    <body>
        <nav class="navbar navbar-default navbar-fixed-top">
            <div class="container-fluid">
                <div class="navbar-header">
                    <a class="navbar-brand" href="/">Lodex</a>
                </div>
                <ul class="nav navbar-nav">
                    <li><a class="btn-admin" href="/admin">Administration</a></li>
                    <li><a class="btn-sign-in" href="/login">Connection</a></li>
                </ul>
            </div>
        </nav>
        <div class="container">
            <div id="root"><div>${html}</div></div>
        </div>
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
    const { url, headers } = ctx.request;
    if (url === '/') {
        ctx.redirect('/home');
        return;
    }

    const muiTheme = getMuiTheme({}, {
        userAgent: headers['user-agent'],
    });
    const history = createMemoryHistory(url);
    const pageTitle = /https?:\/\/([\w-]+)/.exec(config.host)[1];

    ctx.body = await new Promise((resolve, reject) => {
        match({ history, routes, location: url }, (error, redirect, renderProps) => {
            const store = configureStoreServer(rootReducer, sagas, initialState, history);
            if (error) {
                reject(error);
            }
            if (redirect) {
                ctx.redirect(redirect.pathname + redirect.search);
                return;
            }
            store.runSaga(sagas).done
                .then(() => {
                    const html = renderToString(
                        <DocumentTitle title={pageTitle}>
                            <Provider {...{ store }}>
                                <MuiThemeProvider muiTheme={muiTheme}>
                                    <RouterContext {...renderProps} />
                                </MuiThemeProvider>
                            </Provider>
                        </DocumentTitle>,
                    );
                    const preloadedState = store.getState();

                    resolve(renderFullPage(html, preloadedState));
                })
                .catch(error => reject(error));

            renderToString(
                <DocumentTitle title={pageTitle}>
                    <Provider {...{ store }}>
                        <MuiThemeProvider muiTheme={muiTheme}>
                            <RouterContext {...renderProps} />
                        </MuiThemeProvider>
                    </Provider>
                </DocumentTitle>,
            );

            syncHistoryWithStore(history, store);
            store.dispatch(END);
        });
    });
};

const app = new Koa();
app.use(mount('/static', serve(path.resolve(__dirname, '../../../build'))));
app.use(handleRender);

export default app;
