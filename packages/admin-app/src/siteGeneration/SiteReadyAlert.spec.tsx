import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getStore, Wrapper } from '../test-utils';
import { SiteReadyAlert } from './SiteReadyAlert';

const ADMIN = { token: 'token', role: 'admin' };
const PUBLISHED = {
    initialized: true,
    loading: false,
    fields: [],
    published: true,
};

const renderAlert = (initialState: object, onClose = jest.fn()) =>
    render(
        <Wrapper store={getStore(initialState)}>
            <SiteReadyAlert onClose={onClose} />
        </Wrapper>,
    );

describe('SiteReadyAlert', () => {
    // the store keeps the user of the previous test in the local storage
    beforeEach(() => localStorage.clear());

    it('hides once the site is unpublished', () => {
        renderAlert({
            user: ADMIN,
            publication: { ...PUBLISHED, published: false },
        });
        expect(
            screen.queryByText('site_generation_online_notice'),
        ).not.toBeInTheDocument();
    });

    it('hides once the admin is signed out', () => {
        renderAlert({
            user: { token: null, role: null },
            publication: PUBLISHED,
        });
        expect(
            screen.queryByText('site_generation_online_notice'),
        ).not.toBeInTheDocument();
    });

    it('leads to the published site and to its display, and closes', async () => {
        sessionStorage.removeItem('lodex-tenant');
        const onClose = jest.fn();
        renderAlert({ user: ADMIN, publication: PUBLISHED }, onClose);
        expect(
            screen.getByText('site_generation_online_notice'),
        ).toBeInTheDocument();
        const site = screen.getByRole('link', {
            name: 'site_generation_view_site',
        });
        expect(site).toHaveAttribute('href', '/instance/default');
        expect(site).toHaveAttribute('target', '_blank');
        expect(screen.getByRole('link', { name: 'display' })).toHaveAttribute(
            'href',
            '/display',
        );
        await userEvent.click(screen.getByRole('button', { name: 'close' }));
        expect(onClose).toHaveBeenCalled();
    });
});
