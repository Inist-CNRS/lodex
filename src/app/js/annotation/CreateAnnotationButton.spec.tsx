import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { MemoryRouter, Route, Switch } from 'react-router-dom';
import { render } from '../../../test-utils';

import { TestI18N } from '../i18n/I18NContext';
import fetch from '../lib/fetch';
import { getStorageKey } from './annotationStorage';
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

interface TestButtonProps {
    annotable?: boolean;
    fieldFormatName?: string;
}

function TestButton({
    annotable,
    fieldFormatName = 'formatParagraph',
    ...props
}: TestButtonProps) {
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
                                    name: 'title',
                                    annotable,
                                    format: {
                                        name: fieldFormatName,
                                    },
                                }}
                                resource={{
                                    title: 'Corpus title',
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

describe('CreateAnnotationButton', () => {
    beforeEach(() => {
        localStorage.clear();
        window.localStorage.setItem(
            'redux-localstorage',
            JSON.stringify({ user: { token: 'token' } }),
        );
        // @ts-expect-error TS2339
        useCanAnnotate.mockReturnValue(true);
    });

    afterEach(() => {
        window.localStorage.clear();
        jest.clearAllMocks();
    });

    it('should not render the button if useCanAccess return false', async () => {
        // @ts-expect-error TS2339
        useCanAnnotate.mockReturnValue(false);
        const screen = render(<TestButton />);
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
                'uid:/0579J7JN': {
                    '1ddbe5dc-f945-4d38-9c5b-ef20f78cb0cc': ['1', '2', '3'],
                },
            }),
        );
        const screen = render(<TestButton annotable={true} />);
        expect(
            screen.getByText('annotation_sent_count+{"smart_count":3}'),
        ).toBeInTheDocument();
    });

    it('should not render the number of annotations sent by the user when there is none', async () => {
        const screen = render(<TestButton annotable={true} />);
        expect(
            screen.queryByText('annotation_sent_count+{"smart_count":0}'),
        ).not.toBeInTheDocument();
    });

    it('should open the modal when clicking on the button', async () => {
        const screen = render(<TestButton annotable={true} />);

        await screen.waitFor(() => {
            screen.fireEvent.click(
                screen.getByRole('button', {
                    name: 'annotation_create_button_label+{"field":"Titre du corpus"}',
                }),
            );
        });

        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should call api when submitting annotation form for annotation on title', async () => {
        const screen = render(<TestButton />);

        await screen.waitFor(() => {
            screen.fireEvent.click(
                screen.getByRole('button', {
                    name: `annotation_create_button_label+{"field":"Titre du corpus"}`,
                }),
            );
        });

        expect(screen.getByRole('dialog')).toBeInTheDocument();

        await screen.waitFor(() => {
            screen.fireEvent.change(
                screen.getByRole('textbox', {
                    name: 'annotation.comment *',
                }),
                {
                    target: { value: 'test' },
                },
            );
        });

        await screen.waitFor(() => {
            screen.fireEvent.click(
                screen.getByRole('button', { name: 'next' }),
            );
        });

        await screen.waitFor(() => {
            screen.fireEvent.change(
                screen.getByRole('textbox', {
                    name: 'annotation.authorName *',
                }),
                {
                    target: { value: 'author' },
                },
            );
        });

        await screen.waitFor(() => {
            screen.fireEvent.change(
                screen.getByRole('textbox', {
                    name: 'annotation.authorEmail',
                }),
                {
                    target: { value: 'email@example.org' },
                },
            );
        });

        // Wait for the submit button to be enabled
        await screen.waitFor(() => {
            expect(
                screen.getByRole('button', { name: 'validate' }),
            ).toBeEnabled();
        });

        await screen.waitFor(() => {
            screen.fireEvent.click(
                screen.getByRole('button', { name: 'validate' }),
            );
        });

        expect(fetch).toHaveBeenCalledWith(
            expect.objectContaining({
                url: '/api/annotation?locale=en',
                method: 'POST',
                body: '{"resourceUri":"uid:/0579J7JN","authorName":"author","comment":"test","target":"title","kind":"comment","authorEmail":"email@example.org","reCaptchaToken":null,"fieldId":"1ddbe5dc-f945-4d38-9c5b-ef20f78cb0cc"}',
            }),
        );
    });

    it('should call api when submiting annotation form for value', async () => {
        const screen = render(
            <TestButton
                {...{
                    target: 'value',
                    resource: { title: 'a b c' },
                    fieldFormatName: 'paragraph',
                }}
            />,
        );

        await screen.waitFor(() => {
            screen.fireEvent.click(
                screen.getByRole('button', {
                    name: `annotation_create_button_label+{"field":"Titre du corpus"}`,
                }),
            );
        });

        expect(screen.getByRole('dialog')).toBeInTheDocument();

        await screen.waitFor(() => {
            screen.fireEvent.click(
                screen.getByRole('menuitem', {
                    name: 'annotation_remove_content_choice',
                }),
            );
        });

        await screen.waitFor(() => {
            screen.fireEvent.change(
                screen.getByRole('textbox', {
                    name: 'annotation.comment *',
                }),
                {
                    target: { value: 'test' },
                },
            );
        });

        await screen.waitFor(() => {
            screen.fireEvent.click(
                screen.getByRole('button', { name: 'next' }),
            );
        });

        await screen.waitFor(() => {
            screen.fireEvent.change(
                screen.getByRole('textbox', {
                    name: 'annotation.authorName *',
                }),
                {
                    target: { value: 'author' },
                },
            );
        });

        await screen.waitFor(() => {
            screen.fireEvent.change(
                screen.getByRole('textbox', {
                    name: 'annotation.authorEmail',
                }),
                {
                    target: { value: 'email@example.org' },
                },
            );
        });

        // Wait for the submit button to be enabled
        await screen.waitFor(() => {
            expect(
                screen.getByRole('button', { name: 'validate' }),
            ).toBeEnabled();
        });

        await screen.waitFor(() => {
            screen.fireEvent.click(
                screen.getByRole('button', { name: 'validate' }),
            );
        });

        expect(fetch).toHaveBeenCalledWith(
            expect.objectContaining({
                url: '/api/annotation?locale=en',
                method: 'POST',
                body: '{"resourceUri":"uid:/0579J7JN","authorName":"author","comment":"test","target":"value","kind":"removal","initialValue":"a b c","authorEmail":"email@example.org","reCaptchaToken":null,"fieldId":"1ddbe5dc-f945-4d38-9c5b-ef20f78cb0cc"}',
            }),
        );
    });

    it('should not display button if field is not annotable', async () => {
        const screen = render(<TestButton annotable={false} />);

        expect(
            screen.queryAllByRole('button', {
                name: 'annotation_create_button_label',
            }),
        ).toHaveLength(0);
    });
});
