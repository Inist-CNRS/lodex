import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { field as fieldProptypes } from '../../propTypes';
import SortButton from '../../lib/components/SortButton';

const SearchResultSort = ({ fields, fieldNames, sort, sortBy, sortDir }) => {
    const titleField = fields.find(field => field.name === fieldNames.title);
    const descriptionField = fields.find(
        field => field.name === fieldNames.description,
    );

    const handleSort = name => {
        sort({ sortBy: name });
    };

    return (
        <Fragment>
            {titleField && (
                <SortButton
                    className={`sort_${fieldNames.title}`}
                    name={fieldNames.title}
                    label={titleField.label}
                    sort={() => handleSort(fieldNames.title)}
                    sortBy={sortBy}
                    sortDir={sortDir}
                />
            )}
            {descriptionField && (
                <SortButton
                    className={`sort_${fieldNames.description}`}
                    name={fieldNames.description}
                    label={descriptionField.label}
                    sort={() => handleSort(fieldNames.description)}
                    sortBy={sortBy}
                    sortDir={sortDir}
                />
            )}
        </Fragment>
    );
};

SearchResultSort.propTypes = {
    fields: PropTypes.arrayOf(fieldProptypes).isRequired,
    fieldNames: PropTypes.shape({
        uri: PropTypes.string,
        title: PropTypes.string,
        description: PropTypes.string,
    }).isRequired,
    sortBy: PropTypes.string,
    sortDir: PropTypes.oneOf(['ASC', 'DESC']),
    sort: PropTypes.func.isRequired,
};

export default SearchResultSort;
