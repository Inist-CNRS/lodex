import React from 'react';
import PropTypes from 'prop-types';

import FetchFold from './FetchFold';
import { getVolumeData } from './getIstexData';
import { SEARCHED_FIELD_VALUES } from './constants';
import { polyglot as polyglotPropTypes } from '../../../propTypes';

const YearFold = ({
    // @ts-expect-error TS7031
    value,
    // @ts-expect-error TS7031
    item: { name: year, count },
    // @ts-expect-error TS7031
    searchedField,
    // @ts-expect-error TS7031
    polyglot,
    // @ts-expect-error TS7031
    children,
}) => (
    <FetchFold
        // @ts-expect-error TS2769
        label={year}
        count={count}
        year={year}
        polyglot={polyglot}
        getData={getVolumeData({
            value,
            year,
            searchedField,
        })}
    >
        {children}
    </FetchFold>
);

YearFold.propTypes = {
    value: PropTypes.string.isRequired,
    item: PropTypes.shape({
        name: PropTypes.string.isRequired,
        count: PropTypes.number.isRequired,
    }).isRequired,
    searchedField: PropTypes.oneOf(SEARCHED_FIELD_VALUES),
    children: PropTypes.func.isRequired,
    polyglot: polyglotPropTypes.isRequired,
};

export default YearFold;
