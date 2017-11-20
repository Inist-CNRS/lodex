import React, { PropTypes } from 'react';
import { Helmet } from 'react-helmet';

export const AppComponent = ({ children }) => (
    <div className="body">
        <Helmet>
            <title>{/https?:\/\/([\w-]+)/.exec(process.env.EZMASTER_PUBLIC_URL)[1]}</title>
        </Helmet>
        {children}
    </div>
);

AppComponent.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AppComponent;
