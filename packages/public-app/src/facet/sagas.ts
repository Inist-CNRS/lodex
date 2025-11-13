import { call, put, select, take, takeLatest } from 'redux-saga/effects';

import fetchSaga from '@lodex/frontend-common/fetch/fetchSaga';
import { fromUser } from '@lodex/frontend-common/sharedSelectors';

// @ts-expect-error TS7031
export default ({ actionTypes, actions, selectors }) => {
    // @ts-expect-error TS7031
    const handleLoadFacetValuesRequest = function* ({ payload: { name } }) {
        // @ts-expect-error TS7057
        const data = yield select(selectors.getFacetValueRequestData, name);
        // @ts-expect-error TS7057
        const request = yield select(fromUser.getLoadFacetValuesRequest, {
            field: name,
            ...data,
        });

        const { error, response: values } = yield call(fetchSaga, request);

        if (error) {
            // @ts-expect-error TS7057
            return yield put(actions.loadFacetValuesError(error));
        }

        // @ts-expect-error TS7057
        return yield put(actions.loadFacetValuesSuccess({ name, values }));
    };

    // @ts-expect-error TS7031
    const handleClearFacetsRequest = function* ({ payload }) {
        // @ts-expect-error TS7057
        const facetsValues = yield select(selectors.getFacetsValues);

        const facetsToReset = Object.keys(facetsValues).filter(
            (name) => !payload || name === payload,
        );

        for (const name of facetsToReset) {
            yield put(
                actions.changeFacetValue({
                    name,
                    perPage: facetsValues[name].perPage,
                    currentPage: 0,
                    filter: '',
                }),
            );

            yield take([actionTypes.LOAD_FACET_VALUES_SUCCESS]);
        }
    };

    return function* facetSagas() {
        yield takeLatest(
            // @ts-expect-error TS2769
            [
                actionTypes.OPEN_FACET,
                actionTypes.LOAD_FACET_VALUES,
                actionTypes.FACET_VALUE_CHANGE,
                actionTypes.FACET_VALUE_SORT,
            ],
            handleLoadFacetValuesRequest,
        );

        // @ts-expect-error TS2769
        yield takeLatest([actionTypes.CLEAR_FACET], handleClearFacetsRequest);
    };
};
