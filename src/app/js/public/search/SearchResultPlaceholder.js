import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import stylesToClassname from '../../lib/stylesToClassName';

const pulseKeyframes = {
    '0%': {
        opacity: '.5',
    },
    '50%': {
        opacity: '.1',
    },
    '100%': {
        opacity: '.5',
    },
};

const styles = stylesToClassname(
    {
        container: {
            display: 'flex',
            flexDirection: 'column',
            padding: '1rem',
            borderTop: '1px solid rgba(153, 153, 153, 0.2)',
            ':hover': {
                backgroundColor: '#f8f8f8',
            },
        },
        row: {
            flex: '0 0 auto',
        },
        title: {
            flex: '0 0 auto',
            marginBottom: '1rem',
        },
        description: {
            flex: '0 0 auto',
            marginBottom: '1rem',
        },
        details: {
            display: 'flex',
            flex: '0 0 auto',
        },
        detailsColumn: {
            flex: '9 0 0',
        },
        detailsSpacer: {
            flex: '1 0 0',
        },
        placeholder: {
            width: '100%',
            height: '1rem',
            backgroundColor: 'rgba(95, 99, 104, 0.5)',
            animationName: pulseKeyframes,
            animationDuration: '2s',
            animationIterationCount: 'infinite',
        },
    },
    'search-result-placeholder',
);

const Placeholder = ({ className }) => (
    <div className={classnames(styles.placeholder, className)} />
);

Placeholder.propTypes = {
    className: PropTypes.string,
};

const SearchResultPlaceholder = () => (
    <div className={styles.container}>
        <Placeholder className={styles.title} />
        <Placeholder className={styles.description} />
        <div className={styles.details}>
            <Placeholder className={styles.detailsColumn} />
            <div className={styles.detailsSpacer} />
            <Placeholder className={styles.detailsColumn} />
        </div>
    </div>
);

export default SearchResultPlaceholder;
