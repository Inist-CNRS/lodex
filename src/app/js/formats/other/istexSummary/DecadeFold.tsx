import React from 'react';
import PropTypes from 'prop-types';

import FetchFold from './FetchFold';
import { getDecadeYearData } from './getIstexData';
import { SEARCHED_FIELD_VALUES, SORT_YEAR_VALUES } from './constants';
import { polyglot as polyglotPropTypes } from '../../../propTypes';

const DecadeFold = ({
    // @ts-expect-error TS7031
    value,
    item: {
        // @ts-expect-error TS7031
        name: { from, to },
        // @ts-expect-error TS7031
        count,
    },
    // @ts-expect-error TS7031
    searchedField,
    // @ts-expect-error TS7031
    sortDir,
    // @ts-expect-error TS7031
    polyglot,
    // @ts-expect-error TS7031
    children,
}) => (
    <FetchFold
        // @ts-expect-error TS2769
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
