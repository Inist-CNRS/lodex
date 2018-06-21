import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';

import LinkImageView from './LinkImageView';

describe('<LinkImageView />', () => {
    it('should render', () => {
        const resource = { foo: 'http://example.com' };
        const field = {
            name: 'foo',
            format: { args: { maxHeight: 500 } },
        };
        const fields = [];
        const wrapper = shallow(
            <LinkImageView
                resource={resource}
                field={field}
                fields={fields}
                type="text"
                value="http://image.com"
            />,
        );
        expect(wrapper.find('a').length).toEqual(1);
        expect(wrapper.prop('href')).toEqual('http://example.com');
        expect(
            wrapper
                .find('a')
                .find('img')
                .prop('src'),
        ).toEqual('http://image.com');
        expect(
            wrapper
                .find('a')
                .find('img')
                .prop('style'),
        ).toEqual({ maxHeight: '500px' });
    });
});
