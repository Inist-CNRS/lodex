// @ts-expect-error TS6133
import React from 'react';

import FetchFold from './FetchFold';
import { getIssueData } from './getIstexData';
import { SEARCHED_FIELD_VALUES } from './constants';
import { polyglot as polyglotPropTypes } from '../../../propTypes';

interface VolumeFoldProps {
    item: {
        name: string;
        count: number;
    };
    value: string;
    year: string;
    searchedField?: unknown[];
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

    polyglot
}: VolumeFoldProps) => (
    <FetchFold
        label={
            volume === 'other'
                ? polyglot.t('other_volume')
                : `${polyglot.t('volume')}: ${volume}`
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
