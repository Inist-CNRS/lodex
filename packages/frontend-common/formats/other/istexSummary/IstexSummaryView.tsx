import injectData from '../../injectData';
import InvalidFormat from '../../InvalidFormat';
import { getYearUrl, parseYearData } from './getIstexData';
import {
    type SearchedField,
    type SortYear,
    SORT_YEAR_DESC,
    CUSTOM_ISTEX_QUERY,
} from './constants';
import composeRenderProps from '@lodex/frontend-common/utils/composeRenderProps';
import IstexList from './IstexList';
import IssueFold from './IssueFold';
import VolumeFold from './VolumeFold';
import YearFold from './YearFold';
import IstexItem from '../istex/IstexItem';
import DecadeFold from './DecadeFold';
import getDecadeFromData from './getDecadeFromData';
import EmbedButton from './EmbedButton';
import stylesToClassname from '@lodex/frontend-common/utils/stylesToClassName';
import type { Field } from '@lodex/frontend-common/fields/types';

interface IstexDocumentProps {
    item: {
        id: string;
    };
}

export const IstexDocument = ({
    item,
    // @ts-expect-error TS2740
}: IstexDocumentProps) => <IstexItem {...item} />;

// @ts-expect-error TS7006
export const getComposedComponent = (displayDecade) =>
    composeRenderProps([
        ...(displayDecade ? [IstexList, DecadeFold] : []),
        IstexList,
        YearFold,
        IstexList,
        VolumeFold,
        IstexList,
        IssueFold,
        IstexList,
        IstexDocument,
    ]);

const styles = stylesToClassname(
    {
        container: {
            position: 'relative',
        },
        embedButton: {
            position: 'absolute',
            top: 0,
            right: '-2rem',
        },
    },
    'istex-summary',
);

interface IstexSummaryViewProps {
    fieldStatus?: string;
    resource: object;
    field: Field;
    formatData: {
        hits?: unknown;
    };
    error?: string;
    searchedField?: SearchedField;
    sortDir?: SortYear;
    yearThreshold: number;
    documentSortBy: string;
    p: unknown;
    showEmbedButton?: boolean;
}

export const IstexSummaryView = ({
    formatData,
    field,
    resource,
    searchedField = CUSTOM_ISTEX_QUERY,
    sortDir = SORT_YEAR_DESC,
    yearThreshold = 50,
    documentSortBy,
    showEmbedButton = true,
}: IstexSummaryViewProps) => {
    // @ts-expect-error TS7053
    if (!resource[field.name] || !searchedField) {
        return (
            // @ts-expect-error TS18046
            <InvalidFormat format={field.format} value={resource[field.name]} />
        );
    }

    const data = parseYearData(formatData, sortDir);

    const displayDecade = yearThreshold && data.hits.length > yearThreshold;
    const ComposedComponent = getComposedComponent(displayDecade);

    return (
        // @ts-expect-error TS2339
        <div className={`istex-summary ${styles.container}`}>
            {showEmbedButton && (
                <EmbedButton
                    // @ts-expect-error TS2769
                    className={styles.embedButton}
                    // @ts-expect-error TS2339
                    uri={resource.uri}
                    fieldName={field.name}
                />
            )}
            <ComposedComponent
                data={
                    displayDecade
                        ? getDecadeFromData(data, sortDir === SORT_YEAR_DESC)
                        : data
                }
                // @ts-expect-error TS7053
                value={resource[field.name]}
                searchedField={searchedField}
                sortDir={sortDir}
                documentSortBy={documentSortBy}
            />
        </div>
    );
};

// @ts-expect-error TS2345
export default injectData(getYearUrl)(IstexSummaryView);
