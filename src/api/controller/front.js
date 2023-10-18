/* eslint-disable no-useless-escape */
import path from 'path';
import { renderToString } from 'react-dom/server';
import React from 'react';
import Koa from 'koa';
import serve from 'koa-static';
import route from 'koa-route';
import mount from 'koa-mount';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router';
import { Helmet } from 'react-helmet';
import {
    ThemeProvider as MuiThemeProvider,
    createTheme,
} from '@mui/material/styles';
import { END } from 'redux-saga';
import fs from 'fs';
import { StyleSheetServer } from 'aphrodite/no-important';
import jwt from 'koa-jwt';
import jsonwebtoken from 'jsonwebtoken';
import { auth, istexApiUrl, jsHost, mongo } from 'config';
import pick from 'lodash.pick';
import { createMemoryHistory } from 'history';

import rootReducer from '../../app/js/public/reducers';
import sagas from '../../app/js/public/sagas';
import configureStoreServer from '../../app/js/configureStoreServer';
import Routes from '../../app/js/public/Routes';
import translations from '../services/translations';
import config from '../../../config.json';
import getLocale from '../../common/getLocale';
import {
    leftMenu,
    rightMenu,
    advancedMenu,
    advancedMenuButton,
    customRoutes,
} from './api/menu';
import { breadcrumb } from './api/breadcrumb';
import {
    displayDensity,
    PDFExportOptions,
    maxCheckAllFacetsValue,
    multilingual,
} from './api/displayConfig';
import customTheme from '../../app/custom/customTheme';

import { getPublication } from './api/publication';
import getCatalogFromArray from '../../common/fields/getCatalogFromArray.js';

const REGEX_JS_HOST = /\{\|__JS_HOST__\|\}/g;

const indexHtml = fs
    .readFileSync(path.resolve(__dirname, '../../app/custom/index.html'))
    .toString()
    .replace(REGEX_JS_HOST, jsHost);

const getDefaultInitialState = (token, cookie, locale) => ({
    fields: {
        loading: false,
        isSaving: false,
        byName: {},
        allValid: true,
        list: [],
        invalidFields: [],
        editedValueFieldName: null,
        configuredFieldName: null,
        published: true,
    },
    polyglot: {
        locale,
        phrases: translations.getByLanguage(locale),
    },
    user: {
        token,
        cookie,
    },
    breadcrumb,
    menu: {
        leftMenu,
        rightMenu,
        advancedMenu,
        advancedMenuButton,
        customRoutes,
        error: null,
    },
    displayConfig: {
        displayDensity,
        PDFExportOptions,
        maxCheckAllFacetsValue,
        multilingual,
        error: null,
    },
});

const getInitialState = async (token, cookie, locale, ctx) => {
    const initialState = getDefaultInitialState(token, cookie, locale);

    if (!cookie) {
        return initialState;
    }

    const {
        characteristics,
        fields: fieldsWithCount,
        published,
    } = await getPublication(ctx);

    const { catalog: byName, list } = getCatalogFromArray(
        fieldsWithCount,
        'name',
    );

    return {
        ...initialState,
        fields: {
            ...initialState.fields,
            byName,
            list,
            published,
        },
        characteristic: {
            characteristics,
            error: null,
            newCharacteristics: characteristics[0],
            isSaving: false,
            isAdding: false,
        },
    };
};

