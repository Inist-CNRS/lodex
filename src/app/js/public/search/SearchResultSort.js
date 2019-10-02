import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { field as fieldProptypes } from '../../propTypes';
import SortButton from '../../lib/components/SortButton';
import { sortDataset as sortDatasetAction } from '../dataset';
import { fromDataset } from '../selectors';

const SearchResultSort = ({
    fields,
    fieldNames,
    sortDataset,
    sortBy,
    sortDir,
}) => {
    const titleField = fields.find(field => field.name === fieldNames.title);

    return (
        <div>
            {titleField && (
                <SortButton
                    className={`sort_${name}`}
                    sort={sortDataset}
                    name={fieldNames.title}
                    label={titleField}
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
    sortBy: PropTypes.string,
    sortDir: PropTypes.oneOf(['ASC', 'DESC']),
    sortDataset: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    ...fromDataset.getSort(state),
});

const mapDispatchToProps = {
    sortDataset: sortDatasetAction,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(SearchResultSort);
