// @ts-expect-error TS6133
import React from 'react';

import FetchFold from '../istexSummary/FetchFold';
import { getCitationDocumentData } from './getIstexCitationData';
import { SEARCHED_FIELD_VALUES } from '../istexSummary/constants';
import { polyglot as polyglotPropTypes } from '../../../propTypes';

interface JournalFoldProps {
    item: {
        name: string;
        count: number;
    };
    value: string;
    searchedField?: unknown[];
    children(...args: unknown[]): unknown;
    polyglot: unknown;
    documentSortBy: string;
}

const JournalFold = ({
    item: { name, count },

    value,

    searchedField,

    polyglot,

    children,

    documentSortBy
}: JournalFoldProps) => (
    <FetchFold
        label={name}
        skip={name === 'other'}
        count={count}
        name={name}
        polyglot={polyglot}
        getData={getCitationDocumentData({
            value,
            name,
            searchedField,
            documentSortBy,
        })}
    >
        {children}
    </FetchFold>
);

export default JournalFold;
