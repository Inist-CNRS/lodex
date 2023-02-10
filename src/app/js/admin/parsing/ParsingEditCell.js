import React from 'react';
import translate from 'redux-polyglot/translate';
import PropTypes from 'prop-types';
import ReactJson from 'react-json-view';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { makeStyles } from '@material-ui/styles';
import { Save as SaveIcon } from '@material-ui/icons';
import datasetApi from '../api/dataset';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import {
    Box,
    Button,
    ButtonGroup,
    CircularProgress,
    Input,
    Menu,
    MenuItem,
} from '@material-ui/core';
import colorsTheme from '../../../custom/colorsTheme';
import { toast } from 'react-toastify';

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
        marginTop: 15,
    },
    icon: {
        marginRight: 10,
    },
    menuPaper: {
        backgroundColor: colorsTheme.green.primary,
        '& .MuiMenuItem-root': {
            color: 'white',
        },
    },
};
const useStyles = makeStyles(style);

export const returnParsedValue = value => {
    try {
        return JSON.parse(value);
    } catch (e) {
        return value;
    }
};

export const isPrimitive = value => {
    return value !== Object(value);
};

export const tryParseJSONObjectOrArray = jsonString => {
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

const isError = value => {
    return (
        typeof value === 'string' &&
        (value.startsWith('[Error]') || value.startsWith('ERROR'))
    );
};

const ButtonEditCellWithDropdown = ({ polyglot, loading, handleChange }) => {
    const [isOpen, setOpen] = React.useState(false);
    const classes = useStyles();
    const anchorRef = React.useRef(null);

    const types = ['number', 'string', 'boolean', 'array', 'object'];
    return (
        <>
            <ButtonGroup
                variant="contained"
                ref={anchorRef}
                className={classes.containedButton}
            >
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleChange()}
                >
                    {loading ? (
                        <CircularProgress
                            size={20}
                            className={classes.icon}
                            color="white"
                        />
                    ) : (
                        <SaveIcon className={classes.icon} />
                    )}
                    {polyglot.t('save')}
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
                getContentAnchorEl={null}
                anchorEl={anchorRef.current}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                classes={{ paper: classes.menuPaper }}
            >
                {types.map(type => (
                    <MenuItem
                        key={type}
                        onClick={() => {
                            handleChange(type);
                            setOpen(false);
                        }}
                    >
                        {polyglot.t('save_as', {
                            type: type,
                        })}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};

ButtonEditCellWithDropdown.propTypes = {
    polyglot: polyglotPropTypes.isRequired,
    loading: PropTypes.bool.isRequired,
    handleChange: PropTypes.func.isRequired,
};

const ParsingEditCell = ({ cell, p: polyglot, setToggleDrawer }) => {
    const [loading, setLoading] = React.useState(false);
    const [value, setValue] = React.useState(cell.value);

    const classes = useStyles();

    const handleChange = async type => {
        setLoading(true);
        try {
            let valueToSave;
            try {
                valueToSave = getValueBySavingType(value, type, cell.value);
            } catch (e) {
                toast(polyglot.t(e.message), {
                    type: toast.TYPE.ERROR,
                    autoClose: false,
                });
                throw new Error(polyglot.t(e.message));
            }
            await datasetApi.updateDataset({
                uri: cell.row.uri,
                field: cell.field,
                value: valueToSave,
            });
            cell.row[cell.field] = valueToSave;
            toast(polyglot.t('dataset_edit_success'), {
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
                        color: '#f44336',
                        fontWeight: 'initial',
                    }}
                >
                    {polyglot.t('dataset_edit_enrichment_title', {
                        column_name: cell.field,
                        row_name: cell?.row?.uri || cell?.row?.ark,
                    })}
                </h2>
                <div className={classes.container}>{cell.value}</div>
            </div>
        );
    }

    return (
        <div>
            <h2 style={{ textAlign: 'center' }}>
                {polyglot.t('column')}{' '}
                <span style={{ color: colorsTheme.green.primary }}>
                    {cell.field}
                </span>{' '}
                {polyglot.t('for_row')}{' '}
                <span style={{ color: colorsTheme.orange.primary }}>
                    {cell?.row?.uri || cell?.row?.ark}
                </span>
            </h2>
            <div style={{ padding: '0 20px' }}>
                {isPrimitive(value) ? (
                    <Input
                        value={value}
                        onChange={e => setValue(e.target.value)}
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
                        onEdit={e => {
                            setValue(e.updated_src);
                        }}
                        onAdd={e => {
                            setValue(e.updated_src);
                        }}
                        onDelete={e => {
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
                    <Button
                        color="secondary"
                        key="cancel"
                        variant="text"
                        onClick={() => setToggleDrawer(false)}
                    >
                        {polyglot.t('cancel')}
                    </Button>
                    <ButtonEditCellWithDropdown
                        handleChange={handleChange}
                        loading={loading}
                        polyglot={polyglot}
                    />
                </Box>
            </div>
        </div>
    );
};

ParsingEditCell.propTypes = {
    cell: PropTypes.object.isRequired,
    p: polyglotPropTypes.isRequired,
    setToggleDrawer: PropTypes.func.isRequired,
};

export default translate(ParsingEditCell);
