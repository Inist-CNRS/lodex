import React from 'react';
import expect, { createSpy } from 'expect';
import { shallow } from 'enzyme';
import { TableRowColumn } from 'material-ui/Table';

import { DatasetColumnComponent as DefaultColumn } from './DefaultColumn';
import Format from '../formats/Format';

describe('<DefaultColumn />', () => {
    const column = { name: 'a_name', label: 'Foo' };
    const columns = [
        column,
        { name: 'another_name', label: 'Foo2' },
    ];

    const resource = {
        a_name: 'a_value',
        reference_value: 'referenced_resource',
    };

    const fetchLinkedResource = createSpy();


    it('calls fetchLinkedResource on mount if column has a LINK transformer', () => {
        const linkedColumn = {
            name: 'linked',
            label: 'Linked',
            transformers: [
                {
                    operation: 'LINK',
                    args: [
                        { name: 'reference', value: 'reference_value' },
                        { name: 'identifier', value: 'identifier_value' },
                    ],
                },
            ],
        };
        shallow(<DefaultColumn
            column={linkedColumn}
            columns={columns.concat(linkedColumn)}
            resource={resource}
            fetchLinkedResource={fetchLinkedResource}
        />);

        expect(fetchLinkedResource).toHaveBeenCalledWith('referenced_resource');
    });

    const linkedResource = { linked: true };
    const wrapper = shallow(<DefaultColumn
        column={column}
        columns={columns}
        fetchLinkedResource={fetchLinkedResource}
        linkedResource={linkedResource}
        resource={resource}
    />);

    it('renders a TableRowColumn with correct class', () => {
        const element = wrapper.find(TableRowColumn);

        expect(element.prop('className')).toEqual('dataset-a_name');
    });

    it('renders a Format with correct props when no linkedResource is supplied', () => {
        const element = wrapper.find(Format);

        expect(element.props()).toEqual({
            field: column,
            fields: columns,
            resource,
            linkedResource,
        });
    });
});
