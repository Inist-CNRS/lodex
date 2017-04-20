import React from 'react';
import translate from 'redux-polyglot/translate';
import { Field } from 'redux-form';

import FormatEdition from '../../formats/FormatEdition';
import { polyglot as polyglotPropTypes } from '../../propTypes';

export const FieldFormatInputComponent = ({ p: polyglot }) => (
    <Field
        name="format"
        component={FormatEdition}
        label={polyglot.t('format')}
    />
);

FieldFormatInputComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
};

export default translate(FieldFormatInputComponent);

