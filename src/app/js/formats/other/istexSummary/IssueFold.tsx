// @ts-expect-error TS6133
import React from 'react';

import FetchFold from './FetchFold';
import { getDocumentData } from './getIstexData';
import { SEARCHED_FIELD_VALUES } from './constants';
import { polyglot as polyglotPropTypes } from '../../../propTypes';

interface IssueFoldProps {
    item: {
        name: string;
        count: number;
    };
    value: string;
    year: string;
    volume: string;
    searchedField?: unknown[];
    children(...args: unknown[]): unknown;
    isOther?: boolean;
    polyglot: unknown;
    documentSortBy: string;
}

const IssueFold = ({
    item: { name: issue, count },

    value,

    year,

    volume,

    searchedField,

    polyglot,

    children,

    documentSortBy
}: IssueFoldProps) => (
    <FetchFold
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

export default IssueFold;
