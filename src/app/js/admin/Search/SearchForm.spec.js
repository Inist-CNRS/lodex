import React from 'react';

import { SearchForm } from './SearchForm';

import fieldApi from '../../admin/api/field';
import { fireEvent, render, within } from '@testing-library/react';
jest.mock('../../admin/api/field', () => ({
    patchSearchableFields: jest.fn(),
    patchField: jest.fn(),
}));

describe('handleSearchInFieldsChange', () => {
    it('should call fieldApi.patchSearchableFields with correct parameters', async () => {
        const fields = [
            { _id: '1', label: 'abstract', name: 'abstract' },
            { _id: '2', label: 'test2', name: 'test2' },
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
            { _id: '1', label: 'abstract', name: 'abstract' },
        ]);
    });
});

describe('saveSyndication', () => {
    it('should call fieldApi.patchField when update title syndication', async () => {
        const fields = [
            {
                _id: '1',
                label: 'abstract',
                name: 'abstract',
                scope: 'document',
            },
            { _id: '2', label: 'test2', name: 'test2', scope: 'document' },
        ];

        fieldApi.patchField.mockResolvedValue(true);

        const polyglot = { t: jest.fn().mockReturnValue('search_input') };

        const { getByTestId } = render(
            <SearchForm loadField={jest.fn()} fields={fields} p={polyglot} />,
        );

        const autocomplete = getByTestId(
            'autocomplete_search_title_syndication',
        );
        const input = within(autocomplete).getByRole('textbox');
        autocomplete.focus();
        fireEvent.change(input, { target: { value: 'a' } });
        fireEvent.keyDown(autocomplete, { key: 'ArrowDown' });
        fireEvent.keyDown(autocomplete, { key: 'Enter' });

        expect(fieldApi.patchField).toHaveBeenCalledWith({
            _id: '1',
            overview: 1,
        });
    });
    it('should call fieldApi.patchField when update description syndication', async () => {
        const fields = [
            {
                _id: '1',
                label: 'abstract',
                name: 'abstract',
                scope: 'document',
            },
            { _id: '2', label: 'test2', name: 'test2', scope: 'document' },
        ];

        fieldApi.patchField.mockResolvedValue(true);

        const polyglot = { t: jest.fn().mockReturnValue('search_input') };

        const { getByTestId } = render(
            <SearchForm loadField={jest.fn()} fields={fields} p={polyglot} />,
        );

        const autocomplete = getByTestId(
            'autocomplete_search_description_syndication',
        );
        const input = within(autocomplete).getByRole('textbox');
        autocomplete.focus();
        fireEvent.change(input, { target: { value: 'a' } });
        fireEvent.keyDown(autocomplete, { key: 'ArrowDown' });
        fireEvent.keyDown(autocomplete, { key: 'Enter' });

        expect(fieldApi.patchField).toHaveBeenCalledWith({
            _id: '1',
            overview: 2,
        });
    });
    it('should call fieldApi.patchField when update first detail syndication', async () => {
        const fields = [
            {
                _id: '1',
                label: 'abstract',
                name: 'abstract',
                scope: 'document',
            },
            { _id: '2', label: 'test2', name: 'test2', scope: 'document' },
        ];

        fieldApi.patchField.mockResolvedValue(true);

        const polyglot = { t: jest.fn().mockReturnValue('search_input') };

        const { getByTestId } = render(
            <SearchForm loadField={jest.fn()} fields={fields} p={polyglot} />,
        );

        const autocomplete = getByTestId(
            'autocomplete_search_detail_first_syndication',
        );
        const input = within(autocomplete).getByRole('textbox');
        autocomplete.focus();
        fireEvent.change(input, { target: { value: 'a' } });
        fireEvent.keyDown(autocomplete, { key: 'ArrowDown' });
        fireEvent.keyDown(autocomplete, { key: 'Enter' });

        expect(fieldApi.patchField).toHaveBeenCalledWith({
            _id: '1',
            overview: 3,
        });
    });
    it('should call fieldApi.patchField when update second detail syndication', async () => {
        const fields = [
            {
                _id: '1',
                label: 'abstract',
                name: 'abstract',
                scope: 'document',
            },
            { _id: '2', label: 'test2', name: 'test2', scope: 'document' },
        ];

        fieldApi.patchField.mockResolvedValue(true);

        const polyglot = { t: jest.fn().mockReturnValue('search_input') };

        const { getByTestId } = render(
            <SearchForm loadField={jest.fn()} fields={fields} p={polyglot} />,
        );

        const autocomplete = getByTestId(
            'autocomplete_search_detail_second_syndication',
        );
        const input = within(autocomplete).getByRole('textbox');
        autocomplete.focus();
        fireEvent.change(input, { target: { value: 'a' } });
        fireEvent.keyDown(autocomplete, { key: 'ArrowDown' });
        fireEvent.keyDown(autocomplete, { key: 'Enter' });

        expect(fieldApi.patchField).toHaveBeenCalledWith({
            _id: '1',
            overview: 4,
        });
    });
});
