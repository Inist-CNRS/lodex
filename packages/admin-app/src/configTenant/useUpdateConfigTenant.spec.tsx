import { type ReactNode } from 'react';
import { act, renderHook } from '@testing-library/react';
import { QueryClient } from '@tanstack/react-query';
import { Wrapper, getStore } from '../test-utils';
import { updateConfigTenant } from '../api/configTenant';
import { useUpdateConfigTenant } from './useUpdateConfigTenant';

jest.mock('../api/configTenant', () => ({ updateConfigTenant: jest.fn() }));

describe('useUpdateConfigTenant', () => {
    it('should cache the saved config, as returned by the API', async () => {
        const saved = { _id: '1', theme: 'istex' };
        (updateConfigTenant as jest.Mock).mockResolvedValue({
            response: saved,
        });
        const client = new QueryClient();
        client.setQueryData(['get-config-tenant'], { _id: '1', theme: 'x' });

        const { result } = renderHook(() => useUpdateConfigTenant(), {
            wrapper: ({ children }: { children: ReactNode }) => (
                <Wrapper store={getStore()} client={client}>
                    {children}
                </Wrapper>
            ),
        });
        await act(() => result.current.handleUpdateConfigTenant(saved));

        expect(client.getQueryData(['get-config-tenant'])).toEqual(saved);
    });
});
