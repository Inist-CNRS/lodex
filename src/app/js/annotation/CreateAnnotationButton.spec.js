import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import React from 'react';
import { MemoryRouter, Route, Switch } from 'react-router-dom';
import { fireEvent, render, screen, waitFor } from '../../../test-utils';

import { TestI18N } from '../i18n/I18NContext';
import fetch from '../lib/fetch';
import { getFieldKey, getStorageKey } from './annotationStorage';
import { CreateAnnotationButton } from './CreateAnnotationButton';
import { useCanAnnotate } from './useCanAnnotate';

const queryClient = new QueryClient();

jest.mock('../lib/fetch', () =>
    jest.fn().mockImplementation(({ body }) => {
        return Promise.resolve({
            response: { total: 1, data: body },
            error: null,
        });
    }),
);

jest.mock('./useCanAnnotate', () => ({
    useCanAnnotate: jest.fn().mockReturnValue(true),
}));

function TestButton({ annotable, ...props }) {
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
                                    annotable: annotable,
                                }}
                                {...props}
                            />
                        </Route>
                    </Switch>
                </MemoryRouter>
            </TestI18N>
        </QueryClientProvider>
    );
}

TestButton.propTypes = {
    ...CreateAnnotationButton.propTypes,
    annotable: PropTypes.bool,
};

describe('CreateAnnotationButton', () => {
    beforeEach(() => {
        localStorage.clear();
        window.localStorage.setItem(
            'redux-localstorage',
            JSON.stringify({ user: { token: 'token' } }),
        );
        useCanAnnotate.mockReturnValue(true);
    });

    afterEach(() => {
        window.localStorage.clear();
        jest.clearAllMocks();
    });

    it('should not render the button if useCanAccess return false', async () => {
        useCanAnnotate.mockReturnValue(false);
        render(<TestButton />);
        expect(
            screen.queryByRole('button', {
                name: 'annotation_create_button_label',
            }),
        ).not.toBeInTheDocument();
    });

    it('should render the number of annotations sent by the user when it is greater than 0', async () => {
        window.localStorage.setItem(
            getStorageKey(),
            JSON.stringify({
                [getFieldKey({
                    fieldId: '1ddbe5dc-f945-4d38-9c5b-ef20f78cb0cc',
                    resourceUri: 'uid:/0579J7JN',
                })]: ['1', '2', '3'],
            }),
        );
        render(<TestButton annotable={true} />);
        expect(
            screen.getByText('annotation_sent_count+{"smart_count":3}'),
        ).toBeInTheDocument();
    });

    it('should not render the number of annotations sent by the user when there is none', async () => {
        render(<TestButton annotable={true} />);
        expect(
            screen.queryByText('annotation_sent_count+{"smart_count":0}'),
        ).not.toBeInTheDocument();
    });

    it('should open the modal when clicking on the button', async () => {
        render(<TestButton annotable={true} />);

        await waitFor(() => {
            fireEvent.click(
                screen.getByRole('button', {
                    name: 'annotation_create_button_label+{"field":"Titre du corpus"}',
                }),
            );
        });

        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should call api when submitting annotation form for annotation on title', async () => {
        render(<TestButton />);

        await waitFor(() => {
            fireEvent.click(
                screen.getByRole('button', {
                    name: `annotation_create_button_label+{"field":"Titre du corpus"}`,
                }),
            );
        });

        expect(screen.getByRole('dialog')).toBeInTheDocument();

        await waitFor(() => {
            fireEvent.change(
                screen.getByRole('textbox', {
                    name: 'annotation.comment *',
                }),
                {
                    target: { value: 'test' },
                },
            );
        });

        await waitFor(() => {
            fireEvent.click(screen.getByRole('button', { name: 'next' }));
        });

        await waitFor(() => {
            fireEvent.change(
                screen.getByRole('textbox', {
                    name: 'annotation.authorName *',
                }),
                {
                    target: { value: 'author' },
                },
            );
        });

        await waitFor(() => {
            fireEvent.change(
                screen.getByRole('textbox', {
                    name: 'annotation.authorEmail',
                }),
                {
                    target: { value: 'email@example.org' },
                },
            );
        });

        // Wait for the submit button to be enabled
        await waitFor(() => {
            expect(
                screen.getByRole('button', { name: 'validate' }),
            ).toBeEnabled();
        });

        await waitFor(() => {
            fireEvent.click(screen.getByRole('button', { name: 'validate' }));
        });

        expect(fetch).toHaveBeenCalledWith(
            expect.objectContaining({
                url: '/api/annotation?locale=en',
                method: 'POST',
                body: '{"comment":"test","target":"title","kind":"comment","authorName":"author","authorEmail":"email@example.org","resourceUri":"uid:/0579J7JN","fieldId":"1ddbe5dc-f945-4d38-9c5b-ef20f78cb0cc"}',
            }),
        );
    });

    it('should call api when submiting annotation form for value', async () => {
        render(
            <TestButton
                {...{
                    target: 'value',
                    initialValue: 'a b c',
                }}
            />,
        );

        await waitFor(() => {
            fireEvent.click(
                screen.getByRole('button', {
                    name: `annotation_create_button_label+{"field":"Titre du corpus"}`,
                }),
            );
        });

        expect(screen.getByRole('dialog')).toBeInTheDocument();

        await waitFor(() => {
            fireEvent.click(
                screen.getByRole('menuitem', {
                    name: 'annotation_comment_target_value',
                }),
            );
        });

        await waitFor(() => {
            fireEvent.click(
                screen.getByRole('menuitem', {
                    name: 'annotation_remove_content',
                }),
            );
        });

        await waitFor(() => {
            fireEvent.change(
                screen.getByRole('textbox', {
                    name: 'annotation.comment *',
                }),
                {
                    target: { value: 'test' },
                },
            );
        });

        await waitFor(() => {
            fireEvent.click(screen.getByRole('button', { name: 'next' }));
        });

        await waitFor(() => {
            fireEvent.change(
                screen.getByRole('textbox', {
                    name: 'annotation.authorName *',
                }),
                {
                    target: { value: 'author' },
                },
            );
        });

        await waitFor(() => {
            fireEvent.change(
                screen.getByRole('textbox', {
                    name: 'annotation.authorEmail',
                }),
                {
                    target: { value: 'email@example.org' },
                },
            );
        });

        // Wait for the submit button to be enabled
        await waitFor(() => {
            expect(
                screen.getByRole('button', { name: 'validate' }),
            ).toBeEnabled();
        });

        await waitFor(() => {
            fireEvent.click(screen.getByRole('button', { name: 'validate' }));
        });

        expect(fetch).toHaveBeenCalledWith(
            expect.objectContaining({
                url: '/api/annotation?locale=en',
                method: 'POST',
                body: '{"comment":"test","target":"value","kind":"removal","initialValue":"a b c","authorName":"author","authorEmail":"email@example.org","resourceUri":"uid:/0579J7JN","fieldId":"1ddbe5dc-f945-4d38-9c5b-ef20f78cb0cc"}',
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
