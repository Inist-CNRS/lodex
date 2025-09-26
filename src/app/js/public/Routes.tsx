import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
// @ts-expect-error TS7016
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

// @ts-expect-error TS7006
const Routes = (props) => {
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
            <Route path={notLogin} component={Breadcrumb} />

            <div id="content">
                <Container maxWidth="xl" className="container">
                    <Route
                        path="/"
                        exact
                        // @ts-expect-error TS7006
                        render={(props) => <Home {...props} tenant={tenant} />}
                    />
                    <Route
                        path="/resource"
                        // @ts-expect-error TS7006
                        render={(props) => (
                            <Resource {...props} tenant={tenant} />
                        )}
                    />
                    <Route
                        path="/ark:/:naan/:rest"
                        // @ts-expect-error TS7006
                        render={(props) => (
                            <Resource {...props} tenant={tenant} />
                        )}
                    />
                    <Route
                        path="/uid:/:uri"
                        // @ts-expect-error TS7006
                        render={(props) => (
                            <Resource {...props} tenant={tenant} />
                        )}
                    />
                    <Route
                        path="/graph/:name"
                        // @ts-expect-error TS7006
                        render={(props) => (
                            <GraphPage
                                {...props}
                                onSearch={handleSearchWithDataset}
                                tenant={tenant}
                            />
                        )}
                    />

                    <Route path="/login" component={Login} />

                    {/*
                     // @ts-expect-error TS7006 */}
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
                path={notLogin}
                // @ts-expect-error TS7006
                render={(props) => (
                    <NavBar
                        {...props}
                        search={search}
                        closeSearch={handleCloseSearch}
                    />
                )}
            />

            <Version />
        </>
    );
};

Routes.propTypes = {
    customRoutes: PropTypes.arrayOf(PropTypes.string),
    loadMenu: PropTypes.func.isRequired,
    loadDisplayConfig: PropTypes.func.isRequired,
    initializeLanguage: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    tenant: PropTypes.string,
};

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    // @ts-expect-error TS2339
    customRoutes: fromMenu.getCustomRoutes(state),
});

const mapDispatchToProps = {
    loadMenu,
    loadDisplayConfig,
    initializeLanguage,
};

export default connect(mapStateToProps, mapDispatchToProps)(Routes);
