import React from 'react';
import PropTypes from 'prop-types';

import { field as fieldPropTypes } from '../../propTypes';
import MenuItem from './MenuItem';

const AdvancedPage = ({ advancedMenu, closeDrawer, ...rest }) => (
    <div>
        {advancedMenu.map((config, index) => (
            <MenuItem key={index} config={config} {...rest} />
        ))}
    </div>
);

AdvancedPage.propTypes = {
    advancedMenu: PropTypes.arrayOf(fieldPropTypes).isRequired,
    closeDrawer: PropTypes.func.isRequired,
};

export default AdvancedPage;
