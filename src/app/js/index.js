import 'babel-polyfill';
import 'whatwg-fetch';

import injectTapEventPlugin from 'react-tap-event-plugin';

import React from 'react';
import { render } from 'react-dom';
import Root from './Root';
import rootReducer from './reducers';
import configureStore from './configureStore';

const store = configureStore(rootReducer);

injectTapEventPlugin();

render(
    <Root {...{ store }} />,
    document.getElementById('root'),
);

// Hot Module Replacement API
if (module.hot) {
    module.hot.accept('./Root', () => {
        const NewRoot = require('./Root').default; // eslint-disable-line
        render(<NewRoot {...{ store }} />, document.getElementById('root'));
    });
}
