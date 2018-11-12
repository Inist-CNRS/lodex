import { call, takeEvery, select, put } from 'redux-saga/effects';

import { EXPORT_PUBLISHED_DATASET, exportPublishedDatasetError } from '../';
import { fromDataset } from '../../selectors';
import getQueryString from '../../../lib/getQueryString';
import fetchSaga from '../../../lib/sagas/fetchSaga';
import downloadFile from '../../../lib/downloadFile';
import { fromUser } from '../../../sharedSelectors';

export const open = url => window.open(url);

export function* handleExportPublishedDatasetSuccess({
    payload: { type, uri },
}) {
    const facets = yield select(fromDataset.getAppliedFacets);
    const match = yield select(fromDataset.getFilter);
    const sort = yield select(fromDataset.getSort);

    const queryString = yield call(getQueryString, {
        match,
        facets,
        sort,
        uri,
    });

    const request = yield select(fromUser.getExportPublishedDatasetRequest, {
        type,
        queryString,
    });

    const { error, response } = yield call(fetchSaga, request, [], 'blob');

    if (error) {
        yield put(exportPublishedDatasetError(error));
    }

    yield call(downloadFile, response, `export.${type}`);
}

export default function*() {
    yield takeEvery(
        EXPORT_PUBLISHED_DATASET,
        handleExportPublishedDatasetSuccess,
    );
}
