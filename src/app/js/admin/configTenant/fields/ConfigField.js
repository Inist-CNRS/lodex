import { Typography } from '@mui/material';
import { useField, useStore } from '@tanstack/react-form';
import React, { useEffect, useState } from 'react';
import AceEditor from 'react-ace';
import { useTranslate } from '../../../i18n/I18NContext';
import PropTypes from 'prop-types';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-monokai';

export const ConfigField = ({ form }) => {
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

ConfigField.propTypes = {
    form: PropTypes.object.isRequired,
};
