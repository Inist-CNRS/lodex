import React, { useEffect, useState } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ConnectedRouter } from 'connected-react-router';

import App from './App';
import Home from './Home';
import Resource from './resource/Resource';
import Login from '../user/Login';
import GraphPage from './graph/GraphPage';
import NavBar from './menu/NavBar';
import CustomPage from './CustomPage';
import { loadMenu } from './menu/reducer';
import { loadDisplayConfig } from './displayConfig/reducer';
import { fromMenu } from './selectors';
import scrollToTop from '../lib/scrollToTop';
import ScrollToTop from './ScrollToTop';
import Breadcrumb from './breadcrumb/Breadcrumb';
import { initializeLanguage } from '../i18n';

const notLogin = new RegExp('^(?!.*(/login)).*$');

const Routes = (props) => {
    const [search, setSearch] = useState(false);

    useEffect(() => {
        props.loadMenu();
        props.loadDisplayConfig();
        props.initializeLanguage();
    }, []);

    const { customRoutes, history } = props;
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
        <App>
            <ConnectedRouter history={history} onUpdate={scrollToTop}>
                <>
                    <ScrollToTop />
                    <Route path={notLogin} component={Breadcrumb} />
                    <Route
                        path={notLogin}
                        render={(props) => (
                            <NavBar
                                {...props}
                                search={search}
                                closeSearch={handleCloseSearch}
                            />
                        )}
                    />
                    <Route path="/" exact component={Home} />
                    <Route path="/resource" component={Resource} />
                    <Route path="/ark:/:naan/:rest" component={Resource} />
                    <Route path="/uid:/:uri" component={Resource} />
                    <Route path="/login" component={Login} />
                    <Route
                        path="/graph/:name"
                        render={(props) => (
                            <GraphPage
                                {...props}
                                onSearch={handleSearchWithDataset}
                            />
                        )}
                    />
                    {customRoutes.map((link) => (
                        <Route
                            key={link}
                            exact
                            path={link}
                            component={CustomPage}
                        />
                    ))}
                </>
            </ConnectedRouter>
        </App>
    );
};

Routes.propTypes = {
    customRoutes: PropTypes.arrayOf(PropTypes.string),
    loadMenu: PropTypes.func.isRequired,
    loadDisplayConfig: PropTypes.func.isRequired,
    initializeLanguage: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    customRoutes: fromMenu.getCustomRoutes(state),
});

const mapDispatchToProps = {
    loadMenu,
    loadDisplayConfig,
    initializeLanguage,
};

export default connect(mapStateToProps, mapDispatchToProps)(Routes);
