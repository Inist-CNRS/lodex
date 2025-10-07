import {
    Autocomplete as MuiAutocomplete,
    type AutocompleteProps as MuiAutocompleteProps,
    FormControl,
    FormHelperText,
    TextField,
} from '@mui/material';
import { useController, useFormContext } from 'react-hook-form';
import { useCallback } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetch as fetchAction } from '../fetch';
import { useTranslate } from '../i18n/I18NContext.tsx';

type AutoCompleteFieldProps = Partial<
    MuiAutocompleteProps<any, false, false, true>
> & {
    name: string;
    validate?: (value: unknown) => string | undefined;
    label: string;
    dataSource: any;
    allowNewItem?: boolean;
    getFetchRequest: (searchText: string) => { url: string };
    parseResponse: (response: any) => any;
    handleSearch: (searchText: string) => void;
};

const AutoCompleteField = ({
    name,
    validate,
    label,
    dataSource,
    allowNewItem = false,
    getFetchRequest: _getFetchRequest,
    parseResponse: _parseResponse,
    handleSearch,
    ...props
}: AutoCompleteFieldProps) => {
    const { translate } = useTranslate();
    const { control } = useFormContext();

    const { field, fieldState } = useController({
        name,
        rules: {
            validate,
        },
        control,
    });

    const source = dataSource || [];

    const handleValueChosen = useCallback(
        (_, value) => {
            // Material UI doc: index is the index in dataSource of the list item selected,
            // or -1 if enter is pressed in the TextField
            if (!allowNewItem) {
                return field.onChange('');
            }

            return value.text
                ? field.onChange(value.text)
                : field.onChange(value);
        },
        [field.onChange],
    );

    const handleComplete = useCallback(
        (_, searchText) => {
            if (allowNewItem) {
                field.onChange(searchText);
                handleSearch(searchText);
            }
        },
        [field.onChange, handleSearch],
    );

    return (
        <FormControl fullWidth>
            <MuiAutocomplete
                {...props}
                options={source}
                freeSolo
                getOptionLabel={(option) => option.text}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        placeholder={label}
                        label={label}
                        helperText={
                            field.value
                                ? `(${translate('actually')} ${field.value})`
                                : undefined
                        }
                    />
                )}
                onChange={handleValueChosen}
                onInputChange={handleComplete}
                noOptionsText={translate('no_option')}
            />
            {fieldState.error?.message && (
                <FormHelperText error>
                    {fieldState.error.message}
                </FormHelperText>
            )}
        </FormControl>
    );
};

const mapStateToProps = (
    // @ts-expect-error TS7031
    { fetch },
    { name, parseResponse }: AutoCompleteFieldProps,
) => ({
    dataSource: parseResponse(fetch[name] && fetch[name].response),
});

const mapDispatchToProps = (
    // @ts-expect-error TS7006
    dispatch,
    { name, getFetchRequest }: AutoCompleteFieldProps,
) =>
    bindActionCreators(
        {
            handleSearch: (searchText) =>
                searchText
                    ? fetchAction({ config: getFetchRequest(searchText), name })
                    : { type: '@@NULL' }, // We must return an action so return an action which will not be handled
        },
        dispatch,
    );

export default connect(mapStateToProps, mapDispatchToProps)(AutoCompleteField);
