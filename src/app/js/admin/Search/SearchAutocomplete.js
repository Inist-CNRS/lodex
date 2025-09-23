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
    fields,
    onChange,
    value,
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

    const handleChange = (event, value) => {
        setAutocompleteValue(value);
        onChange(event, value);
    };
    // Fonction pour normaliser la chaîne
    const normalize = (str) =>
        (str || '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/\p{Diacritic}/gu, '');
    // Découpe en tokens en séparant sur espaces et caractères spéciaux
    const tokenize = (str) =>
        normalize(str)
            .split(/[^a-z0-9]+/)
            .filter(Boolean);
    // Filtrage : match sur le début d'un mot ou sur le label complet
    const filterOptions = (options, { inputValue }) => {
        const inputTokens = tokenize(inputValue);
        return options.filter((option) => {
            const labelTokens = tokenize(option.label);
            const nameTokens = tokenize(option.name);
            const allTokens = labelTokens.concat(nameTokens);
            if (inputTokens.length === 0) return true;
            // Tous les tokens de la saisie doivent matcher le début d’un mot du label ou du nom
            const allMatch = inputTokens.every((inputToken) =>
                allTokens.some((token) => token.startsWith(inputToken)),
            );
            // Ou si la saisie correspond exactement au label ou au nom
            const normalizedInput = normalize(inputValue);
            const matchExact =
                normalize(option.label) === normalizedInput ||
                normalize(option.name) === normalizedInput;
            return allMatch || matchExact;
        });
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
            filterOptions={filterOptions}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={translation}
                    placeholder={translation}
                    disabled={isLoading}
                    InputProps={{
                        ...params.InputProps,
                        startAdornment: isLoading && (
                            <InputAdornment>
                                <CircularProgress size={16} />
                            </InputAdornment>
                        ),
                    }}
                />
            )}
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
