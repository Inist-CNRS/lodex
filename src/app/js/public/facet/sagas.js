import { all, call, put, select, takeLatest } from 'redux-saga/effects';

import fetchSaga from '../../lib/sagas/fetchSaga';
import { fromUser } from '../../sharedSelectors';

export default ({ actionTypes, actions, selectors }) => {
    const handleLoadFacetValuesRequest = function* ({ payload: { name } }) {
        const data = yield select(selectors.getFacetValueRequestData, name);
        const request = yield select(fromUser.getLoadFacetValuesRequest, {
            field: name,
            ...data,
        });

        const { error, response: values } = yield call(fetchSaga, request);

        if (error) {
            return yield put(actions.loadFacetValuesError(error));
        }

        return yield put(actions.loadFacetValuesSuccess({ name, values }));
    };

    const handleClearFacetsRequest = function* ({ payload }) {
        // If payload is defined, we only clear one facet so we do not reset the fields filters
        if (payload) {
            return;
        }

        const facetsValues = yield select(selectors.getFacetsValues);

        yield all(
            Object.keys(facetsValues).map((name) =>
                put(
                    actions.changeFacetValue({
                        name,
                        perPage: facetsValues[name].perPage,
                        currentPage: 0,
                        filter: '',
                    }),
                ),
            ),
        );
    };

    return function* facetSagas() {
        yield takeLatest(
            [
                actionTypes.OPEN_FACET,
                actionTypes.LOAD_FACET_VALUES,
                actionTypes.FACET_VALUE_CHANGE,
                actionTypes.FACET_VALUE_SORT,
            ],
            handleLoadFacetValuesRequest,
        );

        yield takeLatest([actionTypes.CLEAR_FACET], handleClearFacetsRequest);
    };
};
