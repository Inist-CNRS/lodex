import React from 'react';

import { SearchForm } from './SearchForm';

import fieldApi from '../../admin/api/field';
import * as overview from '../../../../common/overview';
import { fireEvent, render, within } from '@testing-library/react';
jest.mock('../../admin/api/field', () => ({
    patchSearchableFields: jest.fn(),
    patchOverview: jest.fn(),
}));

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

        fieldApi.patchSearchableFields.mockResolvedValue(true);

        const { getByTestId } = render(
            <SearchForm loadField={jest.fn()} fields={fields} p={polyglot} />,
        );

        const autocomplete = getByTestId('autocomplete_search_in_fields');
        const input = within(autocomplete).getByRole('textbox');
        autocomplete.focus();
        fireEvent.change(input, { target: { value: 'a' } });
        fireEvent.keyDown(autocomplete, { key: 'ArrowDown' });
        fireEvent.keyDown(autocomplete, { key: 'Enter' });

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

        fieldApi.patchOverview.mockResolvedValue(true);

        const polyglot = { t: jest.fn().mockReturnValue('translate') };

        const { getByTestId } = render(
            <SearchForm loadField={jest.fn()} fields={fields} p={polyglot} />,
        );

        const autocomplete = getByTestId(
            `autocomplete_search_syndication_${overview.RESOURCE_TITLE}`,
        );
        const input = within(autocomplete).getByRole('textbox');
        autocomplete.focus();
        fireEvent.change(input, { target: { value: 'abstract' } });
        fireEvent.keyDown(autocomplete, { key: 'ArrowDown' });
        fireEvent.keyDown(autocomplete, { key: 'ArrowDown' });
        fireEvent.keyDown(autocomplete, { key: 'Enter' });

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

        fieldApi.patchOverview.mockResolvedValue(true);

        const polyglot = { t: jest.fn().mockReturnValue('search_input') };

        const { getByTestId } = render(
            <SearchForm
                loadField={jest.fn()}
                fields={fields}
                fieldsForResourceSyndication={fields}
                p={polyglot}
            />,
        );

        const autocomplete = getByTestId(
            `autocomplete_search_syndication_${overview.RESOURCE_DESCRIPTION}`,
        );
        const input = within(autocomplete).getByRole('textbox');
        autocomplete.focus();
        fireEvent.change(input, { target: { value: 'a' } });
        fireEvent.keyDown(autocomplete, { key: 'ArrowDown' });
        fireEvent.keyDown(autocomplete, { key: 'ArrowDown' });
        fireEvent.keyDown(autocomplete, { key: 'Enter' });

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

        fieldApi.patchOverview.mockResolvedValue(true);

        const polyglot = { t: jest.fn().mockReturnValue('search_input') };

        const { getByTestId } = render(
            <SearchForm
                loadField={jest.fn()}
                fields={fields}
                fieldsForResourceSyndication={fields}
                p={polyglot}
            />,
        );

        const autocomplete = getByTestId(
            `autocomplete_search_syndication_${overview.RESOURCE_DETAIL_1}`,
        );
        const input = within(autocomplete).getByRole('textbox');
        autocomplete.focus();
        fireEvent.change(input, { target: { value: 'a' } });
        fireEvent.keyDown(autocomplete, { key: 'ArrowDown' });
        fireEvent.keyDown(autocomplete, { key: 'ArrowDown' });
        fireEvent.keyDown(autocomplete, { key: 'Enter' });

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

        fieldApi.patchOverview.mockResolvedValue(true);

        const polyglot = { t: jest.fn().mockReturnValue('search_input') };

        const { getByTestId } = render(
            <SearchForm
                loadField={jest.fn()}
                fields={fields}
                fieldsForResourceSyndication={fields}
                p={polyglot}
            />,
        );

        const autocomplete = getByTestId(
            `autocomplete_search_syndication_${overview.RESOURCE_DETAIL_2}`,
        );
        const input = within(autocomplete).getByRole('textbox');
        autocomplete.focus();
        fireEvent.change(input, { target: { value: 'a' } });
        fireEvent.keyDown(autocomplete, { key: 'ArrowDown' });
        fireEvent.keyDown(autocomplete, { key: 'ArrowDown' });
        fireEvent.keyDown(autocomplete, { key: 'Enter' });

        expect(fieldApi.patchOverview).toHaveBeenCalledWith({
            _id: '1',
            overview: 4,
        });
    });
});
