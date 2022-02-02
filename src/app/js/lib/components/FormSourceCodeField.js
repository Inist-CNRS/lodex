import React from 'react';
import AceEditor from 'react-ace';
import { formField as formFieldPropTypes } from '../../propTypes';
import 'ace-builds/src-noconflict/mode-ini';
import 'ace-builds/src-noconflict/theme-github';

const FormSourceCodeField = ({ input, label, p, dispatch }) => {
    return (
        <AceEditor
            mode="ini"
            theme="github"
            value={input.value}
            onChange={input.onChange}
        />
    );
};

FormSourceCodeField.propTypes = formFieldPropTypes;

export default FormSourceCodeField;
