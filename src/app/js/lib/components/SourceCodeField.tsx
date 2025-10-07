import React, { useState, type ChangeEvent } from 'react';
import AceEditor from 'react-ace';
import { MenuItem, TextField } from '@mui/material';
import 'ace-builds/src-noconflict/mode-ini';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-ejs';
import 'ace-builds/src-noconflict/theme-monokai';
import { useTranslate } from '../../i18n/I18NContext';

type SourceCodeFieldProps = {
    input: {
        value: string;
        onChange: (value: string) => void;
    };
    label?: string;
    dispatch?: any;
    enableModeSelector?: boolean;
    mode?: string;
    style?: React.CSSProperties;
    width?: string;
    height?: string;
};

export const SourceCodeField = ({
    input,
    label,
    dispatch,
    enableModeSelector = false,
    mode = 'ini',
    ...custom
}: SourceCodeFieldProps) => {
    const { translate } = useTranslate();
    const [currentMode, setCurrentMode] = useState(mode);

    const handleModeChange = (event: ChangeEvent<HTMLInputElement>) => {
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
                    label={translate('form_source_code_mode')}
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

export default SourceCodeField;
