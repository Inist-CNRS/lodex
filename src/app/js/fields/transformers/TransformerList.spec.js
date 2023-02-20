import React from 'react';
import { render } from '@testing-library/react';
import { TransformerListComponent as TransformerList } from './TransformerList';
import '@testing-library/jest-dom';

// eslint-disable-next-line react/display-name, react/prop-types
jest.mock('./TransformerListItem', () => ({ transformer, show }) => (
    // eslint-disable-next-line react/prop-types
    <div>{show && transformer.operation}</div>
));

describe('TransformerList', () => {
    let transformers, mockFields, mockMeta, polyglot;

    beforeEach(() => {
        transformers = [
            {
                operation: 'VALUE',
                args: [{ name: 'value', type: 'string', value: 'test' }],
            },
        ];
        mockFields = {
            map: jest
                .fn()
                .mockReturnValue(
                    transformers.map((_, index) => `transformers[${index}]`),
                ),
            getAll: jest.fn().mockReturnValue(transformers),
            get: jest.fn().mockImplementation(index => transformers[index]),
        };
        mockMeta = {
            touched: false,
            error: null,
        };
        polyglot = {
            t: key => key,
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should hide first transformer if first transformer is VALUE', () => {
        transformers = [
            {
                operation: 'VALUE',
                args: [{ name: 'value', type: 'string', value: 'test' }],
            },
            {
                operation: 'BOOLEAN',
            },
        ];
        mockFields = {
            map: jest
                .fn()
                .mockReturnValue(
                    transformers.map((_, index) => `transformers[${index}]`),
                ),
            getAll: jest.fn().mockReturnValue(transformers),
            get: jest.fn().mockImplementation(index => transformers[index]),
        };
        const { queryByText } = render(
            <TransformerList
                isSubresourceField
                fields={mockFields}
                meta={mockMeta}
                p={polyglot}
            />,
        );

        expect(queryByText('VALUE')).not.toBeInTheDocument();
        expect(queryByText('BOOLEAN')).toBeVisible();
    });

    it('should hide first transformer if first transformer is COLUMN', () => {
        transformers = [
            {
                operation: 'COLUMN',
                args: [{ name: 'column', type: 'column', value: 'Column 2' }],
            },
            {
                operation: 'BOOLEAN',
            },
        ];
        mockFields = {
            map: jest
                .fn()
                .mockReturnValue(
                    transformers.map((_, index) => `transformers[${index}]`),
                ),
            getAll: jest.fn().mockReturnValue(transformers),
            get: jest.fn().mockImplementation(index => transformers[index]),
        };
        const { queryByText } = render(
            <TransformerList
                isSubresourceField
                fields={mockFields}
                meta={mockMeta}
                p={polyglot}
            />,
        );

        expect(queryByText('COLUMN')).not.toBeInTheDocument();
        expect(queryByText('BOOLEAN')).toBeVisible();
    });

    it('should hide first transformer if first transformer is CONCAT', () => {
        transformers = [
            {
                operation: 'CONCAT',
                args: [
                    { name: 'column', type: 'column', value: 'Column 2' },
                    { name: 'column', type: 'column', value: 'Column 1' },
                ],
            },
            {
                operation: 'BOOLEAN',
            },
        ];
        mockFields = {
            map: jest
                .fn()
                .mockReturnValue(
                    transformers.map((_, index) => `transformers[${index}]`),
                ),
            getAll: jest.fn().mockReturnValue(transformers),
            get: jest.fn().mockImplementation(index => transformers[index]),
        };
        const { queryByText } = render(
            <TransformerList
                isSubresourceField
                fields={mockFields}
                meta={mockMeta}
                p={polyglot}
            />,
        );

        expect(queryByText('CONCAT')).not.toBeInTheDocument();
        expect(queryByText('BOOLEAN')).toBeVisible();
    });

    it('should not render any TransformerListItem if source is fromSubresource without value', () => {
        transformers = [
            {
                operation: 'COLUMN',
                args: [{ name: 'column', type: 'column', value: 'path1' }],
            },
            { operation: 'PARSE' },
            {
                operation: 'GET',
                args: [{ name: 'path', type: 'string', value: 'id1' }],
            },
            { operation: 'STRING' },
            {
                operation: 'REPLACE_REGEX',
                args: [
                    {
                        name: 'searchValue',
                        type: 'string',
                        value: '^(.*)$',
                    },
                    {
                        name: 'replaceValue',
                        type: 'string',
                        value: 'sub1/$1',
                    },
                ],
            },
            { operation: 'MD5', args: [] },
            {
                operation: 'REPLACE_REGEX',
                args: [
                    {
                        name: 'searchValue',
                        type: 'string',
                        value: '^(.*)$',
                    },
                    {
                        name: 'replaceValue',
                        type: 'string',
                        value: 'uid:/$1',
                    },
                ],
            },
        ];
        mockFields = {
            map: jest
                .fn()
                .mockReturnValue(
                    transformers.map((_, index) => `transformers[${index}]`),
                ),
            getAll: jest.fn().mockReturnValue(transformers),
            get: jest.fn().mockImplementation(index => transformers[index]),
        };
        const { queryByText } = render(
            <TransformerList
                isSubresourceField
                fields={mockFields}
                meta={mockMeta}
                p={polyglot}
            />,
        );

        expect(
            queryByText('transformer_no_editable_with_subresource_uid_value'),
        ).toBeInTheDocument();
    });

    it('should hide 7 first transformers if source is fromSubresource with value', () => {
        transformers = [
            {
                operation: 'COLUMN',
                args: [{ name: 'column', type: 'column', value: 'path1' }],
            },
            { operation: 'PARSE' },
            {
                operation: 'GET',
                args: [{ name: 'path', type: 'string', value: 'id1' }],
            },
            { operation: 'STRING' },
            {
                operation: 'REPLACE_REGEX',
                args: [
                    {
                        name: 'searchValue',
                        type: 'string',
                        value: '^(.*)$',
                    },
                    {
                        name: 'replaceValue',
                        type: 'string',
                        value: `(sub1)$1`,
                    },
                ],
            },
            {
                operation: 'REPLACE_REGEX',
                args: [
                    {
                        name: 'searchValue',
                        type: 'string',
                        value: `/^\\((.*)\\)/`,
                    },
                    { name: 'replaceValue', type: 'string', value: ' ' },
                ],
            },
            { operation: 'TRIM' },
            { operation: 'BOOLEAN' },
        ];
        mockFields = {
            map: jest
                .fn()
                .mockReturnValue(
                    transformers.map((_, index) => `transformers[${index}]`),
                ),
            getAll: jest.fn().mockReturnValue(transformers),
            get: jest.fn().mockImplementation(index => transformers[index]),
        };
        const { queryByText } = render(
            <TransformerList
                isSubresourceField
                fields={mockFields}
                meta={mockMeta}
                p={polyglot}
            />,
        );

        expect(queryByText('COLUMN')).not.toBeInTheDocument();
        expect(queryByText('PARSE')).not.toBeInTheDocument();
        expect(queryByText('GET')).not.toBeInTheDocument();
        expect(queryByText('STRING')).not.toBeInTheDocument();
        expect(queryByText('REPLACE_REGEX')).not.toBeInTheDocument();
        expect(queryByText('TRIM')).not.toBeInTheDocument();
        expect(queryByText('BOOLEAN')).toBeVisible();
    });

    it('should hide 3 first transformers if source is fromColumnsForSubRessource', () => {
        transformers = [
            {
                operation: 'COLUMN',
                args: [{ name: 'column', type: 'column', value: 'path1' }],
            },
            { operation: 'PARSE' },
            {
                operation: 'GET',
                args: [{ name: 'path', type: 'string', value: 'id1' }],
            },
            { operation: 'STRING' },
            { operation: 'BOOLEAN' },
        ];
        mockFields = {
            map: jest
                .fn()
                .mockReturnValue(
                    transformers.map((_, index) => `transformers[${index}]`),
                ),
            getAll: jest.fn().mockReturnValue(transformers),
            get: jest.fn().mockImplementation(index => transformers[index]),
        };
        const { queryByText } = render(
            <TransformerList
                isSubresourceField
                fields={mockFields}
                meta={mockMeta}
                p={polyglot}
            />,
        );

        expect(queryByText('COLUMN')).not.toBeInTheDocument();
        expect(queryByText('PARSE')).not.toBeInTheDocument();
        expect(queryByText('GET')).not.toBeInTheDocument();
        expect(queryByText('BOOLEAN')).toBeVisible();
    });
});
