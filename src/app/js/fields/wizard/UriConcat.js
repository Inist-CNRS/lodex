import React from 'react';
import PropTypes from 'prop-types';
import {
    Switch,
    Button,
    TextField,
    FormControlLabel,
    Box,
} from '@mui/material';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import get from 'lodash/get';

import { FIELD_FORM_NAME } from '..';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import ConcatField from './ConcatField';

export const UriConcatComponent = ({
    handleSelect,
    p: polyglot,
    selected,
    columns,
    separator,
    handleChange,
    handleSeparatorChange,
    handleAddColumn,
    handleRemoveColumn,
}) => (
    <div>
        <FormControlLabel
            control={
                <Switch
                    className="radio_concat"
                    value="concat"
                    onClick={handleSelect}
                    checked={selected}
                />
            }
            label={polyglot.t('multi_field_concat')}
        />
        {selected && (
            <Box
                display="flex"
                flexDirection="column"
                gap={2}
                paddingLeft="40px"
                marginBottom={2}
            >
                <TextField
                    id="separator"
                    fullWidth
                    placeholder={polyglot.t('separator')}
                    onChange={handleSeparatorChange}
                    value={separator}
                />
                {columns.map((column, index) => (
                    <ConcatField
                        key={index}
                        index={index}
                        column={column}
                        removable={index > 1}
                        handleChange={handleChange}
                        handleRemoveColumn={handleRemoveColumn}
                    />
                ))}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddColumn}
                >
                    {polyglot.t('add_column')}
                </Button>
            </Box>
        )}
    </div>
);

UriConcatComponent.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.string),
    handleChange: PropTypes.func.isRequired,
    handleSelect: PropTypes.func.isRequired,
    handleAddColumn: PropTypes.func.isRequired,
    handleRemoveColumn: PropTypes.func.isRequired,
    handleSeparatorChange: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    selected: PropTypes.bool.isRequired,
    separator: PropTypes.string.isRequired,
};

UriConcatComponent.defaultProps = {
    columns: ['', ''],
    separator: '',
};

const mapStateToProps = state => {
    const transformers = formValueSelector(FIELD_FORM_NAME)(
        state,
        'transformers',
    );
    const valueTransformer =
        get(transformers, '[0].operation') === 'CONCAT_URI'
            ? transformers[0]
            : null;
    if (valueTransformer) {
        return {
            selected: true,
            separator: get(valueTransformer, 'args[0].value', ''),
            columns:
                get(valueTransformer, 'args', [])
                    .slice(1)
                    .map(({ value }) => value || '') || [],
            args: valueTransformer.args || [],
        };
    }

    return { selected: false, columns: [], separator: '' };
};

export default compose(
    connect(mapStateToProps),
    withHandlers({
        handleSelect: ({ onChange }) => () => {
            onChange({
                operation: 'CONCAT_URI',
                args: [
                    {
                        name: 'separator',
                        type: 'string',
                        value: '',
                    },
                    {
                        name: 'column',
                        type: 'column',
                        value: '',
                    },
                    {
                        name: 'column',
                        type: 'column',
                        value: '',
                    },
                ],
            });
        },
        handleChange: ({ onChange, args }) => (value, event, key, index) => {
            onChange({
                operation: 'CONCAT_URI',
                args: [
                    ...args.slice(0, index + 1),
                    {
                        name: 'column',
                        type: 'column',
                        value,
                    },
                    ...args.slice(index + 2),
                ],
            });
        },
        handleSeparatorChange: ({ onChange, args }) => event => {
            onChange({
                operation: 'CONCAT_URI',
                args: [
                    {
                        name: 'separator',
                        type: 'string',
                        value: event.target.value,
                    },
                    ...args.slice(1),
                ],
            });
        },
        handleAddColumn: ({ onChange, args }) => {
            onChange({
                operation: 'CONCAT_URI',
                args: [
                    ...args,
                    {
                        name: 'column',
                        type: 'column',
                        value: '',
                    },
                ],
            });
        },
        handleRemoveColumn: ({ onChange, args }) => index => {
            onChange({
                operation: 'CONCAT_URI',
                args: [...args.slice(0, index + 1), ...args.slice(index + 2)],
            });
        },
    }),
    translate,
)(UriConcatComponent);
