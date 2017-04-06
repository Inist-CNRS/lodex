import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';

import LinkView from './Component';

describe('<LinkView />', () => {
    it('should render', () => {
        const resource = { foo: 'http://example.com' };
        const field = { name: 'foo', label: 'label' };
        const fields = [];
        const wrapper = shallow(<LinkView resource={resource} field={field} fields={fields} />);
        expect(wrapper.find('Link').length).toEqual(1);
        expect(wrapper.prop('to')).toEqual('http://example.com');
    });
});
