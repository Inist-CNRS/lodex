import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';
import { TableHeaderColumn, TableRowColumn } from 'material-ui/Table';

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
        expect(wrapper.contains(<TableRowColumn>foo1</TableRowColumn>)).toEqual(true);
        expect(wrapper.contains(<TableRowColumn>bar1</TableRowColumn>)).toEqual(true);
        expect(wrapper.contains(<TableRowColumn>foo2</TableRowColumn>)).toEqual(true);
        expect(wrapper.contains(<TableRowColumn>bar2</TableRowColumn>)).toEqual(true);
    });
});
