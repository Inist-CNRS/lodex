import React from 'react';
import PropTypes from 'prop-types';

import FetchFold from './FetchFold';
import { getDecadeYearData } from './getIstexData';
import { searchedFieldValues, yearSortDirValues } from './IstexSummaryAdmin';
import { polyglot as polyglotPropTypes } from '../../propTypes';

const DecadeFold = ({
    issn,
    item: {
        name: { from, to },
        count,
    },
    searchedField,
    sortDir,
    polyglot,
    children,
}) => (
    <FetchFold
        label={
            sortDir === yearSortDirValues[0] ? `${to}-${from}` : `${from}-${to}`
        }
        count={count}
        from={from}
        to={to}
        polyglot={polyglot}
        getData={getDecadeYearData({
            issn,
            from,
            to,
            searchedField,
            sortDir,
        })}
    >
        {children}
    </FetchFold>
);

DecadeFold.propTypes = {
    issn: PropTypes.string.isRequired,
    item: PropTypes.shape({
        name: PropTypes.string.isRequired,
        count: PropTypes.number.isRequired,
    }).isRequired,
    searchedField: PropTypes.oneOf(searchedFieldValues),
    sortDir: PropTypes.oneOf(yearSortDirValues),
    children: PropTypes.func.isRequired,
    polyglot: polyglotPropTypes.isRequired,
};

export default DecadeFold;
