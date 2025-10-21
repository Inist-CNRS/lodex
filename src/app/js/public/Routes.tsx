import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';

import Container from '@mui/material/Container';
import { ToastContainer } from 'react-toastify';
import { initializeLanguage } from '../i18n';
import Login from '../user/Login';
import { default as CustomPage } from './CustomPage';
import Home from './Home';
import ScrollToTop from './ScrollToTop';
import Version from './Version';
import { default as Breadcrumb } from './breadcrumb/Breadcrumb';
import { loadDisplayConfig } from './displayConfig/reducer';
import GraphPage from './graph/GraphPage';
import { default as NavBar } from './menu/NavBar';
import { loadMenu } from './menu/reducer';
import Resource from './resource/Resource';
import { fromMenu } from './selectors';

const notLogin = new RegExp('^(?!.*(/login)).*$');

interface RoutesProps {
    customRoutes?: string[];
    loadMenu(...args: unknown[]): unknown;
    loadDisplayConfig(...args: unknown[]): unknown;
    initializeLanguage(...args: unknown[]): unknown;
    history: object;
    tenant?: string;
}

const Routes = (props: RoutesProps) => {
    const [search, setSearch] = useState(false);

    useEffect(() => {
        props.loadMenu();
        props.loadDisplayConfig();
        props.initializeLanguage();
    }, []);

    const { customRoutes, tenant } = props;
    if (!customRoutes) {
        return null;
    }

    const handleSearchWithDataset = () => {
        setSearch(true);
    };

    const handleCloseSearch = () => {
        setSearch(false);
    };

    return (
        <>
            <ScrollToTop />
            {/*
         // @ts-expect-error TS2769 */}
            <Route path={notLogin} component={Breadcrumb} />
            <div id="content">
                <Container maxWidth="xl" className="container">
                    <Route
                        path="/"
                        exact
                        // @ts-expect-error TS2322
                        render={(props) => <Home {...props} tenant={tenant} />}
                    />
                    <Route
                        path="/resource"
                        render={(props) => (
                            // @ts-expect-error TS2322
                            <Resource {...props} tenant={tenant} />
                        )}
                    />
                    <Route
                        path="/ark:/:naan/:rest"
                        render={(props) => (
                            // @ts-expect-error TS2322
                            <Resource {...props} tenant={tenant} />
                        )}
                    />
                    <Route
                        path="/uid:/:uri"
                        render={(props) => (
                            <Resource {...props} tenant={tenant} />
                        )}
                    />
                    <Route
                        path="/graph/:name"
                        render={(props) => (
                            <GraphPage
                                {...props}
                                // @ts-expect-error TS2322
                                onSearch={handleSearchWithDataset}
                                tenant={tenant}
                            />
                        )}
                    />

                    <Route path="/login" component={Login} />

                    {customRoutes.map((link) => (
                        <Route
                            key={link}
                            exact
                            path={link}
                            component={CustomPage}
                        />
                    ))}
                </Container>

                <ToastContainer
                    position="bottom-left"
                    autoClose={5000}
                    hideProgressBar
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="colored"
                    style={{
                        bottom: '72px',
                    }}
                />
            </div>
            {/* Nav Bar and version footer */}
            <Route
                // @ts-expect-error TS2769
                path={notLogin}
                render={(props) => (
                    <NavBar
                        {...props}
                        // @ts-expect-error TS2322
                        search={search}
                        closeSearch={handleCloseSearch}
                    />
                )}
            />
            <Version />
        </>
    );
};

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    customRoutes: fromMenu.getCustomRoutes(state),
});

const mapDispatchToProps = {
    loadMenu,
    loadDisplayConfig,
    initializeLanguage,
};

export default connect(mapStateToProps, mapDispatchToProps)(Routes);
