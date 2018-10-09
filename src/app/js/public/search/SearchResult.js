import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { StyleSheet, css } from 'aphrodite/no-important';
import { Link } from 'react-router-dom';

import { getResourceUri } from '../../../../common/uris';

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        padding: '1rem 0',
        borderTop: '2px solid black',
        textDecoration: 'none !important',
        color: 'black',
        ':hover': {
            color: 'black',
            backgroundColor: '#f8f8f8',
        },
    },
    row: {
        flex: '0 0 auto',
    },
    title: {
        flex: '0 0 auto',
        fontWeight: 'bold',
        marginBottom: '.75rem',
    },
    description: {
        flex: '0 0 auto',
        marginBottom: '.75rem',
    },
    details: {
        display: 'flex',
        flex: '0 0 auto',
        fontSize: 'smaller',
        color: '#555',
    },
    detailsColumn: {
        flex: '1 0 0',
        paddingRight: '1rem',
    },
});

const cnames = (name, ...classes) => classnames(name, ...classes.map(css));

const SearchResult = ({ result }) => (
    <Link
        id={`search-result-${result.uri}`}
        to={getResourceUri(result)}
        className={cnames('search-result', styles.container)}
    >
        {result.title && (
            <div className={cnames('search-result-title', styles.title)}>
                {result.title}
            </div>
        )}
        {result.description && (
            <div
                className={cnames(
                    'search-result-description',
                    styles.description,
                )}
            >
                {result.description}
            </div>
        )}
        <div className={cnames('search-result-details', styles.details)}>
            <div
                className={cnames(
                    'search-result-detail1',
                    styles.detailsColumn,
                )}
            >
                BMJ
            </div>
            <div
                className={cnames(
                    'search-result-detail2',
                    styles.detailsColumn,
                )}
            >
                0393-2990
            </div>
        </div>
    </Link>
);

SearchResult.propTypes = {
    result: PropTypes.shape({
        uri: PropTypes.string.isRequired,
        title: PropTypes.string,
        description: PropTypes.string,
    }).isRequired,
};

export default SearchResult;
