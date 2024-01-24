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
import getLocale from '../../common/getLocale';

import { getPublication } from './api/publication';
import getCatalogFromArray from '../../common/fields/getCatalogFromArray.js';
import { DEFAULT_TENANT } from '../../common/tools/tenantTools';
import { getTheme, getAvailableThemesKeys } from '../models/themes';

const REGEX_JS_HOST = /\{\|__JS_HOST__\|\}/g;

const getDefaultInitialState = (ctx, token, cookie, locale) => ({
    enableAutoPublication: ctx.configTenant.enableAutoPublication,
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
    breadcrumb: ctx.configTenant.front.breadcrumb,
    menu: {
        leftMenu: ctx.configTenant.leftMenu,
        rightMenu: ctx.configTenant.rightMenu,
        advancedMenu: ctx.configTenant.advancedMenu,
        advancedMenuButton: ctx.configTenant.advancedMenuButton,
        customRoutes: ctx.configTenant.customRoutes,
        error: null,
    },
    displayConfig: {
        displayDensity: ctx.configTenant.front.displayDensity,
        PDFExportOptions: ctx.configTenant.front.PDFExportOptions,
        maxCheckAllFacetsValue: ctx.configTenant.front.maxCheckAllFacetsValue,
        multilingual: ctx.configTenant.front.multilingual,
        error: null,
    },
});

const getInitialState = async (token, cookie, locale, ctx) => {
    const initialState = getDefaultInitialState(ctx, token, cookie, locale);

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

const renderFullPage = (
    html,
    css,
    preloadedState,
    helmet,
    tenant,
    indexHtml,
    cssVariable,
) =>
    indexHtml
        .replace('<div id="root"></div>', `<div id="root">${html}</div>`)
        .replace(/<title>.*?<\/title>/, helmet.title.toString())
        .replace(
            '</head>',
            `${helmet.meta.toString()}
            ${helmet.link.toString()}
            <style data-aphrodite>${css.content}</style>
            <style>${cssVariable}</style>
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

/**
 * Create all css variable linked to the customTheme,
 * this is done to avoid importing the customTheme file into the front and source code
 * @param theme
 * @returns {string}
 */
const getCssVariable = theme => {
    const palette = theme.palette;
    return `
:root {
    --primary-main: ${palette.primary.main};
    --primary-secondary: ${palette.primary.secondary};
    --primary-light: ${palette.primary.light};
    --primary-contrast-text: ${palette.primary.contrastText};

    --secondary-main: ${palette.secondary.main};
    --secondary-contrast-text: ${palette.secondary.contrastText};

    --info-main: ${palette.info.main};
    --info-contrast-text: ${palette.info.contrastText};

    --warning-main: ${palette.warning.main};
    --warning-contrast-text: ${palette.warning.contrastText};

    --danger-main: ${palette.danger.main};
    --danger-contrast-text: ${palette.danger.contrastText};

    --success-main: ${palette.success.main};
    --success-contrast-text: ${palette.success.contrastText};
    
    --neutral-main: ${palette.neutral.main};
    
    --neutral-dark-main: ${palette.neutralDark.main};
    --neutral-dark-secondary: ${palette.neutralDark.secondary};
    --neutral-dark-very-dark: ${palette.neutralDark.veryDark};
    --neutral-dark-dark: ${palette.neutralDark.dark};
    --neutral-dark-light: ${palette.neutralDark.light};
    --neutral-dark-lighter: ${palette.neutralDark.lighter};
    --neutral-dark-very-light: ${palette.neutralDark.veryLight};
    --neutral-dark-transparent: ${palette.neutralDark.transparent};
    
    --text-main: ${palette.text.main};
    --text-primary: ${palette.text.primary};
    
    --contrast-main: ${palette.contrast.main};
    --contrast-light: ${palette.contrast.light};
    
    --contrast-threshold: ${palette.contrastThreshold};
}
    `;
};

const handleRender = async (ctx, next) => {
    const { url, headers } = ctx.request;
    if (
        (url.match(/[^\\]*\.(\w+)$/) && !url.match(/\/uid:\//)) ||
        url.match(/[^\\]*\.html$/) ||
        url.match('/admin') ||
        url.match('__webpack_hmr')
    ) {
        // no route matched switch to static file
        return next();
    }

    const history = createMemoryHistory({
        initialEntries: [url],
    });

    const lodexTheme = getTheme(ctx.configTenant.theme);

    const theme = createTheme(lodexTheme.customTheme, {
        userAgent: headers['user-agent'],
    });

    const cssVariable = getCssVariable(lodexTheme.customTheme);

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

    ctx.body = renderFullPage(
        html,
        css,
        preloadedState,
        helmet,
        ctx.tenant,
        lodexTheme.index,
        cssVariable,
    );
};

const renderAdminIndexHtml = ctx => {
    const lodexTheme = getTheme('default');
    const cssVariable = getCssVariable(lodexTheme.customTheme);

    ctx.body = fs
        .readFileSync(path.resolve(__dirname, '../../app/admin.html'))
        .toString()
        .replace(
            '</head>',
            `<style>${cssVariable}</style>
            </head>`,
        )
        .replace(
            '</body>',
            ` <script>window.__DBNAME__ = ${JSON.stringify(
                mongo.dbName,
            )}</script><script>window.__TENANT__ = ${JSON.stringify(
                ctx.tenant,
            )}</script>
              <script>window.__JS_HOST__ = "${jsHost}"</script>
              <script src="{|__JS_HOST__|}/admin/index.js"></script>
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

// ############################
// # Authentication middleware
// ############################

app.use(async (ctx, next) => {
    if (!ctx.configTenant?.userAuth?.active) {
        return await next();
    }
    const jwtMid = await jwt({
        secret: auth.cookieSecret,
        cookie: `lodex_token_${ctx.tenant}`,
        key: 'cookie',
        passthrough: true,
    });

    return jwtMid(ctx, next);
});

app.use(async (ctx, next) => {
    if (!ctx.configTenant?.userAuth?.active) {
        return await next();
    }

    if (
        !ctx.state.cookie &&
        !ctx.request.url.match(/instance\/([^\/]*)\/login/) &&
        !ctx.request.url.match(/instance\/([^\/]*)\/admin/) &&
        !ctx.request.url.startsWith('/instances') &&
        !ctx.request.url.match(/[^\\]*\.(\w+)$/) &&
        !ctx.request.url.match('__webpack_hmr')
    ) {
        const defaultTenant = DEFAULT_TENANT; // TODO: Replace by default tenant in BDD
        const matchResult = ctx.request.url.match(/instance\/([^\/]*)(.*)/);

        if (matchResult) {
            const [, tenantSlug, queryUrl] = matchResult;
            ctx.redirect(
                `/instance/${tenantSlug.toLowerCase()}/login${
                    queryUrl ? '?page=' + encodeURIComponent(queryUrl) : ''
                }`,
            );
        } else {
            ctx.redirect(`/instance/${defaultTenant}/login`);
        }
        return;
    }
    ctx.state.headerToken = jsonwebtoken.sign(
        pick(ctx.state.cookie, ['username', 'role', 'exp']),
        auth.headerSecret,
    );

    await next();
});

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

for (let theme of getAvailableThemesKeys()) {
    app.use(
        mount(
            `/themes/${theme}/`,
            serve(path.resolve(__dirname, `../../themes/${theme}`)),
        ),
    );
}

app.use(mount('/', serve(path.resolve(__dirname, '../../build'))));
app.use(mount('/', serve(path.resolve(__dirname, '../../app/custom'))));

export default app;
