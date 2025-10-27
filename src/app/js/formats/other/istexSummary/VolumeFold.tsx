import FetchFold from './FetchFold';
import { getIssueData } from './getIstexData';
import { type SearchedField } from './constants';
import { useTranslate } from '../../../i18n/I18NContext';
import type { ReactNode } from 'react';

interface VolumeFoldProps {
    item: {
        name: string;
        count: number;
    };
    value: string;
    year: string;
    searchedField: SearchedField;
    children(...args: unknown[]): ReactNode;
    nbSiblings?: number;
}

const VolumeFold = ({
    item: { name: volume, count },
    nbSiblings,
    value,
    year,
    searchedField,
    children,
}: VolumeFoldProps) => {
    const { translate } = useTranslate();
    return (
        <FetchFold
            label={
                volume === 'other'
                    ? translate('other_volume')
                    : `${translate('volume')}: ${volume}`
            }
            skip={volume === 'other' && nbSiblings === 1}
            count={count}
            volume={volume}
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
};

export default VolumeFold;
