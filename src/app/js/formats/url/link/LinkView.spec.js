import React from 'react';
import { shallow } from 'enzyme';

import LinkView from './LinkView';
import Link from '../../../lib/components/Link';

describe('<LinkView />', () => {
    it('should render', () => {
        const resource = { foo: 'http://example.com' };
        const field = {
            name: 'foo',
        };
        const fields = [];
        const wrapper = shallow(
            <LinkView
                resource={resource}
                field={field}
                fields={fields}
                type="text"
                value="label"
            />,
        );
        expect(wrapper.find(Link)).toHaveLength(1);
        expect(wrapper.prop('href')).toBe('http://example.com');
        expect(wrapper.find(Link).prop('children')).toBe('label');
    });

    it('should render a list with an array', () => {
        const resource = {
            foo: ['http://example.com', 'http://example.com/2'],
        };
        const field = { name: 'foo', label: 'label' };
        const fields = [];
        const wrapper = shallow(
            <LinkView resource={resource} field={field} fields={fields} />,
        );
        expect(wrapper.find('li')).toHaveLength(2);
        expect(wrapper.find(Link)).toHaveLength(2);
        expect(wrapper.find(Link).first().prop('href')).toBe(
            'http://example.com',
        );
        expect(wrapper.find(Link).last().prop('href')).toBe(
            'http://example.com/2',
        );
        expect(wrapper.find(Link).first().prop('children')).toBe(
            'http://example.com',
        );
        expect(wrapper.find(Link).last().prop('children')).toBe(
            'http://example.com/2',
        );
    });
});
