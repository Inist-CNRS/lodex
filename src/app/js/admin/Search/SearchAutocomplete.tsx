import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import {
    Autocomplete,
    Checkbox,
    Chip,
    MenuItem,
    TextField,
} from '@mui/material';

import FieldRepresentation from '../../fields/FieldRepresentation';
import { filterOptions } from './searchUtils';

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

interface SearchAutocompleteProps {
    translation: string;
    value?: unknown[] | object;
    fields: object[];
    onChange(...args: unknown[]): unknown;
    multiple?: boolean;
    testId?: string;
    clearText?: string;
    limitTags?: number;
    isLoading?: boolean;
}

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
}: SearchAutocompleteProps) => {
    return (
        <Autocomplete
            data-testid={testId}
            fullWidth
            // @ts-expect-error TS2322
            options={fields}
            // @ts-expect-error TS2322
            value={value}
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
                />
            )}
            getOptionLabel={(option) =>
                `${option.label} ${option.name && `[${option.name}]`}  `
            }
            renderTags={(options, getTagProps) =>
                options.map((option, index) => {
                    const { key, ...tagProps } = getTagProps({ index });
                    return (
                        <Chip
                            key={key}
                            {...tagProps}
                            label={
                                <FieldRepresentation
                                    field={option}
                                    shortMode
                                    {...tagProps}
                                />
                            }
                        ></Chip>
                    );
                })
            }
            clearText={clearText}
            renderOption={(props, option, { selected }) =>
                multiple
                    ? renderCheckboxItem(props, option, selected)
                    : renderItem(props, option)
            }
            onChange={onChange}
        />
    );
};

export default SearchAutocomplete;
