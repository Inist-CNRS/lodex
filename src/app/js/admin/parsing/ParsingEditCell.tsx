import React from 'react';
import ReactJson from 'react-json-view';
import { Save as SaveIcon } from '@mui/icons-material';
import datasetApi from '../api/dataset';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {
    Box,
    Button,
    ButtonGroup,
    CircularProgress,
    Input,
    Menu,
    MenuItem,
    useTheme,
} from '@mui/material';
import { toast } from '../../../../common/tools/toast';
import CancelButton from '../../lib/components/CancelButton';
import { useTranslate } from '../../i18n/I18NContext';

const style = {
    container: {
        background: '#272822',
        color: '#f8f8f2',
        margin: '0 10px',
        padding: '10px',
        borderRadius: '5px',
        minHeight: '100px',
    },
    containedButton: {
        marginTop: '15px',
    },
    icon: {
        marginRight: '10px',
    },
};

// @ts-expect-error TS7006
export const returnParsedValue = (value) => {
    try {
        return JSON.parse(value);
    } catch (e) {
        return value;
    }
};

// @ts-expect-error TS7006
export const isPrimitive = (value) => {
    return value !== Object(value);
};

// @ts-expect-error TS7006
export const tryParseJSONObjectOrArray = (jsonString) => {
    try {
        if (typeof jsonString === 'object') {
            return jsonString;
        }
        const parsed = JSON.parse(jsonString);
        if (parsed && typeof parsed === 'object') {
            return parsed;
        }
    } catch (e) {
        return false;
    }

    return false;
};

// @ts-expect-error TS7006
export const getValueBySavingType = (value, type, previousValue) => {
    if (type === 'number') {
        const parsedValue = Number(value);
        if (isNaN(parsedValue)) {
            throw new Error('value_not_a_number');
        }
        return parsedValue;
    }
    if (type === 'string') {
        const parsedValue = tryParseJSONObjectOrArray(value);
        if (parsedValue) {
            return JSON.stringify(value);
        }
        return value.toString();
    }
    if (type === 'boolean') {
        return [true, 'true', 1, '1', 'on', 'yes', 'oui', 'ok'].includes(value);
    }

    if (type === 'array') {
        const parsedValue = tryParseJSONObjectOrArray(value);
        if (!parsedValue || !(parsedValue instanceof Array)) {
            throw new Error('value_not_an_array');
        }
        return parsedValue;
    }

    if (type === 'object') {
        const parsedValue = tryParseJSONObjectOrArray(value);
        if (!parsedValue || typeof parsedValue !== 'object') {
            throw new Error('value_not_an_object');
        }
        return parsedValue;
    }

    // If no type is provided, we try to guess the type
    if (
        (value instanceof Array || value instanceof Object) &&
        typeof previousValue !== 'string'
    ) {
        return value;
    } else if (isPrimitive(previousValue)) {
        if (typeof previousValue === 'number') {
            return Number(value);
        }
        if (typeof previousValue === 'boolean') {
            return value === 'true';
        }
        if (typeof previousValue === 'string') {
            return value.toString();
        }
    }
    return JSON.stringify(value);
};

// @ts-expect-error TS7006
const isError = (value) => {
    return (
        typeof value === 'string' &&
        (value.startsWith('[Error]') || value.startsWith('ERROR'))
    );
};

interface ButtonEditCellWithDropdownProps {
    loading: boolean;
    handleChange(...args: unknown[]): unknown;
}

