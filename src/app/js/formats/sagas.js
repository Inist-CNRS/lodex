import {
    call,
    put,
    select,
    takeEvery,
    throttle,
    all,
} from 'redux-saga/effects';
import get from 'lodash/get';

import {
    LOAD_FORMAT_DATA,
    loadFormatDataSuccess,
    loadFormatDataError,
} from './reducer';
import getQueryString from '../lib/getQueryString';
import fetchSaga from '../lib/sagas/fetchSaga';
import { fromDataset, fromFormat } from '../public/selectors';
import { fromFields, fromUser, fromCharacteristic } from '../sharedSelectors';
import { APPLY_FILTER, facetActionTypes } from '../public/dataset';
import { CONFIGURE_FIELD_SUCCESS } from '../fields';
import { UPDATE_CHARACTERISTICS_SUCCESS } from '../characteristic';
import { SCOPE_DATASET, SCOPE_GRAPHIC } from '../../../common/scope';
import { ISTEX_API_URL } from '../../../common/externals';
import { isPrecomputed } from './checkPredicate';

const isSparqlQuery = (url) =>
    url.toLowerCase().includes('select') &&
    url.toLowerCase().includes('where') &&
    url.toLowerCase().includes('?query=');

const isIstexQuery = (url) => url.includes(ISTEX_API_URL);

export const getQueryType = (url) => {
    if (isSparqlQuery(url)) {
        return 'sparql';
    }

    if (isIstexQuery(url)) {
        return 'istex';
    }

    return 'other';
};

export function* getQuery(url, queryString) {
    const queryType = yield call(getQueryType, url);
    switch (queryType) {
        case 'sparql': {
            const newUrl = url.split('?query=')[0];
            const body = 'query=' + url.split('?query=')[1];

            return yield select(fromUser.getSparqlRequest, {
                url: newUrl,
                body,
            });
        }
        case 'istex': {
            return yield select(fromUser.getIstexRequest, {
                url,
                queryString,
            });
        }
        default:
            return yield select(fromUser.getUrlRequest, {
                url,
                queryString,
            });
    }
}

export function* loadFormatData(name, url, queryString) {
    const request = yield call(getQuery, url, queryString);

    const { error, response } = yield call(fetchSaga, request);
    if (error) {
        yield put(loadFormatDataError({ name, error: error.message }));
        return;
    }
    if (response.data) {
        yield put(
            loadFormatDataSuccess({
                name,
                data: response.data,
                total: response.total,
            }),
        );
        return;
    }

    if (response.total === 0) {
        yield put(
            loadFormatDataSuccess({ name, data: [], total: response.total }),
        );
        return;
    }

    yield put(
        loadFormatDataSuccess({ name, data: response, total: response.total }),
    );
}

export const splitPrecomputedNameAndRoutine = (value) => {
    if (!value || typeof value !== 'string') {
        return {
            precomputedName: null,
            routine: null,
        };
    }

    let url = null;
    try {
        url = new URL(value);

        return {
            precomputedName: url.searchParams.get('precomputedName'),
            routine: `${url.protocol}//${url.host}${url.pathname}`,
        };
    } catch (_) {
        url = new URL(`http://${value}`);
    }

    return {
        precomputedName: url.searchParams.get('precomputedName'),
        routine: `/${url.host}${url.pathname}`,
    };
};

export function* handleLoadFormatDataRequest({
    payload: {
        field,
        filter,
        value: rawValue,
        resource,
        withUri,
        withFacets,
    } = {},
}) {
    const name = field && field.name;
    if (!name) {
        return;
    }

    let value = rawValue;
    let precomputed = {};
    if (isPrecomputed(field)) {
        const precomputedFieldValue = splitPrecomputedNameAndRoutine(rawValue);
        precomputed = {
            precomputedName: precomputedFieldValue.precomputedName,
        };
        value = precomputedFieldValue.routine;
    }

    if (typeof value !== 'string') {
        yield put(
            loadFormatDataError({
                name,
                error: 'bad value',
            }),
        );
        return;
    }

    if ([SCOPE_DATASET, SCOPE_GRAPHIC].includes(field.scope) && withFacets) {
        yield handleFilterFormatDataRequest({ payload: { filter } });
        return;
    }

    const params = yield select(fromFields.getGraphFieldParamsByName, name);
    const uri = get(resource, 'uri', undefined);

    const queryString = yield call(getQueryString, {
        params: {
            ...precomputed,
            ...params,
            ...(filter || {}),
            ...(withUri && { uri }),
        },
    });

    yield call(loadFormatData, name, value, queryString);
}

export function* loadFormatDataForName(name, filter) {
    const field = yield select(fromFields.getFieldByName, name);
    if (!field || ![SCOPE_DATASET, SCOPE_GRAPHIC].includes(field.scope)) {
        return;
    }
    const url = yield select(fromCharacteristic.getCharacteristicByName, name);
    const { precomputedName, routine } = splitPrecomputedNameAndRoutine(url);
    const precomputed = isPrecomputed(field) ? { precomputedName } : {};

    const params = yield select(fromFields.getGraphFieldParamsByName, name);

    let facets = yield select(fromDataset.getAppliedFacets);
    facets = Object.keys(facets).reduce((acc, facetName) => {
        acc[facetName] = facets[facetName].map(
            (facetValue) => facetValue.value,
        );
        return acc;
    }, {});
    const invertedFacets = yield select(fromDataset.getInvertedFacetKeys);
    const match = yield select(fromDataset.getFilter);

    const queryString = yield call(getQueryString, {
        facets,
        invertedFacets,
        match,
        params: {
            ...precomputed,
            ...params,
            ...(filter || {}),
        },
    });

    yield call(loadFormatData, name, routine, queryString);
}

export function* handleFilterFormatDataRequest({ payload: { filter } = {} }) {
    const names = yield select(fromFormat.getCurrentFieldNames);

    if (!names || !names.length) {
        return;
    }

    yield all(names.map((name) => call(loadFormatDataForName, name, filter)));
}

export default function* () {
    // see https://github.com/redux-saga/redux-saga/blob/master/docs/api/README.md#throttlems-pattern-saga-args
    yield throttle(
        500,
        [
            facetActionTypes.TOGGLE_FACET_VALUE,
            facetActionTypes.SET_ALL_VALUE_FOR_FACET,
            facetActionTypes.CLEAR_FACET,
            APPLY_FILTER,
            facetActionTypes.INVERT_FACET,
            CONFIGURE_FIELD_SUCCESS,
            UPDATE_CHARACTERISTICS_SUCCESS,
        ],
        handleFilterFormatDataRequest,
    );
    yield takeEvery(LOAD_FORMAT_DATA, handleLoadFormatDataRequest);
}
