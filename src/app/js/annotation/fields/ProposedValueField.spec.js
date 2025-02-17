import { useForm } from '@tanstack/react-form';
import { render } from '@testing-library/react';
import React from 'react';

import { TestI18N } from '../../i18n/I18NContext';
import { ProposedValueField } from './ProposedValueField';

function TestProposedValueField({ field }) {
    const form = useForm();
    return (
        <TestI18N>
            <ProposedValueField field={field} form={form} />
        </TestI18N>
    );
}

describe('ProposedValueField', () => {
    describe('list', () => {
        it('should render ProposedValueFieldList if annotationFormat is list', () => {
            const field = {
                annotationFormat: 'list',
                annotationFormatListOptions: `option 1
option2`,
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
                annotationFormatListOptions: ' ',
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
    });
});
