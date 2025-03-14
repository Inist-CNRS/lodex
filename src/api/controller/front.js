/* eslint-disable no-useless-escape */
import { StyleSheetServer } from 'aphrodite/no-important';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router';

import { auth, istexApiUrl, jsHost, mongo, themesHost } from 'config';
import { createMemoryHistory } from 'history';
import jsonwebtoken from 'jsonwebtoken';
import Koa from 'koa';
import jwt from 'koa-jwt';
import mount from 'koa-mount';
import route from 'koa-route';
import serve from 'koa-static';
import pick from 'lodash/pick';
import path from 'path';
import { END } from 'redux-saga';

import configureStoreServer from '../../app/js/configureStoreServer';
import reducers from '../../app/js/public/reducers';
import Routes from '../../app/js/public/Routes';
import sagas from '../../app/js/public/sagas';
import getLocale from '../../common/getLocale';
import translations from '../services/translations';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Router } from 'react-router-dom';
import getCatalogFromArray from '../../common/fields/getCatalogFromArray.js';
import { DEFAULT_TENANT } from '../../common/tools/tenantTools';
import { renderAdmin, renderPublic, renderRootAdmin } from '../models/front';
import { getPublication } from './api/publication';

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
    i18n: {
        locale,
        phrases: translations.getByLanguage(locale),
    },
    user: {
        token,
        cookie,
    },
    breadcrumb: ctx.configTenant.breadcrumb,
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

const queryClient = new QueryClient();

export const getPreloadedState = async (
    unConnectedHistory,
    token,
    cookie,
    locale,
    url,
    ctx,
) => {
    const { store, history } = configureStoreServer(
        reducers,
        sagas,
        await getInitialState(token, cookie, locale, ctx),
        unConnectedHistory,
    );

    const sagaPromise = store.runSaga(sagas).done;
    const context = {};
    StyleSheetServer.renderStatic(() =>
        renderToString(
            <StaticRouter location={url} context={context}>
                <Provider {...{ store }}>
                    <QueryClientProvider client={queryClient}>
                        <Router history={history}>
                            <Routes history={history} tenant={ctx.tenant} />
                        </Router>
                    </QueryClientProvider>
                </Provider>
            </StaticRouter>,
        ),
    );
    store.dispatch(END);
    await sagaPromise;

    if (context.url) {
        return {
            redirect: context.url,
        };
    }

    const preloadedState = store.getState();

    return {
        preloadedState: {
            ...preloadedState,
            user: {
                token: null,
            },
        },
    };
};

const handleRender = async (ctx, next) => {
    const { url } = ctx.request;
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

    const { preloadedState, redirect } = await getPreloadedState(
        history,
        ctx.state.headerToken,
        ctx.request.header.cookie,
        getLocale(ctx),
        url,
        ctx,
    );

    if (redirect) {
        return ctx.redirect(redirect);
    }

    let customTemplateVariables = {};
    if (ctx.configTenant.front && ctx.configTenant.front.theme) {
        customTemplateVariables = ctx.configTenant.front.theme;
    }

    const antiSpamFilterConfig = ctx.configTenant.antispamFilter || {};
    const recaptchaClientKeyConfig =
        antiSpamFilterConfig?.recaptchaClientKey?.trim();
    const recaptchaSecretKeyConfig =
        antiSpamFilterConfig?.recaptchaSecretKey?.trim();

    const recaptchaClientKey =
        antiSpamFilterConfig?.active &&
        recaptchaClientKeyConfig &&
        recaptchaSecretKeyConfig
            ? recaptchaClientKeyConfig
            : null;

    renderPublic(ctx.configTenant.theme, {
        preload: JSON.stringify(preloadedState),
        tenant: ctx.tenant,
        jsHost: jsHost,
        themesHost: themesHost,
        istexApi: istexApiUrl,
        customTemplateVariables,
        recaptchaClientKey,
    }).then((html) => {
        // If recaptcha is enabled for this instance we inject it just before the closing body tag
        ctx.body = recaptchaClientKey
            ? html.replace(
                  '</body>',
                  `<script>window.RECAPTCHA_CLIENT_KEY="${recaptchaClientKey}";</script>
<script src="https://www.google.com/recaptcha/api.js?render=${recaptchaClientKey}"></script>
</body>`,
              )
            : html;
    });
};

const renderAdminIndexHtml = (ctx) => {
    renderAdmin({
        tenant: ctx.tenant,
        dbName: mongo.dbName,
        jsHost: jsHost,
        themesHost: themesHost,
    }).then((html) => {
        ctx.body = html;
    });
};

const renderRootAdminIndexHtml = (ctx) => {
    renderRootAdmin({
        tenant: ctx.tenant,
        dbName: mongo.dbName,
        jsHost: jsHost,
        themesHost: themesHost,
    }).then((html) => {
        ctx.body = html;
    });
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
    route.get('/instances(.*)', async (ctx) => {
        renderRootAdminIndexHtml(ctx);
    }),
);

app.use(handleRender);

app.use(
    route.get('/instance/:slug/admin', async (ctx) => {
        renderAdminIndexHtml(ctx);
    }),
);

app.use(mount('/', serve(path.resolve(__dirname, '../../build'))));
app.use(mount('/', serve(path.resolve(__dirname, '../../app/custom'))));

export default app;
