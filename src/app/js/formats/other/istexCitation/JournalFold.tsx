import FetchFold from '../istexSummary/FetchFold';
import { getCitationDocumentData } from './getIstexCitationData';
import { type SearchedField } from '../istexSummary/constants';
import type { ReactNode } from 'react';

interface JournalFoldProps {
    item: {
        name: string;
        count: number;
    };
    value: string;
    searchedField?: SearchedField;
    children(...args: unknown[]): ReactNode;
    documentSortBy: string;
}

const JournalFold = ({
    item: { name, count },

    value,

    searchedField,

    children,

    documentSortBy,
}: JournalFoldProps) => (
    <FetchFold
        label={name}
        skip={name === 'other'}
        count={count}
        name={name}
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
