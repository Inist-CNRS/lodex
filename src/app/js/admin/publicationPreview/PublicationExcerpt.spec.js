import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';
import { TableHeaderColumn, TableRowColumn } from 'material-ui/Table';

import { PublicationExcerptComponent as PublicationExcerpt } from './PublicationExcerpt';

describe('<PublicationExcerpt />', () => {
    it('should render headers', () => {
        const columns = [{ name: 'foo' }, { name: 'bar', label: 'Super Bar' }];
        const lines = [
            { foo: 'foo1', bar: 'bar1' },
            { foo: 'foo2', bar: 'bar2' },
        ];
        const wrapper = shallow(<PublicationExcerpt
            columns={columns}
            lines={lines}
            p={{ t: key => key }}
        />);
        const headers = wrapper.find(TableHeaderColumn);
        expect(headers.at(0).children().text()).toEqual('foo');
        expect(headers.at(1).children().text()).toEqual('Super Bar');
    });

    it('should render lines', () => {
        const columns = [{ name: 'foo' }, { name: 'bar' }];
        const lines = [
            { foo: 'foo1', bar: 'bar1' },
            { foo: 'foo2', bar: 'bar2' },
        ];
        const wrapper = shallow(<PublicationExcerpt
            columns={columns}
            lines={lines}
            p={{ t: key => key }}
        />);
        expect(wrapper.contains(<TableRowColumn>foo1</TableRowColumn>)).toEqual(true);
        expect(wrapper.contains(<TableRowColumn>bar1</TableRowColumn>)).toEqual(true);
        expect(wrapper.contains(<TableRowColumn>foo2</TableRowColumn>)).toEqual(true);
        expect(wrapper.contains(<TableRowColumn>bar2</TableRowColumn>)).toEqual(true);
    });
});
