// @ts-expect-error TS6133
import React from 'react';

import FetchFold from './FetchFold';
import { getVolumeData } from './getIstexData';
import { SEARCHED_FIELD_VALUES } from './constants';
import { polyglot as polyglotPropTypes } from '../../../propTypes';

interface YearFoldProps {
    value: string;
    item: {
        name: string;
        count: number;
    };
    searchedField?: unknown[];
    children(...args: unknown[]): unknown;
    polyglot: unknown;
}

const YearFold = ({
    value,

    item: { name: year, count },

    searchedField,

    polyglot,

    children
}: YearFoldProps) => (
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

export default YearFold;
