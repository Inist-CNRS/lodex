import React from 'react';
import PropTypes from 'prop-types';

import SearchResultPlaceholder from './SearchResultPlaceholder';

const SearchResultPlaceholders = ({ className, results }) => (
    <div className={className}>
        {Array.from({ length: results }, (_, i) => (
            <SearchResultPlaceholder key={i} />
        ))}
    </div>
);

SearchResultPlaceholders.propTypes = {
    className: PropTypes.string,
    results: PropTypes.number,
};

SearchResultPlaceholders.defaultProps = {
    className: null,
    results: 8,
};

export default SearchResultPlaceholders;
