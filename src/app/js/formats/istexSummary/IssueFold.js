import React from 'react';
import PropTypes from 'prop-types';

import FetchFold from './FetchFold';
import { getDocumentData } from './getIstexData';
import { searchedFieldValues } from './IstexSummaryAdmin';
import { polyglot as polyglotPropTypes } from '../../propTypes';

const IssueFold = ({
    item: { name: issue, count },
    issn,
    year,
    volume,
    searchedField,
    polyglot,
    children,
}) => (
    <FetchFold
        label={`${polyglot.t('issue')}: ${issue}`}
        count={count}
        issn={issn}
        year={year}
        volume={volume}
        issue={issue}
        searchedField={searchedField}
        polyglot={polyglot}
        getData={getDocumentData({
            issn,
            year,
            volume,
            issue,
            searchedField,
        })}
    >
        {children}
    </FetchFold>
);

IssueFold.propTypes = {
    item: PropTypes.shape({
        name: PropTypes.string.isRequired,
        count: PropTypes.number.isRequired,
    }).isRequired,
    issn: PropTypes.string.isRequired,
    year: PropTypes.string.isRequired,
    volume: PropTypes.string.isRequired,
    searchedField: PropTypes.oneOf(searchedFieldValues),
    children: PropTypes.func.isRequired,
    polyglot: polyglotPropTypes.isRequired,
};

export default IssueFold;
