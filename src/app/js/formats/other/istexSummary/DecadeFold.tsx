import FetchFold from './FetchFold';
import { getDecadeYearData } from './getIstexData';
import type { SearchedField, SortYear } from './constants';
import type { ReactNode } from 'react';

interface DecadeFoldProps {
    value: string;
    item: {
        name: string;
        count: number;
    };
    searchedField?: SearchedField;
    sortDir?: SortYear;
    children(...args: unknown[]): ReactNode;
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

    children,
}: DecadeFoldProps) => (
    <FetchFold
        label={`${from}-${to}`}
        count={count}
        // @ts-expect-error TS2769
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
