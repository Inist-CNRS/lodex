import React from 'react';
import PropTypes from 'prop-types';

import FetchFold from '../istexSummary/FetchFold';
import { getCitationDocumentData } from './getIstexCitationData';
import { SEARCHED_FIELD_VALUES } from '../istexSummary/constants';
import { polyglot as polyglotPropTypes } from '../../../propTypes';

const JournalFold = ({
    item: { name, count },
    value,
    searchedField,
    polyglot,
    children,
    documentSortBy,
}) => (
    <FetchFold
        label={name}
        skip={name === 'other'}
        count={count}
        name={name}
        polyglot={polyglot}
        getData={getCitationDocumentData({
            value,
            name,
            searchedField,
            documentSortBy,
        })}
    >
        {children}
    </FetchFold>
);

JournalFold.propTypes = {
    item: PropTypes.shape({
        name: PropTypes.string.isRequired,
        count: PropTypes.number.isRequired,
    }).isRequired,
    value: PropTypes.string.isRequired,
    searchedField: PropTypes.oneOf(SEARCHED_FIELD_VALUES),
    children: PropTypes.func.isRequired,
    polyglot: polyglotPropTypes.isRequired,
    documentSortBy: PropTypes.string.isRequired,
};

export default JournalFold;
