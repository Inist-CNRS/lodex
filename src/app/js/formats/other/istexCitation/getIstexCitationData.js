import get from 'lodash/get';

import composeAsync from '../../../../../common/lib/composeAsync';
import { parseFetchResult, output } from '../../utils/fetchIstexData';
import fetch from '../../../lib/fetch';
import { HOST_TITLE, HOST_TITLE_RAW } from '../istexSummary/constants';
import { buildIstexQuery, getFilterQuery } from '../istexSummary/getIstexData';

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

export const parseCitationData = formatData => ({
    hits: get(formatData, ['aggregations', 'host.title', 'buckets'], []).map(
        ({ key, docCount }) => ({
            name: key,
            count: docCount,
        }),
    ),
});

export const getCitationDocumentUrl = ({
    value,
    name,
    searchedField,
    documentSortBy,
}) => () => ({
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
    value,
    name,
    searchedField,
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
