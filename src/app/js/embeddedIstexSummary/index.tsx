import '@babel/polyfill';
import 'url-api-polyfill';

import React from 'react';

// ignoring deprecation warning react 18 we are using version 17
// eslint-disable-next-line react/no-deprecated
import { render } from 'react-dom';
// @ts-expect-error TS7016
import Polyglot from 'node-polyglot';

import {
    createTheme,
    ThemeProvider as MuiThemeProvider,
} from '@mui/material/styles';

import phrasesFor from '../i18n/translations';
import getLocale from '../../../common/getLocale';
import defaultMuiTheme from '../../custom/themes/default/defaultTheme';
import FieldProvider from './FieldProvider';
import { IstexSummaryView } from '../formats/other/istexSummary/IstexSummaryView';

const locale = getLocale();
const polyglot = new Polyglot({
    locale,
    phrases: phrasesFor(locale),
});

const theme = createTheme(defaultMuiTheme, {
    userAgent: navigator.userAgent,
});

// @ts-expect-error TS7006
const App = (props) => (
    <MuiThemeProvider theme={theme}>
        <FieldProvider {...props}>
            {/*
             // @ts-expect-error TS7031 */}
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
