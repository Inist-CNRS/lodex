import React from 'react';
import PropTypes from 'prop-types';

import FetchFold from './FetchFold';
import { getDecadeYearData } from './getIstexData';
import { searchedFieldValues } from './IstexSummaryAdmin';
import { polyglot as polyglotPropTypes } from '../../propTypes';

const DecadeFold = ({
    issn,
    item: { name: { from, to }, count },
    searchedField,
    polyglot,
    children,
}) => (
    <FetchFold
        label={`${from}-${to}`}
        count={count}
        issn={issn}
        from={from}
        to={to}
        searchedField={searchedField}
        polyglot={polyglot}
        getData={getDecadeYearData({
            issn,
            from,
            to,
            searchedField,
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
    children: PropTypes.func.isRequired,
    polyglot: polyglotPropTypes.isRequired,
};

export default DecadeFold;
