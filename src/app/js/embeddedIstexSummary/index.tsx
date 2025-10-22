import '@babel/polyfill';
import 'url-api-polyfill';

import { createRoot } from 'react-dom/client';

import {
    createTheme,
    ThemeProvider as MuiThemeProvider,
} from '@mui/material/styles';

import defaultMuiTheme from '../../custom/themes/default/defaultTheme';
import FieldProvider from './FieldProvider';
import { IstexSummaryView } from '../formats/other/istexSummary/IstexSummaryView';
import { I18N } from '../i18n/I18NContext';

const theme = createTheme(defaultMuiTheme, {
    userAgent: navigator.userAgent,
});

// @ts-expect-error TS7006
const App = (props) => (
    <MuiThemeProvider theme={theme}>
        <I18N>
            <FieldProvider {...props}>
                {({ resource, field, formatData }) => (
                    // @ts-expect-error TS2322
                    <IstexSummaryView
                        {...field.format.args}
                        field={field}
                        resource={resource}
                        formatData={formatData}
                        showEmbedButton={false}
                    />
                )}
            </FieldProvider>
        </I18N>
    </MuiThemeProvider>
);

const elements = document.querySelectorAll('.embedded-istex-summary');

elements.forEach((element) => {
    const root = createRoot(element);
    const props = {
        api: element.getAttribute('data-api'),
        uri: element.getAttribute('data-uri'),
        fieldName: element.getAttribute('data-field-name'),
    };

    root.render(<App {...props} />);
});
