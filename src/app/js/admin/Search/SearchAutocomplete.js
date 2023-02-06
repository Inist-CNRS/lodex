import React, { useEffect } from 'react';
import { Autocomplete, Box, MenuItem, TextField } from '@mui/material';
import FieldInternalIcon from '../../fields/FieldInternalIcon';

import PropTypes from 'prop-types';

const SearchAutocomplete = ({
    testId = 'search-autocomplete',
    fields,
    onChange,
    value,
    translation,
    multiple = false,
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
            multiple={multiple}
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
            renderOption={(props, option) =>
                !!option.label && (
                    <MenuItem
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                        {...props}
                    >
                        <Box>
                            {option.label}{' '}
                            {option.name ? `(${option.name})` : ''}
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
                )
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
};

export default SearchAutocomplete;
