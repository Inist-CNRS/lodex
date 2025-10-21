import { render } from '../../../../test-utils';

import {
    ParsingExcerptComponent as ParsingExcerpt,
    getEnrichmentsNames,
    getColumnStyle,
} from './ParsingExcerpt';
import { TestI18N } from '../../i18n/I18NContext';

let mockedParams = {
    filter: undefined,
    subresourceId: undefined,
};

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useParams: () => mockedParams,
}));

describe('<ParsingExcerpt />', () => {
    beforeEach(() => {
        mockedParams = {
            filter: undefined,
            subresourceId: undefined,
        };
    });
    it('should return an empty array of enrichments name', () => {
        // @ts-expect-error TS7034
        const enrichments = [];
        // @ts-expect-error TS7005
        const enrichmentsName = getEnrichmentsNames(enrichments);
        expect(enrichmentsName).toEqual([]);
    });

    it('should return array of enrichments name', () => {
        const enrichments = [
            { name: 'enrichment1', rules: {} },
            { name: 'enrichment2', rules: {} },
        ];
        const enrichmentsName = getEnrichmentsNames(enrichments);
        expect(enrichmentsName).toEqual(['enrichment1', 'enrichment2']);
    });

    it('should return a style for enriched column', () => {
        const column = 'enrichment1';
        const enrichments = [
            { name: 'enrichment1', rules: {} },
            { name: 'enrichment2', rules: {} },
        ];
        const enrichmentsName = getEnrichmentsNames(enrichments);
        const style = getColumnStyle(enrichmentsName, column);
        expect(style).toEqual({
            backgroundColor: 'var(--primary-light)',
        });
    });

    it('should return a empty style for basic column', () => {
        const column = 'basicColumn';
        const enrichments = [
            { name: 'enrichment1', rules: {} },
            { name: 'enrichment2', rules: {} },
        ];
        const enrichmentsName = getEnrichmentsNames(enrichments);
        const style = getColumnStyle(enrichmentsName, column);
        expect(style).toEqual({});
    });

    it('should render headers', () => {
        const columns = ['foo', 'bar'];
        const lines = [
            { foo: 'foo1', bar: 'bar1' },
            { foo: 'foo2', bar: 'bar2' },
        ];
        const screen = render(
            <ParsingExcerpt
                columns={columns}
                // @ts-expect-error TS7005
                lines={lines}
                subresources={[]}
            />,
        );
        expect(screen.queryByText('foo')).toBeInTheDocument();
        expect(screen.queryByText('bar')).toBeInTheDocument();
    });

    it('should render lines', () => {
        const columns = ['foo', 'bar'];
        const lines = [
            { foo: 'foo1', bar: 'bar1' },
            { foo: 'foo2', bar: 'bar2' },
        ];
        const screen = render(
            <ParsingExcerpt
                columns={columns}
                // @ts-expect-error TS7005
                lines={lines}
                subresources={[]}
            />,
        );
        expect(screen.queryByText('"foo1"')).toBeInTheDocument();
        expect(screen.queryByText('"foo2"')).toBeInTheDocument();
        expect(screen.queryByText('"bar1"')).toBeInTheDocument();
        expect(screen.queryByText('"bar2"')).toBeInTheDocument();
    });

    it('should render headers with subresource', () => {
        mockedParams = {
            // @ts-expect-error TS2322
            filter: 'document',
            // @ts-expect-error TS2322
            subresourceId: '1234',
        };
        const subresources = [
            {
                _id: '1234',
                name: 'subresource1',
                identifier: 'identifier',
                path: 'subresourcePath',
            },
        ];

        // @ts-expect-error TS7034
        const columns = [];
        const lines = [
            {
                foo: 'foo1',
                bar: 'bar1',
                subresourcePath: [
                    { column1: 'value1', column2: 'value2' },
                    { column1: 'value3', column2: 'value4' },
                ],
            },
            {
                foo: 'foo2',
                bar: 'bar2',
                subresourcePath: [
                    { column1: 'value5', column2: 'value6' },
                    { column1: 'value7', column2: 'value8' },
                ],
            },
        ];

        const screen = render(
            <ParsingExcerpt
                // @ts-expect-error TS7005
                columns={columns}
                // @ts-expect-error TS7005
                lines={lines}
                subresources={subresources}
            />,
        );
        expect(screen.queryByText('column1')).toBeInTheDocument();
        expect(screen.queryByText('column2')).toBeInTheDocument();
    });

    it('should render lines with subresource', () => {
        mockedParams = {
            // @ts-expect-error TS2322
            filter: 'document',
            // @ts-expect-error TS2322
            subresourceId: '1234',
        };
        const subresources = [
            {
                _id: '1234',
                name: 'subresource1',
                identifier: 'identifier',
                path: 'subresourcePath',
            },
        ];

        // @ts-expect-error TS7034
        const columns = [];
        const lines = [
            {
                foo: 'foo1',
                bar: 'bar1',
                subresourcePath: [
                    { column1: 'value1', column2: 'value2' },
                    { column1: 'value3', column2: 'value4' },
                ],
            },
            {
                foo: 'foo2',
                bar: 'bar2',
                subresourcePath: [
                    { column1: 'value5', column2: 'value6' },
                    { column1: 'value7', column2: 'value8' },
                ],
            },
        ];
        const screen = render(
            <ParsingExcerpt
                // @ts-expect-error TS7005
                columns={columns}
                // @ts-expect-error TS7005
                lines={lines}
                subresources={subresources}
            />,
        );
        expect(screen.queryByText('["value1","value3"]')).toBeInTheDocument();
        expect(screen.queryByText('["value2","value4"]')).toBeInTheDocument();
        expect(screen.queryByText('["value5","value7"]')).toBeInTheDocument();
        expect(screen.queryByText('["value6","value8"]')).toBeInTheDocument();
    });

    it('should render ParsingExcerptAddColumn when showAddFromColumn is true', () => {
        const columns = ['foo', 'bar'];
        const lines = [
            { foo: 'foo1', bar: 'bar1' },
            { foo: 'foo2', bar: 'bar2' },
        ];
        const screen = render(
            <TestI18N>
                <ParsingExcerpt
                    columns={columns}
                    // @ts-expect-error TS7005
                    lines={lines}
                    subresources={[]}
                    showAddFromColumn
                />
            </TestI18N>,
        );
        expect(screen.queryAllByText('add_to_publication')).toHaveLength(2);
    });

    it('should call handleAddColumn without subresourcePath when ParsingExcerptAddColumn is clicked and this not a subresource', () => {
        mockedParams = {
            // @ts-expect-error TS2322
            filter: 'document',
            subresourceId: undefined,
        };
        const handleAddColumn = jest.fn();
        const columns = ['foo', 'bar'];
        const lines = [
            { foo: 'foo1', bar: 'bar1' },
            { foo: 'foo2', bar: 'bar2' },
        ];
        const screen = render(
            <TestI18N>
                <ParsingExcerpt
                    columns={columns}
                    // @ts-expect-error TS7005
                    lines={lines}
                    subresources={[]}
                    showAddFromColumn
                    handleAddColumn={handleAddColumn}
                />
            </TestI18N>,
        );

        expect(screen.queryAllByText('add_to_publication')).toHaveLength(2);
        screen.fireEvent.click(screen.queryAllByText('add_to_publication')[0]);
        expect(handleAddColumn).toHaveBeenCalledWith({
            name: 'foo',
            scope: 'document',
            subresourceId: undefined,
            subresourcePath: undefined,
        });
    });

    it('should call handleAddColumn with subresourcePath when ParsingExcerptAddColumn is clicked and this is a subresource', () => {
        mockedParams = {
            // @ts-expect-error TS2322
            filter: 'document',
            // @ts-expect-error TS2322
            subresourceId: '1234',
        };
        const handleAddColumn = jest.fn();
        const subresources = [
            {
                _id: '1234',
                name: 'subresource1',
                identifier: 'identifier',
                path: 'subresourcePath',
            },
        ];

        // @ts-expect-error TS7034
        const columns = [];
        const lines = [
            {
                foo: 'foo1',
                bar: 'bar1',
                subresourcePath: [
                    { column1: 'value1', column2: 'value2' },
                    { column1: 'value3', column2: 'value4' },
                ],
            },
            {
                foo: 'foo2',
                bar: 'bar2',
                subresourcePath: [
                    { column1: 'value5', column2: 'value6' },
                    { column1: 'value7', column2: 'value8' },
                ],
            },
        ];
        const screen = render(
            <TestI18N>
                <ParsingExcerpt
                    // @ts-expect-error TS7005
                    columns={columns}
                    // @ts-expect-error TS7005
                    lines={lines}
                    subresources={subresources}
                    showAddFromColumn
                    handleAddColumn={handleAddColumn}
                />
            </TestI18N>,
        );
        expect(screen.queryAllByText('add_to_publication')).toHaveLength(2);
        screen.fireEvent.click(screen.queryAllByText('add_to_publication')[0]);
        expect(handleAddColumn).toHaveBeenCalledWith({
            name: 'column1',
            scope: 'document',
            subresourceId: '1234',
            subresourcePath: 'subresourcePath',
        });
    });
});
