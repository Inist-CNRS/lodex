import { useForm } from '@tanstack/react-form';
import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';

import { TestI18N } from '../../i18n/I18NContext';
import { ProposedValueFieldList } from './ProposedValueFieldList';

// @ts-expect-error TS7006
function TestProposedValueFieldList(props) {
    const form = useForm();
    return (
        <TestI18N>
            {/*
             // @ts-expect-error TS2322 */}
            <ProposedValueFieldList {...props} form={form} />
        </TestI18N>
    );
}

TestProposedValueFieldList.propTypes = {
    options: ProposedValueFieldList.propTypes.options,
    multiple: ProposedValueFieldList.propTypes.multiple,
};

describe('ProposedValueFieldList', () => {
    it('should support value change when options are defined', async () => {
        const wrapper = render(
            <TestProposedValueFieldList
                options={['option1', 'option2', 'option3']}
            />,
        );

        const textbox = wrapper.getByRole('textbox', {
            name: 'annotation.proposedValue *',
        });

        await waitFor(() => {
            fireEvent.mouseDown(textbox);
        });

        const option = wrapper.getByRole('option', {
            name: 'option2',
        });

        expect(option).toBeInTheDocument();

        await waitFor(() => {
            fireEvent.click(option);
        });

        expect(textbox).toHaveValue('option2');
    });

    it('should support mutiple values change when options are defined', async () => {
        const wrapper = render(
            <TestProposedValueFieldList
                options={['option1', 'option2', 'option3']}
                multiple
            />,
        );

        const textbox = wrapper.getByRole('textbox', {
            name: 'annotation.proposedValue *',
        });

        await waitFor(() => {
            fireEvent.mouseDown(textbox);
        });

        await waitFor(() => {
            fireEvent.click(
                wrapper.getByRole('option', {
                    name: 'option1',
                }),
            );
        });

        await waitFor(() => {
            fireEvent.mouseDown(textbox);
        });

        await waitFor(() => {
            fireEvent.click(
                wrapper.getByRole('option', {
                    name: 'option2',
                }),
            );
        });

        expect(
            wrapper.getByRole('button', {
                name: 'option1',
            }),
        ).toBeInTheDocument();

        expect(
            wrapper.getByRole('button', {
                name: 'option2',
            }),
        ).toBeInTheDocument();
    });
});
