import '@babel/polyfill';
import 'url-api-polyfill';

import React from 'react';
import { render } from 'react-dom';

// import phrasesFor from '../i18n/translations';
// import getLocale from '../../../common/getLocale';

// const language = getLocale();
// const phrases = phrasesFor(language);

const App = () => <h1>ISTEX Summary</h1>;

const element = document.getElementById('embedded-istex-summary');

if (element) {
    render(<App />, element);
}
