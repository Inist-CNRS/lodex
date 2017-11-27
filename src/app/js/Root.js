import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const Root = ({ store, routes, history }) => (
    <Provider {...{ store }}>
        <MuiThemeProvider>
            <Router {...{ history, routes }} />
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
