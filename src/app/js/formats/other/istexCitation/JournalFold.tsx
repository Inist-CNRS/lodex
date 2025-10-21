import FetchFold from '../istexSummary/FetchFold';
import { getCitationDocumentData } from './getIstexCitationData';
import { type SearchedField } from '../istexSummary/constants';

interface JournalFoldProps {
    item: {
        name: string;
        count: number;
    };
    value: string;
    searchedField?: SearchedField;
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

    documentSortBy,
}: JournalFoldProps) => (
    // @ts-expect-error TS2769
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
