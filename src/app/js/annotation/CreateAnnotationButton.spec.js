import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import PropTypes from 'prop-types';
import React from 'react';
import { MemoryRouter, Route, Switch } from 'react-router-dom';

import { TestI18N } from '../i18n/I18NContext';
import fetch from '../lib/fetch';
import { CreateAnnotationButton } from './CreateAnnotationButton';

const queryClient = new QueryClient();

jest.mock('../lib/fetch', () =>
    jest.fn().mockImplementation(({ body }) => {
        return Promise.resolve({
            response: { total: 1, data: body },
            error: null,
        });
    }),
);

function TestButton(props) {
    return (
        <QueryClientProvider client={queryClient}>
            <TestI18N>
                <MemoryRouter
                    initialEntries={['/uid:/0579J7JN']}
                    initialIndex={0}
                >
                    <Switch>
                        <Route exact path="/uid:/:uri">
                            <CreateAnnotationButton
                                field={{
                                    _id: '1ddbe5dc-f945-4d38-9c5b-ef20f78cb0cc',
                                    label: 'Titre du corpus',
                                    ...props,
                                }}
                            />
                        </Route>
                    </Switch>
                </MemoryRouter>
            </TestI18N>
        </QueryClientProvider>
    );
}

TestButton.propTypes = {
    annotable: PropTypes.bool,
};

describe('CreateAnnotationButton', () => {
    beforeEach(() => {
        window.sessionStorage.setItem(
            'redux-localstorage',
            JSON.stringify({ user: { token: 'token' } }),
        );
    });

    afterEach(() => {
        window.sessionStorage.clear();
        jest.clearAllMocks();
    });

    it('should open the modal when clicking on the button', async () => {
        render(<TestButton annotable={true} />);

        await waitFor(() => {
            fireEvent.click(
                screen.getByRole('button', {
                    name: 'annotation_create_button_label',
                }),
            );
        });

        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should call api when submiting annotation form', async () => {
        render(<TestButton />);

        await waitFor(() => {
            fireEvent.click(
                screen.getByRole('button', {
                    name: 'annotation_create_button_label',
                }),
            );
        });

        expect(screen.getByRole('dialog')).toBeInTheDocument();

        await waitFor(() => {
            fireEvent.change(
                screen.getByRole('textbox', { name: 'annotation_comment' }),
                {
                    target: { value: 'test' },
                },
            );
        });

        await waitFor(() => {
            fireEvent.click(screen.getByRole('button', { name: 'validate' }));
        });

        expect(fetch).toHaveBeenCalledWith(
            expect.objectContaining({
                url: '/api/annotation',
                method: 'POST',
                body: '{"comment":"test","resourceUri":"uid:/0579J7JN","itemPath":["1ddbe5dc-f945-4d38-9c5b-ef20f78cb0cc"]}',
            }),
        );
    });

    it('should not display button if field is not annotable', async () => {
        render(<TestButton annotable={false} />);

        expect(
            screen.queryAllByRole('button', {
                name: 'annotation_create_button_label',
            }),
        ).toHaveLength(0);
    });
});
