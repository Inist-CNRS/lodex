import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import Drawer from './Drawer';
import Search from './search/Search';

export const AppComponent = ({ children }) => (
    <Fragment>
        <div className="body">{children}</div>
        <Drawer>
            {({ closeDrawer }) => <Search closeDrawer={closeDrawer} />}
        </Drawer>
    </Fragment>
);

AppComponent.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AppComponent;
