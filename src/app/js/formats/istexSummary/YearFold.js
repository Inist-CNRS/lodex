import React from 'react';
import PropTypes from 'prop-types';

import FetchFold from './FetchFold';
import { getVolumeData } from './getIstexData';
import { SEARCHED_FIELD_VALUES } from './constants';
import { polyglot as polyglotPropTypes } from '../../propTypes';

const YearFold = ({
    value,
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
