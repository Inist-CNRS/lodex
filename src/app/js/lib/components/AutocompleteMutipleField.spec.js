import { useForm } from '@tanstack/react-form';
import React from 'react';

import { fireEvent, render, userEvent, waitFor } from '../../../../test-utils';
import { TestI18N } from '../../i18n/I18NContext';
import { AutocompleteMultipleField } from './AutocompleteMultipleField';

function TestAutocompleteMultipleField(props) {
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

TestAutocompleteMultipleField.propTypes = {
    freeSolo: AutocompleteMultipleField.propTypes.freeSolo,
};

describe('AutocompleteMultipleField', () => {
    describe('defined values', () => {
        it('should support to select a value', async () => {
            const wrapper = render(<TestAutocompleteMultipleField />);

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

            expect(
                wrapper.getByRole('button', {
                    name: 'John',
                }),
            ).toBeInTheDocument();
        });

        it('should support to select multiple values', async () => {
            const wrapper = render(<TestAutocompleteMultipleField />);

            const textbox = wrapper.getByRole('textbox', {
                name: 'Name',
            });

            await waitFor(() => {
                fireEvent.mouseDown(textbox);
            });

            await waitFor(() => {
                fireEvent.click(
                    wrapper.getByRole('option', {
                        name: 'John',
                    }),
                );
            });

            await waitFor(() => {
                fireEvent.mouseDown(textbox);
            });

            await waitFor(() => {
                fireEvent.click(
                    wrapper.getByRole('option', {
                        name: 'Paul',
                    }),
                );
            });

            expect(
                wrapper.getByRole('button', {
                    name: 'John',
                }),
            ).toBeInTheDocument();

            expect(
                wrapper.getByRole('button', {
                    name: 'Paul',
                }),
            ).toBeInTheDocument();
        });

        it('should support filtering values', async () => {
            const wrapper = render(<TestAutocompleteMultipleField />);

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
            const wrapper = render(<TestAutocompleteMultipleField freeSolo />);

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
                    name: 'autocomplete_add',
                });

                expect(option).toBeInTheDocument();

                fireEvent.click(option);
            });

            expect(
                wrapper.getByRole('button', {
                    name: 'Franck',
                }),
            ).toBeInTheDocument();
        });
    });
});
