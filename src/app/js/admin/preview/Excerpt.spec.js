import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';
import { TableHeaderColumn } from 'material-ui/Table';
import ExcerptLine from './ExcerptLine';

import { ExcerptComponent as Excerpt } from './Excerpt';

describe('<Excerpt />', () => {
    it('should render headers', () => {
        const columns = [
            { name: 'foo', label: 'foo' },
            { name: 'bar', label: 'Super Bar' },
        ];
        const lines = [
            { foo: 'foo1', bar: 'bar1' },
            { foo: 'foo2', bar: 'bar2' },
        ];
        const wrapper = shallow(
            <Excerpt columns={columns} lines={lines} p={{ t: key => key }} />,
        );
        const headers = wrapper.find(TableHeaderColumn);
        expect(
            headers
                .at(0)
                .children()
                .at(0)
                .prop('field'),
        ).toEqual({ name: 'foo', label: 'foo' });
        expect(
            headers
                .at(1)
                .children()
                .at(0)
                .prop('field'),
        ).toEqual({ name: 'bar', label: 'Super Bar' });
    });

    it('should render lines', () => {
        const columns = [
            { name: 'foo', label: 'foo' },
            { name: 'bar', label: 'bar' },
        ];
        const lines = [
            { uri: 'uri1', foo: 'foo1', bar: 'bar1' },
            { uri: 'uri2', foo: 'foo2', bar: 'bar2' },
        ];
        const wrapper = shallow(
            <Excerpt columns={columns} lines={lines} p={{ t: key => key }} />,
        );

        const excerptLines = wrapper.find(ExcerptLine);
        expect(excerptLines.at(0).props()).toEqual({
            line: lines[0],
            columns,
        });
        expect(excerptLines.at(1).props()).toEqual({
            line: lines[1],
            columns,
        });
    });
});
