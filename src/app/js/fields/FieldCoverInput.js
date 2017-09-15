import React from 'react';
import { Field } from 'redux-form';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import MenuItem from 'material-ui/MenuItem';
import FormSelectField from '../lib/components/FormSelectField';
import { polyglot as polyglotPropTypes } from '../propTypes';

const FieldCoverInput = ({ p: polyglot }) => (
    <Field
        name="cover"
        component={FormSelectField}
        label={polyglot.t('select_cover')}
        fullWidth
    >
        <MenuItem value="dataset" primaryText={polyglot.t('cover_dataset')} />
        <MenuItem value="collection" primaryText={polyglot.t('cover_collection')} />
    </Field>
);

FieldCoverInput.propTypes = {
    p: polyglotPropTypes.isRequired,
};

export default compose(
    translate,
)(FieldCoverInput);
