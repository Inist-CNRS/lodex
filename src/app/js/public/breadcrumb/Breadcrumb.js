import React from 'react';
import PropTypes from 'prop-types';

import BreadcrumbItem from './BreadcrumbItem';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { breadcrumb } from '../../../../api/controller/api/breadcrumb';
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
    if (
        !breadcrumb ||
        breadcrumb.length == 0 ||
        (breadcrumb.length == 1 && isRoot)
    ) {
        return null;
    }
    const items = [...breadcrumb];
    const lastItem = items.pop();

    return (
        <div>
            <div className={styles.trail}>
                {items.map((item, index) => (
                    <>
                        <BreadcrumbItem key={index} value={item} />
                        {items.length - 1 == index && isRoot ? null : '>'}
                    </>
                ))}
                {!isRoot ? (
                    <BreadcrumbItem
                        key={breadcrumb.length - 1}
                        value={lastItem}
                    />
                ) : null}
            </div>
        </div>
    );
};

Breadcrumb.propTypes = {
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
    }).isRequired,
    p: polyglotPropTypes.isRequired,
};

export default Breadcrumb;
