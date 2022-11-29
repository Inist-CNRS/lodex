import React from 'react';
import translate from 'redux-polyglot/translate';
import PropTypes from 'prop-types';
import ReactJson from 'react-json-view';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { makeStyles } from '@material-ui/styles';

const style = {
    container: {
        background: '#272822',
        color: '#f8f8f2',
        margin: '0 10px',
        padding: '10px',
        borderRadius: '5px',
        minHeight: '100px',
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
    const classes = useStyles();
    const value = returnParsedValue(cell.value);
    if (isError(value)) {
        return (
            <div>
                <h2 style={{ textAlign: 'center' }}>
                    {polyglot.t('error_enrichment_drawer_title', {
                        column_name: 'ENRIC',
                        row_name: 'ROWcoucou',
                    })}
                </h2>
                <div className={classes.container}>{cell.value}</div>
            </div>
        );
    }

    return (
        <div>
            <h2 style={{ textAlign: 'center' }}>
                {polyglot.t('detail_cell_drawer_title', {
                    column_name: 'COUcou',
                    row_name: 'ROWcoucou',
                })}
            </h2>
            {isPrimitive(value) ? (
                <div className={classes.container}>{cell.value}</div>
            ) : (
                <ReactJson
                    src={JSON.parse(cell.value)}
                    theme="monokai"
                    enableClipboard={false}
                />
            )}
        </div>
    );
};

ParsingEditCell.propTypes = {
    cell: PropTypes.object.isRequired,
    p: polyglotPropTypes.isRequired,
};

export default translate(ParsingEditCell);
