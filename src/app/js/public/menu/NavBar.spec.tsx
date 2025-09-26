// @ts-expect-error TS6133
import React from 'react';
import { shallow } from 'enzyme';
// @ts-expect-error TS7016
import { StyleSheetTestUtils } from 'aphrodite';

import { NavBar } from './NavBar';
import MenuItem from './MenuItem';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
}));

describe('NavBar', () => {
    // Todo: Unskip this test once material-ui is upgraded

    // Invariant Violation: Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
    // 1. You might have mismatching versions of React and the renderer (such as React DOM)
    // 2. You might be breaking the Rules of Hooks
    // 3. You might have more than one copy of React in the same app

    const defaultProps = {
        // @ts-expect-error TS7006
        p: { t: (v) => v },
        canBeSearched: false,
        graphFields: [],
        role: 'not logged',
        logout: jest.fn(),
        leftMenu: ['menu1', 'menu2'],
        rightMenu: ['menu3', 'menu4'],
        advancedMenuButton: {
            icon: 'faCog',
            label: { en: 'Advanced', fr: 'Avancé' },
        },
        advancedMenu: ['menu5'],
    };

    beforeEach(() => StyleSheetTestUtils.suppressStyleInjection());

    it('should render NavBar with home and sign in', () => {
        // @ts-expect-error TS2739
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
                label: {
                    en: 'Advanced',
                    fr: 'Avancé',
                },
                role: 'advanced',
            },
        ];
        items.forEach((item, index) => {
            expect(item.prop('config')).toEqual(expectedMenu[index]);
        });
    });

    afterEach(() => StyleSheetTestUtils.clearBufferAndResumeStyleInjection());
});
