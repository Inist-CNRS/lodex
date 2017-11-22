import { routerMiddleware } from 'react-router-redux';
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
        sagaMiddleware,
        routerMiddleware(history),
    );

    const devtools =
        typeof window !== 'undefined' && window.devToolsExtension
            ? window.devToolsExtension()
            : f => f;

    const store = createStore(
        reducer,
        initialState,
        compose(middlewares, devtools),
    );

    sagaMiddleware.run(sagas);
    store.runSaga = sagaMiddleware.run;

    return store;
}
