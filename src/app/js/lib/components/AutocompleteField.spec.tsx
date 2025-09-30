import { useForm } from '@tanstack/react-form';
// @ts-expect-error TS6133
import React from 'react';

import {
    fireEvent,
    render,
    userEvent,
    waitFor,
} from '../../../../test-utils.tsx';
import { TestI18N } from '../../i18n/I18NContext';
import { AutocompleteField } from './AutocompleteField';

// @ts-expect-error TS7006
function TestAutocompleteField(props) {
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

TestAutocompleteField.propTypes = {
    supportsNewValues: AutocompleteField.propTypes.supportsNewValues,
};

describe('AutocompleteField', () => {
    describe('defined values', () => {
        it('should support to select a value', async () => {
            const wrapper = render(<TestAutocompleteField />);

            const textbox = wrapper.getByRole('textbox', {
                name: 'Name',
            });

            await waitFor(() => {
                fireEvent.mouseDown(textbox);
            });

            const option = wrapper.getByRole('option', {
                name: 'John',
            });

            expect(option).toBeInTheDocument();

            await waitFor(() => {
                fireEvent.click(option);
            });

            expect(textbox).toHaveValue('John');
        });

        it('should support filtering values', async () => {
            const wrapper = render(<TestAutocompleteField />);

            const textbox = wrapper.getByRole('textbox', {
                name: 'Name',
            });

            await waitFor(() => {
                fireEvent.mouseDown(textbox);
            });

            await waitFor(() => {
                return userEvent.type(textbox, 'Jo');
            });

            expect(
                wrapper.queryByRole('option', {
                    name: 'John',
                }),
            ).toBeInTheDocument();

            expect(
                wrapper.queryByRole('option', {
                    name: 'Paul',
                }),
            ).not.toBeInTheDocument();
        });
    });

    describe('free solo support', () => {
        it('should support to add a new value', async () => {
            const wrapper = render(<TestAutocompleteField supportsNewValues />);

            const textbox = wrapper.getByRole('textbox', {
                name: 'Name',
            });

            await waitFor(() => {
                fireEvent.mouseDown(textbox);
            });

            await waitFor(() => {
                return userEvent.type(textbox, 'Franck');
            });

            await waitFor(() => {
                const option = wrapper.getByRole('option', {
                    name: 'autocomplete_add+{"option":"Franck"}',
                });

                expect(option).toBeInTheDocument();

                fireEvent.click(option);
            });

            expect(textbox).toHaveValue('Franck');
        });

        it('should not support to have a new value if does not support new values', async () => {
            const wrapper = render(<TestAutocompleteField />);

            const textbox = wrapper.getByRole('textbox', {
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
                    wrapper.getByText('autocomplete_no_options'),
                ).toBeInTheDocument();
            });

            expect(
                wrapper.queryByRole('option', {
                    name: 'autocomplete_add+{"option":"Franck"}',
                }),
            ).not.toBeInTheDocument();

            await waitFor(() => {
                return fireEvent.blur(textbox);
            });

            expect(textbox).toHaveValue('');
        });
    });
});
