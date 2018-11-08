import React, { Component, Fragment } from 'react';
import { Route } from 'react-router-dom';
import { StyleSheet, css } from 'aphrodite/no-important';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ConnectedRouter } from 'connected-react-router';
import loadable from '@loadable/component';

import App from './App';
import Login from '../user/Login';
import NavBar from './menu/NavBar';
import { loadMenu } from './menu/reducer';
import { fromMenu } from './selectors';
import scrollToTop from '../lib/scrollToTop';

const notLogin = new RegExp('^(?!.*(/login)).*$');

const components = {
    Home: loadable(() => import(/* webpackChunkName: "home" */ './Home')),
    Resource: loadable(() =>
        import(/* webpackChunkName: "resource" */ './resource/Resource'),
    ),
    GraphPage: loadable(() =>
        import(/* webpackChunkName: "graph" */ './graph/GraphPage'),
    ),
    CustomPage: loadable(() =>
        import(/* webpackChunkName: "custom" */ './CustomPage'),
    ),
};

const styles = StyleSheet.create({
    container: {
        marginLeft: 110,
    },
});

class Routes extends Component {
    UNSAFE_componentWillMount() {
        this.props.loadMenu();
    }

    render() {
        const { customRoutes, history } = this.props;
        if (!customRoutes) {
            return null;
        }
        return (
            <App>
                <ConnectedRouter history={history} onUpdate={scrollToTop}>
                    <Fragment>
                        <Route path={notLogin} component={NavBar} />
                        <div className={css(styles.container)}>
                            <Route path="/" exact component={components.Home} />
                            <Route
                                path="/resource"
                                component={components.Resource}
                            />
                            <Route
                                path="/ark:/:naan/:rest"
                                component={components.Resource}
                            />
                            <Route
                                path="/uid:/:uri"
                                component={components.Resource}
                            />
                            <Route path="/login" component={Login} />
                            <Route
                                path="/graph"
                                exact
                                component={components.GraphPage}
                            />
                            <Route
                                path="/graph/:name"
                                component={components.GraphPage}
                            />
                            {customRoutes.map(link => (
                                <Route
                                    key={link}
                                    exact
                                    path={link}
                                    component={components.CustomPage}
                                />
                            ))}
                        </div>
                    </Fragment>
                </ConnectedRouter>
            </App>
        );
    }
}

Routes.propTypes = {
    customRoutes: PropTypes.arrayOf(PropTypes.string),
    loadMenu: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    customRoutes: fromMenu.getCustomRoutes(state),
});

const mapDispatchToProps = {
    loadMenu,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Routes);
