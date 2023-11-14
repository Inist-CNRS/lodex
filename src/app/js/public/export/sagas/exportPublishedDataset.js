import { call, takeEvery, select, put } from 'redux-saga/effects';

import { EXPORT_PUBLISHED_DATASET, exportPublishedDatasetError } from '../';
import { fromSearch } from '../../selectors';
import getQueryString from '../../../lib/getQueryString';
import fetchSaga from '../../../lib/sagas/fetchSaga';
import downloadFile from '../../../lib/downloadFile';
import { fromUser } from '../../../sharedSelectors';

export const open = url => window.open(url); // Warning: does not work with authentication and token

export function* handleExportPublishedDatasetSuccess({
    payload: { exportID, uri },
}) {
    let facets = yield select(fromSearch.getAppliedFacets);
    facets = Object.keys(facets).reduce((acc, facetName) => {
        acc[facetName] = facets[facetName].map(facetValue => facetValue.id);
        return acc;
    }, {});
    const invertedFacets = yield select(fromSearch.getInvertedFacetKeys);
    const match = yield select(fromSearch.getQuery);
    const sort = yield select(fromSearch.getSort);
    const queryString = yield call(getQueryString, {
        match,
        facets,
        sort,
        uri,
        invertedFacets,
    });

    const request = yield select(fromUser.getExportPublishedDatasetRequest, {
        type: exportID,
        queryString,
    });

    const { error, response, filename } = yield call(
        fetchSaga,
        request,
        [],
        'blob',
    );

    if (error || !response) {
        yield put(exportPublishedDatasetError(error));
    } else {
        yield call(downloadFile, response, filename);
    }
}

export default function*() {
    yield takeEvery(
        EXPORT_PUBLISHED_DATASET,
        handleExportPublishedDatasetSuccess,
    );
}
