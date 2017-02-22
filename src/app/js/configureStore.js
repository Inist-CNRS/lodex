import { hashHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import persistState from 'redux-localstorage';

const sagaMiddleware = createSagaMiddleware();

export default function configureStore(rootReducer, sagas, initialState) {
    const middlewares = applyMiddleware(
        sagaMiddleware,
        routerMiddleware(hashHistory),
    );

    const devtools = (typeof window !== 'undefined' && window.devToolsExtension)
        ? window.devToolsExtension()
        : f => f;

    const persistStateEnhancer = persistState('user');

    const store = createStore(
        rootReducer,
        initialState,
        compose(middlewares, persistStateEnhancer, devtools),
    );

    sagaMiddleware.run(sagas);
    return store;
}
