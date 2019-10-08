import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import { fromBreadcrumb } from '../selectors';
import BreadcrumbItem from './BreadcrumbItem';
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

export const Breadcrumb = ({ breadcrumb, location }) => {
    const isRoot = location.pathname === '/';

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
    breadcrumb: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.shape({
                label: PropTypes.shape({
                    en: PropTypes.string.isRequired,
                    fr: PropTypes.string.isRequired,
                }).isRequired,
                url: PropTypes.string.isRequired,
            }),
        }),
    ),
};

const mapStateToProps = state => {
    return {
        breadcrumb: fromBreadcrumb.getBreadcrumb(state),
    };
};

export default compose(connect(mapStateToProps))(Breadcrumb);
