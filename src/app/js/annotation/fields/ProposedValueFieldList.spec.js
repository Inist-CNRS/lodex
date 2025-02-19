import { useForm } from '@tanstack/react-form';
import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';

import { TestI18N } from '../../i18n/I18NContext';
import { ProposedValueFieldList } from './ProposedValueFieldList';

function TestProposedValueFieldList({ options }) {
    const form = useForm();
    return (
        <TestI18N>
            <ProposedValueFieldList options={options} form={form} />
        </TestI18N>
    );
}

describe('ProposedValueFieldList', () => {
    it('should render as text field if annotationFormat is text', () => {
        const wrapper = render(
            <TestProposedValueFieldList
                options={['option1', 'option2', 'option3']}
            />,
        );

        expect(
            wrapper.getByRole('combobox', {
                name: 'annotation.proposedValue *',
            }),
        ).toBeInTheDocument();
    });

    it('should support value change', async () => {
        const wrapper = render(
            <TestProposedValueFieldList
                options={['option1', 'option2', 'option3']}
            />,
        );

        const combobox = wrapper.getByRole('combobox', {
            name: 'annotation.proposedValue *',
        });

        const input = wrapper.queryByTestId('select-proposedValue-input', {
            hidden: true,
        });

        expect(combobox).toBeInTheDocument();

        expect(input).toHaveValue('');

        await waitFor(() => {
            fireEvent.change(input, {
                target: { value: 'option2' },
            });
        });

        expect(input).toHaveValue('option2');
    });
});
