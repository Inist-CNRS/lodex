import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import React from 'react';
// @ts-expect-error TS7016
import { MemoryRouter } from 'react-router-dom';

import TitleView from './TitleView';

const queryClient = new QueryClient();

const resource = { foo: 'Run you fools!' };
const field = { name: 'foo' };

function TestTitleView() {
    return (
        <MemoryRouter>
            <QueryClientProvider client={queryClient}>
                <TitleView
                    resource={resource}
                    field={field}
                    level={1}
                    colors={'#ff6347'}
                />
            </QueryClientProvider>
        </MemoryRouter>
    );
}

describe('<TitleView />', () => {
    it('should render', () => {
        const wrapper = render(<TestTitleView />);
        expect(wrapper.getByRole('heading')).toHaveTextContent(
            'Run you fools!',
        );
    });
});
