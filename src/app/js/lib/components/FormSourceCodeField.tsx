import { useState, type CSSProperties } from 'react';
import AceEditor from 'react-ace';
import { MenuItem, TextField } from '@mui/material';
import 'ace-builds/src-noconflict/mode-ini';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-ejs';
import 'ace-builds/src-noconflict/theme-monokai';

const FormSourceCodeField = ({
    input,
    label,
    p,
    enableModeSelector = false,
    mode = 'ini',
    ...custom
}: {
    input: { value: string; onChange: (value: string) => void };
    label?: string;
    p: { t: (key: string) => string };
    enableModeSelector?: boolean;
    mode?: string;
    style?: CSSProperties;
    [key: string]: unknown;
}) => {
    const [currentMode, setCurrentMode] = useState(mode);

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
                    onChange={(event) => {
                        setCurrentMode(event.target.value);
                    }}
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

export default FormSourceCodeField;
