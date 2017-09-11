import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import DocumentTitle from 'react-document-title';

const Root = ({ store, routes }) => {
    const history = syncHistoryWithStore(browserHistory, store);

    return (
        <DocumentTitle title={/https?:\/\/([\w-]+)/.exec(process.env.PUBLIC_URL)[1]}>
            <Provider {...{ store }}>
                <Router {...{ history, routes }} />
            </Provider>
        </DocumentTitle>
    );
};

Root.propTypes = {
    routes: PropTypes.object.isRequired, // eslint-disable-line
    store: PropTypes.object.isRequired, // eslint-disable-line
};

export default Root;
