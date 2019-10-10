import React from 'react';
import PropTypes from 'prop-types';

import MenuItem from './MenuItem';

const AdvancedPage = ({ advancedMenu, ...rest }) => (
    <div>
        {advancedMenu.map((config, index) => (
            <MenuItem key={index} config={config} {...rest} />
        ))}
    </div>
);

AdvancedPage.propTypes = {
    advancedMenu: PropTypes.arrayOf(
        PropTypes.shape({
            role: PropTypes.oneOf([
                'home',
                'resources',
                'graphs',
                'search',
                'admin',
                'sign-in',
                'sign-out',
                'custom',
                'share_export',
            ]),
            label: PropTypes.shape({
                en: PropTypes.string.isRequired,
                fr: PropTypes.string.isRequired,
            }).isRequired,
            icon: PropTypes.string.isRequired,
            link: PropTypes.shape({
                startsWith: PropTypes.func.isRequired,
            }),
        }).isRequired,
    ).isRequired,
};

export default AdvancedPage;
