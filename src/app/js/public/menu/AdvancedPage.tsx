import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import stylesToClassname from '../../lib/stylesToClassName';
import MenuItem from './MenuItem';

const styles = stylesToClassname(
    {
        root: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
    },
    'advanced-page',
);

// @ts-expect-error TS7031
const AdvancedPage = ({ advancedMenu, ...rest }) => (
    // @ts-expect-error TS2339
    <div className={classnames('advanced-page', styles.root)}>
        {/*
         // @ts-expect-error TS7006 */}
        {advancedMenu.map((config, index) => (
            // @ts-expect-error TS2739
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
