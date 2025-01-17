import { applyMiddleware, compose, createStore, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { createReduxHistoryContext } from 'redux-first-history';

const sagaMiddleware = createSagaMiddleware();

export default function configureStoreServer(
    reducers,
    sagas,
    initialState,
    history,
) {
    const { createReduxHistory, routerMiddleware, routerReducer } =
        createReduxHistoryContext({ history });
    const middlewares = applyMiddleware(routerMiddleware, sagaMiddleware);

    const devtools =
        typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__
            ? window.__REDUX_DEVTOOLS_EXTENSION__()
            : (f) => f;

    const rootReducer = combineReducers({
        ...reducers,
        router: routerReducer,
    });

    const store = createStore(
        rootReducer,
        initialState,
        compose(middlewares, devtools),
    );

    sagaMiddleware.run(sagas);
    store.runSaga = sagaMiddleware.run;

    return { store, history: createReduxHistory(store) };
}
