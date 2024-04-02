import React, { useState } from 'react';
import AceEditor from 'react-ace';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import PropTypes from 'prop-types';
import { MenuItem, TextField } from '@mui/material';
import 'ace-builds/src-noconflict/mode-ini';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-monokai';

const FormSourceCodeField = ({
    input,
    label,
    p,
    dispatch,
    enableModeSelector = false,
    mode = 'ini',
    ...custom
}) => {
    const [currentMode, setCurrentMode] = useState(mode);

    const handleModeChange = (event) => {
        setCurrentMode(event.target.value);
    };

    return (
        <>
            {enableModeSelector ? (
                <TextField
                    style={{
                        width: '240px',
                        marginBottom: '12px',
                    }}
                    select
                    size="small"
                    label={p.t('form_source_code_mode')}
                    onChange={handleModeChange}
                    value={currentMode}
                >
                    {/* We don't show the ini syntax because it's only meant to be used with the EZS routine. */}
                    <MenuItem value="json">json</MenuItem>
                    <MenuItem value="json5">json5 (jsonl, jsonc)</MenuItem>
                    <MenuItem value="text">text</MenuItem>
                    <MenuItem value="xml">xml</MenuItem>
                </TextField>
            ) : null}
            <AceEditor
                mode={currentMode}
                theme="monokai"
                wrapEnabled={true}
                fontSize={14}
                value={input.value}
                onChange={input.onChange}
                showPrintMargin={false}
                {...custom}
                style={{
                    ...custom.style,
                    borderRadius: '5px',
                }}
            />
        </>
    );
};

FormSourceCodeField.propTypes = {
    input: PropTypes.shape({
        value: PropTypes.any.isRequired,
        onChange: PropTypes.func.isRequired,
    }).isRequired,
    p: polyglotPropTypes.isRequired,
    enableModeSelector: PropTypes.bool,
    mode: PropTypes.string,
    label: PropTypes.string,
    dispatch: PropTypes.any,
};

export default FormSourceCodeField;
