import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';

import EmailView from './Component';

describe('<EmailView />', () => {
    it('should render', () => {
        const resource = { foo: 'firstname.lastname@example.com' };
        const field = { name: 'foo', label: 'label' };
        const fields = [];
        const wrapper = shallow(
            <EmailView
                resource={resource}
                field={field}
                fields={fields}
                type="value"
                value=""
            />,
        );
        expect(wrapper.find('Link').length).toEqual(1);
        expect(wrapper.prop('to')).toEqual(
            'mailto:firstname.lastname@example.com',
        );
    });
});
