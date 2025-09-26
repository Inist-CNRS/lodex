import React, { Component } from 'react';
// @ts-expect-error TS7016
import { change } from 'redux-form';
import get from 'lodash/get';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { Button } from '@mui/material';

import { formField as formFieldPropTypes } from '../../../../propTypes';
import FormTextField from '../../../../lib/components/FormTextField';
import { translate } from '../../../../i18n/I18NContext';

class DefaultEdition extends Component {
    convertValue = () => {
        const {
            // @ts-expect-error TS2339
            change,
            // @ts-expect-error TS2339
            meta: { form },
            // @ts-expect-error TS2339
            input: { name, value },
        } = this.props;

        change(form, name, value.join(';'));
    };

    render() {
        // @ts-expect-error TS2339
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
            // @ts-expect-error TS2739
            <FormTextField
                variant="standard"
                {...this.props}
                value={currentValue}
            />
        );
    }
}

// @ts-expect-error TS2339
DefaultEdition.propTypes = formFieldPropTypes;

const mapDispatchToProps = {
    change,
};

export default compose(
    translate,
    connect(null, mapDispatchToProps),
    // @ts-expect-error TS2345
)(DefaultEdition);
