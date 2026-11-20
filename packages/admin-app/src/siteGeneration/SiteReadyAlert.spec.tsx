import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getStore, Wrapper } from '../test-utils';
import { SiteReadyAlert } from './SiteReadyAlert';

describe('SiteReadyAlert', () => {
    it('leads to the published site and to its display, and closes', async () => {
        sessionStorage.removeItem('lodex-tenant');
        const onClose = jest.fn();
        render(
            <Wrapper store={getStore()}>
                <SiteReadyAlert onClose={onClose} />
            </Wrapper>,
        );
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
