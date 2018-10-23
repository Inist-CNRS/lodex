import React from 'react';
import PropTypes from 'prop-types';

import FetchFold from './FetchFold';
import { getIssueData } from './getIstexData';
import { searchedFieldValues } from './IstexSummaryAdmin';
import { polyglot as polyglotPropTypes } from '../../propTypes';

const VolumeFold = ({
    item: { name: volume, count },
    issn,
    year,
    searchedField,
    children,
    polyglot,
}) => (
    <FetchFold
        label={`${polyglot.t('volume')}: ${volume}`}
        count={count}
        volume={volume}
        polyglot={polyglot}
        getData={getIssueData({
            issn,
            year,
            volume: volume,
            searchedField,
        })}
    >
        {children}
    </FetchFold>
);

VolumeFold.propTypes = {
    item: PropTypes.shape({
        name: PropTypes.string.isRequired,
        count: PropTypes.number.isRequired,
    }).isRequired,
    issn: PropTypes.string.isRequired,
    year: PropTypes.string.isRequired,
    searchedField: PropTypes.oneOf(searchedFieldValues),
    children: PropTypes.func.isRequired,
    polyglot: polyglotPropTypes.isRequired,
};

export default VolumeFold;
