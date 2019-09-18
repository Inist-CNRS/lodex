import React from 'react';
import { shallow } from 'enzyme';
import { StyleSheetTestUtils } from 'aphrodite';
import { Link, NavLink } from 'react-router-dom';

import MenuItem from './MenuItem';

describe('MenuItem', () => {
    const onClick = jest.fn();
    const defaultProps = {
        config: {},
        polyglot: { currentLocale: 'fr' },
        hasGraph: false,
        graphDrawer: 'closed',
        searchDrawer: 'closed',
        canBeSearched: false,
        role: 'not logged',
        onClick: jest.fn(() => onClick),
    };

    beforeEach(() => StyleSheetTestUtils.suppressStyleInjection());

    it('should translate label based on currentLocate fr', () => {
        const wrapper = shallow(
            <MenuItem
                {...defaultProps}
                config={{
                    role: 'home',
                    label: { fr: 'label fr', en: 'label en' },
                    icon: 'faHome',
                }}
                polyglot={{ currentLocale: 'fr' }}
            />,
        );

        const link = wrapper.find(NavLink);

        expect(
            link
                .children()
                .at(1)
                .text(),
        ).toBe('label fr');
    });

    it('should translate label based on currentLocate en', () => {
        const wrapper = shallow(
            <MenuItem
                {...defaultProps}
                config={{
                    role: 'home',
                    label: { fr: 'label fr', en: 'label en' },
                    icon: 'faHome',
                }}
                polyglot={{ currentLocale: 'en' }}
            />,
        );

        const link = wrapper.find(NavLink);

        expect(
            link
                .children()
                .at(1)
                .text(),
        ).toBe('label en');
    });

    describe('role: home', () => {
        it('should render MenuItem to home', () => {
            const wrapper = shallow(
                <MenuItem
                    {...defaultProps}
                    config={{
                        role: 'home',
                        label: { fr: 'home fr', en: 'home en' },
                        icon: 'faHome',
                    }}
                />,
            );

            const link = wrapper.find(NavLink);

            expect(link.prop('to')).toBe('/');
            expect(link.prop('onClick')).toBe(onClick);
        });
    });

    describe('role: resources', () => {
        it('should render MenuItem to resources', () => {
            const wrapper = shallow(
                <MenuItem
                    {...defaultProps}
                    config={{
                        role: 'resources',
                        label: { fr: 'resources fr', en: 'resources en' },
                        icon: 'faList',
                    }}
                />,
            );

            const link = wrapper.find(NavLink);

            expect(link.prop('to')).toBe('/graph');
            expect(link.prop('onClick')).toBe(onClick);
        });
    });

    describe('role: graphs', () => {
        it('should render MenuItem to open graphDrawer', () => {
            const wrapper = shallow(
                <MenuItem
                    {...defaultProps}
                    config={{
                        role: 'graphs',
                        label: { fr: 'graphs fr', en: 'graphs en' },
                        icon: 'faList',
                    }}
                    hasGraph
                />,
            );

            const link = wrapper.find(NavLink);

            expect(link.prop('to')).toBe('/graph');
            expect(link.prop('onClick')).toBe(onClick);
        });
        it('should not render MenuItem to open graphDrawer when hasGraph is false', () => {
            const wrapper = shallow(
                <MenuItem
                    {...defaultProps}
                    config={{
                        role: 'graphs',
                        label: { fr: 'graphs fr', en: 'graphs en' },
                        icon: 'faList',
                    }}
                    hasGraph={false}
                />,
            );

            expect(wrapper.find(Link)).toHaveLength(0);
        });
    });

    describe('role: search', () => {
        it('should render MenuItem to open searchDrawer', () => {
            const wrapper = shallow(
                <MenuItem
                    {...defaultProps}
                    config={{
                        role: 'search',
                        label: { fr: 'search fr', en: 'search en' },
                        icon: 'faSearch',
                    }}
                    canBeSearched={true}
                />,
            );

            const link = wrapper.find('div');

            expect(link.prop('onClick')).toBe(onClick);
        });

        it('should not render MenuItem to open graphDrawer when canBeSearched is false', () => {
            const wrapper = shallow(
                <MenuItem
                    {...defaultProps}
                    config={{
                        role: 'search',
                        label: { fr: 'search fr', en: 'search en' },
                        icon: 'faSearch',
                    }}
                    canBeSearched={false}
                />,
            );

            expect(wrapper.find(Link)).toHaveLength(0);
        });
    });

    describe('role: admin', () => {
        it('should render link to admin when role is admin', () => {
            const wrapper = shallow(
                <MenuItem
                    {...defaultProps}
                    config={{
                        role: 'admin',
                        label: { fr: 'admin fr', en: 'admin en' },
                        icon: 'faCogs',
                    }}
                    role="admin"
                />,
            );

            const link = wrapper.find('a');

            expect(link.prop('href')).toBe('/admin');
        });

        it('should not render MenuItem when role is not admin', () => {
            const wrapper = shallow(
                <MenuItem
                    {...defaultProps}
                    config={{
                        role: 'admin',
                        label: { fr: 'admin fr', en: 'admin en' },
                        icon: 'faCogs',
                    }}
                    role="user"
                />,
            );

            expect(wrapper.find('a')).toHaveLength(0);
        });
    });

    describe('role: sign-in', () => {
        it('should render link to login when role is not logged', () => {
            const wrapper = shallow(
                <MenuItem
                    {...defaultProps}
                    config={{
                        role: 'sign-in',
                        label: { fr: 'signin fr', en: 'signin en' },
                        icon: 'faSignInAlt',
                    }}
                    role="not logged"
                />,
            );

            const link = wrapper.find(Link);

            expect(link.prop('to')).toBe('/login');
        });

        it('should not render MenuItem when role is not "not logged"', () => {
            const wrapper = shallow(
                <MenuItem
                    {...defaultProps}
                    config={{
                        role: 'sign-in',
                        label: { fr: 'signin fr', en: 'signin en' },
                        icon: 'faSignInAlt',
                    }}
                    role="user"
                />,
            );

            expect(wrapper.find(Link)).toHaveLength(0);
        });
    });

    describe('role: sign-out', () => {
        it('should render link to logout when role is not "not logged"', () => {
            const wrapper = shallow(
                <MenuItem
                    {...defaultProps}
                    config={{
                        role: 'sign-out',
                        label: { fr: 'signout fr', en: 'signout en' },
                        icon: 'faSignOutAlt',
                    }}
                    role="admin"
                />,
            );

            const link = wrapper.find(Link);

            expect(link.prop('to')).toBe('/login');
            expect(link.prop('onClick')).toBe(onClick);
        });

        it('should not render MenuItem when role is "not logged"', () => {
            const wrapper = shallow(
                <MenuItem
                    {...defaultProps}
                    config={{
                        role: 'sign-out',
                        label: { fr: 'signout fr', en: 'signout en' },
                        icon: 'faSignOutAlt',
                    }}
                    role="not logged"
                />,
            );

            expect(wrapper.find(Link)).toHaveLength(0);
        });
    });

    describe('role: custom', () => {
        it('should render a with href= config.link if link is an extenal link', () => {
            const wrapper = shallow(
                <MenuItem
                    {...defaultProps}
                    config={{
                        role: 'custom',
                        label: { fr: 'custom fr', en: 'custom en' },
                        icon: 'icon',
                        link: 'http://external/link',
                    }}
                />,
            );

            const a = wrapper.find('a');
            expect(a).toHaveLength(1);
            expect(a.prop('href')).toBe('http://external/link');
        });
        it('should render NavLink to config.link', () => {
            const wrapper = shallow(
                <MenuItem
                    {...defaultProps}
                    config={{
                        role: 'custom',
                        label: { fr: 'custom fr', en: 'custom en' },
                        icon: 'icon',
                        link: '/internal/link',
                    }}
                />,
            );

            const navLink = wrapper.find(NavLink);
            expect(navLink).toHaveLength(1);
            expect(navLink.prop('to')).toBe('/internal/link');
            expect(navLink.prop('onClick')).toBe(onClick);
        });

        it('should render nothing if no config.link', () => {
            const wrapper = shallow(
                <MenuItem
                    {...defaultProps}
                    config={{
                        role: 'custom',
                        label: { fr: 'custom fr', en: 'custom en' },
                        icon: 'icon',
                    }}
                />,
            );

            expect(wrapper.find(Link)).toHaveLength(0);
            expect(wrapper.find('a')).toHaveLength(0);
        });
    });

    afterEach(() => StyleSheetTestUtils.clearBufferAndResumeStyleInjection());
});
