import { routerMiddleware, connectRouter } from 'connected-react-router';
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
        typeof window !== 'undefined' && window.devToolsExtension
            ? window.devToolsExtension()
            : f => f;

    const store = createStore(
        connectRouter(history)(reducer),
        initialState,
        compose(middlewares, devtools),
    );

    sagaMiddleware.run(sagas);
    store.runSaga = sagaMiddleware.run;

    return store;
}
