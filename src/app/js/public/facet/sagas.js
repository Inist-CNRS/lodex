import { call, put, select, takeLatest } from 'redux-saga/effects';

import { fromUser } from '../../sharedSelectors';
import fetchSaga from '../../lib/sagas/fetchSaga';
import scrollToTop from '../../lib/scrollToTop';

const scrollToTopSaga = function*() {
    yield call(scrollToTop, true);
};

export default ({ actionTypes, actions, selectors }) => {
    const handleLoadFacetValuesRequest = function*({ payload: { name } }) {
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

        yield takeLatest(actionTypes.TOGGLE_FACET_VALUE, scrollToTopSaga);
    };
};
