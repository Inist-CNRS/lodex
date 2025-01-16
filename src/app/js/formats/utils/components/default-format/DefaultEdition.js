import React, { Component } from 'react';
import translate from 'redux-polyglot/translate';
import { change } from 'redux-form';
import get from 'lodash/get';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { Button } from '@mui/material';

import { formField as formFieldPropTypes } from '../../../../propTypes';
import FormTextField from '../../../../lib/components/FormTextField';

class DefaultEdition extends Component {
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
                        variant="contained"
                        className="convert-to-value"
                        color="primary"
                        onClick={this.convertValue}
                    >
                        {polyglot.t('convert_to_value')}
                    </Button>
                </div>
            );
        }

        return (
            <FormTextField
                variant="standard"
                {...this.props}
                value={currentValue}
            />
        );
    }
}

DefaultEdition.propTypes = formFieldPropTypes;

const mapDispatchToProps = {
    change,
};

export default compose(
    translate,
    connect(null, mapDispatchToProps),
)(DefaultEdition);
