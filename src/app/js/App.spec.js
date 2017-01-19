import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';
import AppBar from 'material-ui/AppBar';

import { App } from './App';

describe('<App />', () => {
    it('should render', () => {
        const wrapper = shallow(<App />);
        expect(wrapper.length).toEqual(1);
    });
    it('should render an AppBar', () => {
        const wrapper = shallow(<App />);
        expect(wrapper.find(AppBar).length).toEqual(1);
    });
});
