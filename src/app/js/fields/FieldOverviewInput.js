import React from 'react';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { Field } from 'redux-form';
import MenuItem from 'material-ui/MenuItem';

import { polyglot as polyglotPropTypes } from '../propTypes';
import FormSelectField from '../lib/components/FormSelectField';

export const OverviewFieldComponent = ({ p: polyglot }) => {
    const fieldsName = ['none', 'title', 'description'];
    const fieldItems = fieldsName.map((field, index) => (
        <MenuItem
            className={field}
            key={field}
            value={index}
            primaryText={polyglot.t(field)}
        />
    ));

    return (
        <Field
            name="overview"
            component={FormSelectField}
            label={polyglot.t('overview')}
            className="field-overview"
            fullWidth
        >
            {fieldItems}
        </Field>
    );
};

OverviewFieldComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
};

export default compose(
    translate,
)(OverviewFieldComponent);
