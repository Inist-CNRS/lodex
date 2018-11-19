import React, { Component } from 'react';
import translate from 'redux-polyglot/translate';
import { change } from 'redux-form';

import { formField as formFieldPropTypes } from '../../propTypes';
import FormTextField from '../../lib/components/FormTextField';
import RaisedButton from 'material-ui/RaisedButton';

class DefaultEditon extends Component {
    convertValue = () => {
        const {
            dispatch,
            meta: { form },
            input: { name, value },
        } = this.props;
        dispatch(change(form, name, value.join(';')));
    };
    render() {
        const {
            input: { value },
            label,
            p: polyglot,
        } = this.props;
        if (Array.isArray(value)) {
            return (
                <div>
                    <p>{polyglot.t('bad_format_edit_value', { label })}</p>
                    <RaisedButton
                        primary
                        label={polyglot.t('convert_to_value')}
                        onClick={this.convertValue}
                    />
                </div>
            );
        }
        return <FormTextField {...this.props} />;
    }
}

DefaultEditon.propTypes = formFieldPropTypes;

export default translate(DefaultEditon);
