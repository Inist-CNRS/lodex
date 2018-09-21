import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import scrollToTop from './lib/scrollToTop';
import { ConnectedRouter } from 'connected-react-router';

const Root = ({ store, routes, history }) => (
    <Provider {...{ store }}>
        <MuiThemeProvider>
            <ConnectedRouter history={history} onUpdate={scrollToTop}>
                {routes}
            </ConnectedRouter>
        </MuiThemeProvider>
    </Provider>
);

Root.propTypes = {
    admin: PropTypes.bool,
    routes: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};

export default Root;
