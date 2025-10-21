import FetchFold from './FetchFold';
import { getDocumentData } from './getIstexData';
import { type SearchedField } from './constants';

interface IssueFoldProps {
    item: {
        name: string;
        count: number;
    };
    value: string;
    year: string;
    volume: string;
    searchedField?: SearchedField;
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
    documentSortBy,
}: IssueFoldProps) => (
    // @ts-expect-error TS2769
    <FetchFold
        label={
            issue === 'other'
                ? // @ts-expect-error TS18046
                  polyglot.t('other_issue')
                : // @ts-expect-error TS18046
                  `${polyglot.t('issue')}: ${issue}`
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
