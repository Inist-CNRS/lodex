import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { field as fieldProptypes } from '../../propTypes';
import SortButton from '../../lib/components/SortButton';

const getSortableFields = (fields, fieldNames) => {
    const {
        titleField,
        descriptionField,
        firstDetailField,
        secondDetailField,
    } = fields.reduce((acc, cur) => {
        switch (cur.name) {
            case fieldNames.title:
                acc.titleField = cur;
                break;
            case fieldNames.description:
                acc.descriptionField = cur;
                break;
            case fieldNames.detail1:
                acc.firstDetailField = cur;
                break;
            case fieldNames.detail2:
                acc.secondDetailField = cur;
                break;
        }
        return acc;
    }, {});

    return [
        titleField,
        descriptionField,
        firstDetailField,
        secondDetailField,
    ].filter(x => !!x);
};

const SearchResultSort = ({ fields, fieldNames, sort, sortBy, sortDir }) => {
    const sortableFields = getSortableFields(fields, fieldNames);

    const handleSort = name => {
        sort({ sortBy: name });
    };

    return (
        <Fragment>
            {sortableFields.map(field => (
                <SortButton
                    key={field.name}
                    className={`sort_${field.name}`}
                    name={field.name}
                    label={field.label}
                    sort={() => handleSort(field.name)}
                    sortBy={sortBy}
                    sortDir={sortDir}
                />
            ))}
        </Fragment>
    );
};

SearchResultSort.propTypes = {
    fields: PropTypes.arrayOf(fieldProptypes).isRequired,
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
