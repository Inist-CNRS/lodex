import React from 'react';
import PropTypes from 'prop-types';
import {
    Switch,
    Button,
    TextField,
    FormControlLabel,
    Box,
} from '@mui/material';
import { translate } from '../../i18n/I18NContext';
// @ts-expect-error TS7016
import compose from 'recompose/compose';
// @ts-expect-error TS7016
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';
// @ts-expect-error TS7016
import { formValueSelector } from 'redux-form';
// @ts-expect-error TS7016
import get from 'lodash/get';

import { FIELD_FORM_NAME } from '..';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import ConcatField from './ConcatField';

export const UriConcatComponent = ({
    // @ts-expect-error TS7031
    handleSelect,
    // @ts-expect-error TS7031
    p: polyglot,
    // @ts-expect-error TS7031
    selected,
    // @ts-expect-error TS7031
    columns,
    // @ts-expect-error TS7031
    separator,
    // @ts-expect-error TS7031
    handleChange,
    // @ts-expect-error TS7031
    handleSeparatorChange,
    // @ts-expect-error TS7031
    handleAddColumn,
    // @ts-expect-error TS7031
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
                {/*
                 // @ts-expect-error TS7006 */}
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

// @ts-expect-error TS7006
const mapStateToProps = (state) => {
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
                    // @ts-expect-error TS7031
                    .map(({ value }) => value || '') || [],
            args: valueTransformer.args || [],
        };
    }

    return { selected: false, columns: [], separator: '' };
};

export default compose(
    connect(mapStateToProps),
    withHandlers({
        handleSelect:
            // @ts-expect-error TS7031
            ({ onChange }) =>
            () => {
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
        handleChange:
            // @ts-expect-error TS7031
            ({ onChange, args }) =>
            // @ts-expect-error TS7006
            (value, event, key, index) => {
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
        handleSeparatorChange:
            // @ts-expect-error TS7031
            ({ onChange, args }) =>
            // @ts-expect-error TS7006
            (event) => {
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
        // @ts-expect-error TS7031
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
        handleRemoveColumn:
            // @ts-expect-error TS7031
            ({ onChange, args }) =>
            // @ts-expect-error TS7006
            (index) => {
                onChange({
                    operation: 'CONCAT_URI',
                    args: [
                        ...args.slice(0, index + 1),
                        ...args.slice(index + 2),
                    ],
                });
            },
    }),
    translate,
)(UriConcatComponent);
