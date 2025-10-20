import { Typography } from '@mui/material';
import { useField, useStore } from '@tanstack/react-form';
// @ts-expect-error TS6133
import React, { useEffect, useState } from 'react';
import AceEditor from 'react-ace';
import { useTranslate } from '../../../i18n/I18NContext';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-monokai';

interface ConfigFieldProps {
    form: object;
}

export const ConfigField = ({
    form
}: ConfigFieldProps) => {
    const { translate } = useTranslate();
    const field = useField({ name: 'config', form });
    const [json, setJson] = useState(
        field.state.value ? JSON.stringify(field.state.value, null, 2) : '',
    );

    useEffect(() => {
        if (field.state.value === 'invalid_json') {
            return;
        }
        setJson(
            field.state.value ? JSON.stringify(field.state.value, null, 2) : '',
        );
    }, [field.state.value]);

    // @ts-expect-error TS7006
    const onChange = (newJson) => {
        setJson(newJson);

        // we update the form value only when the json is valid
        // we flag the field as errored when it's not
        try {
            field.handleChange(newJson ? JSON.parse(newJson) : null);
        } catch (_) {
            field.handleChange('invalid_json');
        }
    };

    const error = useStore(field.store, (state) => {
        return state.meta.errors[0];
    });

    return (
        <>
            <AceEditor
                mode="json"
                onLoad={(editor) => {
                    // @ts-expect-error TS2339
                    editor.textInput.getElement().ariaLabel =
                        translate('config');
                }}
                fontSize={16}
                theme="monokai"
                showPrintMargin={false}
                wrapEnabled={true}
                showGutter={true}
                value={json}
                onChange={onChange}
                width="100%"
                setOptions={{
                    showLineNumbers: true,
                    tabSize: 2,
                }}
            />
            {error && <Typography color="error">{translate(error)}</Typography>}
        </>
    );
};
