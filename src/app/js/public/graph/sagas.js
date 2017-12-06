import { fork, call, put, select, takeLatest } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import MQS from 'mongodb-querystring';
import url from 'url';
import querystring from 'querystring';

import {
    PRE_LOAD_CHART_DATA,
    LOAD_CHART_DATA,
    loadChartData,
    loadChartDataSuccess,
    loadChartDataError,
} from './';

import fetchSaga from '../../lib/sagas/fetchSaga';
import { fromGraph, fromDataset, fromFacet } from '../selectors';

export function* handlePreLoadChartData({ payload: { field, value } }) {
    if (yield select(fromGraph.isChartDataLoaded, field.name)) {
        return;
    }

    yield put(loadChartData({ field, value }));
}

const valueMoreThan = level => item => item.value > level;

export function* handleLoadChartDataRequest({ payload: { field, value } }) {
    console.log({ field, value });
    const facets = yield select(fromFacet.getAppliedFacets);
    const invertedFacets = yield select(fromFacet.getInvertedFacets);
    const match = yield select(fromDataset.getFilter);

    const orderBy =
        field.format && field.format.args && field.format.args.orderBy
            ? field.format.args.orderBy
            : 'value/asc';
    const maxSize =
        field.format && field.format.args && field.format.args.maxSize
            ? field.format.args.maxSize
            : '5';
    const [sortBy, sortDir] = String(orderBy || 'value/asc').split('/');
    const by = sortBy === 'value' ? 'value' : '_id';
    const dir = sortDir === 'asc' ? 1 : -1;
    const sort = {};
    sort[by] = dir;

    const uri = url.parse(value);
    const query = querystring.parse(uri.query || '');
    const mongoQuery = {
        $query: query,
        $skip: 0,
        $limit: maxSize,
        $orderby: sort,
    };
    const uriNew = {
        ...uri,
        search: MQS.stringify(mongoQuery),
    };
    if (uri.pathname.indexOf('/api/') === 0) {
        uriNew.host = window.location.host;
        uriNew.protocol = window.location.protocol;
    }
    const apiurl = url.format(uriNew);
    const { error, response } = yield call(fetchSaga, { url: apiurl });

    if (error) {
        yield put(loadChartDataError(error));
        return;
    }
    if (response.data) {
        const data = response.data
            .filter(valueMoreThan(0))
            .map(item => ({ name: item._id, value: item.value }));
        yield put(loadChartDataSuccess({ name: field.name, data }));
    }
    if (response.aggregations) {
        const firstKey = Object.keys(response.aggregations).shift();
        const data = response.aggregations[firstKey].buckets.map(item => ({
            name: item.keyAsString || item.key,
            value: item.docCount,
        }));
        yield put(loadChartDataSuccess({ name: field.name, data }));
    }

    yield delay(500);
}

export default function*() {
    yield fork(function*() {
        yield takeLatest(LOAD_CHART_DATA, handleLoadChartDataRequest);
    });
    yield fork(function*() {
        yield takeLatest(PRE_LOAD_CHART_DATA, handlePreLoadChartData);
    });
}
