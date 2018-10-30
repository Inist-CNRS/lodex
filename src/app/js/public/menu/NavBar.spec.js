import React from 'react';
import { shallow } from 'enzyme';
import { StyleSheetTestUtils } from 'aphrodite';

import { NavBar } from './NavBar';
import MenuItem from './MenuItem';

describe('NavBar', () => {
    const defaultProps = {
        p: { t: v => v },
        canBeSearched: false,
        graphFields: [],
        role: 'not logged',
        logout: jest.fn(),
        topMenu: ['menu1', 'menu2'],
        bottomMenu: ['menu3', 'menu4'],
    };

    beforeEach(() => StyleSheetTestUtils.suppressStyleInjection());

    it('should render NavBar with home and sign in', () => {
        const wrapper = shallow(<NavBar {...defaultProps} />);

        const items = wrapper.find(MenuItem);
        expect(items).toHaveLength(4);
        const expectedMenu = ['menu1', 'menu2', 'menu3', 'menu4'];
        items.forEach((item, index) => {
            expect(item.prop('config')).toEqual(expectedMenu[index]);
        });
    });

    afterEach(() => StyleSheetTestUtils.clearBufferAndResumeStyleInjection());
});
