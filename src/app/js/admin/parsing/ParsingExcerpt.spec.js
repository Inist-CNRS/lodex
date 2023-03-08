import React from 'react';
import { shallow, mount } from 'enzyme';

import ParsingExcerptColumn from './ParsingExcerptColumn';
import ParsingExcerptHeaderColumn from './ParsingExcerptHeaderColumn';

import {
    ParsingExcerptComponent as ParsingExcerpt,
    getEnrichmentsNames,
    getColumnStyle,
} from './ParsingExcerpt';
import ParsingExcerptAddColumn from './ParsingExcerptAddColumn';
import customTheme from '../../../custom/customTheme';

let mockedParams = {
    filter: undefined,
    subresourceId: undefined,
};

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useParams: () => mockedParams,
}));
// eslint-disable-next-line react/display-name, react/prop-types
jest.mock('./ParsingExcerptAddColumn', () => ({ onAddColumn, name }) => (
    <button onClick={() => onAddColumn(name)} />
));

describe('<ParsingExcerpt />', () => {
    beforeEach(() => {
        mockedParams = {
            filter: undefined,
            subresourceId: undefined,
        };
    });
    it('should return an empty array of enrichments name', () => {
        const enrichments = [];
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
            backgroundColor: customTheme.palette.primary.light,
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
        const wrapper = shallow(
            <ParsingExcerpt
                columns={columns}
                lines={lines}
                subresources={[]}
            />,
        );
        expect(
            wrapper
                .find(ParsingExcerptHeaderColumn)
                .at(0)
                .prop('column'),
        ).toEqual('foo');
        expect(
            wrapper
                .find(ParsingExcerptHeaderColumn)
                .at(1)
                .prop('column'),
        ).toEqual('bar');
    });

    it('should render lines', () => {
        const columns = ['foo', 'bar'];
        const lines = [
            { foo: 'foo1', bar: 'bar1' },
            { foo: 'foo2', bar: 'bar2' },
        ];
        const wrapper = shallow(
            <ParsingExcerpt
                columns={columns}
                lines={lines}
                subresources={[]}
            />,
        );
        expect(
            wrapper
                .find(ParsingExcerptColumn)
                .at(0)
                .prop('value'),
        ).toEqual('"foo1"');
        expect(
            wrapper
                .find(ParsingExcerptColumn)
                .at(1)
                .prop('value'),
        ).toEqual('"bar1"');
        expect(
            wrapper
                .find(ParsingExcerptColumn)
                .at(2)
                .prop('value'),
        ).toEqual('"foo2"');
        expect(
            wrapper
                .find(ParsingExcerptColumn)
                .at(3)
                .prop('value'),
        ).toEqual('"bar2"');
    });

    it('should render headers with subresource', () => {
        mockedParams = {
            filter: 'document',
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

        const wrapper = shallow(
            <ParsingExcerpt
                columns={columns}
                lines={lines}
                subresources={subresources}
            />,
        );
        expect(
            wrapper
                .find(ParsingExcerptHeaderColumn)
                .at(0)
                .prop('column'),
        ).toEqual('column1');
        expect(
            wrapper
                .find(ParsingExcerptHeaderColumn)
                .at(1)
                .prop('column'),
        ).toEqual('column2');
    });

    it('should render lines with subresource', () => {
        mockedParams = {
            filter: 'document',
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
        const wrapper = shallow(
            <ParsingExcerpt
                columns={columns}
                lines={lines}
                subresources={subresources}
            />,
        );
        expect(
            wrapper
                .find(ParsingExcerptColumn)
                .at(0)
                .prop('value'),
        ).toEqual('["value1","value3"]');
        expect(
            wrapper
                .find(ParsingExcerptColumn)
                .at(1)
                .prop('value'),
        ).toEqual('["value2","value4"]');
        expect(
            wrapper
                .find(ParsingExcerptColumn)
                .at(2)
                .prop('value'),
        ).toEqual('["value5","value7"]');
        expect(
            wrapper
                .find(ParsingExcerptColumn)
                .at(3)
                .prop('value'),
        ).toEqual('["value6","value8"]');
    });

    it('should render ParsingExcerptAddColumn when showAddFromColumn is true', () => {
        const columns = ['foo', 'bar'];
        const lines = [
            { foo: 'foo1', bar: 'bar1' },
            { foo: 'foo2', bar: 'bar2' },
        ];
        const wrapper = shallow(
            <ParsingExcerpt
                columns={columns}
                lines={lines}
                subresources={[]}
                showAddFromColumn
            />,
        );
        expect(wrapper.find(ParsingExcerptAddColumn).exists()).toBe(true);
    });

    it('should call handleAddColumn without subresourcePath when ParsingExcerptAddColumn is clicked and this not a subresource', () => {
        mockedParams = {
            filter: 'document',
            subresourceId: undefined,
        };
        const handleAddColumn = jest.fn();
        const columns = ['foo', 'bar'];
        const lines = [
            { foo: 'foo1', bar: 'bar1' },
            { foo: 'foo2', bar: 'bar2' },
        ];
        const wrapper = mount(
            <ParsingExcerpt
                columns={columns}
                lines={lines}
                subresources={[]}
                showAddFromColumn
                handleAddColumn={handleAddColumn}
            />,
        );
        wrapper
            .find(ParsingExcerptAddColumn)
            .at(0)
            .simulate('click');
        expect(handleAddColumn).toHaveBeenCalledWith({
            name: 'foo',
            scope: 'document',
            subresourceId: undefined,
            subresourcePath: undefined,
        });
    });

    it('should call handleAddColumn with subresourcePath when ParsingExcerptAddColumn is clicked and this is a subresource', () => {
        mockedParams = {
            filter: 'document',
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
        const wrapper = mount(
            <ParsingExcerpt
                columns={columns}
                lines={lines}
                subresources={subresources}
                showAddFromColumn
                handleAddColumn={handleAddColumn}
            />,
        );
        wrapper
            .find(ParsingExcerptAddColumn)
            .at(0)
            .simulate('click');
        expect(handleAddColumn).toHaveBeenCalledWith({
            name: 'column1',
            scope: 'document',
            subresourceId: '1234',
            subresourcePath: 'subresourcePath',
        });
    });
});