const ButtonEditCellWithDropdown = ({
    loading,
    handleChange
}: ButtonEditCellWithDropdownProps) => {
    const { translate } = useTranslate();
    const theme = useTheme();
    const [isOpen, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);

    const types = ['number', 'string', 'boolean', 'array', 'object'];
    return (
        <>
            <ButtonGroup
                variant="contained"
                ref={anchorRef}
                sx={style.containedButton}
            >
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleChange()}
                >
                    {loading ? (
                        <CircularProgress
                            size={20}
                            sx={style.icon}
                            // @ts-expect-error TS2322
                            color="contrast"
                        />
                    ) : (
                        <SaveIcon sx={style.icon} />
                    )}
                    {translate('save')}
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => setOpen(true)}
                >
                    <ArrowDropDownIcon />
                </Button>
            </ButtonGroup>
            <Menu
                open={isOpen}
                onClose={() => setOpen(false)}
                // @ts-expect-error TS2322
                getContentAnchorEl={null}
                anchorEl={anchorRef.current}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                sx={{
                    '& .MuiMenu-paper': {
                        backgroundColor: theme.palette.primary.main,
                        '& .MuiMenuItem-root': {
                            // @ts-expect-error TS2339
                            color: theme.palette.contrast.main,
                        },
                    },
                }}
            >
                {types.map((type) => (
                    <MenuItem
                        key={type}
                        onClick={() => {
                            handleChange(type);
                            setOpen(false);
                        }}
                    >
                        {translate('save_as', {
                            type: type,
                        })}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};

interface ParsingEditCellProps {
    cell: object;
    setToggleDrawer(...args: unknown[]): unknown;
}

const ParsingEditCell = ({
    cell,
    setToggleDrawer
}: ParsingEditCellProps) => {
    const { translate } = useTranslate();
    const theme = useTheme();
    const [loading, setLoading] = React.useState(false);
    const [value, setValue] = React.useState(cell.value);

    // @ts-expect-error TS7006
    const handleChange = async (type) => {
        setLoading(true);
        try {
            let valueToSave;
            try {
                valueToSave = getValueBySavingType(value, type, cell.value);
            } catch (e) {
                // @ts-expect-error TS18046
                toast(translate(e.message), {
                    type: toast.TYPE.ERROR,
                });
                // @ts-expect-error TS18046
                throw new Error(translate(e.message));
            }
            await datasetApi.updateDataset({
                uri: cell.row.uri,
                field: cell.field,
                value: valueToSave,
            });
            cell.row[cell.field] = valueToSave;
            toast(translate('dataset_edit_success'), {
                type: toast.TYPE.SUCCESS,
            });
            setToggleDrawer(false);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (isError(value)) {
        return (
            <div>
                <h2
                    style={{
                        textAlign: 'center',
                        // @ts-expect-error TS2339
                        color: theme.palette.danger.main,
                        fontWeight: 'initial',
                    }}
                >
                    {translate('dataset_edit_enrichment_title', {
                        column_name: cell.field,
                        row_name: cell?.row?.uri || cell?.row?.ark,
                    })}
                </h2>
                <Box sx={style.container}>{cell.value}</Box>
            </div>
        );
    }

    return (
        <div>
            <h2 style={{ textAlign: 'center' }}>
                {translate('column')}{' '}
                <span style={{ color: theme.palette.primary.main }}>
                    {cell.field}
                </span>{' '}
                {translate('for_row')}{' '}
                <span style={{ color: theme.palette.secondary.main }}>
                    {cell?.row?.uri || cell?.row?.ark}
                </span>
            </h2>
            <div style={{ padding: '0 20px' }}>
                {isPrimitive(value) ? (
                    <Input
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        style={{
                            width: '100%',
                            background: '#272822',
                            color: '#f8f8f2',
                            padding: 10,
                            borderRadius: 5,
                        }}
                        multiline
                        minRows={1}
                        maxRows={Infinity}
                    />
                ) : (
                    <ReactJson
                        src={value}
                        theme="monokai"
                        enableClipboard={false}
                        collapsed={2}
                        onEdit={(e) => {
                            setValue(e.updated_src);
                        }}
                        onAdd={(e) => {
                            setValue(e.updated_src);
                        }}
                        onDelete={(e) => {
                            setValue(e.updated_src);
                        }}
                        style={{
                            borderRadius: '5px',
                            maxHeight: '80vh',
                            overflow: 'auto',
                        }}
                    />
                )}
                <Box
                    display="flex"
                    alignItems="flex-end"
                    justifyContent="flex-end"
                >
                    <CancelButton
                        key="cancel"
                        onClick={() => setToggleDrawer(false)}
                    >
                        {translate('cancel')}
                    </CancelButton>
                    <ButtonEditCellWithDropdown
                        handleChange={handleChange}
                        loading={loading}
                    />
                </Box>
            </div>
        </div>
    );
};

export default ParsingEditCell;
