import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { createMemoryHistory } from 'history';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import PropTypes from 'prop-types';

import configureStore from './app/js/configureStore';
import createRootReducer from './app/js/public/reducers';
import sagas from './app/js/admin/sagas';

global.__DEBUG__ = false;

const history = createMemoryHistory();

const store = configureStore(createRootReducer(history), sagas, {}, history);

const Wrapper = ({ children }) => (
    <Provider store={store}>
        <MuiThemeProvider>
            <ConnectedRouter history={history} onUpdate={() => {}}>
                {children}
            </ConnectedRouter>
        </MuiThemeProvider>
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

export { customRender as render };
