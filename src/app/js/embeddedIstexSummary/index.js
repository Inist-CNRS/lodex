import '@babel/polyfill';
import 'url-api-polyfill';

import React from 'react';
import { render } from 'react-dom';
import Polyglot from 'node-polyglot';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import getLocale from '../../../common/getLocale';

const language = getLocale();

const polyglot = new Polyglot({
    phrases: language.includes('fr') ? __FR__ : __EN__,
});

import customTheme from '../public/customTheme';
import FieldProvider from './FieldProvider';
import { IstexSummaryView } from '../formats/istexSummary/IstexSummaryView';

const muiTheme = getMuiTheme(customTheme, {
    userAgent: navigator.userAgent,
});

const App = props => (
    <MuiThemeProvider muiTheme={muiTheme}>
        <FieldProvider {...props}>
            {({ resource, field, formatData }) => (
                <IstexSummaryView
                    {...field.format.args}
                    field={field}
                    resource={resource}
                    formatData={formatData}
                    p={polyglot}
                    showEmbedButton={false}
                />
            )}
        </FieldProvider>
    </MuiThemeProvider>
);

const elements = document.querySelectorAll('.embedded-istex-summary');

elements.forEach(element => {
    const props = {
        api: element.getAttribute('data-api'),
        uri: element.getAttribute('data-uri'),
        fieldName: element.getAttribute('data-field-name'),
    };

    render(<App {...props} />, element);
});
