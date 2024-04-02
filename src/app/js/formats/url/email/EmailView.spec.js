import React from 'react';
import { shallow } from 'enzyme';

import EmailView from './EmailView';

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
        expect(wrapper.find('Link')).toHaveLength(1);
        expect(wrapper.prop('to')).toBe(
            'mailto:firstname.lastname@example.com',
        );
    });
});
