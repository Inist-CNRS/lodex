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
        leftMenu: ['menu1', 'menu2'],
        rightMenu: ['menu3', 'menu4'],
        advancedMenu: ['menu5'],
    };

    beforeEach(() => StyleSheetTestUtils.suppressStyleInjection());

    it('should render NavBar with home and sign in', () => {
        const wrapper = shallow(<NavBar {...defaultProps} />);

        const items = wrapper.find(MenuItem);
        expect(items).toHaveLength(5);
        const expectedMenu = [
            'menu1',
            'menu2',
            'menu3',
            'menu4',
            {
                icon: 'faCog',
                label: { en: 'Advanced', fr: 'Avancé' },
                role: 'advanced',
            },
        ];
        items.forEach((item, index) => {
            expect(item.prop('config')).toEqual(expectedMenu[index]);
        });
    });

    afterEach(() => StyleSheetTestUtils.clearBufferAndResumeStyleInjection());
});
