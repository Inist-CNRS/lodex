// @ts-expect-error TS6133
import React from 'react';

import { SearchForm } from './SearchForm';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, waitFor, within } from '@testing-library/react';
import PropTypes from 'prop-types';
import { Overview } from '@lodex/common';
import fieldApi from '../../admin/api/field';
import { render } from '../../../../test-utils.tsx';

jest.mock('../../admin/api/field', () => ({
    patchSearchableFields: jest.fn(),
    patchOverview: jest.fn(),
}));

// eslint-disable-next-line react/display-name
jest.mock('../../fields/FieldRepresentation', () => () => (
    <div>FieldRepresentation</div>
));

// @ts-expect-error TS7006
function TestSearchForm(props) {
    if (props.p) {
        props.p.currentLocale = 'fr';
    }
    return (
        <QueryClientProvider client={new QueryClient()}>
            <SearchForm {...props} />
        </QueryClientProvider>
    );
}

TestSearchForm.propTypes = {
    p: PropTypes.shape({
        t: PropTypes.func,
        currentLocale: PropTypes.string,
    }),
};

describe('handleSearchInFieldsChange', () => {
    it('should call fieldApi.patchSearchableFields with correct parameters', async () => {
        const fields = [
            {
                _id: '1',
                label: 'abstract',
                name: 'abstract',
                scope: 'document',
            },
            { _id: '2', label: 'test2', name: 'test2', scope: 'document' },
        ];

        const polyglot = { t: jest.fn().mockReturnValue('searchable_success') };

        // @ts-expect-error TS2339
        fieldApi.patchSearchableFields.mockResolvedValue(true);

        const { getByTestId } = render(
            <TestSearchForm
                // @ts-expect-error TS2322
                loadField={jest.fn()}
                fields={fields}
                p={polyglot}
            />,
        );

        const autocomplete = getByTestId('autocomplete_search_in_fields');
        const input = within(autocomplete).getByRole('textbox');

        await waitFor(() => {
            autocomplete.focus();
        });

        await waitFor(() => {
            fireEvent.change(input, { target: { value: 'a' } });
        });

        await waitFor(() => {
            fireEvent.keyDown(autocomplete, { key: 'ArrowDown' });
        });

        await waitFor(() => {
            fireEvent.keyDown(autocomplete, { key: 'Enter' });
        });

        expect(fieldApi.patchSearchableFields).toHaveBeenCalledWith([
            {
                _id: '1',
                label: 'abstract',
                name: 'abstract',
                scope: 'document',
            },
        ]);
    });
});

