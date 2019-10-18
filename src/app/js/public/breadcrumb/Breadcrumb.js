import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';

import theme from '../../theme';
import { fromBreadcrumb } from '../selectors';
import BreadcrumbItem from './BreadcrumbItem';
import stylesToClassname from '../../lib/stylesToClassName';

const styles = stylesToClassname(
    {
        root: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
        },
        icon: {
            color: theme.green.primary,
            margin: '5px 0px',
        },
        trail: {
            margin: '5px 0px',
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
        <div className={styles.root}>
            <FontAwesomeIcon
                className={styles.icon}
                icon={faAngleLeft}
                height={20}
            />
            <div className={styles.trail}>
                {items.map((item, index) => (
                    <>
                        <BreadcrumbItem
                            key={index}
                            value={item}
                            className={styles.item}
                        />
                        {index + 1 < items.length && <span>/</span>}
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
