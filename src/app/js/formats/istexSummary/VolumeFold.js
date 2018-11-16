import React from 'react';
import PropTypes from 'prop-types';

import FetchFold from './FetchFold';
import { getIssueData } from './getIstexData';
import { SEARCHED_FIELD_VALUES } from './constants';
import { polyglot as polyglotPropTypes } from '../../propTypes';

const VolumeFold = ({
    item: { name: volume, count },
    nbSiblings,
    value,
    year,
    searchedField,
    children,
    polyglot,
}) => (
    <FetchFold
        label={
            volume === 'other'
                ? polyglot.t('other_volume')
                : `${polyglot.t('volume')}: ${volume}`
        }
        skip={volume === 'other' && nbSiblings === 1}
        count={count}
        volume={volume}
        polyglot={polyglot}
        getData={getIssueData({
            value,
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
    value: PropTypes.string.isRequired,
    year: PropTypes.string.isRequired,
    searchedField: PropTypes.oneOf(SEARCHED_FIELD_VALUES),
    children: PropTypes.func.isRequired,
    nbSiblings: PropTypes.number,
    polyglot: polyglotPropTypes.isRequired,
};

export default VolumeFold;
