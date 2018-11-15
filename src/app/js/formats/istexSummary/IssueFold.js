import React from 'react';
import PropTypes from 'prop-types';

import FetchFold from './FetchFold';
import { getDocumentData } from './getIstexData';
import { SEARCHED_FIELD_VALUES } from './constants';
import { polyglot as polyglotPropTypes } from '../../propTypes';

const IssueFold = ({
    item: { name: issue, count },
    value,
    year,
    volume,
    searchedField,
    polyglot,
    children,
}) => (
    <FetchFold
        label={
            issue === 'other'
                ? polyglot.t('other_issue')
                : `${polyglot.t('issue')}: ${issue}`
        }
        count={count}
        issue={issue}
        polyglot={polyglot}
        getData={getDocumentData({
            value,
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
    value: PropTypes.string.isRequired,
    year: PropTypes.string.isRequired,
    volume: PropTypes.string.isRequired,
    searchedField: PropTypes.oneOf(SEARCHED_FIELD_VALUES),
    children: PropTypes.func.isRequired,
    polyglot: polyglotPropTypes.isRequired,
};

export default IssueFold;
