// @ts-expect-error TS6133
import React from 'react';
import { shallow } from 'enzyme';

import EmailView from './EmailView';

describe('<EmailView />', () => {
    it('should render', () => {
        const resource = { foo: 'firstname.lastname@example.com' };
        const field = { name: 'foo', label: 'label' };
        // @ts-expect-error TS7034
        const fields = [];
        const wrapper = shallow(
            // @ts-expect-error TS2769
            <EmailView
                resource={resource}
                field={field}
                // @ts-expect-error TS7005
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
