import { useState, type ReactNode } from 'react';
import classnames from 'classnames';
import FileDownload from '@mui/icons-material/GetApp';
import Link from '@lodex/frontend-common/components/Link';

import { getMoreDocumentData } from '../istexSummary/getIstexData';
import ButtonWithStatus from '@lodex/frontend-common/components/ButtonWithStatus';
import stylesToClassname from '../../../lib/stylesToClassName';
import { HOST_TITLE_RAW } from '../istexSummary/constants';
import { ISTEX_SITE_URL } from '@lodex/common';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';

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

interface IstexCitationListProps {
    data: {
        hits: unknown[];
        total: number;
        nextPageURI: string;
    };
    children(...args: unknown[]): ReactNode;
    skip: boolean;
    name?: string;
    value?: string;
}

const IstexCitationList = ({
    data,
    children,
    skip,
    name,
    value,
    ...props
}: IstexCitationListProps) => {
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
                <li className={styles.li}>{translate('istex_no_result')}</li>
            </ul>
        );
    }

    return (
        <div>
            {total > 0 && (
                <div
                    style={{
                        borderBottom: '1px solid lightgrey',
                        marginBottom: '1rem',
                    }}
                >
                    <span
                        style={{
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            color: 'rgba(0,0,0,0.54)',
                        }}
                    >
                        {translate('istex_total', {
                            total,
                        })}
                    </span>
                    <Link
                        style={{
                            float: 'right',
                        }}
                        href={`${ISTEX_SITE_URL}/?q=`.concat(
                            encodeURIComponent(
                                `(${value}) AND ${HOST_TITLE_RAW}:"${name}"`,
                            ),
                        )}
                        target="_blank"
                    >
                        {/*
                         // @ts-expect-error TS2769 */}
                        <FileDownload tooltip={translate('download')} />
                    </Link>
                </div>
            )}
            {/*
             // @ts-expect-error TS2339 */}
            <ul className={classnames({ skip }, skip && styles.skip)}>
                {hits.map((item, index) => (
                    // @ts-expect-error TS2339
                    <li className={styles.li} key={index}>
                        {children({ ...props, item })}
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

export default IstexCitationList;
