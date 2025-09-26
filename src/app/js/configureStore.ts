import { applyMiddleware, compose, combineReducers, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
// @ts-expect-error TS7016
import persistState, { mergePersistedState } from 'redux-localstorage';
// @ts-expect-error TS7016
import adapter from 'redux-localstorage/lib/adapters/localStorage';
// @ts-expect-error TS7016
import filter from 'redux-localstorage-filter';
import { createReduxHistoryContext } from 'redux-first-history';

const sagaMiddleware = createSagaMiddleware();

// @ts-expect-error TS7006
export default function configureStore(reducers, sagas, initialState, history) {
    const { createReduxHistory, routerMiddleware, routerReducer } =
        createReduxHistoryContext({ history });

    const pureReducer = combineReducers({
        ...reducers,
        router: routerReducer,
    });
    // @ts-expect-error TS2304
    const rootReducer = __DEBUG__
        // @ts-expect-error TS7006
        ? (state, action) => {
              if (action.type == 'SET_STATE') {
                  // @ts-expect-error TS2345
                  return action.state || pureReducer({}, action);
              }
              // @ts-expect-error TS2345
              return pureReducer(state, action);
          }
        : pureReducer;

    const reducer = compose(mergePersistedState())(rootReducer);

    const searchStorage = compose(filter(['search']))(
        adapter(window.sessionStorage),
    );
    const userStorage = compose(filter(['user']))(adapter(window.localStorage));

    const middlewares = applyMiddleware(routerMiddleware, sagaMiddleware);

    const devtools =
        // @ts-expect-error TS2339
        typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__
            // @ts-expect-error TS2339
            ? window.__REDUX_DEVTOOLS_EXTENSION__()
            // @ts-expect-error TS7006
            : (f) => f;

    const persistSearchStateEnhancer = persistState(searchStorage);
    const persistUserStateEnhancer = persistState(userStorage);

    const store = createStore(
        reducer,
        initialState,
        compose(
            middlewares,
            persistSearchStateEnhancer,
            persistUserStateEnhancer,
            devtools,
        ),
    );

    sagaMiddleware.run(sagas);
    // @ts-expect-error TS2304
    if (__DEBUG__) {
        // @ts-expect-error TS2551
        window.store = store;
    }

    return { store, history: createReduxHistory(store) };
}