describe('saveSyndication', () => {
    it('should call fieldApi.patchOverview when update title syndication', async () => {
        const fields = [
            {
                _id: '1',
                label: 'abstract',
                name: 'abstract',
                scope: 'document',
            },
            { _id: '2', label: 'test2', name: 'test2', scope: 'document' },
        ];

        // @ts-expect-error TS2339
        fieldApi.patchOverview.mockResolvedValue(true);

        const polyglot = { t: jest.fn().mockReturnValue('translate') };

        const { getByTestId } = render(
            <TestSearchForm
                // @ts-expect-error TS2322
                loadField={jest.fn()}
                fields={fields}
                p={polyglot}
            />,
        );

        const autocomplete = getByTestId(
            `autocomplete_search_syndication_${Overview.RESOURCE_TITLE}`,
        );
        const input = within(autocomplete).getByRole('textbox');
        autocomplete.focus();

        await waitFor(() => {
            fireEvent.change(input, { target: { value: 'abstract' } });
        });

        await waitFor(() => {
            fireEvent.keyDown(autocomplete, { key: 'ArrowDown' });
        });

        await waitFor(() => {
            fireEvent.keyDown(autocomplete, { key: 'ArrowDown' });
        });

        await waitFor(() => {
            fireEvent.keyDown(autocomplete, { key: 'Enter' });
        });

        expect(fieldApi.patchOverview).toHaveBeenCalledWith({
            _id: '1',
            overview: 1,
        });
    });
    it('should call fieldApi.patchOverview when update description syndication', async () => {
        const fields = [
            {
                _id: '1',
                label: 'abstract',
                name: 'abstract',
                scope: 'document',
            },
            { _id: '2', label: 'test2', name: 'test2', scope: 'document' },
        ];

        // @ts-expect-error TS2339
        fieldApi.patchOverview.mockResolvedValue(true);

        const polyglot = { t: jest.fn().mockReturnValue('search_input') };

        const { getByTestId } = render(
            <TestSearchForm
                // @ts-expect-error TS2322
                loadField={jest.fn()}
                fields={fields}
                fieldsForResourceSyndication={fields}
                p={polyglot}
            />,
        );

        const autocomplete = getByTestId(
            `autocomplete_search_syndication_${Overview.RESOURCE_DESCRIPTION}`,
        );
        const input = within(autocomplete).getByRole('textbox');
        autocomplete.focus();

        await waitFor(() => {
            fireEvent.change(input, { target: { value: 'a' } });
        });

        await waitFor(() => {
            fireEvent.keyDown(autocomplete, { key: 'ArrowDown' });
        });

        await waitFor(() => {
            fireEvent.keyDown(autocomplete, { key: 'ArrowDown' });
        });

        await waitFor(() => {
            fireEvent.keyDown(autocomplete, { key: 'Enter' });
        });

        expect(fieldApi.patchOverview).toHaveBeenCalledWith({
            _id: '1',
            overview: 2,
        });
    });
    it('should call fieldApi.patchOverview when update first detail syndication', async () => {
        const fields = [
            {
                _id: '1',
                label: 'abstract',
                name: 'abstract',
                scope: 'document',
            },
            { _id: '2', label: 'test2', name: 'test2', scope: 'document' },
        ];

        // @ts-expect-error TS2339
        fieldApi.patchOverview.mockResolvedValue(true);

        const polyglot = { t: jest.fn().mockReturnValue('search_input') };

        const { getByTestId } = render(
            <TestSearchForm
                // @ts-expect-error TS2322
                loadField={jest.fn()}
                fields={fields}
                fieldsForResourceSyndication={fields}
                p={polyglot}
            />,
        );

        const autocomplete = getByTestId(
            `autocomplete_search_syndication_${Overview.RESOURCE_DETAIL_1}`,
        );
        const input = within(autocomplete).getByRole('textbox');
        autocomplete.focus();

        await waitFor(() => {
            fireEvent.change(input, { target: { value: 'a' } });
        });

        await waitFor(() => {
            fireEvent.keyDown(autocomplete, { key: 'ArrowDown' });
        });

        await waitFor(() => {
            fireEvent.keyDown(autocomplete, { key: 'ArrowDown' });
        });

        await waitFor(() => {
            fireEvent.keyDown(autocomplete, { key: 'Enter' });
        });

        expect(fieldApi.patchOverview).toHaveBeenCalledWith({
            _id: '1',
            overview: 3,
        });
    });

    it('should call fieldApi.patchOverview when update second detail syndication', async () => {
        const fields = [
            {
                _id: '1',
                label: 'abstract',
                name: 'abstract',
                scope: 'document',
            },
            { _id: '2', label: 'test2', name: 'test2', scope: 'document' },
        ];

        // @ts-expect-error TS2339
        fieldApi.patchOverview.mockResolvedValue(true);

        const polyglot = { t: jest.fn().mockReturnValue('search_input') };

        const { getByTestId } = render(
            <TestSearchForm
                // @ts-expect-error TS2322
                loadField={jest.fn()}
                fields={fields}
                p={polyglot}
            />,
        );

        const autocomplete = getByTestId(
            `autocomplete_search_syndication_${Overview.RESOURCE_DETAIL_2}`,
        );
        const input = within(autocomplete).getByRole('textbox');
        autocomplete.focus();

        await waitFor(() => {
            fireEvent.change(input, { target: { value: 'a' } });
        });

        await waitFor(() => {
            fireEvent.keyDown(autocomplete, { key: 'ArrowDown' });
        });

        await waitFor(() => {
            fireEvent.keyDown(autocomplete, { key: 'ArrowDown' });
        });

        await waitFor(() => {
            fireEvent.keyDown(autocomplete, { key: 'Enter' });
        });

        expect(fieldApi.patchOverview).toHaveBeenCalledWith({
            _id: '1',
            overview: 4,
        });
    });
});
