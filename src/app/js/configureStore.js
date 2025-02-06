import { applyMiddleware, compose, combineReducers, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import persistState, { mergePersistedState } from 'redux-localstorage';
import adapter from 'redux-localstorage/lib/adapters/localStorage';
import filter from 'redux-localstorage-filter';
import { createReduxHistoryContext } from 'redux-first-history';

const sagaMiddleware = createSagaMiddleware();

export default function configureStore(reducers, sagas, initialState, history) {
    const { createReduxHistory, routerMiddleware, routerReducer } =
        createReduxHistoryContext({ history });

    const pureReducer = combineReducers({
        ...reducers,
        router: routerReducer,
    });
    const rootReducer = __DEBUG__
        ? (state, action) => {
              if (action.type == 'SET_STATE') {
                  return action.state || pureReducer({}, action);
              }
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
        typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__
            ? window.__REDUX_DEVTOOLS_EXTENSION__()
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
    if (__DEBUG__) {
        window.store = store;
    }

    return { store, history: createReduxHistory(store) };
}
