import React, { useEffect } from 'react';
import {
    Autocomplete,
    Box,
    Checkbox,
    MenuItem,
    TextField,
} from '@mui/material';
import FieldInternalIcon from '../../fields/FieldInternalIcon';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

import PropTypes from 'prop-types';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const renderItem = (props, option) => {
    return (
        <MenuItem
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                whiteSpace: 'normal',
            }}
            {...props}
        >
            <Box>
                {option.label} {option.name ? `(${option.name})` : ''}
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                {option.internalScopes &&
                    option.internalScopes.map(internalScope => (
                        <FieldInternalIcon
                            key={internalScope}
                            scope={internalScope}
                        />
                    ))}
                {option.internalName}
            </Box>
        </MenuItem>
    );
};

const renderCheckboxItem = (props, option, selected) => {
    return (
        <li {...props}>
            <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
            />
            <Box>
                {option.label} {option.name ? `(${option.name})` : ''}
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                {option.internalScopes &&
                    option.internalScopes.map(internalScope => (
                        <FieldInternalIcon
                            key={internalScope}
                            scope={internalScope}
                        />
                    ))}
                {option.internalName}
            </Box>
        </li>
    );
};

const SearchAutocomplete = ({
    testId = 'search-autocomplete',
    fields,
    onChange,
    value,
    translation,
    multiple = false,
    clearText = 'Clear',
    limitTags = 6,
}) => {
    const [autocompleteValue, setAutocompleteValue] = React.useState(value);

    useEffect(() => {
        setAutocompleteValue(value);
    }, [value]);

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
            renderInput={params => (
                <TextField
                    {...params}
                    label={translation}
                    placeholder={translation}
                />
            )}
            getOptionLabel={option =>
                `${option.label} ${option.name ? `(${option.name})` : ''}`
            }
            clearText={clearText}
            renderOption={(props, option, { selected }) =>
                !!option.label && multiple
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
};

export default SearchAutocomplete;
