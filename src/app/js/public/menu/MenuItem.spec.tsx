import { screen } from '@testing-library/react';
// @ts-expect-error TS7016
import { StyleSheetTestUtils } from 'aphrodite';
import { render } from '../../../../test-utils';

import MenuItem, { type ConfigRole } from './MenuItem';
import { ADMIN_ROLE, DEFAULT_TENANT } from '@lodex/common';
import { MemoryRouter } from 'react-router';
import { I18NContext } from '../../i18n/I18NContext';

describe('MenuItem', () => {
    const onClick = jest.fn();
    const defaultProps = {
        config: {},
        hasGraph: false,
        graphDrawer: 'closed' as const,
        searchDrawer: 'closed' as const,
        canBeSearched: false,
        role: 'not logged' as const,
        onClick: jest.fn(() => onClick),
    };

    beforeAll(() => {
        console.error = jest.fn(() => onClick);
    });

    beforeEach(() => StyleSheetTestUtils.suppressStyleInjection());

    it('should translate label based on currentLocate fr', () => {
        render(
            <I18NContext.Provider
                value={{
                    locale: 'fr',
                    translate: (key: string) => key,
                    setLanguage: () => {},
                }}
            >
                <MemoryRouter>
                    <MenuItem
                        {...defaultProps}
                        config={{
                            role: 'home',
                            label: { fr: 'label fr', en: 'label en' },
                            icon: 'faHome',
                        }}
                    />
                </MemoryRouter>
            </I18NContext.Provider>,
        );

        expect(screen.getByText('label fr')).toBeInTheDocument();
    });

    it('should translate label based on currentLocate en', () => {
        render(
            <I18NContext.Provider
                value={{
                    locale: 'en',
                    translate: (key: string) => key,
                    setLanguage: () => {},
                }}
            >
                <MemoryRouter>
                    <MenuItem
                        {...defaultProps}
                        config={{
                            role: 'home',
                            label: { fr: 'label fr', en: 'label en' },
                            icon: 'faHome',
                        }}
                    />
                </MemoryRouter>
            </I18NContext.Provider>,
        );

        expect(screen.getByText('label en')).toBeInTheDocument();
    });

    describe('role: unknown', () => {
        it('should not render the MenuItem', () => {
            const { container } = render(
                <MemoryRouter>
                    <MenuItem
                        {...defaultProps}
                        config={{
                            role: 'unknown' as ConfigRole,
                            label: { fr: 'unknown fr', en: 'unknown en' },
                            icon: 'faList',
                        }}
                    />
                </MemoryRouter>,
            );

            expect(container.firstChild).toBeNull();
            expect(console.error).toHaveBeenCalled();
        });
    });

    describe('role: home', () => {
        it('should render MenuItem to home', () => {
            render(
                <MemoryRouter>
                    <MenuItem
                        {...defaultProps}
                        config={{
                            role: 'home',
                            label: { fr: 'home fr', en: 'home en' },
                            icon: 'faHome',
                        }}
                    />
                </MemoryRouter>,
            );

            const link = screen.getByRole('link');
            expect(link).toHaveAttribute('href', '/');
            expect(screen.getByText('home en')).toBeInTheDocument();
        });
    });

    describe('role: graphs', () => {
        it('should render MenuItem to open graphDrawer', () => {
            render(
                <MemoryRouter>
                    <MenuItem
                        {...defaultProps}
                        config={{
                            role: 'graphs',
                            label: { fr: 'graphs fr', en: 'graphs en' },
                            icon: 'faList',
                        }}
                        hasGraph
                    />
                </MemoryRouter>,
            );

            const link = screen.getByRole('link');
            expect(link).toHaveAttribute('href', '/graph');
            expect(screen.getByText('graphs en')).toBeInTheDocument();
        });
        it('should not render MenuItem to open graphDrawer when hasGraph is false', () => {
            const { container } = render(
                <MemoryRouter>
                    <MenuItem
                        {...defaultProps}
                        config={{
                            role: 'graphs',
                            label: { fr: 'graphs fr', en: 'graphs en' },
                            icon: 'faList',
                        }}
                        hasGraph={false}
                    />
                </MemoryRouter>,
            );

            expect(container.firstChild).toBeNull();
        });
    });

    describe('role: search', () => {
        it('should render MenuItem to open searchDrawer', () => {
            render(
                <MemoryRouter>
                    <MenuItem
                        {...defaultProps}
                        config={{
                            role: 'search',
                            label: { fr: 'search fr', en: 'search en' },
                            icon: 'faSearch',
                        }}
                        canBeSearched={true}
                    />
                </MemoryRouter>,
            );

            const link = screen.getByRole('link');
            expect(link).toHaveAttribute('href', '/search');
            expect(screen.getByText('search en')).toBeInTheDocument();
        });

        it('should not render MenuItem to open graphDrawer when canBeSearched is false', () => {
            const { container } = render(
                <MemoryRouter>
                    <MenuItem
                        {...defaultProps}
                        config={{
                            role: 'search',
                            label: { fr: 'search fr', en: 'search en' },
                            icon: 'faSearch',
                        }}
                        canBeSearched={false}
                    />
                </MemoryRouter>,
            );

            expect(container.firstChild).toBeNull();
        });
    });

    describe('role: admin', () => {
        it('should render link to admin when role is admin', () => {
            render(
                <MemoryRouter>
                    <MenuItem
                        {...defaultProps}
                        config={{
                            role: ADMIN_ROLE,
                            label: { fr: 'admin fr', en: 'admin en' },
                            icon: 'faCogs',
                        }}
                        role="admin"
                    />
                </MemoryRouter>,
            );

            const link = screen.getByRole('link');
            expect(link).toHaveAttribute(
                'href',
                `/instance/${DEFAULT_TENANT}/admin`,
            );
            expect(screen.getByText('admin en')).toBeInTheDocument();
        });

        it('should not render MenuItem when role is not admin', () => {
            const { container } = render(
                <MemoryRouter>
                    <MenuItem
                        {...defaultProps}
                        config={{
                            role: ADMIN_ROLE,
                            label: { fr: 'admin fr', en: 'admin en' },
                            icon: 'faCogs',
                        }}
                        role="user"
                    />
                </MemoryRouter>,
            );

            expect(container.firstChild).toBeNull();
        });
    });

    describe('role: sign-in', () => {
        it('should render link to login when role is not logged', () => {
            render(
                <MemoryRouter>
                    <MenuItem
                        {...defaultProps}
                        config={{
                            role: 'sign-in',
                            label: { fr: 'signin fr', en: 'signin en' },
                            icon: 'faSignInAlt',
                        }}
                        role="not logged"
                    />
                </MemoryRouter>,
            );

            const link = screen.getByRole('link');
            expect(link).toHaveAttribute('href', '/login');
            expect(screen.getByText('signin en')).toBeInTheDocument();
        });

        it('should not render MenuItem when role is not "not logged"', () => {
            const { container } = render(
                <MemoryRouter>
                    <MenuItem
                        {...defaultProps}
                        config={{
                            role: 'sign-in',
                            label: { fr: 'signin fr', en: 'signin en' },
                            icon: 'faSignInAlt',
                        }}
                        role="user"
                    />
                </MemoryRouter>,
            );

            expect(container.firstChild).toBeNull();
        });
    });

    describe('role: sign-out', () => {
        it('should render link to logout when role is not "not logged"', () => {
            render(
                <MemoryRouter>
                    <MenuItem
                        {...defaultProps}
                        config={{
                            role: 'sign-out',
                            label: { fr: 'signout fr', en: 'signout en' },
                            icon: 'faSignOutAlt',
                        }}
                        role="admin"
                    />
                </MemoryRouter>,
            );

            const link = screen.getByRole('link');
            expect(link).toHaveAttribute('href', '/login');
            expect(screen.getByText('signout en')).toBeInTheDocument();
        });

        it('should not render MenuItem when role is "not logged"', () => {
            const { container } = render(
                <MemoryRouter>
                    <MenuItem
                        {...defaultProps}
                        config={{
                            role: 'sign-out',
                            label: { fr: 'signout fr', en: 'signout en' },
                            icon: 'faSignOutAlt',
                        }}
                        role="not logged"
                    />
                </MemoryRouter>,
            );

            expect(container.firstChild).toBeNull();
        });
    });

    describe('role: custom', () => {
        it('should render a with href= config.link if link is an extenal link', () => {
            render(
                <MemoryRouter>
                    <MenuItem
                        {...defaultProps}
                        config={{
                            role: 'custom',
                            label: { fr: 'custom fr', en: 'custom en' },
                            icon: 'icon',
                            link: 'http://external/link',
                        }}
                    />
                </MemoryRouter>,
            );

            const link = screen.getByRole('link');
            expect(link).toHaveAttribute('href', 'http://external/link');
            expect(screen.getByText('custom en')).toBeInTheDocument();
        });

        it('should render NavLink to config.link', () => {
            render(
                <MemoryRouter>
                    <MenuItem
                        {...defaultProps}
                        config={{
                            role: 'custom',
                            label: { fr: 'custom fr', en: 'custom en' },
                            icon: 'icon',
                            link: '/internal/link',
                        }}
                    />
                </MemoryRouter>,
            );

            const link = screen.getByRole('link');
            expect(link).toHaveAttribute('href', '/internal/link');
            expect(screen.getByText('custom en')).toBeInTheDocument();
        });

        it('should render nothing if no config.link', () => {
            const { container } = render(
                <MemoryRouter>
                    <MenuItem
                        {...defaultProps}
                        config={{
                            role: 'custom',
                            label: { fr: 'custom fr', en: 'custom en' },
                            icon: 'icon',
                        }}
                    />
                </MemoryRouter>,
            );

            expect(container.firstChild).toBeNull();
        });
    });

    afterEach(() => StyleSheetTestUtils.clearBufferAndResumeStyleInjection());
});
