import { useForm } from '@tanstack/react-form';

import { render, userEvent } from '../../../../test-utils';
import { TestI18N } from '../../i18n/I18NContext';
import {
    AutocompleteMultipleField,
    type AutocompleteMultipleFieldProps,
} from './AutocompleteMultipleField';
import { fireEvent, waitFor } from '@testing-library/dom';

function TestAutocompleteMultipleField(
    props: Omit<
        AutocompleteMultipleFieldProps,
        'form' | 'name' | 'label' | 'options'
    >,
) {
    const form = useForm({
        defaultValues: {
            name: [],
        },
    });

    return (
        <TestI18N>
            <AutocompleteMultipleField
                form={form}
                name="name"
                label="Name"
                options={['John', 'Paul']}
                {...props}
            />
        </TestI18N>
    );
}

describe('AutocompleteMultipleField', () => {
    describe('defined values', () => {
        it('should support to select a value', async () => {
            const screen = render(<TestAutocompleteMultipleField />);

            const textbox = screen.getByRole('textbox', {
                name: 'Name',
            });

            await waitFor(() => {
                fireEvent.mouseDown(textbox);
            });

            const option = screen.getByRole('option', {
                name: 'John',
            });

            expect(option).toBeInTheDocument();

            await waitFor(() => {
                fireEvent.click(option);
            });

            expect(
                screen.getByRole('button', {
                    name: 'John',
                }),
            ).toBeInTheDocument();
        });

        it('should support to select multiple values', async () => {
            const screen = render(<TestAutocompleteMultipleField />);

            const textbox = screen.getByRole('textbox', {
                name: 'Name',
            });

            await waitFor(() => {
                fireEvent.mouseDown(textbox);
            });

            await waitFor(() => {
                fireEvent.click(
                    screen.getByRole('option', {
                        name: 'John',
                    }),
                );
            });

            await waitFor(() => {
                fireEvent.mouseDown(textbox);
            });

            await waitFor(() => {
                fireEvent.click(
                    screen.getByRole('option', {
                        name: 'Paul',
                    }),
                );
            });

            expect(
                screen.getByRole('button', {
                    name: 'John',
                }),
            ).toBeInTheDocument();

            expect(
                screen.getByRole('button', {
                    name: 'Paul',
                }),
            ).toBeInTheDocument();
        });

        it('should support filtering values', async () => {
            const screen = render(<TestAutocompleteMultipleField />);

            const textbox = screen.getByRole('textbox', {
                name: 'Name',
            });

            await waitFor(() => {
                fireEvent.mouseDown(textbox);
            });

            await waitFor(() => {
                return userEvent.type(textbox, 'Jo');
            });

            expect(
                screen.queryByRole('option', {
                    name: 'John',
                }),
            ).toBeInTheDocument();

            expect(
                screen.queryByRole('option', {
                    name: 'Paul',
                }),
            ).not.toBeInTheDocument();
        });
    });

    describe('free solo support', () => {
        it('should support to add a new value', async () => {
            const screen = render(
                <TestAutocompleteMultipleField supportsNewValues />,
            );

            const textbox = screen.getByRole('textbox', {
                name: 'Name',
            });

            await waitFor(() => {
                fireEvent.mouseDown(textbox);
            });

            await waitFor(() => {
                return userEvent.type(textbox, 'Franck');
            });

            await waitFor(() => {
                const option = screen.getByRole('option', {
                    name: 'autocomplete_add+{"option":"Franck"}',
                });

                expect(option).toBeInTheDocument();

                fireEvent.click(option);
            });

            expect(
                screen.getByRole('button', {
                    name: 'Franck',
                }),
            ).toBeInTheDocument();
        });

        it('should not support to have a new value if does not support new values', async () => {
            const screen = render(<TestAutocompleteMultipleField />);

            const textbox = screen.getByRole('textbox', {
                name: 'Name',
            });

            await waitFor(() => {
                fireEvent.mouseDown(textbox);
            });

            await waitFor(() => {
                return userEvent.type(textbox, 'Franck');
            });

            await waitFor(() => {
                expect(
                    screen.getByText('autocomplete_no_options'),
                ).toBeInTheDocument();
            });

            expect(
                screen.queryByRole('option', {
                    name: 'autocomplete_add+{"option":"Franck"}',
                }),
            ).not.toBeInTheDocument();

            await waitFor(() => {
                return fireEvent.blur(textbox);
            });

            expect(
                screen.queryAllByRole('button', {
                    name: 'Franck',
                }),
            ).toHaveLength(0);
        });
    });
});
