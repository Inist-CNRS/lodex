import React from 'react';
import PropTypes from 'prop-types';

import FetchFold from './FetchFold';
import { getDecadeYearData } from './getIstexData';
import { SEARCHED_FIELD_VALUES, SORT_YEAR_VALUES } from './constants';
import { polyglot as polyglotPropTypes } from '../../propTypes';

const DecadeFold = ({
    value,
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
        label={`${from}-${to}`}
        count={count}
        from={from}
        to={to}
        polyglot={polyglot}
        getData={getDecadeYearData({
            value,
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
    value: PropTypes.string.isRequired,
    item: PropTypes.shape({
        name: PropTypes.string.isRequired,
        count: PropTypes.number.isRequired,
    }).isRequired,
    searchedField: PropTypes.oneOf(SEARCHED_FIELD_VALUES),
    sortDir: PropTypes.oneOf(SORT_YEAR_VALUES),
    children: PropTypes.func.isRequired,
    polyglot: polyglotPropTypes.isRequired,
};

export default DecadeFold;
