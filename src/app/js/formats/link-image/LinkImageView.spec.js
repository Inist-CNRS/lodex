import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';

import LinkImageView from './LinkImageView';

describe('<LinkImageView />', () => {
    it('should render', () => {
        const resource = { foo: 'http://example.com' };
        const field = {
            name: 'foo',
            format: { args: { type: 'text', value: 'http://image.com' } },
        };
        const fields = [];
        const wrapper = shallow(
            <LinkImageView resource={resource} field={field} fields={fields} />,
        );
        expect(wrapper.find('a').length).toEqual(1);
        expect(wrapper.prop('href')).toEqual('http://example.com');
        expect(wrapper.find('a').find('img').prop('src')).toEqual('http://image.com');
    });
});
