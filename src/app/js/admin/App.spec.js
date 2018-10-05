import React from 'react';
import { shallow } from 'enzyme';
import AppBar from './Appbar';

import { AppComponent } from './App';

describe('<App />', () => {
    it('should render', () => {
        const wrapper = shallow(<AppComponent p={{ t: () => {} }} />);
        expect(wrapper.length).toEqual(1);
    });
    it('should render an AppBar', () => {
        const wrapper = shallow(<AppComponent p={{ t: () => {} }} />);
        expect(wrapper.find(AppBar).length).toEqual(1);
    });
});
