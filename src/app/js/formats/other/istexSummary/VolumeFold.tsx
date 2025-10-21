import FetchFold from './FetchFold';
import { getIssueData } from './getIstexData';
import { type SearchedField } from './constants';

interface VolumeFoldProps {
    item: {
        name: string;
        count: number;
    };
    value: string;
    year: string;
    searchedField?: SearchedField;
    children(...args: unknown[]): unknown;
    nbSiblings?: number;
    polyglot: unknown;
}

const VolumeFold = ({
    item: { name: volume, count },

    nbSiblings,

    value,

    year,

    searchedField,

    children,

    polyglot,
}: VolumeFoldProps) => (
    // @ts-expect-error TS2769
    <FetchFold
        label={
            volume === 'other'
                ? // @ts-expect-error TS18046
                  polyglot.t('other_volume')
                : // @ts-expect-error TS18046
                  `${polyglot.t('volume')}: ${volume}`
        }
        skip={volume === 'other' && nbSiblings === 1}
        count={count}
        volume={volume}
        polyglot={polyglot}
        getData={getIssueData({
            value,
            year,
            volume: volume,
            searchedField,
        })}
    >
        {children}
    </FetchFold>
);

export default VolumeFold;
