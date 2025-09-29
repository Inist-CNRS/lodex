// @ts-expect-error TS6133
import React from 'react';
import PropTypes from 'prop-types';

import FetchFold from './FetchFold';
import { getDocumentData } from './getIstexData';
import { SEARCHED_FIELD_VALUES } from './constants';
import { polyglot as polyglotPropTypes } from '../../../propTypes';

const IssueFold = ({
    // @ts-expect-error TS7031
    item: { name: issue, count },
    // @ts-expect-error TS7031
    value,
    // @ts-expect-error TS7031
    year,
    // @ts-expect-error TS7031
    volume,
    // @ts-expect-error TS7031
    searchedField,
    // @ts-expect-error TS7031
    polyglot,
    // @ts-expect-error TS7031
    children,
    // @ts-expect-error TS7031
    documentSortBy,
}) => (
    <FetchFold
        // @ts-expect-error TS2769
        label={
            issue === 'other'
                ? polyglot.t('other_issue')
                : `${polyglot.t('issue')}: ${issue}`
        }
        skip={issue === 'other'}
        count={count}
        issue={issue}
        polyglot={polyglot}
        getData={getDocumentData({
            value,
            year,
            volume,
            issue,
            searchedField,
            documentSortBy,
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
    isOther: PropTypes.bool,
    polyglot: polyglotPropTypes.isRequired,
    documentSortBy: PropTypes.string.isRequired,
};

export default IssueFold;
