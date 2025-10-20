import { useForm } from '@tanstack/react-form';
import { render, act } from '@testing-library/react';
// @ts-expect-error TS6133
import React from 'react';

import { TestI18N } from '../../i18n/I18NContext';
import { ProposedValueFieldText } from './ProposedValueFieldText';

interface TestProposedValueFieldTextProps {
    field: object;
    initialValue?: string;
}

function TestProposedValueFieldText({
    field,
    initialValue,
}: TestProposedValueFieldTextProps) {
    const form = useForm();
    return (
        <TestI18N>
            <ProposedValueFieldText
                // @ts-expect-error TS2322
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
        const screen = render(<TestProposedValueFieldText field={field} />);

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
        let screen;
        await act(async () => {
            screen = render(
                <TestProposedValueFieldText
                    field={field}
                    initialValue="test"
                />,
            );
        });

        // @ts-expect-error TS18048
        const textBox = screen.queryByRole('textbox', {
            name: 'annotation.proposedValue *',
        });

        expect(textBox).toBeInTheDocument();

        expect(textBox).toHaveValue('test');
    });

    it('should support value change', async () => {
        const field = {
            annotationFormat: 'text',
        };
        const screen = render(<TestProposedValueFieldText field={field} />);

        const textBox = screen.getByRole('textbox', {
            name: 'annotation.proposedValue *',
        });

        expect(textBox).toBeInTheDocument();

        expect(textBox).toHaveValue('');

        await screen.waitFor(() => {
            screen.fireEvent.change(textBox, {
                target: { value: 'test' },
            });
        });

        expect(textBox).toHaveValue('test');
    });
});
