import FetchFold from './FetchFold';
import { getDocumentData } from './getIstexData';
import { type SearchedField } from './constants';
import type { ReactNode } from 'react';
import { useTranslate } from '../../../i18n/I18NContext';

interface IssueFoldProps {
    item: {
        name: string;
        count: number;
        issue: string;
    };
    value: string;
    year: string;
    volume: string;
    searchedField: SearchedField;
    children(...args: unknown[]): ReactNode;
    documentSortBy: string;
}

const IssueFold = ({
    item: { name: issue, count },
    value,
    year,
    volume,
    searchedField,
    children,
    documentSortBy,
}: IssueFoldProps) => {
    const { translate } = useTranslate();
    return (
        <FetchFold
            label={
                issue === 'other'
                    ? translate('other_issue')
                    : `${translate('issue')}: ${issue}`
            }
            skip={issue === 'other'}
            count={count}
            issue={issue}
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
};

export default IssueFold;
