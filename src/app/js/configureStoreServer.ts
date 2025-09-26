import { applyMiddleware, compose, createStore, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { createReduxHistoryContext } from 'redux-first-history';

const sagaMiddleware = createSagaMiddleware();

export default function configureStoreServer(
    // @ts-expect-error TS7006
    reducers,
    // @ts-expect-error TS7006
    sagas,
    // @ts-expect-error TS7006
    initialState,
    // @ts-expect-error TS7006
    history,
) {
    const { createReduxHistory, routerMiddleware, routerReducer } =
        createReduxHistoryContext({ history });
    const middlewares = applyMiddleware(routerMiddleware, sagaMiddleware);

    const devtools =
        // @ts-expect-error TS2339
        typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__
            ? // @ts-expect-error TS2339
              window.__REDUX_DEVTOOLS_EXTENSION__()
            : // @ts-expect-error TS7006
              (f) => f;

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
    // @ts-expect-error TS2339
    store.runSaga = sagaMiddleware.run;

    return { store, history: createReduxHistory(store) };
}
