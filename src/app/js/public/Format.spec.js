import React from 'react';
import { shallow } from 'enzyme';
import UriView from '../formats/uri/UriView';

import { FormatComponent as Format } from './Format';

describe('<Format />', () => {
    const className = 'a_css_class';
    const field = { name: 'a_name', label: 'Foo', format: { name: 'uri' } };
    const fields = [field, { name: 'another_name', label: 'Foo2' }];

    const resource = {
        a_name: 'a_value',
    };

    const wrapper = shallow(
        <Format
            className={className}
            field={field}
            fieldStatus={null}
            fields={fields}
            resource={resource}
        />,
    );

    it('renders an UriView with correct props', () => {
        const element = wrapper.find(UriView);

        expect(element.props()).toEqual({
            className,
            field,
            fieldStatus: null,
            fields,
            resource,
            shrink: false,
            facets: undefined,
            filter: undefined,
            colorSet: undefined,
            type: 'value',
            value: '',
            graphLink: undefined,
        });
    });
});
