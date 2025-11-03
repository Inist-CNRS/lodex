import { type CSSProperties } from 'react';
import memoize from 'lodash/memoize';
import compose from 'recompose/compose';
import FileDownload from '@mui/icons-material/GetApp';
import Link from '@lodex/frontend-common/components/Link';

import fetchPaginatedDataForComponent from '@lodex/frontend-common/fetch/fetchPaginatedDataForComponent';
import Alert from '@lodex/frontend-common/components/Alert';
import { PropositionStatus, ISTEX_SITE_URL } from '@lodex/common';
import { fetchForIstexFormat } from '../../utils/fetchIstexData';
import IstexItem, { type IstexItemComponentProps } from './IstexItem';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';

const styles: {
    text: (status?: string) => CSSProperties;
    header: CSSProperties;
    dl: CSSProperties;
    total: CSSProperties;
} = {
    text: memoize((status) => ({
        fontSize: '1rem',
        textDecoration:
            status === PropositionStatus.REJECTED ? 'line-through' : 'none',
    })) as (status?: string) => CSSProperties,
    header: {
        borderBottom: '1px solid lightgrey',
        marginBottom: '1rem',
    },
    dl: {
        float: 'right',
    },
    total: {
        fontSize: '1rem',
        fontWeight: 'bold',
        color: 'rgba(0,0,0,0.54)',
    },
};

interface IstexViewProps {
    fieldStatus?: string;
    resource: Record<string, string>;
    field: {
        name: string;
    };
    data?: {
        hits: ({
            id: string;
        } & IstexItemComponentProps)[];
        total: number;
    };
    error?: string;
}

export const IstexView = ({
    fieldStatus,
    data,
    error,
    field,
    resource,
}: IstexViewProps) => {
    const { translate } = useTranslate();
    return (
        <div className="istex-list" style={styles.text(fieldStatus)}>
            <div style={styles.header}>
                <span style={styles.total}>
                    {translate('istex_total', {
                        total: data ? data.total : 0,
                    })}
                </span>
                <Link
                    style={styles.dl}
                    href={`${ISTEX_SITE_URL}/?q=`.concat(
                        encodeURIComponent(resource[field.name]),
                    )}
                    target="_blank"
                >
                    {/*
                 // @ts-expect-error TS2769 */}
                    <FileDownload tooltip={translate('download')} />
                </Link>
                {error && (
                    <Alert>
                        <p>{translate(error)}</p>
                    </Alert>
                )}
            </div>
            {data && data.hits && (
                <div>
                    {data.hits.map((item) => (
                        <IstexItem key={item.id} {...item} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default compose(
    fetchPaginatedDataForComponent(fetchForIstexFormat),
    // @ts-expect-error TS2345
)(IstexView);
