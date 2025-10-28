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
    supportsNewValues: AutocompleteMultipleField.propTypes.supportsNewValues,
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
            }, { timeout: 10000 });

            const option = wrapper.getByRole('option', {
                name: 'John',
            });

            expect(option).toBeInTheDocument();

            await waitFor(() => {
                fireEvent.click(option);
            }, { timeout: 10000 });

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
            }, { timeout: 10000 });

            await waitFor(() => {
                fireEvent.click(
                    wrapper.getByRole('option', {
                        name: 'John',
                    }),
                );
            }, { timeout: 10000 });

            await waitFor(() => {
                fireEvent.mouseDown(textbox);
            }, { timeout: 10000 });

            await waitFor(() => {
                fireEvent.click(
                    wrapper.getByRole('option', {
                        name: 'Paul',
                    }),
                );
            }, { timeout: 10000 });

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
            }, { timeout: 10000 });

            await waitFor(() => {
                return userEvent.type(textbox, 'Jo');
            }, { timeout: 10000 });

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
            const wrapper = render(
                <TestAutocompleteMultipleField supportsNewValues />,
            );

            const textbox = wrapper.getByRole('textbox', {
                name: 'Name',
            });

            await waitFor(() => {
                fireEvent.mouseDown(textbox);
            }, { timeout: 10000 });

            await waitFor(() => {
                return userEvent.type(textbox, 'Franck');
            }, { timeout: 10000 });

            await waitFor(() => {
                const option = wrapper.getByRole('option', {
                    name: 'autocomplete_add+{"option":"Franck"}',
                });

                expect(option).toBeInTheDocument();

                fireEvent.click(option);
            }, { timeout: 10000 });

            await waitFor(() => {
                expect(
                    wrapper.getByRole('button', {
                        name: 'Franck',
                    }),
                ).toBeInTheDocument();
            }, { timeout: 10000 });
        }, 30000);

        it('should not support to have a new value if does not support new values', async () => {
            const wrapper = render(<TestAutocompleteMultipleField />);

            const textbox = wrapper.getByRole('textbox', {
                name: 'Name',
            });

            await waitFor(() => {
                fireEvent.mouseDown(textbox);
            }, { timeout: 10000 });

            await waitFor(() => {
                return userEvent.type(textbox, 'Franck');
            }, { timeout: 10000 });

            await waitFor(() => {
                expect(
                    wrapper.getByText('autocomplete_no_options'),
                ).toBeInTheDocument();
            }, { timeout: 10000 });

            expect(
                wrapper.queryByRole('option', {
                    name: 'autocomplete_add+{"option":"Franck"}',
                }),
            ).not.toBeInTheDocument();

            await waitFor(() => {
                return fireEvent.blur(textbox);
            }, { timeout: 10000 });

            expect(
                wrapper.queryAllByRole('button', {
                    name: 'Franck',
                }),
            ).toHaveLength(0);
        });
    });
});
