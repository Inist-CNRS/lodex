import { routerMiddleware } from 'connected-react-router';
import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';

const sagaMiddleware = createSagaMiddleware();

export default function configureStoreServer(
    reducer,
    sagas,
    initialState,
    history,
) {
    const middlewares = applyMiddleware(
        routerMiddleware(history),
        sagaMiddleware,
    );

    const devtools =
        typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__
            ? window.__REDUX_DEVTOOLS_EXTENSION__()
            : (f) => f;

    const store = createStore(
        reducer,
        initialState,
        compose(middlewares, devtools),
    );

    sagaMiddleware.run(sagas);
    store.runSaga = sagaMiddleware.run;

    return store;
}
