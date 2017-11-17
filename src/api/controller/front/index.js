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
import koaWebpack from 'koa-webpack';

import rootReducer from '../../../app/js/public/reducers';
import sagas from '../../../app/js/public/sagas';
import configureStoreServer from '../../../app/js/configureStoreServer';
import routes from '../../../app/js/public/routes';
import phrasesForEn from '../../../app/js/i18n/translations/en';
import webpackConfig from '../../../app/webpack.config.babel';
import fs from 'fs';

const indexHtml = fs.readFileSync(path.resolve(__dirname, '../../../app/custom/index.html')).toString();

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

const renderFullPage = (html, preloadedState) =>
    indexHtml
        .replace('<div id="root"></div>', `<div id="root"><div>${html}</div></div>`)
        .replace('</body>',
            `<script>window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}</script>
            <script src="/static/index.js"></script>
            </body>`
        );

const handleRender = async (ctx, next) => {
    const { url, headers } = ctx.request;
    if (url === '/__webpack_hmr') {
        await next();
        return;
    }
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

if (process.env.NODE_ENV === 'development') {
    app.use(koaWebpack({
        config: webpackConfig,
        dev: {
            publicPath: '/static/',
            stats: {
                colors: true,
            },
            quiet: false,
            noInfo: true,
        },
        hot: {
            log: console.log,
            path: '/__webpack_hmr',
            heartbeat: 10 * 1000,
        },
    }));
} else {
    app.use(mount('/static', serve(path.resolve(__dirname, '../../../build'))));
}

app.use(handleRender);

export default app;
