import {
    call,
    put,
    select,
    takeEvery,
    throttle,
    all,
} from 'redux-saga/effects';
import get from 'lodash/get';

import { SCOPE_DATASET, SCOPE_GRAPHIC } from '@lodex/common';
import {
    LOAD_FORMAT_DATA,
    loadFormatDataSuccess,
    loadFormatDataError,
} from './reducer';
import getQueryString from '../lib/getQueryString';
import fetchSaga from '@lodex/frontend-common/fetch/fetchSaga';
import {
    fromDataset,
    fromFormat,
} from '../../../../packages/public-app/src/selectors';
import { fromFields, fromUser, fromCharacteristic } from '../sharedSelectors';
import {
    APPLY_FILTER,
    facetActionTypes,
} from '../../../../packages/public-app/src/dataset';
import { CONFIGURE_FIELD_SUCCESS } from '../fields';
import { UPDATE_CHARACTERISTICS_SUCCESS } from '../characteristic';
import { ISTEX_API_URL } from '../api/externals';
import { isPrecomputed } from './checkPredicate';

// @ts-expect-error TS7006
const isSparqlQuery = (url) =>
    url.toLowerCase().includes('select') &&
    url.toLowerCase().includes('where') &&
    url.toLowerCase().includes('?query=');

// @ts-expect-error TS7006
const isIstexQuery = (url) => url.includes(ISTEX_API_URL);

// @ts-expect-error TS7006
export const getQueryType = (url) => {
    if (isSparqlQuery(url)) {
        return 'sparql';
    }

    if (isIstexQuery(url)) {
        return 'istex';
    }

    return 'other';
};

// @ts-expect-error TS7006
export function* getQuery(url, queryString) {
    // @ts-expect-error TS7057
    const queryType = yield call(getQueryType, url);
    switch (queryType) {
        case 'sparql': {
            const newUrl = url.split('?query=')[0];
            const body = 'query=' + url.split('?query=')[1];

            // @ts-expect-error TS7057
            return yield select(fromUser.getSparqlRequest, {
                url: newUrl,
                body,
            });
        }
        case 'istex': {
            // @ts-expect-error TS7057
            return yield select(fromUser.getIstexRequest, {
                url,
                queryString,
            });
        }
        default:
            // @ts-expect-error TS7057
            return yield select(fromUser.getUrlRequest, {
                url,
                queryString,
            });
    }
}

// @ts-expect-error TS7006
export function* loadFormatData(name, url, queryString) {
    // @ts-expect-error TS7057
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

// @ts-expect-error TS7006
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
    } catch (_e) {
        url = new URL(`http://${value}`);
    }

    return {
        precomputedName: url.searchParams.get('precomputedName'),
        routine: `/${url.host}${url.pathname}`,
    };
};

export function* handleLoadFormatDataRequest({
    payload: {
        // @ts-expect-error TS2525
        field,
        // @ts-expect-error TS2525
        filter,
        // @ts-expect-error TS2525
        value: rawValue,
        // @ts-expect-error TS2525
        resource,
        // @ts-expect-error TS2525
        withUri,
        // @ts-expect-error TS2525
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

    // @ts-expect-error TS7057
    const params = yield select(fromFields.getGraphFieldParamsByName, name);
    const uri = get(resource, 'uri', undefined);

    // @ts-expect-error TS7057
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

// @ts-expect-error TS7006
export function* loadFormatDataForName(name, filter) {
    // @ts-expect-error TS7057
    const field = yield select(fromFields.getFieldByName, name);
    if (!field || ![SCOPE_DATASET, SCOPE_GRAPHIC].includes(field.scope)) {
        return;
    }
    // @ts-expect-error TS7057
    const url = yield select(fromCharacteristic.getCharacteristicByName, name);
    const { precomputedName, routine } = splitPrecomputedNameAndRoutine(url);
    const precomputed = isPrecomputed(field) ? { precomputedName } : {};

    // @ts-expect-error TS7057
    const params = yield select(fromFields.getGraphFieldParamsByName, name);

    // @ts-expect-error TS7057
    let facets = yield select(fromDataset.getAppliedFacets);
    facets = Object.keys(facets).reduce((acc, facetName) => {
        // @ts-expect-error TS7053
        acc[facetName] = facets[facetName].map(
            // @ts-expect-error TS7006
            (facetValue) => facetValue.value,
        );
        return acc;
    }, {});
    // @ts-expect-error TS7057
    const invertedFacets = yield select(fromDataset.getInvertedFacetKeys);
    // @ts-expect-error TS7057
    const match = yield select(fromDataset.getFilter);

    // @ts-expect-error TS7057
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

// @ts-expect-error TS2525
export function* handleFilterFormatDataRequest({ payload: { filter } = {} }) {
    // @ts-expect-error TS7057
    const names = yield select(fromFormat.getCurrentFieldNames);

    if (!names || !names.length) {
        return;
    }

    // @ts-expect-error TS7006
    yield all(names.map((name) => call(loadFormatDataForName, name, filter)));
}

export default function* () {
    // see https://github.com/redux-saga/redux-saga/blob/master/docs/api/README.md#throttlems-pattern-saga-args
    yield throttle(
        500,
        // @ts-expect-error TS2769
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
    // @ts-expect-error TS2769
    yield takeEvery(LOAD_FORMAT_DATA, handleLoadFormatDataRequest);
}
