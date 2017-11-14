import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';
import { match, RouterContext } from 'react-router';
import DocumentTitle from 'react-document-title';

const getPageTitle = (url) => {
    const match = /https?:\/\/([\w-]+)/.exec(url);

    if (!match) {
        return 'lodex dev';
    }

    return match[1];
};

const Root = ({ store, routes }) => {
    const pageTitle = getPageTitle(process.env.PUBLIC_URL);
    return (
        <DocumentTitle title={pageTitle}>
            <Provider {...{ store, history: browserHistory }}>
                <Router {...{ routes }} />
            </Provider>
        </DocumentTitle>
    );
};

Root.propTypes = {
    routes: PropTypes.object.isRequired, // eslint-disable-line
    store: PropTypes.object.isRequired, // eslint-disable-line
};

export default Root;
