import {
    createTheme,
    ThemeProvider as MuiThemeProvider,
} from '@mui/material/styles';
import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import PropTypes from 'prop-types';
import React from 'react';
import { Provider } from 'react-redux';

import userEvent from '@testing-library/user-event';
import defaultMuiTheme from './app/custom/themes/default/defaultTheme';
import sagas from './app/js/admin/sagas';
import { AnnotationStorageProvider } from './app/js/annotation/annotationStorage';
import configureStore from './app/js/configureStore';
import reducers from './app/js/public/reducers';

// custom/themes/default/defaultTheme';

// @ts-expect-error TS7017
global.__DEBUG__ = false;

const memoryHistory = createMemoryHistory();

const { store } = configureStore(reducers, sagas, {}, memoryHistory);
const theme = createTheme(defaultMuiTheme, {
    userAgent: navigator.userAgent,
});

const Wrapper = ({ children }: any) => (
    <Provider store={store}>
        <AnnotationStorageProvider>
            <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
        </AnnotationStorageProvider>
    </Provider>
);

Wrapper.propTypes = {
    children: PropTypes.node.isRequired,
};

const customRender = (ui, options) =>
    render(ui, { wrapper: Wrapper, ...options });

export {
    act,
    buildQueries,
    cleanup,
    configure,
    createEvent,
    findAllByAltText,
    findAllByDisplayValue,
    findAllByLabelText,
    findAllByPlaceholderText,
    findAllByRole,
    findAllByTestId,
    findAllByText,
    findAllByTitle,
    findByAltText,
    findByDisplayValue,
    findByLabelText,
    findByPlaceholderText,
    findByRole,
    findByTestId,
    findByText,
    findByTitle,
    fireEvent,
    getAllByAltText,
    getAllByDisplayValue,
    getAllByLabelText,
    getAllByPlaceholderText,
    getAllByRole,
    getAllByTestId,
    getAllByText,
    getAllByTitle,
    getByAltText,
    getByDisplayValue,
    getByLabelText,
    getByPlaceholderText,
    getByRole,
    getByTestId,
    getByText,
    getByTitle,
    getConfig,
    getDefaultNormalizer,
    getElementError,
    getNodeText,
    getQueriesForElement,
    getRoles,
    getSuggestedQuery,
    isInaccessible,
    logDOM,
    logRoles,
    prettyDOM,
    prettyFormat,
    queries,
    queryAllByAltText,
    queryAllByAttribute,
    queryAllByDisplayValue,
    queryAllByLabelText,
    queryAllByPlaceholderText,
    queryAllByRole,
    queryAllByTestId,
    queryAllByText,
    queryAllByTitle,
    queryByAltText,
    queryByAttribute,
    queryByDisplayValue,
    queryByLabelText,
    queryByPlaceholderText,
    queryByRole,
    queryByTestId,
    queryByText,
    queryByTitle,
    queryHelpers,
    screen,
    waitFor,
    waitForElementToBeRemoved,
    within,
} from '@testing-library/react';

export { customRender as render, userEvent };
