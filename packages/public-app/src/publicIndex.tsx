import '@babel/polyfill';
import { createBrowserHistory } from 'history';

import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import 'url-api-polyfill';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Router } from 'react-router-dom';
import configureStore from '@lodex/frontend-common/configureStore';
import { I18N } from '@lodex/frontend-common/i18n/I18NContext';
import LodexThemeProvider from './LodexThemeProvider';
import reducers from './reducers';
import Routes from './Routes';
import sagas from './sagas';
// @ts-expect-error TS2882
import 'react-toastify/ReactToastify.css';
import { AnnotationStorageProvider } from './annotation/annotationStorage';

// @ts-expect-error TS2339
const tenant = window.__TENANT__;
// Tab title suffix: the site title set in the theme configuration, else the tenant
// @ts-expect-error TS2339
const siteName: string = window.__SITE_TITLE__ || tenant;

const browserHistory = createBrowserHistory({
    basename: `/instance/${tenant}`,
});

sessionStorage.setItem('lodex-tenant', tenant);

const { store, history } = configureStore(
    reducers,
    sagas,
    // Rendered by the server, with the translations of the current locale (i18n.phrases)
    // @ts-expect-error TS2339
    window.__PRELOADED_STATE__,
    browserHistory,
);

const queryClient = new QueryClient();
const root = createRoot(document.getElementById('root')!);
root.render(
    <Provider {...{ store }}>
        <I18N>
            <QueryClientProvider client={queryClient}>
                <AnnotationStorageProvider>
                    <Router history={history}>
                        <LodexThemeProvider>
                            <Routes history={history} tenant={siteName} />
                        </LodexThemeProvider>
                    </Router>
                </AnnotationStorageProvider>
            </QueryClientProvider>
        </I18N>
    </Provider>,
);
