import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

const Root = ({ store, routes }) => {
    const history = syncHistoryWithStore(browserHistory, store);

    return (
        <Provider {...{ store }}>
            <Router {...{ history, routes }} />
        </Provider>
    );
};

Root.propTypes = {
    routes: PropTypes.object.isRequired, // eslint-disable-line
    store: PropTypes.object.isRequired, // eslint-disable-line
};

export default Root;
