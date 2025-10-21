import { useState } from 'react';
import classnames from 'classnames';

import { getMoreDocumentData } from './getIstexData';
import ButtonWithStatus from '../../../lib/components/ButtonWithStatus';
import stylesToClassname from '../../../lib/stylesToClassName';
import { useTranslate } from '../../../i18n/I18NContext';

const styles = stylesToClassname(
    {
        li: {
            listStyleType: 'none',
        },
        loadMore: {
            marginTop: '1rem',
        },
        skip: {
            paddingLeft: 0,
        },
    },
    'istex-list',
);

interface IstexListProps {
    data: {
        hits: unknown[];
        total: number;
        nextPageURI?: string;
    };
    children(...args: unknown[]): unknown;
    skip: boolean;
}

const IstexList = ({ data, children, skip, ...props }: IstexListProps) => {
    const { translate } = useTranslate();
    const [hits, setHits] = useState(data.hits);
    const [total, setTotal] = useState(data.total);
    const [nextPageURI, setNextPageURI] = useState(data.nextPageURI);
    const [isLoading, setIsLoading] = useState(false);

    const loadMore = () => {
        setIsLoading(true);
        getMoreDocumentData(nextPageURI).then(
            ({
                hits: newHits,
                total: newTotal,
                nextPageURI: newNextPageURI,
            }) => {
                setHits([...hits, ...newHits]);
                setTotal(newTotal);
                setNextPageURI(newNextPageURI);
                setIsLoading(false);
            },
        );
    };

    if (!hits || !hits.length) {
        return (
            <ul>
                {/*
                 // @ts-expect-error TS2339 */}
                <li className={styles.li}>{polyglot.t('istex_no_result')}</li>
            </ul>
        );
    }

    return (
        <div>
            {/*
             // @ts-expect-error TS2339 */}
            <ul className={classnames({ skip }, skip && styles.skip)}>
                {hits.map((item, index) => (
                    // @ts-expect-error TS2339
                    <li className={styles.li} key={index}>
                        {/*
                         // @ts-expect-error TS2349 */}
                        {children({ ...props, polyglot, item })}
                    </li>
                ))}
            </ul>
            {nextPageURI && (
                // @ts-expect-error TS2339
                <div className={classnames('load-more', styles.loadMore)}>
                    <ButtonWithStatus
                        fullWidth
                        onClick={loadMore}
                        loading={isLoading}
                    >
                        {translate('search_load_more')} ({total - hits.length})
                    </ButtonWithStatus>
                </div>
            )}
        </div>
    );
};

export default IstexList;
