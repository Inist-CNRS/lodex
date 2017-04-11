import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { Field } from 'redux-form';
import MenuItem from 'material-ui/MenuItem';

import Step from './Step';
import FormSelectField from '../../../lib/FormSelectField';
import { polyglot as polyglotPropTypes, field as fieldPropTypes } from '../../../propTypes';
import StepSemanticsComposition from './StepSemanticsComposition';

const styles = {
    complete: {
        paddingLeft: '40px',
    },
    header: {
        paddingLeft: 0,
    },
};

export const StepIdentityComponent = ({
    field,
    fields,
    p: polyglot,
    ...props
}) => {
    const otherFieldsMenuItems = fields.map(f => (
        <MenuItem
            className={`completes_${f.label.toLowerCase().replace(/\s/g, '_')}`}
            key={f.name}
            value={f.name}
            primaryText={f.label}
        />
    ));

    return (
        <Step label="field_wizard_step_semantic" {...props}>
            <div style={styles.header}>{polyglot.t('annotate_field')}</div>
            <Field
                style={styles.complete}
                className="completes"
                name="completes"
                component={FormSelectField}
                hint={polyglot.t('select_a_column')}
                fullWidth
            >
                <MenuItem value={null} primaryText={polyglot.t('completes_field_none')} />
                {otherFieldsMenuItems}
            </Field>
            <StepSemanticsComposition field={field} fields={fields} />
        </Step>
    );
};

StepIdentityComponent.propTypes = {
    field: fieldPropTypes.isRequired,
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    p: polyglotPropTypes.isRequired,
};

export default compose(
    translate,
)(StepIdentityComponent);
