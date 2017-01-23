import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';

import ParsingErrors from './ParsingErrors';

describe('<ParsingErrors />', () => {
    it('should render all errors', () => {
        const lines = ['foo', 'bar'];
        const wrapper = shallow(<ParsingErrors lines={lines} />);
        expect(wrapper.contains(<div><code>foo</code><hr /></div>)).toEqual(true);
        expect(wrapper.contains(<div><code>bar</code><hr /></div>)).toEqual(true);
    });
});
