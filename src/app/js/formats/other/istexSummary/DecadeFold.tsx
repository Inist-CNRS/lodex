// @ts-expect-error TS6133
import React from 'react';

import FetchFold from './FetchFold';
import { getDecadeYearData } from './getIstexData';
import { SEARCHED_FIELD_VALUES, SORT_YEAR_VALUES } from './constants';
import { polyglot as polyglotPropTypes } from '../../../propTypes';

interface DecadeFoldProps {
    value: string;
    item: {
        name: string;
        count: number;
    };
    searchedField?: unknown[];
    sortDir?: unknown[];
    children(...args: unknown[]): unknown;
    polyglot: unknown;
}

const DecadeFold = ({
    value,

    item: {
        // @ts-expect-error TS7031
        name: { from, to },
        count,
    },

    searchedField,

    sortDir,

    polyglot,

    children
}: DecadeFoldProps) => (
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

export default DecadeFold;
