import React from 'react';
// @ts-expect-error TS7016
import { shallow } from 'enzyme';
import AppBar from './Appbar/AppBar';

import { AppComponent } from './App';

jest.mock('../admin/api/field', () => ({
    clearModel: jest.fn(),
}));

describe('<App />', () => {
    it('should render', () => {
        // @ts-expect-error TS2322
        const wrapper = shallow(<AppComponent p={{ t: () => {} }} />);
        expect(wrapper).toHaveLength(1);
    });
    it('should render an AppBar', () => {
        // @ts-expect-error TS2322
        const wrapper = shallow(<AppComponent p={{ t: () => {} }} />);
        expect(wrapper.find(AppBar)).toHaveLength(1);
    });
});
