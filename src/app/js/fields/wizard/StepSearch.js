import React from 'react';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';

import Step from './Step';
import FieldIsSearchInput from '../FieldIsSearchableInput';
import FieldIsFacetInput from '../FieldIsFacetInput';
import { polyglot as polyglotPropTypes } from '../../propTypes';

export const StepSearchComponent = ({ searchable, searchValue, facetValue, p: polyglot, ...props }) => (
    <Step label="field_wizard_step_search" {...props}>
        <FieldIsSearchInput disabled={searchable} value={searchValue} />
        <FieldIsFacetInput disabled={searchable} value={facetValue} />
    </Step>
);

StepSearchComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
    searchable: React.PropTypes.bool.isRequired,
    searchValue: React.PropTypes.bool.isRequired,
    facetValue: React.PropTypes.bool.isRequired,
};

export default compose(
    translate,
)(StepSearchComponent);
