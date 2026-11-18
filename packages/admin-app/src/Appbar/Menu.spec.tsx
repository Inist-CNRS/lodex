import { QueryClient } from '@tanstack/react-query';
import { act, render } from '@testing-library/react';

import { importFieldsSuccess } from '../import';
import { getStore, Wrapper } from '../test-utils';
import Menu from './Menu';

jest.mock('../api/field', () => ({}));

describe('Menu', () => {
    it('should drop the cached tenant config once a model is imported', () => {
        const store = getStore();
        const client = new QueryClient();
        client.setQueryData(['get-config-tenant'], { theme: 'istex' });

        render(
            <Wrapper store={store} client={client}>
                <Menu />
            </Wrapper>,
        );

        act(() => {
            store.dispatch(importFieldsSuccess({}));
        });

        expect(client.getQueryData(['get-config-tenant'])).toBeUndefined();
    });
});
