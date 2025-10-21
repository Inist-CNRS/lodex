import { useForm } from '@tanstack/react-form';
import { fireEvent, render, waitFor } from '@testing-library/react';

import { TestI18N } from '../../i18n/I18NContext';
import {
    ProposedValueFieldList,
    type ProposedValueFieldListProps,
} from './ProposedValueFieldList';

function TestProposedValueFieldList(
    props: Omit<ProposedValueFieldListProps, 'form'>,
) {
    const form = useForm();
    return (
        <TestI18N>
            <ProposedValueFieldList {...props} form={form} />
        </TestI18N>
    );
}

describe('ProposedValueFieldList', () => {
    it('should support value change when options are defined', async () => {
        const screen = render(
            <TestProposedValueFieldList
                options={['option1', 'option2', 'option3']}
            />,
        );

        const textbox = screen.getByRole('textbox', {
            name: 'annotation.proposedValue *',
        });

        await waitFor(() => {
            fireEvent.mouseDown(textbox);
        });

        const option = screen.getByRole('option', {
            name: 'option2',
        });

        expect(option).toBeInTheDocument();

        await waitFor(() => {
            fireEvent.click(option);
        });

        expect(textbox).toHaveValue('option2');
    });

    it('should support mutiple values change when options are defined', async () => {
        const screen = render(
            <TestProposedValueFieldList
                options={['option1', 'option2', 'option3']}
                multiple
            />,
        );

        const textbox = screen.getByRole('textbox', {
            name: 'annotation.proposedValue *',
        });

        await waitFor(() => {
            fireEvent.mouseDown(textbox);
        });

        await waitFor(() => {
            fireEvent.click(
                screen.getByRole('option', {
                    name: 'option1',
                }),
            );
        });

        await waitFor(() => {
            fireEvent.mouseDown(textbox);
        });

        await waitFor(() => {
            fireEvent.click(
                screen.getByRole('option', {
                    name: 'option2',
                }),
            );
        });

        expect(
            screen.getByRole('button', {
                name: 'option1',
            }),
        ).toBeInTheDocument();

        expect(
            screen.getByRole('button', {
                name: 'option2',
            }),
        ).toBeInTheDocument();
    });
});
