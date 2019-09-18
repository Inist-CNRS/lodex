import React, { Component, Fragment } from 'react';
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
import { fromMenu } from './selectors';
import scrollToTop from '../lib/scrollToTop';
import CreateResource from './resource/CreateResource';
import ScrollToTop from './ScrollToTop';

const notLogin = new RegExp('^(?!.*(/login)).*$');

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
                        <ScrollToTop />
                        <Route path={notLogin} component={NavBar} />
                        <Route path="/" exact component={Home} />
                        <Route path="/resource" component={Resource} />
                        <Route path="/ark:/:naan/:rest" component={Resource} />
                        <Route path="/uid:/:uri" component={Resource} />
                        <Route path="/login" component={Login} />
                        <Route path="/graph" exact component={GraphPage} />
                        <Route path="/graph/:name" component={GraphPage} />
                        {customRoutes.map(link => (
                            <Route
                                key={link}
                                exact
                                path={link}
                                component={CustomPage}
                            />
                        ))}
                        <Route path={notLogin} component={CreateResource} />
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
