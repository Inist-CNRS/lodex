import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';
import AppBar from 'material-ui/AppBar';

import { AppComponent } from './App';

describe('<App />', () => {
    it('should render', () => {
        const wrapper = shallow(<AppComponent />);
        expect(wrapper.length).toEqual(1);
    });
    it('should render an AppBar', () => {
        const wrapper = shallow(<AppComponent />);
        expect(wrapper.find(AppBar).length).toEqual(1);
    });
});
