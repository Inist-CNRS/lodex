import React from 'react';
import PropTypes from 'prop-types';

import { field as fieldPropTypes } from '../../propTypes';
import injectData from '../injectData';
import IstexYear from './IstexYear';
import InvalidFormat from '../InvalidFormat';
import { getYearUrl, parseYearData } from './getIstexData';
import { searchedFieldValues } from './IstexSummaryAdmin';
import IstexList from './IstexList';

export const IstexSummaryView = ({
    formatData,
    field,
    resource,
    searchedField,
}) => {
    if (!resource[field.name] || !searchedField) {
        return (
            <InvalidFormat format={field.format} value={resource[field.name]} />
        );
    }

    return (
        <IstexList data={parseYearData(formatData)}>
            {({ name, count }) => (
                <IstexYear
                    issn={resource[field.name]}
                    year={name}
                    count={count}
                    searchedField={searchedField}
                />
            )}
        </IstexList>
    );
};

IstexSummaryView.propTypes = {
    fieldStatus: PropTypes.string,
    resource: PropTypes.object.isRequired, // eslint-disable-line
    field: fieldPropTypes.isRequired,
    formatData: PropTypes.shape({}),
    error: PropTypes.string,
    searchedField: PropTypes.oneOf(searchedFieldValues),
};

IstexSummaryView.defaultProps = {
    className: null,
    fieldStatus: null,
    shrink: false,
    data: null,
    error: null,
};

export default injectData(getYearUrl)(IstexSummaryView);
