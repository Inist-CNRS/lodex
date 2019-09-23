import React from 'react';
import { shallow } from 'enzyme';
import { StyleSheetTestUtils } from 'aphrodite';

import { AppComponent } from './App';

describe('<App />', () => {
    beforeEach(() => {
        StyleSheetTestUtils.suppressStyleInjection();
    });

    it('should render', () => {
        const wrapper = shallow(<AppComponent p={{ t: () => {} }} />);
        expect(wrapper.length).toEqual(1);
    });
});
