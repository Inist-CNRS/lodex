import { type PropsWithChildren } from 'react';
import { render } from '@testing-library/react';
import { TransformerListComponent as TransformerList } from './TransformerList';
import { TestI18N } from '../../i18n/I18NContext.tsx';

jest.mock(
    './TransformerListItem',
    () =>
        // @ts-expect-error TS7006
        // eslint-disable-next-line react/prop-types
        function TransformerListItemMock({ transformer, show }) {
            // eslint-disable-next-line react/prop-types
            return <div>{show && transformer.operation}</div>;
        },
);

describe('TransformerList', () => {
    // @ts-expect-error TS7034
    let transformers, mockFields, mockMeta;

    const Wrapper = ({ children }: PropsWithChildren<object>) => (
        <TestI18N>{children}</TestI18N>
    );

    beforeEach(() => {
        transformers = [
            {
                operation: 'VALUE',
                args: [{ name: 'value', type: 'string', value: 'test' }],
            },
        ];
        mockFields = transformers;
        mockMeta = {
            touched: false,
            error: null,
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
        mockFields = transformers;
        const { queryByText } = render(
            <Wrapper>
                <TransformerList
                    isSubresourceField
                    // @ts-expect-error TS2322
                    fields={mockFields}
                    // @ts-expect-error TS7005
                    meta={mockMeta}
                />
            </Wrapper>,
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
        mockFields = transformers;
        const { queryByText } = render(
            <Wrapper>
                <TransformerList
                    isSubresourceField
                    // @ts-expect-error TS2322
                    fields={mockFields}
                    // @ts-expect-error TS7005
                    meta={mockMeta}
                />
            </Wrapper>,
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
        mockFields = transformers;
        const { queryByText } = render(
            <Wrapper>
                <TransformerList
                    isSubresourceField
                    // @ts-expect-error TS2322
                    fields={mockFields}
                    // @ts-expect-error TS7005
                    meta={mockMeta}
                />
            </Wrapper>,
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
                args: [{ name: 'path', type: 'string', value: null }],
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
        mockFields = transformers;
        const { queryByText } = render(
            <Wrapper>
                <TransformerList
                    isSubresourceField
                    // @ts-expect-error TS2322
                    fields={mockFields}
                    // @ts-expect-error TS7005
                    meta={mockMeta}
                />
            </Wrapper>,
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
        mockFields = transformers;
        const { queryByText } = render(
            <Wrapper>
                <TransformerList
                    isSubresourceField
                    // @ts-expect-error TS2322
                    fields={mockFields}
                    // @ts-expect-error TS7005
                    meta={mockMeta}
                />
            </Wrapper>,
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
        mockFields = transformers;
        const { queryByText } = render(
            <Wrapper>
                <TransformerList
                    isSubresourceField
                    // @ts-expect-error TS2322
                    fields={mockFields}
                    // @ts-expect-error TS7005
                    meta={mockMeta}
                />
            </Wrapper>,
        );

        expect(queryByText('COLUMN')).not.toBeInTheDocument();
        expect(queryByText('PARSE')).not.toBeInTheDocument();
        expect(queryByText('GET')).not.toBeInTheDocument();
        expect(queryByText('BOOLEAN')).toBeVisible();
    });
});
