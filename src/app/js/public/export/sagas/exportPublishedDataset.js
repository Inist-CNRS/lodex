import { call, takeEvery, select } from 'redux-saga/effects';

import { EXPORT_PUBLISHED_DATASET } from '../';
import { fromDataset, fromFacet } from '../../selectors';
import getQueryString from '../../../lib/getQueryString';

export const open = url => window.open(url);

export function* handleExportPublishedDatasetSuccess({ payload: { type, uri } }) {
    const facets = yield select(fromFacet.getAppliedFacets);
    const match = yield select(fromDataset.getFilter);
    const sort = yield select(fromDataset.getSort);

    const queryString = yield call(getQueryString, { match, facets, sort, uri });

    yield call(open, `/api/export/${type}?${queryString}`);
}

export default function* () {
    yield takeEvery(EXPORT_PUBLISHED_DATASET, handleExportPublishedDatasetSuccess);
}
