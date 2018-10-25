import React from 'react';
import { shallow } from 'enzyme';
import { StyleSheetTestUtils } from 'aphrodite';

import { NavBar } from './NavBar';

describe('NavBar', () => {
    const defaultProps = {
        p: { t: v => v },
        canBeSearched: false,
        graphFields: [],
        role: 'not logged',
        logout: jest.fn(),
    };

    beforeEach(() => StyleSheetTestUtils.suppressStyleInjection());

    it('should render NavBar with home and sign in', () => {
        const wrapper = shallow(<NavBar {...defaultProps} />);

        const items = wrapper.find('.nav-item');
        expect(items).toHaveLength(3);
        const expectedLabels = ['home', 'resources', 'sign in'];
        items.forEach((item, index) => {
            expect(item.prop('children')).toContain(expectedLabels[index]);
        });
    });

    it('should render NavBar with graphs too if hasGraph is true', () => {
        const wrapper = shallow(<NavBar {...defaultProps} hasGraph />);

        const items = wrapper.find('.nav-item');
        expect(items).toHaveLength(4);
        const expectedLabels = ['home', 'resources', 'graphs', 'sign in'];
        items.forEach((item, index) => {
            expect(item.prop('children')).toContain(expectedLabels[index]);
        });
    });

    it('should render NavBar with search too if canBeSearched is true', () => {
        const wrapper = shallow(<NavBar {...defaultProps} canBeSearched />);

        const items = wrapper.find('.nav-item');
        expect(items).toHaveLength(4);
        const expectedLabels = [
            'home',
            'resources',
            'search_placeholder',
            'sign in',
        ];
        items.forEach((item, index) => {
            expect(item.prop('children')).toContain(expectedLabels[index]);
        });
    });

    it('should render NavBar render sign_out instead of sign in if role is user', () => {
        const wrapper = shallow(<NavBar {...defaultProps} role="user" />);

        const items = wrapper.find('.nav-item');
        expect(items).toHaveLength(3);
        const expectedLabels = ['home', 'resources', 'sign_out'];
        items.forEach((item, index) => {
            expect(item.prop('children')).toContain(expectedLabels[index]);
        });
    });

    it('should render NavBar render sign_out instead of sign in and add admin if role is admin', () => {
        const wrapper = shallow(<NavBar {...defaultProps} role="admin" />);

        const items = wrapper.find('.nav-item');
        expect(items).toHaveLength(4);
        const expectedLabels = ['home', 'resources', 'Admin', 'sign_out'];
        items.forEach((item, index) => {
            expect(item.prop('children')).toContain(expectedLabels[index]);
        });
    });

    afterEach(() => StyleSheetTestUtils.clearBufferAndResumeStyleInjection());
});
