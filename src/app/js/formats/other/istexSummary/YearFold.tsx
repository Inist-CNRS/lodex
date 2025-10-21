import FetchFold from './FetchFold';
import { getVolumeData } from './getIstexData';
import { type SearchedField } from './constants';
import type { ReactNode } from 'react';

interface YearFoldProps {
    value: string;
    item: {
        name: string;
        count: number;
    };
    searchedField?: SearchedField;
    children(...args: unknown[]): ReactNode;
    polyglot: unknown;
}

const YearFold = ({
    value,

    item: { name: year, count },

    searchedField,

    polyglot,

    children,
}: YearFoldProps) => (
    <FetchFold
        label={year}
        count={count}
        // @ts-expect-error TS7031
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
