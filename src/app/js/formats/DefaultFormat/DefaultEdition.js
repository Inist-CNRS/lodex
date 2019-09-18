import React, { Component } from 'react';
import translate from 'redux-polyglot/translate';
import { change } from 'redux-form';
import get from 'lodash.get';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { Button } from '@material-ui/core';

import { formField as formFieldPropTypes } from '../../propTypes';
import FormTextField from '../../lib/components/FormTextField';

class DefaultEditon extends Component {
    convertValue = () => {
        const {
            change,
            meta: { form },
            input: { name, value },
        } = this.props;
        change(form, name, value.join(';'));
    };
    render() {
        const { input, value, label, p: polyglot } = this.props;
        const currentValue = get(input, 'value', value);
        if (Array.isArray(currentValue)) {
            return (
                <div>
                    <p>{polyglot.t('bad_format_edit_value', { label })}</p>
                    <Button
                        className="convert-to-value"
                        primary
                        variant="contained"
                        label={polyglot.t('convert_to_value')}
                        onClick={this.convertValue}
                    />
                </div>
            );
        }
        return <FormTextField {...this.props} value={currentValue} />;
    }
}

DefaultEditon.propTypes = formFieldPropTypes;

const mapDispatchToProps = {
    change,
};

export default compose(
    translate,
    connect(
        null,
        mapDispatchToProps,
    ),
)(DefaultEditon);
