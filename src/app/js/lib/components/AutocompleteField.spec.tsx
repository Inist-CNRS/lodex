import { useForm } from '@tanstack/react-form';

import { act, render, userEvent } from '../../../../test-utils';
import { TestI18N } from '@lodex/frontend-common/i18n/I18NContext';
import {
    AutocompleteField,
    type AutocompleteFieldProps,
} from './AutocompleteField';
import { fireEvent, waitFor } from '@testing-library/dom';

function TestAutocompleteField(
    props: Omit<AutocompleteFieldProps, 'form' | 'name' | 'label'>,
) {
    const form = useForm({
        defaultValues: {
            name: '',
        },
    });

    return (
        <TestI18N>
            <AutocompleteField
                form={form}
                name="name"
                label="Name"
                options={['John', 'Paul']}
                {...props}
            />
        </TestI18N>
    );
}

describe('AutocompleteField', () => {
    describe('defined values', () => {
        it('should support to select a value', async () => {
            const screen = render(<TestAutocompleteField />);

            const textbox = screen.getByRole('combobox', {
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

            expect(textbox).toHaveValue('John');
        });

        it('should support filtering values', async () => {
            const screen = render(<TestAutocompleteField />);

            const textbox = screen.getByRole('combobox', {
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
            const screen = render(<TestAutocompleteField supportsNewValues />);

            const textbox = screen.getByRole('combobox', {
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

            expect(textbox).toHaveValue('Franck');
        });

        it('should not support to have a new value if does not support new values', async () => {
            const screen = render(<TestAutocompleteField />);

            const textbox = screen.getByRole('combobox', {
                name: 'Name',
            });

            act(() => {
                fireEvent.mouseDown(textbox);
            });

            act(() => {
                userEvent.type(textbox, 'Franck');
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

            act(() => {
                userEvent.tab();
            });

            await waitFor(() => {
                expect(textbox).toHaveValue('');
            });
        });
    });
});
