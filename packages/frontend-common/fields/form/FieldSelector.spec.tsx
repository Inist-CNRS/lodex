import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useListField } from '../api/useListField';
import type { Field } from '../types';
import { FieldSelector, selectFields } from './FieldSelector';

jest.mock('../api/useListField');
jest.mock('../../../admin-app/src/fields/FieldRepresentation', () => ({
    __esModule: true,
    default: ({ field }: { field: Field }) => (
        <div data-testid="field-representation">{field.label}</div>
    ),
}));

const mockUseListField = useListField as jest.MockedFunction<
    typeof useListField
>;

describe('selectFields', () => {
    it.each([
        {
            label: 'empty object',
            fieldsByName: {},
            expected: [],
        },
        {
            label: 'single document field',
            fieldsByName: {
                field1: {
                    _id: '1',
                    name: 'field1',
                    label: 'Field 1',
                    scope: 'document',
                } as Field,
            },
            expected: ['field1'],
        },
        {
            label: 'multiple document fields',
            fieldsByName: {
                field1: {
                    _id: '1',
                    name: 'field1',
                    label: 'Field 1',
                    scope: 'document',
                } as Field,
                field2: {
                    _id: '2',
                    name: 'field2',
                    label: 'Field 2',
                    scope: 'document',
                } as Field,
            },
            expected: ['field1', 'field2'],
        },
    ])('should return field names for $label', ({ fieldsByName, expected }) => {
        const result = selectFields(fieldsByName as Record<string, Field>);
        expect(result).toEqual(expected);
    });

    it.each([
        {
            label: 'dataset scope',
            fieldsByName: {
                datasetField: {
                    _id: '1',
                    name: 'datasetField',
                    label: 'Dataset Field',
                    scope: 'dataset',
                } as Field,
            },
            expected: [],
        },
        {
            label: 'collection scope',
            fieldsByName: {
                collectionField: {
                    _id: '1',
                    name: 'collectionField',
                    label: 'Collection Field',
                    scope: 'collection',
                } as Field,
            },
            expected: [],
        },
        {
            label: 'graphic scope',
            fieldsByName: {
                graphicField: {
                    _id: '1',
                    name: 'graphicField',
                    label: 'Graphic Field',
                    scope: 'graphic',
                } as Field,
            },
            expected: [],
        },
        {
            label: 'undefined scope',
            fieldsByName: {
                undefinedField: {
                    _id: '1',
                    name: 'undefinedField',
                    label: 'Undefined Field',
                    scope: undefined,
                } as Field,
            },
            expected: [],
        },
    ])('should filter out $label fields', ({ fieldsByName, expected }) => {
        const result = selectFields(
            fieldsByName as unknown as Record<string, Field>,
        );
        expect(result).toEqual(expected);
    });

    it.each([
        {
            label: 'alphabetically by label',
            fieldsByName: {
                field1: {
                    _id: '1',
                    name: 'field1',
                    label: 'Zebra',
                    scope: 'document',
                } as Field,
                field2: {
                    _id: '2',
                    name: 'field2',
                    label: 'Apple',
                    scope: 'document',
                } as Field,
                field3: {
                    _id: '3',
                    name: 'field3',
                    label: 'Banana',
                    scope: 'document',
                } as Field,
            },
            expected: ['field2', 'field3', 'field1'],
        },
        {
            label: 'case-insensitive',
            fieldsByName: {
                field1: {
                    _id: '1',
                    name: 'field1',
                    label: 'zebra',
                    scope: 'document',
                } as Field,
                field2: {
                    _id: '2',
                    name: 'field2',
                    label: 'APPLE',
                    scope: 'document',
                } as Field,
                field3: {
                    _id: '3',
                    name: 'field3',
                    label: 'Banana',
                    scope: 'document',
                } as Field,
            },
            expected: ['field2', 'field3', 'field1'],
        },
        {
            label: 'by name when labels identical',
            fieldsByName: {
                zulu: {
                    _id: '1',
                    name: 'zulu',
                    label: 'Same Label',
                    scope: 'document',
                } as Field,
                alpha: {
                    _id: '2',
                    name: 'alpha',
                    label: 'Same Label',
                    scope: 'document',
                } as Field,
                bravo: {
                    _id: '3',
                    name: 'bravo',
                    label: 'Same Label',
                    scope: 'document',
                } as Field,
            },
            expected: ['alpha', 'bravo', 'zulu'],
        },
        {
            label: 'with missing labels',
            fieldsByName: {
                field1: {
                    _id: '1',
                    name: 'field1',
                    label: 'Zebra',
                    scope: 'document',
                } as Field,
                field2: {
                    _id: '2',
                    name: 'field2',
                    label: undefined,
                    scope: 'document',
                } as Field,
                field3: {
                    _id: '3',
                    name: 'field3',
                    label: 'Apple',
                    scope: 'document',
                } as Field,
            },
            expected: ['field2', 'field3', 'field1'],
        },
        {
            label: 'with empty string labels',
            fieldsByName: {
                fieldZ: {
                    _id: '1',
                    name: 'fieldZ',
                    label: 'Zebra',
                    scope: 'document',
                } as Field,
                fieldA: {
                    _id: '2',
                    name: 'fieldA',
                    label: '',
                    scope: 'document',
                } as Field,
                fieldB: {
                    _id: '3',
                    name: 'fieldB',
                    label: 'Apple',
                    scope: 'document',
                } as Field,
            },
            expected: ['fieldA', 'fieldB', 'fieldZ'],
        },
        {
            label: 'mixed scopes with sorting',
            fieldsByName: {
                doc1: {
                    _id: '1',
                    name: 'doc1',
                    label: 'Zebra',
                    scope: 'document',
                } as Field,
                dataset1: {
                    _id: '2',
                    name: 'dataset1',
                    label: 'Apple',
                    scope: 'dataset',
                } as Field,
                doc2: {
                    _id: '3',
                    name: 'doc2',
                    label: 'Banana',
                    scope: 'document',
                } as Field,
                doc3: {
                    _id: '4',
                    name: 'doc3',
                    label: 'Cherry',
                    scope: 'document',
                } as Field,
            },
            expected: ['doc2', 'doc3', 'doc1'],
        },
    ])('should sort fields $label', ({ fieldsByName, expected }) => {
        const result = selectFields(
            fieldsByName as unknown as Record<string, Field>,
        );
        expect(result).toEqual(expected);
    });
});

