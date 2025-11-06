import { SearchForm, type SearchFormProps } from './SearchForm';

import { Overview } from '@lodex/common';
import { I18NContext } from '@lodex/frontend-common/i18n/I18NContext.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, waitFor, within } from '@testing-library/dom';
import fieldApi from '../api/field';
import { render } from '../test-utils';

jest.mock('../api/field', () => ({
    patchSearchableFields: jest.fn(),
    patchOverview: jest.fn(),
}));

// eslint-disable-next-line react/display-name
jest.mock('../fields/FieldRepresentation', () => () => (
    <div>FieldRepresentation</div>
));

function TestSearchForm(props: SearchFormProps) {
    return (
        <QueryClientProvider client={new QueryClient()}>
            <SearchForm {...props} />
        </QueryClientProvider>
    );
}

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

        const polyglot = {
            translate: jest.fn().mockReturnValue('searchable_success'),
            locale: 'en' as const,
            setLanguage: jest.fn(),
        };

        // @ts-expect-error TS2339
        fieldApi.patchSearchableFields.mockResolvedValue(true);

        const screen = render(
            <I18NContext.Provider value={polyglot}>
                <TestSearchForm loadField={jest.fn()} fields={fields} />
            </I18NContext.Provider>,
        );

        const autocomplete = screen.getByTestId(
            'autocomplete_search_in_fields',
        );
        const input = within(autocomplete).getByRole('combobox');

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

        const polyglot = {
            translate: jest.fn().mockReturnValue('translate'),
            locale: 'en' as const,
            setLanguage: jest.fn(),
        };

        const screen = render(
            <I18NContext.Provider value={polyglot}>
                <TestSearchForm loadField={jest.fn()} fields={fields} />
            </I18NContext.Provider>,
        );

        const autocomplete = screen.getByTestId(
            `autocomplete_search_syndication_${Overview.RESOURCE_TITLE}`,
        );
        const input = within(autocomplete).getByRole('combobox');
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

        const polyglot = {
            translate: jest.fn().mockReturnValue('search_input'),
            locale: 'en' as const,
            setLanguage: jest.fn(),
        };

        const screen = render(
            <I18NContext.Provider value={polyglot}>
                <TestSearchForm loadField={jest.fn()} fields={fields} />
            </I18NContext.Provider>,
        );

        const autocomplete = screen.getByTestId(
            `autocomplete_search_syndication_${Overview.RESOURCE_DESCRIPTION}`,
        );
        const input = within(autocomplete).getByRole('combobox');
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

        const polyglot = {
            translate: jest.fn().mockReturnValue('search_input'),
            locale: 'en' as const,
            setLanguage: jest.fn(),
        };

        const screen = render(
            <I18NContext.Provider value={polyglot}>
                <TestSearchForm loadField={jest.fn()} fields={fields} />
            </I18NContext.Provider>,
        );

        const autocomplete = screen.getByTestId(
            `autocomplete_search_syndication_${Overview.RESOURCE_DETAIL_1}`,
        );
        const input = within(autocomplete).getByRole('combobox');
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

        const polyglot = {
            translate: jest.fn().mockReturnValue('search_input'),
            locale: 'en' as const,
            setLanguage: jest.fn(),
        };

        const screen = render(
            <I18NContext.Provider value={polyglot}>
                <TestSearchForm loadField={jest.fn()} fields={fields} />
            </I18NContext.Provider>,
        );

        const autocomplete = screen.getByTestId(
            `autocomplete_search_syndication_${Overview.RESOURCE_DETAIL_2}`,
        );
        const input = within(autocomplete).getByRole('combobox');
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
