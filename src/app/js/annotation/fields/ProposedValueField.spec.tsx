import { useForm } from '@tanstack/react-form';
import { render, act } from '@testing-library/react';
// @ts-expect-error TS6133
import React from 'react';

import { TestI18N } from '../../i18n/I18NContext';
import { ProposedValueField } from './ProposedValueField';

interface TestProposedValueFieldProps {
    field: object;
    initialValue?: string;
}

function TestProposedValueField({
    field,
    initialValue,
}: TestProposedValueFieldProps) {
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

describe('ProposedValueField', () => {
    describe('list', () => {
        it('should render ProposedValueFieldList if annotationFormat is list', () => {
            const field = {
                annotationFormat: 'list',
                annotationFormatListOptions: ['option 1', 'option 2'],
            };
            const screen = render(<TestProposedValueField field={field} />);

            expect(
                screen.getByRole('combobox', {
                    name: 'annotation.proposedValue *',
                }),
            ).toBeInTheDocument();
        });

        it('should render as text field if annotation list options is empty', () => {
            const field = {
                annotationFormat: 'list',
                annotationFormatListOptions: [],
            };
            const screen = render(<TestProposedValueField field={field} />);

            expect(
                screen.getByRole('textbox', {
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
            const screen = render(<TestProposedValueField field={field} />);

            expect(
                screen.getByRole('textbox', {
                    name: 'annotation.proposedValue *',
                }),
            ).toBeInTheDocument();
        });

        it('should pass initialValue to ProposedValueFieldText', async () => {
            const field = {
                annotationFormat: 'text',
            };
            const initialValue = 'initial value';
            const screen = await act(async () => {
                return render(
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
