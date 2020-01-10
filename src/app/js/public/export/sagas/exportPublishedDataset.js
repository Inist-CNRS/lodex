import { call, takeEvery, select, put } from 'redux-saga/effects';

import { EXPORT_PUBLISHED_DATASET, exportPublishedDatasetError } from '../';
import { fromSearch } from '../../selectors';
import getQueryString from '../../../lib/getQueryString';
import { fromUser } from '../../../sharedSelectors';

export const open = url => window.open(url);

export function* handleExportPublishedDatasetSuccess({
    payload: { uri, exportID },
}) {
    const facets = yield select(fromSearch.getAppliedFacets);
    const match = yield select(fromSearch.getQuery);
    const sort = yield select(fromSearch.getSort);

    const queryString = yield call(getQueryString, {
        match,
        facets,
        sort,
        uri,
    });

    const request = yield select(fromUser.getExportPublishedDatasetRequest, {
        type: exportID,
        queryString,
    });

    yield call(open, request.url);
}

export default function*() {
    yield takeEvery(
        EXPORT_PUBLISHED_DATASET,
        handleExportPublishedDatasetSuccess,
    );
}
