import React, { Component } from 'react';
import translate from 'redux-polyglot/translate';

import { formField as formFieldPropTypes } from '../../propTypes';
import FormTextField from '../../lib/components/FormTextField';

class DefaultEditon extends Component {
    onchangeArray = (_, value) =>
        this.props.input.onChange(_, value.split(','));

    render() {
        const { input: { value }, label, p: polyglot } = this.props;
        if (Array.isArray(value)) {
            return <p>{polyglot.t('bad_format', { label })}</p>;
        }
        return <FormTextField {...this.props} />;
    }
}

DefaultEditon.propTypes = formFieldPropTypes;

export default translate(DefaultEditon);
