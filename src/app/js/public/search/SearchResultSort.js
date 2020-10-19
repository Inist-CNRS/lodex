import React from 'react';
import PropTypes from 'prop-types';

import { field as fieldPropTypes } from '../../propTypes';
import SortButton from '../../lib/components/SortButton';

export const getSortableFieldNames = fieldNames =>
    [
        fieldNames.title,
        fieldNames.description,
        fieldNames.detail1,
        fieldNames.detail2,
    ].filter(x => !!x);

export const getSortableFields = (fields, sortedFieldNames) =>
    fields
        .filter(field => sortedFieldNames.includes(field.name))
        .sort(
            (fieldA, fieldB) =>
                sortedFieldNames.indexOf(fieldA.name) -
                sortedFieldNames.indexOf(fieldB.name),
        );

const SearchResultSort = ({ fields, fieldNames, sort, sortBy, sortDir }) => {
    const sortableFieldNames = getSortableFieldNames(fieldNames);
    const sortableFields = getSortableFields(fields, sortableFieldNames);

    const handleSort = name => {
        sort({ sortBy: name });
    };

    return (
        <>
            {sortableFields.map(field => (
                <SortButton
                    key={field.name}
                    className={`sort_${field.name}`}
                    name={field.name}
                    sort={() => handleSort(field.name)}
                    sortBy={sortBy}
                    sortDir={sortDir}
                >
                    {field.label}
                </SortButton>
            ))}
        </>
    );
};

SearchResultSort.propTypes = {
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    fieldNames: PropTypes.shape({
        uri: PropTypes.string,
        title: PropTypes.string,
        description: PropTypes.string,
        detail1: PropTypes.string,
        detail2: PropTypes.string,
    }).isRequired,
    sortBy: PropTypes.string,
    sortDir: PropTypes.oneOf(['ASC', 'DESC']),
    sort: PropTypes.func.isRequired,
};

export default SearchResultSort;
