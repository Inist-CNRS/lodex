import React from 'react';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';

import Step from './Step';
import FieldIsSearchableInput from '../FieldIsSearchableInput';
import FieldIsFacetInput from '../FieldIsFacetInput';
import { polyglot as polyglotPropTypes } from '../../propTypes';

export const StepSearchComponent = ({ p: polyglot, ...props }) => (
    <Step label="field_wizard_step_search" {...props}>
        <FieldIsSearchableInput />
        <FieldIsFacetInput />
    </Step>
);

StepSearchComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
};

export default compose(
    translate,
)(StepSearchComponent);
