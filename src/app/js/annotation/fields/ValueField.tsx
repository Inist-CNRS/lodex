import {
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
} from '@mui/material';
import { useMemo } from 'react';

import { useStore } from '@tanstack/react-form';
import { useTranslate } from '../../i18n/I18NContext';

interface ValueFieldProps {
    form: any;
    choices: string[];
}

/**
 * @param {Object} props
 * @param {Object} props.form
 * @param {string[] | string[][]} props.choices
 */
export function ValueField({ form, choices }: ValueFieldProps) {
    const { translate } = useTranslate();

    const kind = useStore(form.store, (state) => {
        // @ts-expect-error TS7034
        return state.values.kind;
    });

    const formattedChoices = useMemo(() => {
        return choices.map((choice): string => {
            return ([] as string[]).concat(choice).join(' ; ');
        });
    }, [choices]);

    return (
        <form.Field name="initialValue">
            {/*
             // @ts-expect-error TS7006 */}
            {(field) => {
                const hasErrors = !!(
                    field.state.meta.isTouched &&
                    field.state.meta.errors?.length
                );

                const label = `${translate(kind === 'correction' ? 'annotation_choose_value_to_correct' : 'annotation_choose_value_to_remove')} *`;
                return (
                    <FormControl fullWidth>
                        <InputLabel id="annotation_choose_value">
                            {label}
                        </InputLabel>
                        <Select
                            label={label}
                            labelId="annotation_choose_value"
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) =>
                                field.handleChange(e.target.value.toString())
                            }
                            minRows={5}
                            maxRows={10}
                            multiline
                            error={hasErrors}
                            SelectDisplayProps={{
                                'aria-labelledby': 'annotation_choose_value',
                            }}
                        >
                            {formattedChoices.map((choice) => (
                                <MenuItem key={choice} value={choice}>
                                    {choice}
                                </MenuItem>
                            ))}
                        </Select>
                        {hasErrors && (
                            <FormHelperText error role="alert">
                                {translate(field.state.meta.errors[0])}
                            </FormHelperText>
                        )}
                    </FormControl>
                );
            }}
        </form.Field>
    );
}
