import FileDownload from '@mui/icons-material/GetApp';
import Link from '../../../lib/components/Link';

import injectData from '../../injectData';
import InvalidFormat from '../../InvalidFormat';
import { getCitationUrl, parseCitationData } from './getIstexCitationData';
import { CUSTOM_ISTEX_QUERY } from '../istexSummary/constants';
import composeRenderProps from '../../../lib/composeRenderProps';
import IstexCitationList from './IstexCitationList';
import JournalFold from './JournalFold';
import IstexItem, { type IstexItemComponentProps } from '../istex/IstexItem';
import stylesToClassname from '../../../lib/stylesToClassName';
import { ISTEX_SITE_URL } from '../../../../../common/externals';
import { useTranslate } from '../../../i18n/I18NContext';

interface IstexDocumentProps {
    item: IstexItemComponentProps;
}

export const IstexDocument = ({ item }: IstexDocumentProps) => (
    <IstexItem {...item} />
);

export const getComposedComponent = () =>
    composeRenderProps([
        IstexCitationList,
        JournalFold,
        IstexCitationList,
        IstexDocument,
    ]);

const styles = stylesToClassname(
    {
        container: {
            position: 'relative',
        },
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
    },
    'istex-summary',
);

interface IstexCitationViewProps {
    fieldStatus?: string;
    resource: Record<string, unknown>;
    field: {
        name: string;
        format: string;
    };
    formatData?: {
        hits?: unknown[];
        total?: number;
    };
    error?: string;
    searchedField?: unknown[];
    documentSortBy: string;
    p: unknown;
}

export const IstexCitationView = ({
    formatData,
    field,
    resource,
    searchedField,
    documentSortBy,
}: IstexCitationViewProps) => {
    const { translate } = useTranslate();
    if (!resource[field.name] || !searchedField) {
        return (
            <InvalidFormat format={field.format} value={resource[field.name]} />
        );
    }

    const data = parseCitationData(formatData);
    const ComposedComponent = getComposedComponent();

    return (
        // @ts-expect-error TS2339
        <div className={`istex-summary ${styles.container}`}>
            {/*
             // @ts-expect-error TS2339 */}
            <div className={styles.header}>
                {/*
                 // @ts-expect-error TS2339 */}
                <span className={styles.total}>
                    {translate('istex_total', {
                        total: formatData ? formatData.total : 0,
                    })}
                </span>
                <Link
                    // @ts-expect-error TS2339
                    className={styles.dl}
                    href={`${ISTEX_SITE_URL}/?q=`.concat(
                        encodeURIComponent(resource[field.name] as string),
                    )}
                    target="_blank"
                >
                    {/*
                     // @ts-expect-error TS2769 */}
                    <FileDownload tooltip={translate('download')} />
                </Link>
            </div>
            <ComposedComponent
                data={data}
                value={resource[field.name]}
                searchedField={searchedField}
                documentSortBy={documentSortBy}
            />
        </div>
    );
};

IstexCitationView.defaultProps = {
    className: null,
    fieldStatus: null,
    formatData: null,
    error: null,
    searchedField: CUSTOM_ISTEX_QUERY,
};

// @ts-expect-error TS2345
export default injectData(getCitationUrl)(IstexCitationView);
