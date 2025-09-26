import { call, takeEvery, select, put } from 'redux-saga/effects';

import { EXPORT_PUBLISHED_DATASET, exportPublishedDatasetError } from '../';
import { fromSearch } from '../../selectors';
import getQueryString from '../../../lib/getQueryString';
import fetchSaga from '../../../lib/sagas/fetchSaga';
import downloadFile from '../../../lib/downloadFile';
import { fromUser } from '../../../sharedSelectors';

// @ts-expect-error TS7006
export const open = (url) => window.open(url); // Warning: does not work with authentication and token

export function* handleExportPublishedDatasetSuccess({
    // @ts-expect-error TS7031
    payload: { exportID, uri },
}) {
    // @ts-expect-error TS7057
    let facets = yield select(fromSearch.getAppliedFacets);

    if (facets) {
        facets = Object.keys(facets).reduce((acc, facetName) => {
            // @ts-expect-error TS7053
            acc[facetName] = facets[facetName].map(
                // @ts-expect-error TS7006
                (facetValue) => facetValue.id,
            );
            return acc;
        }, {});
    }
    // @ts-expect-error TS7057
    const invertedFacets = yield select(fromSearch.getInvertedFacetKeys);
    // @ts-expect-error TS7057
    const match = yield select(fromSearch.getQuery);
    // @ts-expect-error TS7057
    const sort = yield select(fromSearch.getSort);
    // @ts-expect-error TS7057
    const queryString = yield call(getQueryString, {
        match,
        facets,
        sort,
        uri,
        invertedFacets,
    });

    // @ts-expect-error TS7057
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

export default function* () {
    yield takeEvery(
        // @ts-expect-error TS2769
        EXPORT_PUBLISHED_DATASET,
        handleExportPublishedDatasetSuccess,
    );
}
