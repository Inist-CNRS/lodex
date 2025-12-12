import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, IconButton, Stack } from '@mui/material';
import { useCallback, type FunctionComponent } from 'react';
import { useTranslate } from '../i18n/I18NContext';

export const ArrayInput = <
    V,
    P extends ArrayInputComponentProps<V> = ArrayInputComponentProps<V>,
>({
    Component,
    values: value,
    onChange,
    defaultValue = undefined,
    ...props
}: ArrayInputProps<V, P>) => {
    const { translate } = useTranslate();

    const handleAddValue = useCallback(() => {
        onChange([...value, structuredClone(defaultValue)]);
    }, [value, defaultValue, onChange]);

    const handleRemoveValue = useCallback(
        (index: number) => {
            onChange(value.filter((_, i) => i !== index));
        },
        [value, onChange],
    );

    const handleValueChange = useCallback(
        (newValue: V | undefined, index: number) => {
            const newValues = value.map((prev, i) => {
                if (index === i) {
                    return newValue;
                }
                return prev;
            });

            onChange(newValues);
        },
        [value, onChange],
    );

    return (
        <Stack spacing="0.5rem">
            {value.map((val, index) => (
                <Stack
                    direction="row"
                    key={index}
                    spacing="1rem"
                    alignItems="flex-start"
                >
                    <Stack
                        direction="row"
                        flexGrow="1"
                        spacing="0.5rem"
                        alignItems="flex-start"
                    >
                        <Component
                            {...(props as P)}
                            value={val}
                            onChange={(newValue) => {
                                handleValueChange(newValue, index);
                            }}
                        />
                    </Stack>
                    <Box
                        sx={{
                            width: '56px',
                            height: '56px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <IconButton
                            color="error"
                            onClick={() => {
                                handleRemoveValue(index);
                            }}
                            aria-label={translate('remove')}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                </Stack>
            ))}
            <Button onClick={handleAddValue} variant="text">
                {translate('add_value')}
            </Button>
        </Stack>
    );
};

export type ArrayInputProps<V, P extends ArrayInputComponentProps<V>> = {
    Component: FunctionComponent<P>;
    values: (V | undefined)[];
    onChange(values: (V | undefined)[]): void;
    defaultValue?: V | undefined;
} & Omit<ArrayInputComponentProps<V>, 'value' | 'onChange'>;

export type ArrayInputComponentProps<V> = {
    value: V | undefined;
    onChange(value: V | undefined): void;
};
