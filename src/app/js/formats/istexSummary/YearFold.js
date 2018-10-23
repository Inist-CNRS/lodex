import React from 'react';
import PropTypes from 'prop-types';

import FetchFold from './FetchFold';
import { getVolumeData } from './getIstexData';
import { searchedFieldValues } from './IstexSummaryAdmin';
import { polyglot as polyglotPropTypes } from '../../propTypes';

const YearFold = ({
    issn,
    item: { name: year, count },
    searchedField,
    polyglot,
    children,
}) => (
    <FetchFold
        label={year}
        count={count}
        year={year}
        polyglot={polyglot}
        getData={getVolumeData({
            issn,
            year,
            searchedField,
        })}
    >
        {children}
    </FetchFold>
);

YearFold.propTypes = {
    issn: PropTypes.string.isRequired,
    item: PropTypes.shape({
        name: PropTypes.string.isRequired,
        count: PropTypes.number.isRequired,
    }).isRequired,
    searchedField: PropTypes.oneOf(searchedFieldValues),
    children: PropTypes.func.isRequired,
    polyglot: polyglotPropTypes.isRequired,
};

export default YearFold;
