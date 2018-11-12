import React from 'react';
import { shallow } from 'enzyme';

import LinkImageView from './LinkImageView';
import Link from '../../lib/components/Link';

describe('<LinkImageView />', () => {
    it('should render', () => {
        const resource = { foo: 'http://example.com' };
        const field = {
            name: 'foo',
            format: { args: { maxHeight: 500 } },
        };
        const wrapper = shallow(
            <LinkImageView
                resource={resource}
                field={field}
                value="http://image.com"
            />,
        );
        expect(wrapper.find(Link).length).toEqual(1);
        expect(wrapper.prop('href')).toEqual('http://example.com');
        expect(
            wrapper
                .find(Link)
                .find('img')
                .prop('src'),
        ).toEqual('http://image.com');
        expect(
            wrapper
                .find(Link)
                .find('img')
                .prop('style'),
        ).toEqual({ maxHeight: '500px' });
    });
});
