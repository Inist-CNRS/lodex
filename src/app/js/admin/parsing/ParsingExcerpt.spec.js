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
        expect(wrapper.contains(<ParsingExcerptColumn value="foo1" />)).toEqual(true);
        expect(wrapper.contains(<ParsingExcerptColumn value="bar1" />)).toEqual(true);
        expect(wrapper.contains(<ParsingExcerptColumn value="foo2" />)).toEqual(true);
        expect(wrapper.contains(<ParsingExcerptColumn value="bar2" />)).toEqual(true);
    });
});
