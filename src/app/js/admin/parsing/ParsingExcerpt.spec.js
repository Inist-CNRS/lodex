import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';
import { TableHeaderColumn } from 'material-ui/Table';
import ParsingExcerptColumn from './ParsingExcerptColumn';

import { ParsingExcerptComponent as ParsingExcerpt } from './ParsingExcerpt';

describe('<ParsingExcerpt />', () => {
    it('should render headers', () => {
        const columns = ['foo', 'bar'];
        const lines = [
            { foo: 'foo1', bar: 'bar1' },
            { foo: 'foo2', bar: 'bar2' },
        ];
        const wrapper = shallow(<ParsingExcerpt columns={columns} lines={lines} />);
        expect(wrapper.contains(<TableHeaderColumn>foo</TableHeaderColumn>)).toEqual(true);
        expect(wrapper.contains(<TableHeaderColumn>bar</TableHeaderColumn>)).toEqual(true);
    });

    it('should render lines', () => {
        const columns = ['foo', 'bar'];
        const lines = [
            { foo: 'foo1', bar: 'bar1' },
            { foo: 'foo2', bar: 'bar2' },
        ];
        const wrapper = shallow(<ParsingExcerpt columns={columns} lines={lines} />);
        expect(wrapper.find(ParsingExcerptColumn).at(0).prop('value')).toEqual('foo1');
        expect(wrapper.find(ParsingExcerptColumn).at(1).prop('value')).toEqual('bar1');
        expect(wrapper.find(ParsingExcerptColumn).at(2).prop('value')).toEqual('foo2');
        expect(wrapper.find(ParsingExcerptColumn).at(3).prop('value')).toEqual('bar2');
    });
});
