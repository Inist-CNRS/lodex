import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';

import Alert from './Alert';

describe('<Alert />', () => {
    it('should render its children', () => {
        const wrapper = shallow(
            <Alert>
                <p>foo</p>
            </Alert>,
        );
        expect(wrapper.contains(<p>foo</p>)).toEqual(true);
    });
});
