import { useForm } from '@tanstack/react-form';
import {
    fireEvent,
    render,
    waitFor,
    act,
    screen,
} from '@testing-library/react';
import React from 'react';

import { TestI18N } from '../../i18n/I18NContext';
import { ProposedValueFieldText } from './ProposedValueFieldText';

function TestProposedValueFieldText({ field, initialValue }) {
    const form = useForm();
    return (
        <TestI18N>
            <ProposedValueFieldText
                field={field}
                form={form}
                initialValue={initialValue}
            />
        </TestI18N>
    );
}

describe('ProposedValueFieldText', () => {
    it('should render as text field if annotationFormat is text', () => {
        const field = {
            annotationFormat: 'text',
        };
        render(<TestProposedValueFieldText field={field} />);

        expect(
            screen.getByRole('textbox', {
                name: 'annotation.proposedValue *',
            }),
        ).toBeInTheDocument();
    });

    it('should initialize with initial value when set', async () => {
        const field = {
            annotationFormat: 'text',
        };
        let wrapper;
        await act(async () => {
            wrapper = render(
                <TestProposedValueFieldText
                    field={field}
                    initialValue="test"
                />,
            );
        });

        const textBox = wrapper.queryByRole('textbox', {
            name: 'annotation.proposedValue *',
        });

        expect(textBox).toBeInTheDocument();

        expect(textBox).toHaveValue('test');
    });

    it('should support value change', async () => {
        const field = {
            annotationFormat: 'text',
        };
        const wrapper = render(<TestProposedValueFieldText field={field} />);

        const textBox = wrapper.getByRole('textbox', {
            name: 'annotation.proposedValue *',
        });

        expect(textBox).toBeInTheDocument();

        expect(textBox).toHaveValue('');

        await waitFor(() => {
            fireEvent.change(textBox, {
                target: { value: 'test' },
            });
        });

        expect(textBox).toHaveValue('test');
    });
});
