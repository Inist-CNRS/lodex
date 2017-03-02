import { hashHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import persistState, { mergePersistedState } from 'redux-localstorage';
import adapter from 'redux-localstorage/lib/adapters/localStorage';
import filter from 'redux-localstorage-filter';

const sagaMiddleware = createSagaMiddleware();

export default function configureStore(rootReducer, sagas, initialState) {
    const reducer = compose(
        mergePersistedState(),
    )(rootReducer);

    const storage = compose(
        filter('user.token'),
    )(adapter(window.sessionStorage));

    const middlewares = applyMiddleware(
        sagaMiddleware,
        routerMiddleware(hashHistory),
    );

    const devtools = (typeof window !== 'undefined' && window.devToolsExtension)
        ? window.devToolsExtension()
        : f => f;

    const persistStateEnhancer = persistState(storage);

    const store = createStore(
        reducer,
        initialState,
        compose(middlewares, persistStateEnhancer, devtools),
    );

    sagaMiddleware.run(sagas);
    return store;
}
