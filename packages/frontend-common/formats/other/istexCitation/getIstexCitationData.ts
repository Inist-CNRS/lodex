import get from 'lodash/get';

import { composeAsync } from '@lodex/common';
import { parseFetchResult, output } from '../../utils/fetchIstexData';
import fetch from '../../../fetch/fetch';
import { HOST_TITLE, HOST_TITLE_RAW } from '../istexSummary/constants';
import { buildIstexQuery, getFilterQuery } from '../istexSummary/getIstexData';

// @ts-expect-error TS7031
export const getCitationUrl = ({ resource, field, searchedField }) => {
    const value = resource[field.name];

    if (!value || !searchedField) {
        return null;
    }

    return buildIstexQuery({
        query: getFilterQuery(searchedField, value),
        facet: `${HOST_TITLE}[10]`,
        output,
        size: 10,
    });
};

// @ts-expect-error TS7006
export const parseCitationData = (formatData) => ({
    hits: get(formatData, ['aggregations', 'host.title', 'buckets'], []).map(
        // @ts-expect-error TS7031
        ({ key, docCount }) => ({
            name: key,
            count: docCount,
        }),
    ),
});

export const getCitationDocumentUrl =
    // @ts-expect-error TS7031


        ({ value, name, searchedField, documentSortBy }) =>
        () => ({
            url: buildIstexQuery({
                query: `${getFilterQuery(
                    searchedField,
                    value,
                )} AND ${HOST_TITLE_RAW}:"${name}"`,
                output,
                sortBy: documentSortBy,
                size: 10,
            }),
        });

export const getCitationDocumentData = ({
    // @ts-expect-error TS7031
    value,
    // @ts-expect-error TS7031
    name,
    // @ts-expect-error TS7031
    searchedField,
    // @ts-expect-error TS7031
    documentSortBy,
}) =>
    composeAsync(
        getCitationDocumentUrl({
            value,
            name,
            searchedField,
            documentSortBy,
        }),
        fetch,
        parseFetchResult,
    );
