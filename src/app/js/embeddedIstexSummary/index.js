import '@babel/polyfill';
import 'url-api-polyfill';

import React from 'react';
import { render } from 'react-dom';
import Polyglot from 'node-polyglot';

import {
    createTheme,
    ThemeProvider as MuiThemeProvider,
} from '@mui/material/styles';

import phrasesFor from '../i18n/translations';
import getLocale from '../../../common/getLocale';
import customTheme from '../../custom/themes/default/defaultTheme';
import FieldProvider from './FieldProvider';
import { IstexSummaryView } from '../formats/other/istexSummary/IstexSummaryView';

const locale = getLocale();
const polyglot = new Polyglot({
    locale,
    phrases: phrasesFor(locale),
});

const theme = createTheme(customTheme, {
    userAgent: navigator.userAgent,
});

const App = (props) => (
    <MuiThemeProvider theme={theme}>
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

elements.forEach((element) => {
    const props = {
        api: element.getAttribute('data-api'),
        uri: element.getAttribute('data-uri'),
        fieldName: element.getAttribute('data-field-name'),
    };

    render(<App {...props} />, element);
});
