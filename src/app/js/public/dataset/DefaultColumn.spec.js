import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';
import { TableRowColumn } from 'material-ui/Table';

import DefaultColumn from './DefaultColumn';
import Format from '../Format';

describe('<DefaultColumn />', () => {
    const column = { name: 'a_name', label: 'Foo' };
    const columns = [
        column,
        { name: 'another_name', label: 'Foo2' },
    ];

    const resource = {
        a_name: 'a_value',
    };

    const wrapper = shallow(<DefaultColumn
        column={column}
        columns={columns}
        resource={resource}
    />);

    it('renders a TableRowColumn with correct class', () => {
        const element = wrapper.find(TableRowColumn);

        expect(element.prop('className')).toEqual('dataset-column dataset-foo');
    });

    it('renders a Format with correct props', () => {
        const element = wrapper.find(Format);

        expect(element.props()).toEqual({
            field: column,
            fields: columns,
            resource,
        });
    });
});
