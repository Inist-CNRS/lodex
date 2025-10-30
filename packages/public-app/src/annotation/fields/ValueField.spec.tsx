import { useForm } from '@tanstack/react-form';

import { TestI18N } from '@lodex/frontend-common/i18n/I18NContext';
import { ValueField } from './ValueField';
import { fireEvent, waitFor } from '@testing-library/dom';
import { render } from '../../test-utils';

interface TestValueFieldProps {
    choices: unknown[];
}

function TestValueField({ choices }: TestValueFieldProps) {
    const form = useForm({
        defaultValues: {
            kind: 'correction',
            initialValue: '',
        },
    });

    return (
        <TestI18N>
            {/*
             // @ts-expect-error TS2322 */}
            <ValueField form={form} choices={choices} />
        </TestI18N>
    );
}

describe('ValueField', () => {
    it('should support a list of string as choices', async () => {
        const screen = render(
            <TestValueField choices={['choice1', 'choice2']} />,
        );

        await waitFor(() => {
            fireEvent.mouseDown(
                screen.getByRole('combobox', {
                    name: 'annotation_choose_value_to_correct *',
                }),
            );
        });

        expect(
            screen.getByRole('option', { name: 'choice1' }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('option', { name: 'choice2' }),
        ).toBeInTheDocument();
    });

    it('should support a list of string array as choices', async () => {
        const screen = render(
            <TestValueField
                choices={[
                    ['choice1', 'choice2'],
                    ['choice3', 'choice4'],
                ]}
            />,
        );

        await waitFor(() => {
            fireEvent.mouseDown(
                screen.getByRole('combobox', {
                    name: 'annotation_choose_value_to_correct *',
                }),
            );
        });

        expect(
            screen.getByRole('option', { name: 'choice1 ; choice2' }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('option', { name: 'choice3 ; choice4' }),
        ).toBeInTheDocument();
    });
});
