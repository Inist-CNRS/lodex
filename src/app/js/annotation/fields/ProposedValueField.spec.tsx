import { useForm } from '@tanstack/react-form';
import { render, screen, act } from '@testing-library/react';
import React from 'react';

import PropTypes from 'prop-types';
import { TestI18N } from '../../i18n/I18NContext';
import { ProposedValueField } from './ProposedValueField';

function TestProposedValueField({ field, initialValue }) {
    const form = useForm();
    return (
        <TestI18N>
            <ProposedValueField
                field={field}
                form={form}
                initialValue={initialValue}
            />
        </TestI18N>
    );
}

TestProposedValueField.propTypes = {
    field: PropTypes.object.isRequired,
    initialValue: PropTypes.string,
};

describe('ProposedValueField', () => {
    describe('list', () => {
        it('should render ProposedValueFieldList if annotationFormat is list', () => {
            const field = {
                annotationFormat: 'list',
                annotationFormatListOptions: ['option 1', 'option 2'],
            };
            const wrapper = render(<TestProposedValueField field={field} />);

            expect(
                wrapper.getByRole('combobox', {
                    name: 'annotation.proposedValue *',
                }),
            ).toBeInTheDocument();
        });

        it('should render as text field if annotation list options is empty', () => {
            const field = {
                annotationFormat: 'list',
                annotationFormatListOptions: [],
            };
            const wrapper = render(<TestProposedValueField field={field} />);

            expect(
                wrapper.getByRole('textbox', {
                    name: 'annotation.proposedValue *',
                }),
            ).toBeInTheDocument();
        });
    });

    describe('text', () => {
        it('should render as text field if annotationFormat is text', () => {
            const field = {
                annotationFormat: 'text',
            };
            const wrapper = render(<TestProposedValueField field={field} />);

            expect(
                wrapper.getByRole('textbox', {
                    name: 'annotation.proposedValue *',
                }),
            ).toBeInTheDocument();
        });

        it('should pass initialValue to ProposedValueFieldText', async () => {
            const field = {
                annotationFormat: 'text',
            };
            const initialValue = 'initial value';
            await act(async () => {
                render(
                    <TestProposedValueField
                        field={field}
                        initialValue={initialValue}
                    />,
                );
            });

            expect(
                screen.getByRole('textbox', {
                    name: 'annotation.proposedValue *',
                }),
            ).toHaveValue(initialValue);
        });
    });
});
