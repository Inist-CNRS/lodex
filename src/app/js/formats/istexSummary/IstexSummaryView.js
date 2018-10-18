import React from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';

import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../../propTypes';
import injectData from '../injectData';
import InvalidFormat from '../InvalidFormat';
import { getYearUrl, parseYearData } from './getIstexData';
import { searchedFieldValues } from './IstexSummaryAdmin';
import composeRenderProps from '../../lib/composeRenderProps';
import IstexList from './IstexList';
import IssueFold from './IssueFold';
import VolumeFold from './VolumeFold';
import YearFold from './YearFold';
import IstexItem from '../istex/IstexItem';

const FoldList = props => <IstexList {...props} />;
const IstexDocument = ({ item }) => <IstexItem {...item} />;
IstexDocument.propTypes = {
    item: PropTypes.shape({ id: PropTypes.string.isRequired }).isRequired,
};

export const IstexSummaryView = ({
    formatData,
    field,
    resource,
    searchedField,
    p: polyglot,
}) => {
    if (!resource[field.name] || !searchedField) {
        return (
            <InvalidFormat format={field.format} value={resource[field.name]} />
        );
    }

    return composeRenderProps(
        <FoldList
            data={parseYearData(formatData)}
            issn={resource[field.name]}
            searchedField={searchedField}
            polyglot={polyglot}
        />,
        [
            YearFold,
            FoldList,
            VolumeFold,
            FoldList,
            IssueFold,
            FoldList,
            IstexDocument,
        ],
    );
};

IstexSummaryView.propTypes = {
    fieldStatus: PropTypes.string,
    resource: PropTypes.object.isRequired, // eslint-disable-line
    field: fieldPropTypes.isRequired,
    formatData: PropTypes.shape({}),
    error: PropTypes.string,
    searchedField: PropTypes.oneOf(searchedFieldValues),
    p: polyglotPropTypes.isRequired,
};

IstexSummaryView.defaultProps = {
    className: null,
    fieldStatus: null,
    shrink: false,
    data: null,
    error: null,
};

export default compose(injectData(getYearUrl), translate)(IstexSummaryView);
