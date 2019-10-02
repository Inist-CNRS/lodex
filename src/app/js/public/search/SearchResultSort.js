import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { field as fieldProptypes } from '../../propTypes';
import SortButton from '../../lib/components/SortButton';

const SearchResultSort = ({ fields, fieldNames }) => {
    const titleField = fields.find(field => field.name === fieldNames.title);
    const descriptionField = fields.find(
        field => field.name === fieldNames.description,
    );

    const [sortBy, setSortBy] = useState('');
    const sortDir = 'ASC';

    const handleSort = name => {
        console.log('sort - ', name);
        setSortBy(name);
    };

    return (
        <div>
            {titleField && (
                <SortButton
                    className={`sort_${fieldNames.title}`}
                    name={fieldNames.title}
                    label={titleField.label}
                    sort={handleSort}
                    sortBy={sortBy}
                    sortDir={sortDir}
                />
            )}
            {descriptionField && (
                <SortButton
                    className={`sort_${fieldNames.description}`}
                    name={fieldNames.description}
                    label={descriptionField.label}
                    sort={handleSort}
                    sortBy={sortBy}
                    sortDir={sortDir}
                />
            )}
        </div>
    );
};

SearchResultSort.propTypes = {
    fields: PropTypes.arrayOf(fieldProptypes).isRequired,
    fieldNames: PropTypes.shape({
        uri: PropTypes.string,
        title: PropTypes.string,
        description: PropTypes.string,
    }).isRequired,
};

export default SearchResultSort;
