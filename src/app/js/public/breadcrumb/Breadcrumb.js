import React from 'react';
import PropTypes from 'prop-types';

import BreadcrumbItem from './BreadcrumbItem';
import { getBreadcrumb } from '../../../../api/controller/api/breadcrumb';
import stylesToClassname from '../../lib/stylesToClassName';
import theme from '../../theme';

const styles = stylesToClassname(
    {
        trail: {
            color: theme.green.primary,
            marginTop: 5,
        },
    },
    'breadcrumb',
);

const Breadcrumb = ({ location }) => {
    const isRoot = location.pathname === '/';
    const breadcrumb = getBreadcrumb();
    if (
        !breadcrumb ||
        breadcrumb.length == 0 ||
        (breadcrumb.length == 1 && isRoot)
    ) {
        return null;
    }
    const items = isRoot
        ? breadcrumb.slice(0, breadcrumb.length - 1)
        : breadcrumb;

    return (
        <div>
            <div className={styles.trail}>
                {items.map((item, index) => (
                    <>
                        <BreadcrumbItem key={index} value={item} />
                        {index + 1 < items.length ? '>' : null}
                    </>
                ))}
            </div>
        </div>
    );
};

Breadcrumb.propTypes = {
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
    }).isRequired,
};

export default Breadcrumb;