const renderFullPage = (html, css, preloadedState, helmet, tenant) =>
    indexHtml
        .replace('<div id="root"></div>', `<div id="root">${html}</div>`)
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
            ).replace(/</g, '\\u003c')};window.ISTEX_API_URL=${JSON.stringify(
                istexApiUrl,
            )}</script>
            <script>window.__TENANT__ = ${JSON.stringify(tenant)}</script>
            <script src="${jsHost}/index.js"></script>
            </body>`,
        );

const renderHtml = (store, muiTheme, url, context, history) =>
    StyleSheetServer.renderStatic(() =>
        renderToString(
            <StaticRouter location={url} context={context}>
                <Provider {...{ store }}>
                    <MuiThemeProvider theme={muiTheme}>
                        <Routes history={history} />
                    </MuiThemeProvider>
                </Provider>
            </StaticRouter>,
        ),
    );

export const getRenderingData = async (
    history,
    theme,
    token,
    cookie,
    locale,
    url,
    ctx,
) => {
    const store = configureStoreServer(
        rootReducer,
        sagas,
        await getInitialState(token, cookie, locale, ctx),
        history,
    );

    const sagaPromise = store.runSaga(sagas).done;
    const context = {};
    const { html, css } = renderHtml(store, theme, url, context, history);
    store.dispatch(END);

    await sagaPromise;

    if (context.url) {
        return {
            redirect: context.url,
        };
    }

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
    if (
        (url.match(/[^\\]*\.(\w+)$/) &&
            !url.match(/[^\\]*\.html$/) &&
            !url.match(/\/uid:\//)) ||
        url.match('/admin') ||
        url.match('__webpack_hmr')
    ) {
        // no route matched switch to static file
        return next();
    }

    const history = createMemoryHistory({
        initialEntries: [url],
    });

    const theme = createTheme(customTheme, {
        userAgent: headers['user-agent'],
    });

    const {
        html,
        css,
        preloadedState,
        helmet,
        redirect,
    } = await getRenderingData(
        history,
        theme,
        ctx.state.headerToken,
        ctx.request.header.cookie,
        getLocale(ctx),
        url,
        ctx,
    );

    if (redirect) {
        return ctx.redirect(redirect);
    }

    ctx.body = renderFullPage(html, css, preloadedState, helmet, ctx.tenant);
};

const renderAdminIndexHtml = ctx => {
    ctx.body = fs
        .readFileSync(path.resolve(__dirname, '../../app/admin.html'))
        .toString()
        .replace(
            '</body>',
            ` <script>window.__DBNAME__ = ${JSON.stringify(
                mongo.dbName,
            )}</script><script>window.__TENANT__ = ${JSON.stringify(
                ctx.tenant,
            )}</script><script src="{|__JS_HOST__|}/admin/index.js"></script>
        </body>`,
        )
        .replace(REGEX_JS_HOST, jsHost);
};

const renderRootAdminIndexHtml = ctx => {
    ctx.body = fs
        .readFileSync(path.resolve(__dirname, '../../app/root-admin.html'))
        .toString()
        .replace(
            '</body>',
            ` <script>window.__DBNAME__ = ${JSON.stringify(
                mongo.dbName,
            )}</script><script>window.__TENANT__ = ${JSON.stringify(
                ctx.tenant,
            )}</script><script src="{|__JS_HOST__|}/root-admin/index.js"></script>
        </body>`,
        )
        .replace(REGEX_JS_HOST, jsHost);
};

const app = new Koa();

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
            !ctx.request.url.match(/instance\/([^\/]*)\/login/) &&
            !ctx.request.url.startsWith('/instances') &&
            !ctx.request.url.match(/[^\\]*\.(\w+)$/) &&
            !ctx.request.url.match('__webpack_hmr')
        ) {
            // an url call looks like /instance/:slug/:otherpart
            // We want to explode the url to get the slug and the other part in two different variables
            const [, instanceSlug, otherPart] = ctx.request.url.match(
                /instance\/([^\/]*)(.*)/,
            );
            // redirect to `instance/:slug/login` and if otherPart is not empty, add it to the url
            ctx.redirect(
                `/instance/${instanceSlug}/login${
                    otherPart ? 'page=' + encodeURIComponent(otherPart) : ''
                }`,
            );
            return;
        }
        ctx.state.headerToken = jsonwebtoken.sign(
            pick(ctx.state.cookie, ['username', 'role', 'exp']),
            auth.headerSecret,
        );

        await next();
    });
}

app.use(
    route.get('/instances(.*)', async ctx => {
        renderRootAdminIndexHtml(ctx);
    }),
);

app.use(handleRender);

app.use(
    route.get('/instance/:slug/admin', async ctx => {
        renderAdminIndexHtml(ctx);
    }),
);

app.use(mount('/', serve(path.resolve(__dirname, '../../build'))));
app.use(mount('/', serve(path.resolve(__dirname, '../../app/custom'))));

export default app;
