import memoize from 'lodash/memoize';
import { useTranslate } from '../../../i18n/I18NContext';
import compose from 'recompose/compose';

import fetchDataForComponent from './fetchDataForComponent';
import Alert from '../../../components/Alert';
import { PropositionStatus } from '@lodex/common';
import { fetchForIstexRefbibsFormat } from './fetchIstexRefbibsData';
import IstexItem, { type IstexItemComponentProps } from '../istex/IstexItem';

const styles = {
    text: memoize((status) =>
        Object.assign({
            fontSize: '1rem',
            textDecoration:
                status === PropositionStatus.REJECTED ? 'line-through' : 'none',
        }),
    ),
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

interface IstexRefbibsViewProps {
    fieldStatus?: string;
    resource: object;
    field: unknown;
    data?: {
        hits: ({
            id: string;
        } & IstexItemComponentProps)[];
        total: number;
    };
    error?: string;
}

export const IstexRefbibsView = ({
    fieldStatus,
    data,
    error,
}: IstexRefbibsViewProps) => {
    const { translate } = useTranslate();
    return (
        <div className="istex-list" style={styles.text(fieldStatus)}>
            <div style={styles.header}>
                <span style={styles.total}>
                    {translate('istex_total', {
                        total: data ? data.total : 0,
                    })}
                </span>
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
    fetchDataForComponent(fetchForIstexRefbibsFormat),
    // @ts-expect-error TS2345
)(IstexRefbibsView);
