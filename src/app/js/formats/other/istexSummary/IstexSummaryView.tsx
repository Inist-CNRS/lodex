import React from 'react';
import PropTypes from 'prop-types';

import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../../../propTypes';
import injectData from '../../injectData';
import InvalidFormat from '../../InvalidFormat';
import { getYearUrl, parseYearData } from './getIstexData';
import {
    SEARCHED_FIELD_VALUES,
    SORT_YEAR_VALUES,
    SORT_YEAR_DESC,
    CUSTOM_ISTEX_QUERY,
} from './constants';
import composeRenderProps from '../../../lib/composeRenderProps';
import IstexList from './IstexList';
import IssueFold from './IssueFold';
import VolumeFold from './VolumeFold';
import YearFold from './YearFold';
import IstexItem from '../istex/IstexItem';
import DecadeFold from './DecadeFold';
import getDecadeFromData from './getDecadeFromData';
import EmbedButton from './EmbedButton';
import stylesToClassname from '../../../lib/stylesToClassName';

// @ts-expect-error TS7031
export const IstexDocument = ({ item }) => <IstexItem {...item} />;

IstexDocument.propTypes = {
    item: PropTypes.shape({ id: PropTypes.string.isRequired }).isRequired,
};

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

export const IstexSummaryView = ({
    // @ts-expect-error TS7031
    formatData,
    // @ts-expect-error TS7031
    field,
    // @ts-expect-error TS7031
    resource,
    // @ts-expect-error TS7031
    searchedField,
    // @ts-expect-error TS7031
    sortDir,
    // @ts-expect-error TS7031
    yearThreshold,
    // @ts-expect-error TS7031
    documentSortBy,
    // @ts-expect-error TS7031
    p: polyglot,
    // @ts-expect-error TS7031
    showEmbedButton,
}) => {
    if (!resource[field.name] || !searchedField) {
        return (
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
                    uri={resource.uri}
                    fieldName={field.name}
                    p={polyglot}
                />
            )}
            <ComposedComponent
                data={
                    displayDecade
                        ? getDecadeFromData(data, sortDir === SORT_YEAR_DESC)
                        : data
                }
                value={resource[field.name]}
                searchedField={searchedField}
                sortDir={sortDir}
                documentSortBy={documentSortBy}
                polyglot={polyglot}
            />
        </div>
    );
};

IstexSummaryView.propTypes = {
    fieldStatus: PropTypes.string,
    resource: PropTypes.object.isRequired,
    field: fieldPropTypes.isRequired,
    // @ts-expect-error TS2551
    formatData: PropTypes.shape({ hits: PropTypes.Array }),
    error: PropTypes.string,
    searchedField: PropTypes.oneOf(SEARCHED_FIELD_VALUES),
    sortDir: PropTypes.oneOf(SORT_YEAR_VALUES),
    yearThreshold: PropTypes.number.isRequired,
    documentSortBy: PropTypes.string.isRequired,
    p: polyglotPropTypes.isRequired,
    showEmbedButton: PropTypes.bool,
};

IstexSummaryView.defaultProps = {
    className: null,
    fieldStatus: null,
    formatData: null,
    error: null,
    yearThreshold: 50,
    searchedField: CUSTOM_ISTEX_QUERY,
    sortDir: SORT_YEAR_DESC,
    showEmbedButton: true,
};

// @ts-expect-error TS2345
export default injectData(getYearUrl)(IstexSummaryView);
