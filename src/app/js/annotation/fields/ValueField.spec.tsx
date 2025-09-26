import { useForm } from '@tanstack/react-form';
import React from 'react';
import { fireEvent, render, waitFor } from '../../../../test-utils';
import { TestI18N } from '../../i18n/I18NContext';
import { ValueField } from './ValueField';

// @ts-expect-error TS7031
function TestValueField({ choices }) {
    const form = useForm({
        defaultValues: {
            kind: 'correction',
            initialValue: '',
        },
    });

    return (
        <TestI18N>
            <ValueField form={form} choices={choices} />
        </TestI18N>
    );
}

TestValueField.propTypes = {
    choices: ValueField.propTypes.choices,
};

describe('ValueField', () => {
    it('should support a list of string as choices', async () => {
        const wrapper = render(
            <TestValueField choices={['choice1', 'choice2']} />,
        );

        await waitFor(() => {
            fireEvent.mouseDown(
                wrapper.getByRole('button', {
                    name: 'annotation_choose_value_to_correct *',
                }),
            );
        });

        expect(
            wrapper.getByRole('option', { name: 'choice1' }),
        ).toBeInTheDocument();
        expect(
            wrapper.getByRole('option', { name: 'choice2' }),
        ).toBeInTheDocument();
    });

    it('should support a list of string array as choices', async () => {
        const wrapper = render(
            <TestValueField
                choices={[
                    ['choice1', 'choice2'],
                    ['choice3', 'choice4'],
                ]}
            />,
        );

        await waitFor(() => {
            fireEvent.mouseDown(
                wrapper.getByRole('button', {
                    name: 'annotation_choose_value_to_correct *',
                }),
            );
        });

        expect(
            wrapper.getByRole('option', { name: 'choice1 ; choice2' }),
        ).toBeInTheDocument();
        expect(
            wrapper.getByRole('option', { name: 'choice3 ; choice4' }),
        ).toBeInTheDocument();
    });
});