describe('FieldSelector', () => {
    const mockOnChange = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it.each([
        {
            label: 'empty fields array',
            fields: [],
            expectedOptions: 0,
        },
        {
            label: 'single document field',
            fields: [
                {
                    _id: '1',
                    name: 'field1',
                    label: 'Field 1',
                    scope: 'document',
                },
            ] as Field[],
            expectedOptions: 1,
        },
        {
            label: 'multiple document fields',
            fields: [
                {
                    _id: '1',
                    name: 'field1',
                    label: 'Field 1',
                    scope: 'document',
                },
                {
                    _id: '2',
                    name: 'field2',
                    label: 'Field 2',
                    scope: 'document',
                },
            ] as Field[],
            expectedOptions: 2,
        },
    ])(
        'should generate options for $label',
        async ({ fields, expectedOptions }) => {
            mockUseListField.mockReturnValue({
                isFieldListPending: false,
                fields,
                fieldNames: {
                    uri: 'uri',
                    title: undefined,
                    description: undefined,
                    detail1: undefined,
                    detail2: undefined,
                    detail3: undefined,
                },
                lisFieldError: null,
            });

            const user = userEvent.setup();
            render(<FieldSelector value={null} onChange={mockOnChange} />);

            const autocomplete = screen.getByRole('combobox');
            await act(async () => {
                autocomplete.focus();
                await user.keyboard('{ArrowDown}');
            });

            if (expectedOptions === 0) {
                expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
            } else {
                const listbox = screen.getByRole('listbox');
                const options = within(listbox).getAllByRole('option');
                expect(options).toHaveLength(expectedOptions);
            }
        },
    );

    it.each([
        {
            label: 'dataset scope field',
            fields: [
                {
                    _id: '1',
                    name: 'datasetField',
                    label: 'Dataset Field',
                    scope: 'dataset',
                },
            ] as Field[],
        },
        {
            label: 'collection scope field',
            fields: [
                {
                    _id: '1',
                    name: 'collectionField',
                    label: 'Collection Field',
                    scope: 'collection',
                },
            ] as Field[],
        },
        {
            label: 'graphic scope field',
            fields: [
                {
                    _id: '1',
                    name: 'graphicField',
                    label: 'Graphic Field',
                    scope: 'graphic',
                },
            ] as Field[],
        },
        {
            label: 'undefined scope field',
            fields: [
                {
                    _id: '1',
                    name: 'undefinedField',
                    label: 'Undefined Field',
                    scope: undefined,
                },
            ] as Field[],
        },
    ])('should filter out $label', async ({ fields }) => {
        mockUseListField.mockReturnValue({
            isFieldListPending: false,
            fields,
            fieldNames: {
                uri: 'uri',
                title: undefined,
                description: undefined,
                detail1: undefined,
                detail2: undefined,
                detail3: undefined,
            },
            lisFieldError: null,
        });

        const user = userEvent.setup();
        render(<FieldSelector value={null} onChange={mockOnChange} />);

        const autocomplete = screen.getByRole('combobox');
        await act(async () => {
            autocomplete.focus();
            await user.keyboard('{ArrowDown}');
        });

        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it.each([
        {
            label: 'alphabetically by label (ascending)',
            fields: [
                {
                    _id: '1',
                    name: 'field1',
                    label: 'Zebra',
                    scope: 'document',
                },
                {
                    _id: '2',
                    name: 'field2',
                    label: 'Apple',
                    scope: 'document',
                },
                {
                    _id: '3',
                    name: 'field3',
                    label: 'Banana',
                    scope: 'document',
                },
                {
                    _id: '4',
                    name: 'field4',
                    label: '',
                    scope: 'document',
                },
            ] as Field[],
            expectedOrder: ['', 'Apple', 'Banana', 'Zebra'],
        },
        {
            label: 'case-insensitive sorting',
            fields: [
                {
                    _id: '1',
                    name: 'field1',
                    label: 'zebra',
                    scope: 'document',
                },
                {
                    _id: '2',
                    name: 'field2',
                    label: 'APPLE',
                    scope: 'document',
                },
                {
                    _id: '3',
                    name: 'field3',
                    label: 'Banana',
                    scope: 'document',
                },
            ] as Field[],
            expectedOrder: ['APPLE', 'Banana', 'zebra'],
        },
        {
            label: 'by name when labels are identical',
            fields: [
                {
                    _id: '1',
                    name: 'zulu',
                    label: 'Same Label',
                    scope: 'document',
                },
                {
                    _id: '2',
                    name: 'alpha',
                    label: 'Same Label',
                    scope: 'document',
                },
                {
                    _id: '3',
                    name: 'bravo',
                    label: 'Same Label',
                    scope: 'document',
                },
            ] as Field[],
            expectedOrder: ['Same Label', 'Same Label', 'Same Label'],
        },
        {
            label: 'with missing labels',
            fields: [
                {
                    _id: '1',
                    name: 'field1',
                    label: 'Zebra',
                    scope: 'document',
                },
                {
                    _id: '2',
                    name: 'field2',
                    label: undefined,
                    scope: 'document',
                },
                {
                    _id: '3',
                    name: 'field3',
                    label: 'Apple',
                    scope: 'document',
                },
            ] as Field[],
            expectedOrder: ['', 'Apple', 'Zebra'],
        },
        {
            label: 'with empty string labels',
            fields: [
                {
                    _id: '1',
                    name: 'fieldZ',
                    label: 'Zebra',
                    scope: 'document',
                },
                {
                    _id: '2',
                    name: 'fieldA',
                    label: '',
                    scope: 'document',
                },
                {
                    _id: '3',
                    name: 'fieldB',
                    label: 'Apple',
                    scope: 'document',
                },
            ] as Field[],
            expectedOrder: ['', 'Apple', 'Zebra'],
        },
    ])('should sort options $label', async ({ fields, expectedOrder }) => {
        mockUseListField.mockReturnValue({
            isFieldListPending: false,
            fields,
            fieldNames: {
                uri: 'uri',
                title: undefined,
                description: undefined,
                detail1: undefined,
                detail2: undefined,
                detail3: undefined,
            },
            lisFieldError: null,
        });

        const user = userEvent.setup();
        render(<FieldSelector value={null} onChange={mockOnChange} />);

        const autocomplete = screen.getByRole('combobox');
        await act(async () => {
            autocomplete.focus();
            await user.keyboard('{ArrowDown}');
        });

        const listbox = screen.getByRole('listbox');
        const options = within(listbox).getAllByRole('option');

        const optionTexts = options.map((option) => option.textContent);
        expect(optionTexts).toEqual(expectedOrder);
    });

    it.each([
        {
            label: 'mixed scopes with sorting',
            fields: [
                {
                    _id: '1',
                    name: 'doc1',
                    label: 'Zebra',
                    scope: 'document',
                },
                {
                    _id: '2',
                    name: 'dataset1',
                    label: 'Apple',
                    scope: 'dataset',
                },
                {
                    _id: '3',
                    name: 'doc2',
                    label: 'Banana',
                    scope: 'document',
                },
                {
                    _id: '4',
                    name: 'doc3',
                    label: 'Cherry',
                    scope: 'document',
                },
            ] as Field[],
            expectedOrder: ['Banana', 'Cherry', 'Zebra'],
        },
        {
            label: 'all non-document scopes',
            fields: [
                {
                    _id: '1',
                    name: 'dataset1',
                    label: 'Dataset',
                    scope: 'dataset',
                },
                {
                    _id: '2',
                    name: 'collection1',
                    label: 'Collection',
                    scope: 'collection',
                },
            ] as Field[],
            expectedOptionsCount: 0,
        },
    ])(
        'should handle $label',
        async ({ fields, expectedOrder, expectedOptionsCount }) => {
            mockUseListField.mockReturnValue({
                isFieldListPending: false,
                fields,
                fieldNames: {
                    uri: 'uri',
                    title: undefined,
                    description: undefined,
                    detail1: undefined,
                    detail2: undefined,
                    detail3: undefined,
                },
                lisFieldError: null,
            });

            const user = userEvent.setup();
            render(<FieldSelector value={null} onChange={mockOnChange} />);

            const autocomplete = screen.getByRole('combobox');
            await act(async () => {
                autocomplete.focus();
                await user.keyboard('{ArrowDown}');
            });

            if (expectedOptionsCount === 0) {
                expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
            } else {
                const listbox = screen.getByRole('listbox');
                const options = within(listbox).getAllByRole('option');
                const optionTexts = options.map((option) => option.textContent);
                expect(optionTexts).toEqual(expectedOrder);
            }
        },
    );

    it.each([
        {
            label: 'special characters in labels',
            fields: [
                {
                    _id: '1',
                    name: 'field1',
                    label: 'Ñame',
                    scope: 'document',
                },
                {
                    _id: '2',
                    name: 'field2',
                    label: 'Äpple',
                    scope: 'document',
                },
                {
                    _id: '3',
                    name: 'field3',
                    label: 'Zebra',
                    scope: 'document',
                },
            ] as Field[],
            expectedOrder: ['Äpple', 'Ñame', 'Zebra'],
        },
        {
            label: 'numeric labels',
            fields: [
                {
                    _id: '1',
                    name: 'field1',
                    label: '100',
                    scope: 'document',
                },
                {
                    _id: '2',
                    name: 'field2',
                    label: '20',
                    scope: 'document',
                },
                {
                    _id: '3',
                    name: 'field3',
                    label: '3',
                    scope: 'document',
                },
            ] as Field[],
            expectedOrder: ['100', '20', '3'],
        },
        {
            label: 'labels with leading/trailing spaces',
            fields: [
                {
                    _id: '1',
                    name: 'field1',
                    label: ' Zebra',
                    scope: 'document',
                },
                {
                    _id: '2',
                    name: 'field2',
                    label: 'Apple ',
                    scope: 'document',
                },
                {
                    _id: '3',
                    name: 'field3',
                    label: ' Banana ',
                    scope: 'document',
                },
            ] as Field[],
            expectedOrder: [' Banana ', ' Zebra', 'Apple '],
        },
    ])('should sort options with $label', async ({ fields, expectedOrder }) => {
        mockUseListField.mockReturnValue({
            isFieldListPending: false,
            fields,
            fieldNames: {
                uri: 'uri',
                title: undefined,
                description: undefined,
                detail1: undefined,
                detail2: undefined,
                detail3: undefined,
            },
            lisFieldError: null,
        });

        const user = userEvent.setup();
        render(<FieldSelector value={null} onChange={mockOnChange} />);

        const autocomplete = screen.getByRole('combobox');
        await act(async () => {
            autocomplete.focus();
            await user.keyboard('{ArrowDown}');
        });

        const listbox = screen.getByRole('listbox');
        const options = within(listbox).getAllByRole('option');
        const optionTexts = options.map((option) => option.textContent);
        expect(optionTexts).toEqual(expectedOrder);
    });
});
