import React from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-ini';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-ejs';
import 'ace-builds/src-noconflict/theme-monokai';

type SourceCodeFieldProps = {
    input: {
        value: string;
        onChange: (value: string) => void;
    };
    label?: string;
    dispatch?: any;
    mode?: string;
    style?: React.CSSProperties;
    width?: string;
    height?: string;
};

export const SourceCodeField = ({
    input,
    label,
    dispatch,
    mode = 'ini',
    ...custom
}: SourceCodeFieldProps) => (
    <AceEditor
        mode={mode}
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
);

export default SourceCodeField;
