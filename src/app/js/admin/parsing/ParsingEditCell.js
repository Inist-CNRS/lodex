import React from 'react';
import translate from 'redux-polyglot/translate';
import PropTypes from 'prop-types';
import ReactJson from 'react-json-view';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { makeStyles } from '@material-ui/styles';
import { Save as SaveIcon } from '@material-ui/icons';
import datasetApi from '../api/dataset';
import { Button, CircularProgress, Input, Snackbar } from '@material-ui/core';
import classNames from 'classnames';
import { Alert } from '@material-ui/lab';

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
        marginTop: 30,
        float: 'right',
    },
    icon: {
        marginRight: 10,
    },
};
const useStyles = makeStyles(style);

const returnParsedValue = value => {
    try {
        return JSON.parse(value);
    } catch (e) {
        return value;
    }
};

const isPrimitive = value => {
    return value !== Object(value);
};

const isError = value => {
    return (
        typeof value === 'string' &&
        (value.startsWith('[Error]') || value.startsWith('ERROR'))
    );
};

const ParsingEditCell = ({ cell, p: polyglot }) => {
    const [loading, setLoading] = React.useState(false);
    const [value, setValue] = React.useState(returnParsedValue(cell.value));
    const [openAlert, setOpenAlert] = React.useState(false);

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenAlert(false);
    };

    const classes = useStyles();

    const handleChange = async () => {
        setLoading(true);
        try {
            await datasetApi.updateDataset({
                uri: cell.row.uri,
                field: cell.field,
                value: isPrimitive(value) ? value : JSON.stringify(value),
            });
            cell.row[cell.field] = isPrimitive(value)
                ? value
                : JSON.stringify(value);
            setOpenAlert(true);
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
                {polyglot.t('dataset_edit_title', {
                    column_name: cell.field,
                    row_name: cell?.row?.uri || cell?.row?.ark,
                })}
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
                        rows={1}
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
                        style={{
                            borderRadius: '5px',
                            maxHeight: '80vh',
                            overflow: 'auto',
                        }}
                    />
                )}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleChange}
                    className={classNames(
                        classes.containedButton,
                        'btn-save-edit-cell',
                    )}
                >
                    {loading ? (
                        <CircularProgress
                            color="white"
                            variant="indeterminate"
                            size={20}
                            marginRight={10}
                            className={classes.icon}
                        />
                    ) : (
                        <SaveIcon className={classes.icon} />
                    )}

                    {polyglot.t('save')}
                </Button>
                <Snackbar
                    open={openAlert}
                    autoHideDuration={6000}
                    onClose={handleCloseAlert}
                >
                    <Alert
                        onClose={handleCloseAlert}
                        severity="success"
                        sx={{ width: '100%' }}
                    >
                        {polyglot.t('dataset_edit_success')}
                    </Alert>
                </Snackbar>
            </div>
        </div>
    );
};

ParsingEditCell.propTypes = {
    cell: PropTypes.object.isRequired,
    p: polyglotPropTypes.isRequired,
};

export default translate(ParsingEditCell);
