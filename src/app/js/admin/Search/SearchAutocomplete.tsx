import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import {
    Autocomplete,
    Checkbox,
    CircularProgress,
    InputAdornment,
    MenuItem,
    TextField,
} from '@mui/material';
import React, { useEffect } from 'react';

import PropTypes from 'prop-types';
import FieldRepresentation from '../../fields/FieldRepresentation';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

// @ts-expect-error TS7006
const renderItem = (props, option) => {
    return (
        <MenuItem
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                whiteSpace: 'normal',
            }}
            key={option._id}
            {...props}
        >
            <FieldRepresentation field={option} />
        </MenuItem>
    );
};

// @ts-expect-error TS7006
const renderCheckboxItem = (props, option, selected) => {
    return (
        <li key={option._id} {...props}>
            <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
            />
            <FieldRepresentation field={option} />
        </li>
    );
};

const SearchAutocomplete = ({
    testId = 'search-autocomplete',
    // @ts-expect-error TS7031
    fields,
    // @ts-expect-error TS7031
    onChange,
    // @ts-expect-error TS7031
    value,
    // @ts-expect-error TS7031
    translation,
    multiple = false,
    clearText = 'Clear',
    limitTags = 6,
    isLoading = false,
}) => {
    const [autocompleteValue, setAutocompleteValue] = React.useState(value);

    useEffect(() => {
        setAutocompleteValue(value);
    }, [value]);

    // @ts-expect-error TS7006
    const handleChange = (event, value) => {
        setAutocompleteValue(value);
        onChange(event, value);
    };

    return (
        <Autocomplete
            data-testid={testId}
            fullWidth
            options={fields}
            value={autocompleteValue}
            disableCloseOnSelect={multiple}
            multiple={multiple}
            limitTags={limitTags}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={translation}
                    placeholder={translation}
                    disabled={isLoading}
                    InputProps={{
                        ...params.InputProps,
                        startAdornment: isLoading && (
                            // @ts-expect-error TS2769
                            <InputAdornment>
                                <CircularProgress size={16} />
                            </InputAdornment>
                        ),
                    }}
                />
            )}
            // @ts-expect-error TS2322
            getOptionLabel={(option) =>
                multiple ? (
                    <FieldRepresentation field={option} shortMode />
                ) : (
                    `${option.label} ${option.name && `[${option.name}]`}  `
                )
            }
            clearText={clearText}
            renderOption={(props, option, { selected }) =>
                multiple
                    ? renderCheckboxItem(props, option, selected)
                    : renderItem(props, option)
            }
            onChange={handleChange}
        />
    );
};

SearchAutocomplete.propTypes = {
    translation: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    fields: PropTypes.arrayOf(PropTypes.object).isRequired,
    onChange: PropTypes.func.isRequired,
    multiple: PropTypes.bool,
    testId: PropTypes.string,
    clearText: PropTypes.string,
    limitTags: PropTypes.number,
    isLoading: PropTypes.bool,
};

export default SearchAutocomplete;
