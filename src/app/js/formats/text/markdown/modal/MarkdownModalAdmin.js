import React from 'react';
import translate from 'redux-polyglot/translate';
import PropTypes from 'prop-types';
import { polyglot as polyglotPropTypes } from '../../../../propTypes';
import { FormatDefaultParamsFieldSet } from '../../../utils/components/field-set/FormatFieldSets';
import TextField from '@mui/material/TextField';
import FormatGroupedFieldSet from '../../../utils/components/field-set/FormatGroupedFieldSet';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

export const defaultArgs = {
    type: 'text',
    label: '',
    fullScreen: false,
    maxWidth: 'sm',
};

const MarkdownModalAdmin = (props) => {
    const { args, p, onChange } = props;
    const { type, label, fullScreen, maxWidth } = args;

    const handleType = (event) => {
        onChange({
            ...args,
            type: event.target.value,
        });
    };

    const handleLabel = (event) => {
        onChange({
            ...args,
            label: event.target.value,
        });
    };

    const handleFullScreen = (_, newFullScreen) => {
        onChange({
            ...args,
            fullScreen: newFullScreen,
        });
    };

    const handleSize = (event) => {
        onChange({
            ...args,
            maxWidth: event.target.value,
        });
    };

    return (
        <FormatGroupedFieldSet>
            <FormatDefaultParamsFieldSet defaultExpanded>
                <TextField
                    fullWidth
                    select
                    label={p.t('label_format_select_type')}
                    onChange={handleType}
                    value={type}
                >
                    <MenuItem value="text">
                        {p.t('label_format_custom')}
                    </MenuItem>
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
                <FormControlLabel
                    control={
                        <Switch
                            checked={fullScreen}
                            onChange={handleFullScreen}
                        />
                    }
                    label={p.t('label_format_fullscreen')}
                />
                {!fullScreen ? (
                    <TextField
                        fullWidth
                        select
                        label={p.t('label_format_size')}
                        onChange={handleSize}
                        value={maxWidth}
                    >
                        <MenuItem value="xs">xs</MenuItem>
                        <MenuItem value="sm">sm</MenuItem>
                        <MenuItem value="md">md</MenuItem>
                        <MenuItem value="lg">lg</MenuItem>
                        <MenuItem value="xl">xl</MenuItem>
                    </TextField>
                ) : null}
            </FormatDefaultParamsFieldSet>
        </FormatGroupedFieldSet>
    );
};

MarkdownModalAdmin.propTypes = {
    args: PropTypes.shape({
        type: PropTypes.oneOf(['text', 'column']),
        label: PropTypes.string,
        fullScreen: PropTypes.bool,
        maxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
    }),
    onChange: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

MarkdownModalAdmin.defaultProps = {
    args: defaultArgs,
};

export default translate(MarkdownModalAdmin);
