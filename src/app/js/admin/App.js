import React, { PropTypes } from 'react';
import AppBar from './Appbar';
import { Helmet } from 'react-helmet';

export const AppComponent = ({ children }) => (
    <div>
        <Helmet>
            <title>{/https?:\/\/([\w-]+)/.exec(process.env.EZMASTER_PUBLIC_URL)[1]}</title>
        </Helmet>
        <AppBar />

        <div className="body">
            {children}
        </div>
    </div>
);

AppComponent.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AppComponent;
