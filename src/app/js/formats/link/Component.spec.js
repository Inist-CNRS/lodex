import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';

import LinkView from './Component';

describe('<LinkView />', () => {
    it('should render', () => {
        const resource = { foo: 'http://example.com' };
        const field = { name: 'foo', format: { args: { type: 'text', value: 'label' } } };
        const fields = [];
        const wrapper = shallow(<LinkView resource={resource} field={field} fields={fields} />);
        expect(wrapper.find('a').length).toEqual(1);
        expect(wrapper.prop('href')).toEqual('http://example.com');
        expect(wrapper.find('a').text()).toEqual('label');
    });

    it('should render a list with an array', () => {
        const resource = { foo: ['http://example.com', 'http://example.com/2'] };
        const field = { name: 'foo', label: 'label' };
        const fields = [];
        const wrapper = shallow(<LinkView resource={resource} field={field} fields={fields} />);
        expect(wrapper.find('li').length).toEqual(2);
        expect(wrapper.find('a').length).toEqual(2);
        expect(wrapper.find('a').first().prop('href')).toEqual('http://example.com');
        expect(wrapper.find('a').last().prop('href')).toEqual('http://example.com/2');
        expect(wrapper.find('a').first().text()).toEqual('http://example.com');
        expect(wrapper.find('a').last().text()).toEqual('http://example.com/2');
    });
});
