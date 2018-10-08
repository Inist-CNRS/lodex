import React from 'react';
import { shallow } from 'enzyme';

import { AppComponent } from './App';

describe('<App />', () => {
    it('should render', () => {
        const wrapper = shallow(<AppComponent p={{ t: () => {} }} />);
        expect(wrapper.length).toEqual(1);
    });
});
