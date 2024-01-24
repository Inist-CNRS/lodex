import React from 'react';
import translate from 'redux-polyglot/translate';
import PropTypes from 'prop-types';
import { polyglot as polyglotPropTypes } from '../../../../propTypes';
import { FormatDefaultParamsFieldSet } from '../../../utils/components/field-set/FormatFieldSets';
import { MenuItem, TextField } from '@mui/material';

export const defaultArgs = {
    type: 'text',
    label: '',
};

const MarkdownModalAdmin = props => {
    const { args, p, onChange } = props;
    const { type, label } = args;

    const handleType = event => {
        onChange({
            ...args,
            type: event.target.value,
        });
    };

    const handleLabel = event => {
        onChange({
            ...args,
            label: event.target.value,
        });
    };

    return (
        <FormatDefaultParamsFieldSet>
            <TextField
                fullWidth
                select
                label={p.t('label_format_select_type')}
                onChange={handleType}
                value={type}
            >
                <MenuItem value="text">{p.t('label_format_custom')}</MenuItem>
                <MenuItem value="column">
                    {p.t('label_format_another_column')}
                </MenuItem>
            </TextField>
            <TextField
                fullWidth
                label={
                    type === 'text'
                        ? p.t('label_format_custom_value')
                        : p.t('label_format_another_column_value')
                }
                onChange={handleLabel}
                value={label}
            />
        </FormatDefaultParamsFieldSet>
    );
};

MarkdownModalAdmin.propTypes = {
    args: PropTypes.shape({
        type: PropTypes.oneOf(['text', 'column']),
        label: PropTypes.string,
    }),
    onChange: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

MarkdownModalAdmin.defaultProps = {
    args: defaultArgs,
};

export default translate(MarkdownModalAdmin);
