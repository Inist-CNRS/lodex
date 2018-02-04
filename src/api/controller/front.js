import path from 'path';
import { renderToString } from 'react-dom/server';
import React from 'react';
import Koa from 'koa';
import serve from 'koa-static';
import mount from 'koa-mount';
import { Provider } from 'react-redux';
import { createMemoryHistory, match, RouterContext } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { Helmet } from 'react-helmet';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { END } from 'redux-saga';
import koaWebpack from 'koa-webpack';
import fs from 'fs';
import { StyleSheetServer } from 'aphrodite/no-important';
import jwt from 'koa-jwt';
import jsonwebtoken from 'jsonwebtoken';
import { auth } from 'config';
import pick from 'lodash.pick';

import rootReducer from '../../app/js/public/reducers';
import sagas from '../../app/js/public/sagas';
import configureStoreServer from '../../app/js/configureStoreServer';
import routes from '../../app/js/public/routes';
import phrasesForEn from '../../app/js/i18n/translations/en';
import webpackConfig from '../../app/webpack.config.babel';
import { buildFrontend, buildFrontendMiddleware } from './buildFrontEnd';
import config from '../../../config.json';

const indexHtml = fs
    .readFileSync(path.resolve(__dirname, '../../app/custom/index.html'))
    .toString();

const getInitialState = (token, cookie) => ({
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
    user: {
        token,
        cookie,
    },
});

const renderFullPage = (html, css, preloadedState, helmet) =>
    indexHtml
        .replace(
            '<div id="root"></div>',
            `<div id="root"><div>${html}</div></div>`,
        )
        .replace(/<title>.*?<\/title>/, helmet.title.toString())
        .replace(
            '</head>',
            `${helmet.meta.toString()}
            ${helmet.link.toString()}
            <style data-aphrodite>${css.content}</style>
            </head>`,
        )
        .replace(
            '</body>',
            `<script>window.__PRELOADED_STATE__ = ${JSON.stringify(
                preloadedState,
            ).replace(/</g, '\\u003c')}</script>
            <script src="/index.js"></script>
            </body>`,
        );

const renderHtml = (store, renderProps, muiTheme) =>
    StyleSheetServer.renderStatic(() =>
        renderToString(
            <Provider {...{ store }}>
                <MuiThemeProvider muiTheme={muiTheme}>
                    <RouterContext {...renderProps} />
                </MuiThemeProvider>
            </Provider>,
        ),
    );

const getPropsFromUrl = async ({ history, routes, location: url }) =>
    await new Promise((resolve, reject) => {
        match(
            { history, routes, location: url },
            (error, redirect, renderProps) => {
                if (error) {
                    return reject(error);
                }

                resolve({ redirect, renderProps });
            },
        );
    });

export const getRenderingData = async (
    renderProps,
    history,
    muiTheme,
    token,
    cookie,
) => {
    const store = configureStoreServer(
        rootReducer,
        sagas,
        getInitialState(token, cookie),
        history,
    );

    const sagaPromise = store.runSaga(sagas).done;

    renderHtml(store, renderProps, muiTheme);

    syncHistoryWithStore(history, store);
    store.dispatch(END);

    await sagaPromise;

    const { html, css } = renderHtml(store, renderProps, muiTheme);
    const helmet = Helmet.renderStatic();
    const preloadedState = store.getState();

    return {
        html,
        css,
        helmet,
        preloadedState: {
            ...preloadedState,
            user: {
                token: null,
            },
        },
    };
};

const handleRender = async (ctx, next) => {
    const { url, headers } = ctx.request;

    const history = createMemoryHistory(url);

    const { redirect, renderProps } = await getPropsFromUrl({
        history,
        routes,
        location: url,
    });

    if (redirect) {
        ctx.redirect(redirect.pathname + redirect.search);
        return;
    }

    // no route matched switch to static file
    if (!renderProps) {
        return next();
    }

    const muiTheme = getMuiTheme(
        {},
        {
            userAgent: headers['user-agent'],
        },
    );

    const { html, css, preloadedState, helmet } = await getRenderingData(
        renderProps,
        history,
        muiTheme,
        ctx.state.headerToken,
        ctx.request.header.cookie,
    );

    ctx.body = renderFullPage(html, css, preloadedState, helmet);
};

const app = new Koa();

if (process.env.NODE_ENV === 'production') {
    buildFrontend();
    app.use(buildFrontendMiddleware);
}

if (config.userAuth) {
    app.use(
        jwt({
            secret: auth.cookieSecret,
            cookie: 'lodex_token',
            key: 'cookie',
            passthrough: true,
        }),
    );

    app.use(async (ctx, next) => {
        if (
            !ctx.state.cookie &&
            ctx.request.url !== '/login' &&
            ctx.request.url !== '/index.js'
        ) {
            ctx.redirect('/login');
            return;
        }
        ctx.state.headerToken = jsonwebtoken.sign(
            pick(ctx.state.cookie, ['username', 'role', 'exp']),
            auth.headerSecret,
        );

        await next();
    });
}

app.use(handleRender);

if (process.env.NODE_ENV === 'development') {
    app.use(
        koaWebpack({
            config: webpackConfig,
            dev: {
                publicPath: '/',
                stats: {
                    colors: true,
                },
                quiet: false,
                noInfo: true,
            },
            hot: {
                log: global.console.log,
                path: '/__webpack_hmr',
                heartbeat: 10 * 1000,
            },
        }),
    );
} else {
    app.use(mount('/', serve(path.resolve(__dirname, '../../build'))));
    app.use(mount('/', serve(path.resolve(__dirname, '../../app/custom'))));
}

export default app;
