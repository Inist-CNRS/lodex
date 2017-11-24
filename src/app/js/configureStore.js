import { routerMiddleware } from 'react-router-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import persistState, { mergePersistedState } from 'redux-localstorage';
import adapter from 'redux-localstorage/lib/adapters/localStorage';
import filter from 'redux-localstorage-filter';

const sagaMiddleware = createSagaMiddleware();

export default function configureStore(
    pureReducer,
    sagas,
    initialState,
    history,
) {
    const rootReducer = __DEBUG__
        ? (state, action) => {
              switch (action.type) {
                  case 'SET_STATE':
                      return action.state || pureReducer({}, action);
                  default:
                      return pureReducer(state, action);
              }
          }
        : pureReducer;

    const reducer = compose(mergePersistedState())(rootReducer);

    const storage = compose(filter('user'))(adapter(window.sessionStorage));

    const middlewares = applyMiddleware(
        sagaMiddleware,
        routerMiddleware(history),
    );

    const devtools =
        typeof window !== 'undefined' && window.devToolsExtension
            ? window.devToolsExtension()
            : f => f;

    const persistStateEnhancer = persistState(storage);

    const store = createStore(
        reducer,
        initialState,
        compose(middlewares, persistStateEnhancer, devtools),
    );

    sagaMiddleware.run(sagas);
    if (__DEBUG__) {
        window.store = store;
    }

    return store;
}
