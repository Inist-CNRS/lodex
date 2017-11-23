import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { createHashHistory } from 'history';

const Root = ({ store, routes, admin = false }) => {
    const history = syncHistoryWithStore(
        admin ? createHashHistory() : browserHistory,
        store,
    );
    return (
        <Provider {...{ store }}>
            <MuiThemeProvider>
                <Router {...{ history, routes }} />
            </MuiThemeProvider>
        </Provider>
    );
};

Root.propTypes = {
    admin: PropTypes.bool,
    routes: PropTypes.object.isRequired, // eslint-disable-line
    store: PropTypes.object.isRequired, // eslint-disable-line
};

export default Root;
